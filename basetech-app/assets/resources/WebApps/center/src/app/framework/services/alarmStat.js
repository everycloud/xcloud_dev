/**
 * 首页告警统计
 */
define(["fixtures/alarmStatFixture"], function () {
        "use strict";

        var errCounter = 0;
        var errInterval = 5;

        return function ($scope, $state, camel) {
            $scope.alarm =
            {
                critical: 0,
                major: 0,
                minor: 0,
                warning: 0
            }

            function getAlarmStat() {
                if (errCounter > 0) {
                    if ((errCounter % errInterval) != 0) {
                        errCounter++;
                        return;
                    }
                }
                var urlChoose = "/goku/rest/v1.5/1/alarms/statistic";
                if($scope.deployMode === "local"){
                    urlChoose = "/goku/rest/v1.5/fault/1/alarms/statistic";
                }
                var ret = http.post({
                    "url": urlChoose,
                    "userId": $scope.user.id,
                    "monitor": false,
                    "autoRequest": true,
                    "params": JSON.stringify({
                        "conditionList": [
                            {
                                "staticType": ["critical", "major", "minor", "warning"]
                            }
                        ]
                    })
                });

                ret.success(function (data) {
                    errCounter = 0;
                    errInterval = 5;

                    if (data && data.value) {
                        $scope.alarm =
                        {
                            critical: 0,
                            major: 0,
                            minor: 0,
                            warning: 0
                        }

                        var i = 0;
                        for (i = 0; i < data.value.length; i++) {
                            var e = data.value[i];
                            for (var k in e.staticType) {
                                $scope.alarm[k] = e.staticType[k]
                            }
                        }

                        $scope.$digest();
                    }

                })

                ret.fail(function (xhr) {
                    errCounter++;
                    if (errCounter > errInterval) {
                        if (errInterval < 60) {
                            errInterval += 5;
                        }
                    }
                })
            }

            var http = camel;
            // 定时查询
            if (("localhost" != document.domain)
                && ($scope.user.privilege.alarm_term_alarm_label))
            {
                setInterval(getAlarmStat, 5000);
            }
            getAlarmStat();

            $scope.gotoAlarm = function (para) {
                var key = {
                    "critical": 1,
                    "major": 2,
                    "minor": 3,
                    "warning": 4
                };

                $state.go("monitor.alarmlist", {
                    severity: key[para] || 0,
                    alarmtype: 1,
                    resourceid: "",
                    moc: ""
                });
            };
        }
    }
);