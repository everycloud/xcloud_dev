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
    "tiny-widgets/Table",
    "app/services/httpService",
    "app/services/messageService",
    "app/services/commonService",
    "app/business/monitor/controllers/task/constantsFromCenter/constants",
    "language/irm-rpool-exception",
    "language/eventtype",
    "app/services/exceptionService"
],

    function ($, angular, Window, Message, Table, http, MessageService, commonService, constants, Exception, TaskMap, ExceptionService) {
        "use strict";

        var taskDetailCtrl = ["$scope", "camel", "$compile", function ($scope, camel, $compile) {
            var $rootScope = $("html").scope();
            var i18n = $scope.i18n = $rootScope.i18n;
            var user = $rootScope.user;

            $scope.taskDetailTable = {
                "id": "taskCenterId",
                "data": [],
                "pagination": false,
                "columns": [
                    {
                        //序号
                        "sTitle": i18n.common_term_numInOrder_label,
                        "sWidth": "60px",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.SequenceNum);
                        }
                    },
                    {
                        //操作对象
                        "sTitle": i18n.common_term_operationObj_label,
                        "mData": function (data) {
                            var entityName = data.entityIds || data.entityNames[0] || "";
                            return $.encoder.encodeForHTML("" + entityName);
                        }
                    },
                    {
                        //操作类型
                        "sTitle": i18n.common_term_operationType_label,
                        "mData": function (data) {
                            var eventType = data.eventType || "";
                            return $.encoder.encodeForHTML("" + eventType);
                        }
                    },
                    {
                        //状态
                        "sTitle": i18n.common_term_status_label,
                        "sWidth": "60px",
                        "mData": function (data) {
                            var statusStr = data.statusStr || "";
                            return $.encoder.encodeForHTML("" + statusStr);
                        }
                    },
                    {
                        //开始时间
                        "sTitle": i18n.common_term_startTime_label,
                        "sWidth": "140px",
                        "mData": function (data) {
                            var startTime = ( data.startTime) || "";
                            return $.encoder.encodeForHTML("" + startTime);
                        }
                    },
                    {
                        //完成时间
                        "sTitle": i18n.common_term_completeTime_label,
                        "sWidth": "140px",
                        "mData": function (data) {
                            var finishTime = (data.finishTime) || "";
                            return $.encoder.encodeForHTML("" + finishTime);
                        }
                    }
                ],
                "draggable": true,
                "renderRow": function (row, dataitem, index) {
                    $('td:eq(1)', row).addTitle();
                }
            };

            //设置任务信息
            function setTaskInfo(data) {
                var j = 0, k = 0, m = 0, len = 0;
                var mdata = data.specificTask.subTaskList;
                if (mdata == null) {
                    $scope.subTaskNum = 0;
                    $scope.subTaskSucNum = 0;
                    $scope.subTaskFailNum = 0;
                    $scope.runningSubTaskNum = 0;
                } else if (mdata != null) {
                    var len = mdata.length;
                    for (var i = 0; i < len; i++) {
                        if (mdata[i].status == 'FAILED') {
                            ++j;
                        } else if (mdata[i].status == 'SUCCESS') {
                            ++k;
                        } else if (mdata[i].status == 'RUNNING') {
                            ++m;
                        }
                        mdata[i].statusStr = constants.config.TASK_STATUS[mdata[i].status];
                        mdata[i].eventType = TaskMap[mdata[i].eventType.toString()] || mdata[i].eventType;
                        mdata[i].SequenceNum = i + 1;

                        var taskTime = {};
                        mdata[i].startTime && (taskTime.startTime = commonService.utc2Local(mdata[i].startTime));
                        mdata[i].finishTime && (taskTime.finishTime = commonService.utc2Local(mdata[i].finishTime));
                    }
                    $scope.subTaskNum = len;
                    $scope.subTaskSucNum = k;
                    $scope.subTaskFailNum = j;
                    $scope.runningSubTaskNum = m;
                }
                $scope.taskDetailTable.data = data.specificTask.subTaskList;

            }

            $scope.getTaskDetail = function (taskId) {
                var defered = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/{vdc_id}/jobs?id={taskid}&with-sub=true",
                        o: {"vdc_id": user.vdcId, "taskid": taskId}
                    },
                    "userId": user.id
                });
                defered.done(function (response) {
                    $scope.$apply(function () {
                        setTaskInfo(response);
                    });
                });
                defered.fail(function (response) {
                    new ExceptionService().doException(response);
                });
            }
        }];

        var app = angular.module("system.taskCenter.taskDetail", ['ng', "wcc"]);
        app.controller("system.taskCenter.taskDetail.ctrl", taskDetailCtrl);
        app.service("camel", http);
        return app;
    });