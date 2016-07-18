define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid'
], function (angular, $, Window, _, UnifyValid) {
    "use strict";
    var ctrl = ["$scope", "$compile",
        function ($scope, $compile) {
            UnifyValid.httpCodeValidate = function () {
                var input = $("#create-vlb-healthCheck-httpCode").widget().getValue();
                input = $.trim(input);
                if (/^(\d{3}(\s*,\s*\d{3})*)$|^(\d{3}-\d{3})$/.test(input)) {
                    return true;
                }
                return false;
            };
            var i18n = $scope.i18n;
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            $scope.info = _.extend({
                preBtn: {
                    "id": "create-vlb-configmonitor-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "addMonitor";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-configmonitor-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            });
            _.extend($scope.info, {
                protocol: {
                    "id": "create-vlb-healthCheck-protocol",
                    label: i18n.lb_term_healthCheckType_label + ":",
                    "width": "220",
                    require: true,
                    "change": function () {
                        var selectId = $("#create-vlb-healthCheck-protocol").widget().getSelectedId();
                        if (selectId === "HTTP" || selectId === "HTTPS") {
                            $scope.service.isHTTP = true;
                        } else {
                            $scope.service.isHTTP = false;
                        }
                    }
                },
                checkPath: {
                    label: i18n.common_term_checkPath_label + ":",
                    "id": "create-vlb-healthCheck-checkPath",
                    "width": "214",
                    "require": true,
                    "value": "",
                    "validate": "required:" + i18n.common_term_null_valid + ";regularCheck(" + /^\/.*$/ + "):" + i18n.common_term_startWithSlash_valid
                },
                maxRoundRobin: {
                    "label": i18n.lb_term_poolingTimesMax_label + ":",
                    "id": "create-vlb-healthCheck-maxRoundRobin",
                    "width": "214",
                    "require": true,
                    "value": "1",
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")
                },
                timeout: {
                    label: i18n.device_term_timeouts_label + ":",
                    "id": "create-vlb-healthCheck-timeout",
                    "width": "214",
                    "require": true,
                    "value": "5",
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                },
                checkInterval: {
                    label: i18n.common_term_checkCycleS_label + ":",
                    "id": "create-vlb-healthCheck-checkInterval",
                    "width": "214",
                    "require": true,
                    "value": "5",
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                },
                httpMethod: {
                    "label": i18n.common_term_HTTPmode_label + ":",
                    "id": "create-vlb-healthCheck-httpMethod",
                    "width": "220",
                    "require": true,
                    "value": [
                        {
                            "selectId": "OPTIONS",
                            "label": "OPTIONS",
                            "checked": false
                        },
                        {
                            "selectId": "HEAD",
                            "label": "HEAD",
                            "checked": false
                        },
                        {
                            "selectId": "GET",
                            "label": "GET",
                            "checked": true
                        },
                        {
                            "selectId": "POST",
                            "label": "POST",
                            "checked": false
                        },
                        {
                            "selectId": "PUT",
                            "label": "PUT",
                            "checked": false
                        },
                        {
                            "selectId": "DELETE",
                            "label": "DELETE",
                            "checked": false
                        },
                        {
                            "selectId": "TRACE",
                            "label": "TRACE",
                            "checked": false
                        },
                        {
                            "selectId": "CONNECT",
                            "label": "CONNECT",
                            "checked": false
                        },
                        {
                            "selectId": "PATCH",
                            "label": "PATCH",
                            "checked": false
                        }
                    ]
                },
                httpCode: {
                    "label": i18n.common_term_HTTPstatusCode_label + ":",
                    "id": "create-vlb-healthCheck-httpCode",
                    "width": "214",
                    "require": true,
                    "value": "200",
                    "validate": "httpCodeValidate():" + i18n.lb_lb_add_para_HTTPstatusCode_mean_tip
                },
                nextBtn: {
                    "id": "create-vlb-configmonitor-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVlbConfigMonitor"));
                        if (!valid) {
                            return;
                        }
                        var protocol = $("#create-vlb-healthCheck-protocol").widget().getSelectedId();
                        var maxRoundRobin = $("#create-vlb-healthCheck-maxRoundRobin").widget().getValue();
                        var timeout = $("#create-vlb-healthCheck-timeout").widget().getValue();
                        var checkInterval = $("#create-vlb-healthCheck-checkInterval").widget().getValue();

                        $scope.service.protocol = protocol;
                        $scope.service.maxRoundRobin = maxRoundRobin;
                        $scope.service.timeout = timeout;
                        $scope.service.checkInterval = checkInterval;
                        if ($scope.service.isHTTP) {
                            var checkPath = $("#create-vlb-healthCheck-checkPath").widget().getValue();
                            var httpCode = $("#create-vlb-healthCheck-httpCode").widget().getValue();
                            var httpMethod = $("#create-vlb-healthCheck-httpMethod").widget().getSelectedId();

                            $scope.service.checkPath = checkPath;
                            $scope.service.httpCode = httpCode;
                            $scope.service.httpMethod = httpMethod;
                        }

                        var tmp = [];
                        _.each($scope.service.httpMonitorConfigTable, function (data) {
                            tmp.push(data);
                        });
                        _.each($scope.service.httpsMonitorConfigTable, function (data) {
                            tmp.push(data);
                        });
                        _.each($scope.service.tcpMonitorConfigTable, function (data) {
                            tmp.push(data);
                        });
                        $scope.service.totalMonitors = tmp;
                        $scope.service.show = "bindVM";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                }
            });
        }
    ];
    return ctrl;
});
