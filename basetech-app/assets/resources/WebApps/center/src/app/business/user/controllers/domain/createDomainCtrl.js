define([
    'jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/exceptionService",
    'tiny-widgets/Message',
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup"
],
    function ($, angular, http, UnifyValid, ValidatorService, ExceptionService, Message, Checkbox) {

        var createDomainCtrl = ['$scope', 'camel', 'validator',
                function ($scope, camel, validator) {
                    var $rootScope = $("html").scope();
                    var user = $rootScope.user;
                    var i18n = $rootScope.i18n;
                    $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                    $scope.name = {
                        "id": "createDomainNameId",
                        "label": (i18n.common_term_name_label || "名称") + ":",
                        "require": true,
                        "value": "",
                        "type": "input",
                        "readonly": false,
                        "tooltip": i18n.sprintf(i18n.common_term_length_valid, 1, 20) + i18n.common_term_composition2_valid,
                        "validate": "required:" + i18n.common_term_null_valid
                            + ";maxSize(20):" + i18n.sprintf(i18n.common_term_length_valid, 1, 20)
                            + ";regularCheck(" + validator.ChineseRe + "):" + i18n.common_term_composition2_valid
                    };
                    $scope.description = {
                        "id": "createDomainDescId",
                        "label": (i18n.common_term_desc_label || "描述") + ":",
                        "require": false,
                        "value": "",
                        "type": "multi",
                        "width": 300,
                        "height": 60,
                        "readonly": false,
                        "validate": "maxSize(128):" + i18n.sprintf(i18n.common_term_length_valid, 1, 128)
                    };
                    $scope.createBtn = {
                        "id": "createDomainBtnId",
                        "text": i18n.common_term_create_button || "创建",
                        "click": function () {
                            var result = UnifyValid.FormValid($("#createDomainDiv"));
                            if (!result) {
                                return;
                            }
                            var createDomain = {
                                "domainName": $("#createDomainNameId").widget().getValue(),
                                "domainDesc": $("#createDomainDescId").widget().getValue()
                            }

                            var deferred = camel.post({
                                "url": {
                                    s: "/goku/rest/v1.5/{tenant_id}/domains",
                                    o: {
                                        "tenant_id": "1"
                                    }
                                },
                                "params": JSON.stringify(createDomain),
                                "userId": user.id
                            });
                            deferred.done(function (response) {
                                $scope.$apply(function () {
                                    $("#createDomainWindowId").widget().destroy();
                                });
                            });
                            deferred.fail(function (response) {
                                $scope.$apply(function () {
                                    new ExceptionService().doException(response, $("#createDomainWindowId").widget());
                                });
                            });
                        }
                    };
                    $scope.cancelBtn = {
                        "id": "createDomainCancelBtnId",
                        "text": i18n.common_term_cancle_button || "取消",
                        "click": function () {
                            $("#createDomainWindowId").widget().destroy();
                        }
                    };

                }
            ]
            ;
        var app = angular.module("userMgr.domain.create", ['ng', "wcc"]);
        app.controller("userMgr.domain.create.ctrl", createDomainCtrl);
        app.service("camel", http);
        app.service("validator", ValidatorService);
        return app;
    })
