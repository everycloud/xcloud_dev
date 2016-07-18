/**
 * 文件名：viewReleaseOrderCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：删除服务示例的订单的查看control
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

            $scope.action = $stateParams.action;
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
            $scope.expireTime = {
                "label": i18n.common_term_overdueTime_label + ":"
            };
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":"
            };

            $scope.approvalResult = {
                "label": i18n.common_term_approveResult_label + ":",
                "require": "true",
                "id": "sspApprovalExtendApplyResult",
                "spacing": {
                    "width": "50px",
                    "height": "30px"
                },
                "values": orderServiceIns.approvalOptions
            };

            $scope.approvalOpinion = {
                "label": i18n.common_term_approveAdvice_label + ":",
                "id": "sspApprovalExtendApplyOpinion",
                "type": "multi",
                "width": "644",
                "height": "60",
                "value": "",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "sspApplyDiskOkBtn",
                "text": i18n.common_term_submit_button,
                "tooltip": "",
                "click": function () {
                    // 校验
                    if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                        return;
                    }
                    $scope.operate.approvalExtend();
                }
            };
            $scope.cancelBtn = {
                "id": "sspApplyDiskCancelBtn",
                "text": i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
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

                        data.formatDate = data.tenancy !== "0" ? timeCommonService.utc2Local(data.tenancy) : i18n.common_term_neverExpires_label;

                        $scope.orderDetail = data;

                        var params = JSON.parse(data.params);
                        if (params) {
                            $scope.orderDetail.param = params.serviceInstance;
                        }
                    });
                },

                // 提交申请
                "approvalExtend": function () {
                    var options = {
                        "user": user,
                        "id": $scope.orderDetail.orderId,
                        "params": {
                            "action": $("#" + $scope.approvalResult.id).widget().opChecked("checked"),
                            "comments": $("#" + $scope.approvalOpinion.id).widget().getValue(),
                            "tenancy": $scope.orderDetail.tenancy
                        }
                    };
                    var deferred = orderServiceIns.adminActionOrder(options);
                    deferred.then(function (data) {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
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
