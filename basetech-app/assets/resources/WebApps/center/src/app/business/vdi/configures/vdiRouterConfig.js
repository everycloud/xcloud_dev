/**
 * 修改人：
 * 修改时间：14-2-24
 */
define(["tiny-lib/angular",
    "ui-router/angular-ui-router"],
    function (angular, router) {
        "use strict";

        //定义框架的路由配置module
        var systemConfig = ["$stateProvider", "$urlRouterProvider", "$controllerProvider", function ($stateProvider, $urlRouterProvider, $controllerProvider) {

            var registerState = function (state, options) {
                $stateProvider.state(state, {
                    url: options.url,
                    templateUrl: options.templateUrl,
                    controller: options.controller,
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                options.controllerUrl
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register(options.controller, ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
            };

            registerState("vdi", {
                url: "/vdi?id",
                templateUrl: "app/business/vdi/views/vdi.html",
                controller: "vdi.ctrl",
                controllerUrl: "app/business/vdi/controllers/vdiCtrl"
            });
        }];

        var dependency = [
            "ui.router"
        ];
        var system = angular.module("vdi.config", dependency);
        system.config(systemConfig);
        return system;
    });