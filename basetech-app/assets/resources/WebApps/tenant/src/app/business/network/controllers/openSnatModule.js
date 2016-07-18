/**
 * Created on 14-2-26.
 */
/*global define*/
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/networkService",
    "app/business/network/services/publicIP/publicIPService",
    'tiny-directives/RadioGroup',
    'tiny-directives/IP',
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, messageService, exception, networkService, publicIPService) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {

                $scope.networkServiceInst = new networkService(exception, $q, camel);
                var validator = new validatorService();

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                // 父窗口传递的添加对象
                var param = $("#openSnatWindow").widget().option("param");
                $scope.mode = param.mode;

                $scope.close = function () {
                    $("#openSnatWindow").widget().destroy();
                };
                $scope.info = {
                    choice: {
                        label: i18n.vpc_term_publicIP_label + ":",
                        require: false,
                        "id": "publicIP",
                        width:"145",
                        "height": "150",
                        values: []
                    },
                    okBtn: {
                        "id": "openSnatWindowOkBtn",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            var promise = $scope.networkServiceInst.openSnat({
                                "cloudInfraId": param.cloudInfraId,
                                "vdcId": param.vdcId,
                                "userId": param.id,
                                "vpcId": param.vpcId,
                                "networkID": param.networkID,
                                "publicIP": $("#" + $scope.info.choice.id).widget().getSelectedId()
                            });
                            promise.then(function (data) {
                                $scope.close();
                            });
                        }
                    },
                    cancelBtn: {
                        "id": "openSnatWindowCancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                        }
                    }
                };
                function queryPublicIPs () {
                    var options = {
                        "cloudInfraId": param.cloudInfraId,
                        "vpcId": param.vpcId,
                        "vdcId": param.vdcId,
                        "usedType": "SNAT"
                    };
                    var deferred = publicIPService.publicIP.queryList(options,
                        function (data) {
                            if (!data) {
                                return;
                            }
                            var publicIPRes = data.publicIPs;
                            var selArray = [];
                            var isHasSnat = false;
                            var itemSant = "";
                            for(var ipIndex in publicIPRes){
                                var item = publicIPRes[ipIndex];
                                for(var index in item.usages){
                                    if("SNAT" === item.usages[index].usage){
                                        isHasSnat = true;
                                        itemSant = item;
                                    }
                                }
                                if(isHasSnat){
                                    break;
                                }
                                selArray.push({
                                    "selectId": item.ip,
                                    "label": item.ip
                                });
                            }
                            if(isHasSnat){
                                selArray = [
                                    {
                                        "selectId": itemSant.ip,
                                        "label": itemSant.ip,
                                        "checked": true
                                    }
                                ]
                                $("#" + $scope.info.choice.id).widget().option("disable", true);
                            }
                            if (selArray.length > 0) {
                                selArray[0].checked = true;
                            }
                            $scope.info.choice.values = selArray;
                            $scope.$digest();
                        }
                    );
                }
                queryPublicIPs();
            }
        ];

        var dependency = [
            'ng', 'wcc', "ngSanitize"
        ];
        var operatePrivateIpWindow = angular.module("openSnatWindow", dependency);
        operatePrivateIpWindow.controller("openSnatWindowCtrl", ctrl);
        operatePrivateIpWindow.service("camel", http);
        operatePrivateIpWindow.service("exception", exception);

        return operatePrivateIpWindow;
    });
