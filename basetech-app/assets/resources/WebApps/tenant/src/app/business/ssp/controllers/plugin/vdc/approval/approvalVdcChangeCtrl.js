define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/messageService",
    "app/services/httpService",
    "app/services/validatorService",
    'app/services/commonService',
    "tiny-common/UnifyValid",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/plugin/commonService",
    "app/services/cloudInfraService",
    "app/business/tenantUser/service/orgService",
    "app/business/ssp/services/plugin/vdc/vdcService"
], function (sprintf,keyIDI18n,$, angular, _, messageService, http, validatorService, timeCommonService, UnifyValid, orderService, catalogService, commonService, cloudInfraService, orgService, vdcService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "$state", "camel", "exception", "$stateParams",
        function ($scope, $compile, $q, $state, camel, exception, $stateParams) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $("html").scope().user;
            //获取上个页面传来的参数，以此判定是修改，是创建还是查看详情
            var serviceId = $stateParams.serviceId;
            var resourceId = "";
            var orderId = $stateParams.orderId;
            $scope.from = $stateParams.from;
            var messageServiceIns = new messageService();
            var validator = new validatorService();
            var orderServiceImpl = new orderService(exception, $q, camel);
            var catalogServiceImpl = new catalogService(exception, $q, camel);
            var cloudInfraServiceImpl = new cloudInfraService($q, camel);
            var orgServiceImpl = new orgService();
            var commonServiceIns = new commonService(exception);
            var vdcServiceImpl = new vdcService(exception, $q, camel);

            $scope.title = i18n.service_term_applyVDCspecChange_label;
            // 服务详情
            $scope.orderDetailParams = {};
            $scope.operateHistory = {};

            $scope.action = $stateParams.action;

            $scope.formsLabelWidth = 100;

            $scope.confirmOptValue = "approve";

            $scope.applyUser = {
                "label": i18n.common_term_applyBy_label + ":"
            };

            $scope.currApprover = {
                "label": i18n.common_term_currentProcessor_label + ":"
            };

            $scope.vdcName = {
                "label": i18n.common_term_name_label + ":",
                "value": ""
            };

            $scope.vdcId = {
                "label": i18n.org_term_VDCid_label + ":",
                "value": ""
            };

            $scope.old = {
                cpu : "",
                memory : "",
                storage : "",
                vpc : "",
                ip : "",
                group : "",
                vm : ""
            };

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "require": true,
                "id": "approvalChangeVDCCpu",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "maxValue(80000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + ";",
                "value": ""
            };
            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":",
                "require": true,
                "id": "approvalChangeVDCMemory",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + ";",
                "value": ""
            };
            $scope.storage = {
                "label": i18n.common_term_storageGB_label + ":",
                "require": true,
                "id": "approvalChangeVDCStorage",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "maxValue(512000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + ";",
                "value": ""
            };
            $scope.ip = {
                "label": i18n.eip_term_eipNum_label + ":",
                "require": true,
                "id": "approvalChangeVDCIP",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "maxValue(200):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + ";",
                "value": ""
            };
            $scope.vpc = {
                "label": i18n.vpc_term_vpcNum_label + ":",
                "require": true,
                "id": "approvalChangeVDCVPC",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "maxValue(20):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + ";",
                "value": ""
            };
            $scope.group = {
                "label": i18n.org_term_secuGroupNum_label + ":",
                "require": true,
                "id": "approvalChangeVDCGroup",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "maxValue(1000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + ";",
                "value": ""
            };
            $scope.vm = {
                "label": i18n.vm_term_vmNum_label + ":",
                "require": true,
                "id": "approvalChangeVDCVM",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + ";",
                "value": ""
            };


            $scope.confirmInfo = {
                sureBtn: {
                    "id": "approvalChangeVdc-sure",
                    "text": i18n.common_term_submit_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".approvalVDC"));
                        if (!valid) {
                            return;
                        }
                        $scope.operate.approvalOrder();
                    }
                },
                cancelBtn: {
                    "id": "approvalChangeVdc-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                },
                backBtn: {
                    "id": "approvalChangeVdc-back",
                    "text": i18n.common_term_return_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
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

            $scope.description = {
                label: i18n.common_term_remark_label + ":",
                "value": ""
            };

            $scope.confirmOpt = {
                "label": i18n.common_term_approveResult_label + "：",
                "require": "true",
                "id": "confirmOptSelect",
                "spacing": {
                    "width": "50px",
                    "height": "30px"
                },
                "values": orderServiceImpl.approvalOptions,
                "layout": "horizon",
                "change": function () {
                    $scope.confirmOptValue = $("#" + $scope.confirmOpt.id).widget().opChecked("checked");
                    if ($scope.confirmOptValue === "approve" && $scope.selectedAz.azList.length === 0) {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", true);
                    } else {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                    }
                }
            };

            $scope.confirmDesc = {
                "label": i18n.common_term_approveAdvice_label + ":",
                "id": "confirmDesc",
                "type": "multi",
                "width": "644",
                "height": "60",
                "validate": "maxSize(1024): " + i18n.sprintf(i18n.common_term_smaller_valid, "1024") + " ;",
                "value": ""
            };

            $scope.initParam = function () {
                var params = $scope.orderDetailParams;
                var comments = $("#" + $scope.confirmDesc.id).widget().getValue();

                var options = {
                    "user": user,
                    "id": orderId,
                    "params": {
                        "action": $scope.confirmOptValue,
                        "params": JSON.stringify(params),
                        "comments": comments
                    }
                };

                return options;
            };

            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    var valid = UnifyValid.FormValid($("#" + id));
                    if (!valid) {
                        return;
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

            $scope.dealQueryOrderResponse = function (data) {
                $scope.description.value = data.comments;
                var params = JSON.parse(data.params);
                $scope.orderDetail = data;
                $scope.orderDetailParams = params;
                var quotaInfo = params.quotaList;
                $scope.cpu.value = getSpecQuota(quotaInfo, "CPU", "limit", 0);
                $scope.memory.value = getSpecQuota(quotaInfo, "MEMORY", "limit", 0);
                $scope.storage.value = getSpecQuota(quotaInfo, "STORAGE", "limit", 0);
                $scope.vpc.value = getSpecQuota(quotaInfo, "VPC", "limit", 0);
                $scope.ip.value = getSpecQuota(quotaInfo, "EIP", "limit", 0);
                $scope.group.value = getSpecQuota(quotaInfo, "SEG", "limit", 0);
                $scope.vm.value = getSpecQuota(quotaInfo, "VM", "limit", 0);

                $scope.old.cpu = getSpecQuota(quotaInfo, "CPU", "oldLimit", 0);
                $scope.old.memory = getSpecQuota(quotaInfo, "MEMORY", "oldLimit", 0);
                $scope.old.storage = getSpecQuota(quotaInfo, "STORAGE", "oldLimit", 0);
                $scope.old.vpc = getSpecQuota(quotaInfo, "VPC", "oldLimit", 0);
                $scope.old.ip = getSpecQuota(quotaInfo, "EIP", "oldLimit", 0);
                $scope.old.group = getSpecQuota(quotaInfo, "SEG", "oldLimit", 0);
                $scope.old.vm = getSpecQuota(quotaInfo, "VM", "oldLimit", 0);

                // 处理订单信息
                commonServiceIns.processOrderDetail(data);
                $scope.operateHistory = data.history;

                resourceId = params.vdcId;
                $scope.operate.queryVdcResourceSpec();
            };

            $scope.dealQuerySpecResponse = function (data) {
                var quotaInfo = data.vdcInfo.quotaInfo;
                $scope.vdcName.value = data.vdcInfo.name;
                $scope.vdcId.value = data.vdcInfo.id;
            };

            $scope.operate = {
                //审批订单
                "approvalOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.adminActionOrder(param);
                    deferred.then(function (data) {
                        $state.go("ssp.order.approval");
                    });
                },
                "queryOrder": function () {
                    var param = {
                        "user": user,
                        "orderId": orderId
                    };
                    var deferred = orderServiceImpl.queryOrder(param);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            return false;
                        }
                        $scope.dealQueryOrderResponse(data);
                    });
                },
                "queryVdcResourceSpec": function () {
                    var param = {
                        "user": user,
                        "id": resourceId
                    };
                    var deferred = vdcServiceImpl.queryVdcResourceSpec(param);
                    deferred.then(function (data) {
                        if (!data) {
                            return false;
                        }
                        $scope.dealQuerySpecResponse(data);
                    });
                },
                "actionOrder": function (param) {
                    var options = {
                        "id": orderId,
                        "user": user,
                        "params": param
                    };
                    var deferred = orderServiceImpl.userActionOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }
            };

            // 在quotas列表中，查找名称为name的配额值， 值存在字段key中，取不到返回defaultValue
            function getSpecQuota(quotas, name, key, defaultValue) {
                var value = defaultValue;
                var quota = {};
                if (quotas && quotas.length > 0 && name) {
                    quota = _.find(quotas, function (item) {
                        return item.name === name;
                    }) || {};
                    value = quota[key];
                }
                return value;
            }

            //初始化页面信息
            function init() {
                $scope.operate.queryOrder();
            }
            init();
        }
    ];
    return ctrl;
});
