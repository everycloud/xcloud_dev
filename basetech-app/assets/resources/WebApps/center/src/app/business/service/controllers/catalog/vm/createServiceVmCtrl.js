define(['jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Radio",
    "tiny-widgets/Select",
    "tiny-widgets/Textbox",
    "tiny-widgets/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/business/service/services/catalog/catalogService",
    "app/business/service/services/service/createService"],
    function ($, angular, _, Checkbox, Radio, Select, Textbox, Button, Window, Message, UnifyValid, catalogService, createService) {
        "use strict";
        var createVmCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$q", "validator", "exception", function ($scope, $compile, $state, $stateParams, camel, $q, validator, exception) {
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var createServiceIns = new createService(exception, $q, camel);
            var serviceId = $stateParams.serviceId;
            var applyTypeId = $stateParams.applyTypeId;
            var templateId = $stateParams.templateId;
            var user = $scope.user;
            var i18n = $scope.i18n;
            $scope.cloudType = $scope.user.cloudType == "OPENSTACK" ? "ICT" : "IT"
            var getTypes = function (options) {
                options = options || {};
                options = {
                    disable: options.disable || [false, false, false],
                    checked: options.checked || [true, false, false]
                };
                return [
                    {
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label || "申请时输入",
                        "disable": options.disable["1"],
                        "checked": options.checked["1"]
                    },
                    {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label || "审批时输入",
                        "disable": options.disable["2"],
                        "checked": options.checked["2"]
                    },
                    {
                        "key": "0",
                        "text": i18n.user_term_lock_button || "锁定",
                        "disable": options.disable["0"],
                        "checked": options.checked["0"]
                    }
                ];
            };

            $scope.createVmStep1 = {
                "url": "../src/app/business/service/views/catalog/vm/locationInfo.html"
            };
            $scope.createVmStep2 = {
                "url": "../src/app/business/service/views/catalog/vm/templeteInfo.html"
            };
            $scope.createVmStep3 = {
                "url": "../src/app/business/service/views/catalog/vm/vmSpecInfo.html"
            };
            $scope.createVmStep4 = {
                "url": "../src/app/business/service/views/catalog/vm/networkInfo.html"
            };
            $scope.createVmStep5 = {
                "url": "../src/app/business/service/views/catalog/vm/basicInfo.html"
            };
            $scope.createVmStep6 = {
                "url": "../src/app/business/service/views/catalog/vm/createVmConfirm.html"
            };
            //控制步骤中各页面的显示
            $scope.locationInfoPage = true;
            $scope.templateInfoPage = false;
            $scope.specInfoPage = false;
            $scope.networkInfoPage = false;
            $scope.basicInfoPage = false;
            $scope.confirmPage = false;
            $scope.createVmStep = {
                "id": "createVmStep",
                "values": [
                    i18n.common_term_location_label,
                    i18n.template_term_vm_label,
                    i18n.spec_term_vm_label,
                    i18n.vpc_term_net_label,
                    i18n.common_term_basicInfo_label,
                    i18n.common_term_confirmInfo_label
                ],
                "width": "800",
                "jumpable": false
            };
            //定义全局变量
            $scope.params = {
                "applyType": null,//审批类型
                "areaId": null, //地域ID
                "areaText": null,
                "areaLock": null,
                "vmTemplateId": null,
                "availableZoneId": null,
                "vmlock": null,
                "vmSpecType": null,
                "specbiscId": null,
                "specLock": null,
                "customcpu": null,
                "custommem": null,
                "networkType": null,
                "azId": null,
                "vpcId": null,
                "slaId": null,
                "networkId": null,
                "nicLock": null,
                "networkLock": null,
                "whiteList": null,
                "serviceName": null,
                "catalogList": null,
                "desc": null,
                "iconId": ""
            };
            $scope.service = {
                "configType": "system",
                "networkType": "private"
            };
            //审批类型
            var appStatus = null;
            // 位置信息页面初始化
            $scope.locationInfo = {
                "location": {
                    label: (i18n.common_term_section_label || "地域") + ":",
                    require: true,
                    "id": "createVm-chooseLocation",
                    "width": 200,
                    "validate": "required:" + (i18n.common_term_null_valid || "不能为空。"),
                    "change": function () {
                        searchModel["cloud-infra"] = $("#" + $scope.locationInfo.location.id).widget().getSelectedId();
                        $scope.areaId = $("#" + $scope.locationInfo.location.id).widget().getSelectedId();
                        if ($scope.areaId) {
                            queryAzlist();
                        }
                    },
                    "values": [],
                    "disable": "false"
                },
                "az": {
                    label: (i18n.resource_term_Azs_label || "可用分区") + ":",
                    require: true,
                    "id": "createVm-chooseAz",
                    "width": 200,
                    'validate': 'required:' + (i18n.common_term_null_valid || "不能为空。"),
                    "change": function () {
                    },
                    "values": [],
                    "disable": "false"
                },
                "locationLock": {
                    "label": "",
                    "require": "true",
                    "id": "locationSelect",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        disable: [false, false, applyTypeId == "none"],
                        checked: [true, false, false]
                    }),
                    "layout": "horizon",
                    "change": function () {
                        var locationLock = $("#" + $scope.locationInfo.locationLock.id).widget().opChecked("checked");
                        if (locationLock === '0') {
                            $scope.locationInfo.location.disable = false;
                            $scope.locationInfo.az.disable = false;

                        } else {
                            $scope.locationInfo.location.disable = true;
                            $scope.locationInfo.az.disable = true;
                            $scope.params.areaId = "";
                            $scope.createVmConfirmInfo.area.value = "";
                            $scope.params.azId = "";
                            $scope.createVmConfirmInfo.azVal.value = "";
                        }
                    }
                },
                perBtn: {
                    "id": "create-catalog-basicInfo-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "display": !serviceId,
                    "click": function () {
                        $state.go("service.create");
                    }
                },
                nextBtn: {
                    "id": "create-catalog-basicInfo-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#craeteVMlocationPage"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVmStep.id).widget().next();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = true;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                        var areaLock = $("#" + $scope.locationInfo.locationLock.id).widget().opChecked("checked");
                        var vmtempLockStatus = $("#" + $scope.selTemp.appType.id).widget();
                        var vmSpecLoclStatus = $("#" + $scope.catalogVmSpec.lock.id).widget();
                        var vmNetworkLockStatus = $("#" + $scope.createVmNetwork.appType.id).widget();
                        vmtempLockStatus.opChecked(areaLock, true);
                        vmSpecLoclStatus.opChecked(areaLock, true);
                        if (applyTypeId == "none") {
                            vmNetworkLockStatus.opChecked("1", true);
                        }
                        else {
                            if (areaLock == "1") {
                                vmNetworkLockStatus.opChecked("1", true);
                            }
                            else {
                                vmNetworkLockStatus.opChecked(applyTypeId == "none" ? "1" : "2", true);
                            }
                        }
                        var confirmareaLock = $("#" + $scope.createVmConfirmInfo.vmreginappType.id).widget();
                        var confirmAzLock = $("#" + $scope.createVmConfirmInfo.vmAzappType.id).widget();
                        confirmareaLock.opChecked(areaLock, true);
                        confirmAzLock.opChecked(areaLock, true);
                        appStatus = applyTypeId;
                        $scope.params.applyType = applyTypeId;
                        $scope.params.vmlock = areaLock;
                        $scope.params.areaLock = $("#" + $scope.locationInfo.locationLock.id).widget().opChecked("checked");
                        if (areaLock === "0") {
                            $("#vmSpecList").show();
                            if (appStatus === "none") {
                                vmtempLockStatus.opDisabled("0", false);
                                vmtempLockStatus.opDisabled("1", false);
                                vmtempLockStatus.opDisabled("2", true);
                            }
                            else {
                                vmtempLockStatus.opDisabled("0", false);
                                vmtempLockStatus.opDisabled("1", false);
                                vmtempLockStatus.opDisabled("2", false);
                            }
                            $scope.params.areaId = $("#" + $scope.locationInfo.location.id).widget().getSelectedId();
                            $scope.params.azId = $("#" + $scope.locationInfo.az.id).widget().getSelectedId();
                            searchModel.azid = $scope.params.azId;
                            searchModel["cloud-infra"] = $scope.params.areaId;
                            $scope.params.areaText = $("#" + $scope.locationInfo.location.id).widget().getSelectedLabel();
                            var apptype = applyTypeId;
                            var appText = i18n.service_term_approveNotRequire_label || "无审批";
                            if (apptype === "vdc") {
                                appText = i18n.service_term_approveByVDCadmin_label || "VDC管理员审批";
                            }
                            $scope.createVmConfirmInfo.apptype.value = appText;
                            $scope.createVmConfirmInfo.area.value = $("#" + $scope.locationInfo.location.id).widget().getSelectedLabel();
                            $scope.createVmConfirmInfo.azVal.value = $("#" + $scope.locationInfo.az.id).widget().getSelectedLabel();
                        }
                        else {
                            $("#vmSpecList").hide();
                            $("#createVmNetworkParams").hide();
                            if (areaLock === "1") {
                                vmtempLockStatus.opDisabled("0", true);
                                vmtempLockStatus.opDisabled("1", false);
                                vmtempLockStatus.opDisabled("2", appStatus === "none");

                                vmSpecLoclStatus.opDisabled("0", true);
                                vmSpecLoclStatus.opDisabled("1", false);
                                vmSpecLoclStatus.opDisabled("2", appStatus === "none");

                                vmNetworkLockStatus.opDisabled("0", true);
                                vmNetworkLockStatus.opDisabled("1", false);
                                vmNetworkLockStatus.opDisabled("2", appStatus === "none");
                            }
                            else {
                                vmtempLockStatus.opDisabled("0", true);
                                vmtempLockStatus.opDisabled("1", true);
                                vmtempLockStatus.opDisabled("2", false);

                                vmSpecLoclStatus.opDisabled("0", true);
                                vmSpecLoclStatus.opDisabled("1", true);
                                vmSpecLoclStatus.opDisabled("2", false);

                                vmNetworkLockStatus.opDisabled("0", true);
                                vmNetworkLockStatus.opDisabled("1", true);
                                vmNetworkLockStatus.opDisabled("2", false);
                            }
                        }
                        if (areaLock == "0") {
                            queryTemplates();
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-catalog-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            //查询地域
            function queryArea(cloudInfraId, availableZoneId) {
                var deferred = createServiceIns.queryCloudInfras(user.orgId, user.id);
                deferred.then(function (data) {
                    if (data && data.cloudInfras) {
                        var cloudInfras = data.cloudInfras || [];
                        var selectValues = [];
                        for (var i = 0, len = cloudInfras.length; i < len; i++) {
                            var item = cloudInfras[i];
                            selectValues.push({
                                "selectId": item.id,
                                "label": item.region,
                                "checked": cloudInfraId == item.id || (!cloudInfraId && !i)
                            });
                        }
                        $scope.areaId = cloudInfraId || selectValues[0].selectId;
                        $scope.locationInfo.location.values = selectValues;
                        queryAzlist(availableZoneId);
                    }
                });
            }

            //查询AZ
            function queryAzlist(availableZoneId) {
                var deferred = createServiceIns.queryAzs(user.vdcId, user.id, $scope.areaId);
                deferred.then(function (data) {
                    if (data && data.availableZones) {
                        var availableZones = data.availableZones || [];
                        var selectValues = [];
                        for (var i = 0, len = availableZones.length; i < len; i++) {
                            var item = availableZones[i];
                            selectValues.push({
                                "selectId": item.id,
                                "label": item.name,
                                "checked": availableZoneId == item.id || (!availableZoneId && !i)
                            });
                        }
                        $scope.locationInfo.az.values = selectValues;
                    }
                })
            }

            // 选择模板页面
            var otherVersion = {
                "selectId": "Other",
                "label": "Other"
            };
            var searchModel = {
                name: "",
                "cloud-infra": "",
                range: "sys",
                azid: "",
                ostype: "",
                osversion: "",
                status: "FINISHED",
                start: 0,
                limit: 1000
            };
            // 版本配置
            var getVersionInfo = function (osType) {
                var config = {
                    "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                    "Windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613",
                    "Other": "Other"
                };
                var versionList = [
                    {
                        "selectId": "",
                        "checked": true,
                        "label": i18n.common_term_allOSversion_label || "所有操作系统版本"
                    }
                ];
                var versions = osType ? config[osType] : [config.Linux, config.Windows, config.Other].join(";");
                var list = versions.split(";");

                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    if (item) {
                        var key = item.substr(0, item.lastIndexOf("_"));
                        var version = {
                            "selectId": key,
                            "label": key
                        };
                        versionList.push(version);
                    }
                }
                return versionList;
            };
            $scope.selTemp = {
                appType: {
                    "id": "appType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        checked: [true, false, false]
                    }),
                    "layout": "horizon",
                    "change": function () {
                        var vmlock = $("#" + $scope.selTemp.appType.id).widget().opChecked("checked");
                        $scope.params.vmlock = vmlock;
                        if (vmlock != "0") {
                            $scope.params.vmTemplateId = "";
                            $scope.createVmConfirmInfo.vmTemplate.value = ""
                            $scope.createVmConfirmInfo.systype.value = "";
                            $scope.createVmConfirmInfo.sysversion.value = "";
                        }
                    }
                },
                osType: {
                    "id": "ecsVmCreateOsType",
                    "width": "150",
                    "values": [
                        {
                            "selectId": "",
                            "label": i18n.common_term_allOStype_label || "所有操作系统类型",
                            "checked": true
                        },
                        {
                            "selectId": "Windows",
                            "label": "Windows"
                        },
                        {
                            "selectId": "Linux",
                            "label": "Linux"
                        }
                    ],
                    "change": function () {
                        $scope.selTemp.osVersion.values = getVersionInfo($("#ecsVmCreateOsType").widget().getSelectedId());
                        searchModel.ostype = $("#" + $scope.selTemp.osType.id).widget().getSelectedId();
                        searchModel.osversion = "";
                        queryTemplates();
                    }
                },
                osVersion: {
                    "id": "ecsVmCreateOsVersion",
                    "width": "150",
                    "height": "300",
                    "values": getVersionInfo(),
                    "change": function () {
                        searchModel.osversion = $("#" + $scope.selTemp.osVersion.id).widget().getSelectedId();
                        queryTemplates();
                    }
                },
                searchBox: {
                    "id": "ecsVmCreateSelTempSearchBox",
                    "placeholder": i18n.template_term_findVMtemplate_prom || "输入名称搜索",
                    "width": "200",
                    "maxLength": 64,
                    "search": function (searchString) {
                        searchModel.name = searchString;
                        queryTemplates();
                    }
                },
                // 模板数据
                templates: {
                    value: [],
                    total: 0
                    //show: 0
                },
                // 是否显示选择模板提示
                showTips: false,
                // 当前选中的模板的id
                selectedId: "",
                selectedName: "",
                selectsystype: "",
                selectsysversion: "",
                availableZoneId: "",
                minRam:"",
                minDisk:"",
                selectTemplate: function (index, templateId, templateName, ostype, osVersion, availableZoneId,minRam,minDisk) {
                    //先清空已有数据
                    clearSelectedTemplate();
                    var $dom = $(".ecs_vm_template_bk_color").eq(index);
                    $dom.addClass("ecs_vm_selected_template");
                    $scope.selectedTemplateId = templateId;
                    $scope.selTemp.selectedId = templateId;
                    $scope.selTemp.selectedName = templateName;
                    $scope.selTemp.selectsystype = ostype;
                    $scope.selTemp.selectsysversion = osVersion;
                    $scope.selTemp.availableZoneId = availableZoneId;
                    if($scope.cloudType == "ICT"){
                        $scope.selTemp.minRam = minRam;
                        $scope.selTemp.minDisk = minDisk;
                    }
                    $scope.selTemp.showTips = false;
                },
                preBtn: {
                    "id": "create-catalog-vm-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "display": !serviceId,
                    "click": function () {
                        $("#" + $scope.createVmStep.id).widget().pre();
                        $scope.locationInfoPage = true;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "ecsVmCreateNextBtn",
                    "text": i18n.common_term_next_button || "下一步",
                    "tooltip": "",
                    "click": function () {
                        var vmTemplateStauts = $("#" + $scope.selTemp.appType.id).widget().opChecked("checked");
                        var confirmTempLock = $("#" + $scope.createVmConfirmInfo.vmtempappType.id).widget();
                        confirmTempLock.opChecked(vmTemplateStauts, true);
                        //校验是否选择
                        var seldom = $(".ecs_vm_selected_template");
                        if (seldom.length < 1) {
                            if (vmTemplateStauts === "0") {
                                $scope.selTemp.showTips = true;
                                return false;
                            }
                            else {
                                $scope.selTemp.showTips = false;
                            }
                        }
                        $("#" + $scope.createVmStep.id).widget().next();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = true;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                        var specLockObj = $("#" + $scope.catalogVmSpec.lock.id).widget();
                        $scope.params.vmlock = vmTemplateStauts;
                        if (vmTemplateStauts === "0") {
                            if (appStatus === "none") {
                                specLockObj.opDisabled("0", false);
                                specLockObj.opDisabled("1", false);
                                specLockObj.opDisabled("2", true);
                            }
                            else {
                                specLockObj.opDisabled("0", false);
                                specLockObj.opDisabled("1", false);
                                specLockObj.opDisabled("2", false);
                            }
                            $scope.params.vmTemplateId = vmTemplateStauts == "0" ? $scope.selTemp.selectedId : "";
                            $scope.params.availableZoneId = vmTemplateStauts == "0" ? $scope.selTemp.availableZoneId : "";
                            $scope.createVmConfirmInfo.vmTemplate.value = vmTemplateStauts == "0" ? $scope.selTemp.selectedName : "";
                            $scope.createVmConfirmInfo.systype.value = vmTemplateStauts == "0" ? $scope.selTemp.selectsystype : "";
                            $scope.createVmConfirmInfo.sysversion.value = vmTemplateStauts == "0" ? $scope.selTemp.selectsysversion : "";
                        }
                        else {
                            $scope.selTemp.showTips = false;
                            if ($scope.params.areaLock === "0") {
                                specLockObj.opDisabled("0", false);
                                specLockObj.opDisabled("1", false);
                                specLockObj.opDisabled("2", appStatus === "none");
                            }
                            else {
                                if ($scope.params.areaLock === "1") {
                                    specLockObj.opDisabled("0", true);
                                    specLockObj.opDisabled("1", false);
                                    specLockObj.opDisabled("2", appStatus === "none");
                                }
                                else {
                                    specLockObj.opDisabled("0", true);
                                    specLockObj.opDisabled("1", true);
                                    specLockObj.opDisabled("2", false);
                                }
                            }

                        }
                        if ($scope.cloudType === "ICT" && $scope.params.areaLock === "0") {
                            queryVmSpec();
                        }
                        if ($scope.cloudType === "IT" && $scope.params.areaLock === "0") {
                            querySLAs();
                        }
                        if (serviceId) {
                            var $selfDefined = $(".createvm-cpu .cpu-options[self-defined]");
                            if ($scope.specInfo.userDefConfig.cpu) {
                                var $sizeBlock = $(".createvm-cpu [data-value='" + $scope.specInfo.userDefConfig.cpu + "']");
                                var $allSizeBlock = $(".createvm-cpu .cpu-options").removeClass("selected");
                                $allSizeBlock.removeClass("selected");
                                if ($sizeBlock && $sizeBlock.length) {
                                    $sizeBlock.addClass("selected");
                                } else {
                                    $allSizeBlock.last().addClass("selected");
                                    $selfDefined.text($scope.specInfo.userDefConfig.cpu + i18n.common_term_core_label || "核");
                                }
                            }

                            var $selfDefined = $(".createvm-memory .memory-options[self-defined]");
                            if ($scope.specInfo.userDefConfig.mem) {
                                var $sizeBlock = $(".createvm-memory [data-value='" + $scope.specInfo.userDefConfig.mem + "']");
                                var $allSizeBlock = $(".createvm-memory .memory-options").removeClass("selected");
                                $allSizeBlock.removeClass("selected");
                                if ($sizeBlock && $sizeBlock.length) {
                                    $sizeBlock.addClass("selected");
                                } else {
                                    $allSizeBlock.last().addClass("selected");
                                    $selfDefined.text($scope.specInfo.userDefConfig.mem / 1024 + "G");
                                }
                            }
                        }
                        else {
                            $(".createvm-cpu .cpu-options[self-defined]").editCpu($scope.specInfo.userDefConfig, $scope, i18n.common_term_core_label || "核");
                            $(".createvm-memory .memory-options[self-defined]").editMem($scope.specInfo.userDefConfig, $scope);
                        }
                        var listr = $scope.cloudType == "IT" ? "userDefine" : "system";
                        $scope.changeConfigType(listr);
                    }
                },
                cancelBtn: {
                    "id": "ecsVmCreateCancelBtn",
                    "text": i18n.common_term_cancle_button || "取消",
                    "tooltip": "",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            // 清除选中的模板
            function clearSelectedTemplate() {
                var dom = $(".ecs_vm_selected_template");
                if (dom) {
                    dom.each(function () {
                        $(this).removeClass("ecs_vm_selected_template");
                    });
                }
                $scope.selTemp.selectedId = "";
                $scope.selTemp.selectedName = "";
                $scope.selTemp.selectsystype = "";
                $scope.selTemp.selectsysversion = "";
                $scope.params.availableZoneId = "";
                if($scope.cloudType == "ICT"){
                    $scope.selTemp.minRam = "";
                    $scope.selTemp.minDisk = "";
                }
                $scope.selTemp.showTips = false;
            }

            // 从模板列表中，搜索指定模板
            function getSelectedTemplate(templateId) {
                var selected = _.find($scope.selTemp.templates.value, function (item) {
                    return item.vmtId == templateId;
                });
                return selected || {};
            }
            // 查询虚拟机模板列表
            function queryTemplates() {
                $scope.selTemp.templates.value = [];
                searchModel.osversion = searchModel.osversion;
                searchModel.name = $.trim(searchModel.name);
                var options = {
                    "user": user,
                    "params": searchModel
                };
                var deferred = createServiceIns.queryVmTemplates(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    //先清空已选数据
                    clearSelectedTemplate();
                    _.each(data.vmtemplates, function (item) {
                        item.type = item.orgId > 1 ? "组织模板" : i18n.template_term_sysTemplate_label;
                        if (!item.picture) {
                            item.picture = "../theme/default/images/vmTemplate/icon_vmtemplate_1.png";
                        }
                        if (item.vmtId == $scope.selectedTemplateId) {
                            $scope.selTemp.selectedId = item.vmtId;
                            $scope.selTemp.selectedName = item.vmtName;
                            $scope.selTemp.selectsystype = item.osType;
                            $scope.selTemp.selectsysversion = item.osVersion;
                            if($scope.cloudType == "ICT"){
                                $scope.selTemp.minRam = item.minRam;
                                $scope.selTemp.minDisk = item.minDisk;
                            }
                            $scope.selTemp.availableZoneId = item.availableZoneId;
                            $scope.selTemp.showTips = false;
                        }
                    });
                    $scope.selTemp.templates.value = data.vmtemplates;
                    $scope.selTemp.templates.total = data.totalNum;
                });
            }

            // 从模板列表中，搜索指定模板
            function getSelectedTemplate(templateId) {
                var selected = _.find($scope.selTemp.templates.value, function (item) {
                    return item.vmtId === templateId;
                });
                return selected || {};
            }

            // 虚拟机规格
            $scope.catalogVmSpec = {
                lock: {
                    "id": "VmSpecSelect",
                    "values": getTypes({
                        checked: [true, false, false]
                    }),
                    "layout": "horizon",
                    "change": function () {
                        var specVM = $("#" + $scope.catalogVmSpec.lock.id).widget().opChecked("checked");
                        if (specVM === "0") {
                            $("#vmSpecList").show();
                        }
                        else {
                            $("#vmSpecList").hide();
                            $scope.params.specbiscId = "";
                            $scope.params.customcpu = "";
                            $scope.params.custommem = "";
                            $scope.createVmConfirmInfo.vmSpecCpu.value = "";
                            $scope.createVmConfirmInfo.vmSpecMemory.value = "";
                        }
                    }
                },
                preBtn: {
                    "id": "create-catalog-vm-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVmStep.id).widget().pre();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = true;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "create-catalog-vm-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var vmSpecType = $("#" + $scope.catalogVmSpec.lock.id).widget().opChecked("checked");
                        var validcpu = $(".createvm-cpu .cpu-options[self-defined] input").length > 0 ? true : false;
                        var validmemory = $(".createvm-memory .memory-options[self-defined] input").length > 0 ? true : false;
                        var validCPUCstuom = vmSpecType == "0" ? validcpu : false;
                        var validmemoryCstuom = vmSpecType == "0" ? validmemory : false;
                        if ($scope.service.configType == "userDefine") {
                            if (validCPUCstuom || validmemoryCstuom) {
                                return;
                            }
                        }
                        $("#" + $scope.createVmStep.id).widget().next();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = true;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                        var networkObj = $("#createVmNetworkappType").widget();
                        var confirmVMspecLock = $("#" + $scope.createVmConfirmInfo.vmspecappType.id).widget();
                        confirmVMspecLock.opChecked(vmSpecType, true);
                        $scope.params.specLock = vmSpecType;
                        if (vmSpecType === "0") {
                            if (appStatus === "none") {
                                networkObj.opDisabled("0", false);
                                networkObj.opDisabled("1", false);
                                networkObj.opDisabled("2", true);
                            }
                            else {
                                networkObj.opDisabled("0", false);
                                networkObj.opDisabled("1", false);
                                networkObj.opDisabled("2", false);
                            }
                            var vmSpecTypemothd = $scope.service.configType;
                            if (vmSpecTypemothd === "system") {
                                $scope.params.specbiscId = $("#" + $scope.specInfo.configTem.id).widget().getSelectedId();
                                var tempData = $scope.specInfo.configTem.detail;
                                $scope.params.customcpu = vmSpecType == "0" ? tempData.cpuCount : "";
                                $scope.params.custommem = vmSpecType == "0" ? tempData.memSize : "";
                                $scope.createVmConfirmInfo.vmSpecCpu.value = vmSpecType == "0" ? tempData.cpuCount + "vCPU" : "";
                                $scope.createVmConfirmInfo.vmSpecMemory.value = vmSpecType == "0" ? tempData.memSize + "MB" : "";
                            }
                            else {
                                $scope.params.customcpu = vmSpecType == "0" ? $scope.specInfo.userDefConfig.cpu : "";
                                $scope.params.custommem = vmSpecType == "0" ? $scope.specInfo.userDefConfig.mem : "";
                                $scope.params.slaId = $scope.specInfo.sla.curr;
                                $scope.createVmConfirmInfo.vmSpecCpu.value = vmSpecType == "0" ? $scope.params.customcpu + "vCPU" : "";
                                $scope.createVmConfirmInfo.vmSpecSla.value = vmSpecType == "0" ? $scope.specInfo.sla.curr : "";
                                $scope.createVmConfirmInfo.vmSpecMemory.value = vmSpecType == "0" ? $scope.params.custommem + "MB" : "";
                            }
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-catalog-vm-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            $scope.specInfo = {
                userDefConfig: {
                    "cpu": 1,
                    "mem": 512,
                    "cpuInput": false, //是否是用户输入的CPU
                    "memInput": false //是否是用户输入的CPU
                },
                configTem: {
                    "id": "catalogVmCreateConfigTemplateId",
                    "label": (i18n.common_term_name_label || "名称:") + ":",
                    "width": "250",
                    "values": [],
                    "detail": {},
                    "validate": "required:必填项;",
                    "change": function () {
                        onChangeConfigTem($("#" + $scope.specInfo.configTem.id).widget().getSelectedId());
                    }
                },
                cpuNum: {
                    "label": "CPU:"
                },
                memory: {
                    "label": (i18n.common_term_memory_label || "内存:") + ":"
                },
                disk: {
                    "label": (i18n.common_term_disk_label || "磁盘:") + ":"
                },
                sla: {
                    label: "SLA:",
                    "values": [],
                    "curr": "",
                    "colors": ["#6cbfe8", "#39a8e0", "#1e8ac0", "#16658d", "#0e405a"]
                }
            };
            $scope.getSlaStyle = function (index) {
                return {
                    "background-color": $scope.specInfo.sla.colors[index % 5]
                };
            };
            $.fn.editCpu = function (userDef, scope, unit) {
                var dom = this;
                this.bind("click", function (evt) {
                    evt.stopPropagation();
                    if (dom.find("input").length > 0) {
                        return;
                    }
                    var oldValue = userDef.cpuInput ? userDef.cpu : "";
                    var input = $("<input type='text' value='" + oldValue + "'>");
                    input.css({
                        "width": dom.css("width"),
                        "height": dom.css("height")
                    });
                    var confirmInput = function () {
                        var value = input.val();
                        var reg = /^([1-9]|[1-5]\d|6[0-4])$/;
                        if (!reg.test(value)) {
                            $(".createvm-cpu .input-tip").css("display", "inline-block");
                            return;
                        }
                        $(".createvm-cpu .input-tip").css("display", "none");
                        dom.html(value + unit);
                        userDef.cpu = value;
                        userDef.cpuInput = true;
                    };
                    input.bind("keypress", function (evt) {
                        if (evt.keyCode === 13) {
                            confirmInput();
                        }
                    });
                    input.bind("blur", function () {
                        confirmInput();
                    });
                    dom.html(input);
                    input.focus();
                });
                return this;
            };
            $.fn.editMem = function (userDef, scope) {
                var dom = this;
                this.bind("click", function (evt) {
                    evt.stopPropagation();
                    if (dom.find("input").length > 0) {
                        return;
                    }
                    var oldValue = userDef.memInput ? Math.ceil(userDef.mem / 1024) : "";
                    var input = $("<input type='text' value='" + oldValue + "'>");
                    input.css({
                        "width": dom.css("width"),
                        "height": dom.css("height")
                    });
                    var confirmInput = function () {
                        var value = input.val();
                        var reg = /^([1-9]|[1-9]\d|[1-9]\d\d|10[0-1]\d|102[0-4])$/;
                        if (!reg.test(value)) {
                            $(".createvm-memory .input-tip").css("display", "inline-block");
                            return;
                        }
                        $(".createvm-memory .input-tip").css("display", "none");
                        dom.html(value + "G");
                        userDef.mem = value * 1024;
                        userDef.memInput = true;
                    };
                    input.bind("keypress", function (evt) {
                        if (evt.keyCode === 13) {
                            confirmInput();
                        }
                    });
                    input.bind("blur", function () {
                        confirmInput();
                    });
                    dom.html(input);
                    input.focus();
                });
                return this;
            };
            // 初始化CPU、内存颜色块事件
            $scope.changeCpuSpec = function (evt) {
                if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                    $(".createvm-cpu .cpu-options[self-defined]").html(i18n.common_term_custom_label || "自定义");
                    $(".createvm-cpu .input-tip").css("display", "none");
                    $scope.specInfo.userDefConfig.cpu = $(evt.currentTarget).data("value");
                    $scope.specInfo.userDefConfig.cpuInput = false;
                }
                $(".createvm-cpu div.cpu-options").removeClass("selected");
                $(evt.currentTarget).addClass("selected");
            };
            $scope.changeMemorySpec = function (evt) {
                if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                    $(".createvm-memory .memory-options[self-defined]").html(i18n.common_term_custom_label || "自定义");
                    $(".createvm-memory .input-tip").css("display", "none");
                    $scope.specInfo.userDefConfig.mem = $(evt.currentTarget).data("value");
                    $scope.specInfo.userDefConfig.memInput = false;
                }
                $(".createvm-memory div.memory-options").removeClass("selected");
                $(evt.currentTarget).addClass("selected");
            };

            // 切换是系统规格还是用户自定义规格
            $scope.changeConfigType = function (type) {
                $scope.service.configType = type;
                $scope.params.vmSpecType = type;
            };
            // 查询指定虚拟机规格模板详情
            function onChangeConfigTem(id) {
                var detail = _.find($scope.specInfo.configTem.values, function (item) {
                    return item.flavorId == id;
                });
                $scope.specInfo.configTem.detail = detail;
            };
            //查询虚拟机规格
            function queryVmSpec() {
                var options = {
                    "user": user,
                    "cloudInfraId": searchModel["cloud-infra"]
                };
                var deferred = createServiceIns.queryConfigTemplates(options);
                deferred.then(function (data) {
                    if (data && data.vmFlavors && data.vmFlavors.length) {
                        data.vmFlavors = $scope.cloudType=="ICT" ? dealFlavors(data.vmFlavors) : data.vmFlavors;
                        var selectedFlavor = null;
                        for (var i = 0, len = data.vmFlavors.length; i < len; i++) {
                            var item = data.vmFlavors[i];
                            var checked = $scope.selectedFlavorId == item.flavorId || (!$scope.selectedFlavorId && !i);
                            _.extend(item, {
                                "diskTotalSize": getDiskTotalSize(item.disks, "diskSize"),
                                "userDiskSize": getDiskTotalSize(item.disks, "diskSize", true),
                                "selectId": item.flavorId,
                                "label": item.name,
                                "checked": checked
                            });
                            if (item.systemDiskSize) {
                                item.diskTotalSize += item.systemDiskSize;
                            }
                            checked && (selectedFlavor = item);
                        }

                        $scope.specInfo.configTem.values = data.vmFlavors;
                        $scope.specInfo.configTem.detail = selectedFlavor;
                    }
                });
            }
            /**
             * 根据模板的最小内存和最小磁盘过滤flavor
             * @param vmFlavors
             */
            function dealFlavors(vmFlavors){
                if(!vmFlavors){
                    return [];
                }

                var availableFlavors = [];
                _.each(vmFlavors, function(item){
                    if(item.memSize >= $scope.selTemp.minRam && item.systemDiskSize >= $scope.selTemp.minDisk){
                        availableFlavors.push(item);
                    }
                });
                if(!_.isEmpty(availableFlavors)){
                    availableFlavors[0].checked = true;
                }
                return availableFlavors;
            }
            // 查询SLA信息
            function querySLAs() {
                var options = {
                    "user": user,
                    "azId": $scope.params.azId,
                    "cloudInfraId": searchModel["cloud-infra"]
                };
                var deferred = createServiceIns.querySlaTags(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.specInfo.sla.values = data.slas;
                    $scope.slaValues = data.slas;
                    if (serviceId) {
                        $scope.specInfo.sla.curr = $scope.slaName
                    }
                    else {
                        $scope.specInfo.sla.curr = "";
                    }

                    // 初始化颜色块
                    setTimeout(function () {
                        initSlaAnimal();
                    }, 50);

                });
            }

            // 初始化SLA颜色块事件
            function initSlaAnimal() {
                $(".createvm-types").undelegate(".types-item", "click");
                $(".createvm-types").delegate(".types-item", "click", function (evt) {
                    var value = "";

                    if ($(evt.currentTarget).hasClass("selected")) {
                        $(evt.currentTarget).removeClass("selected").find("i").removeClass("icon-ok");
                    } else {
                        $(".createvm-types .types-item").removeClass("selected").find("i").removeClass("icon-ok");
                        $(evt.currentTarget).addClass("selected").find("i").addClass("icon-ok");
                        value = $(evt.currentTarget).data("value");
                    }
                    $scope.specInfo.sla.curr = value;
                    $scope.slaName = value;
                });
            }

            function getDiskTotalSize(disks, sizeName, skipFirstDisk) {
                var total = 0;
                if (disks && disks.length > 0) {
                    _.each(disks, function (item, index) {
                        if (!(skipFirstDisk && index === 0)) {
                            total += parseInt(item[sizeName], 10);
                        }
                    });
                }
                return total;
            }

            // 网络配置
            $scope.createVmBasic = true;
            $scope.createVmNetwork = {
                appType: {
                    "id": "createVmNetworkappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [
                        {
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label || "申请时输入"
                        },
                        {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label || "审批时输入"
                        }
                    ],
                    "layout": "horizon",
                    "change": function () {
                        $("#createVmNetworkParams").hide();
                        $scope.params.networkType = "";
                        $scope.createVmConfirmInfo.vmNetworkType.value = "";
                        $scope.params.nicLock = "";
                    }
                },
                basicAz: {
                    "label": ( i18n.resource_term_AZ_label || "可用分区:") + ":",
                    "require": true,
                    "validate": "required:" + (i18n.common_term_null_valid || "不能为空。"),
                    "id": "ecsVmCreateBasicAz",
                    "width": "220",
                    "data": []
                },
                preBtn: {
                    "id": "create-catalog-networks-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVmStep.id).widget().pre();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = true;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "create-catalog-network-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVmNetwork"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVmStep.id).widget().next();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = true;
                        $scope.confirmPage = false;
                        var netLockStatus = $("#" + $scope.createVmNetwork.appType.id).widget().opChecked("checked");
                        $scope.params.networkLock = netLockStatus;
                        var confirmVMnetworkLock = $("#" + $scope.createVmConfirmInfo.vmnetworkappType.id).widget();
                        confirmVMnetworkLock.opChecked(netLockStatus, true);
                        if (netLockStatus === "0") {
                            var networkids = ($("#" + $scope.createVmNetwork.basicAz.id).widget().getSelectedId()).split("@");
                            $scope.params.networkId = networkids[0];
                            $scope.params.vpcId = networkids[1];
                            $scope.createVmConfirmInfo.vmNetworkType.value = "";
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-catalog-network-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };

            //基本信息界面初始化
            $scope.baseInfo = {
                "name": {
                    "id": "createApp-appName",
                    "label": (i18n.common_term_name_label || "名称:") + ":",
                    "width": 200,
                    "require": true,
                    "value": "",
                    "validate": "regularCheck(" + validator.serviceName + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") +
                        ";regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                directory: {
                    "id": "createDirectory",
                    label: (i18n.service_term_catalog_label || "服务目录:") + ":",
                    "mode": "multiple",
                    "require": false,
                    "width": 200,
                    values: []
                },
                "logo": {
                    "label": (i18n.common_term_icon_label || "图标" ) + ":",
                    "require": true,
                    "curLogo": "",
                    "switchIcon": function (icon) {
                        $scope.params.iconId = icon.id;
                        $scope.baseInfo.logo.curLogo = icon.imageUrl;
                    },
                    "deleteIcon": function (icon, index) {
                        deleteIcon(icon.id, index);
                    },
                    "toggle": function ($event) {
                        $event.stopPropagation();
                        $(".dropdown-menu").toggle();
                    },
                    "upload": function () {
                        var uploadImgWindow = new Window({
                            "winId": "uploadImgWindow",
                            "title": i18n.common_term_uploadLocalPic_button || "上传图片",
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "i18n": $scope.i18n,
                            "callback": function (icon) {
                                $scope.$apply(function () {
                                    $scope.params.iconId = icon.id;
                                    $scope.baseInfo.logo.curLogo = icon.imageUrl;
                                    $scope.icons.unshift(icon);
                                });
                            },
                            "content": "../src/app/business/service/views/catalog/iconUpload.html",
                            "height": 300,
                            "width": 530,
                            "buttons": null
                        }).show();
                    }
                },
                "description": {
                    "id": "createApp-appDescription",
                    "label": (i18n.common_term_desc_label || "描述:") + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 300,
                    "height": "100",
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, 1,1024)
                },
                preBtn: {
                    "id": "create-service-basicInfo-next",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVmStep.id).widget().pre();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = true;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "create-service-basicInfo-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVmBasicPage"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVmStep.id).widget().next();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = false;
                        $scope.confirmPage = true;
                        var catalogs = $("#" + $scope.baseInfo.directory.id).widget().getSelectedId();
                        $scope.params.serviceName = $("#" + $scope.baseInfo.name.id).widget().getValue();
                        $scope.params.catalogList = catalogs;
                        $scope.params.desc = $("#" + $scope.baseInfo.description.id).widget().getValue();
                        $scope.createVmConfirmInfo.serviceName.value = $scope.params.serviceName;
                        $scope.createVmConfirmInfo.serviceCatalog.value = $("#" + $scope.baseInfo.directory.id).widget().getSelectedLabel();
                        $scope.createVmConfirmInfo.description.value = $scope.params.desc;
                    }
                },
                cancelBtn: {
                    "id": "create-service-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            // 查询服务目录
            function queryCatalogs() {
                var catalogs = ($scope.serviceInstance && $scope.serviceInstance.catalogs) || [];
                var deferred = catalogServiceIns.queryCatalogs({"user": user});
                deferred.then(function (data) {
                    var SPER = "@";
                    var selectedCatalogsFormat = catalogs.length ? (SPER + catalogs.join(SPER) + SPER) : "";
                    data = data || {catalogs: []};
                    var allCatalogs = data.catalogs || [];
                    var selectValues = [];
                    for (var i = 0, len = allCatalogs.length; i < len; i++) {
                        var catalogId = allCatalogs[i].id;
                        var checked = (selectedCatalogsFormat && selectedCatalogsFormat.indexOf(SPER + catalogId + SPER) > -1);
                        selectValues.push({
                            "selectId": catalogId,
                            "label": allCatalogs[i].name,
                            "checked": checked
                        });
                    }
                    $scope.baseInfo.directory.values = selectValues;
                });
            };
            //查询icon list
            function queryIcons(serviceImageUrl) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId
                };
                var deferred = createServiceIns.queryIcons(options);
                deferred.then(function (data) {
                    data = data || {serviceiconlist: []};
                    var list = data.serviceiconlist;
                    $scope.icons = list;
                    if (list.length) {
                        var icon = "";
                        if (serviceImageUrl) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i].imageUrl == serviceImageUrl) {
                                    icon = list[i];
                                    break;
                                }
                            }
                        }
                        else {
                            icon = list[0]
                        }
                        $scope.baseInfo.logo.curLogo = icon.imageUrl;
                        $scope.params.iconId = icon.id;
                    }
                });
            };
            //删除icon
            function deleteIcon(iconId, index) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "iconId": iconId
                };
                var deferred = createServiceIns.deleteIcon(options);
                deferred.then(function (data) {
                    $scope.icons.splice(index, 1);
                    if ($scope.icons.length) {
                        $scope.baseInfo.logo.switchIcon($scope.icons[0]);
                    }
                });
            }
            // 确认界面
            $scope.createVmConfirmInfo = {
                serviceName: {
                    "id": "serviceName",
                    "label": (i18n.service_term_serviceName_label || "服务名称：") + ":",
                    "value": ""
                },
                serviceCatalog: {
                    "id": "serviceCatalog",
                    "label": (i18n.service_term_catalog_label || "服务目录：") + ":",
                    "value": ""
                },
                description: {
                    "id": "description：",
                    "label": (i18n.common_term_desc_label || "描述：") + ":",
                    "value": ""
                },
                apptype: {
                    "id": "apptype",
                    "label": (i18n.service_term_approveType_label || "审批类型") + ":",
                    "value": ""
                },
                area: {
                    "id": "area",
                    "label": (i18n.common_term_section_label || "地域：") + ":",
                    "value": ""
                },
                azVal: {
                    "id": "azVal",
                    "label": (i18n.resource_term_Azs_label || "可用分区") + ":",
                    "value": ""
                },
                vmTemplate: {
                    "id": "vmTemplate",
                    "label": (i18n.common_term_templateNmae_label || "模板名称：") + ":",
                    "value": ""
                },
                systype: {
                    "id": "systype",
                    "label": (i18n.common_term_OStype_label || "操作系统类型：") + ":",
                    "value": ""
                },
                sysversion: {
                    "id": "sysversion",
                    "label": (i18n.common_term_OSversion_label || "操作系统版本：") + ":",
                    "value": ""
                },
                vmSpecCpu: {
                    "id": "vmSpec",
                    "label": "CPU：",
                    "value": ""
                },
                vmSpecMemory: {
                    "id": "vmSpec",
                    "label": (i18n.common_term_memory_label || "内存：") + ":",
                    "value": ""
                },
                vmSpecSla: {
                    "id": "vmSpecSla",
                    "label": "SLA：",
                    "value": ""
                },
                vmNetworkType: {
                    "id": "vmNetworkType",
                    "label": (i18n.vpc_term_net_label || "网络：") + ":",
                    "value": ""
                },
                vmtempappType: {
                    "id": "vmtempappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        disable: [true, true, true]
                    }),
                    "layout": "horizon"
                },
                vmspecappType: {
                    "id": "vmspecappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        disable: [true, true, true]
                    }),
                    "layout": "horizon"
                },
                vmnetworkappType: {
                    "id": "vmnetworkappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [
                        {
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label || "申请时输入",
                            "disable": true
                        },
                        {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label || "审批时输入",
                            "disable": true
                        }
                    ],
                    "layout": "horizon"
                },
                vmreginappType: {
                    "id": "vmreginappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        disable: [true, true, true]
                    }),
                    "layout": "horizon"
                },
                vmAzappType: {
                    "id": "vmAzappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": getTypes({
                        disable: [true, true, true]
                    }),
                    "layout": "horizon"
                },
                preBtn: {
                    "id": "createService-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVmStep.id).widget().pre();
                        $scope.locationInfoPage = false;
                        $scope.templateInfoPage = false;
                        $scope.specInfoPage = false;
                        $scope.networkInfoPage = false;
                        $scope.basicInfoPage = true;
                        $scope.confirmPage = false;
                    }
                },
                addBtn: {
                    "id": "createServiceVM-next",
                    "text": serviceId ? (i18n.common_term_save_label || "保存") : (i18n.common_term_create_button || "创建"),
                    "click": function () {
                        var objJSon = {
                            "cloudInfra": {
                                "id": searchModel["cloud-infra"],
                                "lock": $scope.params.areaLock
                            },
                            "availableZone": {
                                "id": $scope.params.azId,
                                "lock": $scope.params.areaLock
                            },
                            "vmTemplate": {
                                "id": $scope.params.vmTemplateId,
                                "lock": $scope.params.vmlock
                            },
                            "vmSpec": {
                                "flavor": {
                                    "id": $scope.params.specbiscId,
                                    "lock": $scope.params.specLock
                                },
                                "sla": {
                                    "value": $scope.specInfo.sla.curr,
                                    "lock": $scope.params.specLock
                                },
                                "spec": {
                                    "cpu": {
                                        "value": $scope.params.customcpu,
                                        "lock": $scope.params.specLock
                                    },
                                    "memory": {
                                        "value": $scope.params.custommem,
                                        "lock": $scope.params.specLock
                                    },
                                    "disk": [
                                        {
                                            "name": "",
                                            "size": "",
                                            "lock": $scope.params.specLock
                                        }
                                    ]
                                }
                            },
                            "vmNetwork": {
                                "nics": [
                                    {
                                        "networkId": $scope.params.networkId,
                                        "vpcId": $scope.params.vpcId,
                                        "lock": $scope.params.networkLock
                                    }
                                ]
                            }
                        };
                        if (serviceId) {
                            modifyServiceVM(objJSon);
                        } else {
                            createServiceVM(objJSon);
                        }
                    }
                },
                cancelBtn: {
                    "id": "createServiceVM-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            // 修改VM服务
            function modifyServiceVM(objJSon) {
                var options = {
                    "user": user,
                    "serviceId": serviceId,
                    "params": {
                        "name": $scope.params.serviceName,
                        "description": $scope.params.desc,
                        "approveType": $scope.serviceInstance.approveType,
                        "params": JSON.stringify(objJSon),
                        "catalogs": $scope.params.catalogList,
                        "whiteListFlag": $scope.serviceInstance.whiteListFlag,
                        "vdcWhiteList": $scope.serviceInstance.vdcWhiteList,
                        "iconId": $scope.params.iconId
                    }
                };
                var deferred = catalogServiceIns.modifyServices(options);
                deferred.then(function (data) {
                    $state.go("service.serviceManager");
                });
            }

            // 创建VM服务
            function createServiceVM(objJSon) {
                var options = {
                    "user": user,
                    "serviceTemplateId": templateId,
                    "name": $scope.params.serviceName,
                    "description": $scope.params.desc,
                    "status": "unpublished",
                    "approveType": $scope.params.applyType,
                    "params": JSON.stringify(objJSon),
                    "catalogs": $scope.params.catalogList,
                    "whiteListFlag": false,
                    "vdcWhiteList": $scope.params.whiteList,
                    "iconId": $scope.params.iconId
                };
                var deferred = createServiceIns.createService(options);
                deferred.then(function (data) {
                    $state.go("service.serviceManager");
                });
            }

            $(document).bind("click.upload", function ($event) {
                $event.stopPropagation();
                var $target = $($event.target);
                if (!$target.hasClass("dropdown-menu") && !$target.parents(".dropdown-menu").length) {
                    $(".dropdown-menu").hide();
                }
            });
            $scope.$on('$destroy', function () {
                $(document).unbind("click.upload");
            });

            function queryService(callback) {
                var options = {
                    "user": user,
                    "id": serviceId
                };
                var deferred = catalogServiceIns.queryServiceOffering(options);

                deferred.then(function (data) {
                    callback && callback(data);
                });
            }

            function stringToJson(params) {
                var serviceInstaceQuota = null;
                try {
                    serviceInstaceQuota = JSON.parse(params);
                } catch (e) {
                }
                return serviceInstaceQuota;
            }

            function initParams(serviceInstance) {
                var serviceInstaceQuota = serviceInstance.params;
                try {
                    serviceInstaceQuota = JSON.parse(serviceInstaceQuota);
                } catch (e) {
                    serviceInstaceQuota = {};
                }
                var getQuotaValue = function (key) {
                    var val = "";
                    if (key) {
                        var item = serviceInstaceQuota[key] || {};
                        val = item["value"] || "";
                    }
                    return val;
                };
                $scope.serviceInstance = serviceInstance;
                $scope.serviceInstaceQuota = serviceInstaceQuota;
                var serviceInstaceAreaLock = serviceInstaceQuota.cloudInfra.lock;
                var serviceInstaceTemplateLock = serviceInstaceQuota.vmTemplate.lock;
                var serviceInstaceVmSpecLock = serviceInstaceQuota.vmSpec.flavor.lock;
                var serviceInstaceVmSpecFlavorId = serviceInstaceQuota.vmSpec.flavor.id;
                var serviceInstaceVmSpecCPU = serviceInstaceQuota.vmSpec.spec.cpu.value;
                var serviceInstaceVmNetworkLock = serviceInstaceQuota.vmNetwork.nics[0].lock;
                $scope.slaName = serviceInstaceQuota.vmSpec.sla.value;
                applyTypeId = serviceInstance.approveType;
                $scope.locationInfo.location.disable = serviceInstaceAreaLock != "0";
                $scope.locationInfo.az.disable = serviceInstaceAreaLock != "0";
                $scope.locationInfo.locationLock.values = getTypes({
                    checked: [serviceInstaceAreaLock == "0", serviceInstaceAreaLock == "1", serviceInstaceAreaLock == "2"],
                    disable: [false, false, applyTypeId == "none"]
                });

                $scope.params.vmlock = serviceInstaceTemplateLock;
                $scope.selTemp.appType.values = getTypes({
                    checked: [serviceInstaceTemplateLock == "0", serviceInstaceTemplateLock == "1", serviceInstaceTemplateLock == "2"]
                });
                $scope.selectedTemplateId = serviceInstaceQuota.vmTemplate.id;
                $scope.selTemp.showTips = false;

                $scope.catalogVmSpec.lock.values = getTypes({
                    checked: [serviceInstaceVmSpecLock == "0", serviceInstaceVmSpecLock == "1", serviceInstaceVmSpecLock == "2"]
                });
                if (serviceInstaceVmSpecCPU) {
                    $scope.changeConfigType('userDefine');
                    $scope.specInfo.userDefConfig.cpu = serviceInstaceVmSpecCPU;
                    $scope.specInfo.userDefConfig.mem = serviceInstaceQuota.vmSpec.spec.memory.value;
                } else {
                    $scope.selectedFlavorId = serviceInstaceVmSpecFlavorId;
                }

                $scope.createVmNetwork.appType.values = [
                    {
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label || "申请时输入",
                        "checked": serviceInstaceVmNetworkLock == "1"
                    },
                    {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label || "审批时输入",
                        "checked": serviceInstaceVmNetworkLock == "2"
                    }
                ];

                //基本信息
                $scope.params.appName = serviceInstance.name;
                $scope.params.description = serviceInstance.description;
                $scope.baseInfo.logo.curLogo = serviceInstance.serviceImageUrl;
            }

            function init(serviceId) {
                if (serviceId) {
                    //编辑
                    $("#createVmtitle").text(i18n.service_term_modifyVMservice_label || "修改虚拟机服务");
                    queryService(function (serviceInstance) {
                        initParams(serviceInstance);
                        var serviceInstaceQuota = stringToJson(serviceInstance.params);
                        queryCatalogs(serviceInstance.catalogs);
                        queryIcons($scope.baseInfo.logo.curLogo);
                        queryArea(serviceInstaceQuota.cloudInfra && serviceInstaceQuota.cloudInfra.id, serviceInstaceQuota.availableZone && serviceInstaceQuota.availableZone.id);
                    });
                } else {
                    $("#createVmtitle").text(i18n.service_term_addVMservice_label || "创建虚拟机服务");
                    //创建
                    queryArea(null, null);
                    queryCatalogs();
                    queryIcons(null);
                }
                setTimeout(function () {
                    //注册自定义规格
                    $(".createvm-cpu .cpu-options[self-defined]").editCpu($scope.specInfo.userDefConfig, $scope, i18n.common_term_core_label || "核");
                    $(".createvm-memory .memory-options[self-defined]").editMem($scope.specInfo.userDefConfig, $scope);
                }, 500);
            }

            init(serviceId);
        }];
        return createVmCtrl;
    }
);