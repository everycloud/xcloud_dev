/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/tenantUser/service/roleService",
        "app/business/tenantUser/service/userDomainService",
        "tiny-lib/encoder",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, RoleService, userDomainService) {
        "use strict";
        var roleDetailCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                //公共服务实例
                var serviceInstance = new userDomainService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                $scope.roleService = new RoleService();
                $scope.roleId = "";
                $scope.name = {
                    "value": "",
                    "label": $scope.i18n.role_term_roleName_label + ":",
                    "type": "input",
                    "readonly": true
                };
                $scope.createTime = {
                    "value": "",
                    "label": $scope.i18n.common_term_createAt_label+ ":",
                    "type": "input",
                    "readonly": true
                };
                $scope.description = {
                    "value": "",
                    "label": $scope.i18n.common_term_desc_label+ ":",
                    "type": "multi",
                    "readonly": true
                };
                $scope.userModel = {
                    "id": "userListId",
                    "caption": null,
                    "datas": [],
                    "columns": [{
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "70%",
                        "bSortable": false
                    }],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 30, 50, 100],
                    "displayLength": 10,
                    "enableFilter": true,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false
                };

                $scope.operator = {
                    "getRoleDetail": function () {
                        var options = {
                            "id": $scope.roleId,
                            "userId": user.id,
                            "vdcId": user.vdcId
                        };
                        var promise = serviceInstance.queryRoleDetail(options);
                        promise.then(function (response) {
                            $scope.$apply(function () {
                                var roleInfo = response.roleInfo;
                                $scope.name.value = roleInfo.name;
                                if (roleInfo.defaultRole) {
                                    $scope.description.value = $scope.i18n[roleInfo.description] || roleInfo.description;
                                } else {
                                    $scope.description.value = roleInfo.description;
                                }

                                // 显示权限树
                                var privilegeList = roleInfo.privilegeInfo;
                                $scope.roleTree.values = $scope.roleService.initTree(privilegeList, $scope.i18n);

                                var userInfo = response.userList;
                                if (userInfo === undefined) {
                                    return;
                                }
                                $scope.userModel.datas = userInfo;
                            });
                        });
                    }
                };

                $scope.roleTree = {
                    id: "roleTreeId_" + new Date().getTime(),
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
                            enable: false,
                            nocheckInherit: false,
                            chkDisabledInherit: false,
                            radioType: "level"
                        },
                        callback: {
                            onClick: function (event, id, node) {}
                        }
                    },
                    values: []
                };
            }
        ];

        var app = angular.module("userMgr.role.detail", ['ng', "wcc", "ngSanitize"]);
        app.controller("userMgr.role.detail.ctrl", roleDetailCtrl);
        app.service("camel", http);
        app.service("exception", exceptionService);
        return app;
    });
