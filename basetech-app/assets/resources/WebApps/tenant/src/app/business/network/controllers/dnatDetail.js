define([
    "sprintf",
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "language/keyID",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    'app/services/validatorService',
    'app/services/exceptionService',
    "app/business/network/services/networkService"
], function (sprintf, $, angular, keyIDI18n, Window, Message, UnifyValid, http, validator, exception, networkService) {
    "use strict";
    var dnatDetailCtrl = ["$scope", "$q", "camel", "validator", "exception",
        function ($scope, $q, camel, validator, exception) {
            // 公共参数和服务
            var user = $("html").scope().user || {};
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var networkServiceIns = new networkService(exception, $q, camel);
            $scope.dnetData = null;

            $scope.startTime = {
                "label": i18n.common_term_startTime_label + ":",
                "value": "2013-08-11"
            };
            $scope.endTime = {
                "label": i18n.common_term_endTime_label + ":",
                "value": "2013-08-12"
            };

            $scope.init = function () {
                var dnetDataT = $scope.dnetData || {};
                $scope.$apply(function () {
                    $scope.startTime.value = dnetDataT.startTime || "";
                    $scope.endTime.value = dnetDataT.endTime || "";
                });
            };
        }
    ];

    var vmDetailModel = angular.module("network.dnat.detail", ["ng", "wcc"]);
    vmDetailModel.controller("network.dnat.detail.ctrl", dnatDetailCtrl);
    vmDetailModel.service("camel", http);
    vmDetailModel.service("exception", exception);
    vmDetailModel.service("validator", validator);

    return vmDetailModel;
});
