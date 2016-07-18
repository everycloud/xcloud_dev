define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, layout) {
    "use strict";

    var vdcCtrl = ["$scope", "$state", function ($scope, $state) {
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            node.type === "vdcMgr" && (leftTree = $.extend(true, {}, node));
        }
        var newChildren = [];
        for (var j = 0, subLen = leftTree.children.length; j < subLen; j++) {
            var vdcNode = leftTree.children[j];
            if (vdcNode.text === "VDC") {
                $scope.leftTree = vdcNode;
                break;
            }
        }
        $scope.leftTree.children = $scope.leftTree.children.concat(newChildren);
        $scope.icon = "../theme/default/images/vdc.png";

        var lay;
        var activeCurrent = function (lay) {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
        }
        setTimeout(function () {
            lay = new layout({
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
    return vdcCtrl;
});