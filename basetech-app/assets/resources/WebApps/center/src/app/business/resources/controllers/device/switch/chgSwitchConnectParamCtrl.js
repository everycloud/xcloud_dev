/**
 *
 */
/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-10-30

 */
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    'app/business/resources/controllers/device/constants',
    "app/services/exceptionService",
    'tiny-widgets/Window'],
    function ($, angular, httpService, validatorService, UnifyValid, deviceConstants, ExceptionService, Window) {
        "use strict";
        var chgSwitchConnectParamCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            var name = $("#chgConnectParamWin").widget().option("name");
            var connectIP;
            $scope.i18n = $("html").scope().i18n;
            //连接参数模型
            $scope.connectParams = {

                ethSwitchSshInfoVo: {},
                ethSwitchSnmpInfoVo: {}
            };

            //snmp版本
            $scope.isSnmpV3 = false;
            $scope.formfieldWidth = "215px";
            //ssh协议两次输入密码是否一致校验
            UnifyValid.infoPwdEqual = function () {
                if ($("#" + $scope.basicInfo.password.id).widget().getValue() === $("#" + $scope.basicInfo.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp认证协议两次输入密码是否一致校验
            UnifyValid.snmpAuthPwdEqual = function () {
                if ($("#" + $scope.param.authPassword.id).widget().getValue() === $("#" + $scope.param.authPasswordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp数据加密协议两次输入密码是否一致校验
            UnifyValid.snmpEncrptPwdEqual = function () {
                if ($("#" + $scope.param.encrptPassword.id).widget().getValue() === $("#" + $scope.param.encrptPasswordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //基本信息
            $scope.basicInfo = {

                protocol: {
                    "id": "protocol",
                    "label": $scope.i18n.device_term_connectProtocol_label + ":",
                    "require": "false",
                    value: "ssh",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                portId: {
                    "id": "portId",
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "value": "22",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                username: {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "id": "username",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                password: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "password",
                    "type": "password",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                passwordConfirm: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "confirmPassword",
                    "type": "password",
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                }
            };
            $scope.param = {
                version: {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "require": "false",
                    "id": "versionSelect",
                    "value": $scope.checkSnmpVersion
                },
                readCommunity: {
                    "label": $scope.i18n.device_term_readCommunityName_label + ":",
                    "require": "true",
                    "id": "readCommunity",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                writeCommunity: {
                    "label": $scope.i18n.device_term_writeCommunityName_label + ":",
                    "require": "true",
                    "id": "writeCommunity",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                security: {
                    "id": "security",
                    "label": $scope.i18n.common_term_secuUserName_label + ":",
                    "require": "true",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                authProtocol: {
                    "label": $scope.i18n.common_term_authProtocol_label + ":",
                    "require": "true",
                    "id": "authProtocol",
                    "values": [
                        {
                            selectId: 'HMACMD5',
                            label: 'HMACMD5'
                        },
                        {
                            selectId: 'HMACSHA',
                            label: 'HMACSHA',
                            checked: true
                        }
                    ],
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "HMACSHA"})
                },
                authPassword: {
                    "label": $scope.i18n.common_term_authenticPsw_label + ":",
                    "require": "true",
                    "id": "authPassword",
                    "type": "password",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                authPasswordConfirm: {
                    "label": $scope.i18n.common_term_authenticPswConfirm_label + ":",
                    "require": "true",
                    "id": "confirmAuthPassword",
                    "type": "password",
                    "value": "",
                    "extendFunction": ["snmpAuthPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpAuthPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                encrptProtocol: {
                    "label": $scope.i18n.common_term_encrypProtocol_label + ":",
                    "require": "true",
                    "id": "encrptProtocol",
                    "values": [
                        {
                            selectId: 'DES',
                            label: 'DES'
                        },
                        {
                            selectId: 'AES128',
                            label: 'AES128',
                            checked: true
                        }
                    ],
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "AES128"})
                },
                encrptPassword: {
                    "label": $scope.i18n.common_term_DDAPsw_label + ":",
                    "require": "true",
                    "id": "encrptPassword",
                    "type": "password",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                encrptPasswordConfirm: {
                    "label": $scope.i18n.common_term_DDAPswConfirm_label + ":",
                    "require": "true",
                    "id": "confirmEncrptPassword",
                    "type": "password",
                    "value": "",
                    "extendFunction": ["snmpEncrptPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpEncrptPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                }
            };
            $scope.modifyBtn = {
                "id": "modifyBtn",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    //校验

                    var result = UnifyValid.FormValid($("#chgConnectParamDiv"));
                    if (!result) {
                        return;
                    }

                    //从页面上取数据，已完成
                    $scope.connectParams.ethSwitchSshInfoVo.port = $("#" + $scope.basicInfo.portId.id).widget().getValue();
                    $scope.connectParams.ethSwitchSshInfoVo.userName = $("#" + $scope.basicInfo.username.id).widget().getValue();
                    $scope.connectParams.ethSwitchSshInfoVo.password = $("#" + $scope.basicInfo.password.id).widget().getValue();

                    if ($scope.isSnmpV3) {
                        $scope.connectParams.ethSwitchSnmpInfoVo.secName = $("#" + $scope.param.security.id).widget().getValue();
                        $scope.connectParams.ethSwitchSnmpInfoVo.authProtocol = $("#" + $scope.param.authProtocol.id).widget().getSelectedId();
                        $scope.connectParams.ethSwitchSnmpInfoVo.authPassword = $("#" + $scope.param.authPassword.id).widget().getValue();
                        $scope.connectParams.ethSwitchSnmpInfoVo.encryptProtocol = $("#" + $scope.param.encrptProtocol.id).widget().getSelectedId();
                        $scope.connectParams.ethSwitchSnmpInfoVo.encryptPassword = $("#" + $scope.param.encrptPassword.id).widget().getValue();
                    }
                    else {
                        $scope.connectParams.ethSwitchSnmpInfoVo.readComm = $("#" + $scope.param.readCommunity.id).widget().getValue();
                        $scope.connectParams.ethSwitchSnmpInfoVo.writeComm = $("#" + $scope.param.writeCommunity.id).widget().getValue();
                    }
                    $scope.operate.update($scope.connectParams);
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#chgConnectParamWin").widget().destroy();
                }
            };
            $scope.operate = {
                "query": function () {
                    var queryConfig = deviceConstants.rest.SWITCH_DETAIL_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"id": name}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });

                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            //对于向后台传的数据，需要从查询交换机详情里获取一些字段再传
                            $scope.connectParams.ethSwitchSshInfoVo.ip = response.ip;
                            $scope.connectParams.ethSwitchSnmpInfoVo.ip = response.ip;
                            $scope.connectParams.ethSwitchSnmpInfoVo.version = response.snmpVersion;
                            $scope.connectParams.ethSwitchSnmpInfoVo.port = response.snmpPort;

                            connectIP = response.ip;

                            $("#" + $scope.basicInfo.portId.id).widget().option("value", response.sshPort);
                            $("#" + $scope.basicInfo.username.id).widget().option("value", response.sshUserName);
                            $("#" + $scope.param.security.id).widget().option("value", response.snmpUserName);

                            $scope.checkSnmpVersion = response.snmpVersion;
                            if ($scope.checkSnmpVersion == "SNMPv3") {
                                $scope.isSnmpV3 = true;
                            }

                        });
                    });
                },

                "update": function (params) {
                    //接口待修改，根据UHM接口传递相关内容
                    var updateConfig = deviceConstants.rest.UPLINK_CONNECTS_PARAM_UPDATE
                    var deferred = camel.put({
                        "url": {s: updateConfig.url, o: {"id": connectIP}},
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#chgConnectParamWin").widget().destroy();
                        $("#refreshSwitch").click();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.query();

        }];
        var dependency = ['ng', 'wcc'];
        var chgSwitchConnectParamModule = angular.module("chgSwitchConnectParamModule", dependency);
        chgSwitchConnectParamModule.controller("chgSwitchConnectParamCtrl", chgSwitchConnectParamCtrl);
        chgSwitchConnectParamModule.service("camel", httpService);
        chgSwitchConnectParamModule.service("validator", validatorService);
        return chgSwitchConnectParamModule;
    });

