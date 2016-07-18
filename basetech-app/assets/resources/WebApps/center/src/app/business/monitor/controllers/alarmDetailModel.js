define([
    "tiny-lib/angular",
    "language/keyID"
],
    function (angular, i18n) {
        var alarmDetailCtrl = ["$scope",
            function ($scope) {
                $scope.alarmDetail = {};
                $scope.additionalInfo = {
                    "label": (i18n.common_term_attachmentInfo_label || "附加信息") +":"
                };
                $scope.sn = {
                    "label": (i18n.common_term_flowSN_label || "流水号") +":"
                };
                $scope.alarmId = {
                    "label": i18n.common_term_alarmID_label + ":"
                };
                $scope.severity = {
                    "label": i18n.common_term_alarmLevel_label + ":"
                };
                $scope.alarmName = {
                    "label": i18n.common_term_alarmName_label + ":"
                };
                $scope.moc = {
                    "label": i18n.common_term_objectType_label + ":"
                };
                $scope.resourceName = {
                    "label": i18n.common_term_alarmObj_label + ":"
                };
                $scope.compName = {
                    "label": i18n.common_term_assemblyName_label + ":"
                };
                $scope.compType = {
                    "label": i18n.common_term_assemblyType_label + ":"
                };
                $scope.occurTime = {
                    "label": i18n.common_term_generantTime_label + ":"
                };
                $scope.clearTime = {
                    "label": i18n.alarm_term_clearTime_label + ":"
                };
                $scope.clearType = {
                    "label": i18n.alarm_term_clearType_label + ":"
                };
                $scope.userofclear = {
                    "label": (i18n.alarm_term_clearBy_label || "清除用户") +":"
                };
            }
        ];
        var alarmDetailModel = angular.module("monitor.alarm.detail", ["ng", "wcc"]);
        alarmDetailModel.controller("monitor.alarm.detail.ctrl", alarmDetailCtrl);

        return alarmDetailModel;
    })
