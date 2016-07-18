/* global define */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    "language/keyID",
    "app/business/monitor/services/performanceService"
],
    function ($, angular, sprintf, ngSanitize, keyIDI18n, performanceService) {
        "use strict";

        var alarmDetailCtrl = ["$scope",
            function ($scope) {
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.alarmDetail = {};
                $scope.additionalInfo = {
                    "label": i18n.common_term_attachmentInfo_label + ":"
                };
                $scope.sn = {
                    "label": i18n.common_term_flowSN_label + ":"
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
                    "label": i18n.alarm_term_clearBy_label + ":"
                };

                //查询脚本详情
                $scope.queryDetail = function (aData) {
                    $scope.$apply(function () {
                        if(aData.severity+"" === "1"){
                            aData.severity = i18n.alarm_term_critical_label;
                        }else if(aData.severity+"" === "2"){
                            aData.severity = i18n.alarm_term_major_label;
                        }else if(aData.severity+"" === "3"){
                            aData.severity = i18n.alarm_term_minor_label;
                        }else if(aData.severity+"" === "4"){
                            aData.severity = i18n.alarm_term_warning_label;
                        }else{
                            aData.severity = i18n.common_term_unknown_value;
                        }

                        if(aData.clearType +"" ==="2"){
                            aData.clearType = i18n.common_term_manualClear_label;
                        }else  if(aData.clearType +"" ==="0"){
                            aData.clearType = i18n.common_term_autoClear_label;
                        }
                        $scope.alarmDetail = aData;


                    });
                };
            }
        ];
        var alarmDetailModel = angular.module("monitor.alarm.detail", ["ng", "wcc", "ngSanitize"]);
        alarmDetailModel.controller("monitor.alarm.detail.ctrl", alarmDetailCtrl);

        return alarmDetailModel;
    });
