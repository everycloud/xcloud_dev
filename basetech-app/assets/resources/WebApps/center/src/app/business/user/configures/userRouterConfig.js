/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/user/controllers/userMgrCtrl",
        "app/business/user/controllers/user/userCtrl",
        "app/business/user/controllers/organization/orgCtrl",
        "tiny-directives/FormField",
        "tiny-directives/Tree",
        "tiny-directives/RadioGroup",
        "tiny-directives/FilterSelect",
        "tiny-directives/Step",
        "tiny-directives/CheckboxGroup",
        "tiny-directives/Searchbox"
    ],
    function (angular, router, userMgrCtrl, userCtrl, orgCtrl) {
        "use strict";

        var serviceConfigs = ["$stateProvider", "$controllerProvider",
            function ($stateProvider, $controllerProvider) {
                $stateProvider.state("userMgr", {
                    url: "/userMgr",
                    templateUrl: "app/framework/views/left.html",
                    controller: "userMgr.ctrl"
                });

                // 用户管理
                $stateProvider.state("userMgr.user", {
                    url: "/user",
                    templateUrl: "app/business/user/views/user/user.html",
                    controller: "userMgr.user.ctrl"
                });

                // 创建用户
                $stateProvider.state("userMgr.createUser", {
                    url: "/createUser",
                    templateUrl: "app/business/user/views/user/createUser.html",
                    controller: "userMgr.user.create.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/user/createUserCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.user.create.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 用户详情
                $stateProvider.state("userMgr.userDetail", {
                    url: "/userDetail?id",
                    templateUrl: "app/business/user/views/user/userDetail.html",
                    controller: "userMgr.user.detail.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/user/userDetailCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.user.detail.ctrl", ctrl);
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
                    templateUrl: "app/business/user/views/role/role.html",
                    controller: "userMgr.role.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/role/roleCtrl'
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
                    templateUrl: "app/business/user/views/role/createRole.html",
                    controller: "userMgr.role.create.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/role/createRoleCtrl'
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
                    templateUrl: "app/business/user/views/role/roleDetail.html",
                    controller: "userMgr.role.detail.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/role/roleDetailCtrl'
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
                    templateUrl: "app/business/user/views/domain/domain.html",
                    controller: "userMgr.domain.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/domain/domainCtrl'
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
                    templateUrl: "app/business/user/views/domain/domainCluster.html",
                    controller: "userMgr.domain.resourceCluster.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/domain/domainClusterCtrl'
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
                    templateUrl: "app/business/user/views/domain/domainUser.html",
                    controller: "userMgr.domain.user.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/domain/domainUserCtrl'
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

                // 密码策略
                $stateProvider.state("userMgr.passwordPolicy", {
                    url: "/passwordPolicy",
                    templateUrl: "app/business/user/views/passwordPolicy.html",
                    controller: "userMgr.passwordPolicy.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/passwordPolicyCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.passwordPolicy.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // keystone配置
                $stateProvider.state("userMgr.keystoneConfig", {
                    url: "/keystoneConfig",
                    templateUrl: "app/business/user/views/keystoneConfig.html",
                    controller: "userMgr.keystoneConfig.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/user/controllers/keystoneConfigCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("userMgr.keystoneConfig.ctrl", ctrl);
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
            userMgrCtrl.name,
            userCtrl.name,
            orgCtrl.name
        ];
        var userConfig = angular.module("user.config", dependency);
        userConfig.config(serviceConfigs);

        return userConfig;
    });
