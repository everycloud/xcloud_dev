define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "app/services/messageService",
    "tiny-directives/IP",
    "tiny-directives/Textbox"
   ],

    function ($, angular, http, UnifyValid, ExceptionService, MessageService, IP) {
        "use strict";
        var openStackAccessCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var colon = ":";
            var hasOperateRight = user.privilege.role_role_add_option_cloudPoolHandle_value;
            $scope.version = {
                "id": "nameId",
                "label": $scope.i18n.common_term_version_label + colon,
                "value":"",
                "require": false
            };

            $scope.provider = {
                "id": "providerId",
                "label": $scope.i18n.common_term_provider_label + colon,
                "value":"",
                "require": false
            };

            $scope.url = {
                "id": "urlId",
                "label": "Keystone URL:",
                "require": false,
                "value": "",
                "type": "input",
                "readonly": false,
                "validate": "required:" + $scope.i18n.common_term_null_valid
            };
            $scope.defaultProject = {
                "id": "defaultProjectId",
                "label": "Default Project:",
                "require": false,
                "value": "",
                "type": "input",
                "readonly": false,
                "validate":"required:" + $scope.i18n.common_term_null_valid
            };
            $scope.name = {
                "id": "keystoneNameId",
                "label": $scope.i18n.common_term_userName_label + colon,
                "require": false,
                "value": "",
                "type": "input",
                "readonly": false,
                "validate": "required:" + $scope.i18n.common_term_null_valid
            };

            $scope.description = {
                "id": "descriptionId",
                "label": $scope.i18n.common_term_desc_label + colon,
                "width":300,
                "height":60,
                "value":"",
                "type":"multi",
                "require": false
            };

            $scope.noInfraTip = $scope.i18n.cloud_pool_import_info_noPool_msg || "不存在尚未接入的OpenStack实例。";
            $scope.accessDisable = undefined;
            $scope.access = {
                "id":"accessId",
                "text":$scope.i18n.common_term_connect_button,
                "disable": true,
                "display":hasOperateRight,
                "click":function(){
                    $scope.operator.accessOpenstack();
                }
            };

            $scope.cancel = {
                "id":"cancelId",
                "text": $scope.i18n.common_term_cancle_button,
                "click":function(){
                    $("#openStackWinId").widget().destroy();
                }
            };

            $scope.canAccessCloudInfras = [];

            $scope.operator = {
                "getKeystoneConfig":function(){
                    var deferred = camel.get({
                        url: "/goku/rest/v1.5/system/cloud-config/detail",
                        "params": {
                        }
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            if(!response){
                                return;
                            }
                            var configInfo = response.configInfo;
                            if(!configInfo){
                                return;
                            }

                            $scope.openstackConfig = configInfo;
                            $scope.url.value = configInfo.url;
                            $scope.version.value = configInfo.version || "havana";
                            $scope.provider.value = configInfo.vendor || "huawei";
                            $scope.defaultProject.value = configInfo.projectName;


                            $scope.operator.queryExsitInfras();

                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                },
                "accessOpenstack": function () {
                    if(!$scope.canAccessCloudInfras || $scope.canAccessCloudInfras.length === 0){
                        $("#openStackWinId").widget().destroy();
                        new MessageService().failMsgBox($scope.noInfraTip);
                        return;
                    }

                    // 给描述字段赋值
                    for(var index in $scope.canAccessCloudInfras){
                        $scope.canAccessCloudInfras[index].description = $("#" + $scope.description.id).widget().getValue();
                    }
                    var cloudInfras = {
                        "cloudInfras": $scope.canAccessCloudInfras
                    };

                    var deferred = camel.post({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras",
                            "o": {
                                "tenant_id": "1"
                            }
                        },
                        "params": JSON.stringify(cloudInfras),
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $("#openStackWinId").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                },
                "queryExsitInfras": function () {
                    var url = "/goku/rest/v1.5/1/cloud-infras";
                    var deferred = camel.get({
                        "url": url,
                        "params": {
                        },
                        "userId": user.id,
                        "monitor": false
                    });

                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $scope.existInfras = response.cloudInfras || [];

                            var regionList = $scope.openstackConfig.regions;
                            if(!regionList){
                                return;
                            }
                            $scope.canAccessCloudInfras = [];
                            for(var i in regionList){
                                var exist = false;
                                for(var j in $scope.existInfras){
                                    if(regionList[i].name === $scope.existInfras[j].region){
                                        exist = true;
                                        break;
                                    }
                                }
                                if(exist){
                                    continue;
                                }

                                var cloudInfra = {
                                    "name": "openstack_" + regionList[i].name,
                                    "region": regionList[i].name,
                                    "type": "openstack",
                                    "version": $scope.openstackConfig.version || "havana",
                                    "url":$scope.openstackConfig.url,
                                    "description": $("#" + $scope.description.id).widget().getValue(),
                                    "provider": $scope.provider.value || "huawei",
                                    "metadata":{"keystone-project":$scope.openstackConfig.projectName}
                                };
                                $scope.canAccessCloudInfras.push(cloudInfra);
                            }

                            if($scope.canAccessCloudInfras.length > 0){
                                $("#" + $scope.access.id).widget().option("disable",false);
                                $scope.accessDisable = false;
                            }
                            else
                            {
                                $("#" + $scope.access.id).widget().option("disable",true);
                                $scope.accessDisable = true;
                            }
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                }
            };

            $scope.operator.getKeystoneConfig();
        }];

        var dependency = ['ng', 'wcc'];
        var openStackAccessModule = angular.module("openStackAccessModule", dependency);
        openStackAccessModule.controller("openStackAccessCtrl", openStackAccessCtrl);
        openStackAccessModule.service("camel", http);
        return openStackAccessModule;
    });