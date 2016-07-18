/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService", "language/keyID", "fixtures/deviceFixture"], function (ExceptionService, i18n) {
    var Service = function ($q, camel) {
        this.$q = $q;
        this.camel = camel;
        this.exception = new ExceptionService();
    };
    Service.prototype.getDeviceType = function () {
        return {
            "CHASS": i18n.device_term_subrackServer_label || "机框",
            "RACK_SERVER": i18n.device_term_rackServer_label || "机架服务器",
            "SWITCH": i18n.device_term_switch_label || "交换机",
            "BLADE_SWITCH": i18n.device_term_switchBoard_label || "交换板",
            "STORAGE_DEVICE": i18n.common_term_storage_label || "存储设备",
            "DC": i18n.common_term_datacenter_label || "数据中心",
            "ZONE": i18n.resource_term_zone_label || "资源分区"
        };
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

    //当前导入导入进度
    Service.prototype.importResult = function (userId) {
        return this.http("get", {
            url: "/goku/rest/v1.5/irm/device-templates/import-progress",
            userId: userId,
            monitor: false
        });
    };

    //下载报告
    Service.prototype.downloadReport = function (userId, language) {
        return this.http("get", {
            url: {
                s: "/goku/rest/v1.5/irm/device-templates/import-report/{language}",
                o: {
                    language: language
                }
            },
            userId: userId
        });
    };

    //下载模板
    Service.prototype.downloadTemplate = function (userId, language) {
        return this.http("get", {
            url: {
                s: "/goku/rest/v1.5/irm/device-templates/{language}",
                o: {
                    language: language
                }
            },
            userId: userId
        });
    };

    return Service;
});