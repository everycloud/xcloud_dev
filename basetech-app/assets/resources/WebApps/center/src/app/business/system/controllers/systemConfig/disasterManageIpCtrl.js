/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"
], function ($, angular, Window, Message, Exception) {
    "use strict";

    var disasterIpCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.isIe = !!window.ActiveXObject;
        $scope.operable = user.privilege.role_role_add_option_disasterCfgHandle_value;

        $scope.ipItem = {
            "label": $scope.i18n.common_term_IP_label + ":",
            "value": "",
            "id": "disasterManageIpItem",
            "modifying": false,
            "clickModify": function () {
                $scope.ipItem.modifying = true;
                $("#" + $scope.ipItem.id).widget().option("value", $scope.ipItem.value);
            },
            "saveModify": function () {
                saveIp();
            },
            "cancelModify": function () {
                $scope.ipItem.modifying = false;
            }
        };

        $scope.gotoUltravr = function () {
            var t = window.open("", "ultravr");
            t.parent = null;
            t.opener = null;
            t.location = "https://" + $scope.ipItem.value + ":9443/login.do";
        };
        function getData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/disasterconfigs?param=UltraVRIP"},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.$apply(function () {
                    $scope.ipItem.value = data.disasterInfo.UltraVRIP;
                    $scope.href = "https://" + data.disasterInfo.UltraVRIP + ":9443/login.do";
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function saveIp() {
            var params = {
                disasterInfo: {
                    UltraVRIP: $("#" + $scope.ipItem.id).widget().getValue()
                }
            };
            var deferred = camel.post({
                url: {s: " /goku/rest/v1.5/irm/1/disasterconfigs"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.$apply(function () {
                    $scope.ipItem.value = $("#" + $scope.ipItem.id).widget().getValue();
                    $scope.href = "https://" + $scope.ipItem.value + ":9443/login.do";
                    $scope.ipItem.modifying = false;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getData();
    }];

    return disasterIpCtrl;
});