/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-17

 */
define(['tiny-lib/angular',
    "tiny-widgets/Layout"
],
    function (angular, Layout) {
        "use strict";
        var deviceCtrl = ['$scope', "$state", "$rootScope", function ($scope, $state, $rootScope) {
            var privilege = $rootScope.user.privilege;
            $scope.right = {
                hasDeviceOperateRight: privilege.role_role_add_option_deviceHandle_value,
                hasFsOperateRight: privilege.role_role_add_option_FusionStorageHandle_value
            };
            var plugins = $("html").scope().plugins;
            var leftTree;
            for (var i = 0, len = plugins.length; i < len; i++) {
                var node = plugins[i];
                node.type === "resources" && (leftTree = $.extend([], node.children));
            }
            //特殊处理
            for (var j = 0, subLen = leftTree.length; j < subLen; j++) {
                var item = leftTree[j];
                if (item.type === "device") {
                    $scope.leftTree = item;
                    break;
                }
            }
            $scope.icon = "../theme/default/images/equipment.png";

        }];
        return deviceCtrl;
    });

