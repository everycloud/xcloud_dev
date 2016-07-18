define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/validatorService",
    "app/services/httpService",
    "app/services/exceptionService",
    "tiny-common/UnifyValid",
    "app/business/resources/services/openstackResources/ajaxNetwork"],
    function ($, angular, Window, validatorService, httpService, ExceptionService, UnifyValid, ajax) {
        "use strict";

        var createMacPoolCtrl = ["$scope", "$compile", "camel", 'validator', function ($scope, $compile, camel, validator) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.projectId = undefined;
            $scope.token = undefined;

            var exceptionService = new ExceptionService();
            var window = $("#createMacPoolWindow").widget();
            var action = window.option("action");
            $scope.serviceID = window.option("serviceId");

            //名称输入框
            $scope.macName = {
                "id": "nameTextBox",
                "label": $scope.i18n.common_term_name_label + ":" || "名称:",
                "require": true,
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 20}) + " " + $scope.i18n.common_term_composition1_valid,
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.userNameRe + "):" +
                    $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 20})
            }
            //描述输入框
            $scope.descriptionTextBox = {
                "id": "descriptionTextBox",
                "label": $scope.i18n.common_term_desc_label + ":" || "描述:",
                "require": false
            }

            //确定按钮
            $scope.okButton = {
                "id": "creatMacPoolOkButton",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "click": function () {
                    var result = UnifyValid.FormValid($("#createMacPoolDiv"));
                    if (!result) {
                        return;
                    }
                    if (action == "add") {
                        $scope.operator.createMacPool();
                    }
                }
            }
            //取消按钮
            $scope.cancelButton = {
                "id": "creatMacCancelButton",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    window.destroy();
                }
            }

            $scope.operator = {
                "createMacPool": function () {
                    var deferred = camel.get({
                        "url": {"s": "/goku/rest/v1.5/token"},
                        "params": {"user-id": user.id},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }
                        $scope.token = data.id;
                        $scope.projectId = data.projectId;

                        var segment = {
                            macpool: {
                                "name": $("#" + $scope.macName.id).widget().getValue(),
                                "description": $("#" + $scope.descriptionTextBox.id).widget().getValue()
                            }
                        }
                        ajax.network.createMacPool($scope.serviceID, segment, function () {
                            window.destroy();
                        });

                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            }
        }];

        var createMacPoolModule = angular.module("resources.mac.createMacPool", ["ng"]);
        createMacPoolModule.service("validator", validatorService);
        createMacPoolModule.service("camel", httpService);
        createMacPoolModule.controller("resources.mac.createMacPool.ctrl", createMacPoolCtrl);
        return createMacPoolModule;
    });
