/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-27
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/exceptionService",
    "app/business/system/services/backupSettingService",
    "app/services/httpService",
    "app/framework/directive/directiveFM",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "tiny-directives/RadioGroup",
    "tiny-directives/Button",
    "fixtures/systemFixture"],

    function ($, angular, UnifyValid, ValidatorService, ExceptionService, BackupSettingService, http, fm) {
        "use strict";
        var configServerCtrl = ["$scope", "$compile", "camel", "$q", function ($scope, $compile, camel, $q) {
            var configFTPServerWindow = $("#configFTPServerId").widget();
            var params = configFTPServerWindow.option("params");
            $scope.ftp = params || {protocol: "FTPS", port: 21};


            var exceptionService = new ExceptionService();
            var backupSettingService = new BackupSettingService(exceptionService, $q, camel);
            var validatorService = new ValidatorService();

            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;
            var i18n = $scope.i18n = $rootScope.i18n;

            UnifyValid.notZero = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return val != "0";
            };
            UnifyValid.ipFormatCheck = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                return validatorService.ipFormatCheck(val);
            };
            UnifyValid.confirmPWD = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                var reVal = $("#re" + id).widget().getValue();
                return val === reVal;
            };

            //IP地址
            $scope.ip = {
                "id": "ipId",
                "label": i18n.common_term_IP_label + ":",
                "width": "150",
                "type": "ipv4",
                "focused": true,
                "require": true,
                "extendFunction": ["ipFormatCheck"],
                "validate": "required:" + i18n.common_term_null_valid
                    + ";ipFormatCheck(ipId):" + i18n.common_term_formatIP_valid
            };

            //用户名
            $scope.userName = {
                "id": "userNameId",
                "label": i18n.common_term_userName_label + ":",
                "require": true,
                "validate": "required:" + i18n.common_term_null_valid
                + ";maxSize(128):"+ i18n.sprintf(i18n.common_term_maxLength_valid, 128)
            };

            var getPWDValidate = function (require, same) {
                var validate = [];
                var requireValidate = "required:" + i18n.common_term_null_valid;
                var sameValidate = "confirmPWD(passwordId):" + i18n.common_term_pswDifferent_valid;
                require && (validate.push(requireValidate));
                same && (validate.push(sameValidate));
                validate.push("maxSize(128):"+ i18n.sprintf(i18n.common_term_maxLength_valid, 128));
                return validate.join(";");
            };

            //密码
            $scope.password = {
                "id": "passwordId",
                "label": i18n.common_term_psw_label + ":",
                "type": "password",
                'disable': false,
                "require": true,
                "extendFunction": ["confirmPWD"],
                "validate": getPWDValidate(true, false)
            };

            //确认密码
            $scope.repassword = {
                "id": "repasswordId",
                "label": (i18n.common_term_PswConfirm_label || "确认密码") + ":",
                "type": "password",
                'disable': false,
                "require": true,
                "extendFunction": ["confirmPWD"],
                "validate": getPWDValidate(true, true)
            };

            //端口号
            $scope.port = {
                "id": "portId",
                "label": i18n.common_term_port_label + ":",
                "require": true,
                "extendFunction": ["notZero"],
                "validate": "required:" + i18n.common_term_null_valid
                    + ";integer:" + i18n.common_term_PositiveIntegers_valid
                    + ";port:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535)
                    + ";notZero(portId):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535)
            };

            //协议类型
            $scope.protocol = {
                "id": "protocolId",
                "label": i18n.common_term_protocolType_label + ":",
                "spacing": {"width": "1px", "height": "10px"},
                "values": [
                    {
                        "key": "FTPS",
                        "text": "FTPS",
                        "checked": "FTP" !== $scope.ftp.protocol
                    },
                    {
                        "key": "FTP",
                        "text": "FTP",
                        "checked": "FTP" === $scope.ftp.protocol
                    }
                ],
                "layout": "horizon",
                "change": function () {
                    $scope.ftp.protocol = $("#protocolId").widget().opChecked("checked");
                }
            };
            var formDataToServer = function (callback) {
                if (UnifyValid.FormValid($("#configServerDiv"))) {
                    var params = {
                        ip: $("#" + $scope.ip.id).widget().getValue(),
                        userName: $("#" + $scope.userName.id).widget().getValue(),
                        port: $("#" + $scope.port.id).widget().getValue(),
                        pwd : $("#" + $scope.password.id).widget().getValue(),
                        protocol: $scope.ftp.protocol
                    };
                    callback && callback(userId, JSON.stringify({ftpInfo: params}));
                }
            };

            $scope.saveBtn = {
                "id": "saveBtnId",
                "text": i18n.common_term_save_label,
                "save": function () {
                    formDataToServer(function (userId, params) {
                        var promise = backupSettingService.saveFTP(userId, params);
                        promise.then(function (reslovedValue) {
                            configFTPServerWindow.destroy();
                        });
                    });
                }
            };

            $scope.closeBtn = {
                "id": "closeBtn",
                "text": i18n.common_term_shut_button,
                "close": function () {
                    configFTPServerWindow.destroy();
                }
            };
        }];

        var dependency = ['ng', 'wcc', fm.name];
        var configServerModule = angular.module("configServerModule", dependency);
        configServerModule.controller("configServerCtrl", configServerCtrl);
        configServerModule.service("camel", http);
        return configServerModule;

    });