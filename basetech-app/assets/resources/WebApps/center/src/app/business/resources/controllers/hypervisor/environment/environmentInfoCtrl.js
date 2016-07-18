/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var enInfoCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.hypervisorName = $stateParams.hyperName;
        $scope.deployMode = $("html").scope().deployMode;
        $scope.privilege = user.privilege;
        var i18n = $scope.i18n || {};

        var lay = new Layout({
            "id": "hypervisorInfoDiv",
            "subheight": 140
        });
        $("#hypervisorInfoNameDiv").attr("title", $.encoder.encodeForHTML($stateParams.hyperName));

        $scope.$on("$stateChangeSuccess", function () {
            lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
        });
    }];
    return enInfoCtrl;
});
