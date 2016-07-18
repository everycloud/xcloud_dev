define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    'tiny-widgets/Message',
    'tiny-widgets/Window',
    'app/business/resources/controllers/constants',"fixtures/hypervisorFixture"],
    function ($, angular, Layout, Message, Window, constants) {
    "use strict";

    var logicTemplateCtrl = ["$scope", "$state", "$compile", "camel", "exception", function ($scope, $state, $compile, camel, exception) {

        $scope.privilege = $("html").scope().user.privilege;

        $scope.searchModel = {
            name:"",
            status:"",
            start: "0",
            limit: "10"
        };
        var createWindow = function (action, vmtID) {
            var options = {
                "winId": "createLogicVmTemplateWinID",
                "title": "",
                "content-type": "url",
                "content": "./app/business/resources/views/templateSpec/template/logicVmTemplate/createLogicVmt.html",
                "height": 470,
                "width": 800,
                "resizable": true,
                "minimizable": false,
                "maximizable":false,
                "buttons": null,
                "close": function (event) {
                    $scope.operator.query();
                }
            };

            if (action === 'create') {
                options.title = $scope.i18n.template_term_createVMlogic_button;
            } else {
                options.title = $scope.i18n.template_term_modifyLogic_button;
            }

            options.action = action;
            options.vmtID = vmtID;

            return new Window(options);
        };

        var confirmWindow = function(content, fn, id) {
            var msgOptions = {
                "type":"confirm", 
                "title":$scope.i18n.common_term_confirm_label,
                "content":content,
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
                        fn(id);
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

        var showDetail = function(id) {
            var options = {
                "winId": "logicVmtShowDetailWinID",
                "templateID":id,
                "title":$scope.i18n.template_term_vmLogic_label,
                "content-type": "url",
                "content": "./app/business/resources/views/templateSpec/template/logicVmTemplate/logicVmtDetail.html",
                "height": 500,
                "width": 800,
                "resizable": true,
                "maximizable":false,
                "minimizable":false,
                "buttons": null,
                "close": function (event) {
                    //
                }
            };

            var win = new Window(options);
            win.show();
        };

        var addOperatorDom = function (dataItem, row) {
            var optTemplates = "";

            if (dataItem.vmLogicTemplateStatus == "inactive") {
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a href="javascript:void(0)" ng-click="inactive()" ng-if="data.vmLogicTemplateStatus ===' + "'active'" + '">'+$scope.i18n.common_term_disactivate_button+'</a></li>' +
                    '<li><a href="javascript:void(0)" ng-click="active()" ng-if="data.vmLogicTemplateStatus ===' + "'inactive'" + '">'+$scope.i18n.common_term_activate_button+'</a></li>' +
                    '<li class="divider-line"></li>' +
                    '<li><a href="javascript:void(0)" ng-click="delete()" ng-if="data.vmLogicTemplateStatus ===' + "'inactive'" + '">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                    '</ul>' +
                    '</span>';

                optTemplates = "<a href='javascript:void(0)' ng-click='modify()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_modify_button+"</a>" + submenus;
            } else {
                optTemplates = "<a href='javascript:void(0)' ng-click='inactive()'>"+$scope.i18n.common_term_disactivate_button+"</a>";
            }

            var scope = $scope.$new(false);
            scope.data = dataItem;
            scope.create = function () {
                $state.go("resources.createVm", {"action":"create", "from":"resources.templateSpec.vmTemplateResources.logicVmTemplate"});
            };
            scope.modify = function() {
                var win = createWindow("modify", dataItem.vmLogicTemplateID);
                win.show();
            };
            scope.delete = function () {
                confirmWindow($scope.i18n.template_vm_delLogic_info_confirm_msg, $scope.operator.delete, dataItem.vmLogicTemplateID);
            };
            scope.active = function () {
                confirmWindow($scope.i18n.template_vm_activateLogic_info_confirm_msg, $scope.operator.active, dataItem.vmLogicTemplateID);
            };
            scope.inactive = function () {
                confirmWindow($scope.i18n.template_vm_disactivateLogic_info_confirm_msg, $scope.operator.inactive, dataItem.vmLogicTemplateID);
            };

            var optDom = $compile($(optTemplates))(scope);
            $("td:eq(6)", row).html(optDom);
            optDom.filter('.dropdown').dropdown();
        };

        $scope.logicVmTemplateTable = {
            caption: "",
            data: [],
            id: "logicVmTemplateTableId",
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
            columns: [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vmLogicTemplateName);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vmLogicTemplateID);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": $scope.i18n.common_term_OS_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.osType);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": $scope.i18n.common_term_OSversion_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.osVersion);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": $scope.i18n.common_term_sysDiskSizeGB_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.systemDiskSize);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.vmLogicTemplateStatus);
                    },
                    "bSortable": false,
                    "sWidth": "10%"

                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "bVisible":$scope.privilege.role_role_add_option_vmLogicHandle_value,
                    "bSortable": false,
                    "sWidth": "13%"
                }
            ],
            callback: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.logicVmTemplateTable.curPage.pageIndex = eveObj.currentPage;
            },
            changeSelect: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.logicVmTemplateTable.curPage.pageIndex = eveObj.currentPage;
                $scope.logicVmTemplateTable.displayLength = eveObj.displayLength;
            },
            renderRow: function (row, dataitem, index) {
                // 添加操作
                if($scope.privilege.role_role_add_option_vmLogicHandle_value) {
                    addOperatorDom(dataitem, row);
                }

                // 初始化详情
                var name = "<a href='javascript:void(0)' ng-click='goToDetail()'>"+$.encoder.encodeForHTML(dataitem.vmLogicTemplateName)+"</a>";
                var nameLink = $compile(name);
                var nameScope = $scope.$new();
                nameScope.name = dataitem.vmLogicTemplateName;
                nameScope.id = dataitem.vmLogicTemplateID;
                nameScope.goToDetail = function () {
                    showDetail(dataitem.vmLogicTemplateID);
                };
                var nameNode = nameLink(nameScope);
                $("td:eq(0)", row).html(nameNode);

                // 增加tip属性
                $("td:eq(0)", row).addTitle();
                $("td:eq(1)", row).addTitle();
                $("td:eq(3)", row).addTitle();
                $("td:eq(5)", row).html($scope.status[dataitem.vmLogicTemplateStatus]);
            }
        };

        $scope.status = {
            "active":$scope.i18n.common_term_activate_value,
            "inactive":$scope.i18n.common_term_noActivation_value
        };

        $scope.refresh = {
            id: "vmtRefresh_id",
            disabled: false,
            iconsClass: "",
            text: $scope.i18n.common_term_fresh_button,
            tip: "",
            click: function () {
                $scope.searchModel.start = 0;
                $scope.logicVmTemplateTable.curPage = {"pageIndex": 1};
                $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
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
                var win = createWindow("create", undefined);
                win.show();
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
                    "selectId": "ACTIVE",
                    "label": $scope.i18n.common_term_activate_value
                },
                {
                    "selectId": "INACTIVE",
                    "label": $scope.i18n.common_term_noActivation_value
                }
            ],
            "change": function () {
                $scope.searchModel.start = 0;
                $scope.logicVmTemplateTable.curPage = {"pageIndex": 1};
                $scope.searchModel.status = $("#" + $scope.searchStatus.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        $scope.searchBox = {
            "id": "vmtSearchBox",
            "placeholder": $scope.i18n.template_term_findLogicTemplate_prom,
            "type":"round",
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                $scope.searchModel.start = 0;
                $scope.logicVmTemplateTable.curPage = {"pageIndex": 1};
                $scope.searchModel.name = searchString;
                $scope.searchModel.status = $("#" + $scope.searchStatus.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        $scope.operator = {
            "query": function () {
                // 统一转换start
                var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                var deferred = camel.get({
                    "url": {"s":constants.rest.LOGIC_TEMPLATE_QUERY.url,"o":{"tenant_id":1}},
                    "params": $scope.searchModel,
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {

                        // 获取数据
                        $scope.logicVmTemplateTable.data = data.vmLogicTemplates;
                        $scope.logicVmTemplateTable.totalRecords = data.total;
                    });
                });
                $scope.searchModel.start = start;
            },
            "delete": function (id) {
                var deferred = camel.delete({
                    "url": {"s":constants.rest.LOGIC_TEMPLATE_DELETE.url,"o":{"tenant_id": 1, "id": id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });

                deferred.success(function (data) {
                    $scope.searchModel.start = 0;
                    $scope.logicVmTemplateTable.curPage = {"pageIndex": 1};
                    // 刷新页面
                    $scope.operator.query();
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            },
            "active":function (id) {
                var deferred = camel.post({
                    "url": {"s":constants.rest.LOGIC_TEMPLATE_ACTIVE.url,"o":{"tenant_id": 1, "id": id}},
                    "params":JSON.stringify({"status":"ACTIVE"}),
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
            "inactive":function (id) {
                var deferred = camel.post({
                    "url": {"s":constants.rest.LOGIC_TEMPLATE_INACTIVE.url,"o":{"tenant_id": 1, "id": id}},
                    "params":JSON.stringify({"status":"INACTIVE"}),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });

                deferred.success(function (data) {
                    // 刷新页面
                    $scope.operator.query();
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            }
        };

        // 打开时请求数据
        $scope.operator.query();
    }];
    return logicTemplateCtrl;
});
