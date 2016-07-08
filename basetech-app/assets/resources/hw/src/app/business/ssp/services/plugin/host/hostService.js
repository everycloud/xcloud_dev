/**
 * 物理机服务的相关接口
 */
/* global define */
define(["tiny-lib/underscore", "tiny-lib/jquery"], function (_, $) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        // 查询物理机列表
        this.queryHosts = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/physical-servers?infraId={infraId}&azId={azId}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "infraId":options.cloudInfraId,
                        "azId":options.azId
                    }
                },
                "params": options.param,
                "userId": options.user.id
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
