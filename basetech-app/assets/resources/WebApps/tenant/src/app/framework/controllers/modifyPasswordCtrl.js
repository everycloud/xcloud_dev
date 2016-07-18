/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    'tiny-widgets/Message',
    "app/services/exceptionService",
    "app/framework/directive/directiveFM",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"],
    function ($, angular, http, UnifyValid, ValidatorService, Message, ExceptionService, fm) {
        "use strict";
        var modifyPasswordCtrl = ["$scope", "camel", "validator", function ($scope, camel, validator) {
            var user = $("html").scope().user;
            var colon = ":";
            $scope.openstack = user.cloudType === "ICT" || user.cloudType === "OPENSTACK";
            $scope.pwdPolicy = undefined;
            var mustContainTip = $scope.i18n.common_term_compositionInclude4_valid || "至少包含大写英文字母、小写英文字母和数字中的两种字符。";
            var containSCTip = $scope.i18n.common_term_specialCharacter_valid;
            var containUNTip = $scope.i18n.user_term_excludeUsername_valid;
            var pwdLengthTip = $scope.i18n.common_term_length_valid;
            UnifyValid.pwdCheck = function (pwdId) {
                if (!$scope.pwdPolicy || $scope.openstack) {
                    return true;
                }
                var pwd = $("#" + pwdId).widget().getValue();
                var minLength = $scope.pwdPolicy.minPasswordLength;
                var maxLength = $scope.pwdPolicy.maxPasswordLength;
                var containSC = $scope.pwdPolicy.requireSymbols;
                var containUN = $scope.pwdPolicy.allowUserName;

                if (!validator.checkMustContain(pwd)) {
                    return mustContainTip;
                }

                if (!validator.checkPasswordLength(pwd, minLength, maxLength)) {
                    return $scope.i18n.sprintf(pwdLengthTip,{1:minLength,2:maxLength});
                }

                // 必须包含特殊字符
                if (containSC) {
                    if (!validator.checkContainSpecialCharacter(pwd)) {
                        return containSCTip;
                    }
                }

                // 不允许包含正序或逆序用户名
                if (!containUN) {
                    if (validator.checkContainUserName(pwd, user.name)) {
                        return containUNTip;
                    }
                }
                return true;
            };

            $scope.oldPassword = {
                "id": "modifyPwdOldId",
                "label": $scope.i18n.common_term_oldPsw_label + colon,
                "require": true,
                "value": "",
                "type": "password",
                "readonly": false,
                "validate": "required:" + $scope.i18n.common_term_null_valid
            };
            $scope.password = {
                "id": "modifyPwdId",
                "label": $scope.i18n.common_term_newPsw_label + colon,
                "require": true,
                "value": "",
                "type": "password",
                "readonly": false,
                "tooltip": "",
                "extendFunction": ["pwdCheck"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdCheck(modifyPwdId)"
            };
            $scope.confirmPassword = {
                "id": "confirmPwdId",
                "label": $scope.i18n.common_term_newPswConfirm_label + colon,
                "require": true,
                "value": "",
                "type": "password",
                "readonly": false,
                "extendFunction": ["infoPwdEqual"],
                "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
            };
            UnifyValid.infoPwdEqual = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.confirmPassword.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //获取参数
            function getParams() {
                var oldPwd = $.trim($("#modifyPwdOldId").widget().getValue());
                var newPwd = $.trim($("#modifyPwdId").widget().getValue());
                var confirmPwd = $.trim($("#confirmPwdId").widget().getValue());
                if (newPwd !== confirmPwd) {
                    return null;
                }
                var pwdInfo = {
                    "oldPassword": oldPwd,
                    "password": newPwd
                };
                return JSON.stringify(pwdInfo);
            }

            $scope.modifyBtn = {
                "id": "modifyPwdModifyBtnId",
                "text": $scope.i18n.user_term_modify_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#modifyPassword"));
                    if (!result) {
                        return;
                    }

                    var params = getParams();
                    if (!params) {
                        return;
                    }
                    var deferred = camel.put({
                        "url": {
                            "s": "/goku/rest/v1.5/{vdc_id}/users/{id}/password?action={value}",
                            "o": {
                                "vdc_id": user.vdcId,
                                "id": user.id,
                                "value": "modify"
                            }
                        },
                        "params": getParams(),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $("#modifyPwdWindowId").widget().destroy();
                            var content = $scope.i18n.common_term_operationSucceed_msg;
                            var successMsg = new Message({
                                "type": "prompt",
                                "content": content,
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
            $scope.cancelBtn = {
                "id": "modifyPwdCancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifyPwdWindowId").widget().destroy();
                }
            };

            $scope.getPasswordPolicy = function () {
                var deferred = camel.get({
                    url: "/goku/rest/v1.5/system/password-policy",
                    "params": {
                    },
                    "userId": user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {
                        if (response && response.pwdPolicy) {
                            $scope.pwdPolicy = response.pwdPolicy;
                            // 修改密码框的提示信息
                            var minLength = $scope.pwdPolicy.minPasswordLength;
                            var maxLength = $scope.pwdPolicy.maxPasswordLength;
                            var containSC = $scope.pwdPolicy.requireSymbols;
                            var containUN = $scope.pwdPolicy.allowUserName;
                            var tmpLengthTip = $scope.i18n.sprintf(pwdLengthTip,{1:minLength,2:maxLength});
                            var newTip = mustContainTip;
                            var tipNumber = 1;
                            if (containSC) {
                                newTip = newTip + "," + containSCTip;
                                tipNumber++;
                            }
                            if (!containUN) {
                                if (tipNumber === 2) {
                                    newTip += "<br>";
                                }
                                newTip = newTip + "," + containUNTip;
                                tipNumber++;
                            }
                            if (tipNumber === 2) {
                                newTip += "<br>";
                            }
                            newTip = newTip + "," + tmpLengthTip + "。";

                            $("#" + $scope.password.id).widget().option("tooltip", newTip);
                        }
                    });
                });
            };

            if(!$scope.openstack){
                $scope.getPasswordPolicy();
            }
        }];

        var dependency = ["ng", "wcc", fm.name];
        var app = angular.module("userMgr.user.modifyPassword", dependency);
        app.controller("userMgr.user.modifyPassword.ctrl", modifyPasswordCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    });