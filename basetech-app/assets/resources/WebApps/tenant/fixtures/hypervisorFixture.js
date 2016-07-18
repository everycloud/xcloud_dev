define(["can/util/fixture/fixture"], function (fixture) {
    var diskList = {"list": {
        "total": 3, "volumes": [
            {"name": "FMDISK_A01", "volumnId": "4629700416936869889$urn:sites:357606CA:volumes:629", "status": "USE", "mediaType": "SAN-Any", "azId": "4616189618054758401", "azName": "shenzhen_AZ01", "dataStoreName": "cna121_data1", "allocType": "thickformat", "type": "normal", "indepDisk": false, "persistentDisk": true, "volNameOnDev": "445F7FA3592F4A92ACDE7F4413E9DB1E", "capacityGB": 7.0, "usedGB": 3.5, "volVmInfos": [
                {"vmID": "4629700416936869889$urn:sites:357606CA:vms:i-0000010C", "vmName": "VM001", "vmIp": null, "vmStatus": "running", "clusterId": null, "clusterName": null}
            ], "createTime": "2014-09-23 15:58:37", "dataType": 1, "attachstatus": "3", "ioWeight": 0, "hypervisorType": "fusioncompute"},
            {"name": "FMDISK_A07", "volumnId": "4629700416936869889$urn:sites:357606CA:volumes:627", "status": "USE", "mediaType": "SAN-Any", "azId": "4616189618054758401", "azName": "shenzhen_AZ01", "dataStoreName": "cna121_data1", "allocType": "thickformat", "type": "normal", "indepDisk": false, "persistentDisk": true, "volNameOnDev": "264BF7503B464948A90A0ADEA5E86D47", "capacityGB": 15.0, "usedGB": 5.0, "volVmInfos": [
                {"vmID": "4629700416936869889$urn:sites:357606CA:vms:i-0000010B", "vmName": "softVMTest", "vmIp": null, "vmStatus": "running", "clusterId": null, "clusterName": null}
            ], "createTime": "2014-09-22 14:05:41", "dataType": 1, "attachstatus": "3", "ioWeight": 0, "hypervisorType": "fusioncompute"},
            {"name": "FMDISK_A15", "volumnId": "4629700416936869889$urn:sites:357606CA:volumes:625", "status": "USE", "mediaType": "SAN-Any", "azId": "4616189618054758401", "azName": "shenzhen_AZ01", "dataStoreName": "cna121_data1", "allocType": "thickformat", "type": "normal", "indepDisk": false, "persistentDisk": true, "volNameOnDev": "F46F743890194879BAF085DAE5F9AADF", "capacityGB": 60.0, "usedGB": 1.4, "volVmInfos": [
                {"vmID": "4629700416936869889$urn:sites:357606CA:vms:i-0000010A", "vmName": "VM001", "vmIp": null, "vmStatus": "running", "clusterId": null, "clusterName": null}
            ], "createTime": "2014-09-22 09:00:22", "dataType": 1, "attachstatus": "3", "ioWeight": 0, "hypervisorType": "fusioncompute"}
        ]}};

    fixture({
        "POST /goku/rest/v1.5/irm/1/hypervisors/action": function (original, response) {
            var result = {
                "list":{
                    "sort":"id","order":"desc","start":0,"total":1,"size":1,
                    "hypervisors":[
                        {"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"huawei","refreshCycle":6,
                            "connector":{
                                "ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman",
                                "password":"Huaweo@CLOUD8","protocol":"https","port":7443,"status":"connected","errorCode":null,
                                "errorDesc":null
                            },
                            "id":"4629700416936869889","updatestatus":1,"addTime":1410488702005,"modifyTime":1410488702005,
                            "refreshTime":1411888461301,"ifDeleteStatus":true,"hyperOption":null,"vsam":{"name":''}
                        }
                    ]
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889": function (original, response) {
            var result = {
                "hypervisor":
                {"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"huawei","refreshCycle":6,
                    "connector":{
                        "ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman",
                        "password":"Huaweo@CLOUD8","protocol":"https","port":7443,"status":"connected","errorCode":null,
                        "errorDesc":null
                    },
                    "id":"4629700416936869889","updatestatus":1,"addTime":1410488702005,"modifyTime":1410488702005,
                    "refreshTime":1411888461301,"ifDeleteStatus":true,"hyperOption":null,"vsam":{"name":'vsam01xian'}
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/updateLogs": function (original, response) {
            var result = {
                "logs":[{"id":"4629700416936870078","createtime":1411888461299,"objecttype":1,"hypervisorID":"4629700416936869889","result":"0","message":{"addnum":"0","modifynum":"0","removenum":"0"}},{"id":"4629700416936870079","createtime":1411888461300,"objecttype":2,"hypervisorID":"4629700416936869889","result":"0","message":{"addnum":"0","modifynum":"0","removenum":"0"}},{"id":"4629700416936870080","createtime":1411888461301,"objecttype":4,"hypervisorID":"4629700416936869889","result":"0","message":{"addnum":"0","modifynum":"0","removenum":"0"}}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869891": function (original, response) {
            var result = {
                "resourceCluster":{"rid":"urn:sites:4DA80840:clusters:118","zoneId":"","hypervisorId":"4629700416936869889","hypervisorName":"FC","name":"cl","description":null,"type":"1","domain":null,"createType":1,"id":"4629700416936869889$urn:sites:4DA80840:clusters:118","indexId":"4625196817309499426","createTime":1410460021752,"lastModifiedTime":null,"domainId":null,"availableZoneId":null,"tags":null}
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/zones/action": function (original, response) {
            var result = {
                "list":{
                    "sort":"id","order":"desc","start":0,"total":2,"size":10,"zones":[

                        {
                            "name":"ZONE_SHENZHEN","region":"shenzhen","description":"Shenzhen Resource Partitions","networkMode":"FIREWALL_ONLY",
                            "id":"46161896180547584010755","createTime":"2014-08-25 08:01:03","lastModifiedTime":"2014-09-21 06:23:14"
                        }
                    ]
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/zones/4616189618054758401029": function (original, response) {
            var hosts =
            {
                "id": "4616189618054758401029",
                "name": "ZONE_SHENZHEN",
                "region": "shenzhen",
                "networkMode": "FIREWALL_ONLY",
                "description": "shenzhen Resource Partitions",
                "createTime":"2014-09-10 07:21:34",
                "lastModifiedTime":"2014-09-25 08:30:02"
            };
            var zone = {
                zone: hosts
            }
            response(200, "success", zone, {});
        },
        "GET /goku/rest/v1.5/irm/1/zones/46161896180547584010755": function (original, response) {
            var hosts =
            {
                "id": "46161896180547584010755",
                "name": "ZONE_SHENZHEN",
                "region": "shenzhen",
                "networkMode": "FIREWALL_ONLY",
                "description": "Shenzhen Resource Partitions",
                "createTime":"2014-08-25 08:01:03",
                "lastModifiedTime":"2014-09-21 06:23:14"
            };
            var zone = {
                zone: hosts
            }
            response(200, "success", zone, {});
        },
        "POST /goku/rest/v1.5/irm/1/availablezones/list": function (original, response) {
            var result = {
                "availableZones":[
                    {"name":"xian_AZ01","region":"xian","description":"Xi'an Resource Partitions","resources":{
                        "volume":
                            ["4683743612465315848","4683743612465315849","4683743612465315850","4683743612465315851","4683743612465315852",
                                "4683743612465315853","4683743612465315854","4683743612465315855","4683743612465315856","4683743612465315857",
                                "4683743612465315858","4683743612465315859","4683743612465315860","4683743612465315862","4683743612465315863"
                            ],
                        "virtualMachine":
                            ["4629700416936869889$urn:sites:482C0850:vms:i-0000004E",
                                "4629700416936869889$urn:sites:482C0850:vms:i-00000050"
                            ],
                        "resourceCluster":
                            ["4629700416936869889$urn:sites:482C0850:clusters:10"]
                    },
                        "numResourcesCluster":2,"numVM":4,"numVolume":15,"tags":null,"zoneId":"4616189618054758401029001",
                        "id":"4616189618054758401029","serviceStatus":null,"createTime":"2014-09-10 07:21:34","lastModifiedTime":"2014-09-25 08:30:02",
                        "lastPausedTime":null,"resourceTags":{"datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"
                    }]}},
                    {"name":"shenzhen_AZ01","region":"shenzhen","description":"Shenzhen Resource Partitions","resources":{
                        "volume":
                            [
                            ],
                        "virtualMachine":
                            [
                            ],
                        "resourceCluster":
                            []
                    },
                        "numResourcesCluster":3,"numVM":5,"numVolume":15,"tags":null,"zoneId":"4616189618054758400755001",
                        "id":"46161896180547584010755","serviceStatus":null,"createTime":"2014-09-10 07:21:34","lastModifiedTime":"2014-09-25 08:30:02",
                        "lastPausedTime":null,"resourceTags":{"datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"
                    }]}}
                ]
                ,"total":2
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/availablezones/action": function (original, response) {
            var hosts = [
                {
                    "id": "46161896180547584010755",
                    "name": "az_1",
                    "clusterNum": "2",
                    "serviceStatus": "normal",
                    "description": "Shenzhen Resource Partitions"
                }
            ];
            var zone = {
                list: {
                    availableZones: hosts
                }
            }
            response(200, "success", zone, {});
        },
        "GET /goku/rest/v1.5/irm/1/vms/461618961805475840102900101/iso": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/availablezones/4616189618054758401029": function (original, response) {
            var result = {
                "availableZone":{
                    "name":"zone_xianA002","region":"xian","description":"The zone in Xi'an.","resources":{
                        "resourceCluster":["4629700416936869889$urn:sites:4DA80840:clusters:10"]
                    },
                    "numResourcesCluster":0,"numVM":0,"numVolume":0,"tags":[{"name":"SLA","value":"GOLD"}],
                    "zoneId":"4616189618054758401","id":"4616189618054758401","serviceStatus":null,"createTime":1409765772027,
                    "lastModifiedTime":1409765772027,"lastPausedTime":null,"resourceTags":{"datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"}]}}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/availablezones/46161896180547584010755": function (original, response) {
            var result = {
                "availableZone":{
                    "name":"azone_shenzhen","region":"shenzhen","description":"The zone in Shenzhen.","resources":{
                        "resourceCluster":["4629700416936869889$urn:sites:4DA80840:clusters:10"]
                    },
                    "numResourcesCluster":0,"numVM":0,"numVolume":0,"tags":[{"name":"SLA","value":"SILVER"}],
                    "zoneId":"4616189618054758401","id":"4616189618054758401","serviceStatus":null,"createTime":1409765772027,
                    "lastModifiedTime":1409765772027,"lastPausedTime":null,"resourceTags":{"datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"}]}}
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/zones/4616189618054758401029": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/zones/4616189618054758401029/resources/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/irm/1/availablezones/4616189618054758401029": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/irm/1/availablezones/46161896180547584010755": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/availablezones/4616189618054758401029/resources/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/availablezones": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/availablezones/46161896180547584010755/resources/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/zones/46161896180547584010755": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/irm/1/zones/4616189618054758401029": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/irm/1/zones/46161896180547584010755": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/action": function (original, response) {
            var result = {
                "devicePath":null,"attachCdromTime":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/all/tags/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/zones/4616189618054758401/resources/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/disastergroups/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/4616189618054758401029/vlanpools/statistics": function (original, response) {
            var result = {
                "usedNumByVDC":0,"usedNumByExternalNetwork":1,"total":101,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
    "POST /goku/rest/v1.5/irm/zones/46161896180547584010755/vlanpools/statistics": function (original, response) {
            var result = {
                "usedNumByVDC":0,"usedNumByExternalNetwork":1,"total":100,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/4616189618054758401029/publicippools/statistics": function (original, response) {
            var result = {
                "usedNum":0,"total":1,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/46161896180547584010755/publicippools/statistics": function (original, response) {
            var result = {
                "usedNum":2,"total":10,"usedByVDCStatistics":1
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/4616189618054758401029/vfirewalls/statistics": function (original, response) {
            var result = {
                "usedNum":2,"total":10,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/46161896180547584010755/publicippools/statistics": function (original, response) {
            var result = {
                "usedNum":0,"total":1,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/zones/46161896180547584010755/vfirewalls/statistics": function (original, response) {
            var result = {
                "usedNum":1,"total":10,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/vsamgtnetworks/statistics": function (original, response) {
            var result = {
                "usedNum":1,"total":2,"usedByVDCStatistics":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/vlanpools/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/dnats/action": function (original, response) {
            var result = {
                "configResp":null,"queryResp":{"zoneID":null,"beginPort":0,"endPort":0,"lifeTime":0}
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/vms/461618961805475840102900102/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/vms/461618961805475840102900101/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
       /* "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/vsamgtnetworks/statistics": function (original, response) {
            var result = {
            "vsaManageNetworks":[{"vsaManageNetworkID":"136005","name":"FMVSA_SZA01","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"createTime":"2014-10-10 16:56:06","subnetIP":"177.177.48.0","subnetMask":"255.255.255.0","subnetGateway":"177.177.48.1","vlan":255,"availableIPRanges":[{"startIP":"9.9.9.9","endIP":"9.9.9.9"}],"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":null,"ipPacketSuppression":null,"dhcpIsolationFlag":true,"ipMacBindFlag":true}},{"vsaManageNetworkID":"136502","name":"FMVSA_SZA02","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"createTime":"2014-10-10 15:24:55","subnetIP":"162.66.203.0","subnetMask":"255.255.255.0","subnetGateway":"162.66.203.254","vlan":4002,"availableIPRanges":[{"startIP":"162.66.203.21","endIP":"162.66.203.29"}],"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":null,"ipPacketSuppression":null,"dhcpIsolationFlag":true,"ipMacBindFlag":true}}]}
            response(200, "success", result, {});
        },*/
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/vsamgtnetworks/statistics": function (original, response) {
            var result = {
                "usedNum":0,"total":0
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/elbs?zoneid=4616189618054758401029&start=0&limit=10": function (original, response) {
            var result = {
                "lbInfos":[],"total":0
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/elbs?zoneid=46161896180547584010755&start=0&limit=10": function (original, response) {
            var result = {
                "lbInfos":[],"total":0
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/sr/1/vmtemplates/id/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/sr/1/vm-logic-templates": function (original, response) {
            var result = {
                "vmLogicTemplates":[],"total":0
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/external-networks/20000000000": function (original, response) {
            var result = {
                "externalNetworks":[{"exnetworkID":"20000000000","name":"FMEN_SZA01","description":null,"externalNetworkType":2,"dvses":[{"dvsID":"1","name":"FCDVS_SZA01","description":null,"clusterNames":[],"hypervisorName":"FCVE_R5CA001","hypervisorType":"fusioncompute"}],"vlans":[150],"totalBoundNics":0,"protocolType":"IPv4","ipv4Subnet":{"ipAllocatePolicy":0,"subnetAddr":"202.113.51.0","subnetPrefix":"255.255.255.0","gateway":"202.113.51.2","availableIPRanges":null,"dhcpOption":{"dhcpServerIP1":"202.113.5.4","dhcpServerIP2":null,"domainName":null,"primaryDNS":null,"secondaryDNS":null,"primaryWINS":null,"secondaryWINS":null},"totalAddrNum":253,"usedAddrNum":0},"ipv6Subnet":null,"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":0,"ipPacketSuppression":0,"dhcpIsolationFlag":false,"ipMacBindFlag":false},"connectToInternetFlag":false,"status":"READY"}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/dvses?start=0&limit=10&name=&hypervisorid=&hypervisortype=fusioncompute": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/dvses?start=0&limit=10&name=&hypervisorid=&hypervisortype=fusioncompute": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/vtepnetworks": function (original, response) {
            var result = {
                "vtepNetworks":[{"vtepNetworkID":"10000000101","name":"default_vtep_network","zoneID":"0","dvses":[],"description":"It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.","subnetIP":"10.10.123.0","subnetMask":"255.255.255.0","subnetGateway":"10.10.123.1","vlan":20,"availableIPRanges":null,"discoverFlag":true,"usedFlag":false}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/vtepnetworks/10000000101": function (original, response) {
            var result = {
                "vtepNetworks":[{"vtepNetworkID":"10000000101","name":"default_vtep_network","zoneID":"-1","dvses":[],"description":"It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.","subnetIP":"10.10.123.0","subnetMask":"255.255.255.0","subnetGateway":"10.10.123.1","vlan":20,"availableIPRanges":[{"startIP":"10.10.123.2","endIP":"10.10.123.254"}],"discoverFlag":false,"usedFlag":false}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401029/vfirewalls?&type=1&start=0&limit=10": function (original, response) {
            var result = {
                "total":0,"vfwList":null
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/46161896180547584010755/vfirewalls?&type=1&start=0&limit=10": function (original, response) {
            var result = {
            "total":10,"vfwList":[{"vfwID":"4000000000000000000","vfwName":"FMHF_SZA01","vpcID":"4792750811720056835","vpcName":"sharedVPC_A02","associatestatus":0,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000001","vfwName":"FMHF_SZA087","vpcID":"4792750811720056842","vpcName":"sharedVPC_A05","associatestatus":0,"networkDeviceId":4638707616191610891,"fwName":"firewall_A03","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000002","vfwName":"FMHF_SZA13","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A03","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000003","vfwName":"FMHF_SZA08","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000004","vfwName":"FMHF_SZA024","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A03","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000005","vfwName":"FMHF_SZA039","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000006","vfwName":"FMHF_SZA069","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000007","vfwName":"FMHF_SZA089","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000008","vfwName":"FMHF_SZA062","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A01","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null},{"vfwID":"4000000000000000009","vfwName":"FMHF_SZA023","vpcID":"-1","vpcName":"sharedVPC_A03","associatestatus":-1,"networkDeviceId":4638707616191610891,"fwName":"firewall_A03","pairDevId":0,"pairFwName":null,"vfwType":1,"vmID":null}]            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/46161896180547584010755/vfirewalls?&type=2&start=0&limit=10": function (original, response) {
            var result = {
            "total":2,"vfwList":[{"vfwID":null,"vfwName":"FMSF_SZA01","vpcID":null,"vpcName":"sharedVPC_A05","associatestatus":0,"networkDeviceId":0,"fwName":null,"pairDevId":0,"pairFwName":null,"vfwType":2,"vmID":"i-0000014D"},{"vfwID":null,"vfwName":"FMSF_SZA07","vpcID":null,"vpcName":"sharedVPC_A05","associatestatus":0,"networkDeviceId":0,"fwName":null,"pairDevId":0,"pairFwName":null,"vfwType":2,"vmID":"i-00000150"}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401029/vfirewalls?&type=2&start=0&limit=10": function (original, response) {
            var result = {
                "total":0,"vfwList":null
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/vsamgtnetworks": function (original, response) {
            var result = {
                "vsaManageNetworks":null
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/vsamgtnetworks": function (original, response) {
            var result = {
            "vsaManageNetworks":[{"vsaManageNetworkID":"136005","name":"FMVSA_SZA01","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"createTime":"2014-10-10 16:56:06","subnetIP":"177.177.48.0","subnetMask":"255.255.255.0","subnetGateway":"177.177.48.1","vlan":255,"availableIPRanges":[{"startIP":"9.9.9.9","endIP":"9.9.9.9"}],"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":null,"ipPacketSuppression":null,"dhcpIsolationFlag":true,"ipMacBindFlag":true}},{"vsaManageNetworkID":"136502","name":"FMVSA_SZA02","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"createTime":"2014-10-10 15:24:55","subnetIP":"162.66.203.0","subnetMask":"255.255.255.0","subnetGateway":"162.66.203.254","vlan":4002,"availableIPRanges":[{"startIP":"162.66.203.21","endIP":"162.66.203.29"}],"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":null,"ipPacketSuppression":null,"dhcpIsolationFlag":true,"ipMacBindFlag":true}}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/vtepnetworks": function (original, response) {
            var result = {
            "vtepNetworks":[{"vtepNetworkID":"126589","name":"FMVTEP_SZA06","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"subnetIP":"191.100.71.5","subnetMask":"255.255.255.0","subnetGateway":"191.100.71.1","vlan":156,"availableIPRanges":[{"startIP":"162.66.26.1","endIP":"166.66.26.124"}],"discoverFlag":false,"usedFlag":false},{"vtepNetworkID":"169875","name":"FMVTEP_SZA01","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":"This is a VTEP management network.","subnetIP":"132.17.15.0","subnetMask":"255.255.255.0","subnetGateway":"132.17.15.1","vlan":102,"availableIPRanges":[{"startIP":"166.66.124.10","endIP":"166.66.124.42"}],"discoverFlag":false,"usedFlag":false},{"vtepNetworkID":"365925","name":"FMVTEP_SZA024","zoneID":"FMVTEP_SZA03","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"subnetIP":"191.100.71.0","subnetMask":"255.255.255.0","subnetGateway":"191.100.71.1","vlan":136,"availableIPRanges":[{"startIP":"191.100.71.15","endIP":"191.100.71.83"}],"discoverFlag":false,"usedFlag":false},{"vtepNetworkID":"365258","name":"FMVTEP_SZA09","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"subnetIP":"192.168.3.0","subnetMask":"255.255.255.0","subnetGateway":"192.168.3.1","vlan":178,"availableIPRanges":[{"startIP":"192.168.3.2","endIP":"192.168.3.2"}],"discoverFlag":false,"usedFlag":false},{"vtepNetworkID":"963242","name":"FMVTEP_SZA18","zoneID":"4616189618054758401","dvses":[{"id":"32","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499424":"ManagementCluster"},"hypervisorID":"4629700416936869889","hypervisorName":"FC","vsses":null,"description":null,"vlanIdList":null}],"description":null,"subnetIP":"192.168.1.0","subnetMask":"255.255.255.0","subnetGateway":"192.168.1.1","vlan":192,"availableIPRanges":[{"startIP":"192.168.1.12","endIP":"192.168.1.20"}],"discoverFlag":false,"usedFlag":false},{"vtepNetworkID":"100002","name":"default_vtep_network","zoneID":"0","dvses":[],"description":"It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.","subnetIP":"172.116.76.0","subnetMask":"255.255.255.0","subnetGateway":"172.116.76.254","vlan":85,"availableIPRanges":null,"discoverFlag":true,"usedFlag":false},{"vtepNetworkID":"100009","name":"default_vtep_network","zoneID":"0","dvses":[],"description":"It is the default VTEP network of the hypervisor, can not be used to create a software virtual firewall.","subnetIP":"172.16.76.0","subnetMask":"255.255.255.0","subnetGateway":"172.16.76.254","vlan":86,"availableIPRanges":null,"discoverFlag":true,"usedFlag":false}]}
                response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401029/publicippools": function (original, response) {
            var result = {
                "publicIPPools":[]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/46161896180547584010755/publicippools": function (original, response) {
            var result = {
                "publicIPPools":[]
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/publicippools": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors": function (original, response) {
            var result = {
                "hypervisors":[{"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"China","refreshCycle":6,"connector":{"ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman","password":null,"protocol":"https","port":7443,"status":"connected","errorCode":null,"errorDesc":null},"id":"4629700416936869889","updatestatus":1,"addTime":1409794918268,"modifyTime":1409794918268,"refreshTime":1411973257751,"ifDeleteStatus":false,"hyperOption":null,"vsam":null}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/4616189618054758401029/vlanpools?start=0&limit=10&name=": function (original, response) {
            var result = {
                "vlanpools":[{"id":"1","name":"FMVL_SZA01","usage":"business","vxLanFlag":false,"startID":100,"endID":200,"zoneID":"4616189618054758401","description":null,"dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":null,"clusterIDsMapNames":null,"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":null}]}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/46161896180547584010755/vlanpools?start=0&limit=10&name=": function (original, response) {
            var result = {
                "vlanpools":[{"id":"1","name":"FMVL_SZA01","usage":"business","vxLanFlag":false,"startID":100,"endID":200,"zoneID":"4616189618054758401","description":null,"dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":null,"clusterIDsMapNames":null,"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":null}]}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/multicast-ippools": function (original, response) {
            var result = {
            "multicastIPPools":[{"multicastIPPoolID":"1000000","name":"FMVXIP_SZA01","description":null,"startIP":"224.0.1.0","endIP":"224.3.1.255","totalUsedIPs":0,"totalIPs":196864}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/external-networks?start=0&limit=10&name=&dvsname=&vlan=": function (original, response) {
            var result = {
                "externalNetworks":[{"exnetworkID":"20000000000","name":"FMEN_SZA01","description":null,"externalNetworkType":2,"dvses":[{"dvsID":"1","name":"FCDVS_SZA01","description":null,"clusterNames":["FM"],"hypervisorName":"FCVE_R5CA001","hypervisorType":"fusioncompute"}],"vlans":[150],"totalBoundNics":0,"protocolType":"IPv4","ipv4Subnet":{"ipAllocatePolicy":0,"subnetAddr":"202.113.51.0","subnetPrefix":"255.255.255.0","gateway":"202.113.51.2","availableIPRanges":null,"dhcpOption":{"dhcpServerIP1":"202.113.5.4","dhcpServerIP2":null,"domainName":null,"primaryDNS":null,"secondaryDNS":null,"primaryWINS":null,"secondaryWINS":null},"totalAddrNum":253,"usedAddrNum":0},"ipv6Subnet":null,"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":0,"ipPacketSuppression":0,"dhcpIsolationFlag":false,"ipMacBindFlag":false},"connectToInternetFlag":false,"status":"READY"}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/external-networks?start=0&limit=10&name=&dvsname=&vlan=": function (original, response) {
            var result = {
                "externalNetworks":[{"exnetworkID":"20000000000","name":"FMEN_SZA01","description":null,"externalNetworkType":2,"dvses":[{"dvsID":"1","name":"FCDVS_SZA01","description":null,"clusterNames":["FM"],"hypervisorName":"FCVE_R5CA001","hypervisorType":"fusioncompute"}],"vlans":[150],"totalBoundNics":0,"protocolType":"IPv4","ipv4Subnet":{"ipAllocatePolicy":0,"subnetAddr":"202.113.51.0","subnetPrefix":"255.255.255.0","gateway":"202.113.51.2","availableIPRanges":null,"dhcpOption":{"dhcpServerIP1":"202.113.5.4","dhcpServerIP2":null,"domainName":null,"primaryDNS":null,"secondaryDNS":null,"primaryWINS":null,"secondaryWINS":null},"totalAddrNum":253,"usedAddrNum":0},"ipv6Subnet":null,"portSetting":{"inTrafficShapingPolicyFlag":false,"inTrafficShapingPolicy":null,"outTrafficShapingPolicyFlag":false,"outTrafficShapingPolicy":null,"arpPacketSuppression":0,"ipPacketSuppression":0,"dhcpIsolationFlag":false,"ipMacBindFlag":false},"connectToInternetFlag":false,"status":"READY"}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zones/46161896180547584010755/publicippools": function (original, response) {
            var result = {
            "publicIPPools":[{"publicIpPoolId":"100765","zoneId":"4616189618054758401","name":"FMPNIP_SZA01","description":null,"ipRangeList":[{"startIp":"124.124.124.11","endIp":"124.124.124.111"}],"usedPublicIPs":[{"ip":"124.124.124.11","usage":"EIP"}],"statPublicIPUsages":[{"usage":"DNAT","total":0},{"usage":"SNAT","total":0},{"usage":"EIP","total":1}],"usedNum":1,"total":101}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/dhcpservers": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/vlanpools": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/multicast-ippools": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/multicast-ippools": function (original, response) {
            var result = {
                "multicastIPPools":[]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/4616189618054758401029/dvses?start=0&limit=10&name=&hypervisorid=": function (original, response) {
            var result = {
                "dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499393":"FM"},"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":["1"]}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/dvses?start=0&limit=10&name=&hypervisorid=": function (original, response) {
            var result = {
                "dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499393":"manageRC_A01"},"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":["1"]}],"total":1
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/datastores": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/zones": function (original, response) {
            var result = {
                "zones":[{"name":"ZONE_SHENZHEN","region":"xian","description":"this zone was built in shenzhen."
                    ,"networkMode":"FIREWALL_ONLY","id":"4616189618054758401","createTime":1409764416754,
                    "lastModifiedTime":1409764416754}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/macSegment": function (original, response) {
            var result = {
                "macSegments":[{"begin":"28:6e:d4:88:c6:29","end":"28:6e:d4:8a:39:40"}]
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/macSegment": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/macs": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4629700416936869889/macs": function (original, response) {
            var result = {
                "macs":[]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869889029/drsrecommendations?start=0&limit=10": function (request, response) {
            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}

            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsrecommendations?start=0&limit=10": function (request, response) {

            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}

            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsmigrations?start=0&limit=10": function (request, response) {
            var result = {
                "total":null,"drsMigrations":[]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869889029/drsmigrations?start=0&limit=10": function (request, response) {
            var result = {
                "total":null,"drsMigrations":[]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/462970041693686988902901": function (request, response) {
            var result = {
                "hypervisor":{"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"China","refreshCycle":6,"connector":{"ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman","password":null,"protocol":"https","port":7443,"status":"connected","errorCode":null,"errorDesc":null},"id":"4629700416936869889","updatestatus":1,"addTime":1409794918268,"modifyTime":1409794918268,"refreshTime":1411973257751,"ifDeleteStatus":false,"hyperOption":{"supportSetMac":true},"vsam":null}
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4616189618054758401075501001": function (request, response) {
            var result = {
                "hypervisor":{"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"China","refreshCycle":6,"connector":{"ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman","password":null,"protocol":"https","port":7443,"status":"connected","errorCode":null,"errorDesc":null},"id":"4629700416936869889","updatestatus":1,"addTime":1409794918268,"modifyTime":1409794918268,"refreshTime":1411973257751,"ifDeleteStatus":false,"hyperOption":{"supportSetMac":true},"vsam":null}
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/tag-groups": function (request, response) {
            var result = {
                "total":1,"tagGroups":[{"name":"SLA","values":["GOLD","SILVER","COPPER"]}]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869889029": function (request, response) {
            var result = {
                "resourceCluster":{"rid":"urn:sites:4DA80840:clusters:10","zoneId":"4616189618054758401","hypervisorId":"4629700416936869889","hypervisorName":"FCVE_R5CA001","name":"manageRC_A01","description":null,"type":"1","domain":null,"createType":1,"id":"4629700416936869889$urn:sites:4DA80840:clusters:10","indexId":"4625196817309499393","createTime":1409766125364,"lastModifiedTime":1411663526372,"domainId":null,"availableZoneId":"4616189618054758401","tags":null}
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755": function (request, response) {
            var result = {
                "resourceCluster":{"rid":"urn:sites:4DA80840:clusters:10","zoneId":"4616189618054758401","hypervisorId":"4629700416936869889","hypervisorName":"FCVE_R5CA001","name":"manageRC_A01","description":null,"type":"1","domain":null,"createType":1,"id":"4629700416936869889$urn:sites:4DA80840:clusters:10","indexId":"4625196817309499393","createTime":1409766125364,"lastModifiedTime":1411663526372,"domainId":null,"availableZoneId":"4616189618054758401","tags":null}
            }
            response(200, "success", result, {})
        },
        "POST /goku/rest/v1.5/irm/1/vms/action": function (original, response) {
            var result = {
                "clone":null,"remove":null,"operate":null,"listSupportedOsInfo":{
                    "osInfos":{"Linux":[{"osVersionDesc":null,"osType":"Linux","osVersion":43,
                        "osVersiontype":"Novell SUSE Linux Enterprise Server 11 SP1 64bit",
                        "cpuQuantityLimit":64,"cpuSocketLimit":64,"memQuantityLimit":1048576,
                        "supportCpuHotPlug":true,"supportMemHotPlug":true,"hostname":null,
                        "password":null,"supportCustomizedName":false,"customizedOsName":null}]}},
                "modUpgradeMode":null,"resumeRecycling":null,"importVm":null,"transferOwnership":null,
                "parseDescriptionFile":null,"migrate":null
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/hypervisors": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/reports/resource-reports/action?locale=zh_CN": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST goku/rest/v1.5/irm/1/volumes/action": function (original, response) {
            response(200, "success", diskList, {});
        },
        "POST goku/rest/v1.5/irm/1/volumes/{id}/action": function (original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/irm/1/statistics/available-zones": function (original, response) {
            var result = {
                "capacityAZs":{
                    "4616189618054758401029":{
                        "vcpuFreeSize":43.2,"vcpuAllocatedSize":24.0,"memFreeSize":67.0,"memAllocatedSize":20.8,
                        "storageFreeSize":2269.0,"storageOccupancySize":571.0,"storageAllocatedSize":804.0,
                        "vcpuReserveRate":36,"memReserveRate":24,"storagePoolAllocatedRate":28,"storagePoolOccupancyRate":20,
                        "subnetFreeNum":0,"subnetAllocatedNum":0,"subnetAllocatedRate":0,"vlanIdFreeNum":0,
                        "vlanIdAllocatedNum":0,"vlanIdAllocatedRate":0
                    },
                    "46161896180547584010755":{
                        "vcpuFreeSize":43.2,"vcpuAllocatedSize":37.0,"memFreeSize":128.0,"memAllocatedSize":40.2,
                        "storageFreeSize":2536.0,"storageOccupancySize":464,"storageAllocatedSize":668.0,
                        "vcpuReserveRate":29,"memReserveRate":24,"storagePoolAllocatedRate":28,"storagePoolOccupancyRate":16,
                        "subnetFreeNum":0,"subnetAllocatedNum":0,"subnetAllocatedRate":0,"vlanIdFreeNum":0,
                        "vlanIdAllocatedNum":0,"vlanIdAllocatedRate":0
                    }
                }
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/datastores": function (original, response) {
            var hosts = [
                {
                    "id": "4616189618054758401",
                    "name": "MainStorage_RZA01",
                    accessible: true,
                    "typeStr": "clusterNum",
                    "mediaType": "Huawei",
                    "accessibleStr": "Shenzhen Resource Partitions",
                    "isThinStr": "zone_1",
                    "resClusterName": "clusterNum",
                    "maintenanceStr": "Huawei",
                    "disasterGroupName": "Shenzhen Resource Partitions",
                    "capacity": {
                        totalCapacityGB: 500,
                        usedSizeGB: 250,
                        freeCapacityGB: 250
                    },
                    ability: {
                        isThin: true
                    },
                    maintenancemode: false,
                    type: "san"
                }
            ];
            var zone = {
                datastoreInfos: hosts
            }
            response(200, "success", zone, {});
        },
        "POST /goku/rest/v1.5/irm/1/vms/list": function (original, response) {
            var hosts = [
                {
                    "id": "461618961805475840102900101",
                    "rid": "4DA80840029",
                    "name": "windows_2003_vmware01",
                    "vmVisibleId": "i-0000078A",
                    "ip": "191.100.71.101",
                    "status": "running",
                    "hostName": "CN_host01",
                    "clusterName": "manageRC_A01",
                    "cpuUsageRate": 45,
                    "memUsageRate": 60,
                    "diskUsageRate": 30
                },
				{
					"id": "461618961805475840102900102",
					"rid":"4DA80840029",
					"name": "linux_vmware02",
					"vmVisibleId": "i-0000078A",
					"ip": "191.100.71.102",
					"status": "running",
					"hostName": "CN_host02",
					"clusterName": "manageRC_A01",
					"cpuUsageRate": 15,
					"memUsageRate": 20,
					"diskUsageRate": 50
				}
            ];
            var zone = {
                vmInfoList: hosts
            }
            response(200, "success", zone, {});
        },

        "GET /goku/rest/v1.5/irm/1/vms/{id}": function (original, response) {
            var result = {
                "vmInfo":{
                    "id":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","rid":"4DA80840029",
                    "hostUrn":"urn:sites:4DA80840:hosts:80","hostName":"CN_host01","hostId":2,"hostIp":"191.100.71.101",
                    "name":"windows_2003_vmware01","location":"urn:sites:4DA80840:clusters:10","availableZoneId":"4616189618054758401",
                    "availableZoneName":"qewa","vmOption":{
                        "supportPauseResume":true,"supportVolumeRecycle":true,
                        "supportSetMac":true,"supportRemoteAttach":true,"supportModifyDiskName":true,"zeroFillDiskIndependent":false,
                        "cpuNeedReboot":true,"memoryNeedReboot":true,"deleteNeedStoped":false,"removeVmResources":false,
                        "displayCreateVmTime":true,"displayTemporaryStatus":true,"supportHibernateDelete":true,
                        "needToSyncVrm":true,"needAddToSG":true,"suppportModDiskPropertyOnline":true,"suppportAddDELNicOnline":true,
                        "suppportExpandDiskOnline":true,"displayOriginalNetworkInfo":false
                    },
                    "vmConfig":{
                        "attribute":{
                            "bootOption":"disk","autoHibernate":false,"hibernateThreshholdM":60,"syncTimeWithHost":false,
                            "reoverByHost":false,"clockMode":"freeClock","isEnableMemVol":true,"isEnableFt":false,"isAutoUpgrade":true,
                            "attachType":false,"secureVmType":null,"enableHa":true},"cpu":{"quantity":4,"coresPerSocket":2,"reservation":9600,
                            "weight":4000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":8192,"reservation":8192,"weight":81920,
                            "level":10,"limit":8192,"memHotPlug":0},
                        "disks":[{"quantityGB":80.0,"allocType":"thick","indepDisk":true,"diskName":"i-00000019-xvda","storageType":"local",
                            "type":"normal","storageLocation":"urn:sites:4DA80840:datastores:2","strictThickFormat":true,"pciType":"IDE",
                            "persistentDisk":true,"volumeId":"4629700416936869889$urn:sites:4DA80840:volumes:109","diskId":1,"diskUsed":0.0,
                            "volumeguid":null,"storageName":"CNA02-disk1","dataStoreId":33,"dataStoreUrn":"urn:sites:4DA80840:datastores:2",
                            "dataStoreType":null,"disasterGroupName":null,"disasterGroupId":0,"volUsedSizeMB":81920,"volUsedSizeGB":80.0,"vmUsedSizeMB":0,
                            "vmUsedSizeGB":0.0,"vmRecycleSizeMB":-1,"vmRecycleSizeGB":-1.0,"supportRecycle":false,"supportModify":false,
                            "volFileName":"urn:sites:4DA80840:volumes:109","supportDiskManagement":true,"diskStatus":"USE","mediaType":"SAN-Any",
                            "maxReadBytes":0,"maxWriteBytes":0,"maxReadRequest":0,"maxWriteRequest":0,"volType":null,"volumeUuid":null,"isDataCopy":null,
                            "isThin":false,"volNameOnDev":"BBD811BF8A164B18B8921E998202E5B5","createTime":0,"ioWeight":0}],
                        "usbControllers":[{"controllerType":"EHCI+UHCI","controllerKey":""}],"usbNum":0,"nics":[{
                            "id":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019:nics:0","name":"eth0","portGroupId":"urn:sites:4DA80840:dvswitchs:1:portgroups:1",
                            "networkType":"UNKNOWN","networkIdUsedByNic":0,"sequenceNum":0,"canRelaseIp":true,"pglongId":0,"portGroupName":"p0",
                            "mac":"28:6e:d4:88:c6:3c","ip":"191.100.71.10","ips6":null,"vlanid":null,"bandLimit":null,"subnetid":null,"networkid":null,
                            "subnetMask":null,"gateWay":null,"primaryWins":null,"secondaryWins":null,"domainName":null,"domainSearch":null,"primaryDNS":null,
                            "secondaryDNS":null,"fwType":null,"ipConfigType":null,"setGateway":true,"nicDBID":-1,"sgId":null,"sgName":null,"uri":null,"ipCheckResult":null}],
                        "devices":[],"usb":[],"gpu":[]},"vmRebootConfig":{"cpu":{"quantity":4,"coresPerSocket":2,"reservation":9600,"weight":4000,"level":1000,"limit":0,
                        "cpuHotPlug":-1},"memory":{"quantityMB":8192,"reservation":8192,"weight":81920,"level":10,"limit":8192,"memHotPlug":0}},"os":{"osVersionDesc":"",
                        "osType":"windows 2003","osVersion":43,"osVersiontype":"Windows 2003 Enterprise Server 11 SP2 32bit","cpuQuantityLimit":0,"cpuSocketLimit":2,
                        "memQuantityLimit":0,"supportCpuHotPlug":false,"supportMemHotPlug":false,"hostname":"","password":"A4tD@2K8","supportCustomizedName":false,
                        "customizedOsName":""},"status":"running","repairStatus":null,"backupStatus":"NORMAL","osStatus":null,"vncAcessInfo":{"hostip":"191.100.71.7",
                        "vncport":5905,"vncpassword":"W8yWC3eU","vncEncMode":"","vncMode":"","shaEncFlag":true},"vappRid":"","vappId":0,"vappName":"","tag":"",
                    "userName":"","description":"","createTime":"2014-09-16 01:34:10","creatorId":"","isTemplate":"false","isLinkClone":"false","statusStr":"",
                    "osStatusStr":"","cpuUsageRate":45,"memUsageRate":60,"diskUsageRate":30,"vmInnerState":"","pvDriverStatus":"notRunning","toolVersion":"",
                    "toolInstallStatus":"empty","cdRomStatus":"empty","attachedFilePath":"","group":null,"clusterUrn":"urn:sites:4DA80840:clusters:10",
                    "clusterId":"4625196817309499424","clusterName":"manageRC_A01","nicByteIn":"","nicByteOut":"","uri":"","dc":"4611686018427387904","zone":"4616189618054758401",
                    "resourcepool":"","vmType":"fusioncompute","instanceuuid":"urn:sites:4DA80840:vms:i-00000019","hypervisorId":"4629700416936869889",
                    "hypervisorName":"FC","cpuUsed":400,"memUsed":8316,"templateIsLost":"","vmVisibleId":"i-0000078A","templateID":0,"vpcId":"-1","vpcName":"",
                    "vdcId":null,"uuid":"5a27cbb9-ba0d-4d02-afde-5d358475cec1","locationName":"FM","dataStoreUrns":["urn:sites:4DA80840:datastores:2"],"idle":0,
                    "nicsTxLimit":[],"imcSetting":null,"hbaCardNum":"","beginRuntime":"2014-09-16 01:34:10","vsaVmType":null,"vsamVm":false,"disasterGroupId":0,
                    "disasterGroupName":"","useDisasterGroup":false,"originalNetworks":[],"orgName":"","orgId":null,"alarmInfo":null,"domainId":"","domainName":null,
                    "category":0,"cpuQosMap":{"1":{"maxCpuReserve":2400,"maxCpuLimit":2400},"2":{"maxCpuReserve":4800,"maxCpuLimit":4800},"3":{"maxCpuReserve":7200,
                        "maxCpuLimit":7200},"4":{"maxCpuReserve":9600,"maxCpuLimit":9600},"5":{"maxCpuReserve":12000,"maxCpuLimit":12000},"6":{"maxCpuReserve":14400,
                        "maxCpuLimit":14400},"7":{"maxCpuReserve":14400,"maxCpuLimit":16800},"8":{"maxCpuReserve":14400,"maxCpuLimit":19200},"9":{"maxCpuReserve":14400,
                        "maxCpuLimit":21600},"10":{"maxCpuReserve":14400,"maxCpuLimit":24000},"11":{"maxCpuReserve":14400,"maxCpuLimit":26400},"12":{"maxCpuReserve":14400,
                        "maxCpuLimit":28800},"13":{"maxCpuReserve":14400,"maxCpuLimit":31200},"14":{"maxCpuReserve":14400,"maxCpuLimit":33600}}}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/vms/461618961805475840102900102": function (original, response) {
            var result = {
                "vmInfo":{
                    "id":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","rid":"4DA80840029",
                    "hostUrn":"urn:sites:4DA80840:hosts:80","hostName":"CN_host01","hostId":2,"hostIp":"191.100.71.101",
                    "name":"windows_2003_vmware01","location":"urn:sites:4DA80840:clusters:10","availableZoneId":"4616189618054758401",
                    "availableZoneName":"qewa","vmOption":{
                        "supportPauseResume":true,"supportVolumeRecycle":true,
                        "supportSetMac":true,"supportRemoteAttach":true,"supportModifyDiskName":true,"zeroFillDiskIndependent":false,
                        "cpuNeedReboot":true,"memoryNeedReboot":true,"deleteNeedStoped":false,"removeVmResources":false,
                        "displayCreateVmTime":true,"displayTemporaryStatus":true,"supportHibernateDelete":true,
                        "needToSyncVrm":true,"needAddToSG":true,"suppportModDiskPropertyOnline":true,"suppportAddDELNicOnline":true,
                        "suppportExpandDiskOnline":true,"displayOriginalNetworkInfo":false
                    },
                    "vmConfig":{
                        "attribute":{
                            "bootOption":"disk","autoHibernate":false,"hibernateThreshholdM":60,"syncTimeWithHost":false,
                            "reoverByHost":false,"clockMode":"freeClock","isEnableMemVol":true,"isEnableFt":false,"isAutoUpgrade":true,
                            "attachType":false,"secureVmType":null,"enableHa":true},"cpu":{"quantity":4,"coresPerSocket":2,"reservation":9600,
                            "weight":4000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":8192,"reservation":8192,"weight":81920,
                            "level":10,"limit":8192,"memHotPlug":0},
                        "disks":[{"quantityGB":80.0,"allocType":"thick","indepDisk":true,"diskName":"i-00000019-xvda","storageType":"local",
                            "type":"normal","storageLocation":"urn:sites:4DA80840:datastores:2","strictThickFormat":true,"pciType":"IDE",
                            "persistentDisk":true,"volumeId":"4629700416936869889$urn:sites:4DA80840:volumes:109","diskId":1,"diskUsed":0.0,
                            "volumeguid":null,"storageName":"CNA02-disk1","dataStoreId":33,"dataStoreUrn":"urn:sites:4DA80840:datastores:2",
                            "dataStoreType":null,"disasterGroupName":null,"disasterGroupId":0,"volUsedSizeMB":81920,"volUsedSizeGB":80.0,"vmUsedSizeMB":0,
                            "vmUsedSizeGB":0.0,"vmRecycleSizeMB":-1,"vmRecycleSizeGB":-1.0,"supportRecycle":false,"supportModify":false,
                            "volFileName":"urn:sites:4DA80840:volumes:109","supportDiskManagement":true,"diskStatus":"USE","mediaType":"SAN-Any",
                            "maxReadBytes":0,"maxWriteBytes":0,"maxReadRequest":0,"maxWriteRequest":0,"volType":null,"volumeUuid":null,"isDataCopy":null,
                            "isThin":false,"volNameOnDev":"BBD811BF8A164B18B8921E998202E5B5","createTime":0,"ioWeight":0}],
                        "usbControllers":[{"controllerType":"EHCI+UHCI","controllerKey":""}],"usbNum":0,"nics":[{
                            "id":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019:nics:0","name":"eth0","portGroupId":"urn:sites:4DA80840:dvswitchs:1:portgroups:1",
                            "networkType":"UNKNOWN","networkIdUsedByNic":0,"sequenceNum":0,"canRelaseIp":true,"pglongId":0,"portGroupName":"p0",
                            "mac":"28:6e:d4:88:c6:3c","ip":"191.100.71.11","ips6":null,"vlanid":null,"bandLimit":null,"subnetid":null,"networkid":null,
                            "subnetMask":null,"gateWay":null,"primaryWins":null,"secondaryWins":null,"domainName":null,"domainSearch":null,"primaryDNS":null,
                            "secondaryDNS":null,"fwType":null,"ipConfigType":null,"setGateway":true,"nicDBID":-1,"sgId":null,"sgName":null,"uri":null,"ipCheckResult":null}],
                        "devices":[],"usb":[],"gpu":[]},"vmRebootConfig":{"cpu":{"quantity":4,"coresPerSocket":2,"reservation":9600,"weight":4000,"level":1000,"limit":0,
                        "cpuHotPlug":-1},"memory":{"quantityMB":8192,"reservation":8192,"weight":81920,"level":10,"limit":8192,"memHotPlug":0}},"os":{"osVersionDesc":"",
                        "osType":"Linux","osVersion":43,"osVersiontype":"Novell SUSE Linux Enterprise Server 11 SP1 64bit","cpuQuantityLimit":0,"cpuSocketLimit":0,
                        "memQuantityLimit":0,"supportCpuHotPlug":false,"supportMemHotPlug":false,"hostname":"","password":"A4tD@2K8","supportCustomizedName":false,
                        "customizedOsName":""},"status":"running","repairStatus":null,"backupStatus":"NORMAL","osStatus":null,"vncAcessInfo":{"hostip":"191.100.71.7",
                        "vncport":5905,"vncpassword":"W8yWC3eU","vncEncMode":"","vncMode":"","shaEncFlag":true},"vappRid":"","vappId":0,"vappName":"","tag":"",
                    "userName":"","description":"","createTime":"2014-09-16 01:34:10","creatorId":"","isTemplate":"false","isLinkClone":"false","statusStr":"",
                    "osStatusStr":"","cpuUsageRate":45,"memUsageRate":60,"diskUsageRate":30,"vmInnerState":"","pvDriverStatus":"notRunning","toolVersion":"",
                    "toolInstallStatus":"empty","cdRomStatus":"empty","attachedFilePath":"","group":null,"clusterUrn":"urn:sites:4DA80840:clusters:10",
                    "clusterId":"4625196817309499424","clusterName":"manageRC_A01","nicByteIn":"","nicByteOut":"","uri":"","dc":"4611686018427387904","zone":"4616189618054758401",
                    "resourcepool":"","vmType":"fusioncompute","instanceuuid":"urn:sites:4DA80840:vms:i-00000019","hypervisorId":"4629700416936869889",
                    "hypervisorName":"FC","cpuUsed":400,"memUsed":8316,"templateIsLost":"","vmVisibleId":"i-0000078A","templateID":0,"vpcId":"-1","vpcName":"",
                    "vdcId":null,"uuid":"5a27cbb9-ba0d-4d02-afde-5d358475cec1","locationName":"FM","dataStoreUrns":["urn:sites:4DA80840:datastores:2"],"idle":0,
                    "nicsTxLimit":[],"imcSetting":null,"hbaCardNum":"","beginRuntime":"2014-09-16 01:34:10","vsaVmType":null,"vsamVm":false,"disasterGroupId":0,
                    "disasterGroupName":"","useDisasterGroup":false,"originalNetworks":[],"orgName":"","orgId":null,"alarmInfo":null,"domainId":"","domainName":null,
                    "category":0,"cpuQosMap":{"1":{"maxCpuReserve":2400,"maxCpuLimit":2400},"2":{"maxCpuReserve":4800,"maxCpuLimit":4800},"3":{"maxCpuReserve":7200,
                        "maxCpuLimit":7200},"4":{"maxCpuReserve":9600,"maxCpuLimit":9600},"5":{"maxCpuReserve":12000,"maxCpuLimit":12000},"6":{"maxCpuReserve":14400,
                        "maxCpuLimit":14400},"7":{"maxCpuReserve":14400,"maxCpuLimit":16800},"8":{"maxCpuReserve":14400,"maxCpuLimit":19200},"9":{"maxCpuReserve":14400,
                        "maxCpuLimit":21600},"10":{"maxCpuReserve":14400,"maxCpuLimit":24000},"11":{"maxCpuReserve":14400,"maxCpuLimit":26400},"12":{"maxCpuReserve":14400,
                        "maxCpuLimit":28800},"13":{"maxCpuReserve":14400,"maxCpuLimit":31200},"14":{"maxCpuReserve":14400,"maxCpuLimit":33600}}}
            }
            response(200, "success", result, {});
        },

        "GET /goku/rest/v1.5/endpoint": function (original, response) {
            var hosts = [
                {
                    "serviceName": "nova",
                    "serviceId": "1",
                    "regionName": "region"
                }
            ];
            var zone = {
                endpoint: hosts
            }
            response(200, "success", zone, {});
        },
        "GET /goku/rest/v1.5/token": function (original, response) {
            var hosts = {
                "id": "1",
                "projectId": "1"
            }
            response(200, "success", hosts, {});
        },
        "GET /goku/rest/v1.5/1/irm/1/vms/detail?all_tenant=1": function (original, response) {
            var hosts = [
                {
                    "name": "vm",
                    "OS-EXT-AZ:availability_zone": "az",
                    "OS-EXT-SRV-ATTR:hypervisor_hostname": "host",
                    "status": "Running"
                }
            ];
            var zone = {
                servers: hosts
            }
            response(200, "success", zone, {});
        },
        "GET /goku/rest/v1.5/1/irm/1/affinity": function (original, response) {
            var affinitys = [
                {
                    "name": "Affinity Group",
                    "type": "Affinity",
                    "description": "This is Affinity Group",
                    "createTimeStr": "2014-5-19"
                }
            ];
            var data = {
                affinitys: affinitys
            }
            response(200, "success", data, {});
        },
        "POST /goku/rest/v1.5/capacity-statistics/zones": function (original, response) {
            var result = {
                "reponse":{
                    "4616189618054758401029":{
                        "resultCode":null,"taskIdList":null,"cpuTotalSizeGHz":67.2,"cpuUsedSizeGHz":24.0,"cpuUsageRate":36,
                        "memTotalSizeGB":87.8,"memUsedSizeGB":20.8,"memUsageRate":23,"storagePoolTotalSizeGB":3073.0,
                        "storagePoolUsedSizeGB":614.6,"storagePoolUsageRate":20,"storageAllocatedSizeGB":860.44,"storagePoolAllocatedRate":28,
                        "vlanTotalNum":0,"vlanUsedNum":0,"vlanUsageRate":0,"publicIPTotalNum":0,"publicIPUsedNum":0,"virtualFirewallTotalNum":0,
                        "virtualFirewallUsedNum":0},
                    "46161896180547584010755":{
                        "resultCode":null,"taskIdList":null,"cpuTotalSizeGHz":76.3,"cpuUsedSizeGHz":19.7,"cpuUsageRate":28,"memTotalSizeGB":500.0,
                        "memUsedSizeGB":250.0,"memUsageRate":250.0,"storagePoolTotalSizeGB":4262.0,"storagePoolUsedSizeGB":442,"storagePoolUsageRate":352.8,
                        "storageAllocatedSizeGB":836,"storagePoolAllocatedRate":37.25,"vlanTotalNum":10,"vlanUsedNum":2,"vlanUsageRate":20,
                        "publicIPTotalNum":1,"publicIPUsedNum":0,"virtualFirewallTotalNum":10,"virtualFirewallUsedNum":2
                    }
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsmigrations": function (request, response) {
            var result = {"total":null,"drsMigrations":[{"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:2205","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/2205","createTime":"2014-09-20 07:32:22","applyTime":"2014-09-20 07:40:49","finishedTime":"2014-09-20 07:41:12","type":"migrateVm","reason":"LB_MEMORY","vmRecommendation":{"vmUrn":"urn:sites:3E3F0759:vms:i-0000047F","vmUri":"/service/sites/3E3F0759/vms/i-0000047F","vmName":"xutest","sourceHostUrn":"urn:sites:3E3F0759:hosts:237","sourceHostUri":"/service/sites/3E3F0759/hosts/237","sourceHostName":"R5CNA05","destinationHostUrn":"urn:sites:3E3F0759:hosts:246","destinationHostUri":"/service/sites/3E3F0759/hosts/246","destinationHostName":"R5CNA06"},"hostRecommendation":null},{"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:2206","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/2206","createTime":"2014-09-20 07:32:22","applyTime":"2014-09-20 07:40:53","finishedTime":"2014-09-20 07:41:15","type":"migrateVm","reason":"LB_MEMORY","vmRecommendation":{"vmUrn":"urn:sites:3E3F0759:vms:i-00000031","vmUri":"/service/sites/3E3F0759/vms/i-00000031","vmName":"linxq_FC2","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"},"hostRecommendation":null},{"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:2207","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/2207","createTime":"2014-09-20 07:32:22","applyTime":"2014-09-20 07:40:53","finishedTime":"2014-09-20 07:41:21","type":"migrateVm","reason":"LB_MEMORY","vmRecommendation":{"vmUrn":"urn:sites:3E3F0759:vms:i-00000030","vmUri":"/service/sites/3E3F0759/vms/i-00000030","vmName":"linxq_FC1","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"},"hostRecommendation":null}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/vms/4629700416936869889$urn:sites:3E3F0759:vms:i-000005F3/iso": function (original, response) {
        var result ={"devicePath":"D:/ISO_FM/FusionManager V100R005C00_SV.iso","attachCdromTime":"2014-10-11 03:09:59.574"}
        response(200, "success",result, {});
    },
        "GET /goku/rest/v1.5/irm/1/vms/4629700416936869889$urn:sites:3E3F0759:vms:i-000005F3": function (request, response) {
            var result =
            {"vmInfo":{"id":"4629700416936869891$urn:sites:488407E4:vms:i-00000047","rid":"urn:sites:488407E4:vms:i-00000047","hostUrn":"urn:sites:488407E4:hosts:14","hostName":"CNA01","hostId":10,"hostIp":"166.166.40.71","name":"FM01","location":"urn:sites:488407E4:hosts:14","availableZoneId":"","availableZoneName":"","vmOption":{"supportPauseResume":true,"supportVolumeRecycle":true,"supportSetMac":true,"supportRemoteAttach":true,"supportModifyDiskName":true,"zeroFillDiskIndependent":false,"cpuNeedReboot":true,"memoryNeedReboot":true,"deleteNeedStoped":false,"removeVmResources":false,"displayCreateVmTime":true,"displayTemporaryStatus":true,"supportHibernateDelete":true,"needToSyncVrm":true,"needAddToSG":true,"suppportModDiskPropertyOnline":true,"suppportAddDELNicOnline":true,"suppportExpandDiskOnline":true,"displayOriginalNetworkInfo":false},"vmConfig":{"attribute":{"bootOption":"cdrom","autoHibernate":false,"hibernateThreshholdM":60,"syncTimeWithHost":false,"reoverByHost":false,"clockMode":"freeClock","isEnableMemVol":false,"isEnableFt":null,"isAutoUpgrade":true,"attachType":false,"secureVmType":null,"enableHa":true},"cpu":{"quantity":6,"coresPerSocket":0,"reservation":15000,"weight":6000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":18432,"reservation":18432,"weight":184320,"level":10,"limit":18432,"memHotPlug":0},"disks":[{"quantityGB":120.0,"allocType":"thick","indepDisk":true,"diskName":"i-00000047-xvda","storageType":"local","type":"normal","storageLocation":"urn:sites:488407E4:datastores:1","strictThickFormat":true,"pciType":"IDE","persistentDisk":true,"volumeId":"4629700416936869891$urn:sites:488407E4:volumes:255","diskId":1,"diskUsed":0.0,"volumeguid":null,"storageName":"data","dataStoreId":10,"dataStoreUrn":"urn:sites:488407E4:datastores:1","dataStoreType":null,"disasterGroupName":null,"disasterGroupId":0,"volUsedSizeMB":122880,"volUsedSizeGB":120.0,"vmUsedSizeMB":9733,"vmUsedSizeGB":9.5,"vmRecycleSizeMB":-1,"vmRecycleSizeGB":-1.0,"supportRecycle":false,"supportModify":false,"volFileName":"urn:sites:488407E4:volumes:255","supportDiskManagement":true,"diskStatus":"USE","mediaType":"SAN-Any","maxReadBytes":0,"maxWriteBytes":0,"maxReadRequest":0,"maxWriteRequest":0,"volType":null,"volumeUuid":null,"isDataCopy":true,"isThin":false,"volNameOnDev":"49CE11949BC64B009BF805AA4F63551F","createTime":0,"ioWeight":null}],"usbControllers":[{"controllerType":"EHCI+UHCI","controllerKey":""}],"usbNum":0,"nics":[{"id":"4629700416936869891$urn:sites:488407E4:vms:i-00000047:nics:0","name":"eth0","portGroupId":"urn:sites:488407E4:dvswitchs:1:portgroups:1","networkType":"UNKNOWN","networkIdUsedByNic":0,"sequenceNum":0,"canRelaseIp":true,"pglongId":0,"portGroupName":"managePortgroup","mac":"28:6e:d4:88:c6:2f","ip":"166.166.40.41","ips6":null,"vlanid":null,"bandLimit":null,"subnetid":null,"networkid":null,"subnetMask":null,"gateWay":null,"primaryWins":null,"secondaryWins":null,"domainName":null,"domainSearch":null,"primaryDNS":null,"secondaryDNS":null,"fwType":null,"ipConfigType":null,"setGateway":true,"nicDBID":-1,"sgId":null,"sgName":null,"uri":null,"ipCheckResult":null,"floatIps":null}],"devices":[],"usb":[],"gpu":[]},"vmRebootConfig":{"cpu":{"quantity":6,"coresPerSocket":0,"reservation":15000,"weight":6000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":18432,"reservation":18432,"weight":184320,"level":10,"limit":18432,"memHotPlug":0}},"os":{"osVersionDesc":"","osType":"Linux","osVersion":43,"osVersiontype":"Novell SUSE Linux Enterprise Server 11 SP1 64bit","cpuQuantityLimit":0,"cpuSocketLimit":0,"memQuantityLimit":0,"supportCpuHotPlug":false,"supportMemHotPlug":false,"hostname":"FM01","password":"7fbHwLGJ","supportCustomizedName":false,"customizedOsName":""},"status":"running","repairStatus":null,"backupStatus":"NORMAL","osStatus":null,"vncAcessInfo":{"hostip":"166.166.40.71","vncport":5902,"vncpassword":"GUb3m8nB","vncEncMode":"","vncMode":"","shaEncFlag":true},"vappRid":"","vappId":0,"vappName":null,"tag":"","userName":"","description":"","createTime":"2014-09-26 02:21:04","creatorId":"","isTemplate":"false","isLinkClone":"false","statusStr":"","osStatusStr":"","cpuUsageRate":"","memUsageRate":"","diskUsageRate":"","vmInnerState":"","pvDriverStatus":"running","toolVersion":"1.3.10.11","toolInstallStatus":"empty","cdRomStatus":"fill","attachedFilePath":"D:/ISO_FM/FusionManager V100R005C00_SV.iso","group":"VRMGroup","clusterUrn":"urn:sites:488407E4:clusters:10","clusterId":"4625196817309499398","clusterName":"","nicByteIn":"","nicByteOut":"","uri":"","dc":"","zone":"","resourcepool":"","vmType":"fusioncompute","instanceuuid":"urn:sites:488407E4:vms:i-00000047","hypervisorId":"4629700416936869891","hypervisorName":"FCR3C10","cpuUsed":600,"memUsed":18678,"templateIsLost":"","vmVisibleId":"i-00000047","templateID":"0","vpcId":"-1","vpcName":null,"vdcId":null,"uuid":"08a9b29b-a579-4001-bf74-8e22778fe99c","locationName":"CNA01","dataStoreUrns":["urn:sites:488407E4:datastores:1"],"idle":0,"nicsTxLimit":[],"imcSetting":null,"hbaCardNum":"","beginRuntime":"2014-09-26 02:21:04","vsaVmType":null,"vsamVm":false,"disasterGroupId":0,"disasterGroupName":"","useDisasterGroup":false,"originalNetworks":[],"orgName":"","orgId":null,"alarmInfo":null,"domainId":"","domainName":null,"category":null,"cpuQosMap":{"1":{"maxCpuReserve":2500,"maxCpuLimit":2500},"2":{"maxCpuReserve":5000,"maxCpuLimit":5000},"3":{"maxCpuReserve":7500,"maxCpuLimit":7500},"4":{"maxCpuReserve":10000,"maxCpuLimit":10000},"5":{"maxCpuReserve":12500,"maxCpuLimit":12500},"6":{"maxCpuReserve":15000,"maxCpuLimit":15000},"7":{"maxCpuReserve":17500,"maxCpuLimit":17500},"8":{"maxCpuReserve":20000,"maxCpuLimit":20000},"9":{"maxCpuReserve":22500,"maxCpuLimit":22500},"10":{"maxCpuReserve":25000,"maxCpuLimit":25000},"11":{"maxCpuReserve":27500,"maxCpuLimit":27500},"12":{"maxCpuReserve":30000,"maxCpuLimit":30000},"13":{"maxCpuReserve":32500,"maxCpuLimit":32500},"14":{"maxCpuReserve":35000,"maxCpuLimit":35000},"15":{"maxCpuReserve":35000,"maxCpuLimit":37500},"16":{"maxCpuReserve":35000,"maxCpuLimit":40000},"17":{"maxCpuReserve":35000,"maxCpuLimit":42500},"18":{"maxCpuReserve":35000,"maxCpuLimit":45000},"19":{"maxCpuReserve":35000,"maxCpuLimit":47500},"20":{"maxCpuReserve":35000,"maxCpuLimit":50000},"21":{"maxCpuReserve":35000,"maxCpuLimit":52500},"22":{"maxCpuReserve":35000,"maxCpuLimit":55000}}}}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/serviceId1/v2/1/os-availability-zone/detail": function (request, response) {

            var result = {"availabilityZoneInfo": [{"zoneState": {"available": true}, "hosts": {"C415A22E-7271-11CF-8567-000000821800": {"nova-conductor": {"available": true, "active": true, "updated_at": "2014-10-14T08:11:31.804780"}, "nova-consoleauth": {"available": true, "active": true, "updated_at": "2014-10-14T08:11:26.124549"}, "nova-scheduler": {"available": true, "active": true, "updated_at": "2014-10-14T08:11:25.426791"}, "nova-console": {"available": true, "active": true, "updated_at": "2014-10-14T08:11:25.676044"}}}, "zoneName": "internal"}, {"zoneState": {"available": true}, "hosts": {"C415A22E-7271-11CF-8567-000000821800": {"nova-compute": {"available": true, "active": true, "updated_at": "2014-10-14T08:11:31.795080"}}}, "zoneName": "shenzhen_AZ01"}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks?shared=true&router:external=true": function (request, response) {

           var result =  {"networks": [{"status": "ACTIVE", "subnets": [], "name": "ExtNet_A01", "provider:physical_network": "physnet1", "admin_state_up": true, "tenant_id": "cd7a2afb30454349927b89ad5184f4f4", "provider:network_type": "vlan", "router:external": true, "shared": true, "id": "8cfb8ac6-27ce-40a7-b5d8-a2615a8d6ff7", "provider:segmentation_id": 145}, {"status": "ACTIVE", "subnets": [], "name": "ExtNet_A03", "provider:physical_network": "physnet1", "admin_state_up": true, "tenant_id": "cd7a2afb30454349927b89ad5184f4f4", "provider:network_type": "vlan", "router:external": true, "shared": true, "id": "cc63adba-47b2-4f58-a183-3ec861f15a32", "provider:segmentation_id": 128}, {"status": "ACTIVE", "subnets": ["1af813e4-34f6-440b-a165-5376816cd6fd"], "name": "ExtNet_A07", "provider:physical_network": "physnet1", "admin_state_up": true, "tenant_id": "cd7a2afb30454349927b89ad5184f4f4", "provider:network_type": "vlan", "router:external": true, "shared": true, "id": "e1576ed5-9b72-4793-9c25-ca828af3c910", "provider:segmentation_id": 123}], "networks_links": [{"href": "https://network.shenzhen_AZ01.vodafone.com/v2.0/networks?shared=true&router%3Aexternal=true&limit=10&marker=8cfb8ac6-27ce-40a7-b5d8-a2615a8d6ff7&page_reverse=True", "rel": "previous"}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/serviceId1/v2.0/physicalnetworks": function (request, response) {

            var result = {"physicalnetworks": [{"end_seg_id": 4000, "start_seg_id": 1, "type": "vlan", "id": "83996661-05ea-412c-8e6c-21446e6ed72a", "name": "physnet2"}, {"end_seg_id": 4000, "start_seg_id": 1, "type": "vlan", "id": "7a63cec3-dbfb-4a5d-8944-745b830b87c3", "name": "physnet1"}, {"end_seg_id": null, "start_seg_id": null, "type": "flat", "id": "a14fde2a-7b8a-4672-921f-bedb141ab813", "name": "physnet1"}, {"end_seg_id": null, "start_seg_id": null, "type": "flat", "id": "b530eebb-692d-4a42-9787-1016c8719660", "name": "physnet2"}]}
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/serviceId1/v2/1/servers/detail?all_tenants=1&host={host}": function (request, response) {

            var result = {"servers":[{"id":"c0448937-52f3-41b2-9dae-a867014e531c","name":"VM_A01","addresses":{"fdsafdsf_Router":[{"version":"4","addr":"191.100.71.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:bb:36:8b","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.shenzhen_AZ01.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/c0448937-52f3-41b2-9dae-a867014e531c","type":null},{"rel":"bookmark","href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/c0448937-52f3-41b2-9dae-a867014e531c","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},"flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-10-09T08:53:49Z","created":"2014-10-09T08:53:43Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"5d1ae81c-ec25-490a-87d8-0e71feb2e687","vnic_type":"normal"}],"config_drive":"","tenant_id":"91b1c0cfea914f2faff9c6b8b7bbe31d","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"default"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000007","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"shenzhen_AZ01","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-10-09T08:53:48.983390"},{"id":"e348a823-d952-4d25-a273-87e8ed2e3796","name":"VM_A02","addresses":{"testtt":[{"version":"4","addr":"191.100.78.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:2b:5f:f5","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.shenzhen_AZ01.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/e348a823-d952-4d25-a273-87e8ed2e3796","type":null},{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/e348a823-d952-4d25-a273-87e8ed2e3796","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},"flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-10-09T08:50:54Z","created":"2014-10-09T08:50:48Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"90ff7ee4-3b93-487e-b25d-2909b9f11318","vnic_type":"normal"}],"config_drive":"","tenant_id":"359c7079583a4c8db42ebfc247f3c6a9","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"default"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000006","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"shenzhen_AZ01","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-10-09T08:50:54.157093"},{"id":"02e74b3b-3162-4729-bf88-d392b6a004df","name":"VM_A03","addresses":{"Router_net_dafdsf":[{"version":"4","addr":"191.100.71.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:26:42:9c","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.shenzhen_AZ01.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/02e74b3b-3162-4729-bf88-d392b6a004df","type":null},{"rel":"bookmark","href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/02e74b3b-3162-4729-bf88-d392b6a004df","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},"flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-09-29T10:59:03Z","created":"2014-09-29T10:58:54Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"395d3b5c-3576-4a1f-bb5c-26ca56c20fee","vnic_type":"normal"}],"config_drive":"","tenant_id":"dd92796e0a6c436b9705602ffbfc090d","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"fdsafdsf"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000001","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"shenzhen_AZ01","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-09-29T10:59:03.338403"}],"servers_links":null}

            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group": function (request, response) {

            var result = {"os-affinity-group":[{"id":"c0448937-52f3-41b2-9dae-a867014e531c","name":"反亲和性组","type":"inffinity"}]};
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}": function (request, response) {

            var result = {"affinity_group":{"id":"c0448937-52f3-41b2-9dae-a867014e531c","name":"反亲和性组","type":"inffinity"}};
            response(200, "success", result, {});
        }
    });

    return fixture;
});