/*global define*/
define(function () {
    "use strict";

    var vpcService = function (exception, $q, camel) {
        this.getVpcList = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs",
                    o: {
                        "vdc_id": option.vdc_id
                    }
                },
                "timeout": 30000,
                "userId": option.userId,
                "params": {
                    "cloud-infras": option.cloudInfraId,
                    "start": option.start,
                    "limit": option.limit,
                    "shared": option.shared
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

        this.getVpc = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "id": option.vpcId
                    }
                },
                "userId": option.userId,
                "params": {
                    "cloud-infras": option.cloudInfraId
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

        // 创建VPC
        this.createVpc = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs?cloud-infras={cloud_infras_id}",
                    "o": {
                        "vdc_id": option.vdcId,
                        "cloud_infras_id": option.cloudInfraId
                    }
                },
                "userId": option.userId,
                "params": JSON.stringify(option.param)
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

        // 删除VPC
        this.deleteVpc = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                "url": {
                    s: " /goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "id": option.vpcId,
                        "cloud_infras_id": option.cloudInfraId
                    }
                },
                "userId": option.userId,
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

        // 修改VPC
        this.modifyVpc = function (option) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": option.vdcId,
                        "id": option.id,
                        "cloud_infras_id": option.cloudInfraId
                    }
                },
                "userId": option.userId,
                "params": JSON.stringify(option.param)
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

    vpcService.$injector = ["exception", "$q", "camel"];
    return vpcService;
});
