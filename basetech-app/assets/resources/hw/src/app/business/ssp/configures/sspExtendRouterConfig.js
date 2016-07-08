/**
 * 定义 二次开发的 路由地址
 * 注意:
 * 1. 该文件不能删除;
 * 2. 在serviceConfigs中增加路由，不用删除其他内容
 */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "ui-router/angular-ui-router"
], function ($, angular, router) {
    "use strict";

    // 定义框架的路由配置module
    var extendSspConfigs = [
        "$stateProvider", "$urlRouterProvider", "$controllerProvider",
        function ($stateProvider, $urlRouterProvider, $controllerProvider) {
            // 在此增加路由配置

        }
    ];

    var extendConfigModule = angular.module("ssp.extendConfig", ["ui.router"]);
    extendConfigModule.config(extendSspConfigs);
    return extendConfigModule;
});
