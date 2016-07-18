define(["tiny-lib/angular",
    "tiny-widgets/Layout"
], function (angular, Layout) {
    "use strict";

    var multiPoolCtrl = ["$scope", "$state",
        function ($scope, $state) {
            var layoutModel = new Layout({
                "id": "manageServiceLayout",
                "subheight": 68
            });
            $scope.$on("$stateChangeSuccess", function () {
                layoutModel.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
            });
        }
    ];

    var dependency = [];

    var multiPoolModule = angular.module("tag", dependency);

    multiPoolModule.controller("tag.ctrl", multiPoolCtrl);

    return multiPoolModule;
});
