/**
 * 查询资源池能力差异的service
 */
define(["tiny-lib/underscore"], function (_) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function ($q, camel) {
        //查询资源池能力差异
        this.queryCloudInfraCapacities = function (tenantId, userId, csrfToken) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/cloud-infras-capacity",
                    "o": {
                        "vdc_id": tenantId
                    }
                },
                "userId": userId,
                csrfToken: csrfToken
            });
            deferred1.success(function (data) {
                deferred.resolve(data);
            });
            deferred1.fail(function (data) {
                deferred.reject(null);
            });

            return deferred.promise;
        };

        /*查询指定资源池的能力字段*/
        this.querySpecificCapacity = function (capacities, type, version) {
            var specific = {};
            if (capacities && capacities.length > 0) {
                _.each(capacities, function (item) {
                    if (type === item.type && version === item.version) {
                        specific = item.capacity;
                    }
                });
            }
            return specific;
        };
    };

    return service;
});