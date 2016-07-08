/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    "app/business/network/services/vlb/vlbService",
    "tiny-widgets/Checkbox",
    "tiny-common/UnifyValid",
    "app/services/validatorService"
], function ($, _, vlbService, Checkbox, UnifyValid, validatorService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile", "$q", "exception",
        function ($scope, camel, $compile, $q, exception) {
            var i18n = $scope.i18n;
            var validator = new validatorService();
            var tips = i18n .sprintf(i18n.common_term_rangeInteger_valid, 480, 86400);
            $scope.selectedRouterIds = [];
            $scope.info = {
                localTable: {
                    "label": i18n.vpn_term_localUserNet_label + ":",
                    "require": true,
                    "id": "create-vpn-link-local-listtable",
                    "columns": [{
                        "sTitle": "",
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vpc_term_netType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.typeUI);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusUI);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_Subnet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.subnetAddr);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_SubnetMask_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.subnetPrefix);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_gateway_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipv4Subnet.gateway);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.perform_term_sendBandAvgMbps_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.averageSendBand);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_priority_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.priority);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // 单选框
                        var selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.id = "localNetRouterId" + iDataIndex;
                        selBoxScope.checked = aData.checked;
                        selBoxScope.change = function () {
                            selectRouter(aData.networkID, $("#" + selBoxScope.id).widget().option("checked"));
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                    }
                },

                gatewayIP: {
                    "id": "create-vpn-link-gatewayIP",
                    label: i18n.vpn_term_remoteGatewayIP_label + ":",
                    require: true,
                    "extendFunction": ["IPv4Check"],
                    validate: "required:" + i18n.common_term_null_valid + ";IPv4Check():" + i18n.common_term_formatIP_valid,
                    value: "",
                    type: "ipv4"
                },
                network: {
                    "id": "create-vpn-link-network",
                    label: i18n.vpn_term_remoteNet_label + ":",
                    "disable": false,
                    require: true,
                    "text": i18n.common_term_add_button,
                    "click": function () {
                        var subnetNum = $scope.service.customerGw.customerSubnets.length;
                        if (subnetNum >= 5) {
                            return;
                        }
                        $scope.service.customerGw.customerSubnets.push({
                            "subnetAddr": "",
                            "subnetMask": "",
                            "subnetAddrId": "subnetAddr" + $scope.service.totalSubnetNum,
                            "subnetMaskId": "subnetMask" + $scope.service.totalSubnetNum
                        });
                        $scope.service.totalSubnetNum += 1;
                        // 按钮灰化
                        if ($scope.service.customerGw.customerSubnets.length >= 5) {
                            $scope.info.network.disable = true;
                            return;
                        }
                    }
                },
                dnAlgorithm: {
                    "id": "link-dnAlgorithm-select",
                    "label": i18n.vpn_term_DH_label + ":",
                    "width": "220",
                    "require": true,
                    "values": [{
                        "selectId": "DH2",
                        "label": "DH2",
                        "checked": $scope.service.pfsGroup === "DH2"
                    }, {
                        "selectId": "DH5",
                        "label": "DH5",
                        "checked": $scope.service.pfsGroup === "DH5"
                    }]
                },
                lifeTime: {
                    "id": "link-cycle-textbox",
                    "label": i18n.vpn_term_consultationPeriodS_label + ":",
                    "validate": "integer:" + tips +";minValue(480):" + tips +";maxValue(86400):" + tips,
                    "value": "3600"
                },
                preBtn: {
                    "id": "create-vpn-link-remote-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "basic";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-vpn-link-remote-next",
                    "text": i18n.common_term_next_button,
                    "disable": $scope.selectedRouterIds.length <= 0,
                    "click": function () {

                        var valid = UnifyValid.FormValid($("#createVpnLinkRemoteDiv"));
                        if (!valid) {
                            return;
                        }
                        $scope.service.networkIDs = $scope.selectedRouterIds;

                        // 保存选中的网络列表，确认页面显示使用
                        var selectedNets  = [];
                        _.each($scope.info.localTable.data,function(item){
                            if (_.find($scope.service.networkIDs, function (networkId) {
                                return networkId === item.networkID;
                            })) {
                                selectedNets.push(item);
                            }
                        });
                        $scope.service.selectedNets = selectedNets;

                        $scope.service.pfsGroup = $("#link-dnAlgorithm-select").widget().getSelectedLabel();
                        $scope.service.lifeTime = $("#link-cycle-textbox").widget().getValue();
                        $scope.service.customerGw.ipAddr = $("#create-vpn-link-gatewayIP").widget().getValue();

                        var subnets = [];
                        for (var i = 0; i < $scope.service.totalSubnetNum; i++) {
                            if ($("#subnetAddr" + i) && $("#subnetAddr" + i).widget() && $("#subnetMask" + i) && $("#subnetMask" + i).widget()) {
                                subnets.push({
                                    "subnetAddr": $("#subnetAddr" + i).widget().getValue(),
                                    "subnetMask": $("#subnetMask" + i).widget().getValue(),
                                    "subnetAddrId": "subnetAddr" + i,
                                    "subnetMaskId": "subnetMask" + i
                                });
                            }
                        }
                        $scope.service.customerGw.customerSubnets = subnets;

                        $scope.service.show = "ike";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vpn-link-remote-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "localTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var routes = $scope.info.localTable.data;
                    var isChecked = $("#localTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < routes.length; i++) {
                        $("#localNetRouterId" + i).widget().option("checked", isChecked);
                    }

                    $scope.$apply(function () {
                        // 将已勾选的router selectedRouters
                        $scope.selectedRouterIds = [];
                        if (isChecked && routes) {
                            _.each(routes, function (item) {
                                $scope.selectedRouterIds.push(item.networkID);
                            });
                        }
                    });
                }
            });

            // 勾选、去勾选网络
            function selectRouter(routerId, checked) {
                var selected = $scope.selectedRouterIds;
                if (checked) {
                    selected.push(routerId);
                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (selected[i] === routerId) {
                            selected.splice(i, 1);
                        }
                    }
                }

                var headCheck = $("#localTableHeadCheckbox").widget();
                if ( !! headCheck) {
                    if (selected.length < $("#create-vpn-link-local-listtable").widget().options.data.length) {
                        headCheck.option("checked", false);
                    } else {
                        headCheck.option("checked", true);
                    }
                }
            }

            $scope.click = function () {
                if ($("#subnetInfoDiv").css("display") === "none") {
                    $("#subnetInfoDiv").css("display", "block");
                    $("#linkImg").attr("src", "../theme/default/images/expand.png");
                } else {
                    $("#subnetInfoDiv").css("display", "none");
                    $("#linkImg").attr("src", "../theme/default/images/colspand.png");
                }
            };

            // 子网的删除
            $scope["delete"] = function (delIndex) {
                $scope.service.customerGw.customerSubnets = _.reject($scope.service.customerGw.customerSubnets, function (item, index) {
                    return index === delIndex;
                });
                // 按钮灰化
                if ($scope.service.customerGw.customerSubnets.length < 5) {
                    $scope.info.network.disable = false;
                }
            };

            // 事件处理，查询初始化信息
            $scope.$on($scope.events.ipSecBasicNextFromParent, function (event, msg) {
                $scope.vlbServiceInst = new vlbService(exception, $q, camel);
                queryNetwoks();
            });

            // 查询前后端网络
            function queryNetwoks() {
                var promise = $scope.vlbServiceInst.queryVpcNets({
                    "vdcId": $scope.user.vdcId,
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "vpcId": $scope.service.vpcId,
                    "userId": $scope.user.id,
                    "start": 0,
                    "limit": 100
                });
                promise.then(function (resolvedValue) {
                    //请求成功
                    if (resolvedValue && resolvedValue.networks && resolvedValue.networks.length > 0) {
                        var routeNets = [];
                        _.each(resolvedValue.networks, function (item) {
                            // 过滤路由网络并且状态OK
                            if (item.networkType === 3 && item.status === "READY") {
                                _.extend(item, {
                                    "typeUI": i18n.vpc_term_routerNet_label,
                                    "statusUI": i18n.common_term_ready_value,
                                    "showDetail": "",
                                    "checked": false
                                });
                                if ($scope.service.isModifyMode) {
                                    if (_.find($scope.service.networkIDs, function (networkId) {
                                        return networkId === item.networkID;
                                    })) {
                                        item.checked = true;
                                    }
                                }
                                routeNets.push(item);
                            }
                        });

                        $scope.info.localTable.data = routeNets;

                        // 清空选中的路由

                        // 如果是修改场景需要根据查询上来的网络id过滤
                        if ($scope.service.isModifyMode) {
                            $scope.selectedRouterIds = $scope.service.networkIDs;
                            $("#link-dnAlgorithm-select").widget().opChecked($scope.service.pfsGroup);
                        } else {
                            $scope.selectedRouterIds = [];
                        }
                        // 设置表格头
                        tblHeadCheckbox.option("checked", false);
                        $('#create-vpn-link-local-listtable th:eq(0)').html(tblHeadCheckbox.getDom());
                    }
                });
            }

            //校验IPv4是否合法
            UnifyValid.IPv4Check = function () {
                return validator.ipValidator($(this).val());
            };

        }
    ];
    return ctrl;
});
