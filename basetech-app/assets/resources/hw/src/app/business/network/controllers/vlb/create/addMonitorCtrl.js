/* global define*/
define(["tiny-lib/jquery",
    "tiny-widgets/Window",
    "app/services/messageService",
    "tiny-lib/underscore"
], function ($, Window, messageService, _) {
    "use strict";
    var ctrl = ["$scope", "$compile", "camel",
        function ($scope, $compile, camel) {
            var messageServiceIns = new messageService();
            var i18n = $scope.i18n;
            $scope.info = {
                createBtn: {
                    "id": "create-vlb-addmonitor-btn",
                    "text": i18n.lb_term_addListen_button,
                    "click": function () {
                        if ($scope.info.monitorTable.data.length >= 5) {
                            messageServiceIns.failMsgBox(i18n.lb_lb_add_info_listenMax_msg);
                            return;
                        }
                        var newMonitor = {};
                        var usedServicePorts = [];
                        var usedBackPorts = [];
                        _.each($scope.info.monitorTable.data, function (item) {
                            usedServicePorts.push(item.extendPort);
                            usedBackPorts.push(item.backendPort);
                        });
                        var options = {
                            "winId": "createMonitorWindow",
                            "monitorData": newMonitor,
                            "usedServicePorts": usedServicePorts,
                            "usedBackPorts": usedBackPorts,
                            "LBPerformance": $scope.service.workingMode.value, // 取值: high,low 对应硬件和软件
                            title: i18n.lb_term_addListen_button,
                            height: "270px",
                            width: "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/create/addMonitorWindow.html",
                            "buttons": null,
                            "close": function () {
                                if (newMonitor.protocol) {
                                    var monitors = [];
                                    var oldMonitors = $scope.info.monitorTable.data;
                                    for (var data in oldMonitors) {
                                        if (oldMonitors.hasOwnProperty(data)) {
                                            monitors.push(oldMonitors[data]);
                                        }
                                    }
                                    monitors.push(newMonitor);
                                    $scope.$apply(function () {
                                        $scope.info.monitorTable.data = monitors; //关闭窗口时，刷新表格
                                    });
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                monitorTable: {
                    "id": "create-vlb-addmonitor-listtable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [{
                        "sTitle": i18n.common_term_protocol_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.protocol);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.lb_term_pairIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.extendPort);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.lb_term_backendProtocol_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.backendProtocol);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.lb_term_backendPort_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.backendPort);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opt",
                        "sWidth": "10%",
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();
                        optScope.modify = function () {
                            var param = {
                                "modMonitor": aData,
                                "rowIndex": iDataIndex,
                                "LBPerformance": $scope.service.workingMode.value // 取值: high,low 对应硬件和软件
                            };
                            var options = {
                                "winId": "modifyMonitorWindow",
                                title: i18n.app_term_modifyListenCfg_button,
                                rowData: param,
                                height: "270px",
                                width: "600px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/create/modifyMonitorWindow.html",
                                "buttons": null,
                                "close": function () {
                                    var monitors = [];
                                    var oldMonitors = $scope.info.monitorTable.data;
                                    for (var data in oldMonitors) {
                                        if (oldMonitors.hasOwnProperty(data)) {
                                            monitors.push(oldMonitors[data]);
                                        }
                                    }
                                    monitors[param.rowIndex] = param.modMonitor;
                                    $scope.$apply(function () {
                                        $scope.info.monitorTable.data = monitors; //关闭窗口时，刷新表格
                                    });
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        optScope.remove = function () {
                            $scope.info.monitorTable.data = _.reject($scope.info.monitorTable.data, function (item, index) {
                                return index === iDataIndex;
                            });
                        };
                        // 操作
                        var opt = "<div><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a><a class='margin-horizon-beautifier btn-link' ng-click='remove()'>" + i18n.common_term_delete_button + "</a> </div>";
                        var optLink = $compile(opt);

                        var optNode = optLink(optScope);
                        $("td:eq(4)", nRow).append(optNode);
                    }
                },
                preBtn: {
                    "id": "create-vlb-addmonitor-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basic";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vlb-addmonitor-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {

                        // 根据配置的监控器数据初始化前后端端口；其中前端端口用于相关配置（下一步）；后端端口用户虚拟机绑定（下下一步）
                        var monitors = $scope.info.monitorTable.data;

                        // 保存监控器信息
                        var tmpMonitors = [];

                        //前端端口汇聚
                        var tmpHttp = [];
                        var tmpHttps = [];
                        var tmpTcp = [];

                        //后端端口汇聚
                        var backPortsHttp = [];
                        var backPortsHttps = [];
                        var backPortsTcp = [];
                        _.each(monitors, function (monitor) {
                            tmpMonitors.push(monitor);
                            // 前端端口临时对象
                            var confMonitor = {
                                "servicePort": monitor.extendPort,
                                "backPort": monitor.backendPort,
                                "stickySession": "",
                                "healthCheck": "",
                                "distPolicy": "",
                                "protocol": "",
                                "policy": "0"
                            };
                            // 后端端口临时对象
                            var backPort = {
                                "backPort": monitor.backendPort,
                                "ip": "",
                                "vmName": "",
                                "vmId": "",
                                "appName": "",
                                "opt": ""
                            };
                            // 硬件vlb时，健康检查必选
                            if ($scope.service.workingMode.value === 'high') {
                                confMonitor.healthCheckChecked = true;
                            }

                            // http类型
                            if ("HTTP" === monitor.protocol) {
                                //是否已经在配置列表中，点击上一步时需要保存已经填写的内容
                                var isConfigedHttp = false;
                                _.each($scope.service.httpMonitorConfigTable, function (item) {
                                    if (monitor.extendPort + "" === item.servicePort + "") {
                                        isConfigedHttp = true;
                                        tmpHttp.push(item);
                                    }
                                });
                                if (!isConfigedHttp) {
                                    confMonitor.protocol = "HTTP";
                                    tmpHttp.push(confMonitor);
                                }

                                // 是否已经在配置列表中，点击上一步时需要保存已经填写的内容（虚拟机配置）
                                var isVmConfigedHttp = false;
                                _.each($scope.service.httpBackPorts, function (item) {
                                    if (monitor.backendPort === item.backPort) {
                                        isVmConfigedHttp = true;
                                        backPortsHttp.push(item);
                                    }
                                });
                                if (!isVmConfigedHttp) {
                                    backPort.protocol = "HTTP";
                                    backPortsHttp.push(backPort);
                                }
                            }

                            // https类型
                            if ("HTTPS" === monitor.protocol) {
                                var isConfigedHttps = false; //是否已经在配置列表中，点击上一步时需要保存已经填写的内容
                                _.each($scope.service.httpsMonitorConfigTable, function (item) {
                                    if (monitor.extendPort === item.servicePort) {
                                        isConfigedHttps = true;
                                        tmpHttps.push(item);
                                    }
                                });
                                if (!isConfigedHttps) {
                                    confMonitor.protocol = "HTTPS";
                                    // 软件vlb时，会话保持必选
                                    if ($scope.service.workingMode.value === 'low') {
                                        confMonitor.sessionChecked = true;
                                    }
                                    tmpHttps.push(confMonitor);
                                }

                                // 是否已经在配置列表中，点击上一步时需要保存已经填写的内容（虚拟机配置）
                                var isVmConfigedHttps = false;
                                _.each($scope.service.httpsBackPorts, function (item) {
                                    if (monitor.backendPort + "" === item.backPort + "") {
                                        isVmConfigedHttps = true;
                                        backPortsHttps.push(item);
                                    }
                                });
                                if (!isVmConfigedHttps) {
                                    backPort.protocol = "HTTPS";
                                    backPortsHttps.push(backPort);
                                }
                            }

                            // tcp类型
                            if ("TCP" === monitor.protocol) {
                                var isConfiged = false; //是否已经在配置列表中，点击上一步时需要保存已经填写的内容
                                _.each($scope.service.tcpMonitorConfigTable, function (item) {
                                    if (monitor.extendPort + "" === item.servicePort + "") {
                                        isConfiged = true;
                                        tmpTcp.push(item);
                                    }
                                });
                                if (!isConfiged) {
                                    confMonitor.protocol = "TCP";
                                    tmpTcp.push(confMonitor);
                                }

                                // 是否已经在配置列表中，点击上一步时需要保存已经填写的内容（虚拟机配置）
                                var isVmConfiged = false;
                                _.each($scope.service.tcpBackPorts, function (item) {
                                    if (monitor.backendPort + "" === item.backPort + "") {
                                        isVmConfiged = true;
                                        backPortsTcp.push(item);
                                    }
                                });
                                if (!isVmConfiged) {
                                    backPort.protocol = "TCP";
                                    backPortsTcp.push(backPort);
                                }
                            }
                        });

                        // 前端端口数据保存
                        $scope.service.httpMonitorConfigTable = tmpHttp;
                        $scope.service.httpsMonitorConfigTable = tmpHttps;
                        $scope.service.tcpMonitorConfigTable = tmpTcp;

                        // 后端端口数据保存
                        $scope.service.httpBackPorts = backPortsHttp;
                        $scope.service.httpsBackPorts = backPortsHttps;
                        $scope.service.tcpBackPorts = backPortsTcp;

                        // 监听器概要信息（确认页面用）
                        $scope.service.monitors = tmpMonitors;

                        $scope.service.show = "configMonitor";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-addmonitor-cancel",
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
