
define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var store = fixture.store(2, function (i) {
        return {
            "lbID": "20358818-d2ca-462e-95b6-df80e6145d8" + i,
            "lbName": "vlb-00" + i,           //vlb名称
            "lbParameters": [
                {
                    "sessionNum": 100+ i,           // 最大会话数
                    "maxThroughput": 1000 + i,      // 最大吞吐量
                    "qosInfo": [
                        {
                            "name": "LBPerformance",
                            "value": "high"          //类型 hight对应硬件负载均衡 low对应软件负载均衡
                        }
                    ]
                }
            ],
            "lbIp": "192.168.20.5",       //弹性IP
            "listeners": [
                {
                    "lbID": "vlb-00" + i,
                    "id": "listener" + i,
                    "status": "READY",
                    "protocol": "HTTP",
                    "passWord": "",
                    "port": "80"
                },
                {
                    "lbID": "vlb-00" + i,
                    "id": "listener" + i,
                    "status": "READY",
                    "protocol": "HTTP",
                    "passWord": "",
                    "port": "80"
                }
            ],
            "slbVmInfo": {
                "extIP": "192.168.20.3",       //外部ip
                "intIP": "192.168.20.5",
                "vpcID": "vpc-001",
                "extNetworkID": 2000 + i,
                "intNetworkID": 1999 - i
            },
            "createTime": "2014-02-21 10:00:00",      // 创建时间
            "status": "READY",                //vlb状态
            "userId": "user-001",
            "userName": "USer" + i
        }
    });
    var monitor = fixture.store(2, function (i) {
        return {
            "protocol": "HTTP",
            "extendPort": "40" + i % 10,
            "backendProtocol": "HTTPS",
            "backendPort": "30" + i % 10,
            "status": "READY",
            "vlbid": "vlb-00" + i % 200,
            "id": "monitor-00" + i
        }
    });

    var singMonitor = {
        "lbID": "vlb-001",
        "lbName": "vlb-001",           //vlb名称
        "lbParameters": [
            {
                "sessionNum": 500,               // 最大会话数
                "maxThroughput": 10000,      // 最大吞吐量
                "qosInfo": [
                    {
                        "name": "LBPerformance",
                        "value": "high"          //类型 hight对应硬件负载均衡 low对应软件负载均衡
                    }
                ]
            }
        ],
        "lbIp": "192.168.88.51",       //弹性IP
        "listeners": [
            {
                "lbID": "vlb-001",
                "id": "listener1",
                "status": "READY",
                "protocol": "HTTP",
                "passWord": "",
                "port": "80",
                "backPort": "808",
                "bindingVM": [
                    {
                        "vmID": "i-00000008A",
                        "vmIP": "192.168.10.20",
                        "vmName": "Vm001"
                    },
                    {
                        "vmID": "i-00000009A",
                        "vmIP": "192.168.10.21",
                        "vmName": "Vm002"
                    },
                    {
                        "vmID": "i-00000010A",
                        "vmIP": "192.168.10.22",
                        "vmName": "Vm003"
                    }
                ]
            },
            {
                "lbID": "vlb-001",
                "id": "listener1",
                "status": "READY",
                "protocol": "HTTP",
                "passWord": "",
                "port": "80",
                "backPort": "808",
                "bindingVM": [
                    {
                        "vmID": "i-00000008A",
                        "vmIP": "192.168.10.20",
                        "vmName": "Vm001"
                    },
                    {
                        "vmID": "i-00000009A",
                        "vmIP": "192.168.10.21",
                        "vmName": "Vm002"
                    },
                    {
                        "vmID": "i-00000010A",
                        "vmIP": "192.168.10.22",
                        "vmName": "Vm003"
                    }
                ]
            },
            {
                "lbID": "vlb-001",
                "id": "listener1",
                "status": "READY",
                "protocol": "HTTP",
                "passWord": "",
                "port": "80",
                "backPort": "808",
                "bindingVM": [
                    {
                        "vmID": "i-00000008A",
                        "vmIP": "192.168.10.20",
                        "vmName": "Vm001"
                    },
                    {
                        "vmID": "i-00000009A",
                        "vmIP": "192.168.10.21",
                        "vmName": "Vm002"
                    },
                    {
                        "vmID": "i-00000010A",
                        "vmIP": "192.168.10.22",
                        "vmName": "Vm003"
                    }
                ]
            },
            {
                "lbID": "vlb-001",
                "id": "listener1",
                "status": "READY",
                "protocol": "HTTP",
                "passWord": "",
                "port": "80",
                "backPort": "808",
                "bindingVM": [
                    {
                        "vmID": "i-00000008A",
                        "vmIP": "192.168.10.20",
                        "vmName": "Vm001"
                    },
                    {
                        "vmID": "i-00000009A",
                        "vmIP": "192.168.10.21",
                        "vmName": "Vm002"
                    },
                    {
                        "vmID": "i-00000010A",
                        "vmIP": "192.168.10.22",
                        "vmName": "Vm003"
                    }
                ]
            },
            {
                "lbID": "vlb-001",
                "id": "listener2",
                "status": "READY",
                "protocol": "HTTPS",
                "passWord": "",
                "port": "802",
                "backPort": "809",
                "bindingVM": [
                    {
                        "vmID": "i-00000008B",
                        "vmIP": "192.168.20.20",
                        "vmName": "Vm001"
                    },
                    {
                        "vmID": "i-00000009B",
                        "vmIP": "192.168.20.21",
                        "vmName": "Vm002"
                    },
                    {
                        "vmID": "i-00000010B",
                        "vmIP": "192.168.20.22",
                        "vmName": "Vm003"
                    }
                ]
            }
        ],
        "slbVmInfo": {
            "extIP": "192.168.20.3",       //外部ip
            "intIP": "192.168.20.5",
            "vpcID": "vpc-001",
            "extNetworkID": 2000,
            "intNetworkID": 1999
        },
        "createTime": "2014-02-21 10:00:00",      // 创建时间
        "status": "READY",                //vlb状态
        "userId": "user-001",
        "userName": "USer"
    }

    var networkInfo = {
        networks: [
            {
                networkID: "network01",
                azID: "az01",
                name: "Network_AZ01",
                networkType: 3,
                vlan: 2,
                ipv4Subnet: {subnetAddr: "192.168.201.0"},
                ipv6Subnet: {},
                azName: "shenzhen_AZ01"
            },
            {
                networkID: "network02",
                azID: "az02",
                name: "Network_AZ02",
                networkType: 2,
                vlan: 3,
                ipv4Subnet: {subnetAddr: "192.168.201.0"},
                ipv6Subnet: {},
                azName: "shenzhen_AZ02"
            },
            {
                networkID: "network03",
                azID: "az03",
                name: "网络003",
                networkType: 1,
                vlan: 4,
                ipv4Subnet: null,
                ipv6Subnet: {subnetAddr: "fe80:2aac:2100:a4ff:fee3:9566:300c:326b"},
                azName: "深圳03"
            }
        ]
    };

    fixture({
        //删除指定的路由器
        "DELETE /irm/rest/v1.5/vlbs/{id}": function (original, response) {
            var id = original.data.id;
            var result = {};
            if (router && router.routerID === id) {
                router = {};
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

        //申请路由器
        "POST /irm/rest/v1.5/vlbs": function (original, response) {
            var userId = original.data.userId;
            var vdcId = original.data.vdcId;
            var hypervisorId = original.data.hypervisorId;
            var vpcID = original.data.vpcID;
            var routerType = original.data.routerType;
            var routerType = original.data.routerType;
            var maxRxThroughput = original.data.maxRxThroughput;
            var maxTxThroughput = original.data.maxTxThroughput;

            var result = {
                code: "200",
                message: "create success",
                routerID: "router-001",
                taskID: "taskID-001"
            };
            _.extend(router, {
                "userId": userId,
                "vdcId": vdcId,
                "hypervisorId": hypervisorId,
                "vpcID": vpcID,
                "routerType": routerType,
                "maxRxThroughput": maxRxThroughput,
                "maxTxThroughput": maxTxThroughput,
                "routerID": "router-001",
                "name": "测试路由器",
                "ID": "123456",
                status: 1 //创建中
            });

            setTimeout(function () {
                router.status = 0;
            }, 2000);
            response(200, "success", result, {});
        },

        "GET /irm/rest/v1.5/vpcid/{vpcid}/vlbs/{id}": function (original, response) {
            var id = original.data.id;
            var settings = {
                "vlbid": id
            };
            var monitors = monitor.findAll(settings);
            var resultQ = store.find(original);
            if (resultQ) {
                resultQ.monitors = monitors.data;
            }
            var result = {
                code: "200",
                vlb: resultQ
            };
            if (!resultQ) {
                result.message = "no vlb";
            }
            else {
                result.message = "has vlb";
            }
            response(200, "success", result, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function (original, response) {
            response(200, "success", networkInfo, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/elbs/{id}": function (original, response) {
            response(200, "success", singMonitor, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/elbs/action?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/elbs?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", networkInfo, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/vpc/{vpcid}/elasticips?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {"ip": "192.168.88.88"}, {});
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/elbs/{lbid}/listeners/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {"taskId": "8888888"}, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/elbs?cloud-infra={cloud_infra_id}&vpcid={vpcid}&start={start}&limit={limit}": function (original, response) {
            var vpcid = original.data.vpcid;
            var start = original.data.start;
            var count = original.data.limit;
            var settings = {
                "vpcID": vpcid,
                "offset": start,
                "limit": count
            };

            var resultQ = store.findAll(settings);
            var result = {
                code: "200",
                lbInfos: resultQ.data,
                total: resultQ.data.length
            };
            if (resultQ.data.length <= 0) {
                result.message = "no vlb";
            }
            else {
                result.message = "has vlb"
            }
            response(200, "success", result, {})
        },
        //查询VLB下前、后端网络
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            var result = {
                "networkID": "30000000010",
                "vpcID": "4792750811720056840",
                "azID": "4616189618054758402",
                "vdcID": "7",
                "userID": null,
                "name": "DHCP_01",
                "description": null
            };
            response(200, "success", result, {});
        }
    });

    return fixture;
});