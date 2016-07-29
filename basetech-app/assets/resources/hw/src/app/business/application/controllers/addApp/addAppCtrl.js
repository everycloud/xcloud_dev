define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Message',
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"],
    function ($, angular, Message, UnifyValid, constants, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";

        var addRackHostCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$rootScope", "validator", function ($scope, $compile, $state, $stateParams, camel, $rootScope, validator) {
            $scope.cloudType = $rootScope.user.cloudType;
            //控制步骤显示
            $scope.showBasicInfoPage = true;
            $scope.showParamSettingPage = false;
            $scope.showAlarmSettingPage = false;
            $scope.showConfirmInfoPage = false;

            $scope.addHostStep1 = {
                "url": "../src/app/business/resources/views/device/host/addHost/basicInfo.html"
            };
            $scope.addHostStep2 = {
                "url": "../src/app/business/resources/views/device/host/addHost/paramSetting.html"
            };
            $scope.addHostStep3 = {
                "url": "../src/app/business/resources/views/device/host/addHost/alarmSetting.html"
            };
            $scope.addHostStep4 = {
                "url": "../src/app/business/resources/views/device/host/addHost/confirmInfo.html"
            };

            $scope.addRackHostStep = {
                "id": "addRackHostStepId",
                "jumpable": "true",
                "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label],
                "width": "800"
            };

            $scope.formfieldWidth = "215px";

            //IPMI认证协议两次输入密码是否一致校验
            UnifyValid.pwdEqual = function () {
                if ($("#" + $scope.IPMIParamInfo.passwordItem.id).widget().getValue() === $("#" + $scope.IPMIParamInfo.passwordConfirmItem.id).widget().getValue()) {
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
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return true;
                }
                return validator.ipValidator(ip);
            };
            //不能包含不能包含特殊字符：| ; $ & > <
            UnifyValid.bmcStr = function (id) {
                var str = $("#" + id).widget().getValue();
                if (str.match(/^((?![;|\||\&|\$|\>|\<]).)*$/)) {
                    return true;
                }
                else {
                    return $scope.i18n.common_term_noSpecialCharacter2_valid;
                }
            };

            //是否裸金属接入
            $scope.isBareMetal = false;
            //服务器类型Map
            $scope.hostTypeMap = {};

            //支持的协议类型
            $scope.accessProtocol = [];
            $scope.trapProtocol = [];

            //告警配置页面默认协议
            $scope.isSNMPv3 = true;

            //冲突检测数据模型
            $scope.checkModel = {
                "deviceType": 6,
                "roomName": "",
                "rackId": "",
                "subRackId": ""
            };

            //接入服务器数据模型
            $scope.createInfo = {
                "name": "",
                "deviceType": "",
                "rackId": "",
                "subRackId": "",
                "zoneId": "",
                "roomName": "",
                "description": "",
                "protocol": "IPMI2.0",
                "ipmiConnectorParam": {},
                "sshConnectorParam": {},
                "snmpParam": {}
            };

            $scope.showIPMITip = false;

            $scope.basicInfo = {
                nameItem: {
                    "id": "nameText",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": "true",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName4Host + "):" +
                        $scope.i18n.common_term_composition3_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + " " + $scope.i18n.common_term_composition3_valid
                },
                modelItem: {
                    "label": $scope.i18n.device_term_model_label + ":",
                    "require": "true",
                    "id": "modelSelect",
                    "values": [],
                    "height": "290",
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "change": function () {
                        var selectModelId = $("#" + $scope.basicInfo.modelItem.id).widget().getSelectedId();
                        $scope.accessProtocol = $scope.hostTypeMap[selectModelId].accessProtocol;
                        var values = [];
                        for (var index in  $scope.accessProtocol) {
                            var protocol = $scope.accessProtocol[index];
                            if ("IPMI20" == protocol) {
                                var value = {"selectId": "2.0",
                                    "label": "2.0",
                                    "checked": false
                                }
                            }
                            else if ("IPMI15" == protocol) {
                                var value = {"selectId": "1.5",
                                    "label": "1.5",
                                    "checked": false
                                }
                            }
                            else {
                                continue;
                            }
                            values.push(value);
                        }
                        if (values.length > 1) {
                            $scope.showIPMITip = true;
                        }
                        values[0].checked = true;
                        $scope.IPMIParamInfo.versionItem.values = values;
                        $scope.trapProtocol = $scope.hostTypeMap[selectModelId].trapProtocol || [];
                        if ($scope.trapProtocol.length == 0) {
                            $("#" + $scope.addRackHostStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_confirmInfo_label]);
                        }
                        else {
                            $("#" + $scope.addRackHostStep.id).widget().option("values", [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setPara_label, $scope.i18n.common_term_alarmSet_label, $scope.i18n.common_term_confirmInfo_label])
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
                accessType: {
                    "label": $scope.i18n.device_term_connectModeServer_label,
                    "require": "true",
                    "tooltip": $scope.i18n.device_rack_connect_para_connectHyper_mean_label
                },
                zoneItem: {
                    "label": $scope.i18n.resource_term_zone_label + ":",
                    "require": "true",
                    "values": [],
                    "value": "",
                    "height": 290,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                roomItem: {
                    "id": "roomText",
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
                        var selectRoomName = $("#" + $scope.basicInfo.roomItem.id).widget().getValue();
                        $("#" + $scope.basicInfo.cabinetItem.id).widget().option("value", "");
                        $scope.operate.getCabinet(selectRoomName);
                    }
                },
                cabinetItem: {
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
                subrackItem: {
                    "id": "subrackText",
                    "label": $scope.i18n.device_term_subrack_label + ":",
                    "require": "true",
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + $scope.i18n.common_term_composition2_valid,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                descriptionItem: {
                    "id": "descriptionText",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "type": "multi",
                    "height": "40px",
                    "require": "false",
                    "value": "",
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                }
            };
            $scope.basicButtonGroup = {
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addRackHostBasicInfo"));
                        if (!result) {
                            return;
                        }
                        $scope.createInfo.name = $("#" + $scope.basicInfo.nameItem.id).widget().getValue();
                        $scope.createInfo.deviceType = $("#" + $scope.basicInfo.modelItem.id).widget().getSelectedId();
                        $scope.createInfo.accessType = "1";
                        $scope.createInfo.roomName = $("#" + $scope.basicInfo.roomItem.id).widget().getValue();
                        $scope.checkModel.roomName = $scope.createInfo.roomName;
                        $scope.createInfo.rackId = $("#" + $scope.basicInfo.cabinetItem.id).widget().getValue();
                        $scope.checkModel.rackId = $scope.createInfo.rackId;
                        $scope.createInfo.subRackId = $("#" + $scope.basicInfo.subrackItem.id).widget().getValue();
                        $scope.checkModel.subRackId = $scope.createInfo.subRackId;
                        $scope.createInfo.description = $("#" + $scope.basicInfo.descriptionItem.id).widget().getValue();
                        $scope.operate.checkCollision($scope.checkModel);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.host");
                    }
                }};

            $scope.setIpmi = true;
            $scope.checkbox = {
                "id": "paramSettingCheckbox",
                "checked": "true",
                "text": $scope.i18n.device_all_connect_para_IPMI_label,
                "height": "27px",
                "change": function () {
                    if ($("#paramSettingCheckbox").widget().option("checked")) {
                        $scope.setIpmi = true;
                        $("#versionSelect").widget().option("disable", false);
                        $("#bmcIp").widget().setDisable(false);
                        $("#port").widget().option("disable", false);
                        $("#timeout").widget().option("disable", false);
                        $("#username").widget().option("disable", false);
                        $("#password").widget().option("disable", false);
                        $("#confirmPassword").widget().option("disable", false);

                    }
                    else {
                        var warnMsg = new Message({
                            "type": "warn",
                            "title": $scope.i18n.common_term_tip_label,
                            "content": $scope.i18n.device_all_notConnectIPMI_info_label,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [
                                {
                                    label: 'OK',
                                    accessKey: '2',
                                    "key": "okBtn",
                                    majorBtn: true,
                                    default: true
                                }
                            ]
                        });
                        warnMsg.setButton("okBtn", function () {
                            $scope.setIpmi = false;
                            $("#versionSelect").widget().option("disable", true);
                            UnifyValid.clearValidate($("#bmcIp"));
                            $("#bmcIp").widget().setDisable(true);
                            UnifyValid.clearValidate($("#port").find("input"));
                            $("#port").widget().option("disable", true);
                            UnifyValid.clearValidate($("#timeout").find("input"));
                            $("#timeout").widget().option("disable", true);
                            UnifyValid.clearValidate($("#username").find("input"));
                            $("#username").widget().option("disable", true);
                            UnifyValid.clearValidate($("#password").find("input"));
                            $("#password").widget().option("disable", true);
                            UnifyValid.clearValidate($("#confirmPassword").find("input"));
                            $("#confirmPassword").widget().option("disable", true);
                            warnMsg.destroy();
                        });
                        warnMsg.show();

                    }
                }
            };
            $scope.IPMIParamInfo = {
                versionItem: {
                    "label": $scope.i18n.common_term_protocolVersion_label,
                    "require": "true",
                    "id": "versionSelect",
                    "values": [],
                    "disable": !$scope.setIpmi,
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "tooltip": $scope.i18n.device_term_sameWithDevice_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "2.0"})
                },
                bmcIpItem: {
                    "label": $scope.i18n.device_term_BMCip_label + ":",
                    "require": "true",
                    "id": "bmcIp",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "extendFunction": ["ipCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(bmcIp):" + $scope.i18n.common_term_formatIP_valid
                },
                portItem: {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "id": "port",
                    "disable": !$scope.setIpmi,
                    "value": "623",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                timeoutItem: {
                    "label": $scope.i18n.device_term_timeout_label + "(S):",
                    "require": "true",
                    "id": "timeout",
                    "disable": !$scope.setIpmi,
                    "value": "10",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60}) + ";maxValue(60):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 60})
                },
                usernameItem: {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "id": "username",
                    "disable": !$scope.setIpmi,
                    "value": "",
                    "extendFunction": ["bmcStr"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                        + ";bmcStr(username)"
                },
                passwordItem: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "password",
                    "type": "password",
                    "disable": !$scope.setIpmi,
                    "value": "",
                    "extendFunction": ["bmcStr"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                        + ";bmcStr(password)"
                },
                passwordConfirmItem: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "confirmPassword",
                    "type": "password",
                    "disable": !$scope.setIpmi,
                    "extendFunction": ["pwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                }};

            $scope.SSHParamInfo = {
                manageIpItem: {
                    "label": $scope.i18n.common_term_managerIP_label + ":",
                    "require": "true",
                    "id": "manageIp",
                    "type": "ipv4",
                    "value": "",
                    "extendFunction": ["ipCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(manageIp):" + $scope.i18n.common_term_formatIP_valid
                }
            };
            $scope.paramButtonGroup = {
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = true;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = false;
                        $scope.showIPMITip = false;
                        $("#addRackHostStepId").widget().pre();
                    }
                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addRackHostParamSetting"));
                        if (!result) {
                            return;
                        }
                        if ($scope.setIpmi) {
                            $scope.createInfo.ipmiConnectorParam.version = $("#" + $scope.IPMIParamInfo.versionItem.id).widget().getSelectedId();
                            $scope.createInfo.protocol = "IPMI" + $scope.createInfo.ipmiConnectorParam.version;
                            $scope.createInfo.ipmiConnectorParam.ip = $("#" + $scope.IPMIParamInfo.bmcIpItem.id).widget().getValue();
                            $scope.createInfo.ipmiConnectorParam.port = $("#" + $scope.IPMIParamInfo.portItem.id).widget().getValue();
                            $scope.createInfo.ipmiConnectorParam.userName = $("#" + $scope.IPMIParamInfo.usernameItem.id).widget().getValue();
                            $scope.createInfo.ipmiConnectorParam.password = $("#" + $scope.IPMIParamInfo.passwordItem.id).widget().getValue();
                            $scope.createInfo.ipmiConnectorParam.timeOut = $("#" + $scope.IPMIParamInfo.timeoutItem.id).widget().getValue();
                        }
                        else {
                            $scope.createInfo.protocol = "";
                            $scope.createInfo.ipmiConnectorParam = null;
                        }
                        $scope.createInfo.sshConnectorParam.ip = $("#" + $scope.SSHParamInfo.manageIpItem.id).widget().getValue();
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
                        $("#addRackHostStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.host");
                    }
                }
            };
            $scope.snmpParamInfo = {
                snmpVersion: {
                    "label": $scope.i18n.common_term_version_label + ":",
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
                    "tooltip": $scope.i18n.device_blade_connect_para_authProtocol_mean_tip + "" + $scope.i18n.sprintf($scope.i18n.device_term_useSecurity_tip, {1: "HMACSHA"}),
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
                    "validate": "required:" + $scope.i18n.common_term_null_valid,
                    "tooltip": $scope.i18n.device_blade_connect_para_encrypProtocol_mean_tip
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
                }
            };
            $scope.alarmButtonGroup = {
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = false;
                        $scope.showParamSettingPage = true;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#addRackHostStepId").widget().pre();
                    }
                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#addRackHostAlarmSetting"));
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
                            $scope.createInfo.snmpParam.dataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPassword.id).widget().getValue();
                            $scope.createInfo.snmpParam.confirmDataEncryptionPassWord = $("#" + $scope.snmpParamInfo.snmpEncrptPwdConfirm.id).widget().getValue();
                        }
                        $scope.showBasicInfoPage = false;
                        $scope.showParamSettingPage = false;
                        $scope.showAlarmSettingPage = false;
                        $scope.showConfirmInfoPage = true;
                        $("#addRackHostStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.host");
                    }
                }
            };

            $scope.confirmButtonGroup = {
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
                        $("#addRackHostStepId").widget().pre();
                    }
                },
                okBtn: {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_complete_label,
                    "click": function () {
                        $scope.operate.addHost($scope.createInfo)
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.host");
                    }
                }
            };
            $scope.operate = {
                initType: function () {
                    var addConfig = deviceConstants.rest.DEVICE_TYPE
                    var deferred = camel.get({
                        "url": {s: addConfig.url, o: {"id": '2'}},
                        "type": addConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var dataList = response.instances;
                        var index;
                        for (index in dataList) {
                            $scope.hostTypeMap[dataList[index].devicesubType] = dataList[index];
                            var model = {
                                "selectId": dataList[index].devicesubType,
                                "label": dataList[index].devicesubType
                            }
                            $scope.basicInfo.modelItem.values.push(model);
                        }
                        $scope.$apply(function () {
                            setTimeout(function () {
                                $("#" + $scope.basicInfo.modelItem.id).widget().option("values", $scope.basicInfo.modelItem.values);
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
                        $scope.basicInfo.zoneItem.values = availableZones;
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
                            $("#" + $scope.basicInfo.roomItem.id).widget().option("values", availableRooms);
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
                        $("#" + $scope.basicInfo.cabinetItem.id).widget().option("values", availableRacks);
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
                            $("#addRackHostStepId").widget().next();
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                addHost: function (params) {
                    var addConfig = deviceConstants.rest.HOST_ADD
                    var deferred = camel.post({
                        "url": addConfig.url,
                        "type": addConfig.type,
                        "params": JSON.stringify(params),
                        "timeout": 60000,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $state.go("resources.device.host");
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

        return addRackHostCtrl;
    }
);