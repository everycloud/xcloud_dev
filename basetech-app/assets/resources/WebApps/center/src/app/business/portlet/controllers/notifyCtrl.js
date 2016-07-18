/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：服务健康度
 * 修改时间：2014-1-28
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "fixtures/serviceFixture"
], function ($, angular, ExceptionService) {
    "use strict";

    var notifyCtrl = ["$scope", "camel", "$state", "$timeout", function ($scope, camel, $state, $timeout) {
        var exception = new ExceptionService();
        var user = $scope.user;
        var i18n = $scope.i18n || {};
        $scope.showTodo = false;

        $scope.operator = {
            getToDoList: function () {
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/{vdc_id}/orders",
                        o: {
                            vdc_id: user.vdcId
                        }
                    },
                    userId: user.id,
                    params: {
                        "handle-user-id": user.id,
                        "status": "approving"
                    }
                });
                deferred.success(function (response, textStatus, jqXHR) {
                    $scope.$apply(function () {
                        response = response || {total: 0, orders: []};
                        $scope.showTodo = !!response.total;
                        $scope.todo = i18n.sprintf(i18n.common_term_haveToDo_msg, '<a href="#/service/order/approval"><span class="alarmnum">' + response.total + '</span></a>');
                    });
                });
                deferred.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            }
        };

        $scope.operator.getToDoList();
    }];

    var mod = angular.module("serviceNotify", []);
    mod.controller("servicePage.notify.ctrl", notifyCtrl);

    return mod;
});
