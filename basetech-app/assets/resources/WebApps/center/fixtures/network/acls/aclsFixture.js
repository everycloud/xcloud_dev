
define(["can/util/fixture/fixture"], function (fixture) {
    fixture({
        //查询ACL列表
        "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules": function (request, response) {
            var start = parseInt(request.data.start, 10);
            var limit = parseInt(request.data.limit, 10);
            var resp = {
                code: "0",
                firewallRules: [],
                total: 0
            };
            var item = {};
            for (var i = start; i < 3; i++) {
                item = {
                    "firewallRuleID": "100000000000000003" + i,
                    "ruleID": "1" + i,
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
                }
                resp.firewallRules.push(item);
            }
            resp.total = 3;
            response(200, "success", resp, {});
        },
        //删除ACL规则
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //创建ACL规则
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //插入ACL规则
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/firewall-rules/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        }
    });
    return fixture;
});



