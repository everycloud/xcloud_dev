/**
 * 文件名：vmMonitorResourceCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-3
 */
/* global define */
define([
        'sprintf',
        "tiny-widgets/Message",
        'tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'tiny-lib/underscore',
        'app/services/httpService',
        'app/services/exceptionService',
        "app/business/ecs/services/monitorService",
        "app/business/ecs/services/vm/queryVmService",
        'tiny-directives/Lineplot'
    ],
    function (sprintf, Message, $, angular, ngSanitize, keyIDI18n, _, http, exception, monitorService, queryVmService) {
        "use strict";

        var vmMonitorResourceCtrl = ['$scope', 'camel', "exception", "$q",
            function ($scope, camel, exception, $q) {
                var user = $("html").scope().user;
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                $scope.isICT = (user.cloudType === "ICT");

                $scope.vmId = $("#ecsVmsDetailMonitorWinId").widget().option("vmId");
                $scope.cloudInfra = $("#ecsVmsDetailMonitorWinId").widget().option("cloudInfra");
                $scope.vpcId = $("#ecsVmsDetailMonitorWinId").widget().option("vpcId");

                $scope.reportUrl = null;
                var metrics = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_in_ps", "disk_out_ps", "cpu_ready_time", "disk_read_delay", "disk_write_delay"];
                var metricsICT = ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_in_ps", "disk_out_ps"];
                var chartTips = "%x<br>%s %y.2";
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var locale = window.urlParams.lang === "en" ? "en_US" : "zh_CN";
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

                //是否自定义
                $scope.isCustomized = false;
                $scope.cycle = {
                    "label": i18n.common_term_cycle_label,
                    "id": "cycleSelect",
                    "values": [{
                        selectId: 'week',
                        label: i18n.common_term_everyWeek_label,
                        checked: true
                    }, {
                        selectId: 'month',
                        label: i18n.common_term_everyMonth_label
                    }, {
                        selectId: 'year',
                        label: i18n.common_term_everyYear_label
                    }, {
                        selectId: 'custom',
                        label: i18n.common_term_custom_label
                    }],
                    "width": "120px",
                    "change": function () {
                        if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                            $scope.isCustomized = true;
                        } else {
                            $scope.isCustomized = false;
                            queryResourceMonitorData({
                                "timeRange": $("#cycleSelect").widget().getSelectedId()
                            });
                        }
                    }
                };

                $scope.customizedCycle = {
                    startDate: {
                        "id": "startDateId",
                        "type": "datetime",
                        "timeFormat": "hh:mm:ss",
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
                        "timeFormat": "hh:mm:ss",
                        "dateFormat": "yy-mm-dd",
                        "minDate": formatDate(MIN_DATE),
                        "maxDate": formatDate(),
                        "ampm": false,
                        "firstDay": 1,
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
                        "text": "OK",
                        "click": function () {
                            var startDate = $("#startDateId").widget().getDateTime();
                            var endDate = $("#endDateId").widget().getDateTime();
                            if (startDate == '' || endDate == '') {
                                var options = {
                                    type: "error",
                                    content: $scope.i18n.perform_term_inputCycle_valid || "开始、结束时间不能为空！",
                                    height: "100px",
                                    width: "350px"
                                }
                                var msg = new Message(options);
                                msg.show();
                                return;
                            }
                            var startTime = monitorService.getTime(startDate);
                            var endTime = monitorService.getTime(endDate);
                            //自定义统计时段范围是5分钟-365天  5*60*1000,365*24*60*60*1000
                            if ((parseFloat(endTime) - parseFloat(startTime)) > 365 * 24 * 60 * 60 * 1000
                                || (parseFloat(endTime) - parseFloat(startTime)) < 5 * 60 * 1000) {
                                var options = {
                                    type: "error",
                                    content: $scope.i18n.perform_term_customCycleRange_valid || "自定义统计时段范围是5分钟-365天！",
                                    height: "100px",
                                    width: "350px"
                                }
                                var msg = new Message(options);
                                msg.show();
                                return;
                            }
                            queryResourceMonitorData({
                                "startTime": startTime,
                                "endTime": endTime,
                                "timeRange": "custom"
                            });
                        }
                    }
                };
                $scope["export"] = {
                    "id": "exportBtn",
                    "text": i18n.common_term_export_button,
                    "click": function () {
                        var params = {};
                        if ('custom' === $("#cycleSelect").widget().getSelectedId()) {
                            params = {};
                            //2014-04-03 15:31:15
                            params.startTime = monitorService.getTime($("#startDateId").widget().getDateTime());
                            params.endTime = monitorService.getTime($("#endDateId").widget().getDateTime());
                            params.timeRange = "custom";
                        } else {
                            params.timeRange = $("#cycleSelect").widget().getSelectedId();
                        }
                        exportMonitor();
                    }
                };

                $scope.cpuRate = {
                    "id": "ecsVmMonitorCpuRate",
                    "data": [{
                        data: [],
                        color: "#1fbe5c"
                    }],
                    "width": "500px",
                    "height": "240px",
                    "smooth": true,
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
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
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": 100, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red"
                    }
                };

                $scope.memRate = {
                    "id": "ecsVmMonitorMemRate",
                    "data": [{
                        data: [],
                        color: "#1fbe5c"
                    }],
                    "width": "500px",
                    "height": "240px",
                    "smooth": true,
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
                    "series": {
                        "points": {
                            "show": false,
                            "symbol": "ring"
                        },
                        "lines": {
                            "show": true,
                            "steps": false
                        }
                    },
                    "xaxis": {
                        "show": true,
                        "position": "bottom",
                        "mode": "time",
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": 100, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red"
                    }
                };

                $scope.diskRate = {
                    "id": "ecsVmMonitorDiskRate",
                    "data": [{
                        data: [],
                        color: "#1fbe5c"
                    }],
                    "width": "500px",
                    "height": "240px",
                    "smooth": true,
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
                    "series": {
                        "points": {
                            "show": false,
                            "symbol": "ring"
                        },
                        "lines": {
                            "show": true,
                            "steps": false,
                            "fill": false
                        }
                    },
                    "xaxis": {
                        "show": true,
                        "position": "bottom",
                        "mode": "time",
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": 100, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 1,
                        "labelBoxBorderColor": "red"
                    }
                };

                $scope.diskIO = {
                    "id": "ecsVmMonitorDiskIO",
                    "data": [{
                        data: [],
                        color: "#1fbe5c",
                        label: i18n.common_term_diskIOwrite_label
                    }, {
                        data: [],
                        color: "#6d73e1",
                        label: i18n.common_term_diskIOread_label
                    }],
                    "width": "500px",
                    "height": "240px",
                    "smooth": true,
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
                    "series": {
                        "points": {
                            "show": false,
                            "symbol": "ring"
                        },
                        "lines": {
                            "show": true,
                            "steps": false,
                            "fill": false
                        }
                    },
                    "xaxis": {
                        "show": true,
                        "position": "bottom",
                        "mode": "time",
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        "position": "ne",
                        "noColumns": 2,
                        "labelBoxBorderColor": "red"
                    }
                };

                $scope.networkIO = {
                    "id": "ecsVmMonitorNetworkIO",
                    "data": [],
                    "width": "500px",
                    "height": "240px",
                    "smooth": true,
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
                    "series": {
                        "points": {
                            "show": false,
                            "symbol": "ring"
                        },
                        "lines": {
                            "show": true,
                            "steps": false,
                            "fill": false
                        }
                    },
                    "xaxis": {
                        "show": true,
                        "position": "bottom",
                        "mode": "time",
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        font: {
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

                //CPU等待时间
                $scope.cpuReadyTime = {
                    "id": "cpu_ready_time_id",
                    "width": "500px",
                    "height": "240px",
                    "data": [],
                    "caption": {},
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
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
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": null, //坐标轴最大值
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
                $scope.diskPs = {
                    "id": "disk_ps_id",
                    "width": "500px",
                    "height": "240px",
                    "data": [],
                    "caption": {},
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
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
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        }
                    },
                    "legend": {
                        "show": true,
                        //                    "container": null,
                        "noColumns": 2,
                        "labelBoxBorderColor": "red"
                    }
                };



                //磁盘读写时延
                $scope.diskDelay = {
                    "id": "disk_delay_id",
                    "width": "500px",
                    "height": "240px",
                    "data": [],
                    "caption": {},
                    "tips": {
                        "tipType": "hover",
                        "content": chartTips,
                        "xDateFormat":"%Y/%m/%d %h:%M:%S"
                    },
                    "grid": {
                        show: true,
                        borderWidth: {
                            top: 1,
                            right: 0,
                            bottom: 1,
                            left: 1
                        }
                    },
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
                        "ticks": 7,
                        "timeformat": "%Y/%m/%d",
                        tickLength: 6,
                        "min": null, //坐标轴最小值
                        "max": null, //坐标轴最大值
                        "font": {
                            size: 11,
                            lineHeight: 13,
                            family: "Microsoft YaHei",
                            color: "#666666"
                        },
                        ticksLengthDiffer: {
                            min: 6,
                            max: 30
                        }
                    },
                    "yaxis": {
                        "show": true,
                        "min": 0, //坐标轴最小值
                        "max": null, //坐标轴最大值
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

                function exportMonitor(request) {
                    var params = {
                        "objectId": $scope.vmId,
                        "metrics": metrics,
                        "timeRange": $("#cycleSelect").widget().getSelectedId(),
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "vpcId": $scope.vpcId || '-1',
                        "locale": locale
                    };
                    if (user.cloudType === "ICT") {
                        params.metrics = metricsICT;
                    }

                    if (params.timeRange === "custom") {
                        params.startTime = monitorService.getTime($("#startDateId").widget().getDateTime());
                        params.endTime = monitorService.getTime($("#endDateId").widget().getDateTime());
                    }
                    var deferred = queryVmServiceIns.exportMonitorData(params);
                    deferred.then(function (data) {
                        if (data.historyMonitorPath) {
                            $scope.reportUrl = "/goku/rest/v1.5/file/" + data.historyMonitorPath + "?type=export";
                            $("#downloadVmHistoryMonitor").attr("src", $scope.reportUrl);
                        }
                    });
                }

                function queryResourceMonitorData(request) {
                    if (!request) {
                        request = {};
                    }
                    request.objectId = $scope.vmId;
                    request.objectType = "vm";
                    request.metrics = metrics;
                    var oParams = {
                        "user": user,
                        "vpc_id": $scope.vpcId || '-1',
                        "cloud_infras_id": $scope.cloudInfra.id
                    };

                    if (user.cloudType === "ICT") {
                        request.metrics = metricsICT;
                    }

                    monitorService.getHistoryMonitor(oParams, request, function (value) {
                        if (!value.success) {
                            if (!exception.isException(value)) {
                                exception.doFaultPopUp();
                                return;
                            }
                            exception.doException(value);
                            return;
                        }

                        $scope.$apply(function () {
                            //CPU
                            var cpuUsageResp = value.data.cpu_usage;
                            var cpuUsageData = [];
                            var tmp;
                            var v;

                            _.each(cpuUsageResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                if(tmp > 100) {
                                    tmp = 100;
                                }
                                v = [item.time, monitorService.progressPercent(tmp)];
                                cpuUsageData.push(v);
                            });
                            $scope.cpuRate.data = [{
                                data: cpuUsageData,
                                color: "#ED9121",
                                label: i18n.perform_term_CPUusageRate_label
                            }];

                            //MEM
                            var memUsageResp = value.data.mem_usage;
                            var memUsageData = [];
                            _.each(memUsageResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                if(tmp > 100) {
                                    tmp = 100;
                                }
                                v = [item.time, monitorService.progressPercent(tmp)];
                                memUsageData.push(v);
                            });

                            $scope.memRate.data = [{
                                data: memUsageData,
                                color: "#ED9121",
                                label: i18n.perform_term_memUsageRate_label
                            }];

                            //NET IO
                            var inResp = value.data.nic_byte_in;
                            var inData = [];
                            _.each(inResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                inData.push(v);
                            });

                            var outResp = value.data.nic_byte_out;
                            var outData = [];
                            _.each(outResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                outData.push(v);
                            });

                            $scope.networkIO.data = [{
                                data: inData,
                                color: "#ED9121",
                                label: i18n.common_term_netInRate_label + " (KB/s)"
                            }, {
                                data: outData,
                                color: "#B0E0E6",
                                label: i18n.common_term_netOutRate_label + " (KB/s)"
                            }];

                            //disk IO
                            var diskInResp = value.data.disk_io_in;
                            var diskInData = [];
                            _.each(diskInResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                var v = [item.time, monitorService.progressPercent(tmp)];
                                diskInData.push(v);
                            });

                            var diskOutResp = value.data.disk_io_out;
                            var diskOutData = [];
                            _.each(diskOutResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                diskOutData.push(v);
                            });

                            $scope.diskIO.data = [{
                                data: diskInData,
                                color: "#ED9121",
                                label: i18n.common_term_diskInKbps_label
                            }, {
                                data: diskOutData,
                                color: "#B0E0E6",
                                label: i18n.common_term_diskOutKbps_label
                            }];

                            //disk 占用率
                            var diskUsageResp = value.data.disk_usage;
                            var diskUsageData = [];
                            _.each(diskUsageResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                if(tmp > 100) {
                                    tmp = 100;
                                }
                                v = [item.time, monitorService.progressPercent(tmp)];
                                diskUsageData.push(v);
                            });
                            $scope.diskRate.data = [{
                                data: diskUsageData,
                                color: "#ED9121",
                                label: i18n.perform_term_diskUsageRate_label
                            }];

                            //CPU等待时间（cpu_ready_time）
                            var cpuReadyTimeResp = value.data.cpu_ready_time;
                            var cpuReadyTimeData = [];
                            _.each(cpuReadyTimeResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                cpuReadyTimeData.push(v);
                            });
                            $scope.cpuReadyTime.data = [{
                                data: cpuReadyTimeData,
                                color: "#ED9121",
                                label: i18n.perform_term_CPUwaitS_label
                            }];

                            //磁盘I/O命令次数（disk_in_ps、disk_out_ps）
                            var diskInPsResp = value.data.disk_in_ps;
                            var diskInPsData = [];
                            _.each(diskInPsResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                diskInPsData.push(v);
                            });

                            var diskOutPsResp = value.data.disk_out_ps;
                            var diskOutPsData = [];
                            _.each(diskOutPsResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                diskOutPsData.push(v);
                            });

                            $scope.diskPs.data = [{
                                data: diskInPsData,
                                color: "#ED9121",
                                label: i18n.common_term_diskIOwriteNumS_label
                            }, {
                                data: diskOutPsData,
                                color: "#B0E0E6",
                                label: i18n.common_term_diskIOreadNumS_label
                            }];

                            //磁盘读写时延（disk_read_delay、disk_write_delay）
                            var diskReadDelayResp = value.data.disk_read_delay;
                            var diskReadDelayData = [];
                            _.each(diskReadDelayResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                v = [item.time, monitorService.progressPercent(tmp)];
                                diskReadDelayData.push(v);
                            });

                            var diskWriteDelayResp = value.data.disk_write_delay;
                            var diskWriteDelayData = [];
                            _.each(diskWriteDelayResp, function (item) {
                                tmp = parseFloat(item.value || 0);
                                var v = [item.time, monitorService.progressPercent(tmp)];
                                diskWriteDelayData.push(v);
                            });

                            $scope.diskDelay.data = [{
                                data: diskReadDelayData,
                                color: "#ED9121",
                                label: i18n.common_term_diskReadDelayS_label
                            }, {
                                data: diskWriteDelayData,
                                color: "#B0E0E6",
                                label: i18n.common_term_diskWriteDelayS_label
                            }];
                        });
                    });
                }

                queryResourceMonitorData({
                    "timeRange": "week"
                });
            }
        ];

        var vmMonitorResourceModule = angular.module("ecs.vm.detail.monitor.resource", ['ng',"wcc", "ngSanitize"]);
        vmMonitorResourceModule.controller("ecs.vm.detail.monitor.resource.ctrl", vmMonitorResourceCtrl);
        vmMonitorResourceModule.service("camel", http);
        vmMonitorResourceModule.service("exception", exception);

        return vmMonitorResourceModule;
    });
