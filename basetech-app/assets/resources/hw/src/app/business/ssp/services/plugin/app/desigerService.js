/* global define */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询应用模板
        this.queryAppTemplate = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates/{id}/contents",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id
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
});
