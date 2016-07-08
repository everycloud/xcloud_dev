/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-26
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-widgets/Window",
        'tiny-widgets/Message',
        "app/business/tenantUser/service/roleService",
        "app/business/tenantUser/service/userDomainService",
        "app/services/competitionConfig",
        "language/keyID",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Searchbox",
        "bootstrap/bootstrap.min",
        "fixtures/tmpUserFixture"
    ],
    function ($, angular, Window, Message, RoleService, userDomainService, Competition, KeyID, _) {
        "use strict";
        var roleCtrl = ["$scope", "$compile", "$state", "$q", "camel", "exception",
            function ($scope, $compile, $state, $q, camel, exception) {
                var user = $scope.user;
                var i18n = $scope.i18n;
                var serviceInstance = new userDomainService(exception, $q, camel);
                var roleService = new RoleService();
                var showDetail = true;
                //角色操作权限
                var ROLE_OPERATE = "102001";
                var privilegeList = $("html").scope().user.privilegeList;
                var hasRoleOperateRight = _.contains(privilegeList, ROLE_OPERATE);
                //管理侧创建ORGID
                var MANAGE_ORG_ID = "1";
                $scope.openstack = (user.cloudType === "ICT" ? true : false);
                $scope.searchModel = {
                    roleType: "SERVICE_ROLE",
                    roleName: "",
                    start: "",
                    limit: ""
                };
                $scope.searchBox = {
                    "id": "roleSearchBox",
                    "placeholder": i18n.role_term_findRole_prom,
                    "width": "250",
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.searchModel.roleName = searchString;
                        $scope.searchModel.roleType = "SERVICE_ROLE";
                        $scope.model.curPage.pageIndex = 1;
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
                    "tips": i18n.common_term_fresh_button,
                    click: function () {
                        $scope.searchModel.roleName = $("#" + $scope.searchBox.id).widget().getValue();
                        $scope.operator.query();
                    }
                };
                //帮助
                $scope.help = {
                    "helpKey": "drawer_role",
                    "tips": i18n.common_term_help_label,
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                var addOperatorDom = function (dataitem, row) {
                    // 操作栏
                    var optscope = $scope.$new(false);
                    optscope.defaultRole = dataitem.defaultRole;
                    //是否是管理侧创建的公共角色
                    optscope.isCommonRole = ((dataitem.vdcId === MANAGE_ORG_ID));
                    var submenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a class="btn-link" ng-click="deleter()" ng-if="!defaultRole && !isCommonRole">' + i18n.common_term_delete_button + '</a>' +
                        '<li class="disabled" ng-if="defaultRole||isCommonRole"><a>' + i18n.common_term_delete_button + '</a></li>' +
                        '</ul>' + '</span>';

                    var opt = "<div><a href='javascript:void(0)' ng-click='edit()' ng-if='!defaultRole && !isCommonRole'>" + i18n.common_term_modify_button + "</a>" +
                        "<p class='link_disable fl' ng-if='defaultRole || isCommonRole'>" + i18n.common_term_modify_button + "</p>" + "<span>&nbsp&nbsp&nbsp&nbsp</span>" + submenus + "</div>";
                    var opts = $compile($(opt));

                    optscope.edit = function () {
                        var modifyRoleWindow = new Window({
                            "winId": "modifyRoleWindowId",
                            "roleId": dataitem.id,
                            "title": i18n.role_term_modifyRole_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/role/modifyRole.html",
                            "height": 600,
                            "width": 800,
                            "buttons": null,
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    };

                    optscope.deleter = function () {
                        var deleteMsg = new Message({
                            "type": "prompt",
                            "title": i18n.common_term_confirm_label,
                            "content": i18n.role_role_del_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                "label": i18n.common_term_ok_button,
                                "accessKey": '2',
                                "key": "okBtn",
                                "default": true
                            }, {
                                "label": i18n.common_term_cancle_button,
                                "accessKey": '3',
                                "key": "cancelBtn",
                                "default": false
                            }]
                        });
                        deleteMsg.setButton("okBtn", function () {
                            var roleId = dataitem.id;
                            $scope.operator.deleter(roleId, deleteMsg);
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
                function getColumns() {
                    var columnList = [{
                        "sTitle": "",
                        "sWidth": "40px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": i18n.role_term_roleName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    }, {
                        "sTitle": i18n.role_term_roleType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.desc);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSearchable": false,
                        "bSortable": false
                    }];
                    var columns = [];
                    if ($scope.openstack) {
                        columns = [];
                        columns.push(columnList[0]);
                        columns.push(columnList[1]);
                        columns.push(columnList[2]);
                        columns.push(columnList[4]);
                        showDetail = false;
                    } else {
                        columns = columnList;
                        showDetail = true;
                    }
                    return columns;
                }

                $scope.model = {
                    "id": "roleListId",
                    "datas": [],
                    "columns": getColumns(),
                    "pagination": true,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
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
                        $(row).attr("roleId", dataitem.id);
                        $(row).attr("lineNum", index);
                        //列表的下钻详情处理
                        var widgetThis = this;
                        widgetThis.renderDetailTd.apply(widgetThis, arguments);

                        if (!$scope.openstack) {
                            // 更改角色类型显示
                            var scope = $scope.$new(false);
                            scope.type = roleService.transferRoleType(dataitem.type);
                            var link = $compile($("<div>{{type}}</div>"));
                            var node = link(scope);
                            $("td:eq(3)", row).html(node);
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                            $("td:eq(4)", row).addTitle();
                            if (hasRoleOperateRight) {
                                addOperatorDom(dataitem, row);
                            }
                        } else {
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                            $("td:eq(3)", row).addTitle();
                        }

                    },
                    "callback": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.model.curPage.pageIndex = evtObj.currentPage;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    }
                };
                function dealTableData(item) {
                    item.detail = {
                        contentType: "url",
                        content: "app/business/tenantUser/views/role/roleDetail.html"
                    };
                    item.operation = "";
                    if (item.defaultRole) {
                        item.desc = KeyID[item.description] || item.description;
                    } else {
                        item.desc = item.description;
                    }
                }
                $scope.operator = {
                    "query": function () {
                        var url = "/goku/rest/v1.5/" + user.vdcId + "/roles?";
                        url = url + "start=" + ($scope.model.curPage.pageIndex - 1) * $scope.model.displayLength;
                        url = url + "&limit=" + $scope.model.displayLength;
                        var roleName = $scope.searchModel.roleName;
                        if (roleName !== "") {
                            url = url + "&name=" + roleName;
                        }
                        var roleType = "SERVICE_ROLE";
                        if (roleType !== "" && roleType !== "All") {
                            url = url + "&type=" + roleType;
                        }
                        var options = {
                            "url": url,
                            "userId": user.id
                        };
                        var promise = serviceInstance.queryRoles(options);
                        promise.then(function (response) {
                            if (response === null || response === undefined) {
                                return;
                            }
                            var roleListRes = response.roleList;
                            if($scope.openstack && Competition.isBaseOnVmware)
                            {
                                roleListRes = roleListRes.filter(function(item, index, array){
                                   return item.name !== "user";
                                });
                            }
                            _.each(roleListRes, dealTableData);
                            $scope.model.datas = roleListRes;
                            $scope.model.totalRecords = response.total;
                        });
                    },
                    "deleter": function (roleId, deleteMsg) {
                        var options = {
                            "id": roleId,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var promise = serviceInstance.deleteRole(options);
                        promise.then(function (data) {
                            $scope.operator.query();
                            deleteMsg.destroy();
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.operator.query();
                });

                $scope.createRoleModel = {
                    "id": "roleCreateBtnId",
                    "text": i18n.role_term_createRole_button,
                    "disable": !hasRoleOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        var createWindow = new Window({
                            "winId": "createRoleWindowId",
                            "title": i18n.role_term_createRole_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/role/createRole.html",
                            "height": 600,
                            "width": 800,
                            "buttons": null,
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
