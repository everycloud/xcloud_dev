/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-6
 */
define(function () {
    "use strict";
    var service = function () {
        this.transferUserType = function (userType) {
            if (userType === undefined || userType === "") {
                return "";
            }
            if (userType === "NATIVE_USER") {
                return "本地用户";
            } else if (userType === "LDAP_USER") {
                return "AD用户";
            } else {
                return "";
            }
        };
        this.transferLockStatus = function (lockStatus) {
            if (lockStatus === undefined || lockStatus === "") {
                return "";
            }
            if (lockStatus === "LOCKED") {
                return "锁定";
            } else if (lockStatus === "UNLOCKED") {
                return "未锁定";
            } else {
                return "";
            }
        };
        this.transferOnLineStatus = function (onLineStatus) {
            if (onLineStatus === undefined || onLineStatus === "") {
                return "";
            }
            if (onLineStatus === "ONLINE") {
                return "在线";
            } else if (onLineStatus === "OFFLINE") {
                return "离线";
            } else {
                return "";
            }
        };
    };
    return service;

});
