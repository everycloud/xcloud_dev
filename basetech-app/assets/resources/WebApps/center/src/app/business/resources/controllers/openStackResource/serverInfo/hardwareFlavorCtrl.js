/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/competitionConfig",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, Competition, exceptionService) {
    "use strict";

    var cpuCtrl = ["$scope", "$stateParams", "$compile", "camel", '$interval', function ($scope, $stateParams, $compile, camel, $interval) {
        var exceptionSer = new exceptionService();
        var user = $("html").scope().user;
        $scope.Competition = Competition;
        $scope.vmId = $stateParams.vmId;
        var novaId = $stateParams.novaId;
        var tokenId;
        var projectId;
        var flavorId;
        var flavors;
        //一次刷新是否结束
        var refreshEnd = true;

        $scope.label = {
            "cpu": $scope.i18n.common_term_vcpuNum_label + ":",
            "memory": $scope.i18n.common_term_memory_label + ":",
            "status": $scope.i18n.vm_term_vmStatus_label + ":",
            "taskStatus": $scope.i18n.task_term_taskStatus_label + ":"
        };
        var statuses = {
            ACTIVE: $scope.i18n.common_term_running_value,
            SHUTOFF: $scope.i18n.common_term_stoped_value,
            SUSPENDED: $scope.i18n.common_term_hibernated_value,
            PAUSED: $scope.i18n.common_term_paused_value,
            REBOOT: $scope.i18n.common_term_restarting_value,
            HARD_REBOOT: $scope.i18n.common_term_forciblyRestarting_value,
            BUILD: $scope.i18n.common_term_creating_value,
            MIGRATING: $scope.i18n.common_term_migrating_value,
            VERIFY_RESIZE: $scope.i18n.vm_term_modifyWaitConfirm_value,
            ERROR: $scope.i18n.common_term_trouble_label,
            RESCUED: $scope.i18n.common_term_resumed_value,
            RESIZED: $scope.i18n.vm_term_modified_value,
            unknown: $scope.i18n.common_term_unknown_value
        };
        var taskStatus = {
            scheduling: $scope.i18n.vm_term_scheduling_value,
            block_device_mapping: $scope.i18n.vm_term_blockDeviceMapping_value,
            networking: $scope.i18n.vm_term_networking_value,
            spawning: $scope.i18n.vm_term_spawning_value,
            resize_prep: $scope.i18n.vm_term_modifyReady_value,
            resize_migrating: $scope.i18n.vm_term_modifyMigrate_value,
            resize_migrated: $scope.i18n.vm_term_modifyMigrateComplete_value,
            resize_finish: $scope.i18n.vm_term_modifyComplete_value,
            resize_confirming: $scope.i18n.vm_term_modifyConfirming_value,
            rebooting: $scope.i18n.common_term_restarting_value,
            rebooting_hard: $scope.i18n.common_term_forciblyRestarting_value,
            pausing: $scope.i18n.common_term_pauseing_value,
            unpausing: $scope.i18n.common_term_unpausing_value,
            suspending: $scope.i18n.common_term_hibernating_value,
            resuming: $scope.i18n.common_term_awaking_value,
            "powering-off": $scope.i18n.common_term_shuting_value,
            "powering-on": $scope.i18n.common_term_startuping_value,
            migrating: $scope.i18n.common_term_migrating_value,
            deleting: $scope.i18n.common_term_deleting_value
        };
        $scope.modifyButton = {
            "id": "modifyFlavorButton",
            "text": $scope.i18n.common_term_modify_button,
            "disable": true,
            "click": function () {
                modifyWindow();
            }
        };
        $scope.confirmButton = {
            "id": "confirmFlavorButton",
            "text": $scope.i18n.vm_term_confirmModify_button,
            "disable": true,
            "click": function () {
                lifeCycle("confirmResize");
            }
        };
        function modifyWindow() {
            var newWindow = new Window({
                "winId": "modifyFlavorWindow",
                "title": $scope.i18n.common_term_modifySpec_button,
                "novaId": novaId,
                "projectId": projectId,
                "tokenId": tokenId,
                "serverId": $scope.vmId,
                "flavors": flavors,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/openStackResource/serverInfo/modifyFlavor.html",
                "height": 500,
                "width": 800,
                "maximizable": false,
                "minimizable": false,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }

        function lifeCycle(action) {
            var params = {
            };
            params[action] = null;
            var deferred = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": JSON.stringify(params),
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getFlavors() {
            var deferred = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/flavors/detail",
                    o: {"novaId": novaId, "projectId": projectId}
                },
                "monitor": false,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                refreshEnd = true;
                flavors = data.flavors;
                $scope.$apply(function () {
                    for (var i = 0; i < flavors.length; i++) {
                        if (flavors[i].id == flavorId) {
                            $scope.cpuCore = flavors[i].vcpus;
                            $scope.memorySize = flavors[i].ram + "MB";
                            break;
                        }
                    }
                });
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getData() {
            if (!refreshEnd) {
                return;
            }
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "monitor": false,
                "beforeSend": function (request) {
                    request.setRequestHeader("X-Auth-Token", tokenId);
                }
            });
            deferred.success(function (data) {
                var server = data.server;
                flavorId = server.flavor.id;
                $scope.$apply(function () {
                    $scope.statusStr = statuses[server.status] || server.status;
                    $scope.taskStatus = server["OS-EXT-STS:task_state"];
                    $scope.taskStatusStr = taskStatus[$scope.taskStatus] || $scope.taskStatus;
                });
                //SFR项目，挂有用户盘的虚拟机，不运行修改规格
                var modifyDisable = Competition.isBaseOnVmware && ($scope.vlolumesNum > 1 || (server.image && $scope.vlolumesNum > 0));
                if ($("#" + $scope.confirmButton.id).widget()) {
                    $("#" + $scope.confirmButton.id).widget().option("disable", (server.status !== "VERIFY_RESIZE"));
                    $("#" + $scope.modifyButton.id).widget().option("disable", (server.status !== "ACTIVE" && server.status !== "SHUTOFF" || modifyDisable));
                }
                if ($scope.status !== server.status) {
                    refreshEnd = false;
                    $scope.status = server.status;
                    getFlavors();
                }
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getDisk() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/os-volume_attachments",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                $scope.volumes = data && data.volumeAttachments || [];
                $scope.vlolumesNum = $scope.volumes.length;
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getToken() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data === undefined) {
                    return;
                }
                tokenId = data.id;
                projectId = data.projectId;
                getDisk();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        $scope.promise = $interval(function () {
            //如果还在当前页面
            if ($("#" + $scope.modifyButton.id).widget()) {
                getData();
            }
        }, 5000);
        // 清除定时器
        $scope.$on('$destroy', function () {
            try {
                $interval.cancel($scope.promise);
            }
            catch (e) {
                // do nothing
            }
        });
        getToken();
    }];
    return cpuCtrl;
});
