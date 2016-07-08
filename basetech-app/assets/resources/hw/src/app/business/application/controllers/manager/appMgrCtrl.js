define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "tiny-lib/underscore"
], function ($, angular, layout, _) {
    "use strict";
    var ctrl = ["$scope", "$state", "camel",
        function ($scope, $state, camel) {
            var plugins = $("html").scope().plugins;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.state === "application" && ($scope.leftTree = node);
            }
            $scope.isTenant = true;
            $scope.layout_icon_choose = "layout-icon-application";
            $scope.icon = "../theme/default/images/layout-icon-sp.png";
        }
    ];
    return ctrl;
});
