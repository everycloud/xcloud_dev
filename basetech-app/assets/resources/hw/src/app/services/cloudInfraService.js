define(["app/services/exceptionService", "app/services/cookieService", "tiny-lib/underscore"], function (exceptionService, cookieService, _) {
    "use strict";

    var exception = new exceptionService();
    var storage = new cookieService();

    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function ($q, camel) {
        /* 查询资源池列表，并构造地域的显示数据, range=0表示查询所有的资源池 */
        this.queryCloudInfras = function (tenantId, userId, resPoolType, range) {
            var deferred = $q.defer();
            var params = {
                "connect-status": "connected",
                "service-status": "normal"
            };
            if (resPoolType && ("" !== resPoolType)) {
                params.type = resPoolType;
            }
            if (range) {
                params.range = range;
            }
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/cloud-infras",
                    o: {
                        "vdc_id": tenantId
                    }
                },
                "params": params,
                "userId": userId
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                if (data && data.cloudInfras && data.cloudInfras.length > 0) {
                    _.each(data.cloudInfras, function (item) {
                        _.extend(item, {
                            "selectId": item.id,
                            "label": item.region
                        });
                    });
                    data.cloudInfras[0].checked = true;
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

        /* 查询资源池详情 */
        this.queryCloudInfra = function (tenantId, userId, id) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/cloud-infras/{id}",
                    o: {
                        "vdc_id": tenantId,
                        "id": id
                    }
                },
                "userId": userId
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

        /* 在资源池列表中查找指定资源池 */
        this.getCloudInfra = function (allCloudInfra, specId) {
            var cloudInfra = {};
            if (allCloudInfra && allCloudInfra.length > 0) {
                _.each(allCloudInfra, function (item) {
                    if (String(item.id) === String(specId)) {
                        cloudInfra = item;
                    }
                });
            }
            return cloudInfra;
        };

        // 从cookie中获取当前用户选中的资源池，如果没有选中的就默认返回第一个
        this.getUserSelCloudInfra = function (allCloudInfra) {
            var cloudInfra = {};
            if (allCloudInfra && allCloudInfra.length > 0) {
                var currId = storage.get("cloudInfraId");
                if (currId) {
                    cloudInfra = _.find(allCloudInfra, function (item) {
                        return String(item.id) === String(currId);
                    });
                }

                if (!cloudInfra || !cloudInfra.id) {
                    cloudInfra = allCloudInfra[0];
                }

                allCloudInfra[0].checked = false;
                cloudInfra.checked = true;
            }
            return cloudInfra;
        };

        /* 查询指定资源池下的AZ列表 */
        this.queryAzs = function (tenantId, userId, cloudInfraId, azName) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/available-zones",
                    o: {
                        "vdc_id": tenantId
                    }
                },
                "params": {
                    "cloud-infra": cloudInfraId,
                    "manage-status": "occupied",
                    "service-status": "normal",
                    "name": azName
                },
                "userId": userId
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                if (data && data.availableZones && data.availableZones.length > 0) {
                    _.each(data.availableZones, function (item) {
                        _.extend(item, {
                            "selectId": item.id,
                            "label": item.name
                        });
                    });
                    data.availableZones[0].checked = true;
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

        /* 查询AZ详情 */
        this.queryAzDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/available-zones/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.azId
                    }
                },
                params: {
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

        /* 在AZ列表中查找指定AZ */
        this.getSpecAz = function (azs, specId) {
            var az = {};
            if (azs && azs.length > 0) {
                _.each(azs, function (item) {
                    if (String(item.id) === String(specId)) {
                        az = item;
                    }
                });
            }
            return az;
        };
    };

    return service;
});