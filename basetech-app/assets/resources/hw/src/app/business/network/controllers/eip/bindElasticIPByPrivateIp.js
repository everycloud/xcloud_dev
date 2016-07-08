/**
 * 文件名：bindElasticIPByPrivateIp.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-4-23
 */
define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/network/services/eip/eipService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-widgets/Radio",
        "tiny-directives/Table",
        "tiny-directives/Select",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, eipService, _) {
        "use strict";
        var bindElasticIPByPrivateIpCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                //获取参数
                var params = $("#bindElasticIPWindowId").widget().option("params");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.routeNet = {
                    "id": "bindElasticIPByPrivateIpRouteNet",
                    "nameLabel": i18n.vpc_term_routerNet_label + ":",
                    "ipLabel": "IP：",
                    tip: "",
                    "values": [],
                    "width": "160",
                    "height": "200"
                };
                $scope.IP = {
                    "id": "bindPrivateIpInputId",
                    "value": "",
                    "type": "input"
                };

                $scope.searchBtn = {
                    "id": "bindElasticIPByPrivateIpSearchBtnId",
                    "text": i18n.common_term_search_button,
                    "click": function () {
                        $scope.command.queryPrivateIP(false);
                    }
                };
                $scope.privateIpTable = {
                    "id": "bindElasticIPByPrivateIpListTable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": "",
                        "mData": "selectRadio",
                        "bSortable": false,
                        "sWidth": "30"
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vpc_term_routerNet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.networkName);
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
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();

                        // 单选框
                        var selBox = "<div><tiny-radio text='' name='name' checked='checked' click='click()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "privateIpTableRowRadio";
                        selBoxScope.checked = aData.checked;
                        selBoxScope.click = function () {
                            $scope.privateIp = aData.ip;
                            $scope.networkID = aData.networkID;
                            $("#" + $scope.okBtn.id).widget().option("disable", false);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryPrivateIP(false);
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryPrivateIP(false);
                    }
                };

                $scope.okBtn = {
                    "id": "bindElasticIPByPrivateIpOkBtn",
                    "text": i18n.common_term_ok_button,
                    "disable": true,
                    "click": function () {
                        $scope.command.bindElasticIPByPrivateIp();
                    }
                };
                $scope.cancelBtn = {
                    "id": "bindElasticIPByPrivateIpCancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#bindElasticIPWindowId").widget().destroy();
                    }
                };
                $scope.command = {
                    //查询网络信息
                    "queryRouteNetwork": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "networktype": "ROUTED",
                            "status": "READY",
                            "vdcId": params.vdcId,
                            "userId": params.userId
                        };
                        var deferred = eipServiceIns.queryNetwork(options);
                        deferred.then(function (data) {
                            var networkRes = data.networks;
                            var selArray = [];
                            selArray.push({
                                "selectId": "",
                                "label": i18n.common_term_allRouter_label,
                                "checked": true
                            });
                            _.each(networkRes, function (item) {
                                selArray.push({
                                    "selectId": item.networkID,
                                    "label": item.name
                                });
                            });
                            $scope.routeNet.values = selArray;
                        });
                    },
                    //查询私有IP列表
                    "queryPrivateIP": function (isInit) {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "networkID": (isInit ? "" : $("#" + $scope.routeNet.id).widget().getSelectedId()),
                            "privateIP": (isInit ? "" : $("#" + $scope.IP.id).widget().getValue()),
                            "start": page.getStart(),
                            "limit": page.displayLength
                        };
                        var deferred = eipServiceIns.queryPrivateIP(options);
                        deferred.then(function (data) {
                            var privateIpRes = data.privateIPs;
                            $scope.privateIpTable.data = privateIpRes;
                            $scope.privateIpTable.totalRecords = data.total;
                            $scope.privateIpTable.displayLength = page.displayLength;
                            $("#" + $scope.privateIpTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    //私有IP绑定弹性IP
                    "bindElasticIPByPrivateIp": function () {
                        var elasticIp = params.eipId;
                        var networkID = $scope.networkID;
                        var privateIP = $scope.privateIp;
                        if (!elasticIp || !networkID || !privateIP) {
                            return;
                        }
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "id": elasticIp,
                            "networkID": networkID,
                            "privateIP": privateIP,
                            "vmId": "",
                            "nicId": ""
                        };
                        var deferred = eipServiceIns.bindElasticIPByVM(options);
                        deferred.then(function (data) {
                            $("#bindElasticIPWindowId").widget().destroy();
                        });
                    }
                };
                $scope.command.queryPrivateIP(true);
                $scope.command.queryRouteNetwork();
            }
        ];

        var bindElasticIPByPrivateIpModule = angular.module("network.eip.bindElasticIPByPrivateIp", ['framework','ngSanitize']);
        bindElasticIPByPrivateIpModule.controller("network.eip.bindElasticIPByPrivateIp.ctrl", bindElasticIPByPrivateIpCtrl);
        return bindElasticIPByPrivateIpModule;
    });
