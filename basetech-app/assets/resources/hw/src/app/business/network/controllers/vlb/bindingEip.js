/* global define*/
define([
    "sprintf",
    'tiny-lib/angular',
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/vlb/vlbService",
    'app/services/exceptionService',
    "language/keyID",
    "fixtures/ecsFixture",
    "tiny-directives/Button"
],
    function (sprintf, angular, $, _, http, UnifyValid, validatorService, vlbService, exception, i18n) {
        "use strict";
        var ctrl = ["$scope", "$compile", "camel", "$q", "exception",
            function ($scope, $compile, camel, $q, exception) {
                i18n.sprintf = sprintf.sprintf;
                $scope.i18n = i18n;
                var vlbServiceInst = new vlbService(exception, $q, camel);
                // 待修改对象
                var bindVmWinDom = $("#bindingEipWindowId");
                var winWidget = bindVmWinDom.widget();
                var condition = winWidget.option("condition");
                var cloudInfraId = winWidget.option("cloudInfra");
                var user = winWidget.option("user");
                var vpcId = winWidget.option("vpcId");
                var user = $("html").scope().user || {};
                var isICT = (user.cloudType === "ICT");

                $scope.close = function () {
                    bindVmWinDom.widget().destroy();
                };

                $scope.info = {
                    eipDatas: {
                        "id": "binding-eip-select",
                        "label": i18n.eip_term_eips_label + ":",
                        "width": "220",
                        "require": true,
                        "value": condition.eips
                    },
                    okBtn: {
                        "id": "binding-eip-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#bindingEip-window"));
                            if (!valid) {
                                return;
                            }
                            applyEip();
                        }
                    },
                    cancelBtn: {
                        "id": "binding-eip-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                function applyEip() {
                    var options = {
                        "vdcId":  user.orgId,
                        "cloudInfraId": cloudInfraId,
                        "userId": user.id,
                        "opParam": {
                            "bindingPublicIPToLB": {}
                        }
                    };

                    var bindingPublicIPToLB = {"lbId": condition.lbID};
                    if (isICT) {
                        bindingPublicIPToLB["floatingIpId"] =  $("#binding-eip-select").widget().getSelectedId();
                    } else {
                        bindingPublicIPToLB["ip"] = $("#binding-eip-select").widget().getSelectedLabel();
                    }

                    options.opParam.bindingPublicIPToLB = bindingPublicIPToLB;

                    var promise = vlbServiceInst.operateVLB(options);
                    promise.then(function () {
                        condition.okClick = true;
                        $scope.close();
                        $scope.$destroy();
                    });
                }
            }
        ];

        var dependency = ["ng", "wcc"];
        var bindingEipWin = angular.module("bindingEipWin", dependency);
        bindingEipWin.controller("bindingEipCtrl", ctrl);
        bindingEipWin.service("camel", http);
        bindingEipWin.service("exception", exception);

        return bindingEipWin;
    });
