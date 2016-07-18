define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "tiny-widgets/Window",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/network/services/eip/eipService",
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, Window, http, exceptionService, eipService) {
        "use strict";
        var elasticIPDetailCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                //当前用户信息
                var user = $("html").scope().user;
                $scope.isServiceCenter = $("html").scope().deployMode === "serviceCenter";
                $scope.isICT = user.cloudType === "ICT" ? true : false;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var $state = $("html").injector().get("$state");

                //共享vpc不显示acl规则数
                var networkCommon = $("html").injector().get("networkCommon");
                $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;

                var i18n = $scope.i18n;
                $scope.maxRxBandwidth = {
                    "label": i18n.perform_term_receiveBandMaxMbps_label+":",
                    "value": ""
                };
                $scope.maxTxBandwidth = {
                    "label": i18n.perform_term_sendBandMaxMbps_label+":",
                    "value": ""
                };
                $scope.totalAclRule = {
                    "label": i18n.common_term_InterDomainACL_label+":",
                    "value": ""
                };
                $scope.applyTime = {
                    "label": i18n.common_term_applyTime_label+":",
                    "value": ""
                };
                $scope.serviceInstanceName = {
                    "id": "serviceInstanceName",
                    "label": (i18n.service_term_serviceInstance_label || "服务实例：") + ":",
                    "value": ""
                };

                // 权限控制
                var SERVER_OPERATE = "320005";
                var hasApprovalOrderRight = _.contains(user.privilegeList, SERVER_OPERATE);
                var urlInstance = "ssp.instance.myInstance";
                if(hasApprovalOrderRight){
                    urlInstance = "ssp.instance.allInstance";
                }

                $scope.jumpServiceInstancePage = function(){
                    $state.go(urlInstance, {
                        "instanceId": $scope.instanceId
                    });
                };
                $scope.bandObject = {
                    "label": i18n.vpc_term_bondObj_label+":",
                    "value": ""
                };
                //查询弹性IP详情
                $scope.queryElasticIPDetail = function (elasticIPId, vpcid, cloudInfrasId) {
                    var options = {
                        "cloudInfraId": cloudInfrasId,
                        "vpcId": vpcid,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "id": elasticIPId
                    };
                    var deferred = eipServiceIns.queryElasticIPDetail(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.maxRxBandwidth.value = data.maxRxBandwidth;
                        $scope.maxTxBandwidth.value = data.maxTxBandwidth;
                        $scope.totalAclRule.value = data.totalAclRule;
                        $scope.applyTime.value = data.applyTime;
                        $scope.bandObject.value = data.vmName;
                    });
                };
                //根据资源ID查询
                $scope.queryServiceInstanceId = function (elasticIPId) {
                    if($scope.isServiceCenter){
                        var deferred = camel.get({
                            url: {s: "/goku/rest/v1.5/{vdc_id}/service-resources/{id}",
                                o:{vdc_id:user.vdcId,id:elasticIPId}},
                            "userId": user.id
                        });
                        deferred.success(function (data) {
                            var hosts =data || [];
                            $scope.hosts = hosts;
                            $scope.$apply(function () {
                                $scope.instanceId = hosts.instanceId;
                                $scope.instanceName = hosts.instanceName;
                                $scope.serviceInstanceName.value = hosts.instanceName;
                            });
                        });
                        deferred.fail(function (data) {
                            exception.doException(data);
                        });
                    }
                }
            }
        ];
        var elasticIPDetailModule = angular.module("network.elasticIP.detail", ["ng", "wcc", "ngSanitize"]);
        elasticIPDetailModule.controller("network.elasticIP.detail.ctrl", elasticIPDetailCtrl);
        elasticIPDetailModule.service("camel", http);
        elasticIPDetailModule.service("exception", exceptionService);
        return elasticIPDetailModule;
    });
