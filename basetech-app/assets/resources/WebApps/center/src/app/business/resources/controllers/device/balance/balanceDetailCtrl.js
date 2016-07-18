
define(['tiny-lib/angular',
    'tiny-widgets/Window',
    'app/business/resources/controllers/device/constants',
    'fixtures/deviceFixture'
],
    function (angular, Window, constants, deviceFixture) {
        "use strict";
        var balanceDetailCtrl = ['$scope', '$compile', function ($scope, $compile) {
            $scope.i18n = $("html").scope().i18n;
        }];
        var dependency = ['ng', 'wcc'];
        var balanceDetailModule = angular.module("balanceDetailModule", dependency);
        balanceDetailModule.controller("balanceDetailCtrl", balanceDetailCtrl);
        return balanceDetailModule;
    });

