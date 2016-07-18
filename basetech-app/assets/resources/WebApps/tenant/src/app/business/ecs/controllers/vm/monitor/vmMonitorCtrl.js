/* global define */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        "fixtures/ecsFixture"
    ],
    function (sprintf, $, angular,ngSanitize, keyIDI18n, http) {
        "use strict";

        var vmMonitorCtrl = ["$scope",
            function ($scope) {
                var user = $("html").scope().user || {};
                $scope.showBusiness = (user.cloudType === "IT");
                $scope.url = "app/business/ecs/views/vm/monitor/vmMonitorResource.html";
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
            }
        ];

        var vmMonitorModule = angular.module("ecs.vm.detail.monitor", ['framework', "ngSanitize"]);
        vmMonitorModule.controller("ecs.vm.detail.monitor.ctrl", vmMonitorCtrl);
        vmMonitorModule.service("camel", http);

        return vmMonitorModule;
    }
);
