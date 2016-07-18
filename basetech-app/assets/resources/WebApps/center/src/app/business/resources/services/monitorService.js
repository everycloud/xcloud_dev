
define(["jquery", "tiny-lib/angular", "app/services/httpService"], function ($, angular, httpService) {
    var lang = {zh: "zh_CN", en: "en_US"};
    var locale = lang[window.urlParams.lang];
    function UTC2Local(utcLong) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return parseInt(utcLong) - offset;
    }
    function local2UTC(localLong) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return parseInt(localLong) + offset;
    }
    var service = {
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
            sDate.setMonth(month - 1);// 设置 Date 对象中月份 (0 ~ 11)。 1 3
            sDate.setFullYear(year);// 设置 Date 对象中的年份（四位数字）。 1 4
            sDate.setHours(hour);//设置 Date 对象中的小时 (0 ~ 23)。 1 3
            sDate.setMinutes(mins);//设置 Date 对象中的分钟 (0 ~ 59)。 1 3
            sDate.setSeconds(ss);//设置 Date 对象中的秒钟 (0 ~ 59)。 1 3
            return sDate.getTime();
        },
        "getLocalTime": function (dateStr) {
            //2014-04-03 15:31:15
            var year = dateStr.substr(0, 4);
            var month = dateStr.substr(5, 2);
            var day = dateStr.substr(8, 2);
            var hour = dateStr.substr(11, 2);
            var mins = dateStr.substr(14, 2);
            var ss = dateStr.substr(17, 2);
            var sDate = new Date();
            sDate.setDate(day);
            sDate.setMonth(month - 1);// 设置 Date 对象中月份 (0 ~ 11)。 1 3
            sDate.setFullYear(year);// 设置 Date 对象中的年份（四位数字）。 1 4
            sDate.setHours(hour);//设置 Date 对象中的小时 (0 ~ 23)。 1 3
            sDate.setMinutes(mins);//设置 Date 对象中的分钟 (0 ~ 59)。 1 3
            sDate.setSeconds(ss);//设置 Date 对象中的秒钟 (0 ~ 59)。 1 3
            return UTC2Local(sDate.getTime());
        },
        "getFormatDateByLong": function (l)
        {
            var curDate = new Date(l);

            var dateStr = curDate.getFullYear() + "-";
            if(curDate.getMonth() + 1< 10){
                dateStr = dateStr + "0" + (curDate.getMonth() + 1) + "-";
            }
            else{
                dateStr = dateStr + (curDate.getMonth() + 1) + "-";
            }
            if(curDate.getDate() < 10){
                dateStr = dateStr + "0" + curDate.getDate() + " ";
            }
            else{
                dateStr = dateStr + curDate.getDate() + " ";
            }
            if(curDate.getHours() < 10){
                dateStr = dateStr + "0" + curDate.getHours() + ":";
            }
            else{
                dateStr = dateStr + curDate.getHours() + ":";
            }
            if(curDate.getMinutes() < 10){
                dateStr = dateStr + "0" + curDate.getMinutes() + ":";
            }
            else{
                dateStr = dateStr + curDate.getMinutes() + ":";
            }
            if(curDate.getSeconds() < 10){
                dateStr = dateStr + "0" + curDate.getSeconds();
            }
            else{
                dateStr = dateStr + curDate.getSeconds();
            }

            return dateStr;

        },
        //计算百分比
        "percentage": function (num, total) {
            if (num == 0 || total == 0) {
                return "0.0%";
            }
            return (Math.round(num / total * 10000) / 100.00 + "%"); //小数点后两位百分比
        },
        "export": function (paramConfig, callback) {
            var value = {};
            var camel = new httpService();
            var defe = camel.post({
                "url": "/goku/rest/v1.5/irm/monitors/file?locale=" + locale,
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
            var paramsJson = JSON.stringify(params)
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
        "kakaMonitorParams": function (objectId, parentId, objectType, metrics,cloudInfra) {
            var params = {};
            if(cloudInfra){
                params.cloudInfra = cloudInfra;
            }
            var perfMonitorBasicInfo = {};
            perfMonitorBasicInfo.objectId = objectId;
            perfMonitorBasicInfo.parentId = parentId;
            perfMonitorBasicInfo.objectType = objectType;
            perfMonitorBasicInfo.metrics = metrics;
            params.perfMonitorBasicInfo = perfMonitorBasicInfo;
            var paramsJson = JSON.stringify(params)
            return paramsJson;
        },
        //对象id，父对象id，类型,指标列表，回调
        "getMonitor": function (objectId, parentId, objectType, metrics, callback,cloudInfra) {
            var camel = new httpService();
            var value = {};
            var monitorReq = camel.post({
                url: "/goku/rest/v1.5/irm/monitors/realtime",
                "params": this.kakaMonitorParams(objectId, parentId, objectType, metrics,cloudInfra),
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
        "getHistoryMonitor": function (paramConfig, callback) {
            var value = {};
            var camel = new httpService();
            var defe = camel.post({
                "url": "/goku/rest/v1.5/irm/monitors/history",
                "params": this.kakaInitHistoryMonitorParams(paramConfig),
                "timeout": 60000,
                "userId": $("html").scope().user.id
            });
            defe.done(function (response) {
                var metrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_usage", "storage_usage", "storage_allocation",
                    "mem_reserve", "net_receive_pkg_rate", "net_send_pkg_rate", "cpu_capacity", "mem_capacity",
                    "disk_in_ps", "disk_out_ps", "cpu_ready_time", "disk_read_delay", "disk_write_delay",
                    "storage_read_ps", "storage_write_ps", "await_time", "svctm_time"];
                var map = response.hostoryMonitorMap;
                var newMap = {}
                for (var inxx in metrics) {
                    var meStr = metrics[inxx];
                    if (map[meStr]) {
                        var meArr = [];
                        for (var inx in map[meStr]) {
                            var arr = {};
                            var vv = map[meStr][inx];
                            var l = vv.time;
                            arr.time = vv.time;
                            arr.value = vv.value;
                            meArr.push(arr);
                        }
                        newMap[meStr] = meArr;
                    }
                }
                value.data = newMap;
                value.success = true;
                callback(value);
            });
            defe.fail(function (data) {
                value.success = false;
                value.data = data;
                callback(value);
            });
        },
        /*查询存储的TOP主机，主机的TOP存储*/
        "getTopnDatastore": function (paramConfig, callback) {
            var value = {};
            var camel = new httpService();
            var defe = camel.post({
                "url": "/goku/rest/v1.5/irm/monitors/topndatastore",
                "params": JSON.stringify(paramConfig),
                "userId": $("html").scope().user.id
            });
            defe.done(function (response) {
                //将返回的UTC毫秒数转换为本地毫秒数
                var metrics = ["storage_read_ps", "storage_write_ps", "await_time", "svctm_time"];
                var map = response;
                value.data = map.topnDataStoreMap;
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
