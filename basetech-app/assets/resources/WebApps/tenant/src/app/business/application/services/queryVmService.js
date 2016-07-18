/**
 * 查询虚拟机信息服务
 */
/* global define */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VM列表
        this.queryVmList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "list": {
                        "name": options.name,
                        "ip": options.ip,
                        "networkType": options.networkType,
                        "condition": options.condition,
                        "start": options.start,
                        "limit": options.limit,
                        "status": options.status ? options.status : null,
                        "volumeId": options.volumeId,
                        "availableZoneId": options.azId,
                        "vpcId": options.vpcId,
                        "creatorId": options.user.id
                    }
                }),
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
