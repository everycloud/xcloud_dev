/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-19

 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Tabs',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/business/resources/controllers/constants',
    'app/services/validatorService'],
    function ($, angular, Tabs, UnifyValid, httpService, constants, validatorService) {
        "use strict";
        var detailCtrl = ["$scope", 'camel', 'validator', function ($scope, camel, validator) {
            $scope.i18n = $("html").scope().i18n;
            $scope.showTab = true;
            $scope.url = "app/business/resources/views/rpool/zone/zoneResources/network/publicIP/publicIpUsageDetail.html";
        }]

        var deps = ['ng', 'wcc'];
        var detailApp = angular.module("detailApp", deps);
        detailApp.controller("detailCtrl", detailCtrl);
        detailApp.service("camel", httpService);
        detailApp.service("validator", validatorService);
        return detailApp;
    }
)
;




