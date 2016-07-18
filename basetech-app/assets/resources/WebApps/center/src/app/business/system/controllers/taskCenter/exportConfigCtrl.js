/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular, validatorService, UnifyValid,Window, httpService, Exception) {
    "use strict";
    var exportCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#downLoadConfigWindowId").widget();
        var params = window.option("params");
        params.totalRecords = params.totalRecords?params.totalRecords:1;
        //起始行
        $scope.startTextbox = {
            "id": "startLineTextbox",
            "label": $scope.i18n.alarm_term_startRow_label+":",
            "require": true,
            "value":"1",
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + params.totalRecords + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": params.totalRecords}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": params.totalRecords})
        };
        //结束页
        $scope.endTextbox = {
            "id": "endLineTextbox",
            "label": $scope.i18n.alarm_term_endRow_label+":",
            "require": true,
            "value":params.totalRecords<10?params.totalRecords:10,
            "extendFunction": ["lineCompare", "lengthCheck"],
            "validate": "required:" + $scope.i18n.common_term_null_valid +
                ";integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                ";maxValue(" + params.totalRecords + "):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": params.totalRecords}) +
                ";minValue(1):" + validator.i18nReplace($scope.i18n.common_term_range_valid, {"1": 1, "2": params.totalRecords}) +
                ";lineCompare:" +$scope.i18n.alarm_general_export_info_endRow_valid+
                ";lengthCheck:"+validator.i18nReplace($scope.i18n.log_log_export_info_total_valid, {"1": 10000})
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
                return length <= 10000;
            }
            return true;
        };
        //确定按钮
        $scope.okButton = {
            "id": "exportConfigOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#exportConfigDiv"));
                if (!result) {
                    return;
                }
                exportOpLog();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "exportConfigCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function exportOpLog() {
            var startText = $("#" + $scope.startTextbox.id).widget().getValue();
            var endText = $("#" + $scope.endTextbox.id).widget().getValue();
            params.params.start = parseInt(startText,10);
            params.params.limit = parseInt(endText,10) - params.params.start + 1;
            var options = {
                "winId": "downLoadOplogWindowId",
                "params": {
                    vdcId: "1",
                    userId: user.id,
                    params: params.params
                },
                "title": $scope.i18n.log_term_exportOperationLog_button || "导出操作日志",
                "content-type": "url",
                "content": "app/business/system/views/taskCenter/exportOperatorLog.html",
                "height": 150,
                "width": 400,
                "resizable": false,
                "maximizable":false,
                "minimizable": false,
                "buttons": null,
                "beforeClose": function () {
                    try {
                        var scope = $("#exportOperatorLog").scope();
                        scope.operator.clearTimer();
                    } catch (e) {
                    }
                },
                "close": function (event) {
                    window.destroy();
                }
            };
            var downloadWindow = new Window(options);
            downloadWindow.show();
        }
    }];

    var exportModule = angular.module("system.opLog.exportConfig", ["ng"]);
    exportModule.service("validator", validatorService);
    exportModule.service("camel", httpService);
    exportModule.controller("system.opLog.exportConfig.ctrl", exportCtrl);
    return exportModule;
});