define(["can/util/fixture/fixture"], function (fixture) {
    var chassisData = {"code": "0", "message": "", "total": 1, "chassis": [
        {
            "branchName": "branches_xian_001", "chassisName": "xianChassis01", "zoneName": "ZONE_XIAN", "roomName": "xianRoom01",
            "rackNo": "xianRack01", "subRackNo": "xianRack01_1", "chassisId": "Huawei_E9000_CH220_192.168.99.15",
            "description": "Created  by Xi'an.", "urn": "46787168-3f2d-45e0-a021-1589d1d34e34", "smmAIP": "192.168.99.15",
            "smmAState": 4, "smmBIP": "192.168.99.15", "smmBState": 4, "mUserName": "root", "productModel":
            "Huawei E9000 CH220", "hostFanInfo": null, "phyPowerInfo": null}
    ]};
    var updateSMMPasswdData = {
        retcode: 0
    };
    var slot = function (id) {
        var data = {
            "check": "",
            "slotId": id,
            "model": "Huawei Tecal BH621 V2",
            "addingResult": "Not connected",
            "setBmc": "",
            "mmIp": "",
            "mmUsername": "",
            "bmcIp": "",
            "bmcUsername": "",
            "mmPassword": "",
            "cfmMmPassword": "",
            "bmcIp": "",
            "bmcUser": "",
            "bmcIp": "",
            "bmcUsername": "",
            "bmcPassword": "",
            "cfmBmcPassword": ""};
        return data;
    };

    var slotsData = function () {
        var slotArray = new Array();
        for (var i = 1; i < 11; i++) {
            slotArray[i] = slot(i);
        }
        var data = {
            code: 0,
            slots: slotArray
        }
        return data;
    };

    var hostsData = {
        code: 0,
        servers: [
            {
                biosInfo: null,
                bmcIp: "192.168.99.62",
                bmcUserName: "root",
                clusterName: "ManagementCluster",
                cpuSpeed: 2.4,
                cpuUsageRate: "4.73",
                hostFanInfo: null,
                hostId: 1,
                hostLogicPartion: null,
                hostPhyCPUInfo: null,
                hostPhyDiskInfo: null,
                hypervisorId: 4629700416936870000,
                localDisk: 2000,
                memUsageRate: "23.55",
                memorySizeMB: 12980,
                netInputFlow: 0,
                netOutPutFlow: 0,
                phyLogicDiskInfo: null,
                phyMemoryInfo: null,
                phyNicPortInfo: null,
                phyPowerInfo: null,
                product: "Huawei Tecal RH2288 V2",
                rackNo: "149290290001",
                resClusterID: 4625196817309499000,
                resourceState: 0,
                roomName: "xian_Room01",
                runtimeState: 5,
                osName:"xianOsName",
                serverName: "xianServer01",
                serverType: 0,
                slotNo: "0",
                subRackNo: "xian_Rack03",
                uhmServerId: "Huawei Tecal RH2288 V2_192.168.99.62",
                urn: "03aa456c-89a5-4cd9-8275-a6290aa0f1d7",
                vrmId: "urn:sites:49F70862:hosts:63"
            }
        ]};
    var loadBalance = {"code": "0", "message": "", "total": 1, "url": null,
        "lbList": [
                {
                    "rid": "10737", "deviceId": 10737, "deviceName": "VLB_A01", "deviceIp": "192.168.5.230",
                    "peerIp": null, "zoneName": "ZONE_XIAN", "roomName": "xianRoom01", "rackName": "xianRack01", "subRackName": "xianRack01_1","status": 0, "linkStatus": 0,
                    "hardware": "F5 BIG-IP 1600", "software": "BIG-IP V10", "description": "", "accessPara":
                    {
                        "protocol": 3, "port": 443, "userName": "admin", "passWord": "admin", "timeOut": 0
                    },
                    "snmpPara":
                    {
                        "snmpVersion": 1, "snmpPort": 161, "readCommunity": "public", "writeCommunity": "private",
                         "timeOut": 5000, "retries": 3, "snmpContextName": null, "snmpEngineId": null, "usmUser": null,
                        "snmpAuthMode": "null", "snmpAuthPwd": "null", "snmpPrivacyMode": "null", "snmpPrivacyPwd": "null"
                    }

                }
    ]};
    var firewallData = {"code": "0", "message": "", "total": 2, "firewallVOs": [
        {"deviceId": "4638707616191610880", "deviceRid": "1", "zoneId": "ZONE_XIAN", "deviceName": "firewall_A01", "deviceType": "Eudemon1000E", "mgntIpv4Addr": "192.168.1.183", "deviceVersion": "Eudemon1000E V300R001", "roomId": "xianRoom01", "rackId": "3445", "subrackId": "5", "pairDeviceId": null, "remainVrid": 0, "usedVrid": 0, "totalAclNum": 542000, "usedAclNum": 0, "totalAclRuleNum": 542000, "usedAclRuleNum": 0, "totalVFwNum": 10, "usedVfwNum": 0, "totalNatNum": 4096, "usedNatNum": 0, "deviceStatus": 0, "connStatus": 0, "discoveryErrorCode": 0, "totalaclRange": 0, "aclrangeList": null, "untrustZone": {"portAggrs": [], "portNames": null}, "trustZone": {"portAggrs": [], "portNames": null}},
        {"deviceId": "4638707616191610881", "deviceRid": "2", "zoneId": "ZONE_SHENZHEN", "deviceName": "<>firewall_A03", "deviceType": "Eudemon8000E", "mgntIpv4Addr": "192.168.31.5", "deviceVersion": "Eudemon8000E V200R001", "roomId": "xianRoom01", "rackId": "3445", "subrackId": "1", "pairDeviceId": null, "remainVrid": 0, "usedVrid": 0, "totalAclNum": 15121, "usedAclNum": 0, "totalAclRuleNum": 15121, "usedAclRuleNum": 0, "totalVFwNum": 11, "usedVfwNum": 0, "totalNatNum": 4096, "usedNatNum": 0, "deviceStatus": 0, "connStatus": 0, "discoveryErrorCode": 0, "totalaclRange": 0, "aclrangeList": null, "untrustZone": {"portAggrs": [], "portNames": null}, "trustZone": {"portAggrs": [], "portNames": null}}
    ]};

    var zones = {"code": "0", "message": "", "zones": [
        {"name": "ZONE_XIAN", "region": "xian", "description": "One belonging to a cluster cloudRP_A01 Xi'an resources available under the partition", "networkMode": "FIREWALL_ONLY", "id": "02900101", "createTime": 1397860208565, "lastModifiedTime": 1397860208565},
        {"name": "ZONE_SHENZHEN", "region": "shenzhen", "description": "A cluster cloudRP_B01 affiliated Shenzhen resources available under the partition", "networkMode": "FIREWALL_ONLY", "id": "075500101", "createTime": 1397860880979, "lastModifiedTime": 1397860880979}
    ]};

    var switchData = {"code": "0", "message": "", "value": [
        {"name": "switch_A01", "type": 0, "product": "Huawei Quidway S5352", "ip": "192.168.1.116", "stackSwitchName": null, "description": "", "branchName": "no_branchName", "status": 0, "locations": [
            {"zoneId": 4616189618054758401, "zoneName": "ZONE_XIAN", "roomName": "xianRoom01", "rackId": "xianRack01", "subrackId": "xianRack01_1", "slotId": -1}
        ], "physicsType": "SWITCH", "mUserName": "root", "rid": "192.168.1.116", "upLinkPorts": [], "isStatckSwitch": false}
    ], "total": 1};
    var commonPorts = [
        {
            "checkbox": "",
            "id": "5",
            "port": "GigabitEthernet0/0/5"
        },
        {
            "checkbox": "",
            "id": "6",
            "port": "GigabitEthernet0/0/6"
        },
        {
            "checkbox": "",
            "id": "7",
            "port": "GigabitEthernet0/0/7"
        },
        {
            "checkbox": "",
            "id": "8",
            "port": "GigabitEthernet0/0/8"
        },
        {
            "checkbox": "",
            "id": "9",
            "port": "GigabitEthernet0/0/9"
        },
        {
            "checkbox": "",
            "id": "10",
            "port": "GigabitEthernet0/0/10"
        },
        {
            "checkbox": "",
            "id": "11",
            "port": "GigabitEthernet0/0/11"
        },
        {
            "checkbox": "",
            "id": "12",
            "port": "GigabitEthernet0/0/12"
        },
        {
            "checkbox": "",
            "id": "13",
            "port": "GigabitEthernet0/0/13"
        },
        {
            "checkbox": "",
            "id": "14",
            "port": "GigabitEthernet0/0/14"
        },
        {
            "checkbox": "",
            "id": "15",
            "port": "GigabitEthernet0/0/15"
        }
    ];

    var uplinkPorts = [
        {
            "checkbox": "",
            "id": "1",
            "port": "GigabitEthernet0/0/1"
        },
        {
            "checkbox": "",
            "id": "2",
            "port": "GigabitEthernet0/0/2"
        },
        {
            "checkbox": "",
            "id": "3",
            "port": "GigabitEthernet0/0/3"
        },
        {
            "checkbox": "",
            "id": "4",
            "port": "GigabitEthernet0/0/4"
        }
    ];

    var sansData = {
        total: 2,
        storages: [
            {
                "name": "FMST_SAN01",
                "ip": "Huawei_OceanStor",
                "product": "Huawei_OceanStor_S5500T_V2",
                "type": "",
                "devStatus": "0",
                "zoneName": "ZONE_XIAN",
                "roomName": "xianRoom01",
                "rackName": "xianRack01",
                "subRackName": "xianRack01_1",
                "operation": ""},
            {
                "name": "FMST_SAN02",
                "ip": "Huawei_OceanStorDX",
                "product": "Huawei_OceanStor DX90 S2",
                "type": "",
                "devStatus": "0",
                "zoneName": "ZONE_XIAN",
                "roomName": "xianRoom01",
                "rackName": "xianRack01",
                "subRackName": "xianRack01_1",
                "operation": ""}
        ]
    }

    var adaptationList = [
        {
            "name": "FusionAdaptor V1.1.00.8.31_forFusionManager.zip",
            "status": "Installed",
            "installDate": "2014-01-26 21:08:20 UTC+08:00",
            "operation": ""
        }
    ];
    var roomList = {"code": "0", "message": "", "total": 2, "roomList": [
        {"roomId": "10740", "roomName": "xianRoom01", "location": "xian", "description": "Xi'an computer room", "createTime": "2014-04-17 23:17:24 UTC+08:00"},
        {"roomId": "10743", "roomName": "xianRoom02", "location": "xian", "description": "Spare room", "createTime": "2014-04-18 00:22:30 UTC+08:00"}
    ]}
    var cabinetList = {"code": "0", "message": "", "total": 2, "racks": [
        {"roomName": "xianRoom01", "rackId": "10741", "rackName": "xianRack01", "location": "xian", "description": "Host room cabinet", "createTime": "2014-04-17 23:17:24 UTC+08:00"},
        {"roomName": "xianRoom02", "rackId": "10744", "rackName": "xianRack02", "location": "xian", "description": "Spare room cabinet", "createTime": "2014-04-18 00:22:30 UTC+08:00"}
    ]}
    var cabinetList1 = {"code": "0", "message": "", "total": 1, "racks": [
        {"roomName": "xianRoom01", "rackId": "10741", "rackName": "xianRack01", "location": "xian", "description": "Host room cabinet", "createTime": "2014-04-17 23:17:24 UTC+08:00"}
    ]}
    var cabinetList2 = {"code": "0", "message": "", "total": 1, "racks": [
        {"roomName": "xianRoom02", "rackId": "10744", "rackName": "xianRack02", "location": "xian", "description": "Spare room cabinet", "createTime": "2014-04-18 00:22:30 UTC+08:00"}
    ]}
    var switchType = {"code": "0", "message": "", "total": 6, "instances": [
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL M1000E M6220", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 XCUB", "accessProtocol": ["SSH", "SNMPV3"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 XCUD", "accessProtocol": [], "monitorProtocol": []},
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal  NX110", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal NX112", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 5, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal NX230", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]}
    ]};
    var switchBoardType = {"code": "0", "message": "", "total": 16, "instances": [
        {"deviceType": 3, "platform": "plateform", "deviceManufacturer": "Huawei", "devicesubType": "CE12800", "accessProtocol": ["SNMPV3", "SSH"], "monitorProtocol": ["SNMPV3"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "CISCO", "devicesubType": "Cisco 7609", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "H3C", "devicesubType": "H3C S9512E", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S3328", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S5328", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S5352", "accessProtocol": ["SSH", "SNMPV3"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S5728", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S5752", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S6324", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S6348", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S6724", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S6748", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S9306", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Quidway S9312", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "Mellanox", "devicesubType": "Mellanox SX6036", "accessProtocol": ["SSH", "SNMPV3"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]},
        {"deviceType": 3, "platform": "platform", "deviceManufacturer": "unknown", "devicesubType": "general switch", "accessProtocol": ["SSH"], "monitorProtocol": ["SNMPV3", "SNMPV2C", "SNMPV1"]}
    ]};
    var hostType = {"code": "0", "message": "", "total": 29, "instances": [
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge C6105", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge R710", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge R720", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge R815", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge R820", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge R910", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant DL380 G7", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant DL385 G7", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant DL580 G7", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant DL785 G6", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH1288 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2265 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2285", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2285 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2285H V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2288 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2288H V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2485 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH2488", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH5485", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH5885 V2 4P", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal RH5885 V2 8P", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal XH310 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal XH311 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal XH320 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal XH620", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal XH621 V2", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "IBM", "devicesubType": "IBM System x3650 M3", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 2, "platform": "platform", "deviceManufacturer": "IBM", "devicesubType": "IBM System x3755 M3", "accessProtocol": ["IPMI20", "SSH"], "monitorProtocol": ["SSH", "IPMI20"]}
    ]};
    var rackType = {"code": "0", "message": "", "total": 20, "instances": [
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "CISCO", "devicesubType": "Cisco UCS-B440 M1", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge M620", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PowerEdge M910", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant BL460c G8", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant BL465 G7", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP ProLiant BL685 G7", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH121", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH220", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH222", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH223", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH240", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei E9000 CH242", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal BH620", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal BH620 V2", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal BH621 V2", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal BH622 V2", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "UVP,BARE", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal BH640 V2", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei Tecal T8000", "accessProtocol": ["SNMPV2C"], "monitorProtocol": ["SSH", "SNMPV2C", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "IBM", "devicesubType": "IBM BladeCenter HS22", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]},
        {"deviceType": 1, "platform": "platform", "deviceManufacturer": "IBM", "devicesubType": "IBM BladeCenter Hx5 7873I63", "accessProtocol": ["SNMPV3"], "monitorProtocol": ["SSH", "SNMPV3", "IPMI20"]}
    ]};
    var sanType = {"code": "0", "message": "", "total": 25, "instances": [
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "DELL", "devicesubType": "DELL PS6510E", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "EMC", "devicesubType": "EMC CX4-240", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Fujitsu", "devicesubType": "Fujitsu DX90 S2", "accessProtocol": ["SMI_S"], "monitorProtocol": ["SMI_S"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP EVA8100", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP MSA2324fc", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP P4300G2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "HP", "devicesubType": "HP XP20000", "accessProtocol": ["SMI_S"], "monitorProtocol": ["SMI_S"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Hitachi", "devicesubType": "Hitachi AMS2100", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor HVS85T", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S2600T V1", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S2600T V2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S3900", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5300", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5500T V1", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5500T V2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5600", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5600T V1", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5600T V2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5800T V1", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S5800T V2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S6800T V1", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "Huawei", "devicesubType": "Huawei OceanStor S6800T V2", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "IBM", "devicesubType": "IBM DS8100 ", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "NetApp", "devicesubType": "NetApp FAS3160", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]},
        {"deviceType": 4, "platform": "platform", "deviceManufacturer": "general storage", "devicesubType": "general storage", "accessProtocol": ["TLV"], "monitorProtocol": ["TLV"]}
    ]};
    var linkList = [
        {
            "detail": "",
            "id": "01",
            "zone": "zone1",
            "startDeviceName": "Agg-1",
            "startDeviceType": "Aggregation Switch",
            "num": "3",
            "operation": ""
        },
        {
            "detail": "",
            "id": "02",
            "zone": "zone2",
            "startDeviceName": "Agg-2",
            "startDeviceType": "Aggregation Switch",
            "num": "1",
            "operation": ""
        },
        {
            "detail": "",
            "id": "03",
            "zone": "zone3",
            "startDeviceName": "Agg-3",
            "startDeviceType": "Aggregation Switch",
            "num": "2",
            "operation": ""
        }
    ];
    var startDeviceLinkList1 = [
        {
            "startDeviceItfc": "Ehtrunk-1",
            "endDeviceName": "FW1",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-1/Security domain：TRUST",
            "operation": ""},
        {
            "startDeviceItfc": "Ehtrunk-2",
            "endDeviceName": "FW2",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-2/Security domain：TRUST",
            "operation": ""},
        {
            "startDeviceItfc": "Ehtrunk-3",
            "endDeviceName": "FW3",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-1/Security domain：DMZ",
            "operation": ""}
    ];
    var startDeviceLinkList2 = [
        {
            "startDeviceItfc": "Ehtrunk-4",
            "endDeviceName": "FW4",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-4/Security domain：TRUST",
            "operation": ""}
    ];
    var startDeviceLinkList3 = [
        {
            "startDeviceItfc": "Ehtrunk-5",
            "endDeviceName": "FW5",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-5/Security domain：TRUST",
            "operation": ""},
        {
            "startDeviceItfc": "Ehtrunk-6",
            "endDeviceName": "FW6",
            "endDeviceType": "Firewall",
            "endDeviceItfc": "Ehtrunk-1/Security domain：DMZ",
            "operation": ""}
    ];
    fixture({
        "GET /goku/rest/v1.5/irm/chassises?start=1&limit=10&sort_key=&sort_dir=&zoneId=&resourceStatus=&name=&type=&chassisId=": function (original, response) {
            response(200, "success", chassisData, {});
        },
        "GET /goku/rest/v1.5/irm/chassises?start=&limit=&sort_key=&sort_dir=&zoneId=&resourceStatus=&name=&type=&chassisId=Huawei_E9000_CH220_192.168.99.15": function (original, response) {
            response(200, "success", chassisData, {});
        },
        "GET /goku/rest/v1.5/irm/switches/port/switch": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/racks/10744/devices?start=1&limit=10&sort=&order=": function (original, response) {
            var result = {
                "code":"0","message":"","total":1,"deviceList":[{"devName":"firewall_A03","devModel":"Eudemon1000E","devType":"4","rackId":"xianChassis01","frameId":"xianChassis01","devId":null,"uhmId":null,"hypervisorId":null,"serverType":null}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/phy-firewall/config-file": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/phy-loadbalances/10737/business-config": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/phy-loadbalances/10737/connection-config": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/file/undefined?type=export": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/modifypassword": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/fusionstorage": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/fusionstorage": function (original, response) {
            var result =
            {
                "code":"0","message":"","total":1
                [{"id":"233sfdfsdf","ip":"Huawei_Tecal_RH2285_199.199.1.220","userName":"xianServer2285",
                    "name":"xianRack01","port":"xianRoom01"}]
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/switches/uplinkports": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/racks/10741": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/racks/10744": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/rooms/10740": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/rooms/10743": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/chassises": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phy-storage": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/device-templates/zh_CN": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phy-loadbalances": function (original, response) {

            var request = JSON.parse(original.data);
            var vlbName = "VLB_A" + Math.ceil(Math.random()*10000);
            var balanceData = {
                deviceName:vlbName,
                portName:request.portName,
                deviceIp:request.deviceIp,
                description:request.description,
                zoneName:request.zoneName,
                roomName:request.roomName,
                rackName:request.rackName,
                subRackName:request.subRackName,
                peerIp:request.peerIp,
                "status": 0,
                "linkStatus": 0,
                "software": "BIG-IP V10",
                "hardware": "F5 BIG-IP 1600"
            };

            loadBalance.lbList.push(balanceData);
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phy-firewalls": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phyfwcfgfiles": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/physwitch": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/chassises/Huawei_E9000_CH220_192.168.99.15": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/phy-storage/{id}": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/phy-loadbalances/10737": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/phy-firewalls/4638707616191610880": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/phy-firewalls/4638707616191610881": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/physwitch/192.168.1.116": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/irm/servers/Huawei_Tecal_RH2285_199.199.1.220": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST uhm/resource/restmgmnt/modifySMMpassword": function (original, response) {
            response(200, "success", updateSMMPasswdData, {});
        },
        "GET /resources/device/querySlots": function (original, response) {
            response(200, "success", slotsData(), {});
        },

        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            var result =
            {
                "code":"0","message":"","total":1,"servers":
                [{"hostId":"1","uhmServerId":"Huawei_Tecal_RH2285_199.199.1.220","serverName":"xianServer2285",
                    "rackNo":"xianRack01","roomName":"xianRoom01","subRackNo":"xianRack01_1","slotNo":"0","serverType":1,
                    "cnaType":4,"product":"Huawei Tecal RH2285","runtimeState":8,"resourceState":3,"bmcUserName":"admin",
                    "osIp":null,"bmcIp":"199.199.1.220","hypervisorId":0,"vrmId":null,"urn":"5768dea1-f34f-42b3-922c-627322f1d3db",
                    "resClusterID":-1,"clusterName":null,"accessProtocol":null,"ipmiVersion":null,"zoneName":"ZONE_XIAN","zoneId":"4616189618054758401"}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=46161896180547584010755&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            var result =
            {
                "code":"0","message":"","total":1,"servers":
                [{"hostId":"1","uhmServerId":"Huawei_Tecal_RH2285_199.199.1.220","serverName":"xianServer2285",
                    "rackNo":"xianRack01","roomName":"xianRoom01","subRackNo":"xianRack01_1","slotNo":"0","serverType":1,
                    "cnaType":4,"product":"Huawei Tecal RH2285","runtimeState":8,"resourceState":3,"bmcUserName":"admin",
                    "osIp":null,"bmcIp":"199.199.1.220","hypervisorId":0,"vrmId":null,"urn":"5768dea1-f34f-42b3-922c-627322f1d3db",
                    "resClusterID":-1,"clusterName":null,"accessProtocol":null,"ipmiVersion":null,"zoneName":"ZONE_XIAN","zoneId":"4616189618054758401"}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=02900101&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers/1": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=5&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=7&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=8&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=6&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=5&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/deviceType/3": function (original, response) {
            response(200, "success", switchBoardType, {});
        },
        "GET /goku/rest/v1.5/irm/deviceType/5": function (original, response) {
            response(200, "success", switchType, {});
        },
        "GET /goku/rest/v1.5/irm/deviceType/2": function (original, response) {
            response(200, "success", hostType, {});
        },
        "GET /goku/rest/v1.5/irm/deviceType/1": function (original, response) {
            response(200, "success", rackType, {});
        },
        "GET /goku/rest/v1.5/irm/deviceType/4": function (original, response) {
            response(200, "success", sanType, {});
        },
        "GET /goku/rest/v1.5/irm/phy-firewalls?zone-id=&firewall-name=": function (original, response) {
            response(200, "success", firewallData, {});
        },
        "POST uhm/resource/network/deleteFirewall": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=5&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=6&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=7&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=8&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "POST uhm/resource/network/addFirewall": function (original, response) {
            response(200, "success", firewallData, {});
        },
        "GET /goku/rest/v1.5/irm/phy-loadbalances?zone-id=&device-name=&start=1&limit=10": function (original, response) {
            response(200, "success", loadBalance, {});
        },
        "POST /goku/rest/v1.5/irm/switches": function (original, response) {
            response(200, "success", switchData, {});
        },
        "GET /uhm/resource/network/switch/commonPorts": function (original, response) {
            response(200, "success", commonPorts, {});
        },
        "GET /uhm/resource/network/switch/uplinkPorts": function (original, response) {
            response(200, "success", uplinkPorts, {});
        },
        "POST /uhm/resource/network/addSwitch": function (original, response) {
            response(200, "success", switchData, {});
        },
        "POST /goku/rest/v1.5/irm/phy-storages": function (original, response) {
            response(200, "success", sansData, {});
        },
        "POST /uhm/resource/storage/addSan": function (original, response) {
            response(200, "success", sansData, {});
        },
        "POST /uhm/resource/storage/deleteSan": function (original, response) {
            response(200, "success", sansData, {});
        },
        "GET /resources/device/queryAdaptations": function (original, response) {
            response(200, "success", adaptationList, {});
        },
        "GET /goku/rest/v1.5/irm/rooms?start=1&limit=10&room-name=": function (original, response) {
            response(200, "success", roomList, {});
        },
        "GET /goku/rest/v1.5/irm/rooms?start=&limit=&room-name=": function (original, response) {
            response(200, "success", roomList, {});
        },
        "GET /goku/rest/v1.5/irm/rooms/racks?start=&limit=&sort=&order=&room-name=xianRoom01": function (original, response) {
            var result = {
                "code":"0","message":"","total":1,"rackList":[{"roomName":"xianRoom01","rackId":"5440","rackName":"xianRack01",
                    "createTime":"2014-09-25 04:45:12","location":"xian","description":"Room was built by Huawei in xian."}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/rooms/racks?start=&limit=&sort=&order=&room-name=xianRoom02": function (original, response) {
            var result = {
                "code":"0","message":"","total":1,"rackList":[{"roomName":"xianRoom02","rackId":"5440","rackName":"xianRack02",
                    "createTime":"2014-09-25 04:45:12","location":"xian","description":"Room was built by Huawei in xian."}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/racks/5440/devices?start=1&limit=10&sort=&order=": function (original, response) {
            var result = {
                "code":"0","message":"","total":2,"deviceList":[
                    {"devName":"xianChassis01","devModel":"Huawei Tecal BH620 V2","devType":"1","rackId":"a","frameId":"a2",
                        "devId":"Huawei E9000 CH220_V2_191.100.98.23","uhmId":null,"hypervisorId":null,"serverType":null},
                    {"devName":"xianServer2285","devModel":"Huawei Tecal RH2285","devType":"2","rackId":"a","frameId":"a1",
                        "devId":"1","uhmId":"Huawei_Tecal_RH2285_199.199.1.220","hypervisorId":"0","serverType":"1"}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/chassises?start=&limit=&sort_key=&sort_dir=&zoneId=&resourceStatus=&name=&type=&chassisId=Huawei_Tecal_BH620_V2_191.100.98.23": function (original, response) {
            var result = {
                "code":"0","message":"","total":1,"chassis":[{"branchName":"","chassisName":"620","zoneId":"4616189618054758401","roomName":"a","rackNo":"a","subRackNo":"a2","chassisId":"Huawei Tecal BH620 V2_191.100.98.23","smmAIP":"191.100.98.23","smmAState":4,"smmBIP":"191.100.98.23","smmBState":4,"mUserName":null,"productModel":"Huawei Tecal BH620 V2","description":null,"urn":"1e031858-3143-4e03-a934-b3c904bc40cf","hostFanInfo":{"fanNum":0,"hostFans":[{"id":101,"speed":3480,"status":1,"fanId":1,"slotNo":1},{"id":102,"speed":3360,"status":1,"fanId":2,"slotNo":1},{"id":202,"speed":4320,"status":1,"fanId":2,"slotNo":2},{"id":201,"speed":4560,"status":1,"fanId":1,"slotNo":2},{"id":301,"speed":4440,"status":1,"fanId":1,"slotNo":3},{"id":302,"speed":4320,"status":1,"fanId":2,"slotNo":3},{"id":401,"speed":3600,"status":1,"fanId":1,"slotNo":4},{"id":402,"speed":3480,"status":1,"fanId":2,"slotNo":4},{"id":501,"speed":4440,"status":1,"fanId":1,"slotNo":5},{"id":502,"speed":4320,"status":1,"fanId":2,"slotNo":5},{"id":602,"speed":4200,"status":1,"fanId":2,"slotNo":6},{"id":601,"speed":4440,"status":1,"fanId":1,"slotNo":6},{"id":701,"speed":3480,"status":1,"fanId":1,"slotNo":7},{"id":702,"speed":3360,"status":1,"fanId":2,"slotNo":7},{"id":802,"speed":4320,"status":1,"fanId":2,"slotNo":8},{"id":801,"speed":4440,"status":1,"fanId":1,"slotNo":8},{"id":902,"speed":4320,"status":1,"fanId":2,"slotNo":9},{"id":901,"speed":4440,"status":1,"fanId":1,"slotNo":9}]},"phyPowerInfo":{"total":0,"powers":[{"id":101,"status":4,"power":"","powerId":1,"slotNo":1},{"id":201,"status":1,"power":"392.0","powerId":1,"slotNo":2},{"id":301,"status":1,"power":"378.0","powerId":1,"slotNo":3},{"id":401,"status":4,"power":"","powerId":1,"slotNo":4},{"id":501,"status":4,"power":"","powerId":1,"slotNo":5},{"id":601,"status":2,"power":"98.0","powerId":1,"slotNo":6}]}}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/chassis/{id}/bladeservers": function (original, response) {
            var result = {
                "code":"0","message":"","total":0,"servers":[{"hostId":"0","uhmServerId":"Huawei Tecal BH620 V2_191.100.98.23_01","serverName":"620_01","rackNo":"a","roomName":null,"subRackNo":"a2","slotNo":"1","serverType":2,"cnaType":0,"product":"Huawei Tecal BH620 V2","runtimeState":5,"resourceState":1,"bmcUserName":null,"osIp":null,"bmcIp":null,"hypervisorId":0,"vrmId":null,"urn":null,"resClusterID":-1,"clusterName":null,"accessProtocol":["SNMPV3","IPMI20","IPMI15"],"ipmiVersion":null,"zoneName":null,"zoneId":null},{"hostId":"0","uhmServerId":"Huawei Tecal BH620 V2_191.100.98.23_02","serverName":"620_02","rackNo":"a","roomName":null,"subRackNo":"a2","slotNo":"2","serverType":2,"cnaType":0,"product":"Huawei Tecal BH620 V2","runtimeState":5,"resourceState":1,"bmcUserName":null,"osIp":null,"bmcIp":null,"hypervisorId":0,"vrmId":null,"urn":null,"resClusterID":-1,"clusterName":null,"accessProtocol":["SNMPV3","IPMI20","IPMI15"],"ipmiVersion":null,"zoneName":null,"zoneId":null},{"hostId":"0","uhmServerId":"Huawei Tecal BH620 V2_191.100.98.23_04","serverName":"620_04","rackNo":"a","roomName":null,"subRackNo":"a2","slotNo":"4","serverType":2,"cnaType":0,"product":"Huawei Tecal BH620 V2","runtimeState":5,"resourceState":1,"bmcUserName":null,"osIp":null,"bmcIp":null,"hypervisorId":0,"vrmId":null,"urn":null,"resClusterID":-1,"clusterName":null,"accessProtocol":["SNMPV3","IPMI20","IPMI15"],"ipmiVersion":null,"zoneName":null,"zoneId":null},{"hostId":"0","uhmServerId":"Huawei Tecal BH620 V2_191.100.98.23_06","serverName":"620_06","rackNo":"a","roomName":null,"subRackNo":"a2","slotNo":"6","serverType":2,"cnaType":0,"product":"Huawei Tecal BH620 V2","runtimeState":5,"resourceState":1,"bmcUserName":null,"osIp":null,"bmcIp":null,"hypervisorId":0,"vrmId":null,"urn":null,"resClusterID":-1,"clusterName":null,"accessProtocol":["SNMPV3","IPMI20","IPMI15"],"ipmiVersion":null,"zoneName":null,"zoneId":null},{"hostId":"0","uhmServerId":"Huawei Tecal BH620 V2_191.100.98.23_07","serverName":"620_07","rackNo":"a","roomName":null,"subRackNo":"a2","slotNo":"7","serverType":2,"cnaType":0,"product":"Huawei Tecal BH620 V2","runtimeState":5,"resourceState":1,"bmcUserName":null,"osIp":null,"bmcIp":null,"hypervisorId":0,"vrmId":null,"urn":null,"resClusterID":-1,"clusterName":null,"accessProtocol":["SNMPV3","IPMI20","IPMI15"],"ipmiVersion":null,"zoneName":null,"zoneId":null}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/racks/10741/devices?start=1&limit=10&sort=&order=": function (original, response) {
            var result = {
                "code":"0","message":"","total":2,"deviceList":[{"devName":"620","devModel":"Huawei Tecal BH620 V2","devType":"1","rackId":"a","frameId":"a2","devId":"Huawei Tecal BH620 V2_191.100.98.23","uhmId":null,"hypervisorId":null,"serverType":null},{"devName":"2285","devModel":"Huawei Tecal RH2285","devType":"2","rackId":"a","frameId":"a1","devId":"1","uhmId":"Huawei Tecal RH2285_199.199.1.220","hypervisorId":"0","serverType":"1"}]
            }
            response(200, "success",  result, {});
        },
        "GET /goku/rest/v1.5/irm/racks?start=1&limit=10&room-name=&rack-name=": function (original, response) {
            response(200, "success", cabinetList, {});
        },
        "GET /resources/device": function (original, response) {
            var cabinetName = original.data.cabinetName;
            var deviceList = [];
            for (var index in hostsData.servers) {
                if (hostsData.servers[index].cabinet == cabinetName) {
                    var newData = hostsData.servers[index];
                    newData.label = "computing";
                    deviceList.push(newData)
                }
            }
            ;
            for (var index in firewallData.firewalls) {
                if (firewallData.firewalls[index].cabinet == cabinetName) {
                    var newData = firewallData.firewalls[index];
                    newData.label = "network";
                    deviceList.push(newData)
                }
            }
            ;
            for (var index in sansData.sans) {
                if (sansData.sans[index].cabinet == cabinetName) {
                    var newData = sansData.sans[index];
                    newData.label = "storage";
                    deviceList.push(newData)
                }
            }
            ;
            response(200, "success", deviceList, {});

        },
        "POST /resources/network/addLoadBalancer": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /resources/network/link": function (original, response) {
            response(200, "success", linkList, {});
        },
        "POST /goku/rest/v1.5/irm/collision": function (original, response) {
            response(204, "success", {}, {})
        },
        "GET /goku/rest/v1.5/irm/1/zones": function (original, response) {
            response(200, "success", zones, {});
        },
        "POST /goku/rest/v1.5/irm/phy-servers/{id}/{action}": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/phy-servers/{id}/access-params": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/servers": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/modifypassword ": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/device-progress": function (original, response) {
            var result = {
                list: []
            };
            for (var i = 1; i < 7; i++) {
                result.list.push({
                    deviceType: i,
                    totalNum: 2 * i + 5 - i % 2,
                    successNum: i + 5,
                    failedNum: i,
                    repeatNum: i % 2
                });
            }
            response(200, "success", result, {});
        }
    });

    return fixture;
});