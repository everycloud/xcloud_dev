define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    "use strict";

    var tasklists = {
        "taskList": [
            {
                id: "task-01",
                name: "Start the virtual machine",
                description: "",
                triggerType: "PERIOD", // PERIOD周期执行 ONCE 定时执行一次
                periodType: "EVERYDAY",
                dateAndTimeList: [
                    {
                        date: "EVERYDAY",
                        time: "5:37"
                    }
                ],
                policies: [ {
                    policyId: "policy-02",
                    policyName: "policy-02",
                    appName: "discz",
                    groupId: "group-02",
                    groupName: "group-02",
                    policyOperation: "START"//•START  •STOP
                }],
                taskStatus: "DISABLED"
            },
            {
                id: "task-02",
                name: "Off the virtual machine",
                description: "",
                triggerType: "ONCE",// PERIOD周期执行 ONCE 定时执行一次
                periodType: null,
                dateAndTimeList: [
                    {
                        date: "2014-3-18",
                        time: "5:37"
                    }
                ],
                policies: [ {
                    policyId: "policy-02",
                    policyName: "policy-02",
                    appName: "discz",
                    groupId: "group-02",
                    groupName: "group-02",
                    policyOperation: "START"//•START  •STOP
                }],
                taskStatus: "DISABLED"
            }
        ],
        "total": 2
    };

    var policies = {
        "policies": [
            {
                policyId: "policy-01",
                appName: "discz",
                groupId: "group-01",
                groupName: "group-01",
                policyOperation: "START"//•START  •STOP
            },
            {
                policyId: "policy-02",
                appName: "discz",
                groupId: "group-02",
                groupName: "group-02",
                policyOperation: "START"//•START  •STOP
            },
            {
                policyId: "policy-03",
                appName: "discz",
                groupId: "group-03",
                groupName: "group-03",
                policyOperation: "STOP"//•START  •STOP
            }
        ]
    };

    var policyLogs = {
        "policyLogs": [
            {
                "logId": "logId-01",
                "policyName": "Start the virtual machine",
                "policyType": "SCHEDULE_TASK",
                "faultReason": "",
                "createTime": "2013-04-15 12:22:11",
                "updateTime": "2013-04-15 12:22:11",
                "executionResult": "SUCCESS", //SUCCESS 成功， FAILURE 失败
                "description": ""
            },
            {
                "logId": "logId-02",
                "policyName": "Close VM",
                "policyType": "SCHEDULE_TASK",
                "faultReason": "",
                "createTime": "2013-04-15 12:22:22",
                "updateTime": "2013-04-15 12:22:22",
                "executionResult": "FAILURE", //SUCCESS 成功，FAILURE 失败
                "description": ""
            }
        ],
        "total": 2
    };
    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/schedule-task": function (original, response) {
            response(200, "success", tasklists, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/schedule-task/{id}/details": function (original, response) {
            var id = original.data.id;
            var data = null;
            _.each(tasklists.taskList, function (item, index) {
                if (item.id === id) {
                    data = item;
                    return;
                }
            });
            response(200, "success", {"scheduleTask": data}, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/polices": function (original, response) {
            response(200, "success", {
                "policies": [
                    {
                        policyId: "policy-01",
                        appName: "discz",
                        groupId: "group-01",
                        groupName: "group-01",
                        policyOperation: null//•START  •STOP
                    },
                    {
                        policyId: "policy-02",
                        appName: "discz",
                        groupId: "group-02",
                        groupName: "group-02",
                        policyOperation: "START"//•START  •STOP
                    },
                    {
                        policyId: "policy-03",
                        appName: "discz",
                        groupId: "group-03",
                        groupName: "group-03",
                        policyOperation: ""//•START  •STOP
                    }
                ]
            }, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/policy-logs": function (original, response) {
            response(200, "success", policyLogs, {});
        }
    });
});