define(['tiny-lib/angular',
    "tiny-widgets/Window",
    "tiny-widgets/CirqueChart",
    "app/services/messageService",
    "app/services/exceptionService",
    "app/services/commonService",
    "app/business/resources/services/monitorService",
    "app/business/resources/services/hardwareService",
    "app/business/resources/controllers/device/constants",
    "language/dataanalytics-exception",
    "app/services/competitionConfig",
    "fixtures/clusterFixture",
    "fixtures/deviceFixture",
    "fixtures/monitorAlarmFixture"
],
    function (angular, Window, CirqueChart, MessageService, ExceptionService, commonService, monitorService, HardwareService, deviceConstants, dataanalyticsException, Competition) {
        "use strict";
        var summaryCtrl = ['$scope', '$state', 'camel', function ($scope, $state, camel) {
            var user = $("html").scope().user;
            $scope.competition = Competition;
            $scope.alarmInfo = {"critical": 0, "major": 0, "minor": 0, "warning": 0};
            $scope.isLocal = $scope.deployMode === "local";

            $scope.basicInfo = {
                name: {
                    "label": $scope.i18n.common_term_name_label + ":"
                },
                description: {
                    "label": $scope.i18n.common_term_desc_label + ":"
                },
                no: {
                    "label": $scope.i18n.common_term_Number_label + ":"
                },
                model: {
                    "label": $scope.i18n.device_term_model_label + ":"
                },
                status: {
                    "label": $scope.i18n.common_term_status_label + ":"
                },
                resourceStatus: {
                    "label": $scope.i18n.resource_term_resourceStatus_label + ":"
                },
                isMaint: {
                    "label": $scope.i18n.virtual_host_view_para_mainten_label + ":"
                },
                mmIp: {
                    "label": $scope.i18n.common_term_managerIP_label + ":"
                },
                bmcIp: {
                    "label": $scope.i18n.device_term_BMCip_label + ":"
                },
                imc: {
                    "label": $scope.i18n.virtual_term_IMCmode_label + ":"
                }
            };
            var hostAction = deviceConstants.config.HOST_ACTION;
            var powerMode = deviceConstants.config.POWER_MODE;

            $scope.operator = {
                viewTopology: {
                    "id": "viewTopology",
                    "text": $scope.i18n.common_term_checkTopo_button,
                    "focused": false,
                    "click": function () {
                    }},
                powerOn: {
                    "id": "powerOn",
                    "text": $scope.i18n.common_term_on_button,
                    "focused": false,
                    "click": function () {
                        var params = {
                            "serverId": $scope.hostInfo.uhmServerId,
                            "powerMode": powerMode.SAFE,
                            "key": "POWERON"
                        }
                        $scope.operate.hostAction(params);
                    }},
                forciblyRestart: {
                    "id": "forciblyRestart",
                    "text": $scope.i18n.common_term_forciblyRestart_button,
                    "focused": false,
                    "click": function () {
                        var params = {
                            "serverId": $scope.hostInfo.uhmServerId,
                            "key": "REBOOT",
                            "powerMode": powerMode.FORCE
                        }
                        $scope.operate.hostAction(params);
                    }},
                forciblyDown: {
                    "id": "forciblyDown",
                    "text": $scope.i18n.common_term_forciblyDown_button,
                    "focused": false,
                    "click": function () {
                        var params = {
                            "serverId": $scope.hostInfo.uhmServerId,
                            "key": "POWEROFF",
                            "powerMode": powerMode.FORCE
                        }
                        $scope.operate.hostAction(params);
                    }},
                setAntivirus: {
                    "id": "setAntivirus",
                    "text": $scope.i18n.device_term_setAntivirus_button,
                    "focused": false,
                    "click": function () {
                        antiVirus();
                    }}
            };

            var portTableColumns = [
                {
                    "sTitle": "",
                    "sWidth": "13px",
                    "mData": "",
                    "bSearchable": false,
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "25%",
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_duplexMode_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.duplexMode);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_speedRate_label + "(Gbps)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.spec);
                    },
                    "sWidth": "25%",
                    "bSortable": false}
            ];
            $scope.portTable = {
                "id": "portTableId",
                "data": [],
                "lengthChange": true,
                "enablePagination": false,
                "columns": portTableColumns,
                "lengthMenu": [10, 20, 50],
                "curPage": {"pageIndex": 1},
                "columnsDraggable": false,
                "showDetails": true,
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //列表的下钻详情处理
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    $(nRow).attr("lineNum", iDataIndex);
                    $(nRow).attr("hostId", $.encoder.encodeForHTML($scope.params.hostId));
                    $(nRow).attr("hostName", $.encoder.encodeForHTML(aData.name));

                    var statusStr = '';
                    var spec = '-';
                    if (aData.status == '0') {
                        statusStr = $scope.i18n.common_term_linked_value;
                        spec = commonService.precision2(aData.spec);
                    } else {
                        statusStr = $scope.i18n.common_term_noLink_value;
                        spec = (aData.spec == 0) ? '-' : commonService.precision2(aData.spec);
                    }
                    $("td:eq(3)", nRow).html(statusStr);
                    $("td:eq(4)", nRow).html(spec);
                }
            };

            //获取主机的监控容量信息
            function getCapacity() {
                var value = monitorService.getCapacity($scope.params.hostId, null, "host", ["cpu_capacity", "mem_capacity"], function (value) {
                    if (value.success) {
                        $scope.$apply(function () {
                            var map = value.data;
                            var cpuCap = map.cpu_capacity;
                            $scope.cpu_availableCapacity = cpuCap.availableCapacity;
                            $scope.cpu_totalCapacity = cpuCap.totalCapacity;
                            $scope.cpu_reserveCapacity = cpuCap.reserveCapacity;
                            $scope.cpu_reserveRate = monitorService.percentage(cpuCap.reserveCapacity, cpuCap.totalCapacity);

                            var memCap = map.mem_capacity;
                            $scope.mem_availableCapacity = memCap.availableCapacity;
                            $scope.mem_totalCapacity = memCap.totalCapacity;
                            $scope.mem_reserveCapacity = memCap.reserveCapacity;
                            $scope.mem_reserveRate = monitorService.percentage(memCap.reserveCapacity, memCap.totalCapacity);
                        });
                    } else {
                    }
                });
            };
            //获取主机的监控信息
            function getMonitor() {
                var value = monitorService.getMonitor($scope.params.hostId, null, "host", ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out",
                    "disk_io_in", "disk_io_out", "net_receive_pkg_rate", "net_send_pkg_rate"], function (value) {
                    if (value.success) {
                        $scope.$apply(function () {
                            var map = value.data;
                            $scope.cpuUsedRate = map.cpu_usage;
                            $scope.memUsedRate = map.mem_usage;
                            $scope.diskUsedRate = map.disk_usage;
                            $scope.disk_io_in = map.disk_io_in;
                            $scope.disk_io_out = map.disk_io_out;
                            $scope.nic_byte_in = map.nic_byte_in;
                            $scope.nic_byte_out = map.nic_byte_out;
                            $scope.net_receive_pkg_rate = map.net_receive_pkg_rate;
                            $scope.net_send_pkg_rate = map.net_send_pkg_rate;
                        });
                    } else {
                    }
                });
            };
            /*刷新网口使用圆环图*/
            function initPortChart(connect, unConnect) {
                var azData = [
                    {
                        value: connect,
                        name: $scope.i18n.common_term_linked_value,
                        color: "#5ecc49",
                        tooltip: $scope.i18n.common_term_used_value
                    },
                    {
                        value: unConnect,
                        name: $scope.i18n.common_term_noLink_value,
                        color: "#ffa235",
                        tooltip: $scope.i18n.common_term_noUse_value
                    }
                ];
                //圆环图
                $scope.allPortNum = parseInt(connect) + parseInt(unConnect);
                if ($scope.allPortNum != 0) {
                    var options = {
                        "id": "chartDivId",
                        "centerText": "",
                        "percent": false,
                        "r": 80,
                        "data": azData
                    };
                    var c = new CirqueChart(options);
                }
            };

            /*初始化网口信息*/
            function initPort() {
                var hardwareKey = ["host.eth.info", "host.eth.performance"];
                HardwareService.getHostHardwareInfos($scope.params.hostId, hardwareKey, user, function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            var data = [];
                            var tagArrs = HardwareService.getNetPortInfos(result.data);
                            var up = 0;
                            var down = 0;
                            for (var item in tagArrs) {
                                var obj = tagArrs[item];
                                tagArrs[item].detail = {
                                    contentType: "url",
                                    content: "app/business/resources/views/device/host/hostDetail/summaryPortDetail.html"
                                };
                                if (tagArrs[item].status == '0') {
                                    up++;
                                } else {
                                    down++;
                                }
                                data.push(tagArrs[item]);
                            }
                            $scope.portTable.data = data;
                            initPortChart(up, down);
                        });
                    }
                });
            };

            function antiVirus() {
                var newWindow = new Window({
                    "winId": "antiVirusWindow",
                    "title": $scope.i18n.device_term_setAntivirus_button,
                    "hostId": $scope.params.hostId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/host/antiVirus.html",
                    "height": 200,
                    "width": 400,
                    "close": function () {
                    }
                });
                newWindow.show();
            }

            //获取主机下的虚拟机状态
            function getVmStatus(params) {
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/vms/statistics", o: {"tenant_id": "1"}},
                    "userId": $("html").scope().user.id,
                    "timeout": 30000,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $scope.vmStatus = [
                        {
                            value: response.runningQuantity,
                            name: $scope.i18n.common_term_running_value,
                            color: "#5ecc49",
                            tooltip: $scope.i18n.common_term_running_value
                        },
                        {
                            value: response.faultQuantity,
                            name: $scope.i18n.common_term_trouble_label,
                            color: "#fc5043",
                            tooltip: $scope.i18n.common_term_trouble_label
                        }
                    ];
                    $scope.$digest();

                });
            }

            //获取告警信息
            function getAlarm() {
                var params = {"conditionList": [
                    {
                        "staticType": ["critical", "major", "minor", "warning"],
                        "staticCond": {"moc": "host", "objectId": $scope.params.hostId}
                    }
                ]};
                var queryConfig = deviceConstants.rest.ALARM_QUERY;
                if($scope.isLocal)
                {
                    queryConfig.url = "/goku/rest/v1.5/fault/{tenant_id}/alarms/statistic";
                }
                var deferred = camel.post({
                    "url": {s: queryConfig.url, o: {"tenant_id": "1"}},
                    "type": queryConfig.type,
                    "userId": $("html").scope().user.id,
                    "params": JSON.stringify(params)
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        if (response && response.value[0] && response.value[0].staticType) {
                            $scope.alarmInfo.critical = response.value[0].staticType['critical'];
                            $scope.alarmInfo.major = response.value[0].staticType['major'];
                            $scope.alarmInfo.minor = response.value[0].staticType['minor'];
                            $scope.alarmInfo.warning = response.value[0].staticType['warning'];
                        }
                    });
                });
                deferred.fail(function (response) {
                });
            };
            $scope.operate = {
                "goToAlarm": function (level) {
                    $state.go("monitor.alarmlist", {"severity": level, "resourceid": $scope.params.hostId, moc: $scope.params.type, "alarmtype": 1});
                },
                //主机操作，包括上电下电重启
                hostAction: function (params) {
                    var actionConfig = deviceConstants.rest.HOST_ACTION;
                    var actionObj = hostAction[params.key];
                    var deferred = camel.post({
                        "url": {s: actionConfig.url, o: {"id": params.serverId, "action": actionObj.val}},
                        "type": actionConfig.type,
                        "params": JSON.stringify({"powerMode": params.powerMode}),
                        "userId": $("html").scope().user.id
                    });
                    deferred.done(function (data) {
						var tip = "";
						if(actionObj.val == "poweron"){
							tip = $scope.i18n.virtual_host_on_info_donotRepeat_msg || "完成上电需要数分钟时间，请勿重复操作。";
						}else if(actionObj.val == "poweroff"){
							tip = $scope.i18n.virtual_host_down_info_donotRepeat_msg || "完成下电需要数分钟时间，请勿重复操作。";
						}else if(actionObj.val == "reboot"){
							tip = $scope.i18n.virtual_host_restart_info_donotRepeat_msg || "完成重启需要数分钟时间，请勿重复操作。";
						}
                        new MessageService().okMsgBox(tip);
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            function getPerformance() {

                var hardwareKey = ["host.cpu.util", "host.memory.util", "host.disk.util", "host.disk.read.speed",
                    "host.disk.write.speed", "host.eth.input.speed", "host.eth.output.speed", "host.eth.input.pkgspeed", "host.eth.output.pkgspeed",
                    "host.cpu.totalfreq", "host.mem.totalsize","host.cpu.util.0","host.memory.util.0"];
                HardwareService.getHostHardwareInfos($scope.params.hostId, hardwareKey, user, function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            if (result.data && result.data.metricInfo) {
                                var info = result.data.metricInfo;
                                $scope.cpuUsedRate = precision2(getInfoObj(info['host.cpu.util']).metricValue);
                                $scope.memUsedRate = precision2(getInfoObj(info['host.memory.util']).metricValue);
                                $scope.diskUsedRate = precision2(getInfoObj(info['host.disk.util']).metricValue);
                                $scope.disk_io_in = precision2(getInfoObj(info['host.disk.write.speed']).metricValue);
                                $scope.disk_io_out = precision2(getInfoObj(info['host.disk.read.speed']).metricValue);
                                $scope.nic_byte_in = precision2(getInfoObj(info['host.eth.input.speed']).metricValue);
                                $scope.nic_byte_out = precision2(getInfoObj(info['host.eth.output.speed']).metricValue);
                                $scope.net_receive_pkg_rate = precision2(getInfoObj(info['host.eth.input.pkgspeed']).metricValue);
                                $scope.net_send_pkg_rate = precision2(getInfoObj(info['host.eth.output.pkgspeed']).metricValue);

                                //容量 ICT下只显示总量，IT下显示所有
                                if ($scope.cloudType == 'OPENSTACK') {
                                    $scope.cpu_totalCapacity = precision2(getInfoObj(info['host.cpu.totalfreq']).metricValue);

                                    var memTotal = getInfoObj(info['host.mem.totalsize']).metricValue;
                                    if (memTotal) {
                                        memTotal = parseFloat(memTotal) / 1024;
                                    }
                                    $scope.mem_totalCapacity = precision2(memTotal);
                                } else {
									$scope.cpuUsedRate0 = precision2(getInfoObj(info['host.cpu.util.0']).metricValue);
									$scope.memUsedRate0 = precision2(getInfoObj(info['host.memory.util.0']).metricValue);

                                    var cpuTotal = getInfoObj(info['host.cpu.total'].metricValue);
                                    $scope.cpu_totalCapacity = precision2(cpuTotal);
                                    $scope.cpu_reserveCapacity = precision2(getInfoObj(info['host.cpu.reserve']).metricValue);
                                    $scope.cpu_availableCapacity = precision2($scope.cpu_totalCapacity - $scope.cpu_reserveCapacity);
                                    $scope.cpu_reserveRate = precision2(getReserve(cpuTotal, getInfoObj(info['host.cpu.reserve']).metricValue)) + "%";

                                    var memTotal = getInfoObj(info['host.mem.total']).metricValue;
                                    if (memTotal) {
                                        memTotal = parseFloat(memTotal);
                                    }
                                    $scope.mem_totalCapacity = precision2(memTotal);
                                    $scope.mem_reserveCapacity = precision2(getInfoObj(info['host.mem.reserve']).metricValue);
                                    $scope.mem_availableCapacity = precision2($scope.mem_totalCapacity - $scope.mem_reserveCapacity);
                                    $scope.mem_reserveRate = precision2(getReserve(memTotal, getInfoObj(info['host.mem.reserve']).metricValue)) + "%";
                                }
                            } else {
                                var defaultValue = precision2(0);
								$scope.cpuUsedRate = defaultValue;
								$scope.memUsedRate = defaultValue;
                                $scope.cpuUsedRate0 = defaultValue;
                                $scope.memUsedRate0 = defaultValue;
                                $scope.diskUsedRate = defaultValue;
                                $scope.disk_io_in = defaultValue;
                                $scope.disk_io_out = defaultValue;
                                $scope.nic_byte_in = defaultValue;
                                $scope.nic_byte_out = defaultValue;
                                $scope.net_receive_pkg_rate = defaultValue;
                                $scope.net_send_pkg_rate = defaultValue;
                                $scope.cpu_totalCapacity = defaultValue;
                                $scope.cpu_reserveCapacity = defaultValue;
                                $scope.cpu_availableCapacity = defaultValue;
                                $scope.cpu_reserveRate = defaultValue + "%";
                                $scope.mem_totalCapacity = defaultValue;
                                $scope.mem_reserveCapacity = defaultValue;
                                $scope.mem_availableCapacity = defaultValue;
                                $scope.mem_reserveRate = defaultValue + "%";
                            }
                        });
                    }
                });
            }

            function getInfoObj(infoItem) {
                return (infoItem) ? infoItem : {"metricValue": 0};
            }

            function getReserve(total, reserve) {
                if (0 == total) {
                    return 0;
                }
                total = parseFloat(total);
                reserve = parseFloat(reserve);
                return reserve / total * 100;
            }

            function precision2(numberStr) {
                var number = 0;
                try {
                    if (numberStr) {
                        number = new Number(numberStr);
                    }
                } catch (error) {
                }
                return number.toFixed(2);
            };

            function getCapacityAndMonitor() {
                getPerformance();
            };
            if (!Competition.isBaseOnVmware && $scope.privilege['perform_term_monitor_label.107001']) {
                getCapacityAndMonitor();
            }
            if ($scope.hostInfo.hypervisorId != 0 && $scope.cloudType != 'OPENSTACK') {
                getVmStatus({"queryInSystem": false,
                    "hostId": $scope.params.hostId});
            }
            initPort();
            getAlarm();
        }];
        return summaryCtrl;
    });

