/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-widgets/Window",
    "tiny-widgets/RadioGroup",
    "tiny-directives/IP",
    "app/services/exceptionService"],
    function ($, angular, http, Window, RadioGroup, IP, Exception) {
        "use strict";
        var amendStorageCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var datastoreId = $("#amendWinId").widget().option("datastoreId");
            var maintenanceMode = $("#amendWinId").widget().option("maintenanceMode");
            var mediaType = $("#amendWinId").widget().option("mediaType");

            var storageMediaValue = [
                {
                    "selectId": "SAN-Any",
                    "label": "Any",
                    "checked": mediaType === "SAN-Any"
                },
                {
                    "selectId": "SAN-SSD",
                    "label": "SAN-SSD",
                    "checked": mediaType === "SAN-SSD"
                },
                {
                    "selectId": "SAN-SAS&FC",
                    "label": "SAN-SAS&FC",
                    "checked": mediaType === "SAN-SAS&FC"
                },
                {
                    "selectId": "SAN-SATA",
                    "label": "SAN-SATA",
                    "checked": mediaType === "SAN-SATA"
                }
            ];

            $scope.storageMedia = {
                "id": "storageMediaId",
                "width": "200",
                "label": $scope.i18n.common_term_storageMedia_label+":",
                "require": true,
                "values": storageMediaValue
            };
            $scope.confirmBtn = {
                "id": "confirmBtnId",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var media = $("#" + $scope.storageMedia.id).widget().getSelectedId();

                    var defered = camel.put({
                        "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/datastores", o: {"tenant_id": "1"}},
                        "params": JSON.stringify({
                            "datastoreInfos": [
                                {
                                    "id": datastoreId,
                                    "mediaType": media
                                }
                            ]
                        }),
                        "userId": user.id
                    });
                    defered.success(function (response) {
                        $scope.$apply(function () {

                            $("#amendWinId").widget().destroy();
                        });
                    });
                    defered.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "cancelBtnId",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#amendWinId").widget().destroy();
                }
            };
        }];

        var dependency = ['ng', 'wcc'];
        var amendStorageModule = angular.module("amendStorageModule", dependency);
        amendStorageModule.controller("amendStorageCtrl", amendStorageCtrl);
        amendStorageModule.service("camel", http);
        return amendStorageModule;
    })
;