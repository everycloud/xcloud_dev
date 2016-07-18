/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/competitionConfig",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/Select",
    "fixtures/userFixture"
],
    function ($, angular, http, ExceptionService,Competition) {
        "use strict";
        var modifyRoleCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                $scope.orgId = $("#modifyRoleWindowId").widget().option("orgId");
                $scope.userId = $("#modifyRoleWindowId").widget().option("userId");
                $scope.userName = $("#modifyRoleWindowId").widget().option("userName");
                var i18n = $scope.i18n || {};
                var colon = ":";
                $scope.name = {
                    "id": "userNameId",
                    "label": (i18n.common_term_userName_label || "用户名") + colon,
                    "require": true,
                    "value": $scope.userName,
                    "type": "input",
                    "readonly": false
                };
                $scope.roleSelectModel = {
                    "id": "roleSelectId",
                    "label": (i18n.common_term_role_label || "角色") + colon,
                    "mode": "multiple",
                    "width": "200px",
                    "values": []
                };
                $scope.modifyBtn = {
                    "id": "modifyRoleBtnId",
                    "text": i18n.common_term_ok_button || "确定",
                    "click": function () {
                        $scope.operator.changeRole();
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyRoleCancelBtn",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $("#modifyRoleWindowId").widget().destroy();
                    }
                };
                $scope.operator = {
                    "getSelectedRole": function (allRoleList) {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{vdcId}/users/{userId}/roles",
                                o: {
                                    "vdcId": $scope.orgId,
                                    "userId": $scope.userId
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var roleList = [];
                                if (response && response.roleList) {
                                    roleList = response.roleList;
                                }

                                $scope.operator.constructUserRoles(roleList, allRoleList);
                            });
                        });
                    },
                    "getAllRole": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles?type={roleType}",
                                o: {
                                    "tenant_id": 1,
                                    "roleType": "SERVICE_ROLE"
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response == null || response == undefined) {
                                    return;
                                }
                                var datas = [];
                                var roleListRes = response.roleList;
                                for (var index in roleListRes) {
                                    if (Competition.isBaseOnVmware && roleListRes[index].name === "user") {
                                        //openstack接入vmware场景，去除user角色
                                        continue;
                                    }
                                    datas.push(roleListRes[index]);
                                }
                                $scope.operator.getSelectedRole(datas);
                            });
                        });
                    },
                    "constructUserRoles": function (selectedRoles, allRoles) {
                        var values = [];
                        for (var index in allRoles) {
                            var checked = false;
                            for (var i in selectedRoles) {
                                if (allRoles[index].id == selectedRoles[i].id) {
                                    checked = true;
                                    break;
                                }
                            }
                            values.push({
                                "selectId": allRoles[index].id,
                                "label": allRoles[index].name,
                                "checked": checked
                            });
                        }
                        $scope.roleSelectModel.values = values;
                    },
                    "changeRole": function () {
                        var roleIds = $("#" + $scope.roleSelectModel.id).widget().getSelectedId();
                        if (!roleIds) {
                            return;
                        }
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{vdcId}/users/{userId}/roles",
                                o: {
                                    "vdcId": $scope.orgId,
                                    "userId": $scope.userId
                                }
                            },
                            "params": JSON.stringify({
                                "roleIds": roleIds
                            }),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $("#modifyRoleWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };

                // 初始化角色选择框
                $scope.operator.getAllRole();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.memberManage.modifyRole", dependency);
        app.controller("userMgr.org.memberManage.modifyRole.ctrl", modifyRoleCtrl);
        app.service("camel", http);
        return app;
    });
