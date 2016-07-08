/*global define, require*/
define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/network/services/commonService/vpcCommService",
        "app/services/cookieService",
        "tiny-directives/Select",
        "tiny-directives/FilterSelect",
        "tiny-directives/Textbox",
        "tiny-directives/DateTime",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/CirqueChart"
    ],
    function (angular, router, commonService, LocalStorage) {
        "use strict";

        //定义框架的路由配置module
        var networkConfig = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
                $urlRouterProvider.when("/network", "/network/manager/myVPClist");
                $urlRouterProvider.when("/network/manager", "/network/manager/myVPClist");
                $urlRouterProvider.when("/network/vpcmanager", "/network/vpcmanager/summary");
                $urlRouterProvider.when("/network/vpcmanager/", "/network/vpcmanager/summary");
                $urlRouterProvider.when("/network/vpcmanager/acls", ['$state', '$stateParams',
                    function ($state, $stateParams) {
                        var storage = new LocalStorage();
                        var isICT = storage.get("cloudType") === "ICT";
                        var stateName = isICT ? "network.vpcmanager.acls" : "network.vpcmanager.acls.in";
                        $state.go(stateName, {
                            "cloud_infras": $stateParams.cloud_infras,
                            "vpcId": $stateParams.vpcId,
                            "azId": $stateParams.azId,
                            "vpcName": $stateParams.vpcName
                        });
                    }
                ]);
                $urlRouterProvider.when("/network/vpcmanager/acls/", "/network/vpcmanager/acls/in");
                $urlRouterProvider.when("/network/vpcmanager/ictnetwork/", "/network/vpcmanager/ictnetwork/vpcnetwork");
                $urlRouterProvider.when("/network/vpcmanager/ictnetwork", ['$state', '$stateParams',
                    function ($state, $stateParams) {
                        $state.go("network.vpcmanager.ictnetwork.vpcnetwork", {
                            "cloud_infras": $stateParams.cloud_infras,
                            "vpcId": $stateParams.vpcId,
                            "azId": $stateParams.azId,
                            "vpcName": $stateParams.vpcName
                        });
                    }
                ]);

                $stateProvider.state("network", {
                    url: "/network",
                    //相对于根路径
                    templateUrl: "app/business/network/views/network.html"
                });

                $stateProvider.state("network.manager", {
                    url: "/manager",
                    templateUrl: "app/framework/views/left.html",
                    controller: "network.manager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkMgrCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.manager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 概览
                $stateProvider.state("network.manager.navigate", {
                    url: "/navigate",
                    //相对于根路径
                    templateUrl: "app/business/network/views/navigate.html",
                    controller: "network.navigate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/navigateCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.navigate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 我的VPC列表
                $stateProvider.state("network.manager.myVPClist", {
                    url: "/myVPClist",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpc/myVPClist.html",
                    controller: "network.manager.myVPClist",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpc/myVPClistCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.manager.myVPClist", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 我的VPC列表
                $stateProvider.state("network.manager.pubVPClist", {
                    url: "/pubVPClist",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpc/pubVPClist.html",
                    controller: "network.manager.pubVPClist",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpc/pubVPClistCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.manager.pubVPClist", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // VPC代管授权
                $stateProvider.state("network.manager.vpcAuth", {
                    url: "/vpcAuth",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpc/vpcAuth.html",
                    controller: "network.manager.vpcAuth",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpc/vpcAuthCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.manager.vpcAuth", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // VPN管理
                $stateProvider.state("network.vpcmanager", {
                    url: "/vpcmanager?cloud_infras&vpcId&azId&vpcName",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpcmanager.html",
                    controller: "network.vpcmanager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpcmanagerCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.vpcmanager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建VLB
                $stateProvider.state("network.createVLB", {
                    url: "/createVLB?cloud_infras&vpcId&azId&vpcName&lbID&workingMode",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vlb/create/createVLB.html",
                    controller: "network.createVLB.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vlb/create/createVLB' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createVLB.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建VLB向导
                $stateProvider.state("network.createVLB.navigate", {
                    url: "/navigate",
                    views: {
                        "basic": {
                            templateUrl: "app/business/network/views/vlb/create/basic.html",
                            controller: "network.vlb.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/create/basicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.vlb.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "addMonitor": {
                            templateUrl: "app/business/network/views/vlb/create/addMonitor.html",
                            controller: "network.vlb.create.addMonitor.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/create/addMonitorCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.vlb.create.addMonitor.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configMonitor": {
                            templateUrl: "app/business/network/views/vlb/create/configMonitor.html",
                            controller: "network.vlb.create.configMonitor.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/create/configMonitorCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.vlb.create.configMonitor.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "bindVM": {
                            templateUrl: "app/business/network/views/vlb/create/bindVM.html",
                            controller: "network.vlb.create.bindVM.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/create/bindVMCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.vlb.create.bindVM.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/vlb/create/confirm.html",
                            controller: "network.vlb.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/create/confirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.vlb.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // ICT创建VLB
                $stateProvider.state("network.createICTVLB", {
                    url: "/createICTVLB?cloud_infras&vpcId&azId&vpcName&lbID&workingMode",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vlb/createICT/createVLB.html",
                    controller: "network.createICTVLB.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vlb/createICT/createVLB' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createICTVLB.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建ICT VLB向导
                $stateProvider.state("network.createICTVLB.navigate", {
                    url: "/navigate",
                    views: {
                        "basic": {
                            templateUrl: "app/business/network/views/vlb/createICT/basic.html",
                            controller: "network.ictvlb.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/createICT/basicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.ictvlb.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "addMonitor": {
                            templateUrl: "app/business/network/views/vlb/createICT/addMonitor.html",
                            controller: "network.ictvlb.create.addMonitor.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/createICT/addMonitorCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.ictvlb.create.addMonitor.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configMonitor": {
                            templateUrl: "app/business/network/views/vlb/createICT/configMonitor.html",
                            controller: "network.ictvlb.create.configMonitor.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/createICT/configMonitorCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.ictvlb.create.configMonitor.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "bindVM": {
                            templateUrl: "app/business/network/views/vlb/createICT/bindVM.html",
                            controller: "network.ictvlb.create.bindVM.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/createICT/bindVMCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.ictvlb.create.bindVM.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/vlb/createICT/confirm.html",
                            controller: "network.ictvlb.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vlb/createICT/confirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.ictvlb.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // 创建连接VPN
                $stateProvider.state("network.createLinkVpn", {
                    url: "/createLinkVpn?cloudInfra&vpcId&id&azId&opt&type",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpn/link/createLinkVpn.html",
                    controller: "network.createLinkVpn.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpn/link/createLinkVpnCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createLinkVpn.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建链接VPN向导
                $stateProvider.state("network.createLinkVpn.navigate", {
                    url: "/navigate",
                    views: {
                        "basic": {
                            templateUrl: "app/business/network/views/vpn/link/createBasic.html",
                            controller: "network.linkVpn.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createBasicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "remote": {
                            templateUrl: "app/business/network/views/vpn/link/createRemote.html",
                            controller: "network.linkVpn.create.remote.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createRemoteCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.remote.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "ike": {
                            templateUrl: "app/business/network/views/vpn/link/createIKE.html",
                            controller: "network.linkVpn.create.ike.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createIKECtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.ike.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "ikeUserNet": {
                            templateUrl: "app/business/network/views/vpn/link/createIKEUserNet.html",
                            controller: "network.linkVpn.create.ikeUserNet.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createIKEUserNetCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.ikeUserNet.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "addUser": {
                            templateUrl: "app/business/network/views/vpn/link/createAddUser.html",
                            controller: "network.linkVpn.create.addUser.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createAddUserCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.addUser.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/vpn/link/createConfirm.html",
                            controller: "network.linkVpn.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createConfirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // ICT场景创建连接VPN
                $stateProvider.state("network.createLinkVpnICT", {
                    url: "/createLinkVpnICT?cloudInfra&vpcId&id&azId&opt&type",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpn/link/createICT/createLinkVpn.html",
                    controller: "network.createLinkVpnICT.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpn/link/createICT/createLinkVpnCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createLinkVpnICT.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // ICT场景创建链接VPN向导
                $stateProvider.state("network.createLinkVpnICT.navigate", {
                    url: "/navigate",
                    views: {
                        "basic": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createBasic.html",
                            controller: "network.linkVpn.createICT.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createBasicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "remote": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createRemote.html",
                            controller: "network.linkVpn.createICT.remote.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createRemoteCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.remote.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "ike": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createIKE.html",
                            controller: "network.linkVpn.createICT.ike.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createIKECtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.ike.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "ikeUserNet": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createIKEUserNet.html",
                            controller: "network.linkVpn.createICT.ikeUserNet.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createIKEUserNetCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.ikeUserNet.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "addUser": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createAddUser.html",
                            controller: "network.linkVpn.createICT.addUser.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createAddUserCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.addUser.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/vpn/link/createICT/createConfirm.html",
                            controller: "network.linkVpn.createICT.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/vpn/link/createICT/createConfirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.linkVpn.createICT.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                // 概览
                $stateProvider.state("network.vpcmanager.summary", {
                    url: "/summary",
                    //相对于根路径
                    templateUrl: "app/business/network/views/summary.html",
                    controller: "network.summary.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/summaryCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.summary.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // openstack接VMware,的VPC详情
                $stateProvider.state("network.vmwareVpc", {
                    url: "/vmwareVpc?cloud_infras&vpcId&azId&vpcName",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vmwareVpc/vpcInfo.html",
                    controller: "network.vmwareVpc.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vmwareVpc/vpcInfoCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.vmwareVpc.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                // openstack接VMware,的VPC详情的网络
                $stateProvider.state("network.vmwareVpc.network", {
                    url: "/network",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vmwareVpc/network.html",
                    controller: "network.vmwareVpc.network.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vmwareVpc/networkCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.vmwareVpc.network.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //路由器
                $stateProvider.state("network.vpcmanager.router", {
                    url: "/router",
                    templateUrl: "app/business/network/views/router/router.html",
                    controller: "router.router.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/router/routerCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("router.router.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //vlb
                $stateProvider.state("network.vpcmanager.vlb", {
                    url: "/vlb",
                    templateUrl: "app/business/network/views/vlb/vlblist.html",
                    controller: "network.vlblist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vlb/vlbListCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.vlblist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //部署服务
                $stateProvider.state("network.vpcmanager.deployservice", {
                    url: "/deployservice",
                    templateUrl: "app/business/network/views/service/service.html",
                    controller: "network.deployservice.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/service/serviceCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.deployservice.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //网络
                $stateProvider.state("network.vpcmanager.network", {
                    url: "/network",
                    templateUrl: "app/business/network/views/networklist.html",
                    controller: "network.networklist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkListCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.networklist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //网络
                $stateProvider.state("network.vpcmanager.ictnetwork", {
                    url: "/ictnetwork",
                    templateUrl: "app/business/network/views/networklistICT/networklistICT.html",
                    controller: "network.networklistict.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkListICT/networkListICTCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.networklistict.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //ict vpc网络
                $stateProvider.state("network.vpcmanager.ictnetwork.vpcnetwork", {
                    url: "/vpcnetwork",
                    templateUrl: "app/business/network/views/networklistICT/vpcnetworklist.html",
                    controller: "network.vpcnetworklist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkListICT/vpcNetworkListICTCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.vpcnetworklist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //ict 直连网络
                $stateProvider.state("network.vpcmanager.ictnetwork.directnetwork", {
                    url: "/directnetwork",
                    templateUrl: "app/business/network/views/networklistICT/directnetworklist.html",
                    controller: "network.directnetworklist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkListICT/directNetworkListICTCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.directnetworklist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 弹性IP
                $stateProvider.state("network.vpcmanager.eip", {
                    url: "/eip",
                    templateUrl: "app/business/network/views/eip/eiplist.html",
                    controller: "network.eiplist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/eip/eipListCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.eiplist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //DNAT
                $stateProvider.state("network.vpcmanager.dnat", {
                    url: "/dnat",
                    templateUrl: "app/business/network/views/dnatlist.html",
                    controller: "network.dnatlist.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/dnatListCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.dnatlist.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //ACLS
                $stateProvider.state("network.vpcmanager.acls", {
                    url: "/acls",
                    templateUrl: "app/business/network/views/acls/acls.html",
                    controller: "network.acls.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/acls/aclsCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.acls.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //ACLS-IN
                $stateProvider.state("network.vpcmanager.acls.in", {
                    url: "/in",
                    templateUrl: "app/business/network/views/acls/aclsIn.html",
                    controller: "network.aclsIn.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/acls/aclsInCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.aclsIn.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //ACLS-OUT
                $stateProvider.state("network.vpcmanager.acls.out", {
                    url: "/out",
                    templateUrl: "app/business/network/views/acls/aclsOut.html",
                    controller: "network.aclsOut.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/acls/aclsOutCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.aclsOut.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //securitygroup
                $stateProvider.state("network.vpcmanager.securitygroup", {
                    url: "/securitygroup",
                    templateUrl: "app/business/network/views/securitygroup/securitygroup.html",
                    controller: "network.securitygroup.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/securitygroup/securitygroupCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.securitygroup.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //ASPF
                $stateProvider.state("network.vpcmanager.aspf", {
                    url: "/aspf",
                    templateUrl: "app/business/network/views/aspf.html",
                    controller: "network.aspf.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/aspfCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.aspf.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                //VPN
                $stateProvider.state("network.vpcmanager.vpngateway", {
                    url: "/vpngateway",
                    templateUrl: "app/business/network/views/vpn/gateway/gateway.html",
                    controller: "vpn.gateway.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpn/gateway/gatewayCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("vpn.gateway.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // VPN 链接
                $stateProvider.state("network.vpcmanager.vpnlink", {
                    url: "/vpnlink",
                    templateUrl: "app/business/network/views/vpn/link/link.html",
                    controller: "vpn.link.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpn/link/linkListCtrl'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("vpn.link.ctrl", progressbarCtrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建VPC
                $stateProvider.state("network.createVPC", {
                    url: "/createVPC",
                    //相对于根路径
                    templateUrl: "app/business/network/views/vpc/create/createVPC.html",
                    controller: "network.createVPC.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpc/create/createVPCModule' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $controllerProvider.register("network.createVPC.ctrl", ctrl);
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }
                    }
                });

                // 创建链接VPC向导
                $stateProvider.state("network.createVPC.navigate", {
                    url: "/navigate&azId&cloudInfraId",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/vpc/create/createBasicCtrl', //相对于basePath
                                'app/business/network/controllers/vpc/create/createVpcQuotaCtrl',
                                'app/business/network/controllers/vpc/create/createSelectCtrl',
                                'app/business/network/controllers/vpc/create/createNetInfoCtrl',
                                'app/business/network/controllers/vpc/create/createConfirmCtrl' //相对于basePath
                            ];
                            require(dependencies, function (createBasicCtrl,createVpcQuotaCtrl, createSelectCtrl, createNetInfoCtrl, createConfirmCtrl) {
                                $controllerProvider.register("network.VPC.create.baseInfo.ctrl", createBasicCtrl);
                                $controllerProvider.register("network.VPC.create.vpcQuota.ctrl", createVpcQuotaCtrl);
                                $controllerProvider.register("network.VPC.create.selectType.ctrl", createSelectCtrl);
                                $controllerProvider.register("network.VPC.create.networkInfo.ctrl", createNetInfoCtrl);
                                $controllerProvider.register("network.VPC.create.confirm.ctrl", createConfirmCtrl);
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }
                    },
                    views: {
                        "basicInfo": {
                            templateUrl: "app/business/network/views/vpc/create/createVPCBasic.html",
                            controller: "network.VPC.create.baseInfo.ctrl"
                        },
                        "vpcQuota": {
                            templateUrl: "app/business/network/views/vpc/create/createVpcQuota.html",
                            controller: "network.VPC.create.vpcQuota.ctrl"
                        },
                        "vpcType": {
                            templateUrl: "app/business/network/views/vpc/create/createVPCSelect.html",
                            controller: "network.VPC.create.selectType.ctrl"
                        },
                        "networkInfo": {
                            templateUrl: "app/business/network/views/vpc/create/createNetInfo.html",
                            controller: "network.VPC.create.networkInfo.ctrl"
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/vpc/create/createVPCConfirm.html",
                            controller: "network.VPC.create.confirm.ctrl"
                        }
                    }
                });

                // IT创建网络
                $stateProvider.state("network.createNetwork", {
                    url: "/createNetwork?cloud_infras&vpcId&azId&vpcName",
                    //相对于根路径
                    templateUrl: "app/business/network/views/network/createNetworkModule.html",
                    controller: "network.createNetwork.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/network/createNetworkModule' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createNetwork.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                // IT创建网络向导
                $stateProvider.state("network.createNetwork.navigate", {
                    url: "/navigate",
                    views: {
                        "basicInfo": {
                            templateUrl: "app/business/network/views/network/createNetworkBasic.html",
                            controller: "network.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/network/createBasicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "selectRes": {
                            templateUrl: "app/business/network/views/network/createNetworkSelectRes.html",
                            controller: "network.create.selectType.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/network/createSelectResCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.create.selectType.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "subnetInfo": {
                            templateUrl: "app/business/network/views/network/createNetworkSubnetInfo.html",
                            controller: "network.create.networkInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/network/createSubnetInfoCtrl'
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.create.networkInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/network/createNetworkDirectConfirm.html",
                            controller: "network.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/network/createDirectConfirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("network.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                //ICT环境
                $stateProvider.state("network.createNetworkICTModule", {
                    url: "/createNetworkICTModule?opt&networkID&cloud_infras&vpcId&azId&vpcName",
                    templateUrl: "app/business/network/views/networkICT/createNetworkICTModule.html",
                    controller: "network.createNetworkICTModule.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/networkICT/createNetworkICTModule' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.createNetworkICTModule.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });
                $stateProvider.state("network.createNetworkICTModule.navigate", {
                    url: "/navigate",
                    views: {
                        "basicInfo": {
                            templateUrl: "app/business/network/views/networkICT/createNetworkICTBasic.html",
                            controller: "networkICT.create.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/networkICT/createBasicICTCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("networkICT.create.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "selectRes": {
                            templateUrl: "app/business/network/views/networkICT/createNetworkICTSelectRes.html",
                            controller: "networkICT.create.selectType.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/networkICT/createSelectResICTCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("networkICT.create.selectType.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "subnetInfo": {
                            templateUrl: "app/business/network/views/networkICT/createNetworkICTSubnetInfo.html",
                            controller: "networkICT.create.networkInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/networkICT/createSubnetInfoICTCtrl'
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("networkICT.create.networkInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/network/views/networkICT/createNetworkICTDirectConfirm.html",
                            controller: "networkICT.create.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/network/controllers/networkICT/createDirectConfirmICTCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("networkICT.create.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });
                //公网ip池
                $stateProvider.state("network.vpcmanager.publicIPPool", {
                    url: "/publicIPPool",
                    templateUrl: "app/business/network/views/publicIPPool/publicIPList.html",
                    controller: "network.publicIPPool.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/network/controllers/publicIPPool/publicIPList'
                            ];
                            require(dependencies, function (progressbarCtrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("network.publicIPPool.ctrl", progressbarCtrl);
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
        var network = angular.module("network.config", dependency);
        network.config(networkConfig);
        network.service("networkCommon", commonService);
        return network;
    });
