/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "fixtures/network/router/routerFixture"
], function ($, angular, layout) {
    "use strict";

    var vpcManagerCtrl = ["$scope", "$state", "camel", "$rootScope", "$q", "networkCommon", "$stateParams", "exception",
        function ($scope, $state, camel, $rootScope, $q, networkCommon, $stateParams, exception) {
            $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
            $scope.vpcName = $stateParams.vpcName;
            if (!networkCommon.vpcId) {
                networkCommon.vpcId = $stateParams.vpcId;
            }
            if (!networkCommon.cloudInfraId) {
                networkCommon.cloudInfraId = $stateParams.cloud_infras;
            }
            if (!networkCommon.azId) {
                networkCommon.azId = $stateParams.azId;
            }
            $scope.ICT = $scope.user.cloudType === "ICT";
            $scope.IT = $scope.user.cloudType === "IT";
            $scope.id = "network-vmwareVpc-layout";
            $scope.hasHardwareRouter = false;
            var lay = new layout({
                "id": "network-vmwareVpc-layout",
                "subheight": 50 + 58
            });
            $scope.$on("$stateChangeSuccess", function () {
                lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
            });
        }
    ];
    return vpcManagerCtrl;
});
