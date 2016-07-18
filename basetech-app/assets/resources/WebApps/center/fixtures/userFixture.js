define(["can/util/fixture/fixture"], function (fixture) {
    userData = {
        "total": 2,
        "userList": [
            {
                "id": "2",
                "name": "geadmin",
                "userType": "NATIVE_USER",
                "createTime": "2014-09-15 12:39:54 UTC+08:00",
                "onLineStatus": "OFFLINE",
                "lockStatus": "UNLOCKED",
                "defaultUser": true,
                "email": null,
                "phoneNumber": null,
                "description": "default user",
                "loginVdcId": "0",
                "vdcId": "1",
                "userRightType": null,
                "roleList": [
                    {"id": "6", "name": "vdcmanager", "type": "SERVICE_ROLE", "securityRoleType": null, "defaultRole": true, "description": "role_role_view_para_desc_content_orgmanager_value", "vdcId": null}
                ]
            },
            {
                "id": "1",
                "name": "admin",
                "userType": "NATIVE_USER",
                "createTime": "2014-09-15 12:39:54 UTC+08:00",
                "onLineStatus": "OFFLINE",
                "lockStatus": "UNLOCKED",
                "defaultUser": true,
                "email": null,
                "phoneNumber": null,
                "description": "default user",
                "loginVdcId": "0",
                "vdcId": "1",
                "userRightType": null,
                "roleList": [
                    {"id": "6", "name": "vdcmanager", "type": "SERVICE_ROLE", "securityRoleType": null, "defaultRole": true, "description": "role_role_view_para_desc_content_orgmanager_value", "vdcId": null},
                    {"id": "5", "name": "user", "type": "SERVICE_ROLE", "securityRoleType": null, "defaultRole": true, "description": "role_role_view_para_desc_content_user_value", "vdcId": null}
                ]
            }
        ]
    };
    var usersDetails={
        "1": {"userInfo":{"id":"1","name":"admin","userType":"NATIVE_USER","createTime":null,"onLineStatus":"OFFLINE","lockStatus":"UNLOCKED","defaultUser":true,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":"0","vdcId":null,"userRightType":"SYSTEM_ADMIN"},"roleList":[{"id":"1","name":"administrator","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_admin_value","vdcId":null}],"controlInfo":{"startDate":null,"endDate":null,"startTime":null,"endTime":null,"ipConfigType":"IP_ADDRESS","ipRange":null}},
        "2": {"userInfo":{"id":"2","name":"geadmin","userType":"NATIVE_USER","createTime":null,"onLineStatus":"OFFLINE","lockStatus":"UNLOCKED","defaultUser":true,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":"0","vdcId":null,"userRightType":"SYSTEM_USER"},"roleList":[{"id":"3","name":"auditor","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_auditor_value","vdcId":null}],"controlInfo":{"startDate":null,"endDate":null,"startTime":null,"endTime":null,"ipConfigType":"IP_ADDRESS","ipRange":null}}

    }
    var roleTypes={
        "total":3,
        "roleList":[
            {
                "id":"3","name":"auditor","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_auditor_value","vdcId":"1"
            },
            {
                "id":"2","name":"operator","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_operator_value","vdcId":"1"
            },
            {
                "id":"1","name":"administrator","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_admin_value","vdcId":"1"
            }
        ]
    }
    var vdcRole={
        "1":{"total":2,"roleList":[{"id":"6","name":"vdcmanager","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_orgmanager_value","vdcId":null},{"id":"5","name":"user","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_user_value","vdcId":null}]},
        "2":{"total":1,"roleList":[{"id":"6","name":"vdcmanager","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_orgmanager_value","vdcId":null}]}
    }
    var domainList = {
        "domainList":[
            {
                "domainId":"e4dd39ff-789b-44f6-9cc9-59ae75fdd0ae",
                "parentId":null,"domainName":"domian_loacl_1",
                "createTime":"2014-09-23 07:01:16.329",
                "domainDesc":null,
                "hasPrivelegeOnDomain":true
            }
        ]
    }


    var domainUser = {
        "userOnDomain": [
            {
                "userId": "1",
                "userName": "vdcManager",
                "createTime": "2014-1-17",
                "domainPrivileges": [
                    {
                        "id": "pri1",
                        "name": "user management"
                    },
                    {
                        "id": "pri2",
                        "name": "role management"
                    }
                ]
            },
            {
                "userId": "3",
                "userName": "user",
                "createTime": "2014-5-17",
                "domainPrivileges": [
                    {
                        "id": "pri1",
                        "name": "user management"
                    }
                ]
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "total": 2
    };
    var userCanAddToDomain = {
        "userOnDomain": [
            {
                "userId": "1",
                "userName": "vdcManager",
                "userDesc": "VDC manager"
            },
            {
                "userId": "3",
                "userName": "user",
                "userDesc": "VDC user"
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "total": 2
    };

    var domainUserPrivilege = [
        {
            "id": "p1",
            "name": "create VPC"
        },
        {
            "id": "p2",
            "name": "Modify VDC"
        },
        {
            "id": "p3",
            "name": "Modifying the virtual machine"
        },
        {
            "id": "p4",
            "name": "Modifying the virtual machine"
        }
    ]
    var orgData = {
        "vdcList":[
            {
                "id":"1","name":"FMVDC_SZ01","createTime":"",
                "defaultVdc":false,"description":"","allQuota":true,
                "quotaInfo":null,"quotaUsage":null
            },
            {
                "id":"2","name":"FMVDC_XA01","createTime":"",
                "defaultVdc":false,"description":"","allQuota":true,
                "quotaInfo":null,"quotaUsage":null
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };
    var orgDetails = {
        "2":{"vdcInfo":{"id":"2","name":"FMVDC_XA01","createTime":"2014-09-15 08:44:54","defaultVdc":false,"description":"","allQuota":true,"quotaInfo":[{"quotaName":"CPU","limit":-1},{"quotaName":"MEMORY","limit":-1},{"quotaName":"STORAGE","limit":-1},{"quotaName":"VPC","limit":-1},{"quotaName":"EIP","limit":-1},{"quotaName":"SEG","limit":-1},{"quotaName":"VM","limit":-1}],"quotaUsage":[{"quotaName":"CPU","value":4},{"quotaName":"MEMORY","value":4096},{"quotaName":"STORAGE","value":12},{"quotaName":"VPC","value":5},{"quotaName":"EIP","value":11},{"quotaName":"SEG","value":7},{"quotaName":"VM","value":3}]}},
        "3":{"vdcInfo":{"id":"3","name":"FMVDC_SZ01","createTime":"2014-09-15 11:50:32","defaultVdc":false,"description":"","allQuota":true,"quotaInfo":[{"quotaName":"CPU","limit":-1},{"quotaName":"MEMORY","limit":-1},{"quotaName":"STORAGE","limit":-1},{"quotaName":"VPC","limit":-1},{"quotaName":"EIP","limit":-1},{"quotaName":"SEG","limit":-1},{"quotaName":"VM","limit":-1}],"quotaUsage":[{"quotaName":"CPU","value":16},{"quotaName":"MEMORY","value":17408},{"quotaName":"STORAGE","value":216},{"quotaName":"VPC","value":3},{"quotaName":"EIP","value":6},{"quotaName":"SEG","value":4},{"quotaName":"VM","value":9}]}}
    }

    var roleData = {
        "total":5,
        "roleList":[
            {
                "id":"1","name":"administrator","type":"SYSTEM_ROLE",
                "securityRoleType":null,"defaultRole":true,
                "description":"role_role_view_para_desc_content_admin_value",
                "vdcId":"1"
            },
            {
                "id":"2","name":"operator","type":"SYSTEM_ROLE",
                "securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_operator_value","vdcId":"1"
            },
            {
                "id":"3","name":"auditor","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_auditor_value","vdcId":"1"
            },
            {
                "id":"5","name":"user","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_user_value","vdcId":"1"
            },
            {
                "id":"6","name":"vdcmanager","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_orgmanager_value","vdcId":"1"
            },
            {"id":"e277a3fd-7b69-4550-b87f-14c38efef893","name":"systemadmin","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":false,"description":null,"vdcId":"1"}
        ]
    }
    var roleDetail={
        "1":{"roleInfo":{"id":"1","name":"administrator","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_admin_value","vdcId":null,"privilegeInfo":[{"id":"1","parentId":"0","name":"sys_term_sysConfig_label","relatedPrivilegeIds":null},{"id":"2","parentId":"0","name":"common_term_authorization_label","relatedPrivilegeIds":null},{"id":"3","parentId":"0","name":"server_term_server_label","relatedPrivilegeIds":null},{"id":"5","parentId":"0","name":"common_term_monitor_label","relatedPrivilegeIds":null},{"id":"6","parentId":"0","name":"template_term_template_label","relatedPrivilegeIds":null},{"id":"7","parentId":"0","name":"resource_term_pool_label","relatedPrivilegeIds":null},{"id":"8","parentId":"0","name":"report_term_report_label","relatedPrivilegeIds":null},{"id":"9","parentId":"0","name":"org_term_organization_label","relatedPrivilegeIds":null},{"id":"10","parentId":"0","name":"common_term_vm_label","relatedPrivilegeIds":null},{"id":"12","parentId":"0","name":"log_term_log_label","relatedPrivilegeIds":null},{"id":"13","parentId":"0","name":"service_term_service_label","relatedPrivilegeIds":null},{"id":"15","parentId":"0","name":"cloud_term_cloudPool_label","relatedPrivilegeIds":null},{"id":"16","parentId":"0","name":"task_term_task_label","relatedPrivilegeIds":null},{"id":"18","parentId":"0","name":"vpc_term_vpc_label","relatedPrivilegeIds":null},{"id":"19","parentId":"0","name":"resource_term_ServiceVM_label","relatedPrivilegeIds":null},{"id":"21","parentId":"0","name":"virtual_term_cluster_label","relatedPrivilegeIds":null},{"id":"22","parentId":"0","name":"vm_term_vmDisk_label","relatedPrivilegeIds":null},{"id":"23","parentId":"0","name":"common_term_host_label","relatedPrivilegeIds":null},{"id":"24","parentId":"0","name":"virtual_term_hypervisor_label","relatedPrivilegeIds":null},{"id":"31","parentId":"0","name":"sys_term_desktop_label","relatedPrivilegeIds":null},{"id":"32","parentId":"0","name":"sys_term_topo_label","relatedPrivilegeIds":null},{"id":"34","parentId":"0","name":"device_term_device_label","relatedPrivilegeIds":null},{"id":"42","parentId":"0","name":"cloud_term_tagManage_label","relatedPrivilegeIds":null},{"id":"43","parentId":"0","name":"resource_term_resourceStatistic_label","relatedPrivilegeIds":null},{"id":"51","parentId":"0","name":"vm_term_snaps_label","relatedPrivilegeIds":null},{"id":"102000","parentId":"2","name":"role_term_role_label","relatedPrivilegeIds":null},{"id":"102001","parentId":"102000","name":"role_role_add_option_roleHandle_value","relatedPrivilegeIds":null},{"id":"102002","parentId":"102000","name":"role_role_add_option_roleView_value","relatedPrivilegeIds":null},{"id":"103000","parentId":"2","name":"user_term_user_label","relatedPrivilegeIds":null},{"id":"103001","parentId":"103000","name":"role_role_add_option_userHandle_value","relatedPrivilegeIds":null},{"id":"103002","parentId":"103000","name":"role_role_add_option_userView_value","relatedPrivilegeIds":null},{"id":"104000","parentId":"2","name":"user_term_pswPolicy_label","relatedPrivilegeIds":null},{"id":"104001","parentId":"104000","name":"role_role_add_option_pswPolicyHandle_value","relatedPrivilegeIds":null},{"id":"104002","parentId":"104000","name":"role_role_add_option_pswPolicyView_value","relatedPrivilegeIds":null},{"id":"105000","parentId":"12","name":"log_term_operation_label","relatedPrivilegeIds":null},{"id":"106000","parentId":"5","name":"alarm_term_alarm_label","relatedPrivilegeIds":null},{"id":"106001","parentId":"106000","name":"role_role_add_option_alarmView_value","relatedPrivilegeIds":null},{"id":"106002","parentId":"106000","name":"role_role_add_option_alarmHandle_value","relatedPrivilegeIds":null},{"id":"107000","parentId":"5","name":"perform_term_monitor_label","relatedPrivilegeIds":null},{"id":"108000","parentId":"9","name":"role_role_add_option_orgHandle_value","relatedPrivilegeIds":null},{"id":"108001","parentId":"9","name":"role_role_add_option_orgView_value","relatedPrivilegeIds":null},{"id":"109000","parentId":"8","name":"role_role_add_option_reportView_value","relatedPrivilegeIds":null},{"id":"110000","parentId":"8","name":"role_role_add_option_reportHandle_value","relatedPrivilegeIds":null},{"id":"111000","parentId":"2","name":"domain_term_domain_label","relatedPrivilegeIds":null},{"id":"111001","parentId":"111000","name":"role_role_add_option_domainHandle_value","relatedPrivilegeIds":null},{"id":"111002","parentId":"111000","name":"role_role_add_option_domainView_value","relatedPrivilegeIds":null},{"id":"201000","parentId":"1","name":"sys_term_backupSet_label","relatedPrivilegeIds":null},{"id":"201001","parentId":"201000","name":"role_role_add_option_backupSetView_value","relatedPrivilegeIds":null},{"id":"201002","parentId":"201000","name":"role_role_add_option_backupSetHandle_value","relatedPrivilegeIds":null},{"id":"202000","parentId":"1","name":"sys_term_comPsw_label","relatedPrivilegeIds":null},{"id":"203000","parentId":"1","name":"sys_term_desktopAddr_label","relatedPrivilegeIds":null},{"id":"204000","parentId":"1","name":"sys_term_license_label","relatedPrivilegeIds":null},{"id":"204001","parentId":"204000","name":"role_role_add_option_licenseView_value","relatedPrivilegeIds":null},{"id":"204002","parentId":"204000","name":"role_role_add_option_licenseHandle_value","relatedPrivilegeIds":null},{"id":"207000","parentId":"1","name":"sys_term_time_label","relatedPrivilegeIds":null},{"id":"207001","parentId":"207000","name":"role_role_add_option_timeView_value","relatedPrivilegeIds":null},{"id":"207002","parentId":"207000","name":"role_role_add_option_timeHandle_value","relatedPrivilegeIds":null},{"id":"209000","parentId":"1","name":"sys_term_snmp_label","relatedPrivilegeIds":null},{"id":"209001","parentId":"209000","name":"role_role_add_option_snmpView_value","relatedPrivilegeIds":null},{"id":"209002","parentId":"209000","name":"role_role_add_option_snmpHandle_value","relatedPrivilegeIds":null},{"id":"210000","parentId":"1","name":"sys_term_timeout_label","relatedPrivilegeIds":null},{"id":"210001","parentId":"210000","name":"role_role_add_option_timeoutHandle_value","relatedPrivilegeIds":null},{"id":"210002","parentId":"210000","name":"role_role_add_option_timeoutView_value","relatedPrivilegeIds":null},{"id":"211000","parentId":"19","name":"role_role_add_option_ServiceVMView_value","relatedPrivilegeIds":null},{"id":"212000","parentId":"19","name":"role_role_add_option_ServiceVMHandle_value","relatedPrivilegeIds":null},{"id":"213000","parentId":"1","name":"sys_term_archives_label","relatedPrivilegeIds":null},{"id":"214000","parentId":"1","name":"sys_term_intervalStartStop_label","relatedPrivilegeIds":null},{"id":"214001","parentId":"214000","name":"role_role_add_option_intervalStartStopView_value","relatedPrivilegeIds":null},{"id":"214002","parentId":"214000","name":"role_role_add_option_intervalStartStopHandle_value","relatedPrivilegeIds":null},{"id":"215000","parentId":"1","name":"sys_term_disasterCfg_label","relatedPrivilegeIds":null},{"id":"215001","parentId":"215000","name":"role_role_add_option_disasterCfgView_value","relatedPrivilegeIds":null},{"id":"215002","parentId":"215000","name":"role_role_add_option_disasterCfgHandle_value","relatedPrivilegeIds":null},{"id":"216000","parentId":"1","name":"sys_term_machineAccountMgmt_label","relatedPrivilegeIds":null},{"id":"216001","parentId":"216000","name":"role_role_add_option_machineAccountView_value","relatedPrivilegeIds":null},{"id":"216002","parentId":"216000","name":"role_role_add_option_machineAccountHandle_value","relatedPrivilegeIds":null},{"id":"304000","parentId":"15","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"304001","parentId":"304000","name":"role_role_add_option_AZHandle_value","relatedPrivilegeIds":null},{"id":"304002","parentId":"304000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"305000","parentId":"15","name":"role_role_add_option_cloudPoolHandle_value","relatedPrivilegeIds":null},{"id":"306000","parentId":"15","name":"role_role_add_option_cloudPoolView_value","relatedPrivilegeIds":null},{"id":"307000","parentId":"13","name":"role_role_add_option_serviceHandle_value","relatedPrivilegeIds":null},{"id":"308000","parentId":"13","name":"role_role_add_option_serviceView_value","relatedPrivilegeIds":null},{"id":"309000","parentId":"6","name":"template_term_ipBandwidth_label","relatedPrivilegeIds":null},{"id":"309001","parentId":"309000","name":"role_role_add_option_ipBandwidthView_value","relatedPrivilegeIds":null},{"id":"309002","parentId":"309000","name":"role_role_add_option_ipBandwidthHandle_value","relatedPrivilegeIds":null},{"id":"310000","parentId":"6","name":"template_term_iso_label","relatedPrivilegeIds":null},{"id":"310001","parentId":"310000","name":"role_role_add_option_isoView_value","relatedPrivilegeIds":null},{"id":"310002","parentId":"310000","name":"role_role_add_option_isoHandle_value","relatedPrivilegeIds":null},{"id":"311000","parentId":"6","name":"template_term_script_label","relatedPrivilegeIds":null},{"id":"311001","parentId":"311000","name":"role_role_add_option_scriptView_value","relatedPrivilegeIds":null},{"id":"311002","parentId":"311000","name":"role_role_add_option_scriptHandle_value","relatedPrivilegeIds":null},{"id":"312000","parentId":"6","name":"template_term_app_label","relatedPrivilegeIds":null},{"id":"312001","parentId":"312000","name":"role_role_add_option_appTemplateView_value","relatedPrivilegeIds":null},{"id":"312002","parentId":"312000","name":"role_role_add_option_appTemplateHandle_value","relatedPrivilegeIds":null},{"id":"313000","parentId":"6","name":"template_term_software_label","relatedPrivilegeIds":null},{"id":"313001","parentId":"313000","name":"role_role_add_option_softwareView_value","relatedPrivilegeIds":null},{"id":"313002","parentId":"313000","name":"role_role_add_option_softwareHandle_value","relatedPrivilegeIds":null},{"id":"314000","parentId":"6","name":"template_term_vmLogic_label","relatedPrivilegeIds":null},{"id":"314001","parentId":"314000","name":"role_role_add_option_vmLogicView_value","relatedPrivilegeIds":null},{"id":"314002","parentId":"314000","name":"role_role_add_option_vmLogicHandle_value","relatedPrivilegeIds":null},{"id":"315000","parentId":"6","name":"spec_term_vm_label","relatedPrivilegeIds":null},{"id":"315001","parentId":"315000","name":"role_role_add_option_vmSpecView_value","relatedPrivilegeIds":null},{"id":"315002","parentId":"315000","name":"role_role_add_option_vmSpecHandle_value","relatedPrivilegeIds":null},{"id":"316000","parentId":"6","name":"template_term_vm_label","relatedPrivilegeIds":null},{"id":"316001","parentId":"316000","name":"role_role_add_option_vmTemplateView_value","relatedPrivilegeIds":null},{"id":"316002","parentId":"316000","name":"role_role_add_option_vmTemplateHandle_value","relatedPrivilegeIds":null},{"id":"317000","parentId":"6","name":"spec_term_vpc_label","relatedPrivilegeIds":null},{"id":"317001","parentId":"317000","name":"role_role_add_option_vpcSpecView_value","relatedPrivilegeIds":null},{"id":"317002","parentId":"317000","name":"role_role_add_option_vpcSpecHandle_value","relatedPrivilegeIds":null},{"id":"318000","parentId":"13","name":"service_term_template_label","relatedPrivilegeIds":null},{"id":"318001","parentId":"318000","name":"role_role_add_option_serviceTemplateView_value","relatedPrivilegeIds":null},{"id":"319000","parentId":"13","name":"service_term_catalog_label","relatedPrivilegeIds":null},{"id":"319001","parentId":"319000","name":"role_role_add_option_catalogView_value","relatedPrivilegeIds":null},{"id":"319002","parentId":"319000","name":"role_role_add_option_catalogHandle_value","relatedPrivilegeIds":null},{"id":"320000","parentId":"13","name":"service_term_order_label","relatedPrivilegeIds":null},{"id":"320001","parentId":"320000","name":"role_role_add_option_orderView_value","relatedPrivilegeIds":null},{"id":"320002","parentId":"320000","name":"role_role_add_option_orderHandle_value","relatedPrivilegeIds":null},{"id":"320003","parentId":"13","name":"role_role_add_option_serInstanceView_value","relatedPrivilegeIds":null},{"id":"320004","parentId":"13","name":"role_role_add_option_serInstanceHandle_value","relatedPrivilegeIds":null},{"id":"320005","parentId":"320000","name":"role_role_add_option_orderApprove_value","relatedPrivilegeIds":null},{"id":"321000","parentId":"6","name":"template_term_softDepot_label","relatedPrivilegeIds":null},{"id":"321001","parentId":"321000","name":"role_role_add_option_softDepotView_value","relatedPrivilegeIds":null},{"id":"401000","parentId":"3","name":"role_role_add_option_serverView_value","relatedPrivilegeIds":null},{"id":"401001","parentId":"3","name":"role_role_add_option_serverHandle_value","relatedPrivilegeIds":null},{"id":"402000","parentId":"34","name":"role_role_add_option_deviceView_value","relatedPrivilegeIds":null},{"id":"403000","parentId":"34","name":"role_role_add_option_deviceHandle_value","relatedPrivilegeIds":null},{"id":"404000","parentId":"34","name":"device_term_FusionStorage_label","relatedPrivilegeIds":null},{"id":"404001","parentId":"404000","name":"role_role_add_option_FusionStorageView_value","relatedPrivilegeIds":null},{"id":"404002","parentId":"404000","name":"role_role_add_option_FusionStorageHandle_value","relatedPrivilegeIds":null},{"id":"451000","parentId":"18","name":"aspf_term_aspf_label","relatedPrivilegeIds":null},{"id":"451001","parentId":"451000","name":"role_role_add_option_aspfView_value","relatedPrivilegeIds":null},{"id":"451002","parentId":"451000","name":"role_role_add_option_aspfHandle_value","relatedPrivilegeIds":null},{"id":"452000","parentId":"18","name":"nat_term_dnat_label","relatedPrivilegeIds":null},{"id":"452001","parentId":"452000","name":"role_role_add_option_dnatView_value","relatedPrivilegeIds":null},{"id":"452002","parentId":"452000","name":"role_role_add_option_dnatHandle_value","relatedPrivilegeIds":null},{"id":"453000","parentId":"18","name":"eip_term_eip_label","relatedPrivilegeIds":null},{"id":"453001","parentId":"453000","name":"role_role_add_option_eipView_value","relatedPrivilegeIds":null},{"id":"453002","parentId":"453000","name":"role_role_add_option_eipHandle_value","relatedPrivilegeIds":null},{"id":"454000","parentId":"18","name":"acl_term_acl_label","relatedPrivilegeIds":null},{"id":"454001","parentId":"454000","name":"role_role_add_option_aclView_value","relatedPrivilegeIds":null},{"id":"454002","parentId":"454000","name":"role_role_add_option_aclHandle_value","relatedPrivilegeIds":null},{"id":"455000","parentId":"18","name":"vpc_term_net_label","relatedPrivilegeIds":null},{"id":"455001","parentId":"455000","name":"role_role_add_option_netView_value","relatedPrivilegeIds":null},{"id":"455002","parentId":"455000","name":"role_role_add_option_netHandle_value","relatedPrivilegeIds":null},{"id":"456000","parentId":"18","name":"role_role_add_option_vpcHandle_value","relatedPrivilegeIds":null},{"id":"457000","parentId":"18","name":"vpc_term_deployService_label","relatedPrivilegeIds":null},{"id":"457001","parentId":"457000","name":"role_role_add_option_deployServiceView_value","relatedPrivilegeIds":null},{"id":"457002","parentId":"457000","name":"role_role_add_option_deployServiceHandle_value","relatedPrivilegeIds":null},{"id":"458000","parentId":"18","name":"router_term_router_label","relatedPrivilegeIds":null},{"id":"458001","parentId":"458000","name":"role_role_add_option_routerView_value","relatedPrivilegeIds":null},{"id":"458002","parentId":"458000","name":"role_role_add_option_routerHandle_value","relatedPrivilegeIds":null},{"id":"459000","parentId":"18","name":"security_term_SG_label","relatedPrivilegeIds":null},{"id":"459001","parentId":"459000","name":"role_role_add_option_SGView_value","relatedPrivilegeIds":null},{"id":"459002","parentId":"459000","name":"role_role_add_option_SGHandle_value","relatedPrivilegeIds":null},{"id":"460000","parentId":"18","name":"lb_term_vlb_label","relatedPrivilegeIds":null},{"id":"460001","parentId":"460000","name":"role_role_add_option_vlbView_value","relatedPrivilegeIds":null},{"id":"460002","parentId":"460000","name":"role_role_add_option_vlbHandle_value","relatedPrivilegeIds":null},{"id":"461000","parentId":"18","name":"vpn_term_vpn_label","relatedPrivilegeIds":null},{"id":"461001","parentId":"461000","name":"role_role_add_option_vpnView_value","relatedPrivilegeIds":null},{"id":"461002","parentId":"461000","name":"role_role_add_option_vpnHandle_value","relatedPrivilegeIds":null},{"id":"501000","parentId":"51","name":"role_role_add_option_snapView_value","relatedPrivilegeIds":null},{"id":"502000","parentId":"51","name":"role_role_add_option_snapHandle_value","relatedPrivilegeIds":null},{"id":"601000","parentId":"7","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"601001","parentId":"601000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"601002","parentId":"601000","name":"role_role_add_option_AZHandle_value","relatedPrivilegeIds":null},{"id":"602000","parentId":"7","name":"resource_term_netPool_label","relatedPrivilegeIds":null},{"id":"602001","parentId":"602000","name":"role_role_add_option_netPoolView_value","relatedPrivilegeIds":null},{"id":"602002","parentId":"602000","name":"role_role_add_option_netPoolHandle_value","relatedPrivilegeIds":null},{"id":"603000","parentId":"7","name":"resource_term_serverPool_label","relatedPrivilegeIds":null},{"id":"603001","parentId":"603000","name":"role_role_add_option_serverPoolView_value","relatedPrivilegeIds":null},{"id":"603002","parentId":"603000","name":"role_role_add_option_serverPoolHandle_value","relatedPrivilegeIds":null},{"id":"604000","parentId":"7","name":"resource_term_storagePool_label","relatedPrivilegeIds":null},{"id":"604001","parentId":"604000","name":"role_role_add_option_storagePoolView_value","relatedPrivilegeIds":null},{"id":"604002","parentId":"604000","name":"role_role_add_option_storagePoolHandle_value","relatedPrivilegeIds":null},{"id":"605000","parentId":"7","name":"resource_term_zone_label","relatedPrivilegeIds":null},{"id":"605001","parentId":"605000","name":"role_role_add_option_zoneView_value","relatedPrivilegeIds":null},{"id":"605002","parentId":"605000","name":"role_role_add_option_zoneHandle_value","relatedPrivilegeIds":null},{"id":"607000","parentId":"21","name":"role_role_add_option_clusterView_value","relatedPrivilegeIds":null},{"id":"608000","parentId":"21","name":"role_role_add_option_clusterHandle_value","relatedPrivilegeIds":null},{"id":"609000","parentId":"22","name":"role_role_add_option_vmDiskView_value","relatedPrivilegeIds":null},{"id":"610000","parentId":"22","name":"role_role_add_option_vmDiskHandle_value","relatedPrivilegeIds":null},{"id":"611000","parentId":"23","name":"role_role_add_option_hostView_value","relatedPrivilegeIds":null},{"id":"612000","parentId":"23","name":"role_role_add_option_hostHandle_value","relatedPrivilegeIds":null},{"id":"613000","parentId":"24","name":"role_role_add_option_hypervisorView_value","relatedPrivilegeIds":null},{"id":"614000","parentId":"24","name":"role_role_add_option_hypervisorHandle_value","relatedPrivilegeIds":null},{"id":"615000","parentId":"10","name":"role_role_add_option_advance_value","relatedPrivilegeIds":null},{"id":"616000","parentId":"10","name":"role_role_add_option_basic_value","relatedPrivilegeIds":null},{"id":"617000","parentId":"10","name":"common_term_create_button","relatedPrivilegeIds":null},{"id":"618000","parentId":"10","name":"common_term_delete_button","relatedPrivilegeIds":null},{"id":"619000","parentId":"10","name":"common_term_check_button","relatedPrivilegeIds":null},{"id":"620000","parentId":"10","name":"vm_term_vnc_button","relatedPrivilegeIds":null},{"id":"801000","parentId":"42","name":"role_role_add_option_tagView_value","relatedPrivilegeIds":null},{"id":"802000","parentId":"42","name":"role_role_add_option_tagHandle_value","relatedPrivilegeIds":null},{"id":"999999","parentId":"0","name":"role_role_add_option_FusionComputeView_value","relatedPrivilegeIds":null},{"id":"323000","parentId":"15","name":"resource_term_externalNets_label","relatedPrivilegeIds":null},{"id":"323002","parentId":"323000","name":"role_role_add_option_externalNetView_value","relatedPrivilegeIds":null}]},"userList":[{"id":"24","name":"tte","userType":null,"createTime":"2014-09-20 08:39:00 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"22","name":"Ohio","userType":null,"createTime":"2014-09-19 17:34:03 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"12","name":"zhoulu","userType":null,"createTime":"2014-09-18 14:31:16 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"21","name":"qiuyang","userType":null,"createTime":"2014-09-19 16:56:43 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"6","name":"tianye","userType":null,"createTime":"2014-09-15 19:25:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"16","name":"zhangyajun","userType":null,"createTime":"2014-09-19 14:30:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"10","name":"tabAdmin","userType":null,"createTime":"2014-09-17 12:01:52 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"20","name":"zhangjianmei1","userType":null,"createTime":"2014-09-19 15:11:45 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"1","name":"admin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"23","name":"xqk","userType":null,"createTime":"2014-09-20 08:05:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"5","name":"zhangjianmei","userType":null,"createTime":"2014-09-15 16:19:44 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"19","name":"xz","userType":null,"createTime":"2014-09-19 15:00:34 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"15","name":"caoruntao","userType":null,"createTime":"2014-09-19 12:58:05 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"8","name":"zx","userType":null,"createTime":"2014-09-15 20:09:27 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"17","name":"caoyu","userType":null,"createTime":"2014-09-19 14:56:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null}]},
        "2":{"roleInfo":{"id":"2","name":"operator","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_operator_value","vdcId":null,"privilegeInfo":[{"id":"1","parentId":"0","name":"sys_term_sysConfig_label","relatedPrivilegeIds":null},{"id":"3","parentId":"0","name":"server_term_server_label","relatedPrivilegeIds":null},{"id":"5","parentId":"0","name":"common_term_monitor_label","relatedPrivilegeIds":null},{"id":"6","parentId":"0","name":"template_term_template_label","relatedPrivilegeIds":null},{"id":"7","parentId":"0","name":"resource_term_pool_label","relatedPrivilegeIds":null},{"id":"8","parentId":"0","name":"report_term_report_label","relatedPrivilegeIds":null},{"id":"10","parentId":"0","name":"common_term_vm_label","relatedPrivilegeIds":null},{"id":"12","parentId":"0","name":"log_term_log_label","relatedPrivilegeIds":null},{"id":"13","parentId":"0","name":"service_term_service_label","relatedPrivilegeIds":null},{"id":"15","parentId":"0","name":"cloud_term_cloudPool_label","relatedPrivilegeIds":null},{"id":"16","parentId":"0","name":"task_term_task_label","relatedPrivilegeIds":null},{"id":"18","parentId":"0","name":"vpc_term_vpc_label","relatedPrivilegeIds":null},{"id":"19","parentId":"0","name":"resource_term_ServiceVM_label","relatedPrivilegeIds":null},{"id":"21","parentId":"0","name":"virtual_term_cluster_label","relatedPrivilegeIds":null},{"id":"22","parentId":"0","name":"vm_term_vmDisk_label","relatedPrivilegeIds":null},{"id":"23","parentId":"0","name":"common_term_host_label","relatedPrivilegeIds":null},{"id":"24","parentId":"0","name":"virtual_term_hypervisor_label","relatedPrivilegeIds":null},{"id":"31","parentId":"0","name":"sys_term_desktop_label","relatedPrivilegeIds":null},{"id":"32","parentId":"0","name":"sys_term_topo_label","relatedPrivilegeIds":null},{"id":"34","parentId":"0","name":"device_term_device_label","relatedPrivilegeIds":null},{"id":"42","parentId":"0","name":"cloud_term_tagManage_label","relatedPrivilegeIds":null},{"id":"43","parentId":"0","name":"resource_term_resourceStatistic_label","relatedPrivilegeIds":null},{"id":"51","parentId":"0","name":"vm_term_snaps_label","relatedPrivilegeIds":null},{"id":"105000","parentId":"12","name":"log_term_operation_label","relatedPrivilegeIds":null},{"id":"106000","parentId":"5","name":"alarm_term_alarm_label","relatedPrivilegeIds":null},{"id":"106001","parentId":"106000","name":"role_role_add_option_alarmView_value","relatedPrivilegeIds":null},{"id":"106002","parentId":"106000","name":"role_role_add_option_alarmHandle_value","relatedPrivilegeIds":null},{"id":"107000","parentId":"5","name":"perform_term_monitor_label","relatedPrivilegeIds":null},{"id":"109000","parentId":"8","name":"role_role_add_option_reportView_value","relatedPrivilegeIds":null},{"id":"110000","parentId":"8","name":"role_role_add_option_reportHandle_value","relatedPrivilegeIds":null},{"id":"201000","parentId":"1","name":"sys_term_backupSet_label","relatedPrivilegeIds":null},{"id":"201001","parentId":"201000","name":"role_role_add_option_backupSetView_value","relatedPrivilegeIds":null},{"id":"201002","parentId":"201000","name":"role_role_add_option_backupSetHandle_value","relatedPrivilegeIds":null},{"id":"202000","parentId":"1","name":"sys_term_comPsw_label","relatedPrivilegeIds":null},{"id":"203000","parentId":"1","name":"sys_term_desktopAddr_label","relatedPrivilegeIds":null},{"id":"204000","parentId":"1","name":"sys_term_license_label","relatedPrivilegeIds":null},{"id":"204001","parentId":"204000","name":"role_role_add_option_licenseView_value","relatedPrivilegeIds":null},{"id":"204002","parentId":"204000","name":"role_role_add_option_licenseHandle_value","relatedPrivilegeIds":null},{"id":"207000","parentId":"1","name":"sys_term_time_label","relatedPrivilegeIds":null},{"id":"207001","parentId":"207000","name":"role_role_add_option_timeView_value","relatedPrivilegeIds":null},{"id":"207002","parentId":"207000","name":"role_role_add_option_timeHandle_value","relatedPrivilegeIds":null},{"id":"209000","parentId":"1","name":"sys_term_snmp_label","relatedPrivilegeIds":null},{"id":"209001","parentId":"209000","name":"role_role_add_option_snmpView_value","relatedPrivilegeIds":null},{"id":"209002","parentId":"209000","name":"role_role_add_option_snmpHandle_value","relatedPrivilegeIds":null},{"id":"210000","parentId":"1","name":"sys_term_timeout_label","relatedPrivilegeIds":null},{"id":"210001","parentId":"210000","name":"role_role_add_option_timeoutHandle_value","relatedPrivilegeIds":null},{"id":"210002","parentId":"210000","name":"role_role_add_option_timeoutView_value","relatedPrivilegeIds":null},{"id":"211000","parentId":"19","name":"role_role_add_option_ServiceVMView_value","relatedPrivilegeIds":null},{"id":"212000","parentId":"19","name":"role_role_add_option_ServiceVMHandle_value","relatedPrivilegeIds":null},{"id":"213000","parentId":"1","name":"sys_term_archives_label","relatedPrivilegeIds":null},{"id":"214000","parentId":"1","name":"sys_term_intervalStartStop_label","relatedPrivilegeIds":null},{"id":"214001","parentId":"214000","name":"role_role_add_option_intervalStartStopView_value","relatedPrivilegeIds":null},{"id":"214002","parentId":"214000","name":"role_role_add_option_intervalStartStopHandle_value","relatedPrivilegeIds":null},{"id":"215000","parentId":"1","name":"sys_term_disasterCfg_label","relatedPrivilegeIds":null},{"id":"215001","parentId":"215000","name":"role_role_add_option_disasterCfgView_value","relatedPrivilegeIds":null},{"id":"215002","parentId":"215000","name":"role_role_add_option_disasterCfgHandle_value","relatedPrivilegeIds":null},{"id":"216000","parentId":"1","name":"sys_term_machineAccountMgmt_label","relatedPrivilegeIds":null},{"id":"216001","parentId":"216000","name":"role_role_add_option_machineAccountView_value","relatedPrivilegeIds":null},{"id":"216002","parentId":"216000","name":"role_role_add_option_machineAccountHandle_value","relatedPrivilegeIds":null},{"id":"304000","parentId":"15","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"304001","parentId":"304000","name":"role_role_add_option_AZHandle_value","relatedPrivilegeIds":null},{"id":"304002","parentId":"304000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"305000","parentId":"15","name":"role_role_add_option_cloudPoolHandle_value","relatedPrivilegeIds":null},{"id":"306000","parentId":"15","name":"role_role_add_option_cloudPoolView_value","relatedPrivilegeIds":null},{"id":"307000","parentId":"13","name":"role_role_add_option_serviceHandle_value","relatedPrivilegeIds":null},{"id":"308000","parentId":"13","name":"role_role_add_option_serviceView_value","relatedPrivilegeIds":null},{"id":"309000","parentId":"6","name":"template_term_ipBandwidth_label","relatedPrivilegeIds":null},{"id":"309001","parentId":"309000","name":"role_role_add_option_ipBandwidthView_value","relatedPrivilegeIds":null},{"id":"309002","parentId":"309000","name":"role_role_add_option_ipBandwidthHandle_value","relatedPrivilegeIds":null},{"id":"310000","parentId":"6","name":"template_term_iso_label","relatedPrivilegeIds":null},{"id":"310001","parentId":"310000","name":"role_role_add_option_isoView_value","relatedPrivilegeIds":null},{"id":"310002","parentId":"310000","name":"role_role_add_option_isoHandle_value","relatedPrivilegeIds":null},{"id":"311000","parentId":"6","name":"template_term_script_label","relatedPrivilegeIds":null},{"id":"311001","parentId":"311000","name":"role_role_add_option_scriptView_value","relatedPrivilegeIds":null},{"id":"311002","parentId":"311000","name":"role_role_add_option_scriptHandle_value","relatedPrivilegeIds":null},{"id":"312000","parentId":"6","name":"template_term_app_label","relatedPrivilegeIds":null},{"id":"312001","parentId":"312000","name":"role_role_add_option_appTemplateView_value","relatedPrivilegeIds":null},{"id":"312002","parentId":"312000","name":"role_role_add_option_appTemplateHandle_value","relatedPrivilegeIds":null},{"id":"313000","parentId":"6","name":"template_term_software_label","relatedPrivilegeIds":null},{"id":"313001","parentId":"313000","name":"role_role_add_option_softwareView_value","relatedPrivilegeIds":null},{"id":"313002","parentId":"313000","name":"role_role_add_option_softwareHandle_value","relatedPrivilegeIds":null},{"id":"314000","parentId":"6","name":"template_term_vmLogic_label","relatedPrivilegeIds":null},{"id":"314001","parentId":"314000","name":"role_role_add_option_vmLogicView_value","relatedPrivilegeIds":null},{"id":"314002","parentId":"314000","name":"role_role_add_option_vmLogicHandle_value","relatedPrivilegeIds":null},{"id":"315000","parentId":"6","name":"spec_term_vm_label","relatedPrivilegeIds":null},{"id":"315001","parentId":"315000","name":"role_role_add_option_vmSpecView_value","relatedPrivilegeIds":null},{"id":"315002","parentId":"315000","name":"role_role_add_option_vmSpecHandle_value","relatedPrivilegeIds":null},{"id":"316000","parentId":"6","name":"template_term_vm_label","relatedPrivilegeIds":null},{"id":"316001","parentId":"316000","name":"role_role_add_option_vmTemplateView_value","relatedPrivilegeIds":null},{"id":"316002","parentId":"316000","name":"role_role_add_option_vmTemplateHandle_value","relatedPrivilegeIds":null},{"id":"317000","parentId":"6","name":"spec_term_vpc_label","relatedPrivilegeIds":null},{"id":"317001","parentId":"317000","name":"role_role_add_option_vpcSpecView_value","relatedPrivilegeIds":null},{"id":"317002","parentId":"317000","name":"role_role_add_option_vpcSpecHandle_value","relatedPrivilegeIds":null},{"id":"318000","parentId":"13","name":"service_term_template_label","relatedPrivilegeIds":null},{"id":"318001","parentId":"318000","name":"role_role_add_option_serviceTemplateView_value","relatedPrivilegeIds":null},{"id":"319000","parentId":"13","name":"service_term_catalog_label","relatedPrivilegeIds":null},{"id":"319001","parentId":"319000","name":"role_role_add_option_catalogView_value","relatedPrivilegeIds":null},{"id":"319002","parentId":"319000","name":"role_role_add_option_catalogHandle_value","relatedPrivilegeIds":null},{"id":"320000","parentId":"13","name":"service_term_order_label","relatedPrivilegeIds":null},{"id":"320001","parentId":"320000","name":"role_role_add_option_orderView_value","relatedPrivilegeIds":null},{"id":"320002","parentId":"320000","name":"role_role_add_option_orderHandle_value","relatedPrivilegeIds":null},{"id":"320003","parentId":"13","name":"role_role_add_option_serInstanceView_value","relatedPrivilegeIds":null},{"id":"320004","parentId":"13","name":"role_role_add_option_serInstanceHandle_value","relatedPrivilegeIds":null},{"id":"320005","parentId":"320000","name":"role_role_add_option_orderApprove_value","relatedPrivilegeIds":null},{"id":"321000","parentId":"6","name":"template_term_softDepot_label","relatedPrivilegeIds":null},{"id":"321001","parentId":"321000","name":"role_role_add_option_softDepotView_value","relatedPrivilegeIds":null},{"id":"401000","parentId":"3","name":"role_role_add_option_serverView_value","relatedPrivilegeIds":null},{"id":"401001","parentId":"3","name":"role_role_add_option_serverHandle_value","relatedPrivilegeIds":null},{"id":"402000","parentId":"34","name":"role_role_add_option_deviceView_value","relatedPrivilegeIds":null},{"id":"403000","parentId":"34","name":"role_role_add_option_deviceHandle_value","relatedPrivilegeIds":null},{"id":"404000","parentId":"34","name":"device_term_FusionStorage_label","relatedPrivilegeIds":null},{"id":"404001","parentId":"404000","name":"role_role_add_option_FusionStorageView_value","relatedPrivilegeIds":null},{"id":"404002","parentId":"404000","name":"role_role_add_option_FusionStorageHandle_value","relatedPrivilegeIds":null},{"id":"451000","parentId":"18","name":"aspf_term_aspf_label","relatedPrivilegeIds":null},{"id":"451001","parentId":"451000","name":"role_role_add_option_aspfView_value","relatedPrivilegeIds":null},{"id":"451002","parentId":"451000","name":"role_role_add_option_aspfHandle_value","relatedPrivilegeIds":null},{"id":"452000","parentId":"18","name":"nat_term_dnat_label","relatedPrivilegeIds":null},{"id":"452001","parentId":"452000","name":"role_role_add_option_dnatView_value","relatedPrivilegeIds":null},{"id":"452002","parentId":"452000","name":"role_role_add_option_dnatHandle_value","relatedPrivilegeIds":null},{"id":"453000","parentId":"18","name":"eip_term_eip_label","relatedPrivilegeIds":null},{"id":"453001","parentId":"453000","name":"role_role_add_option_eipView_value","relatedPrivilegeIds":null},{"id":"453002","parentId":"453000","name":"role_role_add_option_eipHandle_value","relatedPrivilegeIds":null},{"id":"454000","parentId":"18","name":"acl_term_acl_label","relatedPrivilegeIds":null},{"id":"454001","parentId":"454000","name":"role_role_add_option_aclView_value","relatedPrivilegeIds":null},{"id":"454002","parentId":"454000","name":"role_role_add_option_aclHandle_value","relatedPrivilegeIds":null},{"id":"455000","parentId":"18","name":"vpc_term_net_label","relatedPrivilegeIds":null},{"id":"455001","parentId":"455000","name":"role_role_add_option_netView_value","relatedPrivilegeIds":null},{"id":"455002","parentId":"455000","name":"role_role_add_option_netHandle_value","relatedPrivilegeIds":null},{"id":"456000","parentId":"18","name":"role_role_add_option_vpcHandle_value","relatedPrivilegeIds":null},{"id":"457000","parentId":"18","name":"vpc_term_deployService_label","relatedPrivilegeIds":null},{"id":"457001","parentId":"457000","name":"role_role_add_option_deployServiceView_value","relatedPrivilegeIds":null},{"id":"457002","parentId":"457000","name":"role_role_add_option_deployServiceHandle_value","relatedPrivilegeIds":null},{"id":"458000","parentId":"18","name":"router_term_router_label","relatedPrivilegeIds":null},{"id":"458001","parentId":"458000","name":"role_role_add_option_routerView_value","relatedPrivilegeIds":null},{"id":"458002","parentId":"458000","name":"role_role_add_option_routerHandle_value","relatedPrivilegeIds":null},{"id":"459000","parentId":"18","name":"security_term_SG_label","relatedPrivilegeIds":null},{"id":"459001","parentId":"459000","name":"role_role_add_option_SGView_value","relatedPrivilegeIds":null},{"id":"459002","parentId":"459000","name":"role_role_add_option_SGHandle_value","relatedPrivilegeIds":null},{"id":"460000","parentId":"18","name":"lb_term_vlb_label","relatedPrivilegeIds":null},{"id":"460001","parentId":"460000","name":"role_role_add_option_vlbView_value","relatedPrivilegeIds":null},{"id":"460002","parentId":"460000","name":"role_role_add_option_vlbHandle_value","relatedPrivilegeIds":null},{"id":"461000","parentId":"18","name":"vpn_term_vpn_label","relatedPrivilegeIds":null},{"id":"461001","parentId":"461000","name":"role_role_add_option_vpnView_value","relatedPrivilegeIds":null},{"id":"461002","parentId":"461000","name":"role_role_add_option_vpnHandle_value","relatedPrivilegeIds":null},{"id":"501000","parentId":"51","name":"role_role_add_option_snapView_value","relatedPrivilegeIds":null},{"id":"502000","parentId":"51","name":"role_role_add_option_snapHandle_value","relatedPrivilegeIds":null},{"id":"601000","parentId":"7","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"601001","parentId":"601000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"601002","parentId":"601000","name":"role_role_add_option_AZHandle_value","relatedPrivilegeIds":null},{"id":"602000","parentId":"7","name":"resource_term_netPool_label","relatedPrivilegeIds":null},{"id":"602001","parentId":"602000","name":"role_role_add_option_netPoolView_value","relatedPrivilegeIds":null},{"id":"602002","parentId":"602000","name":"role_role_add_option_netPoolHandle_value","relatedPrivilegeIds":null},{"id":"603000","parentId":"7","name":"resource_term_serverPool_label","relatedPrivilegeIds":null},{"id":"603001","parentId":"603000","name":"role_role_add_option_serverPoolView_value","relatedPrivilegeIds":null},{"id":"603002","parentId":"603000","name":"role_role_add_option_serverPoolHandle_value","relatedPrivilegeIds":null},{"id":"604000","parentId":"7","name":"resource_term_storagePool_label","relatedPrivilegeIds":null},{"id":"604001","parentId":"604000","name":"role_role_add_option_storagePoolView_value","relatedPrivilegeIds":null},{"id":"604002","parentId":"604000","name":"role_role_add_option_storagePoolHandle_value","relatedPrivilegeIds":null},{"id":"605000","parentId":"7","name":"resource_term_zone_label","relatedPrivilegeIds":null},{"id":"605001","parentId":"605000","name":"role_role_add_option_zoneView_value","relatedPrivilegeIds":null},{"id":"605002","parentId":"605000","name":"role_role_add_option_zoneHandle_value","relatedPrivilegeIds":null},{"id":"607000","parentId":"21","name":"role_role_add_option_clusterView_value","relatedPrivilegeIds":null},{"id":"608000","parentId":"21","name":"role_role_add_option_clusterHandle_value","relatedPrivilegeIds":null},{"id":"609000","parentId":"22","name":"role_role_add_option_vmDiskView_value","relatedPrivilegeIds":null},{"id":"610000","parentId":"22","name":"role_role_add_option_vmDiskHandle_value","relatedPrivilegeIds":null},{"id":"611000","parentId":"23","name":"role_role_add_option_hostView_value","relatedPrivilegeIds":null},{"id":"612000","parentId":"23","name":"role_role_add_option_hostHandle_value","relatedPrivilegeIds":null},{"id":"613000","parentId":"24","name":"role_role_add_option_hypervisorView_value","relatedPrivilegeIds":null},{"id":"614000","parentId":"24","name":"role_role_add_option_hypervisorHandle_value","relatedPrivilegeIds":null},{"id":"615000","parentId":"10","name":"role_role_add_option_advance_value","relatedPrivilegeIds":null},{"id":"616000","parentId":"10","name":"role_role_add_option_basic_value","relatedPrivilegeIds":null},{"id":"617000","parentId":"10","name":"common_term_create_button","relatedPrivilegeIds":null},{"id":"618000","parentId":"10","name":"common_term_delete_button","relatedPrivilegeIds":null},{"id":"619000","parentId":"10","name":"common_term_check_button","relatedPrivilegeIds":null},{"id":"620000","parentId":"10","name":"vm_term_vnc_button","relatedPrivilegeIds":null},{"id":"801000","parentId":"42","name":"role_role_add_option_tagView_value","relatedPrivilegeIds":null},{"id":"802000","parentId":"42","name":"role_role_add_option_tagHandle_value","relatedPrivilegeIds":null},{"id":"999999","parentId":"0","name":"role_role_add_option_FusionComputeView_value","relatedPrivilegeIds":null},{"id":"323000","parentId":"15","name":"resource_term_externalNets_label","relatedPrivilegeIds":null},{"id":"323002","parentId":"323000","name":"role_role_add_option_externalNetView_value","relatedPrivilegeIds":null}]},"userList":[{"id":"24","name":"tte","userType":null,"createTime":"2014-09-20 08:39:00 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"22","name":"Ohio","userType":null,"createTime":"2014-09-19 17:34:03 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"25","name":"ty2","userType":null,"createTime":"2014-09-22 10:06:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"12","name":"zhoulu","userType":null,"createTime":"2014-09-18 14:31:16 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"6","name":"tianye","userType":null,"createTime":"2014-09-15 19:25:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"16","name":"zhangyajun","userType":null,"createTime":"2014-09-19 14:30:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"10","name":"tabAdmin","userType":null,"createTime":"2014-09-17 12:01:52 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"20","name":"zhangjianmei1","userType":null,"createTime":"2014-09-19 15:11:45 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"23","name":"xqk","userType":null,"createTime":"2014-09-20 08:05:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"5","name":"zhangjianmei","userType":null,"createTime":"2014-09-15 16:19:44 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"19","name":"xz","userType":null,"createTime":"2014-09-19 15:00:34 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"8","name":"zx","userType":null,"createTime":"2014-09-15 20:09:27 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"17","name":"caoyu","userType":null,"createTime":"2014-09-19 14:56:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null}]},
        "3":{"roleInfo":{"id":"3","name":"auditor","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_auditor_value","vdcId":null,"privilegeInfo":[{"id":"1","parentId":"0","name":"sys_term_sysConfig_label","relatedPrivilegeIds":null},{"id":"2","parentId":"0","name":"common_term_authorization_label","relatedPrivilegeIds":null},{"id":"3","parentId":"0","name":"server_term_server_label","relatedPrivilegeIds":null},{"id":"5","parentId":"0","name":"common_term_monitor_label","relatedPrivilegeIds":null},{"id":"6","parentId":"0","name":"template_term_template_label","relatedPrivilegeIds":null},{"id":"7","parentId":"0","name":"resource_term_pool_label","relatedPrivilegeIds":null},{"id":"8","parentId":"0","name":"report_term_report_label","relatedPrivilegeIds":null},{"id":"9","parentId":"0","name":"org_term_organization_label","relatedPrivilegeIds":null},{"id":"10","parentId":"0","name":"common_term_vm_label","relatedPrivilegeIds":null},{"id":"12","parentId":"0","name":"log_term_log_label","relatedPrivilegeIds":null},{"id":"13","parentId":"0","name":"service_term_service_label","relatedPrivilegeIds":null},{"id":"15","parentId":"0","name":"cloud_term_cloudPool_label","relatedPrivilegeIds":null},{"id":"16","parentId":"0","name":"task_term_task_label","relatedPrivilegeIds":null},{"id":"18","parentId":"0","name":"vpc_term_vpc_label","relatedPrivilegeIds":null},{"id":"19","parentId":"0","name":"resource_term_ServiceVM_label","relatedPrivilegeIds":null},{"id":"21","parentId":"0","name":"virtual_term_cluster_label","relatedPrivilegeIds":null},{"id":"22","parentId":"0","name":"vm_term_vmDisk_label","relatedPrivilegeIds":null},{"id":"23","parentId":"0","name":"common_term_host_label","relatedPrivilegeIds":null},{"id":"24","parentId":"0","name":"virtual_term_hypervisor_label","relatedPrivilegeIds":null},{"id":"32","parentId":"0","name":"sys_term_topo_label","relatedPrivilegeIds":null},{"id":"34","parentId":"0","name":"device_term_device_label","relatedPrivilegeIds":null},{"id":"42","parentId":"0","name":"cloud_term_tagManage_label","relatedPrivilegeIds":null},{"id":"43","parentId":"0","name":"resource_term_resourceStatistic_label","relatedPrivilegeIds":null},{"id":"51","parentId":"0","name":"vm_term_snaps_label","relatedPrivilegeIds":null},{"id":"102000","parentId":"2","name":"role_term_role_label","relatedPrivilegeIds":null},{"id":"102002","parentId":"102000","name":"role_role_add_option_roleView_value","relatedPrivilegeIds":null},{"id":"103000","parentId":"2","name":"user_term_user_label","relatedPrivilegeIds":null},{"id":"103002","parentId":"103000","name":"role_role_add_option_userView_value","relatedPrivilegeIds":null},{"id":"104000","parentId":"2","name":"user_term_pswPolicy_label","relatedPrivilegeIds":null},{"id":"104002","parentId":"104000","name":"role_role_add_option_pswPolicyView_value","relatedPrivilegeIds":null},{"id":"105000","parentId":"12","name":"log_term_operation_label","relatedPrivilegeIds":null},{"id":"106000","parentId":"5","name":"alarm_term_alarm_label","relatedPrivilegeIds":null},{"id":"106001","parentId":"106000","name":"role_role_add_option_alarmView_value","relatedPrivilegeIds":null},{"id":"107000","parentId":"5","name":"perform_term_monitor_label","relatedPrivilegeIds":null},{"id":"108001","parentId":"9","name":"role_role_add_option_orgView_value","relatedPrivilegeIds":null},{"id":"109000","parentId":"8","name":"role_role_add_option_reportView_value","relatedPrivilegeIds":null},{"id":"111000","parentId":"2","name":"domain_term_domain_label","relatedPrivilegeIds":null},{"id":"111002","parentId":"111000","name":"role_role_add_option_domainView_value","relatedPrivilegeIds":null},{"id":"201000","parentId":"1","name":"sys_term_backupSet_label","relatedPrivilegeIds":null},{"id":"201001","parentId":"201000","name":"role_role_add_option_backupSetView_value","relatedPrivilegeIds":null},{"id":"204000","parentId":"1","name":"sys_term_license_label","relatedPrivilegeIds":null},{"id":"204001","parentId":"204000","name":"role_role_add_option_licenseView_value","relatedPrivilegeIds":null},{"id":"207000","parentId":"1","name":"sys_term_time_label","relatedPrivilegeIds":null},{"id":"207001","parentId":"207000","name":"role_role_add_option_timeView_value","relatedPrivilegeIds":null},{"id":"209000","parentId":"1","name":"sys_term_snmp_label","relatedPrivilegeIds":null},{"id":"209001","parentId":"209000","name":"role_role_add_option_snmpView_value","relatedPrivilegeIds":null},{"id":"210000","parentId":"1","name":"sys_term_timeout_label","relatedPrivilegeIds":null},{"id":"210002","parentId":"210000","name":"role_role_add_option_timeoutView_value","relatedPrivilegeIds":null},{"id":"211000","parentId":"19","name":"role_role_add_option_ServiceVMView_value","relatedPrivilegeIds":null},{"id":"213000","parentId":"1","name":"sys_term_archives_label","relatedPrivilegeIds":null},{"id":"214000","parentId":"1","name":"sys_term_intervalStartStop_label","relatedPrivilegeIds":null},{"id":"214001","parentId":"214000","name":"role_role_add_option_intervalStartStopView_value","relatedPrivilegeIds":null},{"id":"215000","parentId":"1","name":"sys_term_disasterCfg_label","relatedPrivilegeIds":null},{"id":"215001","parentId":"215000","name":"role_role_add_option_disasterCfgView_value","relatedPrivilegeIds":null},{"id":"216000","parentId":"1","name":"sys_term_machineAccountMgmt_label","relatedPrivilegeIds":null},{"id":"216001","parentId":"216000","name":"role_role_add_option_machineAccountView_value","relatedPrivilegeIds":null},{"id":"304000","parentId":"15","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"304002","parentId":"304000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"306000","parentId":"15","name":"role_role_add_option_cloudPoolView_value","relatedPrivilegeIds":null},{"id":"308000","parentId":"13","name":"role_role_add_option_serviceView_value","relatedPrivilegeIds":null},{"id":"309000","parentId":"6","name":"template_term_ipBandwidth_label","relatedPrivilegeIds":null},{"id":"309001","parentId":"309000","name":"role_role_add_option_ipBandwidthView_value","relatedPrivilegeIds":null},{"id":"310000","parentId":"6","name":"template_term_iso_label","relatedPrivilegeIds":null},{"id":"310001","parentId":"310000","name":"role_role_add_option_isoView_value","relatedPrivilegeIds":null},{"id":"311000","parentId":"6","name":"template_term_script_label","relatedPrivilegeIds":null},{"id":"311001","parentId":"311000","name":"role_role_add_option_scriptView_value","relatedPrivilegeIds":null},{"id":"312000","parentId":"6","name":"template_term_app_label","relatedPrivilegeIds":null},{"id":"312001","parentId":"312000","name":"role_role_add_option_appTemplateView_value","relatedPrivilegeIds":null},{"id":"313000","parentId":"6","name":"template_term_software_label","relatedPrivilegeIds":null},{"id":"313001","parentId":"313000","name":"role_role_add_option_softwareView_value","relatedPrivilegeIds":null},{"id":"314000","parentId":"6","name":"template_term_vmLogic_label","relatedPrivilegeIds":null},{"id":"314001","parentId":"314000","name":"role_role_add_option_vmLogicView_value","relatedPrivilegeIds":null},{"id":"315000","parentId":"6","name":"spec_term_vm_label","relatedPrivilegeIds":null},{"id":"315001","parentId":"315000","name":"role_role_add_option_vmSpecView_value","relatedPrivilegeIds":null},{"id":"316000","parentId":"6","name":"template_term_vm_label","relatedPrivilegeIds":null},{"id":"316001","parentId":"316000","name":"role_role_add_option_vmTemplateView_value","relatedPrivilegeIds":null},{"id":"317000","parentId":"6","name":"spec_term_vpc_label","relatedPrivilegeIds":null},{"id":"317001","parentId":"317000","name":"role_role_add_option_vpcSpecView_value","relatedPrivilegeIds":null},{"id":"318000","parentId":"13","name":"service_term_template_label","relatedPrivilegeIds":null},{"id":"318001","parentId":"318000","name":"role_role_add_option_serviceTemplateView_value","relatedPrivilegeIds":null},{"id":"319000","parentId":"13","name":"service_term_catalog_label","relatedPrivilegeIds":null},{"id":"319001","parentId":"319000","name":"role_role_add_option_catalogView_value","relatedPrivilegeIds":null},{"id":"320000","parentId":"13","name":"service_term_order_label","relatedPrivilegeIds":null},{"id":"320001","parentId":"320000","name":"role_role_add_option_orderView_value","relatedPrivilegeIds":null},{"id":"320003","parentId":"13","name":"role_role_add_option_serInstanceView_value","relatedPrivilegeIds":null},{"id":"321000","parentId":"6","name":"template_term_softDepot_label","relatedPrivilegeIds":null},{"id":"321001","parentId":"321000","name":"role_role_add_option_softDepotView_value","relatedPrivilegeIds":null},{"id":"401000","parentId":"3","name":"role_role_add_option_serverView_value","relatedPrivilegeIds":null},{"id":"401001","parentId":"3","name":"role_role_add_option_serverHandle_value","relatedPrivilegeIds":null},{"id":"402000","parentId":"34","name":"role_role_add_option_deviceView_value","relatedPrivilegeIds":null},{"id":"404000","parentId":"34","name":"device_term_FusionStorage_label","relatedPrivilegeIds":null},{"id":"404001","parentId":"404000","name":"role_role_add_option_FusionStorageView_value","relatedPrivilegeIds":null},{"id":"451000","parentId":"18","name":"aspf_term_aspf_label","relatedPrivilegeIds":null},{"id":"451001","parentId":"451000","name":"role_role_add_option_aspfView_value","relatedPrivilegeIds":null},{"id":"452000","parentId":"18","name":"nat_term_dnat_label","relatedPrivilegeIds":null},{"id":"452001","parentId":"452000","name":"role_role_add_option_dnatView_value","relatedPrivilegeIds":null},{"id":"453000","parentId":"18","name":"eip_term_eip_label","relatedPrivilegeIds":null},{"id":"453001","parentId":"453000","name":"role_role_add_option_eipView_value","relatedPrivilegeIds":null},{"id":"454000","parentId":"18","name":"acl_term_acl_label","relatedPrivilegeIds":null},{"id":"454001","parentId":"454000","name":"role_role_add_option_aclView_value","relatedPrivilegeIds":null},{"id":"455000","parentId":"18","name":"vpc_term_net_label","relatedPrivilegeIds":null},{"id":"455001","parentId":"455000","name":"role_role_add_option_netView_value","relatedPrivilegeIds":null},{"id":"457000","parentId":"18","name":"vpc_term_deployService_label","relatedPrivilegeIds":null},{"id":"457001","parentId":"457000","name":"role_role_add_option_deployServiceView_value","relatedPrivilegeIds":null},{"id":"458000","parentId":"18","name":"router_term_router_label","relatedPrivilegeIds":null},{"id":"458001","parentId":"458000","name":"role_role_add_option_routerView_value","relatedPrivilegeIds":null},{"id":"459000","parentId":"18","name":"security_term_SG_label","relatedPrivilegeIds":null},{"id":"459001","parentId":"459000","name":"role_role_add_option_SGView_value","relatedPrivilegeIds":null},{"id":"460000","parentId":"18","name":"lb_term_vlb_label","relatedPrivilegeIds":null},{"id":"460001","parentId":"460000","name":"role_role_add_option_vlbView_value","relatedPrivilegeIds":null},{"id":"461000","parentId":"18","name":"vpn_term_vpn_label","relatedPrivilegeIds":null},{"id":"461001","parentId":"461000","name":"role_role_add_option_vpnView_value","relatedPrivilegeIds":null},{"id":"501000","parentId":"51","name":"role_role_add_option_snapView_value","relatedPrivilegeIds":null},{"id":"601000","parentId":"7","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"601001","parentId":"601000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"602000","parentId":"7","name":"resource_term_netPool_label","relatedPrivilegeIds":null},{"id":"602001","parentId":"602000","name":"role_role_add_option_netPoolView_value","relatedPrivilegeIds":null},{"id":"603000","parentId":"7","name":"resource_term_serverPool_label","relatedPrivilegeIds":null},{"id":"603001","parentId":"603000","name":"role_role_add_option_serverPoolView_value","relatedPrivilegeIds":null},{"id":"604000","parentId":"7","name":"resource_term_storagePool_label","relatedPrivilegeIds":null},{"id":"604001","parentId":"604000","name":"role_role_add_option_storagePoolView_value","relatedPrivilegeIds":null},{"id":"605000","parentId":"7","name":"resource_term_zone_label","relatedPrivilegeIds":null},{"id":"605001","parentId":"605000","name":"role_role_add_option_zoneView_value","relatedPrivilegeIds":null},{"id":"607000","parentId":"21","name":"role_role_add_option_clusterView_value","relatedPrivilegeIds":null},{"id":"609000","parentId":"22","name":"role_role_add_option_vmDiskView_value","relatedPrivilegeIds":null},{"id":"611000","parentId":"23","name":"role_role_add_option_hostView_value","relatedPrivilegeIds":null},{"id":"613000","parentId":"24","name":"role_role_add_option_hypervisorView_value","relatedPrivilegeIds":null},{"id":"619000","parentId":"10","name":"common_term_check_button","relatedPrivilegeIds":null},{"id":"801000","parentId":"42","name":"role_role_add_option_tagView_value","relatedPrivilegeIds":null},{"id":"999999","parentId":"0","name":"role_role_add_option_FusionComputeView_value","relatedPrivilegeIds":null},{"id":"323000","parentId":"15","name":"resource_term_externalNets_label","relatedPrivilegeIds":null},{"id":"323002","parentId":"323000","name":"role_role_add_option_externalNetView_value","relatedPrivilegeIds":null}]},"userList":[{"id":"24","name":"tte","userType":null,"createTime":"2014-09-20 08:39:00 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"22","name":"Ohio","userType":null,"createTime":"2014-09-19 17:34:03 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"12","name":"zhoulu","userType":null,"createTime":"2014-09-18 14:31:16 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"6","name":"tianye","userType":null,"createTime":"2014-09-15 19:25:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"16","name":"zhangyajun","userType":null,"createTime":"2014-09-19 14:30:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"2","name":"geadmin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"10","name":"tabAdmin","userType":null,"createTime":"2014-09-17 12:01:52 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"20","name":"zhangjianmei1","userType":null,"createTime":"2014-09-19 15:11:45 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"23","name":"xqk","userType":null,"createTime":"2014-09-20 08:05:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"5","name":"zhangjianmei","userType":null,"createTime":"2014-09-15 16:19:44 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"19","name":"xz","userType":null,"createTime":"2014-09-19 15:00:34 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"8","name":"zx","userType":null,"createTime":"2014-09-15 20:09:27 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"17","name":"caoyu","userType":null,"createTime":"2014-09-19 14:56:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null}]},
        "5":{"roleInfo":{"id":"5","name":"user","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_user_value","vdcId":null,"privilegeInfo":[{"id":"3","parentId":"0","name":"server_term_server_label","relatedPrivilegeIds":null},{"id":"4","parentId":"0","name":"app_term_app_label","relatedPrivilegeIds":null},{"id":"5","parentId":"0","name":"common_term_monitor_label","relatedPrivilegeIds":null},{"id":"6","parentId":"0","name":"template_term_template_label","relatedPrivilegeIds":null},{"id":"10","parentId":"0","name":"common_term_vm_label","relatedPrivilegeIds":null},{"id":"13","parentId":"0","name":"service_term_service_label","relatedPrivilegeIds":null},{"id":"14","parentId":"0","name":"common_term_storage_label","relatedPrivilegeIds":null},{"id":"15","parentId":"0","name":"cloud_term_cloudPool_label","relatedPrivilegeIds":null},{"id":"22","parentId":"0","name":"vm_term_vmDisk_label","relatedPrivilegeIds":null},{"id":"23","parentId":"0","name":"common_term_host_label","relatedPrivilegeIds":null},{"id":"42","parentId":"0","name":"cloud_term_tagManage_label","relatedPrivilegeIds":null},{"id":"43","parentId":"0","name":"resource_term_resourceStatistic_label","relatedPrivilegeIds":null},{"id":"51","parentId":"0","name":"vm_term_snaps_label","relatedPrivilegeIds":null},{"id":"55","parentId":"0","name":"vpc_term_vpc_label","relatedPrivilegeIds":null},{"id":"106000","parentId":"5","name":"alarm_term_alarm_label","relatedPrivilegeIds":null},{"id":"106001","parentId":"106000","name":"role_role_add_option_alarmView_value","relatedPrivilegeIds":null},{"id":"107000","parentId":"5","name":"perform_term_monitor_label","relatedPrivilegeIds":null},{"id":"216000","parentId":"1","name":"sys_term_machineAccountMgmt_label","relatedPrivilegeIds":null},{"id":"216001","parentId":"216000","name":"role_role_add_option_machineAccountView_value","relatedPrivilegeIds":null},{"id":"302000","parentId":"4","name":"template_term_app_label","relatedPrivilegeIds":null},{"id":"302001","parentId":"302000","name":"role_role_add_option_appTemplateView_value","relatedPrivilegeIds":null},{"id":"302002","parentId":"302000","name":"role_role_add_option_appTemplateHandle_value","relatedPrivilegeIds":null},{"id":"303000","parentId":"4","name":"app_term_appInstance_label","relatedPrivilegeIds":null},{"id":"303001","parentId":"303000","name":"role_role_add_option_appInstanceView_value","relatedPrivilegeIds":null},{"id":"303002","parentId":"303000","name":"role_role_add_option_appInstanceHandle_value","relatedPrivilegeIds":null},{"id":"304000","parentId":"15","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"304002","parentId":"304000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"306000","parentId":"15","name":"role_role_add_option_cloudPoolView_value","relatedPrivilegeIds":null},{"id":"308000","parentId":"13","name":"role_role_add_option_serviceView_value","relatedPrivilegeIds":null},{"id":"309000","parentId":"6","name":"template_term_ipBandwidth_label","relatedPrivilegeIds":null},{"id":"309001","parentId":"309000","name":"role_role_add_option_ipBandwidthView_value","relatedPrivilegeIds":null},{"id":"311000","parentId":"6","name":"template_term_script_label","relatedPrivilegeIds":null},{"id":"311001","parentId":"311000","name":"role_role_add_option_scriptView_value","relatedPrivilegeIds":null},{"id":"311002","parentId":"311000","name":"role_role_add_option_scriptHandle_value","relatedPrivilegeIds":null},{"id":"313000","parentId":"6","name":"template_term_software_label","relatedPrivilegeIds":null},{"id":"313001","parentId":"313000","name":"role_role_add_option_softwareView_value","relatedPrivilegeIds":null},{"id":"313002","parentId":"313000","name":"role_role_add_option_softwareHandle_value","relatedPrivilegeIds":null},{"id":"316000","parentId":"6","name":"template_term_vm_label","relatedPrivilegeIds":null},{"id":"316001","parentId":"316000","name":"role_role_add_option_vmTemplateView_value","relatedPrivilegeIds":null},{"id":"316002","parentId":"316000","name":"role_role_add_option_vmTemplateHandle_value","relatedPrivilegeIds":null},{"id":"319000","parentId":"13","name":"service_term_catalog_label","relatedPrivilegeIds":null},{"id":"319001","parentId":"319000","name":"role_role_add_option_catalogView_value","relatedPrivilegeIds":null},{"id":"320000","parentId":"13","name":"service_term_order_label","relatedPrivilegeIds":null},{"id":"320001","parentId":"320000","name":"role_role_add_option_orderView_value","relatedPrivilegeIds":null},{"id":"320002","parentId":"320000","name":"role_role_add_option_orderHandle_value","relatedPrivilegeIds":null},{"id":"320003","parentId":"13","name":"role_role_add_option_serInstanceView_value","relatedPrivilegeIds":null},{"id":"320004","parentId":"13","name":"role_role_add_option_serInstanceHandle_value","relatedPrivilegeIds":null},{"id":"321000","parentId":"6","name":"template_term_softDepot_label","relatedPrivilegeIds":null},{"id":"321001","parentId":"321000","name":"role_role_add_option_softDepotView_value","relatedPrivilegeIds":null},{"id":"322000","parentId":"15","name":"vpc_term_publicIPpool_label","relatedPrivilegeIds":null},{"id":"322002","parentId":"322000","name":"role_role_add_option_publicIPpoolView_value","relatedPrivilegeIds":null},{"id":"323000","parentId":"15","name":"resource_term_externalNets_label","relatedPrivilegeIds":null},{"id":"401000","parentId":"3","name":"role_role_add_option_serverView_value","relatedPrivilegeIds":null},{"id":"401001","parentId":"3","name":"role_role_add_option_serverHandle_value","relatedPrivilegeIds":null},{"id":"501000","parentId":"51","name":"role_role_add_option_snapView_value","relatedPrivilegeIds":null},{"id":"502000","parentId":"51","name":"role_role_add_option_snapHandle_value","relatedPrivilegeIds":null},{"id":"551000","parentId":"55","name":"aspf_term_aspf_label","relatedPrivilegeIds":null},{"id":"551001","parentId":"551000","name":"role_role_add_option_aspfView_value","relatedPrivilegeIds":null},{"id":"552000","parentId":"55","name":"nat_term_dnat_label","relatedPrivilegeIds":null},{"id":"552001","parentId":"552000","name":"role_role_add_option_dnatView_value","relatedPrivilegeIds":null},{"id":"553000","parentId":"55","name":"eip_term_eip_label","relatedPrivilegeIds":null},{"id":"553001","parentId":"553000","name":"role_role_add_option_eipView_value","relatedPrivilegeIds":null},{"id":"553002","parentId":"553000","name":"role_role_add_option_eipHandle_value","relatedPrivilegeIds":null},{"id":"554000","parentId":"55","name":"acl_term_acl_label","relatedPrivilegeIds":null},{"id":"554001","parentId":"554000","name":"role_role_add_option_aclView_value","relatedPrivilegeIds":null},{"id":"555000","parentId":"55","name":"vpc_term_net_label","relatedPrivilegeIds":null},{"id":"555001","parentId":"555000","name":"role_role_add_option_netView_value","relatedPrivilegeIds":null},{"id":"558000","parentId":"55","name":"router_term_router_label","relatedPrivilegeIds":null},{"id":"558001","parentId":"558000","name":"role_role_add_option_routerView_value","relatedPrivilegeIds":null},{"id":"559000","parentId":"55","name":"security_term_SG_label","relatedPrivilegeIds":null},{"id":"559001","parentId":"559000","name":"role_role_add_option_SGView_value","relatedPrivilegeIds":null},{"id":"559002","parentId":"559000","name":"role_role_add_option_SGHandle_value","relatedPrivilegeIds":null},{"id":"560000","parentId":"55","name":"lb_term_vlb_label","relatedPrivilegeIds":null},{"id":"560001","parentId":"560000","name":"role_role_add_option_vlbView_value","relatedPrivilegeIds":null},{"id":"561000","parentId":"55","name":"vpn_term_vpn_label","relatedPrivilegeIds":null},{"id":"561001","parentId":"561000","name":"role_role_add_option_vpnView_value","relatedPrivilegeIds":null},{"id":"606000","parentId":"14","name":"common_term_disk_label","relatedPrivilegeIds":null},{"id":"606001","parentId":"606000","name":"role_role_add_option_diskView_value","relatedPrivilegeIds":null},{"id":"606002","parentId":"606000","name":"role_role_add_option_diskHandle_value","relatedPrivilegeIds":null},{"id":"609000","parentId":"22","name":"role_role_add_option_vmDiskView_value","relatedPrivilegeIds":null},{"id":"610000","parentId":"22","name":"role_role_add_option_vmDiskHandle_value","relatedPrivilegeIds":null},{"id":"611000","parentId":"23","name":"role_role_add_option_hostView_value","relatedPrivilegeIds":null},{"id":"612000","parentId":"23","name":"role_role_add_option_hostHandle_value","relatedPrivilegeIds":null},{"id":"615000","parentId":"10","name":"role_role_add_option_advance_value","relatedPrivilegeIds":null},{"id":"616000","parentId":"10","name":"role_role_add_option_basic_value","relatedPrivilegeIds":null},{"id":"617000","parentId":"10","name":"common_term_create_button","relatedPrivilegeIds":null},{"id":"618000","parentId":"10","name":"common_term_delete_button","relatedPrivilegeIds":null},{"id":"619000","parentId":"10","name":"common_term_check_button","relatedPrivilegeIds":null},{"id":"620000","parentId":"10","name":"vm_term_vnc_button","relatedPrivilegeIds":null},{"id":"801000","parentId":"42","name":"role_role_add_option_tagView_value","relatedPrivilegeIds":null},{"id":"323002","parentId":"323000","name":"role_role_add_option_externalNetView_value","relatedPrivilegeIds":null}]},"userList":[{"id":"9","name":"tab","userType":null,"createTime":"2014-09-17 11:02:55 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"11","name":"tabUser","userType":null,"createTime":"2014-09-17 15:31:30 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"14","name":"cxm","userType":null,"createTime":"2014-09-19 10:30:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"12","name":"zhoulu","userType":null,"createTime":"2014-09-18 14:31:16 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"21","name":"qiuyang","userType":null,"createTime":"2014-09-19 16:56:43 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"6","name":"tianye","userType":null,"createTime":"2014-09-15 19:25:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"16","name":"zhangyajun","userType":null,"createTime":"2014-09-19 14:30:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"2","name":"geadmin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"7","name":"zhangjianmei_user","userType":null,"createTime":"2014-09-15 19:39:39 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"13","name":"ty","userType":null,"createTime":"2014-09-18 14:44:24 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"10","name":"tabAdmin","userType":null,"createTime":"2014-09-17 12:01:52 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"20","name":"zhangjianmei1","userType":null,"createTime":"2014-09-19 15:11:45 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"1","name":"admin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"23","name":"xqk","userType":null,"createTime":"2014-09-20 08:05:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"5","name":"zhangjianmei","userType":null,"createTime":"2014-09-15 16:19:44 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"19","name":"xz","userType":null,"createTime":"2014-09-19 15:00:34 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"15","name":"caoruntao","userType":null,"createTime":"2014-09-19 12:58:05 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"8","name":"zx","userType":null,"createTime":"2014-09-15 20:09:27 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"17","name":"caoyu","userType":null,"createTime":"2014-09-19 14:56:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null}]},
        "6":{"roleInfo":{"id":"6","name":"vdcmanager","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_orgmanager_value","vdcId":null,"privilegeInfo":[{"id":"2","parentId":"0","name":"common_term_authorization_label","relatedPrivilegeIds":null},{"id":"3","parentId":"0","name":"server_term_server_label","relatedPrivilegeIds":null},{"id":"4","parentId":"0","name":"app_term_app_label","relatedPrivilegeIds":null},{"id":"5","parentId":"0","name":"common_term_monitor_label","relatedPrivilegeIds":null},{"id":"6","parentId":"0","name":"template_term_template_label","relatedPrivilegeIds":null},{"id":"10","parentId":"0","name":"common_term_vm_label","relatedPrivilegeIds":null},{"id":"12","parentId":"0","name":"log_term_log_label","relatedPrivilegeIds":null},{"id":"13","parentId":"0","name":"service_term_service_label","relatedPrivilegeIds":null},{"id":"14","parentId":"0","name":"common_term_storage_label","relatedPrivilegeIds":null},{"id":"15","parentId":"0","name":"cloud_term_cloudPool_label","relatedPrivilegeIds":null},{"id":"22","parentId":"0","name":"vm_term_vmDisk_label","relatedPrivilegeIds":null},{"id":"23","parentId":"0","name":"common_term_host_label","relatedPrivilegeIds":null},{"id":"42","parentId":"0","name":"cloud_term_tagManage_label","relatedPrivilegeIds":null},{"id":"43","parentId":"0","name":"resource_term_resourceStatistic_label","relatedPrivilegeIds":null},{"id":"51","parentId":"0","name":"vm_term_snaps_label","relatedPrivilegeIds":null},{"id":"55","parentId":"0","name":"vpc_term_vpc_label","relatedPrivilegeIds":null},{"id":"102000","parentId":"2","name":"role_term_role_label","relatedPrivilegeIds":null},{"id":"102001","parentId":"102000","name":"role_role_add_option_roleHandle_value","relatedPrivilegeIds":null},{"id":"102002","parentId":"102000","name":"role_role_add_option_roleView_value","relatedPrivilegeIds":null},{"id":"103000","parentId":"2","name":"user_term_user_label","relatedPrivilegeIds":null},{"id":"103001","parentId":"103000","name":"role_role_add_option_userHandle_value","relatedPrivilegeIds":null},{"id":"103002","parentId":"103000","name":"role_role_add_option_userView_value","relatedPrivilegeIds":null},{"id":"105000","parentId":"12","name":"log_term_operation_label","relatedPrivilegeIds":null},{"id":"106000","parentId":"5","name":"alarm_term_alarm_label","relatedPrivilegeIds":null},{"id":"106001","parentId":"106000","name":"role_role_add_option_alarmView_value","relatedPrivilegeIds":null},{"id":"106002","parentId":"106000","name":"role_role_add_option_alarmHandle_value","relatedPrivilegeIds":null},{"id":"107000","parentId":"5","name":"perform_term_monitor_label","relatedPrivilegeIds":null},{"id":"111000","parentId":"2","name":"domain_term_domain_label","relatedPrivilegeIds":null},{"id":"111001","parentId":"111000","name":"role_role_add_option_domainHandle_value","relatedPrivilegeIds":null},{"id":"111002","parentId":"111000","name":"role_role_add_option_domainView_value","relatedPrivilegeIds":null},{"id":"216000","parentId":"1","name":"sys_term_machineAccountMgmt_label","relatedPrivilegeIds":null},{"id":"216001","parentId":"216000","name":"role_role_add_option_machineAccountView_value","relatedPrivilegeIds":null},{"id":"301000","parentId":"4","name":"app_term_policy_label","relatedPrivilegeIds":null},{"id":"301001","parentId":"301000","name":"app_term_schedule_label","relatedPrivilegeIds":null},{"id":"301002","parentId":"301000","name":"app_term_policyLog_label","relatedPrivilegeIds":null},{"id":"302000","parentId":"4","name":"template_term_app_label","relatedPrivilegeIds":null},{"id":"302001","parentId":"302000","name":"role_role_add_option_appTemplateView_value","relatedPrivilegeIds":null},{"id":"302002","parentId":"302000","name":"role_role_add_option_appTemplateHandle_value","relatedPrivilegeIds":null},{"id":"303000","parentId":"4","name":"app_term_appInstance_label","relatedPrivilegeIds":null},{"id":"303001","parentId":"303000","name":"role_role_add_option_appInstanceView_value","relatedPrivilegeIds":null},{"id":"303002","parentId":"303000","name":"role_role_add_option_appInstanceHandle_value","relatedPrivilegeIds":null},{"id":"304000","parentId":"15","name":"resource_term_AZ_label","relatedPrivilegeIds":null},{"id":"304002","parentId":"304000","name":"role_role_add_option_AZView_value","relatedPrivilegeIds":null},{"id":"306000","parentId":"15","name":"role_role_add_option_cloudPoolView_value","relatedPrivilegeIds":null},{"id":"307000","parentId":"13","name":"role_role_add_option_serviceHandle_value","relatedPrivilegeIds":null},{"id":"308000","parentId":"13","name":"role_role_add_option_serviceView_value","relatedPrivilegeIds":null},{"id":"309000","parentId":"6","name":"template_term_ipBandwidth_label","relatedPrivilegeIds":null},{"id":"309001","parentId":"309000","name":"role_role_add_option_ipBandwidthView_value","relatedPrivilegeIds":null},{"id":"311000","parentId":"6","name":"template_term_script_label","relatedPrivilegeIds":null},{"id":"311001","parentId":"311000","name":"role_role_add_option_scriptView_value","relatedPrivilegeIds":null},{"id":"311002","parentId":"311000","name":"role_role_add_option_scriptHandle_value","relatedPrivilegeIds":null},{"id":"313000","parentId":"6","name":"template_term_software_label","relatedPrivilegeIds":null},{"id":"313001","parentId":"313000","name":"role_role_add_option_softwareView_value","relatedPrivilegeIds":null},{"id":"313002","parentId":"313000","name":"role_role_add_option_softwareHandle_value","relatedPrivilegeIds":null},{"id":"316000","parentId":"6","name":"template_term_vm_label","relatedPrivilegeIds":null},{"id":"316001","parentId":"316000","name":"role_role_add_option_vmTemplateView_value","relatedPrivilegeIds":null},{"id":"316002","parentId":"316000","name":"role_role_add_option_vmTemplateHandle_value","relatedPrivilegeIds":null},{"id":"318000","parentId":"13","name":"service_term_template_label","relatedPrivilegeIds":null},{"id":"318001","parentId":"318000","name":"role_role_add_option_serviceTemplateView_value","relatedPrivilegeIds":null},{"id":"319000","parentId":"13","name":"service_term_catalog_label","relatedPrivilegeIds":null},{"id":"319001","parentId":"319000","name":"role_role_add_option_catalogView_value","relatedPrivilegeIds":null},{"id":"319002","parentId":"319000","name":"role_role_add_option_catalogHandle_value","relatedPrivilegeIds":null},{"id":"320000","parentId":"13","name":"service_term_order_label","relatedPrivilegeIds":null},{"id":"320001","parentId":"320000","name":"role_role_add_option_orderView_value","relatedPrivilegeIds":null},{"id":"320002","parentId":"320000","name":"role_role_add_option_orderHandle_value","relatedPrivilegeIds":null},{"id":"320003","parentId":"13","name":"role_role_add_option_serInstanceView_value","relatedPrivilegeIds":null},{"id":"320004","parentId":"13","name":"role_role_add_option_serInstanceHandle_value","relatedPrivilegeIds":null},{"id":"320005","parentId":"320000","name":"role_role_add_option_orderApprove_value","relatedPrivilegeIds":null},{"id":"321000","parentId":"6","name":"template_term_softDepot_label","relatedPrivilegeIds":null},{"id":"321001","parentId":"321000","name":"role_role_add_option_softDepotView_value","relatedPrivilegeIds":null},{"id":"322000","parentId":"15","name":"vpc_term_publicIPpool_label","relatedPrivilegeIds":null},{"id":"322002","parentId":"322000","name":"role_role_add_option_publicIPpoolView_value","relatedPrivilegeIds":null},{"id":"323000","parentId":"15","name":"resource_term_externalNets_label","relatedPrivilegeIds":null},{"id":"323002","parentId":"323000","name":"role_role_add_option_externalNetView_value","relatedPrivilegeIds":null},{"id":"401000","parentId":"3","name":"role_role_add_option_serverView_value","relatedPrivilegeIds":null},{"id":"401001","parentId":"3","name":"role_role_add_option_serverHandle_value","relatedPrivilegeIds":null},{"id":"501000","parentId":"51","name":"role_role_add_option_snapView_value","relatedPrivilegeIds":null},{"id":"502000","parentId":"51","name":"role_role_add_option_snapHandle_value","relatedPrivilegeIds":null},{"id":"551000","parentId":"55","name":"aspf_term_aspf_label","relatedPrivilegeIds":null},{"id":"551001","parentId":"551000","name":"role_role_add_option_aspfView_value","relatedPrivilegeIds":null},{"id":"551002","parentId":"551000","name":"role_role_add_option_aspfHandle_value","relatedPrivilegeIds":null},{"id":"552000","parentId":"55","name":"nat_term_dnat_label","relatedPrivilegeIds":null},{"id":"552001","parentId":"552000","name":"role_role_add_option_dnatView_value","relatedPrivilegeIds":null},{"id":"552002","parentId":"552000","name":"role_role_add_option_dnatHandle_value","relatedPrivilegeIds":null},{"id":"553000","parentId":"55","name":"eip_term_eip_label","relatedPrivilegeIds":null},{"id":"553001","parentId":"553000","name":"role_role_add_option_eipView_value","relatedPrivilegeIds":null},{"id":"553002","parentId":"553000","name":"role_role_add_option_eipHandle_value","relatedPrivilegeIds":null},{"id":"554000","parentId":"55","name":"acl_term_acl_label","relatedPrivilegeIds":null},{"id":"554001","parentId":"554000","name":"role_role_add_option_aclView_value","relatedPrivilegeIds":null},{"id":"554002","parentId":"554000","name":"role_role_add_option_aclHandle_value","relatedPrivilegeIds":null},{"id":"555000","parentId":"55","name":"vpc_term_net_label","relatedPrivilegeIds":null},{"id":"555001","parentId":"555000","name":"role_role_add_option_netView_value","relatedPrivilegeIds":null},{"id":"555002","parentId":"555000","name":"role_role_add_option_netHandle_value","relatedPrivilegeIds":null},{"id":"556000","parentId":"55","name":"role_role_add_option_vpcHandle_value","relatedPrivilegeIds":null},{"id":"557000","parentId":"55","name":"vpc_term_deployService_label","relatedPrivilegeIds":null},{"id":"557001","parentId":"557000","name":"role_role_add_option_deployServiceView_value","relatedPrivilegeIds":null},{"id":"557002","parentId":"557000","name":"role_role_add_option_deployServiceHandle_value","relatedPrivilegeIds":null},{"id":"558000","parentId":"55","name":"router_term_router_label","relatedPrivilegeIds":null},{"id":"558001","parentId":"558000","name":"role_role_add_option_routerView_value","relatedPrivilegeIds":null},{"id":"558002","parentId":"558000","name":"role_role_add_option_routerHandle_value","relatedPrivilegeIds":null},{"id":"559000","parentId":"55","name":"security_term_SG_label","relatedPrivilegeIds":null},{"id":"559001","parentId":"559000","name":"role_role_add_option_SGView_value","relatedPrivilegeIds":null},{"id":"559002","parentId":"559000","name":"role_role_add_option_SGHandle_value","relatedPrivilegeIds":null},{"id":"560000","parentId":"55","name":"lb_term_vlb_label","relatedPrivilegeIds":null},{"id":"560001","parentId":"560000","name":"role_role_add_option_vlbView_value","relatedPrivilegeIds":null},{"id":"560002","parentId":"560000","name":"role_role_add_option_vlbHandle_value","relatedPrivilegeIds":null},{"id":"561000","parentId":"55","name":"vpn_term_vpn_label","relatedPrivilegeIds":null},{"id":"561001","parentId":"561000","name":"role_role_add_option_vpnView_value","relatedPrivilegeIds":null},{"id":"561002","parentId":"561000","name":"role_role_add_option_vpnHandle_value","relatedPrivilegeIds":null},{"id":"606000","parentId":"14","name":"common_term_disk_label","relatedPrivilegeIds":null},{"id":"606001","parentId":"606000","name":"role_role_add_option_diskView_value","relatedPrivilegeIds":null},{"id":"606002","parentId":"606000","name":"role_role_add_option_diskHandle_value","relatedPrivilegeIds":null},{"id":"609000","parentId":"22","name":"role_role_add_option_vmDiskView_value","relatedPrivilegeIds":null},{"id":"610000","parentId":"22","name":"role_role_add_option_vmDiskHandle_value","relatedPrivilegeIds":null},{"id":"611000","parentId":"23","name":"role_role_add_option_hostView_value","relatedPrivilegeIds":null},{"id":"612000","parentId":"23","name":"role_role_add_option_hostHandle_value","relatedPrivilegeIds":null},{"id":"615000","parentId":"10","name":"role_role_add_option_advance_value","relatedPrivilegeIds":null},{"id":"616000","parentId":"10","name":"role_role_add_option_basic_value","relatedPrivilegeIds":null},{"id":"617000","parentId":"10","name":"common_term_create_button","relatedPrivilegeIds":null},{"id":"618000","parentId":"10","name":"common_term_delete_button","relatedPrivilegeIds":null},{"id":"619000","parentId":"10","name":"common_term_check_button","relatedPrivilegeIds":null},{"id":"620000","parentId":"10","name":"vm_term_vnc_button","relatedPrivilegeIds":null},{"id":"801000","parentId":"42","name":"role_role_add_option_tagView_value","relatedPrivilegeIds":null}]},"userList":[{"id":"9","name":"tab","userType":null,"createTime":"2014-09-17 11:02:55 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"14","name":"cxm","userType":null,"createTime":"2014-09-19 10:30:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"12","name":"zhoulu","userType":null,"createTime":"2014-09-18 14:31:16 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"21","name":"qiuyang","userType":null,"createTime":"2014-09-19 16:56:43 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"6","name":"tianye","userType":null,"createTime":"2014-09-15 19:25:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"16","name":"zhangyajun","userType":null,"createTime":"2014-09-19 14:30:23 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"2","name":"geadmin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"7","name":"zhangjianmei_user","userType":null,"createTime":"2014-09-15 19:39:39 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"13","name":"ty","userType":null,"createTime":"2014-09-18 14:44:24 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"10","name":"tabAdmin","userType":null,"createTime":"2014-09-17 12:01:52 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"20","name":"zhangjianmei1","userType":null,"createTime":"2014-09-19 15:11:45 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"1","name":"admin","userType":null,"createTime":"2014-09-15 12:39:54 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":"default user","loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"23","name":"xqk","userType":null,"createTime":"2014-09-20 08:05:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"5","name":"zhangjianmei","userType":null,"createTime":"2014-09-15 16:19:44 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"19","name":"xz","userType":null,"createTime":"2014-09-19 15:00:34 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"15","name":"caoruntao","userType":null,"createTime":"2014-09-19 12:58:05 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"8","name":"zx","userType":null,"createTime":"2014-09-15 20:09:27 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null},{"id":"17","name":"caoyu","userType":null,"createTime":"2014-09-19 14:56:09 UTC+08:00","onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null}]},
        "e277a3fd-7b69-4550-b87f-14c38efef893":{"roleInfo":{"id":"e277a3fd-7b69-4550-b87f-14c38efef893","name":"systemadmin","type":"SYSTEM_ROLE","securityRoleType":null,"defaultRole":false,"description":null,"vdcId":null,"privilegeInfo":[{"id":"999999","parentId":"0","name":"role_role_add_option_FusionComputeView_value","relatedPrivilegeIds":null}]},"userList":[]}
    }

    var roleService={
        "total":2,
        "roleList":[
            {"id":"5","name":"user","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_user_value","vdcId":"1"},
            {"id":"6","name":"vdcmanager","type":"SERVICE_ROLE","securityRoleType":null,"defaultRole":true,"description":"role_role_view_para_desc_content_orgmanager_value","vdcId":"1"}
        ]
    }

    var fancyUserList={
        "total":3,
        "userList":[
            {"id":"24","name":"tte","userType":null,"createTime":null,"onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null,"roleList":[]},
            {"id":"22","name":"Ohio","userType":null,"createTime":null,"onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null,"roleList":[]},
            {"id":"25","name":"ty2","userType":null,"createTime":null,"onLineStatus":null,"lockStatus":null,"defaultUser":null,"email":null,"phoneNumber":null,"description":null,"loginVdcId":null,"vdcId":null,"userRightType":null,"roleList":[]}
        ]
    }
    var domainUserList = {
        "userOnDomain": [
            {"userId": "3", "domainPrivileges": [null], "userName": "zhangjianmei", "createTime": null, "userDesc": "null"},
            {"userId": "2", "domainPrivileges": [null], "userName": "geadmin", "createTime": null, "userDesc": "default user"},
            {"userId": "48", "domainPrivileges": [null], "userName": "tab", "createTime": null, "userDesc": "null"},
            {"userId": "1", "domainPrivileges": [null], "userName": "admin", "createTime": null, "userDesc": "default user"},
            {"userId": "43", "domainPrivileges": [null], "userName": "caoyu", "createTime": null, "userDesc": "null"},
            {"userId": "42", "domainPrivileges": [null], "userName": "tangkan", "createTime": null, "userDesc": "null"},
            {"userId": "44", "domainPrivileges": [null], "userName": "qiuyang", "createTime": null, "userDesc": "null"},
            {"userId": "41", "domainPrivileges": [null], "userName": "zz", "createTime": null, "userDesc": "null"},
            {"userId": "47", "domainPrivileges": [null], "userName": "zhangyajun", "createTime": null, "userDesc": "null"},
            {"userId": "40", "domainPrivileges": [null], "userName": "zx", "createTime": null, "userDesc": "null"}
        ],
        "total": 11
    }

    var passwordPolicyData = {
        "minPasswordLength": 8,
        "maxPasswordLength": 32,
        "requireSymbols": true,
        "allowUserName": false,
        "reuseNum": 5,
        "validity": 90,
        "forciblyModifyPassword": 0,
        "minInterval": 5,
        "hintDays": 7,
        "wrongPassNum": 5,
        "wrongPassPeriod": 5,
        "lockDuration": 10
    };

    var reportData = {
        "reportList": [
            {
                "id": "1",
                "reportName": "<b>server</b>",
                "reportType": "<b>server</b>设备报表",
                "maxReportNum": "10",
                "reportPeriodType": "daily",
                "day": 3,
                "time": "02:30:10",
                "status": "enable",
                "operation": ""
            },
            {
                "id": "2",
                "reportName": "physical-host",
                "reportType": "设备报表",
                "maxReportNum": "<b>server</b>10",
                "reportPeriodType": "weekly",
                "day": 3,
                "time": "02:30:10",
                "status": "enable",
                "operation": ""
            },
            {
                "id": "3",
                "reportName": "cluster",
                "reportType": "虚拟化报表",
                "maxReportNum": "10",
                "reportPeriodType": "monthly",
                "day": 13,
                "time": "02:30:10",
                "status": "true",
                "operation": ""
            },
            {
                "id": "4",
                "reportName": "virtual-host",
                "reportType": "虚拟化报表",
                "maxReportNum": "10",
                "reportPeriodType": "daily",
                "day": 0,
                "time": "02:30:10",
                "status": "false",
                "operation": ""
            },
            {
                "id": "5",
                "reportName": "vm",
                "reportType": "虚拟化报表",
                "maxReportNum": "10",
                "reportPeriodType": "daily",
                "day": 0,
                "time": "02:30:10",
                "status": "true",
                "operation": ""
            },
            {
                "id": "6",
                "reportName": "network",
                "reportType": "网络报表",
                "maxReportNum": "10",
                "reportPeriodType": "daily",
                "day": 0,
                "time": "02:30:10",
                "status": "false",
                "operation": ""
            }
        ],
        "customReportList": [
            {
                "id": "1",
                "reportName": "<b>server</b>server",
                "reportType": "<b>server</b>resource",
                "objType": "zone",
                "occurTime": "02:30:10",
                "userName": "<b>server</b>xzy",
                "metrics": ["cpu_reserverate", "mem_reserverate", "storage_usage"],
                "operation": ""
            },
            {
                "id": "2",
                "reportName": "vm",
                "reportType": "<b>server</b>resource",
                "objType": "zone",
                "occurTime": "02:30:10",
                "userName": "xzy",
                "metrics": ["cpu_reserverate", "mem_reserverate", "storage_usage"],
                "operation": ""
            },
            {
                "reportName": "host",
                "reportType": "resource",
                "objType": "zone",
                "occurTime": "02:30:10",
                "userName": "xzy",
                "metrics": ["cpu_reserverate", "mem_reserverate", "storage_usage"],
                "operation": ""
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 0
    };
    var privilegeList;
    privilegeList = {
        "privilegeList": [
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
        ]};


    var azList = [
        {
            id: "AZ1",
            name: "xian_AZ01",
            description: "server This is xian_AZ01"
        },
        {
            id: "AZ2",
            name: "shenzhen_AZ01",
            description: "This is shenzhen_AZ01"
        }
    ];
    var azInfos = [
        {
            azId: "AZ1",
            azName: "xian_AZ01",
            azDesc: "server This is xian_AZ01",
            cloudInfrasId:"111",
            cloudInfrasName:"name",
            cloudInfrasRegion:"region"
        },
        {
            azId: "AZ2",
            azName: "shenzhen_AZ01",
            azDesc: "This is shenzhen_AZ01",
            cloudInfrasId:"222",
            cloudInfrasName:"name",
            cloudInfrasRegion:"region"
        }
    ];

    var memberList = [
        {
            id: "user3",
            name: "server xzy",
            roleList: [
                {"id": "server role1", "name": "server admin"},
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
    var statistics={
        "CPU":{"quotaUtilizationInfo":[{"vdcName":"1","utilizationValue":null},{"vdcName":"4","utilizationValue":null},{"vdcName":"9","utilizationValue":null},{"vdcName":"2","utilizationValue":null},{"vdcName":"6","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"1","utilizationValue":"0"},{"vdcName":"4","utilizationValue":"0"},{"vdcName":"9","utilizationValue":"0"}]},
        "MEMORY":{"quotaUtilizationInfo":[{"vdcName":"9","utilizationValue":null},{"vdcName":"1","utilizationValue":null},{"vdcName":"4","utilizationValue":null},{"vdcName":"2","utilizationValue":null},{"vdcName":"8","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"9","utilizationValue":"0"},{"vdcName":"1","utilizationValue":"0"},{"vdcName":"4","utilizationValue":"0"}]},
        "STORAGE":{"quotaUtilizationInfo":[{"vdcName":"8","utilizationValue":null},{"vdcName":"3","utilizationValue":null},{"vdcName":"6","utilizationValue":null},{"vdcName":"zx","utilizationValue":null},{"vdcName":"7","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"8","utilizationValue":"0"},{"vdcName":"3","utilizationValue":"0"},{"vdcName":"6","utilizationValue":"0"}]},
        "VPC":{"quotaUtilizationInfo":[{"vdcName":"8","utilizationValue":null},{"vdcName":"zx","utilizationValue":null},{"vdcName":"1","utilizationValue":null},{"vdcName":"9","utilizationValue":null},{"vdcName":"6","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"8","utilizationValue":"0"},{"vdcName":"zx","utilizationValue":"0"},{"vdcName":"1","utilizationValue":"0"}]},
        "EIP":{"quotaUtilizationInfo":[{"vdcName":"8","utilizationValue":null},{"vdcName":"7","utilizationValue":null},{"vdcName":"4","utilizationValue":null},{"vdcName":"1","utilizationValue":null},{"vdcName":"2","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"8","utilizationValue":"0"},{"vdcName":"7","utilizationValue":"0"},{"vdcName":"4","utilizationValue":"0"}]},
        "SEG":{"quotaUtilizationInfo":[{"vdcName":"8","utilizationValue":null},{"vdcName":"9","utilizationValue":null},{"vdcName":"zx","utilizationValue":null},{"vdcName":"1","utilizationValue":null},{"vdcName":"6","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"8","utilizationValue":"0"},{"vdcName":"9","utilizationValue":"0"},{"vdcName":"zx","utilizationValue":"0"}]},
        "VM":{"quotaUtilizationInfo":[{"vdcName":"1","utilizationValue":null},{"vdcName":"4","utilizationValue":null},{"vdcName":"2","utilizationValue":null},{"vdcName":"9","utilizationValue":null},{"vdcName":"5","utilizationValue":null}],"resourceUtilizationInfo":[{"vdcName":"vdc124","utilizationValue":"63"},{"vdcName":"vdc","utilizationValue":"38"},{"vdcName":"1","utilizationValue":"0"},{"vdcName":"4","utilizationValue":"0"},{"vdcName":"2","utilizationValue":"0"}]}
}
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

        "GET /goku/rest/v1.5/1/users/{id}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in usersDetails) {
                var userDeatail = usersDetails[index];
                if (index === id) {
                    res = userDeatail;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        "PUT /goku/rest/v1.5/1/users/{id}/lock-status": function (request, response) {
            response(200, "success", {}, {})
        },

        "PUT /goku/rest/v1.5/1/users/{id}": function (request, response) {
            response(200, "success", {}, {})
        },

        "DELETE /goku/rest/v1.5/1/users/{id}": function (request, response) {
            response(200, "success", {}, {})
        },

        "PUT /goku/rest/v1.5/1/users/{id}/password?action=reset": function (request, response) {
            response(200, "success", {}, {})
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
                "domainType": "Local authentication",
                "lockState": "Unlock",
                "userLocked": false,
                "onlineState": "Online",
                "createTime": createTime,
                "startDate": "2014-1-17",
                "endDate": "2014-1-18",
                "startTime": "12:20:30",
                "endTime": "12:20:50",
                "ipAddress": "192.168.26.42",
                "description": "This is an administrator user",
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

        "GET /uportal/org/query/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in orgData.vdcList) {
                var org = orgData.vdcList[index];
                if (org.id === id) {
                    res.id = org.id;
                    res.orgName = org.orgName;
                    res.createTime = org.createTime;
                    res.orgDesc = org.orgDesc;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        "POST /goku/rest/v1.5/vdcs": function (request, response) {

            var requestParse = JSON.parse(request.data);
            var id = "" + (orgData.vdcList.length + 1);
            var name = requestParse.name;
            var myDate = new Date();
            var createTime ="";
            var description = requestParse.description;
            var org = {
                "id": id,
                "name": name,
                "memberCount": 10,
                "createTime": createTime,
                "description": description,
                "operation": ""
            };
            orgData.vdcList.push(org);

            response(200, "success", {"vdcId": id}, {})
        },

        "POST /uportal/org/modify": function (request, response) {
            var id = request.data.id;
            var name = request.data.orgName;
            var description = request.data.orgDesc;
            var res = {};

            for (var index = 0; index < orgData.vdcList.length; index++) {
                if (orgData.vdcList[index].id === id) {
                    orgData.vdcList[index].orgName = name;
                    orgData.vdcList[index].orgDesc = description;
                }
            }
            response(200, "success", {}, {})
        },

        "GET /goku/rest/v1.5/1/roles/SYSTEM_ROLE/privileges": function (request, response) {
            response(200, "success", privilegeList, {})
        },
        "GET /goku/rest/v1.5/1/roles?start=0&limit=10": function (request, response) {
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
        "GET /goku/rest/v1.5/1/roles?roleType=SYSTEM_ROLE": function (request, response) {
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
        "GET /goku/rest/v1.5/1/roles?type=SYSTEM_ROLE": function (request, response) {
            var res = {};
            res=roleTypes;
            response(200, "success", res, {})
        },
        "POST /goku/rest/v1.5/1/users": function (request, response) {
            var res = {};
            response(200, "success", res, {})
        },
        "DELETE /goku/rest/v1.5/1/roles/{id}": function (request, response) {
            var res = {};
            response(200, "success", res, {})
        },
    "GET /goku/rest/v1.5/1/roles?type=SERVICE_ROLE": function (request, response) {
            var curPage = 1;
            var displayLength = 10;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.total = roleService.roleList.length;
            res.roleList = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < roleService.roleList.length; index++) {
                res.roleList.push(roleService.roleList[index])
            }
            response(200, "success", res, {})
        },
        "GET /goku/rest/fancy/v1.5/{tenant_id}/users/list": function (request, response) {
            response(200, "success", fancyUserList, {})
        },
        "GET /goku/rest/fancy/v1.5/{tenant_id}/domains/{id}/users": function (request, response) {
            response(200, "success", domainUserList, {})
        },
        "POST /goku/rest/v1.5/1/roles": function (request, response) {
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

        "PUT /goku/rest/v1.5/1/roles/{id}": function (original, response) {
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

        "GET /goku/rest/v1.5/1/roles/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in roleData.roleList) {
                var item = roleData.roleList[index];
                if (item.id == id) {
                    var role = {};
                    role.id = item.id;
                    role.name = item.name;
                    role.type = item.type;
                    role.desc = item.desc;
                    role.privilegeInfo = item.privilegeInfo;
                    res.roleInfo = role;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        "POST /uportal/passwordPolicy/save": function (request, response) {
            var params = request.params;
            passwordPolicyData.pwdPolicy = params;
            response(200, "success", {}, {})
        },

        "GET /goku/rest/v1.5/system/password-policy": function (request, response) {
            response(200, "success", passwordPolicyData, {})
        },
        "PUT /goku/rest/v1.5/system/password-policy": function (request, response) {
            var params = request.params;
            passwordPolicyData.pwdPolicy = params;
            response(200, "success", {}, {})
        },

        "GET /goku/rest/v1.5/irm/reports/asset-configs": function (request, response) {
            var res = {};
            res.reportConfigList = reportData.reportList;
            response(200, "success", res, {})
        },
        "POST /goku/rest/v1.5/irm/reports/asset-configs?action={action}": function (request, response) {
            var res = {};
            res.reportConfigList = reportData.reportList;
            response(200, "success", res, {})
        },
        "GET  /goku/rest/v1.5/irm/reports/custom-reports": function (request, response) {
            var res = {};
            res.reportConfigList = reportData.customReportList;
            response(200, "success", res, {})
        },
        "DELETE /goku/rest/v1.5/irm/reports/custom-reports/{id}": function (request, response) {
            response(200, "success", {}, {})
        },
        "PUT /goku/rest/v1.5/irm/reports/custom-reports/{id}": function (request, response) {
            response(200, "success", {}, {})
        },
        "POST  /goku/rest/v1.5/irm/reports/custom-reports": function (request, response) {
            response(200, "success", {}, {})
        },
        "POST  /goku/rest/v1.5/irm/reports/asset-reports/realtime/file?resconfigname=server&locale=zh_CN": function (request, response) {
            response(200, "success", {}, {})
        },
        "POST  /goku/rest/v1.5/irm/reports/asset-reports/realtime/file/status?resconfigname={resconfigname}": function (request, response) {
            var res = {};
            res.exportProgress = 50;
            res.exportStaus = "exporting";
            response(200, "success", res, {})
        },

        "GET /uportal/report/systemReportList/query/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in reportData.reportList) {
                var report = reportData.reportList[index];
                if (report.id === id) {
                    res = report;
                    break;
                }
            }
            response(200, "success", res, {})
        },
        "POST /goku/rest/v1.5/irm/reports/asset-configs/{id}?action=enable": function (original, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/irm/reports/asset-configs/{id}?action=disable": function (original, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/irm/reports/asset-configs/{id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "GET /goku/rest/v1.5/irm/1/availablezones": function (original, response) {
            var res = {};
            res.availableZones = azList;
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/vdcs/1/az": function (original, response) {
            var res = {};
            res.azInfos = azInfos;
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/vdcs/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in orgDetails) {
                var org = orgDetails[index];
                if (index === id) {
                    res = org;
                    break;
                }
            }
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/vdcs/{tenant_id}/cloud-infras": function (original, response) {
            var res = {};
            res.azInfos = azInfos;
            response(200, "success", res, {})
        },

        "POST /goku/rest/v1.5/1/users/list": function (original, response) {
            var res = {"userList": userData.userList};
            response(200, "success", res, {})
        },
        //查询域
        "GET /goku/rest/v1.5/{vdc_id}/domains": function (original, response){
            var res = {};
            res.domainList = domainList.domainList;
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/1/domains": function (original, response) {
            var res = {};
            res.domainList = domainList.domainList;
            response(200, "success", res, {})
        },
        "PUT /goku/rest/v1.5/1/domains/{id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "DELETE /goku/rest/v1.5/1/domains/{id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "GET /goku/rest/v1.5/1/domains/{id}": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in domainList.domainList) {
                var domain = domainList.domainList[index];
                if (domain.domainId === id) {
                    res.domainInfo = domain;
                    break;
                }
            }
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/1/domains/{id}": function (original, response) {
            var res = {
                "domainId": "domain1",
                "domainName": "<b>server</b>xian doamin",
                "domainDesc": "<b>server</b>这是西安域",
                "createTime": "2014-04-03 14:24:53 UTC+08:00"
            };
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/1/domains/{id}/users?start=0&limit=10": function (request, response) {
            var id = fixture.getId(request);
            var res = {};
            for (var index in domainUser) {
                var domain = domainUser[index];
                if (index === id) {
                    res = domain;
                    break;
                }
            }
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/1/domains/{id}/users?start=0&limit=10": function (original, response) {
            var res = {
                "domainId": "domain1",
                "domainName": "<b>server</b>xian doamin",
                "domainDesc": "<b>server</b>这是西安域",
                "createTime": "2014-04-03 14:24:53 UTC+08:00"
            };
            response(200, "success", domainUser, {})
        },
        "DELETE /goku/rest/v1.5/1/domains/{domainId}/users/{userId}": function (original, response) {
            var res = {};
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/vdcs/{vdc_id}/users/{user_id}/roles": function (original, response) {
            var userId = original.data.user_id;
            var res = {};
            for (var index in vdcRole) {
                var user = vdcRole[index];
                if (userId === index) {
                    res = user;
                    break;
                }
            }
            response(200, "success", res, {})
        },
        "PUT /goku/rest/v1.5/vdcs/{vdc_id}/users/{user_id}/roles": function (original, response) {
            var res = {};
            response(200, "success", res, {})
        },
        "DELETE /goku/rest/v1.5/vdcs/{vdc_id}/users/{user_id}": function (original, response) {
            var res = {};
            response(200, "success", res, {})
        },
        "GET /goku/rest/v1.5/1/privileges?user-id={userId}&domain-privilege=true": function (original, response) {
            response(200, "success", {"privilegeList": domainUserPrivilege}, {})
        },
        "PUT /goku/rest/v1.5/vdcs/{id}": function (original, response) {
            var res = {};
            response(200, "success", res, {})
        },
        "PUT /goku/rest/v1.5/{vdc_id}/domains/{id}/users/{user_id}": function (original, response) {
            response(200, "success", {}, {})
        },
        "PUT /goku/rest/v1.5/irm/{vdc_id}/resourceclusters": function (original, response) {
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/irm/{vdc_id}/resourceclusters": function (original, response) {
            var item = {
                rid: "",
                zoneId: "",
                hypervisorId: "",
                hypervisorName: "",
                name: "",
                description: "",
                type: 2,
                domain: "",
                createType: 1,
                id: "",
                indexId: "",
                createTime: undefined,
                lastModifiedTime: "",
                domainId: "",
                availableZoneId: ""
            };
            var resourceClusters = [];
            for (var i = 0; i < 14; i++) {
                resourceClusters.push($.extend({}, item, {
                    name: "<b>cluster_</b>" + i,
                    description: "<b>cluster_</b>description_" + i,
                    id: i
                }));
            }
            response(200, "success", items, {});
        },
        "POST /goku/rest/v1.5/irm/{vdc_id}/resourceclusters/action": function (original, response) {
            var result = {
                "list":{
                    "sort":"id","order":"desc","start":0,"total":2,"size":10,"resourceClusters":[
                        {
                            "rid":"4DA80840029","zoneId":"461618961805475840102901001",
                            "hypervisorId":"462970041693686988902901","hypervisorName":"FCVE_R5CA001","name":"manageRC_A01",
                            "description":"Xi'an cluster resources","type":"1","domain":"xian","createType":1,
                            "id":"4629700416936869889029","indexId":"4629700416936869889",
                            "createTime":"2014-09-10 07:21:34","lastModifiedTime":"2014-09-25 08:30:02","domainId":"1029",
                            "availableZoneId":"4616189618054758401029001","tags":[{"name":"SLA","value":"SILVER"}]
                        },
                        {"rid":"4DA808400755","zoneId":"","hypervisorId":"4616189618054758401075501001","hypervisorName":"FCVE_R5CA001",
                            "name":"metalRC_A01","description":"Shenzhen cluster resources","type":"2","domain":"shenzhen","createType":1,
                            "id":"46297004169368698890755","indexId":"4629700416936869889",
                            "createTime":"2014-10-10 09:36:24","lastModifiedTime":"2014-09-10 06:30:02","domainId":"10755","availableZoneId":"46161896180547584010755001",
                            "tags":[{"name":"SLA","value":"SILVER"}]}
                    ]
                }
            }
            response(200, "success", result, {});
        },
        "POST /goku/rest/v1.5/irm/1/zones/461618961805475840102901001/resources/action": function (original, response) {
              var result =
              {

              }
              response(200, "success", result, {});
        },

        //虚拟机列表
        "POST /goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}": function (original, response) {
            var data = JSON.parse(original.data);
            if (!data.list) {
                response(200, "success", ret, {});
                return;
            }

            var start = parseInt(data.list.start, 10);
            var limit = parseInt(data.list.limit, 10);
            var condition = data.list.condition;

            var ret = {
                code: "0",
                message: "",
                list: {
                    total: 50,
                    vms: []
                }
            };
            if ($.trim(condition)) {
                _.each(vmList.data, function (item) {
                    if (item.name.indexOf($.trim(condition)) >= 0) {
                        ret.list.vms.push(item);
                    }
                });
                ret.total = ret.list.vms.length;
            } else {
                !start && (start = 0);
                !limit && (limit = 2);
                for (var i = start; i < start + limit; i++) {
                    var vm = {
                        "id": "vm-" + i,
                        "rid": "vm-rid-" + i,
                        "resourcePoolId": "cloudInfra01",
                        "name": "Virtual Machine" + i,
                        "status": i % 2 ? "running" : "stopped",
                        "type": "fusionmanager",
                        "availableZoneId": "az01",
                        "availableZoneName": "ShenZhen AZ01",
                        "createTime": "2013-12-30 10:10",
                        "expiryTime": "2014-12-30 10:10",
                        "creatorId": "user_hwz",
                        "vdcId": "org001",
                        "tag": "Label" + i,
                        "osVersion": "SUSE11SP1 64bit",
                        "vappId": 0,
                        "vmSpecInfo": {
                            id: "VMconfigid01",
                            cpuCount: 2,
                            cpuRebootCount: 2,
                            memoryCount: 2048,
                            memoryRebootCount: 2048,
                            volumes: [
                                {
                                    name: "Disk 01",
                                    size: 20.0
                                },
                                {
                                    name: "Disk 02",
                                    size: 30.0
                                }
                            ],
                            nics: [
                                {
                                    name: "Nic 01",
                                    ip: "192.168.12.12",
                                    mac: "12:22:AE:E2:33:22",
                                    ipv6s: []
                                }
                            ]
                        }
                    };
                    ret.list.vms.push(vm);
                }
            }

            response(200, "success", ret, {});
        },

        "GET /goku/rest/v1.5/{tenant_id}/available-zones?start={start}&manage-status={manage_status}&service-status={service_status}": function (original, response) {
            var rtn = {
                "total": 1,
                "availableZones": [
                    {
                        "id": "4616189618054758401",
                        "cloudInfraId": "38", "cloudInfraName": "Shenzhen_FM",
                        "name": "AZ_01", "description": null, "manageStatus": "occupied",
                        "serviceStatus": "normal", "associatedOrgNum": 2,
                        "tags": {
                            "datastore": [
                                {"name": "FusionManager_MediaType", "value": "SAN-Any"}
                            ]
                        }
                    }
                ]};
            response(200, "success", rtn, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/available-external-networks": function (original, response) {
            var externalNetworkTypes = [1, 2, 3];//1:vlan类型 2:普通子网 3:超级子网
            var protocolTypes = ["IPv4", "IPv6", "DualStack"];
            var status = ["READY", "DELETING", "PENDING", "FAIL", "UPDATING", "UPDATEFAIL"];
            var rtn = {
                externalNetworks: [
                    {
                        exnetworkID: "a",
                        name: "Net01",
                        description: "This is IP",
                        externalNetworkType: externalNetworkTypes[0],
                        vlans: [20, 30, 42],
                        totalBoundNics: 12,
                        protocolType: protocolTypes[0],
                        ipv4Subnet: "562",
                        ipv6Subnet: "66",
                        connectToInternetFlag: true,
                        status: status[1],
                        appointed: false
                    },{
                        exnetworkID: "b",
                        name: "Net02",
                        description: "",
                        externalNetworkType: externalNetworkTypes[1],
                        vlans: [1, 2, 4],
                        totalBoundNics: 12,
                        protocolType: protocolTypes[0],
                        ipv4Subnet: "356",
                        ipv6Subnet: "215",
                        connectToInternetFlag: true,
                        status: status[1],
                        appointed: false
                    }
                ],
                total: 2,
                allExtenalNetwork: false
            };
            response(200, "success", rtn, {})
        },

        "GET /goku/rest/v1.5/capacity-statistics/users-state": function (original, response) {
            response(200, "success", {"onlineUsers": 2,"offlineUsers":12}, {})
        },

        "POST /goku/rest/v1.5/{vdc_id}/available-external-networks/action": function (original, response) {
            response(200, "success", {}, {})
        },

        //VDC资源统计
        "GET /goku/rest/v1.5/capacity-statistics/top-vdcs?type={statisticsType}": function (original, response) {
            var res={};
            for (var index in statistics) {
                if(original.url.indexOf(index)>0){
                    res=statistics[index];
                    break;
                }
            }
            response(200, "success", res, {})
        },

        //创建vdc选择可用分区
        "GET /goku/rest/v1.5/{tenant_id}/available-zones": function (original, response) {
            var result = {
                "total":1,
                "availableZones":[
                    {
                        "id":"4616189618054758401",
                        "cloudInfraId":"34",
                        "cloudInfraName":"fm",
                        "name":"az",
                        "description":null,
                        "manageStatus":"occupied",
                        "serviceStatus":"normal",
                        "associatedOrgNum":0,
                        "tags":{
                            "datastore":[
                                {
                                    "name":"FusionManager_MediaType",
                                    "value":"SAN-Any"
                                }
                            ]
                        }
                    },
                    {
                        "id":"4616189618054758402",
                        "cloudInfraId":"35",
                        "cloudInfraName":"fm",
                        "name":"az01",
                        "description":null,
                        "manageStatus":"occupied",
                        "serviceStatus":"normal",
                        "associatedOrgNum":0,
                        "tags":{
                            "datastore":[
                                {
                                    "name":"FusionManager_MediaType",
                                    "value":"SAN-Any"
                                }
                            ]
                        }
                    }
                ]
            };
            response(200, "success", result, {})
        },



        "POST /goku/rest/v1.5/vdcs/{vdcId}/users/action": function (original, response) {
            response(200, "success", {}, {})
        },
        "POST /goku/rest/v1.5/vdcs/{id}/cloud-infras": function (original, response) {
            response(200, "success", {}, {})
        }
    });

    return fixture;
});