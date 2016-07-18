/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"
], function ($, angular, Message, UnifyValid, Exception) {
    "use strict";

    var optionCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel","validator", function ($scope, $state, $stateParams, $compile, camel,validator) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        $scope.hyperType = $stateParams.vmType;
        $scope.curOption = "os";
        $scope.help = {
            show: false
        };
        var fcOption = [
            {
                "option": $scope.i18n.common_term_OS_label,
                "id": "os"
            },
            {
                "option": "HA",
                "id": "ha"
            },
            {
                "option": $scope.i18n.common_term_startupMode_label,
                "id": "startMethod"
            },
            {
                "option": $scope.i18n.sys_term_timeSync_label,
                "id": "clockPolicy"
            },
            {
                "option": $scope.i18n.common_term_liveAdjust_label,
                "id": "hotPlug"
            },
            {
                "option": $scope.i18n.common_term_updateMode_label,
                "id": "updateMethod"
            },
            {
                "option": $scope.i18n.vm_term_basicBlockLiveMig_label,
                "id": "hotMigrate"
            },
            {
                "option": $scope.i18n.vm_term_vmAntivirus_label,
                "id": "antiVirus"
            }
        ];

        var xenOption = [
            {
                "option": $scope.i18n.common_term_OS_label,
                "id": "os"
            },
            {
                "option": "HA",
                "id": "ha"
            },
            {
                "option": $scope.i18n.common_term_startupMode_label,
                "id": "startMethod"
            },
            {
                "option": $scope.i18n.sys_term_timeSync_label,
                "id": "clockPolicy"
            }
        ];
        var vmwareOption = [
            {
                "option": $scope.i18n.common_term_OS_label,
                "id": "os"
            },
            {
                "option": "HA",
                "id": "ha"
            },
            {
                "option": $scope.i18n.common_term_startupMode_label,
                "id": "startMethod"
            },
            {
                "option": $scope.i18n.sys_term_timeSync_label,
                "id": "clockPolicy"
            },
            {
                "option": $scope.i18n.common_term_liveAdjust_label,
                "id": "hotPlug"
            }
        ];
        //选项列表
        $scope.optionTable = {
            "id": "vmInfoOptionTable",
            "data": [],
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_option_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.option);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).click(function () {
                    $scope.$apply(function () {
                        $scope.curOption = aData.id;
                    });
                });
                if (iDataIndex == 0) {
                    $(nRow).addClass("clickTrColor");
                }
            }
        };

        $scope.optionUrl = {
            "os": "../src/app/business/resources/views/hypervisor/vmInfo/optionOs.html",
            "ha": "../src/app/business/resources/views/hypervisor/vmInfo/optionHa.html",
            "startMethod": "../src/app/business/resources/views/hypervisor/vmInfo/optionStartMethod.html",
            "clockPolicy": "../src/app/business/resources/views/hypervisor/vmInfo/optionClockPolicy.html",
            "hotPlug": "../src/app/business/resources/views/hypervisor/vmInfo/optionHotPlug.html",
            "updateMethod": "../src/app/business/resources/views/hypervisor/vmInfo/optionUpdateMethod.html",
            "hotMigrate": "../src/app/business/resources/views/hypervisor/vmInfo/optionHotMigrate.html",
            "antiVirus": "../src/app/business/resources/views/hypervisor/vmInfo/optionAntiVirus.html",
            "memVol": "../src/app/business/resources/views/hypervisor/vmInfo/optionMemVol.html"
        };

        //操作系统页面
        $scope.isOther = false;
        $scope.LinuxVersions = [];
        $scope.WindowsVersions = [];
        $scope.OtherVersions = [];
        //操作系统类型下拉框
        $scope.osTypeSelector = {
            "id": "osTypeSelector",
            "width": "350",
            "label": ($scope.i18n.common_term_OStype_label || "操作系统类型") + ":",
            "values": [
                {
                    "selectId": "Linux",
                    "label": "Linux"
                },
                {
                    "selectId": "Windows",
                    "label": "Windows"
                },
                {
                    "selectId": "Other",
                    "label": "Other"
                }
            ],
            change: function () {
                var osType = $("#" + $scope.osTypeSelector.id).widget().getSelectedId();
                $("#" + $scope.osVersionSelector.id).widget().option("values", $scope[osType + "Versions"]);
                judgeOther();
            }
        };
        //操作系统版本下拉框
        $scope.osVersionSelector = {
            "id": "osVersionSelector",
            "width": "350",
            "height": "200",
            "label": ($scope.i18n.common_term_OSversion_label || "操作系统版本") + ":",
            "values": [
            ],
            change: function () {
                judgeOther();
            }
        };
        function judgeOther(){
            var osVersion = $("#" + $scope.osVersionSelector.id).widget().getSelectedId();
            if (osVersion === "Other (32 bit)" || osVersion === "Other (64 bit)") {
                $scope.isOther = true;
            }
            else if (osVersion === "Other Linux(32 bit)" || osVersion === "Other Linux(64 bit)") {
                $scope.isOther = true;
            }
            else if (osVersion === "Other Windows(32 bit)" || osVersion === "Other Windows(64 bit)") {
                $scope.isOther = true;
            }
            else {
                $scope.isOther = false;
            }
        }
        //操作系统版本输入框
        $scope.osVersionTextbox = {
            "id": "osVersionTextbox",
            "width": "350",
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空")+
                ";maxSize(64):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}),
            "value": ""
        };
        //操作系统确定按钮
        $scope.osOkButton = {
            "id": "optionOsButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                if ($scope.isOther) {
                    var result = UnifyValid.FormValid($("#optionOsDiv"));
                    if (!result) {
                        return;
                    }
                }
                editOs();
            }
        };

        //HA页面
        //HA下拉框
        $scope.haPolicySelector = {
            "id": "haPolicySelector",
            "width": "135",
            "values": [
                {
                    "selectId": "true",
                    "label": $scope.i18n.common_term_enable_button || "启用",
                    "checked": true
                },
                {
                    "selectId": "false",
                    "label": $scope.i18n.common_term_notOn_value || "不启用"
                }
            ]
        };
        //HA确定按钮
        $scope.haOkButton = {
            "id": "optionHaButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.haPolicySelector.id).widget().getSelectedId();
                editConfig("isEnableHa", result);
            }
        };

        //启动方式页面
        //启动方式下拉框
        $scope.startMethodSelector = {
            "id": "startMethodSelector",
            "width": "200",
            "values": [
                {
                    "selectId": "cdrom",
                    "label": $scope.i18n.template_term_startFromCD_label || "从光驱启动",
                    "checked": true
                },
                {
                    "selectId": "disk",
                    "label": $scope.i18n.template_term_startFromHarddisk_label || "从硬盘启动"
                },
                {
                    "selectId": "pxe",
                    "label": $scope.i18n.template_term_startFromNet_label || "从网络启动"
                }
            ]
        };
        //启动方式确定按钮
        $scope.startMethodOkButton = {
            "id": "optionStartMethodButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.startMethodSelector.id).widget().getSelectedId();
                editConfig("bootOption", result);
            }
        };

        //时钟策略页面
        //时钟同步复选框
        $scope.clockSynCheckbox = {
            "id": "clockSynCheckbox",
            "text": $scope.i18n.template_term_hostCloskSync_label || "与主机时钟同步"
        };
        //确定按钮
        $scope.clockPolicyOkButton = {
            "id": "clockPolicyOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.clockSynCheckbox.id).widget().option("checked");
                if (result) {
                    editConfig("syncTimeWithHost", true);
                }
                else {
                    editConfig("syncTimeWithHost", false);
                }
            }
        };

        //热插拔页面
        //CPU热插拔下拉框
        var cpuValues ={
            fusioncompute:[
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_notOn_value,
                    "checked": true
                },
                {
                    "selectId": "1",
                    "label": $scope.i18n.vm_term_enableCPUliveAdd_button
                }
            ],
            vmware:[
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_notOn_value,
                    "checked": true
                },
                {
                    "selectId": "1",
                    "label": $scope.i18n.vm_term_enableCPUliveAdd_button
                },
                {
                    "selectId": "2",
                    "label": $scope.i18n.vm_term_enableCPUliveAdjust_button
                }
            ]
        };
        $scope.cpuHotPlugSelector = {
            "id": "cpuHotPlugSelector",
            "width": "200",
            "label": $scope.i18n.vm_term_CPUliveAdjust_label + ":",
            "values": cpuValues[$scope.hyperType] || []
        };
        //内存热插下拉框
        $scope.memoryHotPlugSelector = {
            "id": "memoryHotPlugSelector",
            "width": "200",
            "label": $scope.i18n.vm_term_memoryLiveAdd_label+":",
            "values": [
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_notOn_value,
                    "checked": true
                },
                {
                    "selectId": "1",
                    "label": $scope.i18n.vm_term_enableMemoryLiveAdd_button
                }
            ]
        };

        //热插拔确定按钮
        $scope.hotPlugOkButton = {
            "id": "optionHotPlugButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var cpu = $("#" + $scope.cpuHotPlugSelector.id).widget().getSelectedId();
                if($scope.hyperType === "vmware"){
                    var memory = $("#" + $scope.memoryHotPlugSelector.id).widget().getSelectedId();
                    editConfig("cpuHotPlug", cpu,"memHotPlug",memory);
                }
                else{
                    editConfig("cpuHotPlug", cpu);
                }
            }
        };


        //升级方式页面
        //升级方式单选组
        $scope.updateMethodRadioGroup = {
            "id": "updateMethodRadioGroup",
            "values": [
                {
                    "key": "auto",
                    "text": $scope.i18n.common_term_auto_label || "自动",
                    "checked": true,
                    "disabled": false
                },
                {
                    "key": "manual",
                    "text": $scope.i18n.common_term_manual_label || "手动",
                    "checked": false,
                    "disabled": false
                }
            ],
            "layout": "vertical"
        };
        //升级方式确定按钮
        $scope.updateMethodOkButton = {
            "id": "updateMethodOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.updateMethodRadioGroup.id).widget().opChecked("auto");
                editConfig("isAutoUpgrade", result);
            }
        };

        //热迁移页面
        //热迁移属性单选组
        $scope.hotMigrateRadioGroup = {
            "id": "hotMigrateRadioGroup",
            "values": [
                {
                    "key": "unsupport",
                    "text": $scope.i18n.common_term_notSupport_value || "不支持",
                    "checked": true,
                    "disabled": false
                },
                {
                    "key": "support",
                    "text": $scope.i18n.common_term_support_value || "支持",
                    "checked": false,
                    "disabled": false
                }
            ],
            "layout": "vertical"
        };
        //热迁移确定按钮
        $scope.hotMigrateOkButton = {
            "id": "hotMigrateOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.hotMigrateRadioGroup.id).widget().opChecked("support");
                editConfig("attachType", result);
            }
        };

        //虚拟机防病毒页面
        //开启虚拟机防病毒复选框
        $scope.antiVirusCheckbox = {
            id: "antiVirusCheckbox",
            text: $scope.i18n.common_term_turnOnAntivirus_button || "开启虚拟机防病毒",
            "checked": false,
            "change": function () {
                var result = $("#" + $scope.antiVirusCheckbox.id).widget().option("checked");
                $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", !result);
                $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", !result);
            }
        };
        //安全虚拟机类型
        $scope.secureVmTypeRadio = {
            "id": "secureVmTypeRadio",
            "label": $scope.i18n.vm_term_securityVMtype_label || "安全虚拟机类型:",
            "values": [
                {
                    "key": "SVM",
                    "text": $scope.i18n.vm_term_securityServiceVM_label || "安全服务虚拟机",
                    "checked": true,
                    "disable": true
                },
                {
                    "key": "GVM",
                    "text": $scope.i18n.vm_term_securityUserVM_label || "安全用户虚拟机",
                    "checked": false,
                    "disable": true
                }
            ],
            "layout": "horizon",
            "change": function () {

            }
        };
        //确定按钮
        $scope.antiVirusOkButton = {
            "id": "antiVirusOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var secureVmType = null;
                var open = $("#" + $scope.antiVirusCheckbox.id).widget().option("checked");
                if (open) {
                    secureVmType = $("#" + $scope.secureVmTypeRadio.id).widget().opChecked("checked");
                }
                editConfig("secureVmType", secureVmType);
            }
        };

        //内存交换磁盘
        //内存交换磁盘复选框
        $scope.memVolCheckbox = {
            id: "memVolCheckbox",
            text: $scope.i18n.common_term_turnOnMemExchangeDisk_button || "开启内存交换磁盘",
            "checked": false,
            "change": function () {
            }
        };
        //确定按钮
        $scope.memVolOkButton = {
            "id": "memVolOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = $("#" + $scope.memVolCheckbox.id).widget().option("checked");
                editConfig("isEnableMemVol", result);
            }
        };

        function getData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                $scope.hypervisorId = vmInfo.hypervisorId;
                var options = vmInfo && vmInfo.vmConfig && vmInfo.vmConfig.attribute;
                if (options.syncTimeWithHost) {
                    $("#" + $scope.clockSynCheckbox.id).widget().option("checked", true);
                }
                var enableHa = options.enableHa || false;
                enableHa = enableHa && true;
                $("#" + $scope.haPolicySelector.id).widget().opChecked(enableHa.toString());
                $("#" + $scope.startMethodSelector.id).widget().opChecked(options.bootOption);

                $("#" + $scope.memVolCheckbox.id).widget().option("checked", true);

                var cpuInfo = vmInfo && vmInfo.vmConfig && vmInfo.vmConfig.cpu;
                $("#" + $scope.cpuHotPlugSelector.id).widget().opChecked(cpuInfo.cpuHotPlug);
                var memoryInfo = vmInfo && vmInfo.vmConfig && vmInfo.vmConfig.memory;
                $("#" + $scope.memoryHotPlugSelector.id).widget().opChecked(memoryInfo.memHotPlug);

                var osInfo = vmInfo && vmInfo.os;
                $scope.osType = osInfo.osType;
                $scope.osVersionType = osInfo.osVersiontype;
                $scope.customizedOsName = osInfo.customizedOsName;

                var secureVmType = options.secureVmType;
                if (secureVmType) {
                    $("#" + $scope.antiVirusCheckbox.id).widget().option("checked", true);
                    $("#" + $scope.secureVmTypeRadio.id).widget().opChecked(secureVmType, true);
                    $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", false);
                    $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", false);
                }

                var status = vmInfo.status;
                if (status !== "stopped") {
                    $("#" + $scope.osTypeSelector.id).widget().option("disable", true);
                    $("#" + $scope.osVersionSelector.id).widget().option("disable", true);
                    //没有权限时，按钮会不存在
                    if ($("#" + $scope.osOkButton.id).widget()) {
                        $("#" + $scope.osOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.clockSynCheckbox.id).widget().option("disable", true);
                    if ($("#" + $scope.clockPolicyOkButton.id).widget()) {
                        $("#" + $scope.clockPolicyOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.cpuHotPlugSelector.id).widget().option("disable", true);
                    $("#" + $scope.memoryHotPlugSelector.id).widget().option("disable", true);
                    if ($("#" + $scope.hotPlugOkButton.id).widget()) {
                        $("#" + $scope.hotPlugOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("SVM", true);
                    $("#" + $scope.secureVmTypeRadio.id).widget().opDisabled("GVM", true);
                    $("#" + $scope.antiVirusCheckbox.id).widget().option("disable", true);
                    if ($("#" + $scope.antiVirusOkButton.id).widget()) {
                        $("#" + $scope.antiVirusOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.memVolCheckbox.id).widget().option("disable", true);
                    if ($("#" + $scope.memVolOkButton.id).widget()) {
                        $("#" + $scope.memVolOkButton.id).widget().option("disable", true);
                    }
                }
                if (status !== "stopped" && status !== "running") {
                    $("#" + $scope.haPolicySelector.id).widget().option("disable", true);
                    if ($("#" + $scope.haOkButton.id).widget()) {
                        $("#" + $scope.haOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.startMethodSelector.id).widget().option("disable", true);
                    if ($("#" + $scope.startMethodOkButton.id).widget()) {
                        $("#" + $scope.startMethodOkButton.id).widget().option("disable", true);
                    }

                    $("#" + $scope.updateMethodRadioGroup.id).widget().opDisabled("auto", true);
                    $("#" + $scope.updateMethodRadioGroup.id).widget().opDisabled("manual", true);
                    if ($("#" + $scope.updateMethodOkButton.id).widget()) {
                        $("#" + $scope.updateMethodOkButton.id).widget().option("disable", true);
                    }
                }
                if (vmInfo.vmType === "vmware") {
                    if(status !== "stopped" && status !== "hibernated"){
                        $("#" + $scope.hotMigrateRadioGroup.id).widget().opDisabled("unsupport", true);
                        $("#" + $scope.hotMigrateRadioGroup.id).widget().opDisabled("support", true);
                        if ($("#" + $scope.hotMigrateOkButton.id).widget()) {
                            $("#" + $scope.hotMigrateOkButton.id).widget().option("disable", true);
                        }
                    }
                    $("#" + $scope.optionTable.id).widget().option("data", vmwareOption);
                }
                else if (vmInfo.vmType === "xen") {
                    $("#" + $scope.optionTable.id).widget().option("data", xenOption);
                }
                else {
                    if(status !== "stopped"){
                        $("#" + $scope.hotMigrateRadioGroup.id).widget().opDisabled("unsupport", true);
                        $("#" + $scope.hotMigrateRadioGroup.id).widget().opDisabled("support", true);
                        if ($("#" + $scope.hotMigrateOkButton.id).widget()) {
                            $("#" + $scope.hotMigrateOkButton.id).widget().option("disable", true);
                        }
                    }
                    $("#" + $scope.optionTable.id).widget().option("data", fcOption);
                    $("#" + $scope.updateMethodRadioGroup.id).widget().opChecked(options.isAutoUpgrade ? "auto" : "manual", true);
                    $("#" + $scope.hotMigrateRadioGroup.id).widget().opChecked(options.attachType ? "support" : "unsupport", true);
                }
                getOsInfo();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getOsInfo() {
            var params = {
                listSupportedOsInfo: {
                    hypervisorId: $scope.hypervisorId
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/vms/action"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var osInfo = data.listSupportedOsInfo && data.listSupportedOsInfo.osInfos || {};
                for (var i = 0; osInfo.Linux && i < osInfo.Linux.length; i++) {
                    var version = {
                        "selectId": osInfo.Linux[i].osVersiontype,
                        "label": osInfo.Linux[i].osVersiontype
                    };
                    if (i == 0) {
                        version.checked = true;
                    }
                    $scope.LinuxVersions.push(version);
                }
                for (var i = 0; osInfo.Windows && i < osInfo.Windows.length; i++) {
                    var version = {
                        "selectId": osInfo.Windows[i].osVersiontype,
                        "label": osInfo.Windows[i].osVersiontype
                    };
                    if (i == 0) {
                        version.checked = true;
                    }
                    $scope.WindowsVersions.push(version);
                }
                for (var i = 0; osInfo.Other && i < osInfo.Other.length; i++) {
                    var version = {
                        "selectId": osInfo.Other[i].osVersiontype,
                        "label": osInfo.Other[i].osVersiontype
                    };
                    if (i == 0) {
                        version.checked = true;
                    }
                    $scope.OtherVersions.push(version);
                }
                $("#" + $scope.osVersionSelector.id).widget().option("values", $scope[$scope.osType + "Versions"]);
                $("#" + $scope.osTypeSelector.id).widget().opChecked($scope.osType);
                $("#" + $scope.osVersionSelector.id).widget().opChecked($scope.osVersionType);
                $scope.$apply(function(){
                    judgeOther();
                });
                $("#"+$scope.osVersionTextbox.id).widget().option("value",$scope.customizedOsName);
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function editConfig(key, value,key1,value1) {
            var params = { };
            params.spec = {};
            if (key === "cpuHotPlug") {
                params.spec.cpu = {};
                params.spec.cpu[key] = value;
            }
            else {
                params.spec.attribute = {};
                params.spec.attribute[key] = value;
            }
            if (key1 === "memHotPlug") {
                params.spec.memory = {};
                params.spec.memory[key1] = value1;
            }
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var options = {
                    type: "prompt",
                    content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                    height: "150px",
                    width: "350px",
                    modal: true
                };
                var msg = new Message(options);
                msg.show();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function editOs() {
            var params = {
                spec: {
                    osInfo: {
                        osType: $("#" + $scope.osTypeSelector.id).widget().getSelectedId(),
                        osVersiontype: $("#" + $scope.osVersionSelector.id).widget().getSelectedId()
                    }
                }
            };
            if ($scope.isOther) {
                params.spec.osInfo.customizedOsName = $("#" + $scope.osVersionTextbox.id).widget().getValue();
            }
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var options = {
                    type: "prompt",
                    content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                    height: "150px",
                    width: "350px",
                    modal: true
                };
                var msg = new Message(options);
                msg.show();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getData();
    }];
    return optionCtrl;
});
