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
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/system/services/backupSettingService",
    "app/framework/directive/directiveFM",
    "tiny-directives/IP",
    "tiny-directives/Checkbox",
    "fixtures/systemFixture"],

    function ($, angular, UnifyValid, ValidatorService, http, ExceptionService, BackupSettingService, fm) {
        "use strict";
        var dependency = ['ng', 'wcc'];

        var configBackupCtrl = ["$scope", "$q", "camel", function ($scope, $q, camel) {
            var backupWinWidget = $("#backupWin").widget();
            $scope.params = backupWinWidget.option("params");
            var type = backupWinWidget.option("vServerType");
            var hasVServer = !!($scope.params && $scope.params.serverAddress);

            var exceptionService = new ExceptionService();
            var backupSettingService = new BackupSettingService(exceptionService, $q, camel);
            var validatorService = new ValidatorService();

            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;
            var i18n = $scope.i18n = $rootScope.i18n;

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

            var vServerConfig = {
                "HYPER_DP": "HyperDP",
                "COMM_VAULT": "CommVault"
            };

            //使用华为备份系统服务器
            $scope.backupSystem = {
                "id": "backupSystemId",
                "text": i18n.sys_backup_set_para_enableHWbackup_label,
                "value": "1",
                "checked": hasVServer,
                "change": function () {
                    var result = $scope.backupSystem.checked;
                    $scope.serverAddress.disable = result;
                    $scope.userName.disable = result;
                    $scope.changePWD.disable = result;
                    if ($scope.changePWD.checked) {
                        $scope.password.disable = result;
                        $scope.repassword.disable = result;
                    }

                    $scope.backupSystem.checked = !result;
                }
            };

            //服务器名称
            $scope.serverAddress = {
                "id": "serverAddressId",
                "label": i18n.device_term_serverName_label + ":",
                "require": true,
                "disable": !hasVServer,
                "validate": "required:" + i18n.common_term_null_valid
                    + ";maxSize(64):"+ i18n.sprintf(i18n.common_term_maxLength_valid, 64)
            };

            //用户名
            $scope.userName = {
                "id": "userNameId",
                "label": i18n.common_term_userName_label + ":",
                "require": true,
                "disable": !hasVServer,
                "validate": "required:" + i18n.common_term_null_valid
                    + ";maxSize(64):"+ i18n.sprintf(i18n.common_term_maxLength_valid, 64)
            };

            var getPWDValidate = function (require, same) {
                var validate = [];
                var requireValidate = "required:" + i18n.common_term_null_valid;
                var sameValidate = "confirmPWD(passwordId):" + i18n.common_term_pswDifferent_valid;
                require && (validate.push(requireValidate));
                same && (validate.push(sameValidate));
                validate.push("maxSize(64):"+ i18n.sprintf(i18n.common_term_maxLength_valid, 64));
                return validate.join(";");
            };

            //修改密码
            $scope.changePWD = {
                "id": "changePWDId",
                "text": i18n.common_term_modifyPsw_button,
                "disable": false,
                "checked": !hasVServer,
                "display": hasVServer,
                "change": function () {
                    var result = $scope.changePWD.checked;
                    $scope.password.disable = result;
                    $scope.repassword.disable = result;

                    $scope.changePWD.checked = !result;
                }
            };

            //密码
            $scope.password = {
                "id": "passwordId",
                "label": i18n.common_term_psw_label + ":",
                "type": "password",
                'disable': true,
                "require": true,
                "validate": getPWDValidate(true, false)
            };

            //确认密码
            $scope.repassword = {
                "id": "repasswordId",
                "label": i18n.common_term_PswConfirm_label + ":",
                "type": "password",
                'disable': true,
                "require": true,
                "extendFunction": ["confirmPWD"],
                "validate": getPWDValidate(true, true)
            };

            if (type === vServerConfig.HYPER_DP) {
                $scope.serverAddress.type = "ipv4";
                $scope.serverAddress.width = "150";
                $scope.serverAddress.label = i18n.common_term_IP_label + ":";
                $scope.serverAddress.extendFunction = ["ipFormatCheck"];
                $scope.serverAddress.validate = "required:" + i18n.common_term_null_valid + ";ipFormatCheck(serverAddressId):" + i18n.common_term_formatIP_valid;

                //使用华为备份系统服务器
                $scope.backupSystem.text = i18n.sys_backup_set_para_enableHWbackup_label;
            } else {
                //使用CommVault备份服务器
                $scope.backupSystem.text = i18n.sys_backup_set_para_enableCommVault_label;
            }

            $scope.saveBtn = {
                "id": "saveBtnId",
                "text": i18n.common_term_save_label,
                "save": function () {
                    var userVServerCheckboxWidget = $("#" + $scope.backupSystem.id).widget();
                    var useChecked = userVServerCheckboxWidget.option("checked");
                    if (useChecked || hasVServer) {
                        //使用或者没有配置过的时候,需要交互服务器
                        var methodConfig = {
                            add: "post",
                            del: "delete",
                            modify: "put"
                        };
                        var method;
                        var options = {};
                        if (useChecked && UnifyValid.FormValid($("#configBackupDiv"))) {
                            //增改
                            method = hasVServer ? methodConfig.modify : methodConfig.add;
                            var data = {
                                type: type,
                                serverAddress: $("#" + $scope.serverAddress.id).widget().getValue(),
                                userName: $("#" + $scope.userName.id).widget().getValue()
                            };
                            var pwd = $("#" + $scope.password.id).widget().getValue();
                            pwd && $scope.changePWD.checked && (data.password = pwd);
                            options.params = JSON.stringify(data);
                            $scope.operator.writeVServer(method, options);
                        } else if (!useChecked) {
                            //删
                            method = methodConfig.del;
                            options.search = "?type=" + type;
                            $scope.operator.writeVServer(method, options);
                        }
                    } else {
                        //本来就没有，不必删
                        backupWinWidget.destroy();
                    }
                }
            };

            $scope.closeBtn = {
                "id": "closeBtn",
                "text": i18n.common_term_shut_button,
                "close": function () {
                    backupWinWidget.destroy();
                }
            };

            $scope.operator = {
                writeVServer: function (method, options) {
                    var promise = backupSettingService.vmOperator({
                        method: method,
                        orgId: 1,
                        userId: userId,
                        params: options.params,
                        search: options.search || ""
                    });
                    promise.then(function () {
                        backupWinWidget.destroy();
                    });
                }
            };
        }];

        var dependency = ['ng', 'wcc', fm.name];
        var configBackupModule = angular.module("configBackupModule", dependency);
        configBackupModule.controller("configBackupCtrl", configBackupCtrl);
        configBackupModule.service("camel", http);
        return configBackupModule;
    });