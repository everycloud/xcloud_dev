/**
 * Created on 14-3-4.
 */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/validatorService',
        'tiny-directives/Step'
    ],
    function ($, angular, validator) {
        "use strict";

        var createByTemplateCtrl = ["$scope", "$compile",
            function ($scope, $compile) {
                var i18n = $scope.i18n;
                $scope.service = {
                    "step": {
                        "id": "createByOpenstack-app-step",
                        "values": [ i18n.common_term_basicInfo_label,i18n.common_term_setPara_label, i18n.common_term_confirmInfo_label],
                        "width": 900,
                        "jumpable": false
                    },
                    "show": {
                        "basicInfo": true,
                        "configParam": false,
                        "confirmByTemplate": false
                    }
                };

                // 事件定义
                $scope.events = {
                    "selAppTempNext": "selAppTempNext",
                    "selAppTempNextFromParent": "selAppTempNextFromParent",
                    "selBaseInfoNext": "selBaseInfoNext",
                    "selBaseInfoNextFromParent": "selBaseInfoNextFromParent",
                    "selParamNext": "selParamNext",
                    "selParamNextFromParent": "selParamNextFromParent"
                };

                //参数当前分页数据和所有数据
                $scope.commonParams = {
                    "data": [],
                    "confirmData": [],
                    "allData": []
                };

                $scope.serviceTemplateTable = {
                    "data": []
                };

                //配置软件等需要用到的临时数据,从模板中解析而来
                $scope.tmp = {
                    "vmNameMap": {},
                    "vmNicsMap": {},
                    "ameIdResourceMap": {} //模板体中,ameId与所有资源的映射
                };

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

                $scope.action = null;

                $scope.detail = {
                    "param" : null
                };

                $scope.params = {
                    "serviceId" : null,
                    "appTemplateId" : null,
                    "appTemplateName" : null,
                    "templateId" : null,
                    "approvalType" : "vdc",
                    "fromFlag": 0,
                    "isModify": false, //默认为创建应用,否则为修改应用
                    "appId": null,
                    "appTempBody": null,
                    "appTempBodyStr": null,
                    "appTempBodyObj": null,
                    "selVpcId": null,
                    "selVpcName": null,
                    "selResPoolId": null,
                    "cloudInfraId" : null,
                    "selResPoolName": null,
                    "parameters": {}
                };

                $scope.$on($scope.events.selAppTempNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selAppTempNextFromParent, msg);
                });
                $scope.$on($scope.events.selBaseInfoNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selBaseInfoNextFromParent, msg);
                });
                $scope.$on($scope.events.selParamNext, function (event, msg) {
                    $scope.$broadcast($scope.events.selParamNextFromParent, msg);
                });
            }
        ];

        return createByTemplateCtrl;
    }
);
