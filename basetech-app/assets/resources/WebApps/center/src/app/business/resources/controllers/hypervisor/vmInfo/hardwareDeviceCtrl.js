/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, UnifyValid, Window, Message, Exception) {
    "use strict";

    var deviceCtrl = ["$scope", "$stateParams", "$compile", "camel", function ($scope, $stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmId = $stateParams.vmId;

        var statuses = {
            Working:  $scope.i18n.common_term_running_value || "运行",
            Ready: $scope.i18n.common_term_ready_value || "就绪"
        };

        //绑定按钮
        $scope.deviceBindButton = {
            "id": "deviceBindButton",
            "text": $scope.i18n.vm_term_bondUSBdevice_button || "绑定USB设备",
            "disable":true,
            "click": function () {
                var newWindow = new Window({
                    "winId": "bindUsbDeviceWindow",
                    "title":  $scope.i18n.vm_term_bondUSBdevice_button || "绑定USB设备",
                    "clusterId": $scope.clusterId,
                    "hostId": $scope.hostId,
                    "vmId": $scope.vmId,
                    "vmStatus":$scope.vmStatus,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vmInfo/bindUsbDevice.html",
                    "height": 500,
                    "width": 680,
                    "close": function () {
                        getUsb();
                    }
                });
                newWindow.show();
            }
        };
        //刷新按钮
        $scope.refresh = function () {
            getUsb();
        };
        //USB设备列表
        $scope.deviceTable = {
            "id": "hardwareDeviceTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "USB ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.usbId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.common_term_productID_label || "产品ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.productId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.device_term_deviceStatus_label || "设备状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.device_term_deviceVersion_label || "设备版本",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.version);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.vm_term_USBcontrolType_label || "USB控制器类型",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.usbControllerType);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();
                // 操作列
                var optColumn = "<div><a href='javascript:void(0)' ng-click='unbind()'>"+ ($scope.i18n.common_term_move_button || "移除")+"</a></div>";
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();

                optScope.unbind = function () {
                    removeMessage(aData.usbId);
                };
                var optNode = optLink(optScope);
                $("td:eq(6)", nRow).html(optNode);
            }
        };
        function getVmInfo() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                $scope.clusterId = vmInfo.hypervisorId + "$" + vmInfo.clusterUrn;
                $scope.hostId = vmInfo.hostId;
                $scope.vmStatus = vmInfo.status;
                getUsb();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getUsb() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}/usbs", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var usbs = data && data.usbs || [];
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    $scope.hardwareTable.data[5].summary = usbs.length + ($scope.i18n.common_term_entry_label ||"个");
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                var deviceBindButton = $("#" + $scope.deviceBindButton.id).widget();
                if (deviceBindButton){
                    if (($scope.vmStatus !== "running" && $scope.vmStatus !== "stopped") || usbs.length >= 4) {
                        deviceBindButton.option("disable", true);
                    }
                    else{
                        deviceBindButton.option("disable", false);
                    }
                }
                for (var i = 0; i < usbs.length; i++) {
                    usbs[i].statusStr = statuses[usbs[i].status] || usbs[i].status;
                }
                $scope.$apply(function () {
                    $scope.deviceTable.data = usbs;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function removeMessage(usbId) {
            var options = {
                type: "confirm",
                content:  $scope.i18n.vm_vm_delUSBdevice_info_confirm_msg || "您确认要移除USB设备吗？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            removeUsb(usbId);
                            msg.destroy();
                        }
                    },
                    {
                        label:$scope.i18n.common_term_cancle_button,
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

        function removeUsb(usbId) {
            var deferred = camel.delete({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbdevice/{usbId}", o: {vmId: $scope.vmId, usbId: usbId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getUsb();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        if ($scope.operable) {
            $scope.deviceTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false
                });
        }
        getVmInfo();
    }];
    return deviceCtrl;
});
