/**
 * 主框架module， 该模块依赖于angularjs ng module和tiny wcc module
 * 所有的service router都在这里进行统一的配置
 */
define(["tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "tiny-directives/Directive",
        "ui-router/angular-ui-router",
        "bootstrapui/ui-bootstrap-tpls",
        "app/framework/configures/frameworkRouterConfig",
        "app/business/host/configures/hostRouterConfig",
    ],
    function (angular, ngSanitize, wcc, router, uibootstrap, frameworkConfig, hostConfig) {
        "use strict";
        console.log("enter in framework");
        //注入框架的配置文件
        var dependency = [
            "ng",
            "ngSanitize",
            "wcc",
            "ui.router",
            "ui.bootstrap",
            frameworkConfig.name,
            hostConfig.name
        ];
        
        console.log("frame enter--------------");

        var framework = angular.module("framework", dependency);

        return framework;
    });
