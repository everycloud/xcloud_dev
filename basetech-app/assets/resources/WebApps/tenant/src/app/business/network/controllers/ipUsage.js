/*global define*/
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/httpService',
        "language/keyID",
        "fixtures/network/network/networkListFixture"
    ],
    function ($, angular, http, i18n) {
        "use strict";
        var ipUsageCtrl = ["$scope",
            function ($scope) {
                $scope.i18n = i18n;
                var param = $("#ipUsageWindowId").widget().option("param");
                $scope.showIpByHand = param.showIpByHand;
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];

        var ipUsageCtrlModule = angular.module("network.ipUsage", dependency);
        ipUsageCtrlModule.controller("network.ipUsage.ctrl", ipUsageCtrl);
        ipUsageCtrlModule.service("camel", http);
        return ipUsageCtrlModule;
    }
);
