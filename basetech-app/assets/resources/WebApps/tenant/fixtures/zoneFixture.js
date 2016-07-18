define(["can/util/fixture/fixture"], function (fixture) {

    // zone数据
    var zoneListInfo = {
        "data": [
            {
                "id": "001",
                "name": "Huatian room",
                "cpu": "40",
                "memory": "8",
                "storage": "20",
                "vlan": "80",
                "operator": ""
            },
            {
                "id": "002",
                "name": "Zero one room",
                "cpu": "10",
                "memory": "80",
                "storage": "60",
                "vlan": "30",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 可用zone数据
    var azListInfo = {
        "data": [
            {
                "id": "001",
                "name": "AZ_001",
                "clusterNum": "5",
                "status": "Normal",
                "vmNum": "20",
                "description": "...",
                "operation": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // DVS数据
    var dvsListInfo = {"dvses": [
        {"id": "1", "name": "FCDVS_SZA01", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499393": "ManagementCluster"}, "hypervisorID": "4629700416936869889", "hypervisorName": "FC", "vsses": null, "description": null, "vlanIdList": ["1"]},
        {"id":"33","name":"businessDvs","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":[]},
        {"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":["32"]}], "total": 3};


    // VSS数据
    var vssListInfo = {
        "data": [
            {
                "id": "001",
                "name": "manangerDVS",
                "cluster": "cluster_01",
                "hypervisor": "FC",
                "host": "host"
            },
            {
                "id": "002",
                "name": "DVS_02",
                "cluster": "cluster_02",
                "hypervisor": "FC",
                "host": "host"
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // VLAN池数据
    var vlanPoolListInfo = {"vlanpools": [
        {"id": "1", "name": "vlanPool", "usage": "business", "vxLanFlag": false, "startID": 3000, "endID": 3200, "zoneID": "4616189618054758401", "description": null, "dvses": [
            {"id": "1", "name": "FCDVS_SZA01", "dvsType": null, "clusterIDsMapNames": null, "hypervisorID": "4629700416936869889", "hypervisorName": "FC", "vsses": null, "description": null, "vlanIdList": null}
        ]}
    ], "total": 2};

    var multicastIPPoolList = {"multicastIPPools": [
        {"multicastIPPoolID": "1000000", "name": "asd", "description": null, "startIP": "192.168.1.0", "endIP": "192.168.1.10", "totalUsedIPs": 0, "totalIPs": 11}
    ]};
    // 外部网络数据
    var extNetworkListInfo = {"externalNetworks":[{"exnetworkID":"20000000000","name":"exnet_static","description":null,"externalNetworkType":2,"dvses":[
            {"dvsID":"32","name":"ManagementDVS","description":null,"clusterNames":["ManagementCluster"],"hypervisorName":"fc","hypervisorType":"fusioncompute"}
        ],"vlans":[77],"totalBoundNics":1,"protocolType":"IPv4","ipv4Subnet":{"ipAllocatePolicy":3,"subnetAddr":"172.16.67.0","subnetPrefix":"255.255.255.0","gateway":"172.16.67.254","availableIPRanges":[
            {"startIP":"172.16.67.1","endIP":"172.16.67.253"}
        ],"dhcpOption":{"dhcpServerIP1":null,"dhcpServerIP2":null,"domainName":null,"primaryDNS":null,"secondaryDNS":null,"primaryWINS":null,"secondaryWINS":null},"totalAddrNum":253,"usedAddrNum":2},"ipv6Subnet":null,"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":0,"ipPacketSuppression":0,"dhcpIsolationFlag":false,"ipMacBindFlag":false},"connectToInternetFlag":true,"status":"READY"}
    ],"total":1};
    var extNetwork = {"exnetworkID":"20000000000","name":"exnet_static","description":null,"externalNetworkType":2,"dvses":[
            {"dvsID":"32","name":"ManagementDVS","description":null,"clusterNames":[],"hypervisorName":"fc","hypervisorType":"fusioncompute"}
        ],"vlans":[77],"totalBoundNics":1,"protocolType":"IPv4","ipv4Subnet":{"ipAllocatePolicy":3,"subnetAddr":"172.16.67.0","subnetPrefix":"255.255.255.0","gateway":"172.16.67.254","availableIPRanges":[
            {"startIP":"172.16.67.1","endIP":"172.16.67.253"}
        ],"dhcpOption":{"dhcpServerIP1":null,"dhcpServerIP2":null,"domainName":null,"primaryDNS":null,"secondaryDNS":null,"primaryWINS":null,"secondaryWINS":null},"totalAddrNum":253,"usedAddrNum":2},"ipv6Subnet":null,"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":0,"ipPacketSuppression":0,"dhcpIsolationFlag":false,"ipMacBindFlag":false},"connectToInternetFlag":true,"status":"READY"};
    var elbs = {"lbInfos": [
        {"lbID": "af743429-cb58-4e9c-95cd-d2c58d1013bc", "lbName": "hlb2", "lbParameters": [
            {"sessionNum": 100, "maxThroughput": 50000, "qosInfo": [
                {"name": "LBPerformance", "value": "high"}
            ]}
        ], "lbIp": null, "listeners": [
            {"lbID": "af743429-cb58-4e9c-95cd-d2c58d1013bc", "id": "7cee9f69-2dd4-44b1-a9c3-04da71f2949e", "status": "READY", "protocol": "HTTP", "passWord": null, "port": 8080, "backPort": 8080, "certificateName": null, "privateKey": null, "publicKeyCertificate": null, "certificateChain": null, "conConnectionNum": 10, "maxThroughput": 10, "bindingVM": null, "distributionMode": 0, "sessionPre": null, "healthCheckInfo": [
                {"lbID": null, "lbUrn": null, "listenerID": null, "listenerUrn": null, "checkPort": 8080, "path": "/index", "responseTime": 10, "checkInterval": 10, "unhealthyThreshold": 10, "healthyThreshold": 10, "healthCheckID": "46cf531f-1363-4b67-bd79-d94b0f4d3f61", "isOpen": "true", "status": null}
            ], "rxTraffic": 0, "txTraffic": 0, "enable": null}
        ], "devID": "5436", "slbVmInfo": {"vmID": null, "vmUrn": null, "vmInstanceID": null, "lbID": null, "stauts": null, "errorCode": null, "vsaID": null, "zoneID": "4616189618054758401", "templateClusters": null, "extIP": "8.8.8.19", "intIP": null, "vpcID": "4792750811720056832", "vpcName": "AME_VPC", "extNetworkID": "30000000033", "intNetworkID": "30000000033", "managerNetworkIP": null}, "createTime": "2014-07-21 01:03:31", "status": "READY", "userID": "5", "userName": null},
        {"lbID": "4625c9c4-c775-4550-86e4-85131cc8cf9c", "lbName": "F5", "lbParameters": [
            {"sessionNum": 100, "maxThroughput": 50000, "qosInfo": [
                {"name": "LBPerformance", "value": "high"}
            ]}
        ], "lbIp": null, "listeners": null, "devID": "5436", "slbVmInfo": {"vmID": null, "vmUrn": null, "vmInstanceID": null, "lbID": null, "stauts": null, "errorCode": null, "vsaID": null, "zoneID": "4616189618054758401", "templateClusters": null, "extIP": "8.8.8.10", "intIP": null, "vpcID": "4792750811720056832", "vpcName": "AME_VPC", "extNetworkID": "30000000033", "intNetworkID": "30000000033", "managerNetworkIP": null}, "createTime": "2014-07-20 16:38:49", "status": "ERROR", "userID": "1", "userName": null}
    ], "total": 2};
    // cluster数据
    var clusterListInfo = {
        "data": [
            {
                "id": "001",
                "name": "manangerDVS",
                "type": "Virtualization",
                "cluster": "cluster_01",
                "dvs": "dvs_01",
                "hypervisor": "FC",
                "domain": "domain/default",
                "status": "Creating success",
                "discoveryTime": "2012-02-26",
                "modifyTime": "2012-02-26",
                "description": "...",
                "operator": ""
            },
            {
                "id": "002",
                "name": "dvs_002",
                "type": "Virtualization",
                "cluster": "cluster_01",
                "dvs": "dvs_01",
                "hypervisor": "FC",
                "domain": "domain/default",
                "status": "Creating success",
                "discoveryTime": "2012-02-26",
                "modifyTime": "2012-02-26",
                "description": "...",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };
    // 物理机
    var dServersListInfo = {
        "data": [
            {
                "id": "001",
                "name": "service_001",
                "model": "SAN",
                "room": "2",
                "cabinet": "3",
                "subrack": "2",
                "assignStatus": "Free",
                "runningStatus": "Online",
                "bmcIp": "192.168.0.11",
                "os": "Linux",
                "osIp": "192.168.0.10",
                "applyUser": "admin",
                "applyTime": "2012-02-26"
            },
            {
                "id": "002",
                "name": "service_002",
                "model": "SAN",
                "room": "2",
                "cabinet": "3",
                "subrack": "5",
                "assignStatus": "Assigned",
                "runningStatus": "Offline",
                "bmcIp": "192.168.0.21",
                "os": "Linux",
                "osIp": "192.168.0.20",
                "applyUser": "admin",
                "applyTime": "2012-02-26"
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // zone详情
    var sinCpu = [],
        cosCpu = [], sinMemory = [],
        cosMemory = [];

    for (var i = 0; i < 14; i += 0.5) {
        sinCpu.push([i, Math.sin(i)]);
        cosCpu.push([i, Math.cos(i)]);
    }
    for (var i = 0; i < 25; i += 0.5) {
        sinMemory.push([i, Math.sin(i)]);
        cosMemory.push([i, Math.cos(i)]);
    }
    var cpuListInfo = {
        "data": [
            {
                label: "The cycle",
                data: sinCpu,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            },
            {
                label: "The last cycle",
                data: cosCpu,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            }
        ]
    };
    var memoryListInfo = {
        "data": [
            {
                label: "The cycle",
                data: sinMemory,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            },
            {
                label: "The last cycle",
                data: cosMemory,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            }
        ]
    };
    var storageListInfo = {
        "data": [
            {
                label: "The cycle",
                data: sinMemory,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            },
            {
                label: "The last cycle",
                data: cosMemory,
                "statistics": {
                    "percentage": 35,
                    "used": 20,
                    "available": 40,
                    "total": 60
                }
            }
        ]
    };

    // 主存储数据
    var mainStorageListInfo = {"total": 1, "datastoreInfos": [
        {"id": "1", "name": "data001", "attachedClusters": [
            {"clusterId": "4629700416936869889$urn:sites:49F70862:clusters:10", "clusterName": "ManagementCluster"}
        ], "rid": "urn:sites:49F70862:datastores:1", "type": "LOCALPOME", "resClusterName": "ManagementCluster", "storageunitname": "scsi-SATA_ST31000524NS_9WK49CR4", "accessible": true, "hypervisorId": 4629700416936869889, "hypervisorName": "FC", "status": null, "hosts": null, "wrEnable": true, "mediaType": "SAN-Any", "maintenancemode": false, "disasterGroupId": 0, "disasterGroupName": null, "datadepth": 0, "capacity": {"totalCapacityGB": 915.0, "usedSizeGB": 84.0, "freeCapacityGB": 786.0, "allocatedCapacityGB": 0.0, "remainCapacityGB": 0.0}, "ability": {"isThin": true, "isSupportMigrateDisk": true, "supportDiskManagement": true}}
    ]};
    // 公网IP
    var publicIPListInfo = {"publicIPPools": [
        {"publicIpPoolId": "1000000000000000001", "zoneId": "4616189618054758401", "name": "newName", "description": "newName", "ipRangeList": [
            {"startIp": "192.168.60.10", "endIp": "192.168.60.20"}
        ], "usedPublicIPs": [], "statPublicIPUsages": [
            {"usage": "DNAT", "total": 0},
            {"usage": "SNAT", "total": 0},
            {"usage": "EIP", "total": 0}
        ], "usedNum": 0, "total": 1},
        {"publicIpPoolId": "1000000000000000000", "zoneId": "4616189618054758401", "name": "acsde", "description": null, "ipRangeList": [
            {"startIp": "192.168.31.91", "endIp": "192.168.31.100"}
        ], "usedPublicIPs": [], "statPublicIPUsages": [
            {"usage": "DNAT", "total": 0},
            {"usage": "SNAT", "total": 0},
            {"usage": "EIP", "total": 0}
        ], "usedNum": 0, "total": 1}
    ]};

    // vsa管理网络
    var vsaManagerListInfo = {"vsaManageNetworks": [
        {"vsaManageNetworkID": "10000000001", "name": "ci_vsam_network", "zoneID": "4616189618054758401", "dvses": [
            {"id": "32", "name": "ManagementDVS", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499424": "ManagementCluster"}, "hypervisorID": "4629700416936869889", "hypervisorName": "FC", "vsses": null, "description": null, "vlanIdList": null}
        ], "description": null, "createTime": "2014-07-25 17:09:13", "subnetIP": "188.166.4.0", "subnetMask": "255.255.255.0", "subnetGateway": "188.166.4.1", "vlan": 502, "availableIPRanges": [
            {"startIP": "188.166.4.140", "endIP": "188.166.4.160"}
        ], "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": null, "ipPacketSuppression": null, "dhcpIsolationFlag": true, "ipMacBindFlag": true}},
        {"vsaManageNetworkID": "10000000000", "name": "vsam_net", "zoneID": "4616189618054758401", "dvses": [
            {"id": "1", "name": "175dvs", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499394": "cluster175"}, "hypervisorID": "4629700416936869891", "hypervisorName": "fc", "vsses": null, "description": null, "vlanIdList": null}
        ], "description": null, "createTime": "2014-07-10 15:38:23", "subnetIP": "192.168.70.0", "subnetMask": "255.255.255.0", "subnetGateway": "192.168.70.1", "vlan": 70, "availableIPRanges": [
            {"startIP": "192.168.70.140", "endIP": "192.168.70.147"},
            {"startIP": "192.168.70.100", "endIP": "192.168.70.120"}
        ], "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": null, "ipPacketSuppression": null, "dhcpIsolationFlag": true, "ipMacBindFlag": true}}
    ]}
    var vsaManagerNetwork =
        {"vsaManageNetworkID": "10000000000", "name": "vsam_net", "zoneID": "4616189618054758401", "dvses": [
            {"id": "1", "name": "175dvs", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499394": "cluster175"}, "hypervisorID": "4629700416936869891", "hypervisorName": "fc", "vsses": null, "description": null, "vlanIdList": null}
        ], "description": null, "createTime": "2014-07-10 15:38:23", "subnetIP": "192.168.70.0", "subnetMask": "255.255.255.0", "subnetGateway": "192.168.70.1", "vlan": 70, "availableIPRanges": [
            {"startIP": "192.168.70.140", "endIP": "192.168.70.147"},
            {"startIP": "192.168.70.100", "endIP": "192.168.70.120"}
        ], "portSetting": {"inTrafficShapingPolicyFlag": false, "inTrafficShapingPolicy": null, "outTrafficShapingPolicyFlag": false, "outTrafficShapingPolicy": null, "arpPacketSuppression": 0, "ipPacketSuppression": 0, "dhcpIsolationFlag": false, "ipMacBindFlag": false}};
    var vsaManagerNetwork1 =
        {"vsaManageNetworkID": "10000000001", "name": "ci_vsam_network", "zoneID": "4616189618054758401", "dvses": [
            {"id": "32", "name": "ManagementDVS", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499424": "ManagementCluster"}, "hypervisorID": "4629700416936869889", "hypervisorName": "FC", "vsses": null, "description": null, "vlanIdList": null}
        ], "description": null, "createTime": "2014-07-25 17:09:13", "subnetIP": "188.166.4.0", "subnetMask": "255.255.255.0", "subnetGateway": "188.166.4.1", "vlan": 502, "availableIPRanges": [
            {"startIP": "188.166.4.140", "endIP": "188.166.4.160"}
        ], "portSetting": {"inTrafficShapingPolicyFlag": true, "inTrafficShapingPolicy": {"averageBandwidth": 1000, "peakBandwidth": 2000, "burstSize": 1500}, "outTrafficShapingPolicyFlag": true, "outTrafficShapingPolicy": {"averageBandwidth": 1000, "peakBandwidth": 2000, "burstSize": 1500, "priority": 4}, "arpPacketSuppression": 256, "ipPacketSuppression": 256, "dhcpIsolationFlag": true, "ipMacBindFlag": true}}

    //VETP网络
    var vetpNetworkListInfo;
    vetpNetworkListInfo = {"vtepNetworks": [
        {"vtepNetworkID": "10000000034", "name": "sdf", "zoneID": "4616189618054758401", "dvses": [
            {"id": "32", "name": "ManagementDVS", "dvsType": "VSWITCH", "clusterIDsMapNames": {"4625196817309499424": "ManagementCluster"}, "hypervisorID": "4629700416936869889", "hypervisorName": "FC123", "vsses": null, "description": null, "vlanIdList": null}
        ], "description": null, "subnetIP": "12.15.12.0", "subnetMask": "255.255.255.0", "subnetGateway": "12.15.12.1", "vlan": 44, "availableIPRanges": [
            {"startIP": "12.15.12.13", "endIP": "12.15.12.13"}
        ], "discoverFlag": false, "usedFlag": false},
        {"vtepNetworkID": "10000000000", "name": "default_vtep_network", "zoneID": "0", "dvses": [], "description": "It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.", "subnetIP": "172.116.76.0", "subnetMask": "255.255.255.0", "subnetGateway": "172.116.76.254", "vlan": 85, "availableIPRanges": null, "discoverFlag": true, "usedFlag": false},
        {"vtepNetworkID": "10000000001", "name": "default_vtep_network", "zoneID": "0", "dvses": [], "description": "It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.", "subnetIP": "172.16.76.0", "subnetMask": "255.255.255.0", "subnetGateway": "172.16.76.254", "vlan": 86, "availableIPRanges": null, "discoverFlag": true, "usedFlag": false}
    ]};

    // 防火墙数据
    var firewallListInfo = {
        "data": [
            {
                "id": "001",
                "name": "firewall_001",
                "firewall": "Xfirewall",
                "vpc": "vpc_001",
                "vmID": "i-000000001"
            },
            {
                "id": "002",
                "name": "firewall_002",
                "firewall": "Xfirewall",
                "vpc": "vpc_002",
                "vmID": "i-000000002"
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 防火墙数据
    var vlbListInfo = {
        "data": [
            {
                "id": "001",
                "name": "vlb_001",
                "type": "Hardware Load Balancing",
                "status": "Running",
                "hardwareID": "i-000000001",
                "vpcName": "vpc_001"
            },
            {
                "id": "002",
                "name": "vlb_002",
                "type": "Hardware Load Balancing",
                "status": "Running",
                "hardwareID": "i-000000002",
                "vpcName": "vpc_002"
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    fixture({
        "GET /resources/rpool/zone/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < zoneListInfo.data.length; index++) {
                data.push(zoneListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = zoneListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/delete": function (original, response) {
            var id = original.data.id;
            var zoneList = zoneListInfo.data;
            for (var index in zoneList) {
                if (zoneList[index].id === id) {
                    zoneList.splice(index, 1);
                    zoneListInfo.totalRecords = zoneList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/create": function (original, response) {
            var zoneInfo = original.data;
            var zoneList = zoneListInfo.data;
            zoneInfo.id = new Date().getMilliseconds();
            zoneInfo.operator = "";
            zoneList.push(zoneInfo);
            zoneListInfo.totalRecords = zoneList.length;

            response(200, "success", zoneInfo, {});
        },

        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/dvses?start=0&limit=10&name=&hypervisorid=": function (original, response) {
            response(200, "success", dvsListInfo, {});
        },

        "POST /resources/rpool/zone/network/dvs/delete": function (original, response) {
            var id = original.data.id;
            var dataList = dvsListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    dvsListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/network/dvs/create": function (original, response) {
            var dataInfo = original.data;
            var dataList = dvsListInfo.data;
            dataInfo.id = new Date().getMilliseconds();
            dataInfo.operator = "";
            dataList.push(dataInfo);
            dvsListInfo.totalRecords = dataList.length;

            response(200, "success", dataInfo, {});
        },

        // VSS
        "GET /resources/rpool/zone/network/vss/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < vssListInfo.data.length; index++) {
                data.push(vssListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = dvsListInfo.data.length;
            response(200, "success", dataList, {});
        },

        //VLAN池
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401/vlanpools?start=0&limit=10&name=": function (original, response) {
            response(200, "success", vlanPoolListInfo, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/multicast-ippools": function (original, response) {
            response(200, "success", multicastIPPoolList, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/dvses?start=0&limit=10&name=&hypervisorid=": function (original, response) {
            var result = {
                "dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499393":"manageRC_A01"},"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":["1"]}],"total":1
            }
            response(200, "success", result, {});
        },
        "POST /resources/rpool/zone/network/vlanPool/delete": function (original, response) {
            var id = original.data.id;
            var dataList = vlanPoolListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    vlanPoolListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/network/vlanPool/create": function (original, response) {
            response(200, "success", vlanPoolListInfo, {});
        },

        // 外部网络
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/external-networks?start=0&limit=10&name=&dvsname=&vlan=": function (original, response) {
            response(200, "success", extNetworkListInfo, {});
        },
        "GET /resources/rpool/zone/network/extNetwork/delete": function (original, response) {
            response(200, "success", "", {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/external-networks/20000000000": function (original, response) {
            response(200, "success", extNetwork, {});
        },
        "GET /goku/rest/v1.5/irm/1/elbs?zoneid=4616189618054758401&start=0&limit=10": function (original, response) {
            response(200, "success", elbs, {});
        },
        // cluster
        "GET /resources/rpool/zone/cluster/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < clusterListInfo.data.length; index++) {
                data.push(clusterListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = clusterListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/cluster/delete": function (original, response) {
            var id = original.data.id;
            var dataList = clusterListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    clusterListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/cluster/associate": function (original, response) {
            var dataInfo = original.data;
            var dataList = clusterListInfo.data;
            dataInfo.id = new Date().getMilliseconds();
            dataInfo.operator = "";
            dataList.push(dataInfo);
            clusterListInfo.totalRecords = dataList.length;

            response(200, "success", dataInfo, {});
        },

        // 物理机
        "GET /resources/rpool/zone/physical/dedicatedServers/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < dServersListInfo.data.length; index++) {
                data.push(dServersListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = dServersListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/physical/dedicatedServers/delete": function (original, response) {
            var id = original.data.id;
            var dataList = dServersListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    dServersListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },

        // zone详情
        "POST /resources/rpool/zone/detail/cpu": function (original, response) {
            var id = original.data.id;

            var dataList = {};
            dataList.data = cpuListInfo.data;

            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/detail/memory": function (original, response) {
            var id = original.data.id;

            var dataList = {};
            dataList.data = memoryListInfo.data;

            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/detail/storage": function (original, response) {
            var id = original.data.id;

            var dataList = {};
            dataList.data = storageListInfo.data;

            response(200, "success", dataList, {});
        },

        // 主存储
        "POST /goku/rest/v1.5/irm/1/datastores": function (original, response) {
            response(200, "success", mainStorageListInfo, {});
        },
        "POST /resources/rpool/zone/physical/storage/mainStorage/delete": function (original, response) {
            var id = original.data.id;
            var dataList = mainStorageListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    mainStorageListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },

        // 公网IP
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401/publicippools": function (original, response) {
            response(200, "success", publicIPListInfo, {});
        },
        "POST /resources/rpool/zone/network/publicIP/delete": function (original, response) {
            var id = original.data.id;
            var dataList = publicIPListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    publicIPListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/network/publicIP/create": function (original, response) {
            var dataInfo = original.data;
            var dataList = publicIPListInfo.data;
            dataInfo.id = new Date().getMilliseconds();
            dataInfo.operator = "";
            dataList.push(dataInfo);
            publicIPListInfo.totalRecords = dataList.length;

            response(200, "success", dataInfo, {});
        },

        // vsa管理网络
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/vsamgtnetworks": function (original, response) {
            response(200, "success", vsaManagerListInfo, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/vsamgtnetworks/10000000000": function (original, response) {
            response(200, "success", vsaManagerNetwork, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401/vsamgtnetworks/10000000001": function (original, response) {
            response(200, "success", vsaManagerNetwork1, {});
        },
        "POST /resources/rpool/zone/network/vasNetwork/vsaManagerNetwork/delete": function (original, response) {
            var id = original.data.id;
            var dataList = vsaManagerListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    vsaManagerListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/rpool/zone/network/vasNetwork/vsaManagerNetwork/create": function (original, response) {
            var dataInfo = original.data;
            var dataList = vsaManagerListInfo.data;
            dataInfo.id = new Date().getMilliseconds();
            dataInfo.operator = "";
            dataList.push(dataInfo);
            vsaManagerListInfo.totalRecords = dataList.length;

            response(200, "success", dataInfo, {});
        },

        // 可用zone
        "GET /resources/rpool/zone/availableZone/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < azListInfo.data.length; index++) {
                data.push(azListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = azListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/rpool/zone/availableZone/delete": function (original, response) {
            var id = original.data.id;
            var dataList = azListInfo.data;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    azListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },

        // 防火墙
        "GET /resources/rpool/zone/network/virtualFirewall/hardware/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < firewallListInfo.data.length; index++) {
                data.push(firewallListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = firewallListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "GET /resources/rpool/zone/network/virtualFirewall/software/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < firewallListInfo.data.length; index++) {
                data.push(firewallListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = firewallListInfo.data.length;
            response(200, "success", dataList, {});
        },

        // vlb
        "GET /resources/rpool/zone/network/vlbPool/query": function (original, response) {
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < vlbListInfo.data.length; index++) {
                data.push(vlbListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = vlbListInfo.data.length;
            response(200, "success", dataList, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/publicippools": function (original, response) {
            response(200, "success", publicIPListInfo, {});
        },
        "GET /goku/rest/v1.5/irm/1/elbs": function (original, response) {
            var result = {"lbInfos":[{"lbID":"9bbd44be-0684-4d03-af07-d91521f6d7e6","lbName":"FMRZ_VLBA01","lbParameters":[{"sessionNum":100,"maxThroughput":50000,"qosInfo":[{"name":"LBPerformance","value":"low"}]}],"lbIp":null,"listeners":[{"lbID":"9bbd44be-0684-4d03-af07-d91521f6d7e6","id":"6c6ee439-a643-4cdb-a25c-ebfc4c336ae6","status":"ERROR","protocol":"HTTP","passWord":null,"port":1004,"backPort":1004,"certificateName":null,"privateKey":null,"publicKeyCertificate":null,"certificateChain":null,"conConnectionNum":10,"maxThroughput":10,"bindingVM":null,"distributionMode":0,"sessionPre":null,"healthCheckInfo":null,"rxTraffic":0,"txTraffic":0,"enable":null}],"devID":null,"slbVmInfo":{"vmID":"649045ce-9c9a-454a-8895-3140c8cd0100","vmUrn":"4629700416936869889$urn:sites:3E3F0759:vms:i-000005F3","vmInstanceID":"46","lbID":"9bbd44be-0684-4d03-af07-d91521f6d7e6","stauts":"CREATE_FAILED","errorCode":null,"vsaID":null,"zoneID":null,"templateClusters":null,"extIP":"166.166.152.6","intIP":"166.166.152.6","vpcID":"4792750811720056834","vpcName":"FM_SVA02","extNetworkID":"30000000005","intNetworkID":"30000000005","managerNetworkIP":null},"createTime":"2014-10-13 02:56:06","status":"ERROR","userID":"28","userName":null}],"total":1}
            response(200, "success",result, {});
        },
        "GET /goku/rest/v1.5/irm/1/vms/4629700416936869889$urn:sites:3E3F0759:vms:i-000005F3": function (original, response) {
            var result ={}
            response(200, "success",result, {});
        }
    });

    return fixture;
});
