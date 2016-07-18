define(["language/keyID"], function (i18n) {
    "use strict";
    var service = function (exception, $q, camel) {
        this.getActionTypes = function () {
            var types = {
                "submit": i18n.service_term_userSubmit_value || "用户提交",
                "approved": i18n.common_term_approvePass_value || "审批通过",
                "rejected": i18n.service_term_refuseClose_button || "拒绝并关闭",
                "returned": i18n.service_term_rejectModify_button || "驳回修改",
                "canceled": i18n.common_term_undo_button || "撤销",
                "succeed": i18n.common_term_implementSucceed_value || "实施成功",
                "failed": i18n.common_term_implementFail_value || "实施失败",
                "partial-succeed": i18n.common_term_partSucceed_value || "部分成功"
            };
            return types;
        };
        this.getApplyType = function (expert) {
            var types = {};
            !expert.all && (types.all = {
                key: "",
                text: i18n.common_term_allType_label || "所有类型",
                checked: true
            });
            !expert.apply && (types.apply = {
                key: "apply",
                text: i18n.common_term_apply_button || "申请"
            });
            !expert.extend && (types.extend = {
                key: "extend",
                text: i18n.service_term_delay_label || "延期"
            });
            !expert.modify && (types.modify = {
                key: "modify",
                text: i18n.common_term_change_label || "变更"
            });
            !expert.release && (types.release = {
                key: "release",
                text: i18n.common_term_delete_button || "删除"
            });
            return types;
        };
        this.getApplyStatus = function () {
            var status = {
                "all": {
                    key: "",
                    text: i18n.common_term_allStatus_value || "所有状态",
                    checked: true
                },
                "handling": {
                    key: "handling",
                    text: i18n.common_term_processing_value || "处理中"
                },
                "initialize": {
                    key: "initialize",
                    text: i18n.service_term_waitSubmit_label || "待提交"
                },
                "approving": {
                    key: "approving",
                    text: i18n.service_term_waitApproval_label || "待审批"
                },
                "processing": {
                    key: "processing",
                    text: i18n.common_term_implementing_value || "实施中"
                },
                "succeed": {
                    key: "succeed",
                    text: i18n.common_term_success_value || "成功"
                },
                "partial-succeed": {
                    key: "partial-succeed",
                    text: i18n.common_term_partSucceed_value || "部分成功"
                },
                "failed": {
                    key: "failed",
                    text: i18n.common_term_fail_label || "失败"
                },
                "rejected": {
                    key: "rejected",
                    text: i18n.service_term_refuseClose_button || "拒绝并关闭"
                },
                "canceled": {
                    key: "canceled",
                    text: i18n.common_term_undo_button || "撤销"
                }
            };
            return status;
        };
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
                    s: "/goku/rest/v1.5/{vdc_id}/orders/{id}/adminaction",
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
        //审批
        this.orderAdminaction = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/orders/{id}/admin-action",
                    o: {
                        "tenant_id": options.user.orgId,
                        "id": options.orderId
                    }
                },
                "params": JSON.stringify({
                    "action": options.params.action,
                    "comments": options.params.comments,
                    "params": options.params.params,
                    "tenancy": options.params.tenancy
                }),
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
        //根据ID查询服务实例名称
        this.queryServiceInstancesName = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/vdcs/{id}",
                    o: {
                        "id": options.id
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

    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
