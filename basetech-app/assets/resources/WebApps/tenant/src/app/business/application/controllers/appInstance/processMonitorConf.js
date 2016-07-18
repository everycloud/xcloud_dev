/**
 * 文件名：modifyDomainCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-vm-设置标签的control
 * 修改人：
 * 修改时间：14-4-24
 */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'tiny-common/UnifyValid',
        'app/services/httpService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/updateVmService',
        'app/business/ecs/services/vm/vmDomainService',
        "app/business/ecs/services/vm/vmMonitorService",
        'tiny-directives/RadioGroup'
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, UnifyValid, http, exceptionService, updateVmService, vmDomainService, vmMonitorService) {
        "use strict";
        var modifyDomainCtrl = ["$q", "$scope", "$compile", "camel", "exception",
            function ($q, $scope, $compile, camel, exception) {
                var winParam = $("#vmProcessMonitorConfig").widget().option("winParam");
                var vmMonitorServiceIns = new vmMonitorService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                $scope.labelWidth = 100;
                $scope.label = {
                    "strategyName": i18n.app_term_policyName_label+":",
                    "metricItem": i18n.common_term_monitorIndex_label + ":",
                    "occurWay": i18n.app_term_triggerCondition_label+":",
                    "circle": i18n.user_policy_set_para_periodMinu_label+":",
                    "occurTicks": i18n.common_term_generateNum_label + ":",
                    "conditionConf": i18n.app_term_conditionCfg_label+":",
                    "move": i18n.common_term_action_label+":",
                    "activeState": i18n.common_term_activateStatus_label + ":"
                };

                $scope.occurWay = {
                    "choose": "each", // "each"/"byTimer"
                    "name": "occurWayName",
                    "width": "60px",
                    "height": "20px",
                    "id1": "createAppCreateType1Id",
                    "text1": i18n.perform_config_vm_para_cycle_option_every_value,
                    "checked1": true,
                    "disable1": false,
                    "change1": function () {
                        $scope.occurWay.choose = "each";
                    },
                    "id2": "createAppCreateType1Id",
                    "text2": i18n.perform_config_vm_para_cycle_option_threshold_value,
                    "checked2": false,
                    "disable2": false,
                    "change2": function () {
                        $scope.occurWay.choose = "byTimer";
                    }
                };

                $scope.statisticCircle = {
                    "label": i18n.user_policy_set_para_periodMinu_label+":",
                    "id": "statisticCircleId",
                    "width": "100",
                    "value": "20",
                    "require": true,
                    "tips": "1~65536",
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536") + ";maxValue(65536):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536") + ";"
                };

                $scope.statisticTicks = {
                    "label": i18n.common_term_generateNum_label+":",
                    "id": "statisticTicksId",
                    "width": "100",
                    "value": "20",
                    "require": true,
                    "tips": "1~65536",
                    "validate": "integer:"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536")+";maxValue(65536):"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536")+";minValue(1):"+i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "65536")+";"
                };

                $scope.conditionConfig = {
                    label: ":",
                    require: true,
                    "id": "conditionConfigId",
                    "width": "149",
                    'validate': 'required:"+i18n.common_term_null_valid+";',
                    "values": [{
                        "selectId": "change",
                        "label": i18n.perform_config_vm_para_change_option_change_value,
                        "checked": true
                    }, {
                        "selectId": "noLess",
                        "label": ">="
                    }, {
                        "selectId": "noBigger",
                        "label": "<="
                    }]
                };

                $scope.move = {
                    "id": "moveNotifyId",
                    "text": i18n.perform_config_vm_para_action_option_alarm_value,
                    "name": "moveNotifyName",
                    "value": "",
                    "checked": true,
                    "change": function () {}
                };

                $scope.enable = {
                    "enableConfig": true,
                    "change": function () {
                        $scope.enable.enableConfig = !$scope.enable.enableConfig;
                    }
                };

                $scope.params = {
                    "user": user,
                    "strategyName": i18n.perform_term_vmMemMonitor_label,
                    "metricItem": i18n.perform_term_vmMemLeft_label,
                    "occurCondition": "",
                    "circle": "",
                    "occurTicks": "",
                    "conditionConf": "",
                    "move": "",
                    "activeState": ""
                };

                $scope.nextBtn = {
                    "id": "vmProcessMonitorConfigOk",
                    "disable": false,
                    "text":i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".ecs_vm_process_monitor_conf"));
                        if (!valid) {
                            return;
                        }
                        $scope.params.occurCondition = $scope.occurWay.choose;
                        if ($scope.params.occurCondition !== "each") {
                            var circle = $("#" + $scope.statisticCircle.id).widget().getValue();
                            $scope.params.circle = parseInt(circle, 10);
                            var occurTicks = $("#" + $scope.statisticTicks.id).widget().getValue();
                            $scope.params.occurTicks = parseInt(occurTicks, 10);
                        }

                        $scope.params.conditionConf = $("#" + $scope.conditionConfig.id).widget().getSelectedId();
                        $scope.params.move = true;
                        $scope.params.activeState = $scope.enable.enableConfig;
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
                    var deferred = vmMonitorServiceIns.configVmProcessMonitor(params);
                    deferred.then(function (data) {
                        $("#vmProcessMonitorConfig").widget().destroy();
                    });
                }
            }
        ];

        var modifyDomainModule = angular.module("app.vm.processMonitor.conf", ['ng', 'wcc','ngSanitize']);
        modifyDomainModule.controller("app.vm.processMonitor.conf.ctrl", modifyDomainCtrl);
        modifyDomainModule.service("camel", http);
        modifyDomainModule.service("exception", exceptionService);
        return modifyDomainModule;
    }
);
