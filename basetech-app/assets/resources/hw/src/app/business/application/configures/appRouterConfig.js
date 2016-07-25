/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/FilterSelect",
        "tiny-directives/Searchbox",
    ],
    function (angular, router) {
        "use strict";
        
        
        var dependency = [
            "ui.router",
        ];
        var appConfig = angular.module("app.config", dependency);

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {

                // 物理机
                $stateProvider.state("apps", {
                    url: "/apps",
                    templateUrl: "/resources/hw/src/app/business/application/views/apps.html",
                    controller: "appsCtrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appsCtrl' ,//相对于basePath
                            ];

                            require(dependencies, function (appsCtrl) {

                                $rootScope.$apply(function () {
                                    console.log("enter 11111", appsCtrl);
                                    $controllerProvider.register("appsCtrl", appsCtrl);
                                    console.log("exit 11111");
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
            }
        ];
        appConfig.config(serviceConfigs);



        return appConfig;
    });
