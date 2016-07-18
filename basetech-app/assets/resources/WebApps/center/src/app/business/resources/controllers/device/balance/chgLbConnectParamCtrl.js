/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-24

 */
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    'app/business/resources/controllers/device/constants',
    "app/services/exceptionService"],
    function ($, angular, httpService, validatorService, UnifyValid, deviceConstants, ExceptionService) {
        "use strict";
        var chgLbConnectParamCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var data = $("#chgConnectParamWin").widget().option("data");
            $scope.i18n = $("html").scope().i18n;
            //修改数据模型
            $scope.modifyParams = {
                "deviceIp": "",
                "peerIp": "",
                "portName": "",
                "accessPara": {},
                "businessCfg": {},
                "description": ""
            };

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
                if ($("#" + $scope.paramSetting.snmpAuthPassword.id).widget().getValue() === $("#" + $scope.paramSetting.snmpAuthPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp数据加密协议两次输入密码是否一致校验
            UnifyValid.snmpEncrptPwdEqual = function () {
                if ($("#" + $scope.paramSetting.snmpEncrptPassword.id).widget().getValue() === $("#" + $scope.paramSetting.snmpEncrptPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //基本信息
            $scope.basicInfo = {
                ip: {
                    "id": "ip",
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": "true",
                    "value": data.deviceIp,
                    "width": "215px",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                peerIp: {
                    "id": "peerIp",
                    "label": $scope.i18n.common_term_pairIP_label + ":",
                    "require": "false",
                    "value": data.peerIp,
                    "width": "215px"
                },
                protocol: {
                    "id": "protocol",
                    "label": $scope.i18n.device_term_connectProtocol_label + ":",
                    "require": false,
                    "value": "HTTPS"
                },
                portId: {
                    "id": "portId",
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "value": data.port,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                username: {
                    "id": "username",
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "value": data.userName,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                password: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "password",
                    "type": "password",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                passwordConfirm: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "pwdConfirm",
                    "type": "password",
                    "value": "",
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                description: {
                    "id": "description",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "type": "multi",
                    "height": "40px",
                    "require": "false",
                    "value": data.description,
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                }
            };

            //业务配置页面
            $scope.businessConfig = {
                interfaceType: {
                    "label": $scope.i18n.device_term_servicePortType_label + ":",
                    "require": "false",
                    "id": "interfaceType",
                    "values": [
                        {
                            selectId: '0',
                            label: 'Interface'
                        },
                        {
                            selectId: '1',
                            label: 'Trunk'
                        }
                    ],
                    "disable": true,
                    "width": "215px",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                interfaceName: {
                    "id": "interfaceName",
                    "label": $scope.i18n.device_term_servicePortName_label + ":",
                    "require": "true",
                    "disable": true,
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                maxThroughput: {
                    "id": "maxThroughput",
                    "label": $scope.i18n.device_term_resourcePoolMaxThroughput_label + "(Kbps):",
                    "require": "true",
                    "value": "1000000",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 10000000}) + ";maxValue(10000000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 10000000})
                },
                threshold: {
                    "id": "threshold",
                    "label": $scope.i18n.device_term_LBresourceAlarmThreshold_label + "(%)：",
                    "require": "true",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 100}) + ";maxValue(100):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 100})
                }
            };
            $scope.modifyBtn = {
                "id": "modifyBtn",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    //校验
                    var result = UnifyValid.FormValid($("#chgLbConnectParamDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.modifyParams.deviceIp = $("#" + $scope.basicInfo.ip.id).widget().getValue();
                    $scope.modifyParams.peerIp = $("#" + $scope.basicInfo.peerIp.id).widget().getValue();
                    $scope.modifyParams.description = $("#" + $scope.basicInfo.description.id).widget().getValue();
                    $scope.modifyParams.accessPara.port = $("#" + $scope.basicInfo.portId.id).widget().getValue();
                    $scope.modifyParams.accessPara.userName = $("#" + $scope.basicInfo.username.id).widget().getValue();
                    $scope.modifyParams.accessPara.passWord = $("#" + $scope.basicInfo.password.id).widget().getValue();
                    $scope.modifyParams.accessPara.protocol = 2;
                    $scope.modifyParams.businessCfg.businessInterfaceType = $("#" + $scope.businessConfig.interfaceType.id).widget().getSelectedId();
                    $scope.modifyParams.businessCfg.businessInterfaceName = $("#" + $scope.businessConfig.interfaceName.id).widget().getValue();
                    $scope.modifyParams.businessCfg.maxConcurrentConnect = 200;
                    $scope.modifyParams.businessCfg.maxThroughutCapacity = $("#" + $scope.businessConfig.maxThroughput.id).widget().getValue();
                    $scope.modifyParams.businessCfg.resouceAlarmThreshold = $("#" + $scope.businessConfig.threshold.id).widget().getValue();
                    $scope.operate.update($scope.modifyParams);
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
                "update": function (params) {
                    var updateConfig = deviceConstants.rest.LOAD_BALANCER_UPDATE
                    var deferred = camel.put({
                        "url": {s: updateConfig.url, o: {"deviceId": data.deviceId}},
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id,
                        "timeout": 30000
                    });
                    deferred.done(function (response) {
                        $("#chgConnectParamWin").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "getBusinessCfg": function (params) {
                    var queryConfig = deviceConstants.rest.LOAD_BALANCER_BUSINESS_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"deviceId": data.deviceId}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#" + $scope.businessConfig.interfaceType.id).widget().opChecked(response.interfaceType);
                        $("#" + $scope.businessConfig.interfaceName.id).widget().option("value", response.interfaceName);
                        $("#" + $scope.businessConfig.maxThroughput.id).widget().option("value", response.maxThoughout);
                        $("#" + $scope.businessConfig.threshold.id).widget().option("value", response.alarmThreshold);
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.getBusinessCfg();
        }];
        var dependency = ['ng', 'wcc'];
        var chgLbConnectParamModule = angular.module("chgLbConnectParamModule", dependency);
        chgLbConnectParamModule.controller("chgLbConnectParamCtrl", chgLbConnectParamCtrl);
        chgLbConnectParamModule.service("camel", httpService);
        chgLbConnectParamModule.service("validator", validatorService);
        return chgLbConnectParamModule;
    });

