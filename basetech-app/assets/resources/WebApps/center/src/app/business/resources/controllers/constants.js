/**
 * 常量定义
 */
define([""], function () {

    var result = {

        "rest": {
            // 虚拟机规格
            "VM_SPEC_CREATE": {
                url: " /goku/rest/v1.5/sr/{tenant_id}/vm-flavors",
                type: "POST"
            },
            "VM_SPEC_QUERY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-flavors",
                type: "GET"
            },
            "VM_SPEC_DELETE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-flavors/{id}",
                type: "DELETE"
            },
            "VM_SPEC_MODIFY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-flavors/{id}",
                type: "PUT"
            },
            "VM_SPEC_DETAIL": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-flavors/{id}",
                type: "GET"
            },
            "VM_SPEC_CHECKDELETE": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/servers/detail",
                type: "GET"
            },

            // VPC规格
            "VPC_SPEC_CREATE": {
                url: "/goku/rest/v1.5/{tenant_id}/vpcspectemplates",
                type: "POST"
            },
            "VPC_SPEC_MODIFY": {
                url: "/goku/rest/v1.5/{tenant_id}/vpcspectemplates/{id}",
                type: "PUT"
            },
            "VPC_SPEC_QUERY": {
                url: "/goku/rest/v1.5/{tenant_id}/vpcspectemplates",
                type: "GET"
            },
            "VPC_SPEC_DETAIL": {
                url: "/goku/rest/v1.5/{tenant_id}/vpcspectemplates/{id}",
                type: "GET"
            },
            "VPC_SPEC_DELETE": {
                url: "/goku/rest/v1.5/{tenant_id}/vpcspectemplates/{id}",
                type: "DELETE"
            },

            // 虚拟机模板
            "VM_TEMPLATE_QUERY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates",
                type: "GET"
            },
            "VM_TEMPLATE_DELETE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}",
                type: "DELETE"
            },
            "VM_TEMPLATE_DETAIL": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}",
                type: "GET"
            },
            "VM_TEMPLATE_CREATE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates",
                type: "POST"
            },
            "VM_TEMPLATE_MODIFY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}",
                type: "POST"
            },
            "VM_TEMPLATE_ATTACHISO": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_DETTACHISO": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_CONVERT_VM": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action",
                type: "GET"
            },
            "VM_TEMPLATE_CONVERT_TO_VMT": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_SYNC": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_DEASSOCIATE": {
                url: " /goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_ASSOCIATE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vmtemplates/{id}/action",
                type: "POST"
            },
            "VM_TEMPLATE_CONVERT_COMMON": {
                url: "/resources/template/vmTemplate/convertToCommon",
                type: "GET"
            },
            "VM_TEMPLATE_CONVERT_GLOBAL": {
                url: "/resources/template/vmTemplate/convertToGlobal",
                type: "GET"
            },
            "VM_TEMPLATE_DISCOVER": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vmtemplates/action",
                type: "POST"
            },
            "VM_TEMPLATE_MODIFY_BOOTOPTION": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/{id}",
                type: "PUT"
            },

            // 逻辑虚拟机模板
            "LOGIC_TEMPLATE_QUERY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates",
                type: "GET"
            },
            "LOGIC_TEMPLATE_DETAIL": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates/{id}",
                type: "GET"
            },
            "LOGIC_TEMPLATE_DELETE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates/{id}",
                type: "DELETE"
            },
            "LOGIC_TEMPLATE_CREATE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates",
                type: "POST"
            },
            "LOGIC_TEMPLATE_MODIFY": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates/{id}",
                type: "PUT"
            },
            "LOGIC_TEMPLATE_ACTIVE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates/{id}/actions",
                type: "POST"
            },
            "LOGIC_TEMPLATE_INACTIVE": {
                url: "/goku/rest/v1.5/sr/{tenant_id}/vm-logic-templates/{id}/actions",
                type: "POST"
            },
            "LOGIC_TEMPLATE_CLUSTER": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/resourceclusters",
                type: "GET"
            },

            "VSFTP_INFO": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/machine-account?type={type}",
                type: "get"
            },

            "VSFTP_INFO_TOP": {
                url: "/goku/rest/v1.5/{vdc_id}/machine-account?type={type}",
                type: "get"
            },

            // 应用模板
            "APP_TEMPLATE_QUERY": {
                url: "/resources/template/appTemplate/query",
                type: "GET"
            },
            "APP_TEMPLATE_DELETE": {
                url: "/resources/template/appTemplate/delete",
                type: "POST"
            },

            // 脚本
            "SCRIPT_QUERY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts",
                type: "GET"
            },
            "SCRIPT_DELETE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts/{scriptid}",
                type: "DELETE"
            },
            "SCRIPT_DETAIL": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts/{scriptid}",
                type: "GET"
            },
            "SCRIPT_CREATE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts",
                type: "POST"
            },
            "SCRIPT_MODIFY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts/{scriptid}",
                type: "PUT"
            },
            "SCRIPT_REPAIR": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts/{scriptid}/actions",
                type: "POST"
            },
            "SCRIPT_DISTRIBUTE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/scripts/{scriptid}",
                type: "POST"
            },

            "APP_RESOURCE_QUERY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/apps",
                type: "GET"
            },

            // 软件包
            "SOFTWARE_CREATE": {
                url: " /goku/rest/v1.5/ame/{tenant_id}/softwares",
                type: "POST"
            },
            "SOFTWARE_DELETE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares/{softwareid}",
                type: "DELETE"
            },
            "SOFTWARE_MODIFY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares/{softwareid}",
                type: "PUT"
            },
            "SOFTWARE_QUERY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares",
                type: "GET"
            },
            "SOFTWARE_DETAIL": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares/{softwareid}",
                type: "GET"
            },
            "SOFTWARE_REPAIR": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares/{softwareid}/actions",
                type: "GET"
            },
            "SOFTWARE_DISTRIBUTE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/softwares/{softwareid}",
                type: "POST"
            },
            "SOFTWARE_DISTRIBUTE_QUERYVM": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/list",
                type: "POST"
            },

            // ISO
            "ISO_CREATE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/isos",
                type: "POST"
            },
            "ISO_DELETE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/isos/{isoid}",
                type: "DELETE"
            },
            "ISO_QUERY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/isos",
                type: "GET"
            },
            "ISO_DETAIL": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/isos/{isoid}",
                type: "GET"
            },
            "ISO_MODIFY": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/isos/{isoid}",
                type: "PUT"
            },

            // zone
            "ZONE_CREATE": {
                url: "/resources/rpool/zone/create",
                type: "POST"
            },
            "ZONE_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/zones",
                type: "GET"
            },
            "ZONE_DELETE": {
                url: "/resources/rpool/zone/delete",
                type: "POST"
            },

            // zone
            "CLUSTER_ASSOCIATE": {
                url: "/resources/rpool/zone/cluster/associate",
                type: "POST"
            },
            "CLUSTER_QUERY": {
                url: "/resources/rpool/zone/cluster/query",
                type: "GET"
            },
            "CLUSTER_DELETE": {
                url: "/resources/rpool/zone/cluster/delete",
                type: "POST"
            },

            // availableZone
            "AZ_QUERY": {
                url: "/resources/rpool/zone/availableZone/query",
                type: "GET"
            },
            "AZ_DELETE": {
                url: "/resources/rpool/zone/availableZone/delete",
                type: "POST"
            },

            // DVS
            "DVS_CREATE": {
                url: "/goku/rest/v1.5/irm/dvses",
                type: "POST"
            },
            "DVS_UPDATE": {
                url: "/goku/rest/v1.5/irm/dvses/{id}",
                type: "PUT"
            },
            "DVS_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/dvses?start={start}&limit={limit}&name={name}&hypervisorid={hypervisorid}",
                type: "GET"
            },
            "DVS_DELETE": {
                url: "/goku/rest/v1.5/irm/dvses/{id}",
                type: "DELETE"
            },
            "DVS_ASSOCIATE": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vlanpools/action",
                type: "POST"
            },

            // 网络统计
            "NETWORK_VLAN_STATISTICS": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/vlanpools/statistics",
                type: "GET"
            },
            "NETWORK_PUBLICIP_STATISTICS": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/publicippools/statistics",
                type: "GET"
            },
            "NETWORK_VFIREWALL_STATISTICS": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/vfirewalls/statistics",
                type: "GET"
            },
            "NETWORK_VSA_MNETWOEK_STATISTICS": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/vsamgtnetworks/statistics",
                type: "GET"
            },

            // VSS
            "VSS_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/vsses?hypervisorid={hypervisorid}",
                type: "GET"
            },

            // VLAN池
            "VLAN_POOL_CREATE": {
                url: "/goku/rest/v1.5/irm/vlanpools",
                type: "POST"
            },
            "VLAN_POOL_UPDATE": {
                url: "/goku/rest/v1.5/irm/vlanpools/{id}",
                type: "PUT"
            },
            "VLAN_POOL_QUERY": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/vlanpools?start={start}&limit={limit}&name={name}",
                type: "GET"
            },
            "VLAN_POOL_DELETE": {
                url: "/goku/rest/v1.5/irm/vlanpools/{id}",
                type: "DELETE"
            },
            "VLAN_POOL_FOR_EXTERNAL_NETWORK": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vlanpools/action",
                type: "POST"
            },

            //VXLAN组播IP池查询
            "MULTICAST_IPPOOLS_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/multicast-ippools",
                type: "GET"
            },
            //VXLAN组播IP池删除
            "MULTICAST_IPPOOLS_DELETE": {
                url: "/goku/rest/v1.5/irm/multicast-ippools/{id}",
                type: "DELETE"
            },
            //VXLAN组播IP池修改
            "MULTICAST_IPPOOLS_UPDATE": {
                url: "/goku/rest/v1.5/irm/multicast-ippools/{id}",
                type: "PUT"
            },
            //VXLAN组播IP池创建
            "MULTICAST_IPPOOLS_CREATE": {
                url: "/goku/rest/v1.5/irm/multicast-ippools",
                type: "POST"
            },
            "MULTICAST_IPPOOLS_ALLOCATION": {
                url: " /goku/rest/v1.5/irm/multicast-ippools/{multicastippoolid}/multicastips?start={start}&limit={limit}",
                type: "GET"
            },
            // 物理机
            "DEDICATED_SERVERS_QUERY": {
                url: "/resources/rpool/zone/physical/dedicatedServers/query",
                type: "GET"
            },
            "DEDICATED_SERVERS_DELETE": {
                url: "/resources/rpool/zone/physical/dedicatedServers/delete",
                type: "POST"
            },

            // 外部网络
            "EXTERNAL_NETWORK_CREATE": {
                url: "/goku/rest/v1.5/irm/external-networks",
                type: "POST"
            },
            "EXTERNAL_NETWORK_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/external-networks?start={start}&limit={limit}&name={name}&dvsname={dvsname}&vlan={vlan}",
                type: "GET"
            },
            "EXTERNAL_NETWORK_DELETE": {
                url: "/goku/rest/v1.5/irm/external-networks/{id}",
                type: "DELETE"
            },
            "EXTERNAL_NETWORK_DETAIL": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/external-networks/{id}",
                type: "POST"
            },
            "DHCP_SERVER_CREATE": {
                url: "/goku/rest/v1.5/irm/dhcpservers",
                type: "POST"
            },
            "DHCP_SERVER_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/dhcpservers",
                type: "POST"
            },
            "DHCP_SERVER_MODIFY": {
                url: "/goku/rest/v1.5/irm/dhcpservers/{id}",
                type: "PUT"
            },
            "DHCP_SERVER_DELETE": {
                url: "/goku/rest/v1.5/irm/dhcpservers/{id}",
                type: "DELETE"
            },
            // zone > CPU
            "ZONE_DETAIL_CPU": {
                url: "/resources/rpool/zone/detail/cpu",
                type: "POST"
            },
            "ZONE_DETAIL_MEMORY": {
                url: "/resources/rpool/zone/detail/memory",
                type: "POST"
            },
            "ZONE_DETAIL_STORAGE": {
                url: "/resources/rpool/zone/detail/storage",
                type: "POST"
            },

            // 主存储
            "MAIN_STORAGE_QUERY": {
                url: "/resources/rpool/zone/physical/storage/mainStorage/query",
                type: "GET"
            },
            "MAIN_STORAGE_DELETE": {
                url: "/resources/rpool/zone/physical/storage/mainStorage/delete",
                type: "POST"
            },

            // 公网IP
            "PUBLIC_IP_CREATE": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/publicippools",
                type: "POST"
            },
            "PUBLIC_IP_QUERY": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/publicippools",
                type: "GET"
            },
            "PUBLIC_IP_DELETE": {
                url: "/goku/rest/v1.5/irm/publicippools/{id}",
                type: "DELETE"
            },
            "PUBLIC_IP_UPDATE": {
                url: "/goku/rest/v1.5/irm/publicippools/{id}",
                type: "PUT"
            },

            // vsa管理网络
            "VSA_MANAGER_CREATE": {
                url: "/goku/rest/v1.5/irm/vsamgtnetworks",
                type: "POST"
            },
            "VSA_MANAGER_MODIFY": {
                url: " /goku/rest/v1.5/irm/vsamgtnetworks/{id}",
                type: "PUT"
            },
            "VSA_MANAGER_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/vsamgtnetworks",
                type: "GET"
            },
            "VSA_MANAGER_DELETE": {
                url: "/goku/rest/v1.5/irm/vsamgtnetworks/{id}",
                type: "DELETE"
            },
            //VTEP
            "VTEP_CREATE": {
                url: "/goku/rest/v1.5/irm/vtepnetworks",
                type: "POST"
            },
            "VTEP_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/vtepnetworks",
                type: "GET"
            },
            "VTEP_DELETE": {
                url: "/goku/rest/v1.5/irm/vtepnetworks/{id}",
                type: "DELETE"
            },
            "VTEP_UPDATE": {
                url: "/goku/rest/v1.5/irm/vtepnetworks/{id}",
                type: "PUT"
            },
            "VTEP_DVS_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/dvses?start={start}&limit={limit}&hypervisortype={hypervisortype}&dvstype={dvstype}",
                type: "PUT"
            },
            // 虚拟防火墙查询
            "VIRTUAL_FIREWALL_QUERY": {
                url: "/goku/rest/v1.5/irm/zones/{zoneid}/vfirewalls?&type={type}&start={start}&limit={limit}",
                type: "GET"
            },
            //配置公网访问虚拟机
            "DNAT_OPERATE": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/dnats/action",
                type: "POST"
            },

            // VLB池
            "VLB_POOL_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/elbs",
                type: "GET"
            },
            "LOAD_BALANCER_QUERY": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances/{id}",
                type: "GET"
            },

            // 虚拟化环境
            "VMT_HYPERVISOR_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/hypervisors/action",
                type: "POST"
            },
            "VMT_HYPERVISOR_DETAIL": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/hypervisors/{id}",
                type: "GET"
            },
            "VMT_CLUSTER_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/resourceclusters/action",
                type: "POST"
            },
            "VMT_HOST_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/hosts",
                type: "POST"
            },
            "VMT_DATASTORE_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/datastores",
                type: "POST"
            },
            "VMT_VNCINFO_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vm/{id}",
                type: "GET"
            },
            "VMT_DISK_CONFIG_QUERY": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/volumes/action",
                type: "POST"
            },
            "VMT_VM_ACTION": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/action",
                type: "POST"
            },
            "VMT_VM_OSVERSION_INFO": {
                url: "/goku/rest/v1.5/irm/{tenant_id}/vms/action",
                type: "POST"
            },
            "REST_HEART_BEAT": {
                url: "/goku/rest/heartbeat",
                type: "GET"
            },
            "QUERY_REPOSITORY_SPACE": {
                url: "/goku/rest/v1.5/ame/{tenant_id}/repository",
                type: "GET"
            },

            // openstack
            "ENDPOINT_QUERY": {
                url: "/goku/rest/v1.5/openstack/endpoint",
                type: "GET"
            },
            "ENDPOINT_MODIFY": {
                url: "/goku/rest/v1.5/openstack/endpoint",
                type: "PUT"
            },
            "ENDPOINT_ADD": {
                url: "/goku/rest/v1.5/openstack/endpoint",
                type: "PUT"
            },
            "TOKEN_QUERY": {
                url: "/goku/rest/v1.5/token",
                type: "GET"
            },

            // image
            "IMAGE_QUERY": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/images",
                type: "GET"
            },
            "IMAGE_DETAIL": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/images/{id}",
                type: "GET"
            },
            "IMAGE_CREATE": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/images",
                type: "POST"
            },
            "IMAGE_UPLOAD": {
                url: "/goku/rest/v1.5/{service_id}/sr/images/{id}/file",
                type: "PUT"
            },
            "IMAGE_DELETE": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/images/{id}",
                type: "DELETE"
            },
            "IMAGE_MODIFY": {
                url: "/goku/rest/v1.5/sr/images/{id}",
                type: "PATCH"
            },
            "IMAGE_EXPORT": {
                url: "/goku/rest/v1.5/sr/images/{id}/file",
                type: "GET"
            },
            "IMAGE_DOWNLOAD": {
                url: "/goku/rest/v1.5/sr/images/{id}/file",
                type: "GET"
            },
            "IMAGE_CLEAR": {
                url: "/goku/rest/v1.5/sr/images/{id}/file",
                type: "DELETE"
            },

            // flavor
            "FLAVOR_QUERY": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/detail",
                type: "GET"
            },
            "FLAVOR_CREATE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/tenantid/{tenant_id}/openstack-flavors",
                type: "POST"
            },
            "FLAVOR_DELETE": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/{id}",
                type: "DELETE"
            },

            // 云主机启动源
            "START_SOURCE_QUERY": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/{id}/os-extra_specs/{key}",
                type: "get"
            },
            "START_SOURCE_QUERY_ALL": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/{id}/os-extra_specs",
                type: "get"
            },
            "START_SOURCE_CREATE": {
                url: "/goku/rest/v1.5/openstack/{service_id}/v2/{tenant_id}/flavors/{id}/os-extra_specs",
                type: "POST"
            }
        },
        "config": {
            "SERVICE": window.location.hostname,
            "UPORTAL": "",
            "SOFTWARE_MAX_SIZE": 4,
            "SOFTWARE_MAX_COUNT": 10000,
            "EXERNAL_NETWORK_TYPE": {
                "vlan": "1", "subnet": "2", "superSubnet": "3"
            },
            "EXERNAL_NETWORK_TYPE_STR": {
                1: "VLAN ", 2: "resource_term_SubnetCommonVLAN_label", 3: "resource_term_SubnetSuperVLAN_label"
            },
            "OUT_TRAFFIC_PRIORITY": {
                7: "common_term_low_label", 4: "common_term_middling_label", 2: "common_term_high_label"
            },
            "IP_ALLOCATE_POLICY": {
                "external": "0", "internal": "1", "manual": "2", "staticInjection": "3", "autoLayout": "4"},
            "IP_ALLOCATE_POLICY_STR": {
                0: "resource_term_externalDHCP_label", 1: "common_term_innerDHCP_label", 2: "common_term_manual_label", 3: "vpc_term_staticInjection_label", 4: "resource_exter_add_para_allocationIP_mean_noStatusAuto_label"},
            "EXT_NETWORK_STATUS": {
                "READY": "common_term_natural_value", "DELETING": "common_term_deleting_value", "PENDING": "common_term_creating_value", "FAIL": "common_term_fail_label", "UPDATING": "common_term_updating_value", "UPDATEFAIL": "common_term_modifyFail_value"
            },
            "PROTOCOL_TYPE": {"ipv4": "IPv4", "ipv6": "IPv6", "dual": "DualStack"},
            "DVS_TYPE": {"VSWITCH": "common_term_commonMode_label", "ESWITCH_VMAQ": "common_term_directConnectMode_label"},
            "VLAN_USAGE": {"business": "common_term_serviceVLAN_label", "management": "resource_vlan_add_para_type_option_connectDevice_msg"},
            "DATASTORE_ACCESSIBLE": {"true": "可用", "false": "不可用"},
            "DATASTORE_MAINTENANCE": {"true": "是", "false": "否"},
            "DATASTORE_THIN": {"true": "支持", "false": "不支持"},
            "DATASTORE_TYPE": {"NFS": "NAS存储", "NAS": "NAS存储", "advanceSan": "Advance San", "LOCAL": "本地硬盘", "LOCALPOME": "虚拟化本地存储", "SAN": "SAN存储", "LUNPOME": "虚拟化SAN存储", "LUN": "裸设备映射存储", "DSWARE": "FusionStorage"},
            "DHCP_SERVER_STATUS": {'READY': "common_term_ready_value", 'PENDING': "common_term_creating_value", 'DELETING': "common_term_deleting_value", 'FAIL': "common_term_fail_label", 'REPAIRING': "common_term_restoring_value", 'REPAIRFAIL': "common_term_restorFail_value", 'MODIFYFAIL': "common_term_modifyFail_value", 'MODIFYING': "common_term_modifing_value"}
        },
        "constructUrl": function (s, o) {
            var subRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
            return ((s.replace) ? s.replace(subRegRex, function (match, key) {
                return (!angular.isUndefined(o[key])) ? o[key] : match;
            }) : s);
        },
        "getUportalInfo": function () {
            var key = "JSESSIONID";
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, key.length + 1) == (key + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(key.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }
    };

    result.config.UPORTAL = result.getUportalInfo();
    return result;

});
