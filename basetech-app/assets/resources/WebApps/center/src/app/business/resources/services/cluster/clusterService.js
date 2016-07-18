define(["app/services/httpService"], function (httpSrv) {
    var http = new httpSrv();
    var user = $("html").scope().user
    var userId = user.id;

    function reqCallback(ret, success, fail) {
        ret.success(function (data) {
            if ('function' == typeof success) {
                try {
                    success(data);
                }
                catch (e) {
                }
            }
        });

        ret.fail(function (data) {
            if ('function' == typeof fail) {
                try {
                    fail(data);
                }
                catch (e) {
                }
            }
        });
    }

    var service = {
		//获取VM的显示id，即短ID：i-000000001
		//原ID如：4629700416936869891$urn:sites:4DA80840:vms:i-0000000A
		getVMVisibleId : function(vmFMId){
			var id = "";
			if(vmFMId){
				var index = vmFMId.indexOf("vms") + 4;
				id = vmFMId.slice(index);
			}
			return id;
		},
        //查询集群下VM
        getVMsByClutser: function (clusterId, pageInfo, success, fail) {
            var params = {
                "detail": 0,
                "filterIsTemplate": false,
                "offset": pageInfo.offset,
                "limit": pageInfo.limit,
				"filterName":pageInfo.filterName
            }
            if (clusterId) {
                params.clusterId = clusterId;
            }
            var ret = http.post({
                "url": "/goku/rest/v1.5/irm/1/vms/list",
                "params": JSON.stringify(params),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //查询集群下Host
        getHostsByClutser: function (clusterId, success, fail) {
            var ret = http.post({
                "url": "/goku/rest/v1.5/irm/1/hosts",
                "params": JSON.stringify({clusterId: clusterId}),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        getClusterDRS: function (clusterId, success, fail) {
            var ret = http.get({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs", o: {id: clusterId}},
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //添加规则
        addRule: function (clusterId, reqParams, success, fail) {
            var ret = http.post({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs/rule/action", o: {id: clusterId}},
                "params": JSON.stringify(reqParams),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //修改规则
        editRule: function (clusterId, reqParams, success, fail) {
            var ret = http.put({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs/rule/action", o: {id: clusterId}},
                "params": JSON.stringify(reqParams),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //删除规则
        deleteRule: function (clusterId, ruleIndex,name, success, fail) {
            var reqParams = {
                drsRules: [
                    {ruleIndex: ruleIndex,ruleName:name}
                ]
            };
            var ret = http.delete({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs/rule/action", o: {id: clusterId}},
                "params": JSON.stringify(reqParams),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //查询资源组
        getResourceGroup: function (clusterId,params, success, fail) {
            var ret = http.post({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/resourcegroups", o: {id: clusterId}},
                "params": JSON.stringify(params),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        getResourceGroupDetail: function (clusterId,resourceGroupId,type, success, fail) {
            var ret = http.post({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/resourcegroups/{resourceGroupId}/detail",
                         o: {id: clusterId,resourceGroupId:resourceGroupId}},
                "params": JSON.stringify({type:type}),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //添加资源组
        addResourceGroup: function (clusterId, reqParams, success, fail) {
            var ret = http.post({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/resourcegroups/action", o: {id: clusterId}},
                "params": JSON.stringify(reqParams),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //修改资源组
        editResourceGroup: function (clusterId, reqParams, success, fail) {
            var ret = http.put({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/resourcegroups/action", o: {id: clusterId}},
                "params": JSON.stringify(reqParams),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        //删除资源组
        deleteResourceGroup: function (clusterId,resourceGroupUrn,resourceName, success, fail) {
            var ret = http.delete({
                "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/resourcegroups/action", o: {id: clusterId}},
                "params": JSON.stringify({urn: resourceGroupUrn,name:resourceName}),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        },
        getManageVms: function (clusterId, pageInfo, success, fail) {
                var params = {
                    "offset": pageInfo.offset,
                    "limit": pageInfo.limit,
                    enableVmDrs:pageInfo.enableVmDrs,
					vmId: pageInfo.id,
					name: pageInfo.name,
					behavior: pageInfo.behavior
                }
                var ret = http.post({
                    "url": {s:"/goku/rest/v1.5/irm/1/resourceclusters/{id}/drsvmconfig",o:{"id":clusterId}},
                    "params": JSON.stringify(params),
                    "userId": userId
                });
                reqCallback(ret, success, fail);
        },
        saveVmDRSConfig : function(clusterId,params,success,fail){
            var ret = http.put({
				"url": {s:"/goku/rest/v1.5/irm/1/resourceclusters/{id}/drsvmconfig",o:{"id":clusterId}},
                "params": JSON.stringify(params),
                "userId": userId
            });
            reqCallback(ret, success, fail);
        }
    };
    return service;
});
