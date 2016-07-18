/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout"
], function ($, angular, Layout) {
    "use strict";

    var templateSpecCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        var scope = $("html").scope();
        var plugins = $("html").scope().plugins;
        var leftTree;
        for (var i = 0, len = plugins.length; i < len; i++) {
            var node = plugins[i];
            //取出资源部分
            if (node.type === "resources") {
                //特殊处理,取出虚拟化部分
                for (var j = 0, subLen = node.children.length; j < subLen; j++) {
                    var item = node.children[j];
                    if (item.type === "templateSpec") {
                        leftTree = $.extend(true, {}, item);
                        break;
                    }
                }
                break;
            }
        }
        var template = {
            text: scope.i18n.template_term_template_label || "模板",
            hide:true,
            children: []
        };
        var specification = {
            text: scope.i18n.common_term_spec_label || "规格",
            hide: true,
            children: []
        };
        for (var k = 0, treeLen = leftTree.children.length; k < treeLen; k++) {
            var leaf = leftTree.children[k];
            if (leaf.type === "specification") {
                specification.children.push(leaf);
                !specification.state &&  !leaf.hide && (specification.state = leaf.state);
                specification.hide = !!(!specification.hide && leaf.hide);
            } else {
                template.children.push(leaf);
                !template.state && !leaf.hide && (template.state = leaf.state);
                template.hide = !!(!template.hide && leaf.hide);
            }
        }
        leftTree.children = [template, specification];
        leftTree.lineBreak = true;
        $scope.leftTree = leftTree;
        $scope.icon = "../theme/default/images/moulding board.png";

    }];
    return templateSpecCtrl;
});
