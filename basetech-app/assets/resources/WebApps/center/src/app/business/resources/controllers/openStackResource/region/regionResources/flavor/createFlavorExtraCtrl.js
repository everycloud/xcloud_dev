define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ssp-exception",
    "bootstrapui/ui-bootstrap-tpls"],
    function ($, angular, httpService, UnifyValid, constants, exceptionService, ameException, ui) {
        "use strict";

        var flavorExtraCtrl = ["$scope", "camel", function ($scope, camel) {

            $scope.i18n = $("html").scope().i18n;

            $scope.type = {
                label: $scope.i18n.common_term_startupSource_label+":",
                require: false,
                "id": "createStartType",
                "width": "200",
                "values": [
                    {
                        "selectId": "LocalDisk",
                        "label": $scope.i18n.template_term_startFromImage_label || "从镜像启动",
                        "checked": true
                    },
                    {
                        "selectId": "Volume",
                        "label": $scope.i18n.template_term_startFromCloudHarddisk_label || "从云硬盘启动(创建一个新的云硬盘)"
                    }
                ],
                "change": function () {
                }
            };

            $scope.saveBtn = {
                "label": "",
                "require":false,
                "id": "createFlavorExtraSave",
                "text": $scope.i18n.common_term_ok_button || "确定",
                "tooltip": "",
                "click": function () {
                    $scope.operator.action("create");
                }
            };

            $scope.cancelBtn = {
                "id": "createFlavorExtraCancel",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "tooltip": "",
                "click": function () {
                    $("#createFlavorExtraWinID").widget().destroy();
                }
            };

            $scope.resizeWindow = function (type) {
                var sizes = {
                    "en":{
                        "up":"500px",
                        "down":"124px"
                    },
                    "zh":{
                        "up":"300px",
                        "down":"124px"
                    }
                };
                $("#createFlavorExtraWinID").find(".ui-dialog-content").css("height",sizes[$scope.i18n.locale][type]);
            };

            $scope.operator = {
                "create": function () {

                    var deferred = camel.post({
                        "url": {"s": constants.rest.START_SOURCE_CREATE.url, "o": {"service_id": $("#createFlavorExtraWinID").widget().option("serviceID"),"id": $("#createFlavorExtraWinID").widget().option("flavorID"), "tenant_id": $scope.projectId}},
                        "params":JSON.stringify({
                            "extra_specs": {
                                "huawei:extBootType": $("#"+$scope.type.id).widget().getSelectedId()
                            }
                        }),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        $("#createFlavorExtraWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                },
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.START_SOURCE_QUERY.url, "o": {"service_id": $("#createFlavorExtraWinID").widget().option("serviceID"), "tenant_id": $scope.projectId, "id":$("#createFlavorExtraWinID").widget().option("flavorID"), "key":"huawei:extBootType"}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data["huawei:extBootType"] === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            var startModel = data["huawei:extBootType"];
                            if (startModel) {
                                $("#"+$scope.type.id).widget().opChecked(startModel);
                            }
                        });
                    });
                },
                "action":function (type) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.TOKEN_QUERY.url},
                        "params": {"user-id": $("html").scope().user && $("html").scope().user.id},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }

                        $scope.token = data.id;

                        $scope.projectId = data.projectId;

                        if (type == "create") {
                            $scope.operator.create();
                        } else if(type == "query") {
                            $scope.operator.query();
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                }
            };

            $scope.init = function () {
                $scope.operator.action("query");
            };

            $scope.init();
        }];

        var dependency = ["ui.bootstrap"];

        var flavorDetailModule = angular.module("template.flavor.extra", dependency);

        flavorDetailModule.controller("template.flavor.extra.ctrl", flavorExtraCtrl);
        flavorDetailModule.service("camel", httpService);

        return flavorDetailModule;
    });

