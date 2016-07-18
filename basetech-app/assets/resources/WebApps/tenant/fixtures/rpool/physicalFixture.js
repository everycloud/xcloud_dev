define(["can/util/fixture/fixture"], function (fixture) {
    var dServersList = [
        {
            id: "001",//物理机的ID
            type: "SAN",//物理机的类型
            name: "<b>service_001</b>",//物理机的名称

            room: "<b>34</b>",//物理机所在的机房
            rack: "<b>5</b>",//物理机所在的机柜
            subrack: "<b>6</b>",//物理机所在的机框
            slot: "<b>slot</b>",//物理机所在的槽位
            bmcIp: "192.168.0.11",//物理机的BMC IP
            assignState: "maintenance",//物理机的分配状态
            associateState: "associated",//物理机的关联状态
            runState: "running",//物理机的运行状态
            zoneId: "",//物理机所在的ZONE
            //物理机所属的用户信息
            userInfo: {
                name: "<b>admin</b>",
                applicationDate: "2012-02-26",
                expirationDate: "2012-02-26",
                orgInfo: [
                    {
                        id: "",
                        name: ""
                    }
                ]
            }
        },
        {
            id: "002",//物理机的ID
            type: "SAN",//物理机的类型
            name: "service_002",//物理机的名称

            room: "4",//物理机所在的机房
            rack: "2",//物理机所在的机柜
            subrack: "2",//物理机所在的机框
            slot: "",//物理机所在的槽位
            bmcIp: "192.168.0.17",//物理机的BMC IP
            assignState: "installfailed",//物理机的分配状态
            associateState: "unassociated",//物理机的关联状态
            runState: "poweroff",//物理机的运行状态
            zoneId: "",//物理机所在的ZONE
            //物理机所属的用户信息
            userInfo: {
                name: "vip",
                applicationDate: "2012-02-21",
                expirationDate: "2012-02-26",
                orgInfo: [
                    {
                        id: "",
                        name: ""
                    }
                ]
            }
        }
    ];

    fixture({
        //物理机操作
        "POST /goku/rest/v1.5/irm/{vdc_id}/server/action": function (original, response) {
            var data = JSON.parse(original.data);
            var types = ["associate", "disassociate"], type, ids;
            for (var i = 0, len = types.length; i < len; i++) {
                type = types[i];
                ids = data[type];
                if (ids) {
                    break;
                }
            }
            var operateResult = [];
            for (var j = 0, len = ids.length; j < len; j++) {
                operateResult.push({
                    id: j,
                    type: type,
                    result: !!Math.round(Math.random()),
                    errorCode: j
                });
            }
            response(200, "success", {operateResult: operateResult}, {});
        },

        // 物理机
        "POST /goku/rest/v1.5/irm/{vdc_id}/zones/{zone_id}/server/list": function (original, response) {
            var data = JSON.parse(original.data);
            var limit = data.limit;
            var start = data.start;

            // 构造返回列表
            var serverInfo = [];
            for (var index = start; index < (start + limit); index++) {
                var item = $.extend({}, dServersList[Math.round(Math.random())]);
                item.id = index;
                item.name = "<b>service_</b>" + index;
                serverInfo.push(item);
            }

            var data = {
                serverInfo: serverInfo,
                total: 31
            };
            response(200, "success", data, {});
        }
    });

    return fixture;
})
;