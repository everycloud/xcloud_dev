define(["can/util/fixture/fixture"], function (fixture) {

    fixture({
        "GET /az/azTag": function (original, response) {
            var rules = [
                {
                    "name": "Storage Type",
                    "value": "IPSAN"
                },
                {
                    "name": "CPUO ptimization",
                    "value": "yes"
                }
            ];
            response(200, "success", rules, {});
        },
        "GET /az/org": function (original, response) {
            var rules = [
                {
                    "name": "Storage Type",
                    "num": "345",
                    "use": "34",
                    "size": "44",
                    "azNum": 54
                }
            ];
            response(200, "success", rules, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras/102900101": function (original, response) {
            var result =
            {
                "cloudInfra":{
                    "id":"102900101","name":"FusionSphere_xian01","region":"xian","type":"fusionmanager","version":"1.5.0",
                    "connectStatus":"connected","serviceStatus":"normal","taskStatus":"succeed","errorCode":null,"ip":"191.100.71.5",
                    "port":443,"url":null,"description":null,"connectorErrorCode":null,"userName":"FMRest","password":"Admin@123",
                    "provider":"Hauwei","createTime":"2014-09-28 12:56:08","modifyTime":"2014-09-28 12:56:08","connectFailedTime":"",
                    "metadata":null,"protocol":"https","cycle":10,"connectorId":4634204016564240421
                }
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/cloud-infras": function (original, response) {
            response(200, "success", {"cloudInfras":[{"name":"FusionSphere_xian01","id":"102900101"}]}, {});
        },
        "POST /goku/rest/v1.5/1/cloud-infras/0755001/action": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/1/cloud-infras/029001/action": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/1/cloud-infras/0755001": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/1/cloud-infras/029001": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras/029001": function (original, response) {
            var result = {
                "cloudInfra":{
                    "id":"029001","name":"cloudRP_A01","region":"xian","type":"FusionManager",
                    "version":"R5C00","connectStatus":"connected","serviceStatus":"normal",
                    "taskStatus":"succeed","errorCode":"0","ip":"191.100.71.100","port":8643,"url":null,
                    "description":"Located in Xi'an cloud resource pools","connectorErrorCode":null,"userName":"FMRest",
                    "password":"FusionSphere@CLOUD8!","provider":null,"createTime":"2014-09-23 12:19:45",
                    "modifyTime":"2014-09-25 12:19:45","connectFailedTime":"2014-09-24 13:07:23","metadata":null,
                    "protocol":"https","cycle":10,"connectorId":1011
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras/0755001": function (original, response) {
            var result = {
                "cloudInfra":{
                    "id":"0755001","name":"cloudRP_B01","region":"shenzhen","type":"FusionManager",
                    "version":"R5C00","connectStatus":"connected","serviceStatus":"pause",
                    "taskStatus":"succeed","errorCode":"0","ip":"160.66.26.100","port":8643,"url":null,
                    "description":"Cloud resource pool in Shenzhen","connectorErrorCode":null,"userName":"FMRest",
                    "password":"FusionSphere@CLOUD8!","provider":null,"createTime":"2014-09-23 12:19:45",
                    "modifyTime":"2014-09-25 12:19:45","connectFailedTime":"2014-09-24 13:07:23","metadata":null,
                    "protocol":"https","cycle":10,"connectorId":1011
                }
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?manage-status=occupied&cloud-infra=029001": function (original, response) {
            var result = {
                "total":1,
                "availableZones":
                    [
                        {"id": "4616189618054758401029", "cloudInfraId": "029001", "cloudInfraName": "cloudRP_A01",
                            "name":"azone_02900101","description":null,"manageStatus":"occupied","serviceStatus":"normal",
                            "associatedOrgNum":4,"tags":{"datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"
                        }]}}]
            }
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?manage-status=occupied&cloud-infra=0755001": function (original, response) {
            var result = {
                "total":1,
                "availableZones":
                    [
                        {"id": "46161896180547584010755", "cloudInfraId": "029001", "cloudInfraName": "cloudRP_A01",
                            "name": "azone_075500101", "description": null, "manageStatus": "occupied", "serviceStatus": "normal",
                            "associatedOrgNum": 4, "tags": {"datastore": [
                            {"name": "FusionManager_MediaType", "value": "SAN-Any"
                            }
                        ]}}
                    ]
            }
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/vpcs/-1/vms/statistics?cloud-infra=029001": function (original, response) {
            var result = {
                "runningVmQuantity":1,"stoppedVmQuantity":1,"others":0
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/vpcs/-1/vms/statistics?cloud-infra=0755001": function (original, response) {
            var result = {
                "runningVmQuantity":0,"stoppedVmQuantity":0,"others":0
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?manage-status=free&cloud-infra=029001": function (original, response) {
            var result = {
                "total":0,"availableZones":null
        }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?manage-status=free&cloud-infra=0755001": function (original, response) {
            var result;
            result = {
                "total": 0, "availableZones": null
            };
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/statistics/available-zones?cloud-infra=029001": function (original, response) {
            var result;
            result = {
                "capacityAZs": {
                    "4616189618054758401029": {
                        "vcpuFreeSize": 52.8, "vcpuAllocatedSize": 14.4, "memFreeSize": 73.1,
                        "memAllocatedSize": 14.7, "storageFreeSize": 2277.0, "storageOccupancySize": 563.0,
                        "storageAllocatedSize": 677.0, "vcpuReserveRate": 21, "memReserveRate": 17,
                        "storagePoolAllocatedRate": 24, "storagePoolOccupancyRate": 20, "subnetFreeNum": 0,
                        "subnetAllocatedNum": 0, "subnetAllocatedRate": 0, "vlanIdFreeNum": 0,
                        "vlanIdAllocatedNum": 0, "vlanIdAllocatedRate": 0
                    }
                }
            };
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/statistics/available-zones?cloud-infra=0755001": function (original, response) {
            var result;
            result = {
                "capacityAZs": {
                    "46161896180547584010755": {
                        "vcpuFreeSize": 52.8, "vcpuAllocatedSize": 14.4, "memFreeSize": 73.1,
                        "memAllocatedSize": 14.7, "storageFreeSize": 2277.0, "storageOccupancySize": 563.0,
                        "storageAllocatedSize": 677.0, "vcpuReserveRate": 21, "memReserveRate": 17,
                        "storagePoolAllocatedRate": 24, "storagePoolOccupancyRate": 20, "subnetFreeNum": 0,
                        "subnetAllocatedNum": 0, "subnetAllocatedRate": 0, "vlanIdFreeNum": 0,
                        "vlanIdAllocatedNum": 0, "vlanIdAllocatedRate": 0
                    }
                }
            };
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/vms/statistics": function (original, response) {
            var result;
            result = {
                "runningQuantity":0,"stoppedQuantity":0,"faultQuantity":0,"others":0
            };
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/device-state": function (original, response) {
            var result;
            result = {
                "code":"","message":"","hostUse":0,"hostUnUse":0,"hostNormal":0,"hostUnNormal":0,"ipsanNormal":0,"switchNormal":0,"switchUnNormal":0,"ipsanUnNormal":0
            };
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/zones/action": function (original, response) {
            var result = {
                "list":{
                    "sort":"id","order":"desc","start":0,"total":2,"size":10,"zones":[

                        {
                            "name":"ZONE_SHENZHEN","region":"shenzhen","description":"Xi'an Resource Partitions","networkMode":"FIREWALL_ONLY",
                            "id":"46161896180547584010755","createTime":"2014-08-25 08:01:03","lastModifiedTime":"2014-09-21 06:23:14"
                        }
                    ]
                }
            }
            response(200, "success", result, {});
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
//=====================================================================
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&connect-status=connected": function (original, response) {
            var cloudpoolList;
            cloudpoolList = {
                "total": 2,
                "cloudInfras": [
                    {"id": "029001", "name": "cloudRP_A01", "region": "xian", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "normal",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "191.100.71.100", "port": 8643, "url": null,
                        "description": "Located in Xi'an cloud resource pools", "connectorErrorCode": null
                    },
                    {"id": "0755001", "name": "cloudRP_B01", "region": "shenzhen", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "pause",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "160.66.26.100", "port": 8643, "url": null,
                        "description": "Cloud resource pool in Shenzhen", "connectorErrorCode": null
                    }
                ]
            };
            response(200, "success", cloudpoolList, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&connect-status=connecting": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&connect-status=connected_failed": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&connect-status=disconnected": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&service-status=abnormal": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&service-status=normal": function (original, response) {
            var cloudpoolList;
            cloudpoolList = {
                "total": 2,
                "cloudInfras": [
                    {"id": "029001", "name": "cloudRP_A01", "region": "xian", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "normal",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "191.100.71.100", "port": 8643, "url": null,
                        "description": "Located in Xi'an cloud resource pools", "connectorErrorCode": null
                    }
                ]
            };
            response(200, "success", cloudpoolList, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10&service-status=pause": function (original, response) {
            var cloudpoolList;
            cloudpoolList = {
                "total": 2,
                "cloudInfras": [
                    {"id": "0755001", "name": "cloudRP_B01", "region": "shenzhen", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "pause",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "160.66.26.100", "port": 8643, "url": null,
                        "description": "Cloud resource pool in Shenzhen", "connectorErrorCode": null
                    }
                ]
            };
            response(200, "success", cloudpoolList, {});
        },
        "GET /goku/rest/v1.5/1/cloud-infras?start=0&limit=10": function (original, response) {
            var cloudpoolList;
            cloudpoolList = {
                "total": 2,
                "cloudInfras": [
                    {"id": "029001", "name": "cloudRP_A01", "region": "xian", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "normal",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "191.100.71.100", "port": 8643, "url": null,
                        "description": "Located in Xi'an cloud resource pools", "connectorErrorCode": null
                    },
                    {"id": "0755001", "name": "cloudRP_B01", "region": "shenzhen", "type": "FusionManager",
                        "version": "R5C00", "connectStatus": "connected", "serviceStatus": "pause",
                        "taskStatus": "succeed", "errorCode": "0000030000", "ip": "160.66.26.100", "port": 8643, "url": null,
                        "description": "Cloud resource pool in Shenzhen", "connectorErrorCode": null
                    }
                ]
            };
            response(200, "success", cloudpoolList, {});
        },
        "GET /goku/rest/v1.5/statistics/cloud-infra": function (original, response) {
            var result = {
                "cloudInfraCapacity": [
                    {
                        "id": "029001",
                        "name": "cloudRP_A01",
                        "cpuTotalSize": 67.2,
                        "cpuUsedSize": 15.4,
                        "memTotalSize": 56.4,
                        "memUsedSize": 16.1,
                        "storagePoolTotalSize": 634.3,
                        "storagePoolUsedSize": 594.0,
                        "storageAllocatedSize": 594.0,
                        "vlanTotalNum": 6, "vlanUsedNum": 5,
                        "publicIPTotalNum": 0,
                        "publicIPUsedNum": 0,
                        "virtualFirewallTotalNum": 0,
                        "virtualFirewallUsedNum": 0
                    },
                    {
                        "id": "0755001",
                        "name": "cloudRP_B01",
                        "cpuTotalSize": 67.2,
                        "cpuUsedSize": 15.4,
                        "memTotalSize": 56.4,
                        "memUsedSize": 16.1,
                        "storagePoolTotalSize": 634.3,
                        "storagePoolUsedSize": 594.0,
                        "storageAllocatedSize": 594.0,
                        "vlanTotalNum": 6,
                        "vlanUsedNum": 2,
                        "publicIPTotalNum": 0,
                        "publicIPUsedNum": 0,
                        "virtualFirewallTotalNum": 0,
                        "virtualFirewallUsedNum": 0
                    }
                ]
            };

            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/cloud-infras": function (original, response) {
            var ret = {"total": 2, "cloudInfras": [
                {"id": "029001", "name": "cloudRP_A01", "region": "xian", "type": "FusionManager",
                    "version": "R5C00", "connectStatus": "connected", "serviceStatus": "normal",
                    "taskStatus": "failed", "errorCode": "0000030000", "ip": "191.100.71.100",
                    "port": 8643, "url": null, "description": "Located in Xi'an cloud resource pools"},
                {"id": "0755001", "name": "cloudRP_B01", "region": "shenzhen", "type": "FusionManager",
                    "version": "R5C00", "connectStatus": "connected", "serviceStatus": "pause",
                    "taskStatus": "failed", "errorCode": "0000030000", "ip": "160.66.26.100",
                    "port": 8643, "url": null, "description": "Cloud resource pool in Shenzhen"}
            ]};
            response(200, "success", ret, {});
        },
        "GET /goku/rest/v1.5/az/02900101/vdcs?start=0&limit=10&cloud-infra=029001": function (original, response) {
            var result ={
                "total":1,"vdcList":[
                    {"id":"029001","name":"az_xian_vda01","createTime":"2014-09-13 06:05:49.487","defaultVdc":false,
                        "description":"Creating the first VDC","allQuota":true,"quotaInfo":[{"quotaName":"CPU","limit":-1},
                        {"quotaName":"MEMORY","limit":-1},{"quotaName":"STORAGE","limit":-1},{"quotaName":"VPC","limit":-1},
                        {"quotaName":"EIP","limit":-1},{"quotaName":"SEG","limit":-1},{"quotaName":"VM","limit":-1}],
                        "quotaUsage":[{"quotaName":"CPU","value":0},{"quotaName":"MEMORY","value":0},{"quotaName":"STORAGE","value":0},
                            {"quotaName":"VPC","value":1},{"quotaName":"EIP","value":0},{"quotaName":"SEG","value":0},{"quotaName":"VM","value":0}]}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/az/075500101/vdcs?start=0&limit=10&cloud-infra=029001": function (original, response) {
            var result ={
                "total":1,"vdcList":[
                    {"id":"029001","name":"az_xian_vda01","createTime":"2014-09-13 06:05:49.487","defaultVdc":false,
                        "description":"Creating the first VDC","allQuota":true,"quotaInfo":[{"quotaName":"CPU","limit":-1},
                        {"quotaName":"MEMORY","limit":-1},{"quotaName":"STORAGE","limit":-1},{"quotaName":"VPC","limit":-1},
                        {"quotaName":"EIP","limit":-1},{"quotaName":"SEG","limit":-1},{"quotaName":"VM","limit":-1}],
                        "quotaUsage":[{"quotaName":"CPU","value":0},{"quotaName":"MEMORY","value":0},{"quotaName":"STORAGE","value":0},
                            {"quotaName":"VPC","value":1},{"quotaName":"EIP","value":0},{"quotaName":"SEG","value":0},{"quotaName":"VM","value":0}]}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/vdcs?start=0&limit=50": function (original, response) {
            var result ={
                "total":3,"vdcList":
                    [
                        {"id":"9223372036854775806","name":"DefaultSharedORG","createTime":"2014-09-12 10:04:22 UTC+08:00",
                            "defaultVdc":true,"description":"Create the first default VDC","allQuota":true,"quotaInfo":null,"quotaUsage":null},
                        {"id":"9223372036854775807","name":"DefaultVPCORG","createTime":"2014-09-12 10:04:22 UTC+08:00",
                            "defaultVdc":true,"description":"Default VDC","allQuota":true,"quotaInfo":null,"quotaUsage":null}]
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/az/02900101/vdcs/action?cloud-infra=029001": function (original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/1/available-zones?cloud-infra=029001&start=0&limit=10&manage-status=free&service-status=normal": function (original, response) {
            response(200, "success", {}, {});
        },

        "POST /goku/rest/v1.5/1/available-zones/list": function (original, response) {
            var result = {
                "total":2,
                    "availableZones":
                        [
                            {
                                "id":"02900101",
                                "cloudInfraId":"029001",
                                "cloudInfraName":"cloudRP_A01",
                                "name":"xian_AZ01",
                                "description":"One belonging to a cluster cloudRP_A01 Xi'an resources available under the partition",
                                "manageStatus":"occupied",
                                "serviceStatus":"normal",
                                "associatedOrgNum":1,
                                "tags":{
                                    "datastore":[{
                                        "name":"FusionManager_MediaType",
                                        "value":"SAN-Any"
                                    }
                                    ]
                                }
                            },
                            {
                                "id":"075500101",
                                "cloudInfraId":"0755001",
                                "cloudInfraName":"cloudRP_B01",
                                "name":"shenzhen_AZ01",
                                "description":"A cluster cloudRP_B01 affiliated Shenzhen resources available under the partition",
                                "manageStatus":"occupied",
                                "serviceStatus":"pause",
                                "associatedOrgNum":0,
                                "tags":{
                                    "datastore":[{
                                        "name":"FusionManager_MediaType",
                                        "value":"SAN-Any"
                                    }
                                    ]
                                }
                            }
                        ]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?start=0&manage-status=free&cloud-infra=102900101": function (original, response) {
            var result = {
                "total":2,
                    "availableZones":
                        [
                            {
                                "id":"02900101",
                                "cloudInfraId":"029001",
                                "cloudInfraName":"cloudRP_A01",
                                "name":"xian_AZ01",
                                "description":"One belonging to a cluster cloudRP_A01 Xi'an resources available under the partition",
                                "manageStatus":"occupied",
                                "serviceStatus":"normal",
                                "associatedOrgNum":1,
                                "tags":{
                                    "datastore":[{
                                        "name":"FusionManager_MediaType",
                                        "value":"SAN-Any"
                                    }
                                    ]
                                }
                            },
                            {
                                "id":"075500101",
                                "cloudInfraId":"0755001",
                                "cloudInfraName":"cloudRP_B01",
                                "name":"shenzhen_AZ01",
                                "description":"A cluster cloudRP_B01 affiliated Shenzhen resources available under the partition",
                                "manageStatus":"occupied",
                                "serviceStatus":"pause",
                                "associatedOrgNum":0,
                                "tags":{
                                    "datastore":[{
                                        "name":"FusionManager_MediaType",
                                        "value":"SAN-Any"
                                    }
                                    ]
                                }
                            }
                        ]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones/02900101?cloud-infra=029001": function (original, response) {
            var result = {
                "availableZone":{
                    "id":"02900101","cloudInfraId":"029001","name":"shenzhen_AZ01","description":"One belonging to a cluster cloudRP_A01 Xi'an resources available under the partition","manageStatus":"occupied",
                    "serviceStatus":"pause","cloudInfraName":"cloudRP_B01","cloudInfraType":1,"associatedOrgNum":1,"tags":{
                        "datastore":[{
                            "name":"FusionManager_MediaType","value":"SAN-Any"}]},
                    "resources":[{"resourceType":"VM","total":"0","unit":null},
                        {"resourceType":"Volume","total":"0","unit":null}]}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/all/available-zones/02900101/tags?cloud-infra=029001": function (original, response) {
            var result = {
                "datastore":[{"name":"FusionManager_MediaType","value":"SAN-Any"}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones/075500101?cloud-infra=029001": function (original, response) {
            var result = {
                "availableZone":{
                    "id":"075500101","cloudInfraId":"0755001","name":"xian_AZ01","description":"A cluster cloudRP_B01 affiliated Shenzhen resources available under the partition","manageStatus":"occupied",
                    "serviceStatus":"normal","cloudInfraName":"cloudRP_A01","cloudInfraType":1,"associatedOrgNum":1,"tags":{
                        "datastore":[{
                            "name":"FusionManager_MediaType","value":"SAN-Any"}]},
                    "resources":[{"resourceType":"VM","total":"0","unit":null},
                        {"resourceType":"Volume","total":"0","unit":null}]}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/all/tag-groups": function (original, response) {
            var result = {
                "total":2,"tagGroups":[{"name":"SLA","values":["GOLD","SILVER","COPPER","fasf-g"],"resources":null},{"name":"FusionManager_MediaType","values":["SAN-Any"],"resources":{"availableZone":[{"id":"4616189618054758401","cloudInfraId":"34"}]}}]
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/all/tags/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/available-zones": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/vdcs/9223372036854775806/cloud-infras": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/az/075500101/vdcs/action?cloud-infra=029001": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/available-zones/075500101/action?cloud-infra=029001": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "DELETE /goku/rest/v1.5/1/available-zones/075500101?cloud-infra=029001": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/1/available-zones?cloud-infra=029001&start=0&limit=10&manage-status=free&service-status=normal": function (original, response) {
            var result = {
                "total":0,"availableZones":null
        }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/1/available-zones/02900101/action?cloud-infra=029001": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/vdcs/9223372036854775807/cloud-infras": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        }

    });

    return fixture;
});