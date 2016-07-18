define(["can/util/fixture/fixture"], function (fixture) {
    //VM、VPN、SLB、F5、MANUAL_IP,NO_USE
    var USED_TYPE = ["VM", "VPN", "SLB", "F5", "MANUAL_IP", "NO_USE"];

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
                "status": "READY",
                "networkType": 2,
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
            }
        ]
    };
    var i = Math.ceil(Math.random()*10);
    var resp = {
        code: "0",
        elasticIPs: [
            {
                "id": "100000000000000008" + i,
                "ip": "192.168.0.1" + i,
                "resourceStatus": i % 2 == 0 ? "UNBIND" : "BIND",
                "operateStatus": i % 2 == 0 ? "BIND_SUCCESS" : "NO_OP",
                "usedType": getUsedType(i),
                "publicIPPoolName": "RPOOL",
                "vmName": "VM001",
                "nicName": "nic001",
                "privateIP": "192.168.0.2",
                "externalNetworkName": "external Network Name",
                "bandwidthStatus": i % 2 == 0 ? "SUCCESS" : "FAIL"
            },
            {
                "id": "100000000000000008" + i+1,
                "ip": "192.168.0.1" + i+1,
                "resourceStatus": (i+1) % 2 == 0 ? "UNBIND" : "BIND",
                "operateStatus": (i+1) % 2 == 0 ? "BIND_SUCCESS" : "NO_OP",
                "usedType": getUsedType(i+1),
                "publicIPPoolName": "RPOOL",
                "vmName": "VM001",
                "nicName": "nic001",
                "privateIP": "192.168.0.2",
                "externalNetworkName": "external Network Name",
                "bandwidthStatus": (i+1) % 2 == 0 ? "SUCCESS" : "FAIL"
            },
            {
                "id": "100000000000000008" + i + 2,
                "ip": "192.168.0.1" + i + 2,
                "resourceStatus":  (i+2) % 2 == 0 ? "UNBIND" : "BIND",
                "operateStatus":  (i+2) % 2 == 0 ? "BIND_SUCCESS" : "NO_OP",
                "usedType": getUsedType(i+2),
                "publicIPPoolName": "RPOOL",
                "vmName": "VM001",
                "nicName": "nic001",
                "privateIP": "192.168.0.2",
                "externalNetworkName": "external Network Name",
                "bandwidthStatus": i % 2 == 0 ? "SUCCESS" : "FAIL"
            }
        ],
        total: 3
    };

    function getUsedType(index) {
        return USED_TYPE[index % 6];
    }

    fixture({
        //查询弹性IP列表
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips": function (request, response) {
            response(200, "success", resp, {});
        },
        //查询弹性IP详情
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}": function (request, response) {
            var resp = {
                "id": "" + i,
                "ip": "192.168.2.5",
                "resourceStatus": "1",
                "publicIPPoolName": "RPOOL",
                "vmName": "VM001",
                "nicName": "nic001",
                "privateIP": "192.168.0.2",
                "bandwidthStatus": "0",
                "maxRxBandwidth": 100,
                "maxTxBandwidth": 50,
                "totalAclRule": 20,
                "applyTime": "2011-3-22"
            }
            response(200, "success", resp, {});
        },
        //释放弹性IP
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //解绑定&绑定
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/action?cloud-infras={cloud_infras_id}": function (request, response) {
            var requestStr = request.data;
            //解绑定
            if (requestStr.indexOf("unbind") > 0) {
                response(200, "success", {}, {});
            }
            else
            //绑定
            {
                response(200, "success", {}, {});
            }
        },
        //查询IP带宽模板
        "GET /goku/rest/v1.5/{vdc_id}/ipbwtemplates": function (request, response) {
            var resp = {
                code: "0",
                ipbwTemplates: [],
                total: 0
            };
            var start = parseInt(request.data.start, 10);
            var limit = parseInt(request.data.limit, 10);
            var item = {};
            for (var i = start; i < 3; i++) {
                item = {
                    "ipBwTemplateId": "00" + i,
                    "name": "ipBwTemplateName",
                    "maxRxBandwidth": 100 + i,
                    "maxTxBandwidth": 50 + i
                }
                resp.ipbwTemplates.push(item);
            }
            resp.total = 50;
            response(200, "success", resp, {});
        },

        //查询公有IP
        "GET /goku/rest/v1.5/{vdc_id}/publicippools": function (request, response) {
            var resp = {
                code: "0",
                publicIPPools: [],
                total: 0
            };
            var item = {};
            for (var i = 0; i < 5; i++) {
                item = {
                    "publicIpPoolId": "00" + i,
                    "name": "ipBwTemplateName" + i
                }
                resp.publicIPPools.push(item);
            }
            resp.total = 50;
            response(200, "success", resp, {});
        },
        //申请弹性IP
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //修改弹性IP带宽
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/elasticips/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //查询虚拟机列表
        "POST /goku/rest/v1.5/{vdc_id}/vms/action?cloud-infra={cloud-infra}": function (request, response) {
            var json = $.parseJSON(request.data);
            var start = parseInt(json.list.start, 10);
            var limit = parseInt(json.list.limit, 10);
            var resp = {
                code: "0",
                list: {
                    vms: []
                },
                total: 0
            };
            var item = {};
            for (var i = start; i < start + 3; i++) {
                item = {
                    "id": "" + i,
                    "name": "虚拟机" + i,
                    "vmSpecInfo": {
                        "nics": [
                            {
                                "name": "eth0",
                                "ip": "192.168.34.33",
                                "mac": "05-16-DC-59-C2-34"
                            },
                            {
                                "name": "eth1",
                                "ipv6s": "192.168.34.56",
                                "mac": "05-16-DC-59-C2-34"
                            }
                        ]
                    },
                    "status": "stoped",
                    "type": "模板虚拟机"
                }
                resp.list.vms.push(item);
            }
            resp.total = 50;
            response(200, "success", resp, {});
        },
        //查询虚拟机详细信息
        "GET /goku/rest/v1.5/{vdc_id}/vms/{id}": function (request, response) {
            var resp = {
                code: "0",
                vm: {
                    "nics": [
                        {
                            "name": "eth0",
                            "ip": "192.168.34.33",
                            "nicId": "523ec105-527b-4191-99b0-89f3d81d4e69"
                        },
                        {
                            "name": "eth1",
                            "ip": "192.168.34.56",
                            "nicId": "523ec105-527b-4191-99b0-89f3d81d4e88"
                        }
                    ]
                }
            };
            response(200, "success", resp, {});
        },
        //查询私有IP列表
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/privateips": function (request, response) {
            var resp = {
                code: "0",
                privateIPs: [],
                total: 0
            };
            var item = {};
            for (var i = 0; i < 3; i++) {
                item = {
                    "ip": "192.168.0.1" + i,
                    "description": "Route network",
                    "networkName": "Network_AZ0" + i,
                    "networkID": "123" + i
                };
                resp.privateIPs.push(item);
            }
            resp.total = 30;
            response(200, "success", resp, {});
        }
    });
    return fixture;
});



