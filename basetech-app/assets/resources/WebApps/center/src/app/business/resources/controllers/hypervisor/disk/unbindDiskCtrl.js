/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($,angular, Message, httpService, Exception) {
    "use strict";
    var unbindDiskCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#unbindDiskWindow").widget();
            var vmId = window.option("vmId");
            var volumnId = window.option("volumnId");
            var diskType = window.option("diskType");

            $scope.formatCheckbox = {
                "id": "unbindFormatCheckbox",
                "text" : $scope.i18n.common_term_formatDisk_button,
                "disable":diskType === "share"
            };

            //确定按钮
            $scope.okButton = {
                "id": "deleteVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    unMountVolume();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "deleteVmCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            function unMountVolume() {
                var params = {
                    "unmount": {
                        vmID: vmId,
                        volumnID: volumnId,
                        format:false
                    }
                };
                var result = $("#"+$scope.formatCheckbox.id).widget().option("checked");
                if(result){
                    params.unmount.format = true;
                }
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function taskMessage() {
                var options = {
                    type: "confirm",
                    content:$scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                                $state.go("system.taskCenter");
                            }
                        },
                        {
                            label:  $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        }];

    var unbindDiskModule = angular.module("resources.disk.unbindDisk", ["ng"]);
    unbindDiskModule.service("camel", httpService);
    unbindDiskModule.controller("resources.disk.unbindDisk.ctrl", unbindDiskCtrl);
    return unbindDiskModule;
});