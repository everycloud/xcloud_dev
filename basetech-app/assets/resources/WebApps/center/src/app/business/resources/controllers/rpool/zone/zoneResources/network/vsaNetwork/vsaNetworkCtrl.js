define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, constants) {
        "use strict";

        var vsaNetworkCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [
                {
                    "openState": "resources.zoneResources.vsaNetwork.vsaManagerNetwork",
                    "name": $scope.i18n.resource_term_vsaNets_label
                },
                {
                    "openState": "resources.zoneResources.vsaNetwork.vtepNetwork",
                    "name": $scope.i18n.resource_term_vtepNet_label
                }
            ];
        }];

        return vsaNetworkCtrl;
    });