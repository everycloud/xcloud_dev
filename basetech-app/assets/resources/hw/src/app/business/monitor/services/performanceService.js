/* global define */
define(["app/services/commonService", "language/keyID"], function (CommonService, i18n) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        var forwardTypeKey = {
            "1": i18n.alarm_config_email_para_type_option_level_value,
            "2": i18n.alarm_config_email_para_type_option_ID_value
        };

        function getForwardType(forwardType) {
            return forwardTypeKey[forwardType];
        }

        // 监控视图条件查询
        this.queryPerformanceView = function (options) {
            var deferred = $q.defer();
            var s = options.user.cloudType === "ICT" ? "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/monitors?cloud-infras={cloud_infras_id}" :
                "/goku/rest/v1.5/{vdc_id}/vpcs/-1/monitors?cloud-infras={cloud_infras_id}";
            var deferred1 = camel.post({
                "url": {
                    "s": s,
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "params": JSON.stringify({
                    "objectType": options.objectType,
                    "topnType": options.topnType,
                    "metrics": options.metrics,
                    "topN": options.topN
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

        //查询告警列表信息
        this.queryAlarms = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "language": options.language,
                    "start": options.start,
                    "limit": options.limit,
                    "inquiryCond": options.inquiryCond
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

        //导出告警列表
        this.exportAlarms = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/file?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "language": options.language,
                    "inquiryCond": options.inquiryCond,
                    "start": options.start,
                    "limit": options.limit
                }),
                "timeout": 120000,
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

        //删除告警、批量删除
        this.deleteAlarm = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": " /goku/rest/v1.5/{vdc_id}/alarms?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "alarmMessage": {
                        "resourceID": options.resourceID,
                        "alarmID": options.alarmID,
                        "sn": options.sn
                    }
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

        //查询告警详情
        this.queryAlarmById = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infras_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "language": options.language,
                    "start": options.start,
                    "limit": options.limit,
                    "inquiryCond": options.inquiryCond
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

        //屏蔽告警
        this.shieldAlarm = function (options) {

        };

        //告警统计
        this.countAlarms = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": " /goku/rest/v1.5/{vdc_id}/alarms/statistic?cloud-infra={cloud_infra_id}&locale={locale}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId,
                        "locale": options.locale
                    }
                },
                "params": JSON.stringify({
                    "conditionList": options.conditionList
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

        //清除告警
        this.clearAlarm = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": " /goku/rest/v1.5/{vdc_id}/alarms/action?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify({
                    "alarmMessage": options.alarmMessage
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
        this.getRecipientsGridViewData = function (data) {
            if (data.recipients == null) {
                return data;
            }
            for (var i = 0; i < data.recipients.length; i++) {
                data.recipients[i].forwardTypeValue = getForwardType(data.recipients[i].forwardType);
                data.recipients[i].isSystemUserValue = (data.recipients[i].isSystemUser == "0" ? i18n.common_term_no_label : i18n.common_term_yes_button);
                data.recipients[i].userName = (data.recipients[i].isSystemUser == "0" ? "-" : data.recipients[i].userName);

                if (data.recipients[i].startTime != null && data.recipients[i].endTime != null) {
                    var startTime = CommonService.utc2Local(data.recipients[i].startTime);
                    var endTime = CommonService.utc2Local(data.recipients[i].endTime);
                    data.recipients[i].sendTimeSection = startTime + "-" + endTime;
                } else {
                    data.recipients[i].sendTimeSection = "-";
                }
            }
            return data;
        };

        //告警设置
        //查询邮件发送列表
        this.queryEmailConfigDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/recipients",
                    "o": {
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

        //查询告警列表
        this.queryEmailAlarms = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/alarms/config",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "userId": options.user.id,
                "params": {
                    "locale": options.option.locale,
                    "alarmname": options.option.alarmname,
                    "start": options.option.start,
                    "limit": options.option.limit
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

        this.getUsersInfo = function (jsonInfo, user, callback) {
            var deferred = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/list",
                    "o": {
                        "vdc_id": user.vdcId
                    }
                },
                "params": jsonInfo,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = data;
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        };
        this.getDefineAlarmInfo = function (reqParams, user, callback) {
            var vdcId = user && user.vdcId;
            var url = "/goku/rest/v1.5/" + vdcId + "/alarms/config?start=" + reqParams.start + "&limit=" + reqParams.limit + "&locale=" + reqParams.locale;
            if (reqParams.compType != "0") {
                url = url + "&comptype=" + reqParams.compType;
            }
            if (reqParams.alarmId != "") {
                url = url + "&alarmid=" + reqParams.alarmId;
            }
            if (reqParams.alarmName != "") {
                url = url + "&alarmname=" + reqParams.alarmName;
            }
            var deferred = camel.get({
                "url": url,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = data;
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        };
        //查询用户列表
        this.queryUser = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/users/list",
                    "o": {
                        "vdc_id": options.user.vdcId
                    }
                },
                "params": JSON.stringify(options.option),
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

        //添加接收人配置
        this.addReceiveConfig = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/recipients?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.recipients),
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

        //修改接收人配置
        this.modifyReceiveConfig = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.put({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/recipients/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.id,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                "params": JSON.stringify(options.recipients),
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

        //查询详情
        this.sendEmailDetail = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/recipients/{id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
                        "id": options.id
                    }
                },
                "params": {
                    "locale": options.locale,
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

        //删除接收人
        this.deleteReceiveConfig = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel["delete"]({
                "url": {
                    "s": "/goku/rest/v1.5/{vdc_id}/alarms/recipients/{id}?cloud-infra={cloud_infra_id}",
                    "o": {
                        "vdc_id": options.user.vdcId,
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
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
