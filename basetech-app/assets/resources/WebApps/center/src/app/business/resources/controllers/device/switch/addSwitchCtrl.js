/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-25

 */
define(['jquery',
    'tiny-lib/angular',
    "tiny-common/UnifyValid",
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService"],
    function ($, angular, UnifyValid, Message, constants, deviceConstants, ExceptionService) {
        "use strict";

        var addSwitchCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "validator", "$rootScope", function ($scope, $compile, $state, $stateParams, camel, validator, $rootScope) {
            $scope.cloudType = $rootScope.user.cloudType;
            //控制步骤显示
            $scope.showBasicInfoPage = true;
            $scope.showParamSettingPage = false;
            $scope.showAlarmSettingPage = false;
            $scope.showConfirmInfoPage = false;

            $scope.addSwitchStep1 = {
                "url": "../src/app/business/resources/views/device/switch/addSwitch/basicInfo.html"
            };
            $scope.addSwitchStep2 = {
                "url": "../src/app/business/resources/views/device/switch/addSwitch/paramSetting.html"
            };
            $scope.addSwitchStep3 = {
                "url": "../src/app/business/resources/views/device/switch/addSwitch/alarmSetting.html"
            };
            $scope.addSwitchStep4 = {
                "url": "../src/app/business/resources/views/device/switch/addSwitch/confirmInfo.html"
            };

            $scope.addSwitchStep = {
                "id": "addSwitchStepId",
                "jumpable": "true",
                "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label],
                "width": "650"
            };
            $scope.formfieldWidth = "215px";
            //ssh协议两次输入密码是否一致校验
            UnifyValid.sshPwdEqual = function () {
                if ($("#" + $scope.paramInfo.sshPassword.id).widget().getValue() === $("#" + $scope.paramInfo.sshPasswordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp认证协议两次输入密码是否一致校验
            UnifyValid.snmpAuthPwdEqual = function () {
                if ($("#" + $scope.paramInfo.snmpAuthPassword.id).widget().getValue() === $("#" + $scope.paramInfo.snmpAuthPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp数据加密协议两次输入密码是否一致校验
            UnifyValid.snmpEncrptPwdEqual = function () {
                if ($("#" + $scope.paramInfo.snmpEncrptPassword.id).widget().getValue() === $("#" + $scope.paramInfo.snmpEncrptPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //判断SNMP的IP与SSH是否一致
            UnifyValid.ipEqual = function () {
                if ($scope.snmpInfo.access) {
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
            //交换机型号对照表
            $scope.switchTypeMap = {};
            //SNMP协议信息
            $scope.snmpInfo = {
                "access": false,
                "version": ""
            }
            //SSH协议信息
            $scope.sshInfo = {
                "access": false
            }
            $scope.trapProtocol = [];
            $scope.isTrapSNMPv3 = true;

            //接入交换机数据模型
            $scope.createInfo = {
                "ethSwitchBasicInfoVo": {},
                "ethSwitchSshInfoVo": {},
                "ethSwitchSnmpInfoVo": {}
            };
            //冲突检测数据模型
            $scope.checkModel = {
                "deviceType": 5,
                "roomName": "",
                "rackId": "",
                "subRackId": ""
            };
            $scope.basicInfo = {
                name: {
                    "id": "name",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": "true",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + " " + $scope.i18n.common_term_composition2_valid
                },
                model: {
                    "label": $scope.i18n.device_term_model_label + ":",
                    "require": "true",
                    "id": "model",
                    "values": [],
                    "height": "290",
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        var selectModelId = $("#" + $scope.basicInfo.model.id).widget().getSelectedId();
                        var accessProtocol = $scope.switchTypeMap[selectModelId].accessProtocol;
                        var index;
                        $scope.snmpInfo.access = false;
                        $scope.sshInfo.access = false;
                        var num = 0;
                        var snmpProtocolList = [];
                        for (index in accessProtocol) {
                            if (accessProtocol[index].indexOf("SNMP") >= 0) {
                                $scope.snmpInfo.access = true;
                                var protocol = {
                                    "selectId": deviceConstants.config.SNMP_PROTOCOL[accessProtocol[index]],
                                    "label": deviceConstants.config.SNMP_PROTOCOL[accessProtocol[index]],
                                    "checked": num == 0
                                }
                                num = num + 1;
                                snmpProtocolList.push(protocol);
                            }
                            else {
                                $scope.sshInfo.access = true;
                            }
                        }
                        $scope.paramInfo.snmpVersion.values = snmpProtocolList;
                        var deviceTypeNum = $scope.switchTypeMap[selectModelId].deviceType;
                        $scope.basicInfo.physicsType.value = $scope.i18n[deviceConstants.config.DEVICE_TYPE[deviceTypeNum]];
                        if (3 == deviceTypeNum) {
                            $scope.createInfo.ethSwitchBasicInfoVo.physicalType = 0;
                            $scope.basicInfo.slotId.display = false;
                        }
                        else {
                            $scope.createInfo.ethSwitchBasicInfoVo.physicalType = 1;
                            $scope.basicInfo.slotId.display = true;
                        }
                        $scope.trapProtocol = $scope.switchTypeMap[selectModelId].trapProtocol || [];
                        $scope.isTrapSNMPv3 = false;
                        var snmpProtocolList = [];
                        for (var index in $scope.trapProtocol) {
                            var version = $scope.trapProtocol[index];
                            if (version.indexOf("SNMP") >= 0) {
                                var protocol = {
                                    "selectId": version,
                                    "label": version
                                }
                                if (version.toUpperCase() == "SNMPV3") {
                                    $scope.isTrapSNMPv3 = true;
                                    protocol.checked = true;
                                }
                                snmpProtocolList.push(protocol);
                            }
                        }
                        if ($scope.trapProtocol.length != 0 && (!$scope.snmpInfo.access)) {
                            $("#" + $scope.addSwitchStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label]);
                            $scope.snmpParamInfo.snmpVersion.values = snmpProtocolList;
                        }
                        else {
                            $("#" + $scope.addSwitchStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_confirmInfo_label]);
                            $scope.paramInfo.trapProtocol.values = snmpProtocolList;
                        }
                    }
                },
                physicsType: {
                    "label": $scope.i18n.device_term_physiForm_label + ":",
                    "id": "physicsType",
                    "value": $scope.i18n.device_term_commonSwitch_label
                },
                slotId: {
                    "id": "slotId",
                    "label": $scope.i18n.device_term_slotID_label + ":",
                    "require": "true",
                    "display": false,
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 2147483647}) + ";maxValue(2147483647):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 2147483647})
                },
                accessMtd: {
                    "label": $scope.i18n.device_term_connectModeSwitch_label + ":",
                    "require": "true",
                    "id": "accessMtdSelect",
                    "spacing": {"width": "50px", "height": "30px"},
                    "values": [
                        [
                            {
                                "key": "0",
                                "text": $scope.i18n.device_term_singlePoint_label,
                                "checked": true
                            }
                        ],
                        [
                            {
                                "key": "1",
                                "text": $scope.i18n.common_term_stack_label,
                                "checked": false
                            }
                        ]
                    ],
                    "layout": "vertical",
                    "change": function () {

                    }
                },
                type: {
                    "label": $scope.i18n.common_term_type_label + ":",
                    "require": "true",
                    "id": "type",
                    "values": [
                        {
                            selectId: '1',
                            label: $scope.i18n.device_term_connectSwitch_label,
                            "checked": "true"
                        },
                        {
                            selectId: '0',
                            label: $scope.i18n.device_term_aggregationSwitch_label
                        }
                    ],
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        if ("0" == $("#" + $scope.basicInfo.type.id).widget().getSelectedId()) {
                            $scope.basicInfo.upLinkPort.display = true;
                            $scope.checkModel.deviceType = 2;
                        }
                        else {
                            $scope.basicInfo.upLinkPort.display = false;
                            $scope.checkModel.deviceType = 5;
                        }
                    }
                },
                upLinkPort: {
                    "id": "upLinkPort",
                    "label": $scope.i18n.common_term_uplinkPort_value + ":",
                    "height": "40px",
                    "display": false,
                    "require": false,
                    "type": "multi",
                    "tooltip": $scope.i18n.device_term_portFormat_valid,
                    "validate": "regularCheck(" + validator.upLinkPort + "):" + $scope.i18n.device_term_portFormat_valid +
                        "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                },
                zone: {
                    "label": $scope.i18n.resource_term_zone_label + ":",
                    "require": "true",
                    "values": [],
                    "value": "",
                    "height": "290",
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
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                    "select": function () {
                        var selectRoomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $("#" + $scope.basicInfo.cabinet.id).widget().option("value", "");
                        $scope.operate.getCabinet(selectRoomName);
                    }
                },
                cabinet: {
                    "id": "cabinet",
                    "label": $scope.i18n.device_term_cabinet_label + ":",
                    "require": "true",
                    "values": [],
                    "valuesFrom": "local",
                    "matchMethod": "any-nocap",
                    "height": "290",
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
                        var result = UnifyValid.FormValid($("#addSwitchBasicDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.createInfo.ethSwitchBasicInfoVo.switchName = $("#" + $scope.basicInfo.name.id).widget().getValue();
                        $scope.createInfo.ethSwitchBasicInfoVo.switchSubType = $("#" + $scope.basicInfo.model.id).widget().getSelectedId();
                        $scope.createInfo.ethSwitchBasicInfoVo.switchType = $("#" + $scope.basicInfo.type.id).widget().getSelectedId();
                        $scope.basicInfo.type.value = $("#" + $scope.basicInfo.type.id).widget().opLabel($scope.createInfo.ethSwitchBasicInfoVo.switchType);
                        $scope.createInfo.ethSwitchBasicInfoVo.slotId = $("#" + $scope.basicInfo.slotId.id).widget().getValue();
                        $scope.checkModel.slotId = $scope.createInfo.ethSwitchBasicInfoVo.slotId;
                        $scope.createInfo.ethSwitchBasicInfoVo.stackingSwitch = $("#" + $scope.basicInfo.accessMtd.id).widget().opChecked("checked");

                        $scope.createInfo.ethSwitchBasicInfoVo.roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $scope.checkModel.roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $scope.createInfo.ethSwitchBasicInfoVo.rack = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                        $scope.checkModel.rackId = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                        $scope.createInfo.ethSwitchBasicInfoVo.subRack = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                        $scope.checkModel.subRackId = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                        $scope.createInfo.ethSwitchBasicInfoVo.description = $("#descriptionText").widget().getValue();
                        if ($scope.basicInfo.upLinkPort.display) {
                            $scope.createInfo.ethSwitchBasicInfoVo.uplinkports = $("#" + $scope.basicInfo.upLinkPort.id).widget().getValue();
                        }
                        if ($scope.snmpInfo.access) {
                            $("#" + $scope.paramInfo.snmpVersion.id).widget().option("values", $scope.paramInfo.snmpVersion.values);
                            $scope.snmpInfo.version = $("#" + $scope.paramInfo.snmpVersion.id).widget().getSelectedId();
                        }

                        //检测冲突
                        $scope.operate.checkCollision($scope.checkModel);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.switch");
                    }
                }
            };

            $scope.paramInfo = {
                sshVersion: {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "require": "true",
                    "id": "sshVersion",
                    "value": "2.0"
                },
                sshIp: {
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": "true",
                    "id": "sshIp",
                    "type": "ipv4",
                    "value": "",
                    "extendFunction": ["ipEqual"],
                    "tooltip": $scope.i18n.device_switch_connect_para_SSHip_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipEqual:" + $scope.i18n.device_term_sameAsSNMPip_valid
                },
                sshPort: {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "id": "sshPort",
                    "value": "22",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                sshUsername: {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "id": "sshUsername",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                sshPassword: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "sshPassword",
                    "type": "password",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                sshPasswordConfirm: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "confirmSshPassword",
                    "type": "password",
                    "value": "",
                    "extendFunction": ["sshPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";sshPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                snmpVersion: {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "require": "true",
                    "id": "snmpVersionSelect",
                    "values": [],
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        $scope.snmpInfo.version = $("#" + $scope.paramInfo.snmpVersion.id).widget().getSelectedId();
                    }
                },
                snmpIp: {
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": "true",
                    "id": "snmpIp",
                    "type": "ipv4",
                    "tooltip": $scope.i18n.device_switch_connect_para_SNMPip_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpPort: {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpPort",
                    "value": "161",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                snmpTimeout: {
                    "label": $scope.i18n.device_term_timeout_label + "(S):",
                    "require": "true",
                    "id": "paramInfoSnmpTimeout",
                    "value": "10",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60})
                },
                snmpRetries: {
                    "label": $scope.i18n.device_term_retryTime_label + ":",
                    "require": "true",
                    "id": "paramInfoRetries",
                    "value": "3",
                    "tooltip": $scope.i18n.device_switch_connect_para_retryTime_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10}) + ";maxValue(10):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10})
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
                snmpSecurity: {
                    "id": "paramInfoSnmpSecurity",
                    "label": $scope.i18n.common_term_secuUserName_label + ":",
                    "require": "true",
                    "tooltip": $scope.i18n.device_switch_connect_para_secuUserName_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthProtocol: {
                    "label": $scope.i18n.common_term_authProtocol_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpAuthProtocol",
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
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "HMACSHA"}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthPassword: {
                    "label": $scope.i18n.common_term_authenticPsw_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpAuthPassword",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthPwdConfirm: {
                    "label": $scope.i18n.common_term_authenticPswConfirm_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpAuthPwdConfirm",
                    "type": "password",
                    "extendFunction": ["snmpAuthPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpAuthPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                snmpEncrptProtocol: {
                    "label": $scope.i18n.common_term_encrypProtocol_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpEncrptProtocol",
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
                snmpEncrptPassword: {
                    "label": $scope.i18n.common_term_DDAPsw_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpEncrptPassword",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpEncrptPwdConfirm: {
                    "label": $scope.i18n.common_term_DDAPswConfirm_label + ":",
                    "require": "true",
                    "id": "paramInfoSnmpEncrptPwdConfirm",
                    "type": "password",
                    "extendFunction": ["snmpEncrptPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpEncrptPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                trapProtocol: {
                    "label": $scope.i18n.common_term_trapVersion_label + ":",
                    "require": "true",
                    "id": "trapProtocol",
                    "values": [],
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = true;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#addSwitchStepId").widget().pre();
                    }
                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addSwitchParamDiv"));
                        if (!result) {
                            return;
                        }
                        if ($scope.snmpInfo.access) {
                            $scope.createInfo.ethSwitchSnmpInfoVo.version = $("#" + $scope.paramInfo.snmpVersion.id).widget().getSelectedId();
                            $scope.createInfo.ethSwitchSnmpInfoVo.ip = $("#" + $scope.paramInfo.snmpIp.id).widget().getValue();
                            $scope.createInfo.ethSwitchSnmpInfoVo.port = $("#" + $scope.paramInfo.snmpPort.id).widget().getValue();
                            $scope.createInfo.ethSwitchSnmpInfoVo.timeOut = $("#" + $scope.paramInfo.snmpTimeout.id).widget().getValue();
                            $scope.createInfo.ethSwitchSnmpInfoVo.retrycount = $("#" + $scope.paramInfo.snmpRetries.id).widget().getValue();
                            if ($scope.snmpInfo.version == "SNMPv3") {
                                $scope.createInfo.ethSwitchSnmpInfoVo.secName = $("#" + $scope.paramInfo.snmpSecurity.id).widget().getValue();
                                $scope.createInfo.ethSwitchSnmpInfoVo.authProtocol = $("#" + $scope.paramInfo.snmpAuthProtocol.id).widget().getSelectedId();
                                $scope.createInfo.ethSwitchSnmpInfoVo.authPassword = $("#" + $scope.paramInfo.snmpAuthPassword.id).widget().getValue();
                                $scope.createInfo.ethSwitchSnmpInfoVo.encryptProtocol = $("#" + $scope.paramInfo.snmpEncrptProtocol.id).widget().getSelectedId();
                                $scope.createInfo.ethSwitchSnmpInfoVo.encryptPassword = $("#" + $scope.paramInfo.snmpEncrptPassword.id).widget().getValue();
                            }
                            else {
                                $scope.createInfo.ethSwitchSnmpInfoVo.readComm = $("#" + $scope.paramInfo.readCommunity.id).widget().getValue();
                                $scope.createInfo.ethSwitchSnmpInfoVo.writeComm = $("#" + $scope.paramInfo.writeCommunity.id).widget().getValue();
                            }
                        }
                        else {
                            $scope.createInfo.ethSwitchSnmpInfoVo = null;
                        }
                        if ($scope.sshInfo.access) {
                            $scope.createInfo.ethSwitchSshInfoVo.ip = $("#" + $scope.paramInfo.sshIp.id).widget().getValue();
                            $scope.createInfo.ethSwitchSshInfoVo.port = $("#" + $scope.paramInfo.sshPort.id).widget().getValue();
                            $scope.createInfo.ethSwitchSshInfoVo.userName = $("#" + $scope.paramInfo.sshUsername.id).widget().getValue();
                            $scope.createInfo.ethSwitchSshInfoVo.password = $("#" + $scope.paramInfo.sshPassword.id).widget().getValue();
                        }
                        else {
                            $scope.createInfo.ethSwitchSshInfoVo = null;
                        }
                        if ($scope.trapProtocol.length != 0 && $scope.snmpInfo.access) {
                            $scope.createInfo.switchTrapSnmp = {};
                            $scope.createInfo.switchTrapSnmp.trapSnmpVersion = $("#" + $scope.paramInfo.trapProtocol.id).widget().getSelectedId();
                            if ($scope.isTrapSNMPv3) {
                                $scope.createInfo.switchTrapSnmp.port = $scope.createInfo.ethSwitchSnmpInfoVo.port;
                                $scope.createInfo.switchTrapSnmp.timeOut = $scope.createInfo.ethSwitchSnmpInfoVo.timeOut;
                                $scope.createInfo.switchTrapSnmp.retryTimes = $scope.createInfo.ethSwitchSnmpInfoVo.retrycount;
                                $scope.createInfo.switchTrapSnmp.securityName = $scope.createInfo.ethSwitchSnmpInfoVo.secName;
                                $scope.createInfo.switchTrapSnmp.authProtocol = $scope.createInfo.ethSwitchSnmpInfoVo.authProtocol;
                                $scope.createInfo.switchTrapSnmp.authPassWord = $scope.createInfo.ethSwitchSnmpInfoVo.authPassword
                                $scope.createInfo.switchTrapSnmp.confirmAuthPassWord = $scope.createInfo.ethSwitchSnmpInfoVo.authPassword
                                $scope.createInfo.switchTrapSnmp.dataEncryptionProtocol = $scope.createInfo.ethSwitchSnmpInfoVo.encryptProtocol
                                $scope.createInfo.switchTrapSnmp.dataEncryptionPassWord = $scope.createInfo.ethSwitchSnmpInfoVo.encryptPassword
                                $scope.createInfo.switchTrapSnmp.confirmDataEncryptionPassWord = $scope.createInfo.ethSwitchSnmpInfoVo.encryptPassword
                            }
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showAlarmSettingPage = false;
                            $scope.showConfirmInfoPage = true;
                        }
                        else if ($scope.trapProtocol.length != 0 && (!$scope.snmpInfo.access)) {
                            $scope.createInfo.switchTrapSnmp = {};
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showAlarmSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                        }
                        else {
                            $scope.createInfo.switchTrapSnmp = null;
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showConfirmInfoPage = true;
                        }
                        $("#addSwitchStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.switch");
                    }
                }

            };
            $scope.snmpParamInfo = {
                snmpVersion: {
                    "label": $scope.i18n.common_term_trapVersion_label + ":",
                    "require": "true",
                    "id": "snmpTrapVersionSelect",
                    "values": [],
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        var version = $("#" + $scope.snmpParamInfo.snmpVersion.id).widget().getSelectedId();
                        if (version.toUpperCase() == "SNMPV3") {
                            $scope.isTrapSNMPv3 = true;
                        }
                        else {
                            $scope.isTrapSNMPv3 = false;
                        }
                    }
                },
                snmpPort: {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "id": "snmpPort",
                    "value": "161",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                snmpTimeout: {
                    "label": $scope.i18n.device_term_timeout_label + "(S):",
                    "require": "true",
                    "id": "snmpTimeout",
                    "value": "10",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60})
                },
                snmpRetries: {
                    "label": $scope.i18n.device_term_retryTime_label + ":",
                    "require": "true",
                    "id": "retries",
                    "value": "3",
                    "tooltip": $scope.i18n.device_switch_connect_para_retryTime_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10}) + ";maxValue(10):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 10})
                },
                snmpSecurity: {
                    "id": "snmpSecurity",
                    "label": $scope.i18n.common_term_secuUserName_label + ":",
                    "require": "true",
                    "tooltip": $scope.i18n.device_switch_connect_para_secuUserName_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthProtocol: {
                    "label": $scope.i18n.common_term_authProtocol_label + ":",
                    "require": "true",
                    "id": "snmpAuthProtocol",
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
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + $scope.i18n.device_term_useSecurity_tip + "HMACSHA",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthPassword: {
                    "label": $scope.i18n.common_term_authenticPsw_label + ":",
                    "require": "true",
                    "id": "snmpAuthPassword",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpAuthPwdConfirm: {
                    "label": $scope.i18n.common_term_authenticPswConfirm_label + ":",
                    "require": "true",
                    "id": "snmpAuthPwdConfirm",
                    "type": "password",
                    "extendFunction": ["snmpAuthPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpAuthPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                snmpEncrptProtocol: {
                    "label": $scope.i18n.common_term_encrypProtocol_label + ":",
                    "require": "true",
                    "id": "snmpEncrptProtocol",
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
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpEncrptPassword: {
                    "label": $scope.i18n.common_term_DDAPsw_label + ":",
                    "require": "true",
                    "id": "snmpEncrptPassword",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                snmpEncrptPwdConfirm: {
                    "label": $scope.i18n.common_term_DDAPswConfirm_label + ":",
                    "require": "true",
                    "id": "snmpEncrptPwdConfirm",
                    "type": "password",
                    "extendFunction": ["snmpEncrptPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";snmpEncrptPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = false;
                        $scope.showParamSettingPage = true;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#addSwitchStepId").widget().pre();
                    }
                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addSanAlarmDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.createInfo.switchTrapSnmp.trapSnmpVersion = $("#" + $scope.snmpParamInfo.snmpVersion.id).widget().getSelectedId();
                        if ($scope.isTrapSNMPv3) {
                            $scope.createInfo.switchTrapSnmp.port = $("#" + $scope.snmpParamInfo.snmpPort.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.timeOut = $("#" + $scope.snmpParamInfo.snmpTimeout.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.retryTimes = $("#" + $scope.snmpParamInfo.snmpRetries.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.securityName = $("#" + $scope.snmpParamInfo.snmpSecurity.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.authProtocol = $("#" + $scope.snmpParamInfo.snmpAuthProtocol.id).widget().getSelectedId();
                            $scope.createInfo.switchTrapSnmp.authPassWord = $("#" + $scope.snmpParamInfo.snmpAuthPassword.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.confirmAuthPassWord = $("#" + $scope.snmpParamInfo.snmpAuthPwdConfirm.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.dataEncryptionProtocol = $("#" + $scope.snmpParamInfo.snmpEncrptProtocol.id).widget().getSelectedId();
                            $scope.createInfo.switchTrapSnmp.dataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPassword.id).widget().getValue();
                            $scope.createInfo.switchTrapSnmp.confirmDataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPwdConfirm.id).widget().getValue();
                        }
                        $scope.showBasicInfoPage = false;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = true;
                        $("#addSwitchStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.switch");
                    }
                }
            };

            $scope.confirmInfo = {
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        if ($scope.trapProtocol.length != 0 && (!$scope.snmpInfo.access)) {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = true;
                            $scope.showAlarmSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                        }
                        else {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = true;
                            $scope.showAlarmSettingPage = false;
                            $scope.showConfirmInfoPage = false;
                        }
                        $("#addSwitchStepId").widget().pre();
                    }
                },
                okBtn: {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_complete_label,
                    "click": function () {
                        $scope.operate.addSwitch($scope.createInfo);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.switch");
                    }
                }
            };
            $scope.operate = {
                initType: function () {
                    var addConfig = deviceConstants.rest.DEVICE_TYPE
                    var deferred1 = camel.get({
                        "url": {s: addConfig.url, o: {"id": '5'}},
                        "userId": $rootScope.user.id
                    });
                    deferred1.done(function (response) {
                        var dataList1 = response.instances;
                        var index;
                        for (index in dataList1) {
                            $scope.switchTypeMap[dataList1[index].devicesubType] = dataList1[index];
                            var model = {
                                "selectId": dataList1[index].devicesubType,
                                "label": dataList1[index].devicesubType
                            }
                            $scope.basicInfo.model.values.push(model);
                        }
                        var deferred2 = camel.get({
                            "url": {s: addConfig.url, o: {"id": '3'}},
                            "type": addConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred2.done(function (response) {
                            var dataList2 = response.instances;
                            var index;
                            for (index in dataList2) {
                                $scope.switchTypeMap[dataList2[index].devicesubType] = dataList2[index];
                                var model = {
                                    "selectId": dataList2[index].devicesubType,
                                    "label": dataList2[index].devicesubType
                                }
                                $scope.basicInfo.model.values.push(model);
                            }
                            $scope.basicInfo.model.values.sort(function (a, b) {
                                return  a.selectId.toUpperCase() > b.selectId.toUpperCase() ? 1 : -1;
                            });
                            $scope.$apply(function () {
                                setTimeout(function () {
                                    $("#" + $scope.basicInfo.model.id).widget().option("values", $scope.basicInfo.model.values);
                                }, 500);
                            });
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
                                "id": zones[index].name,
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
                setSnmpStatus: function (result) {
                    $("#snmpDiv .tiny_input_ip_container").each(function () {
                        $(this).widget().setDisable(result);
                    });
                    $("#snmpDiv .tiny-textbox").each(function () {
                        $(this).widget().option("disable", result);
                    });
                    $("#snmpDiv .tiny-select").each(function () {
                        $(this).widget().option("disable", result);
                    });
                    $("#" + $scope.paramInfo.snmpAuthPwdCheckbox.id).widget().option("disable", result);
                    $("#" + $scope.paramInfo.encrptPwdCheckbox.id).widget().option("disable", result);
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
                            $scope.showAlarmSettingPage = false;
                            $scope.showConfirmInfoPage = false;
                            $("#addSwitchStepId").widget().next();
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },

                addSwitch: function (params) {
                    var addConfig = deviceConstants.rest.SWITCH_ADD
                    var deferred = camel.post({
                        "url": addConfig.url,
                        "type": addConfig.type,
                        "userId": $rootScope.user.id,
                        "timeout": 60000,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $state.go("resources.device.switch");
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.initType();
            $scope.operate.initZone();
            $scope.operate.initRoom();

        }];

        return addSwitchCtrl;
    }
)
;

