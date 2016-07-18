/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Radio",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Radio, httpService, UnifyValid, Exception) {
        "use strict";

        var bindOrgCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var window = $("#bindOrgWindow").widget();
            var azId = window.option("azId");
            var infraId = window.option("infraId");

            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;

            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            $scope.orgTable = {
                "id": "bindOrgTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
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
                        "sTitle": $scope.i18n.org_term_vdcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.cloud_pool_AZvdcMgr_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.defaultStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getOrg();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.orgTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.orgTable.displayLength = pageInfo.displayLength;
                    getOrg();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "orgRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#orgRadio_" + index).widget()) {
                                if (index !== iDataIndex) {
                                    $("#orgRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "bindOrgOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.orgTable.data;
                    var selectedOrg;
                    var index = 0;
                    while ($("#orgRadio_" + index).widget()) {
                        var checked = $("#orgRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedOrg = data[index].id;
                        }
                        index++;
                    }
                    if (selectedOrg) {
                        bindOrgs(selectedOrg);
                    }
                    else {
                        window.destroy();
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "bindOrgCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getOrg() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/fancy/v1.5/az/{azId}/vdcs?start={start}&limit={limit}&cloud-infra={infraId}",
                        o: {azId:azId,start: searchInfo.start, limit: searchInfo.limit,infraId:infraId}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var orgList = data && data.vdcList || [];
                    for (var i = 0; i < orgList.length; i++) {
                        orgList[i].defaultStr = orgList[i].defaultVdc ? $scope.i18n.common_term_yes_button:$scope.i18n.common_term_no_label;
                    }
                    $scope.$apply(function () {
                        $scope.orgTable.totalRecords = data.total || 0;
                        $scope.orgTable.data = orgList;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function bindOrgs(id) {
                var params = {
                    azBaseInfos :[{"azId":azId,"cloudInfraId":infraId}]
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/vdcs/{id}/cloud-infras",
                        o: {id: id}
                    },
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
            getOrg();
        }];

        var bindOrgApp = angular.module("bindOrgApp", ['framework']);
        bindOrgApp.service("camel", httpService);
        bindOrgApp.controller("multiPool.availableZone.bindOrg.ctrl", bindOrgCtrl);
        return bindOrgApp;
    }
);