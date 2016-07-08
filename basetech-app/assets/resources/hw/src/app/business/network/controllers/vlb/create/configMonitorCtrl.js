define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "tiny-lib/underscore",
    "app/services/messageService"
], function (angular, $, Window, _, messageService) {
    "use strict";
    var ctrl = ["$scope", "$compile",
        function ($scope, $compile) {
            var messageServiceIns = new messageService();
            var i18n = $scope.i18n;
            $scope.info = {
                httpMonitorConfigTable: {
                    "id": "create-vlb-configmonitor-httpMonitorConfigTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 会话保持配置
                        var sessionBoxScope = $scope.$new();
                        sessionBoxScope.checked = aData.sessionChecked;
                        sessionBoxScope.id = "httpSessionConfigChecked" + iDataIndex;
                        sessionBoxScope.change = function () {
                            var checkVal = $("#" + sessionBoxScope.id).widget().option("checked");
                            aData.sessionChecked = checkVal;
                            sessionBoxScope.checked = checkVal;
                            $scope.service.httpMonitorConfigTable[iDataIndex] = aData;
                            // 清空配置的session
                            aData.sessionMode = "";
                            aData.timeout = "";
                        };
                        sessionBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configSessionWindow",
                                title: i18n.lb_term_setStickySession_button,
                                "param": param,
                                height: "250px",
                                width: "500px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configSession.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.httpMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var sessionBox = "<div><tiny-checkbox id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        var sessionBoxLink = $compile(sessionBox);
                        var sessionBoxNode = sessionBoxLink(sessionBoxScope);
                        $("td:eq(1)", nRow).append(sessionBoxNode);

                        // 健康检查配置
                        var healthCheckBoxScope = $scope.$new();
                        healthCheckBoxScope.checked = aData.healthCheckChecked;
                        healthCheckBoxScope.id = "httpHealthCheckConfigChecked" + iDataIndex;
                        healthCheckBoxScope.change = function () {
                            var checkVal = $("#" + healthCheckBoxScope.id).widget().option("checked");
                            aData.healthCheckChecked = checkVal;
                            healthCheckBoxScope.checked = checkVal;
                            $scope.service.httpMonitorConfigTable[iDataIndex] = aData;
                            // 清空已经配置的健康检查项
                            aData.checkPath = "";
                            aData.responseTime = "";
                            aData.checkInterval = "";
                            aData.healthyThreshold = "";
                            aData.unhealthyThreshold = "";
                        };
                        healthCheckBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configHealthCheckWindow",
                                title: i18n.lb_term_setHealthCheck_button,
                                "param": param,
                                height: "300px",
                                width: "530px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configHealthCheck.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.httpMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        // 硬件vlb时，健康检查必选
                        if ($scope.service.workingMode.value === 'high') {
                            healthCheckBox = "<div><tiny-checkbox id='id' disable='true' checked='true'></tiny-checkbox><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></div>";
                        }

                        var healthCheckBoxLink = $compile(healthCheckBox);
                        var healthCheckBoxNode = healthCheckBoxLink(healthCheckBoxScope);
                        $("td:eq(2)", nRow).append(healthCheckBoxNode);

                        // 发放策略
                        var opt = "<div><tiny-select id='policy.id' values='policy.value' width='policy.width' change='policy.change()'></tiny-select></div>";
                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.policy = {
                            "id": "httpPolicySel" + iDataIndex,
                            "value": [
                                {
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                },
                                {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }
                            ],
                            "width": "220",
                            "change": function () {
                                aData.policy = $("#httpPolicySel" + iDataIndex).widget().getSelectedId();
                                $scope.service.httpMonitorConfigTable[iDataIndex] = aData;
                            }
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                    }
                },
                httpsMonitorConfigTable: {
                    "id": "create-vlb-configmonitor-httpsMonitorConfigTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_certificate_value,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.certificate);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 会话保持配置
                        var sessionBoxScope = $scope.$new();
                        sessionBoxScope.checked = aData.sessionChecked;
                        sessionBoxScope.id = "httpsSessionConfigChecked" + iDataIndex;
                        sessionBoxScope.change = function () {
                            var checkVal = $("#" + sessionBoxScope.id).widget().option("checked");
                            aData.sessionChecked = checkVal;
                            sessionBoxScope.checked = checkVal;
                            $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                            // 清空配置的session
                            aData.sessionMode = "";
                            aData.timeout = "";
                        };
                        sessionBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configSessionWindow",
                                title: i18n.lb_term_setStickySession_button,
                                "param": param,
                                height: "250px",
                                width: "500px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configSession.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var sessionBox = "<div><tiny-checkbox id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        // 软件vlb时，会话保持必选
                        if ($scope.service.workingMode.value === 'low') {
                            sessionBox = "<div><tiny-checkbox id='id' disable='true' checked='true'></tiny-checkbox><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></div>";
                        }
                        var sessionBoxLink = $compile(sessionBox);
                        var sessionBoxNode = sessionBoxLink(sessionBoxScope);
                        $("td:eq(1)", nRow).append(sessionBoxNode);

                        // 健康检查配置
                        var healthCheckBoxScope = $scope.$new();
                        healthCheckBoxScope.checked = aData.healthCheckChecked;
                        healthCheckBoxScope.id = "httpsHealthCheckConfigChecked" + iDataIndex;
                        healthCheckBoxScope.change = function () {
                            var checkVal = $("#" + healthCheckBoxScope.id).widget().option("checked");
                            aData.healthCheckChecked = checkVal;
                            healthCheckBoxScope.checked = checkVal;
                            $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                            // 清空已经配置的健康检查项
                            aData.checkPath = "";
                            aData.responseTime = "";
                            aData.checkInterval = "";
                            aData.healthyThreshold = "";
                            aData.unhealthyThreshold = "";
                        };
                        healthCheckBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configHealthCheckWindow",
                                title: i18n.lb_term_setHealthCheck_button,
                                "param": param,
                                height: "300px",
                                width: "530px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configHealthCheck.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        // 硬件vlb时，健康检查必选
                        if ($scope.service.workingMode.value === 'high') {
                            healthCheckBox = "<div><tiny-checkbox id='id' disable='true' checked='true'></tiny-checkbox><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></div>";
                        }
                        var healthCheckBoxLink = $compile(healthCheckBox);
                        var healthCheckBoxNode = healthCheckBoxLink(healthCheckBoxScope);
                        $("td:eq(2)", nRow).append(healthCheckBoxNode);

                        // 发放策略
                        var opt = "<div><tiny-select id='policy.id' values='policy.value' width='policy.width' change='policy.change()'></tiny-select></div>";
                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.policy = {
                            "id": "httpsPolicySel" + iDataIndex,
                            "value": [
                                {
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                },
                                {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }
                            ],
                            "width": "220",
                            "change": function () {
                                aData.policy = $("#httpsPolicySel" + iDataIndex).widget().getSelectedId();
                                $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                            }
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);

                        // 健康检查配置
                        var certificateBox = "<span><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></span>";
                        var certificateBoxLink = $compile(certificateBox);

                        var certificateBoxScope = $scope.$new();
                        certificateBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configCertificateWindow",
                                title: i18n.lb_term_setCertificate_button,
                                "param": param,
                                height: "400px",
                                width: "540px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configCertificate.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.httpsMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var certificateBoxNode = certificateBoxLink(certificateBoxScope);
                        $("td:eq(4)", nRow).append(certificateBoxNode);
                    }
                },
                tcpMonitorConfigTable: {
                    "id": "create-vlb-configmonitor-tcpMonitorConfigTable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ],
                    "data": $scope.service.tcpMonitorConfigTable,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 会话保持配置
                        var sessionBoxScope = $scope.$new();
                        sessionBoxScope.checked = aData.sessionChecked;
                        sessionBoxScope.id = "tcpSessionConfigChecked" + iDataIndex;
                        sessionBoxScope.change = function () {
                            var checkVal = $("#" + sessionBoxScope.id).widget().option("checked");
                            aData.sessionChecked = checkVal;
                            sessionBoxScope.checked = checkVal;
                            $scope.service.tcpMonitorConfigTable[iDataIndex] = aData;
                            // 清空配置的session
                            aData.sessionMode = "";
                            aData.timeout = "";
                        };
                        sessionBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configSessionWindow",
                                title: i18n.lb_term_setStickySession_button,
                                "param": param,
                                height: "250px",
                                width: "500px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configSession.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.tcpMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var sessionBox = "<div><tiny-checkbox id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        var sessionBoxLink = $compile(sessionBox);
                        var sessionBoxNode = sessionBoxLink(sessionBoxScope);
                        $("td:eq(1)", nRow).append(sessionBoxNode);

                        // 健康检查配置
                        var healthCheckBoxScope = $scope.$new();
                        healthCheckBoxScope.checked = aData.healthCheckChecked;
                        healthCheckBoxScope.id = "tcpHealthCheckConfigChecked" + iDataIndex;
                        healthCheckBoxScope.change = function () {
                            var checkVal = $("#" + healthCheckBoxScope.id).widget().option("checked");
                            aData.healthCheckChecked = checkVal;
                            healthCheckBoxScope.checked = checkVal;
                            $scope.service.tcpMonitorConfigTable[iDataIndex] = aData;
                            // 清空已经配置的健康检查项
                            aData.checkPath = "";
                            aData.responseTime = "";
                            aData.checkInterval = "";
                            aData.healthyThreshold = "";
                            aData.unhealthyThreshold = "";
                        };
                        healthCheckBoxScope.config = function () {
                            var param = {
                                "parmMonitor": aData,
                                "rowIndex": iDataIndex
                            };
                            var options = {
                                "winId": "configHealthCheckWindow",
                                title: i18n.lb_term_setHealthCheck_button,
                                "param": param,
                                height: "300px",
                                width: "530px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/configHealthCheck.html",
                                "buttons": null,
                                "close": function () {
                                    $scope.service.tcpMonitorConfigTable[iDataIndex] = aData;
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                        // 硬件vlb时，健康检查必选
                        if ($scope.service.workingMode.value === 'high') {
                            healthCheckBox = "<div><tiny-checkbox id='id' disable='true' checked='true'></tiny-checkbox><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></div>";
                        }
                        var healthCheckBoxLink = $compile(healthCheckBox);
                        var healthCheckBoxNode = healthCheckBoxLink(healthCheckBoxScope);
                        $("td:eq(2)", nRow).append(healthCheckBoxNode);

                        // 发放策略
                        var opt = "<div><tiny-select id='policy.id' values='policy.value' width='policy.width' change='policy.change()'></tiny-select></div>";
                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.policy = {
                            "id": "tcpPolicySel" + iDataIndex,
                            "value": [
                                {
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                },
                                {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }
                            ],
                            "width": "220",
                            "change": function () {
                                aData.policy = $("#tcpPolicySel" + iDataIndex).widget().getSelectedId();
                                $scope.service.tcpMonitorConfigTable[iDataIndex] = aData;
                            }
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                    }
                },
                preBtn: {
                    "id": "create-vlb-configmonitor-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "addMonitor";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vlb-configmonitor-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
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
                        for (var monitor in tmp) {
                            if (tmp.hasOwnProperty(monitor)) {
                                // 会话配置校验
                                if (tmp[monitor].sessionChecked && (!tmp[monitor].sessionMode || tmp[monitor].sessionMode === "" || !tmp[monitor].timeout || tmp[monitor].timeout === "")) {
                                    messageServiceIns.failMsgBox(tmp[monitor].protocol + i18n.service_term_servicePort_label + " " + tmp[monitor].servicePort + i18n.lb_term_stickySessionCfgError_valid);
                                    return;
                                }

                                // 健康检查校验(TCP不用配置监测路径)
                                if (tmp[monitor].healthCheckChecked && ((tmp[monitor].protocol !== "TCP" && (!tmp[monitor].checkPath || tmp[monitor].checkPath === "")) || !tmp[monitor].responseTime || tmp[monitor].responseTime === "" || !tmp[monitor].checkInterval || tmp[monitor].checkInterval === "" || !tmp[monitor].healthyThreshold || tmp[monitor].healthyThreshold === "" || !tmp[monitor].unhealthyThreshold || tmp[monitor].unhealthyThreshold === "")) {
                                    messageServiceIns.failMsgBox(tmp[monitor].protocol + i18n.service_term_servicePort_label + " " + tmp[monitor].servicePort + i18n.common_term_healthMonitorCfgError_valid);
                                    return;
                                }

                                // 针对https需要配置证书
                                if (tmp[monitor].protocol === "HTTPS" && (!tmp[monitor].certificateName || tmp[monitor].certificateName === "" || !tmp[monitor].privateKey || tmp[monitor].privateKey === "" || !tmp[monitor].publicKey || tmp[monitor].publicKey === "")) {
                                    messageServiceIns.failMsgBox(tmp[monitor].protocol + i18n.service_term_servicePort_label + " " + tmp[monitor].servicePort + i18n.common_term_certificateCfgError_valid);
                                    return;
                                }
                            }
                        }
                        $scope.service.totalMonitors = tmp;
                        $scope.service.show = "bindVM";
                        $("#" + $scope.service.step.id).widget().next();
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
            };
        }
    ];
    return ctrl;
});
