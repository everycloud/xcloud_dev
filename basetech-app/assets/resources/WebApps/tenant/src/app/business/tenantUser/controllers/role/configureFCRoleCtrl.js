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
        var configureFCRoleCtrl = ["$scope", "camel",
            function ($scope, camel) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.roleType = {
                    "id": "roleTypeId",
                    "label": i18n.role_term_roleType_label,
                    "layout": "vertical",
                    "values": [{
                        "key": "1",
                        "text": i18n.role_term_FCroleMgr_label,
                        "checked": true
                    }, {
                        "key": "2",
                        "text": i18n.role_term_FCroleView_label,
                        "checked": false
                    }],
                    "change": function () {}
                };
                $scope.modifyBtn = {
                    "id": "modifyBtnId",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        $("#configureFCRoleWindowId").widget().destroy();
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#configureFCRoleWindowId").widget().destroy();
                    }
                };
            }
        ];
        var dependency = ["ng", "wcc", "ngSanitize"];
        var app = angular.module("userMgr.role.configure.fcRole", dependency);
        app.controller("userMgr.role.configure.fcRole.ctrl", configureFCRoleCtrl);
        app.service("camel", http);
        return app;
    });
