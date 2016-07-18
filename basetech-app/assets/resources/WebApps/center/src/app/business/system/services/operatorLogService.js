/**
 * @date 0214-04-22
 * for operator log
 */
define(["app/services/exceptionService",
    "fixtures/systemFixture"], function (ExceptionService) {
    "use strict";

    var exception = new ExceptionService();

    var operatorLogService = function ($q, camel) {
        //查询操作日志
        this.queryOperatorLog = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/operation-log/list",
                    o: {
                        vdc_id: options.vdcId
                    }
                },
                userId: options.userId,
                params: options.params
            });
            deferred1.success(function (data) {
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


        this.operatorLogDetail = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/operation-log/detail/{id}?locale={locale}",
                    o: {
                        vdc_id: options.vdcId,
                        id:options.id,
                        locale:options.locale
                    }
                },
                userId: options.userId
            });
            deferred1.success(function (data) {
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
        //导出操作日志.xsl
        this.exportOperatorLog = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/operation-log/log/export",
                    o: {
                        vdc_id: options.vdcId
                    }
                },
                userId: options.userId,
                params: options.params
            });
            deferred1.success(function (data) {
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

    return operatorLogService;
});