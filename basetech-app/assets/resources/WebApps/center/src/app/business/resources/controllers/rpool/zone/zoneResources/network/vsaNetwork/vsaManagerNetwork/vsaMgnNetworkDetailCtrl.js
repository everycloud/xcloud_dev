define(["tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function (angular, httpService, constants, ExceptionService, zoneFixture) {
        "use strict";

        var vsaMgnNetworkDetailCtrl = ["$scope", "camel", function ($scope, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.i18n = $("html").scope().i18n;
            $scope.networkInfo = undefined;

            $scope.operator = {
                "queryDetailInfo": function (zoneid, id) {
                    var queryConfig = constants.rest.VSA_MANAGER_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url + "/{id}", o: {"zoneid": zoneid, "id": id}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    })
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.networkInfo = response;
                            if ($scope.networkInfo.portSetting.outTrafficShapingPolicyFlag) {
                                $scope.networkInfo.portSetting.outTrafficShapingPolicy.priorityStr = $scope.i18n[constants.config.OUT_TRAFFIC_PRIORITY[$scope.networkInfo.portSetting.outTrafficShapingPolicy.priority]];
                            }
                            var ips = ""
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }];

        var dependency = [];
        var vsaMgnNetworkDetailModule = angular.module("vsaMgnNetworkDetailModule", []);
        vsaMgnNetworkDetailModule.controller("vsaMgnNetworkDetailCtrl", vsaMgnNetworkDetailCtrl);
        vsaMgnNetworkDetailModule.service("camel", httpService);
        return vsaMgnNetworkDetailModule;
    })


