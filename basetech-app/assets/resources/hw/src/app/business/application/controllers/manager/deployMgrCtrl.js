/**
 * Created on 13-12-25.
 */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "tiny-directives/Button",
    "tiny-directives/Select",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "fixtures/ecsFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, Button, Select) {
    "use strict";

    var deployMgrCtrl = ["$scope", "$compile", "camel",
        function ($scope, $compile, camel) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            $scope.curAppId = $("#viewApp_Detail_winId").widget().option("curAppId");
            $scope.resPoolFm = $("#viewApp_Detail_winId").widget().option("resPoolFm");
        }
    ];

    var deployMgrModule = angular.module("app.list.deployMrg", ['ng', 'wcc', "ngSanitize"]);
    deployMgrModule.controller("app.list.deployMrg.ctrl", deployMgrCtrl);
    deployMgrModule.service("camel", http);

    return deployMgrModule;
});
