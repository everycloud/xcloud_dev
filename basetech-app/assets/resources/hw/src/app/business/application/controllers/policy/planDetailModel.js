/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'app/business/application/services/appCommonService',
    'app/business/application/services/appCommonData',
    'app/services/commonService'
], function ($, angular, _, appCommonService, appCommonData, commonService) {
    "use strict";

    var planDetailCtrl = ["$scope", "$q", "$compile",
        function ($scope, $q, $compile) {
            var exception = $(".plan-detail").scope.exception;
            var camel = $(".plan-detail").scope.camel;
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var appCommonDataIns = new appCommonData();
            $scope.serviceIns = new appCommonService(exception, $q, camel);
            $scope.planDetail = {};
            $scope.info = {
                name: {
                    "id": "detail-plan-name",
                    label: i18n.common_term_name_label + ":",
                    require: false
                },
                desc: {
                    "id": "detail-plan-desc",
                    label: i18n.common_term_desc_label + ":",
                    require: false
                },
                triggerType: {
                    label: i18n.app_term_triggerType_label + ":",
                    require: false,
                    "id": "detail-plan-triggerType"
                },
                triggerDate: {
                    label: i18n.app_term_triggerDate_label + ":",
                    require: false,
                    display: false,
                    "id": "detail-plan-triggerDate"
                },
                week: {
                    label: i18n.common_term_week_label + ":",
                    require: false,
                    display: false,
                    "id": "detail-plan-week"
                },
                policy: {
                    label: i18n.app_term_associateIntraPolicy_button + ":",
                    require: false,
                    "id": "detail-plan-innerPolicy"
                },
                bindTable: {
                    "id": "create-plan-bindTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.app_term_policyName_label,
                            "sWidth": "15%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.policyName);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_flexGroup_label,
                            "sWidth": "15%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.groupName);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_app_label,
                            "sWidth": "15%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.appName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_actionType_label,
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "callback": function (evtObj) {
                        var displayLength = $("#create-plan-bindTable").widget().option("display-length");
                    },
                    "changeSelect": function (evtObj) {
                        var displayLength = $("#create-plan-bindTable").widget().option("display-length");
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        if (aData.policyOperation === "START") {
                            $("td:eq(3)", nRow).text(i18n.common_term_enable_button);
                        } else {
                            $("td:eq(3)", nRow).text(i18n.common_term_shut_button);
                        }

                    }
                }
            };

            //查询脚本详情
            $scope.queryDetail = function (id, cloudInfraId) {
                var promise = $scope.serviceIns.queryScheduleTask({
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "cloudInfraId": cloudInfraId,
                    "id": id
                });
                promise.then(function (data) {
                    if (!data || !data.scheduleTask) {
                        return;
                    }
                    $scope.planDetail = data.scheduleTask;
                    $scope.info.bindTable.data = $scope.planDetail.policies;
                    if ("PERIOD" === $scope.planDetail.triggerType) {
                        if ("EVERYDAY" === $scope.planDetail.periodType) {
                            $scope.triggerType = i18n.app_term_cycleTrigger_label + "(" + i18n.app_term_byDay_label + ")";
                            var dateAndTimeItem = $scope.planDetail.dateAndTimeList[0];
                            if(dateAndTimeItem) {
                                $scope.triggerDate = appCommonDataIns.getScheduleTaskTriggerDate(dateAndTimeItem.date) + " " + dateAndTimeItem.time;
                            }
                            $scope.info.triggerDate.display = true;
                            $scope.info.week.display = false;
                        } else {
                            $scope.triggerType = i18n.app_term_cycleTrigger_label + "(" + i18n.app_term_byWeek_label + ")";
                            $scope.week = $scope.planDetail.dateAndTimeList;
                            $scope.weeks = [];
                            _.each($scope.week, function (item, index) {
                                $scope.weeks.push({
                                    "date": appCommonDataIns.getScheduleTaskTriggerDate(item.date),
                                    "time": item.time
                                });
                            });
                            $scope.info.triggerDate.display = false;
                            $scope.info.week.display = true;
                        }

                    } else {
                        $scope.triggerType = i18n.app_term_timerTrigger_label;
                        var strTemp = commonService.utc2Local( $scope.planDetail.dateAndTimeList[0].date + " " + $scope.planDetail.dateAndTimeList[0].time);
                        $scope.triggerDate = strTemp.substring(0,strTemp.length-3);
                        $scope.info.triggerDate.display = true;
                        $scope.info.week.display = false;
                    }

                });
            };
        }
    ];
    var planDetailModel = angular.module("application.plan.detail", ["ng", "wcc"]);
    planDetailModel.controller("application.plan.detail.ctrl", planDetailCtrl);
    return planDetailModel;
});
