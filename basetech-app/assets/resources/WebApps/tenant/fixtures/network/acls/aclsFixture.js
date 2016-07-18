
define(["can/util/fixture/fixture"], function (fixture) {
    var resp = {

        "total": 3,
        "firewallRules": [
            {
                "firewallRuleID": 1000000000001,
                "ruleID": 10,
                "status": "READY",
                "protocol": "TCP",
                "networkName" : "Network_AZ01",
                "ipAddr" : "192.168.0.254",
                "ipPrefix" : "24",
                "startPort" : "10",
                "endPort" : "200",
                "icmpType" : "-1",
                "action" : "permit",
                "eipAddr" : "192.168.0.22",
                "outerZone" : "untrust"
            },
            {
                "firewallRuleID": 1000000000002,
                "ruleID": 11,
                "status": "READY",
                "protocol": "TCP",
                "networkName" : "Network_AZ02",
                "ipAddr" : "192.168.0.254",
                "ipPrefix" : "24",
                "startPort" : "200",
                "endPort" : "250",
                "icmpType" : "-1",
                "action" : "permit",
                "eipAddr" : "192.168.0.22",
                "outerZone" : "untrust"
            },
            {
                "firewallRuleID": 1000000000003,
                "ruleID": 12,
                "status": "READY",
                "protocol": "TCP",
                "networkName" : "Network_AZ03",
                "ipAddr" : "192.168.0.254",
                "ipPrefix" : "24",
                "startPort" : "250",
                "endPort" : "270",
                "icmpType" : "-1",
                "action" : "permit",
                "eipAddr" : "192.168.0.22",
                "outerZone" : "untrust"
            }
        ]

    };
    fixture({

        //查询ACL列表
        "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules": function (request, response) {

            var array = new Array();

            for(var i=0; i<resp.firewallRules.length; i++){
                array[i] = resp.firewallRules[i];
            }

            var queryResult = {
                total:resp.total,
                firewallRules:array
            };

            response(200, "success", queryResult, {});
        },
        //删除ACL规则
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //创建ACL规则
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules?cloud-infras={cloud_infras_id}": function (request, response) {
            var original = JSON.parse(request.data);
            var rule = {
                "firewallRuleID": Math.ceil(Math.random()*10000000000000).toString(),
                "ruleID": original.ruleID,
                "status": "READY",
                "protocol": original.protocol,
                "networkName" :original.networkID,
                "ipAddr" : original.ipAddr,
                "ipPrefix" : original.ipPrefix,
                "startPort" : original.startPort,
                "endPort" :original.endPort,
                "icmpType" : original.icmpType,
                "action" : original.action,
                "eipAddr" : original.eipAddr,
                "outerZone" :original.outerZone
            };
            resp.total++;
            resp.firewallRules.push(rule);

            response(200, "success", {}, {});
        },
        //插入ACL规则
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}": function (request, response) {

            response(200, "success", {}, {});
        }
    });
    return fixture;
});



