/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/exceptionService"
], function ($,angular, Radio, Message, httpService, validatorService, UnifyValid,uibootstrap, Exception) {
    "use strict";
    var exportVmCtrl = ["$scope", "camel", "validator","$sce",
        function ($scope, camel, validator,$sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#exportVmWindow").widget();
            var hypervisorId = window.option("hypervisorId");
            var vmId = window.option("vmId");

            $scope.vm_vm_export_para_path_mean_label = $sce.trustAsHtml($scope.i18n.vm_vm_export_para_path_mean_label);

            //接入协议下拉框
            $scope.protocolSelector = {
                "label": $scope.i18n.common_term_protocolType_label+":",
                "require": true,
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";",
                "id": "exportVmProtocolSelector",
                "width": "150",
                "values": [
                    {
                        "selectId": "CIFS",
                        "label": "CIFS",
                        "checked": true
                    },
                    {
                        "selectId": "NFS",
                        "label": "NFS"
                    }
                ]
            };
            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "require": true,
                "id": "exportNameTextbox",
                "value": "",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(100):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"100"})+
                    ";regularCheck(/^[0-9a-zA-Z .\\_\\-]{1,100}$/):"+$scope.i18n.common_term_composition14_valid
            };
            //目录输入框
            $scope.dirTextbox = {
                "label": $scope.i18n.common_term_path_label+":",
                "require": true,
                "id": "exportDirTextbox",
                "value": "",
                "extendFunction": ["cifsDirCheck", "nfsDirCheck"],
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(100):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"100"})+
                    ";cifsDirCheck():"+$scope.i18n.common_term_formatpath_valid+
                    ";nfsDirCheck():"+$scope.i18n.common_term_formatpath_valid
            };
            UnifyValid.cifsDirCheck = function () {
                var protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                if(protocol !== "CIFS"){
                    return true;
                }
                var dir = $("#" + $scope.dirTextbox.id).widget().getValue();
                return validator.cifsDirReg.test(dir);
            };
            UnifyValid.nfsDirCheck = function () {
                var protocol = $("#" + $scope.protocolSelector.id).widget().getSelectedId();
                if(protocol !== "NFS"){
                    return true;
                }
                var dir = $("#" + $scope.dirTextbox.id).widget().getValue();
                return validator.nfsDirReg.test(dir);
            };
            //使用本机账户复选框
            $scope.accountCheckbox = {
                "label": "",
                "id": "exportAccountCheckbox",
                "text": $scope.i18n.vm_vm_import_para_useLocalUser_label,
                "checked": true,
                "change": function () {
                    var result = $("#" + $scope.accountCheckbox.id).widget().option("checked");
                    $("#" + $scope.usernameTextbox.id).widget().option("disable", !result);
                    $("#" + $scope.passwordTextbox.id).widget().option("disable", !result);
                }
            };
            //用户名输入框
            $scope.usernameTextbox = {
                "label": $scope.i18n.common_term_userName_label+":",
                "require": true,
                "id": "exportUsernameTextbox",
                "value": "",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(63):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"63"})
            };
            //密码输入框
            $scope.passwordTextbox = {
                "label": $scope.i18n.common_term_psw_label+":",
                "require": false,
                "type": "password",
                "id": "passwordTextbox",
                "value": "",
                "validate": "maxSize(63):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"63"})
            };
            //覆盖已有模板复选框
            $scope.coverCheckbox = {
                "label": "",
                "id": "exportCoverCheckbox",
                "text": $scope.i18n.vm_vm_export_info_cover_msg
            };
            //确定按钮
            $scope.okButton = {
                "id": "exportVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#exportVmDiv"));
                    if (!result) {
                        return;
                    }
                    exportVm();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "exportVmCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function exportVm() {
                var params = {
                    exportVm: {
                        name: $("#" + $scope.nameTextbox.id).widget().getValue(),
                        url: $("#" + $scope.dirTextbox.id).widget().getValue(),
                        protocol: $("#" + $scope.protocolSelector.id).widget().getSelectedId(),
                        isOverwrite: $("#" + $scope.coverCheckbox.id).widget().option("checked")
                    }
                };
                if ($("#" + $scope.accountCheckbox.id).widget().option("checked")) {
                    params.exportVm.userName = $("#" + $scope.usernameTextbox.id).widget().getValue();
                    params.exportVm.passWord = $("#" + $scope.passwordTextbox.id).widget().getValue();
                }
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}/action", o: {id: vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function goToTaskCenter() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label:$scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                                $state.go("system.taskCenter");
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
        }];

    var exportVmModule = angular.module("resources.vm.exportVm", ["ng","ui.bootstrap"]);
    exportVmModule.service("camel", httpService);
    exportVmModule.service("validator", validatorService);
    exportVmModule.controller("resources.vm.exportVm.ctrl", exportVmCtrl);
    return exportVmModule;
});