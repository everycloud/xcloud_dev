define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    "tiny-widgets/Checkbox"],
    function ($, angular, httpService, constants, ExceptionService, Checkbox) {
        "use strict";

        var regionAssociateCtrl = ["$scope", "camel", function ($scope, camel) {

            var exceptionService = new ExceptionService();

            $scope.regionList = [];

            var saveSelectedVm = function (dataItem, action) {
                var checked = false;
                for (var index in $scope.regionList) {
                    if ($scope.regionList[index].name == dataItem.name) {
                        if (action == "delete") {
                            $scope.regionList.splice(index, 1);
                            return;
                        }
                        checked = true;
                        break;
                    }
                }

                if (!checked) {
                    $scope.regionList.push(dataItem);
                }
            };

            var addOperatorDom = function (dataItem, row, index) {
                // 增加checkBox
                var options = {
                    "checked": false,
                    "change": function () {
                        saveSelectedVm(dataItem, $("#vmCheckbox_" + index).widget().options.checked ? "add" : "delete");

                        if ($("#vmCheckbox_" + index).widget().options.checked) {
                            $("#"+$scope.saveBtn.id).widget().option("disable", false);
                        }

                        var indexTemp = 0;
                        var allChecked = true;
                        var allUnchecked = true;
                        while ($("#vmCheckbox_" + indexTemp).widget()) {
                            var isChecked = $("#vmCheckbox_" + indexTemp).widget().options.checked;
                            if (!isChecked) {
                                allChecked = false;
                            } else {
                                allUnchecked = false;
                            }

                            indexTemp++;
                        }

                        if (allUnchecked) {
                            $("#"+$scope.saveBtn.id).widget().option("disable", true);
                        }

                        if (allChecked) {
                            $("#vmTableHeadCheckbox").widget().option("checked", true);
                        } else {
                            $("#vmTableHeadCheckbox").widget().option("checked", false);
                        }
                    }
                };
                var checkbox = new Checkbox(options);
                $('td:eq(0)', row).html(checkbox.getDom().attr("id", "vmCheckbox_" + index));
            };

            $scope.regionAssociateTable = {
                caption: "",
                data: [],
                id: "regionAssociateTableId",
                columnsDraggable: true,
                enablePagination: false, //此属性设置表格是否分页
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                hideTotalRecords: true,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "160"
                    },
                    {
                        "sTitle": $scope.i18n.service_term_service_label || "服务",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.endPointsStr);
                        },
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();

                    // 添加操作
                    addOperatorDom(dataitem, row, index);
                }
            };

            $scope.saveBtn = {
                id: "regionAssociateSaveBtn",
                disabled: true,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label || "完成",
                tip: "",
                save: function () {
                    $scope.operator.associate();
                }
            };

            $scope.cancelBtn = {
                id: "regionAssociateCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button || "取消",
                tip: "",
                cancel: function () {
                    $("#regionAssociateWinID").widget().destroy();
                }
            };

            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.ENDPOINT_QUERY.url},
                        "params":{"status":"UNMANAGED"},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.endpoint === undefined) {
                            return;
                        }

                        // 合并数据
                        var regionsMap = {};
                        for (var index in data.endpoint) {
                            var regionName = data.endpoint[index].regionName;
                            if (regionsMap.hasOwnProperty(regionName)) {
                                regionsMap[regionName].push(data.endpoint[index]);
                            } else {
                                regionsMap[regionName] = [data.endpoint[index]];
                            }
                        }

                        var regionsList = [];
                        for (var index in regionsMap) {
                            var serviceList = "";
                            var regionServices = regionsMap[index];
                            for (var serviceIndex in regionServices) {
                                serviceList += regionServices[serviceIndex].serviceName + ";";
                            }
                            regionsList.push({"name": index, "endPoints": regionsMap[index], "endPointsStr": serviceList});
                        }

                        // 更新表格数据
                        $scope.$apply(function () {
                            $scope.regionAssociateTable.data = regionsList;
                        });

                        //表头全选复选框
                        var options = {
                            "checked": false,
                            "change": function () {
                                var isChecked = $("#vmTableHeadCheckbox").widget().options.checked;

                                var allCheckStatus = false;
                                var index = 0;
                                while ($("#vmCheckbox_" + index).widget()) {
                                    $("#vmCheckbox_" + index).widget().option("checked", isChecked);
                                    allCheckStatus = isChecked;
                                    saveSelectedVm($scope.regionAssociateTable.data[index], isChecked ? "add":"delete");
                                    index++;
                                }

                                if (allCheckStatus) {
                                    $("#"+$scope.saveBtn.id).widget().option("disable", false);
                                } else {
                                    $("#"+$scope.saveBtn.id).widget().option("disable", true);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $("#" + $scope.regionAssociateTable.id + " th:eq(0)").html(checkbox.getDom().attr("id", "vmTableHeadCheckbox"));
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "associate":function() {
                    if ($scope.regionList.length == 0) {
                        $("#regionAssociateWinID").widget().destroy();
                    }
                    var regions = [];
                    for (var index in $scope.regionList) {
                        regions.push({"name":$scope.regionList[index].name,"status":"MANAGED"});
                    }

                    var deferred = camel.put({
                        "url": {"s": constants.rest.ENDPOINT_MODIFY.url},
                        "params": JSON.stringify({"regions":regions}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $("#regionAssociateWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };

            $scope.operator.query();
        }];

        var deps = [];
        var addScriptApp = angular.module("resources.openstack.regionAssociate", deps);
        addScriptApp.controller("resources.openstack.regionAssociate.ctrl", regionAssociateCtrl);
        addScriptApp.service("camel", httpService);

        return addScriptApp;
    });
