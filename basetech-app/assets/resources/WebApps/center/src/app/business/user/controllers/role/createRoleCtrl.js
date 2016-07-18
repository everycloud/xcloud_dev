/*global define*/
define([
    'jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/user/service/roleService",
    "language/keyID",
    'tiny-widgets/Message',
    "app/services/exceptionService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
],
    function ($, angular, http, UnifyValid, ValidatorService, RoleService, keyID, Message, ExceptionService) {
        "use strict";
        var createRoleCtrl = ['$scope', 'camel', 'validator',
            function ($scope, camel, validator) {
                var user = $("html").scope().user;
                var colon = ":";
                $scope.defaultPrivilegeName = ["role_role_add_option_FusionComputeView_value"];

                $scope.roleService = new RoleService();
                var rightTreeData = [
                    {
                        id: "0",
                        pId: null,
                        name: $scope.i18n.user_term_authorizationList_label,
                        open: true
                    }
                ];
                $scope.name = {
                    "id": "roleNameId",
                    "value": "",
                    "label": $scope.i18n.role_term_roleName_label + colon,
                    "require": true,
                    "tooltip": $scope.i18n.common_term_composition1_valid + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(20):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:20}) + ";regularCheck(" + validator.userNameRe + "):" +
                        $scope.i18n.common_term_composition1_valid
                };
                var roleTypeValues = [
                    {
                        "key": "SYSTEM_ROLE",
                        "text": $scope.i18n.role_term_sysMgrRole_value,
                        "checked": true
                    }
                ];

                $scope.roleType = {
                    "id": "roleTypeId",
                    "label": $scope.i18n.role_term_roleType_label + colon,
                    "require": true,
                    "values": roleTypeValues,
                    "change": function () {
                        var roleType = $("#" + $scope.roleType.id).widget().opChecked("checked");
                        $scope.operator.initLeftTree(roleType);
                    },
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
                $scope.createBtn = {
                    "id": "createRoleCreateBtnId",
                    "text": $scope.i18n.common_term_create_button,
                    "create": function () {
                        // 校验是否选择了权限
                        var privileges = $scope.roleService.getPrivilegeList($("#" + $scope.rightTree.id).widget().getZTreeObj(), "0");
                        if (!privileges || privileges.length === 0) {
                            $scope.operator.selectPrivilegeMsg();
                            return;
                        }

                        var result = UnifyValid.FormValid($("#createRole"));
                        if (!result) {
                            return;
                        }

                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles",
                                o: {
                                    "tenant_id": 1
                                }
                            },
                            "params": JSON.stringify({
                                name: $("#roleNameId").widget().getValue(),
                                description: $("#roleDescription").widget().getValue(),
                                type: $scope.operator.getRoleType(),
                                privilegeList: privileges
                            }),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $("#createRoleWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response, $("#createRoleWindowId").widget());
                            });
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "createRoleCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "cancel": function () {
                        $("#createRoleWindowId").widget().destroy();
                    }
                };
                $scope.operator = {
                    "getRoleType": function () {
                        return $("#" + $scope.roleType.id).widget().opChecked("checked");
                    },
                    "initLeftTree": function (roleType) {
                        $scope.leftTree.values = [];
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles/{roletype}/privileges",
                                o: {
                                    "tenant_id": 1,
                                    "roletype": roleType
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (data) {
                            $scope.$apply(function () {
                                var rightTreeValues = [];
                                for (var index in data.privilegeList) {
                                    if (data.privilegeList[index].parentId == "0" && $.inArray(data.privilegeList[index].name, $scope.defaultPrivilegeName) != -1) {
                                        rightTreeValues.push(data.privilegeList[index]);
                                        data.privilegeList.splice(index, 1);
                                    }
                                }
                                $scope.leftTree.values = $scope.roleService.initTree(data.privilegeList, keyID);
                                $scope.rightTree.values = $scope.roleService.initTree(rightTreeValues, keyID);
                            });
                        });
                        deferred.fail(function (data) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(data);
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
                            ]
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
                $scope.operator.initLeftTree("SYSTEM_ROLE");
            }
        ];
        var app = angular.module("userMgr.role.create", ['ng', "wcc"]);
        app.controller("userMgr.role.create.ctrl", createRoleCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    });
