define(["tiny-lib/angular",
    "ui-router/angular-ui-router",
    "app/business/vdc/controllers/vdcMgrCtrl",
    "app/business/user/controllers/organization/orgCtrl",
    "app/business/user/controllers/organization/vdcStatisticCtrl",
    "tiny-directives/FormField",
    "tiny-directives/Tree",
    "tiny-directives/RadioGroup",
    "tiny-directives/Step",
    "tiny-directives/CheckboxGroup",
    "tiny-directives/Searchbox"
],
    function (angular, router, vdcMgrCtrl,orgCtrl, vdcStatisticCtrl) {
        "use strict";

        var serviceConfigs = ["$stateProvider","$controllerProvider", function ($stateProvider,$controllerProvider) {
            
			function statReg(stat, url, template, ctrlName, ctrlPath)
			{
				$stateProvider.state(stat, {
					url: url,
					templateUrl: template,
					controller: ctrlName,
					resolve: {
						ctrl: function ($q) {
							var deferred = $q.defer();
							require([ctrlPath], 
								function (ctrl) {
									$controllerProvider.register(ctrlName, ctrl);
									deferred.resolve();
								});
							return deferred.promise;
						}
					}
				});
			}
			
			$stateProvider.state("vdcMgr", {
                url: "/vdcMgr",
                templateUrl: "app/business/vdc/views/vdcMgr.html",
                controller: "vdcMgr.ctrl"
            });


            // vdc
            $stateProvider.state("vdcMgr.vdc", {
                url: "/vdc",
                templateUrl: "app/framework/views/left.html",
                controller: "vdcMgr.vdc.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/vdc/controllers/vdc/vdcCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.vdc.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            // vdc列表
            $stateProvider.state("vdcMgr.vdc.vdcList", {
                url: "/vdcList",
                templateUrl: "app/business/user/views/organization/org.html",
                controller: "vdcMgr.vdc.vdcList.ctrl"
            });

            //添加vdc
            $stateProvider.state("vdcMgr.createVdc", {
                url: "/createVdc",
                templateUrl: "app/business/user/views/organization/createOrg.html",
                controller: "vdcMgr.createVdc.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/user/controllers/organization/createOrgCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.createVdc.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //orgVdc
            $stateProvider.state("vdcMgr.vdc.orgVdc", {
                url: "/orgVdc",
                templateUrl: "app/business/vdc/views/orgVdc/orgVdc.html",
                controller: "vdcMgr.orgVdc.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/vdc/controllers/orgVdc/orgVdcCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.orgVdc.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //添加组织vdc
            $stateProvider.state("vdcMgr.createOrgVdc", {
                url: "/createOrgVdc",
                templateUrl: "app/business/vdc/views/orgVdc/createOrgVdc.html",
                controller: "vdcMgr.createOrgVdc.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/vdc/controllers/orgVdc/createOrgVdcCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.createOrgVdc.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //vdc 虚拟机
            $stateProvider.state("vdcMgr.vdc.vm", {
                url: "/vm",
                templateUrl: "app/business/resources/views/hypervisor/vm/vm.html",
                controller: "vdcMgr.vdc.vm.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/hypervisor/vm/vmCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.vdc.vm.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            statReg("vdcMgr.vdc.disk", "/disk",
                "app/business/resources/views/hypervisor/disk/disk.html",
                "resources.hypervisor.disk.ctrl", 'app/business/resources/controllers/hypervisor/disk/diskCtrl');




            //openStack 磁盘
            $stateProvider.state("vdcMgr.vdc.volumes", {
                url: "/volumes",
                templateUrl: "app/business/resources/views/openStackResource/volumes/volumes.html",
                controller: "vdcMgr.vdc.volumes.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/volumes/volumesCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.vdc.volumes.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机
            $stateProvider.state("vdcMgr.vdc.server", {
                url: "/server",
                templateUrl: "app/business/resources/views/openStackResource/server/server.html",
                controller: "vdcMgr.vdc.server.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/server/serverCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.vdc.server.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情
            $stateProvider.state("vdcMgr.serverInfo", {
                url: "/serverInfo?vmId&vmName&novaId&region&tenantId",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/serverInfo.html",
                controller: "vdcMgr.serverInfo.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/serverInfoCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情 -》概要
            $stateProvider.state("vdcMgr.serverInfo.summary", {
                url: "/summary",
                templateUrl: "app/business/resources/views/openStackResource/server/summary.html",
                controller: "vdcMgr.server.summary.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/server/summaryCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.server.summary.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情 -》性能监控
            $stateProvider.state("vdcMgr.serverInfo.monitor", {
                url: "/monitor",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/monitor.html",
                controller: "vdcMgr.serverInfo.monitor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/monitorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.monitor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情 -》硬件
            $stateProvider.state("vdcMgr.serverInfo.hardware", {
                url: "/hardware",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/hardware.html",
                controller: "vdcMgr.serverInfo.hardware.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/hardwareCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.hardware.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情 -》硬件 -> 规格
            $stateProvider.state("vdcMgr.serverInfo.hardware.flavor", {
                url: "/flavor",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/hardwareFlavor.html",
                controller: "vdcMgr.serverInfo.hardware.flavor.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/hardwareFlavorCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.hardware.flavor.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

           //openStack 虚拟机详情 -》硬件->磁盘
            $stateProvider.state("vdcMgr.serverInfo.hardware.disk", {
                url: "/disk",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/hardwareDisk.html",
                controller: "vdcMgr.serverInfo.hardware.disk.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/hardwareDiskCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.hardware.disk.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //openStack 虚拟机详情 -》硬件->网卡
            $stateProvider.state("vdcMgr.serverInfo.hardware.nic", {
                url: "/nic",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/hardwareNic.html",
                controller: "vdcMgr.serverInfo.hardware.nic.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/hardwareNicCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.hardware.nic.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            //openStack 虚拟机详情 -》选项
            $stateProvider.state("vdcMgr.serverInfo.option", {
                url: "/option",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/option.html",
                controller: "vdcMgr.serverInfo.option.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/optionCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.option.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });
            //openStack 虚拟机详情 -》快照
            $stateProvider.state("vdcMgr.serverInfo.snapshot", {
                url: "/snapshot",
                templateUrl: "app/business/resources/views/openStackResource/serverInfo/snapshot.html",
                controller: "vdcMgr.serverInfo.snapshot.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/openStackResource/serverInfo/snapshotCtrl'
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.serverInfo.snapshot.ctrl", ctrl);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            	
			// VPC概览
			statReg("vdcMgr.network.summary", "/summary", 
				"app/business/vdc/views/summary.html", 
				"vdcMgr.network.summary.ctrl", 'app/business/vdc/controllers/summaryCtrl');
				
			// network菜单
			statReg("vdcMgr.network", "/network", 
				"app/framework/views/left.html",
				"vdcMgr.network.ctrl", 'app/business/vdc/controllers/networkCtrl');
            			
			// 网络列表
			statReg("vdcMgr.network.list", "/list", 
				"app/business/vdc/views/network/net.html", 
				"vdcMgr.network.list.ctrl", 'app/business/vdc/controllers/network/net');
			
			// 创建网络createNetwork
			statReg("vdcMgr_newNetwork", "/newNetwork?vpc&id", 
				"app/business/vdc/views/network/newNetStep.html", 
				"vdcMgr_newNetwork.ctrl", 'app/business/vdc/controllers/network/newNetStep');
			
			// 路由器
			statReg("vdcMgr.network.router", "/router", 
				"app/business/vdc/views/router/router.html", 
				"vdcMgr.network.router.ctrl", 'app/business/vdc/controllers/router/routerCtrl');


            // 代管授权
            statReg("vdcMgr.vdc.authority", "/authority",
                "app/business/vdc/views/authority/authority.html",
                "vdcMgr.authority.ctrl", 'app/business/vdc/controllers/authority/authorityCtrl');
			
			// 弹性IP
			statReg("vdcMgr.network.eip", "/eip", 
				"app/business/vdc/views/eip/eip.html", 
				"vdcMgr.network.eip.ctrl", 'app/business/vdc/controllers/eipListCtrl');

            // DNAT
			statReg("vdcMgr.network.dnat", "/dnat", 
				"app/business/vdc/views/dnat/dnat.html", 
				"vdcMgr.network.dnat.ctrl", 'app/business/vdc/controllers/dnatListCtrl');
			
			// VPN
			statReg("vdcMgr.vpn", "/vpn", 
				"app/framework/views/left.html",
				"vdcMgr.vpn", 'app/business/vdc/controllers/networkCtrl');
				
			// VPN网关
			statReg("vdcMgr.vpn.gate", "/gate", 
				"app/business/vdc/views/vpn/vpnGate.html", 
				"vdcMgr.vpn.gate.ctrl", 'app/business/vdc/controllers/vpn/gateway');
			
			// 创建VPN链接
			statReg("vdcMgr_vpn_newLink", "/newVPNLink?modify&vpc&vpcName&id", 
				"app/business/vdc/views/vpn/vpnNewStep.html", 
				"vdcMgr_vpn_newLink.ctrl", 'app/business/vdc/controllers/vpn/vpnNewStep');
				
			// VPN链接
			statReg("vdcMgr.vpn.link", "/link", 
				"app/business/vdc/views/vpn/vpnLink.html", 
				"vdcMgr.vpn.link.ctrl", 'app/business/vdc/controllers/vpn/link');
			
			// 安全
			statReg("vdcMgr.security", "/security", 
				"app/framework/views/left.html",
				"vdcMgr.security", 'app/business/vdc/controllers/networkCtrl');
				
			// ACLs
			statReg("vdcMgr.security.acls", "/acls", 
				"app/business/vdc/views/acls/acls.html", 
				"vdcMgr.security.acls.ctrl", 'app/business/vdc/controllers/acls');
			
			// 安全组
			statReg("vdcMgr.security.group", "/group", 
				"app/business/vdc/views/security/group.html", 
				"vdcMgr.security.group", 'app/business/vdc/controllers/security/group');
				
			// 应用层包过滤
			statReg("vdcMgr.security.app", "/app", 
				"app/business/vdc/views/security/app.html", 
				"vdcMgr.security.app", 'app/business/vdc/controllers/security/app');
				
			//安全组(电信比拼)
			statReg("vdcMgr.CT", "/CT", 
				"app/business/vdc/views/security/side.html", 
				"vdcMgr.CT", 'app/business/vdc/controllers/networkCtrl');
			statReg("vdcMgr.CT.groupCT", "/groupCT", 
				"app/business/vdc/views/security/groupCT.html", 
				"vdcMgr.CT.groupCT", 'app/business/vdc/controllers/security/groupCT');
			
            // topo
			statReg("vdcMgr.topo", "/topo", 
				"app/business/vdc/topo/netTopo.html", 
				"vdcMgr.topo", 'app/business/vdc/topo/netTopo');

            // VPC
            statReg("vdcMgr.vpc", "/vpc",
                "app/framework/views/left.html",
                "vdcMgr.vpc", 'app/business/vdc/controllers/networkCtrl');

            // IP带宽
            statReg("vdcMgr.vpc.ipBW", "/ipBW",
                "app/business/vdc/views/ipBW/ipBW.html",
                "vdcMgr.ipBW.ctrl", 'app/business/vdc/controllers/ipBW/ipBW');
            
	    // 资源/规格/VPC规格
            $stateProvider.state("vdcMgr.vpc.vpcSpec", {
                url: "/vpcSpec",
                //相对于根路径
                templateUrl: "app/business/resources/views/templateSpec/spec/vpcSpec/vpcSpec.html",
                controller: "vdcMgr.vdc.vpcSpec.ctrl",
                resolve: {
                    deps: function ($q, $rootScope) {
                        var deferred = $q.defer();
                        var dependencies = [
                            'app/business/resources/controllers/templateSpec/spec/vpcSpec/vpcSpecCtrl'//相对于basePath
                        ];
                        require(dependencies, function (ctrl) {
                            $rootScope.$apply(function () {
                                $controllerProvider.register("vdcMgr.vdc.vpcSpec.ctrl", ctrl);
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
            vdcMgrCtrl.name,
            orgCtrl.name,
            vdcStatisticCtrl.name
        ];
        var vdcConfig = angular.module("vdc.config", dependency);
        vdcConfig.config(serviceConfigs);

        return vdcConfig;
    });