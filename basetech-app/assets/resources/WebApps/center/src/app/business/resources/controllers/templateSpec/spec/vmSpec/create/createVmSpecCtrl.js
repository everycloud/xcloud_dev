/**
 * 创建虚拟机规格
 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'app/business/resources/controllers/constants',
    "app/services/httpService",
    'app/services/exceptionService'],
    function ($, angular, unifyValid, constants, httpService, Exception) {
        "use strict";
        var createSpecCtrl = ["$scope", "$compile", "$timeout", "camel", function ($scope, $compile, $timeout, camel) {

            var exceptionService = new Exception();

            unifyValid.checkMemory = function () {
                var value = $(this).val();

                var memSize = value == "" ? 0 : parseInt(value, 10) * 1024;
                if ($("#" + $scope.memory.selectId).widget().getSelectedId() === "GB") {
                    memSize = value == "" ? 0 : parseInt(value, 10) * 1024;
                }
                else {
                    memSize = value == "" ? 0 : parseInt(value, 10);
                }

                if (memSize < 128 || memSize > 1048576) {
                    return false;
                }

                return true;
            };

            unifyValid.checkVmSpecName = function () {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]{1,256}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            $scope.model = {
                "actionIsCreate":true,
                "name":"",
                "desc":"",
                "cpuCount":"",
                "memSize":"",
                "disks":"",
                "qos":""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "createSpecName",
                "extendFunction" : ["checkVmSpecName"],
                "tooltip": $scope.i18n.common_term_composition6_valid +$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkVmSpecName():"+$scope.i18n.common_term_composition6_valid +$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "width": "200"
            };
            $scope.cpu = {
                label: $scope.i18n.common_term_cpuNum_label+":",
                require: true,
                "id": "createSpecCPU",
                "width": "200",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64),
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer:"+$scope.i18n.common_term_PositiveIntegers_valid+";maxValue(64):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64)+";",
                "blur":function() {

                    $scope.cpuShare.change(true);
                }
            };
            $scope.memory = {
                label: $scope.i18n.common_term_memory_label+":",
                require: true,
                "inputId": "createVmSpecSpecMemoryInput",
                "tipPosition":"bottom",
                "selectId": "createVmSpecSpecMemorySelect",
                "extendFunction" : ["checkMemory"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer:"+$scope.i18n.common_term_PositiveIntegers_valid+";checkMemory():"+$scope.i18n.sprintf($scope.i18n.common_term_range_valid, "128MB", "1048576MB")+";",
                "inputWidth": "134",
                "selectWidth": "64",
                "values": [
                    {
                        "selectId": "MB",
                        "label": "MB",
                        "checked": true
                    },
                    {
                        "selectId": "GB",
                        "label": "GB"
                    }
                ],
                "change":function() {
                    // 修改Qos中内存份额值
                    $scope.memoryShare.change(true);
                    unifyValid.FormValid($("#"+$scope.memory.inputId));
                },
                "blur":function() {
                    // 修改Qos中内存份额值
                    $scope.memoryShare.change(true);
                }
            };

            $scope.diskNum = {
                label: $scope.i18n.common_term_diskNum_label+":",
                require: true,
                "id": "createVmSpecSpecDiskNum",
                "width": "200",
                "values": [
                    {
                        "selectId": "1",
                        "label": "1"
                    },
                    {
                        "selectId": "2",
                        "label": "2",
                        "checked": true
                    },
                    {
                        "selectId": "3",
                        "label": "3"
                    },
                    {
                        "selectId": "4",
                        "label": "4"
                    },
                    {
                        "selectId": "5",
                        "label": "5"
                    },
                    {
                        "selectId": "6",
                        "label": "6"
                    },
                    {
                        "selectId": "7",
                        "label": "7"
                    },
                    {
                        "selectId": "8",
                        "label": "8"
                    },
                    {
                        "selectId": "9",
                        "label": "9"
                    },
                    {
                        "selectId": "10",
                        "label": "10"
                    },
                    {
                        "selectId": "11",
                        "label": "11"
                    }
                ],
                "change":function() {
                    var diskNum = $("#" + $scope.diskNum.id).widget().getSelectedId();
                    var curDiskNum = $scope.diskTable.data.length;

                    if (diskNum == curDiskNum) {
                        return;
                    }

                    if (diskNum > curDiskNum) {
                        for (var index = curDiskNum; index < diskNum; index++) {
                            $scope.diskTable.add();
                        }
                        return;
                    }

                    for (var index = diskNum; index < curDiskNum; index++) {
                        $scope.diskTable.delete(diskNum);
                    }
                    return;
                }
            };

            $scope.diskTable = {
                "label":$scope.i18n.common_term_diskInfo_label+":",
                "require":true,
                "data":[],
                "mediaTypeList":[{"key":"SAN-Any","value":"Any"}, {"key":"SAN-SATA","value":"SAN-SATA"}, {"key":"SAN-SAS&FC","value":"SAN-SAS&FC"}, {"key":"SAN-SSD","value":"SAN-SSD"}],
                "change":function(index) {
                    var data = $scope.diskTable.data[index];
                    if (data && data.mediaTypeObj) {
                        data.media = data.mediaTypeObj.key;
                    }
                },
                "add":function(diskInfo){
                    var options = {
                        "index":diskInfo == undefined ? $scope.diskTable.data.length : diskInfo.index,
                        "diskSize":diskInfo == undefined ? "20" :diskInfo.diskSize,
                        "media":diskInfo == undefined ? $scope.diskTable.mediaTypeList[0].key:diskInfo.media,
                        "mediaTypeObj":undefined
                    };

                    var mediaTypeList = $scope.diskTable.mediaTypeList;
                    for (var index = 0; index < mediaTypeList.length; index++)
                    {
                        var media = mediaTypeList[index];
                        if (media.key === options.media){
                            options.mediaTypeObj = mediaTypeList[index];
                        }
                    }


                    $scope.diskTable.data.push(options);
                },
                "delete":function(index){
                    $scope.diskTable.data.splice(index, 1);
                },
                "checkDisk":function (value) {
                    if (!value || value == "") {
                        return $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,65536);
                    }

                    if (!/^\d*$/.test(jQuery.trim(value))) {
                        return $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,65536);
                    }

                    if (parseInt(value, 10) > 65536 || parseInt(value, 10) < 1) {
                        return $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid,1,65536);
                    }

                    return true;
                }
            };

            // Qos配置
            $scope.qosConfig = {
                "show": false,
                "change": function () {
                    var valid = unifyValid.FormValid($("#qosConfigBlock"));
                    if ($scope.qosConfig.show && (!valid || $("#qosConfigBlock .ng-invalid").length > 0)) {
                        return;
                    }

                    $scope.qosConfig.show = !$scope.qosConfig.show;
                }
            };

            // cpu Qos
            $scope.cpuSpinnerLimit = {
                "label":$scope.i18n.common_term_limitRtae_label+"(%):",
                "require":true,
                "id":"cpuSpinnerLimit",
                "value":"50",
                "max":"100",
                "min":"50",
                "step":"1",
                "width":"80",
                "change":function() {
                    var limit = $("#" + $scope.cpuSpinnerLimit.id).widget().option("value");
                    $("#" + $scope.cpuSpinnerReserve.id).widget().option("max", limit);
                }
            };
            $scope.cpuSpinnerReserve  = {
                "label":$scope.i18n.perform_term_reservedRtae_label + "(%):",
                "require":true,
                "id":"cpuSpinnerReserve",
                "value":"50",
                "max":"50",
                "min":"0",
                "step":"1",
                "width":"80",
                "change":function() {
                    var reserve = $("#" + $scope.cpuSpinnerReserve.id).widget().option("value");
                    $("#" + $scope.cpuSpinnerLimit.id).widget().option("min", reserve);
                }
            };

            $scope.cpuShare = {
                label: $scope.i18n.vm_term_CPUquota_label+":",
                require: true,
                selectId:"cpuShareSelectId",
                selectWidth:"80",
                change:function(keepCustom){
                    var shareValue = $("#" + $scope.cpuShare.selectId).widget().getSelectedId();
                    var textWidget = $("#" + $scope.cpuShare.textId).widget();
                    var cpu = $("#" + $scope.cpu.id).widget().getValue();
                    var cpuSize = cpu == "" ? 0 : parseInt(cpu, 10);

                    if (shareValue === 'high')
                    {
                        textWidget.option("value", cpuSize * 2000);
                    }
                    else if (shareValue === 'middle') {
                        textWidget.option("value", cpuSize * 1000);
                    }
                    else if(shareValue === 'low') {
                        textWidget.option("value", cpuSize * 500);
                    }
                    else {
                        if (!keepCustom) {
                            textWidget.option("value", "");
                        }
                    }
                },
                values:[
                    {
                        "selectId": "high",
                        "label": $scope.i18n.common_term_high_label || "高"
                    },
                    {
                        "selectId": "middle",
                        "label": $scope.i18n.common_term_middling_label || "中",
                        "checked": true
                    },
                    {
                        "selectId": "low",
                        "label": $scope.i18n.common_term_low_label || "低"
                    },
                    {
                        "selectId": "custom",
                        "label": $scope.i18n.common_term_custom_label || "自定义"
                    }
                ],
                textId:"cpuShareTextId",
                value:"2000",
                textWidth:"225",
                readonly:false,
                validate: "integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 128000)+";maxValue(128000):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 128000)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 128000)+";required:"+$scope.i18n.common_term_null_valid
            };

            $scope.memoryShare = {
                label: $scope.i18n.vm_term_memoryQuota_label + ":",
                require: false,
                selectId:"memoryShareSelectId",
                selectWidth:"80",
                change:function(keepCustom){
                    var memoryShare = $("#" + $scope.memoryShare.selectId).widget().getSelectedId();
                    var textWidget = $("#" + $scope.memoryShare.textId).widget();
                    var memory = $("#" + $scope.memory.inputId).widget().getValue();
                    var memorySize = memory == "" ? 0 : parseInt(memory, 10);
                    if (memoryShare === 'high')
                    {
                        textWidget.option("value", memorySize * 20);
                    }
                    else if (memoryShare === 'middle') {
                        textWidget.option("value", memorySize * 10);
                    }
                    else if(memoryShare === 'low') {
                        textWidget.option("value", memorySize * 5);
                    }
                    else {
                        if (!keepCustom) {
                            textWidget.option("value", "");
                        }
                    }
                },
                values:[
                    {
                        "selectId": "high",
                        "label": $scope.i18n.common_term_high_label || "高"
                    },
                    {
                        "selectId": "middle",
                        "label": $scope.i18n.common_term_middling_label || "中",
                        "checked": true
                    },
                    {
                        "selectId": "low",
                        "label": $scope.i18n.common_term_low_label || "低"
                    },
                    {
                        "selectId": "custom",
                        "label": $scope.i18n.common_term_custom_label || "自定义"
                    }
                ],
                textId:"memoryShareTextId",
                value:"10240",
                textWidth:"225",
                readonly:false,
                validate: "integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";maxValue(1000000):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";required:"+$scope.i18n.common_term_null_valid
            };

            // 内存Qos
            $scope.memorySpinnerReserve = {
                "label":$scope.i18n.perform_term_reservedRtae_label+"(%):",
                "require":true,
                "id":"memorySpinnerReserve",
                "value":"50",
                "max":"100",
                "min":"0",
                "step":"1",
                "width":"80"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "createSpecDescription",
                "value": "",
                "type": "multi",
                "width": "450",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.saveBtn = {
                "label": "",
                "require":false,
                "id": "createSpecSave",
                "text": $scope.i18n.common_term_create_button || "创建",
                "tooltip": "",
                "click": function () {
                    var valid = unifyValid.FormValid($("#resources_spec_createInfo"));
                    if (!valid || $("#resources_spec_createInfo .ng-invalid").length > 0) {
                        return;
                    }

                    // 创建vm规格
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.desc = $("#" + $scope.description.id).widget().getValue();
                    $scope.model.cpuCount = $("#" + $scope.cpu.id).widget().getValue();

                    var memSize = 0;
                    var memSizeStr = $("#" + $scope.memory.inputId).widget().getValue();
                    if ($("#" + $scope.memory.selectId).widget().getSelectedId() === "GB") {
                        memSize = memSizeStr == "" ? 0 : parseInt(memSizeStr, 10) * 1024;
                    }
                    else {
                        memSize = memSizeStr == "" ? 0 : parseInt(memSizeStr, 10);
                    }
                    $scope.model.memSize = memSize;

                    $scope.model.qos = {
                        "cpuReserve":$("#"+$scope.cpuSpinnerReserve.id).widget().option("value"),
                        "cpuLimit":$("#"+$scope.cpuSpinnerLimit.id).widget().option("value"),
                        "cpuShare":$("#" + $scope.cpuShare.textId).widget().getValue(),
                        "cpuShareType":$("#" + $scope.cpuShare.selectId).widget().getSelectedId(),

                        "memReserve":$("#"+$scope.memorySpinnerReserve.id).widget().option("value"),
                        "memShare":$("#" + $scope.memoryShare.textId).widget().getValue(),
                        "memShareType": $("#" + $scope.memoryShare.selectId).widget().getSelectedId()
                    };

                    var disks = $scope.diskTable.data;

                    $scope.model.disks = disks;
                    if ($scope.model.actionIsCreate) {
                        createVmSpec($scope.model);
                    }else {
                        modifyVmSpec($scope.model);
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "createSpecCancel",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "tooltip": "",
                "click": function () {
                    $("#createVmSpecWinID").widget().destroy();
                }
            };

            /**
             * 创建虚拟机规格
             */
            var createVmSpec = function (vmSpecInfo) {
                var deferred = camel.post({
                    "url": {"s": constants.rest.VM_SPEC_CREATE.url, "o": {"tenant_id": 1}},
                    "params": JSON.stringify(vmSpecInfo),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $("#createVmSpecWinID").widget().destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };

            /**
             * 修改虚拟机规格
             * @param vmSpecInfo
             */
            var modifyVmSpec = function (vmSpecInfo) {
                var deferred = camel.put({
                    "url": {"s": constants.rest.VM_SPEC_MODIFY.url, "o": {"tenant_id": 1, "id":$scope.model.id}},
                    "params": JSON.stringify(vmSpecInfo),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $("#createVmSpecWinID").widget().destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            };

            /**
             * 页面初始化操作
             */
            $scope.init = function(){
                var action = $("#createVmSpecWinID").widget().option("action");

                // 创建操作不需要初始化数据
                if (action === "create") {
                    // 初始化磁盘数据
                    $scope.diskTable.add();
                    $scope.diskTable.add();

                    $scope.model.actionIsCreate = true;
                    $scope.saveBtn.text = $scope.i18n.common_term_create_button || "创建";
                    return;
                }

                $scope.model.actionIsCreate = false;
                $scope.saveBtn.text = $scope.i18n.common_term_save_label || "保存";

                // 修改操作，初始化数据
                var specID = $("#createVmSpecWinID").widget().option("specID");
                $scope.model.id = specID;

                var deferred = camel.get({
                    "url": {"s": constants.rest.VM_SPEC_DETAIL.url, "o": {"tenant_id": 1, "id": specID}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {

                        if (response === undefined || response.vmFlavor === undefined) {
                            $("#createVmSpecWinID").widget().destroy();
                        }

                        var data = response.vmFlavor;

                        $("#" + $scope.name.id).widget().option("value", data.name);

                        $("#" + $scope.cpu.id).widget().option("value", data.cpuCount);

                        if (data.cpuCount * 500 == data.qos.cpuReserve) {
                            $("#" + $scope.cpuShare.selectId).widget().opChecked("low");
                        } else if (data.cpuCount * 1000 == data.qos.cpuReserve) {
                            $("#" + $scope.cpuShare.selectId).widget().opChecked("middle");
                        } else if (data.cpuCount * 2000 == data.qos.cpuReserve) {
                            $("#" + $scope.cpuShare.selectId).widget().opChecked("high");
                        }
                        else {
                            $("#" + $scope.cpuShare.selectId).widget().opChecked("custom");
                        }

                        $("#" + $scope.cpuShare.textId).widget().option("value", data.qos.cpuShare);
                        $("#"+$scope.cpuSpinnerLimit.id).widget().option("value", data.qos.cpuLimit);
                        $("#"+$scope.cpuSpinnerReserve.id).widget().option("value", data.qos.cpuReserve);

                        $("#" + $scope.memory.inputId).widget().option("value", data.memSize);
                        if (data.memSize * 5 == data.qos.memReserve) {
                            $("#" + $scope.memoryShare.selectId).widget().opChecked("low");
                        } else if (data.memSize * 10 == data.qos.memReserve) {
                            $("#" + $scope.memoryShare.selectId).widget().opChecked("middle");
                        } else if (data.memSize * 20 == data.qos.memReserve) {
                            $("#" + $scope.memoryShare.selectId).widget().opChecked("high");
                        }
                        else {
                            $("#" + $scope.memoryShare.selectId).widget().opChecked("custom");
                        }

                        $("#" + $scope.memoryShare.textId).widget().option("value", data.qos.memShare);
                        $("#"+$scope.memorySpinnerReserve.id).widget().option("value", data.qos.memReserve);

                        $("#" + $scope.description.id).widget().option("value", data.desc);

                        // 初始化磁盘信息
                        var diskList = data.disks;
                        $("#" + $scope.diskNum.id).widget().opChecked(diskList.length.toString());

                        for (var index = 0; index < diskList.length; index++) {
                            var diskInfo = diskList[index];
                            $scope.diskTable.add(diskInfo);
                        }
                    });
                });
            };

            $scope.init();
        }];

        // 创建App
        var deps = [];
        var createVmSpecApp = angular.module("resources.spec.vmSpec", deps);
        createVmSpecApp.controller("resources.spec.vmSpec.createCtrl", createSpecCtrl);
        createVmSpecApp.service("camel", httpService);

        return createVmSpecApp;
    });