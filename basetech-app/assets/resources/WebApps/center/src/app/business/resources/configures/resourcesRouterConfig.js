define(["tiny-lib/angular",
    "ui-router/angular-ui-router",
    "app/business/resources/controllers/resourcesCtrl",
    "tiny-directives/Button",
    "tiny-directives/Table",
    "tiny-directives/FormField",
    "tiny-directives/Textbox",
    "tiny-directives/Step",
    "tiny-directives/Select",
    "tiny-directives/Layout",
    'tiny-directives/Menubutton',
    'tiny-directives/FileUpload',
    "tiny-directives/Tabs",
    "tiny-directives/Slider",
    "tiny-directives/Spinner",
    "tiny-directives/FilterSelect",
    "tiny-directives/IP",
    'tiny-directives/RadioGroup',
    'tiny-directives/Radio',
    'tiny-directives/Combobox',
    "tiny-directives/Lineplot"
],
    function (angular, router, resourcesCtrl) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$controllerProvider", function ($stateProvider, $controllerProvider) {

            //资源
            $stateProvider.state("resources", {
                url: "/resources",
                templateUrl: "app/business/resources/views/resources.html",
                controller: "resources.ctrl"
            });

            //资源导航页面
            $stateProvider.state("resources.navigation", {
                url: "/navigation",
                templateUrl: "app/business/resources/views/resourcesNavigation.html",
                controller: "resources.navigation.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/resourcesNavigationCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.navigation.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 虚拟化
            $stateProvider.state("resources.hypervisor", {
                url: "/hypervisor",
                templateUrl: "app/framework/views/left.html",
                controller: "resources.hypervisor.ctrl",
                resolve: {//在此定义用于注入controller的service，先于controller执行
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/hypervisorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 虚拟化>>虚拟化环境
            $stateProvider.state("resources.hypervisor.environment", {
                url: "/environment",
                templateUrl: "app/business/resources/views/hypervisor/environment/environment.html",
                controller: "resources.hypervisor.environment.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/environment/environmentCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisor.environment.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 虚拟化>> 虚拟化环境 >> 添加虚拟化环境
            $stateProvider.state("resources.addEnvironment", {
                url: "/addEnvironment?action&eid",
                templateUrl: "app/business/resources/views/hypervisor/environment/addEnvironment.html",
                controller: "resources.addEnvironment.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/environment/addEnvironmentCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addEnvironment.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟化环境详情
            $stateProvider.state("resources.hypervisorInfo", {
                url: "/hypervisorInfo?hyperName&hyperId",
                templateUrl: "app/business/resources/views/hypervisor/environment/environmentInfo.html",
                controller: "resources.hypervisorInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/environment/environmentInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisorInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟环境详情 》虚拟机
            $stateProvider.state("resources.hypervisorInfo.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "resources.hypervisorInfo.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisorInfo.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟集群
            $stateProvider.state("resources.hypervisor.cluster", {
                url: "/cluster",
                templateUrl: "app/business/resources/views/hypervisor/cluster/cluster.html",
                controller: "resources.hypervisor.cluster.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/clusterCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisor.cluster.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群 >> 关联
            $stateProvider.state("resources.associateZone", {
                url: "/associateZone",
                templateUrl: "app/business/resources/views/hypervisor/cluster/associateZone.html",
                controller: "resources.associateZone.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/associateZoneCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.associateZone.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机
            $stateProvider.state("resources.hypervisor.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "resources.hypervisor.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.hypervisor.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机 >>创建虚拟机
            $stateProvider.state("resources.createVm", {
                url: "/createVm?action&from&vmId&tid&cloneVmName&clusterId&clusterName&clusterIndex&hyperId",
                templateUrl: "app/business/resources/views/hypervisor/vm/createVm.html",
                controller: "resources.createVm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/createVmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.createVm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机 >>导入虚拟机
            $stateProvider.state("resources.importVm", {
                url: "/importVm?from&occupiedVmId&vmName&hypervisorId&clusterId&clusterName&clusterIndex",
                templateUrl: "app/business/resources/views/hypervisor/vm/importVm.html",
                controller: "resources.importVm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/importVmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.importVm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机 >> 迁移虚拟机
            $stateProvider.state("resources.migrateVm", {
                url: "/migrateVm?vmType&hypervisorId&clusterId&clusterUrn",
                templateUrl: "app/business/resources/views/hypervisor/vm/migrate.html",
                controller: "resources.migrateVm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/migrateCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.migrateVm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情
            $stateProvider.state("resources.clusterInfo", {
                url: "/clusterInfo?clusterName&from&clusterId&indexId&hyperId",
                templateUrl: "app/business/resources/views/hypervisor/cluster/clusterInfo.html",
                controller: "resources.clusterInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/clusterInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》概要
            $stateProvider.state("resources.clusterInfo.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/hypervisor/cluster/summary.html",
                controller: "resources.clusterInfo.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》性能监控
            $stateProvider.state("resources.clusterInfo.monitor", {
                url: "/monitor",
                templateUrl: "app/business/resources/views/hypervisor/cluster/monitor.html",
                controller: "resources.clusterInfo.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》主机
            $stateProvider.state("resources.clusterInfo.host", {
                url: "/host",
                templateUrl: "app/business/resources/views/hypervisor/host/host.html",
                controller: "resources.clusterInfo.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》存储
            $stateProvider.state("resources.clusterInfo.store", {
                url: "/store",
                templateUrl: "app/business/resources/views/hypervisor/store/store.html",
                controller: "resources.clusterInfo.store.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/store/storeCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.store.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》虚拟机
            $stateProvider.state("resources.clusterInfo.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "resources.clusterInfo.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》设备
            $stateProvider.state("resources.clusterInfo.device", {
                url: "/device",
                templateUrl: "app/business/resources/views/hypervisor/cluster/deviceResource.html",
                controller: "resources.clusterInfo.device.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/deviceResourceCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.device.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》资源调度
            $stateProvider.state("resources.clusterInfo.schedule", {
                url: "/schedule",
                templateUrl: "app/business/resources/views/hypervisor/cluster/schedule.html",
                controller: "resources.clusterInfo.schedule.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/scheduleCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.schedule.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》资源调度 》建议
            $stateProvider.state("resources.clusterInfo.schedule.suggest", {
                url: "/schedule",
                templateUrl: "app/business/resources/views/hypervisor/cluster/scheduleSuggest.html",
                controller: "resources.clusterInfo.schedule.suggest.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/scheduleSuggestCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.schedule.suggest.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟集群详情 》资源调度 》历史
            $stateProvider.state("resources.clusterInfo.schedule.history", {
                url: "/history",
                templateUrl: "app/business/resources/views/hypervisor/cluster/scheduleHistory.html",
                controller: "resources.clusterInfo.schedule.history.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/cluster/scheduleHistoryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.clusterInfo.schedule.history.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情
            $stateProvider.state("resources.vmInfo", {
                url: "/vmInfo?name&from&vmId&isTemplate&isVsa&vmType",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/vmInfo.html",
                controller: "resources.vmInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/vmInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》概要
            $stateProvider.state("resources.vmInfo.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/hypervisor/vm/summary.html",
                controller: "resources.vmInfo.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》性能监控
            $stateProvider.state("resources.vmInfo.monitor", {
                url: "/monitor",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/monitor.html",
                controller: "resources.vmInfo.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》硬件
            $stateProvider.state("resources.vmInfo.hardware", {
                url: "/hardware",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardware.html",
                controller: "resources.vmInfo.hardware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》硬件 》CPU
            $stateProvider.state("resources.vmInfo.hardware.cpu", {
                url: "/cpu",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareCpu.html",
                controller: "resources.vmInfo.hardware.cpu.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareCpuCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.cpu.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》硬件 》内存
            $stateProvider.state("resources.vmInfo.hardware.memory", {
                url: "/memory",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareMemory.html",
                controller: "resources.vmInfo.hardware.memory.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareMemoryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.memory.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机详情 》硬件 》磁盘
            $stateProvider.state("resources.vmInfo.hardware.disk", {
                url: "/disk",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareDisk.html",
                controller: "resources.vmInfo.hardware.disk.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareDiskCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.disk.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机详情 》硬件 》网卡
            $stateProvider.state("resources.vmInfo.hardware.nic", {
                url: "/nic",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareNic.html",
                controller: "resources.vmInfo.hardware.nic.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareNicCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.nic.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机详情 》硬件 》USB控制器
            $stateProvider.state("resources.vmInfo.hardware.controller", {
                url: "/controller",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareController.html",
                controller: "resources.vmInfo.hardware.controller.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareControllerCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.controller.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机详情 》硬件 》USB设备
            $stateProvider.state("resources.vmInfo.hardware.device", {
                url: "/device",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareDevice.html",
                controller: "resources.vmInfo.hardware.device.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareDeviceCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.device.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //虚拟化 》虚拟机详情 》硬件 》光驱
            $stateProvider.state("resources.vmInfo.hardware.cd", {
                url: "/cd",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/hardwareCd.html",
                controller: "resources.vmInfo.hardware.cd.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/hardwareCdCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.hardware.cd.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》选项
            $stateProvider.state("resources.vmInfo.option", {
                url: "/option",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/option.html",
                controller: "resources.vmInfo.option.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/optionCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.option.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》虚拟机详情 》快照
            $stateProvider.state("resources.vmInfo.snapshot", {
                url: "/snapshot",
                templateUrl: "app/business/resources/views/hypervisor/vmInfo/snapshot.html",
                controller: "resources.vmInfo.snapshot.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vmInfo/snapshotCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.vmInfo.snapshot.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情
            $stateProvider.state("resources.storeInfo", {
                url: "/storeInfo?storeName&from&storeId&hyperId&hyperType",
                templateUrl: "app/business/resources/views/hypervisor/store/storeInfo.html",
                controller: "resources.storeInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/store/storeInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》概要
            $stateProvider.state("resources.storeInfo.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/hypervisor/store/summary.html",
                controller: "resources.storeInfo.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/store/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》性能监控
            $stateProvider.state("resources.storeInfo.monitor", {
                url: "/monitor",
                templateUrl: "app/business/resources/views/hypervisor/store/monitor.html",
                controller: "resources.storeInfo.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/store/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》概要 >> 迁移磁盘
            $stateProvider.state("resources.migrateDisk", {
                url: "/migrateDisk?datastoreId&zoneId&hypervisorId&category",
                templateUrl: "app/business/resources/views/hypervisor/disk/migrate.html",
                controller: "resources.migrateDisk.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/disk/migrateDiskCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.migrateDisk.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》虚拟机
            $stateProvider.state("resources.storeInfo.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "resources.storeInfo.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》主机
            $stateProvider.state("resources.storeInfo.host", {
                url: "/host",
                templateUrl: "app/business/resources/views/hypervisor/host/host.html",
                controller: "resources.storeInfo.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //虚拟化 》存储详情 》磁盘
            $stateProvider.state("resources.storeInfo.storeDisk", {
                url: "/storeDisk",
                templateUrl: "app/business/resources/views/hypervisor/disk/storeDisk.html",
                controller: "resources.storeInfo.storeDisk.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/disk/storeDiskCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.storeInfo.storeDisk.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备
            $stateProvider.state("resources.device", {
                url: "/device",
                templateUrl: "app/framework/views/left.html",
                controller: "resources.device.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/deviceCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器
            $stateProvider.state("resources.device.host", {
                url: "/host",
                templateUrl: "app/business/resources/views/device/host/host.html",
                controller: "resources.device.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->接入机架式服务器
            $stateProvider.state("resources.addRackHost", {
                url: "/addRackhost",
                templateUrl: "app/business/resources/views/device/host/addHost/addRackHost.html",
                controller: "resources.device.addRackHost.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/addHost/addRackHost'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.addRackHost.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //设备->服务器->服务器详情
            $stateProvider.state("resources.hostDetail", {
                url: "/hostDetail?hostId&type&serverType&name",
                templateUrl: "app/business/resources/views/device/host/hostDetail/hostDetail.html",
                controller: "resources.device.hostDetail.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostDetail/hostDetailCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.hostDetail.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->服务器详情->概要
            $stateProvider.state("resources.hostDetail.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/device/host/hostDetail/summary.html",
                controller: "resources.device.hostDetail.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostDetail/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.hostDetail.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->服务器详情->性能监控
            $stateProvider.state("resources.hostDetail.monitor", {
                url: "/monitorInfo",
                templateUrl: "app/business/resources/views/hypervisor/host/monitorInfo.html",
                controller: "resources.host.monitorInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/host/monitorInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.host.monitorInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //设备->服务器->服务器详情->服务器性能监控
            $stateProvider.state("resources.hostDetail.monitor.server", {
                url: "/monitor",
                templateUrl: "app/business/resources/views/hypervisor/host/monitor.html",
                controller: "resources.host.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/host/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.host.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //设备->服务器->服务器详情->存储TOP统计
            $stateProvider.state("resources.hostDetail.monitor.storageMonitor", {
                url: "/storagemonitor",
                templateUrl: "app/business/resources/views/hypervisor/host/storageTopMonitor.html",
                controller: "resources.host.storageMonitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/host/storageTopMonitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.host.storageMonitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->服务器详情->硬件
            $stateProvider.state("resources.hostDetail.hardware", {
                url: "/hardware",
                templateUrl: "app/business/resources/views/device/host/hostDetail/hardware.html",
                controller: "resources.device.hostDetail.hardware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostDetail/hardwareCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.hostDetail.hardware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->服务器详情->虚拟机
            $stateProvider.state("resources.hostDetail.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/device/host/hostDetail/vm.html",
                controller: "resources.device.hostDetail.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostDetail/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.hostDetail.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->服务器->服务器详情->虚拟机->引用虚拟机
            $stateProvider.state("resources.hostDetail.vm.list", {
                url: "/vmlist",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "resources.device.hostDetail.vm.list.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.hostDetail.vm.list.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机框
            $stateProvider.state("resources.device.rack", {
                url: "/rack",
                templateUrl: "app/business/resources/views/device/rack/rack.html",
                controller: "resources.device.rack.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/rack/rackCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.rack.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机框->接入机框
            $stateProvider.state("resources.addRack", {
                url: "/addRack",
                templateUrl: "app/business/resources/views/device/rack/addRack/addRack.html",
                controller: "resources.addRack.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/rack/addRack/addRackCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addRack.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机框->机框详情
            $stateProvider.state("resources.rackDetail", {
                url: "/rackDetail?chassisId",
                templateUrl: "app/business/resources/views/device/rack/rackDetail.html",
                controller: "resources.device.rackDetail.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/rack/rackDetailCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.rackDetail.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机框->设置接入参数
            $stateProvider.state("resources.paramSetting", {
                url: "/device/rack/setting?chassisId",
                templateUrl: "app/business/resources/views/device/rack/cfgAddingParams.html",
                controller: "resources.device.cfgAddingParams.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/rack/cfgAddingParamsCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.cfgAddingParams.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->交换机
            $stateProvider.state("resources.device.switch", {
                url: "/switch",
                templateUrl: "app/business/resources/views/device/switch/switch.html",
                controller: "resources.device.switch.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/switch/switchCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.switch.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->交换机->接入交换机
            $stateProvider.state("resources.addSwitch", {
                url: "/addSwitch",
                templateUrl: "app/business/resources/views/device/switch/addSwitch/addSwitch.html",
                controller: "resources.device.addSwitch.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/switch/addSwitchCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.addSwitch.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->交换机->交换机详情
            $stateProvider.state("resources.switchDetail", {
                url: "/switchDetail?id&name",
                templateUrl: "app/business/resources/views/device/switch/switchDetail.html",
                controller: "resources.device.switchDetail.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/switch/switchDetailCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.switchDetail.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->防火墙
            $stateProvider.state("resources.device.firewall", {
                url: "/firewall",
                templateUrl: "app/business/resources/views/device/firewall/firewall.html",
                controller: "resources.device.firewall.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/firewall/firewallCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.firewall.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->防火墙->接入防火墙
            $stateProvider.state("resources.addFirewall", {
                url: "/addFirewall",
                templateUrl: "app/business/resources/views/device/firewall/addFirewall/addFirewall.html",
                controller: "resources.addFirewall.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/firewall/addFirewall/addFirewallCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addFirewall.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->负载均衡
            $stateProvider.state("resources.device.balance", {
                url: "/balance",
                templateUrl: "app/business/resources/views/device/balance/balance.html",
                controller: "resources.device.balance.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/balance/balanceCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.balance.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->接入负载均衡
            $stateProvider.state("resources.addLoadBalancer", {
                url: "/addLoadBalancer",
                templateUrl: "app/business/resources/views/device/balance/addLoadBalancer/addLoadBalancer.html",
                controller: "resources.addLoadBalancer.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/balance/addLoadBalancer/addLoadBalancerCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addLoadBalancer.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->链路管理
            $stateProvider.state("resources.device.link", {
                url: "/link",
                templateUrl: "app/business/resources/views/device/link/linkMgn.html",
                controller: "resources.device.linkMgn.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/link/linkMgnCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.linkMgn.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->SAN
            $stateProvider.state("resources.device.san", {
                url: "/san",
                templateUrl: "app/business/resources/views/device/san/san.html",
                controller: "resources.device.san.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/san/sanCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.san.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->SAN->SAN详情
            $stateProvider.state("resources.sanDetail", {
                url: "/sanDetail?id",
                templateUrl: "app/business/resources/views/device/san/sanDetail.html",
                controller: "resources.device.sanDetail.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/san/sanDetailCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.sanDetail.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->SAN->接入san设备
            $stateProvider.state("resources.addSan", {
                url: "/addSan",
                templateUrl: "app/business/resources/views/device/san/addSan/addSan.html",
                controller: "resources.addSan.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/san/addSan/addSanCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addSan.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->FusionStorage
            $stateProvider.state("resources.device.fs", {
                url: "/fusionStorage",
                templateUrl: "app/business/resources/views/device/fusionStorage/fusionStorage.html",
                controller: "resources.device.fs.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/fusionStorage/fusionStorageCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.fs.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机房
            $stateProvider.state("resources.device.room", {
                url: "/room",
                templateUrl: "app/business/resources/views/device/room/room.html",
                controller: "resources.device.room.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/room/roomCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.room.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->机柜
            $stateProvider.state("resources.device.cabinet", {
                url: "/cabinet",
                templateUrl: "app/business/resources/views/device/cabinet/cabinet.html",
                controller: "resources.device.cabinet.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/cabinet/cabinetCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.cabinet.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->适配包管理
            $stateProvider.state("resources.device.adaptation", {
                url: "/adaptation",
                templateUrl: "app/business/resources/views/device/adaptation/adaptation.html",
                controller: "resources.device.adaptation.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/adaptation/adaptationCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.adaptation.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //设备->物理设备导入
            $stateProvider.state("resources.device.import", {
                url: "/import",
                templateUrl: "app/business/resources/views/device/import/import.html",
                controller: "resources.device.import.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/import/importCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.import.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板
            $stateProvider.state("resources.templateSpec", {
                url: "/templateSpec/template",
                //相对于根路径
                templateUrl: "app/framework/views/left.html",
                controller: "resources.templateSpec.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/templateSpecCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板/应用模板
            $stateProvider.state("resources.templateSpec.appTemplate", {
                url: "/appTemplate",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/appTemplate.html",
                controller: "resources.templateSpec.template.appTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/appTemplate/appTemplateCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.appTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // 资源/模板/应用模板(ICT定义路由)
            $stateProvider.state("resources.openStackResource.appTemplate", {
                url: "/appTemplate",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/appTemplate.html",
                controller: "resources.templateSpec.template.appTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/appTemplate/appTemplateCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.appTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            $stateProvider.state("resources.appTemplate", {
                url: "/appTemplate",
                templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/designer/manager.html"
            });

            $stateProvider.state("resources.appTemplate.design", {
                url: "/design?templateId&mode",
                templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/designer/layout/layout.html",
                controller: "app.designer.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = ["app/business/resources/controllers/templateSpec/template/appTemplate/designer/layout/layoutCtrl"];
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

            $stateProvider.state("resources.importTemplate", {
                url: "/importTemplate",
                templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/import/importTemplate.html",
                controller: "app.importTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = ["app/business/resources/controllers/templateSpec/template/appTemplate/import/importTemplateCtrl"];
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

            $stateProvider.state("resources.importTemplate.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/import/baseInfo.html",
                        controller: "app.importTemplate.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/appTemplate/import/baseInfoCtrl'//相对于basePath
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
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/import/confirm.html",
                        controller: "app.importTemplate.confirm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/appTemplate/import/confirmCtrl'//相对于basePath
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
                    },
                    "upload": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/appTemplate/import/upload.html",
                        controller: "app.importTemplate.upload.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/appTemplate/import/uploadCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("app.importTemplate.upload.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/模板/脚本
            $stateProvider.state("resources.templateSpec.script", {
                url: "/script",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/script/script.html",
                controller: "resources.templateSpec.template.script.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/script/scriptCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.script.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/脚本/修复
            $stateProvider.state("resources.repairScript", {
                url: "/repairScript?id",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/script/repair/repair.html",
                controller: "resources.repairScript.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/script/repair/repairCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.repairScript.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/脚本/修复/导航
            $stateProvider.state("resources.repairScript.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/script/repair/baseInfo.html",
                        controller: "resources.repairScript.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/script/repair/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.repairScript.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "upload": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/script/repair/upload.html",
                        controller: "resources.repairScript.upload.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/script/repair/uploadCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.repairScript.upload.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/模板与规格/脚本/脚本分发
            $stateProvider.state("resources.distributeScript", {
                url: "/distributeScript?id",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/script/distribute/distribute.html",
                controller: "resources.distributeScript.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/script/distribute/distributeCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.distributeScript.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/脚本/脚本分发/导航
            $stateProvider.state("resources.distributeScript.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/script/distribute/baseInfo.html",
                        controller: "resources.distributeScript.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/script/distribute/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeScript.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "selectVm": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/script/distribute/selectVm.html",
                        controller: "resources.distributeScript.selectVm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/script/distribute/selectVmCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeScript.selectVm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirm": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/script/distribute/confirm.html",
                        controller: "resources.distributeScript.confirm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/script/distribute/confirmCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeScript.confirm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/模板/虚拟机模板
            $stateProvider.state("resources.templateSpec.vmTemplateResources", {
                url: "/vmTemplateResources",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/vmTemplateResources/vmTemplateResources.html",
                controller: "resources.templateSpec.template.vmTemplateResources.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/vmTemplateResources/vmTemplateResourcesCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.vmTemplateResources.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板/虚拟机模板
            $stateProvider.state("resources.templateSpec.vmTemplateResources.vmTemplate", {
                url: "/vmTemplate",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/vmTemplate.html",
                controller: "resources.templateSpec.template.vmTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/vmTemplate/vmTemplateCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.vmTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板/虚拟机逻辑模板
            $stateProvider.state("resources.templateSpec.vmTemplateResources.logicVmTemplate", {
                url: "/logicVmTemplate",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/logicVmTemplate/logicVmTemplate.html",
                controller: "resources.templateSpec.template.logicVmTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/logicVmTemplate/logicVmTemplateCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.logicVmTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板/软件包
            $stateProvider.state("resources.templateSpec.software", {
                url: "/software",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/software/software.html",
                controller: "resources.templateSpec.template.software.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/software/softwareCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.template.software.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/软件包/修复
            $stateProvider.state("resources.repairSoftwarePackage", {
                url: "/repairSoftwarePackage?id",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/software/repair/repair.html",
                controller: "resources.repairSoftware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/software/repair/repairCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.repairSoftware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/软件包/修复/导航
            $stateProvider.state("resources.repairSoftwarePackage.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/repair/baseInfo.html",
                        controller: "resources.repairSoftware.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/repair/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.repairSoftware.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "upload": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/repair/upload.html",
                        controller: "resources.repairSoftware.upload.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/repair/uploadCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.repairSoftware.upload.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/模板与规格/软件包/软件分发
            $stateProvider.state("resources.distributeSoftware", {
                url: "/distributeSoftware?id",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/software/distribute/distribute.html",
                controller: "resources.distributeSoftware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/software/distribute/distributeCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.distributeSoftware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/软件包/软件分发/导航
            $stateProvider.state("resources.distributeSoftware.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/distribute/baseInfo.html",
                        controller: "resources.distributeSoftware.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/distribute/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeSoftware.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "selectVm": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/distribute/selectVm.html",
                        controller: "resources.distributeSoftware.selectVm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/distribute/selectVmCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeSoftware.selectVm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirm": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/distribute/confirm.html",
                        controller: "resources.distributeSoftware.confirm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/distribute/confirmCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.distributeSoftware.confirm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/模板与规格/软件包/添加
            $stateProvider.state("resources.registSoftwarePackage", {
                url: "/registSoftwarePackage?action&id&from",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/software/registSoftware/registSoftware.html",
                controller: "resources.registSoftware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/software/registSoftware/registSoftwareCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.registSoftware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/软件包/添加/导航
            $stateProvider.state("resources.registSoftwarePackage.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/registSoftware/baseInfo.html",
                        controller: "resources.software.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/registSoftware/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.software.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "commandConfig": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/registSoftware/commandConfig.html",
                        controller: "resources.software.commandConfig.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/registSoftware/commandConfigCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.software.commandConfig.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirm": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/registSoftware/confirm.html",
                        controller: "resources.software.confirm.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/registSoftware/confirmCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.software.confirm.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "upload": {
                        //相对于根路径
                        templateUrl: "app/business/resources/views/templateSpec/template/software/registSoftware/upload.html",
                        controller: "resources.software.upload.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/software/registSoftware/uploadCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.software.upload.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/规格/虚拟机规格
            $stateProvider.state("resources.templateSpec.vmSpec", {
                url: "/vmSpec",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/spec/vmSpec/vmSpec.html",
                controller: "resources.templateSpec.spec.vmSpec.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/spec/vmSpec/vmSpecCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.spec.vmSpec.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/规格/VPC规格
            $stateProvider.state("resources.templateSpec.vpcSpec", {
                url: "/vpcSpec",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/spec/vpcSpec/vpcSpec.html",
                controller: "resources.templateSpec.spec.vpcSpec.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/spec/vpcSpec/vpcSpecCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.templateSpec.spec.vpcSpec.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池
            $stateProvider.state("resources.rpool", {
                url: "/rpool",
                //相对于根路径
                templateUrl: "app/framework/views/left.html",
                controller: "resources.rpool.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/rpoolCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.rpool.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/云存储
            $stateProvider.state("resources.rpool.cloudStorage", {
                url: "/cloudStorage",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/cloudStorage/cloudStorage.html",
                controller: "resources.rpool.cloudStorage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/cloudStorage/cloudStorageCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.rpool.cloudStorage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone
            $stateProvider.state("resources.rpool.zone", {
                url: "/zone",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zone.html",
                controller: "resources.rpool.zone.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.rpool.zone.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源
            $stateProvider.state("resources.zoneResources", {
                url: "/zoneResources?id&name",
                //相对于根路径
                templateUrl: "app/framework/views/left.html",
                controller: "resources.zoneResources.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/zoneResourcesCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/概览
            $stateProvider.state("resources.zoneResources.summary", {
                url: "/summary",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/summary/summary.html",
                controller: "resources.zoneResources.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/summary/summaryCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/概览/zone概览
            $stateProvider.state("resources.zoneResources.summary.zoneSummary", {
                url: "/zoneSummary",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/summary/zoneSummary.html",
                controller: "resources.zoneResources.summary.zoneSummary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/summary/zoneSummaryCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.summary.zoneSummary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/概览/主机
            $stateProvider.state("resources.zoneResources.summary.host", {
                url: "/host",
                templateUrl: "app/business/resources/views/device/host/host.html",
                controller: "resources.device.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/概览/交换机
            $stateProvider.state("resources.zoneResources.summary.switch", {
                url: "/switch",
                templateUrl: "app/business/resources/views/device/switch/switch.html",
                controller: "resources.device.switch.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/switch/switchCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.switch.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/概览/FusionStorage
            $stateProvider.state("resources.zoneResources.summary.san", {
                url: "/san",
                templateUrl: "app/business/resources/views/device/san/san.html",
                controller: "resources.device.san.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/device/san/sanCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.device.san.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/summary
            $stateProvider.state("resources.zoneResources.networkSummary", {
                url: "/network/summary",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/summary/summary.html",
                controller: "resources.zoneResources.network.networkSummary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/summary/summaryCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.networkSummary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/DVS
            $stateProvider.state("resources.zoneResources.dvs", {
                url: "/network/dvs",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/dvs/dvs.html",
                controller: "resources.zoneResources.network.dvs.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/dvs/dvsCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.dvs.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/公网IP池
            $stateProvider.state("resources.zoneResources.publicIP", {
                url: "/network/publicIP",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/publicIP/publicIP.html",
                controller: "resources.zoneResources.network.publicIP.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/publicIP/publicIPCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.publicIP.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/虚拟防火墙
            $stateProvider.state("resources.zoneResources.virtualFirewall", {
                url: "/network/virtualFirewall",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/virtualFirewall/virtualFirewall.html",
                controller: "resources.zoneResources.network.virtualFirewall.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/virtualFirewall/virtualFirewallCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.virtualFirewall.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/硬件防火墙
            $stateProvider.state("resources.zoneResources.virtualFirewall.hardwareFirewall", {
                url: "/hardwareFirewall",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/virtualFirewall/hardwareFirewall.html",
                controller: "resources.zoneResources.network.hardwareFirewall.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/virtualFirewall/hardwareFirewallCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.hardwareFirewall.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/软件防火墙
            $stateProvider.state("resources.zoneResources.virtualFirewall.softwareFirewall", {
                url: "/softwareFirewall",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/virtualFirewall/softwareFirewall.html",
                controller: "resources.zoneResources.network.softwareFirewall.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/virtualFirewall/softwareFirewallCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.softwareFirewall.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络
            $stateProvider.state("resources.zoneResources.vsaNetwork", {
                url: "/network/vsaNetwork",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaNetwork.html",
                controller: "resources.zoneResources.network.vsaNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vsaNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络
            $stateProvider.state("resources.zoneResources.vsaNetwork.vsaManagerNetwork", {
                url: "/vsaManagerNetwork",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/vsaManagerNetwork.html",
                controller: "resources.zoneResources.network.vsaManagerNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/vsaManagerNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vsaManagerNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络/添加VSA管理网络
            $stateProvider.state("resources.addVsaMgnNetwork", {
                url: "/addVsaNetwork",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/addVsaMgnNetwork.html",
                controller: "resources.addVsaMgnNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/addVsaMgnNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addVsaMgnNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络/添加VSA管理网络/导航
            $stateProvider.state("resources.addVsaMgnNetwork.navigation", {
                url: "/navigation?zoneId&zoneName",
                views: {
                    "baseInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/baseInfo.html",
                        controller: "resources.addVsaMgnNetwork.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/baseInfoCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addVsaMgnNetwork.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "resourceChoice": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/resourceChoice.html",
                        controller: "resources.addVsaMgnNetwork.resourceChoice.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/resourceChoiceCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addVsaMgnNetwork.resourceChoice.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "netExportLimit": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/netExportLimit.html",
                        controller: "resources.addVsaMgnNetwork.netExportLimit.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/netExportLimitCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addVsaMgnNetwork.netExportLimit.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirmInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/confirmInfo.html",
                        controller: "resources.addVsaMgnNetwork.confirmInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network//vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/confirmInfoCtrl'                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addVsaMgnNetwork.confirmInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络/修改VSA管理网络
            $stateProvider.state("resources.modifyVsaMgnNetwork", {
                url: "/modifyVsaNetwork",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/addVsaMgnNetwork.html",
                controller: "resources.modifyVsaMgnNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/modifyVsaMgnNetwork/modifyVsaMgnNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.modifyVsaMgnNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/VSA管理网络/修改VSA管理网络/导航
            $stateProvider.state("resources.modifyVsaMgnNetwork.navigation", {
                url: "/navigation?zoneId&zoneName&id",
                views: {
                    "baseInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/baseInfo.html",
                        controller: "resources.modifyVsaMgnNetwork.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/modifyVsaMgnNetwork/baseInfoCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyVsaMgnNetwork.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "resourceChoice": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/resourceChoice.html",
                        controller: "resources.modifyVsaMgnNetwork.resourceChoice.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/modifyVsaMgnNetwork/resourceChoiceCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyVsaMgnNetwork.resourceChoice.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "netExportLimit": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/netExportLimit.html",
                        controller: "resources.modifyVsaMgnNetwork.netExportLimit.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/modifyVsaMgnNetwork/netExportLimitCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyVsaMgnNetwork.netExportLimit.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirmInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/addVsaMgnNetwork/confirmInfo.html",
                        controller: "resources.modifyVsaMgnNetwork.confirmInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network//vsaNetwork/vsaManagerNetwork/modifyVsaMgnNetwork/confirmInfoCtrl'                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyVsaMgnNetwork.confirmInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/资源池/zone资源/网络资源/vtep网络
            $stateProvider.state("resources.zoneResources.vsaNetwork.vtepNetwork", {
                url: "vtepNetwork",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/vtepNetwork.html",
                controller: "resources.zoneResources.network.vtepNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/vtepNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vtepNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // 资源/资源池/zone资源/网络资源/vtep网络/创建Vtep网络
            $stateProvider.state("resources.addVtepNetwork", {
                url: "addVtepNetwork?zoneId&zoneName",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetwork/addVtepNetwork.html",
                controller: "resources.zoneResources.network.vtepNetwork.addVtepNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vtepNetwork.addVtepNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // 资源/资源池/zone资源/网络资源/vtep网络/修改Vtep网络
            $stateProvider.state("resources.modifyVtepNetwork", {
                url: "modifyVtepNetwork?zoneId&zoneName&id",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/addVtepNetwork/addVtepNetwork.html",
                controller: "resources.zoneResources.network.vtepNetwork.modifyVtepNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/modifyVtepNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vtepNetwork.modifyVtepNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // 资源/资源池/zone资源/网络资源/VLB
            $stateProvider.state("resources.zoneResources.vlbPool", {
                url: "/network/vlbPool",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vlbPool/vlbPool.html",
                controller: "resources.zoneResources.network.vlbPool.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vlbPool/vlbPoolCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.network.vlbPool.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/可用分区
            $stateProvider.state("resources.zoneResources.availableZone", {
                url: "/availableZone",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/availableZone/availableZone.html",
                controller: "resources.zoneResources.availableZone.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/availableZone/availableZoneCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.availableZone.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/可用分区/添加可用分区
            $stateProvider.state("resources.addAz", {
                url: "/addAz?zoneId&zoneName",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/availableZone/addAz.html",
                controller: "resources.zoneResources.addAz.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/availableZone/addAzCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.addAz.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/计算资源池
            $stateProvider.state("resources.zoneResources.computing", {
                url: "/computing",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/computing/computing.html",
                controller: "resources.zoneResources.computing.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/computing/computingCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.computing.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/计算资源池/关联集群
            $stateProvider.state("resources.associateCluster", {
                url: "/associateCluster?zoneId&zoneName",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/computing/associateZone.html",
                controller: "resources.associateCluster.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/computing/associateClusterCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.associateCluster.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/物理资源池
            $stateProvider.state("resources.zoneResources.physical", {
                url: "/physical",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/physical/physical.html",
                controller: "resources.zoneResources.physical.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/physical/physicalCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.physical.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/物理资源池/物理主机
            $stateProvider.state("resources.zoneResources.physical.dedicatedServers", {
                url: "/dedicatedServers",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/physical/dedicatedServers/dedicatedServers.html",
                controller: "resources.zoneResources.dedicatedServers.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/physical/dedicatedServers/dedicatedServersCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.dedicatedServers.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/物理资源池/物理网络
            $stateProvider.state("resources.zoneResources.physical.physicalNetwork", {
                url: "/dedicatedServers",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/physical/physicalNetwork/physicalNetwork.html",
                controller: "resources.zoneResources.physicalNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/physical/physicalNetwork/physicalNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.physicalNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/存储资源池
            $stateProvider.state("resources.zoneResources.storage", {
                url: "/storage",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/storage/storage.html",
                controller: "resources.zoneResources.storage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/storage/storageCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.storage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/存储资源池/主存储
            $stateProvider.state("resources.zoneResources.storage.mainStorage", {
                url: "/mainStorage",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/storage/mainStorage/mainStorage.html",
                controller: "resources.zoneResources.storage.mainStorage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/storage/mainStorage/mainStorageCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.storage.mainStorage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/存储资源池/二级存储
            $stateProvider.state("resources.zoneResources.storage.secondaryStorage", {
                url: "/secondaryStorage",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/storage/secondaryStorage/secondaryStorage.html",
                controller: "resources.zoneResources.storage.secondaryStorage.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/storage/secondaryStorage/secondaryStorageCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.storage.secondaryStorage.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/存储资源池/容灾存储组
            $stateProvider.state("resources.zoneResources.storage.disasterRecovery", {
                url: "/disasterRecovery",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/storage/disasterRecovery/disasterRecovery.html",
                controller: "resources.zoneResources.storage.disasterRecovery.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/storage/disasterRecovery/disasterRecoveryCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.storage.disasterRecovery.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/系统服务虚拟机
            $stateProvider.state("resources.zoneResources.systemVms", {
                url: "/systemVms",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/systemVms/systemVms.html",
                controller: "resources.zoneResources.systemVms.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/systemVms/systemVmsCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.systemVms.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/vlan池
            $stateProvider.state("resources.zoneResources.vlanPool", {
                url: "/vlan",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/vlanPool.html",
                controller: "resources.zoneResources.vlanPool.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vlanPool/vlanPoolCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.vlanPool.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/vlan池/vlan
            $stateProvider.state("resources.zoneResources.vlanPool.vlan", {
                url: "/vlanPool",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/vlan.html",
                controller: "resources.zoneResources.vlanPool.vlan.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vlanPool/vlanCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.vlanPool.vlan.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/vlan池/vxlan
            $stateProvider.state("resources.zoneResources.vlanPool.vxlan", {
                url: "/vlanPool",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/vxlan.html",
                controller: "resources.zoneResources.vlanPool.vxlan.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/vlanPool/vxlanCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.vlanPool.vxlan.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络
            $stateProvider.state("resources.zoneResources.externalNetwork", {
                url: "/externalNetwork",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/externalNetwork.html",
                controller: "resources.zoneResources.externalNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/externalNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.externalNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络
            $stateProvider.state("resources.zoneResources.externalNetwork.extNetwork", {
                url: "/extNetwork",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/extNetwork.html",
                controller: "resources.zoneResources.externalNetwork.extNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/extNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.externalNetwork.extNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络/添加外部网络
            $stateProvider.state("resources.addExtNetwork", {
                url: "/addExtNetwork",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/addExtNetwork.html",
                controller: "resources.addExtNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/addExtNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.addExtNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络/添加外部网络/导航
            $stateProvider.state("resources.addExtNetwork.navigation", {
                url: "/navigation?zoneId&zoneName",
                views: {
                    "connection": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/connection.html",
                        controller: "resources.addExtNetwork.connection.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/connectionCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.connection.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "baseInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/baseInfo.html",
                        controller: "resources.addExtNetwork.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/baseInfoCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "dvs": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/dvs.html",
                        controller: "resources.addExtNetwork.dvs.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/dvsCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.dvs.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "vlan": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/vlan.html",
                        controller: "resources.addExtNetwork.vlan.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/vlanCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.vlan.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "subnet": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/subnet.html",
                        controller: "resources.addExtNetwork.subnet.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/subnetCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.subnet.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "qos": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/qos.html",
                        controller: "resources.addExtNetwork.qos.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/qosCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.qos.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirmInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/confirmInfo.html",
                        controller: "resources.addExtNetwork.confirmInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/confirmInfoCtrl'                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.addExtNetwork.confirmInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络/修改外部网络
            $stateProvider.state("resources.modifyExtNetwork", {
                url: "/modifyExtNetwork",
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/addExtNetwork.html",
                controller: "resources.modifyExtNetwork.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/modifyExtNetworkCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.modifyExtNetwork.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络/添加外部网络/导航
            $stateProvider.state("resources.modifyExtNetwork.navigation", {
                url: "/navigation?zoneId&zoneName&id",
                views: {
                    "connection": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/connection.html",
                        controller: "resources.modifyExtNetwork.connection.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/connectionCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.connection.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "baseInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/baseInfo.html",
                        controller: "resources.modifyExtNetwork.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/baseInfoCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "dvs": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/dvs.html",
                        controller: "resources.modifyExtNetwork.dvs.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/dvsCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.dvs.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "vlan": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/vlan.html",
                        controller: "resources.modifyExtNetwork.vlan.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/vlanCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.vlan.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "subnet": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/subnet.html",
                        controller: "resources.modifyExtNetwork.subnet.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/subnetCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.subnet.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "qos": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/qos.html",
                        controller: "resources.modifyExtNetwork.qos.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/qosCtrl'
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.qos.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "confirmInfo": {
                        templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/addExtNetwork/confirmInfo.html",
                        controller: "resources.modifyExtNetwork.confirmInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/modifyExtNetwork/confirmInfoCtrl'                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.modifyExtNetwork.confirmInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // 资源/资源池/zone资源/外部网络/外部网络
            $stateProvider.state("resources.zoneResources.externalNetwork.dhcpServer", {
                url: "/dhcpServer",
                //相对于根路径
                templateUrl: "app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/dhcpServer.html",
                controller: "resources.zoneResources.externalNetwork.dhcpServer.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/rpool/zone/zoneResources/network/extNetwork/dhcpServerCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.zoneResources.externalNetwork.dhcpServer.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/虚拟机模板/创建
            $stateProvider.state("resources.createVmTemplate", {
                url: "/createVmTemplate?vmtId&startStep",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/create/createVmTemplate.html",
                controller: "resources.createVmTemplate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/template/vmTemplate/create/createVmTemplateCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.createVmTemplate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // 资源/模板与规格/虚拟机模板/创建/导航
            $stateProvider.state("resources.createVmTemplate.navigation", {
                url: "/navigation",
                views: {
                    "baseInfo": {
                        templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/create/baseInfo.html",
                        controller: "resources.baseInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/vmTemplate/create/baseInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.baseInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "specInfo": {
                        templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/create/specInfo.html",
                        controller: "resources.specInfo.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/vmTemplate/create/specInfoCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.specInfo.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "createVmt": {
                        templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/create/createVmt.html",
                        controller: "resources.createVmt.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/vmTemplate/create/createVmtCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.createVmt.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    },
                    "installSoftware": {
                        templateUrl: "app/business/resources/views/templateSpec/template/vmTemplate/create/installSoftware.html",
                        controller: "resources.installSoftware.ctrl",
                        resolve: {
                            deps: function ($q, $rootScope) {
                                var deferred = $q.defer();
                                var dependencies = [
                                    'app/business/resources/controllers/templateSpec/template/vmTemplate/create/installSoftwareCtrl'//相对于basePath
                                ];
                                require(dependencies, function (ctrl) {
                                    $rootScope.$apply(function () {
                                        $controllerProvider.register("resources.installSoftware.ctrl", ctrl);
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        }
                    }
                }
            });

            // openStack资源
            $stateProvider.state("resources.openStackResource", {
                url: "/openStackResource",
                templateUrl: "app/framework/views/left.html",
                controller: "resources.openStackResourceMain.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/openStackResourceMain'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.openStackResourceMain.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / openStack实例
            $stateProvider.state("resources.openStackResource.region", {
                url: "/region",
                templateUrl: "app/business/resources/views/openStackResource/region/region.html",
                controller: "resources.openStackResource.region.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.openStackResource.region.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 镜像
            $stateProvider.state("resources.openStackResource.image", {
                url: "/image",
                templateUrl: "app/business/resources/views/openStackResource/image/image.html",
                controller: "resources.openStackResource.image.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/image/imageCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.openStackResource.image.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源
            $stateProvider.state("resources.regionResources", {
                url: "/regionResources?region",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/regionResourcesMain.html",
                controller: "resources.regionResources.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/regionResourcesCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 /概览
            $stateProvider.state("resources.regionResources.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/regionSummary.html",
                controller: "resources.regionResources.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/regionSummaryCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 / 可用分区
            $stateProvider.state("resources.regionResources.availableZone", {
                url: "/availableZone",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/availableZone/availableZone.html",
                controller: "resources.regionResources.availableZone.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/availableZone/availableZoneCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.availableZone.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 / 规格
            $stateProvider.state("resources.regionResources.flavor", {
                url: "/flavor",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/flavor/flavor.html",
                controller: "resources.regionResources.flavor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/flavor/flavorCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.flavor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 / 主机
            $stateProvider.state("resources.regionResources.host", {
                url: "/host",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/host/host.html",
                controller: "resources.regionResources.host.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/host/hostCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.host.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // openStack资源 / 实例资源 / 主机/ 详情
            $stateProvider.state("resources.ictHostDetail", {
                url: "/ictHostDetail?region&hostId",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/host/hostDetail/hostDetail.html",
                controller: "resources.ictHostDetail.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/host/hostDetail/hostDetailCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.ictHostDetail.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 / 主机/ 详情/ 概要
            $stateProvider.state("resources.ictHostDetail.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/host/hostDetail/summary.html",
                controller: "resources.ictHostDetail.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/host/hostDetail/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.ictHostDetail.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack资源 / 实例资源 / 主机/ 详情->性能监控
            $stateProvider.state("resources.ictHostDetail.monitor", {
                url: "/monitorInfo",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/host/hostDetail/monitor.html",
                controller: "resources.ictHost.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/host/hostDetail/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.ictHost.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //openStack资源 / 实例资源 / 主机/ 详情->虚拟机
            $stateProvider.state("resources.ictHostDetail.server", {
                url: "/severInfo",
                templateUrl: "app/business/resources/views/openStackResource/server/server.html",
                controller: "resources.ictHost.server.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/server/serverCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.ictHost.server.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // openStack资源 / 实例资源 / 主机组
            $stateProvider.state("resources.regionResources.aggregate", {
                url: "/aggregate",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/aggregate/aggregate.html",
                controller: "resources.regionResources.aggregate.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/aggregate/aggregateCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.aggregate.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // openStack资源 / 实例资源 / 亲和性组
            $stateProvider.state("resources.regionResources.affinity", {
                url: "/affinity",
                templateUrl: "app/business/resources/views/openStackResource/region/regionResources/affinity/affinity.html",
                controller: "resources.regionResources.affinity.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/region/regionResources/affinity/affinityCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.affinity.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            // openStack资源 / 实例资源 / 外部网络
            $stateProvider.state("resources.regionResources.network", {
                url: "/network",
                templateUrl: "app/business/resources/views/openStackResource/network/network.html",
                controller: "resources.regionResources.network.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/network/networkCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.network.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            /**
             * openStack资源 / 实例资源 / VLAN
             */
             $stateProvider.state("resources.regionResources.vlan", {
                 url: "/vlan",
                 templateUrl: "app/business/resources/views/openStackResource/vlan/vlan.html",
                 controller: "resources.regionResources.vlan.ctrl",
                 resolve: {
                     deps: function ($q, $rootScope) {
                         var deferred = $q.defer();
                         var dependencies = [
                             'app/business/resources/controllers/openStackResource/vlan/vlanCtrl'
                         ];
                         require(dependencies, function (ctrl) {
                             $rootScope.$apply(function () {
                                 $controllerProvider.register("resources.regionResources.vlan.ctrl", ctrl);
                                 deferred.resolve();
                             });
                         });
                         return deferred.promise;
                     }
                 }
             });
            /**
             * openStack资源 / 实例资源 / MAC资源池
             */
            $stateProvider.state("resources.regionResources.mac", {
                url: "/mac",
                templateUrl: "app/business/resources/views/openStackResource/mac/mac.html",
                controller: "resources.regionResources.mac.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/mac/macCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("resources.regionResources.mac.ctrl", ctrl);
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
            resourcesCtrl.name
        ];
        var resourcesConfig = angular.module("resources.config", dependency);
        resourcesConfig.config(serviceConfigs);
        return resourcesConfig;
    });