/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-directives/Button",
    "tiny-directives/Table",
    'app/business/application/services/appCommonService',
    'app/business/application/services/appCommonData',
    "tiny-lib/underscore",
    "app/business/application/controllers/constants",
    'app/services/commonService',
    "fixtures/policyConfigFixture"
], function ($, encoder, angular, Button, Table, appCommonService, appCommonData, _, constants, commonService) {
    "use strict";

    var planSettingCtrl = ["$scope", "$compile", "$state", "$q", "camel", "exception", "message",
        function ($scope, $compile, $state, $q, camel, exception, message) {
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var appCommonDataIns = new appCommonData();
            var user = $scope.user;
            var i18n = $scope.i18n;

            $scope.hasOperatePlanRight = _.contains(user.privilegeList, constants.privileges.OPERATE_APP_PLAN);
            $scope.createBtn = {
                "id": "createBtn",
                "text": i18n.common_term_create_button,
                "click": function () {
                    $state.go("application.createPlan.navigate", {
                        "action": "create",
                        "cloudInfraId": $scope.currentCloudInfraId,
                        "id": ""
                    });
                }
            };

            //刷新
            $scope.refresh = {
                "id": "planRefresh",
                "click": function () {
                    $scope.queryScheduleTasks($scope.currentCloudInfraId);
                }
            };

            //帮助
            $scope.columnConfig = {
                "id": "planColumnConfig",
                "click": function () {}
            };

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.planListTable = {
                "id": "plan-list-table",
                "paginationStyle": "full_numbers",
                "enablePagination": true,
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "showDetails": true,
                "draggable": true,
                "columns": [{
                    "sTitle": "",
                    "mData": "showDetail",
                    "bSortable": false,
                    "sWidth": "5%"
                }, {
                    "sTitle": i18n.common_term_taskName_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": i18n.common_term_ID_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    }
                }, {
                    "sTitle": i18n.app_term_triggerType_label,
                    "sWidth": "10%",
                    "bSortable": true,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.triggerTypeUI);
                    }
                }, {
                    "sTitle":i18n.app_term_triggerDate_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.dateUI);
                    }
                }, {
                    "sTitle":i18n.app_term_triggerTime_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.timeUI);
                    }
                }, {
                    "sTitle":i18n.common_term_status_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.taskStatusUI);
                    }
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.opts);
                    }
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryScheduleTasks($scope.currentCloudInfraId);
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryScheduleTasks($scope.currentCloudInfraId);
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    if (!$scope.hasOperatePlanRight) {
                        return;
                    }
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                        $scope.currentItem.cloudInfraId = $scope.currentCloudInfraId;
                    });

                    var optColumn = "";
                    if (aData.taskStatus === "ENABLED") {
                        optColumn = "<a href='javascript:void(0)' ng-click='opt(0)'>"+i18n.common_term_stop_button+"</a> ";
                    } else {
                        optColumn = "<a href='javascript:void(0)' ng-click='deleter()'>"+i18n.common_term_clear_button+"</a> " +
                            " <a href='javascript:void(0)' ng-click='modify()'>"+i18n.common_term_modify_button+"</a>" +
                            " <a href='javascript:void(0)' ng-click='opt(1)'>"+i18n.common_term_startup_button+"</a>";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.data = aData;
                    optScope.deleter = function () {
                        message.warnMsgBox({
                            "content": i18n.app_policy_delTask_info_confirm_msg,
                            "callback": function () {
                                var options = {
                                    "userId": user.id,
                                    "vdcId": user.vdcId,
                                    "id": aData.id,
                                    "cloudInfraId": $scope.currentCloudInfraId
                                };
                                var promise = appCommonServiceIns.deleteScheduleTask(options);
                                promise.then(function (data) {
                                        $scope.queryScheduleTasks($scope.currentCloudInfraId);
                                    },
                                    function () {
                                        $scope.queryScheduleTasks($scope.currentCloudInfraId);
                                    });
                            }
                        });
                    };
                    optScope.modify = function () {
                        $state.go("application.createPlan.navigate", {
                            "action": "modify",
                            "cloudInfraId": $scope.currentCloudInfraId,
                            "id": aData.id
                        });
                    };

                    optScope.opt = function (flag) {
                        var action = null;
                        var content = null;
                        if (flag === 0) {
                            action = "Stop";
                            content = i18n.app_policy_stopTask_info_confirm_msg;
                        } else {
                            action = "Start";
                            content = i18n.app_policy_startupTask_info_confirm_msg;
                        }
                        message.warnMsgBox({
                            "content": content,
                            "callback": function () {
                                var options = {
                                    "userId": user.id,
                                    "vdcId": user.vdcId,
                                    "id": aData.id,
                                    "action": action,
                                    "cloudInfraId": $scope.currentCloudInfraId
                                };
                                var promise = appCommonServiceIns.operatorScheduleTask(options);
                                promise.then(function (data) {
                                        $scope.queryScheduleTasks($scope.currentCloudInfraId);
                                    },
                                    function () {
                                        $scope.queryScheduleTasks($scope.currentCloudInfraId);
                                    });
                            }
                        });
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(7)", nRow).html(optNode);
                }
            };

            // 查询计划任务列表信息
            $scope.queryScheduleTasks = function (cloudInfraId) {
                if (!cloudInfraId) {
                    return;
                }
                var promise = appCommonServiceIns.queryScheduleTasks({
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "cloudInfraId": cloudInfraId,
                    "triggletype": "",
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "order": "DESC",
                    "sort": "triggertype"
                });
                promise.then(function (data) {
                    if (!data || !data.taskList) {
                        return;
                    }
                    var plans = data.taskList;
                    _.each(plans, function (item, index) {
                        _.extend(item, {
                            "detail": {
                                contentType: "url", // simple & url
                                content: "app/business/application/views/policy/planDetail.html"
                            }
                        });
                        item.triggerTypeUI = appCommonDataIns.getScheduleTaskTriggerType(item.triggerType);
                        var dateTemp = "";
                        var timeTemp = "";
                        if(item.triggerType !== "ONCE"){
                            if(item.dateAndTimeList.length > 1){
                                _.each(item.dateAndTimeList,function(dateItem, idx){
                                    dateTemp += appCommonDataIns.getScheduleTaskTriggerDate(dateItem.date) + ",";
                                    timeTemp += dateItem.time + ",";
                                });
                            }else{
                                dateTemp = appCommonDataIns.getScheduleTaskTriggerDate(item.dateAndTimeList[0].date) + ",";
                                timeTemp = item.dateAndTimeList[0].time + ",";
                            }
                            dateTemp = dateTemp.substring(0, dateTemp.length - 1);
                            timeTemp = timeTemp.substring(0, timeTemp.length - 1);
                        }else{
                            dateTemp = appCommonDataIns.getScheduleTaskTriggerDate(item.dateAndTimeList[0].date);
                            var tempStr = item.dateAndTimeList[0].date + " " + item.dateAndTimeList[0].time;
                            var timeStrTemp = commonService.utc2Local(tempStr);
                            timeStrTemp = timeStrTemp.split(" ");
                            dateTemp = timeStrTemp[0];
                            timeTemp = timeStrTemp[1].substring(0,timeStrTemp[1].length-3);
                        }
                        item.dateUI = dateTemp;
                        item.timeUI = timeTemp;
                        item.taskStatusUI = appCommonDataIns.getScheduleTaskStatus(item.taskStatus);
                    });
                    $(".plan-detail").scope.exception = exception;
                    $(".plan-detail").scope.camel = camel;
                    $scope.planListTable.totalRecords = data.total;
                    $scope.planListTable.displayLength = page.displayLength;
                    $scope.planListTable.data = plans;
                });
            };

            $scope.$on("changeCloudInfraEvent", function (evt, cloudInfraId) {
                $scope.queryScheduleTasks(cloudInfraId);
            });

            $scope.$on("$viewContentLoaded", function () {
                $scope.queryScheduleTasks($scope.currentCloudInfraId);
            });
        }
    ];

    return planSettingCtrl;
});
