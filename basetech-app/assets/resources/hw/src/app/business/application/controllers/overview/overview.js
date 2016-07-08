/**
 * Created on 14-3-24.
 */
define([
        'tiny-lib/jquery',
        'tiny-lib/encoder',
        'tiny-lib/angular',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Table",
        "tiny-widgets/CirqueChart",
        "tiny-directives/CirqueChart",
        "tiny-lib/underscore",
        "app/business/application/controllers/constants",
        'app/services/cloudInfraService',
        "app/business/application/services/appCommonService",
        "fixtures/appFixture"
    ],
    function ($, encoder, angular, Textbox, Button, Window, Progressbar, Checkbox, Table, CirqueChart, _CirqueChart, _, constants, cloudInfraService, appCommonService) {
        "use strict";

        var overviewCtrl = ["$rootScope", "$scope", "$compile", "$state", "camel", "exception", "$q", "storage",
            function ($rootScope, $scope, $compile, $state, camel, exception, $q, storage) {
                var user = $("html").scope().user;
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var i18n = $scope.i18n;
                $scope.templateUseInfo = {};
                $scope.isIT = (user.cloudType === "IT");
                $scope.isSC = ($scope.deployMode === 'serviceCenter');
                $scope.appUseInfo = {};
                $scope.hasOperateTemplRight = _.contains($rootScope.user.privilegeList, constants.privileges.OPERATE_APP_TEMPLATE);
                var instance_operate = $scope.isSC ? constants.privileges.OPERATE_SERVICE_APPLY : constants.privileges.OPERATE_APP_INSTANCE;
                $scope.hasOperateInstanRight = _.contains($rootScope.user.privilegeList, instance_operate);
                var vm_operate = $scope.isSC ? constants.privileges.OPERATE_SERVICE_APPLY : constants.privileges.OPERATE_VM_CREATE;
                $scope.hasOperateVmRight = _.contains($rootScope.user.privilegeList, vm_operate);

                $scope.label = {
                    "createApp" : $scope.isSC ? $scope.i18n.app_term_applyAppInstance_button : $scope.i18n.app_term_createApp_button,
                    "createVm" : $scope.isSC ? $scope.i18n.common_term_apply_button + (window.urlParams.lang === "en" ? " ":"" + $scope.i18n.common_term_vm_label) : $scope.i18n.vm_term_createVM_button
                };

                var cloudInfra = {};
                var vpcId = "";
                $scope.searchLocation = {
                    "id": "appNavigateSearchLocation",
                    "width": "120",
                    "values": [],
                    "change": function () {
                        var selectId = $("#" + $scope.searchLocation.id).widget().getSelectedId();
                        _.each($scope.searchLocation.values, function (item, index) {
                            if (selectId === item.selectId) {
                                cloudInfra = item;
                            }
                        });
                        $scope.queryAppStatistic();
                        $scope.queryTemplateStatistic();
                        storage.add("cloudInfraId", selectId);
                    }
                };
                //刷新用户列表
                $scope.refresh = {
                    "id": "appNavigateRefreshBtn",
                    "click": function () {
                        if (!$scope.isIT) {
                            $scope.queryTemplateStatistic();
                        } else {
                            $scope.queryAppStatistic();
                            $scope.queryTemplateStatistic();
                        }
                    }
                };

                $scope.jump2Template = function () {
                    $state.go("ecs.vmTemplateList");
                };

                $scope.jump2Software = function () {
                    $state.go("ecs.commonPackageList");
                };

                $scope.jump2AppTemp = function () {
                    $state.go("application.importTemplate.navigation", {"from": "application.manager.overview"});
                };

                $scope.jump2CreateTemp = function () {
                    if (user.cloudType === "IT") {
                        $state.go("application.design", {
                            "mode": "create"
                        });
                    } else {
                        createOrUpdateTemplate("create", null);
                    }
                };

                $scope.jump2CreateApp = function () {
                    if ($scope.isSC) {
                        $state.go("ssp.catalog");
                    } else {
                        if (user.cloudType === "IT") {
                            $state.go("appCreateByTemplate.navigate", {
                                "fromFlag": constants.fromFlag.FROM_NAVIGATE
                            });
                        } else {
                            $state.go("createByOpenstack.navigate", {
                                "fromFlag": constants.fromFlag.FROM_NAVIGATE
                            });
                        }
                    }
                };

                $scope.jump2CreateVm = function () {
                    if ($scope.isSC) {
                        $state.go("ssp.catalog");
                    } else {
                        $state.go("ecsVmCreate.navigate", {
                            "cloudInfra": cloudInfra.selectId,
                            "vpcId": vpcId
                        });
                    }
                };

                $scope.jump2CreateCustomApp = function () {
                    $state.go("appCreateByCustom.navigate", {
                        "fromFlag": constants.fromFlag.FROM_NAVIGATE
                    });
                };

                $scope.queryAppStatistic = function () {
                    $("#appOverviewAppUseInfo").empty();
                    if(!cloudInfra || !cloudInfra.id) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id
                    };
                    var deferred = appCommonServiceIns.queryAppStatistics(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var options = {
                            "id": "appOverviewAppUseInfo",
                            "rotate": 400,
                            "r": 75,
                            "width": 500,
                            "strokeWidth": 20,
                            "showShadow": false,
                            "showLegend": true,
                            "showClickEvent": true,
                            "centerText": {
                                text: "",
                                fontSize: 46,
                                color: "#5ecc49"
                            },
                            "data": [{
                                "value": 0,
                                "name": i18n.common_term_natural_value+":",
                                color: "#5ecc49",
                                "tooltip":i18n.common_term_natural_value+":",
                                "click": function () {
                                    $state.go("application.manager.instance");
                                }
                            }, {
                                "value": 0,
                                "name": i18n.common_term_abnormal_value+":",
                                color: "#ffa235",
                                "tooltip": i18n.common_term_abnormal_value+":",
                                "click": function () {
                                    $state.go("application.manager.instance");
                                }
                            }, {
                                "value": 0,
                                "name": i18n.common_term_unknownStatus_label+":",
                                "tooltip":i18n.common_term_unknownStatus_label+":",
                                "color": "#efe034",
                                click: function () {
                                    $state.go("application.manager.instance");
                                }
                            }, {
                                "value": 0,
                                "name": i18n.common_term_nullStatus_label+":",
                                "tooltip":i18n.common_term_nullStatus_label+":",
                                "color": "#eaeaea",
                                click: function () {
                                    $state.go("application.manager.instance");
                                }
                            }]
                        };
                        var normalCount = 0;
                        var abnormalCount = 0;
                        var unknownCount = 0;
                        var nostateCount = 0;
                        var normalRate = 0;
                        var abnormalRate = 0;
                        var unknownRate = 0;
                        var nostateRate = 0;
                        if (data) {
                            if (data.normalNum) {
                                normalCount = data.normalNum;
                            }
                            if (data.alarmNum) {
                                abnormalCount = data.alarmNum;
                            }
                            if (data.unKnownNum) {
                                unknownCount = data.unKnownNum;
                            }
                            if (data.noNum) {
                                nostateCount = data.noNum;
                            }
                            if (data.normalPercent) {
                                normalRate = data.normalPercent;
                            }
                            if (data.alarmPercent) {
                                abnormalRate = data.alarmPercent;
                            }
                            if (data.unKnownPercent) {
                                unknownRate = data.unKnownPercent;
                            }
                            if (data.noPercent) {
                                nostateRate = data.noPercent;
                            }
                        }
                        var total = normalCount + abnormalCount + unknownCount + nostateCount;
                        options.centerText.text = $.encoder.encodeForHTML(total);
                        options.data[0].value = $.encoder.encodeForHTML(normalRate);
                        options.data[0].name += $.encoder.encodeForHTML(normalCount);
                        options.data[0].tooltip += $.encoder.encodeForHTML(normalCount);
                        options.data[1].value = $.encoder.encodeForHTML(abnormalRate);
                        options.data[1].name += $.encoder.encodeForHTML(abnormalCount);
                        options.data[1].tooltip += $.encoder.encodeForHTML(abnormalCount);
                        options.data[2].value = $.encoder.encodeForHTML(unknownRate);
                        options.data[2].name += $.encoder.encodeForHTML(unknownCount);
                        options.data[2].tooltip += $.encoder.encodeForHTML(unknownCount);
                        options.data[3].value = $.encoder.encodeForHTML(nostateRate);
                        options.data[3].name += $.encoder.encodeForHTML(nostateCount);
                        options.data[3].tooltip += $.encoder.encodeForHTML(nostateCount);
                        var appChart = new CirqueChart(options);
                    });
                };

                $scope.queryTemplateStatistic = function () {
                    $("#appOverviewTemplateUseInfo").empty();
                    var options = {
                        "user": user,
                        "start": 0
                    };
                    var deferred = appCommonServiceIns.queryServiceTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var publishCount = 0;
                        var draftCount = 0;
                        if (data.appTemplates) {
                            _.each(data.appTemplates, function (item, index) {
                                if (item && (item.status === "Published")) {
                                    publishCount++;
                                } else {
                                    draftCount++;
                                }
                            });
                        }
                        var publishRate = 0;
                        var draftRate = 0;
                        var total = publishCount + draftCount;
                        if (total === 0) {
                            publishRate = 0;
                            draftRate = 0;
                        } else {
                            publishRate = Math.round(100 * publishCount / total);
                            draftRate = 100 - publishRate;
                        }

                        var options = {
                            "id": "appOverviewTemplateUseInfo",
                            "r": "75",
                            "showLegend": true,
                            "showShadow": false,
                            "centerText": {
                                text: "",
                                fontSize: 46,
                                color: "#5ecc49"
                            },
                            "data": [{
                                value: 0,
                                name: i18n.common_term_published_value+":",
                                color: "#5ecc49",
                                tooltip:  i18n.common_term_published_value+":",
                                click: function () {
                                    $state.go("application.manager.template");
                                }
                            }, {
                                value: 0,
                                name: i18n.app_term_draft_label+":",
                                color: "#ffa235",
                                tooltip:  i18n.app_term_draft_label+":",
                                click: function () {
                                    $state.go("application.manager.template");
                                }
                            }]
                        };
                        options.centerText.text = total;
                        options.data[0].value = publishRate;
                        options.data[0].name += publishCount;
                        options.data[0].tooltip += publishCount;
                        options.data[1].value = draftRate;
                        options.data[1].name += draftCount;
                        options.data[1].tooltip += draftCount;
                        var templateChart = new CirqueChart(options);
                    });
                };

                //创建或修改模板
                function createOrUpdateTemplate(opt, params, templateId) {
                    var str = "";
                    if ("create" === opt) {
                        str = i18n.app_term_createTemplate_button;
                    } else {
                        str = i18n.app_term_modifyTemplate_button;
                    }
                    var options = {
                        "winId": "app-templateList-createTemplate-winId",
                        "templateId": "createTemplate",
                        "appId": templateId,
                        "opt": opt,
                        "param": params,
                        "exception": exception,
                        "fromFlag": "2", //从概览跳过来
                        "title": str,
                        "width": "1000px",
                        "height": "750px",
                        "content-type": "url",
                        "content": "app/business/application/views/template/createTemplate.html",
                        "buttons": null,
                        "close": function () {}
                    };
                    var win = new Window(options);
                    win.show();
                }

                function getLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            cloudInfra = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                            $scope.searchLocation.values = data.cloudInfras;
                        }
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                $scope.$on("$viewContentLoaded", function () {
                    var promise = getLocations();
                    promise.then(function () {
                        $scope.queryAppStatistic();
                        $scope.queryTemplateStatistic();
                    });
                });
            }
        ];

        return overviewCtrl;
    });
