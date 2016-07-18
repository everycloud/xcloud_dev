define(["can/util/fixture/fixture",
    "tiny-lib/underscore"], function (fixture, _) {
    var cloudInfras = [
        {
            id: "cloudInfra02",
            name: "FM resource pool",
            region: "xi'an",
            type: "openstack",
            version: "havana"
        },
        {
            id: "cloudInfra01",
            name: "FM resource pool",
            region: "shenzhen",
            type: "fusionmanager",
            version: "1.5.0"
        }
    ];


    var snapShot =
    {
        "current":
        {
            "id":"4629700416936869889$urn:sites:45040813:vms:i-000000DA:snapshots:3674",
            "name":"t",
            "description":null,
            "size":0,
            "createTime":null,
            "needMemoryShot":false,
            "includingMemorySnapshot":null,
            "childSnapshots":null,
            "status":null,
            "type":null
        },
        "snapshots":
        [
            {
                "id":"4629700416936869889$urn:sites:45040813:vms:i-000000DA:snapshots:2230",
                "name":"snapShot01",
                "description":null,
                "size":0,
                "createTime":"2014-12-12 07:27:18",
                "needMemoryShot":false,
                "includingMemorySnapshot":"",
                "childSnapshots":[],
                  /*  [
                        {
                            "id":"4629700416936869889$urn:sites:45040813:vms:i-000000DA:snapshots:2233",
                            "name":"snapShot01_A",
                            "description":null,
                            "size":0,
                            "createTime":"2014-12-12 07:28:52",
                            "needMemoryShot":false,
                            "includingMemorySnapshot":null,
                            "childSnapshots":
                                [
                                    {
                                        "id":"4629700416936869889$urn:sites:45040813:vms:i-000000DA:snapshots:3674",
                                        "name":"snapShot01_A_01",
                                        "description":null,
                                        "size":0,
                                        "createTime":"2014-12-31 07:45:09",
                                        "needMemoryShot":false,
                                        "includingMemorySnapshot":null,
                                        "childSnapshots":null,
                                        "status":"ready",
                                        "type":"normal"
                                    }
                                ],
                            "status":"ready",
                            "type":"normal"
                        }
                    ],*/
                "status":"ready",
                "type":"normal"
            }
        ]
    };



    var vmList = {
        "data": [
            {
                "id": "vm-01",
                "rid": "vm-rid-01",
                "resourcePoolId": "cloudInfra01",
                "name": "windows_2003_vmware01",
                "status": "running",
                "type": "fusionmanager",
                "availableZoneId": "az01",
                "availableZoneName": "shenzhen_AZ01",

                "createTime": "2013-12-30 10:10",
                "expiryTime": "2014-12-30 10:10",
                "creatorId": "user_hwz",
                "vdcId": "org001",
                "vappId": 0,
                "tag": "shenzhen",
                "osVersion": "SUSE11SP1 64bit",
                "vmSpecInfo": {
                    id: "VMconfigid01",

                    memoryRebootCount:4096,
                    cpuRebootCount:4,
                    volumes: [
                        {
                            name: "disk01",
                            size: 20.0
                        },
                        {
                            name: "disk02",
                            size: 30.0
                        }
                    ],
                    nics: [
                        {
                            name: "Network_card_01",
                            ip: "192.168.25.12",
                            mac: "12:22:AE:E2:33:22"
                        },
                        {
                            name: "Network_card_02",
                            ip: "192.168.13.13",
                            mac: "13:22:AE:E2:33:22"
                        }
                    ]
                }
            },
            {
                "id": "vm-02",
                "rid": "vm-rid-02",
                "resourcePoolId": "cloudInfra01",
                "name": "linux_vmware02",
                "status": "running",
                "type": "fusionmanager",
                "availableZoneId": "az01",
                "availableZoneName": "shenzhen_AZ02",
                "createTime": "2013-12-30 10:10",
                "expiryTime": "2014-12-30 10:10",

                "creatorId": "user_hwz",
                "vdcId": "org001",
                "tag": "xi'an",
                "vappId": 0,
                "osVersion": "SUSE11SP1 64bit",
                "vmSpecInfo": {
                    id: "VMconfigid01",
                    memoryRebootCount:2048,
                    cpuRebootCount:2,
                    volumes: [
                        {
                            name: "disk01",
                            size: 20.0
                        }
                    ],
                    nics: [
                        {
                            name: "Network_card_01",
                            ip: "192.168.72.12",
                            mac: "12:22:AE:E2:33:22"
                        }
                    ]
                }
            }
        ]
    };

    var vmDisks = [
        {
            name: "disk01",
            size: 10,
            volumeId: "diskId01",
            sequenceNum: 1,
            vmUsedSize: 5.3,
            volUsedSize: 10,
            type: "normal",
            configType: "thin",
            mediaType: "SAN-Any"
        },
        {
            name: "disk02",
            size: 20,
            volumeId: "diskId02",
            sequenceNum: 2,
            vmUsedSize: 15.3,
            volUsedSize: 20,
            type: "share",
            configType: "thickformat",
            mediaType: "SAN-SSD"
        },
        {
            name: "disk03",
            size: 30,
            volumeId: "diskId03",
            sequenceNum: 3,
            vmUsedSize: 25.3,
            volUsedSize: 25,
            type: "share",
            configType: "thick",
            mediaType: "SAN-SAS&FC"
        }
    ];

    var vmNics = [
        {
            name: "eth0",
            ip: "192.168.10.10",
            mac: "28:6e:d4:88:c6:5f",
            ipv6s: [],
            nicId: "nic0",
            networkId: "Eth001-Ext",
            networkName: "Eth001-Ext",
            networkType: "EXTERNAL",
            floatIp: "192.168.10.11",
            sgInfo: [
                {
                    sgId: "00001",
                    sgName: "securityGroup001"
                },
                {
                    sgId: "00002",
                    sgName: "securityGroup002"
                }
            ]
        },
        {
            name: "eth1",
            ip: "192.168.11.11",
            mac: "28:6e:d4:88:c6:6a",
            ipv6s: ["fe80:2aac:2100:a4ff:fee3:9566:300c:3262"],
            nicId: "nic1",
            networkId: "Eth001-Inner",
            networkName: "Eth001-Inner",
            networkType: "ORG_INTERNAL",
            floatIp: "192.168.11.12",
            sgInfo: [
                {
                    sgId: "00003",
                    sgName: "securityGroup003"
                },
                {
                    sgId: "00004",
                    sgName: "securityGroup004"
                }
            ]
        }
    ];

    var vmDetail = {
        id: "VM001",
        rid: "VM-rid001",
        resourcePoolId: "cloudInfra01",
        name: "windows_2003_vmware01",
        status: "stopped",
        type: "fusionmanager",
        availableZoneId: "az001",
        createTime: "2014-01-12 10:20:20",
        creatorId: "1",
        vdcId: "123",
        vpcId: "vpc001",
        tag: "shenzhen",
        osVersion: "SUSE11 SP1 64bit",
        description: "",
        password: "a#Sd24Jt",
        vmSpecInfo: {
            id: "flavorId1",
            cpuCount: 2,
            cpuRebootCount: 2,
            memoryCount: 2048,
            memoryRebootCount: 2048,
            volumes: [
                {
                    name: "disk01",
                    size: 20.0
                },
                {
                    name: "disk02",
                    size: 10.0
                }
            ],
            nics: [
                {
                    name: "eth0",
                    ip: "192.168.123.123",
                    mac: "A1D2C6CCF2DD"
                }
            ]
        },
        volumes: vmDisks,
        nics: vmNics,
        vncInfo: {
            ip: "192.168.22.22",
            port: "5801",
            password: "@WDF%#4"
        },
        snapshotCount: 4,
        domainId: "1",
        domainName: "default"
    };

    var vmTemplates = [
        {
            "vmtId": "001",
            "vmtName": "Windows Enterprise Desktop",
            "osType": "Windows",
            "osVersion": "Windows Server 2008 R2 Datacenter 64bit",
            "description": "Microsoft Windows Server 2008 R2 SP1 Datacenter edition, 64-bit architecture, Microsoft SQLServer 2008 Express, with IE8.",
            "picture": "../theme/default/images/vmTemplate/icon_vmtemplate_9.png",
            "vdcId": "1",
            "type": "Application template",
            "availableZoneId": "az01",
            "availableZoneName": "az01"
        },
        {   "vmtId": "002",
            "vmtName": "SUSE Linux Enterprise Desktop",
            "osType": "Linux",
            "osVersion": "Novell SUSE Linux Enterprise Server 11 SP2 64bit",
            "description": "SUSE Linux Enterprise Server 11 Service Pack 3 basic install, EBS boot with Amazon EC2 AMI Tools preinstalled.",
            "picture": "../theme/default/images/vmTemplate/icon_vmtemplate_1.png",
            "vdcId": "2",
            "type": "Application template",
            "availableZoneId": "az01",
            "availableZoneName": "az01"
        },
        {   "vmtId": "003",
            "vmtName": "RedHat Enterprise Desktop",
            "osType": "Linux",
            "osVersion": "Red Hat Enterprise Linux 6 64bit",
            "description": "Red Hat Enterprise Linux version 6.5 (HVM), EBS-backed.",
            "picture": "../theme/default/images/vmTemplate/icon_vmtemplate_3.png",
            "vdcId": "2",
            "type": "Application template",
            "availableZoneId": "az02",
            "availableZoneName": "az01"
        }
    ];

    var slas = [
        {
            id: "sla01",
            name: "SLA",
            value: "COPPER"
        },
        {
            id: "sla02",
            name: "SLA",
            value: "SILVER"
        },
        {
            id: "sla03",
            name: "SLA",
            value: "GOLD"
        }
    ];

    var configTemplates = [
        {
            "flavorId": "flavorId1",
            "name": "m1.tiny",
            "desc": "tiny规格",
            cpuCount: 1,
            memSize: 1024,
            extBootType: "LocalDisk",
            disks: [
                {
                    index: 0,
                    diskSize: 20
                }
            ],
            slaLabels: [
                {labelKey: "SLA", labelValue: "GOLD"}
            ],
            qos: {},
            systemDiskSize: 10
        },
        {
            "flavorId": "flavorId2",
            "name": "m1.medium",
            "desc": "m1.medium规格",
            cpuCount: 2,
            memSize: 2048,
            extBootType: "Volume",
            disks: [
                {
                    index: 0,
                    diskSize: 20
                },
                {
                    index: 1,
                    diskSize: 20
                }
            ],
            slaLabels: [
                {labelKey: "SLA", labelValue: "SILVER"}
            ],
            qos: {},
            systemDiskSize: 20
        },
        {
            "flavorId": "flavorId3",
            "name": "m1.large",
            "desc": "m1.large规格",
            cpuCount: 4,
            memSize: 4096,
            disks: [
                {
                    index: 0,
                    diskSize: 20
                },
                {
                    index: 1,
                    diskSize: 20
                },
                {
                    index: 2,
                    diskSize: 20
                }
            ],
            slaLabels: [],
            qos: {},
            systemDiskSize: 30
        }
    ];

    var vpc_cloud_Map = {
        "cloudInfra01": {
            "vpcs": [
                {
                    "vpcID": "001",
                    "name": "vpc001",
                    "availableZone": [
                        {id: "az001", name: "深圳AZ01"}
                    ],
                    "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxRoutedNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}
                },
                {
                    "vpcID": "002",
                    "name": "vpc002",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                },
                {
                    "vpcID": "003",
                    "name": "vpc003",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                }
            ],
            "total": 3
        },
        "cloudInfra02": {
            "vpcs": [
                {
                    "vpcID": "011",
                    "name": "myVpc001",
                    "availableZone": [
                        {id: "az001", name: "深圳AZ01"}
                    ]
                },
                {
                    "vpcID": "012",
                    "name": "myVpc002",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                },
                {
                    "vpcID": "013",
                    "name": "myVpc003",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                }
            ],
            "total": 3
        },
        "cloudInfra03": {
            "vpcs": [
                {
                    "vpcID": "021",
                    "name": "taVpc001",
                    "availableZone": [
                        {id: "az001", name: "深圳AZ01"}
                    ]
                },
                {
                    "vpcID": "022",
                    "name": "taVpc002",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                },
                {
                    "vpcID": "023",
                    "name": "taVpc003",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                }
            ],
            "total": 3
        },
        "cloudInfra04": {
            "vpcs": [
                {
                    "vpcID": "031",
                    "name": "niVpc001",
                    "availableZone": [
                        {id: "az001", name: "深圳AZ01"}
                    ]
                },
                {
                    "vpcID": "032",
                    "name": "niVpc002",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                },
                {
                    "vpcID": "033",
                    "name": "niVpc003",
                    "availableZone": [
                        {id: "az002", name: "深圳AZ02"}
                    ]
                }
            ],
            "total": 3}
    };

    var vpcInfoList = {
        "vpcs": [
            {
                "vpcID": "001",
                "name": "vpc001",
                "availableZone": [
                    {id: "az001", name: "深圳AZ01"}
                ],
                "vpcSpecTemplate": {"maxDirectNetworkNum": 200, "maxRoutedNetworkNum": 200, "maxVMNum": 200, "maxVCPUNum": 200, "maxMemoryCapacity": 200, "maxStorageCapacity": 200, "maxSecurityGroupNum": 200, "maxInternalNetworkNum": 200, "maxPublicIpNum": 200, "maxNetworkBandWidth": 4000, "priority": 1, "maxRxThroughput": 4000, "maxTxThroughput": 4000}
            },
            {
                "vpcID": "002",
                "name": "vpc002",
                "availableZone": [
                    {id: "az002", name: "深圳AZ02"}
                ]
            },
            {
                "vpcID": "003",
                "name": "vpc003",
                "availableZone": [
                    {id: "az002", name: "深圳AZ02"}
                ]
            }
        ]};

    var orgInfo = {
        vdcInfo: {
            allQuota: false,
            quotaInfo: [
                {
                    quotaName: "CPU",
                    limit: 100
                },
                {
                    quotaName: "MEMORY",
                    limit: 81920
                },
                {
                    quotaName: "STORAGE",
                    limit: 5120
                },
                {
                    quotaName: "VM",
                    limit: 28
                }
            ],
            quotaUsage: [
                {
                    quotaName: "CPU",
                    value: 10
                },
                {
                    quotaName: "MEMORY",
                    value: 5600
                },
                {
                    quotaName: "STORAGE",
                    value: 3072
                },
                {
                    quotaName: "VM",
                    value: 0
                }
            ]
        }
    };

    var sharedNetworkInfo = {
        "sharedNetworks": [
            {
                "azID": "4616189618054758401",
                "azName": "az001",
                "network": {
                    "networkID": "network01",
                    "vpcID": "4792750811720056837",
                    "azID": null,
                    "tenantID": "1",
                    "userID": null,
                    "name": "14",
                    "description": null,
                    "networkType": 3,
                    "vlan": 1910,
                    "totalBoundNics": 0,
                    "ipv4Subnet": {
                        "ipAllocatePolicy": 3,
                        "subnetAddr": "192.168.50.0",
                        "subnetPrefix": "255.255.255.0",
                        "gateway": "192.168.50.1",
                        "availableIPRanges": [
                            {
                                "startIp": "192.168.50.5",
                                "endIp": "192.168.50.254"
                            }
                        ],
                        "dhcpOption": {
                            "domainName": null,
                            "primaryDNS": null,
                            "secondaryDNS": null,
                            "primaryWINS": null,
                            "secondaryWINS": null
                        },
                        "totalAddrNum": 250,
                        "usedAddrNum": 0
                    },
                    "ipv6Subnet": null,
                    "routed": true,
                    "status": 0,
                    "portSetting": {
                        "inTrafficShapingPolicyFlag": false,
                        "inTrafficShapingPolicy": {
                            "averageBandwidth": 0,
                            "peakBandwidth": 0,
                            "burstSize": 0
                        },
                        "outTrafficShapingPolicyFlag": false,
                        "outTrafficShapingPolicy": {
                            "averageBandwidth": 0,
                            "peakBandwidth": 0,
                            "burstSize": 0,
                            "priority": null
                        },
                        "arpPacketSuppression": null,
                        "ipPacketSuppression": null,
                        "dhcpIsolationFlag": false,
                        "ipMacBindFlag": false
                    },
                    "snatID": null
                }
            },
            {
                "azID": "4616189618054758402",
                "azName": "az002",
                "network": {
                    "networkID": "network02",
                    "vpcID": "4792750811720056834"
                }
            }
        ]
    };

    var networkInfo = {
        networks: [
            {
                networkID: "network01",
                azID: "az01",
                name: "Network_AZ01",
                description: "",
                networkType: 3,
                vlan: 2,
                status: "READY",
                ipv4Subnet: {
                    subnetAddr: "192.168.201.0",
                    subnetPrefix: "255.255.255.0",
                    gateway: "192.168.201.1",
                    ipAllocatePolicy: 1,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    dhcpOption: {
                        domainName: "domain01",
                        primaryDNS: "192.168.201.11",
                        secondaryDNS: "192.168.201.12",
                        primaryWINS: "192.168.201.13",
                        secondaryWINS: "192.168.201.14"
                    }
                },
                ipv6Subnet: null,
                totalBoundNics: 5,
                azName: "SHENZHEN_AZ01"
            },
            {
                networkID: "network02",
                azID: "az02",
                name: "Network_AZ02",
                networkType: 2,
                vlan: 3,
                status: "READY",
                ipv4Subnet: null,
                ipv6Subnet: {
                    subnetAddr: "fe80:2aac:2100:a4ff:fee3:9566:300c:0",
                    subnetPrefix: "24",
                    gateway: "fe80:2aac:2100:a4ff:fee3:9566:300c:3261",
                    ipAllocatePolicy: 3,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    dhcpOption: {
                        domainName: "domain02",
                        primaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3262",
                        secondaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3263",
                        primaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3264",
                        secondaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3265"
                    }
                },
                totalBoundNics: 2,
                azName: "SHENZHEN_AZ02"
            },
            {
                networkID: "network03",
                azID: "az03",
                name: "Network_AZ03",
                networkType: 1,
                status: "READY",
                vlan: 4,
                ipv4Subnet: {
                    subnetAddr: "192.168.201.0",
                    subnetPrefix: "255.255.255.0",
                    gateway: "192.168.201.1",
                    ipAllocatePolicy: 1,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
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
                    ipAllocatePolicy: 3,
                    "totalAddrNum": 10,
                    "usedAddrNum": 3,
                    dhcpOption: {
                        domainName: "domain02",
                        primaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3262",
                        secondaryDNS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3263",
                        primaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3264",
                        secondaryWINS: "fe80:2aac:2100:a4ff:fee3:9566:300c:3265"
                    }
                },
                totalBoundNics: 4,
                azName: "SHENZHEN_AZ03"
            }
        ]
    };

    //虚拟机快照
    var vmSnapshots = [
        {
            id: "id1",
            pId: "0",
            name: "快照01",
            open: true,
            memorySnapshot: "否",
            backupSnapshot: "否",
            status: "创建成功",
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            description: "描述01"
        },
        {
            id: "id2",
            pId: "id1",
            name: "快照02",
            open: true,
            memorySnapshot: "否",
            backupSnapshot: "否",
            status: "创建成功",
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            description: "描述02"
        },
        {
            id: "id31",
            pId: "id2",
            name: "快照03-0",
            open: true,
            memorySnapshot: "否",
            backupSnapshot: "否",
            status: "创建成功",
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            description: "描述03-0"
        },
        {
            id: "id3",
            pId: "id2",
            name: "快照03",
            open: true,
            memorySnapshot: "否",
            backupSnapshot: "否",
            status: "创建成功",
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            description: "描述03"
        },
        {
            id: "id4",
            pId: "id3",
            name: "当前位置",
            current: true,
            memorySnapshot: "否",
            backupSnapshot: "否",
            status: "创建成功",
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            description: "当前位置"
        }
    ];

    var curSnapshot = {
        id: "id5",
        name: "当前快照",
        description: "当前快照",
        size: 15,
        createTime: "2014-02-26 11:55:30 UTC+08:00",
        needMemoryShot: false,
        isConsistent: false,
        childSnapshots: null
    };

    var vmSnapshots01 = [
        {
            id: "id1",
            name: "快照01",
            description: "描述01",
            size: 11,
            createTime: "2014-02-26 11:55:30 UTC+08:00",
            needMemoryShot: false,
            isConsistent: false,
            open: true,
            childSnapshots: [
                {
                    id: "id2",
                    name: "快照02",
                    description: "描述02",
                    size: 12,
                    createTime: "2014-02-26 11:55:30 UTC+08:00",
                    needMemoryShot: false,
                    isConsistent: false,
                    childSnapshots: [
                        {
                            id: "id3",
                            name: "快照03",
                            description: "描述03",
                            size: 13,
                            createTime: "2014-02-26 11:55:30 UTC+08:00",
                            needMemoryShot: false,
                            isCurrent: true,
                            isConsistent: false,
                            childSnapshots: null
                        },
                        {
                            id: "id4",
                            name: "快照04",
                            description: "描述04",
                            size: 14,
                            createTime: "2014-02-26 11:55:30 UTC+08:00",
                            needMemoryShot: false,
                            isConsistent: false,
                            childSnapshots: [curSnapshot]
                        }
                    ]
                },
                {
                    id: "id2_2",
                    name: "快照02_2",
                    description: "描述02_2",
                    size: 12,
                    createTime: "2014-02-26 11:55:30 UTC+08:00",
                    needMemoryShot: false,
                    isConsistent: false,
                    childSnapshots: [
                        {
                            id: "id5",
                            name: "快照05",
                            description: "描述05",
                            size: 153,
                            createTime: "2014-02-26 11:55:30 UTC+08:00",
                            needMemoryShot: false,
                            isConsistent: false,
                            childSnapshots: null
                        }
                    ]
                }
            ]
        }
    ];

    // 虚拟机监控相关
    var oneProcessMonitor = {
        "metrics": [
            {
                "metricData": {
                    "metricName": "cpu",
                    "metricId": "001",
                    "resourceId": "resourceId001",
                    "metricUnit": "%",
                    "dataPoints": [
                        {
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
                        }
                    ]
                }
            },
            {
                "metricData": {
                    "metricName": "mem",
                    "metricId": "002",
                    "resourceId": "resourceId002",
                    "metricUnit": "%",
                    "dataPoints": [
                        {
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
                        }
                    ]
                }
            }
        ]
    };

    var businessProcessAlert = {
        alertDefinitionConfig: {
            "name": "alertName",
            "description": "xxxx",
            "priority": 1,
            "active": true,
            "alertConditionMode": "comparator",    // 条件比较方式:(comparator / valuechange)
            "comparatorMode": ">=",        //比较方式：如果alertConditionMode = comparator时为必选项
            "comparatorValue": "20",       //比较阈值： 如果conditionMode = comparator时为必选项
            "alertEnableActionMode": "period",   //触发动作方式:(once / period)
            "periodTime": 5,               //时长， 如果AlertEnableActionMode = period时为必选项
            "count": 5,                     //指定时间段内出现超出阈值的次数，如果AlertEnableActionMode = period时为必选项
            "periodUnit": ""               //单位：minutes, hours, days, weeks. 如果AlertEnableActionMode = period时为必选项
        }
    };

    var processList4Monitor = {
        "softwareResources": [
            {
                "softwareId": "process001",
                "softwareName": "Apache Tomcat 7.0"
            },
            {
                "softwareId": "process002",
                "softwareName": "office 2007"
            },
            {
                "softwareId": "process003",
                "softwareName": "Sql server 2007"}
        ]
    };
    var vmMonitorReosurceHistory = {
        "objectId": "4629700416936869889$urn:sites:486B08B3:vms:i-00000099",
        "hostoryMonitorMap": {
            "cpu_ready_time": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "disk_read_delay": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "disk_usage": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "disk_write_delay": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "disk_in_ps": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "cpu_usage": [
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
                    "value": "0.62"
                },
                {
                    "time": "1403395200000",
                    "value": "0.71"
                },
                {
                    "time": "1403481600000",
                    "value": "0.46"
                },
                {
                    "time": "1403568000000",
                    "value": "0.52"
                },
                {
                    "time": "1403654400000",
                    "value": "0.51"
                }
            ],
            "disk_io_out": [
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
                    "value": "36.38"
                },
                {
                    "time": "1403395200000",
                    "value": "0.76"
                },
                {
                    "time": "1403481600000",
                    "value": "0.61"
                },
                {
                    "time": "1403568000000",
                    "value": "1.35"
                },
                {
                    "time": "1403654400000",
                    "value": "0.24"
                }
            ],
            "nic_byte_out": [
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
                    "value": "0.00"
                },
                {
                    "time": "1403395200000",
                    "value": "0.00"
                },
                {
                    "time": "1403481600000",
                    "value": "0.00"
                },
                {
                    "time": "1403568000000",
                    "value": "0.00"
                },
                {
                    "time": "1403654400000",
                    "value": "0.00"
                }
            ],
            "disk_out_ps": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ],
            "nic_byte_in": [
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
                    "value": "0.00"
                },
                {
                    "time": "1403395200000",
                    "value": "0.00"
                },
                {
                    "time": "1403481600000",
                    "value": "0.00"
                },
                {
                    "time": "1403568000000",
                    "value": "0.00"
                },
                {
                    "time": "1403654400000",
                    "value": "0.00"
                }
            ],
            "mem_usage": [
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
                    "value": "29.14"
                },
                {
                    "time": "1403395200000",
                    "value": "29.15"
                },
                {
                    "time": "1403481600000",
                    "value": "29.03"
                },
                {
                    "time": "1403568000000",
                    "value": "29.08"
                },
                {
                    "time": "1403654400000",
                    "value": "28.91"
                }
            ],
            "disk_io_in": [
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
                    "value": "23.64"
                },
                {
                    "time": "1403395200000",
                    "value": "2.27"
                },
                {
                    "time": "1403481600000",
                    "value": "2.04"
                },
                {
                    "time": "1403568000000",
                    "value": "4.28"
                },
                {
                    "time": "1403654400000",
                    "value": "2.33"
                }
            ],
            "logic_disk_usage": [
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
                    "value": "86.11"
                },
                {
                    "time": "1403395200000",
                    "value": "87.20"
                },
                {
                    "time": "1403481600000",
                    "value": "87.20"
                },
                {
                    "time": "1403568000000",
                    "value": "87.20"
                },
                {
                    "time": "1403654400000",
                    "value": "87.20"
                }
            ]
        }
    };
    var vmProcessList = {
        softwareResources: [
            {
                "softwareId": "process001",
                "softwareName": "Apache Tomcat 7.0"
            },
            {
                "softwareId": "process002",
                "softwareName": "office 2007"
            },
            {
                "softwareId": "process003",
                "softwareName": "Sql server 2007"
            }
        ]
    };

    var all_process_monitor_map = {
        "process001": [
            {
                "metricId": "metricCpu001",
                "metricName": "CPU利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 1000],
                    [1403107200000, 6],
                    [1403193600000, 23],
                    [1403280000000, 76],
                    [1403366400000, 300],
                    [1403452800000, 4],
                    [1403539200000, 87]
                ]
            },
            {
                "metricId": "metricMem001",
                "metricName": "内存利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 20],
                    [1403107200000, 455],
                    [1403193600000, 4],
                    [1403280000000, 54],
                    [1403366400000, 45],
                    [1403452800000, 44],
                    [1403539200000, 847]
                ]
            },
            {
                "metricId": "metricDisk001",
                "metricName": "磁盘利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 353],
                    [1403107200000, 535],
                    [1403193600000, 535],
                    [1403280000000, 34],
                    [1403366400000, 4],
                    [1403452800000, 44],
                    [1403539200000, 847]
                ]
            }
        ],
        "process002": [
            {
                "metricId": "metricCpu001",
                "metricName": "CPU利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 1000],
                    [1403107200000, 6],
                    [1403193600000, 23],
                    [1403280000000, 76],
                    [1403366400000, 300],
                    [1403452800000, 4],
                    [1403539200000, 87]
                ]
            },
            {
                "metricId": "metricMem001",
                "metricName": "内存利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 20],
                    [1403107200000, 455],
                    [1403193600000, 4],
                    [1403280000000, 54],
                    [1403366400000, 45],
                    [1403452800000, 44],
                    [1403539200000, 847]
                ]
            }
        ],
        "process003": [
            {
                "metricId": "metricDisk001",
                "metricName": "磁盘利用率",
                "unit": "%",
                "metricValue": [
                    [1403020800000, 353],
                    [1403107200000, 535],
                    [1403193600000, 535],
                    [1403280000000, 34],
                    [1403366400000, 4],
                    [1403452800000, 44],
                    [1403539200000, 847]
                ]
            }
        ]
    };

    var allVmProcessMonitor = {
        "cpuRate": [
            [1403020800000, 1000],
            [1403107200000, 6],
            [1403193600000, 23],
            [1403280000000, 76],
            [1403366400000, 300],
            [1403452800000, 4],
            [1403539200000, 87]
        ],
        "memRate": [
            [1403020800000, 20],
            [1403107200000, 455],
            [1403193600000, 4],
            [1403280000000, 54],
            [1403366400000, 45],
            [1403452800000, 44],
            [1403539200000, 847]
        ],
        "diskRate": [
            [1403020800000, 353],
            [1403107200000, 535],
            [1403193600000, 535],
            [1403280000000, 34],
            [1403366400000, 4],
            [1403452800000, 44],
            [1403539200000, 847]
        ]
    };

    //物理机相关
    var hosts = [
        {
            id: "B-00000022",
            name: "B-00000022",
            status: "运行中",
            ip: "192.168.40.159",
            model: "Huawei Telco RH2285",
            os: "Redhat Linux 6.1",
            config: "2CPU/32GB/11988GB",
            az: "深圳",
            applyTime: "2013-11-11 00:00:00"
        },
        {
            id: "B-00000021",
            name: "B-00000021",
            status: "运行中",
            ip: "192.168.40.160",
            model: "Huawei Telco RH2288V2",
            os: "Redhat Linux 6.2",
            config: "2CPU/32GB/11988GB",
            az: "深圳",
            applyTime: "2013-11-11 00:00:00"
        }
    ];

    //VM监控
    var vmMonitorResouce = {
        cpuRate: [
            [1400099600000, 25],
            [1400378000000, 34],
            [1400656400000, 44],
            [1400926800000, 38],
            [1401218800000, 33],
            [1401597200000, 20]
        ]
    };

    //这是某租户所有的磁盘（ecs-storage下）
    var allDisks = [
        {
            id: "disk1",
            name: "FMDISK_AZ01",
            capacityGB: 100,
            usedSize: 39,
            azId: "az-01",
            azName: "shenzhen_AZ01",
            type: "normal",
            status: "use",
            configType: "thin",
            mediaType: "SAN-Any",
            volVmInfos: [
                {
                    "vmId": "vmId001",
                    "vmName": "虚拟机001",
                    "vmStatus": "stopped"
                },
                {
                    "vmId": "vmId002",
                    "vmName": "虚拟机002",
                    "vmStatus": "running"
                }
            ],
            createTime: "2013-06-12 22:30:10"
        },
        {
            id: "disk2",
            name: "FMDISK_AZ02",
            capacityGB: 120,
            usedSize: 78,
            azId: "az-02",
            azName: "深圳AZ02",
            type: "share",
            status: "use",
            configType: "thin",
            mediaType: "SAN-Any",
            volVmInfos: [
                {
                    "vmId": "vmId001",
                    "vmName": "虚拟机001",
                    "status": "running"
                },
                {
                    "vmId": "vmId002",
                    "vmName": "虚拟机002",
                    "status": "stopped"
                }
            ],
            createTime: "2013-06-12 22:30:10"
        }
    ];

    var diskBindVms = [
        {
            id: "5001",
            name: "VM_01",
            ip: "192.168.55.1",
            status: "运行中",
            opt: ""
        },
        {
            id: "5002",
            name: "VM_02",
            ip: "192.168.55.2",
            status: "已关闭",
            opt: ""
        },
        {
            id: "5003",
            name: "VM_03",
            ip: "192.168.55.3",
            status: "已关闭",
            opt: ""
        }
    ];

    var diskSnapshots = [
        {
            id: "snapshot1",
            name: "win7 system disk",
            description: "To create the win7 virtual machine operating system",
            status: "available",
            createTime: "2013-06-12 22:30:10",
            size: 20,
            volumeId: "volume01",
            volumeName: "System01"
        },
        {
            id: "snapshot2",
            name: "Suse11 system disk snapshot",
            description: "To create the suse11 virtual machine operating system",
            status: "creating",
            createTime: "2013-06-12 22:30:10",
            size: 20,
            volumeId: "volume02",
            volumeName: "System02"
        }
    ];

    var azLst = [
        {
            "id": "4616189618054758401",
            "cloudInfraId": "cloudInfra01",
            "name": "AZ01",
            "tags": {
                "datastore": [
                    {"name": "fusionmanager_MediaType", "value": "SAN-Any"},
                    {"name": "fusionmanager_MediaType", "value": "SAN-SSD"},
                    {"name": "Golden", "value": "SAN-SAS&FC"}
                ]
            }
        },
        {
            "id": "az02",
            "cloudInfraId": "cloudInfra01",
            "name": "AZ02",
            "tags": {
                "datastore": [
                    {"name": "fusionmanager_MediaType", "value": "SAN-SATA"},
                    {"name": "fusionmanager_MediaType", "value": "SAN-Any"},
                    {"name": "fusionmanager_MediaType", "value": "SAN-SAS&FC"},
                    {"name": "Golden", "value": "SAN-SSD"}
                ]
            }
        }
    ];

    // 域信息
    var domainInfo = {
        "domainList": [
            {
                "domainId": "1",
                "domainName": "default",
                "createTime": "2014-04-03 14:24:53 UTC+08:00"
            },
            {
                "domainId": "2",
                "domainName": "xian domain",
                "createTime": "2014-04-03 14:24:53 UTC+08:00"
            },
            {
                "domainId": "3",
                "domainName": "shenzhen domain",
                "createTime": "2014-04-03 14:24:53 UTC+08:00"
            }
        ]
    };

    fixture({

        //创建虚拟机快照
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volume-snapshots?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //查询资源池列表
        "GET /goku/rest/v1.5/{vdc_id}/cloud-infras": function (original, response) {
            _.each(cloudInfras, function (item) {
                item.checked = false;
            });
            var ret = {
                code: "0",
                message: "",
                total: 2,
                "cloudInfras": cloudInfras
            };
            response(200, "success", ret, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/cloud-infras/{id}": function (original, response) {
            var id = original.data.id;
            var ret = {
                code: "0",
                message: ""
            };
            ret.cloudInfra = _.find(cloudInfras, function (item) {
                return item.id == id;
            });
            response(200, "success", ret, {});
        },

        //查询AZ
        "GET /goku/rest/v1.5/{vdc_id}/available-zones": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                total: 2,
                availableZones: azLst
            };
            response(200, "success", ret, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/available-zones/{id}": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                availableZone: azLst[0]
            };
            response(200, "success", ret, {})
        },

        //查询VM状态统计信息
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/statistics": function (original, response) {
            var resp = {
                "runningVmQuantity": 1,
                "stoppedVmQuantity": 1,
                "others": 0
            };
            response(200, "success", resp, {})
        },
        //虚拟机相关
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            if (!data.list) {
                response(200, "success", ret, {});
                return;
            }

            var start = 0;
            var limit = 2;
            var condition = data.list.condition;

            var ret = {
                code: "0",
                message: "",
                list: {
                    total: 2,
                    vms: vmList.data
                }

            };

            response(200, "success", ret, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                vm: {
                    id: "VM001",
                    rid: "VM-rid001",
                    resourcePoolId: "cloudInfra01",
                    name: "windows_2003_vmware01",
                    status: "stopped",
                    type: "fusionmanager",
                    availableZoneId: "az001",
                    createTime: "2014-01-12 10:20:20",
                    creatorId: "1",
                    vdcId: "123",
                    vpcId: "vpc001",
                    tag: "shenzhen",
                    osVersion: "SUSE11 SP1 64bit",
                    description: "",
                    password: "a#Sd24Jt",
                    vmSpecInfo: {
                        id: "flavorId1",
                        cpuCount: 2,
                        cpuRebootCount: 2,
                        memoryCount: 2048,
                        memoryRebootCount: 2048,
                        volumes: [
                            {
                                name: "dis01",
                                size: 20.0
                            },
                            {
                                name: "disk02",
                                size: 10.0
                            }
                        ],
                        nics: [
                            {
                                name: "eth0",
                                ip: "192.168.123.123",
                                mac: "A1D2C6CCF2DD"
                            }
                        ]
                    },
                    volumes: vmDisks,
                    nics: vmNics,
                    vncInfo: {
                        ip: "192.168.22.22",
                        port: "5801",
                        password: "@WDF%#4"
                    },
                    snapshotCount: 4,
                    domainId: "1",
                    domainName: "default"
                }
            };
            var id = original.data.id;
            vmDetail.id = id;
            var vmNics = [
                {
                    name: "eth0",
                    ip: "192.168.10.10",
                    mac: "28:6e:d4:88:c6:5f",
                    ipv6s: [],
                    nicId: "nic0",
                    networkId: "Eth001-Ext",
                    networkName: "Eth001-Ext",
                    networkType: "EXTERNAL",
                    floatIp: "192.168.10.11",
                    sgInfo: [
                        {
                            sgId: "00001",
                            sgName: "securityGroup001"
                        },
                        {
                            sgId: "00002",
                            sgName: "securityGroup002"
                        }
                    ]
                },
                {
                    name: "eth1",
                    ip: "192.168.11.11",
                    mac: "28:6e:d4:88:c6:6a",
                    ipv6s: ["fe80:2aac:2100:a4ff:fee3:9566:300c:3262"],
                    nicId: "nic1",
                    networkId: "Eth001-Inner",
                    networkName: "Eth001-Inner",
                    networkType: "ORG_INTERNAL",
                    floatIp: "192.168.11.12",
                    sgInfo: [
                        {
                            sgId: "00003",
                            sgName: "securityGroup003"
                        },
                        {
                            sgId: "00004",
                            sgName: "securityGroup004"
                        }
                    ]
                }
            ];
            for (var i = 0; i < vmNics.length; i++) {
                vmNics[i].nicId = id + "_" + vmNics[i].nicId;
                vmNics[i].name = id + "_" + vmNics[i].name;
            }
            ret.vm.nics = vmNics;
            response(200, "success", ret, {})
        },
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/action?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/file?cloud-infra={cloud_infra_id}&locale={locale}": function (original, response) {
            response(200, "success", {exportFilePath: ""}, {})
        },
        // 虚拟机告警
        "GET /goku/rest/v1.5/{vdc_id}/alarm/vm/{id}?cloud-infra={cloud-infra}": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                alarm: {
                    critical: 100,
                    warn: 200,
                    minor: 300,
                    normal: 400
                }
            };
            response(200, "success", ret, {});
            return true;
        },

        // 虚拟机监控信息
        "GET /goku/rest/v1.5/{vdc_id}/vms/{id}/monitor?cloud-infra={cloud-infra}": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                realTime: {
                    cpuUsageRate: "40",
                    memUsageRate: "50",
                    diskUsageRate: "60",
                    nicKByteIn: "1234.12",
                    nicKByteOut: "1234.12",
                    ioKByteIn: "2345.67",
                    ioKByteOut: "23456.78"
                }
            };
            response(200, "success", ret, {});
            return true;
        },
        "POST /goku/rest/v1.5/{vdc_id}/monitors/realtime?cloud-infras={cloud_infras_id}": function (original, response) {
            var ret = {
                objectId: "vmId01",
                realTimeMonitorMap: {
                    cpu_usage: "40",
                    mem_usage: "50",
                    disk_usage: "60",
                    nic_byte_in: "1234.12",
                    nic_byte_out: "1234.12",
                    disk_io_in: "23475.67",
                    disk_io_out: "23457.67",
                    disk_in_ps: "23457.78",
                    disk_out_ps: "23466.78"

                }
            };
            response(200, "success", ret, {});
        },

        //查询虚拟机模板
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                "vmtemplates": vmTemplates,
                "totalNum": 3
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates/{id}": function (original, response) {
            var vmt = {
                "name": "Windows服务器桌面",
                "availableZoneId": "azId01",
                osOption: {
                    "osType": "Windows",
                    "osVersion": "Windows Server 2008 R2 Datacenter 64bit"
                },
                diskdetail: [
                    {
                        quantity: 20
                    }
                ]
            };
            response(200, "success", vmt, {});
        },
        //查询SLA
        "GET /goku/rest/v1.5/{vdc_id}/tags": function (original, response) {
            var ret = {
                total: 3,
                "tags": slas
            };
            response(200, "success", ret, {});
        },
        //查询AZ的SLA
        "GET /goku/rest/v1.5/{vdc_id}/available-zones/{id}/tags": function (original, response) {
            var ret = {
                "resourceCluster": [
                    {"name": "SLA", "value": "SILVER"},
                    {"name": "SLA", "value": "GOLD"},
                    {"name": "SLA", "value": "COPPER"}
                ],
                "common": [
                    {"name": "SLA", "value": "GOLD"}
                ],
                "datastore": [
                    {"name": "FusionManager_MediaType", "value": "SAN-Any"}
                ]
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

        "GET /uportal/ecs/vm/configTemplate/detail": function (original, response) {
            var id = original.data.id;
            var detail;
            for (var i = 0; i < configTemplates.length; i++) {
                if (configTemplates[i].id == id) {
                    detail = configTemplates[i].detail;
                    break;
                }
            }
            response(200, "success", detail, {})
        },

        // 查询组织配额
        "GET /goku/rest/v1.5/vdcs/{id}": function (original, response) {
            response(200, "success", orgInfo, {});
        },

        // 查询vpc
        "GET /goku/rest/v1.5/{vdc_id}/vpcs": function (original, response) {
            var cludInfraId = original.data["cloud-infras"];
            var ret = vpc_cloud_Map[cludInfraId];
            _.each(ret.vpcs, function (item) {
                item.checked = false;
            });
            response(200, "success", ret, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/action?cloud-infras={cloud_infras_id}": function (original, response) {
            response(200, "success", vpc_cloud_Map["cloudInfra01"], {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{id}": function (original, response) {
            response(200, "success", vpcInfoList.vpcs[0], {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/shared-networks": function (original, response) {
            response(200, "success", sharedNetworkInfo, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks": function (original, response) {


            response(200, "success", networkInfo, {});
        },

        // 创建虚拟机
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms?cloud-infra={cloud_infra_id}": function (original, response) {

            var request = JSON.parse(original.data);
            var time = new Date();
            var allTime = time.getTime().toString();


            var vmInfo = {
                "id": "vm-" + Math.ceil(Math.random() * 100000).toString(),
                "rid": Math.ceil(Math.random() * 100000).toString(),
                "resourcePoolId": "cloudInfra01",
                "name": request.namePrefix,
                "description": request.description,
                "status": "running",
                "type": "fusionmanager",
                "availableZoneId": "az01",
                "availableZoneName": "shenzhen_AZ01",
                "createTime": allTime,
                "expiryTime": allTime,
                "creatorId": "user_hwz",
                "vdcId": Math.ceil(Math.random() * 100000).toString(),
                "tag": "shenzhen",
                "osVersion": "SUSE11SP1 64bit",
                "vmSpecInfo": {
                    id: "VMconfigid01",
                    memoryRebootCount:request.vmSpec.memory.count,
                    cpuRebootCount:request.vmSpec.cpu.count,
                    volumes: [
                        {
                            name: "disk01",
                            size: 20.0
                        },
                        {
                            name: "disk02",
                            size: 30.0
                        }
                    ],
                    nics: [
                        {
                            name: "Network_card_01",
                            ip: "192.168.71.3",
                            mac: "12:22:AE:E2:33:22"
                        },
                        {
                            name: "Network_card_02",
                            ip: "192.171.12.16",
                            mac: "13:22:AE:E2:33:22"
                        }
                    ]
                }
            };

            vmList.data.push(vmInfo);

            response(200, "success", {}, {})
        },

        //虚拟机磁盘相关操作
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/volumes?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/volumes/{volume_id}?mode={mode}&cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        //虚拟机网卡相关页面
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks/{networkID}": function (original, response) {
            response(200, "success", networkInfo.networks[0], {})
        },

        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/nics?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        "POST /goku/rest/v1.5/vms/{id}/nics/{nicId}?cloud-infra={cloud-infra}": function (original, response) {
            response(200, "success", {}, {})
        },

        //VM快照相关页面
        "GET /goku/rest/v1.5/{vdc_id}/vms/{id}/snapshots?cloud-infra={cloud-infra}": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                snapshots: vmSnapshots01,
                current: {
                    id: "id3",
                    name: "快照03",
                    description: "描述03",
                    size: 13,
                    createTime: "2014-02-26 11:55:30 UTC+08:00",
                    needMemoryShot: false,
                    isCurrent: true,
                    isConsistent: false,
                    childSnapshots: null
                }
            };
            response(200, "success", ret, {});
        },

        "GET /uportal/ecs/vm/snapshot/query": function (original, response) {
            var dataJon = JSON.parse(original.data);
            var id = dataJon.id;
            var detail;
            for (var i = 0; i < vmSnapshots.length; i++) {
                if (id == vmSnapshots[i].id) {
                    detail = vmSnapshots[i];
                    break;
                }
            }
            response(200, "success", detail, {});
        },

        "POST /uportal/ecs/vm/snapshot/create": function (original, response) {
            var snapshot = original.data.snapshotInfo;
            var newSnapshot = {
                id: "id4-" + (vmSnapshots.length - 5),
                pId: "id3",
                name: snapshot.name,
                open: true,
                memorySnapshot: snapshot.memorySnapshot ? "是" : "否",
                backupSnapshot: snapshot.consistentSnapshot ? "是" : "否",
                status: "创建成功",
                createTime: "2014-02-26 11:55:30 UTC+08:00",
                description: snapshot.description
            };

            vmSnapshots.push(newSnapshot);
            response(200, "success", newSnapshot, {})
        },

        //VM监控相关/uportal
        "GET /ecs/vm/monitor/resource": function (original, response) {
            response(200, "success", vmMonitorResouce, {});
        },

        //物理机查询
        "GET /goku/rest/v1.5/{vdc_id}/dedicatedServers": function (original, response) {
            var vdc_id = original.data.vdc_id;
            var cloud_infra_id = original.data.cloud_infra_id;
            var authUser = original.data.authUser;
            var res = {
                "list": hosts,
                "total": 2
            };
            response(200, "success", res, {})
        },

        "PUT /goku/rest/v1.5/{vdc_id}/dedicatedServers?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        //物理机申请
        "POST /goku/rest/v1.5/{vdc_id}/dedicatedServers?cloud-infra={cloud_infra_id}": function (original, response) {
            var host = original.data.hostInfo;
            var newHost = {
                id: "B-0000002" + (hosts.length + 1),
                name: "B-0000002" + (hosts.length + 1),
                status: "运行中",
                ip: "192.168.40.179",
                model: host.model,
                os: host.os,
                config: host.cpuNum + "个CPU/" + host.memory + "GB/11988GB",
                az: host.az == 1 ? "深圳" : "西安",
                applyTime: "2013-11-11 00:00:00",
                operate: ""
            };
            hosts.unshift(newHost);

            response(200, "success", newHost, {})
        },
        //释放
        "DELETE /goku/rest/v1.5/{vdc_id}/volumeSnapshots/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            var vdc_id = original.data.vdc_id;
            var cloud_infra_id = original.data.cloud_infra_id;
            var authUser = original.data.authUser;
            var id = original.data.id;
            var dataList = hosts;
            for (var index in hosts) {
                if (hosts[index].id === id) {
                    dataList.splice(index, 1);
                    break;
                }
            }

            response(200, "success", dataList, {})
        },

        //物理机操作
        "POST /goku/rest/v1.5/{vdc_id}/dedicatedServers/{id}/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var vdc_id = original.data.vdc_id;
            var id = original.data.id;
            var cloud_infra_id = original.data.cloud_infra_id;
            var authUser = original.data.authUser;
            var action = original.data.action;
            response(200, "success", {}, {})
        },

        //这是某租户所有的磁盘（ecs-storage下）
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volumes/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            var ret = {
                list: {
                    volumes: []
                }
            };

            if (data.list) {
                var start = 0;
                var limit = 2;
                var condition = data.list.searchCondition.ALL || data.list.searchCondition.VOLUMEID;

                if ($.trim(condition)) {
                    _.each(allDisks, function (item) {
                        if (item.name.indexOf($.trim(condition)) >= 0) {
                            ret.list.volumes.push(item);
                        }
                    });
                    ret.total = ret.list.volumes.length;
                } else {
                    for (var i = start; i < start + limit; i++) {
                        var disk = {
                            id: "disk" + i,
                            name: i % 2 ? "FMDISK_AZ01" : "FMDISK_AZ02",
                            capacityGB: 100,
                            usedSize: 5 + i * 10,
                            azId: "az-" + i,
                            azName: "shenzhen_AZ01",
                            type: i % 2 ? "normal" : "share",
                            status: "USE",
                            configType: "thin",
                            mediaType: "SAN-Any",
                            vmIds: ["VM-" + i],
                            vmNames: ["VM-" + i],
                            createTime: "2013-06-12 22:30:10",
                            volVmInfos: [
                                {
                                    "vmId": "vmId001",
                                    "vmName": "windows_2003_vmware01",
                                    "status": "running"
                                },
                                {
                                    "vmId": "vmId002",
                                    "vmName": "linux_vmware02",
                                    "status": "stopped"
                                }
                            ]
                        };
                        ret.list.volumes.push(disk);
                    }
                    ret.list.total = 2;
                }
            }
            response(200, "success", ret, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volumes?cloud-infra={cloud_infra_id}": function (original, response) {
            var ret = {
                code: "0"
            };
            response(200, "success", ret, {})
        },

        "PUT /goku/rest/v1.5/{vdc_id}/volumes/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            var ret = {
                code: "0"
            };
            response(200, "success", ret, {})
        },

        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volumes/{id}/action?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volumes/{id}?cloud-infra={cloud-infra}": function (original, response) {
            var ret = {
                code: "0"
            };
            response(200, "success", ret, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/vmStatistic": function (original, response) {
            var data = {
                "runningCount": 12,
                "stopCount": 2,
                "unknownCount": 6,
                "runningRate": 87,
                "stopRate": 10,
                "unknownRate": 20
            };
            response(200, "success", data, {});
        },

        "PUT /goku/rest/v1.5/{vdc_id}/vms/{id}/snapshotRestore/{snapshotId}?cloud-infra={cloud-infra}": function (original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/{vdc_id}/vms/{id}/snapshots?cloud-infra={cloud-infra}": function (original, response) {
            response(200, "success", {}, {});
        },

        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/snapshots/{snapshot_id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/snapshots/{snapshot_id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //这是某租户所有的磁盘快照（ecs-storage下）
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volume-snapshots/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var ret = {
                list: {
                    total: 2,
                    snapshots: diskSnapshots
                }
            };
            response(200, "success", ret, {})
        },

        "POST goku/rest/v1.5/{vdc_id}/volume-snapshots?cloud-infra={cloud-infra}": function (original, response) {
            response(200, "success", {}, {})
        },

        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volume-snapshots/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volume-snapshots/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {})
        },

        // 查询所有域
        "GET /goku/rest/v1.5/{vdc_id}/domains": function (original, response) {
            response(200, "success", domainInfo, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/vms/{vm_id}/processes/{processId}?pvmip={pvmip}&cloud-infra={cloudInfraId}&querydata=true": function (original, response) {
            var processId = original.data.processId;
            for (var pId in all_process_monitor_map) {
                if (processId == pId) {
                    response(200, "success", all_process_monitor_map[pId], {})
                }
            }

        },
        "GET /goku/rest/v1.5/{vdc_id}/vms/{vm_id}/processes?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", vmProcessList, {})
        },
        "POST /goku/rest/v1.5/{vdc_id}/configProcessMonitor?vmId={vmId}&processId={processId}": function (original, response) {
            response(200, "success", {}, {})
        },
        //查询磁盘统计信息
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/volumes/statistics": function (original, response) {
            var resp = {
                "total": 3,
                "attached": 2,
                "unattached": 1
            };
            response(200, "success", resp, {})
        },
        //加入、退出安全组
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/action?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/{vdc_id}/monitors/history?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", vmMonitorReosurceHistory, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vms/{vmId}/softwares/monitor?cloud-infra={cloudInfraId}": function (original, response) {
            response(200, "success", processList4Monitor, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/softwares/{processId}/monitor?pvmip={pvmip}&cloud-infra={cloudInfraId}&querydata=true": function (request, response) {
            response(200, "success", oneProcessMonitor, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/alerts/monitor": function (request, response) {
            response(200, "success", businessProcessAlert, {});
        },
        //查询安全组
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups?cloud-infras={cloud_infras_id}&start={start}&limit={limit}": function (request, response) {
            var start = parseInt(request.data.start, 10);
            var limit = parseInt(request.data.limit, 10);
            var resp = {
                code: "0",
                sgs: [],
                total: 0
            };
            var item = {};
            for (var i = start; i < start + limit; i++) {
                item = {
                    "sgID": "" + i,
                    "name": "name" + i,
                    "sgRuleCount": "20",
                    "sgMemberCount": "25",
                    "intraTrafficAllow": "0",
                    "description": "安全组描述"
                }
                resp.sgs.push(item);
            }
            resp.total = 50;
            response(200, "success", resp, {});
        },

        //查询虚拟机快照
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/snapshots?cloud-infra={cloud_infra_id}": function (request, response) {

            var array = new Array();

            _.each(snapShot.snapshots,function(item,index){
               array[index] = item;
            });

            var result = {
                "current":snapShot.current,
                "snapshots":array

            };

            response(200, "success", result, {});
        },
        //创建虚拟机快照
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/{id}/snapshots?cloud-infra={cloud_infra_id}": function (request, response) {

            var original = JSON.parse(request.data);

            var snapShotInfo = {
                "id":"4629700416936869889$urn:sites:45040813:vms:i-000000DA:snapshots:3674" + Math.ceil(Math.random()*1000).toString(),
                "name":original.name,
                "description":original.description,
                "size":0,
                "createTime":"2014-12-31 07:45:09",
                "needMemoryShot":original.memorySnapshot,
                "includingMemorySnapshot":null,
                "childSnapshots":null,
                "status":"ready",
                "type":"normal"
            };

            snapShot.snapshots.push(snapShotInfo);

            response(200, "success", {}, {});
        }
    });

    return fixture;
});