/**
 * 文件名：approvalDiskChangeCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：审批磁盘变更的control
 * 修改时间：14-7-23
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        "app/services/messageService",
        'tiny-common/UnifyValid',
        'app/services/httpService',
        'app/services/validatorService',
        'app/services/commonService',
        "app/business/ssp/services/order/orderService",
        'app/business/ssp/services/plugin/disk/diskService',
        'app/business/ssp/services/plugin/commonService'
], function ($, angular, _, messageService,UnifyValid, http, validatorService, timeCommonService, orderService, diskService, commonService) {
    "use strict";

    var sspApprovalDiskChangeCtrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception", function ($scope, $stateParams, $state, $q, camel, exception) {
        // 公共参数和服务
        var user = $scope.user;
        var i18n = $scope.i18n;
        var cloudInfraId = $stateParams.cloudInfraId;
        var vpcId = $stateParams.vpcId || "-1";
        var diskId = $stateParams.resourceId;
        var orderId = $stateParams.orderId;
        var diskServiceIns = new diskService(exception, $q, camel);
        var orderServiceIns = new orderService(exception, $q, camel);
        var commonServiceIns = new commonService(exception);
        var messageServiceIns = new messageService();
        var validator = new validatorService();

        $scope.action = $stateParams.action;
        $scope.from = $stateParams.from;
        $scope.diskDetail = {};
        $scope.orderDetail = {};

        $scope.label = {
            "applyUser": i18n.common_term_applyBy_label + ":",
            "currApprover": i18n.common_term_currentProcessor_label + ":",
            "remark": i18n.common_term_remark_label + ":",
            "publicNetIp": i18n.common_term_IP_label + ":",
            "oldIpBandWidthTemplate": "当前" + i18n.template_term_ipBandwidth_label + ":",
            "maxRxBandwidth":i18n.perform_term_receiveBandMaxMbps_label + ":",
            "maxTxBandwidth":i18n.perform_term_sendBandMaxMbps_label + ":",
            "newIpBandWidthTemplate": "变更" + i18n.template_term_ipBandwidth_label + ":"
        };

        $scope.ipBandWidthTable = {
            "columns": [
                {
                    "sTitle": i18n.spec_term_ipBandName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "100px",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_receiveBandMaxMbps_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.maxRxBandwidth);
                    },
                    "sWidth": "100px",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_sendBandMaxMbps_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.maxTxBandwidth);
                    },
                    "sWidth": "100px",
                    "bSortable": false
                }
            ],
            "oldData": [],
            "changedData": []
        };

        $scope.approvalResult = {
            "label": i18n.common_term_approveResult_label + ":",
            "require": "true",
            "id": "sspApprovalEcsChangeResult",
            "spacing": {
                "width": "50px",
                "height": "30px"
            },
            "values": orderServiceIns.approvalOptions
        };

        $scope.approvalOpinion = {
            "label": i18n.common_term_approveAdvice_label + ":",
            "id": "sspApprovalEcsChangeOpinion",
            "type": "multi",
            "width": "644",
            "height": "60",
            "value": "",
            "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
        };

        $scope.okBtn = {
            "id": "sspChangeDiskOK",
            "text": i18n.common_term_ok_button,
            "disable": false,
            "click": function () {
                // 校验
                if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                    return;
                }

                var param = $scope.orderDetail.param || {};
                var diskParams = {
                    "cloudInfraId": cloudInfraId,
                    "vpcId": vpcId,
                    "availableZoneId": param.availableZoneId,
                    "volumeId": diskId,
                    "size": param.size,
                    "oldSize": param.oldSize
                };

                var options = {
                    "user": user,
                    "id": $scope.orderDetail.orderId,
                    "params": {
                        "action": $("#" + $scope.approvalResult.id).widget().opChecked("checked"),
                        "comments": $("#" + $scope.approvalOpinion.id).widget().getValue(),
                        "params": JSON.stringify(diskParams)
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

        $scope.cancelBtn = {
            "id": "sspChangeDiskCancel",
            "text": i18n.common_term_cancle_button,
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
                if (!$stateParams.orderId) {
                    return;
                }
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": $stateParams.orderId
                };
                var deferred = orderServiceIns.queryOrder(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }

                    // 处理订单信息
                    commonServiceIns.processOrderDetail(data);

                    $scope.orderDetail = data;
                    var param = JSON.parse(data.params);
                    $scope.orderDetail.param = param;

                    $scope.ipBandWidthTable.changedData = [{
                        "name": param.name,
                        "maxRxBandwidth": param.maxRxBandwidth,
                        "maxTxBandwidth": param.maxTxBandwidth
                    }];

                    // 这几个参数从订单详情中取
                    cloudInfraId = param.cloudInfraId;
                    vpcId = param.vpcId;

                    retDefer.resolve();
                });
                return retDefer.promise();
            }
        };

        //获取初始数据
        function init() {
            var defer = $scope.operate.queryOrderDetail();
        }

        //初始化
        init();
    }];

    return sspApprovalDiskChangeCtrl;
});
