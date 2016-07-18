define(['jquery', "can/util/fixture/fixture", "tiny-lib/underscore"], function ($, fixture, _) {
    "use strict";

    var oneProcessMonitor = {
        "metrics":[{
            "metricData":{
                "metricName": "cpu",
                "metricId": "001",
                "resourceId": "resourceId001",
                "metricUnit": "%",
                "dataPoints":[{
                    "timestamp": 1403049600000,
                    "value": "-1"
                },
                    {
                        "timestamp": 1403136000000,
                        "value": "1"
                    },
                    {
                        "timestamp": 1403222400000,
                        "value": "1.045"
                    },
                    {
                        "timestamp": 1403308800000,
                        "value": "1.03"
                    }]
            }
        },
            {
                "metricData":{
                    "metricName": "mem",
                    "metricId": "002",
                    "resourceId": "resourceId002",
                    "metricUnit": "%",
                    "dataPoints":[{
                        "timestamp": 1403049600000,
                        "value": "2"
                    },
                        {
                            "timestamp": 1403136000000,
                            "value": "5"
                        },
                        {
                            "timestamp": 1403222400000,
                            "value": "5.045"
                        },
                        {
                            "timestamp": 1403308800000,
                            "value": "2.03"
                        }]
                }
            }]
    };

    var appResourceMonitor = {
        "historyInspectData": [
            {
                "unit": null,
                "metricName": "nic_byte_out",
                "metricValue": [
                    {
                        "time": "1403049600000",
                        "value": null
                    },
                    {
                        "time": "1403136000000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403222400000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403308800000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403395200000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403481600000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403568000000",
                        "value": "0.0"
                    }
                ]
            },
            {
                "unit": null,
                "metricName": "nic_byte_in",
                "metricValue": [
                    {
                        "time": "1403049600000",
                        "value": null
                    },
                    {
                        "time": "1403136000000",
                        "value": "0.05"
                    },
                    {
                        "time": "1403222400000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403308800000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403395200000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403481600000",
                        "value": "0.0"
                    },
                    {
                        "time": "1403568000000",
                        "value": "0.0"
                    }
                ]
            },
            {
                "unit": null,
                "metricName": "mem_usage",
                "metricValue": [
                ]
            },
            {
                "unit": null,
                "metricName": "cpu_usage",
                "metricValue": [
                    {
                        "time": "1403049600000",
                        "value": null
                    },
                    {
                        "time": "1403136000000",
                        "value": "-3"
                    },
                    {
                        "time": "1403222400000",
                        "value": "1.045"
                    },
                    {
                        "time": "1403308800000",
                        "value": "1.03"
                    },
                    {
                        "time": "1403395200000",
                        "value": "1.065"
                    },
                    {
                        "time": "1403481600000",
                        "value": "-1"
                    },
                    {
                        "time": "1403568000000",
                        "value": "1.05"
                    }
                ]
            },
            {
                "unit": null,
                "metricName": "disk_io_in",
                "metricValue": [
                    {
                        "time": "1403049600000",
                        "value":  null
                    },
                    {
                        "time": "1403136000000",
                        "value": null
                    },
                    {
                        "time": "1403222400000",
                        "value": null
                    },
                    {
                        "time": "1403308800000",
                        "value": "2"
                    },
                    {
                        "time": "1403395200000",
                        "value": null
                    },
                    {
                        "time": "1403481600000",
                        "value": null
                    },
                    {
                        "time": "1403568000000",
                        "value": null
                    }
                ]
            },
            {
                "unit": null,
                "metricName": "disk_io_out",
                "metricValue": [
                    {
                        "time": "1403049600000",
                        "value": null
                    },
                    {
                        "time": "1403136000000",
                        "value": null
                    },
                    {
                        "time": "1403222400000",
                        "value": null
                    },
                    {
                        "time": "1403308800000",
                        "value": "32"
                    },
                    {
                        "time": "1403395200000",
                        "value": null
                    },
                    {
                        "time": "1403481600000",
                        "value":null
                    },
                    {
                        "time": "1403568000000",
                        "value": null
                    }
                ]
            }
        ],
        "instantInspectData": {
            "disk_io_in": [
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "8.0",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                },
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                }
            ],
            "cpu_usage": [
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                },
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.80",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                }
            ],
            "nic_byte_out": [
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                },
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.80",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                }
            ],
            "disk_io_out": [
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                },
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.80",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                }
            ],
            "nic_byte_in": [
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                },
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.80",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                }
            ],
            "mem_usage": [
                {
                    "name": "DB229",
                    "rid": "230",
                    "visibleId": "i-00000070",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.80",
                        "cpu_usage": "0.00",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.06"
                    }
                },
                {
                    "name": "Web231",
                    "rid": "232",
                    "visibleId": "i-00000071",
                    "status": "running",
                    "inspectInfo": {
                        "disk_io_in": "0.40",
                        "cpu_usage": "1.90",
                        "nic_byte_out": "0.00",
                        "disk_io_out": "0.00",
                        "nic_byte_in": "0.01",
                        "mem_usage": "23.04"
                    }
                }
            ]
        }
    };



    var appLogs = {
        "total": 12,
        "appLogs": [{
            "appLogIndex": "394",
            "appObjects": [],
            "detail": {},
            "failReason": {},
            "operationTime": "2014-06-19 16:49:54",
            "operationType": "MODIFY_SCALINGGROUP",
            "operationUpdateTime": "2014-06-19 16:55:57",
            "status": "SUCCESS",
            "userId": "zmt"
        },
            {
                "appLogIndex": "395",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "396",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "397",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "398",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "399",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "400",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "401",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "402",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "403",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "404",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            },
            {
                "appLogIndex": "405",
                "appObjects": [],
                "detail": {},
                "failReason": {},
                "operationTime": "2014-06-19 16:49:54",
                "operationType": "MODIFY_SCALINGGROUP",
                "operationUpdateTime": "2014-06-19 16:55:57",
                "status": "SUCCESS",
                "userId": "zmt"
            }]
    };
    var osTypeMapping = {
        "mapping": {
            "CentOS": "Linux",
            "CentOS 6.0 64bit": "CentOS",
            "Redhat Linux Enterprise 6.1 32bit": "Redhat Linux",
            "Redhat Linux Enterprise 6.1 64bit": "Redhat Linux",
            "Novell SUSE Linux": "Linux",
            "Ubuntu": "Linux",
            "Ubuntu 10.04 server 64bit": "Ubuntu",
            "Ubuntu 10.04.1 server 64bit": "Ubuntu",
            "Ubuntu 10.04.2 server 64bit": "Ubuntu",
            "Ubuntu 10.04.3 server 64bit": "Ubuntu",
            "Ubuntu 11.10 server 32bit": "Ubuntu",
            "Ubuntu 11.10 server 64bit": "Ubuntu",
            "Ubuntu 12.04 desktop 64bit": "Ubuntu",
            "Ubuntu 12.04.1 desktop 64bit": "Ubuntu",
            "Ubuntu 12.04.1 server 64bit": "Ubuntu",
            "Windows 7": "Windows",
            "Windows 7 32bit": "Windows 7",
            "Windows 7 64bit": "Windows 7"
        }
    };
    var availableVm4Custom = {
        "list": {
            "total": 11,
            "vms": [{
                availableZoneId: "4616189618054758404",
                availableZoneName: "AZ",
                cloudInfraId: null,
                createTime: "2014-05-26 17:14:39",
                creatorId: "3",
                domainId: "",
                domainName: null,
                id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B3",
                name: "CustomAppVM001",
                vdcId: "34",
                osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                status: "running",
                tag: "",
                type: "fusioncompute",
                visiableId: "i-000000B3"
            },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B32",
                    name: "CustomAppVM0012",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },{
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B33",
                    name: "CustomAppVM0013",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B34",
                    name: "CustomAppVM0014",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B35",
                    name: "CustomAppVM0015",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B36",
                    name: "CustomAppVM0016",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B37",
                    name: "CustomAppVM0017",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B38",
                    name: "CustomAppVM0018",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B39",
                    name: "CustomAppVM0019",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B310",
                    name: "CustomAppVM00110",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                },
                {
                    availableZoneId: "4616189618054758404",
                    availableZoneName: "AZ",
                    cloudInfraId: null,
                    createTime: "2014-05-26 17:14:39",
                    creatorId: "3",
                    domainId: "",
                    domainName: null,
                    id: "4629700416936869889$urn:sites:34D7077E:vms:i-000000B311",
                    name: "CustomAppVM00111",
                    vdcId: "34",
                    osVersion: "Novell SUSE Linux Enterprise Server 10 SP1 64bit",
                    status: "running",
                    tag: "",
                    type: "fusioncompute",
                    visiableId: "i-000000B3"
                }]
        }
    };
    var processList4Monitor = {
        "softwareResources":  [
            {
                "softwareId": "process001",
                "softwareName": "Apache Tomcat 7.0"
            },{
                "softwareId": "process002",
                "softwareName": "office 2007"
            },{
                "softwareId": "process003",
                "softwareName": "Sql server 2007"}
        ]
    };
    var appVmList4Monitor = {
        "vmResources":  [
            {
                "vmId": "vm001",
                "vmName": "vm-zhangsan"
            },{
                "vmId": "vm002",
                "vmName": "vm-lisi"
            },{
                "vmId": "vm003",
                "vmName": "vm-wangwu"
            }]
    };
    var appVmList = {
        vmInfoList: [
            {
                "id": "4616189618054758401",
                "name": "vm_1",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.6",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758402",
                "name": "vm_2",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.7",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758403",
                "name": "vm_3",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.8",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758404",
                "name": "vm_4",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.9",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758405",
                "name": "vm_5",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.12",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758406",
                "name": "vm_6",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.13",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758407",
                "name": "vm_7",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.14",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758408",
                "name": "vm_8",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.15",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "4616189618054758409",
                "name": "vm_19",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.7",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "46161896180547584010",
                "name": "vm_10",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.21",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            },
            {
                "id": "46161896180547584011",
                "name": "vm_11",
                "vmVisibleId": "i-0000078A",
                "ip": "192.168.2.23",
                "status": "running",
                "hostName": "CNA01",
                "clusterName": "ManagementCluster",
                "cpuUsageRate": 50,
                "memUsageRate": 50,
                "diskUsageRate": 50,
                "description": "this is from fixture"
            }
        ],
        "total": 11
    };
    var imagesICT = {
        "vmtemplates": [{
            "vmtID": "image001",
            "vmtName": "IMAGE001",
            "osType": "Linux",
            "osVersion": "suse 11",
            "description": "hello world,image"
        },
            {
                "vmtID": "image003",
                "vmtName": "IMAGE003",
                "osType": "Windows",
                "osVersion": "xp 11",
                "description": "hello world,37hg"
            }]
    };
    var networkListICT = {
        "networks":[
            {

                "name": "Internal 1 zone Network",
                "status": "Normal",
                "networkType": "Internal Network",
                "subnets": "IPv4:192.168.123.211/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "opt": "",

                "id": "network-001",
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "ipv4Subnet":{
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                }
            }
        ]
    };

    var azByVpc = {
        "code": "",
        "message": "",
        "vpcs": [
            {
                "vpcID": "4792750811720056833",
                "availableZone": [
                    {
                        "id": "4616189618054758401",
                        "name": "az"
                    },
                    {
                        "id": "4616189618054758402",
                        "name": "aafz"
                    }
                ],
                "tenantID": "2",
                "name": "vvv",
                "description": "fsa",
                "vpcSpecTemplate": {
                    "vpcSpecTemplateID": null,
                    "name": null,
                    "maxDirectNetworkNum": 200,
                    "maxRoutedNetworkNum": 200,
                    "maxInternalNetworkNum": 200,
                    "maxPublicIpNum": 200,
                    "maxNetworkBandWidth": 4000,
                    "maxRxThroughput": 50,
                    "maxTxThroughput": 50,
                    "priority": 2
                },
                "shared": false
            },
            {
                "vpcID": "4792750811720056832",
                "availableZone": [
                    {
                        "id": "4616189618054758401",
                        "name": "az"
                    }
                ],
                "tenantID": "2",
                "name": "pan",
                "description": null,
                "vpcSpecTemplate": {
                    "vpcSpecTemplateID": null,
                    "name": null,
                    "maxDirectNetworkNum": 200,
                    "maxRoutedNetworkNum": 200,
                    "maxInternalNetworkNum": 200,
                    "maxPublicIpNum": 200,
                    "maxNetworkBandWidth": 4000,
                    "maxRxThroughput": 50,
                    "maxTxThroughput": 50,
                    "priority": 2
                },
                "shared": false
            }
        ],
        "total": 2
    };
    var exportResponse = {
        "exportTaskId": "1245",
        "exportedFilePath": "c705eb8f-a51c-469f-8c2e-d3d2b9175c12/Complex-2014-04-20-105059.tar.gz"
    };
    var availableVlb = {
        "lbInfos": [{
            "lbID": "vlb002",
            "lbName": "vlbName002",
            "lbIp": "192.168.3.4",
            "status": "READY"
        },
            {
                "lbID": "vlb001",
                "lbName": "vlbName001",
                "lbIp": "192.168.3.5",
                "status": "READY"
            }],
        "total": 2
    };
    var scriptListInfo = {
        "scriptInfos": [
            {
                "id": "script001",
                "name": "startAll.sh",
                "osType": "Linux",
                "version": "1",
                "installCommand": "sh startAll.sh ${ip = 192.168.5.6} ${iQ}"
            },
            {
                "id": "script002",
                "name": "startTomcat.sh",
                "osType": "Linux",
                "version": "1",
                "installCommand": "sh startTomcat.sh"
            },
            {
                "id": "script003",
                "name": "startFFLalfjafjfjlafj.sh",
                "osType": "Linux",
                "version": "1",
                "installCommand": "sh startFFLalfjafjfjlafj.sh ${ip}"
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    var serviceTemplateContent = {
        "name": "sTemplate-001",
        "resourcePic": "buff02.jpg",
        "resPoolType": 0,
        "vdcId": 1,
        "desc": "this is description",
        "body": "eyJUZW1wbGF0ZU5hbWUiOiJNeUFwcFRlbXBsYXRlIiwiVGVtcGxhdGVGb3JtYXRWZXJzaW9uIjoiMS4wIiwiRGVzY3JpcHRpb24iOiIiLCJQYXJhbWV0ZXJzIjp7ImNvbW1vbklwIjp7IkRlZmF1bHQiOiIxOTIuMTY4LjcuOSIsIkRlc2NyaXB0aW9uIjoibXlGaXJzdCBjb21vbiJ9LCJEQlVzZXJuYW1lIjp7IkRlZmF1bHQiOiJhZG1pbiIsIk5vRWNobyI6InRydWUiLCJEZXNjcmlwdGlvbiI6IlRoZSBXb3JkUHJlc3MgZGF0YWJhc2UgYWRtaW4gYWNjb3VudCB1c2VybmFtZSIsIlR5cGUiOiJTdHJpbmciLCJNaW5MZW5ndGgiOiIxIiwiTWF4TGVuZ3RoIjoiMTYiLCJBbGxvd2VkUGF0dGVybiI6IlthLXpBLVpdW2EtekEtWjAtOV0qIiwiQ29uc3RyYWludERlc2NyaXB0aW9uIjoibXVzdCBiZWdpbiB3aXRoIGEgbGV0dGVyIGFuZCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuIn19LCJSZXNvdXJjZXMiOnsiQU1FX2lkXzI1MTU0NzM1MSI6eyJOYW1lIjoiRGVmYXVsdE5ldHdvcmtfMSIsIlR5cGUiOiJHTTo6TmV0d29yayIsIkdyYXBoIjp7IlBvc2l0aW9uIjp7IlgiOiIyODAiLCJZIjoiNjAifSwiU2l6ZSI6eyJXIjoiMTUwIiwiSCI6IjQwIn19LCJQcm9wZXJ0aWVzIjp7Ik5hbWUiOiJEZWZhdWx0TmV0d29ya18xIiwiRGVzY3JpcHRpb24iOiJTeXN0ZW0gZGVmYXVsdCBuZXR3b3JrIHJlc291cmNlIiwiTmV0d29ya0lEIjoiIn19LCJBTUVfaWRfMjUxNTQ3MzcyIjp7Ik5hbWUiOiJEZWZhdWx0TmV0d29ya18yIiwiVHlwZSI6IkdNOjpOZXR3b3JrIiwiR3JhcGgiOnsiUG9zaXRpb24iOnsiWCI6IjUyMCIsIlkiOiI2MCJ9LCJTaXplIjp7IlciOiIxNTAiLCJIIjoiNDAifX0sIlByb3BlcnRpZXMiOnsiTmFtZSI6IkRlZmF1bHROZXR3b3JrXzIiLCJEZXNjcmlwdGlvbiI6IlN5c3RlbSBkZWZhdWx0IG5ldHdvcmsgcmVzb3VyY2UiLCJOZXR3b3JrSUQiOiIifX0sIkFNRV9pZF8yNTE1NDc0MjYiOnsiTmFtZSI6IkFBIiwiVHlwZSI6IkdNOjpWbVRlbXBsYXRlIiwiR3JhcGgiOnsiUG9zaXRpb24iOnsiWCI6IjI3MCIsIlkiOiIxOTAifSwiU2l6ZSI6eyJXIjoiMTcwIiwiSCI6IjkwIn19LCJQcm9wZXJ0aWVzIjp7IlZtVGVtcGxhdGVJRCI6IiIsIlZtVGVtcGF0ZU5hbWUiOiJ2bSIsIk5hbWUiOiJhIiwiRGVzY3JpcHRpb24iOiIiLCJDb21wdXRlck5hbWUiOiIiLCJDUFUiOiIiLCJNZW1vcnkiOiIiLCJPU1R5cGUiOiJVYnVudHUiLCJPU1ZlcnNpb24iOiJXaW5kb3dzIFhQIFByb2Zlc3Npb25hbCAzMmJpdCIsIlVwZGF0ZU1vZGUiOiJhdXRvIiwiQmxvY2tIZWF0VHJhbmZlciI6InVuU3VwcG9ydCIsIk5pY3MiOlt7Ik5hbWUiOiJ3d3ciLCJOZXR3b3JrSUQiOnsiUmVmIjpbIkFNRV9pZF8yNTE1NDczNzIiLCJOZXR3b3JrSUQiXX0sIlN5c3RlbURlZmF1bHQiOiIiLCJWbGIiOiJmYWxzZSJ9LHsiTmFtZSI6IkRlZmF1bHROaWMiLCJOZXR3b3JrSUQiOnsiUmVmIjpbIkFNRV9pZF8yNTE1NDczNTEiLCJOZXR3b3JrSUQiXX0sIlN5c3RlbURlZmF1bHQiOiJ0cnVlIiwiVmxiIjoiZmFsc2UifV0sIlZvbHVtZXMiOltdLCJTb2Z0d2FyZXMiOlt7IklkIjoiQU1FX2lkXzI1MTU0ODE1ODAiLCJUeXBlIjoiU29mdHdhcmUiLCJOYW1lIjoid2luIiwiUGFja2FnZUlEIjoiIiwiRGVzY3JpcHRpb24iOiJhYWEiLCJWZXJzaW9uIjoiZGQiLCJPU1R5cGUiOiJVYnVudHUiLCJQYWNrYWdlVHlwZSI6IiIsIlByb3ZpZGVyIjoiIiwiU3ViRmlsZVBhdGgiOiIiLCJEZXN0aW5hdGlvblBhdGgiOiIiLCJJbnN0YWxsQ29tbWFuZHMiOiIiLCJVbmluc3RhbGxDb21tYW5kcyI6IiIsIlN0YXJ0Q29tbWFuZHMiOiIiLCJTdG9wQ29tbWFuZHMiOiIiLCJJbnN0YWxsUGFyYW1zIjpbW11dLCJVbmluc3RhbGxQYXJhbXMiOltbXV0sIlN0YXJ0UGFyYW1zIjpbW11dLCJTdG9wUGFyYW1zIjpbW11dfV0sIlBvc3RDb21tYW5kcyI6W10sIlJlbGVhc2VDb21tYW5kcyI6W10sIlN0YXJ0Q29tbWFuZHMiOltdLCJTdG9wQ29tbWFuZHMiOltdfX0sIkFNRV9pZF8yNTE1NDc0OTI5Ijp7Ik5hbWUiOiJCQiIsIlR5cGUiOiJHTTo6Vm1UZW1wbGF0ZSIsIkdyYXBoIjp7IlBvc2l0aW9uIjp7IlgiOiI1MTAiLCJZIjoiMTkwIn0sIlNpemUiOnsiVyI6IjE3MCIsIkgiOiI5MCJ9fSwiUHJvcGVydGllcyI6eyJWbVRlbXBsYXRlSUQiOiIiLCJWbVRlbXBhdGVOYW1lIjoidm0iLCJOYW1lIjoiYiIsIkRlc2NyaXB0aW9uIjoiIiwiQ29tcHV0ZXJOYW1lIjoiIiwiQ1BVIjoiIiwiTWVtb3J5IjoiIiwiT1NUeXBlIjoiVWJ1bnR1IiwiT1NWZXJzaW9uIjoiV2luZG93cyBYUCBQcm9mZXNzaW9uYWwgMzJiaXQiLCJVcGRhdGVNb2RlIjoiYXV0byIsIkJsb2NrSGVhdFRyYW5mZXIiOiJ1blN1cHBvcnQiLCJOaWNzIjpbeyJOYW1lIjoiRGVmYXVsdE5pYyIsIk5ldHdvcmtJRCI6eyJSZWYiOlsiQU1FX2lkXzI1MTU0NzM3MiIsIk5ldHdvcmtJRCJdfSwiU3lzdGVtRGVmYXVsdCI6InRydWUiLCJWbGIiOiJ0cnVlIn1dLCJWb2x1bWVzIjpbXSwiU29mdHdhcmVzIjpbeyJJZCI6IkFNRV9pZF8yNTE1NDgxODgxIiwiVHlwZSI6IlNjcmlwdCIsIk5hbWUiOiJ3aW4iLCJQYWNrYWdlSUQiOiIiLCJEZXNjcmlwdGlvbiI6ImFhYSIsIlZlcnNpb24iOiJkZCIsIk9TVHlwZSI6IlVidW50dSIsIlBhY2thZ2VUeXBlIjoiIiwiUHJvdmlkZXIiOiIiLCJTdWJGaWxlUGF0aCI6IiIsIkRlc3RpbmF0aW9uUGF0aCI6IiIsIkluc3RhbGxDb21tYW5kcyI6IiIsIlVuaW5zdGFsbENvbW1hbmRzIjoiIiwiU3RhcnRDb21tYW5kcyI6IiIsIlN0b3BDb21tYW5kcyI6IiIsIkluc3RhbGxQYXJhbXMiOltbXV0sIlVuaW5zdGFsbFBhcmFtcyI6W1tdXSwiU3RhcnRQYXJhbXMiOltbXV0sIlN0b3BQYXJhbXMiOltbXV19XSwiUG9zdENvbW1hbmRzIjpbXSwiUmVsZWFzZUNvbW1hbmRzIjpbXSwiU3RhcnRDb21tYW5kcyI6W10sIlN0b3BDb21tYW5kcyI6W119fSwiQU1FX2lkXzI1MTU0NzQ5Mjk0Ijp7Ik5hbWUiOiJDQyIsIlR5cGUiOiJHTTo6Vm1UZW1wbGF0ZSIsIkdyYXBoIjp7IlBvc2l0aW9uIjp7IlgiOiI1MTAiLCJZIjoiMTkwIn0sIlNpemUiOnsiVyI6IjE3MCIsIkgiOiI5MCJ9fSwiUHJvcGVydGllcyI6eyJWbVRlbXBsYXRlSUQiOiIiLCJWbVRlbXBhdGVOYW1lIjoidm1UZW1wbGF0ZV9uZXciLCJOYW1lIjoiYyIsIkRlc2NyaXB0aW9uIjoiIiwiQ29tcHV0ZXJOYW1lIjoiIiwiQ1BVIjoiIiwiTWVtb3J5IjoiIiwiT1NUeXBlIjoiVWJ1bnR1IiwiT1NWZXJzaW9uIjoiV2luZG93cyBYUCBQcm9mZXNzaW9uYWwgMzJiaXQiLCJVcGRhdGVNb2RlIjoiYXV0byIsIkJsb2NrSGVhdFRyYW5mZXIiOiJ1blN1cHBvcnQiLCJOaWNzIjpbeyJOYW1lIjoiRGVmYXVsdE5pYyIsIk5ldHdvcmtJRCI6eyJSZWYiOlsiQU1FX2lkXzI1MTU0NzM3MiIsIk5ldHdvcmtJRCJdfSwiU3lzdGVtRGVmYXVsdCI6InRydWUiLCJWbGIiOiJmYWxzZSJ9XSwiVm9sdW1lcyI6W10sIlNvZnR3YXJlcyI6W3siSWQiOiJBTUVfaWRfMjUxNTQ4MTg4MSIsIlR5cGUiOiJTY3JpcHQiLCJOYW1lIjoid2luIiwiUGFja2FnZUlEIjoiIiwiRGVzY3JpcHRpb24iOiJhYWEiLCJWZXJzaW9uIjoiZGQiLCJPU1R5cGUiOiJVYnVudHUiLCJQYWNrYWdlVHlwZSI6IiIsIlByb3ZpZGVyIjoiIiwiU3ViRmlsZVBhdGgiOiIiLCJEZXN0aW5hdGlvblBhdGgiOiIiLCJJbnN0YWxsQ29tbWFuZHMiOiIiLCJVbmluc3RhbGxDb21tYW5kcyI6IiIsIlN0YXJ0Q29tbWFuZHMiOiIiLCJTdG9wQ29tbWFuZHMiOiIiLCJJbnN0YWxsUGFyYW1zIjpbW11dLCJVbmluc3RhbGxQYXJhbXMiOltbXV0sIlN0YXJ0UGFyYW1zIjpbW11dLCJTdG9wUGFyYW1zIjpbW11dfV0sIlBvc3RDb21tYW5kcyI6W10sIlJlbGVhc2VDb21tYW5kcyI6W10sIlN0YXJ0Q29tbWFuZHMiOltdLCJTdG9wQ29tbWFuZHMiOltdfX0sIkFNRV9pZF8yNTE1NDgyMTgzIjp7Ik5hbWUiOiJEZWZhdWx0U2NhbGluZ0dyb3VwXzUiLCJUeXBlIjoiR006OlNjYWxpbmdHcm91cCIsIkdyYXBoIjp7IlBvc2l0aW9uIjp7IlgiOiIyODAiLCJZIjoiMzkwIn0sIlNpemUiOnsiVyI6IjE1MCIsIkgiOiI0MCJ9fSwiUHJvcGVydGllcyI6eyJOYW1lIjoiRGVmYXVsdFNjYWxpbmdHcm91cF81IiwiRGVzY3JpcHRpb24iOiJBIGdyb3VwIGluY2x1ZGUgdm0iLCJNYXhTaXplIjoiMSIsIk1pblNpemUiOiIxIiwiRGVzaXJlZENhcGFjaXR5IjoiMSIsIkNvb2xkb3duIjoiMCIsIlZtVGVtcGxhdGVJRCI6eyJSZWYiOlsiQU1FX2lkXzI1MTU0NzQyNiIsIlBoeXNpY2FsSUQiXX0sIlNjYWxpbmdQb2xpY2llcyI6W3siTmFtZSI6Ind3d3ciLCJEZXNjcmlwdGlvbiI6IiIsIk1ldHJpY0NvbmRpdGlvbiI6eyJTdGF0aXN0aWNzUGVyaW9kIjoiNSIsIkNvbGxlY3Rpb25UaW1lcyI6IjEyIiwiQ29uZmlndXJhdGlvbnMiOlt7Ik1ldHJpY1R5cGUiOiJDUFUiLCJTdGF0aXN0aWNUeXBlIjoiQVZFUkFHRSIsIkNvbXBhcmVPcGVyYXRvciI6IkdFIiwiTWV0cmljVmFsdWUiOiI5MCJ9XX0sIkFjdGlvbiI6eyJBY3Rpb25UeXBlIjoiU0NBTEVPVVQiLCJDb29sRG93biI6IjEwIiwiQWRqdXN0U3RlcCI6eyJTdGVwVHlwZSI6IkFCUyIsIlN0ZXBWYWx1ZSI6IjEifX19XX19LCJBTUVfaWRfMjUxNTQ4MzkxMDciOnsiTmFtZSI6IkRCU2VydmVyIiwiVHlwZSI6IkdNOjpJbnN0YW5jZSIsIkdyYXBoIjp7fSwiUHJvcGVydGllcyI6eyJOYW1lIjoiREJTZXJ2ZXIiLCJWbVRlbXBsYXRlSUQiOnsiUmVmIjpbIkFNRV9pZF8yNTE1NDc0OTI5IiwiUGh5c2ljYWxJRCJdfSwiRGVzY3JpcHRpb24iOiIifX0sIkFNRV9pZF8yNTE1NDgzOTM0NyI6eyJOYW1lIjoiREJTZXJ2ZXJmYWZmYSIsIlR5cGUiOiJHTTo6SW5zdGFuY2UiLCJHcmFwaCI6e30sIlByb3BlcnRpZXMiOnsiTmFtZSI6IkRCU2VydmVyIiwiVm1UZW1wbGF0ZUlEIjp7IlJlZiI6WyJBTUVfaWRfMjUxNTQ3NDI2IiwiUGh5c2ljYWxJRCJdfSwiRGVzY3JpcHRpb24iOiIifX19LCJPdXRwdXRzIjp7fSwiQ29ubmVjdGlvbnMiOlt7IklkIjoiQU1FX2lkXzI1MTU0NzQ0MTciLCJUeXBlIjoiUmVhbExpbmUiLCJGcm9tIjoiQU1FX2lkXzI1MTU0NzQyNiIsIlRvIjoiQU1FX2lkXzI1MTU0NzM1MSJ9LHsiSWQiOiJBTUVfaWRfMjUxNTQ3NTM0MCIsIlR5cGUiOiJSZWFsTGluZSIsIkZyb20iOiJBTUVfaWRfMjUxNTQ3NDkyOSIsIlRvIjoiQU1FX2lkXzI1MTU0NzM3MiJ9LHsiSWQiOiJBTUVfaWRfMjUxNTQ4NzY0IiwiVHlwZSI6IlJlYWxMaW5lIiwiRnJvbSI6IkFNRV9pZF8yNTE1NDc0MjYiLCJUbyI6IkFNRV9pZF8yNTE1NDczNzIifSx7IklkIjoiQU1FX2lkXzI1MTU0ODI0ODQiLCJUeXBlIjoiUmVhbExpbmUiLCJGcm9tIjoiQU1FX2lkXzI1MTU0ODIxODMiLCJUbyI6IkFNRV9pZF8yNTE1NDc0MjYifV19"
    };
    var serviceTemplateContent2 = {
        "name": "sTemplate-001",
        "resourcePic": "buff02.jpg",
        "resPoolType": 0,
        "vdcId": 1,
        "desc": "this is description",
        "body": "eyJBV1NUZW1wbGF0ZUZvcm1hdFZlcnNpb24iOiIyMDEwLTA5LTA5IiwiRGVzY3JpcHRpb24iOiJBV1MgQ2xvdWRGb3JtYXRpb24gU2FtcGxlIFRlbXBsYXRlIiwiUGFyYW1ldGVycyI6eyJTZXJ2ZXJJbWFnZUlkIjp7IkRlc2NyaXB0aW9uIjoiRUMyIEltYWdlIElkIiwiVHlwZSI6IlN0cmluZyIsIkNvbnN0cmFpbnREZXNjcmlwdGlvbiI6Im11c3QgYmUgYSB2YWxpZCBWTSB0ZW1wbGF0ZSBpZCBvciBpbWFnZSBpZCJ9LCJJbnN0YW5jZVR5cGUiOnsiRGVzY3JpcHRpb24iOiJXZWJTZXJ2ZXIgRUMyIGluc3RhbmNlIHR5cGUiLCJUeXBlIjoiU3RyaW5nIiwiRGVmYXVsdCI6Im0xLnNtYWxsIiwiQWxsb3dlZFZhbHVlcyI6WyJtMS50aW55IiwibTEuc21hbGwiLCJtMS5tZWRpdW0iLCJtMS5sYXJnZSIsIm0xLnhsYXJnZSJdLCJDb25zdHJhaW50RGVzY3JpcHRpb24iOiJtdXN0IGJlIGEgdmFsaWQgRUMyIGluc3RhbmNlIHR5cGUuIn0sIkRCTmFtZSI6eyJEZWZhdWx0IjoiKioqIiwiRGVzY3JpcHRpb24iOiJUaGUgV29yZFByZXNzIGRhdGFiYXNlIG5hbWUiLCJUeXBlIjoiU3RyaW5nIiwiTWluTGVuZ3RoIjoiMSIsIk1heExlbmd0aCI6IjY0IiwiQWxsb3dlZFBhdHRlcm4iOiJkZ3M7bGtkc2E7ZmciLCJDb25zdHJhaW50RGVzY3JpcHRpb24iOiJtdXN0IGJlZ2luIHdpdGggYSBsZXR0ZXIgYW5kIGNvbnRhaW4gb25seSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycy4ifSwiREJVc2VybmFtZSI6eyJEZWZhdWx0IjoiKioqKiIsIk5vRWNobyI6InRydWUiLCJEZXNjcmlwdGlvbiI6IlRoZSBXb3JkUHJlc3MgZGF0YWJhc2UgYWRtaW4gYWNjb3VudCB1c2VybmFtZSIsIlR5cGUiOiJTdHJpbmciLCJNaW5MZW5ndGgiOiIxIiwiTWF4TGVuZ3RoIjoiMTYiLCJBbGxvd2VkUGF0dGVybiI6IlthLXpBLVpdW2EtekEtWjAtOV0qIiwiQ29uc3RyYWludERlc2NyaXB0aW9uIjoibXVzdCBiZWdpbiB3aXRoIGEgbGV0dGVyIGFuZCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuIn0sIkRCUGFzc3dvcmQiOnsiRGVmYXVsdCI6IioqKiIsIk5vRWNobyI6InRydWUiLCJEZXNjcmlwdGlvbiI6IlRoZSBXb3JkUHJlc3MgZGF0YWJhc2UgYWRtaW4gYWNjb3VudCBwYXNzd29yZCIsIlR5cGUiOiJTdHJpbmciLCJNaW5MZW5ndGgiOiIxIiwiTWF4TGVuZ3RoIjoiNDEiLCJBbGxvd2VkUGF0dGVybiI6IlthLXpBLVowLTldKiIsIkNvbnN0cmFpbnREZXNjcmlwdGlvbiI6Im11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLiJ9LCJEQlJvb3RQYXNzd29yZCI6eyJEZWZhdWx0IjoiYWRtaW4iLCJOb0VjaG8iOiJ0cnVlIiwiRGVzY3JpcHRpb24iOiJSb290IHBhc3N3b3JkIGZvciBNeVNRTCIsIlR5cGUiOiJTdHJpbmciLCJNaW5MZW5ndGgiOiIxIiwiTWF4TGVuZ3RoIjoiNDEiLCJBbGxvd2VkUGF0dGVybiI6IlthLXpBLVowLTldKiIsIkNvbnN0cmFpbnREZXNjcmlwdGlvbiI6Im11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLiJ9LCJOZXQwIjp7IkRlc2NyaXB0aW9uIjoiU3VibmV0IiwiVHlwZSI6IlN0cmluZyIsIkNvbnN0cmFpbnREZXNjcmlwdGlvbiI6Im11c3QgYmUgYW4gZXhpc3RlZCBzdWJuZXQgaWQifX0sIlJlc291cmNlcyI6eyJDZm5Vc2VyIjp7IlR5cGUiOiJBV1M6OklBTTo6VXNlciJ9LCJXZWJTZXJ2ZXJLZXlzIjp7IlR5cGUiOiJBV1M6OklBTTo6QWNjZXNzS2V5IiwiUHJvcGVydGllcyI6eyJVc2VyTmFtZSI6eyJSZWYiOiJDZm5Vc2VyIn19fSwiV2ViU2VydmVyR3JvdXAiOnsiVHlwZSI6IkFXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAiLCJQcm9wZXJ0aWVzIjp7IkF2YWlsYWJpbGl0eVpvbmVzIjp7IkZuOjpHZXRBWnMiOiIifSwiTGF1bmNoQ29uZmlndXJhdGlvbk5hbWUiOnsiUmVmIjoiTGF1bmNoQ29uZmlnIn0sIk1pblNpemUiOiIxIiwiTWF4U2l6ZSI6IjMiLCJWUENab25lSWRlbnRpZmllciI6W3siUmVmIjoiTmV0MCJ9XX19LCJXZWJTZXJ2ZXJTY2FsZVVwUG9saWN5Ijp7IlR5cGUiOiJBV1M6OkF1dG9TY2FsaW5nOjpTY2FsaW5nUG9saWN5IiwiUHJvcGVydGllcyI6eyJBZGp1c3RtZW50VHlwZSI6IkNoYW5nZUluQ2FwYWNpdHkiLCJBdXRvU2NhbGluZ0dyb3VwTmFtZSI6eyJSZWYiOiJXZWJTZXJ2ZXJHcm91cCJ9LCJDb29sZG93biI6IjYwIiwiU2NhbGluZ0FkanVzdG1lbnQiOiIxIn19LCJXZWJTZXJ2ZXJTY2FsZURvd25Qb2xpY3kiOnsiVHlwZSI6IkFXUzo6QXV0b1NjYWxpbmc6OlNjYWxpbmdQb2xpY3kiLCJQcm9wZXJ0aWVzIjp7IkFkanVzdG1lbnRUeXBlIjoiQ2hhbmdlSW5DYXBhY2l0eSIsIkF1dG9TY2FsaW5nR3JvdXBOYW1lIjp7IlJlZiI6IldlYlNlcnZlckdyb3VwIn0sIkNvb2xkb3duIjoiNjAiLCJTY2FsaW5nQWRqdXN0bWVudCI6Ii0xIn19LCJNRU1BbGFybUhpZ2giOnsiVHlwZSI6IkFXUzo6Q2xvdWRXYXRjaDo6QWxhcm0iLCJQcm9wZXJ0aWVzIjp7IkFsYXJtRGVzY3JpcHRpb24iOiJTY2FsZS11cCBpZiBNRU0gPiA1MCUgZm9yIDEgbWludXRlIiwiTWV0cmljTmFtZSI6Ik1lbW9yeVV0aWxpemF0aW9uIiwiTmFtZXNwYWNlIjoic3lzdGVtL2xpbnV4IiwiU3RhdGlzdGljIjoiQXZlcmFnZSIsIlBlcmlvZCI6IjYwIiwiRXZhbHVhdGlvblBlcmlvZHMiOiIxIiwiVGhyZXNob2xkIjoiNTAiLCJBbGFybUFjdGlvbnMiOlt7IlJlZiI6IldlYlNlcnZlclNjYWxlVXBQb2xpY3kifV0sIkRpbWVuc2lvbnMiOlt7Ik5hbWUiOiJBdXRvU2NhbGluZ0dyb3VwTmFtZSIsIlZhbHVlIjp7IlJlZiI6IldlYlNlcnZlckdyb3VwIn19XSwiQ29tcGFyaXNvbk9wZXJhdG9yIjoiR3JlYXRlclRoYW5UaHJlc2hvbGQifX0sIk1FTUFsYXJtTG93Ijp7IlR5cGUiOiJBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtIiwiUHJvcGVydGllcyI6eyJBbGFybURlc2NyaXB0aW9uIjoiU2NhbGUtZG93biBpZiBNRU0gPCAxNSUgZm9yIDEgbWludXRlIiwiTWV0cmljTmFtZSI6Ik1lbW9yeVV0aWxpemF0aW9uIiwiTmFtZXNwYWNlIjoic3lzdGVtL2xpbnV4IiwiU3RhdGlzdGljIjoiQXZlcmFnZSIsIlBlcmlvZCI6IjYwIiwiRXZhbHVhdGlvblBlcmlvZHMiOiIxIiwiVGhyZXNob2xkIjoiMTUiLCJBbGFybUFjdGlvbnMiOlt7IlJlZiI6IldlYlNlcnZlclNjYWxlRG93blBvbGljeSJ9XSwiRGltZW5zaW9ucyI6W3siTmFtZSI6IkF1dG9TY2FsaW5nR3JvdXBOYW1lIiwiVmFsdWUiOnsiUmVmIjoiV2ViU2VydmVyR3JvdXAifX1dLCJDb21wYXJpc29uT3BlcmF0b3IiOiJMZXNzVGhhblRocmVzaG9sZCJ9fSwiTGF1bmNoQ29uZmlnIjp7IlR5cGUiOiJBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uIiwiTWV0YWRhdGEiOnsiQVdTOjpDbG91ZEZvcm1hdGlvbjo6SW5pdCI6eyJjb25maWciOnsiZmlsZXMiOnsiL2V0Yy9jZm4vY2ZuLWNyZWRlbnRpYWxzIjp7ImNvbnRlbnQiOnsiRm46OkpvaW4iOlsiIixbIkFXU0FjY2Vzc0tleUlkPSIseyJSZWYiOiJXZWJTZXJ2ZXJLZXlzIn0sIlxuIiwiQVdTU2VjcmV0S2V5PSIseyJGbjo6R2V0QXR0IjpbIldlYlNlcnZlcktleXMiLCJTZWNyZXRBY2Nlc3NLZXkiXX0sIlxuIl1dfSwibW9kZSI6IjAwMDQwMCIsIm93bmVyIjoicm9vdCIsImdyb3VwIjoicm9vdCJ9LCIvdG1wL3NldHVwLm15c3FsIjp7ImNvbnRlbnQiOnsiRm46OkpvaW4iOlsiIixbIkNSRUFURSBEQVRBQkFTRSAiLHsiUmVmIjoiREJOYW1lIn0sIjtcbiIsIkdSQU5UIEFMTCBQUklWSUxFR0VTIE9OICIseyJSZWYiOiJEQk5hbWUifSwiLiogVE8gJyIseyJSZWYiOiJEQlVzZXJuYW1lIn0sIidAJ2xvY2FsaG9zdCdcbiIsIklERU5USUZJRUQgQlkgJyIseyJSZWYiOiJEQlBhc3N3b3JkIn0sIic7XG4iLCJGTFVTSCBQUklWSUxFR0VTO1xuIiwiRVhJVFxuIl1dfSwibW9kZSI6IjAwMDY0NCIsIm93bmVyIjoicm9vdCIsImdyb3VwIjoicm9vdCJ9LCIvdG1wL3N0YXRzLWNyb250YWIudHh0Ijp7ImNvbnRlbnQiOnsiRm46OkpvaW4iOlsiIixbIk1BSUw9XCJcIlxuIiwiXG4iLCIqICogKiAqICogL29wdC9hd3MvYmluL2Nmbi1wdXNoLXN0YXRzIC0td2F0Y2ggIix7IlJlZiI6Ik1FTUFsYXJtSGlnaCJ9LCIgLS1tZW0tdXRpbFxuIiwiKiAqICogKiAqIC9vcHQvYXdzL2Jpbi9jZm4tcHVzaC1zdGF0cyAtLXdhdGNoICIseyJSZWYiOiJNRU1BbGFybUxvdyJ9LCIgLS1tZW0tdXRpbFxuIl1dfSwibW9kZSI6IjAwMDYwMCIsIm93bmVyIjoicm9vdCIsImdyb3VwIjoicm9vdCJ9fSwicGFja2FnZXMiOnsieXVtIjp7InB5dGhvbi1wc3V0aWwiOltdLCJjcm9uaWUiOltdLCJteXNxbCI6W10sIm15c3FsLXNlcnZlciI6W10sImh0dHBkIjpbXSwid29yZHByZXNzIjpbXX19LCJzZXJ2aWNlcyI6eyJzeXN0ZW1kIjp7Im15c3FsZCI6eyJlbmFibGVkIjoidHJ1ZSIsImVuc3VyZVJ1bm5pbmciOiJ0cnVlIn0sImh0dHBkIjp7ImVuYWJsZWQiOiJ0cnVlIiwiZW5zdXJlUnVubmluZyI6InRydWUifSwiY3JvbmQiOnsiZW5hYmxlZCI6InRydWUiLCJlbnN1cmVSdW5uaW5nIjoidHJ1ZSJ9fX19fX0sIlByb3BlcnRpZXMiOnsiSW1hZ2VJZCI6eyJSZWYiOiJTZXJ2ZXJJbWFnZUlkIn0sIkluc3RhbmNlVHlwZSI6eyJSZWYiOiJJbnN0YW5jZVR5cGUifSwiVXNlckRhdGEiOnsiRm46OkJhc2U2NCI6eyJGbjo6Sm9pbiI6WyIiLFsiIyEvYmluL2Jhc2ggLXZcbiIsIi9vcHQvYXdzL2Jpbi9jZm4taW5pdCAtcyAiLHsiUmVmIjoiQVdTOjpTdGFja05hbWUifSwiIC1yIExhdW5jaENvbmZpZyAiLCIgLS1yZWdpb24gIix7IlJlZiI6IkFXUzo6UmVnaW9uIn0sIlxuIiwiIyBTZXR1cCBNeVNRTCByb290IHBhc3N3b3JkIGFuZCBjcmVhdGUgYSB1c2VyXG4iLCJteXNxbGFkbWluIC11IHJvb3QgcGFzc3dvcmQgJyIseyJSZWYiOiJEQlJvb3RQYXNzd29yZCJ9LCInXG4iLCJteXNxbCAtdSByb290IC0tcGFzc3dvcmQ9JyIseyJSZWYiOiJEQlJvb3RQYXNzd29yZCJ9LCInIDwgL3RtcC9zZXR1cC5teXNxbFxuIiwic2VkIC1pIFwiL0RlbnkgZnJvbSBBbGwvZFwiIC9ldGMvaHR0cGQvY29uZi5kL3dvcmRwcmVzcy5jb25mXG4iLCJzZWQgLS1pbi1wbGFjZSAtLWUgcy9kYXRhYmFzZV9uYW1lX2hlcmUvIix7IlJlZiI6IkRCTmFtZSJ9LCIvIC0tZSBzL3VzZXJuYW1lX2hlcmUvIix7IlJlZiI6IkRCVXNlcm5hbWUifSwiLyAtLWUgcy9wYXNzd29yZF9oZXJlLyIseyJSZWYiOiJEQlBhc3N3b3JkIn0sIi8gL3Vzci9zaGFyZS93b3JkcHJlc3Mvd3AtY29uZmlnLnBocFxuIiwic3lzdGVtY3RsIHJlc3RhcnQgaHR0cGQuc2VydmljZVxuIiwiIyBpbnN0YWxsIGNyb250YWJcbiIsImNyb250YWIgL3RtcC9zdGF0cy1jcm9udGFiLnR4dFxuIl1dfX19fX0sIk91dHB1dHMiOnsiVVJMIjp7IkRlc2NyaXB0aW9uIjoiVGhlIFVSTCBvZiB0aGUgd2Vic2l0ZSIsIlZhbHVlIjoid3d3LmJhaWR1LmNvbSJ9fX0="
    };

    var appDeployOutputs = {"outputs": [{
        "outputKey": "outputKeyA",
        "outputValue": "outputValueA",
        "outputDesc": "this is outputA"
    }]};
    var appDeployResources = {"resourceList":[{
        "name": "resoruce001",
        "type": "VM",
        "status": "active",
        "updateTime": "2013-2-6"
    },
        {
            "name": "resoruce002",
            "type": "network",
            "status": "inactive",
            "updateTime": "2013-3-6"
        },
        {
            "name": "resoruce05",
            "type": "scalingGroup",
            "status": "active",
            "updateTime": "2013-2-7"
        }]};

    var appBasicInfoResource2 = {
        appId: "1269839f-9b15-4e32-8d63-969df354b6e5",
        appName: "custom",
        createBeginTime: "2014-05-29 10:43:50",
        createEndTime: "2014-05-29 10:43:50",
        createPercent: "0/100",
        desc: null,
        healthStatus: null,
        vdcId: "34",
        orgName: "ame",
        parameters: null,
        picture: "buff01.jpg",
        stackStatusReason: null,
        status: "Started",
        type: "CUSTOMER",
        userId: "8",
        userName: "ljb",
        vms: [{
            "instanceId": "vminstanceId001",
            "rid": "vmRid001",
            "name": "vm001",
            "description": "descip11",
            "startOrder": 1
        }, {
            "instanceId": "vminstanceId002",
            "rid": "vmRid002",
            "name": "vm002",
            "description": "descip6242",
            "startOrder": 5
        }],
        vpcId: "4792750811720056832",
        vpcName: "vpc1"
    };

    var appDeployBasicInfo = {
        "appName": "myApp001",
        "status": "running",
        "orgName": "org001",
        "vpcs": ["vpc001", "vpc002"],
        "desc": "this is app001",
        "createTime": "2012-1-3",
        "createEndTime": "2013-1-4",
        "creator": "user-001"
    };
    var getUserListResponse = {
        "getUserListResponse": {
            "total": 12,
            "userList": [{
                createTime: "2014-05-07 15:16:10 UTC+08:00",
                defaultUser: false,
                description: null,
                email: null,
                id: "8",
                lockStatus: "UNLOCKED",
                loginVdcId: "0",
                name: "orgUser",
                onLineStatus: "OFFLINE",
                phoneNum: null,
                roleList: [],
                userType: "NATIVE_USER"
            }, {
                createTime: "2014-05-07 15:16:10 UTC+08:00",
                defaultUser: false,
                description: null,
                email: null,
                id: "9",
                lockStatus: "UNLOCKED",
                loginVdcId: "0",
                name: "user2",
                onLineStatus: "OFFLINE",
                phoneNum: null,
                roleList: [],
                userType: "NATIVE_USER"
            }, {
                createTime: "2014-05-07 15:16:10 UTC+08:00",
                defaultUser: false,
                description: null,
                email: null,
                id: "10",
                lockStatus: "UNLOCKED",
                loginVdcId: "0",
                name: "user3",
                onLineStatus: "OFFLINE",
                phoneNum: null,
                roleList: [],
                userType: "NATIVE_USER"
            },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "11",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser4",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "21",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser21",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "22",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser22",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "23",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser23",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "24",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser24",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "25",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser25",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "26",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser26",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "27",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser27",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                },
                {
                    createTime: "2014-05-07 15:16:10 UTC+08:00",
                    defaultUser: false,
                    description: null,
                    email: null,
                    id: "28",
                    lockStatus: "UNLOCKED",
                    loginVdcId: "0",
                    name: "orgUser28",
                    onLineStatus: "OFFLINE",
                    phoneNum: null,
                    roleList: [],
                    userType: "NATIVE_USER"
                }]
        }
    };

    var customAvailableVm = [{"choose":"", "name":"vmLijbin", "vmId":"id001", "ip":"192.168.1.1", "vpc": "vpc001", "startOrder": "1", "opt": ""},
        {"choose":"", "name":"vmLijbin02", "vmId":"id002", "ip":"192.168.1.1", "vpc": "vpc002", "startOrder": "2", "opt": ""}];
    var availableShells = [{
        "selectId": "1",
        "label": "startTomcat"
    }, {
        "selectId": "2",
        "label": "startGM"
    }];
    var availableSoftPacks = {"softwareInfos":
        [{
        "id": "software1",
        "name": "python_ljb",
        "osType": "Linux",
        "version": "1",
        "installCommand": "sh install ${python_ljbP=$appTemplate_3.Nics.DefaultNic.IP}",
        "unInstallCommand": "sh uninstall",
        "startCommand": "sh start",
        "stopCommand": "sh stop"
    }, {
            "id": "software2",
            "name": "python_ljb_3glsjg",
            "osType": "Linux",
            "version": "1",
            "installCommand": "sh install ${python_ljb_3glsjg}",
            "unInstallCommand": "sh uninstall ${python_ljb_3glsjg}",
            "startCommand": "sh start ${python_ljb_3glsjg}",
            "stopCommand": "sh stop ${python_ljb_3glsjg}"
    },{
            "id": "software3",
            "name": "PYTHON_ljb_3glsjg",
            "osType": "Linux",
            "version": "1",
            "installCommand": "sh install ${PYTHON_ljb_3glsjg}",
            "unInstallCommand": "sh uninstall ${PYTHON_ljb_3glsjg}",
            "startCommand": "sh start ${PYTHON_ljb_3glsjg}",
            "stopCommand": "sh stop ${PYTHON_ljb_3glsjg}"
        }]};

    var softpackDetails = {"1":{
        "install":{
            "options":[
                {
                    "label": "IP:",
                    "name": "IP",
                    "require": true,
                    "id":"app_create_configSoftware_configSoft_ip",
                    "value":"",
                    "associate":""
                },
                {
                    "label": "name:",
                    "name": "name",
                    "require": true,
                    "id": "app_create_configSoftware_configSoft_name",
                    "value":"",
                    "associate":""
                },
                {
                    "label": "mac:",
                    "name": "mac",
                    "require": true,
                    "id": "app_create_configSoftware_configSoft_mac",
                    "value":"",
                    "associate":""
                }
            ]
        },
        "uninstall": {
            "options":[
                {
                    "label": "uninstall IP:",
                    "name": "uninstallIP",
                    "require": true,
                    "id":"app_create_configSoftware_configSoft_ip",
                    "value":""
                }
            ]
        },
        "start": {
            "options":[
                {
                    "label": "start IP:",
                    "name": "startIP",
                    "require": true,
                    "id":"app_create_configSoftware_configSoft_ip",
                    "value":""
                }
            ]
        },
        "stop": {
            "options":[
                {
                    "label": "stop IP:",
                    "name": "stopIP",
                    "require": true,
                    "id":"app_create_configSoftware_configSoft_ip",
                    "value":""
                }
            ]
        }
    },
    "2":{
        "install":null,
        "uninstall": null,
        "start": null,
        "stop": null
    }};

    var softShellDetails = {"1":[
        {
            "label": "IP:",
            "name": "IP",
            "require": true,
            "id":"app_create_configSoftware_configSoft_ip",
            "value":"",
            "associate":""
        },
        {
            "label": "name:",
            "name": "name",
            "require": true,
            "id": "app_create_configSoftware_configSoft_name",
            "value":"",
            "associate":""
        },
        {
            "label": "mac:",
            "name": "mac",
            "require": true,
            "id": "app_create_configSoftware_configSoft_mac",
            "value":"",
            "associate":""
        }
        ],
        "2":[
        {
            "label": "IP:",
            "name": "IP",
            "require": true,
            "id":"app_create_configSoftware_configSoft_ip",
            "value":"",
            "associate":""
        },
        {
            "label": "name:",
            "name": "name",
            "require": true,
            "id": "app_create_configSoftware_configSoft_name",
            "value":"",
            "associate":""
        },
        {
            "label": "mac:",
            "name": "mac",
            "require": true,
            "id": "app_create_configSoftware_configSoft_mac",
            "value":"",
            "associate":""
        }
        ], "3":[]};
    var availableVmTemplates = {
        "vmtemplates":
            [
            {
                "vmtID": "vmTempId1",
                "vmtName": "appTemplate",
                "osType": "Linux",
                "osVersion": "Novell SUSE Linux Enterprise Server 11 SP1 64bit"
            },
            {
                "vmtID": "vmTempId2",
                "vmtName": "APPTemplateaff",
                "osType": "Linux",
                "osVersion": "Novell SUSE Linux Enterprise Server 11 SP1 64bit"
            },
                {
                    "vmtID": "vmTempId3",
                    "vmtName": "appTemplate2",
                    "osType": "Linux",
                    "osVersion": "Novell SUSE Linux Enterprise Server 11 SP1 64bit"
                }]
    };

    var availableSpecs = {
        "vmFlavors": [{
            "flavorId": "1",
            "name": "flavor1",
            "cpuCount": 2,
            "memSize": 1024,
            "disks": [{
                "index": 0,
                "diskSize": 10
            }]
        }, {
            "flavorId": "2",
            "name": "flavor3",
            "cpuCount": 4,
            "memSize": 2048,
            "disks": [{
                "index": 0,
                "diskSize": 10
            },
                {
                    "index": 1,
                    "diskSize": 10
                }]
        }]
    };

    var availableSpecsByTemplates = {
        "1":[{
            "selectId": "1",
            "label": "2U|1G|30G"
        }, {
            "selectId": "2",
            "label": "4U|2G|60G"
        }],
        "2": [{
            "selectId": "3",
            "label": "22U|1G|30G"
        }, {
            "selectId": "4",
            "label": "24U|2G|60G"
        }]
    };

    var vlbTemplates = [
        {
            "templateId": "vmTemplateId001",
            "templateName": "local_gr_2",
            "nicName": "Default_Network",
            "orgNetName": "internal",
            "associateVlb": "vlbName001",
            "associateVlbId":"vlb001",
            "opt": ""
        },
        {
            "templateId": "vmTemplateId002",
            "templateName": "local_gr_3",
            "nicName": "Default_Network2",
            "orgNetName": "internal2",
            "associateVlb": "vlbName001",
            "associateVlbId":"vlb001",
            "opt": ""
        },
        {
            "templateId": "vmTemplateId003",
            "templateName": "local_gr_5",
            "nicName": "Default_Network3",
            "orgNetName": "internal2",
            "associateVlb": "",
            "associateVlbId":"",
            "opt": ""
        }
    ];

    var availabelVlbs = [
        {
            "id": "vlb001",
            "name": "vlbName001",
            "extIp": "192.168.3.4",
            "protocolPort": "HTTP(80);HTTPS(43)"
        },
        {
            "id": "vlb002",
            "name": "vlbName002",
            "extIp": "192.168.3.4",
            "protocolPort": "HTTP(80);HTTPS(43)"
        },
        {
            "id": "vlb003",
            "name": "vlbName003",
            "extIp": "192.168.3.4",
            "protocolPort": "HTTP(80);HTTPS(43)"
        }
    ];

    var networkListByVpc = {
        "networks":[
            {

                "name": "Internal 1 zone Network",
                "status": "Normal",
                "networkType": "Internal Network",
                "subnets": "IPv4:192.168.123.211/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "opt": "",

                "networkID": "network-001",
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "ipv4Subnet":{
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                }
            },
            {

                "name": "Internal 1 zone Network",
                "status": "Normal",
                "networkType": "Internal Network",
                "subnets": "IPv4:192.168.123.212/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "opt": "",

                "networkID": "network-002",
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "ipv4Subnet":{
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                }
            }
        ]
    };
    var networkListByVpc2 = {
        "networks":[
            {

                "name": "External 2 Zone Network",
                "status": "Normal",
                "networkType": "External Network",
                "subnets": "IPv4:192.168.123.211/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "opt": "",

                "networkID": "network-003",
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "ipv4Subnet":{
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null
            },
            {

                "name": "External 2 Zone Network",
                "status": "Normal",
                "networkType": "External 2 Zone Network",
                "subnets": "IPv4:192.168.123.211/24",
                "ipdiscover": "DHCP",
                "IPtotal": "0/252",
                "opt": "",

                "networkID": "network-004",
                "detail": {
                    contentType: "url",
                    content: "app/business/network/views/networkDetail.html"
                },
                "ipv4Subnet":{
                    "ipAllocatePolicy": 0,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3
                },
                "ipv6Subnet": null
            }
        ]
    };

    var vpcNetworkMap = {
        "001": [{
            "selectId": "network001",
            "label": "network001",
            "checked": true
        },{
            "selectId": "network002",
            "label": "network002"
        },{
            "selectId": "network003",
            "label": "network003"
        }],
        "002": [{
            "selectId": "NETWORK001",
            "label": "NETWORK001",
            "checked": true
        },{
            "selectId": "NETWORK002",
            "label": "NETWORK002"
        },{
            "selectId": "NETWORK003",
            "label": "NETWORK003"
        }]
    };

    var availableServiceTemplates = {
        "appTemplates":[
            {"id":"11001","name":"SimpleApp_Single_Instance","description":"SimpleApp_Single_Instance",
                "picture":"buff01.jpg","status":"Draft","vdcId":"all","vdcName":null,"userId":"1","userName":null,
                "createTime":"2014-05-04 17:54:04","resPoolType":"FusionManager"},
            {"id":"11002","name":"AutoScaling","description":"AutoScaling","picture":"buff01.jpg","status":"Published",
                "vdcId":"all","vdcName":null,"userId":"1","userName":null,"createTime":"2014-05-04 17:54:04","resPoolType":"FusionManager"
            }
        ],
        "total":2
    };
    var serviceTemplates = {
        "data":[{
            "id":"template001",
            "name":"serviceTemplate_Fm1",
            "type":"FM",
            "os":"Linux",
            "osVersion":"RedHat2.6"
        },
        {
                "id":"template003",
                "name":"serviceTemplate_openstack_3",
                "type":"Openstack",
                "os":"Windows",
                "osVersion":"WindowsXp"
        },
            {
                "id":"template006",
                "name":"serviceTemplate_FM_6",
                "type":"FM",
                "os":"Windows",
                "osVersion":"WindowsXp"
            }],
        "curPage": 1,
        "totalRecord": 2
    };

    var resCloud_vpc_map = {
        "cloudInfra02": {
            "vpcs" : [{
                "vpcID" : "001",
                "availableZone":[{
                    "id":"4616189618054758401",
                    "name" : "AZ01"
                }] ,
                "tenantID" : "user001",
                "name" : "vpc001",
                "description" : "Description 1",
                "opt": "",
                "vpcSpecTemplate":{"maxDirectNetworkNum":200,"maxRoutedNetworkNum":200,"maxInternalNetworkNum":200,"maxPublicIpNum":200,"maxNetworkBandWidth":4000,"priority":1,"maxRxThroughput":4000,"maxTxThroughput":4000}

            },{
                "vpcID" : "002",
                "availableZone":[{
                    "id":"4616189618054758401",
                    "name" : "AZ01"
                }] ,
                "tenantID" : "user002",
                "name" : "vpc002",
                "description" : "Description 2",
                "opt": "",
                "vpcSpecTemplate" : {}
            },{
                "vpcID" : "003",
                "availableZone":[{
                    "id":"4616189618054758401",
                    "name" : "AZ01"
                }] ,
                "tenantID" : "user003",
                "name" : "vpc003",
                "description" : "Description 3",
                "opt": "",
                "vpcSpecTemplate" : {}
            }],
            "total" : 3,
            "curPage" : 1,
            "displayLength" : 10
        },

        "cloudInfra01": {
            "vpcs" : [{
                "vpcID" : "4792750811720056832",
                "availableZone":[{
                    "id":"4616189618054758401",
                    "name" : "AZ01"
                }] ,
                "tenantID" : "user001",
                "name" : "falskjfsalf_vpc011",
                "description" : "Description 1",
                "opt": "",
                "vpcSpecTemplate" : {}

            }],
            "total" : 1,
            "curPage" : 1,
            "displayLength" : 10
        }
    };

    var vpcInfoList = {
        "vpcs" : [{
            "vpcID" : "001",
            "availableZone":[{
                "id":"4616189618054758401",
                "name" : "AZ01"
            }] ,
            "tenantID" : "user001",
            "name" : "vpc001",
            "description" : "Description 1",
            "opt": "",
            "vpcSpecTemplate":{"maxDirectNetworkNum":200,"maxRoutedNetworkNum":200,"maxInternalNetworkNum":200,"maxPublicIpNum":200,"maxNetworkBandWidth":4000,"priority":1,"maxRxThroughput":4000,"maxTxThroughput":4000}

        },{
            "vpcID" : "002",
            "availableZone":[{
                "id":"4616189618054758401",
                "name" : "AZ01"
            }] ,
            "tenantID" : "user002",
            "name" : "vpc002",
            "description" : "Description 2",
            "opt": "",
            "vpcSpecTemplate" : {}
        },{
            "vpcID" : "003",
            "availableZone":[{
                "id":"4616189618054758401",
                "name" : "AZ01"
            }] ,
            "tenantID" : "user003",
            "name" : "vpc003",
            "description" : "Description 3",
            "opt": "",
            "vpcSpecTemplate" : {}
        }],
        "total" : 3,
        "curPage" : 1,
        "displayLength" : 10
    };

    var vpcs = [{
        "selectId": "1",
        "label": "vpc001",
        "checked": true
    }, {
        "selectId": "2",
        "label": "vpc002"
    }];

    var cloud_apps_map = {
        "cloudInfra01": {
            "appInstances": [
                {
                    appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a1",
                    appName: "custom",
                    createPercent: "50/100",
                    creationBeginTime: "2014-04-17 06:43:11",
                    creationEndTime: "2014-04-17 06:47:59",
                    desc: null,
                    healthStatus: null,
                    vdcId: "2",
                    orgName: null,
                    picture: "../theme/default/images/gm/appImage/buff01.jpg",
                    status: "StopFailed",
                    type: "CUSTOMER",
                    userId: "4",
                    userName: null,
                    vpcId: "4792750811720056832",
                    "vpcName": "pan"
                }
            ],
            "curPage": 1,
            "total": 1
        },
        "cloudInfra02": {
            "appInstances": [
                {
                    appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a12fa1",
                    appName: "appInstance01",
                    createPercent: "100/100",
                    creationBeginTime: "2014-04-17 06:43:11",
                    creationEndTime: "2014-04-17 06:47:59",
                    desc: null,
                    healthStatus: null,
                    vdcId: "2",
                    orgName: null,
                    picture: "../theme/default/images/gm/appImage/buff01.jpg",
                    status: "Creating",
                    type: "TEMPLATE",
                    userId: "4",
                    userName: null,
                    vpcId: "4792750811720056832",
                    "vpcName": "vpc03"
                },
                {
                    appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a12fa2",
                    appName: "appInstance02",
                    createPercent: "100/100",
                    creationBeginTime: "2014-04-17 06:43:11",
                    creationEndTime: "2014-04-17 06:47:59",
                    desc: null,
                    healthStatus: null,
                    vdcId: "2",
                    orgName: null,
                    picture: "../theme/default/images/gm/appImage/buff01.jpg",
                    status: "StopFailed",
                    type: "TEMPLATE",
                    userId: "4",
                    userName: null,
                    vpcId: "4792750811720056832",
                    "vpcName": "vpc02"
                },
                {
                    appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a12fa2",
                    appName: "appInstance03",
                    createPercent: "100/100",
                    creationBeginTime: "2014-04-17 06:43:11",
                    creationEndTime: "2014-04-17 06:47:59",
                    desc: null,
                    healthStatus: null,
                    vdcId: "2",
                    orgName: null,
                    picture: "../theme/default/images/gm/appImage/buff01.jpg",
                    status: "Creating",
                    type: "TEMPLATE",
                    userId: "4",
                    userName: null,
                    vpcId: "4792750811720056832",
                    "vpcName": "vpc01"
                },
                {
                    appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a12fa2",
                    appName: "appInstance04",
                    createPercent: "100/100",
                    creationBeginTime: "2014-04-17 06:43:11",
                    creationEndTime: "2014-04-17 06:47:59",
                    desc: null,
                    healthStatus: null,
                    vdcId: "2",
                    orgName: null,
                    picture: "../theme/default/images/gm/appImage/buff01.jpg",
                    status: "StopFailed",
                    type: "TEMPLATE",
                    userId: "4",
                    userName: null,
                    vpcId: "4792750811720056832",
                    "vpcName": "vpc05"
                }
            ],
            "curPage": 1,
            "total": 4
        }
    };

    var appListData = {
        "appInstances": [
            {
                appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a1",
                appName: "a",
                createPercent: "100/100",
                creationBeginTime: "2014-04-17 06:43:11",
                creationEndTime: "2014-04-17 06:47:59",
                desc: null,
                healthStatus: null,
                vdcId: "2",
                orgName: null,
                picture: "../theme/default/images/gm/appImage/buff01.jpg",
                status: "Creating",
                type: "TEMPLATE",
                userId: "4",
                userName: null,
                vpcId: "4792750811720056832",
                "vpcName": "pan"
            },
            {
                appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a1",
                appName: "a",
                createPercent: "100/100",
                creationBeginTime: "2014-04-17 06:43:11",
                creationEndTime: "2014-04-17 06:47:59",
                desc: null,
                healthStatus: null,
                vdcId: "2",
                orgName: null,
                picture: "../theme/default/images/gm/appImage/buff01.jpg",
                status: "Started",
                type: "TEMPLATE",
                userId: "4",
                userName: null,
                vpcId: "4792750811720056832",
                "vpcName": "pan"
            },
            {
                appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a3",
                appName: "a23a",
                createPercent: "100/100",
                creationBeginTime: "2014-04-17 06:43:11",
                creationEndTime: "2014-04-17 06:47:59",
                desc: null,
                healthStatus: null,
                vdcId: "2",
                orgName: null,
                picture: "../theme/default/images/gm/appImage/buff01.jpg",
                status: "CreationFailed",
                type: "TEMPLATE",
                userId: "4",
                userName: null,
                vpcId: "4792750811720056832",
                "vpcName": "pan"
            }
        ],
        "curPage": 1,
        "total": 2
    };

    var appStatistics = {
        "normalCount": 1,
        "normalRate": 10,
        "abnormalCount": 7,
        "abnormalRate": 70,
        "unused": 2,
        "unusedRate": 20
    };

    var templateStatistics = {
        "normalCount": 2,
        "normalRate": 9.5,
        "abnormalCount": 6,
        "abnormalRate": 30.5,
        "unused": 12,
        "unusedRate": 60
    };

    var baseInfo = {
        "runState": "run",
        "creator": "sysAdmin",
        "healthStatus": "Normal",
        "createTime": "2014-1-1",
        "vpc": "LaboratoryVPC-001",
        "description": "asfszdfjsajfqwhj"
    };

    var deployResources = {
        "list":[
        {
            "name":"resource001",
            "type":"vm",
            "state":"available",
            "updateTime": "2014-2-5"
        },{
            "name":"resource003",
            "type":"network",
            "state":"unavailable",
            "updateTime": "2014-3-5"
        },{
                "name":"resource005",
                "type":"network",
                "state":"unavailable",
                "updateTime": "2014-3-5"
            }],
        "totalRecords": 2
    };

    var outputs = [
        {
            "name":"Name1",
            "value":"fasfafk",
            "description":"just a test"
        },{
            "name":"Name2",
            "value":"ew",
            "description":"just a test2"
        },
        {
            "name":"Name3",
            "value":"af",
            "description":"just a test5"
        }
    ];

    var reportsIct = {
        "resourceDeployReports": [],
        "total": 25
    };

    var reports = {
        "resourceDeployReports":
        [{
            createBeginTime: "2014-07-12 05:47:45",
            createEndTime: "2014-07-12 05:54:08",
            desc: null,
            failedReason: null,
            resourceName: "DonnotDel",
            resourceType: "Instance",
            status: "CREATE_COMPLETE"
        },{
            createBeginTime: "2014-07-12 05:47:40",
            createEndTime: "2014-07-12 05:47:40",
            desc: null,
            failedReason: null,
            resourceName: "internal02",
            resourceType: "Network",
            status: "CREATE_COMPLETE"
        },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal02",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal03",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal04",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal05",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal06",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal07",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal08",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal09",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal10",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            },
            {
                createBeginTime: "2014-07-12 05:47:40",
                createEndTime: "2014-07-12 05:47:40",
                desc: null,
                failedReason: null,
                resourceName: "internal11",
                resourceType: "Network",
                status: "CREATE_COMPLETE"
            }],
        "total": 12
    };
    var templateListData = {
        "appTemplates": [
            {
                "templateId": "templateId1",
                "templateName": "Application Template 1",
                "templateDesc": "Template 1",
                "state": "Published",
                "vdcId": 1,
                "userId":1,
                "createTime": "2014-12-12 10:30",
                "resPoolType": 1,
                "image": "buff01.jpg"
            },
            {
                "templateId": "templateId2",
                "templateName": "Application Template 2",
                "templateDesc": "Template 2",
                "state": "Draft",
                "vdcId": 2,
                "userId":1,
                "createTime": "2014-12-12 10:30",
                "resPoolType": 1,
                "image": "buff01.jpg"
            },
            {
                "templateId": "templateId3",
                "templateName": "Application Template 3",
                "templateDesc": "Template 3",
                "state": "Published",
                "vdcId": 1,
                "userId":1,
                "createTime": "2014-12-12 10:30",
                "resPoolType": 1,
                "image": "buff01.jpg"
            }
        ],
        "total": 3
    };

    var statusArray = {
        "1": "Run",
        "2": "Stop",
        "3": "Sleep"
    };

    var planList = [
        {
            "showDetail": "",
            "planName": "Task002",
            "touchType": "Automatically trigger",
            "touchDate": "20140225",
            "touchTime": "09:00:00",
            "status": "0",
            "opts": ""
        },
        {
            "showDetail": "",
            "planName": "Task003",
            "touchType": "Automatically trigger",
            "touchDate": "20140225",
            "touchTime": "09:00:00",
            "status": "0",
            "opts": ""
        }
    ];

    var logList = [
        {
            "showDetail": "",
            "policyName": "policy001",
            "policyType": "A",
            "belong": "A",
            "executeTime": "2014-02-26 09:00:00",
            "finishTime": "2014-02-26 09:30:00",
            "result": "Successful implementation",
            "desc": "aaaaaa",
            "reason": ""
        },
        {
            "showDetail": "",
            "policyName": "policy002",
            "policyType": "B",
            "belong": "B",
            "executeTime": "2014-02-26 09:00:00",
            "finishTime": "2014-02-26 09:40:00",
            "result": "Fail",
            "desc": "aaaaaa",
            "reason": "Connection Timeout"
        },
        {
            "showDetail": "",
            "policyName": "policy003",
            "policyType": "C",
            "belong": "C",
            "executeTime": "2014-02-26 09:00:00",
            "finishTime": "2014-02-26 09:50:00",
            "result": "Successful implementation",
            "desc": "aaaaaa",
            "reason": ""
        }
    ];
    var policyList = [
        {
            "showDetail": "",
            "name": "policy001",
            "status": "1",
            "createTime": "2014-02-26 09:00:00",
            "desc": "aaaaaa",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "policy001",
            "status": "1",
            "createTime": "2014-02-26 09:00:00",
            "desc": "aaaaaa",
            "opts": ""
        },
        {
            "showDetail": "",
            "name": "policy001",
            "status": "1",
            "createTime": "2014-02-26 09:00:00",
            "desc": "aaaaaa",
            "opts": ""
        }
    ];
    var addPolicyList = [
        {
            "showDetail": "",
            "flexName": "policy001",
            "appName": "1",
            "cpuValMax": "5",
            "cpuMax": "8",
            "memoryValMax": "7",
            "memoryMax": "9",
            "priority": "1",
            "opts": ""
        },
        {
            "showDetail": "",
            "flexName": "policy001",
            "appName": "1",
            "cpuValMax": "5",
            "cpuMax": "8",
            "memoryValMax": "7",
            "memoryMax": "9",
            "priority": "1",
            "opts": ""
        }];
    var groupPolicyList =[{
        "showDetail":"",
        "name":"Strategy 1",
        "desc":"aaaaaaaaaaa",
        "opts":""
    },{
        "showDetail":"",
        "name":"Strategy 2",
        "desc":"bbbbbbbbbb",
        "opts":""
    },{
        "showDetail":"",
        "name":"Strategy 3",
        "desc":"ccccccccc",
        "opts":""
    }];

    var innerPolicyList =[{
        "showDetail":"",
        "name":"Strategy 1",
        "flexName":"aaaaaaaaaaa",
        "app":"Virtual",
        "opts":""
    },{
        "showDetail":"",
        "name":"Strategy 2",
        "flexName":"aaaaaaaaaaa",
        "app":"Virtual",
        "opts":""
    },{
        "showDetail":"",
        "name":"Strategy 3",
        "flexName":"aaaaaaaaaaa",
        "app":"Virtual",
        "opts":""
    }];
    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/ostypes":function(original, response) {
            response(200, "success", osTypeMapping, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/app/{id}/resMonitor": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/{vdc_id}/v1.5/app/{id}/vms/list?start={start}&limit={limit}": function (original, response) {
            response(200, "success", appVmList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates?cloud-infra={cloud_infra_id}&limit={limit}&start={start}": function (original, response) {
            response(200, "success", imagesICT, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpc/{vpcid}/networks": function (original, response) {
            response(200, "success", networkListICT, {});
        },
        "GET /app/policy/innerPolicyList": function (original, response) {
            response(200, "success", innerPolicyList, {});
        },
        "GET /app/policy/groupPolicyList": function (original, response) {
            response(200, "success", groupPolicyList, {});
        },
        "GET /app/policy/planList": function (original, response) {
            response(200, "success", planList, {});
        },
        "GET /app/policy/logList": function (original, response) {
            response(200, "success", logList, {});
        },
        "GET /app/policy/policyList": function (original, response) {
            response(200, "success", policyList, {});
        },
        "GET /app/policy/addPolicyList": function (original, response) {
            response(200, "success", addPolicyList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apps": function (original, response) {
            var cloudInfraId = original.data["cloud-infra"];
            response(200, "success", cloud_apps_map[cloudInfraId], {});
        },
        "GET /goku/rest/v1.5/{vdcId}/apptemplates": function (original, response) {
            response(200, "success", availableServiceTemplates, {});
        },
        //创建模板
        "POST /goku/rest/v1.5/{vdc_id}/apptemplates": function (original, response) {
            var request = JSON.parse(original.data);

            var appId = Math.ceil(Math.random()*100000);
            var createTime = new Date();

            var appTemplate = {
                name:request.name,
                description:request.desc,
                picture:request.picture,
                resPoolType:request.resPoolType,
                body:request.body,
                id:appId,
                status:"Draft",
                vdcId:"all",
                vdcName:null,
                userId:"1",
                userName:null,
                createTime:""
            };

            availableServiceTemplates.total++;
            availableServiceTemplates.appTemplates.push(appTemplate);

            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/{vdcId}/apptemplates/{id}/actions": function (original, response) {

            var request = JSON.parse(original.data);
            var authUserId = request.authUser;
            var authOrg = request.authOrg;
            var copy = request.copy;
            if (copy) {
                var id = request.id;
                var templateData = templateListData.appTemplates;
                var oldTemplate = null;
                if (templateData.length > 0) {
                    for (var i = 0; i < templateData.length; i++) {
                        if (id === templateData[i].templateId) {
                            oldTemplate = templateData[i];
                        }
                    }
                }
                if (oldTemplate) {
                    var newTemplate = {};
                    newTemplate.id = "templateId" + (templateData.length + 1);
                    newTemplate.name = oldTemplate.name;
                    newTemplate.published = oldTemplate.published;
                    newTemplate.logoIndex = oldTemplate.logoIndex;

                    newTemplate.templateId = "templateId" + (templateData.length + 1);
                    newTemplate.templateName = copy.name;
                    newTemplate.templateDesc = copy.desc;
                    newTemplate.state = oldTemplate.state;
                    newTemplate.vdcId = oldTemplate.vdcId;
                    newTemplate.userId = oldTemplate.userId;
                    newTemplate.createTime = oldTemplate.createTime;
                    newTemplate.resPoolType = oldTemplate.resPoolType;
                    newTemplate.image = copy.resourcePic;
                    templateData.push(newTemplate);
                }
                templateListData.totalRecord = templateListData.totalRecord + 1;
                response(200, "success", [], {});
            }
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/{vdcId}/apptemplates/{id}": function (original, response) {
            var authUserId = original.data.authUser;
            var vdcId = original.data.vdcId;
            var id = original.data.id;
            var templateData = templateListData.appTemplates;
            var delIndex = -1;
            if (templateData.length > 0) {
                for (var i = 0; i < templateData.length; i++) {
                    if (templateData[i] && (templateData[i].templateId === id)) {
                        delIndex = i;
                        break;
                    }
                }
                if (delIndex > 0) {
                    templateData.splice(delIndex, 1);
                    templateListData.total = templateListData.appTemplates.length;
                }
            }
            response(200, "success", [], {});
        },
        "PUT /goku/rest/v1.5/vdcs/{authOrg}/apptemplates/{id}/state": function (original, response) {
            var authOrg = original.data.authOrg;
            var id = original.data.id;
            var authUser = original.data.authUser;
            var state = original.data.state;
            response(200, "success", [], {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates?cloud-infra={cloud_infra_id}&status={status}&limit={limit}&start={start}": function (original, response) {
            response(200, "success", availableVmTemplates, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vm-flavors?cloud-infra={cloud_infra_id}&limit={limit}&start={start}": function (original, response) {
            response(200, "success", availableSpecs, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/softwares": function (original, response) {
            response(200, "success", availableSoftPacks, {});
        },
        "GET /uportal/app/availableSoftPacks/details": function (original, response) {
            var id = original.data.id;
            response(200, "success", softpackDetails[id], {});
        },
        "GET /uportal/app/availableShells": function (original, response) {
            response(200, "success", availableShells, {});
        },
        "GET /uportal/app/availableShells/details": function (original, response) {
            var id = original.data.id;
            response(200, "success", softShellDetails[id], {});
        },
        "GET /uportal/app/customAvailableVm": function (original, response) {
            response(200, "success", customAvailableVm, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function (original, response) {
            var resFraId = original.data.cloud_infras_id;
            for (var resCloudId in resCloud_vpc_map){
                if (resFraId === resCloudId){
                    response(200, "success", resCloud_vpc_map[resCloudId], {});
                }
            }
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks": function (original, response) {
            var vpcId = original.data.vpcid;
            if ("001" === vpcId) {
                response(200, "success", networkListByVpc, {});
            }
            else {
                response(200, "success", networkListByVpc2, {});
            }
        },
        "GET /uportal/app/statistic": function (original, response) {
            response(200, "success", appStatistics, {});
        },
        "GET /uportal/template/statistic": function (original, response) {
            response(200, "success", templateStatistics, {});
        },
        "GET /uportal/app/deploy/baseInfo": function (original, response) {
            response(200, "success", baseInfo, {});
        },
        "GET /uportal/app/deploy/resources": function (original, response) {
            response(200, "success", deployResources, {});
        },
        "GET /uportal/app/deploy/output": function (original, response) {
            response(200, "success", outputs, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/reports?cloud-infra={cloud_infra_id}": function (original, response) {
            var start = original.data.mark;
            var limit = original.data.limit;
            var end;
            var array;
            var i;
            end = start + limit;
            end = Math.min(end, 15);
            array = [];
            for (i = start; i < end; i++) {
                array.push({
                    createBeginTime: "2014-07-12 05:47:45",
                    createEndTime: "2014-07-12 05:54:08",
                    desc: null,
                    failedReason: null,
                    resourceName: "DonnotDel" + i,
                    resourceType: "Instance",
                    status: "CREATE_COMPLETE"
                });
            }
            reports.resourceDeployReports = array;
            response(200, "success", reports, {});

        },
        "GET /uportal/app/networkByVpcs": function (original, response) {
            response(200, "success", vpcNetworkMap, {});
        },
        "GET /uportal/app/availableSpecsByTemplates": function (original, response) {
            response(200, "success", availableSpecsByTemplates, {});
        },
        "GET /uportal/app/availableSpecsByTemp": function (original, response) {
            var templateId = original.data.selectTemplateId;
            response(200, "success", availableSpecsByTemplates[templateId], {});
        },
        "GET /uportal/app/vlbTemplates": function (original, response) {
            response(200, "success", vlbTemplates, {});
        },
        "GET /uportal/app/AvailableVlbTemp": function (original, response) {
            response(200, "success", availabelVlbs, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/elbs": function (original, response) {
            response(200, "success", availableVlb, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/users/action": function (original, response) {
            response(200, "success", getUserListResponse, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcId}/apps/{id}/user/{targetuserid}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        //查询关联虚拟机
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcId}/apps/{id}/basicinfo?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", appBasicInfoResource2, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apps/{id}/resources?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", appDeployResources, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apps/{id}/outputs?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", appDeployOutputs, {});
        },

        "POST /goku/rest/v1.5/all/apptemplates/validation": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/11001/contents": function (original, response) {
            var result ={
                "name":"SimpleApp_Single_Instance","picture":"buff01.jpg","resPoolType":"FusionManager",
                "vdcId":"all","desc":"SimpleApp_Single_Instance",
                "body":"eyJUZW1wbGF0ZU5hbWUiOiJTaW1wbGVBcHBfU2luZ2xlX0luc3RhbmNlIiwiVGVtcGxhdGVGb3JtYXRWZXJzaW9uIjoiIiwiRGVzY" +
                    "3JpcHRpb24iOiJTaW1wbGVBcHBfU2luZ2xlX0luc3RhbmNlIiwiUGFyYW1ldGVycyI6e30sIlJlc291cmNlcyI6eyJBTUVfaWRfNDQxNTQyNDExMCI6eyJ" +
                    "OYW1lIjoiTmV0d29ya181IiwiVHlwZSI6IkdNOjpOZXR3b3JrIiwiR3JhcGgiOnsiUGFyZW50SUQiOiIxIiwiUG9zaXRpb24iOnsiWCI6IjM5MCIsIlkiOiI3" +
                    "MCJ9LCJTaXplIjp7IlciOiIxNTAiLCJIIjoiNDAifX0sIlByb3BlcnRpZXMiOnsiTmFtZSI6Ik5ldHdvcmtfNSIsIkRlc2NyaXB0aW9uIjoiIiwiTmV0d29ya0" +
                    "lEIjoiIn19LCJBTUVfaWRfNDQxNTQyNDQxMSI6eyJOYW1lIjoiVm1UZW1wbGF0ZV82IiwiVHlwZSI6IkdNOjpWbVRlbXBsYXRlIiwiR3JhcGgiOnsiUGFyZW50" +
                    "SUQiOiIxIiwiUG9zaXRpb24iOnsiWCI6IjM4MCIsIlkiOiIyMDAifSwiU2l6ZSI6eyJXIjoiMTcwIiwiSCI6IjcwIn19LCJQcm9wZXJ0aWVzIjp7IlZtVGVtc" +
                    "GxhdGVJRCI6IiIsIlZtVGVtcGF0ZU5hbWUiOiIiLCJOYW1lIjoiVm1UZW1wbGF0ZV82IiwiRGVzY3JpcHRpb24iOiIiLCJDb21wdXRlck5hbWUiOiIiLCJDU" +
                    "FUiOiIiLCJNZW1vcnkiOiIiLCJPU1R5cGUiOiJOb3ZlbGwgU1VTRSBMaW51eCIsIk9TVmVyc2lvbiI6Ik5vdmVsbCBTVVNFIExpbnV4IEVudGVycHJpc2UgU" +
                    "2VydmVyIDExIFNQMSAzMmJpdCIsIlVwZGF0ZU1vZGUiOiJhdXRvIiwiQmxvY2tIZWF0VHJhbmZlciI6InVuU3VwcG9ydCIsIk5pY3MiOlt7Ik5hbWUiOiJEZWZ" +
                    "hdWx0TmljIiwiTmV0d29ya0lEIjp7IlJlZiI6WyJBTUVfaWRfNDQxNTQyNDExMCIsIk5ldHdvcmtJRCJdfSwiU3lzdGVtRGVmYXVsdCI6InRydWUiLCJWbGIiOiJ" +
                    "mYWxzZSJ9XSwiVm9sdW1lcyI6W10sIlNvZnR3YXJlcyI6W10sIlBvc3RDb21tYW5kcyI6W10sIlJlbGVhc2VDb21tYW5kcyI6W10sIlN0YXJ0Q29tbWFuZHMiOltd" +
                    "LCJTdG9wQ29tbWFuZHMiOltdfX0sIkFNRV9pZF80NDE1NDI0OTE0Ijp7Ik5hbWUiOiJWbVRlbXBsYXRlXzYiLCJUeXBlIjoiR006Okluc3RhbmNlIiwiR3JhcGgiOnt" +
                    "9LCJQcm9wZXJ0aWVzIjp7Ik5hbWUiOiJWbVRlbXBsYXRlXzYiLCJWbVRlbXBsYXRlSUQiOnsiUmVmIjpbIkFNRV9pZF80NDE1NDI0NDExIiwiUGh5c2ljYWxJRCJdfSwi" +
                    "RGVzY3JpcHRpb24iOiIifX19LCJPdXRwdXRzIjp7fSwiQ29ubmVjdGlvbnMiOlt7IklkIjoiQU1FX2lkXzQ0MTU0MjQ1MTMiLCJUeXBlIjoiUmVhbExpbmUiLCJGcm9tIjoiQU" +
                    "1FX2lkXzQ0MTU0MjQ0MTEiLCJUbyI6IkFNRV9pZF80NDE1NDI0MTEwIn1dLCJJY29uIjoiYnVmZjAxLmpwZyJ9"
            }
                response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/{id}/contents": function (original, response) {
            var result ={
                "name":"AutoScaling","picture":"buff01.jpg","resPoolType":"FusionManager","vdcId":"all",
                "desc":"AutoScaling","body":"eyJOYW1lIjoiQXV0b1NjYWxpbmciLCJUZW1wbGF0ZUZvcm1hdFZlcnNpb24iOiIiLCJ" +
                    "EZXNjcmlwdGlvbiI6IkF1dG9TY2FsaW5nIiwiUGFyYW1ldGVycyI6e30sIlJlc291cmNlcyI6eyJBTUVfaWRfNDQxNT" +
                    "Q4NTUxNSI6eyJOYW1lIjoiTmV0d29ya183IiwiVHlwZSI6IkdNOjpOZXR3b3JrIiwiR3JhcGgiOnsiUGFyZW50SUQiOiIx" +
                    "IiwiUG9zaXRpb24iOnsiWCI6IjE3MCIsIlkiOiI2MCJ9LCJTaXplIjp7IlciOiIxNTAiLCJIIjoiNDAifX0sIlByb3BlcnR" +
                    "pZXMiOnsiTmFtZSI6Ik5ldHdvcmtfNyIsIkRlc2NyaXB0aW9uIjoiIiwiTmV0d29ya0lEIjoiIn19LCJBTUVfaWRfNDQxNTQ" +
                    "4NTkxNiI6eyJOYW1lIjoiREIiLCJUeXBlIjoiR006OlZtVGVtcGxhdGUiLCJHcmFwaCI6eyJQYXJlbnRJRCI6IjEiLCJQb3N" +
                    "pdGlvbiI6eyJYIjoiMTcwIiwiWSI6IjE3MCJ9LCJTaXplIjp7IlciOiIxNzAiLCJIIjoiOTAifX0sIlByb3BlcnRpZXMiOnsiV" +
                    "m1UZW1wbGF0ZUlEIjoiIiwiVm1UZW1wYXRlTmFtZSI6IiIsIk5hbWUiOiJEQiIsIkRlc2NyaXB0aW9uIjoiIiwiQ29tcHV0ZXJOYW" +
                    "1lIjoiIiwiQ1BVIjoiIiwiTWVtb3J5IjoiIiwiT1NUeXBlIjoiTm92ZWxsIFNVU0UgTGludXgiLCJPU1ZlcnNpb24iOiJOb3Zlb" +
                    "GwgU1VTRSBMaW51eCBFbnRlcnByaXNlIFNlcnZlciAxMSBTUDEgMzJiaXQiLCJVcGRhdGVNb2RlIjoiYXV0byIsIkJsb2NrSGV" +
                    "hdFRyYW5mZXIiOiJ1blN1cHBvcnQiLCJOaWNzIjpbeyJOYW1lIjoiRGVmYXVsdE5pYyIsIk5ldHdvcmtJRCI6eyJSZWYiOlsiQU" +
                    "1FX2lkXzQ0MTU0ODU1MTUiLCJOZXR3b3JrSUQiXX0sIlN5c3RlbURlZmF1bHQiOiJ0cnVlIiwiVmxiIjoiZmFsc2UifV0sIlZvb" +
                    "HVtZXMiOltdLCJTb2Z0d2FyZXMiOlt7IklkIjoiQU1FX2lkXzQ0MTU1MjA0MiIsIk5hbWUiOiJTb2Z0d2FyZV8xNSIsIlR5cGUi" +
                    "OiJTb2Z0d2FyZSIsIlBhY2thZ2VJRCI6IiIsIkRlc2NyaXB0aW9uIjoiIiwiVmVyc2lvbiI6IiIsIk9TVHlwZSI6IiIsIlBhY2th" +
                    "Z2VUeXBlIjoiIiwiUHJvdmlkZXIiOiIiLCJTdWJGaWxlUGF0aCI6IiIsIkRlc3RpbmF0aW9uUGF0aCI6IiIsIkluc3RhbGxDb21t" +
                    "YW5kcyI6IiIsIlVuaW5zdGFsbENvbW1hbmRzIjoiIiwiU3RhcnRDb21tYW5kcyI6IiIsIlN0b3BDb21tYW5kcyI6IiIsIkluc3Rh" +
                    "bGxQYXJhbXMiOltbXV0sIlVuaW5zdGFsbFBhcmFtcyI6W1tdXSwiU3RhcnRQYXJhbXMiOltbXV0sIlN0b3BQYXJhbXMiOltbXV19X" +
                    "SwiUG9zdENvbW1hbmRzIjpbXSwiUmVsZWFzZUNvbW1hbmRzIjpbXSwiU3RhcnRDb21tYW5kcyI6W10sIlN0b3BDb21tYW5kcyI6W1" +
                    "19fSwiQU1FX2lkXzQ0MTU0OTU1MjEiOnsiTmFtZSI6Ik5ldHdvcmtfOSIsIlR5cGUiOiJHTTo6TmV0d29yayIsIkdyYXBoIjp7IlBh" +
                    "cmVudElEIjoiMSIsIlBvc2l0aW9uIjp7IlgiOiI0NTAiLCJZIjoiNjAifSwiU2l6ZSI6eyJXIjoiMTUwIiwiSCI6IjQwIn19LCJQcm9w" +
                    "ZXJ0aWVzIjp7Ik5hbWUiOiJOZXR3b3JrXzkiLCJEZXNjcmlwdGlvbiI6IiIsIk5ldHdvcmtJRCI6IiJ9fSwiQU1FX2lkXzQ0MTU1MDI" +
                    "wMjQiOnsiTmFtZSI6IldlYiIsIlR5cGUiOiJHTTo6Vm1UZW1wbGF0ZSIsIkdyYXBoIjp7IlBhcmVudElEIjoiMSIsIlBvc2l0aW9uIj" +
                    "p7IlgiOiI0NjAiLCJZIjoiMTcwIn0sIlNpemUiOnsiVyI6IjE3MCIsIkgiOiIxMzUifX0sIlByb3BlcnRpZXMiOnsiVm1UZW1wbGF0ZU" +
                    "lEIjoiIiwiVm1UZW1wYXRlTmFtZSI6IiIsIk5hbWUiOiJXZWIiLCJEZXNjcmlwdGlvbiI6IiIsIkNvbXB1dGVyTmFtZSI6IiIsIkNQVS" +
                    "I6IiIsIk1lbW9yeSI6IiIsIk9TVHlwZSI6Ik5vdmVsbCBTVVNFIExpbnV4IiwiT1NWZXJzaW9uIjoiTm92ZWxsIFNVU0UgTGludXggRW" +
                    "50ZXJwcmlzZSBTZXJ2ZXIgMTEgU1AxIDMyYml0IiwiVXBkYXRlTW9kZSI6ImF1dG8iLCJCbG9ja0hlYXRUcmFuZmVyIjoidW5TdXBwb3J" +
                    "0IiwiTmljcyI6W3siTmFtZSI6IkRlZmF1bHROaWMiLCJOZXR3b3JrSUQiOnsiUmVmIjpbIkFNRV9pZF80NDE1NDk1NTIxIiwiTmV0d29ya" +
                    "0lEIl19LCJTeXN0ZW1EZWZhdWx0IjoidHJ1ZSIsIlZsYiI6ImZhbHNlIn0seyJOYW1lIjoiZGJuaWMiLCJOZXR3b3JrSUQiOnsiUmVmIjp" +
                    "bIkFNRV9pZF80NDE1NDg1NTE1IiwiTmV0d29ya0lEIl19LCJTeXN0ZW1EZWZhdWx0IjoiIiwiVmxiIjoiZmFsc2UifV0sIlZvbHVtZXMiO" +
                    "ltdLCJTb2Z0d2FyZXMiOlt7IklkIjoiQU1FX2lkXzQ0MTU1MjM0MyIsIk5hbWUiOiJTb2Z0d2FyZV8xNiIsIlR5cGUiOiJTb2Z0d2FyZSI" +
                    "sIlBhY2thZ2VJRCI6IiIsIkRlc2NyaXB0aW9uIjoiIiwiVmVyc2lvbiI6IiIsIk9TVHlwZSI6IiIsIlBhY2thZ2VUeXBlIjoiIiwiUHJvdm" +
                    "lkZXIiOiIiLCJTdWJGaWxlUGF0aCI6IiIsIkRlc3RpbmF0aW9uUGF0aCI6IiIsIkluc3RhbGxDb21tYW5kcyI6IiIsIlVuaW5zdGFsbENvb" +
                    "W1hbmRzIjoiIiwiU3RhcnRDb21tYW5kcyI6IiIsIlN0b3BDb21tYW5kcyI6IiIsIkluc3RhbGxQYXJhbXMiOltbXV0sIlVuaW5zdGFsbFBhcm" +
                    "FtcyI6W1tdXSwiU3RhcnRQYXJhbXMiOltbXV0sIlN0b3BQYXJhbXMiOltbXV19LHsiSWQiOiJBTUVfaWRfNDQxNTUyNjQ0IiwiTmFtZSI6Il" +
                    "NjcmlwdF8xNyIsIlR5cGUiOiJTY3JpcHQiLCJQYWNrYWdlSUQiOiIiLCJEZXNjcmlwdGlvbiI6IiIsIlZlcnNpb24iOiIiLCJPU1R5cGUiOiIi" +
                    "LCJQYWNrYWdlVHlwZSI6IiIsIlByb3ZpZGVyIjoiIiwiU3ViRmlsZVBhdGgiOiIiLCJEZXN0aW5hdGlvblBhdGgiOiIiLCJJbnN0YWxsQ29tbW" +
                    "FuZHMiOiIiLCJVbmluc3RhbGxDb21tYW5kcyI6IiIsIlN0YXJ0Q29tbWFuZHMiOiIiLCJTdG9wQ29tbWFuZHMiOiIiLCJJbnN0YWxsUGFyYW1" +
                    "zIjpbW11dLCJVbmluc3RhbGxQYXJhbXMiOltbXV0sIlN0YXJ0UGFyYW1zIjpbW11dLCJTdG9wUGFyYW1zIjpbW11dfV0sIlBvc3RDb21tYW5k" +
                    "cyI6W10sIlJlbGVhc2VDb21tYW5kcyI6W10sIlN0YXJ0Q29tbWFuZHMiOltdLCJTdG9wQ29tbWFuZHMiOltdfX0sIkFNRV9pZF80NjE1NDM0Nj" +
                    "E3Ijp7Ik5hbWUiOiJTY2FsaW5nR3JvdXBfMjAiLCJUeXBlIjoiR006OlNjYWxpbmdHcm91cCIsIkdyYXBoIjp7fSwiUHJvcGVydGllcyI6eyJO" +
                    "YW1lIjoiU2NhbGluZ0dyb3VwXzIwIiwiRGVzY3JpcHRpb24iOiIiLCJNYXhTaXplIjoiMSIsIk1pblNpemUiOiIxIiwiRGVzaXJlZENhcGFjaXR" +
                    "5IjoiMSIsIkNvb2xkb3duIjoiIiwiVm1UZW1wbGF0ZUlEIjp7IlJlZiI6WyJBTUVfaWRfNDQxNTUwMjAyNCIsIlBoeXNpY2FsSUQiXX0sIlNjY" +
                    "WxpbmdQb2xpY2llcyI6W119fSwiQU1FX2lkXzQ2MTU0NTIxOCI6eyJOYW1lIjoiREIiLCJUeXBlIjoiR006Okluc3RhbmNlIiwiR3JhcGgiOnt" +
                    "9LCJQcm9wZXJ0aWVzIjp7Ik5hbWUiOiJEQiIsIlZtVGVtcGxhdGVJRCI6eyJSZWYiOlsiQU1FX2lkXzQ0MTU0ODU5MTYiLCJQaHlzaWNhbElEI" +
                    "l19LCJEZXNjcmlwdGlvbiI6IiJ9fX0sIk91dHB1dHMiOnt9LCJDb25uZWN0aW9ucyI6W3siSWQiOiJBTUVfaWRfNDQxNTQ5NTEyMCIsIlR5cGUi" +
                    "OiJSZWFsTGluZSIsIkZyb20iOiJBTUVfaWRfNDQxNTQ4NTkxNiIsIlRvIjoiQU1FX2lkXzQ0MTU0ODU1MTUifSx7IklkIjoiQU1FX2lkXzQ0MTU1" +
                    "MDM0MjYiLCJUeXBlIjoiUmVhbExpbmUiLCJGcm9tIjoiQU1FX2lkXzQ0MTU1MDIwMjQiLCJUbyI6IkFNRV9pZF80NDE1NDk1NTIxIn0seyJJZCI6I" +
                    "kFNRV9pZF80NDE1NTE3MzIiLCJUeXBlIjoiUmVhbExpbmUiLCJGcm9tIjoiQU1FX2lkXzQ0MTU1MDIwMjQiLCJUbyI6IkFNRV9pZF80NDE1NDg1N" +
                    "TE1In1dLCJJY29uIjoiYnVmZjAxLmpwZyJ9"
            }
                response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/scripts": function (original, response) {
            response(200, "success", scriptListInfo, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/{id}/files": function (original, response) {
            response(200, "success", exportResponse, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{id}?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function (original, response) {
            response(200, "success", azByVpc, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apps/{appId}/vms/monitor?cloud-infra={cloudInfraId}": function (original, response) {
            response(200, "success", appVmList4Monitor, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vms/{vmId}/processList": function(original, response){
            response(200, "success", processList4Monitor, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/vms/action?cloud-infra={cloud-infra}": function(original, response){
            response(200, "success", availableVm4Custom, {});
        },
        "GET /goku/rest/v1.5/1/apps/healthy?cloud-infra={cloudInfraId}": function(original, response){
            var data = {
                "normalNum": 242,
                "alarmNum": 267,
                "unKnownNum": 665,
                "noNum": 875,
                "normalPercent": 14,
                "alarmPercent": 26,
                "unKnownPercent": 37,
                "noPercent": 23
            };
            response(200, "success", data, {});
        },
        "PUT /goku/rest/v1.5/1/vpcs/{vpcId}/apps/{appId}?cloud-infra={cloudInfraId}": function(original, response){
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/1/vpcs/{vpcId}/apps/{appId}/action?cloud-infra={cloudInfraId}": function(original, response){
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vms/{vmId}/softwares/monitor?cloud-infra={cloudInfraId}": function(original, response){
            response(200, "success", processList4Monitor, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcId}/apps/{appId}/logs?cloud-infra={cloudInfraId}&status=&limit={limit}&start={start}": function(original, response){
            response(200, "success", appLogs, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/apps/{id}/monitors?cloud-infra={cloud_infra_id}": function(original, response){
            response(200, "success", appResourceMonitor, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/softwares/{processId}/monitor?pvmip={pvmip}&cloud-infra={cloudInfraId}&querydata=true": function (request, response) {
            response(200, "success", oneProcessMonitor, {});
        },

        //创建应用实例
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps?cloud-infra={cloud_infra_id}": function(original, response){

            var request = JSON.parse(original.data);

            var appInstanceInfo = {

                appId: "dd7c74af-20d2-4f5d-b607-9884b36af3a12fa1",
                appName: request.appName,
                createPercent: "100/100",
                creationBeginTime: "2014-04-17 06:43:11",
                creationEndTime: "2014-04-17 06:47:59",
                desc: request.desc,
                healthStatus: null,
                vdcId: "2",
                orgName: null,
                picture: "../theme/default/images/gm/appImage/buff01.jpg",
                status: "Creating",
                type: "TEMPLATE",
                userId: "4",
                userName: null,
                vpcId: request.vpcId,
                "vpcName": "vpc03"

            };

            cloud_apps_map.cloudInfra02.appInstances.push(appInstanceInfo);

            cloud_apps_map.cloudInfra02.total++;

            response(200, "success", {}, {});
        }
    });

    return fixture;
});
