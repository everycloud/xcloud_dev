define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "fixtures/templateFixture"],
    function ($, angular, Window, Message, constants, templateFixture) {
        "use strict";

        var vmtListCtrl = ["$scope", "$compile", "$state","camel","exception", function ($scope, $compile, $state, camel, exception) {

            $scope.privilege = $("html").scope().user.privilege;

            $scope.searchModel = {
                name:"",
                virtualenvname:"",
                ostype:"",
                osversion:"",
                status:"",
                start: "0",
                limit: "10"
            };

            var confirmWindow = function(title, fn, id, extendParam) {
                var msgOptions = {
                    "type":"confirm", 
                    "title":$scope.i18n.common_term_confirm_label,
                    "content":title,
                    "width":"300",
                    "height":"200"
                };

                var msgBox = new Message(msgOptions);

                var buttons = [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        accessKey: 'Y',
                        majorBtn : true,
                        default: true,
                        handler: function (event) {
                            if (extendParam == undefined) {
                                fn(id);
                            } else {
                                fn(id, extendParam);
                            }
                            msgBox.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        accessKey: 'N',
                        default: false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }
                ];

                msgBox.option("buttons",buttons);

                msgBox.show();
            };

            var associateWindow = function (id, name) {
                var options = {
                    "winId": "associateWinID",
                    "vmtId":id,
                    "vmtName":name,
                    "title":$scope.i18n.resource_term_associateLogicVMtemplate_button,
                    "content-type": "url",
                    "content": "./app/business/resources/views/templateSpec/template/vmTemplate/action/associate.html",
                    "height": 560,
                    "width": 750,
                    "resizable": true,
                    "maximizable":false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.query();
                    }
                };

                var win = new Window(options);
                win.show();
            };

            var modifyWindow = function (id, name) {
                var options = {
                    "winId": "modifyWindowID",
                    "vmtId":id,
                    "vmtName":name,
                    "title":$scope.i18n.template_term_modifyVMinfo_button,
                    "content-type": "url",
                    "content": "./app/business/resources/views/templateSpec/template/vmTemplate/modify/vmTemplateModify.html",
                    "height": 500,
                    "width": 680,
                    "resizable": true,
                    "maximizable":false,
                    "buttons": null,
                    "close": function (event) {
                        $scope.operator.query();
                    }
                };

                var win = new Window(options);
                win.show();
            };

            $scope.vmtStatus = {
                "FAILED":$scope.i18n.common_term_createFail_value,
                "VMCREATING":$scope.i18n.common_term_creating_value,
                "PROCESSING":$scope.i18n.common_term_processing_value,
                "UNFINISHED":$scope.i18n.common_term_noComplete_value,
                "FINISHED":$scope.i18n.common_term_complete_label,
                "LOST":$scope.i18n.common_term_lose_value,
                "MODIFYFAILED":$scope.i18n.common_term_modifyFail_value,
                "EXCEPTION":$scope.i18n.common_term_abnormal_value,
                "DELETING":$scope.i18n.common_term_deleting_value,
                "DELETEFAILED":$scope.i18n.common_term_deleteFail_value
            };

            $scope.vmtStatusOperator = {
                "FAILED":["delete"],
                "VMCREATING":[],
                "PROCESSING":[],
                "UNFINISHED":["installSoftware","delete", "modifyVmtBaseInfo"],
                "FINISHED":["modifySoftware", "modifyVmtAttr", "modifyVmtBaseInfo","associate", "deAssociate", "convertToVM", "delete","createVm"],
                "LOST":["delete","deAssociate"],
                "MODIFYFAILED":["delete","modifySoftware","convertToVM"],
                "EXCEPTION":["delete","deAssociate"],
                "DELETING":[],
                "DELETEFAILED":["delete"]
            };

            $scope.vmtType = {
                "vapp_template":$scope.i18n.template_term_appVM_label,
                "desktop_template":$scope.i18n.template_term_deskVM_label,
                "vsa_template":$scope.i18n.template_term_VSA_label,
                "pvm_template":$scope.i18n.template_term_PVM_label
            };

            var addOperatorDom = function (dataItem, row) {
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a href="javascript:void(0)" ng-if="checkStatus('+"'modifySoftware'"+')" ng-click="modifySoftware()">'+$scope.i18n.template_term_modifyVMsoft_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="!checkStatus('+"'modifySoftware'"+')">'+$scope.i18n.template_term_modifyVMsoft_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="checkStatus('+"'installSoftware'"+')" ng-click="installSoftware()">'+$scope.i18n.common_term_installSoft_label+'</a></li>' +
                    '<li class="disabled"><a ng-if="!checkStatus('+"'installSoftware'"+')">'+$scope.i18n.common_term_installSoft_label+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="checkStatus('+"'modifyVmtAttr'"+')" ng-click="modifyVmtAttr()">'+$scope.i18n.template_term_modifyVMprop_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="!checkStatus('+"'modifyVmtAttr'"+')">'+$scope.i18n.template_term_modifyVMprop_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="data.vmLogicTemplateId =='+"null"+' && checkStatus('+"'modifyVmtBaseInfo'"+')" ng-click="modifyVmtBaseInfo()">'+$scope.i18n.template_term_modifyVMinfo_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.vmLogicTemplateId !='+"null"+' || !checkStatus('+"'modifyVmtBaseInfo'"+')">'+$scope.i18n.template_term_modifyVMinfo_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="data.vmLogicTemplateId ==='+"null"+' && checkStatus('+"'associate'"+')" ng-click="associate()">'+$scope.i18n.resource_term_associateLogicVMtemplate_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.vmLogicTemplateId !='+"null"+' || !checkStatus('+"'associate'"+')">'+$scope.i18n.resource_term_associateLogicVMtemplate_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="data.vmLogicTemplateId !='+"null"+' && checkStatus('+"'deAssociate'"+')" ng-click="deAssociate()">'+$scope.i18n.template_term_disassociateLogicVM_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="data.vmLogicTemplateId =='+"null"+' || !checkStatus('+"'deAssociate'"+')">'+$scope.i18n.template_term_disassociateLogicVM_button+'</a></li>' +
                    '<li class="divider-line"></li>' +
                    '<li><a href="javascript:void(0)" ng-if="checkStatus('+"'convertToVM'"+')" ng-click="convertToVM()">'+$scope.i18n.template_term_convertToVM_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="!checkStatus('+"'convertToVM'"+')">'+$scope.i18n.template_term_convertToVM_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-if="checkStatus('+"'delete'"+')" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                    '<li class="disabled"><a ng-if="!checkStatus('+"'delete'"+')">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                    '</ul>' +
                    '</span>';
                var optTemplates = '<a href="javascript:void(0)" ng-if="data.status=='+"'FINISHED'"+' && checkStatus('+"'createVm'"+')" ng-click="createVm()" style="padding-right:10px; width:auto">'+$scope.i18n.vm_term_createVM_button+'</a>' +
                                   '<span ng-if="data.status!='+"'FINISHED'"+'" style="padding-right:10px; width:auto; color:#999">'+$scope.i18n.vm_term_createVM_button+'</span>'+ submenus;

                var scope = $scope.$new(false);
                scope.data = dataItem;

                scope.checkStatus = function (opType) {
                    var opList = $scope.vmtStatusOperator[dataItem.status];

                    if ($.inArray(opType, opList) == -1) {
                        return false;
                    }

                    return true;
                };

                // 创建虚拟机模板
                scope.createVm = function () {
                    $state.go("resources.createVm", {"action":"create", "from":"resources.templateSpec.vmTemplateResources.vmTemplate", "tid":dataItem.vmtId});
                };

                // 导出
                scope.export = function() {
                    //
                };

                // 修改虚拟机模板软件
                scope.modifySoftware = function(){
                    confirmWindow($scope.i18n.template_vm_editSoft_info_confirm_msg, $scope.operator.convertToVM, dataItem.vmtId, false);
                };

                // 安装软件
                scope.installSoftware = function(){
                    $state.go("resources.createVmTemplate.navigation", {"vmtId":dataItem.vmtId,"startStep":"installSoftware"});
                };

                // 修改虚拟机模板属性
                scope.modifyVmtAttr = function () {
                    // 跳转到vm操作页
                    var idList = dataItem.vmtId.split(";");
                    var vmId = dataItem.vmtId;
                    if (idList.length >= 3) {
                        vmId = idList[2]+"$"+idList[1];
                    }
                    $state.go("resources.vmInfo.hardware.cpu", {"name": dataItem.vmtName, "from": $state.current.name, "vmId": vmId,"isTemplate":true});
                };

                // 修改虚拟机模板基本信息
                scope.modifyVmtBaseInfo = function () {
                    modifyWindow(dataItem.vmtId, dataItem.vmtName);
                };

                // 关联逻辑模板
                scope.associate = function () {
                    associateWindow(dataItem.vmtId, dataItem.vmtName);
                };

                // 取消关联逻辑模板
                scope.deAssociate = function () {
                    confirmWindow($scope.i18n.template_vm_disassociateLogic_info_confirm_msg, $scope.operator.deAssociate, dataItem.vmtId, dataItem.vmLogicTemplateId);
                };

                // 转化虚拟机
                scope.convertToVM = function () {
                    confirmWindow($scope.i18n.template_vm_convertToVM_info_confirm_msg, $scope.operator.convertToVM, dataItem.vmtId, true);
                };

                // 删除
                scope.delete = function () {
                    confirmWindow($scope.i18n.template_vm_del_info_confirm_msg, $scope.operator.delete, dataItem.vmtId);
                };

                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(7)", row).html(optDom);
                optDom.filter('.dropdown').dropdown();
            };

            $scope.vmTemplateTable = {
                caption: "",
                data: [],
                id: "vmTemplateTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: true,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "28"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        }
                    },
                    {
                        "sTitle": "ID",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vmtId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OS_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.osType);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.virtualizedEnvironment);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "bVisible":$scope.privilege.role_role_add_option_vmTemplateHandle_value,
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmTemplateTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmTemplateTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.vmTemplateTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $("td:eq(0)", row).bind("click", function () {
                        $scope.currentItem = dataitem;
                    });

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();
                    $("td:eq(3)", row).html($scope.vmtType[dataitem.type]);

                    $("td:eq(5)", row).addTitle();
                    $("td:eq(6)", row).html($scope.vmtStatus[dataitem.status]);

                    // 添加操作
                    if ($scope.privilege.role_role_add_option_vmTemplateHandle_value) {
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.refresh = {
                id: "vmtRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                click: function () {
                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};

                    var fuzzyType = $("#"+$scope.searchFuzzy.id).widget().getSelectedId();
                    var name = $("#"+$scope.searchBox.id).widget().getValue();
                    if (fuzzyType == 'name') {
                        $scope.searchModel.name = name;
                        $scope.searchModel.virtualenvname = "";
                    } else {
                        $scope.searchModel.name = "";
                        $scope.searchModel.virtualenvname = name;
                    }
                    $scope.operator.query();
                }
            };

            $scope.create = {
                id: "vmtCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button,
                tip: "",
                create: function () {
                    "use strict";
                    $state.go("resources.createVmTemplate.navigation", {"vmtId":"","startStep":"baseInfo"});
                }
            };
            $scope.discover = {
                id: "vmtDiscover_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_discover_button,
                tip: "",
                discover: function () {
                    "use strict";
                    var options = {
                        "winId": "discoverWinID",
                        "title":$scope.i18n.template_term_discoverVMtemplate_button,
                        "content-type": "url",
                        "content": "./app/business/resources/views/templateSpec/template/vmTemplate/action/discover.html",
                        "height": 165,
                        "width": 344,
                        "resizable": true,
                        "maximizable":false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.query();
                        }
                    };

                    var win = new Window(options);
                    win.show();
                }
            };

            $scope.searchOSType = {
                "id": "searchOSType",
                "width": "150",
                "values": [
                    {
                        "selectId": "",
                        "label": $scope.i18n.common_term_allOStype_label,
                        "checked" : true
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
                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.ostype = $("#searchOSType").widget().getSelectedId();
                    $scope.searchOSVersion.values = $scope.versionConfig.getVersionInfo( $scope.searchModel.ostype);
                    $scope.searchModel.osversion = "";
                    $scope.operator.query();
                }
            };

            $scope.searchOSVersion = {
                "id": "searchOSVersion",
                "width": "150",
                "height": "300",
                "values": [],
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.osversion = $("#searchOSVersion").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.searchStatus = {
                "id": "searchStatus",
                "width": "100",
                "values": [
                    {
                        "selectId": "",
                        "label": $scope.i18n.common_term_allStatus_value,
                        "checked" : true
                    },
                    {
                        "selectId": "FINISHED",
                        "label": $scope.i18n.common_term_complete_label
                    },
                    {
                        "selectId": "UNFINISHED",
                        "label": $scope.i18n.common_term_noComplete_value
                    },
                    {
                        "selectId": "VMCREATING",
                        "label": $scope.i18n.common_term_creating_value
                    },
                    {
                        "selectId": "FAILED",
                        "label": $scope.i18n.common_term_createFail_value
                    },
                    {
                        "selectId": "MODIFYFAILED",
                        "label": $scope.i18n.common_term_modifyFail_value
                    },
                    {
                        "selectId": "DELETING",
                        "label": $scope.i18n.common_term_deleting_value
                    },
                    {
                        "selectId": "DELETEFAILED",
                        "label": $scope.i18n.common_term_deleteFail_value
                    },
                    {
                        "selectId": "LOST",
                        "label": $scope.i18n.common_term_lose_value
                    },
                    {
                        "selectId": "EXCEPTION",
                        "label": $scope.i18n.common_term_abnormal_value
                    }
                ],
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.status = $("#searchStatus").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.searchFuzzy = {
                "id": "searchFuzzy",
                "width": "100",
                "values": [
                    {
                        "selectId": "name",
                        "label": $scope.i18n.template_term_vms_label,
                        "checked" : true
                    },
                    {
                        "selectId": "hypervisor",
                        "label": $scope.i18n.virtual_term_hypervisor_label
                    }
                ],
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};

                    var fuzzyType = $("#"+$scope.searchFuzzy.id).widget().getSelectedId();
                    if (fuzzyType == 'name') {
                        $scope.searchModel.name = "";
                        $scope.searchModel.virtualenvname = "";
                        $("#" + $scope.searchBox.id).widget().option("placeholder", $scope.i18n.template_term_findVMtemplate_prom);
                    } else {
                        $scope.searchModel.name = "";
                        $scope.searchModel.virtualenvname = "";
                        $("#" + $scope.searchBox.id).widget().option("placeholder", $scope.i18n.virtual_term_findHyper_prom ||"请输入虚拟化环境名称");
                    }

                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "vmtSearchBox",
                "placeholder": $scope.i18n.template_term_findVMtemplate_prom,
                "type":"round", 
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    var fuzzyType = $("#"+$scope.searchFuzzy.id).widget().getSelectedId();
                    if (fuzzyType == 'name') {
                        $scope.searchModel.name = searchString;
                        $scope.searchModel.virtualenvname = "";
                    } else {
                        $scope.searchModel.name = "";
                        $scope.searchModel.virtualenvname = searchString;
                    }

                    $scope.searchModel.start = 0;
                    $scope.vmTemplateTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.ostype = $("#searchOSType").widget().getSelectedId();
                    $scope.searchModel.osversion = $("#searchOSVersion").widget().getSelectedId();
                    $scope.searchModel.status = $("#searchStatus").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.versionConfig = {
                "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                "windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613;Windows Server 2012 R2 Standard 64bit_614;Windows Server 2012 R2 Datacenter 64bit_615",
                "getVersionInfo": function (osType) {
                    var versionList = [];
                    if (osType === 'Windows') {
                        versionList = $scope.versionConfig.windows.split(";");
                    } else {
                        versionList = $scope.versionConfig.Linux.split(";");
                    }

                    var versions = [{"selectId":"", "label":$scope.i18n.common_term_allOSversion_label, "checked":true}];
                    for (var index in versionList) {
                        var key = versionList[index].substr(0, versionList[index].lastIndexOf("_"));
                        var version = {
                            "selectId":key,
                            "label":key
                        };

                        versions.push(version);
                    }

                    return versions;
                }
            };

            // 存储当前点击展开的详情
            $scope.currentItem = undefined;

            var gotoTaskCenter = function() {
                var options = {
                    "type": "confirm",
                    "title":$scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.task_view_task_info_confirm_msg,
                    "width": "360px",
                    "height": "200px"
                };

                var msgBox = new Message(options);
                var buttons = [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        accessKey: 'Y',
                        majorBtn : true,
                        default: true,
                        handler: function (event) {
                            var $state = $("html").injector().get("$state");
                            $state.go("system.taskCenter", {});
                            msgBox.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        accessKey: 'N',
                        default: false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }
                ];
                msgBox.option("buttons", buttons);
                msgBox.show();
            };

            $scope.operator = {
                "query": function () {
                    // 发现模板
                    var sync = {
                        "associate": null,
                        "disassociate": null,
                        "lock": null,
                        "unlock": null,
                        "convertToVM": null,
                        "convertToVMTemplate": null,
                        "synchron":
                        {
                            "userId": null
                        },
                        "importt": null
                    };
                    camel.post({
                        "url": {"s":constants.rest.VM_TEMPLATE_SYNC.url,"o":{"tenant_id":1,"id":"id"}},
                        "params": JSON.stringify(sync),
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                        }
                    });

                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s":constants.rest.VM_TEMPLATE_QUERY.url,"o":{"tenant_id":1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            // 详情配置
                            for (var index in data.vmtemplates) {
                                data.vmtemplates[index].detail = {
                                    contentType: "url", 
                                    content: "app/business/resources/views/templateSpec/template/vmTemplate/vmTemplateDetail.html"
                                }
                            }

                            // 获取数据
                            $scope.vmTemplateTable.data = data.vmtemplates;
                            $scope.vmTemplateTable.totalRecords = data.totalNum;
                        });
                    });

                    $scope.searchModel.start = start;
                },
                "delete": function (id) {

                    var deferred = camel.delete({
                        "url": {"s": constants.rest.VM_TEMPLATE_DELETE.url, "o": {"tenant_id": 1, "id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.searchModel.start = 0;
                        $scope.vmTemplateTable.curPage = {"pageIndex": 1};
                        // 刷新页面
                        $scope.operator.query();

                        gotoTaskCenter();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "deAssociate":function(id, vmLogicTemplateId) {

                    var params = {
                        "associate": null,
                        "disassociate": {"vmtemplateId": id, "vmLogicTemplateId": vmLogicTemplateId},
                        "lock": null,
                        "unlock": null,
                        "convertToVM": null,
                        "convertToVMTemplate": null,
                        "synchron":null,
                        "importt": null
                    };

                    var deferred = camel.post({
                        "url": {"s": constants.rest.VM_TEMPLATE_DEASSOCIATE.url, "o": {"tenant_id": 1, "id": id}},
                        "params": JSON.stringify(params),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });

                    deferred.success(function (data) {
                        // 刷新页面
                        $scope.operator.query();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "convertToCommon":function(id) {
                    var deferred = camel.get({
                        "url": constants.rest.VM_TEMPLATE_CONVERT_COMMON.url,
                        "params": {"id": id},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新页面
                        $scope.operator.query();
                    });
                },
                "convertToGlobal":function(id) {
                    var deferred = camel.get({
                        "url": constants.rest.VM_TEMPLATE_CONVERT_GLOBAL.url,
                        "params": {"id": id},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新页面
                        $scope.operator.query();
                    });
                },
                "convertToVM":function(id, isDeleteVMTInfo) {
                    var sync = {
                        "associate": null,
                        "disassociate": null,
                        "lock": null,
                        "unlock": null,
                        "convertToVM": {"vmTemplateId":id,"isDeleteVMTInfo":isDeleteVMTInfo},
                        "convertToVMTemplate": null,
                        "synchron":null,
                        "importt": null
                    };
                    var deferred = camel.post({
                        "url": {"s": constants.rest.VM_TEMPLATE_CONVERT_VM.url, "o": {"tenant_id": 1, "id":id}},
                        "params": JSON.stringify(sync),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新页面
                        $scope.operator.query();

                        gotoTaskCenter();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            $scope.init = function() {
                // 打开时请求数据
                $scope.operator.query();
                $scope.searchOSVersion.values = $scope.versionConfig.getVersionInfo("Linux");
            };

            $scope.init();
        }];

        return vmtListCtrl;
    });
