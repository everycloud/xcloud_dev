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
        var orgVdcCtrl = ["$scope", "$compile", "$state", "camel",
            function ($scope, $compile, $state, camel) {
                var user = $("html").scope().user;

                //组织操作权限
                var ORG_VDC_OPERATE = "108101";
                var hasOrgOperateRight = _.contains(user.privilegeList, ORG_VDC_OPERATE);

                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.searchModel = {
                    orgVdcName: "",
                    start: 0,
                    limit: 10
                };
                $scope.searchBox = {
                    "id": "orgSearchBox",
                    "placeholder": $scope.i18n.org_orgVDC_add_info_inputVDCname_valid || "请输入组织VDC名称",
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.orgVdcName = searchString;
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

                var columns = [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_cpuMaxGHz_label || "CPU上限(GHz)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.cpuLimit);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_cpuLeftGHz_label || "剩余CPU(GHz)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.cpuFree);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_memoryMaxGB_label || "内存上限(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.memLimit);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_memoryLeftGB_label || "剩余内存(GHz)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.memFree);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_storageMaxGB_label || "存储上限(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageLimit);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_storageLeftGB_label || "剩余存储(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageFree);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_createAt_label || "创建时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTimeStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.org_term_belongsToVDC_label || "所属VDC",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vdcName || data.vdcId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label || "虚拟化环境",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hyperName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_zones_label || "资源分区",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.zoneName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label || "资源集群",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clusters);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label || "操作",
                        "mData": "operation",
                        "bSortable": false
                    }
                ];

                $scope.model = {
                    "id": "orgVdcListId",
                    "datas": [],
                    "columns": columns,
                    "visibility": {
                        "activate": "click",
                        "aiExclude": [0, 12],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {
                        }
                    },
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
                    "showDetails": false,

                    "renderRow": function (row, dataitem, index) {
                        $("td:eq(0)", row).addTitle();
                        $("td:eq(1)", row).addTitle();
                        $("td:eq(2)", row).addTitle();
                        $("td:eq(3)", row).addTitle();
                        $("td:eq(4)", row).addTitle();
                        $("td:eq(5)", row).addTitle();
                        $("td:eq(6)", row).addTitle();
                        $("td:eq(7)", row).addTitle();
                        $("td:eq(8)", row).addTitle();
                        $("td:eq(9)", row).addTitle();
                        $("td:eq(10)", row).addTitle();
                        $("td:eq(11)", row).addTitle();

                        // 操作栏
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a tabindex="-1" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                            '</ul>' +
                            '</span>';

                        var opt = "<div ng-show='hasOrgOperateRight'><a href='javascript:void(0)' ng-click='modifyOrgVdc()'>" + $scope.i18n.common_term_modify_button
                            + "</a><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + submenus + "</div>";
                        var optLink = $compile($(opt));
                        var optScope = $scope.$new(false);
                        optScope.hasOrgOperateRight = hasOrgOperateRight;
                        optScope.id = dataitem.id;
                        optScope.name = dataitem.name;
                        optScope.defaultOrg = dataitem.defaultOrg;
                        optScope.openstack = $scope.openstack;
                        optScope.memberManage = function () {
                            var memberManageWindow = new Window({
                                "winId": "memberManageWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.i18n.common_term_memberManage_label,
                                "content-type": "url",
                                "content": "app/business/user/views/organization/memberManage.html",
                                "height": 600,
                                "width": 800,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.modifyOrgVdc = function () {
                            var modifyWindow = new Window({
                                "winId": "modifyOrgVdcWindowId",
                                "orgVdcId": dataitem.id,
                                "title": $scope.i18n.common_term_modify_button || "修改",
                                "content-type": "url",
                                "content": "app/business/vdc/views/orgVdc/modifyOrgVdc.html",
                                "height": 500,
                                "width": 800,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.azManage = function () {
                            var azManageWindow = new Window({
                                "winId": "azManageWindowId",
                                "orgId": dataitem.id,
                                "title": $scope.i18n.org_term_AZmanage_button || "可用分区管理",
                                "content-type": "url",
                                "content": "app/business/user/views/organization/azManage.html",
                                "height": 600,
                                "width": 800,
                                "buttons": [
                                    null,
                                    null
                                ],
                                "close": function (event) {
                                    $scope.operator.query();
                                }
                            }).show();
                        };
                        optScope.delete = function () {
                            var deleteMsg = new Message({
                                "type": "confirm",
                                "title": $scope.i18n.common_term_confirm_label,
                                "content": $scope.i18n.org_vdc_delOrgVDC_info_confirm_msg || "确认要删除该组织VDC吗?",
                                "height": "150px",
                                "width": "350px",
                                "buttons": [
                                    {
                                        label: $scope.i18n.common_term_ok_button,
                                        accessKey: '2',
                                        "key": "okBtn",
                                        majorBtn : true,
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
                                var orgVdcId = optScope.model.datas[index].id;
                                $scope.operator.delete(orgVdcId, deleteMsg);
                            });
                            deleteMsg.setButton("cancelBtn", function () {
                                deleteMsg.destroy();
                            });
                            deleteMsg.show();
                        };

                        var optNode = optLink(optScope);
                        $("td[tdname='12']", row).html(optNode);
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
                    "text": $scope.i18n.org_term_addOrgVDC_button || "创建组织VDC",
                    "disable": !hasOrgOperateRight,
                    "iconsClass": "",
                    "create": function () {
                        $state.go("vdcMgr.createOrgVdc");
                    }
                };

                $scope.operator = {
                    "query": function () {
                        var url = "/goku/rest/v1.5/irm/org-vdcs?";
                        url = url + "start=" + $scope.searchModel.start;
                        url = url + "&limit=" + $scope.searchModel.limit;
                        var orgVdcName = $scope.searchModel.orgVdcName;
                        if (orgVdcName !== "") {
                            url = url + "&name=" + orgVdcName;
                        }
                        var deferred = camel.get({
                            "url": url,
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var data = [];
                                var orgListRes = response.orgVdcList;
                                var clusterNames = "";
                                for (var item in orgListRes) {
                                    orgListRes[item].createTimeStr = commonService.utcMilliseconds2Local(orgListRes[item].createTime);
                                    orgListRes[item].operation = "";
                                    var clusters = orgListRes[item].clusterNames;
                                    if (clusters && clusters.length > 0) {
                                        clusterNames = clusters.join(";");
                                    }
                                    orgListRes[item].clusters = clusterNames;
                                    data.push(orgListRes[item]);
                                }
                                $scope.model.datas = data;
                                $scope.model.totalRecords = response.total;
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "delete": function (orgVdcId, deleteMsg) {
                        var deferred = camel["delete"]({
                            "url": {
                                s: "/goku/rest/v1.5/irm/org-vdc/{id}",
                                o: {
                                    "id": orgVdcId
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
                    }
                };
                $scope.operator.query();
            }
        ];

        return orgVdcCtrl;
    });
