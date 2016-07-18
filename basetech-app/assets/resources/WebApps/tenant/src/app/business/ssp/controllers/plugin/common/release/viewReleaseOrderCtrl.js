/**
 * 文件名：viewReleaseOrderCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：删除服务示例的订单的查看control
 * 修改时间：14-6-9
 */
/* global define */
define(["sprintf",
    "language/keyID",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    'app/services/httpService',
    'app/services/commonService',
    'app/business/ssp/services/plugin/commonService',
    'app/business/ssp/services/order/orderService'
], function (sprintf,keyIDI18n,$, angular, _, http, timeCommonService, commonService, orderService) {
    "use strict";

    var sspReleaseResourceCtrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception",
        function ($scope, $stateParams, $state, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            // 公共参数和服务
            var user = $scope.user;
            var orderServiceIns = new orderService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);

            $scope.orderDetail = {};

            // 界面元素
            $scope.applyUser = {
                "label": i18n.common_term_applyBy_label + ":"
            };
            $scope.currApprover = {
                "label": i18n.common_term_currentProcessor_label + ":"
            };
            $scope.serviceName = {
                "label": i18n.service_term_serviceInstanceName_label + ":"
            };
            $scope.createTime = {
                "label": i18n.common_term_provideTime_label + ":"
            };
            $scope.resourceName = {
                "label": i18n.common_term_resourceName_label + ":"
            };
            $scope.resourceId = {
                "label": i18n.common_term_resources_label + "Id:"
            };
            $scope.resourceType = {
                "label": i18n.common_term_resourceType_label  + ":"
            };

            $scope.closeBtn = {
                "id": "sspApprovalEcsChangeClose",
                "text": i18n.common_term_return_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            };

            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    head.removeClass("collapse");
                    head.addClass("expand");
                    content.css("display", "none");
                } else {
                    head.removeClass("expand");
                    head.addClass("collapse");
                    content.css("display", "block");
                }
            };

            $scope.operate = {
                // 查询订单详情
                "queryOrderDetail": function () {
                    if (!$stateParams.orderId) {
                        return;
                    }

                    var options = {
                        "user": user,
                        "orderId": $stateParams.orderId
                    };
                    var deferred = orderServiceIns.queryOrder(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        // 处理订单信息
                        commonServiceIns.processOrderDetail(data);

                        $scope.orderDetail = data;

                        var orderParam = {};
                        var params = JSON.parse(data.params);
                        if (params && params.serviceInstance) {
                            orderParam = params.serviceInstance;
                            orderParam.createTime = timeCommonService.utc2Local(orderParam.createTime);
                        }
                        $scope.orderDetail.param = orderParam;

                        _.each(orderParam.resources, function (item) {
                            item.resourceTypeView = commonServiceIns.resourceTypeView[item.resourceType];
                        });
                    });
                }
            };

            //获取初始数据
            function init() {
                $scope.operate.queryOrderDetail();
            }

            //初始化
            init();
        }
    ];

    return sspReleaseResourceCtrl;
});
