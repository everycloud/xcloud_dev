/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-26
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "app/business/user/service/roleService",
    "app/services/exceptionService",
    "app/services/competitionConfig",
    "language/keyID",
    "app/services/commonService",
    "tiny-directives/Searchbox",
    "fixtures/userFixture",
    "bootstrap/bootstrap.min"
],
    function ($, angular, Window, Message, RoleService, ExceptionService, Competition, keyID, commonService) {
        "use strict";
        var roleCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.roleService = new RoleService();
                $scope.searchModel = {
                    roleType: "",
                    roleName: "",
                    start: 0,
                    limit: 10
                };
                $scope.searchRoleType = {
                    "id": "searchRoleTypeId",
                    "dftLabel": $scope.i18n.role_term_allRoleType_label,
                    "width": "120",
                    "values": [
                        {
                            "selectId": "All",
                            "label": $scope.i18n.role_term_allRoleType_label,
                            "checked": true
                        },
                        {
                            "selectId": "SYSTEM_ROLE",
                            "label": $scope.i18n.role_term_sysMgrRole_value
                        },
                        {
                            "selectId": "SERVICE_ROLE",
                            "label": $scope.i18n.role_term_serviceMgrRole_value
                        }
                    ],
                    "change": function () {
                        $scope.searchModel.roleType = $("#" + $scope.searchRoleType.id).widget().getSelectedId();
                        $scope.model.curPage = {
                            "pageIndex": 1
                        };
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };
                $scope.searchBox = {
                    "id": "roleSearchBox",
                    "placeholder": $scope.i18n.role_term_findRole_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.roleName = searchString;
                        $scope.model.curPage = {
                            "pageIndex": 1
                        }
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };
                /**
                 * 操作按钮
                 */
                $scope.refresh = {
                    id: "roleRefreshId",
                    disabled: false,
                    iconsClass: "",
                    tip: "",
                    click: function () {
                        $scope.operator.query();
                    }
                };

                //角色操作权限
                var hasRoleOperateRight = user.privilege.role_role_add_option_roleHandle_value;

                var addOperatorDom = function (dataitem, row) {
                    // 操作栏
                    var optscope = $scope.$new(false);
                    optscope.defaultRole = dataitem.defaultRole;
                    optscope.hasRoleOperateRight = hasRoleOperateRight;
                    var submenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a tabindex="-1" ng-click="configureFCRole()" ng-show="false">' + $scope.i18n.role_term_setFCrole_button + '</a></li>' +
                        '<li><a tabindex="-1" ng-click="configureFARole()" ng-show="false">' + $scope.i18n.role_term_setFArole_button + '</a></li>' +
                        '<li><a tabindex="-1" ng-click="delete()" ng-if="!defaultRole">' + $scope.i18n.common_term_delete_button + '</a>' +
                        '<p class="link_disable fl" style="margin-left: 20px" ng-if="defaultRole">' + $scope.i18n.common_term_delete_button + '</p>' + '</li>' +
                        '</ul>' + '</span>';

                    var opt = "<div ng-if='hasRoleOperateRight'><a href='javascript:void(0)' ng-click='edit()' ng-if='!defaultRole' style='margin-right:10px;'>" + $scope.i18n.common_term_modify_button + "</a>" +
                        "<p class='link_disable fl' ng-if='defaultRole' style='margin-right:10px;'>" + $scope.i18n.common_term_modify_button + "</p>" +
                        "<a href='javascript:void(0)' ng-click='delete()' ng-if='!defaultRole'>" + $scope.i18n.common_term_delete_button + "</a>" +
                        "<p class='link_disable fl' ng-if='defaultRole'>" + $scope.i18n.common_term_delete_button + "</p>" + "</div>";

                    var opts = $compile($(opt));

                    optscope.edit = function () {
                        var modifyRoleWindow = new Window({
                            "winId": "modifyRoleWindowId",
                            "roleId": dataitem.id,
                            "title": $scope.i18n.role_term_modifyRole_button,
                            "content-type": "url",
                            "content": "app/business/user/views/role/modifyRole.html",
                            "height": 600,
                            "width": 800,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    };
                    optscope.configureFCRole = function () {
                        var configureFCRoleWindow = new Window({
                            "winId": "configureFCRoleWindowId",
                            "roleId": dataitem.id,
                            "title": $scope.i18n.role_term_setFCrole_button,
                            "content-type": "url",
                            "content": "app/business/user/views/role/configureFCRole.html",
                            "height": 200,
                            "width": 400,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    };
                    optscope.configureFARole = function () {
                        var configureFARoleWindow = new Window({
                            "winId": "configureFARoleWindowId",
                            "roleId": dataitem.id,
                            "title": $scope.i18n.role_term_setFArole_button,
                            "content-type": "url",
                            "content": "app/business/user/views/role/configureFARole.html",
                            "height": 200,
                            "width": 400,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    };

                    optscope.delete = function () {
                        var deleteMsg = new Message({
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.role_role_del_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    accessKey: '2',
                                    "key": "okBtn",
                                    majorBtn : true,
                                    default: true
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    accessKey: '3',
                                    "key": "cancelBtn",
                                    default: false
                                }
                            ]
                        });
                        deleteMsg.setButton("okBtn", function () {
                            var roleId = dataitem.id;
                            $scope.operator.delete(roleId, deleteMsg);
                        });
                        deleteMsg.setButton("cancelBtn", function () {
                            deleteMsg.destroy();
                        });
                        deleteMsg.show();
                    };
                    var optNode = opts(optscope);
                    $("td:eq(5)", row).html(optNode);
                    optNode.find('.dropdown').dropdown();
                };

                // 根据场景设置角色列表显示列
                var columnList = [
                    {
                        "sTitle": "",
                        "sWidth": "40px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "sWidth": "250"
                    },
                    {
                        "sTitle": $scope.i18n.role_term_roleName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "25%"
                    },
                    {
                        "sTitle": $scope.i18n.role_term_roleType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "sWidth": "20%",
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "operation",
                        "sWidth": "15%",
                        "bSearchable": false,
                        "bSortable": false
                    }
                ];
                var columns = [];
                var showDetail = true;
                if ($scope.openstack) {
                    columns = [];
                    columns.push(columnList[1]);
                    columns.push(columnList[2]);
                    columns.push(columnList[4]);
                    showDetail = false;
                } else {
                    columns = columnList;
                    showDetail = true;
                }
                $scope.model = {
                    "id": "roleListId",
                    "caption": "",
                    "datas": [],
                    "columns": columns,
                    "pagination": true,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 6000,
                        "httpMethod": "GET",
                        "url": "/uportal/role/query",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "showDetails": showDetail,

                    "renderRow": function (row, dataitem, index) {
                        $(row).attr("roleId", $.encoder.encodeForHTMLAttribute(dataitem.id));
                        $(row).attr("lineNum", index);

                        if (!$scope.openstack) {
                            //列表的下钻详情处理
                            var widgetThis = this;
                            widgetThis.renderDetailTd.apply(widgetThis, arguments);

                            // 更改角色类型显示
                            var scope = $scope.$new(false);
                            scope.type = $scope.roleService.transferRoleType(dataitem.type, keyID);
                            var link = $compile($("<div>{{type}}</div>"));
                            var node = link(scope);
                            $("td:eq(3)", row).html(node);
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                            $("td:eq(4)", row).addTitle();

                            // 添加操作
                            addOperatorDom(dataitem, row);
                        } else {
                            $("td:eq(0)", row).addTitle();
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                        }
                    },

                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    }
                };

                $scope.operator = {
                    "query": function () {
                        var url = "/goku/rest/v1.5/1/roles?";
                        url = url + "start=" + $scope.searchModel.start;
                        url = url + "&limit=" + $scope.searchModel.limit;
                        var roleName = $scope.searchModel.roleName;
                        if (roleName !== "") {
                            url = url + "&name=" + roleName;
                        }
                        var roleType = $scope.searchModel.roleType;
                        if (roleType !== "" && roleType !== "All") {
                            url = url + "&type=" + roleType;
                        }

                        var deferred = camel.get({
                            "url": url,
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var data = [];
                                var roleListRes = response.roleList;
                                if(Competition.isBaseOnVmware && $scope.openstack)
                                {
                                    roleListRes = roleListRes.filter(function(item, index, array){
                                        return item.name !== "user";
                                    });
                                }
                                for (var item in roleListRes) {
                                    roleListRes[item].detail = {
                                        contentType: "url",
                                        content: "app/business/user/views/role/roleDetail.html"
                                    };
                                    roleListRes[item].operation = "";
                                    if (roleListRes[item].defaultRole) {
                                        roleListRes[item].description = keyID[roleListRes[item].description] || roleListRes[item].description;
                                    }
                                    data.push(roleListRes[item]);
                                }
                                $scope.model.datas = data;
                                $scope.model.totalRecords = response.total;
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "delete": function (roleId, deleteMsg) {
                        var deferred = camel["delete"]({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles/{id}",
                                o: {
                                    "tenant_id": "1",
                                    "id": roleId
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.query();
                                deleteMsg.destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };
                $scope.operator.query();

                $scope.createRoleModel = {
                    "id": "roleCreateBtnId",
                    "text": $scope.i18n.role_term_createRole_button,
                    "disable": !hasRoleOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        var createWindow = new Window({
                            "winId": "createRoleWindowId",
                            "title": $scope.i18n.role_term_createRole_button,
                            "content-type": "url",
                            "content": "app/business/user/views/role/createRole.html",
                            "height": 600,
                            "width": 800,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    }
                };
            }
        ];

        return roleCtrl;
    });
