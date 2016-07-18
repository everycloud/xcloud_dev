/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular,Checkbox, httpService, Exception) {
    "use strict";
    var addSecondaryCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addSecondaryWindow").widget();
            var zoneId = window.option("zoneId");
            var selectedIds = [];
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            //待选二级存储列表
            $scope.secondaryTable = {
                "id": "secondaryTable",
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_allocatedCapacity_label+"(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.usedSizeGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageDevice_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageunitname);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(6)', nRow).addTitle();
                    $('td:eq(7)', nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "secondaryCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            getSelectedIds();
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "addSecondaryOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    getSelectedIds();
                    if (!selectedIds || selectedIds.length === 0) {
                        return;
                    }
                    addSecondary();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addSecondaryCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getData() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/l2datastores?zoneid={zoneid}", o: {zoneid: zoneId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var dataStores = data && data.datastoreInfos || [];
                    for (var i = 0, l = dataStores.length; i < l; i++) {
                        dataStores[i].maintenanceStr = dataStores[i].maintenancemode?$scope.i18n.common_term_yes_button:$scope.i18n.common_term_no_label;
                        dataStores[i].status = dataStores[i].accessible?$scope.i18n.common_term_available_label:$scope.i18n.common_term_unavailable_value;
                        dataStores[i].type = storeTypes[dataStores[i].type] || dataStores[i].type;
                    }
                    $scope.$apply(function () {
                        $scope.secondaryTable.data = dataStores;
                    });
                    var tableId = "#" + $scope.secondaryTable.id;
                    //表头全选复选框
                    var options = {
                        "id": "secondaryHeadCheckbox",
                        "checked": false,
                        "change": function () {
                            var isChecked = $("#" + options.id).widget().options.checked;
                            var index = 0;
                            while ($("#secondaryCheckbox_" + index).widget()) {
                                $("#secondaryCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
                            }
                            $("#" + $scope.okButton.id).widget().option("disable", !isChecked);
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $(tableId + " th:eq(0)").html(checkbox.getDom());
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getSelectedIds() {
                selectedIds = [];
                var secondaryTable = $("#" + $scope.secondaryTable.id).widget();
                var data = secondaryTable.option("data");
                var index = 0;
                while ($("#secondaryCheckbox_" + index).widget()) {
                    var checked = $("#secondaryCheckbox_" + index).widget().option("checked");
                    if (checked) {
                        selectedIds.push(data[index].id);
                    }
                    index++;
                }
                var hasSelected = selectedIds.length > 0;
                $("#" + $scope.okButton.id).widget().option("disable", !hasSelected);
            }

            function addSecondary() {
                var params = {
                    "ids": selectedIds
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/l2datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getData();
        }];

    var addSecondaryModule = angular.module("resources.zone.addSecondary", ["ng"]);
    addSecondaryModule.service("camel", httpService);
    addSecondaryModule.controller("resources.zone.addSecondary.ctrl", addSecondaryCtrl);
    return addSecondaryModule;
});