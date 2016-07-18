/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($,angular, Message, httpService, Exception) {
    "use strict";
    var deleteDiskCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#deleteVmDiskWindow").widget();
            var vmId = window.option("vmId");
            var volumnId = window.option("volumnId");
            var volumnName = window.option("volumnName");

            $scope.safeCheckbox = {
                "id": "safeDeleteCheckbox",
                "text" : $scope.i18n.common_term_safeDel_button || "安全删除"
            };

            //确定按钮
            $scope.okButton = {
                "id": "deleteDiskOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    deleteDisk();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "deleteDiskCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            function deleteDisk() {
                var isSafe = $("#"+$scope.safeCheckbox.id).widget().option("checked");
                var deferred = camel.delete({
                    url: {
                        s: "/goku/rest/v1.5/irm/1/vms/{id}/volumes/{volumeId}?volume-name={volumeName}&is-safe={isSafe}",
                        o:{id:vmId,volumeName:volumnName,volumeId:volumnId,isSafe:isSafe}
                    },
                    "params": null,
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
                    content:  $scope.i18n.task_view_task_info_confirm_msg || "任务发放成功，是否前往任务中心查看？",
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
                            label: $scope.i18n.common_term_cancle_button,
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

    var deleteDiskModule = angular.module("resources.vmInfo.deleteDisk", ["ng"]);
    deleteDiskModule.service("camel", httpService);
    deleteDiskModule.controller("resources.vmInfo.deleteDisk.ctrl", deleteDiskCtrl);
    return deleteDiskModule;
});