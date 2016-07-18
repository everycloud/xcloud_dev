define(["can/util/fixture/fixture"], function (fixture) {

    var overtime = 5;

    var overtimeData = {
        "overtimeList": [



        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };

    var timeNTP = {
        "currInfo": {
            "ntpServerList": ['192.168.3.56', '192.168.1.0', '192.168.1.0'],
            "period": 512
        },
        "ntpSyncStatus": "normal"
    };
    var timeZone = {
        "regionTimeZoneInfo": [
            {
                "region": "Asia",
                "cities": ['(UTC+08:00)Beijing,Shanghai,Chongqing,Urumqi,Harbin', '(UTC+02:00)Nicosia']
            },
            {
                "region": "America",
                "cities": ['(UTC-10:00)Adak', '(UTC-09:00)Anchorage,Juneau,Nome,Yakutat']
            },
            {
                "region": "Europe",
                "cities": ['(UTC+00:00)London', '(UTC+00:00)Dublin']
            }
        ],
        "currentTimeZone": {
            "currentRegion": "Asia",
            "currentTZ": "(UTC+08:00)Beijing,Shanghai,Chongqing,Urumqi,Harbin",
            "dstInfo": {
                "daylightTime": false
            }
        }
    };
    fixture({

        "POST /uportal/system/save": function (request, response) {
            var overtimeSelect = request.data.overtimeSelect;
            var systemTime = {
                "overtimeSelect": overtimeSelect
            };
            overtime = overtimeSelect;
            response(200, "success", {}, {})
        },

        "POST /goku/rest/v1.5/{vdc_id}/snmpserver": function (request, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/snmpserver": function (request, response) {
            var info = {
                snmpVersion: "3",//?int snmp版本。包括SNMPv2c和SNMPv3、默认值为SNMPv2c
                readName: "readName",//读团体名
                writeName: "writeName",//写团体名
                engineId: "engineId",//引擎ID
                userName: "userName",//用户名
                authGeneric: "SHA",//认证类型，包括MD5和SHA
                authPassWord: "authPassWord",//认证密码
                privacyProtocol: "DES",//密钥类型，只支持des56
                privPassWord: "privPassWord",//密钥密码
                transType: {//snmp发送协议类型:UDP(1), TCP(2)
                    UDP: "UDP",
                    TCP: "TCP",
                    value: 1
                },
                outTime: 4000,//默认超时时间是3000ms。1000 ～ 60000（含1000和60000）之间的整数。单位为毫秒
                snmpMgrName: "snmpMgrName",//SNMP管理站名称.由英文、数字以及下划线组成。长度范围为1个～128个字符
                snmpMgrDesc: "snmpMgrDesc",//SNMP管理站描述。最长1024个字符
                ip: "192.168.0.1",//SNMP管理站ip地址
                port: 2323,//SNMP管理站端口号
                lan: "1",//1为英文，2为中文
                monitorFlag: 0,//是否上报监控信息，0不上报，1上报，默认为1.
                alarmFlag: 1,
                emptySleepTime: 3,//发送周期
                snmpSendMaxSize: 30//发送最大数量
            };
            response(200, "success", info, {});
        },

        "GET /goku/rest/v1.5/license": function (request, response) {
            response(200, "success", {
                "licenseInfo": {
                    "resourceItemList": [
                        {"resourceName": "LGM0CSL01", "resourceNum": 105, "actResourceNum": 0},
                        {"resourceName": "LGM0VCSL01", "resourceNum": 105, "actResourceNum": 0}
                    ],
                    "licenseCanUpdate": true,
                    "freeLicense": false,
                    "deadline": "2014-07-02",
                    "salesVersionInfo": "NoEditionInfo",
                    "serviceExpireTimeString": "0000-00-00"
                },
                "importTime": "2014-04-14"
            }, {});
        },

        "POST /goku/rest/v1.5/license": function (request, response) {
            response(200, "success", {
                "licenseInfo": {
                    "resourceItemList": [
                        {"resourceName": "LGM0CSL01", "resourceNum": 205, "actResourceNum": 10},
                        {"resourceName": "LGM0VCSL01", "resourceNum": 205, "actResourceNum": 110}
                    ],
                    "licenseCanUpdate": true,
                    "freeLicense": false,
                    "deadline": "2014-07-02",
                    "serviceExpireTimeString": "0000-00-00"
                },
                "importTime": "2014-04-14",
                "resourceReduce": true,
                "lessThanUsingResource": true
            }, {});
        },

        "POST /goku/rest/v1.5/license/file": function (request, response) {
            response(200, "success", {
                "licenseInfo": {
                    "resourceItemList": [
                        {"resourceName": "LGM0CSL01", "resourceNum": 205, "actResourceNum": 10},
                        {"resourceName": "LGM0VCSL01", "resourceNum": 205, "actResourceNum": 110}
                    ],
                    "freeLicense": false,
                    "deadline": "2014-07-02",
                    "serviceExpireTimeString": "0000-00-00"
                },
                "importTime": "2014-04-14",
                "resourceReduce": true,
                "lessThanUsingResource": true
            }, {});
        },

        "GET /goku/rest/v1.5/esn": function (request, response) {
            response(200, "success", {esn: 'testesn testesn testesn testesn'}, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/operation-log/list": function (request, response) {
            var result = {
                "total":101,"operationLog":[
                    {"id":"100","operationName":"Configuring disaster management information","level":"minor","result":"successed","startTime":"2014-09-29 13:38:08",
                        "endTime":null,"detailInfo":null,"failureCause":"","componentInfo":{"id":"3","name":"FusionManager","type":"FusionManager"},
                        "userInfo":
                        {"id":"15","name":"systemadmin","ip":"191.201.5.36"},"resourceId":"1366589","resourceName":"OperationLog_A03"},
                    {"id":"99","operationName":"User Login","level":"minor","result":"successed","startTime":"2014-09-29 12:54:56",
                        "endTime":null,"detailInfo":null,"failureCause":"",
                        "componentInfo":{"id":"3","name":"FusionManager","type":"FusionManager"},"userInfo":{"id":null,
                        "name":"systemadmin","ip":"191.201.5.36"},"resourceId":"3216548","resourceName":"OperationLog_A06"},
                    {"id":"98","operationName":"Access storage devices","level":"minor","result":"successed","startTime":"2014-09-29 12:02:52",
                        "endTime":null,"detailInfo":null,"failureCause":"","componentInfo":{"id":"3","name":"FusionManager","type":"FusionManager"},
                        "userInfo":{"id":"1","name":"admin","ip":"191.201.5.28"},"resourceId":"3652145","resourceName":"OperationLog_A01"}
                ]
            }

            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/operation-log/export": function (request, response) {
            response(200, "success", {exportLogPath:"test.txt"}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/operation-log/detail/{id}?locale={locale}": function (request, response) {
            response(200, "success", {
                oplogDetail: "logDetail...",
                failCause: "failCause"
            }, {});
        },
        //查询物理设备子网信息
        "GET /goku/rest/v1.5/irm/1/physicalsubnets": function (request, response) {
            response(200, "success", {
                id: "test",
                subnetAddr: "192.168.1.100",
                mask: "255.255.255.0",
                gateway: "192.168.1.1",
                userInputAvailIPRanges: "192.168.233.2-192.168.233.9;192.168.233.21-192.168.233.254;192.168.234.21-192.168.234.254"
            }, {});
        },

        //修改物理设备子网信息
        "PUT /goku/rest/v1.5/irm/1/physicalsubnets": function (request, response) {
            response(200, "success", {
                id: "test",
                subnetAddr: "192.168.1.100",
                mask: "255.255.255.0",
                gateway: "192.168.1.1",
                userInputAvailIPRanges: "192.168.233.2-192.168.233.9;192.168.233.21-192.168.233.254"
            }, {});
        },

        //获取系统时间
        "GET /goku/rest/v1.5/systime?withsyncstatus=true": function (request, response) {
            var sytemTime = {
                "systemTime": "2014-03-15 12:11:45 UTC+8000"
            };
            response(200, "success", sytemTime, {});
        },
        "PUT /goku/rest/v1.5/systime": function (request, response) {
            response(200, "success", {}, {});
        },
        //获取NTP
        "GET /goku/rest/v1.5/ntp": function (request, response) {
            response(200, "success", timeNTP, {});
        },
        "POST /goku/rest/v1.5/ntp": function (request, response) {
            response(200, "success", {}, {});
        },
        //获取时区信息
        "GET /goku/rest/v1.5/time-zone": function (request, response) {
            response(200, "success", timeZone, {});
        },
        "GET /goku/rest/v1.5/irm/1/disasterconfigs?param=UltraVRIP": function (request, response) {
            var result = {
                "disasterInfo":{"UltraVRIP":"191.100.71.10"}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/system/mail-configs": function (request, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/time-zone": function (request, response) {
            response(200, "success", {}, {});
        },
        //查询保存备份文件的FTP服务器信息
        "GET /goku/rest/v1.5/system-backup/ftp": function (request, response) {
            var ftp = {
                ip: "192.168.3.3",//FTP服务器的IP
                userName: "FtpServerUserA01",//FTP的用户名
                password: "ftpServerPwd",//FTP的明文密码
                port: "6666",//FTP的端囗
                protocol: ""//FTP/FTPS	FTP的协议类型
            };
            response(200, "success", {ftpInfo: ftp}, {});
        },
        //添加保存备份文件的FTP服务器信息
        "POST /goku/rest/v1.5/system-backup/ftp": function (request, response) {
            response(200, "success", {}, {});
        },
        //查询部件备份状态
        "GET /goku/rest/v1.5/system-backup/components/{id}": function (request, response) {
            var compenent = {
                id: "1111",//部件ID
                name: "FtpServerUserB02",//部件名称
                type: "ftpServerPwd",//部件类型
                status: "BACKUPSUCCESS",//部件备份状态
                startTime: "2014-06-19 19:18:21 UTC+08:00",//部件备份开始时间
                endTime: "2014-06-19 19:18:21 UTC+08:00"//部件备份结束时间
            };
            response(200, "success", {componentInfo: compenent}, {});
        },
        //开始备份备份
        "POST /goku/rest/v1.5/system-backup/components/{id}": function (request, response) {
            var compenent = {
                id: "1111",//部件ID
                name: "FtpServerUserC02",//部件名称
                type: "ftpServerPwd",//部件类型
                status: "BACKUPSUCCESS",//部件备份状态
                startTime: "2014-06-19 19:18:21 UTC+08:00",//部件备份开始时间
                endTime: "2014-06-19 19:18:21 UTC+08:00"//部件备份结束时间
            };
            response(200, "success", {componentInfo: compenent}, {});
        },
        //查询支持备份操作的部件信息
        "GET /goku/rest/v1.5/system-backup/components": function (request, response) {
            var compenent = {
                id: "1111",//部件ID
                name: "FtpServerUserD02",//部件名称
                type: "ftpServerPwd",//部件类型
                status: "",//部件备份状态
                startTime: "",//部件备份开始时间
                endTime: ""//部件备份结束时间
            };
            var list = [];
            var total = 4;
            for (var i = 0; i < total; i++) {
                var item = {};
                for (var p in compenent) {
                    item[p] = compenent[p] + i;
                }
                list.push(item);
            }
            response(200, "success", {componentInfoList: list}, {});
        },
        //查询第三方服务器 type为备份服务器类型，必选，取值为：HyperDP,CommVault
        "GET /goku/rest/v1.5/system/{vdc_id}/third-party-servers": function (request, response) {
            var type = request.data.type;
            var server = {
                type: type,//第三方服务器类型，取值为：HyperDP,CommVault
                serverAddress: "192.168.1.1" +
                    "",//服务端计算机名或ip地址 对应的类型[HyperDP:ip地址;CommVault:计算机名]
                userName: "vmserver",//用户名
                password: "",//密码
                status:"disconnected"//disconnected,connecting,connected
            };
            type != "HyperDP" && (server = {});
            response(200, "success", server, {});
        },
        "GET /goku/rest/v1.5/1/tasks?taskid=4724276009111650309&withsubtask=true": function (request, response) {
            var result = {
                "allTopTask":null,"specificTask":{"task":{"taskId":"4724276009111650307","taskProgress":{"status":"SUCCESS","errorCode":null,"failReason":null,"failResolve":null,"executePercent":4},"taskEntity":{"entityName":"rid = 2"},"taskEventtype":{"eventTypeString":"IRM.FIREWALL.REDISCOVERY","eventtype_ZH":null,"eventType_EN":null},"taskTime":{"startTime":"2014-09-26 05:00:36.606","finishTime":"2014-09-26 05:00:47.234","applyTime":"2014-09-26 05:00:33.152"},"userId":"3","userName":"zqq"},"subTaskList":null}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/tasks?taskid=4724276009111650305&withsubtask=true": function (request, response) {
            var result = {
                "allTopTask":null,"specificTask":{"task":{"taskId":"4724276009111650304","taskProgress":{"status":"FAILED","errorCode":"1003061","failReason":null,"failResolve":null,"executePercent":0},"taskEntity":{"entityName":"rid = 1"},"taskEventtype":{"eventTypeString":"IRM.FIREWALL.ADD","eventtype_ZH":null,"eventType_EN":null},"taskTime":{"startTime":"2014-09-26 03:45:50.836","finishTime":"2014-09-26 03:45:50.839","applyTime":"2014-09-26 03:45:48.091"},"userId":"3","userName":"zqq"},"subTaskList":null}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/tasks?taskid=4724276009111650304&withsubtask=true": function (request, response) {
            var result = {
                "allTopTask":null,"specificTask":{"task":{"taskId":"4724276009111650307","taskProgress":{"status":"SUCCESS","errorCode":null,"failReason":null,"failResolve":null,"executePercent":4},"taskEntity":{"entityName":"rid = 2"},"taskEventtype":{"eventTypeString":"IRM.FIREWALL.REDISCOVERY","eventtype_ZH":null,"eventType_EN":null},"taskTime":{"startTime":"2014-09-26 05:00:36.606","finishTime":"2014-09-26 05:00:47.234","applyTime":"2014-09-26 05:00:33.152"},"userId":"3","userName":"zqq"},"subTaskList":null}
            }
            response(200, "success", result, {});
        },
        //添加第三方服务器
        "PUT /goku/rest/v1.5/system/{vdc_id}/third-party-servers": function (request, response) {
            response(200, "success", {}, {});
        },
        //修改第三方服务器
        "POST /goku/rest/v1.5/system/{vdc_id}/third-party-servers": function (request, response) {
            response(200, "success", {}, {});
        },
        //删除第三方服务器 type为备份服务器类型，必选，取值为：HyperDP,CommVault
        "DELETE /goku/rest/v1.5/system/{vdc_id}/third-party-servers{search}": function (request, response) {
            response(200, "success", {}, {});
        },
        //vdi list
        "GET /goku/rest/v1.5/irm/vdis": function (request, response) {
            var data = request.data;
            var start = data.start;
            var limit = data.limit;
            var end = start + limit;
            var search = data.search;
            var vdi = {
                name: "Vdi_",
                primaryIP: "192.168.100.1",
                extraIP: "192.168.200.1",
                port: 8888,
                domainId: 100,
                domainName: "domain_",
                userName: "user_",
                id: 100
            };
            var getValue = function (item, index) {
                if (typeof item === "string" || typeof item === "number") {
                    return item + index;
                } else {
                    var rtn = {};
                    for (var p in item) {
                        rtn[p] = getValue(item[p], index);
                    }
                    return rtn;
                }
            };
            var list = [];
            var filteList = [];
            var result = [];
            for (var i = 0; i < 100; i++) {
                var item = getValue(vdi, i);
                item.version = "1.3.10";
                list.push(item);
            }
            for (var i = 0, len = list.length; i < len; i++) {
                (!search || list[i].name.indexOf(search) > -1) && filteList.push(list[i]);
            }
            var total = filteList.length;
            total < end && (end = total);
            for (; start < end; start++) {
                result.push(filteList[start]);
            }
            response(200, "success", {
                total: filteList.length,
                vdis: result
            }, {});
        },
        //add vdi
        "POST /goku/rest/v1.5/irm/vdis": function (request, response) {
            response(200, "success", {}, {});
        },
        //edit vdi
        "PUT /goku/rest/v1.5/irm/vdis/{id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //remove vdi
        "DELETE /goku/rest/v1.5/irm/vdis/{id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //task list
        "POST /goku/rest/v1.5/{vdc_id}/tasks/action": function (request, response) {
            var result = {
                "taskRegisterResp": null,
                "taskUnRegisterResp": null,
                "cancelTaskResp": null,
                "batchQueryResp": {
                    "taskList": [
                        {"taskId": "4724276009111650309", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:34:14.321", "finishTime": "2014-07-07 14:34:14.447", "applyTime": "2014-07-07 14:34:14.267"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650308", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:33:36.398", "finishTime": "2014-07-07 14:33:36.52", "applyTime": "2014-07-07 14:33:36.371"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650305", "taskProgress": {"status": "FAILED", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": null}, "taskEventtype": {"eventTypeString": "IRM_VM_STOP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 12:03:14.52", "finishTime": "2014-07-07 12:03:15.247", "applyTime": "2014-07-07 12:03:13.777"}, "userId": "3", "userName": "wwn"},

                        {"taskId": "4724276009111650309", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:34:14.321", "finishTime": "2014-07-07 14:34:14.447", "applyTime": "2014-07-07 14:34:14.267"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650308", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:33:36.398", "finishTime": "2014-07-07 14:33:36.52", "applyTime": "2014-07-07 14:33:36.371"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650305", "taskProgress": {"status": "FAILED", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": null}, "taskEventtype": {"eventTypeString": "IRM_VM_STOP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 12:03:14.52", "finishTime": "2014-07-07 12:03:15.247", "applyTime": "2014-07-07 12:03:13.777"}, "userId": "3", "userName": "wwn"},

                        {"taskId": "4724276009111650309", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:34:14.321", "finishTime": "2014-07-07 14:34:14.447", "applyTime": "2014-07-07 14:34:14.267"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650308", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:33:36.398", "finishTime": "2014-07-07 14:33:36.52", "applyTime": "2014-07-07 14:33:36.371"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650305", "taskProgress": {"status": "FAILED", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": null}, "taskEventtype": {"eventTypeString": "IRM_VM_STOP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 12:03:14.52", "finishTime": "2014-07-07 12:03:15.247", "applyTime": "2014-07-07 12:03:13.777"}, "userId": "3", "userName": "wwn"},

                        {"taskId": "4724276009111650309", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:34:14.321", "finishTime": "2014-07-07 14:34:14.447", "applyTime": "2014-07-07 14:34:14.267"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650308", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVER.VMTEMP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 14:33:36.398", "finishTime": "2014-07-07 14:33:36.52", "applyTime": "2014-07-07 14:33:36.371"}, "userId": "1", "userName": "admin"},
                        {"taskId": "4724276009111650305", "taskProgress": {"status": "FAILED", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": null}, "taskEventtype": {"eventTypeString": "IRM_VM_STOP", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 12:03:14.52", "finishTime": "2014-07-07 12:03:15.247", "applyTime": "2014-07-07 12:03:13.777"}, "userId": "3", "userName": "wwn"},
                        {"taskId": "4724276009111650304", "taskProgress": {"status": "SUCCESS", "errorCode": null, "failReason": null, "failResolve": null, "executePercent": 0}, "taskEntity": {"entityName": "FC"}, "taskEventtype": {"eventTypeString": "IRM.HYPERVISOR.DISCOVERY", "eventtype_ZH": null, "eventType_EN": null}, "taskTime": {"startTime": "2014-07-07 10:06:46.422", "finishTime": "2014-07-07 10:06:46.425", "applyTime": "2014-07-07 10:06:40.779"}, "userId": "1", "userName": "admin"}
                    ],
                    "total": 13
                }
            };
            response(200, "success", result, {});
        }
    });

    return fixture;
})
;