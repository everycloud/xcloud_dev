
define(["app/services/ajaxBase",
	"language/keyID",
	"fixtures/vpcFixture"], 
function (ajax, i18n, fixture) {
	"use strict";
	
	ajax.getSecRule = function(onOK, onErr)
	{
		var s = 0, l = 2048;
		var ret = ajax.send("get",
			"/goku/rest/v1.5/irm/cloudObject-rules?start=" + s + "&limit=" + l,
			{},{});
		
		ajax.finish(ret, onOK, onErr);
	},
	
	ajax.updateSecRule = function(para, onOK, onErr)
	{
		var ret = ajax.send("post",
			"/goku/rest/v1.5/irm/cloudObject-rules",
			{}, para);
		
		ajax.finish(ret, onOK, onErr);
	},
	
	// 应用
	ajax.getAPP = function(onOK, onErr, err)
	{
		err = (null == err ? false : err);
		var ret = ajax.send("get",
			"/goku/rest/v1.5/ame/" + ajax.user().orgId + "/apps?status=Started&limit=2048&start=0",
			{},{},err);
		
		ajax.finish(ret, onOK, onErr, err);
	},
	
	// 虚拟机
	ajax.getVM = function(onOK, onErr)
	{
		var ret = ajax.send("post",
			"/goku/rest/v1.5/irm/1/vms/list",
			{},{queryVmInsystem : true});
		
		ajax.finish(ret, onOK, onErr);
	},
	
	// 资源集群
	ajax.getRC = function(onOK, onErr)
	{
		var ret = ajax.send("post",
			"/goku/rest/v1.5/irm/1/resourceclusters/action",
			{},{
				list:{
					start: 0,
					limit: 2048,
					name: "",
					requestType: "ALL"
				}
			});
		
		ajax.finish(ret, onOK, onErr);
	},
	
	// 可用分区
	ajax.getAZ = function(onOK, onErr)
	{
		var ret = ajax.send("get",
			"/goku/rest/v1.5/irm/1/availablezones",
			{},{});
		
		ajax.finish(ret, onOK, onErr);
	}
	
	var icmpMap = {
		"Any" : { sPort: "-1", dPort: "-1"},
		"Echo" : { sPort: "8", dPort: "0"},
		"Echo reply" : { sPort: "0", dPort: "0"},
		"Fragment need DF set" : { sPort: "3", dPort: "4"},
		"Host redirect" : { sPort: "5", dPort: "1"},
		"Host TOS redirect" : { sPort: "5", dPort: "3"},
		"Host unreachable" : { sPort: "3", dPort: "1"},
		"Information reply" : { sPort: "16", dPort: "0"},
		"Information request" : { sPort: "15", dPort: "0"},
		"Net redirect" : { sPort: "5", dPort: "0"},
		"Net TOS redirect" : { sPort: "5", dPort: "2"},
		"Net unreachable" : { sPort: "3", dPort: "0"},
		"Parameter problem" : { sPort: "12", dPort: "0"},
		"Port unreachable" : { sPort: "3", dPort: "3"},
		"Protocol unreachable" : { sPort: "3", dPort: "2"},
		"Reassembly timeout" : { sPort: "11", dPort: "1"},
		"Source quench" : { sPort: "4", dPort: "0"},
		"Source route failed" : { sPort: "3", dPort: "5"},
		"Timestamp reply" : { sPort: "14", dPort: "0"},
		"Timestamp request" : { sPort: "4", dPort: "0"},
		"TTL exceeded" : { sPort: "11", dPort: "0"}
	}

	var icmpPort = {};
	function icmp()
	{
		var arr = [];
		var map = {}
		for (var i in icmpMap)
		{
			arr.push({id:i});
			var e = icmpMap[i];
			map[[e.sPort, e.dPort].join()] = i;
		}
		arr[0].checked = true;
		icmpPort = map;
		return arr;
	}
	
	ajax.icmp = {
		select : icmp(),
		getPort : function(name){
			return icmpMap[name] || icmpMap["Any"];
		},
		getName : function(sPort, dPort){
			if ((null == sPort) || (null == dPort)){
				return "-"
			}
			
			return icmpPort[[sPort, dPort].join()] || 
				(i18n.common_term_type_label||"类型")+":"+sPort+","+(i18n.common_term_code_label||"编码")+":"+dPort;
		},
		getStatus : function(key){
			var statusMap = {
				READY: i18n.common_term_natural_value||"正常",
				UPDATING: i18n.common_term_saving_label||"保存中",
				UPDATEFAIL: i18n.common_term_saveFail_label||"保存失败",
				DELETEFAIL: i18n.common_term_deleteFail_value||"删除失败",
				DELETING: i18n.common_term_deleting_value||"删除中"
			};
			return statusMap[key] || key;
		}
	}

	
	ajax.sec = {
		get : function(s,l,onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups?start={start}&limit={limit}",
				{vpcid:-1, tenant_id:1, start: s, limit: l},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		remove : function(id, vpc, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups/{id}",
				{tenant_id:1, id: id, vpcid:vpc},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		getRule : function(id, vpc, start, limit, onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroup-rules?securitygroupid={securitygroupid}&start={start}&limit={limit}",
				{tenant_id:1, securitygroupid: id, vpcid:vpc, start: start, limit: limit},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		delRule : function(para, vpc, onOK, onErr){
			var ret = ajax.send("post",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroup-rules/action",
				{tenant_id:1, vpcid:vpc},para);
			
			ajax.finish(ret, onOK, onErr);
		},
		
		getVM : function(id, vpc, onOK, onErr){
			var ret = ajax.send("post",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups/action",
				{tenant_id:1, vpcid:vpc},{
					querySGMember : {
						sgID : id,
						start : 0,
						count : 1000
					}
				});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		delVM : function(para, vpc, onOK, onErr){
			var ret = ajax.send("post",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/securitygroups/action",
				{tenant_id:1, vpcid:vpc},{
					removeVMFromSG : para
				});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		getApp : function(onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/aspf",
				{
					tenant_id:1,
					vpcid:-1
				});
			
			ajax.finish(ret, onOK, onErr);
		}
	}
	
	return ajax;
});