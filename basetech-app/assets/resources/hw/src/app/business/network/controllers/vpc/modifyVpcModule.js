/*global define*/
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "language/keyID",
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'app/services/messageService',
    'app/services/exceptionService',
    "app/business/network/services/vpc/vpcService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
], function (sprintf, $, angular, keyIDI18n, http, UnifyValid, validatorService, messageService, exception, vpcService) {
    "use strict";
    var modifyCtrl = ["$scope", "$compile", 'camel', "$q", "exception",
        function ($scope, $compile, camel, $q, exception) {
            var $rootScope = $("html").scope();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var vpcServiceIns = new vpcService(exception, $q, camel);
            var validator = new validatorService();
            var htmlDom = $("html");

            var $state = htmlDom.injector().get("$state");
            var modifyWinDom = $("#modifyVpcWindow");
            var vpc = modifyWinDom.widget().option("rowData");
            var cloudInfraId = modifyWinDom.widget().option("cloudInfraId");
            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "id": "modifyVpcName",
                "value": vpc.name,
                "require": true,
                "tipWidth":($rootScope.urlParams.lang == "zh"? "200px": "280px"),
                validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validator.vpcName + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "16"),
                "tipPosition": "right"
            };
            $scope.description = {
                "label": i18n.common_term_desc_label + ":",
                "id": "modifyVpcDesc",
                "value": vpc.description,
                "type": "multi",
                "width": "225",
                "height": "40",
                "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                "tooltip": i18n.sprintf(i18n.common_term_length_valid, "0", "1024"),
                "tipPosition": "right"
            };
            $scope.okBtn = {
                "id": "modify-vpc-ok",
                "text": i18n.common_term_modify_button,
                "click": function () {
                    var vpcNameDom = $("#modifyVpcName");
                    var vpcDescDom = $("#modifyVpcDesc");

                    //校验是否输入
                    var validModifyName = UnifyValid.FormValid(vpcNameDom, undefined);
                    var validDes = UnifyValid.FormValid(vpcDescDom, undefined);
                    if (!validModifyName || !validDes) {
                        return;
                    }

                    var promise = vpcServiceIns.modifyVpc({
                        "vdcId": htmlDom.scope().user.vdcId,
                        "id": vpc.vpcID,
                        "userId": htmlDom.scope().user.id,
                        "cloudInfraId": cloudInfraId,
                        "param": {
                            "name": vpcNameDom.widget().getValue(),
                            "description": vpcDescDom.widget().getValue()
                        }
                    });
                    promise.then(function () {
                        $("#modifyVpcWindow").widget().destroy();
                        $state.go("network.manager.myVPClist");
                    });
                }
            };
            $scope.cancelBtn = {
                "id": "modify-vpc-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#modifyVpcWindow").widget().destroy();
                }
            };
        }
    ];
    var modifyVPC = angular.module("modifyVPC", ["ng", "wcc"]);
    modifyVPC.controller("modifyCtrl", modifyCtrl);
    modifyVPC.service("camel", http);
    modifyVPC.service("exception", exception);
    return modifyVPC;
});
