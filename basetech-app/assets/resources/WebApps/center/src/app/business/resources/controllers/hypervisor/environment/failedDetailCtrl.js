/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "language/irm-rpool-exception"], function ($, angular,exception) {
    "use strict";
    var failedDetailCtrl = ["$scope", function ($scope) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#failedDetailWindow").widget();
        $scope.failedInfo = window.option("failedInfo");
        $scope.errorMsg = exception[$scope.failedInfo.errorCode].desc || $scope.failedInfo.errorDesc || $scope.failedInfo.errorCode;
        $scope.label = {
            "message": $scope.i18n.common_term_failDesc_label + ":"
        };
    }];

    var failedDetailModule = angular.module("resources.hypervisor.failedDetail", ["ng"]);
    failedDetailModule.controller("resources.hypervisor.failedDetail.ctrl", failedDetailCtrl);
    return failedDetailModule;
});