define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    'app/business/resources/controllers/templateSpec/regulars',
    'app/services/exceptionService'],
    function ($, angular, httpService, UnifyValid, constants, regulars, exceptionService) {
        "use strict";

        var createCtrl = ["$scope", "$compile", "camel", "exception", function ($scope, $compile, camel, exception) {

            UnifyValid.pwdConfirm = function () {
                if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            UnifyValid.newPwdConfirm = function () {
                if ($("#" + $scope.newPassword.id).widget().getValue() === $("#" + $scope.newPasswordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            UnifyValid.checkName = function () {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]*$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            UnifyValid.checkPwd = function () {
                if ($scope.model.action !== 'create') {
                    return true;
                }
                var value = jQuery.trim($(this).val());
                return /.{8,64}/.test(value) && /.*[A-Za-z]+.*/.test(value) &&  /.*[0-9]+.*/.test(value);
            };

            UnifyValid.checkNewPwd = function () {
                var value = jQuery.trim($(this).val());
                return /.{8,64}/.test(value) && /.*[A-Za-z]+.*/.test(value) &&  /.*[0-9]+.*/.test(value);
            };

            $scope.model = {
                "id":$("#createLogicVmTemplateWinID").widget().option("vmtID"),
                "vmLogicTemplateName": "",
                "sysDiskSize": "",
                "osType": "",
                "osVersion": "",
                "defaultUserName": "",
                "defaultPassWord": "",
                "desc": ""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "createLogicVmtName",
                "extendFunction" : ["checkName"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkName():"+$scope.i18n.common_term_composition6_valid+";maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256)+";minSize(1):"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "width": "200",
                "value":""
            };

            $scope.disk = {
                label: $scope.i18n.common_term_sysDiskSizeGB_label+":",
                require: true,
                "id": "createLogicVmtFileName",
                "value": "",
                "readonly":true,
                "width": "200",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 65536),
                "validate": "integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 65536)+";maxValue(65536):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 65536)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 65536)+";required:"+$scope.i18n.common_term_null_valid+";"
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: true,
                "id": "createLogicVmtOSType",
                "width": "200",
                "values": [
                    {
                        "selectId": "Linux",
                        "label": "Linux",
                        "checked": true
                    },
                    {
                        "selectId": "Windows",
                        "label": "Windows"
                    }
                ],
                "change":function(){
                    var osType = $("#"+$scope.osType.id).widget().getSelectedId();
                    $scope.version.values = $scope.versionConfig.getVersionInfo(osType);
                }
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: true,
                "id": "createLogicVmtVersion",
                "width": "200",
                "height":"200",
                "values": [
                    {
                        "selectId": "CentOS 6.3 32bit",
                        "label": "CentOS 6.3 32bit",
                        "checked": true
                    },
                    {
                        "selectId": "Novell SUSE Linux Enterprise 11 32bit",
                        "label": "Novell SUSE Linux Enterprise 11 32bit"
                    },
                    {
                        "selectId": "Novell SUSE Linux Enterprise 11 64bit",
                        "label": "Novell SUSE Linux Enterprise 11 64bit"
                    },
                    {
                        "selectId": "Windows 7 Enterprise 64bit",
                        "label": "Windows 7 Enterprise 64bit"
                    }
                ],
                "change":function(){
                }
            };

            $scope.userName = {
                label: $scope.i18n.common_term_userName_label+":",
                require: true,
                "display":true,
                "id": "createLogicVmtUsername",
                "tooltip":$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64)+($scope.i18n.common_term_composition13_valid || "只能是字母和数字。"),
                "validate":"regularCheck(" + regulars.userName + "):"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64)+($scope.i18n.common_term_composition13_valid || "只能是字母和数字。")+";required:"+$scope.i18n.common_term_null_valid,
                "width": "200",
                "value":""
            };

            $scope.changePwd = {
                label: $scope.i18n.common_term_modifyPsw_button+":",
                "display": false,
                "id" : "createLogicVmtChangePwd",
                "text" : "",
                "checked" : false,
                "change":function() {
                    if ($("#"+$scope.changePwd.id).widget().option("checked")) {
                        $scope.userName.display = true;
                        $scope.password.display = true;
                        $scope.passwordConfirm.display = false;
                        $scope.newPassword.display = true;
                        $scope.newPasswordConfirm.display = true;
                    } else {
                        $scope.userName.display = false;
                        $scope.password.display = false;
                        $scope.passwordConfirm.display = false;
                        $scope.newPassword.display = false;
                        $scope.newPasswordConfirm.display = false;
                    }

                    $scope.model.defaultPassWord = "";
                    $scope.model.defaultUserName = "";
                    $("#"+$scope.userName.id).widget().option("value", "");
                    $("#"+$scope.password.id).widget().option("value", "");
                    $("#"+$scope.passwordConfirm.id).widget().option("value", "");
                    $("#"+$scope.newPassword.id).widget().option("value", "");
                    $("#"+$scope.newPasswordConfirm.id).widget().option("value", "");
                }
            };

            $scope.password = {
                label: $scope.i18n.common_term_defaultPsw_label+":",
                require: true,
                "display": true,
                "id": "createLogicVmtPwd",
                "extendFunction": ["checkPwd"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkPwd():"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 64)+($scope.i18n.common_term_compositionInclude3_valid || "必须包含数字和字母。")+";",
                "width": "200",
                "type":"password",
                "value":""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_defaultPswConfirm_label+":",
                require: true,
                "display": true,
                "id": "createLogicVmtPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "200",
                "type":"password",
                "value":""
            };

            $scope.newPassword = {
                label: $scope.i18n.common_term_newPsw_label+":",
                require: true,
                "display": false,
                "id": "createLogicVmtNewPwd",
                "tooltip":$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 64)+ ($scope.i18n.common_term_compositionInclude3_valid || "必须包含数字和字母。"),
                "extendFunction": ["checkNewPwd"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkNewPwd():"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 64)+($scope.i18n.common_term_compositionInclude3_valid || "必须包含数字和字母。")+";",
                "width": "200",
                "type":"password",
                "value":""
            };

            $scope.newPasswordConfirm = {
                label: $scope.i18n.common_term_newPswConfirm_label+":",
                require: true,
                "display": false,
                "id": "createLogicVmtNewPwdConfirm",
                "tooltip":$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 64)+($scope.i18n.common_term_compositionInclude3_valid || "必须包含数字和字母。"),
                "extendFunction":["newPwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";newPwdConfirm():"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "200",
                "type":"password",
                "value":""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "createLogicVmtDescription",
                "value": $scope.model.desc,
                "type": "multi",
                "width": "350",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            $scope.saveBtn = {
                id: "createLogicVmtSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_save_label,
                tip: "",
                save: function () {
                    var valid = UnifyValid.FormValid($("#createLogicVmt"));
                    if (!valid) {
                        return;
                    }

                    if ($scope.model.action === 'create') {
                        $scope.operator.create();
                    } else {
                        $scope.operator.modify();
                    }

                }
            };

            $scope.cancelBtn = {
                id: "createLogicVmtCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $("#createLogicVmTemplateWinID").widget().destroy();
                }
            };

            $scope.operator = {
                "initForModify": function () {

                    var deferred = camel.get({
                        "url": {"s":constants.rest.LOGIC_TEMPLATE_DETAIL.url,"o":{"tenant_id":1, "id": $scope.model.id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $scope.model.id = data.basicInfo.vmLogicTemplateID;
                            $scope.model.vmLogicTemplateName = data.basicInfo.vmLogicTemplateName;
                            $scope.model.sysDiskSize =  data.basicInfo.systemDiskSize;
                            $scope.model.osType = data.basicInfo.osType;
                            $scope.model.osVersion = data.basicInfo.osVersion;
                            $scope.model.desc = data.basicInfo.vmLogicTemplateDescription;

                            $("#" + $scope.name.id).widget().option("value", $scope.model.vmLogicTemplateName);
                            $("#" + $scope.disk.id).widget().option("value", $scope.model.sysDiskSize);
                            $("#" + $scope.osType.id).widget().opChecked($scope.model.osType);
                            $("#" + $scope.description.id).widget().option("value", $scope.model.desc);

                            var osType = $("#"+$scope.osType.id).widget().getSelectedId();
                            $scope.version.values = $scope.versionConfig.getVersionInfo(osType, $scope.model.osVersion);

                            if (data.associatedVMTemplates && data.associatedVMTemplates.length != 0) {
                                $("#" + $scope.osType.id).widget().option("disable",true);
                                $("#" + $scope.version.id).widget().option("disable",true);
                                $("#" + $scope.disk.id).widget().option("disable",true);
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "create": function () {
                    $scope.model.vmLogicTemplateName =  $("#" + $scope.name.id).widget().getValue();
                    $scope.model.sysDiskSize =  $("#" + $scope.disk.id).widget().getValue();
                    $scope.model.osType = $("#" + $scope.osType.id).widget().getSelectedId();
                    $scope.model.osVersion = $("#" + $scope.version.id).widget().getSelectedId();
                    $scope.model.defaultUserName =  $("#" + $scope.userName.id).widget().getValue();
                    $scope.model.defaultPassWord =  $("#" + $scope.password.id).widget().getValue();
                    $scope.model.desc = $("#" + $scope.description.id).widget().getValue();

                    var deferred = camel.post({
                        "url": {"s":constants.rest.LOGIC_TEMPLATE_CREATE.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#createLogicVmTemplateWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "modify": function () {
                    $scope.model.vmLogicTemplateName =  $("#" + $scope.name.id).widget().getValue();
                    $scope.model.sysDiskSize =  $("#" + $scope.disk.id).widget().getValue();
                    $scope.model.osType = $("#" + $scope.osType.id).widget().getSelectedId();
                    $scope.model.osVersion = $("#" + $scope.version.id).widget().getSelectedId();
                    $scope.model.desc =  $("#" + $scope.description.id).widget().getValue();

                    if ($("#"+$scope.changePwd.id).widget().option("checked")) {
                        $scope.model.defaultUserName =  $("#" + $scope.userName.id).widget().getValue();
                        $scope.model.defaultPassWord = $("#" + $scope.password.id).widget().getValue();

                        $scope.model.newDefaultpassword = $("#" + $scope.newPassword.id).widget().getValue();
                        $scope.model.newDefaultpasswordConfirm = $("#" + $scope.newPasswordConfirm.id).widget().getValue();

                    } else {
                        $scope.model.defaultUserName = null;
                        $scope.model.defaultPassWord = null;
                        $scope.model.newPassWord = null;
                        $scope.model.newPassWordConfirm = null;
                    }



                    var deferred = camel.put({
                        "url": {"s":constants.rest.LOGIC_TEMPLATE_MODIFY.url,"o":{"tenant_id":1,"id": $scope.model.id}},
                        "params": JSON.stringify($scope.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#createLogicVmTemplateWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            $scope.versionConfig = {
                "Linux": "Ubuntu Server 12.04 64bit_132;Ubuntu Linux 64bit_0;Ubuntu Linux 32bit_0;Ubuntu 8.04 desktop 64bit_119;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 12.10 server 64bit_161;Ubuntu 12.10 server 32bit_160;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.2 server 64bit_175;Ubuntu 12.04.2 server 32bit_174;Ubuntu 12.04.2 desktop 64bit_172;Ubuntu 12.04.2 desktop 32bit_171;Ubuntu 12.04.1 server 64bit_150;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 11.10 server 64bit_147;Ubuntu 11.10 server 32bit_146;Ubuntu 10.10 server 64bit_122;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04 server 32bit_162;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.04.4 server 64bit_173;Ubuntu 10.04.3 server 64bit_145;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.1 desktop 32bit_120;Redhat Linux Enterprise 6.4 64bit_159;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;Redhat Linux Enterprise 6.2 64bit_86;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 5.9 64bit_165;Redhat Linux Enterprise 5.9 32bit_164;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.5 64bit_55;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 3.4 32bit_130;Redhat Linux Enterprise 3.0 32bit_129;Red Hat Enterprise Linux 6 64bit_0;Red Hat Enterprise Linux 6 32bit_0;Red Hat Enterprise Linux 5 64bit_0;Red Hat Enterprise Linux 5 32bit_0;Red Hat Enterprise Linux 4 64bit_0;Red Hat Enterprise Linux 4 32bit_0;Red Hat Enterprise Linux 3 64bit_0;Red Hat Enterprise Linux 3 32bit_0;Red Hat Enterprise Linux 2.1_0;Red Flag Asianux Server 4.2 64bit_154;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.2 64bit_163;Other Linux(64 bit)_302;Other Linux 64bit_0;Other Linux(32 bit)_301;Other Linux 32bit_0;Other (64 bit)_402;Other (32 bit)_401;Other 2.6.x Linux 64bit_0;Other 2.6.x Linux 32bit_0;Other 2.4.x Linux 64bit_0;Other 2.4.x Linux 32bit_0;Oracle Linux Server release 6.1 64bit_134;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 5.7 64bit_127;Oracle Linux 4/5/6 64bit_0;Oracle Linux 4/5/6 32bit_0;OpenSUSE 11.3 64bit_156;Novell SUSE Linux Enterprise Server 11 SP3 64bit_181;Novell SUSE Linux Enterprise Server 11 SP3 32bit_180;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise 8/9 64bit_0;Novell SUSE Linux Enterprise 8/9 32bit_0;Novell SUSE Linux Enterprise 11 64bit_0;Novell SUSE Linux Enterprise 11 32bit_0;Novell SUSE Linux Enterprise 10 64bit_0;Novell SUSE Linux Enterprise 10 32bit_0;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Novell SUSE 10 SP2 CUSTOMIZED 32bit_177;Novell Open Enterprise Server_0;Neoshine Linux Server 3.0 64bit_176;NeoKylin 5.4 64bit_125;Fedora 9 32bit_123;Fedora 14 64bit_155;Fedora 12 32bit_124;DOPRA ICTOM V002R003 IMAOS 64bit_140;DOPRA ICTOM V002R003 EIMP 64bit_139;Debian GNU/Linux 6 64bit_0;Debian GNU/Linux 6 32bit_0;Debian GNU/Linux 6.0.7 64bit_170;Debian GNU/Linux 6.0.5 64bit_141;Debian GNU/Linux 6.0.4 64bit_131;Debian GNU/Linux 5 64bit_0;Debian GNU/Linux 5 32bit_0;Debian GNU/Linux 4 64bit_0;Debian GNU/Linux 4 32bit_0;Debian 7.1.0 64bit_179;Debian 7.1.0 32bit_178;CentOS 6.5 64bit_183;CentOS 6.5 32bit_182;CentOS 6.4 64bit_169;CentOS 6.4 32bit_168;CentOS 6.3 64bit_138;CentOS 6.3 32bit_137;CentOS 6.2 64bit_117;CentOS 6.2 32bit_116;CentOS 6.1 64bit_115;CentOS 6.1 32bit_114;CentOS 6.0 64bit_113;CentOS 6.0 32bit_112;CentOS 5.9 64bit_167;CentOS 5.9 32bit_166;CentOS 5.8 64bit_111;CentOS 5.8 32bit_110;CentOS 5.7 64bit_109;CentOS 5.7 32bit_108;CentOS 5.6 64bit_107;CentOS 5.6 32bit_106;CentOS 5.5 64bit_105;CentOS 5.5 32bit_58;CentOS 5.4 64bit_57;CentOS 5.4 32bit_104;CentOS 5.3 64bit_103;CentOS 5.3 32bit_102;CentOS 5.2 64bit_101;CentOS 5.2 32bit_100;CentOS 5.1 64bit_99;CentOS 5.1 32bit_98;CentOS 5.0 64bit_97;CentOS 5.0 32bit_96;CentOS 4.8 64bit_95;CentOS 4.8 32bit_56;CentOS 4.7 64bit_94;CentOS 4.7 32bit_93;CentOS 4.6 64bit_92;CentOS 4.6 32bit_91;CentOS 4/5/6 64bit_0;CentOS 4.5 64bit_90;CentOS 4/5/6 32bit_0;CentOS 4.5 32bit_89;CentOS 4.4 64bit_88;CentOS 4.4 32bit_87;Asianux 4 64bit_0;Asianux 4 32bit_0;Asianux 3 64bit_0;Asianux 3 32bit_0",
                "windows": "Windows XP Professional 64bit_0;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Vista 64bit_0;Windows Vista 32bit_0;Windows Server 2012 64bit_0;Windows Server 2008 WEB R2 64bit_59;Windows Server 2008 Standard 64bit_9;Windows Server 2008 Standard 32bit_8;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 64bit_0;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 64bit_0;Windows Server 2008 32bit_0;Windows Server 2003 Web Edition 32bit_0;Windows Server 2003 Standard 64bit_15;Windows Server 2003 Standard 32bit_14;Windows Server 2003 R2 Standard 64bit_21;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Datacenter 64bit_0;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 64bit_0;Windows Server 2003 32bit_0;Windows NT_0;Windows Millenium Edition_0;Windows 98_0;Windows 95_0;Windows 8 64bit_128;Windows 8 32bit_126;Windows 7 Ultimate 64bit_23;Windows 7 Ultimate 32bit_22;Windows 7 Professional 64bit_27;Windows 7 Professional 32bit_26;Windows 7 Home Premium 64bit_29;Windows 7 Home Premium 32bit_28;Windows 7 Home Basic 64bit_31;Windows 7 Home Basic 32bit_30;Windows 7 Enterprise 64bit_25;Windows 7 Enterprise 32bit_24;Windows 7 64bit_0;Windows 7 32bit_0;Windows 3.1_0;Windows 2012 64bit_157;Windows 2000 Server SP4_61;Windows 2000 Server_0;Windows 2000 Professional_0;Windows 2000 Advanced Server SP4_60;Windows 2000_0;Windows Server 2012 R2 Standard 64bit_614;Windows Server 2012 R2 Datacenter 64bit_615;Small Business Server 2003_0;Other Windows(64 bit)_202;Other Windows(32 bit)_201;MSDOS_0",
                "getVersionInfo": function (osType, osVersion) {
                    var versionList = [];
                    if (osType === 'Windows') {
                        versionList = $scope.versionConfig.windows.split(";");
                    } else {
                        versionList = $scope.versionConfig.Linux.split(";");
                    }

                    var versions = [];
                    for (var index in versionList) {
                        var key = versionList[index].substr(0, versionList[index].lastIndexOf("_"));
                        var version = {
                            "selectId":key,
                            "label":key
                        };

                        if (osVersion) {
                            if (osVersion == key) {
                                version.checked = true;
                            }
                        } else if (index == 0) {
                            version.checked = true;
                        } else {
                            //do nothing
                        }

                        versions.push(version);
                    }

                    return versions;
                }
            };

            $scope.init = function () {
                var action = $("#createLogicVmTemplateWinID").widget().option("action");
                $scope.model.action = action;

                if (action === 'create') {
                    // do nothing
                    $scope.version.values = $scope.versionConfig.getVersionInfo("Linux");
                    $scope.userName.display = true;
                    $scope.changePwd.display = false;
                    $scope.password.display = true;
                    $scope.passwordConfirm.display = true;
                    $scope.newPassword.display = false;
                    $scope.newPasswordConfirm.display = false;

                } else {
                    $scope.model.id = $("#createLogicVmTemplateWinID").widget().option("vmtID");
                    $scope.userName.display = false;
                    $scope.changePwd.display = true;
                    $scope.password.display = false;
                    $scope.passwordConfirm.display = false;
                    $scope.newPassword.display = false;
                    $scope.newPasswordConfirm.display = false;

                    $scope.operator.initForModify();
                }
            };

            $scope.init();
        }];

        // 创建App
        var deps = [];
        var modifyIOSApp = angular.module("resources.template.createLogicVmt", deps);
        modifyIOSApp.controller("resources.template.createLogicVmt.ctrl", createCtrl);
        modifyIOSApp.service("camel", httpService);
        modifyIOSApp.service("exception", exceptionService);

        return modifyIOSApp;
    });
