/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "app/framework/directive/directiveFM",
    "bootstrapui/ui-bootstrap-tpls",
    "app/services/httpService",
    "app/services/validatorService",
    'tiny-common/UnifyValid',
    "app/services/exceptionService"],
    function ($, angular,fm,uibootstrap, httpService,validatorService,unifyValid, Exception) {
        "use strict";
        var createZoneCtrl = ["$scope", "camel", "validator","$sce",function ($scope, camel,validator,$sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.resource_zone_add_para_physiNetMode_mean_tip = $sce.trustAsHtml($scope.i18n.resource_zone_add_para_physiNetMode_mean_tip);
            var window = $("#createZoneWindow").widget();
            var action = window.option("action");
            var zoneId = window.option("zoneId");

            $scope.nameTextbox = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "zoneName",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid,
                "width": "200"
            };
            $scope.regionTextbox = {
                label: $scope.i18n.common_term_location_label+":",
                require: false,
                "id": "zoneLocation",
                "width": "200",
                "validate": "maxSize(256):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"256"})
            };
            //物理组网模式下拉框
            $scope.modelSelector = {
                "label": $scope.i18n.resource_term_physiNetMode_label+":",
                "require": true,
                "id": "networkModel",
                "width": "200",
                "values": [
                    {
                        "selectId": "FIREWALL_ONLY",
                        "label": $scope.i18n.resource_zone_add_para_type_option_gateOnFw_value,
                        "checked": true
                    },
                    {
                        "selectId": "SWITCH_WITH_FIREWALL",
                        "label": $scope.i18n.resource_zone_add_para_type_option_handleFw_value
                    },
                    {
                        "selectId": "EMTPY",
                        "label": $scope.i18n.resource_zone_add_para_type_option_noGate_value
                    }
                ]
            };

            $scope.descTextbox = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "zoneDescription",
                "value": "",
                "height": "50",
                "width": "200",
                "type": "multi",
                "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"})
            };

            $scope.createBtn = {
                "label": "",
                "id": "createZoneSave",
                "text": $scope.i18n.common_term_create_button,
                "tooltip": "",
                "click": function () {
                    var valid = unifyValid.FormValid($("#resources_rpool_createZone"));
                    if (!valid) {
                        return;
                    }
                    var model = {
                        "name": $("#" + $scope.nameTextbox.id).widget().getValue(),
                        "region": $("#" + $scope.regionTextbox.id).widget().getValue(),
                        "networkMode": $("#" + $scope.modelSelector.id).widget().getSelectedId(),
                        "description": $("#" + $scope.descTextbox.id).widget().getValue()
                    };
                    if (action === "edit") {
                        editZone(model);
                    }
                    else {
                        createZone(model);
                    }
                }
            };

            $scope.cancelBtn = {
                "id": "createZoneCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    window.destroy();
                }
            };

            $scope.resizeWindow = function (status) {
                var sizes = {
                    "en":{
                        "down":"400px",
                        "up":"220px"
                    },
                    "zh":{
                        "down":"320px",
                        "up":"220px"
                    }
                };
                $("#createZoneWindow").find(".ui-dialog-content").css("height",sizes[$scope.i18n.locale][status]);
            };
            function getZone(zoneId) {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/zones/{id}", o: {id: zoneId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        var zone = data.zone;
                        $("#" + $scope.nameTextbox.id).widget().option("value", zone.name);
                        $("#" + $scope.regionTextbox.id).widget().option("value", zone.region);
                        $("#" + $scope.modelSelector.id).widget().opChecked(zone.networkMode);
                        $("#" + $scope.descTextbox.id).widget().option("value", zone.description);
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function createZone(zoneInfo) {
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/zones"},
                    "params": JSON.stringify({
                        "zone": zoneInfo
                    }),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function editZone(zoneInfo) {
                var deferred = camel.put({
                    url: {s: " /goku/rest/v1.5/irm/1/zones/{id}", o: {id: zoneId}},
                    "params": JSON.stringify(zoneInfo),
                    "userId": user.id
                });
                deferred.success(function (xml) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if (action === "edit") {
                $scope.createBtn.text = $scope.i18n.common_term_modify_button;
                getZone(zoneId);
            }
        }];

        var createZoneApp = angular.module("resources.rpool.zone.create", ["ui.bootstrap",fm.name]);
        createZoneApp.service("camel", httpService);
        createZoneApp.service("validator", validatorService);
        createZoneApp.controller("resources.rpool.zone.createCtrl", createZoneCtrl);
        return createZoneApp;
    });