/* global define */
define(["tiny-lib/angular"], function (angular) {
    "use strict";
    var alarmSettingsCtrl = ["$scope", "$state",
        function ($scope, $state) {
            var i18n = $scope.i18n ||{};
            $scope.plugins = [{
                "openState": "monitor.alarmsettings.mailConfig",
                "name": i18n.alarm_term_sendEmail_label
            }];
            $scope.selectedTab = i18n.alarm_term_sendEmail_label;
            $scope.setSelectedTabItem = function (name) {
                $scope.selectedTab = name;
            };
        }
    ];
    return alarmSettingsCtrl;
});
