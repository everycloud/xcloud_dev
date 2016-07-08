define(function () {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        // 查询VPC列表
        this.queryVpcs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infras": options.cloudInfraId,
                    "start": options.start,
                    "limit": options.limit
                },
                "timeout": 30000,
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

        this.queryAppBasicInfoResource = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/basicinfo?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
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

        // 查询策略日志列表
        this.queryPolicyLogs = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/policy-logs",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "result": options.result,
                    "name": options.name,
                    "start": options.start,
                    "limit": options.limit,
                    "order": options.order,
                    "sort": options.sort
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

        // SC 查询应用模板关联的服务模板
        this.queryServices4AppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/services-template",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "metadataKey": "vapptemplate",
                    "status": "",
                    "metadataValue": options.id //应用模板id
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

        // 查询计划任务列表
        this.queryScheduleTasks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/schedule-task",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "start": options.start,
                    "limit": options.limit,
                    "order": options.order,
                    "sort": options.sort
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

        //创建计划任务
        this.createScheduleTask = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/schedule-task?cloud-infra={cloud_infra_id} ",
                    o: {
                        "vdc_id": options.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.data),
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

        //删除计划任务
        this.deleteScheduleTask = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/schedule-task/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": {},
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        //修改计划任务
        this.modifyScheduleTask = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: " /goku/rest/v1.5/{vdc_id}/schedule-task/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.data),
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

        //查询计划任务详情
        this.queryScheduleTask = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/schedule-task/{id}/details",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
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

        //查询组建策略列表信息
        this.queryPolicies = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/polices",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
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
        this.queryPoliciesAjax = function (options) {
            var deferred = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/polices",
                    o: {
                        "vdc_id": options.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId
                },
                "userId": options.userId
            });
            return deferred;
        };

        //开启停止计划任务
        this.operatorScheduleTask = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/schedule-task/{id}/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "action": options.action
                }),
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        //触发伸缩
        this.triggerSG = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}/execution?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.params),
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };
        //查询应用日志
        this.queryAppStatistics = function (options) {
            var deferred = $q.defer();
            var cloudInfraId = options.cloudInfraId;
            if (!cloudInfraId) {
                cloudInfraId = "";
            }
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apps/healthy?cloud-infra={cloudInfraId}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloudInfraId": cloudInfraId
                    }
                },
                "userId": options.user.id,
                "params": {}
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

        this.importAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates/actions",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify(options.params),
                "userId": options.user.id,
                "monitor": false
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        this.queryOutput = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/outputs?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.id,
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

        this.queryReport = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/reports?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "mark": options.start,
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

        this.queryResources = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/resources?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.id,
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

        this.exportAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apptemplates/{id}/files",
                    "o": {
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

        this.operateAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apptemplates/{id}/actions",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify(options.params)
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

        this.validateAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apptemplates/validation",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify({
                    "templateBody": options.templateBody,
                    "resPoolType": options.resPoolType
                })
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
                deferred.reject(jqXHR);
            });

            return deferred.promise;
        };

        this.queryAppLog = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/logs?cloud-infra={cloud_infra_id}&status={status}&limit={limit}&start={start}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.appId,
                        "cloud_infra_id": options.cloudInfraId,
                        "status": options.status,
                        "limit": options.limit,
                        "start": options.start,
                        "vpc_id": options.vpcId
                    }
                },
                "params": {},
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

        this.queryAppLog = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/logs?cloud-infra={cloud_infra_id}&status={status}&limit={limit}&start={start}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.appId,
                        "cloud_infra_id": options.cloudInfraId,
                        "status": options.status,
                        "limit": options.limit,
                        "start": options.start,
                        "vpc_id": options.vpcId
                    }
                },
                "params": {},
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

        //启动/停止应用实例
        this.operateAppInstance = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/action?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "vpc_id": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify({
                    "action": options.operate //( ? "Start" : "Stop")
                })
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
                deferred.reject(jqXHR);
            });

            return deferred.promise;
        };

        this.queryAvailableShell = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scripts",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        //查询应用实例拓扑数据
        this.queryAppTopoResource = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/topo",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "vpc_id": options.vpcId
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

        //查询应用实例数据
        this.queryAppOverviewResource = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/overview",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.appId,
                        "vpc_id": options.vpcId
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

        //查询应用实例数据
        this.queryBasicinfoResource = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/basicinfo",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.appId,
                        "vpc_id": options.vpcId
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

        this.queryVpcList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infras": options.cloudInfraId,
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

        //过户
        this.transferApp = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/user/{targetuserid}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.id,
                        "targetuserid": options.targetUserId,
                        "cloud_infra_id": options.resInfraId
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

        //修改应用实例名称和描述
        this.updateAppInstance = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "vpc_id": options.vpcId,
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

        //查看应用实例中的伸缩组详情
        this.queryScalingGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.sgId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
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

        //修改伸缩组详情
        this.modifyScalingGroup = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.sgId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
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

        //添加组内策略
        this.addPolicy = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "groupid": options.sgId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
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

        //操作组内策略： 启动&停止
        this.actionPolicy = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}/actions?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "groupid": options.sgId,
                        "id": options.policyId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
                "params": JSON.stringify({
                    "action": options.action //String YES  组内策略的动作类型，Start / Stop
                })
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

        //操作组内策略： 查看
        this.queryPolicy = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "groupid": options.sgId,
                        "id": options.policyId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
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
                deferred.reject(jqXHR);
            });

            return deferred.promise;
        };

        //操作组内策略： 修改  策略必须处于停止状态才可以修改
        this.modifyPolicy = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "groupid": options.sgId,
                        "id": options.policyId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
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

        //操作组内策略： 删除
        this.deletePolicy = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "groupid": options.sgId,
                        "id": options.policyId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId
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

        this.createApp4Custom = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": JSON.stringify({
                    "appName": options.appName,
                    "appTag": options.appTag,
                    "desc": options.desc,
                    "picture": options.picture,
                    "type": "CUSTOMER",
                    "vms": options.vms
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

        //IT根据板创建应用
        this.createAppByTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": JSON.stringify({
                    "appName": options.appName,
                    "appTag": options.appTag,
                    "desc": options.desc,
                    "picture": options.picture,
                    "templateId": options.templateId,
                    "templateBody": options.body,
                    "parameters": options.parameters
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

        //ICT根据板创建应用
        this.createAppByOpenstack = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": JSON.stringify({
                    "appName": options.appName,
                    "timeout": options.timeout,
                    "desc": options.desc,
                    "picture": options.picture,
                    "templateId": options.templateId,
                    "templateBody": options.body,
                    "parameters": options.parameters
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

        this.queryAz = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
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

        this.updateApp = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vpc_id": options.vpcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify({
                    "appName": options.appName,
                    "timeout": options.timeout,
                    "desc": options.desc,
                    "picture": options.picture,
                    "templateBody": options.templateBody,
                    "parameters": options.parameters
                })
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

        this.queryAvailableVlbTemp = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/elbs",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "vpcid": options.vpcId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAvailableSecurityGroups = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups",
                    o: {
                        "vdc_id" : options.user.vdcId,
                        "vpcid": options.vpcId
                    }
                },
                "params": {
                    "start": options.start,
                    "limit": options.limit,
                    "cloud-infras" : options.cloudInfraId
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
                deferred.reject(jqXHR);
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.queryAvailableVmTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vmtemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "azid": options.azid,
                    "status": options.status,
                    "limit": options.limit,
                    "start": options.start
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

        // 查询虚拟机规格
        this.queryVmFlavors = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vm-flavors",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAvailableSoftPacks = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/softwares",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "limit": options.limit,
                    "start": options.start
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

        this.queryAppVmList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apps/{appId}/vms?cloud-infra={cloudInfraId}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "appId": options.appId,
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
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };

        this.queryAppList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apps",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "cloud-infra": options.cloudInfraId,
                    "status": options.status,
                    "name": options.searchName,
                    "limit": options.displayLength,
                    "start": options.start,
                    "vpcid": options.vpcId
                },
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

        this.queryProcessList = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vms/{vmId}/processList",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "vmId": options.vmId,
                        "appId": options.appId
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

        this.queryServiceTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "visible": options.visible,
                    "status": options.status,
                    "template-id": options.templateId,
                    "name": options.name,
                    "limit": options.limit,
                    "start": options.start
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

        this.createAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates",
                    o: {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify(options.param)
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        this.updateAppTemplate = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates/{id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "userId": options.user.id,
                "params": JSON.stringify(options.param)
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
                deferred.reject(jqXHR);
            });
            return deferred.promise;
        };

        this.queryOsTypeMappings = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apptemplates/ostypes",
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

        //条件查询VLB列表
        this.queryELBsByCondition = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/elbs",
                    "o": {
                        "vdc_id": options.vdcId
                    }
                },
                "userId": options.userId,
                "vpcId": options.vpcId,
                "params": options.data
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

        //刷新VLB
        this.refreshVlbInSG = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}/elbs?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
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

        //删除定时伸缩
        this.deleteScheduleTimeInfo = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}/execution?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
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

        //修改绑定的VLB
        this.modifyVlbInSG = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/scalinggroups/{id}/elbs?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.params)
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

        //刷新VLB---虚拟机
        this.refreshVlbInVm = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apps/{id}/vm/{vmid}/elbs?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "vmid": options.vmId,
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

        //修改绑定的VLB
        this.modifyVlbInVm = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/apps/{id}/vm/{vmid}/elbs?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.vdcId,
                        "id": options.id,
                        "vmid": options.vmId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "userId": options.userId,
                "params": JSON.stringify(options.params)
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

        // 查询虚拟机模板列表
        this.queryVmTemplates = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/vmtemplates",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "vpcId": options.vpcId,
                "params": options.params
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

        this.generateSpec = function (curFlavor) {
            //分别存放概要规格(如:4U|2G|60G)和详细规格(2CPU;2G内存)
            var specArray = [];
            if (!curFlavor) {
                return specArray;
            }
            var overviewSpec = "";
            var detailSpec = "";
            if (curFlavor.cpuCount) {
                overviewSpec += curFlavor.cpuCount;
                overviewSpec += " | ";
                detailSpec += "CPU: ";
                detailSpec += (curFlavor.cpuCount + "vCPU; ");
            }
            if (curFlavor.memSize) {
                overviewSpec += curFlavor.memSize;
                overviewSpec += "M | ";
                detailSpec += "内存: ";
                detailSpec += (curFlavor.memSize + "MB; ");
            }
            if (curFlavor.disks) {
                var diskSize = 0;
                var diskDetail = "";
                for (var i = 0; i < curFlavor.disks.length; i++) {
                    if (curFlavor.disks[i]) {
                        diskSize += curFlavor.disks[i].diskSize;
                        diskDetail += ("磁盘" + curFlavor.disks[i].index + ": ");
                        diskDetail += (curFlavor.disks[i].diskSize + "GB; ");
                    }
                }
                diskSize += "G";
                overviewSpec += diskSize;
                detailSpec += diskDetail;
            }
            var lastSeperatorIndex = detailSpec.lastIndexOf(";");
            if (lastSeperatorIndex >= 0) {
                detailSpec = detailSpec.substring(0, lastSeperatorIndex);
            }
            specArray.overviewSpec = overviewSpec;
            specArray.detailSpec = detailSpec;
            return specArray;
        };

        this.genSerialName = function(name, length){
            if (!length) {
                length = 16;
            }
            if (!name || (name === "")) {
                return "";
            }
            if (name.length < length) {
                return name;
            }

            var newName = null;
            newName = name.substring(0, length - 3) + "...";
            return newName;
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
