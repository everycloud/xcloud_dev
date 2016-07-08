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
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
                //获取参数
                $scope.params = $("#createSecurityGroupWindowId").widget().option("params");
                //安全组互通性：0，禁止互通，1，开启互通
                $scope.intraTrafficAllow = 1;

                function getNameValidateStr() {
                    var validateStr = "";
                    if ($scope.params.openstack) {
                        var regular = "/^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,64}$/";
                        validateStr = "required:" + i18n.common_term_null_valid + ";regularCheck(" + regular + "):" +
                            i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + ";";
                    } else {
                        validateStr = "required:" + i18n.common_term_null_valid + ";regularCheck(" + validatorServiceIns.name + "):" +
                            i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") + ";";
                    }
                    return validateStr;
                }
                $scope.groupName = {
                    "id": "create-securitygroup-name",
                    label: i18n.common_term_name_label + ":",
                    "tip": "",
                    "width": 280,
                    require: true,
                    validate: getNameValidateStr()
                };
                $scope.groupShare = {
                    "label": i18n.security_term_GroupSharing_label + "：",
                    "require": true,
                    "layout": "vertical",
                    "id": "create-securitygroup-pass",
                    "values": [{
                        "key": "1",
                        "text": i18n.common_term_enable_button,
                        "checked": true
                    }, {
                        "key": "0",
                        "text": i18n.common_term_disable_button
                    }],
                    "change": function (event) {
                        $scope.intraTrafficAllow = $("#" + $scope.groupShare.id).widget().opChecked("checked");
                    }
                };

                function getDescValidateStr() {
                    var validateStr = "";
                    if ($scope.params.openstack) {
                        validateStr = "maxSize(255):" + i18n.sprintf(i18n.common_term_length_valid, "0", "255");
                    } else {
                        validateStr = "maxSize(256):" + i18n.sprintf(i18n.common_term_length_valid, "0", "256");
                    }
                    return validateStr;
                }
                $scope.description = {
                    "id": "create-securitygroup-description",
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 280,
                    "height": 40,
                    "validate": getDescValidateStr()
                };
                $scope.okBtn = {
                    "id": "create-securitygroup-ok",
                    "text": i18n.common_term_create_button,
                    tip: "",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#create-securitygroup-basic"));
                        if (!valid) {
                            return;
                        }

                        var options = {
                            "user": user,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "name": $("#" + $scope.groupName.id).widget().getValue(),
                            "description": $("#" + $scope.description.id).widget().getValue(),
                            "vpcId": $scope.params.vpcId,
                            "intraTrafficAllow": $scope.intraTrafficAllow
                        };
                        var deferred = securityGroupServiceIns.createSecurityGroup(options);
                        deferred.then(function (data) {
                            $("#createSecurityGroupWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "create-securitygroup-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createSecurityGroupWindowId").widget().destroy();
                    }
                };
            }
        ];
        var module = angular.module("createSecurityGroupModule", ["ng", "wcc", "ngSanitize"]);
        module.controller("createSecurityGroupCtrl", ctrl);
        module.service("camel", http);
        return module;
    });
