/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Searchbox",
    "tiny-directives/Menubutton",
    "fixtures/ecsFixture"
], function ($, angular, _, layout) {
    "use strict";

    var ecsCtrl = ["$scope", "$state",
        function ($scope, $state) {
            var plugins = $("html").scope().plugins;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.state === "ecs" && ($scope.leftTree = node);
            }
            $scope.isTenant = true;
            $scope.layout_icon_choose = "layout-icon-vdc";
            $scope.icon = "../theme/default/images/layout-icon-sp.png";
        }
    ];

    var dependency = [];
    /**
     * 定义user moddule， 这里需要设置命令空间，防止重复
     * @type {module}
     */
    var ecsModule = angular.module("ecs", dependency);

    ecsModule.controller("ecs.ctrl", ecsCtrl);
    return ecsModule;
});
