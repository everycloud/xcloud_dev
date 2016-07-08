define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/network/services/eip/eipService",
        "tiny-lib/encoder",
        "tiny-widgets/Radio",
        "tiny-directives/Table",
        "tiny-directives/Select",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, eipService) {
        "use strict";
        var ctrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                //获取参数
                var params = $("#modifyIpbwWindowId").widget().option("params");
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
                $scope.ipBandWidthTemplate = {
                    label: i18n.template_term_ipBandwidth_label + ":",
                    "name": i18n.common_term_name_label + "：",
                    tip: "",
                    require: false
                };
                $scope.ipBandWidthName = {
                    "id": "modifyIpbwNameInput",
                    "value": "",
                    "type": "input"
                };
                $scope.searchBtn = {
                    "id": "modifyIpbwSearchBtn",
                    "text": i18n.common_term_search_button,
                    "click": function () {
                        $scope.command.queryIPBWTemplate(false);
                    }
                };
                $scope.ipBandWidthTable = {
                    "id": "modifyIpbwListTable",
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
                        "sTitle": i18n.spec_term_ipBandName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.perform_term_receiveBandMaxMbps_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.maxRxBandwidth);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.perform_term_sendBandMaxMbps_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.maxTxBandwidth);
                        },
                        "sWidth": "30%",
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 单选框
                        var selBox = "<div><tiny-radio text='' name='name' checked='checked' click='click()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "create-ipbandwidth-radio";
                        selBoxScope.checked = aData.checked;
                        selBoxScope.click = function () {
                            $scope.selIPBWTemplate = aData;
                            $("#" + $scope.okBtn.id).widget().option("disable", false);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryIPBWTemplate(false);
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryIPBWTemplate(false);
                    }
                };
                $scope.publicNetIp = {
                    label: "IP:",
                    "id": "modifyIpbwId",
                    "require": false,
                    "value": ""
                };
                $scope.okBtn = {
                    "id": "modifyIpbwOkBtn",
                    "text": i18n.common_term_ok_button,
                    "disable": true,
                    "click": function () {
                        $scope.command.updateElasticIP();
                    }
                };
                $scope.cancelBtn = {
                    "id": "modifyIpbwCancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#modifyIpbwWindowId").widget().destroy();
                    }
                };

                $scope.command = {
                    //查询IP带宽模板
                    "queryIPBWTemplate": function (isInit) {
                        var options = {
                            "userId": params.userId,
                            "vdcId": params.vdcId,
                            "name": (isInit ? "" : $("#" + $scope.ipBandWidthName.id).widget().getValue()),
                            "start": page.getStart(),
                            "limit": page.displayLength
                        };
                        var deferred = eipServiceIns.queryIPBWTemplate(options);
                        deferred.then(function (data) {
                            var ipwbTemplatesRes = data.ipbwTemplates;
                            $scope.ipBandWidthTable.data = ipwbTemplatesRes;
                            $scope.ipBandWidthTable.totalRecords = data.total;
                            $scope.ipBandWidthTable.displayLength = page.displayLength;
                            $("#" + $scope.ipBandWidthTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    //查询弹性IP详情
                    "queryElasticIPDetail": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "id": params.eipId

                        };
                        var deferred = eipServiceIns.queryElasticIPDetail(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            $scope.publicNetIp.value = data.ip;
                        });
                    },

                    //修改弹性IP带宽
                    "updateElasticIP": function () {
                        if (!$scope.selIPBWTemplate) {
                            return;
                        }
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "maxRxBandwidth": $scope.selIPBWTemplate.maxRxBandwidth,
                            "maxTxBandwidth": $scope.selIPBWTemplate.maxTxBandwidth,
                            "id": params.eipId
                        };
                        var deferred = eipServiceIns.updateElasticIP(options);
                        deferred.then(function (data) {
                            $("#modifyIpbwWindowId").widget().destroy();
                        });
                    }
                };
                $scope.command.queryIPBWTemplate(true);
                $scope.command.queryElasticIPDetail();
            }
        ];
        var modifyIpbwModule = angular.module("modifyIpbwModule", ["ng", "wcc", "ngSanitize"]);
        modifyIpbwModule.controller("modifyIpbwCtrl", ctrl);
        modifyIpbwModule.service("camel", http);
        modifyIpbwModule.service("exception", exceptionService);

        return modifyIpbwModule;
    });
