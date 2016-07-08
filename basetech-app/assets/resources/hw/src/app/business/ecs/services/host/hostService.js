/**
 * 查询虚拟机信息服务
 */
/* global define */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VM列表
        this.queryHost = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/dedicatedServers?cloud-infra={cloud_infra_id}&start={start}&limit={limit}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "start": options.start,
                        "limit": options.limit
                    }
                },
                "vpcId": options.vpcId,
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };
        //查询物理机列表
        this.queryPhyList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: " /goku/rest/v1.5/{vdc_id}/phy-servers?name={name}&model={model}&ip={ip}&os={os}&limit={limit}&start={start}&search-input={search_input}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "name":options.name,
                        "ip":options.ip,
                        "os":options.os,
                        "search-input":options["search-input"],
                        "start": options.start,
                        "limit": options.limit
                    }
                },
                "vpcId": options.vpcId,
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        // 修改物理机
        this.modifyPhysicalMachine = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: " /goku/rest/v1.5/{vdc_id}/servers/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params": JSON.stringify(options.params),
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
        //删除物理机
        this.deletePhysicalMachine = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/servers/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.serviceId
                    }
                },
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




        this.actHost = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/dedicatedServers/{id}/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "action": options.act
                }),
                "vpcId": options.vpcId,
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        this.applyHost = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/dedicatedServers?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.hostInfo),
                "vpcId": options.vpcId,
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