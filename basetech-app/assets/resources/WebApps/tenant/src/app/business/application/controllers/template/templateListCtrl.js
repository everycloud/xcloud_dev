/*global define*/
define([
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Table",
        "app/business/application/controllers/constants",
        'app/business/application/services/desiger/desigerService',
        'app/business/application/services/appCommonService',
        "tiny-lib/underscore",
        'app/services/timeService',
        'app/services/commonService',
        'app/services/messageService',
        "fixtures/appFixture"
    ],
    function ($, angular, Textbox, Button, Window, Progressbar, Checkbox, Table, constants, desigerService, appCommonService, _, timeService, commonService, messageService) {
        "use strict";

        var templateListCtrl = ["$rootScope", "$scope", "$compile", "$state", "camel", "exception", "$q", "message",
            function ($rootScope, $scope, $compile, $state, camel, exception, $q, message) {
                $scope.templateList = [];
                var timerInstance = new timeService();
                var user = $("html").scope().user;
                $scope.openstack = (user.cloudType === "ICT" ? true : false);
                var searchString = "";
                var desigerServiceIns = new desigerService(exception, $q, camel);
                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var messageServiceIns = new messageService();
                var i18n = $scope.i18n;
                $scope.hasOperateTemplRight = _.contains($rootScope.user.privilegeList, constants.privileges.OPERATE_APP_TEMPLATE);
                $scope.hasViewTemplRight = _.contains($rootScope.user.privilegeList, constants.privileges.VIEW_APP_TEMPLATE);

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 4,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.help = {
                    "helpKey": "drawer_template_app",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                $scope.createBtn = {
                    "id": "appTemplateListCreateId",
                    "text": i18n.common_term_create_button,
                    "disable": false,
                    "click": function () {
                        if (!$scope.openstack) {
                            //IT场景
                            $state.go("application.design", {
                                "mode": "create"
                            });
                        } else {
                            createOrUpdateTemplate("create", null);
                        }
                    }
                };

                $scope.importBtn = {
                    "id": "appTemplateListImportId",
                    "text": i18n.common_term_import_button,
                    "disable": false,
                    "click": function () {
                        $state.go("application.importTemplate.navigation", {"from":"application.manager.template"});
                    }
                };

                $scope.visibility = {
                    "id": "appTemplateListSearchAzId",
                    "values": [{
                        "selectId": "",
                        "label":i18n.common_term_allApplyRange_label,
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
                        getAppTemplate();
                    }
                };

                $scope.status = {
                    "id": "appTemplateListSearchRangeId",
                    "values": [{
                        "selectId": "",
                        "label": i18n.common_term_allStatus_value,
                        "checked": true
                    }, {
                        "selectId": "Draft",
                        "label":i18n.app_term_draft_label
                    }, {
                        "selectId": "Published",
                        "label": i18n.common_term_published_value
                    }],
                    "change": function () {
                        page.currentPage = 1;
                        getAppTemplate();
                    }
                };

                $scope.searchBox = {
                    "id": "appTemplateListSearchId",
                    "placeholder": i18n.app_term_findAppTemplateName_prom+":",
                    "width": "250",
                    "suggestSize": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchName) {
                        page.currentPage = 1;
                        searchString = searchName;
                        getAppTemplate();
                    }
                };

                $scope.refresh = {
                    "id": "appTemplateListRefreshId",
                    "title": i18n.common_term_fresh_button,
                    "click": function () {
                        searchString = $("#appTemplateListSearchId").widget().getValue();
                        getAppTemplate();
                    }
                };

                $scope.idView = {
                    "label": i18n.common_term_ID_label+":",
                    "value": ""
                };

                $scope.visibleRange = {
                    "label": i18n.common_term_allApplyRange_label+":",
                    "value": i18n.org_term_organization_label
                };

                $scope.creator = {
                    "label": i18n.user_term_createUser_button+":",
                    "value": "ORGAdmin"
                };

                $scope.createTime = {
                    "label": i18n.common_term_createAt_label+":",
                    "value": "2014-12-12 10:30"
                };

                $scope.description = {
                    "label": i18n.common_term_desc_label+":",
                    "value": ""
                };

                /**
                 * 发布或取消发布应用模板
                 *   对于取消发布，SC场景需要判断是否有服务模板使用该应用模板，如果有使用该应用模板，必须先取消发布服务模板。
                 * @param templateId
                 * @param publish true:发布  false：取消
                 */
                $scope.publishTemplate = function (templateId, publish) {
                    if (!templateId) {
                        return false;
                    }

                    // 对于取消发布，SC场景需要判断是否有服务模板使用该应用模板，如果有使用该应用模板，必须先取消发布服务模板。
                    if ($scope.isServiceCenter && !publish) {
                        var params = {
                            "user": user,
                            "id": templateId
                        };

                        var deffer = appCommonServiceIns.queryServices4AppTemplate(params);
                        deffer.then(function(data){
                            if(data && data.total > 0){
                                messageServiceIns.failMsgBox(i18n.app_template_canclePublish_info_service_msg || "已被服务模板引用，不能取消发布，请先取消发布相应的服务模板。");
                            }
                            else{
                                publishTemplateCallBack(templateId, publish);
                            }
                        });
                    }
                    else{
                        publishTemplateCallBack(templateId, publish);
                    }
                };

                function publishTemplateCallBack(templateId, publish){
                    if (!templateId) {
                        return false;
                    }

                    var options = {
                        "user": user,
                        "id": templateId,
                        "params": {
                            "publish": {
                                "status": (publish ? 'Published' : 'Draft')
                            }
                        }
                    };
                    var deferred = appCommonServiceIns.operateAppTemplate(options);
                    deferred.then(function (data) {
                        getAppTemplate();
                    });
                }

                $scope.create = function (templateId) {
                    if (user.cloudType === "IT") {
                        $state.go("appCreateByTemplate.navigate", {
                            "templateId": templateId,
                            "fromFlag": constants.fromFlag.FROM_TEMPLATE_LIST
                        });
                    } else {
                        $state.go("createByOpenstack.navigate", {
                            "templateId": templateId,
                            "fromFlag": constants.fromFlag.FROM_TEMPLATE_LIST
                        });
                    }
                };

                //模板修改
                $scope.modify = function (templateId) {
                    if ($scope.openstack) {
                        //查询模板详情
                        var options = {
                            "vdcId": user.vdcId,
                            "id": templateId,
                            "userId": user.id
                        };
                        var deferred = desigerServiceIns.queryAppTemplate(options);
                        deferred.then(function (data) {
                            createOrUpdateTemplate("modify", data, templateId);
                        });
                    } else {
                        $state.go("application.design", {
                            "templateId": templateId,
                            "mode": "modify"
                        });
                    }
                };

                //模板查看
                $scope.view = function (templateId) {
                    if (user.cloudType === "IT") {
                        $state.go("application.design", {
                            "templateId": templateId,
                            "mode": "view"
                        });
                    } else {
                        var options = {
                            "winId": "app-templateList-templateContent-winId",
                            "templateId": templateId,
                            "title": i18n.alarm_term_checkTemplateContent_button,
                            "width": "1000px",
                            "height": "750px",
                            "content-type": "url",
                            "minimizable":false,
                            "maximizable":false,
                            "content": "app/business/application/views/template/TemplateContent.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    }
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
                        "fromFlag": "1", //表示从模板列表,"2"表示从概览弹出
                        "title": str,
                        "width": "1000px",
                        "height": "750px",
                        "content-type": "url",
                        "maximizable":false,
                        "minimizable": false,
                        "content": "app/business/application/views/template/createTemplate.html",
                        "buttons": null,
                        "close": function () {
                            getAppTemplate();
                        },
                        "completeFn": function (response, status, xhr) {
                            if (status === 'error') {
                                camel.checkInvalidRequest(xhr.responseText);
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                $scope.appPagination = {
                    "id": "tempPaginationId",
                    "prevText": "prev",
                    "nextText": "next",
                    "type1": "full_numbers",
                    "curPage": {
                        "pageIndex": 1
                    },
                    "totalRecords": 0,
                    "display": true,
                    "options": [4],
                    "hideTotalRecords": false,
                    "hideDisplayLength": false,
                    "displayLength": 4,
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getAppTemplate();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getAppTemplate();
                    }
                };

                var ALL_CONTENTS = {
                    "copy": {
                        title: "<div class='msg-info'>"+i18n.common_term_copy_button+"</div>",
                        click: function (evt, item, widgetThis) {
                            var options = {
                                "winId": "app-templateList-copyTemplate-winId",
                                "templateId": widgetThis.options.id,
                                "title": i18n.common_term_copy_button,
                                "width": "640px",
                                "height": "480px",
                                "content-type": "url",
                                "content": "app/business/application/views/template/copyTemplate.html",
                                "buttons": null,
                                "close": function () {
                                    getAppTemplate();
                                },
                                "completeFn": function (response, status, xhr) {
                                    if (status === 'error') {
                                        camel.checkInvalidRequest(xhr.responseText);
                                    }
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        }
                    },
                    "export": {
                        title: "<div class='msg-info'>"+i18n.common_term_export_button+"</div>",
                        click: function (evt, item, widgetThis) {
                            exportTemplate(widgetThis.options.id);
                        }
                    },
                    "view": {
                        title: "<div class='msg-info'>"+i18n.alarm_term_checkTemplateContent_button+"</div>",
                        click: function (evt, item, widgetThis) {
                            var options = {
                                "winId": "app-templateList-templateContent-winId",
                                "templateId": widgetThis.options.id,
                                "title":i18n.alarm_term_checkTemplateContent_button,
                                "width": "840px",
                                "height": "700px",
                                "content-type": "url",
                                "minimizable":false,
                                "maximizable":false,
                                "content": "app/business/application/views/template/TemplateContent.html",
                                "buttons": null
                            };
                            var win = new Window(options);
                            win.show();
                        }
                    },
                    "deleter": {
                        title: "<div class='msg-info'>"+i18n.common_term_delete_button+"</div>",
                        click: function (evt, item, widgetThis) {
                            message.warnMsgBox({
                                "content": i18n.template_app_del_info_confirm_msg,
                                "callback": function () {
                                    deleteTemplate(widgetThis.options.id);
                                }
                            });
                        }
                    },
                    "debug": {
                        title: "<div class='msg-info'>"+i18n.common_term_Commission_button+"</div>",
                        click: function (evt, item, widgetThis) {
                            $scope.create(widgetThis.options.id);
                        }
                    }
                };

                function exportTemplate(templateId) {
                    if (!templateId) {
                        return false;
                    }

                    var appTemplate = getTemplateById(templateId);
                    if (!appTemplate) {
                        return false;
                    }

                    var options = {
                        "user": user,
                        "id": templateId
                    };
                    var deferred = appCommonServiceIns.exportAppTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        var exportResultData = {
                            "style": {
                                width: '100%'
                            },
                            "progress": "100%",
                            "path": data.filePath,
                            "templateName": appTemplate.templateName
                        };
                        var options = {
                            "winId": "app-templateList-export-winId",
                            "exportResultData": exportResultData,
                            "title": i18n.app_term_exportTemplate_button,
                            "width": "600px",
                            "height": "450px",
                            "content-type": "url",
                            "content": "app/business/application/views/template/templateExport.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    });
                }

                function deleteTemplate(templateId) {
                    if (!templateId) {
                        return false;
                    }

                    var defered = camel["delete"]({
                        "url": {
                            "s": "/goku/rest/v1.5/{vdc_id}/apptemplates/{id}",
                            "o": {
                                "vdc_id": user.vdcId,
                                "id": templateId
                            }
                        },
                        "userId": user.id,
                        "params": {}
                    });
                    defered.success(function (data) {
                        getAppTemplate();
                    });
                    defered.fail(function (data) {
                        if (!exception.isException(data)) {
                            exception.doFaultPopUp();
                            return;
                        }
                        exception.doException(data);
                    });
                }

                function getTemplateById(templateId) {
                    if (!templateId || !$scope.templateList) {
                        return null;
                    }

                    var template = null;
                    for (var i = 0; i < $scope.templateList.length; i++) {
                        template = $scope.templateList[i];
                        if (template && (templateId === template.templateId)) {
                            return template;
                        }
                    }

                    return null;
                }

                function getAppTemplate() {
                    var visibility = ($("#appTemplateListSearchAzId").widget() && $("#appTemplateListSearchAzId").widget().getSelectedId()) || "";
                    var status = ($("#appTemplateListSearchRangeId").widget() && $("#appTemplateListSearchRangeId").widget().getSelectedId()) || "";
                    var options = {
                        "user": user,
                        "visible": visibility,
                        "status": status,
                        "name": searchString,
                        "limit": page.displayLength,
                        "start": page.getStart()
                    };
                    var deferred = appCommonServiceIns.queryServiceTemplate(options);
                    deferred.then(function (data) {
                        var templateList = [];
                        if (data.appTemplates) {
                            var template = null;
                            for (var i = 0; i < data.appTemplates.length; i++) {
                                template = {};
                                template.templateId = data.appTemplates[i].id;
                                template.templateName = data.appTemplates[i].name;
                                template.nameShorten = appCommonServiceIns.genSerialName(template.templateName, 20);
                                template.templateDesc = data.appTemplates[i].description;
                                template.createTime = commonService.utc2Local(data.appTemplates[i].createTime);
                                template.vdcId = data.appTemplates[i].vdcId;
                                template.vdcName = data.appTemplates[i].vdcName;
                                template.picture = data.appTemplates[i].picture;
                                template.resPoolType = data.appTemplates[i].resPoolType;
                                template.status = data.appTemplates[i].status;
                                template.userId = data.appTemplates[i].userId;
                                template.userName = data.appTemplates[i].userName;
                                if (!template) {
                                    continue;
                                }
                                template.moreBtn = getMoreBtnByStatus(template.status, template.userId);
                                templateList.push(template);
                            }
                        }
                        //组合
                        $scope.templateList = templateList;
                        $scope.appPagination.totalRecords = data.total;
                    });
                }

                function getMoreBtnByStatus(status, userId) {
                    var moreBtnContent = [];
                    var moreBtnPublished = {
                        "text": "<span>"+i18n.common_term_more_button+"</span>",
                        "type": "button",
                        "content": [],
                        "clickCallback": function () {}
                    };
                    var moreBtnUnPublished = {
                        "text": "<span>"+i18n.common_term_more_button+"</span>",
                        "type": "button",
                        "content": [],
                        "clickCallback": function () {}
                    };

                    if (!$scope.hasOperateTemplRight) {
                        if (status === 'Published') {
                            moreBtnContent.push(ALL_CONTENTS.view);
                            moreBtnContent.push(ALL_CONTENTS.export);
                            moreBtnPublished.content = moreBtnContent;
                            return moreBtnPublished;
                        } else {
                            moreBtnContent.push(ALL_CONTENTS.debug);
                            moreBtnUnPublished.content = moreBtnContent;
                            return moreBtnUnPublished;
                        }
                    }

                    if (status === 'Published') {
                        moreBtnContent.push(ALL_CONTENTS.copy);
                        moreBtnContent.push(ALL_CONTENTS["export"]);
                        moreBtnContent.push(ALL_CONTENTS.view);
                        moreBtnPublished.content = moreBtnContent;
                        return moreBtnPublished;
                    } else {
                        moreBtnContent.push(ALL_CONTENTS.deleter);
                        moreBtnContent.push(ALL_CONTENTS.debug);
                        moreBtnUnPublished.content = moreBtnContent;
                        return moreBtnUnPublished;
                    }
                }

                $scope.$on("$viewContentLoaded", function () {
                    getAppTemplate();
                });
            }
        ];

        return templateListCtrl;
    });
