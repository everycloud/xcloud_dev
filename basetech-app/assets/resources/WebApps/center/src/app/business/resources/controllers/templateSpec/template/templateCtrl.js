define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var templateCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        var lay = new Layout({
            "id": "templateLayoutDiv",
            "subheight": 108
        });
        $scope.$on("$stateChangeSuccess", function () {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
        });
    }];
    return templateCtrl;
});
