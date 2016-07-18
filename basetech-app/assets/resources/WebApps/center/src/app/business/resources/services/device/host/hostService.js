/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService", "fixtures/deviceFixture"], function (ExceptionService) {
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
            if (!exception.isException(jqXHR)) {
                deferred.resolve(null);
                return;
            }
            exception.doException(jqXHR, null);
        });

        return deferred.promise;
    };
    //修改接入参数
    Service.prototype.modifyHostParams = function (options) {
        return this.http("put", {
            url: {
                s: "/goku/rest/v1.5/irm/phy-servers/{id}/access-params",
                o: {
                    id: options.id
                }
            },
            userId: options.userId,
            params: options.params
        });
    };

    return Service;
});