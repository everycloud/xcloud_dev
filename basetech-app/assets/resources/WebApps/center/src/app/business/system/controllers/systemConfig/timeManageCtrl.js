define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/RadioGroup",
    "tiny-widgets/Message",
    "tiny-directives/DateTime",
    "app/services/exceptionService",
    'app/services/commonService',
    "language/system-exception",
    "tiny-common/UnifyValid",
    "fixtures/systemFixture"],

    function ($, angular, Window, RadioGroup, Message, DateTime, Exception, timeService, systemException, UnifyValid, systemFixture) {

        "use strict";
        var timeManageCtrl = ["$scope", "$compile", "$state", "camel", "$interval", "$rootScope", function ($scope, $compile, $state, camel, $interval, $rootScope) {
            var exceptionService = new Exception();
            $scope.hasTimeManageOperateRight = $rootScope.user.privilege.role_role_add_option_timeHandle_value;
            UnifyValid.checkOffset = function () {
                var value = $(this).val();
                if (value > 120 || value < 1) {
                    return false;
                }
                return true;
            };
            $scope.forceTimeStatus = {
                "id": "forceTimeStatusId",
                "label": $scope.i18n.common_term_forciblySyncStatus_label + ":" || "强制同步状态:"
            };
            $scope.forceTimeFail = {
                "id": "forceTimeFailId",
                "label": $scope.i18n.common_term_forciblySyncFailCause_label + ":" || "强制同步失败原因:"
            };

            $scope.systemTimeName = {
                "id": "systemTimeId",
                "label": $scope.i18n.common_term_sysTime_label + ":" || "系统时间:"
            };

            $scope.timeSychName = {
                "id": "timeSystStateId",
                "label": $scope.i18n.sys_term_timeSyncStatus_label + ":" || "时间同步状态:"
            };

            $scope.timeServerOne = {
                "id": "timeServerOneId",
                "label": $scope.i18n.sys_term_timeServer1IP_label + ":" || "时间服务器1（IP地址）:",
                "type": "ipv4"
            };

            $scope.timeServerTwo = {
                "id": "timeServerTwoId",
                "label": $scope.i18n.sys_term_timeServer2IP_label + ":" || "时间服务器2（IP地址）:",
                "width": "214",
                "type": "ipv4"
            };

            $scope.timeServerThree = {
                "id": "timeServerThreeId",
                "label": $scope.i18n.sys_term_timeServer3IP_label + ":" || "时间服务器3（IP地址）:",
                "type": "ipv4"
            };

            $scope.currentTimezone = {
                "id": "currentTimezoneId",
                "label": $scope.i18n.sys_time_currentTimeZone_label + ":" || "当前时区:",
                "width": "380"
            };

            var timeSysIntervalSelect = function () {
                var timeSysInterval = [
                    {
                        "selectId": 64,
                        "label": "64",
                        "checked": true
                    },
                    {
                        "selectId": 128,
                        "label": "128"
                    },
                    {
                        "selectId": 256,
                        "label": "256"
                    },
                    {
                        "selectId": 512,
                        "label": "512"
                    },
                    {
                        "selectId": 1024,
                        "label": "1024"
                    }
                ]
                return timeSysInterval
            };

            $scope.timeSysInterval = {
                "id": "timeSysIntervalId",
                "label": $scope.i18n.sys_term_timeSyncDistanceS_label + ":" || "时间同步间隔（秒）:",
                "values": timeSysIntervalSelect()
            };

            var monthValue = function () {
                var startMonthSelect = [
                    {"selectId": "1", "label": $scope.i18n.common_term_january_label || "1月", "checked": true},
                    {"selectId": "2", "label": $scope.i18n.common_term_february_label || "2月"},
                    {"selectId": "3", "label": $scope.i18n.common_term_march_label || "3月"},
                    {"selectId": "4", "label": $scope.i18n.common_term_april_label || "4月"},
                    {"selectId": "5", "label": $scope.i18n.common_term_may_label || "5月"},
                    {"selectId": "6", "label": $scope.i18n.common_term_june_label || "6月"},
                    {"selectId": "7", "label": $scope.i18n.common_term_july_label || "7月"},
                    {"selectId": "8", "label": $scope.i18n.common_term_august_label || "8月"},
                    {"selectId": "9", "label": $scope.i18n.common_term_september_label || "9月"},
                    {"selectId": "10", "label": $scope.i18n.common_term_october_label || "10月"},
                    {"selectId": "11", "label": $scope.i18n.common_term_november_label || "11月"},
                    {"selectId": "12", "label": $scope.i18n.common_term_december_label || "12月"}
                ]
                return startMonthSelect;
            };

            $scope.startMonth = {
                "id": "startMonthId",
                "values": monthValue(),
                'disable': true,
                "height": 100
            };

            $scope.endMonth = {
                "id": "endMonthId",
                "values": monthValue(),
                'disable': true,
                "height": 100
            };

            var dayValue = function () {
                var startDaySelect = [];
                for (var i = 1; i < 32; i++) {
                    var s = {
                        "selectId": i, "label": i
                    };
                    if (i == 1) {
                        s.checked = true;
                    }
                    startDaySelect.push(s);
                }
                return startDaySelect;
            };
            $scope.startDay = {
                "id": "startDayId",
                "values": dayValue(),
                'disable': true,
                "height": 100
            };
            $scope.endDay = {
                "id": "endDayId",
                "values": dayValue(),
                'disable': true,
                "height": 100
            };

            var startSequenceWeekValue = function () {
                var startSequenceWeekSelect =
                    [
                        {
                            "selectId": "1",
                            "label": $scope.i18n.common_term_first_label || "第一个",
                            "checked": true
                        },
                        {
                            "selectId": "2",
                            "label": $scope.i18n.common_term_second_label || "第二个"
                        },
                        {
                            "selectId": "3",
                            "label": $scope.i18n.common_term_third_label || "第三个"
                        },
                        {
                            "selectId": "4",
                            "label": $scope.i18n.common_term_fourth_label || "第四个"
                        },
                        {
                            "selectId": "5",
                            "label": $scope.i18n.common_term_lastOne_label || "最后一个"
                        }
                    ]

                return startSequenceWeekSelect;
            };

            $scope.startSequenceWeek = {
                "id": "startSequenceWeekId",
                "values": startSequenceWeekValue(),
                "disable": true
            };
            $scope.endSequenceWeek = {
                "id": "endtSequenceWeekId",
                "values": startSequenceWeekValue(),
                'disable': false
            };

            var startWeekValue = function () {
                var startWeekSelect = [
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_Monday_label || "星期一"

                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.common_term_Tuesday_label || "星期二"
                    },
                    {
                        "selectId": "3",
                        "label": $scope.i18n.common_term_Wednesday_label || "星期三"
                    },
                    {
                        "selectId": "4",
                        "label": $scope.i18n.common_term_Thursday_label || "星期四"
                    },
                    {
                        "selectId": "5",
                        "label": $scope.i18n.common_term_Friday_label || "星期五"
                    },
                    {
                        "selectId": "6",
                        "label": $scope.i18n.common_term_Saturday_label || "星期六"
                    },
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_Sunday_label || "星期天",
                        "checked": true
                    }
                ]
                return startWeekSelect;
            };
            $scope.startWeek = {
                "id": "startWeekId",
                "values": startWeekValue(),
                'disable': false,
                "height": 100
            };

            $scope.startTimerPre = {
                "id": "startTimerPreId",
                "type": "time",
                "disable": true
            };

            $scope.endTimerPre = {
                "id": "endTimerPreId",
                "type": "time",
                "disable": true
            };

            $scope.endWeek = {
                "id": "startWeekId",
                "values": startWeekValue(),
                'disable': false,
                "height": 100
            };

            var saveMessage = {
                "type": "confirm",
                "title": $scope.i18n.common_term_save_label || "保存",
                "content": $scope.i18n.sys_time_set_info_errorConfig_msg || "错误的设置可能造成系统时间异常，对业务产生影响，是否继续？",
                "height": "200px",
                "width": "360px",
                "buttons": [
                    {
                        "key": "okBtn",
                        majorBtn: true,
                        "label": $scope.i18n.common_term_ok_button || "确定",
                        "default": true
                    },
                    {
                        "key": "cancelBtn",
                        "label": $scope.i18n.common_term_cancle_button || "取消"
                    }
                ]
            };
            $scope.saveBtn = {
                "id": "saveBtnId",
                "text": $scope.i18n.common_term_save_label || "保存",
                "save": function () {
                    var newMessage = new Message(saveMessage);
                    newMessage.setButton("okBtn", function () {
                        newMessage.destroy();
                        $scope.operator.saveNTP();
                    });
                    newMessage.setButton("cancelBtn", function () {
                        newMessage.destroy();
                    })
                    newMessage.show();
                }
            };

            var forceTimeMessage = {
                "type": "confirm",
                "title": $scope.i18n.sys_term_forciblySyncTime_button || "强制时间同步",
                "content": $scope.i18n.sys_time_forciblySyncTime_info_confirm_msg || "强制同步操作期间会重启服务进程，可能导致进程异常，该操作会进行10-20分钟，是否继续？",
                "height": "200px",
                "width": "360px",
                "buttons": [
                    {
                        "key": "okBtn",
                        majorBtn: true,
                        "label": $scope.i18n.common_term_ok_button || "确定",
                        "default": true
                    },
                    {
                        "key": "cancelBtn",
                        "label": $scope.i18n.common_term_cancle_button || "取消"
                    }
                ]
            };

            $scope.forceTimeSysBtn = {
                "id": "forceTimeBtnId",
                "text": $scope.i18n.sys_term_forciblySyncTime_button || "强制时间同步",
                "force": function () {
                    var newMessage = new Message(forceTimeMessage);
                    newMessage.setButton("okBtn", function () {
                        newMessage.destroy();
                        $scope.operator.forceSyncTime();
                    });
                    newMessage.setButton("cancelBtn", function () {
                        newMessage.destroy();
                    })
                    newMessage.show();
                }
            };

            var timeZoneMessage = {
                "type": "confirm",
                "title": $scope.i18n.common_term_save_label || "保存",
                "content": $scope.i18n.sys_time_modifyTimeZone_info_confirm_msg || "系统运行阶段建议不要对时区任意修改，修改时区设置后会重启系统服务，请在5-10分钟后重新登录系统。错误的设置可能造成系统时间异常，对业务产生影响，是否继续？",
                "height": "200px",
                "width": "360px",
                "buttons": [
                    {
                        "key": "okBtn",
                        majorBtn: true,
                        "label": $scope.i18n.common_term_ok_button || "确定",
                        "default": true
                    },
                    {
                        "key": "cancelBtn",
                        "label": $scope.i18n.common_term_cancle_button || "取消"
                    }
                ]
            };

            $scope.timeZoneBtn = {
                "id": "timeZoneBtnId",
                "text": $scope.i18n.common_term_save_label || "保存",
                "save": function () {
                    var newMessage = new Message(timeZoneMessage);
                    newMessage.setButton("okBtn", function () {
                        newMessage.destroy();
                        $scope.operator.saveTimeZone();
                    });
                    newMessage.setButton("cancelBtn", function () {
                        newMessage.destroy();
                    })
                    newMessage.show();
                }
            };

            $scope.district = {
                "id": "districtId",
                "label": $scope.i18n.common_term_area_label + ":" || "地区:",
                "width": "380",
                "height": 100,
                "changeDistrict": function () {
                    $("#" + $scope.city.id).widget().opChecked("");
                    var currReg = $("#" + $scope.district.id).widget().getSelectedId();
                    var currZone = $scope.CURRENT_TIME_ZONE.currentTZ;
                    for (var index in $scope.REGION) {
                        if (currReg == $scope.REGION[index].region) {
                            var citys = [];
                            var regCitys = $scope.REGION[index].cities;
                            for (var inx in regCitys) {
                                var cc = regCitys[inx];
                                var city = {
                                    "selectId": cc,
                                    "label": cc
                                }
                                citys.push(city);
                            }
                            $scope.city.values = citys;
                            break;
                        }
                    }
                }
            };

            $scope.supportClock = {
                "id": "supportClockId",
                "text": $scope.i18n.sys_time_timeZone_para_summer_label || "支持夏令时时钟",
                "checked": false,
                "isDisable": function () {
                    if ($scope.supportClock.checked == false) {
                        $scope.supportClock.checked = true;
                        $scope.startTime.disable = false;
                        $scope.endTime.disable = false;
                        $scope.endMonth.disable = false;
                        $scope.endDay.disable = false;
                        $scope.startMonth.disable = false;
                        $scope.startDay.disable = false;
                        $scope.startWeek.disable = false;
                        $scope.endWeek.disable = false;
                        $scope.startTimerPre.disable = false;
                        $scope.endTimerPre.disable = false;
                        $scope.adjustOffset.disable = false;
                        $scope.startTimer = false;
                        $scope.startSequenceWeek.disable = false;
                        $scope.endSequenceWeek.disable = false;
                    } else if ($scope.supportClock.checked == true) {
                        $scope.startTime.disable = true;
                        $scope.startDay.disable = true;
                        $scope.startMonth.disable = true;
                        $scope.endTime.disable = true;
                        $scope.endMonth.disable = true;
                        $scope.endDay.disable = true;
                        $scope.startWeek.disable = true;
                        $scope.endWeek.disable = true;
                        $scope.adjustOffset.disable = true;
                        $scope.startTimer = true;
                        $scope.startTimerPre.disable = true;
                        $scope.endTimerPre.disable = true;
                        $scope.startSequenceWeek.disable = true;
                        $scope.endSequenceWeek.disable = true;
                        $scope.supportClock.checked = false;
                    }
                    $("#" + $scope.startTimerPre.id).widget().option("defaultTime", "00:00");
                    $("#" + $scope.endTimerPre.id).widget().option("defaultTime", "00:00");
                }
            };

            $scope.city = {
                "id": "cityId",
                "label": $scope.i18n.common_term_city_label + ":" || "城市:",
                "width": "380",
                "height": 100
            };

            $scope.adjustOffset = {
                "id": "adjustOffset",
                "label": $scope.i18n.sys_term_AdjustOffset_button + ":" || "调整偏移量（分钟）：",
                "width": "210",
                "value": "60",
                "type": "input",
                'disable': true,
                "require": true,
                "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 120)) || "1～120(含1和120)之间的整数。",
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 120) || "范围为1-120" ) +
                    ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 120) || "范围为1-120" ) +
                    ";maxValue(120):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 120) || "范围为1-120" )
            };

            var startTimeSelect = function () {
                var startTimeValue = [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.sys_time_set_para_sumer_option_date_value || "日期方式",
                        "checked": true
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.sys_time_set_para_sumer_option_week_value || "星期方式",
                        "checked": true
                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.sys_time_set_para_sumer_option_dateWeek_value || "日期加星期方式",
                        "checked": true
                    }
                ]
                return startTimeValue;
            };

            $scope.startTime = {
                "id": "startTimeId",
                "label": $scope.i18n.common_term_startTime_label + ":" || "开始时间:",
                "width": 130,
                'disable': true,
                "values": startTimeSelect(),
                "changStartWay": function () {
                    if ($("#" + $scope.startTime.id).widget().getSelectedId() == '0') {
                        $scope.startDayIsshow = true;
                        $scope.startSequenceWeekIsshow = false;
                        $scope.startWeekIsshow = false;
                    }
                    else if ($("#" + $scope.startTime.id).widget().getSelectedId() == '1') {
                        $scope.startDayIsshow = false;
                        $scope.startSequenceWeekIsshow = true;
                        $scope.startWeekIsshow = true;
                    }
                    else if ($("#" + $scope.startTime.id).widget().getSelectedId() == '2') {
                        $scope.startWeekIsshow = true;
                        $scope.startDayIsshow = true;
                        $scope.startSequenceWeekIsshow = false;
                    }
                }
            };

            $scope.startTimer = {
                "id": "startTimerId",
                "type": "time",
                "timeFormat": "hh:mm:ss",
                "width": 100,
                "ampm": false
            };

            $scope.endTime = {
                "id": "endTimeId",
                "label": $scope.i18n.common_term_endTime_label + ":" || "结束时间:",
                "width": 130,
                "disable": true,
                "values": startTimeSelect(),
                "changEndWay": function () {
                    if ($("#" + $scope.endTime.id).widget().getSelectedId() == '0') {
                        $scope.endDayIsshow = true;
                        $scope.endSequenceWeekIsshow = false;
                        $scope.endWeekIsshow = false;
                    }
                    else if ($("#" + $scope.endTime.id).widget().getSelectedId() == '1') {
                        $scope.endDayIsshow = false;
                        $scope.endSequenceWeekIsshow = true;
                        $scope.endWeekIsshow = true;
                    }
                    else if ($("#" + $scope.endTime.id).widget().getSelectedId() == '2') {
                        $scope.endWeekIsshow = true;
                        $scope.endDayIsshow = true;
                        $scope.endSequenceWeekIsshow = false;
                    }
                }
            };

            $scope.operator = {
                "intervalGet": function () {
                    $scope.promiseTime = $interval(function () {
                        $scope.operator.getSysTime();
                    }, 1000);
                    $scope.promiseNTP = $interval(function () {
                        var def = camel.get({
                            "url": "/goku/rest/v1.5/ntp",
                            "monitor": false,
                            "autoRequest": true,
                            "beforeSend": function (request) {
                                request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                            }
                        });
                        def.done(function (response) {
                            $scope.$apply(function () {
                                try {
                                    if (response.ntpSyncStatus == "normal") {
                                        $scope.timeSychName.value = ($scope.i18n.common_term_syncing_value || "同步中...");
                                    } else {
                                        $scope.timeSychName.value = ($scope.i18n.common_term_syncAbnormal_value || "同步异常");
                                    }
                                } catch (e) {
                                    return;
                                }
                            });
                        });
                    }, 30000);
                },
                "getSysTime": function () {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/systime?withsyncstatus=true",
                        "monitor": false,
                        "autoRequest": true,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.systemTimeName.value = timeService.utc2Local(response.systemTime);
                            if (response.ntpSynResp != null) {
                                var fStatus = response.ntpSynResp.ntpStatus;
                                if (fStatus == 2) {
                                    $scope.forceTimeStatus.value = ($scope.i18n.common_term_forciblySyncing_value || "强制同步中...");
                                } else if (fStatus == 1) {
                                    $scope.forceTimeStatus.value = (($scope.i18n.common_term_forciblySyncSucceed_value
                                        + "(" + timeService.utc2Local(response.ntpSynResp.syncCompleteTime)
                                        + ")") || ("强制同步成功(" + timeService.utc2Local(response.ntpSynResp.syncCompleteTime) + ")"));
                                } else if (fStatus == 3) {
                                    $scope.forceTimeStatus.value = ($scope.i18n.common_term_forciblySyncFail_value || "强制同步失败");
                                    var ccode = response.ntpSynResp.syncFailedErrorcode;
                                    var desc = systemException && systemException[ccode] && systemException[ccode].desc || ( $scope.i18n.common_term_sysAbnormal_label || "系统异常");
                                    $scope.forceTimeFail.value = desc;
                                }
                            }
                        });
                    });
                },
                "getNTP": function () {
                    var def = camel.get({
                        "url": "/goku/rest/v1.5/ntp",
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    def.done(function (response) {
                        $scope.$apply(function () {
                            try {
                                $scope.NTP_INFO = response.currInfo;
                                if (response.ntpSyncStatus == "normal") {
                                    $scope.timeSychName.value = ($scope.i18n.common_term_syncing_value || "同步中...");
                                } else {
                                    $scope.timeSychName.value = ($scope.i18n.common_term_syncAbnormal_value || "同步异常");
                                }
                                var inValues = $scope.timeSysInterval.values;
                                $("#" + $scope.timeSysInterval.id).widget().opChecked(response.currInfo.period);
                                var ip1 = (response.currInfo.ntpServerList[0] != '127.127.1.0') ? response.currInfo.ntpServerList[0] : null;
                                var ip2 = (response.currInfo.ntpServerList[1] != '127.127.1.0') ? response.currInfo.ntpServerList[1] : null;
                                var ip3 = (response.currInfo.ntpServerList[2] != '127.127.1.0') ? response.currInfo.ntpServerList[2] : null;
                                $scope.timeServerOne.value = ip1;
                                $scope.timeServerTwo.value = ip2;
                                $scope.timeServerThree.value = ip3;
                            } catch (e) {
                                return;
                            }
                        });
                    });
                    def.fail(function (data) {
                    });
                },
                "saveNTP": function () {
                    var def = camel.post({
                        "url": "/goku/rest/v1.5/ntp",
                        "params": $scope.operator.kakaNTPPostParam(),
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    def.done(function (response) {
                        var options = {
                            type: "prompt",
                            content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                            height: "150px",
                            width: "350px",
                            modal: true
                        };
                        var msg = new Message(options);
                        msg.show();
                        $scope.operator.getNTP();
                    });
                    def.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "kakaNTPPostParam": function () {
                    var ntpPostParam = {};
                    var newParam = {};
                    newParam.period = $("#" + $scope.timeSysInterval.id).widget().getSelectedId();
                    var ip1 = $("#" + $scope.timeServerOne.id).widget().getValue();
                    var ip2 = $("#" + $scope.timeServerTwo.id).widget().getValue();
                    var ip3 = $("#" + $scope.timeServerThree.id).widget().getValue();
                    var rex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
                    if (!rex.test(ip1)) {
                        ip1 = "";
                    }
                    if (!rex.test(ip2)) {
                        ip2 = "";
                    }
                    if (!rex.test(ip3)) {
                        ip3 = "";
                    }
                    newParam.ntpServerList = [ip1, ip2, ip3];
                    ntpPostParam.oldValue = $scope.NTP_INFO;
                    ntpPostParam.newValue = newParam;
                    var jsonn = JSON.stringify(ntpPostParam);
                    return jsonn;
                },
                "forceSyncTime": function () {
                    var def = camel.put({
                        "url": "/goku/rest/v1.5/systime",
                        "params": "{}",
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    def.done(function (response) {
                        $scope.$apply(function () {
                            try {
                                if (response.ntpSynResp != null) {
                                    var fStatus = response.ntpSynResp.ntpStatus;
                                    if (fStatus == 2) {
                                        $scope.forceTimeStatus.value = ($scope.i18n.common_term_forciblySyncing_value || "强制同步中...");
                                    } else if (fStatus == 1) {
                                        $scope.forceTimeStatus.value = (($scope.i18n.common_term_forciblySyncSucceed_value + "(" + response.ntpSynResp.syncCompleteTime + ")") || ("强制同步成功(" + response.ntpSynResp.syncCompleteTime + ")"));
                                    } else if (fStatus == 3) {
                                        $scope.forceTimeStatus.value = ($scope.i18n.common_term_forciblySyncFail_value || "强制同步失败");
                                        var ccode = response.ntpSynResp.syncFailedErrorcode;
                                        var desc = systemException && systemException[ccode] && systemException[ccode].desc || ( $scope.i18n.common_term_sysAbnormal_label || "系统异常");
                                        $scope.forceTimeFail.value = desc;
                                    }
                                }
                            } catch (e) {
                                return;
                            }
                        });
                    });
                    def.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "getTimeZone": function () {
                    var def = camel.get({
                        "url": "/goku/rest/v1.5/time-zone",
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    def.done(function (response) {
                        $scope.$apply(function () {
                            try {
                                $("#" + $scope.startTimerPre.id).widget().option("defaultTime", "00:00");
                                $("#" + $scope.endTimerPre.id).widget().option("defaultTime", "00:00");
                                $scope.REGION = response.regionTimeZoneInfo;
                                $scope.CURRENT_TIME_ZONE = response.currentTimeZone;
                                var currReg = response.currentTimeZone.currentRegion;
                                var currentTZ = response.currentTimeZone.currentTZ;
                                var regions = [];
                                var citys = [];
                                for (var index in response.regionTimeZoneInfo) {
                                    var regIndex = response.regionTimeZoneInfo[index].region;
                                    var reg = {
                                        "selectId": regIndex,
                                        "label": regIndex
                                    }
                                    if (currReg === regIndex) {
                                        reg.checked = true;
                                    }
                                    regions.push(reg);
                                    if (currReg == regIndex) {
                                        var cityIndexs = response.regionTimeZoneInfo[index].cities;
                                        for (var c in cityIndexs) {
                                            var city = {
                                                "selectId": cityIndexs[c],
                                                "label": cityIndexs[c]
                                            }
                                            if (currentTZ == cityIndexs[c]) {
                                                city.checked = true;
                                            }
                                            citys.push(city);
                                        }
                                    }
                                }
                                $scope.district.values = regions;
                                $scope.city.values = citys;
                                $scope.currentTimezone.value = currReg + "/" + currentTZ;
                                var dstInfoResp = response.currentTimeZone.dstInfo;
                                if (dstInfoResp != null) {
                                    if (dstInfoResp.daylightTime) {
                                        $scope.supportClock.isDisable();
                                        $("#" + $scope.startTime.id).widget().opChecked(dstInfoResp.startMode);
                                        $scope.startTime.changStartWay();

                                        $("#" + $scope.startMonth.id).widget().opChecked(dstInfoResp.startMonth);
                                        $("#" + $scope.startTimerPre.id).widget().option("defaultTime", dstInfoResp.startTime);
                                        if (dstInfoResp.startMode == '0') {
                                            $("#" + $scope.startDay.id).widget().opChecked(dstInfoResp.startDay);
                                        }
                                        else if (dstInfoResp.startMode == '1') {
                                            $("#" + $scope.startSequenceWeek.id).widget().opChecked(dstInfoResp.startWeekNum);
                                            $("#" + $scope.startWeek.id).widget().opChecked(dstInfoResp.startDayOfWeek);
                                        }
                                        else if (dstInfoResp.startMode == '2') {
                                            $("#" + $scope.startDay.id).widget().opChecked(dstInfoResp.startDay);
                                            $("#" + $scope.startWeek.id).widget().opChecked(dstInfoResp.startDayOfWeek);
                                        }

                                        $("#" + $scope.endTime.id).widget().opChecked(dstInfoResp.endMode);
                                        $scope.endTime.changEndWay();
                                        $("#" + $scope.endMonth.id).widget().opChecked(dstInfoResp.endMonth);
                                        $("#" + $scope.endTimerPre.id).widget().option("defaultTime", dstInfoResp.endTime);
                                        if (dstInfoResp.endMode == '0') {
                                            $("#" + $scope.endDay.id).widget().opChecked(dstInfoResp.endDay);
                                        }
                                        else if (dstInfoResp.endMode == '1') {
                                            $("#" + $scope.endSequenceWeek.id).widget().opChecked(dstInfoResp.endWeekNum);
                                            $("#" + $scope.endWeek.id).widget().opChecked(dstInfoResp.endDayOfWeek);
                                        }
                                        else if (dstInfoResp.endMode == '2') {
                                            $("#" + $scope.endWeek.id).widget().opChecked(dstInfoResp.endDayOfWeek);
                                            $("#" + $scope.endDay.id).widget().opChecked(dstInfoResp.endDay);
                                        }
                                        $scope.adjustOffset.value = parseInt(dstInfoResp.dstSavings) / 60;
                                    }
                                }
                            } catch (e) {
                                return;
                            }
                        });
                    });
                    def.fail(function (data) {
                    });
                },
                "saveTimeZone": function () {
                    var def = camel.post({
                        "url": "/goku/rest/v1.5/time-zone",
                        "params": $scope.operator.kakaTimeZonePostParam(),
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $rootScope.user.id);
                        }
                    });
                    def.complete(function (response) {
                        if(response.status !== 200){
                            return;
                        }
                        var options = {
                            type: "prompt",
                            content: $scope.i18n.common_term_saveSucceed_label || "保存成功。",
                            height: "150px",
                            width: "350px",
                            modal: true
                        };
                        var msg = new Message(options);
                        msg.show();
                        $scope.$apply(function () {
                            try {
                                $scope.operator.getTimeZone();
                            } catch (e) {
                                return;
                            }
                        });
                        $scope.operator.getSysTime();
                        $scope.operator.getNTP();
                        $scope.operator.getTimeZone();
                        $scope.operator.intervalGet();
                    });
                    def.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "kakaTimeZonePostParam": function () {
                    var timeZonePostParam = {};
                    var newTZInfo = {};
                    newTZInfo.currentRegion = $("#" + $scope.district.id).widget().getSelectedId();
                    newTZInfo.currentTZ = $("#" + $scope.city.id).widget().getSelectedId();
                    if ($scope.supportClock.checked) {
                        var dstInfo = {};
                        dstInfo.daylightTime = true;
                        dstInfo.startMode = $("#" + $scope.startTime.id).widget().getSelectedId();
                        dstInfo.startMonth = $("#" + $scope.startMonth.id).widget().getSelectedId();
                        dstInfo.startDay = $("#" + $scope.startDay.id).widget().getSelectedId();
                        dstInfo.startWeekNum = $("#" + $scope.startSequenceWeek.id).widget().getSelectedId();
                        dstInfo.startDayOfWeek = $("#" + $scope.startWeek.id).widget().getSelectedId();
                        dstInfo.startTime = $("#" + $scope.startTimerPre.id).widget().getDateTime() + ":00";

                        dstInfo.endMode = $("#" + $scope.endTime.id).widget().getSelectedId();
                        dstInfo.endMonth = $("#" + $scope.endMonth.id).widget().getSelectedId();
                        dstInfo.endDay = $("#" + $scope.endDay.id).widget().getSelectedId();
                        dstInfo.endWeekNum = $("#" + $scope.endSequenceWeek.id).widget().getSelectedId();
                        dstInfo.endDayOfWeek = $("#" + $scope.endWeek.id).widget().getSelectedId();
                        dstInfo.endTime = $("#" + $scope.endTimerPre.id).widget().getDateTime() + ":00";
                        var offset = $("#" + $scope.adjustOffset.id).widget().getValue();
                        dstInfo.dstSavings = parseInt(offset) * 60;
                        newTZInfo.dstInfo = dstInfo;
                    } else {
                        var dstInfo = {};
                        dstInfo.daylightTime = false;
                        newTZInfo.dstInfo = dstInfo;
                    }
                    timeZonePostParam.newTZInfo = newTZInfo;
                    timeZonePostParam.eldTZInfo = $scope.CURRENT_TIME_ZONE;
                    var jsonn = JSON.stringify(timeZonePostParam);
                    return jsonn;
                }
            }
            $scope.clearTimer = function () {
                try {
                    $interval.cancel($scope.promiseTime);
                    $interval.cancel($scope.promiseNTP);
                }
                catch (e) {
                }
            };
            $scope.startDayIsshow = true;
            $scope.endDayIsshow = true;
            $scope.operator.getSysTime();
            $scope.operator.getNTP();
            $scope.operator.getTimeZone();
            $scope.operator.intervalGet();

            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }];
        return timeManageCtrl;
    });