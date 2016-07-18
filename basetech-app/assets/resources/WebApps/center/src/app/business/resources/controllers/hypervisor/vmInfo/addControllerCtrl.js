/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, httpService, UnifyValid, Exception) {
        "use strict";

        var addControllerCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addUsbControllerWindow").widget();
            var clusterId = window.option("clusterId");
            var hostId = window.option("hostId");
            var vmId = window.option("vmId");
            //控制器类型下拉框
            $scope.typeSelector = {
                "label": ($scope.i18n.device_term_controlDeviceType_label || "控制器类型") + ":",
                "id": "addControllerTypeSelector",
                "width": "270",
                "values": [
                    {
                        selectId: "EHCI+UHCI",
                        label: $scope.i18n.vm_usb_add_desc_label || "EHCI+UHCI(支持USB2.0和USB1.1设备)",
                        checked:true
                    }
                ],
                "change": function () {

                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "bindDeviceOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    addController();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addControllerCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function addController() {
                var params = {
                    controllerType:$("#" + $scope.typeSelector.id).widget().getSelectedId(),
                    clusterId: clusterId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbcontroller", o: {vmId: vmId}},
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
        }];

        var addControllerApp = angular.module("addControllerApp", ['framework']);
        addControllerApp.service("camel", httpService);
        addControllerApp.controller("resources.vmInfo.addController.ctrl", addControllerCtrl);
        return addControllerApp;
    });
