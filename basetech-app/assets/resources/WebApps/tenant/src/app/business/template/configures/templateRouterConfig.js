define([
        "tiny-lib/angular",
        "ui-router/angular-ui-router",
        "app/business/template/controllers/templateCtrl",
        "tiny-directives/Select",
        "tiny-directives/FilterSelect",
        "tiny-directives/DateTime",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "tiny-directives/CirqueChart"
    ],
    function (angular, router, templateCtrl) {
        "use strict";

        //定义框架的路由配置module
        var templateConfig = ["$stateProvider", "$urlRouterProvider", "$controllerProvider",
            function ($stateProvider, $urlRouterProvider, $controllerProvider) {
            }
        ];
        var dependency = ["ui.router", templateCtrl.name];
        var template = angular.module("template.config", dependency);
        template.config(templateConfig);
        return template;
    });
