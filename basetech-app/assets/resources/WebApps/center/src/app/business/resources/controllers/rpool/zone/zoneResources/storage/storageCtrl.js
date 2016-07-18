define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'app/business/resources/controllers/constants',
    'fixtures/zoneFixture'],
    function (angular, Tabs, constants) {
        "use strict";

        var storageCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [{
                "openState": "resources.zoneResources.storage.mainStorage",
                "name": $scope.i18n.resource_term_mainStor_label
            },{
                "openState": "resources.zoneResources.storage.secondaryStorage",
                "name": $scope.i18n.common_term_secondStor_label
            },{
                "openState": "resources.zoneResources.storage.disasterRecovery", // Disaster Recovery Storage Group
                "name": $scope.i18n.resource_term_disasterStorGroup_label
            }];
        }];

        return storageCtrl;
    });