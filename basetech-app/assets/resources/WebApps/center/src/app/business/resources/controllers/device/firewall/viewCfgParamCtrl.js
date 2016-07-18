/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-2-24

 */
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    'app/business/resources/controllers/device/constants',
    "app/services/exceptionService"],
    function ($, angular, httpService, deviceConstants, ExceptionService) {
        "use strict";
        var viewCfgParamCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var $rootScope = $("html").injector().get("$rootScope");
            var id = $("#viewCfgParamWin").widget().option("deviceId");
            $scope.i18n = $("html").scope().i18n;
            $scope.cfgModel = {};
            $scope.trustDomainItfc = {
                "label": $scope.i18n.device_term_trustDomainInterface_label + ":" || "TRUST域接口:"
            };
            $scope.startIdOfSubPort = {
                "label": $scope.i18n.device_term_subinterfaceIDstart_label + ":" || "创建子网子接口起始ID:"
            };
            $scope.endIdOfSubPort = {
                "label": $scope.i18n.device_term_subinterfaceIDstart_label + ":" || "创建子网子接口结束ID:"
            };
            $scope.startIdOfAcl = {
                "label": $scope.i18n.device_term_aclRuleIDstart_label + ":" || "ACL规则起始ID:"
            };
            $scope.endIdOfAcl = {
                "label": $scope.i18n.device_term_aclRuleIDend_label + ":" || "ACL规则结束ID:"
            };
            $scope.startIdOfAddressGroup = {
                "label": $scope.i18n.device_term_addrPoolIDstart_label + ":" || "地址池起始ID:"
            };
            $scope.endIdOfAddressGroup = {
                "label": $scope.i18n.device_term_addrPoolIDend_label + ":" || "地址池结束ID:"
            };
            $scope.startIdOfSnat = {
                "label": $scope.i18n.device_term_SNATpolicyIDstart_label + ":" || "SNAT策略起始ID:"
            };
            $scope.endIdOfSnat = {
                "label": $scope.i18n.device_term_SNATpolicyIDend_label + ":" || "SNAT策略结束ID:"
            };
            $scope.startIOdOfVirtualRouter = {
                "label": $scope.i18n.device_term_vRouterIDstart_label + ":" || "虚拟路由起始ID:"
            };
            $scope.endIOdOfVirtualRouter = {
                "label": $scope.i18n.device_term_vRouterIDend_label + ":" || "虚拟路由结束ID:"
            };
            $scope.virtRouteRepeat = {
                "label": $scope.i18n.device_term_vRouterIDreuseTimes_label + ":" || "虚拟路由ID重复使用次数:"
            }
            $scope.startIpsecVpnAcl = {
                "label": $scope.i18n.device_term_aclRuleIDstartForIPSecVPN_label + ":" || "IPSec VPN ACL规则起始ID:"
            };
            $scope.endIpsecVpnAcl = {
                "label": $scope.i18n.device_term_aclRuleIDendForIPSecVPN_label + ":" || "IPSec VPN ACL规则结束ID:"
            };
            $scope.startL2tpVpnAcl = {
                "label": $scope.i18n.device_term_aclRuleIDstartForL2TPVPN_label + ":" || "L2TP VPN ACL规则起始ID:"
            };
            $scope.endL2tpVpnAcl = {
                "label": $scope.i18n.device_term_aclRuleIDendForL2TPVPN_label + ":" || "L2TP VPN ACL规则结束ID:"
            };
            $scope.aclBaseLine = {
                "label": $scope.i18n.device_term_aclRuleIDbasic_label + ":" || "ACL规则基准ID:"
            }
            $scope.queryCfgParams = function (id) {
                var queryConfig = deviceConstants.rest.PHYFW_CFGFILES
                var deferred = camel.get({
                    "url": {s: queryConfig.url, o: {"id": id}},
                    "type": queryConfig.type,
                    "userId": $rootScope.user.id
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        $scope.cfgModel = response;
                    });
                });
                deferred.fail(function (response) {
                    new ExceptionService().doException(response);
                });
            }
            $scope.queryCfgParams(id);
        }];
        var dependency = ['ng', 'wcc'];
        var viewCfgParamModule = angular.module("viewCfgParamModule", dependency);
        viewCfgParamModule.controller("viewCfgParamCtrl", viewCfgParamCtrl);
        viewCfgParamModule.service("camel", httpService);
        return viewCfgParamModule;
    });

