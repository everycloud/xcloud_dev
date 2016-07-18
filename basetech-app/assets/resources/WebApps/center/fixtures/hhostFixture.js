define(["can/util/fixture/fixture"], function (fixture) {

    var cluserHostData = {
        "code": "0",
        "message": "",
        "hosts": [
            {
                "id":"1",
                "name":"Host01",
                "runtimeState":"Normal",
                "cpuUsageRate":"20",
                "memUsageRate":"30",
                "hostIp":"192.168.1.1",
                "cpuSpeed":2.4,
                "memorySizeGB":4096,
                "maintenanceStatus":true,
				"virtualId":"123"
            },
            {
                "id":"2",
                "name":"Host02",
                "runtimeState":"Absent",
                "cpuUsageRate":"56",
                "memUsageRate":"23",
                "hostIp":"192.168.3.133",
                "cpuSpeed":5.4,
                "memorySizeGB":2048,
                "maintenanceStatus":false,
				"virtualId":"333"
            }
        ]
    };
    fixture({

        //查询历史监控
        "POST /goku/rest/v1.5/irm/1/hosts": function (request, response) {
            response(200, "success", cluserHostData, {})
        }
    });

    return fixture;
});