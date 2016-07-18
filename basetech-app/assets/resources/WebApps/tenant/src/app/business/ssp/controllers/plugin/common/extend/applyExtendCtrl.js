/**
 * 文件名：applyExtendCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：服务实例的延期control， 由于申请使用的弹框，所以目前只是修改订单使用
 * 修改时间：14-6-9
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    'tiny-common/UnifyValid',
    'app/services/httpService',
    'app/services/validatorService',
    'app/services/commonService',
    'app/business/ssp/services/plugin/commonService',
    'app/business/ssp/services/order/orderService'
], function ($, angular, _, UnifyValid, http, validatorService, timeCommonService, commonService, orderService) {
    "use strict";

    var sspReleaseResourceCtrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception",
        function ($scope, $stateParams, $state, $q, camel, exception) {
            // 公共参数和服务
            var i18n  = $scope.i18n;
            var user = $scope.user;
            var orderServiceIns = new orderService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var validator = new validatorService();

            $scope.orderDetail = {};

            // 服务实例名称
            $scope.serviceName = {
                "label": i18n.service_term_serviceInstanceName_label + ":"
            };

            // 到期时间
            $scope.expireTime = {
                "label": i18n.common_term_overdueTime_label + ":",
                "id": "sspExtendInstanceExpireTime",
                "width": "178",
                "require": true,
                "disable": false,
                "type": "datetime",
                "minDate": commonServiceIns.getCurrentTime(),
                "defaultDate": commonServiceIns.get30DaysDate(),
                //"defaultTime": "23:59",
                "dateFormat": "yy-mm-dd",
                "timeFormat": "hh:mm:ss"
            };

            $scope.neverExpire = {
                "id": "sspExtendInstanceNeverExpire",
                "checked": false,
                "text": i18n.common_term_neverExpires_label,
                "change": function () {
                    $scope.expireTime.disable = $("#" + $scope.neverExpire.id).widget().option("checked");
                }
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspExtendInstanceRemark",
                "value": "",
                "type": "multi",
                "width": "262",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "sspExtendInstanceOK",
                "text": i18n.common_term_ok_button,
                "disable": false,
                "click": function () {
                    // 校验
                    if (!UnifyValid.FormValid($(".ssp_extend_instance"))) {
                        return;
                    }

                    var options = {
                        "user": user,
                        "id": $stateParams.orderId,
                        "params": {
                            "tenancy": $("#" + $scope.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc($("#" + $scope.expireTime.id).widget().getDateTime()),
                            "comments": $("#" + $scope.remark.id).widget().getValue()
                        }
                    };
                    var deferred = orderServiceIns.modifyOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "sspExtendInstanceCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
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

                        $scope.orderDetail = data;
                        var params = JSON.parse(data.params);
                        if (params) {
                            $scope.orderDetail.param = params.serviceInstance;
                        }

                        // 到期时间
                        if (data.tenancy) {
                            if (data.tenancy === "0") {
                                $scope.expireTime.disable = true;
                                $scope.neverExpire.checked = true;
                            } else {
                                var dateWidget = $("#" + $scope.expireTime.id).widget();
                                if (dateWidget) {
                                    var localTime = timeCommonService.utc2Local(data.tenancy);
                                    var dateTime = localTime.split(" ");
                                    if (dateTime.length > 1) {
                                        dateWidget.option("defaultTime", dateTime[1]);
                                        dateWidget.option("defaultDate", dateTime[0]);
                                    }
                                }
                            }
                        }

                        // 备注
                        $scope.remark.value = data.comments;
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
