define(["jquery", "tiny-lib/angular",
    "app/services/httpService",
    "app/services/commonService",
    "language/keyID"
], function ($, angular, httpService, CommonService,i18n) {
    "use strict";

    var TIMEOUT = 60000;

    var severityKey = {
        "1":  i18n.alarm_term_critical_label,
        "2":  i18n.alarm_term_major_label,
        "3":  i18n.alarm_term_minor_label,
        "4":  i18n.alarm_term_warning_label,
        "5":  i18n.common_term_unknown_value
    }
    var clearTypeKey = {
        "0": i18n.common_term_autoClear_label,
        "2":  i18n.common_term_manualClear_label,
        "5":  i18n.alarm_term_clearTypeAbnormal_value,
        "-": "-"
    }
    var forwardTypeKey = {
        "1": i18n.alarm_config_email_para_type_option_level_value,
        "2": i18n.alarm_config_email_para_type_option_ID_value
    }
    var snmpVersionKey = {
        "2": "SNMPv2c",
        "3": "SNMPv3"
    }

        function getForwardType(forwardType) {
            return forwardTypeKey[forwardType];
        };

    function getSnmpVersion(snmpVersion) {
        return snmpVersionKey[snmpVersion];
    };

    function getSeverity(severity) {
        return severityKey[severity] || severityKey["5"];
    };

    function getClearType(clearType) {
        return clearTypeKey[clearType] || "-";
    };

    function getSnmpClientGridViewData(data) {

        if(data.snmpClients == undefined)
        {
            return data;
        }

        for (var i = 0; i < data.snmpClients.length; i++) {
            data.snmpClients[i].snmpVersionValue = getSnmpVersion(data.snmpClients[i].snmpVersion);
        }
        return data;
    };

    function getRecipientsGridViewData(data) {

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

    function getGridViewData(data) {
        if( data.alarmlist == undefined)
        {
            return data;
        }
        for (var i = 0; i < data.alarmlist.length; i++) {
            data.alarmlist[i].severityValue = getSeverity(data.alarmlist[i].severity);
            data.alarmlist[i].clearType = getClearType(data.alarmlist[i].clearType);
            if (data.alarmlist[i].clearTime != "-") {
                data.alarmlist[i].clearTime = CommonService.utc2Local(data.alarmlist[i].clearTime);
            }
            data.alarmlist[i].occurTime = CommonService.utc2Local(data.alarmlist[i].occurTime);

            data.alarmlist[i].detail = {
                contentType: "url",
                content: "app/business/monitor/views/alarmDetail.html"
            }
        }
        return data;
    };

    function getThreshold(iRow, id, metricDesc) {
        var o = {};
        o.show = iRow.level == 0 ? true : false;
        o.pid = iRow.pid;
        o.level = iRow.level;
        o.compName = iRow.level == 0 ? "" : iRow.compName;
        o.metricId = iRow.id;
        o.thresholdId = iRow.level == 0 ? "" : iRow.thresholdId;
        o.id = id;
        o.metricDesc = metricDesc;
        o.objectType = iRow.level == 0 ? "" : iRow.objectType;
        o.objectTypeDesc = iRow.level == 0 ? "" : iRow.objectTypeDesc;
        o.unit = iRow.level == 0 ? "" : iRow.unit;
        o.critical = iRow.level == 0 ? "" : iRow.critical;
        o.major = iRow.level == 0 ? "" : iRow.major;
        o.minor = iRow.level == 0 ? "" : iRow.minor;
        o.warning = iRow.level == 0 ? "" : iRow.warning;
        o.eviValue = iRow.level == 0 ? "" : iRow.eviValue;
        o.compType = iRow.compType;
        o.sheild = iRow.sheild;
        o.alarmidListView = "";
        o.criticalDesc = "";
        o.majorDesc = "";
        o.minorDesc = "";
        o.warningDesc = "";
        o.eviValueDesc = "";
        if(iRow.level == 0)
        {
            o.alarmidList = iRow.alarmidList;
        }
        if (iRow.level == 1) {
            o.criticalDesc = (o.critical == 65535 ?  i18n.common_term_noTurnOn_value: (o.compType == "OpenStack" ? ">" : ">=") + o.critical + o.unit);
            o.majorDesc = (o.major == 65535 ? i18n.common_term_noTurnOn_value : (o.compType == "OpenStack" ? ">" : ">=") + o.major + o.unit);
            o.minorDesc = (o.minor == 65535 ? i18n.common_term_noTurnOn_value : (o.compType == "OpenStack" ? ">" : ">=") + o.minor + o.unit);;
            o.warningDesc = (o.warning == 65535 ? i18n.common_term_noTurnOn_value : (o.compType == "OpenStack" ? ">" : ">=") + o.warning + o.unit);
            o.eviValueDesc = (o.eviValue == 65535 ? "-" : ">=" + o.eviValue + o.unit);

            o.alarmidList = iRow.alarmidList;
            o.alarmidListView = iRow.alarmidList.join(",");
        }

        return o;
    }

    function getThresholdGridViewData(data) {
        var dataList = [];
        var alarmThreshList = (data && data.alarmThreshList) || [];

        for (var i = 0,len=alarmThreshList.length; i<len; i++) {
            var alarmThreshItem = alarmThreshList[i];
            var alarmidList = [];
            alarmThreshItem.level = 0;
            alarmThreshItem.pid = "-1";
            alarmThreshItem.alarmidList = alarmidList;

            for (var j = 0,subLen = alarmThreshItem.alarmThreshList.length; j<subLen; j++) {
                var subAlarmThreshItem = alarmThreshItem.alarmThreshList[j];
                alarmThreshItem.alarmidList = alarmThreshItem.alarmidList.concat(subAlarmThreshItem.alarmidList);

                alarmThreshItem.compType = subAlarmThreshItem.compType;
                alarmThreshItem.sheild = subAlarmThreshItem.sheild;
                !j && dataList.push(getThreshold(alarmThreshItem, alarmThreshItem.id, alarmThreshItem.metricDesc));
                subAlarmThreshItem.level = 1;
                subAlarmThreshItem.pid = alarmThreshItem.id;
                dataList.push(getThreshold(subAlarmThreshItem, alarmThreshItem.id, alarmThreshItem.metricDesc));
            }
        }
        return dataList;
    };
    var service = {
        "getAlarmListInfos": function (queryJsonInfo, user, callback,monitor, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms";
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms";
            }
            var http = new httpService();
            var deferred = http.post({
                "url": urlChoose,
                "params": queryJsonInfo,
				"monitor" : monitor,
                "timeout": TIMEOUT,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = getGridViewData(data);
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        },
        "getAlarmDetailInfos": function (queryJsonInfo, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/alarms/detail",
                "timeout": TIMEOUT,
                "params": queryJsonInfo
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                data.severity = getSeverity(data.severity);
                data.clearType = getClearType(data.clearType);
                value.data = data;
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        },
        "clearAlarms": function (jsonParamsInfo, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/action";
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/action";
            }
            var http = new httpService();
            var deferred = http.post({
                "url": urlChoose,
                "timeout": TIMEOUT,
                "params": jsonParamsInfo,
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
        },
        "addShieldAlarms": function (jsonParamsInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/1/alarms/shield-configs",
                "timeout": TIMEOUT,
                "params": jsonParamsInfo,
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
        },
        "exportExcel": function (queryJsonInfo, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/file";
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/file";
            }
            var http = new httpService();
            var deferred = http.post({
                "url": urlChoose,
                "timeout": 120000,
                "params": queryJsonInfo,
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
        },
        "getAlarmsStatisticInfo": function (queryJsonInfo, locale, user, callback ,isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/statistic?locale=" + locale;
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/statistic?locale=" + locale;
            }
            var http = new httpService();
            var deferred = http.post({
                "url": urlChoose,
                "timeout": TIMEOUT,
                "params": queryJsonInfo,
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
        },
        "getShieldAlarmInfo": function (reqParams, user, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/1/alarms/shield-configs?locale=" + reqParams.language + "&start=" + reqParams.start + "&limit=" + reqParams.limit,
                "timeout": TIMEOUT,
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
        },
        "getDefineAlarmInfo": function (reqParams, user, callback) {
            var vdcId = (user && user.vdcId) || "1";
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
            var http = new httpService();
            var deferred = http.get({
                "url": url,
                "timeout": TIMEOUT,
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
        },
        "cancelShieldAlarm": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/1/alarms/shield-configs/action",
                "timeout": TIMEOUT,
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
        },
        "addAlarmShieldAlarm": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/1/alarms/shield-configs",
                "timeout": TIMEOUT,
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
        },
        "getSnmpClientList": function (reqParams, user, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/1/snmpclients?start=" + reqParams.start + "&limit=" + reqParams.limit,
                "timeout": TIMEOUT,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = getSnmpClientGridViewData(data);
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        },
        "removeSnmpClient": function (id, user, callback) {
            var http = new httpService();
            var deferred = http.delete({
                "url": "/goku/rest/v1.5/1/snmpclients/" + id,
                "timeout": TIMEOUT,
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
        },
        "modifySnmpClient": function (jsonInfo, id, user, callback) {
            var http = new httpService();
            var deferred = http.put({
                "url": "/goku/rest/v1.5/1/snmpclients/" + id,
                "timeout": TIMEOUT,
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
        },
        "addSnmpClient": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/1/snmpclients",
                "timeout": TIMEOUT,
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
        },
        "getThresholdData": function (locale,user, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/1/alarms/threshold-configs?locale=" + locale,
                "timeout": TIMEOUT,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = getThresholdGridViewData(data);
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        },
        "modifyThreshold": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.put({
                "url": "/goku/rest/v1.5/1/alarms/threshold-configs",
                "timeout": TIMEOUT,
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
        },
        "getRecipients": function (user, callback ,isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/recipients";
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/recipients";
            }
            var http = new httpService();
            var deferred = http.get({
                "url": urlChoose,
                "timeout": TIMEOUT,
                "userId": user.id
            });
            var value = {};
            deferred.success(function (data) {
                value.result = true;
                value.data = getRecipientsGridViewData(data);
                callback(value);
            });
            deferred.fail(function (data) {
                value.result = false;
                value.data = data;
                callback(value);
            });
        },
        "getUsersInfo": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/1/users/list",
                "timeout": TIMEOUT,
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
        },
        "getRecipientAlarmInfo": function (id, locale, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/recipients/" + id + "?locale=" + locale;
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/recipients/" + id + "?locale=" + locale;
            }
            var http = new httpService();
            var deferred = http.get({
                "url": urlChoose,
                "timeout": TIMEOUT,
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
        },
        "modifyRecipientAlarmInfo": function (jsonInfo, id, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/recipients/" + id;
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/recipients/" + id;
            }
            var http = new httpService();
            var deferred = http.put({
                "url": urlChoose,
                "timeout": TIMEOUT,
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
        },
        "addRecipientAlarmInfo": function (jsonInfo, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/recipients";
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/recipients";
            }
            var http = new httpService();
            var deferred = http.post({
                "url": urlChoose,
                "timeout": TIMEOUT,
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
        },
        "removeRecipientAlarmInfo": function (id, user, callback, isLocal) {
            var urlChoose = "/goku/rest/v1.5/1/alarms/recipients/" + id;
            if(isLocal){
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/recipients/" + id;
            }
            var http = new httpService();
            var deferred = http.delete({
                "url": urlChoose,
                "timeout": TIMEOUT,
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
        },
        "getMailServerConfigInfo": function (user, callback) {
            var http = new httpService();
            var deferred = http.get({
                "url": "/goku/rest/v1.5/system/mail-configs",
                "timeout": TIMEOUT,
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
        },
        "modifyMailServerConfigInfo": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/system/mail-configs",
                "timeout": TIMEOUT,
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
        },
        "testMailServerConfigInfo": function (jsonInfo, user, callback) {
            var http = new httpService();
            var deferred = http.post({
                "url": "/goku/rest/v1.5/system/mail-configs/action",
                "timeout": TIMEOUT,
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
        }
    };
    return service;
});
