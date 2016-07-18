define(function () {
    "use strict";
    var helpKey = {
        "IT": {
            "system_ServiceCenter_help":"it/system/Help_User_System.htm",
            "drawer_sc_service": "it/drawer/13_sc/help/it_90_51_000007.html",
            "drawer_sc_catalog": "it/drawer/13_sc/help/it_90_51_000019.html",
            "drawer_sc_my_instance": "it/drawer/13_sc/help/it_90_51_000009.html",
            "drawer_sc_all_instance": "it/drawer/13_sc/help/it_90_51_000010.html",
            "drawer_sc_to_do_list": "it/drawer/13_sc/help/it_90_51_000012.html",
            "drawer_sc_my_app": "it/drawer/13_sc/help/it_90_51_000013.html",
            "drawer_sc_all_app": "it/drawer/13_sc/help/it_90_51_000014.html",


             "system_FusionManager_help":"it/system/Help_User_System.htm",
            
            "drawer_app_instance": "it/drawer/07_fm/help/it_60_51_300001.html",
            "drawer_app_policy": "it/drawer/07_fm/help/it_60_51_300002.html",
            "drawer_template_app": "it/drawer/07_fm/help/it_60_51_300003.html",
            "drawer_vm": "it/drawer/07_fm/help/it_60_51_300004.html",
            "drawer_server": "it/drawer/07_fm/help/it_60_51_300005.html",
            "drawer_vm_disk": "it/drawer/07_fm/help/it_60_51_300006.html",
            "drawer_template_vm": "it/drawer/07_fm/help/it_60_51_300007.html",
            "drawer_template_soft": "it/drawer/07_fm/help/it_60_51_300008.html",
            "drawer_template_script": "it/drawer/07_fm/help/it_60_51_300009.html",
            "drawer_org_quota ": "it/drawer/07_fm/help/it_60_51_300010.html",
            "drawer_vpc_org": "it/drawer/07_fm/help/it_60_51_400017.html",
            "drawer_vpc_public": "it/drawer/07_fm/help/it_60_51_400018.html",
            "drawer_vpc_topo": "it/drawer/07_fm/help/it_60_51_400001.html",
            "drawer_router": "it/drawer/07_fm/help/it_60_51_400002.html",
            "drawer_vlb": "it/drawer/07_fm/help/it_60_51_400003.html",
            "drawer_vpc_service": "it/drawer/07_fm/help/it_60_51_400004.html",
            "drawer_vpc_net": "it/drawer/07_fm/help/it_60_51_400005.html",
            "drawer_eip": "it/drawer/07_fm/help/it_60_51_400006.html",
            "drawer_dnat": "it/drawer/07_fm/help/it_60_51_400007.html",
            "drawer_acl": "it/drawer/07_fm/help/it_60_51_400008.html",
            "drawer_security": "it/drawer/07_fm/help/it_60_51_400009.html",
            "drawer_vpn_gw":"it/drawer/07_fm/help/it_60_51_400010.html", 
            "drawer_vpn_con":"it/drawer/07_fm/help/it_60_51_400025.html", 
            "drawer_aspf":"it/drawer/07_fm/help/it_60_51_400022.html",
            "drawer_alarm": "it/drawer/07_fm/help/it_60_51_500010.html",
            "drawer_alarm_config": "it/drawer/07_fm/help/it_60_51_500011.html",
            "drawer_alarm_statis": "it/drawer/07_fm/help/it_60_51_500012.html",
            "drawer_perform": "it/drawer/07_fm/help/it_60_51_500013.html",
            "drawer_perform_config": "it/drawer/07_fm/help/it_60_51_500014.html",
            "drawer_perform_report": "it/drawer/07_fm/help/it_60_51_500015.html",
            "drawer_task": "it/drawer/07_fm/help/it_60_51_500017.html",
            "drawer_user": "it/drawer/07_fm/help/it_60_51_200007.html",
            "drawer_domain":"it/drawer/07_fm/help/it_60_51_200004_user.html",
            "drawer_role": "it/drawer/07_fm/help/it_60_51_200008.html"
        },
        "ICT": {

            "system_ServiceCenter_help":"it/system/Help_User_System.htm",
            "drawer_sc_service": "it/drawer/13_sc/help/it_90_51_000007.html",
            "drawer_sc_catalog": "it/drawer/13_sc/help/it_90_51_000019.html",
            "drawer_sc_my_instance": "it/drawer/13_sc/help/it_90_51_000009.html",
            "drawer_sc_all_instance": "it/drawer/13_sc/help/it_90_51_000010.html",
            "drawer_sc_to_do_list": "it/drawer/13_sc/help/it_90_51_000012.html",
            "drawer_sc_my_app": "it/drawer/13_sc/help/it_90_51_000013.html",
            "drawer_sc_all_app": "it/drawer/13_sc/help/it_90_51_000014.html",


            "system_FusionManager_help":"ict/system/Help_User_System.htm",
            
            "drawer_app_instance": "ict/drawer/07_fm/help/it_60_51_300001.html",
            "drawer_app_policy": "ict/drawer/07_fm/help/it_60_51_300002.html",
            "drawer_template_app": "ict/drawer/07_fm/help/it_60_51_300003.html",
            "drawer_vm": "ict/drawer/07_fm/help/it_60_51_300004.html",
            "drawer_vm_disk": "ict/drawer/07_fm/help/it_60_51_300006.html",
            "drawer_template_vm": "ict/drawer/07_fm/help/it_60_51_300007_ict.html",
            "drawer_org_quota ": "ict/drawer/07_fm/help/it_60_51_300010.html",
            "drawer_vpc_org": "ict/drawer/07_fm/help/it_60_51_400017.html",
            "drawer_vpc_public": "ict/drawer/07_fm/help/it_60_51_400018.html",
            "drawer_vpc_topo": "ict/drawer/07_fm/help/it_60_51_400001.html",
            "drawer_router": "ict/drawer/07_fm/help/it_60_51_400002.html",
            "drawer_vpc_net": "ict/drawer/07_fm/help/it_60_51_400005.html",
            "drawer_vlb": "it/drawer/07_fm/help/it_60_51_400003.html",
            "drawer_acl": "it/drawer/07_fm/help/it_60_51_400008.html",
            "drawer_eip": "ict/drawer/07_fm/help/it_60_51_400006.html",
            "drawer_security": "ict/drawer/07_fm/help/it_60_51_400009.html",
            "drawer_alarm": "ict/drawer/07_fm/help/it_60_51_500010.html",
            "drawer_alarm_config": "ict/drawer/07_fm/help/it_60_51_500011.html",
            "drawer_alarm_statis": "ict/drawer/07_fm/help/it_60_51_500012.html",
            "drawer_perform": "ict/drawer/07_fm/help/it_60_51_500013.html",
            "drawer_perform_config": "ict/drawer/07_fm/help/it_60_51_500014.html",
            "drawer_perform_report": "ict/drawer/07_fm/help/it_60_51_500015.html",
            "drawer_task": "ict/drawer/07_fm/help/it_60_51_500017.html",
            "drawer_user": "ict/drawer/07_fm/help/it_60_51_200007.html",
            "drawer_role": "ict/drawer/07_fm/help/it_60_51_200008.html",
            "drawer_vpn_con":"it/drawer/07_fm/help/it_60_51_400025.html"
        }
    };

    helpKey.getHelp = function (key, cloudType, language) {
        if (!language) {
            language = "zh";
        }
        var basePath = "app/business/help/" + language;
        var path = basePath + "/" + helpKey[cloudType][key];
        return path;
    };

    return helpKey;
});