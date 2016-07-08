/**
 * 文件名：modifyVmSpecCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：修改虚拟机规格的control
 * 修改时间：14-4-23
 */
/* global define */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'tiny-lib/underscore',
    'tiny-common/UnifyValid',
    'app/services/httpService',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    'app/business/ecs/services/vm/queryVmService',
    'app/business/ecs/services/vm/updateVmService',
    "app/services/messageService",
    'tiny-directives/Select'
], function (sprintf, $, angular, ngSanitize, keyIDI18n, _, UnifyValid, http, validator, exception, capacityService, queryVmService, updateVmService, messageService) {
    "use strict";

    var modifyVmSpecCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            var htmlScope = $("html").scope();
            var user = htmlScope.user || {};
            var messageServiceIns = new messageService();

            // 公共参数和服务
            var winParam = $("#ecsVmsDetailSpecWinId").widget().option("winParam") || {};
            var cloudInfra = winParam.cloudInfra || {};
            var queryVmServiceIns = new queryVmService(exception, $q, camel);
            var updateVmServiceIns = new updateVmService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            $scope.supportModifyConfig = "";
            $scope.oldCpu = winParam.cpu;
            $scope.oldMemory = winParam.memory;
            $scope.oldConfigName = "";
            $scope.newCpu = 0;

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "id": "ecsVmsDetailSpecCpu",
                "width": "205",
                "height": "250",
                "class": "height27",
                "values": [],
                "validate": "required:" + i18n.common_term_null_valid + ";",
                "change": function () {
                    $scope.newCpu = parseInt($("#" + $scope.cpu.id).widget().getSelectedId(), 10);
                    updateQuota();
                }
            };

            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":",
                "label2": i18n.common_term_memory_label + ":",
                "width": "135",
                "idMB": "ecsVmsDetailSpecMemoryMB",
                "idGB": "ecsVmsDetailSpecMemoryGB",
                "valueMB": $scope.oldMemory,
                "valueGB": "",
                "extendFunction": ["memoryValid"],
                "validateMB": "integer:" + i18n.common_term_format_valid + ";memoryValid():" + i18n.sprintf(i18n.common_term_range_valid, 128, 1048576) + i18n.vm_term_quota_valid,
                "validateGB": "integer:" + i18n.common_term_format_valid + ";memoryValid():" + i18n.sprintf(i18n.common_term_range_valid, 1, 1024) + i18n.vm_term_quota_valid,
                "blur": function () {
                    updateQuota();
                }
            };

            $scope.disk = {
                "label": i18n.common_term_diskGB_label + ":"
            };

            $scope.tempDisk = {
                "label": i18n.template_term_tempDiskGB_label + ":"
            };
            $scope.swapSize = {
                "label": i18n.spec_term_exchangeDiskMB_label + ":"
            };

            $scope.memUnit = {
                "id": "ecsVmsDetailSpecMemUnit",
                "width": "65",
                "curValue": "MB",
                "values": [{
                    "label": "MB",
                    "selectId": "MB",
                    "checked": true
                }, {
                    "label": "GB",
                    "selectId": "GB"
                }],
                "change": function () {
                    $scope.memUnit.curValue = $("#" + $scope.memUnit.id).widget().getSelectedId();
                    updateQuota();
                }
            };

            // ICT修改规格
            $scope.newConfig = {
                "id": "ecsVmsDetailSpecNewConfig",
                "width": "200",
                "curValue": {},
                "values": [],
                "validate": "required:" + i18n.common_term_null_valid,
                "change": function () {
                    $scope.newConfig.curValue = getSpecConfig($("#" + $scope.newConfig.id).widget().getSelectedId());
                    updateQuota();

                    if ($scope.cpuQuotas.percent > 100 || $scope.memQuotas.percent > 100 || $scope.storageQuotas.percent > 100) {
                        $scope.okBtn.disable = true;
                    } else {
                        $scope.okBtn.disable = false;
                    }
                }
            };

            // 组织当前配额信息
            $scope.quota = {
                unlimited: false,
                "position": "right",
                "height": "15",
                "cpuTotal": 1,
                "cpuUsed": 0,
                "cpuFree": 1, //不包括当前虚拟机已使用的值
                "memTotal": 1,
                "memTotalView": 1,
                "memUsed": 0,
                "memFree": 1, //不包括当前虚拟机已使用的值
                "storageTotal": 1,
                "storageUsed": 0
            };

            $scope.cpuQuotas = {
                "id": "ecsVmsDetailSpecCpuQuota",
                "label": i18n.common_term_vcpuNum_label + ":",
                "percent": 0,
                "used": 0
            };

            $scope.memQuotas = {
                "id": "ecsVmsDetailSpecMemQuota",
                "label": i18n.common_term_memory_label + ":",
                "percent": 0,
                "used": 0
            };

            $scope.storageQuotas = {
                "id": "ecsVmsDetailSpecStorageQuota",
                "label": i18n.common_term_storagecCapacity_label + ":",
                "percent": 0,
                "used": 0
            };

            $scope.okBtn = {
                "id": "ecsVmDetailAddNicOK",
                "text": i18n.common_term_ok_button,
                "disable": false,
                "click": function () {
                    var area = $scope.supportModifyConfig === "true" ? "#ecsVmDetailSpecNewConfig" : "#ecsVmDetailSpecNewCpuMem";
                    if (!UnifyValid.FormValid($(area))) {
                        return;
                    }

                    var options = {
                        "vmId": winParam.vmId,
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": winParam.vpcId,
                        "user": user,
                        "spec": {
                            "cpu": {},
                            "memory": {}
                        }
                    };

                    if ($scope.supportModifyConfig === "true") {
                        options.spec.cpu.count = $scope.newConfig.curValue.cpuCount;
                        options.spec.memory.count = $scope.newConfig.curValue.memSize;
                        options.spec.vmSpecId = $scope.newConfig.curValue.flavorId;
                    } else {
                        options.spec.cpu.count = $scope.newCpu;
                        if ($scope.memUnit.curValue === "MB") {
                            options.spec.memory.count = $("#" + $scope.memory.idMB).widget().getValue();
                        } else {
                            options.spec.memory.count = $("#" + $scope.memory.idGB).widget().getValue() * 1024;
                        }
                    }

                    if ($scope.supportModifyConfig === "true") {
                        messageServiceIns.warnMsgBox({
                            "content": i18n.vm_vm_modifySpec_info_confirm_msg || "若虚拟机正在运行中，修改规格将关闭虚拟机。确实要修改虚拟机规格？",
                            "callback": function () {
                                var deferred = updateVmServiceIns.modifyVm(options);
                                deferred.then(function (data) {
                                    winParam.needRefresh = true;
                                    $("#ecsVmsDetailSpecWinId").widget().destroy();
                                });
                            }
                        });
                    } else {
                        var deferred = updateVmServiceIns.modifyVm(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsVmsDetailSpecWinId").widget().destroy();
                        });
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "ecsVmDetailAddNicCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailSpecWinId").widget().destroy();
                }
            };

            // 查询组织配额
            function queryOrgQuota() {
                var retDefer = $q.defer();
                var deferred = queryVmServiceIns.queryOrgQuota({
                    "vdcId": user.vdcId,
                    "userId": user.id
                });
                deferred.then(function (data) {
                    if (!data || !data.vdcInfo) {
                        retDefer.reject(data);
                        return;
                    }

                    var org = data.vdcInfo;
                    $scope.quota.unlimited = org.allQuota;
                    if (!org.allQuota) {
                        $scope.quota.cpuTotal = getSpecQuota(org.quotaInfo, "CPU", "limit", 1);
                        $scope.quota.cpuUsed = getSpecQuota(org.quotaUsage, "CPU", "value", 0);
                        $scope.quota.cpuFree = $scope.quota.cpuTotal - $scope.quota.cpuUsed - $scope.oldCpu;
                        $scope.quota.memTotal = getSpecQuota(org.quotaInfo, "MEMORY", "limit", 1) / 1024;
                        $scope.quota.memTotalView = Math.floor($scope.quota.memTotal);
                        $scope.quota.memUsed = getSpecQuota(org.quotaUsage, "MEMORY", "value", 0) / 1024;
                        $scope.quota.memFree = $scope.quota.memTotal - $scope.quota.memUsed - $scope.oldMemory / 1024;
                        $scope.quota.storageTotal = getSpecQuota(org.quotaInfo, "STORAGE", "limit", 1);
                        $scope.quota.storageUsed = getSpecQuota(org.quotaUsage, "STORAGE", "value", 0);
                        $scope.storageQuotas.percent = parseInt($scope.quota.storageUsed * 100 / $scope.quota.storageTotal, 10);
                    }
                    retDefer.resolve(data);
                });
                return retDefer.promise;
            }

            // 查询虚拟机规格模板信息
            function queryAllConfigs() {
                var retDefer = $q.defer();
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id
                };
                var deferred = queryVmServiceIns.queryConfigTemplates(options);
                deferred.then(function (data) {
                    if (!data || !data.vmFlavors) {
                        retDefer.reject(data);
                        return;
                    }
                    if (data.vmFlavors.length > 0) {
                        _.each(data.vmFlavors, function (item) {
                            _.extend(item, {
                                "diskTotalSize": item.systemDiskSize,
                                "selectId": item.flavorId,
                                "label": item.name
                            });
                        });
                        data.vmFlavors[0].checked = true;
                        $scope.newConfig.curValue = data.vmFlavors[0];
                    }

                    $scope.newConfig.values = data.vmFlavors;
                    $scope.oldConfigName = getSpecConfig(winParam.configId).name;
                    retDefer.resolve(data);
                });
                return retDefer.promise;
            }

            // 更新配额进度条
            function updateQuota() {
                if ($scope.quota.unlimited) {
                    return;
                }

                // IT
                if ($scope.supportModifyConfig === "false") {
                    if (isNaN($scope.newCpu) || !isMemoryValid()) {
                        return;
                    }
                    $scope.cpuQuotas.used = $scope.quota.cpuUsed + $scope.newCpu;
                    var memValue;
                    if ($("#" + $scope.memUnit.id).widget().getSelectedId() === "GB") {
                        memValue = parseInt($("#" + $scope.memory.idGB).widget().getValue(), 10);
                    } else {
                        memValue = parseInt($("#" + $scope.memory.idMB).widget().getValue() / 1024, 10);
                    }
                    $scope.memQuotas.used = $scope.quota.memUsed + memValue;
                    $scope.storageQuotas.used = $scope.quota.storageUsed;
                } else {
                    if (!$scope.cpuQuotas.unlimited) {
                        $scope.cpuQuotas.used = $scope.quota.cpuUsed + ($scope.newConfig.curValue.cpuCount || 0);
                        $scope.cpuQuotas.percent = ($scope.cpuQuotas.used * 100 / $scope.quota.cpuTotal).toFixed(2);
                    }
                    if (!$scope.memQuotas.unlimited) {
                        $scope.memQuotas.used = $scope.quota.memUsed + ($scope.newConfig.curValue.memSize || 0);
                        $scope.memQuotas.usedView = Math.floor($scope.memQuotas.used);
                        $scope.memQuotas.percent = ($scope.memQuotas.used * 100 / $scope.quota.memTotal).toFixed(2);
                    }

                    return;
                }
                $scope.memQuotas.usedView = Math.floor($scope.memQuotas.used);

                $scope.cpuQuotas.percent = parseInt($scope.cpuQuotas.used * 100 / $scope.quota.cpuTotal, 10);
                $scope.memQuotas.percent = parseInt($scope.memQuotas.used * 100 / $scope.quota.memTotal, 10);
                $scope.storageQuotas.percent = parseInt($scope.storageQuotas.used * 100 / $scope.quota.storageTotal, 10);
            }

            // 更新配额进度条
            function updateQuotaICT(data) {
                if (!data) {
                    return;
                }

                $scope.cpuQuotas.unlimited = data.vCPU.limit == -1 ? true : false;
                if (!$scope.cpuQuotas.unlimited) {
                    $scope.cpuQuotas.used = data.vCPU.inUse + ($scope.newConfig.curValue.cpuCount || 0);
                    $scope.quota.cpuUsed = data.vCPU.inUse;
                    $scope.cpuQuotas.cpuTotal = data.vCPU.limit;
                    $scope.quota.cpuTotal = $scope.cpuQuotas.cpuTotal;
                    $scope.cpuQuotas.percent = ($scope.cpuQuotas.used * 100 / $scope.cpuQuotas.cpuTotal).toFixed(2);
                }

                $scope.memQuotas.unlimited = data.memoryCapacity.limit == -1 ? true : false;
                if (!$scope.memQuotas.unlimited) {
                    $scope.memQuotas.used = data.memoryCapacity.inUse + ($scope.newConfig.curValue.memSize || 0);
                    $scope.quota.memUsed = data.memoryCapacity.inUse;
                    $scope.memQuotas.memTotal = data.memoryCapacity.limit;
                    $scope.quota.memTotal = $scope.memQuotas.memTotal;
                    $scope.memQuotas.percent = ($scope.memQuotas.used * 100 / $scope.memQuotas.memTotal).toFixed(2);
                    $scope.memQuotas.usedView = Math.floor($scope.memQuotas.used);
                }

                $scope.storageQuotas.percent = 0;
            }

            // 在quotas列表中，查找名称为name的配额值， 值存在字段key中，取不到返回defaultValue
            function getSpecQuota(quotas, name, key, defaultValue) {
                var value = defaultValue;
                var quota = {};
                if (quotas && quotas.length > 0 && name) {
                    quota = _.find(quotas, function (item) {
                        return item.quotaName === name;
                    });
                    value = quota[key];
                }
                return value;
            }

            // 在规格列表中查找指定规格
            function getSpecConfig(configId) {
                var config = _.find($scope.newConfig.values, function (item) {
                    return configId === item.flavorId;
                });
                return config || {};
            }

            // 初始化CPU的范围
            function initCpuRange() {
                var maxCpu = $scope.quota.unlimited ? 64 : Math.min($scope.quota.cpuFree, 64);
                var cpus = [];
                for (var i = 1; i <= maxCpu; i++) {
                    cpus.push({
                        "label": i,
                        "selectId": i
                    });
                }
                if (maxCpu >= $scope.oldCpu) {
                    $scope.newCpu = $scope.oldCpu;
                    cpus[$scope.oldCpu - 1].checked = true;
                } else if (maxCpu > 0) {
                    $scope.newCpu = 1;
                    cpus[0].checked = true;
                }

                $scope.cpu.values = cpus;
            }

            // 输入的内容是否合法
            function isMemoryValid() {
                var input, trans, max, min;
                if ($scope.memUnit.curValue === 'MB') {
                    input = $("#" + $scope.memory.idMB).widget().getValue();
                    min = 128;
                    max = 1048576;
                    trans = 1024;
                } else {
                    input = $("#" + $scope.memory.idGB).widget().getValue();
                    min = 1;
                    max = 1024;
                    trans = 1;
                }

                input = parseInt(input, 10);
                if (isNaN(input) || input < min || input > max) {
                    return false;
                }

                if (!$scope.quota.unlimited) {
                    input /= trans;
                    if (input > $scope.quota.memFree) {
                        return false;
                    }
                }

                return true;
            }

            UnifyValid.memoryValid = function () {
                return isMemoryValid();
            };

            // 查询支持的能力字段
            function queryCapacity() {
                var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, cloudInfra.type, cloudInfra.version);
                if (capacity) {
                    $scope.supportModifyConfig = capacity.vm_support_modify_config;
                }
            }

            function init() {
                queryCapacity();

                if ($scope.supportModifyConfig === "false") {
                    var defer = queryOrgQuota();
                    defer.then(function (data) {
                        // IT要计算CPU内存可输范围
                        initCpuRange();
                        updateQuota();
                    });
                } else {
                    var options = {
                        "cloudInfraId": cloudInfra.id,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": winParam.vpcId
                    };
                    // ICT场景需要查规格列表
                    var configDefer = queryAllConfigs();
                    configDefer.then(function (data) {
                        var promise = updateVmServiceIns.queryVpcQuota(options);
                        promise.then(function (vpcQuota) {
                            if (!vpcQuota) {
                                return;
                            }

                            updateQuotaICT(vpcQuota);
                        });
                    });
                }
            }

            //获取初始数据
            init();
        }
    ];

    var modifyVmSpecModule = angular.module("ecs.vm.detail.modify.spec", ['ng', 'wcc', "ngSanitize"]);
    modifyVmSpecModule.controller("ecs.vm.detail.modify.spec.ctrl", modifyVmSpecCtrl);
    modifyVmSpecModule.service("camel", http);
    modifyVmSpecModule.service("validator", validator);
    modifyVmSpecModule.service("exception", exception);

    return modifyVmSpecModule;
});
