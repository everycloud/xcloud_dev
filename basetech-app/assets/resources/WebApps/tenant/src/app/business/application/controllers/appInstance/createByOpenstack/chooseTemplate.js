/**
 * Created on 14-2-27.
 */
define(['tiny-lib/jquery',
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "app/business/application/controllers/constants",
        'app/business/application/services/appCommonService',
        "fixtures/appFixture"
    ],
    function ($, angular, _, constants, appCommonService) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "exception", "$stateParams", "appCommonData", "$q",
            function ($scope, camel, $compile, $state, exception, $stateParams, appCommonData, $q) {
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                $scope.params.fromFlag = $stateParams.fromFlag;
                $scope.params.appId = $stateParams.appId;
                $scope.params.selResPoolId = $stateParams.cloudInfraId;
                $scope.params.selVpcId = $stateParams.vpcId;
                $scope.params.isModify = $scope.params.appId && ($scope.params.appId !== "");
                //查询应用信息完成标志,灰化下一步按钮用,如果是创建APP不需要查询;修改则必须查
                $scope.finishQueryApp = ($scope.params.isModify ? false : true);
                var appCommonServiceIns = new appCommonService(exception, $q, camel);

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                var searchString = "";

                $scope.templateId = $stateParams.templateId;
                $scope.searchType = {
                    "id": "app_apps_searchType",
                    "width": "100",
                    "values": [{
                        "selectId": "",
                        "label": i18n.common_term_allRange_label,
                        "checked": true
                    }, {
                        "selectId": "SystemVisible",
                        "label": i18n.common_term_system_label
                    }, {
                        "selectId": "OrgVisible",
                        "label": i18n.org_term_organization_label
                    }],
                    "change": function () {
                        page.currentPage = 1;
                        queryServiceTemplate();
                    }
                };

                $scope.refresh = {
                    "id": "app_createByOpenstack_chooseTemp_refreshId",
                    "tips": i18n.common_term_fresh_button,
                    "click": function () {
                        queryServiceTemplate();
                    }
                };

                $scope.searchBox = {
                    "id": "app_apps_searchBoxId",
                    "placeholder": i18n.app_term_findAppTemplateName_prom+":",
                    "width": "250",
                    "suggestSize": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchName) {
                        searchString = searchName;
                        page.currentPage = 1;
                        queryServiceTemplate();
                    }
                };

                $scope.info = {
                    "templateTable": {
                        "id": "create-app-templateTable",
                        "enablePagination": true,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "displayLength": 10,
                        "totalRecords": 0,
                        "lengthMenu": [10, 20, 30],
                        "columnsVisibility": {
                            "activate": "click", //"mouseover"/"click"
                            "aiExclude": [0],
                            "bRestore": false,
                            "fnStateChange": function (index, state) {}
                        },

                        "columns": [{
                            "sTitle": "",
                            "sWidth": "30px",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            }
                        }, {
                            "sTitle": i18n.common_term_name_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        }, {
                            "sTitle": i18n.common_term_status_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusStr);
                            }
                        }, {
                            "sTitle": i18n.template_term_applyRange_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.visibility);
                            }
                        }, {
                            "sTitle": i18n.common_term_createAt_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.createTime);
                            }
                        }, {
                            "sTitle": i18n.common_term_desc_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.desc);
                            }
                        }],
                        "data": null,
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var selectedTemplateId = $scope.params.selServiceTemplate && $scope.params.selServiceTemplate.id;
                            var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                            var selBoxLink = $compile(selBox);
                            var selBoxScope = $scope.$new();
                            selBoxScope.data = aData;
                            selBoxScope.name = "appCreateAppChooseTempRadio";
                            selBoxScope.id = "appCreateAppChooseTempRadioId" + iDataIndex;
                            selBoxScope.value = aData.id;
                            if (selectedTemplateId && (selectedTemplateId === aData.id)) {
                                selBoxScope.checked = true;
                            } else {
                                selBoxScope.checked = false;
                            }
                            selBoxScope.change = function () {
                                $scope.params.selServiceTemplate = aData;
                            };
                            var selBoxNode = selBoxLink(selBoxScope);
                            $("td:eq(0)", nRow).html(selBoxNode);
                        },
                        "callback": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            queryServiceTemplate();
                        },
                        "changeSelect": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            queryServiceTemplate();
                        }
                    },
                    "okBtn": {
                        "id": "create-app-chooseTemplate-ok",
                        "text": i18n.common_term_next_button,
                        "disable": true,
                        "click": function () {
                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": true,
                                "configParam": false,
                                "confirmByTemplate": false
                            };

                            $scope.$emit($scope.events.selAppTempNext);
                            $("#createByOpenstack-app-step").widget().next();
                        }
                    },

                    "cancelBtn": {
                        "id": "create-app-chooseTemplate-cancel",
                        "text":i18n.common_term_cancle_button,
                        "click": function () {
                            if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                                $state.go("application.manager.instance");
                            } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                                $state.go("application.manager.overview");
                            } else {
                                $state.go("application.manager.template");
                            }
                        }
                    }
                };

                function queryServiceTemplate() {
                    var visibility = $("#app_apps_searchType").widget() && $("#app_apps_searchType").widget().getSelectedId();
                    if (!visibility) {
                        visibility = "";
                    }

                    var options = {
                        "user": user,
                        "visible": visibility,
                        "name": searchString,
                        "limit": page.displayLength,
                        "start": page.getStart()
                    };

                    if (constants.fromFlag.FROM_TEMPLATE_LIST === $scope.params.fromFlag) {
                        options.templateId = $scope.templateId;
                    } else {
                        options.status = "Published";
                    }

                    var deferred = appCommonServiceIns.queryServiceTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var serviceTemplates = [];
                        var tmpServiceTemplates = null;
                        if (data.appTemplates) {
                            _.each(data.appTemplates, function (item, index) {
                                tmpServiceTemplates = {};
                                tmpServiceTemplates.id = item.id;
                                tmpServiceTemplates.name = item.name;
                                tmpServiceTemplates.status = item.status;
                                tmpServiceTemplates.statusStr = appCommonData.getTemplateStatus(item.status);
                                tmpServiceTemplates.visibility = (item.vdcId === "all" ? i18n.common_term_system_label : i18n.org_term_organization_label);
                                tmpServiceTemplates.creator = item.userName;
                                tmpServiceTemplates.createTime = item.createTime;
                                tmpServiceTemplates.desc = item.description;
                                tmpServiceTemplates.type = (item.resPoolType === 'FusionManager' ? 'FusionManager' : 'OpenStack');
                                if ($scope.templateId && $scope.templateId === tmpServiceTemplates.id) {
                                    $scope.params.selServiceTemplate = tmpServiceTemplates;
                                }

                                serviceTemplates.push(tmpServiceTemplates);
                            });
                        }

                        $scope.serviceTemplateTable.data = serviceTemplates;
                        $scope.info.templateTable.displayLength = page.displayLength;
                        if ($scope.templateId) {
                            $scope.info.templateTable.totalRecords = serviceTemplates.length;
                        } else {
                            $scope.info.templateTable.totalRecords = data.total;
                        }
                    });
                }

                function queryAppBasicInfo() {
                    if (!$scope.params.appId) {
                        return;
                    }

                    var options = {
                        "user": user,
                        "id": $scope.params.appId,
                        "cloudInfraId": $scope.params.selResPoolId,
                        "vpcId": $scope.params.selVpcId
                    };
                    var deferred = appCommonServiceIns.queryAppBasicInfoResource(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        //修改应用初始化名称等
                        $scope.finishQueryApp = true;
                        $scope.params.appName = data.appName;
                        $scope.params.curLogo = data.picture;
                        $scope.params.selDescription = data.desc;
                        $scope.params.parameters = data.parameters || {};
                    });
                }

                queryServiceTemplate();
                if ($scope.params.isModify) {
                    queryAppBasicInfo();
                }
            }
        ];
        return ctrl;
    });
