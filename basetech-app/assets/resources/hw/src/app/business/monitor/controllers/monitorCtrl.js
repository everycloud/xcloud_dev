/* global define */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "tiny-lib/underscore"
], function ($, angular, layout, _) {
    "use strict";

    var monitorCtrl = ["$scope", "$state", "camel", "$timeout",
        function ($scope, $state, camel, $timeout) {
            var plugins = $("html").scope().plugins;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.state === "monitor" && ($scope.leftTree = node);
            }
            $scope.isTenant = true;
            $scope.layout_icon_choose = "layout-icon-monitoring";
            $scope.icon = "../theme/default/images/layout-icon-sp.png";
        }
    ];
    return monitorCtrl;
});
