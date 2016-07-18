
define(["can/util/fixture/fixture"], function (fixture) {

    var vpnConn = [];
    for (var i = 0; i < 2; i++) {
        vpnConn.push({
            "name": "vpnLink_A0" + i,
            "description": "vpnConn" + i,
            createTime: "2012-03-01 03:30",
            lastModifiedTime: "2012-03-01 03:50",
            "status": i % 2 ? "READY" : "BUILD",
            "vpnType": 1,
            "vpnConnectionID": "00000" + i,
            "pfsGroup": "DH" + i % 4,
            "lifeTime": 3600 + i * 100,
            "customerGw": i % 2 == 0 ? {
                "ipAddr": "192.168.40." + (40 + i),
                "customerSubnets": [
                    {"subnetAddr": "192.168.10.1", "subnetMask": "255.255.255.0"},
                    {"subnetAddr": "192.168.10.1", "subnetMask": "255.255.255.0"}
                ]
            } : {},
            "l2tpInfo": i % 2 == 1 ? {} : {
                "subnetAddr": "192.168.10.1", "subnetMask": "255.255.255.0",
                "vpnUsers":["user001","user002"]
            }
        });
    }

    fixture({
        //查询VPN网关
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway": function (request, response) {
            var resp = {
                code: "0",
                vpnGw: {
                    basicInfo: {
                        "name": "VPNGateway",
                        "ipAddr": "192.168.0.10",
                        "description": "我的网关"
                    }
                },
                total: 1
            };
            response(200, "success", resp, {});
        },
        //查询VPN网关详情
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}": function (request, response) {
            var resp = {
                code: "0",
                basicInfo: {
                    "name": "VPN Gateway",
                    "ipAddr": "192.168.0.154",
                    "description": "我的网关"
                },
                total: 1
            };
            response(200, "success", resp, {});
        },
        //创建VPN网关
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //修改VPN网关
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //删除VPN网关
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-gateway/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //查询VPC下VPN链接
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections": function (request, response) {
            var resp = {
                code: "0",
                vpnConnections: vpnConn,
                total: 2
            };
            response(200, "success", resp, {});
        },
        //删除VPC下VPN链接
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/vpn-connections/{id}": function (request, response) {
            response(200, "success", {"taskId": "0000002"}, {});
        }
    });
    return fixture;
});



