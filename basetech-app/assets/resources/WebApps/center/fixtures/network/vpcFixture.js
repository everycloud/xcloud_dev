define(["can/util/fixture/fixture"], function (fixture) {
    var sharedVpcInfoList = {
        "vpcs": [
            {
                "vpcID": "4792750811720056851",
                "availableZone": [
                    {
                        "id": "4616189618054758401",
                        "name": "shenzhen_AZ01"
                    }
                ],
                "tenantID": "user001",
                "name": "sharedVPC_A01",
                "description": "vpc in AZ01",
                "opt": "",
                "vpcSpecTemplate": {}

            },
            {
                "vpcID": "4792750811720056852",
                "availableZone": [
                    {
                        "id": "4616189618054758402",
                        "name": "shenzhen_AZ02"
                    }
                ],
                "tenantID": "user002",
                "name": "sharedVPC_A02",
                "description": "vpc in AZ02",
                "opt": "",
                "vpcSpecTemplate": {}
            },
            {
                "vpcID": "4792750811720056853",
                "availableZone": [
                    {
                        "id": "4616189618054758403",
                        "name": "shenzhen_AZ03"
                    }
                ],
                "tenantID": "user003",
                "name": "sharedVPC_A03",
                "description": "vpc in AZ03",
                "opt": "",
                "vpcSpecTemplate": {}
            }
        ],
        "total": 3
    };
    var myVpcInfoList = {
        "vpcs": [
            {
                "vpcID": "4792750811720056851",
                "availableZone": [
                    {
                        "id": "4616189618054758401",
                        "name": "shenzhen_AZ01"
                    }
                ],
                "tenantID": "user001",
                "name": "myVPC_A01",
                "description": "vpc in AZ01",
                "opt": "",
                "vpcSpecTemplate": {}

            },
            {
                "vpcID": "4792750811720056852",
                "availableZone": [
                    {
                        "id": "4616189618054758402",
                        "name": "shenzhen_AZ02"
                    }
                ],
                "tenantID": "user002",
                "name": "myVPC_A02",
                "description": "vpc in AZ02",
                "opt": "",
                "vpcSpecTemplate": {}
            },
            {
                "vpcID": "4792750811720056853",
                "availableZone": [
                    {
                        "id": "4616189618054758403",
                        "name": "shenzhen_AZ03"
                    }
                ],
                "tenantID": "user003",
                "name": "myVPC_A03",
                "description": "vpc in AZ03",
                "opt": "",
                "vpcSpecTemplate": {}
            }
        ],
        "total": 3
    };
    var authorizationVpc = {
        "vpcAuthList": [
            {
                "vpcID": "4792750811720056851",
                "vpcName": "VPC_A01",
                "id": "3d3e91ab-bb01-4fb2-8204-16015657be6f"
            }
        ],
        "total": 1
    }

    var vpcTopo = {
        "routerInfo": {
            "id": "asfasf",
            "name": "router1"
        },
        "networkInfoList": [
            {
                "name": "network-01",
                "networkType": 2, //1:直连网络; 2:内部网络; 3:路由网络
                "subnetInfo": [
                    {
                        "subnetAddr": "192.168.1.1",
                        "subnetPrefix": "IPv4"
                    }
                ],
                "vmInfo": [
                    {
                        "id": "vm-01",
                        "name": "vm-01"
                    }
                ]
            },
            {
                "name": "network-02",
                "networkType": 2, //1:直连网络; 2:内部网络; 3:路由网络
                "subnetInfo": [
                    {
                        "subnetAddr": "192.168.1.1",
                        "subnetPrefix": "IPv4"
                    }
                ],
                "vmInfo": [
                    {
                        "id": "vm-01",
                        "name": "vm-01"
                    },
                    {
                        "id": "vm-02",
                        "name": "vm--02"
                    },
                    {
                        "id": "vm-03",
                        "name": "vm-03"
                    },
                    {
                        "id": "vm-04",
                        "name": "vm-04"
                    }
                ]
            }
        ],
        "firewallRuleInfoList": [
            {
                "id": "firewall"
            }
        ]
    };
    fixture({
        //查询VPC列表
        "GET /goku/rest/v1.5/{vdc_id}/vpcs": function (original, response) {
            var share = original.data.shared;
            if(share){
                response(200, "success", sharedVpcInfoList, {});
            }else{
                response(200, "success", myVpcInfoList, {});
            }
        },
        //查询VPC拓扑
        "GET /goku/rest/v1.5/{vdc_id}/topos/vpcs/{id}": function (original, response) {
            response(200, "success", vpcTopo, {});
        },

        //创建VPC
        "POST /goku/rest/v1.5/{vdc_id}/vpcs?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //删除VPC
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //修改VPC
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        //查询授权Vpc
        "GET /goku/rest/v1.5/{vdc_id}/vpc-authentications": function (original, response) {
            response(200, "success", authorizationVpc, {});
        }
    });
    return fixture;
});