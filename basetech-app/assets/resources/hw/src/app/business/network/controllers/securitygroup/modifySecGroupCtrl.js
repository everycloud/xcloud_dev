define([
        "sprintf",
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/business/network/services/securitygroup/securityGroupService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/securitygroup/securitygroupFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, securityGroupService) {
        "use strict";
        var ctrl = ["$scope", "camel", "$q",
            function ($scope, camel, $q) {
                var validatorServiceIns = new validatorService();
                var exception = $("html").injector().get("exception");
                var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                //获取参数
                $scope.params = $("#modifySecurityGroupWindowId").widget().option("params");
                $scope.groupName = {
                    "id": "modify-securitygroup-name",
                    "label": i18n.common_term_name_label + ":",
                    "value": "",
                    "tip": "",
                    "width": 280,
                    require: true,
                    validate: "required:" + i18n.common_term_null_valid + ";regularCheck(" + validatorServiceIns.name + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + ";"
                };
                $scope.description = {
                    "id": "modify-securitygroup-description",
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 280,
                    "height": 40,
                    "validate": "maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "0", "256")
                };
                $scope.okBtn = {
                    "id": "modify-securitygroup-ok",
                    "text": i18n.common_term_modify_button,
                    tip: "",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#modify-securitygroup-basic"));
                        if (!valid) {
                            return;
                        }

                        var options = {
                            "user": user,
                            "vpcId": $scope.params.vpcId,
                            "id": $scope.params.secGroupId,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "name": $("#" + $scope.groupName.id).widget().getValue(),
                            "description": $("#" + $scope.description.id).widget().getValue()
                        };
                        var deferred = securityGroupServiceIns.updateSecurityGroupDetail(options);
                        deferred.then(function (data) {
                            $("#modifySecurityGroupWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "modify-securitygroup-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifySecurityGroupWindowId").widget().destroy();
                    }
                };

                var getSecGroupDetail = function () {
                    var options = {
                        "user": user,
                        "vpcId": $scope.params.vpcId,
                        "id": $scope.params.secGroupId,
                        "cloudInfraId": $scope.params.cloudInfraId
                    };
                    var deferred = securityGroupServiceIns.querySecurityGroupDetail(options);
                    deferred.then(function (response) {
                        if (!response) {
                            return;
                        }
                        $("#" + $scope.groupName.id).widget().option("value", response.name);
                        $("#" + $scope.description.id).widget().option("value", response.description);
                    });
                };

                getSecGroupDetail();
            }
        ];
        var module = angular.module("modifySecuriryGroupModule", ["ng", "wcc", "ngSanitize"]);
        module.controller("modifySecuriryGroupCtrl", ctrl);
        module.service("camel", http);
        return module;
    });
