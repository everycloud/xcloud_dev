/* global define*/
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/vlb/vlbService",
    "fixtures/network/vlb/vlbFixture"
], function ($, _, UnifyValid, validatorService, vlbService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$q", "$stateParams", "exception",
        function ($scope, camel, $q, $stateParams, exception) {
            var i18n = $scope.i18n;
            $scope.vlbServiceInst = new vlbService(exception, $q, camel);
            //校验器
            var validator = new validatorService();
            $scope.info = {
                name: {
                    "id": "create-vlb-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "214",
                    "require": true,
                    "validate": "regularCheck(" + validator.name + "):" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64")
                },
                maxSession: {
                    label: i18n.lb_term_sessionMaxNum_label + ":",
                    "tooltip": i18n.lb_lb_add_para_sessionMaxNum_mean_tip,
                    "id": "create-vlb-maxSession",
                    "width": "214",
                    require: true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";minValue(1):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000") + ";maxValue(10000):" + i18n.sprintf(i18n.common_term_range_valid, "1", "10000")
                },
                maxPut: {
                    label: i18n.lb_term_throughputMaxKbps_label + ":",
                    "tooltip": i18n.lb_lb_add_para_throughputMaxKbps_mean_tip,
                    "id": "create-vlb-maxPut",
                    "width": "214",
                    require: true,
                    "validate": "integer:" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000") + ";minValue(8):" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000") + ";maxValue(10000000):" + i18n.sprintf(i18n.common_term_range_valid, "8", "10000000")
                },
                lbType: {
                    label: i18n.common_term_lbType_label + ":",
                    "id": "create-vlb-lbType",
                    "width": "220",
                    require: true,
                    value: [{
                        "selectId": "low",
                        "label": i18n.lb_term_softLB_label,
                        "checked": true
                    }, {
                        "selectId": "high",
                        "label": i18n.lb_term_hardLB_label
                    }]
                },
                frontNet: {
                    label: i18n.common_term_FrontNet_label + ":",
                    "tooltip": i18n.lb_lb_add_para_FrontNet_mean_tip,
                    "id": "create-vlb-frontNet",
                    "width": "220",
                    require: true,
                    value: []
                },
                backendNet: {
                    label: i18n.lb_term_backendNet_label + ":",
                    "tooltip": i18n.lb_lb_add_para_backendNet_mean_tip,
                    "id": "create-vlb-backendNet",
                    "width": "220",
                    require: true,
                    value: []
                },
                nextBtn: {
                    "id": "create-vlb-step1-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#vlb_create_basic"), undefined);
                        if (!valid) {
                            return;
                        }

                        //保存本页信息
                        $scope.service.vlbName = $("#create-vlb-name").widget().getValue();
                        $scope.service.maxSession = $("#create-vlb-maxSession").widget().getValue();
                        $scope.service.throughPut = $("#create-vlb-maxPut").widget().getValue();
                        var lbTypeDom = $("#create-vlb-lbType");
                        var frontNetDom = $("#create-vlb-frontNet");
                        var backendNetDom = $("#create-vlb-backendNet");
                        $scope.service.workingMode = {
                            "value": lbTypeDom.widget().getSelectedId(),
                            "label": lbTypeDom.widget().getSelectedLabel()
                        };
                        $scope.service.selectedFrontNetwork = {
                            "networkId": frontNetDom.widget().getSelectedId(),
                            "name": frontNetDom.widget().getSelectedLabel()
                        };
                        $scope.service.selectedBackNetwork = {
                            "networkId": backendNetDom.widget().getSelectedId(),
                            "name": backendNetDom.widget().getSelectedLabel()
                        };

                        $scope.service.show = "addMonitor";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-step1-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

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
                        // 处理json对象到页面展示
                        _.each(resolvedValue.networks, function (network) {
                            if (network && network.ipv4Subnet && network.status === "READY") {
                                var net = {
                                    "selectId": network.networkID,
                                    "label": network.name
                                };
                                $scope.info.frontNet.value.push(net);
                            }
                        });
                        if ($scope.info.frontNet.value[0]) {
                            $scope.info.frontNet.value[0].checked = true;
                        }
                        $scope.info.backendNet.value = $scope.info.frontNet.value;
                    }
                });
            }

            queryNetwoks();
        }
    ];
    return ctrl;
});
