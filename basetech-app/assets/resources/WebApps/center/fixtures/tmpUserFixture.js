define(["can/util/fixture/fixture"], function (fixture) {
    var userData = {
        "userList": [
            {
                "id": "1",
                "name": "admin",
                "phone": "13898745125",
                "email": "admin@huawei.com",
                "role": "administrater",
                "domainType": "本地认证",
                "lockState": "解锁",
                "userLocked": false,
                "onlineState": "在线",
                "createTime": "2014-1-17",
                "startDate": "2014-1-17",
                "endDate": "2014-1-18",
                "startTime": "12:20:30",
                "endTime": "12:20:50",
                "ipAddress": "192.168.26.42",
                "description": "这是一个管理员用户1",
                "operation": ""
            },
            {
                "id": "3",
                "name": "user",
                "phone": "13898745125",
                "email": "user@huawei.com",
                "role": "administrater",
                "userType": "业务管理员",
                "domainType": "本地认证",
                "lockState": "解锁",
                "userLocked": false,
                "onlineState": "在线",
                "createTime": "2014-1-17",
                "startDate": "2014-1-17",
                "endDate": "2014-1-18",
                "startTime": "12:20:30",
                "endTime": "12:20:50",
                "ipAddress": "192.168.26.42",
                "description": "这是一个管理员用户3",
                "operation": ""
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };

    var orgData = {
        "vdcList": [
            {
                "id": "1",
                "orgName": "DefaultSharedORG",
                "memberCount": 10,
                "createTime": "2014-1-17",
                "orgDesc": "default organization",
                "operation": ""
            },
            {
                "id": "2",
                "orgName": "DefaultVPCORG",
                "memberCount": 15,
                "createTime": "2014-1-17",
                "orgDesc": "default organization",
                "operation": ""
            },
            {
                "id": "3",
                "orgName": "org1",
                "memberCount": 15,
                "createTime": "2014-1-17",
                "orgDesc": "org1 organization",
                "operation": ""
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };

    var leftTreeData1 = [
        {"id": "1", "parentId": "0", "name": "sys_term_sysConfig_label", "relatedPrivilegeIds": null},
        {"id": "2", "parentId": "0", "name": "common_term_authorization_label", "relatedPrivilegeIds": null},
        {"id": "3", "parentId": "0", "name": "server_term_server_label", "relatedPrivilegeIds": null},
        {"id": "5", "parentId": "0", "name": "common_term_monitor_label", "relatedPrivilegeIds": null},
        {"id": "6", "parentId": "0", "name": "template_term_template_label", "relatedPrivilegeIds": null},
        {"id": "7", "parentId": "0", "name": "resource_term_pool_label", "relatedPrivilegeIds": null},
        {"id": "8", "parentId": "0", "name": "report_term_report_label", "relatedPrivilegeIds": null},
        {"id": "9", "parentId": "0", "name": "org_term_organization_label", "relatedPrivilegeIds": null},
        {"id": "10", "parentId": "0", "name": "common_term_vm_label", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "12", "parentId": "0", "name": "log_term_log_label", "relatedPrivilegeIds": null},
        {"id": "13", "parentId": "0", "name": "service_term_service_label", "relatedPrivilegeIds": null},
        {"id": "15", "parentId": "0", "name": "cloud_term_cloudPool_label", "relatedPrivilegeIds": ["304002"]},
        {"id": "16", "parentId": "0", "name": "task_term_task_label", "relatedPrivilegeIds": null},
        {"id": "18", "parentId": "0", "name": "vpc_term_vpc_label", "relatedPrivilegeIds": null},
        {"id": "19", "parentId": "0", "name": "resource_term_ServiceVM_label", "relatedPrivilegeIds": null},
        {"id": "21", "parentId": "0", "name": "virtual_term_cluster_label", "relatedPrivilegeIds": ["106001", "613000"]},
        {"id": "22", "parentId": "0", "name": "vm_term_vmDisk_label", "relatedPrivilegeIds": null},
        {"id": "23", "parentId": "0", "name": "common_term_host_label", "relatedPrivilegeIds": null},
        {"id": "24", "parentId": "0", "name": "virtual_term_hypervisor_label", "relatedPrivilegeIds": null},
        {"id": "31", "parentId": "0", "name": "sys_term_desktop_label", "relatedPrivilegeIds": null},
        {"id": "32", "parentId": "0", "name": "sys_term_topo_label", "relatedPrivilegeIds": null},
        {"id": "34", "parentId": "0", "name": "device_term_device_label", "relatedPrivilegeIds": ["106001"]},
        {"id": "42", "parentId": "0", "name": "cloud_term_tagManage_label", "relatedPrivilegeIds": null},
        {"id": "43", "parentId": "0", "name": "resource_term_resourceStatistic_label", "relatedPrivilegeIds": null},
        {"id": "51", "parentId": "0", "name": "vm_term_snaps_label", "relatedPrivilegeIds": null},
        {"id": "102000", "parentId": "2", "name": "role_term_role_label", "relatedPrivilegeIds": null},
        {"id": "102001", "parentId": "102000", "name": "role_role_add_option_roleHandle_value", "relatedPrivilegeIds": ["102002"]},
        {"id": "102002", "parentId": "102000", "name": "role_role_add_option_roleView_value", "relatedPrivilegeIds": null},
        {"id": "103000", "parentId": "2", "name": "user_term_user_label", "relatedPrivilegeIds": null},
        {"id": "103001", "parentId": "103000", "name": "role_role_add_option_userHandle_value", "relatedPrivilegeIds": ["103002"]},
        {"id": "103002", "parentId": "103000", "name": "role_role_add_option_userView_value", "relatedPrivilegeIds": null},
        {"id": "104000", "parentId": "2", "name": "user_term_pswPolicy_label", "relatedPrivilegeIds": null},
        {"id": "104001", "parentId": "104000", "name": "role_role_add_option_pswPolicyHandle_value", "relatedPrivilegeIds": ["104002"]},
        {"id": "104002", "parentId": "104000", "name": "role_role_add_option_pswPolicyView_value", "relatedPrivilegeIds": null},
        {"id": "105000", "parentId": "12", "name": "log_term_operation_label", "relatedPrivilegeIds": null},
        {"id": "106000", "parentId": "5", "name": "alarm_term_alarm_label", "relatedPrivilegeIds": null},
        {"id": "106001", "parentId": "106000", "name": "role_role_add_option_alarmView_value", "relatedPrivilegeIds": null},
        {"id": "106002", "parentId": "106000", "name": "role_role_add_option_alarmHandle_value", "relatedPrivilegeIds": ["106001"]},
        {"id": "107000", "parentId": "5", "name": "perform_term_monitor_label", "relatedPrivilegeIds": null},
        {"id": "108000", "parentId": "9", "name": "role_role_add_option_orgHandle_value", "relatedPrivilegeIds": ["108001", "103002", "304002", "102002"]},
        {"id": "108001", "parentId": "9", "name": "role_role_add_option_orgView_value", "relatedPrivilegeIds": ["103002", "304002"]},
        {"id": "109000", "parentId": "8", "name": "role_role_add_option_reportView_value", "relatedPrivilegeIds": null},
        {"id": "110000", "parentId": "8", "name": "role_role_add_option_reportHandle_value", "relatedPrivilegeIds": ["109000"]},
        {"id": "111000", "parentId": "2", "name": "domain_term_domain_label", "relatedPrivilegeIds": null},
        {"id": "111001", "parentId": "111000", "name": "role_role_add_option_domainHandle_value", "relatedPrivilegeIds": ["111002"]},
        {"id": "111002", "parentId": "111000", "name": "role_role_add_option_domainView_value", "relatedPrivilegeIds": null},
        {"id": "201000", "parentId": "1", "name": "sys_term_backupSet_label", "relatedPrivilegeIds": null},
        {"id": "201001", "parentId": "201000", "name": "role_role_add_option_backupSetView_value", "relatedPrivilegeIds": null},
        {"id": "201002", "parentId": "201000", "name": "role_role_add_option_backupSetHandle_value", "relatedPrivilegeIds": ["201001"]},
        {"id": "202000", "parentId": "1", "name": "sys_term_comPsw_label", "relatedPrivilegeIds": null},
        {"id": "203000", "parentId": "1", "name": "sys_term_desktopAddr_label", "relatedPrivilegeIds": null},
        {"id": "204000", "parentId": "1", "name": "sys_term_license_label", "relatedPrivilegeIds": null},
        {"id": "204001", "parentId": "204000", "name": "role_role_add_option_licenseView_value", "relatedPrivilegeIds": null},
        {"id": "204002", "parentId": "204000", "name": "role_role_add_option_licenseHandle_value", "relatedPrivilegeIds": ["204001"]},
        {"id": "207000", "parentId": "1", "name": "sys_term_time_label", "relatedPrivilegeIds": null},
        {"id": "207001", "parentId": "207000", "name": "role_role_add_option_timeView_value", "relatedPrivilegeIds": null},
        {"id": "207002", "parentId": "207000", "name": "role_role_add_option_timeHandle_value", "relatedPrivilegeIds": ["207001"]},
        {"id": "209000", "parentId": "1", "name": "sys_term_snmp_label", "relatedPrivilegeIds": null},
        {"id": "209001", "parentId": "209000", "name": "role_role_add_option_snmpView_value", "relatedPrivilegeIds": null},
        {"id": "209002", "parentId": "209000", "name": "role_role_add_option_snmpHandle_value", "relatedPrivilegeIds": ["209001"]},
        {"id": "210000", "parentId": "1", "name": "sys_term_timeout_label", "relatedPrivilegeIds": null},
        {"id": "210001", "parentId": "210000", "name": "role_role_add_option_timeoutHandle_value", "relatedPrivilegeIds": ["210002"]},
        {"id": "210002", "parentId": "210000", "name": "role_role_add_option_timeoutView_value", "relatedPrivilegeIds": null},
        {"id": "211000", "parentId": "19", "name": "role_role_add_option_ServiceVMView_value", "relatedPrivilegeIds": null},
        {"id": "212000", "parentId": "19", "name": "role_role_add_option_ServiceVMHandle_value", "relatedPrivilegeIds": ["211000"]},
        {"id": "213000", "parentId": "1", "name": "sys_term_archives_label", "relatedPrivilegeIds": null},
        {"id": "214000", "parentId": "1", "name": "sys_term_intervalStartStop_label", "relatedPrivilegeIds": null},
        {"id": "214001", "parentId": "214000", "name": "role_role_add_option_intervalStartStopView_value", "relatedPrivilegeIds": null},
        {"id": "214002", "parentId": "214000", "name": "role_role_add_option_intervalStartStopHandle_value", "relatedPrivilegeIds": ["214001"]},
        {"id": "215000", "parentId": "1", "name": "sys_term_disasterCfg_label", "relatedPrivilegeIds": null},
        {"id": "215001", "parentId": "215000", "name": "role_role_add_option_disasterCfgView_value", "relatedPrivilegeIds": null},
        {"id": "215002", "parentId": "215000", "name": "role_role_add_option_disasterCfgHandle_value", "relatedPrivilegeIds": ["215001"]},
        {"id": "216000", "parentId": "1", "name": "sys_term_machineAccountMgmt_label", "relatedPrivilegeIds": null},
        {"id": "216001", "parentId": "216000", "name": "role_role_add_option_machineAccountView_value", "relatedPrivilegeIds": null},
        {"id": "216002", "parentId": "216000", "name": "role_role_add_option_machineAccountHandle_value", "relatedPrivilegeIds": ["216001"]},
        {"id": "304000", "parentId": "15", "name": "resource_term_AZ_label", "relatedPrivilegeIds": ["306000"]},
        {"id": "304001", "parentId": "304000", "name": "role_role_add_option_AZHandle_value", "relatedPrivilegeIds": ["304002", "306000"]},
        {"id": "304002", "parentId": "304000", "name": "role_role_add_option_AZView_value", "relatedPrivilegeIds": ["306000"]},
        {"id": "305000", "parentId": "15", "name": "role_role_add_option_cloudPoolHandle_value", "relatedPrivilegeIds": ["306000", "304002"]},
        {"id": "306000", "parentId": "15", "name": "role_role_add_option_cloudPoolView_value", "relatedPrivilegeIds": ["304002"]},
        {"id": "307000", "parentId": "13", "name": "role_role_add_option_serviceHandle_value", "relatedPrivilegeIds": ["308000"]},
        {"id": "308000", "parentId": "13", "name": "role_role_add_option_serviceView_value", "relatedPrivilegeIds": null},
        {"id": "309000", "parentId": "6", "name": "template_term_ipBandwidth_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "309001", "parentId": "309000", "name": "role_role_add_option_ipBandwidthView_value", "relatedPrivilegeIds": ["312001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "309002", "parentId": "309000", "name": "role_role_add_option_ipBandwidthHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "310000", "parentId": "6", "name": "template_term_iso_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "310001", "parentId": "310000", "name": "role_role_add_option_isoView_value", "relatedPrivilegeIds": ["312001", "309001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "310002", "parentId": "310000", "name": "role_role_add_option_isoHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "311000", "parentId": "6", "name": "template_term_script_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "311001", "parentId": "311000", "name": "role_role_add_option_scriptView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "311002", "parentId": "311000", "name": "role_role_add_option_scriptHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "312000", "parentId": "6", "name": "template_term_app_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "312001", "parentId": "312000", "name": "role_role_add_option_appTemplateView_value", "relatedPrivilegeIds": ["309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "312002", "parentId": "312000", "name": "role_role_add_option_appTemplateHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "313000", "parentId": "6", "name": "template_term_software_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "313001", "parentId": "313000", "name": "role_role_add_option_softwareView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "313002", "parentId": "313000", "name": "role_role_add_option_softwareHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "314000", "parentId": "6", "name": "template_term_vmLogic_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "314001", "parentId": "314000", "name": "role_role_add_option_vmLogicView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "315001", "316001", "317001"]},
        {"id": "314002", "parentId": "314000", "name": "role_role_add_option_vmLogicHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "315000", "parentId": "6", "name": "spec_term_vm_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "315001", "parentId": "315000", "name": "role_role_add_option_vmSpecView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "316001", "317001"]},
        {"id": "315002", "parentId": "315000", "name": "role_role_add_option_vmSpecHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "316000", "parentId": "6", "name": "template_term_vm_label", "relatedPrivilegeIds": ["306000", "312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "316001", "parentId": "316000", "name": "role_role_add_option_vmTemplateView_value", "relatedPrivilegeIds": ["306000", "312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "317001", "316002"]},
        {"id": "316002", "parentId": "316000", "name": "role_role_add_option_vmTemplateHandle_value", "relatedPrivilegeIds": ["304002", "312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001", "306000"]},
        {"id": "317000", "parentId": "6", "name": "spec_term_vpc_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "317001", "parentId": "317000", "name": "role_role_add_option_vpcSpecView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001"]},
        {"id": "317002", "parentId": "317000", "name": "role_role_add_option_vpcSpecHandle_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "318000", "parentId": "13", "name": "service_term_template_label", "relatedPrivilegeIds": null},
        {"id": "318001", "parentId": "318000", "name": "role_role_add_option_serviceTemplateView_value", "relatedPrivilegeIds": null},
        {"id": "319000", "parentId": "13", "name": "service_term_catalog_label", "relatedPrivilegeIds": null},
        {"id": "319001", "parentId": "319000", "name": "role_role_add_option_catalogView_value", "relatedPrivilegeIds": null},
        {"id": "319002", "parentId": "319000", "name": "role_role_add_option_catalogHandle_value", "relatedPrivilegeIds": ["319001"]},
        {"id": "320000", "parentId": "13", "name": "service_term_order_label", "relatedPrivilegeIds": null},
        {"id": "320001", "parentId": "320000", "name": "role_role_add_option_orderView_value", "relatedPrivilegeIds": null},
        {"id": "320002", "parentId": "320000", "name": "role_role_add_option_orderHandle_value", "relatedPrivilegeIds": ["320001"]},
        {"id": "320003", "parentId": "13", "name": "role_role_add_option_serInstanceView_value", "relatedPrivilegeIds": null},
        {"id": "320004", "parentId": "13", "name": "role_role_add_option_serInstanceHandle_value", "relatedPrivilegeIds": ["320003"]},
        {"id": "320005", "parentId": "320000", "name": "role_role_add_option_orderApprove_value", "relatedPrivilegeIds": ["320001"]},
        {"id": "321000", "parentId": "6", "name": "template_term_softDepot_label", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "321001", "314001", "315001", "316001", "317001"]},
        {"id": "321001", "parentId": "321000", "name": "role_role_add_option_softDepotView_value", "relatedPrivilegeIds": ["312001", "309001", "310001", "311001", "313001", "314001", "315001", "316001", "317001"]},
        {"id": "323000", "parentId": "15", "name": "resource_term_externalNets_label", "relatedPrivilegeIds": null},
        {"id": "323002", "parentId": "323000", "name": "role_role_add_option_externalNetView_value", "relatedPrivilegeIds": null},
        {"id": "401000", "parentId": "3", "name": "role_role_add_option_serverView_value", "relatedPrivilegeIds": null},
        {"id": "401001", "parentId": "3", "name": "role_role_add_option_serverHandle_value", "relatedPrivilegeIds": ["401000"]},
        {"id": "402000", "parentId": "34", "name": "role_role_add_option_deviceView_value", "relatedPrivilegeIds": ["106001"]},
        {"id": "403000", "parentId": "34", "name": "role_role_add_option_deviceHandle_value", "relatedPrivilegeIds": ["402000"]},
        {"id": "404000", "parentId": "34", "name": "device_term_FusionStorage_label", "relatedPrivilegeIds": null},
        {"id": "404001", "parentId": "404000", "name": "role_role_add_option_FusionStorageView_value", "relatedPrivilegeIds": null},
        {"id": "404002", "parentId": "404000", "name": "role_role_add_option_FusionStorageHandle_value", "relatedPrivilegeIds": ["404001"]},
        {"id": "451000", "parentId": "18", "name": "aspf_term_aspf_label", "relatedPrivilegeIds": null},
        {"id": "451001", "parentId": "451000", "name": "role_role_add_option_aspfView_value", "relatedPrivilegeIds": null},
        {"id": "451002", "parentId": "451000", "name": "role_role_add_option_aspfHandle_value", "relatedPrivilegeIds": ["451001"]},
        {"id": "452000", "parentId": "18", "name": "nat_term_dnat_label", "relatedPrivilegeIds": null},
        {"id": "452001", "parentId": "452000", "name": "role_role_add_option_dnatView_value", "relatedPrivilegeIds": null},
        {"id": "452002", "parentId": "452000", "name": "role_role_add_option_dnatHandle_value", "relatedPrivilegeIds": ["452001"]},
        {"id": "453000", "parentId": "18", "name": "eip_term_eip_label", "relatedPrivilegeIds": null},
        {"id": "453001", "parentId": "453000", "name": "role_role_add_option_eipView_value", "relatedPrivilegeIds": null},
        {"id": "453002", "parentId": "453000", "name": "role_role_add_option_eipHandle_value", "relatedPrivilegeIds": ["453001"]},
        {"id": "454000", "parentId": "18", "name": "acl_term_acl_label", "relatedPrivilegeIds": null},
        {"id": "454001", "parentId": "454000", "name": "role_role_add_option_aclView_value", "relatedPrivilegeIds": null},
        {"id": "454002", "parentId": "454000", "name": "role_role_add_option_aclHandle_value", "relatedPrivilegeIds": ["454001"]},
        {"id": "455000", "parentId": "18", "name": "vpc_term_net_label", "relatedPrivilegeIds": null},
        {"id": "455001", "parentId": "455000", "name": "role_role_add_option_netView_value", "relatedPrivilegeIds": null},
        {"id": "455002", "parentId": "455000", "name": "role_role_add_option_netHandle_value", "relatedPrivilegeIds": ["455001"]},
        {"id": "456000", "parentId": "18", "name": "role_role_add_option_vpcHandle_value", "relatedPrivilegeIds": null},
        {"id": "457000", "parentId": "18", "name": "vpc_term_deployService_label", "relatedPrivilegeIds": null},
        {"id": "457001", "parentId": "457000", "name": "role_role_add_option_deployServiceView_value", "relatedPrivilegeIds": null},
        {"id": "457002", "parentId": "457000", "name": "role_role_add_option_deployServiceHandle_value", "relatedPrivilegeIds": ["457001"]},
        {"id": "458000", "parentId": "18", "name": "router_term_router_label", "relatedPrivilegeIds": null},
        {"id": "458001", "parentId": "458000", "name": "role_role_add_option_routerView_value", "relatedPrivilegeIds": null},
        {"id": "458002", "parentId": "458000", "name": "role_role_add_option_routerHandle_value", "relatedPrivilegeIds": ["458001"]},
        {"id": "459000", "parentId": "18", "name": "security_term_SG_label", "relatedPrivilegeIds": null},
        {"id": "459001", "parentId": "459000", "name": "role_role_add_option_SGView_value", "relatedPrivilegeIds": null},
        {"id": "459002", "parentId": "459000", "name": "role_role_add_option_SGHandle_value", "relatedPrivilegeIds": ["459001"]},
        {"id": "460000", "parentId": "18", "name": "lb_term_vlb_label", "relatedPrivilegeIds": null},
        {"id": "460001", "parentId": "460000", "name": "role_role_add_option_vlbView_value", "relatedPrivilegeIds": null},
        {"id": "460002", "parentId": "460000", "name": "role_role_add_option_vlbHandle_value", "relatedPrivilegeIds": ["460001"]},
        {"id": "461000", "parentId": "18", "name": "vpn_term_vpn_label", "relatedPrivilegeIds": null},
        {"id": "461001", "parentId": "461000", "name": "role_role_add_option_vpnView_value", "relatedPrivilegeIds": null},
        {"id": "461002", "parentId": "461000", "name": "role_role_add_option_vpnHandle_value", "relatedPrivilegeIds": ["461001"]},
        {"id": "501000", "parentId": "51", "name": "role_role_add_option_snapView_value", "relatedPrivilegeIds": null},
        {"id": "502000", "parentId": "51", "name": "role_role_add_option_snapHandle_value", "relatedPrivilegeIds": ["501000"]},
        {"id": "601000", "parentId": "7", "name": "resource_term_AZ_label", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "601001", "parentId": "601000", "name": "role_role_add_option_AZView_value", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "601002", "parentId": "601000", "name": "role_role_add_option_AZHandle_value", "relatedPrivilegeIds": ["601001", "605001", "605002"]},
        {"id": "602000", "parentId": "7", "name": "resource_term_netPool_label", "relatedPrivilegeIds": ["605001", "605002", "619000"]},
        {"id": "602001", "parentId": "602000", "name": "role_role_add_option_netPoolView_value", "relatedPrivilegeIds": ["605001", "605002", "619000"]},
        {"id": "602002", "parentId": "602000", "name": "role_role_add_option_netPoolHandle_value", "relatedPrivilegeIds": ["602001", "605001", "605002", "619000"]},
        {"id": "603000", "parentId": "7", "name": "resource_term_serverPool_label", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "603001", "parentId": "603000", "name": "role_role_add_option_serverPoolView_value", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "603002", "parentId": "603000", "name": "role_role_add_option_serverPoolHandle_value", "relatedPrivilegeIds": ["603001", "605001", "605002"]},
        {"id": "604000", "parentId": "7", "name": "resource_term_storagePool_label", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "604001", "parentId": "604000", "name": "role_role_add_option_storagePoolView_value", "relatedPrivilegeIds": ["605001", "605002"]},
        {"id": "604002", "parentId": "604000", "name": "role_role_add_option_storagePoolHandle_value", "relatedPrivilegeIds": ["604001", "605001", "605002"]},
        {"id": "605000", "parentId": "7", "name": "resource_term_zone_label", "relatedPrivilegeIds": null},
        {"id": "605001", "parentId": "605000", "name": "role_role_add_option_zoneView_value", "relatedPrivilegeIds": null},
        {"id": "605002", "parentId": "605000", "name": "role_role_add_option_zoneHandle_value", "relatedPrivilegeIds": ["605001"]},
        {"id": "607000", "parentId": "21", "name": "role_role_add_option_clusterView_value", "relatedPrivilegeIds": ["106001", "613000"]},
        {"id": "608000", "parentId": "21", "name": "role_role_add_option_clusterHandle_value", "relatedPrivilegeIds": ["607000", "106001", "613000"]},
        {"id": "609000", "parentId": "22", "name": "role_role_add_option_vmDiskView_value", "relatedPrivilegeIds": null},
        {"id": "610000", "parentId": "22", "name": "role_role_add_option_vmDiskHandle_value", "relatedPrivilegeIds": ["609000"]},
        {"id": "611000", "parentId": "23", "name": "role_role_add_option_hostView_value", "relatedPrivilegeIds": ["106001"]},
        {"id": "612000", "parentId": "23", "name": "role_role_add_option_hostHandle_value", "relatedPrivilegeIds": ["611000"]},
        {"id": "613000", "parentId": "24", "name": "role_role_add_option_hypervisorView_value", "relatedPrivilegeIds": null},
        {"id": "614000", "parentId": "24", "name": "role_role_add_option_hypervisorHandle_value", "relatedPrivilegeIds": ["613000"]},
        {"id": "615000", "parentId": "10", "name": "role_role_add_option_advance_value", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "616000", "parentId": "10", "name": "role_role_add_option_basic_value", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "617000", "parentId": "10", "name": "common_term_create_button", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "618000", "parentId": "10", "name": "common_term_delete_button", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "619000", "parentId": "10", "name": "common_term_check_button", "relatedPrivilegeIds": ["607000", "106001", "107000", "306000", "106001", "304002", "613000", "16"]},
        {"id": "620000", "parentId": "10", "name": "vm_term_vnc_button", "relatedPrivilegeIds": ["619000", "607000", "106001", "107000", "306000", "304002", "613000", "16"]},
        {"id": "801000", "parentId": "42", "name": "role_role_add_option_tagView_value", "relatedPrivilegeIds": null},
        {"id": "802000", "parentId": "42", "name": "role_role_add_option_tagHandle_value", "relatedPrivilegeIds": ["801000"]},
        {"id": "999999", "parentId": "0", "name": "role_role_add_option_FusionComputeView_value", "relatedPrivilegeIds": null}
    ];

    var roleData = {
        "roleList": [
            {
                "id": "3",
                "name": "usermanager",
                "type": "SERVICE_ROLE",
                "description": "role_role_view_para_desc_content_orgmanager_value",
                "defaultRole" : true,
                "operation": "",
                "privilegeInfo": null
            },
            {
                "id": "5",
                "name": "user",
                "type": "SERVICE_ROLE",
                "description": "role_role_view_para_desc_content_user_value",
                "defaultRole" : false,
                "operation": "",
                "privilegeInfo": null
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 2
    };

    var azList = [
        {
            id: "AZ1",
            name: "AZ1",
            description: "这是AZ1"
        },
        {
            id: "AZ2",
            name: "AZ2",
            description: "这是AZ2"
        },
        {
            id: "AZ3",
            name: "AZ3",
            description: "这是AZ3"
        },
        {
            id: "AZ4",
            name: "AZ4",
            description: "这是AZ4"
        }
    ];
    var azInfos = [
        {
            azId: "AZ1",
            azName: "AZ1",
            azDesc: "这是AZ1"
        },
        {
            azId: "AZ2",
            azName: "AZ2",
            azDesc: "这是AZ2"
        },
        {
            azId: "AZ5",
            azName: "AZ5",
            azDesc: "这是AZ5"
        },
        {
            azId: "AZ4",
            azName: "AZ4",
            azDesc: "这是AZ4"
        }
    ];


    var memberList = [
        {
            id: "user3",
            name: "xzy",
            roleList: [
                {"id": "role1", "name": "admin"},
                {"id": "role2", "name": "user"}
            ]
        },
        {
            id: "user4",
            name: "zzb",
            roleList: [
                {"id": "role1", "name": "admin"},
                {"id": "role2", "name": "user"}
            ]
        }
    ]

    var privilegeList = {"privilegeList": leftTreeData1}
    fixture({
        "GET /uportal/user/query": function (request, response) {
            var curPage = request.data.curPage;
            var displayLength = request.data.displayLength;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.totalRecords = userData.userList.length;
            res.userListRes = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < userData.userList.length; index++) {
                res.userListRes.push(userData.userList[index])
            }
            response(200, "success", res, {})
        },

        "GET /uportal/user/query/{id}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in userData.userList) {
                var user = userData.userList[index];
                if (user.id === id) {
                    res = user;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        "PUT /uportal/user/modify/{id}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in userData.userList) {
                var user = userData.userList[index];
                if (user.id === id) {
                    res = user;
                    break;
                }
            }
            res.phone = request.data.phone;
            res.email = request.data.email;
            response(200, "success", res, {})
        },
        "POST /uportal/user/create": function (request, response) {
            var id = "" + (userData.userList.length + 1);
            var name = request.data.name;
            var password = request.data.password;
            var confirmPassword = request.data.confirmPassword;
            var phone = request.data.phone;
            var email = request.data.email;
            var createTime = Date.now();
            var description = request.data.description;
            var user = {
                "id": id,
                "name": name,
                "phone": phone,
                "email": email,
                "role": "role1",
                "domainType": "本地认证",
                "lockState": "解锁",
                "userLocked": false,
                "onlineState": "在线",
                "createTime": createTime,
                "startDate": "2014-1-17",
                "endDate": "2014-1-18",
                "startTime": "12:20:30",
                "endTime": "12:20:50",
                "ipAddress": "192.168.26.42",
                "description": "这是一个管理员用户",
                "operation": ""
            };
            userData.userList.push(user);
            response(200, "success", {}, {})
        },

        "GET /uportal/org/query": function (request, response) {
            var curPage = request.data.curPage;
            var displayLength = request.data.displayLength;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.totalRecords = userData.userList.length;
            res.vdcListRes = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < orgData.vdcList.length; index++) {
                res.vdcListRes.push(orgData.vdcList[index])
            }
            response(200, "success", res, {})
        },

        "GET /goku/rest/v1.5/vdcs?start=0&limit=10": function (request, response) {
            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = orgData.vdcList.length;
            res.vdcList = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < orgData.vdcList.length; index++) {
                res.vdcList.push(orgData.vdcList[index])
            }
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/roles/SYSTEM_ROLE/privileges": function (request, response) {
            response(200, "success", privilegeList, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/roles/SERVICE_ROLE/privileges": function (request, response) {
            response(200, "success", privilegeList, {});
        },
        "GET /goku/rest/v1.5/{vdc_id}/roles?start=0&limit=10": function (request, response) {
            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = roleData.roleList.length;
            res.roleList = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < roleData.roleList.length; index++) {
                res.roleList.push(roleData.roleList[index])
            }
            response(200, "success", res, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/roles?start=0&limit=10&roleName={name}": function (request, response) {
            var name = request.data && request.data.roleName;

            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = roleData.roleList.length;
            res.roleList = [];

            var tmpRole = roleData.roleList[0];
            tmpRole.name = name;
            res.roleList.push(tmpRole)
            response(200, "success", res, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/roles?start=0&limit=10&roleType=SYSTEM_ROLE": function (request, response) {
            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = roleData.roleList.length;
            res.roleList = [];

            var tmpRole = null;
            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < roleData.roleList.length; index++) {
                tmpRole = roleData.roleList[index];
                if (tmpRole && tmpRole.type && ('SYSTEM_ROLE'==tmpRole.type)){
                    res.roleList.push(tmpRole);
                }
            }
            response(200, "success", res, {})
        },

        "GET /goku/rest/v1.5/{vdc_id}/roles?start=0&limit=10&type=SERVICE_ROLE": function (request, response) {
            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = roleData.roleList.length;
            res.roleList = [];

            var tmpRole = null;
            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < roleData.roleList.length; index++) {
                tmpRole = roleData.roleList[index];
                if (tmpRole && tmpRole.type && ('SERVICE_ROLE'==tmpRole.type)){
                    res.roleList.push(tmpRole);
                }
            }
            response(200, "success", res, {})
        },

        "POST /goku/rest/v1.5/{vdc_id}/roles": function (request, response) {
            var id = "" + (roleData.roleList.length + 1);
            var name = request.data.roleName;
            var description = request.data.roleDesc;
            var role = {
                "id": id,
                "name": name,
                "type": request.data.roleType,
                "desc": description,
                "operation": "",
                "privilegeList": request.data.privilegeList
            };
            roleData.roleList.push(role);
            response(200, "success", {}, {})
        },
        "POST /uportal/role/modify/{id}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in roleData.roleList) {
                var role = roleData.roleList[index];
                if (role.id === id) {
                    res = role;
                    break;
                }
            }
            res.name = request.data.name;
            res.description = request.data.description;
            response(200, "success", res, {})
        },

        "PUT /goku/rest/v1.5/{vdc_id}/roles/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in roleData.roleList) {
                var item = roleData.roleList[index];
                if (item.id == id) {
                    item.desc = original.data.roleDesc
                    item.privilegeInfo = original.data.privilegeInfo;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        "DELETE /goku/rest/v1.5/{vdc_id}/roles/{id}":function(original, response){
            var id = fixture.getId(original);
            response(200, "success", {}, {});
        },

        "GET /goku/rest/v1.5/{vdc_id}/roles/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in roleData.roleList) {
                var item = roleData.roleList[index];
                if (item.id == id) {
                    var role = {};
                    role.id = item.id;
                    role.name = item.name;
                    role.type = item.type;
                    role.description = item.desc;
                    if(id == "3"){
                        role.privilegeInfo = leftTreeData1;
                    }
                    res.roleInfo = role;
                    res.userList = userData.userList;
                    break;
                }
            }
            response(200, "success", res, {})
        }
    });

    return fixture;
});