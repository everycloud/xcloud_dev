define(["app/services/exceptionService",
    "fixtures/dataCenterFixture",
    "fixtures/serviceFixture"], function (ExceptionService) {
    "use strict";

    function user(){
        return $("html").scope().user;
    }
    var exception = new ExceptionService();
    var homeService = function ($q, camel) {

        // 获取token
        this.getToken = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user().id},
                "userId": user().id
            });
            deferred1.success(function (data) {
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

        // 获取endpoint
        this.getEndpoint = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                "userId": user().id
            });
            deferred1.success(function (data) {
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

        // 获取openstack实例的容量信息
        this.getStatistics = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var token = undefined;
            var projectId = undefined;

            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-hypervisors/statistics",
                        o: {"redirect_address_id": serviceID, "tenant_id": projectId}
                    },
                    "userId": user().id,
                    "token": token
                });
                deferred1.success(function (data) {
                    deferred.resolve(data);
                });
                deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            });
            return deferred.promise;
        };

        // ICT场景查询可用分区
        this.getICTAvailableZone = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var token = undefined;
            var projectId = undefined;

            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-availability-zone/detail",
                        o: {"redirect_address_id": serviceID, "tenant_id": projectId}
                    },
                    "userId": user().id,
                    "token": token
                });
                deferred1.success(function (data) {
                    deferred.resolve(data);
                });
                deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            });
            return deferred.promise;
        };

        // ICT场景获取虚拟机列表，可能存在性能问题
        this.getVmList = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var token = undefined;
            var projectId = undefined;

            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/detail?all_tenants=1",
                        o: {novaId: serviceID, projectId: projectId}
                    },
                    "params": {},
                    "userId": user().id,
                    "token": token
                });
                deferred1.success(function (data) {
                    deferred.resolve(data);
                });
                deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            });
            return deferred.promise;
        };

        // 查询已经接入的资源池
        this.queryCloudInfras = function (resPoolType) {
            var deferred = $q.defer();
            var params = {
                "connect-status": "connected",
                "service-status": "normal"
            };
            if (resPoolType && ("" !== resPoolType)) {
                params.type = resPoolType;
            }
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/cloud-infras",
                    o: {
                        "tenant_id": "1"
                    }
                },
                "params": params,
                "userId":user().id
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

        // 查询IT场景下FM的AZ列表
        this.getITAvailableZone = function (cloudInfraId) {
            var deferred = $q.defer();
            var params = {
                    cloudInfraId: cloudInfraId,
                    manageStatus: 'occupied',
                    detail:false
            };
            var deferred1 = camel.post({
                url: "/goku/rest/v1.5/1/available-zones/list",
                "params": JSON.stringify(params),
                "userId":user().id
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

        // 查询IT场景下FM的虚拟机统计信息
        this.getITVmStatistics = function (cloudInfraId) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/vpcs/-1/vms/statistics?cloud-infra={cloud_infra_id}",
                    o: {
                        "tenant_id": "1",
                        "cloud_infra_id":cloudInfraId
                    }
                },
                "params": {},
                "userId":user().id
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

        // 查询ICT场景下FM的虚拟机统计信息
        this.getICTVmStatistics = function (cloudInfraIds) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": "/goku/rest/v1.5/statistics/vms/cloud-infra",
                "params":JSON.stringify({"cloudInfraIds":cloudInfraIds}),
                "timeout":300000,
                "userId":user().id
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

        // 获取一个资源池下带有统计信息的az列表
        this.getItAzStatistics = function (cloudInfraId) {
            var deferred = $q.defer();
            deferred.notify("");
            var azPromise = this.getITAvailableZone(cloudInfraId);
            azPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var azs = data && data.availableZones || [];
                if(azs.length === 0){
                    deferred.resolve([]);
                    return;
                }

                var azIds = [];
                for (var index in azs) {
                    azIds.push(azs[index].id);
                }

                var deferred1 = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/{tenant_id}/statistics/available-zones?cloud-infra={cloud_infra_id}",
                        o: {tenant_id:"1",cloud_infra_id: cloudInfraId}
                    },
                    "params": JSON.stringify({"ids":azIds}),
                    "userId": user().id
                });
                deferred1.success(function (response) {
                    if (!response || !response.capacityAZs) {
                        deferred.resolve([]);
                        return;
                    }
                    var capacityAZs = response.capacityAZs;
                    for (var index in azs) {
                        azs[index].statistics = capacityAZs[azs[index].id];
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
            });
            return deferred.promise;
        };

        // 获取资源池容量信息
        this.getCloudInfraStatistics = function (cloudInfras) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": "/goku/rest/v1.5/statistics/cloud-infra",
                "params": JSON.stringify({"cloudInfraIds":cloudInfras}),
                "timeout":60000,
                "userId": user().id
            });
            deferred1.success(function (data) {
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

        // 获取ICT场景实例的统计信息，包括运行态的虚拟机个数
        this.getICTVmNumbers = function (serviceID) {
            var deferred = $q.defer();
            deferred.notify("");
            var tokenPromise = this.getToken();
            tokenPromise.then(function(data){
                if (!data) {
                    deferred.reject();
                }

                var token = data.id;
                var projectId = data.projectId;

                var deferred1 = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-hypervisors/statistics",
                        o: {"redirect_address_id": serviceID, "tenant_id": projectId}
                    },
                    "params": {},
                    "timeout":60000,
                    "userId": user().id,
                    "token": token
                });
                deferred1.success(function (data) {
                    if (!data) {
                        deferred.reject();
                    }
                    var runningVMs = (data && data.hypervisor_statistics && data.hypervisor_statistics.running_vms) || 0;
                    var res = {
                        run : runningVMs
                    };
                    deferred.resolve(res);
                });
                deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exception.isException(jqXHR)) {
                        deferred.resolve(null);
                        return;
                    }
                    exception.doException(jqXHR, null);
                });
            });
            return deferred.promise;
        };

        // 获取资源池容量信息
        this.todoList = function () {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s:"/goku/rest/v1.5/{vdc_id}/orders",
                    o:{
                        vdc_id:"all"
                    }
                },
                "params": {
                    "handle-user-id":userId,
                    "order-id":"",
                    "status":"approving",
                    "type":"",
                    "start":0
                },
                "userId": userId
            });
            deferred1.success(function (data) {
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

    return homeService;
});