/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "app/framework/directive/directiveFM",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/httpService",
    "app/services/validatorService",
    'tiny-common/UnifyValid',
    "app/services/exceptionService"],
    function ($, angular, fm, uibootstrap, httpService, validatorService, unifyValid, Exception) {
        "use strict";
        var addHostCtrl = ["$scope", "camel", "validator", "$sce", function ($scope, camel, validator, $sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addHostWindow").widget();
            var hostId = window.option("hostId");
            var infraId = window.option("infraId");

            //可用分区
            $scope.azSelector = {
                "label": $scope.i18n.resource_term_AZ_label + ":",
                "require": true,
                "id": "azSelector",
                "width": "200",
                "validate": "required:" + $scope.i18n.common_term_null_valid,
                "values": [
                ]
            };
            $scope.nameTextbox = {
                label: $scope.i18n.common_term_name_label + ":",
                require: true,
                "id": "nameTextbox",
                "validate": "required:" + $scope.i18n.common_term_null_valid +
                    ";maxSize(64):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}) +
                    ";regularCheck(" + validator.serviceName + "):" + $scope.i18n.common_term_composition2_valid,
                "width": "200"
            };
            $scope.modelTextbox = {
                label: $scope.i18n.device_term_model_label + ":",
                require: true,
                "id": "modelTextbox",
                "width": "200",
                "validate": "required:" + $scope.i18n.common_term_null_valid +
                    ";maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "256"})
            };
            //硬件规格
            $scope.hardwareTextbox = {
                "label": $scope.i18n.common_term_specHardware_label + ":",
                "require": false,
                "id": "hardwareTextbox",
                "width": "200",
                "validate": "maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "0", "2": "256"})
            };
            //操作系统
            $scope.osTextbox = {
                "label": $scope.i18n.common_term_OS_label + ":",
                "require": false,
                "id": "osTextbox",
                "width": "200",
                "validate": "maxSize(256):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "0", "2": "256"})
            };
            $scope.ipTextbox = {
                label: "IP:",
                require: false,
                "id": "ipTextbox",
                "width": "200",
                "extendFunction": ["ipValidator"],
                "validate": "ipValidator:" + $scope.i18n.common_term_formatIP_valid
            };
            unifyValid.ipValidator = function () {
                var ip = $("#" + $scope.ipTextbox.id).widget().getValue();
                return ip ? validator.ipFormatCheck(ip) : true;
            };
            $scope.addBtn = {
                "label": "",
                "id": "addHostSave",
                "text": $scope.i18n.common_term_add_button,
                "tooltip": "",
                "click": function () {
                    var valid = unifyValid.FormValid($("#multiPool_poolInfo_addHost"));
                    if (!valid) {
                        return;
                    }
                    var model = {
                        "infraId": infraId,
                        "availableZoneId": $("#" + $scope.azSelector.id).widget().getSelectedId(),
                        "name": $("#" + $scope.nameTextbox.id).widget().getValue(),
                        "model": $("#" + $scope.modelTextbox.id).widget().getValue(),
                        "hardwareSpec": $("#" + $scope.hardwareTextbox.id).widget().getValue(),
                        "osType": $("#" + $scope.osTextbox.id).widget().getValue(),
                        "osIp": $("#" + $scope.ipTextbox.id).widget().getValue()
                    };
                    if (hostId) {
                        editHost(model);
                    }
                    else {
                        addHost(model);
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "addHostCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    window.destroy();
                }
            };

            function getHost() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/1/physical-servers/{id}", o: {id: hostId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $("#" + $scope.azSelector.id).widget().opChecked(data.availableZoneId);
                    $("#" + $scope.nameTextbox.id).widget().option("value", data.name);
                    $("#" + $scope.modelTextbox.id).widget().option("value", data.model);
                    $("#" + $scope.hardwareTextbox.id).widget().option("value", data.hardwareSpec);
                    $("#" + $scope.osTextbox.id).widget().option("value", data.osType);
                    $("#" + $scope.ipTextbox.id).widget().option("value", data.osIp);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function addHost(hostInfo) {
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/1/physical-servers"},
                    "params": JSON.stringify(hostInfo),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function editHost(hostInfo) {
                var deferred = camel.put({
                    url: {s: "/goku/rest/v1.5/1/physical-servers/{id}", o: {id: hostId}},
                    "params": JSON.stringify(hostInfo),
                    "userId": user.id
                });
                deferred.success(function (xml) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getAzs() {
                var params = {
                    cloudInfraId: infraId,
                    start: 0,
                    limit: null,
                    manageStatus: 'occupied'
                };
                var deferred = camel.post({
                    url: "/goku/rest/v1.5/1/available-zones/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    var values = [];
                    for (var index in azs) {
                        var value = {
                            "selectId": azs[index].id,
                            "label": azs[index].name
                        };
                        values.push(value);
                    }
                    if (values.length > 0) {
                        values[0].checked = true;
                        $("#" + $scope.azSelector.id).widget().option("values", values);
                    }
                    if (hostId) {
                        getHost();
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function init() {
                if (hostId) {
                    $scope.addBtn.text = $scope.i18n.common_term_modify_button;
                }
                getAzs();
            }

            init();
        }];

        var addHostApp = angular.module("multiPool.poolInfo.host.add", ["ui.bootstrap", fm.name]);
        addHostApp.service("camel", httpService);
        addHostApp.service("validator", validatorService);
        addHostApp.controller("multiPool.poolInfo.host.addCtrl", addHostCtrl);
        return addHostApp;
    });