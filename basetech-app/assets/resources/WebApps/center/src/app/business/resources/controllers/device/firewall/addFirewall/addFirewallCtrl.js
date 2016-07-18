/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-13

 */
define(['jquery',
    'tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/device/constants",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService"],
    function ($, angular, UnifyValid, deviceConstants, constants, ExceptionService) {
        "use strict";

        var addFirewallCtrl = ["$scope", "$compile", "$state", 'camel', '$rootScope', 'validator', function ($scope, $compile, $state, camel, $rootScope, validator) {
                $scope.cloudType = $rootScope.user.cloudType;
                $scope.addFirewallStep1 = {
                    "url": "../src/app/business/resources/views/device/firewall/addFirewall/basicInfo.html"
                };
                $scope.addFirewallStep2 = {
                    "url": "../src/app/business/resources/views/device/firewall/addFirewall/paramSetting.html"
                };
                $scope.addFirewallStep3 = {
                    "url": "../src/app/business/resources/views/device/firewall/addFirewall/confirmInfo.html"
                };

                //控制步骤中各页面的显示
                $scope.showBasicInfoPage = true;

                $scope.showParamSettingPage = false;

                $scope.showConfirmInfoPage = false;

                //页面上的导航
                $scope.addFirewallStep = {
                    "id": "addFirewallStepId",
                    "jumpable": "true",
                    "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.device_term_SNMPimportPara_label, $scope.i18n.common_term_confirmInfo_label],
                    "width": "450"
                };
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
                    if ($("#" + $scope.paramSetting.authPassword.id).widget().getValue() === $("#" + $scope.paramSetting.authPasswordConfirm.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                //snmp数据加密协议两次输入密码是否一致校验
                UnifyValid.snmpEncrptPwdEqual = function () {
                    if ($("#" + $scope.paramSetting.encrptPassword.id).widget().getValue() === $("#" + $scope.paramSetting.encrptPasswordConfirm.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };

                //检测主备设备位置是否重复
                UnifyValid.locationDuplicate = function () {
                    if ($("#" + $scope.basicInfo.masterRoom.id).widget().getValue() === $("#" + $scope.basicInfo.slaveRoom.id).widget().getValue() &&
                        $("#" + $scope.basicInfo.masterCabinet.id).widget().getValue() === $("#" + $scope.basicInfo.slaveCabinet.id).widget().getValue() &&
                        $("#" + $scope.basicInfo.masterSubrack.id).widget().getValue() === $("#" + $scope.basicInfo.slaveSubrack.id).widget().getValue()) {
                        return $scope.i18n.device_term_activeStandbyLocationSame_valid;
                    } else {
                        return "";
                    }
                };

                //主防火墙模型，如果单设备接入则为防火墙模型
                $scope.phyFwConnectInfo = {};

                //备防火墙模型
                $scope.pairPhyFwConnectInfo = {};

                //设备冲突检测次数
                $scope.checkNum = 0;
                //冲突检测数据模型
                $scope.checkModel = {
                    "deviceType": 3,
                    "roomName": "",
                    "rackId": "",
                    "subRackId": ""
                };

                //防火墙接入类型
                $scope.firwallAccessMth = deviceConstants.config.FIREWALL_CONNECT_TYPE.single;
                //基本信息页面
                $scope.basicInfo = {
                    accessMtd: {
                        "label": $scope.i18n.device_term_connectModeServer_label + ":",
                        "require": "true",
                        "id": "accessMtdSelect",
                        "spacing": {"width": "50px", "height": "30px"},
                        "values": [
                            [
                                {
                                    "key": deviceConstants.config.FIREWALL_CONNECT_TYPE.single,
                                    "text": $scope.i18n.device_fire_add_para_connectMode_option_one_value,
                                    "checked": true
                                }
                            ],
                            [
                                {
                                    "key": deviceConstants.config.FIREWALL_CONNECT_TYPE.masterSlave,
                                    "text": $scope.i18n.device_fire_add_para_connectMode_option_two_value,
                                    "checked": false
                                }
                            ]
                        ],
                        "value": "",
                        "layout": "vertical",
                        "change": function () {
                            $scope.firwallAccessMth = $("#" + $scope.basicInfo.accessMtd.id).widget().opChecked("checked");
                        }
                    },
                    protocol: {
                        "id": "protocol",
                        "label": $scope.i18n.device_term_connectProtocol_label + ":",
                        "require": "false",
                        value: "ssh"
                    },
                    zone: {
                        "label": $scope.i18n.resource_term_zone_label + ":",
                        "require": "true",
                        "value": "",
                        "values": [],
                        "height": 290,
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    username: {
                        "label": $scope.i18n.common_term_userName_label + ":",
                        "require": "true",
                        "id": "username",
                        "tips": $scope.i18n.device_fire_connect_para_userName_mean_tip,
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                    },
                    password: {
                        "label": $scope.i18n.common_term_psw_label + ":",
                        "require": "true",
                        "id": "password",
                        "type": "password",
                        "tips": $scope.i18n.device_fire_connect_para_psw_mean_tip,
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                    },
                    passwordConfirm: {
                        "label": $scope.i18n.common_term_PswConfirm_label + ":",
                        "require": "true",
                        "id": "confirmPassword",
                        "type": "password",
                        "extendFunction": ["infoPwdEqual"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
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
                    networkType: {
                        "label": $scope.i18n.device_term_networkingType_label + ":",
                        "require": "true",
                        "id": "networkType",
                        "values": [
                            {"selectId": "static-route", "label": "static-route", "checked": true},
                            {"selectId": "ospf", "label": "ospf"}
                        ],
                        "tips": $scope.i18n.device_fire_connect_para_networkingType_mean_label,
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    masterIp: {
                        "label": $scope.i18n.common_term_IP_label + ":",
                        "require": "true",
                        "id": "masterIp",
                        "type": "ipv4",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    masterRoom: {
                        "id": "masterRoom",
                        "label": $scope.i18n.device_term_room_label + ":",
                        "values": [],
                        "valuesFrom": "local",
                        "matchMethod": "any-nocap",
                        "height": 290,
                        "tooltip": $scope.i18n.device_term_inputOrSelectRoomName_label,
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                            $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                        "require": "true",
                        "select": function () {
                            var masterRoomName = $("#" + $scope.basicInfo.masterRoom.id).widget().getValue();
                            $("#" + $scope.basicInfo.masterCabinet.id).widget().option("value", "");
                            $scope.operate.getCabinet(masterRoomName, $scope.basicInfo.masterCabinet.id);
                        }
                    },
                    masterCabinet: {
                        "id": "masterCabinet",
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
                    masterSubrack: {
                        "id": "masterSubrack",
                        "label": $scope.i18n.device_term_subrack_label + ":",
                        "require": "true",
                        "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + $scope.i18n.common_term_composition2_valid,
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                            $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                    },
                    slaveIp: {
                        "label": $scope.i18n.common_term_IP_label + ":",
                        "require": "true",
                        "id": "slaveIp",
                        "type": "ipv4",
                        "value": "",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    slaveRoom: {
                        "id": "slaveRoom",
                        "label": $scope.i18n.device_term_room_label + ":",
                        "values": [],
                        "valuesFrom": "local",
                        "matchMethod": "any-nocap",
                        "height": 290,
                        "tooltip": $scope.i18n.device_term_inputOrSelectRoomName_label,
                        "require": "true",
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                            $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                        "select": function () {
                            var slaveRoomName = $("#" + $scope.basicInfo.slaveRoom.id).widget().getValue();
                            $("#" + $scope.basicInfo.slaveCabinet.id).widget().option("value", "");
                            $scope.operate.getCabinet(slaveRoomName, $scope.basicInfo.slaveCabinet.id);
                        }
                    },
                    slaveCabinet: {
                        "id": "slaveCabinet",
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
                    slaveSubrack: {
                        "id": "slaveSubrack",
                        "label": $scope.i18n.device_term_subrack_label + ":",
                        "require": "true",
                        "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + $scope.i18n.common_term_composition2_valid,
                        "extendFunction": ["locationDuplicate"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                            $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + ";locationDuplicate"
                    },

                    description: {
                        "id": "descriptionText",
                        "label": $scope.i18n.common_term_desc_label + ":",
                        "require": "false",
                        "type": "multi",
                        "value": "",
                        "height": "40px",
                        "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                    },
                    nextBtn: {
                        "id": "nextBtn",
                        "text": $scope.i18n.common_term_next_button,
                        "click": function () {
                            //校验
                            var result = UnifyValid.FormValid($("#addFirewallBasicInfoDiv"));
                            if (!result) {
                                return;
                            }
                            $scope.phyFwConnectInfo.connectProtocol = 2;
                            $scope.phyFwConnectInfo.userId = $("#" + $scope.basicInfo.username.id).widget().getValue();
                            $scope.phyFwConnectInfo.passwd = $("#" + $scope.basicInfo.password.id).widget().getValue();
                            $scope.phyFwConnectInfo.confirmpw = $("#" + $scope.basicInfo.passwordConfirm.id).widget().getValue();
                            $scope.phyFwConnectInfo.sshPort = $("#" + $scope.basicInfo.portId.id).widget().getValue();
                            $scope.phyFwConnectInfo.networkType = $("#" + $scope.basicInfo.networkType.id).widget().getSelectedId();
                            $scope.phyFwConnectInfo.description = $("#" + $scope.basicInfo.description.id).widget().getValue();
                            $scope.basicInfo.accessMtd.value = $("#" + $scope.basicInfo.accessMtd.id).widget().opValue($scope.firwallAccessMth);
                            if ($scope.firwallAccessMth == deviceConstants.config.FIREWALL_CONNECT_TYPE.single) {
                                $scope.checkModel.roomName = $("#" + $scope.basicInfo.masterRoom.id).widget().getValue();
                                $scope.checkModel.rackId = $("#" + $scope.basicInfo.masterCabinet.id).widget().getValue();
                                $scope.checkModel.subRackId = $("#" + $scope.basicInfo.masterSubrack.id).widget().getValue();
                                $scope.operate.checkCollision($scope.checkModel);
                            }
                            else {
                                $scope.checkModel.roomName = $("#" + $scope.basicInfo.masterRoom.id).widget().getValue();
                                $scope.checkModel.rackId = $("#" + $scope.basicInfo.masterCabinet.id).widget().getValue();
                                $scope.checkModel.subRackId = $("#" + $scope.basicInfo.masterSubrack.id).widget().getValue();
                                $scope.operate.checkCollision($scope.checkModel);
                                $scope.checkModel.roomName = $("#" + $scope.basicInfo.slaveRoom.id).widget().getValue();
                                $scope.checkModel.rackId = $("#" + $scope.basicInfo.slaveCabinet.id).widget().getValue();
                                $scope.checkModel.subRackId = $("#" + $scope.basicInfo.slaveSubrack.id).widget().getValue();
                                $scope.operate.checkCollision($scope.checkModel);
                            }

                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.firewall");
                        }
                    }

                };

                //snmp版本
                $scope.isSnmpV3 = true;

                //参数设置页面
                $scope.paramSetting = {
                    version: {
                        "label": $scope.i18n.common_term_version_label + ":",
                        "require": "true",
                        "id": "versionSelect",
                        "values": [
                            {
                                "selectId": 'v1',
                                "label": 'SNMPv1'
                            },
                            {
                                "selectId": 'v2',
                                "label": 'SNMPv2c'
                            },
                            {
                                "selectId": 'v3',
                                "label": 'SNMPv3',
                                "checked": true
                            }
                        ],
                        "value": "",
                        "change": function () {
                            if ("v3" == $("#" + $scope.paramSetting.version.id).widget().getSelectedId()) {
                                $scope.isSnmpV3 = true;
                            }
                            else {
                                $scope.isSnmpV3 = false
                            }
                        }
                    },
                    snmpPort: {
                        "id": "snmpPortId",
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
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                            $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}),
                        "value": "10"
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
                        "id": "snmpSecurity",
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
                    authPassword: {
                        "label": $scope.i18n.common_term_authenticPsw_label + ":",
                        "require": "true",
                        "id": "authPassword",
                        "type": "password",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    authPasswordConfirm: {
                        "label": $scope.i18n.common_term_authenticPswConfirm_label + ":",
                        "require": "true",
                        "id": "confirmAuthPassword",
                        "type": "password",
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
                        "tooltip": $scope.i18n.device_term_sameWithDevice_tip +"" +  $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1:"AES128"})
                    },
                    encrptPassword: {
                        "label": $scope.i18n.common_term_DDAPsw_label + ":",
                        "require": "true",
                        "id": "encrptPassword",
                        "type": "password",
                        "validate": "required:" + $scope.i18n.common_term_null_valid
                    },
                    encrptPasswordConfirm: {
                        "label": $scope.i18n.common_term_DDAPswConfirm_label + ":",
                        "require": "true",
                        "id": "confirmEncrptPassword",
                        "type": "password",
                        "extendFunction": ["snmpEncrptPwdEqual"],
                        "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpEncrptPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                    },
                    preBtn: {
                        "id": "preBtn",
                        "text": $scope.i18n.common_term_back_button,
                        "click": function () {
                            $scope.checkNum = 0;
                            $scope.showBasicInfoPage = true;
                            $scope.showParamSettingPage = false;
                            $scope.showConfirmInfoPage = false;
                            $("#addFirewallStepId").widget().pre();
                        }

                    },
                    nextBtn: {
                        "id": "nextBtn",
                        "text": $scope.i18n.common_term_next_button,
                        "click": function () {
                            //校验
                            var result = UnifyValid.FormValid($("#addFirewallParamSettingDiv"));
                            if (!result) {
                                return;
                            }
                            $scope.phyFwConnectInfo.snmpVersion = $("#" + $scope.paramSetting.version.id).widget().getSelectedId();
                            $scope.phyFwConnectInfo.snmpPort = $("#" + $scope.paramSetting.snmpPort.id).widget().getValue();
                            $scope.phyFwConnectInfo.snmpTimeout = $("#" + $scope.paramSetting.timeout.id).widget().getValue();
                            if ($scope.isSnmpV3) {
                                $scope.phyFwConnectInfo.snmpSecurityName = $("#" + $scope.paramSetting.security.id).widget().getValue();
                                $scope.phyFwConnectInfo.snmpAuthProtocol = $("#" + $scope.paramSetting.authProtocol.id).widget().getSelectedId();
                                $scope.phyFwConnectInfo.snmpAuthPwd = $("#" + $scope.paramSetting.authPassword.id).widget().getValue();
                                $scope.phyFwConnectInfo.snmpAuthConfirmpw = $("#" + $scope.paramSetting.authPasswordConfirm.id).widget().getValue();
                                $scope.phyFwConnectInfo.snmpEncryptProtocol = $("#" + $scope.paramSetting.encrptProtocol.id).widget().getSelectedId();
                                $scope.phyFwConnectInfo.snmpEncryptPwd = $("#" + $scope.paramSetting.encrptPassword.id).widget().getValue();
                                $scope.phyFwConnectInfo.snmpEncConfirmpw = $("#" + $scope.paramSetting.encrptPasswordConfirm.id).widget().getValue();
                            }
                            else {
                                $scope.phyFwConnectInfo.snmpReadComm = $("#" + $scope.paramSetting.readCommunity.id).widget().getValue();
                                $scope.phyFwConnectInfo.snmpWriteComm = $("#" + $scope.paramSetting.writeCommunity.id).widget().getValue();
                            }
                            //防火墙接入list
                            $scope.phyFwConnectInfos = [];
                            if ($scope.firwallAccessMth == deviceConstants.config.FIREWALL_CONNECT_TYPE.single) {
                                $scope.phyFwConnectInfo.hrpStatus = deviceConstants.config.FIREWALL_CONNECT_MODE.single;
                                $scope.phyFwConnectInfo.mgntIpv4Addr = $("#" + $scope.basicInfo.masterIp.id).widget().getValue();
                                $scope.phyFwConnectInfo.roomId = $("#" + $scope.basicInfo.masterRoom.id).widget().getValue();
                                $scope.phyFwConnectInfo.rackId = $("#" + $scope.basicInfo.masterCabinet.id).widget().getValue();
                                $scope.phyFwConnectInfo.subrackId = $("#" + $scope.basicInfo.masterSubrack.id).widget().getValue();
                                $scope.phyFwConnectInfos.push($scope.phyFwConnectInfo);
                            }
                            else {
                                for (var key in  $scope.phyFwConnectInfo) {
                                    $scope.pairPhyFwConnectInfo[key] = $scope.phyFwConnectInfo[key];
                                }
                                $scope.pairPhyFwConnectInfo.hrpStatus = deviceConstants.config.FIREWALL_CONNECT_MODE.pair;
                                $scope.pairPhyFwConnectInfo.mgntIpv4Addr = $("#" + $scope.basicInfo.slaveIp.id).widget().getValue();
                                $scope.pairPhyFwConnectInfo.roomId = $("#" + $scope.basicInfo.slaveRoom.id).widget().getValue();
                                $scope.pairPhyFwConnectInfo.rackId = $("#" + $scope.basicInfo.slaveCabinet.id).widget().getValue();
                                $scope.pairPhyFwConnectInfo.subrackId = $("#" + $scope.basicInfo.slaveSubrack.id).widget().getValue();
                                $scope.phyFwConnectInfos.push($scope.pairPhyFwConnectInfo);
                                $scope.phyFwConnectInfo.hrpStatus = deviceConstants.config.FIREWALL_CONNECT_MODE.main;
                                $scope.phyFwConnectInfo.mgntIpv4Addr = $("#" + $scope.basicInfo.masterIp.id).widget().getValue();
                                $scope.phyFwConnectInfo.roomId = $("#" + $scope.basicInfo.masterRoom.id).widget().getValue();
                                $scope.phyFwConnectInfo.rackId = $("#" + $scope.basicInfo.masterCabinet.id).widget().getValue();
                                $scope.phyFwConnectInfo.subrackId = $("#" + $scope.basicInfo.masterSubrack.id).widget().getValue();
                                $scope.phyFwConnectInfos.push($scope.phyFwConnectInfo);
                            }
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showConfirmInfoPage = true;
                            $("#addFirewallStepId").widget().next();
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.firewall");
                        }
                    }
                };

                //信息确认页面
                $scope.confirmInfo = {
                    preBtn: {
                        "id": "preBtn",
                        "text": $scope.i18n.common_term_back_button,
                        "click": function () {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                            $("#addFirewallStepId").widget().pre();
                        }
                    },
                    okBtn: {
                        "id": "okBtn",
                        "text": $scope.i18n.common_term_complete_label,
                        "click": function () {
                            $scope.operate.addFirewall({"phyFwConnectInfos": $scope.phyFwConnectInfos});
                        }
                    },
                    cancelBtn: {
                        "id": "cancelBtn",
                        "text": $scope.i18n.common_term_cancle_button,
                        "click": function () {
                            $state.go("resources.device.firewall");
                        }
                    }

                };
                $scope.operate = {
                    "init": function () {
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
                            "url": {s: config.url, o: {"start": "", "limit": "", "room_name": ""}},
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
                                $("#" + $scope.basicInfo.masterRoom.id).widget().option("values", availableRooms);
                                $("#" + $scope.basicInfo.slaveRoom.id).widget().option("values", availableRooms);
                            }, 1000);
                        });
                    },
                    getCabinet: function (roomName, id) {
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
                            $("#" + id).widget().option("values", availableRacks);
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
                            $scope.checkNum = $scope.checkNum + 1;
                            if ($scope.firwallAccessMth == deviceConstants.config.FIREWALL_CONNECT_TYPE.masterSlave) {
                                if ($scope.checkNum >= 2) {
                                    $scope.$apply(function () {
                                        $scope.showBasicInfoPage = false;
                                        $scope.showParamSettingPage = true;
                                        $scope.showConfirmInfoPage = false;
                                        $("#addFirewallStepId").widget().next();
                                    })
                                }
                            }
                            else {
                                $scope.$apply(function () {
                                    $scope.showBasicInfoPage = false;
                                    $scope.showParamSettingPage = true;
                                    $scope.showConfirmInfoPage = false;
                                    $("#addFirewallStepId").widget().next();
                                })
                            }

                        });
                        deferred.fail(function (response) {
                            $scope.checkNum = 0;
                            new ExceptionService().doException(response);
                        });
                    },
                    "addFirewall": function (params) {
                        var addConfig = deviceConstants.rest.FIREWALL_ADD;
                        var deferred = camel.post({
                            "url": addConfig.url,
                            "type": addConfig.type,
                            "userId": $rootScope.user.id,
                            "params": JSON.stringify(params),
                            "timeout": 60000
                        });
                        deferred.done(function (response) {
                            $state.go("resources.device.firewall");
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                };
                $scope.operate.init();
                $scope.operate.initRoom();
            }
            ]
            ;

        return addFirewallCtrl;
    }
)
;

