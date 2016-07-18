/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"
], function ($, angular, UnifyValid,Window,Message, Exception) {
    "use strict";

    var memoryCtrl = ["$scope", "$stateParams", "$compile", "camel","validator", function ($scope, $stateParams, $compile, camel,validator) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmName = $stateParams.name;

        //内存大小输入框
        $scope.memorySizeTextbox = {
            "id": "memorySizeTextbox",
            "value": "",
            "label":$scope.i18n.common_term_sizeMB_label+":",
            "validate":"required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";integer:" + $scope.i18n.common_term_integer_valid + ";minValue(128):" + $scope.i18n.sprintf($scope.i18n.common_term_greater_valid,{1:128}) +
                ";maxValue(1048576):" + $scope.i18n.sprintf($scope.i18n.common_term_smallerOrEqual_valid,{1:1048576}),
            require:true,
            change:function(){
                $scope.memorySize = parseInt($("#" + $scope.memorySizeTextbox.id).widget().getValue(),10);
                $("#" + $scope.memoryReserveSpinner.id).widget().option("max",$scope.memorySize);
                changeWeight();
            }
        };
        //内存预留微调框
        $scope.memoryReserveSpinner = {
            id: "memoryReserveSpinner",
            value: "500",
            "max": "1024",
            "min": "0",
            label: ($scope.i18n.perform_term_reservedCapacityMB_label || "预留(MB)") + ":"
        };
        //内存份额下拉框
        $scope.memoryWeightSelector = {
            "id": "memoryWeightSelector",
            "width": "135",
            label: ($scope.i18n.common_term_qouta_label || "份额") + ":",
            "values": [
                {
                    "selectId": "20",
                    "label": $scope.i18n.common_term_high_label ||"高"
                },
                {
                    "selectId": "10",
                    "label": $scope.i18n.common_term_middling_label ||"中",
                    "checked":true
                },
                {
                    "selectId": "5",
                    "label": $scope.i18n.common_term_low_label ||"低"
                },
                {
                    "selectId": "-1",
                    "label": $scope.i18n.common_term_custom_label ||"自定义"
                }
            ],
            "change": function () {
                changeWeight();
            }
        };
        //内存份额输入框
        $scope.memoryWeightTextbox = {
            "id": "memoryWeightTextbox",
            "value": "5120",
            "validate":"required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";integer:" + $scope.i18n.common_term_integer_valid +
                ";maxValue(20971520):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 20971520}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 20971520}),
            "change":function(){
                var value = $("#"+$scope.memoryWeightTextbox.id).widget().getValue();
                if(value == $scope.memorySize * 20){
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("20");
                }
                else if(value == $scope.memorySize * 10){
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("10");
                }
                else if(value == $scope.memorySize * 5){
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("5");
                }
                else{
                    $("#" + $scope.memoryWeightSelector.id).widget().opChecked("-1");
                }
            }
        };
        //内存确定按钮
        $scope.memoryOkButton = {
            "id": "hardwareMemoryButton",
            "text": $scope.i18n.common_term_ok_button,
            "click":function(){
                var result = UnifyValid.FormValid($("#hardwareMemoryDiv"));
                if (!result) {
                    return;
                }
                editMemory();
            }
        };

        function changeWeight(){
            var result = $("#" + $scope.memoryWeightSelector.id).widget().getSelectedId();
            if (result === "20") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", $scope.memorySize * 20);
            }
            else if (result === "10") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", $scope.memorySize * 10);
            }
            else if (result === "5") {
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value", $scope.memorySize * 5);
            }
        }
        function getData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                var memoryInfo = vmInfo.vmRebootConfig.memory;
                $scope.memorySize = parseInt(memoryInfo.quantityMB);
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    var memoryBefore = vmInfo.vmConfig.memory.quantityMB;
                    if($scope.memorySize == memoryBefore){
                        $scope.hardwareTable.data[1].summary = $scope.memorySize + "MB";
                    }
                    else{
                        $scope.hardwareTable.data[1].summary = $scope.memorySize + "MB("+($scope.i18n.common_term_noEffect_value || "未生效" )+")";
                    }
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                $("#" + $scope.memorySizeTextbox.id).widget().option("value",$scope.memorySize);
                $("#" + $scope.memoryReserveSpinner.id).widget().option("max",$scope.memorySize);
                $("#" + $scope.memoryReserveSpinner.id).widget().option("value",memoryInfo.reservation);
                $("#" + $scope.memoryWeightTextbox.id).widget().option("value",memoryInfo.weight);
                $("#" + $scope.memoryWeightSelector.id).widget().opChecked(memoryInfo.level);
                if(vmInfo.vmType === "vmware" && memoryInfo.memHotPlug == 0 && vmInfo.status==="running"){
                    $("#" + $scope.memorySizeTextbox.id).widget().option("disable",true);
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function editMemory() {
            var params = {
                "spec": {
                    "memory": {
                        quantityMB:$("#" + $scope.memorySizeTextbox.id).widget().getValue(),
                        reservation:$("#" + $scope.memoryReserveSpinner.id).widget().option("value"),
                        weight:$("#" + $scope.memoryWeightTextbox.id).widget().getValue(),
                        level:$("#" + $scope.memoryWeightSelector.id).widget().getSelectedId(),
                        limit:$("#" + $scope.memorySizeTextbox.id).widget().getValue()
                    }
                }
            };
            var deferred = camel.put({
                "url": {s:"/goku/rest/v1.5/irm/1/vms/{id}",o:{id:$scope.vmId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var options = {
                    type: "prompt",
                    content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                    height: "150px",
                    width: "350px",
                    modal :true
                };
                var msg = new Message(options);
                msg.show();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getData();
    }];
    return memoryCtrl;
});
