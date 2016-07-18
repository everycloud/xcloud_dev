/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/httpService"], function ($, angular, Message, Exception, httpService) {
    "use strict";
    var vsamDetailCtrl = ["$scope", "camel", "$state", function ($scope, camel, $state) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        var i18n = $scope.i18n = $("html").scope().i18n;
        var $state = $("html").injector().get("$state");
        var window = $("#vsamDetailWindow").widget();
        $scope.vsamInfo = window.option("vsamInfo");
        var connectStatus = {
            "connected": $scope.i18n.common_term_natural_value,
            "disconnected": $scope.i18n.common_term_abnormal_value,
            "connecting": $scope.i18n.common_term_linking_value,
            "connected_failed": $scope.i18n.common_term_linkFail_value
        };
        var instanceStatus = {
            "fault": i18n.common_term_trouble_label || "故障",
            "normal": i18n.common_term_natural_value || "正常",
            "connected_failed": i18n.common_term_linkAbnormal_value || "连接异常"
        };
        $scope.vsamInfo.connector.statusStr = connectStatus[$scope.vsamInfo.connector.status];
        $scope.vsamInfo.statusText = instanceStatus[$scope.vsamInfo.status];
        $scope.label = {
            "name": $scope.i18n.common_term_name_label + ":",
            "version": $scope.i18n.common_term_version_label + ":",
            "protocol": $scope.i18n.device_term_connectProtocol_label + ":",
            "ip": "IP:",
            "floatIp": (i18n.common_term_floatIP_label || "浮动IP") + ":",
            "activeIp": (i18n.common_term_masterIP_label || "主用IP") + ":",
            "standbyIp": (i18n.common_term_standbyIP_label || "备用IP") + ":",
            "netmask": (i18n.common_term_SubnetMask_label || "子网掩码") + ":",
            "gateway": (i18n.common_term_gateway_label || "网关") + ":",
            "port": $scope.i18n.common_term_port_label + ":",
            "username": $scope.i18n.common_term_userName_label + ":",
            "provider": $scope.i18n.common_term_provider_label + ":",
            "status": $scope.i18n.common_term_status_label + ":",
            "recoverVSAM": $scope.i18n.virtual_term_recoverVSAM_button,
            "func": function(){
                deleteMessage($scope.vsamInfo.id);
            }
        };
        function deleteMessage(vsaId) {
            var options = {
                type: "warn",
                content: $scope.i18n.virtual_hyper_recoverVSAM_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            resume(vsaId);
                            msg.destroy();
                        }
                    },
                    {
                        label:$scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }
        function resume(vsaId) {
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/vsam/{id}", o: {id: vsaId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                ;
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
    }];
    var vsamDetailModule = angular.module("resources.hypervisor.vsamDetail", ['framework']);
    vsamDetailModule.service("camel", httpService);
    vsamDetailModule.controller("resources.hypervisor.vsamDetail.ctrl", vsamDetailCtrl);
    return vsamDetailModule;
});