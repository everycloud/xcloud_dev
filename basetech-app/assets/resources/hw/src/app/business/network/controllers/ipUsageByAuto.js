/*global define*/
define(["tiny-lib/jquery",
        "tiny-lib/underscore",
        'tiny-lib/angular',
        "tiny-widgets/Window",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/network/services/networkService",
        "app/services/messageService",
        "language/keyID",
        "tiny-widgets/Radio",
        "tiny-directives/Table",
        "tiny-directives/Select",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/network/networkListFixture"
    ],
    function ($, _, angular, Window, http, exceptionService, networkService, messageService, i18n) {
        "use strict";
        var ipUsageByAutoCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var networkServiceIns = new networkService(exception, $q, camel);
                var messageServiceIns = new messageService();
                var searchIP = "";
                var user = $("html").scope().user || {};

                //获取参数
                $scope.params = $("#ipUsageWindowId").widget().option("param");
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.refreshClick = function () {
                    $scope.operate.queryPrivateIP();
                };

                $scope.searchBox = {
                    "id": "searchIpAutoId",
                    "placeholder": i18n.vpc_term_findIP_prom,
                    "width": "150",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (content) {
                        page.currentPage = 1;
                        searchIP = content;
                        $scope.operate.queryPrivateIP();
                    }
                };
                $scope.fixBtn = {
                    "id": "fixIPBtnId",
                    "text": i18n.common_term_restore_button,
                    "click": function () {
                        var promise = networkServiceIns.fixNetworkAutoIps({
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "networkID": $scope.params.networkID,
                            "userId": user.id,
                            "cloudInfraId": $scope.params.cloudInfraId
                        });
                        promise.then(function (resolvedValue) {
                            if (!resolvedValue || !resolvedValue.fixPrivateIPResp) {
                                return;
                            }
                        });
                    }
                };
                $scope.ipListTable = {
                    "id": "ipListTableId",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false,
                        "sWidth": "100"
                    }, {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vpc_term_bondObj_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.bindingSource);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusUI);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.eip_term_eip_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.elasticIP);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_assignTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.allocateTime);
                        },
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();
                        $("td:eq(7)", nRow).addTitle();
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.queryPrivateIP();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.queryPrivateIP();
                    }
                };

                $scope.operate = {
                    "queryPrivateIP": function () {
                        var promise = networkServiceIns.queryPrivateIP({
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "networkID": $scope.params.networkID,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "privateIP": searchIP,
                            "allocateType": "AUTO", // MANUAL:手动; AUTO:自动
                            "userId": user.id,
                            "start": page.getStart(),
                            "limit": page.displayLength
                        });
                        promise.then(function (resolvedValue) {
                            if (!resolvedValue || !resolvedValue.privateIPs) {
                                return;
                            }
                            _.each(resolvedValue.privateIPs, function (data) {
                                _.extend(data, {
                                    "bindingSource": data.vmName + ":" + data.nicName,
                                    "statusUI": networkServiceIns.getPrivateIpUIStatus(data.status)
                                });
                            });
                            $scope.ipListTable.data = resolvedValue.privateIPs;
                            $scope.ipListTable.totalRecords = resolvedValue.total;
                        });
                    }
                };

                $scope.operate.queryPrivateIP();
            }
        ];

        var ipUsageByAutoModule = angular.module("network.ipUsageByAuto", ['framework']);
        ipUsageByAutoModule.controller("network.ipUsageByAuto.ctrl", ipUsageByAutoCtrl);
        ipUsageByAutoModule.service("camel", http);
        ipUsageByAutoModule.service("exception", exceptionService);
        return ipUsageByAutoModule;
    });
