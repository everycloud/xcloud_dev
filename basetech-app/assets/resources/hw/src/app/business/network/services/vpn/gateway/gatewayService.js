/**
 * Created on 14-5-6.
 * 弹性IP服务
 */
/*global define*/
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VPN网关
        this.queryVpnGateway = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway",
                    "o": {
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

        //查询VPN网关详情
        this.queryVpnGatewayDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.gid
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

        //创建VPN网关
        this.createVPNGateway = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "ipAddr": options.ipAddr,
                    "description": options.description,
                    "ikePublicInfo": options.ikePublicInfo,
                    "espPublicInfo": options.espPublicInfo,
                    "dpdInfo": options.dpdInfo
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

        //修改VPN网关
        this.updateVpnGateway = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "ipAddr": options.ipAddr,
                    "description": options.description,
                    "ikePublicInfo": options.ikePublicInfo,
                    "espPublicInfo": options.espPublicInfo,
                    "dpdInfo": options.dpdInfo
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
        //删除VPN网关
        this.deleteVpnGateway = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.gid,
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
        //查询VPC下VPN链接
        this.queryVpnConnection = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections",
                    "o": {
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
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});