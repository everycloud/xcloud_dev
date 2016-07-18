/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-6
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/commonService",
    "app/business/system/controllers/constants",
    "app/services/exceptionService",
    "language/eventtype"],
    function ($, angular, Window, Message, commonService, constants, ExceptionService, TaskMap) {

        "use strict";
        var taskCenterCtrl = ["$scope", "$compile", "$state", "camel", '$interval', function ($scope, $compile, state, camel, $interval) {
                var user = $scope.user;
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

                var getStatusValues = function () {
                    var stateSelect = [
                        {
                            //全部状态
                            "selectId": "ALL",
                            "label": i18n.common_term_allStatus_value || "全部状态",
                            "checked": true
                        },
                        {
                            //成功
                            "selectId": "SUCCESS",
                            "label": i18n.common_term_success_value || "成功"
                        },
                        {
                            //失败
                            "selectId": "FAILED",
                            "label": i18n.common_term_fail_label || "失败"
                        },
                        {
                            //运行中
                            "selectId": "RUNNING",
                            "label": i18n.common_term_running_value || "未开始"
                        },
                        {
                            //超时
                            "selectId": "TIMEOUT",
                            "label": i18n.temp_taskcenter_timeout || "超时"
                        },
                        {
                            //未开始
                            "selectId": "WAITING",
                            "label": i18n.common_term_noStart_value || "未开始"
                        },
                        {
                            //部分成功
                            "selectId": "COMPLETED",
                            "label": i18n.common_term_partSucceed_value || "部分成功"
                        },
                        {
                            //取消中
                            "selectId": "CANCELLING",
                            "label": i18n.common_term_cancling_value || "取消中"
                        },
                        {
                            //已取消
                            "selectId": "CANCELLED",
                            "label": i18n.common_term_cancled_value || "取消"
                        },
                        {
                            //未知
                            "selectId": "UNKNOW",
                            "label": i18n.common_term_unknown_value || "未知"
                        }
                    ]
                    return stateSelect;
                }

                var langConfig = {
                    zh: "zh_CN",
                    en: "en_US"
                };
                var lang = langConfig[window.urlParams.lang];

                //状态下拉框
                $scope.searchStatus = {
                    "id": "searchStatusId",
                    "width": "120",
                    "values": getStatusValues(),
                    "change": function () {
                        $scope.searchModel.status = $("#searchStatusId").widget().getSelectedId();
                        $scope.taskTable.curPage = {"pageIndex": 1};
                        $scope.searchModel.start = 0;
                        loadData($scope.searchModel);
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
                        onClose: function (date) {
                            if(date){
                                $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", date);
                            }
                            else{
                                $("#" + $scope.timeIds.searchEndTime).widget().option("minDate", formatDate(MIN_DATE));
                            }
                            var localStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                            if (localStartTime) {
                                $scope.searchModel.queryStartTime = commonService.local2Utc(localStartTime);
                            }
                            else {
                                $scope.searchModel.queryStartTime = "";
                            }
                            var localEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                            if (localEndTime) {
                                $scope.searchModel.queryEndTime = commonService.local2Utc(localEndTime);
                            }
                            else {
                                $scope.searchModel.queryEndTime = "";
                            }
                            $scope.taskTable.curPage = {"pageIndex": 1};
                            $scope.searchModel.start = 0;
                            loadData($scope.searchModel);
                        }
                    },
                    end: {
                        onClose: function (date) {
                            if(date){
                                $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", date);
                            }
                            else{
                                $("#" + $scope.timeIds.searchStartTime).widget().option("maxDate", formatDate());
                            }
                            var localStartTime = $("#" + $scope.timeIds.searchStartTime).widget().getDateTime();
                            if (localStartTime) {
                                $scope.searchModel.queryStartTime = commonService.local2Utc(localStartTime);
                            }
                            else {
                                $scope.searchModel.queryStartTime = "";
                            }
                            var localEndTime = $("#" + $scope.timeIds.searchEndTime).widget().getDateTime();
                            if (localEndTime) {
                                $scope.searchModel.queryEndTime = commonService.local2Utc(localEndTime);
                            }
                            else {
                                $scope.searchModel.queryEndTime = "";
                            }
                            $scope.taskTable.curPage = {"pageIndex": 1};
                            $scope.searchModel.start = 0;
                            loadData($scope.searchModel);
                        }
                    }
                };
                //条件搜索下拉框
                $scope.searchBox = {
                    "id": "taskSearchBox",
                    "placeholder": i18n.task_term_findTaskTypeObjCreator_prom || "请输入任务类型/任务对象/创建者",
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.multiSearch = searchString;
                        $scope.taskTable.curPage = {"pageIndex": 1};
                        $scope.searchModel.start = 0;
                        loadData($scope.searchModel);
                    }
                };

                //查询model
                $scope.searchModel = {
                    "start": 0,
                    "limit": 10,
                    "status": "",
                    "queryStartTime": "",
                    "queryEndTime": "",
                    "multiSearch": ""
                };

                //状态设置
                $scope.progressTask = {
                    "id": "progressbarId",
                    "width": "60",
                    "height": "10",
                    "value": 0,
                    "color": "green"
                };

                $scope.taskTable = {
                    "id": "taskCenterId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": "",
                            "sWidth": "40px",
                            "mData": "detail",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            //任务类型
                            "sTitle": i18n.task_term_taskType_label,
                            "mData": function (data) {
                                var eventType = (data.taskEventtype && data.taskEventtype.eventType) || "";
                                return $.encoder.encodeForHTML("" + eventType);
                            }
                        },
                        {
                            //ID
                            "sTitle": i18n.common_term_ID_label,
                            "mData": function (data) {
                                var entityId = data.taskId || "";
                                return $.encoder.encodeForHTML("" + entityId);
                            }
                        },
                        {
                            //任务对象
                            "sTitle": i18n.common_term_operationObj_label,
                            "mData": function (data) {
                                var entityName = (data.taskEntity && data.taskEntity.entityName) || "";
                                return $.encoder.encodeForHTML("" + entityName);
                            }
                        },
                        {
                            //状态
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                var statusStr = (data.taskProgress && data.taskProgress.statusStr) || "";
                                return $.encoder.encodeForHTML("" + statusStr);
                            }
                        },
                        {
                            //创建时间
                            "sTitle": i18n.common_term_createAt_label,
                            "mData": function (data) {
                                var applyTime = (data.taskTime && data.taskTime.applyTime) || "";
                                return $.encoder.encodeForHTML("" + applyTime);
                            }
                        },
                        {
                            //开始时间
                            "sTitle": i18n.common_term_startTime_label,
                            "mData": function (data) {
                                var startTime = (data.taskTime && data.taskTime.startTime) || "";
                                return $.encoder.encodeForHTML("" + startTime);
                            }
                        },
                        {
                            //完成时间
                            "sTitle": i18n.common_term_completeTime_label,
                            "mData": function (data) {
                                var finishTime = (data.taskTime && data.taskTime.finishTime) || "";
                                return $.encoder.encodeForHTML("" + finishTime);
                            }
                        },
                        {
                            //创建者
                            "sTitle": i18n.common_term_createBy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.userName);
                            }
                        },
                        {
                            //操作
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "",
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "full_members",
                    "lengthChange": true,
                    "visibility": {
                        "activate": "click",
                        "aiExclude": [0, 1, 8],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {
                        }
                    },
                    "draggable": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
                    "curPage": {"pageIndex": 1},
                    "requestConfig": {"enableRefresh": true, "refreshInterval": 6000, "httpMethod": "GET", "url": "", "data": "", "sAjaxDataProp": "mData"},
                    "showDetails": true,
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    callback: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        loadData($scope.searchModel);
                    },
                    changeSelect: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.taskTable.displayLength = evtObj.displayLength;
                        loadData($scope.searchModel);
                    },
                    "renderRow": function (row, dataitem, index) {
                        $('td:eq(2)', row).addTitle();
                        $('td:eq(3)', row).addTitle();
                        $(row).attr("taskId", $.encoder.encodeForHTML(dataitem.taskId));
                        $(row).attr("lineNum", index);
                        //可以取消任务的条件：任务状态为未开始，进行取消操作的用户是任务的创建者，任务类型为(IRM.Disk.MigrateSingleDisk)或(IRM.VM.MigrateDisksInVm)
                        var canTaskCancel = false;
                        var taskTypeString = dataitem.taskEventtype.eventTypeString.toUpperCase();
                        var supportCancelTaskType = (taskTypeString == 'IRM.VOLUME.MIGRATE' || taskTypeString == 'IRM.VM.BATCH.CREATE')?true:false;
                        if (supportCancelTaskType && dataitem.userId == user.id && (dataitem.taskProgress.status == 'WAITING' || dataitem.taskProgress.status == 'RUNNING')) {
                            canTaskCancel = true;
                        }

                        if (canTaskCancel) {
                            var optTemplates = "<div><a class='pointer' href='javascript:void(0)' ng-click='cancleTask()'>" + i18n.common_term_cancle_button + "</a></div>";
                        }
                        var opts = $compile($(optTemplates));
                        var optscope = $scope.$new(false);
                        optscope.cancleTask = function () {
                            operateTask({"cancelTaskReq": {"taskid": dataitem.taskId}});
                        };
                        var optNode = opts(optscope);
                        $("td:eq(9)", row).html(optNode);

                        //子任务状态链接
                        var link = $compile($("<a href='javascript:void(0)' ng-click='failTask()'>{{status}}</a>"));
                        var scope = $scope.$new(false);
                        var id = $scope.progressTask.id + index;
                        //进行中
                        var optTemplates = '<div>' + i18n.common_term_processing_value + '<div><tiny-progressbar id=' +
                            id + ' width="progressTask.width" height="progressTask.height" value=' +
                            dataitem.taskProgress.executePercent + ' color="progressTask.color"></tiny-progressbar></div></div>';
                        var linkTask = $compile($(optTemplates));
                        var scopeTask = $scope.$new(false);

                        if (dataitem.taskProgress.status == 'FAILED' || dataitem.taskProgress.status == 'COMPLETED') {
                            scope.status = constants.config.TASK_STATUS[dataitem.taskProgress.status];
                            var node = link(scope);
                            $("td:eq(4)", row).html(node);
                        } else if (dataitem.taskProgress.status == 'RUNNING') {
                            var nodeTask = linkTask(scopeTask);
                            $("td:eq(4)", row).html(nodeTask);
                        }
                        else {
                            //do nothing!
                        }

                        scope.failTask = function () {
                            var newWindow = new Window({
                                "winId": "newWindowId",
                                "failReason": dataitem.taskProgress.failReason,
                                "failResolve": dataitem.taskProgress.failResolve,
                                "taskId": dataitem.taskId,
                                "minimizable": false,
                                "maximizable": false,
                                "title": i18n.common_term_failDetail_label || "失败详情",
                                "content-type": "url",
                                "buttons": null,
                                "content": "app/business/system/views/taskCenter/failReason.html",
                                "height": 600,
                                "width": 800,
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

                var queryTasks = function (params) {
                    var deferred = camel.get({
                        "url": {s: "/goku/rest/v1.5/1/tasks?start={startno}&count={countnum}&withsubtask={withsubtask}",
                            o: {"startno": params.start, "countnum": params.limit, "withsubtask": false}},
                        "userId": user.id,
                        "monitor": false
                    });

                    deferred.success(function (response) {
                        var taskCenterRes = response.allTopTask.taskList;
                        for (var item in taskCenterRes) {
                            taskCenterRes[item].detail = {
                                contentType: "url",
                                content: "app/business/system/views/taskCenter/taskDetail.html"
                            }
                            taskCenterRes[item].taskEventtype.eventType = TaskMap[taskCenterRes[item].taskEventtype.eventTypeString.toString()] || taskCenterRes[item].taskEventtype.eventTypeString;
                            taskCenterRes[item].taskProgress.statusStr = constants.config.TASK_STATUS[taskCenterRes[item].taskProgress.status];

                        }
                        $scope.$apply(function () {
                            $scope.taskTable.data = taskCenterRes;
                            $scope.taskTable.totalRecords = response.allTopTask.totalNum;
                        });
                    });
                };

                var operateTask = function (request) {
                    var deferred = camel.post({
                        "url": {s: "/goku/rest/v1.5/{tenant_id}/tasks/action", o: {"tenant_id": "1"}},
                        "userId": user.id,
                        "params": JSON.stringify(request)
                    });
                    deferred.done(function (response) {
                        loadData($scope.searchModel);
                    });
                    deferred.fail(function (response) {
                        loadData($scope.searchModel);
                        new ExceptionService().doException(response);
                    });
                }

                var loadData = function (params, monitor, autoRequest) {
                    var batchQueryReq = {
                        "start": params.start,
                        "limit": params.limit
                    };
                    if (params.status && params.status != "ALL") {
                        batchQueryReq.queryTaskStatus = params.status;
                    }
                    if (params.queryStartTime && params.queryStartTime != "") {
                        batchQueryReq.queryCreateTimeFrom = params.queryStartTime;
                    }
                    if (params.queryEndTime && params.queryEndTime != "") {
                        batchQueryReq.queryCreateTimeTo = params.queryEndTime;
                    }
                    if (params.multiSearch && params.multiSearch != "") {
                        batchQueryReq.queryTasktype = params.multiSearch;
                        batchQueryReq.queryCreator = params.multiSearch;
                        batchQueryReq.queryTaskObject = params.multiSearch;
                        batchQueryReq.locale = lang;
                    }

                    var deferred = camel.post({
                        "url": {
                            s: "/goku/rest/v1.5/{tenant_id}/tasks/action",
                            o: {"tenant_id": "1"}
                        },
                        "params": JSON.stringify({"batchQueryReq": batchQueryReq}),
                        "userId": user.id,
                        "monitor": monitor,
                        "autoRequest": autoRequest
                    });
                    deferred.done(function (response) {
                        if (!response || !response.batchQueryResp || !response.batchQueryResp.taskList) {
                            return;
                        }
                        var taskCenterRes = response.batchQueryResp.taskList;
                        for (var item in taskCenterRes) {
                            taskCenterRes[item].detail = {
                                contentType: "url",
                                content: "app/business/system/views/taskCenter/taskDetail.html"
                            }
                            taskCenterRes[item].taskEventtype.eventType = TaskMap[taskCenterRes[item].taskEventtype.eventTypeString.toString()] || taskCenterRes[item].taskEventtype.eventTypeString;
                            taskCenterRes[item].taskProgress.statusStr = constants.config.TASK_STATUS[taskCenterRes[item].taskProgress.status];
                            var taskTime = taskCenterRes[item].taskTime;
                            taskTime.applyTime && (taskTime.applyTime = commonService.utc2Local(taskTime.applyTime));
                            taskTime.startTime && (taskTime.startTime = commonService.utc2Local(taskTime.startTime));
                            taskTime.finishTime && (taskTime.finishTime = commonService.utc2Local(taskTime.finishTime));
                        }
                        $scope.$apply(function () {
                            $scope.taskTable.data = taskCenterRes;
                            $scope.taskTable.totalRecords = response.batchQueryResp.total;
                        });
                    });
                }

                $scope.refresh = {
                    "id": "refreshBtnId",
                    "text": i18n.common_term_fresh_button,
                    "click": function () {
                        loadData($scope.searchModel);
                    }
                }

                var autoUpdateTaskValue = function () {
                    var autoUpdateTaskSelect = [
                        {
                            //开启
                            "selectId": "1",
                            "label": i18n.common_term_enable_value,
                            "checked": true
                        },
                        {
                            //关闭
                            "selectId": "2",
                            "label": i18n.common_term_shut_value
                        }
                    ]
                    return autoUpdateTaskSelect;
                }

                $scope.autoUpdateTask = {
                    "id": "autoUpdateTaskId",
                    "width": "80px",
                    "values": autoUpdateTaskValue()
                }

                $scope.promise = undefined;

                $scope.clearTimer = function () {
                    try {
                        $interval.cancel($scope.promise);
                    }
                    catch (e) {
                        // do nothing
                    }
                };

                $scope.init = function () {
                    $scope.promise = $interval(function () {
                        if (0 == $('div[id^=taskDetailDiv]').length) {
                            loadData($scope.searchModel, false, true);
                        }
                    }, 10000);
                };
                //初始化数据
                loadData($scope.searchModel);
                //定时器初始化
                $scope.init();

                // 清理定时器
                $scope.$on('$destroy', function () {
                    $scope.clearTimer();
                });

            }
            ]
            ;
        return taskCenterCtrl;
    }
)
;
