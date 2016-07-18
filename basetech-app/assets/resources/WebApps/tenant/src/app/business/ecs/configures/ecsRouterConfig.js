/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 */
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/ecs/controllers/ecsCtrl",
        "tiny-directives/FormField",
        "tiny-directives/Textbox",
        'tiny-directives/Step',
        "tiny-directives/FilterSelect",
        'tiny-directives/Slider',
        'tiny-directives/Spinner',
        'tiny-directives/IP'
    ],
    function (angular, router, ecsCtrl) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
                $urlRouterProvider.when("/ecs/storage", "/ecs/storage/disk");
                $urlRouterProvider.when("/ecs/storage/", "/ecs/storage/disk");

                $stateProvider.state("ecs", {
                    url: "/ecs",
                    //相对于根路径
                    templateUrl: "app/framework/views/left.html", //相对于index.html
                    controller: "ecs.ctrl"
                });

                // 导航
                $stateProvider.state("ecs.navigate", {
                    url: "/navigate",
                    templateUrl: "app/business/ecs/views/navigate.html",
                    controller: "ecs.navigate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/navigateCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.navigate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 虚拟机
                $stateProvider.state("ecs.vm", {
                    url: "/vm?cloudInfraId&vpcId&condition&vmId&vmName&fromPerformance",
                    templateUrl: "app/business/ecs/views/vm/vms.html",
                    controller: "ecs.vm.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/vm/vmsCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.vm.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建虚拟机
                $stateProvider.state("ecsVmCreate", {
                    url: "/createVM?cloudInfra&vmtId&vpcId",
                    templateUrl: "app/business/ecs/views/vm/create/createVm.html",
                    controller: "ecs.vm.create.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/vm/create/createVm' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.vm.create.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建虚拟机向导
                $stateProvider.state("ecsVmCreate.navigate", {
                    url: "/navigate",
                    views: {
                        "baseInfo": {
                            templateUrl: "app/business/ecs/views/vm/create/createVmBaseInfo.html",
                            controller: "ecs.vm.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ecs/controllers/vm/create/createVmBaseInfoCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ecs.vm.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "selTemp": {
                            templateUrl: "app/business/ecs/views/vm/create/createVmSelTemp.html",
                            controller: "ecs.vm.create.selTemp.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ecs/controllers/vm/create/createVmSelTempCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ecs.vm.create.selTemp.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "specInfo": {
                            templateUrl: "app/business/ecs/views/vm/create/createVmSpecInfo.html",
                            controller: "ecs.vm.create.specInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ecs/controllers/vm/create/createVmSpecInfoCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ecs.vm.create.specInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "selNetwork": {
                            templateUrl: "app/business/ecs/views/vm/create/createVmSelNetwork.html",
                            controller: "ecs.vm.create.selNetwork.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ecs/controllers/vm/create/createVmSelNetworkCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ecs.vm.create.selNetwork.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/ecs/views/vm/create/createVmConfirm.html",
                            controller: "ecs.vm.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/ecs/controllers/vm/create/createVmConfirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("ecs.vm.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // 物理机
                $stateProvider.state("ecs.host", {
                    url: "/host?cloudInfraId&condition",
                    templateUrl: "app/business/ecs/views/host/hosts.html",
                    controller: "ecs.host.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/host/hostsCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.host.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 磁盘管理
                $stateProvider.state("ecs.storage", {
                    url: "/storage",
                    templateUrl: "app/business/ecs/views/storage/storage.html",
                    controller: "ecs.storage.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/storage/storageCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.storage.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 磁盘列表
                $stateProvider.state("ecs.storage.disk", {
                    url: "/disk?cloudInfraId&vpcId&condition",
                    templateUrl: "app/business/ecs/views/storage/disk/disks.html",
                    controller: "ecs.storage.disks.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/storage/disk/disksCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.storage.disks.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 快照列表
                $stateProvider.state("ecs.storage.snapshot", {
                    url: "/snapshot",
                    templateUrl: "app/business/ecs/views/storage/diskSnapshot/diskSnapshots.html",
                    controller: "ecs.storage.diskSnapshots.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/ecs/controllers/storage/diskSnapshot/diskSnapshotsCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.storage.diskSnapshots.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //软件包
                $stateProvider.state("ecs.commonPackageList", {
                    url: "/commonPackageList",
                    //相对于根路径
                    templateUrl: "app/business/template/views/commonPackageList.html",
                    controller: "ecs.commonPackageList.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/template/controllers/commonPackageListCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.commonPackageList.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //添加软件包
                $stateProvider.state("addPackage", {
                    url: "/addPackage?action&id&cloudInfraId",
                    //相对于根路径
                    templateUrl: "app/business/template/views/package/addPackage.html"
                });

                //批量安装软件包BatchInstallation
                $stateProvider.state("batchInstallPackage", {
                    url: "/batchInstallPackage?id&cloudInfraId&name&osType&fileType&version&description&installCommand&unInstallCommand&startCommand&stopCommand",
                    //相对于根路径
                    templateUrl: "app/business/template/views/batchInstallPackage/batchInstallPackage.html"
                });

                //公共脚本
                $stateProvider.state("ecs.commonScriptList", {
                    url: "/commonScriptList",
                    //相对于根路径
                    templateUrl: "app/business/template/views/commonScriptList.html",
                    controller: "ecs.commonScriptList.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/template/controllers/commonScriptListCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.commonScriptList.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //添加脚本
                $stateProvider.state("addScript", {
                    url: "/addScript?action&id&cloudInfraId",
                    //相对于根路径
                    templateUrl: "app/business/template/views/script/createScript.html"
                });

                //批量安装软件包BatchInstallation
                $stateProvider.state("batchInstallScript", {
                    url: "/batchInstallScript?id&cloudInfraId&name&osType&version&description&installCommand",
                    //相对于根路径
                    templateUrl: "app/business/template/views/batchInstallScript/batchInstallScript.html"
                });

                //虚拟机模板列表
                $stateProvider.state("ecs.vmTemplateList", {
                    url: "/vmlist",
                    templateUrl: "app/business/template/views/vmTemplate/vmTemplateList.html",
                    controller: "ecs.vmTemplateList.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/template/controllers/vmTemplate/vmTemplateListCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("ecs.vmTemplateList.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 资源/模板与规格/软件包/修复
                $stateProvider.state("repairSoftwarePackage", {
                    url: "/repairSoftwarePackage?id&cloudInfraId",
                    //相对于根路径
                    templateUrl: "app/business/template/views/repairPackage/repair.html",
                    controller: "template.repairSoftwarePackage.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/template/controllers/repairPackage/repairCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("template.repairSoftwarePackage.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 资源/模板与规格/软件包/修复/导航
                $stateProvider.state("repairSoftwarePackage.navigation", {
                    url: "/navigation",
                    views: {
                        "baseInfo": {
                            //相对于根路径
                            templateUrl: "app/business/template/views/repairPackage/baseInfo.html",
                            controller: "template.repairSoftware.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/template/controllers/repairPackage/baseInfoCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("template.repairSoftware.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "upload": {
                            //相对于根路径
                            templateUrl: "app/business/template/views/repairPackage/upload.html",
                            controller: "template.repairSoftware.upload.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/template/controllers/repairPackage/uploadCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("template.repairSoftware.upload.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // 资源/模板与规格/脚本/修复
                $stateProvider.state("repairScript", {
                    url: "/repairScript?id&cloudInfraId",
                    //相对于根路径
                    templateUrl: "app/business/template/views/repairScript/repair.html",
                    controller: "template.repairScript.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/template/controllers/repairScript/repairCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("template.repairScript.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // 资源/模板与规格/软件包/修复/导航
                $stateProvider.state("repairScript.navigation", {
                    url: "/navigation",
                    views: {
                        "baseInfo": {
                            //相对于根路径
                            templateUrl: "app/business/template/views/repairScript/baseInfo.html",
                            controller: "template.repairScript.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/template/controllers/repairScript/baseInfoCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("template.repairScript.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "upload": {
                            //相对于根路径
                            templateUrl: "app/business/template/views/repairScript/upload.html",
                            controller: "template.repairScript.upload.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/template/controllers/repairScript/uploadCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("template.repairScript.upload.ctrl", ctrl);
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
            "ui.router",
            ecsCtrl.name
        ];
        var ecsConfig = angular.module("ecs.config", dependency);
        ecsConfig.config(serviceConfigs);

        return ecsConfig;
    });
