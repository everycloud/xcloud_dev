/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-widgets/Checkbox',
    'app/business/resources/controllers/constants'],
    function (angular, Checkbox, constants) {
        "use strict";

        var dvsCtrl = ["$scope", "$state", "camel", '$rootScope', function ($scope, $state, camel, $rootScope) {
            $scope.searchModel = {
                "name": "",
                "hypervisorid": "",
                "start": 0,
                "limit": 10
            };
            var dvsTableColumns = [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.virtual_term_cluster_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zone);
                    },
                    "sWidth": "15%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hypervisorName);
                    },
                    "sWidth": "20%",
                    "bSortable": false}
            ];
            $scope.dvsTable = {
                "id": "dvsTable",
                "data": [],
                "columns": dvsTableColumns,
                "enablePagination": true,
                "paginationStyle": "full-numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "curPage": {"pageIndex": 1},
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "totalRecords": 0,
                "hideTotalRecords": false,
                "columnsDraggable": true,
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.queryDvs($scope.searchModel);
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.operate.queryDvs($scope.searchModel);
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //复选框checkbox
                    var options = {
                        "id": "dvsCheckbox" + aData.id,
                        "checked": ($.inArray(aData.id, $scope.connectInfo.dvsStr) >= 0),
                        "disable": ($scope.connectInfo.totalBoundNics > 0) && ($.inArray(aData.id, $scope.connectInfo.dvsStr) >= 0),
                        "change": function () {
                            if ($("#" + options.id).widget().option("checked")) {
                                $("#" + $scope.nextBtn.id).widget().option("disable", false);
                                if ($scope.operate.isCheckboxAllChecked()) {
                                    $("#tableCheckbox").widget().option("checked", true);
                                }
                            }
                            else {
                                $("#tableCheckbox").widget().option("checked", false);
                                if ($scope.operate.isCheckboxCheckedNone()) {
                                    $("#" + $scope.nextBtn.id).widget().option("disable", true);
                                }
                                else {
                                    $("#" + $scope.nextBtn.id).widget().option("disable", false);
                                }
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());

                }
            };
            $scope.model = {
                "label": $scope.i18n.resource_term_chooseDVS_label || "选择DVS",
                "require": true
            };
            $scope.preBtn = {
                "id": "dvsPreBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    $scope.service.showPage = "baseInfo";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                }
            };
            $scope.nextBtn = {
                "id": "dvsNextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "disable": false,
                "click": function () {
                    var dvsIdList = [];
                    var dvsNameList = [];
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + $scope.dvsTable.data[index].id;
                        if ($("#" + id).widget().option("checked")) {
                            dvsIdList.push($scope.dvsTable.data[index].id);
                            dvsNameList.push($scope.dvsTable.data[index].name);
                        }
                    }
                    $scope.createInfo.dvsIDs = dvsIdList;
                    $scope.service.dvsNames = dvsNameList;
                    $scope.service.showPage = "vlan";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                    // 触发事件
                    $scope.$emit($scope.createExtNetworkEvents.dvsComplete);
                }
            };
            $scope.cancelBtn = {
                "id": "dvsCancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
            $scope.operate = {
                //设置复选框选中状态
                setCheckbox: function (param) {
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + $scope.dvsTable.data[index].id;
                        if (!$("#" + id).widget().option("disable")) {
                            $("#" + id).widget().option("checked", param);
                        }
                    }
                },

                //复选框是否全部选中
                isCheckboxAllChecked: function () {
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + $scope.dvsTable.data[index].id;
                        if (!$("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },

                //复选框是否没有一个选中
                isCheckboxCheckedNone: function () {
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + $scope.dvsTable.data[index].id;
                        if ($("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },

                //查询DVS
                queryDvs: function (params) {
                    var queryConfig = constants.rest.DVS_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.createInfo.zoneID, "start": params.start, "limit": params.limit, "name": "", "hypervisorid": ""}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            for (var index1 in response.dvses) {
                                var clusterName = [];
                                for (var key in response.dvses[index1].clusterIDsMapNames) {
                                    clusterName.push(response.dvses[index1].clusterIDsMapNames[key]);
                                }
                                response.dvses[index1].zone = clusterName.join(";");
                            }
                            $scope.dvsTable.data = response.dvses;
                            $scope.dvsTable.totalRecords = response.total;
                        });
                        //初始化表头的复选框
                        var options = {
                            "id": "tableCheckbox",
                            "checked": $scope.operate.isCheckboxAllChecked(),
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().options.checked;
                                $scope.operate.setCheckbox(isChecked);
                                $("#" + $scope.nextBtn.id).widget().option("disable", $scope.operate.isCheckboxCheckedNone());
                            }
                        };
                        $('#dvsTable th:eq(0)').empty();
                        var checkbox = new Checkbox(options);
                        $('#dvsTable th:eq(0)').append(checkbox.getDom());
                    });
                }
            }
            // 事件处理
            $scope.$on($scope.createExtNetworkEvents.dvsInit, function (event, msg) {
                $scope.operate.queryDvs($scope.searchModel);
            });

        }];

        return dvsCtrl;
    });
