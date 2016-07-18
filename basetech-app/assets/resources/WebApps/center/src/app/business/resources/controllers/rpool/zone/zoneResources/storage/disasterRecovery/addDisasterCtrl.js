/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, httpService, UnifyValid,Exception) {
        "use strict";

        var addDisasterCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addDisasterWindow").widget();
            var zoneId = window.option("zoneId");
            var selectedDisaster = window.option("selectedDisaster");
            var disasterMember = window.option("disasterMember") || [];
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            //容灾存储列表
            $scope.disasterTable = {
                "id": "addDisasterTable",
                "data": null,
                "columnsDraggable": true,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return "";
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
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityTotalGB_label,
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
                    }
                ],
                "callback": function (evtObj) {

                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(6)', nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "disasterCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };
            function getDisaster() {
                var deferred = camel.get({
                    "url": {s:"/goku/rest/v1.5/irm/1/disasterdatastores?zoneid={zoneId}",o:{zoneId:zoneId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disasters = data && data.datastoreInfos || [];
                    for (var i = 0; i < disasterMember.length; i++) {
                        disasters.push(disasterMember[i]);
                    }
                    var tableData = [];
                    for (var i = 0; i < disasters.length; i++) {
                        disasters[i].type = storeTypes[disasters[i].type] || disasters[i].type;
                        tableData.push(disasters[i]);
                        for (var j = 0; j < selectedDisaster.length; j++) {
                            if (disasters[i].id == selectedDisaster[j].id) {
                                tableData.pop();
                                break;
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.disasterTable.data = tableData;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getDisaster();

            //确定按钮
            $scope.okButton = {
                "id": "addDisasterOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.disasterTable.data;
                    var index = 0;
                    while ($("#disasterCheckbox_" + index).widget()) {
                        var checked = $("#disasterCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            selectedDisaster.push(data[index]);
                        }
                        index ++;
                    }
                    window.destroy();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addDisasterCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
        }];

        var addDisasterApp = angular.module("addDisasterApp", ['framework']);
        addDisasterApp.service("camel", httpService);
        addDisasterApp.controller("resources.zone.addDisaster.ctrl", addDisasterCtrl);
        return addDisasterApp;
    }
);