
define(["can/util/fixture/fixture"], function (fixture) {
    var vlanList = {
        "queryVlanPoolResp":{
                "vlanpools":[
                    {
                        "id":"1",
                        "startID":3504,
                        "endID": 3522,
                        "name": "vlan",
                        "description": "描述1",
                        "usage":"",
                        "vxLanFlag":false
                    },{
                        "id":"2",
                        "startID":3503,
                        "endID": 3548,
                        "name": "vlan",
                        "description": "描述2",
                        "usage":"",
                        "vxLanFlag":false
                    },{
                        "id":"3",
                        "startID":3550,
                        "endID": "3550",
                        "name": "vlan",
                        "description": "描述3",
                        "usage":"",
                        "vxLanFlag":false
                    }
                 ],
                "total":11
             }
    }

    var directList =
        {
            "externalNetworks":[{
                "id":1,
                "showDetail":"",
                "name":"实验室安全组1",
                "vlans":["123", "45"],
                "exnetworkID":"2001",
                "subnets": "IPv4:192.168.123.211/24",
                "ipv4Subnet":{
                    "subnetAddr":1,
                    "subnetPrefix":2
                },
                "IPtotal":"12/12",
                "totalBoundNics":"——",
                "connectToInternetFlag":"是"
            },
                {
                    "id":2,
                    "showDetail":"",
                    "name":"实验室安全组2",
                    "vlans":[233, 5654],
                    "exnetworkID":"2002",
                    "subnets": "IPv4:192.168.123.211/24",
                    "ipv4Subnet":{
                        "subnetAddr":1,
                        "subnetPrefix":2
                    },
                    "IPtotal":"——",
                    "totalBoundNics":"12",
                    "connectToInternetFlag":"否"
                }
            ]
        };

    fixture({
        "POST /goku/rest/v1.5/{vdc_id}/vlanpools/action?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success",vlanList, {})
        },
        "GET /goku/rest/v1.5/external-networks?cloud-infras={cloud_infras_id}&start={start}&limit={limit}&vpcid={vpcid}&azid={azid}": function (request, response) {
            response(200, "success",directList, {})
        }
    });

    return fixture;
});