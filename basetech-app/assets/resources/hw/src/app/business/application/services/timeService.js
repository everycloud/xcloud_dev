/* global define */
define(["jquery", "tiny-lib/angular"], function ($, angular) {
    "use strict";
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
            return local2UTC(sDate.getTime());
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

        }

    };
    return service;
});

