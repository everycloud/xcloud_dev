define(["tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function (angular, httpService, constants, ExceptionService, zoneFixture) {
        "use strict";

        var vtepNetworkDetailCtrl = ["$scope", "camel", function ($scope, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.networkInfo = undefined;
            $scope.label = {
                ipRange : ($("html").scope().i18n.common_term_enableIPsegment_label || "ø…”√IP∂Œ") + ":",
                description : ($("html").scope().i18n.common_term_desc_label || "√Ë ˆ") + ":"
            };
            $scope.operator = {
                "queryDetailInfo": function (zoneid, id) {
                    var queryConfig = constants.rest.VTEP_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url + "/{id}", o: {"zoneid": zoneid, "id": id}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    })
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.networkInfo = response;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }];

        var dependency = [];
        var vtepNetworkDetailModule = angular.module("vtepNetworkDetailModule", []);
        vtepNetworkDetailModule.controller("vtepNetworkDetailCtrl", vtepNetworkDetailCtrl);
        vtepNetworkDetailModule.service("camel", httpService);
        return vtepNetworkDetailModule;
    })


