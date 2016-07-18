define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    'app/services/exceptionService'],
    function ($, angular, httpService, constants, exceptionService) {
        "use strict";

        var modifyCtrl = ["$scope", "camel", "exception", function ($scope, camel, exception) {
            $scope.i18n = $("html").scope().i18n;
            $scope.model = {
                "deviceName": "",
                "deviceIp": "",
                "peerIp": "-"
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":" || "名称:",
                require: true
            };
            $scope.devIp = {
                label: $scope.i18n.device_term_deviceIP_label || "设备地址:",
                require: true
            };
            $scope.peerIp = {
                label: $scope.i18n.common_term_pairIP_label + ":" || "对端IP地址:",
                require: true
            };

            $scope.saveBtn = {
                id: "modifySaveBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_confirm_label + ":" || "确认",
                tip: "",
                save: function () {
                    $("#showDevInfoWindowID").widget().destroy();
                }
            };

            $scope.cancelBtn = {
                id: "modifyCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $("#showDevInfoWindowID").widget().destroy();
                }
            };

            // 操作定义
            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.LOAD_BALANCER_QUERY.url, "o": {"id": $("#showDevInfoWindowID").widget().option("devID")}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (response) {
                        if (!response) {
                            return;
                        }
                        $scope.$apply(function () {
                            var lb = response.lbList[0];
                            $scope.model.deviceName = lb.deviceName;
                            $scope.model.deviceIp = lb.deviceIp;
                            $scope.model.peerIp = lb.peerIp || "-";
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            // 初始化操作
            $scope.init = function () {
                $scope.operator.query();
            };

            $scope.init();
        }];

// 创建App
        var deps = [];
        var modifyVmtApp = angular.module("resources.rpool.network.vlbPool", deps);
        modifyVmtApp.controller("resources.rpool.network.vlbPool.ctrl", modifyCtrl);
        modifyVmtApp.service("camel", httpService);
        modifyVmtApp.service("exception", exceptionService);

        return modifyVmtApp;
    });