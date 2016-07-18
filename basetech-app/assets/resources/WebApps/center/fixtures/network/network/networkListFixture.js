define(["can/util/fixture/fixture"], function (fixture) {
    var dnatDetail = {
        "startTime": "2016-08-11",
        "endTime": "2016-08-13"
    };
    var allDNATS2 = {"dnats": [
        {"userID": null, "dnatID": "22", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2059, "publicIp": "192.168.1.1", "publicPort": 2060, "startTime": "2014-05-13 14:31:45", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "25", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2059, "publicIp": "192.168.1.1", "publicPort": 2060, "startTime": "2014-05-13 14:31:45", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "21", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2057, "publicIp": "192.168.1.1", "publicPort": 2058, "startTime": "2014-05-13 14:31:16", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "20", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2029, "publicIp": "192.168.1.1", "publicPort": 2129, "startTime": "2014-05-13 14:18:29", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "19", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2028, "publicIp": "192.168.1.1", "publicPort": 2128, "startTime": "2014-05-13 14:08:05", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "18", "vmID": "-1", "vmName": null, "nicID": "0", "nicName": "eth0", "privateIp": "192.168.1.5", "privatePort": 2027, "publicIp": "192.168.1.1", "publicPort": 2127, "startTime": "2014-05-13 14:06:33", "endTime": null, "status": 0, "protocol": "UDP"},
        {"userID": null, "dnatID": "17", "vmID": "-1", "vmName": null, "nicID": "0", "nicName": "eth0", "privateIp": "192.168.1.8", "privatePort": 2026, "publicIp": "192.168.1.1", "publicPort": 2126, "startTime": "2014-05-13 14:05:52", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "16", "vmID": "-1", "vmName": null, "nicID": "0", "nicName": "eth0", "privateIp": "192.168.1.6", "privatePort": 2025, "publicIp": "192.168.1.1", "publicPort": 2125, "startTime": "2014-05-13 14:05:23", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "15", "vmID": "-1", "vmName": null, "nicID": "0", "nicName": "eth0", "privateIp": "192.168.1.8", "privatePort": 2024, "publicIp": "192.168.1.1", "publicPort": 2024, "startTime": "2014-05-13 14:04:32", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "13", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2026, "publicIp": "192.168.1.1", "publicPort": 2007, "startTime": "2014-05-13 13:56:29", "endTime": null, "status": 0, "protocol": "TCP"},
        {"userID": null, "dnatID": "12", "vmID": "5", "vmName": "DNAT_TST", "nicID": "4710765210229538817", "nicName": "eth0", "privateIp": "192.168.1.7", "privatePort": 2022, "publicIp": "192.168.1.1", "publicPort": 2006, "startTime": "2014-05-13 13:54:08", "endTime": null, "status": 0, "protocol": "TCP"}],
        "total": 11};

    var allDnets = {
        "dnats": [{
            "dnatID": "1",
            "vmID": "4629700416936869889$urn:sites:405507C6:vms:i-000000BA",
            "vmName": "softVM100",
            "nicID": "4629700416936869889$urn:sites:405507C6:vms:i-000000BA:nics:0",
            "nicName": "eth0",
            "privateIp": "192.168.100.100",
            "privatePort": 200,
            "publicIp": "192.168.170.9",
            "publicPort": 2000,
            "startTime": "2014-05-26 11:03:11",
            "endTime": "2014-05-26 15:03:11",
            "status": 'READY',
            "protocol": "TCP",
            "vpcID": "4792750811720057108",
            "vpcName": "unsharedVPC_B01"
        }, {
            "dnatID": "3",
            "vmID": "4629700416936869889$urn:sites:405507C6:vms:i-000000B9",
            "vmName": "hardVM222",
            "nicID": "4629700416936869889$urn:sites:405507C6:vms:i-000000B9:nics:0",
            "nicName": "eth0",
            "privateIp": "192.168.222.222",
            "privatePort": 1,
            "publicIp": "192.168.31.12",
            "publicPort": 2000,
            "startTime": "2014-05-26 16:26:23",
            "endTime": "2014-05-26 19:26:23",
            "status": 'READY',
            "protocol": "TCP",
            "vpcID": "4792750811720057110",
            "vpcName": "unsharedVPC_B01"
        }],
        "total": 2
    };
    var network = {};
    var networkList = {
        "networks": [
            {
                "networkID": "network-001",
                "name": "网络1区",
                "status": 2,
                "networkType": 2,
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "description": "网络1区描述",
                "vlan": 123,
                "totalBoundNics": 12,
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "域名1",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                },
                "ipv6Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "ipv6域名1",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                }
            },
            {
                "name": "网络2区",
                "status": 0,
                "networkType": 3,
                "subnets": "IPv4:192.168.123.211/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "description": "网络2区描述",
                "opt": "",
                "networkID": "network-002",
                "vlan": 345,
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "totalBoundNics": 13,
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "域名2",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                },
                "ipv6Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "ipv6域名2",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                }
            },
            {
                "networkID": "network-002",
                "vpcID": "asdf",
                "azID": "ddd",
                "tenantID": "123",
                "userID": "1234",
                "name": "内部2区网络",
                "description": "内部2区网络",
                "status": "READY",// 0-就绪 1-删除中 2-创建中 3-失败 4修改中
                "networkType": 1, //1:直连网络; 2:内部网络; 3:路由网络
                "subnets": "IPv4:192.168.123.211/24",
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,//IPv4分配方式 0:外部dhcp 1:内部dhcp 2:手动 3:静态注入 4:无状态自动配置 IPv6分配方式 0:外部dhcp 1:内部dhcp, 超级子网不支持内部DHCP分配方式 3:静态注入 4:无状态自动配置 网络类型为： Routed_Network 只能选择 1或3 Internal_Subnet 可以选择 1,2,3 VLAN 只能选择 2
                    "subnetAddr": "192.168.1.234",
                    "subnetPrefix": "192.168.1.1",
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null,
                "totalBoundNics": 12
            },
            {
                "networkID": "network-008",
                "vpcID": "asdf",
                "azID": "ddd",
                "tenantID": "123",
                "userID": "1234",
                "name": "内部2区网络",
                "description": "内部2区网络",
                "status": "READY",// 0-就绪 1-删除中 2-创建中 3-失败 4修改中
                "networkType": 1, //1:直连网络; 2:内部网络; 3:路由网络
                "subnets": "IPv4:192.168.123.211/24",
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,//IPv4分配方式 0:外部dhcp 1:内部dhcp 2:手动 3:静态注入 4:无状态自动配置 IPv6分配方式 0:外部dhcp 1:内部dhcp, 超级子网不支持内部DHCP分配方式 3:静态注入 4:无状态自动配置 网络类型为： Routed_Network 只能选择 1或3 Internal_Subnet 可以选择 1,2,3 VLAN 只能选择 2
                    "subnetAddr": "192.168.1.234",
                    "subnetPrefix": "192.168.1.1",
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null,
                "totalBoundNics": 12
            },
            {
                "networkID": "network-003",
                "vpcID": "asdf",
                "azID": "ddd",
                "tenantID": "123",
                "userID": "1234",
                "name": "内部3区网络",
                "description": "内部3区网络",
                "status": "READY",// 0-就绪 1-删除中 2-创建中 3-失败 4修改中
                "networkType": 1, //1:直连网络; 2:内部网络; 3:路由网络
                "subnets": "IPv4:192.168.123.211/24",
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,//IPv4分配方式 0:外部dhcp 1:内部dhcp 2:手动 3:静态注入 4:无状态自动配置 IPv6分配方式 0:外部dhcp 1:内部dhcp, 超级子网不支持内部DHCP分配方式 3:静态注入 4:无状态自动配置 网络类型为： Routed_Network 只能选择 1或3 Internal_Subnet 可以选择 1,2,3 VLAN 只能选择 2
                    "subnetAddr": "192.168.1.234",
                    "subnetPrefix": "192.168.1.1",
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null,
                "totalBoundNics": 12
            },
            {
                "networkID": "network-009",
                "vpcID": "asdf",
                "azID": "ddd",
                "tenantID": "123",
                "userID": "1234",
                "name": "内部4区网络",
                "description": "内部4区网络",
                "status": "READY",// 0-就绪 1-删除中 2-创建中 3-失败 4修改中
                "networkType": 2, //1:直连网络; 2:内部网络; 3:路由网络
                "subnets": "IPv4:192.168.123.211/24",
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,//IPv4分配方式 0:外部dhcp 1:内部dhcp 2:手动 3:静态注入 4:无状态自动配置 IPv6分配方式 0:外部dhcp 1:内部dhcp, 超级子网不支持内部DHCP分配方式 3:静态注入 4:无状态自动配置 网络类型为： Routed_Network 只能选择 1或3 Internal_Subnet 可以选择 1,2,3 VLAN 只能选择 2
                    "subnetAddr": "192.168.1.234",
                    "subnetPrefix": "192.168.1.1",
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null,
                "totalBoundNics": 12
            }
        ]
    };

    var privateIP = {
        "privateIPs": [
            {
                "id": "privateip001",
                "ip": "192.168.10.11",
                "networkID": "routeId001",
                "networkName": "router001",
                "description": "描述",
                "elasticIP": "192.168.10.12",
                "usedType": "DNAT",
                "vmName": "vm001",
                "nicName": "eth0",
                "status": 1
            },
            {
                "id": "privateip001",
                "ip": "192.168.10.11",
                "networkID": "routeId001",
                "networkName": "router001",
                "description": "描述1",
                "elasticIP": "192.168.10.12",
                "status": 2
            }
        ],
        "total": 2
    };
    var singleNet = {
        "networks": [
            {
                "networkID": "network-001",
                "name": "网络1区",
                "status": 2,
                "networkType": 2,
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "description": "网络1区描述",
                "vlan": 123,
                "totalBoundNics": 12,
                "ipv4Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "域名1",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                },
                "ipv6Subnet": {
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    "subnetAddr": "192.168.154.0",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.154.1",
                    "dhcpOption": {
                        "domainName": "ipv6域名1",
                        "primaryDNS": "192.168.154.0",
                        "secondaryDNS": "192.168.154.1",
                        "primaryWINS": "192.168.154.2",
                        "secondaryWINS": "192.168.154.3"
                    }
                }}
        ]
    };

    var vpcQuota = {
        vm: { inUse: 1,reserved:-1, limit: -1 },
        vCPU: {
            inUse: 2, reserved:-1,limit: -1
        },
        memoryCapacity: {
            inUse: 8192, reserved:-1,limit: -1
        },
        storageCapacity: {
            inUse: 700, reserved:-1,limit: -1
        },
        routedNetwork: {
            inUse: 80, reserved:120,limit: 200
        },
        publicIp: {
            inUse: 80, reserved:120,limit: 200
        },
        securityGroup: {
            inUse: 80, reserved:120,limit: 200
        }
    };

    var vdcQuota = {
        "quotaInfo":[
            {"quotaName":"CPU",limit:1000},
            {"quotaName":"MEMORY",limit:500},
            {"quotaName":"STORAGE",limit:500},
            {"quotaName":"EIP",limit:500},
            {"quotaName":"SEG",limit:500},
            {"quotaName":"VM",limit:500}
        ],
        "quotaDistribution":[
            {"quotaName":"CPU",limit:500},
            {"quotaName":"MEMORY",limit:300},
            {"quotaName":"STORAGE",limit:300},
            {"quotaName":"EIP",limit:200},
            {"quotaName":"SEG",limit:200},
            {"quotaName":"VM",limit:20}
        ]
    };

    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{networkID}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", singleNet, {});
        },
        // 查询私有IP
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", privateIP, {});
        },
        // 查询vpc配额
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{id}/statistics": function (request, response) {
            response(200, "success", vpcQuota, {});
        },
        // 查询vdc配额
        "GET /goku/rest/v1.5/vdcs/{id}/quotas/usage": function (request, response) {
            response(200, "success", vdcQuota, {});
        },
        // 更新私有IP
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {"privateIP": "192.168.33.44", "id": "100002"}, {});
        },
        // 申请私有IP
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {"privateIP": "192.168.33.44", "id": "100002"}, {});
        },
        // 释放私有IP
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {"privateIP": "192.168.33.44"}, {});
        },

        //删除网络信息
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            var id = original.data.id;
            var orgid = original.data.vdc_id;
            var cloudid = original.data.cloud_infras_id;
            var result = {};
            if (networkList.id === id) {
                result = {
                    code: "200",
                    message: "delete success",
                    taskID: "taskID-001"
                };
            }
            else {
                result = {
                    code: "0020101933",
                    message: "delete fail",
                    taskID: ""
                };
            }
            response(200, "success", result, {});
        },

        //创建网络
        "POST /goku/rest/v1.5/{vdc_id}/networks?cloud-infras={cloud_infras_id}": function (original, response) {
            var userId = original.data.userId;
            var vdcId = original.data.vdc_id;
            var cloudId = original.data.cloud_infras_id;

            var result = {
                code: "200",
                message: "create success"
            };
            _.extend(network, {
                "userId": userId,
                "vdcId": vdcId
            });

            setTimeout(function () {

            }, 2000);
            response(200, "success", networkList, {});
        },
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnets/{id}/action?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function(original, response){
            response(200, "success", allDnets, {});
        },
        //修改网络
        "PUT /goku/rest/v1.5/{vdc_id}/networks/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        //查询aspf
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/aspf": function (original, response) {
            var aspfData = {
                dns: false,
                ftp: true,
                ils: false,
                msn: false,
                qq: true,
                h323: true,
                netbios: true,
                sip: false,
                mgcp: false,
                mms: false,
                rtsp: false,
                pptp: true,
                sqlnet: true
            };
            response(200, "success", aspfData, {});
        },
        //修改aspf
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/aspf?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        //查询网络统计信息
        "GET /goku/rest/v1.5/{vdc_id}/capacity-statistics/networks": function (original, response){
            var networkStatistics = {
                vpcNum: 3,
                elasticIPNum: 1,
                securityGroupNum: 2
            };
            response(200, "success", networkStatistics, {});
        }
    });

    return fixture;
});



