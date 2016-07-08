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
        "app/services/cookieService",
        "app/services/exceptionService",
        "app/services/messageService",
        "app/services/mask",
        "app/services/helpService",
        "app/services/tipMessageService",
        "app/services/dependsService",
        "app/framework/controllers/serviceCtrl",
        "app/framework/controllers/serviceMenusCtrl",
        "app/framework/configures/frameworkRouterConfig",
        "app/business/tenantHome/configures/homeRouterConfig",
        "app/business/monitor/configures/monitorRouterConfig",
        "app/business/network/configures/networkRouterConfig",
        "app/business/ecs/configures/ecsRouterConfig",
        "app/business/ssp/configures/sspRouterConfig",
        "app/business/ssp/configures/sspExtendRouterConfig",
        "app/business/tenantUser/configures/tenantUserRouterConfig",
        "app/business/application/configures/applicationRouterConfig"
    ],
    function (angular, ngSanitize, wcc, router, uibootstrap, plugins, http, storage, exception, message, mask, help, tipMessage, depsProvider, serviceCtrl, serviceMenusCtrl, frameworkConfig, homeConfig, monitorConfig, networkConfig, ecsConfig, sspConfig, sspExtendConfig, tenantUserConfig, appConfig) {
        "use strict";

        //注入框架的配置文件
        var dependency = [
            "ng",
            "ngSanitize",
            "wcc",
            "ui.router",
            "ui.bootstrap",
            frameworkConfig.name,

            //插件化配置各服务的路由配置
            homeConfig.name,
            monitorConfig.name,
            networkConfig.name,
            ecsConfig.name,
            sspConfig.name,
            sspExtendConfig.name,
            tenantUserConfig.name,
            appConfig.name
        ];

        var framework = angular.module("framework", dependency);

        framework.controller("serviceCtrl", serviceCtrl);
        framework.controller("serviceMenusCtrl", serviceMenusCtrl);

        framework.service("servicesPlugin", plugins);
        framework.service("camel", http);
        framework.service("storage", storage);
        framework.service("mask", mask);
        framework.service("help", help);
        framework.service("tipMessage", tipMessage);
        framework.service("exception", exception);
        framework.service("message", message);
        framework.provider("deps", depsProvider);

        return framework;
    });
