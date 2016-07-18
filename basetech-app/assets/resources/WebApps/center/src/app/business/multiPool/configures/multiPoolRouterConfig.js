define(["tiny-lib/angular",
    "ui-router/angular-ui-router",
    "app/business/multiPool/controllers/multiPoolCtrl",
    "tiny-directives/Button",
    "tiny-directives/Table",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "tiny-directives/Step",
    "tiny-directives/Select",
    "tiny-directives/FilterSelect",
    "tiny-directives/Layout",
    'tiny-directives/Menubutton',
    'tiny-directives/FileUpload',
    "tiny-directives/Tabs",
    "tiny-directives/Slider",
    "tiny-directives/Spinner",
    "tiny-directives/IP",
    'tiny-directives/RadioGroup'
],
    function (angular, router, multiPoolCtrl) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$controllerProvider", function ($stateProvider, $controllerProvider) {

            $stateProvider.state("serviceMgr", {
                url: "/service",
                templateUrl: "app/framework/views/left.html",
                controller: "multiPool.ctrl"
            });
            //标签管理
            $stateProvider.state("serviceMgr.label", {
                url: "/label",
                templateUrl: "app/business/tag/views/label/label.html",
                controller: "service.label.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/tag/controllers/label/labelCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("service.label.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 云资源池
            $stateProvider.state("serviceMgr.multiPool", {
                url: "/multiPool",
                // 相对于根路径
                templateUrl: "app/business/multiPool/views/fusionCasecade/pool.html",
                controller: "multiPool.pool.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/fusionCasecade/poolCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.pool.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //资源池详情
            $stateProvider.state("service.poolInfo", {
                url: "/poolInfo?infraId&name&from&type",
                templateUrl: "app/business/multiPool/views/poolInfo/poolInfo.html",
                controller: "multiPool.poolInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/poolInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.poolInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //资源池概览
            $stateProvider.state("service.poolInfo.summary", {
                url: "/summary",
                templateUrl: "app/business/multiPool/views/poolInfo/summary/summary.html",
                controller: "multiPool.poolInfo.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/summary/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.poolInfo.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //可用分区
            $stateProvider.state("service.poolInfo.availableZone", {
                url: "/availableZone",
                templateUrl: "app/business/multiPool/views/poolInfo/availableZone/availableZone.html",
                controller: "multiPool.poolInfo.availableZone.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/availableZone/availableZoneCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.poolInfo.availableZone.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //公网IP池 for service center
            $stateProvider.state("service.poolInfo.publicIpPool", {
                url: "/publicIpPool",
                templateUrl: "app/business/multiPool/views/poolInfo/publicIpPool/publicIpPool.html",
                controller: "multiPool.poolInfo.publicIpPool.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/publicIpPool/publicIpPoolCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.poolInfo.publicIpPool.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟机模板列表
            $stateProvider.state("service.poolInfo.vmTemplate", {
                url: "/vmTemplate",
                templateUrl: "app/business/multiPool/views/poolInfo/vmTemplate/vmTemplate.html",
                controller: "ecs.vmTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/vmTemplate/vmTemplateCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("ecs.vmTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //外部网络列表
            $stateProvider.state("service.poolInfo.externalNet", {
                url: "/externalNet",
                templateUrl: "app/business/multiPool/views/poolInfo/externalNet/externalNet.html",
                controller: "service.externalNet.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/externalNet/externalNetCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("service.externalNet.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            /// 资源/lx fusionManage
            $stateProvider.state("service.cascade", {
                url: "/cascade",
               // 相对于根路径
                templateUrl: "app/business/multiPool/views/fusionCasecade/fusionManage.html",

                controller: "multiPool.cascade.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/fusionCasecade/fusionManageCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("multiPool.cascade.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 应用模板
            $stateProvider.state("serviceMgr.appTemplate", {
                url: "/appTemplate",
                templateUrl: "app/business/multiPool/views/appTemplate/appTemplate.html",
                controller: "serviceMgr.appTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/appTemplate/appTemplateCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("serviceMgr.appTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            $stateProvider.state("service.design", {
                url: "/design",
                templateUrl: "app/business/multiPool/views/appTemplate/designer/manager.html"
            });

            $stateProvider.state("service.design.navigation", {
                url: "/navigation?id&mode",
                templateUrl: "app/business/multiPool/views/appTemplate/designer/layout/layout.html",
                controller: "app.designer.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = ["app/business/multiPool/controllers/appTemplate/designer/layout/layoutCtrl"];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("app.designer.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            $stateProvider.state("service.importTemplate", {
                url: "/importTemplate",
                templateUrl: "app/business/multiPool/views/appTemplate/import/importTemplate.html",
                controller: "app.importTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = ["app/business/multiPool/controllers/appTemplate/import/importTemplateCtrl"];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("app.importTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });

                        return deferred.promise;
                    }
                }
            });

            $stateProvider.state("service.importTemplate.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        templateUrl: "app/business/multiPool/views/appTemplate/import/baseInfo.html",
                        controller: "app.importTemplate.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/multiPool/controllers/appTemplate/import/baseInfoCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("app.importTemplate.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirm": {
                        templateUrl: "app/business/multiPool/views/appTemplate/import/confirm.html",
                        controller: "app.importTemplate.confirm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/multiPool/controllers/appTemplate/import/confirmCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("app.importTemplate.confirm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });
            //物理机列表
            $stateProvider.state("service.poolInfo.host", {
                url: "/host",
                templateUrl: "app/business/multiPool/views/poolInfo/host/host.html",
                controller: "service.poolInfo.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/multiPool/controllers/poolInfo/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("service.poolInfo.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
        }];

        var dependency = [
            "ui.router",
            multiPoolCtrl.name
        ];
        var multiPoolConfig = angular.module("multiPool.config", dependency);
        multiPoolConfig.config(serviceConfigs);
        return multiPoolConfig;
    });