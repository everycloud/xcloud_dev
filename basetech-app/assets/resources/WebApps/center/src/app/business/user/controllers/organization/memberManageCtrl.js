/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/userService",
    "app/services/exceptionService",
    "app/services/commonService",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
],
    function ($, angular, http, UserService, ExceptionService, commonService, Message, Window) {
        "use strict";
        var memberManageCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                var user = $("html").scope().user;
                $scope.i18n = $("html").scope().i18n;
                $scope.isServiceCenter = $("html").scope().isServiceCenter;
                //组织操作权限
                var ORG_OPERATE = "108000";
                var hasOrgOperateRight = _.contains(user.privilegeList, ORG_OPERATE);
                //用户操作权限
                var USER_OPERATE = "103001";
                var hasUserOperateRight = _.contains(user.privilegeList, USER_OPERATE);

                $scope.id = $("#memberManageWindowId").widget().option("orgId");
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.userService = new UserService();
                $scope.name = {
                    "id": "orgNameId",
                    "label": $scope.i18n.org_term_vdcName_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false
                };
                $scope.description = {
                    "id": "orgDescId",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "readonly": false
                };
                $scope.memberListLabel = {
                    "label": $scope.i18n.common_term_memberList_label + ":",
                    "require": false
                };
                $scope.searchBox = {
                    "id": "userSearchBox",
                    "placeholder": $scope.i18n.user_term_findUserName_prom,
                    "width": "160",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.operator.getMember(searchString);
                    }
                };
                $scope.addMemberBtn = {
                    "id": "addMemberBtnId",
                    "text": $scope.i18n.org_term_addExistingUser_button,
                    "disable": !hasOrgOperateRight, //TODO 需要查看用户权限？
                    "click": function () {
                        var createWindow = new Window({
                            "winId": "addMemberWindowId",
                            "title": $scope.i18n.common_term_addmember_button,
                            "content-type": "url",
                            "content": "app/business/user/views/organization/addMember.html",
                            "height": 600,
                            "width": 800,
                            "orgId": $scope.id,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": null,
                            "close": function (event) {
                                $scope.operator.getMember();
                            }
                        }).show();
                    }
                };

                $scope.createUserBtn = {
                    "id": "createUserBtnId",
                    "text": $scope.i18n.user_term_createUser_button,
                    "disable": !hasUserOperateRight || !hasOrgOperateRight,
                    "click": function () {
                        var createWindow = new Window({
                            "winId": "createUserWindowId",
                            "roleType": "SERVICE_ROLE",
                            "orgId": $scope.id,
                            "title": $scope.i18n.user_term_createUser_button,
                            "content-type": "url",
                            "content": "app/business/user/views/user/createUser.html",
                            "height": 600,
                            "width": 800,
                            "maximizable":false,
                            "minimizable":false,
                            "buttons": null,
                            "close": function (event) {
                                $scope.operator.getMember();
                            }
                        }).show();
                    }
                };

                // 根据场景设置用户列表显示列
                var fusionSphereList = [
                    {
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_role_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.role);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.user_term_lockStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lockStatus);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_onlineStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.onLineStatus);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }
                ];

                var openStackList = [
                    {
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.user_term_lockStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lockStatus);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_onlineStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.onLineStatus);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }
                ];
                var columns = [];

                if ($scope.openstack) {
                    columns = openStackList;
                } else {
                    columns = fusionSphereList;
                }

                $scope.memberListTbl = {
                    "id": "memberListTblId",
                    "caption": null,
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
                    "renderRow": function (row, dataitem, index) {
                        // 操作栏
                        var optTemplates = "<div ng-if='hasUserOperateRight'><a href='javascript:void(0)' ng-click='edit()' ng-if='!isCurrentUser'>" + $scope.i18n.common_term_modify_button + "</a>" +
                            "<span ng-if='!isCurrentUser'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                            "<a href='javascript:void(0)' ng-click='delete()' ng-if='!isCurrentUser'>" + $scope.i18n.common_term_delete_button + "</a></div>";
                        var opts = $compile($(optTemplates));
                        var optscope = $scope.$new(false);
                        optscope.hasUserOperateRight = hasUserOperateRight;
                        optscope.isCurrentUser = dataitem.isCurrentUser;
                        optscope.edit = function () {
                            var modifyRoleWindow = new Window({
                                "winId": "modifyRoleWindowId",
                                "userId": dataitem.id,
                                "orgId": $scope.id,
                                "userName": dataitem.name,
                                "title": $scope.i18n.role_term_modifyRole_button,
                                "content-type": "url",
                                "content": "app/business/user/views/organization/modifyRole.html",
                                "height": 200,
                                "width": 400,
                                "maximizable":false,
                                "minimizable":false,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.getMember();
                                }
                            }).show();
                        };
                        if (false) {
                            optscope.delete = function () {
                                var transferUserWindow = new Window({
                                    "winId": "transferUserWindowId",
                                    "userId": dataitem.id,
                                    "title": "选择过户用户",
                                    "content-type": "url",
                                    "content": "app/business/user/views/organization/transferUser.html",
                                    "height": 450,
                                    "width": 600,
                                    "maximizable":false,
                                    "minimizable":false,
                                    "buttons": null,
                                    "close": function (event) {
                                        $scope.operator.getMember();
                                    }
                                }).show();
                            };
                        }
                        optscope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.user_user_del_info_confirm_msg,
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
                                ],
                                "close": function (event) {
                                    $scope.operator.getMember();
                                }
                            });
                            deleteMsg.setButton("okBtn", function () {
                                $scope.operator.delete(dataitem.id, deleteMsg)
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy()
                            });
                            deleteMsg.show();
                        };
                        var optNode = opts(optscope);
                        if ($scope.openstack) {
                            $("td:eq(3)", row).html(optNode);
                        } else {
                            $("td:eq(4)", row).html(optNode);
                        }

                        optNode.find('.dropdown-toggle').dropdown();
                    },

                    "callback": function (evtObj) {
                        $scope.memberListTbl.curPage.pageIndex = evtObj.currentPage;
                        $scope.memberListTbl.displayLength = evtObj.displayLength;
                        $scope.operator.getMember();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.memberListTbl.curPage.pageIndex = evtObj.currentPage;
                        $scope.memberListTbl.displayLength = evtObj.displayLength;
                        $scope.operator.getMember();
                    }
                };
                $scope.operator = {
                    "getOrgDetail": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var orgInfo = response.vdcInfo;
                                if (orgInfo == null) {
                                    return;
                                }
                                $scope.name.value = orgInfo.name;
                                $scope.description.value = orgInfo.description;
                            });
                        });
                    },
                    "modifyOrgDetail": function (params) {
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var orgInfo = response.vdcInfo;
                                if (orgInfo == null) {
                                    return;
                                }
                                $scope.orgDetail.name = orgInfo.name;
                                $scope.description.value = orgInfo.description;

                                var quotaInfo = orgInfo.quotaInfo;
                                var quotaUsage = orgInfo.quotaUsage;
                                $scope.resourceUseInfo.datas = $scope.orgService.getResourceUseInfo(quotaInfo, quotaUsage);
                            });
                        });
                    },
                    "getMember": function (userName) {
                        var params = {};
                        params.start = ($scope.memberListTbl.curPage.pageIndex - 1) * $scope.memberListTbl.displayLength;
                        params.limit = $scope.memberListTbl.displayLength;
                        params.vdcId = $scope.id;
                        if (!!userName) {
                            params.userName = userName;
                        }
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/users/list",
                                o: {
                                    "tenant_id": "1"
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response == null || response == undefined) {
                                    return;
                                }
                                var memberListRes = response.userList;
                                if (memberListRes == null) {
                                    return;
                                }
                                $scope.memberListTbl.totalRecords = response.total;
                                $scope.operator.constructMemberList(memberListRes);
                            });
                        });
                    },
                    "constructMemberList": function (memberList) {
                        var members = [];
                        if (!memberList || memberList.length == 0) {
                            $scope.memberListTbl.datas = members;
                            return;
                        }
                        for (var index in memberList) {
                            var member = memberList[index];
                            var isCurrentUser = false;
                            if (member.id == user.id) {
                                isCurrentUser = true;
                            }
                            var tmpMember = {
                                "id": member.id,
                                "name": member.name,
                                "operation": "",
                                "lockStatus": $scope.userService.transferLockStatus(member.lockStatus, $scope.i18n),
                                "onLineStatus": $scope.userService.transferOnLineStatus(member.onLineStatus, $scope.i18n),
                                "isCurrentUser": isCurrentUser
                            };
                            var roleList = member.roleList;
                            if (!roleList || roleList.length == 0) {
                                tmpMember.role = "";
                            } else {
                                var role = "";
                                for (var i in roleList) {
                                    role = role + roleList[i].name + ";";
                                }
                                if (role.length > 1) {
                                    role = role.substr(0, role.length - 1);
                                }
                                tmpMember.role = role;
                            }
                            members.push(tmpMember);
                        }
                        $scope.memberListTbl.datas = members;
                    },
                    "delete": function (userId, deleteMsg) {

                        var deferred = camel["delete"]({
                            "url": {
                                "s": "/goku/rest/v1.5/vdcs/{vdcId}/users/{userId}",
                                "o": {
                                    "vdcId": $scope.id,
                                    "userId": userId
                                }
                            },
                            "userId": user.id
                        });
                        deferred.success(function (data) {
                            deleteMsg.destroy();
                            $scope.operator.getMember();
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                $scope.operator.getOrgDetail();
                $scope.operator.getMember();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.memberManage", dependency);
        app.controller("userMgr.org.memberManage.ctrl", memberManageCtrl);
        app.service("camel", http);
        return app;
    });
