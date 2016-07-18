/**
 * 修改人：
 * 修改时间：14-2-19
 */
define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, layout) {
    "use strict";

    var systemCtrl = ["$scope", "$state", "camel", function ($scope, $state, camel) {
        $scope.id = "system-layout";
        var lay = new layout({
            "id": "system-layout",
            "subheight": 100
        });
        $scope.$on("$stateChangeSuccess",function() {
            if($state.includes('system.systemLogo')) {
                lay.opActive($("a[ui-sref='system.systemLogo']").last());
            }
            else {
                lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
            }
        })
    }];
         return systemCtrl;
});