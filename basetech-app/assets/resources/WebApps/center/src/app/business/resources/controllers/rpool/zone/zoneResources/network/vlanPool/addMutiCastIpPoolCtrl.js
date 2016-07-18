/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-5-15

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
        var addMultiCastIpPoolCtrl = ["$scope", 'camel', 'validator', function ($scope, camel, validator) {
            var $rootScope = $("html").injector().get("$rootScope");
            var data = $("#mutiCastIpPoolWinID").widget().option("data");
            $scope.i18n = $("html").scope().i18n;
            UnifyValid.ipCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                return validator.ipValidator(ip);
            };
            UnifyValid.ipRangeCheck = function (id) {
                var ip = $("#" + id).widget().getValue();
                var startIp1 = "224.0.1.0";
                var endIp1 = "231.255.255.255";
                var startIp2 = "233.0.0.0";
                var endIp2 = "239.255.255.255";
                return validator.ipRangeCheck(startIp1, endIp1, ip) || validator.ipRangeCheck(startIp2, endIp2, ip);
            };
            UnifyValid.endIpCheck = function () {
                var startIp = $("#" + $scope.startIp.id).widget().getValue();
                var endIp = $("#" + $scope.endIp.id).widget().getValue();
                var startIp1 = "224.0.1.0";
                var endIp1 = "231.255.255.255";
                var startIp2 = "233.0.0.0";
                var endIp2 = "239.255.255.255";
                if (validator.ipRangeCheck(startIp1, endIp1, startIp)) {
                    return validator.ipRangeCheck(startIp1, endIp1, endIp)
                }
                if (validator.ipRangeCheck(startIp2, endIp2, startIp)) {
                    return validator.ipRangeCheck(startIp2, endIp2, endIp)
                }
                return  false;
            };
            UnifyValid.endIp = function () {
                var startIp = $("#" + $scope.startIp.id).widget().getValue();
                var endIp = $("#" + $scope.endIp.id).widget().getValue();
                if (startIp && endIp) {
                    return validator.ipCompare(startIp, endIp);
                }
                else {
                    return true;
                }

            };
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneID": $("#mutiCastIpPoolWinID").widget().option("zoneID"),
                "zoneName": $("#mutiCastIpPoolWinID").widget().option("zoneName")
            };
            $scope.model = {
                "name": "",
                "startIP": "",
                "endIP": "",
                "zoneID": $("#mutiCastIpPoolWinID").widget().option("zoneID"),
                "description": ""
            };
            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":",
                require: true,
                "id": "name",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                    $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "width": "215",
                "tooltip": $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tipPosition": "right",
                "value": ""
            };
            $scope.startIp = {
                "label": $scope.i18n.common_term_initiativeIP_label + ":",
                "require": true,
                "disable": false,
                "id": "startIp",
                "extendFunction": ["ipCheck", "ipRangeCheck"],
                "validate": "required:必填项;ipCheck(startIp):IP不合法;ipRangeCheck(startIp):IP不在合法范围内",
                "width": "215",
                "value": ""
            };

            $scope.endIp = {
                "label": $scope.i18n.common_term_endIP_label + ":",
                "require": true,
                "disable": false,
                "id": "endIp",
                "extendFunction": ["ipCheck", "endIpCheck", "endIp"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(endIp):" + $scope.i18n.common_term_formatIP_valid +
                    ";endIpCheck:" + $scope.i18n.common_term_formatIP_valid + ";endIp:" + $scope.i18n.common_term_greaterOriginIP_valid,
                "width": "215",
                "value": ""
            };
            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "id": "description",
                "value": "",
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tipPosition": "right"
            };

            $scope.createBtn = {
                "label": "",
                "id": "addMultiCastIpPoolBtn",
                "text": $scope.i18n.common_term_add_button,
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#addMutiCastIpPoolDiv"));
                    if (!valid) {
                        return;
                    }
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.startIP = $("#" + $scope.startIp.id).widget().getValue();
                    $scope.model.endIP = $("#" + $scope.endIp.id).widget().getValue();
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();
                    if (data) {
                        $scope.operate.update();
                    }
                    else {
                        $scope.operate.create();
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "addMultiCastIpPoolCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#mutiCastIpPoolWinID").widget().destroy();
                }
            };

            /**
             * 创建VLAN池
             */
            $scope.operate = {
                "init": function () {
                    if (data) {
                        $scope.name.value = data.name;
                        $scope.startIp.value = data.startIP;
                        $scope.endIp.value = data.endIP;
                        $scope.description.value = data.description;
                        $scope.createBtn.text = $scope.i18n.common_term_modify_button;
                        if (data.totalUsedIPs > 0) {
                            $scope.startIp.disable = true;
                            $scope.endIp.disable = true;
                        }
                    }
                },
                "create": function () {
                    var createConfig = constants.rest.MULTICAST_IPPOOLS_CREATE;
                    var deferred = camel.post({
                        url: createConfig.url,
                        type: createConfig.type,
                        params: JSON.stringify($scope.model),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#mutiCastIpPoolWinID").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                update: function () {
                    var updateConfig = constants.rest.MULTICAST_IPPOOLS_UPDATE;
                    var modifyPara = {};
                    modifyPara.name = $scope.model.name;
                    modifyPara.startIP = $scope.model.startIP;
                    modifyPara.endIP = $scope.model.endIP;
                    modifyPara.description = $scope.model.description;
                    var deferred = camel.put({
                        "url": {s: updateConfig.url, o: {"id": data.multicastIPPoolID}},
                        "params": JSON.stringify(modifyPara),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#mutiCastIpPoolWinID").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };
            $scope.operate.init();
        }];

        // 创建App
        var deps = [];
        var addMultiCastIpPoolApp = angular.module("resources.zoneResources.addMultiCastIpPool", deps);
        addMultiCastIpPoolApp.controller("resources.zoneResources.addMultiCastIpPoolCtrl", addMultiCastIpPoolCtrl);
        addMultiCastIpPoolApp.service("camel", httpService);
        addMultiCastIpPoolApp.service("validator", validatorService);
        return addMultiCastIpPoolApp;
    });

