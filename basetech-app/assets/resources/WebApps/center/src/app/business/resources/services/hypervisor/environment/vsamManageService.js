/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService", "fixtures/ecsFixture"], function (ExceptionService) {
    var Service = function ($q, camel) {
        this.$q = $q;
        this.camel = camel;
        this.exception = new ExceptionService();
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
            if (typeof options.monitor === "undefined" || options.monitor) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            } else {
                deferred.reject();
            }
        });

        return deferred.promise;
    };

    //封装http
    Service.prototype.rest = function (url, method, options) {
        var config = {
            url: {
                s: url,
                o: options
            },
            userId: options.userId
        };
        options.params && (config.params = options.params);
        return this.http(method, config);
    };


    //获取站点ip
    Service.prototype.getVSAM = function (options) {
        return this.rest("/goku/rest/v1.5/irm/vsams/{vsamId}/mgntIp", "get", options);
    };

    //修改站点ip
    Service.prototype.editVSAM = function (options) {
        return this.rest("/goku/rest/v1.5/irm/vsams/{vsamId}/mgntIp", "put", options);
    };
    return Service;
});