/*global define*/
define([
        'jquery',
        'tiny-lib/angular',
        "app/services/httpService",
        "tiny-common/UnifyValid",
        "app/business/user/service/roleService",
        "language/keyID",
        'tiny-widgets/Message',
        "app/services/exceptionService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function ($, angular, http, UnifyValid, RoleService, keyID, Message, ExceptionService) {
        "use strict";
        var modifyRoleCtrl = ['$scope', 'camel',
            function ($scope, camel) {
                var user = $("html").scope().user;
                var colon = ":";
                $scope.originalRoleType = "";
                $scope.roleService = new RoleService();
                $scope.name = {
                    "id": "roleNameId",
                    "value": "",
                    "label": $scope.i18n.role_term_roleName_label + colon,
                    "require": true
                };
                $scope.roleType = {
                    "id": "roleTypeId",
                    "value": "",
                    "label": $scope.i18n.role_term_roleType_label + colon,
                    "require": true,
                    "values": [{
                        "key": 1,
                        "text": $scope.i18n.role_term_sysMgrRole_value,
                        "checked": true
                    }, {
                        "key": 2,
                        "text": $scope.i18n.role_term_serviceMgrRole_value
                    }],
                    "layout": "vertical"
                };
                $scope.operation = {
                    "id": "roleOperationId",
                    "value": "",
                    "label": $scope.i18n.common_term_operationRight_label + colon,
                    "require": "true"
                };
                $scope.description = {
                    "id": "roleDescription",
                    "value": "",
                    "type": "multi",
                    "label": $scope.i18n.common_term_desc_label + colon,
                    "require": "false",
                    "width": 500,
                    "height": 80,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
                };

                $scope.leftTree = $.extend({
                    id: "leftTreeId",
                    values: []
                }, $scope.roleService.treeConfig);

                var rightTreeData = [{
                    id: "0",
                    pId: null,
                    name: $scope.i18n.user_term_authorizationList_label,
                    open: true
                }];
                $scope.rightTree = $.extend({
                    id: "rightTreeId",
                    values: rightTreeData
                }, $scope.roleService.treeConfig);

                $scope.leftBtn = {
                    "click": function () {
                        var leftTreeObj = $("#" + $scope.leftTree.id).widget().getZTreeObj();
                        var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                        $scope.roleService.movePrivilegeNodes(leftTreeObj, rightTreeObj);
                    }
                };
                $scope.rightBtn = {
                    "click": function () {
                        var leftTreeObj = $("#" + $scope.leftTree.id).widget().getZTreeObj();
                        var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                        $scope.roleService.movePrivilegeNodes(rightTreeObj, leftTreeObj);
                    }
                };
                $scope.roleId = $("#modifyRoleWindowId").widget().option("roleId");
                $scope.modifyBtn = {
                    "id": "modifyRoleModifyBtnId",
                    "text": $scope.i18n.common_term_modify_button || "修改",
                    "click": function () {
                        // 校验是否选择了权限
                        var privileges = $scope.roleService.getPrivilegeList($("#" + $scope.rightTree.id).widget().getZTreeObj(), "0");
                        if (!privileges || privileges.length === 0) {
                            $scope.operator.selectPrivilegeMsg();
                            return;
                        }
                        var result = UnifyValid.FormValid($("#modifyRole"));
                        if (!result) {
                            return;
                        }
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles/{id}",
                                o: {
                                    "tenant_id": 1,
                                    "id": $scope.roleId
                                }
                            },
                            "params": JSON.stringify({
                                privilegeList: privileges,
                                description: $("#roleDescription").widget().getValue()
                            }),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
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
                $scope.cancelBtn = {
                    "id": "modfiyRoleCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyRoleWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getRoleDetail": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles/{id}",
                                o: {
                                    "tenant_id": 1,
                                    "id": $scope.roleId
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                var roleInfo = response.roleInfo;
                                $scope.name.value = roleInfo.name;
                                $scope.description.value = roleInfo.description;
                                $scope.roleType.value = $scope.roleService.transferRoleType(roleInfo.type,keyID);
                                $scope.originalRoleType = roleInfo.type;
                                $scope.rightTree.values = $scope.roleService.initTree(roleInfo.privilegeInfo, keyID);
                                $scope.operator.initLeftTree();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "initLeftTree": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles/{roletype}/privileges",
                                o: {
                                    "tenant_id": 1,
                                    "roletype": $scope.originalRoleType
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                // 初始化左树
                                var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                                var nodes = $scope.roleService.moveExistPrivileges(response.privilegeList, rightTreeObj);
                                $scope.leftTree.values = $scope.roleService.initTree(nodes, keyID);
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });

                    },
                    "selectPrivilegeMsg": function () {
                        var msg = new Message({
                            "type": "error",
                            "title": $scope.i18n.role_term_chooseRight_label,
                            "content": $scope.i18n.role_term_chooseRight_msg,
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
                        msg.setButton("okBtn", function () {
                            msg.destroy();
                        });
                        msg.setButton("cancelBtn", function () {
                            msg.destroy();
                        });
                        msg.show();
                    }
                };
                $scope.operator.getRoleDetail();
            }
        ];
        var modifyRoleModule = angular.module("userMgr.role.modify", ['ng', "wcc"]);
        modifyRoleModule.controller("userMgr.role.modify.ctrl", modifyRoleCtrl);
        modifyRoleModule.service("camel", http);
        return modifyRoleModule;
    });
