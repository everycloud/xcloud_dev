/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-27
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-widgets/Window",
    "tiny-widgets/RadioGroup",
    "app/services/messageService",
    "language/ame-rpool-exception",
    "language/iam-exception",
    "language/irm-rpool-exception",
    "language/sr-rpool-exception",
    "language/ssp-exception",
    "language/ssp-rpool-exception",
    "language/system-exception",
    "app/services/exceptionService"
],

    function ($, angular, http, Window, RadioGroup, MessageService, AmeRpoolException, IamException, IrmRpoolException, SrRpoolException, SspException, SspRpoolException, SystemException, ExceptionService) {
        "use strict";
        var failReasonCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
                var taskId = $("#newWindowId").widget().option("taskId");
                var $rootScope = $("html").scope();
                var i18n = $scope.i18n = $rootScope.i18n;
                var user = $rootScope.user;
                //失败原因
                $scope.failReason = {
                    "id": "failReasonId",
                    "label": i18n.common_term_failCause_label + ":",
                    "value": ""
                };

                //解决办法
                $scope.resolve = {
                    "id": "resolveId",
                    "label": i18n.common_term_resolvent_label + ":",
                    "value": ""
                };

                //失败子任务信息
                $scope.subtaskFail = {
                    "id": "subtaskFailId",
                    "label": i18n.task_term_failSubTaskInfo_label + ":"
                };

                $scope.failsubTable = {
                    "id": "failsubTableId",
                    "data": [],
                    "columns": [
                        {
                            //序号
                            "sTitle": i18n.common_term_numInOrder_label,
                            "mData": "",
                            "sWidth": "60px"
                        },
                        {
                            //操作对象
                            "sTitle": i18n.common_term_operationObj_label,
                            "mData": function (data) {
                                var entityName = (data.taskEntity && data.taskEntity.entityName) || "";
                                return $.encoder.encodeForHTML("" + entityName);
                            }
                        },
                        {
                            //错误码
                            "sTitle": i18n.common_term_errorCode_label,
                            "mData": function (data) {
                                var errorCode = (data.taskProgress && data.taskProgress.errorCode) || "";
                                return $.encoder.encodeForHTML("" + errorCode);
                            }
                        },
                        {
                            //失败原因
                            "sTitle": i18n.common_term_failCause_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.cause);
                            }
                        },
                        {
                            //解决方法
                            "sTitle": i18n.common_term_resolvent_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.solution);
                            }
                        }
                    ],
                    "pagination": false,
                    "draggable": true,
                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(0)", row).html(index + 1);
                        $('td:eq(1)', row).addTitle();
                        $('td:eq(3)', row).addTitle();
                        $('td:eq(4)', row).addTitle();
                    }
                };

                var lang = {zh: "zh_CN", en: "en_US"};
                var locale = lang[window.urlParams.lang];
                var getException = function (errorCode) {
                    try {
                        var exception = IrmRpoolException[errorCode] || AmeRpoolException[errorCode] || SrRpoolException[errorCode] || SspRpoolException[errorCode] || IamException[errorCode] || SspException[errorCode] || SystemException[errorCode];
                        return exception;
                    } catch (e) {
                        return null;
                    }
                };

                var parseTask = function (task) {
                    var errorCode = task.taskProgress.errorCode;
                    if (errorCode) {
                        var exception = getException(errorCode);
                        task.cause = exception.cause || "";
                        task.solution = exception.solution || "";
                    } else {
                        var cause = task.taskProgress.failReason || "";
                        var solution = task.taskProgress.failResolve || "";
                        try {
                            cause = JSON.parse(cause);
                            task.cause = cause[locale];
                        } catch (e) {
                            task.cause = cause;
                        }
                        try {
                            solution = JSON.parse(solution);
                            task.solution = solution[locale];
                        } catch (e) {
                            task.solution = solution;
                        }
                    }
                    return task;
                };

                var loadData = function () {
                    var defered = camel.get({
                        "url": {s: "/goku/rest/v1.5/1/tasks?taskid={taskid}&withsubtask={withsubtask}", o: {"taskid": taskId, "withsubtask": 'true'}},
                        "userId": user.id
                    });
                    defered.done(function (response) {
                        $scope.$apply(function () {
                                var data = [];
                                var subTaskList = response.specificTask.subTaskList;
                                for (var index in  subTaskList) {
                                    var item = subTaskList[index];
                                    if ("FAILED" == item.taskProgress.status) {
                                        data.push(parseTask(item));
                                    }
                                }
                                $scope.failsubTable.data = data;

                                var task = parseTask(response.specificTask.task);
                                $scope.failReason.value = task.cause || "";
                                $scope.resolve.value = task.solution || "";
                            }
                        )
                    });
                    defered.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
                loadData();
            }
            ]
            ;

        var dependency = ['ng', 'wcc'];
        var failReasonModule = angular.module("failReasonModule", dependency);
        failReasonModule.controller("failReasonCtrl", failReasonCtrl);
        failReasonModule.service("camel", http);
        return failReasonModule;

    }
)
;