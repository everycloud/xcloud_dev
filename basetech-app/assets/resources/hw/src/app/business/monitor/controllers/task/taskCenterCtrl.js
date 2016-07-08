define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-lib/underscore",
    "app/services/commonService",
    "app/business/monitor/services/taskCenterService",
    "language/eventtype",
    "tiny-lib/encoder",
    "fixtures/monitorAlarmFixture"],
    function ($, angular, Window, Message, _, commonService, taskCenterService, TaskMap) {
        "use strict";
        var taskCenterCtrl = ["$scope", "$compile", "$state", "$q", "camel", '$interval',"exception", function ($scope, $compile, $state, $q, camel, $interval, exception) {
            var i18n = $scope.i18n;
            var taskCenterServiceins = new taskCenterService(exception, $q, camel);
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
            var getStatusValues = function () {
                var stateSelect = [{
                        //全部状态
                        "selectId": "ALL",
                        "label": i18n.common_term_allStatus_value,
                        "checked": true
                    },{
                        //成功
                        "selectId": "SUCCESS",
                        "label": i18n.common_term_success_value
                    },{
                        //失败
                        "selectId": "FAILED",
                        "label": i18n.common_term_fail_label
                    },{
                        //运行中
                        "selectId": "RUNNING",
                        "label": i18n.common_term_running_value
                    },{
                        //未开始
                        "selectId": "WAITING",
                        "label": i18n.common_term_noStart_value
                    },{
                        //部分成功
                        "selectId": "COMPLETED",
                        "label": i18n.common_term_partSucceed_value
                    },{
                        //取消中
                        "selectId": "CANCELLING",
                        "label": i18n.common_term_cancling_value
                    },{
                        //已取消
                        "selectId": "CANCELLED",
                        "label": i18n.common_term_cancled_value
                    },{
                        //未知
                        "selectId": "UNKNOW",
                        "label": i18n.common_term_unknown_value
                    }];
                return stateSelect;
            };
            var TASK_STATUS = {
                "SUCCESS": i18n.common_term_success_value,
                "RUNNING": i18n.common_term_running_value,
                "WAITING": i18n.common_term_noStart_value,
                "FAILED": i18n.common_term_fail_label,
                "UNKNOW": i18n.common_term_unknown_value,
                "COMPLETED": i18n.common_term_partSucceed_value,
                "CANCELLED": i18n.common_term_cancled_value,
                "CANCELLING": i18n.common_term_cancling_value
            };
            //查询model
            var searchModel = {
                "start": 0,
                "limit": 10,
                "status": "",
                "queryStartTime": "",
                "queryEndTime": "",
                "multiSearch": "",
                "vdcId": $scope.user.vdcId,
                "userId": $scope.user.id,
                "locale": locale
            };
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.help = {
                "helpKey": "drawer_task",
                "tips": i18n.common_term_help_label,
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };
            //状态下拉框
            $scope.searchStatus = {
                "id": "searchStatusId",
                "width": "120",
                "values": getStatusValues(),
                "change": function () {
                    searchModel.status = $("#searchStatusId").widget().getSelectedId();
                    $scope.taskTable.curPage = {"pageIndex": 1};
                    searchModel.start = 0;
                    loadData();
                }
            };

            $scope.timeIds = {
                "searchStartTime": "taskStartTime",
                "searchEndTime": "taskEndTime"
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
                        var localStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                        searchModel.queryStartTime = commonService.local2Utc(localStartTime);
                        var localEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                        searchModel.queryEndTime = commonService.local2Utc(localEndTime);
                        $scope.taskTable.curPage = {"pageIndex": 1};
                        searchModel.start = 0;
                        loadData();
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
                        var localStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                        searchModel.queryStartTime = commonService.local2Utc(localStartTime);
                        var localEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                        searchModel.queryEndTime = commonService.local2Utc(localEndTime);
                        $scope.taskTable.curPage = {"pageIndex": 1};
                        searchModel.start = 0;
                        loadData();
                    }
                }
            };
            //条件搜索下拉框
            $scope.searchBox = {
                "id": "taskSearchBox",
                "placeholder": i18n.task_term_findTaskTypeObjCreator_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    searchModel.multiSearch = searchString;
                    $scope.taskTable.curPage = {"pageIndex": 1};
                    searchModel.start = 0;
                    loadData();
                }
            };

            $scope.taskTable = {
                "id": "taskCenterId",
                "showDetails":false,
                "columnsDraggable": true,
                "data": [],
                "columns": [
                    {
                        //任务类型
                        "sTitle": i18n.task_term_taskType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.eventType);
                        }
                    },{
                        //任务对象
                        "sTitle": i18n.common_term_operationObj_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.entityIds);
                        }
                    },{
                        //状态
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusDis);
                        }
                    },{
                        //开始时间
                        "sTitle": i18n.common_term_startTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startTime);
                        }
                    },{
                        //完成时间
                        "sTitle": i18n.common_term_completeTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.finishTime);
                        }
                    },{
                        //创建者
                        "sTitle": i18n.common_term_createBy_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.userName);
                        }
                    }
                ],
                "paginationStyle": "full_members",
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "totalRecords": 0,
                callback: function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    searchModel.start = page.getStart();
                    searchModel.limit = page.displayLength;
                    loadData();
                },
                changeSelect: function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    searchModel.start = page.getStart();
                    searchModel.limit = page.displayLength;
                    loadData();
                },
                "renderRow": function (row, dataitem, index) {
                    $('td:eq(0)', row).addTitle();
                    $('td:eq(1)', row).addTitle();
                    $('td:eq(3)', row).addTitle();
                    $('td:eq(4)', row).addTitle();
                    $('td:eq(5)', row).addTitle();
                    //详情链接
                    $(row).attr("taskId", $.encoder.encodeForHTML(dataitem.id));
                    $(row).attr("lineNum", index);
                    //子任务状态链接
                    if (dataitem.status === 'FAILED' || dataitem.status === 'COMPLETED') {
                        var link = $compile($("<a href='javascript:void(0)' ng-click='failTask()'>{{status}}</a>"));
                        var scope = $scope.$new(false);
                        scope.status = TASK_STATUS[dataitem.status];
                        var node = link(scope);
                        $("td:eq(2)", row).html(node);

                        scope.failTask = function () {
                            var newWindow = new Window({
                                "winId": "failTaskWindowId",
                                "taskId": dataitem.id,
                                "failReason": dataitem.failReason,
                                "errorCode": dataitem.errorCode,
                                "minimizable": false,
                                "maximizable": false,
                                "title": i18n.common_term_failDetail_label,
                                "content-type": "url",
                                "buttons": null,
                                "content": "app/business/monitor/views/task/failReason.html",
                                "height": 300,
                                "width": 600,
                                "open": function () {
                                    $scope.clearTimer();
                                },
                                "close": function () {
                                    $scope.init();
                                }
                            });
                            newWindow.show();
                        };
                    }
                }
            };

            var loadData = function (monitor, autoRequest) {
                var promise = taskCenterServiceins.queryTasks(searchModel, monitor, autoRequest);
                promise.then(function (response) {
                    if (!response || !response.allTopTask ||!response.allTopTask.taskList) {
                        return;
                    }
                    var taskCenterRes = response.allTopTask.taskList;
                    _.each(taskCenterRes, function (item) {
                        item.eventType = TaskMap[item.eventType] || item.eventType;
                        item.statusDis = TASK_STATUS[item.status] || item.status;
                        item.startTime && (item.startTime = commonService.utc2Local(item.startTime));
                        item.finishTime && (item.finishTime = commonService.utc2Local(item.finishTime));
                    });
                    $scope.taskTable.data = taskCenterRes;
                    $scope.taskTable.totalRecords = response.allTopTask.total;
                    $scope.taskTable.displayLength = page.displayLength;
                    $("#" + $scope.taskTable.id).widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                });
            };

            $scope.refresh = {
                "id": "refreshBtnId",
                "text": i18n.common_term_fresh_button,
                "click": function () {
                    loadData();
                }
            };

            /**
             * 定时器句柄
             */
            $scope.promise = undefined;

            /**
             * 清除定时器
             */
            $scope.clearTimer = function () {
                try {
                    $interval.cancel($scope.promise);
                }
                catch (e) {
                    // do nothing
                }
            };

            /**
             * 初始化操作
             */
            $scope.init = function () {
                $scope.promise = $interval(function () {
                    if (!$('div[id^=taskDetailDiv]').length) {
                        loadData(false, true);
                    }
                }, 10000);
            };
            //初始化数据
            loadData();
            //定时器初始化
            $scope.init();

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }];
        return taskCenterCtrl;
    }
)
;
