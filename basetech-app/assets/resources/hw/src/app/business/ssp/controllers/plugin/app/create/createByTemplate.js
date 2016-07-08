/**
 * Created on 14-3-4.
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/validatorService',
        "app/business/ssp/controllers/plugin/app/constants",
        'tiny-directives/Step'
    ],
    function ($, angular, validator, constants) {
        "use strict";

        var createByTemplateCtrl = ["$scope", "$compile", "$state",
            function ($scope, $compile, $state) {
                var i18n = $("html").scope().i18n;
                $scope.service = {
                    "step": {
                        "id": "createByTemplate-app-step",
                        "values": [ i18n.common_term_location_label, i18n.vm_term_chooseNet_label, i18n.app_term_setAppPara_button, i18n.app_term_setVLB_button, i18n.common_term_basicInfo_label, i18n.common_term_confirmInfo_label],
                        "width": 900,
                        "jumpable": false
                    },
                    "show": {
                        "basicInfo": true,
                        "chooseNetwork": false,
                        "configApp": false,
                        "configVlb": false,
                        "baseInfo" : false,
                        "confirmByTemplate": false
                    }
                };

                // 事件定义
                $scope.events = {
                    "selAppTempNext": "selAppTempNext",
                    "selAppTempNextFromParent": "selAppTempNextFromParent",
                    "selBaseInfoNext": "selBaseInfoNext",
                    "selBaseInfoNextFromParent": "selBaseInfoNextFromParent",
                    "selTempNetNext": "selTempNetNext",
                    "selTempNetNextFromParent": "selTempNetNextFromParent",
                    "selAppParamNext": "selAppParamNext",
                    "selAppParamNextFromParent": "selAppParamNextFromParent",
                    "selVlbParamNext": "selVlbParamNext",
                    "selVlbParamNextFromParent": "selVlbParamNextFromParent",
                    "selConfirm" : "selConfirm",
                    "selConfirmFormParent" : "selConfirmFormParent"
                };

                $scope.detail = {};

                //锁定定义
                $scope.lock = {
                    "locationLock": "0",
                    "vpcLock": "0",
                    "networkLock": "0",
                    "commonParamsLock": "0",
                    "vmLock": "0",
                    "appLock": "0",
                    "vlbLock" : "0"
                };
                //选择模板网络 网络列表数据
                $scope.templateNet = {
                    "data": [{
                        "name": "network001",
                        "vpcId": "001",
                        "networkId": "network001",
                        "networkName": "",
                        "vpcValues": [],
                        "networkValues": []
                    }, {
                        "name": "NETWORK002",
                        "vpcId": "002",
                        "networkId": "NETWORK002",
                        "networkName": "",
                        "vpcValues": [],
                        "networkValues": []
                    }]
                };

                $scope.commonParams = {
                    "data": [{
                        "name": "commonParams001",
                        "value": "32522",
                        "needInput": false,
                        "description": "my network"
                    }, {
                        "name": "commonParams003",
                        "value": "",
                        "needInput": true,
                        "description": "outer network"
                    }]
                };

                //配置应用参数 网络列表数据
                $scope.confAppVmTemplates = {
                    "data": []
                };

                //配置应用参数 网络列表数据
                $scope.confAppSoftPacks = {
                    "data": []
                };

                //配置应用参数 shell数据
                $scope.confAppShells = {
                    "data": []
                };

                //配置VLB  网络的ameId与网络实例的对应关系
                $scope.configVlbNetworkMap = {};
                $scope.confVlbVmTemplates = {
                    "data": []
                };

                //配置软件等需要用到的临时数据,从模板中解析而来
                $scope.tmp = {
                    "vmNameMap": {},
                    "vmNicsMap": {},
                    "vmTempInstanceMap": {}, //虚拟机模板的ameId与伸缩组里/外的虚拟机的映射
                    "ameIdResourceMap": {}, //模板体中,ameId与所有资源的映射
                    "ameIdVlbNetMap": {}, //vmTemplateId与vlbNet的映射
                    "osTypeMap": {}
                };

                $scope.params = {
                    "action" : null,
                    "serviceId" : null,
                    "approvalType" : "vdc",
                    "approvalTypeName" : i18n.org_term_VDCadmin_label,
                    "templateId" : null,
                    "appTemplateId" : null,
                    "appTemplateName" : null,
                    "fromFlag": 0,
                    "appTempBody": null,
                    "selServiceTemplate": null,
                    "serviceTemplate": {},
                    "cloudInfraId": null,
                    "cloudInfraName": null,
                    "selVpcId": null,
                    "selVpcName": null,
                    "resPoolFm": true,
                    "appName": null,
                    "curLogo": "buff01.jpg",
                    "description": "",
                    "logo": "",
                    "networks": [],
                    "commonParams": [],
                    "templates": [],
                    "softwares": [],
                    "shells": []
                };

                $scope.commonCancel = function () {
                    $state.go("ssp.catalog");
                };

                $scope.$on($scope.events.selBaseInfoNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selBaseInfoNextFromParent, msg);
                });
                $scope.$on($scope.events.selTempNetNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selTempNetNextFromParent, msg);
                });
                $scope.$on($scope.events.selAppParamNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selAppParamNextFromParent, msg);
                });
                $scope.$on($scope.events.selVlbParamNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selVlbParamNextFromParent, msg);
                });
                $scope.$on($scope.events.selAppTempNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selAppTempNextFromParent, msg);
                });
                $scope.$on($scope.events.selConfirm, function(event, msg) {
                    $scope.$broadcast($scope.events.selConfirmFormParent, msg);
                });
            }
        ];

        return createByTemplateCtrl;
    }
);
