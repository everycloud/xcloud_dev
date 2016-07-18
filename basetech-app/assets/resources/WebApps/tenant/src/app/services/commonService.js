/**
 * 公共服务
 */
define(["jquery"], function ($) {
    "use strict";

    function _UTC2Local(utcLong) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return parseInt(utcLong, 10) - offset;
    }

    function _local2UTC(localLong) {
        var date = new Date();
        var offset = date.getTimezoneOffset() * 60 * 1000;
        return parseInt(localLong, 10) + offset;
    }

    //时间格式转为毫秒数 2014-04-03 15:31:15 -> 11233445566
    function _dateStr2Milliseconds(dateStr) {
        var year = dateStr.substr(0, 4);
        var month = dateStr.substr(5, 2);
        var day = dateStr.substr(8, 2);
        var hour = dateStr.substr(11, 2);
        var mins = dateStr.substr(14, 2);
        var ss = dateStr.substr(17, 2);
        var sDate = new Date(+year, month - 1, +day, +hour, +mins, +ss);
        return sDate.getTime();
    }

    //毫秒数转为时间格式 11233445566  ->  2014-04-03 15:31:15
    function _milliseconds2DateStr(datel) {
        var curDate = new Date(datel);
        var dateStr = curDate.getFullYear() + "-";
        if (curDate.getMonth() + 1 < 10) {
            dateStr = dateStr + "0" + (curDate.getMonth() + 1) + "-";
        }
        else {
            dateStr = dateStr + (curDate.getMonth() + 1) + "-";
        }
        if (curDate.getDate() < 10) {
            dateStr = dateStr + "0" + curDate.getDate() + " ";
        }
        else {
            dateStr = dateStr + curDate.getDate() + " ";
        }
        if (curDate.getHours() < 10) {
            dateStr = dateStr + "0" + curDate.getHours() + ":";
        }
        else {
            dateStr = dateStr + curDate.getHours() + ":";
        }
        if (curDate.getMinutes() < 10) {
            dateStr = dateStr + "0" + curDate.getMinutes() + ":";
        }
        else {
            dateStr = dateStr + curDate.getMinutes() + ":";
        }
        if (curDate.getSeconds() < 10) {
            dateStr = dateStr + "0" + curDate.getSeconds();
        }
        else {
            dateStr = dateStr + curDate.getSeconds();
        }
        return dateStr;
    }

    var service = {
        "htmlEncode": function (value) {
            if (value) {
                return $('<div />').text(value).html();
            }
            return value;
        },
        "htmlDecode": function (value) {
            if (value) {
                return $('<div />').html(value).text();
            } else {
                return value;
            }
        },
        //utc时间转为本地时间 格式：2014-04-03 15:31:15
        utc2Local: function (utcDateStr) {
            if (!utcDateStr || ("" === utcDateStr)) {
                return "";
            }
            var utcTime = _dateStr2Milliseconds(utcDateStr);
            var localTime = _UTC2Local(utcTime);
            return _milliseconds2DateStr(localTime);
        },
        //本地时间转为utc时间 格式：2014-04-03 15:31:15
        local2Utc: function (localDateStr) {
            var localTime = _dateStr2Milliseconds(localDateStr);
            var utcTime = _local2UTC(localTime);
            return _milliseconds2DateStr(utcTime);
        },
        //utc时间转为本地时间 格式：毫秒数
        utcMilliseconds2Local: function (utcTime) {
            var localTime = _UTC2Local(utcTime);
            return _milliseconds2DateStr(localTime);
        },
        //utc毫秒时间转为本地毫秒时间 utcTime：整形或者字型串型的毫秒数
        utcMilliseconds2LocalMilli: function (utcTime) {
            if (!utcTime || ("" === utcTime)) {
                return "";
            }
            return _UTC2Local(utcTime);
        },
        //保留小数点后2为精度
        precision2: function (number) {
            try {
                number = parseFloat(number);
            } catch (error) {
                number = 0;
            }
            return  Math.round(number * 100) / 100;
        },
        //获取数组中每个item属性key对应的值组成的数组
        pick: function (list, key) {
            var rtn = [];
            var len = (list && list.length) || 0;
            for (var i = 0; i < len; i++) {
                var item = list[i];
                item && item[key] && rtn.push(item[key]);
            }
            return rtn;
        },

        //表格每页长度选项
        TABLE_PAGE_LENGTH_OPTIONS: [10, 20, 50],

        //默认表格每页长度
        DEFAULT_TABLE_PAGE_LENGTH: 10
    };

    return service;
});
