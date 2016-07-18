/**
 * 虚拟机公共服务
 */
/* global define */
define(["tiny-lib/angular", "tiny-lib/underscore","language/keyID"], function (angular, _, keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    // 判断当前虚拟机状态是否支持某操作
    var allowStatus = {
        "start": ["stopped", "hibernated"],
        "stop": ["running"],
        "reboot": ["running"],
        "forceStop": ["running", "stopping", "pause", "fault_resuming", "hibernated", "unknown", "error"],
        "forceReboot": ["running", "rebooting"],
        "hibernate": ["running"],
        "delete": ["running", "stopped", "hibernated", "recycling", "unknown"],
        "convert2Template": ["stopped"],
        "repair": ["running", "stopped"]
    };

    //Register a service constructor, which will be invoked with new to create the service instance
    var service = function () {
        this.getSupportOpt = function (status, opt) {
            return _.contains(allowStatus[opt], status);
        };

        // 拼装IP地址(1个ipv4和多个ipv6)
        this.packIp = function (ipv4, ipv6s) {
            var allIp = "";
            if (ipv4) {
                allIp += ipv4 + ";";
            }
            if (ipv6s && ipv6s.length > 0) {
                _.each(ipv6s, function (ipv6) {
                    allIp += ipv6 + ";";
                });
            }

            var index = allIp.lastIndexOf(";");
            if (index > 0 && index === allIp.length - 1) {
                allIp = allIp.slice(0, index);
            }
            return allIp;
        };
        //拼装弹性IP地址，一个活多个弹性IP地址
        this.packElasticIps = function (ips) {
            var elasticIps = "";
            if (ips && ips.length > 0) {
                _.each(ips, function (ip) {
                    elasticIps += ip + ";";
                });
            }
            var index = elasticIps.lastIndexOf(";");
            if (index > 0 && index === elasticIps.length - 1) {
                elasticIps = elasticIps.slice(0, index);
            }
            return elasticIps;
        };
        // 从VM请信中获取IP
        this.getIpFromVm = function (vm) {
            var ip = "";
            if (vm && vm.vmSpecInfo) {
                var nics = vm.vmSpecInfo.nics;
                if (nics && nics.length) {
                    _.each(nics, function (item) {
                        if (item.ip) {
                            ip += item.ip + ";";
                        }
                        if (item.ipv6s) {
                            _.each(item.ipv6s, function (ipv6) {
                                ip += ipv6 + ";";
                            });
                        }
                    });
                    var index = ip.lastIndexOf(";");
                    if (index > 0 && index === ip.length - 1) {
                        ip = ip.slice(0, index);
                    }
                }
            }
            return ip;
        };

        // 从子网中获取ip
        this.getIpFromSubnet = function (ipv4Subnet, ipv6Subnet) {
            var allIp = "";
            if (ipv4Subnet && ipv4Subnet.subnetAddr) {
                allIp += ipv4Subnet.subnetAddr + "/" + ipv4Subnet.subnetPrefix;
            }
            if (ipv6Subnet && ipv6Subnet.subnetAddr) {
                if (allIp) {
                    allIp += "; ";
                }
                allIp += ipv6Subnet.subnetAddr + "/" + ipv6Subnet.subnetPrefix;
            }
            return allIp;
        };

        //转换状态字符串
        this.getStatusStr = function (status) {
            var str = "";
            switch (status) {
            case "running":
                str = i18n.common_term_running_value;
                break;
            case "stopped":
                str = i18n.common_term_stoped_value;
                break;
            case "hibernated":
                str = i18n.common_term_hibernated_value;
                break;
            case "creating":
                str = i18n.common_term_creating_value;
                break;
            case "create_failed":
                str = i18n.common_term_createFail_value;
                break;
            case "create_success":
                str = i18n.common_term_createSucceed_value;
                break;
            case "resize":
                str = i18n.common_term_modifing_value;
                break;
            case "starting":
                str = i18n.common_term_startuping_value;
                break;
            case "stopping":
                str = i18n.common_term_stoping_value;
                break;
            case "migrating":
                str = i18n.common_term_migrating_value;
                break;
            case "shutting_down":
                str = i18n.common_term_deleting_value;
                break;
            case "fault_resuming":
                str = i18n.common_term_recoverying_value;
                break;
            case "hibernating":
                str = i18n.common_term_hibernating_value;
                break;
            case "rebooting":
                str = i18n.common_term_restarting_value;
                break;
            case "pause":
                str = i18n.common_term_paused_value;
                break;
            case "recycling":
                str = i18n.common_term_reclaiming_value;
                break;
            case "error":
                str = i18n.common_term_trouble_label;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        // 将str截取前面len个字符，后面拼成...（如果比len短，则不处理）
        this.trimToLength = function (str, len) {
            if (!str) {
                return "";
            }
            if (str.length <= len) {
                return str;
            }
            return str.substr(0, len) + "...";
        };

        // 获取虚拟机操作的参数
        this.getOperateParams = function (operate, vms, mode) {
            var params = {};
            switch (operate) {
            case "start":
                params.operate = {
                    "type": "start",
                    "vmIds": vms
                };
                break;
            case "stop":
                params.operate = {
                    "type": "stop",
                    "vmIds": vms,
                    "mode": mode
                };
                break;
            case "reboot":
                params.operate = {
                    "type": "reboot",
                    "vmIds": vms,
                    "mode": mode
                };
                break;
            case "hibernate":
                params.operate = {
                    "type": "hibernate",
                    "vmIds": vms
                };
                break;
            case "delete":
                params["delete"] = {
                    "vmIds": vms,
                    "mode": mode
                };
                break;
            default:
                break;
            }
            return params;
        };

        //ip分配类型转换
        this.getDhcpServerType = function(strType){
            var str = "";
            switch (strType) {
                case "EXTERNAL_DHCP":
                    str = i18n.resource_term_externalDHCP_label;
                    break;
                case "INTERNAL_DHCP":
                    str = i18n.common_term_innerDHCP_label;
                    break;
                case "MANUAL":
                    str = i18n.common_term_manual_label;
                    break;
                case "STATIC_INJECT":
                    str = i18n.vpc_term_staticInjection_label;
                    break;
                case "AUTO_CONFIG":
                    str = i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label;
                    break;
                default:
                    break;
            }
            return str;
        };
    };
    return service;
});
