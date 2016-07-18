define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {

    var vpcTemplates={"vpcSpecTemplates":[{"maxDirectNetworkNum":20,"maxRoutedNetworkNum":20,"maxInternalNetworkNum":20,"maxPublicIpNum":20,"maxNetworkBandWidth":4000,"priority":2,"maxSecurityGroupNum":20,"maxRxThroughput":50,"maxTxThroughput":50,"maxVCPUNum":-1,"maxMemoryCapacity":-1,"maxVMNum":-1,"maxStorageCapacity":-1,"vpcSpecTemplateID":"0","name":"vpc-default"}]};
    var vpcTemplate={"maxDirectNetworkNum":20,"maxRoutedNetworkNum":20,"maxInternalNetworkNum":20,"maxPublicIpNum":20,"maxNetworkBandWidth":4000,"priority":2,"maxSecurityGroupNum":20,"maxRxThroughput":50,"maxTxThroughput":50,"maxVCPUNum":-1,"maxMemoryCapacity":-1,"maxVMNum":-1,"maxStorageCapacity":-1,"vpcSpecTemplateID":"0","name":"vpc-default"};


    fixture({
        //创建模板
      /*  "POST /goku/rest/v1.5/{vdc_id}/apptemplates": function (original, response) {
            response(200, "success", {"templateId": "123455"}, {});
        },*/

       /* //查询模板体
        "GET /goku/rest/v1.5/{vdc_id}/apptemplates/{id}/contents": function (original, response) {
            if (!original.data.vdc_id || !original.data.id) {
                //参数无效
                response(500, "fail", {}, {});
                return;
            }
            response(200, "success", template, {});
        },*/

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