/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-26

 */
define(['tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, UnifyValid, constants, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var addSanCtrl = ["$scope", "$compile", "$state", 'camel', "validator", "$rootScope", function ($scope, $compile, $state, camel, validator, $rootScope) {
            $scope.cloudType = $rootScope.user.cloudType;
            $scope.addSanStep1 = {
                "url": "../src/app/business/resources/views/device/san/addSan/basicInfo.html"
            };
            $scope.addSanStep2 = {
                "url": "../src/app/business/resources/views/device/san/addSan/paramSetting.html"
            };
            $scope.addSanStep3 = {
                "url": "../src/app/business/resources/views/device/san/addSan/alarmSetting.html"
            };
            $scope.addSanStep4 = {
                "url": "../src/app/business/resources/views/device/san/addSan/confirmInfo.html"
            };

            //控制步骤中各页面的显示
            $scope.showBasicInfoPage = true;
            $scope.showParamSettingPage = false;
            $scope.showAlarmSettingPage = false;
            $scope.showConfirmInfoPage = false;

            //页面上的导航
            $scope.addSanStep = {
                "id": "addSanStepId",
                "jumpable": "true",
                "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label],
                "width": "800"
            };
            $scope.formfieldWidth = "215px";
            //接入SAN数据模型-基本信息页面
            $scope.phyStorageBasicInfo = {};
            //接入SAN数据模型-接入参数（SMIS）
            $scope.phyStorageSmisParam = {};
            //接入SAN数据模型-接入参数（TLV）
            $scope.phyStorageTlvParam = {};
            //接入SAN数据模型-接入参数（其他）
            $scope.phyStorageOtherParam = {};
            //san接入协议MAP
            $scope.sanTypeMap = {};
            //当前接入协议
            $scope.accessProtocol = "";
            $scope.trapProtocol = [];
            $scope.isDataEncrptProtocol = true;

            //默认snmp版本
            $scope.isSNMPv3 = true;

            //冲突检测数据模型
            $scope.checkModel = {
                "deviceType": 3,
                "roomName": "",
                "rackId": "",
                "subRackId": ""
            };
            //IP是否合法
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return true;
                }
                return validator.ipValidator(ip);
            };
            //两次输入的密码是否一致
            UnifyValid.pwdEqual = function () {
                if ($("#" + $scope.paramSetting.password.id).widget().getValue() === $("#" + $scope.paramSetting.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp认证协议两次输入密码是否一致校验
            UnifyValid.snmpAuthPwdEqual = function () {
                if ($("#" + $scope.snmpParamInfo.snmpAuthPassword.id).widget().getValue() === $("#" + $scope.snmpParamInfo.snmpAuthPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };
            //snmp数据加密协议两次输入密码是否一致校验
            UnifyValid.snmpEncrptPwdEqual = function () {
                if ($("#" + $scope.snmpParamInfo.snmpEncrptPassword.id).widget().getValue() === $("#" + $scope.snmpParamInfo.snmpEncrptPwdConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //基本信息页面
            $scope.basicInfo = {
                name: {
                    "id": "name",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": "true",
                    "value": "",
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
                        $scope.accessProtocol = $scope.sanTypeMap[selectModelId].accessProtocol[0];
                        $scope.trapProtocol = $scope.sanTypeMap[selectModelId].trapProtocol || [];
                        if ($scope.trapProtocol.length == 0) {
                            $("#" + $scope.addSanStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_confirmInfo_label]);
                        }
                        else {
                            $("#" + $scope.addSanStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label])
                            $scope.isSNMPv3 = false;
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
                            $scope.snmpParamInfo.snmpVersion.values = snmpProtocolList;
                        }
                    }
                },
                zone: {
                    "label": $scope.i18n.resource_term_zone_label + ":",
                    "require": "true",
                    "values": [],
                    "id": "",
                    "value": "",
                    "height": 290,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                room: {
                    "id": "room",
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
                    "id": "description",
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
                        var result = UnifyValid.FormValid($("#addSanBasicInfo"));
                        if (!result) {
                            return;
                        }
                        $scope.phyStorageBasicInfo = {};
                        $scope.phyStorageBasicInfo.deviceName = $("#" + $scope.basicInfo.name.id).widget().getValue();
                        $scope.phyStorageBasicInfo.deviceType = $("#" + $scope.basicInfo.model.id).widget().getSelectedId();
                        $scope.phyStorageBasicInfo.zoneId = $scope.basicInfo.zone.id;
                        $scope.phyStorageBasicInfo.roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $scope.checkModel.roomName = $scope.phyStorageBasicInfo.roomName;
                        $scope.phyStorageBasicInfo.rackName = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                        $scope.checkModel.rackId = $scope.phyStorageBasicInfo.rackName;
                        $scope.phyStorageBasicInfo.subRackName = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                        $scope.checkModel.subRackId = $scope.phyStorageBasicInfo.subRackName;
                        $scope.phyStorageBasicInfo.description = $("#" + $scope.basicInfo.description.id).widget().getValue();

                        //检测冲突
                        $scope.operate.checkCollision($scope.checkModel);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.san");
                    }
                }

            };

            //接入参数页面
            $scope.paramSetting = {
                aIp: {
                    "label": $scope.i18n.device_term_controlAIP_label + ":",
                    "require": "true",
                    "id": "aIp",
                    "type": "ipv4",
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(aIp):" + $scope.i18n.common_term_formatIP_valid
                },
                bIp: {
                    "label": $scope.i18n.device_term_controlBIP_label + ":",
                    "require": "false",
                    "id": "bIp",
                    "type": "ipv4",
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "ipCheck(bIp):" + $scope.i18n.common_term_formatIP_valid
                },
                accessProtocol: {
                    "id": "accessProtocol",
                    "require": "true",
                    "label": $scope.i18n.device_term_accessProtocol_label + ":",
                    "values": [
                        {
                            "selectId": "http",
                            "label": "http"
                        },
                        {
                            "selectId": "https",
                            "label": "https",
                            "checked": true
                        }
                    ],
                    "tip": $scope.i18n.device_term_sameWithDevice_tip + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: 'https'})
                },
                port: {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "id": "port",
                    "value": "5998",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid
                },
                nameSpace: {
                    "label": $scope.i18n.device_term_namespace_label + ":",
                    "require": "true",
                    "id": "sshUsername",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                username: {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "id": "username",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32}),
                    "tips": $scope.i18n.device_san_connect_para_userName_mean_tip
                },
                password: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "password",
                    "type": "password",
                    "value": "",
                    "tips": $scope.i18n.device_san_connect_para_psw_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                passwordConfirm: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "passwordConfirm",
                    "type": "password",
                    "value": "",
                    "extendFunction": ["pwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = true;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#addSanStepId").widget().pre();
                    }

                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addSanParamSetting"));
                        if (!result) {
                            return;
                        }
                        $scope.createInfo = {};
                        $scope.createInfo.phyStorageBasicInfo = $scope.phyStorageBasicInfo;
                        if ($scope.accessProtocol == "TLV") {
                            $scope.phyStorageTlvParam.controllerAIp = $("#" + $scope.paramSetting.aIp.id).widget().getValue();
                            $scope.paramSetting.aIp.value = $scope.phyStorageTlvParam.controllerAIp;
                            $scope.phyStorageTlvParam.controllerBIp = $("#" + $scope.paramSetting.bIp.id).widget().getValue();
                            $scope.paramSetting.bIp.value = $scope.phyStorageTlvParam.controllerBIp;
                            $scope.phyStorageTlvParam.userName = $("#" + $scope.paramSetting.username.id).widget().getValue();
                            $scope.paramSetting.username.value = $scope.phyStorageTlvParam.userName;
                            $scope.phyStorageTlvParam.passwd = $("#" + $scope.paramSetting.password.id).widget().getValue();
                            $scope.createInfo.phyStorageTlvParam = $scope.phyStorageTlvParam;
                        }
                        else if ($scope.accessProtocol == "SMI_S") {
                            $scope.phyStorageSmisParam.controllerAIp = $("#" + $scope.paramSetting.aIp.id).widget().getValue();
                            $scope.paramSetting.aIp.value = $scope.phyStorageSmisParam.controllerAIp;
                            $scope.phyStorageSmisParam.controllerBIp = $("#" + $scope.paramSetting.bIp.id).widget().getValue();
                            $scope.paramSetting.bIp.value = $scope.phyStorageSmisParam.controllerBIp;
                            $scope.phyStorageSmisParam.accessProtocol = $("#" + $scope.paramSetting.accessProtocol.id).widget().getSelectedId();
                            $scope.paramSetting.accessProtocol.value = $scope.phyStorageSmisParam.accessProtocol;
                            $scope.phyStorageSmisParam.port = $("#" + $scope.paramSetting.port.id).widget().getValue();
                            $scope.paramSetting.port.value = $scope.phyStorageSmisParam.port;
                            $scope.phyStorageSmisParam.nameSpace = $("#" + $scope.paramSetting.nameSpace.id).widget().getValue();
                            $scope.paramSetting.nameSpace.value = $scope.phyStorageSmisParam.nameSpace;
                            $scope.phyStorageSmisParam.userName = $("#" + $scope.paramSetting.username.id).widget().getValue();
                            $scope.paramSetting.username.value = $scope.phyStorageSmisParam.userName;
                            $scope.phyStorageSmisParam.passwd = $("#" + $scope.paramSetting.password.id).widget().getValue();
                            $scope.createInfo.phyStorageSmisParam = $scope.phyStorageSmisParam;
                        }
                        else {
                            $scope.phyStorageOtherParam.controllerAIp = $("#" + $scope.paramSetting.aIp.id).widget().getValue();
                            $scope.paramSetting.aIp.value = $scope.phyStorageOtherParam.controllerAIp;
                            $scope.phyStorageOtherParam.controllerBIp = $("#" + $scope.paramSetting.bIp.id).widget().getValue();
                            $scope.paramSetting.bIp.value = $scope.phyStorageOtherParam.controllerBIp;
                            $scope.phyStorageOtherParam.userName = $("#" + $scope.paramSetting.username.id).widget().getValue();
                            $scope.paramSetting.username.value = $scope.phyStorageOtherParam.userName;
                            $scope.phyStorageOtherParam.passwd = $("#" + $scope.paramSetting.password.id).widget().getValue();
                            $scope.createInfo.phyStorageOtherParam = $scope.phyStorageOtherParam;
                        }
                        if ($scope.trapProtocol.length == 0) {
                            $scope.createInfo.snmpParam = null;
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showAlarmSettingPage = false;
                            $scope.showConfirmInfoPage = true;
                        } else {
                            $scope.createInfo.snmpParam = {};
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showAlarmSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                        }
                        $("#addSanStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.san");
                    }
                }
            };

            $scope.snmpParamInfo = {
                snmpVersion: {
                    "label": $scope.i18n.common_term_trapVersion_label + ":",
                    "require": "true",
                    "id": "snmpVersionSelect",
                    "values": [],
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        var version = $("#" + $scope.snmpParamInfo.snmpVersion.id).widget().getSelectedId();
                        if (version.toUpperCase() == "SNMPV3") {
                            $scope.isSNMPv3 = true;
                        }
                        else {
                            $scope.isSNMPv3 = false;
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
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "HMACSHA"}),
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
                        },
                        {
                            selectId: "",
                            label: $scope.i18n.common_term_notSupport_value
                        }
                    ],
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "AES128"}),
                    "change": function () {
                        if ($("#" + $scope.snmpParamInfo.snmpEncrptProtocol.id).widget().getSelectedId()) {
                            $scope.isDataEncrptProtocol = true;
                        }
                        else {
                            $scope.isDataEncrptProtocol = false;
                        }
                    }
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
                        $("#addSanStepId").widget().pre();
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
                        $scope.createInfo.snmpParam.trapSnmpVersion = $("#" + $scope.snmpParamInfo.snmpVersion.id).widget().getSelectedId();
                        if ($scope.isSNMPv3) {
                            $scope.createInfo.snmpParam.port = $("#" + $scope.snmpParamInfo.snmpPort.id).widget().getValue();
                            $scope.createInfo.snmpParam.timeOut = $("#" + $scope.snmpParamInfo.snmpTimeout.id).widget().getValue();
                            $scope.createInfo.snmpParam.retryTimes = $("#" + $scope.snmpParamInfo.snmpRetries.id).widget().getValue();
                            $scope.createInfo.snmpParam.securityName = $("#" + $scope.snmpParamInfo.snmpSecurity.id).widget().getValue();
                            $scope.createInfo.snmpParam.authProtocol = $("#" + $scope.snmpParamInfo.snmpAuthProtocol.id).widget().getSelectedId();
                            $scope.createInfo.snmpParam.authPassWord = $("#" + $scope.snmpParamInfo.snmpAuthPassword.id).widget().getValue();
                            $scope.createInfo.snmpParam.confirmAuthPassWord = $("#" + $scope.snmpParamInfo.snmpAuthPwdConfirm.id).widget().getValue();
                            $scope.createInfo.snmpParam.dataEncryptionProtocol = $("#" + $scope.snmpParamInfo.snmpEncrptProtocol.id).widget().getSelectedId();
                            if ($scope.isDataEncrptProtocol) {
                                $scope.createInfo.snmpParam.dataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPassword.id).widget().getValue();
                                $scope.createInfo.snmpParam.confirmDataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPwdConfirm.id).widget().getValue();
                            }
                            else {
                                $scope.createInfo.snmpParam.dataEncryptionPassWord = "";
                                $scope.createInfo.snmpParam.confirmDataEncryptionPassWord = "";
                            }
                        }
                        $scope.showBasicInfoPage = false;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = true;
                        $("#addSanStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.san");
                    }
                }
            };

            //信息确认页面
            $scope.confirmInfo = {
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        if ($scope.trapProtocol.length == 0) {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = true;
                            $scope.showAlarmSettingPage = false;
                            $scope.showConfirmInfoPage = false;
                        } else {
                            $scope.showBasicInfoPage = false;
                            $scope.showParamSettingPage = false;
                            $scope.showAlarmSettingPage = true;
                            $scope.showConfirmInfoPage = false;
                        }
                        $("#addSanStepId").widget().pre();
                    }
                },
                okBtn: {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_complete_label,
                    "click": function () {
                        $scope.operate.addSan($scope.createInfo);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.san");
                    }
                }

            };
            $scope.operate = {
                initType: function () {
                    var addConfig = deviceConstants.rest.DEVICE_TYPE
                    var deferred = camel.get({
                        "url": {s: addConfig.url, o: {"id": '4'}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var dataList = response.instances;
                        var index;
                        for (index in dataList) {
                            $scope.sanTypeMap[dataList[index].devicesubType] = dataList[index];
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
                        "url": {s: queryConfig.url, o: {"tenant_id": "1"}},
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
                            $("#addSanStepId").widget().next();
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                addSan: function (params) {
                    var addConfig = deviceConstants.rest.SAN_ADD
                    var deferred = camel.post({
                        "url": addConfig.url,
                        "type": addConfig.type,
                        "userId": $rootScope.user.id,
                        "timeout": 60000,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (data) {
                        $state.go("resources.device.san");
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
        return addSanCtrl;
    }
);



