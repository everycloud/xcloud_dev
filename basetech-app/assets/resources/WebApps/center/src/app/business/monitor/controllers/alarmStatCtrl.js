define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "app/services/commonService",
    "tiny-widgets/Columnchart",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, Message, TextBox, Button, Window, Checkbox, ExceptionService, AlarmService, CommonService, Columnchart) {
    "use strict";

    var alarmStatCtrl = ["$scope", "$compile", "$state", "camel", "$q", '$stateParams',
        function ($scope, $compile, $state, camel, $q, $stateParams) {

            var exception = new ExceptionService();
            var user = $("html").scope().user;
            $scope.topN = "10";
            $scope.isLocal = $scope.deployMode === "local";

            //成立时间 2011-9-26
            var MIN_DATE = new Date(2011, 8, 26);
            var formatDate = function (date) {
                date = date || new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                month < 10 && (month = "0" + month);
                day < 10 && (day = "0" + day);
                hours < 10 && (hours = "0" + hours);
                minutes < 10 && (minutes = "0" + minutes);
                seconds < 10 && (seconds = "0" + seconds);
                return [[year, month, day].join("-"),[hours, minutes, seconds].join("-")].join(" ");
            };

            $scope.showDateTime = false;
            $scope.refreshBtn = {
                "id": "refreshBtn",
                "click": function () {
                    getData();
                }
            };
            $scope.queryTopNCtrl = {
                "id": "queryTopNCtrl",
                "width": "100",
                "values": [{
                    "selectId": "10",
                    "label": "TOP 10",
                    "checked": true
                }, {
                    "selectId": "9",
                    "label": "TOP 9"
                }, {
                    "selectId": "8",
                    "label": "TOP 8"
                }, {
                    "selectId": "7",
                    "label": "TOP 7"
                }, {
                    "selectId": "6",
                    "label": "TOP 6"
                }, {
                    "selectId": "5",
                    "label": "TOP 5"
                }, {
                    "selectId": "4",
                    "label": "TOP 4"
                }, {
                    "selectId": "3",
                    "label": "TOP 3"
                }, {
                    "selectId": "2",
                    "label": "TOP 2"
                }, {
                    "selectId": "1",
                    "label": "TOP 1"
                }]
            };
            $scope.querySeverityCtrl = {
                "id": "querySeverityCtrl",
                "width": "120",
                "values": [{
                    "selectId": "0",
                    "label": $scope.i18n.common_term_allLevel_label,
                    "checked": true
                }, {
                    "selectId": "1",
                    "label": $scope.i18n.alarm_term_critical_label
                }, {
                    "selectId": "2",
                    "label": $scope.i18n.alarm_term_major_label
                }, {
                    "selectId": "3",
                    "label": $scope.i18n.alarm_term_minor_label
                }, {
                    "selectId": "4",
                    "label": $scope.i18n.alarm_term_warning_label
                }]
            };
            $scope.queryCycleCtrl = {
                "id": "queryCycleCtrl",
                "width": "130",
                "values": [{
                    "selectId": "custom",
                    "label": $scope.i18n.perform_term_customCycle_label
                }, {
                    "selectId": "day",
                    "label": $scope.i18n.common_term_oneDay_label
                }, {
                    "selectId": "week",
                    "label": $scope.i18n.common_term_oneWeek_label,
                    "checked": true
                }, {
                    "selectId": "month",
                    "label": $scope.i18n.common_term_oneMonth_label
                }, {
                    "selectId": "year",
                    "label": $scope.i18n.common_term_oneYear_label
                }],
                "change": function () {
                    $scope.showDateTime = ($("#queryCycleCtrl").widget().getSelectedId() == "custom" ? true : false);
                }
            };

            $scope.timeIds = {
                "searchStartTime": "queryStartTimeCtrl",
                "searchEndTime": "queryEndTimeCtrl"
            };

            $scope.time = {
                id: "periodPicker",
                width: 154,
                type: "datetime",
                timeFormat: 'hh:mm:ss',
                dateFormat: 'yy-mm-dd',
                ampm: false,
                firstDay: 1,
                start: {
                    minDate: formatDate(MIN_DATE),
                    maxDate: formatDate(),
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", date);
                        }
                        else{
                            $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", formatDate(MIN_DATE));
                        }
                    }
                },
                end: {
                    minDate: formatDate(MIN_DATE),
                    maxDate: formatDate(),
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", formatDate());
                        }
                    }
                }
            };
            $scope.queryBtn = {
                "id": "queryBtn",
                "text":  $scope.i18n.common_term_query_button,
                "click": function () {
                    if($scope.showDateTime)
                    {
                        var startDate = $("#queryStartTimeCtrl").widget().getDateTime();
                        var endDate = $("#queryEndTimeCtrl").widget().getDateTime();
                        if (startDate == '' || endDate == '') {
                            var options = {
                                type: "error",
                                content: $scope.i18n.perform_term_inputCycle_valid || "开始、结束时间不能为空！",
                                height: "100px",
                                width: "350px"
                            }
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }
                    }
                    $scope.topN = $("#queryTopNCtrl").widget().getSelectedId();
                    getData();
                }
            };

            var topNTableColumns = [{
                "sTitle":  $scope.i18n.common_term_alarmName_label,
                "mData":  function (data) {
                    return $.encoder.encodeForHTML(data.alarmName);
                },
                "bSortable": false
            }, {
                "sTitle":  $scope.i18n.common_term_alarmID_label,
                "mData":  function (data) {
                    return $.encoder.encodeForHTML(data.alarmId);
                },
                "bSortable": false
            }, {
                "sTitle":  $scope.i18n.common_term_objectType_label,
                "mData":  function (data) {
                    return $.encoder.encodeForHTML(data.moc);
                },
                "bSortable": false
            }, {
                "sTitle": $scope.i18n.common_term_quantityNum_label,
                "mData":  function (data) {
                    return $.encoder.encodeForHTML(data.alarmNum);
                },
                "bSortable": false
            }];

            $scope.alarmTableModel = {
                "id": "alarmTableModel",
                "data": [],
                "columns": topNTableColumns,
                "enablePagination": false,
                "lengthChange": true,
                "hideTotalRecords": true,
                "columnsDraggable": true
            };

            $scope.charCollection = [];

            function getCharObject(name, series) {
                var chartId = name;
                var isNew = true;
                try {
                    $("#" + chartId).find("div").remove();
                    if (isNew) {
                        var obj = {};
                        var cc = new Columnchart({
                            id: chartId,
                            maxNameLength:280,
                            width: "100%",
                            isFill: true,
                            style: "bold",
                            textWidth:"auto",
                            values: series
                        });
                        obj.chart = cc;
                        obj.id = chartId;
                        $scope.charCollection.push(obj);
                    }
                } catch (e) {}
            }


            function getQueryJsonInfo() {
                var conditionList = [];
                var statisticConditionInfo = {};
                var staticType = ["alarmId"];
                statisticConditionInfo.staticType = staticType;
                var staticCond = {};

                staticCond.alarmLevel = ($("#querySeverityCtrl").widget() == undefined ? "0" : $("#querySeverityCtrl").widget().getSelectedId());
                staticCond.cycleUnit = ($("#queryCycleCtrl").widget() == undefined ? "week" : $("#queryCycleCtrl").widget().getSelectedId());
                staticCond.startTime = ($("#" + $scope.timeIds.searchStartTime).widget() == undefined ? "" : $("#" + $scope.timeIds.searchStartTime).widget().getDateTime());
                staticCond.endTime = ($("#" + $scope.timeIds.searchEndTime).widget() == undefined ? "" : $("#" + $scope.timeIds.searchEndTime).widget().getDateTime());
                staticCond.topN = ($("#queryTopNCtrl").widget() == undefined ? "10" : $("#queryTopNCtrl").widget().getSelectedId());

                if (staticCond.startTime != "") {
                    staticCond.startTime = CommonService.local2Utc(staticCond.startTime);
                }
                if (staticCond.endTime != "") {
                    staticCond.endTime = CommonService.local2Utc(staticCond.endTime);
                }
                staticCond.cycleUnit == "custom" || delete staticCond.startTime;
                staticCond.cycleUnit == "custom" || delete staticCond.endTime;
                staticCond.alarmLevel != "0" || delete staticCond.alarmLevel;
                statisticConditionInfo.staticCond = staticCond;
                conditionList.push(statisticConditionInfo);

                return JSON.stringify({
                    "conditionList": conditionList
                });
            }

            function getMaxAlarmNum() {
                var max = 0;
                for (var i = 0; i < $scope.alarmTableModel.data.length; i++) {
                    max = (parseInt(max) < parseInt($scope.alarmTableModel.data[i].alarmNum) ? $scope.alarmTableModel.data[i].alarmNum : max);
                }

                return max;
            }

            function createChart() {
                var maxAlarmNum = getMaxAlarmNum();
                var arr = [];
                for (var i = 0; i < $scope.alarmTableModel.data.length; i++) {
                    var ar = {
                        textValue: $.encoder.encodeForHTML( $scope.alarmTableModel.data[i].alarmNum) + ($scope.i18n.locale == "zh" ? "（个）" : ""),
                        name: $.encoder.encodeForHTML( $scope.alarmTableModel.data[i].alarmName),
                        value: $scope.alarmTableModel.data[i].alarmNum,
                        initValue: 0,
                        maxValue: maxAlarmNum,
                        color: "#1FBE5C"
                    };
                    arr.push(ar);
                }
                var series = {
                    series: arr
                };
                getCharObject("alarm_chart", series)
            }

            function getData() {
                AlarmService.getAlarmsStatisticInfo(
                    getQueryJsonInfo(), ($scope.i18n.locale == "zh" ?"zh_CN" : "en_US"), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.alarmTableModel.data = result.data.value;
                                createChart();
                            });

                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    },$scope.isLocal);
            }


            getData();
        }
    ];
    return alarmStatCtrl;
});
