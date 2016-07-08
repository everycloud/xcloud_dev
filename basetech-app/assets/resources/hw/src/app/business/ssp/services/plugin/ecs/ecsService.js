/**
 * 云主机服务的相关接口
 */
/* global define */
define(["tiny-lib/underscore", "tiny-lib/jquery"], function (_, $) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VM详情
        this.queryVmDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "cloud_infra_id": options.cloudInfraId
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

        // 查询虚拟机模板列表
        this.queryVmTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "azid": options.azId,
                    "range": "all",
                    "status": "FINISHED",
                    "start": 0,
                    "limit": 1000
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

        // 查询虚拟机模板详情
        this.queryVmTemplateDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.templateId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
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

        // 查询虚拟机规格列表
        this.queryConfigTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vm-flavors",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
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

        // 查询SLA
        this.querySlaTags = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/available-zones/{id}/tags",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.azId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
                },
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                if (data) {
                    var allSla = [];
                    if (data.common) {
                        allSla = allSla.concat(data.common);
                    }
                    if (data.resourceCluster) {
                        allSla = allSla.concat(data.resourceCluster);
                    }

                    var defaultSla = {
                        "GOLD": false,
                        "SILVER": false,
                        "COPPER": false
                    };
                    var userSla = [];
                    _.each(allSla, function(item) {
                        if (defaultSla[item.value] !== undefined) {
                            defaultSla[item.value] = true;
                        } else {
                            userSla.push(item.value);
                        }
                    });

                    var slas = [];
                    for(var temp in defaultSla) {
                        if (defaultSla.hasOwnProperty(temp) && defaultSla[temp]) {
                            slas.push(temp);
                        }
                    }

                    data.slas = slas.concat(userSla);
                }

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

        // 查询VPC列表
        this.queryVpcs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": options.param,
                "timeout": 30000,
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

        // 根据AZ查询VPC列表
        this.queryVpcByAz = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "queryVPCByAZIDs": {
                        "azIDs": options.azIds
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

        // 查询单个VPC
        this.queryVpcDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        // 查询VPC下的网络列表（或者ICT场景的VPC网络）
        this.queryNetworks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "name": options.name,
                    "status": "READY",
                    "start": options.start,
                    "limit": options.limit
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

        // 查询对应ICT vpc下的直连网络
        this.queryICTDirectNetworks = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "vpcid": options.vpcId,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyrouter": false,
                    "usedbyvxlanrouter": false,
                    "isAssociated": true
                }
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

        // 查询单个网络详情
        this.queryNetworkDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.networkId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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

        // 查询共享网络列表
        this.querySharedNetworks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/shared-networks",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId
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
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
