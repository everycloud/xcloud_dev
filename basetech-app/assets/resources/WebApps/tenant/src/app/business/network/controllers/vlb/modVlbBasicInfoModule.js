/* global define*/
define([
    'tiny-lib/angular',
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/vlb/vlbService",
    "language/keyID",
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (angular, $, _, http, UnifyValid, validatorService, messageService, exception, vlbService, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                var vlbServiceInst = new vlbService(exception, $q, camel);

                var vlbNameCheck = "/^[A-Za-z0-9-_ \\u4e00-\\u9fa5]{1,64}$/";
                // 父窗口传递的添加对象
                var modDom = $("#modVlbBasicInfoWindow");
                $scope.modData = modDom.widget().option("modData");
                $scope.info = {
                    name: {
                        "id": "create-vlb-name",
                        label: i18n.common_term_name_label + ":",
                        "width": "214",
                        "require": true,
                        "validate": "regularCheck(" + vlbNameCheck + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                    },
                    maxSession: {
                        label: i18n.lb_term_sessionMaxNum_label + ":",
                        "id": "create-vlb-maxSession",
                        "width": "214",
                        require: true,
                        "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";maxValue(10000):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000")
                    },
                    policyType: {
                        "label": i18n.common_term_assignPolicyType_label + ":",
                        "id": "create-vlb-policyType",
                        "width": "220",
                        "require": true,
                        "value": [
                            {
                                "selectId": "0",
                                "label": i18n.lb_term_poolingMode_label,
                                "checked": 0 === $scope.modData.distributionMode
                            },
                            {
                                "selectId": "1",
                                "label": i18n.lb_term_minConnectMode_label,
                                "checked": 1 === $scope.modData.distributionMode
                            }
                        ]
                    },
                    okBtn: {
                        "id": "create-vlb-addmonitor-window-ok",
                        "text": i18n.common_term_ok_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#mod-vlb-window"));
                            if (!valid) {
                                return;
                            }
                            var param = {
                                "lbID":$scope.modData.lbID,
                                "vdcId": $scope.modData.tenantId,
                                "userId":$scope.modData.userId,
                                "cloudInfraId":$scope.modData.cloudInfraId,
                                "opReq":{
                                    "modifyLBBasicInfo":{
                                        "distributionMode": parseInt($("#create-vlb-policyType").widget().getSelectedId(), 10),
                                        "lbName": $("#create-vlb-name").widget().getValue(),
                                        "sessionNum": parseInt($("#create-vlb-maxSession").widget().getValue(), 10)
                                    }
                                }
                            };
                            var promise = vlbServiceInst.modifyVlb(param);
                            promise.then(function(){
                                $scope.modData.isOKBttnClick = true;
                                $scope.close();
                                $scope.$destroy();
                            });
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-addmonitor-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };
                $scope.close = function () {
                    modDom.widget().destroy();
                };
            }
        ];

        var dependency = ["ng", "wcc"];
        var createMonitorWindow = angular.module("modVlbWindow", dependency);
        createMonitorWindow.controller("modVlbCtrl", ctrl);
        createMonitorWindow.service("camel", http);
        createMonitorWindow.service("exception", exception);
        return createMonitorWindow;
    });
