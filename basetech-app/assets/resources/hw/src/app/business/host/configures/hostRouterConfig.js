/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/host/factory/hostpool",
        "tiny-directives/FormField",
        "tiny-directives/Textbox",
        'tiny-directives/Step',
        "tiny-directives/FilterSelect",
        'tiny-directives/Slider',
        'tiny-directives/Spinner',
        'tiny-directives/IP'
    ],
    function (angular, router, hostpool) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {

                // 物理机
                $stateProvider.state("host", {
                    url: "/host",
                    templateUrl: "/resources/hw/src/app/business/host/views/hosts.html",
                    controller: "host.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/host/controllers/hostsCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("host.ctrl", ctrl);
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
        ];
        var hostConfig = angular.module("host.config", dependency);
        hostConfig.factory("hostpool", hostpool);
        hostConfig.config(serviceConfigs);

        return hostConfig;
    });
