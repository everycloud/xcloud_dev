/**
 * 服务目录页面的相关接口
 */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        this.saveSequence = function(options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url" : {
                    s : "/goku/rest/v1.5/{vdc_id}/catalog-sequences",
                    o : {
                        "vdc_id" : options.user.vdcId
                    }
                },
                "params" : JSON.stringify({
                    "catalogSequences" : options.catalogSequences
                }),
                "userId" : options.user.id
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
        //查询模板列表信息
        this.queryCatalogTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url" : {
                    "s" : "/goku/rest/v1.5/{vdc_id}/service-templates",
                    "o" : {
                        "vdc_id" : options.user.vdcId
                    }
                },
                "params" : options.params,
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
        //查询服务目录列表
        this.queryCatalogs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/catalogs",
                    o: {
                        "tenant_id": options.user.vdcId
                    }
                },
                "params": {
                    "name": options.name
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

        //查询指定服务目录下的服务列表
        this.queryCatalogServices = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services",
                    o: {
                        "tenant_id": options.user.vdcId
                    }
                },
                "params": {
                    "inputSearch": options.inputSearch,
                    "catalog-id": options.catalogId,
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

        // 删除服务
        this.deleteServices = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.serviceId
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
        // 编辑服务
        this.modifyServices = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.serviceId
                    }
                },
                "params":JSON.stringify(options.params),
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

        //删除服务目录
        this.deleteCatalog = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/catalogs/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.catalogId
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

        //增加服务目录
        this.createCatalog = function(options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/catalogs",
                    o: {
                        "tenant_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify({
                    "name": options.catalog.name,
                    "description" : options.catalog.desc
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

        //修改服务目录
        this.modifyCatalog = function(options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/catalogs/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id" : options.catalog.id
                    }
                },
                "params": JSON.stringify({
                    "name": options.catalog.name,
                    "description" : options.catalog.desc
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

        this.queryCatalog = function(options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/catalogs/{id}",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id" : options.catalogId
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

        // 操作服务（支持 激活、去激活，服务关联、解关联服务目录 操作）
        this.operateServices = function (options) {
            var deferred = $q.defer();
            var params = JSON.stringify({
                "modify": options.modify
            });
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services/{id}/action",
                    o: {
                        "tenant_id": options.user.vdcId,
                        "id": options.serviceId
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

        // 查询服务实例列表（我的服务页面用）
        this.queryServiceInstances = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/service-instances",
                    o: {
                        "tenant_id": options.user.vdcId
                    }
                },
                "params": {
                    "name": options.name,
                    "status": options.status,
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

        //查询服务详情
        this.queryServiceOffering = function (options) {
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

        //查询服务实例详情
        this.queryServiceInstanceDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/service-instances/{id}",
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
        //添加服务
        this.createService = function(options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/services",
                    o: {
                        "tenant_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify({
                    "serviceTemplateId": options.serviceTemplateId,
                    "name" : options.name,
                    "description" : options.description,
                    "status" : options.status,
                    "approveType":options.approveType,
                    "params":options.params,
                    "catalogs":options.catalogs,
                    "whiteListFlag":options.whiteListFlag
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
        //添加服务
        this.createService = function(options) {
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
                    "name" : options.name,
                    "description" : options.description,
                    "status" : options.status,
                    "approveType":options.approveType,
                    "params":options.params,
                    "catalogs":options.catalogs,
                    "whiteListFlag":options.whiteListFlag
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

// 查询VPC列表
        this.queryVpcs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vpcs",
                    o: {
                        "tenant_id": "all"
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


    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});