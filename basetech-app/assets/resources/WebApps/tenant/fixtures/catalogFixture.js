define(["can/util/fixture/fixture",
    "tiny-lib/underscore"
], function (fixture, _) {
    var choiseTemplates = [
        {   "vmtID": "001",
            "vmtName": "Cloud Hosting",
            "type":1,
            "description": "Can be developed based on various types of Cloud Hosting Cloud Hosting templates for business",
            "icon": "../theme/default/images/cloudImg.png"
        },
        {   "vmtID": "002",
            "vmtName": "Memory block",
            "type":2,
            "description": "Can be developed based on various types of Cloud Hosting Cloud Hosting templates for business",
            "icon": "../theme/default/images/cloudImg2.png"
        },
        {   "vmtID": "003",
            "vmtName": "Physical machine",
            "type":3,
            "description": "Can be developed based on various types of Cloud Hosting Cloud Hosting templates for business",
            "icon": "../theme/default/images/cloudImg3.png"
        },
        {   "id": "004",
            "name": "Applications",
            "type":"apply",
            "templateUrl" : "ssp.appCreateByTemplate.navigate",
            "description": "Can be developed based on various types of Cloud Hosting Cloud Hosting templates for business",
            "icon": "../theme/default/images/cloudImg4.png"
        },
        {   "vmtID": "005",
            "vmtName": "VDC",
            "type":5,
            "description": "Can be developed based on various types of Cloud Hosting Cloud Hosting templates for business",
            "icon": "../theme/default/images/cloudImg5.png"
        }
    ];
    //虚拟机规格模板
    var configTemplates = [
        {
            "flavorId": "flavorId1",
            "name": "m1.tiny",
            "desc": "tiny Specifications",
            cpuCount: 1,
            memSize: 1024,
            disks: [
                {
                    index: 0,
                    diskSize: 20
                }
            ],
            slaLabels: [],
            qos: {},
            systemDiskSize: 10
        },
        {
            "flavorId": "flavorId2",
            "name": "m1.medium",
            "desc": "m1.medium Specifications",
            cpuCount: 2,
            memSize: 2048,
            disks: [
                {
                    index: 0,
                    diskSize: 20
                }, {
                    index: 1,
                    diskSize: 20
                }
            ],
            slaLabels: [],
            qos: {},
            systemDiskSize: 20
        },
        {
            "flavorId": "flavorId3",
            "name": "m1.large",
            "desc": "m1.large Specifications",
            cpuCount: 4,
            memSize: 4096,
            disks: [
                {
                    index: 0,
                    diskSize: 20
                }, {
                    index: 1,
                    diskSize: 20
                }, {
                    index: 2,
                    diskSize: 20
                }
            ],
            slaLabels: [],
            qos: {},
            systemDiskSize: 30
        }
    ];
    var slas = [
        {
            id: "1",
            name: "ShenZhen"
        },{
            id: "2",
            name: "BeiJing"
        },{
            id: "3",
            name: "Shanghai"
        }
    ];

    var orgInfo = {
        orgInfo: {
            allQuota: false,
            quotaInfo: [
                {
                    quotaName: "CPU",
                    limit: 100
                }
            ],
            quotaUsage: [
                {
                    quotaName: "CPU",
                    value: 10
                }
            ]
        }
    };
    //cpu内核数
    var cpuCount = [
        {"id":"1","name":"1 Kernel"},
        {"id":"2","name":"2 Kernel"},
        {"id":"3","name":"4 Kernel"},
        {"id":"4","name":"8 Kernel"},
        {"id":"5","name":"Custom"}
    ];
    //内存
    var memoryCount = [
        {"id":"1","name":"2G"},
        {"id":"2","name":"4G"},
        {"id":"3","name":"8G"},
        {"id":"4","name":"10G"},
        {"id":"5","name":"Custom"}
    ];
    //存储
    var storageCount = [
        {"id":"1","name":"500G"},
        {"id":"2","name":"1T"},
        {"id":"3","name":"2T"},
        {"id":"4","name":"4T"},
        {"id":"5","name":"Custom"}
    ];
    //虚拟机
    var vmCount = [
        {"id":"1","name":"10"},
        {"id":"2","name":"50"},
        {"id":"3","name":"100"},
        {"id":"4","name":"200"},
        {"id":"5","name":"Custom"}
    ];
    //弹性IP数
    var ipCount = [
        {"id":"1","name":"1"},
        {"id":"2","name":"2"},
        {"id":"3","name":"4"},
        {"id":"4","name":"8"},
        {"id":"5","name":"Custom"}
    ];
    //vpc个数
    var vpcCount = [
        {"id":"1","name":"1"},
        {"id":"2","name":"2"},
        {"id":"3","name":"4"},
        {"id":"4","name":"8"},
        {"id":"5","name":"Custom"}
    ];
    //安全组个数
    var serCount = [
        {"id":"1","name":"1"},
        {"id":"2","name":"2"},
        {"id":"3","name":"4"},
        {"id":"4","name":"8"},
        {"id":"5","name":"Custom"}
    ];
    //查询网络
    var networkInfo = {
        networks: [
            {
                networkID: "network01",
                azID: "az01",
                name: "NetWork 001",
                description: "Network Description",
                networkType: 3,
                vlan: 2,
                ipv4Subnet: {
                    subnetAddr: "192.168.201.0",
                    subnetPrefix: "255.255.255.0",
                    gateway: "192.168.201.1",
                    dhcpOption: {
                        domainName: "domain01",
                        primaryDNS: "192.168.201.11",
                        secondaryDNS: "192.168.201.12",
                        primaryWINS: "192.168.201.13",
                        secondaryWINS: "192.168.201.14"
                    }
                },
                ipv6Subnet: {
                    subnetAddr: "fe80:2aac:2100:a4ff:fee3:9566:300c:0",
                    subnetPrefix: "24",
                    gateway: "fe80:2aac:2100:a4ff:fee3:9566:300c:3261",
                    dhcpOption: {
                        domainName: "domain02",
                        primaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3262",
                        secondaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3263",
                        primaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3264",
                        secondaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3265"
                    }
                },
                totalBoundNics: 5,
                azName: "ShenZhen 01"
            },
            {
                networkID: "network02",
                azID: "az02",
                name: "NetWork002",
                networkType: 2,
                vlan: 3,
                ipv4Subnet: {
                    subnetAddr: "192.168.201.0",
                    subnetPrefix: "255.255.255.0"
                },
                ipv6Subnet: {},
                totalBoundNics: 2,
                azName: "ShenZhen02"
            },{
                networkID: "network03",
                azID: "az03",
                name: "NetWork003",
                networkType: 1,
                vlan: 4,
                ipv4Subnet: {
                    subnetAddr: "192.168.201.0",
                    subnetPrefix: "255.255.255.0"
                },
                ipv6Subnet: {subnetAddr: "fe80:2aac:2100:a4ff:fee3:9566:300c:326b"},
                totalBoundNics: 4,
                azName: "ShenZhen03"
            }
        ]
    };
    //查询VDC
    var orgData = {
        "vdcList": [
            {
                "id": "1",
                "orgName": "DefaultSharedORG",
                "memberCount": 10,
                "createTime": "2014-1-17",
                "orgDesc": "default organization",
                "operation": ""
            },
            {
                "id": "2",
                "orgName": "DefaultVPCORG",
                "memberCount": 15,
                "createTime": "2014-1-17",
                "orgDesc": "default organization",
                "operation": ""
            },
            {
                "id": "3",
                "orgName": "org1",
                "memberCount": 15,
                "createTime": "2014-1-17",
                "orgDesc": "org1 organization",
                "operation": ""
            }
        ]
    };
    fixture({

        //查询虚拟机模板
        "GET /goku/rest/v1.5/{vdc_id}/choiseTemplates": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "choiseTemplates": choiseTemplates,
                "totalNum": 46
            };
            response(200, "success", ret, {});
        },
        //查询区域
        "GET /uportal/ecs/vm/slas": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "slas": slas
            };
            response(200, "success", ret, {});
        },
        // 查询申请时长
        "GET /goku/rest/v1.5/vdcs/{id}": function (original, response) {
            response(200, "success", orgInfo, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates/{id}": function (original, response) {
            var vmt = {
                "name": "Windows Server desktop",
                osOption: {
                    "osType": "Windows",
                    "osVersion": "Windows Server 2008 R2 Datacenter 64bit"
                },
                diskdetail: [{
                    quantityGB: 20
                }]
            };
            response(200, "success", vmt, {});
        },
        //查询cpu内核数
        "GET /goku/rest/v1.5/{vdc_id}/cpus": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "cpus": cpuCount
            };
            response(200, "success", ret, {});
        },
        //查询内存
        "GET /goku/rest/v1.5/{vdc_id}/memorys": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "memorys": memoryCount
            };
            response(200, "success", ret, {});
        },
        //查询存储
        "GET /goku/rest/v1.5/{vdc_id}/storages": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "storages": storageCount
            };
            response(200, "success", ret, {});
        },
        //查询虚拟机台数
        "GET /goku/rest/v1.5/{vdc_id}/vmCounts": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "vmCounts": vmCount
            };
            response(200, "success", ret, {});
        },
        //查询弹性IP数
        "GET /goku/rest/v1.5/{vdc_id}/ipCounts": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "ipCounts": ipCount
            };
            response(200, "success", ret, {});
        },
        //查询vpc个数
        "GET /goku/rest/v1.5/{vdc_id}/vpcCounts": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "vpcCounts": vpcCount
            };
            response(200, "success", ret, {});
        },
        //查询安全组个数
        "GET /goku/rest/v1.5/{vdc_id}/serCounts": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "serCounts": serCount
            };
            response(200, "success", ret, {});
        },
        //查询规格模板
        "GET /goku/rest/v1.5/{vdc_id}/vm-flavors": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                total: 3,
                vmFlavors: configTemplates
            };
            response(200, "success", ret, {});
        },
        //查询基础网络列表
        "GET /uportal/ecs/vm/basicNetworks": function (original, response) {
            response(200, "success", networkInfo, {});
            return true;
        },
        //查询VDC列表
        "GET /goku/rest/v1.5/vdcs": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                total: 3,
                vdcs: orgData
            };
            response(200, "success", ret, {});
        },
        //删除指定VDC
        "DELETE /goku/rest/v1.5/vdcs/{id}": function(original, response){
            var id = original.data.id;
            var result = {};
            for(var idx in orgData.vdcList)
            {
                if(orgData.vdcList[idx] && orgData.vdcList[idx].id === id) {
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
            }
            response(200, "success", result, {});
        }
    });

    return fixture;
});