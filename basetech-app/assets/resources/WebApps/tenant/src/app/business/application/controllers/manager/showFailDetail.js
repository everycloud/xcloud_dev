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
    "tiny-widgets/Tabs",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "fixtures/ecsFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, Button, Select, Tabs) {
    "use strict";

    var showFailCtrl = ["$scope", "$compile", "camel",
        function ($scope, $compile, camel) {
            var htmlScope = $("html").scope();
            var lang = htmlScope.urlParams.lang;

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            $scope.curAppInfo = $("#show_createAppFail_Detail_winId").widget().option("curAppInfo");

            $scope.fail = {
                "label": i18n.common_term_failCause_label+":",
                "value": ""
            };

            function init() {
                if (!$scope.curAppInfo.stackStatusReason) {
                    return;
                }
                if (lang === "en") {
                    $scope.fail.value = $scope.curAppInfo.stackStatusReason.en_US;
                } else {
                    $scope.fail.value = $scope.curAppInfo.stackStatusReason.zh_CN;
                }
            }

            init();
        }
    ];

    var deployMgrModule = angular.module("app.list.showFail", ['ng', 'wcc', "ngSanitize"]);
    deployMgrModule.controller("app.list.showFail.ctrl", showFailCtrl);
    deployMgrModule.service("camel", http);
    return deployMgrModule;
});
