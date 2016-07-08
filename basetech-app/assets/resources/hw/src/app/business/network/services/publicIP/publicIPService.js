
define(["app/services/ajaxBase"],
    function (ajax) {
        "use strict";

        ajax.publicIP = {
            // VPCResource
            queryList : function(para, onOK, onErr)
            {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/publicips?cloud-infras={cloud_infras_id}&usedType={usedType}&start={start}&limit={limit}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId,
                        usedType : para.usedType||"",
                        start : (0 === para.start) ? 0 : (para.start||""),
                        limit : para.limit||""
                    }
                );

                ajax.finish(ret, onOK, onErr);
            },
            queryPublicIPALL : function(para, onOK, onErr)
            {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/publicips?cloud-infras={cloud_infras_id}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId
                    }
                );

                ajax.finish(ret, onOK, onErr);
            },
            apply : function(para, onOK, onErr)
            {
                var ret = ajax.send("post",
                    "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/publicips?cloud-infras={cloud_infras_id}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId
                    },
                    {
                        publicIpPoolId:para.pulbicIPPool,
                        ip:para.publicIP,
                        num:para.puclicIPNum

                    }
                );

                ajax.finish(ret, onOK, onErr);
            },

            free : function(para, onOK, onErr)
            {
                var ret = ajax.send("post",
                    "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/publicips/action?cloud-infras={cloud_infras_id}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId


                    },
                    {
                        publicIP:para.publicIP

                    }
                );

                ajax.finish(ret, onOK, onErr);
            }


        };
        ajax.net = {
            queryRouter : function(para, onOK, onErr)
            {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/routers?cloud-infras={cloud_infras_id}&azid={azid}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId,
                        azid : para.azId
                    }
                );

                ajax.finish(ret, onOK, onErr);
            },
            queryPublicIPPool : function(para, onOK, onErr)
            {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/{vdc_id}/publicippools?cloud-infras={cloud_infras_id}&vpcid={vpcid}",
                    {
                        vdc_id: para.vdcId,
                        vpcid :para.vpcId,
                        cloud_infras_id : para.cloudInfraId
                    }
                );

                ajax.finish(ret, onOK, onErr);
            }
        }

        return ajax;
    });