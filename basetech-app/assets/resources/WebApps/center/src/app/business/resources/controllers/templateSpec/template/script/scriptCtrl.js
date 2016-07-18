define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    'tiny-widgets/Message',
    'tiny-widgets/Window',
    'app/business/resources/controllers/constants',
    "fixtures/templateFixture"
], function ($, angular, Layout, Message, Window, constants) {
    "use strict";

    var scriptTable = ["$scope", "$state", "$compile", "camel", "exception", function ($scope, $state, $compile, camel, exception) {

        $scope.freeCapacity = "-";

        $scope.privilege = $("html").scope().user.privilege;

        $scope.searchModel = {
            name:"",
            ostype:"",
            start: "0",
            limit: "10"
        };

        /**
         * 删除确认
         *
         * @param id
         */
        var deleteConfirm = function (id) {
            var msgOptions = {
                "type":"confirm", //prompt,confirm,warn,error
                "title":$scope.i18n.common_term_confirm_label,
                "content":$scope.i18n.template_script_del_info_confirm_msg,
                "width":"300",
                "height":"200"
            };

            var msgBox = new Message(msgOptions);

            var buttons = [
                {
                    label: $scope.i18n.common_term_ok_button,
                    accessKey: 'Y',
                    majorBtn : true,
                    default: true,//默认焦点
                    handler: function (event) {//点击回调函数
                        $scope.operator.delete(id);
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

        /**
         * 查看使用情况
         *
         * @param id
         */
        var showUsageWindow = function(id) {
            var options = {
                "winId": "showUsageWinID",
                "title":$scope.i18n.template_term_appInfo_label,
                "scriptID": id,
                "content-type": "url",
                "content": "./app/business/resources/views/templateSpec/template/script/scriptUsage.html",
                "height": 560,
                "width": 750,
                "resizable": true,
                "maximizable":false,
                "minimizable": false,
                "buttons": null,
                "close": function (event) {
                }
            };

            var win = new Window(options);
            win.show();
        };

        /**
         * 初始化虚拟机模拟板Table
         * @param dataItem
         * @param row
         */
        var addOperatorDom = function (dataItem, row) {
            var optTemplates = "";

            if (dataItem.range != "0") {
                if ($scope.privilege.role_role_add_option_scriptHandle_value) {
                    optTemplates = "<a href='javascript:void(0)' ng-click='delete()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_delete_button+"</a>";
                }
            } else {
                if ($scope.privilege.role_role_add_option_scriptHandle_value) {
                    var submenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a href="javascript:void(0)" ng-click="modify()" >'+$scope.i18n.common_term_modify_button+'</a></li>' +
                        '<li><a href="javascript:void(0)" ng-click="showUsage()" >'+$scope.i18n.common_term_checkUsage_button+'</a></li>' +
                        '<li><a href="javascript:void(0)" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                        '</ul>' +
                        '</span>';

                    optTemplates = "<a href='javascript:void(0)' ng-if='scriptInstallRight' ng-click='patchInstall()' style='padding-right:10px; width:auto'>"+$scope.i18n.template_term_batchInstall_button+"</a>" + submenus;
                } else {
                    var submenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a href="javascript:void(0)" ng-click="showUsage()" >'+$scope.i18n.common_term_checkUsage_button+'</a></li>' +
                        '</ul>' +
                        '</span>';

                    optTemplates = "<a href='javascript:void(0)' ng-if='scriptInstallRight' ng-click='patchInstall()' style='padding-right:10px; width:auto'>"+$scope.i18n.template_term_batchInstall_button+"</a>" + submenus;
                }
            }
            var scope = $scope.$new(false);
            scope.data = dataItem;
            scope.scriptInstallRight = $scope.privilege.role_role_add_option_scriptInstall_value;
            scope.patchInstall = function () {
                $state.go("resources.distributeScript.navigation", {"id":dataItem.id});
            };
            scope.showUsage = function () {
                showUsageWindow(dataItem.id);
            };
            scope.modify = function() {
                var win = createWindow("modify", dataItem.id);
                win.show();
            };
            scope.delete = function () {
                deleteConfirm(dataItem.id);
            };

            var optDom = $compile($(optTemplates))(scope);
            $("td:eq(6)", row).html(optDom);
            optDom.filter('.dropdown').dropdown();

            // 可见范围
            if (dataItem.range == 0) {
                $("td:eq(5)", row).html($scope.i18n.common_term_system_label);
            } else {
                $("td:eq(5)", row).html("VDC");
            }

            // 状态
            if (dataItem.status == "Normal") {
                $("td:eq(3)", row).html($scope.i18n.common_term_natural_value);
            } else if($scope.privilege.role_role_add_option_scriptHandle_value && dataItem.range == "0") {
                var name = "<span style='padding-right: 10px;'>"+$scope.i18n.common_term_abnormal_value+"</span><a href='javascript:void(0)' ng-click='repair()'>"+$scope.i18n.common_term_restore_button+"</a>";
                var nameLink = $compile(name);
                var nameScope = $scope.$new();
                nameScope.name = dataItem.name;
                nameScope.repair = function () {
                    $state.go("resources.repairScript.navigation", {"id": dataItem.id});
                };
                var nameNode = nameLink(nameScope);
                $("td:eq(3)", row).html(nameNode);
            } else {
                $("td:eq(3)", row).html($scope.i18n.common_term_abnormal_value);
            }
        };

        /**
         * 添加script
         */
        var createWindow = function (action, id) {
            var options = {
                "winId": "addScriptWinID",
                "content-type": "url",
                "content": "./app/business/resources/views/templateSpec/template/script/addScript.html",
                "height": 560,
                "width": 750,
                "resizable": true,
                "maximizable":false,
                "buttons": null,
                "beforeClose":function() {
                    try {
                        var scope = $("#registScriptInfo").scope();
                        scope.clearTimer();
                    } catch(e) {
                    }

                },
                "close": function (event) {
                    $scope.searchModel.start = 0;
                    $scope.scriptTable.curPage = {"pageIndex": 1};
                    $scope.operator.query();
                }
            };

            options.action = action;
            if (action === 'add') {
                options.title = $scope.i18n.template_term_addScript_button;
            } else {
                options.scriptID = id;
                options.title = $scope.i18n.template_term_modifyScript_button;
            }

            return new Window(options);
        };

        $scope.scriptTable = {
            caption: "",
            data: [],
            id: "scriptTableId",
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
                    "sWidth": "30"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                },
                {
                    "sTitle": "ID",
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.template_term_suitOS_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.osType);
                    },
                    "bSortable": false

                },
                {
                    "sTitle": $scope.i18n.template_term_applyRange_label,
                    "mData": function(data) {
                        return $.encoder.encodeForHTML(data.range);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "bSortable": false,
                    "sWidth": "13%"
                }
            ],
            callback: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.scriptTable.curPage.pageIndex = eveObj.currentPage;
            },
            changeSelect: function (eveObj) {
                $scope.searchModel.start = eveObj.currentPage;
                $scope.searchModel.limit = eveObj.displayLength;
                $scope.operator.query();

                $scope.scriptTable.curPage.pageIndex = eveObj.currentPage;
                $scope.scriptTable.displayLength = eveObj.displayLength;
            },
            renderRow: function (row, dataitem, index) {
                var widgetThis = this;
                widgetThis.renderDetailTd.apply(widgetThis, arguments);
                $("td:eq(0)", row).bind("click", function () {
                    $scope.currentItem = dataitem;
                });

                // 添加操作
                addOperatorDom(dataitem, row);

                // 增加tip属性
                $("td:eq(1)", row).addTitle();
                $("td:eq(2)", row).addTitle();
            }
        };

        // 存储当前点击展开的详情
        $scope.currentItem = undefined;

        $scope.refresh = {
            id: "scriptRefresh",
            disabled: false,
            iconsClass: "",
            text: $scope.i18n.common_term_fresh_button,
            tip: "",
            click: function () {
                $scope.searchModel.start = 0;
                $scope.scriptTable.curPage = {"pageIndex": 1};
                $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                $scope.operator.query();
            }
        };

        $scope.addScript = {
            id: "addScript",
            disabled: false,
            iconsClass: "",
            text: $scope.i18n.common_term_add_button,
            tip: "",
            addScript: function () {
                "use strict";
                var win = createWindow("add", undefined);
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
                $scope.scriptTable.curPage = {"pageIndex": 1};
                $scope.searchModel.ostype = $("#" + $scope.searchOSType.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        $scope.searchBox = {
            "id": "appTemplateSearchBox",
            "placeholder": $scope.i18n.template_term_findScript_prom || "请输入脚本名称",
            "type":"round", // round,square,long
            "width": "200",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                $scope.searchModel.start = 0;
                $scope.scriptTable.curPage = {"pageIndex": 1};
                $scope.searchModel.name = searchString;
                $scope.searchModel.ostype = $("#" + $scope.searchOSType.id).widget().getSelectedId();
                $scope.operator.query();
            }
        };

        $scope.operator = {
            "query": function () {
                $scope.operator.queryDisk();
                // 统一转换start
                var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                var deferred = camel.get({
                    "url": {"s":constants.rest.SCRIPT_QUERY.url,"o":{"tenant_id":1}},
                    "params": $scope.searchModel,
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        // 详情配置
                        for (var index in data.scriptInfos) {
                            data.scriptInfos[index].detail = {
                                contentType: "url", // simple & url
                                content: "app/business/resources/views/templateSpec/template/script/scriptDetail.html"
                            }
                        }

                        // 获取数据
                        $scope.scriptTable.data = data.scriptInfos;
                        $scope.scriptTable.totalRecords = data.total;
                    });
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
                $scope.searchModel.start = start;
            },
            "delete": function (id) {
                var deferred = camel.delete({
                    "url": {"s":constants.rest.SCRIPT_DELETE.url,"o":{"tenant_id": 1, "scriptid": id}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.searchModel.start = 0;
                    $scope.scriptTable.curPage = {"pageIndex": 1};
                    // 刷新页面
                    $scope.operator.query();
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            },
            "queryDisk":function () {

                var deferred = camel.get({
                    "url": {"s": constants.rest.QUERY_REPOSITORY_SPACE.url, "o": {"tenant_id": 1}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });

                deferred.success(function (data) {
                    $scope.$apply(function() {
                        $scope.freeCapacity = data.freeCapacity;
                    });
                });
            }
        };

        // 打开时请求数据
        $scope.operator.query();
    }];
    return scriptTable;
});
