/**
 * Created on 14-4-16.
 * 查询虚拟机信息服务
 */
define(['tiny-lib/underscore'], function (_) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VM列表
        this.queryNews = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/homeNews",
                    o: {
                        "vdc_id": options.user.vdcId,
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

        this.queryVmCreateStatistic = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmCreateStatistic",
                    o: {
                        "vdc_id": options.user.vdcId
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

        this.queryOrgQuota = function(options){
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/vdcs/{id}",
                    o: {
                        "id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "timeout": 60000
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

        this.calculateAvailableVm = function(orgInfo, vCpuCount, memerySize){
            if (!orgInfo || !orgInfo.quotaUsage || !orgInfo.quotaInfo){
                return null;
            }
            if (!vCpuCount || !memerySize){
                return null;
            }
            var cpuTotal = -1;
            var cpuUsed = -1;
            var memoryTotal = -1;
            var memoryUsed = -1;
            var usedVm = -1;
            _.each(orgInfo.quotaInfo, function(item, index){
                if (item.quotaName === "CPU"){
                    cpuTotal = item.limit;
                }
                if (item.quotaName === "MEMORY"){
                    memoryTotal = item.limit;
                }
            });
            _.each(orgInfo.quotaUsage, function(item, index){
                if (item.quotaName === "CPU"){
                    cpuUsed = item.value;
                }
                if (item.quotaName === "MEMORY"){
                    memoryUsed = item.value;
                }
                if (item.quotaName === "VM"){
                    usedVm = item.value;
                }
            });
            if (usedVm < 0){
                return null;
            }
            if ((cpuTotal < 0) || (cpuUsed < 0) || (memoryTotal < 0) || (memoryUsed < 0)){
                return null;
            }
            var maxByCpu = (cpuTotal - cpuUsed)/vCpuCount;
            var maxByMem = (memoryTotal - memoryUsed)/memerySize;
            var curMax = Math.min(maxByCpu, maxByMem);
            curMax = Math.floor(Math.max(0, curMax));
            return {
                "usedVm": usedVm,
                "unusedVm": curMax
            };
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});