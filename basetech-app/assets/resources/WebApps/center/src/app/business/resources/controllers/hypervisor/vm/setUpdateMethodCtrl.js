/*global define*/
define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/RadioGroup',
    "app/services/httpService",
    "app/services/exceptionService"],
    function ($, angular, RadioGroup,httpService,exceptionService) {
        "use strict";

        var setUpdateMethodCtrl = ["$scope", "$compile","camel", function ($scope, $compile,camel) {
            var exceptionSer = new exceptionService();
            var window = $("#setUpdateMethodWindow").widget();
            var selectedVm = window.option("selectedVm");
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;

            $scope.methodRadio = {
                "id": "setUpdateMethodRadio",
                "layout": "vertical",
                "values": [
                        {
                            "key": "true",
                            "text": $scope.i18n.common_term_autoUpdate_label
                        },
                        {
                            "key": "false",
                            "text": $scope.i18n.common_term_manualUpdate_label,
                            "checked" : true
                        }
                ]
            };
            //确定按钮
            $scope.okButton = {
                "id": "setUpdateMethodOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = $("#"+$scope.methodRadio.id).widget().opChecked("checked");
                    setUpgradeMode(result);
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "setUpdateMethodCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function setUpgradeMode(mode) {
                var params = {
                    "modUpgradeMode": {
                        "upgradeMode":[]
                    }
                };
                for(var i=0;i<selectedVm.length;i++){
                    var item = {
                        vmId:selectedVm[i],
                        isAutoUpgrade:mode
                    };
                    params.modUpgradeMode.upgradeMode.push(item);
                }
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }
        }];

        var setUpdateMethodApp = angular.module("setUpdateMethodApp", ['framework']);
        setUpdateMethodApp.service("camel", httpService);
        setUpdateMethodApp.controller("resources.vm.setUpdateMethod.ctrl", setUpdateMethodCtrl);
        return setUpdateMethodApp;
    }
);
