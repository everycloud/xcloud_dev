
define(["app/business/vdc/services/ajaxSec",
	"app/business/vdc/services/ajaxVPC"], 
function (ajax) {
	"use strict";
	
	ajax.dnat = {
		get : function(s,l,onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/dnats?start={start}&limit={limit}",
				{vpcid:-1, tenant_id:1, start: s, limit: l},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		remove : function(id, vpc, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/dnats/{id}",
				{tenant_id:1, id: id, vpcid:vpc},{});
			
			ajax.finish(ret, onOK, onErr);
		}
	}
	
	ajax.eip = {
		get : function(s,l,onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/elasticips?start={start}&limit={limit}",
				{vpcid:-1, tenant_id:1, start: s, limit: l},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		remove : function(id, vpc, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/elasticips/{id}",
				{tenant_id:1, vpcid:vpc, id: id},null);
			
			ajax.finish(ret, onOK, onErr);
		}
	}
	
	ajax.acls = {
		get : function(start, limit, onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/firewall-acls?start={start}&limit={limit}",
				{vpcid:-1, tenant_id:1, start: start, limit: limit},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		getRule : function(vpc, direction, ruletype, aclid, start, limit, onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/firewall-rules?start={start}&limit={limit}&direction={direction}&ruletype={ruletype}&aclid={aclid}",
				{tenant_id:1, vpcid:vpc, direction:direction, ruletype:ruletype, aclid:aclid,
				start: start, limit: limit},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		remove : function(id, vpc, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/firewall-rules/{id}",
				{tenant_id:1, id: id, vpcid: vpc},{});
			
			ajax.finish(ret, onOK, onErr);
		}
	}

	
	ajax.vpn = {
		getGateway : function(onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-gateway",
				{tenant_id:1,vpcid:-1},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		delGateway : function(id, vpc, share, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-gateway/{id}?sharedVpc={sharedVpc}",
				{tenant_id:1, id: id, vpcid:vpc, sharedVpc:share?true:false}, {});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		getLink : function(id, vpc, onOK, onErr){
			var ret = ajax.send("get",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections" + (id ? "/" + id : ""),
				{tenant_id:1,vpcid:(vpc||-1)},{});
			
			ajax.finish(ret, onOK, onErr);
		},

		delLink : function(id, vpc, onOK, onErr){
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}?userid={userid}",
				{tenant_id:1, id: id, userid: ajax.user().id, vpcid:vpc},{});
			
			ajax.finish(ret, onOK, onErr);
		},
		
		queryNet : function(vpc, onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks?start={start}&limit={limit}&networktype={networktype}",
                {
                    "tenant_id": 1,
                    vpcid : vpc,
                    start : 0,
                    limit : 100,
					networktype : "ROUTED"
                },{}
            );
            
            ajax.finish(ret, onOK, onErr);
        },
		
		createGate : function(para, onOK, onErr)
        {
			para.userID = ajax.user().id;
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/vpn-gateway",
                {
                    "tenant_id": 1,
                },para
            );
            
            ajax.finish(ret, onOK, onErr);
        },
		
		createVPN : function(para, onOK, onErr)
        {
			para.userID = ajax.user().id;
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/vpn-connections",
                {
                    "tenant_id": 1,
                },para
            );
            
            ajax.finish(ret, onOK, onErr);
        },
		
		modifyVPN : function(para, onOK, onErr)
        {
			para.userID = ajax.user().id;
            var ret = ajax.send("put",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/vpn-connections/{id}",
                {
                    "tenant_id": 1,
					id: para.id,
					vpcid : para.vpcID
                },para
            );
            
            ajax.finish(ret, onOK, onErr);
        }
	}
	
	return ajax;
});