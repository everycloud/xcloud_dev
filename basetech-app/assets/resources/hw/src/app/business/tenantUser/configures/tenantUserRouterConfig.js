/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/FormField",
        "tiny-directives/FilterSelect",
        "tiny-directives/Tree",
        "tiny-directives/RadioGroup"
    ],
    function (angular, router) {
        "use strict";
        var serviceConfigs = ["$stateProvider", "$controllerProvider",
            function ($stateProvider, $controllerProvider) {
                $stateProvider.state("userMgr", {
                    url: "/userMgr",
                    templateUrl: "app/framework/views/left.html",
                    controller: "userMgr.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/userMgrCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 用户管理
                $stateProvider.state("userMgr.user", {
                    url: "/user",
                    templateUrl: "app/business/tenantUser/views/user/user.html",
                    controller: "userMgr.user.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/user/userCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.user.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 角色管理
                $stateProvider.state("userMgr.role", {
                    url: "/role",
                    templateUrl: "app/business/tenantUser/views/role/role.html",
                    controller: "userMgr.role.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/role/roleCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.role.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //创建角色
                $stateProvider.state("userMgr.createRole", {
                    url: "/createRole",
                    templateUrl: "app/business/tenantUser/views/role/createRole.html",
                    controller: "userMgr.role.create.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/role/createRoleCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.role.create.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //角色详情
                $stateProvider.state("userMgr.roleDetail", {
                    url: "/roleDetail?name&id",
                    templateUrl: "app/business/tenantUser/views/role/roleDetail.html",
                    controller: "userMgr.role.detail.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/role/roleDetailCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.role.detail.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 分域管理
                $stateProvider.state("userMgr.domain", {
                    url: "/domain",
                    templateUrl: "app/business/tenantUser/views/domain/domain.html",
                    controller: "userMgr.domain.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/domain/domainCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.domain.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                $stateProvider.state("userMgr.domain.resourceCluster", {
                    url: "/resourceCluster",
                    templateUrl: "app/business/tenantUser/views/domain/domainCluster.html",
                    controller: "userMgr.domain.resourceCluster.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/domain/domainClusterCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.domain.resourceCluster.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                $stateProvider.state("userMgr.domain.user", {
                    url: "/user",
                    templateUrl: "app/business/tenantUser/views/domain/domainUser.html",
                    controller: "userMgr.domain.user.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tenantUser/controllers/domain/domainUserCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.domain.user.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
            }
        ];

        var dependency = ["ui.router"];
        var userConfig = angular.module("user.config", dependency);
        userConfig.config(serviceConfigs);
        return userConfig;
    });
