/* global define */
define([
        "sprintf",
        'tiny-lib/underscore',
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        'app/services/competitionConfig',
        "app/services/httpService",
        "app/services/exceptionService",
        'app/business/ecs/services/vm/vmNicService'
    ],
    function (sprintf,_, $, angular, ngSanitize, keyIDI18n,competitionConfig, http, exception, vmNicService) {
        "use strict";
        var nicDetailCtrl = ["$scope", "$q", "camel", "exception",
            function ($scope, $q, camel, exception) {
                var user = $("html").scope().user;
                $scope.ICT = user.cloudType === "ICT";
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.vmwareICT = competitionConfig.isBaseOnVmware;

                // 转换网络类型字符串
                var networkTypeStr = {
                    "EXTERNAL": i18n.resource_term_externalNets_label,
                    "ORG_EXTERNAL": i18n.vpc_term_directConnectNet_label,
                    "ORG_INTERNAL": i18n.vpc_term_innerNet_label,
                    "VSA_MANAGER_NETWORK": i18n.resource_term_vsaNet_label,
                    "VSA_OPERATION_NETWORK": i18n.resource_term_vsaServiceNet_label,
                    "INTERNAL": i18n.vpc_term_innerNet_label,
                    "DIRECT_NETWORK": i18n.vpc_term_directConnectNet_label,
                    "ROUTED_NETWORK": i18n.vpc_term_routerNet_label
                };
                $scope.info = {};
                $scope.label = {
                    "id":$scope.i18n.common_term_ID_label+":",
                    "ipStatus":$scope.i18n.vm_term_IPstatus_label+":",
                    "eip":$scope.i18n.eip_term_eip_label+":",
                    "sg":$scope.i18n.org_term_secuGroupName_label+":",
                    "netType":$scope.i18n.vpc_term_netType_label+":"
                };

                $scope.getDetail = function (nicInfo,  detailId) {
                    $scope.$apply(function(){
                        $scope.info = nicInfo;
                        $scope.info.ipStatus = getIpStatus($scope.info.ipCheckResult);
                        $scope.info.networkTypeView = networkTypeStr[$scope.info.networkType];
                        $scope.detailId = detailId;
                    });
                    if(!$scope.ICT){
                        return;
                    }
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/{vdcId}/vpcs/{vpcId}/vms/{vmId}/nics/{nicId}?cloud-infra={infraId}",
                            o:{vdcId:user.vdcId,vpcId:nicInfo.vpcId,vmId:nicInfo.vmId,nicId:nicInfo.nicId,infraId:nicInfo.infraId}
                        },
                        "params": null,
                        "userId":user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            $scope.info.networkTypeView = networkTypeStr[data.networkType];
                            $scope.info.sg = getSgName(data.sgInfo);
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data);
                    });
                };

                //0：IP与分配的IP一致；1：IP与分配的IP不一致；null：非FM分配IP
                var getIpStatus = function (ipCheckResult) {
                    var ipStatus = "";
                    if (ipCheckResult === "0") {
                        ipStatus = i18n.vm_nic_IPstatus_para_sys_value;
                    } else if (ipCheckResult === "1") {
                        ipStatus = i18n.vm_nic_IPstatus_para_diffWithSys_value;
                    } else {
                        ipStatus = i18n.vm_nic_IPstatus_para_withoutSys_value;
                    }
                    return ipStatus;
                };
                //获取安全组名称，ICT下可能有多个安全组
                var getSgName = function (sgInfoArr) {
                    var sgName = "";
                    if (sgInfoArr && sgInfoArr.length > 0) {
                        _.each(sgInfoArr, function (item) {
                            sgName = sgName + item.sgName + "; ";
                        });
                        sgName = sgName.substring(0, sgName.length - 2);
                    }
                    return sgName;
                };
            }
        ];

        var nicDetailModel = angular.module("ecs.vm.nicDetail", ["ng", "wcc", "ngSanitize"]);
        nicDetailModel.controller("ecs.vm.nicDetail.ctrl", nicDetailCtrl);
        nicDetailModel.service("camel", http);
        nicDetailModel.service("exception", exception);
        return nicDetailModel;
    });
