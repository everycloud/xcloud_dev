/**
 * 文件名：vmMonitorResourceCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-3
 */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/services/commonService',
    'tiny-directives/Lineplot',
    "tiny-directives/FormField",
    "tiny-directives/Textbox"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exception, commonService) {
    "use strict";
    var deployBaseInfoCtrl = ['$scope', 'camel', "exception",
        function ($scope, camel, exception) {
            var user = $("html").scope().user;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var winDom = $("#viewApp_Detail_winId");
            var winWidget = winDom.widget();
            var deployBasicInfo = winWidget.option("deployBasicInfo") || {};
            $scope.curCloudInfraId = winWidget.option("curCloudInfraId");
            $scope.curAppId = winWidget.option("curAppId");
            $scope.isIT = (user.cloudType === "IT");

            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "value": ""
            };
            $scope.tag = {
                "label": i18n.cloud_term_tag_label + ":",
                "value": ""
            };
            $scope.runState = {
                "label": i18n.common_term_status_label + ":",
                "value": "",
                "map": {
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
                    "RepaireFailed": i18n.common_term_restorFail_value,
                    "Repairing": i18n.common_term_restoring_value
                }
            };
            $scope.org = {
                "label": i18n.org_term_organization_label + ":",
                "value": ""
            };
            $scope.vpc = {
                "label": i18n.vpc_term_vpc_label + ":",
                "value": ""
            };
            $scope.description = {
                "label": i18n.common_term_desc_label + ":",
                "value": ""
            };
            $scope.creatorTime = {
                "label": i18n.common_term_createAt_label + ":",
                "value": ""
            };
            $scope.creatorEnd = {
                "label": i18n.common_term_createEndTime_label + ":",
                "value": ""
            };
            $scope.creator = {
                "label": i18n.user_term_createUser_button + ":",
                "value": ""
            };

            function getVpcByList(vpcs) {
                if (!vpcs || !vpcs.length) {
                    return "";
                }
                var vpcStr = "";
                for (var i = 0; i < vpcs.length; i++) {
                    vpcStr += vpcs[i];
                    vpcStr += ";";
                }
                var lastSepaIndex = vpcStr.lastIndexOf(";");
                if (lastSepaIndex >= 0) {
                    vpcStr = vpcStr.substring(0, lastSepaIndex);
                }
                return vpcStr;
            }

            function init() {
                $scope.name.value = deployBasicInfo.appName;
                $scope.tag.value = deployBasicInfo.appTag;
                $scope.runState.value = $scope.runState.map[deployBasicInfo.status] || "";
                $scope.org.value = deployBasicInfo.vdcName;
                $scope.vpc.value = deployBasicInfo.vpcName;
                $scope.description.value = deployBasicInfo.desc;
                $scope.creatorTime.value = commonService.utc2Local(deployBasicInfo.createBeginTime);
                $scope.creatorEnd.value = commonService.utc2Local(deployBasicInfo.createEndTime);
                $scope.creator.value = deployBasicInfo.userName;
            }

            init();
        }
    ];

    var vmMonitorResourceModule = angular.module("app.list.deployBaseInfo", ['ng', 'wcc', "ngSanitize"]);
    vmMonitorResourceModule.controller("app.list.deployBaseInfo.ctrl", deployBaseInfoCtrl);
    vmMonitorResourceModule.service("camel", http);
    vmMonitorResourceModule.service("exception", exception);
    return vmMonitorResourceModule;
});
