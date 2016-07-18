/**
 * 外部网络
 */
define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, constants) {
        "use strict";

        var externalNetworkCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [
                {
                    "openState": "resources.zoneResources.externalNetwork.extNetwork",
                    "name": $scope.i18n.resource_term_externalNets_label
                },
                {
                    "openState": "resources.zoneResources.externalNetwork.dhcpServer",
                    "name": $scope.i18n.common_term_DHCPserver_label
                }
            ];
        }];

        return externalNetworkCtrl;
    });