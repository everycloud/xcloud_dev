/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    'tiny-common/UnifyValid',
    'app/services/httpService',
    "app/services/tipMessageService",
    'app/services/validatorService',
    'app/services/exceptionService',
    "app/business/ssp/services/order/orderService",
    "app/business/network/services/eip/eipService",
    "fixtures/network/eip/elasticipFixture"
], function ($, angular, _, UnifyValid, http, tipMessageService, validator, exception, orderService, eipService) {
    "use strict";

    var sspChangEipCtrl = ["$scope", "$stateParams", "$state", "$q", "$compile", "camel", "exception", function ($scope, $stateParams, $state, $q, $compile, camel, exception) {
        // 公共参数和服务
        var user = $scope.user;
        var i18n = $scope.i18n;
        var action = $stateParams.action;
        var cloudInfraId = $stateParams.cloudInfraId;
        var vpcId = $stateParams.vpcId || "-1";
        var eipId = $stateParams.resourceId;
        var orderServiceIns = new orderService(exception, $q, camel);
        // 公共服务实例
        var eipServiceIns = new eipService(exception, $q, camel);
        var validate = new validator();
        var tipMessage = new tipMessageService();
        //IP带宽名称搜索条件
        var searchString;

        $scope.diskDetail = {};
        $scope.orderDetail = {};
        $scope.selIPBWTemplate = {};

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
        $scope.searchBox = {
            "id": "applyEipIpBandSearchBox",
            "placeholder": i18n.common_term_findName_prom,
            "width": "250",
            "suggest-size": 10,
            "maxLength": 64,
            "search": function (content) {
                searchString = content;
                page.currentPage = 1;
                $scope.operate.queryIPBWTemplate();
            }
        };
        $scope.ipBandWidthTable = {
            "id": "modifyIpbwListTable",
            "paginationStyle": "full_numbers",
            "lengthMenu": [10, 20, 30],
            "displayLength": 10,
            "totalRecords": 0,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "selectRadio",
                    "bSortable": false,
                    "sWidth": "30"
                },
                {
                    "sTitle": i18n.spec_term_ipBandName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "30%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_receiveBandMaxMbps_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.maxRxBandwidth);
                    },
                    "sWidth": "30%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.perform_term_sendBandMaxMbps_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.maxTxBandwidth);
                    },
                    "sWidth": "30%",
                    "bSortable": false
                }
            ],
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
            label: i18n.common_term_IP_label + ":",
            "id": "modifyIpbwId",
            "require": false,
            "value": ""
        };
        $scope.maxRxBandwidth = {
            label: i18n.perform_term_receiveBandMaxMbps_label + ":",
            "value": ""
        };
        $scope.maxTxBandwidth = {
            label: i18n.perform_term_sendBandMaxMbps_label + ":",
            "value": ""
        };

        // 备注
        $scope.remark = {
            "label": i18n.common_term_remark_label + ":",
            "id": "sspChangeEipRemark",
            "value": "",
            "type": "multi",
            "width": "270",
            "height": "70",
            "validate": "regularCheck(" + validate.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
        };

        $scope.okBtn = {
            "id": "sspChangeEipOK",
            "text": i18n.common_term_ok_button,
            "disable": false,
            "click": function () {
                // 校验
                if (!UnifyValid.FormValid($("#" + $scope.remark.id))) {
                    return;
                }

                var params = {
                    "cloudInfraId": cloudInfraId,
                    "vpcId": vpcId,
                    "eipId": eipId,
                    "eip": $scope.publicNetIp.value,
                    "ipBindTemplate": {
                        "maxRxBandwidth": $scope.maxRxBandwidth.value || 0,
                        "maxTxBandwidth": $scope.maxTxBandwidth.value || 0,
                        "name": $scope.selIPBWTemplate.name || ""
                    },
                    "maxRxBandwidth": $scope.selIPBWTemplate.maxRxBandwidth || 0,
                    "maxTxBandwidth": $scope.selIPBWTemplate.maxTxBandwidth || 0,
                    "name": $scope.selIPBWTemplate.name || ""
                };

                var options;
                var deferred;
                var comments = $("#" + $scope.remark.id).widget().getValue();

                if (action === "edit") { // 修改订单
                    options = {
                        "user": user,
                        "id": $stateParams.orderId,
                        "params": {
                            "params": JSON.stringify(params),
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.modifyOrder(options);
                } else { // 申请订单
                    options = {
                        "user": user,
                        "params": {
                            "modify": {
                                "resourceId": $stateParams.id,
                                "params": JSON.stringify(params)
                            },
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.createOrder(options);
                }

                deferred.then(function (data) {
                    if (data && data.orderId) {
                        tipMessage.sspAlert(data.orderId, function () {
                            $state.go("ssp.approvalEipChange", {
                                "orderId": data.orderId,
                                "action": "view"
                            });
                        });
                    }
                    $state.go("ssp.order.apply");
                });
            }
        };

        $scope.cancelBtn = {
            "id": "sspChangeEipCancel",
            "text": i18n.common_term_cancle_button,
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.operate = {
            // 查询订单详情
            "queryOrderDetail": function () {
                if (action !== "edit") {
                    return {};
                }
                if (!$stateParams.orderId) {
                    return;
                }
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": $stateParams.orderId
                };
                var deferred = orderServiceIns.queryOrder(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    $scope.orderDetail = data;
                    var param = JSON.parse(data.params);
                    $scope.orderDetail.param = param;

                    // 修改订单时这几个参数从订单详情中取
                    $scope.remark.value = $scope.orderDetail.comments;
                    cloudInfraId = param.cloudInfraId;
                    vpcId = param.vpcId;
                    eipId = param.eipId;

                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 查询磁盘详情
            "queryElasticIPDetail": function () {
                var retDefer = $.Deferred();
                var options = {
                    "cloudInfraId": cloudInfraId,
                    "vpcId": vpcId,
                    "vdcId": user.vdcId,
                    "userId": user.id,
                    "id": eipId
                };
                var defer = eipServiceIns.queryElasticIPDetail(options);
                defer.then(function (data) {
                    if (!data) {
                        return;
                    }

                    $scope.publicNetIp.value = data.ip;
                    $scope.maxRxBandwidth.value = data.maxRxBandwidth;
                    $scope.maxTxBandwidth.value = data.maxTxBandwidth;
                    retDefer.resolve();
                });
                return retDefer.promise();
            },
            //查询IP带宽模板
            "queryIPBWTemplate": function () {
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "name": searchString,
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
            }
        };

        //获取初始数据
        function init() {
            var defer = $scope.operate.queryOrderDetail();
            $.when(defer).done(function () {
                $scope.operate.queryElasticIPDetail();
                $scope.operate.queryIPBWTemplate();
            });
        }

        //初始化
        init();
    }];

    return sspChangEipCtrl;
});
