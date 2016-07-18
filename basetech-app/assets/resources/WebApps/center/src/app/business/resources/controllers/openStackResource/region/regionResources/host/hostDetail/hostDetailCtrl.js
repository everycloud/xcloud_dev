/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-20

 */
define(["tiny-lib/jquery",
    'tiny-lib/angular',
    "tiny-widgets/Layout"
],
    function ($, angular, Layout) {
        "use strict";
        var hostDetailCtrl = ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
            $scope.name = $stateParams.hostId;
            $("#hostNameDiv").attr("title",  $.encoder.encodeForHTML($scope.name));
            $scope.regionName = $stateParams.region;
            var detailLayout = new Layout({
                "id": "hostDetailLayout"
            });
            $scope.$on("$stateChangeSuccess", function () {
                detailLayout.opActive($(".tiny-layout-west a[ui-sref='" + $state.$current.name + "']").last());
            });
        }];
        return hostDetailCtrl;
    });

