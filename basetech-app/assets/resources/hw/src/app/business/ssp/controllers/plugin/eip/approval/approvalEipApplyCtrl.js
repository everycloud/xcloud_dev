/*global define*/
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        "app/services/httpService",
        'app/services/messageService',
        "app/services/tipMessageService",
        'app/services/validatorService',
        "app/business/ssp/services/order/orderService",
        "app/business/ssp/services/plugin/commonService",
        'app/services/commonService',
        'tiny-widgets/Window',
        'tiny-directives/RadioGroup'
], function ($, angular, _, UnifyValid, http, messageService, tipMessageService, validatorService, orderService, commonService, timeCommonService) {
    "use strict";

    var ctrl = ["$scope", "$state", "$stateParams", "$q", "camel", "exception", function ($scope, $state, $stateParams, $q, camel, exception) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        var orderId = $stateParams.orderId;

        var validator = new validatorService();
        var orderServiceIns = new orderService(exception, $q, camel);
        var commonServiceIns = new commonService(exception);
        var messageServiceIns = new messageService();

        $scope.isICT = user.cloudType === "ICT";
        $scope.action = $stateParams.action;
        $scope.from = $stateParams.from;

        // 服务详情
        $scope.detail = {};
        // 订单详情
        $scope.orderDetail = {};
        $scope.cloudInfra = {};

        // 地域信息
        $scope.location = {
            "id": "sspApprovalEipRegion",
            "label": i18n.common_term_section_label + ":",
            "width": "180"
        };

        // vpc
        $scope.vpc = {
            "label": i18n.vpc_term_vpc_label + ":",
            "id": "sspApprovalEipVpc",
            "width": "180"
        };

        // 基本信息
        $scope.base = {
            applyUser: {
                "label": i18n.common_term_applyBy_label + ":"
            },
            currApprover: {
                "label": i18n.common_term_currentProcessor_label + ":"
            },
            eipNum: {
                "label": i18n.eip_term_eipNum_label + ":"
            },
            // 到期时间
            expireTime: {
                "label": i18n.common_term_overdueTime_label + ":"
            },
            // 备注
            remark: {
                "label": i18n.common_term_remark_label + ":"
            }
        };

        $scope.config = {
            "ipBandWidthTemplate": i18n.template_term_ipBandwidth_label + ":",
            "publicNetPool": i18n.vpc_term_publicIPpool_label + ":",
            "maxRxBandwidth":i18n.perform_term_receiveBandMaxMbps_label + ":",
            "maxTxBandwidth":i18n.perform_term_sendBandMaxMbps_label + ":"
        };

        $scope.approvalResult = {
            "label": i18n.common_term_approveResult_label + ":",
            "require": "true",
            "id": "sspApprovalEipApplyResult",
            "spacing": {
                "width": "50px",
                "height": "30px"
            },
            "values": orderServiceIns.approvalOptions
        };

        $scope.approvalOpinion = {
            "label": i18n.common_term_approveAdvice_label + ":",
            "id": "sspApprovalEipApplyOpinion",
            "type": "multi",
            "width": "644",
            "height": "60",
            "value": "",
            "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
        };

        $scope.okBtn = {
            "id": "sspApplyEipOkBtn",
            "text": i18n.common_term_submit_button,
            "click": function () {
                // 校验
                if (!UnifyValid.FormValid($("#sspApprovalEipApplyApprovalArea"))) {
                    return;
                }
                $scope.operate.approvalEip();
            }
        };
        $scope.cancelBtn = {
            "id": "sspApplyEipCancelBtn",
            "text": i18n.common_term_cancle_button,
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.closeBtn = {
            "id": "sspApplyEipCloseBtn",
            "text": i18n.common_term_return_button,
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.modifyBtn = {
            "id": "serviceApprovalEcsModifyBtn",
            "text": i18n.common_term_modify_button,
            "click": function () {
                $state.go($scope.orderDetail.applyUrl, {
                    "action": "edit",
                    "orderId": $scope.orderDetail.orderId,
                    "serviceId": $scope.orderDetail.serviceOffingId
                });
            }
        };

        $scope.doCancelBtn = {
            "id": "serviceApprovalEcsDoCancelBtn",
            "text": i18n.common_term_undo_button,
            "click": function () {
                messageServiceIns.confirmMsgBox({
                    "content": i18n.service_service_drawBack_info_confirm_msg,
                    "callback": function () {
                        $scope.operate.actionOrder({
                            "action": "cancel"
                        });
                    }
                });
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
            "actionOrder": function (param) {
                var options = {
                    "id": orderId,
                    "user": user,
                    "params": param
                };
                var deferred = orderServiceIns.userActionOrder(options);
                deferred.then(function (data) {
                    $state.go("ssp.order.apply");
                });
            },
            // 查询订单详情
            "queryOrderDetail": function () {
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": orderId
                };
                var deferred = orderServiceIns.queryOrder(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }

                    // 处理订单信息
                    commonServiceIns.processOrderDetail(data);

                    data.formatDate = data.tenancy !== "0" ? timeCommonService.utc2Local(data.tenancy) : i18n.common_term_neverExpires_label;

                    var orderParam = JSON.parse(data.params) || {};
                    data.param = orderParam;
                    $scope.orderDetail = data;

                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 提交申请
            "approvalEip": function () {
                var approvalResult = $("#" + $scope.approvalResult.id).widget().opChecked("checked");
                var options = {
                    "user": user,
                    "id": $scope.orderDetail.orderId,
                    "params": {
                        "action": approvalResult,
                        "comments": $("#" + $scope.approvalOpinion.id).widget().getValue(),
                        "tenancy": $scope.orderDetail.tenancy
                    }
                };

                if (approvalResult === "approve"){
                    var eipParam = $scope.orderDetail.param;
                    options.params.params = JSON.stringify(eipParam);
                }

                var deferred = orderServiceIns.adminActionOrder(options);
                deferred.then(function (data) {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                });
            }
        };

        // 初始化页面信息
        function init() {
            $scope.operate.queryOrderDetail();
        }

        init();
    }];

    return ctrl;
});
