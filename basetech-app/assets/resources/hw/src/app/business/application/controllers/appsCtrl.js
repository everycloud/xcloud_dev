define(["tiny-lib/angular"
], function (angular) {
    "use strict";

    var appMgrCtrl = ["$scope","$state", function ($scope,$state) {

    }];

    var dependency = [];
    /**
     * 定义application moddule， 这里需要设置命令空间，防止重复
     * @type {module}
     */
    var appMgrModule = angular.module("apps", dependency);

    appMgrModule.controller("apps.ctrl", appMgrCtrl);
    return appMgrModule;
});
