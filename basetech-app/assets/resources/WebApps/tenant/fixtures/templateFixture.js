define(["can/util/fixture/fixture"], function (fixture) {

    // 虚拟机模板
    var newvmTemplateListInfo = {
        "vmtemplates": [
            {
                "id": "001",
                "vmtName": "virtualTemplate_Service01",
                "type": "Application Templates",
                "osType": "Linux",
                "osVersion": "1.0",
                "status": "Finished",
                "createTime": "2014-03-15",
                "createName": "admin"
            },
            {
                "id": "002",
                "vmtName": "virtualTemplate_Service02",
                "type": "Application Templates 2",
                "osType": "Windows",
                "osVersion": "8.0",
                "status": "Finished",
                "createTime": "2014-03-06",
                "createName": "admin"
            }
        ],
        "curPage": 0,
        "totalNum": 2
    };
    var newIsoList = {
        "isoInfos": [
            {
                "name":"ISO Installation package",
                "fileType":"iso",
                "fileOsType":"Linux",
                "version":"0.1",
                "creatorId":"admin",
                "createTime":"2014-03-06",
                "description":"Can be used to create"
            },
            {
                "name":"Linux Installation package",
                "fileType":"iso",
                "fileOsType":"Linux",
                "version":"10.1",
                "creatorId":"admin",
                "createTime":"2014-04-06",
                "description":"Can be used to create"
            },
            {
                "name":"WIN7 Installation package",
                "fileType":"iso",
                "fileOsType":"Linux",
                "version":"1",
                "creatorId":"admin",
                "createTime":"2014-03-06",
                "description":"Can be used to create"
            }
        ],
        "total": 3
    }

    var newSoftwareList = {
        "softwareInfos":[{
            "name":"FMST_SA01",
            "ID":"10236589",
            "status":"Normal",
            "fileType":"rpm",
            "version":"1.0",
            "osType":"Linux",
            "createTime":"2014-03-06",
            "creatorId":"admin",
            "range":"0"
        },
            {
                "name":"FMST_SB02",
                "ID":"3656589",
                "status":"Normal",
                "fileType":"rpm",
                "version":"2.0",
                "osType":"Windows",
                "createTime":"2014-01-06",
                "creatorId":"admin",
                "range":"1"
            }],
        "total":2
    }
    var newScriptList = {
        "scriptInfos":[{
            "name":"FMJB_SAJ01",
            "ID":"10236589",
            "status":"Normal",
            "osType":"Linux",
            "createTime":"2014-03-06",
            "creatorId":"admin",
            "range":"0"
        },
            {
                "name":"FMJB_SBJ02",
                "ID":"3656589",
                "status":"Normal",
                "osType":"Windows",
                "createTime":"2014-01-06",
                "creatorId":"admin",
                "range":"1"
            }],
        "":2
    }



    // 虚拟机模板
    var vmtListInfo = {
        "data": [
            {
                "id": "001",
                "name": "Virtual machine template - Services",
                "type": "Application Templates",
                "systemType": "Linux",
                "osVersion": "1.0",
                "status": "Finished",
                "createTime": "2012-05-06",
                "creator": "admin",
                "operator": "",
                "logicVmtName":"Logic template 001",
                "cpu": 4,
                "cpuShare": "Low",
                "cpuQuota": "256",
                "memory": "8G",
                "memoryShare": "Medium",
                "memoryQuota": "1024",
                "disk": [{
                    "name":"Disk 001",
                    "capacity":"20",
                    "configMode":"Streamlining",
                    "storageMedia":"SAN_ANY",
                    "isAffectedBySnaps":"Yes"
                }],
                "resourceTabs":[{
                    "sla":"Storage Type",
                    "attribute":"IPSAN"
                },{
                    "sla":"CPU Optimization",
                    "attribute":"Gold"
                }]
            },
            {
                "id": "002",
                "name": "AppTemplate",
                "type": "Application Templates",
                "systemType": "Linux",
                "osVersion": "1.0",
                "status": "Finished",
                "createTime": "2013-07-15",
                "creator": "kang",
                "operator": "",
                "logicVmtName":"-",
                "cpu": 2,
                "cpuShare": "Low",
                "cpuQuota": "256",
                "memory": "4G",
                "memoryShare": "Medium",
                "memoryQuota": "1024",
                "disk": [{
                    "name":"Disk 001",
                    "capacity":"20",
                    "configMode":"Streamlining",
                    "storageMedia":"SAN_ANY",
                    "isAffectedBySnaps":"Yes"
                },{
                    "name":"Disk 002",
                    "capacity":"10",
                    "configMode":"Common",
                    "storageMedia":"SAN_ANY",
                    "isAffectedBySnaps":"No"
                }],
                "resourceTabs":[{
                    "sla":"Storage Type",
                    "attribute":"IPSAN"
                },{
                    "sla":"CPU Optimization",
                    "attribute":"Gold"
                }]
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 发现虚拟机模板
    var discoverVmtInfo = {
        "id": "103",
        "name": "Windows-7",
        "type": "Application Templates",
        "systemType": "Windows",
        "osVersion": "1.0",
        "status": "Finished",
        "createTime": "2012-08-06",
        "creator": "admin",
        "operator": "",
        "logicVmtName":"-",
        "cpu": 2,
        "cpuShare": "Low",
        "cpuQuota": "256",
        "memory": "4G",
        "memoryShare": "Medium",
        "memoryQuota": "1024",
        "disk": [{
            "name":"Disk 001",
            "capacity":"20",
            "configMode":"Streamlining",
            "storageMedia":"SAN_ANY",
            "isAffectedBySnaps":"Yes"
        },{
            "name":"Disk 002",
            "capacity":"10",
            "configMode":"Common",
            "storageMedia":"SAN_ANY",
            "isAffectedBySnaps":"No"
        }],
        "resourceTabs":[{
            "sla":"Storage Type",
            "attribute":"IPSAN"
        },{
            "sla":"CPU Optimization",
            "attribute":"Gold"
        }]
    };

    // 逻辑虚拟机模板
    var logicVmtListInfo = {
        "data": [
            {
                "id": "001",
                "name": "Templates - Services",
                "systemType": "Linux",
                "osVersion": "Novell SUSE Linux Enterprise 11 64bit",
                "diskSize": "50",
                "userName": "admin",
                "password": "admin",
                "deassociatedClusterNum": "2",
                "status": "0",
                "createTime": "2012-05-06",
                "creator": "admin",
                "operator": ""
            },
            {
                "id": "002",
                "name": "Templates 1",
                "systemType": "Windows",
                "osVersion": "Windows 7 Enterprise 64bit",
                "diskSize": "60",
                "userName": "admin",
                "password": "admin",
                "deassociatedClusterNum": "0",
                "status": "1",
                "createTime": "2012-05-06",
                "creator": "admin",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 应用模板
    var appTemplateListInfo = {
        "data": [
            {
                "id": "001",
                "name": "Discuz",
                "status": "Release",
                "visibleTo": "1.0",
                "createTime": "2012-05-06",
                "creator": "admin",
                "description": "Discuz",
                "operator": ""
            },
            {
                "id": "001",
                "name": "IMS",
                "status": "Drafts",
                "visibleTo": "1.0",
                "createTime": "2012-05-06",
                "creator": "admin",
                "description": "IMS",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 脚本
    var scriptListInfo = {
        "data": [
            {
                "id": "001",
                "name": "mysql",
                "scriptName": "install.sh",
                "osType": "linux",
                "status": "Normal",
                "visibleTo": "System",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "path": "/opt",
                "command": "sh install.sh",
                "version": "1.0",
                "operator": ""
            },
            {
                "id": "002",
                "name": "test",
                "scriptName": "install.bat",
                "osType": "Windows",
                "status": "Normal",
                "visibleTo": "System",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "path": "C:\\",
                "command": "install.bat",
                "version": "2.0",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 软件包
    var softwareListInfo = {
        "data": [
            {
                "showDetail":"",
                "az":"",
                "id": "001",
                "name": "mysql",
                "softwareType":"rpm",
                "version":"2",
                "osType": "linux",
                "status": "Normal",
                "visibleTo": "System",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "file": "mysql_1.0.rpm",
                "attachment": ["install.sh","start.sh"],
                "path": "/opt",
                "installCmd": "sh install.sh",
                "unInstallCmd": "sh unInstall.sh",
                "startCmd": "sh start.sh",
                "stopCmd": "sh stop.sh",
                "operator": ""
            },
            {
                "showDetail":"",
                "az":"",
                "id": "002",
                "name": "Discuz",
                "osType": "Windows",
                "softwareType":"rpm",
                "version":"2",
                "status": "Normal",
                "visibleTo": "System",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "file": "mysql_1.0.exe",
                "attachment": "install.bat",
                "path": "C:\\",
                "installCmd": "install.bat",
                "unInstallCmd": "sh unInstall.sh",
                "startCmd": "sh start.sh",
                "stopCmd": "sh stop.sh",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // ISO数据
    var isoListInfo = {
        "data": [
            {
                "id": "001",
                "name": "SUSE",
                "fileName": "puppet.iso",
                "type": "OS",
                "osType": "Linux",
                "version": "Novell SUSE Linux Enterprise 11 64bit",
                "description": "SUSE11",
                "createTime": "2012-06-12",
                "creator": "admin",
                "operator": ""
            },
            {
                "id": "002",
                "name": "mysql",
                "fileName": "mysql.iso",
                "type": "Software",
                "osType": "Linux",
                "version": "CentOS 6.3 32bit",
                "description": "mysql",
                "createTime": "2012-06-12",
                "creator": "admin",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    fixture({
        "GET /resources/template/software/query": function(original, response){
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = softwareListInfo.data;
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
            for (var index = startIndex; index < endIndex && index < softwareListInfo.data.length; index++)
            {
                data.push(softwareListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = softwareListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/template/software/delete": function(original, response){
            var id = original.data.id;
            var dataList = softwareListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    softwareListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "GET /resources/template/software/detail": function(original, response){
            var id = original.data.id;
            var softwareList = softwareListInfo.data;
            var res = undefined;
            for (var index in softwareList)
            {
                if (softwareList[index].id === id)
                {
                    res = softwareList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },

        // 虚拟机模板
        "GET /resources/template/vmTemplate/query": function(original, response){
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < vmtListInfo.data.length; index++)
            {
                data.push(vmtListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = vmtListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/template/vmTemplate/delete": function(original, response){
            var id = original.data.id;
            var dataList = vmtListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    vmtListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/template/vmTemplate/discover": function(original, response){
            var vmtList = vmtListInfo.data;

            for (var index in vmtList)
            {
                if (vmtList[index].id === discoverVmtInfo.id)
                {
                    response(200, "success", "ok", {});
                    return;
                }
            }

            vmtList.push(discoverVmtInfo);
            vmtListInfo.totalRecords += 1;
            response(200, "success", "ok", {});
        },
        "GET /resources/template/vmTemplate/detail": function(original, response){
            var id = original.data.id;
            var vmtList = vmtListInfo.data;
            var res = undefined;
            for (var index in vmtList)
            {
                if (vmtList[index].id === id)
                {
                    res = vmtList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },
        "GET /resources/template/vmTemplate/deassociate": function(original, response){
            response(200, "success", "ok", {});
        },
        "GET /resources/template/vmTemplate/convertToCommon": function(original, response){
            response(200, "success", "ok", {});
        },
        "GET /resources/template/vmTemplate/convertToGlobal": function(original, response){
            response(200, "success", "ok", {});
        },
        "GET /resources/template/vmTemplate/convertToVM": function(original, response){
            response(200, "success", "ok", {});
        },
        "GET /resources/template/vmTemplate/associate": function(original, response){
            response(200, "success", "ok", {});
        },

        // ISO
        "GET /resources/template/iso/query": function(original, response){
            var queryInfo = original.data;
            if (queryInfo.id != undefined) {
                var dataList = isoListInfo.data;
                for (var index in dataList)
                {
                    if (dataList[index].id === queryInfo.id)
                    {
                        response(200, "success", dataList[index], {});
                    }
                }
            }

            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < isoListInfo.data.length; index++)
            {
                data.push(isoListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = isoListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "GET /resources/template/iso/modify": function(original, response){
            response(200, "success", "", {});
        },
        "POST /resources/template/iso/delete": function(original, response){
            var id = original.data.id;
            var dataList = isoListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    isoListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "POST /resources/template/iso/create": function(original, response){
            var zoneInfo = original.data;
            var dataList = isoListInfo.data;
            zoneInfo.id = new Date().getMilliseconds();
            zoneInfo.operator="";
            dataList.push(zoneInfo);
            isoListInfo.totalRecords = dataList.length;

            response(200, "success", zoneInfo, {});
        },

        // 逻辑模板
        "GET /resources/template/logicVmTemplate/query": function(original, response){
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = logicVmtListInfo.data;
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
            for (var index = startIndex; index < endIndex && index < logicVmtListInfo.data.length; index++)
            {
                data.push(logicVmtListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = logicVmtListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/template/logicVmTemplate/delete": function(original, response){
            var id = original.data.id;
            var dataList = logicVmtListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    logicVmtListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "GET /resources/template/logicVmTemplate/create": function(original, response){
            response(200, "success", "ok", {});
        },
        "GET /resources/template/logicVmTemplate/modify": function(original, response){
            response(200, "success", "ok", {});
        },

        // 应用模板
        "GET /resources/template/appTemplate/query": function(original, response){
            var queryInfo = original.data;
            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < appTemplateListInfo.data.length; index++)
            {
                data.push(appTemplateListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = appTemplateListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/template/appTemplate/delete": function(original, response){
            var id = original.data.id;
            var dataList = appTemplateListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    appTemplateListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },

        // 脚本
        "GET /resources/template/script/query": function(original, response){
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = scriptListInfo.data;
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
            for (var index = startIndex; index < endIndex && index < scriptListInfo.data.length; index++)
            {
                data.push(scriptListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = scriptListInfo.data.length;
            response(200, "success", dataList, {});
        },
        "POST /resources/template/script/delete": function(original, response){
            var id = original.data.id;
            var dataList = scriptListInfo.data;
            for (var index in dataList)
            {
                if (dataList[index].id === id)
                {
                    dataList.splice(index, 1);
                    scriptListInfo.totalRecords = dataList.length;
                    break;
                }
            }

            response(200, "success", "ok", {});
        },
        "GET /resources/template/script/detail": function(original, response){
            var id = original.data.id;
            var softwareList = scriptListInfo.data;
            var res = undefined;
            for (var index in softwareList)
            {
                if (softwareList[index].id === id)
                {
                    res = softwareList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },
        "GET /resources/template/script/create": function(original, response){

            response(200, "success", "ok", {});
        },
        "GEt /resources/template/script/modify": function(original, response){
            response(200, "success", "ok", {});
        },

        // 创建虚拟机模板时，需要的查询接口
        "GET /resources/hypervisor/query": function(original, response){
            var data = [
                {"key": "FS_001", "value": "FS_001"},
                {"key": "FS_002", "value": "FS_002"}
            ];
            response(200, "success", data, {});
        },
        "GET /resources/cluster/query": function(original, response){
            var data = [
                {"name": "cluster_001", "type": "Virtualization", "description":"..."},
                {"name": "cluster_002", "type": "Virtualization", "description":"..."}
            ];
            response(200, "success", data, {});
        },
        "GET /resources/host/query": function(original, response){
            var data = [
                {"key": "host_001", "value": "host_001"},
                {"key": "host_002", "value": "host_002"}
            ];
            response(200, "success", data, {});
        },
        "GET /goku/rest/v1.5/sr/1/vmtemplates": function (original, response) {
            response(200, "success", newvmTemplateListInfo, {});
        },
        "POST /goku/rest/v1.5/sr/1/vmtemplates/id/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/sr/1/vmtemplates/{id}": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/action": function (original, response) {
            var result = {
                "list":{"sort":"id","order":"desc","start":0,"total":0,"size":0,"hypervisors":null}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/ame/1/isos": function (original, response) {
            response(200, "success", newIsoList, {});
        },
        "POST /goku/rest/v1.5/irm/1/hypervisors/action": function (original, response) {
            var result =
            {
                "list":{"sort":"id","order":"desc","start":0,"total":0,"size":0,"hypervisors":null}
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/ame/1/softwares/{id}": function (original, response) {
            var result =
            {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/ame/1/scripts/{id}": function (original, response) {
            var result =
            {
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/sr/1/vm-flavors": function (original, response) {
            var result =
            {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/sr/1/vm-flavors": function (original, response) {
            var result =
            {
                "vmFlavors":[
                    {"flavorId":"3fe42cdc456316110145631f52280002","name":"defaultFlavor2",
                        "desc":"The default flavortest with max value!!","cpuCount":8,"memSize":8192,"disks":[
                            {"index":5,"diskSize":20,"media":"SAN-Any"},{"index":6,"diskSize":20,"media":"SAN-Any"},
                            {"index":7,"diskSize":20,"media":"SAN-Any"},{"index":8,"diskSize":20,"media":"SAN-Any"},
                            {"index":9,"diskSize":20,"media":"SAN-Any"},{"index":10,"diskSize":20,"media":"SAN-Any"},
                            {"index":11,"diskSize":20,"media":"SAN-Any"},{"index":12,"diskSize":20,"media":"SAN-Any"},
                            {"index":13,"diskSize":20,"media":"SAN-Any"},{"index":14,"diskSize":20,"media":"SAN-Any"}],
                        "slaLabels":[],"qos":{"cpuReserve":50,"cpuLimit":50,"cpuShare":8000,"memReserve":50,"memShare":20480}},
                    {"flavorId":"3fe42cdc456316110145631f52280001","name":"defaultFlavor1","desc":"The default flavortest with mid value!!",
                        "cpuCount":4,"memSize":8192,"disks":[{"index":0,"diskSize":20,"media":"SAN-Any"},{"index":1,"diskSize":20,"media":"SAN-Any"},
                        {"index":2,"diskSize":20,"media":"SAN-Any"},{"index":3,"diskSize":20,"media":"SAN-Any"},{"index":4,"diskSize":20,"media":"SAN-Any"}],
                        "slaLabels":[],"qos":{"cpuReserve":50,"cpuLimit":50,"cpuShare":65536,"memReserve":50,"memShare":1000000}}
                ],"total":3
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/sr/1/vm-logic-templates": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/ame/1/softwares": function (original, response) {
            response(200, "success", newSoftwareList, {});
        },
        "GET /goku/rest/v1.5/ame/1/scripts": function (original, response) {
            response(200, "success", newScriptList, {});
        },
        "GET /goku/rest/v1.5/ame/1/repository": function (original, response) {
            var resp = {};
            resp.freeCapacity = 3046;
            response(200, "success", resp, {});
        }
    });

    return fixture;
});