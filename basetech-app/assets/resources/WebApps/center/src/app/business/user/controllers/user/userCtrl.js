/*global define*/
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/user/service/userService",
        "app/services/exceptionService",
        "app/services/commonService",
        "tiny-widgets/Window",
        'tiny-widgets/Message',
        "tiny-directives/Table",
        "tiny-directives/Button",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Searchbox",
        "fixtures/userFixture",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular, UserService, ExceptionService, commonService, Window, Message) {
        "use strict";
        var userCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.userService = new UserService();
                $scope.searchModel = {
                    userType: "",
                    onLineStatus: "",
                    userName: "",
                    start: 0,
                    limit: 10
                };
                $scope.searchUserType = {
                    "id": "searchUserTypeId",
                    "dftLabel": $scope.i18n.common_term_allAuthType_label,
                    "width": "120",
                    "values": [{
                        "selectId": "All",
                        "label": $scope.i18n.common_term_allAuthType_label,
                        "checked": true
                    }, {
                        "selectId": "NATIVE_USER",
                        "label": $scope.i18n.user_user_add_para_type_option_local_value
                    }, {
                        "selectId": "LDAP_USER",
                        "label": $scope.i18n.user_user_add_para_type_option_ad_value
                    }],
                    "change": function () {
                        $scope.searchModel.userType = $("#" + $scope.searchUserType.id).widget().getSelectedId();
                        $scope.model.curPage = {
                            "pageIndex": 1
                        };
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };

                $scope.searchOnlineState = {
                    "id": "searchOnlineStateId",
                    "dftLabel": $scope.i18n.common_term_allOnlineStatus_label,
                    "width": "120",
                    "values": [{
                        "selectId": "All",
                        "label": $scope.i18n.common_term_allOnlineStatus_label,
                        "checked": true
                    }, {
                        "selectId": "ONLINE",
                        "label": $scope.i18n.common_term_online_value
                    }, {
                        "selectId": "OFFLINE",
                        "label": $scope.i18n.common_term_offline_label
                    }],
                    "change": function () {
                        $scope.searchModel.onLineStatus = $("#" + $scope.searchOnlineState.id).widget().getSelectedId();
                        $scope.model.curPage = {
                            "pageIndex": 1
                        };
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };
                $scope.searchBox = {
                    "id": "userSearchBox",
                    "placeholder": $scope.i18n.user_term_findUserName_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {
                        $scope.searchModel.userName = searchString;
                        $scope.model.curPage = {
                            "pageIndex": 1
                        };
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };

                $scope.refresh = {
                    id: "refreshId",
                    disable: false,
                    iconsClass: "",
                    tip: "",
                    click: function () {
                        $scope.operator.query();
                    }
                };

                var userOperateRight = user.privilege.role_role_add_option_userHandle_value;

                var addOperatorDom = function (dataitem, row) {
                    // 操作栏
                    var submenus = '<span class="dropdown" style="position: static" ng-show="!ictCloudAdmin">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+ $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '<li><a tabindex="-1" ng-click="edit()" ng-show="!defaultUser">'+ $scope.i18n.common_term_modify_button + '</a></li>' +
                        '<li><a tabindex="-1" ng-click="delete()" ng-show="!defaultUser">'+ $scope.i18n.common_term_delete_button + '</a></li>' +
                        '<li><a tabindex="-1" ng-click="resetPassword()" ng-show="!selfUser">'+ $scope.i18n.user_term_resetPsw_button + '</a></li>' +
                        '</ul>' +
                        '</span>';
                    var optTemplates = "<div ng-show='!selfUser && userOperateRight'><a href='javascript:void(0)' ng-click='lockUser()' ng-show='!userLocked'>"+ $scope.i18n.user_term_lock_button + "</a><span ng-show='!userLocked'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                        "<a href='javascript:void(0)' ng-click='unLockUser()' ng-show='userLocked'>"+ $scope.i18n.common_term_unlock_button + "</a><span ng-show='userLocked'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + submenus + "</div>";
                    var opts = $compile($(optTemplates));
                    var optscope = $scope.$new(false);
                    optscope.userLocked = dataitem.lockStatus === "LOCKED";
                    optscope.defaultUser = dataitem.defaultUser;
                    optscope.selfUser = dataitem.id === user.id;
                    optscope.ictCloudAdmin = $scope.openstack && (dataitem.name === "cloud_admin");
                    optscope.userOperateRight = userOperateRight;
                    optscope.lockUser = function () {
                        var lockUserMsg = new Message({
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.user_user_lock_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            }, {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }]
                        });
                        lockUserMsg.setButton("okBtn", function () {
                            $scope.operator.lockUser(dataitem.id, optscope.userLocked);
                            lockUserMsg.destroy();
                        });
                        lockUserMsg.setButton("cancelBtn", function () {
                            lockUserMsg.destroy();
                        });
                        lockUserMsg.show();
                    };
                    optscope.unLockUser = function () {
                        var unLockUserMsg = new Message({
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.user_user_unlock_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            }, {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }]
                        });
                        unLockUserMsg.setButton("okBtn", function () {
                            $scope.operator.lockUser(dataitem.id, optscope.userLocked);
                            unLockUserMsg.destroy();
                        });
                        unLockUserMsg.setButton("cancelBtn", function () {
                            unLockUserMsg.destroy();
                        });
                        unLockUserMsg.show();
                    };
                    optscope.edit = function () {
                        var modifyUserWindow = new Window({
                            "winId": "modifyUserWindowId",
                            "userId": dataitem.id,
                            "title": $scope.i18n.user_term_modifyUser_button,
                            "content-type": "url",
                            "content": "app/business/user/views/user/modifyUser.html",
                            "height": 600,
                            "width": 800,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": null,
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    };
                    optscope.delete = function () {
                        var deleteMsg = new Message({
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.user_user_del_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            }, {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }]
                        });
                        deleteMsg.setButton("okBtn", function () {
                            $scope.operator.delete(dataitem.id);
                            deleteMsg.destroy();
                        });
                        deleteMsg.setButton("cancelBtn", function () {
                            deleteMsg.destroy();
                        });
                        deleteMsg.show();
                    };

                    optscope.resetPassword = function () {
                        var resetPwdWindow = new Window({
                            "winId": "resetPwdWindowId",
                            "userId": dataitem.id,
                            "userName": dataitem.name,
                            "title": $scope.i18n.user_term_resetPsw_button,
                            "content-type": "url",
                            "content": "app/business/user/views/user/resetPassword.html",
                            "height": 250,
                            "width": 500,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": null,
                            "close": function (event) {}
                        }).show();
                    };
                    var optNode = opts(optscope);
                    if ($scope.openstack) {
                        $("td[tdname='5']", row).html(optNode);
                    } else {
                        $("td[tdname='7']", row).html(optNode);
                    }
                    optNode.find('.dropdown').dropdown();
                };

                // 根据场景设置用户列表显示列
                var fusionSphereList = [{
                    "sTitle": "",
                    "sWidth": "38px",
                    "mData": "detail",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_userName_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": "ID",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.role_term_sysMgrRole_value,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.role);
                    },
                    "bSortable": false
                },  {
                    "sTitle": $scope.i18n.user_term_lockStatus_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.lockStatusStr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_onlineStatus_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.onLineStatusStr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(commonService.utc2Local(data.createTime));
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "operation",
                    "bSortable": false
                }];

                var openStackList = [{
                    "sTitle": "",
                    "sWidth": "38px",
                    "mData": "detail",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_userName_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": "ID",
                    "sWidth": "250px",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.user_term_lockStatus_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.lockStatusStr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_onlineStatus_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.onLineStatusStr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "operation",
                    "bSortable": false
                }];
                var columns = [];
                var exclude = [];
                var fusionSphereExclude = [0, 1, 2, 8];
                var openStackExclude = [0, 1,2, 6];

                if ($scope.openstack) {
                    columns = openStackList;
                    exclude = openStackExclude;
                } else {
                    columns = fusionSphereList;
                    exclude = fusionSphereExclude;
                }
                $scope.model = {
                    "id": "userListId",
                    "caption": null,
                    "visibility": {
                        "activate": "click",
                        "aiExclude": exclude,
                        "bRestore": false,
                        "fnStateChange": function (index, state) {}
                    },
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
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "showDetails": true,

                    "renderRow": function (row, dataitem, index) {
                        $(row).attr("userId", $.encoder.encodeForHTMLAttribute(dataitem.id))
                            .attr("lineNum", index);
                        //列表的下钻详情处理
                        var widgetThis = this;
                        widgetThis.renderDetailTd.apply(widgetThis, arguments);

                        if ($scope.openstack) {
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                        } else {
                            $("td:eq(1)", row).addTitle();
                            $("td:eq(2)", row).addTitle();
                            $("td:eq(3)", row).addTitle();
                            $("td:eq(6)", row).addTitle();
                        }

                        // 添加操作
                        addOperatorDom(dataitem, row);
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
                        var params = {};
                        params.start = $scope.searchModel.start;
                        params.limit = $scope.searchModel.limit;
                        var userName = $scope.searchModel.userName;
                        if ($.trim(userName) !== "") {
                            params.userName = userName;
                        }

                        var userType = $scope.searchModel.userType;
                        if (userType !== "" && userType !== "All") {
                            params.userType = userType;
                        }

                        var onLineStatus = $scope.searchModel.onLineStatus;
                        if (onLineStatus !== "" && onLineStatus !== "All") {
                            params.onLineStatus = onLineStatus;
                        }

                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/users/list",
                                o: {
                                    "tenant_id": 1
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response || !response.userList) {
                                    return;
                                }
                                var data = [];
                                var userListRes = response.userList;
                                for (var item in userListRes) {
                                    userListRes[item].detail = {
                                        contentType: "url",
                                        content: "app/business/user/views/user/userDetail.html"
                                    };
                                    userListRes[item].userTypeStr = $scope.userService.transferUserType(userListRes[item].userType,$scope.i18n);
                                    userListRes[item].lockStatusStr = $scope.userService.transferLockStatus(userListRes[item].lockStatus ,$scope.i18n);
                                    userListRes[item].onLineStatusStr = $scope.userService.transferOnLineStatus(userListRes[item].onLineStatus ,$scope.i18n);
                                    userListRes[item].operation = "";
                                    var roleList = userListRes[item].roleList;
                                    var role = "";
                                    if (roleList !== null) {
                                        for (var index in roleList) {
                                            role = role + roleList[index].name + ";";
                                        }
                                        if (role.length > 1) {
                                            role = role.substr(0, role.length - 1);
                                        } else {
                                            role = "N/A";
                                        }
                                    }

                                    userListRes[item].role = role;
                                    data.push(userListRes[item]);
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
                    "delete": function (userId) {
                        var deferred = camel["delete"]({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/users/{id}",
                                "o": {
                                    "tenant_id": "1",
                                    "id": userId
                                }
                            },
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.query();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "lockUser": function (userId, userLocked) {
                        var deferred = camel.put({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/users/{id}/lock-status",
                                "o": {
                                    "tenant_id": "1",
                                    "id": userId
                                }
                            },
                            "params": JSON.stringify({
                                "locked": !userLocked
                            }),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.query();
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
                $scope.operator.query();

                $scope.createUserModel = {
                    "id": "createUserBtnId",
                    "text": $scope.i18n.user_term_createUser_button,
                    "disable": !userOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        var createWindow = new Window({
                            "winId": "createUserWindowId",
                            "roleType": "SYSTEM_ROLE",
                            "title": $scope.i18n.user_term_createUser_button,
                            "content-type": "url",
                            "content": "app/business/user/views/user/createUser.html",
                            "height": 600,
                            "width": 820,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": null,
                            "close": function (event) {
                                $scope.operator.query();
                            }
                        }).show();
                    }
                };

            }
        ];

        var dependency = [];
        var userModule = angular.module("userMgr.user", dependency);
        userModule.controller("userMgr.user.ctrl", userCtrl);
        return userModule;
    });
