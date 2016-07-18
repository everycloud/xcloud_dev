define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, layout) {
    "use strict";

    var systemCtrl = ["$scope", "$state", "camel", "$rootScope", function ($scope, $state, camel, $rootScope) {
        var plugins = $rootScope.plugins;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            node.type === "system" && ($scope.leftTree = node);
        }
        $scope.icon = "../theme/default/images/system.png";
    }];
    return systemCtrl;
});