define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ame-rpool-exception",
    "fixtures/templateFixture"],
    function ($, angular, Window, Message, constants, exceptionService, ameException,templateFixture) {
        "use strict";

        var softwareListCtrl = ["$scope", "$compile", "$state", "camel","exception", function ($scope, $compile, $state, camel, exception) {

            $scope.searchModel = {
                name:"",
                ostype:"",
                filetype:"",
                start: "0",
                limit: "10"
            };

            $scope.privilege = $("html").scope().user.privilege;

            $scope.freeCapacity = "-";

            var deleteConfirm = function (id) {
                var msgOptions = {
                    "type":"confirm",
                    "title":$scope.i18n.common_term_confirm_label,
                    "content":$scope.i18n.template_software_del_info_confirm_msg || "确实要删除该软件包？",
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

            var showUsageWindow = function(id) {
                var options = {
                    "winId": "showUsageWinID",
                    "title":$scope.i18n.template_term_appInfo_label,
                    "softwareID": id,
                    "content-type": "url",
                    "content": "./app/business/resources/views/templateSpec/template/software/softwareUsage.html",
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

            var isSoftwareNormal = function (dataItem) {
                if (!dataItem) {
                    return true;
                }

                if (dataItem.status != "Normal") {
                    return false;
                }

                for (var index in dataItem.attachmentPaths) {
                    if (dataItem.attachmentPaths[index].status != "Normal") {
                        return false;
                    }
                }

                return true;
            };

            var addOperatorDom = function (dataItem, row) {

                var optTemplates = "";

                if (dataItem.range != "0") {
                    if ($scope.privilege.role_role_add_option_softwareHandle_value) {
                        optTemplates = "<a href='javascript:void(0)' ng-click='delete()' style='padding-right:10px; width:auto'>"+$scope.i18n.common_term_delete_button+"</a>";
                    }
                } else {
                    if ($scope.privilege.role_role_add_option_softwareHandle_value) {
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a href="javascript:void(0)" ng-click="modify()">'+$scope.i18n.common_term_modify_button+'</a></li>' +
                            '<li><a href="javascript:void(0)" ng-click="showUsage()">'+$scope.i18n.common_term_checkUsage_button+'</a></li>' +
                            '<li><a href="javascript:void(0)" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                            '</ul>' +
                            '</span>';

                        optTemplates = "<a href='javascript:void(0)' ng-if='softwareInstallRight' ng-click='patchInstall()' style='padding-right:10px; width:auto'>"+$scope.i18n.template_term_batchInstall_button+"</a>" + submenus;
                    } else {
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a href="javascript:void(0)" ng-click="showUsage()">'+$scope.i18n.common_term_checkUsage_button+'</a></li>' +
                            '</ul>' +
                            '</span>';
                        optTemplates = "<a href='javascript:void(0)' ng-if='softwareInstallRight' ng-click='patchInstall()' style='padding-right:10px; width:auto'>"+$scope.i18n.template_term_batchInstall_button+"</a>" + submenus;
                    }
                }

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.softwareInstallRight = $scope.privilege.role_role_add_option_softwareInstall_value;
                scope.patchInstall = function () {
                    $state.go("resources.distributeSoftware.navigation", {"id":dataItem.id});
                };
                scope.showUsage = function () {
                    showUsageWindow(dataItem.id);
                };
                scope.modify = function () {
                    $state.go("resources.registSoftwarePackage.navigation", {"action":"modify","id":dataItem.id, "from":"resources.templateSpec.software"});
                };
                scope.delete = function () {
                    deleteConfirm(dataItem.id);
                };

                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(8)", row).html(optDom);
                optDom.filter('.dropdown').dropdown();

                // 可见范围
                if (dataItem.range == 0) {
                    $("td:eq(7)", row).html($scope.i18n.common_term_system_label);
                } else {
                    $("td:eq(7)", row).html("VDC");
                }

                // 状态
                if (isSoftwareNormal(dataItem)) {
                    $("td:eq(3)", row).html($scope.i18n.common_term_natural_value);
                } else if ($scope.privilege.role_role_add_option_softwareHandle_value && dataItem.range == "0") {
                    var name = "<span style='padding-right: 10px;'>"+$scope.i18n.common_term_abnormal_value+"</span><a href='javascript:void(0)' ng-click='repair()'>"+$scope.i18n.common_term_restore_button+"</a>";
                    var nameLink = $compile(name);
                    var nameScope = $scope.$new();
                    nameScope.name = dataItem.name;
                    nameScope.repair = function () {
                        $state.go("resources.repairSoftwarePackage.navigation", {"id": dataItem.id});
                    };
                    var nameNode = nameLink(nameScope);
                    $("td:eq(3)", row).html(nameNode);
                } else{
                    $("td:eq(3)", row).html($scope.i18n.common_term_abnormal_value);
                }
            };

            $scope.softwareTable = {
                caption: "",
                data: [],
                id: "softwareTableId",
                columnsDraggable: true,
                enablePagination: true, //此属性设置表格是否分页
                paginationStyle: "full_numbers", //此属性设置表格分页的类型，可选值"simple","full_numbers"。
                lengthChange: true, // 此属性设置是否显示每页数据条数按钮。
                lengthMenu: [10, 20, 50], // 此属性设置每页显示数据长度选项，仅当length-change属性设置为true时有效。
                displayLength: 10,
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
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
                        "sTitle": $scope.i18n.common_term_softwareType_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.fileType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.template_term_softwareVersion_label || "软件版本",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.version);
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

                    $scope.softwareTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.softwareTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.softwareTable.displayLength = eveObj.displayLength;
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

            $scope.refresh = {
                id: "softwareRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                click: function () {
                    $scope.searchModel.start = 0;
                    $scope.softwareTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };
            $scope.add = {
                id: "softwareAddBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_add_button,
                tip: "",
                add: function () {
                    "use strict";
                    $state.go("resources.registSoftwarePackage.navigation", {"action":"create","id":"null",  "from":"resources.templateSpec.software"});
                }
            };

            $scope.searchOSType = {
                "id": "searchOSType",
                "width": "150",
                "values": [
                    {
                        "selectId": "",
                        "label": $scope.i18n.common_term_allOStype_label || "所有操作系统类型",
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
                    $scope.softwareTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.ostype = $("#searchOSType").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.searchPackageType = {
                "id": "searchPackageType",
                "width": "100",
                "values": [
                    {
                        "selectId": "",
                        "label": $scope.i18n.common_term_allType_label,
                        "checked" : true
                    },
                    {
                        "selectId": "unknown",
                        "label": "unknown"
                    },
                    {
                        "selectId": "rpm",
                        "label": "rpm"
                    },
                    {
                        "selectId": "msi",
                        "label": "msi"
                    }
                ],
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.softwareTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.filetype = $("#searchPackageType").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "searchBox",
                "placeholder": $scope.i18n.template_term_findSoftName_prom || "请输入软件包名称",
                "type":"round", 
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.softwareTable.curPage = {"pageIndex": 1};
                    $scope.searchModel.name = searchString;
                    $scope.searchModel.ostype = $("#searchOSType").widget().getSelectedId();
                    $scope.searchModel.filetype = $("#searchPackageType").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            // 存储当前点击展开的详情
            $scope.currentItem = undefined;

            $scope.operator = {
                "query": function () {
                    $scope.operator.queryDisk();
                    // 统一转换start
                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s":constants.rest.SOFTWARE_QUERY.url,"o":{"tenant_id":1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            // 详情配置
                            for (var index in data.softwareInfos) {
                                data.softwareInfos[index].detail = {
                                    contentType: "url", 
                                    content: "app/business/resources/views/templateSpec/template/software/softwareDetail.html"
                                };
                            }
                            // 获取数据
                            $scope.softwareTable.data = data.softwareInfos;
                            $scope.softwareTable.totalRecords = data.total;

                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                    $scope.searchModel.start = start;
                },
                "delete": function (id) {
                    var deferred = camel.delete({
                        "url": {"s": constants.rest.SOFTWARE_DELETE.url, "o": {"tenant_id": 1, "softwareid": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新页面
                        $scope.searchModel.start = 0;
                        $scope.softwareTable.curPage = {"pageIndex": 1};
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
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        return softwareListCtrl;
    });