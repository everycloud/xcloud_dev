define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, constants) {
        "use strict";

        var vlanPoolCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [
                {
                    "openState": "resources.zoneResources.vlanPool.vlan",
                    "name": $scope.i18n.resource_term_vlanPools_label
                },
                {
                    "openState": "resources.zoneResources.vlanPool.vxlan",
                    "name": $scope.i18n.resource_term_vxlanMulticastIP_label
                }
            ];
        }];

        return vlanPoolCtrl;
    });