/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-4-16

 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'app/services/validatorService'],
    function ($, angular, Window, UnifyValid, httpService, constants, ExceptionService, validatorService) {
        "use strict";
        var modifyPublicIpCtrl = ["$scope", 'camel', 'validator', function ($scope, camel, validator) {
            $scope.i18n = $("html").scope().i18n;
            var $rootScope = $("html").injector().get("$rootScope");
            var data = $("#modifyPublicIpWin").widget().option("data");
            var publicIpPoolId = $("#modifyPublicIpWin").widget().option("publicIpPoolId");
            $scope.ipRangeListSize = 0;
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneID": $("#modifyPublicIpWin").widget().option("zoneID"),
                "zoneName": $("#modifyPublicIpWin").widget().option("zoneName")
            };
            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":",
                require: true,
                "id": "modifyPublicIpName",
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
                "id": "modifyDvsDescription",
                "value": "",
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tipPosition": "right"
            };

            $scope.ipSegment = {
                "label": $scope.i18n.common_term_IPsegment_label + ":",
                "require": "true",
                "width": "215px",
                "disable": "false"
            };

            $scope.addBtn = {
                "id": "addPublicIpBtn",
                "text": $scope.i18n.common_term_add_button,
                "disable": $scope.ipRangeListSize >= 1024,
                "click": function () {
                    var valid = UnifyValid.FormValid($("#modifyPublicIpDiv"));
                    if (!valid) {
                        return;
                    }
                    var name = $("#" + $scope.name.id).widget().getValue();
                    var description = $("#" + $scope.description.id).widget().getValue();
                    var newData = {};
                    var options = {
                        "winId": "ipRangeWin",
                        "zoneName": $scope.zoneInfo.zoneName,
                        "zoneID": $scope.zoneInfo.zoneID,
                        "publicIpPoolId": publicIpPoolId,
                        "newData": newData,
                        "name": name,
                        "description": description,
                        "title": $scope.i18n.common_term_add_button,
                        "content-type": "url",
                        "content": "./app/business/resources/views/rpool/zone/zoneResources/network/publicIP/ipRange.html",
                        "height": 225,
                        "width": 400,
                        "resizable": true,
                        "maximizable": false,
                        "buttons": null,
                        "close": function () {
                            if (newData.data) {
                                data = newData.data;
                            }
                            $scope.operate.setInfo(data);
                        }
                    };
                    new Window(options).show();
                }
            };

            $scope.modifyBtn = {
                "label": "",
                "id": "modifyPublicIpBtn",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#modifyPublicIpDiv"));
                    if (!valid) {
                        return;
                    }
                    var params = {};
                    params.name = $("#" + $scope.name.id).widget().getValue();
                    params.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.operate.modifyPublicIp(params);

                }
            };

            $scope.cancelBtn = {
                "id": "modifyPublicIpCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#modifyPublicIpWin").widget().destroy();
                }
            };

            /**
             * 操作
             */
            $scope.operate = {
                modifyPublicIp: function (params) {
                    var modifyConfig = constants.rest.PUBLIC_IP_UPDATE;
                    var deferred = camel.put({
                        url: {s: modifyConfig.url, o: {"id": publicIpPoolId }},
                        type: modifyConfig.type,
                        params: JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#modifyPublicIpWin").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "deleteIp": function (data) {
                    var valid = UnifyValid.FormValid($("#modifyPublicIpDiv"));
                    if (!valid) {
                        return;
                    }
                    var params = {};
                    params.name = $("#" + $scope.name.id).widget().getValue();
                    params.description = $("#" + $scope.description.id).widget().getValue();
                    params.deletePublicIPRange =
                    {
                        "startIp": data.startIp,
                        "endIp": data.endIp
                    }
                    $scope.operate.modifyPublicIp(params);
                },
                "setInfo": function (data) {
                    $scope.$apply(function () {
                        $scope.name.value = data.name;
                        $scope.description.value = data.description;
                        $scope.ipRangeList = data.ipRangeList;
                        $scope.ipRangeListSize = $scope.ipRangeList.length;
                    })
                },
                "query": function () {
                    var queryConfig = constants.rest.PUBLIC_IP_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url + "/{id}", o: {"zoneid": $scope.zoneInfo.zoneID, "id": publicIpPoolId}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    })
                    deferred.done(function (response) {
                        // 获取数据
                        data = response;
                        $scope.operate.setInfo(data);
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.setInfo(data);
        }]

        var deps = ['ng', 'wcc'];
        var modifyPublicIpApp = angular.module("modifyPublicIpApp", deps);
        modifyPublicIpApp.controller("modifyPublicIpCtrl", modifyPublicIpCtrl);
        modifyPublicIpApp.service("camel", httpService);
        modifyPublicIpApp.service("validator", validatorService);
        return modifyPublicIpApp;
    }
)
;



