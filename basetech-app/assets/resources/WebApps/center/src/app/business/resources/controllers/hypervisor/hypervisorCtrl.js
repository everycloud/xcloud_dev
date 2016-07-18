/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular,Layout) {
    "use strict";

    var hypervisorCtrl = ["$scope", "$compile", "$state","camel", function ($scope, $compile,$state, camel) {
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            node.type === "resources" && (leftTree = $.extend([], node.children));
        }
        //特殊处理, 取出虚拟化部分
        for (var j = 0, subLen = leftTree.length; j < subLen; j++){
            var item = leftTree[j];
            if(item.type === "hypervisor"){
                $scope.leftTree = item;
                break;
            }
        }
        $scope.icon = "../theme/default/images/subjunctive.png";

        var lay;
        var activeCurrent = function (lay) {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
        };
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
    return hypervisorCtrl;
});
