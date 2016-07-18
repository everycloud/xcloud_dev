define(["can/util/fixture/fixture"], function (fixture) {

    // 虚拟机规格
    var vmSpecListInfo = {
        "data": [
            {
                "id": "001",
                "name": "Virtual Machine Specifications - Service",
                "cpu": "4",
                "cpuShare": "Small",
                "cpuQuota": "256",
                "memory": "8G",
                "memoryShare": "Medium",
                "memoryQuota": "1024",
                "disk": "2*10G",
                "diskDetail": [{
                    "name":"Disk 001",
                    "capacity":"10",
                    "configMode":"Streamlining",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"Yes"
                },{
                    "name":"Disk 002",
                    "capacity":"10",
                    "configMode":"Common",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"No"
                }],
                "resourceTabs":[{
                    "sla":"Storage Type",
                    "attribute":"IPSAN"
                },{
                    "sla":"CPU Optimization",
                    "attribute":"Golden"
                }],
                "tagInfoList": [
                    {
                        "sla": "storageType",
                        "attribute": "IPSAN"
                    },{
                        "sla": "cpuType",
                        "attribute": "golden"
                    }
                ],
                "diskInfoList": [{
                    "name":"Disk 001",
                    "capacity":"10",
                    "configMode":"thin",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"yes"
                },{
                    "name":"Disk 002",
                    "capacity":"10",
                    "configMode":"common",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"no"
                }],
                "operator": ""
            },
            {
                "id": "002",
                "name": "Virtual Machine Specification 1",
                "cpu": "2",
                "cpuShare": "Medium",
                "cpuQuota": "256",
                "memory": "4G",
                "memoryShare": "Medium",
                "memoryQuota": "1024",
                "disk": "1*20G",
                "diskDetail": [{
                    "name":"Disk 001",
                    "capacity":"20",
                    "configMode":"Streamlining",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"No"
                }],
                "diskInfoList": [{
                    "name":"Disk 001",
                    "capacity":"20",
                    "configMode":"thin",
                    "storageMedia":"SAN-Any",
                    "isAffectedBySnaps":"no"
                }],
                "resourceTabs":[{
                    "sla":"Storage Type",
                    "attribute":"IPSAN"
                }],
                "tagInfoList":[{
                    "sla":"storageType",
                    "attribute":"IPSAN"
                }],
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // VPC规格
    var vpcSpecListInfo = {
        "data": [
            {
                "id": "001",
                "name": "A Network",
                "maxDirectNetworkNum": "2000",
                "maxRoutedNetworkNum": "1024",
                "maxInternalNetworkNum": "8000",
                "maxPublicIpNum": "3000",
                "priority": "High",
                "createTime": "2012-06-18",
                "lastUpdate": "2013-02-26",
                "operation": ""
            },
            {
                "id": "002",
                "name": "B Network",
                "maxDirectNetworkNum": "200",
                "maxRoutedNetworkNum": "1024",
                "maxInternalNetworkNum": "5000",
                "maxPublicIpNum": "1000",
                "priority": "Medium",
                "createTime": "2012-06-18",
                "lastUpdate": "2013-06-26",
                "operation": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    fixture({
        // 虚拟机规格
        "GET /resources/spec/vmSpec/query": function(original, response){
            var queryInfo = original.data;
            if (queryInfo.id != undefined) {
                var dataList = vmSpecListInfo.data;
                for (var index in dataList)
                {
                    if (dataList[index].id === queryInfo.id)
                    {
                        response(200, "success", dataList[index], {});
                        return;
                    }
                }
            }

            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < vmSpecListInfo.data.length; index++)
            {
                data.push(vmSpecListInfo.data[index]);
            }

            var dataInfoList = {};
            dataInfoList.data = data;
            dataInfoList.curPage = queryInfo.curPage;
            dataInfoList.totalRecords = vmSpecListInfo.data.length;
            response(200, "success", dataInfoList, {});
        },
        "POST /resources/spec/vmSpec/delete": function(original, response){
            var id = original.data.id;
            var dataList = vmSpecListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    vmSpecListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "GET /resources/spec/vmSpec/detail": function(original, response){
            var id = original.data.id;
            var dataList = vmSpecListInfo.data;
            var res = undefined;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    res = dataList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },
        "POST /resources/spec/vmSpec/create": function(original, response){
            var specInfo = original.data;
            var dataList = vmSpecListInfo.data;
            specInfo.id = new Date().getMilliseconds();
            specInfo.operator="";
            dataList.push(specInfo);
            vmSpecListInfo.totalRecords = dataList.length;

            response(200, "success", specInfo, {});
        },

        // VPC规格
        "GET /resources/spec/vpcSpec/query": function(original, response){
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = vpcSpecListInfo.data;
                for (var index in dataList)
                {
                    if (dataList[index].id === queryInfo.id)
                    {
                        response(200, "success", dataList[index], {});
                        return;
                    }
                }
            }

            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < vpcSpecListInfo.data.length; index++)
            {
                data.push(vpcSpecListInfo.data[index]);
            }

            var dataInfoList = {};
            dataInfoList.data = data;
            dataInfoList.curPage = queryInfo.curPage;
            dataInfoList.totalRecords = vpcSpecListInfo.data.length;
            response(200, "success", dataInfoList, {});
        },
        "POST /resources/spec/vpcSpec/delete": function(original, response){
            var id = original.data.id;
            var dataList = vpcSpecListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    vpcSpecListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "GET /resources/spec/vpcSpec/create": function(original, response){
            var specInfo = original.data;
            var dataList = vpcSpecListInfo.data;
            specInfo.id = new Date().getMilliseconds();
            specInfo.operator="";
            dataList.push(specInfo);
            vpcSpecListInfo.totalRecords = dataList.length;

            response(200, "success", specInfo, {});
        },
        "GET /resources/spec/vpcSpec/modify": function(original, response){

            response(200, "success", "ok", {});
        }
    });

    return fixture;
});