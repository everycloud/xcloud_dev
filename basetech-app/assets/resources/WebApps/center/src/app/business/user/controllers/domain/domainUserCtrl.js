/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-26
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "app/services/exceptionService",
    "app/services/messageService",
    "language/keyID",
    "app/services/commonService",
    "fixtures/userFixture",
    "tiny-directives/Searchbox",
    "bootstrap/bootstrap.min"],
    function ($, angular, Window, Message, ExceptionService, MessageService, keyID, commonService) {
        "use strict";
        var domainUserCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            var hasDomainOperateRight = $scope.hasDomainOperateRight = user.privilege.role_role_add_option_domainHandle_value;
            $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
            $scope.searchModel = {
                start: 0,
                limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                userName: ""
            };
            $scope.searchBox = {
                "id": "userSearchBox",
                "placeholder": i18n.user_term_findUserName_prom || "输入用户名",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchModel.userName = searchString;
                    $scope.operator.queryDomainUser();
                }
            };
            $scope.createUserModel = {
                "id": "createUserBtnId",
                "text": i18n.common_term_addmember_button || "添加成员",
                "disabled": false,
                "create": function () {
                    var createWindow = new Window({
                        "winId": "addMemberWindowId",
                        "domainId": $scope.domainId,
                        "title": i18n.common_term_addmember_button || "添加成员",
                        "content-type": "url",
                        "content": "app/business/user/views/domain/addMember.html",
                        "height": 600,
                        "width": 800,
                        "minimizable": false,
                        "maximizable": false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.queryDomainUser();
                        }
                    }).show();
                }
            };
            $scope.refresh = {
                id: "refreshId",
                disabled: false,
                iconsClass: "",
                text: i18n.common_term_fresh_button || "刷新",
                tip: "",
                click: function () {
                    $scope.searchModel.userName = $("#" + $scope.searchBox.id).widget().getValue();
                    $scope.operator.queryDomainUser();
                }
            };

            var addOperatorDom = function (dataitem, row) {
                // 操作栏
                var optTemplates = "<div ng-if='hasDomainOperateRight'><a href='javascript:void(0)' ng-click='removeUser()'>" + (i18n.common_term_move_button || "移除用户") + "</a><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                    "<a href='javascript:void(0)' ng-click='setPrivilege()'>" + (i18n.user_term_setRight_button || "配置权限") + "</a></div>";
                var opts = $compile($(optTemplates));
                var optscope = $scope.$new(false);
                optscope.hasDomainOperateRight = hasDomainOperateRight;
                optscope.removeUser = function () {
                    new MessageService().confirmMsgBox({
                        "content": i18n.domain_user_move_info_confirm_msg || "确实要移除该用户吗？",
                        "callback": function () {
                            $scope.operator.removeUser(dataitem.userId);
                        }
                    });
                };

                optscope.setPrivilege = function () {
                    var setPrivilegeWindow = new Window({
                        "winId": "setPrivilegeWindowId",
                        "userId": dataitem.userId,
                        "domainId": $scope.domainId,
                        "domainPrivileges": dataitem.domainPrivileges,
                        "title": i18n.user_term_modifyRight_button || "修改权限",
                        "content-type": "url",
                        "content": "app/business/user/views/domain/setPrivilege.html",
                        "height": 550,
                        "width": 400,
                        "maximizable":false,
                        "minimizable":false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.queryDomainUser();
                        }
                    }).show();
                };

                var optNode = opts(optscope);
                $("td:eq(2)", row).html(optNode);
            };

            // 根据场景设置用户列表显示列
            var userList = [
                {
                    "sTitle": i18n.common_term_userName_label || "用户名",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.userName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_domainRight_label || "域权限",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.domainPrivilegesStr);
                    },
                    "mWidth": "40%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_operation_label || "操作",
                    "mData": "operation",
                    "bSortable": false
                }
            ];

            $scope.model = {
                "id": "userListId",
                "caption": null,
                "datas": [],
                "columns": userList,
                "pagination": true,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "enableFilter": false,
                "curPage": {"pageIndex": 1},
                "requestConfig": {"enableRefresh": true, "refreshInterval": 6000, "httpMethod": "GET", "url": "", "data": "", "sAjaxDataProp": "mData"},
                "totalRecords": 0,
                "hideTotalRecords": false,
                "showDetails": false,

                "renderRow": function (row, dataitem, index) {
                    $("td:eq(1)", row).addTitle();

                    // 添加操作
                    addOperatorDom(dataitem, row);
                },

                "callback": function (evtObj) {
                    $scope.model.curPage.pageIndex = evtObj.currentPage;
                    $scope.model.displayLength = evtObj.displayLength;
                    $scope.operator.queryDomainUser();
                },
                "changeSelect": function (evtObj) {
                    $scope.model.curPage.pageIndex = evtObj.currentPage;
                    $scope.model.displayLength = evtObj.displayLength;
                    $scope.operator.queryDomainUser();
                }
            };

            $scope.operator = {
                "queryDomainUser": function () {
                    var domainId = $scope.domainId;
                    if (!domainId || "domainParentId" == domainId) {
                        var dom = document.getElementById($scope.model.id);
                        dom && $(dom).widget().option("data", []);
                        return;
                    }
                    var url = "/goku/rest/v1.5/1/domains/{id}/users?";
                    url = url + "start=" + ($scope.model.curPage.pageIndex - 1) * $scope.model.displayLength;
                    url = url + "&limit=" + $scope.model.displayLength;
                    var userName = $scope.searchModel.userName;
                    if (userName != "") {
                        url = url + "&user-name=" + userName;
                    }

                    var deferred = camel.get({
                        "url": {s: url, o: {"id": domainId}},
                        "params": {},
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            var data = [];
                            var userListRes = response.userOnDomain || [];
                            for (var item in userListRes) {
                                userListRes[item].operation = "";
                                var privilegeList = userListRes[item].domainPrivileges;
                                var privileges = "";
                                if (privilegeList) {
                                    for (var index in privilegeList) {
                                        if (!privilegeList[index] || !privilegeList[index].name) {
                                            continue;
                                        }
                                        var tmp = keyID[privilegeList[index].name] || privilegeList[index].name;
                                        privileges = privileges + tmp + ";";
                                    }
                                    if (privileges.length > 1) {
                                        privileges = privileges.substr(0, privileges.length - 1);
                                    }
                                }
                                userListRes[item].domainPrivilegesStr = privileges;
                                data.push(userListRes[item]);
                            }
                            $scope.model.datas = data;
                            $scope.model.totalRecords = response.total;
                        });
                    });
                },
                // 移除用户
                "removeUser": function (userId) {
                    var deferred = camel["delete"]({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/domains/{id}/users/{user_id}",
                            "o": {
                                "tenant_id": "1",
                                "id": $scope.domainId,
                                "user_id": userId
                            }
                        },
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.operator.queryDomainUser();
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                }
            };

            // 初始化时查询用户列表页面
            $scope.operator.queryDomainUser();
        }];

        return domainUserCtrl;
    });