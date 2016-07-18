/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        "language/keyID",
        'app/services/validatorService',
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (angular, $, _, http, UnifyValid, i18n) {
        "use strict";
        var ctrl = ["$scope",
            function ($scope) {

                // 父窗口传递的添加对象
                var monitor = $("#configHealthCheckWindow").widget().option("param").parmMonitor;

                $scope.showCheckPath = ("TCP" !== monitor.protocol);

                $scope.close = function () {
                    $("#configHealthCheckWindow").widget().destroy();
                };
                $scope.info = {
                    checkPath: {
                        label: i18n.common_term_checkPath_label + ":",
                        "tooltip": i18n.lb_listen_add_para_checkPath_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-checkPath",
                        "width": "214",
                        require: true,
                        value: monitor.checkPath,
                        "validate": "required:" + i18n.common_term_null_valid + ";regularCheck(" + /^\/.*$/ + "):" + i18n.common_term_startWithSlash_valid
                    },
                    timeout: {
                        label: i18n.device_term_timeouts_label + ":",
                        "tooltip": i18n.lb_listen_add_para_timeout_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-timeout",
                        "width": "214",
                        require: true,
                        value: monitor.responseTime,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                    },
                    checkInterval: {
                        label: i18n.common_term_checkCycleS_label + ":",
                        "tooltip": i18n.lb_listen_add_para_checkCycleS_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-checkInterval",
                        "width": "214",
                        require: true,
                        value: monitor.checkInterval,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                    },
                    healthyThreshold: {
                        label: i18n.lb_term_healthThreshold_label + ":",
                        "tooltip": i18n.lb_listen_add_para_healthThreshold_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-healthyThreshold",
                        "width": "214",
                        require: true,
                        value: monitor.healthyThreshold,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")
                    },
                    unhealthyThreshold: {
                        label: i18n.lb_term_notHealthThreshold_label + ":",
                        "tooltip": i18n.lb_listen_add_para_notHealthThreshold_mean_tip,
                        "id": "create-vlb-configHealthCheck-window-unhealthyThreshold",
                        "width": "214",
                        require: true,
                        value: monitor.unhealthyThreshold,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")

                    },
                    okBtn: {
                        "id": "create-vlb-configHealthCheck-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#config-healthcheck-window"));
                            if (!valid) {
                                return;
                            }
                            monitor.checkPath = $("#create-vlb-configHealthCheck-window-checkPath").widget().getValue();
                            monitor.responseTime = $("#create-vlb-configHealthCheck-window-timeout").widget().getValue();
                            monitor.checkInterval = $("#create-vlb-configHealthCheck-window-checkInterval").widget().getValue();
                            monitor.healthyThreshold = $("#create-vlb-configHealthCheck-window-healthyThreshold").widget().getValue();
                            monitor.unhealthyThreshold = $("#create-vlb-configHealthCheck-window-unhealthyThreshold").widget().getValue();
                            monitor.opt = "";
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-configHealthCheck-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var configHealthCheckWindow = angular.module("configHealthCheckWindow", dependency);
        configHealthCheckWindow.controller("configHealthCheckCtrl", ctrl);
        configHealthCheckWindow.service("camel", http);
        return configHealthCheckWindow;
    });
