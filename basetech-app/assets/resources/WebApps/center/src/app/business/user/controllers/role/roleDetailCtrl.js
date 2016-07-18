/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
/*global define*/
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "app/services/exceptionService",
        "language/keyID",
        "app/services/commonService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField"
    ],
    function ($, angular, http, ExceptionService, keyID, commonService) {
        "use strict";
        var roleDetailCtrl = ["$scope", "camel",
            function ($scope, camel) {
                var user = $("html").scope().user;
                var colon = ":";
                $scope.roleId = "";
                $scope.name = {
                    "value": "",
                    "label": $scope.i18n.role_term_roleName_label + colon,
                    "type": "input",
                    "readonly": true
                };
                $scope.createTime = {
                    "value": "",
                    "label": $scope.i18n.common_term_createAt_label + colon,
                    "type": "input",
                    "readonly": true
                };
                $scope.description = {
                    "value": "",
                    "label": $scope.i18n.common_term_desc_label + colon,
                    "type": "multi",
                    "readonly": true
                };
                $scope.userModel = {
                    "id": "userListId",
                    "caption": null,
                    "datas": [],
                    "columns": [{
                        "sTitle": $scope.i18n.common_term_userName_label,
                        "mData": function(data){
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }, {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function(data){
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "70%",
                        "bSortable": false
                    }],
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": true,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false
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
                                if (!roleInfo) {
                                    return;
                                }

                                $scope.name.value = roleInfo.name;
                                if (roleInfo.defaultRole) {
                                    $scope.description.value = keyID[roleInfo.description] || roleInfo.description;
                                } else {
                                    $scope.description.value = roleInfo.description;
                                }

                                // 显示权限树
                                var privilegeList = roleInfo.privilegeInfo;
                                $scope.roleTree.values = $scope.roleService.initTree(privilegeList, keyID);

                                var userInfo = response.userList;
                                if (!userInfo) {
                                    return;
                                }
                                $scope.userModel.datas = userInfo;

                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    }
                };
            }
        ];

        var app = angular.module("userMgr.role.detail", ['ng', "wcc"]);
        app.controller("userMgr.role.detail.ctrl", roleDetailCtrl);
        app.service("camel", http);
        return app;
    });
