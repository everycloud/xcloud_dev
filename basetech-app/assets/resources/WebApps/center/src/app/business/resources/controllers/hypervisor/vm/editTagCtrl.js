/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($,angular, validatorService,UnifyValid, httpService, Exception) {
    "use strict";
    var editTagCtrl = ["$scope", "validator","camel", function ($scope, validator,camel) {
        var exceptionService = new Exception();
        var window = $("#editVmTagWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var selectedVm = window.option("selectedVm");
        //标签输入框
        $scope.tagTextbox = {
            "id": "vmTagTextbox",
            "label": $scope.i18n.cloud_term_tag_label+":",
            "require": false,
            "validate": "maxSize(256):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"256"})+
                ";regularCheck(" + validator.vmTagReg +
                "):"+$scope.i18n.common_term_composition11_valid
        };
        //确定按钮
        $scope.okButton = {
            "id": "editVmTagOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#editVmTagDiv"));
                if (!result) {
                    return;
                }
                editTag();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "editVmTagCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function editTag() {
            var params = {
                "tag": {
                    "vmIds": selectedVm,
                    "tag": $("#"+$scope.tagTextbox.id).widget().getValue()
                }
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/vms"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                window.destroy();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
    }];

    var editVmTagModule = angular.module("resources.vm.editTag", ["ng"]);
    editVmTagModule.service("validator", validatorService);
    editVmTagModule.service("camel", httpService);
    editVmTagModule.controller("resources.vm.editTag.ctrl", editTagCtrl);
    return editVmTagModule;
});