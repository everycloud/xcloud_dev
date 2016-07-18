/**
 * 应用模板管理
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    'app/business/resources/controllers/constants',
    'fixtures/appFixture'
], function ($, angular, Layout, Message, Window, constants,templateFixture) {
    "use strict";

    var appTemplateTable = ["$scope", "$state", "$compile", "camel","exception", function ($scope, $state, $compile, camel, exception) {

        $scope.user = $("html").scope().user;
        /**
         * 部署场景
         * @type {undefined}
         */
        $scope.openstack = ($scope.user.cloudType === "OPENSTACK" ? true : false);

        $scope.hasOperateRight = $scope.user.cloudType == "OPENSTACK" || $scope.user.privilege["role_role_add_option_appTemplateHandle_value.312002"];

        /**
         * 搜索model
         * @type {{visibility: string, status: string, name: string, limit: number, start: number}}
         */
        $scope.searchModel = {
            "visible": "",
            "status": "",
            "name": "",
            "limit": 10,
            "start": 0
        };

        /**
         * 删除确认
         * @param id
         */
        var deleteConfirm = function (id) {
            var msgOptions = {
                "type":"confirm", //prompt,confirm,warn,error
                "title":$scope.i18n.common_term_confirm_label || "确认",
                "content":$scope.i18n.template_app_del_info_confirm_msg||"确实要删除该应用模板？",
                "width":"300",
                "height":"200"
            };

            var msgBox = new Message(msgOptions);

            var buttons = [
                {
                    label: $scope.i18n.common_term_ok_button|| '确定',
                    accessKey: 'Y',
                    default: true,//默认焦点
                    majorBtn : true,
                    handler: function (event) {//点击回调函数
                        $scope.operator.delete(id);
                        msgBox.destroy();
                    }
                },
                {
                    label: $scope.i18n.common_term_cancle_button || '取消',
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

        /**
         * 初始化虚拟机模拟板Table
         * @param dataItem
         * @param row
         */
        var addOperatorDom = function (dataItem, row) {

            var optTemplates = "";
            if ($scope.hasOperateRight) {
                if (dataItem.vdcId == "all") {
                    var submenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a href="javascript:void(0)" ng-if="data.status != '+"'Draft'"+'" ng-click="copy()">'+$scope.i18n.common_term_copy_button+'</a></li>' +
                        '<li><a href="javascript:void(0)" ng-if="data.status == '+"'Draft'"+'" ng-click="modify()">'+$scope.i18n.common_term_modify_button+'</a></li>' +
                        '<li><a href="javascript:void(0)" ng-if="data.status != '+"'Draft'"+'" ng-click="export()">'+$scope.i18n.common_term_export_button+'</a></li>' +
                        '<li><a href="javascript:void(0)" ng-if="data.status != '+"'Draft'"+'" ng-click="showTemplateBody()">'+$scope.i18n.alarm_term_checkTemplateContent_button+'</a></li>' +
                        '<li class="divider-line"></li>' +
                        '<li><a href="javascript:void(0)" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                        '</ul>' +
                        '</span>';

                    if (dataItem.status == "Draft") {
                        optTemplates = "<a href='javascript:void(0)' ng-click='publish()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_publish_button+"</a>" + submenus;
                    } else {
                        optTemplates = "<a href='javascript:void(0)' ng-click='unpublish()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_canclePublish_button+"</a>" + submenus;
                    }
                } else {
                    optTemplates = "<a href='javascript:void(0)' ng-click='delete()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_delete_button+"</a>";
                }

            } else {
                if (dataItem.vdcId == "all") {
                    optTemplates = "<a href='javascript:void(0)' ng-if='data.status != "+'"Draft"'+"' ng-click='showTemplateBody()' style='width:auto'>"+$scope.i18n.alarm_term_checkTemplateContent_button+"</a>";
                }
            }



            var scope = $scope.$new(false);
            scope.data = dataItem;
            scope.publish = function () {
                $scope.operator.public(dataItem.id, true);
            };
            scope.unpublish = function () {
                $scope.operator.public(dataItem.id, false);
            };
            scope.delete = function () {
                deleteConfirm(dataItem.id);
            };
            scope.copy = function () {
                $scope.operator.copy(dataItem.id);
            };
            scope.modify = function () {
                $scope.operator.modify(dataItem.id);
            };
            scope.export = function () {
                $scope.operator.export(dataItem.id, dataItem.name);
            };

            scope.showTemplateBody = function () {
                var options = {
                    "winId": "app-templateList-templateContent-winId",
                    "templateId": dataItem.id,
                    "title": $scope.i18n.alarm_term_checkTemplateContent_button || "查看模板内容",
                    "width": "840px",
                    "height": "700px",
                    "content-type": "url",
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "content": "app/business/multiPool/views/appTemplate/TemplateContent.html",
                    "buttons": null,
                    "close": function(){
                    }
                };
                var win = new Window(options);
                win.show();
            };

            var optDom = $compile($(optTemplates))(scope);
            $("td:eq(5)", row).html(optDom);
            optDom.filter('.dropdown').dropdown();

            // 初始化详情
            if (!$scope.openstack && dataItem.vdcId == "all") {
                var appTemplateName = "<a href='javascript:void(0)' ng-click='goToDetail()'>"+$.encoder.encodeForHTML(dataItem.name)+"</a>";
                var appTemplateNameLink = $compile(appTemplateName);
                var appTemplateNameScope = $scope.$new();
                appTemplateNameScope.name = dataItem.name;
                appTemplateNameScope.id = dataItem.id;
                appTemplateNameScope.goToDetail = function () {
                    $state.go("service.design.navigation", {"id": dataItem.id, "mode": "view"});
                };
                var appTemplateNameNode = appTemplateNameLink(appTemplateNameScope);
                $("td:eq(0)", row).html(appTemplateNameNode);
            }

            if (dataItem.status == "Draft") {
                $("td:eq(2)", row).html($scope.i18n.app_term_draft_label || "草稿");
            } else {
                $("td:eq(2)", row).html($scope.i18n.common_term_published_value || "发布");
            }
        };

        $scope.appTemplateTable = {
            caption: "",
            data: [],
            id: "appTemplateTableId",
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
            showDetails: false,
            columns: [
                {
                    "sTitle": $scope.i18n.common_term_name_label || "名称",//设置第一列的标题
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "20%"
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false,
                    "sWidth": "20%"
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label || "状态",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "sWidth": "10%"
                },
                {
                    "sTitle": $scope.i18n.template_term_applyRange_label || "可见范围",
                    "mData": function(data) {
                        if (data.vdcId == "all") {
                            return $.encoder.encodeForHTML($scope.i18n.common_term_system_label || "系统");
                        } else {
                            return "VDC";
                        }
                    },
                    "sWidth": "10%"
                },
                {
                    "sTitle": $scope.i18n.common_term_desc_label || "描述",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false,
                    "sWidth": "20%"
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label || "操作",
                    "bSortable": false,
                    "sWidth": "20%"
                }
            ],
            callback: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.appTemplateTable.curPage.pageIndex = eveObj.currentPage;
            },
            changeSelect: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.appTemplateTable.curPage.pageIndex = eveObj.currentPage;
                $scope.appTemplateTable.displayLength = eveObj.displayLength;
            },
            renderRow: function (row, dataitem, index) {
                // 添加操作
                addOperatorDom(dataitem, row);
                $("td:eq(0)", row).addTitle();
                $("td:eq(1)", row).addTitle();
                $("td:eq(4)", row).addTitle();
            }
        };

        var createOrUpdateTemplate = function (opt,params,id) {
            var options = {
                "winId": "app-templateList-createTemplate-winId",
                "templateId":"createTemplate",
                "appId":id,
                "opt":opt,
                "param":params,
                "exception":exception,
                "fromFlag": "1",  //表示从模板列表,"2"表示从概览弹出
                "title": $scope.i18n.app_term_createTemplate_button || "创建应用模板",
                "width": "1000px",
                "height": "750px",
                "content-type": "url",
                "resizable": true,
                "maximizable":false,
                "minimizable": false,
                "content": "app/business/multiPool/views/appTemplate/createTemplate.html",
                "buttons": null,
                "close": function(){
                    $scope.operator.query();
                }
            };

            if ("create" == opt) {
                options.title = $scope.i18n.app_term_createTemplate_button  || "创建应用模板";
            } else {
                options.title = $scope.i18n.app_term_modifyTemplate_button || "修改模板";
            }
            var win = new Window(options);
            win.show();
        };

        $scope.createBtn = {
            "id": "appTemplateListCreateId",
            "text": $scope.i18n.common_term_create_button || "创建",
            "tooltip": "",
            "disable": false,
            "click": function () {
                if (!$scope.openstack) {
                    //IT场景
                    $state.go("service.design.navigation", {"mode": "create"});
                }
                else {
                    createOrUpdateTemplate("create",null);
                }
            }
        };

        $scope.importBtn = {
            "id": "appTemplateListImportId",
            "text": $scope.i18n.common_term_import_button || "导入",
            "tooltip": "",
            "disable": false,
            "click": function () {
                $state.go("service.importTemplate.navigation");
            }
        };

        $scope.visibility = {
            "id": "appTemplateListVisibility",
            "values": [
                {
                    "selectId": "",
                    "label": $scope.i18n.common_term_allApplyRange_label || "所有可见范围",
                    "checked": true
                },
                {
                    "selectId": "SystemVisible",
                    "label": $scope.i18n.common_term_system_label || "系统"
                },
                {
                    "selectId": "OrgVisible",
                    "label": "VDC"
                }
            ],
            "change":function(){
                $scope.searchModel.visible = ($("#"+$scope.visibility.id).widget() && $("#"+$scope.visibility.id).widget().getSelectedId()) || "";
                $scope.operator.query();
            }
        };

        $scope.status = {
            "id": "appTemplateListStatus",
            "values":[{
                "selectId": "",
                "label": $scope.i18n.common_term_allStatus_value || "所有状态",
                "checked": true
            },{
                "selectId": "Draft",
                "label": $scope.i18n.app_term_draft_label || "草稿"
            },{
                "selectId": "Published",
                "label": $scope.i18n.common_term_published_value || "已发布"
            }],
            "change": function(){
                $scope.searchModel.status = ($("#"+$scope.status.id).widget() && $("#"+$scope.status.id).widget().getSelectedId()) || "";
                $scope.operator.query();
            }
        };

        $scope.searchBox = {
            "id": "appTemplateListSearchId",
            "placeholder":$scope.i18n.app_term_findAppTemplateName_prom,
            "width":"255",
            "suggestSize":10,
            "maxLength":256,
            "suggest":function(content){
            },
            "search":function(searchString){
                $scope.searchModel.start = 0;
                $scope.searchModel.name = searchString;
                $scope.searchModel.visible = ($("#"+$scope.visibility.id).widget() && $("#"+$scope.visibility.id).widget().getSelectedId()) || "";
                $scope.searchModel.status = ($("#"+$scope.status.id).widget() && $("#"+$scope.status.id).widget().getSelectedId()) || "";
                $scope.operator.query();
            }
        };

        $scope.refresh = {
            "id": "appTemplateListRefreshId",
            "title": $scope.i18n.common_term_fresh_button,
            "click": function(){
                $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                $scope.operator.query();
            }
        };

        $scope.operator = {
            "query": function () {
                // 统一转换start
                var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/{tenant_id}/apptemplates", "o": {tenant_id: "all"}},
                    "params": $scope.searchModel,
                    "userId": $scope.user.id
                });

                deferred.success(function(data){
                    $scope.$apply(function(){
                        $scope.appTemplateTable.data = data.appTemplates;
                        $scope.appTemplateTable.totalRecords = data.total;
                    });
                });
                deferred.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });

                $scope.searchModel.start = start;
            },
            "delete": function (id) {
                var defered = camel.delete({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}",
                        "o": {"tenant_id": "all", "id": id}
                    },
                    "userId": $scope.user.id,
                    "params":{}
                });
                defered.success(function(data){
                    $scope.operator.query();
                });
                defered.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });
            },
            "export":function (id, name) {
                var deferred = camel.get({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/files",
                        "o": {
                            "tenant_id": "all",
                            "id": id
                        }
                    },
                    "userId": $scope.user.id,
                    "params": {}
                });

                deferred.success(function(data){
                    if (!data){
                        return;
                    }

                    var exportResultData = {
                        "progress": "100%",
                        "path": data.filePath,
                        "name": name
                    };
                    var options = {
                        "winId": "app-templateList-export-winId",
                        "exportResultData": exportResultData,
                        "title": $scope.i18n.app_term_exportTemplate_button || "导出模板",
                        "width": "600px",
                        "height": "450px",
                        "content-type": "url",
                        "resizable": true,
                        "maximizable":false,
                        "minimizable": false,
                        "content": "app/business/multiPool/views/appTemplate/templateExport.html",
                        "buttons": null,
                        "close": function(){
                        }
                    };
                    var win = new Window(options);
                    win.show();
                });
                deferred.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });
            },
            "copy":function(id) {
                var options = {
                    "winId": "app-templateList-copyTemplate-winId",
                    "templateId": id,
                    "title": $scope.i18n.common_term_copy_button || "复制",
                    "width": "640px",
                    "height": "480px",
                    "content-type": "url",
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "content": "app/business/multiPool/views/appTemplate/copyTemplate.html",
                    "buttons": null,
                    "close": function(){
                        $scope.operator.query();
                    }
                };
                var win = new Window(options);
                win.show();
            },
            "modify": function (id) {
                if ($scope.openstack) {
                    //查询模板详情
                    var defered = camel.get({
                        "url": {
                            "s": " /goku/rest/v1.5/{tenant_id}/apptemplates/{id}/contents",
                            "o": {"tenant_id": "all", "id": id}
                        },
                        "userId": $scope.user.id
                    });

                    defered.success(function (data) {
                        if (data && data.body && (data.body != "")) {
                            data.body = $.base64.decode(data.body, true);
                        }
                        createOrUpdateTemplate("modify", data, id)
                    });
                    defered.fail(function (data) {
                        if (!exception.isException(data)) {
                            exception.doFaultPopUp();
                            return;
                        }
                        exception.doException(data);
                    });

                    return;
                }

                $state.go("service.design.navigation", {"id": id, "mode": "modify"});
            },
            "public":function (id, published) {

                var defered = camel.post({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/actions",
                        "o": {"tenant_id": "all", "id": id}
                    },
                    "userId": $scope.user.id,
                    "params":JSON.stringify({
                        "publish":{ "status": (published ? 'Published' : 'Draft') }
                    })
                });

                defered.success(function(data){
                    $scope.operator.query();
                });
                defered.fail(function(data){
                    if (!exception.isException(data)){
                        exception.doFaultPopUp();
                        return;
                    }
                    exception.doException(data);
                });
            }
        };


        $scope.init = function () {

            $scope.user = $("html").scope().user;
            $scope.openstack = ($scope.user.cloudType === "OPENSTACK" ? true : false);

            // 打开时请求数据
            $scope.operator.query();
        };

        /**
         * 初始化操作
         */
        $scope.init();
    }];
    return appTemplateTable;
});
