define(["can/util/fixture/fixture"], function (fixture) {
    var thresholdDataView = {
        "alarmThreshList": [
            {
                "id": "1001",
                "metricDesc": "Storage allocation rate",
                "alarmThreshList": [
                    {
                        "thresholdId": "1001",
                        "alarmidList": ["1001", "1002", "1003"],
                        "objectType": "VDC1",
                        "objectTypeDesc": "VDC",
                        "unit": "%",
                        "critical": 10,
                        "major": 20,
                        "minor": 30,
                        "warning": 40,
                        "eviValue": 0,
                        "compType": "OpenStack",
                        "sheild": false
                    },
                    {
                        "thresholdId": "1002",
                        "alarmidList": ["1001", "1002", "1003"],
                        "objectType": "VDC2",
                        "objectTypeDesc": "VDC",
                        "unit": "个",
                        "critical": 1,
                        "major": 2,
                        "minor": 3,
                        "warning": 4,
                        "eviValue": 6,
                        "compType": "FC",
                        "sheild": true
                    }
                ]
            },
            {
                "id": "1002",
                "metricDesc": "Downstream network bandwidth",
                "alarmThreshList": [
                    {
                        "thresholdId": "1001",
                        "alarmidList": ["1001", "1002", "1003"],
                        "objectType": "Host1",
                        "objectTypeDesc": "Host",
                        "unit": "℃",
                        "critical": 65535,
                        "major": 65535,
                        "minor": 65535,
                        "warning": 65535,
                        "eviValue": 15,
                        "compType": "FC",
                        "sheild": true
                    },
                    {
                        "thresholdId": "1002",
                        "alarmidList": ["1001", "1002", "1003"],
                        "objectType": "Host02",
                        "objectTypeDesc": "Host",
                        "unit": "℃",
                        "critical": 65535,
                        "major": 20,
                        "minor": 65535,
                        "warning": 40,
                        "eviValue": 15,
                        "compType": "FC",
                        "sheild": false
                    }
                ]
            }
        ]
    };

    var hardwareDataView = {
        "code": 0,
        "total": 0,
        "metricInfo": {
            "host.mem.totalsize": {"unit": "%", "metricId": "", "metricValue": "6144"},
            "host.cpu.totalfreq": {"unit": "%", "metricId": "", "metricValue": "2048"},

            "host.disk.totalsize": {"unit": "%", "metricId": "", "metricValue": "6144"},
            "host.logicdisk.totalsize": {"unit": "%", "metricId": "", "metricValue": "2048"},

            "bios_vendor": {"unit": "%", "metricId": "", "metricValue": "American Megatrends Inc."},
            "bios_version": {"unit": "%", "metricId": "", "metricValue": "CTSAV036"},
            "bios_release_date": {"unit": "%", "metricId": "", "metricValue": "04/27/2011"},
            "board_mfg": {"unit": "%", "metricId": "", "metricValue": "Huawei Technologies Co., Ltd."},
            "board_prod": {"unit": "%", "metricId": "", "metricValue": "BC11BTSA"},
            "board_version": {"unit": "%", "metricId": "", "metricValue": "V100R001"},
            "board_serial": {"unit": "%", "metricId": "", "metricValue": "020PEV10B7002883"},
            "product_mfg": {"unit": "%", "metricId": "", "metricValue": "Huawei Technologies Co., Ltd."},
            "product_name": {"unit": "%", "metricId": "", "metricValue": "Tecal RH2285 "},
            "product_version": {"unit": "%", "metricId": "", "metricValue": "V100R001"},
            "product_serial": {"unit": "%", "metricId": "", "metricValue": "210231771610B8000243"},

            "power0.id": {"unit": "%", "metricId": "", "metricValue": "1001"},
            "power0.power": {"unit": "%", "metricId": "", "metricValue": "237.0"},
            "power0.status": {"unit": "%", "metricId": "", "metricValue": "Normal"},
            "power1.id": {"unit": "%", "metricId": "", "metricValue": "2001"},
            "power1.power": {"unit": "%", "metricId": "", "metricValue": "200"},
            "power1.status": {"unit": "%", "metricId": "", "metricValue": "Not normal"},

            "disk1.name": {"unit": "%", "metricId": "", "metricValue": "1001"},
            "disk1.size": {"unit": "%", "metricId": "", "metricValue": "237.0"},
            "disk2.name": {"unit": "%", "metricId": "", "metricValue": "1002"},
            "disk2.size": {"unit": "%", "metricId": "", "metricValue": "237.0"},
            "disk3.name": {"unit": "%", "metricId": "", "metricValue": "1003"},
            "disk3.size": {"unit": "%", "metricId": "", "metricValue": "237.0"},

            "logicdisk1.name": {"unit": "%", "metricId": "", "metricValue": "1001"},
            "logicdisk1.size": {"unit": "%", "metricId": "", "metricValue": "237.0"},
            "logicdisk1.used": {"unit": "%", "metricId": "", "metricValue": "207.0"},
            "logicdisk1.usage": {"unit": "%", "metricId": "", "metricValue": "90%"},
            "logicdisk1.mounted_dir": {"unit": "%", "metricId": "", "metricValue": "/opt"},

            "cpu1.seq": {"unit": "%", "metricId": "", "metricValue": "10001"},
            "cpu1.version": {"unit": "%", "metricId": "", "metricValue": "V2"},
            "cpu1.max_speed": {"unit": "%", "metricId": "", "metricValue": "5000"},
            "cpu1.core_count": {"unit": "%", "metricId": "", "metricValue": "2"},
            "cpu1.thread_count": {"unit": "%", "metricId": "", "metricValue": "30"},
            "cpu1.status": {"unit": "%", "metricId": "", "metricValue": "Normal"},
            "cpu1.temperature": {"unit": "%", "metricId": "", "metricValue": "54"},
            "cpu1.serials": {"unit": "%", "metricId": "", "metricValue": "1000001"},
            "cpu1.family": {"unit": "%", "metricId": "", "metricValue": "20001"},
            "cpu1.manufacturer": {"unit": "%", "metricId": "", "metricValue": "V100R002C10"},

            "mem1.locator": {"unit": "%", "metricId": "", "metricValue": "10001"},
            "mem1.type": {"unit": "%", "metricId": "", "metricValue": "V2"},
            "mem1.size": {"unit": "%", "metricId": "", "metricValue": "5000"},
            "mem1.manufacturer": {"unit": "%", "metricId": "", "metricValue": "2"},
            "mem1.status": {"unit": "%", "metricId": "", "metricValue": "Normal"},

            "nic0.id": {"unit": "%", "metricId": "", "metricValue": "10001"},
            "nic0.type": {"unit": "%", "metricId": "", "metricValue": "V2"},
            "nic1.id": {"unit": "%", "metricId": "", "metricValue": "10002"},
            "nic1.type": {"unit": "%", "metricId": "", "metricValue": "V2"},
            "nic2.id": {"unit": "%", "metricId": "", "metricValue": "10003"},
            "nic2.type": {"unit": "%", "metricId": "", "metricValue": "V2"},

            "eth0.name": {"unit": "%", "metricId": "", "metricValue": "PORT1"},
            "eth0.speed": {"unit": "%", "metricId": "", "metricValue": "1000"},
            "eth0.workmode": {"unit": "%", "metricId": "", "metricValue": "Full duplex"},
            "eth0.mac": {"unit": "%", "metricId": "", "metricValue": "80:fb:06:b0:7c:e9"},
            "eth1.name": {"unit": "%", "metricId": "", "metricValue": "PORT2"},
            "eth1.speed": {"unit": "%", "metricId": "", "metricValue": "1000"},
            "eth1.workmode": {"unit": "%", "metricId": "", "metricValue": "Full duplex"},
            "eth1.mac": {"unit": "%", "metricId": "", "metricValue": "80:fb:06:b0:7c:e1"},

            "fan0.id": {"unit": "%", "metricId": "", "metricValue": "101"},
            "fan0.speed": {"unit": "%", "metricId": "", "metricValue": "8925"},
            "fan0.status": {"unit": "%", "metricId": "", "metricValue": "Normal"},
            "fan1.id": {"unit": "%", "metricId": "", "metricValue": "201"},
            "fan1.speed": {"unit": "%", "metricId": "", "metricValue": "100"},
            "fan1.status": {"unit": "%", "metricId": "", "metricValue": "Not Normal"}
        }
    };
    var snmpClientDataView = {
        "total": 2,
        "snmpClients": [
            {
                "snmpVersion": "2",
                "readName": "readName",
                "writeName": "writeName",
                "userName": "userName",
                "authGeneric": "MD5",
                "authPassWord": "authPassWord",
                "privacyProtocol": "MD5",
                "privPassWord": "privPassWord",
                "outTime": 3000,
                "name": "NetScaler",
                "id": "1000001",
                "type": "NetScaler",
                "description": "Part Description",
                "ip": "192.168.71.30",
                "port": 8080
            },
            {
                "snmpVersion": "3",
                "readName": "readName",
                "writeName": "writeName",
                "userName": "userName",
                "authGeneric": "MD5",
                "authPassWord": "authPassWord",
                "privacyProtocol": "MD5",
                "privPassWord": "privPassWord",
                "outTime": 3000,
                "name": "NetScaler",
                "id": "1000002",
                "type": "SVN",
                "description": "Part Description",
                "ip": "192.168.71.31",
                "port": 8081
            }
        ]
    }

    var exportExcelView = {
        "alarmExportPath": "alarm.xsl"
    };
    var usbDataView = {
        "usbs": [
            {
                "usbId": "1001",
                "usbKey": 1,
                "hostId": "100001",
                "productId": "101",
                "description": "11111",
                "status": "connected",
                "vmId": "100000001",
                "allocateStatus": "Allocated",
                "isEnableMigrate": "true",
                "usbControllerType": "11",
                "version": "v1"
            }
        ]
    };
    var alarmData = {
        "alarmList": [
            {
                "showDetail": "",
                "checked": true,
                "id": "1",
                "alarmName": "NTP Server Is Not Configured for a VSAM",
                "alarmSeverity": "Major",
                "alarmObject": "vsam:192.168.1.1",
                "objectType": "VSAM",
                "component": "vsam",
                "componentType": "VSAM",
                "generatedTime": "2014-01-18 05:01:00",
                "clearedTime": "",
                "clearedType": "Manually Clear",
                "operation": ""
            },
            {
                "showDetail": "",
                "checked": false,
                "id": "2",
                "alarmName": "License File Is Not Loaded",
                "alarmSeverity": "Critical",
                "alarmObject": "site-license",
                "objectType": "Site",
                "component": "GE",
                "componentType": "FusionCompute",
                "generatedTime": "2014-01-20 05:01:00",
                "clearedTime": "",
                "clearedType": "Auto Clear",
                "operation": ""
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };

    var alarmDataView = {
        "total": 3,
        "alarmlist": [
            {
                "alarmId": "1",
                "alarmName": "NTP Server Is Not Configured for a VSAM",
                "compType": "FusionCompute",
                "moc": "Critical",
                "resourceID": "1001",
                "resourceName": "Site",
                "sn": 10011001100,
                "category": "1",
                "severity": 1,
                "occurTime": "2014-01-20 05:01:00",
                "clearTime": "2014-01-20 05:01:00",
                "isAutoClear": 0,
                "clearType": "2",
                "location": "",
                "additionalInfo": "NTP Server Is Not Configured for a VSAM",
                "urlHelp": "alerm/help/cn/ALARM001.html",
                "userofclear": "admin",
                "compName": "FusionCompute",
                "compId": "FusionCompute"
            },
            {
                "alarmId": "2",
                "alarmName": "NTP Server Is Not Configured for a VSAM",
                "compType": "FusionCompute",
                "moc": "Critical",
                "resourceID": "1002",
                "resourceName": "Site",
                "sn": 10011001101,
                "category": "2",
                "severity": 2,
                "occurTime": "2014-01-21 05:01:00",
                "clearTime": "2014-01-21 05:01:00",
                "isAutoClear": 0,
                "clearType": "2",
                "location": "",
                "additionalInfo": "NTP Server Is Not Configured for a VSAM",
                "urlHelp": "alerm/help/cn/ALARM001.html",
                "userofclear": "admin",
                "compName": "FusionCompute",
                "compId": "FusionCompute"
            },
            {
                "alarmId": "3",
                "alarmName": "NTP Server Is Not Configured for a VSAM",
                "compType": "FusionCompute",
                "moc": "Critical",
                "resourceID": "1003",
                "resourceName": "Site",
                "sn": 10011001102,
                "category": "1",
                "severity": 3,
                "occurTime": "2014-01-22 05:01:00",
                "clearTime": "2014-01-22 05:01:00",
                "isAutoClear": 0,
                "clearType": "0",
                "location": "",
                "additionalInfo": "NTP Server Is Not Configured for a VSAM",
                "urlHelp": "alerm/help/cn/ALARM001.html",
                "userofclear": "admin",
                "compName": "FusionCompute",
                "compId": "FusionCompute"
            }
        ]
    };

    var alarmDataDetailView = {
        "alarmId": "1",
        "alarmName": "NTP Server Is Not Configured for a VSAM",
        "compType": "FusionCompute",
        "moc": "Critical",
        "resourceID": "1001",
        "resourceName": "Site",
        "sn": 10011001100,
        "category": "FusionCompute",
        "severity": "1",
        "occurTime": "2014-01-20 05:01:00",
        "clearTime": "2014-01-20 05:01:00",
        "isAutoClear": 0,
        "clearType": "0",
        "location": "",
        "additionalInfo": "NTP Server Is Not Configured for a VSAM",
        "urlHelp": "alerm/help/cn/ALARM001.html",
        "userofclear": "admin",
        "compName": "FusionCompute",
        "compId": "FusionCompute"
    };
    var emailList =
    {"recipients": [
        {
            "recipientId":"2",
            "isSystemUser":"0",
            "userName":"opeuser",
            "userId":"36",
            "recipient":"street@huawei.com",
            "startTime":"2014-09-01 06:21:56",
            "endTime":"2014-09-04 06:21:56",
            "forwardType":1,
            "orgId":"1"
        },
        {
            "recipientId":"3",
            "isSystemUser":"1",
            "userName":"sysadmin",
            "userId":"45",
            "recipient":"adreee@huwaei.com",
            "startTime":"2014-08-01 06:21:56",
            "endTime":"2014-09-01 06:21:56",
            "forwardType":1,
            "orgId":"1"}
    ]};
    var emailDetailList =
    {"emailDetails":[
        {"recipientId":"2","isSystemUser":"0","userName":"null","userId":"null","recipient":"abdedc@huawei.com","startTime":"2014-09-01 06:21:56","endTime":"2014-09-04 06:21:56","forwardType":1,"orgId":"1","levelList":["critical"],"receiveAlarms":null},
        {"recipientId":"3","isSystemUser":"1","userName":"xqk","userId":"45","recipient":"adtestsss@huwaei.com","startTime":"2014-08-01 06:21:56","endTime":"2014-09-01 06:21:56","forwardType":1,"orgId":"1","levelList":["critical"],"receiveAlarms":null}

    ]
    }
    var threholdList = [
        {
            "showDetail": "",
            "alarmId": "1000001",
            "alarmIndex": "CPU occupancy rate",
            "objType": "Virtual Machine",
            "object": "2014-02-18 10:00:00",
            "criticalAlarm": ">80%",
            "majorAlarm": ">60%",
            "minorAlarm": ">40%",
            "trivialAlarm": ">20%",
            "offset": "5",
            "opts": ""
        },
        {
            "showDetail": "",
            "alarmId": "1000001",
            "alarmIndex": "CPU occupancy rate",
            "objType": "Virtual Machine",
            "object": "2014-02-18 10:00:00",
            "criticalAlarm": ">80%",
            "majorAlarm": ">60%",
            "minorAlarm": ">40%",
            "trivialAlarm": ">20%",
            "offset": "5",
            "opts": ""
        }
    ];

    var shieldAlarmDataView = {
        "total": 5,
        "shieldAlarmList": [
            {
                "alarmid": "1000001",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA01",
                "user": "admin"
            },
            {
                "alarmid": "1000002",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA02",
                "user": "admin"
            },
            {
                "alarmid": "1000003",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA03",
                "user": "admin"
            },
            {
                "alarmid": "1000004",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA04",
                "user": "admin"
            },
            {
                "alarmid": "1000005",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA05",
                "user": "admin"
            }
        ]
    }
    var defineAlarmDataView = {
        "total": 5,
        "alarmList": [
            {
                "alarmId": "1000001",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA01"
            },
            {
                "alarmId": "1000002",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA02"
            },
            {
                "alarmId": "1000003",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA03"
            },
            {
                "alarmId": "1000004",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA04"
            },
            {
                "alarmId": "1000005",
                "compType": "FusionCompute",
                "alarmName": "FMAL_RMA05"
            }
        ]
    }
    var shieldList = [
        {
            "showDetail": "",
            "alarmId": "1000001",
            "alarmName": "FMAL_RMA01",
            "objectType": "Virtual Machine",
            "shieldObj": "2014-02-18 10:15:00",
            "createUser": "admin",
            "opts": ""
        },
        {
            "showDetail": "",
            "alarmId": "1000001",
            "alarmName": "FMAL_RMA01",
            "objectType": "Virtual Machine",
            "shieldObj": "2014-02-22 8:10:00",
            "createUser": "admin",
            "opts": ""
        }
    ];
    var alarmStatisticDataView = {
        "value": [
            {
                "objectId": "1001",
                "moc": "FusionCompute",
                "alarmId": "1001",
                "alarmName": "FusionCompute",
                "alarmLevel": "1",
                "alarmNum": 1
            },
            {
                "objectId": "1002",
                "moc": "FusionCompute",
                "alarmId": "1002",
                "alarmName": "FusionCompute",
                "alarmLevel": "1",
                "alarmNum": 2
            },
            {
                "objectId": "1003",
                "moc": "FusionCompute",
                "alarmId": "1003",
                "alarmName": "FusionCompute",
                "alarmLevel": "1",
                "alarmNum": 3
            },
            {
                "objectId": "1004",
                "moc": "FusionCompute",
                "alarmId": "1001",
                "alarmName": "FusionCompute",
                "alarmLevel": "4",
                "alarmNum": 4
            },
            {
                "objectId": "1005",
                "moc": "FusionCompute",
                "alarmId": "1005",
                "alarmName": "FusionCompute",
                "alarmLevel": "1",
                "alarmNum": 11
            }
        ]
    };
    var addThreholdList = [
        {
            "showDetail": "",
            "name": "VM00-1Virtual Machine4",
            "id": "2014",
            "ip": "192.168.62.99",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1Virtual Machine3",
            "id": "2014",
            "ip": "192.168.62.99",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1Virtual Machine1",
            "id": "2014",
            "ip": "192.168.62.99",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1Virtual Machine2",
            "id": "2014",
            "ip": "192.168.62.99",
            "opts": ""
        }
    ];

    var addMailAlarmList = [
        {
            "showDetail": "",
            "name": "VM00-1 Virtual Machine",
            "id": "2014001",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1 Virtual Machine",
            "id": "2014002",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1 Virtual Machine",
            "id": "2014003",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "VM00-1 Virtual Machine",
            "id": "2014004",
            "opts": ""
        }
    ];

    var messageList = [
        {
            "showDetail": "",
            "userName": "admin",
            "isSystemUser": "Yes",
            "phone": "13200000000",
            "type": "By object type",
            "forwardType": "Virtual Machine",
            "forwardTime": "00:00-05:00",
            "status": "",
            "operation": ""
        },
        {
            "showDetail": "",
            "userName": "admin",
            "isSystemUser": "Yes",
            "phone": "13211111111",
            "type": "By object type",
            "forwardType": "Virtual Machine",
            "forwardTime": "00:00-05:00",
            "status": "",
            "operation": ""
        }
    ];

    var alarmCountList = {
        "value": [
            {
                "alarmId": "01",
                "alarmName": "VM01",
                "alarmNum": "5",
                "moc": "By object"
            },
            {
                "alarmId": "02",
                "alarmName": "VM02",
                "alarmNum": "3",
                "moc": "By object"
            }

        ]};
    fixture({
        "GET /goku/rest/v1.5/1/alarms/threshold-configs?locale=zh_CN": function (request, response) {
            response(200, "success", thresholdDataView, {});
        },
        //查询告警列表
        "POST /goku/rest/v1.5/1/alarms": function (request, response) {
            response(200, "success", alarmDataView, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/alarms?cloud-infra={cloud_infra_id}": function (request, response) {
            response(200, "success", alarmDataView, {});
        },
        "POST /goku/rest/v1.5/1/alarms/file": function (request, response) {
            response(200, "success", exportExcelView, {});
        },
        "POST /goku/rest/v1.5/1/alarms/action": function (request, response) {
            response(200, "success", null, {});
        },
        "POST /goku/rest/v1.5/irm/server/metric-data": function (request, response) {
            response(200, "success", hardwareDataView, {});
        },
        "DELETE /goku/rest/v1.5/1/snmpclients/{id}": function (request, response) {
            response(200, "success", null, {});
        },
        "PUT /goku/rest/v1.5/1/snmpclients/{id}": function (request, response) {
            response(200, "success", null, {});
        },
        "PUT /goku/rest/v1.5/1/alarms/threshold-configs": function (request, response) {
            response(200, "success", null, {});
        },
        "POST /goku/rest/v1.5/1/snmpclients": function (request, response) {
            response(200, "success", null, {});
        },
        "GET /goku/rest/v1.5/1/snmpclients?start={start}&limit={limit}": function (original, response) {
            response(200, "success", snmpClientDataView, {});
        },
        "POST /goku/rest/v1.5/1/alarms/shield-configs/action": function (request, response) {
            response(200, "success", null, {});
        },
        "POST /goku/rest/v1.5/1/alarms/shield-configs": function (request, response) {
            response(200, "success", null, {});
        },
        "GET /goku/rest/v1.5/1/alarms/shield-configs?locale={locale}&start={start}&limit={limit}": function (original, response) {
            response(200, "success", shieldAlarmDataView, {});
        },
        "GET /goku/rest/v1.5/alarms/config?start={start}&limit={limit}&comptype={comptype}&alarmid={alarmid}&alarmname={alarmname}&locale={locale}": function (original, response) {
            response(200, "success", defineAlarmDataView, {});
        },
        "GET /goku/rest/v1.5/alarms/config?start=0&limit=10&locale=zh_CN": function (original, response) {
            response(200, "success", defineAlarmDataView, {});
        },
        "GET /goku/rest/v1.5/irm/1/hosts/1/usbs": function (original, response) {
            response(200, "success", usbDataView, {});
        },
        "POST /goku/rest/v1.5/1/alarms/statistic?locale={locale}": function (original, response) {
            response(200, "success", alarmStatisticDataView, {});
        },
        "GET /goku/rest/v1.5/alarms/detail": function (original, response) {
            response(200, "success", alarmDataDetailView, {});
        },
        "GET /uportal/monitoring/alarms": function (request, response) {
            response(200, "success", alarmData.alarmList, {});
        },
        "GET /uportal/monitoring/search": function (original, response) {
            response(200, "success", alarmData.alarmList[0], {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/alarms/recipients": function (request, response) {
            response(200, "success", emailList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/alarms/recipients/{id}?locale={language}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in emailDetailList.emailDetails) {
                var email = emailDetailList.emailDetails[index];
                if (email.recipientId === id) {
                    res = email;
                    break;
                }
            }
            res.name = request.data.name;
            res.description = request.data.description;
            response(200, "success", res, {})
            response(200, "success", emailList, {});
        },
        "PUT /goku/rest/v1.5/1/alarms/recipients/{id}": function (request, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/1/alarms/recipients/{id}": function (request, response) {
            response(200, "success", {}, {});
        },

    "POST /goku/rest/v1.5/{vdc_id}/users/list": function (request, response) {
            response(200, "success", emailList, {});
        },
        "GET /uportal/monitoring/messageList": function (request, response) {
            response(200, "success", messageList, {});
        },
        "GET /uportal/monitoring/threholdList": function (request, response) {
            response(200, "success", threholdList, {});
        },
        "GET /uportal/monitoring/shieldList": function (request, response) {
            response(200, "success", shieldList, {});
        },
        "GET /uportal/monitoring/query/detail": function (original, response) {
            var vmId = original.data.id;
            var detailAlarm = null;
            for (var i = 0; i < alarmData.alarmList.length; i++) {
                if (alarmData.alarmList[i].alarmName === vmId) {
                    detailAlarm = alarmData.alarmList[i];
                }
            }
            response(200, "success", detailAlarm, {});
        },
        "GET /uportal/monitoring/threholdObjQuery": function (request, response) {
            response(200, "success", addThreholdList, {});
        },
        "GET /goku/rest/v1.5/alarms/config": function (request, response) {
            response(200, "success", addMailAlarmList, {});
        },
        //告警统计
        "POST /goku/rest/v1.5/{vdc_id}/alarms/statistic?cloud-infra={cloud_infra_id}&locale={locale}": function (request, response) {
            var req = JSON.parse(request.data);
            var lever = req.conditionList[0].staticCond.alarmLevel;
            var ret;
            if (lever == "" || lever == "0" || lever == "1") {
                ret = alarmCountList;
            } else {
                ret = {value:[]};
            }
            response(200, "success", ret, {});
        },
        //导出告警
        "POST /goku/rest/v1.5/{vdc_id}/alarms/file?cloud-infra={cloud_infra_id}": function (request, response) {
            response(200, "success", {"exportFilePath": "alarmList.xlsx"}, {});
        },
        //查询任务列表
        "GET /goku/rest/v1.5/{vdc_id}/jobs": function (request, response) {
            var result = {
                "allTopTask":{
                    "taskList": [
                        {"id":"4724276009111650309", "eventType":"IRM.HYPERVISOR.DISCOVER.VMTEMP", "status":"SUCCESS", entityIds:"vm:01", applyTime:"2014-07-16 21:51:02", startTime:"2014-07-16 21:51:07", finishTime:"2014-07-16 21:51:07", userName:"zhangsan",errorCode:"0005300005"},
                        {"id":"4724276009111650309", "eventType":"IRM_VM_STOP", "status":"FAILED", entityIds:"vm:01", applyTime:"2014-07-16 21:51:02", startTime:"2014-07-16 21:51:07", finishTime:"2014-07-16 21:51:07", userName:"lisi", errorCode:"0005300008"}
                    ],
                    "total": 13
                }
            };
            response(200, "success", result, {});
        },
			"POST /goku/rest/v1.5/irm/server/metric-data": function (request, response) {
			var ICTresult = {
				"code": "0",
				"total": 0,
				"metricInfo": {
				"host.cpu.util": {
					"unit": "%",
						"metricId": "host.cpu.util",
						"metricValue": "62.0"
				},
				"host.mem.totalsize": {
					"unit": "MB",
						"metricId": "host.mem.totalsize",
						"metricValue": "98304.0"
				},
				"host.cpu.totalfreq": {
					"unit": "GHz",
						"metricId": "host.cpu.totalfreq",
						"metricValue": "8.0"
				},
				"host.disk.util": {
					"unit": "%",
						"metricId": "host.disk.util",
						"metricValue": "12.529385775915566"
				},
				"host.eth.output.pkgspeed": {
					"unit": "num/s",
						"metricId": "host.eth.output.pkgspeed",
						"metricValue": "441.76944444440306"
				},
				"host.eth.input.speed": {
					"unit": "KB/s",
						"metricId": "host.eth.input.speed",
						"metricValue": "263.21339518229166"
				},
				"host.disk.write.speed": {
					"unit": "KB/s",
						"metricId": "host.disk.write.speed",
						"metricValue": "98.0"
				},
				"host.disk.read.speed": {
					"unit": "KB/s",
						"metricId": "host.disk.read.speed",
						"metricValue": "1216.0"
				},
				"host.eth.input.pkgspeed": {
					"unit": "num/s",
						"metricId": "host.eth.input.pkgspeed",
						"metricValue": "458.60833333333335"
				},
				"host.eth.output.speed": {
					"unit": "KB/s",
						"metricId": "host.eth.output.speed",
						"metricValue": "170.72574327259014"
				},
				"host.memory.util": {
					"unit": "%",
						"metricId": "host.memory.util",
						"metricValue": "22.0"
				}
			}
			};

			var ITresult={
				"code": "0",
				"total": 0,
				"metricInfo": {
				"host.cpu.util": {
					"unit": "",
						"metricId": "host.cpu.util",
						"metricValue": "28.60"
				},
				"host.cpu.totalfreq": {
					"unit": "",
						"metricId": "host.cpu.totalfreq",
						"metricValue": "4.80"
				},
				"host.mem.totalsize": {
					"unit": "",
						"metricId": "host.mem.totalsize",
						"metricValue": "32768"
				},
				"host.eth.output.pkgspeed": {
					"unit": "",
						"metricId": "host.eth.output.pkgspeed",
						"metricValue": "47.81"
				},
				"host.eth.input.speed": {
					"unit": "",
						"metricId": "host.eth.input.speed",
						"metricValue": "20.15"
				},
				"host.mem.reserve": {
					"unit": "",
						"metricId": "host.mem.reserve",
						"metricValue": "24.119140625"
				},
				"host.disk.write.speed": {
					"unit": "",
						"metricId": "host.disk.write.speed",
						"metricValue": "1470.74"
				},
				"host.cpu.reserve": {
					"unit": "",
						"metricId": "host.cpu.reserve",
						"metricValue": "9.6"
				},
				"host.eth.output.speed": {
					"unit": "",
						"metricId": "host.eth.output.speed",
						"metricValue": "16.42"
				},
				"host.disk.util": {
					"unit": "",
						"metricId": "host.disk.util",
						"metricValue": "10.42"
				},
				"host.mem.total": {
					"unit": "",
						"metricId": "host.mem.total",
						"metricValue": "27.8671875"
				},
				"host.disk.read.speed": {
					"unit": "",
						"metricId": "host.disk.read.speed",
						"metricValue": "476.64"
				},
				"host.cpu.total": {
					"unit": "",
						"metricId": "host.cpu.total",
						"metricValue": "33.6"
				},
				"host.memory.util": {
					"unit": "",
						"metricId": "host.memory.util",
						"metricValue": "20.66"
				},
				"host.eth.input.pkgspeed": {
					"unit": "",
						"metricId": "host.eth.input.pkgspeed",
						"metricValue": "47.16"
				}
			}
			};
			response(200, "success", ITresult, {});
		}
    });

    return fixture;
});