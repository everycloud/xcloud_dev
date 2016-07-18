define(["can/util/fixture/fixture"], function (fixture) {
    var reportList = [{
        "showDetail":"",
        "name":"VM Reports 001",
        "countPeriod":"OneWeek",
        "status":"Finished",
        "generatedTime":"2014-02-18 15:30:22",
        "opts":""
    },{
        "showDetail":"",
        "name":"VM Reports 002",
        "countPeriod":"OneWeek",
        "status":"Finished",
        "generatedTime":"2014-02-18 15:30:22",
        "opts":""
    }];

    var collectList = [{
        "showDetail":"",
        "collectObj":"VM Reports 001",
        "collectIndex":"CPU",
        "status":"Normal",
        "collectPeriod":"15min",
        "dataLine":"",
        "createUser":"admin",
        "opts":""
    },{
        "showDetail":"",
        "collectObj":"VM Reports002",
        "collectIndex":"CPU",
        "status":"Normal",
        "collectPeriod":"15min",
        "dataLine":"",
        "createUser":"admin",
        "opts":""
    }];

    var topnClusterData = {
        "monitorTopnMap": {
            "cpu_usage": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 40
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 33
                }
            ],
            "cpu_reserve": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_reserve",
                    "indexValue": 70
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_reserve",
                    "indexValue": 80
                }
            ],
            "mem_usage": [
                {
                    "objectId": "vm033",
                    "objectName": "cluster-077",
                    "monitorIndex": "mem_usage",
                    "indexValue": 71
                },
                {
                    "objectId": "vm032",
                    "objectName": "cluster-088",
                    "monitorIndex": "mem_usage",
                    "indexValue": 81
                }
            ],
            "mem_reserve": [
                {
                    "objectId": "vm044",
                    "objectName": "cluster-988",
                    "monitorIndex": "mem_reserve",
                    "indexValue": 13
                },
                {
                    "objectId": "vm045",
                    "objectName": "cluster-123",
                    "monitorIndex": "mem_reserve",
                    "indexValue": 12
                }
            ],
            "storage_allocation": [
                {
                    "objectId": "vm033",
                    "objectName": "cluster123",
                    "monitorIndex": "storage_allocation",
                    "indexValue": 70
                },
                {
                    "objectId": "vm032",
                    "objectName": "cluster222",
                    "monitorIndex": "storage_allocation",
                    "indexValue": 80
                }
            ],
            "storage_usage": [
                {
                    "objectId": "vm044",
                    "objectName": "cluster444",
                    "monitorIndex": "storage_usage",
                    "indexValue": 45
                },
                {
                    "objectId": "vm045",
                    "objectName": "cluster555",
                    "monitorIndex": "storage_usage",
                    "indexValue": 56
                }
            ]

        }};

    var topnHostvmData = {
        "monitorTopnMap": {
            "cpu_usage": [
                {
                    "objectId": "vm001",
                    "resourceName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "resourceName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ],
            "mem_usage": [
                {
                    "objectId": "vm001",
                    "resourceName": "cluster-002",
                    "monitorIndex": "cpu_reserve",
                    "indexValue": 70
                },
                {
                    "objectId": "vm002",
                    "resourceName": "cluster-001",
                    "monitorIndex": "cpu_reserve",
                    "indexValue": 80
                }
            ],
            "nic_byte_in": [
                {
                    "objectId": "vm033",
                    "resourceName": "cluster-077",
                    "monitorIndex": "nic_byte_in",
                    "indexValue": 0.7
                },
                {
                    "objectId": "vm032",
                    "resourceName": "cluster-088",
                    "monitorIndex": "nic_byte_in",
                    "indexValue": 0.8
                }
            ],
            "nic_byte_out": [
                {
                    "objectId": "vm044",
                    "resourceName": "cluster-988",
                    "monitorIndex": "nic_byte_out",
                    "indexValue": 0.2
                },
                {
                    "objectId": "vm045",
                    "resourceName": "cluster-123",
                    "monitorIndex": "nic_byte_out",
                    "indexValue": 0.6
                }
            ],
            "disk_io_in": [
                {
                    "objectId": "vm033",
                    "resourceName": "cluster123",
                    "monitorIndex": "disk_io_in",
                    "indexValue": 0.7
                },
                {
                    "objectId": "vm032",
                    "resourceName": "cluster222",
                    "monitorIndex": "disk_io_in",
                    "indexValue": 0.8
                }
            ],
            "disk_io_out": [
                {
                    "objectId": "vm044",
                    "resourceName": "cluster444",
                    "monitorIndex": "disk_io_out",
                    "indexValue": 0.4
                },
                {
                    "objectId": "vm045",
                    "resourceName": "cluster555",
                    "monitorIndex": "disk_io_out",
                    "indexValue": 0.7
                }
            ],
            "disk_usage": [
                {
                    "objectId": "vm044",
                    "resourceName": "cluster444",
                    "monitorIndex": "disk_usage",
                    "indexValue": 45
                },
                {
                    "objectId": "vm045",
                    "resourceName": "cluster555",
                    "monitorIndex": "disk_usage",
                    "indexValue": 56
                }
            ]

        }};


    var historyCluserData ={
        "objectId" : "0",
        "hostoryMonitorMap":{
            "cpu_usage":[
                {
                    "time":1392084150102,
                    "value":"10"
                },
                {
                    "time":1392170569000,
                    "value":"20"
                },
                {
                    "time":1392256992746,
                    "value":"60"
                }
            ],
            "mem_usage" :[
                {
                    "time":1392084150102,
                    "value":"20"
                },
                {
                    "time":1392170569000,
                    "value":"40"
                },
                {
                    "time":1392256992746,
                    "value":"88"
                }
            ]
            ,
            "disk_usage" :[
                {
                    "time":1392084150102,
                    "value":"80"
                },
                {
                    "time":1392170569000,
                    "value":"40"
                },
                {
                    "time":1392256992746,
                    "value":"90"
                }
            ]
            ,
            "disk_io_in" :[
                {
                    "time":1392084150102,
                    "value":"2.9"
                },
                {
                    "time":1392170569000,
                    "value":"2.0"
                },
                {
                    "time":1392256992746,
                    "value":"6.5"
                }
            ],
            "disk_io_out" :[
                {
                    "time":1392084150102,
                    "value":"4.9"
                },
                {
                    "time":1392170569000,
                    "value":"3.0"
                },
                {
                    "time":1392256992746,
                    "value":"9.5"
                }
            ]
            ,
            "nic_byte_in" :[
                {
                    "time":1392084150102,
                    "value":"2.9"
                },
                {
                    "time":1392170569000,
                    "value":"2.0"
                },
                {
                    "time":1392256992746,
                    "value":"6.5"
                }
            ],
            "nic_byte_out" :[
                {
                    "time":1392084150102,
                    "value":"4.9"
                },
                {
                    "time":1392170569000,
                    "value":"3.0"
                },
                {
                    "time":1392256992746,
                    "value":"9.5"
                }
            ]
            ,
            "cpu_ready_time" :[
                {
                    "time":1392084150102,
                    "value":"10"
                },
                {
                    "time":1392170569000,
                    "value":"20"
                },
                {
                    "time":1392256992746,
                    "value":"249"
                }
            ],
            "disk_in_ps" :[
                {
                    "time":1392084150102,
                    "value":"200"
                },
                {
                    "time":1392170569000,
                    "value":"2642"
                },
                {
                    "time":1392256992746,
                    "value":"521"
                }
            ],
            "disk_out_ps" :[
                {
                    "time":1392084150102,
                    "value":"3542"
                },
                {
                    "time":1392170569000,
                    "value":"21312"
                },
                {
                    "time":1392256992746,
                    "value":"234"
                }
            ]  ,
            "disk_read_delay" :[
                {
                    "time":1392084150102,
                    "value":"23"
                },
                {
                    "time":1392170569000,
                    "value":"101"
                },
                {
                    "time":1392256992746,
                    "value":"300"
                }
            ] ,
            "disk_write_delay" :[
                {
                    "time":1392084150102,
                    "value":"502"
                },
                {
                    "time":1392170569000,
                    "value":"305"
                },
                {
                    "time":1392256992746,
                    "value":"9254"
                }
            ]

            ,
            "storage_read_ps" :[
                {
                    "time":1392084150102,
                    "value":"50"
                },
                {
                    "time":1392170569000,
                    "value":"648"
                },
                {
                    "time":1392256992746,
                    "value":"2024"
                }
            ]
            ,
            "storage_write_ps" :[
                {
                    "time":1392084150102,
                    "value":"2048"
                },
                {
                    "time":1392170569000,
                    "value":"305"
                },
                {
                    "time":1392256992746,
                    "value":"1024"
                }
            ]
            ,
            "await_time" :[
                {
                    "time":1392084150102,
                    "value":"250"
                },
                {
                    "time":1392170569000,
                    "value":"455"
                },
                {
                    "time":1392256992746,
                    "value":"1048"
                }
            ]
            ,
            "svctm_time" :[
                {
                    "time":1392084150102,
                    "value":"1502"
                },
                {
                    "time":1392170569000,
                    "value":"1000"
                },
                {
                    "time":1392256992746,
                    "value":"1254"
                }
            ]

        }
    };
// TOP CPU占用主机(top_cpu_usage)、TOP 内存占用主机(top_mem_usage)、TOP 网络流入流速主机(top_nic_byte_in)、 TOP 网络流出流速主机(top_nic_byte_out)、TOP 存储占用主机(top_storage)、
    var historyCluserTOPData ={
        "monitorTopnMap": {
            "top_cpu_usage": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ],
            "top_mem_usage": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ],
            "top_nic_byte_in": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ],
            "top_nic_byte_out": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ],
            "top_storage": [
                {
                    "objectId": "vm001",
                    "objectName": "cluster-001",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 30
                },
                {
                    "objectId": "vm002",
                    "objectName": "cluster-002",
                    "monitorIndex": "cpu_usage",
                    "indexValue": 20
                }
            ]
        }
    };

    var datastoreTopHostData = {
    "topnDataStoreMap":
    {
        "storage_write_ps" :[
                {
                    "objectId":"",
                    "objectName":"host1",
                    "hostoryMonitorMap":{
                        "storage_write_ps":[
                            {
                                "time":1392084150102,
                                "value":"2048"
                            },
                            {
                                "time":1392170569000,
                                "value":"305"
                            },
                            {
                                "time":1392256992746,
                                "value":"1024"
                            }
                        ]
                    }
                },
            {
                "objectId":"",
                "objectName":"host02",
                "hostoryMonitorMap":{
                    "storage_write_ps":[
                        {
                            "time":1392084150102,
                            "value":"1048"
                        },
                        {
                            "time":1392170569000,
                            "value":"405"
                        },
                        {
                            "time":1392256992746,
                            "value":"824"
                        }
                    ]
                }
            },
            {
                "objectId":"",
                "objectName":"host33",
                "hostoryMonitorMap":{
                    "storage_write_ps":[
                        {
                            "time":1392084150102,
                            "value":"248"
                        },
                        {
                            "time":1392170569000,
                            "value":"605"
                        },
                        {
                            "time":1392256992746,
                            "value":"304"
                        }
                    ]
                }
            },
            {
                "objectId":"",
                "objectName":"host444",
                "hostoryMonitorMap":{
                    "storage_write_ps":[
                        {
                            "time":1392084150102,
                            "value":"148"
                        },
                        {
                            "time":1392170569000,
                            "value":"705"
                        },
                        {
                            "time":1392256992746,
                            "value":"24"
                        }
                    ]
                }
            }
        ],
        "storage_read_ps" :[
            {
                "objectId":"",
                "objectName":"host1123",
                "hostoryMonitorMap":{
                    "storage_read_ps":[
                        {
                            "time":1392084150102,
                            "value":"48"
                        },
                        {
                            "time":1392170569000,
                            "value":"305"
                        },
                        {
                            "time":1392256992746,
                            "value":"124"
                        }
                    ]
                }
            },
            {
                "objectId":"",
                "objectName":"00123",
                "hostoryMonitorMap":{
                    "storage_read_ps":[
                        {
                            "time":1392084150102,
                            "value":"1048"
                        },
                        {
                            "time":1392170569000,
                            "value":"45"
                        },
                        {
                            "time":1392256992746,
                            "value":"324"
                        }
                    ]
                }
            }
        ]
        ,
        "await_time" :[
            {
                "objectId":"",
                "objectName":"host1123",
                "hostoryMonitorMap":{
                    "await_time":[
                        {
                            "time":1392084150102,
                            "value":"250"
                        },
                        {
                            "time":1392170569000,
                            "value":"23"
                        },
                        {
                            "time":1392256992746,
                            "value":"324"
                        }
                    ]
                }
            },
            {
                "objectId":"",
                "objectName":"00123",
                "hostoryMonitorMap":{
                    "await_time":[
                        {
                            "time":1392084150102,
                            "value":"1048"
                        },
                        {
                            "time":1392170569000,
                            "value":"250"
                        },
                        {
                            "time":1392256992746,
                            "value":"324"
                        }
                    ]
                }
            }
        ]
        ,
        "svctm_time" :[
            {
                "objectId":"",
                "objectName":"host1123",
                "hostoryMonitorMap":{
                    "svctm_time":[
                        {
                            "time":1392084150102,
                            "value":"250"
                        },
                        {
                            "time":1392170569000,
                            "value":"23"
                        },
                        {
                            "time":1392256992746,
                            "value":"324"
                        }
                    ]
                }
            },
            {
                "objectId":"",
                "objectName":"00123",
                "hostoryMonitorMap":{
                    "svctm_time":[
                        {
                            "time":1392084150102,
                            "value":"1048"
                        },
                        {
                            "time":1392170569000,
                            "value":"250"
                        },
                        {
                            "time":1392256992746,
                            "value":"324"
                        }
                    ]
                }
            }
        ]
    }
    }


    fixture({
        "POST /goku/rest/v1.5/{vdc_id}/monitors?cloud-infras={cloud_infras_id}": function (request, response) {
            response(200, "success",topnHostvmData, {})
        },
        "POST /goku/rest/v1.5/irm/1/monitors": function (request, response) {
            response(200, "success",topnClusterData, {})
        },
        "GET /uportal/monitoring/report": function (request, response) {
            response(200, "success",reportList, {})
        },
        "GET /uportal/monitoring/collectList": function (request, response) {
            response(200, "success",collectList, {})
        },

        "POST /goku/rest/v1.5/irm/monitors": function (request, response) {
                response(200, "success", topnClusterData, {})
        },
        //查询历史监控
        "POST /goku/rest/v1.5/irm/monitors/history":function(request, response){
            response(200, "success", historyCluserData, {})
        },
        //查询历史TOP监控
        "POST /goku/rest/v1.5/irm/monitors/topn":function(request, response){
            response(200, "success", historyCluserTOPData, {})
        },
        "POST /goku/rest/v1.5/irm/monitors/file":function(request, response){
            var data = {};
            data.historyMonitorPath = "www.huawei.com/expoer.xml"
            response(200, "success",data , {})
        },
        "POST /goku/rest/v1.5/irm/monitors/topndatastore":function(request, response){
            response(200, "success", datastoreTopHostData, {})
        }
    });

    return fixture;
});