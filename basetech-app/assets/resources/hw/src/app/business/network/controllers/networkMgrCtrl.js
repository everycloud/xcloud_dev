/*global define*/
define(["tiny-lib/jquery",
    "tiny-widgets/Layout"
], function ($, layout) {
    "use strict";

    var managerCtrl = ["$scope", "$state", "camel",
        function ($scope, $state, camel) {
            var plugins = $("html").scope().plugins;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.state === "network" && ($scope.leftTree = node);
            }
            $scope.isTenant = true;
            $scope.layout_icon_choose = "layout-icon-vpc";
            $scope.icon = "../theme/default/images/layout-icon-sp.png";
        }
    ];
    return managerCtrl;
});
