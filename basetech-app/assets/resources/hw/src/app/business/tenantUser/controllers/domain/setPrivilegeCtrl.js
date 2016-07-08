/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-20
 */
/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "app/business/tenantUser/service/orgService",
        "app/business/tenantUser/service/userCommonService",
        "app/services/messageService",
        "tiny-widgets/Window",
        "app/business/tenantUser/service/userDomainService",
        "tiny-directives/CheckboxGroup",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/userFixture"
    ],
    function ($, angular, httpService, OrgService, UserCommonService, MessageService, Window, userDomainService) {
        "use strict";

        var setPrivilegeCtrl = ["$scope", "$compile", "camel", "$q",
            function ($scope, $compile, camel, $q) {
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                $scope.orgService = new OrgService();
                $scope.userId = $("#setPrivilegeWindowId").widget().option("userId");
                $scope.domainId = $("#setPrivilegeWindowId").widget().option("domainId");
                var exception = $("#setPrivilegeWindowId").widget().option("exception");
                $scope.serviceInstance = new userDomainService(exception, $q, camel);
                // 获取用户已选权限
                $scope.selectedPrivilege = $("#setPrivilegeWindowId").widget().option("domainPrivileges");
                $scope.privilegeGroup = {
                    "id": "privilegeGroupId",
                    "layout": "vertical",
                    "values": []
                };

                // 设置权限复选框
                var constructCheckboxGroup = function (selectedList, allList,PrivilegeKeys) {
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
                            "text": PrivilegeKeys[allList[index].name] || allList[index].name,
                            "checked": false
                        };
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
                    "text":i18n.common_term_save_label,
                    "click": function () {
                        $scope.operator.modifyUserPrivilege();
                    }
                };
                //取消按钮
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#setPrivilegeWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getUserPrivilege": function () {
                        var promise = $scope.serviceInstance.getUserPrivilege({
                            "user": user,
                            "userId": $scope.userId
                        });
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var privilegeList = response.privilegeList;
                                if (!privilegeList) {
                                    return;
                                }
                                constructCheckboxGroup($scope.selectedPrivilege, privilegeList,i18n);
                            });
                        });
                    },
                    "modifyUserPrivilege": function () {
                        var privilegeList = $("#privilegeGroupId").widget().opChecked("checked");
                        if (!privilegeList || privilegeList.length === 0) {
                            new MessageService().promptErrorMsgBox(i18n.domain_user_add_info_chooseRight_msg);
                            return;
                        }
                        var promise = $scope.serviceInstance.modifyUserPrivilege({
                            "user": user,
                            "userId": $scope.userId,
                            "domainId": $scope.domainId,
                            "privilegeList": privilegeList
                        });
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                $("#setPrivilegeWindowId").widget().destroy();
                            });
                        });
                    }
                };

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
