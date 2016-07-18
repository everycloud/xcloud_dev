/**
 * 定义的整体框架的 路由地址
 */
define(["tiny-lib/angular",
  //  "app/framework/directive/directiveFM",
    "ui-router/angular-ui-router"], function (angular, router) {
    "use strict";

    var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider", function ($stateProvider, $urlRouterProvider, $controllerProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider.state("/home", {
            "url": "/"
        });

        $stateProvider.state("login", {
            "url": "/login",
            "templateUrl": "app/framework/views/login.html",
            "controller": "app.login.ctrl",
            "resolve": {
                deps: function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dependencies = ["app/framework/controllers/loginCtrl"];
                    require(dependencies, function (ctrl) {
                        $rootScope.$apply(function () {
                            $controllerProvider.register("app.login.ctrl", ctrl);
                            deferred.resolve();
                        });
                    });

                    return deferred.promise;
                }
            }
        });

    }];

    //var frameworkConfig = angular.module("frm", ["ui.router", directiveFM.name]);
    var frameworkConfig = angular.module("frm", ["ui.router"]);
    frameworkConfig.config(serviceConfigs);
    return frameworkConfig;
});