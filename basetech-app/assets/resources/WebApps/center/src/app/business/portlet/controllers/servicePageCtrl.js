/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/portlet/controllers/notifyCtrl",
    "app/business/portlet/controllers/serviceHealthCtrl",
    "app/business/portlet/controllers/systemActivenessCtrl",
    "app/business/portlet/controllers/topoCtrl",
    "fixtures/userFixture"],
    function ($, angular, notifyCtrl, serviceHealthCtrl, systemActivenessCtrl, topoCtrl) {
        "use strict";
        var servicePageCtrl = ["$scope", "$compile", function ($scope, $compile) {
            $scope.url = {
                notifyUrl: "app/business/portlet/views/notify.html",
                healthUrl: "app/business/portlet/views/serviceHealth.html",
                systemActivenessUrl: "app/business/portlet/views/systemActiveness.html",
                topoUrl: "app/business/portlet/views/topo.html"
            };
        }];

        var dependency = [notifyCtrl.name, serviceHealthCtrl.name, topoCtrl.name];

        var servicePageModule = angular.module("servicePage", dependency);
        servicePageModule.controller("servicePage.ctrl", servicePageCtrl);
        servicePageModule.controller("servicePage.systemActiveness.ctrl", systemActivenessCtrl);
        return servicePageModule;
    });