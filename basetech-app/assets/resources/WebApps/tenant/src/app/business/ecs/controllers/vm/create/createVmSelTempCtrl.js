/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：13-12-28
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        "app/business/ecs/services/vm/queryVmService",
        "app/services/cloudInfraService"
    ],
    function ($, angular, _, queryVmService,cloudInfraService) {
        "use strict";

        var createVmSelTempCtrl = ["$scope", "$window", "$q", "camel", "exception",
            function ($scope, $window, $q, camel, exception) {
                var user = $scope.user;
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var i18n = $scope.i18n;
                var otherVersion = {
                    "selectId": "Other",
                    "label": "Other"
                };

                var searchModel = {
                    name: "",
                    "cloud-infra": $scope.service.cloudInfraId,
                    range: "all",
                    ostype: "",
                    osversion: "",
                    status: "FINISHED",
                    start: 0,
                    limit: 1000
                };

                $scope.openstack = user.cloudType === "ICT";

                $scope.selTemp = {
                    az: {
                        "id": "ecsVmCreateAz",
                        "label":i18n.resource_term_AZ_label+":",
                        "width": "100",
                        "values": [],
                        "change": function () {
                            searchModel.azid = $("#" + $scope.selTemp.az.id).widget().getSelectedId();
                            queryTemplates();
                        }
                    },
                    tempType: {
                        "id": "ecsVmCreateTempType",
                        "width": "100",
                        "values": [{
                            "selectId": "all",
                            "label": i18n.common_term_allType_label,
                            "checked": true
                        }, {
                            "selectId": "sys",
                            "label": i18n.template_term_sysTemplate_label
                        }, {
                            "selectId": "mine",
                            "label": i18n.org_term_VDCtemplate_label
                        }],
                        "change": function () {
                            searchModel.range = $("#" + $scope.selTemp.tempType.id).widget().getSelectedId();
                            queryTemplates();
                        }
                    },

                    osType: {
                        "id": "ecsVmCreateOsType",
                        "width": "150",
                        "values": [{
                            "selectId": "",
                            "label": i18n.common_term_allOStype_label,
                            "checked": true
                        }, {
                            "selectId": "Windows",
                            "label": "Windows"
                        }, {
                            "selectId": "Linux",
                            "label": "Linux"
                        }],
                        "change": function () {
                            $scope.selTemp.osVersion.values = $scope.selTemp.versionConfig.getVersionInfo($("#ecsVmCreateOsType").widget().getSelectedId());
                            searchModel.ostype = $("#" + $scope.selTemp.osType.id).widget().getSelectedId();
                            searchModel.osversion = "";
                            queryTemplates();
                        }
                    },

                    osVersion: {
                        "id": "ecsVmCreateOsVersion",
                        "width": "150",
                        "height": "300",
                        "values": [],
                        "change": function () {
                            searchModel.osversion = $("#" + $scope.selTemp.osVersion.id).widget().getSelectedId();
                            queryTemplates();
                        }
                    },

                    searchBox: {
                        "id": "ecsVmCreateSelTempSearchBox",
                        "placeholder": i18n.common_term_findName_prom,
                        "width": "200",
                        "maxLength": 64,
                        "search": function (searchString) {
                            searchModel.name = searchString;
                            queryTemplates();
                        }
                    },

                    // 版本配置
                    versionConfig: {
                        "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                        "windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613",
                        "Linux_ICT": "CentOS 5.7 32bit;CentOS 5.7 64bit;CentOS 5.8 32bit;CentOS 5.8 64bit;CentOS 6.2 32bit;CentOS 6.2 64bit;CentOS 6.3 32bit;CentOS 6.3 64bit;DOPRA Linux V200R003C07SPC200 32bit;DOPRA Linux V200R003C07SPC200 64bit;EulerLinux V100R001C00 64bit;Novell SuSE Linux Enterprise Server 11 SP1 32bit;Novell SuSE Linux Enterprise Server 11 SP1 64bit;Novell SuSE Linux Enterprise Server 11 SP2 32bit;Novell SuSE Linux Enterprise Server 11 SP2 64bit;Novell SuSE Linux Enterprise Server 11 SP3 32bit;Novell SuSE Linux Enterprise Server 11 SP3 64bit;Red Hat Enterprise Linux 5.5 32bit;Red Hat Enterprise Linux 5.5 64bit;Red Hat Enterprise Linux 5.6 32bit;Red Hat Enterprise Linux 5.6 64bit;Red Hat Enterprise Linux 5.7 32bit;Red Hat Enterprise Linux 5.7 64bit;Red Hat Enterprise Linux 5.8 32bit;Red Hat Enterprise Linux 5.8 64bit;Red Hat Enterprise Linux 5.9 32bit;Red Hat Enterprise Linux 5.9 64bit;Red Hat Enterprise Linux 6.0 32bit;Red Hat Enterprise Linux 6.0 64bit;Red Hat Enterprise Linux 6.1 32bit;Red Hat Enterprise Linux 6.1 64bit;Red Hat Enterprise Linux 6.2 32bit;Red Hat Enterprise Linux 6.2 64bit;Red Hat Enterprise Linux 6.3 32bit;Red Hat Enterprise Linux 6.3 64bit;Red Hat Enterprise Linux 6.4 32bit;Red Hat Enterprise Linux 6.4 64bit;RTOS V100R002C00 64bit",
                        "windows_ICT": "Windows Server 2008 DataCenter R2 SP1 64bit;Windows Server 2008 Enterprise R2 SP1 64bit;Windows Server 2008 Enterprise R2 64bit;Windows Server 2012 64bit",
                        "getVersionInfo": function (osType) {
                            var versionList = [];
                            if (osType === 'Windows') {
                                versionList = $scope.openstack ? $scope.selTemp.versionConfig.windows_ICT.split(";") : $scope.selTemp.versionConfig.windows.split(";");
                            } else {
                                versionList = $scope.openstack ? $scope.selTemp.versionConfig.Linux_ICT.split(";") : $scope.selTemp.versionConfig.Linux.split(";");
                            }

                            var versions = [{
                                "selectId": "",
                                "label": i18n.common_term_allOSversion_label,
                                "checked": true
                            }];

                            if (osType === "Other") {
                                versions.push(otherVersion);
                            } else {
                                for (var index in versionList) {
                                    if (versionList[index]) {
                                        var key = $scope.openstack ? versionList[index] : versionList[index].substr(0, versionList[index].lastIndexOf("_"));
                                        var version = {
                                            "selectId": key,
                                            "label": key
                                        };
                                        versions.push(version);
                                    }
                                }
                                if ($scope.openstack && osType === "") {
                                    versions.push(otherVersion);
                                }
                            }
                            return versions;
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

                    selectTemplate: function (index, templateId) {
                        //先清空已有数据
                        clearSelectedTemplate();

                        var dom = $(".ecs_vm_template_bk_color");
                        if (dom.length > 0) {
                            var i = 0;
                            dom.each(function () {
                                if (i === index) {
                                    $(this).addClass("ecs_vm_selected_template");
                                    $scope.selTemp.selectedId = templateId;
                                    $scope.selTemp.showTips = false;
                                }
                                i++;
                            });
                        }
                    },

                    nextBtn: {
                        "id": "ecsVmCreateNextBtn",
                        "text": i18n.common_term_next_button,
                        "tooltip": "",
                        "click": function () {
                            //校验是否选择
                            var seldom = $(".ecs_vm_selected_template");
                            if (seldom.length < 1) {
                                $scope.selTemp.showTips = true;
                                return false;
                            }

                            $scope.service.selTemplateId = $scope.selTemp.selectedId;
                            $scope.service.azId = searchModel.azid;

                            var templates = $scope.selTemp.templates.value;
                            for (var i = 0; i < templates.length; i++) {
                                var obj = templates[i];
                                if (obj.vmtId == $scope.service.selTemplateId) {
                                    $scope.service.selMinRam = obj.minRam;
                                    $scope.service.selMinDisk = obj.minDisk;
                                    break;
                                }
                            }

                            //跳到下一步
                            $scope.$emit($scope.events.selTemplateNext);
                            $scope.service.show = "specInfo";
                            $("#" + $scope.service.step.id).widget().next();
                        }
                    },

                    cancelBtn: {
                        "id": "ecsVmCreateCancelBtn",
                        "text": i18n.common_term_cancle_button,
                        "tooltip": "",
                        "click": function () {
                            setTimeout(function () {
                                $window.history.back();
                            }, 0);
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
                    $scope.selTemp.showTips = false;
                }

                // 查询虚拟机模板列表
                function queryTemplates() {
                    var options = {
                        "user": user,
                        "params": searchModel
                    };
                    var deferred = queryVmServiceIns.queryVmTemplates(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        //先清空已选数据
                        clearSelectedTemplate();

                        _.each(data.vmtemplates, function (item) {
                            item.type = item.vdcId > 1 ? i18n.org_term_VDCtemplate_label : i18n.template_term_sysTemplate_label;
                            if (!item.picture) {
                                item.picture = "../theme/default/images/vmTemplate/icon_vmtemplate_1.png";
                            }
                        });

                        $scope.selTemp.templates.value = data.vmtemplates;
                        $scope.selTemp.templates.total = data.totalNum;
                    });
                }

                //查询az列表
                function queryAzList(){
                    var promise = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, $scope.service.cloudInfraId);
                    promise.then(function (data) {
                        var azs = data && data.availableZones || [];
                        if (azs.length > 0) {
                            azs[0].checked = true;
                            searchModel.azid = azs[0].id;
                            $scope.selTemp.az.values = azs;
                            queryTemplates();
                        }
                    }, function (response) {
                        exception.doException(response);
                    });
                }
                // 从模板列表中，搜索指定模板
                function getSelectedTemplate(templateId) {
                    var selected = _.find($scope.selTemp.templates.value, function (item) {
                        return item.vmtId === templateId;
                    });
                    return selected || {};
                }

                // 查询初始化信息
                if ($scope.openstack) {
                    $scope.selTemp.osType.values.push(otherVersion);
                }
                $scope.selTemp.osVersion.values = $scope.selTemp.versionConfig.getVersionInfo("Linux");
                if ($scope.service.cloudInfraId) {
                    if($scope.openstack){
                        queryTemplates();
                    }
                    else{
                        queryAzList();
                    }
                }
            }
        ];
        return createVmSelTempCtrl;
    }
);
