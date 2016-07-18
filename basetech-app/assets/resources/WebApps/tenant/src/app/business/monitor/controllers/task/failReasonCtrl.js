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
    "app/services/exceptionService"],
    function ($, angular, http, Window, RadioGroup, MessageService, AmeRpoolException, IamException, IrmRpoolException, SrRpoolException, SspException, SspRpoolException, ExceptionService) {
        "use strict";
        var failReasonCtrl = ["$scope", "camel", function ($scope, camel) {
            var i18n = $("html").scope().i18n;
            $scope.causeSelect = function(lang){
                var cause = "zh_CN" === lang?"有一个或多个子任务失败。":"One or multiple subtasks failed.";
                return cause;
            }
            $scope.solutionSelect = function(lang){
                var solution = "zh_CN" === lang?"请参考子任务的处理建议。":"Please refer to suggestions for handling subtasks.";
                return solution;
            }
            //失败原因
            $scope.failReason = {
                "id": "failReasonId",
                "label": i18n.common_term_failCause_label + ":",
                "value": ""
            };
            var $rootScope = $("html").scope();
            var user = $rootScope.user;
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
                            var entityName = data.entityIds || data.entityNames[0] || "";
                            return $.encoder.encodeForHTML("" + entityName);
                        }
                    },
                    {
                        //错误码
                        "sTitle": i18n.common_term_errorCode_label,
                        "mData": function (data) {
                            var errorCode = data.errorCode || "";
                            return $.encoder.encodeForHTML("" + errorCode);
                        }
                    },
                    {
                        //失败原因
                        "sTitle": i18n.common_term_failCause_label,
                        "mData": function (data) {
                            var reason = parseTask(data.errorCode || "");
                            return $.encoder.encodeForHTML(reason.cause || data.failReason);
                        }
                    },
                    {
                        //解决方法
                        "sTitle": i18n.common_term_resolvent_label,
                        "mData": function (data) {
                            var reason = parseTask(data.errorCode || "");
                            return $.encoder.encodeForHTML(reason.solution);
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

            //解决办法
            $scope.resolve = {
                "id": "resolveId",
                "label": i18n.common_term_resolvent_label + ":",
                "value": ""
            };
            var getException = function (errorCode) {
                try {
                    var exception = IrmRpoolException[errorCode] || AmeRpoolException[errorCode] || SrRpoolException[errorCode] || SspRpoolException[errorCode] || IamException[errorCode] || SspException[errorCode] || SystemException[errorCode];
                    return exception;
                } catch (e) {
                    return null;
                }
            };

            var parseTask = function (errorCode) {
                var win = $("#failTaskWindowId").widget();
                var failReason = win.option("failReason");
                var failResolve = win.option("failResolve");
                var task = {
                    "cause": failReason,
                    "solution": failResolve
                };
                if (errorCode) {
                    var exception = getException(errorCode);
                    if (exception) {
                        task.cause = exception.cause;
                        task.solution = exception.solution;
                    }
                }
                return task;
            };

            //填写数据
            var loadData = function () {
                var chooseDom =  $("#failTaskWindowId").widget();
                var errorCode = chooseDom.option("errorCode");
                var fReason = chooseDom.option("failReason");
                var taskId =  chooseDom.option("taskId");
                $scope.failReason.value = parseTask(errorCode).cause;
                $scope.resolve.value = parseTask(errorCode).solution;

                var defered = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/{vdc_id}/jobs?id={taskid}&with-sub=true",
                        o: {"vdc_id": user.vdcId, "taskid": taskId}
                    },
                    "userId": user.id
                });
                defered.done(function (response) {
                    $scope.$apply(function () {
                            var data = [];
                            var subTaskList = response.specificTask.subTaskList;
                            for (var index in  subTaskList) {
                                var item = subTaskList[index];
                                if ("FAILED" == item.status) {
                                    data.push(item);
                                }
                            }
                            $scope.failsubTable.data = data;
                            var language = window.urlParams.lang === "zh" ? "zh_CN" : "en_US";
                            var task = parseTask(errorCode);
                            if(task.cause || task.solution){
                                $scope.failReason.value = task.cause;
                                $scope.resolve.value = task.solution;
                            }else{
                                if(data && data.length){
                                    $scope.failReason.value = $scope.causeSelect(language);
                                    $scope.resolve.value = $scope.solutionSelect(language);
                                }
                            }
                        }
                    )
                });
                defered.fail(function (response) {
                    new ExceptionService().doException(response);
                });
            };
            loadData();
        }];
        var dependency = ['ng', 'wcc'];
        var failReasonModule = angular.module("failReasonModule", dependency);
        failReasonModule.controller("failReasonCtrl", failReasonCtrl);
        failReasonModule.service("camel", http);
        return failReasonModule;
    }
);