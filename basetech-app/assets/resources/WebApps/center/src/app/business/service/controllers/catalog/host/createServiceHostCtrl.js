/*global define*/
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
    "app/business/service/services/catalog/catalogService",
    "app/business/service/services/service/createService"],
    function ($, angular, Checkbox, Radio, Select, Textbox, Button, Window, Message, UnifyValid, catalogService, createService) {
        "use strict";
        var createStorageCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$q", "validator", "exception", function ($scope, $compile, $state, $stateParams, camel, $q, validator, exception) {
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var createServiceIns = new createService(exception, $q, camel);
            var i18n = $scope.i18n;
            var user = $scope.user;
            var approveType = $stateParams.applyTypeId;
            var templateId = $stateParams.templateId;
            var serviceId = $stateParams.serviceId;
            $scope.cloudType = $scope.user.cloudType === "OPENSTACK" ? "ICT" : "IT";
            var approveTypes = {
                "domain": i18n.service_term_approveBySysadmin_label,
                "vdc": i18n.service_term_approveByVDCadmin_label,
                "none": i18n.service_term_approveNotRequire_label
            };

            $scope.stepUrl = {
                "basicInfo": "../src/app/business/service/views/catalog/host/basicInfo.html",
                "confirmInfo": "../src/app/business/service/views/catalog/host/confirmInfo.html"
            };
            //控制步骤中各页面的显示
            $scope.curStep = "basicInfo";
            $scope.createStep = {
                "id": "createHostStep",
                "title": i18n.service_term_addPhysiServerService_label,
                "values": [
                    i18n.common_term_basicInfo_label,
                    i18n.common_term_confirmInfo_label
                ],
                "width": "800",
                "jumpable": false
            };

            //定义参数体
            $scope.params = {  };
            $scope.confirm = {
                "approveType":approveTypes[approveType]
            };

            //基本信息界面初始化
            $scope.baseInfo = {
                "name": {
                    "id": "createApp-appName",
                    "label": (i18n.common_term_name_label || "名称" ) + ":",
                    "width": 200,
                    "require": true,
                    "value": "",
                    "validate": "regularCheck(" + validator.serviceName + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64") +
                        ";regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                directory: {
                    "id": "createDirectory",
                    label: (i18n.service_term_catalog_label || "服务目录") + ":",
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
                            "title": i18n.common_term_uploadLocalPic_button || "上传图片",
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
                    "label": (i18n.common_term_desc_label || "描述") + ":",
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
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                },
                nextBtn: {
                    "id": "create-service-basicInfo-next",
                    "text": i18n.common_term_next_button || "下一步",
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createHostBasicInfo"));
                        if (!valid) {
                            return;
                        }
                        $scope.params.catalogList = $("#" + $scope.baseInfo.directory.id).widget().getSelectedId();
                        $scope.confirm.catalog = $("#" + $scope.baseInfo.directory.id).widget().getSelectedLabel();
                        $scope.params.name = $("#" + $scope.baseInfo.name.id).widget().getValue();
                        $scope.params.desc = $("#" + $scope.baseInfo.description.id).widget().getValue();
                        $scope.confirm.directory = $("#" + $scope.baseInfo.directory.id).widget().getSelectedLabel();
                        $("#" + $scope.createStep.id).widget().next();
                        $scope.curStep = "confirmInfo";
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
            // 查询服务目录
            function queryCatalogs() {
                var catalogs = ($scope.serviceInstance && $scope.serviceInstance.catalogs) || [];
                var deferred = catalogServiceIns.queryCatalogs({"user": user});
                deferred.then(function (data) {
                    var SPER = "@";
                    var selectedCatalogsFormat = catalogs.length ? (SPER + catalogs.join(SPER) + SPER) : "";
                    data = data || {catalogs: []};
                    var allCatalogs = data.catalogs || [];
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
            }

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
                        var icon = "";
                        if (serviceImageUrl) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i].imageUrl == serviceImageUrl) {
                                    icon = list[i];
                                    break;
                                }
                            }
                        }
                        else {
                            icon = list[0]
                        }
                        $scope.baseInfo.logo.curLogo = icon.imageUrl;
                        $scope.params.iconId = icon.id;
                    }
                });
            }

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
            }

            // 确认界面
            $scope.confirmInfo = {
                serviceName: {
                    "id": "confirmServiceName",
                    "label": (i18n.service_term_serviceName_label || "服务名称") + ":",
                    "value": ""
                },
                serviceCatalog: {
                    "id": "confirmServiceCatalog",
                    "label": (i18n.service_term_catalog_label || "服务目录") + ":",
                    "value": ""
                },
                description: {
                    "id": "confirmDescription：",
                    "label": (i18n.common_term_desc_label || "描述") + ":",
                    "value": ""
                },
                approveType: {
                    "id": "confirmApproveType",
                    "label": (i18n.service_term_approveType_label || "审批类型") + ":",
                    "value": ""
                },
                preBtn: {
                    "id": "createConfirmInfo-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.createStep.id).widget().pre();
                        $scope.curStep = "basicInfo";
                    }
                },
                addBtn: {
                    "id": "createStorageService-next",
                    "text": serviceId ? i18n.common_term_save_label : i18n.common_term_create_button,
                    "click": function () {
                        if (serviceId) {
                            modifyServiceHost();
                        } else {
                            createServiceHost();
                        }
                    }
                },
                cancelBtn: {
                    "id": "createConfirmInfo-cancel",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            function modifyServiceHost() {
                var options = {
                    "user": user,
                    "serviceId": serviceId,
                    "params": {
                        "name": $scope.params.name,
                        "description": $scope.params.desc,
                        "approveType": approveType,
                        "params": "{}",
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

            //创建主机服务
            function createServiceHost() {
                var options = {
                    "user": user,
                    "serviceTemplateId": templateId,
                    "name": $scope.params.name,
                    "description": $scope.params.desc,
                    "status": "unpublished",
                    "approveType": approveType,
                    "params": "{}",
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

            function stringToJson(params) {
                var serviceInstaceQuota = null;
                try {
                    serviceInstaceQuota = JSON.parse(params);
                } catch (e) {
                }
                return serviceInstaceQuota;
            }

            function initParams(serviceInstance) {
                $scope.serviceInstance = serviceInstance;
                approveType = serviceInstance.approveType;

                //基本信息
                $scope.params.name = serviceInstance.name;
                $scope.params.description = serviceInstance.description;
                $scope.baseInfo.logo.curLogo = serviceInstance.serviceImageUrl;
            }

            function init(serviceId) {
                if (serviceId) {
                    $scope.createStep.title = i18n.service_term_modifyPhysiServerService_label;
                    //编辑
                    queryService(function (serviceInstance) {
                        initParams(serviceInstance);
                        queryCatalogs(serviceInstance.catalogs);
                        queryIcons($scope.baseInfo.logo.curLogo);
                    });
                } else {
                    //创建
                    $scope.createStep.title = i18n.service_term_addPhysiServerService_label;
                    queryCatalogs();
                    queryIcons(null);
                }
            }

            init(serviceId);
        }];
        return createStorageCtrl;
    });