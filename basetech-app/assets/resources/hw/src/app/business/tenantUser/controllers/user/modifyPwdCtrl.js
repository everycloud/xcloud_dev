define([
        "sprintf",
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "tiny-widgets/Message",
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "tiny-common/UnifyValid",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/tenantUserFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, Message, exceptionService, userDomainService, UnifyValid) {
        "use strict";
        var modifyPwdCtrl = ['$scope', '$q', 'camel', 'exception',
            function ($scope, $q, camel, exception) {
                //公共服务实例
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                $scope.operatePassword = {
                    "id": "resetPwdOldId",
                    "label": $scope.i18n.common_term_yourPsw_label + ":",
                    "require": true,
                    "value": "",
                    "type": "password",
                    "readonly": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                };

                $scope.password = {
                    "id": "newPwdId",
                    "label": i18n.common_term_psw_label + ":",
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disabled": false
                    //"tips" : "密码必须包含大写字母、小写字母和数字中的至少两种字符，必须包含特殊字符，长度范围是8个～32个字符。",
                    //"validate" : "required:不能为空;minSize(8):不能少于8个字符;maxSize(20):不能超过32个字符;"
                };
                $scope.confirmPassword = {
                    "id": "confirmNewPwdId",
                    "label": i18n.common_term_newPswConfirm_label + ":",
                    "require": true,
                    "value": "",
                    "type": "password",
                    "disable": true,
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "infoPwdEqual:"+i18n.common_term_pswDifferent_valid
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
                    var operatePwd = $("#"+$scope.operatePassword.id).widget().getValue();
                    var newPwd = $("#newPwdId").widget().getValue();
                    var confirmPwd = $("#confirmNewPwdId").widget().getValue();
                    if (newPwd !== confirmPwd) {
                        return null;
                    }
                    return {
                        "password": newPwd,
                        "operateUserPaswd":operatePwd
                    };
                }
                $scope.resetBtn = {
                    "id": "resetPwdBtnId",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($("#modifyPwdDiv"))) {
                            return;
                        }
                        var params = getParams();
                        if (params === null) {
                            return;
                        }
                        var options = {
                            "params": params,
                            "id": $("#modifyPwdWindowId").widget().option("userId"),
                            "value": "reset",
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var deferred = serviceInstance.resetPwd(options);
                        deferred.then(function (response) {
                            $("#modifyPwdWindowId").widget().destroy();
                            var successMsg = new Message({
                                "type": "prompt",
                                "content": i18n.common_term_operationSucceed_msg,
                                "height": 100,
                                "width": 300
                            });
                            successMsg.show();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyPwdWindowId").widget().destroy();
                    }
                };
            }
        ];
        var app = angular.module("userMgr.user.modifyPwd", ['ng', "wcc", "ngSanitize"]);
        app.controller("userMgr.user.modifyPwd.ctrl", modifyPwdCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        return app;
    });
