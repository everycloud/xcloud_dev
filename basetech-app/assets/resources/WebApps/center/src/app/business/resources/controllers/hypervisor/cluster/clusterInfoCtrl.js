/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var clusterInfoCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var user = $("html").scope().user;
        $scope.clusterName = $stateParams.clusterName;
        $scope.deployMode = $("html").scope().deployMode;
        $scope.privilege = user.privilege;
		var i18n = $scope.i18n || {};
		
        var lay = new Layout({
            "id": "clusterInfoDiv",
            "subheight": 140
        });
        $("#clusterInfoNameDiv").attr("title", $.encoder.encodeForHTML($stateParams.clusterName));

        $scope.$on("$stateChangeSuccess", function () {
            if($state.includes('resources.clusterInfo.schedule')) {
                lay.opActive($("a[ui-sref='resources.clusterInfo.schedule.suggest']").last());
            }
            else {
                lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
            }
        });
    }];
    return clusterInfoCtrl;
});
