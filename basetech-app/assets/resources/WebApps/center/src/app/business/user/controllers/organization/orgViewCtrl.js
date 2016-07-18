/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/orgService",
    "app/services/exceptionService",
    "app/services/commonService",
    "tiny-widgets/Window",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/userFixture"
],
    function ($, angular, http, OrgService, ExceptionService, commonService, Window, ValidatorService, UnifyValid) {
        "use strict";
        var orgDetailCtrl = ["$scope", '$compile', 'camel', 'validator',
            function ($scope, $compile, camel, validator) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n = $("html").scope().i18n;
                //组织操作权限
                var ORG_OPERATE = "108000";
                var hasOrgOperateRight = _.contains(user.privilegeList, ORG_OPERATE);
                $scope.hasOrgOperateRight = hasOrgOperateRight;

                var ORG_VIEW = "108001";
                $scope.hasOrgViewRight = _.contains(user.privilegeList, ORG_VIEW);

                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.id = "";
                $scope.domId = "";
                $scope.allAz = true;
                $scope.orgService = new OrgService();
                $scope.orgDetail = {};
                $scope.name = {
                    "label": $scope.i18n.org_term_vdcName_label + ":",
                    "id": "orgDetailNameId",
                    "modifying": false,
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(64):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}) +
                        ";regularCheck(" + validator.vdcNameReg + "):" + $scope.i18n.common_term_composition2_valid,
                    "clickModify": function () {
                        $scope.name.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#orgDetailNameId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        var result = UnifyValid.FormValid($("#orgBasicInfoDiv"));
                        if (!result) {
                            return;
                        }

                        $scope.orgDetail.name = $("#orgDetailNameId").widget().getValue();
                        $scope.name.modifying = false;
                        $scope.operator.modifyOrgDetail({
                            "name": $scope.orgDetail.name
                        });
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            var result = UnifyValid.FormValid($("#orgBasicInfoDiv"));
                            if (!result) {
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.orgDetail.name = $("#orgDetailNameId").widget().getValue();
                                $scope.name.modifying = false;
                                $scope.operator.modifyOrgDetail({
                                    "name": $scope.orgDetail.name
                                });
                            });
                        }
                    }
                };
                $scope.description = {
                    "id": "orgDetailDescId",
                    "value": "",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "modifying": false,
                    "type": "multi",
                    "width": "300px",
                    "height": "60px",
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 128}),
                    "clickModify": function () {
                        $scope.description.modifying = true;

                        //延时一会，否则获取不到焦点
                        setTimeout(function () {
                            $("#orgDetailDescId input").focus();
                        }, 50);
                    },
                    "blur": function () {
                        var result = UnifyValid.FormValid($("#orgBasicInfoDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.orgDetail.description = $("#orgDetailDescId").widget().getValue();
                        $scope.description.modifying = false;
                        $scope.operator.modifyOrgDetail({
                            "description": $scope.orgDetail.description
                        });
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            var result = UnifyValid.FormValid($("#orgBasicInfoDiv"));
                            if (!result) {
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.orgDetail.description = $("#orgDetailDescId").widget().getValue();
                                $scope.description.modifying = false;
                                $scope.operator.modifyOrgDetail({
                                    "description": $scope.orgDetail.description
                                });
                            });
                        }
                    }
                };
                $scope.orgAz = {
                    "id": "orgAzId",
                    "label": ($scope.openstack ? ($scope.i18n.org_term_cloudPoolRange_button || "云资源池范围") : ($scope.i18n.resource_term_AZrange_label || "可用分区范围")) + ":",
                    "require": false,
                    "value": $scope.i18n.common_term_notLimit_value || 0,
                    "click": function () {
                        $scope.azList();
                    }
                };
                $scope.orgMember = {
                    "id": "orgMemberId",
                    "label": $scope.i18n.common_term_memberNum_label + ":",
                    "require": false,
                    "value": "-",
                    "click": function () {
                        $scope.memberManage();
                    }
                };
                var quotaNameConfig = {
                    "CPU": $scope.i18n.common_term_cpu_label,
                    "MEMORY": $scope.i18n.common_term_memory_label+"(MB)",
                    //存储
                    "STORAGE": $scope.i18n.common_term_storage_label+"(GB)",
                    "VPC": $scope.i18n.vpc_term_vpc_label,
                    //弹性IP
                    "EIP": $scope.i18n.eip_term_eip_label,
                    //安全组
                    "SEG": $scope.i18n.security_term_SG_label,
                    //虚拟机
                    "VM": $scope.i18n.common_term_vm_label
                };

                $scope.resourceUseInfo = {
                    "id": "resourceUseInfoId",
                    "caption": null,
                    "datas": [],
                    "columns": [
                        {
                            "sTitle": $scope.i18n.common_term_resource_label,
                            "mData": function (data) {
                                return quotaNameConfig[data.quotaName] || "";
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_UsageRate_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.usedRatio);
                            },
                            "sWidth": "35%",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_total_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.total);
                            },
                            "sWidth": "15%",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_used_value,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.used);
                            },
                            "sWidth": "15%",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_noUse_value,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML("" + data.free);
                            },
                            "sWidth": "15%",
                            "bSortable": false
                        }
                    ],
                    "tableLanguage":{sEmptyTable : $scope.i18n.common_term_loading_label || "数据加载中"},
                    "pagination": false,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": true,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 6000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false
                };
                $scope.createTime = {
                    "value": "",
                    "label": $scope.i18n.common_term_createAt_label + ":",
                    "type": "input",
                    "readonly": true
                };

                $scope.azList = function () {
                    var modifyAzWindow = new Window({
                        "winId": "azListWindowId",
                        "orgId": $scope.id,
                        "title": ($scope.openstack ? i18n.cloud_term_cloudPool_label : i18n.resource_term_Azs_label),
                        "content-type": "url",
                        "content": "app/business/user/views/organization/" + ($scope.openstack ? "cloudInfrasList" : "azList") + ".html",
                        "height": 600,
                        "width": 800,
                        "maximizable":false,
                        "minimizable":false,
                        "buttons": null,
                        "close": function (event) {
                            if ($scope.openstack) {
                                $scope.operator.getCloudInfrasNumber();
                            } else {
                                $scope.operator.getAzNumber();
                            }
                        }
                    }).show();
                };
                $scope.memberManage = function () {
                    var memberManageWindow = new Window({
                        "winId": "memberManageWindowId",
                        "orgId": $scope.id,
                        "title": $scope.i18n.common_term_memberManage_label,
                        "content-type": "url",
                        "content": "app/business/user/views/organization/memberManage.html",
                        "height": 600,
                        "width": 800,
                        "maximizable":false,
                        "minimizable":false,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operator.getMemberNumber();
                        }
                    }).show();
                };

                $scope.operator = {
                    "getOrgDetail": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "timeout": 60000,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var orgInfo = response.vdcInfo;
                                if (orgInfo === null) {
                                    return;
                                }
                                $scope.orgDetail.name = orgInfo.name;
                                $scope.orgDetail.description = orgInfo.description;
                                $scope.orgDetail.defaultOrg = orgInfo.defaultVdc;

                                var quotaInfo = orgInfo.quotaInfo;
                                var quotaUsage = orgInfo.quotaUsage;
                                $scope.resourceUseInfo.datas = $scope.orgService.getResourceUseInfo(orgInfo.allQuota, quotaInfo, quotaUsage);
                            });
                        });
                    },
                    "modifyOrgDetail": function (params) {
                        var deferred = camel.put({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            var preDom = $("#" + $scope.domId).parent().parent().parent().prev();
                            $("td:eq(1)", preDom).html($.encoder.encodeForHTML($scope.orgDetail.name));
                            if ($scope.openstack) {
                                $("td:eq(3)", preDom).html($.encoder.encodeForHTML($scope.orgDetail.description));
                            } else {
                                $("td:eq(4)", preDom).html($.encoder.encodeForHTML($scope.orgDetail.description));
                            }
                        });
                        deferred.fail(function (response) {
                            var preDom = $("#" + $scope.domId).parent().parent().parent().prev();
                            $scope.orgDetail.name = $("td:eq(1)", preDom).html();
                            if ($scope.openstack) {
                                $scope.orgDetail.description = $("td:eq(3)", preDom).html();
                            } else {
                                $scope.orgDetail.description = $("td:eq(4)", preDom).html();
                            }

                            new ExceptionService().doException(response);
                        });
                    },
                    "getAzNumber": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.orgAz.value = 0;
                                if (response && response.azInfos) {
                                    $scope.orgAz.value = response.azInfos.length || 0;
                                }
                            });
                        });
                    },
                    "getCloudInfrasNumber": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                                o: {
                                    "id": $scope.id
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.orgAz.value = 0;
                                if (response && response.azInfos) {
                                    $scope.orgAz.value = response.azInfos.length || 0;
                                }
                            });
                        });
                    },
                    "getMemberNumber": function () {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/users/list",
                                o: {
                                    "tenant_id": "1"
                                }
                            },
                            "params": JSON.stringify({
                                "start": 0,
                                "limit": 10,
                                "vdcId": $scope.id
                            }),
                            "userId": user.id,
                            "timeout": 60000
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    $scope.orgMember.value = 0;
                                    return;
                                }
                                $scope.orgMember.value = response.total;
                            });

                        });
                    }
                };
            }
        ];

        var dependency = [];
        var orgDetailModule = angular.module("userMgr.orgView", dependency);
        orgDetailModule.controller("userMgr.orgView.ctrl", orgDetailCtrl);
        orgDetailModule.service("camel", http);
        orgDetailModule.service("validator", ValidatorService);
        return orgDetailModule;
    });
