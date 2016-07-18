/**
 * 工程的module加载配置文件
 * module的基础路径为"工程名/"
 */
"use strict";
require.config({
    "baseUrl": "../",
    "waitSeconds": 15,
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
require([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "app/framework/framework",
    "app/services/userService",
    "app/services/capacityService",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/confService",
    "tiny-lib/underscore",
    "language/keyID"
], function (sprintf, $, angular, app, userService, capacityService, httpService, exceptionService, messageService, displayConf, _, keyIDI18n) {
    window.mxLoadResources = false;
    window.mxLoadStylesheets = false;
    window.IMAGE_PATH = "app/business/application/controllers/template/designer/images";
    window.STYLE_PATH = "app/business/application/controllers/template/designer/styles";
    var $q = angular.injector(["ng"]).get("$q");
    var camel = new httpService();
    var exception = new exceptionService();
    var message = new messageService();

    //查询用户信息
    var userServiceInstance = new userService(exception, $q, camel);
    var promise = userServiceInstance.queryCurrentUser("tenant");
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
                message.failMsgBox("License失效, 请联系系统管理员导入License.", "warn", function () {
                    location.href = location.protocol + "//" + location.hostname + "/SSOSvr/logout";
                });
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
                //请求成功, 查询权限
                var privilegePromise = userServiceInstance.queryPrivilegeListByVdcId(resolvedValue.id, resolvedValue.loginVdcId, resolvedValue.tokenId);
                privilegePromise.then(function (data) {
                    if (!data || !data.privilegeList) {
                        return;
                    }
                    var injector = angular.bootstrap($("html"), [app.name]);
                    var state = injector.get("$state");
                    rootScope = injector.get("$rootScope");
                    rootScope.urlParams = {
                        "lang": window.urlParams.lang
                    };
                    keyIDI18n.sprintf = sprintf.sprintf;
                    rootScope.i18n = keyIDI18n;
                    var cloudType = (resolvedValue.cloudType === "OPENSTACK" ? "ICT" : "IT");
                    var vdcName = resolvedValue.loginVdcName ? resolvedValue.loginVdcName : "";
                    rootScope.user = {
                        "name": resolvedValue.name,
                        "id": resolvedValue.id,
                        "orgId": resolvedValue.loginVdcId,
                        "orgName": vdcName,
                        "orglist": resolvedValue.vdclist,
                        "vdcId": resolvedValue.loginVdcId,
                        "vdcName": vdcName,
                        "vdclist": resolvedValue.vdclist,
                        "tokenId": resolvedValue.tokenId,
                        "cloudType": cloudType,
                        "privilegeList": data.privilegeList,
                        "privilege": userServiceInstance.userRights(data.privilegeList)
                    };
                    //根据权限，部署场景动态生成菜单
                    rootScope.plugins = rootScope.plugins(resolvedValue.cloudType, deployMode, rootScope.user);
                    //根据权限，部署场景左侧菜单动态生成方法
                    rootScope.getLeftTree = function (leftTree) {
                        return rootScope.getPlugins(resolvedValue.cloudType, deployMode, data.privilegeList, leftTree);
                    }
                    // 设置部署模式
                    rootScope.deployMode = deployMode;
                    rootScope.isIt = rootScope.user && rootScope.user.cloudType === "IT";
                    rootScope.isIct = rootScope.user && rootScope.user.cloudType === "ICT";
                    //设置界面显隐的服务
                    rootScope.displayConf = new displayConf();

                    // SC自助申请VDC时，没有首页菜单，直接跳到服务页面
                    if (resolvedValue.loginVdcId === "-1") {
                        state.go("ssp.catalog");
                    }
                    //设置title
                    if (deployMode === "serviceCenter") {
                        rootScope.pageTitle = "ServiceCenter";
                        rootScope.isServiceCenter = true;
                    }
                    else if (rootScope.isIt) {
                        rootScope.pageTitle = "FusionSphere";
                    }
                    else {
                        rootScope.pageTitle = "FusionSphere openstack";
                    }
                });

                //查询资源池差异化参数
                privilegePromise.then(function (data) {
                    var user = rootScope.user;
                    var capacityServiceInstance = new capacityService($q, camel);
                    var capPromise = capacityServiceInstance.queryCloudInfraCapacities(user.vdcId, user.id, resolvedValue.tokenId);
                    capPromise.then(function (resoledValue) {
                        if (resoledValue) {
                            rootScope.capacities = resoledValue.cloudInfras;
                        }
                    });
                });
            });
        });
    });
});
