define(["language/keyID", "fixtures/network/vlb/vlbFixture"], function (i18n) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {

        //查询VLB列表
        this.queryVLBs = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs?cloud-infra={cloud_infra_id}&vpcid={vpcid}&start={start}&limit={limit}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId,
                        "vpcid": param.vpcId,
                        "start": param.start,
                        "limit": param.limit
                    }
                },
                params: {},
                "userId": param.userId
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

        //查询VLB单个VLB
        this.queryVLB = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "id": param.lbID
                    }
                },
                params: {
                    "cloud-infra": param.cloudInfraId
                },
                "userId": param.userId
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

        //删除VLB
        this.deleteVLB = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId,
                        "id": param.id
                    }
                },
                params: {},
                "userId": param.userId
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

        //删除监听器
        this.deleteListener = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{lbid}/listeners/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId,
                        "lbid": param.lbID,
                        "id": param.id
                    }
                },
                params: {},
                "userId": param.userId
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
        //修改监听器信息
        this.updateListener = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId,
                        "id": param.lbID
                    }
                },
                params: JSON.stringify({
                    "listeners": param.listeners
                }),
                "userId": param.userId
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

        // 修改VLB信息
        this.modifyVlb = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId,
                        "id": param.lbID
                    }
                },
                params: JSON.stringify(param.opReq),
                "userId": param.userId
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

        //操作VLB
        this.operateVLB = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "cloud_infra_id": param.cloudInfraId
                    }
                },
                params: JSON.stringify(param.opParam),
                "userId": param.userId
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

        // 查询对应vpc下的网络
        this.queryVpcNets = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": {
                    "cloud-infras": param.cloudInfraId,
                    "start": param.start,
                    "limit": param.limit
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

        // 根据类型查询对应vpc下的网络
        this.queryVpcNetsByType = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId
                    }
                },
                "userId": param.userId,
                "params": {
                    "cloud-infras": param.cloudInfraId,
                    "start": param.start,
                    "networktype" : param.networktype,
                    "limit": param.limit
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

        // vlb概要信息需要根据网络ID查询名称
        this.queryNetByNetId = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpcid": param.vpcId,
                        "id": param.id,
                        "cloud_infras_id": param.cloudInfraId
                    }
                },
                "userId": param.userId,
                "params": {}
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

        // 查询对应vpc下对应的虚拟机列表
        this.queryVpcVms = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": param.vdcId,
                        "vpc_id": param.vpcId,
                        "cloud_infra_id": param.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "list": {
                        "condition": param.condition,
                        "start": param.start,
                        "limit": param.limit,
                        "vpcId": param.vpcId
                    }
                }),
                "userId": param.userId,
                "vpcId": param.vpcId
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

        this.queryVMsNics = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vmnics",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": {
                    "vmname": options.name,
                    "start": options.start,
                    "limit": options.limit,
                    "cloud-infra":options.cloudInfraId,
                    "lbid":options.lbId
                },
                "userId": options.userId,
                "vpcId": options.vpcId
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

        //创建VLB
        this.createVlb = function (opts) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": opts.vdc_id,
                        "cloud_infra_id": opts.cloud_infra_id
                    }
                },
                "params": JSON.stringify(opts.params),
                "userId": opts.userId
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

        //添加监听器
        this.createListener = function (opts) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{lbid}/listeners?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": opts.vdc_id,
                        "cloud_infra_id": opts.cloudInfraId,
                        "lbid": opts.lbID
                    }
                },
                "params": JSON.stringify(opts.params),
                "userId": opts.userId
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

        //设置证书（修改监听器时调用）
        this.certificateBindListener = function (opts) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs/{lbid}/listeners/{listenerid}/certs?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": opts.vdcId,
                        "cloud_infra_id": opts.cloudInfraId,
                        "listenerid": opts.id,
                        "lbid": opts.lbID
                    }
                },
                "params": JSON.stringify(opts.params),
                "userId": opts.userId
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

        //申请弹性ip
        this.applyElasticIP = function (opts) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": opts.vdcId,
                        "vpcid": opts.vpcId,
                        "cloud_infras_id": opts.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "maxRxBandwidth": opts.maxRxBandwidth,
                    "maxTxBandwidth": opts.maxTxBandwidth,
                    "vpcID": opts.vpcId
                }),
                "userId": opts.userId
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

        // VLB状态转换
        this.transStatusToUiStatus = function (status) {
            if (status === "READY") {
                return i18n.common_term_running_value;
            } else if (status === "DISABLE") {
                return i18n.common_term_stoped_value;
            } else if (status === "FAULT") {
                return i18n.common_term_trouble_label;
            } else if (status === "ERROR") {
                return i18n.common_term_fail_label;
            } else if (status === "BUILD") {
                return i18n.common_term_executing_value;
            } else {
                return i18n.common_term_unknown_value;
            }
        };

        // 虚拟机健康状态转换
        this.transVmHealthyToUiStatus = function (status) {
            if (status === 1) {
                return i18n.common_term_health_value;
            } else if (status === 2) {
                return i18n.common_term_notHealth_value;
            } else {
                return i18n.common_term_unknown_value;
            }
        };
        // 查询对应vpc下的外部网络
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
                    "vpcid": options.vpcId,
                    "cloud-infras": options.cloudInfraId,
                    "usedbyrouter": options.usedbyrouter || false,
                    "usedbyvxlanrouter": options.usedbyvxlanrouter || false,
                    "name": options.name || null,
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
    };
    service.$injector = ["exception", "$q", "camel"];
    return service;
});
