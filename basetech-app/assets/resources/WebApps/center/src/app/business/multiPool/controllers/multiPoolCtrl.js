define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, Layout) {
    "use strict";

    var multiPoolCtrl = ["$scope", "$state", function ($scope, $state) {
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            if (node.type === "service") {
                for (var j = 0, subLen = node.children.length; j < subLen; j++) {
                    var subNode = node.children[j];
                    subNode.type === "multiPool" && (leftTree = $.extend({}, subNode));
                }
            }
        }

        $scope.leftTree = leftTree;
        $scope.icon = "../theme/default/images/subjunctive.png";

        var lay;
        var activeCurrent = function (lay) {
            if ($state.includes('service.design') || $state.includes('service.importTemplate')) {
            } else {
                lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
            }
        }
        setTimeout(function () {
            lay = new Layout({
                "id": "leftBar",
                "subheight": 100
            });
            activeCurrent(lay);
        }, 1);
        $scope.$on("$stateChangeSuccess", function () {
            lay && activeCurrent(lay);
        });
    }];

    var dependency = [];

    var multiPoolModule = angular.module("multiPool", dependency);

    multiPoolModule.controller("multiPool.ctrl", multiPoolCtrl);

    return multiPoolModule;
});