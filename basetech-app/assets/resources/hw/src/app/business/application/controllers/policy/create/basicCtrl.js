define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/DateTime",
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    "app/business/application/services/timeService",
    "app/services/messageService",
    'tiny-widgets/Message',
    'app/services/commonService'], function ($, angular, _, DateTime, validatorService, UnifyValid,TimeService, MessageService, Message, commonService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$stateParams", "$q",
        function ($scope, camel, $stateParams, $q) {
            var validator = new validatorService();
            var messageService = new MessageService();

            var i18n = $scope.i18n;
            $scope.$watch("data.triggerType", function (newV, oldV) {
                if (newV === "ONCE") {
                    $scope.displayONCEType();
                }
                if (newV === "PERIOD") {
                    if ($("#create-plan-periodType").length <= 0) {
                        return;
                    }
                    var periodType = $("#create-plan-periodType").widget().opChecked("checked");
                    if (periodType === "WEEKDAY") {
                        $scope.displayWeekDayType();
                    } else {
                        $scope.displayEveryDayType();
                    }
                }
            });

            $scope.$watch("data.periodType", function (newV, oldV) {
                if ($scope.data.triggerType !== "PERIOD") {
                    return;
                }
                if (newV === "EVERYDAY") {
                    $scope.displayEveryDayType();
                }
                if (newV === "WEEKDAY") {
                    $scope.displayWeekDayType();
                }
            });

            $scope.displayONCEType = function () {
                if ($("#create-plan-type").length <= 0) {
                    return;
                }
                $("#create-plan-type").widget().opChecked("ONCE", true);
                $scope.info.periodType.display = false;
                $scope.info.periodWeedDays.display = false;
                $scope.info.triggerDate.display = true;
                $scope.info.triggerTime.display = false;
            };

            $scope.displayEveryDayType = function () {
                if ($("#create-plan-type").length <= 0 || $("#create-plan-periodType").length <= 0) {
                    return;
                }
                $("#create-plan-type").widget().opChecked("PERIOD", true);
                $("#create-plan-periodType").widget().opChecked("EVERYDAY", true);
                $scope.info.periodType.display = true;
                $scope.info.periodWeedDays.display = false;
                $scope.info.triggerDate.display = false;
                $scope.info.triggerTime.display = true;
            };

            $scope.displayWeekDayType = function () {
                if ($("#create-plan-type").length <= 0 || $("#create-plan-periodType").length <= 0) {
                    return;
                }
                $("#create-plan-type").widget().opChecked("PERIOD", true);
                $("#create-plan-periodType").widget().opChecked("WEEKDAY", true);
                $scope.info.periodType.display = true;
                $scope.info.periodWeedDays.display = true;
                $scope.info.triggerDate.display = false;
                $scope.info.triggerTime.display = false;
            };

            $scope.showCheckDate = function(){
                var checkDataTimeMesg = new Message({
                    "type": "error",
                    "title": $scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.common_term_nullDate_valid || "日期不能为空。",
                    "height": "120px",
                    "width": "320px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            "key": "okBtn",
                            majorBtn: true,
                            default: true
                        }
                    ]
                });
                checkDataTimeMesg.setButton("okBtn", function () {
                    checkDataTimeMesg.destroy()
                });
                checkDataTimeMesg.show();

            };

            $scope.info = {
                name: {
                    "id": "create-plan-name",
                    label: i18n.common_term_name_label+":",
                    "width": "214",
                    require: true,
                    "extendFunction": ["checkPlanName"],
                    "validate": "required:" + i18n.common_term_null_valid + ";checkPlanName(true):" + i18n.common_term_composition6_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "256") + ";"

                },
                type: {
                    label: i18n.app_term_triggerType_label+":",
                    require: true,
                    id: "create-plan-type",
                    "values": [{
                        "key": "ONCE",
                        "text": i18n.app_term_timerTrigger_label,
                        "checked": true
                    }, {
                        "key": "PERIOD",
                        "text": i18n.app_term_cycleTrigger_label
                    }],
                    "change": function () {
                        var triggerType = $("#create-plan-type").widget().opChecked("checked");
                        $scope.data.triggerType = triggerType;
                    }
                },
                periodType: {
                    label: "",
                    require: false,
                    "display": false,
                    "id": "create-plan-periodType",
                    "values": [{
                        "key": "EVERYDAY",
                        "text": i18n.app_term_byDay_label,
                        "checked": true
                    }, {
                        "key": "WEEKDAY",
                        "text": i18n.app_term_byWeek_label,
                        "checked": false
                    }],
                    "change": function () {
                        var periodType = $("#create-plan-periodType").widget().opChecked("checked");
                        $scope.data.periodType = periodType;
                    }
                },
                periodWeedDays: {
                    label: i18n.common_term_week_label,
                    require: true,
                    display: false,
                    id: "create-plan-periodWeekDate",
                    width: "100px",
                    type: "time",
                    values: [],
                    "change": function (index) {
                        var checked = null;
                        var selectedNetworks = [];
                        _.each($scope.info.periodWeedDays.values, function (item) {
                            checked = $("#" + item.weekId).widget().option("checked");
                            if (checked) {
                                selectedNetworks.push({
                                    "date": item.key,
                                    "timeId": item.timeId,
                                    "time": ""
                                });
                            }
                        });
                        $scope.data.dateAndTimeList = selectedNetworks;
                    }
                },
                triggerDate: {
                    label: i18n.app_term_triggerDate_label+":",
                    display: true,
                    "id": "create-plan-periodDate",
                    "minDate": "",
                    "defaultDate": "",
                    "defaultTime": "",
                    require: true,
                    "width": "60",
                    "type": "datetime" //time ,datetime
                },
                triggerTime: {
                    label: i18n.app_term_triggerTime_label+":",
                    display: false,
                    "id": "create-plan-periodTime",
                    require: true,
                    "width": "60",
                    "type": "time" //time ,datetime
                },
                desc: {
                    label: i18n.common_term_desc_label+":",
                    require: false,
                    "id": "create-plan-desc",
                    "type": "multi",
                    "width": "214",
                    "height": "100",
                    "validate": "regularCheck(" + validator.noConstraintMaxLength + "):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                },
                nextBtn: {
                    "id": "create-plan-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {

                        var valid = UnifyValid.FormValid($("#createPlanBaseInfo"));
                        if (!valid) {
                            return;
                        }

                        var checkNowTime = $("#create-plan-periodDate").widget().getDateTime();
                        if(!checkNowTime || checkNowTime === ""){
                            $scope.showCheckDate();
                            return;
                        }

                        $scope.getBasicInfoValues();

                        $scope.service.show = "innerPolicy";
                        $("#" + $scope.service.step.id).widget().next();
                        $scope.$emit("triggerPolicyPageLoadEvent");
                    }
                },
                cancelBtn: {
                    "id": "create-plan-step1-cancel",
                    "text":i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            $scope.getBasicInfoValues = function () {
                var name = $("#create-plan-name").widget().getValue();

                var triggerType = $("#create-plan-type").widget().opChecked("checked");
                var periodType = $("#create-plan-periodType").widget().opChecked("checked");

                var triggerTime = $("#create-plan-periodTime").widget().getDateTime();
                var description = $("#create-plan-desc").widget().getValue();

                $scope.data.name = name;
                $scope.data.description = description;
                if (triggerType === "ONCE") {
                    var localDate = $("#create-plan-periodDate").widget().getDateTime();
                    $scope.triggerDate.localDate = localDate;
                    var utcDate = TimeService.getFormatDateByLong(TimeService.getTime(localDate)).split(" ");

                    $scope.data.dateAndTimeList = [{
                        "date": utcDate[0],
                        "time": utcDate[1].substr(0, 5)
                    }];
                    $scope.data.triggerType = "ONCE";
                    $scope.data.periodType = null;
                  
                }
                if (triggerType === "PERIOD" && periodType === "EVERYDAY") {
                    $scope.data.dateAndTimeList = [{
                        "date": "EVERYDAY",
                        "time": triggerTime
                    }];
                    $scope.data.triggerType = "PERIOD";
                    $scope.data.periodType = "EVERYDAY";
                }
                if (triggerType === "PERIOD" && periodType === "WEEKDAY") {
                    $scope.data.triggerType = "PERIOD";
                    $scope.data.periodType = "WEEKDAY";

                    //刷新数据 勾选后可能更改时间故需刷新数据
                    _.each($scope.data.dateAndTimeList, function (item, index) {

                        if (item.timeId && $("#" + item.timeId).widget()) {
                            item.time = $("#" + item.timeId).widget().getDateTime();
                        }
                    });
                }
            };

            //只为在修改场景首次加载时对周期的判断处理
            $scope.$watch("dateAndTimeListModifyFirst", function (newV, oldV) {
                var triggerType = $scope.data.triggerType;
                var periodType = $scope.data.periodType;
                var dateAndTimes = $scope.data.dateAndTimeList;
                var weekDays = $scope.getWeekDays();
                if (triggerType === "ONCE") {
                    if (dateAndTimes && dateAndTimes.length > 0) {
                        $scope.triggerDate = dateAndTimes[0].date + " " + dateAndTimes[0].time;
                    }
                }
                if (triggerType === "PERIOD" && periodType === "WEEKDAY") {
                    _.each(weekDays, function (item, index) {
                        var day = _.find(dateAndTimes, function (itemA, index) {
                            return item.key === itemA.date;
                        });
                        if (day) {
                            item.checked = true;
                            item.time = day.time;
                        }
                    });
                }
                if (triggerType === "PERIOD" && periodType === "EVERYDAY") {
                    if (dateAndTimes && dateAndTimes.length > 0) {
                        $scope.triggerTime = dateAndTimes[0].time;
                    }
                }
                $scope.info.periodWeedDays.values = weekDays;
            });

            $scope.getWeekDays = function () {
                return [{
                    "weekId": "week00",
                    "timeId": "time00",
                    "key": "MON",
                    "text": i18n.common_term_Monday_label
                }, {
                    "weekId": "week01",
                    "timeId": "time01",
                    "key": "TUE",
                    "text": i18n.common_term_Tuesday_label
                }, {
                    "weekId": "week02",
                    "timeId": "time02",
                    "key": "WEN",
                    "text": i18n.common_term_Wednesday_label
                }, {
                    "weekId": "week03",
                    "timeId": "time03",
                    "key": "THU",
                    "text": i18n.common_term_Thursday_label
                }, {
                    "weekId": "week04",
                    "timeId": "time04",
                    "key": "FRI",
                    "text": i18n.common_term_Friday_label
                }, {
                    "weekId": "week05",
                    "timeId": "time05",
                    "key": "SAT",
                    "text":i18n.common_term_Saturday_label
                }, {
                    "weekId": "week06",
                    "timeId": "time06",
                    "key": "SUN",
                    "text": i18n.common_term_Sunday_label
                }];
            };

            //验证计划任务名称
            UnifyValid.checkPlanName = function (param) {
                var value = $(this).val();
                var planNameReg = /^[\u4E00-\u9FA50-9a-zA-Z \.\_\-\[\]\(\)\#]{0,256}$/;
                return planNameReg.test(value);
            };

            //设置当前系统为时间控件的最小时间
            $scope.setDate = function () {
                var nowTime = getNowTime();
                $scope.info.triggerDate.minDate = nowTime;
                var triggerDate = nowTime.split(" ");
                $scope.info.triggerDate.defaultDate = triggerDate[0];
                $scope.info.triggerDate.defaultTime = triggerDate[1];
            };
            $scope.setDate();

            $scope.$on("triggerPlanModifyInitBasic", function () {
                init();
            });

            function init() {
                if ($scope.params.action === 'modify') {
                    //初始化修改时间
                    if ($scope.data.triggerType === "ONCE") {
                        var dateAndTime = null;
                        dateAndTime = $scope.data.dateAndTimeList && ($scope.data.dateAndTimeList.length > 0) && $scope.data.dateAndTimeList[0];
                        if (dateAndTime) {
                            var dateAndTimeWid = $("#" + $scope.info.triggerDate.id).widget();

                            var dateAndTimeDateTemp = dateAndTime.date.split("-");
                            for(var i=1; i<dateAndTimeDateTemp.length; i++){
                                if(dateAndTimeDateTemp[i].length == 1){
                                    dateAndTimeDateTemp[i] = "0" + dateAndTimeDateTemp[i];
                                }
                            }
                            var responseDate  =  dateAndTimeDateTemp.join("-");

                            var dateAndTimeTemp =  dateAndTime.time.split(":");
                            for(var i=0; i<dateAndTimeTemp.length; i++){
                                if(dateAndTimeTemp[i].length == 1){
                                    dateAndTimeTemp[i] = "0" + dateAndTimeTemp[i];
                                }
                            }
                            var responseTime = dateAndTimeTemp.join(":");

                            var dateAndTimeTempStr = responseDate + " " + responseTime;
                            var dateAndTimeTemp = dateAndTimeTempStr.toString();
                            var utcToLocalTime = commonService.utc2Local(dateAndTimeTemp);

                            var timeStrTemp = utcToLocalTime.split(" ");
                            var dateTemp = timeStrTemp[0];
                            var timeTemp = timeStrTemp[1].substring(0,timeStrTemp[1].length-3);

                            if (dateAndTime.date) {
                                dateAndTimeWid.option("defaultDate", dateTemp);
                            }
                            if (dateAndTime.time) {
                                dateAndTimeWid.option("defaultTime", timeTemp);
                            }
                        }
                    }
                }
            }
        }
    ];

    //获取当前时间
    function getNowTime() {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
        var date = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
        var hh = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
        var mm = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
        return year + "-" + month + "-" + date + " " + hh + ":" + mm;
    }

    return ctrl;
});
