/*global define*/
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        // 查询VPC列表
        this.addSecurityGroupRule = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.querySecurityGroupRules = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "securitygroupid": options.secGroupId,
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.deleteSecurityGroupRules = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules/action?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "deleteSGRule": {
                        "sgID": options.secGroupId,
                        "sgRuleIdList": [options.ruleId]
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.querySecurityGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "start": options.start,
                    "limit": options.limit,
                    "sgname":options.name,
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.deleteSecurityGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.secGroupId,
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.querySecurityGroupDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.updateSecurityGroupDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.id,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "description": options.description
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.createSecurityGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "name": options.name,
                    "description": options.description,
                    "vpcID": options.vpcId,
                    "intraTrafficAllow": options.intraTrafficAllow
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.queryVm4SG = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/action?cloud-infra={cloud-infra}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud-infra": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "list": {
                        "condition": options.condition,
                        "start": options.start,
                        "limit": options.limit,
                        "status": options.status
                    }
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
            });
            return deferred.promise;
        };

        this.queryVmDetails = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
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

        this.querySecurityGroupVm = function (options) {
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
                    "querySGMember": {
                        "start": options.start,
                        "count": options.count,
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
