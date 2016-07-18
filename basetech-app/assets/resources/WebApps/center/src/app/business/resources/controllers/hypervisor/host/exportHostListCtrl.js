/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular, validatorService, UnifyValid, httpService, Exception) {
    "use strict";
    var exportCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#exportHostListWindow").widget();
        var params = window.option("params");
        var maxPage = Math.ceil(params.totalRecords);
        maxPage = maxPage?maxPage:0;
        //起始行数
        $scope.startTextbox = {
            "id": "startLineTextbox",
            "label": $scope.i18n.alarm_term_startRow_label+":",
            "require": true,
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage})
        };
        //结束行数
        $scope.endTextbox = {
            "id": "endLineTextbox",
            "label": $scope.i18n.alarm_term_endRow_label+":",
            "require": true,
            "extendFunction": ["pageCompare", "lengthCheck"],
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + maxPage + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": maxPage}) +
                ";pageCompare:" +$scope.i18n.alarm_general_export_info_endRow_valid+
                ";lengthCheck:"+validator.i18nReplace($scope.i18n.common_term_exportMaxNum_valid, {"1": 200})
        };
        UnifyValid.pageCompare = function () {
            var startPage = $("#" + $scope.startTextbox.id).widget().getValue();
            var endPage = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startPage && endPage) {
                var startValue = parseInt(startPage, 10);
                var endValue = parseInt(endPage, 10);
                return endValue >= startValue;
            }
            return true;
        };
        UnifyValid.lengthCheck = function () {
            var startPage = $("#" + $scope.startTextbox.id).widget().getValue();
            var endPage = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startPage && endPage) {
                var startValue = parseInt(startPage, 10);
                var endValue = parseInt(endPage, 10);
                var length = endValue - startValue + 1;
                return length <= 200;
            }
            return true;
        };
        //确定按钮
        $scope.okButton = {
            "id": "exportHostListOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#exportHostListDiv"));
                if (!result) {
                    return;
                }
                exportHostList();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "exportHostListCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        /*
         * 导出主机列表
         */
        function exportHostList() {
            var locale = $scope.i18n.locale === "zh" ? "zh_CN" : "en_US";
            var startText = $("#" + $scope.startTextbox.id).widget().getValue();
            var endText = $("#" + $scope.endTextbox.id).widget().getValue();
            var start = parseInt(startText,10)-1;
            var end = parseInt(endText,10)-1;
            var exportHost = params.exportHostInfo;
            exportHost.start = start;
            exportHost.end = end;
            var deferred = camel.post({
                "url": "/goku/rest/v1.5/irm/1/reports/resource-reports/action?locale=" + locale,
                "params": JSON.stringify({"exportHost": exportHost}),
                "userId": user.id,
                "timeout":600000
            });
            deferred.done(function (data) {
                $scope.reportUrl = "/goku/rest/v1.5/file/" + encodeURIComponent(data.exportFilePath) + "?type=export" + "&t=" + Math.random();
                $("#download").attr("src", $scope.reportUrl);
                window.destroy();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
    }];

    var exportModule = angular.module("resources.host.exportHostList", ["ng"]);
    exportModule.service("validator", validatorService);
    exportModule.service("camel", httpService);
    exportModule.controller("resources.host.exportHostList.ctrl", exportCtrl);
    return exportModule;
});