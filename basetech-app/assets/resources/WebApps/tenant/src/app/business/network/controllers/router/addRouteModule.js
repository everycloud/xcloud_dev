/*global define*/
define([
    "sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/router/routerService",
    "tiny-common/UnifyValid",
    "tiny-lib/underscore",
    "tiny-directives/FormField",
    "tiny-directives/FormField",
    "tiny-directives/IP",
    "fixtures/network/router/routerFixture"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, routerService, UnifyValid, _) {
    "use strict";
    var createCtrl = ["$scope", "serviceSrv",
        function ($scope, serviceSrv) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            $scope.params = $("#addRouteWindow").widget().option("params");
            $scope.info = {
                "subnetIP": {
                    "id": "add-route-subnetip",
                    "label": i18n.common_term_Subnet_label + ":",
                    "type": "ipv4",
                    "require": true,
                    "validate": "required:" +i18n.common_term_null_valid,
                    "width": "216px",
                    "value": ""
                },
                "maskIP": {
                    "id": "add-route-maskip",
                    "label": i18n.common_term_SubnetMask_label + ":",
                    "type": "ipv4",
                    "require": true,
                    "validate": "required:" +i18n.common_term_null_valid,
                    "width": "216px",
                    "value": ""
                },
                "nextIP": {
                    "id": "add-route-nextip",
                    "label": i18n.router_term_nextHopAddr_label + ":",
                    "type": "ipv4",
                    "require": true,
                    "validate": "required:" +i18n.common_term_null_valid,
                    "width": "216px",
                    "value": ""
                },
                okBtn: {
                    "id": "add-route-ok",
                    "text": i18n.common_term_add_button,
                    "disable": false,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#addRouteWindowICT"));
                        if (!valid) {
                            return;
                        }
                        var subnetIP = $("#add-route-subnetip").widget().getValue();
                        var mask = $("#add-route-maskip").widget().getValue();
                        var nextIP = $("#add-route-nextip").widget().getValue();

                        var newRoute = {
                            "subnetIp": subnetIP,
                            "mask": mask,
                            "nexthop": nextIP
                        };
                        var router = $scope.params.router;
                        var routes = [];
                        _.each(router.routes, function (item, index) {
                            if (item) {
                                routes.push(item);
                            }
                        });
                        routes.push(newRoute);
                        var data = {
                            "externalNetworkID": router.externalNetworkID,
                            "enableSnat": router.enableSnat,
                            "routes": routes
                        };
                        var promise = serviceSrv.updateRouter({
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "routerId": router.routerID,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": data
                        });
                        promise.then(function (data) {
                            $scope.close();
                            $("#vpcmanager-router").scope().$emit("createdRouterSuccessEvent");
                        });
                    }
                },
                cancelBtn: {
                    "id": "add-route-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };
            $scope.close = function () {
                $("#addRouteWindow").widget().destroy();
            };
        }
    ];
    var addRoute = angular.module("addRoute", ["ng", "ngSanitize", "wcc"]);
    addRoute.controller("addRoute", createCtrl);

    addRoute.service("camel", http);
    addRoute.service("exception", exceptionService);
    addRoute.service("serviceSrv", routerService);
    return addRoute;
});
