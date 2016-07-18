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
                "status": "FINISHED",
                "createTime": "2014-03-15",
                "createName": "admin",
                "virtualizedEnvironment":"FCVE_R5CA001"
            },
            {
                "id": "002",
                "vmtName": "virtualTemplate_Service02",
                "type": "Application Templates 2",
                "osType": "Windows",
                "osVersion": "8.0",
                "status": "FINISHED",
                "createTime": "2014-03-06",
                "createName": "admin",
                "virtualizedEnvironment":"FCVE_R5CA001"
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
            var request = JSON.parse(original.data);
            var result = {
            }
            response(200, "success", newvmTemplateListInfo, {});
        },
        "GET /goku/rest/v1.5/sr/1/vmtemplates/{id}": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/hypervisors/action": function (original, response) {
            var result = {
                "list":
                {
                    "sort":"id",
                    "order":"desc",
                    "start":0,
                    "total":1,
                    "size":1,
                    "hypervisors":[
                        {
                            "id":"4629700416936869889",
                            "updatestatus":1,
                            "addTime":1420701139482,
                            "modifyTime":1420701139482,
                            "refreshTime":1420784206103,
                            "ifDeleteStatus":true,
                            "connector":{
                                "ip":"188.188.40.10",
                                "activeIp":null,
                                "standbyIp":null,
                                "userName":"gmsysman",
                                "password":null,
                                "protocol":"https",
                                "port":7443,
                                "id":"4634204016564240393",
                                "status":"connected",
                                "errorCode":null,
                                "errorDesc":null
                            },
                            "hyperOption":null,
                            "name":"FC",
                            "type":"FusionCompute",
                            "version":"1.5.0",
                            "vendor":"huawei",
                            "refreshCycle":6,
                            "vsam":{
                                "id":"4629700416936869891",
                                "name":"vsam",
                                "type":"vsam",
                                "version":"1.5.0",
                                "vendor":"huawei",
                                "connectstatus":1420773774205,
                                "updatestatus":1420775740827,
                                "addTime":0,
                                "modifyTime":3,
                                "hypervisorId":null,
                                "connector":{
                                    "ip":"188.188.40.52",
                                    "activeIp":null,
                                    "standbyIp":null,
                                    "userName":"gmsysman",
                                    "password":null,
                                    "protocol":"https",
                                    "port":18443,
                                    "id":"4634204016564240396",
                                    "status":"connected",
                                    "errorCode":null,
                                    "errorDesc":null}
                            },"modifyVlanpoolFlag":true}]}}

            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/ame/1/isos": function (original, response) {
            response(200, "success", newIsoList, {});
        },
        //查询虚拟机模板
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
        },
        "POST /goku/rest/v1.5/irm/1/hosts": function (original, response) {
           var result = {"hosts":[{"id":"1","virtualId":"4629700416936869889$urn:sites:5A00094E:hosts:289","name":"CNA01","runtimeState":"normal","hostIp":"188.188.40.21","maintenanceStatus":false,"cpuSpeed":2.4,"memorySizeGB":43.9365234375,"cpuUsageRate":"9.53","memUsageRate":"7.06","runningVMCount":0,"faultVMCount":0,"physicalCpuQuantity":2,"logicalCpuQuantity":6,"imcSetting":null,"maxImcSetting":"Sandy Bridge"},{"id":"2","virtualId":"4629700416936869889$urn:sites:5A00094E:hosts:293","name":"CNA02","runtimeState":"normal","hostIp":"188.188.40.22","maintenanceStatus":false,"cpuSpeed":2.4,"memorySizeGB":43.9365234375,"cpuUsageRate":"7.93","memUsageRate":"6.65","runningVMCount":0,"faultVMCount":0,"physicalCpuQuantity":2,"logicalCpuQuantity":6,"imcSetting":null,"maxImcSetting":"Sandy Bridge"}],"total":2}

            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/sr/1/vmtemplates": function (request, response) {
            var riginal = JSON.parse(request.data);
            var addInfo = {
                "id": "001",
                "vmtName": riginal.name,
                "type": "Application Templates",
                "osType": riginal.osOption.osType,
                "osVersion": riginal.osOption.osVersion,
                "status": "FINISHED",
                "createTime": "2014-03-15",
                "createName": "admin",
                "virtualizedEnvironment":riginal.cluster.hypervisorName
            };
            newvmTemplateListInfo.totalNum++;
            newvmTemplateListInfo.vmtemplates.push(addInfo);
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/zone/46161896180547584010755/dvses?start=0&limit=10&name=&hypervisorid=": function (original, response) {
            var result = {
                "dvses":[{"id":"1","name":"FCDVS_SZA01","dvsType":"VSWITCH","clusterIDsMapNames":{"4625196817309499393":"manageRC_A01"},"hypervisorID":"4629700416936869889","hypervisorName":"FCVE_R5CA001","vsses":null,"description":null,"vlanIdList":["1"]}],"total":1
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/1/vms/4629700416936869889$urn:sites:3E3F0759:vms:i-000005F3": function (request, response) {
            var result =
            {"vmInfo":{"id":"4629700416936869891$urn:sites:488407E4:vms:i-00000047","rid":"urn:sites:488407E4:vms:i-00000047","hostUrn":"urn:sites:488407E4:hosts:14","hostName":"CNA01","hostId":10,"hostIp":"166.166.40.71","name":"FM01","location":"urn:sites:488407E4:hosts:14","availableZoneId":"","availableZoneName":"","vmOption":{"supportPauseResume":true,"supportVolumeRecycle":true,"supportSetMac":true,"supportRemoteAttach":true,"supportModifyDiskName":true,"zeroFillDiskIndependent":false,"cpuNeedReboot":true,"memoryNeedReboot":true,"deleteNeedStoped":false,"removeVmResources":false,"displayCreateVmTime":true,"displayTemporaryStatus":true,"supportHibernateDelete":true,"needToSyncVrm":true,"needAddToSG":true,"suppportModDiskPropertyOnline":true,"suppportAddDELNicOnline":true,"suppportExpandDiskOnline":true,"displayOriginalNetworkInfo":false},"vmConfig":{"attribute":{"bootOption":"cdrom","autoHibernate":false,"hibernateThreshholdM":60,"syncTimeWithHost":false,"reoverByHost":false,"clockMode":"freeClock","isEnableMemVol":false,"isEnableFt":null,"isAutoUpgrade":true,"attachType":false,"secureVmType":null,"enableHa":true},"cpu":{"quantity":6,"coresPerSocket":0,"reservation":15000,"weight":6000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":18432,"reservation":18432,"weight":184320,"level":10,"limit":18432,"memHotPlug":0},"disks":[{"quantityGB":120.0,"allocType":"thick","indepDisk":true,"diskName":"i-00000047-xvda","storageType":"local","type":"normal","storageLocation":"urn:sites:488407E4:datastores:1","strictThickFormat":true,"pciType":"IDE","persistentDisk":true,"volumeId":"4629700416936869891$urn:sites:488407E4:volumes:255","diskId":1,"diskUsed":0.0,"volumeguid":null,"storageName":"data","dataStoreId":10,"dataStoreUrn":"urn:sites:488407E4:datastores:1","dataStoreType":null,"disasterGroupName":null,"disasterGroupId":0,"volUsedSizeMB":122880,"volUsedSizeGB":120.0,"vmUsedSizeMB":9733,"vmUsedSizeGB":9.5,"vmRecycleSizeMB":-1,"vmRecycleSizeGB":-1.0,"supportRecycle":false,"supportModify":false,"volFileName":"urn:sites:488407E4:volumes:255","supportDiskManagement":true,"diskStatus":"USE","mediaType":"SAN-Any","maxReadBytes":0,"maxWriteBytes":0,"maxReadRequest":0,"maxWriteRequest":0,"volType":null,"volumeUuid":null,"isDataCopy":true,"isThin":false,"volNameOnDev":"49CE11949BC64B009BF805AA4F63551F","createTime":0,"ioWeight":null}],"usbControllers":[{"controllerType":"EHCI+UHCI","controllerKey":""}],"usbNum":0,"nics":[{"id":"4629700416936869891$urn:sites:488407E4:vms:i-00000047:nics:0","name":"eth0","portGroupId":"urn:sites:488407E4:dvswitchs:1:portgroups:1","networkType":"UNKNOWN","networkIdUsedByNic":0,"sequenceNum":0,"canRelaseIp":true,"pglongId":0,"portGroupName":"managePortgroup","mac":"28:6e:d4:88:c6:2f","ip":"166.166.40.41","ips6":null,"vlanid":null,"bandLimit":null,"subnetid":null,"networkid":null,"subnetMask":null,"gateWay":null,"primaryWins":null,"secondaryWins":null,"domainName":null,"domainSearch":null,"primaryDNS":null,"secondaryDNS":null,"fwType":null,"ipConfigType":null,"setGateway":true,"nicDBID":-1,"sgId":null,"sgName":null,"uri":null,"ipCheckResult":null,"floatIps":null}],"devices":[],"usb":[],"gpu":[]},"vmRebootConfig":{"cpu":{"quantity":6,"coresPerSocket":0,"reservation":15000,"weight":6000,"level":1000,"limit":0,"cpuHotPlug":0},"memory":{"quantityMB":18432,"reservation":18432,"weight":184320,"level":10,"limit":18432,"memHotPlug":0}},"os":{"osVersionDesc":"","osType":"Linux","osVersion":43,"osVersiontype":"Novell SUSE Linux Enterprise Server 11 SP1 64bit","cpuQuantityLimit":0,"cpuSocketLimit":0,"memQuantityLimit":0,"supportCpuHotPlug":false,"supportMemHotPlug":false,"hostname":"FM01","password":"7fbHwLGJ","supportCustomizedName":false,"customizedOsName":""},"status":"running","repairStatus":null,"backupStatus":"NORMAL","osStatus":null,"vncAcessInfo":{"hostip":"166.166.40.71","vncport":5902,"vncpassword":"GUb3m8nB","vncEncMode":"","vncMode":"","shaEncFlag":true},"vappRid":"","vappId":0,"vappName":null,"tag":"","userName":"","description":"","createTime":"2014-09-26 02:21:04","creatorId":"","isTemplate":"false","isLinkClone":"false","statusStr":"","osStatusStr":"","cpuUsageRate":"","memUsageRate":"","diskUsageRate":"","vmInnerState":"","pvDriverStatus":"running","toolVersion":"1.3.10.11","toolInstallStatus":"empty","cdRomStatus":"fill","attachedFilePath":"D:/ISO_FM/FusionManager V100R005C00_SV.iso","group":"VRMGroup","clusterUrn":"urn:sites:488407E4:clusters:10","clusterId":"4625196817309499398","clusterName":"","nicByteIn":"","nicByteOut":"","uri":"","dc":"","zone":"","resourcepool":"","vmType":"fusioncompute","instanceuuid":"urn:sites:488407E4:vms:i-00000047","hypervisorId":"4629700416936869891","hypervisorName":"FCR3C10","cpuUsed":600,"memUsed":18678,"templateIsLost":"","vmVisibleId":"i-00000047","templateID":"0","vpcId":"-1","vpcName":null,"vdcId":null,"uuid":"08a9b29b-a579-4001-bf74-8e22778fe99c","locationName":"CNA01","dataStoreUrns":["urn:sites:488407E4:datastores:1"],"idle":0,"nicsTxLimit":[],"imcSetting":null,"hbaCardNum":"","beginRuntime":"2014-09-26 02:21:04","vsaVmType":null,"vsamVm":false,"disasterGroupId":0,"disasterGroupName":"","useDisasterGroup":false,"originalNetworks":[],"orgName":"","orgId":null,"alarmInfo":null,"domainId":"","domainName":null,"category":null,"cpuQosMap":{"1":{"maxCpuReserve":2500,"maxCpuLimit":2500},"2":{"maxCpuReserve":5000,"maxCpuLimit":5000},"3":{"maxCpuReserve":7500,"maxCpuLimit":7500},"4":{"maxCpuReserve":10000,"maxCpuLimit":10000},"5":{"maxCpuReserve":12500,"maxCpuLimit":12500},"6":{"maxCpuReserve":15000,"maxCpuLimit":15000},"7":{"maxCpuReserve":17500,"maxCpuLimit":17500},"8":{"maxCpuReserve":20000,"maxCpuLimit":20000},"9":{"maxCpuReserve":22500,"maxCpuLimit":22500},"10":{"maxCpuReserve":25000,"maxCpuLimit":25000},"11":{"maxCpuReserve":27500,"maxCpuLimit":27500},"12":{"maxCpuReserve":30000,"maxCpuLimit":30000},"13":{"maxCpuReserve":32500,"maxCpuLimit":32500},"14":{"maxCpuReserve":35000,"maxCpuLimit":35000},"15":{"maxCpuReserve":35000,"maxCpuLimit":37500},"16":{"maxCpuReserve":35000,"maxCpuLimit":40000},"17":{"maxCpuReserve":35000,"maxCpuLimit":42500},"18":{"maxCpuReserve":35000,"maxCpuLimit":45000},"19":{"maxCpuReserve":35000,"maxCpuLimit":47500},"20":{"maxCpuReserve":35000,"maxCpuLimit":50000},"21":{"maxCpuReserve":35000,"maxCpuLimit":52500},"22":{"maxCpuReserve":35000,"maxCpuLimit":55000}}}}
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/hypervisors/action": function (original, response) {
            var result = {
                "list":{
                    "sort":"id","order":"desc","start":0,"total":1,"size":1,
                    "hypervisors":[
                        {"name":"FCVE_R5CA001","type":"FusionCompute","version":"1.5.0","vendor":"huawei","refreshCycle":6,
                            "connector":{
                                "ip":"191.100.71.5","activeIp":null,"standbyIp":null,"userName":"gmsysman",
                                "password":"Huaweo@CLOUD8","protocol":"https","port":7443,"status":"connected","errorCode":null,
                                "errorDesc":null
                            },
                            "id":"4629700416936869889","updatestatus":1,"addTime":1410488702005,"modifyTime":1410488702005,
                            "refreshTime":1411888461301,"ifDeleteStatus":true,"hyperOption":null,"vsam":{"name":''}
                        }
                    ]
                }
            }
            response(200, "success", result, {});
        },
        "POST goku/rest/v1.5/irm/1/volumes/action": function (original, response) {
            var result = {"diskParams":{"configModeList":["thickformat","thick","thin"],"mediaTypeList":["SAN-Any"],"snapshotAffectedList":["TRUE","FALSE"],"qosMap":{"thick":{"SAN-Any":[false,true]},"thin":{"SAN-Any":[false,true]},"thickformat":{"SAN-Any":[false,true]}}}}
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action": function (original, response) {
            var result = {
            }
            response(200, "success", result, {});
        }
    });

    return fixture;
});