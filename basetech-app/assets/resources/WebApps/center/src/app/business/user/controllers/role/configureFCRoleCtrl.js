/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "app/services/httpService",
        "fixtures/userFixture"
    ],
    function ($, angular, http) {
        "use strict";
        var configureFCRoleCtrl = ["$scope", "camel",
            function ($scope, camel) {
                $scope.id = $("#configureFCRoleWindowId").widget().option("roleId");
                $scope.roleType = {
                    "id": "roleTypeId",
                    "label": "角色类型",
                    "values": [{
                        "key": 1,
                        "text": "FusionCompute管理员角色",
                        "checked": true
                    }, {
                        "key": 2,
                        "text": "FusionCompute查看员角色",
                        "checked": false
                    }],
                    "change": function () {}
                };
                $scope.modifyBtn = {
                    "id": "modifyBtnId",
                    "text": "确定",
                    "click": function () {
                        $("#configureFCRoleWindowId").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": "取消",
                    "click": function () {
                        $("#configureFCRoleWindowId").widget().destroy();
                    }
                };
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.role.configure.fcRole", dependency);
        app.controller("userMgr.role.configure.fcRole.ctrl", configureFCRoleCtrl);
        app.service("camel", http);
        return app;
    });
