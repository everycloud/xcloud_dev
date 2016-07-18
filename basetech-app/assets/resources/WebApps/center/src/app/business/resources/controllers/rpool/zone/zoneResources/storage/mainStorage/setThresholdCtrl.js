/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($,angular, validatorService,UnifyValid, httpService, Exception) {
    "use strict";
    var setThresholdCtrl = ["$scope", "validator","camel", function ($scope, validator,camel) {
        var exceptionService = new Exception();
        var window = $("#setThresholdWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var storageId = window.option("storageId");
        var threshold = window.option("threshold");
        //阈值复选框
        $scope.thresholdCheckbox = {
            "id": "thresholdCheckbox",
            "text": $scope.i18n.resource_term_setAllocationThreshold_button,
            "checked":threshold > 0,
            "change":function(){
                var result = $("#"+$scope.thresholdCheckbox.id).widget().option("checked");
                $("#"+$scope.thresholdTextbox.id).widget().option("disable",!result);
            }
        };
        //阈值输入框
        $scope.thresholdTextbox = {
            "id": "thresholdTextbox",
            "label": $scope.i18n.common_term_threshold_label+":",
            "disable":!(threshold > 0),
            "value":threshold > 0?threshold:"",
            "require": true,
            "validate": "required:"+$scope.i18n.common_term_null_valid+
                ";integer:"+$scope.i18n.common_term_PositiveIntegers_valid+
                ";minValue(1):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":500})+
                ";maxValue(500):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":1,"2":500})+
                ";"
        };
        //确定按钮
        $scope.okButton = {
            "id": "setThresholdOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#setThresholdDiv"));
                if (!result) {
                    return;
                }
                setThreshold();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "setThresholdCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function setThreshold() {
            var threshold = $("#"+$scope.thresholdCheckbox.id).widget().option("checked")?$("#"+$scope.thresholdTextbox.id).widget().getValue():0;
            var params = {
                "datastoreInfos": [{
                    "id": storageId,
                    "threshold": threshold
                }]
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/datastores"},
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

    var setThresholdModule = angular.module("resources.zone.storagePool.setThreshold", ["ng"]);
    setThresholdModule.service("validator", validatorService);
    setThresholdModule.service("camel", httpService);
    setThresholdModule.controller("resources.zone.storagePool.setThreshold.ctrl", setThresholdCtrl);
    return setThresholdModule;
});