/* global define */
define(function () {
    "use strict";
    var result = {

        "rest": {
            // 虚拟机规格
            "VM_SPEC_CREATE": {
                url: " /goku/rest/v1.5/sr/{vdc_id}/vm-flavors",
                type: "POST"
            },
            "VM_SPEC_QUERY": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-flavors",
                type: "GET"
            },
            "VM_SPEC_DELETE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-flavors/{id}",
                type: "DELETE"
            },
            "VM_SPEC_MODIFY": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-flavors/{id}",
                type: "PUT"
            },
            "VM_SPEC_DETAIL": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-flavors/{id}",
                type: "GET"
            },

            // VPC规格
            "VPC_SPEC_CREATE": {
                url: "/resources/spec/vpcSpec/create",
                type: "POST"
            },
            "VPC_SPEC_MODIFY": {
                url: "/resources/spec/vpcSpec/modify",
                type: "POST"
            },
            "VPC_SPEC_QUERY": {
                url: "/resources/spec/vpcSpec/query",
                type: "GET"
            },
            "VPC_SPEC_DELETE": {
                url: "/resources/spec/vpcSpec/delete",
                type: "POST"
            },

            // 虚拟机模板
            "VM_TEMPLATE_QUERY": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vmtemplates",
                type: "GET"
            },
            "VM_TEMPLATE_DELETE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vmtemplates/{id}",
                type: "DELETE"
            },
            "VM_TEMPLATE_DETAIL": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vmtemplates/{id}",
                type: "GET"
            },
            "VM_TEMPLATE_CREATE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vmtemplates",
                type: "POST"
            },
            "VM_TEMPLATE_MODIFY": {
                url: " /goku/rest/v1.5/sr/{vdc_id}/vmtemplates/{id}",
                type: "POST"
            },
            "VM_TEMPLATE_DISCOVER": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/vmtemplates/action",
                type: "POST"
            },
            "VM_TEMPLATE_SYNC": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vmtemplate/action",
                type: "POST"
            },
            "VM_TEMPLATE_DEASSOCIATE": {
                url: "/resources/template/vmTemplate/deassociate",
                type: "GET"
            },
            "VM_TEMPLATE_CONVERT_COMMON": {
                url: "/resources/template/vmTemplate/convertToCommon",
                type: "GET"
            },
            "VM_TEMPLATE_CONVERT_GLOBAL": {
                url: "/resources/template/vmTemplate/convertToGlobal",
                type: "GET"
            },
            "VM_TEMPLATE_CONVERT_VM": {
                url: "/resources/template/vmTemplate/convertToVM",
                type: "GET"
            },
            "VM_TEMPLATE_ASSOCIATE": {
                url: "/resources/template/vmTemplate/associate",
                type: "GET"
            },

            // 逻辑虚拟机模板
            "LOGIC_TEMPLATE_QUERY": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-logic-templates",
                type: "GET"
            },
            "LOGIC_TEMPLATE_DETAIL": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-logic-templates/{id}",
                type: "GET"
            },
            "LOGIC_TEMPLATE_DELETE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-logic-templates/{id}",
                type: "DELETE"
            },
            "LOGIC_TEMPLATE_CREATE": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-logic-templates",
                type: "POST"
            },
            "LOGIC_TEMPLATE_MODIFY": {
                url: "/goku/rest/v1.5/sr/{vdc_id}/vm-logic-templates/{id}",
                type: "PUT"
            },
            "LOGIC_TEMPLATE_CLUSTER": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/resourceclusters",
                type: "GET"
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
                url: "/goku/rest/v1.5/ame/{vdc_id}/scripts",
                type: "GET"
            },
            "SCRIPT_DELETE": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/scripts/{scriptid}",
                type: "DELETE"
            },
            "SCRIPT_DETAIL": {
                url: "/goku/rest/v1.5/{vdc_id}/scripts/{scriptid}?cloud-infra={cloud_infra_id}",
                type: "GET"
            },
            "SCRIPT_CREATE": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/scripts",
                type: "POST"
            },
            "SCRIPT_MODIFY": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/scripts/{scriptid}",
                type: "PUT"
            },
            "SCRIPT_REPAIR": {
                url: "/goku/rest/v1.5/{vdc_id}/scripts/{scriptid}/actions?cloud-infra={cloud_infra_id}",
                type: "POST"
            },
            // 软件包
            "SOFTWARE_CREATE": {
                url: " /goku/rest/v1.5/ame/{vdc_id}/softwares",
                type: "POST"
            },
            "SOFTWARE_DELETE": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/softwares/{softwareid}",
                type: "DELETE"
            },
            "SOFTWARE_MODIFY": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/softwares/{softwareid}",
                type: "PUT"
            },
            "SOFTWARE_REPAIR": {
                url: "/goku/rest/v1.5/{vdc_id}/softwares/{softwareid}/actions?cloud-infra={cloud_infra_id}",
                type: "GET"
            },
            "SOFTWARE_QUERY": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/softwares",
                type: "GET"
            },
            "SOFTWARE_DETAIL": {
                url: "/goku/rest/v1.5/{vdc_id}/softwares/{softwareid}?cloud-infra={cloud_infra_id}",
                type: "GET"
            },

            // ISO
            "ISO_CREATE": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/isos",
                type: "POST"
            },
            "ISO_DELETE": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/isos/{isoid}",
                type: "DELETE"
            },
            "ISO_QUERY": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/isos",
                type: "GET"
            },
            "ISO_DETAIL": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/isos/{isoid}",
                type: "GET"
            },
            "ISO_MODIFY": {
                url: "/goku/rest/v1.5/ame/{vdc_id}/isos/{isoid}",
                type: "PUT"
            },

            // zone
            "ZONE_CREATE": {
                url: "/resources/rpool/zone/create",
                type: "POST"
            },
            "ZONE_QUERY": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/zones",
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
                url: "/resources/rpool/zone/network/dvs/create",
                type: "POST"
            },
            "DVS_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/dvses?start={start}&limit={limit}&name={name}&hypervisorid={hypervisorid}",
                type: "GET"
            },
            "DVS_DELETE": {
                url: "/resources/rpool/zone/network/dvs/delete",
                type: "POST"
            },
            "DVS_ASSOCIATE": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/vlanpools/action",
                type: "POST"
            },

            // VSS
            "VSS_QUERY": {
                url: "/resources/rpool/zone/network/vss/query",
                type: "GET"
            },

            // VLAN池
            "VLAN_POOL_CREATE": {
                url: "/goku/rest/v1.5/irm/vlanpools",
                type: "POST"
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
                url: "/goku/rest/v1.5/irm/{vdc_id}/vlanpools/action",
                type: "POST"
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
                url: "/resources/rpool/zone/network/extNetwork/detail",
                type: "POST"
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
                url: "/resources/rpool/zone/network/publicIP/create",
                type: "POST"
            },
            "PUBLIC_IP_QUERY": {
                url: "/resources/rpool/zone/network/publicIP/query",
                type: "GET"
            },
            "PUBLIC_IP_DELETE": {
                url: "/resources/rpool/zone/network/publicIP/delete",
                type: "POST"
            },

            // vsa管理网络
            "VSA_MANAGER_CREATE": {
                url: "/goku/rest/v1.5/irm/vsamgtnetworks",
                type: "POST"
            },
            "VSA_MANAGER_QUERY": {
                url: "/goku/rest/v1.5/irm/zone/{zoneid}/vsamgtnetworks",
                type: "GET"
            },
            "VSA_MANAGER_DELETE": {
                url: "/goku/rest/v1.5/irm/vsamgtnetworks/{id}",
                type: "DELETE"
            },

            // 防火墙
            "HARDWARE_FIREWALL_QUERY": {
                url: "/resources/rpool/zone/network/virtualFirewall/hardware/query",
                type: "GET"
            },
            "SOFTWARE_FIREWALL_QUERY": {
                url: "/resources/rpool/zone/network/virtualFirewall/software/query",
                type: "GET"
            },

            // VLB池
            "VLB_POOL_QUERY": {
                url: "/resources/rpool/zone/network/vlbPool/query",
                type: "GET"
            },

            // 虚拟化环境
            "VMT_HYPERVISOR_QUERY": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/hypervisors/action",
                type: "POST"
            },
            "VMT_CLUSTER_QUERY": {
                url: "/goku/rest/v1.5/irm/{vdc_id}/resourceclusters",
                type: "POST"
            },
            "VMT_HOST_QUERY": {
                url: "/resources/host/query",
                type: "POST"
            },
            "REST_HEART_BEAT": {
                url: "/goku/rest/heartbeat",
                type: "GET"
            }
        },
        "config": {
            "SERVICE": window.location.hostname,
            "UPORTAL": "",
            "RANDOM_STRING": "AvqomFsRYTT5oyz35IH82w==",
            "SOFTWARE_MAX_SIZE": 4,
            "SOFTWARE_MAX_COUNT": 10000,
            "EXERNAL_NETWORK_TYPE": {
                "vlan": "1",
                "subnet": "2",
                "superSubnet": "3"
            },
            "IP_ALLOCATE_POLICY": {
                "external": "0",
                "internal": "1",
                "manual": "2",
                "staticInjection": "3",
                "autoLayout": "4"
            },
            "PROTOCOL_TYPE": {
                "ipv4": "IPv4",
                "ipv6": "IPv6",
                "dual": "DualStack"
            }
        },
        "getUportalInfo": function () {
            var key = "JSESSIONID";
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, key.length + 1) === (key + '=')) {
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
