define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/monitor/services/performanceService",
    "app/services/exceptionService",
    "bootstrapui/ui-bootstrap-tpls"],
    function ($, angular, httpService, UnifyValid, performanceService, ExceptionService, DownloadService, ui) {
        "use strict";

        var flavorExtraCtrl = ["$scope", "camel", "$q", function ($scope, camel, $q) {

            var exception = new ExceptionService();
            var performanceServiceIns = new performanceService(exception, $q, camel);
            var user = $("html").scope().user;
            var winObj = $("#exportAlarmWinID").widget();
            var queryCondition = winObj.option("queryCondition");
            var totalRecords = winObj.option("totalRecords");
            var cloudInfraId = winObj.option("cloudInfraId");

            // 扩展UnifyValid
            UnifyValid.checkStartIndex = function () {
                var value = $(this).val();
                var startIndex = parseInt(jQuery.trim(value), 10);
                if (startIndex < 1) {
                    return $scope.i18n.sprintf($scope.i18n.common_term_greater_valid, {1: "0"});
                }

                var endIndex = $("#" + $scope.endIndex.id).widget().getValue();
                if (/^\d{1,}$/.test(endIndex) && startIndex > parseInt(endIndex, 10)) {
                    return $scope.i18n.alarm_general_export_info_endRow_valid || "起始位置要小于等于结束位置。";
                }

                if (/^\d{1,}$/.test(startIndex) && /^\d{1,}$/.test(endIndex) && (endIndex - startIndex + 1) > 10000) {
                    return $scope.i18n.alarm_general_export_info_total_valid || "最大支持10000条告警数据导出。";
                }

                return true;
            };

            UnifyValid.checkEndIndex = function () {
                var value = $(this).val();
                var endIndex = parseInt(jQuery.trim(value), 10);
                var startIndex = $("#" + $scope.startIndex.id).widget().getValue();
                if (/^\d{1,}$/.test(startIndex) && parseInt(startIndex, 10) > endIndex) {
                    return $scope.i18n.alarm_general_export_info_endRow_valid || "起始位置要小于等于结束位置。";
                }

                if (/^\d{1,}$/.test(startIndex) && /^\d{1,}$/.test(endIndex) && (endIndex - startIndex + 1) > 10000) {
                    return $scope.i18n.alarm_general_export_info_total_valid || "最大支持10000条告警数据导出。";
                }

                return true;
            };

            $scope.startIndex = {
                label: ($scope.i18n.alarm_term_startRow_label || "起始位置") + ":",
                require: true,
                "id": "exportAlarmStartIndex",
                "extendFunction": ["checkStartIndex"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer():" + $scope.i18n.common_term_integer_valid + ";" + "checkStartIndex();",
                "width": "200",
                "value": ""
            };

            $scope.endIndex = {
                label: ($scope.i18n.alarm_term_endRow_label || "结束位置") + ":",
                require: true,
                "id": "exportAlarmEndIndex",
                "extendFunction": ["checkEndIndex"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer():" + $scope.i18n.common_term_integer_valid + ";" + "checkEndIndex():;",
                "width": "200",
                "value":""
            };

            $scope.saveBtn = {
                "label": "",
                "require": false,
                "id": "exportAlarmSave",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#alarm-export-field"));
                    if (!valid) {
                        return;
                    }

                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId,
                        "language": $scope.urlParams.lang === "zh" ? "zh_CN" : "en_US",
                        "inquiryCond": queryCondition,
                        "start": parseInt($("#" + $scope.startIndex.id).widget().getValue(), 10) - 1,
                        "limit": parseInt($("#" + $scope.endIndex.id).widget().getValue(), 10) - parseInt($("#" + $scope.startIndex.id).widget().getValue(), 10) + 1
                    };
                    var promise = performanceServiceIns.exportAlarms(options);
                    promise.then(function (data) {
                        if (!data || !data.alarmExportPath) {
                            return;
                        }
                        var exportUrl = "/goku/rest/v1.5/file/" + data.alarmExportPath + "?type=export";
                        $("#monitorAlarmsExport").attr("src", exportUrl);
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "exportAlarmCancel",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "tooltip": "",
                "click": function () {
                    winObj.destroy();
                }
            };
        }];

        var dependency = ["ui.bootstrap"];
        var exportAlarmModule = angular.module("alarm.export", dependency);

        exportAlarmModule.controller("alarm.export.ctrl", flavorExtraCtrl);
        exportAlarmModule.service("camel", httpService);

        return exportAlarmModule;
    });


