define(['jquery',
    'tiny-lib/angular',
    "tiny-directives/DateTime",
    "tiny-directives/Lineplot",
    "fixtures/performanceFixture",
    "tiny-widgets/Columnchart",
    "tiny-directives/Progressbar",
    "tiny-widgets/Message",
    "app/business/resources/services/monitorService",
    "app/services/exceptionService"
],
    function ($, angular, DateTime, Lineplot, performanceFixture, Columnchart, Progressbar, Message, monitorService, ExceptionService) {
        "use strict";
        var monitorCtrl = ['$scope', '$state', '$stateParams', 'camel', function ($scope, $state, $stateParams, camel) {
            $scope.fromState = $stateParams.from;
            $scope.regionName=$stateParams.region;
            var user = $("html").scope().user;
            //成立时间 2011-9-26
            var MIN_DATE = new Date(2011, 8, 26);
            var formatDate = function (date) {
                date = date || new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                month < 10 && (month = "0" + month);
                day < 10 && (day = "0" + day);
                hours < 10 && (hours = "0" + hours);
                minutes < 10 && (minutes = "0" + minutes);
                seconds < 10 && (seconds = "0" + seconds);
                return [[year, month, day].join("-"),[hours, minutes, seconds].join("-")].join(" ");
            };

            $scope.opActive();
               var resourceId = $stateParams.vmId;
            //返回按钮
            $scope.return = {
                "id": "return",
                "disable": false,
                "click": function () {
                    $state.go($scope.fromState);
                }
            };
            //是否自定义
            $scope.isCustomized = false;
            $scope.cycle = {
                "label": $scope.i18n.common_term_cycle_label,
                "id": "cycleSelect",
                "values": [
                    {
                        selectId: 'week',
                        label: $scope.i18n.common_term_everyWeek_label,
                        checked: true
                    },
                    {
                        selectId: 'custom',
                        label: $scope.i18n.common_term_custom_label
                    }
                ],
                "width": "120px",
                "change": function () {
                    if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                        $scope.isCustomized = true;
                    }
                    else {
                        $scope.isCustomized = false;
                        var params = {};
                        params.timeRange = $("#cycleSelect").widget().getSelectedId();
                        $scope.operator.getHistoryMonitor(params);
                    }

                }
            };
            $scope.customizedCycle = {
                startDate: {
                    "id": "startDateId",
                    "type": "datetime",
                    "timeFormat": "hh:mm",
                    "dateFormat": "yy-mm-dd",
                    "minDate": formatDate(MIN_DATE),
                    "maxDate": formatDate(),
                    "ampm": false,
                    "firstDay": 1,
                    "onClose": function(date){
                        if(date){
                            $("#" + $scope.customizedCycle.endDate.id).widget().option("minDate", date);
                        }
                        else{
                            $("#" + $scope.customizedCycle.endDate.id).widget().option("minDate", formatDate(MIN_DATE));
                        }
                    }
                },
                endDate: {
                    "id": "endDateId",
                    "type": "datetime",
                    "timeFormat": "hh:mm",
                    "dateFormat": "yy-mm-dd",
                    "minDate": formatDate(MIN_DATE),
                    "maxDate": formatDate(),
                    "ampm": false,
                    "first-day": 1,
                    "onClose": function(date){
                        if(date){
                            $("#" + $scope.customizedCycle.startDate.id).widget().option("maxDate", date);
                        }
                        else{
                            $("#" + $scope.customizedCycle.startDate.id).widget().option("maxDate", formatDate());
                        }
                    }
                },
                okBtn: {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_query_button,
                    "click": function () {
                        var params = initCustomParam();
                        $scope.operator.getHistoryMonitor(params);
                    }
                }
            };
            $scope.export = {
                "id": "exportBtn",
                "text": $scope.i18n.common_term_export_button,
                "click": function () {
                    var params = {};
                    if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                        params = initCustomParam();
                    }else{
                        params.timeRange = $("#cycleSelect").widget().getSelectedId();
                    }
                    $scope.operator.export(params);
                }
            };

            function initCustomParam(){
                var params = {};
                var startDate = $("#startDateId").widget().getDateTime();
                var endDate = $("#endDateId").widget().getDateTime();
                if(startDate == '' || endDate == ''){
                    var options = {
                        type: "error",
                        content:  $scope.i18n.perform_term_inputCycle_valid || "开始、结束时间不能为空。",
                        height: "100px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                var startTime = monitorService.getTime(startDate);
                var endTime = monitorService.getTime(endDate);
                //自定义统计时段范围是5分钟-7天  5*60*1000,7*24*60*60*1000
                if((parseFloat(endTime) - parseFloat(startTime)) > 7*24*60*60*1000 ||
                    (parseFloat(endTime) - parseFloat(startTime)) < 5*60*1000){
                    var options = {
                        type: "error",
                        content:  $scope.i18n.perform_term_customCycleRangeMax7_valid || "自定义统计时段范围是5分钟-7天。",
                        height: "100px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                params.startTime = startTime;
                params.endTime = endTime;
                params.timeRange = "custom";
                return params;
            }

            var chartTips = "%y.2";
            $scope.cpuUsage = {
                "id": "cpuUsageLinePlot",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": 100,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#cpuUsageLegend"),
                    "noColumns": 1,
                    "labelBoxBorderColor": "red"
                }
            };
            //内存占用率
            $scope.memoUsage = {
                "id": "memoUsageLinePlot",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": 100,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#memoUsageLegend"),
                    "noColumns": 1,
                    "labelBoxBorderColor": "red"
                }
            };

            $scope.netIo = {
                "id": "netIoLinePlot",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#netIoLegend"),
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };


            $scope.diskIo = {
                "id": "diskIoLinePlot",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#diskIoLegend"),
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };

            $scope.disk_usage = {
                "id": "diskUsageLinePlot",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": 100,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#diskUsageLegend"),
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };

            //CPU等待时间
            $scope.cpu_ready_time = {
                "id": "cpu_ready_time_id",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };
            //磁盘I/O命令次数
            $scope.disk_ps = {
                "id": "disk_ps_id",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "container": $("#disk_psUsageLegend"),
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };
            //磁盘读写时延
            $scope.disk_delay = {
                "id": "disk_delay_id",
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType":"hover",
                    "content": chartTips
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };

            //查询历史监控数据
            //CPU占用率(cpu_usage)、内存占用率(mem_usage)、网络流入速率(nic_byte_in)、网络流出速率(nic_byte_out)、 磁盘I/O(disk_io_in、disk_io_out)、磁盘占用率(disk_usage)、
            // 磁盘I/O命令次数（disk_in_ps、disk_out_ps）、CPU等待时间（cpu_ready_time）、磁盘读写时延（disk_read_delay、disk_write_delay）
            var clusterHistoryMetrics = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in",
                "disk_io_out","disk_usage","disk_in_ps","disk_out_ps"];
            $scope.operator = {
                "export" : function(params){
                    params.objectId = resourceId;
                    params.objectType = "vm";
                    params.objectName = $scope.vmName;
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
                    params.cloudInfra = $scope.regionName;
                    monitorService.export(params, function (value) {
                        if (value && value.success) {
                            if(value.historyMonitorPath){
                                $scope.reportUrl = "/goku/rest/v1.5/file/" + $.encoder.encodeForURL(value.historyMonitorPath) + "?type=export";
                                $("#download").attr("src", $scope.reportUrl);
                            }
                        } else {
                            new ExceptionService().doException(value.data);
                        }
                    });
                },
                "init": function () {
                    var params = {};
                    params.startTime = null;
                    params.endTime = null;
                    params.timeRange = "week";
                    $scope.operator.getHistoryMonitor(params);
                },
                "getHistoryMonitor": function (params) {
                    params.objectType = "vm";
                    params.objectId = resourceId;
                    params.metrics = clusterHistoryMetrics;
                    params.parentId = null;
                    params.cloudInfra = $scope.regionName;
                    var paramsJson = JSON.stringify(params);
                    monitorService.getHistoryMonitor(params, function (value) {
                        if (value.success) {
                            $scope.$apply(function () {
                                //CPU
                                var cpuUsageResp = value.data.cpu_usage;
                                var cpuUsageData = [];
                                for (var inx in cpuUsageResp) {
                                    var v = [cpuUsageResp[inx].time, parseFloat(cpuUsageResp[inx].value)];
                                    cpuUsageData.push(v);
                                }
                                var cpuData = [
                                    {
                                        data: cpuUsageData,
                                        color: "#ED9121",
                                        label: ($scope.i18n.perform_term_CPUusageRate_label || "CPU使用率") +"(%)"
                                    }
                                ];
                                $scope.cpuUsage.data = cpuData;
                                //MEM
                                var memUsageResp = value.data.mem_usage;
                                var memUsageData = [];
                                for (var inx in memUsageResp) {
                                    var v = [memUsageResp[inx].time, parseFloat(memUsageResp[inx].value)];
                                    memUsageData.push(v);
                                }
                                var memoData = [
                                    {
                                        data: memUsageData,
                                        color: "#ED9121",
                                        label: ($scope.i18n.perform_term_memUsageRate_label || "内存使用率") +"(%)"
                                    }
                                ];
                                $scope.memoUsage.data = memoData;

                                //NET IO
                                var inResp = value.data.nic_byte_in;
                                var inData = [];
                                for (var inx in inResp) {
                                    var v = [inResp[inx].time, parseFloat(inResp[inx].value)];
                                    inData.push(v);
                                }
                                var outResp = value.data.nic_byte_out;
                                var outData = [];
                                for (var inx in outResp) {
                                    var v = [outResp[inx].time, parseFloat(outResp[inx].value)];
                                    outData.push(v);
                                }
                                var netIoData = [
                                    {
                                        data: inData,
                                        color: "#ED9121",
                                        label: $scope.i18n.common_term_netInRateKbps_label
                                    },
                                    {
                                        data: outData,
                                        color: "#B0E0E6",
                                        label: $scope.i18n.common_term_netOutRateKbps_label
                                    }
                                ];
                                $scope.netIo.data = netIoData;

                                //disk IO
                                var diskInResp = value.data.disk_io_in;
                                var diskInData = [];
                                for (var inx in diskInResp) {
                                    var v = [diskInResp[inx].time, parseFloat(diskInResp[inx].value)];
                                    diskInData.push(v);
                                }
                                var diskOutResp = value.data.disk_io_out;
                                var diskOutData = [];
                                for (var inx in diskOutResp) {
                                    var v = [diskOutResp[inx].time, parseFloat(diskOutResp[inx].value)];
                                    diskOutData.push(v);
                                }
                                var diskIoData = [
                                    {
                                        data: diskInData,
                                        color: "#ED9121",
                                        label: $scope.i18n.common_term_diskInKbps_label
                                    },
                                    {
                                        data: diskOutData,
                                        color: "#B0E0E6",
                                        label: $scope.i18n.common_term_diskOutKbps_label
                                    }
                                ];
                                $scope.diskIo.data = diskIoData;

                                //disk 占用率
                                var diskUsageResp = value.data.disk_usage;
                                var diskUsageData = [];
                                for (var inx in diskUsageResp) {
                                    var v = [diskUsageResp[inx].time, parseFloat(diskUsageResp[inx].value)];
                                    diskUsageData.push(v);
                                }
                                var diskData = [
                                    {
                                        data: diskUsageData,
                                        color: "#ED9121",
                                        label: ($scope.i18n.perform_term_diskUsageRate_label || "磁盘使用率") + "(%)"
                                    }
                                ];
                                $scope.disk_usage.data = diskData;


                                //磁盘I/O命令次数（disk_in_ps、disk_out_ps）
                                var disk_in_psResp = value.data.disk_in_ps;
                                var disk_in_psData = [];
                                for (var inx in disk_in_psResp) {
                                    var v = [disk_in_psResp[inx].time, parseFloat(disk_in_psResp[inx].value)];
                                    disk_in_psData.push(v);
                                }
                                var disk_out_psResp = value.data.disk_out_ps;
                                var disk_out_psData = [];
                                for (var inx in disk_out_psResp) {
                                    var v = [disk_out_psResp[inx].time, parseFloat(disk_out_psResp[inx].value)];
                                    disk_out_psData.push(v);
                                }
                                var disPsData = [
                                    {
                                        data: disk_in_psData,
                                        color: "#ED9121",
                                        label: $scope.i18n.common_term_diskIOwriteNumS_label
                                    },
                                    {
                                        data: disk_out_psData,
                                        color: "#B0E0E6",
                                        label: $scope.i18n.common_term_diskIOreadNumS_label
                                    }
                                ];
                                $scope.disk_ps.data = disPsData;

                            });
                        } else {
                            new ExceptionService().doException(value.data);
                        }
                    });
                }
            };

            //加载top实时数据
            $scope.operator.init();
        }];
        return monitorCtrl;
    });


