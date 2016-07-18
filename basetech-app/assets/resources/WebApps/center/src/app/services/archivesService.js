define(["fixtures/frameworkFixture"], function () {
    "use strict";

    var service = function (exception, $q, camel) {
        this.getArchive = function (userId, params) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: "/goku/rest/v1.5/device-archive",
                userId: userId,
                params: params
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