/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/tenantUser/service/userDomainService",
        "app/services/commonService",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "tiny-directives/Button",
        "tiny-directives/Searchbox",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "fixtures/tenantUserFixture"
    ],
    function ($, angular, userDomainService, commonService, Window, Message, _) {
        "use strict";
        var userCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var i18n = $scope.i18n;
                var user = $scope.user;
                var serviceInstance = new userDomainService(exception, $q, camel);
                var USER_OPERATE = "103001";
                var privilegeList = $("html").scope().user.privilegeList;
                var hasUserOperateRight = _.contains(privilegeList, USER_OPERATE);
                $scope.openstack = (user.cloudType === "ICT" ? true : false);
                $scope.searchOnlineState = {
                    "id": "searchOnlineStateId",
                    "width": "120",
                    "values": [{
                        "selectId": "ALL",
                        "label": i18n.common_term_allStatus_value,
                        "checked": true
                    }, {
                        "selectId": "ONLINE",
                        "label": i18n.common_term_online_value
                    }, {
                        "selectId": "OFFLINE",
                        "label": i18n.common_term_offline_label
                    }],
                    "change": function () {
                        $scope.selectOnlineState = $("#searchOnlineStateId").widget().getSelectedId();
                        if ($scope.selectOnlineState === "ALL") {
                            $scope.selectOnlineState = null;
                        }
                        page.currentPage = 1;
                        $scope.command.getUserListInfo();
                    }
                };
                $scope.searchBox = {
                    "id": "userUserlistSearchBox",
                    "placeholder": i18n.user_term_findUserName_prom,
                    "width": "250",
                    "maxLength": 64,
                    "search": function (searchString) {
                        if (!searchString || searchString === "") {
                            $scope.searchUserStr = null;
                        } else {
                            $scope.searchUserStr = searchString;
                        }
                        page.currentPage = 1;
                        $scope.command.getUserListInfo();
                    }
                };
                $scope.help = {
                    "helpKey": "drawer_user",
                    "tips": i18n.common_term_help_label,
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                //刷新用户列表
                $scope.refresh = {
                    "id": "userUserlistRefreshId",
                    "tips": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.searchUserStr = $("#" + $scope.searchBox.id).widget().getValue();
                        if (!$scope.searchUserStr || $scope.searchUserStr === "") {
                            $scope.searchUserStr = null;
                        }
                        $scope.command.getUserListInfo();
                    }
                };
                //创建用户
                $scope.createBtn = {
                    "id": "userUserlistCreateBtnId",
                    "text": i18n.user_term_createUser_button,
                    "disable": !hasUserOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        var options = {
                            "winId": "createUserWindowId",
                            "title": i18n.user_term_createUser_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/user/createUser.html",
                            "height": 550,
                            "width": 800,
                            "buttons": null,
                            "close": function (event) {
                                $scope.command.getUserListInfo();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.model = {
                    "id": "userUserlistTableId",
                    "datas": [],
                    "columns": getColumns(),
                    "showDetails": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //tips提示
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        if (!$scope.openstack) {
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(7)", nRow).addTitle();
                        }
                        //下钻时传递参数
                        $("td:eq(0)", nRow).bind("click", function () {
                            $scope.userId = aData.id;
                        });
                        //判断操作权限
                        if (!hasUserOperateRight) {
                            return;
                        }
                        //登陆用户不能对自己操作
                        if (aData.id === user.id) {
                            return;
                        }
                        var optScope = $scope.$new(false);
                        //用户同时属于系统侧、租户侧VDC，需要屏蔽掉锁定、修改密码操作
                        var isMenuGray = false;
                        if ($scope.openstack) {
                            isMenuGray = (aData.vdcId === "default");
                        } else {
                            isMenuGray = (aData.vdcId === "1");
                        }
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                        submenus += "<li><a class='btn-link' ng-click='modifyUser()'>" + i18n.common_term_modify_button + "</a></li>";
                        submenus += "<li class='btn-link' ng-click='deleter()'><a>" + i18n.common_term_delete_button + "</a></li>";
                        submenus += isMenuGray ? "<li class='disabled'><a>" + i18n.user_term_resetPsw_button + "</a></li>" : "<li><a class='btn-link' ng-click='resetPwd()'>" + i18n.user_term_resetPsw_button + "</a></li>";
                        submenus += '</ul>' + '</span>';
                        var lockDesc = i18n.user_term_lock_button;
                        if (aData.judgeLockStatus.toUpperCase() === "LOCKED") {
                            lockDesc = i18n.common_term_unlock_button;
                        }
                        var opt = isMenuGray ? ("<div><p class='disabled fl'>" + lockDesc + "</p><span>&nbsp&nbsp&nbsp&nbsp</span>" + submenus + "</div>") : ("<div><a href='javascript:void(0)' ng-click='modLockStatus()'>" + lockDesc + "</a><span>&nbsp&nbsp&nbsp&nbsp</span>" + submenus + "</div>" );
                        var optLink = $compile($(opt));
                        optScope.modifyUser = function(){
                            modifyUser(aData.id);
                        };
                        optScope.deleter = function(){
                            var deleteMsg = new Message({
                                "type": "prompt",
                                "title": i18n.common_term_confirm_label,
                                "content": i18n.user_user_del_info_confirm_msg,
                                "height": "120px",
                                "width": "350px",
                                "buttons": [{
                                    "label": i18n.common_term_ok_button,
                                    "accessKey": '2',
                                    "key": "okBtn",
                                    "default": true,
                                    majorBtn : true
                                }, {
                                    "label": i18n.common_term_cancle_button,
                                    "accessKey": '3',
                                    "key": "cancelBtn",
                                    "default": false
                                }]
                            });
                            deleteMsg.setButton("okBtn", function () {
                                $scope.command.delUser(aData.id);
                                deleteMsg.destroy();
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy();
                            });
                            deleteMsg.show();
                        };
                        optScope.resetPwd = function(){
                            resetPwd(aData.id);
                        };
                        optScope.modLockStatus = function(){
                            modLockStatus(aData);
                        };
                        var optNode = optLink(optScope);
                        if (!$scope.openstack) {
                            $("td:eq(8)", nRow).html(optNode);
                        } else {
                            $("td:eq(6)", nRow).html(optNode);
                        }
                        optNode.find('.dropdown').dropdown();
                    },

                    "callback": function (evtObj) {
                        var displayLength = $("#userUserlistTableId").widget().option("display-length");
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.getUserListInfo();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.getUserListInfo();
                    }
                };
                //不同场景表格显示列不同
                function getColumns(){
                    var columnList = [{
                        "sTitle": "",
                        "sWidth": "40px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    }, {
                        "sTitle": i18n.common_term_role_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.roleList);
                        }
                    }, {
                        "sTitle": i18n.common_term_authenticType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userType);
                        }
                    }, {
                        "sTitle": i18n.user_term_lockStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lockStatus);
                        }
                    }, {
                        "sTitle": i18n.common_term_onlineStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.onLineStatus);
                        }
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(commonService.utc2Local(data.createTime));
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }];
                    var columns = [];
                    if ($scope.openstack) {
                        columns = [];
                        columns.push(columnList[0]);
                        columns.push(columnList[1]);
                        columns.push(columnList[2]);
                        columns.push(columnList[4]);
                        columns.push(columnList[5]);
                        columns.push(columnList[6]);
                        columns.push(columnList[8]);
                    } else {
                        columns = columnList;
                    }
                    return columns;
                }

                //获取显示用户列表中的角色
                function getRolesStr(roleList) {
                    var roleStr = "";
                    _.each(roleList, function (item) {
                        roleStr = roleStr + item.name + "; ";
                    });
                    return roleStr;
                }

                //锁定&解锁用户
                function modLockStatus(aData) {
                    var userId = aData.id;
                    var lockFlag = false;
                    var title = "";
                    var content = "";
                    if (aData.judgeLockStatus.toUpperCase() === "UNLOCKED") {
                        lockFlag = true;
                        title = i18n.common_term_confirm_label;
                        content = i18n.user_user_lock_info_confirm_msg;
                    } else if (aData.judgeLockStatus.toUpperCase() === "LOCKED") {
                        lockFlag = false;
                        title = i18n.common_term_confirm_label;
                        content = i18n.user_user_unlock_info_confirm_msg;
                    }
                    var confirmMsg = new Message({
                        "type": "prompt",
                        "title": title,
                        "content": content,
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
                    confirmMsg.setButton("okBtn", function () {
                        $scope.command.sendLockStatus(userId, lockFlag);
                        confirmMsg.destroy();
                    });
                    confirmMsg.setButton("cancelBtn", function () {
                        confirmMsg.destroy();
                    });
                    confirmMsg.show();
                }

                //重置密码
                function resetPwd(userId) {
                    var options = {
                        "winId": "modifyPwdWindowId",
                        "userId": userId,
                        "title": i18n.user_term_resetPsw_button,
                        "content-type": "url",
                        "content": "app/business/tenantUser/views/user/modifyPwd.html",
                        "height": 250,
                        "width": 500,
                        "buttons": null
                    };
                    var win = new Window(options);
                    win.show();
                }

                //修改用户
                function modifyUser(userId) {
                    var options = {
                        "winId": "modifyUserWindowId",
                        "userId": userId,
                        "title": i18n.user_term_modifyUser_button,
                        "content-type": "url",
                        "content": "app/business/tenantUser/views/user/modifyUser.html",
                        "height": 500,
                        "width": 800,
                        "buttons": null,
                        "close": function (event) {
                            $scope.command.getUserListInfo();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                //处理表格数据
                function dealTableData(item){
                    var lockStatus = "";
                    var userType = "";
                    var onlineStatus = "";
                    item.operation = "";
                    item.detail = {
                        contentType: "url",
                        content: "app/business/tenantUser/views/user/userDetail.html"
                    };
                    //锁定状态
                    lockStatus = item.lockStatus;
                    item.judgeLockStatus = lockStatus;
                    if (lockStatus.toUpperCase() === "LOCKED") {
                        item.lockStatus = i18n.user_term_lock_value;
                    } else if (lockStatus.toUpperCase() === "UNLOCKED") {
                        item.lockStatus = i18n.common_term_unlocked_value;
                    }
                    //用户类型
                    userType = item.userType;
                    if (userType.toUpperCase() === "NATIVE_USER") {
                        item.userType = i18n.user_user_add_para_type_option_local_value;
                    } else if (userType.toUpperCase() === "LDAP_USER") {
                        item.userType = i18n.user_user_add_para_type_option_ad_value;
                    }
                    //用户角色
                    item.roleList = getRolesStr(item.roleList);

                    //在线状态
                    onlineStatus = item.onLineStatus;
                    if (onlineStatus.toUpperCase() === "ONLINE") {
                        item.onLineStatus = i18n.common_term_online_value;
                    } else if (onlineStatus.toUpperCase() === "OFFLINE") {
                        item.onLineStatus = i18n.common_term_offline_label;
                    }
                }
                //Ajax命令
                $scope.command = {
                    //查询用户列表
                    "getUserListInfo": function () {
                        var options = {
                            "start": page.getStart(),
                            "limit": page.displayLength,
                            "userName": $scope.searchUserStr,
                            "userType": null,
                            "onLineStatus": $scope.selectOnlineState,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var deferred = serviceInstance.queryUserlist(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var userListRes = data.userList;
                            _.each(userListRes, dealTableData);
                            $scope.model.datas = userListRes;
                            $scope.model.totalRecords = data.total;
                            $scope.model.displayLength = page.displayLength;
                            $("#userUserlistTableId").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    //删除用户
                    "delUser": function (userId) {
                        var options = {
                            "id": userId,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var deferred = serviceInstance.deleteUser(options);
                        deferred.then(function (data) {
                            $scope.command.getUserListInfo();
                        });
                    },
                    //锁定、解锁用户
                    "sendLockStatus": function (userId, lockFlag) {
                        var options = {
                            "id": userId,
                            "locked": lockFlag,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var deferred = serviceInstance.sendLockStatus(options);
                        deferred.then(function (data) {
                            $scope.command.getUserListInfo();
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.command.getUserListInfo();
                });
            }
        ];

        return userCtrl;
    });
