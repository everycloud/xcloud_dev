/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-11

 */
define(['tiny-lib/angular',
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService"
],
    function (angular, httpService, UnifyValid, constants, ExceptionService) {
        "use strict";
        var modifySmmPsswdCtrl = ['$scope', 'camel', function ($scope, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.rackName = $("#modifySmmPsswdWindow").widget().option("rackName");
            $scope.username = $("#modifySmmPsswdWindow").widget().option("username");
            $scope.rackId = $("#modifySmmPsswdWindow").widget().option("rackId");
            $scope.modifyParams = {
                "deviceId": $scope.rackId
            };
            $scope.i18n = $("html").scope().i18n;
            //两次输入密码是否一致校验
            UnifyValid.pwdEqual = function () {
                if ($("#" + $scope.newPsswd.id).widget().getValue() === $("#" + $scope.confirmNewPsswd.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.rackNameItem = {
                "label": $scope.i18n.device_term_subrack_label + ":",
                "require": "false",
                "id": "rackName"
            };
            $scope.usernameItem = {
                "label": $scope.i18n.common_term_userName_label + ":",
                "require": "false",
                "id": "username"
            };
            $scope.originalPsswd = {
                "label": $scope.i18n.common_term_oldPsw_label + ":",
                "require": "true",
                "id": "originalPsswd",
                "type": "password",
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})

            };
            $scope.newPsswd = {
                "label": $scope.i18n.common_term_newPsw_label + ":",
                "require": "true",
                "id": "newPsswd",
                "type": "password",
                "value": "",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
            };
            $scope.confirmNewPsswd = {
                "label": $scope.i18n.common_term_newPswConfirm_label + ":",
                "require": "true",
                "id": "confirmNewPsswd",
                "type": "password",
                "value": "",
                "extendFunction": ["pwdEqual"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
            };
            $scope.okBtn = {
                "id": "modSmmPsswdConfirm",
                "text": $scope.i18n.common_term_ok_button,
                click: function () {
                    //校验
                    var result = UnifyValid.FormValid($("#modifySmmPsswdDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.modifyParams.oldPassword = $("#" + $scope.originalPsswd.id).widget().getValue();
                    $scope.modifyParams.newPassword = $("#" + $scope.newPsswd.id).widget().getValue();
                    $scope.operate.modifySMMpassword($scope.modifyParams);
                }
            };
            $scope.cancelBtn = {
                "id": "modSmmPsswdCancel",
                "text": $scope.i18n.common_term_cancle_button,
                click: function () {
                    $("#modifySmmPsswdWindow").widget().destroy();
                }

            };
            $scope.operate = {
                modifySMMpassword: function (params) {
                    var modifyConfig = constants.rest.SMM_PWD_MODIFY;
                    var deferred = camel.put({
                        "url": modifyConfig.url,
                        "type": modifyConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $("#modifySmmPsswdWindow").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }

        }];
        var dependency = ['ng', 'wcc'];
        var modifySmmPsswdModule = angular.module("modifySmmPsswdModule", dependency);
        modifySmmPsswdModule.controller("modifySmmPsswdCtrl", modifySmmPsswdCtrl);
        modifySmmPsswdModule.service("camel", httpService);
        return modifySmmPsswdModule;
    });

