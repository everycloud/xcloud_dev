/*global define*/
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询PVM,一个VPC下面只能有一个PVM
        this.queryPVM = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "cloud-infra": options.cloudInfraId
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

        //查询VPC下面的所有网络
        this.queryNetworksInVPC = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    "o": {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "userId": options.userId,
                "params": {
                    "name": options.name || "",
                    "cloud-infras": options.cloudInfraId,
                    "status": options.status,
                    "start": options.start,
                    "limit": options.limit
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

        //创建PVM
        this.createPVM = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpcid": options.vpcId
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

        //删除PVM
        this.deletePVM = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
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

        this.modifyPVM = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
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

        //操作PVM（启，停）
        this.operatePVM = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms/actions?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.operate)
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