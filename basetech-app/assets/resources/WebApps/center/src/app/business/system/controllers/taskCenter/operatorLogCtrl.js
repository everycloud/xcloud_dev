/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：操作日志查询
 * 修改人：
 * 修改时间：2014-04-17
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/system/services/operatorLogService",
    "app/services/commonService",
    "app/services/downloadService",
    "tiny-widgets/Window",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FilterSelect"],
    function ($, angular, OperatorLogService, commonService, DownloadService, Window) {

        "use strict";
        var operatorLogCtrl = ["$scope", "$q", "camel", function ($scope, $q, camel) {
            var i18n = $scope.i18n;
            var user = $scope.user;
            var operatorLogService = new OperatorLogService($q, camel);
            var downloadService = new DownloadService();

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
                    "result_all": {
                        label: i18n.common_term_allResult_label || "全部结果",
                        val: "",
                        checked: true
                    },
                    "successed": {
                        label: i18n.common_term_success_value || "成功",
                        val: "successed"
                    },
                    "failed": {
                        label: i18n.common_term_fail_label || "失败",
                        val: "failed"
                    },
                    "doing": {
                        label: i18n.common_term_processing_value || "处理中",
                        val: "doing"
                    }
                }
            };
            //转换select 配置信息为select可识别的格式
            for (var confName in selectConfig) {
                var config = selectConfig[confName];
                $scope[confName + "Values"] = [];
                for (var p in config) {
                    $scope[confName + "Values"].push({
                        selectId: p,
                        label: config[p].label,
                        checked: config[p].checked
                    });
                }
            }

            $scope.time = {
                id: "periodPicker",
                width: 154,
                type: "datetime",
                timeFormat: "hh:mm:ss",
                dateFormat: "yy-mm-dd",
                label: i18n.common_term_operationDate_label + ":",
                ampm: false,
                firstDay: 1,
                start: {
                    minDate: formatDate(MIN_DATE),//上线时间
                    maxDate: formatDate(),//现在
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.ids.endTime).widget().option("minDate", date);
                        }
                        else{
                            $("#" + $scope.ids.endTime).widget().option("minDate", formatDate(MIN_DATE));
                        }
                        $scope.filterChange();
                    }
                },
                end: {
                    minDate: formatDate(MIN_DATE),//上线时间
                    maxDate: formatDate(),//现在
                    onClose: function (date) {
                        if(date){
                            $("#" + $scope.ids.startTime).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.ids.startTime).widget().option("maxDate", formatDate());
                        }
                        $scope.filterChange();
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
            var lang = {
                zh: "zh_CN",
                en: "en_US"
            };
            $scope.searchModel = {
                start: 0,
                limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                vdcId: "1",
                language: lang[window.urlParams.lang]
            };
            $scope.filterChange = function () {
                $scope.searchModel.start = 0;
                $scope.operatorTable.curPage = {"pageIndex": 1};
                $scope.search();
            };
            //搜索框
            $scope.searchBox = {
                "placeholder": i18n.task_term_findUserOperatIP_prom,
                "type": "round", // round,square,long
                "width": "330",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.filterChange();
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

            $scope.btns = {
                export: {
                    id: "exportBtn",
                    text: i18n.common_term_export_button,
                    disable: false,
                    handler: function () {
                        $scope.export();
                    }
                },
                refresh: {
                    id: "refreshBtn",
                    text: i18n.common_term_fresh_button,
                    iconClass: {
                        left: "icon-refresh"
                    },
                    handler: function () {
                        $scope.searchModel.start = 0;
                        $scope.search();
                    }
                }
            };

            $scope.operatorTable = {
                "id": "operatorTableId",
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
                        "sWidth": "10%",
                        "bSortable": false
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
                        "sTitle": i18n.common_term_objectName_label || "对象名称",
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
                            var levelText = data.levelText || "";
                            return $.encoder.encodeForHTML("" + levelText);
                        },
                        "bSortable": false,
                        "sWidth": "50px"
                    },
                    {
                        //操作结果
                        "sTitle": i18n.common_term_operationResult_label,
                        "mData": function (data) {
                            var resultText = data.resultText || "";
                            return $.encoder.encodeForHTML("" + resultText);
                        },
                        "sWidth": "100px",
                        "bSortable": false
                    },
                    {
                        //操作用户
                        "sTitle": i18n.common_term_operationBy_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userInfo && data.userInfo.name);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        //用户IP
                        "sTitle": i18n.common_term_userIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userInfo && data.userInfo.ip);
                        },
                        "sWidth": "15%",
                        "bSortable": false
                    },
                    {
                        //操作时间
                        "sTitle": i18n.common_term_operationDate_label,
                        "mData": function (data) {
                            var startTime = data.startTime || "";
                            return $.encoder.encodeForHTML("" + startTime);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    }
                ],
                "pagination": "true",
                "paginationStyle": "full_members",
                "curPage": {"pageIndex": 1},
                "totalRecords": 0,
                "hideTotalRecords": false,
                "lengthChange": "true",
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "visibility": {
                    "aiExclude": [0, 1]
                },
                "draggable": true,
                "enableFilter": false,
                "showDetails": true,
                "renderRow": function (row, dataitem, index) {
                    $(row).attr("lineNum", index).data("values", dataitem);
                    //列表的下钻详情处理
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);

                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();
                    $("td:eq(3)", row).addTitle();
                    $("td:eq(4)", row).addTitle();
                    $("td:eq(5)", row).addTitle();
                    $("td:eq(6)", row).addTitle();
                    $("td:eq(7)", row).addTitle();
                    $("td:eq(8)", row).addTitle();
                    $("td:eq(9)", row).addTitle();
                    $("td:eq(10)", row).addTitle();
                },
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;

                    $scope.operatorTable.curPage = {
                        pageIndex: evtObj.currentPage
                    };
                    $scope.operatorTable.displayLength = evtObj.displayLength;
                    $scope.search();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;

                    $scope.operatorTable.curPage = {
                        pageIndex: evtObj.currentPage
                    };
                    $scope.operatorTable.displayLength = evtObj.displayLength;
                    $scope.search();
                }
            };

            var parseOperatorLogs = function (response) {
                var list = response.operationLog;
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    var configResult = selectConfig.result[item.result];
                    var configLevel = selectConfig.level[item.level];
                    item.resultText = configResult && configResult.label;
                    item.levelText = configLevel && configLevel.label;
                    item.startTime && (item.startTime = commonService.utc2Local(item.startTime));
                    item.detail = {
                        contentType: "url",
                        content: "app/business/system/views/taskCenter/operatorLogDetail.html"
                    };
                }
                $scope.operatorTable.totalRecords = response.total;
                $scope.operatorTable.data = list;
            };

            $scope.search = function () {
                var data = getSearchData();
                $.extend(data, $scope.searchModel);
                //for search input
                var promise = operatorLogService.queryOperatorLog({
                    vdcId: 1,
                    userId: user.id,
                    params: JSON.stringify(data)
                });
                promise.then(function (resolvedValue) {
                    parseOperatorLogs(resolvedValue);
                });
            };

            $scope.export = function () {
                var data = getSearchData();
                $.extend(data, $scope.searchModel);
                var options = {
                    "winId": "downLoadConfigWindowId",
                    "params": {
                        vdcId: "1",
                        userId: user.id,
                        totalRecords:$scope.operatorTable.totalRecords,
                        params: data
                    },
                    "title": i18n.log_term_exportOperationLog_button || "导出操作日志",
                    "content-type": "url",
                    "content": "app/business/system/views/taskCenter/exportConfig.html",
                    "height": 220,
                    "width": 510,
                    "resizable": false,
                    "maximizable":false,
                    "minimizable": false,
                    "buttons": null,
                    "beforeClose": function () {
                    },
                    "close": function (event) {
                        $scope.search();
                    }
                };
                var downloadWindow = new Window(options);
                downloadWindow.show();
            };

            $scope.search();

            $scope.$on('$destroy', function () {
            });

        }];
        return operatorLogCtrl;
    });