define(["can/util/fixture/fixture"], function (fixture) {
    var diskList = {
        "data": [
            {
                "showDetail": "",
                "id": "001",
                "diskName": "i-000000B",
                "capacity": "2",
                "configMode": "普通延迟置零",
                "isSnap": "是",
                "medium": "SAN-Any"
            },
            {
                "showDetail": "",
                "id": "001",
                "diskName": "i-000000B",
                "capacity": "2",
                "configMode": "普通延迟置零",
                "isSnap": "是",
                "medium": "SAN-Any"
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };
    // 虚拟机模板
    var vmTemplateData = {
        "vmtemplates": [
            {
                "vmtID": "001",
                "vmtName": "虚拟机模板-服务",
                "osType": "Linux",
                "osVersion": "1.0",
                "status": "VMCREATING",
                "lostStatus": "VMCREATING",
                "createTime": "2012-05-06",
                "creator": "admin",
                "operation": "",
                "logicVmtName": "逻辑模板_001",
                "cpuInfo": {"quantity": 8},
                "cpuShare": "低",
                "cpuQuota": "256",
                "memoryInfo": {"quantity": 8192},
                "memoryShare": "中",
                "memoryQuota": "1024",
                "range": "系统",
                "zone": "xxxxx",
                "showDetail": "",
                "description": "The Windows 2008 system, can be used for desktop cloud virtual machine.",
                "spec": "",
                "diskdetail": [
                    {
                        "name": "FMDISK_AZ001",
                        "quantity": "20",
                        "configMode": "精简",
                        "mediaType": "SAN_ANY",
                        "isAffectedBySnaps": "是"
                    }
                ],
                "resourceTabs": [
                    {
                        "sla": "存储类型",
                        "attribute": "IPSAN"
                    },
                    {
                        "sla": "CPU优化",
                        "attribute": "金"
                    }
                ],
                "createName": "FADFASF",
                "clusterName": "cluster001",
                "resourceId": "XXX",
                "type": "应用模板",
                "virtualEnvID": "",
                "clusterId": "001",
                "availableZoneId": "001",
                "availableZoneName": "az01",
                "errorCode": "CODE01",
                "vmLogicTemplateID": "TEMPLATE001",
                "failReason": "RESONG",
                "virtualizedEnvironment": "VIRTUAL",
                "vdcId": "1",
                "vmtViewId": "11",
                "userid": "USER",
                "softwares": "DESCRIPTION"
            },
            {   "vmtID": "002",
                "vmtName": "虚拟机模板-服务",
                "osType": "Windows",
                "osVersion": "1.0",
                "creator": "kang",
                "operation": "",
                "logicVmtName": "-",
                "cpuInfo": {"quantity": 8},
                "cpuShare": "低",
                "cpuQuota": "256",
                "memoryInfo": {"quantity": 8192},
                "memoryShare": "中",
                "memoryQuota": "1024",
                "range": "组织",
                "zone": "xxxxx",
                "spec": "bbbbbbbbbbbb",
                "showDetail": "",
                "diskdetail": [
                    {
                        "name": "FMDISK_AZ001",
                        "quantity": "20",
                        "configMode": "精简",
                        "mediaType": "SAN_ANY",
                        "isAffectedBySnaps": "是"
                    },
                    {
                        "name": "FMDISK_AZ002",
                        "quantity": "10",
                        "configMode": "普通",
                        "mediaType": "SAN_SSD",
                        "isAffectedBySnaps": "否"
                    }
                ],
                "resourceTabs": [
                    {
                        "sla": "存储类型",
                        "attribute": "IPSAN"
                    },
                    {
                        "sla": "CPU优化",
                        "attribute": "金"
                    }
                ],
                "description": "The virtual machine template",
                "status": "VMCREATING",
                "lostStatus": "VMCREATING",
                "createTime": "2012-05-06",
                "createName": "FADFASF",
                "clusterName": "cluster001",
                "resourceId": "XXX",
                "type": "应用模板",
                "virtualEnvID": "",
                "clusterId": "001",
                "availableZoneId": "001",
                "availableZoneName": "az01",
                "errorCode": "CODE01",
                "vmLogicTemplateID": "TEMPLATE001",
                "failReason": "RESONG",
                "virtualizedEnvironment": "VIRTUAL",
                "vdcId": "2",
                "vmtViewId": "11",
                "userid": "USER",
                "softwares": "DESCRIPTION"
            }
        ],
        "total": 2
    };
    // 脚本
    var scriptListInfo = {
        "scriptInfos": [
            {
                "showDetail": "",
                "az": "",
                "id": "001",
                "name": "mysql",
                "scriptName": "install.sh",
                "osType": "linux",
                "status": "正常",
                "range": "0",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "icon": "../theme/default/images/edit.png",
                "mainFilePath": "/opt",
                "installCommand": "sh install.sh",
                "version": "1.0",
                "operator": ""
            },
            {
                "showDetail": "",
                "az": "",
                "id": "002",
                "name": "test",
                "scriptName": "install.bat",
                "osType": "Windows",
                "status": "正常",
                "range": "1",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "icon": "../theme/default/images/edit.png",
                "mainFilePath": "C:\\",
                "installCommand": "install.bat",
                "version": "2.0",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };

    // 软件包
    var softwareListInfo = {
        "softwareInfos": [
            {
                "showDetail": "",
                "az": "",
                "id": "001",
                "name": "mysql",
                "fileType": "rpm",
                "version": "2",
                "osType": "linux",
                "status": "Normal",
                "range": "0",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "mainFilePath": "mysql_1.0.rpm",
                "attachment": ["install.sh", "start.sh"],
                "destinationPath": "/opt",
                "installCommand": "sh install.sh",
                "unInstallCommand": "sh unInstall.sh",
                "startCommand": "sh start.sh",
                "stopCommand": "sh stop.sh",
                "operator": ""
            },
            {
                "showDetail": "",
                "az": "",
                "id": "002",
                "name": "Discuz",
                "osType": "Windows",
                "fileType": "rpm",
                "version": "2",
                "status": "Normal",
                "range": "1",
                "createTime": "2013-02-12",
                "creator": "admin",
                "description": "Discuz",
                "picture": "../theme/default/images/edit.png",
                "mainFilePath": "mysql_1.0.exe",
                "attachment": "install.bat",
                "destinationPath": "C:\\",
                "installCommand": "install.bat",
                "unInstallCommand": "sh unInstall.sh",
                "startCommand": "sh start.sh",
                "stopCommand": "sh stop.sh",
                "operator": ""
            }
        ],
        "curPage": 0,
        "totalRecords": 2
    };
    fixture({
        //查询软件包
        "GET /goku/rest/v1.5/{vdc_id}/softwares?cloud-infra={cloud_infra_id}&name={name}&ostype={ostype}&filetype={filetype}&limit={limit}&start={start}&sort={sort}&order={order}": function (original, response) {
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = softwareListInfo.softwareInfos;
                for (var index in dataList) {
                    if (dataList[index].id === queryInfo.id) {
                        response(200, "success", dataList[index], {});
                        return;
                    }
                }
            }

            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < softwareListInfo.softwareInfos.length; index++) {
                data.push(softwareListInfo.softwareInfos[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = softwareListInfo.softwareInfos.length;
            response(200, "success", softwareListInfo, {});
        },
        //删除软件包
        "DELETE /goku/rest/v1.5/{vdc_id}/softwares/{softwareid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.softwareid;
            var dataList = softwareListInfo.softwareInfos;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    break;
                }
            }
            response(200, "success", dataList, {});
        },
        //软件包详情
        "GET /goku/rest/v1.5/{vdc_id}/softwares/{softwareid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.softwareid;
            var softwareList = softwareListInfo.softwareInfos;
            var res = undefined;
            for (var index in softwareList) {
                if (softwareList[index].id === id) {
                    res = softwareList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },
        //修改软件包
        "PUT /goku/rest/v1.5/{vdc_id}/softwares/{softwareid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.softwareid;
            response(200, "success", "ok", {});
        },
        //添加软件包
        "GET /goku/rest/v1.5/{vdc_id}/softwares": function (original, response) {
            var id = original.data.vdc_id;
            response(200, "success", softwareListInfo, {});
        },

        // 查询脚本脚本
        "GET /goku/rest/v1.5/{vdc_id}/scripts": function (original, response) {
            var queryInfo = original.data;

            if (queryInfo.id != undefined) {
                var dataList = scriptListInfo.data;
                for (var index in dataList) {
                    if (dataList[index].id === queryInfo.id) {
                        response(200, "success", dataList[index], {});
                        return;
                    }
                }
            }

            var startIndex = queryInfo.curPage * queryInfo.prePage;
            var endIndex = startIndex + queryInfo.prePage;

            // 构造返回列表
            var data = [];
            for (var index = startIndex; index < endIndex && index < scriptListInfo.scriptInfos.length; index++) {
                data.push(scriptListInfo.data[index]);
            }

            var dataList = {};
            dataList.data = data;
            dataList.curPage = queryInfo.curPage;
            dataList.totalRecords = scriptListInfo.scriptInfos.length;
            response(200, "success", scriptListInfo, {});
        },
        //删除脚本
        "DELETE /goku/rest/v1.5/{vdc_id}/scripts/{scriptid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.scriptid;
            var dataList = scriptListInfo.scriptInfos;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    break;
                }
            }

            response(200, "success", dataList, {});
        },
        //修改脚本
        "PUT /goku/rest/v1.5/{vdc_id}/scripts/{scriptid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.scriptid;
            response(200, "success", "ok", {});
        },
        //添加脚本
        "POST /goku/rest/v1.5/{vdc_id}/scripts?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.vdc_id;
            response(200, "success", "ok", {});
        },
        //查询脚本详情
        "GET /goku/rest/v1.5/{vdc_id}/scripts/{scriptid}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.scriptid;
            var softwareList = scriptListInfo.scriptInfos;
            var res = undefined;
            for (var index in softwareList) {
                if (softwareList[index].id === id) {
                    res = softwareList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        },

        //查询脚本使用信息详情
        "GET /goku/rest/v1.5/{vdc_id}/apps?limit={limit}&start={start}&scriptid={scriptid}&cloud-infra={cloud_infra_id}": function (original, response) {
            var scriptUseInfoList ={
                "appInstances":[{
                    "appName":"app001",
                    "status":"Starting",
                    "desc":"test",
                    "createEndTime":"2014-06-06 15:21:00",
                    "userId":"admin"
                }],
                "total":1
            };
            response(200, "success", scriptUseInfoList, {});
        },
        //查询软件包使用信息详情
        "GET /goku/rest/v1.5/{vdc_id}/apps?limit={limit}&start={start}&softwareid={scriptid}&cloud-infra={cloud_infra_id}": function (original, response) {
            var softUseInfoList ={
                "appInstances":[{
                    "appName":"app001",
                    "status":"StartFailed",
                    "desc":"test",
                    "createEndTime":"2014-06-06 15:21:00",
                    "userName":"admin"
                }],
                "total":1
            };
            response(200, "success", softUseInfoList, {});
        },
        //查询虚拟机模板
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates?cloud-infra={cloud_infra_id}&name={name}&ostype={ostype}&osversion={osversion}&limit={limit}&start={start}": function (original, response) {
            var curPage = request.data.curPage;
            var displayLength = request.data.displayLength;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.totalRecords = vmTemplateData.templateList.length;
            res.vmTemplateListRes = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < vmTemplateData.templateList.length; index++) {
                res.vmTemplateListRes.push(vmTemplateData.templateList[index])
            }
            var auth_org = original.data.auth_org;
            var cloud_infra_id = original.data.cloud_infra_id;
            var authUser = original.data.authUser;
            var addr = original.data.addr;
            var osType = original.data.osType;
            var str = original.data.str;
            response(200, "success", vmTemplateData.templateList, {})
        },
        //删除虚拟机模板
        "DELETE /goku/rest/v1.5/vdcs/{auth_org}/ssp/vmtemplates/{id}?cloud-infra={cloud_infra_id}": function (original, response) {
            var id = original.data.id;
            var dataList = vmTemplateData.templateList;
            for (var index in dataList) {
                if (dataList[index].id === id) {
                    dataList.splice(index, 1);
                    break;
                }
            }

            response(200, "success", dataList, {});
        },
        //虚拟机模板操作
        "POST /goku/rest/v1.5/vdcs/{auth_org}/ssp/vmtemplates/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var auth_org = original.data.auth_org;
            var cloud_infra_id = original.data.cloud_infra_id;
            var authUser = original.data.authUser;
            var action = original.data.action;
            response(200, "success", "OK", {});
        },
        //虚拟机模板详情
        "GET /goku/rest/v1.5/{vdc_id}/vmtemplates/{id}": function (original, response) {
            var id = original.data.id;
            var softwareList = vmTemplateData.vmtemplates;
            var res = softwareList[1];
            for (var index in softwareList) {
                if (softwareList[index].vmtID === id) {
                    res = softwareList[index];
                    break;
                }
            }
            response(200, "success", res, {});
        }
    });
    return fixture;
});