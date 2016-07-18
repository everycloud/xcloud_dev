/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/FilterSelect",
        "tiny-directives/CirqueChart"],
    function ($, angular, router) {
        "use strict";
        var config = ["$stateProvider", "$urlRouterProvider", "$controllerProvider", function ($stateProvider, $urlRouterProvider, $controllerProvider) {

            $urlRouterProvider.when("/home", ['$state', function ($state) {
                var scope = $("html").scope();
                if (scope && scope.user && scope.user.orgId === "-1") {
                    return "/ssp/catalog";
                } else {
                    $state.go("home");
                }
            }]);

            $stateProvider.state("home", {
                url: "/home",
                templateUrl: "app/business/tenantHome/views/home.html",
                controller: "home.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = ["app/business/tenantHome/controllers/homeCtrl"];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("home.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });

                        return deferred.promise;
                    }
                }
            });
        }];
        var dependency = ["ui.router"];
        var home = angular.module("home.config", dependency);
        home.config(config);
        return home;
    });
