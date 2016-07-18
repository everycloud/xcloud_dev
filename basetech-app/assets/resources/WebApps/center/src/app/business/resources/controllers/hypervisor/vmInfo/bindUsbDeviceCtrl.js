/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Radio",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, Radio, httpService, UnifyValid, Exception) {
        "use strict";

        var bindDeviceCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#bindUsbDeviceWindow").widget();
            var clusterId = window.option("clusterId");
            var hostId = window.option("hostId");
            var vmId = window.option("vmId");
            var vmStatus = window.option("vmStatus");
            //选择主机下拉框
            $scope.hostSelector = {
                "label": ($scope.i18n.vm_term_chooseHost_label || "选择主机") + ":",
                "id": "bindDeviceHostSelector",
                "width": "135",
                "values": [],
                "change": function () {
                    var result = $("#" + $scope.hostSelector.id).widget().getSelectedId();
                    getUsb(result);
                }
            };

            //USB选择列表
            $scope.usbDeviceTable = {
                "id": "bindUsbDeviceTable",
                "data": null,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usbId);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": "USB ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usbId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_productID_label || "产品ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.productId);
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
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();

                    //单选框
                    var options = {
                        "id": "deviceRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            $("#"+$scope.okButton.id).widget().option("disable",false);
                            var index = 0;
                            while ($("#deviceRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#deviceRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "bindDeviceOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    var data = $scope.usbDeviceTable.data;
                    var selectedDevice;
                    var index = 0;
                    while ($("#deviceRadio_" + index).widget()) {
                        var checked = $("#deviceRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedDevice = data[index].usbId;
                            break;
                        }
                        index++;
                    }
                    if (selectedDevice) {
                        addUsb(selectedDevice);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "bindDeviceCancelButton",
                "text":$scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getHost() {
                var params = {
                    usbDeviceHosts:{
                        clusterId: clusterId
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/hosts/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var values = [];
                    var hosts = data && data.usbDeviceHostRespone && data.usbDeviceHostRespone.usbHostList || [];
                    if (hosts.length === 0) {
                        return;
                    }
                    var curHost = hosts[0];
                    for (var i = 0; i < hosts.length; i++) {
                        var value = {
                            selectId: hosts[i].id,
                            label: hosts[i].name,
                            checked:i===0
                        };
                        //如果当前主机有USB，选中当前主机
                        if (hosts[i].id == hostId) {
                            value.checked = true;
                            curHost = hosts[i];
                            if(i > 0){
                                values[0].checked = false;
                            }
                        }
                        //如果虚拟机为运行态，则只显示当前主机
                        if(vmStatus === "running"){
                            if (hosts[i].id == hostId){
                                values.push(value);
                            }
                        }
                        else{
                            values.push(value);
                        }
                    }
                    //有带USB的主机，但不是当前主机，且虚拟机是运行态的时候，values会为空
                    if(values.length > 0){
                        getUsb(curHost.id);
                    }
                    $("#" + $scope.hostSelector.id).widget().option("values", values);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getUsb(hostId) {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/hosts/{hostId}/usbs", o: {hostId: hostId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var usbs = data && data.usbs || [];
                    var freeUsb = [];
                    for(var i=0;i<usbs.length;i++){
                        if(usbs[i].allocateStatus === "UnAllocated"){
                            freeUsb.push(usbs[i]);
                        }
                    }
                    $scope.$apply(function () {
                        $scope.usbDeviceTable.data = freeUsb;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function addUsb(usbId) {
                var params = {
                    usbUrn: usbId,
                    type:"EHCI+UHCI"
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbdevice", o: {vmId: vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getHost();
        }];

        var bindDeviceApp = angular.module("bindUsbDeviceApp", ['framework']);
        bindDeviceApp.service("camel", httpService);
        bindDeviceApp.controller("resources.vmInfo.bindDevice.ctrl", bindDeviceCtrl);
        return bindDeviceApp;
    }
);
