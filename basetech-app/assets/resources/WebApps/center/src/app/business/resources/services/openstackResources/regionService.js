define(["app/services/exceptionService",
    "fixtures/dataCenterFixture"], function (ExceptionService) {
    "use strict";

    var user = $("html").scope().user;
    var exception = new ExceptionService();
    var regionService = function ($q, camel) {

        // 获取token
        this.getToken = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
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

        // 获取endpoint
        this.getEndpoint = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                "userId": user.id
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

        this.getStatistics = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var token = undefined;
            var projectId = undefined;

            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-hypervisors/statistics",
                        o: {"redirect_address_id": serviceID, "tenant_id": projectId}
                    },
                    "userId": user.id,
                    "token": token
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
            });
            return deferred.promise;
        };

        this.getAvailableZone = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var token = undefined;
            var projectId = undefined;

            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-availability-zone/detail",
                        o: {"redirect_address_id": serviceID, "tenant_id": projectId}
                    },
                    "userId": user.id,
                    "token": token
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
            });
            return deferred.promise;
        };
    };

    return regionService;
});