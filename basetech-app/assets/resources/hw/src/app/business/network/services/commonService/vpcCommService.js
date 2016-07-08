/*global define*/
define(["language/keyID"], function (keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    var service = function () {
        this.cloudInfraId = null;
        this.vpcId = null;
        this.azId = null;
        this.vpcTypeShared = null;
        this.vpcName = "";

        this.getVpcId = function () {
            return this.vpcId;
        };
        this.getCloudInfraId = function () {
            return this.cloudInfraId;
        };
        this.getAzId = function () {
            return this.azId;
        };
        this.getVpcTypeShared = function () {
            return this.vpcTypeShared;
        };
        this.getVpcName = function () {
            return this.vpcName;
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
                str = i18n.common_term_stoping_value;
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
                str = i18n.common_term_pause_value;
                break;
            case "recycling":
                str = i18n.common_term_reclaiming_value;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        this.getPVMStatus = function (status, vmState) {
            if (status === "SUCCESS") {
                if (vmState === "running") {
                    return i18n.common_term_running_value;
                }
                if (vmState === "stopped") {
                    return i18n.common_term_stoped_value;
                }
                if (vmState === "hibernated") {
                    return i18n.common_term_hibernate_button;
                }
                if (vmState === "creating") {
                    return i18n.common_term_creating_value;
                }
                if (vmState === "create_failed") {
                    return i18n.common_term_createFail_value;
                }
                if (vmState === "create_success") {
                    return i18n.common_term_createSucceed_value;
                }
                if (vmState === "starting") {
                    return i18n.common_term_startuping_value;
                }
                if (vmState === "stopping") {
                    return i18n.common_term_stoping_value;
                }
                if (vmState === "migrating") {
                    return i18n.common_term_migrating_value;
                }
                if (vmState === "shutting_down") {
                    return i18n.common_term_down_button;
                }
                if (vmState === "fault_resuming") {
                    return i18n.common_term_recoverying_value;
                }
                if (vmState === "hibernating") {
                    return i18n.common_term_hibernating_value;
                }
                if (vmState === "rebooting") {
                    return i18n.common_term_restarting_value;
                }
                if (vmState === "pause") {
                    return i18n.common_term_pause_button;
                }
                if (vmState === "recycling") {
                    return i18n.common_term_reclaiming_value;
                }
                if (vmState === "unknown") {
                    return i18n.common_term_unknown_value;
                }
                return i18n.common_term_success_value;
            }
            if (status === "FAILED") {
                return i18n.common_term_fail_label;
            }
            if (status === "PROCESSING") {
                return i18n.common_term_processing_value;
            }
            return i18n.common_term_fail_label;
        };

        this.getTransNicList = function (nics) {
            _.each(nics, function (ele) {
                if (ele.status === "processing") {
                    ele.statusUI = i18n.common_term_processing_value;
                }
                if (ele.status === "normal") {
                    ele.statusUI = i18n.common_term_natural_value;
                }
                if (ele.status === "abnormal") {
                    ele.statusUI = i18n.common_term_abnormal_value;
                }
                if (ele.status === "unkown") {
                    ele.statusUI = i18n.common_term_unknown_value;
                }
                if (ele.status === "unused") {
                    ele.statusUI = i18n.common_term_noUse_value;
                }
                if (ele.networkType === "EXTERNAL") {
                    ele.networkTypeUI = i18n.vpc_term_directConnectNet_label;
                }
                if (ele.networkType === "ORG_EXTERNAL") {
                    ele.networkTypeUI = i18n.vpc_term_directConnectNet_label;
                }
                if (ele.networkType === "ORG_INTERNAL") {
                    ele.networkTypeUI = i18n.vpc_term_innerNet_label;
                }
                if (ele.networkType === "UNKNOWN") {
                    ele.networkTypeUI = i18n.common_term_unknown_value;
                }
                if (ele.networkType === "VSA_MANAGER_NETWORK") {
                    ele.networkTypeUI = i18n.resource_term_vsaNet_label;
                }
                if (ele.networkType === "VSA_OPERATION_NETWORK") {
                    ele.networkTypeUI = i18n.resource_term_vsaServiceNet_label;
                }
                if (ele.networkType === "ROUTED_NETWORK") {
                    ele.networkTypeUI = i18n.vpc_term_routerNet_label;
                }
                ele.opt = "";
            });
            return nics;
        };
    };
    return service;
});
