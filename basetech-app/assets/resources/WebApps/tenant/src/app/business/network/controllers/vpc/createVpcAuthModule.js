/*global define*/
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    'app/services/messageService',
    'app/services/exceptionService',
    "app/services/cloudInfraService",
    "app/business/network/services/vpc/vpcService",
    "app/business/network/services/networkService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
], function (sprintf, $, angular, ngSanitize, keyIDI18n, http, _, UnifyValid, validatorService, messageService, exception, cloudInfraService, vpcService, networkService) {
    "use strict";
    var ctrl = ["$scope", "$compile", 'camel', "$q", "exception",
        function ($scope, $compile, camel, $q, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var cloudInfraId = $("#createVpcAuthWindow").widget().option("cloudInfraId");
            var vpcServiceIns = new vpcService(exception, $q, camel);
            var netServiceIns = new networkService(exception, $q, camel);
            var htmlDom = $("html");
            var user = htmlDom.scope().user;

            $scope.vpcSelect = {
                "id": "create-vpc-auth-vpcSelect",
                "label": i18n.vpc_term_chooseVPC_label + ":",
                "width": 220,
                "require": true,
                "values": []
            };

            $scope.confirmAuth = {
                "label": i18n.org_term_entitlementConfirm_label + ":",
                "id": "ecsStorageDisksDeleteType",
                "text": i18n.org_entitle_add_para_confirm_label,
                "change": function () {
                    $scope.okBtn.disable = !$("#" + $scope.confirmAuth.id).widget().option("checked");
                }
            };

            $scope.okBtn = {
                "id": "create-vpc-auth-ok",
                "text": i18n.common_term_create_button,
                "disable": true,
                "click": function () {
                    var promise = netServiceIns.createVpcAuth({
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": $("#" + $scope.vpcSelect.id).widget().getSelectedId()
                    });
                    promise.then(function () {
                        $("#createVpcAuthWindow").widget().destroy();
                    });
                }
            };
            $scope.cancelBtn = {
                "id": "create-vpc-auth-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#createVpcAuthWindow").widget().destroy();
                }
            };

            //获取VPC列表
            function getVPCList() {
                var promise = vpcServiceIns.getVpcList({
                    "vdc_id": user.vdcId,
                    "cloudInfraId": cloudInfraId,
                    "userId": user.id,
                    "shared": false
                });

                promise.then(function (data) {
                    if (!data || !data.vpcs) {
                        $scope.vpcSelect.values = [];
                        return;
                    }
                    var vpcSelect = [];
                    _.each(data.vpcs, function (vpc) {
                        vpcSelect.push({
                            "selectId": vpc.vpcID,
                            "label": vpc.name
                        });
                    });
                    if (vpcSelect.length > 0) {
                        vpcSelect[0].checked = true;
                    }
                    $scope.vpcSelect.values = vpcSelect;
                });
            }

            getVPCList();
        }
    ];
    var modifyVPC = angular.module("createVpcAuth", ["ng", "wcc", "ngSanitize"]);
    modifyVPC.controller("createVpcAuthCtrl", ctrl);
    modifyVPC.service("camel", http);
    modifyVPC.service("exception", exception);
    return modifyVPC;
});
