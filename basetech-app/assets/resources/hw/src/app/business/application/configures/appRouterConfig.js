/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/application/controllers/appsCtrl",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/FilterSelect",
        "tiny-directives/Searchbox",
    ],
    function (angular, router, appsCtrl) {
        "use strict";


        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
	            //资源
	            $stateProvider.state("apps", {
	                url: "/apps",
	                templateUrl: "/resources/hw/src/app/business/application/views/apps.html",
	                controller: "apps.ctrl"
	            });

                //应用
                $stateProvider.state("apps.list", {
                    url: "/list",
                    templateUrl: "/resources/hw/src/app/business/application/views/appList.html",
                    controller: "apps.list.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appListCtrl' ,//相对于basePath
                            ];

                            require(dependencies, function (appsCtrl) {

                                $rootScope.$apply(function () {
                                    console.log("enter 11111", appsCtrl);
                                    $controllerProvider.register("apps.list.ctrl", appsCtrl);
                                    console.log("exit 11111");
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                
                // 应用实例
                $stateProvider.state("apps.detail", {
                    url: "/detail?appId",
                    templateUrl: "/resources/hw/src/app/business/application/views/appInsDetail.html",
                    controller: "apps.instance.detail.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appInsDetailCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("apps.instance.detail.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                
            }
        ];
        
        var dependency = [
                          "ui.router",
                          appsCtrl.name,
                      ];
        var appConfig = angular.module("app.config", dependency);
        appConfig.config(serviceConfigs);



        return appConfig;
    });
