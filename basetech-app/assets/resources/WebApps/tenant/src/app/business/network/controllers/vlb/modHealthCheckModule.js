/* global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/exceptionService',
    "app/business/network/services/vlb/vlbService",
    "language/keyID"
], function (angular, $, Window, _, UnifyValid, http, exception, vlbService, i18n) {
    "use strict";
    var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
        function ($scope, $q, $compile, camel, exception) {

            // 父窗口传递的添加对象
            var modDom = $("#modVlbHealthCheck");
            $scope.modData = modDom.widget().option("modData");
            $scope.healthCheckInfo = $scope.modData.healthCheckInfo;

            var healthCheckType = $scope.healthCheckInfo.healthCheckType;
            $scope.isHTTP = healthCheckType === "HTTP" || healthCheckType === "HTTPS";

            var httpMethod = $scope.healthCheckInfo.httpMethod;

            $scope.close = function () {
                modDom.widget().destroy();
            };

            var vlbServiceInst = new vlbService(exception, $q, camel);
            // A valid value is a single value, such as 200, a list, such as 200, 202, or a range, such as 200-204.
            UnifyValid.httpCodeValidate = function () {
                var input = $("#create-vlb-healthCheck-httpCode").widget().getValue();
                input = $.trim(input);
                if (/^(\d{3}(\s*,\s*\d{3})*)$|^(\d{3}-\d{3})$/.test(input)) {
                    return true;
                }
                return false;
            };
            $scope.info = _.extend({
                preBtn: {
                    "id": "create-vlb-configmonitor-pre",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#modHealthCheckWindow"));
                        if (!valid) {
                            return;
                        }
                        var checkInfo = {
                            "checkInterval":$("#create-vlb-healthCheck-checkInterval").widget().getValue(),
                            "httpMethod": $("#create-vlb-healthCheck-httpMethod").widget().getSelectedId(),
                            "responseTime": $("#create-vlb-healthCheck-timeout").widget().getValue(),
                            "unhealthyThreshold": $("#create-vlb-healthCheck-maxRoundRobin").widget().getValue()
                        };

                        if($scope.isHTTP){
                            _.extend(checkInfo,{
                                "expectedCodes": $("#create-vlb-healthCheck-httpCode").widget().getValue(),
                                "path": $("#create-vlb-healthCheck-checkPath").widget().getValue()
                            });
                        }
                        var param = {
                            "lbID": $scope.modData.lbID,
                            "vdcId": $scope.modData.tenantId,
                            "userId": $scope.modData.userId,
                            "cloudInfraId": $scope.modData.cloudInfraId,
                            "opReq": {
                                "healthCheckInfo": checkInfo
                            }
                        };
                        var promise = vlbServiceInst.modifyVlb(param);
                        promise.then(function () {
                            $scope.modData.isOKBttnClick = true;
                            $scope.close();
                            $scope.$destroy();
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-configmonitor-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                        $scope.$destroy();
                    }
                }
            });
            _.extend($scope.info, {
                protocol: {
                    "id": "create-vlb-healthCheck-protocol",
                    label: i18n.lb_term_healthCheckType_label + ":",
                    "width": "220",
                    require: true,
                    value: [
                        {
                            "selectId": "PING",
                            "label": "PING",
                            "checked": healthCheckType === "PING"
                        },
                        {
                            "selectId": "TCP",
                            "label": "TCP",
                            "checked": healthCheckType === "TCP"
                        },
                        {
                            "selectId": "HTTP",
                            "label": "HTTP",
                            "checked": healthCheckType === "HTTP"
                        },
                        {
                            "selectId": "HTTPS",
                            "label": "HTTPS",
                            "checked": healthCheckType === "HTTPS"
                        }
                    ],
                    "change": function () {
                        var selectId = $("#create-vlb-healthCheck-protocol").widget().getSelectedId();
                        $scope.isHTTP = selectId === "HTTP" || selectId === "HTTPS";
                    }
                },
                checkPath: {
                    label: i18n.common_term_checkPath_label + ":",
                    "id": "create-vlb-healthCheck-checkPath",
                    "width": "214",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";regularCheck(" + /^\/.*$/ + "):" + i18n.common_term_startWithSlash_valid
                },
                maxRoundRobin: {
                    "label": i18n.lb_term_poolingTimesMax_label + ":",
                    "id": "create-vlb-healthCheck-maxRoundRobin",
                    "width": "214",
                    "require": true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10") + ";maxValue(10):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10")
                },
                timeout: {
                    label: i18n.device_term_timeouts_label + ":",
                    "id": "create-vlb-healthCheck-timeout",
                    "width": "214",
                    "require": true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";minValue(5):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30") + ";maxValue(30):" + i18n.sprintf(i18n.common_term_range_valid, "5", "30")
                },
                checkInterval: {
                    label: i18n.common_term_checkCycleS_label + ":",
                    "id": "create-vlb-healthCheck-checkInterval",
                    "width": "214",
                    "require": true,
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
                            "checked": "OPTIONS" === httpMethod
                        },
                        {
                            "selectId": "HEAD",
                            "label": "HEAD",
                            "checked": "HEAD" === httpMethod
                        },
                        {
                            "selectId": "GET",
                            "label": "GET",
                            "checked": "GET" === httpMethod
                        },
                        {
                            "selectId": "POST",
                            "label": "POST",
                            "checked": "POST" === httpMethod
                        },
                        {
                            "selectId": "PUT",
                            "label": "PUT",
                            "checked": "PUT" === httpMethod
                        },
                        {
                            "selectId": "DELETE",
                            "label": "DELETE",
                            "checked": "DELETE" === httpMethod
                        },
                        {
                            "selectId": "TRACE",
                            "label": "TRACE",
                            "checked": "TRACE" === httpMethod
                        },
                        {
                            "selectId": "CONNECT",
                            "label": "CONNECT",
                            "checked": "CONNECT" === httpMethod
                        },
                        {
                            "selectId": "PATCH",
                            "label": "PATCH",
                            "checked": "PATCH" === httpMethod
                        }
                    ]
                },
                httpCode: {
                    "label": i18n.common_term_HTTPstatusCode_label + ":",
                    "id": "create-vlb-healthCheck-httpCode",
                    "width": "214",
                    "require": true,
                    "validate": "httpCodeValidate():" + i18n.lb_lb_add_para_HTTPstatusCode_mean_tip
                }
            });
        }
    ];
    var dependency = ["ng", "wcc"];
    var modHealthCheckWindow = angular.module("modHealthCheckWindow", dependency);
    modHealthCheckWindow.controller("modHealthCheckCtrl", ctrl);
    modHealthCheckWindow.service("camel", http);
    modHealthCheckWindow.service("exception", exception);
    return modHealthCheckWindow;
});
