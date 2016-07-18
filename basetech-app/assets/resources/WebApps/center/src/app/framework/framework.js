/**
 * 主框架module， 该模块依赖于angularjs ng module和tiny wcc module
 * 所有的service router都在这里进行统一的配置
 */
define(["tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "tiny-directives/Directive",
    "ui-router/angular-ui-router",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/servicePlugins",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/mask",
    "app/services/helpService",
    "app/services/tipMessageService",
    "app/services/dependsService",
    "app/services/validatorService",
    "app/services/timeService",
    "app/framework/controllers/serviceCtrl",
    "app/framework/controllers/serviceMenusCtrl",
    "app/framework/configures/frameworkRouterConfig",
    "app/business/user/configures/userRouterConfig",
    "app/business/resources/configures/resourcesRouterConfig",
    "app/business/multiPool/configures/multiPoolRouterConfig",
    "app/business/service/configures/serviceRouterConfig",
    "app/business/service/configures/serviceExtendRouterConfig",
    "app/business/monitor/configures/monitorRouterConfig",
    "app/business/system/configures/systemRouterConfig",
    "app/business/vdc/configures/vdcRouterConfig",
    "app/business/vdi/configures/vdiRouterConfig",
    "tiny-lib/encoder",
    "tiny-lib/jquery.base64"
],
    function (angular, ngSanitize,wcc, router, uibootstrap, plugins, http, exception, message, mask, help, tipMessage, depsProvider, validator, timeService, serviceCtrl, serviceMenusCtrl, frameworkConfig, userConfig, resourcesConfig, multiPoolConfig, serviceRouterConfig, serviceExtendRouterConfig, monitoringRouterConfig, systemRouterConfig, vdcConfig, vdiConfig) {
        "use strict";
        //注入框架的配置文件
        var dependency = [
            "ng",
            "ngSanitize",
            "wcc",
            "ui.router",
            "ui.bootstrap",
            frameworkConfig.name,
            userConfig.name,
            resourcesConfig.name,
            multiPoolConfig.name,
            serviceRouterConfig.name,
            serviceExtendRouterConfig.name,
            monitoringRouterConfig.name,
            systemRouterConfig.name,
            vdcConfig.name,
            vdiConfig.name
            //插件化配置各服务的路由配置
        ];

        var framework = angular.module("framework", dependency);

        framework.controller("serviceCtrl", serviceCtrl);
        framework.controller("serviceMenusCtrl", serviceMenusCtrl);
        framework.service("servicesPlugin", plugins);
        framework.service("camel", http);
        framework.service("exception", exception);
        framework.service("message", message);
        framework.service("mask", mask);
        framework.service("help", help);
        framework.service("tipMessage", tipMessage);
        framework.service("validator", validator);
        framework.service("timeService", timeService);
        framework.provider("deps", depsProvider);
        return framework;
    });