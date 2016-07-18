/* global define */
define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/httpService",
    'app/services/exceptionService',
    "app/business/network/services/networkService",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "language/keyID",
    'app/services/competitionConfig',
    "tiny-directives/IP"
], function (sprintf, $, angular, _, http, exception, networkService, validatorService, UnifyValid, keyIDI18n, competitionConfig) {
    "use strict";

    var ctrl = ["$scope", "$q", "camel", "$compile", "exception",
        function ($scope, $q, camel, $compile, exception) {
            var validator = new validatorService();
            var networkIns = new networkService(exception, $q, camel);
            var param = $("#modifyQuotaWindow").widget().option("param");
            var quotaInfo = adjustStart(param.quotaInfo);
            var options = param.options;
            var vpcSpec = param.vpcSpec;
            var MAXQUATO = 2147483648;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            $scope.vmwareICT = competitionConfig.isBaseOnVmware;

            $scope.info = {
                vms: {
                    "id": "modify-quota-vms",
                    label: i18n.vm_term_vmNum_label + ":",
                    require: true,
                    value: vpcSpec.maxVMNum,
                    width: "141px",
                    tipWidth: "200px",
                    tipPosition: "right",
                    "extendFunction": ["rangeCheck"],
                    "tooltip": tipsFuctory(quotaInfo.vm),
                    validate: validateFuctory("vm", quotaInfo.vm)
                },
                cpu: {
                    "id": "modify-quota-cpu",
                    label: i18n.common_term_vcpuNum_label + ":",
                    require: true,
                    value: vpcSpec.maxVCPUNum,
                    width: "141px",
                    tipWidth: "200px",
                    "tooltip": tipsFuctory(quotaInfo.cpu),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("cpu", quotaInfo.cpu)
                },
                memory: {
                    "id": "modify-quota-memory",
                    label: i18n.common_term_memoryMB_label + ":",
                    require: true,
                    value: vpcSpec.maxMemoryCapacity,
                    width: "141px",
                    tipWidth: "200px",
                    "tooltip": tipsFuctory(quotaInfo.mem),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("mem", quotaInfo.mem)
                },
                storage: {
                    "id": "modify-quota-storage",
                    label: i18n.common_term_storageGB_label + ":",
                    require: true,
                    value: vpcSpec.maxStorageCapacity,
                    width: "141px",
                    tipWidth: "200px",
                    "tooltip": tipsFuctory(quotaInfo.storage),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("storage", quotaInfo.storage)
                },
                nets: {
                    "id": "modify-quota-nets",
                    label: i18n.perform_term_routerOrInnerNetNum_label + ":",
                    require: true,
                    value: vpcSpec.maxRoutedNetworkNum,
                    width: "141px",
                    "tooltip": tipsFuctory(quotaInfo.net),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("net", quotaInfo.net)
                },
                eip: {
                    "id": "modify-quota-eip",
                    label: i18n.eip_term_eip_label + ":",
                    require: true,
                    value: vpcSpec.maxPublicIpNum,
                    width: "141px",
                    "tooltip": tipsFuctory(quotaInfo.eip),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("eip", quotaInfo.eip)
                },
                sg: {
                    "id": "modify-quota-sg",
                    label: i18n.org_term_secuGroupNum_label + ":",
                    require: true,
                    value: vpcSpec.maxSecurityGroupNum,
                    width: "141px",
                    "tooltip": tipsFuctory(quotaInfo.sg),
                    "extendFunction": ["rangeCheck"],
                    validate: validateFuctory("sg", quotaInfo.sg)
                },
                saveBtn: {
                    "id": "modify-quota--save",
                    "text": i18n.common_term_save_label,
                    "click": function () {
                        if (!UnifyValid.FormValid($("#modify-quota-window"))) {
                            return;
                        }
                        options.vpcSpec = {
                            "vpcSpec": {
                                maxVMNum: $("#modify-quota-vms").widget().getValue(),
                                maxVCPUNum: $("#modify-quota-cpu").widget().getValue(),
                                maxMemoryCapacity: $("#modify-quota-memory").widget().getValue(),
                                maxStorageCapacity: $("#modify-quota-storage").widget().getValue(),
                                maxRoutedNetworkNum: $("#modify-quota-nets").widget().getValue()
                            }
                        };
                        if($scope.vmwareICT){
                            options.vpcSpec.vpcSpec.maxPublicIpNum = 1;
                            options.vpcSpec.vpcSpec.maxSecurityGroupNum = 0;
                        }else{
                            options.vpcSpec.vpcSpec.maxPublicIpNum = $("#modify-quota-eip").widget().getValue();
                            options.vpcSpec.vpcSpec.maxSecurityGroupNum = $("#modify-quota-sg").widget().getValue();
                        }
                        var promise = networkIns.modfiyVpcQuota(options);
                        promise.then(function () {
                            $scope.close();
                            $scope.$destroy();
                        });
                    }
                },
                cancelBtn: {
                    "id": "modify-quota--cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                        $scope.$destroy();
                    }
                }
            };

            //校验输入范围是否在[inUse, limit]区间
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
                    // limit 为-1 表示上限不限制
                    if (quotaInfo[valideType].limit === -1) {
                        return (intVal >= quotaInfo[valideType].inUse && intVal < MAXQUATO)|| intVal === -1;
                    }
                    else {
                        return intVal >= quotaInfo[valideType].inUse && intVal <= quotaInfo[valideType].limit;
                    }
                }
                return false;
            };

            // 生成tips
            function tipsFuctory(obj) {
                if (!obj) {
                    return "";
                }
                // limit 为-1 表示上限不限制
                return obj.limit === -1 ? i18n.sprintf(i18n.common_term_greaterOrNagitive1_valid, $.encoder.encodeForHTML(obj.inUse -1),MAXQUATO)
                    : i18n.sprintf(i18n.common_term_rangeInteger_valid, $.encoder.encodeForHTML(obj.inUse), $.encoder.encodeForHTML(obj.limit));
            }

            // 生成校验器
            function validateFuctory(type, obj) {
                if (!type || !obj) {
                    return "";
                }
                // limit 为-1 表示上限不限制
                return "rangeCheck(" + type + "):" + (obj.limit === -1 ? i18n.sprintf(i18n.common_term_greaterOrNagitive1_valid, $.encoder.encodeForHTML(obj.inUse -1),MAXQUATO) :
                    i18n.sprintf(i18n.common_term_rangeInteger_valid, $.encoder.encodeForHTML(obj.inUse), $.encoder.encodeForHTML(obj.limit)));
            }

            // 对于弹性ip，如果inUse是0，下限需要调整为1
            function adjustStart(quotaInfo) {
                var backInfo = quotaInfo;
                if (!backInfo) {
                    return null;
                }

                if(backInfo.eip && backInfo.eip.inUse === 0){
                    backInfo.eip.inUse = 1;
                }

                return backInfo;
            }

            $scope.close = function () {
                $("#modifyQuotaWindow").widget().destroy();
            };
        }
    ];

    var dependency = ["ng", "wcc", "ui.bootstrap"];
    var modifyQuotaWindowModule = angular.module("modifyQuotaWindowModule", dependency);
    modifyQuotaWindowModule.controller("modifyVpcQuotaCtrl", ctrl);
    modifyQuotaWindowModule.service("camel", http);
    modifyQuotaWindowModule.service("exception", exception);

    return modifyQuotaWindowModule;
});
