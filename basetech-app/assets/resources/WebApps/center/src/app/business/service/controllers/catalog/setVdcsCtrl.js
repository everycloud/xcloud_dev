/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "app/business/service/services/catalog/catalogService",
    "language/keyID",
    "tiny-widgets/Checkbox",
    "fixtures/userFixture"],
    function ($, angular, httpService, ExceptionService, MessageService, commonService, CatalogService, keyID, Checkbox) {
        "use strict";
        var setVdcsCtrl = ["$scope", "$compile", "camel", "$q", function ($scope, $compile, camel, $q) {
            var $rootScope = $("html").
                scope();
            var user = $rootScope.user;
            var i18n = $rootScope.i18n;
            var setVdcWindowWidget = $("#setVdcWindowId").widget();
            var exception = new ExceptionService();
            var catalogServiceIns = new CatalogService(exception, $q, camel);
            var serviceInstance = setVdcWindowWidget.option("serviceInstance");
            var DEFAULT_PAGE_NUM = commonService.DEFAULT_TABLE_PAGE_LENGTH;
            var ALL_VDC = 1;
            var SELECT_VDC = 2;
            var SPER = "@";

            var vdcWhiteList = serviceInstance.vdcWhiteList;
            var whiteListFlag = serviceInstance.whiteListFlag;
            var vdcWhiteIdList = [];
            if (whiteListFlag) {
                for (var i = 0, len = vdcWhiteList.length; i < len; i++) {
                    var item = vdcWhiteList[i];
                    item && item.id && vdcWhiteIdList.push(item.id);
                }
            }


            var showVDCs = [];
            var selectedVDCs = [];

            var idPrefix = "canSelectedVdcId_";
            var tblHeaderCheckbox = new Checkbox({
                "checked": false,
                "change": function () {
                    var list = showVDCs;
                    var checkedAll = tblHeaderCheckbox.option("checked");
                    for (var i = 0, len = list.length; i < len; i++) {
                        var id = idPrefix + list[i].id;
                        //防止id有特殊字符串，不能做jq的选择器
                        var dom = document.getElementById(id);
                        if (dom) {
                            var checked = $(dom).widget().option("checked");
                            if (checked !== checkedAll && list[i].id !== user.id) {
                                $(dom).widget().option("checked", checkedAll);
                                selectVDC(list[i], checkedAll, true);
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.rightTable.data = $.extend([], selectedVDCs);
                    });
                }
            });
            var ifChecked = function (id) {
                var SPER = ";";
                var selectedIds = [];
                for (var j = 0, selectedLen = selectedVDCs.length; j < selectedLen; j++) {
                    selectedIds.push(selectedVDCs[j].id);
                }
                var selectedIdsStr = SPER + selectedIds.join(SPER) + SPER;
                if (-1 === selectedIdsStr.indexOf(SPER + id + SPER)) {
                    return false;
                }
                return true;
            };
            var ifAllChecked = function (list) {
                var len = list && list.length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        if (!ifChecked(list[i].id)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            };
            var renderTbHeaderCheckbox = function (list) {
                var allChecked = ifAllChecked(list);
                tblHeaderCheckbox.option("checked", allChecked);
                tblHeaderCheckbox.rendTo($("#tableHeaderCheckbox"));
            };
            var selectVDC = function (vdc, checked, disableChange) {
                if (checked) {
                    selectedVDCs.push(vdc);
                } else {
                    for (var i = 0, len = selectedVDCs.length; i < len; i++) {
                        if (selectedVDCs[i].id === vdc.id) {
                            selectedVDCs.splice(i, 1);
                            var dom = document.getElementById(idPrefix + vdc.id);
                            dom && $(dom).widget().option("checked", false);
                            break;
                        }
                    }
                }
                var allChecked = ifAllChecked(showVDCs);
                tblHeaderCheckbox.option("checked", allChecked);
                if (!disableChange) {
                    $scope.rightTable.data = $.extend([], selectedVDCs);
                }
            };

            $scope.choiceVdcs = whiteListFlag;
            $scope.vdcRange = {
                "id": "vdcRangeId",
                "label": "",
                "spacing": {
                    "width": "150px",
                    "height": "30px"
                },
                "values": [
                    {
                        "key": ALL_VDC,
                        "text": i18n.common_term_all_label || "全部",
                        "checked": !$scope.choiceVdcs
                    },
                    {
                        "key": SELECT_VDC,
                        "text": i18n.common_term_designation_label || "指定",
                        "checked": $scope.choiceVdcs
                    }
                ],
                "layout": "horizon",
                "change": function () {
                    var selectedId = $("#" + $scope.vdcRange.id).widget().opChecked("checked");
                    $scope.choiceVdcs = selectedId == SELECT_VDC;
                    if ($scope.choiceVdcs && showVDCs.length == 0) {
                        $scope.operator.querySelectedVDC();
                    }
                }
            };

            $scope.domainId = setVdcWindowWidget.option("domainId") || "";

            $scope.vdcSelectModel = {
                "canSelectVDCLabel": i18n.common_term_waitChoose_value || "待选择",
                "vdcSelectedLabel": i18n.common_term_choosed_value || "已选择"
            };
            $scope.leftVDCSearchBox = {
                "id": "leftVDCSearchBoxId",
                "placeholder": i18n.org_term_findVDC_prom || "请输入VDC名称",
                "width": "150px",
                "suggestSize": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    var trimUserName = $.trim(searchString);
                    $scope.searchModel.name = trimUserName;
                    $scope.searchModel.start = 0;
                    $scope.operator.queryVDC();
                }
            };

            $scope.leftTable = {
                "id": "addVDCLeftTableId",
                "data": [],
                "columns": [
                    {
                        "sTitle": "<div id='tableHeaderCheckbox'></div>",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData": "check",
                        "sClass": "check",
                        "sWidth": 26
                    },
                    {
                        "sTitle": i18n.org_term_vdcName_label || "VDC名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_desc_label || "描述",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }
                ],
                "pagination": true,
                "paginationStyle": "simple",
                "lengthChange": true,
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": DEFAULT_PAGE_NUM,
                "hideTotalRecords": false,
                "showDetails": false,
                "renderRow": function (row, dataitem, index) {
                    var vdcId = dataitem.id;

                    var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                        "<tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox>" +
                        "</div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = dataitem;
                    selBoxScope.id = idPrefix + vdcId;

                    selBoxScope.checked = ifChecked(vdcId);
                    selBoxScope.change = function () {
                        var checked = $("#" + idPrefix + vdcId).widget().option("checked");
                        selectVDC(showVDCs[index], checked);

                        var allChecked = ifAllChecked(showVDCs);
                        tblHeaderCheckbox.option("checked", allChecked);
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td.check", row).append(selBoxNode);
                },

                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.queryVDC();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operator.queryVDC();
                }
            };
            $scope.rightTable = {
                "id": "addVDCRightTableId",
                "data": [],
                "columns": [
                    {
                        "sTitle": i18n.org_term_vdcName_label || "VDC名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_desc_label || "描述",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sWidth": 160
                    },
                    {
                        "sTitle": i18n.common_term_operation_label || "操作",
                        "mData": "",
                        "bSortable": false,
                        "sClass": "del",
                        "sWidth": 50
                    }
                ],
                "pagination": false,
                "renderRow": function (row, dataitem, index) {
                    var vdcId = dataitem.id;

                    dataitem.checked = !!selectedVDCs[vdcId];
                    var deleteText = i18n.common_term_delete_button || "删除";
                    var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                    var compiledDelTemplate = $compile(delTemplate);
                    var delDomScope = $scope.$new();
                    delDomScope.remove = function () {
                        selectVDC(dataitem, false);
                    };
                    var delDom = compiledDelTemplate(delDomScope);
                    $("td.del", row).append(delDom);
                }
            };
            $scope.setVDCSaveBtn = {
                "id": "setVDCSaveBtnId",
                "text": i18n.common_term_save_label || "保存",
                "click": function () {
                    $scope.operator.setVDCs();
                }
            };
            //取消按钮
            $scope.setVDCCancelBtn = {
                "id": "setVDCCancelBtnId",
                "text": i18n.common_term_cancle_button || "取消",
                "click": function () {
                    setVdcWindowWidget.destroy();
                }
            };
            $scope.searchModel = {
                "start": 0,
                "limit": DEFAULT_PAGE_NUM,
                "name": ""
            };
            var parseTableData = function (response) {
                response = response || {vdcList: [], total: 0};
                showVDCs = response.vdcList;
                $scope.$apply(function () {
                    $scope.leftTable.data = showVDCs;
                    $scope.leftTable.totalRecords = response.total;
                });
                renderTbHeaderCheckbox(showVDCs);
            };

            $scope.operator = {
                "queryVDC": function () {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/vdcs",
                        "params": $scope.searchModel,
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        parseTableData(response);
                    });
                },

                "querySelectedVDC": function () {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/vdcs",
                        "params": {
                            start: 0,
                            limit: 50
                        },
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        response = response || {vdcList: [], total: 0};
                        var allId = SPER + vdcWhiteIdList.join(SPER) + SPER;
                        var list = response.vdcList;
                        selectedVDCs = [];
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (allId.indexOf(SPER + list[i].id + SPER) > -1) {
                                selectedVDCs.push(list[i]);
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightTable.data = selectedVDCs;
                        });

                        $scope.operator.queryVDC();
                    });
                },

                "setVDCs": function () {
                    var list = [];
                    if ($scope.choiceVdcs) {
                        for (var index = 0, len = selectedVDCs.length; index < len; index++) {
                            var vdcId = selectedVDCs[index].id;
                            list.push({id:vdcId});
                        }
                    } else {
                        list = null;
                    }

                    var promise = catalogServiceIns.modifyServices({
                        user: user,
                        serviceId: serviceInstance.id,
                        params: {
                            name:serviceInstance.name,
                            description:serviceInstance.description,
                            catalogs:serviceInstance.catalogs,
                            approveType:serviceInstance.approveType,
                            vdcWhiteList: list,
                            whiteListFlag: $scope.choiceVdcs
                        }
                    });
                    promise.then(function (response) {
                        setVdcWindowWidget.destroy();
                    });
                }
            };

            // 初始化VDC列表
            if (whiteListFlag) {
                $scope.operator.querySelectedVDC();
            }
        }];

        var dependency = ["ng", "wcc"];
        var app = angular.module("service.catalog.setVdcs", dependency);
        app.controller("service.catalog.setVdcs.ctrl", setVdcsCtrl);
        app.service("camel", httpService);
        return app;
    })
;
