/*global define*/
define([
    'tiny-lib/angular',
    'tiny-lib/jquery',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/networkService",
    "language/keyID",
    'tiny-directives/RadioGroup',
    'tiny-directives/IP',
    "tiny-directives/Textbox",
    "tiny-directives/Button"
],
    function (angular, $, http, UnifyValid, validatorService, messageService, exception, networkService, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                $scope.networkServiceInst = new networkService(exception, $q, camel);
                var user = $("html").scope().user;
                $scope.openstack = user.cloudType === "ICT";

                // 父窗口传递的添加对象
                var param = $("#networkVmInfosWindow").widget().option("param");

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.page = page;
                //ICT 场景下的分页
                $scope.hasPrePage = false;
                $scope.hasNextPage = false;
                $scope.prePage = function () {
                    if (!$scope.hasPrePage) {
                        return;
                    }
                    page.currentPage--;

                    if(page.currentPage <= 1){
                        $scope.hasPrePage = false;
                    }
                    getVmData();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    getVmData();
                };
                $scope.pageSize = {
                    "id": "networkVmDetail-searchSizeSelector",
                    "width": "80",
                    "values": [
                        {
                            "selectId": "10",
                            "label": "10",
                            "checked": true
                        },
                        {
                            "selectId": "20",
                            "label": "20"
                        },
                        {
                            "selectId": "50",
                            "label": "50"
                        }
                    ],
                    "change": function () {
                        page.currentPage = 1;
                        page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                        $scope.hasPrePage = false;
                        getVmData();
                    }
                };

                $scope.close = function () {
                    $("#networkVmInfosWindow").widget().destroy();
                };
                $scope.vmTable = {
                    "id": "ecsVmsTable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();

                        var optScope = $scope.$new();
                        optScope.goVmDetail = function () {
                            var $state = $("html").injector().get("$state");
                            $scope.close();
                            $state.go("ecs.vm");
                        };
                        // 操作
                        var opt = "<span></span><a class='margin-horizon-beautifier btn-link' ng-click='goVmDetail()'>" + $.encoder.encodeForHTML(aData.name) + "</a> </span>";
                        var optLink = $compile(opt);

                        var optNode = optLink(optScope);
                        $("td:eq(0)", nRow).html(optNode);
                    }
                };

                // 查询虚拟机列表信息
                function getVmData() {
                    var options= param;
                    options.limit = page.displayLength;
                    options.start = page.getStart();
                    var promise = $scope.networkServiceInst.queryNetworkVms(options);
                    promise.then(function (data) {
                        $scope.vmTable.totalRecords = data.list.total;
                        $scope.vmTable.data = data.list.vms;
                        $scope.vmTable.displayLength = page.displayLength;
                        $("#ecsVmsTable").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                        if (!$scope.vmTable.data||($scope.vmTable.data.length < page.displayLength)) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
                    });
                }

                getVmData();
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var networkVmInfosWindow = angular.module("networkVmInfosWindow", dependency);
        networkVmInfosWindow.controller("networkVmInfosWindowCtrl", ctrl);
        networkVmInfosWindow.service("camel", http);
        networkVmInfosWindow.service("exception", exception);

        return networkVmInfosWindow;
    });
