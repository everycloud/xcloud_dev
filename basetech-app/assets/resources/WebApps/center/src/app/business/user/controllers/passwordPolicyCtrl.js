/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-24
 */
/*global define*/
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-common/UnifyValid",
        "app/services/exceptionService",
        'tiny-widgets/Message',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "fixtures/userFixture"
    ],
    function ($, angular, UnifyValid, ExceptionService, Message) {
        "use strict";
        var passwordPolicyCtrl = ["$scope", "$stateParams", "$state", "camel",
            function ($scope, $stateParams, $state, camel) {
                var user = $("html").scope().user;
                var colon = ":";
                var commonStr8_32 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:8, 2:32});
                var commonStr3_32 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:3, 2:32});
                var commonStr0_999 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:"0", 2:999});
                var commonStr0_9999 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:"0", 2:9999});
                var commonStr0_15 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:"0", 2:15});
                var commonStr3_30 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:3, 2:30});
                var commonStr10_120 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,{1:10, 2:120});
                $scope.hasPWDOperateRight = user.privilege.role_role_add_option_pswPolicyHandle_value;
                $scope.minLength = {
                    "id": "password_policy_minLength_id",
                    "label": $scope.i18n.user_policy_set_para_lengthMin_label + colon,
                    "require": true,
                    "value": 8,
                    "readonly": false,
                    "tooltip": commonStr8_32,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr8_32 + ";minValue(8):" + commonStr8_32 + ";maxValue(32):" + commonStr8_32
                };
                $scope.maxLength = {
                    "id": "password_policy_maxLength_id",
                    "label": $scope.i18n.user_policy_set_para_lengthMax_label + colon,
                    "require": true,
                    "value": 32,
                    "readonly": false,
                    "tooltip": commonStr8_32,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr8_32 + ";minValue(8):" + commonStr8_32 + ";maxValue(32):" + commonStr8_32
                };
                $scope.containSC = {
                    "id": "password_policy_containSC_id",
                    "label": $scope.i18n.user_policy_set_para_special_label + colon,
                    "require": true,
                    "width": 150,
                    "values": [{
                        "selectId": "0",
                        "label": $scope.i18n.common_term_yes_button,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_no_label
                    }]
                };
                $scope.containUN = {
                    "id": "password_policy_containUN_id",
                    "label": $scope.i18n.user_policy_set_para_userName_label + colon,
                    "require": true,
                    "width": 150,
                    "values": [{
                        "selectId": "0",
                        "label": $scope.i18n.common_term_yes_button,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_no_label
                    }]
                };
                $scope.reuseNum = {
                    "id": "password_policy_reuseNum_id",
                    "label": $scope.i18n.user_policy_set_para_repeat_label + colon,
                    "require": true,
                    "value": 5,
                    "readonly": false,
                    "tooltip": $scope.i18n.user_term_excludeUsedPsw_valid + colon,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr3_32 + ";minValue(3):" + commonStr3_32 + ";maxValue(32):" + commonStr3_32
                };
                $scope.validity = {
                    "id": "password_policy_validity_id",
                    "label": $scope.i18n.user_policy_set_para_usefulLife_label + colon,
                    "require": true,
                    "value": 90,
                    "readonly": false,
                    "tooltip": $scope.i18n.user_policy_set_para_validity_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr0_999 + ";minValue(0):" + commonStr0_999 + ";maxValue(999):" + commonStr0_999
                };
                $scope.forciblyModifyPassword = {
                    "id": "password_policy_forciblyModifyPassword_id",
                    "label": $scope.i18n.user_policy_set_para_firstModify_label + colon,
                    "require": true,
                    "width": 150,
                    "values": [{
                        "selectId": "0",
                        "label":$scope.i18n.common_term_yes_button,
                        "checked": true
                    }, {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_no_label
                    }]
                };
                $scope.minInterval = {
                    "id": "password_policy_minInterval_id",
                    "label": $scope.i18n.user_policy_set_para_distance_label + colon,
                    "require": true,
                    "value": 5,
                    "readonly": false,
                    "tooltip": $scope.i18n.user_policy_set_para_distance_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr0_9999 + ";minValue(0):" + commonStr0_9999 + ";maxValue(9999):" + commonStr0_9999
                };
                $scope.hintDays = {
                    "id": "password_policy_hintDays_id",
                    "label": $scope.i18n.user_policy_set_para_notice_label + colon,
                    "require": true,
                    "value": 7,
                    "readonly": false,
                    "tooltip": $scope.i18n.user_policy_set_para_notice_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr0_15 + ";minValue(0):" + commonStr0_15 + ";maxValue(15):" + commonStr0_15
                };
                $scope.wrongPassNum = {
                    "id": "password_policy_wrongPassNum_id",
                    "label": $scope.i18n.user_policy_set_para_enterError_label + colon,
                    "require": true,
                    "value": 5,
                    "type": "input",
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr3_30 + ";minValue(3):" + commonStr3_30 + ";maxValue(30):" + commonStr3_30
                };
                $scope.wrongPassPeriod = {
                    "id": "password_policy_wrongPassPeriod_id",
                    "label": $scope.i18n.user_policy_set_para_periodMinu_label + colon,
                    "require": true,
                    "value": 5,
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr3_30 + ";minValue(3):" + commonStr3_30 + ";maxValue(30):" + commonStr3_30
                };
                $scope.lockDuration = {
                    "id": "password_policy_lockDuration_id",
                    "label": $scope.i18n.user_policy_set_para_lockPeriod_label + colon,
                    "require": true,
                    "value": 10,
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr10_120 + ";minValue(10):" + commonStr10_120 + ";maxValue(120):" + commonStr10_120
                };

                var getFormParams = function () {
                    var params = {
                        "minPasswordLength": $("#password_policy_minLength_id").widget().getValue(),
                        "maxPasswordLength": $("#password_policy_maxLength_id").widget().getValue(),
                        "requireSymbols": $scope.operator.getBooleanBySelect($("#password_policy_containSC_id").widget()),
                        "allowUserName": $scope.operator.getBooleanBySelect($("#password_policy_containUN_id").widget()),
                        "reuseFrequency": $("#password_policy_reuseNum_id").widget().getValue(),
                        "passwordValidity": $("#password_policy_validity_id").widget().getValue(),
                        "forceModifyPwd": $scope.operator.getBooleanBySelect($("#password_policy_forciblyModifyPassword_id").widget()),
                        "minChangeInterval": $("#password_policy_minInterval_id").widget().getValue(),
                        "advanceWarnPwdExpiry": $("#password_policy_hintDays_id").widget().getValue(),
                        "statisticsPeriod": $("#password_policy_wrongPassPeriod_id").widget().getValue(),
                        "retryCount": $("#password_policy_wrongPassNum_id").widget().getValue(),
                        "lockDuration": $("#password_policy_lockDuration_id").widget().getValue()
                    };
                    return params;
                };

                $scope.saveBtn = {
                    "id": "password_policy_saveBtn_id",
                    "text": $scope.i18n.common_term_save_label,
                    "save": function () {
                        var result = UnifyValid.FormValid($("#password_policy"));
                        if (!result) {
                            return;
                        }

                        var deferred = camel.put({
                            url: "/goku/rest/v1.5/system/password-policy",
                            "params": JSON.stringify({
                                "pwdPolicy": getFormParams()
                            }),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var successMsg = new Message({
                                    "type": "prompt",
                                    "content": $scope.i18n.common_term_operationSucceed_msg,
                                    "height": 100,
                                    "width": 300
                                });
                                successMsg.show();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                $scope.operator = {
                    "setSelectByBoolean": function (widget, boolValue) {
                        if (boolValue) {
                            widget.opChecked("0");
                        } else {
                            widget.opChecked("1");
                        }
                    },
                    "getBooleanBySelect": function (widget) {
                        var selectId = widget.getSelectedId();
                        if (!selectId) {
                            return true;
                        }
                        if (selectId === "1") {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    "getPasswordPolicy": function () {
                        var deferred = camel.get({
                            url: "/goku/rest/v1.5/system/password-policy",
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var pwdPolicy = response.pwdPolicy;
                                if (!pwdPolicy) {
                                    return;
                                }

                                $scope.minLength.value = pwdPolicy.minPasswordLength;
                                $scope.maxLength.value = pwdPolicy.maxPasswordLength;
                                $scope.operator.setSelectByBoolean($("#" + $scope.containSC.id).widget(), pwdPolicy.requireSymbols);
                                $scope.operator.setSelectByBoolean($("#" + $scope.containUN.id).widget(), pwdPolicy.allowUserName);
                                $scope.reuseNum.value = pwdPolicy.reuseFrequency;
                                $scope.validity.value = pwdPolicy.passwordValidity;
                                $scope.operator.setSelectByBoolean($("#" + $scope.forciblyModifyPassword.id).widget(), pwdPolicy.forceModifyPwd);
                                $scope.minInterval.value = pwdPolicy.minChangeInterval;
                                $scope.hintDays.value = pwdPolicy.advanceWarnPwdExpiry;
                                $scope.wrongPassPeriod.value = pwdPolicy.statisticsPeriod;
                                $scope.wrongPassNum.value = pwdPolicy.retryCount;
                                $scope.lockDuration.value = pwdPolicy.lockDuration;
                            });
                        });
                    }
                };

                $scope.operator.getPasswordPolicy();
            }
        ];

        return passwordPolicyCtrl;
    });
