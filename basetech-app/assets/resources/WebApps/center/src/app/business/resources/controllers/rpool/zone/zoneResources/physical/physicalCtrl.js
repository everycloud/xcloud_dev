/**
 */
define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, Tabs, constants) {
        "use strict";

        var physicalCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {
            var i18n = $scope.i18n;

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [{
                "openState": "resources.zoneResources.physical.dedicatedServers",
                "name": i18n.server_term_server_label || "物理机"
            },{
                "openState": "resources.zoneResources.physical.physicalNetwork",
                "name": i18n.resource_term_physiNet_label || "物理网络"
            }];
        }];

        return physicalCtrl;
    });