define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var availableServiceTemplates = {
        "appTemplates":[
            {"id":"11001","name":"SimpleApp_Single_Instance","description":"SimpleApp_Single_Instance",
                "picture":"buff01.jpg","status":"Draft","vdcId":"all","vdcName":null,"userId":"1","userName":null,
                "createTime":"2014-05-04 17:54:04","resPoolType":"FusionManager"},
            {"id":"11002","name":"AutoScaling","description":"AutoScaling","picture":"buff01.jpg","status":"Published",
                "vdcId":"all","vdcName":null,"userId":"1","userName":null,"createTime":"2014-05-04 17:54:04","resPoolType":"FusionManager"
            }
        ],
        "total":2
    };
    var vpcTemplates = {"vpcSpecTemplates": [
        {"maxDirectNetworkNum": 20, "maxRoutedNetworkNum": 20, "maxInternalNetworkNum": 20, "maxPublicIpNum": 20, "maxNetworkBandWidth": 4000, "priority": 2, "maxSecurityGroupNum": 20, "maxRxThroughput": 50, "maxTxThroughput": 50, "maxVCPUNum": -1, "maxMemoryCapacity": -1, "maxVMNum": -1, "maxStorageCapacity": -1, "vpcSpecTemplateID": "0", "name": "vpc-default"}
    ]};
    var vpcTemplate = {"maxDirectNetworkNum": 20, "maxRoutedNetworkNum": 20, "maxInternalNetworkNum": 20, "maxPublicIpNum": 20, "maxNetworkBandWidth": 4000, "priority": 2, "maxSecurityGroupNum": 20, "maxRxThroughput": 50, "maxTxThroughput": 50, "maxVCPUNum": -1, "maxMemoryCapacity": -1, "maxVMNum": -1, "maxStorageCapacity": -1, "vpcSpecTemplateID": "0", "name": "vpc-default"};


    fixture({
        //创建模板
        "POST /goku/rest/v1.5/{vdc_id}/apptemplates": function (original, response) {
            var request = JSON.parse(original.data);

            var appId = Math.ceil(Math.random()*100000);
            var createTime = new Date();

            var appTemplate = {
                name:request.name,
                description:request.desc,
                picture:request.picture,
                resPoolType:request.resPoolType,
                body:request.body,
                id:appId,
                status:"Draft",
                vdcId:"all",
                vdcName:null,
                userId:"1",
                userName:null,
                createTime:createTime.getUTCDate()
            };

            availableServiceTemplates.total++;
            availableServiceTemplates.appTemplates.push(appTemplate);
            response(200, "success", {}, {});
        },

        //查询模板体
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/{id}/contents": function (original, response) {
            if (!original.data.vdc_id || !original.data.id) {
                //参数无效
                response(500, "fail", {}, {});
                return;
            }
            response(200, "success", template, {});
        },

        //更新模板
        "PUT /goku/rest/v1.5/{vdc_id}/apptemplates/{id}": function (original, response) {
            response(200, "success", {}, {});
        },

        //vpcList模板
        "GET /goku/rest/v1.5/{tenant_id}/vpcspectemplates": function (original, response) {
            response(200, "success", vpcTemplates, {});
        },

        //vpc模板
        "GET /goku/rest/v1.5/{tenant_id}/vpcspectemplates/{id}": function (original, response) {
            response(200, "success", vpcTemplate, {});
        },

        //更新vpc模板
        "put /goku/rest/v1.5/{tenant_id}/vpcspectemplates/{id}": function (original, response) {
            response(200, "success", vpcTemplate, {});
        }
    });
    return fixture;
});