/**
 * 工程的module加载配置文件
 * module的基础路径为"工程名/"
 */
"use strict";
require.config({
    "baseUrl": "/resources/hw",
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
        "mxGraph": "lib/mxgraph/javascript/debug/js/mxClient",
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
    "tiny-lib/underscore",
], function (sprintf, $, angular, app, _) {
	
	console.log("enter--------------");
	
    window.mxLoadResources = false;
    window.mxLoadStylesheets = false;
    window.IMAGE_PATH = "../resources/hw/src/app/business/application/controllers/designer/images";
    window.STYLE_PATH = "../resources/hw/src/app/business/application/controllers/designer/styles";
    
    var injector = angular.bootstrap($("html"), [app.name]);
   
});
