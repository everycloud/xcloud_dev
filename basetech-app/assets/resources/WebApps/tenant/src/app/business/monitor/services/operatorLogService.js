define(function () {
    "use strict";
    var operatorLogService = function (exception, $q, camel) {
        //查询操作日志
        this.queryOperatorLog = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/operation-log/list",
                    o: {
                        vdc_id: options.vdcId
                    }
                },
                userId: options.userId,
                params: JSON.stringify(options.params)
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
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/operation-log/detail/{id}",
                    o: {
                        vdc_id: options.vdcId,
                        id: options.id
                    }
                },
                params: {
                    "locale": options.locale
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
    };
    return operatorLogService;
});