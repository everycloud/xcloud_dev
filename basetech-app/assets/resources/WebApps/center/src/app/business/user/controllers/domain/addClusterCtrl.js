define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/domainService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "tiny-widgets/Checkbox",
    "fixtures/userFixture"],
    function ($, angular, httpService, DomainService, ExceptionService, MessageService, commonService, Checkbox) {
        "use strict";
        var addClusterCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var $rootScope = $("html").scope();
            var user = $rootScope.user;
            var i18n = $rootScope.i18n;
            var addClusterWindowWidget = $("#addClusterWindowId").widget();
            var DEFAULT_PAGE_NUM = commonService.DEFAULT_TABLE_PAGE_LENGTH;

            var canSelectedClusters = [];
            var showClusters = [];
            var selectedClusters = [];

            var idPrefix = "canSelectedClusterID_";
            var tblHeaderCheckbox = new Checkbox({
                "checked": false,
                "change": function () {
                    var list = showClusters;
                    var checkedAll = tblHeaderCheckbox.option("checked");
                    for (var i = 0, len = list.length; i < len; i++) {
                        var id = idPrefix + list[i].feId;
                        //防止id有特殊字符串，不能做jq的选择器
                        var dom = document.getElementById(id);
                        if (dom) {
                            var checked = $(dom).widget().option("checked");
                            if (checked !== checkedAll) {
                                $(dom).widget().option("checked", checkedAll);
                                selectCluster(list[i], checkedAll, true);
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.rightTable.data = $.extend([], selectedClusters);
                    });
                }
            });
            var ifChecked = function (id) {
                //分号，这儿的id中包含特殊字符冒号：美刀$，需要注意一下
                var SPER = ";";
                var selectedIds = [];
                for (var j = 0, selectedLen = selectedClusters.length; j < selectedLen; j++) {
                    selectedIds.push(selectedClusters[j].id);
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
            var selectCluster = function (cluster, checked, disableChange) {
                if (checked) {
                    selectedClusters.push(cluster);
                } else {
                    for (var i = 0, len = selectedClusters.length; i < len; i++) {
                        if (selectedClusters[i].id === cluster.id) {
                            selectedClusters.splice(i, 1);
                            var dom = document.getElementById(idPrefix + cluster.feId);
                            dom && $(dom).widget().option("checked", false);
                            break;
                        }
                    }
                }

                var allChecked = ifAllChecked(showClusters);
                tblHeaderCheckbox.option("checked", allChecked);
                $scope.addClusterSaveBtn.disable = !selectedClusters.length;
                if (!disableChange) {
                    $scope.rightTable.data = $.extend([], selectedClusters);
                }
            };

            $scope.domainId = addClusterWindowWidget.option("domainId") || "";
            $scope.domainService = new DomainService();
            $scope.clusterSelectModel = {
                "canSelectClusterLabel": i18n.common_term_waitChoose_value || "待选择",
                "clusterSelectedLabel": i18n.common_term_choosed_value || "已选择"
            };
            $scope.leftClusterSearchBox = {
                "id": "leftClusterSearchBoxId",
                "placeholder": i18n.common_term_findName_prom || "请输入名称",
                "width": "150px",
                "suggestSize": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.serverSearchModel.name = $.trim(searchString);
                    $scope.operator.getUnDomainCluster();
                }
            };

            $scope.leftTable = {
                "id": "addClusterLeftTableId",
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
                        "sTitle": i18n.common_term_name_label || "名称",
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
                    var clusterId = dataitem.feId;

                    var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                        "<tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox>" +
                        "</div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = dataitem;
                    selBoxScope.id = idPrefix + clusterId;
                    selBoxScope.checked = ifChecked(clusterId);
                    selBoxScope.change = function () {
                        //clusterId 中包含jq selector的关键字，不能是解使用jq后去dom
                        var dom = document.getElementById(idPrefix + clusterId);
                        var checked = $(dom).widget().option("checked");
                        selectCluster(dataitem, checked);

                        var allChecked = ifAllChecked(showClusters);
                        tblHeaderCheckbox.option("checked", allChecked);
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td.check", row).append(selBoxNode);
                },

                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    parseTableData();
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = evtObj.displayLength;
                    parseTableData();
                }
            };
            $scope.rightTable = {
                "id": "addClusterRightTableId",
                "data": [],
                "columns": [
                    {
                        "sTitle": i18n.common_term_name_label || "名称",
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
                    var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + (i18n.common_term_delete_button || "删除") + "</a>";
                    var compiledDelTemplate = $compile(delTemplate);
                    var delDomScope = $scope.$new();
                    delDomScope.remove = function () {
                        selectCluster(dataitem, false);
                    };
                    var delDom = compiledDelTemplate(delDomScope);
                    $("td.del", row).append(delDom);
                }
            };
            $scope.addClusterSaveBtn = {
                "id": "addClusterSaveBtnId",
                "text": i18n.common_term_save_label || "保存",
                "disable": true,
                "click": function () {
                    $scope.operator.addCluster();
                }
            };
            //取消按钮
            $scope.addClusterCancelBtn = {
                "id": "addClusterCancelBtnId",
                "text": i18n.common_term_cancle_button || "取消",
                "click": function () {
                    addClusterWindowWidget.destroy();
                }
            };
            $scope.searchModel = {
                "start": 0,
                "limit": DEFAULT_PAGE_NUM,
                "userName": ""
            };
            $scope.serverSearchModel = {
                "start": 0,
                "limit": 100
            };
            var parseTableData = function () {
                var len = canSelectedClusters && canSelectedClusters.length;
                var start = $scope.searchModel.start;
                var end = $scope.searchModel.start + $scope.searchModel.limit;
                //reset
                showClusters = [];
                if (len && len > start) {
                    //取最小值
                    len < end && (end = len);
                    for (; start < end; start++) {
                        showClusters.push(canSelectedClusters[start]);
                    }
                }
                var leftTableData = $.extend([], showClusters);
                $scope.$apply(function () {
                    $scope.leftTable.data = leftTableData;
                });
                renderTbHeaderCheckbox(showClusters);
            };

            $scope.operator = {
                "getUnDomainCluster": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/irm/{tenant_id}/resourceclusters",
                            o: {"tenant_id": "1"}
                        },
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.operator.filterDomainCluster(response);
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "filterDomainCluster": function (clusterResponse) {
                    var allClusters = clusterResponse && clusterResponse.resourceClusters;
                    var unDomainClusters = [];
                    if (allClusters && allClusters.length) {
                        var name = $scope.serverSearchModel.name;
                        var upcaseName = name && name.toUpperCase();
                        for (var i = 0, len = allClusters.length; i < len; i++) {
                            var item = allClusters[i];
                            if (item && !item.domainId && (!name || item.name.toUpperCase().indexOf(upcaseName) > -1)) {
                                //系统id包含特殊字符，在tiny中用jq选取的时候会出错，增加feId唯一标识cluster
                                item.feId = i;
                                unDomainClusters.push(item);
                            }
                        }
                    }
                    var filterSet = {
                        clusterList: unDomainClusters,
                        total: unDomainClusters.length
                    };
                    canSelectedClusters = filterSet && filterSet.clusterList;
                    $scope.leftTable.totalRecords = filterSet.total;
                    parseTableData();
                },
                "addCluster": function () {
                    var clusterIds = [];
                    for (var index = 0, len = selectedClusters.length; index < len; index++) {
                        clusterIds.push(selectedClusters[index].id);
                    }

                    var deferred = camel.put({
                        "url": {
                            s: "/goku/rest/v1.5/irm/{tenant_id}/resourceclusters",
                            o: {"tenant_id": "1"}
                        },
                        "params": JSON.stringify({
                            "modifyDomain": {
                                "clusterIds": clusterIds,
                                "inDomainId": $scope.domainId
                            }
                        }),
                        "userId": user.id
                    });
                    deferred.done(function (response) {
                        addClusterWindowWidget.destroy();
                    });
                    deferred.complete(function (response) {
                        addClusterWindowWidget.destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            };

            // 初始化成员列表
            $scope.operator.getUnDomainCluster();
        }];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.domain.addCluster", dependency);
        app.controller("userMgr.domain.addCluster.ctrl", addClusterCtrl);
        app.service("camel", httpService);
        return app;
    })
;