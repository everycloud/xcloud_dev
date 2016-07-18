define(["can/util/fixture/fixture"], function (fixture) {
    "use strict";
    fixture({
        "GET /goku/rest/v1.5/deploy-mode": function (original, response) {
            response(200, "success", {deployMode: "allInOne"}, {}); //allInOne, top
        },
        "GET /goku/rest/fancy/v1.5/{id}/users": function (original, response) {
            var id = fixture.getId(original);
            var name = "admin";
            if(id == "tenant"){
                name = "user";
            }
            var result = {
                id: "123",
                name: name,
                loginVdcId: "1",
                loginVdcName: "AME_ORG",
                cloudType: "FUSIONSPHERE", // FUSIONSPHERE 、 OPENSTACK
                roleList: [],
                tokenId: "123"
            };
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/system-info": function (original, response) {
            var result = {
                "deployMode": "allInOne",//allInOne,serviceCenter
                "name": "FusionManager",
                "version": "V100R005C00B030",
                "guid": "a4de520c-3550-4d07-afd2-7bfb7fd0563e"
            };
            response(200, "success", result, {});
        },
        "GET /goku/rest/v1.5/version": function (original, response) {
            var result = {
                "version": "V100R005_20140515_100",
                "name": "Fusion Manager"
            };
            response(200, "success", result, {});
        },


        "POST /goku/rest/v1.5/license/action": function (original, response) {
            response(200, "success", {
                "licenseInvalidateNormal": true,
                "invalidateReason": "{\"zh_CN\":\"123\",\"en_US\":\"abc\"}"
            }, {});
        },

        "GET /goku/rest/v1.5/esn": function (original, response) {
            response(200, "success", {
                "esn": "1526849"
            }, {});
        },

        "GET /goku/rest/v1.5/privileges": function (original, response) {
            var result = {
                code: "0",
                //administor
                privilegeList: [ "302002","553002", "560002", "453002","301000","312000","312001","312002","302000","302001","302002","303002", "301001", "301002", '303002','320003', '1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '15', '16', '18', '19', '21', '22', '23', '24', '31', '32', '34', '55', '101000', '101001', '101002', '102000', '102001', '102002', '103000', '103001', '103002', '104000', '104001', '104002', '105000', '106000', '106001', '106002', '107000', '108000', '108001', '109000', '110000', '111000', '111001', '111002', '201000', '201001', '201002', '202000', '203000', '204000', '204001', '204002', '205000', '206000', '206001', '206002', '207000', '207001', '207002', '208000', '208001', '208002', '209000', '209001', '209002', '210000', '210001', '210002', '211000', '212000', '213000', '214000', '303001','304000', '304001', '304002', '305000', '306000', '307000', '308000', '309000', '309001', '309002', '310000', '310001', '310002', '311000', '311001', '311002', '312000', '312001', '312002', '313000', '313001', '313002', '314000', '314001', '314002', '315000', '315001', '315002', '316000', '316001', '316002', '317000', '317001', '317002', '318000', '318001', '319000', '319001', '319002', '320000', '320001', '320002', '320005', '402000', '403000', '404000', '404001', '404002', '451000', '451001', '451002', '452000', '452001', '452002', '453000', '453001', '453002', '454000', '454001', '454002', '455000', '455001', '455002', '456000', '457000', '457001', '457002', '458000', '458001', '458002', '459000', '459001', '459002', '551000', '551001', '551002', '552000', '552001', '552002', '553000', '553001', '553002', '554000', '554001', '554002', '555000', '555001', '555002', '556000', '561002', '557000', '557001', '557002', '558000', '558001', '558002', '559000', '559001', '559002', '460000', '460001', '460002', '461000', '461001', '461002', '601000', '601001', '601002', '602000', '602001', '602002', '603000', '603001', '603002', '604000', '604001', '604002', '605000', '605001', '605002','606000', '606001','606002', '607000', '608000', '609000', '610000', '611000', '612000', '613000', '614000', '615000', '616000', '617000', '618000', '619000', '620000','112000','112001','112002']
		};           
		var result2 = {
                code: "0020101933",
                message: "内部错误"
            };
            response(200, "success", result, {});

        },
        "GET /goku/rest/v1.5/users/{userId}/vdcs": function (original, response) {
            var item1 = {
                id: "vdcId001",
                name: "DefaultVPCORG"
            };
            var item2 = {
                id: "vdcId001",
                name: "SSP_ORG"
            };
            var vdcList = [];
            vdcList.push(item1);
            vdcList.push(item2);
            response(200, "success", {
                total: 2,
                vdcList: vdcList
            }, {});
        },

        "PUT /goku/rest/v1.5/users/{userId}/vdcs/{vdcId}": function (original, response) {
            response(200, "success", {}, {});
        },
        //查询资源池能力差异
        "GET /goku/rest/v1.5/{vdc_id}/cloud-infras-capacity": function (original, response) {
            var cloudInfraCapacity = [
                {
                    type: "fusionmanager",
                    version: "1.5.0",
                    capacity: {
                        "volume_support_disk_type": "true",
                        "volume_support_media_type": "true",
                        "volume_support_used_percent": "true",
                        "vm_support_safe_delete": "true",
                        "vm_support_user_define_config": "true",
                        "vm_support_convert_to_template": "true",
                        "vm_support_repair_vm": "true",
                        "vpc_support_select": "false",
                        "vm_support_modify_nic": "true",
                        "vm_support_modify_config": "false",
                        "vm_support_add_to_domain": "true",
                        "network_support_win_server": "true",
                        "sg_support_YD_fancy_features": "true"
                    }
                },
                {
                    type: "openstack",
                    version: "havana",
                    capacity: {
                        "volume_support_disk_type": "false",
                        "volume_support_media_type": "false",
                        "volume_support_used_percent": "false",
                        "vm_support_safe_delete": "false",
                        "vm_support_user_define_config": "false",
                        "vm_support_convert_to_template": "false",
                        "vm_support_repair_vm": "false",
                        "vpc_support_select": "true",
                        "vm_support_modify_nic": "false",
                        "vm_support_modify_config": "true",
                        "vm_support_add_to_domain": "false",
                        "network_support_win_server": "false",
                        "sg_support_YD_fancy_features": "false"
                    }
                }
            ];

            var ret = {
                code: "0",
                message: "",
                "cloudInfras": cloudInfraCapacity
            };
            response(200, "success", ret, {});
        },
        "GET /goku/rest/v1.5/device-archive": function (original, response) {
            response(200, "success", {
                deviceArchiveName: 'muhaha'
            }, {});
        }
    });
    return fixture;
});