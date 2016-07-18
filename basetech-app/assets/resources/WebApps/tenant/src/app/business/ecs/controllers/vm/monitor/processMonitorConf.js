/**
 * 文件名：modifyDomainCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-设置标签的control
 * 修改时间：14-4-24
 */
/* global define */
define(["sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'app/services/httpService',
    'app/services/exceptionService',
    'app/business/ecs/services/vm/updateVmService',
    'app/business/ecs/services/vm/vmDomainService',
    "app/business/ecs/services/vm/vmMonitorService",
    "language/keyID",
    'tiny-directives/RadioGroup'
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, UnifyValid, validatorService, http, exceptionService, updateVmService, vmDomainService, vmMonitorService, i18n) {
        "use strict";
        var modifyDomainCtrl = ["$q", "$scope", "$compile", "camel", "exception",
            function ($q, $scope, $compile, camel, exception) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var winParam = $("#vmProcessMonitorConfig").widget().option("shareConfigParam");
                var validator = new validatorService();
                var valTips = i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65535");
                $scope.commonConf = {
                    "metricName": winParam.metricName,
                    "alertEnableActionMode": "once"
                };
                var vmMonitorServiceIns = new vmMonitorService(exception, $q, camel);
                var user = $("html").scope().user;
                $scope.labelWidth = 100;
                $scope.label = {
                    "strategyName": i18n.app_term_policyName_label + ":",
                    "metricItem": i18n.common_term_monitorIndex_label + ":",
                    "occurWay": i18n.app_term_triggerCondition_label + ":",
                    "circle": i18n.user_policy_set_para_periodMinu_label + ":",
                    "occurTicks": i18n.common_term_generateNum_label + ":",
                    "conditionConf": i18n.app_term_conditionCfg_label + ":",
                    "move": i18n.common_term_action_label + ":",
                    "activeState": i18n.common_term_activateStatus_label + ":"
                };

                $scope.strategyName = {
                    "id": "strategyNameId",
                    "width": "149px",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" + i18n.common_term_composition2_valid + i18n .sprintf(i18n.common_term_length_valid, 1, 64)
                };
                $scope.comparatorValue = {
                    "id": "comparatorValueId",
                    "width": "149px",
                    "require": true,
                    "validate": "required: " + i18n.common_term_null_valid + ";"
                };

                $scope.occurWay = {
                    "choose": "once", // "once"/"period"
                    "name": "occurWayName",
                    "width": "60px",
                    "height": "20px",
                    "text1": i18n.perform_config_vm_para_cycle_option_every_value,
                    "change1": function () {
                        $scope.occurWay.choose = "once";
                    },
                    "text2": i18n.perform_config_vm_para_cycle_option_threshold_value,
                    "change2": function () {
                        $scope.occurWay.choose = "period";
                    }
                };

                $scope.statisticCircle = {
                    "label": i18n.user_policy_set_para_periodMinu_label + ":",
                    "id": "statisticCircleId",
                    "width": "149",
                    "require": true,
                    "validate": "integer:" + valTips + ";maxValue(65536):" + valTips + ";minValue(1):" + valTips
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "id": "processMonitorConfDescription",
                    "type": "multi",
                    "width": "220",
                    "height": "100",
                    "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
                };

                $scope.statisticTicks = {
                    "label": i18n.common_term_generateNum_label + ":",
                    "id": "statisticTicksId",
                    "width": "149",
                    "require": true,
                    "tips": "1~65536",
                    "validate": "integer:" + valTips + ";maxValue(65536):" + valTips + ";minValue(1):" + valTips
                };

                $scope.conditionConfig = {
                    label: ":",
                    require: true,
                    "id": "conditionConfigId",
                    "width": "149",
                    'validate': 'required:' + i18n.common_term_null_valid,
                    "values": [
                        {
                            "selectId": ">",
                            "label": ">",
                            "checked": true
                        },
                        {
                            "selectId": "<",
                            "label": "<",
                            "checked": false
                        },
                        {
                            "selectId": "=",
                            "label": "=",
                            "checked": false
                        },
                        {
                            "selectId": "!=",
                            "label": "!=",
                            "checked": false
                        }
                    ]
                };

                $scope.move = {
                    "id": "moveNotifyId",
                    "text": i18n.perform_config_vm_para_action_option_alarm_value,
                    "name": "moveNotifyName",
                    "checked": true
                };

                $scope.enable = {
                    "enableConfig": true,
                    "change": function () {
                        $scope.enable.enableConfig = !$scope.enable.enableConfig;
                    }
                };

                $scope.params = {
                    "user": user,
                    "cloudInfraId": winParam.cloudInfraId,
                    "config": {
                        "vmId": winParam.vmId,
                        "processId": winParam.processId,
                        "metricName": winParam.metricName,
                        "resourceId": winParam.resourceId,
                        "pvmIp": winParam.pvmIp,
                        "userId": user.id,
                        "vdcId": user.vdcId,
                        "alertDefinitionConfig": {}
                    }
                };

                $scope.confirmBtn = {
                    "id": "vmProcessMonitorConfigOk",
                    "disable": false,
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".ecs_vm_process_monitor_conf"));
                        if (!valid) {
                            return;
                        }
                        var config = $scope.params.config.alertDefinitionConfig;
                        config.name = $("#" + $scope.strategyName.id).widget().getValue();
                        config.description = $("#" + $scope.description.id).widget().getValue();
                        if ($scope.occurWay.choose !== "once") {
                            config.alertEnableActionMode = "period";
                            config.periodTime = $("#" + $scope.statisticCircle.id).widget().getValue();
                            config.count = $("#" + $scope.statisticTicks.id).widget().getValue();
                        }
                        else {
                            config.alertEnableActionMode = "once";
                        }
                        config.comparatorValue = $("#" + $scope.comparatorValue.id).widget().getValue();

                        var conditionConf = $("#" + $scope.conditionConfig.id).widget().getSelectedId();
                        config.alertConditionMode = "comparator";
                        config.comparatorMode = $.base64.encode(conditionConf);
                        config.active = $scope.enable.enableConfig;
                        config.priority = 1;
                        configProcessMonitor($scope.params);
                    }
                };
                $scope.cancelBtn = {
                    "id": "vmProcessMonitorConfigCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#vmProcessMonitorConfig").widget().destroy();
                    }
                };

                function configProcessMonitor(params) {
                    var deferred = vmMonitorServiceIns.configVmBusinessMonitor(params);
                    deferred.then(function (data) {
                        $("#vmProcessMonitorConfig").widget().destroy();
                    });
                }

                function getVmBusinessMonitor() {
                    var deferred = vmMonitorServiceIns.getVmBusinessMonitor({
                        "user": user,
                        "param": {
                            "cloud-infra": winParam.cloudInfraId,
                            "metricid": winParam.metricId,
                            "vmId": winParam.vmId,
                            "processId": winParam.processId
                        }
                    });
                    deferred.then(function (data) {
                        if (!data || !data.alertDefinitionConfig) {
                            return;
                        }
                        var alertConfig = data.alertDefinitionConfig;
                        $scope.commonConf = alertConfig;
                        $scope.commonConf.metricName = winParam.metricName;
                        $scope.occurWay.choose = alertConfig.alertEnableActionMode;
                        $scope.enable.enableConfig = alertConfig.active;
                        var comparatorMode = $.base64.decode(alertConfig.comparatorMode);
                        $scope.conditionConfig.values = [
                            {"selectId": ">", "label": ">", "checked": comparatorMode === ">"},
                            {"selectId": "<", "label": "<", "checked": comparatorMode === "<"},
                            {"selectId": "=", "label": "=", "checked": comparatorMode === "="},
                            {"selectId": "!=", "label": "!=", "checked": comparatorMode === "!="}
                        ];
                    });
                }

                getVmBusinessMonitor();
            }
        ];

        var modifyDomainModule = angular.module("ecs.vm.processMonitor.conf", ['ng', 'wcc', "ngSanitize"]);
        modifyDomainModule.controller("ecs.vm.processMonitor.conf.ctrl", modifyDomainCtrl);
        modifyDomainModule.service("camel", http);
        modifyDomainModule.service("exception", exceptionService);
        return modifyDomainModule;
    }
);
