/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/validatorService",
    "tiny-common/UnifyValid"], function ($, angular, http, Message, Exception, validatorService, UnifyValid) {
    "use strict";
    var createSnapshotCtrl = ["$scope", "validator", "$compile", "camel", function ($scope, validator, $compile, camel) {
        var exceptionService = new Exception();
        var $state = $("html").injector().get("$state");
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var wind = $("#createSnapShotWindow").widget();
        $scope.vmId = wind.option("vmId");
        $scope.vmOsType = wind.option("vmOsType");
        $scope.vmType = wind.option("vmType");

        //快照名称输入框
        $scope.nameTextbox = {
            "id": "snapshotNameTextbox",
            "label": ($scope.i18n.common_term_name_label || "快照名称") + ":",
            "require": true,
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";maxSize(64):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符"),
            "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。")
        };
        //描述输入框
        $scope.descTextbox = {
            "id": "snapshotDescTextbox",
            "label": $scope.i18n.common_term_desc_label + ":",
            "require": true,
            "type": "multi",
            "width": 220,
            "height": 60,
            "validate": ";maxSize(1024):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 0, 1024) || "长度范围是0个～1024个字符")
        };
        //生成内存快照复选框
        $scope.memoryCheckbox = {
            "id": "memoryCheckboxId",
            "disable":$scope.vmType === "vmware",
            "text": $scope.i18n.vm_snap_add_para_memSnap_label || "生成内存快照",
            "tooltip": $scope.i18n.vm_snap_add_para_mem_mean_label || "勾选后会将虚拟机内存保存在快照中"
        };
        //一致性快照复选框
        $scope.consistenceCheckbox = {
            "id": "consistenceCheckboxId",
            "text": $scope.i18n.vm_snap_add_para_sameSnap_label || "一致性快照",
            "disable": true,
            "tooltip": $scope.i18n.vm_snap_add_para_sameSnap_mean_tip || ("目前支持创建一致性快照的虚拟机操作类型为：Windows 7、 " + "<br>" +
                "Windows Server 2003、 Windows Server 2008、" + "<br>" +
                "Windows Server 2008 R2、Windows Vista。" + "<br>" +
                "当选择内存快照或虚拟机关机时，该参数不起作用。")
        };
        //确定按钮
        $scope.okButton = {
            "id": "createSnapshotOkButton",
            "text": $scope.i18n.common_term_save_label || "保存",
            "click": function () {
                $scope.operate.create();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "createSnapshotCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                $("#createSnapShotWindow").widget().destroy();
            }
        };

        $scope.operate = {
            "create": function () {
                var result = UnifyValid.FormValid($("#createSnapshotDiv"));
                if (!result) {
                    return;
                }
                var params = {
                    name: $("#snapshotNameTextbox").widget().getValue(),
                    description: $("#snapshotDescTextbox").widget().getValue(),
                    needMemoryShot: $("#memoryCheckboxId").widget().option("checked"),
                    isConsistent: $("#consistenceCheckboxId").widget().option("checked")
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots", o: {vm_id: $scope.vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
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
                                    $("#createSnapShotWindow").widget().destroy();
                                    $state.go("system.taskCenter");
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                    $("#createSnapShotWindow").widget().destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        };
////目前支持创建一致性快照的虚拟机操作类型为：
//        Windows 7、 Windows Server 2003、 Windows Server 2008、
//Windows Server 2008 R2、Windows Vista。
//当选择内存快照或虚拟机关机时，该参数不起作用。
        function init() {
            if (!$scope.vmOsType) {
                return;
            }
            var types = ["Windows 7", "Windows Server 2003", "Windows Server 2008", "Windows Server 2008 R2", "Windows Vista"];
            for (var i = 0; i < types.length; i++) {
                if ($scope.vmOsType.indexOf(types[i]) != -1) {
                    $scope.consistenceCheckbox.disable = false;
                }
            }
        }

        init();
    }];

    var createSnapshotModule = angular.module("resources.hypervisor.createSnapshot", ["ng"]);
    createSnapshotModule.service("validator", validatorService);
    createSnapshotModule.service("camel", http);
    createSnapshotModule.controller("resources.vmInfo.createSnapshot.ctrl", createSnapshotCtrl);
    return createSnapshotModule;
});