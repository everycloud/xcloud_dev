/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/business/resources/services/monitorService",
    "app/services/exceptionService",
    "fixtures/snapshotFixture"
], function ($, angular, Window, Message, MonitorService, Exception) {
    "use strict";

    var snapshotCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", "$rootScope", function ($scope, $state, $stateParams, $compile, camel, $rootScope) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;

        $scope.hasSnapshotManageOperateRight = $rootScope.user.privilege.role_role_add_option_snapshotHandle_value && ($stateParams.isVsa !== "true");

        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        $scope.currentSnapshotId = null;

        $scope.currentRespSID = null;
        $scope.help = {
            show: false
        };
        $scope.snapshot = {
            "name": {label: $scope.i18n.common_term_name_label + ":"},
            "memory": {label: ($scope.i18n.vm_snap_view_para_mem_label || "是否内存快照") + ":"},
            "copy": {label: ($scope.i18n.vm_snap_view_para_backup_label || "是否备份快照") + ":"},
            "status": {label: $scope.i18n.common_term_status_label + ":"},
            "time": {label: ($scope.i18n.common_term_createAt_label || "创建时间") + ":"},
            "desc": {label: $scope.i18n.common_term_desc_label + ":"},
            "snapProvisionSize": {label: $scope.i18n.vm_term_snapCapacity_label + ":"}
        };
        var SNAPSHOT_STATUS = {
            creating: $scope.i18n.common_term_creating_value || '创建中',
            resuming: $scope.i18n.common_term_resuming_value || '恢复虚拟机中',
            ready: $scope.i18n.common_term_createSucceed_value || '创建成功',
            deleting: $scope.i18n.common_term_deleting_value || '删除中'
        };

        $scope.snapshotTreeMode = {
            id: "snapshotTreeModeId",
            width: "300",
            height: "600",
            setting: {
                callback: {
                    onClick: function (event, id, node) {
                        $scope.operate.getSnapshot(node.id);
                    }
                }
            },
            values: []
        };
        $scope.refreshButton = {
            "id": "refreshButtonId",
            "text": $scope.i18n.common_term_fresh_button,
            "disable": false,
            "click": function () {
                $scope.operate.init();
            }
        };
        $scope.expandButton = {
            "id": "expandButtonId",
            "text": $scope.i18n.common_term_expansion_label || "展开",
            "disable": false,
            "click": function () {
                var treeObj = $("#snapshotTreeModeId").widget().getZTreeObj();
                treeObj.expandAll(true);
            }
        };

        //创建快照按钮
        $scope.createButton = {
            "id": "createSnapShotButton",
            "text": $scope.i18n.vm_term_createSnap_button || "创建快照",
            "disable": false,
            "click": function () {
                var newWindow = new Window({
                    "winId": "createSnapShotWindow",
                    "title": $scope.i18n.vm_term_createSnap_button || "创建快照",
                    "content-type": "url",
                    "buttons": null,
                    "vmId": $scope.vmId,
                    "vmOsType": $scope.vmOsType,
                    "vmType":$scope.vmType,
                    "content": "app/business/resources/views/hypervisor/vmInfo/createSnapshot.html",
                    "height": 350,
                    "width": 500,
                    "close": function (event) {
                        $scope.operate.init();
                    }
                });
                newWindow.show();
            }
        };
        //恢复虚拟机按钮
        $scope.recoverVmButton = {
            "id": "recoverVmButton",
            "text": $scope.i18n.vm_term_resumVM_button || "恢复虚拟机",
            "disable": true,
            "click": function () {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.vm_vm_resumeBySnap_info_confirm_msg || "使用快照恢复虚拟机后，用户在该快照点之后配置的数据和信息会丢失，是否继续？",
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            handler: function (event) {
                                $scope.operate.recover();
                                msg.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        };
        //修改按钮
        $scope.editButton = {
            "id": "editSnapShotButton",
            "text": $scope.i18n.common_term_modify_button || "修改",
            disable: true,
            "click": function () {
                var winParam = {
                    "vmId": $scope.vmId,
                    "snapshotId": $scope.currentSnapshotId,
                    "name": $scope.snapshot.name.value,
                    "desc": $scope.snapshot.desc.value
                };
                var newWindow = new Window({
                    "winId": "editSnapShotWindow",
                    "title": $scope.i18n.vm_term_modifySnap_button || "修改快照",
                    "content-type": "url",
                    "buttons": null,
                    winParam: winParam,
                    "content": "app/business/resources/views/hypervisor/vmInfo/editSnapshot.html",
                    "height": 280,
                    "width": 480
                });
                newWindow.show();
            }
        };
        //删除按钮
        $scope.deleteButton = {
            "id": "deleteSnapShotButton",
            "text": $scope.i18n.common_term_delete_button,
            disable: true,
            "click": function () {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.common_term_delConfirm_msg || "确实要删除？",
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn: true,
                            handler: function (event) {
                                $scope.operate.delete();
                                msg.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        };
        $scope.TreeNodes = [];
        function getTreeNode(VmSnapshots) {
            if (!VmSnapshots) {
                return;
            }
            var nodes = [];
            for (var i = 0; i < VmSnapshots.length; i++) {
                $scope.TreeNodes.push(getNode(null, VmSnapshots[i]));
                recursiveSetSnapshot(VmSnapshots[i].id, VmSnapshots[i].childSnapshots);
            }
        }

        function recursiveSetSnapshot(parentId, childSnaps) {
            if (!childSnaps) {
                return;
            }
            for (var i = 0; i < childSnaps.length; i++) {
                $scope.TreeNodes.push(getNode(parentId, childSnaps[i]));
                if (childSnaps[i].childSnapshots) {
                    recursiveSetSnapshot(childSnaps[i].id, childSnaps[i].childSnapshots);
                }
            }
        }

        function getNode(pId, snap) {
            return  {
                id: snap.id,
                pId: pId,
                name: snap.name,
                memoryShot: snap.needMemoryShot,
                status: snap.status,
                createTime: snap.createTime,
                description: snap.description,
                type: snap.type,
                icon: "../theme/default/images/gm/irm_rpool_vm_snapshot.png",
                disable: false,
                selected: (snap.id == $scope.currentRespSID),
                open: true
            };
        }

        function precision3(number) {
            try {
                number = parseFloat(number);
            } catch (error) {
                number = 0;
            }
            return  Math.round(number * 1000) / 1000;
        }

        $scope.operate = {
            "init": function () {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots", o: {vm_id: $scope.vmId}},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.TreeNodes = [];
                    if (data) {
                        $scope.currentRespSID = (data.current) ? data.current.id : null;
                        getTreeNode(data.snapshots);
                    }
                    $scope.$apply(function () {
                        $scope.snapshotTreeMode.values = $scope.TreeNodes;
                    });
                    if ($scope.currentRespSID != null) {
                        $scope.operate.getSnapshot($scope.currentRespSID);
                    }
                });
                deferred.fail(function (data) {
                });
            },
            //快照详情
            'getSnapshot': function (snapshotId) {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots/{id}", o: {vm_id: $scope.vmId, id: snapshotId}},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        if (data && data.vmSnapshot) {
                            var node = data.vmSnapshot;
                            if (node.type !== 'backup' && node.type !== 'CBTbackup') {
                                $scope.recoverVmButton.disable = false;
                                $scope.editButton.disable = false;
                                $scope.deleteButton.disable = false;
                            }
                            $scope.currentSnapshotId = node.id;
                            $scope.snapshot.name.value = node.name;
                            $scope.snapshot.memory.value = node.includingMemorySnapshot ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                            $scope.snapshot.memory.value = $scope.vmType === "vmware"?"-":$scope.snapshot.memory.value;
                            $scope.snapshot.copy.value = (node.type === 'backup' || node.type === 'CBTbackup') ? $scope.i18n.common_term_yes_button  : $scope.i18n.common_term_no_label;
                            $scope.snapshot.status.value = SNAPSHOT_STATUS[node.status];
                            if (node.snapProvisionSize != -1) {
                                var snapSize = node.snapProvisionSize / 1024;
                                $scope.snapshot.snapProvisionSize.value = precision3(snapSize) + "GB";
                            } else {
                                $scope.snapshot.snapProvisionSize.value = "-";
                            }

                            var tt = MonitorService.getFormatDateByLong(MonitorService.getLocalTime(node.createTime));
                            $scope.snapshot.time.value = tt;
                            $scope.snapshot.desc.value = node.description;
                        }
                    });
                });
                deferred.fail(function (data) {
                });
            },
            "delete": function () {
                var deferred = camel.delete({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots/{id}", o: {vm_id: $scope.vmId, id: $scope.currentSnapshotId}},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "recover": function () {
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots/{id}", o: {vm_id: $scope.vmId, id: $scope.currentSnapshotId}},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        };

        function taskMessage() {
            var options = {
                type: "confirm",
                content: $scope.i18n.task_view_task_info_confirm_msg || "任务发放成功，是否前往任务中心查看？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            msg.destroy();
                            $state.go("system.taskCenter");
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                            $scope.operate.init();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function getVM() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                $scope.$apply(function () {
                    $scope.createButton.disable = false;
                    if (vmInfo) {
                        $scope.vmType = vmInfo.vmType;
                        if (vmInfo.isTemplate == 'true' || vmInfo.isLinkClone == 'true') {
                            $scope.createButton.disable = true;
                        }
                        if (vmInfo.os) {
                            $scope.vmOsType = vmInfo.os.osVersiontype;
                        }
                    }
                });
                $scope.operate.init();
            });
        }

        getVM();
    }];
    return snapshotCtrl;
});
