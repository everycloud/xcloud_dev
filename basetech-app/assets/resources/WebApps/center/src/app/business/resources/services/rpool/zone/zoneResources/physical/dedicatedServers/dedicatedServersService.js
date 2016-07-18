/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService",
    "language/keyID",
    "fixtures/rpool/physicalFixture"], function (ExceptionService, i18n) {
    var Service = function ($q, camel) {
        this.$q = $q;
        this.camel = camel;
        this.exception = new ExceptionService();
    };
    Service.prototype.getAssociateStatus = function () {
        var associateStatus = {
            all: {
                label: i18n.device_term_allBondStatus_label || "所有物理机",
                val: "",
                checked: true
            },
            associated: {
                label: i18n.resource_term_associatedPhysiServer_value || "已关联物理机",
                val: "associated"
            },
            unassociated: {
                label: i18n.resource_term_associateWithoutPhysi_value || "未关联物理机",
                val: "unassociated"
            }
        };
        return associateStatus;
    };
    Service.prototype.getAssignStatus = function () {
        var assignStatus = {
            idle: {
                label: "空闲",
                val: "idle"
            },
            maintenance: {
                label: "维护中",
                val: "maintenance"
            },
            assigned: {
                label: "已分配",
                val: "assigned"
            },
            installing: {
                label: i18n.common_term_installing_value || "安装中",
                val: "installing"
            },
            installfailed: {
                label: i18n.common_term_installFail_label || "安装失败",
                val: "installfailed"
            },
            recycling: {
                label: i18n.common_term_reclaiming_value || "回收中",
                val: "recycling"
            },
            recyclefailed: {
                label: "回收失败",
                val: "recyclefailed"
            }
        };
        return assignStatus;
    };
    Service.prototype.getRunStatus = function () {
        var runStatus = {
            running: {
                label: i18n.common_term_running_value || "运行中",
                val: "running"
            },
            poweroff: {
                label: i18n.common_term_down_button || "下电",
                val: "poweroff"
            },
            poweron: {
                label: i18n.common_term_on_button || "上电",
                val: "poweron"
            }
        };
        return runStatus;
    };
    Service.prototype.http = function (method, options) {
        var exception = this.exception;
        var deferred = this.$q.defer();
        deferred.notify("");
        var deferred1 = this.camel[method](options);
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
    //物理机操作
    Service.prototype.vdcOperator = function (options) {
        return this.http("post", {
            url: {
                s: "/goku/rest/v1.5/irm/{vdc_id}/server/action",
                o: {
                    vdc_id: 1
                }
            },
            userId: options.userId,
            params: options.params
        });
    };
    //物理机列表
    Service.prototype.queryServer = function (options) {
        return this.http("post", {
            url: {
                s: "/goku/rest/v1.5/irm/{vdc_id}/zones/{zone_id}/server/list",
                o: {
                    vdc_id: 1,
                    zone_id: options.zoneId
                }
            },
            userId: options.userId,
            params: options.params
        });
    };

    return Service;
});