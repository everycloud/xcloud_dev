define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'fixtures/zoneFixture'],
    function (angular, Window) {
        "use strict";

        var virtualFirewallCtrl = ["$scope", "$stateParams", function ($scope, $stateParams) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.plugins = [
                {
                    "openState": "resources.zoneResources.virtualFirewall.hardwareFirewall",
                    "name": $scope.i18n.resource_term_hardFW_label
                },
                {
                    "openState": "resources.zoneResources.virtualFirewall.softwareFirewall",
                    "name": $scope.i18n.resource_term_softFW_label
                }
            ];

            $scope.config = function () {
                var options = {
                    "winId": "operateDnatWinId",
                    "zoneName": $scope.zoneInfo.zoneName,
                    "zoneID": $scope.zoneInfo.zoneID,
                    "title": $scope.i18n.resource_term_setPublicNetAccessVM_button,
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/zoneResources/network/virtualFirewall/config.html",
                    "height": 400,
                    "width": 720,
                    "minimizable": false,
                    "maximizable": false,
                    "buttons": null
                };
                new Window(options).show();
            };
        }];

        return virtualFirewallCtrl;
    });