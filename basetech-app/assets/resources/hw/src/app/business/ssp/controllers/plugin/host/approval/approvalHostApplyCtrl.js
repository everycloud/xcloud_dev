define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        "app/services/httpService",
        'app/services/messageService',
        "app/services/tipMessageService",
        'app/services/validatorService',
        "app/services/cloudInfraService",
        "app/business/ssp/services/catalog/catalogService",
        "app/business/ssp/services/order/orderService",
        "app/business/ssp/services/plugin/host/hostService",
        "app/business/ssp/services/plugin/commonService",
        'app/services/commonService',
        'tiny-widgets/Window'
], function ($, angular, _, UnifyValid, http, messageService, tipMessageService, validatorService, cloudInfraService, catalogService, orderService, hostService, commonService, timeCommonService, Window) {
    "use strict";

    var ctrl;
    ctrl = ["$scope", "$compile", "$state", "$stateParams", "$q", "camel", "exception", function ($scope, $compile, $state, $stateParams, $q, camel, exception) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        var orderId = $stateParams.orderId;

        var validator = new validatorService();
        var cloudInfraServiceIns = new cloudInfraService($q, camel);
        var orderServiceIns = new orderService(exception, $q, camel);
        var hostServiceIns = new hostService(exception, $q, camel);
        var commonServiceIns = new commonService(exception);
        var messageServiceIns = new messageService();
        var tipMessageIns = new tipMessageService();

        $scope.action = $stateParams.action;

        // 服务详情
        $scope.detail = {};
        // 订单详情
        $scope.orderDetail = {};
        //ID列表
        $scope.baremetalInfo = [];

        // 地域信息
        $scope.location = {
            "label": i18n.common_term_section_label + ":"
        };

        // az
        $scope.az = {
            "label": i18n.resource_term_AZ_label + ":"
        };

        // 基本信息
        $scope.base = {
            applyUser: {
                "label": i18n.common_term_applyBy_label + ":"
            },

            currApprover: {
                "label": i18n.common_term_currentProcessor_label + ":"
            },

            hostNum: {
                "label": i18n.server_term_serverNum_label + ":"
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

        // 规格信息
        $scope.config = {
            model: {
                "label": i18n.device_term_model_label + ":"
            },

            os: {
                "label": i18n.common_term_OS_label + ":"
            }
        };

        $scope.approvalResult = {
            "label": i18n.common_term_approveResult_label + ":",
            "require": "true",
            "id": "sspApprovalHostApplyResult",
            "spacing": {
                "width": "50px",
                "height": "30px"
            },
            "values": orderServiceIns.approvalOptions
        };

        $scope.approvalOpinion = {
            "label": i18n.common_term_approveAdvice_label + ":",
            "id": "sspApprovalHostApplyOpinion",
            "type": "multi",
            "width": "644",
            "height": "60",
            "value": "",
            "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
        };

        $scope.selectBtn = {
            "id": "sspApprovalHostSelectBtn",
            "text": i18n.common_term_choose_label,
            "click": function(){
                var winParam = {
                    cloudInfraId: $scope.orderDetail.param.cloudInfraId,
                    azId: $scope.orderDetail.param.availableZoneId,
                    selectedHost: []
                };

                var options = {
                    "winId": "sspApprovalHostSelectHostWin",
                    "winParam": winParam,
                    "title": i18n.service_term_chooseServer_label,
                    "width": "800px",
                    "height": "520px",
                    "content-type": "url",
                    "content": "app/business/ssp/views/plugin/host/approval/selectHost.html",
                    "buttons": null,
                    "close": function (event) {
                        var tmp = $scope.selectedHost.data;
                        _.each(winParam.selectedHost, function(item) {
                            if(findItemIndex($scope.selectedHost.data, item) < 0) {
                                tmp.push(item);
                            }
                        });

                        $scope.$apply(function () {
                            $scope.selectedHost.data = tmp.concat();
                            var tempHostInfo = [];
                            _.each(winParam.selectedHost,function(index){
                                tempHostInfo.push({
                                    "id": index.id,
                                    "name": index.name
                                });
                            });
                            $scope.baremetalInfo = tempHostInfo;
                        });
                    }
                };
                var win = new Window(options);
                win.show();
            }
        };

        $scope.selectedHost = {
            "id": "sspApprovalHostSelectedHost",
            "data": [],
            "columns": [
                {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                },
                {
                    "sTitle": i18n.device_term_model_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.model);
                    }
                },
                {
                    "sTitle": i18n.common_term_specHardware_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hardwareSpec);
                    }
                },
                {
                    "sTitle": i18n.common_term_OS_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osType);
                    }
                },
                {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osIp);
                    }
                },
                {
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "",
                    "bSortable": false
                }
            ],
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                $("td:eq(3)", nRow).addTitle();
                $("td:eq(4)", nRow).addTitle();

                var optColumn = "<div><a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a></div>";
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope["delete"] = function () {
                    var tmp = $scope.selectedHost.data;
                    var idx = findItemIndex(tmp, aData);
                    if (idx >= 0) {
                        tmp.splice(idx, 1);
                    }
                    $scope.selectedHost.data = tmp.concat();
                };
                var optNode = optLink(optScope);
                $("td:eq(5)", nRow).html(optNode);
            }
        };

        $scope.okBtn = {
            "id": "sspApplyHostOkBtn",
            "text": i18n.common_term_submit_button,
            "tooltip": "",
            "click": function () {
                // 校验
                if (!$scope.okBtn.valid()) {
                    return;
                }

                var op = $("#" + $scope.approvalResult.id).widget().opChecked("checked");
                if (op === "approve" && !hostInfoConsistent()) {
                    messageServiceIns.confirmMsgBox({
                        "content": i18n.service_apply_server_info_diffModelOS_msg,
                        "callback": function () {
                            $scope.operate.approvalHost();
                        }
                    });
                } else {
                    $scope.operate.approvalHost();
                }
            },
            "valid": function () {
                return validApprovalInfo();
            }
        };

        $scope.cancelBtn = {
            "id": "sspApplyHostCancelBtn",
            "text": i18n.common_term_cancle_button,
            "tooltip": "",
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.closeBtn = {
            "id": "sspApplyHostCloseBtn",
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
                // 收起来前，校验一下
                if ($scope.action === "approval") {
                    if (id === "sspApprovalHostApplyApprovalArea") {
                        if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                            return false;
                        }
                    }
                }

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
                    data.param = JSON.parse(data.params) || {};
                    $scope.orderDetail = data;

                    $scope.detail.param = JSON.parse(data.definationParams);
                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 提交申请
            "approvalHost": function () {
                var orderParam = $scope.orderDetail.param;
                var hostParam = {
                    "cloudInfraId": orderParam.cloudInfraId,
                    "cloudInfraName": orderParam.cloudInfraName,
                    "availableZoneId": orderParam.availableZoneId,
                    "availableZoneName": orderParam.availableZoneName,
                    "count": orderParam.count,
                    "model": orderParam.model,
                    "osType": orderParam.osType,
                    "vpcId":user.vpcId,
                    "baremetalInfo": $scope.baremetalInfo
                };

                var approvalResult = $("#" + $scope.approvalResult.id).widget().opChecked("checked");
                var options = {
                    "user": user,
                    "id": $scope.orderDetail.orderId,
                    "params": {
                        "params": JSON.stringify(hostParam),
                        "action": approvalResult,
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

        function validApprovalInfo(){
            if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                return false;
            }

            // 如果是审批通过才校验
            if ($("#" + $scope.approvalResult.id).widget().opChecked("checked") === "approve"){
                // 校验选中的物理机信息
                var selected = $scope.selectedHost.data;
                var applyCount = parseInt($scope.orderDetail.param.count, 10);
                if (selected.length !== applyCount) {
                    tipMessageIns.alert("error", i18n.service_apply_server_info_diffNum_msg);
                    return false;
                }
            }

            return true;
        }

        // 检查选中的物理机的型号和操作系统，与申请单是否一致
        function hostInfoConsistent() {
            var selected = $scope.selectedHost.data;
            var orderParam = $scope.orderDetail.param || {};
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].model !== orderParam.model || selected[i].os !== orderParam.os){
                    return false;
                }
            }
            return true;
        }

        // 找到列表中某项的索引，如果不存在，返回-1
        function findItemIndex(list, item) {
            var index = -1;
            if (list && item) {
                var length = list.length || 0;
                for (var i = 0; i < length; i++) {
                    if (list[i].id === item.id) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        }

        // 初始化页面信息
        function init() {
            $scope.operate.queryOrderDetail();
        }

        init();
    }];

    return ctrl;
});
