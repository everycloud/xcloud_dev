/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-1-23

 */
define(["tiny-lib/angular",
    'tiny-widgets/Window'], function (angula,Window) {
    "use strict";

    var resourcesNavigationCtrl = ["$scope", "$state", function ($scope, $state) {

        $scope.privilege = $("html").scope().user.privilege;

        //创建zone弹框
        $scope.createZone = function () {
            var options = {
                "winId": "createZoneWindow",
                "action": "create",
                "title": $scope.i18n.resource_term_createZone_button || "创建Zone",
                "content-type": "url",
                "content": "./app/business/resources/views/rpool/zone/create/createZone.html",
                "height": 280,
                "width": 400,
                "resizable": true,
                "maximizable": false,
                "buttons": null,
                "close": function () {

                }
            };
            var newWindow = new Window(options);
            newWindow.show();
        };
    }];
    return resourcesNavigationCtrl;
});


