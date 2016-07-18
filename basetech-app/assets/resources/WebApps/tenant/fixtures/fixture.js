define(["can/util/fixture/fixture"], function (fixture) {
    var data = {
        "result": {
            "name": "tdp",
            "vmLst": [
                ["","i-0000001", "VRM01", "Running", "", ""],
                ["","i-0000002", "GMN01", "Running", "", ""],
                ["","i-0000003", "FSM01", "Stopped", "", ""]
            ]
        },
        "softwareList":{
            "data":[{
                "id":"001",
                "name":"mysql",
                "type":"rpm",
                "version":"1.0",
                "system":"linux",
                "description":"Discuz",
                "createTime":"",
                "operator":"",
                "progress":20
            },{
                "id":"002",
                "name":"test",
                "type":"unkown",
                "version":"1.0",
                "system":"windows",
                "description":"installing test",
                "createTime":"",
                "operator":"",
                "progress":100
            }],
            "curPage": 0,
            "totalRecords": 2
        },
        "policyList": {
            "data": [
                {
                    name: "policy_002",
                    status: "Start",
                    createTime: "2013-12-04 22:49:40 UTC+08:00",
                    description: "app_policy_002",
                    operator: "",
                    detail: {
                        contentType: "simple",
                        content: "123"
                    }
                },
                {
                    name: "policy_003",
                    status: "Start",
                    createTime: "2013-12-04 22:49:40 UTC+08:00",
                    description: "app_policy_003",
                    operator: "",
                    detail: {
                        contentType: "url",
                        content: "app/business/application/views/policy/policyDetail.html"
                    }
                },
                {
                    name: "policy_004",
                    status: "Start",
                    createTime: "2013-12-04 22:49:40 UTC+08:00",
                    description: "app_policy_003",
                    operator: "",
                    detail: {
                        contentType: "url",
                        content: "app/business/application/views/policy/policyDetail.html"
                    }}
            ],
            "curPage": 1,
            "totalRecords": 1
        },
        "diagramData": {
            "barchartSeries": [
                {
                    x: 1,
                    y: 20
                },
                {
                    x: 2,
                    y: 30
                },
                {
                    x: 3,
                    y: 50
                },
                {
                    x: 4,
                    y: 71
                },
                {
                    x: 5,
                    y: 78
                },
                {
                    x: 6,
                    y: 68
                },
                {
                    x: 7,
                    y: 99
                },
                {
                    x: 9,
                    y: 80
                }
            ]}
    };

    var searchResult = [
        ["","i-0000001", "VRM01", "Running", "", ""]
    ];

    var searchVmTempResult = [
        ["Win2008_Domain", "normal", "Windows", "Windows XP Professional 64bit"]
    ];


    var userData =  [
            ["SystemAdmin", "System Administrator", "", ""],
            ["BusinessAdmin", "Business Administrator", "", ""]
        ];

    var vmList = {
        "vms": [
            ["","1", "vm1", "CNA01","",""],
            ["","2", "vm2", "CNA01","",""],
            ["","3", "vm3", "CNA01","",""],
            ["","4", "vm4", "CNA01","",""],
            ["","5", "vm5", "CNA02","",""],
            ["","6", "vm6", "CNA02","",""],
            ["","7", "vm7", "CNA02","",""],
            ["","8", "vm8", "CNA02","",""],
            ["","9", "vm8", "CNA02","",""],
            ["","10", "vm8", "CNA02","",""],
            ["","11", "vm8", "CNA02","",""],
            ["","12", "vm8", "CNA02","",""],
            ["","13", "vm8", "CNA02","",""],
            ["","14", "vm9", "CNA02","",""]
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords" : 0
    }

    var userData = {
        "userList": [
            ["admin","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["user1","System Administrator", "AD Certification", "Offline","2014-1-17",""],
            ["user2","System Administrator", "AD Certification", "Online","2014-1-17",""],
            ["zhangsan","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["lisi","System Administrator", "Local authentication", "Offline","2014-1-17",""],
            ["zhaowu","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["wangliu","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["user1","System Administrator", "Local authentication", "Offline","2014-1-17",""],
            ["user2","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["user3","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["user4","System Administrator", "Local authentication", "Offline","2014-1-17",""],
            ["user5","System Administrator", "Local authentication", "Online","2014-1-17",""],
            ["user6","System Administrator", "Local authentication", "Online","2014-1-17",""]
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords" : 0
    }

    fixture({
        "GET /uportal/test": function (original, response) {
            response(200, "success", data.result, {})
        },

        "GET /uportal/vmLst": function (original, response) {
            response(200, "success", data.result.vmLst, {});
        },
        "GET /uportal/diagram/barchartdata": function (original, response) {
            response(200, "success", data.diagramData.barchartSeries, {});
        },
        "GET /uportal/vmLst/search": function (original, response) {
            response(200, "success", searchResult, {})
        },

        "GET /uportal/selVmTemp/search": function (original, response) {
            response(200, "success", searchVmTempResult, {})
        },
        "GET /uportal/app/policy/query": function(original, response){
            var policy = data.policyList.data;
            for (var index in policy)
            {
                policy[index].createTime = Date.now();
            }
            response(200, "success", data.policyList, {});
        },
	"GET /uportal/vm/refresh": function (original, response) {
            response(200, "success", vmList.refreshVm, {})
        },
        "GET /uportal/vm/query/{id}": function (original, response) {
            var vmId = fixture.getId(original);
            var vm = {};
            for(var index in vmList.vms){
                var tmpvm = vmList.vms[index];
                if(tmpvm[1] === vmId){
                    vm.vmId = tmpvm[1];
                    vm.vmName = tmpvm[2];
                    vm.vmLocation = tmpvm[3];
                    break;
                }
            }
            response(200, "success", vm, {})
        },
        "POST /uportal/vm/create": function (original, response) {
            var vmData = original.data;
            var vmID = vmList.vms.length + 1;
            var newVM = ["",vmID, vmData.vmName, vmData.vmLocation,"",""];
            vmList.vms.unshift(newVM);
            response(200, "success", newVM, {})
        },
        "GET /chart/vmlist" : function(original, response) {
            var vmlist = [[false, "vm1", "i-0000020C", "192.168.200.5", "Running", "CNA01","20"],
                [false, "vm2", "i-0000020D", "192.168.200.6", "Stopped", "CNA01", "30"],
                [false, "vm3", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm4", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm5", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm6", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm7", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm8", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm9", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm10", "i-0000020C", "192.168.200.5", "Running", "CNA01","40"]
                , [false, "vm11", "i-0000020C", "192.168.200.5", "Running", "CNA01","40"]
                , [false, "vm12", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm13", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm14", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm15", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm16", "i-0000020C", "192.168.200.5", "Running", "CNA01", "40"]
                , [false, "vm17", "i-0000020C", "192.168.200.5", "Running", "CNA01", "60"]];
            response(200, "success", vmlist, {});
        },

        "GET /uportal/user/create": function (original, response) {
            userData.push(original.data);
            response(200, "success", userData, {})
        },

        "GET /uportal/user/refresh": function (original, response) {
            response(200, "success", userData, {})
        },
        "GET /uportal/template/software/query": function(original, response){
            var softwareList = data.softwareList.data;
            for (var index in softwareList)
            {
                softwareList[index].createTime = Date.now();
            }
            response(200, "success", data.softwareList, {});
        },
        "POST /uportal/template/software/delete": function(original, response){
            var id = original.data.id;
            var softwareList = data.softwareList.data;
            for (var index in softwareList)
            {
                if (softwareList[index].id === id)
                {
                    softwareList.splice(index, 1);
                    data.softwareList.totalRecords -= 1;
                    break;
                }
            }
            response(200, "success", "ok", {});
        },
        "GET /uportal/template/software/detail": function(original, response){
            var name = original.data.name;
            var softwareList = data.softwareList.data;
            var res = undefined;
            for (var index in softwareList)
            {
                if (softwareList[index].name === name)
                {
                    res = {
                        "name":name,
                        "progress":softwareList[index].progress
                    };
                    break;
                }
            }
            response(200, "success", res, {});
        }
    });

    return fixture;
});