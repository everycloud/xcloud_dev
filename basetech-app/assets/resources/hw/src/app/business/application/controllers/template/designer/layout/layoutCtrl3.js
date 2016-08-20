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
    "tiny-widgets/Window",
    "../framework/plugins",
    "bootstrap/bootstrap.min",
], function ($, $jBase, KeyID, Constant, $rs, OS, _, desigerService,CoreGraph, Sidebar,  Window) {
    "use strict";

    var ctrl = ["$rootScope", "$window","$scope", "$compile", "$q", "$timeout", "$state", "$stateParams",
        function ($rootScope, $window, $scope, $compile, $q, $timeout, $state, $stateParams) {
            //公共对象
            var graph = new CoreGraph();
            graph.template = new TemplateDefine();
            window.graph = graph;
            //var keyHandler = graph.createKeyHandler();
            //$scope.getKeyHandler = function () {
            //    return keyHandler;
            //};
            //
            //KeyID.sprintf = sprintf.sprintf;
            //$scope.i18n = KeyID;
            console.log("test111");

            //var i18n = $scope.i18n;
            $scope.graph = graph;
            //左侧栏
            $scope.sidebar = new Sidebar(graph);
            console.log("test222");
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

            //
            //$scope.$on("$viewContentLoaded", function () {
            //    $scope.sidebar.createVertexTemplate(document.getElementById("network-elt-id"), "Network", 150, 40, "network");
            //    $scope.sidebar.createVertexTemplate(document.getElementById("template-elt-id"), "VmTemplate", 170, 70, "vm-template");
            //    $scope.sidebar.createVertexTemplate(document.getElementById("software-elt-id"), "Software", 150, 40, "software");
            //    $scope.sidebar.createVertexTemplate(document.getElementById("script-elt-id"), "Script", 150, 40, "script");
            //    $scope.graph.init(document.getElementById("app-container"));
            //    $scope.init();
            //});


            //$scope.info = {
            //    "designerPage": "app/business/application/views/template/designer/layout/designerCell.html",
            //    "designerShow": true,
            //    "templatePage": "app/business/application/views/template/designer/layout/templateCell.html",
            //    "templateShow": false,
            //    "networkPage": "app/business/application/views/template/designer/layout/networkCell.html",
            //    "networkShow": false,
            //    "scriptPage": "app/business/application/views/template/designer/layout/scriptCell.html",
            //    "scriptShow": false,
            //    "softwarePage": "app/business/application/views/template/designer/layout/softwareCell.html",
            //    "softwareShow": false,
            //    "nicToTempPage": "app/business/application/views/template/designer/layout/nicToTemplateCell.html",
            //    "nicToTempShow": false,
            //    "backBtn": {
            //        "id": "app-design-back-btn",
            //        "text": $scope.i18n.common_term_return_button,
            //        "click": function () {
            //            setTimeout(function () {
            //                $window.history.back();
            //            }, 0);
            //        }
            //    },
            //    "saveBtn": {
            //        "id": "app-design-save-btn",
            //        "text": i18n.common_term_save_label,
            //        "click": function () {
            //            var valid = $scope.validDesignerCell();
            //            if(!valid) {
            //                return;
            //            }
            //            var name = $scope.graph.template.getTemplateName();
            //            if (!name || name === "") {
            //                $scope.graph.clearSelection();
            //                return;
            //            }
            //            $scope.graph.template.generateResourceGraph($scope.graph);
            //            if ($scope.graph.template.id) {
            //                $scope.updateAppTemplate({
            //                    "id": $scope.graph.template.id,
            //                    "vdcId": $scope.params.vdcId,
            //                    "data": {
            //                        "name": $scope.graph.template.getTemplateName(),
            //                        "picture": $scope.graph.template.properties.icon,
            //                        "desc": $scope.graph.template.getDescription(),
            //                        "body": $.base64.encode($scope.graph.template.toJson(), true)
            //                    }
            //                });
            //                return;
            //            }
            //            $scope.createAppTemplate({
            //                "name": $scope.graph.template.getTemplateName(),
            //                "picture": $scope.graph.template.properties.icon,
            //                "resPoolType": "FusionManager",
            //                "desc": $scope.graph.template.getDescription(),
            //                "body": $.base64.encode($scope.graph.template.toJson(), true)
            //            });
            //        }
            //    },
            //    "validateBtn": {
            //        "id": "app-design-validate-btn",
            //        "text": i18n.app_term_checkout_button,
            //        "click": function () {
            //            $scope.graph.template.generateResourceGraph($scope.graph);
            //            var deferred = $scope.serviceSrv.validAppTemplate({
            //                "vdcId": $scope.params.vdcId,
            //                "userId": $scope.params.userId,
            //                "data": {
            //                    "templateBody": $.base64.encode($scope.graph.template.toJson(), true),
            //                    "resPoolType": "FusionManager"
            //                }
            //            });
            //            deferred.then(function (data) {
            //                messageService.okMsgBox(i18n.app_term_templateCheckSucceed_msg);
            //            });
            //        }
            //    }
            //};
            //
            //$scope.validDesignerCell = function () {
            //    var name = UnifyValid.FormValid($("#designerCell-cell-name"));
            //    if (!name) {
            //        return false;
            //    }
            //    return true;
            //};

        }
    ];

    return ctrl;
});
