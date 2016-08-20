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
                $scope.sidebar.createVertexTemplate(document.getElementById("network-elt-id"), "Network", 150, 40, "network");
                $scope.sidebar.createVertexTemplate(document.getElementById("template-elt-id"), "VmTemplate", 170, 70, "vm-template");
                $scope.sidebar.createVertexTemplate(document.getElementById("software-elt-id"), "Software", 150, 40, "software");
                $scope.sidebar.createVertexTemplate(document.getElementById("script-elt-id"), "Script", 150, 40, "script");
                $scope.graph.init(document.getElementById("app-container"));
                $scope.init();
            });


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
                "templatePage": "resources/hw/src/app/business/application/views/designer/layout/templateCell.html",
                "templateShow": false,
                "networkPage": "resources/hw/src/app/business/application/views/designer/layout/networkCell.html",
                "networkShow": false,
                "scriptPage": "resources/hw/src/app/business/application/views/designer/layout/scriptCell.html",
                "scriptShow": false,
                "softwarePage": "resources/hw/src/app/business/application/views/designer/layout/softwareCell.html",
                "softwareShow": false,
                "nicToTempPage": "resources/hw/src/app/business/application/views/designer/layout/nicToTemplateCell.html",
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

            $scope.validDesignerCell = function () {
                var name = UnifyValid.FormValid($("#designerCell-cell-name"));
                if (!name) {
                    return false;
                }
                return true;
            };
        }
    ];

    return ctrl;
});
