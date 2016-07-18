/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-7

 */
define(['jquery',
    'tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService"],
    function ($, angular, UnifyValid, constants, deviceConstants, ExceptionService) {
        "use strict";

        var addRackCtrl = ["$scope", "$compile", "$state", "camel", "$rootScope", "validator", function ($scope, $compile, $state, camel, $rootScope, validator) {
                $scope.cloudType = $rootScope.user.cloudType;
                $scope.showBasicInfoPage = true;

                $scope.showParamSettingPage = false;

                $scope.showConfirmInfoPage = false;

                $scope.addHostStep1 = {
                    "url": "../src/app/business/resources/views/device/rack/addRack/basicInfo.html"
                };
                $scope.addHostStep2 = {
                    "url": "../src/app/business/resources/views/device/rack/addRack/paramSetting.html"
                };
                $scope.addHostStep3 = {
                    "url": "../src/app/business/resources/views/device/rack/addRack/confirmInfo.html"
                };

                $scope.addRackStep = {
                    "id": "addRackStepId",
                    "jumpable": "true",
                    "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_confirmInfo_label],
                    "width": "650"
                };
                $scope.formfieldWidth ="215px";
                //snmp认证协议两次输入密码是否一致校验
                UnifyValid.snmpAuthPwdEqual = function () {
                    if ($("#" + $scope.paramInfo.authPassword.id).widget().getValue() === $("#" + $scope.paramInfo.authPasswordConfirm.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                //snmp数据加密协议两次输入密码是否一致校验
                UnifyValid.snmpEncrptPwdEqual = function () {
                    if ($("#" + $scope.paramInfo.encrptPassword.id).widget().getValue() === $("#" + $scope.paramInfo.encrptPasswordConfirm.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };

                //判断SNMP的IP与SSH是否一致
                UnifyValid.ipEqual = function () {
                    if ($scope.snmpInfo.access && $scope.snmpInfo.disable) {
                        if ($("#" + $scope.paramInfo.snmpIp.id).widget().getValue() === $("#" + $scope.paramInfo.sshIp.id).widget().getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else {
                        return true;
                    }

                };
                //机框类型Map
                $scope.rackTypeMap = {};

                //支持的协议类型
                $scope.accessProtocol = [];
                $scope.trapProtocol = [];

                //冲突检测数据模型
                $scope.checkModel = {
                    "deviceType": 6,
                    "roomName": "",
                    "rackId": "",
                    "subRackId": ""
                };

                //接入机框数据模型
                $scope.createInfo = {
                    "name": "",
                    "chassisType": "",
                    "rackId": "",
                    "subRackId": "",
                    "zoneId": "",
                    "roomName": "",
                    "mm1IpAddr": "",
                    "mm2IpAddr": "",
                    "description": "",
                    "snmpConnectorParam": {}
                };
                //基本信息页面
                $scope.basicInfo = {
                    name: {
                        "id": "nameText",
                        "label": $scope.i18n.common_term_name_label + ":",
                        "require": "true",
                        "value": "",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName4Host + "):" +
                            $scope.i18n.common_term_composition3_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                        "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + " " + $scope.i18n.common_term_composition3_valid
                    },
                    model: {
                        "label": $scope.i18n.device_term_model_label + ":",
                        "require": "true",
                        "id": "modelSelect",
                        "values": [],
                        "height": "290",
                        "validate": "required:" + $scope.i18n.common_term_null_valid,
                        "change": function () {
                            var selectModelId = $("#" + $scope.basicInfo.model.id).widget().getSelectedId();
                            $scope.accessProtocol = $scope.rackTypeMap[selectModelId].accessProtocol;
                            var snmpProtocolList = [];
                            for (var index in $scope.accessProtocol) {
                                var protocol = {
                                    "selectId": deviceConstants.config.SNMP_PROTOCOL[$scope.accessProtocol[index]],
                                    "label": deviceConstants.config.SNMP_PROTOCOL[$scope.accessProtocol[index]],
                                    "checked": index == 0
                                }
                                snmpProtocolList.push(protocol);
                            }
                            $scope.paramInfo.version.values = snmpProtocolList;
                            $scope.trapProtocol = $scope.rackTypeMap[selectModelId].trapProtocol || [];
                            var snmpProtocolList = [];
                            for (var index in $scope.trapProtocol) {
                                var version = $scope.trapProtocol[index];
                                if (version.indexOf("SNMP") >= 0) {
                                    var protocol = {
                                        "selectId": version,
                                        "label": version
                                    }
                                    if (version.toUpperCase() == "SNMPV3") {
                                        $scope.isSNMPv3 = true;
                                        protocol.checked = true;
                                    }
                                    snmpProtocolList.push(protocol);
                                }
                            }
                            $scope.paramInfo.trapProtocol.values = snmpProtocolList;

                        }
                    },
                    zone: {
                        "label": $scope.i18n.resource_term_zone_label + ":",
                        "require": "true",
                        "values": [],
                        "value": "",
                        "height": 290,
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    room: {
                        "id": "roomText",
                        "label": $scope.i18n.device_term_room_label + ":",
                        "values": [],
                        "height": 290,
                        "valuesFrom": "local",
                        "matchMethod": "any-nocap",
                        "tooltip": $scope.i18n.device_term_inputOrSelectRoomName_label,
                        "require": "true",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                            $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                        "select": function () {
                            var selectRoomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                            $("#" + $scope.basicInfo.cabinet.id).widget().option("value", "");
                            $scope.operate.getCabinet(selectRoomName);
                        }
                    },
                    cabinet: {
                        "id": "cabinetText",
                        "label": $scope.i18n.device_term_cabinet_label + ":",
                        "require": "true",
                        "values": [],
                        "valuesFrom": "local",
                        "matchMethod": "any-nocap",
                        "height": 290,
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
                        "id": "descriptionText",
                        "label": $scope.i18n.common_term_desc_label + ":",
                        "type": "multi",
                        "height": "40px",
                        "require": "false",
                        "value": "",
                        "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                    },
                    nextBtn: {
                        "id": "nextBtn",
                        "text": $scope.i18n.common_term_next_button,
                        "click": function () {
                            //校验
                            var result = UnifyValid.FormValid($("#addRackBasicInfo"));
                            if (!result) {
                                return;
                            }
                            //基本信息
                            $scope.createInfo.name = $("#" + $scope.basicInfo.name.id).widget().getValue();
                            $scope.createInfo.chassisType = $("#" + $scope.basicInfo.model.id).widget().getSelectedId();
                            $scope.createInfo.roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                            $scope.checkModel.roomName = $scope.createInfo.roomName;
                            $scope.createInfo.rackId = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                            $scope.checkModel.rackId = $scope.createInfo.rackId;
                            $scope.createInfo.subRackId = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                            $scope.checkModel.subRackId = $scope.createInfo.subRackId;
                            $scope.createInfo.description = $("#descriptionText").widget().getValue();
                            $scope.operate.checkCollision($scope.checkModel);
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.rack")
                        }
                    }
                };
                $scope.isSnmpV3 = true;
                //参数接入页面
                $scope.paramInfo = {
                    version: {
                        "label": $scope.i18n.common_term_protocolVersion_label + ":",
                        "require": "true",
                        "id": "versionSelect",
                        "values": [],
                        "change": function () {
                            if ("SNMPv3" == $("#" + $scope.paramInfo.version.id).widget().getSelectedId()) {
                                $scope.isSnmpV3 = true;
                            }
                            else {
                                $scope.isSnmpV3 = false
                            }
                        },
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    mmIp: {
                        "label": $scope.i18n.device_term_MMipImport_label + ":",
                        "require": "true",
                        "id": "mmIp",
                        "type": "ipv4",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    port: {
                        "label": $scope.i18n.common_term_port_label + ":",
                        "require": "true",
                        "id": "port",
                        "value": "161",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                            ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                            $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                    },
                    timeout: {
                        "label": $scope.i18n.device_term_timeout_label + "(S):",
                        "require": "true",
                        "id": "timeout",
                        "value": "10",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                            $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60})
                    },
                    retries: {
                        "label": $scope.i18n.device_term_retryTime_label + ":",
                        "require": "true",
                        "id": "retries",
                        "value": "3",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                            $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10}) + ";maxValue(10):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10})
                    },
                    mmAIp: {
                        "label": $scope.i18n.device_term_MMAip_label + ":",
                        "require": "true",
                        "id": "mmAIp",
                        "type": "ipv4",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    mmBIp: {
                        "label": $scope.i18n.device_term_MMBip_label + ":",
                        "require": "true",
                        "id": "mmBIp",
                        "type": "ipv4",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
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
                        "validate": "required:" + $scope.i18n.common_term_null_valid,
                        "tooltip": $scope.i18n.device_term_sameWithDevice_tip +"" +  $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1:"HMACSHA"})

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
                        "tooltip": $scope.i18n.device_term_sameWithDevice_tip +"" +  $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1:"AES128"})

                    },
                    trapProtocol: {
                        "label": $scope.i18n.common_term_trapVersion_label + ":",
                        "require": "true",
                        "id": "trapProtocol",
                        "values": [],
                        "validate": "required:" + $scope.i18n.common_term_null_valid
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
                    },

                    preBtn: {
                        "id": "preBtn",
                        "text": $scope.i18n.common_term_back_button,
                        "click": function () {
                            $scope.showBasicInfoPage = true;
                            $scope.showParamSettingPage = false;
                            $scope.showConfirmInfoPage = false;
                            $("#addRackStepId").widget().pre();
                        }

                    },
                    nextBtn: {
                        "id": "nextBtn",
                        "text": $scope.i18n.common_term_next_button,
                        "click": function () {
                            //校验
                            var result = UnifyValid.FormValid($("#addRackParamSetting"));
                            if (!result) {
                                return;
                            }
                            //基本信息
                            $scope.createInfo.snmpConnectorParam.snmpVersion = $("#" + $scope.paramInfo.version.id).widget().getSelectedId();
                            $scope.createInfo.snmpConnectorParam.protocol = $("#" + $scope.paramInfo.version.id).widget().getSelectedId();
                            $scope.createInfo.snmpConnectorParam.ipAddr = $("#" + $scope.paramInfo.mmIp.id).widget().getValue();
                            $scope.createInfo.snmpConnectorParam.port = $("#" + $scope.paramInfo.port.id).widget().getValue();
                            $scope.createInfo.snmpConnectorParam.timeOut = $("#" + $scope.paramInfo.timeout.id).widget().getValue();
                            $scope.createInfo.snmpConnectorParam.reties = $("#" + $scope.paramInfo.retries.id).widget().getValue();
                            $scope.createInfo.mm1IpAddr = $("#" + $scope.paramInfo.mmAIp.id).widget().getValue();
                            $scope.createInfo.mm2IpAddr = $("#" + $scope.paramInfo.mmBIp.id).widget().getValue();
                            if ($scope.isSnmpV3) {
                                //高级信息
                                $scope.createInfo.snmpConnectorParam.securityName = $("#" + $scope.paramInfo.security.id).widget().getValue();
                                $scope.createInfo.snmpConnectorParam.authProtocol = $("#" + $scope.paramInfo.authProtocol.id).widget().getSelectedId();
                                $scope.createInfo.snmpConnectorParam.authPwd = $("#" + $scope.paramInfo.authPassword.id).widget().getValue();
                                $scope.createInfo.snmpConnectorParam.authPwdConf = $("#" + $scope.paramInfo.authPasswordConfirm.id).widget().getValue();
                                $scope.createInfo.snmpConnectorParam.encryptProtocol = $("#" + $scope.paramInfo.encrptProtocol.id).widget().getSelectedId();
                                $scope.createInfo.snmpConnectorParam.encryptPwd = $("#" + $scope.paramInfo.encrptPassword.id).widget().getValue();
                                $scope.createInfo.snmpConnectorParam.encryptPwdConf = $("#" + $scope.paramInfo.encrptPasswordConfirm.id).widget().getValue();
                            }
                            else {
                                $scope.createInfo.snmpConnectorParam.readComm = $("#" + $scope.paramInfo.readCommunity.id).widget().getValue();
                                $scope.createInfo.snmpConnectorParam.writeComm = $("#" + $scope.paramInfo.writeCommunity.id).widget().getValue();
                            }
                            if ($scope.trapProtocol.length == 0) {
                                $scope.createInfo.snmpConnectorParam.snmpTrapVersion = ""
                            }
                            else {
                                $scope.createInfo.snmpConnectorParam.snmpTrapVersion = $("#" + $scope.paramInfo.trapProtocol.id).widget().getSelectedId();
                            }
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showConfirmInfoPage = true;
                            $("#addRackStepId").widget().next();
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.rack")
                        }
                    }
                };

                //确认页面
                $scope.confirmInfo = {
                    preBtn: {
                        "id": "preBtn",
                        "text": $scope.i18n.common_term_back_button,
                        "click": function () {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                            $("#addRackStepId").widget().pre();
                        }
                    },
                    okBtn: {
                        "id": "okBtn",
                        "text": $scope.i18n.common_term_complete_label,
                        "click": function () {
                            $scope.operate.addRack($scope.createInfo);
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.rack")
                        }
                    }
                };
                $scope.operate = {
                    initType: function () {
                        var addConfig = deviceConstants.rest.DEVICE_TYPE
                        var deferred = camel.get({
                            "url": {s: addConfig.url, o: {"id": '1'}},
                            "type": addConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.success(function (response) {
                            var dataList = response.instances;
                            var index;
                            for (index in dataList) {
                                $scope.rackTypeMap[dataList[index].devicesubType] = dataList[index];
                                var model = {
                                    "selectId": dataList[index].devicesubType,
                                    "label": dataList[index].devicesubType
                                }
                                $scope.basicInfo.model.values.push(model);
                            }
                            $scope.$apply(function () {
                                setTimeout(function () {
                                    $("#" + $scope.basicInfo.model.id).widget().option("values", $scope.basicInfo.model.values);
                                }, 500);
                            });
                        });
                    },
                    initZone: function () {
                        //查询构造zone信息
                        var queryConfig = constants.rest.ZONE_QUERY;
                        var deferred = camel.get({
                            url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var zones = response.zones;
                            var availableZones = [];
                            for (var index in zones) {
                                var availableZone = {
                                    "id": zones[index].id,
                                    "name": zones[index].name,
                                    "checked": index == 0
                                };
                                availableZones.push(availableZone);
                            }
                            $scope.basicInfo.zone.values = availableZones;
                            $scope.$digest();
                        })
                    },
                    initRoom: function () {
                        //查询构造机房信息
                        var config = deviceConstants.rest.ROOM_QUERY;
                        var deferred = camel.get({
                            url: {s: config.url, o: {"start": "", "limit": "", "room_name": ""}},
                            "userId": $rootScope.user.id
                        });
                        deferred.success(function (response) {
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
                    //检查设备冲突
                    checkCollision: function (params) {
                        var checkConfig = deviceConstants.rest.DEVICE_COLLISION
                        var deferred = camel.post({
                            "url": checkConfig.url,
                            "type": checkConfig.type,
                            "userId": $rootScope.user.id,
                            "params": JSON.stringify(params)
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $scope.showBasicInfoPage = false;
                                $scope.showParamSettingPage = true;
                                $scope.showConfirmInfoPage = false;
                                $("#addRackStepId").widget().next();
                                $("#" + $scope.paramInfo.version.id).widget().option("values", $scope.paramInfo.version.values);
                                if ("SNMPv3" == $("#" + $scope.paramInfo.version.id).widget().getSelectedId()) {
                                    $scope.isSnmpV3 = true;
                                }
                                else {
                                    $scope.isSnmpV3 = false
                                }
                            })
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    addRack: function (params) {
                        var addConfig = deviceConstants.rest.CHASSIS_ADD
                        var deferred = camel.post({
                            "url": addConfig.url,
                            "type": addConfig.type,
                            "userId": $rootScope.user.id,
                            "timeout": 60000,
                            "params": JSON.stringify(params)
                        });
                        deferred.done(function (response) {
                            $state.go("resources.device.rack")
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                }
                $scope.operate.initType();
                $scope.operate.initZone();
                $scope.operate.initRoom();
            }
            ]
            ;
        return addRackCtrl;
    }
)
;

