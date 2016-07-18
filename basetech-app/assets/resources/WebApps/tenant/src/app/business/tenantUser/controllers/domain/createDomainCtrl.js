/* global define */
define([
    'jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    "language/keyID",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/tenantUser/service/userCommonService",
    'tiny-widgets/Message',
    "tiny-widgets/Checkbox",
    "app/business/tenantUser/service/userDomainService",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup"
],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, ValidatorService, UserCommonService, Message, Checkbox, userDomainService) {
        "use strict";

        var createDomainCtrl = ['$scope', 'camel', 'validator', "$q",
            function ($scope, camel, validator, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var exception = $("#createDomainWindowId").widget().option("exception");
                $scope.serviceInstance = new userDomainService(exception, $q, camel);
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                var userCommonServiceIns = new UserCommonService();
                $scope.name = {
                    "id": "createDomainNameId",
                    "label": i18n.common_term_name_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "tooltip": i18n.common_term_composition2_valid +  i18n.sprintf(i18n.common_term_length_valid, 1, 20),
                    "validate": "required:" + i18n.common_term_null_valid + ";maxSize(20):" + i18n.sprintf(i18n.common_term_length_valid, 1, 20) + ";regularCheck(" + validator.ChineseRe + "):" + i18n.common_term_composition2_valid
                };
                $scope.description = {
                    "id": "createDomainDescId",
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 300,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "0", "128")
                };
                $scope.createBtn = {
                    "id": "createDomainBtnId",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createDomainDiv"));
                        if (!result) {
                            return;
                        }
                        //获取界面输入的名称描述
                        var domainName = $("#createDomainNameId").widget().getValue();
                        var domainDesc = $("#createDomainDescId").widget().getValue();
                        var promise = $scope.serviceInstance.createDomain({
                            "user": user,
                            "domainName": domainName,
                            "domainDesc": domainDesc
                        });
                        promise.then(function (response) {
                            $("#createDomainWindowId").widget().destroy();
                        });
                    }
                };
                $scope.cancelBtn = {
                    "id": "createDomainCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createDomainWindowId").widget().destroy();
                    }
                };

            }
        ];
        var app = angular.module("userMgr.domain.create", ['ng', "wcc", "ngSanitize"]);
        app.controller("userMgr.domain.create.ctrl", createDomainCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    });
