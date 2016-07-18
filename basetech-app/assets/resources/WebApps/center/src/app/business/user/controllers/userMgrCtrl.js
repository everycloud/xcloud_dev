define(["tiny-lib/angular",
    "tiny-widgets/Layout"
], function (angular, layout) {
    "use strict";

    var userMgrCtrl = ["$scope", "$state",
        function ($scope, $state) {
            var plugins = $("html").scope().plugins;
            var leftTree;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.type === "userMgr" && (leftTree = $.extend({}, node));
            }

            //特殊处理，第二层节点不显示

            var leafs = [];
            for (var i = 0, len = leftTree.children.length; i < len; i++) {
                var subChildren = leftTree.children[i].children;
                for (var j = 0, sublen = subChildren.length; j < sublen; j++) {
                    leafs.push(subChildren[j]);
                }
            }
            leftTree.children = leafs;
            $scope.leftTree = leftTree;
            $scope.icon = "../theme/default/images/user.png";

            var lay;
            var activeCurrent = function (lay) {
                if ($state.includes('userMgr.domain')) {
                    lay.opActive($("a[ui-sref='userMgr.domain.user']").last());
                } else {
                    lay.opActive($("a[ui-sref='" + $state.$current.name + "']").last());
                }
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
        }
    ];

    var dependency = [];
    var userMgrModule = angular.module("userMgr", dependency);

    userMgrModule.controller("userMgr.ctrl", userMgrCtrl);
    return userMgrModule;
});
