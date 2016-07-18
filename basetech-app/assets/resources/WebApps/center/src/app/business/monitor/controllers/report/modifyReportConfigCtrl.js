define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/Checkbox",
    "tiny-directives/Select",
    "tiny-directives/DateTime",
    "fixtures/userFixture"
],
    function ($, angular, http, UnifyValid, ExceptionService) {
        "use strict";
        var reportConfigCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "OPENSTACK";
                var hasOperateRight = user.privilege.role_role_add_option_reportHandle_value;
                $scope.reportConfig = $("#modifyConfigWindowId").widget().option("reportConfig");
                var i18n = $scope.i18n || {};
                var commonStr1_14 = $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 14});
                // 生成星期下拉列表方法
                var generateWeekItems = function () {
                    var weekItems = [
                        {
                            "selectId": "1",
                            "label": i18n.common_term_Monday_label || "星期一",
                            "checked": true
                        },
                        {
                            "selectId": "2",
                            "label": i18n.common_term_Tuesday_label || "星期二"
                        },
                        {
                            "selectId": "3",
                            "label": i18n.common_term_Wednesday_label || "星期三"
                        },
                        {
                            "selectId": "4",
                            "label": i18n.common_term_Thursday_label || "星期四"
                        },
                        {
                            "selectId": "5",
                            "label": i18n.common_term_Friday_label || "星期五"
                        },
                        {
                            "selectId": "6",
                            "label": i18n.common_term_Saturday_label || "星期六"
                        },
                        {
                            "selectId": "7",
                            "label": i18n.common_term_Sunday_label || "星期日"
                        }
                    ];
                    return weekItems;
                };

                // 生成日期下拉列表
                var generateDayItems = function () {
                    var dayItems = [];
                    for (var i = 1; i <= 31; i++) {
                        var item = {
                            "selectId": i,
                            "label": i
                        };
                        dayItems.push(item);
                    }
                    dayItems[0].checked = true;
                    return dayItems;
                };

                // 生成周期下拉列表
                var generatePeriodItems = function () {
                    var periodItems = [
                        {
                            "selectId": "daily",
                            "label": i18n.common_term_everyDay_label || "每天",
                            "checked": true
                        },
                        {
                            "selectId": "weekly",
                            "label": i18n.common_term_everyWeek_label || "每周",
                            "checked": false
                        },
                        {
                            "selectId": "monthly",
                            "label": i18n.common_term_everyMonth_label || "每月",
                            "checked": false
                        }
                    ];
                    return periodItems;
                };

                // 修改报表周期类型，刷新是否显示星期和日的下拉列表
                var changePeriod = function () {
                    var selectedId = $("#" + $scope.periodType.id).widget().getSelectedId();
                    if ("daily" === selectedId) {
                        $scope.week.display = false;
                        $scope.day.display = false;
                    } else if ("weekly" === selectedId) {
                        $scope.week.display = true;
                        $scope.day.display = false;
                    } else if ("monthly" === selectedId) {
                        $scope.week.display = false;
                        $scope.day.display = true;
                    }
                };

                $scope.disable = false;
                $scope.week = {
                    "id": "modifyReportConfigWeekId",
                    "values": generateWeekItems(),
                    "display": false
                };
                $scope.day = {
                    "id": "modifyReportConfigDayId",
                    "values": generateDayItems(),
                    "height": 180,
                    "display": false
                };
                $scope.periodType = {
                    "id": "modifyReportConfigPeriodTypeId",
                    "label": i18n.common_term_buildCycle_label || "生成周期:",
                    "require": true,
                    "values": generatePeriodItems(),
                    "change": function () {
                        changePeriod();
                    }
                };
                $scope.time = {
                    "id": "modifyReportConfigTimeId",
                    "type": "time",
                    "defaultTime": "",
                    "timeFormat": "hh:mm:ss"
                };
                $scope.maxCopy = {
                    "id": "modifyReportConfigMaxCopyId",
                    "label": i18n.report_term_saveMaxNum_label || "最大保存份数:",
                    "require": true,
                    "value": $scope.reportConfig.maxReportNum || "",
                    "tooltip": i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 14}) || "请输入1-14的整数",
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";integer():" + commonStr1_14 + ";minValue(1):" + commonStr1_14 + ";maxValue(14):" + commonStr1_14
                };

                $scope.saveBtn = {
                    "id": "modifyReportConfigSaveBtnId",
                    "text": i18n.common_term_save_label || "保存",
                    "disable": false,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#systemReportConfig"));
                        if (!result) {
                            return;
                        }

                        $scope.operator.modifyReportConfig();
                    }
                };

                $scope.cancelBtn = {
                    "id": "modifyReportConfigCancelBtnId",
                    "text": i18n.common_term_cancle_button || "取消",
                    "disable": false,
                    "display": hasOperateRight,
                    "click": function () {
                        $("#modifyConfigWindowId").widget().destroy();
                    }
                };

                $scope.operator = {
                    "initReportConfig": function (config) {
                        if (!config) {
                            return;
                        }

                        // 设置周期
                        var reportPeriodType = config.reportPeriodType;
                        var day = config.day;
                        var time = config.time;
                        if (reportPeriodType) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $("#" + $scope.periodType.id).widget().opChecked(reportPeriodType);
                                    if ("daily" === reportPeriodType) {
                                        $scope.week.display = false;
                                        $scope.day.display = false;
                                    } else if ("weekly" === reportPeriodType) {
                                        $scope.week.display = true;
                                        $scope.day.display = false;
                                        $("#" + $scope.week.id).widget().opChecked(day);
                                    } else if ("monthly" === reportPeriodType) {
                                        $scope.week.display = false;
                                        $scope.day.display = true;
                                        $("#" + $scope.day.id).widget().opChecked(day);
                                    }
                                    $("#" + $scope.time.id).widget().option("defaultTime", config.time);
                                });
                            }, 100);
                        }
                    },
                    "modifyReportConfig": function () {
                        var reportConfigList = [];
                        var config = {};
                        config.reportName = $scope.reportConfig.id;
                        var periodType = $("#" + $scope.periodType.id).widget().getSelectedId();
                        config.reportPeriodType = periodType;
                        if (periodType === "weekly") {
                            config.day = $("#" + $scope.week.id).widget().getSelectedId();
                        } else if (periodType === "monthly") {
                            config.day = parseInt($("#" + $scope.day.id).widget().getSelectedId());
                        }
                        config.time = $("#" + $scope.time.id).widget().getDateTime();
                        config.maxReportNum = parseInt($("#" + $scope.maxCopy.id).widget().getValue());
                        reportConfigList.push(config);

                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/irm/reports/asset-configs/{id}",
                                o: {
                                    "id": $scope.reportConfig.id
                                }
                            },
                            "params": JSON.stringify({
                                "reportConfigList": reportConfigList
                            }),
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $("#modifyConfigWindowId").widget().destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response, $("#modifyConfigWindowId").widget());
                            });
                        });
                    }
                };

                $scope.operator.initReportConfig($scope.reportConfig);

            }
        ];

        var dependency = ['ng', "wcc"];
        var reportConfigModule = angular.module("report.modifyReportConfig", dependency);
        reportConfigModule.controller("report.modifyReportConfig.ctrl", reportConfigCtrl);
        reportConfigModule.service("camel", http);
        return reportConfigModule;
    });
