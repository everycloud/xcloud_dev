define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/router/routerService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "fixtures/network/router/routerFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, routerService) {
    "use strict";
    var ctrl = ["$scope", "serviceSrv",
        function ($scope, serviceSrv) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            $scope.params = $("#modifyRouterWindow").widget().option("params");
            $scope.close = function () {
                $("#modifyRouterWindow").widget().destroy();
            };
            $scope.receiveBand = "";
            $scope.sendBand = "";
            $scope.info = {
                receiveBand: {
                    "id": "modify-router-info-receiveBand",
                    label: i18n.perform_term_receiveBand_label + ":",
                    require: true,
                    value: ""
                },
                sendBand: {
                    "id": "modify-router-info-sendBand",
                    label: i18n.perform_term_sendBandMbps_label + ":",
                    require: true,
                    value: ""
                },
                okBtn: {
                    "id": "modify-router-info-ok",
                    "text": i18n.common_term_confirm_label,
                    "click": function () {
                        var promise = serviceSrv.updateRouter({});
                        promise.then(function (data) {
                            $scope.close();
                            $("#vpcmanager-router").scope().$emit("createdRouterSuccessEvent");
                        });
                    }
                },
                cancelBtn: {
                    "id": "modify-router-info-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };
        }
    ];
    var modifyRouter = angular.module("modifyRouter", ["ng", "ngSanitize", "wcc"]);
    modifyRouter.controller("modifyCtrl", ctrl);

    modifyRouter.service("camel", http);
    modifyRouter.service("exception", exceptionService);
    modifyRouter.service("serviceSrv", routerService);
    return modifyRouter;
});
