/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-6
 */
define(function () {
    "use strict";
    var service = function () {
        this.transferUserType = function (userType, i18n) {
            if (!userType) {
                return "";
            }
            if (userType === "NATIVE_USER") {
                return i18n.user_user_add_para_type_option_local_value || "本地用户";
            } else if (userType === "LDAP_USER") {
                return i18n.user_user_add_para_type_option_ad_value || "AD用户";
            } else {
                return "";
            }
        },
        this.transferLockStatus = function (lockStatus, i18n) {
            if (!lockStatus) {
                return "";
            }
            if (lockStatus === "LOCKED") {
                return i18n.user_term_lock_value;
            } else {
                return i18n.common_term_unlocked_value;
            }
        },
        this.transferOnLineStatus = function (onLineStatus, i18n) {
            if (!onLineStatus) {
                return "";
            }
            if (onLineStatus === "ONLINE") {
                return i18n.common_term_online_value;
            } else {
                return i18n.common_term_offline_label;
            }
        }
    };
    return service;

});
