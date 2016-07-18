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

        var createMacRangeCtrl = ["$scope", "$compile", "camel", 'validator', function ($scope, $compile, camel, validator) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.projectId = undefined;
            $scope.token = undefined;

            var exceptionService = new ExceptionService();
            var window = $("#createMacRangeWindow").widget();
            $scope.serviceID = window.option("serviceId");
            $scope.poolId = window.option("poolId");
            var action = window.option("action");

            UnifyValid.macValidate = function (macId) {
                var mac = $("#" + macId).widget().getValue();
                if (mac.match(new RegExp(validator.macRe))) {
                    return "";
                }
                else {
                    return $scope.i18n.common_term_formatMAC_valid;
                }
            }

            //起始MAC输入框
            $scope.startMacTextBox = {
                "id": "startMacTextBox",
                "label": $scope.i18n.common_term_initiativeMAC_label + ":" || "起始MAC地址:",
                "require": true,
                "extendFunction": ["macValidate"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";macValidate(startMacTextBox);"
            }
            //结束MAC输入框
            $scope.endMacTextBox = {
                "id": "endMacTextBox",
                "label": $scope.i18n.common_term_endMAC_label || "结束MAC地址:",
                "require": true,
                "extendFunction": ["macValidate"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";macValidate(endMacTextBox):"
            }
            //确定按钮
            $scope.okButton = {
                "id": "creatMacOkButton",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "click": function () {
                    var result = UnifyValid.FormValid($("#createMacRangeDiv"));
                    if (!result) {
                        return;
                    }
                    if (action == "add") {
                        $scope.operator.createMacRange();
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
                "createMacRange": function () {
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
                            macrange: {
                                "pool_id": $scope.poolId,
                                "min_mac_address": $("#" + $scope.startMacTextBox.id).widget().getValue(),
                                "max_mac_address": $("#" + $scope.endMacTextBox.id).widget().getValue()
                            }
                        }
                        ajax.network.createMacRange($scope.serviceID, segment, function () {
                            window.destroy();
                        });
                    });
                }
            }
        }];

        var addMacSegmentModule = angular.module("resources.mac.createMacRange", ["ng"]);
        addMacSegmentModule.service("validator", validatorService);
        addMacSegmentModule.service("camel", httpService);
        addMacSegmentModule.controller("resources.mac.createMacRange.ctrl", createMacRangeCtrl);
        return addMacSegmentModule;
    });
