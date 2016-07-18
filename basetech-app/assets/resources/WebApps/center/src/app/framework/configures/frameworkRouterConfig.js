/**
 * 定义的整体框架的 路由地址
 */
define(["tiny-lib/angular",
    "ui-router/angular-ui-router",
    "app/framework/directive/directiveFM",
    "app/business/portlet/controllers/firstPageCtrl",
    "app/business/portlet/controllers/servicePageCtrl",
    "app/business/portlet/controllers/resourcePageCtrl",
    "app/business/portlet/controllers/ictResourcePageCtrl"],
    function (angular, router, fm, firstPageCtrl,servicePageCtrl,resourcePageCtrl,ictResourcePageCtrl) {
    "use strict";

    var serviceConfigs = ["$stateProvider", "$controllerProvider","$urlRouterProvider", function ($stateProvider, $controllerProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        $stateProvider.state("home", {
            url: "/home",
            templateUrl: "app/business/portlet/views/firstPage.html",
            controller: "firstPage.ctrl"
        });

        $stateProvider.state("home.service", {
            url: "/service",
            templateUrl: "app/business/portlet/views/servicePage.html",
            controller: "servicePage.ctrl"
        });
        $stateProvider.state("home.resource", {
            url: "/resource",
            templateUrl: "app/business/portlet/views/resourcePage.html",
            controller: "resourcePage.ctrl"
        });
        $stateProvider.state("home.ictResource", {
            url: "/ictResource",
            templateUrl: "app/business/portlet/views/ictResourcePage.html",
            controller: "ictResourcePage.ctrl"
        });
    }];

    var dependency=[
        "ui.router",
        fm.name,
        firstPageCtrl.name,
        servicePageCtrl.name,
        resourcePageCtrl.name,
        ictResourcePageCtrl.name
    ]
    var frameworkConfig = angular.module("frm", dependency);
    frameworkConfig.config(serviceConfigs);
    return frameworkConfig;
});