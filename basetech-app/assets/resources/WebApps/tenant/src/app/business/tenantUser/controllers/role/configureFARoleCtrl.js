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
        "fixtures/userFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http) {
        "use strict";
        var configureFARoleCtrl = ["$scope", "camel",
            function ($scope, camel) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                $scope.showRequire = true;
                $scope.disableConfig = false;
                $scope.configState = {
                    "id": "configStateId",
                    "label": i18n.role_term_setEnableStatus_label + ":",
                    "layout": "horizon",
                    "values": [{
                        "key": "1",
                        "text": i18n.common_term_enable_button,
                        "checked": true
                    }, {
                        "key": "2",
                        "text": i18n.common_term_disable_button,
                        "checked": false
                    }],
                    "change": function () {
                        setEnableConfig();
                    }
                };
                $scope.roleName = {
                    "id": "roleNameId",
                    "label": i18n.role_term_correspondingRoleName_label + ":",
                    "value": ""
                };
                $scope.modifyBtn = {
                    "id": "modifyBtnId",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        $("#configureFARoleWindowId").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#configureFARoleWindowId").widget().destroy();
                    }
                };

                var setEnableConfig = function () {
                    var checked = $("#" + $scope.configState.id).widget().opChecked("checked");
                    if (1 === checked) {
                        $scope.showRequire = true;
                        $scope.disableConfig = false;
                    } else if (2 === checked) {
                        $scope.showRequire = false;
                        $scope.disableConfig = true;
                    }
                };
            }
        ];

        var dependency = ["ng", "wcc", "ngSanitize"];
        var app = angular.module("userMgr.role.configure.faRole", dependency);
        app.controller("userMgr.role.configure.faRole.ctrl", configureFARoleCtrl);
        app.service("camel", http);
        return app;
    });
