/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, Exception) {
    "use strict";

    var hardwareCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        var viewDiskRight = user.privilege["role_role_add_option_diskView_value.609000"];
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        $scope.help = {
            show: false
        };
        var hardwareList = [
            {
                "hardware": "CPU",
                "summary": ($scope.i18n.common_term_entry_label ||"个"),
                "id": "cpu"
            },
            {
                "hardware": $scope.i18n.common_term_memory_label || "内存",
                "summary": "MB",
                "id": "memory"
            },
            {
                "hardware": $scope.i18n.common_term_disk_label || "磁盘",
                "summary": ($scope.i18n.common_term_entry_label ||"个"),
                "id": "disk",
                "hide":!viewDiskRight
            },
            {
                "hardware": $scope.i18n.common_term_NIC_label || "网卡",
                "summary": ($scope.i18n.common_term_entry_label ||"个"),
                "id": "nic"
            },
            {
                "hardware": $scope.i18n.vm_term_USBcontrol_label || "USB控制器",
                "summary": "",
                "id": "controller"
            },
            {
                "hardware": $scope.i18n.vm_term_USBdevice_label || "USB设备",
                "summary": ($scope.i18n.common_term_entry_label ||"个"),
                "id": "device"
            },
            {
                "hardware": $scope.i18n.common_term_CDROM_label || "光驱",
                "summary": "",
                "id": "cd"
            }
        ];
        //硬件列表
        $scope.hardwareTable = {
            "id": "vmInfoHardwareTable",
            "data": null,
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_hardware_label || "硬件",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hardware);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_summary_label || "摘要",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.summary);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $(nRow).click(function () {
                    $state.go("resources.vmInfo.hardware." + aData.id);
                });
                if ($state.$current.name === 'resources.vmInfo.hardware.' + aData.id) {
                    $(nRow).addClass("clickTrColor");
                }
                if(aData.hide){
                    $(nRow).hide();
                }
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
                var coreNum = vmInfo.vmConfig.cpu.quantity;
                var coreConfig = vmInfo.vmRebootConfig.cpu.quantity;
                if (coreNum == coreConfig) {
                    hardwareList[0].summary = coreNum + ($scope.i18n.common_term_entry_label ||"个");
                }
                else {
                    hardwareList[0].summary = coreConfig + ($scope.i18n.common_term_entry_label ||"个") + "(" +
                        ($scope.i18n.common_term_noEffect_value ||"未生效") + ")";
                }
                var memorySize = vmInfo.vmConfig.memory.quantityMB;
                var memoryConfig = vmInfo.vmRebootConfig.memory.quantityMB;
                if (memorySize == memoryConfig) {
                    hardwareList[1].summary = memoryConfig + "MB";
                }
                else {
                    hardwareList[1].summary = memoryConfig + "MB("+($scope.i18n.common_term_noEffect_value || "未生效" )+")";
                }
                var disks = vmInfo.vmConfig.disks || [];
                hardwareList[2].summary = disks.length + ($scope.i18n.common_term_entry_label ||"个");
                var nics = vmInfo.vmConfig.nics || [];
                hardwareList[3].summary = nics.length + ($scope.i18n.common_term_entry_label ||"个");
                var controllers = vmInfo.vmConfig.usbControllers || [];
                hardwareList[4].summary = controllers.length > 0 ? ($scope.i18n.common_term_Exist_value || "存在") : ($scope.i18n.common_term_notExist_value || "不存在");
                var usbNum = vmInfo.vmConfig.usbNum || 0;
                hardwareList[5].summary = usbNum + ($scope.i18n.common_term_entry_label ||"个");
                $scope.$apply(function () {
                    $scope.hardwareTable.data = hardwareList;
                });
                getCd();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getCd() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}/iso", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var devicePath = data && data.devicePath;
                $scope.hardwareTable.data[6].summary = devicePath ? ($scope.i18n.common_term_Exist_value || "存在") : ($scope.i18n.common_term_none_label || "无");
                $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getData();

    }];
    return hardwareCtrl;
});
