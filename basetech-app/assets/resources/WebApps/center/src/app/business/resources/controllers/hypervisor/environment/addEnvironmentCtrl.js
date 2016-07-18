/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Message, UnifyValid, Exception) {
        "use strict";

        var addEnvironmentCtrl = ["$scope", "$compile", "$state", "camel", "$stateParams", "validator",
            function ($scope, $compile, $state, camel, $stateParams, validator) {
                var exceptionService = new Exception();
                var user = $("html").scope().user;
                var eid = $stateParams.eid;
                var action = $stateParams.action;
                var versions = {
                    "FusionCompute": {
                        values: [
                            {
                                "selectId": "1.3.10",
                                "label": "1.3.10"
                            },
                            {
                                "selectId": "1.5.0",
                                "label": "1.5.0"
                            }
                        ],
                        "defaultSelectid": "1.5.0"
                    },
                    "VMware": {
                        values: [
                            {
                                "selectId": "5.0.0",
                                "label": "5.0.0"
                            },
                            {
                                "selectId": "5.1.0",
                                "label": "5.1.0"
                            },
                            {
                                "selectId": "5.5.0",
                                "label": "5.5.0"
                            }
                        ],
                        "defaultSelectid": "5.1.0"
                    },
                    "XenServer": {
                        values: [
                            {
                                "selectId": "5.6.2",
                                "label": "5.6.2"
                            }
                        ],
                        "defaultSelectid": "5.6.2"
                    }
                };
                var protocols = {
                    "FusionCompute": {
                        values: [
                            {
                                "selectId": "https",
                                "label": "https"
                            }
                        ],
                        "defaultSelectid": "https"
                    },
                    "VMware": {
                        values: [
                            {
                                "selectId": "https",
                                "label": "https"
                            }
                        ],
                        "defaultSelectid": "https"
                    },
                    "XenServer": {
                        values: [
                            {
                                "selectId": "http",
                                "label": "http"
                            }
                        ],
                        "defaultSelectid": "http"
                    }
                };
                $scope.title = $scope.i18n.virtual_term_addHyper_button;
                $scope.stepUrl = {
                    "step1": "../src/app/business/resources/views/hypervisor/environment/addEnvironmentInfo.html",
                    "step2": "../src/app/business/resources/views/hypervisor/environment/addEnvironmentVsam.html",
                    "step3": "../src/app/business/resources/views/hypervisor/environment/addEnvironmentConfirm.html"
                };
                $scope.curStep = "info";
                $scope.addStep = {
                    "id": "add_environment_step",
                    "values": [$scope.i18n.virtual_term_hyperInfo_label, $scope.i18n.virtual_term_vsamInfo_label, $scope.i18n.common_term_confirmInfo_label],
                    "width": "300",
                    "jumpable": false
                };
                $scope.model = {
                    "hypervisor": {
                        "connector": {
                        }
                    },
                    "vsam": {
                        "connector": {
                        }
                    }
                };
                //虚拟化环境信息页面

                //  显示修改VLAN池复选框
                $scope.showModifyVlanPool = true;

                //名称输入框
                $scope.nameTextbox = {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": true,
                    "id": "addNameTextbox",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}) +
                        ";regularCheck(" + validator.cloudRegionNameRe + "):" + $scope.i18n.common_term_composition2_valid
                };
                //类型下拉框
                $scope.typeSelector = {
                    "label": $scope.i18n.common_term_type_label + ":",
                    "require": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                    "id": "add_environment_type_selector",
                    "width": "150",
                    "disable": action === "edit",
                    "values": [
                        {
                            "selectId": "FusionCompute",
                            "label": "FusionCompute"
                        },
                        {
                            "selectId": "VMware",
                            "label": "VMware"
                        }
                    ],
                    "defaultSelectid": "FusionCompute",
                    "change": function () {
                        $scope.typeSelector.selectedId = $("#" + $scope.typeSelector.id).widget().getSelectedId();
                        var version = versions[$scope.typeSelector.selectedId].values;
                        var defaultSelectId = versions[$scope.typeSelector.selectedId].defaultSelectid;
                        $("#" + $scope.versionSelector.id).widget().option("values", version);
                        $("#" + $scope.versionSelector.id).widget().opChecked(defaultSelectId);

                        var protocol = protocols[$scope.typeSelector.selectedId].values;
                        var defaultSelectId = protocols[$scope.typeSelector.selectedId].defaultSelectid;
                        $("#" + $scope.protocolSelector.id).widget().option("values", protocol);
                        $("#" + $scope.protocolSelector.id).widget().opChecked(defaultSelectId);

                        $scope.showModifyVlanPool = $scope.typeSelector.selectedId === "FusionCompute";
                    }
                };
                //版本下拉框
                $scope.versionSelector = {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "require": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                    "id": "add_environment_version_selector",
                    "width": "150",
                    "values": versions.FusionCompute.values,
                    "defaultSelectid": versions.FusionCompute.defaultSelectid
                };
                //接入协议下拉框
                $scope.protocolSelector = {
                    "label": $scope.i18n.device_term_connectProtocol_label + ":",
                    "require": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                    "id": "add_environment_protocol_selector",
                    "width": "150",
                    "values": [
                        {
                            "selectId": "https",
                            "label": "https"
                        }
                    ],
                    "defaultSelectid": "https"
                };
                //IP输入框
                $scope.ipBox = {
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": true,
                    "width": "150",
                    "value": "",
                    "extendFunction": ["ipValidator", "ipRangeCheck", "ipNotStartWith127"],
                    "id": "addEnvironmentIpBox",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";ipValidator:" + $scope.i18n.common_term_formatIP_valid +
                        ";ipNotStartWith127:" + $scope.i18n.vpc_term_IPcantbe127_valid + ";ipRangeCheck:" +
                        validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": "1.0.0.0", "2": "223.255.255.255"})
                };
                UnifyValid.ipValidator = function () {
                    var ip = $("#" + $scope.ipBox.id).widget().getValue();
                    return validator.ipFormatCheck(ip);
                };
                UnifyValid.ipNotStartWith127 = function () {
                    var ip = $("#" + $scope.ipBox.id).widget().getValue();
                    return validator.ipNotStartWith127(ip);
                };
                UnifyValid.ipRangeCheck = function () {
                    var ip = $("#" + $scope.ipBox.id).widget().getValue();
                    return validator.ipRangeCheck("1.0.0.0", "223.255.255.255", ip);
                };
                //端口
                $scope.portTextbox = {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": true,
                    "id": "add_environment_port_textbox",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                        ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535})
                };
                //用户名
                $scope.usernameTextbox = {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": true,
                    "id": "add_environment_username_textbox",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"})
                };
                //修改密码复选框
                $scope.editPwdCheckbox = {
                    "label": "",
                    "id": "editPasswordCheckbox",
                    "text": $scope.i18n.common_term_modifyPsw_button,
                    "change": function () {
                        var result = $("#" + $scope.editPwdCheckbox.id).widget().option("checked");
                        $("#" + $scope.passwordTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.pwdConfirmTextbox.id).widget().option("disable", !result);
                        UnifyValid.clearValidate($("#" + $scope.passwordTextbox.id).find("input"));
                        UnifyValid.clearValidate($("#" + $scope.pwdConfirmTextbox.id).find("input"));
                    }
                };
                //密码
                $scope.passwordTextbox = {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": true,
                    "id": "add_environment_password_textbox",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}),
                    "disable": false
                };
                //确认密码
                $scope.pwdConfirmTextbox = {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": true,
                    "id": "add_environment_pwd_confirm_textbox",
                    "type": "password",
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";",
                    "disable": false
                };
                UnifyValid.infoPwdEqual = function () {
                    if ($("#" + $scope.passwordTextbox.id).widget().getValue() === $("#" + $scope.pwdConfirmTextbox.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                //供应商
                $scope.providerTextbox = {
                    "label": $scope.i18n.common_term_provider_label + ":",
                    "require": false,
                    "validate":"maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "0", "2": "256"}),
                    "id": "add_environment_provider_textbox"
                };
                //更新周期
                $scope.updateCycleTextbox = {
                    "label": $scope.i18n.common_term_updatCycleHour_label + ":",
                    "value": 6,
                    "require": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 8760}) +
                        ";maxValue(8760):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": 8760}),
                    "id": "add_environment_update_cycle_textbox"
                };
                // 更新数据复选框
                $scope.updateCheckbox = {
                    "label": "",
                    "id": "addEnvironmentUpdateCheckbox",
                    "text": $scope.i18n.virtual_hyper_import_para_saveUpdate_label
                };

                // 修改vlan池复选框
                $scope.modifyVlanPoolCheckbox = {
                    "label": "",
                    "id": "modifyVlanPoolCheckbox",
                    "text": $scope.i18n.virtual_hyper_add_para_modifyVLAN_label || "自动调整DVS的可用VLAN",
                    "checked":true
                };

                //下一步按钮
                $scope.infoNextButton = {
                    "id": "add_info_next_button",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#addEnvironmentInfoDiv"));
                        if (!result) {
                            return;
                        }
                        $("#" + $scope.addStep.id).widget().next();
                        $scope.curStep = "vsam";
                        $scope.model.hypervisor.name = $("#" + $scope.nameTextbox.id).widget().getValue();
                        $scope.model.hypervisor.type = $("#" + $scope.typeSelector.id).widget().getSelectedId();
                        if ($scope.showModifyVlanPool) {
                            $scope.model.hypervisor.modifyVlanpoolFlag = $("#" + $scope.modifyVlanPoolCheckbox.id).widget().option("checked");
                        }

                        if($scope.model.hypervisor.type === "VMware"){
                            $("#" + $scope.vsamCheckbox.id).widget().option("checked",false);
                            $("#" + $scope.vsamCheckbox.id).widget().option("disable",true);
                            clickVsamCheckbox();
                        }
                        else{
                            $("#" + $scope.vsamCheckbox.id).widget().option("disable",false);
                        }
                        $scope.model.hypervisor.version = $("#" + $scope.versionSelector.id).widget().getSelectedId();
                        $scope.model.hypervisor.connector.protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                        $scope.model.hypervisor.connector.ip = $("#" + $scope.ipBox.id).widget().getValue();
                        $scope.model.hypervisor.connector.activeIp = $scope.model.hypervisor.connector.ip;
                        $scope.model.hypervisor.connector.standbyIp = null;
                        $scope.model.hypervisor.connector.port = $("#" + $scope.portTextbox.id).widget().getValue();
                        $scope.model.hypervisor.connector.userName = $("#" + $scope.usernameTextbox.id).widget().getValue();
                        $scope.model.hypervisor.connector.password = $("#" + $scope.passwordTextbox.id).widget().getValue();
                        $scope.model.hypervisor.vendor = $("#" + $scope.providerTextbox.id).widget().getValue();
                        $scope.model.hypervisor.refreshCycle = $("#" + $scope.updateCycleTextbox.id).widget().getValue();
                        $scope.updateCheckbox.checked = $("#" + $scope.updateCheckbox.id).widget().option("checked");
                        $scope.typeSelector.selectedLabel = $("#" + $scope.typeSelector.id).widget().getSelectedLabel();
                        $scope.versionSelector.selectedLabel = $("#" + $scope.versionSelector.id).widget().getSelectedLabel();
                        $scope.protocolSelector.selectedLabel = $("#" + $scope.protocolSelector.id).widget().getSelectedLabel();
                    }
                };
                //取消按钮
                $scope.infoCancelButton = {
                    "id": "add_info_cancel_button",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goback();
                    }
                };

                //VSAM信息页面
                //VSAM信息复选框
                $scope.vsamCheckbox = {
                    "label": "",
                    "checked": false,
                    "id": "addEnvironmentVsamCheckbox",
                    "text": $scope.i18n.virtual_term_vsamInfo_label,
                    "change": function () {
                        clickVsamCheckbox();
                    }
                };
                function clickVsamCheckbox(){
                    var result = !$("#" + $scope.vsamCheckbox.id).widget().option("checked");
                    $("#" + $scope.vsamNameTextbox.id).widget().option("disable", result);
                    $("#" + $scope.vsamVersionSelector.id).widget().option("disable", result);
                    $("#" + $scope.vsamProtocolSelector.id).widget().option("disable", result);
                    $("#" + $scope.vsamIpBox.id).widget().setDisable(result);
                    $("#" + $scope.vsamPortTextbox.id).widget().option("disable", result);
                    $("#" + $scope.vsamUsernameTextbox.id).widget().option("disable", result);
                    $("#" + $scope.vsamProviderTextbox.id).widget().option("disable", result);
                    $("#" + $scope.editVsamPwdCheckbox.id).widget().option("disable", result);
                    var editPwd = !$("#" + $scope.editVsamPwdCheckbox.id).widget().option("checked");
                    $("#" + $scope.vsamPwdTextbox.id).widget().option("disable", result || ($scope.editVsamPwd && editPwd));
                    $("#" + $scope.vsamPwdConfirmTextbox.id).widget().option("disable", result || ($scope.editVsamPwd && editPwd));
                }
                //名称输入框
                $scope.vsamNameTextbox = {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "id": "add_environment_vsam_name_textbox",
                    "require": true,
                    "disable": true,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}) +
                        ";regularCheck(" + validator.cloudRegionNameRe + "):" + $scope.i18n.common_term_composition2_valid
                };
                //版本下拉框
                $scope.vsamVersionSelector = {
                    "label": $scope.i18n.common_term_version_label + ":",
                    "id": "add_environment_vsam_version_selector",
                    "width": "150",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                    "values": [
                        {
                            "selectId": "1.5.0",
                            "label": "1.5.0"
                        },
                        {
                            "selectId": "1.2",
                            "label": "1.2"
                        }
                    ],
                    "defaultSelectid": "1.5.0",
                    "require": true,
                    "disable": true
                };
                //接入协议下拉框
                $scope.vsamProtocolSelector = {
                    "label": $scope.i18n.device_term_connectProtocol_label + ":",
                    "id": "add_vsam_protocol_selector",
                    "width": "150",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";",
                    "values": [
                        {
                            "selectId": "https",
                            "label": "https"
                        }
                    ],
                    "defaultSelectid": "https",
                    "require": true,
                    "disable": true
                };
                //IP输入框
                $scope.vsamIpBox = {
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "id": "add_vsam_ip_box",
                    "width": "150",
                    "require": true,
                    "disable": true,
                    "extendFunction": ["vsamIpValidator", "vsamIpRangeCheck", "vsamIpNotStartWith127"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";vsamIpValidator:" + $scope.i18n.common_term_formatIP_valid +
                        ";vsamIpNotStartWith127:" + $scope.i18n.vpc_term_IPcantbe127_valid + ";vsamIpRangeCheck:" +
                        validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": "1.0.0.0", "2": "223.255.255.255"})
                };
                UnifyValid.vsamIpValidator = function () {
                    var ip = $("#" + $scope.vsamIpBox.id).widget().getValue();
                    return validator.ipFormatCheck(ip);
                };
                UnifyValid.vsamIpNotStartWith127 = function () {
                    var ip = $("#" + $scope.vsamIpBox.id).widget().getValue();
                    return validator.ipNotStartWith127(ip);
                };
                UnifyValid.vsamIpRangeCheck = function () {
                    var ip = $("#" + $scope.vsamIpBox.id).widget().getValue();
                    return validator.ipRangeCheck("1.0.0.0", "223.255.255.255", ip);
                };
                //端口
                $scope.vsamPortTextbox = {
                    "label": $scope.i18n.common_term_port_label + ":",
                    "id": "add_vsam_port_textbox",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";maxValue(65535):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}) +
                        ";minValue(0):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 0, "2": 65535}),
                    "require": true,
                    "disable": true
                };
                //用户名
                $scope.vsamUsernameTextbox = {
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "id": "add_vsam_username_textbox",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}),
                    "require": true,
                    "disable": true
                };
                //修改密码复选框
                $scope.editVsamPwdCheckbox = {
                    "label": "",
                    "id": "editVsamPwdCheckbox",
                    "text": $scope.i18n.common_term_modifyPsw_button,
                    "disable": true,
                    "change": function () {
                        var result = $("#" + $scope.editVsamPwdCheckbox.id).widget().option("checked");
                        $("#" + $scope.vsamPwdTextbox.id).widget().option("disable", !result);
                        $("#" + $scope.vsamPwdConfirmTextbox.id).widget().option("disable", !result);
                        UnifyValid.clearValidate($("#" + $scope.vsamPwdTextbox.id).find("input"));
                        UnifyValid.clearValidate($("#" + $scope.vsamPwdConfirmTextbox.id).find("input"));
                    }
                };
                //密码
                $scope.vsamPwdTextbox = {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "id": "add_vsam_password_textbox",
                    "type": "password",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(128):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "128"}),
                    "require": true,
                    "disable": true
                };
                //确认密码
                $scope.vsamPwdConfirmTextbox = {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "id": "add_vsam_pwd_confirm_textbox",
                    "type": "password",
                    "require": true,
                    "disable": true,
                    "extendFunction": ["vsamPwdEqual"],
                    "validate": "vsamPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
                };
                UnifyValid.vsamPwdEqual = function () {
                    if ($("#" + $scope.vsamPwdTextbox.id).widget().getValue() === $("#" + $scope.vsamPwdConfirmTextbox.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                //供应商
                $scope.vsamProviderTextbox = {
                    "label": $scope.i18n.common_term_provider_label + ":",
                    "id": "add_vsam_provider_textbox",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "256"}),
                    "require": true,
                    "disable": true
                };

                //上一步按钮
                $scope.vsamPreButton = {
                    "id": "add_vsam_next_button",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.curStep = "info";
                    }
                };
                //下一步按钮
                $scope.vsamNextButton = {
                    "id": "add_vsam_pre_button",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var checked = $("#" + $scope.vsamCheckbox.id).widget().option("checked");
                        if (checked) {
                            var result = UnifyValid.FormValid($("#addEnvironmentVsamDiv"));
                            if (!result) {
                                return;
                            }
                            $scope.model.vsam.name = $("#" + $scope.vsamNameTextbox.id).widget().getValue();
                            $scope.model.vsam.version = $("#" + $scope.vsamVersionSelector.id).widget().getSelectedId();
                            $scope.model.vsam.connector.protocol = $("#" + $scope.vsamProtocolSelector.id).widget().getSelectedId();
                            $scope.model.vsam.connector.ip = $("#" + $scope.vsamIpBox.id).widget().getValue();
                            $scope.model.vsam.connector.port = $("#" + $scope.vsamPortTextbox.id).widget().getValue();
                            $scope.model.vsam.connector.userName = $("#" + $scope.vsamUsernameTextbox.id).widget().getValue();
                            $scope.model.vsam.connector.password = $("#" + $scope.vsamPwdTextbox.id).widget().getValue();
                            $scope.model.vsam.type = "vsam";
                            $scope.model.vsam.vendor = $("#" + $scope.vsamProviderTextbox.id).widget().getValue();
                            $scope.vsamVersionSelector.selectedLabel = $("#" + $scope.vsamVersionSelector.id).widget().getSelectedLabel();
                            $scope.vsamProtocolSelector.selectedLabel = $("#" + $scope.vsamProtocolSelector.id).widget().getSelectedLabel();
                        }
                        $("#" + $scope.addStep.id).widget().next();
                        $scope.curStep = "confirm";
                        $scope.vsamCheckbox.checked = $("#" + $scope.vsamCheckbox.id).widget().option("checked");

                    }
                };
                //取消按钮
                $scope.vsamCancelButton = {
                    "id": "add_vsam_cancel_button",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goback();
                    }
                };

                //确认页面
                $scope.labelWidth = 90;
                $scope.label = {
                    name: $scope.i18n.common_term_name_label + ":",
                    type: $scope.i18n.common_term_type_label + ":",
                    version: $scope.i18n.common_term_version_label + ":",
                    protocol: $scope.i18n.device_term_connectProtocol_label + ":",
                    "ip": $scope.i18n.common_term_IP_label + ":",
                    port: $scope.i18n.common_term_port_label + ":",
                    userName: $scope.i18n.common_term_userName_label + ":",
                    vendor: $scope.i18n.common_term_provider_label + ":",
                    "cycle": $scope.i18n.common_term_updatCycleHour_label + ":"
                };
                //下一步按钮
                $scope.confirmPreButton = {
                    "id": "add_confirm_pre_button",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.curStep = "vsam";
                    }
                };
                //添加按钮
                $scope.confirmAddButton = {
                    "id": "add_confirm_add_button",
                    "text": $scope.i18n.common_term_add_button,
                    "click": function () {
                        if (!$scope.vsamCheckbox.checked) {
                            $scope.model.vsam = null;
                        }
                        if (action === "edit") {
                            editEnvironment($scope.model);
                        }
                        else {
                            addEnvironment($scope.model);
                        }
                    }
                };
                //取消按钮
                $scope.confirmCancelButton = {
                    "id": "add_confirm_cancel_button",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        goback();
                    }
                };

                function getEnvironment(eid) {
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: eid}},
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            var hypervisor = data.hypervisor;
                            var connector = hypervisor.connector;
                            $scope.nameTextbox.value = hypervisor.name;
                            $scope.providerTextbox.value = hypervisor.vendor;
                            $scope.updateCycleTextbox.value = hypervisor.refreshCycle;
                            $scope.ipBox.value = connector.ip;
                            $scope.typeSelector.defaultSelectid = hypervisor.type;
                            $scope.portTextbox.value = connector.port;
                            $scope.usernameTextbox.value = connector.userName;
                            $scope.versionSelector.values = versions[hypervisor.type].values;
                            $scope.versionSelector.defaultSelectid = hypervisor.version;
                            $scope.protocolSelector.defaultSelectid = connector.protocol;
                            $scope.showModifyVlanPool = hypervisor.type === "FusionCompute";
                            $scope.modifyVlanPoolCheckbox.checked = hypervisor.modifyVlanpoolFlag;

                            if ($("#" + $scope.ipBox.id).widget()) {
                                $("#" + $scope.ipBox.id).widget().option("value", connector.ip);
                                $("#" + $scope.typeSelector.id).widget().opChecked(hypervisor.type);
                                $("#" + $scope.versionSelector.id).widget().option("values", versions[hypervisor.type].values);
                                $("#" + $scope.versionSelector.id).widget().opChecked(hypervisor.version);
                                $("#" + $scope.protocolSelector.id).widget().opChecked(connector.protocol);
                                if($scope.showModifyVlanPool){
                                    $("#" + $scope.modifyVlanPoolCheckbox.id).widget().option("checked", hypervisor.modifyVlanpoolFlag);
                                }
                            }

                            var vsam = hypervisor.vsam;
                            if (vsam) {
                                $scope.vsamCheckbox.checked = true;
                                var connector = vsam.connector;

                                $scope.vsamNameTextbox.value = vsam.name;
                                $scope.vsamProviderTextbox.value = vsam.vendor;
                                $scope.vsamIpBox.value = connector.ip;
                                $scope.vsamPortTextbox.value = connector.port;
                                $scope.vsamUsernameTextbox.value = connector.userName;
                                $scope.vsamId = vsam.id;
                                $scope.vsamVersionSelector.defaultSelectid = vsam.version;
                                $scope.vsamProtocolSelector.defaultSelectid = connector.protocol;

                                $scope.vsamNameTextbox.disable = false;
                                $scope.vsamVersionSelector.disable = false;
                                $scope.vsamProtocolSelector.disable = false;
                                $scope.vsamIpBox.disable = false;
                                $scope.vsamPortTextbox.disable = false;
                                $scope.vsamUsernameTextbox.disable = false;
                                $scope.vsamProviderTextbox.disable = false;
                                $scope.editVsamPwdCheckbox.disable = false;

                                if ($("#" + $scope.vsamNameTextbox.id).widget()) {
                                    $("#" + $scope.vsamNameTextbox.id).widget().option("disable", false);
                                    $("#" + $scope.vsamVersionSelector.id).widget().option("disable", false);
                                    $("#" + $scope.vsamProtocolSelector.id).widget().option("disable", false);
                                    $("#" + $scope.vsamIpBox.id).widget().setDisable(false);
                                    $("#" + $scope.vsamPortTextbox.id).widget().option("disable", false);
                                    $("#" + $scope.vsamUsernameTextbox.id).widget().option("disable", false);
                                    $("#" + $scope.vsamProviderTextbox.id).widget().option("disable", false);
                                    $("#" + $scope.editVsamPwdCheckbox.id).widget().option("disable", false);

                                    $("#" + $scope.vsamIpBox.id).widget().option("value", connector.ip);
                                    $("#" + $scope.vsamVersionSelector.id).widget().opChecked(vsam.version);
                                    $("#" + $scope.vsamProtocolSelector.id).widget().opChecked(connector.protocol);
                                }
                            }
                            if (!vsam) {
                                $scope.editVsamPwd = false;
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function addEnvironment(model) {
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/hypervisors"},
                        "params": JSON.stringify(model),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if ($scope.updateCheckbox.checked) {
                            if($scope.model.hypervisor.type === "FusionCompute"){
                                showMessage($scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                                    update(data.id);
                                });
                            }
                            else{
                                update(data.id);
                            }
                        }
                        else {
                            if($scope.model.hypervisor.type === "FusionCompute"){
                                showMessage($scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                                    goback();
                                });
                            }
                            else{
                                goback();
                            }
                        }
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function editEnvironment(info) {
                    var hyperviosr = $scope.model.hypervisor;
                    var connector = hyperviosr.connector;
                    var model = {
                        "name": hyperviosr.name,
                        "type": hyperviosr.type,
                        "version": hyperviosr.version,
                        "vendor": hyperviosr.vendor,
                        "refreshCycle": hyperviosr.refreshCycle,
                        "connector": {
                            "ip": connector.ip,
                            "userName": connector.userName,
                            "password": null,
                            "port": connector.port,
                            "protocol": connector.protocol
                        },
                        "vsam": null
                    };
                    if ($("#" + $scope.editPwdCheckbox.id).widget().option("checked")) {
                        model.connector.password = connector.password;
                    }
                    if ($scope.showModifyVlanPool) {
                        model.modifyVlanpoolFlag = $("#" + $scope.modifyVlanPoolCheckbox.id).widget().option("checked");
                    }
                    if ($scope.model.vsam) {
                        model.vsam = {
                            "id": $scope.vsamId,
                            "name": $scope.model.vsam.name,
                            "type": $scope.model.vsam.type,
                            "version": $scope.model.vsam.version,
                            "vendor": $scope.model.vsam.vendor,
                            "connector": {
                                "ip": $scope.model.vsam.connector.ip,
                                "activeIp": $scope.model.vsam.connector.ip,
                                "standbyIp": null,
                                "userName": $scope.model.vsam.connector.userName,
                                "password": null,
                                "protocol": $scope.model.vsam.connector.protocol,
                                "port": $scope.model.vsam.connector.port
                            }
                        };
                        if ($("#" + $scope.editVsamPwdCheckbox.id).widget().option("checked") || !$scope.editVsamPwd) {
                            model.vsam.connector.password = $scope.model.vsam.connector.password;
                        }
                    }
                    var deferred = camel.put({
                        url: {s: "   /goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: eid}},
                        "params": JSON.stringify(model),
                        "userId": user.id
                    });
                    deferred.success(function (xml) {
                        if ($scope.updateCheckbox.checked) {
                            if($scope.model.hypervisor.type === "FusionCompute"){
                                showMessage($scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                                    update(eid);
                                });
                            }
                            else{
                                update(eid);
                            }
                        }
                        else {
                            if($scope.model.hypervisor.type === "FusionCompute"){
                                showMessage($scope.i18n.virtual_hyper_add_info_fresh_msg + $scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                                    goback();
                                });
                            }
                            else{
                                showMessage($scope.i18n.virtual_hyper_add_info_fresh_msg, function () {
                                    goback();
                                });
                            }
                        }
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function update(eid) {
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/action", o: {id: eid}},
                        "params": JSON.stringify({"update": {"scanType": "ALL"}}),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        goback();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }

                function goback() {
                    $state.go("resources.hypervisor.environment");
                }

                function showMessage(content, action) {
                    var options = {
                        type: "confirm",
                        "title": $scope.i18n.alarm_term_warning_label,
                        content: content,
                        height: "250px",
                        width: "450px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                    action();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                }

                if (action === "edit") {
                    getEnvironment(eid);
                    $scope.title = $scope.i18n.virtual_term_modifyHyper_button;
                    $scope.confirmAddButton.text = $scope.i18n.common_term_modify_button;
                    $scope.passwordTextbox.disable = true;
                    $scope.pwdConfirmTextbox.disable = true;
                    $scope.editPwd = true;
                    $scope.editVsamPwd = true;
                }
                else {
                    $scope.editPwd = false;
                    $scope.editVsamPwd = false;
                }
            }];
        return addEnvironmentCtrl;
    });