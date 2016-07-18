/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var poolInfoCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.openstack = user.cloudType === "OPENSTACK";
        $scope.privilege = user.privilege;
        $scope.poolName = $stateParams.name;
        $("#poolInfoName").attr("title",  $.encoder.encodeForHTML($stateParams.name));
        var lay = new Layout({
            "id": "poolInfoDiv",
            "subheight": 140
        });
        $scope.$on("$stateChangeSuccess", function () {
            lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
        });
    }];
    return poolInfoCtrl;
});
