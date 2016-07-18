/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "app/services/validatorService",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-common/UnifyValid"], function ($, angular,validatorService, httpService, Exception, UnifyValid) {
    "use strict";
    var addSingleMactCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var window = $("#addSingleMacWindow").widget();
        var eid = window.option("eid");
        var action = window.option("action");
        var oldMac = window.option("oldMac");
        UnifyValid.macValidate = function () {
            var mac = $("#" + $scope.macTextbox.id).widget().getValue();
            if (mac.match(new RegExp(validator.macRe))) {
                return "";
            }
            else {
                return $scope.i18n.common_term_formatMAC_valid;
            }
        };
        //MAC输入框
        $scope.macTextbox = {
            "id": "addMacTextbox",
            "label": $scope.i18n.common_term_MAC_label+":",
            "require": true,
            "extendFunction": ["macValidate"],
            "validate": "required:"+$scope.i18n.common_term_null_valid+
                ";macValidate;"
        };
        //描述输入框
        $scope.descTextbox = {
            "id": "addMacdescTextbox",
            "label": $scope.i18n.common_term_desc_label+":",
            "require": true,
            "type": "multi",
            "height": "40px",
            "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"1024"})
        };
        //确定按钮
        $scope.okButton = {
            "id": "addSingleMacOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#addSingleMacDiv"));
                if (!result) {
                    return;
                }
                if (action === "edit") {
                    editMac();
                }
                else {
                    addMac();
                }
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "addSingleMacCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function addMac() {
            var params = {
                "mac": {
                    "mac": $("#" + $scope.macTextbox.id).widget().getValue(),
                    "description": $("#" + $scope.descTextbox.id).widget().getValue()
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macs", o: {id: eid}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                window.destroy();
            });
            deferred.fail(function (response) {
                exceptionService.doException(response);
            });
        }
        function editMac() {
            var params = {
                "mac": $("#" + $scope.macTextbox.id).widget().getValue(),
                "description": $("#" + $scope.descTextbox.id).widget().getValue()
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macs/{macId}", o: {id: eid, macId: oldMac.id}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.done(function (response) {
                window.destroy();
            });
            deferred.fail(function (response) {
                exceptionService.doException(response);
            });
        }
        if (action === "edit") {
            $scope.macTextbox.value = oldMac.mac;
            $scope.descTextbox.value = oldMac.description;
        }
    }];

    var addSingleMacModule = angular.module("resources.hypervisor.addSingleMac", ["ng"]);
    addSingleMacModule.service("validator", validatorService);
    addSingleMacModule.service("camel", httpService);
    addSingleMacModule.controller("resources.hypervisor.addSingleMac.ctrl", addSingleMactCtrl);
    return addSingleMacModule;
});