define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ssp-exception"],
    function ($, angular, httpService, UnifyValid, constants, exceptionService, ameException) {
        "use strict";

        var flavorDetailCtrl = ["$scope", "camel", function ($scope, camel) {

            $scope.type = {
                label: $scope.i18n.common_term_startupSource_label+":",
                require: false,
                "id": "showStartType",
                "width": "200",
                "value":"-"
            };
            $scope.slaInfo = {
                label: $scope.i18n.vm_term_SLAdetail_label +":",
                require: false,
                "id": "showSlaInfo",
                "data": []
            };

            $scope.startMode = {
                "LocalDisk":$scope.i18n.template_term_startFromImage_label || "从镜像启动",
                "Volume":$scope.i18n.template_term_startFromCloudHarddisk_label || "从云硬盘启动(创建一个新的云硬盘)"
            };

            $scope.operator = {
                "query": function (id) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.START_SOURCE_QUERY_ALL.url, "o": {"service_id": $scope.serviceID, "tenant_id": $scope.projectId, "id":id}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data["extra_specs"] === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            var startModel = $scope.startMode[data["extra_specs"]["huawei:extBootType"]];
                            if (startModel) {
                                $scope.type.value = startModel;
                            } else {
                                $scope.type.value = $scope.startMode["LocalDisk"];
                            }

                            var key = "huawei:extBootType";
                            var extra = data["extra_specs"];
                            for (var index in extra) {
                                if (index != key) {
                                    $scope.slaInfo.data.push({"key":index, "value":extra[index]});
                                }
                            }
                        });
                    });
                },
                "action":function (type, id) {
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

                        if (type == "query") {
                            $scope.operator.query(id);
                        } else {
                            // do nothing
                        }
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data, ameException);
                    });
                }
            };

            $scope.queryDetail = function (data) {
                $scope.operator.action("query", data.id);
            };
        }];

        var dependency = [];

        var flavorDetailModule = angular.module("template.flavor.detail", []);

        flavorDetailModule.controller("template.flavor.detail.ctrl", flavorDetailCtrl);
        flavorDetailModule.service("camel", httpService);

        return flavorDetailModule;
    });

