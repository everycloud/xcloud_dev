
define(["app/services/ajaxBase","fixtures/vpcFixture"], 
	function (ajax, stub) {
	"use strict";
	
	ajax.ipBW = {
		// IPBWTemplateResource
		query : function(s, l, onOK, onErr)
		{		
			var ret = ajax.send("get",
				"/goku/rest/v1.5/ipbwtemplates?start=" + s + "&limit=" + l,
				{},{});
		
			ajax.finish(ret, onOK, onErr);
		},
		
		create : function(name, rx, tx, onOK, onErr)
		{		
			var ret = ajax.send("post",
				"/goku/rest/v1.5/ipbwtemplates",
				{},{
					"name": name,
					"maxRxBandwidth": rx,
					"maxTxBandwidth": tx
				});
		
			ajax.finish(ret, onOK, onErr);
		},
		
		remove : function(id, onOK, onErr)
		{			
			var ret = ajax.send("delete",
				"/goku/rest/v1.5/ipbwtemplates/" + id,
				{},null);
		
			ajax.finish(ret, onOK, onErr);
		},
		
		modify : function(id, name, rx, tx, onOK, onErr)
		{			
			var ret = ajax.send("put",
				"/goku/rest/v1.5/ipbwtemplates/" + id,
				{},{
					"name": name,
					"maxRxBandwidth": rx,
					"maxTxBandwidth": tx
				});
		
			ajax.finish(ret, onOK, onErr);
		}
	};
	
	return ajax;
});