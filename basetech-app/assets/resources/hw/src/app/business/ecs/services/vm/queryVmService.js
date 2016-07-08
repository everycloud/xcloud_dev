/**
 * 查询虚拟机信息服务
 */
/* global define */
define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        //查询VM列表
        this.queryVmList = function (options) {
            var deferred = $q.defer();
            var itParams = {
                "list": {
                    "name": options.name,
                    "ip": options.ip,
                    "networkType": options.networkType,
                    "condition": options.condition,
                    "start": options.start,
                    "limit": options.limit,
                    "status": options.status ? options.status : null,
                    "volumeId": options.volumeId,
                    "availableZoneId": options.azId,
                    "vpcId": options.vpcId,
                    "creatorId": options.creatorId
                }
            };
            if(options.isMount){
                itParams.list.isMount = true;
            }
            var ictParams = {
                "list": {
                    "condition": options.condition,
                    "detail": 0,
                    "limit": options.limit,
                    "start": options.start
                }
            };
            var params = options.isIct?ictParams:itParams;
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(params),
                "userId": options.user.id,
				"timeout": 120000
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

        //查询VM详情vm
        this.queryVmDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "detailLevel": options.detailLevel
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

        //查询VM VNC登录信息
        this.queryVmNoVncInfo = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/novnc-acess-info?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "cloud_infra_id": options.cloudInfraId
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

        //查询VM VNC登录信息
        this.queryVmVncInfo = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/vnc-acess-info?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.vmId,
                        "cloud_infra_id": options.cloudInfraId
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

        // 查询虚拟机告警信息
        this.queryVmAlarm = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/alarms/statistic?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "type": "POST",
                "params": JSON.stringify(options.params),
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

        this.exportMonitorData = function (params) {
            var deferred = $q.defer();
            var requestParams = {
                "objectId": params.objectId,
                "objectType": "vm",
                "metrics": params.metrics,
                "timeRange": params.timeRange,
                "startTime": params.startTime,
                "endTime": params.endTime
            };
            var deferred1 = camel.post({
                "url": {
                     s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/monitors/file?cloud-infras={cloud_infras_id}&locale={locale}",
                    o: {
                        "vdc_id": params.user.vdcId,
                        "cloud_infras_id": params.cloudInfraId,
                        "vpc_id":params.vpcId,
                        "locale": params.locale
                    }
                },
                "params": JSON.stringify(requestParams),
                "userId": params.user.id,
                "vpcId": params.vpcId
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

        // 查询虚拟机监控信息
        this.queryVmMonitor = function (options) {
            var deferred = $q.defer();
            var request = {
                "perfMonitorBasicInfo": {
                    "objectId": options.vmId,
                    "objectType": "vm",
                    "metrics": ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_in_ps", "disk_out_ps"]
                }
            };
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/monitors/realtime?cloud-infras={cloud_infras_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id":options.vpc_id,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify(request)
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
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates",
                    o: {
                        "vdc_id": options.user.vdcId
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

        // 查询虚拟机模板详情
        this.queryVmTemplateDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.templateId
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

        // 查询虚拟机规格
        this.queryConfigTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vm-flavors",
                    o: {
                        "vdc_id": options.user.vdcId
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
                    s: "/goku/rest/v1.5/{vdc_id}/tags",
                    o: {
                        "vdc_id": options.user.vdcId
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

        this.queryVmStatistics = function (options) {
            var defered = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/statistics?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.user.id,
                "params": {}
            });
            deferred1.success(function (data) {
                defered.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    defered.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });

            return defered.promise;
        };

        // 查询组织配额
        this.queryOrgQuota = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/vdcs/{id}",
                    o: {
                        "id": options.vdcId
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
        //查询资源池下虚拟机统计
        this.queryVmStatusStatistics = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/statistics",
                    o: {
                        "vdc_id": options.vdcId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
                },
                "userId": options.userId,
                "timeout": 30000
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

        // 导出虚拟机列表到excel
        this.exportVms2Excel = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/file?cloud-infra={cloud_infra_id}&locale={locale}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId,
                        "locale": options.locale
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id,
				"timeout": 600000
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
