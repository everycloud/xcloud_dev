define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "tiny-common/UnifyValid",
        "app/services/validatorService",
        "app/business/tenantUser/service/roleService",
        'app/services/messageService',
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, ValidatorService, RoleService, messageService, exceptionService, userDomainService) {
        "use strict";
        var createRoleCtrl = ['$scope', "$q", 'camel', 'validator', "exception", "message",
            function ($scope, $q, camel, validator, exception, message) {
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var roleService = new RoleService();
                var rightTreeData = [{
                    id: "0",
                    pId: null,
                    name: i18n.user_term_authorizationList_label,
                    open: true
                }];
                $scope.selLabel = {
                    "unChoosedRightLabel": i18n.common_term_availableSelect_label,
                    "choosedRightLabel": i18n.common_term_choosed_value
                };
                $scope.name = {
                    "id": "roleNameId",
                    "value": "",
                    "label": i18n.role_term_roleName_label + ":",
                    "require": true,
                    "tooltip": i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "20"),
                    "validate": "required:" + i18n.common_term_null_valid + ";maxSize(20):" +
                        i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 20}) + ";regularCheck(" + validator.orgNameRe + "):" + i18n.common_term_composition1_valid
                };
                $scope.operation = {
                    "id": "roleOperationId",
                    "value": "",
                    "label": i18n.common_term_operationRight_label + ":",
                    "require": "true"
                };
                $scope.description = {
                    "id": "roleDescription",
                    "value": "",
                    "type": "multi",
                    "label": i18n.common_term_desc_label+ ":",
                    "require": "false",
                    "width": 500,
                    "height": 80,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128})
                };

                $scope.leftTree = {
                    id: "leftTreeId",
                    width: "200",
                    height: "300",
                    setting: {
                        view: {
                            selectedMulti: false //true时，按住ctrl可多选
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        check: {
                            autoCheckTrigger: false,
                            chkboxType: {
                                "Y": "ps",
                                "N": "ps"
                            },
                            chkStyle: "checkbox",
                            enable: true,
                            nocheckInherit: false,
                            chkDisabledInherit: false,
                            radioType: "level"
                        },
                        callback: {
                            onCheck: function (event, id, node) {
                                if(id === "leftTreeId" && node.checked){
                                    var tree = $("#" + id).widget().getZTreeObj();
                                    if(node && node.relatedPrivilegeIds && node.relatedPrivilegeIds.length > 0){
                                        var relatedPrivilegeIds = node.relatedPrivilegeIds;
                                        for(var index in relatedPrivilegeIds){
                                            var treeNode = tree.getNodeByParam("id", relatedPrivilegeIds[index]);
                                           if(treeNode){
                                              tree.checkNode(treeNode, true, true);
                                           }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    values: []
                };

                $scope.rightTree = {
                    id: "rightTreeId",
                    width: "200",
                    height: "300",
                    setting: {
                        view: {
                            selectedMulti: false //true时，按住ctrl可多选
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        check: {
                            autoCheckTrigger: false,
                            chkboxType: {
                                "Y": "ps",
                                "N": "ps"
                            },
                            chkStyle: "checkbox",
                            enable: true,
                            nocheckInherit: false,
                            chkDisabledInherit: false,
                            radioType: "level"
                        }
                    },
                    values: rightTreeData
                };

                $scope.leftBtn = {
                    "click": function () {
                        var leftTreeObj = $("#" + $scope.leftTree.id).widget().getZTreeObj();
                        var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                        roleService.movePrivilegeNodes(leftTreeObj, rightTreeObj);
                    }
                };
                $scope.rightBtn = {
                    "click": function () {
                        var leftTreeObj = $("#" + $scope.leftTree.id).widget().getZTreeObj();
                        var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                        roleService.movePrivilegeNodes(rightTreeObj, leftTreeObj);
                    }
                };
                $scope.createBtn = {
                    "id": "createRoleCreateBtnId",
                    "text": i18n.common_term_create_button,
                    "create": function () {
                        var valid = UnifyValid.FormValid($("#createRole"));
                        if (!valid) {
                            return;
                        }
                        // 校验是否选择了权限
                        var privileges = roleService.getPrivilegeList($("#" + $scope.rightTree.id).widget().getZTreeObj(), "0");
                        if (undefined === privileges || [] === privileges || privileges.length === 0) {
                            message.promptErrorMsgBox(i18n.role_term_chooseRight_msg);
                            return;
                        }
                        var options = {
                            "name": $("#roleNameId").widget().getValue(),
                            "description": $("#roleDescription").widget().getValue(),
                            "type": $scope.operator.getRoleType(),
                            "privilegeList": privileges,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var promise = serviceInstance.createRole(options);
                        promise.then(function (response) {
                            $("#createRoleWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "createRoleCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "cancel": function () {
                        $("#createRoleWindowId").widget().destroy();
                    }
                };
                $scope.operator = {
                    "getRoleType": function () {
                        return "SERVICE_ROLE";
                    },
                    "initLeftTree": function (roleType) {
                        var options = {
                            "roletype": roleType,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var promise = serviceInstance.queryPrivilege(options);
                        promise.then(function (data) {
                            $scope.leftTree.values = roleService.initTree(data.privilegeList, i18n);
                        });
                    }
                };
                $scope.operator.initLeftTree("SERVICE_ROLE");
            }
        ];
        var app = angular.module("userMgr.role.create", ['ng', "wcc", "ngSanitize"]);
        app.controller("userMgr.role.create.ctrl", createRoleCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        app.service("validator", ValidatorService);
        app.service("message", messageService);
        return app;
    });
