define(function () {
    var json = {
        "Resources": {
            "AME_id_41181371": {
                "Id": "718213f4-5c59-49f7-ab08-f41eac21e6f9",
                "Name": "Demo_VPC_Direct_Network_371",
                "Type": "GM::Network",
                "NetworkId": "30000004",
                "Description": "",
                "VlanId": 901,
                "NetworkType": "EXTERNAL",
                "DhcpServerType": 3,
                "SubnetIp": "192.168.89.0",
                "SubnetMask": "255.255.255.0",
                "SubnetGateway": "192.168.89.1",
                "DhcpIsolation": false,
                "IpMacBind": false
            },
            "AME_id_4118134951": {
                "Id": "41c8e64a-a2ec-4135-a542-5aa371bd8d9b",
                "Name": "Demo_VPC_Direct_Network_951",
                "Type": "GM::Network",
                "Description": "",
                "VlanId": 901,
                "NetworkType": "EXTERNAL",
                "DhcpServerType": 3,
                "SubnetIp": "192.168.89.0",
                "SubnetMask": "255.255.255.0",
                "SubnetGateway": "192.168.89.1",
                "DhcpIsolation": false,
                "IpMacBind": false
            },
            "AME_id_41181690": {
                "Name": "appTemplate_690",
                "Description": null,
                "Status": "running",
                "Id": "31",
                "Type": "GM::Instance",
                "Ip": "192.168.89.6;192.168.89.7",
                "Mac": "28:6e:d4:88:c7:79;28:6e:d4:88:c7:7a",
                "CreateTime": "2014-05-05 18:28:00 UTC+08:00",
                "InitPw": "4Pqh3qvG",
                "OsType": "Linux",
                "Softwares": []
            },
            "AME_id_41181691": {
                "Name": "appTemplate_691",
                "Description": null,
                "Status": "running",
                "Id": "31",
                "Type": "GM::Instance",
                "Ip": "192.168.89.6;192.168.89.7",
                "Mac": "28:6e:d4:88:c7:79;28:6e:d4:88:c7:7a",
                "CreateTime": "2014-05-05 18:28:00 UTC+08:00",
                "InitPw": "4Pqh3qvG",
                "OsType": "Linux",
                "Softwares": []
            },
            "AME_id_41181692": {
                "Name": "appTemplate_692",
                "Description": null,
                "Status": "running",
                "Id": "31",
                "Type": "GM::Instance",
                "Ip": "192.168.89.6;192.168.89.7",
                "Mac": "28:6e:d4:88:c7:79;28:6e:d4:88:c7:7a",
                "CreateTime": "2014-05-05 18:28:00 UTC+08:00",
                "InitPw": "4Pqh3qvG",
                "OsType": "Linux",
                "Softwares": []
            },
            "AME_id_4118131115": {
                "Id": "553dbcd0-fc70-44e9-b79e-7483b0fc76a7",
                "Name": "DefaultScalingGroup_115",
                "Type": "GM::ScalingGroup",
                "Description": "",
                "Nics": [
                    {
                        "Name": "DefaultNic",
                        "NetworkUUID": "718213f4-5c59-49f7-ab08-f41eac21e6f9",
                        "NetworkId": "30000004",
                        "SystemDefault": "true",
                        "Vlb": "false",
                        "VlbId": ""
                    }
                ]
            },
            "AME_id_4118131116": {
                "Id": "553dbcd0-fc70-44e9-b79e-7483b0fc76a7",
                "Name": "DefaultScalingGroup_116",
                "Type": "GM::ScalingGroup",
                "Description": "",
                "Nics": [
                    {
                        "Name": "DefaultNic",
                        "NetworkUUID": "718213f4-5c59-49f7-ab08-f41eac21e6f9",
                        "NetworkId": "30000004",
                        "SystemDefault": "true",
                        "Vlb": "false",
                        "VlbId": ""
                    }
                ]
            },
            "AME_id_1111111111": {
                "Id": "xxxxxx",
                "Name": "VLB_111",
                "Type": "GM::Vlb",
                "VIP": "192.168.1.10",
                "FrontNetworkId": "xxx",
                "FrontNetworkName": "xxx",
                "BackEndNetworkId": "xxx",
                "BackEndNetworkName": "xxx",
                "Protocols": [
                    {
                        "FrontProtocol": "HTTP",
                        "FrontPort": "8080",
                        "BackEndProtocol": "HTTP",
                        "BackEndPort": "80"
                    }
                ]
            }
        },
        "Connections": [
            {
                "Id": "AME_id_139936094805720818660",
                "Type": "RealLine",
                "From": "AME_id_4118131115",
                "To": "AME_id_41181371"
            },
            {
                "Id": "AME_id_13993609480571957533091",
                "Type": "RealLine",
                "From": "AME_id_4118131115",
                "To": "AME_id_41181690"
            },
            {
                "Id": "AME_id_13993609480571957533091",
                "Type": "RealLine",
                "From": "AME_id_4118131116",
                "To": "AME_id_41181691"
            },
            {
                "Id": "AME_id_13993609480571957533091",
                "Type": "RealLine",
                "From": "AME_id_4118131116",
                "To": "AME_id_41181692"
            },
            {
                "Id": "AME_id_13993609480571721554262",
                "Type": "RealLine",
                "From": "AME_id_4118131116",
                "To": "AME_id_4118134951"
            },
            {
                "Id": "AME_id_13993609480832019569165",
                "Type": "RealLine",
                "From": "AME_id_1111111111",
                "To": "AME_id_4118131116"
            },
            {
                "Id": "AME_id_13993609480832019569166",
                "Type": "RealLine",
                "From": "AME_id_1111111111",
                "To": "AME_id_4118131115"
            }
        ]
    };
    return json;
});