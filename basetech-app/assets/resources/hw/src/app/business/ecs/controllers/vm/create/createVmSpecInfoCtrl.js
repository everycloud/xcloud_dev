/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：13-12-28
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        'tiny-common/UnifyValid',
        'app/business/ecs/services/vm/queryVmService',
        'bootstrap/bootstrap.min'
    ],
    function ($, angular, _, UnifyValid, queryVmService) {
        "use strict";

        $.fn.editCpu = function (userDef, scope, fn, unit) {
            var dom = this;
            this.bind("click", function (evt) {
                evt.stopPropagation();
                if (dom.find("input").length > 0) {
                    return;
                }

                var oldValue = userDef.cpuInput ? userDef.cpu : "";
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
                    userDef.cpu = value;
                    userDef.cpuInput = true;

                    scope.$apply(function () {
                        fn();
                    });
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

        $.fn.editMem = function (userDef, scope, fn) {
            var dom = this;
            this.bind("click", function (evt) {
                evt.stopPropagation();
                if (dom.find("input").length > 0) {
                    return;
                }

                var oldValue = userDef.memInput ? Math.ceil(userDef.mem / 1024) : "";
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
                    userDef.mem = value * 1024;
                    userDef.memInput = true;

                    scope.$apply(function () {
                        fn();
                    });
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

        var createVmSpecInfoCtrl = ["$scope", "$window", "$q", "$compile", "exception", "camel",
            function ($scope, $window, $q, $compile, exception, camel) {
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                //本地存储1、共享存储2
                var LOCAL_STORAGE_TYPE = "1";
                var SHARED_STORAGE_TYPE = "2";
                var user = $scope.user;
                var isICT = user.cloudType === "ICT";
                $scope.isICT = isICT;
                var i18n = $scope.i18n;
                //选择存储类型
                $scope.storageType = {
                    "id": "ecsVmCreateStorageTypeId",
                    "checked": false,
                    "text": i18n.vm_vm_create_para_useLocalStor_label,
                    "description": i18n.vm_vm_create_para_stor_label
                };
                //创建虚拟机第二步，配置信息
                $scope.specInfo = {
                    userDefConfig: {
                        "cpu": 1,
                        "mem": 512,
                        "cpuInput": false, //是否是用户输入的CPU
                        "memInput": false //是否是用户输入的CPU
                    },

                    configTem: {
                        "id": "ecsVmCreateConfigTemplateId",
                        "label": i18n.common_term_name_label + ":",
                        "width": "250",
                        "height":"200",
                        "values": [],
                        "detail": undefined,
                        "validate": "required:" + i18n.common_term_null_valid,
                        "change": function () {
                            onChangeConfigTem($("#" + $scope.specInfo.configTem.id).widget().getSelectedId());
                        }
                    },

                    cpuNum: {
                        "label": i18n.common_term_cpu_label + ":"
                    },
                    memory: {
                        "label": i18n.common_term_memory_label + ":"
                    },
                    disk: {
                        "label": i18n.common_term_disk_label + ":"
                    },
                    tempDisk: {
                        "label": i18n.template_term_tempDiskGB_label + ":"
                    },
                    swapSize: {
                        "label": i18n.spec_term_exchangeDiskMB_label + ":"
                    },
                    startupMode: {
                        "label": i18n.common_term_startupSource_label + ":"
                    },

                    vmNum: {
                        "label": i18n.vm_term_vmNum_label + ":",
                        "require": true,
                        "id": "ecsVmCreateVmNumId",
                        "validate": "positiveInteger:" + i18n.common_term_PositiveIntegers_valid + ";maxVmNumValidate():" + i18n.common_term_smallerThanMax_valid,
                        "extendFunction": ["positiveInteger","maxVmNumValidate"],
                        "width": "150",
                        "value": "1",
                        "blur": function () {
                            if (!UnifyValid.FormValid($("#" + $scope.specInfo.vmNum.id))) {
                                return;
                            }
                            updateQuota();
                        },
                        "keypressfn": function (event) {
                            if (event.keyCode === 13) {
                                if (!UnifyValid.FormValid($("#" + $scope.specInfo.vmNum.id))) {
                                    return;
                                }
                                updateQuota();
                            }
                        }
                    },

                    sla: {
                        "values": [],
                        "detail": {},
                        "colors": ["#6cbfe8", "#39a8e0", "#1e8ac0", "#16658d", "#0e405a"]
                    },

                    // 组织当前配额信息
                    quota: {
                        "unlimited": false,
                        "position": "right",
                        "height": "15",
                        "class": "height35",
                        "cpuTotal": 1,
                        "cpuUsed": 0,
                        "cpuFree": 1,
                        "memTotal": 1,
                        "memTotalView": 1,
                        "memUsed": 0,
                        "memFree": 1,
                        "storageTotal": 1,
                        "storageUsed": 0,
                        "storageFree": 1,
                        "vmTotal": 1,
                        "vmUsed": 0,
                        "vmFree": 1
                    },

                    cpuQuotas: {
                        "id": "ecsVmCreateVmCpuQuota",
                        "label": i18n.common_term_vcpuNum_label + ":",
                        "percent": 0,
                        "used": 0
                    },

                    memQuotas: {
                        "id": "ecsVmCreateVmMemQuota",
                        "label": i18n.common_term_memory_label + ":",
                        "percent": 0,
                        "used": 0,
                        "usedView": 0
                    },

                    storageQuotas: {
                        "id": "ecsVmCreateVmStorageQuota",
                        "label": i18n.common_term_storagecCapacity_label + ":",
                        "percent": 0,
                        "used": 0
                    },
                    configType : {
                        "label": $scope.i18n.common_term_formatDiskMode_label + ":",
                        "id": "ecsVmCreateVmConfigType",
                        "width": "150",
                        "values": [
                            {
                                "selectId": "thick",
                                "label": $scope.i18n.common_term_formatFull_label,
                                "checked": true
                            },
                            {
                                "selectId": "thickformat",
                                "label": $scope.i18n.common_term_formatDelay_label
                            },
                            {
                                "selectId": "thin",
                                "label": $scope.i18n.common_term_formatQuick_label
                            }
                        ]
                    },
                    vmNumQuotas: {
                        "id": "ecsVmCreateVmVmNumQuota",
                        "label": i18n.vm_term_vmNum_label + ":",
                        "percent": 0,
                        "used": 0
                    },

                    preBtn: {
                        "id": "ecsVmCreateVmSpecPreBtn",
                        "text": i18n.common_term_back_button,
                        "tooltip": "",
                        "click": function () {
                            $scope.service.show = "selTemp";
                            $("#ecsVmCreateStep").widget().pre();
                        }
                    },
                    nextBtn: {
                        "id": "ecsVmCreateVmSpecNextBtn",
                        "text": i18n.common_term_next_button,
                        "tooltip": "",
                        "click": function () {
                            if (!UnifyValid.FormValid($("#" + $scope.specInfo.vmNum.id))) {
                                return;
                            }
                            // 校验
                            if ($scope.service.configType === "system") {
                                if (!UnifyValid.FormValid($("#ecsVmSysConfig"))) {
                                    return;
                                }
                            } else {
                                if ($(".createvm-cpu .cpu-options[self-defined] input").length > 0 || $(".createvm-memory .memory-options[self-defined] input").length > 0) {
                                    return;
                                }
                            }
                            var vmNum = parseInt($("#" + $scope.specInfo.vmNum.id).widget().getValue(), 10);
                            if(!$scope.ICT){
                                $scope.service.diskConfigType = $("#" + $scope.specInfo.configType.id).widget().getSelectedId();
                            }

                            // 保存本页输入信息
                            $scope.service.sla = $scope.specInfo.sla.detail;
                            $scope.service.configTemplate = $scope.specInfo.configTem.detail;
                            $scope.service.cpuNum = $scope.specInfo.userDefConfig.cpu;
                            $scope.service.memory = $scope.specInfo.userDefConfig.mem;
                            $scope.service.vmNum = vmNum;
                            $scope.service.dataType = SHARED_STORAGE_TYPE;
                            if ($scope.service.vm_support_user_define_config === true + "") {
                                if ($("#" + $scope.storageType.id).widget().option("checked")) {
                                    $scope.service.dataType = LOCAL_STORAGE_TYPE;
                                }
                            }
                            // 跳到下一步
                            $scope.$emit($scope.events.specInfoNext);
                            $scope.service.show = "selNetwork";
                            $("#ecsVmCreateStep").widget().next();
                        }
                    },
                    cancelBtn: {
                        "id": "ecsVmCreateVmSpecCancelBtn",
                        "text": i18n.common_term_cancle_button,
                        "tooltip": "",
                        "click": function () {
                            setTimeout(function () {
                                $window.history.back();
                            }, 0);
                        }
                    }
                };

                // 查询SLA颜色块的背景色
                $scope.getSlaStyle = function (index) {
                    return {
                        "background-color": $scope.specInfo.sla.colors[index % 5]
                    };
                };

                // 切换是系统规格还是用户自定义规格
                $scope.changeConfigType = function (type) {
                    $scope.service.configType = type;
                    updateQuota();
                };

                // 最大可创vm数校验
                UnifyValid.maxVmNumValidate = function () {
                    var input = $(this).val();
                    if ($.trim(input) === "") {
                        return false;
                    }
                    if(parseInt(input, 10) > $scope.specInfo.vmNum.max){
                        return false;
                    }
                    return true;
                };

                // 最大可创vm数校验
                UnifyValid.positiveInteger = function () {
                    var value = $(this).val();
                    var f = parseFloat(value);

                    if(!isNaN(f) && f.toString() === value && Math.round(f) === f){
                        return f > 0;
                    }
                    return false;
                };

                // 查询SLA信息
                function querySLAs() {
                    var options = {
                        "user": $scope.user,
                        "name": "SLA"
                    };
                    var deferred = queryVmServiceIns.querySlaTags(options);
                    deferred.then(function (data) {
                        if (!data || !data.tags) {
                            return;
                        }
                        $scope.specInfo.sla.values = data.tags;
                        $scope.specInfo.sla.detail = {};
                    });
                }

                // 查询虚拟机规格模板信息
                function queryConfigTemplates() {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": $scope.user,
                        "cloudInfraId": $scope.service.cloudInfra.id
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
                                    "diskTotalSize": $scope.service.getDiskTotalSize(item.disks, "diskSize"),
                                    "userDiskSize": $scope.service.getDiskTotalSize(item.disks, "diskSize", true),
                                    "selectId": item.flavorId,
                                    "extBootTypeUI": getExtBootTypeUI(item.extBootType),
                                    "label": item.name
                                });
                                if (item.systemDiskSize) {
                                    item.diskTotalSize += item.systemDiskSize;
                                }
                            });
                            data.vmFlavors[0].checked = true;
                        }

                        if ($scope.user.cloudType === "ICT") {
                            for (var i = 0; i < data.vmFlavors.length; i++) {
                                var obj = data.vmFlavors[i];

                                if (obj.memSize < $scope.service.selMinRam || obj.systemDiskSize < $scope.service.selMinDisk) {
                                    data.vmFlavors.splice(i, 1);
                                    i--;
                                }
                            }

                            if (data.vmFlavors[0]) {
                                data.vmFlavors[0].checked = true;
                            }
                        }

                        $scope.specInfo.configTem.values = data.vmFlavors;
                        $scope.specInfo.configTem.detail = data.vmFlavors[0] || {};
                        retDefer.resolve(data);
                    });
                    return retDefer.promise();
                }

                //获取启动类型
                function getExtBootTypeUI(extBootType) {
                    if(extBootType === "LocalDisk") {
                        return i18n.template_term_startFromImage_label;
                    }
                    else if(extBootType === "Volume") {
                        return i18n.template_term_startFromCloudHarddisk_label;
                    }
                    else {
                        return i18n.common_term_unknown_value;
                    }
                }
                //查询模板详情
                function queryVmTemplateDetail() {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": $scope.user,
                        "templateId": $scope.service.selTemplateId,
                        "cloudInfraId": $scope.service.cloudInfraId
                    };

                    var deferred = queryVmServiceIns.queryVmTemplateDetail(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }

                        var os = data.osOption || {};
                        $scope.service.selTemplate = {
                            "vmtId": $scope.service.selTemplateId,
                            "vmtName": data.name,
                            "osType": os.osType,
                            "osVersion": os.osVersion,
                            "azId": data.availableZoneId,
                            "cpuInfo":data.cpuInfo,
                            "memoryInfo":data.memoryInfo,
                            "templateDisks":data.diskdetail,
                            "disk": []
                        };
                        if (data.diskdetail && data.diskdetail.length > 0) {
                            _.each(data.diskdetail, function (item) {
                                $scope.service.selTemplate.disk.push({
                                    "capacity": item.quantity
                                });
                            });
                        }
                        $scope.service.selTemplate.diskTotalSize = $scope.service.getDiskTotalSize($scope.service.selTemplate.disk, "capacity");
                        retDefer.resolve(data);
                    });
                    return retDefer.promise();
                }

                // 查询组织配额
                function queryOrgQuota() {
                    //ICT不支持查询配额
                    if ($scope.service.vm_support_user_define_config === "false") {
                        $scope.specInfo.quota.unlimited = true;
                        updateQuota();
                        return;
                    }
                    var deferred = queryVmServiceIns.queryOrgQuota({
                        "vdcId": $scope.user.vdcId,
                        "userId": $scope.user.id
                    });
                    deferred.then(function (data) {
                        if (!data || !data.vdcInfo) {
                            return;
                        }

                        $scope.specInfo.quota.unlimited = data.vdcInfo.allQuota;
                        if (!data.vdcInfo.allQuota) {
                            $scope.specInfo.quota.cpuTotal = getSpecQuota(data.vdcInfo.quotaInfo, "CPU", "limit", 1);
                            $scope.specInfo.quota.cpuUsed = getSpecQuota(data.vdcInfo.quotaUsage, "CPU", "value", 0);
                            $scope.specInfo.quota.cpuFree = $scope.specInfo.quota.cpuTotal - $scope.specInfo.quota.cpuUsed;
                            $scope.specInfo.quota.memTotal = getSpecQuota(data.vdcInfo.quotaInfo, "MEMORY", "limit", 1) / 1024;
                            $scope.specInfo.quota.memTotalView = Math.floor($scope.specInfo.quota.memTotal);
                            $scope.specInfo.quota.memUsed = getSpecQuota(data.vdcInfo.quotaUsage, "MEMORY", "value", 0) / 1024;
                            $scope.specInfo.quota.memFree = $scope.specInfo.quota.memTotal - $scope.specInfo.quota.memUsed;
                            $scope.specInfo.quota.storageTotal = getSpecQuota(data.vdcInfo.quotaInfo, "STORAGE", "limit", 1);
                            $scope.specInfo.quota.storageUsed = getSpecQuota(data.vdcInfo.quotaUsage, "STORAGE", "value", 0);
                            $scope.specInfo.quota.storageFree = $scope.specInfo.quota.storageTotal - $scope.specInfo.quota.storageUsed;
                            $scope.specInfo.quota.vmTotal = getSpecQuota(data.vdcInfo.quotaInfo, "VM", "limit", 1);
                            $scope.specInfo.quota.vmUsed = getSpecQuota(data.vdcInfo.quotaUsage, "VM", "value", 0);
                            $scope.specInfo.quota.vmFree = $scope.specInfo.quota.vmTotal - $scope.specInfo.quota.vmUsed;
                        }
                        updateQuota();
                    });
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

                // 更新当前要显示的配额。IT场景每个虚拟机的磁盘是模板的磁盘+规格的磁盘。ICT场景每个虚拟机的磁盘只有规格的磁盘。
                function updateQuota() {
                    calcVmNum();

                    var quota = $scope.specInfo.quota;
                    if (quota.unlimited) {
                        return;
                    }
                    var vmNum = $("#" + $scope.specInfo.vmNum.id).widget().getValue();
                    try{
                        vmNum = parseInt(vmNum,10);
                    }
                    catch(e){
                        vmNum = 1;
                    }
                    if ($scope.service.configType === "system") {
                        var detail = $scope.specInfo.configTem.detail;
                        if (!detail || !detail.cpuCount) {
                            $scope.specInfo.cpuQuotas.used = quota.cpuUsed;
                            $scope.specInfo.memQuotas.used = quota.memUsed;
                            $scope.specInfo.storageQuotas.used = quota.storageUsed;
                            $scope.specInfo.vmNumQuotas.used = quota.vmUsed;
                        } else {
                            $scope.specInfo.cpuQuotas.used = quota.cpuUsed + detail.cpuCount * vmNum;
                            $scope.specInfo.memQuotas.used = Math.floor(quota.memUsed + detail.memSize * vmNum / 1024);
                            var vmDiskSize = $scope.service.vm_support_user_define_config === "true" ? (detail.userDiskSize + $scope.service.selTemplate.diskTotalSize) : detail.diskTotalSize;
                            $scope.specInfo.storageQuotas.used = quota.storageUsed + vmDiskSize * vmNum;
                            $scope.specInfo.vmNumQuotas.used = quota.vmUsed + vmNum;
                        }
                    } else {
                        var userConfig = $scope.specInfo.userDefConfig;
                        $scope.specInfo.cpuQuotas.used = quota.cpuUsed + userConfig.cpu * vmNum;
                        $scope.specInfo.memQuotas.used = quota.memUsed + Math.floor(userConfig.mem * vmNum / 1024);
                        $scope.specInfo.storageQuotas.used = quota.storageUsed + $scope.service.selTemplate.diskTotalSize * vmNum;
                        $scope.specInfo.vmNumQuotas.used = quota.vmUsed + vmNum;
                    }
                    $scope.specInfo.memQuotas.usedView = Math.floor($scope.specInfo.memQuotas.used);

                    $scope.specInfo.cpuQuotas.percent = (quota.cpuTotal === 0 || $scope.specInfo.cpuQuotas.used > quota.cpuTotal) ?
                        100 : Math.floor($scope.specInfo.cpuQuotas.used * 100 / quota.cpuTotal);
                    $("#" + $scope.specInfo.cpuQuotas.id).widget().option("value", $scope.specInfo.cpuQuotas.percent);
                    $scope.specInfo.memQuotas.percent = (quota.memTotal === 0 || $scope.specInfo.memQuotas.used > quota.memTotal) ?
                        100 : Math.floor($scope.specInfo.memQuotas.used * 100 / quota.memTotal);
                    $("#" + $scope.specInfo.memQuotas.id).widget().option("value", $scope.specInfo.memQuotas.percent);
                    $scope.specInfo.storageQuotas.percent = (quota.storageTotal === 0 || $scope.specInfo.storageQuotas.used>quota.storageTotal) ?
                        100 : Math.floor($scope.specInfo.storageQuotas.used * 100 / quota.storageTotal);
                    $("#" + $scope.specInfo.storageQuotas.id).widget().option("value", $scope.specInfo.storageQuotas.percent);
                    $scope.specInfo.vmNumQuotas.percent = (quota.vmTotal === 0 || $scope.specInfo.vmNumQuotas.used > quota.vmTotal) ?
                        100 : Math.floor($scope.specInfo.vmNumQuotas.used * 100 / quota.vmTotal);
                    $("#" + $scope.specInfo.vmNumQuotas.id).widget().option("value", $scope.specInfo.vmNumQuotas.percent);
                }

                // 计算最大可创建的虚拟机个数。IT场景每个虚拟机的磁盘是模板的磁盘+规格的磁盘。ICT场景每个虚拟机的磁盘只有规格的磁盘。
                function calcVmNum() {
                    var quota = $scope.specInfo.quota;
                    if (quota.unlimited) {
                        $scope.specInfo.vmNum.max = 30;
                        return;
                    }

                    var maxByCpu, maxByMem, maxByStorage;
                    if ($scope.service.configType === "system") {
                        var detail = $scope.specInfo.configTem.detail;
                        if (!detail || !detail.cpuCount) {
                            $scope.specInfo.vmNum.max = 30;
                            return;
                        }
                        maxByCpu = quota.cpuFree / detail.cpuCount;
                        maxByMem = quota.memFree * 1024 / detail.memSize;
                        var vmDiskSize = $scope.service.vm_support_user_define_config === "true" ? (detail.userDiskSize + $scope.service.selTemplate.diskTotalSize) : detail.diskTotalSize;
                        maxByStorage = quota.storageFree / vmDiskSize;
                    } else {
                        var userConfig = $scope.specInfo.userDefConfig;
                        maxByCpu = quota.cpuFree / userConfig.cpu;
                        maxByMem = quota.memFree * 1024 / userConfig.mem;
                        maxByStorage = quota.storageFree / $scope.service.selTemplate.diskTotalSize;
                    }

                    var curMax = Math.min(maxByCpu, maxByMem, maxByStorage, quota.vmFree, 30);
                    curMax = Math.floor(curMax);
                    if(!curMax) {
                        curMax = 0;
                    }
                    curMax = curMax < 0 ? 0 : curMax;
                    $scope.specInfo.vmNum.max = curMax;
                }

                // 查询指定虚拟机规格模板详情
                function onChangeConfigTem(id) {
                    var detail = _.find($scope.specInfo.configTem.values, function (item) {
                        return item.flavorId === id;
                    });
                    $scope.specInfo.configTem.detail = detail;
                    updateQuota();
                }

                // 初始化SLA颜色块事件
                function initSlaAnimal() {
                    $(".createvm-types").undelegate(".types-item", "click");
                    $(".createvm-types").delegate(".types-item", "click", function (evt) {
                        var detail = {};

                        if ($(evt.currentTarget).hasClass("selected")) {
                            $(evt.currentTarget).removeClass("selected").find("i").removeClass("icon-ok");
                        } else {
                            $(".createvm-types .types-item").removeClass("selected").find("i").removeClass("icon-ok");
                            $(evt.currentTarget).addClass("selected").find("i").addClass("icon-ok");

                            var value = $(evt.currentTarget).data("value");
                            detail = _.find($scope.specInfo.sla.values, function (item) {
                                return item.value === value;
                            });
                        }

                        $scope.$apply(function () {
                            $scope.specInfo.sla.detail = detail;
                        });
                    });
                }

                // 初始化CPU、内存颜色块事件
                function initCpuMemAnimal() {
                    $(".createvm-cpu div.cpu-options").bind("click", function (evt) {
                        if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                            $(".createvm-cpu .cpu-options[self-defined]").html(i18n.common_term_custom_label);
                            $(".createvm-cpu .input-tip").css("display", "none");
                            $scope.specInfo.userDefConfig.cpu = $(evt.currentTarget).data("value");
                            $scope.specInfo.userDefConfig.cpuInput = false;
                        }
                        $(".createvm-cpu div.cpu-options").removeClass("selected");
                        $(evt.currentTarget).addClass("selected");

                        $scope.$apply(function () {
                            updateQuota();
                        });
                    });

                    $(".createvm-memory div.memory-options").bind("click", function (evt) {
                        if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                            $(".createvm-memory .memory-options[self-defined]").html(i18n.common_term_custom_label);
                            $(".createvm-memory .input-tip").css("display", "none");
                            $scope.specInfo.userDefConfig.mem = $(evt.currentTarget).data("value");
                            $scope.specInfo.userDefConfig.memInput = false;
                        }
                        $(".createvm-memory div.memory-options").removeClass("selected");
                        $(evt.currentTarget).addClass("selected");

                        $scope.$apply(function () {
                            updateQuota();
                        });
                    });
                }

                function init() {
                    querySLAs();
                    var deferred = queryConfigTemplates();
                    var deferred2 = queryVmTemplateDetail();
                    $.when(deferred, deferred2).done(function () {
                        queryOrgQuota();
                    });

                    initSlaAnimal();
                    initCpuMemAnimal();
                    $(".createvm-cpu .cpu-options[self-defined]").editCpu($scope.specInfo.userDefConfig, $scope, updateQuota, i18n.common_term_core_label);
                    $(".createvm-memory .memory-options[self-defined]").editMem($scope.specInfo.userDefConfig, $scope, updateQuota);
                }

                // 事件处理，查询初始化信息
                $scope.$on($scope.events.selTemplateNextFromParent, function (event, msg) {
                    init();
                });
            }
        ];

        return createVmSpecInfoCtrl;
    }
);
