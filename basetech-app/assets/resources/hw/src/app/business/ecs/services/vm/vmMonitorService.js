/**
 * 查询虚拟机信息服务
 */
/* global define */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        this.queryVmProcessMonitor = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/{vm_id}/processes/{processId}?pvmip={pvmip}&cloud-infra={cloudInfraId}&querydata=true",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vm_id": options.vmId,
                        "processId": options.processId,
                        "cloudInfraId": options.cloudInfraId,
                        "pvmip": options.pvmip
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

        this.queryVmProcessList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s:"/goku/rest/v1.5/{vdc_id}/vms/{vmId}/processes?cloud-infra={cloudInfraId}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vmId": options.vmId,
                        "cloudInfraId": options.cloudInfraId
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
                try{
                    var resp = JSON.parse(jqXHR.responseText);
                    if(resp && resp.code === "5880005"){
                        return;
                    }
                }catch(e){
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.configVmProcessMonitor = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/configProcessMonitor?vmId={vmId}&processId={processId}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vmId": options.vmId,
                        "processId": options.processId
                    }
                },
                "params": JSON.stringify(options),
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

        // 查询进程业务监控
        this.getVmBusinessMonitor = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/{vm_id}/processes/{processes_id}/alerts",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vm_id": options.param.vmId,
                        "processes_id": options.param.processId
                    }
                },
                "params": options.param,
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
        this.configVmBusinessMonitor = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/{vm_id}/processes/{processes_id}/alerts?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vm_id": options.config.vmId,
                        "processes_id": options.config.processId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.config),
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