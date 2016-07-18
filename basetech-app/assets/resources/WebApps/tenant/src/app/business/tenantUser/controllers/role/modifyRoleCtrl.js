define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/business/tenantUser/service/roleService",
        'app/services/messageService',
        "app/services/exceptionService",
        "app/business/tenantUser/service/userDomainService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, RoleService, messageService, exceptionService, userDomainService) {
        "use strict";
        var modifyRoleCtrl = ['$scope', "$q", 'camel', "exception", "message",
            function ($scope, $q, camel, exception, message) {
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var roleService = new RoleService();
                $scope.selLabel = {
                    "unChoosedRightLabel": i18n.common_term_availableSelect_label,
                    "choosedRightLabel": i18n.common_term_choosed_value
                };
                $scope.name = {
                    "id": "roleNameId",
                    "value": "",
                    "label": i18n.role_term_roleName_label + ":",
                    "require": true
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
                var rightTreeData = [{
                    id: "0",
                    pId: null,
                    name: i18n.user_term_authorizationList_label,
                    open: true
                }];
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
                $scope.roleId = $("#modifyRoleWindowId").widget().option("roleId");
                $scope.modifyBtn = {
                    "id": "modifyRoleModifyBtnId",
                    "text": i18n.common_term_modify_button,
                    "click": function () {
                        // 校验是否选择了权限
                        var privileges = roleService.getPrivilegeList($("#" + $scope.rightTree.id).widget().getZTreeObj(), "0");
                        if (undefined === privileges || [] === privileges || privileges.length === 0) {
                            message.promptErrorMsgBox(i18n.role_term_chooseRight_msg);
                            return;
                        }
                        var options = {
                            "privilegeList": privileges,
                            "description": $("#roleDescription").widget().getValue(),
                            "id": $scope.roleId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var promise = serviceInstance.modifyRole(options);
                        promise.then(function (data) {
                            $("#modifyRoleWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "modfiyRoleCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyRoleWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "getRoleDetail": function () {
                        var options = {
                            "id": $scope.roleId,
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var promise = serviceInstance.queryRoleDetail(options);
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                if (response && response.roleInfo) {
                                    var roleInfo = response.roleInfo;
                                    $scope.name.value = roleInfo.name;
                                    $scope.description.value = roleInfo.description;
                                    $scope.rightTree.values = roleService.initTree(roleInfo.privilegeInfo, i18n);
                                }
                                $scope.operator.initLeftTree();
                            });
                        });
                    },
                    "initLeftTree": function () {
                        var options = {
                            "roletype": "SERVICE_ROLE",
                            "vdcId": user.vdcId,
                            "userId": user.id
                        };
                        var promise = serviceInstance.queryPrivilege(options);
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                // 初始化左树
                                var rightTreeObj = $("#" + $scope.rightTree.id).widget().getZTreeObj();
                                var nodes = roleService.moveExistPrivileges(response.privilegeList, rightTreeObj);
                                $scope.leftTree.values = roleService.initTree(nodes, i18n);
                            });
                        });
                    }
                };
                $scope.operator.getRoleDetail();
            }
        ];
        var modifyRoleModule = angular.module("userMgr.role.modify", ['ng', "wcc", "ngSanitize"]);
        modifyRoleModule.controller("userMgr.role.modify.ctrl", modifyRoleCtrl);
        modifyRoleModule.service("camel", http);
        modifyRoleModule.service("exception", exceptionService);
        modifyRoleModule.service("message", messageService);
        return modifyRoleModule;
    });
