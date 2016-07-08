define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        'app/services/httpService',
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http) {
        "use strict";
        var bindElasticIPCtrl = ["$scope",
            function ($scope) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                $scope.showBusiness = true;
                //是否为共享vpc，共享vpc不显示私有ip页面
                var param = $("#bindElasticIPWindowId").widget().option("params");
                $scope.vpcTypeShared = param.vpcTypeShared;
                $scope.url = "app/business/network/views/eip/bindElasticIP.html";
            }
        ];
        var bindElasticIPCtrlModule = angular.module("network.eip.bindElasticIP", ['framework','ngSanitize']);
        bindElasticIPCtrlModule.controller("network.eip.bindElasticIP.ctrl", bindElasticIPCtrl);
        bindElasticIPCtrlModule.service("camel", http);
        return bindElasticIPCtrlModule;
    }
);
