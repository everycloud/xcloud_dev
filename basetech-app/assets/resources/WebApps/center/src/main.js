/**
 * 工程的module加载配置文件
 * module的基础路径为"工程名/"
 */
"use strict";
require.config({
    "baseUrl": "../",
    "map": {
        "*": {
            "jquery": "tiny-lib/jquery"
        }
    },
    "paths": {
        "can": "lib/can",
        "app": "src/app",
        "ui-router": "lib/angular-ui/ui-router",
        "tiny-lib": "lib/tiny/tiny-lib",
        "tiny-widgets": "lib/tiny/tiny-widgets",
        "tiny-directives": "lib/tiny/tiny-directives",
        "tiny-common": "lib/tiny/tiny-common",
        "bootstrap": "lib/bootstrap2.3.2/js",
        "bootstrapui": "lib/angular-ui/bootstrap",
        "jre": "lib/jre",
        "upload": "lib/upload",
        "sprintf": "lib/sprintf/sprintf.min",
        "mxGraph": "lib/mxgraph/javascript/src/js/mxClient",
        "language": "i18n/" + window.urlParams.lang
    },
    "shim": {
        "mxGraph": {
            "exports": "mxClient"
        },
        "sprintf": {
            "exports": "sprintfjs"
        },
        "tiny-lib/jquery": {
            "exports": "$"
        },
        "jre/deployJava": {
            "exports": "deployJava"
        },
        "upload": {
            "deps": ["tiny-lib/jquery"]
        },
        "bootstrapui/ui-bootstrap-tpls": {
            "deps": ["tiny-lib/angular"]
        },
        "tiny-lib/raphael": {
            "exports": "Raphael",
            "deps": ["tiny-lib/jquery"]
        },
        "bootstrap/bootstrap.min": {
            "exports": "bootstrap",
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/angular": {
            "deps": ["tiny-lib/jquery"],
            "exports": "angular"
        },
        "tiny-lib/angular-sanitize.min": {
            "deps": ["tiny-lib/angular"],
            "exports": "ngSanitize"
        },
        "tiny-lib/underscore": {
            "exports": "_"
        },
        "tiny-lib/jquery-ui.custom": {
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/jquery-ui.custom.min": {
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/jquery.ztree.all": {
            "deps": ["tiny-lib/jquery"],
            "exports": "zTreeAll"
        },
        "tiny-lib/jquery.ztree.exhide": {
            "deps": ["tiny-lib/jquery", "tiny-lib/jquery.ztree.all"],
            "exports": "zTreeExhide"
        },
        "tiny-lib/jquery.dataTables": {
            deps: ["tiny-lib/jquery"]
        },
        "tiny-lib/jqPlot": {
            "deps": ["tiny-lib/jquery", "tiny-lib/angular", "tiny-widgets/Tip", "tiny-lib/excanvas.compiled"]
        },
        "tiny-lib/jquery.ui.dialog": {
            "deps": ["tiny-lib/jquery", "tiny-lib/jquery-ui.custom.min"]
        },
        "tiny-lib/jquery.dialogextend": {
            "deps": ["tiny-lib/jquery", "tiny-lib/jquery-ui.custom.min"]
        },
        "tiny-lib/jquery.slider": {
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/jquery-ui-datepicker": {
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/ColReorderWithResize": {
            deps: ["tiny-lib/jquery.dataTables"]
        },
        "tiny-lib/ColVis": {
            deps: ["tiny-lib/jquery.dataTables"]
        },
        "tiny-lib/jquery.caret": {
            "deps": ["tiny-lib/jquery"]
        },
        "ui-router/angular-ui-router": {
            "deps": ["tiny-lib/angular"]
        },
        "tiny-lib/jquery.tipsy": {
            "deps": ["tiny-lib/jquery"],
            "exports": "tipsy"
        },
        "tiny-lib/d3": {
            "exports": "d3"
        },
        "tiny-lib/jquery.flot": {
            "deps": ["tiny-lib/jquery"]
        },
        "tiny-lib/jquery.flot.symbol": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.dashes": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.crosshair": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.time": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.spline": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.threshold.multiple": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.stack": {
            deps: ["tiny-lib/jquery.flot"]
        },
        "tiny-lib/jquery.flot.pie": {
            deps: ["tiny-lib/jquery.flot"]
        }
    },
    priority: [
        "angular"
    ]
});
/**
 * 主启动类，手动给html element绑定module
 */
