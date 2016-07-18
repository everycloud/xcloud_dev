define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, Tabs, constants) {
        "use strict";

        var summaryCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.plugins = [
                {
                    "openState": "resources.zoneResources.summary.zoneSummary",
                    "name": $scope.i18n.common_term_overview_label,
                    "show":true
                },
                {
                    "openState": "resources.zoneResources.summary.host",
                    "name": $scope.i18n.device_term_servers_label,
                    "show":$scope.right.hasDeviceViewRight
                },
                {
                    "openState": "resources.zoneResources.summary.switch",
                    "name": $scope.i18n.device_term_switchs_label,
                    "show":$scope.right.hasDeviceViewRight
                },
                {
                    "openState": "resources.zoneResources.summary.san",
                    "name": $scope.i18n.common_term_storageDevice_label,
                    "show":$scope.right.hasDeviceViewRight
                }
            ];

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };
        }];

        return summaryCtrl;
    });
