define(["tiny-lib/angular"], function (angular) {
    "use strict";

    var alarmSettingsCtrl = ["$scope", "$state",
        function ($scope, $state) {
            $scope.plugins = [{
                "openState": "monitor.alarmsettings.mailConfig",
                "name": $scope.i18n.alarm_term_sendEmail_label
            }, {
                "openState": "monitor.alarmsettings.threholdConfig",
                "name": $scope.i18n.alarm_term_alarmThreshold_label
            }, {
                "openState": "monitor.alarmsettings.shieldConfig",
                "name": $scope.i18n.alarm_term_maskAlarm_label
            }, {
                "openState": "monitor.alarmsettings.snmpClientConfig",
                "name": $scope.i18n.alarm_term_thirdManage_label
            }];

            if ($("html").scope().deployMode == "top") {
                $scope.plugins.splice(1, 1);
            }

            $scope.selectedTab = $scope.i18n.alarm_term_sendEmail_label;
            $scope.setSelectedTabItem = function (name) {
                $scope.selectedTab = name;
            }
        }
    ];
    return alarmSettingsCtrl;
});
