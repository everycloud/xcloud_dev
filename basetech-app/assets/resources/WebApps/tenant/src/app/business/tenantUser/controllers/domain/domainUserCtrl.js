/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-26
 */
/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/encoder",
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        'tiny-widgets/Message',
        "app/business/tenantUser/service/userCommonService",
        "app/services/messageService",
        "language/privilegeKeys",
        "app/business/tenantUser/service/userDomainService",
        "fixtures/userFixture",
        "tiny-directives/Searchbox",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular,$encoder,_,Window, Message, UserCommonService, MessageService, PrivilegeKeys, userDomainService) {
        "use strict";
        var domainUserCtrl = ["$scope", "$compile", "$state", "camel", "exception", "$q",
            function ($scope, $compile, $state, camel, exception, $q) {
                var user = $("html").scope().user;
                var userCommonServiceIns = new UserCommonService();
                var i18n = $scope.i18n;
                $scope.serviceInstance = new userDomainService(exception, $q, camel);
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.searchModel = {
                    userName: "",
                    start: "",
                    limit: ""
                };
                $scope.searchBox = {
                    "id": "userSearchBox",
                    "placeholder": i18n.user_term_findUserName_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {
                        $scope.searchModel.userName = searchString;
                        $scope.operator.queryDomainUser();
                    }
                };
                $scope.createUserModel = {
                    "id": "createUserBtnId",
                    "text": i18n.common_term_addmember_button,
                    "disabled": false,
                    "iconsClass": "",
                    "create": function () {
                        var createWindow = new Window({
                            "winId": "addMemberWindowId",
                            "roleType": "SYSTEM_ROLE",
                            "title":i18n.common_term_addmember_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/domain/addMember.html",
                            "domainId": $scope.domainId,
                            "exception": exception,
                            "height": 600,
                            "width": 800,
                            "buttons": [
                                null,
                                null
                            ],
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
                    text: i18n.common_term_fresh_button,
                    tip: "",
                    click: function () {
                        $scope.searchModel.userName = $("#" + $scope.searchBox.id).widget().getValue();
                        $scope.operator.queryDomainUser();
                    }
                };

                var addOperatorDom = function (dataitem, row) {
                    // 操作栏
                    var optTemplates = "<div><a href='javascript:void(0)' ng-click='removeUser()'>" + i18n.common_term_move_button + "</a><span>&nbsp&nbsp&nbsp&nbsp</span>" +
                        "<a href='javascript:void(0)' ng-click='setPrivilege()'>" + i18n.user_term_modifyRight_button + "</a></div>";
                    var opts = $compile($(optTemplates));
                    var optscope = $scope.$new(false);
                    //移除用户
                    optscope.removeUser = function () {
                        var removeUserMsg = new Message({
                            "type": "prompt",
                            "title": i18n.common_term_confirm_label,
                            "content":i18n.domain_user_move_info_confirm_msg,
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label:i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                'default': true
                            }, {
                                label: i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                'default': false
                            }]
                        });
                        removeUserMsg.setButton("okBtn", function () {
                            $scope.operator.removeUser(dataitem.userId, removeUserMsg);
                        });
                        removeUserMsg.setButton("cancelBtn", function () {
                            removeUserMsg.destroy();
                        });
                        removeUserMsg.show();
                    };

                    //修改权限
                    optscope.setPrivilege = function () {
                        var setPrivilegeWindow = new Window({
                            "winId": "setPrivilegeWindowId",
                            "userId": dataitem.userId,
                            "domainId": $scope.domainId,
                            "domainPrivileges": dataitem.domainPrivileges,
                            "exception": exception,
                            "title":i18n.user_term_modifyRight_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/domain/setPrivilege.html",
                            "height": 550,
                            "width": 400,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.queryDomainUser();
                            }
                        }).show();
                    };

                    var optNode = opts(optscope);
                    $("td:eq(2)", row).html(optNode);
                };

                // 根据场景设置用户列表显示列
                var userList = [{
                    "sTitle": i18n.common_term_userName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.userName);
                    },
                    "bSortable": false
                }, {
                    "sTitle":i18n.common_term_domainRight_label,
                    "mData": "domainPrivilegesStr",
                    "mWidth": "40%",
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "operation",
                    "bSortable": false
                }];

                $scope.domainUserTable = {
                    "id": "userListId",
                    "caption": null,
                    "visibility": {
                        "activate": "click",
                        "aiExclude": [0, 2],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {}
                    },
                    "data": [],
                    "columns": userList,
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
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "showDetails": false,

                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(1)", row).addTitle();
                        // 添加操作
                        addOperatorDom(dataitem, row);
                    },
                    "callback": function (evtObj) {
                        $scope.domainUserTable.curPage.pageIndex = evtObj.currentPage;
                        $scope.domainUserTable.displayLength = evtObj.displayLength;
                        $scope.operator.queryDomainUser();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.domainUserTable.curPage.pageIndex = evtObj.currentPage;
                        $scope.domainUserTable.displayLength = evtObj.displayLength;
                        $scope.operator.queryDomainUser();
                    }
                };

                $scope.operator = {
                    "queryDomainUser": function () {
                        var domainId = $scope.domainId;
                        if (!domainId || "domainParentId" === domainId) {
                            var dom = document.getElementById($scope.domainUserTable.id);
                            dom && $(dom).widget().option("data", []);
                            return;
                        }
                        var url = "/goku/rest/v1.5/" + user.vdcId + "/domains/{id}/users?";
                        url = url + "start=" + ($scope.domainUserTable.curPage.pageIndex - 1) * $scope.domainUserTable.displayLength;
                        url = url + "&limit=" + $scope.domainUserTable.displayLength;
                        var userName = $scope.searchModel.userName;
                        if (userName !== "") {
                            url = url + "&user-name=" + userName;
                        }
                        /* var promise = $scope.serviceInstance.queryDomainUser({"url":url, "user": user,"domainId":domainId });
                    promise.then(function (response) {
                        if(!response){
                            return;
                        }
                        var data = [];
                        var userListRes = response.userOnDomain || [];
                        for (var item in userListRes) {
                            userListRes[item].operation = "";
                            var privilegeList = userListRes[item].domainPrivileges;
                            var privileges = "";
                            if (privilegeList) {
                                for (var index in privilegeList) {
                                    var tmp = PrivilegeKeys[privilegeList[index].name] || privilegeList[index].name;
                                    privileges = privileges + tmp + ";";
                                }
                                if (privileges.length > 1) {
                                    privileges = privileges.substr(0, privileges.length - 1);
                                }
                            }
                            userListRes[item].domainPrivilegesStr = privileges;
                            data.push(userListRes[item]);
                        }
                        $scope.domainUserTable.data = data;
                        $scope.domainUserTable.totalRecords = response.total;
                    });*/

                        var deferred = camel.get({
                            "url": {
                                s: url,
                                o: {
                                    "id": domainId
                                }
                            },
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
                                            var tmp = i18n[privilegeList[index].name] || privilegeList[index].name;
                                            privileges = privileges + tmp + ";";
                                        }
                                        if (privileges.length > 1) {
                                            privileges = privileges.substr(0, privileges.length - 1);
                                        }
                                    }
                                    userListRes[item].domainPrivilegesStr = privileges;
                                    data.push(userListRes[item]);
                                }
                                $scope.domainUserTable.data = data;
                                $scope.domainUserTable.totalRecords = response.total;
                            });
                        });
                    },
                    // 移除用户
                    "removeUser": function (userId, deleteMsg) {
                        var promise = $scope.serviceInstance.deleteDomainUser({
                            "user": user,
                            "domainId": $scope.domainId,
                            "userId": userId
                        });
                        promise.then(function (response) {
                            deleteMsg.destroy();
                            $scope.operator.queryDomainUser();
                        });
                    }
                };

                // 初始化时查询用户列表页面
                $scope.operator.queryDomainUser();
            }
        ];

        return domainUserCtrl;
    });
