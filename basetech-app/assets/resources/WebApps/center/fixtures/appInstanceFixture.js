define(["can/util/fixture/fixture", "./appInstanceTopoJSON"], function (fixture, appJSON) {
    "use strict";
    var appInstanceTopo = {
        "appBasicInfo": {
            "appId": "app-instance-001",
            "appName": "diszar",
            "vdcId": "123",
            "userName": "tdp",
            "status": "Started",
            "desc": "discuss Forum",
            "createBeginTime": "2014-5-15 16:56",
            "healthStatus": "normal"
        },
        "templateBody": JSON.stringify(appJSON)
    };

    var appOverview = {
        "appId": "app-01",
        "appName": "dicaz WebSite",
        "type": "TEMPLATE",//TEMPLATE,CUSTOMER/
        "status": "Stopped",
        "desc": "",
        "createBeginTime": "2014-5-27",
        "healthStatus": "alarm"
    };

    var scalingGroup = {
        "scalingGroupInfo": {
            "groupId": "scalingGroup-groudid",
            "groupName": "Expansion-01",
            "groupDesc": "Examples for the application for expansion",
            "coolDown": 5,
            "maxSize": 10,
            "minSize": 2,
            "nics": [
                {
                    "nicKey": "nic-01",
                    "nicName": "NIC-01",
                    "vlbInfo": {
                        "id": "vlb-01",
                        "name": "vlb-01"
                    }
                },
                {
                    "nicKey": "nic-02",
                    "nicName": "NIC-021",
                    "vlbInfo": {
                        "id": "vlb-021",
                        "name": "vlb-02"
                    }
                }
            ],
            "vmTotal": 20,
            "vmRunning": 3,
            "scalingStatus": "NORMAL" //NORMAL, SCALING, PENDING
        },
        "policies": [
            {
                "policyInfo": {
                    "policyId": "policy-01",
                    "policyName": "policy-01",
                    "groupId": "groupId-01",
                    "cooldown": 12,
                    "adjustStep": 5,
                    "status": "RUNNING", //RUNNING,运行，BLOCK,阻塞, STOPPED停止
                    "actionType": "SCALEOUT" //SCALEOUT 扩容，SCALEIN 减容，SLEEP 睡眠，AWAKE 唤醒，HALT关机，POWER开机，CREATE创建，REMOVE删除
                }
            }
        ]
    };
    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/topo": function (original, response) {
            response(200, "success", appInstanceTopo, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}/overview": function (original, response) {
            response(200, "success", appOverview, {});
        },
        //更新应用实例的名称，描述
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            if (data.name) {
                appInstanceTopo.appBasicInfo.appName = data.name;
            }
            if (data.desc) {
                appInstanceTopo.appBasicInfo.desc = data.desc;
            }
            response(200, "success", {}, {});
        },
        //查询指定的伸缩组详情
        "GET /goku/rest/v1.5/{vdc_id}/scalinggroups/{id}": function (original, response) {
            var id = original.data.id;
            response(200, "success", scalingGroup, {});
        },
        //更新指定的伸缩组详情
        "PUT /goku/rest/v1.5/{vdc_id}/scalinggroups/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            scalingGroup.scalingGroupInfo.groupName = data.groupName;
            scalingGroup.scalingGroupInfo.groupDesc = data.groupDesc;
            scalingGroup.scalingGroupInfo.coolDown = data.coolDown;
            scalingGroup.scalingGroupInfo.maxSize = data.maxSize;
            scalingGroup.scalingGroupInfo.minSize = data.minSize;
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/{vdc_id}/scalinggroups/{groupid}/policies/{id}/actions?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            if (data.action === "Start") {
                scalingGroup.policies[0].policyInfo.status = "RUNNING";
            }
            if (data.action === "Stop") {
                scalingGroup.policies[0].policyInfo.status = "STOPPED";
            }
            response(200, "success", scalingGroup, {});
        }
    });
});