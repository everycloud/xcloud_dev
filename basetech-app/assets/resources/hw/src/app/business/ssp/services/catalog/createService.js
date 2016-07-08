define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        this.queryIcons = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/service-icons",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": options.params,
                "userId": options.userId
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

        this.deleteIcon = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/service-icon/{icon_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "icon_id": options.iconId
                    }
                },
                "userId": options.userId
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
})