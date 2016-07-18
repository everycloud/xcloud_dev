/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($, angular,Message,UnifyValid,validatorService,httpService,Exception) {
        "use strict";
        var configSizeCtrl = ["$scope", "$compile","camel","$state","validator", function ($scope, $compile,camel,$state,validator) {
            var exceptionService = new Exception();
            var $state = $("html").injector().get("$state");
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#configDiskSizeWindow").widget();
            var winParams = window.option("WIN_PARAMS");

            var volumnId = winParams.volumnId;
            var vmId = winParams.vmId;
            var clusterId =  winParams.clusterId;
            var diskName = winParams.diskName;
            var quantityGB = winParams.quantityGB;
            //磁盘容量输入框
            $scope.sizeTextbox = {
                "label": $scope.i18n.common_term_capacityGB_label+":",
                "id": "diskSizeTextbox",
                "value": quantityGB,
                "require":true,
                "validate": "integer:"+validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid,{"1":"1","2":"65536"})+
                    ";maxValue(65536):"+validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid,{"1":"1","2":"65536"})+
                    ";minValue(1):"+validator.i18nReplace($scope.i18n.common_term_rangeInteger_valid,{"1":"1","2":"65536"})+
                    ";required:"+$scope.i18n.common_term_null_valid
            };
            //确定钮
            $scope.okButton = {
                "id": "diskSizeOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#setDiskLimitDiv"));
                    if (!result) {
                        return;
                    }
                    save();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "diskSizeCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#configDiskSizeWindow").widget().destroy();
                }
            };

            function save() {
                var result = UnifyValid.FormValid($("#configDiskSizeDiv"));
                if (!result) {
                    return;
                }
                var params = {
                    "expand": {
                        "quantityGB": $("#diskSizeTextbox").widget().getValue(),
                        "vmId": vmId,
                        "clusterId":clusterId,
                        "diskName":diskName
                    }
                };
                var deferred = camel.post({
                    "url":{s: "/goku/rest/v1.5/irm/1/volumes/{id}/action",o:{'id':volumnId}},
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
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                $state.go("system.taskCenter");
                                window.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                                $("#configDiskSizeWindow").widget().destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        }];

        var configSizeApp = angular.module("configDiskSizeApp", ['framework']);
        configSizeApp.controller("resources.vmInfo.configDiskSize.ctrl", configSizeCtrl);
        configSizeApp.service("validator", validatorService);
        configSizeApp.service("camel", httpService);
        return configSizeApp;
    }
);
