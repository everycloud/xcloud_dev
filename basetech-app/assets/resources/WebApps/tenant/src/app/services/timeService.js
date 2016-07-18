/**
 * 提供时间转换相关服务
 */
/*global define*/
define(["tiny-lib/angular"], function (angular) {
    "use strict";

    function timeServer() {

    }

    //将UTC时间戳 转换成 本地时间，格式如：2014-04-25 19:34:13
    timeServer.prototype.utcToLocal = function (utcMilli) {
        var date = new Date();
        var milliInHour = 1000 * 60 * 60;
        var timeZone = -(date.getTimezoneOffset() / 60);
        var localMilli = utcMilli + milliInHour * timeZone;

        var curDate = new Date(localMilli);
        var dateStr = curDate.getFullYear() + "-";
        if (curDate.getMonth() + 1 < 10) {
            dateStr = dateStr + "0" + (curDate.getMonth() + 1) + "-";
        } else {
            dateStr = dateStr + (curDate.getMonth() + 1) + "-";
        }
        if (curDate.getDate() < 10) {
            dateStr = dateStr + "0" + curDate.getDate() + " ";
        } else {
            dateStr = dateStr + curDate.getDate() + " ";
        }
        if (curDate.getHours() < 10) {
            dateStr = dateStr + "0" + curDate.getHours() + ":";
        } else {
            dateStr = dateStr + curDate.getHours() + ":";
        }
        if (curDate.getMinutes() < 10) {
            dateStr = dateStr + "0" + curDate.getMinutes() + ":";
        } else {
            dateStr = dateStr + curDate.getMinutes() + ":";
        }
        if (curDate.getSeconds() < 10) {
            dateStr = dateStr + "0" + curDate.getSeconds();
        } else {
            dateStr = dateStr + curDate.getSeconds();
        }
        return dateStr;
    };

    //格式均为 2014-6-23 16:15:00
    timeServer.prototype.localToUTCFormat = function(localTime) {
        var date = new Date(localTime);
        var year = date.getUTCFullYear();
        var month = (date.getUTCMonth() + 1) > 9 ? date.getUTCMonth() + 1 : "0" + (date.getUTCMonth() + 1);
        var mDate = date.getUTCDate() > 9 ? date.getUTCDate() : "0" + date.getUTCDate();
        var hours =  date.getUTCHours() > 9 ?  date.getUTCHours() : "0" + date.getUTCHours();
        var minutes =  date.getUTCMinutes() > 9 ?  date.getUTCMinutes() : "0" + date.getUTCMinutes();
        var seconds =  date.getUTCSeconds() > 9 ?  date.getUTCSeconds() : "0" + date.getUTCSeconds();
        return year + "-" + month + "-" + mDate + " " + hours + ":" + minutes + ":" + seconds;
    };

    timeServer.prototype.utcToLocalFormat = function(utcTime) {
        var date  = new Date(utcTime);
        var newDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        ));
        var year = newDate.getFullYear();
        var month = (newDate.getMonth() + 1) > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1);
        var mDate = newDate.getDate() > 9 ? newDate.getDate() : "0" + newDate.getDate();
        var hours =  newDate.getHours() > 9 ?  newDate.getHours() : "0" + newDate.getHours();
        var minutes =  newDate.getMinutes() > 9 ?  newDate.getMinutes() : "0" + newDate.getMinutes();
        var seconds =  newDate.getSeconds() > 9 ?  newDate.getSeconds() : "0" + newDate.getSeconds();
        return year + "-" + month + "-" + mDate + " " + hours + ":" + minutes + ":" + seconds;
    };
    return timeServer;
});