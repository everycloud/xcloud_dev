/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 * Created by  on 14-3-4.
 */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "ui-router/angular-ui-router",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "tiny-directives/Pagination",
    "fixtures/serviceFixture"
],
    function ($, angular, router) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {

                var regState = function (state, options) {
                    $stateProvider.state(state, {
                        url: options.url,
                        templateUrl: options.templateUrl,
                        controller: options.controllerName,
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [options.controllerPath];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register(options.controllerName, ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    });
                };

                $stateProvider.state("service", {
                    url: "/service",
                    //相对于根路径
                    templateUrl: "app/business/service/views/service.html"
                });

                //服务管理
                $stateProvider.state("service.serviceManager", {
                    url: "/serviceManager?catalogId",
                    templateUrl: "app/business/service/views/catalog/serviceManager.html",
                    controller: "service.serviceManager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/serviceManagerCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.serviceManager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //目录管理
                $stateProvider.state("service.catalogManager", {
                    url: "/catalogManager",
                    templateUrl: "app/business/service/views/catalog/manage/catalogManager.html",
                    controller: "service.catalogManager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/manage/catalogManagerCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.catalogManager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //订单管理
                $stateProvider.state("service.order", {
                    url: "/order",
                    templateUrl: "app/business/service/views/order/order.html",
                    controller: "service.order.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/order/orderCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.order.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //所有申请
                regState("service.order.allApply",{
                    url: "/allApply",
                    templateUrl: "app/business/service/views/order/allApply.html",
                    controllerName: "service.order.allApply.ctrl",
                    controllerPath: "app/business/service/controllers/order/allApplyCtrl"
                });

                //申请详情
                regState("service.orderDetail",{
                    url: "/detail?orderId",
                    templateUrl: "app/business/service/views/order/detail.html",
                    controllerName: "service.order.detail.ctrl",
                    controllerPath: "app/business/service/controllers/order/detailCtrl"
                });

                //待办审批
                $stateProvider.state("service.order.approval", {
                    url: "/approval",
                    templateUrl: "app/business/service/views/order/myApproval.html",
                    controller: "service.order.approval.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/order/myApprovalCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.order.approval.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //申请审批
                $stateProvider.state("service.order.approvalVDC", {
                    url: "/approvalVDC?action&serviceId&orderId",
                    templateUrl: "app/business/service/views/catalog/approval/createCatalogApproval.html",
                    controller: "service.order.approvalVDC.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/approval/createCatalogSureApproval' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.order.approvalVDC.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                /**
                 * 创建VDC
                 */
                $stateProvider.state("service.createServiceVDC", {
                    url: "/createServiceVDC?templateId&serviceId",
                    templateUrl: "app/business/service/views/catalog/vdc/craeteServiceVDC.html",
                    controller: "service.createServiceVDC.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/vdc/createServiceVdcCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.createServiceVDC.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                /**
                 * 创建VM
                 */
                $stateProvider.state("service.createServiceVM", {
                    url: "/createServiceVM?templateId&serviceId&applyTypeId",
                    templateUrl: "app/business/service/views/catalog/vm/createServiceVM.html",
                    controller: "service.createServiceVM.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/vm/createServiceVmCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.createServiceVM.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                /**
                 * 创建快存储
                 */
                $stateProvider.state("service.createServiceStorage", {
                    url: "/createServiceStorage?templateId&serviceId&applyTypeId",
                    templateUrl: "app/business/service/views/catalog/storage/createServiceStorage.html",
                    controller: "service.createServiceStorage.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/storage/createServiceStorageCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.createServiceStorage.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
		/**
                 * 创建弹性IP服务
                 */
                $stateProvider.state("service.createServiceElasticIP", {
                    url: "/createServiceElasticIP?templateId&serviceId&applyTypeId",
                    templateUrl: "app/business/service/views/catalog/elasticIP/createServiceElasticIP.html",
                    controller: "service.createServiceElasticIP.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/elasticIP/createServiceElasticIPCtrl'//相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.createServiceElasticIP.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                /**
                 * 创建物理机服务
                 */
                $stateProvider.state("service.createServiceHost", {
                    url: "/createServiceHost?templateId&serviceId&applyTypeId",
                    templateUrl: "app/business/service/views/catalog/host/createServiceHost.html",
                    controller: "service.createServiceHost.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/service/controllers/catalog/host/createServiceHostCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.createServiceHost.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //定义服务
                regState("service.create",{
                    url: "/create",
                    templateUrl: "app/business/service/views/catalog/choiseServiceTemplate.html",
                    controllerName: "service.create",
                    controllerPath: "app/business/service/controllers/catalog/choiseServiceTemplateCtrl"
                });
            }
        ];

        var dependency = [
            "ui.router"
        ];

        var configModule = angular.module("service.config", dependency);
        configModule.config(serviceConfigs);
        return configModule;
    });
