/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Checkbox",
    "app/business/resources/services/hardwareService",
    "app/services/exceptionService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, TextBox, Button, Window, Message, Checkbox, HardwareService, Exception) {
        "use strict";
        var hardwareCtrl = ['$scope', '$state', '$stateParams',
                "$compile", "camel", "$q",
                function ($scope, $state, $stateParams, $compile, camel, $q) {
                    var exceptionService = new Exception();
                    var user = $("html").scope().user;
                    $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                    $scope.serverType = $stateParams.serverType;
                    var powerTableColumns = [
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "Power(W)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.power);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.status);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.powerTableModel = {
                        "id": "powerTable",
                        "data": "",
                        "columns": powerTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };
                    var fanTableColumns = [
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.device_term_rotationSpeed_label + "(Rev/Min)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.speed);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.status);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.fanTableModel = {
                        "id": "fanTable",
                        "data": "",
                        "columns": fanTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    $scope.biosInfo = {};
                    $scope.bios = {
                        vendor: {
                            "label": $scope.i18n.device_term_BIOScompany_label + ":",
                            "value": $scope.biosInfo.vendor
                        },
                        version: {
                            "label": $scope.i18n.device_term_BIOSversion_label + ":",
                            "value": $scope.biosInfo.version
                        },
                        releaseDate: {
                            "label": $scope.i18n.device_term_BIOSdate_label + ":",
                            "value": $scope.biosInfo.releaseDate
                        },
                        mbManufacturer: {
                            "label": $scope.i18n.device_term_motherboardManufacturer_label + ":",
                            "value": $scope.biosInfo.mbManufacturer
                        },
                        mbModel: {
                            "label": $scope.i18n.device_term_motherboardType_label + ":",
                            "value": $scope.biosInfo.mbModel
                        },
                        mbVersion: {
                            "label": $scope.i18n.device_term_motherboardVersion_label + ":",
                            "value": $scope.biosInfo.mbVersion
                        },
                        mbSn: {
                            "label": $scope.i18n.device_term_motherboardSN_label + ":",
                            "value": $scope.biosInfo.mbSn
                        },
                        serverManufacturer: {
                            "label": $scope.i18n.device_term_serverCompany_label + ":",
                            "value": $scope.biosInfo.serverManufacturer
                        },
                        serverModel: {
                            "label": $scope.i18n.device_term_serverType_label + ":",
                            "value": $scope.biosInfo.serverModel
                        },
                        serverVersion: {
                            "label": $scope.i18n.device_term_serverVersion_label + ":",
                            "value": $scope.biosInfo.serverVersion
                        },
                        serverSn: {
                            "label": $scope.i18n.device_term_serverSN_label + ":",
                            "value": $scope.biosInfo.serverSn
                        }
                    };
                    var cpuTableColumns = [
                        {
                            "sTitle": $scope.i18n.common_term_Number_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.sn);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.device_term_model_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.model);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_frequency_label + "(GHz)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.frequency);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_coreNum_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cores);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_threadNum_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.threads);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_serial_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.serials);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_manufacturers_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.manufacturer);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.cpuTableModel = {
                        "id": "cpuTable",
                        "data": [],
                        "columns": cpuTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var memoTableColumns = [
                        {
                            "sTitle": $scope.i18n.common_term_location_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.location);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_manufacturers_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.manufacturer);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacity_label + "(GB)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.capacity);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.memoTableModel = {
                        "id": "memoTable",
                        "data": [],
                        "columns": memoTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var phyDiskTableColumns = [
                        {
                            "sTitle": $scope.i18n.device_term_slotID_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.slotnum);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.type);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacity_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.capacity);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_manufacturers_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.manufacturer);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.phyDiskTableModel = {
                        "id": "phyDiskTable",
                        "data": [],
                        "columns": phyDiskTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var logicalDiskTableColumns = [
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacity_label + "(GB)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.size);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.logicalDiskTableModel = {
                        "id": "logicalDiskTable",
                        "data": [],
                        "columns": logicalDiskTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var logicalZoneTableColumns = [
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_capacity_label + "(GB)",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.size);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_usedCapacityGB_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.used);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_UsageRate_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.usage);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.device_term_mountDirectory_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.mounted_dir);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.logicalZoneTableModel = {
                        "id": "logicalZoneTable",
                        "data": [ ],
                        "columns": logicalZoneTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var nicTableColumns = [
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "sWidth": 35,
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.device_term_model_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.model);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.nicTableModel = {
                        "id": "nicTable",
                        "data": [],
                        "columns": nicTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    var networkPortTableColumns = [
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_spec_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.spec);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_duplexMode_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.duplexMode);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_MAC_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.mac);
                            },
                            "bSortable": false
                        }
                    ];

                    $scope.networkPortTableModel = {
                        "id": "networkPortTable",
                        "data": [ ],
                        "columns": networkPortTableColumns,
                        "enablePagination": false,
                        "lengthChange": true,
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "hideTotalRecords": true,
                        "columnsDraggable": true
                    };

                    $scope.searchModel = {
                        vm: "",
                        vmId: "",
                        assignmentStatus: "",
                        deviceStatus: "",
                        curPage: "",
                        prePage: ""
                    };

                    $scope.assignmentStatusFilter = {
                        "id": "assignmentStatusFilter",
                        "width": "120",
                        "values": [
                            {
                                "selectId": "all",
                                "label": $scope.i18n.common_term_allAssignStatus_label || "所有分配状态",
                                "checked": true
                            },
                            {
                                "selectId": "1",
                                "label": $scope.i18n.common_term_used_value || "已分配"
                            },
                            {
                                "selectId": "2",
                                "label": $scope.i18n.common_term_noAssign_value || "未分配"
                            }
                        ],
                        "change": function () {
                            $scope.searchModel.runningStatus = $("#assignmentStatusFilter").widget().getSelectedId();
                        }
                    };

                    $scope.deviceStatusFilter = {
                        "id": "deviceStatusFilter",
                        "width": "120",
                        "values": [
                            {
                                "selectId": "all",
                                "label": $scope.i18n.common_term_allDeviceStatus_label || "所有设备状态",
                                "checked": true
                            },
                            {
                                "selectId": "1",
                                "label":  $scope.i18n.common_term_ready_value || "就绪"
                            },
                            {
                                "selectId": "2",
                                "label":  $scope.i18n.common_term_discovering_value || "发现中"
                            },
                            {
                                "selectId": "3",
                                "label":  $scope.i18n.common_term_used_value || "已分配"
                            }
                        ],
                        "change": function () {
                            $scope.searchModel.deviceStatus = $("#deviceStatusFilter").widget().getSelectedId();
                        }
                    };

                    $scope.searchBox = {
                        "id": "hostSearchBox",
                        "placeholder":  $scope.i18n.device_term_findVMnameID_prom || "请输入虚拟机名称或ID",
                        "type": "round",
                        "width": "200",
                        "suggest-size": 10,
                        "maxLength": 64,
                        "suggest": function (content) {

                        },
                        "search": function (searchString) {
                            $scope.searchModel.vm = searchString;
                            $scope.searchModel.vmId = searchString;
                        }
                    };

                    var usbTableColumns = [
                        {
                            "sTitle": "USB ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.usbId);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_productID_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.productId);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.common_term_assignStatus_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allocateStatusStr);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.device_term_deviceStatus_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusStr);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.common_term_vm_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vmName);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.device_term_deviceVersion_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.version);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false},
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": "",
                            "bSortable": false,
                            "sWidth":"100"
                        }
                    ];

                    $scope.usbTableModel = {
                        "id": "usbTable",
                        "data": [],
                        "columns": usbTableColumns,
                        "enablePagination": false,
                        "paginationStyle": "full-numbers",
                        "lengthChange": true,
                        "lengthMenu": [10, 20, 50],
                        "displayLength": 10,
                        "curPage": {"pageIndex": 1},
                        "requestConfig": {
                            "enableRefresh": false,
                            "refreshInterval": 60000,
                            "httpMethod": "GET",
                            "url": "",
                            "data": "",
                            "sAjaxDataProp": "mData"
                        },
                        "totalRecords": 0,
                        "hideTotalRecords": false,
                        "columnsDraggable": true,
                        "renderRow": function (nRow, aData, iDataIndex) {
                            $("td:eq(0)", nRow).addTitle();
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(4)", nRow).addTitle();
                            $("td:eq(5)", nRow).addTitle();
                            $("td:eq(6)", nRow).addTitle();
                            // 操作列
                            var optColumn = "<div>";
                            if (aData.allocateStatus === "UnAllocated") {
                                optColumn += "<a href='javascript:void(0)' ng-click='bind()'>" + $scope.i18n.vpc_term_bond_label + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                                    "<span class='disabled'>" + $scope.i18n.common_term_unbond_button + "</span></div>";
                            }
                            else {
                                optColumn += "<span  class='disabled'>" + $scope.i18n.vpc_term_bond_label + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" +
                                    "<a href='javascript:void(0)' ng-click='unbind()'>" + $scope.i18n.common_term_unbond_button + "</a></div>";
                            }
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.bind = function () {
                                bindWindow(aData.usbId);
                            };
                            optScope.unbind = function () {
                                unbindMessage(aData.usbId, aData.vmId);
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(7)", nRow).html(optNode);
                        }
                    };
                    function unbindMessage(usbId, vmId) {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.vm_vm_delUSBdevice_info_confirm_msg,
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    majorBtn : true,
                                    handler: function (event) {
                                        removeUsb(usbId, vmId);
                                        msg.destroy();
                                    }
                                },
                                {
                                    label: $scope.i18n.common_term_cancle_button,
                                    default: false,
                                    handler: function (event) {
                                        msg.destroy();
                                    }
                                }
                            ]
                        };
                        var msg = new Message(options);
                        msg.show();
                    }

                    function removeUsb(usbId, vmId) {
                        var deferred = camel.delete({
                            url: {s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbdevice/{usbId}", o: {vmId: vmId, usbId: usbId}},
                            "params": null,
                            "userId": user.id
                        });
                        deferred.success(function (data) {
                            getHostUsbInfos();
                        });
                        deferred.fail(function (data) {
                            exceptionService.doException(data);
                        });
                    }

                    function bindWindow(usbId) {
                        var newWindow = new Window({
                            "winId": "usbBindVmWindow",
                            "title": $scope.i18n.org_term_bondVM_button,
                            "content-type": "url",
                            "usbId": usbId,
                            "hostId": $stateParams.hostId,
                            "buttons": null,
                            "content": "app/business/resources/views/device/host/hostDetail/usbBindVm.html",
                            "height": 500,
                            "width": 780,
                            "close": function () {
                                getHostUsbInfos();
                            }
                        });
                        newWindow.show();
                    }

                    function getHostUsbInfos() {
                        HardwareService.getHostUsbInfos($stateParams.hostId, user, function (result) {
                            if (result.result == true) {
                                $scope.$apply(function () {
                                    $scope.usbTableModel.data = result.data.usbs;
                                });
                            }
                            if (result.result == false) {

                            }
                        });
                    }

                    function getHostInfos() {
                        var hardwareKey = ["host.board.info",
                            "host.product.info",
                            "host.bios.info",
                            "host.cpu.info",
                            "host.mem.info",
                            "host.eth.info",
                            "host.eth.performance",
                            "host.nic.info",
                            "host.mem.totalsize",
                            "host.cpu.totalfreq"];
                        if ($scope.serverType != "2") {
                            hardwareKey.push("host.fan.info");
                            hardwareKey.push("host.power.info");
                        }

                        if ($scope.openstack == false) {
                            hardwareKey.push("host.disk.info");
                            hardwareKey.push("host.logicdisk.info");
                            hardwareKey.push("host.disk.totalsize");
                            hardwareKey.push("host.logicdisk.totalsize");
                            hardwareKey.push("host.hard.disk.info");
                        }

                        HardwareService.getHostHardwareInfos($stateParams.hostId, hardwareKey, user, function (result) {
                            if (result.result == true) {
                                $scope.$apply(function () {
                                    $scope.biosInfo = HardwareService.getBiosInfos(result.data);
                                    if ($scope.serverType != "2") {
                                        $scope.powerTableModel.data = HardwareService.getPowerInfos(result.data);
                                        $scope.fanTableModel.data = HardwareService.getFanInfos(result.data);
                                    }
                                    if ($scope.openstack == false) {
                                        $scope.logicalDiskTableModel.data = HardwareService.getDiskInfos(result.data);
                                        $scope.logicalZoneTableModel.data = HardwareService.getLogicDiskfos(result.data);
                                        $scope.phyDiskTableModel.data = HardwareService.getPhyDiskInfos(result.data);
                                    }
                                    $scope.cpuTableModel.data = HardwareService.getCpuInfos(result.data);
                                    $scope.memoTableModel.data = HardwareService.getMemoryInfos(result.data);
                                    $scope.networkPortTableModel.data = HardwareService.getNetPortInfos(result.data);

                                    $scope.nicTableModel.data = HardwareService.getNetCardInfos(result.data);
									$scope.nicTableModelCount = $scope.nicTableModel.data.length || " ";
									if($scope.nicTableModel.data.length == 0){
										var minfo  = result.data.metricInfo["host.eth.info.count"];
										if(minfo && minfo.metricValue){
											if(minfo.metricValue != "" && minfo.metricValue != null){
												$scope.nicTableModelCount = minfo.metricValue;
											}
										}
									}

                                });
                            }
                            if (result.result == false) {

                            }
                        });
                    };
                    $scope.operate = {
                        setStatus: function (status) {
                            $scope.show = status;
                        }
                    }
                    function page_load() {
                        getHostInfos();
                        if ($scope.openstack == false) {
                            getHostUsbInfos();
                        }
                        $scope.show = "power";
                        if ($scope.serverType == "2") {
                            $scope.show = "bios";
                        }

                    }

                    page_load();
                }
            ]
            ;
        return hardwareCtrl;
    }
)
;

