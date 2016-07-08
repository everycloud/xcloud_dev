/**
 * Created on 14-4-23.
 * 弹性IP服务
 */
/*global define*/
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询弹性IP列表
        this.queryElasticIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "start": options.start,
                    "limit": options.limit
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

        //查询所有弹性IP
        this.queryElasticIPAll = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        //释放弹性IP
        this.releaseElasticIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id,
                        "cloud_infras_id": options.cloudInfraId
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

        //解绑定弹性IP
        this.unbindElasticIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/action?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "unbind": {
                        "id": options.id
                    }
                }),
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

        //查询IP带宽模板
        this.queryIPBWTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/ipbwtemplates",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "name": options.name,
                    "start": options.start,
                    "limit": options.limit
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

        //查询公有IP池
        this.queryPublicIPPool = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/publicippools",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "vpcid": options.vpcId
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
        //申请弹性IP
        this.applyElasticIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "maxRxBandwidth": options.maxRxBandwidth,
                    "maxTxBandwidth": options.maxTxBandwidth,
                    "ipPoolID": options.ipPoolID,
                    "publicIP": options.publicIP,
                    "vpcID": options.vpcId
                }),
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
        //查询弹性IP详情
        this.queryElasticIPDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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
        //修改弹性IP带宽
        this.updateElasticIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "maxRxBandwidth": options.maxRxBandwidth,
                    "maxTxBandwidth": options.maxTxBandwidth
                }),
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
        //虚拟机绑定弹性IP
        this.bindElasticIPByVM = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "bind": {
                        "id": options.id,
                        "vmID": options.vmId,
                        "nicID": options.nicId,
                        "networkID": options.networkID,
                        "privateIP": options.privateIP
                    }
                }),
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

        //查询私有IP列表
        this.queryPrivateIP = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "networkid": options.networkID,
                    "privateIP": options.privateIP,
                    "allocateType": "MANUAL",
                    "status": "1",
                    "start": options.start,
                    "limit": options.limit
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

        //查询路由网络
        this.queryNetwork = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "networktype": options.networktype,
                    "status": options.status
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
