define(function () {
    var service = function (exception, $q, camel) {
        //查询虚拟机模板
        this.queryVmList = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vmtemplates",
                    o: {
                        "tenant_id": param.tenantId
                    }
                },
                "params": JSON.stringify({
                    name: param.name,
                    "cloud-infra" : param.cloudInfraId,
                    range: param.range,
                    ostype : param.ostype,
                    osversion : param.osversion,
                    "start": param.start,
                    "limit": param.limit
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

        //查询cpu内核数
        this.queryCPUs = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/cpus",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询内存数
        this.queryMemorys = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/memorys",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询存储数
        this.queryStorages = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/storages",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询虚拟机台数
        this.queryVmCounts = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vmCounts",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询弹性IP数
        this.queryIPCounts = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/ipCounts",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询vpc个数
        this.queryVPCCounts = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vpcCounts",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询安全组数
        this.querySerCounts = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/serCounts",
                    o: {
                        "tenant_id": param.tenantId
                    }
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
        //查询虚拟机规格模板信息
        this.queryConfigTemplates = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vm-flavors",
                    o: {
                        "tenant_id": param.tenantId
                    }
                },
                "params": {
                    "cloud-infra" : param.cloudInfraId
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
        //查询基础网络列表
        this.queryBasicNetworks = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": "/uportal/ecs/vm/basicNetworks"
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
        //查询VDC列表
        this.queryVDCs = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": "/goku/rest/v1.5/orgs",
                "params": JSON.stringify({
                    "start": param.start,
                    "limit": param.limit
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
        //删除指定vdc
        this.deleteVDCById = function (param) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel["delete"]({
                "url": {s: "/goku/rest/v1.5/orgs/{id}", o: {"id": param.orgsId}},
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
    };
    return service;
})
