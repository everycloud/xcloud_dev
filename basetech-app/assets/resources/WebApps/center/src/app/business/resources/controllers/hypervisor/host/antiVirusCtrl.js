/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($,angular, Message,validatorService,UnifyValid, httpService, Exception) {
    "use strict";
    var antiVirusCtrl = ["$scope", "validator","camel", function ($scope, validator,camel) {
        var exceptionService = new Exception();
        var window = $("#antiVirusWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var hostId = window.option("hostId");

        $scope.effect = true;
        //开启防病毒复选框
        $scope.openCheckbox = {
            "id": "openCheckbox",
            "text": $scope.i18n.common_term_turnOnAntivirus_button,
            "change":function(){
                var open = $("#"+$scope.openCheckbox.id).widget().option("checked");
                $("#"+$scope.vmNumTextbox.id).widget().option("disable",!open);
            }
        };
        //安全用户虚拟机数量输入框
        $scope.vmNumTextbox = {
            "id": "vmNumTextbox",
            "label": $scope.i18n.vm_term_securityUserVMnum_label+":",
            "require": false,
            "disable":true,
            "validate": "require:"+$scope.i18n.common_term_null_valid+
                ";integer:"+$scope.i18n.common_term_PositiveIntegers_valid+
                ";minValue(1):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":0,"2":170})+
                ";maxValue(170):"+validator.i18nReplace($scope.i18n.common_term_range_valid,{"1":0,"2":170})
        };
        //确定按钮
        $scope.okButton = {
            "id": "antiVirusOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var result = UnifyValid.FormValid($("#antiVirusDiv"));
                if (!result) {
                    return;
                }
                setAntiVirus();
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "antiVirusCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function editMessage() {
            var options = {
                type: "prompt",
                content: $scope.i18n.virtual_host_setAntivirus_info_succeed_msg,
                height: "150px",
                width: "350px"
            };
            var msg = new Message(options);
            msg.show();
        }
        function setAntiVirus() {
            var antiVirus = 0;
            var open = $("#"+$scope.openCheckbox.id).widget().option("checked");
            if(open){
                antiVirus = $("#"+$scope.vmNumTextbox.id).widget().getValue();
            }
            var params = {
                "antivirus":antiVirus
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/hosts/{id}/securityswitch",o:{id:hostId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                window.destroy();
                editMessage();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function getAntiVirus() {
            var deferred = camel.get({
                "url": {s: "/goku/rest/v1.5/irm/1/hosts/{id}/securityswitch",o:{id:hostId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var antiVirus = data.antivirusReboot || 0;
                if(antiVirus > 0){
                    $("#"+$scope.openCheckbox.id).widget().option("checked",true);
                    $("#"+$scope.vmNumTextbox.id).widget().option("value",antiVirus);
                    $("#"+$scope.vmNumTextbox.id).widget().option("disable",false);
                }
                $scope.$apply(function(){
                    $scope.effect = data.antivirus === data.antivirusReboot;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        getAntiVirus();
    }];

    var antiVirusModule = angular.module("resources.host.antiVirus", ["ng"]);
    antiVirusModule.service("validator", validatorService);
    antiVirusModule.service("camel", httpService);
    antiVirusModule.controller("resources.host.antiVirus.ctrl", antiVirusCtrl);
    return antiVirusModule;
});