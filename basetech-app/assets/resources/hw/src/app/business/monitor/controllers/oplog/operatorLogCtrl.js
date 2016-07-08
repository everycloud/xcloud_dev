/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：操作日志查询
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/monitor/services/operatorLogService",
    "app/services/commonService",
    "tiny-lib/underscore",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FilterSelect",
    "fixtures/systemFixture"],
    function ($, angular, OperatorLogService, commonService, _) {
        "use strict";
        var operatorLogCtrl = ["$scope", "$q", "camel", "exception", function ($scope, $q, camel, exception) {
            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            var operatorLogService = new OperatorLogService(exception, $q, camel);
            var locale = $scope.urlParams.lang === "en" ? "en_US" : "zh_CN";
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
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            //select 配置信息
            var selectConfig = {
                level: {
                    //全部操作
                    "level_all": {
                        label: i18n.common_term_allOperation_label,
                        val: "",
                        checked: true
                    },
                    //高危
                    "high_risk": {
                        label: i18n.common_term_highRisk_label,
                        val: "high_risk"
                    },
                    //危险
                    "risky": {
                        label: i18n.common_term_danger_label,
                        val: "risky"
                    },
                    //一般
                    "minor": {
                        label: i18n.common_term_general_label,
                        val: "minor"
                    },
                    //提示
                    "message": {
                        label: i18n.log_term_warning_label,
                        val: "message"
                    }
                },
                result: {
                    //全部结果
                    "result_all": {
                        label: i18n.common_term_allResult_label,
                        val: "",
                        checked: true
                    },
                    //成功
                    "successed": {
                        label: i18n.common_term_success_value,
                        val: "successed"
                    },
                    //失败
                    "failed": {
                        label: i18n.common_term_fail_label,
                        val: "failed"
                    },
                    //处理中
                    "doing": {
                        label: i18n.common_term_processing_value,
                        val: "doing"
                    }
                }
            };

            function getSelValues(selName) {
                var config = selectConfig[selName];
                var selValues = [];
                _.each(config, function (item, index) {
                    selValues.push({
                            "selectId": index,
                            "label": item.label,
                            "checked": item.checked
                        }
                    );
                });
                return selValues;
            }

            $scope.logLevel = {
                "id": "level",
                "width": "120",
                "values": getSelValues("level"),
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.command.list();
                }
            };
            $scope.logResult = {
                "id": "result",
                "width": "120",
                "values": getSelValues("result"),
                "change": function () {
                    $scope.searchModel.start = 0;
                    $scope.command.list();
                }
            };
            $scope.timeRange = {
                "label": i18n.common_term_operationDate_label + ":",
                "startTime": {
                    "id": "startTime",
                    "width": 154,
                    "type": "datetime",
                    "timeFormat": "hh:mm:ss",
                    "dateFormate": "yy-mm-dd",
                    "minDate": formatDate(MIN_DATE),
                    "maxDate": formatDate(),
                    "ampm": false,
                    "firstDay": 1,
                    "on-close": close,
                    "close": function (date) {
                        if(date){
                            $("#" + $scope.timeRange.endTime.id).widget().option("minDate", date);
                        }
                        else{
                            $("#" + $scope.timeRange.endTime.id).widget().option("minDate", formatDate(MIN_DATE));
                        }
                        $scope.searchModel.start = 0;
                        $scope.command.list();
                    }
                },
                "endTime": {
                    "id": "endTime",
                    "width": 154,
                    "type": "datetime",
                    "timeFormat": "hh:mm:ss",
                    "dateFormate": "yy-mm-dd",
                    "minDate": formatDate(MIN_DATE),
                    "maxDate": formatDate(),
                    "ampm": false,
                    "firstDay": 1,
                    "on-close": close,
                    "close": function (date) {
                        if(date){
                            $("#" + $scope.timeRange.startTime.id).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.timeRange.startTime.id).widget().option("maxDate", formatDate());
                        }
                        $scope.searchModel.start = 0;
                        $scope.command.list();
                    }
                }
            };
            $scope.ids = {
                level: "level",
                result: "result",
                startTime: "startTime",
                endTime: "endTime",
                search: "searchInputId"
            };
            $scope.searchModel = {
                start: page.getStart(),
                limit: page.displayLength,
                vdcId: user.vdcId,
                language: locale
            };
            //搜索框
            $scope.searchBox = {
                "placeholder": i18n.task_term_findUserOperatIP_prom,
                "type": "round", // round,square,long
                "width": "330",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.command.list();
                }
            };
            var getValue = function (id) {
                var widgetDom = $("#" + id);
                if (widgetDom && widgetDom.length) {
                    var widget = widgetDom.widget();
                    if (widget.getValue) {//textbox
                        return widget.getValue();
                    } else if (widget.getDateTime) {//datetiem
                        var uctTime = widget.getDateTime();
                        uctTime && (uctTime = commonService.local2Utc(uctTime));
                        return uctTime;
                    } else if (widget.getSelectedId) {//select
                        return selectConfig[id][widget.getSelectedId()].val;
                    } else {
                        return "";
                    }
                }
            };

            var getSearchData = function () {
                var data = {};
                for (var p in $scope.ids) {
                    if (p === "search") {//搜索框
                        var search = getValue($scope.ids[p]) || "";
                        data.userName = search;
                        data.userIp = search;
                        data.operationName = search;
                    } else {
                        data[p] = getValue($scope.ids[p]) || "";
                    }
                }
                return data;
            };
            $scope.refresh = {
                id: "refreshBtn",
                tips: i18n.common_term_fresh_button,
                click: function () {
                    $scope.command.list();
                }
            };
            $scope.opLogTable = {
                "id": "monitorOplogTableId",
                "paginationStyle": "full_members",
                "totalRecords": 0,
                "columnsDraggable": true,
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "showDetails": true,
                "data": [],
                "columns": [
                    {
                        "sTitle": "",
                        "sWidth": "20px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        //操作名称
                        "sTitle": i18n.common_term_operationName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.operationName);
                        },
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": i18n.common_term_objectID_label || "对象ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceId);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        //对象名称
                        "sTitle": i18n.common_term_objectName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceName);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        //部件名称
                        "sTitle": i18n.common_term_assemblyName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.componentInfo && data.componentInfo.name);
                        },
                        "bSortable": false,
                        "sWidth": "15%"
                    },
                    {
                        //部件类型
                        "sTitle": i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.componentInfo && data.componentInfo.type);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        //级别
                        "sTitle": i18n.common_term_level_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.levelText);
                        },
                        "bSortable": false,
                        "sWidth": "50px"
                    },
                    {
                        //操作结果
                        "sTitle": i18n.common_term_operationResult_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resultText);
                        },
                        "sWidth": "100px"
                    },
                    {
                        //操作用户
                        "sTitle": i18n.common_term_operationBy_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userInfo && data.userInfo.name);
                        },
                        "sWidth": "10%"
                    },
                    {
                        //用户IP
                        "sTitle": i18n.common_term_userIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userInfo && data.userInfo.ip);
                        },
                        "sWidth": "15%"
                    },
                    {
                        //操作时间
                        "sTitle": i18n.common_term_operationDate_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startTime);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                    $('td:eq(8)', nRow).addTitle();
                    $('td:eq(9)', nRow).addTitle();
                    $('td:eq(10)', nRow).addTitle();
                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.itemValues = aData;
                    });
                },
                callback: function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.searchModel.start = page.getStart();
                    $scope.searchModel.limit = page.displayLength;
                    $scope.command.list();
                },
                changeSelect: function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.searchModel.start = page.getStart();
                    $scope.searchModel.limit = page.displayLength;
                    $scope.command.list();
                }
            };
            $scope.command = {
                "list": function () {
                    var data = getSearchData();
                    $.extend(data, $scope.searchModel);
                    var promise = operatorLogService.queryOperatorLog({
                        vdcId: user.vdcId,
                        userId: user.id,
                        params: data
                    });
                    promise.then(function (response) {
                        if (!response) {
                            return;
                        }
                        var opLogList = response.operationLog;
                        _.each(opLogList, function (item) {
                            item.resultText = selectConfig.result[item.result].label;
                            item.levelText = selectConfig.level[item.level].label;
                            item.startTime && (item.startTime = commonService.utc2Local(item.startTime));
                            item.detail = {
                                contentType: "url",
                                content: "app/business/monitor/views/oplog/operatorLogDetail.html"
                            };
                        });
                        $scope.opLogTable.data = opLogList;
                        $scope.opLogTable.totalRecords = response.total;
                        $scope.opLogTable.displayLength = page.displayLength;
                        $("#" + $scope.opLogTable.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                },
                "export": function () {
                    var data = getSearchData();
                    var promise = operatorLogService.exportOperatorLog({
                        vdcId: "1",
                        userId: user.id,
                        params: JSON.stringify(data)
                    });
                    promise.then(function (resolvedValue) {
                    });
                }
            };
            $scope.command.list();
        }];
        return operatorLogCtrl;
    });