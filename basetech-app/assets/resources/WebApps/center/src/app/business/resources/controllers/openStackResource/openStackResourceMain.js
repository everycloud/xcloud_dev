/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var openStackResourceCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        var plugins = $("html").scope().plugins;
        var leftTree = [];
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            //取出资源部分
            if (node.type === "resources") {
                //特殊处理,取出虚拟化部分
                for (var j = 0, subLen = node.children.length; j < subLen; j++) {
                    var item = node.children[j];
                    if (item.type === "openStack") {
                        leftTree = item.children;
                    }
                }
                break;
            }
        }
        var openStack = {
            text: $scope.i18n.resource_term_openstackManage_label || "OpenStack资源管理",
            hide: true,
            children: []
        };
        for (var k = 0, treeLen = leftTree.length; k < treeLen; k++) {
            var leaf = leftTree[k];
            openStack.children.push(leaf);
            !openStack.state && !leaf.hide && (openStack.state = leaf.state);
            openStack.hide = !!(!openStack.hide && leaf.hide);
        }
        $scope.leftTree = openStack;
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
    return openStackResourceCtrl;
});
