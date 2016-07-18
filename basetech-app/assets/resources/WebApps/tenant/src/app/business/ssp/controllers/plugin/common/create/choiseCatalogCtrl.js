define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'app/services/httpService',
        'app/services/validatorService',
        'app/services/messageService',
        'app/business/ssp/services/catalog/catalogService',
        'fixtures/catalogFixture',
        'tiny-directives/Textbox',
        'tiny-directives/Button',
        'tiny-directives/FormField'
    ],
    function ($, angular, http, validatorService, messageService, catalogService) {
        "use strict";

        var choiceCtrl = ["$scope", "camel", "monkey", "$q", "$compile", "exception",
            function ($scope, camel, monkey, $q, $compile, exception) {
                var i18n = $("html").scope().i18n;
                var user = $("html").scope().user;
                var state = $("html").injector().get("$state");

                var catalogServiceImpl = new catalogService(exception, $q, camel);

                var $state = $("html").injector().get("$state");
                var searchModel = {
                    name: "",
                    "cloud-infra": "2",
                    range: "all",
                    start: 0,
                    limit: 1000
                };

                $scope.selTemp = {
                    // 模板数据
                    templates: {
                        value: [],
                        total: 0
                    },

                    // 是否显示选择模板提示
                    showTips: false,

                    selectTemplate: function (index, template, tempApproveType) {
                        var dom = $(".ecs_vm_template_bk_color");
                        if (dom.length > 0) {
                            var i = 0;
                            dom.each(function () {
                                if (i === index) {
                                    $(this).addClass("ecs_vm_selected_template");
                                    $scope.params.selectedTemplate = template;
                                    $scope.selTemp.showTips = false;
                                } else {
                                    $(dom[i]).removeClass("ecs_vm_selected_template");
                                }
                                i++;
                            });
                            $scope.tempapplyType = true;
                            var applyTypes = [];
                            if (tempApproveType.noApprove) {
                                applyTypes.push({
                                    key: "none",
                                    text: i18n.service_term_approveNotRequire_label
                                });
                            }
                            if (tempApproveType.vdcApprove) {
                                applyTypes.push({
                                    key: "vdc",
                                    text: i18n.service_term_approveByVDCadmin_label
                                });
                            }
                            if (tempApproveType.domainApprove) {
                                applyTypes.push({
                                    key: "domain",
                                    text: i18n.service_term_approveBySysadmin_label
                                });
                            }
                            applyTypes[applyTypes.length - 1].checked = true;

                            $scope.selTemp.applyType.values = applyTypes;
                        }
                    },
                    "applyType": {
                        "id": "applyType",
                        "label": i18n.service_term_approveType_label + ":",
                        "require": true,
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": "",
                        "layout": "horizon",
                        "change": function() {
                        }
                    },
                    nextBtn: {
                        "id": "ecsVmCreateNextBtn",
                        "text": i18n.common_term_next_button,
                        "tooltip": "",
                        "click": function () {
                            //校验是否选择
                            var seldom = $(".ecs_vm_selected_template");
                            if (seldom.length < 1) {
                                $scope.selTemp.showTips = true;
                                return false;
                            }

                            $("#showLocalImg").html("<img src='" + $scope.params.selectedTemplate.imageUrl + "'>");
                            state.go($scope.params.selectedTemplate.templateUrl, {
                                "templateId" : $scope.params.selectedTemplate.id,
                                "approvalType" : $("#" + $scope.selTemp.applyType.id).widget().opChecked("checked")
                            });
                        }
                    },

                    cancelBtn: {
                        "id": "ecsVmCreateCancelBtn",
                        "text": i18n.common_term_cancle_button,
                        "tooltip": "",
                        "click": function () {
                            $state.go("ssp.catalog");
                        }
                    }
                };

                // 查询服务模板列表
                function queryTemplates() {
                    var options = {
                        "user": user,
                        "params" : {
                            "type" : "apply",
                            "viewType" : "vdc"
                        }
                    };
                    var deferred = catalogServiceImpl.queryCatalogTemplates(options);
                    deferred.then(function (data) {
                        if (!data || !data.templates) {
                            return false;
                        }
                        $scope.selTemp.templates.value = data.templates;
                        $scope.selTemp.templates.total = data.total;
                    });
                }

                // 查询初始化信息
                queryTemplates();
            }
        ];
        return choiceCtrl;
    }
);
