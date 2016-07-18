/**
 * 定义的app ssp 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
/* global define */
/* global require */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "ui-router/angular-ui-router",
        "tiny-directives/FormField",
        "tiny-directives/Textbox",
        "tiny-directives/FilterSelect",
        "fixtures/sspFixture",
        "fixtures/network/network/networkListFixture"
    ],
    function ($, angular, router) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {

                $stateProvider.state("ssp", {
                    url: "/ssp",
                    //相对于根路径
                    templateUrl: "app/business/ssp/views/ssp.html"
                });

                // 服务目录
                $stateProvider.state("ssp.catalog", {
                    url: "/catalog",
                    templateUrl: "app/business/ssp/views/catalog/catalog.html",
                    controller: "ssp.catalog.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/catalog/catalogCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.catalog.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //我的实例
                $stateProvider.state("ssp.instance.myInstance", {
                    url: "/myInstance?status&instanceId",
                    templateUrl: "app/business/ssp/views/catalog/instance/serviceInstance.html",
                    controller: "ssp.myCatalog.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/catalog/instance/serviceInstanceCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.myCatalog.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //所有实例
                $stateProvider.state("ssp.instance.allInstance", {
                    url: "/allInstance?instanceId",
                    templateUrl: "app/business/ssp/views/catalog/instance/allServiceInstance.html",
                    controller: "ssp.myCatalog.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/catalog/instance/allServiceInstanceCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.myCatalog.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //服务实例
                $stateProvider.state("ssp.instance", {
                    url: "/instance",
                    templateUrl: "app/business/ssp/views/catalog/instance/instance.html",
                    controller: "ssp.instance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/catalog/instance/instanceCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.instance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //服务目录管理
                $stateProvider.state("ssp.catalogManager", {
                    url: "/catalogManager",
                    templateUrl: "app/business/ssp/views/catalog/manage/catalogManager.html",
                    controller: "ssp.catalogManager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/catalog/manage/catalogManagerCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.catalogManager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //订单管理
                $stateProvider.state("ssp.order", {
                    url: "/order",
                    templateUrl: "app/business/ssp/views/order/order.html",
                    controller: "ssp.order.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/order/orderCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.order.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //所有申请
                $stateProvider.state("ssp.order.allApply", {
                    url: "/allApply",
                    templateUrl: "app/business/ssp/views/order/allApply.html",
                    controller: "ssp.order.allApply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/order/allApplyCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.order.allApply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //我的申请
                $stateProvider.state("ssp.order.apply", {
                    url: "/apply",
                    templateUrl: "app/business/ssp/views/order/myApply.html",
                    controller: "ssp.order.apply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/order/myApplyCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.order.apply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //待我审批
                $stateProvider.state("ssp.order.approval", {
                    url: "/approval",
                    templateUrl: "app/business/ssp/views/order/myApproval.html",
                    controller: "ssp.order.approval.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/order/myApprovalCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.order.approval.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 申请虚拟机
                $stateProvider.state("ssp.applyVm", {
                    url: "/applyVm?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/vm/submit/applyVm.html",
                    controller: "ssp.plugin.applyVm.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vm/submit/applyVmCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyVm.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 审批虚拟机申请
                $stateProvider.state("ssp.approvalVmApply", {
                    url: "/approvalVm?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/vm/approval/approvalVmApply.html",
                    controller: "ssp.plugin.approvalVm.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vm/approval/approvalVmApplyCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalVm.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 变更虚拟机
                $stateProvider.state("ssp.changeVm", {
                    url: "/changeVm?action&id&resourceId&instanceId&cloudInfraId&vpcId&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/vm/submit/changeVm.html",
                    controller: "ssp.plugin.changeVm.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vm/submit/changeVmCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.changeVm.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 审批虚拟机变更
                $stateProvider.state("ssp.approvalVmChange", {
                    url: "/approvalVmChange?action&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/vm/approval/approvalVmChange.html",
                    controller: "ssp.plugin.approvalVmChange.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vm/approval/approvalVmChangeCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalVmChange.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //申请VDC页面
                $stateProvider.state("ssp.applyVdc", {
                    url: "/applyVDC?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/vdc/submit/applyVdc.html",
                    controller: "ssp.plugin.applyVDC.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vdc/submit/applyVdcCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyVDC.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //修改应用服务
                $stateProvider.state("ssp.modifyApp", {
                    url: "/modifyApp?action&id&orderId",
                    templateUrl: "app/business/ssp/views/plugin/app/create/modifyAppCommon.html",
                    controller: "ssp.plugin.modifyApp.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/create/modifyAppCommonCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.modifyApp.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //申请应用
                $stateProvider.state("ssp.applyApp", {
                    url: "/applyApp?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/app/submit/applyAppCommon.html",
                    controller: "ssp.plugin.applyApp.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/submit/applyAppCommonCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyApp.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //申请应用it
                $stateProvider.state("ssp.applyAppIT", {
                    url: "/applyAppIT?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/app/submit/applyAppIT.html",
                    controller: "ssp.plugin.applyAppIT.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/submit/applyAppITCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyAppIT.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //审批应用
                $stateProvider.state("ssp.approvalAppApply", {
                    url: "/approvalAppCommon?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/app/approval/approvalAppCommon.html",
                    controller: "ssp.plugin.approvalAppApply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/approval/approvalAppCommonCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalAppApply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //审批应用IT
                $stateProvider.state("ssp.approvalAppITApply", {
                    url: "/approvalAppIT?action&serviceId&orderId&from",
                    templateUrl: "app/business/ssp/views/plugin/app/approval/approvalAppITApply.html",
                    controller: "ssp.plugin.approvalAppITApply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/approval/approvalAppITApplyCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalAppITApply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //审批应用ICT
                $stateProvider.state("ssp.approvalAppICTApply", {
                    url: "/approvalAppICT?action&serviceId&orderId&from",
                    templateUrl: "app/business/ssp/views/plugin/app/approvalByOpenstack/approvalAppICTApply.html",
                    controller: "ssp.plugin.approvalAppICTApply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/approvalByOpenstack/approvalAppICTApplyCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalAppICTApply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //申请应用ict
                $stateProvider.state("ssp.applyAppICT", {
                    url: "/applyAppICT?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/app/submitByOpenstack/applyAppICT.html",
                    controller: "ssp.plugin.applyAppICT.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/submitByOpenstack/applyAppICTCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyAppICT.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //审批VDC申请
                $stateProvider.state("ssp.approvalVdcApply", {
                    url: "/approvalVdc?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/vdc/approval/approvalVdcApply.html",
                    controller: "ssp.plugin.approvalVdcApply.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vdc/approval/approvalVdcApplyCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalVdcApply.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 变更VDC
                $stateProvider.state("ssp.changeVdc", {
                    url: "/changeVDC?action&id&resourceId&instanceId&cloudInfraId&vpcId&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/vdc/submit/changeVdc.html",
                    controller: "ssp.plugin.changeVDC.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vdc/submit/changeVdcCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.changeVDC.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //审批VDC变更
                $stateProvider.state("ssp.approvalVdcChange", {
                    url: "/approvalChangeVdc?action&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/vdc/approval/approvalVdcChange.html",
                    controller: "ssp.plugin.approvalVdcChange.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/vdc/approval/approvalVdcChangeCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalVdcChange.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 申请磁盘
                $stateProvider.state("ssp.applyDisk", {
                    url: "/applyDisk?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/disk/submit/applyDisk.html",
                    controller: "ssp.plugin.applyDisk.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/disk/submit/applyDiskCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyDisk.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批磁盘申请
                $stateProvider.state("ssp.approvalDiskApply", {
                    url: "/approvalDisk?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/disk/approval/approvalDiskApply.html",
                    controller: "ssp.plugin.approvalDisk.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/disk/approval/approvalDiskApplyCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalDisk.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 变更磁盘
                $stateProvider.state("ssp.changeDisk", {
                    url: "/changeDisk?action&id&resourceId&instanceId&cloudInfraId&vpcId&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/disk/submit/changeDisk.html",
                    controller: "ssp.plugin.changeDisk.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/disk/submit/changeDiskCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.changeDisk.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批磁盘变更
                $stateProvider.state("ssp.approvalDiskChange", {
                    url: "/approvalDiskChange?action&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/disk/approval/approvalDiskChange.html",
                    controller: "ssp.plugin.approvalDiskChange.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/disk/approval/approvalDiskChangeCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalDiskChange.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 申请物理机
                $stateProvider.state("ssp.applyHost", {
                    url: "/applyHost?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/host/submit/applyHost.html",
                    controller: "ssp.plugin.applyHost.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/host/submit/applyHostCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyHost.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批物理机申请
                $stateProvider.state("ssp.approvalHostApply", {
                    url: "/approvalHost?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/host/approval/approvalHostApply.html",
                    controller: "ssp.plugin.approvalHost.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/host/approval/approvalHostApplyCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalHost.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 申请弹性IP
                $stateProvider.state("ssp.applyEip", {
                    url: "/applyEip?action&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/eip/submit/applyEip.html",
                    controller: "ssp.plugin.applyEip.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/eip/submit/applyEipCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyEip.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批弹性IP申请
                $stateProvider.state("ssp.approvalEipApply", {
                    url: "/approvalEip?action&serviceId&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/eip/approval/approvalEipApply.html",
                    controller: "ssp.plugin.approvalEip.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/eip/approval/approvalEipApplyCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalEip.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 变更弹性IP
                $stateProvider.state("ssp.changeEip", {
                    url: "/changeEip?action&id&resourceId&instanceId&cloudInfraId&vpcId&serviceId&orderId",
                    templateUrl: "app/business/ssp/views/plugin/eip/submit/changeEip.html",
                    controller: "ssp.plugin.changeEip.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/eip/submit/changeEipCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.changeEip.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批弹性IP变更
                $stateProvider.state("ssp.approvalEipChange", {
                    url: "/approvalEipChange?action&orderId?from",
                    templateUrl: "app/business/ssp/views/plugin/eip/approval/approvalEipChange.html",
                    controller: "ssp.plugin.approvalEipChange.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/eip/approval/approvalEipChangeCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalEipChange.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 申请/修改 延期服务实例
                $stateProvider.state("ssp.applyInstanceExtend", {
                    url: "/applyInstanceExtend?action&orderId",
                    templateUrl: "app/business/ssp/views/plugin/common/extend/applyExtend.html",
                    controller: "ssp.plugin.applyExtend.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/common/extend/applyExtendCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.applyExtend.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 审批延期服务实例
                $stateProvider.state("ssp.approvalInstanceExtend", {
                    url: "/approvalInstanceExtend?action&orderId",
                    templateUrl: "app/business/ssp/views/plugin/common/extend/approvalExtend.html",
                    controller: "ssp.plugin.approvalExtend.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/common/extend/approvalExtendCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.approvalExtend.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 释放服务实例的订单查看
                $stateProvider.state("ssp.viewInstanceRelease", {
                    url: "/viewInstanceRelease?orderId",
                    templateUrl: "app/business/ssp/views/plugin/common/release/viewReleaseOrder.html",
                    controller: "ssp.plugin.viewInstanceRelease.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/common/release/viewReleaseOrderCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.viewInstanceRelease.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //创建公共入口
                $stateProvider.state("createCatalogModule", {
                    url: "/createCatalogModule",
                    templateUrl: "app/business/ssp/views/plugin/common/create/catalogModule.html"
                });

                $stateProvider.state("ssp.createApp", {
                    url : "/createApp?templateId&fromFlag&approvalType",
                    templateUrl: "app/business/ssp/views/plugin/app/create/chooseTemplate.html",
                    controller: "ssp.plugin.chooseTemplate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/create/chooseTemplate' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.plugin.chooseTemplate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                /**
                 * ICT场景根据openstack应用模板创建应用
                 */
                $stateProvider.state("ssp.createByOpenstack", {
                    url: "/createByOpenstack",
                    templateUrl: "app/business/ssp/views/plugin/app/createByOpenstack/createByTemplate.html",
                    controller: "ssp.createByOpenstack.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/createByOpenstack/createByTemplate'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.createByOpenstack.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("ssp.createByOpenstack.navigate", {
                    url: "/navigate?templateId&appTemplateId&fromFlag&appId&cloudInfraId&vpcId&serviceId&action&approvalType",
                    views: {
                        "baseInfo": {
                            templateUrl: "app/business/ssp/views/plugin/app/createByOpenstack/basicInfo.html",
                            controller: "ssp.createByOpenstack.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/createByOpenstack/basicInfo' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByOpenstack.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configParameter": {
                            templateUrl: "app/business/ssp/views/plugin/app/createByOpenstack/configParameter.html",
                            controller: "ssp.createByOpenstack.chooseNet.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/createByOpenstack/configParameter' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByOpenstack.chooseNet.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/ssp/views/plugin/app/createByOpenstack/confirm.html",
                            controller: "ssp.createByOpenstack.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/createByOpenstack/confirm' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByOpenstack.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                /**
                 * IT场景根据模板创建应用
                 */
                $stateProvider.state("ssp.appCreateByTemplate", {
                    url: "/createAppByTemplate",
                    templateUrl: "app/business/ssp/views/plugin/app/create/createByTemplate.html",
                    controller: "ssp.createByTemplate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ssp/controllers/plugin/app/create/createByTemplate'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ssp.createByTemplate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("ssp.appCreateByTemplate.navigate", {
                    url: "/navigate?appTemplateId&templateId&serviceId&action&approvalType",
                    views: {
                        "basicInfo": {
                            templateUrl: "app/business/ssp/views/plugin/app/create/basicInfo.html",
                            controller: "ssp.createByTemplate.basicInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/create/basicInfo' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.basicInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "chooseNet": {
                            templateUrl: "app/business/ssp/views/plugin/app/create/chooseNetwork.html",
                            controller: "ssp.createByTemplate.chooseNet.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/create/chooseNetwork' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.chooseNet.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configApp": {
                            templateUrl: "app/business/ssp/views/plugin/app/create/configApp.html",
                            controller: "ssp.createByTemplate.configApp.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/create/configApp' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.configApp.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configVlb": {
                            templateUrl: "app/business/ssp/views/plugin/app/create/configVlb.html",
                            controller: "ssp.createByTemplate.configVlb.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = ['app/business/ssp/controllers/plugin/app/create/configVlb'];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.configVlb.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "baseInfo" : {
                            templateUrl: "app/business/ssp/views/plugin/app/create/baseInfo.html",
                            controller: "ssp.createByTemplate.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/create/baseInfo' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/ssp/views/plugin/app/create/confirmByTemplate.html",
                            controller: "ssp.createByTemplate.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ssp/controllers/plugin/app/create/confirmByTemplate' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ssp.createByTemplate.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });
            }
        ];

        var dependency = [
            "ui.router"
        ];

        var configModule = angular.module("ssp.config", dependency);
        configModule.config(serviceConfigs);
        return configModule;
    });
