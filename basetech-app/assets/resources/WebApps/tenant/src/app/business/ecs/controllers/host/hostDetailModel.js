/* global define */
define(["sprintf",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/competitionConfig",
    'app/services/capacityService',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/commonService'
],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, _, Window, Message, UnifyValid, http,Competition, capacityService, validator, exception) {
        "use strict";
        var hostDetailCtrl = ["$scope", "$q", "camel", "validator", "exception", "$interval",
            function ($scope, $q, camel, validator, exception, $interval) {
                // 公共参数和服务
                var user = $("html").scope().user || {};
                var $state = $("html").injector().get("$state");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.isServiceCenter = $("html").scope().deployMode === "serviceCenter";

                $scope.phyName = {
                    "id": "phyName",
                    "label": (i18n.common_term_physiServerName_label || "物理机名称")+":",
                    "value": ""
                };
                $scope.phyType = {
                    "id": "phyType",
                    "label": (i18n.device_term_model_label || "型号")+":",
                    "value": ""
                };
                $scope.phySpec = {
                    "id": "phySpec",
                    "label": (i18n.common_term_spec_label || "硬件规格")+":",
                    "value": ""
                };
                $scope.phyOS = {
                    "id": "phyOS",
                    "label": (i18n.common_term_OS_label ||"操作系统")+":",
                    "value": ""
                };
                $scope.phyIP = {
                    "id": "phyIP",
                    "label": "IP:",
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
                //根据资源ID查询
                function queryServiceInstanceId(id){
                        var deferred = camel.get({
                            url: {s: "/goku/rest/v1.5/{vdc_id}/service-resources/{id}",
                                o:{vdc_id:user.vdcId,id: id}},
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
                function setValues(){
                    $scope.phyName.value = $scope.hosytName;
                    $scope.phyType.value = $scope.hosytModel;
                    $scope.phySpec.value = $scope.hosytSpec;
                    $scope.phyOS.value = $scope.hosytOsType;
                    $scope.phyIP.value = $scope.hosytOsIp;
                    $scope.$digest();
                }
                $scope.init = function () {
                    setValues();
                    if($scope.isServiceCenter){
                        queryServiceInstanceId($scope.hosytId);
                    }
                };
            }
        ];

        var hostDetailModel = angular.module("ecs.host.detail", ["ng", "wcc", "ngSanitize"]);
        hostDetailModel.controller("ecs.host.detail.ctrl", hostDetailCtrl);
        hostDetailModel.service("camel", http);
        hostDetailModel.service("exception", exception);
        hostDetailModel.service("validator", validator);

        return hostDetailModel;
    });
