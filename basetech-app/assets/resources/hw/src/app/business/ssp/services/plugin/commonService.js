/**
 * 公共服务
 */
/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "language/keyID",
        "tiny-lib/underscore",
        'app/services/commonService'
], function ($, angular, keyIDI18n, _, timeCommonService) {
    "use strict";

    var i18n = keyIDI18n;
    //Register a service constructor, which will be invoked with new to create the service instance
    var commonService = function (exception) {
        // 获取当前时间(yy-mm-dd hh:mm)
        this.getCurrentTime = function () {
            var d = new Date();
            var timeStr = d.getFullYear() + "-" + appendZero(d.getMonth() + 1) + "-" + appendZero(d.getDate()) + " " + appendZero(d.getHours()) + ":" + appendZero(d.getMinutes());

            return timeStr;
        };

        // 获取30天后的日期(yy-mm-dd)
        this.get30DaysDate = function () {
            return GetDateStr(30);
        };

        // 补0函数
        function appendZero(s) {
            return ("00" + s).substr((s + "").length);
        }

        // 获取偏移AddDayCount的日期(yy-mm-dd)
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        }

        // 转换订单处理环节界面显示
        var orderActionView = {
            "submit": i18n.service_term_userSubmit_value,
            "approved": i18n.common_term_approvePass_value,
            "rejected": i18n.service_term_refuseClose_button,
            "returned": i18n.service_term_rejectModify_button,
            "canceled": i18n.common_term_undo_button,
            "succeed": i18n.common_term_implementSucceed_value,
            "partial-succeed": i18n.common_term_partSucceed_value,
            "failed": i18n.common_term_implementFail_value
        };

        // 转换资源类型
        this.resourceTypeView = {
            "vm": i18n.common_term_vm_label,
            "vdc": i18n.org_term_vdc_label,
            "disk": i18n.common_term_disk_label,
            "vapp": i18n.app_term_app_label
        };

        // 处理订单信息
        this.processOrderDetail = function(orderInfo) {
            // 订单历史
            var scope = $("html").scope() || {};
            var lang = scope.urlParams ? scope.urlParams.lang : undefined;
            _.each(orderInfo.history, function (item) {
                item.time = timeCommonService.utc2Local(item.time);
                item.actionView = orderActionView[item.action];

                // 错误原因
                var exc;
                if (item.errorCode && (exc = exception.getException(item.errorCode))) {
                    item.reason = exc.cause;
                } else if (lang === "zh" && item.zhMessage) {
                    item.reason = item.zhMessage;
                } else if (lang === "en" && item.enMessage) {
                    item.reason = item.enMessage;
                }
            });

            // 当前处理人
            var approvers = "";
            _.each(orderInfo.orderAproverinfos, function(item){
                if (item.serviceApprovalUsrName) {
                    approvers += item.serviceApprovalUsrName + ";";
                }
            });
            orderInfo.approvers = approvers.substr(0, approvers.lastIndexOf(";"));
        };
    };
    return commonService;
});
