/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-4-22

 */
define(["language/keyID"], function (i18n) {

    var result = {

        "rest": {

        },
        "config": {
            "TASK_STATUS": {
                "SUCCESS": i18n.common_term_success_value || "成功",
                "RUNNING": i18n.common_term_running_value || "运行",
                "WAITING": i18n.common_term_noStart_value || "未开始",
                "FAILED": i18n.common_term_fail_label || "失败",
                "UNKNOW": i18n.common_term_unknown_value || "未知",
                "COMPLETED": i18n.common_term_partSucceed_value || "部分成功",
                "TIMEOUT": "超时",
                "CANCELLED": i18n.common_term_cancled_value || "取消",
                "CANCELLING": i18n.common_term_cancling_value || "取消中"
            }
        },
        "constructUrl": function (s, o) {
            var subRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
            return ((s.replace) ? s.replace(subRegRex, function (match, key) {
                return (!angular.isUndefined(o[key])) ? o[key] : match;
            }) : s);
        },
        "getUportalInfo": function () {
            var key = "JSESSIONID";
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, key.length + 1) == (key + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(key.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }
    };

    result.config.UPORTAL = result.getUportalInfo();
    return result;

});

