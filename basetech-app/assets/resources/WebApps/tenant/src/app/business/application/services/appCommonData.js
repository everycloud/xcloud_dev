/**
 * defined a global ajax communication service
 * Created on 13-11-30.
 */
define(['tiny-lib/jquery', "tiny-lib/angular", "language/keyID"], function ($, angular, keyIDI18n) {
    "use strict";
    var i18n = keyIDI18n;
    var service = function () {
        this.cloudInfraId = null;
        this.vpcId = null;
        this.appId = null;
        this.appName = null;
        this.canViewTopo = false;
        this.azId = null;
        this.vpcTypeShared = null;
        this.ALL_APP_STATUS = {
            "Started": i18n.common_term_enable_value,
            "ToBeProcessed": i18n.common_term_waitDeal_value,
            "Creating": i18n.common_term_creating_value,
            "CreationFailed": i18n.common_term_createFail_value,
            "Starting": i18n.common_term_startuping_value,
            "StartFailed": i18n.common_term_startupFail_value,
            "Stopped": i18n.common_term_stop_button,
            "Stopping": i18n.common_term_stoping_value,
            "StopFailed": i18n.common_term_stopFail_value,
            "Deleting": i18n.common_term_deleting_value,
            "DeleteFailed": i18n.common_term_deleteFail_value,
            "Exception": i18n.common_term_abnormal_value,
            "UPDATE_IN_PROGRESS": i18n.common_term_updating_value,
            "UPDATE_COMPLETE": i18n.common_term_updatComplete_value,
            "UPDATE_FAILED": i18n.common_term_updatFail_value,
            "Repairing": i18n.common_term_restoring_value,
            "RepaireFailed": i18n.common_term_restorFail_value
        };

        this.getAppStatusByKey = function(key){
            if (!key){
                return "";
            }
            return this.ALL_APP_STATUS[key] || "";
        };

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

        this.getTemplateStatus = function (statusCode) {
            var status = "";
            switch (statusCode) {
            case "Draft":
                status = i18n.app_term_draft_label;
                break;
            case "Published":
                status = i18n.common_term_published_value;
                break;
            default:
                status = i18n.common_term_unknown_value;
                break;
            }
            return status;
        };

        /**
         * 状态：  READY-就绪
         *         DELETING-删除中
         *         PENDING-创建中(ICT:处理中)
         *         FAIL-失败
         *         UPDATING-修改中
         *         UPDATEFAIL-修改失败
         * @param code
         * @returns {string}
         */
        this.getNetworkStatus = function (statusCode, isIT) {
            var str = "";
            switch (statusCode) {
                case "READY":
                    str = i18n.common_term_ready_value;
                    break;
                case "DELETING":
                    str = i18n.common_term_deleting_value;
                    break;
                case "PENDING":
                    str = i18n.common_term_creating_value;
                    break;
                case "FAIL":
                    str = i18n.common_term_fail_label;
                    break;
                case "UPDATING":
                    str = i18n.common_term_modifing_value;
                    break;
                case "UPDATEFAIL":
                    str = i18n.common_term_modifyFail_value;
                    break;
                default:
                    str = i18n.common_term_unknown_value;
                    break;
            }
            return str;
        };

        this.getNetworkType = function (typeCode) {
            var netTypeStr = "";
            switch (typeCode) {
            case 1:
                netTypeStr = i18n.vpc_term_directConnectNet_label;
                break;
            case 2:
                netTypeStr = i18n.vpc_term_innerNet_label;
                break;
            case 3:
                netTypeStr = i18n.vpc_term_routerNet_label;
                break;
            default:
                break;
            }
            return netTypeStr;
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
                str = i18n.common_term_shuting_value;
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

        //获取伸缩组的运行状态UI显示值
        this.getScalingGroupRunningStatus = function (runStatus) {
            var str = "";
            switch (runStatus) {
            case "NORMAL":
                str = i18n.common_term_natural_value;
                break;
            case "SCALING":
                str = i18n.app_term_flexing_value;
                break;
            case "PENDING":
                str = i18n.common_term_waiting_value;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        //获取组内策略的状态UI显示值
        this.getPolicyStatus = function (status) {
            var str = "";
            switch (status) {
            case "RUNNING":
                str = i18n.common_term_running_value;
                break;
            case "BLOCK":
                str = i18n.app_term_choke_value;
                break;
            case "STOPPED":
                str = i18n.common_term_stoped_value;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        this.getPolicyExecutionResult = function (result) {
            var str = "";
            switch (result) {
            case "SUCCESS":
                str = i18n.common_term_success_value;
                break;
            case "FAILURE":
                str = i18n.common_term_fail_label;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        //获取组内策略的动作类型UI显示值
        this.getPolicyActionType = function (actionType) {
            var str = "";
            switch (actionType) {
            case "SCALEOUT":
                str = i18n.common_term_expanding_button;
                break;
            case "SCALEIN":
                str = i18n.common_term_capacityReduction_button;
                break;
            case "SLEEP":
                str = i18n.common_term_hibernate_button;
                break;
            case "AWAKE":
                str = i18n.common_term_awaken_button;
                break;
            case "HALT":
                str = i18n.common_term_close_button;
                break;
            case "POWER":
                str = i18n.common_term_startup_button;
                break;
            case "CREATE":
                str = i18n.common_term_create_button;
                break;
            case "REMOVE":
                str = i18n.common_term_delete_button;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        this.getScheduleTaskStatus = function (status) {
            var str = "";
            switch (status) {
            case "ENABLED":
                str = i18n.common_term_enable_button;
                break;
            case "DISABLED":
                str = i18n.common_term_shut_button;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        this.getScheduleTaskTriggerType = function (triggerType) {
            var str = "";
            switch (triggerType) {
            case "PERIOD":
                str = i18n.app_term_cycleTrigger_label;
                break;
            case "ONCE":
                str = i18n.app_term_timerTrigger_label;
                break;
            default:
                str = i18n.common_term_unknown_value;
                break;
            }
            return str;
        };

        this.getScheduleTaskTriggerDate = function (date) {
            var str = "";
            switch (date) {
            case "EVERYDAY":
                str = i18n.common_term_everyDay_label;
                break;
            case "MON":
                str = i18n.common_term_Monday_label;
                break;
            case "TUE":
                str = i18n.common_term_Tuesday_label;
                break;
            case "WEN":
                str = i18n.common_term_Wednesday_label;
                break;
            case "THU":
                str = i18n.common_term_Thursday_label;
                break;
            case "FRI":
                str = i18n.common_term_Friday_label;
                break;
            case "SAT":
                str = i18n.common_term_Saturday_label;
                break;
            case "SUN":
                str = i18n.common_term_Sunday_label;
                break;
            default:
                str = date;
                break;
            }
            return str;
        };

    };
    return service;
});
