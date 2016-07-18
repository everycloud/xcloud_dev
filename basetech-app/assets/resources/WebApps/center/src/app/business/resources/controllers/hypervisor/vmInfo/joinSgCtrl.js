/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-widgets/Radio",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Checkbox, Select, Radio, httpService, UnifyValid, Exception) {
        "use strict";

        var joinSgCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#joinSgWindow").widget();
            var vmId = window.option("vmId");
            var nicId = window.option("nicId");
            var vpcId = window.option("vpcId");

            //模糊搜索框
            $scope.searchBox = {
                "id": "searchSgBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.start = 0;
                    getData();
                }
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10,
                "name":""
            };
            //安全组列表
            $scope.sgTable = {
                "id": "nicJoinSgTable",
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
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_ruleNum_label || "规则数",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgRuleCount);
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
                    getData();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.sgTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.sgTable.displayLength = pageInfo.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "sgRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#sgRadio_" + index)) {
                                if (index != iDataIndex) {
                                    $("#sgRadio_" + index).widget().option("checked", false);
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
                "id": "joinSgOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.sgTable.data;
                    var selectedSg;
                    var index = 0;
                    while ($("#sgRadio_" + index).widget()) {
                        var checked = $("#sgRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedSg = data[index].sgID;
                            break;
                        }
                        index++;
                    }
                    if (selectedSg) {
                        joinSg(selectedSg);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "joinSgCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function joinSg(sgId) {
                var params = {
                    addVM2SG: {
                        vmID: vmId,
                        nicID: nicId,
                        sgID: sgId
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/vpcs/{vpcId}/securitygroups/action", o: {vpcId: vpcId}},
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

            function getData() {
                if($("#" + $scope.searchBox.id).widget()){
                    searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
                }
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/irm/1/vpcs/{vpcId}/securitygroups?start={start}&limit={limit}&sgname={name}",
                        o: {vpcId: vpcId, start: searchInfo.start, limit: searchInfo.limit, name: searchInfo.name}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var sgs = data && data.sgs || [];
                    $scope.$apply(function () {
                        $scope.sgTable.totalRecords = data.total;
                        $scope.sgTable.data = sgs;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getData();
        }];

        var joinSgApp = angular.module("joinSgApp", ['framework']);
        joinSgApp.service("camel", httpService);
        joinSgApp.controller("resources.vmInfo.joinSg.ctrl", joinSgCtrl);
        return joinSgApp;
    }
);
