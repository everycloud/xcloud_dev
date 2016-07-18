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
    'app/services/validatorService',
    "app/framework/directive/directiveFM"
],
    function ($, angular, UnifyValid, httpService, constants, ExceptionService, validatorService, fm) {
        "use strict";
        var createPublicIpCtrl = ["$scope", 'camel', 'validator', function ($scope, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.i18n = $("html").scope().i18n;
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneID": $("#createPublicIpWin").widget().option("zoneID"),
                "zoneName": $("#createPublicIpWin").widget().option("zoneName")
            };

            $scope.model = {
                "zoneId": "",
                "name": "",
                "description": "",
                "ipRanges": {}
            };
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                if (!ip) {
                    return false;
                }
                return validator.ipValidator(ip);
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":",
                require: true,
                "id": "createPublicIpName",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                    $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "width": "215px",
                "tooltip": $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tipPosition": "right",
                "value": ""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "id": "createDvsDescription",
                "value": "",
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tipPosition": "right"
            };
            $scope.ipInfo = {
                "label": $scope.i18n.common_term_IPsegment_label + ":",
                "width": "215px",
                "require": true,
                "ipRange": [{}]
            }

            $scope.createBtn = {
                "label": "",
                "id": "createPublicIpBtn",
                "text": $scope.i18n.common_term_create_button,
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#createPublicIpDiv"));
                    if (!valid) {
                        return;
                    }
                    $scope.model.zoneId = $("#createPublicIpWin").widget().option("zoneID");
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();
                    var ipRanges = [];
                    for (var i in $scope.ipInfo.ipRange){
                        var ipRange = $scope.ipInfo.ipRange[i];
                        if (ipRange.startIP && ipRange.endIP){
                            ipRanges.push({startIp:ipRange.startIP, endIp:ipRange.endIP});
                        }
                    }
                    $scope.model.ipRanges = ipRanges;
                    $scope.operate.createPublicIp($scope.model);
                }
            };

            $scope.cancelBtn = {
                "id": "createPublicIpCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#createPublicIpWin").widget().destroy();
                }
            };

            /**
             * 操作
             */
            $scope.operate = {
                createPublicIp: function (params) {
                    var createConfig = constants.rest.PUBLIC_IP_CREATE;
                    var deferred = camel.post({
                        url: {s: createConfig.url, o: {"tenant_id": "1"}},
                        type: createConfig.type,
                        params: JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#createPublicIpWin").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }]

        var deps = ['ng', 'wcc', fm.name];
        var createPublicIpApp = angular.module("createPublicIpApp", deps);
        createPublicIpApp.controller("createPublicIpCtrl", createPublicIpCtrl);
        createPublicIpApp.service("camel", httpService);
        createPublicIpApp.service("validator", validatorService);
        return createPublicIpApp;
    }
)
;

