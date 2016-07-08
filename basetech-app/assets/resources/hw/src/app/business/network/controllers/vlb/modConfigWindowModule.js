/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/messageService",
        'app/services/exceptionService',
        "app/business/network/services/vlb/vlbService",
        "tiny-widgets/Window",
        "language/keyID",
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (angular, $, _, http, UnifyValid, validatorService, messageService, exception, vlbService, Window, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {

                var messageServiceIns = new messageService();
                $scope.vlbServiceInst = new vlbService(exception, $q, camel);

                var user = $("html").scope().user || {};
                // 父窗口传递的添加对象
                var modWinDom = $("#modConfigWindow");
                var listeners = modWinDom.widget().option("listeners");
                var cloudInfraId = modWinDom.widget().option("cloudInfraId");

                // 配置模式 软件:low  硬件:high
                var workingMode = modWinDom.widget().option("workingMode");
                var lbID = modWinDom.widget().option("lbID");

                $scope.close = function () {
                    modWinDom.widget().destroy();
                };

                $scope.info = {
                    httpMonitorConfigTable: {
                        "id": "create-vlb-configmonitor-httpMonitorConfigTable",
                        "enablePagination": false,
                        "draggable": true,
                        "columns": [{
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            // 会话保持配置
                            var sessionBoxScope = $scope.$new();
                            sessionBoxScope.checked = aData.sessionChecked;
                            sessionBoxScope.id = "httpSessionConfigChecked" + iDataIndex;
                            sessionBoxScope.change = function () {
                                var sessionBoxDom = $("#" + sessionBoxScope.id);
                                aData.sessionChecked = sessionBoxDom.widget().option("checked");
                                sessionBoxScope.checked = sessionBoxDom.widget().option("checked");
                                // 清空配置的session
                                aData.sessionMode = "";
                                aData.timeout = "";
                                $scope.info.httpMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.httpMonitorConfigTable.data[iDataIndex] = aData;
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
                                var healthCheckDom = $("#" + healthCheckBoxScope.id);
                                aData.healthCheckChecked = healthCheckDom.widget().option("checked");
                                healthCheckBoxScope.checked = healthCheckDom.widget().option("checked");
                                // 清空已经配置的健康检查项
                                aData.checkPath = "";
                                aData.responseTime = "";
                                aData.checkInterval = "";
                                aData.healthyThreshold = "";
                                aData.unhealthyThreshold = "";
                                $scope.info.httpMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.httpMonitorConfigTable.data[iDataIndex] = aData;
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                            // 硬件vlb时，健康检查必选
                            if (workingMode === 'high' || aData.healthCheckChecked) {
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
                                "value": [{
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                }, {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }],
                                "width": "120",
                                "change": function () {
                                    aData.policy = $("#httpPolicySel" + iDataIndex).widget().getSelectedId();
                                    $scope.info.httpMonitorConfigTable.data[iDataIndex] = aData;
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
                        "columns": [{
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_certificate_value,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.certificate);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            // 会话保持配置
                            var sessionBoxScope = $scope.$new();
                            sessionBoxScope.checked = aData.sessionChecked;
                            sessionBoxScope.id = "httpsSessionConfigChecked" + iDataIndex;
                            sessionBoxScope.change = function () {
                                var sessionBoxDom = $("#" + sessionBoxScope.id);
                                aData.sessionChecked = sessionBoxDom.widget().option("checked");
                                sessionBoxScope.checked = sessionBoxDom.widget().option("checked");
                                // 清空配置的session
                                aData.sessionMode = "";
                                aData.timeout = "";
                                $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            var sessionBox = "<div><tiny-checkbox id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                            // 软件vlb时，会话保持必选
                            if (workingMode === 'low') {
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
                                var healthCheckDom = $("#" + healthCheckBoxScope.id);
                                aData.healthCheckChecked = healthCheckDom.widget().option("checked");
                                healthCheckBoxScope.checked = healthCheckDom.widget().option("checked");
                                // 清空已经配置的健康检查项
                                aData.checkPath = "";
                                aData.responseTime = "";
                                aData.checkInterval = "";
                                aData.healthyThreshold = "";
                                aData.unhealthyThreshold = "";
                                $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                            // 硬件vlb时，健康检查必选
                            if (workingMode === 'high') {
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
                                "value": [{
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                }, {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }],
                                "width": "120",
                                "change": function () {
                                    aData.policy = $("#httpsPolicySel" + iDataIndex).widget().getSelectedId();
                                    $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
                                }
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).append(optNode);

                            // 健康检查配置
                            var certificateBox = "<span><a class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a></span>";
                            var certificateBoxLink = $compile(certificateBox);

                            var certificateBoxScope = $scope.$new();
                            certificateBoxScope.config = function () {
                                // 对于证书修改时  需要调用单独的证书接口
                                var param = {
                                    "parmMonitor": aData,
                                    "rowIndex": iDataIndex,
                                    "needBindCer": true,
                                    "lbID": lbID
                                };
                                var options = {
                                    "winId": "configCertificateWindow",
                                    title: i18n.lb_term_setCertificate_button,
                                    "param": param,
                                    height: "320px",
                                    width: "540px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/create/configCertificate.html",
                                    "buttons": null,
                                    "close": function () {
                                        $scope.info.httpsMonitorConfigTable.data[iDataIndex] = aData;
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
                        "columns": [{
                            "sTitle": i18n.service_term_servicePort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.stickySession);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle":  i18n.sys_term_healthCheckup_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.healthCheck);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.distPolicy);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            // 会话保持配置
                            var sessionBoxScope = $scope.$new();
                            sessionBoxScope.checked = aData.sessionChecked;
                            sessionBoxScope.id = "tcpSessionConfigChecked" + iDataIndex;
                            sessionBoxScope.change = function () {
                                var sessionBoxDom = $("#" + sessionBoxScope.id);
                                aData.sessionChecked = sessionBoxDom.widget().option("checked");
                                sessionBoxScope.checked = sessionBoxDom.widget().option("checked");
                                // 清空配置的session
                                aData.sessionMode = "";
                                aData.timeout = "";
                                $scope.info.tcpMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.tcpMonitorConfigTable.data[iDataIndex] = aData;
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
                                var healthCheckDom = $("#" + healthCheckBoxScope.id);
                                aData.healthCheckChecked = healthCheckDom.widget().option("checked");
                                healthCheckBoxScope.checked = healthCheckDom.widget().option("checked");
                                // 清空已经配置的健康检查项
                                aData.checkPath = "";
                                aData.responseTime = "";
                                aData.checkInterval = "";
                                aData.healthyThreshold = "";
                                aData.unhealthyThreshold = "";
                                $scope.info.tcpMonitorConfigTable.data[iDataIndex] = aData;
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
                                        $scope.info.tcpMonitorConfigTable.data[iDataIndex] = aData;
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            var healthCheckBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox><a ng-if='checked' class='margin-horizon-beautifier btn-link' ng-click='config()'>" + i18n.common_term_config_button + "</a><a ng-if='!checked' class='margin-horizon-beautifier disabled'>" + i18n.common_term_config_button + "</a></div>";
                            // 硬件vlb时，健康检查必选
                            if (workingMode === 'high') {
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
                                "value": [{
                                    "selectId": "0",
                                    "label": i18n.lb_term_poolingMode_label,
                                    "checked": aData.policy + "" === "0"
                                }, {
                                    "selectId": "1",
                                    "label": i18n.lb_term_minConnectMode_label,
                                    "checked": aData.policy + "" === "1"
                                }],
                                "width": "120",
                                "change": function () {
                                    aData.policy = $("#tcpPolicySel" + iDataIndex).widget().getSelectedId();
                                    $scope.info.tcpMonitorConfigTable.data[iDataIndex] = aData;
                                }
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).append(optNode);
                        }
                    },
                    okBtn: {
                        "id": "create-vlb-configmonitor-next",
                        "text": i18n.common_term_ok_button,
                        "click": function () {
                            var tmp = [];
                            _.each($scope.info.httpMonitorConfigTable.data, function (data) {
                                tmp.push(data);
                            });
                            _.each($scope.info.httpsMonitorConfigTable.data, function (data) {
                                tmp.push(data);
                            });
                            _.each($scope.info.tcpMonitorConfigTable.data, function (data) {
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
                                }
                            }

                            var deferred = $scope.vlbServiceInst.updateListener({
                                "vdcId": user.vdcId,
                                "cloudInfraId": cloudInfraId,
                                "userId": user.id,
                                "lbID": lbID,
                                "listeners": transUiMonitorsToCreateReq(tmp)
                            });
                            deferred.then(function () {
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
                };

                // 根据查询得到的监听器数据，设置默认的监听器配置
                var httpListeners = [];
                var httpsListeners = [];
                var tcpListeners = [];
                _.each(listeners, function (item) {
                    var tmp = {
                        "servicePort": item.port,
                        "backPort": item.backPort,
                        "id": item.id,
                        "stickySession": "",
                        "healthCheck": "",
                        "distPolicy": "",
                        "policy": item.distributionMode + "" // 分配模式
                    };
                    // 如果配置了session校验
                    if (item.sessionPre && item.sessionPre.sessionRemain === 1) {
                        _.extend(tmp, {
                            "sessionChecked": item.sessionPre.sessionRemain + "" === "1",
                            "timeout": item.sessionPre.sessionTime,
                            "sessionMode": item.sessionPre.sessionRemainMode + "" === "0" ? "1" : item.sessionPre.sessionRemainMode + "",
                            "cookieName": item.sessionPre.cookieName,
                            "headerName": item.sessionPre.headName
                        });
                    }

                    if (item.healthCheckInfo && item.healthCheckInfo[0]) {
                        _.extend(tmp, {
                            "healthCheckChecked": true,
                            "checkPath": item.healthCheckInfo[0].path,
                            "responseTime": item.healthCheckInfo[0].responseTime,
                            "checkInterval": item.healthCheckInfo[0].checkInterval,
                            "unhealthyThreshold": item.healthCheckInfo[0].unhealthyThreshold,
                            "healthyThreshold": item.healthCheckInfo[0].healthyThreshold
                        });
                    }

                    if ("HTTP" === item.protocol) {
                        _.extend(tmp, {
                            "protocol": "HTTP"
                        });
                        httpListeners.push(tmp);
                    }
                    if ("HTTPS" === item.protocol) {
                        _.extend(tmp, {
                            "certificateName": item.certificateName,
                            "privateKey": item.privateKey,
                            "publicKey": item.publicKeyCertificate,
                            "password": item.passWord,
                            "protocol": "HTTPS"
                        });
                        httpsListeners.push(tmp);
                    }
                    if ("TCP" === item.protocol) {
                        _.extend(tmp, {
                            "protocol": "TCP"
                        });
                        tcpListeners.push(tmp);
                    }
                });
                $scope.$apply(function () {
                    $scope.info.httpMonitorConfigTable.data = httpListeners;
                    $scope.info.httpsMonitorConfigTable.data = httpsListeners;
                    $scope.info.tcpMonitorConfigTable.data = tcpListeners;
                });

                function transUiMonitorsToCreateReq(uiMonitors) {
                    var monitorReq = [];
                    if (!uiMonitors || uiMonitors.length <= 0) {
                        return monitorReq;
                    }

                    for (var monitor in uiMonitors) {
                        if (uiMonitors.hasOwnProperty(monitor)) {
                            var tmpReq = {};

                            // 监听器权重配置（默认值）
                            tmpReq.conConnectionNum = -1;
                            tmpReq.maxThroughput = -1;
                            tmpReq.rxTraffic = 0;
                            tmpReq.txTraffic = 0;
                            tmpReq.id = uiMonitors[monitor].id;
                            tmpReq.protocol = uiMonitors[monitor].protocol;
                            tmpReq.distributionMode = uiMonitors[monitor].policy;
                            tmpReq.port = -1;
                            tmpReq.backPort = -1;
                            tmpReq.sessionPre = {
                                "sessionRemain": 0,
                                "sessionRemainMode": "-1",
                                "sessionTime": "-1"
                            };

                            // 配置了会话保持
                            if (uiMonitors[monitor].sessionChecked) {
                                tmpReq.sessionPre.sessionRemain = 1;

                                // 植入COOKIE
                                if (uiMonitors[monitor].sessionMode + "" === "1") {
                                    tmpReq.sessionPre.sessionRemainMode = "0";
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //PASSIVE_COOKIE
                                if (uiMonitors[monitor].sessionMode + "" === "2") {
                                    tmpReq.sessionPre.sessionRemainMode = "2";
                                    tmpReq.sessionPre.cookieName = uiMonitors[monitor].cookieName;
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //SOURCE_ADDRES
                                if (uiMonitors[monitor].sessionMode + "" === "3") {
                                    tmpReq.sessionPre.sessionRemainMode = "3";
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //HEADER
                                if (uiMonitors[monitor].sessionMode + "" === "4") {
                                    tmpReq.sessionPre.sessionRemainMode = "4";
                                    tmpReq.sessionPre.headName = uiMonitors[monitor].headerName;
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                            }

                            // 设置了健康检查 或者硬件时
                            if (uiMonitors[monitor].healthCheckChecked || workingMode === 'high') {
                                tmpReq.healthCheckInfo = [];
                                tmpReq.healthCheckInfo.push({
                                    "checkPort": uiMonitors[monitor].backPort,
                                    "path": uiMonitors[monitor].checkPath,
                                    "responseTime": uiMonitors[monitor].responseTime,
                                    "checkInterval": uiMonitors[monitor].checkInterval,
                                    "healthCheckType": uiMonitors[monitor].protocol,
                                    "unhealthyThreshold": uiMonitors[monitor].unhealthyThreshold,
                                    "healthyThreshold": uiMonitors[monitor].healthyThreshold
                                });
                            }

                            //如果是https 需要配置证书相关信息
                            if ("HTTPS" === uiMonitors[monitor].protocol) {
                                tmpReq.certificateName = "-1";
                                tmpReq.privateKey = "-1";
                                tmpReq.publicKeyCertificate = "-1";
                                tmpReq.passWord = "-1";
                            }
                            monitorReq.push(tmpReq);
                        }
                    }
                    return monitorReq;
                }
            }
        ];
        var dependency = [
            "ng", "wcc"
        ];
        var modListenersConfigWindow = angular.module("modListenersConfigWindow", dependency);
        modListenersConfigWindow.controller("modListenersCtrl", ctrl);
        modListenersConfigWindow.service("camel", http);
        modListenersConfigWindow.service("exception", exception);

        return modListenersConfigWindow;
    });
