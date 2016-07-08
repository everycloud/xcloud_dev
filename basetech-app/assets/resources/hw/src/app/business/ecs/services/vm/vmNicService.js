/**
 * 虚拟机网卡服务
 */
/* global define */
define(["tiny-lib/underscore",  "app/services/cookieService"], function (_, cookieService) {
    "use strict";

    var storage = new cookieService();
    
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
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
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "start": options.start,
                    "limit": options.limit
                },
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

        // 从vpc列表中找到指定的vpc
        this.getSpecVpc = function (allVpc, vpcId) {
            var vpc;
            if (allVpc && allVpc.length > 0) {
                vpc = _.find(allVpc, function (item) {
                    return String(item.vpcID) === String(vpcId);
                });
            }
            return vpc || {};
        };

        // 从cookie中获取当前用户选中的vpc，如果没有选中的就默认返回第一个
        this.getUserSelVpc = function (allVpc) {
            var vpc = {};
            if (allVpc && allVpc.length > 0) {
                var currId = storage.get("vpcId");

                if (currId) {
                    vpc = _.find(allVpc, function (item) {
                        return String(item.vpcID) === String(currId);
                    });
                }
                
                if (!vpc || !vpc.vpcID) {
                    vpc = allVpc[0];
                }
            }
            return vpc;
        };

        // 查询VPC下的网络列表
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

        // 添加网卡
        this.addVmNic = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/nics?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "networkId": options.networkId
                }),
                "userId": options.user.id,
                "timeout":60000
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

        // 修改网卡
        this.modifyVmNic = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/nics/{nic_id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "nic_id": options.nicId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "networkId": options.networkId,
                    "ip": options.ip
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

        // 删除网卡
        this.deleteVmNic = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/nics/{nic_id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "nic_id": options.nicId,
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

        // 查询网络详情
        this.queryNetworkDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{networkID}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "networkID": options.networkId
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

        // 查询浮动ip
        this.queryNicFloatIps = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/floatips?cloud-infras={cloud_infras_id}&nic-id={nicID}&vm-id={vmID}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "nicID": options.nicId,
                        "cloud_infras_id": options.cloudInfraId,
                        "vmID": options.vmId
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

        // 配置网卡浮动IP
        this.configNicFloatIp = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/ipsets?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "vmID": options.vmId,
                    "nicID": options.nicId,
                    "addIps": options.addIps,
                    "delIps": options.delIps
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

        // 查询安全组
        this.querySg = function (options) {
            var params = {
                "cloud-infras": options.cloudInfraId,
                "start": options.start,
                "limit": options.limit
            };
            if(options.name){
                params.sgname = options.name;
            }
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": params,
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


        // 添加网卡到安全组
        this.addNic2SecurityGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "addVM2SG": {
                        "vmID": options.vmId,
                        "nicID": options.nicId,
                        "sgID": options.sgID
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

        // 退出安全组
        this.exitSecurityGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "removeVMFromSG": {
                        "vmID": options.vmId,
                        "nicID": options.nicId,
                        "sgID": options.sgId
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
