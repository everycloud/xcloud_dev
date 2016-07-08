/**
 * 定义的app service 路由地址
 * 这里只能做成声明，不能定义成一个module，原因是存在config继承的问题
 * Created on 14-1-23.
 */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/application/services/appCommonData",
        "app/business/application/services/appUtilService",
        "tiny-directives/Lineplot",
        "tiny-directives/Pagination",
        "tiny-directives/FormField",
        'tiny-directives/FileUpload',
        "tiny-directives/Textbox",
        "tiny-directives/FilterSelect",
        "tiny-directives/Radio"
    ],
    function ($, angular, router, appCommonData, appUtilService) {
        "use strict";
        var config = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
                $urlRouterProvider.when("/app", "/app/manager");
                $urlRouterProvider.when("/app/", "/app/manager");
                $urlRouterProvider.when("/app/manager", "/app/manager/overview");
                $urlRouterProvider.when("/app/manager/", "/app/manager/overview");
                $urlRouterProvider.when("/app/navigate", "/app/navigate/monitor");
                $urlRouterProvider.when("/app/navigate/", "/app/navigate/monitor");
                $urlRouterProvider.when("/app/navigate/monitor", ['$state', '$stateParams',
                    function ($state, $stateParams) {
                        $state.go("application.navigate.monitor.res", {
                            "appId": $stateParams.appId,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "vpcId": $stateParams.vpcId
                        });
                    }
                ]);
                $urlRouterProvider.when("/app/navigate/monitor/", "/app/navigate/monitor/res");
                $stateProvider.state("application", {
                    url: "/app",
                    templateUrl: "app/business/application/views/application.html"
                });

                $stateProvider.state("application.design", {
                    url: "/design?templateId&mode",
                    templateUrl: "app/business/application/views/template/designer/layout/layout.html",
                    controller: "app.designer.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/template/designer/layout/layoutCtrl"];
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

                $stateProvider.state("application.manager", {
                    url: "/manager",
                    templateUrl: "app/framework/views/left.html",
                    controller: "app.manager.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/manager/appMgrCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.importTemplate", {
                    url: "/importTemplate",
                    templateUrl: "app/business/application/views/template/import/importTemplate.html",
                    controller: "app.importTemplate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/template/import/importTemplateCtrl"];
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

                // 资源/模板与规格/软件包/添加/导航
                $stateProvider.state("application.importTemplate.navigation", {
                    url: "/navigation?from",
                    views: {
                        "baseInfo": {
                            //相对于根路径
                            templateUrl: "app/business/application/views/template/import/baseInfo.html",
                            controller: "app.importTemplate.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/template/import/baseInfoCtrl' //相对于basePath
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
                            templateUrl: "app/business/application/views/template/import/confirm.html",
                            controller: "app.importTemplate.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/template/import/confirmCtrl' //相对于basePath
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
                        }
                    }
                });

                $stateProvider.state("application.manager.overview", {
                    url: "/overview",
                    templateUrl: "app/business/application/views/overview/overview.html",
                    controller: "app.manager.overview.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/overview/overview"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.overview.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.createAppHome", {
                    url: "/createApp?templateId",
                    templateUrl: "app/business/application/views/appInstance/createAppHome.html",
                    controller: "application.createApp.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope, $state) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/createAppCtrlHome"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("application.createApp.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("appCreateByCustom", {
                    "url": "/createAppByCustom",
                    templateUrl: "app/business/application/views/appInstance/createByCustom/createByCustom.html",
                    controller: "app.createByCustom.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appInstance/createByCustom/createByCustom' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.createByCustom.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("appCreateByCustom.navigate", {
                    url: "/navigate?appId&fromFlag&cloudInfraId&selVpcId",
                    views: {
                        "baseInfo": {
                            templateUrl: "app/business/application/views/appInstance/createByCustom/basicInfo.html",
                            controller: "app.createByCustom.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByCustom/basicInfo' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByCustom.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "associateVM": {
                            templateUrl: "app/business/application/views/appInstance/createByCustom/associateVM.html",
                            controller: "app.createByCustom.associateVM.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByCustom/associateVM' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByCustom.associateVM.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/application/views/appInstance/createByCustom/confirm.html",
                            controller: "app.createByCustom.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByCustom/confirm' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByCustom.confirm.ctrl", ctrl);
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
                $stateProvider.state("appCreateByTemplate", {
                    url: "/createAppByTemplate",
                    templateUrl: "app/business/application/views/appInstance/create/createByTemplate.html",
                    controller: "app.createByTemplate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appInstance/create/createByTemplate'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.createByTemplate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("appCreateByTemplate.navigate", {
                    url: "/navigate?templateId&fromFlag",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appInstance/create/chooseTemplate',
                                'app/business/application/controllers/appInstance/create/basicInfo',
                                'app/business/application/controllers/appInstance/create/chooseNetwork',
                                'app/business/application/controllers/appInstance/create/configApp',
                                'app/business/application/controllers/appInstance/create/configVlb',
                                'app/business/application/controllers/appInstance/create/confirmByTemplate'
                            ];
                            require(dependencies, function (chooseTemplate, basicInfo, chooseNetwork, configApp, configVlb, confirmByTemplate) {
                                $controllerProvider.register("app.createByTemplate.chooseTemplate.ctrl", chooseTemplate);
                                $controllerProvider.register("app.createByTemplate.baseInfo.ctrl", basicInfo);
                                $controllerProvider.register("app.createByTemplate.chooseNet.ctrl", chooseNetwork);
                                $controllerProvider.register("app.createByTemplate.configApp.ctrl", configApp);
                                $controllerProvider.register("app.createByTemplate.configVlb.ctrl", configVlb);
                                $controllerProvider.register("app.createByTemplate.confirm.ctrl", confirmByTemplate);
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }
                    },
                    views: {
                        "chooseTemplate": {
                            templateUrl: "app/business/application/views/appInstance/create/chooseTemplate.html",
                            controller: "app.createByTemplate.chooseTemplate.ctrl"
                        },
                        "baseInfo": {
                            templateUrl: "app/business/application/views/appInstance/create/basicInfo.html",
                            controller: "app.createByTemplate.baseInfo.ctrl"
                        },
                        "chooseNet": {
                            templateUrl: "app/business/application/views/appInstance/create/chooseNetwork.html",
                            controller: "app.createByTemplate.chooseNet.ctrl"
                        },
                        "configApp": {
                            templateUrl: "app/business/application/views/appInstance/create/configApp.html",
                            controller: "app.createByTemplate.configApp.ctrl"
                        },
                        "configVlb": {
                            templateUrl: "app/business/application/views/appInstance/create/configVlb.html",
                            controller: "app.createByTemplate.configVlb.ctrl"
                        },
                        "confirm": {
                            templateUrl: "app/business/application/views/appInstance/create/confirmByTemplate.html",
                            controller: "app.createByTemplate.confirm.ctrl"
                        }
                    }
                });

                /**
                 * ICT场景根据openstack应用模板创建应用
                 */
                $stateProvider.state("createByOpenstack", {
                    url: "/createByOpenstack",
                    templateUrl: "app/business/application/views/appInstance/createByOpenstack/createByTemplate.html",
                    controller: "app.createByOpenstack.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/appInstance/createByOpenstack/createByTemplate'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.createByOpenstack.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("createByOpenstack.navigate", {
                    url: "/navigate?templateId&fromFlag&appId&cloudInfraId&vpcId",
                    views: {
                        "chooseTemplate": {
                            templateUrl: "app/business/application/views/appInstance/createByOpenstack/chooseTemplate.html",
                            controller: "app.createByOpenstack.chooseTemplate.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByOpenstack/chooseTemplate' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByOpenstack.chooseTemplate.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "baseInfo": {
                            templateUrl: "app/business/application/views/appInstance/createByOpenstack/basicInfo.html",
                            controller: "app.createByOpenstack.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByOpenstack/basicInfo' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByOpenstack.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "configParameter": {
                            templateUrl: "app/business/application/views/appInstance/createByOpenstack/configParameter.html",
                            controller: "app.createByOpenstack.chooseNet.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByOpenstack/configParameter' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByOpenstack.chooseNet.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/application/views/appInstance/createByOpenstack/confirm.html",
                            controller: "app.createByOpenstack.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/appInstance/createByOpenstack/confirm' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("app.createByOpenstack.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                $stateProvider.state("application.manager.instance", {
                    url: "/instance?cloudInfraId&vpcId&condition",
                    templateUrl: "app/business/application/views/manager/appInstanceManager.html",
                    controller: "app.manager.instance.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/manager/appInstanceManageCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.instance.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.manager.template", {
                    url: "/template",
                    templateUrl: "app/business/application/views/template/templateList.html",
                    controller: "app.manager.template.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var defered = $q.defer();
                            var dependencies = ["app/business/application/controllers/template/templateListCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.template.ctrl", ctrl);
                                    defered.resolve();
                                });
                            });
                            return defered.promise;
                        }
                    }
                });

                $stateProvider.state("application.navigate", {
                    url: "/navigate?cloudInfraId&vpcId&appId&canViewTopo&appName",
                    templateUrl: "app/business/application/views/appInstance/navigate.html",
                    controller: "app.navigate.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/navigateCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.navigate.monitor", {
                    url: "/monitor",
                    templateUrl: "app/business/application/views/appInstance/monitorMgr.html",
                    controller: "app.navigate.monitor.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/monitorMgrCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.monitor.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.navigate.monitor.res", {
                    url: "/res",
                    templateUrl: "app/business/application/views/appInstance/monitor.html",
                    controller: "app.navigate.monitor.res.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/monitorCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.monitor.res.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.navigate.monitor.process", {
                    url: "/res",
                    templateUrl: "app/business/application/views/appInstance/monitorProcess.html",
                    controller: "app.navigate.monitor.process.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/monitorProcessCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.monitor.process.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                $stateProvider.state("application.navigate.monitor.service", {
                    url: "/res",
                    templateUrl: "app/business/application/views/appInstance/monitorService.html",
                    controller: "app.navigate.monitor.service.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/monitorServiceCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.monitor.service.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });

                //日志
                $stateProvider.state("application.navigate.log", {
                    url: "/log",
                    templateUrl: "app/business/application/views/appInstance/instanceLog.html",
                    controller: "app.navigate.log.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/instanceLogCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.log.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                //拓扑
                $stateProvider.state("application.navigate.topo", {
                    url: "/topo",
                    templateUrl: "app/business/application/views/appInstance/instanceTopo.html",
                    controller: "app.navigate.topo.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/appInstance/instanceTopoCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.navigate.topo.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                $urlRouterProvider.when("/app/manager/policy", "/app/manager/policy/plan");
                $urlRouterProvider.when("/app/manager/policy/", "/app/manager/policy/plan");

                //策略配置
                $stateProvider.state("application.manager.policy", {
                    url: "/policy",
                    templateUrl: "app/business/application/views/policy/policySetting.html",
                    controller: "app.manager.policy.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/policy/policySettingCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.policy.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                //计划任务
                $stateProvider.state("application.manager.policy.plan", {
                    url: "/plan",
                    templateUrl: "app/business/application/views/policy/planSetting.html",
                    controller: "app.manager.policy.plan.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/policy/planSettingCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.policy.plan.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });

                            return deferred.promise;
                        }
                    }
                });

                //创建计划任务
                $stateProvider.state("application.createPlan", {
                    url: "/createPlan?action&cloudInfraId&id",
                    //相对于根路径
                    templateUrl: "app/business/application/views/policy/create/createPlan.html",
                    controller: "application.createPlan.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/application/controllers/policy/create/createPlanCtrl' //相对于basePath
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("application.createPlan.ctrl", ctrl);
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }
                    }
                });


                $stateProvider.state("application.createPlan.navigate", {
                    url: "/navigate",
                    views: {
                        "basic": {
                            templateUrl: "app/business/application/views/policy/create/basic.html",
                            controller: "application.createPlan.baseInfo.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/policy/create/basicCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("application.createPlan.baseInfo.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "innerPolicy": {
                            templateUrl: "app/business/application/views/policy/create/innerPolicy.html",
                            controller: "application.createPlan.innerPolicy.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/policy/create/innerPolicyCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("application.createPlan.innerPolicy.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        },
                        "confirm": {
                            templateUrl: "app/business/application/views/policy/create/confirm.html",
                            controller: "application.createPlan.confirm.ctrl",
                            resolve: {
                                deps: function ($q, $rootScope) {
                                    var deferred = $q.defer();
                                    var dependencies = [
                                        'app/business/application/controllers/policy/create/confirmCtrl' //相对于basePath
                                    ];
                                    require(dependencies, function (ctrl) {
                                        $rootScope.$apply(function () {
                                            $controllerProvider.register("application.createPlan.confirm.ctrl", ctrl);
                                            deferred.resolve();
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }
                    }
                });

                //策略日志
                $stateProvider.state("application.manager.policy.log", {
                    url: "/log",
                    templateUrl: "app/business/application/views/policy/logSetting.html",
                    controller: "app.manager.policy.log.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = ["app/business/application/controllers/policy/logSettingCtrl"];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("app.manager.policy.log.ctrl", ctrl);
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
        var application = angular.module("application.config", dependency);
        application.config(config);
        application.service("appCommonData", appCommonData);
        application.service("appUtilService", appUtilService);
        return application;
    });
