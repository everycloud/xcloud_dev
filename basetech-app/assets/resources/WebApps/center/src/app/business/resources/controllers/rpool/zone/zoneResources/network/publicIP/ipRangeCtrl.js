/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-4-16

 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'app/services/validatorService'],
    function ($, angular, UnifyValid, httpService, constants, ExceptionService, validatorService) {
        "use strict";
        var ipRangeCtrl = ["$scope", 'camel', 'validator', function ($scope, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            var publicIpPoolId = $("#ipRangeWin").widget().option("publicIpPoolId");
            var newData = $("#ipRangeWin").widget().option("newData");
            $scope.i18n = $("html").scope().i18n;
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneName": $("#ipRangeWin").widget().option("zoneName"),
                "zoneID": $("#ipRangeWin").widget().option("zoneID")
            };

            $scope.model = {
                "name": $("#ipRangeWin").widget().option("name"),
                "description": $("#ipRangeWin").widget().option("description")
            };
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return false;
                }
                return validator.ipValidator(ip);
            };

            $scope.startIp = {
                "label": $scope.i18n.common_term_initiativeIP_label + ":",
                "id": "startIp",
                "type": "ipv4",
                "value": "",
                "disable": false,
                "extendFunction": ["ipCheck"],
                "validate": "ipCheck(startIp):" + $scope.i18n.common_term_formatIP_valid
            };
            $scope.endIp = {
                "label": $scope.i18n.common_term_endIP_label + ":",
                "id": "endIp",
                "type": "ipv4",
                "value": "",
                "disable": false,
                "extendFunction": ["ipCheck"],
                "validate": "ipCheck(endIp):" + $scope.i18n.common_term_formatIP_valid
            }

            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var valid = UnifyValid.FormValid($("#ipRangeDiv"));
                    if (!valid) {
                        return;
                    }
                    var startIP = $("#" + $scope.startIp.id).widget().getValue();
                    var endIP = $("#" + $scope.endIp.id).widget().getValue();
                    var IPRange =
                    {
                        "startIp": startIP,
                        "endIp": endIP
                    };

                    $scope.model.addPublicIPRange = IPRange;
                    $scope.operate.modifyPublicIp($scope.model);
                }
            };

            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#ipRangeWin").widget().destroy();
                }
            };

            /**
             * 操作
             */
            $scope.operate = {
                modifyPublicIp: function (params) {
                    var createConfig = constants.rest.PUBLIC_IP_UPDATE;
                    var deferred = camel.put({
                        url: {s: createConfig.url, o: {"id": publicIpPoolId}},
                        type: createConfig.type,
                        params: JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.operate.query();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "query": function () {
                    var queryConfig = constants.rest.PUBLIC_IP_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url + "/{id}", o: {"zoneid": $scope.zoneInfo.zoneID, "id": publicIpPoolId}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    })
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            newData.data = response;
                            $("#ipRangeWin").widget().destroy();
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }]

        var deps = ['ng', 'wcc'];
        var ipRangeApp = angular.module("ipRangeApp", deps);
        ipRangeApp.controller("ipRangeCtrl", ipRangeCtrl);
        ipRangeApp.service("camel", httpService);
        ipRangeApp.service("validator", validatorService);
        return ipRangeApp;
    }
)
;



