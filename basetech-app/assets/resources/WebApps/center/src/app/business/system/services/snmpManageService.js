/**
 * @date 0214-05-05
 * for get/set SNMP infomation
 */
define(["app/services/exceptionService",
    "fixtures/systemFixture"], function (ExceptionService) {
    "use strict";

    var exception = new ExceptionService();

    var snmpManageService = function ($q, camel) {
        //查询SNMP infomation
        this.getSnmpMgrInfo = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{tenant_id}/snmpserver",
                    o: {
                        tenant_id: options.orgId
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
        //修改SNMP infomation
        this.setSnmpMgrInfo = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{tenant_id}/snmpserver",
                    o: {
                        tenant_id: options.orgId
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

    return snmpManageService;
});