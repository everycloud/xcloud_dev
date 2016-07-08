define(["jquery", "tiny-lib/angular", "tiny-lib/underscore", "app/services/httpService"], function ($, angular, _, httpService) {
    "use strict";

    function UTC2Local(utcLong) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return parseInt(utcLong, 10) - offset;
    }

    function local2UTC(localMillSec) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return localMillSec + offset;
    }

    var service = {
        "getDateByMilliSec": function (milliSec) {
            if (!milliSec) {
                return "";
            }
            var d = new Date(milliSec);
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        },
        "utc2Local": function (utcLong) {
            return UTC2Local(utcLong);
        },
        "getTime": function (dateStr) {
            //2014-04-03 15:31:15
            var year = dateStr.substr(0, 4);
            var month = dateStr.substr(5, 2);
            var day = dateStr.substr(8, 2);
            var hour = dateStr.substr(11, 2);
            var mins = dateStr.substr(14, 2);
            var ss = dateStr.substr(17, 2);
            var sDate = new Date();
            sDate.setDate(day);
            sDate.setMonth(month - 1); // 设置 Date 对象中月份 (0 ~ 11)。 1 3
            sDate.setFullYear(year); // 设置 Date 对象中的年份（四位数字）。 1 4
            sDate.setHours(hour); //设置 Date 对象中的小时 (0 ~ 23)。 1 3
            sDate.setMinutes(mins); //设置 Date 对象中的分钟 (0 ~ 59)。 1 3
            sDate.setSeconds(ss); //设置 Date 对象中的秒钟 (0 ~ 59)。 1 3
            return sDate.getTime();
        },
        "getUtcTime": function (dateStr) {
            var localMillSec = this.getTime(dateStr);
            return local2UTC(localMillSec);
        },
        //计算百分比
        "percentage": function (num, total) {
            if (num === 0 || total === 0) {
                return "0.0%";
            }
            return (Math.round(num / total * 10000) / 100.00 + "%"); //小数点后两位百分比
        },
        //计算百分比  只保留百位分子，只返回小数
        "getPercentageRate": function (num, total) {
            if (num === 0 || total === 0) {
                return 0;
            }
            return Math.round(num / total * 100); //小数点后两位百分比
        },
        //progressPercent保留两位小数
        "progressPercent": function (progress) {
            return (Math.round(progress * 100) / 100.0); //小数点后两位百分比
        },
        //保留两位小数
        "precise2": function (floatString) {
            if (!floatString) {
                return 0;
            }
            var floatP = parseFloat(floatString);
            if (!floatP) {
                return 0;
            }

            return (Math.round(floatP * 100) / 100.0);
        },
        "export": function (paramConfig, callback) {
            var value = {};
            var camel = new httpService();
            var defe = camel.post({
                "url": "/goku/rest/v1.5/irm/monitors/file",
                "params": JSON.stringify(paramConfig),
                "userId": $("html").scope().user.id
            });
            defe.done(function (response) {
                value.historyMonitorPath = response.historyMonitorPath;
                value.success = true;
                callback(value);
            });
            defe.fail(function (data) {
                value.success = false;
                value.data = data;
                callback(value);
            });
        },
        /*容量信息*/
        "kakaCapacityParams": function (objectId, parentId, objectType, metrics) {
            var params = {};
            params.objectId = objectId;
            params.objectType = objectType;
            params.metrics = metrics;
            var paramsJson = JSON.stringify(params);
            return paramsJson;
        },
        "getCapacity": function (objectId, parentId, objectType, metrics, callback) {
            var camel = new httpService();
            var value = {};
            var monitorReq = camel.post({
                url: "/goku/rest/v1.5/irm/monitors/resource-capacity",
                "params": this.kakaCapacityParams(objectId, parentId, objectType, metrics),
                "userId": $("html").scope().user.id
            });
            monitorReq.done(function (response) {
                var map = response.resourceCapacityMap;
                value.data = map;
                value.success = true;
                callback(value);
            });
            monitorReq.fail(function (data) {
                value.success = false;
                value.data = data;
                callback(value);
            });
        },

        /*获取实时监控信息*/
        "kakaMonitorParams": function (objectId, parentId, objectType, metrics) {
            var params = {};
            var perfMonitorBasicInfo = {};
            perfMonitorBasicInfo.objectId = objectId;
            perfMonitorBasicInfo.parentId = parentId;
            perfMonitorBasicInfo.objectType = objectType;
            perfMonitorBasicInfo.metrics = metrics;
            params.perfMonitorBasicInfo = perfMonitorBasicInfo;
            var paramsJson = JSON.stringify(params);
            return paramsJson;
        },
        //对象id，父对象id，类型,指标列表，回调
        "getMonitor": function (objectId, parentId, objectType, metrics, callback) {
            var camel = new httpService();
            var value = {};
            var monitorReq = camel.post({
                url: "/goku/rest/v1.5/irm/monitors/realtime",
                "params": this.kakaMonitorParams(objectId, parentId, objectType, metrics),
                "userId": $("html").scope().user.id
            });
            monitorReq.done(function (response) {
                var map = response.realTimeMonitorMap;
                value.data = map;
                value.success = true;
                callback(value);
            });
            monitorReq.fail(function (data) {
                value.success = false;
                value.data = data;
                callback(value);
            });
        },

        /*查询历史监控信息*/
        "kakaInitHistoryMonitorParams": function (paramConfig) {
            var paramsStr = JSON.stringify(paramConfig);
            return paramsStr;
        },
        "getHistoryMonitor": function (oParams, paramConfig, callback) {
            var value = {};
            var camel = new httpService();
            var defe = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/monitors/history?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": oParams.user.vdcId,
                        "vpc_id":oParams.vpc_id,
                        "cloud_infras_id": oParams.cloud_infras_id
                    }
                },
                "params": this.kakaInitHistoryMonitorParams(paramConfig),
                "userId": oParams.user.id
            });
            defe.done(function (response) {
                //将返回的UTC毫秒数转换为本地毫秒数
                /*
                 集群指标： CPU占用率(cpu_usage)、内存占用率(mem_usage)、网络流入速率(nic_byte_in)(单位:KB/s)、网络流出速率(nic_byte_out)(单位:KB/s)、 CPU预留率(cpu_reserve)、
                 内存预留率 (mem_reserve)、存储分配率 (storage_allocation)、存储占用率(storage_usage)、
                 磁盘I/O(disk_io_in、disk_io_out)(单位:KB/s)、磁盘占用率(disk_usage)、网络接收包速(net_receive_pkg_rate)(单位:个/s)、网络发送包速(net_send_pkg_rate)(单位:个/s)、
                 CPU预留率(cpu_reserve)、内存预留率 (mem_reserve)、CPU容量(cpu_capacity)(单位:GB)、内存容量(mem_capacity)(单位:GB)
                 磁盘I/O命令次数（disk_in_ps、disk_out_ps）(单位:个/s)、CPU等待时间（cpu_ready_time）(单位:ms)、磁盘读写时延（disk_read_delay、disk_write_delay）(单位:ms)
                 存储设备读写次数(storage_read_ps、storage_write_ps)(单位:个/s)、 平均IO服务时间（await_time）(单位:ms)、平均存储设备处理IO时间(svctm_time)(单位:ms)
                 */
                var metrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_usage", "storage_usage", "storage_allocation",
                    "mem_reserve", "net_receive_pkg_rate", "net_send_pkg_rate", "cpu_capacity", "mem_capacity",
                    "disk_in_ps", "disk_out_ps", "cpu_ready_time", "disk_read_delay", "disk_write_delay",
                    "storage_read_ps", "storage_write_ps", "await_time", "svctm_time"
                ];
                var map = response.hostoryMonitorMap;
                var newMap = {};
                var meArr;
                var arr;
                _.each(metrics, function (item) {
                    if (map[item]) {
                        meArr = [];
                        _.each(map[item], function (itemValue) {
                            arr = {};
                            arr.time = UTC2Local(itemValue.time);
                            arr.value = itemValue.value;
                            meArr.push(arr);
                        });
                        newMap[item] = meArr;
                    }
                });

                response.hostoryMonitorMap = newMap;
                value.data = map;
                value.success = true;
                callback(value);
            });
            defe.fail(function (data) {
                value.success = false;
                value.data = data;
                callback(value);
            });
        }
    };
    return service;
});
