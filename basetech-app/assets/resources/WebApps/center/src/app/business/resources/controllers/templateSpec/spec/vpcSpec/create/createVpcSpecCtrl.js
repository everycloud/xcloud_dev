/**
 * 创建VPC规格
 */
define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService',
    'app/services/competitionConfig',
    'fixtures/templateDefineFixture'],
    function ($, angular, httpService, UnifyValid, constants, Exception,competitionConfig) {
        "use strict";

        var createVpcSpecCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            var exceptionService = new Exception();
            //SFR场景
            $scope.vmwareICT = competitionConfig.isBaseOnVmware;
            $scope.user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.openstack = ($scope.user.cloudType === "OPENSTACK" ? true : false);

            // 扩展UnifyValid
            UnifyValid.checkVpcSpecName = function () {
                var value = $(this).val();
                if(!/^[\w\-\u4E00-\u9FA5]{1,64}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            /**
             * 带宽校验
             *
             * @param param
             * @returns {boolean}
             */
            UnifyValid.checkBand = function () {
                var value = jQuery.trim($(this).val());
                if (value == "") {
                    return true;
                }

                if(!/^\d*$/.test(value)) {
                    return false;
                }

                if (parseInt(value, 10) > 4000 || parseInt(value, 10) < 1) {
                    return false;
                }

                return true;
            };

            $scope.model = {
                "name": "",

                "maxPublicIpNum": "",

                "priority": "",
                "maxNetworkBandWidth": "",
                "maxTxThroughput": "",
                "maxRxThroughput": "",
                "maxVCPUNum":"",
                "maxMemoryCapacity":"",
                "maxVMNum":"",
                "maxStorageCapacity":""
            };

            $scope.name = {
                label:  ($scope.i18n.common_term_name_label || "名称") + ":",
                require: true,
                "id": "createVpcSpecName",
                "tooltip":($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。") +
                    ($scope.i18n.common_term_composition3_valid ||  "可以是中文、英文字母、数字、符号包括_-"),
                "extendFunction" : ["checkVpcSpecName"],
                "validate":"required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";checkVpcSpecName():" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符") +
                    ($scope.i18n.common_term_composition3_valid ||  "可以是中文、英文字母、数字、符号包括_-"),
                "width": "200",
                "value":$scope.model.name
            };

            $scope.maxNetworkNum = {
                label: ($scope.i18n.spec_term_routerOrInnerNetMaxNum_label || "最大路由/内部网络数") + ":",
                require: true,
                "id": "maxNetworkNum",
                "value": "",
                "width": "200",
                "display":false,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";maxValue(200):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" )
            };
            $scope.maxDirectNetworkNum = {
                label: ($scope.i18n.spec_term_directNetMaxNum_label || "最大直连网络个数") + ":",
                require: true,
                "id": "maxDirectNetworkNum",
                "value": "",
                "width": "200",
                "display":!$scope.openstack,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";maxValue(200):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" )
            };
            $scope.maxRoutedNetworkNum = {
                label: ($scope.i18n.spec_term_routerNetMaxNum_label || "最大路由网络数") + ":",
                require: true,
                "id": "maxRoutedNetworkNum",
                "value": "",
                "width": "200",
                "display":!$scope.openstack,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";maxValue(200):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" )
            };
            $scope.maxInternalNetworkNum = {
                label: ($scope.i18n.spec_term_innerNetMaxNum_label || "最大路由网络数") + ":",
                require: true,
                "id": "maxInternalNetworkNum",
                "value": "",
                "width": "200",
                "display":!$scope.openstack,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";maxValue(200):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" )
            };

            $scope.maxPublicIpNum = {
                label: ($scope.i18n.spec_term_eipMaxNum_label || "最大弹性IP数") + ":",
                require: true,
                "id": "maxPublicIpNum",
                "value": "",
                "width": "200",
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" ) +
                    ";maxValue(200):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 200) || "范围为1-200" )
            };

            $scope.defaultBand = {
                label: ($scope.i18n.vpc_term_defaultBandMbps_label || "默认带宽(Mbps)") + ":",
                require: true,
                "id": "defaultBand",
                "value": "",
                "width": "200",
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 10000) || "范围为1-10000" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 10000) || "范围为1-10000" ) +
                    ";maxValue(10000):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 10000) || "范围为1-10000" )
            };

            $scope.maxSecurityGroupNum = {
                label: ($scope.i18n.template_term_securityGroupMaxNum_label || "最大安全组个数") + ":",
                require: true,
                "id": "maxSecurityGroupNum",
                "value": "",
                "width": "200",
                "display":false,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, '0', 500) || "范围为0-500" ) +
                    ";minValue(0):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, '0', 500) || "范围为0-500" ) +
                    ";maxValue(500):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, '0', 500) || "范围为0-500" )
            };

            $scope.maxVCPUNum = {
                label: ($scope.i18n.template_term_vCPUMaxNum_label || "最大虚拟CPU核数") + ":",
                require: false,
                "id": "maxVCPUNum",
                "value": "",
                "width": "200",
                "display":false,
                "disable":true,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";maxValue(2147483647):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" )
            };
            $scope.maxVCPUNumCheckBox = {
                label: "",
                require: false,
                "id": "maxVCPUNumCheckBox",
                "width": "200",
                "height": "30",
                "value":"yes",
                "text": $scope.i18n.template_term_vCPUMaxNum_label || "最大虚拟CPU核数",
                "checked":false,
                "change":function() {
                    if ($("#"+$scope.maxVCPUNumCheckBox.id).widget().option("checked")) {
                        $("#"+$scope.maxVCPUNum.id).widget().option("disable",false);
                    } else {
                        $("#"+$scope.maxVCPUNum.id).widget().option("value","");
                        UnifyValid.clearValidate($("#"+$scope.maxVCPUNum.id).find("input"));
                        $("#"+$scope.maxVCPUNum.id).widget().option("disable",true);
                    }
                }
            };

            $scope.maxMemoryCapacity = {
                label: ($scope.i18n.template_term_memCapacityMax_label || "最大内存容量") + "(MB)"+":",
                require: false,
                "id": "maxMemoryCapacity",
                "value": "",
                "width": "200",
                "display":false,
                "disable":true,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";maxValue(2147483647):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" )
            };
            $scope.maxMemoryCapacityCheckBox = {
                label: "",
                require: false,
                "id": "maxMemoryCapacityCheckBox",
                "width": "200",
                "height": "30",
                "value":"yes",
                "text":$scope.i18n.template_term_memCapacityMax_label || "最大内存容量"+"(MB)",
                "checked":false,
                "change":function() {
                    if ($("#"+$scope.maxMemoryCapacityCheckBox.id).widget().option("checked")) {
                        $("#"+$scope.maxMemoryCapacity.id).widget().option("disable",false);
                    } else {
                        $("#"+$scope.maxMemoryCapacity.id).widget().option("value","");
                        UnifyValid.clearValidate($("#"+$scope.maxMemoryCapacity.id).find("input"));
                        $("#"+$scope.maxMemoryCapacity.id).widget().option("disable",true);
                    }
                }
            };

            $scope.maxVMNum = {
                label:($scope.i18n.app_term_vmMaxNum_label || "最大虚拟机个数") + ":",
                require: false,
                "id": "maxVMNum",
                "value": "",
                "width": "200",
                "display":false,
                "disable":true,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";maxValue(2147483647):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" )
            };
            $scope.maxVMNumCheckBox = {
                label: "",
                require: false,
                "id": "maxVMNumCheckBox",
                "width": "200",
                "height": "30",
                "value":"yes",
                "text":$scope.i18n.app_term_vmMaxNum_label || "最大虚拟机个数",
                "checked":false,
                "change":function() {
                    if ($("#"+$scope.maxVMNumCheckBox.id).widget().option("checked")) {
                        $("#"+$scope.maxVMNum.id).widget().option("disable",false);
                    } else {
                        $("#"+$scope.maxVMNum.id).widget().option("value","");
                        UnifyValid.clearValidate($("#"+$scope.maxVMNum.id).find("input"));
                        $("#"+$scope.maxVMNum.id).widget().option("disable",true);
                    }
                }
            };

            $scope.maxStorageCapacity = {
                label: ($scope.i18n.template_term_storCapacityMax_label || "最大存储容量") +"(GB)"+ ":",
                require: false,
                "id": "maxStorageCapacity",
                "value": "",
                "width": "200",
                "display":false,
                "disable":true,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" ) +
                    ";maxValue(2147483647):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 2147483647) || "范围为1-2147483647" )
            };
            $scope.maxStorageCapacityCheckBox = {
                label: "",
                require: false,
                "id": "maxStorageCapacityCheckBox",
                "width": "200",
                "height": "30",
                "value":"yes",
                "text":$scope.i18n.template_term_storCapacityMax_label || "最大存储容量"+"(GB)",
                "checked":false,
                "change":function() {
                    if ($("#"+$scope.maxStorageCapacityCheckBox.id).widget().option("checked")) {
                        $("#"+$scope.maxStorageCapacity.id).widget().option("disable",false);
                    } else {
                        $("#"+$scope.maxStorageCapacity.id).widget().option("value","");
                        UnifyValid.clearValidate($("#"+$scope.maxStorageCapacity.id).find("input"));
                        $("#"+$scope.maxStorageCapacity.id).widget().option("disable",true);
                    }
                }
            };

            $scope.priority = {
                label: ($scope.i18n.common_term_priority_label || "优先级") + ":",
                require: false,
                "id": "priority",
                "width": "200",
                "spacing":{"width" : "50px", "height" : "20px"},
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_high_label || "高",
                        "tooltip": "",
                        "checked": true,
                        "disabled": false
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.common_term_middling_label || "中",
                        "tooltip": "",
                        "checked": false,
                        "disabled": false
                    },
                    {
                        "key": "3",
                        "text": $scope.i18n.common_term_low_label || "低",
                        "tooltip": "",
                        "checked": false,
                        "disabled": false
                    }
                ]
            };
            $scope.receiveBand = {
                label:  ($scope.i18n.vpc_term_routerReceiveBandMbps_label || "路由器接收带宽(Mbps)") + ":",
                require: true,
                "id": "receiveBand",
                "value": "",
                "width": "200",
                "extendFunction" : ["checkBand"],
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";checkBand():"+($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 4000) || "范围为1-4000" )
            };
            $scope.sendBand = {
                label: ($scope.i18n.vpc_term_routerSendBandMbps_label || "路由器接收带宽(Mbps)") + ":",
                require: true,
                "id": "sendBand",
                "value": "",
                "width": "200",
                "extendFunction" : ["checkBand"],
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";checkBand():"+($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 4000) || "范围为1-4000" )
            };


            $scope.saveBtn = {
                id: "createVpcSpecSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label || "完成",
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#createVpcSpecInfo"));
                    if (!valid) {
                        return;
                    }

                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    if($scope.vmwareICT){
                        $scope.model.maxSecurityGroupNum = 20;
                        $scope.model.maxPublicIpNum = 20;
                    }else{
                        $scope.model.maxSecurityGroupNum = $("#" + $scope.maxSecurityGroupNum.id).widget().getValue();
                        $scope.model.maxPublicIpNum = $("#" + $scope.maxPublicIpNum.id).widget().getValue();
                    }

                    if ($scope.openstack) {
                        $scope.model.maxRoutedNetworkNum = $("#" + $scope.maxNetworkNum.id).widget().getValue();
                        $scope.model.maxDirectNetworkNum = 0;
                        $scope.model.maxInternalNetworkNum = 0;


                        if ($("#"+$scope.maxVCPUNumCheckBox.id).widget().option("checked")) {
                            $scope.model.maxVCPUNum = $("#" + $scope.maxVCPUNum.id).widget().getValue();
                        } else {
                            $scope.model.maxVCPUNum = -1;
                        }

                        if ($("#"+$scope.maxMemoryCapacityCheckBox.id).widget().option("checked")) {
                            $scope.model.maxMemoryCapacity = $("#" + $scope.maxMemoryCapacity.id).widget().getValue();
                        } else {
                            $scope.model.maxMemoryCapacity = -1;
                        }

                        if ($("#"+$scope.maxVMNumCheckBox.id).widget().option("checked")) {
                            $scope.model.maxVMNum = $("#" + $scope.maxVMNum.id).widget().getValue();
                        } else {
                            $scope.model.maxVMNum = -1;
                        }

                        if ($("#"+$scope.maxStorageCapacityCheckBox.id).widget().option("checked")) {
                            $scope.model.maxStorageCapacity = $("#" + $scope.maxStorageCapacity.id).widget().getValue();
                        } else {
                            $scope.model.maxStorageCapacity = -1;
                        }
                    } else {
                        $scope.model.maxDirectNetworkNum = $("#" + $scope.maxDirectNetworkNum.id).widget().getValue();
                        $scope.model.maxRoutedNetworkNum = $("#" + $scope.maxRoutedNetworkNum.id).widget().getValue();
                        $scope.model.maxInternalNetworkNum = $("#" + $scope.maxInternalNetworkNum.id).widget().getValue();
                        $scope.model.maxNetworkBandWidth = $("#" + $scope.defaultBand.id).widget().getValue();
                        $scope.model.maxTxThroughput = $("#" + $scope.sendBand.id).widget().getValue();
                        $scope.model.maxRxThroughput = $("#" + $scope.receiveBand.id).widget().getValue();
                        $scope.model.priority = $("#" + $scope.priority.id).widget().opChecked("checked");
                    }

                    if ($scope.action === "create") {
                        $scope.operator.create();
                    }
                    else {
                        $scope.operator.modify($("#createVpcSpecWinID").widget().option("specID"));
                    }
                }
            };

            $scope.cancelBtn = {
                id: "createVpcSpecCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $("#createVpcSpecWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            $scope.action = undefined;

            $scope.operator = {
                "create":function() {
                    var deferred = camel.post({
                        "url": {"s": constants.rest.VPC_SPEC_CREATE.url, "o": {"tenant_id": 1}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#createVpcSpecWinID").widget().destroy();
                    });

                    deferred.fail(function(data) {
                        exceptionService.doException(data);
                    });
                },
                "modify":function(id){
                    var deferred = camel.put({
                        "url": {"s": constants.rest.VPC_SPEC_MODIFY.url, "o": {"tenant_id": 1, "id": id}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.done(function (data) {
                        $("#createVpcSpecWinID").widget().destroy();
                    });

                    deferred.fail(function(data) {
                        exceptionService.doException(data);
                    });
                },
                "query":function(id) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.VPC_SPEC_DETAIL.url, "o": {"tenant_id": 1, "id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.done(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.$apply(function () {
                            var response = data;
                            $scope.model.name = response.name;
                            $scope.model.maxPublicIpNum = response.maxPublicIpNum;
                            $scope.model.maxSecurityGroupNum = response.maxSecurityGroupNum;

                            if ($scope.openstack) {
                                $scope.model.maxDirectNetworkNum = response.maxRoutedNetworkNum;
                                $("#" + $scope.maxNetworkNum.id).widget().option("value", $scope.model.maxDirectNetworkNum);

                                if (response.maxVCPUNum == -1) {
                                    $scope.model.maxVCPUNum = "";
                                    $("#" + $scope.maxVCPUNum.id).widget().option("value", $scope.model.maxVCPUNum);
                                    $("#" + $scope.maxVCPUNum.id).widget().option("disable", true);
                                    $("#" + $scope.maxVCPUNumCheckBox.id).widget().option("checked", false);
                                } else {
                                    $scope.model.maxVCPUNum = response.maxVCPUNum;
                                    $("#" + $scope.maxVCPUNum.id).widget().option("value", $scope.model.maxVCPUNum);
                                    $("#" + $scope.maxVCPUNum.id).widget().option("disable", false);
                                    $("#" + $scope.maxVCPUNumCheckBox.id).widget().option("checked", true);
                                }

                                if (response.maxMemoryCapacity == -1) {
                                    $scope.model.maxMemoryCapacity = "";
                                    $("#" + $scope.maxMemoryCapacity.id).widget().option("value", $scope.model.maxMemoryCapacity);
                                    $("#" + $scope.maxMemoryCapacity.id).widget().option("disable", true);
                                    $("#" + $scope.maxMemoryCapacityCheckBox.id).widget().option("checked", false);
                                } else {
                                    $scope.model.maxMemoryCapacity = response.maxMemoryCapacity;
                                    $("#" + $scope.maxMemoryCapacity.id).widget().option("value", $scope.model.maxMemoryCapacity);
                                    $("#" + $scope.maxMemoryCapacity.id).widget().option("disable", false);
                                    $("#" + $scope.maxMemoryCapacityCheckBox.id).widget().option("checked", true);
                                }

                                if (response.maxVMNum == -1) {
                                    $scope.model.maxVMNum = "";
                                    $("#" + $scope.maxVMNum.id).widget().option("value", $scope.model.maxVMNum);
                                    $("#" + $scope.maxVMNum.id).widget().option("disable", true);
                                    $("#" + $scope.maxVMNumCheckBox.id).widget().option("checked", false);
                                } else {
                                    $scope.model.maxVMNum = response.maxVMNum;
                                    $("#" + $scope.maxVMNum.id).widget().option("value", $scope.model.maxVMNum);
                                    $("#" + $scope.maxVMNum.id).widget().option("disable", false);
                                    $("#" + $scope.maxVMNumCheckBox.id).widget().option("checked", true);
                                }

                                if (response.maxStorageCapacity == -1) {
                                    $scope.model.maxStorageCapacity = "";
                                    $("#" + $scope.maxStorageCapacity.id).widget().option("value", $scope.model.maxStorageCapacity);
                                    $("#" + $scope.maxStorageCapacity.id).widget().option("disable", true);
                                    $("#" + $scope.maxStorageCapacityCheckBox.id).widget().option("checked", false);
                                } else {
                                    $scope.model.maxStorageCapacity = response.maxStorageCapacity;
                                    $("#" + $scope.maxStorageCapacity.id).widget().option("value", $scope.model.maxStorageCapacity);
                                    $("#" + $scope.maxStorageCapacity.id).widget().option("disable", false);
                                    $("#" + $scope.maxStorageCapacityCheckBox.id).widget().option("checked", true);
                                }
                            } else {
                                $scope.model.maxDirectNetworkNum = response.maxDirectNetworkNum;
                                $scope.model.maxRoutedNetworkNum = response.maxRoutedNetworkNum;
                                $scope.model.maxInternalNetworkNum = response.maxInternalNetworkNum;

                                $scope.model.maxVCPUNum = response.maxVCPUNum;
                                $scope.model.maxMemoryCapacity = response.maxMemoryCapacity;
                                $scope.model.maxVMNum = response.maxVMNum;
                                $scope.model.maxStorageCapacity = response.maxStorageCapacity;

                                $scope.model.maxNetworkBandWidth = response.maxNetworkBandWidth;
                                $scope.model.maxTxThroughput = response.maxTxThroughput;
                                $scope.model.maxRxThroughput = response.maxRxThroughput;
                                $scope.model.priority = response.priority;

                                $("#" + $scope.maxDirectNetworkNum.id).widget().option("value", $scope.model.maxDirectNetworkNum);
                                $("#" + $scope.maxRoutedNetworkNum.id).widget().option("value", $scope.model.maxRoutedNetworkNum);
                                $("#" + $scope.maxInternalNetworkNum.id).widget().option("value", $scope.model.maxInternalNetworkNum);

                                $("#" + $scope.defaultBand.id).widget().option("value", $scope.model.maxNetworkBandWidth);
                                $("#" + $scope.sendBand.id).widget().option("value", $scope.model.maxTxThroughput);
                                $("#" + $scope.receiveBand.id).widget().option("value", $scope.model.maxRxThroughput);

                                $("#" + $scope.priority.id).widget().opChecked($scope.model.priority.toString(), true);
                            }


                            $("#" + $scope.maxSecurityGroupNum.id).widget().option("value", $scope.model.maxSecurityGroupNum);
                            $("#" + $scope.name.id).widget().option("value", $scope.model.name);
                            $("#" + $scope.maxPublicIpNum.id).widget().option("value", $scope.model.maxPublicIpNum);

                        });
                    });

                    deferred.fail(function(data) {
                        exceptionService.doException(data);
                    });
                }
            };

            /**
             * 页面初始化操作
             */
            $scope.init = function(){

                $scope.action = $("#createVpcSpecWinID").widget().option("action");

                // 创建操作不需要初始化数据
                if ($scope.action === "create") {
                    $scope.model.maxTxThroughput = 50;
                    $scope.model.maxRxThroughput = 50;
                    $scope.saveBtn.text = ($scope.i18n.common_term_create_button || "创建");
                    return;
                }

                // 修改操作，初始化数据
                $scope.saveBtn.text = ($scope.i18n.common_term_save_label || "保存");
                var specID = $("#createVpcSpecWinID").widget().option("specID");
                $scope.operator.query(specID);
            };

            $scope.init();
        }];

        // 创建App
        var deps = [];
        var createVpcSpecApp = angular.module("resources.template.createVpcSpec", deps);
        createVpcSpecApp.controller("resources.template.createVpcSpec.ctrl", createVpcSpecCtrl);
        createVpcSpecApp.service("camel", httpService);

        return createVpcSpecApp;
    });
