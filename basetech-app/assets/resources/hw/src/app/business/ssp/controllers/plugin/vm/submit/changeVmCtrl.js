/**
 * 文件名：changeEcsCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：变更云主机的control
 * 修改时间：14-4-23
 */
/* global define */
define(["sprintf",
    "language/keyID",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    'tiny-common/UnifyValid',
    'app/services/httpService',
    "app/services/tipMessageService",
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    'app/services/cloudInfraService',
    "app/business/ssp/services/order/orderService",
    'app/business/ssp/services/plugin/ecs/ecsService',
    'tiny-directives/Select'
], function (sprintf,keyIDI18n,$, angular, _, UnifyValid, http,tipMessageService, validator, exception, capacityService, cloudInfraService, orderService, ecsService) {
    "use strict";

    // 自定义CPU框
    $.fn.userDefCpuChangeVm = function (cpu, unit) {
        var dom = this;
        this.bind("click", function (evt) {
            evt.stopPropagation();
            if (dom.find("input").length > 0) {
                return;
            }

            var oldValue = cpu.userDef ? cpu.value : "";
            var input = $("<input type='text' value='" + oldValue + "'>");
            input.css({
                "width": dom.css("width"),
                "height": dom.css("height")
            });

            var confirmInput = function () {
                var value = input.val();
                var reg = /^([1-9]|[1-5]\d|6[0-4])$/;
                if (!reg.test(value)) {
                    $(".createvm-cpu .input-tip").css("display", "inline-block");
                    return;
                }
                $(".createvm-cpu .input-tip").css("display", "none");

                dom.html(value + unit);
                cpu.value = value;
                cpu.userDef = true;
            };

            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    confirmInput();
                }
            });
            input.bind("blur", function () {
                confirmInput();
            });
            dom.html(input);
            input.focus();
        });
        return this;
    };

    // 自定义内存框
    $.fn.userDefMemChangeVm = function (memory) {
        var dom = this;
        this.bind("click", function (evt) {
            evt.stopPropagation();
            if (dom.find("input").length > 0) {
                return;
            }

            var oldValue = memory.userDef ? Math.ceil(memory.value / 1024) : "";
            var input = $("<input type='text' value='" + oldValue + "'>");
            input.css({
                "width": dom.css("width"),
                "height": dom.css("height")
            });

            var confirmInput = function () {
                var value = input.val();
                var reg = /^([1-9]|[1-9]\d|[1-9]\d\d|10[0-1]\d|102[0-4])$/;
                if (!reg.test(value)) {
                    $(".createvm-memory .input-tip").css("display", "inline-block");
                    return;
                }
                $(".createvm-memory .input-tip").css("display", "none");

                dom.html(value + "G");
                memory.value = value * 1024;
                memory.userDef = true;
            };

            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    confirmInput();
                }
            });
            input.bind("blur", function () {
                confirmInput();
            });
            dom.html(input);
            input.focus();
        });
        return this;
    };

    var sspModifyEcsCtrl = ["$scope", "$stateParams", "$state", "$q", "camel", "exception",
        function ($scope, $stateParams, $state, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            // 公共参数和服务
            var action = $stateParams.action;
            var cloudInfra = {
                "id": $stateParams.cloudInfraId
            };
            var vpcId = $stateParams.vpcId;
            var vmId = $stateParams.resourceId;
            var user = $scope.user;
            var ecsServiceIns = new ecsService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var validate = new validator();
            var tipMessage = new tipMessageService();

            $scope.vmDetail = {};
            $scope.orderDetail = {};
            $scope.supportModifyConfig = "";

            $scope.vmName = {
                "label": i18n.vm_term_vmName_label + ":",
                "labelWidth": 80
            };
            $scope.vmId = {
                "label": i18n.common_term_vmID_label + ":"
            };
            $scope.oldConfig = {
                "label": i18n.common_term_currentSpec_label + ":",
                "detail": {}
            };

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "class": "height27",
                "value": 1,
                "userDef": false
            };

            $scope.memory = {
                "label": i18n.common_term_memory_label + ":",
                "labelMB": i18n.common_term_memory_label + "(MB):",
                "value": 512,
                "userDef": false
            };

            $scope.disk = {
                "label": i18n.common_term_disk_label + "(GB):"
            };

            // ICT修改规格
            $scope.newConfig = {
                "label": i18n.service_term_applySpecChange_label + ":",
                "id": "sspModifyEcsNewConfigSelect",
                "width": "200",
                "height": "210",
                "detail": {},
                "values": [],
                "validate": "required:" + i18n.common_term_null_valid + ";",
                "change": function () {
                    $scope.newConfig.detail = getSpecConfig($("#" + $scope.newConfig.id).widget().getSelectedId());
                }
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspModifyEcsRemark",
                "value": "",
                "type": "multi",
                "width": "276",
                "height": "70",
                "validate": "regularCheck(" + validate.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "sspModifyEcsOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    // 如果虚拟机已经不存在，就不能再变更了
                    if (!$scope.vmDetail.id) {
                        tipMessage.alert("error", i18n.service_service_changeVM_info_failByQuery_msg);
                        return;
                    }

                    // 校验
                    var area = $scope.supportModifyConfig === "true" ? "#sspModifyEcsNewConfig" : "#sspModifyEcsNewCpuMem";
                    if (!UnifyValid.FormValid($(area))) {
                        return;
                    }
                    if (!UnifyValid.FormValid($("#" + $scope.remark.id))) {
                        return;
                    }

                    var params = {
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "vmId": vmId
                    };

                    var spec = $scope.vmDetail.vmSpecInfo || {};
                    if ($scope.supportModifyConfig === "true") { //ICT
                        params.vmSpecId = $scope.newConfig.detail.flavorId;
                        params.oldVmSpecId = spec.id;
                    } else {
                        params.cpu = {
                            count: $scope.cpu.value,
                            oldCount: spec.cpuRebootCount
                        };
                        params.memory = {
                            count: $scope.memory.value,
                            oldCount: spec.memoryRebootCount
                        };
                    }

                    var options;
                    var deferred;
                    var comments = $("#" + $scope.remark.id).widget().getValue();

                    if (action === "edit") { // 修改订单
                        options = {
                            "user": user,
                            "id": $stateParams.orderId,
                            "params": {
                                "params": JSON.stringify(params),
                                "comments": comments
                            }
                        };
                        deferred = orderServiceIns.modifyOrder(options);
                    } else { // 申请订单
                        options = {
                            "user": user,
                            "params": {
                                "modify": {
                                    "resourceId": $stateParams.id,
                                    "params": JSON.stringify(params)
                                },
                                "comments": comments
                            }
                        };
                        deferred = orderServiceIns.createOrder(options);
                    }

                    deferred.then(function (data) {
                        if (data && data.orderId) {
                            tipMessage.sspAlert(data.orderId, function(){
                                $state.go("ssp.approvalVmChange", {
                                    "orderId" : data.orderId,
                                    "action" : "view"
                                });
                            });
                        }
                        $state.go("ssp.order.apply");
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "sspModifyEcsCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            };

            $scope.operate = {
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
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
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
                    if (action !== "edit") {
                        return {};
                    }
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
                        $scope.orderDetail = data;
                        $scope.orderDetail.param = JSON.parse(data.params);

                        // 修改时，这几个id从订单中获取
                        cloudInfra.id = $scope.orderDetail.param.cloudInfraId;
                        vpcId = $scope.orderDetail.param.vpcId;
                        vmId = $scope.orderDetail.param.vmId;
                        retDefer.resolve();
                    });
                    return retDefer.promise();
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
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id
                    };
                    var deferred = ecsServiceIns.queryConfigTemplates(options);
                    deferred.then(function (data) {
                        if (!data || !data.vmFlavors) {
                            retDefer.reject(data);
                            return;
                        }
                        var availableFlavors = [];
                        var currentVmConfig = _.find(data.vmFlavors, function (item) {
                            return item.flavorId === $scope.vmDetail.vmSpecInfo.id;
                        });
                        if (data.vmFlavors.length > 0) {
                            _.each(data.vmFlavors, function (item) {
                                if(item.systemDiskSize >= currentVmConfig.systemDiskSize){
                                    _.extend(item, {
                                        "diskTotalSize": item.systemDiskSize,
                                        "selectId": item.flavorId,
                                        "label": item.name
                                    });
                                    availableFlavors.push(item);
                                }
                            });

                            var curConfig;
                            if (action === "edit") {
                                curConfig = _.find(data.vmFlavors, function (item) {
                                    return item.flavorId === $scope.orderDetail.param.vmSpecId;
                                });
                            }
                            if (!curConfig) {
                                curConfig = availableFlavors[0];
                            }

                            curConfig.checked = true;
                            $scope.newConfig.detail = curConfig;
                        }

                        $scope.newConfig.values = availableFlavors;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise();
                }
            };

            // 在规格列表中查找指定规格
            function getSpecConfig(configId) {
                var config = _.find($scope.newConfig.values, function (item) {
                    return configId === item.flavorId;
                });
                return config || {};
            }

            // 初始化CPU、内存颜色块事件
            function initCpuMemAnimal() {
                $(".createvm-cpu div.cpu-options").bind("click", function (evt) {
                    if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                        $(".createvm-cpu .cpu-options[self-defined]").html(i18n.common_term_custom_label);
                        $(".createvm-cpu .input-tip").css("display", "none");
                        $scope.cpu.value = $(evt.currentTarget).data("value");
                        $scope.cpu.userDef = false;
                    }
                    $(".createvm-cpu div.cpu-options").removeClass("selected");
                    $(evt.currentTarget).addClass("selected");
                });

                $(".createvm-memory div.memory-options").bind("click", function (evt) {
                    if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                        $(".createvm-memory .memory-options[self-defined]").html(i18n.common_term_custom_label);
                        $(".createvm-memory .input-tip").css("display", "none");
                        $scope.memory.value = $(evt.currentTarget).data("value");
                        $scope.memory.userDef = false;
                    }
                    $(".createvm-memory div.memory-options").removeClass("selected");
                    $(evt.currentTarget).addClass("selected");
                });
            }

            // 根据订单详情，初始化自定义规格页面
            function initUserDefSpecByOrderDetail() {
                if (action === "apply") {
                    return;
                }

                var orderParam = $scope.orderDetail.param;
                if (orderParam.cpu) {
                    var cpu = orderParam.cpu.count;
                    var cpuDom = $(".createvm-cpu .cpu-options[data-value=" + cpu + "]");
                    if (cpuDom.length > 0) {
                        cpuDom.trigger("click");
                    } else {
                        cpuDom = $(".createvm-cpu .cpu-options[self-defined]");
                        cpuDom.html(cpu + i18n.common_term_core_label);
                        $(".createvm-cpu div.cpu-options").removeClass("selected");
                        cpuDom.addClass("selected");
                        $scope.cpu.value = cpu;
                        $scope.cpu.userDef = true;
                    }
                }

                if (orderParam.memory) {
                    var mem = orderParam.memory.count;
                    var memDom = $(".createvm-memory .memory-options[data-value=" + mem + "]");
                    if (memDom.length > 0) {
                        memDom.trigger("click");
                    } else {
                        memDom = $(".createvm-memory .memory-options[self-defined]");
                        memDom.html(mem / 1024 + "G");
                        $(".createvm-memory div.memory-options").removeClass("selected");
                        memDom.addClass("selected");
                        $scope.memory.value = mem;
                        $scope.memory.userDef = true;
                    }
                }
            }

            //获取初始数据
            function init() {
                var orderDefer = $scope.operate.queryOrderDetail();
                $.when(orderDefer).done(function () {
                    var defer = $scope.operate.queryCloudInfra();
                    defer.then(function () {
                        $scope.operate.queryCapacity();

                        var defer2 = $scope.operate.queryVmDetail();
                        if ($scope.supportModifyConfig === "true") {
                            defer2.then(function(){
                                var defer3 = $scope.operate.queryAllConfigs();
                                defer3.then(function(){
                                    if ($scope.vmDetail.vmSpecInfo) {
                                        $scope.oldConfig.detail = getSpecConfig($scope.vmDetail.vmSpecInfo.id);
                                    }
                                });
                            });
                        } else {
                            setTimeout(function(){
                                initCpuMemAnimal();
                                $(".createvm-cpu .cpu-options[self-defined]").userDefCpuChangeVm($scope.cpu, i18n.common_term_core_label);
                                $(".createvm-memory .memory-options[self-defined]").userDefMemChangeVm($scope.memory);

                                initUserDefSpecByOrderDetail();
                            }, 20);
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
