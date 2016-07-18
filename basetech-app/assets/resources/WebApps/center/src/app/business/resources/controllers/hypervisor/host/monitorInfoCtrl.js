define(["tiny-lib/angular"], function (angular) {
    "use strict";

    var ctrl = ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
        var user = $("html").scope().user;
        var resourceId = $stateParams.hostId;

        $scope.plugins = [
            {
                "openState": "resources.hostDetail.monitor.server",
                "name": $scope.i18n.device_term_servers_label
            },
            {
                "openState": "resources.hostDetail.monitor.storageMonitor",
                "name": $scope.i18n.perform_term_storageTop_label
            }
        ];
        $scope.selectedTab = $scope.i18n.device_term_servers_label;
        $scope.setSelectedTabItem = function (name) {
            $scope.selectedTab = name;
        }
    }];
    return ctrl;
});
