define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var router = null;
    var externalNet = {
        externalNetworks: [
            {
                "exnetworkID": "exnetwork1",
                "name": "外部网络1",
                "vlans": [10, 20],
                "ipv4Subnet": {
                    "subnetAddr": "192.168.40.2",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.40.1"
                },
                "ipv6Subnet": {
                    "subnetAddr": null,
                    "subnetPrefix": null,
                    "gateway":null
                }
            },
            {
                "exnetworkID": "exnetwork2",
                "name": "外部网络2",
                "vlans": [10, 20],
                "ipv4Subnet": {
                    "subnetAddr": "192.168.40.2",
                    "subnetPrefix": "255.255.255.0",
                    "gateway": "192.168.40.1"
                },
                "ipv6Subnet": {
                    "subnetAddr": null,
                    "subnetPrefix": null,
                    "gateway":null
                }
            }
        ],
        "total": 2
    };

    fixture({
        //删除指定的路由器
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            var id = original.data.id;
            var orgid = original.data.vdc_id;
            var cloudId = original.data.cloud_infras_id;
            if (id && orgid && cloudId) {
                router = null;
                response(200, "success", {}, {});
            }
            else {
                response(500, "success", {
                    "code": "1000004"
                }, {});
            }
        },

        //申请路由器
        "POST /goku/rest/v1.5/{vdc_id}/routers?cloud-infras={cloud_infras_id}": function (original, response) {
            var vdcId = original.data.vdc_id;
            var cloudId = original.data.cloud_infras_id;

            router = {
                "routerID": "1000000000000000003",
                "name": "Router_VPC_A01",
                "routerType": 1,
                "status": 0,
                "routes": [
                    {
                        "nexthop": "192.168.0.10",
                        "subnetIp": "192.168.1.0",
                        "mask": "255.255.255.0"
                    }
                ]
            };
            setTimeout(function () {
                router.status = 0;
            }, 100);
            response(200, "success", {
                "routerID": router.routerID
            }, {});
        },

        //更新
        "PUT /goku/rest/v1.5/{vdc_id}/vpc/{vpcid}/routers/{id}?cloud-infras={cloud_infras_id}": function (original, response) {
            var routes = JSON.parse(original.data);
            router.routes = routes.routes;
            response(200, "success", {}, {});

        },

        //查询路由器
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers": function (original, response) {
            var vpcid = original.data.vpcid;
            var orgid = original.data.vdc_id;
            var routers = [];
            router = {
                "routerID": "1000000000000000003",
                "name": "Router_VPC_A01",
                "routerType": 1,
                "status": "READY",
                "routes": [
                    {
                        "nexthop": "192.168.0.10",
                        "destination": "192.168.1.0/24"
                    }
                ]
            };
            if (router) {
                routers.push(router);
            }
            response(200, "success", {"routers": routers}, {});

        },

        //查询外部网络：
        "GET /goku/rest/v1.5/external-networks": function (original, response) {
            "use strict";
            var cloud_infras = original.data["cloud-infras"];
            var start = original.data.start;
            var limit = original.data.limit;
            var vpcid = original.data.vpcid;

            if (!vpcid || !cloud_infras) {
                response(500, "error", result, {});
            }
            response(200, "success", externalNet, {});
        },
        //打开防火墙
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls?cloud-infras={cloud_infras_id}": function(original, response){
            response(205, "success", {"firewallID": "20000"}, {});
        },
        //查询防火墙
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls?cloud-infras={cloud_infras_id}": function(original, response){
            var firewall = {
                "id": "232323232",
                "status" : "READY"
            };
            var firewalls = [];
            firewalls.push(firewall);
            response(200, "success", {"firewalls": firewalls}, {});
        },
        //删除防火前
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewalls/{id}?cloud-infras={cloud_infras_id}": function(original, response){
            response(200, "success", {}, {});
        }
    });

    return fixture;
});