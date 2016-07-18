/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：13-12-28
 */
define([
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    'app/services/validatorService',
    'app/services/exceptionService',
    "app/business/service/services/catalog/catalogService",
    'app/services/messageService',
    'fixtures/catalogFixture',
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"],
    function ($, angular, http, validatorService, exception, catalogService, messageService) {
        "use strict";

        var choiceCtrl = ["$rootScope", "$scope", "camel", "$q", "$compile", "exception", function ($rootScope, $scope, camel, $q, $compile, exception) {
            var $state = $("html").injector().get("$state");
            var i18n = $("html").scope().i18n;
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var user = $("html").scope().user;
            var searchModel = {
                type: "apply",
                viewType: "system"
            };

            $scope.service = {};

            $scope.selTemp = {
                // 模板数据
                templates: {
                    value: [],
                    total: 0
                },

                // 是否显示选择模板提示
                showTips: false,

                // 当前选中的模板的id
                selectedId: "",

                selectTemplate: function (index, templateId, name, templateUrl, tempApproveType) {
                    var $dom = $(".ecs_vm_template_bk_color");
                    $dom.removeClass("ecs_vm_selected_template");
                    $dom.eq(index).addClass("ecs_vm_selected_template");
                    if ($dom && $dom.length) {
                        $scope.service.selectedId = templateId;
                        $scope.service.selectedName = name;
                        $scope.service.templateUrl = templateUrl;
                        $scope.service.tempApproveType = tempApproveType;
                        $scope.selTemp.showTips = false;
                        $scope.tempapplyType = true;
                        var applyTypes = [];
                        tempApproveType.noApprove && applyTypes.push({
                            key: "none",
                            text: i18n.service_term_approveNotRequire_label || "无审批"
                        });
                        tempApproveType.vdcApprove && applyTypes.push({
                            key: "vdc",
                            text: i18n.service_term_approveByVDCadmin_label || "VDC管理员审批"
                        });
                        tempApproveType.domainApprove && applyTypes.push({
                            key: "domain",
                            text: i18n.service_term_approveBySysadmin_label || "管理员审批"
                        });
                        applyTypes[applyTypes.length - 1].checked = true;

                        $scope.selTemp.applyType.values = applyTypes;
                    }
                },
                "applyType": {
                    "id": "applyType",
                    "label": (i18n.service_term_approveType_label || "审批类型") + ":",
                    "require": true,
                    "spacing": {
                        "width": "50px",
                        "height": "30px"
                    },
                    "values": "",
                    "layout": "horizon",
                    "change": function () {
                    }
                },
                nextBtn: {
                    "id": "ecsVmCreateNextBtn",
                    "text": i18n.common_term_next_button || "下一步",
                    "tooltip": "",
                    "click": function () {
                        //校验是否选择
                        var seldom = $(".ecs_vm_selected_template");
                        if (seldom.length < 1) {
                            $scope.selTemp.showTips = true;
                            return false;
                        }
                        $scope.service.selTemplate = getSelectedTemplate($scope.service.selectedId);
                        var applyTypeId = $("#" + $scope.selTemp.applyType.id).widget().opChecked("checked");
                        var templateId = $scope.service.selectedId;
                        var typeStateConfig = {
                            "ssp.templateVdc": "service.createServiceVDC",
                            "ssp.templateVm": "service.createServiceVM",
                            "ssp.templateVolume": "service.createServiceStorage",
                            "ssp.templateServer": "service.createServiceHost",
                            "ssp.templateEip": "service.createServiceElasticIP"
                        };
                        var typeState = typeStateConfig[$scope.service.templateUrl];
                        if(!typeState){
                            typeState = $scope.service.templateUrl;
                        }
                        typeState && $state.go(typeState, {"templateId": templateId, "applyTypeId": applyTypeId});
                    }
                },

                cancelBtn: {
                    "id": "ecsVmCreateCancelBtn",
                    "text": i18n.common_term_cancle_button || "取消",
                    "tooltip": "",
                    "click": function () {
                        $state.go("service.serviceManager");
                    }
                }
            };
            // 查询服务模板列表
            function queryTemplates() {
                var options = {
                    "user": user,
                    "params": searchModel
                };
                var deferred = catalogServiceIns.queryCatalogTemplates(options);
                deferred.then(function (data) {
                    data = data || {total: 0, templates: []};
                    var templates = data.templates || [];
                    for (var i = 0, len = templates.length; i < len; i++) {
                        var template = templates[i];
                        template.name && (template.i18nName = i18n[template.name] || "");
                    }
                    $scope.selTemp.templates.value = templates;
                    $scope.selTemp.templates.total = data.total;
                });
            };
            // 从模板列表中，搜索指定模板
            function getSelectedTemplate(templateId) {
                var selected = _.find($scope.selTemp.templates.value, function (item) {
                    return item.vmtID == templateId;
                });
                return selected || {};
            };
            // 根据所选择模板的不同跳转响应的页面
            function getModelStr(tempUrl) {
                var str = "";
                switch (tempUrl) {
                    case "ssp.templateVdc":
                        str = "service.createServiceVDC";
                        break;
                    case "ssp.templateVm":
                        str = "service.createServiceVM";
                        break;
                    case "ssp.templateVolume":
                        str = "service.createServiceStorage";
                        break;

                    default:
                        str = "";
                        break;
                }
                return str;
            }

            // 查询初始化信息
            queryTemplates();
        }];
        return choiceCtrl;
    }
);
