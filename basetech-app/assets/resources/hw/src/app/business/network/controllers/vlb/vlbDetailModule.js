/* global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    'app/services/exceptionService',
    "./topo/vlbTopo",
    "app/business/network/services/vlb/vlbService",
    "language/keyID",
    'app/services/commonService',
    "fixtures/network/vlb/vlbFixture"
],
    function (angular, $, _, Window, Message, http, exception, topo, vlbService, i18n, commonService) {
        "use strict";

        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                var user = $("html").scope().user || {};
                var isIT = user.cloudType === "IT";
                var serviceInstance = new vlbService(exception, $q, camel);
                $scope.isIT = isIT;
                $scope.isHTTP = false; //ICT场景下，判断健康检查状态是否是http
                //查询路由器
                $scope.queryVLBDetail = function () {
                    var promise = serviceInstance.queryVLB({
                        "cloudInfraId": $scope.cloudInfraId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "lbID": $scope.lbID
                    });
                    promise.then(function (resolvedValue) {
                        if (isIT) {
                            //请求成功
                            //$scope.vlbDetail = resolvedValue;
                            var extNetPromise = serviceInstance.queryNetByNetId({
                                "cloudInfraId": $scope.cloudInfraId,
                                "vdcId": user.vdcId,
                                "userId": user.id,
                                "id": resolvedValue.slbVmInfo.extNetworkID,
                                "vpcId": resolvedValue.slbVmInfo.vpcID
                            });
                            extNetPromise.then(function (extNetwork) {
                                if (extNetwork) {
                                    _.extend(resolvedValue, {
                                        "extNetworkName": extNetwork.name
                                    });
                                }
                            });
                            var intNetPromise = serviceInstance.queryNetByNetId({
                                "cloudInfraId": $scope.cloudInfraId,
                                "vdcId": user.vdcId,
                                "userId": user.id,
                                "id": resolvedValue.slbVmInfo.intNetworkID,
                                "vpcId": resolvedValue.slbVmInfo.vpcID
                            });
                            intNetPromise.then(function (intNetwork) {
                                if (intNetwork) {
                                    _.extend(resolvedValue, {
                                        "intNetworkName": intNetwork.name
                                    });
                                }
                            });
                        }
                        resolvedValue.uiStatus = serviceInstance.transStatusToUiStatus(resolvedValue.status);
                        resolvedValue.createTime = commonService.utc2Local(resolvedValue.createTime);
                        $scope.vlbDetail = resolvedValue;

                    }, function () {
                        $scope.vlbDetail = {};
                    });
                    promise.then(function (resolvedValue) {
                        var vlbTopo = new topo($scope.topoCaversId, resolvedValue, isIT);
                    });
                };
                $scope.topoCaversId = "vlb-topo-cavers";
                $scope.vlbDetail = {};

                $scope.name = {
                    "label": i18n.common_term_name_label + ":"
                };
                $scope.protocol = {
                    "label": i18n.common_term_protocol_label + ":"
                };
                $scope.checkPath = {
                    "label": i18n.common_term_checkPath_label + ":"
                };
                $scope.maxRoundRobin = {
                    "label": i18n.lb_term_poolingTimesMax_label + ":"
                };
                $scope.timeout = {
                    "label": i18n.device_term_timeouts_label + ":"
                };
                $scope.checkInterval = {
                    "label": i18n.common_term_checkCycleS_label + ":"
                };
                $scope.httpCode = {
                    "label": i18n.common_term_HTTPstatusCode_label + ":"
                };
                $scope.elasticIP = {
                    "label": i18n.eip_term_eip_label + ":"
                };
                $scope.createTime = {
                    "label": i18n.common_term_createAt_label + ":"
                };
                $scope.externalIP = {
                    "label": i18n.common_term_externalIP_label + ":"
                };
                $scope.frontNet = {
                    "label": i18n.common_term_FrontNet_label + ":"
                };
                $scope.backNet = {
                    "label": i18n.lb_term_backendNet_label + ":"
                };
                $scope.frontNet = {
                    "label": i18n.common_term_FrontNet_label + ":"
                };
                $scope.status = {
                    "label": i18n.common_term_status_label + ":"
                };
                $scope.frontPort = {
                    "label": i18n.lb_term_frontendPort_label + ":"
                };
                $scope.backendPort = {
                    "label": i18n.lb_term_backendPort_label + ":"
                };
            }
        ];

        var vlbDetail = angular.module("vlbDetail", ["ng", "wcc"]);
        vlbDetail.controller("detailCtrl", ctrl);
        vlbDetail.service("camel", http);
        vlbDetail.service("exception", exception);

        return vlbDetail;
    });
