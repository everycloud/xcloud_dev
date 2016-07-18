define(["can/util/fixture/fixture"], function (fixture) {

    var diskData = {
        "list": {
            "volumes": [
                {
                    "volumnId":"volumnId01",
                    "azId":"4616189618054758401",
                    "capacityGB":"2048",
                    "usedGB":"999",
                    "dataStoreName":"datastoreName001",
                    "type":"1",
                    "name": "disk01",
                    "status": "1",
                    "volumnId": "vol001",
                    "volVmInfos": [
                        {
                            "vmID": "vm001",
                            "vmName": "Virtual Machine 001",
                            "vmStatus": "running",
                            "clusterName": "Clusters 1"
                        }
                    ]
                }
            ]
        }
    };
    //磁盘介质类型 取值为：SAN-SSD, SAN-SAS&FC,SAN-SATA,SAN-Any。默认为SAN-Any 该变量用来操作数据库反射使用
    var targetDataStore = {
        "total": 1,
        "datastoreInfos": [
            {
                "id": "datastore01",
                "name": "Storage 1",
                "type": "LOCALPOME",//存储类型
                "status": "NORMAL",
                "mediaType":"SAN-SSD",//介质类型
                "storageunitname":"storageunitname111",
                "capacity":
                    {
                        "totalCapacityGB": "1024",//GB
                        "freeCapacityGB":"666"//实际可用容量
                    }
            }
        ]
    };
    fixture({

        //查询可迁移的磁盘
        "POST /goku/rest/v1.5/irm/1/volumes/action": function (request, response) {
            response(200, "success", diskData, {})
        },
        "POST /goku/rest/v1.5/irm/1/datastores": function (request, response) {
            response(200, "success", targetDataStore, {})
        }
    });

    return fixture;
});