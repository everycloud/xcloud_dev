/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService"],
    function ($, angular, http) {
        "use strict";
        var switchVdcCtrl = ["$scope", "camel", function ($scope, camel) {
            var switchVdcWindowWidget = $("#switchVdcWindowId").widget();
            var params = switchVdcWindowWidget.option("params");
            $scope.vdcList = params.vdcList || [];
            /*jshint -W030 */
            $scope.switchVdcById = function (vdcId) {
                params.switchVdcById && params.switchVdcById(vdcId);
                switchVdcWindowWidget && switchVdcWindowWidget.destroy && switchVdcWindowWidget.destroy();
            };
            $scope.description = "点击切换到相应的VDC";
        }];

        var dependency = ["ng", "wcc"];
        var app = angular.module("switchVdcCtrl", dependency);
        app.controller("switchVdcCtrl", switchVdcCtrl);
        app.service("camel", http);
        return app;
    });