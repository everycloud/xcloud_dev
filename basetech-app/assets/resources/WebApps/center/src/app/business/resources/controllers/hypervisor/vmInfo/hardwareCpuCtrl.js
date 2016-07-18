/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, Exception) {
    "use strict";

    var cpuCtrl = ["$scope", "$stateParams", "$compile", "camel","validator", function ($scope, $stateParams, $compile, camel,validator) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmId = $stateParams.vmId;
        var maxCpuNum = 64;

        //cpu内核数下拉框
        $scope.cpuCoreSelector = {
            "id": "cpuCoreSelector",
            "width": "135",
            "height": "200",
            "label": ($scope.i18n.common_term_vcpuNum_label || "vCpu个数") + ":",
            "values": [ ],
            change: function () {
                $scope.coreNum = parseInt($("#" + $scope.cpuCoreSelector.id).widget().getSelectedId(),10);
                setSlotSelector($scope.coreNum, $scope.coreNum, $scope.socketLimit);
                var maxValue = $scope.coreNum * 2500;
                $("#" + $scope.cpuReserveSpinner.id).widget().option("max", maxValue);
                $("#" + $scope.cpuLimitSpinner.id).widget().option("max", maxValue);
                changeWeight();
            }
        };
        //插槽下拉框
        $scope.slotSelector = {
            "label": ($scope.i18n.vm_term_vCPUnumPerSlot_label || "每个插槽的内核数") + ":",
            "require": false,
            "id": "slotSelector",
            "width": "135px",
            "values": [
            ],
            "change": function () {
                var cpuNum = parseInt($("#" + $scope.cpuCoreSelector.id).widget().getSelectedId(),10);
                var result = parseInt($("#" + $scope.slotSelector.id).widget().getSelectedId(),10);
                $scope.slotNum = (cpuNum % result === 0) ? parseInt(cpuNum / result,10) : parseInt(cpuNum / result + 1,10);
            }
        };
        //CPU限制微调框
        $scope.cpuLimitSpinner = {
            id: "cpuLimitSpinner",
            label: ($scope.i18n.common_term_limitMHz_label || "限制(MHz)") + ":",
            value: "0",
            "max": "2500",
            "min": "0",
            "change": function () {
                var cpuLimit =  $("#" + $scope.cpuLimitSpinner.id).widget().option("value");
                if(($scope.vmType === "fusioncompute" && cpuLimit == 0)||($scope.vmType === "vmware" && cpuLimit == -1)){
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("max", $scope.coreNum * 2500);
                }
                else{
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("max", cpuLimit);
                }
            }
        };
        //CPU预留微调框
        $scope.cpuReserveSpinner = {
            id: "cpuReserveSpinner",
            label: ($scope.i18n.perform_term_reservedCapacityMHz_label || "预留(MHz)") + ":",
            value: "0",
            "max": "2500",
            "min": "0",
            "change": function () {
            }
        };
        //cpu份额下拉框
        $scope.cpuWeightSelector = {
            "id": "cpuWeightSelector",
            label: ($scope.i18n.common_term_qouta_label || "份额") + ":",
            "width": "135",
            "values": [
                {
                    "selectId": "2000",
                    "label": $scope.i18n.common_term_high_label || "高"
                },
                {
                    "selectId": "1000",
                    "label": $scope.i18n.common_term_middling_label || "中",
                    "checked": true
                },
                {
                    "selectId": "500",
                    "label": $scope.i18n.common_term_low_label || "低"
                },
                {
                    "selectId": "-1",
                    "label": $scope.i18n.common_term_custom_label || "自定义"
                }
            ],
            "change": function () {
                changeWeight();
            }
        };
        //cpu份额输入框
        $scope.cpuWeightTextbox = {
            "id": "cpuWeightTextbox",
            "value": "1000",
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";integer:" + $scope.i18n.common_term_integer_valid +
                ";maxValue(128000):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 128000}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 128000}),
            "change": function () {
                var value = $("#" + $scope.cpuWeightTextbox.id).widget().getValue();
                if (value == $scope.coreNum * 2000) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("2000");
                }
                else if (value == $scope.coreNum * 1000) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("1000");
                }
                else if (value == $scope.coreNum * 500) {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("500");
                }
                else {
                    $("#" + $scope.cpuWeightSelector.id).widget().opChecked("-1");
                }
            }
        };
        //cpu确定按钮
        $scope.cpuOkButton = {
            "id": "hardwareCpuButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#hardwareCpuDiv"));
                if (!result) {
                    return;
                }
                editCpu();
            }
        };
        function setCoreSelector(coreNum, coreLimit) {
            var values = [];
            for (var i = 1; i <= coreLimit; i++) {
                var option = {
                    "selectId": i,
                    "label": i
                };
                if (i == coreNum) {
                    option.checked = true;
                }
                values.push(option);
            }
            $("#" + $scope.cpuCoreSelector.id).widget().option("values", values);
        }

        function setSlotSelector(cpuNum, coresPerSocket, socketLimit) {
            var values = [];
            for (var i = 1; i <= cpuNum; i++) {
                if (cpuNum % i === 0 && cpuNum / i <= socketLimit) {
                    var option = {
                        "selectId": i,
                        "label": i
                    };
                    if (i == coresPerSocket) {
                        option.checked = true;
                    }
                    values.push(option);
                }
            }
            $("#" + $scope.slotSelector.id).widget().option("values", values);
            $scope.slotNum = (cpuNum % coresPerSocket === 0) ? parseInt(cpuNum / coresPerSocket,10) : parseInt(cpuNum / coresPerSocket + 1,10);
        }

        function changeWeight() {
            var result = $("#" + $scope.cpuWeightSelector.id).widget().getSelectedId();
            if (result === "2000") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", $scope.coreNum * 2000);
            }
            else if (result === "1000") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", $scope.coreNum * 1000);
            }
            else if (result === "500") {
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", $scope.coreNum * 500);
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
                $scope.hypervisorId = vmInfo.hypervisorId;
                $scope.clusterUrn = vmInfo.clusterUrn;
                var osInfo = vmInfo && vmInfo.os;
                $scope.osVersion = osInfo.osVersion;
                $scope.osType = osInfo.osType;
                var cpuInfo = vmInfo.vmRebootConfig.cpu;
                $scope.coreNum = parseInt(cpuInfo.quantity,10);
                $scope.coresPerSocket = cpuInfo.coresPerSocket ? parseInt(cpuInfo.coresPerSocket,10) : $scope.coreNum;
                $scope.coreLimit = 0;
                vmInfo.cpuQosMap = vmInfo.cpuQosMap || [];
                //主机CPU核数限制
                for (var cpu in vmInfo.cpuQosMap) {
                    $scope.coreLimit++;
                }
                //虚拟化环境限制
                $scope.coreLimit = maxCpuNum < $scope.coreLimit ? maxCpuNum : $scope.coreLimit;
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    var coreBefore = parseInt(vmInfo.vmConfig.cpu.quantity,10);
                    if ($scope.coreNum == coreBefore) {
                        $scope.hardwareTable.data[0].summary = $scope.coreNum + ($scope.i18n.common_term_entry_label || "个");
                    }
                    else {
                        $scope.hardwareTable.data[0].summary = $scope.coreNum + ($scope.i18n.common_term_entry_label || "个") + "(" + ($scope.i18n.common_term_noEffect_value || "未生效" ) + ")";
                    }
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                var maxLimit = $scope.coreNum * 2500;
                $("#" + $scope.cpuLimitSpinner.id).widget().option("max", maxLimit);
                if(vmInfo.vmType === "vmware"){
                    $("#" + $scope.cpuLimitSpinner.id).widget().option("min", -1);
                }
                $("#" + $scope.cpuLimitSpinner.id).widget().option("value", cpuInfo.limit);
                if((vmInfo.vmType === "fusioncompute" && cpuInfo.limit == 0)||(vmInfo.vmType === "vmware" && cpuInfo.limit == -1)){
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("max", maxLimit);
                }
                else{
                    $("#" + $scope.cpuReserveSpinner.id).widget().option("max", cpuInfo.limit);
                }
                $("#" + $scope.cpuReserveSpinner.id).widget().option("value", cpuInfo.reservation);
                $("#" + $scope.cpuWeightTextbox.id).widget().option("value", cpuInfo.weight);
                $("#" + $scope.cpuWeightSelector.id).widget().opChecked(cpuInfo.level);
                if (vmInfo.vmType === "vmware" && cpuInfo.cpuHotPlug == 0 && vmInfo.status === "running") {
                    $("#" + $scope.cpuCoreSelector.id).widget().option("disable", true);
                    $("#" + $scope.slotSelector.id).widget().option("disable", true);
                }
                $scope.$apply(function () {
                    $scope.vmType = vmInfo.vmType;
                    $scope.slotNum = ( $scope.coreNum % $scope.coresPerSocket === 0) ? parseInt($scope.coreNum / $scope.coresPerSocket) : parseInt($scope.coreNum / $scope.coresPerSocket + 1);
                });
                getCoreLimit();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getCoreLimit() {
            var params = {
                "listSupportedOsInfo": {
                    "resourceClusterId": $scope.hypervisorId + "$" + $scope.clusterUrn,
                    "hypervisorId": $scope.hypervisorId,
                    "osVersion": $scope.osVersion
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var osInfo = data && data.listSupportedOsInfo && data.listSupportedOsInfo.osInfos &&
                    data.listSupportedOsInfo.osInfos[$scope.osType] && data.listSupportedOsInfo.osInfos[$scope.osType][0];
                //操作系统限制
                $scope.coreLimit = (osInfo.cpuSocketLimit && osInfo.cpuQuantityLimit < $scope.coreLimit) ? osInfo.cpuQuantityLimit : $scope.coreLimit;
                $scope.socketLimit = osInfo.cpuSocketLimit ? osInfo.cpuSocketLimit : 1;
                setCoreSelector($scope.coreNum, $scope.coreLimit);
                setSlotSelector($scope.coreNum, $scope.coresPerSocket, $scope.socketLimit);
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function editCpu() {
            var params = {
                "spec": {
                    "cpu": {
                        quantity: $("#" + $scope.cpuCoreSelector.id).widget().getSelectedId(),
                        coresPerSocket: $("#" + $scope.slotSelector.id).widget().getSelectedId(),
                        reservation: $("#" + $scope.cpuReserveSpinner.id).widget().option("value"),
                        weight: $("#" + $scope.cpuWeightTextbox.id).widget().getValue(),
                        level: $("#" + $scope.cpuWeightSelector.id).widget().getSelectedId(),
                        limit: $("#" + $scope.cpuLimitSpinner.id).widget().option("value")
                    }
                }
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var options = {
                    type: "prompt",
                    content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                    height: "150px",
                    width: "350px",
                    modal: true
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
    return cpuCtrl;
});
