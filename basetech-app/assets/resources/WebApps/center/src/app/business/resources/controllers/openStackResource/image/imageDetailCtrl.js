define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ssp-exception"],
    function ($, angular, httpService, UnifyValid, constants, exceptionService, ameException) {
        "use strict";

        var imageDetailCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: false,
                "value":""
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: false,
                "value": ""
            };

            // hw-disk-bus
            $scope.diskBus = {
                label: $scope.i18n.resource_term_imageDiskDeviceType_button+":",
                require: false,
                "value":""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "value": ""
            };

            $scope.diskBusInfo = {
                "empty":$scope.i18n.common_term_notSet_value || "不设置",
                "scsi":"scsi",
                "virtio":"virtio",
                "uml":"uml",
                "xen":"xen",
                "ide":"ide",
                "usb":"usb"
            };


            $scope.operator = {
                "queryDetail":function (id, serviceId) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.IMAGE_DETAIL.url, "o": {"service_id": serviceId, "id": id}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-Auth-Token", $scope.token);
                        }
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            var diskInfo = (!data["hw_disk_bus"] || data["hw_disk_bus"] == "") ? "empty":data["hw_disk_bus"];
                            $scope.description.value = data.describe;
                            $scope.diskBus.value = $scope.diskBusInfo[diskInfo];
                            $scope.osType.value = data["os_type"];
                            $scope.version.value = data["os_version"];
                        });
                    });
                },
                "action":function (type, id, serviceId) {
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

                        if (type == "queryDetail") {
                            $scope.operator.queryDetail(id, serviceId);
                        } else {
                            // do nothing
                        }
                    });
                }
            };
        }];

        // 创建App
        var deps = [];
        var imageDetailApp = angular.module("resources.openStackResource.imageDetail", deps);
        imageDetailApp.controller("resources.openStackResource.imageDetail.ctrl", imageDetailCtrl);
        imageDetailApp.service("camel", httpService);

        return imageDetailApp;
    });

