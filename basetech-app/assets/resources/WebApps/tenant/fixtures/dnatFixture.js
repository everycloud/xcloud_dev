define(["can/util/fixture/fixture"], function (fixture) {

    var dnatConfig = {
        "lifeTime": -1
    };
    var ipDnatList = [
        {
            "showDetail": "",
            "name": "001",
            "id": "1",
            "ip": "192.168.0.1",
            "mac": "aaaaaa"
        },
        {
            "showDetail": "",
            "name": "001",
            "id": "1",
            "ip": "192.168.0.1",
            "mac": "aaaaaa"
        },
        {
            "showDetail": "",
            "name": "001",
            "id": "1",
            "ip": "192.168.0.1",
            "mac": "aaaaaa"
        }
    ];

     var vmDnatList = {
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
            "endTime": "2014-05-26 14:03:11",
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
            "endTime": "2014-05-26 18:26:23",
            "status": 'READY',
            "protocol": "TCP",
            "vpcID": "4792750811720057110",
            "vpcName": "unsharedVPC_B01"
        }],
        "total": 2
    };
    fixture({
        "GET /uportal/network/ipDnatList": function (original, response) {
            response(200, "success", ipDnatList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function (original, response) {
            response(200, "success", vmDnatList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/dnats/action?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", dnatConfig, {});
        },
        "GET /goku/rest/v1.5/{vdcId}/vpcs/{vpcId}/routers": function (original, response) {
            var vpcid = original.data.vpcid;
            var orgid = original.data.vdc_id;
            var routers = [];
           var  router = {
                "routerID": "router1",
                "name": "路由器1",
                "routerType": 2,
                "status": 1,
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
        }
    });

    return fixture;
});
