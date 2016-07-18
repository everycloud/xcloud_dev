/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-25

 */
define([""], function () {

    var result = {

        "rest": {
            //查询设备对应的告警信息
            "ALARM_QUERY": {
                url: "/goku/rest/v1.5/{tenant_id}/alarms/statistic",
                type: "POST"
            },
            // 查询服务器
            "HOST_QUERY": {
                url: "/goku/rest/v1.5/irm/servers?start={start}&limit={limit}&sort_key={sort_key}&sort_dir={sort_dir}&zoneId={zoneId}&runStatus={runStatus}&resourceStatus={resourceStatus}&name={name}&type={type}",
                type: "GET"
            },
            //更新服务器名称和描述
            "HOST_UPDATE": {
                url: "/goku/rest/v1.5/irm/phy-servers/basicinfo",
                type: "PUT"
            },

            //删除主机
            "HOST_DELETE": {
                url: "/goku/rest/v1.5/irm/servers/{serverId}",
                type: "POST"
            },
            //添加主机
            "HOST_ADD": {
                url: "/goku/rest/v1.5/irm/servers",
                type: "POST"
            },
            //更新主机
            "HOST_REFRESH": {
                url: "/goku/rest/v1.5/irm/phy-servers/openstack",
                type: "POST"
            },
            //上下电重启
            "HOST_ACTION": {
                url: "/goku/rest/v1.5/irm/phy-servers/{id}/{action}",
                type: "POST"
            },
            //查询机框
            "CHASSIS_QUERY": {
                url: "/goku/rest/v1.5/irm/chassises?start={start}&limit={limit}&sort_key={sort_key}&sort_dir={sort_dir}&zoneId={zoneId}&resourceStatus={resourceStatus}&name={name}&type={type}&chassisId={chassisId}",
                type: "GET"
            },
            //删除机框
            "CHASSIS_DELETE": {
                url: "/goku/rest/v1.5/irm/chassises/{chassisId}",
                type: "POST"
            },
            //更新名称和描述
            "CHASSIS_UPDATE": {
                url: "/goku/rest/v1.5/irm/phy-chassis/basicinfo",
                type: "PUT"
            },
            //添加机框
            "CHASSIS_ADD": {
                url: "/goku/rest/v1.5/irm/chassises",
                type: "POST"
            },
            //查询机框下的刀片槽位信息
            "CHASSIS_SLOTS_QUERY": {
                url: "/goku/rest/v1.5/irm/chassis/{chassisId}/bladeservers",
                type: "POST"
            },
            //机框接入刀片服务器
            "BLADE_HOST_ADD": {
                url: "/goku/rest/v1.5/irm/bladeservers",
                type: "POST"
            },
            //清除刀片接入参数
            "BLADE_HOST_CLEAR": {
                url: "/goku/rest/v1.5/irm/blades/{id}",
                type: "DELETE"
            },
            //修改SMM板密码
            "SMM_PWD_MODIFY": {
                url: "/goku/rest/v1.5/irm/modifypassword",
                type: "PUT"
            },
            //查询交换机
            "SWITCH_QUERY": {
                url: "/goku/rest/v1.5/irm/switches",
                type: "POST"
            },
            //查询交换机详情
            "SWITCH_DETAIL_QUERY": {
                url: "/goku/rest/v1.5/irm/physwitch/{id}",
                type: "GET"
            },
            //查询交换机端口
            "SWITCH_PORT_QUERY": {
                url: "/goku/rest/v1.5/irm/switches/port/{switch_name}",
                type: "GET"
            },
            //根据设备查询所有支持的型号
            "DEVICE_TYPE": {
                url: "/goku/rest/v1.5/irm/deviceType/{id}",
                type: "GET"
            },

            //接入交换机
            "SWITCH_ADD": {
                url: "/goku/rest/v1.5/irm/physwitch",
                type: "POST"
            },
            //修改交换机名字和描述
            "SWITCH_UPDATE": {
                url: "/goku/rest/v1.5/irm/physwitch/basic-info/{id}",
                type: "PUT"
            },
            //删除交换机
            "SWITCH_DELETE": {
                url: "/goku/rest/v1.5/irm/physwitch/{id}",
                type: "DELETE"
            },
            //修改上行端口
            "UPLINK_PORTS_UPDATE": {
                url: "/goku/rest/v1.5/irm/switches/uplinkports",
                type: "PUT"
            },
            //修改接入参数
            "UPLINK_CONNECTS_PARAM_UPDATE": {
                url: "/goku/rest/v1.5/irm/physwitch/{id}",
                type: "PUT"
            },
            //检查设备冲突
            "DEVICE_COLLISION": {
                url: "/goku/rest/v1.5/irm/collision",
                type: "POST"
            },

            //查询防火墙
            "FIREWALL_QUERY": {
                url: "/goku/rest/v1.5/irm/phy-firewalls?zone-id={zone_id}&firewall-name={firewall_name}",
                type: "GET"
            },
            //接入防火墙
            "FIREWALL_ADD": {
                url: "/goku/rest/v1.5/irm/phy-firewalls",
                type: "POST"
            },
            //删除防火墙
            "FIREWALL_DELETE": {
                url: "/goku/rest/v1.5/irm/phy-firewalls/{id}",
                type: "DELETE"
            },
            //重新发现虚拟防火墙
            "VFW_REDISCOVERY": {
                url: "/goku/rest/v1.5/irm/phyfirewalls/{id}/vfirewalls",
                type: "POST"
            },
            //查看防火墙资源配置
            "PHYFW_CFGFILES": {
                url: "/goku/rest/v1.5/irm/phyfwcfgfiles/{id}",
                type: "POST"
            },
            //防火墙连接信息
            "FW_CONNECTOR_INFO": {
                url: "/goku/rest/v1.5/irm/phyfwconnectors/{fwid}",
                type: "GET"
            },
            //更新防火墙连接信息
            "FW_CONNECTOR_UPDATE": {
                url: "/goku/rest/v1.5/irm/phyfwconnectors",
                type: "PUT"
            },

            //上传防火墙配置文件
            "FIREWALL_UPLOAD": {
                url: "/goku/rest/v1.5/irm/phyfwcfgfiles",
                type: "POST"
            },
            //查询SAN设备
            "SAN_QUERY": {
                url: " /goku/rest/v1.5/irm/phy-storages",
                type: "POST"
            },
            //接入SAN设备
            "SAN_ADD": {
                url: " /goku/rest/v1.5/irm/phy-storage",
                type: "POST"
            },
            //删除SAN设备
            "SAN_DELETE": {
                url: "/goku/rest/v1.5/irm/phy-storage/{id}",
                type: "DELETE"
            },
            //查询fusionStorage设备
            "FUSIONSTORAGE_QUERY": {
                url: "/goku/rest/v1.5/irm/fusionstorage",
                type: "GET"
            },
            //接入fusionStorage设备
            "FUSIONSTORAGE_ADD": {
                url: "/goku/rest/v1.5/irm/fusionstorage",
                type: "PUT"
            },
            //查询机房
            "ROOM_QUERY": {
                url: "/goku/rest/v1.5/irm/rooms?start={start}&limit={limit}&room-name={room_name}",
                type: "GET"
            },
            //修改机房信息
            "ROOM_UPDATE": {
                url: "/goku/rest/v1.5/irm/rooms/{id}",
                type: "PUT"
            },
            //查询机房下的机柜
            "CABINET_QUERY_BY_ROOM": {
                url: "/goku/rest/v1.5/irm/rooms/racks?start={start}&limit={limit}&sort={sort}&order={order}&room-name={room_name}",
                type: "GET"
            },
            //查询机柜
            "CABINET_QUERY": {
                url: "/goku/rest/v1.5/irm/racks?start={start}&limit={limit}&room-name={room_name}&rack-name={rack_name}",
                type: "GET"
            },
            //修改机柜信息
            "CABINET_UPDATE": {
                url: "/goku/rest/v1.5/irm/racks/{id}",
                type: "PUT"
            },
            //根据机框查询设备
            "DEVICE_QUERY": {
                url: "/goku/rest/v1.5/irm/racks/{id}/devices?start={start}&limit={limit}&sort={sort}&order={order}",
                type: "GET"
            },
            //接入负载均衡器
            "LOAD_BALANCER_ADD": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances",
                type: "POST"
            },
            //查询负载均衡
            "LOAD_BALANCER_QUERY": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances?zone-id={zone_id}&device-name={device_name}&start={start}&limit={limit}",
                type: "GET"
            },
            //删除负载均衡
            "LOAD_BALANCER_DELETE": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances/{id}",
                type: "DELETE"
            },
            //修改负载均衡连接参数
            "LOAD_BALANCER_UPDATE": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances/{deviceId}/connection-config",
                type: "PUT"
            },
            //查询负载均衡业务配置参数
            "LOAD_BALANCER_BUSINESS_QUERY": {
                url: "/goku/rest/v1.5/irm/phy-loadbalances/{deviceId}/business-config",
                type: "GET"
            },
            //查询链路
            "LINK_QUERY": {
                url: " /resources/network/link",
                type: "GET"
            },
            //从某本端设备出来的链路查询
            "LINK_QUERY_BY_START_DEVICE": {
                url: " /resources/network/startDevice/link",
                type: "GET"
            }
        },
        "config": {
            "FIREWALL_CONNECT_TYPE": {
                "single": "1", "masterSlave": "2", "balance": 3
            },
            "FIREWALL_CONNECT_MODE": {
                "main": 1, "pair": 2, "single": 3
            },
            "FIREWALL_CONNECT_STATUS": {
                0: "common_term_natural_value", 1: "common_term_notPing_value", 2: "device_term_SSHconectError_label", 3: "device_term_SNMPconectError_label", 4: "device_term_HTTPSconnectAbnormal_label", 5: "device_term_TelnetconectError_label"
            },
            "FIREWALL_DEVICE_STATUS": {
                0: "common_term_natural_value", 1: "common_term_creating_value", 2: "common_term_deleting_value", 3: "common_term_fail_label", 4: "device_term_unlinkDevice_value", 5: "device_term_manualCfgMutilation_value", 6: "common_term_updating_value", 7: "common_term_discoverFail_value"
            },
            "SNMP_PROTOCOL": {
                "SNMPV3": "SNMPv3", "SNMPV2C": "SNMPv2c", "SNMPV1": "SNMPv1"
            },
            "DEVICE_TYPE": {
                1: "device_term_subrackServer_label", 2: "device_term_rackServer_label", 3: "device_term_switch_label", 4: "common_term_storage_label", 5: "device_term_switchBoard_label"
            },
            "RACK_DEVICE_TYPE": {
                1: "device_term_subrackServer_label", 2: "device_term_rackServers_label", 3: "device_term_switch_label", 4: "device_term_firewall_label", 5: "common_term_lb_label", 6: "common_term_storage_label"
            },
            "SWITCH_STATUS": {
                0: "common_term_online_value", 1: "common_term_offline_label"
            },
            "SWITCH_TYPE": {
                0: "device_term_aggregationSwitch_label", 1: "device_term_connectSwitch_label"
            },
            "LOAD_BALANCER_STATUS": {0: "common_term_ready_value", 1: "common_term_creating_value", 2: "common_term_deleting_value", 3: "common_term_fail_label", 4: "common_term_updating_value", 5: "common_term_querying_value"},
            "LOAD_BALANCER_LINK_STATUS": {
                0: "common_term_natural_value", 1: "common_term_notPing_value", 2: "device_term_SSHconectError_label", 3: "device_term_SNMPconectError_label", 4: "device_term_HTTPSconnectAbnormal_label", 5: "device_term_TelnetconectError_label"
            },
            "HOST_RUN_STATUS": {
                1: "common_term_natural_value",
                2: "common_term_down_button",
                3: "common_term_trouble_label",
                4: "common_term_notBeDetected_value",
                5: "common_term_unknown_value",
                6: "common_term_restarting_value",
                7: "common_term_online_value",
                8: "common_term_offline_label",
                9:"common_term_initializtion_value",
                10:"common_term_oning_value",
                11:"common_term_downing_value"
            },
            "HOST_RESOURCE_STATUS": {
                1: "common_term_initializtion_value", 2: "common_term_discovering_value", 3: "common_term_ready_value", 6: "common_term_discoverFail_value", 10: "common_term_unknown_value", 15: "device_term_linkHostFail_value", 16: "device_term_getSpecFail_value", 100: "不支持该操作系统"
            },
            "FAN_STATUS": {1: "common_term_natural_value", 2: "common_term_abnormal_value", 3: "common_term_unknown_value"},
            "POWER_STATUS": {1: "common_term_natural_value", 2: "common_term_abnormal_value", 3: "common_term_unknown_value"},
            "SAN_STATUS": {"0": "common_term_online_value", "-1": "common_term_offline_label", "2": "common_term_trouble_label"},
            "HOST_ACTION": {
                "POWERON": {
                    val: "poweron",
                    text: "common_term_on_button"
                },
                "POWEROFF": {
                    val: "poweroff",
                    text: "common_term_down_button"
                },
                "REBOOT": {
                    val: "reboot",
                    text: "common_term_restart_button"
                }
            },
            "POWER_MODE": {
                "SAFE": 1,
                "FORCE": 0
            },
            "SERVER_TYPE": {
                "SERVER": "server",
                "HOST": "host"
            }
        }
    }

    return result;

})
;

