define(["can/util/fixture/fixture"], function (fixture) {
    var hostsData = {
        code: 0,
        servers: [
            {
                biosInfo: null,
                bmcIp: "192.168.99.62",
                bmcUserName: "root",
                clusterName: "ManagementCluster",
                cpuSpeed: 2.4,
                cpuUsageRate: "4.73",
                hostFanInfo: null,
                hostId: 1,
                hostLogicPartion: null,
                hostPhyCPUInfo: null,
                hostPhyDiskInfo: null,
                hypervisorId: 4629700416936870000,
                localDisk: 2000,
                memUsageRate: "23.55",
                memorySizeMB: 12980,
                netInputFlow: 0,
                netOutPutFlow: 0,
                phyLogicDiskInfo: null,
                phyMemoryInfo: null,
                phyNicPortInfo: null,
                phyPowerInfo: null,
                product: "Huawei Tecal RH2288 V2",
                rackNo: "149290290001",
                resClusterID: 4625196817309499000,
                resourceState: 0,
                roomName: "xian_Room01",
                runtimeState: 5,
                osName:"xianOsName",
                serverName: "xianServer01",
                serverType: 0,
                slotNo: "0",
                subRackNo: "xian_Rack03",
                uhmServerId: "Huawei Tecal RH2288 V2_192.168.99.62",
                urn: "03aa456c-89a5-4cd9-8275-a6290aa0f1d7",
                vrmId: "urn:sites:49F70862:hosts:63"
            }
        ]};
    fixture({
        "GET /goku/rest/v1.5/irm/chassises?start=1&limit=10&sort_key=&sort_dir=&zoneId=&resourceStatus=&name=&type=&chassisId=": function (original, response) {
            response(200, "success", chassisData, {});
        },
        "GET /goku/rest/v1.5/irm/chassises?start=&limit=&sort_key=&sort_dir=&zoneId=&resourceStatus=&name=&type=&chassisId=Huawei_E9000_CH220_192.168.99.15": function (original, response) {
            response(200, "success", chassisData, {});
        },
        "GET /goku/rest/v1.5/irm/switches/port/switch": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/racks/10744/devices?start=1&limit=10&sort=&order=": function (original, response) {
            var result = {
                "code":"0","message":"","total":1,"deviceList":[{"devName":"firewall_A03","devModel":"Eudemon1000E","devType":"4","rackId":"xianChassis01","frameId":"xianChassis01","devId":null,"uhmId":null,"hypervisorId":null,"serverType":null}]
            }
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/irm/phy-firewall/config-file": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/phy-loadbalances/10737/business-config": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/phy-loadbalances/10737/connection-config": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/file/undefined?type=export": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/modifypassword": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/fusionstorage": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/fusionstorage": function (original, response) {
            var result =
            {
                "code":"0","message":"","total":1
                [{"id":"233sfdfsdf","ip":"Huawei_Tecal_RH2285_199.199.1.220","userName":"xianServer2285",
                    "name":"xianRack01","port":"xianRoom01"}]
            }
            response(200, "success", result, {});
        },
        "PUT /goku/rest/v1.5/irm/switches/uplinkports": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/racks/10741": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/racks/10744": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/rooms/10740": function (original, response) {
            response(200, "success", {}, {});
        },
        "PUT /goku/rest/v1.5/irm/rooms/10743": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/chassises": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phy-storage": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/device-templates/zh_CN": function (original, response) {
            response(200, "success", {}, {});
        },
        "POST /goku/rest/v1.5/irm/phy-loadbalances": function (original, response) {

            var request = JSON.parse(original.data);
            var vlbName = "VLB_A" + Math.ceil(Math.random()*10000);
            var balanceData = {
                deviceName:vlbName,
                portName:request.portName,
                deviceIp:request.deviceIp,
                description:request.description,
                zoneName:request.zoneName,
                roomName:request.roomName,
                rackName:request.rackName,
                subRackName:request.subRackName,
                peerIp:request.peerIp,
                "status": 0,
                "linkStatus": 0,
                "software": "BIG-IP V10",
                "hardware": "F5 BIG-IP 1600"
            };

            loadBalance.lbList.push(balanceData);
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=02900101&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers/1": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=5&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=7&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", hostsData, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=8&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=075500101&runStatus=6&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/servers?start=1&limit=10&sort_key=&sort_dir=&zoneId=&runStatus=5&resourceStatus=&name=&type=": function (original, response) {
            response(200, "success", {}, {});
        },
    });

    return fixture;
});