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

    var controllerCtrl = ["$scope", "$stateParams", "$compile", "camel", function ($scope, $stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmId = $stateParams.vmId;

        var types = {
            "EHCI+UHCI": $scope.i18n.vm_usb_add_desc_label || "EHCI+UHCI(支持USB2.0和USB1.1设备)",
            "xHCI": $scope.i18n.vm_usb_addContorl_info_support_label || "xHCI支USB3.0、USB2.0和USB1.1设备"
        };

        //添加按钮
        $scope.addButton = {
            "id": "addUsbControllerButton",
            "text":  $scope.i18n.vm_term_addUSBcontrol_button || "添加USB控制器",
            "disable":false,
            "click": function () {
                var newWindow = new Window({
                    "winId": "addUsbControllerWindow",
                    "title": $scope.i18n.vm_term_addUSBcontrol_button || "添加USB控制器",
                    "clusterId": $scope.clusterId,
                    "hostId": $scope.hostId,
                    "vmId": $scope.vmId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/vmInfo/addUsbController.html",
                    "height": 180,
                    "width": 450,
                    "close":function(){
                        getData();
                    }
                });
                newWindow.show();
            }
        };
        //USB控制器页面
        //刷新按钮
        $scope.refresh = function () {
            getData();
        };
        //USB控制器列表
        $scope.controllerTable = {
            "id": "environment_table",
            "data": null,
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": $scope.i18n.device_term_controlDeviceType_label || "控制器类型",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.type);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                var optColumn = "<div><a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a></div>";
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.delete = function () {
                    deleteMessage(aData.controllerType,aData.controllerKey);
                };

                var optNode = optLink(optScope);
                $("td:eq(1)", nRow).html(optNode);
            }
        };
        function deleteMessage(controllerType,controllerKey) {
            var options = {
                type: "confirm",
                content: $scope.i18n.vm_vm_delUSBcontrol_info_confirm_msg || "您确认要删除USB控制器吗？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            removeController(controllerType,controllerKey);
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
        function removeController(controllerType,controllerKey) {
            var deferred = camel.delete({
                url: {
                    s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbcontroller/{usbcontrollerid}?usbcontrollerkey={usbControllerKey}",
                    o: {vmId: $scope.vmId,usbcontrollerid:controllerType,usbControllerKey:controllerKey}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                $scope.hyperType = vmInfo.vmType;
                $scope.clusterId = vmInfo.clusterId;
                $scope.hostId = vmInfo.hostId;
                var controllers = vmInfo.vmConfig.usbControllers || [];
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    $scope.hardwareTable.data[4].summary = controllers.length > 0 ? ($scope.i18n.common_term_Exist_value || "存在") :($scope.i18n.common_term_notExist_value ||  "不存在");
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                $scope.addButton.disable =  controllers.length > 0;
                if($("#"+$scope.addButton.id).widget()){
                    $("#"+$scope.addButton.id).widget().option("disable", controllers.length > 0);
                }
                for (var i = 0; i < controllers.length; i++) {
                    controllers[i].type = types[controllers[i].controllerType] || controllers[i].controllerType;
                }
                if ($scope.hyperType === "vmware" && $scope.operable && $scope.controllerTable.columns.length === 1) {
                    $scope.controllerTable.columns.push(
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": function (data) {
                                return "";
                            },
                            "bSortable": false
                        });
                    $("#"+$scope.controllerTable.id).widget().option("columns",$scope.controllerTable.columns);
                }
                $scope.$apply(function () {
                    $scope.controllerTable.data = controllers;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getData();
    }];
    return controllerCtrl;
});
