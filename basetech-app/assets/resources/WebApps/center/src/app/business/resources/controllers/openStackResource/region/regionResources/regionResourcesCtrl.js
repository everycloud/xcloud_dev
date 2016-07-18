/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "app/services/competitionConfig"
], function ($, angular, Layout,Competition) {
    "use strict";

    var regionResourcesCtrl = ["$scope", "$compile", "$state",'$stateParams', "camel", function ($scope, $compile, $state,$stateParams, camel) {
        $scope.competition = Competition;
        $scope.regionName = $stateParams.region;
        var lay = new Layout({
            "id": "regionResourcesLayoutDiv",
            "subheight": 68
        });
        $scope.$on("$stateChangeSuccess", function () {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
        });
    }];
    return regionResourcesCtrl;
});
