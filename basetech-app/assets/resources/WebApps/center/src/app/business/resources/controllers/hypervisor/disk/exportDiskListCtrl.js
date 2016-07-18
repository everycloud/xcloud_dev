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
        var window = $("#exportDiskListWindow").widget();
        var name = window.option("name");
        var total = window.option("total");
        total = total?total:1;
        var tip = validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": total});
        //起始行
        $scope.startTextbox = {
            "id": "startLineTextbox",
            "label": $scope.i18n.alarm_term_startRow_label+":",
            "require": true,
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + total + "):" + tip +
                ";minValue(1):" + tip
        };
        //结束行
        $scope.endTextbox = {
            "id": "endLineTextbox",
            "label": $scope.i18n.alarm_term_endRow_label+":",
            "require": true,
            "extendFunction": ["lineCompare", "lengthCheck"],
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + total + "):" + tip +
                ";minValue(1):" + tip +
                ";lineCompare:" +$scope.i18n.alarm_general_export_info_endRow_valid+
                ";lengthCheck:"+validator.i18nReplace($scope.i18n.common_term_exportMaxNum_valid, {"1": 1000})
        };
        UnifyValid.lineCompare = function () {
            var startLine = $("#" + $scope.startTextbox.id).widget().getValue();
            var endLine = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startLine && endLine) {
                var startValue = parseInt(startLine, 10);
                var endValue = parseInt(endLine, 10);
                return endValue >= startValue;
            }
            return true;
        };
        UnifyValid.lengthCheck = function () {
            var startLine = $("#" + $scope.startTextbox.id).widget().getValue();
            var endLine = $("#" + $scope.endTextbox.id).widget().getValue();
            if (startLine && endLine) {
                var startValue = parseInt(startLine, 10);
                var endValue = parseInt(endLine, 10);
                var length = endValue - startValue + 1;
                return length <= 1000;
            }
            return true;
        };
        //确定按钮
        $scope.okButton = {
            "id": "exportDiskListOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#exportDiskListDiv"));
                if (!result) {
                    return;
                }
                exportDiskList();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "exportDiskListCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        /*
         * 导出磁盘列表
         */
        function exportDiskList() {
            var locale = $scope.i18n.locale === "zh" ? "zh_CN" : "en_US";
            var startText = $("#" + $scope.startTextbox.id).widget().getValue();
            var endText = $("#" + $scope.endTextbox.id).widget().getValue();
            var start = parseInt(startText,10) - 1;
            var end = parseInt(endText,10) - 1;
            var params = {
                exportVolume: {
                    "start":start,
                    "end":end,
                    "source": "MANAGER"
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/reports/resource-reports/action?locale={locale}", o: {locale: locale}},
                "params": JSON.stringify(params),
                "userId": user.id,
                "timeout": 600000
            });
            deferred.success(function (data) {
                if (data.exportFilePath) {
                    var reportUrl = "/goku/rest/v1.5/file/" + encodeURIComponent(data.exportFilePath) + "?type=export";
                    $("#downloadDiskIframe").attr("src", $.encoder.encodeForHTML(reportUrl));
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
    }];

    var exportModule = angular.module("resources.disk.exportDiskList", ["ng"]);
    exportModule.service("validator", validatorService);
    exportModule.service("camel", httpService);
    exportModule.controller("resources.disk.exportDiskList.ctrl", exportCtrl);
    return exportModule;
});