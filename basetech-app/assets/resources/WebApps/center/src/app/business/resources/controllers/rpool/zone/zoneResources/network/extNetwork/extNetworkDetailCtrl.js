/**
 * 外部网络详情
 */
define(["tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants",
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function (angular, httpService, constants, ExceptionService, zoneFixture) {
        "use strict";

        var extNetworkDetailCtrl = ["$scope", "camel", function ($scope, camel) {
            $scope.i18n = $("html").scope().i18n;
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.networkInfo = undefined;

            $scope.networkTable = {
                caption: "",
                data: [],
                id: "networkTableId",
                columnsDraggable: false,
                enablePagination: false,
                columns: [],
                renderRow: function (row, dataitem, index) {
                    $('td:eq(1)', row).addTitle();
                    $('td:eq(2)', row).addTitle();
                },
                "initNetworkTable": function () {
                    var data = [];
                    var ipv4Info = $scope.networkInfo.ipv4Subnet;
                    var ipv6Info = $scope.networkInfo.ipv6Subnet;
                    if (null != ipv4Info && null != ipv6Info) {
                        $scope.networkTable.columns = [
                            {
                                "sTitle": "",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.attribute);
                                },
                                "bSearchable": false,
                                "bSortable": false
                            },
                            {
                                "sTitle": "IPv4",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ipv4);
                                },
                                "bSortable": false
                            },
                            {
                                "sTitle": "IPv6",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ipv6);
                                },
                                "bSortable": false
                            }
                        ];
                        if (!$.isEmptyObject(ipv4Info.availableIPRanges)) {
                            var ipv4Ips = []
                            for (var index in ipv4Info.availableIPRanges) {
                                ipv4Ips.push(ipv4Info.availableIPRanges[index].startIP + "-" + ipv4Info.availableIPRanges[index].endIP);
                            }
                            ipv4Info.ipv4Ips = ipv4Ips.join(";");
                        }
                        if (!$.isEmptyObject(ipv6Info.availableIPRanges)) {
                            var ipv6Ips = []
                            for (var index in ipv4Info.availableIPRanges) {
                                ipv6Ips.push(ipv6Info.availableIPRanges[index].startIP + "-" + ipv6Info.availableIPRanges[index].endIP);
                            }
                            ipv6Info.ipv6Ips = ipv6Ips.join(";");
                        }
                        data.push({"attribute": $scope.i18n.common_term_SubnetType_label, "ipv4": $scope.i18n[constants.config.EXERNAL_NETWORK_TYPE_STR[$scope.networkInfo.externalNetworkType]], "ipv6": $scope.i18n[constants.config.EXERNAL_NETWORK_TYPE_STR[$scope.networkInfo.externalNetworkType]]});
                        data.push({"attribute": $scope.i18n.common_term_SubnetMask_label + "/" + $scope.i18n.vpc_term_IPv6subnetPrefix_label, "ipv4": ipv4Info.subnetPrefix, "ipv6": ipv6Info.subnetPrefix});
                        data.push({"attribute": $scope.i18n.common_term_gateway_label, "ipv4": ipv4Info.gateway, "ipv6": ipv6Info.gateway});
                        data.push({"attribute": $scope.i18n.common_term_enableIPsegment_label, "ipv4": ipv4Info.ipv4Ips || "--", "ipv6": ipv6Info.ipv6Ips || "--"});
                        data.push({"attribute": $scope.i18n.common_term_domainName_label, "ipv4": ipv4Info.dhcpOption.domainName || "--", "ipv6": ipv6Info.dhcpOption.domainName || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDNS_label, "ipv4": ipv4Info.dhcpOption.primaryDNS || "--", "ipv6": ipv6Info.dhcpOption.primaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDNS_label, "ipv4": ipv4Info.dhcpOption.secondaryDNS || "--", "ipv6": ipv6Info.dhcpOption.secondaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeWINS_label, "ipv4": ipv4Info.dhcpOption.primaryWINS || "--", "ipv6": "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyWINS_label, "ipv4": ipv4Info.dhcpOption.secondaryWINS || "--", "ipv6": "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDHCP_label, "ipv4": ipv4Info.dhcpOption.dhcpServerIP1 || "--", "ipv6": ipv6Info.dhcpOption.dhcpServerIP1 || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDHCP_label, "ipv4": ipv4Info.dhcpOption.dhcpServerIP2 || "--", "ipv6": ipv6Info.dhcpOption.dhcpServerIP2 || "--"});
                    }
                    else if (null != ipv4Info) {
                        $scope.networkTable.columns = [
                            {
                                "sTitle": "",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.attribute);
                                },
                                "bSearchable": false,
                                "bSortable": false
                            },
                            {
                                "sTitle": "IPv4",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ipv4);
                                },
                                "bSortable": false
                            }
                        ];
                        if (!$.isEmptyObject(ipv4Info.availableIPRanges)) {
                            var ipv4Ips = []
                            for (var index in ipv4Info.availableIPRanges) {
                                ipv4Ips.push(ipv4Info.availableIPRanges[index].startIP + "-" + ipv4Info.availableIPRanges[index].endIP);
                            }
                            ipv4Info.ipv4Ips = ipv4Ips.join(";");
                        }
                        data.push({"attribute": $scope.i18n.common_term_SubnetType_label, "ipv4": $scope.i18n[constants.config.EXERNAL_NETWORK_TYPE_STR[$scope.networkInfo.externalNetworkType]]});
                        data.push({"attribute": $scope.i18n.common_term_SubnetMask_label, "ipv4": ipv4Info.subnetPrefix});
                        data.push({"attribute": $scope.i18n.common_term_gateway_label, "ipv4": ipv4Info.gateway});
                        data.push({"attribute": $scope.i18n.common_term_enableIPsegment_label, "ipv4": ipv4Info.ipv4Ips || "--"});
                        data.push({"attribute": $scope.i18n.common_term_domainName_label, "ipv4": ipv4Info.dhcpOption.domainName || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDNS_label, "ipv4": ipv4Info.dhcpOption.primaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDNS_label, "ipv4": ipv4Info.dhcpOption.secondaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeWINS_label, "ipv4": ipv4Info.dhcpOption.primaryWINS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyWINS_label, "ipv4": ipv4Info.dhcpOption.secondaryWINS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDHCP_label, "ipv4": ipv4Info.dhcpOption.dhcpServerIP1 || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDHCP_label, "ipv4": ipv4Info.dhcpOption.dhcpServerIP2 || "--"});
                    }
                    else if (null != ipv6Info) {
                        $scope.networkTable.columns = [
                            {
                                "sTitle": "",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.attribute);
                                },
                                "bSearchable": false,
                                "bSortable": false
                            },
                            {
                                "sTitle": "IPv6",
                                "mData": function (data) {
                                    return $.encoder.encodeForHTML(data.ipv6);
                                },
                                "bSortable": false
                            }
                        ];
                        if (!$.isEmptyObject(ipv6Info.availableIPRanges)) {
                            var ipv6Ips = []
                            for (var index in ipv6Info.availableIPRanges) {
                                ipv6Ips.push(ipv6Info.availableIPRanges[index].startIP + "-" + ipv6Info.availableIPRanges[index].endIP);
                            }
                            ipv6Info.ipv6Ips = ipv6Ips.join(";");
                        }
                        data.push({"attribute": $scope.i18n.common_term_SubnetType_label, "ipv6": $scope.i18n[constants.config.EXERNAL_NETWORK_TYPE_STR[$scope.networkInfo.externalNetworkType]]});
                        data.push({"attribute": $scope.i18n.common_term_gateway_label, "ipv6": ipv6Info.gateway});
                        data.push({"attribute": $scope.i18n.vpc_term_IPv6subnetPrefix_label, "ipv6": ipv6Info.subnetPrefix});
                        data.push({"attribute": $scope.i18n.common_term_enableIPsegment_label, "ipv6": ipv6Info.ipv6Ips || "--"});
                        data.push({"attribute": $scope.i18n.common_term_domainName_label, "ipv6": ipv6Info.dhcpOption.domainName || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDNS_label, "ipv6": ipv6Info.dhcpOption.primaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDNS_label, "ipv6": ipv6Info.dhcpOption.secondaryDNS || "--"});
                        data.push({"attribute": $scope.i18n.common_term_activeDHCP_label, "ipv6": ipv6Info.dhcpOption.dhcpServerIP1 || "--"});
                        data.push({"attribute": $scope.i18n.common_term_standbyDHCP_label, "ipv6": ipv6Info.dhcpOption.dhcpServerIP2 || "--"});
                    }
                    else {
                        //do nothing
                    }
                    $scope.networkTable.data = data;
                }
            };

            $scope.operator = {
                "queryDetailInfo": function (zoneid, id) {
                    var detailConfig = constants.rest.EXTERNAL_NETWORK_DETAIL;
                    var deferred = camel.get({
                        "url": {s: detailConfig.url, o: {"zoneid": zoneid, "id": id}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.networkInfo = response;
                            if ($scope.networkInfo.portSetting.outTrafficShapingPolicyFlag) {
                                $scope.networkInfo.portSetting.outTrafficShapingPolicy.priorityStr = $scope.i18n[constants.config.OUT_TRAFFIC_PRIORITY[$scope.networkInfo.portSetting.outTrafficShapingPolicy.priority]];
                            }
                            $scope.networkTable.initNetworkTable();
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
        }];

        var dependency = [];
        var extNetworkDetailModule = angular.module("extNetworkDetailModule", []);
        extNetworkDetailModule.controller("extNetworkDetailCtrl", extNetworkDetailCtrl);
        extNetworkDetailModule.service("camel", httpService);
        return extNetworkDetailModule;
    })


