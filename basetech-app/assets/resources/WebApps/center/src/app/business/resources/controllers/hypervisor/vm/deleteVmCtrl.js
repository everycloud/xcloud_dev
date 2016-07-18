/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"
], function ($, angular,Message, httpService,UnifyValid, Exception) {
    "use strict";
    var deleteVmCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#deleteVmWindow").widget();
            var selectedVm = window.option("selectedVm");

            $scope.holdTime = {
                "id": "holdTimeId",
                "label": $scope.i18n.vm_vm_term_del_para_delayDelTimeHour_label+":",
                "width": "70",
                "value": 0,
                "type": "input",
                'disable': false,
                "require": true,
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,"0",168),
                "validate": "integer:"+$scope.i18n.common_term_PositiveIntegers_valid+
                    ";minValue(0):"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid,"0",168)+
                    ";maxValue(168):"+$scope.i18n.sprintf($scope.i18n.common_term_length_valid,"0",168)
            };

            $scope.safeRadio = {
                "id": "safeDeleteVmRadio",
                "layout": "horizon",
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_commonSDel_button,
                        "checked": true,
                        "disable": false
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.common_term_safeDel_button,
                        "checked": false,
                        "disable": false
                    }
                ]
            };

            //确定按钮
            $scope.okButton = {
                "id": "deleteVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    deleteVm();
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
            function deleteVm() {
                var result = UnifyValid.FormValid($("#deleteVmConfirmDiv"));
                if(!result){
                    return;
                }
                var htValue = $("#holdTimeId").widget().getValue();
                if(htValue){
                    htValue = parseInt(htValue);
                }else{
                    htValue = 0;
                }
                var params = {
                    "remove": {
                        "vmIds": selectedVm,
                        "zeroFillVolume": false,
                        "holdTime" : htValue
                    }
                };
                var result = $("#"+$scope.safeRadio.id).widget().opChecked("2");
                if(result){
                    params.remove.zeroFillVolume = true;
                }
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/action",
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

    var deleteVmModule = angular.module("resources.vm.deleteVm", ["ng"]);
    deleteVmModule.service("camel", httpService);
    deleteVmModule.controller("resources.vm.deleteVm.ctrl", deleteVmCtrl);
    return deleteVmModule;
});