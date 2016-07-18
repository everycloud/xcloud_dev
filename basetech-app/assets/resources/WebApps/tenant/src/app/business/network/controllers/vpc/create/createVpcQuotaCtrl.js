/* global define */
define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    'app/services/exceptionService',
    'tiny-common/UnifyValid',
    "language/keyID"
], function (sprintf, $, angular, exception, UnifyValid, keyIDI18n) {
    "use strict";

    var ctrl = ["$scope",
        function ($scope ) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var MAXQUATO = 2147483648;
            $scope.info = {
                vms: {
                    "id": "create-quota-vms",
                    label: i18n.vm_term_vmNum_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    tipWidth: "200px",
                    tipPosition: "right",
                    "extendFunction": ["rangeCheck"],
                    validate: "required:" + i18n.common_term_null_valid +";rangeCheck(vMNum):"
                },
                cpu: {
                    "id": "create-quota-cpu",
                    label: i18n.common_term_vcpuNum_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    tipWidth: "200px",
                    "extendFunction": ["rangeCheck"],
                    validate: "required:" + i18n.common_term_null_valid +";rangeCheck(vCPUNum):"
                },
                memory: {
                    "id": "create-quota-memory",
                    label: i18n.common_term_memoryMB_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    tipWidth: "200px",
                    "extendFunction": ["rangeCheck"],
                    validate:"required:" + i18n.common_term_null_valid +";rangeCheck(memoryCapacity):"
                },
                storage: {
                    "id": "create-quota-storage",
                    label: i18n.common_term_storageGB_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    tipWidth: "200px",
                    "extendFunction": ["rangeCheck"],
                    validate:"required:" + i18n.common_term_null_valid +";rangeCheck(storageCapacity):"
                },
                nets: {
                    "id": "create-quota-nets",
                    label: i18n.perform_term_routerOrInnerNetNum_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    "extendFunction": ["rangeCheck"],
                    validate:"required:" + i18n.common_term_null_valid +";rangeCheck(routedNetworkNum):"
                },
                eip: {
                    "id": "create-quota-eip",
                    label: i18n.eip_term_eip_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    "extendFunction": ["rangeCheck"],
                    validate:"required:" + i18n.common_term_null_valid +";rangeCheck(publicIpNum):"
                },
                sg: {
                    "id": "create-quota-sg",
                    label: i18n.org_term_secuGroupNum_label + ":",
                    require: true,
                    value: "",
                    width: "141px",
                    "extendFunction": ["rangeCheck"],
                    validate:"required:" + i18n.common_term_null_valid +";rangeCheck(securityGroupNum):"
                },
                preBtn: {
                    "id": "create-vpc-stepQ-next",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basicInfo";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpc-stepQ-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($("#create-quota-window"))) {
                            return;
                        }
                        $scope.service.show = "vpcType";
                        $("#" + $scope.service.step.id).widget().next();
                        $scope.service.vpcSpec = {
                                maxVMNum: $("#create-quota-vms").widget().getValue(),
                                maxVCPUNum: $("#create-quota-cpu").widget().getValue(),
                                maxMemoryCapacity: $("#create-quota-memory").widget().getValue(),
                                maxStorageCapacity: $("#create-quota-storage").widget().getValue(),
                                maxRoutedNetworkNum: $("#create-quota-nets").widget().getValue()
                        };
                        if($scope.vmwareICT){
                            $scope.service.vpcSpec.maxPublicIpNum = 1;
                            $scope.service.vpcSpec.maxSecurityGroupNum = 0;
                        }else{
                            $scope.service.vpcSpec.maxPublicIpNum = $("#create-quota-eip").widget().getValue();
                            $scope.service.vpcSpec.maxSecurityGroupNum = $("#create-quota-sg").widget().getValue();
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-vpc-stepQ-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };
//            校验输入范围是否在[inUse, limit]区间
            UnifyValid.rangeCheck = function (type) {
                var inputVal = $(this).val();
                var valideType = type[0];
                if (!inputVal || !valideType) {
                    return false;
                }

                // 整数校验
                var f = parseFloat(inputVal);
                if (!isNaN(f) && f.toString() === inputVal && Math.round(f) === f) {
                    var intVal = parseInt(inputVal, 10);

                    //-1表示不限制
                    if(-1 === $scope.quotaService.value.maxValue[valideType]){
                       if(-1 === intVal||(intVal >= $scope.quotaService.value.minValue[valideType]&&intVal < MAXQUATO)){
                           return true;
                       }
                    }
                    if(intVal >= $scope.quotaService.value.minValue[valideType] && intVal <= $scope.quotaService.value.maxValue[valideType]){
                        return true;
                    }
                }
                return $scope.quotaService.tip[valideType];
            };
        }
    ];

    return ctrl;
});
