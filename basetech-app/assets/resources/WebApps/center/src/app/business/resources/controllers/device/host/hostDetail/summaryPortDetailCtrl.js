define([
    'jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/services/commonService",
    "app/services/exceptionService",
    "app/business/resources/services/hardwareService"
],
    function ($, angular, http,commonService, ExceptionService, HardwareService) {
        "use strict";
        var labelDetailCtrl = ['$scope', 'camel', function ($scope, camel) {
			var i18n = $("html").scope().i18n;
            var user = $("html").scope().user;
			var entryPers = "(" + i18n.common_term_entryPerS_label + ")";//(个/秒)
            $scope.portDetail = {
                "name": {
                    "label": i18n.common_term_name_label || "名称"
                },
                "duplexMode": {
                    "label": i18n.common_term_duplexMode_label || "双工模式"
                },
                "status": {
                    "label": i18n.common_term_status_label || "状态"
                },
                "spec": {
                    "label": i18n.common_term_speedRate_label+"(Gbps)" || "速率(Gbps)"
                },
                "pkg_send": {
                    "label": i18n.common_term_sendPacketSpeed_label + entryPers  || "发送包速(个/秒)"
                },
                "pkg_rcv": {
                    "label": i18n.common_term_receivePacketSpeed_label + entryPers || "接收包速(个/秒)"
                },
                "byte_in": {
                    "label": i18n.common_term_netInRate_label+"(KB/s)" || "流入流速(KB/s)"
                },
                "byte_out": {
                    "label": i18n.common_term_netOutRate_label+"(KB/s)" || "流出流速(KB/s)"
                },
                "rxDropPkt": {
                    "label": i18n.common_term_receiveLosePacketRate_label+entryPers || "接收丢包率(个/秒)"
                },
                "txDropPkt": {
                    "label": i18n.common_term_sendLosePacketRate_label+entryPers || "发送丢包率(个/秒)"
                }
            };

            $scope.getPortInfo = function (hostId, hostName) {
                var hardwareKey = ["host.eth.info", "host.eth.performance"];
                HardwareService.getHostHardwareInfos(hostId, hardwareKey, user, function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            var tagArrs = HardwareService.getNetPortInfos(result.data);
                            for (var item in tagArrs) {
                                if (tagArrs[item].name == hostName) {
                                    $scope.portDetail.name.value = tagArrs[item].name;
                                    $scope.portDetail.duplexMode.value = tagArrs[item].duplexMode;
                                    $scope.portDetail.status.value = (tagArrs[item].status == '0') ? i18n.common_term_linked_value : i18n.common_term_noLink_value;
                                    var spec = (tagArrs[item].spec == 0) ? '-' : tagArrs[item].spec;
                                    $scope.portDetail.spec.value = spec;
                                    $scope.portDetail.pkg_send.value = commonService.precision2(tagArrs[item].pkg_send);
                                    $scope.portDetail.pkg_rcv.value = commonService.precision2(tagArrs[item].pkg_rcv);
                                    $scope.portDetail.byte_in.value = commonService.precision2(tagArrs[item].byte_in);
                                    $scope.portDetail.byte_out.value = commonService.precision2(tagArrs[item].byte_out);
                                    $scope.portDetail.rxDropPkt.value = commonService.precision2(tagArrs[item].rxDropPkt);
                                    $scope.portDetail.txDropPkt.value = commonService.precision2(tagArrs[item].txDropPkt);
                                    break;
                                }
                            }

                        });
                    }
                });
            };
        }];
        var dependency = ['ng', 'wcc'];
        var addLabelModule = angular.module("resource.host.summary.port", dependency);
        addLabelModule.controller("resource.host.summary.port.ctrl", labelDetailCtrl);
        addLabelModule.service("camel", http);
        return addLabelModule;
    })
