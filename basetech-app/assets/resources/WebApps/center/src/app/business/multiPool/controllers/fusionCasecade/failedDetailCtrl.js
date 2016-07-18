/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "language/ssp-exception"], function ($, angular,exception) {
    "use strict";
    var failedDetailCtrl = ["$scope", function ($scope) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#failedDetailWindow").widget();
        $scope.connectorErrorCode = window.option("connectorErrorCode");
        $scope.errorMsg = exception[$scope.connectorErrorCode] && exception[$scope.connectorErrorCode].desc || $scope.connectorErrorCode;
        $scope.label = {
            "message": $scope.i18n.common_term_failDesc_label + ":"
        };
    }];

    var failedDetailModule = angular.module("multipool.failedDetail", ["ng"]);
    failedDetailModule.controller("multipool.failedDetail.ctrl", failedDetailCtrl);
    return failedDetailModule;
});