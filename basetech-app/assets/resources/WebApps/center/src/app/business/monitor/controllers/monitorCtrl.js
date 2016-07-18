define(["tiny-lib/angular",
    "tiny-widgets/Layout"
], function (angular, layout) {
    "use strict";

    var monitorCtrl = ["$scope", "$state",
        function ($scope, $state) {
            var plugins = $("html").scope().plugins;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.type === "monitor" && ($scope.leftTree = node);
            }
            $scope.icon = "../theme/default/images/monitoring.png";
        }
    ];
    return monitorCtrl;
});
