/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-widgets/Window",
        "app/services/messageService",
        "app/services/cloudInfraService",
        "app/business/template/services/templateService",
        "tiny-directives/Table",
        "tiny-directives/Button",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Searchbox",
        "tiny-directives/RadioGroup",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "fixtures/tenantTemplateFixture"
    ],
    function ($, angular, _, $encoder, Window, messageService, cloudInfraService, templateService) {
        "use strict";
        var vmTemplateListCtrl = ["$rootScope", "$scope", "$compile", "$state", "$q", "camel", "exception", "storage",
            function ($rootScope, $scope, $compile, $state, $q, camel, exception, storage) {
                //查询资源池信息的服务实例
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var templateServiceIns = new templateService(exception, $q, camel);
                var user = $scope.user;
                var i18n = $scope.i18n;
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.openstack = (user.cloudType === "ICT");
                // 权限控制
                //虚拟机模板
                $scope.hasVmTemplateRight = _.contains(user.privilegeList, "316000");
                //虚拟机模板
                $scope.hasVmTemplateViewRight = _.contains(user.privilegeList, "316001");
                //虚拟机模板
                $scope.hasVmTemplateOperateRight = _.contains(user.privilegeList, "316002");


                //other类型
                var otherVersion = {
                    "selectId": "Other",
                    "label": "Other"
                };

                var tableShowDetail = false;
                //不同场景下显示的列
                var vmTableShowColumns = null;
                if (!$scope.openstack) {
                    tableShowDetail = true;
                    vmTableShowColumns = [{
                        "sTitle": "",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtId);
                        }
                    }, {
                        "sTitle": i18n.common_term_OStype_label,
                        "mData": "osType"
                    }, {
                        "sTitle": i18n.common_term_OSversion_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osVersion);
                        }
                    }, {
                        "sTitle": i18n.template_term_applyRange_label,
                        "mData": "vdcId"
                    }, {
                        "sTitle": i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.availableZoneName);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }];
                } else {
                    tableShowDetail = false;
                    vmTableShowColumns = [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtId);
                        }
                    }, {
                        "sTitle": i18n.common_term_OStype_label,
                        "mData": "osType"
                    }, {
                        "sTitle": i18n.common_term_OSversion_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osVersion);
                        }
                    }, {
                        "sTitle": i18n.template_term_applyRange_label,
                        "mData": "vdcId"
                    }, {
                        "sTitle": i18n.common_term_memMinMB_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.minRam);
                        }
                    }, {
                        "sTitle": i18n.common_term_diskMinGB_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.minDisk);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }];
                }

                //条件查询参数
                $scope.searchModel = {
                    name: "",
                    cloudInfraId: "",
                    ostype: "",
                    osversion: "",
                    start: page.getStart(),
                    limit: page.displayLength
                };

                //地域
                $scope.searchDomainType = {
                    "id": "searchDomainTypeId",
                    "width": "120",
                    "height": "200",
                    "values": [],
                    "change": function () {
                        $scope.searchModel.cloudInfraId = $("#searchDomainTypeId").widget().getSelectedId();
                        page.currentPage = 1;
                        queryTemplateList();
                        storage.add("cloudInfraId", $scope.searchModel.cloudInfraId);
                    }
                };

                //操作系统类型
                $scope.searchOSType = {
                    "id": "searchOSTypeId",
                    "width": "150",
                    "height": "200",
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
                        $scope.searchModel.ostype = $("#searchOSTypeId").widget().getSelectedId();
                        $scope.searchOSVersion.values = $scope.versionConfig.getVersionInfo($scope.searchModel.ostype);
                        $scope.searchModel.osversion = "";
                        page.currentPage = 1;
                        queryTemplateList();
                    }
                };

                //操作系统版本
                $scope.searchOSVersion = {
                    "id": "searchOSVersionId",
                    "dftLabel": i18n.common_term_allOSversion_label,
                    "width": "350",
                    "height": "300",
                    "values": [],
                    "change": function () {
                        $scope.searchModel.osversion = $("#searchOSVersionId").widget().getSelectedId();
                        page.currentPage = 1;
                        queryTemplateList();
                    }
                };

                //版本配置
                $scope.versionConfig = {
                    "it": {
                        "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                        "windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613"
                    },
                    "ict": {
                        "Linux": "CentOS 5.7 32bit;CentOS 5.7 64bit;CentOS 5.8 32bit;CentOS 5.8 64bit;CentOS 6.2 32bit;CentOS 6.2 64bit;CentOS 6.3 32bit;CentOS 6.3 64bit;DOPRA Linux V200R003C07SPC200 32bit;DOPRA Linux V200R003C07SPC200 64bit;EulerLinux V100R001C00 64bit;Novell SuSE Linux Enterprise Server 11 SP1 32bit;Novell SuSE Linux Enterprise Server 11 SP1 64bit;Novell SuSE Linux Enterprise Server 11 SP2 32bit;Novell SuSE Linux Enterprise Server 11 SP2 64bit;Novell SuSE Linux Enterprise Server 11 SP3 32bit;Novell SuSE Linux Enterprise Server 11 SP3 64bit;Red Hat Enterprise Linux 5.5 32bit;Red Hat Enterprise Linux 5.5 64bit;Red Hat Enterprise Linux 5.6 32bit;Red Hat Enterprise Linux 5.6 64bit;Red Hat Enterprise Linux 5.7 32bit;Red Hat Enterprise Linux 5.7 64bit;Red Hat Enterprise Linux 5.8 32bit;Red Hat Enterprise Linux 5.8 64bit;Red Hat Enterprise Linux 5.9 32bit;Red Hat Enterprise Linux 5.9 64bit;Red Hat Enterprise Linux 6.0 32bit;Red Hat Enterprise Linux 6.0 64bit;Red Hat Enterprise Linux 6.1 32bit;Red Hat Enterprise Linux 6.1 64bit;Red Hat Enterprise Linux 6.2 32bit;Red Hat Enterprise Linux 6.2 64bit;Red Hat Enterprise Linux 6.3 32bit;Red Hat Enterprise Linux 6.3 64bit;Red Hat Enterprise Linux 6.4 32bit;Red Hat Enterprise Linux 6.4 64bit;RTOS V100R002C00 64bit",
                        "windows": "Windows Server 2008 DataCenter R2 SP1 64bit;Windows Server 2008 Enterprise R2 SP1 64bit;Windows Server 2008 Enterprise R2 64bit;Windows Server 2012 64bit"
                    },
                    "getVersionInfo": function (osType) {
                        var versionWindowList = [];
                        var versionLinuxList = [];
                        var versionList = [];
                        if($scope.openstack) {
                            versionWindowList = $scope.versionConfig.ict.windows.split(";");
                            versionLinuxList = $scope.versionConfig.ict.Linux.split(";");
                        }
                        else {
                            versionWindowList = $scope.versionConfig.it.windows.split(";");
                            versionLinuxList = $scope.versionConfig.it.Linux.split(";");
                        }
                        if (osType === 'Windows') {
                            versionList = versionWindowList;
                        }
                        else if(osType === "Linux"){
                            versionList = versionLinuxList;
                        }
                        else {
                            versionList = versionWindowList.concat(versionLinuxList);
                        }
                        var versions = [{
                            "selectId": "",
                            "label": i18n.common_term_allOSversion_label,
                            "checked": true
                        }];

                        if (osType === "Other") {
                            versions.push(otherVersion);
                        } else {
                            var key = null;
                            var version = null;
                            _.each(versionList, function (item) {
                                key = $scope.openstack ? item : item.substr(0, item.lastIndexOf("_"));
                                version = {
                                    "selectId": key,
                                    "label": key
                                };
                                versions.push(version);
                            });
                            if ($scope.openstack && osType === "") {
                                versions.push(otherVersion);
                            }
                        }
                        return versions;
                    }
                };

                //搜索框
                $scope.searchBox = {
                    "id": "vmtSearchBoxId",
                    "placeholder": i18n.template_term_findVMtemplate_prom,
                    "type": "round",
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                        $scope.searchModel.name = content;
                        page.currentPage = 1;
                        queryTemplateList();
                    },
                    "search": function (searchString) {
                        $scope.searchModel.name = searchString;
                        page.currentPage = 1;
                        queryTemplateList();
                    }
                };

                //查询虚拟机模板列表
                function queryTemplateList() {
                    convertToVm();
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.searchModel.cloudInfraId,
                        "name": $scope.searchModel.name,
                        "ostype": $scope.searchModel.ostype,
                        "osversion": $scope.searchModel.osversion,
                        "limit": page.displayLength,
                        "start": page.getStart(),
                        "status": "FINISHED"
                    };
                    var promise = templateServiceIns.queryTemplateList(options);
                    promise.then(function (data) {
                        _.each(data.vmtemplates, function (item) {
                            item.judgeOrgId = item.vdcId;
                            if (!$scope.openstack) {
                                item.detail = {
                                    contentType: "url",
                                    content: "app/business/template/views/vmTemplate/vmTemplateDetail.html"
                                };
                                if (item.vdcId === "1") {
                                    item.vdcId = i18n.sys_term_sysConfig_label;
                                } else {
                                    item.vdcId = i18n.org_term_organization_label;
                                }
                            }else{
                                item.vdcId = i18n.sys_term_sysConfig_label;
                            }
                            $(".vmTemplate-detail").scope.exception = exception;
                            item.operation = "";
                        });
                        $scope.vmTableList.data = data.vmtemplates;
                        $scope.vmTableList.totalRecords = data.totalNum;
                        $scope.vmTableList.displayLength = page.displayLength;
                        $("#vmTemplateListId").widget().option("cur-page", {"pageIndex": page.currentPage});
                    });
                }
                //刷新
                $scope.refresh = {
                    "id": "commonScriptRefresh",
                    "click": function () {
                        $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                        queryTemplateList();
                    }
                };
                //帮助
                $scope.help = {
                    "id": "vmTemplateHelp",
                    "helpKey": "drawer_template_vm",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                $scope.vmTableList = {
                    "id": "vmTemplateListId",
                    "paginationStyle": "full_numbers",
                    "showDetails": tableShowDetail,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": vmTableShowColumns,
                    "data": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryTemplateList();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryTemplateList();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var vmtId = aData.vmtId;
                        if (!$scope.openstack) {
                            //下钻时传递参数
                            $("td:eq(0)", nRow).bind("click", function () {
                                $scope.currentVMTId = vmtId;
                            });
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(4)", nRow).addTitle();
                        } else {
                            $("td:eq(0)", nRow).addTitle();
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                        }

                        if (!$scope.hasVmTemplateOperateRight) {
                            return;
                        }
                        var optScope = $scope.$new(false);
                        optScope.vmtId = vmtId;
                        optScope.createVm = function () {
                            $state.go("ecsVmCreate.navigate", {
                                "cloudInfra": $scope.searchModel.cloudInfraId,
                                "vmtId": optScope.vmtId
                            });
                        };

                        // 操作栏
                        var optTemplates = "<div>";
                        if ($scope.deployMode !== 'serviceCenter') {
                            optTemplates = "<a href='javascript:void(0)' ng-click='createVm()'>" + i18n.vm_term_createVM_button + "</a>&nbsp;&nbsp;";
                        }

                        //判断当前可见范围是系统还是组织控制当前操作项权限  vdcId 值  1 系统 0 组织
                        if (aData.judgeOrgId !== "1" && $scope.openstack === false) {
                            optTemplates = optTemplates + "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton></div>";
                            optScope.id = "vmTemplateOptMore" + iDataIndex;
                            optScope.text = "<span class='btn-link'>" + i18n.common_term_more_button + "</span>";
                            optScope.content = [{
                                title: i18n.template_term_convertToVM_button,
                                id: "changeToVM",
                                click: function () {
                                    var options = {
                                        "user": user,
                                        "vmtId": optScope.vmtId,
                                        "cloudInfraId": $scope.searchModel.cloudInfraId
                                    };
                                    var promise = templateServiceIns.changeToVM(options);
                                    promise.then(function (data) {
                                        queryTemplateList();
                                    });
                                }
                            }, {
                                title: i18n.common_term_delete_button,
                                id: "templateDeleteId",
                                click: function () {
                                    var options = {
                                        "user": user,
                                        "vmTemplateId": optScope.vmtId,
                                        "cloudInfraId": $scope.searchModel.cloudInfraId
                                    };
                                    var promise = templateServiceIns.deleteVmTemplate(options);
                                    promise.then(function (data) {
                                        queryTemplateList();
                                    });
                                }
                            }];
                        }
                        var opts = $compile($(optTemplates));
                        var optNode = opts(optScope);
                        if ($scope.openstack) {
                            $("td:eq(7)", nRow).html(optNode);
                        } else {
                            $("td:eq(7)", nRow).html(optNode);
                        }
                        optNode.find('.dropdown').dropdown();
                    }
                };

                function convertToVm() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.searchModel.cloudInfraId
                    };
                    var promise = templateServiceIns.convertToVm(options);
                    promise.then(function (data) {});
                }
                //查询当前租户可见的地域列表
                function getLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras($rootScope.user.vdcId, $rootScope.user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            $scope.searchModel.cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                            $scope.searchDomainType.values = data.cloudInfras;
                            retDefer.resolve();
                        }
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue, "");
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                $scope.$on("$viewContentLoaded", function () {
                    //获取初始化信息
                    var promise = getLocations();
                    promise.then(function () {
                        if ($scope.openstack) {
                            $scope.searchOSType.values.push(otherVersion);
                            $("#" + $scope.searchOSType.id).widget().option("values", $scope.searchOSType.values);
                        }
                        $scope.searchOSVersion.values = $scope.versionConfig.getVersionInfo("Linux");
                        queryTemplateList();
                    });
                });
            }
        ];
        return vmTemplateListCtrl;
    });
