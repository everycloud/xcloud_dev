define(['jquery',
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"], function ($,http,validatorService,UnifyValid,Exception) {

    var editSnapshotCtrl = ["$scope","validator","camel",function ($scope,validator,camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var wind = $("#editSnapShotWindow").widget();
        var winParam = wind.option("winParam");
        var vmId = winParam.vmId;
        var snapshotId = winParam.snapshotId;
            //快照名称输入框
            $scope.nameTextbox = {
                "id": "snapshotNameTextbox",
                "label":($scope.i18n.common_term_name_label ||"快照名称") + ":",
                "require":true,
                "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";maxSize(64):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符") ,
                "tooltip" : ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64) || "长度范围是1个～64个字符。"),
                "value":winParam.name
            }
            //描述输入框
            $scope.descTextbox = {
                "id": "snapshotDescTextbox",
                "label":$scope.i18n.common_term_desc_label+":",
                "require":true,
                "type":"multi",
                "width": 220,
                "height": 60,
                "value":winParam.desc,
                "validate": ";maxSize(1024):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 0, 1024) || "长度范围是0个～1024个字符")
            }
            //确定按钮
            $scope.okButton = {
                "id":"editSnapshotOkButton",
                "text": $scope.i18n.common_term_save_label || "保存",
                "click":function(){
                    $scope.operate.editSave();
                }
            }
            //取消按钮
            $scope.cancelButton = {
                "id":"editSnapshotCancelButton",
                "text":$scope.i18n.common_term_cancle_button,
                "click":function(){
                    $("#" + "editSnapShotWindow").widget().destroy();
                }
            };
        $scope.operate = {
            "editSave":function(){
                var result = UnifyValid.FormValid($("#editSnapshotDiv"));
                if(!result){
                    return;
                }
                var params = {
                    name :$("#snapshotNameTextbox").widget().getValue(),
                    description : $("#snapshotDescTextbox").widget().getValue()
                }
                var deferred = camel.put({
                    url: {s: "/goku/rest/v1.5/irm/1/vms/{vm_id}/snapshots/{id}", o: {vm_id: vmId,id:snapshotId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $("#editSnapShotWindow").widget().destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        };
        }];

    var editSnapshotModule = angular.module("resources.hypervisor.editSnapshot", ["ng"]);
    editSnapshotModule.service("validator",validatorService);
    editSnapshotModule.service("camel", http);
    editSnapshotModule.controller("resources.vmInfo.editSnapshot.ctrl", editSnapshotCtrl);
    return editSnapshotModule;
});