define([
    "tiny-lib/jquery",
    "tiny-lib/jquery.base64",
    "../framework/Constant",
    "../framework/resource",
    "../framework/OSVersions",
    "tiny-lib/underscore",
    "app/business/application/services/desiger/desigerService",
    "../framework/CoreGraph",
    "../framework/Sidebar",
    "../framework/DesignerValid",
    "tiny-widgets/Window",
    "../framework/plugins",
    "bootstrap/bootstrap.min",
], function ($, $jBase, Constant, $rs, OS, _, desigerService,CoreGraph, Sidebar, UnifyValid, Window) {
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
                host: {
                    "src": "../resources/hw/theme/default/images/icon-vm.png",
                    "title": "host"
                },
                component: {
                    "src": "../resources/hw/theme/default/images/icon-software.png",
                    "title": "组件"
                },
                network: {
                    "src": "../resources/hw/theme/default/images/icon-network.png",
                    "title": "网络"
                },
                template: {
                    "src": "../resources/hw/theme/default/images/icon-vm.png",
                    "title": "虚拟机"
                },
                software: {
                    "src": "../resources/hw/theme/default/images/icon-software.png",
                    "title": "软件"
                },
                script: {
                    "src": "../resources/hw/theme/default/images/icon-script.png",
                    "title": "脚本"
                }
            };

            console.log("test");
            console.log($scope.elements);

            $scope.params = {
                //"userId": $scope.user.id,
                //"vdcId": $scope.user.vdcId,
                "mode": undefined
            };

            $scope.showDetailPage = function (type) {
                $scope.info.designerShow = false;
                $scope.info.templateShow = false;
                $scope.info.networkShow = false;
                $scope.info.scriptShow = false;
                $scope.info.softwareShow = false;
                $scope.info.nicToTempShow = false;
                $scope.info.hostShow = false;
                $scope.info.componentShow = false;

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
                if (type === "nicToTemp") {
                    $scope.info.nicToTempShow = true;
                }
                if (type === "host") {
                    $scope.info.hostShow = true;
                }
                if (type === "component") {
                    $scope.info.componentShow = true;
                }
            };

            $scope.init = function () {
                //判断state传入的参数
                var templateId = $stateParams.templateId;
                var mode = $stateParams.mode;

                $scope.params.templateId = templateId;
                $scope.params.mode = mode;
                //if (String(mode) !== "create") {
                //    $scope.queryAppTemplate(templateId);
                //}
            };

            $scope.$on("$viewContentLoaded", function () {
                $scope.sidebar.createVertexTemplate(document.getElementById("host-elt-id"), "Host", 150, 40, "host");
                //$scope.sidebar.createVertexTemplate(document.getElementById("component-elt-id"), "Component", 150, 40, "component");
                $scope.sidebar.createVertexTemplate(document.getElementById("network-elt-id"), "Network", 150, 40, "network");
                $scope.sidebar.createVertexTemplate(document.getElementById("template-elt-id"), "VmTemplate", 170, 70, "vm-template");
                $scope.sidebar.createVertexTemplate(document.getElementById("software-elt-id"), "Software", 150, 40, "software");
                $scope.sidebar.createVertexTemplate(document.getElementById("script-elt-id"), "Script", 150, 40, "script");
                $scope.graph.init(document.getElementById("app-container"));
                $scope.init();
            });


            $scope.hostCell = {
                name: {
                    id: "host-cell-name",
                    label: "名称:",
                    width: "130px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getRequiredName(),
                    "blur": function (type) {
                        var name = $("#host-cell-name").widget().getValue();
                        $scope.hostCell.hostValue.name = name;
                    }
                },
                description: {
                    "id": "host-cell-description",
                    "label": "描述:",
                    "width": "130px",
                    "height": "50px",
                    "type": "multi",
                    "require": false,
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    "blur": function () {
                        var description = $("#host-cell-description").widget().getValue();
                        $scope.hostCell.hostValue.description = description;
                    }
                },
                version: {
                    "id": "host-cell-version",
                    "label": "版本:",
                    "width": "130px",
                    "height": "50px",
                    "require": false,
                    "blur": function () {
                        var version = $("#host-cell-version").widget().getValue();
                        $scope.hostCell.hostValue.version = version;
                    }
                },
                hostValue: {
                    name: "",
                    description: "",
                    version: ""
                }
            };

            $scope.componentCell = {
                name: {
                    id: "component-cell-name",
                    label: "名称:",
                    width: "130px",
                    require: true,
                    "tooltip": UnifyValid.validateInfo.name,
                    "extendFunction": ["name"],
                    "validate": UnifyValid.validateInfo.getRequiredName(),
                    "blur": function (type) {
                        var name = $("#component-cell-name").widget().getValue();
                        $scope.componentCell.componentValue.name = name;
                    }
                },
                description: {
                    "id": "component-cell-description",
                    "label": "描述:",
                    "width": "130px",
                    "height": "50px",
                    "type": "multi",
                    "require": false,
                    "tooltip": UnifyValid.validateInfo.description,
                    "extendFunction": ["description"],
                    "validate": UnifyValid.validateInfo.getDescription(),
                    "blur": function () {
                        var description = $("#component-cell-description").widget().getValue();
                        $scope.componentCell.componentValue.description = description;
                    }
                },
                version: {
                    "id": "component-cell-version",
                    "label": "版本:",
                    "width": "130px",
                    "height": "50px",
                    "require": false,
                    "blur": function () {
                        var version = $("#component-cell-version").widget().getValue();
                        $scope.componentCell.componentValue.version = version;
                    }
                },
                componentValue: {
                    name: "",
                    description: "",
                    version: ""
                }
            };

            $scope.designerCell = {
                icon: {
                    id: "designerCell-cell-icon",
                    label: "图标:",
                    require: true,
                    "width": "240px",
                    "icon": "",
                    "imgs": [],
                    "validate": "required:"+"不能为空。"+";"
                },
                name: {
                    id: "designerCell-cell-name",
                    label: "名称:",
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
                    "label": "描述:",
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
                    label: "公共参数:",
                    require: false
                },
                outputPrm: {
                    label: "输出参数:",
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

            $scope.networkCell = {
                name: {
                    id: "network-cell-name",
                    label: "网络:",
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
                    label: "描述:",
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
                    label: "操作系统类型:",
                    require: true,
                    "id": "template-cell-ostype",
                    "width": "140px",
                    "height": "230px",
                    "validate": "required:"+"不能为空;",
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
                    label: "操作系统版本:",
                    require: true,
                    "id": "template-cell-osVersion",
                    "height": "260px",
                    "width": "140px",
                    "values": [],
                    "validate": "required:"+"不能为空;",
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
                    label: "名称:",
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
                    label: "描述:",
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
                    label: "计算机名称:",
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
                    label: "升级方式:",
                    require: false,
                    "id": "template-cell-updateType",
                    "width": "140px",
                    "values": [{
                        "selectId": "auto",
                        "label": "自动"
                    }, {
                        "selectId": "manual",
                        "label":"手动"
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
                    label: "基本块存储高级功能:",
                    require: false,
                    "id": "template-cell-transplantType",
                    "width": "140px",
                    "values": [{
                        "selectId": "unSupport",
                        "label": "不支持"
                    }, {
                        "selectId": "support",
                        "label": "支持"
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
                    label: "网卡列表:",
                    require: false
                },
                initCommands: {
                    label: "初始化命令:"
                },
                startCommands: {
                    label: "启动命令:"
                },
                stopCommands: {
                    label: "停止命令:"
                },
                scalinggroup: {
                    "label": "伸缩组:",
                    "name": {
                        "id": "scalinggroup-name",
                        "label": "名称:",
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
                        "label": "描述:",
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
                        "label": "最大虚拟机数:",
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
                        "label": "最小虚拟机数:",
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
                        "label": "最小运行虚拟机数:",
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
                        "label": "冷却时间(分钟):",
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
                        "label": "组内策略"
                    },
                    "addScalingPolicy": function () {
                        $scope.addScalingPolicyUI("create");
                    },
                    "getActionTypeName": function (type) {
                        if (type === "SCALEOUT" || type === "SCALEIN") {
                            return "默认";
                        } else if (type === "POWER") {
                            return "启动";
                        } else if (type === "AWAKE") {
                            return "唤醒";
                        } else if (type === "CREATE") {
                            return "创建";
                        } else if (type === "HALT") {
                            return "关闭";
                        } else if (type === "SLEEP") {
                            return "休眠";
                        } else if (type === "REMOVE") {
                            return "删除";
                        } else {
                            return "默认";
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
                    label: "名称:",
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
                    "label": "描述:",
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
                    "label": "版本:",
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

            $scope.initAppTemplate();

            $scope.info = {
                "designerPage": "../resources/hw/src/app/business/application/views/designer/layout/designerCell.html",
                "designerShow": true,
                "hostPage": "../resources/hw/src/app/business/application/views/designer/layout/hostCell.html",
                "hostShow": false,
                "componentPage": "../resources/hw/src/app/business/application/views/designer/layout/componentCell.html",
                "componentShow": false,
                "networkPage": "../resources/hw/src/app/business/application/views/designer/layout/networkCell.html",
                "networkShow": false,
                "scriptPage": "../resources/hw/src/app/business/application/views/designer/layout/scriptCell.html",
                "scriptShow": false,
                "softwarePage": "../resources/hw/src/app/business/application/views/designer/layout/softwareCell.html",
                "softwareShow": false,
                "nicToTempPage": "../resources/hw/src/app/business/application/views/designer/layout/nicToTemplateCell.html",
                "nicToTempShow": false,
                "backBtn": {
                    "id": "app-design-back-btn",
                    "text": "返回",
                    "click": function () {
                        setTimeout(function () {
                            $window.history.back();
                        }, 0);
                    }
                },
                "saveBtn": {
                    "id": "app-design-save-btn",
                    "text": "保存",
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
                    "text": "校验",
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
                            messageService.okMsgBox(i18n.app_term_templateCheckSucceed_msg);
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
                        item.exp == "hostCell.value.name" ||
                        item.exp == "hostCell.value.description" ||
                        item.exp == "componentCell.value.name" ||
                        item.exp == "componentCell.value.description" ||
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

                    } else if (type === "Host") {
                        $scope.showDetailPage("host");
                        $scope.hostCell.value = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description
                        };
                        $scope.$watch("hostCell.value.name", mxUtils.bind(this, function (newV, oldV) {
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
                        $scope.$watch("hostCell.value.description", mxUtils.bind(this, function (newV, oldV) {
                            var description = newV;
                            if (/^[\s\S]{0,1024}$/.test(description)) {
                                cell.resource.properties.description = description;
                            }
                        }));

                    }else if (type === "Component") {
                        $scope.showDetailPage("component");
                        $scope.componentCell.value = {
                            name: cell.resource.properties.name,
                            description: cell.resource.properties.description
                        };
                        $scope.$watch("componentCell.value.name", mxUtils.bind(this, function (newV, oldV) {
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
                        $scope.$watch("componentCell.value.description", mxUtils.bind(this, function (newV, oldV) {
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

            function getVMUpdateType (updateType) {
                var values = [{
                    "selectId": "auto",
                    "label": "自动",
                    "checked": updateType == "auto"
                }, {
                    "selectId": "manual",
                    "label":"手动",
                    "checked": updateType == "manual"
                }];
                return values;
            }

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

            $scope.validDesignerCell = function () {
                var name = UnifyValid.FormValid($("#designerCell-cell-name"));
                if (!name) {
                    return false;
                }
                return true;
            };

            function getVMTransplantType(transplantType) {
                var values = [{
                    "selectId": "unSupport",
                    "label": "不支持",
                    "checked": transplantType == "unSupport"
                }, {
                    "selectId": "support",
                    "label": "支持",
                    "checked": transplantType == "support"
                }];

                return values;
            }
        }
    ];

    return ctrl;
});
