/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        "app/services/httpService",
        'app/services/messageService',
        "app/services/tipMessageService",
        'app/services/validatorService',
        'app/services/exceptionService',
        'app/services/capacityService',
        "app/services/cloudInfraService",
        "app/business/network/services/eip/eipService",
        "app/business/network/services/router/routerService",
        "app/business/ssp/services/catalog/catalogService",
        "app/business/ssp/services/order/orderService",
        "app/business/ssp/services/plugin/ecs/ecsService",
        "app/business/ssp/services/plugin/commonService",
        "app/services/commonService",
        "fixtures/network/eip/elasticipFixture",
        "fixtures/network/router/routerFixture"
], function ($, angular, _, UnifyValid, http, messageService, tipMessageService, validatorService, exceptionService, capacityService, cloudInfraService, eipService, routerService, catalogService, orderService, ecsService, commonService, timeCommonService) {
    "use strict";

    var ctrl = ["$scope", "$state", "$stateParams", "$q", "$compile", "camel", "exception", function ($scope, $state, $stateParams, $q, $compile, camel, exception) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        var serviceId = $stateParams.serviceId;
        var orderId = $stateParams.orderId;
        var action = $stateParams.action;

        var validator = new validatorService();
        var cloudInfraServiceIns = new cloudInfraService($q, camel);
        var catalogServiceIns = new catalogService(exception, $q, camel);
        var orderServiceIns = new orderService(exception, $q, camel);
        var ecsServiceIns = new ecsService(exception, $q, camel);
        var eipServiceIns = new eipService(exception, $q, camel);
        var routerServiceIns = new routerService(exception, $q, camel);
        var commonServiceIns = new commonService(exception);
        var tipMessage = new tipMessageService();

        //IP带宽名称搜索条件
        var searchString;
        // vpc下是否有路由
        $scope.hasRouter = true;
        // 硬件路由需要显示规格框用于配置IP带宽、IP池等信息
        $scope.isHardRouter = false;
        $scope.selPublicNetPoolName = undefined;

        $scope.isICT = user.cloudType === "ICT";

        // 服务详情
        $scope.detail = {};
        // 订单详情
        $scope.orderDetail = {};
        $scope.cloudInfra = {};

        $scope.noRouterTips = i18n.service_apply_elasticIP_para_vpc_valid || "当前选择的VPC无可用的路由器，若要申请弹性IP业务，请选择存在可用路由器的VPC。";

        // 地域信息
        $scope.location = {
            "id": "serviceApplyEipRegion",
            "label": i18n.common_term_section_label + ":",
            "width": "180",
            "values": [],
            "require": true,
            "validate": "required:" + i18n.common_term_null_valid + ";",
            "change": function () {
                $scope.cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.location.values, $("#" + $scope.location.id).widget().getSelectedId());
                $scope.operate.queryVpcs();
            }
        };

        // vpc
        $scope.vpc = {
            "label": i18n.vpc_term_vpc_label + ":",
            "id": "serviceApplyEip",
            "width": "180",
            "values": [],
            "curr": {"vpcID": "-1"},
            "require": true,
            "validate": "required:" + i18n.common_term_null_valid + ";",
            "change": function () {
                var currId = $("#" + $scope.vpc.id).widget().getSelectedId();
                $scope.vpc.curr = _.find($scope.vpc.values, function(item){
                    return item.vpcID === currId;
                });
                $scope.operate.queryRouter();
            }
        };

        //IP带宽规格翻页信息
        var page = {
            "currentPage": 1,
            "displayLength": 10,
            "getStart": function () {
                return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
            }
        };
        $scope.ipBandWidthTemplate = {
            label: i18n.template_term_ipBandwidth_label + ":",
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
            "id": "applyEipIpbandwidthListtable",
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
                $scope.operate.queryIPBWTemplate();
            },
            "changeSelect": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                $scope.operate.queryIPBWTemplate();
            }
        };
        $scope.publicNetPool = {
            "label": i18n.vpc_term_publicIPpool_label + ":",
            "id": "applyEipPublicNet",
            "values": [],
            "width": "205",
            "height": "200",
            "change": function(){
                $scope.selPublicNetPoolName = $("#" + $scope.publicNetPool.id).widget().getSelectedLabel();
            }
        };

        // 基本信息
        $scope.base = {
            eipNum: {
                "label": i18n.eip_term_eipNum_label + ":",
                "require": true,
                "id": "serviceApplyEipNum",
                "width": "180",
                "value": "1",
                "min": "1",
                "max": "10",
                "step": "1"
            },

            // 到期时间
            expireTime: {
                "label": i18n.common_term_overdueTime_label + ":",
                "id": "serviceApplyEipExpireTime",
                "width": "178",
                "require": true,
                "disable": false,
                "type": "datetime",
                "minDate": commonServiceIns.getCurrentTime(),
                "defaultDate": commonServiceIns.get30DaysDate(),
                "dateFormat": "yy-mm-dd",
                "timeFormat": "hh:mm:ss"
            },

            neverExpire: {
                "id": "serviceApplyEipNeverExpire",
                "checked": false,
                "text": i18n.common_term_neverExpires_label,
                "change": function () {
                    $scope.base.expireTime.disable = $("#" + $scope.base.neverExpire.id).widget().option("checked");
                }
            },

            // 备注
            remark: {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspApplyEipRemark",
                "value": "",
                "type": "multi",
                "width": "220",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            }
        };

        $scope.okBtn = {
            "id": "serviceApplyEipOkBtn",
            "text": i18n.common_term_submit_button,
            "tooltip": "",
            "disable": true,
            "click": function () {
                // 校验
                if (!$scope.okBtn.valid()) {
                    return;
                }
                $scope.operate.applyEip();
            },
            "valid": function () {
                var param = $scope.detail.param;

                if ((param.cloudInfra && param.cloudInfra.lock === '1')) {
                    if (!UnifyValid.FormValid($("#sspApplyEipLocationArea"))) {
                        return false;
                    }
                }

                if (!UnifyValid.FormValid($("#sspApplyEipBasicArea"))) {
                    return false;
                }

                var eipNum = $("#" + $scope.base.eipNum.id).widget().option("value");
                if (!eipNum || eipNum < 1) {
                    tipMessage.alert("error", i18n.service_term_chooseDiskNum_msg);
                    return false;
                }
                return true;
            }
        };
        $scope.cancelBtn = {
            "id": "serviceApplyEipCancelBtn",
            "text": i18n.common_term_cancle_button,
            "tooltip": "",
            "click": function () {
                setTimeout(function () {
                    window.history.back();
                }, 0);
            }
        };

        $scope.clickAreaHeading = function (id) {
            var head = $("#" + id + " .s-heading");
            var content = $("#" + id + " .s-content");

            if (head.hasClass("collapse")) {
                // 收起来前，校验一下
                if (id === "sspApplyEipLocationArea") {
                    if (!UnifyValid.FormValid($("#sspApplyEipLocationArea"))) {
                        return false;
                    }
                } else if (id === "sspApplyEipConfigArea") {
                    if ($(".createvm-cpu .cpu-options[self-defined] input").length > 0) {
                        return false;
                    }
                } else if (id === "sspApplyEipBasicArea") {
                    if (!UnifyValid.FormValid($("#sspApplyEipBasicArea"))) {
                        return false;
                    }
                }

                head.removeClass("collapse");
                head.addClass("expand");
                content.css("display", "none");
            } else {
                head.removeClass("expand");
                head.addClass("collapse");
                content.css("display", "block");
            }
        };

        $scope.operate = {
            // 查询服务详情
            "queryServiceDetail": function () {
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "id": serviceId
                };
                var deferred = catalogServiceIns.queryServiceOffering(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    $scope.detail = data;
                    var param = JSON.parse(data.params);
                    $scope.detail.param = param;
                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 查询订单详情
            "queryOrderDetail": function () {
                if (action !== "edit") {
                    return {};
                }
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": orderId
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
                    retDefer.resolve();
                });
                return retDefer.promise();
            },

            // 查询地域列表
            "queryLocations": function () {
                var retDefer = $.Deferred();
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        if (action === "edit") {
                            data.cloudInfras[0].checked = false;
                            var selectedCloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $scope.orderDetail.param.cloudInfraId);
                            if (selectedCloudInfra) {
                                selectedCloudInfra.checked = true;
                            }
                            $scope.cloudInfra = selectedCloudInfra;
                        } else {
                            $scope.cloudInfra = data.cloudInfras[0];
                        }
                        $scope.location.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                });
                return retDefer.promise();
            },

            // 查询vpc列表
            "queryVpcs": function () {
                var options = {
                    "user": user,
                    "param": {
                        "cloud-infras": $scope.cloudInfra.id
                    }
                };
                var deferred = ecsServiceIns.queryVpcs(options);
                deferred.then(function (data) {
                    if (!data || !data.vpcs || data.vpcs.length <= 0) {
                        $scope.okBtn.disable = true;
                        return;
                    }
                    if (data.vpcs && data.vpcs.length > 0) {
                        _.each(data.vpcs, function (item) {
                            _.extend(item, {
                                "label": item.name,
                                "selectId": item.vpcID
                            });
                        });

                        var param = $scope.orderDetail.param || {};
                        var curVpc;
                        if (action === "edit") {
                            curVpc = _.find(data.vpcs, function (item) {
                                return item.vpcID === param.vpcId;
                            });
                            if(!curVpc){
                                curVpc = data.vpcs[0];
                            }
                        } else {
                            curVpc = data.vpcs[0];
                        }

                        if (curVpc) {
                            curVpc.checked = true;
                            $scope.vpc.curr = curVpc;
                        }
                        $scope.vpc.values = data.vpcs;
                        $scope.operate.queryRouter();
                    }
                });
            },

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
                    _.each(ipwbTemplatesRes, function (item, index) {
                        if (index === 0) {
                            item.checked = true;
                            $scope.selIPBWTemplate = item;
                        } else {
                            item.checked = false;
                        }
                    });
                    $scope.ipBandWidthTable.data = ipwbTemplatesRes;
                    $scope.ipBandWidthTable.totalRecords = data.total;
                    $scope.ipBandWidthTable.displayLength = page.displayLength;
                    $("#" + $scope.ipBandWidthTable.id).widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                });
            },

            //查询公有IP池
            "queryPublicIPPool": function () {
                var options = {
                    "cloudInfraId": $scope.cloudInfra.id,
                    "vpcId": $scope.vpc.curr.vpcID,
                    "vdcId": user.vdcId,
                    "userId": user.id
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
                        if(index === 0){
                            $scope.selPublicNetPoolName = item.name;
                        }
                    });
                    $scope.publicNetPool.values = selArray;
                });
            },

            //查询router类型：1:硬件; 2:软件
            "queryRouter": function () {
                var options = {
                    "cloudInfraId": $scope.cloudInfra.id,
                    "vpcId": $scope.vpc.curr.vpcID,
                    "vdcId": user.vdcId,
                    "userId": user.id
                };
                var deferred = routerServiceIns.queryRouter(options);
                deferred.then(function (data) {
                    if (!data || !data.routers || data.routers.length <= 0) {
                        $scope.hasRouter = false;
                        $scope.okBtn.disable = true;
                        $scope.isHardRouter = false;
                    } else {
                        $scope.hasRouter = true;
                        $scope.okBtn.disable = false;
                        $scope.isHardRouter = data.routers[0].routerType + "" === "1";
                        if($scope.isHardRouter){
                            $scope.operate.queryIPBWTemplate();
                            $scope.operate.queryPublicIPPool();
                        }
                    }
                });
            },

            // 提交申请
            "applyEip": function () {
                var eipParam = {
                    "cloudInfraId": $scope.cloudInfra.id,
                    "cloudInfraName": $scope.cloudInfra.region,
                    "vpcId": $scope.vpc.curr.vpcID,
                    "vpcName": $scope.vpc.curr.name,
                    "isHardRouter": $scope.isHardRouter,
                    "routerType":  $scope.isHardRouter ? "hard" : "soft",
                    "count": $("#" + $scope.base.eipNum.id).widget().option("value")
                };

                if($scope.isHardRouter){
                    _.extend(eipParam, {
                        "ipBindTemplate": $scope.selIPBWTemplate,
                        "maxRxBandwidth": $scope.selIPBWTemplate.maxRxBandwidth || 0,
                        "maxTxBandwidth": $scope.selIPBWTemplate.maxTxBandwidth || 0,
                        "ipPoolID": $("#" + $scope.publicNetPool.id).widget().getSelectedId(),
                        "ipPoolName": $("#" + $scope.publicNetPool.id).widget().getSelectedLabel()
                    });
                }

                var options;
                var deferred;
                var tenancy = $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc($("#" + $scope.base.expireTime.id).widget().getDateTime());
                var comments = $("#" + $scope.base.remark.id).widget().getValue();
                if (action === "edit") { // 修改订单
                    options = {
                        "user": user,
                        "id": orderId,
                        "params": {
                            "params": JSON.stringify(eipParam),
                            "tenancy": tenancy,
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.modifyOrder(options);
                } else { // 申请订单
                    options = {
                        "user": user,
                        "params": {
                            "apply": {
                                "serviceOfferingId": serviceId,
                                "params": JSON.stringify(eipParam),
                                "tenancy": tenancy
                            },
                            "comments": comments
                        }
                    };
                    deferred = orderServiceIns.createOrder(options);
                }

                deferred.then(function (data) {
                    if (data && data.orderId) {
                        tipMessage.sspAlert(data.orderId, function(){
                            $state.go("ssp.approvalEipApply", {
                                "orderId" : data.orderId,
                                "action" : "view",
                                "serviceId" : serviceId
                            });
                        });
                    }
                    $state.go("ssp.order.apply");
                });
            }
        };

        //根据订单详情，初始化页面信息
        function initBaseByOrderDetail() {
            if (action !== "edit") {
                return;
            }
            var param = $scope.orderDetail.param || {};

            // 到期时间
            var tenancy = $scope.orderDetail.tenancy;
            if (tenancy) {
                if (tenancy === "0") {
                    $scope.base.expireTime.disable = true;
                    $scope.base.neverExpire.checked = true;
                } else {
                    var dateWidget = $("#" + $scope.base.expireTime.id).widget();
                    if (dateWidget) {
                        var localTime = timeCommonService.utc2Local(tenancy);
                        var dateTime = localTime.split(" ");
                        dateWidget.option("defaultTime", dateTime[1]);
                        dateWidget.option("defaultDate", dateTime[0]);
                    }
                }
            }

            // eip个数
            $scope.base.eipNum.value = param.count;
            //备注
            $scope.base.remark.value = $scope.orderDetail.comments;
        }

        // 查询需要的其他信息
        function queryRelatedInfo() {
            var deferred = $scope.operate.queryLocations();
            $.when(deferred).done(function () {
                $scope.operate.queryVpcs();
            });
        }

        // 初始化页面信息
        function init() {
            var deferred = $scope.operate.queryServiceDetail();
            var deferred2 = $scope.operate.queryOrderDetail();
            $.when(deferred, deferred2).done(function () {
                //根据订单详情，初始化基本信息部分
                initBaseByOrderDetail();
                queryRelatedInfo();
            });
        }

        init();
    }];

    return ctrl;
});