require(['tiny-lib/jquery',
    'tiny-lib/angular',
    "app/framework/framework",
    "app/services/userService",
    "app/services/mainService",
    "app/services/capacityService",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "language/keyID",
    "language/manage-i18n",
    "sprintf",
    "tiny-lib/underscore",
    "tiny-widgets/Window"], function ($, angular, app, userService, MainService, capacityService, httpService, exceptionService, messageService, i18n, i18nExt, sprintf, _, Window) {
    window.mxLoadResources = false;
    window.mxLoadStylesheets = false;
    window.IMAGE_PATH = "app/business/multiPool/controllers/appTemplate/designer/images";
    window.STYLE_PATH = "app/business/multiPool/controllers/appTemplate/designer/styles";
    var $q = angular.injector(["ng"]).get("$q");
    var camel = new httpService();
    var exception = new exceptionService();

    //查询用户信息
    var userServiceInstance = new userService(exception, $q, camel);
    var promise = userServiceInstance.queryCurrentUser("all");
    var rootScope;
    var deployMode;
    promise.then(function (resolvedValue) {
        if (!resolvedValue) {
            return null;
        }
        var deferred = $q.defer();
        var tmpPromise = deferred.promise;
        var licensePromise = userServiceInstance.checkLicense(resolvedValue.id, resolvedValue.tokenId);
        licensePromise.then(function (data) {
            if (!data || data.licenseInvalidateNormal) {
                return deferred.resolve();
            }
            if (!data.licenseInvalidateNormal) {
                deferred.reject();
                //弹出对话框
                new Window({
                    "winId": "licenseExpiredWindow",
                    "title": i18n.sys_term_licenseManage_label || "License管理",
                    "minimizable": false,
                    "maximizable": false,
                    "content-type": "url",
                    "params": $.extend({i18n: i18n}, data, resolvedValue),
                    "content": "../src/app/framework/views/license.html",
                    "height": 360,
                    "width": 580,
                    "buttons": null,
                    "close": function (e) {
                        location.href = location.protocol + "//" + location.hostname + "/SSOSvr/logout";
                    }
                }).show();
            }
        });
        tmpPromise.then(function () {
            var deployPromise = userServiceInstance.queryDeployMode(resolvedValue.id, resolvedValue.tokenId);
            deployPromise.then(function (data) {
                if (data && data.deployMode) {
                    deployMode = data.deployMode;
                }
                return data;
            });

            //查询权限参数
            deployPromise.then(function () {
                if (resolvedValue) {
                    var privilegePromise = userServiceInstance.queryPrivilegeListByVdcId(resolvedValue.id, resolvedValue.loginVdcId, resolvedValue.tokenId);
                    privilegePromise.then(function (data) {
                        if (!data || !data.privilegeList) {
                            return;
                        }
                        var injector = angular.bootstrap($("html"), [app.name]);
                        rootScope = injector.get("$rootScope");
                        for (var k in i18nExt) {
                            i18n[k] = i18nExt[k];
                        }
                        rootScope.i18n = i18n;
                        rootScope.i18n.sprintf = sprintf.sprintf;
                        rootScope.i18n.locale = window.urlParams.lang;
                        rootScope.i18n.split = function (key) {
                            try {
                                return key.split(/\r\n|\n|\<\s*\w+\s*\/\>/g);
                            } catch (e) {
                            }
                            ;
                            return [];
                        }

                        rootScope.user = {
                            "name": resolvedValue.name,
                            "id": resolvedValue.id,
                            "orgId": resolvedValue.loginVdcId,
                            "orgName": resolvedValue.loginVdcName,
                            "orglist": resolvedValue.vdclist,
                            "vdcId": resolvedValue.loginVdcId,
                            "vdcName": resolvedValue.loginVdcName,
                            "vdclist": resolvedValue.vdclist,
                            "tokenId": resolvedValue.tokenId,
                            "cloudType": resolvedValue.cloudType.toUpperCase(),
                            "privilegeList": data.privilegeList,
                            "privilege": userServiceInstance.userRights(data.privilegeList)
                        };

                        //根据权限，部署场景动态生成菜单
                        rootScope.plugins = rootScope.getPlugins(resolvedValue.cloudType, deployMode, data.privilegeList);

                        //根据权限，部署场景左侧菜单动态生成方法
                        rootScope.getLeftTree = function (leftTree) {
                            return rootScope.getPlugins(resolvedValue.cloudType, deployMode, data.privilegeList, leftTree);
                        }

                        var mainService = new MainService(exception, $q, camel);
                        if (false) {
                            rootScope.$on("$stateChangeSuccess", function (evt, to) {
                                var toState = to.name;
                                if (!mainService.isCompetenceState(rootScope.plugins, toState)) {
                                    evt.preventDefault();
                                    rootScope.$state.go("home");
                                }
                            });
                        }

                        mainService.vdiMenuAction({
                            userId: resolvedValue.id,
                            scope: rootScope
                        });

                        rootScope.isServiceCenter = deployMode === "serviceCenter";
                        // 设置部署模式--兼容serviceCenter
                        rootScope.deployMode = rootScope.isServiceCenter ? "top" : deployMode;
                        //设置title
                        if (rootScope.isServiceCenter) {
                            rootScope.pageTitle = "ServiceCenter";
                        }
                        else if (rootScope.user && rootScope.user.cloudType === "FUSIONSPHERE") {
                            rootScope.pageTitle = "FusionSphere";
                        }
                        else {
                            rootScope.pageTitle = "FusionSphere openstack";
                        }
                    });
                }
            });

        });
    });
})