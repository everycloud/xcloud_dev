
define(["app/services/ajaxBase",
	"app/business/portlet/services/homeService",
	"app/services/httpService",
	"fixtures/hypervisorFixture",
    "fixtures/availableZoneFixture"
],
function (ajax, Service, HTTP, fixture) {
	"use strict";
	
	var url = {
		fc : ["get", "/goku/rest/v1.5/fc"],
		az : ["post", "/goku/rest/v1.5/az"],
		cluster : ["get", "/goku/rest/v1.5/"]
	};
	
	ajax.topo = {
		getFC : function($q, onOK, onErr){
			if (0){
				var http = new HTTP();
				var homeService = new Service($q, http);
				var promise = homeService.queryCloudInfras();
				promise.then(function (data) {
					if (!data) {
						return;
					}

					var arr = [];
					var poolResourceRes = data.cloudInfras;
					for (var item in poolResourceRes) {
						var e = poolResourceRes[item];
						arr.push({
							id: e.id,
							name: e.name,
							type: "zone",
							text: e.name,
						});
					}
					
					onOK(arr);
				});
			}else if (0){
				var ret = ajax.send(url.fc[0], url.fc[1],
					{vpcid:-1, tenant_id:1, start: 0, limit: 1000},{}, true);
				
				ajax.finish(ret, onOK, onErr, false);
			}else{
			
				var ret = ajax.send('get', '/goku/rest/v1.5/statistics/cloud-infra',
				{},{}, true);
			
				ajax.finish(ret, function (data) {
					if (!data || !data.cloudInfraCapacity) {
						return;
					}

					var arr = [];
					var fm = data.cloudInfraCapacity;
					for (var i in fm) {
						var e = fm[i];
						arr.push({
							id: e.id,
							name: e.name,
							type: "zone",
							text: e.name,
							cpu : {
								used : (e.cpuUsedSize||0),
								total : (e.cpuTotalSize||0)
							},
							memory : {
								used : (e.memUsedSize||0),
								total : (e.memTotalSize||0)
							},
							store : {
								used : (e.storagePoolUsedSize||0),
								total : (e.storagePoolTotalSize||0)
							},
							vlan : {
								used : (e.vlanUsedNum||0),
								total : (e.vlanTotalNum||0)
							},
							ip : {
								used : (e.publicIPUsedNum||0),
								total : (e.publicIPTotalNum||0)
							},
							firewall : {
								used : (e.virtualFirewallUsedNum||0),
								total : (e.virtualFirewallTotalNum||0)
							}
						});
					}
					onOK(arr);
				}, onErr, false);
			}
		},
		
		getAZ : function($q, id, onOK, onErr){
			if (1){
				var http = new HTTP();
				var homeService = new Service($q, http);
				
				var stat = homeService.getItAzStatistics(id);
                stat.then(function(data){
					if (!data || !data.availableZones){
						return;
					}
					
					var arr = [];
					var az = data.availableZones;
					for(var i in az){
						var e = az[i];
						var s = e.statistics;
						if (!s){
							continue;
						}
						
						arr.push({
							cpu : {
								used : (s.vcpuAllocatedSize || 0),
								total : (s.vcpuAllocatedSize||0) + (s.vcpuFreeSize||0)
							},
							memory : {
								used : (s.memAllocatedSize||0),
								total : (s.memFreeSize||0) + (s.memAllocatedSize||0)
							},
							store : {
								used : (s.storageOccupancySize||0),
								total : (s.storageFreeSize||0) + (s.storageOccupancySize||0)
							},
							id : e.id,
							type: "az",
							text: e.name,
						})
					}
					onOK(arr);
                });
			}else{
				var ret = ajax.send(url.az[0], url.az[1],
					{tenant_id:1, id: id},{}, true);
				
				ajax.finish(ret, onOK, onErr, false);
			}
		},
		
		getCluster : function($q, id, onOK, onErr){
			return onOK([]);
			var ret = ajax.send(url.cluster[0], url.cluster[1],
				{tenant_id:1, id: id},{}, true);
			
			ajax.finish(ret, onOK, onErr, false);
		}
	}
	
	return ajax;
});