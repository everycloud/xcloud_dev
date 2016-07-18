define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var queryPVMSucc = {
        "vmInstanceInfo": {
            "status": "running",
            "id": "23456",
            "name": "PVM-01",
            "nics": [
                {
                    "id": "1234",
                    "name": "网卡-01",
                    "ip":"10.10.10.1",
                    "networkid": "network-001"
                },
                {
                    "id": "1234",
                    "name": "网卡-02",
                    "ip":"10.10.10.2",
                    "networkid": "network-002"
                },
                {
                    "id": "1234",
                    "name": "网卡-03",
                    "ip":"10.10.10.3",
                    "networkid": "network-003"
                },
                {
                    "id": "1234",
                    "name": "网卡-04",
                    "ip":"10.10.10.4",
                    "networkid": "network-004"
                },
                {
                    "id": "1234",
                    "name": "网卡-05",
                    "ip":"10.10.10.5",
                    "networkid": "network-005"
                },
                {
                    "id": "1234",
                    "name": "网卡-06",
                    "ip":"10.10.10.6",
                    "networkid": "network-006"
                }
            ]
        },
        "pvmState": "SUCCESS", // SUCCESS, FAILED, PROCESSING
        "azId": "123",
        "userId": "123",
        "createTime": "2014-03-07 15:51:43", //UTC
        "networkInfos": [
            {
                "nicId": "1234",
                "nicName": "Nic-01",
                "networkId": "network-001",
                "networkName": "Inter_network_AZ01",
                "status": "unused",// processing, normal, abnormal, unkown, unused
                "networkType": "EXTERNAL"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            },
            {
                "nicId": "1235",
                "nicName": "Nic-02",
                "networkId": "network-002",
                "networkName": "Inter_network_AZ02",
                "status": "normal",// processing, normal, abnormal, unkown, unused
                "networkType": "EXTERNAL"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            },
            {
                "nicId": "1236",
                "nicName": "Nic-03",
                "networkId": "network-003",
                "networkName": "Inter_network_AZ03",
                "status": "normal",// processing, normal, abnormal, unkown, unused
                "networkType": "EXTERNAL"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            },
            {
                "nicId": "1236",
                "nicName": "Nic-04",
                "networkId": "network-004",
                "networkName": "Inter_network_AZ04",
                "status": "normal",// processing, normal, abnormal, unkown, unused
                "networkType": "EXTERNAL"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            },
            {
                "nicId": "1236",
                "nicName": "Nic-010",
                "networkId": "network-005",
                "networkName": "Inter_network_AZ05",
                "status": "normal",// processing, normal, abnormal, unkown, unused
                "networkType": "EXTERNAL"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            },
            {
                "nicId": "1236",
                "nicName": "Nic-13",
                "networkId": "network-006",
                "networkName": "Inter_network_AZ05",
                "status": "normal",// processing, normal, abnormal, unkown, unused
                "networkType": "VSA_MANAGER_NETWORK"//EXTERNAL,ORG_EXTERNAL,ORG_INTERNAL,UNKNOWN,VSA_MANAGER_NETWORK,VSA_OPERATION_NETWORK,ROUTED_NETWORK
            }
        ]
    };

    var queryPVMFail = {
        "code": "1181002",
        "messsage": "vpc不存在"
    };

    fixture({
        //查询PVM
        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms": function (original, response) {
            if (!original.data.vdc_id || !original.data.vpcid || !original.data["cloud-infra"]) {
                //参数无效
                response(500, "fail", JSON.stringify(queryPVMFail), {});
                return;
            }
            response(200, "success", queryPVMSucc, {});
        },

        //创建PVM
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}": function (original, response) {
            if (!original.data.vdc_id) {
                //参数无效
                response(500, "fail", queryPVMFail, {});
                return;
            }
            response(200, "success", {"pvmId": "123"}, {});
        },

        //删除PVM
        "DELETE /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}": function (original, response) {
            if (!original.data.vdc_id || !original.data.vpcid || !original.data["cloud_infra_id"]) {
                //参数无效
                response(500, "fail", queryPVMFail, {});
                return;
            }
            response(200, "success", {}, {});
        },

        //操作VPC
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms/actions?cloud-infra={cloud_infra_id}": function (original, response) {
            if (!original.data.vdc_id || !original.data.vpcid || !original.data["cloud_infra_id"]) {
                //参数无效
                response(500, "fail", queryPVMFail, {});
                return;
            }
            queryPVMSucc.pvmState = "PROCESSING";

            setTimeout(function () {
                "use strict";
                queryPVMSucc.pvmState = "SUCCESS";
            }, 2000);

            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/pvms?cloud-infra={cloud_infra_id}": function (original, response) {
            var networks = JSON.parse(original.data);
            queryPVMSucc.networkInfos = _.reject(queryPVMSucc.networkInfos, function (item, index) {
                "use strict";
                return index === 0;
            });
            response(200, "success", {}, {});
        }
    });
    return fixture;
});