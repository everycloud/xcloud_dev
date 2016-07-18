
define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, layout) {
    "use strict";

    var vdcMgrCtrl = ["$scope","$state", function ($scope,$state) {
        var user = $("html").scope().user;
        $scope.openstack = user.cloudType === "OPENSTACK";
    }];

    var dependency = [];
    /**
     * 定义vdc moddule， 这里需要设置命令空间，防止重复
     * @type {module}
     */
    var vdcMgrModule = angular.module("vdcMgr", dependency);

    vdcMgrModule.controller("vdcMgr.ctrl", vdcMgrCtrl);
    return vdcMgrModule;
});