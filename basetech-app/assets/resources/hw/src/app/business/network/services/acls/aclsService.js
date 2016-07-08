/*global define*/
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询ACL规则列表
        this.queryFirewallRule = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "ruletype": options.ruleType,
                    "protocol": options.protocol,
                    "direction": options.direction,
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
        //删除ACL规则
        this.deleteFirewallRule = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}",
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
        //创建ACL规则
        this.createFirewallRule = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.datas),
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
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        //插入ACL规则
        this.insertFirewallRule = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "id": options.ruleId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.datas),
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
                deferred.resolve(null);
            });
            return deferred.promise;
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
