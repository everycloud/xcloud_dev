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
        var configureFARoleCtrl = ["$scope", "camel",
            function ($scope, camel) {
                $scope.id = $("#configureFARoleWindowId").widget().option("roleId");
                $scope.showRequire = true;
                $scope.disableConfig = false;
                $scope.configState = {
                    "id": "configStateId",
                    "label": "配置启用状态:",
                    "layout": "vertical",
                    "values": [{
                        "key": 1,
                        "text": "启用",
                        "checked": true
                    }, {
                        "key": 2,
                        "text": "禁用",
                        "checked": false
                    }],
                    "change": function () {
                        setEnableConfig();
                    }
                };
                $scope.roleName = {
                    "id": "roleNameId",
                    "label": "对应角色名称:",
                    "value": ""
                };
                $scope.modifyBtn = {
                    "id": "modifyBtnId",
                    "text": "确定",
                    "click": function () {
                        $("#configureFARoleWindowId").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": "取消",
                    "click": function () {
                        $("#configureFARoleWindowId").widget().destroy();
                    }
                };

                var setEnableConfig = function () {
                    var checked = $("#" + $scope.configState.id).widget().opChecked("checked");
                    if (1 == checked) {
                        $scope.showRequire = true;
                        $scope.disableConfig = false;
                    } else if (2 == checked) {
                        $scope.showRequire = false;
                        $scope.disableConfig = true;
                    } else {}
                };
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.role.configure.faRole", dependency);
        app.controller("userMgr.role.configure.faRole.ctrl", configureFARoleCtrl);
        app.service("camel", http);
        return app;
    });
