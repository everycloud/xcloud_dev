/* global define */
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Columnchart",
    "app/business/monitor/services/performanceService",
    "app/services/cloudInfraService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"
], function ($, angular, Message, _, $encoder, TextBox, Button, Window, Checkbox, Columnchart, performanceService, cloudInfraService) {
    "use strict";

    var alarmStatCtrl = ["$scope", "$compile", "$state", "camel", "$q", "exception", "storage",
        function ($scope, $compile, $state, camel, $q, exception, storage) {

            //公共服务实例
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var performanceServiceIns = new performanceService(exception, $q, camel);
            var user = $scope.user;
            var cloudInfraId = "";
            var MAXIMUM_VALUE = 10;
            var i18n = $scope.i18n;
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

            //查询条件
            $scope.level = "";
            $scope.topN = "10";
            $scope.period = "custom";
            $scope.staticType = ["alarmId"];
            $scope.cycleUnit = "custom";
            $scope.startTime = "";
            $scope.stopTime = "";

            //地域下拉框
            $scope.address = {
                "id": "alarmAddress",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    cloudInfraId = $("#alarmAddress").widget().getSelectedId();
                    $scope.getData();
                    storage.add("cloudInfraId", cloudInfraId);
                }
            };

            //所有级别下拉框
            $scope.searchLevel = {
                "id": "monitorAlarmSearchLevel",
                "width": "100",
                "values": [{
                    "selectId": "",
                    "label": i18n.common_term_allLevel_label,
                    "checked": true
                }, {
                    "selectId": "1",
                    "label": i18n.alarm_term_critical_label
                }, {
                    "selectId": "2",
                    "label": i18n.alarm_term_major_label
                }, {
                    "selectId": "3",
                    "label": i18n.alarm_term_minor_label
                }, {
                    "selectId": "4",
                    "label": i18n.alarm_term_warning_label
                }],
                "change": function () {
                    $scope.level = $("#monitorAlarmSearchLevel").widget().getSelectedId();
                    $scope.getData();
                }
            };

            //所有top下拉框
            $scope.searchTopN = {
                "id": "monitorAlarmSearchTopN",
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
                }],
                "change": function () {
                    $scope.topN = $("#monitorAlarmSearchTopN").widget().getSelectedId();
                    $scope.getData();
                }
            };

            //周期下拉框
            $scope.searchPeriod = {
                "id": "monitorAlarmSearchPeriod",
                "width": "100",
                "values": [{
                    "selectId": "custom",
                    "label": i18n.perform_term_customCycle_label
                }, {
                    "selectId": "day",
                    "label":i18n.common_term_oneDay_label
                },{
                    "selectId": "week",
                    "label":i18n.common_term_oneWeek_label,
                    "checked": true
                }, {
                    "selectId": "month",
                    "label": i18n.common_term_oneMonth_label
                }, {
                    "selectId": "year",
                    "label": i18n.common_term_oneYear_label
                }],
                "change": function () {
                    $scope.period = $("#monitorAlarmSearchPeriod").widget().getSelectedId();
                    $scope.showDateTime = ($("#monitorAlarmSearchPeriod").widget().getSelectedId() === "custom");
                    $scope.getData();
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
                        $scope.startTime = $("#queryStartTimeCtrl").widget().getDateTime();
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
                        $scope.stopTime = $("#queryEndTimeCtrl").widget().getDateTime();
                    }
                }
            };

            //创建查询按钮
            $scope.queryBtn = {
                "id": "queryBtn",
                "text": i18n.common_term_query_button,
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
                    $scope.getData();
                }
            };

            // 条形图数据
            $scope.alarmStats = {
                "id": "monitorAlarmChartId",
                "isFill": false,
                "bold": "bold",
                "width": "100%",
                "values": {
                    series: []
                },
                "show": undefined,
                "noDataTips": i18n.app_term_currentNullData_valid
            };

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.alarmListTable = {
                "id": "alarm-list-table",
                "captain": "vmCaptain",
                "paginationStyle": "full_numbers",
                "enablePagination": false,
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "totalRecords": 0,
                "draggable": true,
                "columns": [{
                    "sTitle": i18n.common_term_alarmName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.alarmName);
                    },
                    "sWidth": "10%",
                    "bSortable": true
                }, {
                    "sTitle": i18n.common_term_alarmID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.alarmId);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_objectType_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.moc);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_quantityNum_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.alarmNum);
                    },
                    "sWidth": "10%",
                    "bSortable": false
                }],
                "data": null,
                "columnVisibility": {
                    "activate": "click",
                    "aiExclude": [0, 3],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {}
                },

                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.getData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                }
            };

            // 查询告警统计列表信息
            $scope.getData = function () {
                var conditionList = [{
                    "staticType": $scope.staticType,
                    "staticCond": {
                        "cycleUnit": $scope.period,
                        "startTime": $scope.startTime,
                        "endTime": $scope.stopTime,
                        "alarmLevel": $scope.level,
                        "topN": $scope.topN
                    }
                }];
                var options = {
                    "user": user,
                    "conditionList": conditionList,
                    "cloudInfraId": cloudInfraId,
                    "locale": "zh_CN"
                };
                var promise = performanceServiceIns.countAlarms(options);
                promise.then(function (response) {
                    if (!response) {
                        return;
                    }
                    var datas = [];
                    if (response.value) {
                        var item = null;
                        var max = getMaxAlarmNum(response.value);
                        _.each(response.value, function (item, index) {
                            item = {
                                textValue:$.encoder.encodeForHTML(item.alarmNum )+ i18n.common_term_entry_label,
                                name: $.encoder.encodeForHTML(item.alarmName),
                                value:$.encoder.encodeForHTML(item.alarmNum),
                                initValue: max > MAXIMUM_VALUE ? max : MAXIMUM_VALUE,
                                maxValue: max > MAXIMUM_VALUE ? max : MAXIMUM_VALUE,
                                color: "#1FBE5C"
                            };
                            datas.push(item);
                        });
                    }
                    if (datas.length > 0) {
                        var values = {
                            series: datas
                        };
                        $scope.alarmStats.values = values;
                        $scope.alarmStats.show = "true";
                    } else {
                        $scope.alarmStats.show = "false";
                    }
                    $scope.alarmListTable.data = response.value;
                });
            };

            function getMaxAlarmNum(data) {
                if (!data) {
                    return 0;
                }
                var max = 0;
                for (var i = 0; i < data.length; i++) {
                    max = (parseInt(max, 10) < parseInt(data[i].alarmNum, 10) ? data[i].alarmNum : max);
                }

                return max;
            }

            //初始化时间控件是否显示
            $scope.page_load = function () {
                $scope.showDateTime = false;
            };
            $scope.page_load();

            //查询当前租户可见的地域列表
            $scope.getLocations = function () {
                var retDefer = $q.defer();
                var promise = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        $scope.address.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                }, function (rejectedValue) {
                    retDefer.reject();
                });
                return retDefer.promise;
            };

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = $scope.getLocations();
                promise.then(function () {
                    //获取告警列表
                    $scope.getData();
                });

            });
        }
    ];

    return alarmStatCtrl;
});
