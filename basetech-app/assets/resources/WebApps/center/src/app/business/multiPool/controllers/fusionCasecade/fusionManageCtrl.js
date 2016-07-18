define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/business/multiPool/services/resourcesService",
    "language/ssp-exception",
    "app/services/exceptionService",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-directives/CheckboxGroup",
    "fixtures/zoneFixture"
], function ($, angular,UnifyValid, ValidatorService,RecourcesService,irmException,ExceptionService, Layout, Window,Message) {
    "use strict";

    var fusionManageCtrl = ["$scope", "$compile", "$state", "camel", 'validator', function ($scope, $compile, $state, camel,validator) {
        $scope.recourcesService = new RecourcesService();
        var exceptionService = new ExceptionService();
        var user = $("html").scope().user;
        var colon = ":";
        var hasOperateRight = user.privilege.role_role_add_option_cloudPoolHandle_value;

        // 设置接入和取消按钮是否灰化
        $scope.disableAccess = false;
        $scope.cloudInfrasId ="";
        $scope.stepUrl = {
            "step1": "../src/app/business/multiPool/views/fusionCasecade/accessConfig.html",
            "step2": "../src/app/business/multiPool/views/fusionCasecade/sectionUse.html"
        };

        $scope.stepShow = {
            "step1": true,
            "step2": false
        };

        $scope.addStep = {
            "id": "fusionManageStep",
            "values": [$scope.i18n.device_term_connectCfg_label, $scope.i18n.resource_term_AZ_label],
            "width": "600",
            "jumpable": false
        };

        // 接入配置页面内容
        $scope.name = {
            "id": "accessConfigNameId",
            "label": $scope.i18n.common_term_name_label + colon,
            "require": true,
            "value":"",
            "type": "input",
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:256}),
            "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(256):" +
                $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:256}),
            "readonly": false
        };

        $scope.region = {
            "id": "regionId",
            "label": $scope.i18n.common_term_section_label + colon,
            "require": true,
            "value":"",
            "type": "input",
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:256}),
            "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(256):" +
                $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:256}),
            "readonly": false
        };

        var versionValue = [
            {"selectId": "1.5.0", "label": "V100R005C00", "checked": true}
        ];

        $scope.version = {
            "id": "versionId",
            "label": $scope.i18n.common_term_version_label + colon,
            "require": true,
            "type": "input",
            "values": versionValue,
            "width": 150,
            "readonly": false
        };

        $scope.provider = {
            "id": "providerId",
            "label": $scope.i18n.common_term_provider_label + colon,
            "require": false,
            "value":"",
            "type": "input",
            "readonly": false,
            "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
        };
        UnifyValid.ipCheck = function (id) {
            var ip = $("#" + id).widget().getValue();
            return validator.ipFormatCheck(ip);
        };
        $scope.ipAddress = {
            "id": "ipAddressId",
            "require": true,
            "type": "ipv4",
            "value":"",
            "label": "IP:",
            "width": "150px",
            "extendFunction": ["ipCheck"],
            "validate": "ipCheck(ipAddressId):" + $scope.i18n.common_term_formatIP_valid + ";"
        };

        $scope.port = {
            "id": "portId",
            "require": true,
            "label": $scope.i18n.common_term_port_label + colon,
            "value":"643",
            "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" +
                $scope.i18n.common_term_invalidNumber_valid + ";maxValue(65535):" +
                $scope.i18n.sprintf($scope.i18n.common_term_range_valid,{1:1, 2:65535})
        };

        $scope.userName = {
            "id": "userNameId",
            "label": $scope.i18n.virtual_term_interconnectUser_label + colon,
            "require": true,
            "value":"FMRest",
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid,{1:1, 2:128}),
            "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(128):" +
                $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
        };

        $scope.password = {
            "id": "passwordId",
            "label": $scope.i18n.common_term_psw_label + colon,
            "type": "password",
            "require": true,
            "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(256):" +
                $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:256})
        };

        $scope.repassword = {
            "id": "repasswordId",
            "label": $scope.i18n.common_term_PswConfirm_label + colon,
            "type": "password",
            "require": true,
            "extendFunction": ["infoPwdEqual"],
            "validate": "infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid + ";"
        };
        UnifyValid.infoPwdEqual = function () {
            if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.repassword.id).widget().getValue()) {
                return true;
            } else {
                return false;
            }
        };

        $scope.description = {
            "id": "descriptionId",
            "label": $scope.i18n.common_term_desc_label + colon,
            "width": 400,
            "height": 60,
            "type":"multi",
            "require": false,
            "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:1024})
        };

        // 接入状态
        $scope.status = {
            "id": "statusId",
            "require": false,
            "label": $scope.i18n.device_term_connectStatus_label + colon,
            "value":"",
            "hasStatus":false
        };

        // 下一步按钮不灰化
        $scope.disableAccess = false;
        // 不显示连接状态
        $scope.status.hasStatus = false;

        $scope.accessConfigNextBtn = {
            "id": "accessConfigNextBtn",
            "text": $scope.i18n.common_term_next_button,
            "display":hasOperateRight,
            "click": function () {
                var result = UnifyValid.FormValid($("#accessConfigDiv"));
                if (!result) {
                    return;
                }
                $scope.name.value = $("#" + $scope.name.id).widget().getValue();
                $scope.region.value = $("#" + $scope.region.id).widget().getValue();
                $scope.port.value = $("#" + $scope.port.id).widget().getValue();
                $scope.version.value = $("#" + $scope.version.id).widget().getSelectedId();
                $scope.provider.value = $("#" + $scope.provider.id).widget().getValue();
                $scope.ipAddress.value = $("#" + $scope.ipAddress.id).widget().getValue();
                $scope.userName.value = $("#" + $scope.userName.id).widget().getValue();
                $scope.password.value = $("#" + $scope.password.id).widget().getValue();
                $scope.repassword.value = $("#" + $scope.repassword.id).widget().getValue();
                $scope.description.value = $("#" + $scope.description.id).widget().getValue();

                $scope.disableAccess = true;
                // 添加资源池
                $scope.operator.createCloudInfra();
            }
        };
        //取消按钮
        $scope.accessConfigNextCancelBtn = {
            "id": "accessConfigNextCancelBtnId",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                if($scope.timeoutId){
                    window.clearTimeout($scope.timeoutId);
                }
                $state.go("serviceMgr.multiPool");
            }
        };

        //可用分区页面
        $scope.sectionSelectModel = {
            "sectionSelectLabel": $scope.i18n.org_term_chooseAZ_label + colon,
            "canSelectSectionLabel": $scope.i18n.common_term_waitChoose_value,
            "sectionSelectedLabel": $scope.i18n.common_term_choosed_value
        };
        $scope.leftSectionUseSearchBox = {
            "id": "leftSectionUseSearchBoxId",
            "placeholder": "",
            "width": "150px",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                $scope.operator.initCanSelectAZ(searchString);
            }
        };

        $scope.canSelectAz = {
            "height":"28px",
            azList: []
        };
        $scope.selectedAz = {
            "height":"28px",
            width: "100px",
            azList: []
        };

        $scope.selectAzLeftBtn = {
            "click": function () {
                var azList = $scope.canSelectAz.azList;
                var len = azList.length;
                for (var index = len - 1; index >= 0; index--) {
                    if ($("#" + azList[index].id).widget().option("checked")) {
                        if (!$scope.recourcesService.isExist(azList[index], $scope.selectedAz.azList)) {
                            $scope.selectedAz.azList.push(azList[index]);
                        }
                        azList.splice(index, 1);
                    }
                }
            }
        };
        $scope.selectAzRightBtn = {
            "click": function () {
                var azList = $scope.selectedAz.azList;
                var len = azList.length;
                for (var index = len - 1; index >= 0; index--) {
                    if ($("#" + azList[index].id).widget().option("checked")) {
                        if (!$scope.recourcesService.isExist(azList[index], $scope.canSelectAz.azList)) {
                            $scope.canSelectAz.azList.push(azList[index]);
                        }
                        azList.splice(index, 1);
                    }
                }
            }
        };

        $scope.operator = {
            "createCloudInfra": function () {
                var cloudInfras = {
                    "cloudInfras": [
                        {
                            "name": $scope.name.value,
                            "region": $scope.region.value,
                            "type": "fusionmanager",
                            "version": $scope.version.value,
                            "ip": $scope.ipAddress.value,
                            "port": parseInt($scope.port.value),
                            "userName": $scope.userName.value,
                            "password": $scope.password.value,
                            "description": $scope.description.value,
                            "provider": $scope.provider.value
                        }
                    ]
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
                    $scope.$apply(function () {
                        if (response && response.cloudInfras && response.cloudInfras.length > 0) {
                            var id = response.cloudInfras[0].id;
                            $scope.cloudInfrasId = response.cloudInfras[0].id;
                            $scope.status.value =$scope.i18n.common_term_linking_value;
                            $scope.status.hasStatus = true;
                            $scope.timeoutId = window.setInterval(function() {
                                $scope.operator.queryCloudInfra(id);
                            }, 5000);
                        }
                        else{
                            $scope.disableAccess = false;
                        }
                    });
                });
                deferred.fail(function (response) {
                    $scope.$apply(function () {
                        $scope.disableAccess = false;
                        exceptionService.doException(response);
                    });

                });
            },
            "queryCloudInfra": function (id) {
                var deferred = camel.get({
                    "url": {
                        "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}",
                        "o": {
                            "tenant_id": "1",
                            "id": id
                        }
                    },
                    "params": {},
                    "userId": user.id
                });
                deferred.success(function (response) {
                        $scope.$apply(function () {
                            if (response && response.cloudInfra) {
                                // 设置接入状态
                                var cloudInfra = response.cloudInfra;
                                $scope.status.hasStatus = true;
                                if (cloudInfra.connectStatus === "connected")
                                {
                                    $scope.status.value = $scope.i18n.common_term_linkSucceed_value;
                                }
                                else if(cloudInfra.connectStatus === "connected_failed")
                                {
                                    $scope.status.value = $scope.i18n.common_term_linkFail_value;
                                }
                                else if(cloudInfra.connectStatus === "connecting"){
                                    $scope.status.value = $scope.i18n.common_term_linking_value;
                                }
                                else{
                                    $scope.status.value = $scope.i18n.common_term_linkAbnormal_value;
                                }

                                if (cloudInfra.connectStatus === "connected") {
                                    if(cloudInfra.taskStatus === "succeed"){
                                        $scope.status.value = $scope.i18n.cloud_pool_add_info_findAZsucceed_msg;
                                        window.clearTimeout($scope.timeoutId);
                                        $("#" + $scope.addStep.id).widget().next();
                                        $scope.stepShow.step1 = false;
                                        $scope.stepShow.step2 = true;
                                        $scope.disableAccess = false;

                                        // 初始化AZ列表
                                        $scope.operator.initCanSelectAZ();
                                    }
                                    else{
                                        $scope.status.value = $scope.i18n.common_term_discoveringAZ_value;
                                    }
                                }
                                else if (cloudInfra.connectStatus === "connected_failed") {
                                    window.clearTimeout($scope.timeoutId);
                                    $scope.status.value = $scope.i18n.common_term_linkFail_value;
                                    $scope.disableAccess = false;
                                }
                            }
                            else {
                                window.clearTimeout($scope.timeoutId);
                                $scope.disableAccess = false;
                                $scope.status.value = response.code;
                            }
                        });
                });
                deferred.fail(function (jqXHR, textStatus, errorThrown) {
                    if (!exceptionService.isException(jqXHR)) {
                        return;
                    }
                    if(jqXHR.status == 404){
                        window.clearTimeout($scope.timeoutId);
                        $state.go("serviceMgr.multiPool");
                    }
                });
            },
            "initCanSelectAZ": function (azName) {
                var url = "";
                if(!azName){
                    url = "/goku/rest/v1.5/{tenant_id}/available-zones?start={start}&manage-status={manage_status}&detail=false&cloud-infra={cloud-infra}";
                }
                else{
                    url = "/goku/rest/v1.5/{tenant_id}/available-zones?name=" + azName + "&start={start}&manage-status={manage_status}&detail=false&cloud-infra={cloud-infra}";
                }
                var deferred = camel.get({
                    "url":{
                        "s": url,
                        "o": {
                            "tenant_id": "1",
                            "start": 0,
                            "manage_status":"free",
                            "cloud-infra":$scope.cloudInfrasId
                        }
                    },
                    "params": {
                    },
                    "userId":user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {
                        if (!response) {
                            return;
                        }
                        var azList = [];
                        var azListRes = response.availableZones;
                        for (var item in azListRes) {
                            if ($scope.recourcesService.isExist(azListRes[item], $scope.selectedAz.azList)) {
                                continue;
                            }
                            azList.push({
                                "id": azListRes[item].id,
                                "name": azListRes[item].name,
                                "desc": azListRes[item].description || ""
                            });
                        }
                        $scope.canSelectAz.azList = $scope.recourcesService.constructAZList(azList, "left");
                    });
                });
                deferred.fail(function (response) {
                    $scope.$apply(function () {
                        exceptionService.doException(response);
                    });

                });
            },

            "addAz": function () {
                var sectionInfo = [];
                var azList = $scope.selectedAz.azList;
                // 如果没有AZ，则直接回到列表页面
                if(!azList || azList.length === 0){
                    showMessage($scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                        $state.go("serviceMgr.multiPool");
                    });
                    return;
                }

                var azIds = [];
                if (!azList) {
                    azList = [];
                }
                for (var index in azList) {
                    azIds.push(azList[index].id);
                }

                var params = {
                    "cloudInfraId":$scope.cloudInfrasId,
                    "availableZoneId": azIds
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/{tenant_id}/available-zones", o: {"tenant_id":"1"}},
                    "params": JSON.stringify(params),
                    "userId":user.id
                });
                deferred.success(function (response) {
                    showMessage($scope.i18n.virtual_hyper_add_info_setMAC_msg, function () {
                        $state.go("serviceMgr.multiPool");
                    });
                });
                deferred.fail(function (response) {
                    $scope.$apply(function () {
                        exceptionService.doException(response);
                    });
                });
            }
        };

        $scope.azSelectFinishBtn = {
            "id": "azSelectFinishBtnId",
            "text": $scope.i18n.common_term_ok_button,
            "display":hasOperateRight,
            "click": function () {
                $scope.operator.addAz();
            }
        };
        $scope.azSelectCancelBtn = {
            "id": "azSelectCancelBtnId",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                $state.go("serviceMgr.multiPool");
            }
        };
        function showMessage(content, action) {
            var options = {
                type: "confirm",
                "title": $scope.i18n.alarm_term_warning_label,
                content: content,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            msg.destroy();
                            action();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }
    }];
    return fusionManageCtrl;
});
