/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular,validatorService, UnifyValid, httpService, Exception) {
    "use strict";
    var setWeightCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        var window = $("#setIoWeightWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var volumnId = window.option("volumnId");
        var ioWeight = window.option("ioWeight");
        //份额下拉框
        $scope.weightSelector = {
            "label": $scope.i18n.common_term_qouta_label+":",
            "id": "setIoWeightSelector",
            "width": "150",
            "values": [
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_shut_value
                },
                {
                    "selectId": "200",
                    "label": $scope.i18n.common_term_low_label
                },
                {
                    "selectId": "400",
                    "label": $scope.i18n.common_term_middling_label
                },
                {
                    "selectId": "800",
                    "label": $scope.i18n.common_term_high_label
                },
                {
                    "selectId": "10",
                    "label": $scope.i18n.common_term_custom_label,
                    "checked":true
                }
            ],
            "defaultSelectid": ""+ioWeight,
            "change": function () {
                var result = $("#"+ $scope.weightSelector.id).widget().getSelectedId();
                $("#"+ $scope.weightTextbox.id).widget().option("value",result);
                $("#"+ $scope.weightTextbox.id).widget().option("disable",result !== "10");
            }
        };
        //份额输入框
        $scope.weightTextbox = {
            "id": "ioWeightTextbox",
            "label": "IO"+$scope.i18n.common_term_qouta_label+":",
            "value":ioWeight,
            "disable":(ioWeight == "0" || ioWeight == "200" || ioWeight == "400" || ioWeight == "800"),
            "validate": "required:"+$scope.i18n.common_term_null_valid+
                ";integer:"+$scope.i18n.common_term_PositiveIntegers_valid+";minValue(10):"+
                validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":10,"2":1000})+";maxValue(1000):"+
                validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":10,"2":1000})+";"
        };
        //确定按钮
        $scope.okButton = {
            "id": "ioWeightOkButton",
            "text": $scope.i18n.common_term_save_label,
            "click": function () {
                var result = UnifyValid.FormValid($("#setIoWeightDiv"));
                if (!result) {
                    return;
                }
                setIoWeight();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "ioWeightCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function setIoWeight() {
            var params = {
                "modifyQuota":{
                    "ioQuota":$("#" + $scope.weightTextbox.id).widget().getValue()
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/volumes/{id}/action",o:{id:volumnId}},
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

    var setWeightModule = angular.module("resources.disk.setIoWeight", ["ng"]);
    setWeightModule.service("validator", validatorService);
    setWeightModule.service("camel", httpService);
    setWeightModule.controller("resources.disk.setIoWeight.ctrl", setWeightCtrl);
    return setWeightModule;
});