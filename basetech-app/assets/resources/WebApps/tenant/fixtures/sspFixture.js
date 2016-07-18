define(["can/util/fixture/fixture"], function (fixture) {
    //服务目录列表
    var catalogs = [
        {
            id : "1",
            "name": "云基础设施服务",
            "description": "云基础设施目录"
        },{
            id : "2",
            "name": "电信业务",
            "description": "电信目录"
        }
    ];

    var catalogServices = {
        "total": 4,
        services: [{
            id: "1",
            name: "虚拟数据中心",
            description: '提供了与物理数据中心相等体验的专属虚拟化资源池，您可以快速自助完成虚拟数据中心申请，并可根据实际需要在线灵活调整虚拟数据中心规格；在虚拟数据中心内，您可以对计算、存储和网络资源统一管理，就像管理一个真正的数据中心一样管理这些资源。',
            serviceImageUrl: "../theme/default/images/gm/vdcService.jpg",
            applyUrl: "ssp.applyVdc",
            status:"published",
            vdcId: "2"
        }, {
            id: "2",
            name: "云主机",
            description: "提供可靠的、即申请即用的云主机服务，您可以快速自助完成云主机申请，并可根据实际需要在线灵活调整云主机规格、指定操作系统类型和云主机所在网络。",
            serviceImageUrl: "../theme/default/images/gm/vmService.jpg",
            applyUrl: "ssp.applyVm",
            status:"published",
            vdcId: "2"
        },{
            id: "3",
            name: "云存储",
            description: "云存储提供了持久化的、高可用的块存储设备服务，您可以快速自助完成云存储申请，并可根据实际需要在线灵活调整云存储规格、存储SLA。云存储实例可以挂载在运行中的云主机实例上，就结合云主机使用，使您的数据更安全、更具灵活性。",
            serviceImageUrl: "../theme/default/images/gm/diskService.jpg",
            applyUrl: "ssp.applyDisk",
            status:"published",
            vdcId: "2"
        },{
            id: "4",
            name: "IMS应用",
            description: "IMS,英文缩写。IMS(IP Multimedia Subsystem)是IP多媒体子系统,是一种全新的多媒体业务形式,它能够满足现在的终端客户更新颖、更多元化多媒体业务的需求。",
            serviceImageUrl: "../theme/default/images/gm/appService.jpg",
            applyUrl: "ssp.applyApp",
            status:"published",
            vdcId: "2"
        },{
           id: "5",
           name: "物理机",
           description: "当应用不适合部署在虚拟机或者要独占并控制一台物理服务器，可以向管理员申请物理机。物理机服务提供不同型号物理服务器供选择，可以选择给物理服务器预安装操作系统。",
           serviceImageUrl: "../theme/default/images/gm/hostService.jpg",
           applyUrl: "ssp.applyHost",
           status:"published",
           vdcId: "2"
       }]
    };

    var ecsServiceDetail = {
        id: "ecsServiceOffering01",
        name: "云主机",
        description:"提供可靠的、即申请即用的云主机服务，您可以快速自助完成云主机申请，并可根据实际需要在线灵活调整云主机规格、指定操作系统类型和云主机所在网络。",
        status: "PUBLISHED",
        serviceTemplateId: "escTemplateId01",
        serviceImageUrl: "../theme/default/images/gm/vmService.jpg",
        "params": '{\
            "cloudInfra": {\
                "id": "cloudInfra01",\
                "lock": "1"\
            },\
            "availableZone": {\
                "id": "azId01",\
                "lock": "1"\
            },\
            "vmTemplate": {\
                "id": "002",\
                "lock": "1"\
            },\
            "vmSpec": {\
                "flavor": {\
                    "id": "flavorId1",\
                    "lock": "1"\
                },\
                "spec": {\
                    "cpu": {\
                        "value": "1",\
                        "lock": "1"\
                    },\
                    "memory": {\
                        "value": "1024",\
                        "lock": "1"\
                    },\
                    "disk": [\
                        {\
                            "name": "",\
                            "size": "",\
                            "lock": "1"\
                        }\
                    ]\
                },\
                "sla":{\
                    "value": "gold",\
                    "lock": "1"\
                }\
            },\
            "vmNetwork": {\
                "nics": [\
                    {\
                        "networkId": "net001",\
                        "vpcId": "vpc01",\
                        "lock": "1"\
                    }\
                ]\
            }\
        }'
    };

    var appDetail = {
        id: "appServiceOffering01",
        name: "IMS应用",
        description:"IMS,英文缩写。IMS(IP Multimedia Subsystem)是IP多媒体子系统,是一种全新的多媒体业务形式,它能够满足现在的终端客户更新颖、更多元化多媒体业务的需求。",
        status: "PUBLISHED",
        serviceTemplateId: "escTemplateId01",
        serviceImageUrl: "../theme/default/images/gm/vmService.jpg",
        "params": '{"cloudInfraId":"","vpcId":"","picture":"../theme/default/images/gm/appImage/buff01.jpg","templateId":"53dc1121-2795-441f-aef0-580ca6dc0ecc",' +
            '"lock":{"locationLock":"1","vpcLock":"1","networkLock":"1","commonParamsLock":"0","vmLock":"1","appLock":"0","vlbLock":"0"},"parameters":[],' +
            '"appData":"eyJ0ZW1wbGF0ZU5ldCI6eyJkYXRhIjpbeyJuYW1lIjoiTmV0d29ya18xIiwiZGVzY3JpcHRpb24iOiIiLCJuZXR3b3JrSWQiOm51bGwsImFtZUlkIjoiQU1FX2lkXzk1MTAzODU0MCJ9XX0sImNvbmZBcHBWbVRlbXBsYXRlcyI6eyJkYXRhIjpbeyJuYW1lIjoiVm1UZW1wbGF0ZV8yIiwidGVtcGxhdGVJZCI6IiIsInZtVGVtcGxhdGVOYW1lIjoiIiwidm1Pc1R5cGUiOiJOb3ZlbGwgU1VTRSBMaW51eCIsInZtT3NWZXJzaW9uIjoiTm92ZWxsIFNVU0UgTGludXggRW50ZXJwcmlzZSBTZXJ2ZXIgMTEgU1AxIDMyYml0Iiwic3BlY0NwdSI6IiIsInNwZWNSYW0iOiIiLCJzcGVjRGlzayI6W10sImFtZUlkIjoiQU1FX2lkXzk1MTAzODU1MSJ9XX0sImNvbmZBcHBTb2Z0UGFja3MiOnsiZGF0YSI6W119LCJjb25mQXBwU2hlbGxzIjp7ImRhdGEiOltdfSwiY29uZlZsYlZtVGVtcGxhdGVzIjp7ImRhdGEiOltdfSwiY29tbW9uUGFyYW1zIjp7ImRhdGEiOltdfX0=",' +
            '"appType":"it","templateBody":"eyJUZW1wbGF0ZU5hbWUiOiJBRlNERiIsIlRlbXBsYXRlRm9ybWF0VmVyc2lvbiI6IiIsIkRlc2NyaXB0aW9uIjoiIiwiUGFyYW1ldGVycyI6e30sIlJlc291cmNlcyI6eyJBTUVfaWRfNDQxNTQ5NTUyMSI6eyJUeXBlIjoiR006Ok5ldHdvcmsiLCJHcmFwaCI6eyJQYXJlbnRJRCI6IjEiLCJQb3NpdGlvbiI6eyJYIjoiMzMwIiwiWSI6IjEwMCJ9LCJTaXplIjp7IlciOiIxNTAiLCJIIjoiNDAifX0sIlByb3BlcnRpZXMiOnsiTmFtZSI6Ik5ldHdvcmtfMSIsIkRlc2NyaXB0aW9uIjoiIiwiTmV0d29ya0lEIjoiIn19LCJBTUVfaWRfNDQxNTUwMjAyNCI6eyJUeXBlIjoiR006OlZtVGVtcGxhdGUiLCJHcmFwaCI6eyJQYXJlbnRJRCI6IjEiLCJQb3NpdGlvbiI6eyJYIjoiNDAwIiwiWSI6IjI2MCJ9LCJTaXplIjp7IlciOiIxNzAiLCJIIjoiNzAifX0sIlByb3BlcnRpZXMiOnsiVm1UZW1wbGF0ZUlEIjoiIiwiVm1UZW1wYXRlTmFtZSI6IiIsIk5hbWUiOiJWbVRlbXBsYXRlXzIiLCJEZXNjcmlwdGlvbiI6IiIsIkNvbXB1dGVyTmFtZSI6IiIsIkNQVSI6IiIsIk1lbW9yeSI6IiIsIk9TVHlwZSI6Ik5vdmVsbCBTVVNFIExpbnV4IiwiT1NWZXJzaW9uIjoiTm92ZWxsIFNVU0UgTGludXggRW50ZXJwcmlzZSBTZXJ2ZXIgMTEgU1AxIDMyYml0IiwiVXBkYXRlTW9kZSI6ImF1dG8iLCJCbG9ja0hlYXRUcmFuZmVyIjoidW5TdXBwb3J0IiwiTmljcyI6W3siTmFtZSI6IkRlZmF1bHROaWMiLCJOZXR3b3JrSUQiOnsiUmVmIjpbIkFNRV9pZF80NDE1NDk1NTIxIiwiTmV0d29ya0lEIl19LCJTeXN0ZW1EZWZhdWx0IjoidHJ1ZSIsIlZsYiI6ImZhbHNlIn1dLCJWb2x1bWVzIjpbXSwiU29mdHdhcmVzIjpbXSwiUG9zdENvbW1hbmRzIjpbXSwiUmVsZWFzZUNvbW1hbmRzIjpbXSwiU3RhcnRDb21tYW5kcyI6W10sIlN0b3BDb21tYW5kcyI6W119fSwiQU1FX2lkXzk1MTAzOTE0Ijp7IlR5cGUiOiJHTTo6SW5zdGFuY2UiLCJHcmFwaCI6e30sIlByb3BlcnRpZXMiOnsiTmFtZSI6IlZtVGVtcGxhdGVfMiIsIlZtVGVtcGxhdGVJRCI6eyJSZWYiOlsiQU1FX2lkXzQ0MTU1MDIwMjQiLCJQaHlzaWNhbElEIl19LCJEZXNjcmlwdGlvbiI6IiJ9fX0sIk91dHB1dHMiOnt9LCJDb25uZWN0aW9ucyI6W3siSWQiOiJBTUVfaWRfOTUxMDM4NTczIiwiVHlwZSI6IlJlYWxMaW5lIiwiRnJvbSI6IkFNRV9pZF80NDE1NTAyMDI0IiwiVG8iOiJBTUVfaWRfNDQxNTQ5NTUyMSJ9XSwiSWNvbiI6ImJ1ZmYwMS5qcGcifQ=="} '
    };

    var vdcDetail = {
        "id" : "vdc1",
        "name" : "虚拟数据中心",
        "description" : "提供了与物理数据中心相等体验的专属虚拟化资源池，您可以快速自助完成虚拟数据中心申请，并可根据实际需要在线灵活调整虚拟数据中心规格；在虚拟数据中心内，您可以对计算、存储和网络资源统一管理，就像管理一个真正的数据中心一样管理这些资源。",
        "status" : "published",
        "approveType" : "none",
        "serviceTemplateId" : "uuid123456",
        "serviceImageUrl" : "../theme/default/images/gm/vdcService.jpg",
        "params" : '{\
        "cloudInfra" : {\
            "value" : ["id",""],\
            "lock" : "1"  \
        },\
        "CPU" : {\
            "value" : 8,\
            "lock" : "1"  \
        },\
        "MEMORY" : {\
            "value" : 1024,\
            "lock" : "1"\
        },\
        "STORAGE" : {\
            "value" : 1024,\
            "lock" : "1"\
        },\
        "VPC" : {\
            "value" : 23,\
            "lock" : "1"\
        },\
        "EIP" : {\
            "value" : 8,\
            "lock" : "1"\
        },\
        "SET" : {\
            "value" : 2,\
            "lock" : "1"\
        },\
        "VM" : {\
            "value" : 10,\
            "lock" : "1"\
        }\
    }'
    };

    var diskDetail = {
        "id" : "disk1",
        "name" : "云存储",
        "description" : "云存储提供了持久化的、高可用的块存储设备服务，您可以快速自助完成云存储申请，并可根据实际需要在线灵活调整云存储规格、存储SLA。云存储实例可以挂载在运行中的云主机实例上，就结合云主机使用，使您的数据更安全、更具灵活性。",
        "status" : "published",
        "approveType" : "none",
        "serviceTemplateId" : "uuid123456",
        "serviceImageUrl" : "../theme/default/images/gm/diskService.jpg",
        "params" : '{\
        "cloudInfra" : {\
            "id" : "cloudInfra01",\
            "lock" : "1"  \
        },\
        "availableZone" : {\
            "id" : "az001",\
            "lock" : "1"\
        },\
        "vpc" : {\
            "id" : "vpc001",\
            "lock" : "1"\
        },\
        "capacity" : {\
            "value" : 20,\
            "lock" : "1"\
        },\
        "type" : {\
            "value" : "normal",\
            "lock" : "1"\
        },\
        "mediaType" : {\
            "value" : "SAN-Any",\
            "lock" : "1"\
        }\
    }'
    };

    var hostDetail = {
        "id" : "host1",
        "name" : "物理机",
        "description" : "当应用不适合部署在虚拟机或者要独占并控制一台物理服务器，可以向管理员申请物理机。物理机服务提供不同型号物理服务器供选择，可以选择给物理服务器预安装操作系统。",
        "status" : "published",
        "approveType" : "none",
        "serviceTemplateId" : "uuid123456",
        "serviceImageUrl" : "../theme/default/images/gm/hostService.jpg",
        "params" : '{\
        "cloudInfra" : {\
            "id" : "cloudInfra01",\
            "lock" : "1"  \
        },\
        "availableZone" : {\
            "id" : "az001",\
            "lock" : "1"\
        },\
        "model" : {\
            "value" : "Huawei Telco RH2288V2",\
            "lock" : "1"\
        },\
        "os" : {\
            "value" : "RedHat Linux Enterprise 6.2.1",\
            "lock" : "1"\
        }\
    }'
    };

    var applyEcsOrderDetail = {
        "params" : '{\
            "cloudInfraId": "cloudInfra01",\
            "templateId": "002",\
            "availableZoneId": "az02",\
            "availableZoneName": "深圳AZ02",\
            "vpcId": "002",\
            "count": 1,\
            "name": "aaa",\
            "vmSpec": {\
                "id": "",\
                "cpu": {"count": "12"},\
                "memory": {"count": "20480"},\
                "templateVols": [],\
                "userVols": [{"size": "20"}],\
                "nics": [{"networkID": "network02", "networkViewName": "网络001 (路由网络 / 192.168.201.0 / fe80:2aac:2100:a4ff:fee3:9566:300c:0)", "networkType": "private"},\
                         {"networkID": "network03", "networkViewName": "网络002 (内部网络 / 192.168.201.0)", "networkType": "private"}]\
            },\
            "vmUniqueInfo": [{\
                "customNic": [{\
                    "ip": "192.168.201.21",\
                    "ips6": []\
                },{\
                    "ip": "",\
                    "ips6": ["fe80:2aac:2100:a4ff:fee3:9566:300c:3262"]\
                }]\
            }],\
            "tags":[{"name": "SLA", "value": "SILVER"}]\
        }'
    };

    var changeEcsOrderDetail = {
        "params" : '{\
            "cloudInfraId": "cloudInfra01",\
            "vpcId": "002",\
            "vmSpecId": "flavorId2",\
            "oldVmSpecId": "flavorId2",\
            "cpu": {"count": "12", "oldCount": "2"},\
            "memory": {"count": "2048", "oldCount": "1024"},\
            "vmId": "vmId01"\
        }'
    };

    var deleteInstanceOrderDetail = {
        params: '{\
        "serviceInstance":{\
            "name":"云主机",\
            "createTime":"2014-01-12 10:12:00",\
            "expireTime":"2014-11-12 10:12",\
            "vdcId":"vdc01",\
            "applyUserId":"zhangsan",\
            "resources":[{\
                "resourceId":"4629700416936869889$urn:sites:4F150976:vms:i-000000BB",\
                "resourceName":"虚拟机01",\
                "resourceType":"vm"\
            },{\
                "resourceId":"4629700416936869889$urn:sites:4F150976:volumes:733",\
                "resourceName":"磁盘01",\
                "resourceType":"disk"\
            }]\
        }\
    }'
    };

    var extendInstanceOrderDetail = {
        params: '{\
        "serviceInstance":{\
            "name":"云主机",\
            "createTime":"2014-01-12 10:12:00",\
            "expireTime":"2014-11-12 10:12"\
        }\
    }'
    };

    var applyDiskOrderDetail = {
        "params" : '{\
            "cloudInfraId": "cloudInfra02",\
            "vpcId": "012",\
            "availableZoneId": "az02",\
            "vmId": "vmId01",\
            "vmName": "vmName01",\
            "count": "2",\
            "size": "70",\
            "name": "diskName01",\
            "type": "share",\
            "mediaType": "SAN-Any"\
        }'
    };

    var changeDiskOrderDetail = {
        "params" : '{\
            "cloudInfraId": "cloudInfra02",\
            "vpcId": "012",\
            "availableZoneId": "az02",\
            "size": "120",\
            "oldSize": "20",\
            "volumeId": "01"\
        }'
    };

    var applyAppOrderDetail = {
        "params" : '{' +
            '"appData":"eyJ0ZW1wbGF0ZU5ldCI6eyJkYXRhIjpbeyJuYW1lIjoiTmV0d29ya18xIiwiZGVzY3JpcHRpb24iOiIiLCJuZXR3b3JrSWQiOiIzMDAwMDAwMDAwMiIsImFtZUlkIjoiQU1FX2lkXzk1MTAzODU0MCIsIm5ldHdvcmtWYWx1ZXMiOlt7InNlbGVjdElkIjoiMzAwMDAwMDAwMDIiLCJsYWJlbCI6InNzc3MiLCJjaGVja2VkIjp0cnVlfV0sIm5ldHdvcmtOYW1lIjoic3NzcyIsInZwY05hbWUiOiJ2cGMwMSJ9XX0sImNvbmZBcHBWbVRlbXBsYXRlcyI6eyJkYXRhIjpbeyJuYW1lIjoiVm1UZW1wbGF0ZV8yIiwidGVtcGxhdGVJZCI6IjM7dXJuOnNpdGVzOjM0QjAwNjUwOnZtczppLTAwMDAwMkUzOzQ2Mjk3MDA0MTY5MzY4Njk4ODkiLCJ2bVRlbXBsYXRlTmFtZSI6IiIsInZtT3NUeXBlIjoiTm92ZWxsIFNVU0UgTGludXgiLCJ2bU9zVmVyc2lvbiI6Ik5vdmVsbCBTVVNFIExpbnV4IEVudGVycHJpc2UgU2VydmVyIDExIFNQMSAzMmJpdCIsInNwZWNDcHUiOiIiLCJzcGVjUmFtIjoiIiwic3BlY0Rpc2siOltdLCJzcGVjVmFsdWVzIjpbeyJzZWxlY3RJZCI6IjIwMDY4MTFkNDhiYjEyZTEwMTQ4YmMxNjU5NjIwMDAxIiwibGFiZWwiOiIxIHwgNTEyTSB8IDMwRyIsImRldGFpbFNwZWMiOiJDUFU6IDF2Q1BVOyDlhoXlrZg6IDUxMk1COyDno4Hnm5gwOiAxMEdCOyDno4Hnm5gxOiAxMEdCOyDno4Hnm5gyOiAxMEdCIiwiY3B1Q291bnQiOjEsIm1lbVNpemUiOjUxMiwiZGlza3MiOlt7ImluZGV4IjowLCJkaXNrU2l6ZSI6MTAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjEsImRpc2tTaXplIjoxMCwibWVkaWEiOiJTQU4tQW55In0seyJpbmRleCI6MiwiZGlza1NpemUiOjEwLCJtZWRpYSI6IlNBTi1BbnkifV0sImNoZWNrZWQiOnRydWV9LHsic2VsZWN0SWQiOiIyMDA2ODExZDQ4YmIxMmUxMDE0OGJiMTMyYmVjMDAwMCIsImxhYmVsIjoiMSB8IDUxMk0gfCAxRyIsImRldGFpbFNwZWMiOiJDUFU6IDF2Q1BVOyDlhoXlrZg6IDUxMk1COyDno4Hnm5gwOiAxR0IiLCJjcHVDb3VudCI6MSwibWVtU2l6ZSI6NTEyLCJkaXNrcyI6W3siaW5kZXgiOjAsImRpc2tTaXplIjoxLCJtZWRpYSI6IlNBTi1BbnkifV0sImNoZWNrZWQiOmZhbHNlfSx7InNlbGVjdElkIjoiM2ZlNDJjZGM0NTYzMTYxMTAxNDU2MzFmNTIyODAwMDIiLCJsYWJlbCI6IjggfCA4MTkyTSB8IDIwMEciLCJkZXRhaWxTcGVjIjoiQ1BVOiA4dkNQVTsg5YaF5a2YOiA4MTkyTUI7IOejgeebmDU6IDIwR0I7IOejgeebmDY6IDIwR0I7IOejgeebmDc6IDIwR0I7IOejgeebmDg6IDIwR0I7IOejgeebmDk6IDIwR0I7IOejgeebmDEwOiAyMEdCOyDno4Hnm5gxMTogMjBHQjsg56OB55uYMTI6IDIwR0I7IOejgeebmDEzOiAyMEdCOyDno4Hnm5gxNDogMjBHQiIsImNwdUNvdW50Ijo4LCJtZW1TaXplIjo4MTkyLCJkaXNrcyI6W3siaW5kZXgiOjUsImRpc2tTaXplIjoyMCwibWVkaWEiOiJTQU4tQW55In0seyJpbmRleCI6NiwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4Ijo3LCJkaXNrU2l6ZSI6MjAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjgsImRpc2tTaXplIjoyMCwibWVkaWEiOiJTQU4tQW55In0seyJpbmRleCI6OSwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxMCwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxMSwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxMiwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxMywiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxNCwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifV0sImNoZWNrZWQiOmZhbHNlfSx7InNlbGVjdElkIjoiM2ZlNDJjZGM0NTYzMTYxMTAxNDU2MzFmNTIyODAwMDEiLCJsYWJlbCI6IjQgfCA4MTkyTSB8IDEwMEciLCJkZXRhaWxTcGVjIjoiQ1BVOiA0dkNQVTsg5YaF5a2YOiA4MTkyTUI7IOejgeebmDA6IDIwR0I7IOejgeebmDE6IDIwR0I7IOejgeebmDI6IDIwR0I7IOejgeebmDM6IDIwR0I7IOejgeebmDQ6IDIwR0IiLCJjcHVDb3VudCI6NCwibWVtU2l6ZSI6ODE5MiwiZGlza3MiOlt7ImluZGV4IjowLCJkaXNrU2l6ZSI6MjAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjEsImRpc2tTaXplIjoyMCwibWVkaWEiOiJTQU4tQW55In0seyJpbmRleCI6MiwiZGlza1NpemUiOjIwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjozLCJkaXNrU2l6ZSI6MjAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjQsImRpc2tTaXplIjoyMCwibWVkaWEiOiJTQU4tQW55In1dLCJjaGVja2VkIjpmYWxzZX0seyJzZWxlY3RJZCI6IjNmZTQyY2RjNDU2MzE2MTEwMTQ1NjMxZjUyMjgwMDAwIiwibGFiZWwiOiIyIHwgNDA5Nk0gfCA0MEciLCJkZXRhaWxTcGVjIjoiQ1BVOiAydkNQVTsg5YaF5a2YOiA0MDk2TUI7IOejgeebmDE1OiAyMEdCOyDno4Hnm5gxNjogMjBHQiIsImNwdUNvdW50IjoyLCJtZW1TaXplIjo0MDk2LCJkaXNrcyI6W3siaW5kZXgiOjE1LCJkaXNrU2l6ZSI6MjAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjE2LCJkaXNrU2l6ZSI6MjAsIm1lZGlhIjoiU0FOLUFueSJ9XSwiY2hlY2tlZCI6ZmFsc2V9XSwic3BlYyI6IjIwMDY4MTFkNDhiYjEyZTEwMTQ4YmMxNjU5NjIwMDAxIiwic3BlY0RldGFpbCI6IkNQVTogMXZDUFU7IOWGheWtmDogNTEyTUI7IOejgeebmDA6IDEwR0I7IOejgeebmDE6IDEwR0I7IOejgeebmDI6IDEwR0IiLCJzZWxTcGVjQ3B1IjoxLCJzZWxTcGVjUmFtIjo1MTIsInNlbFNwZWNEaXNrIjpbeyJpbmRleCI6MCwiZGlza1NpemUiOjEwLCJtZWRpYSI6IlNBTi1BbnkifSx7ImluZGV4IjoxLCJkaXNrU2l6ZSI6MTAsIm1lZGlhIjoiU0FOLUFueSJ9LHsiaW5kZXgiOjIsImRpc2tTaXplIjoxMCwibWVkaWEiOiJTQU4tQW55In1dLCJ0ZW1wbGF0ZVZhbHVlcyI6W3sic2VsZWN0SWQiOiIzO3VybjpzaXRlczozNEIwMDY1MDp2bXM6aS0wMDAwMDJFMzs0NjI5NzAwNDE2OTM2ODY5ODg5IiwibGFiZWwiOiJMaW51eF9UZW1wbGF0ZSIsImNoZWNrZWQiOnRydWV9LHsic2VsZWN0SWQiOiI0O3VybjpzaXRlczozNEIwMDY1MDp2bXM6aS0wMDAwMDI5Mzs0NjI5NzAwNDE2OTM2ODY5ODg5IiwibGFiZWwiOiJWbVRlbXBsYXRlX1NVU0UxMSIsImNoZWNrZWQiOmZhbHNlfSx7InNlbGVjdElkIjoiMTt1cm46c2l0ZXM6MzRCMDA2NTA6dm1zOmktMDAwMDAyRjY7NDYyOTcwMDQxNjkzNjg2OTg4OSIsImxhYmVsIjoiVm1UZW1wbGF0ZV82IiwiY2hlY2tlZCI6ZmFsc2V9XSwidGVtcGxhdGVOYW1lIjoiTGludXhfVGVtcGxhdGUiLCJzaG93RGV0YWlsIjp0cnVlfV19LCJjb25mQXBwU29mdFBhY2tzIjp7ImRhdGEiOltdfSwiY29uZkFwcFNoZWxscyI6eyJkYXRhIjpbXX0sImNvbmZWbGJWbVRlbXBsYXRlcyI6eyJkYXRhIjpbXX0sImNvbW1vblBhcmFtcyI6eyJkYXRhIjpbXX19",' +
            '"cloudInfraId":"cloudInfra01",' +
            '"vpcId":"001",' +
            '"appName":"IMS应用实例",' +
            '"desc":"",' +
            '"picture":"../theme/default/images/gm/appService.jpg",' +
            '"templateId":"d9c01356-bc98-44cf-8167-e41f20d57660",' +
            '"templateBody":"eyJUZW1wbGF0ZU5hbWUiOiJBRlNERiIsIlRlbXBsYXRlRm9ybWF0VmVyc2lvbiI6IiIsIkRlc2NyaXB0aW9uIjoiIiwiUGFyYW1ldGVycyI6e30sIlJlc291cmNlcyI6eyJBTUVfaWRfOTUxMDM4NTQwIjp7IlR5cGUiOiJHTTo6TmV0d29yayIsIkdyYXBoIjp7IlBhcmVudElEIjoiMSIsIlBvc2l0aW9uIjp7IlgiOiIzMzAiLCJZIjoiMTAwIn0sIlNpemUiOnsiVyI6IjE1MCIsIkgiOiI0MCJ9fSwiUHJvcGVydGllcyI6eyJOYW1lIjoic3NzcyIsIkRlc2NyaXB0aW9uIjoiIiwiTmV0d29ya0lEIjoiMzAwMDAwMDAwMDIifX0sIkFNRV9pZF85NTEwMzg1NTEiOnsiVHlwZSI6IkdNOjpWbVRlbXBsYXRlIiwiR3JhcGgiOnsiUGFyZW50SUQiOiIxIiwiUG9zaXRpb24iOnsiWCI6IjQwMCIsIlkiOiIyNjAifSwiU2l6ZSI6eyJXIjoiMTcwIiwiSCI6IjcwIn19LCJQcm9wZXJ0aWVzIjp7IlZtVGVtcGxhdGVJRCI6IjM7dXJuOnNpdGVzOjM0QjAwNjUwOnZtczppLTAwMDAwMkUzOzQ2Mjk3MDA0MTY5MzY4Njk4ODkiLCJWbVRlbXBhdGVOYW1lIjoiTGludXhfVGVtcGxhdGUiLCJOYW1lIjoiVm1UZW1wbGF0ZV8yIiwiRGVzY3JpcHRpb24iOiIiLCJDb21wdXRlck5hbWUiOiIiLCJDUFUiOjEsIk1lbW9yeSI6NTEyLCJPU1R5cGUiOiJOb3ZlbGwgU1VTRSBMaW51eCIsIk9TVmVyc2lvbiI6Ik5vdmVsbCBTVVNFIExpbnV4IEVudGVycHJpc2UgU2VydmVyIDExIFNQMSAzMmJpdCIsIlVwZGF0ZU1vZGUiOiJhdXRvIiwiQmxvY2tIZWF0VHJhbmZlciI6InVuU3VwcG9ydCIsIk5pY3MiOlt7Ik5hbWUiOiJEZWZhdWx0TmljIiwiTmV0d29ya0lEIjp7IlJlZiI6WyJBTUVfaWRfOTUxMDM4NTQwIiwiTmV0d29ya0lEIl19LCJTeXN0ZW1EZWZhdWx0IjoidHJ1ZSIsIlZsYiI6ImZhbHNlIn1dLCJWb2x1bWVzIjpbeyJOYW1lIjowLCJBbGxvY1R5cGUiOiJ0aGljayIsIkFmZmVjdEJ5U25hcHNob3QiOiJmYWxzZSIsIk1lZGlhVHlwZSI6IlNBTi1BbnkiLCJTeXN0ZW1EZWZhdWx0IjoidHJ1ZSIsIlNpemUiOjEwfSx7Ik5hbWUiOjEsIkFsbG9jVHlwZSI6InRoaWNrIiwiQWZmZWN0QnlTbmFwc2hvdCI6ImZhbHNlIiwiTWVkaWFUeXBlIjoiU0FOLUFueSIsIlN5c3RlbURlZmF1bHQiOiJmYWxzZSIsIlNpemUiOjEwfSx7Ik5hbWUiOjIsIkFsbG9jVHlwZSI6InRoaWNrIiwiQWZmZWN0QnlTbmFwc2hvdCI6ImZhbHNlIiwiTWVkaWFUeXBlIjoiU0FOLUFueSIsIlN5c3RlbURlZmF1bHQiOiJmYWxzZSIsIlNpemUiOjEwfV0sIlNvZnR3YXJlcyI6W10sIlBvc3RDb21tYW5kcyI6W10sIlJlbGVhc2VDb21tYW5kcyI6W10sIlN0YXJ0Q29tbWFuZHMiOltdLCJTdG9wQ29tbWFuZHMiOltdfX0sIkFNRV9pZF85NTEwMzkxNCI6eyJUeXBlIjoiR006Okluc3RhbmNlIiwiR3JhcGgiOnt9LCJQcm9wZXJ0aWVzIjp7Ik5hbWUiOiJWbVRlbXBsYXRlXzIiLCJWbVRlbXBsYXRlSUQiOnsiUmVmIjpbIkFNRV9pZF85NTEwMzg1NTEiLCJQaHlzaWNhbElEIl19LCJEZXNjcmlwdGlvbiI6IiJ9fX0sIk91dHB1dHMiOnt9LCJDb25uZWN0aW9ucyI6W3siSWQiOiJBTUVfaWRfOTUxMDM4NTczIiwiVHlwZSI6IlJlYWxMaW5lIiwiRnJvbSI6IkFNRV9pZF85NTEwMzg1NTEiLCJUbyI6IkFNRV9pZF85NTEwMzg1NDAifV0sIkljb24iOiJidWZmMDEuanBnIn0=",' +
            '"parameters":[{"value":"aaa"},{"value":"bbb"}]' +
            '}'
    };

    var applyHostOrderDetail = {
        "params" : '{\
            "cloudInfraId": "cloudInfra01",\
            "cloudInfraName": "shenzhen",\
            "availableZoneId": "az02",\
            "availableZoneName": "AZ02",\
            "count": "1",\
            "model": "Huawei Telco RH2288V2",\
            "os": "Redhat Linux 6.2"\
        }'
    };

   //我的服务
    var myServices = [
        {
            "id": "d6bb27f9-972c-4aab-b585-4289aa0fda11",
            "serviceOfferingId": "2",
            "name": "云主机",
            "applyTime": "2014-08-12 10:12",
            "createTime": "2014-08-12 10:12",
            "expireTime": "2014-08-12 10:12",
            "applyUserId": "applyUserId01",
            "applyUserName": "applyUser1",
            "vdcId": "vdc01",
            "status": "normal"
        },
        {
            "id": "d6bb27f9-972c-4aab-b585-4289aa0fda12",
            "serviceOfferingId": "3",
            "name": "云存储",
            "applyTime": "2014-01-12 10:12",
            "createTime": "2014-01-12 10:12",
            "expireTime": "2014-01-12 10:12",
            "applyUserId": "applyUserId02",
            "applyUserName": "applyUser2",
            "vdcId": "vdc02",
            "status": "expired"
        },
        {
            "id": "d6bb27f9-972c-4aab-b585-4289aa0fda13",
            "serviceOfferingId": "1",
            "name": "虚拟数据中心",
            "applyTime": "2014-01-12 10:12",
            "createTime": "2014-01-12 10:12",
            "expireTime": "2014-01-12 10:12",
            "applyUserId": "applyUserId03",
            "applyUserName": "applyUser3",
            "vdcId": "vdc03",
            "status": "providing"
        },
        {
            "id": "d6bb27f9-972c-4aab-b585-4289aa0fda14",
            "serviceOfferingId": "4",
            "name": "IMS应用",
            "applyTime": "2014-01-12 10:12",
            "createTime": "2014-01-12 10:12",
            "expireTime": "2014-01-12 10:12",
            "applyUserId": "applyUserId03",
            "applyUserName": "applyUser3",
            "vdcId": "vdc04",
            "status": "normal"
        }
    ];

    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/catalogs": function (original, response) {
            var ret = {
                total: 2,
                "catalogs": catalogs
            };
            response(200, "success", ret, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/services": function (original, response) {
            var catalogId = original.data["catalog-id"];
            var name = original.data.inputSearch;
            var limit = parseInt(original.data.limit, 10);
            var start = parseInt(original.data.start, 10);
            var ret = {
                services : []
            };

            var services = [];
            if (catalogId === "1") {
                services = catalogServices.services.slice(0, 3);
            } else if (catalogId === "2") {
                services = catalogServices.services.slice(3, 4);
            } else {
                services = catalogServices.services;
            }

            if(name && $.trim(name)){
                _.each(services, function(item, index){
                    if(item.name.indexOf(name) >= 0) {
                        ret.services.push(item);
                    }
                });
            } else {
                ret.services = services;
            }

            ret.total = ret.services.length;
            response(200, "success", ret, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/services/{id}/action": function(original, response) {
            response(200, "success", {}, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-templates" : function(original, response) {
            var ret = {
                total : 1,
                templates : [{
                    id : "applyApp",
                    name : "app_term_applyAppInstance_button",
                    type : "apply",
                    description : "自定义应用示例",
                    templateUrl : "ssp.createApp",
                    applyUrl : "",
                    approvalUrl : "",
                    imageUrl : "theme/default/images/gm/appService.jpg",
                    "approveType": {"noApprove": true, "vdcApprove": true, "domainApprove": false, "vdcDomainApprove": false}
                }]
            };
            response(200, "success",ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/services/{id}": function(original, response) {
            var ret;
            if (original.data.id == 2){
                ret = ecsServiceDetail;
            }
            else if (original.data.id == 1) {
                ret = vdcDetail;
            } else if (original.data.id == 3) {
                ret = diskDetail;
            } else if (original.data.id == 4) {
                ret = appDetail;
            } else if (original.data.id == 5) {
                ret = hostDetail;
            }
            response(200, "success", ret, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/services/{id}": function(original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/services": function(original, response) {
            response(200, "success", {}, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-icons": function(original, response) {
            var ret = {
                serviceiconlist: [
                    {
                        id: "default-service-vm-icon",
                        imageUrl: "../theme/default/images/gm/appImage/buff01.jpg",
                        type: "default",
                        vdcId: "1"
                    },{
                        id: "default-service-vdc-icon",
                        imageUrl: "../theme/default/images/gm/appImage/buff02.jpg",
                        type: "default",
                        vdcId: "1"
                    }
                ]
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/orders/{order_id}": function (original, response) {
            var ret = {
                "orderId"  : "order1",
                "type" : "apply",
                "userName" : "admin",
                "userId" : "admin",
                "vdcId" : "vdc1",
                "status" : "approving",
                "submitTime" : "2013-12-01",
                "lastHandleTime" : "2013-12-11",
                "serviceOffingId" : "1",
                "applyUrl" : "",
                "approveUrl": "",
                "tenancy": "2014-12-11 18:22",
                "comments": "新员工开户申请",
                "params": '{"vdcName":"VDC1","allQuota":true,"quotaList":[{"name":"CPU","limit":100},{"name":"MEMORY","limit":1024},{"name":"STORAGE","limit":1024},{"name":"VPC","limit":23},{"name":"EIP","limit":8},{"name":"SEG","limit":2},{"name":"VM","limit":10}]}',
                "definationParams": vdcDetail.params,
                "orderName": vdcDetail.name,
                "description": vdcDetail.description,
                "imageUrl": vdcDetail.serviceImageUrl,
                "history": [
                    {
                        "handleUserName": "zhangsan",
                        "time": "2014-05-19 10:00",
                        "comments": "",
                        "action": "submit"
                    },{
                        "handleUserName": "zhangsan",
                        "time": "2014-05-20 11:00",
                        "comments": "同意申请",
                        "action": "approved"
                    },{
                        "handleUserName": "zhangsan",
                        "time": "2014-05-21 12:00",
                        "comments": "",
                        "errorCode": "1002373",
                        "zhMessage": "存储资源不足",
                        "enMessage": "storage is not available",
                        "action": "succeed"
                    }
                ],
                "orderApprovers": [
                    {
                        serviceApprovalUsrId: null,
                        serviceApprovalUsrName: "system"
                    }
                ]
            };
            if (original.data.order_id == "orderApplyVM"){
                ret.params = applyEcsOrderDetail.params;
                ret.definationParams = ecsServiceDetail.params;
                ret.orderName = ecsServiceDetail.name;
                ret.description = ecsServiceDetail.description;
                ret.imageUrl = ecsServiceDetail.serviceImageUrl;
            } else if (original.data.order_id == "orderChangeVM"){
                ret.params = changeEcsOrderDetail.params;
            } else if (original.data.order_id == "orderDeleteVM"){
                ret.params = deleteInstanceOrderDetail.params;
            } else if (original.data.order_id == "orderExtendVM"){
                ret.params = extendInstanceOrderDetail.params;
            } else if (original.data.order_id == "orderApplyDisk"){
                ret.params = applyDiskOrderDetail.params;
                ret.definationParams = diskDetail.params;
                ret.orderName = diskDetail.name;
                ret.description = diskDetail.description;
                ret.imageUrl = diskDetail.serviceImageUrl;
            } else if (original.data.order_id == "orderChangeDisk"){
                ret.params = changeDiskOrderDetail.params;
            } else if (original.data.order_id == "orderApplyApp"){
                ret.params = applyAppOrderDetail.params;
                ret.definationParams = appDetail.params;
                ret.orderName = appDetail.name;
                ret.description = appDetail.description;
                ret.imageUrl = appDetail.serviceImageUrl;
            } else if (original.data.order_id == "orderApplyHost"){
                ret.params = applyHostOrderDetail.params;
                ret.definationParams = hostDetail.params;
                ret.orderName = hostDetail.name;
                ret.description = hostDetail.description;
                ret.imageUrl = hostDetail.serviceImageUrl;
            }
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/orders" : function (original, response) {
            var ret = {
                "orders" : [
                    {
                        "orderId": "orderApplyVDC",
                        "type": "apply",
                        "userName": "张三",
                        "userId": "123456",
                        "orderName": "虚拟数据中心",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 1,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalVdcApply",
                        "applyUrl": "ssp.applyVdc",
                        "imageUrl": "../theme/default/images/gm/vdcService.jpg"
                    },
                    {
                        "orderId": "orderChangeVDC",
                        "type": "modify",
                        "userName": "张三",
                        "userId": "123456",
                        "orderName": "虚拟数据中心",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 1,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalVdcChange",
                        "applyUrl": "ssp.applyVdc",
                        "imageUrl": "../theme/default/images/gm/vdcService.jpg"
                    },
                    {
                        "orderId": "orderApplyVM",
                        "type": "apply",
                        "userName": "李四",
                        "userId": "654321",
                        "orderName": "云主机",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 2,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalVmApply",
                        "applyUrl": "ssp.applyVm",
                        "imageUrl": "../theme/default/images/gm/vmService.jpg"
                    },
                    {
                        "orderId": "orderChangeVM",
                        "type": "modify",
                        "userName": "李四",
                        "userId": "654321",
                        "orderName": "云主机",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 2,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalVmChange",
                        "applyUrl": "ssp.changeVm",
                        "imageUrl": "../theme/default/images/gm/vmService.jpg"
                    },{
                        "orderId": "orderExtendVM",
                        "type": "extend",
                        "userName": "张三",
                        "userId": "654321",
                        "orderName": "云主机",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 2,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalInstanceExtend",
                        "applyUrl": "ssp.applyInstanceExtend",
                        "imageUrl": "../theme/default/images/gm/vmService.jpg"
                    },
                    {
                        "orderId": "orderApplyDisk",
                        "type": "apply",
                        "userName": "李四",
                        "userId": "654321",
                        "orderName": "云存储",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 3,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalDiskApply",
                        "applyUrl": "ssp.applyDisk",
                        "imageUrl": "../theme/default/images/gm/diskService.jpg"
                    },
                    {
                        "orderId": "orderChangeDisk",
                        "type": "modify",
                        "userName": "李四",
                        "userId": "654321",
                        "orderName": "云存储",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 3,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalDiskChange",
                        "applyUrl": "ssp.changeDisk",
                        "imageUrl": "../theme/default/images/gm/diskService.jpg"
                    },
                    {
                        "orderId": "orderApplyApp",
                        "type": "apply",
                        "userName": "张三",
                        "userId": "654321",
                        "orderName": "IMS应用",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 4,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalAppApply",
                        "applyUrl": "ssp.applyApp",
                        "imageUrl": "../theme/default/images/gm/appService.jpg"
                    },
                    {
                        "orderId": "orderApplyHost",
                        "type": "apply",
                        "userName": "张三",
                        "userId": "654321",
                        "orderName": "物理机",
                        "vdcId": "vdc_id0",
                        "status": original.data["handle-user-id"] ? "approving" : "initialize",
                        "serviceOffingId": 5,
                        "submitTime": "2014-01-12 10:12",
                        "lastHandleTime": "2014-01-12 10:12",
                        "serviceInstanceId": "service_instance_id",
                        "approveUrl": "ssp.approvalHostApply",
                        "applyUrl": "ssp.applyHost",
                        "imageUrl": "../theme/default/images/gm/hostService.jpg"
                    }
                ]
            };

            if (!original.data["handle-user-id"]) {
                ret.orders.splice(5, 0, {
                    "orderId": "orderDeleteVM",
                    "type": "release",
                    "userName": "李四",
                    "userId": "654321",
                    "orderName": "云主机",
                    "vdcId": "vdc_id0",
                    "status": "processing",
                    "serviceOffingId": 2,
                    "submitTime": "2014-01-12 10:12",
                    "lastHandleTime": "2014-01-12 10:12",
                    "serviceInstanceId": "service_instance_id",
                    "approveUrl": "ssp.viewInstanceRelease",
                    "applyUrl": "",
                    "imageUrl": "../theme/default/images/gm/vmService.jpg"
                });
            }

            ret.total = ret.orders.length;
            response (200, "success", ret, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/orders" : function (original, response) {
            var ret = {};
            response (200, "success", ret, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/orders/{id}/action" : function (original, response) {
            response (200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/orders/{id}/admin-action" : function (original, response) {
            response (200, "success", {}, {});
        },

        "PUT /goku/rest/v1.5/{vdc_id}/orders/{id}" : function (original, response) {
            response (200, "success", {}, {});
        },

        "PUT /goku/rest/v1.5/{vdc_id}/catalogs/{id}" : function (original, response) {
            var ret = {};
            response (200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/vms": function (original, response) {
            var limit = parseInt(original.data.limit, 10);
            var start = parseInt(original.data.start, 10);
            var vms = [];

            for (var i = start; i < start + limit; i++) {
                var vm = {
                    id: "VM-" + i,
                    name: "虚拟机-" + i,
                    status: "运行中",
                    config: "512MB 内存| 1 虚拟内核 | 1.0GB 盘",
                    location: "深圳"
                };
                vms.push(vm);
            }

            var ret = {
                "total" : 50,
                "vms": vms
            };
            response(200, "success", ret, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-instances": function (original, response) {
            var limit = parseInt(original.data.limit, 10);
            var start = parseInt(original.data.start, 10);
            var ret = {
                total: 4,
                serviceInstances : myServices
            };
            response(200, "success", ret, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-instances/{id}": function(original, response) {
            var id = original.data.id;
            var resources = [];

            if (id === "d6bb27f9-972c-4aab-b585-4289aa0fda11") {
                resources.push ({
                    "resourceId" : "vmId01",
                    "resourceName" : "vm01",
                    "resourceUrl" : "ecs.vm",
                    "resourceType": "vm",
                    "modifyUrl": "ssp.changeVm",
                    "metadata": {
                        "cloudInfraId": "cloudInfra01",
                        "vpcId": "vpcId01"
                    }
                });
            } else if (id === "d6bb27f9-972c-4aab-b585-4289aa0fda12") {
                resources.push ({
                    "resourceId" : "01",
                    "resourceName" : "disk01",
                    "resourceUrl" : "ecs.storage.disk",
                    "resourceType": "disk",
                    "modifyUrl": "ssp.changeDisk",
                    "metadata": {
                        "cloudInfraId": "cloudInfra01",
                        "vpcId": "vpcId01"
                    }
                });
            } else if (id === "d6bb27f9-972c-4aab-b585-4289aa0fda13") {
                resources.push ({
                    "resourceId" : "vdcId01",
                    "resourceName" : "vdc01",
                    "resourceUrl" : "",
                    "modifyUrl": "ssp.changeVdc",
                    "resourceType": "vdc",
                    "metadata": {
                        "cloudInfraId": "cloudInfra01",
                        "vpcId": "vpcId01"
                    }
                });
            } else if (id === "d6bb27f9-972c-4aab-b585-4289aa0fda14") {
                resources.push ({
                    "resourceId" : "appId01",
                    "resourceName" : "app01",
                    "resourceUrl" : "application.manager.instance",
                    "resourceType": "app",
                    "modifyUrl": "",
                    "metadata": {
                        "cloudInfraId": "cloudInfra01",
                        "vpcId": "vpcId01"
                    }
                });
            }

            var ret = {
                "id" : "service1",
                "name" : "win7_4u4g",
                "createTime" : "2014-08-12 18:12:00",
                "resources" : resources
            };
            response(200, "success", ret, {});
        },

        "PUT /goku/rest/v1.5/{vdc_id}/service-instances/{id}": function(original, response) {
            response(200, "success", {}, {});
        },

        "GET /uportal/service/catalog/catalogs/{id}": function (original, response) {
            var catalogId = original.data.id;
            var catalogDetail = null;
            for (var i = 0; i < myServices.length; i++) {
                if (myServices[i].catalogId === catalogId) {
                    catalogDetail = myServices[i];
                    break;
                }
            }
            response(200, "success", catalogDetail, {})
        }
    });

    return fixture;
});