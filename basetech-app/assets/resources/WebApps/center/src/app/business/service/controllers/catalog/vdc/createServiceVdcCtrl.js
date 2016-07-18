define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Radio",
    "tiny-widgets/Select",
    "tiny-widgets/Textbox",
    "tiny-widgets/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    'app/services/validatorService',
    "app/business/service/services/catalog/catalogService",
    "app/business/service/services/service/createService"],
    function ($, angular, Checkbox, Radio, Select, Textbox, Button, Window, Message, UnifyValid, validatorService, catalogService, createService) {
        "use strict";

        var createVdcCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$q", "validator", "exception", function ($scope, $compile, $state, $stateParams, camel, $q, validator, exception) {
            var createServiceIns = new createService(exception, $q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var templateId = $stateParams.templateId;
            var serviceId = $stateParams.serviceId;
            var i18n = $scope.i18n;
            var user = $scope.user;

            var getTypes = function (options) {
                options = options || {};
                options = {
                    disable: options.disable || [false, false, false],
                    checked: options.checked || [true, false, false]
                };
                return [
                    {
                        "key": "1",
                        "text": i18n.service_term_inputWhenApply_label||"申请时输入",
                        "disable": options.disable["1"],
                        "checked": options.checked["1"]
                    },
                    {
                        "key": "2",
                        "text": i18n.service_term_inputWhenApprove_label||"审批时输入",
                        "disable": options.disable["2"],
                        "checked": options.checked["2"]
                    },
                    {
                        "key": "0",
                        "text": i18n.user_term_lock_button || "锁定",
                        "disable": options.disable["0"],
                        "checked": options.checked["0"]
                    }
                ];
            };

            $scope.createVdvStep1 = {
                "url": "../src/app/business/service/views/catalog/vdc/basicInfo.html"
            };
            $scope.createVdvStep2 = {
                "url": "../src/app/business/service/views/catalog/vdc/resourceQuotaInfo.html"
            };
            $scope.createVdvStep3 = {
                "url": "../src/app/business/service/views/catalog/vdc/networkQuotaInfo.html"
            };
            $scope.createVdvStep4 = {
                "url": "../src/app/business/service/views/catalog/vdc/createVdcConfirm.html"
            };
            //控制步骤中各页面的显示
            $scope.basicInfoPage = true;
            $scope.resourceQuotaPage = false;
            $scope.networkQuotaPage = false;
            $scope.createVdcConfirmPage = false;
            $scope.createVdcStep = {
                "id": "createVdcStep",
                "values": [
                    i18n.common_term_basicInfo_label || "基本信息",
                    i18n.common_term_resourceQuota_label || "资源配额",
                    i18n.common_term_section_label||"地域",
                    i18n.common_term_confirmInfo_label || "确认信息"
                ],
                "width": "800",
                "jumpable": false
            };
            $scope.orgQuotaInfo = {
                labelwidth: window.urlParams.lang === "zh" ? "90px" : "122px"
            };
            $scope.orgAzInfo = {
                labelwidth: window.urlParams.lang === "zh" ? "80px" : "145px"
            };
            //定义全局变量
            $scope.params = {
                "applyType": "domain",
                "resourceLock": "0",
                "cpuCore": null,
                "memory": null,
                "storage": null,
                "vmCount": null,
                "networkLock": "0",
                "ipNum": null,
                "vpcNum": null,
                "areaId": null,
                "serGroup": null,
                "whiteList": null,
                "serviceName": null,
                "catalogList": null,
                "desc": "",
                "iconId": ""
            };
            /**
             * 基本信息界面初始化
             */
            $scope.baseInfo = {
                "name": {
                    "id": "createApp-appName",
                    "label": (i18n.common_term_name_label || "名称" ) + ":",
                    "width": 200,
                    "require": true,
                    "value": "",
                    "validate": "regularCheck(" + validator.serviceName + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") +
                        ";regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                directory: {
                    "id": "createDirectory",
                    "label": (i18n.service_term_catalog_label || "服务目录" ) + ":",
                    "mode": "multiple",
                    "require": false,
                    "width": 200,
                    values: []
                },
                "logo": {
                    "label": (i18n.common_term_icon_label || "图标" ) + ":",
                    "require": true,
                    "curLogo": "",
                    "switchIcon": function (icon) {
                        $scope.params.iconId = icon.id;
                        $scope.baseInfo.logo.curLogo = icon.imageUrl;
                    },
                    "deleteIcon": function (icon, index) {
                        deleteIcon(icon.id, index);
                    },
                    "toggle": function ($event) {
                        $event.stopPropagation();
                        $(".dropdown-menu").toggle();
                    },
                    "upload": function () {
                        var uploadImgWindow = new Window({
                            "winId": "uploadImgWindow",
                            "title": i18n.common_term_uploadLocalPic_button||"上传图片",
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "i18n": $scope.i18n,
                            "callback": function (icon) {
                                $scope.$apply(function () {
                                    $scope.params.iconId = icon.id;
                                    $scope.baseInfo.logo.curLogo = icon.imageUrl;
                                    $scope.icons.unshift(icon);
                                });
                            },
                            "content": "../src/app/business/service/views/catalog/iconUpload.html",
                            "height": 300,
                            "width": 530,
                            "buttons": null
                        }).show();
                    }
                },
                "description": {
                    "id": "createApp-appDescription",
                    "label": (i18n.common_term_desc_label || "描述" ) + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 300,
                    "height": "100",
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, 1,1024)
                },
                preBtn: {
                    "id": "create-service-basicInfo-next",
                    "text": i18n.common_term_back_button || "上一步",
                    "display": !serviceId,
                    "click": function () {
                        $state.go("service.create");
                    }
                },
                nextBtn: {
                    "id": "create-service-basicInfo-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVdcBasicPage"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVdcStep.id).widget().next();
                        $scope.basicInfoPage = false;
                        $scope.resourceQuotaPage = true;
                        $scope.networkQuotaPage = false;
                        $scope.createVdcConfirmPage = false;
                        var catalogs = $("#" + $scope.baseInfo.directory.id).widget().getSelectedId();
                        $scope.params.serviceName = $("#" + $scope.baseInfo.name.id).widget().getValue();
                        $scope.params.catalogList = catalogs;
                        $scope.params.desc = $("#" + $scope.baseInfo.description.id).widget().getValue();
                        $scope.createVdcConfirmInfo.serviceName.value = $scope.params.serviceName;
                        $scope.createVdcConfirmInfo.serviceCatalog.value = $("#" + $scope.baseInfo.directory.id).widget().getSelectedLabel();
                        $scope.createVdcConfirmInfo.description.value = $scope.params.desc;
                        $scope.createVdcConfirmInfo.apptype.value = $scope.apptype === "none" ? i18n.service_term_approveNotRequire_label: i18n.service_term_approveBySysadmin_label;
                    }
                },
                cancelBtn: {
                    "id": "create-service-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            // 资源配额界面
            $scope.info = {
                cpuNumber: {
                    "id": "cpuNumberId",
                    "label": $scope.i18n.common_term_vcpuNum_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000) +
                        ";maxValue(80000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000)
                },
                memoryUpperLimit: {
                    "id": "memoryUpperLimitId",
                    "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000) +
                        ";maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000)
                },
                storage: {
                    "id": "storageId",
                    "label": $scope.i18n.common_term_storageGB_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000) +
                        ";maxValue(512000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000)
                },
                eipNumber: {
                    "id": "eipNumberId",
                    "label": $scope.i18n.eip_term_eipNum_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200) +
                        ";maxValue(200):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200)
                },
                vpcNumber: {
                    "id": "vpcNumberId",
                    "label": $scope.i18n.vpc_term_vpcNum_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20) +
                        ";maxValue(20):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20)
                },
                sgNumber: {
                    "id": "sgNumberId",
                    "label": $scope.i18n.org_term_secuGroupNum_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000) +
                        ";maxValue(1000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000)
                },
                vmNumber: {
                    "id": "vmNumberId",
                    "label": $scope.i18n.vm_term_vmNum_label + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000) +
                        ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000)
                },
                status: {
                    "id": "applicationType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [],
                    "layout": "horizon",
                    "change": function () {
                        var resApptype = $("#" + $scope.info.status.id).widget().opChecked("checked");
                        $scope.params.resourceLock = resApptype;
                        if (resApptype != "0") {
                            $scope.params.cpuCore = null;
                            $scope.params.memory = null;
                            $scope.params.storage = null;
                            $scope.params.vmCount = null;
                            $scope.params.ipNum = null;
                            $scope.params.vpcNum = null;
                            $scope.params.serGroup = null;
                            $scope.createVdcConfirmInfo.cpu.value = "";
                            $scope.createVdcConfirmInfo.memory.value = "";
                            $scope.createVdcConfirmInfo.storage.value = "";
                            $scope.createVdcConfirmInfo.vmNum.value = ""
                            ;
                            $scope.createVdcConfirmInfo.ipNum.value = "";
                            $scope.createVdcConfirmInfo.vpcNum.value = "";
                            $scope.createVdcConfirmInfo.groupNum.value = "";
                        }
                    }
                },
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVdcStep.id).widget().pre();
                        $scope.basicInfoPage = true;
                        $scope.resourceQuotaPage = false;
                        $scope.networkQuotaPage = false;
                        $scope.createVdcConfirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createServiceVdcRes"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVdcStep.id).widget().next();
                        $scope.basicInfoPage = false;
                        $scope.resourceQuotaPage = false;
                        $scope.networkQuotaPage = true;
                        $scope.createVdcConfirmPage = false;
                        var resLocktype = $("#" + $scope.info.status.id).widget().opChecked("checked");
                        var confirmlock = $("#" + $scope.createVdcConfirmInfo.vdcresourceappType.id).widget();
                        confirmlock.opChecked(resLocktype, true);
                        $scope.params.resourceLock = resLocktype;
                        if (resLocktype === "0") {
                            $scope.params.cpuCore = parseInt($("#" + $scope.info.cpuNumber.id).widget().getValue());
                            $scope.params.memory = parseInt($("#" + $scope.info.memoryUpperLimit.id).widget().getValue());
                            $scope.params.storage = parseInt($("#" + $scope.info.storage.id).widget().getValue());
                            $scope.params.ipNum = parseInt($("#" + $scope.info.eipNumber.id).widget().getValue());
                            $scope.params.vpcNum = parseInt($("#" + $scope.info.vpcNumber.id).widget().getValue());
                            $scope.params.serGroup = parseInt($("#" + $scope.info.sgNumber.id).widget().getValue());
                            $scope.params.vmCount = parseInt($("#" + $scope.info.vmNumber.id).widget().getValue());

                            $scope.createVdcConfirmInfo.cpu.value = $scope.params.cpuCore;
                            $scope.createVdcConfirmInfo.memory.value = $scope.params.memory;
                            $scope.createVdcConfirmInfo.storage.value = $scope.params.storage;
                            $scope.createVdcConfirmInfo.ipNum.value = $scope.params.ipNum;
                            $scope.createVdcConfirmInfo.vpcNum.value = $scope.params.vpcNum;
                            $scope.createVdcConfirmInfo.groupNum.value = $scope.params.serGroup;
                            $scope.createVdcConfirmInfo.vmNum.value = $scope.params.vmCount;
                        }

                        queryArea($scope.params.areaId);
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };

            /**
             * 地域配置
             */
            $scope.zone = {
                "appType": {
                    "id": "appType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [],
                    "layout": "horizon",
                    "change": function () {
                        var netApptype = $("#" + $scope.zone.appType.id).widget().opChecked("checked");
                        $scope.params.networkLock = netApptype;
                        if (netApptype != "0") {
                            $scope.params.areaId = [];
                            $scope.createVdcConfirmInfo.area.value = "";
                        }
                    }
                },
                areaZone: {
                    "id": "areaZone",
                    label: (i18n.common_term_section_label || "地域") + ":",
                    "mode": "multiple",
                    "validate": "required:" + (i18n.common_term_null_valid || "不能为空。"),
                    "require": true,
                    "width": 200,
                    values: []

                },
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVdcStep.id).widget().pre();
                        $scope.basicInfoPage = false;
                        $scope.resourceQuotaPage = true;
                        $scope.networkQuotaPage = false;
                        $scope.createVdcConfirmPage = false;
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createVdcAreaPage"));
                        if (!valid) {
                            return;
                        }
                        $("#" + $scope.createVdcStep.id).widget().next();
                        $scope.basicInfoPage = false;
                        $scope.resourceQuotaPage = false;
                        $scope.networkQuotaPage = false;
                        $scope.createVdcConfirmPage = true;
                        var networktype = $("#" + $scope.zone.appType.id).widget().opChecked("checked");
                        $scope.params.networkLock = networktype;
                        var confirmarealock = $("#" + $scope.createVdcConfirmInfo.vdcAreaappType.id).widget();
                        confirmarealock.opChecked(networktype, true);
                        if (networktype === "0") {
                            $scope.params.areaId = $("#" + $scope.zone.areaZone.id).widget().getSelectedId();
                            $scope.createVdcConfirmInfo.area.value = $("#" + $scope.zone.areaZone.id).widget().getSelectedLabel();
                        }else{
                            $scope.params.areaId = [];
                            $scope.createVdcConfirmInfo.area.value = "";
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            //查询地域
            function queryArea(areaIds) {
                var deferred = createServiceIns.queryCloudInfras(user.orgId, user.id);
                deferred.then(function (data) {
                    var SPER = "@";
                    var selectedAreaFormat = (areaIds && areaIds.length) ? (SPER + areaIds.join(SPER) + SPER) : "";
                    data = data || {cloudInfras: []};
                    var cloudInfras = data.cloudInfras ||[];
                    var selectValues = [];
                    for (var i = 0, len = cloudInfras.length; i < len; i++) {
                        var cloudInfrasId = cloudInfras[i].id;
                        //创建为第一个，编辑为旧有数据
                        var checked = (!selectedAreaFormat && i === 0) || (selectedAreaFormat && selectedAreaFormat.indexOf(SPER + cloudInfrasId + SPER) > -1);
                        selectValues.push({
                            "selectId": cloudInfrasId,
                            "label": cloudInfras[i].region || cloudInfras[i].name,
                            "checked": checked
                        });
                    }
                    $scope.zone.areaZone.values = selectValues;
                });
            }

            /**
             * 查询服务目录
             */
            function queryCatalogs(catalogs) {
                var options = {
                    "user": user
                };
                var deferred = catalogServiceIns.queryCatalogs(options);
                deferred.then(function (data) {
                    var SPER = "@";
                    var selectedCatalogsFormat = catalogs.length ? (SPER + catalogs.join(SPER) + SPER) : "";
                    data = data || {catalogs: []};
                    var allCatalogs = data.catalogs ||[];
                    var selectValues = [];
                    for (var i = 0, len = allCatalogs.length; i < len; i++) {
                        var catalogId = allCatalogs[i].id;
                        var checked = (selectedCatalogsFormat && selectedCatalogsFormat.indexOf(SPER + catalogId + SPER) > -1);
                        selectValues.push({
                            "selectId": catalogId,
                            "label": allCatalogs[i].name,
                            "checked": checked
                        });
                    }
                    $scope.baseInfo.directory.values = selectValues;
                });
            };
            //查询icon list
            function queryIcons(serviceImageUrl) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId
                };
                var deferred = createServiceIns.queryIcons(options);
                deferred.then(function (data) {
                    data = data || {serviceiconlist: []};
                    var list = data.serviceiconlist;
                    $scope.icons = list;
                    if (list.length) {
                        var icon = list[0];
                        if (serviceImageUrl) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i].imageUrl == serviceImageUrl) {
                                    icon = list[i];
                                    break;
                                }
                            }
                        }
                        $scope.baseInfo.logo.curLogo = icon.imageUrl;
                        $scope.params.iconId = icon.id;
                    }
                });
            };
            //删除icon
            function deleteIcon(iconId, index) {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "iconId": iconId
                };
                var deferred = createServiceIns.deleteIcon(options);
                deferred.then(function (data) {
                    $scope.icons.splice(index, 1);
                    if ($scope.icons.length) {
                        $scope.baseInfo.logo.switchIcon($scope.icons[0]);
                    }
                });
            };
            /**
             * 确认界面
             */
            $scope.createVdcConfirmInfo = {
                serviceName: {
                    "id": "serviceName",
                    "label": (i18n.service_term_serviceName_label || "服务名称") + ":",
                    "value": ""
                },
                serviceCatalog: {
                    "id": "serviceCatalog",
                    "label": (i18n.service_term_catalog_label || "服务目录") + ":",
                    "value": ""
                },
                description: {
                    "id": "description：",
                    "label": (i18n.common_term_desc_label || "描述") + ":",
                    "value": ""
                },
                apptype: {
                    "id": "apptype",
                    "label": (i18n.service_term_approveType_label||"审批类型") + ":",
                    "value": ""
                },
                cpu: {
                    "id": "cpu",
                    "label": (i18n.common_term_vcpuNum_label || "vCPU个数") + ":",
                    "value": ""
                },
                memory: {
                    "id": "memory",
                    "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":",
                    "value": ""
                },
                storage: {
                    "id": "storage",
                    "label": (i18n.common_term_storageGB_label || "存储(GB)") + ":",
                    "value": ""
                },
                vmNum: {
                    "id": "vmNum",
                    "label": (i18n.vm_term_vmNum_label || "虚拟机个数") + ":",
                    "value": ""
                },
                ipNum: {
                    "id": "ipNum",
                    "label": (i18n.eip_term_eipNum_label || "弹性IP地址个数") + ":",
                    "value": ""
                },
                vpcNum: {
                    "id": "vpcNum",
                    "label": (i18n.vpc_term_vpcNum_label || "VPC个数") + ":",
                    "value": ""
                },
                groupNum: {
                    "id": "groupNum",
                    "label": (i18n.org_term_secuGroupNum_label || "安全组个数") + ":",
                    "value": ""
                },
                area: {
                    "id": "area",
                    "label": (i18n.common_term_section_label || "地域") + ":",
                    "value": ""
                },
                vdcAreaappType: {
                    "id": "vdcAreaappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [
                        {
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label||"申请时输入",
                            "disable": true
                        },
                        {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label||"审批时输入",
                            "disable": true
                        },
                        {
                            "key": "0",
                            "text": i18n.user_term_lock_button || "锁定",
                            "disable": true
                        }
                    ],
                    "layout": "horizon"
                },
                vdcresourceappType: {
                    "id": "vdcresourceappType",
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": [
                        {
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label||"申请时输入",
                            "disable": true
                        },
                        {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label||"审批时输入",
                            "disable": true
                        },
                        {
                            "key": "0",
                            "text": i18n.user_term_lock_button || "锁定",
                            "disable": true
                        }
                    ],
                    "layout": "horizon"
                },
                preBtn: {
                    "id": "createService-pre",
                    "text": i18n.common_term_back_button || "上一步",
                    "click": function () {
                        $("#" + $scope.createVdcStep.id).widget().pre();
                        $scope.basicInfoPage = false;
                        $scope.resourceQuotaPage = false;
                        $scope.networkQuotaPage = true;
                        $scope.createVdcConfirmPage = false;
                    }
                },
                addBtn: {
                    "id": "createServiceVDC-next",
                    "text": serviceId ? (i18n.common_term_save_label || "保存") : (i18n.common_term_create_button || "创建"),
                    "click": function () {
                        var objJSon = {
                            "CPU": {
                                "value": $scope.params.cpuCore,
                                "lock": $scope.params.resourceLock
                            },
                            "MEMORY": {
                                "value": $scope.params.memory,
                                "lock": $scope.params.resourceLock
                            },
                            "VM": {
                                "value": $scope.params.vmCount,
                                "lock": $scope.params.resourceLock
                            },
                            "STORAGE": {
                                "value": $scope.params.storage,
                                "lock": $scope.params.resourceLock
                            },
                            "SEG": {
                                "value": $scope.params.serGroup,
                                "lock": $scope.params.resourceLock
                            },
                            "VPC": {
                                "value": $scope.params.vpcNum,
                                "lock": $scope.params.resourceLock
                            },
                            "EIP": {
                                "value": $scope.params.ipNum,
                                "lock": $scope.params.resourceLock
                            },
                            "cloudInfra": {
                                "lock": $scope.params.networkLock,
                                "value": $scope.params.areaId
                            }
                        };
                        if (serviceId) {
                            modifyServiceVDC(objJSon);
                        } else {
                            createServiceVDC(objJSon);
                        }
                    }
                },
                cancelBtn: {
                    "id": "createServiceVDC-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            function createServiceVDC(objJSon) {
                var options = {
                    "user": user,
                    "serviceTemplateId": templateId,
                    "name": $scope.params.serviceName,
                    "description": $scope.params.desc,
                    "status": "unpublished",
                    "approveType": $scope.params.applyType,
                    "params": JSON.stringify(objJSon),
                    "catalogs": $scope.params.catalogList,
                    "whiteListFlag": false,
                    "vdcWhiteList": $scope.params.whiteList,
                    "iconId": $scope.params.iconId
                };
                var deferred = createServiceIns.createService(options);
                deferred.then(function (data) {
                    $state.go("service.serviceManager");
                });
            }

            function modifyServiceVDC(objJSon) {
                var options = {
                    "user": user,
                    "serviceId": serviceId,
                    "params": {
                        "name": $scope.params.serviceName,
                        "description": $scope.params.desc,
                        "approveType": $scope.serviceInstance.approveType,
                        "params": JSON.stringify(objJSon),
                        "catalogs": $scope.params.catalogList,
                        "whiteListFlag": $scope.serviceInstance.whiteListFlag,
                        "vdcWhiteList": $scope.serviceInstance.vdcWhiteList,
                        "iconId": $scope.params.iconId
                    }
                };
                var deferred = catalogServiceIns.modifyServices(options);
                deferred.then(function (data) {
                    $state.go("service.serviceManager");
                });
            }

            $(document).bind("click.upload", function ($event) {
                $event.stopPropagation();
                var $target = $($event.target);
                if (!$target.hasClass("dropdown-menu") && !$target.parents(".dropdown-menu").length) {
                    $(".dropdown-menu").hide();
                }
            });
            $scope.$on('$destroy', function () {
                $(document).unbind("click.upload");
            });

            function queryService(callback) {
                var options = {
                    "user": user,
                    "id": serviceId
                };
                var deferred = catalogServiceIns.queryServiceOffering(options);

                deferred.then(function (data) {
                    callback && callback(data);
                });
            }

            function initParams(serviceInstance) {

                var serviceInstaceQuota = serviceInstance.params;
                try {
                    serviceInstaceQuota = JSON.parse(serviceInstaceQuota);
                } catch (e) {
                    serviceInstaceQuota = {};
                }
                var getQuotaValue = function (key) {
                    var val = "";
                    if (key) {
                        var item = serviceInstaceQuota[key] || {};
                        val = item["value"] || "";
                    }
                    return val;
                };
                var serviceInstaceQuotaLock = (serviceInstaceQuota["CPU"] && serviceInstaceQuota["CPU"].lock) || "0";
                var serviceInstaceAreaLock = (serviceInstaceQuota["cloudInfra"] && serviceInstaceQuota["cloudInfra"].lock) || "0";
                $scope.serviceInstance= serviceInstance;
                $scope.baseInfo.name.value = serviceInstance.name;
                $scope.baseInfo.logo.curLogo = serviceInstance.serviceImageUrl;
                $scope.baseInfo.description.value = serviceInstance.description;

                $scope.params.resourceLock = serviceInstaceQuotaLock;
                $scope.info.status.values = getTypes({
                    checked: [serviceInstaceQuotaLock == "0", serviceInstaceQuotaLock == "1", serviceInstaceQuotaLock == "2"]
                });
                $scope.info.cpuNumber.value = getQuotaValue("CPU");
                $scope.info.memoryUpperLimit.value = getQuotaValue("MEMORY");
                $scope.info.storage.value = getQuotaValue("STORAGE");
                $scope.info.vpcNumber.value = getQuotaValue("VPC");
                $scope.info.sgNumber.value = getQuotaValue("SEG");
                $scope.info.vmNumber.value = getQuotaValue("VM");
                $scope.info.eipNumber.value = getQuotaValue("EIP");

                $scope.params.networkLock = serviceInstaceAreaLock;
                $scope.zone.appType.values = getTypes({
                    checked: [serviceInstaceAreaLock == "0", serviceInstaceAreaLock == "1", serviceInstaceAreaLock == "2"]
                });
                $scope.params.areaId = getQuotaValue("cloudInfra");
            }
            function initPages() {
                $scope.info.status.values = getTypes({
                    checked: [true, false, false]
                });
                $scope.zone.appType.values = getTypes({
                    checked: [ true, false, false]
                });
            }

            function init(serviceId) {
                if (serviceId) {
                    //编辑
                    $("#createVDCtitle").text(i18n.service_term_modifyVDCservice_label||"修改VDC服务");
                    queryService(function (serviceInstance) {
                        initParams(serviceInstance);
                        queryCatalogs(serviceInstance.catalogs);
                        queryIcons(serviceInstance.serviceImageUrl);
                    });
                } else {
                    //创建
                    $("#createVDCtitle").text(i18n.service_term_addVDCservice_label||"创建VDC服务");
                    initPages();
                    queryCatalogs([]);
                    queryIcons("");
                }
            }

            init(serviceId);
        }];
        return createVdcCtrl;
    }
);