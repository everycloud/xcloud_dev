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
        "app/business/network/services/publicIP/publicIPService",
        "tiny-lib/encoder",
        "tiny-widgets/Radio",
        "tiny-directives/Table",
        "tiny-directives/Select",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exception, eipService, _, publicIPService) {
        "use strict";
        var ctrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                //获取参数
                var params = $("#createEIPWindowId").widget().option("params");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                //是否为硬件路由器
                $scope.isHardwareRouter = 1 === params.routerType;

                $scope.vpcTypeShared = params.vpcTypeShared;
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
                    "id": "createEIPBandwidthNameInput",
                    "value": "",
                    "type": "input"
                };
                $scope.searchBtn = {
                    "id": "createEIPBandwidthSearchBtn",
                    "text": i18n.common_term_search_button,
                    "click": function () {
                        $scope.command.queryIPBWTemplate(false);
                    }
                };
                $scope.ipBandWidthTable = {
                    "id": "create-eip-ipbandwidth-listtable",
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
                $scope.publicNetPool = {
                    label: i18n.vpc_term_publicIPpool_label + ":",
                    "id": "create-eip-publicnet",
                    "values": [],
                    "width": "205",
                    "height": "200"
                };
                $scope.publicIP = {
                    label: i18n.vpc_term_publicIP_label + ":",
                    "id": "create-eip-publicIP",
                    "values": [],
                    "width": "205",
                    "height": "150",
                    "require": false
                };

                $scope.okBtn = {
                    "id": "create-eip-ok",
                    "text": i18n.common_term_ok_button,
                    "disable": false,
                    "click": function () {
                        $scope.command.applyElasticIP();
                    }
                };
                $scope.cancelBtn = {
                    "id": "create-eip-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createEIPWindowId").widget().destroy();
                    }
                };

                $scope.command = {
                    //查询IP带宽模板
                    "queryIPBWTemplate": function (isInit) {
                        if (!isInit) {
                            $scope.selIPBWTemplate = "";
                            $("#" + $scope.okBtn.id).widget().option("disable", true);
                        }
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
                            var hasTemplate = false;
                            _.each(ipwbTemplatesRes, function (item, index) {
                                if (index === 0) {
                                    item.checked = true;
                                    $scope.selIPBWTemplate = item;
                                } else {
                                    item.checked = false;
                                }
                                hasTemplate = true;
                            });
                            if (!hasTemplate) {
                                $("#" + $scope.okBtn.id).widget().option("disable", true);
                            }else{
                                $("#" + $scope.okBtn.id).widget().option("disable", false);
                            }
                            $scope.ipBandWidthTable.data = ipwbTemplatesRes;
                            $scope.ipBandWidthTable.totalRecords = data.total;
                            $scope.ipBandWidthTable.displayLength = page.displayLength;
                            $("#" + $scope.ipBandWidthTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });
                    },
                    //查询公有IP
                    "queryPublicIPs": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "usedType": "EIP"
                        };
                        var deferred = publicIPService.publicIP.queryList(options,
                            function (data) {
                                if (!data) {
                                    return;
                                }
                                var publicIPRes = data.publicIPs;
                                var selArray = [];
                                _.each(publicIPRes, function (item, index) {
                                    selArray.push({
                                        "selectId": item.ip,
                                        "label": item.ip
                                    });
                                });
                                if (selArray.length > 0) {
                                    selArray[0].checked = true;
                                }
                                $scope.publicIP.values = selArray;
                                $scope.$digest();
                            }
                        );
                    },

                    "queryPublicIPPool": function () {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId
                        };
                        var deferred = eipServiceIns.queryPublicIPPool(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var publicIPPoolsRes = data.publicIPPools;
                            var selArray = [];
                            _.each(publicIPPoolsRes, function (item, index) {
                                selArray.push({
                                    "selectId": item.publicIpPoolId,
                                    "label": item.name,
                                    "checked": (index === 0)
                                });
                            });
                            if (selArray.length === 0) {
                                $("#" + $scope.okBtn.id).widget().option("disable", true);
                            }
                            $scope.publicNetPool.values = selArray;
                        });
                    },
                    //申请弹性IP
                    "applyElasticIP": function () {
                        if ($scope.isHardwareRouter&&!$scope.selIPBWTemplate) {
                            return;
                        }
                        var options = "";
                        if($scope.isHardwareRouter){
                            if($scope.vpcTypeShared){
                                options = {
                                    "cloudInfraId": params.cloudInfraId,
                                    "vpcId": params.vpcId,
                                    "vdcId": params.vdcId,
                                    "userId": params.userId,
                                    "maxRxBandwidth": $scope.selIPBWTemplate.maxRxBandwidth,
                                    "maxTxBandwidth": $scope.selIPBWTemplate.maxTxBandwidth,
                                    "ipPoolID": $("#" + $scope.publicNetPool.id).widget().getSelectedId()
                                };
                            }else{
                                options = {
                                    "cloudInfraId": params.cloudInfraId,
                                    "vpcId": params.vpcId,
                                    "vdcId": params.vdcId,
                                    "userId": params.userId,
                                    "maxRxBandwidth": $scope.selIPBWTemplate.maxRxBandwidth,
                                    "maxTxBandwidth": $scope.selIPBWTemplate.maxTxBandwidth,
                                    "publicIP": $("#" + $scope.publicIP.id).widget().getSelectedId()
                                };
                            }

                        }else{
                            options = {
                                "cloudInfraId": params.cloudInfraId,
                                "vpcId": params.vpcId,
                                "vdcId": params.vdcId,
                                "userId": params.userId,
                                "publicIP": $("#" + $scope.publicIP.id).widget().getSelectedId()
                            };
                        }
                        var deferred = eipServiceIns.applyElasticIP(options);
                        deferred.then(function (data) {
                            $("#createEIPWindowId").widget().destroy();
                        });
                    }
                };
                if($scope.isHardwareRouter){
                    $scope.command.queryIPBWTemplate(true);
                    if($scope.vpcTypeShared){
                        $scope.command.queryPublicIPPool();
                    }else{
                        $scope.command.queryPublicIPs();
                    }
                }else{
                    $scope.command.queryPublicIPs();
                }

            }
        ];
        var createEIP = angular.module("createEIP", ["ng", "wcc", "ngSanitize"]);
        createEIP.controller("createCtrl", ctrl);
        createEIP.service("camel", http);
        createEIP.service("exception", exception);
        return createEIP;
    });
