define(["can/util/fixture/fixture"], function (fixture) {
    var catalogs = [
        {
            id: "1",
            "name": "Electricity supplier services"
        },
        {
            id: "2",
            "name": "Office automation"
        },
        {
            id: "3",
            "name": "Database Services"
        },
        {
            id: "4",
            "name": "Server"
        }
    ];

    var catalogServices = {
        "total": 50,
        services: [
            {
                id: 1,
                name: "VDC Services",
                description: 'Provides virtual data center services in the " cloud" to isolate the separate secure network environment , flexible on-demand combination of virtualized IT and IDC resources ; fully meet the large-scale Internet applications with high scalability',
                image: "../theme/default/images/vdcCatalog.png",
                serviceHtml: "app/business/service/views/catalog/disk/applyDisk.html",
                servicePageWidth: "780px",
                servicePageHeight: "470px",
                clickName: "cancel"    //取消发布
            },
            {
                id: 2,
                name: "Virtual Machine Service",
                description: "Equivalent to the physical world, we often say that computer , in the scope of the cloud , the virtual machine is a good server configuration , it has your desired hardware configuration, operating system and network configuration" +
                    "You can usually get any number of virtual machines you want within 10 seconds to 60 seconds of time, this feature allows you to fully dynamic , on-demand computing capacity",
                image: "../theme/default/images/vmCatalog.png",
                serviceHtml: "app/business/service/views/catalog/disk/applyDisk.html",
                servicePageWidth: "780px",
                servicePageHeight: "470px",
                clickName: "release"   //发布、编辑、删除
            },
            {
                id: 3,
                name: "Block storage service",
                description: "Provide highly reliable and inexpensive storage service , the equivalent of a disk , can be mounted on a virtual machine to use . It supports snapshot backup and recovery, high reliability and also save you the cost of storage",
                image: "../theme/default/images/moneryCatalog.png",
                serviceHtml: "app/business/service/views/catalog/disk/applyDisk.html",
                servicePageWidth: "780px",
                servicePageHeight: "470px",
                clickName: "release"   //发布、编辑、删除
            }
        ]
    };

    var myApplys = [
        {
            "id": "2014011211",
            "applicantName": "user-UCD",
            "applicantId": "user-UCD",
            "type": "Apply",//Apply 申请资源、Extend：延期、Change：变更
            "status": "Succeed",//Waiting待审批，Processing:实施中，Succeed:实施成功，Failed:实施失败，Rejected:驳回，Closed:关闭
            "summitTime": "2014-01-12 10:12",
            "lastPrcessTime": "2014-01-12 10:12"
        },
        {
            "id": "2014011212",
            "applicantName": "user-UCD",
            "applicantId": "user-UCD",
            "type": "Extend",
            "status": "Waiting",
            "summitTime": "2014-01-12 10:14",
            "lastPrcessTime": "2014-01-12 10:14"
        },
        {
            "id": "2014011213",
            "applicantName": "user-UCD",
            "applicantId": "user-UCD",
            "type": "Change",
            "status": "Rejected",
            "summitTime": "2014-01-12 10:14",
            "lastPrcessTime": "2014-01-12 10:14"
        }
    ];

    var applyDetail = {
        name: "MaxHost-GOLD",
        type: "Cloud Hosting",
        "number": "10",
        "durationTime": "1 year",
        "execRecords": [
            {
                time: "2014-01-28 11:59:40",
                user: "admin",
                action: "Start the process!"
            },
            {
                time: "2014-01-28 11:59:55",
                user: "admin",
                action: "Processing chain:01.Fill in the application form"
            },
            {
                time: "2014-01-28 11:59:40",
                user: "user01",
                action: "Processing chain:02."
            }
        ]
    };

    var serviceDetail = {
        sla: "SLA",
        vpc: "VPC01",
        vmTemplate: "windows 7",
        config: "2CPU/2GB/40GB/GOLD",
        nics: [
            {
                name: "Nic01",
                network: {
                    name: "Network001",
                    type: "External Network",
                    ip: "192.168.201.123",
                    az: "ShenZhen01"
                }
            },
            {
                name: "Nic021",
                network: {
                    name: "Network001",
                    type: "External Network",
                    ip: "192.168.201.123",
                    az: "ShenZhen01"
                }
            }
        ],
        disks: [
            {
                name: "Disk01",
                capacity: "20"
            },
            {
                name: "Disk02",
                capacity: "40"
            }
        ],
        ha: "Start",
        type: "Cloud Hosting",
        image: "../theme/default/images/gm/bps.png",
        description: "This is Cloud Hosting"
    };

    var myApprovals = [
        {
            "id": "apply01",
            "serviceId": "serviceId01",
            "showDetail": "",
            "orderNo": "2014011211",
            "status": "Pending approval",
            "type": "New",
            "applyUser": "user-UCD",
            "applyTime": "2014-01-12 10:12",
            "lastExecTime": "2014-01-12 10:12",
            "opts": ""
        },
        {
            "id": "apply02",
            "serviceId": "serviceId02",
            "showDetail": "",
            "orderNo": "2014011211",
            "status": "Approved",
            "type": "Extension",
            "applyUser": "user-UCD",
            "applyTime": "2014-01-12 10:12",
            "lastExecTime": "2014-01-12 10:12",
            "opts": ""
        }
    ];

    var orders = {
        "2014082615471217956541": {
            "orderId": "2014082615471217956541",
            "type": "release",
            "userName": "like",
            "userId": "5",
            "vdcId": "2",
            "status": "succeed",
            "submitTime": "2014-08-26 15:47:12",
            "serviceOffingId": null,
            "orderName": "Approval VDC input",
            "serviceInstanceId": "0a6cc54c-2de0-40f4-a29d-7a9a45c2fa9f",
            "applyUrl": "ssp.applyInstanceExtend",
            "approveUrl": "ssp.approvalInstanceExtend",
            "tenancy": "2014-08-30 07:37:13",
            "comments": "",
            "orderAproverinfos": null,
            "params": "{\"serviceInstance\":{\"name\":\"Approval VDC input\",\"createTime\":\"2014-08-26 15:47:12\",\"expireTime\":\"2014-08-27 07:37:13\",\"vdcId\":\"2\",\"applyUserId\":\"5\",\"resources\":[{\"resourceId\":\"13\",\"resourceName\":\"null\",\"resourceType\":\"vdc\"}]}}",
            "definationParams": "{\"CPU\":{\"value\":null,\"lock\":\"2\"},\"MEMORY\":{\"value\":null,\"lock\":\"2\"},\"VM\":{\"value\":null,\"lock\":\"2\"},\"STORAGE\":{\"value\":null,\"lock\":\"2\"},\"SEG\":{\"value\":null,\"lock\":\"2\"},\"VPC\":{\"value\":null,\"lock\":\"2\"},\"EIP\":{\"value\":null,\"lock\":\"2\"},\"cloudInfra\":{\"lock\":\"2\",\"value\":null}}",
            "description": null,
            "history": [

                {
                    "id": "a4f107c4-fdf6-4cb4-8fe9-99eef5da785f",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:47:12",
                    "comments": "null",
                    "errorCode": null,
                    "action": "submit"
                },
                {
                    "id": "90c66b8f-0d6c-417a-a40e-3c61502afaf4",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:51:16",
                    "comments": "null",
                    "errorCode": null,
                    "action": "approved"
                },
                {
                    "id": "ec5158bd-a14c-4887-842f-ce42f24fac57",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "System",
                    "handleUserName": "System",
                    "time": "2014-08-26 15:51:17",
                    "comments": null,
                    "errorCode": null,
                    "action": "succeed"
                }
            ],
            "orderApprovers": null
        },
        "2014082615471217956542": {
            "orderId": "2014082615471217956542",
            "type": "extend",
            "userName": "like",
            "userId": "5",
            "vdcId": "2",
            "status": "succeed",
            "submitTime": "2014-08-26 15:47:12",
            "serviceOffingId": null,
            "orderName": "Approval VDC input",
            "serviceInstanceId": "0a6cc54c-2de0-40f4-a29d-7a9a45c2fa9f",
            "applyUrl": "ssp.applyInstanceExtend",
            "approveUrl": "ssp.approvalInstanceExtend",
            "tenancy": "2014-08-30 07:37:13",
            "comments": "null",
            "orderAproverinfos": null,
            "params": "{\"serviceInstance\":{\"name\":\"Approval VDC input\",\"createTime\":\"2014-08-26 15:47:12\",\"expireTime\":\"2014-08-27 07:37:13\",\"vdcId\":\"2\",\"applyUserId\":\"5\",\"resources\":[{\"resourceId\":\"13\",\"resourceName\":\"null\",\"resourceType\":\"vdc\"}]}}",
            "definationParams": "{\"CPU\":{\"value\":null,\"lock\":\"2\"},\"MEMORY\":{\"value\":null,\"lock\":\"2\"},\"VM\":{\"value\":null,\"lock\":\"2\"},\"STORAGE\":{\"value\":null,\"lock\":\"2\"},\"SEG\":{\"value\":null,\"lock\":\"2\"},\"VPC\":{\"value\":null,\"lock\":\"2\"},\"EIP\":{\"value\":null,\"lock\":\"2\"},\"cloudInfra\":{\"lock\":\"2\",\"value\":null}}",
            "description": null,
            "history": [

                {
                    "id": "a4f107c4-fdf6-4cb4-8fe9-99eef5da785f",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:47:12",
                    "comments": "null",
                    "errorCode": null,
                    "action": "submit"
                },
                {
                    "id": "90c66b8f-0d6c-417a-a40e-3c61502afaf4",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:51:16",
                    "comments": "null",
                    "errorCode": null,
                    "action": "approved"
                },
                {
                    "id": "ec5158bd-a14c-4887-842f-ce42f24fac57",
                    "orderId": "2014082615471217956542",
                    "handleUserId": "System",
                    "handleUserName": "System",
                    "time": "2014-08-26 15:51:17",
                    "comments": null,
                    "errorCode": null,
                    "action": "succeed"
                }
            ],
            "orderApprovers": null
        },
        "2014082615565474595386": {
            "orderId": "2014082615565474595386",
            "type": "modify",
            "userName": "like",
            "userId": "5",
            "vdcId": "2",
            "status": "succeed",
            "submitTime": "2014-08-26 15:56:54",
            "serviceOffingId": null,
            "orderName": "Approval VDC input",
            "serviceInstanceId": "9112185a-bd46-4073-a703-5eff6e3ac50a",
            "applyUrl": "ssp.changeVdc",
            "approveUrl": "ssp.approvalVdcChange",
            "tenancy": "2014-08-27 07:50:02",
            "comments": "null",
            "orderAproverinfos": null,
            "params": "{\"vdcId\":\"14\",\"allQuota\":false,\"quotaList\":[{\"name\":\"CPU\",\"limit\":\"223\",\"oldLimit\":\"234\"},{\"name\":\"MEMORY\",\"limit\":\"2\",\"oldLimit\":\"3\"},{\"name\":\"STORAGE\",\"limit\":\"2\",\"oldLimit\":\"4\"},{\"name\":\"VPC\",\"limit\":\"2\",\"oldLimit\":\"4\"},{\"name\":\"EIP\",\"limit\":\"2\",\"oldLimit\":\"3\"},{\"name\":\"SEG\",\"limit\":\"2\",\"oldLimit\":\"3\"},{\"name\":\"VM\",\"limit\":\"23\",\"oldLimit\":\"24\"}]}",
            "definationParams": "{\"CPU\":{\"value\":null,\"lock\":\"2\"},\"MEMORY\":{\"value\":null,\"lock\":\"2\"},\"VM\":{\"value\":null,\"lock\":\"2\"},\"STORAGE\":{\"value\":null,\"lock\":\"2\"},\"SEG\":{\"value\":null,\"lock\":\"2\"},\"VPC\":{\"value\":null,\"lock\":\"2\"},\"EIP\":{\"value\":null,\"lock\":\"2\"},\"cloudInfra\":{\"lock\":\"2\",\"value\":null}}",
            "description": null,
            "history": [
                {
                    "id": "25f625e9-a217-411a-8163-33ada568940f",
                    "orderId": "2014082615565474595386",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:56:54",
                    "comments": "null",
                    "errorCode": null,
                    "action": "submit"
                },
                {
                    "id": "869d4db2-bbcf-47e8-ba57-fca083151aba",
                    "orderId": "2014082615565474595386",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:58:00",
                    "comments": "null",
                    "errorCode": null,
                    "action": "approved"
                },
                {
                    "id": "29ae6968-a59b-47d8-a461-99e9cb0979e7",
                    "orderId": "2014082615565474595386",
                    "handleUserId": "System",
                    "handleUserName": "System",
                    "time": "2014-08-26 15:58:00",
                    "comments": null,
                    "errorCode": null,
                    "action": "succeed"
                }
            ],
            "orderApprovers": null
        },
        "2014082615553956108768": {
            "orderId": "2014082615553956108768",
            "type": "apply",
            "userName": "like",
            "userId": "5",
            "vdcId": "2",
            "status": "succeed",
            "submitTime": "2014-08-26 15:55:39",
            "serviceOffingId": "66e6c922-e772-450b-aa8b-3ded72dcfb27",
            "orderName": "Approval VDC input",
            "serviceInstanceId": "9112185a-bd46-4073-a703-5eff6e3ac50a",
            "applyUrl": "ssp.applyVdc",
            "approveUrl": "ssp.approvalVdcApply",
            "tenancy": "2014-08-27 07:50:02",
            "comments": "null",
            "orderAproverinfos": null,
            "params": "{\"name\":\"null\",\"allQuota\":false,\"area\":[\"37\"],\"quotaList\":[{\"name\":\"CPU\",\"limit\":2},{\"name\":\"MEMORY\",\"limit\":2},{\"name\":\"STORAGE\",\"limit\":2},{\"name\":\"VPC\",\"limit\":2},{\"name\":\"EIP\",\"limit\":2},{\"name\":\"SEG\",\"limit\":2},{\"name\":\"VM\",\"limit\":23}],\"azBaseInfos\":[{\"azId\":\"4616189618054758405\",\"cloudInfraId\":\"37\"}]}",
            "definationParams": "{\"CPU\":{\"value\":null,\"lock\":\"2\"},\"MEMORY\":{\"value\":null,\"lock\":\"2\"},\"VM\":{\"value\":null,\"lock\":\"2\"},\"STORAGE\":{\"value\":null,\"lock\":\"2\"},\"SEG\":{\"value\":null,\"lock\":\"2\"},\"VPC\":{\"value\":null,\"lock\":\"2\"},\"EIP\":{\"value\":null,\"lock\":\"2\"},\"cloudInfra\":{\"lock\":\"2\",\"value\":null}}",
            "description": null,
            "history": [
                {
                    "id": "7e2c9d13-1991-4e2b-aee8-78f946605133",
                    "orderId": "2014082615553956108768",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:55:39",
                    "comments": "null",
                    "errorCode": null,
                    "action": "submit"
                },
                {
                    "id": "18c4da13-08f8-4532-a22b-f0f99c5dd933",
                    "orderId": "2014082615553956108768",
                    "handleUserId": "5",
                    "handleUserName": "like",
                    "time": "2014-08-26 15:56:15",
                    "comments": "null",
                    "errorCode": null,
                    "action": "approved"
                },
                {
                    "id": "d1f3c320-7f6c-4a8d-95dc-d77e75917f95",
                    "orderId": "2014082615553956108768",
                    "handleUserId": "System",
                    "handleUserName": "System",
                    "time": "2014-08-26 15:56:16",
                    "comments": null,
                    "errorCode": null,
                    "action": "succeed"
                }
            ],
            "orderApprovers": null
        }
    };

    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/service-mgnt/catalogs": function (original, response) {
            var ret = {
                code: "0",
                message: "",
                total: 4,
                "catalogs": catalogs
            };

            response(200, "success", ret, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/catalogs": function (original, response) {
            var ret = {
                total: 4,
                catalogs: catalogs
            };

            response(200, "success", ret, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-mgnt/services": function (original, response) {
            var catalogId = original.data.catalogId;
            var name = original.data.name;
            var limit = parseInt(original.data.limit, 10);
            var start = parseInt(original.data.start, 10);
            var ret = {
                code: "0",
                message: "",
                total: 50,
                services: []
            };

            if (name && name.trim()) {
                _.each(catalogServices.services, function (item, index) {
                    if (item.name.indexOf(name) >= 0) {
                        ret.services.push(item);
                    }
                });
                ret.total = ret.services.length;
            } else {
                for (var i = 0; i < catalogServices.services.length; i++) {
                    var service = {
                        id: i,
                        name: catalogServices.services[i].name,
                        description: catalogServices.services[i].description,
                        image: catalogServices.services[i].image,
                        serviceHtml: "",
                        servicePageWidth: "780px",
                        servicePageHeight: "470px",
                        clickName: catalogServices.services[i].clickName
                    };
                    ret.services.push(service);
                }
            }
            response(200, "success", ret, {});
        },


        "GET /goku/rest/v1.5/{vdc_id}/services": function (original, response) {
            var res = {
                "total": 7,
                "services": [
                    {"id": "default-service-offering-vdc", "name": "Virtual Data Center", "description": "Provides the physical data center virtualization equivalent experience exclusive resource pool , you can quickly buffet complete virtual data center applications , and can be flexibly adjusted according to the actual needs of the online virtual data center specifications ; within the virtual data center , you can compute, storage and unified management of network resources , like a real data center management as the management of these resources.", "status": "published", "serviceImageUrl": "../theme/default/images/gm/vdcService.jpg", "modifyUrl": "ssp.templateVdc", "applyUrl": "ssp.applyVdc", "approveType": "domain", "vdcId": "1"},
                    {"id": "default-service-offering-volume", "name": "Cloud HDD", "description": "Cloud hard drive provides a persistent, highly available service block storage device , you can quickly apply a buffet complete cloud hard drive , and can be flexibly adjusted according to the actual needs of online cloud hard drive specifications, storage SLA. Cloud instances can be mounted on the hard disk is running in the cloud host instance , on the combination of cloud host uses to make your data more secure, more flexible", "status": "published", "serviceImageUrl": "../theme/default/images/gm/diskService.jpg", "modifyUrl": "ssp.templateVolume", "applyUrl": "ssp.applyDisk", "approveType": "vdc", "vdcId": "1"},
                    {"id": "default-service-offering-vm", "name": "Cloud Hosting", "description": "Provide reliable , that the application of cloud hosting services that use, you can quickly buffet complete cloud host application , and can be flexibly adjusted according to the actual needs of online cloud host specification , specify the type of operating system and cloud host's network", "status": "unpublished", "serviceImageUrl": "../theme/default/images/gm/vmService.jpg", "modifyUrl": "ssp.templateVm", "applyUrl": "ssp.applyVm", "approveType": "vdc", "vdcId": "1"},
                    {"id": "d18c6911-e887-4f66-8ad2-79f9c34154c9", "name": "myvolume", "description": null, "status": "unpublished", "serviceImageUrl": "../theme/default/images/gm/diskService.jpg", "modifyUrl": "ssp.templateVolume", "applyUrl": "ssp.applyDisk", "approveType": "vdc", "vdcId": "1"},
                    {"id": "aa27ce22-af50-4b38-8b53-a832a389d9af", "name": "vdc", "description": "vdc", "status": "unpublished", "serviceImageUrl": "../theme/default/images/gm/vdcService.jpg", "modifyUrl": "ssp.templateVdc", "applyUrl": "ssp.applyVdc", "approveType": "domain", "vdcId": "1"},
                    {"id": "tanhui", "name": "1121212", "description": "Computer equivalent of the physical world , we often say , in the areas of cloud , the virtual machine is a good server configuration , it has your desired hardware configuration, operating system and network configuration. You can get any number within generally 0 seconds to 60 seconds of time you want the virtual machine , this trait allows you to fully dynamic use of computing power needed", "status": "published", "serviceImageUrl": "../theme/default/images/gm/diskService.jpg", "modifyUrl": "ssp.templateVolume", "applyUrl": "ssp.applyDisk", "approveType": "vdc", "vdcId": "1"},
                    {"id": "e3fd3053-1564-4d8e-abb6-5b1e0662cda2", "name": "555", "description": null, "status": "unpublished", "serviceImageUrl": "../theme/default/images/gm/vdcService.jpg", "modifyUrl": "ssp.templateVdc", "applyUrl": "ssp.applyVdc", "approveType": "domain", "vdcId": "1"}
                ]
            };
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/services/{id}": function (original, response) {
            var res = {
                "id": "default-service-offering-vm",
                "name": "Cloud Hosting",
                "description": "Provide reliable , that the application of cloud hosting services that use, you can quickly buffet complete cloud host application , and can be flexibly adjusted according to the actual needs of online cloud host specification , specify the type of operating system and cloud host's network",
                "status": "unpublished",
                "approveType": "vdc",
                "serviceTemplateId": "default-apply-vm",
                "serviceImageUrl": "/goku/rest/v1.5/1/servicesImg/default-service-offering-vm",
                "vdcId": "1",
                "params": "{\"cloudInfra\": {\"value\": [\"3\",\"5\"], \"lock\": \"0\"}, \"vmTemplate\": {\"id\": \"\", \"availableZoneId\": \"\",\"lock\": \"1\"}, \"vmSpec\": {\"flavor\": { \"id\": \"\", \"lock\": \"1\"},\"spec\": {\"cpu\": {\"value\": \"1\",\"lock\": \"1\"}, \"memory\": {\"value\": \"1024\",\"lock\": \"1\"}, \"disk\": [{\"name\": \"disk01\", \"size\": \"20\", \"lock\": \"1\"}]}}, \"vmNetwork\": {\"nics\": [{\"networkId\": \"\",\"vpcId\": \"\",\"lock\": \"1\"}]}}",
                "catalogs": [],
                "whiteListFlag": false,
                "vdcWhiteList": null
            };
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/orders": function (original, response) {
            var data = original.data;
            var limit = parseInt(data.limit, 10) || 10;
            var total = 23;
            var start = parseInt(data.start, 10) || 0;
            var end = start + limit > total ? total : start + limit;
            var orders = [];
            var status = ["handling", "initialize", "approving", "processing", "succeed", "failed", "rejected", "canceled"];
            var type = ["release", "extend", "modify", "apply"];
            var ids = ["2014082615471217956541", "2014082615471217956542", "2014082615565474595386", "2014082615553956108768"];

            for (; start < end; start++) {
                var order = {
                    "orderId": ids[start % ids.length],
                    "type": data.type || type[start % type.length],
                    "userName": "User",
                    "userId": "123456",
                    "orderName": "VDC Service",
                    "vdcId": "vdc_id0",
                    "status": data.status || status[start % status.length],
                    "serviceOffingId": 1,
                    "submitTime": "2014-01-12 10:12:12",
                    "lastHandleTime": "2014-01-12 10:12:12",
                    "serviceInstanceId": "service_instance_id",
                    "approveUrl": "ssp.approvalVdcApply",
                    "applyUrl": "ssp.applyVdc"
                };
                orders.push(order);
            }

            response(200, "success", {total: total, orders: orders}, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/orders/{order_id}": function (original, response) {
            var id = original.data.order_id;
            var rtn = orders[id];
            response(200, "success", rtn, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-mgnt/ordersearch": function (original, response) {
            var id = original.data.id;
            var start = parseInt(original.data.start, 10);
            var limit = parseInt(original.data.limit, 10);

            var ret = {
                code: "0",
                message: "",
                total: 0,
                orders: []
            };

            if (id && id.trim() != "") {
                _.each(myApplys, function (item) {
                    if (item.id.indexOf(id) >= 0) {
                        ret.orders.push(item);
                    }
                });
                ret.total = ret.orders.length;
            } else {
                for (var i = start; i < start + limit; i++) {
                    var order = {
                        "id": "2014011211-" + i,
                        "applicantName": "user-UCD",
                        "applicantId": "user-UCD",
                        "type": "Apply",
                        "status": "Waiting",//Waiting待审批，Processing:实施中，Succeed:实施成功，Failed:实施失败，Rejected:驳回，Closed:关闭
                        "summitTime": "2014-01-12 10:12",
                        "lastPrcessTime": "2014-01-12 10:12"
                    };
                    ret.orders.push(order);
                }
                ret.total = 50;
            }

            response(200, "success", ret, {})
        },

        "GET /uportal/service/apply/query/detail": function (original, response) {
            response(200, "success", applyDetail, {})
        },

        "GET /uportal/service/service/query/detail": function (original, response) {
            response(200, "success", serviceDetail, {})
        },

        "GET /uportal/service/order/approvals": function (original, response) {
            response(200, "success", myApprovals, {})
        },

        "POST /uportal/service/catalog/applyEcs": function (original, response) {
            response(200, "success", {}, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/vms": function (original, response) {
            var limit = parseInt(original.data.limit, 10);
            var start = parseInt(original.data.start, 10);
            var vms = [];

            for (var i = start; i < start + limit; i++) {
                var vm = {
                    id: "VM-" + i,
                    name: "Virtual Machine-" + i,
                    status: "Running",
                    config: "512MB Memeory| 1 Virtual cores | 1.0GB Hard Disk",
                    location: "ShenZhen"
                };
                vms.push(vm);
            }

            var ret = {
                "total": 50,
                "vms": vms
            };
            response(200, "success", ret, {})
        },

        "POST /uportal/service/catalog/applyDisk": function (original, response) {
            response(200, "success", {}, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-templates": function (original, response) {
            var ret = {
                "total": 10,
                "templates": [
                    {"id": "default-apply-vdc", "name": "VDC", "type": "apply", "view_type": "system",
                        "description": "Apply VDC Service\nTemplate", "templateUrl": "ssp.templateVdc",
                        "modifyUrl": "ssp.templateVdc", "applyUrl": "ssp.applyVdc",
                        "approvalUrl": "ssp.approvalVdcApply", "imageUrl": "theme/default/images/gm/vdcService.jpg",
                        "approveType": {"noApprove": true, "vdcApprove": false, "domainApprove": false, "vdcDomainApprove": false}},
                    {"id": "default-apply-vm", "name": "VM", "type": "apply", "view_type": "system",
                        "description": "Apply VM Service Template", "templateUrl": "ssp.templateVm",
                        "modifyUrl": "ssp.templateVm", "applyUrl": "ssp.applyVm", "approvalUrl": "ssp.approvalVmApply", "imageUrl": "theme/default/images/gm/vmService.jpg",
                        "approveType": {"noApprove": true, "vdcApprove": true, "domainApprove": false, "vdcDomainApprove": false}},
                    {"id": "default-apply-volume", "name": "volume", "type": "apply", "view_type": "system",
                        "description": "Apply Volume Service Template", "templateUrl": "ssp.templateVolume",
                        "modifyUrl": "ssp.templateVolume", "applyUrl": "ssp.applyDisk", "approvalUrl": "ssp.approvalDiskApply", "imageUrl": "theme/default/images/gm/diskService.jpg",
                        "approveType": {"noApprove": true, "vdcApprove": false, "domainApprove": false, "vdcDomainApprove": false}}
                ]
            };
            response(200, "success", ret, {});
        },



        "GET /goku/rest/v1.5/{vdc_id}/vpcs": function (original, response) {
            var ret = {
                total: 2,
                vpcs: [
                    {
                        vpcID: "123",
                        availableZone: [],
                        tenantID: "123",
                        name: "vpc1",
                        description: "",
                        vpcSpecTemplate: {},
                        shared: true
                    },
                    {
                        vpcID: "23",
                        availableZone: [],
                        tenantID: "123",
                        name: "vpc2",
                        description: "",

                        vpcSpecTemplate: {},
                        shared: true
                    }
                ]
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/vdcs": function (original, response) {
            var ret = {
                "total":3,
                "vdcList": [
                    {"id": "0290015001", "name": "vdc5001xian", "createTime": "2014-08-30 19:24:18 UTC+08:00", "defaultVdc": true, "description": "The first one VDC is created in Xi'an", "allQuota": true, "quotaInfo": null, "quotaUsage": null},
                    {"id": "0290015002", "name": "vdc5002xian", "createTime": "2014-09-10 09:23:55 UTC+08:00", "defaultVdc": false, "description": "The first two VDC is created in Xi'an", "allQuota": true, "quotaInfo": null, "quotaUsage": null},
                    {"id": "0290015003", "name": "vdc5003xian", "createTime": "2014-09-25 15:23:55 UTC+08:00", "defaultVdc": false, "description": "The first three VDC is created in Xi'an", "allQuota": true, "quotaInfo": null, "quotaUsage": null}
                ]
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/vpcs/{vpcid}/networks": function (original, response) {
            var ret = {
                "total": 2,
                "networks": [
                    {
                        networkID: "networkID",
                        azID: "azID",
                        tenantID: "networkID",
                        userID: "userID",
                        name: "name",
                        description: "description",
                        networkType: 2,//1:直连网络; 2:内部网络; 3:路由网络
                        vlan: "vlan",
                        totalBoundNics: "totalBoundNics",
                        ipv4Subnet: "",
                        ipv6Subnet: "",
                        routed: false,
                        status: 0,//IT 状态： 0-就绪 1-删除中 2-创建中 3-失败 4-修改中 5-修改失败 ICT状态: 0-就绪 2- 3-失败 6 DOWN
                        portSetting: {}
                    },
                    {
                        networkID: "networkID",
                        azID: "azID",
                        tenantID: "networkID",
                        userID: "userID",
                        name: "name",
                        description: "description",
                        networkType: 2,//1:直连网络; 2:内部网络; 3:路由网络
                        vlan: "vlan",
                        totalBoundNics: "totalBoundNics",
                        ipv4Subnet: "",
                        ipv6Subnet: "",
                        routed: false,
                        status: 0,//IT 状态： 0-就绪 1-删除中 2-创建中 3-失败 4-修改中 5-修改失败 ICT状态: 0-就绪 2- 3-失败 6 DOWN
                        portSetting: {}
                    }
                ]
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{tenant_id}/vmtemplates": function (original, response) {
            var ret = {
                "totalNum": 1,
                "vmtemplates": [
                    {
                        vmtId: "vmtId",
                        vmtName: "vmtName",
                        osType: "osType",
                        osVersion: "osVersion",
                        description: "description",
                        status: "status",
                        lostStatus: "lostStatus",
                        createTime: "createTime",
                        userName: "userName",
                        clusterName: "clusterName",
                        resourceId: "resourceId",
                        type: "type",
                        virtualEnvId: "virtualEnvId",
                        clusterId: "clusterId",
                        availableZoneId: "availableZoneId",
                        availableZoneName: "availableZoneName",
                        errorCode: "errorCode",
                        vmLogicTemplateId: "vmLogicTemplateId",
                        failReason: "failReason",
                        virtualizedEnvironment: "virtualizedEnvironment",
                        orgId: "orgId",
                        vmtViewId: "vmtViewId",
                        userId: "userId",
                        picture: ""
                    }
                ]
            };
            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/service-icons": function (original, response) {
            var ret = {
                "serviceiconlist": [
                    {
                        id: "adf-asdf-as3qq",
                        vdcId: "1237",
                        imageUrl: "../theme/default/images/gm/bps.png",
                        type: "user"
                    },
                    {
                        id: "adf-asdf-as3",
                        vdcId: "1231",
                        imageUrl: "../theme/default/images/gm/appService.jpg",
                        type: "user"
                    },
                    {
                        id: "adf-asdf-as3",
                        vdcId: "1237",
                        imageUrl: "../theme/default/images/gm/bps.png",
                        type: "user"
                    },
                    {
                        id: "adf-asdf-as3",
                        vdcId: "1233",
                        imageUrl: "../theme/default/images/gm/cloudImg3.png",
                        type: "default"
                    },
                    {
                        id: "adf-asdf-as",
                        vdcId: "123",
                        imageUrl: "../theme/default/images/gm/cloudImg.png",
                        type: "default"
                    },
                    {
                        id: "adf-asdf-as2",
                        vdcId: "1232",
                        imageUrl: "../theme/default/images/gm/cloudImg2.png",
                        type: "default"
                    },
                    {
                        id: "adf-asdf-as5",
                        vdcId: "1235",
                        imageUrl: "../theme/default/images/gm/cloudImg5.png",
                        type: "default"
                    },
                    {
                        id: "adf-asdf-as4",
                        vdcId: "1234",
                        imageUrl: "../theme/default/images/gm/cloudImg4.png",
                        type: "default"
                    }
                ]
            };
            response(200, "success", ret, {});
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/service-icon/{icon_id}": function (original, response) {
            response(200, "success", {}, {});
        }

    });

    return fixture;
});