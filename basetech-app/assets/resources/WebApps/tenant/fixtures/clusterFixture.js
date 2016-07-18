define(["can/util/fixture/fixture"], function (fixture) {
    var clusterList = {
        "list": {
            "code": "",
            "message": "",
            "sort": "",
            "order": "",
            "start": 0,
            "total": 1,
            "size": 1,
            "resourceClusters": [
                {
                    "name": "clusterName1",
                    "id": "clusterId2",
                    "rid": "333",
                    "zoneId": "222",
                    "hypervisorId": "111",
                    "type": "1",
                    "domain": "aaa"
                }
            ]
        }
    };

    var capList = {
        "objectId": "",
        "resourceCapacityMap": {
            "cpu_capacity": {
                "totalCapacity": 2048,
                "reserveCapacity": 512,
                "availableCapacity": 1024,
                "usedCapacity": 1024,
                "allocatedCapacity": 128
            },
            "mem_capacity": {
                "totalCapacity": 4,
                "reserveCapacity": 1,
                "availableCapacity": 4,
                "usedCapacity": 2,
                "allocatedCapacity": 2
            },
            "storage_capacity": {
                "totalCapacity": 2673 ,
                "reserveCapacity": 512,
                "availableCapacity": 0,
                "usedCapacity": 817,
                "allocatedCapacity":929
            }
        }
    };

    var monitorList ={
        "objectId" : "",
        "realTimeMonitorMap":{
            "cpu_usage":10,
            "mem_usage":51,
            "disk_usage":22
        }
    }

    fixture({
        //概要页面，容量监控
        "POST /goku/rest/v1.5/irm/monitors/resource-capacity": function (request, response) {
            response(200, "success", capList, {})
        },
        //概要页面，实时监控信息
        "POST /goku/rest/v1.5/irm/monitors/realtime": function (request, response) {
            response(200, "success", monitorList, {})
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
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869889029/drs": function (request, response) {
            var result = {
                "drsParams":{"clusterId":"4625196817309499393","drsSwitch":true,"drsLevel":3,"drsFragmentLimen":[{"fragmentTime":0,"limen":5},{"fragmentTime":1,"limen":5},{"fragmentTime":2,"limen":5},{"fragmentTime":3,"limen":5},{"fragmentTime":4,"limen":5},{"fragmentTime":5,"limen":5},{"fragmentTime":6,"limen":5},{"fragmentTime":7,"limen":5},{"fragmentTime":8,"limen":5},{"fragmentTime":9,"limen":5},{"fragmentTime":10,"limen":5},{"fragmentTime":11,"limen":5},{"fragmentTime":12,"limen":5},{"fragmentTime":13,"limen":5},{"fragmentTime":14,"limen":5},{"fragmentTime":15,"limen":5},{"fragmentTime":16,"limen":5},{"fragmentTime":17,"limen":5},{"fragmentTime":18,"limen":5},{"fragmentTime":19,"limen":5},{"fragmentTime":20,"limen":5},{"fragmentTime":21,"limen":5},{"fragmentTime":22,"limen":5},{"fragmentTime":23,"limen":5}],"drsCycle":{"cycleType":1,"cycleSpec":null},"drsLimen":5,"drsGroupInfos":null,"drsRules":[{"operationType":null,"ruleIndex":774,"ruleName":"1huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","name":"FM-Dsware"}],"createTime":"2014-09-25 13:30:10","updateTime":"2014-09-25 13:30:10","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":772,"ruleName":"1juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","name":"FM-Dsware"}],"createTime":"2014-09-25 13:29:56","updateTime":"2014-09-25 13:29:56","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":756,"ruleName":"3huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000017","name":"IE11"}],"createTime":"2014-09-25 13:06:57","updateTime":"2014-09-25 13:06:57","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":748,"ruleName":"3juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000017","name":"IE11"}],"createTime":"2014-09-25 13:06:12","updateTime":"2014-09-25 13:06:12","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":758,"ruleName":"4huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000015","name":"vm-template"}],"createTime":"2014-09-25 13:07:08","updateTime":"2014-09-25 13:07:08","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":750,"ruleName":"4juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000015","name":"vm-template"}],"createTime":"2014-09-25 13:06:19","updateTime":"2014-09-25 13:06:19","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":780,"ruleName":"FMVTP_SZA01","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000003","name":"FM-R3C10"}],"createTime":"2014-09-26 00:52:06","updateTime":"2014-09-26 00:52:06","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":776,"ruleName":"jujiFM01","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000006","name":"FM01"}],"createTime":"2014-09-26 00:41:23","updateTime":"2014-09-26 00:41:23","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":778,"ruleName":"rgrdsvf","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000003","name":"FM-R3C10"}],"createTime":"2014-09-26 00:51:59","updateTime":"2014-09-26 00:51:59","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null}],"powerLevel":0,"powerFragmentLimen":[{"fragmentTime":0,"limen":5},{"fragmentTime":1,"limen":5},{"fragmentTime":2,"limen":5},{"fragmentTime":3,"limen":5},{"fragmentTime":4,"limen":5},{"fragmentTime":5,"limen":5},{"fragmentTime":6,"limen":5},{"fragmentTime":7,"limen":5},{"fragmentTime":8,"limen":5},{"fragmentTime":9,"limen":5},{"fragmentTime":10,"limen":5},{"fragmentTime":11,"limen":5},{"fragmentTime":12,"limen":5},{"fragmentTime":13,"limen":5},{"fragmentTime":14,"limen":5},{"fragmentTime":15,"limen":5},{"fragmentTime":16,"limen":5},{"fragmentTime":17,"limen":5},{"fragmentTime":18,"limen":5},{"fragmentTime":19,"limen":5},{"fragmentTime":20,"limen":5},{"fragmentTime":21,"limen":5},{"fragmentTime":22,"limen":5},{"fragmentTime":23,"limen":5}],"factor":3,"drsBalance":1,"dpmThresholds":[{"limen":1,"underloadThreshold":0,"overloadThreshold":63},{"limen":3,"underloadThreshold":23,"overloadThreshold":72},{"limen":5,"underloadThreshold":45,"overloadThreshold":81},{"limen":7,"underloadThreshold":54,"overloadThreshold":90},{"limen":9,"underloadThreshold":63,"overloadThreshold":100}],"enableVmDrs":false}
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/4629700416936869889029/usbs": function (request, response) {
            var result = {
                "usbs":[{"usbId":"4629700416936869889$urn:sites:4DA80840:usbs:80_4_1","usbKey":0,"hostId":"2","productId":"2010","description":"USB Device. SONiX","status":"Ready","vmId":null,"vmName":null,"allocateStatus":"UnAllocated","isEnableMigrate":false,"usbControllerType":null,"version":"1.10"}]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/usbs": function (request, response) {
            var result = {
                "usbs":[{"usbId":"4629700416936869889$urn:sites:4DA80840:usbs:80_4_1","usbKey":0,"hostId":"2","productId":"2010","description":"USB Device. SONiX","status":"Ready","vmId":null,"vmName":null,"allocateStatus":"UnAllocated","isEnableMigrate":false,"usbControllerType":null,"version":"1.10"}]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drs": function (request, response) {
            var result = {
                "drsParams":{"clusterId":"4625196817309499393","drsSwitch":true,"drsLevel":3,"drsFragmentLimen":[{"fragmentTime":0,"limen":5},{"fragmentTime":1,"limen":5},{"fragmentTime":2,"limen":5},{"fragmentTime":3,"limen":5},{"fragmentTime":4,"limen":5},{"fragmentTime":5,"limen":5},{"fragmentTime":6,"limen":5},{"fragmentTime":7,"limen":5},{"fragmentTime":8,"limen":5},{"fragmentTime":9,"limen":5},{"fragmentTime":10,"limen":5},{"fragmentTime":11,"limen":5},{"fragmentTime":12,"limen":5},{"fragmentTime":13,"limen":5},{"fragmentTime":14,"limen":5},{"fragmentTime":15,"limen":5},{"fragmentTime":16,"limen":5},{"fragmentTime":17,"limen":5},{"fragmentTime":18,"limen":5},{"fragmentTime":19,"limen":5},{"fragmentTime":20,"limen":5},{"fragmentTime":21,"limen":5},{"fragmentTime":22,"limen":5},{"fragmentTime":23,"limen":5}],"drsCycle":{"cycleType":1,"cycleSpec":null},"drsLimen":5,"drsGroupInfos":null,"drsRules":[{"operationType":null,"ruleIndex":774,"ruleName":"1huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","name":"FM-Dsware"}],"createTime":"2014-09-25 13:30:10","updateTime":"2014-09-25 13:30:10","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":772,"ruleName":"1juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000019","name":"FM-Dsware"}],"createTime":"2014-09-25 13:29:56","updateTime":"2014-09-25 13:29:56","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":756,"ruleName":"3huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000017","name":"IE11"}],"createTime":"2014-09-25 13:06:57","updateTime":"2014-09-25 13:06:57","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":748,"ruleName":"3juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000017","name":"IE11"}],"createTime":"2014-09-25 13:06:12","updateTime":"2014-09-25 13:06:12","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":758,"ruleName":"4huchi","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000015","name":"vm-template"}],"createTime":"2014-09-25 13:07:08","updateTime":"2014-09-25 13:07:08","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":750,"ruleName":"4juji","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000015","name":"vm-template"}],"createTime":"2014-09-25 13:06:19","updateTime":"2014-09-25 13:06:19","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":780,"ruleName":"FMVTP_SZA01","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000003","name":"FM-R3C10"}],"createTime":"2014-09-26 00:52:06","updateTime":"2014-09-26 00:52:06","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":776,"ruleName":"jujiFM01","ruleType":1,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000006","name":"FM01"}],"createTime":"2014-09-26 00:41:23","updateTime":"2014-09-26 00:41:23","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null},{"operationType":null,"ruleIndex":778,"ruleName":"rgrdsvf","ruleType":2,"vm2HostRuleType":null,"vms":[{"urn":"4629700416936869889$urn:sites:4DA80840:vms:i-00000003","name":"FM-R3C10"}],"createTime":"2014-09-26 00:51:59","updateTime":"2014-09-26 00:51:59","vmGroupUrn":null,"vmGroupInfo":null,"hostGroupUrn":null,"hostGroupInfo":null}],"powerLevel":0,"powerFragmentLimen":[{"fragmentTime":0,"limen":5},{"fragmentTime":1,"limen":5},{"fragmentTime":2,"limen":5},{"fragmentTime":3,"limen":5},{"fragmentTime":4,"limen":5},{"fragmentTime":5,"limen":5},{"fragmentTime":6,"limen":5},{"fragmentTime":7,"limen":5},{"fragmentTime":8,"limen":5},{"fragmentTime":9,"limen":5},{"fragmentTime":10,"limen":5},{"fragmentTime":11,"limen":5},{"fragmentTime":12,"limen":5},{"fragmentTime":13,"limen":5},{"fragmentTime":14,"limen":5},{"fragmentTime":15,"limen":5},{"fragmentTime":16,"limen":5},{"fragmentTime":17,"limen":5},{"fragmentTime":18,"limen":5},{"fragmentTime":19,"limen":5},{"fragmentTime":20,"limen":5},{"fragmentTime":21,"limen":5},{"fragmentTime":22,"limen":5},{"fragmentTime":23,"limen":5}],"factor":3,"drsBalance":1,"dpmThresholds":[{"limen":1,"underloadThreshold":0,"overloadThreshold":63},{"limen":3,"underloadThreshold":23,"overloadThreshold":72},{"limen":5,"underloadThreshold":45,"overloadThreshold":81},{"limen":7,"underloadThreshold":54,"overloadThreshold":90},{"limen":9,"underloadThreshold":63,"overloadThreshold":100}],"enableVmDrs":false}
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/4616189618054758401075501001": function (request, response) {
            var result = {"drsParams":{"clusterId":"4625196817309499393","drsSwitch":true,"drsLevel":1,"drsFragmentLimen":[{"fragmentTime":0,"limen":9},{"fragmentTime":1,"limen":9},{"fragmentTime":2,"limen":9},{"fragmentTime":3,"limen":9},{"fragmentTime":4,"limen":9},{"fragmentTime":5,"limen":9},{"fragmentTime":6,"limen":9},{"fragmentTime":7,"limen":9},{"fragmentTime":8,"limen":9},{"fragmentTime":9,"limen":9},{"fragmentTime":10,"limen":9},{"fragmentTime":11,"limen":9},{"fragmentTime":12,"limen":9},{"fragmentTime":13,"limen":9},{"fragmentTime":14,"limen":9},{"fragmentTime":15,"limen":9},{"fragmentTime":16,"limen":9},{"fragmentTime":17,"limen":9},{"fragmentTime":18,"limen":9},{"fragmentTime":19,"limen":9},{"fragmentTime":20,"limen":9},{"fragmentTime":21,"limen":9},{"fragmentTime":22,"limen":9},{"fragmentTime":23,"limen":9}],"drsCycle":{"cycleType":1,"cycleSpec":null},"drsLimen":9,"drsGroupInfos":null,"drsRules":[],"powerLevel":0,"powerFragmentLimen":[{"fragmentTime":0,"limen":5},{"fragmentTime":1,"limen":5},{"fragmentTime":2,"limen":5},{"fragmentTime":3,"limen":5},{"fragmentTime":4,"limen":5},{"fragmentTime":5,"limen":5},{"fragmentTime":6,"limen":5},{"fragmentTime":7,"limen":5},{"fragmentTime":8,"limen":5},{"fragmentTime":9,"limen":5},{"fragmentTime":10,"limen":5},{"fragmentTime":11,"limen":5},{"fragmentTime":12,"limen":5},{"fragmentTime":13,"limen":5},{"fragmentTime":14,"limen":5},{"fragmentTime":15,"limen":5},{"fragmentTime":16,"limen":5},{"fragmentTime":17,"limen":5},{"fragmentTime":18,"limen":5},{"fragmentTime":19,"limen":5},{"fragmentTime":20,"limen":5},{"fragmentTime":21,"limen":5},{"fragmentTime":22,"limen":5},{"fragmentTime":23,"limen":5}],"factor":3,"drsBalance":0,"dpmThresholds":[{"limen":1,"underloadThreshold":0,"overloadThreshold":63},{"limen":3,"underloadThreshold":23,"overloadThreshold":72},{"limen":5,"underloadThreshold":45,"overloadThreshold":81},{"limen":7,"underloadThreshold":54,"overloadThreshold":90},{"limen":9,"underloadThreshold":63,"overloadThreshold":100}],"enableVmDrs":false}}
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsrecommendations": function (request, response) {
            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsrecommendations?start=0&limit=10": function (request, response) {
            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}
            response(200, "success", result, {})
        },
        "POST /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsrecommendations/action": function (request, response) {
            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}
            response(200, "success", result, {})
        },
        "POST /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsvmconfig": function (request, response) {
            var result = {"drsRecommendations":[{"drsAction":[{"vmUrn":"urn:sites:3E3F0759:vms:i-000005F1","vmUri":"/service/sites/3E3F0759/vms/i-000005F1","vmName":"ame_vpc-ProxyVM-","sourceHostUrn":"urn:sites:3E3F0759:hosts:224","sourceHostUri":"/service/sites/3E3F0759/hosts/224","sourceHostName":"R5CNA03","destinationHostUrn":"urn:sites:3E3F0759:hosts:237","destinationHostUri":"/service/sites/3E3F0759/hosts/237","destinationHostName":"R5CNA05"}],"urn":"urn:sites:3E3F0759:clusters:169:drsrecommendations:15243","uri":"/service/sites/3E3F0759/clusters/169/drsrecommendations/15243","createTime":"2014-10-13 02:46:48","reasonText":"LB_MEMORY","applyTime":null,"type":null,"dependences":null,"rating":null,"vmRecommendation":null,"hostRecommendation":null}]}
            response(200, "success", result, {})
        },
        "POST /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/resourcegroups": function (request, response) {
            var result = {"groups":[]}
            response(200, "success", result, {})
        },
        "POST /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/resourcegroups/action": function (request, response) {
            var result = {"groupUrn":null}
            response(200, "success", result, {})
        },
        "PUT /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drs": function (request, response) {
            var result = {};
            response(200, "success", result, {})
        },
        "PUT /goku/rest/v1.5/irm/1/resourceclusters/46297004169368698890755/drsvmconfig": function (request, response) {
            var result = {};
            response(200, "success", result, {})
        }
    });
    return fixture;
});