/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, httpService, UnifyValid, Exception) {
        "use strict";

        var addAzCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addAzWindow").widget();
            var infraId = window.option("infraId");
            var serviceStatus = {
                "normal": $scope.i18n.common_term_natural_value,
                "pause": $scope.i18n.common_term_pauseUse_value,
                "abnormal": $scope.i18n.common_term_abnormal_value
            };
            var searchInfo = {
                curPage: 1,
                start: 0,
                limit: 10
            };
            //集群列表
            $scope.azTable = {
                "id": "addAzTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 50
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_serviceStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.serviceStatus);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.curPage = evtObj.currentPage;
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getAzs();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    searchInfo.curPage = 1;
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.azTable.displayLength = pageInfo.displayLength;
                    getAzs();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "azCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };
            //确定按钮
            $scope.okButton = {
                "id": "addAzOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.azTable.data;
                    var selectedAz = [];
                    var index = 0;
                    while ($("#azCheckbox_" + index).widget()) {
                        var checked = $("#azCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            selectedAz.push(data[index].id);
                        }
                        index++;
                    }
                    if (selectedAz.length === 0) {
                        window.destroy();
                    }
                    else {
                        addAz(selectedAz);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addAzCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getAzs() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/1/available-zones?cloud-infra={infraId}&start={start}&limit={limit}&manage-status={manageStatus}&service-status={serviceStatus}",
                        o: {infraId: infraId, start: searchInfo.start, limit: searchInfo.limit, manageStatus: "free", serviceStatus: "normal"}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    for (var i = 0; azs && i < azs.length; i++) {
                        azs[i].serviceStatus = serviceStatus[azs[i].serviceStatus] || azs[i].serviceStatus;
                    }
                    $scope.$apply(function () {
                        $scope.azTable.totalRecords = data.total;
                        $scope.azTable.data = data.availableZones;
                    });
                    //表头全选复选框
                    var tableId = "#addAzTable";
                    var options = {
                        "id": "azHeadCheckbox",
                        "checked": false,
                        "change": function () {
                            var isChecked = $("#" + options.id).widget().option("checked");
                            var index = 0;
                            while ($("#azCheckbox_" + index).widget()) {
                                $("#azCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $(tableId + ' th:eq(0)').html(checkbox.getDom());
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function addAz(azs) {
                var params = {
                    cloudInfraId: infraId,
                    availableZoneId: azs
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/1/available-zones"},
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
            getAzs();
        }];

        var addAzApp = angular.module("addAzApp", ['framework']);
        addAzApp.service("camel", httpService);
        addAzApp.controller("multiPool.availableZone.addAz.ctrl", addAzCtrl);
        return addAzApp;
    }
);