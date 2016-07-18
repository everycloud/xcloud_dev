/*global define*/
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/exceptionService",
    "app/services/commonService",
    "app/business/application/services/appCommonService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, validater, exceptien, commonService, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            var windowParamDom = $("#sgnode-apply-window");
            var params = windowParamDom.widget().option("params") || {};
            var nodeJSON = windowParamDom.widget().option("nodeJSON") || {};
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            // 动作类型
            $scope.uiActionType = undefined;
            // 触发类型
            $scope.scalingTriggerType = "Immediate";
            $scope.serviceSrv = new appCommonService(exception, $q, camel);

            $scope.time = {
                label: i18n.app_term_triggerTime_label+":",
                id: "app-instance-applysg-applyTime",
                width: 200,
                require: true,
                type: "datetime",
                timeFormat: 'hh:mm:ss',
                dateFormat: 'yy-mm-dd',
                ampm: false,
                firstDay: 1
            };
            $scope.type = {
                label: i18n.common_term_actionType_label+":",
                "id": "app-instance-applysg-type",
                "width": "200",
                require: true,
                value: [{
                    "selectId": "SCALEOUT",
                    "label": i18n.common_term_expanding_button,
                    "checked": true
                }, {
                    "selectId": "SCALEIN",
                    "label": i18n.common_term_capacityReduction_button
                }],
                "change": function () {
                    $scope.uiActionType = $("#" + $scope.type.id).widget().getSelectedId();
                    // 减容
                    if ($scope.uiActionType === "SCALEIN") {
                        $scope.actionType.values = [{
                            "key": "SCALEIN",
                            "text": i18n.common_term_default_label,
                            "checked": true
                        }, {
                            "key": "HALT",
                            "text": i18n.common_term_turnOff_button,
                            "checked": false
                        }, {
                            "key": "SLEEP",
                            "text": i18n.common_term_hibernate_button,
                            "checked": false
                        }, {
                            "key": "REMOVE",
                            "text": i18n.common_term_delete_button,
                            "checked": false
                        }];
                    } else { // 扩容
                        $scope.actionType.values = [{
                            "key": "SCALEOUT",
                            "text": i18n.common_term_default_label,
                            "checked": true
                        }, {
                            "key": "POWER",
                            "text": i18n.common_term_startup_button,
                            "checked": false
                        }, {
                            "key": "AWAKE",
                            "text": i18n.common_term_awaken_button,
                            "checked": false
                        }, {
                            "key": "CREATE",
                            "text": i18n.common_term_create_button,
                            "checked": false
                        }];
                    }
                }
            };
            $scope.applyType = {
                "label": i18n.app_term_triggerType_label+":",
                "require": true,
                "id": "app-instance-applysg-applytype",
                "layout": "horizon",
                "selected": "private",
                "values": [{
                    "key": "Immediate",
                    "text": i18n.app_term_goFlex_button,
                    "checked": true
                }, {
                    "key": "Scheduled",
                    "text": i18n.app_term_flexbyTime_label,
                    "checked": false
                }],
                "change": function () {
                    $scope.scalingTriggerType = $("#" + $scope.applyType.id).widget().opChecked("checked");
                }
            };
            $scope.actionType = {
                "require": true,
                "id": "app-instance-applysg-actionType",
                "layout": "horizon",
                "selected": "default",
                "values": [{
                    "key": "SCALEOUT",
                    "text":i18n.common_term_default_label,
                    "checked": true
                }, {
                    "key": "POWER",
                    "text": i18n.common_term_startup_button,
                    "checked": false
                }, {
                    "key": "AWAKE",
                    "text":i18n.common_term_awaken_button,
                    "checked": false
                }, {
                    "key": "CREATE",
                    "text": i18n.common_term_create_button,
                    "checked": false
                }]
            };

            $scope.adjustStep = {
                "label": i18n.app_policy_add_para_step_label+":",
                "id": "app-instance-applysg-adjustStep",
                "width": "200",
                "value": "",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "10"),
                "require": true
            };

            $scope.okBtn = {
                "id": "app-instance-applysg-ok",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($("#app-instance-apply-sg"), undefined)) {
                        return;
                    }

                    var localTime = $("#app-instance-applysg-applyTime").widget().getDateTime();
                    var triggerType = $("#" + $scope.applyType.id).widget().opChecked("checked");
                    var datas = {
                        "triggerType": triggerType,
                        "scheduledTime": "Immediate" === triggerType ? "" : commonService.local2Utc(localTime),
                        "actionType": $("#" + $scope.actionType.id).widget().opChecked("checked"),
                        "adjustStep": $("#" + $scope.adjustStep.id).widget().getValue(),
                        "adjustUnit": "Unit_VM"
                    };
                    var promise = $scope.serviceSrv.triggerSG({
                        "vdcId": params.vdcId,
                        "id": nodeJSON.scalingGroupInfo.groupId,
                        "cloudInfraId": params.cloudInfraId,
                        "userId": params.userId,
                        "vpcId": params.vpcId,
                        "params": datas
                    });
                    promise.then(function () {
                        $("#sgnode-apply-window").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "app-instance-applysg-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#sgnode-apply-window").widget().destroy();
                }
            };

            // 数字如果小于10需要添加“0”占位符
            function numberFormat(num) {
                return num > 9 ? num : ("0" + num);
            }
        }
    ];

    var module = angular.module("applySG", ["ng","ngSanitize"]);
    module.controller("sgStrategy", ctrl);
    module.service("camel", http);
    module.service("validator", validater);
    module.service("exception", exceptien);

    return module;
});
