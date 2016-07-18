define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        /* 查询资源池列表，并构造地域的显示数据 */
        this.queryCloudInfras = function (tenantId, userId, resPoolType) {
            var deferred = $q.defer();
            var params = {
                "connect-status": "connected",
                "service-status": "normal"
            };
            if (resPoolType && ("" != resPoolType)) {
                params["type"] = resPoolType;
            }
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/cloud-infras",
                    o: {
                        "tenant_id": tenantId
                    }
                },
                "params": params,
                "userId": userId
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                //不要在这儿修改原始数据
                if (false && data && data.cloudInfras && data.cloudInfras.length > 0) {
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
        this.constructAZ = function (az, idPrefix) {
            var resAz = {};
            resAz.id = az.id;
            resAz.checkboxId = idPrefix + "Checkbox_" + az.id;
            resAz.checked = false;
            resAz.cloudInfraId = az.cloudInfraId;
            resAz.name = az.name;
            resAz.desc = az.desc;
            return resAz;
        };
        this.constructAZList = function (azList, idPrefix) {
            var resList = [];
            for (var index in azList) {
                resList.push(this.constructAZ(azList[index], idPrefix));
            }
            return resList;
        };
        // 判断一个元素是否已经存在列表中
        this.isExist = function (item, itemList) {
            var exist = false;
            if (null == item || undefined == item || null == itemList || undefined == itemList) {
                return false;
            }
            for (var index in itemList) {
                if (itemList[index].id == item.id) {
                    return true;
                }
            }
            return false;
        };
// 查询VPC列表
        this.queryVpcs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs",
                    o: {
                        "vdc_id": options.user.orgId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
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
        // 查询虚拟机模板
        this.queryVmTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vmtemplates",
                    o: {
                        "tenant_id": options.user.orgId
                    }
                },
                "params": options.params,
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

        //删除指定vdc
        this.deleteVDCById = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                "url": {s: "/goku/rest/v1.5/vdcs/{id}", o: {"id": param.orgsId}},
                "params": {
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

        //添加服务
        this.createService = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services",
                    o: {
                        "tenant_id": options.user.orgId
                    }
                },
                "params": JSON.stringify({
                    "serviceTemplateId": options.serviceTemplateId,
                    "name": options.name,
                    "description": options.description,
                    "status": options.status,
                    "approveType": options.approveType,
                    "params": options.params,
                    "catalogs": options.catalogs,
                    "whiteListFlag": options.whiteListFlag,
                    "vdcWhiteList": options.vdcWhiteList,
                    "iconId": options.iconId
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

        // 查询虚拟机规格
        this.queryConfigTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vm-flavors",
                    o: {
                        "tenant_id": options.user.orgId
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

        // 查询私有网络列表
        this.queryNetworks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "name": options.name,
                    "status": "0",
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
        // 查询基础网络列表
        this.queryBasicNetworks = function (options) {
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
        //查询服务详情
        this.queryServiceInfo = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.id
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

        /* 查询指定资源池下的AZ列表 */
        this.queryAzs = function (tenantId, userId, cloudInfraId) {
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
                    "service-status": "normal"
                },
                "userId": userId
            });
            deferred1.success(function (data, textStatus, jqXHR) {
                //不要在这儿修改原始数据
                if (false && data && data.availableZones && data.availableZones.length > 0) {
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

        this.queryIcons = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/service-icons",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": options.params,
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

        this.deleteIcon = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/service-icon/{icon_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "icon_id": options.iconId
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