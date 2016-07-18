define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'tiny-widgets/Window',
    'app/services/messageService',
    "app/business/resources/controllers/constants",
    "language/sr-rpool-exception"],
    function ($, angular, UnifyValid, Window, messageService, constants, ameException) {
        "use strict";

        var specInfoCtrl = ["$scope", "$state", "camel","exception", function ($scope, $state, camel, exception) {
            var messageServiceIns = new messageService();

            UnifyValid.checkMemory = function () {
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

            $scope.osType = {
                label: $scope.i18n.common_term_OStype_label+":",
                require: true,
                "id": "createVmtSpecOSType",
                "width": "200",
                "values": [
                    {
                        "selectId": "Windows",
                        "label": "Windows"
                    },
                    {
                        "selectId": "Linux",
                        "label": "Linux",
                        "checked": true
                    }
                ],
                "change":function() {
                    $scope.service.model.osOption.osType = $("#" + $scope.osType.id).widget().getSelectedId();
                    $scope.osVesion.values = $scope.versionConfig.getVersionInfo($scope.service.model.osOption.osType);
                }
            };

            $scope.osVesion = {
                label: $scope.i18n.common_term_OSversion_label+":",
                require: true,
                "id": "createVmtSpecOSVersion",
                "width": "200",
                "height":"200",
                "values": [],
                "change":function() {
                    $scope.service.model.osOption.osVersion = $("#" + $scope.osVesion.id).widget().getSelectedId();
                }
            };

            var selectVmSpec = function () {
                var options = {
                    "winId": "selectVmSpecWinID",
                    "title": $scope.i18n.template_term_chooseVMspec_label,
                    "content-type": "url",
                    "content": "app/business/resources/views/templateSpec/template/vmTemplate/create/selectVmSpec.html",
                    "height": 400,
                    "width": 600,
                    "resizable": true,
                    "maximizable":false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                    }
                };

                return new Window(options);
            };

            // 选择虚拟机规格
            $scope.selectVmSpec = {
                "label": "",
                "id": "createVmtSelectVmSpecBtn",
                "text": $scope.i18n.template_term_chooseVMspec_label,
                "tooltip": "",
                "click": function () {
                    var window = selectVmSpec();
                    window.show();
                }
            };

            $scope.cpu = {
                label: $scope.i18n.common_term_cpuNum_label+":",
                require: true,
                "id": "createVmtSpecCpuNum",
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64)+";maxValue(64):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 64)+";",
                "width": "200",
                "blur":function() {
                    $scope.cpuShare.change(true);
                }
            };

            $scope.memory = {
                label: $scope.i18n.common_term_memory_label+":",
                require: true,
                "inputId": "createVmtSpecMemoryInput",
                "tipPosition":"bottom",
                "selectId": "createVmtSpecMemorySelect",
                "extendFunction" : ["checkMemory"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "128MB", "1048576MB")+";checkMemory():"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "128MB", "1048576MB")+";",
                "inputWidth": "131",
                "selectWidth": "65",
                "value":"",
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
                    // 预留功能
                    $scope.memoryShare.change(true);
                    UnifyValid.FormValid($("#"+$scope.memory.inputId));
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
                            $scope.diskTable.add(undefined);
                        }
                        return;
                    }

                    for (var index = diskNum; index < curDiskNum; index++) {
                        $scope.diskTable.delete(diskNum);
                    }
                    return;
                }
            };

            var isEmptyObj = function(obj)
            {
                for (var pro in obj)
                {
                    if (obj.hasOwnProperty(pro)) {
                        return false;
                    }
                }
                return true;
            };

            $scope.diskTable = {
                "label":$scope.i18n.common_term_diskInfo_label+":",
                "require":true,
                "data":[],
                "add":function(diskInfo){
                    var options = {
                        "name":diskInfo == undefined ? $scope.diskTable.data.length : diskInfo.index,
                        "quantity":diskInfo == undefined ? "20" :diskInfo.diskSize,
                        "allocType":"",
                        "allocTypeList":[],
                        "mediaType":"",
                        "mediaTypeList":[],
                        "indepDisk":"",
                        "indepDiskList":[]
                    };

                    if (diskInfo && diskInfo.media) {
                        options.allocTypeList = $scope.diskTable.getAllocTypeList();
                        for (var index = 0, getMediaTypeIndex = false; index < options.allocTypeList.length && !getMediaTypeIndex; index++) {
                            var mediaTypeList = $scope.diskTable.getMediaTypeList(options.allocTypeList[index] && options.allocTypeList[index].key);
                            for (var mediaIndex = 0; mediaIndex < mediaTypeList.length; mediaIndex++) {
                                if (mediaTypeList[mediaIndex].key == diskInfo.media) {
                                    getMediaTypeIndex = true;
                                    options.allocTypeObj = options.allocTypeList[index];
                                    options.allocType = options.allocTypeObj && options.allocTypeObj.key;

                                    options.mediaTypeList = mediaTypeList;
                                    options.mediaTypeObj = options.mediaTypeList[mediaIndex];
                                    options.mediaType = options.mediaTypeObj && options.mediaTypeObj.key;
                                }
                            }
                        }

                        // 设置默认值
                        if (!options.allocTypeObj) {
                            options.allocTypeObj = options.allocTypeList[0];
                            options.allocType = options.allocTypeObj && options.allocTypeObj.key;

                            options.mediaTypeList =  $scope.diskTable.getMediaTypeList(options.allocTypeObj && options.allocTypeObj.key);
                            options.mediaType = options.mediaTypeList[0] && options.mediaTypeList[0].key;
                        }
                    } else {
                        options.allocTypeList = $scope.diskTable.getAllocTypeList();
                        options.allocTypeObj = options.allocTypeList[0];
                        options.allocType = options.allocTypeObj && options.allocTypeObj.key;

                        options.mediaTypeList = $scope.diskTable.getMediaTypeList(options.allocType);
                        options.mediaTypeObj = options.mediaTypeList[0];
                        options.mediaType = options.mediaTypeObj && options.mediaTypeObj.key;
                    }

                    options.indepDiskList = $scope.diskTable.getIndepDisk(options.allocType, options.mediaType);
                    options.indepDiskObj = options.indepDiskList[0];
                    options.indepDisk = options.indepDiskObj && options.indepDiskObj.key;

                    $scope.diskTable.data.push(options);
                },
                "delete":function(index){
                    $scope.diskTable.data.splice(index, 1);
                },
                "clear":function() {
                    $scope.diskTable.data = [];
                },
                "checkDisk":function(value) {
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
                },
                "checkData":function() {
                    if (!$scope.diskTable.data || $scope.diskTable.data.length == 0) {
                        return false;
                    }

                    var diskDataList = $scope.diskTable.data;
                    for (var index = 0; index < diskDataList.length; index++) {
                        var diskData = diskDataList[index];
                        if (!diskData.allocTypeObj || !diskData.mediaTypeObj || !diskData.indepDiskObj) {
                            return false;
                        }
                    }

                    return true;
                },
                "allocTypeChanged":function(index, allocTypeObj) {
                    var diskInfo = $scope.diskTable.data[index];
                    if (!diskInfo || !allocTypeObj) {
                        return;
                    }

                    var oldMediaType = diskInfo.mediaTypeObj && diskInfo.mediaTypeObj.key;
                    diskInfo.mediaTypeList = $scope.diskTable.getMediaTypeList(allocTypeObj.key);
                    diskInfo.mediaTypeObj = diskInfo.mediaTypeList[0];
                    for (var mediaIndex = 0; mediaIndex < diskInfo.mediaTypeList.length; mediaIndex++) {
                        if (diskInfo.mediaTypeList[mediaIndex] && diskInfo.mediaTypeList[mediaIndex].key == oldMediaType) {
                            diskInfo.mediaTypeObj = diskInfo.mediaTypeList[mediaIndex];
                        }
                    }
                    diskInfo.mediaType = diskInfo.mediaTypeObj && diskInfo.mediaTypeObj.key;

                    var oldIndepDisk = diskInfo.indepDiskObj && diskInfo.indepDiskObj.key;
                    diskInfo.indepDiskList = $scope.diskTable.getIndepDisk(allocTypeObj.key, diskInfo.mediaType);
                    diskInfo.indepDiskObj = diskInfo.indepDiskList[0];
                    for (var indepIndex = 0; indepIndex < diskInfo.indepDiskList.length; indepIndex++) {
                        if (diskInfo.indepDiskList[indepIndex] && diskInfo.indepDiskList[indepIndex].key == oldIndepDisk) {
                            diskInfo.indepDiskObj = diskInfo.indepDiskList[indepIndex];
                        }
                    }
                    diskInfo.indepDisk = diskInfo.indepDiskObj && diskInfo.indepDiskObj.key;
                },
                "mediaTypeChanged":function(index, mediaTypeObj) {
                    var diskInfo = $scope.diskTable.data[index];
                    if (!diskInfo || !mediaTypeObj) {
                        return;
                    }

                    var oldIndepDisk = diskInfo.indepDiskObj && diskInfo.indepDiskObj.key;
                    diskInfo.indepDiskList = $scope.diskTable.getIndepDisk(diskInfo.allocTypeObj.key, mediaTypeObj.key);
                    diskInfo.indepDiskObj = diskInfo.indepDiskList[0];
                    for (var indepIndex = 0; indepIndex < diskInfo.indepDiskList.length; indepIndex++) {
                        if (diskInfo.indepDiskList[indepIndex] && diskInfo.indepDiskList[indepIndex].key == oldIndepDisk) {
                            diskInfo.indepDiskObj = diskInfo.indepDiskList[indepIndex];
                        }
                    }
                    diskInfo.indepDisk = diskInfo.indepDiskObj && diskInfo.indepDiskObj.key;
                },
                "getAllocTypeList":function() {
                    var allocTypeMap = {
                        "thickformat":$scope.i18n.common_term_lazyZeroed_label || "普通延迟置零",
                        "thick":$scope.i18n.common_term_common_label || "普通",
                        "thin":$scope.i18n.common_term_thinProv_label || "精简"
                    }, allocTypeList = [];

                    if (isEmptyObj($scope.qosMap)) {
                        return allocTypeList;
                    }

                    for (var allocType in $scope.qosMap) {
                        if ($scope.qosMap.hasOwnProperty(allocType)) {
                            allocTypeList.push({"key": allocType, "value": allocTypeMap[allocType]});
                        }
                    }

                    return allocTypeList;
                },
                "getMediaTypeList":function(allocType) {
                    var mediaTypeList = [];

                    if (isEmptyObj($scope.qosMap) || !allocType || !$scope.qosMap.hasOwnProperty(allocType)) {
                        return mediaTypeList;
                    }

                    var mediaTypeListTemp = $scope.qosMap[allocType];
                    for (var mediaType in mediaTypeListTemp) {
                        if (mediaTypeListTemp.hasOwnProperty(mediaType)) {
                            mediaTypeList.push({"key":mediaType, "value":(mediaType == "SAN-Any" ? "Any" : mediaType)});
                        }
                    }

                    return mediaTypeList;
                },
                "getIndepDisk":function(allocType, mediaType) {
                    var indepDiskList = [];

                    if (isEmptyObj($scope.qosMap) || !mediaType || !$scope.qosMap || !$scope.qosMap.hasOwnProperty(allocType) || !$scope.qosMap[allocType] || !$scope.qosMap[allocType].hasOwnProperty(mediaType)) {
                        return indepDiskList;
                    }

                    var indepDiskListTemp = $scope.qosMap[allocType][mediaType];
                    if (!indepDiskListTemp) {
                        return indepDiskList;
                    }

                    for (var index = 0; index < indepDiskListTemp.length; index++) {
                        indepDiskList.push({"key":indepDiskListTemp[index], "value":(indepDiskListTemp[index] ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label)});
                    }

                    return indepDiskList;
                }
            };

            // 高级配置
            $scope.advConfig = {
                label: "",
                require: false,
                "show": false,
                "change": function () {
                    $scope.advConfig.show = !$scope.advConfig.show;
                }
            };

            // Qos配置
            $scope.qosConfig = {
                "show": false,
                "change": function () {
                    var valid = UnifyValid.FormValid($("#qosConfigBlock"));
                    if ($scope.qosConfig.show && (!valid || $("#qosConfigBlock .ng-invalid").length > 0)) {
                        return;
                    }

                    $scope.qosConfig.show = !$scope.qosConfig.show;
                }
            };

            $scope.cpuShare = {
                label: $scope.i18n.vm_term_CPUquota_label+":",
                require: true,
                selectId:"cpuShareSelectId",
                selectWidth:"cpuShareSelectWidth",
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
                        "label": $scope.i18n.common_term_high_label
                    },
                    {
                        "selectId": "middle",
                        "label": $scope.i18n.common_term_middling_label,
                        "checked": true
                    },
                    {
                        "selectId": "low",
                        "label": $scope.i18n.common_term_low_label
                    },
                    {
                        "selectId": "custom",
                        "label": $scope.i18n.common_term_custom_label
                    }
                ],
                textId:"cpuShareTextId",
                value:"2000",
                textWidth:"cpuShareTextWidth",
                readonly:false,
                validate: "required:"+$scope.i18n.common_term_null_valid+";integer:"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "1", "128000")+";maxValue(128000):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "1", "128000")+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "1", "128000")+";"
            };

            $scope.memoryShare = {
                label: $scope.i18n.vm_term_memoryQuota_label+":",
                require: true,
                selectId:"memoryShareSelectId",
                selectWidth:"memoryShareSelectWidth",
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
                        "label": $scope.i18n.common_term_high_label
                    },
                    {
                        "selectId": "middle",
                        "label": $scope.i18n.common_term_middling_label,
                        "checked": true
                    },
                    {
                        "selectId": "low",
                        "label": $scope.i18n.common_term_low_label
                    },
                    {
                        "selectId": "custom",
                        "label": $scope.i18n.common_term_custom_label
                    }
                ],
                textId:"memoryShareTextId",
                value:"10240",
                textWidth:"memoryShareTextWidth",
                readonly:false,
                validate: "required:"+$scope.i18n.common_term_null_valid+";integer"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";maxValue(1000000):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";minValue(1):"+$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000000)+";"
            };

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
                "label":$scope.i18n.perform_term_reservedRtae_label+"(%):",
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

            // 二级存储
            $scope.secStorage = {
                label: $scope.i18n.common_term_secondStor_label+":",
                require: false,
                "id": "createVmtSpecSecondStorage",
                "width": "200",
                "values": [
                ],
                "change":function() {
                    // 预留功能
                }
            };

            // CPU热插拔
            $scope.cpuHotplug = {
                label: $scope.i18n.vm_term_CPUliveAdjust_label+":",
                require: true,
                "id": "createVmtSpecCpuHotplug",
                "width": "200",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.vm_term_disableCPUliveAdjust_button,
                        "checked": true
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.vm_term_enableCPUliveAdd_button
                    }
                ],
                "change":function() {
                    // 预留功能
                }
            };

            // HA配置
            $scope.haConfig = {
                label: "HA:",
                require: true,
                "id": "createVmtSpecHaConfig",
                "width": "200",
                "value":"yes",
                "text":$scope.i18n.common_term_enable_value || "开启",
                "checked":false,
                "change":function() {
                    // 预留功能
                }
            };

            // 时钟策略
            $scope.timeConfig = {
                label: $scope.i18n.sys_term_timeSync_label+":",
                require: true,
                "id": "createVmtSpecTimeConfig",
                "width": "200",
                "value":"yes",
                "text":$scope.i18n.template_term_hostCloskSync_label,
                "checked":false,
                "change":function() {
                    // 预留功能
                }
            };

            // 升级方式
            $scope.updateMode = {
                label: $scope.i18n.common_term_updateMode_label+":",
                require: true,
                "id": "createVmtSpecUpdateMode",
                "spacing":{"width" : "50px", "height" : "20px"},
                "values": [
                    {
                        "key": "auto",
                        "text": $scope.i18n.common_term_auto_label,
                        "tooltip": "",
                        "checked": true,
                        "disabled": false
                    },
                    {
                        "key": "manual",
                        "text": $scope.i18n.common_term_manual_label,
                        "tooltip": "",
                        "checked": false,
                        "disabled": false
                    }
                ],
                "change":function() {
                    // 预留功能
                }
            };

            // 基本块存储热迁移
            $scope.blockHeatTranfer = {
                label: $scope.i18n.vm_term_basicBlockLiveMig_label+":",
                require: true,
                "id": "createVmtSpecHeatTranfer",
                "spacing":{"width" : "50px", "height" : "20px"},
                "values": [
                    {
                        "key": "support",
                        "text": $scope.i18n.common_term_support_value,
                        "tooltip": "",
                        "checked": false,
                        "disabled": false
                    },
                    {
                        "key": "unSupport",
                        "text": $scope.i18n.common_term_notSupport_value,
                        "tooltip": "",
                        "checked": true,
                        "disabled": false
                    }
                ],
                "change":function() {
                    // 预留功能
                }
            };

            $scope.preBtn = {
                id: "specInfoPreID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                pre: function () {
                    $scope.service.show = "baseInfo";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "specInfoNextID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    var valid = UnifyValid.FormValid($("#createVmtSpecInfo"));
                    if (!valid || $("#createVmtSpecInfo .ng-invalid").length > 0) {
                        return;
                    }

                    // 校验磁盘
                    if (!$scope.diskTable.checkData()) {
                        messageServiceIns.failMsgBox($scope.i18n.vm_vm_create_para_disk_valid || "磁盘信息错误");
                        return;
                    }

                    var osVersion = $("#" + $scope.osVesion.id).widget().getSelectedId();
                    var key = osVersion.substr(0, osVersion.lastIndexOf("_"));
                    var value = osVersion.substr(osVersion.lastIndexOf("_") + 1, osVersion.length - 1);
                    $scope.service.model.osOption = {
                        "osType":$("#" + $scope.osType.id).widget().getSelectedId(),
                        "osVersion":key,
                        "osVersionNum": value,
                        "osVersionDesc": null,
                        "password":null,
                        "hostName": $scope.service.model.hostName,
                        "supportCustomizedName": false,
                        "customizedOsName": null
                    };
                    $scope.service.model.cpuInfo = {
                        "quantity": $("#" + $scope.cpu.id).widget().getValue(),
                        "reservation": $("#"+$scope.cpuSpinnerReserve.id).widget().option("value"),
                        "limit": $("#"+$scope.cpuSpinnerLimit.id).widget().option("value"),
                        "weight": $("#" + $scope.cpuShare.textId).widget().getValue(),
                        "cpuHotPlug":$("#"+$scope.cpuHotplug.id).widget().getSelectedId()
                    };

                    var memSize = 0;
                    var memSizeStr = $("#" + $scope.memory.inputId).widget().getValue();
                    if ($("#" + $scope.memory.selectId).widget().getSelectedId() === "GB") {
                        memSize = memSizeStr == "" ? 0 : parseInt(memSizeStr, 10) * 1024;
                    }
                    else {
                        memSize = memSizeStr == "" ? 0 : parseInt(memSizeStr, 10);
                    }
                    $scope.service.model.memoryInfo = {
                        "quantity":memSize,
                        "reservation":$("#"+$scope.memorySpinnerReserve.id).widget().option("value"),
                        "limit":"0",
                        "weight":$("#" + $scope.memoryShare.textId).widget().getValue(),
                        "memHotPlug":"0"
                    };

                    var diskDetail = [];
                    for (var index in $scope.diskTable.data) {
                        var disk = {
                            "allocType":$scope.diskTable.data[index].allocTypeObj.key,
                            "mediaType":$scope.diskTable.data[index].mediaTypeObj.key,
                            "indepDisk":$scope.diskTable.data[index].indepDiskObj.key,
                            "name":$scope.diskTable.data[index].name,
                            "quantity":$scope.diskTable.data[index].quantity
                        };
                        $scope.diskTable.data[index].allocType = $scope.diskTable.data[index].allocTypeObj.key;
                        $scope.diskTable.data[index].mediaType = $scope.diskTable.data[index].mediaTypeObj.key;
                        $scope.diskTable.data[index].indepDisk = $scope.diskTable.data[index].indepDiskObj.key;

                        diskDetail.push(disk);
                    }
                    $scope.service.model.diskdetail = diskDetail;
                    $scope.service.model.haFlag = $("#"+$scope.haConfig.id).widget().option("checked");
                    $scope.service.model.updateMode = $("#"+$scope.updateMode.id).widget().opChecked("checked");
                    $scope.service.model.blockHeatTranfer = $("#"+$scope.blockHeatTranfer.id).widget().opChecked("checked");
                    $scope.service.model.syncTimeWithHost = $("#"+$scope.timeConfig.id).widget().option("checked");
                    $scope.service.model.storeRid = $("#"+$scope.secStorage.id).widget().getSelectedId();

                    // 创建虚拟机
                    var deferred = camel.post({
                        url: {"s":constants.rest.VM_TEMPLATE_CREATE.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify($scope.service.model),
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                        }
                    });
                    deferred.success(function (data) {
                        $scope.service.model.id = data.vmtemplateid;

                        // 触发事件
                        $scope.$emit($scope.createVmtEvents.createRequestDone, {"code":"0","desc":""});

                    });
                    deferred.fail(function (data) {
                        var msg = {};
                        try {
                            var responseObj = JSON.parse(data.responseText);
                            var desc = ameException && ameException[responseObj.code] && ameException[responseObj.code].desc || "";

                            msg.code = responseObj.code;
                            msg.desc = desc;
                        }catch (e) {
                            // do nothing
                        }

                        // 触发事件
                        $scope.$emit($scope.createVmtEvents.createRequestDone, msg);

                    });
                    // 步骤切换
                    $scope.service.show = "createVmt";
                    $("#"+$scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "specInfoCancelID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.vmTemplateResources.vmTemplate", {});
                }
            };

            $scope.updateVMSpec = function(specInfo) {
                if (specInfo === undefined) {
                    return;
                }

                // CPU
                $("#"+$scope.cpu.id).widget().option("value", specInfo.cpuCount);

                if (specInfo.cpuCount * 500 == specInfo.qos.cpuReserve) {
                    $("#" + $scope.cpuShare.selectId).widget().opChecked("low");
                } else if (specInfo.cpuCount * 1000 == specInfo.qos.cpuReserve) {
                    $("#" + $scope.cpuShare.selectId).widget().opChecked("middle");
                } else if (specInfo.cpuCount * 2000 == specInfo.qos.cpuReserve) {
                    $("#" + $scope.cpuShare.selectId).widget().opChecked("high");
                }
                else {
                    $("#" + $scope.cpuShare.selectId).widget().opChecked("custom");
                }

                $("#" + $scope.cpuShare.textId).widget().option("value", specInfo.qos.cpuShare);
                $("#"+$scope.cpuSpinnerLimit.id).widget().option("value", specInfo.qos.cpuLimit);
                $("#"+$scope.cpuSpinnerReserve.id).widget().option("value", specInfo.qos.cpuReserve);

                // memory
                $("#"+$scope.memory.inputId).widget().option("value", specInfo.memSize);

                if (specInfo.memSize * 5 == specInfo.qos.memReserve) {
                    $("#" + $scope.memoryShare.selectId).widget().opChecked("low");
                } else if (specInfo.memSize * 10 == specInfo.qos.memReserve) {
                    $("#" + $scope.memoryShare.selectId).widget().opChecked("middle");
                } else if (specInfo.memSize * 20 == specInfo.qos.memReserve) {
                    $("#" + $scope.memoryShare.selectId).widget().opChecked("high");
                }
                else {
                    $("#" + $scope.memoryShare.selectId).widget().opChecked("custom");
                }

                $("#" + $scope.memoryShare.textId).widget().option("value", specInfo.qos.memShare);
                $("#"+$scope.memorySpinnerReserve.id).widget().option("value", specInfo.qos.memReserve);

                // disk
                $("#"+$scope.diskNum.id).widget().opChecked(specInfo.disks.length.toString());

                $scope.diskTable.clear();
                for (var disk in specInfo.disks) {
                    $scope.diskTable.add(specInfo.disks[disk]);
                }

                // resourceTag
                $scope.resourceTagsTable.clear();
                for (var tagInfo in specInfo.tagInfoList) {
                    $scope.resourceTagsTable.add(specInfo.tagInfoList[tagInfo]);
                }
            };

            $scope.versionConfig = {
                "Linux": "Novell SUSE Linux Enterprise Server 10 SP1 32bit_34;Novell SUSE Linux Enterprise Server 10 SP1 64bit_35;Novell SUSE Linux Enterprise Server 10 SP2 32bit_36;Novell SUSE Linux Enterprise Server 10 SP2 64bit_37;Novell SUSE Linux Enterprise Server 10 SP3 32bit_38;Novell SUSE Linux Enterprise Server 10 SP3 64bit_39;Novell SUSE Linux Enterprise Server 11 SP0 32bit_40;Novell SUSE Linux Enterprise Server 11 SP0 64bit_41;Novell SUSE Linux Enterprise Server 11 SP1 32bit_42;Novell SUSE Linux Enterprise Server 11 SP1 64bit_43;Redhat Linux Enterprise 4.5 32bit_44;Redhat Linux Enterprise 4.6 64bit_45;Redhat Linux Enterprise 5.0 32bit_46;Redhat Linux Enterprise 5.0 64bit_47;Redhat Linux Enterprise 5.1 32bit_48;Redhat Linux Enterprise 5.1 64bit_49;Redhat Linux Enterprise 5.2 32bit_50;Redhat Linux Enterprise 5.2 64bit_51;Redhat Linux Enterprise 5.3 32bit_52;Redhat Linux Enterprise 5.3 64bit_53;Redhat Linux Enterprise 5.4 32bit_54;Redhat Linux Enterprise 5.5 64bit_55;CentOS 4.8 32bit_56;CentOS 5.4 64bit_57;CentOS 5.5 32bit_58;Novell SUSE Linux Enterprise Server 10 SP4 32bit_62;Novell SUSE Linux Enterprise Server 10 SP4 64bit_63;Novell SUSE 11 SP1 CUSTOMIZED 64bit_64;Redhat Linux Enterprise 4.4 32bit_65;Redhat Linux Enterprise 4.4 64bit_66;Redhat Linux Enterprise 4.5 64bit_67;Redhat Linux Enterprise 4.6 32bit_68;Redhat Linux Enterprise 4.7 32bit_69;Redhat Linux Enterprise 4.7 64bit_70;Redhat Linux Enterprise 4.8 32bit_71;Redhat Linux Enterprise 4.8 64bit_72;Redhat Linux Enterprise 5.4 64bit_73;Redhat Linux Enterprise 5.5 32bit_74;Redhat Linux Enterprise 5.6 32bit_75;Redhat Linux Enterprise 5.6 64bit_76;Redhat Linux Enterprise 5.7 32bit_77;Redhat Linux Enterprise 5.7 64bit_78;Redhat Linux Enterprise 5.8 32bit_79;Redhat Linux Enterprise 5.8 64bit_80;Redhat Linux Enterprise 6.0 32bit_81;Redhat Linux Enterprise 6.0 64bit_82;Redhat Linux Enterprise 6.1 32bit_83;Redhat Linux Enterprise 6.1 64bit_84;Redhat Linux Enterprise 6.2 32bit_85;Redhat Linux Enterprise 6.2 64bit_86;CentOS 4.4 32bit_87;CentOS 4.4 64bit_88;CentOS 4.5 32bit_89;CentOS 4.5 64bit_90;CentOS 4.6 32bit_91;CentOS 4.6 64bit_92;CentOS 4.7 32bit_93;CentOS 4.7 64bit_94;CentOS 4.8 64bit_95;CentOS 5.0 32bit_96;CentOS 5.0 64bit_97;CentOS 5.1 32bit_98;CentOS 5.1 64bit_99;CentOS 5.2 32bit_100;CentOS 5.2 64bit_101;CentOS 5.3 32bit_102;CentOS 5.3 64bit_103;CentOS 5.4 32bit_104;CentOS 5.5 64bit_105;CentOS 5.6 32bit_106;CentOS 5.6 64bit_107;CentOS 5.7 32bit_108;CentOS 5.7 64bit_109;CentOS 5.8 32bit_110;CentOS 5.8 64bit_111;CentOS 6.0 32bit_112;CentOS 6.0 64bit_113;CentOS 6.1 32bit_114;CentOS 6.1 64bit_115;CentOS 6.2 32bit_116;CentOS 6.2 64bit_117;Ubuntu 8.04.4 desktop 32bit_118;Ubuntu 8.04 desktop 64bit_119;Ubuntu 10.04.1 desktop 32bit_120;Ubuntu 10.04 desktop 64bit_121;Ubuntu 10.10 server 64bit_122;Fedora 9 32bit_123;Fedora 12 32bit_124;Neoshine Linux Server 5.4 64bit_125;Fedora 14 64bit_155;openSUSE 11.3 64bit_156;Oracle Linux Server release 5.7 64bit_127;Redhat Linux Enterprise 3.0 32bit_129;Redhat Linux Enterprise 3.4 32bit_130;Debian GNU/Linux 6.0.4 64bit_131;Ubuntu Server 12.04 64bit_132;Oracle Linux Server release 6.1 32bit_133;Oracle Linux Server release 6.1 64bit_134;Redhat Linux Enterprise 6.3 64bit_135;Redhat Linux Enterprise 6.3 32bit_136;CentOS 6.3 32bit_137;CentOS 6.3 64bit_138;DOPRA ICTOM V002R003 EIMP 64bit_139;DOPRA ICTOM V002R003 IMAOS 64bit_140;Debian GNU/Linux 6.0.5 64bit_141;Ubuntu 10.04 server 64bit_142;Ubuntu 10.04.1 server 64bit_143;Ubuntu 10.04.2 server 64bit_144;Ubuntu 10.04.3 server 64bit_145;Ubuntu 11.10 server 32bit_146;Ubuntu 11.10 server 64bit_147;Ubuntu 12.04 desktop 64bit_148;Ubuntu 12.04.1 desktop 64bit_149;Ubuntu 12.04.1 server 64bit_150;Red Flag Asianux Server 3.3 32bit_151;Red Flag Asianux Server 3.3 64bit_152;Red Flag Asianux Server 4.2 32bit_153;Red Flag Asianux Server 4.2 64bit_154;Other Linux(32 bit)_301;Other Linux(64 bit)_302;Novell SUSE Linux Enterprise Server 11 SP2 32bit_303;Novell SUSE Linux Enterprise Server 11 SP2 64bit_304;Novell SUSE Linux Enterprise 11 64bit_200;Novell SUSE Linux Enterprise 11 32bit_201;Novell SUSE Linux Enterprise 10 64bit_202;Novell SUSE Linux Enterprise 10 32bit_203;Novell SUSE Linux Enterprise 8 64bit_204;Novell SUSE Linux Enterprise 8 32bit_205;Novell SUSE Linux Enterprise 9 64bit_206;Novell SUSE Linux Enterprise 9 32bit_207;Asianux 4 64bit_208;Asianux 4 32bit_209;Asianux 3 64bit_210;Asianux 3 32bit_211;Red Hat Enterprise Linux 6 64bit_212;Red Hat Enterprise Linux 6 32bit_213;Red Hat Enterprise Linux 5 64bit_214;Red Hat Enterprise Linux 5 32bit_215;Red Hat Enterprise Linux 4 64bit_216;Red Hat Enterprise Linux 4 32bit_217;Red Hat Enterprise Linux 3 64bit_218;Red Hat Enterprise Linux 3 32bit_219;Red Hat Enterprise Linux 2.1_220;CentOS 4/5/6 64bit_221;CentOS 4/5/6 32bit_222;Debian GNU/Linux 6 64bit_223;Debian GNU/Linux 6 32bit_224;Debian GNU/Linux 5 64bit_225;Debian GNU/Linux 5 32bit_226;Debian GNU/Linux 4 64bit_227;Debian GNU/Linux 4 32bit_228;Novell Open Enterprise Server_229;Oracle Linux 4/5/6 64bit_230;Oracle Linux 4/5/6 32bit_231;Ubuntu Linux 64bit_232;Ubuntu Linux 32bit_233;Other 2.6.x Linux 64bit_234;Other 2.6.x Linux 32bit_235;Other 2.4.x Linux 64bit_236;Other 2.4.x Linux 32bit_237;Other Linux 64bit_238;Other Linux 32bit_239;CentOS 4.5 (32-bit)_615;CentOS 4.6 (32-bit)_616;CentOS 4.7 (32-bit)_617;CentOS 4.8 (32-bit)_618;CentOS 5 (32-bit)_619;CentOS 5 (64-bit)_620;Debian Lenny 5.0 (32-bit)_621;Debian Squeeze 6.0 (32-bit)_622;Debian Squeeze 6.0 (64-bit) (experimental)_623;Red Hat Enterprise Linux 6 (64-bit)_624;Red Hat Enterprise Linux 4.5 (32-bit)_625;Red Hat Enterprise Linux 4.6 (32-bit)_626;Red Hat Enterprise Linux 4.7 (32-bit)_627;Red Hat Enterprise Linux 5 (32-bit)_628;Red Hat Enterprise Linux 5 (64-bit)_629;Red Hat Enterprise Linux 4.8 (32-bit)_630;Red Hat Enterprise Linux 6 (32-bit)_631;Ubuntu Lucid Lynx 10.04 (32-bit) (experimental)_632;Ubuntu Lucid Lynx 10.04 (64-bit) (experimental)_633;Oracle Enterprise Linux 5 (32-bit)_634;Oracle Enterprise Linux 5 (64-bit)_635;SUSE Linux Enterprise Server 11 (32-bit)_636;SUSE Linux Enterprise Server 11 SP1 (32-bit)_637;SUSE Linux Enterprise Server 10 SP1 (32-bit)_638;SUSE Linux Enterprise Server 9 SP4 (32-bit)_639;SUSE Linux Enterprise Server 10 SP2 (64-bit)_640;SUSE Linux Enterprise Server 10 SP2 (32-bit)_641;SUSE Linux Enterprise Server 10 SP3 (64-bit)_642;SUSE Linux Enterprise Server 11 (64-bit)_643;SUSE Linux Enterprise Server 10 SP1 (64-bit)_644;SUSE Linux Enterprise Server 11 SP1 (64-bit)_645;Redhat Linux Enterprise 6.4 32bit_158;Redhat Linux Enterprise 6.4 64bit_159",
                "windows": "Windows Server 2008 R2 Datacenter 64bit_1;Windows Server 2008 R2 Enterprise 64bit_2;Windows Server 2008 R2 Standard 64bit_3;Windows Server 2008 Datacenter 32bit_4;Windows Server 2008 Datacenter 64bit_5;Windows Server 2008 Enterprise 32bit_6;Windows Server 2008 Enterprise 64bit_7;Windows Server 2008 Standard 32bit_8;Windows Server 2008 Standard 64bit_9;Windows Server 2003 Datacenter 32bit_10;Windows Server 2003 Datacenter 64bit_11;Windows Server 2003 Enterprise 32bit_12;Windows Server 2003 Standard 32bit_14;Windows Server 2003 Standard 64bit_15;Windows Server 2003 R2 Datacenter 32bit_16;Windows Server 2003 R2 Datacenter 64bit_17;Windows Server 2003 R2 Enterprise 32bit_18;Windows Server 2003 R2 Enterprise 64bit_19;Windows Server 2003 R2 Standard 32bit_20;Windows Server 2003 R2 Standard 64bit_21;Windows 7 Ultimate 32bit_22;Windows 7 Ultimate 64bit_23;Windows 7 Enterprise 32bit_24;Windows 7 Enterprise 64bit_25;Windows 7 Professional 32bit_26;Windows 7 Professional 64bit_27;Windows 7 Home Premium 32bit_28;Windows 7 Home Premium 64bit_29;Windows 7 Home Basic 32bit_30;Windows 7 Home Basic 64bit_31;Windows XP Professional 32bit_32;Windows XP Home Edition_33;Windows Server 2008 WEB R2 64bit_59;Windows 2000 Advanced Server SP4_60;Windows 2000 Server SP4_61;Windows 8 32bit_126;Windows 8 64 bit_128;Windows 8 Server 64bit_200;Windows Server 2008 R2 64bit_201;Windows Server 2008 64bit_202;Windows Server 2008 32bit_203;Windows Server 2003 64bit_204;Windows Server 2003 32bit_205;Windows Server 2003 Web Edition 32bit_206;Small Business Server 2003_207;Windows Millenium Edition_208;Windows 8 64bit_209;Windows 8 32bit_210;Windows 7 64bit_211;Windows 7 32bit_212;Windows Vista 64bit_213;Windows Vista 32bit_214;Windows XP Professional 64bit_215;Windows 2000_216;Windows 2000 Server_217;Windows 2000 Professional_218;Windows NT_219;Windows 98_220;Windows 95_221;Windows 3.1_222;MSDOS_223;Windows 2012 64bit_129;Other Windows(32 bit)_201;Other Windows(64 bit)_202;Citrix XenApp on Windows Server 2003 (32-bit)_600;Citrix XenApp on Windows Server 2003 (64-bit)_601;Citrix XenApp on Windows Server 2008 (32-bit)_602;Citrix XenApp on Windows Server 2008 (64-bit)_603;Citrix XenApp on Windows Server 2008 R2 (64-bit)_604;Windows Vista (32-bit)_605;Windows Server 2008 (32-bit)_606;Windows Server 2008 (64-bit)_607;Windows Server 2008 R2 (64-bit)_608;Windows 7 (32-bit)_609;Windows 7 (64-bit)_610;Windows XP SP3 (32-bit)_611;Windows Server 2003 (64-bit)_612;Windows Server 2003 (32-bit)_613",
                "getVersionInfo": function (osType, osVersion) {
                    var versionList = [];
                    if (osType === 'Windows') {
                        versionList = $scope.versionConfig.windows.split(";");
                    } else {
                        versionList = $scope.versionConfig.Linux.split(";");
                    }

                    var versions = [];
                    for (var index in versionList) {
                        var key = versionList[index].substr(0, versionList[index].lastIndexOf("_"));
                        if (key != "") {
                            var version = {
                                "selectId":versionList[index],
                                "label":key
                            };

                            if (osVersion != undefined) {
                                if (key == osVersion || versionList[index] == osVersion) {
                                    version.checked = true;
                                }
                            } else {
                                if (index == 0) {
                                    version.checked = true;
                                }
                            }

                            versions.push(version);
                        }
                    }

                    return versions;
                }
            };

            $scope.operator = {
                "queryDataStore":function (clusterId) {
                    var deferred = camel.post({
                        "url": {"s":constants.rest.VMT_DATASTORE_QUERY.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify({
                            category: "1",
                            detail: 0,
                            limit: 100,
                            offset: 0,
                            scopeObjectId: clusterId,
                            scopeType: "CLUSTER"
                        }),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });

                    deferred.success(function (data) {
                        if (!data || !data.datastoreInfos) {
                            $scope.secStorage.values = [];
                        } else {

                            var secStorages = [];
                            for (var index in data.datastoreInfos) {
                                secStorages.push({
                                    "selectId": data.datastoreInfos[index].id,
                                    "label": data.datastoreInfos[index].name,
                                    "checked": false
                                });
                            }

                            $scope.secStorage.values = secStorages;
                        }
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            // 初始化操作
            $scope.init = function() {
                $scope.diskTable.clear();

                var diskNum = 2;
                for (var index = 0; index < diskNum; index++) {
                    $scope.diskTable.add(undefined);
                }
            };

            // 事件处理
            $scope.$on($scope.createVmtEvents.baseInfoChangedFromParent, function (event, msg) {

                // 查询二级存储
                $scope.operator.queryDataStore($scope.service.model.clusterId || "");

                var deferred = camel.post({
                    "url": {"s":constants.rest.VMT_VM_OSVERSION_INFO.url,"o":{"tenant_id":1}},
                    "params": JSON.stringify({"listSupportedOsInfo":{"resourceClusterId":$scope.service.model.clusterId, "hypervisorId":$scope.service.model.hypervisorID}}),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });

                deferred.done(function(data) {
                    $scope.$apply(function() {
                        if (!data || !data.listSupportedOsInfo || !data.listSupportedOsInfo.osInfos) {
                            $scope.osVesion.values = $scope.versionConfig.getVersionInfo($scope.service.model.osOption.osType == undefined ? "Linux" : $scope.service.model.osOption.osType, $scope.service.model.osOption.osVersion);
                            return;
                        }

                        var linux = "";
                        var linuxList = data.listSupportedOsInfo.osInfos["Linux"];
                        for (var index in linuxList) {
                            linux += linuxList[index].osVersiontype + "_" +linuxList[index].osVersion + ";";
                        }

                        var windows = "";
                        var windowsList = data.listSupportedOsInfo.osInfos["Windows"];
                        for (var index in windowsList) {
                            windows += windowsList[index].osVersiontype + "_" +windowsList[index].osVersion + ";";
                        }

                        $scope.versionConfig.Linux = linux;
                        $scope.versionConfig.windows = windows;

                        $scope.osVesion.values = $scope.versionConfig.getVersionInfo($scope.service.model.osOption.osType == undefined ? "Linux" : $scope.service.model.osOption.osType, $scope.service.model.osOption.osVersion);
                    });
                });

                deferred.fail(function() {
                    $scope.$apply(function() {
                        $scope.osVesion.values = $scope.versionConfig.getVersionInfo($scope.service.model.osOption.osType == undefined ? "Linux" : $scope.service.model.osOption.osType, $scope.service.model.osOption.osVersion);
                    });
                });
                // 根据虚拟化环境、集群等信息，初始化规格页面信息
                // 查询存储介质类型 VMT_DISK_CONFIG_QUERY
                var deferred = camel.post({
                    "url": {"s":constants.rest.VMT_DISK_CONFIG_QUERY.url,"o":{"tenant_id":1}},
                    "params": JSON.stringify({"refreshDiskPara":{"clusterId":$scope.service.model.clusterId, "way":"0"}}),
                    "beforeSend": function (request) {
                        request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                    }
                });

                deferred.success(function (data) {
                    $scope.$apply(function() {
                        $scope.qosMap = data.diskParams && data.diskParams.qosMap || {};
                        $scope.init();
                    });
                });
                deferred.fail(function (data) {
                    exception.doException(data, null);
                });
            });

            $scope.init();

        }];

        return specInfoCtrl;
    });
