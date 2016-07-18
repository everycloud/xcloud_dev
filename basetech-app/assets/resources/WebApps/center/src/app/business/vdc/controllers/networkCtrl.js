
define(["tiny-lib/angular",
    "tiny-widgets/Layout"], function (angular, layout) {
    "use strict";

    var networkCtrl = ["$scope","$state", function ($scope,$state) {
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            node.type === "vdcMgr" && (leftTree = $.extend({},node));
        }
        for (var j = 0, subLen = leftTree.children.length; j < subLen; j++) {
            var vdcNode = leftTree.children[j];
            if(vdcNode.text === "VPC"){
                $scope.leftTree = vdcNode;
                break;
            }
        }
        $scope.icon = "../theme/default/images/vpc.png";
    }];
    return networkCtrl;
});