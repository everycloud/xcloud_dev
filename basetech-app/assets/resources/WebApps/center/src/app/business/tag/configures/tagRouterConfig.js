define(["tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/tag/controllers/tagMainCtrl",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/FormField",
        "tiny-directives/Textbox",
        "tiny-directives/Step",
        "tiny-directives/Select",
        "tiny-directives/FilterSelect",
        "tiny-directives/Layout",
        'tiny-directives/Menubutton',
        'tiny-directives/FileUpload',
        "tiny-directives/Tabs",
        "tiny-directives/Slider",
        "tiny-directives/Spinner",
        "tiny-directives/IP",
        'tiny-directives/RadioGroup'
    ],
    function (angular, router, tagMainCtrl) {
        "use strict";

        //定义框架的路由配置module
        var serviceConfigs = ["$stateProvider", "$controllerProvider",
            function ($stateProvider, $controllerProvider) {
                $stateProvider.state("serviceMgr", {
                    url: "/service",
                    templateUrl: "app/business/tag/views/tagMain.html",
                    controller: "tag.ctrl"
                });
                //标签管理
                $stateProvider.state("serviceMgr.label", {
                    url: "/label",
                    templateUrl: "app/business/tag/views/label/label.html",
                    controller: "service.label.ctrl",
                    resolve: {
                        deps: function ($q, $rootScope) {
                            var deferred = $q.defer();
                            var dependencies = [
                                'app/business/tag/controllers/label/labelCtrl'
                            ];
                            require(dependencies, function (ctrl) {
                                $rootScope.$apply(function () {
                                    $controllerProvider.register("service.label.ctrl", ctrl);
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
            tagMainCtrl.name
        ];
        var tagConfig = angular.module("serviceMgr.config", dependency);
        tagConfig.config(serviceConfigs);
        return tagConfig;
    });
