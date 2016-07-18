/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-3-20

 */
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'app/business/resources/controllers/device/constants',
    'fixtures/deviceFixture'
],
    function (angular, Window, constants, deviceFixture) {
        "use strict";
        var firewallDetailCtrl = ['$scope', '$compile', function ($scope, $compile) {
            $scope.i18n = $("html").scope().i18n;
        }];
        var dependency = ['ng', 'wcc'];
        var firewallDetailModule = angular.module("firewallDetailModule", dependency);
        firewallDetailModule.controller("firewallDetailCtrl", firewallDetailCtrl);
        return firewallDetailModule;
    });

