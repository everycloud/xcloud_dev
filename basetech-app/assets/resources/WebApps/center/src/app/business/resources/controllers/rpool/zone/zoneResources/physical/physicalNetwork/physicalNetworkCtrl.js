/**
 */
define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, Tabs, constants) {
        "use strict";

        var physicalNetworkCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };
        }];

        return physicalNetworkCtrl;
    });
