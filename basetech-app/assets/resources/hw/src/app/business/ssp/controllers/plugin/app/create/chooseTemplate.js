/**
 * Created on 14-2-27.
 */
/* global define */
define(["sprintf",
    "language/keyID",
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/business/ssp/controllers/plugin/app/constants",
    "app/business/ssp/services/plugin/app/appCommonService",
    "fixtures/appFixture"
], function (sprintf,keyIDI18n,$, angular, _, constants, appCommonService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile", "$state", "exception", "$stateParams", "appUtilService", "appCommonData", "$q",
        function ($scope, camel, $compile, $state, exception, $stateParams, appUtilService, appCommonData, $q) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $("html").scope().user;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            //选择模板
            $scope.serviceTemplateTable = {
                "data": []
            };

            $scope.params = {
                "fromFlag": 0,
                "approvalType" : null,
                "appTempBody": null,
                "selServiceTemplate": null,
                "serviceTemplate": {},
                "cloudInfraId": null,
                "selVpcId": null,
                "selVpcName": null,
                "resPoolFm": true,
                "appName": null,
                "curLogo": "buff01.jpg",
                "description": "",
                "logo": "",
                "networks": [],
                "commonParams": [],
                "templates": [],
                "softwares": [],
                "shells": []
            };

            $scope.params.templateId = $stateParams.templateId;
            $scope.params.fromFlag = $stateParams.fromFlag;
            $scope.params.approvalType = $stateParams.approvalType;

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            var searchScope = "";
            var searchName = "";
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
                    searchScope = $("#" + $scope.searchType.id).widget().getSelectedId();
                    queryServiceTemplate();
                }
            };

            $scope.searchBox = {
                "id": "app_apps_searchBoxId",
                "placeholder": i18n.app_term_findAppTemplateName_prom,
                "width": "350",
                "suggestSize": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (searchString) {
                    searchName = searchString;
                    queryServiceTemplate();
                }
            };

            $scope.info = {
                "templateTable": {
                    "id": "create-app-templateTable",
                    "enablePagination": true,
                    "draggable": true,
                    "displayLength": 10,
                    "totalRecords": 0,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": "",
                        "sWidth": "50px",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        }
                    }, {
                        "sTitle": i18n.template_term_applyRange_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.visibility);
                        }
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        }
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "30%",
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
                "preBtn": {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $state.go("createCatalogModule");
                    }
                },
                "okBtn": {
                    "id": "create-app-chooseTemplate-ok",
                    "text": i18n.common_term_next_button,
                    "disable": true,
                    "click": function () {
                        if (!$scope.params.selServiceTemplate) {
                            return;
                        }
                        if ($scope.params.selServiceTemplate.type === "FusionManager") {
                            $state.go("ssp.appCreateByTemplate.navigate",{
                                "appTemplateId" : $scope.params.selServiceTemplate.id,
                                "templateId" : $scope.params.templateId,
                                "approvalType" : $scope.params.approvalType
                            });
                        } else {
                            $state.go("ssp.createByOpenstack.navigate",{
                                "appTemplateId" : $scope.params.selServiceTemplate.id,
                                "templateId" : $scope.params.templateId,
                                "approvalType" : $scope.params.approvalType
                            });
                        }
                    }
                },

                "cancelBtn": {
                    "id": "create-app-chooseTemplate-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("ssp.catalog");
                    }
                }
            };

            function queryServiceTemplate(name) {
                if ($scope.params.selServiceTemplate && searchName && $scope.params.selServiceTemplate.name.indexOf(searchName) <= 0) {
                    $scope.params.selServiceTemplate = null;
                }
                var options = {
                    "user": user,
                    "visible": searchScope,
                    "status": "Published",
                    "name": searchName,
                    "limit": page.displayLength,
                    "start": page.getStart()
                };
                var deferred = appCommonServiceIns.queryServiceTemplate(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    if ((data.total === 0) || !data.appTemplates) {
                        $scope.serviceTemplateTable.data = [];
                        $scope.info.templateTable.displayLength = page.displayLength;
                        $scope.info.templateTable.totalRecords = 0;
                        return;
                    }
                    var serviceTemplates = [];
                    var tmpServiceTemplates = null;
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
                        if ($scope.templateId) {
                            if ($scope.templateId === tmpServiceTemplates.id) {
                                $scope.params.selServiceTemplate = tmpServiceTemplates;
                                serviceTemplates.push(tmpServiceTemplates);
                            }
                        } else {
                            serviceTemplates.push(tmpServiceTemplates);
                        }
                    });
                    $scope.serviceTemplateTable.data = serviceTemplates;
                    $scope.info.templateTable.displayLength = page.displayLength;
                    if ($scope.templateId) {
                        $scope.info.templateTable.totalRecords = serviceTemplates.length;
                    } else {
                        $scope.info.templateTable.totalRecords = data.total;
                    }
                });
            }

            queryServiceTemplate();
        }
    ];
    return ctrl;
});
