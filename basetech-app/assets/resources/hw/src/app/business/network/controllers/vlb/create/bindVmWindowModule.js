/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/business/network/services/vlb/vlbService",
        'app/services/exceptionService',
        "language/keyID",
        "fixtures/ecsFixture",
        "tiny-directives/Button"
    ],
    function (angular, $, _, http, UnifyValid, validatorService, vlbService, exception, i18n) {
        "use strict";
        var ctrl = ["$scope", "$compile", "camel", "$q", "exception",
            function ($scope, $compile, camel, $q, exception) {
                $scope.vlbServiceInst = new vlbService(exception, $q, camel);

                // 待修改对象
                var bindVmWinDom = $("#bindVmWindowId");
                var condition = bindVmWinDom.widget().option("condition");
                var parentParam = bindVmWinDom.widget().option("param");

                var cloudInfraId = bindVmWinDom.widget().option("cloudInfraId");
                var vpcId = bindVmWinDom.widget().option("vpcId");
                var user = $("html").scope().user || {};

                // 搜索字符串
                var searchString = "";

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.close = function () {
                    bindVmWinDom.widget().destroy();
                };

                $scope.searchBox = {
                    "id": "ecsVmsSearchBox",
                    "placeholder": i18n.common_term_findCondition_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (content) {
                        searchString = content;
                        page.currentPage = 1;
                        getVmData();
                    }
                };

                $scope.bindVmTable = {
                    "id": "bindVmsTable",
                    "captain": "vmCaptain",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "draggable": true,
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }, {
                        "sTitle": "IP",
                        "mData": "opt",
                        "sWidth": "40%",
                        "bSortable": false
                    }],
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
                        var ipCheckScope = $scope.$new();

                        if (!aData.ip) {
                            return;
                        }
                        var length = aData.ip.length;
                        for (var k = 0; k < length; k++) {
                            ipCheckScope["id" + k] = "ipCheckBox" + iDataIndex + k;
                        }

                        ipCheckScope.change = function (i) {
                            aData.ip[i].checked = $("#" + ipCheckScope["id" + i]).widget().option("checked");
                            $scope.bindVmTable.data[iDataIndex].ip = aData.ip;
                        };

                        var ipCheckDom = "";
                        for (var i = 0; i < aData.ip.length; i++) {
                            ipCheckDom += "<div><tiny-checkbox id='id" + i;
                            ipCheckDom += "' checked=" + aData.ip[i].checked;
                            ipCheckDom += " change='change(" + i + ")'></tiny-checkbox>" + aData.ip[i].ip + "</div>";
                        }
                        var ipCheckLink = $compile(ipCheckDom);
                        var ipCheckNode = ipCheckLink(ipCheckScope);
                        $("td:eq(1)", nRow).append(ipCheckNode);

                        $("td:eq(0)", nRow).addTitle();
                    }
                };

                $scope.info = {
                    okBtn: {
                        "id": "bindvm-window-ok",
                        "text": i18n.common_term_ok_button,
                        tip: "",
                        "click": function () {
                            condition.okClick = "true";
                            _.each($scope.bindVmTable.data, function (item) {
                                _.each(item.ip, function (ip) {
                                    if (ip && ip.checked) {
                                        parentParam.push({
                                            "backPort": condition.backPort,
                                            "id": item.id,
                                            "name": item.name,
                                            "ip": ip.ip
                                        });
                                    }
                                });
                            });
                            $scope.close();
                            $scope.$destroy();
                        }
                    },
                    cancelBtn: {
                        "id": "bindvm-window-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                function getVmData() {
                    var promise = $scope.vlbServiceInst.queryVpcVms({
                        "vdcId": user.vdcId,
                        "cloudInfraId": cloudInfraId,
                        "condition": searchString,
                        "vpcId": vpcId,
                        "userId": user.id,
                        "start": page.getStart(),
                        "limit": page.displayLength
                    });
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        _.each(data.list.vms, function (item) {
                            _.extend(item, {
                                "ip": getIp(item),
                                "opt": ""
                            });
                        });

                        $scope.bindVmTable.data = data.list.vms;
                        $scope.bindVmTable.displayLength = page.displayLength;
                        $scope.bindVmTable.totalRecords = data.list.total;
                        $("#bindVmsTable").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                }

                //从查询得到的VM信息中获取IP
                function getIp(vm) {
                    var ips = [];
                    if (vm && vm.vmSpecInfo) {
                        var nics = vm.vmSpecInfo.nics;
                        if (nics && nics.length) {
                            _.each(nics, function (item) {
                                if (item.ip && "0.0.0.0" !== item.ip) {
                                    ips.push({
                                        "ip": item.ip,
                                        "checked": false
                                    });
                                }
                            });
                        }
                    }
                    return ips;
                }

                getVmData();
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var bindVmWindow = angular.module("bindVmWindow", dependency);
        bindVmWindow.controller("bindVmWindowCtrl", ctrl);
        bindVmWindow.service("camel", http);
        bindVmWindow.service("exception", exception);

        return bindVmWindow;
    });
