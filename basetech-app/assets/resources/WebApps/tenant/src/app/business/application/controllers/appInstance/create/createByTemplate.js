/**
 * Created on 14-3-4.
 */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/validatorService',
        "app/business/application/controllers/constants",
        'tiny-directives/Step'
    ],
    function ($, angular, validator, constants) {
        "use strict";

        var createByTemplateCtrl = ["$scope", "$compile", "$state",
            function ($scope, $compile, $state) {
                var i18n = $scope.i18n;
                $scope.service = {
                    "step": {
                        "id": "createByTemplate-app-step",
                        "values": [i18n.app_term_chooseAppTemplate_label, i18n.common_term_basicInfo_label,i18n.vm_term_chooseNet_label, i18n.app_term_setAppPara_button, i18n.app_term_setVLB_button,i18n.common_term_confirmInfo_label],
                        "width": 900,
                        "jumpable": false
                    },
                    "show": {
                        "chooseTemplate": true,
                        "basicInfo": false,
                        "chooseNetwork": false,
                        "configApp": false,
                        "configVlb": false,
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
                    "selVlbParamNextFromParent": "selVlbParamNextFromParent"
                };

                //选择模板
                $scope.serviceTemplateTable = {
                    "data": []
                };

                //选择模板网络 网络列表数据
                $scope.templateNet = {
                    "data": []
                };

                $scope.commonParams = {
                    "data": []
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
                    "fromFlag": 0,
                    "appTempBody": null,
                    "selServiceTemplate": null,
                    "serviceTemplate": {},
                    "cloudInfraId": null,
                    "azid": null,
                    "selVpcId": null,
                    "selVpcName": null,
                    "resPoolFm": true,
                    "appName": null,
                    "appTag": "",
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
                    if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                        $state.go("application.manager.instance");
                    } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                        $state.go("application.manager.overview");
                    } else {
                        $state.go("application.manager.template");
                    }
                };
            }
        ];

        return createByTemplateCtrl;
    }
);
