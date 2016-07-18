/* global define */
/* global require */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/Select",
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

                // 告警统计
                $stateProvider.state("monitor.alarmstat", {
                    url: "/alarmstat",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/alarmStat.html",
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
                //任务中心
                $stateProvider.state("monitor.taskcenter", {
                    url: "/taskcenter",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/task/taskCenter.html",
                    controller: "monitor.taskcenter.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/task/taskCenterCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.taskcenter.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //操作日志
                $stateProvider.state("monitor.oplog", {
                    url: "/oplog",
                    //相对于根路径
                    templateUrl: "app/business/monitor/views/oplog/operatorLog.html",
                    controller: "monitor.operatorLog.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/monitor/controllers/oplog/operatorLogCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("monitor.operatorLog.ctrl", ctrl);
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
