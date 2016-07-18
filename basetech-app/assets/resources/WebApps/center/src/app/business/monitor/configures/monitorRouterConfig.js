define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/Select",
        "tiny-directives/FilterSelect",
        "tiny-directives/Textbox",
        "tiny-directives/DateTime",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/Columnchart"
    ],
    function (angular, router) {
        "use strict";

        //定义框架的路由配置module
        var monitorConfig = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
                $urlRouterProvider.when("/monitor/alarmsettings", "/monitor/alarmsettings/mail");
                $urlRouterProvider.when("/monitor/alarmsettings/", "/monitor/alarmsettings/mail");

                $urlRouterProvider.when("/monitor/performanceSettings", "/monitor/performanceSettings/collect");
                $urlRouterProvider.when("/monitor/performanceSettings/", "/monitor/performanceSettings/collect");
                $stateProvider.state("monitor", {
                    url: "/monitor",
                    //相对于根路径
                    templateUrl: "app/framework/views/left.html",
                    controller: "monitor.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/monitorCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警列表
                $stateProvider.state("monitor.alarmlist", {
                    url: "/alarmlist?severity&resourceid&moc&alarmtype",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/alarmlist.html",
                    controller: "monitor.alarmlist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/alarmListCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.alarmlist.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警设置
                $stateProvider.state("monitor.alarmsettings", {
                    url: "/alarmsettings",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/alarmsettings.html",
                    controller: "monitor.alarmsettings.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/alarmSettingsCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl, progressbarWindowCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.alarmsettings.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警转邮件设置
                $stateProvider.state("monitor.alarmsettings.mailConfig", {
                    url: "/mail",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/mailConfig.html",
                    controller: "monitor.mailconfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/alarmMailConfigCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl, progressbarWindowCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.mailconfig.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警转短信设置
                $stateProvider.state("monitor.alarmsettings.messageConfig", {
                    url: "/message",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/messageConfig.html",
                    controller: "monitor.mailconfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/alarmMessageConfigCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl, progressbarWindowCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.mailconfig.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警阈值设置
                $stateProvider.state("monitor.alarmsettings.threholdConfig", {
                    url: "/threhold",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/threholdConfig.html",
                    controller: "monitor.mailconfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/threholdConfigCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl, progressbarWindowCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.mailconfig.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警屏蔽设置
                $stateProvider.state("monitor.alarmsettings.shieldConfig", {
                    url: "/shield",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/shieldConfig.html",
                    controller: "monitor.mailconfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/shieldConfigCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.mailconfig.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 第三方告警配置
                $stateProvider.state("monitor.alarmsettings.snmpClientConfig", {
                    url: "/thirdParty",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/snmpClientList.html",
                    controller: "monitor.snmpClientConfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/snmpClientConfigCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.snmpClientConfig.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 告警统计
                $stateProvider.state("monitor.alarmstat", {
                    url: "/alarmstat",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/alarmstat.html",
                    controller: "monitor.alarmStat.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/alarmStatCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.alarmStat.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 性能监控
                $stateProvider.state("monitor.performance", {
                    url: "/performance",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/performance.html",
                    controller: "monitor.performance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/performanceCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.performance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 性能设置
                $stateProvider.state("monitor.performanceSettings", {
                    url: "/performanceSettings",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/performanceSetting.html",
                    controller: "monitor.performance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/performanceSettingCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.performance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 性能采集
                $stateProvider.state("monitor.performanceSettings.performanceCollect", {
                    url: "/collect",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/performanceCollect.html",
                    controller: "monitor.performance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/performanceCollectCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.performance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 指标模板
                $stateProvider.state("monitor.performanceSettings.indexTemplate", {
                    url: "/template",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/indexTemplate.html",
                    controller: "monitor.performance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/indexTemplateCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.performance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 监控视图
                $stateProvider.state("monitor.view", {
                    url: "/view",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/view/performanceView.html",
                    controller: "monitor.performance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/view/performanceViewCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.performance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 报表
                $stateProvider.state("monitor.systemReport", {
                    url: "/systemReport",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/report/systemReport.html",
                    controller: "monitor.systemReport.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/report/systemReportCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.systemReport.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 自定义报表
                $stateProvider.state("monitor.customReport", {
                    url: "/customReport",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/report/customReport.html",
                    controller: "monitor.customReport.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/report/customReportCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.customReport.ctrl", ctrl);
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
            "ui.router"
        ];
        var monitor = angular.module("monitor.config", dependency);
        monitor.config(monitorConfig);
        return monitor;
    });
