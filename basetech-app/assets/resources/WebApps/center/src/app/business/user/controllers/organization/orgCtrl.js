/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "app/services/commonService",
    "tiny-widgets/Window",
    'tiny-widgets/Message',
    "tiny-widgets/Columnchart",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/Searchbox",
    "bootstrap/bootstrap.min",
    "fixtures/userFixture"
],
    function ($, angular, ExceptionService, commonService, Window, Message, Columnchart) {
        "use strict";
        var orgCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;

                //组织操作权限
                var ORG_OPERATE = "108000";
                var hasOrgOperateRight = _.contains(user.privilegeList, ORG_OPERATE);

                var langConfig = {
                    zh: "zh_CN",
                    en: "en_US"
                };
                var locale = langConfig[window.urlParams.lang];

                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.downloadBtn = {
                    "id": "downloadBtnId",
                    "text": $scope.i18n.common_term_export_button,
                    "click": function () {
                        $scope.operator.exportVdcReport();
                    }
                };
                $scope.topStaticsBtn = {
                    "id": "topStaticsBtnId",
                    "display": (user.privilege.org_term_organization_label && $scope.deployMode !== "local"),
                    "text": $scope.i18n.perform_term_resourceTop_label || "资源TOP统计",
                    "click": function () {
                        var topStaticsWindow = new Window({
                            "winId": "topStaticsWindowId",
                            "title": $scope.i18n.perform_term_resourceTop_label || "资源TOP统计",
                            "content-type": "url",
                            "content": "app/business/user/views/organization/vdcStatistic.html",
                            "height": 600,
                            "width": 800,
                            "maximizable": false,
                            "minimizable": false,
                            "buttons": null
                        }).show();
                    }
                };
                $scope.searchModel = {
                    vdcName: "",
                    start: 0,
                    limit: 10
                };
                $scope.searchBox = {
                    "id": "orgSearchBox",
                    "placeholder": $scope.i18n.org_term_findVDC_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.vdcName = searchString;
                        $scope.model.curPage = {
                            "pageIndex": 1
                        };
                        $scope.searchModel.start = 0;
                        $scope.operator.query();
                    }
                };

                $scope.refresh = {
                    id: "refreshId",
                    disabled: false,
                    iconsClass: "",
                    text: $scope.i18n.common_term_fresh_button,
                    tip: "",
                    click: function () {
                        $scope.operator.query();
                    }
                };

                // 根据场景设置用户列表显示列
                var fusionSphereList = [
                    {
                        "sTitle": "", //设置第一列的标题
                        "sWidth": "40px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.org_term_vdcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sClass":"show-name-title"
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false,
                        "sClass":"show-id-title"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(commonService.utc2Local(data.createTime));
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sClass":"show-des-title"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }
                ];

                var openStackList = [
                    {
                        "sTitle": "", //设置第一列的标题
                        "sWidth": "40px",
                        "mData": "detail",
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.org_term_vdcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sClass":"show-name-title"
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false,
                        "sClass":"show-id-title"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sClass":"show-des-title"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "operation",
                        "bSortable": false
                    }
                ];
                var columns = [];
                if ($scope.openstack) {
                    columns = openStackList;
                } else {
                    columns = fusionSphereList;
                }

                $scope.model = {
                    "id": "orgListId",
                    "datas": [],
                    "columns": columns,
                    "pagination": true,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
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
                    "hideTotalRecords": false,
                    "showDetails": true,

                    "renderRow": function (row, dataitem, index) {
                        $('td.show-name-title',row).addTitle();
                        $('td.show-id-title',row).addTitle();
                        $('td.show-des-title',row).addTitle();
                        $(row).attr("orgId", $.encoder.encodeForHTMLAttribute(dataitem.id));
                        $(row).attr("lineNum", index);
                        //VDC列表的下钻详情处理
                        var widgetThis = this;
                        widgetThis.renderDetailTd.apply(widgetThis, arguments);

                        // 操作栏
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a tabindex="-1" ng-click="memberManage()">' + $scope.i18n.common_term_memberManage_label + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="rangeManage()" ng-if="!openstack">' + $scope.i18n.org_term_AZmanage_button + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="rangeManage()" ng-if="openstack">' + $scope.i18n.org_term_cloudPoolMgmt_button + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="networkManage()" ng-if="!openstack">' + $scope.i18n.org_term_externalNetMgmt_button + '</a></li>' +
                            '<li><a tabindex="-1" ng-click="delete()" ng-if="!defaultOrg">' + $scope.i18n.common_term_delete_button + '</a>' +
                            '<p class="link_disable fl" style="margin-left: 15px" ng-if="defaultOrg">' + $scope.i18n.common_term_delete_button + '</p></li>' +
                            '</ul>' +
                            '</span>';

                        var opt = "<div ng-show='hasOrgOperateRight'><a href='javascript:void(0)' ng-click='quotaManage()'>" + $scope.i18n.org_term_quotaMgt_button
                            + "</a><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + submenus + "</div>";
                        var optLink = $compile($(opt));
                        var optScope = $scope.$new(false);
                        optScope.hasOrgOperateRight = hasOrgOperateRight;
                        optScope.id = dataitem.id;
                        optScope.name = dataitem.name;
                        optScope.defaultOrg = dataitem.defaultOrg;
                        optScope.openstack = $scope.openstack;
                        optScope.isServiceCenter = $scope.isServiceCenter;
                        optScope.memberManage = function () {
                            var memberManageWindow = new Window({
                                "winId": "memberManageWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.i18n.common_term_memberManage_label,
                                "content-type": "url",
                                "content": "app/business/user/views/organization/memberManage.html",
                                "height": 600,
                                "width": 800,
                                "maximizable": false,
                                "minimizable": false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.networkManage = function () {
                            var networkManageWindow = new Window({
                                "winId": "networkManageWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.i18n.org_term_externalNetMgmt_button || "外部网络管理",
                                "content-type": "url",
                                "content": "app/business/user/views/organization/networkManage.html",
                                "height": 600,
                                "width": 800,
                                "maximizable": false,
                                "minimizable": false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.quotaManage = function () {
                            var modifyQuotaWindow = new Window({
                                "winId": "modifyQuotaWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.i18n.org_term_quotaMgt_button,
                                "content-type": "url",
                                "content": "app/business/user/views/organization/modifyQuota.html",
                                "height": 400,
                                "width": 600,
                                "maximizable": false,
                                "minimizable": false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.rangeManage = function () {
                            var azManageWindow = new Window({
                                "winId": "azManageWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.openstack ? ($scope.i18n.org_term_cloudPoolMgmt_button || "云资源池管理") : ($scope.i18n.org_term_AZmanage_button || "可用分区管理"),
                                "content-type": "url",
                                "content": "app/business/user/views/organization/" + ($scope.openstack ? "cloudInfrasManage" : "azManage") + ".html",
                                "height": 600,
                                "width": 830,
                                "maximizable": false,
                                "minimizable": false,
                                "buttons": null,
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.org_vdc_del_info_confirm_msg,
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn: true,
                                        default: true
                                    },
                                    {
                                        label: $scope.i18n.common_term_cancle_button,
                                        accessKey: '3',
                                        "key": "cancelBtn",
                                        default: false
                                    }
                                ]
                            });
                            deleteMsg.setButton("okBtn", function () {
                                var orgId = optScope.model.datas[index].id;
                                if (!$scope.openstack) {
                                    $scope.operator.associateNetworks(orgId, function () {
                                        $scope.operator.delete(orgId, deleteMsg);
                                    });
                                } else {
                                    $scope.operator.delete(orgId, deleteMsg);
                                }
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy();
                            });
                            deleteMsg.show();
                        };

                        var optNode = optLink(optScope);
                        if ($scope.openstack) {
                            $("td:eq(4)", row).html(optNode);
                        } else {
                            $("td:eq(5)", row).html(optNode);
                        }
                        optNode.find('.dropdown').dropdown();
                    },

                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    }
                };

                $scope.createBtn = {
                    "id": "createOrgBtnId",
                    "text": $scope.i18n.org_term_createVDC_button,
                    "disable": !hasOrgOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        $state.go("vdcMgr.createVdc");
                    }
                };

                var statisticsTypeValues = [
                    {
                        "selectId": "CPU",
                        "label": $scope.i18n.common_term_cpu_label || "CPU",
                        "checked": true
                    },
                    {
                        "selectId": "MEMORY",
                        "label": $scope.i18n.common_term_memory_label || "内存"
                    },
                    {
                        "selectId": "STORAGE",
                        "label": $scope.i18n.common_term_storage_label || "存储"
                    },
                    {
                        "selectId": "VPC",
                        "label": $scope.i18n.vpc_term_vpc_label || "VPC"
                    },
                    {
                        "selectId": "EIP",
                        "label": $scope.i18n.eip_term_eip_label || "EIP"
                    },
                    {
                        "selectId": "SEG",
                        "label": $scope.i18n.security_term_SG_label || "安全组"
                    },
                    {
                        "selectId": "VM",
                        "label": $scope.i18n.common_term_vm_label || "虚拟机"
                    }
                ];

                //对象类型下拉框
                $scope.statisticsTypeSelect = {
                    "id": "statisticsTypeSelectId",
                    "width": "150px",
                    "values": statisticsTypeValues,
                    "change": function () {
                        $scope.statisticsType = $("#statisticsTypeSelectId").widget().getSelectedId();
                        $scope.operator.getVDCStatistics($scope.statisticsType);
                    }
                };

                function getCharObject(chartId, series) {
                    try {
                        $("#" + chartId).find("div").remove();
                        var obj = {};
                        var cc = new Columnchart({
                            id: chartId,
                            width: "500px",
                            isFill: true,
                            style: "bold",
                            values: series
                        });
                        obj.chart = cc;
                        obj.id = chartId;
                        $scope.charCollection.push(obj);
                    } catch (e) {
                    }
                }

                $scope.operator = {
                    "query": function () {
                        var url = "/goku/rest/v1.5/vdcs?";
                        url = url + "start=" + $scope.searchModel.start;
                        url = url + "&limit=" + $scope.searchModel.limit;
                        var orgName = $scope.searchModel.vdcName;
                        if (orgName != "") {
                            url = url + "&name=" + orgName;
                        }
                        var deferred = camel.get({
                            "url": url,
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response == null || response == undefined) {
                                    return;
                                }
                                var data = [];
                                var orgListRes = response.vdcList;
                                for (var item in orgListRes) {
                                    orgListRes[item].detail = {
                                        contentType: "url",
                                        content: "app/business/user/views/organization/orgView.html"
                                    };
                                    orgListRes[item].operation = "";
                                    data.push(orgListRes[item]);
                                }
                                $scope.model.datas = data;
                                $scope.model.totalRecords = response.total;
                            });
                        });
                    },
                    "delete": function (orgId, deleteMsg) {
                        var deferred = camel["delete"]({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{id}",
                                o: {
                                    "id": orgId
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.query();
                                deleteMsg.destroy();
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "exportVdcReport": function () {
                        var deferred = camel.get({
                            "url": "/goku/rest/v1.5/reports/vdc-reports/file?locale=" + locale,
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (response && response.exportPath) {
                                    $scope.reportUrl = "/goku/rest/v1.5/file/" + $.encoder.encodeForURL(response.exportPath) + "?type=export";
                                    $("#downloadVDC").attr("src", $scope.reportUrl);
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "getVDCStatistics": function (statisticsType) {
                        var deferred = camel.get({
                            "url": "/goku/rest/v1.5/capacity-statistics/top-vdcs?type=" + statisticsType,
                            "params": {},
                            "timeout": 60000,
                            "userId": user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }

                                var quotaUtilizationInfo = response.quotaUtilizationInfo;
                                if (quotaUtilizationInfo) {
                                    var quotaArr = [];
                                    var series = {};
                                    for (var i = 0; i < quotaUtilizationInfo.length; i++) {
                                        var quotaInfo = quotaUtilizationInfo[i];
                                        var ar = {
                                            textValue: ($.encoder.encodeForHTML(quotaInfo.utilizationValue || 0)) + "%",
                                            name: $.encoder.encodeForHTML(quotaInfo.vdcName),
                                            value: parseInt(quotaInfo.utilizationValue || 0),
                                            initValue: 0,
                                            maxValue: 100,
                                            color: "#1FBE5C"
                                        };
                                        quotaArr.push(ar);
                                        series = {
                                            series: quotaArr
                                        };
                                    }
                                    getCharObject("quotaUtilizationInfoChart", series);
                                }

                                var resourceUtilizationInfo = response.resourceUtilizationInfo;
                                if (resourceUtilizationInfo) {
                                    var resourceArr = [];
                                    var series = {};
                                    for (var j = 0; j < resourceUtilizationInfo.length; j++) {
                                        var resourceInfo = resourceUtilizationInfo[j];
                                        var arr = {
                                            textValue: ($.encoder.encodeForHTML(resourceInfo.utilizationValue || 0)) + "%",
                                            name: resourceInfo.vdcName,
                                            value: parseInt(resourceInfo.utilizationValue || 0),
                                            initValue: 0,
                                            maxValue: 100,
                                            color: "#1FBE5C"
                                        };
                                        resourceArr.push(arr);
                                        series = {
                                            series: resourceArr
                                        };
                                    }
                                    getCharObject("resourceUtilizationInfoChart", series);
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    "associateNetworks": function (vdcId, callback) {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{vdc_id}/available-external-networks/action",
                                o: {
                                    vdc_id: vdcId
                                }
                            },
                            "params": JSON.stringify({associates: null}),
                            "userId": user.id
                        });
                        deferred.success(function (response, textStatus, jqXHR) {
                            callback && callback();
                        });
                        deferred.fail(function (jqXHR, textStatus, errorThrown) {
                            new ExceptionService().doException(jqXHR);
                        });
                    }
                };
                $scope.operator.query();
            }
        ];

        var dependency = [];
        var orgModule = angular.module("vdcMgr.vdc", dependency);
        orgModule.controller("vdcMgr.vdc.vdcList.ctrl", orgCtrl);
        return orgModule;
    });
