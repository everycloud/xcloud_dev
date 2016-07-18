/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var rpoolCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            node.type === "resources" && (leftTree = $.extend([], node.children));
        }
        //特殊处理,取出资源池部分
        for (var j = 0, subLen = leftTree.length; j < subLen; j++){
            var item = leftTree[j];
            if(item.type === "rpool"){
                $scope.leftTree = item;
                break;
            }
        }
        $scope.icon = "../theme/default/images/resource_01.png";

        var lay;
        var activeCurrent = function (lay) {
            lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
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
    return rpoolCtrl;
});
