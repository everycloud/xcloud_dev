/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "app/business/user/service/orgService",
        "app/services/exceptionService",
        "app/services/messageService",
        "language/keyID",
        "tiny-widgets/Window",
        "tiny-directives/CheckboxGroup",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/userFixture"
    ],
    function ($, angular, httpService, OrgService, ExceptionService, MessageService, keyID, Window) {
        "use strict";
        var setPrivilegeCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                var $rootScope = $("html").scope();
                var user = $rootScope.user;
                var i18n = $rootScope.i18n;
                $scope.orgService = new OrgService();
                $scope.userId = $("#setPrivilegeWindowId").widget().option("userId");
                $scope.domainId = $("#setPrivilegeWindowId").widget().option("domainId");
                // 获取用户已选权限
                $scope.selectedPrivilege = $("#setPrivilegeWindowId").widget().option("domainPrivileges");
                $scope.privilegeGroup = {
                    "id": "privilegeGroupId",
                    "layout": "vertical",
                    "values": []
                };

                // 设置权限复选框
                var constructCheckboxGroup = function (selectedList, allList) {
                    if (!allList) {
                        $scope.privilegeGroup.values = [];
                    }
                    var privileges = [];
                    for (var index in allList) {
                        if (!allList[index]) {
                            continue;
                        }
                        var privilege = {
                            "key": allList[index].id,
                            "text": keyID[allList[index].name] || allList[index].name,
                            "checked": false
                        }
                        if (!selectedList) {
                            privileges.push(privilege);
                            continue;
                        }
                        for (var i in selectedList) {
                            if (selectedList[i].id === allList[index].id) {
                                privilege.checked = true;
                                break;
                            }
                        }
                        privileges.push(privilege);
                    }
                    $scope.privilegeGroup.values = privileges;
                };

                $scope.saveBtn = {
                    "id": "saveBtnId",
                    "text": i18n.common_term_save_label || "保存",
                    "click": function () {
                        $scope.operator.modifyUserPrivilege();
                    }
                };
                //取消按钮
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $("#setPrivilegeWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getUserPrivilege": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/privileges?user-id={user_id}&domain-privilege=true",
                                o: {
                                    "tenant_id": "1",
                                    "user_id": $scope.userId
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var privilegeList = response.privilegeList;
                                if (!privilegeList) {
                                    return;
                                }
                                constructCheckboxGroup($scope.selectedPrivilege, privilegeList)
                            });
                        })
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "modifyUserPrivilege": function () {
                        var privilegeList = $("#privilegeGroupId").widget().opChecked("checked");
                        if (!privilegeList || privilegeList.length === 0) {
                            new MessageService().promptErrorMsgBox(i18n.domain_user_add_info_chooseRight_msg || "请选择至少一个权限");
                            return;
                        }
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/domains/{id}/users/{user_id}",
                                o: {
                                    "tenant_id": "1",
                                    "id": $scope.domainId,
                                    "user_id": $scope.userId
                                }
                            },
                            "params": JSON.stringify({
                                "privilegeList": privilegeList
                            }),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $("#setPrivilegeWindowId").widget().destroy();
                            });
                        })
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                }

                // 获取用户的权限
                $scope.operator.getUserPrivilege();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.domain.setPrivilege", dependency);
        app.controller("userMgr.domain.setPrivilege.ctrl", setPrivilegeCtrl);
        app.service("camel", httpService);
        return app;
    });
