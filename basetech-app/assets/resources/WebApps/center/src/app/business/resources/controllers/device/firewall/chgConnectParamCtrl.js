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
        var chgConnectParamCtrl = ["$scope", "$compile", "camel", "validator", function ($scope, $compile, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            var fwId = $("#chgConnectParamWin").widget().option("deviceId");
            var zoneInfo = $("#chgConnectParamWin").widget().option("zoneInfo");
            $scope.i18n = $("html").scope().i18n;
            //连接参数模型
            $scope.connectParams = {
                "fwId": fwId
            };

            //snmp版本
            $scope.isSnmpV3 = false;
            $scope.formfieldWidth ="215px";
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
                ip: {
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": "true",
                    "id": "ip",
                    "type": "ipv4",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
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
                },
                networkType: {
                    "label": $scope.i18n.device_term_networkingType_label + ":",
                    "require": "true",
                    "id": "networkType",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                zone: {
                    "label": $scope.i18n.resource_term_zone_label + ":",
                    "require": "true",
                    "id": "zoneSelect",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                room: {
                    "id": "room",
                    "label": $scope.i18n.device_term_room_label + ":",
                    "values": [],
                    "valuesFrom": "local",
                    "matchMethod": "any-nocap",
                    "tooltip": $scope.i18n.device_term_inputOrSelectRoomName_label,
                    "require": "true",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                    "select": function () {
                        var roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $scope.operate.getCabinet(roomName);
                    }
                },
                cabinet: {
                    "id": "cabinet",
                    "label": $scope.i18n.device_term_cabinet_label + ":",
                    "require": "true",
                    "value": "",
                    "values": [],
                    "valuesFrom": "local",
                    "matchMethod": "any-nocap",
                    "tooltip": $scope.i18n.device_term_inputOrSelectCabName_label,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                subrack: {
                    "id": "subrack",
                    "label": $scope.i18n.device_term_subrack_label + ":",
                    "require": "true",
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + $scope.i18n.common_term_composition2_valid,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                description: {
                    "id": "description",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "type": "multi",
                    "height": "40px",
                    "require": "false",
                    "value": "",
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                }
            };
            $scope.param = {
                version: {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "require": "true",
                    "id": "versionSelect",
                    "values": [
                        {
                            "selectId": 'v1',
                            "label": 'V1'
                        },
                        {
                            "selectId": 'v2',
                            "label": 'V2'
                        },
                        {
                            "selectId": 'v3',
                            "label": 'V3'
                        }
                    ],
                    "value": "",
                    "change": function () {
                        if ("v3" == $("#" + $scope.param.version.id).widget().getSelectedId()) {
                            $scope.isSnmpV3 = true;
                        }
                        else {
                            $scope.isSnmpV3 = false
                        }
                    }
                },
                port: {
                    "id": "port",
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "value": "161",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                timeout: {
                    "label": $scope.i18n.device_term_timeout_label + "(S):",
                    "require": "true",
                    "id": "timeout",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60})
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
                            label: 'HMACSHA'
                        }
                    ]
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
                            label: 'AES128'
                        }
                    ],
                    "validate": "required:" + $scope.i18n.common_term_null_valid
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
                    $scope.connectParams.mgntIpv4Addr = $("#" + $scope.basicInfo.ip.id).widget().getValue();
                    $scope.connectParams.roomId = $("#" + $scope.basicInfo.room.id).widget().getValue();
                    $scope.connectParams.rackId = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                    $scope.connectParams.subrackId = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                    $scope.connectParams.userId = $("#" + $scope.basicInfo.username.id).widget().getValue();
                    $scope.connectParams.passwd = $("#" + $scope.basicInfo.password.id).widget().getValue();
                    $scope.connectParams.sshPort = $("#" + $scope.basicInfo.portId.id).widget().getValue();
                    $scope.connectParams.description = $("#" + $scope.basicInfo.description.id).widget().getValue();
                    $scope.connectParams.snmpVersion = $("#" + $scope.param.version.id).widget().getSelectedId();
                    $scope.connectParams.snmpPort = $("#" + $scope.param.port.id).widget().getValue();
                    $scope.connectParams.snmpTimeout = $("#" + $scope.param.timeout.id).widget().getValue();
                    if ($scope.isSnmpV3) {
                        $scope.connectParams.snmpSecurityName = $("#" + $scope.param.security.id).widget().getValue();
                        $scope.connectParams.snmpAuthProtocol = $("#" + $scope.param.authProtocol.id).widget().getSelectedId();
                        $scope.connectParams.snmpAuthPwd = $("#" + $scope.param.authPassword.id).widget().getValue();
                        $scope.connectParams.snmpEncryptProtocol = $("#" + $scope.param.encrptProtocol.id).widget().getSelectedId();
                        $scope.connectParams.snmpEncryptPwd = $("#" + $scope.param.encrptPassword.id).widget().getValue();
                    }
                    else {
                        $scope.connectParams.snmpReadComm = $("#" + $scope.param.readCommunity.id).widget().getValue();
                        $scope.connectParams.snmpWriteComm = $("#" + $scope.param.writeCommunity.id).widget().getValue();
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
                    var queryConfig = deviceConstants.rest.FW_CONNECTOR_INFO
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"fwid": fwId}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.connectParams.hrpStatus = response.hrpStatus;
                            $("#" + $scope.basicInfo.ip.id).widget().option("value", response.mgntIpv4Addr);
                            $("#" + $scope.basicInfo.portId.id).widget().option("value", response.sshPort);
                            $("#" + $scope.basicInfo.username.id).widget().option("value", response.userId);
                            $scope.basicInfo.zone.value = zoneInfo[response.zoneId];
                            $scope.basicInfo.networkType.value = response.networkType;
                            $("#" + $scope.basicInfo.room.id).widget().option("value", response.roomId);
                            $("#" + $scope.basicInfo.cabinet.id).widget().option("value", response.rackId);
                            $("#" + $scope.basicInfo.subrack.id).widget().option("value", response.subrackId);
                            $("#" + $scope.basicInfo.description.id).widget().option("value", response.description);
                            $("#" + $scope.param.version.id).widget().opChecked(response.snmpVersion);
                            $("#" + $scope.param.port.id).widget().option("value", response.snmpPort);
                            $("#" + $scope.param.timeout.id).widget().option("value", response.snmpTimeout);
                            $scope.isSnmpV3 = 'v3' == response.snmpVersion;
                            if ($scope.isSnmpV3) {
                                $("#" + $scope.param.security.id).widget().option("value", response.snmpSecurityName);
                                $("#" + $scope.param.authProtocol.id).widget().opChecked(response.snmpAuthProtocol);
                                $("#" + $scope.param.encrptProtocol.id).widget().opChecked(response.snmpEncryptProtocol);
                            }
                            else {
                                $("#" + $scope.param.readCommunity.id).widget().option("value", response.snmpReadComm);
                                $("#" + $scope.param.writeCommunity.id).widget().option("value", response.snmpWriteComm);
                            }
                        });
                    });
                },
                initRoom: function () {
                    //查询构造机房信息
                    var config = deviceConstants.rest.ROOM_QUERY;
                    var deferred = camel.get({
                        url: {s: config.url, o: {"start": "", "limit": "", "room_name": ""}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var rooms = response.roomList;
                        var availableRooms = [];
                        for (var index in rooms) {
                            availableRooms.push(rooms[index].roomName);
                        }
                        //延时一会，防止控件还没有生产
                        setTimeout(function () {
                            $("#" + $scope.basicInfo.room.id).widget().option("values", availableRooms);
                        }, 1000);
                    });
                },
                getCabinet: function (roomName) {
                    var config = deviceConstants.rest.CABINET_QUERY_BY_ROOM;
                    var deferred = camel.get({
                        "url": {s: config.url, o: {"room_name": roomName, "start": "", "limit": "", "sort": "", "order": ""}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var racks = response.rackList;
                        var availableRacks = [];
                        for (var index in racks) {
                            availableRacks.push(racks[index].rackName);
                        }
                        $("#" + $scope.basicInfo.cabinet.id).widget().option("values", availableRacks);
                    });
                },
                "update": function (params) {
                    var updateConfig = deviceConstants.rest.FW_CONNECTOR_UPDATE
                    var deferred = camel.put({
                        "url": updateConfig.url,
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#chgConnectParamWin").widget().destroy();
                        $("#refreshFirewall").click();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.query();
            $scope.operate.initRoom();
        }];
        var dependency = ['ng', 'wcc'];
        var chgConnectParamModule = angular.module("chgConnectParamModule", dependency);
        chgConnectParamModule.controller("chgConnectParamCtrl", chgConnectParamCtrl);
        chgConnectParamModule.service("camel", httpService);
        chgConnectParamModule.service("validator", validatorService);
        return chgConnectParamModule;
    });

