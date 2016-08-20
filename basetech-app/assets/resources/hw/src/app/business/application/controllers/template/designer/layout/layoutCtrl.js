define([
    "tiny-lib/jquery",
    "tiny-lib/jquery.base64",
    "../framework/Constant",
    "../framework/resource",
    "../framework/OSVersions",
    "tiny-lib/underscore",
    "/app/business/application/services/desiger/desigerService",
    "../framework/CoreGraph",
    "../framework/Sidebar",
    "tiny-widgets/Window",
    "../framework/plugins",
    "bootstrap/bootstrap.min",
], function ($, $jBase, Constant, $rs, OS, _, desigerService,CoreGraph, Sidebar, Window) {
    "use strict";

    var ctrl = ["$rootScope", "$window","$scope", "$compile", "$q", "$timeout", "$state", "$stateParams",
        function ($rootScope, $window, $scope, $compile, $q, $timeout, $state, $stateParams) {
            //公共对象
            var graph = new CoreGraph();
            graph.template = new TemplateDefine();
            window.graph = graph;
            var keyHandler = graph.createKeyHandler();
            $scope.getKeyHandler = function () {
                return keyHandler;
            };

            var i18n = $scope.i18n;
            $scope.graph = graph;
            //左侧栏
            $scope.sidebar = new Sidebar(graph);
            $scope.elements = {
                network: {
                    "src": "../theme/default/images/icon-network.png",
                    "title": "网络"
                },
                template: {
                    "src": "../theme/default/images/icon-vm.png",
                    "title": "虚拟机"
                },
                software: {
                    "src": "../theme/default/images/icon-software.png",
                    "title": "软件"
                },
                script: {
                    "src": "../theme/default/images/icon-script.png",
                    "title": "脚本"
                }
            };

            //应用模板的图标初始化
            $scope.initAppTemplate = function () {
                var getImage = function (index) {
                    var src = "/resources/hw/theme/default/images/gm/appImage/buff0" + index + ".jpg";
                    return {
                        "src": src,
                        "click": function () {
                            $scope.designerCell.icon.icon = src;
                            $scope.designerCell.value.icon = "buff0" + index + ".jpg";
                        }
                    };
                };

                var template = $scope.graph.template;
                var icon = template.properties.icon || "buff01.jpg";
                $scope.designerCell.value = {
                    "name": template.getTemplateName(),
                    "icon": icon,
                    "description": template.getDescription()
                };
                var images = [];
                for (var index = 1; index < 10; index++) {
                    images.push(getImage(index));
                }
                $scope.designerCell.icon.icon = "/resources/hw/theme/default/images/gm/appImage/" + icon;
                $scope.designerCell.icon.imgs = images;

            };

            $scope.params = {
                "appId": $scope.id,
            };
            $scope.serviceSrv = new desigerService(exception, $q, camel);
            $scope.queryAppTemplate = function (templateId) {
                var promise = $scope.serviceSrv.queryAppTemplate({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "id": templateId
                });
                promise.then(function (data) {
                    $scope.graph.template.id = templateId;
                    if (!data) {
                        return;
                    }
                    $scope.graph.template.rebuildGraph($.base64.decode(data.body || "", true), true, $scope.graph);
                    var deploys = $scope.graph.template.getParameters().properties;
                    var deploysValue = [];
                    var key = null;
                    for (key in deploys) {
                        if (!deploys.hasOwnProperty(key)) {
                            continue;
                        }
                        if (!deploys[key] || deploys[key].type !== Constant.PARAMETERDEFINETYPE) {
                            continue;
                        }
                        deploysValue.push({
                            "id": key,
                            "parameterName": deploys[key].properties.parameterName,
                            "type": deploys[key].properties.type,
                            "defaultValue": deploys[key].properties.defaultValue,
                            "description": deploys[key].properties.description
                        });
                    }
                    var outputs = $scope.graph.template.getOutputs().properties;
                    var outputsValue = [];
                    for (key in outputs) {
                        if (!outputs.hasOwnProperty(key)) {
                            continue;
                        }
                        if (!outputs[key] || outputs[key].type !== Constant.OUTPUTDEFINETYPE) {
                            continue;
                        }
                        outputsValue.push({
                            "id": key,
                            "outputName": outputs[key].properties.outputName,
                            "value": outputs[key].properties.value,
                            "description": outputs[key].properties.description
                        });
                    }
                    $scope.designerCell.icon.icon = "../theme/default/images/gm/appImage/" + data.picture;
                    $scope.designerCell.value = {
                        name: data.name,
                        icon: data.picture,
                        description: data.desc,
                        deploys: deploysValue,
                        outputs: outputsValue
                    };
                    $timeout(function () {
                        $scope.operate(null);
                    }, 500);
                });
            };

            $scope.createAppTemplate = function (options) {
                var deferred = $scope.serviceSrv.createAppTemplate({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "data": options
                });
                deferred.then(function (data) {
                    if (!data) {
                        message.failMsgBox(i18n.app_term_templateCreateFail_msg);
                        return;
                    }
                    message.okMsgBox(i18n.app_term_templateCreateSucceed_msg);
                    $scope.graph.template.id = data.templateId;
                });
            };
            $scope.updateAppTemplate = function (options) {
                var deferred = $scope.serviceSrv.updateAppTemplate({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "id": options.id,
                    "data": options.data
                });
                deferred.then(function (data) {
                    message.okMsgBox(i18n.app_term_templateUpdateSucceed_msg);
                });
            };

            $scope.enableIcon = {
                addIcon: "../theme/default/images/design-add.png",
                modifyIcon: "../theme/default/images/design-modify.png",
                deleteIcon: "../theme/default/images/design-delete.png"
            };
            $scope.designerCell = {
                icon: {
                    id: "designerCell-cell-icon",
                    label: i18n.common_term_icon_label+":",
                    require: true,
                    "width": "240px",
                    "icon": "",
                    "imgs": [],
                    "validate": "required:"+i18n.common_term_null_valid+";"
                },
                name: {
                    id: "designerCell-cell-name",
                    label: i18n.common_term_name_label+":",
                    width: "130px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.templateName,
                    "extendFunction": ["templateName"],
                    "validate": UnifyValid.validateInfo.getRequiredTemplateName(),
                    "blur": function () {
                        $scope.designerCell.value.name = $("#designerCell-cell-name").widget().getValue();
                    }
                },
                description: {
                    "id": "designerCell-cell-description",
                    "label": i18n.common_term_desc_label+":",
                    "width": "130px",
                    "height": "50px",
                    "type": "multi",
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    "require": false,
                    "blur": function () {
                        $scope.designerCell.value.description = $("#designerCell-cell-description").widget().getValue();
                    }
                },
                deploy: {
                    label: i18n.common_term_sharePara_label+":",
                    require: false
                },
                outputPrm: {
                    label: i18n.common_term_outputPara_label+":",
                    require: false
                },
                value: {
                    name: "",
                    icon: "",
                    description: "",
                    deploys: [],
                    outputs: []
                }
            };
            $scope.initAppTemplate();
            $scope.networkCell = {
                name: {
                    id: "network-cell-name",
                    label: i18n.common_term_name_label+":",
                    width: "130px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getRequiredName(),
                    "blur": function () {
                        $scope.networkCell.value.name = $("#network-cell-name").widget().getValue();
                    }
                },
                description: {
                    id: "network-cell-description",
                    label: i18n.common_term_desc_label+":",
                    width: "130px",
                    "height": "50px",
                    "type": "multi",
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    require: false,
                    blur: function () {
                        $scope.networkCell.value.description = $("#network-cell-description").widget().getValue();
                    }
                },
                value: {
                    name: "",
                    description: ""
                }
            };
            $scope.templateCell = {
                osType: {
                    label: i18n.common_term_OStype_label+":",
                    require: true,
                    "id": "template-cell-ostype",
                    "width": "140px",
                    "height": "230px",
                    "validate": "required:"+i18n.common_term_null_valid+";",
                    "values": [],
                    "change": function () {
                        var type = $("#template-cell-ostype").widget().getSelectedId();
                        var versions = OS.getOSVersions(type);
                        $scope.templateCell.osVersion.values = versions;
                        var version = _.find(versions, function (item) {
                            return item.checked === true;
                        });
                        var cell = $scope.graph.getSelectionCell();
                        if (cell) {
                            cell.resource.properties.oSType = type;
                            cell.resource.properties.oSVersion = version.selectId;
                        }
                    }
                },
                osVersion: {
                    label: i18n.common_term_OSversion_label+":",
                    require: true,
                    "id": "template-cell-osVersion",
                    "height": "260px",
                    "width": "140px",
                    "values": [],
                    "validate": "required:"+i18n.common_term_null_valid+";",
                    "change": function () {
                        var version = $("#template-cell-osVersion").widget().getSelectedId();
                        var cell = $scope.graph.getSelectionCell();
                        if (cell) {
                            cell.resource.properties.oSVersion = version;
                        }
                    }
                },
                name: {
                    id: "template-cell-name",
                    label: i18n.common_term_name_label+":",
                    width: "130px",
                    "height": "260px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getRequiredName(),
                    blur: function () {
                        $scope.templateCell.value.name = $("#template-cell-name").widget().getValue();
                    }
                },
                description: {
                    id: "template-cell-description",
                    label: i18n.common_term_desc_label+":",
                    width: "130px",
                    "height": "50px",
                    "type": "multi",
                    require: false,
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    blur: function () {
                        $scope.templateCell.value.description = $("#template-cell-description").widget().getValue();
                    }
                },
                computerName: {
                    id: "template-cell-computerName",
                    label: i18n.common_term_computerName_label+":",
                    width: "130px",
                    require: false,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getName(),
                    blur: function () {
                        $scope.templateCell.value.computerName = $("#template-cell-computerName").widget().getValue();
                    }
                },
                updateType: {
                    label: i18n.common_term_updateMode_label+":",
                    require: false,
                    "id": "template-cell-updateType",
                    "width": "140px",
                    "values": [{
                        "selectId": "auto",
                        "label": i18n.common_term_auto_label
                    }, {
                        "selectId": "manual",
                        "label":i18n.common_term_manual_label
                    }],
                    "change": function () {
                        var updateType = $("#template-cell-updateType").widget().getSelectedId();
                        var cell = $scope.graph.getSelectionCell();
                        if (cell) {
                            cell.resource.properties.updateMode = updateType;
                        }
                    }
                },
                transplantType: {
                    label: i18n.vm_term_basicBlockLiveMig_label+":",
                    require: false,
                    "id": "template-cell-transplantType",
                    "width": "140px",
                    "values": [{
                        "selectId": "unSupport",
                        "label": i18n.common_term_notSupport_value
                    }, {
                        "selectId": "support",
                        "label": i18n.common_term_support_value
                    }],
                    "change": function () {
                        var transplantType = $("#template-cell-transplantType").widget().getSelectedId();
                        var cell = $scope.graph.getSelectionCell();
                        if (cell) {
                            cell.resource.properties.blockHeatTranfer = transplantType;
                        }
                    }
                },
                nics: {
                    label: i18n.common_term_NIClist_label+":",
                    require: false
                },
                initCommands: {
                    label: i18n.common_term_initializtionCmd_label+":"
                },
                startCommands: {
                    label: i18n.common_term_startupCmd_label+":"
                },
                stopCommands: {
                    label: i18n.common_term_StopCmd_label+":"
                },
                scalinggroup: {
                    "label": i18n.app_term_flexGroup_label+":",
                    "name": {
                        "id": "scalinggroup-name",
                        "label": i18n.common_term_name_label+":",
                        "width": "130px",
                        "require": true,
                        "tooltip": UnifyValid.validateInfo.name,
                        "extendFunction": ["name"],
                        "validate": UnifyValid.validateInfo.getRequiredName(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.name = $("#scalinggroup-name").widget().getValue();
                        }
                    },
                    "description": {
                        "id": "scalinggroup-description",
                        "label": i18n.common_term_desc_label+":",
                        "width": "130px",
                        "require": false,
                        "tooltip": UnifyValid.validateInfo.description,
                        "extendFunction": ["description"],
                        "validate": UnifyValid.validateInfo.getDescription(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.description = $("#scalinggroup-description").widget().getValue();
                        }
                    },
                    "max": {
                        "id": "scalinggroup-max",
                        "label": i18n.app_term_vmMaxNum_label+":",
                        "width": "130px",
                        "require": true,
                        "tooltip": UnifyValid.validateInfo.maximumSize,
                        "extendFunction": ["maximumSize"],
                        "validate": UnifyValid.validateInfo.getMaximumSize(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.maxSize = $("#scalinggroup-max").widget().getValue();
                        }
                    },
                    "min": {
                        "id": "scalinggroup-min",
                        "label": i18n.app_term_vmMinNum_label+":",
                        "width": "130px",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.minimumSize,
                        "extendFunction": ["minimumSize"],
                        "validate": UnifyValid.validateInfo.getMinimumSize(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.minSize = $("#scalinggroup-min").widget().getValue();
                        }
                    },
                    "desiredCapacity": {
                        "id": "scalinggroup-desiredCapacity",
                        "label": i18n.app_term_vmRunMinNum_label+":",
                        "width": "130px",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.desiredCapacity,
                        "extendFunction": ["desiredCapacity"],
                        "validate": UnifyValid.validateInfo.getDesiredCapacity(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.desiredCapacity = $("#scalinggroup-desiredCapacity").widget().getValue();
                        }
                    },
                    "cooldown": {
                        "id": "scalinggroup-cooldown",
                        "label": i18n.app_term_coolingTimeMinu_label+":",
                        "width": "130px",
                        require: true,
                        "tooltip": UnifyValid.validateInfo.coolTime,
                        "extendFunction": ["coolTime"],
                        "validate": UnifyValid.validateInfo.getCoolTime(),
                        "blur": function () {
                            $scope.templateCell.scalinggroup.value.cooldown = $("#scalinggroup-cooldown").widget().getValue();
                        }
                    },
                    "scalingPolicies": {
                        "label": i18n.app_term_intraPolicy_label
                    },
                    "addScalingPolicy": function () {
                        $scope.addScalingPolicyUI("create");
                    },
                    "getActionTypeName": function (type) {
                        if (type === "SCALEOUT" || type === "SCALEIN") {
                            return $scope.i18n.common_term_default_label;
                        } else if (type === "POWER") {
                            return $scope.i18n.common_term_startup_button;
                        } else if (type === "AWAKE") {
                            return $scope.i18n.common_term_awaken_button;
                        } else if (type === "CREATE") {
                            return $scope.i18n.common_term_create_button;
                        } else if (type === "HALT") {
                            return $scope.i18n.common_term_shut_value;
                        } else if (type === "SLEEP") {
                            return $scope.i18n.common_term_hibernate_button;
                        } else if (type === "REMOVE") {
                            return $scope.i18n.common_term_delete_button;
                        } else {
                            return $scope.i18n.common_term_default_label;
                        }
                    },
                    "value": {
                        "name": "",
                        "description": "",
                        "maxSize": "",
                        "minSize": "",
                        "desiredCapacity": "",
                        "cooldown": "",
                        "scalingPolicies": []
                    }
                },
                value: {
                    name: "",
                    description: "",
                    computerName: "",
                    osType: "",
                    osVersion: "",
                    updateType: "1",
                    transplantType: "1",
                    nic: [],
                    initCommands: [],
                    startCommands: [],
                    stopCommands: []
                }
            };
            $scope.softwareCell = {
                name: {
                    id: "software-cell-name",
                    label: i18n.common_term_name_label+":",
                    width: "130px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getRequiredName(),
                    "blur": function (type) {
                        var name = $("#software-cell-name").widget().getValue();
                        if (type === "software") {
                            $scope.softwareCell.softwareValue.name = name;
                        } else {
                            $scope.softwareCell.scriptValue.name = name;
                        }
                    }
                },
                description: {
                    "id": "software-cell-description",
                    "label": i18n.common_term_desc_label+":",
                    "width": "130px",
                    "height": "50px",
                    "type": "multi",
                    "require": false,
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    "blur": function (type) {
                        var description = $("#software-cell-description").widget().getValue();
                        if (type === "software") {
                            $scope.softwareCell.softwareValue.description = description;
                        } else {
                            $scope.softwareCell.scriptValue.description = description;
                        }
                    }
                },
                version: {
                    "id": "software-cell-version",
                    "label": i18n.common_term_version_label+":",
                    "width": "130px",
                    "height": "50px",
                    "require": false,
                    "blur": function (type) {
                        var version = $("#software-cell-version").widget().getValue();
                        if (type === "software") {
                            $scope.softwareCell.softwareValue.version = version;
                        } else {
                            $scope.softwareCell.scriptValue.version = version;
                        }
                    }
                },
                softwareValue: {
                    name: "",
                    description: "",
                    version: ""
                },
                scriptValue: {
                    name: "",
                    description: "",
                    version: ""
                }
            };
            $scope.nicToTemplateCell = {
                nicName: {
                    "id": "nic-to-template-cell-nicName",
                    "width": "140px",
                    "values": [],
                    "change": function () {}
                },
                networkName: ""
            };

            $scope.info = {
                "designerPage": "app/business/application/views/template/designer/layout/designerCell.html",
                "designerShow": true,
                "templatePage": "app/business/application/views/template/designer/layout/templateCell.html",
                "templateShow": false,
                "networkPage": "app/business/application/views/template/designer/layout/networkCell.html",
                "networkShow": false,
                "scriptPage": "app/business/application/views/template/designer/layout/scriptCell.html",
                "scriptShow": false,
                "softwarePage": "app/business/application/views/template/designer/layout/softwareCell.html",
                "softwareShow": false,
                "nicToTempPage": "app/business/application/views/template/designer/layout/nicToTemplateCell.html",
                "nicToTempShow": false,
                "backBtn": {
                    "id": "app-design-back-btn",
                    "text": i18n.common_term_return_button,
                    "click": function () {
                        setTimeout(function () {
                            $window.history.back();
                        }, 0);
                    }
                },
                "saveBtn": {
                    "id": "app-design-save-btn",
                    "text": i18n.common_term_save_label,
                    "click": function () {
                        var valid = $scope.validDesignerCell();
                        if(!valid) {
                            return;
                        }
                        var name = $scope.graph.template.getTemplateName();
                        if (!name || name === "") {
                            $scope.graph.clearSelection();
                            return;
                        }
                        $scope.graph.template.generateResourceGraph($scope.graph);
                        if ($scope.graph.template.id) {
                            $scope.updateAppTemplate({
                                "id": $scope.graph.template.id,
                                "vdcId": $scope.params.vdcId,
                                "data": {
                                    "name": $scope.graph.template.getTemplateName(),
                                    "picture": $scope.graph.template.properties.icon,
                                    "desc": $scope.graph.template.getDescription(),
                                    "body": $.base64.encode($scope.graph.template.toJson(), true)
                                }
                            });
                            return;
                        }
                        $scope.createAppTemplate({
                            "name": $scope.graph.template.getTemplateName(),
                            "picture": $scope.graph.template.properties.icon,
                            "resPoolType": "FusionManager",
                            "desc": $scope.graph.template.getDescription(),
                            "body": $.base64.encode($scope.graph.template.toJson(), true)
                        });
                    }
                },
                "validateBtn": {
                    "id": "app-design-validate-btn",
                    "text": i18n.app_term_checkout_button,
                    "click": function () {
                        $scope.graph.template.generateResourceGraph($scope.graph);
                        var deferred = $scope.serviceSrv.validAppTemplate({
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "data": {
                                "templateBody": $.base64.encode($scope.graph.template.toJson(), true),
                                "resPoolType": "FusionManager"
                            }
                        });
                        deferred.then(function (data) {
                            message.okMsgBox(i18n.app_term_templateCheckSucceed_msg);
                        });
                    }
                }
            };
            $scope.$watch("designerCell.value.name", function (newV, oldV) {
                var name = $.trim(newV);
                if ((!/^[\u4e00-\u9fa5A-Za-z0-9-_ ]*$/.test(name)) || name.length < 1 || name.length > 256) {
                    return false;
                }
                $scope.graph.template.properties.templateName = name;
                $scope.designerCell.value.name = name;
            });
            $scope.$watch("designerCell.value.icon", function (newV, oldV) {
                var icon = $.trim(newV);
                if (!/^[\s\S]{0,1024}$/.test(icon)) {
                    return false;
                }
                $scope.graph.template.properties.icon = icon;
            });
            $scope.$watch("designerCell.value.description", function (newV, oldV) {
                var description = $.trim(newV);
                if (!/^[\s\S]{0,1024}$/.test(description)) {
                    return false;
                }
                $scope.graph.template.properties.description = description;
                $scope.designerCell.value.description = description;
            });

            //重载 选中节点后的处理函数
            CoreGraph.prototype._selectCellHandle = function (sender, evt) {
                $scope.$$watchers = _.filter($scope.$$watchers, function (item, index) {
                    if (item.exp == "templateCell.value.name" ||
                        item.exp == "templateCell.value.description" ||
                        item.exp == "templateCell.value.computerName" ||
                        item.exp == "templateCell.scalinggroup.value.name" ||
                        item.exp == "templateCell.scalinggroup.value.description" ||
                        item.exp == "templateCell.scalinggroup.value.maxSize" ||
                        item.exp == "templateCell.scalinggroup.value.minSize" ||
                        item.exp == "templateCell.scalinggroup.value.desiredCapacity" ||
                        item.exp == "templateCell.scalinggroup.value.cooldown" ||
                        item.exp == "networkCell.value.name" ||
                        item.exp == "networkCell.value.description" ||
                        item.exp == "softwareCell.softwareValue.name" ||
                        item.exp == "softwareCell.softwareValue.description" ||
                        item.exp == "softwareCell.softwareValue.version" ||
                        item.exp == "softwareCell.scriptValue.name" ||
                        item.exp == "softwareCell.scriptValue.description" ||
                        item.exp == "softwareCell.scriptValue.version") {
                        return false;
                    }
                    return true;
                });
                var key = null;
                if (this.getSelectionCount() !== 1) {
                    $scope.showDetailPage("designer");
                    var outputs = this.template.getOutputs().properties;
                    var outputsValues = [];
                    for (key in outputs) {
                        if (!outputs.hasOwnProperty(key)) {
                            continue;
                        }
                        outputsValues.push({
                            "id": key,
                            "value": outputs[key].properties.value,
                            "outputName": outputs[key].properties.outputName,
                            "description": outputs[key].properties.description
                        });
                    }
                    var parameters = this.template.getParameters().properties;
                    var parametersValues = [];
                    for (key in parameters) {
                        if (!parameters.hasOwnProperty(key)) {
                            continue;
                        }
                        parametersValues.push({
                            "id": key,
                            "parameterName": parameters[key].properties.parameterName,
                            "type": parameters[key].properties.type,
                            "defaultValue": parameters[key].properties.defaultValue,
                            "description": parameters[key].properties.description
                        });
                    }
                    $scope.designerCell.value = {
                        name: this.template.properties.templateName,
                        icon: this.template.properties.icon,
                        description: this.template.properties.description,
                        outputs: outputsValues,
                        deploys: parametersValues
                    };
                    $timeout(function() {
                        $scope.validDesignerCell();
                        $scope.operate(null);
                    },200);
                    $scope.$digest();
                    return;
                }

                var cell = this.getSelectionCell();

                // 选中是一个节点
                if (cell.isVertex()) {
                    var type = cell.type;
                    if (type === "VmTemplate" || type === "ScalingGroup") {
                        $scope.showDetailPage("template");
                        $scope.isScallingGroup = (type === "ScalingGroup" ? true : false);
                        var nics = cell.resource.getNics().properties;
                        var nicValues = [];
                        var changeVlb = function (id) {
                            nics[id].vlb = (nics[id].vlb + "" !== "true") + "";
                        };
                        for (key in nics) {
                            if (!nics[key] || nics[key].type !== Constant.NICTYPE) {
                                continue;
                            }
                            var networkName = "";
                            var refId = nics[key].portGroupId.refId;
                            if (refId) {
                                networkName = this.template.getResourceById(refId).getName();
                            }
                            nicValues.push({
                                "id": key,
                                "nicName": nics[key].name,
                                "networkName": networkName,
                                "vlb": (nics[key].vlb + "" === "true"),
                                "systemDefault": nics[key].systemDefault,
                                "change": changeVlb
                            });
                        }

                        var initCommands = cell.resource.getPostCommands().properties;
                        var initCmdValues = [];
                        for (key in initCommands) {
                            //将表格显示到页面上
                            initCmdValues.push({
                                "id": key,
                                "value": initCommands[key]
                            });
                        }
                        var startCommands = cell.resource.getStartCommands().properties;
                        var startCmdValues = [];
                        for (key in startCommands) {
                            //将表格显示到页面上
                            startCmdValues.push({
                                "id": key,
                                "value": startCommands[key]
                            });
                        }
                        var stopCommands = cell.resource.getStopCommands().properties;
                        var stopCmdValues = [];
                        for (key in stopCommands) {
                            //将表格显示到页面上
                            stopCmdValues.push({
                                "id": key,
                                "value": stopCommands[key]
                            });
                        }
                        var osType = cell.resource.properties.oSType;
                        var osTypes = OS.getOSTypes(osType);
                        osType = $scope.getOsTypeOrVersion(osType, osTypes);
                        var osVersion = cell.resource.properties.oSVersion;
                        var osVersions = OS.getOSVersions(osType, osVersion);
                        osVersion = $scope.getOsTypeOrVersion(osVersion, osVersions);

                        cell.resource.properties.oSType = osType;
                        cell.resource.properties.oSVersion = osVersion;

                        var updateModeSrc = cell.resource.properties.updateMode;
                        var transplantTypeSrc = cell.resource.properties.blockHeatTranfer;
                        $scope.templateCell.value = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description,
                            computerName: cell.resource.properties.computerName,
                            osType: osType,
                            osVersion: osVersion,
                            updateType: updateModeSrc,
                            transplantType: transplantTypeSrc,
                            nics: nicValues,
                            initCommands: initCmdValues,
                            startCommands: startCmdValues,
                            stopCommands: stopCmdValues
                        };
                        $scope.templateCell.osType.values = osTypes;
                        $scope.templateCell.osVersion.values = osVersions;
                        $scope.templateCell.updateType.values = getVMUpdateType(updateModeSrc);
                        $scope.templateCell.transplantType.values = getVMTransplantType(transplantTypeSrc);
                        $scope.$watch("templateCell.value.name", mxUtils.bind(this, function (newV, oldV) {
                            var name = newV;
                            if (/^\s*[\u4E00-\u9FA5-a-zA-Z_0-9]*(\s)*$/.test(name) && name.length > 1 && name.length < 64) {
                                var isExit = this.template.isExistResourceName(name, cell.resourceId);
                                if (!isExit) {
                                    // 同步画布中资源的名称
                                    this.updateCellName(name, cell);
                                    cell.resource.properties.name = name;
                                }
                            }
                        }));
                        $scope.$watch("templateCell.value.description", mxUtils.bind(this, function (newV, oldV) {
                            var description = newV;
                            if (/^[\s\S]{0,1024}$/.test(description)) {
                                cell.resource.properties.description = description;
                            }
                        }));
                        $scope.$watch("templateCell.value.computerName", mxUtils.bind(this, function (newV, oldV) {
                            var computerName = newV;
                            if (!(/^[a-zA-Z0-9\-]{0,15}$/.test(computerName) && !/^[0-9]{0,15}$/.test(computerName)) || computerName.length > 15) {
                                return;
                            }
                            cell.resource.properties.computerName = computerName;
                        }));
                        if ($scope.isScallingGroup) {
                            $scope.templateCell.scalinggroup.value = {
                                "name": cell.scalinggroup.getName(),
                                "description": cell.scalinggroup.properties.description,
                                "maxSize": cell.scalinggroup.getMaxSize(),
                                "minSize": cell.scalinggroup.getMinSize(),
                                "desiredCapacity": cell.scalinggroup.getDesiredCapacity(),
                                "cooldown": cell.scalinggroup.getCooldown(),
                                "scalingPolicies": cell.scalinggroup.getScalingPolicies().getArray()
                            };
                            $scope.$watch("templateCell.scalinggroup.value.name", mxUtils.bind(this, function (newV, oldV) {
                                var name = $.trim(newV);
                                if (!/^\s*[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]*$/.test(name) || name.length < 1 || name.length > 64) {
                                    return false;
                                }
                                cell.scalinggroup.setName(name, false);
                            }));
                            $scope.$watch("templateCell.scalinggroup.value.description", mxUtils.bind(this, function (newV, oldV) {
                                var description = $.trim(newV);
                                if (!/^[\s\S]{0,1024}$/.test(description)) {
                                    return false;
                                }
                                cell.scalinggroup.properties.description = description;
                            }));
                            $scope.$watch("templateCell.scalinggroup.value.maxSize", mxUtils.bind(this, function (newV, oldV) {
                                var maxSize = $.trim(newV);
                                if (!/^[1-9]\d*$/.test(maxSize)) {
                                    return false;
                                }
                                var maxSizeValue = parseInt(maxSize);
                                if (maxSizeValue > 200) {
                                    return false;
                                }
                                var minSize = $scope.templateCell.scalinggroup.value.minSize;
                                var minSizeValue = parseInt(minSize);
                                var desireValue = $scope.templateCell.scalinggroup.value.desiredCapacity;
                                if (minSizeValue <= maxSizeValue && maxSizeValue >= desireValue) {
                                    cell.scalinggroup.setMaxSize(maxSize);
                                }
                            }));
                            $scope.$watch("templateCell.scalinggroup.value.minSize", mxUtils.bind(this, function (newV, oldV) {
                                var minSize = $.trim(newV);
                                if (!/^[1-9]\d*$/.test(minSize)) {
                                    return false;
                                }
                                var minSizeValue = parseInt(minSize);
                                if (minSizeValue > 200) {
                                    return false;
                                }
                                var maxSize = $scope.templateCell.scalinggroup.value.maxSize;
                                var desireValue = $scope.templateCell.scalinggroup.value.desiredCapacity;
                                var maxSizeValue = parseInt(maxSize);
                                if (minSizeValue <= maxSizeValue) {
                                    cell.scalinggroup.setMinSize(minSize);
                                }
                            }));
                            $scope.$watch("templateCell.scalinggroup.value.desiredCapacity", mxUtils.bind(this, function (newV, oldV) {
                                var desiredCapacity = $.trim(newV);
                                if (!/^[1-9]\d*$/.test(desiredCapacity)) {
                                    return false;
                                }
                                var desireValue = parseInt(desiredCapacity);
                                var maxValue = $scope.templateCell.scalinggroup.value.maxSize;
                                var minSize = $scope.templateCell.scalinggroup.value.minSize;
                                if (desireValue > maxValue) {
                                    return false;
                                }
                                cell.scalinggroup.setDesiredCapacity(desireValue);
                            }));
                            $scope.$watch("templateCell.scalinggroup.value.cooldown", mxUtils.bind(this, function (newV, oldV) {
                                var cooldown = $.trim(newV);
                                var cooldownValue = parseInt(cooldown);
                                if ((!/^[1-9]\d*$/.test(cooldown) && cooldown !== "0") || cooldownValue > 30) {
                                    return false;
                                }
                                cell.scalinggroup.setCooldown(cooldownValue);
                            }));
                        }
                    } else if (type === "Network") {
                        $scope.showDetailPage("network");
                        $scope.networkCell.value = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description
                        };
                        $scope.$watch("networkCell.value.name", mxUtils.bind(this, function (newV, oldV) {
                            var name = newV;
                            if (/^\s*[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]*$/.test(name) && name.length > 1 && name.length < 64) {
                                var isExit = this.template.isExistResourceName(name, cell.resourceId);
                                if (!isExit) {
                                    // 同步画布中资源的名称
                                    this.updateCellName(name, cell);
                                    cell.resource.properties.name = name;
                                }
                            }
                        }));
                        $scope.$watch("networkCell.value.description", mxUtils.bind(this, function (newV, oldV) {
                            var description = newV;
                            if (/^[\s\S]{0,1024}$/.test(description)) {
                                cell.resource.properties.description = description;
                            }
                        }));

                    } else if (type === "Software") {
                        $scope.showDetailPage("software");
                        $scope.softwareCell.softwareValue = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description,
                            version: cell.resource.properties.version
                        };
                        $scope.$watch("softwareCell.softwareValue.name", mxUtils.bind(this, function (newV, oldV) {
                            var name = newV;
                            if (/^\s*[a-zA-Z](\w|\s)*$/.test(name) && name.length > 1 && name.length < 64) {
                                var isExit = this.template.isExistResourceName(name, cell.resourceId);
                                if (!isExit) {
                                    // 同步画布中资源的名称
                                    this.updateCellName(name, cell);
                                    cell.resource.properties.name = name;
                                }
                            }
                        }));
                        $scope.$watch("softwareCell.softwareValue.description", mxUtils.bind(this, function (newV, oldV) {
                            var description = newV;
                            if (/^[\s\S]{0,1024}$/.test(description)) {
                                cell.resource.properties.description = description;
                            }
                        }));
                        $scope.$watch("softwareCell.softwareValue.version", mxUtils.bind(this, function (newV, oldV) {
                            var version = newV;
                            if (/^[\s\S]{0,1024}$/.test(version)) {
                                cell.resource.properties.version = version;
                            }
                        }));
                    } else if (type === "Script") {
                        $scope.showDetailPage("script");
                        $scope.softwareCell.scriptValue = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description,
                            version: cell.resource.properties.version
                        };
                        $scope.$watch("softwareCell.scriptValue.name", mxUtils.bind(this, function (newV, oldV) {
                            var name = newV;
                            if (/^\s*[a-zA-Z](\w|\s)*$/.test(name) && name.length > 1 && name.length < 64) {
                                var isExit = this.template.isExistResourceName(name, cell.resourceId);
                                if (!isExit) {
                                    // 同步画布中资源的名称
                                    this.updateCellName(name, cell);
                                    cell.resource.properties.name = name;
                                }
                            }
                        }));
                        $scope.$watch("softwareCell.scriptValue.description", mxUtils.bind(this, function (newV, oldV) {
                            var description = newV;
                            if (/^[\s\S]{0,1024}$/.test(description)) {
                                cell.resource.properties.description = description;
                            }
                        }));
                        $scope.$watch("softwareCell.scriptValue.version", mxUtils.bind(this, function (newV, oldV) {
                            var version = newV;
                            if (/^[\s\S]{0,1024}$/.test(version)) {
                                cell.resource.properties.version = version;
                            }
                        }));
                    } else {
                        $scope.showDetailPage("designer");
                    }
                    $timeout(function () {
                        $scope.operate(cell);
                    }, 200);
                    $scope.$digest();
                    return;
                }
                if (cell.isEdge()) {
                    // 获得连线
                    $scope.showDetailPage("nicToTemp");
                    var from = this.template.getResourceById(cell.resource.getFrom());
                    var to = this.template.getResourceById(cell.resource.getTo());
                    $scope.nicToTemplateCell.networkName = to.properties.name;
                    var nicsArray = [];
                    var nics = from.getNics().getArray();
                    var hasBinded = false;
                    for (var i = 0; i < nics.length; i++) {
                        if (nics[i].portGroupId && nics[i].portGroupId.refId === null) {
                            nicsArray.push({
                                "selectId": nics[i].name,
                                "label": nics[i].name
                            });
                            continue;
                        }
                        if (nics[i].portGroupId && nics[i].portGroupId.refId === to.id) {
                            nicsArray.push({
                                "selectId": nics[i].name,
                                "label": nics[i].name,
                                "checked": true
                            });
                            hasBinded = true;
                        }
                    }
                    $scope.nicToTemplateCell.nicName.values = nicsArray;
                    $scope.nicToTemplateCell.nicName.change = function () {
                        //更新VM 模板网卡的引用
                        for (var i = 0; i < nics.length; i++) {
                            if (nics[i].portGroupId && nics[i].portGroupId.refId === to.id) {
                                nics[i].portGroupId.refId = null;
                            }
                            var nicName = $("#nic-to-template-cell-nicName").widget().getSelectedId();
                            if (nicName === nics[i].name) {
                                nics[i].portGroupId.refId = to.id;
                            }
                        }
                    };
                    $timeout(function () {
                        $scope.operate(cell);
                    }, 200);
                    $scope.$digest();
                    return;
                }
            };
            $scope.operate = function (cell) {
                if (!cell) {
                    var template = graph.template;
                    $("#template-output-add").addOutPutPraOpt("template-output-table", template);
                    $(".template-output-edit").editOutPutPraOpt(template);
                    $(".template-output-delete").deleteOutPutPraOpt(template);
                    $("#template-deploy-add").addDeployOpt("template-deploy-table", template);
                    $(".template-deploy-edit").editDeployOpt(template);
                    $(".template-deploy-delete").deleteDeployOpt(template);
                    return;
                }
                var type = cell.type;
                if (type === "VmTemplate" || type === "ScalingGroup") {
                    $("#template-nic-add").addNicOpt(cell, "template-nic-table");
                    $(".template-nic-edit").editNicOpt(cell);
                    $(".template-nic-delete").deleteNicOpt(cell);
                    $("#template-initCommands-add").addCommandsOpt(cell, "template-initCommand-table", "postCommands");
                    $(".initCommands-edit").editCommandsOpt(cell, "postCommands");
                    $(".initCommands-delete").deleteCommandsOpt(cell, "postCommands");
                    $("#template-startCommands-add").addCommandsOpt(cell, "template-startCommands-table", "startCommands");
                    $(".startCommands-edit").editCommandsOpt(cell, "startCommands");
                    $(".startCommands-delete").deleteCommandsOpt(cell, "startCommands");
                    $("#template-stopCommands-add").addCommandsOpt(cell, "template-stopCommands-table", "stopCommands");
                    $(".stopCommands-edit").editCommandsOpt(cell, "stopCommands");
                    $(".stopCommands-delete").deleteCommandsOpt(cell, "stopCommands");

                    $(".template-scalingpolicy-edit").editScalingPolicy($scope);
                    $(".template-scalingpolicy-delete").deleteScalingPolicy(cell);
                }
            };

            $scope.getOsTypeOrVersion = function (type, OSTypes) {
                //如果模板中没有OS，则默认显示配置文件中读取的默认值
                if (type) {
                    return type;
                }
                var osType = _.find(OSTypes, function (item) {
                    return item.checked === true;
                });

                return osType ? osType.selectId : "";
            };

            $scope.addScalingPolicy = function (type, id, options) {
                var cell = $scope.graph.getSelectionCell();
                if ($scope.isScalingGroupCell(cell)) {
                    if (type === "create") {
                        id = TemplateUtils.createId();
                    }
                    var scalingGroup = new ScalingPolicy(id, options.name, options.description, options.metricCondition, options.action);

                    cell.scalinggroup.addScalingPolicy(id, scalingGroup);
                }
                $scope.graph.setSelectionCell(cell);
            };
            $scope.isScalingGroupCell = function (cell) {
                if (!cell) {
                    return false;
                }
                var type = cell.type;
                if (type === "ScalingGroup") {
                    return true;
                }
                return false;
            };

            $scope.addScalingPolicyUI = function (type, scalingPolicyId) {
                var cell = $scope.graph.getSelectionCell();
                if (!$scope.isScalingGroupCell(cell)) {
                    return;
                }
                var title = (type === "create" ? i18n.app_term_addIntraPolicy_button : i18n.app_term_modifyIntraPolicy_button);
                var scalingGroup = cell.scalinggroup.getScalingPolicy(scalingPolicyId);
                var options = {
                    "winId": "addScalingPolicy",
                    title: title,
                    height: "700px",
                    width: "850px",
                    "scope": $scope,
                    "mode": type,
                    "scalingGroup": scalingGroup,
                    "content-type": "url",
                    "params": $scope.params, //传输的数据
                    "content": "app/business/application/views/template/designer/layout/scalingPolicy.html",
                    "buttons": null
                };
                var win = new Window(options);
                win.show();
            };

            $scope.validDesignerCell = function () {
                var name = UnifyValid.FormValid($("#designerCell-cell-name"));
                if (!name) {
                    return false;
                }
                return true;
            };

            $scope.showDetailPage = function (type) {
                $scope.info.designerShow = false;
                $scope.info.templateShow = false;
                $scope.info.networkShow = false;
                $scope.info.scriptShow = false;
                $scope.info.softwareShow = false;
                $scope.info.nicToTempShow = false;

                if (type === "designer") {
                    $scope.info.designerShow = true;
                }
                if (type === "template") {
                    $scope.info.templateShow = true;
                }
                if (type === "network") {
                    $scope.info.networkShow = true;
                }
                if (type === "script") {
                    $scope.info.scriptShow = true;
                }
                if (type === "software") {
                    $scope.info.softwareShow = true;
                }
                if (type === "nicToTemp") {
                    $scope.info.nicToTempShow = true;
                }
            };
            $scope.init = function () {
                //判断state传入的参数
                var templateId = $stateParams.templateId;
                var mode = $stateParams.mode;

                $scope.params.templateId = templateId;
                $scope.params.mode = mode;
                if (String(mode) !== "create") {
                    $scope.queryAppTemplate(templateId);
                }
            };

            //当ui-view视图加载成功后的事件
            $scope.$on("$viewContentLoaded", function () {
                $scope.sidebar.createVertexTemplate(document.getElementById("network-elt-id"), "Network", 150, 40, "network");
                $scope.sidebar.createVertexTemplate(document.getElementById("template-elt-id"), "VmTemplate", 170, 70, "vm-template");
                $scope.sidebar.createVertexTemplate(document.getElementById("software-elt-id"), "Software", 150, 40, "software");
                $scope.sidebar.createVertexTemplate(document.getElementById("script-elt-id"), "Script", 150, 40, "script");
                $scope.graph.init(document.getElementById("app-container"));
                $scope.init();
            });
            $scope.$on("$includeContentLoaded", function() {
                $scope.operate($scope.graph.getSelectionCell());
            });

            function getVMUpdateType (updateType) {
                var values = [{
                    "selectId": "auto",
                    "label": i18n.common_term_auto_label,
                    "checked": updateType == "auto"
                }, {
                    "selectId": "manual",
                    "label":i18n.common_term_manual_label,
                    "checked": updateType == "manual"
                }];
                return values;
            }

            function getVMTransplantType(transplantType) {
                var values = [{
                    "selectId": "unSupport",
                    "label": i18n.common_term_notSupport_value,
                    "checked": transplantType == "unSupport"
                }, {
                    "selectId": "support",
                    "label": i18n.common_term_support_value,
                    "checked": transplantType == "support"
                }];

                return values;
            }
        }
    ];

    return ctrl;
});
