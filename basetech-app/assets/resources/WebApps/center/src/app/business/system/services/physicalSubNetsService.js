/**
 * @author
 * @date 0214-04-22
 * for operator log
 */
define(["app/services/exceptionService",
    "fixtures/systemFixture"], function (ExceptionService) {
    "use strict";

    var exception = new ExceptionService();

    var physicalSubNetsService = function ($q, camel) {
        //查询物理设备子网信息
        this.queryPhysicalSubNets = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: "/goku/rest/v1.5/irm/1/physicalsubnets",
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
        //修改物理设备子网信息
        this.putPhysicalSubNets = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: "/goku/rest/v1.5/irm/1/physicalsubnets",
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

    return physicalSubNetsService;
});