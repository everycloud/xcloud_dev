define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'tiny-widgets/Window',
    "tiny-widgets/CirqueChart",
    'fixtures/zoneFixture'],
    function (angular, constants, Window, CirqueChart) {
        "use strict";

        var summaryCtrl = ["$scope", "$state", "$stateParams", "camel", "$rootScope", "exception", function ($scope, $state, $stateParams, camel, $rootScope, exception) {
            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };
            $scope.vmwareHyper = false;

            $scope.vlanModel = {
                "orgUsed": {
                    "label": $scope.i18n.perform_term_usedByVDC_label + ":",
                    "value": 0
                },
                "exNetworkUsed": {
                    "label": $scope.i18n.perform_term_usedByExternalNet_label + ":",
                    "value": 0
                },
                "available": {
                    "label": $scope.i18n.common_term_available_label + ":",
                    "value": 0
                },
                "total": {
                    "label": $scope.i18n.common_term_totalNum_label + ":",
                    "value": 0
                }
            };

            $scope.netModel = {
                "used": {
                    "label": $scope.i18n.perform_term_allocated_label + ":",
                    "value": 0
                },
                "available": {
                    "label": $scope.i18n.common_term_available_label + ":",
                    "value": 0
                },
                "total": {
                    "label": $scope.i18n.common_term_totalNum_label + ":",
                    "value": 0
                }
            };

            $scope.firewallModel = {
                "used": {
                    "label": $scope.i18n.common_term_used_value + ":",
                    "value": 0
                },
                "available": {
                    "label": $scope.i18n.common_term_available_label + ":",
                    "value": 0
                },
                "total": {
                    "label": $scope.i18n.common_term_totalNum_label + ":",
                    "value": 0
                }
            };

            $scope.vsaModel = {
                "used": {
                    "label": $scope.i18n.common_term_used_value + ":",
                    "value": 0
                },
                "available": {
                    "label": $scope.i18n.common_term_available_label + ":",
                    "value": 0
                },
                "total": {
                    "label": $scope.i18n.common_term_totalNum_label + ":",
                    "value": 0
                }
            };

            //操作
            $scope.operate = {
                "queryVlanStatistics": function (zoneId) {
                    var deferred = camel.post({
                        "url": {"s": constants.rest.NETWORK_VLAN_STATISTICS.url, "o": {"zoneid": zoneId}},
                        "params": JSON.stringify({}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新数据
                        if (!data) {
                            return;
                        }

                        var vlanStatistics = [
                            {
                                value: (data.usedNumByVDC + data.usedNumByExternalNetwork),
                                name: $scope.i18n.common_term_used_value,
                                color: "#33a6ff",
                                tooltip: $scope.i18n.common_term_used_value,
                                click: function () {

                                }
                            },
                            {
                                value: data.total,
                                name: $scope.i18n.common_term_available_label,
                                color: "#d5d5d5",
                                tooltip: $scope.i18n.common_term_available_label
                            }
                        ];

                        var centerText = {
                            text: data.total == 0 ? "0%" : Math.ceil((data.usedNumByVDC + data.usedNumByExternalNetwork) / data.total * 100) + "%",
                            fontSize: 20,
                            color: "#33a6ff"
                        };

                        $scope.$apply(function () {
                            var options = {
                                "id": "vlan-statistics-cirque",
                                "percent": false,
                                "r": "50",
                                "showLegend": false,
                                "strokeWidth": "15",
                                "centerText": centerText,
                                "width": 120,
                                "height": 120,
                                "data": vlanStatistics
                            };
                            new CirqueChart(options);

                            $scope.vlanModel.orgUsed.value = data.usedNumByVDC;
                            $scope.vlanModel.exNetworkUsed.value = data.usedNumByExternalNetwork;
                            $scope.vlanModel.total.value = data.total;
                            $scope.vlanModel.available.value = data.total - data.usedNumByVDC - data.usedNumByExternalNetwork;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "queryPublicIpStatistics": function (zoneId) {
                    var deferred = camel.post({
                        "url": {"s": constants.rest.NETWORK_PUBLICIP_STATISTICS.url, "o": {"zoneid": zoneId}},
                        "params": JSON.stringify({}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新数据
                        if (!data) {
                            return;
                        }

                        var publicIpStatistics = [
                            {
                                value: data.allocatedNum,
                                name: $scope.i18n.perform_term_allocated_label,
                                color: "#33a6ff",
                                tooltip: $scope.i18n.perform_term_allocated_label,
                                click: function () {
                                }
                            },
                            {
                                value: (data.total - data.allocatedNum),
                                name: $scope.i18n.common_term_available_label,
                                color: "#d5d5d5",
                                tooltip: $scope.i18n.common_term_available_label
                            }
                        ];

                        var centerText = {
                            text: data.total == 0 ? "0%" : Math.ceil(data.allocatedNum / data.total * 100) + "%",
                            fontSize: 20,
                            color: "#33a6ff"
                        };

                        $scope.$apply(function () {
                            var options = {
                                "id": "publicIp-statistics-cirque",
                                "percent": false,
                                "r": "50",
                                "showLegend": false,
                                "strokeWidth": "15",
                                "centerText": centerText,
                                "width": 120,
                                "height": 120,
                                "data": publicIpStatistics
                            };
                            new CirqueChart(options);

                            $scope.netModel.used.value = data.allocatedNum;
                            $scope.netModel.available.value = data.total - data.allocatedNum;
                            $scope.netModel.total.value = data.total;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "queryVFirewallStatistics": function (zoneId) {
                    var deferred = camel.post({
                        "url": {"s": constants.rest.NETWORK_VFIREWALL_STATISTICS.url, "o": {"zoneid": zoneId}},
                        "params": JSON.stringify({}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新数据
                        if (!data) {
                            return;
                        }

                        var vFirewallStatistics = [
                            {
                                value: data.usedNum,
                                name: $scope.i18n.common_term_used_value,
                                color: "#33a6ff",
                                tooltip: $scope.i18n.common_term_used_value,
                                click: function () {

                                }
                            },
                            {
                                value: (data.total - data.usedNum),
                                name: $scope.i18n.common_term_available_label,
                                color: "#d5d5d5",
                                tooltip: $scope.i18n.common_term_available_label
                            }
                        ];

                        var centerText = {
                            text: data.total == 0 ? "0%" : Math.ceil(data.usedNum / data.total * 100) + "%",
                            fontSize: 20,
                            color: "#33a6ff"
                        };

                        $scope.$apply(function () {
                            var options = {
                                "id": "vFirewall-statistics-cirque",
                                "percent": false,
                                "r": "50",
                                "showLegend": false,
                                "strokeWidth": "15",
                                "centerText": centerText,
                                "width": 120,
                                "height": 120,
                                "data": vFirewallStatistics
                            };
                            new CirqueChart(options);

                            $scope.firewallModel.used.value = data.usedNum;
                            $scope.firewallModel.available.value = data.total - data.usedNum;
                            $scope.firewallModel.total.value = data.total;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "queryVsaMgtNetworkStatistics": function (zoneId) {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.NETWORK_VSA_MNETWOEK_STATISTICS.url, "o": {"zoneid": zoneId}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 刷新数据
                        if (!data) {
                            return;
                        }
                        var vsaStatistics = [
                            {
                                value: data.usedNum,
                                name: $scope.i18n.common_term_used_value,
                                color: "#33a6ff",
                                tooltip: $scope.i18n.common_term_used_value,
                                click: function () {

                                }
                            },
                            {
                                value: (data.total - data.usedNum),
                                name: $scope.i18n.common_term_available_label,
                                color: "#d5d5d5",
                                tooltip: $scope.i18n.common_term_available_label
                            }
                        ];

                        var centerText = {
                            text: data.total == 0 ? "0%" : Math.ceil(data.usedNum / data.total * 100) + "%",
                            fontSize: 20,
                            color: "#33a6ff"
                        };

                        $scope.$apply(function () {
                            var options = {
                                "id": "vsa-mgtNetwork-statistics-cirque",
                                "percent": false,
                                "r": "50",
                                "showLegend": false,
                                "strokeWidth": "15",
                                "centerText": centerText,
                                "width": 120,
                                "height": 120,
                                "data": vsaStatistics
                            };
                            new CirqueChart(options);

                            $scope.vsaModel.total.value = data.total;
                            $scope.vsaModel.available.value = (data.total - data.usedNum);
                            $scope.vsaModel.used.value = data.usedNum;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };
            /**
             * 初始化操作
             */
            $scope.init = function () {
                var zoneId = $scope.zoneInfo.zoneID;
                $scope.operate.queryVlanStatistics(zoneId);
                $scope.operate.queryPublicIpStatistics(zoneId);
                $scope.operate.queryVFirewallStatistics(zoneId);
                $scope.operate.queryVsaMgtNetworkStatistics(zoneId);
            };

            // 初始化
            $scope.init();
        }];

        return summaryCtrl;
    });
