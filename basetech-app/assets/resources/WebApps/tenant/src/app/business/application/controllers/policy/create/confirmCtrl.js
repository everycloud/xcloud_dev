define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-widgets/DateTime",
    "tiny-lib/underscore"
], function ($, $encoder, angular, DateTime, _) {
    "use strict";
    var ctrl = ["$scope", function ($scope) {
            var encoder = $.encoder;
            var i18n = $scope.i18n;
            $scope.info = {
                bindSelTable: {
                    "id": "create-plan-bindSelTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [{
                        "sTitle":i18n.app_term_policyName_label,
                        "sWidth": "30%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.policyName);
                        }
                    }, {
                        "sTitle": i18n.app_term_flexGroup_label,
                        "sWidth": "30%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.groupName);
                        }
                    }, {
                        "sTitle": i18n.app_term_app_label,
                        "sWidth": "30%",
                        "bSortable": false,
                        "mData": function (data) {
                            return encoder.encodeForHTML(data.appName);
                        }
                    }]
                },
                name: {
                    label: i18n.common_term_name_label+":",
                    require: true
                },
                type: {
                    label: i18n.app_term_triggerType_label+":",
                    require: true
                },
                periodWeedDays: {
                    label: i18n.common_term_week_label,
                    require: true,
                    display: false,
                    values: []
                },
                triggerDate: {
                    label: i18n.app_term_triggerDate_label+":",
                    display: false,
                    require: true
                },
                triggerTime: {
                    label: i18n.app_term_triggerTime_label+":",
                    display: false,
                    require: true
                },
                desc: {
                    label: i18n.common_term_desc_label+":",
                    require: false
                },
                innerPolicy: {
                    label: i18n.app_term_associateIntraPolicy_button+":",
                    require: true
                },
                preBtn: {
                    "id": "create-plan-step4-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "innerPolicy";
                        $("#" + $scope.service.step.id).widget().pre();
                        $scope.$emit("triggerPolicyPageLoadEvent");
                    }
                },
                okBtn: {
                    "id": "create-plan-step4-ok",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var promise = null;
                        var options = {
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "data": {
                                "scheduleTask": $scope.data
                            }
                        };
                        if ($scope.params.action === "create") {
                            promise = $scope.serviceIns.createScheduleTask(options);

                        } else {
                            options.id = $scope.params.id;
                            promise = $scope.serviceIns.modifyScheduleTask(options);
                        }
                        promise.then(function (data) {
                            $scope.close();
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-plan-step4-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.$on("initLoadConfirmEvent", function () {
                var triggerType = $scope.data.triggerType;
                var periodType = $scope.data.periodType;
                if (triggerType === "ONCE") {
                    $scope.info.periodWeedDays.display = false;
                    $scope.info.triggerDate.display = true;
                    $scope.info.triggerTime.display = false;
                    $scope.triggerTypeUI = i18n.app_term_timerTrigger_label;
                }
                if (triggerType === "PERIOD" && periodType === "EVERYDAY") {
                    $scope.triggerTypeUI = i18n.app_term_cycleTrigger_label+"("+i18n.app_term_byDay_label+")";
                    $scope.info.periodWeedDays.display = false;
                    $scope.info.triggerDate.display = false;
                    $scope.info.triggerTime.display = true;
                }
                if (triggerType === "PERIOD" && periodType === "WEEKDAY") {
                    $scope.triggerTypeUI =  i18n.app_term_cycleTrigger_label+"("+i18n.app_term_byWeek_label+")";
                    $scope.info.periodWeedDays.display = true;
                    $scope.info.triggerDate.display = false;
                    $scope.info.triggerTime.display = false;

                    var weekDays = [];
                    _.each($scope.data.dateAndTimeList, function (item) {
                        var text = null;
                        switch (item.date) {
                        case "MON":
                            text = i18n.common_term_Monday_label;
                            break;
                        case "TUE":
                            text = i18n.common_term_Tuesday_label;
                            break;
                        case "WEN":
                            text = i18n.common_term_Wednesday_label;
                            break;
                        case "THU":
                            text = i18n.common_term_Thursday_label;
                            break;
                        case "FRI":
                            text = i18n.common_term_Friday_label;
                            break;
                        case "SAT":
                            text = i18n.common_term_Saturday_label;
                            break;
                        case "SUN":
                            text = i18n.common_term_Sunday_label;
                            break;
                        default:
                            break;
                        }
                        weekDays.push({
                            "key": item.date,
                            "text": text,
                            "time": item.time
                        });
                    });
                    $scope.info.periodWeedDays.values = weekDays;
                }
            });
        }
    ];
    return ctrl;
});
