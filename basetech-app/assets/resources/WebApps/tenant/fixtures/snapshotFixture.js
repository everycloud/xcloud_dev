define(["can/util/fixture/fixture"], function (fixture) {

    var cluserHostData =
        {"currentSnapshot":
            {"id":"4629700416936869891$urn:sites:381A07B8:vms:i-00000096:snapshots:1551","name":"test02","type":null,"description":null,"snapProvisionSize":-1,"volSnapshots":null,"createTime":null,"status":null,"coreNum":0,"memorySize":0,"volumeSizeSum":0,"memoryShot":false,"childSnapshots":null,"includingMemorySnapshot":null},
            "rootSnapshots":[{"id":"4629700416936869891$urn:sites:381A07B8:vms:i-00000096:snapshots:1453","name":"hwt","type":"normal","description":"hehe","snapProvisionSize":-1,"volSnapshots":null,"createTime":"2014-05-20 14:00:00","status":"ready","coreNum":0,"memorySize":0,"volumeSizeSum":0,"memoryShot":false,
                        "childSnapshots":[{"id":"4629700416936869891$urn:sites:381A07B8:vms:i-00000096:snapshots:1551","name":"test02","type":"normal","description":"desc","snapProvisionSize":-1,"volSnapshots":null,"createTime":"2014-05-21 03:43:01","status":"ready","coreNum":0,"memorySize":0,"volumeSizeSum":0,"memoryShot":false,"childSnapshots":[{"id":"4629700416936869891$urn:sites:381A07B8:vms:i-00000096:snapshots:1554","name":"test0201","type":"normal","description":null,"snapProvisionSize":-1,"volSnapshots":null,"createTime":"2014-05-21 03:43:52","status":"creating","coreNum":0,"memorySize":0,"volumeSizeSum":0,"memoryShot":false,"childSnapshots":null,"includingMemorySnapshot":null}],"includingMemorySnapshot":null}],"includingMemorySnapshot":null}]
        };
    fixture({

        //查询历史监控
        "GET /goku/rest/v1.5/irm/1/vms/4616189618054758401/snapshots": function (request, response) {
            response(200, "success", cluserHostData, {})
        }
    });

    return fixture;
});