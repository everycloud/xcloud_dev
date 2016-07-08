define(['sprintf',
    'language/keyID',
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    "app/services/messageService",
    'tiny-common/UnifyValid',
    'app/services/httpService',
    'app/services/validatorService',
    'app/services/commonService',
    'app/services/capacityService',
    'app/services/cloudInfraService',
    "app/business/ssp/services/order/orderService",
    'app/business/ssp/services/plugin/ecs/ecsService',
    'app/business/ssp/services/plugin/commonService',
    'tiny-directives/Select'
], function (sprintf,keyIDI18n,$, angular, _, messageService,UnifyValid, http, validatorService, timeCommonService, capacityService, cloudInfraService, orderService, ecsService, commonService) {
    "use strict";

    var sspModifyEcsCtrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception",
        function ($scope, $stateParams, $state, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            // 公共参数和服务
            var cloudInfra = {
                "id": $stateParams.cloudInfraId
            };
            var vpcId = $stateParams.vpcId;
            var vmId = $stateParams.resourceId;
            var orderId = $stateParams.orderId;
            var user = $scope.user;
            var ecsServiceIns = new ecsService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var commonServiceIns = new commonService(exception);
            var messageServiceIns = new messageService();
            var validator = new validatorService();

            $scope.action = $stateParams.action;
            $scope.from = $stateParams.from;
            $scope.vmDetail = {};
            $scope.orderDetail = {};
            $scope.supportModifyConfig = "";

            $scope.applyUser = {
                "label": i18n.common_term_applyBy_label + ":"
            };
            $scope.currApprover = {
                "label": i18n.common_term_currentProcessor_label + ":"
            };
            $scope.vmName = {
                "label": i18n.vm_term_vmName_label + ":",
                "labelWidth": 80,
                "labelCls": "height35"
            };
            $scope.vmId = {
                "label": i18n.common_term_vmID_label + ":"
            };
            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":"
            };
            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":"
            };
            $scope.disk = {
                "label": i18n.common_term_disks_label + ":"
            };

            // ICT修改规格
            $scope.oldConfig = {
                "label": i18n.common_term_currentSpec_label + ":",
                "detail": {}
            };
            $scope.newConfig = {
                "label": i18n.service_term_applySpecChange_label + ":",
                "detail": {},
                "values": []
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":"
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
                "id": "sspApprovalEcsChangeOK",
                "text": i18n.common_term_ok_button,
                "disable": false,
                "click": function () {
                    // 校验
                    if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                        return;
                    }

                    var orderDetail = $scope.orderDetail;
                    var orderParam = orderDetail.param || {};
                    var vmParams = {
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "vmId": vmId
                    };
                    if ($scope.supportModifyConfig === "true") { //ICT
                        vmParams.vmSpecId = orderParam.vmSpecId;
                        vmParams.oldVmSpecId = orderParam.oldVmSpecId;
                    } else {
                        if (orderParam.cpu) {
                            vmParams.cpu = {
                                count: orderParam.cpu.count,
                                oldCount: orderParam.cpu.oldCount
                            };
                        }
                        if (orderParam.memory) {
                            vmParams.memory = {
                                count: orderParam.memory.count,
                                oldCount: orderParam.memory.oldCount
                            };
                        }
                    }

                    var options = {
                        "user": user,
                        "id": orderDetail.orderId,
                        "params": {
                            "action": $("#" + $scope.approvalResult.id).widget().opChecked("checked"),
                            "comments": $("#" + $scope.approvalOpinion.id).widget().getValue(),
                            "params": JSON.stringify(vmParams)
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
                "id": "sspApprovalEcsChangeCancel",
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
                // 查询资源池详情
                "queryCloudInfra": function () {
                    if (!cloudInfra.id) {
                        return;
                    }

                    var retDefer = $.Deferred();
                    var deferred = cloudInfraServiceIns.queryCloudInfra(user.vdcId, user.id, cloudInfra.id);
                    deferred.then(function (data) {
                        if (!data || !data.cloudInfra) {
                            retDefer.reject();
                            return;
                        }
                        cloudInfra = data.cloudInfra;
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询支持的能力字段
                "queryCapacity": function () {
                    var capacity = capacityServiceIns.querySpecificCapacity($scope.capacities, cloudInfra.type, cloudInfra.version);
                    if (capacity) {
                        $scope.supportModifyConfig = capacity.vm_support_modify_config;
                    }
                },

                // 查询订单详情
                "queryOrderDetail": function () {
                    if (!$stateParams.orderId) {
                        return;
                    }
                    var retDefer = $q.defer();
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
                        $scope.orderDetail.param = JSON.parse(data.params);

                        // 这几个信息从订单中取
                        cloudInfra.id = $scope.orderDetail.param.cloudInfraId;
                        vpcId = $scope.orderDetail.param.vpcId;
                        vmId = $scope.orderDetail.param.vmId;
                        retDefer.resolve();
                    });
                    return retDefer.promise;
                },

                // 查询虚拟机详情
                "queryVmDetail": function () {
                    var retDefer = $.Deferred();
                    var defer = ecsServiceIns.queryVmDetail({
                        "user": user,
                        "vmId": vmId,
                        "vpcId": vpcId,
                        "cloudInfraId": cloudInfra.id
                    });
                    defer.then(function (data) {
                        if (!data || !data.vm) {
                            retDefer.reject();
                            return;
                        }
                        $scope.vmDetail = data.vm;
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询虚拟机规格模板列表
                "queryAllConfigs": function () {
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id
                    };
                    var deferred = ecsServiceIns.queryConfigTemplates(options);
                    deferred.then(function (data) {
                        if (!data || !data.vmFlavors) {
                            return;
                        }

                        if (data.vmFlavors.length > 0) {
                            _.each(data.vmFlavors, function (item) {
                                _.extend(item, {
                                    "diskTotalSize": item.systemDiskSize
                                });
                            });
                        }

                        $scope.newConfig.values = data.vmFlavors;
                        $scope.oldConfig.detail = getSpecConfig($scope.orderDetail.param.oldVmSpecId);
                        $scope.newConfig.detail = getSpecConfig($scope.orderDetail.param.vmSpecId);
                    });
                }
            };

            // 在规格列表中查找指定规格
            function getSpecConfig(configId) {
                var config = _.find($scope.newConfig.values, function (item) {
                    return configId === item.flavorId;
                });
                return config || {};
            }

            //获取初始数据
            function init() {
                var orderDefer = $scope.operate.queryOrderDetail();
                orderDefer.then(function () {
                    var defer = $scope.operate.queryCloudInfra();
                    defer.then(function () {
                        $scope.operate.queryCapacity();

                        var defer2 = $scope.operate.queryVmDetail();
                        if ($scope.supportModifyConfig === "true") {
                            $scope.operate.queryAllConfigs();
                        }
                    });
                });
            }

            //初始化
            init();
        }
    ];

    return sspModifyEcsCtrl;
});
