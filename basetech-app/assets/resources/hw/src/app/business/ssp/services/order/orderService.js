/* global define */
define(["language/keyID"], function (keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    var service = function (exception, $q, camel) {
        //根据条件查询订单（我的申请，所有申请，待我审批）
        this.queryOrders = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": options.params,
                "userId": options.user.id
            });

            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        //审批者操作订单（同意、驳回、重试、关闭）
        this.adminActionOrder = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders/{id}/admin-action",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        //用户操作订单
        this.userActionOrder = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders/{id}/user-action",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        //创建订单（包括申请服务实例、释放服务实例、变更服务实例规格、服务实例延期）
        this.createOrder = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        // 修改订单
        this.modifyOrder = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        //查询单个订单详情
        this.queryOrder = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/orders/{order_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "order_id": options.orderId
                    }
                },
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        // 审批操作项
        this.approvalOptions = [
            [{
                 "key": "approve",
                 "text": i18n.common_term_agree_button,
                 "checked": true
             }, {
                 "key": "return",
                 "text": i18n.service_term_rejectModify_button
             }, {
                 "key": "reject",
                 "text": i18n.service_term_refuseClose_button
             }]
        ];

        //转换状态字符串
        this.statusViewStr = {
            "handling": i18n.common_term_processing_value,
            "initialize": i18n.service_term_waitSubmit_label,
            "approving": i18n.service_term_waitApproval_label,
            "processing": i18n.common_term_implementing_value,
            "succeed": i18n.common_term_success_value,
            "partial-succeed": i18n.common_term_partSucceed_value,
            "failed": i18n.common_term_fail_label,
            "rejected": i18n.service_term_refuseClose_button,
            "canceled": i18n.common_term_undo_button
        };

        //转换类型字符串
        this.typeViewStr = {
            "apply": i18n.common_term_apply_button,
            "extend": i18n.service_term_delay_label,
            "modify": i18n.common_term_change_label,
            "release": i18n.common_term_delete_button
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
