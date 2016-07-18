
define(["can/util/fixture/fixture"], function (fixture) {
    var securityGroupListData = {
        "sgs" : [{
            "sgID" : "001",
            "name" : "name1",
            "rules": "23",
            "numbers" : "15",
            "intraTrafficAllow" : "是",
            "description" : "My security group."
        },{
            "sgID" : "002",
            "name" : "name2",
            "rules": "20",
            "numbers" : "18",
            "intraTrafficAllow" : "否",
            "description" : "My security group."
        }],
        "total" : "2"
    };
    fixture({
        //删除安全组记录
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //创建安全组
        "POST /goku/rest/v1.5/{vdc_id}/securitygroups?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        },
        //修改安全组
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success",{}, {});
        },
        //查询单条安全组信息
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/{id}": function(request, response){
            var res = {};
            res = securityGroupListData.sgs[0];
            response(200, "success",res, {});
        },
        //查询安全组列表
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups": function (request, response) {
            var start = parseInt(request.data.start, 10);
            var limit = parseInt(request.data.limit, 10);
            if(!start || !limit){
                start = 0;
                limit = 2;
            }
            var resp = {
                code: "0",
                sgs: [],
                total: 0
            };
            var item = {};
            for (var i = start; i < 2; i++) {
                item = {
                    "sgID": "100000000000000004" + i,
                    "name": (i===0) ? "default":"SecutiyGoup_A0" + i,
                    "sgRuleCount": "5",
                    "sgMemberCount": "2",
                    "intraTrafficAllow": "0",
                    "description": "My security group."
                }
                resp.sgs.push(item);
            }
            resp.total = 2;
            response(200, "success", resp, {});
        },

        //查询安全组rule
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules": function (request, response) {
            var start = parseInt(request.data.start, 10);
            var limit = parseInt(request.data.limit, 10);
            var resp = {
                code: "0",
                rules: [],
                total: 0
            };
            var item = {};
            item = {
                "ruleID": "" + 500,
                "ipProtocol": "ICMP",
                "ipRange" : "",
                "allowedSGID": "select one of allowedSGID and ipRange",
                "fromPort" : "Echo",
                "toPort" : "Echo request",
                "direction" : 0,
                "ipVersion" : 6,
                "status" : "READY"
            }
            resp.rules.push(item);
            item = {
                "ruleID": "" + 500,
                "ipProtocol": "Ang",
                "ipRange" : "",
                "allowedSGID": "select one of allowedSGID and ipRange",
                "fromPort" : "",
                "toPort" : "",
                "direction" : 1,
                "ipVersion" : 6,
                "status" : "Pending"
            }
            resp.rules.push(item);
            for (var i = start; i < 3; i++) {
                item = {
                    "ruleID": "" + i,
                    "ipProtocol": "TCP",
                    "ipRange" : "192.168.5.0-192.168.5.255",
                    "allowedSGID": "",
                    "fromPort" : "10000",
                    "toPort" : "50000",
                    "direction" : 0,
                    "ipVersion" : 4,
                    "status" : "Deleting"
                }
                resp.rules.push(item);
            }
            resp.total = 5;
            response(200, "success", resp, {});
        },
        //删除单条安全组rule
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules/action?cloud-infras={cloud_infras_id}" :
            function (request, response) {
            response(200, "success", {}, {});
        },
        //查询成员虚拟机成员
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroups/action?cloud-infras={cloud_infras_id}" : function (request, response) {
            var json = $.parseJSON(request.data);
            var start = parseInt(json.querySGMember.start, 10);
            var limit = parseInt(json.querySGMember.count, 10);
            var resp = {
                code: "0",
                querySGMemberResp: {
                    vms: []
                },
                total: 0
            };
            var item = {};
            for (var i = start; i < 2; i++) {
                item = {
                    "vmID": "" + i,
                    "vmName" : "linux_vmware0" + i,
                    "vnics" : [
                        {
                            "ip" : "192.168.0.1",
                            "floatIP" : "192.168.0.54",
                            "nicID": "4629700416936869889$urn:sites:44800798:vms:i-000000A",
                            "ipv6s":["1:11:1:1:1:1:1:2","1:11:1:1:1:1:1:3"],
                            "status": "READY"
                        },{
                            "ip" : "192.168.0.2",
                            "floatIP" : "192.168.0.55",
                            "nicID": "4629700416936869889$urn:sites:44800798:vms:i-000000B",
                            "ipv6s":["1:11:1:1:1:1:1:2","1:11:1:1:1:1:1:3"],
                            "status": "READY"
                        },{
                            "ip" : "192.168.0.3",
                            "floatIP" : "192.168.0.56",
                            "nicID": "4629700416936869889$urn:sites:44800798:vms:i-000000C",
                            "ipv6s":["1:11:1:1:1:1:1:2","1:11:1:1:1:1:1:3"],
                            "status": "READY"
                        }]
                }
                resp.querySGMemberResp.vms.push(item);
            }
            resp.total = 2;
            response(200, "success", resp, {});
        },
        //添加安全组规则
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/securitygroup-rules?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success", {}, {});
        }
    });
    return fixture;
});



