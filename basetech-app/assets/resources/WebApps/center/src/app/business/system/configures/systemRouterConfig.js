/**
 * 修改人：
 * 修改时间：14-2-24
 */
define(["tiny-lib/angular",
    "ui-router/angular-ui-router",
    "tiny-directives/Select",
    "tiny-directives/Textbox",
    "tiny-widgets/Window",
    "tiny-directives/DateTime",
    "tiny-directives/RadioGroup",
    "tiny-directives/Button",
    "tiny-directives/Table",
    "tiny-directives/DateTime",
    "tiny-directives/IP",
    "tiny-directives/CheckboxGroup",
    "tiny-directives/FormField",
    "tiny-directives/Columnchart"],
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

            $stateProvider.state("system", {
                url: "/system",
                templateUrl: "app/framework/views/left.html",
                controller: "system.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            $stateProvider.state("system.mailServerConfig", {
                url: "/mailServer",
                //相对于根路径
                templateUrl: "app/business/system/views/systemConfig/mailServerConfig.html",
                controller: "system.mailServerConfig.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/mailServerConfigCtrl'
                        ];
                        require(dependencies, function (progressbarCtrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.mailServerConfig.ctrl", progressbarCtrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // 系统LOGO
            $stateProvider.state("system.systemLogo", {
                url: "/systemLogo",
                //相对于根路径
                templateUrl: "app/business/system/views/systemConfig/systemLogo.html",
                controller: "system.systemLogo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/systemLogoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.systemLogo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });


            // 系统超时时间
            $stateProvider.state("system.systemTime", {
                url: "/systemTime",
                templateUrl: "app/business/system/views/systemConfig/systemTime.html",
                controller: "system.systemTime.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/systemTimeCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.systemTime.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 应用虚拟机启停间隔
            $stateProvider.state("system.vmInterval", {
                url: "/vmInterval",
                templateUrl: "app/business/system/views/systemConfig/vmInterval.html",
                controller: "system.vmInterval.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/vmIntervalCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.vmInterval.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //SNMP管理站
            $stateProvider.state("system.snmpManage", {
                url: "/snmpManage",
                templateUrl: "app/business/system/views/systemConfig/snmpManage.html",
                controller: "system.snmpManage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/snmpManageCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.snmpManage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //备份设定
            $stateProvider.state("system.backupSetting", {
                url: "/backupSetting",
                templateUrl: "app/business/system/views/systemConfig/backupSetting.html",
                controller: "system.backupSetting.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {

                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/backupSettingCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.backupSetting.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //时间管理
            $stateProvider.state("system.timeManage", {
                url: "/timeManage",
                templateUrl: "app/business/system/views/systemConfig/timeManage.html",
                controller: "system.timeManage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/timeManageCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.timeManage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //容灾管理节点地址
            $stateProvider.state("system.disasterManageIp", {
                url: "/disasterManageIp",
                templateUrl: "app/business/system/views/systemConfig/disasterManageIp.html",
                controller: "system.disasterManageIp.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/disasterManageIpCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.disasterManageIp.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //第三方认证配置
            $stateProvider.state("system.thirdParty", {
                url: "/thirdParty",
                templateUrl: "app/business/system/views/systemConfig/thirdParty.html",
                controller: "system.thirdParty.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/thirdPartyCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.thirdParty.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //license管理
            $stateProvider.state("system.licenseManage", {
                url: "/licenseManage",
                templateUrl: "app/business/system/views/systemConfig/licenseManage.html",
                controller: "system.licenseManage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/licenseManageCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.licenseManage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //物理机安装子网
            $stateProvider.state("system.physicalSubNets", {
                url: "/physicalSubNets",
                templateUrl: "app/business/system/views/systemConfig/physicalSubNets.html",
                controller: "system.physicalSubNets.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/systemConfig/physicalSubNetsCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.physicalSubNets.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //桌面云
            registerState("system.vdiManage", {
                url: "/vdiManage",
                templateUrl: "app/business/system/views/systemConfig/vdiManage.html",
                controller: "system.vdiManage.ctrl",
                controllerUrl: "app/business/system/controllers/systemConfig/vdiManageCtrl"
            });

			//机机账号管理
			registerState("system.machineAccount", {
				url: "/machineAccount",
				templateUrl: "app/business/system/views/systemConfig/machineAccount.html",
				controller: "system.machineAccount.ctrl",
				controllerUrl: "app/business/system/controllers/systemConfig/machineAccountCtrl"
			});

			//管理IP地址
			registerState("system.ipManage", {
				url: "/ipManage",
				templateUrl: "app/business/system/views/systemConfig/ipManage.html",
				controller: "system.ipManage.ctrl",
				controllerUrl: "app/business/system/controllers/systemConfig/ipManageCtrl"
			});

            //任务中心
            $stateProvider.state("system.taskCenter", {
                url: "/taskCenter",
                templateUrl: "app/business/system/views/taskCenter/taskCenter.html",
                controller: "system.taskCenter.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/taskCenter/taskCenterCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.taskCenter.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //操作日志
            $stateProvider.state("system.operatorLog", {
                url: "/operatorLog",
                templateUrl: "app/business/system/views/taskCenter/operatorLog.html",
                controller: "system.operatorLog.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/taskCenter/operatorLogCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.operatorLog.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //部件通讯密码
            $stateProvider.state("system.sectionPassword", {
                url: "/sectionPassword",
                templateUrl: "app/business/system/views/taskCenter/sectionPassword.html",
                controller: "system.sectionPassword.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/system/controllers/missionAndLog/sectionPasswordCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("system.sectionPassword.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

        }];

        var dependency = [
            "ui.router"
        ];
        var system = angular.module("system.config", dependency);
        system.config(systemConfig);
        return system;
    });