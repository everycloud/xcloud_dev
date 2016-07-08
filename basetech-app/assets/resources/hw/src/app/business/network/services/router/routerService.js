/*global define*/
define(["language/keyID"], function (keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //路由器状态转化： 0：就绪，1:创建中, 2:删除中, 3：失败
        this.transStatus = function (status) {
            if (status === "READY") {
                return i18n.common_term_ready_value;
            }
            if (status === "PENDING") {
                return i18n.common_term_creating_value;
            }
            if (status === "DELETING") {
                return i18n.common_term_releasing_value;
            }
            if (status === "FAIL") {
                return i18n.common_term_fail_label;
            }
            if (status === "DOWN") {
                //待翻译
                return "失效";
            }
        };

        //查询是否存在路由器
        this.queryRouter = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "azid": options.azId
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

        //申请路由器
        this.createRouter = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.data.vpcID,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.data)
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

        //删除路由器
        this.deleteRouter = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.routerId,
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

        //修改路由器
        this.updateRouter = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.routerId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.data)
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

        //诊断路由（PING）
        this.routerPing = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.data)
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

        //分页查询外部网络
        this.queryOutNetworks = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "start": options.start,
                    "limit": options.limit,
                    "vpcid": options.vpcId,
                    "az-id": options.azId,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyvxlanrouter": options.usedbyvxlanrouter || false, //IT场景使用
                    "usedbyrouter": !(options.usedbyvxlanrouter || false), //IT场景使用
                    "isAssociated": options.isAssociated || false
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

        //查询外部网络详情
        this.queryOutNetworkById = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks/{id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
                },
                "userId": options.userId,
                "params": {
                    "start": options.start,
                    "limit": options.limit,
                    "vpcid": options.vpcId,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyvxlanrouter": options.usedbyvxlanrouter || false, //IT场景使用
                    "usedbyrouter": !(options.usedbyvxlanrouter || false) //IT场景使用
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

        //创建防火墙
        this.createFirewall = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls?cloud-infras={cloud_infras_id}",
                    o: {
							"vdc_id" : options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.params)
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
        //删除防火墙
        this.deleteFirewall = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.delete({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls/{id}?cloud-infras={cloud_infras_id}",
                    o: {
						"vdc_id" : options.vdcId,
                        "vpcid": options.vpcId,
                        "id":options.firewallID,
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
        //查询防火墙
        this.queryFirewall = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls?cloud-infras={cloud_infras_id}",
                    o: {
						"vdc_id" : options.vdcId,
                        "vpcid": options.vpcId,
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
    };
    service.$injector = ["exception", "$q", "camel"];
    return service;
});
