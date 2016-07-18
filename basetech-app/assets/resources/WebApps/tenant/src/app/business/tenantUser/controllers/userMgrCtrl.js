define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-widgets/Layout",
        "tiny-lib/underscore"
    ],

    function ($, angular, layout, _) {
        "use strict";

        var userMgrCtrl = ["$scope", "$state",
            function ($scope, $state) {
                var plugins = $("html").scope().plugins;
                for (var i = 0, len = plugins.length; i < len; i++) {
                    var node = plugins[i];
                    node.state === "userMgr" && ($scope.leftTree = node);
                }
                $scope.isTenant = true;
                $scope.layout_icon_choose = "layout-icon-user";
                $scope.icon = "../theme/default/images/layout-icon-sp.png";
            }
        ];

        return userMgrCtrl;
    });
