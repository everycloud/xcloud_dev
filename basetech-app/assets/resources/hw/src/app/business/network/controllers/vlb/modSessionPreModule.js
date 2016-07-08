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
                var validator = new validatorService();

                // 父窗口传递的添加对象
                var modDom = $("#modVlbSessionPreWindow");
                $scope.modData = modDom.widget().option("modData");
                var listenerProtocol = modDom.widget().option("listenerProtocol");
                $scope.isAppCookie = 5 === $scope.modData.sessionPre.sessionRemainMode;
                $scope.info = {
                    sessionPersistenceType: {
                        "id": "create-vlb-addmonitor-window-sessionPersistenceType",
                        "label": i18n.lb_term_stickySessionType_label + ":",
                        "width": "220",
                        "require": true,
                        "value": getSessionPersistenceType(listenerProtocol),
                        "change": function () {
                            var type = $("#create-vlb-addmonitor-window-sessionPersistenceType").widget().getSelectedId();
                            $scope.isAppCookie = type === "5";
                        }
                    },
                    cookieName: {
                        "label": i18n.lb_term_cookieName_label + ":",
                        "id": "create-vlb-configCertificate-window-cookieName",
                        "width": "214",
                        "require": true,
                        "value": $scope.modData.sessionPre.cookieName
                    },
                    okBtn: {
                        "id": "create-vlb-addmonitor-window-ok",
                        "text": i18n.common_term_ok_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#mod-vlb-window"));
                            if (!valid) {
                                return;
                            }
                            var sessionType = $("#create-vlb-addmonitor-window-sessionPersistenceType").widget().getSelectedId();
                            var sessionInfo = {};
                            if("5" === sessionType){
                                sessionInfo = {
                                    "cookieName": $("#create-vlb-configCertificate-window-cookieName").widget().getValue(),
                                    "sessionRemainMode": sessionType
                                };
                            } else{
                                sessionInfo = {
                                    "sessionRemainMode": sessionType
                                };
                            }
                            var param = {
                                "lbID":$scope.modData.lbID,
                               "vdcId": $scope.modData.tenantId,
                                "userId":$scope.modData.userId,
                                "cloudInfraId":$scope.modData.cloudInfraId,
                                "opReq":{
                                    "sessionPersistenceInfo": sessionInfo
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
                function getSessionPersistenceType(listenerProtocol){
                    if(listenerProtocol==="TCP"){
                        return [
                            {
                                "selectId": "7",
                                "label": "SOURCE_IP",
                                "checked": true
                            }
                        ];
                    }
                    return [
                        {
                            "selectId": "5",
                            "label": "APP_COOKIE",
                            "checked": 5 === $scope.modData.sessionPre.sessionRemainMode
                        },
                        {
                            "selectId": "6",
                            "label": "HTTP_COOKIE",
                            "checked": 6 === $scope.modData.sessionPre.sessionRemainMode
                        },
                        {
                            "selectId": "7",
                            "label": "SOURCE_IP",
                            "checked": 7 === $scope.modData.sessionPre.sessionRemainMode
                        }
                    ];
                }
                $scope.close = function () {
                    modDom.widget().destroy();
                };

            }
        ];

        var dependency = ["ng", "wcc"];
        var modSessionPreWindow = angular.module("modSessionPreWindow", dependency);
        modSessionPreWindow.controller("modSessionPreCtrl", ctrl);
        modSessionPreWindow.service("camel", http);
        modSessionPreWindow.service("exception", exception);
        return modSessionPreWindow;
    });
