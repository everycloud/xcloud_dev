/*global define*/
define(['jquery',
    "tiny-lib/angular",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "app/services/exceptionService"],
    function ($, angular, Message, Window, Exception) {
        "use strict";

        var externalNetCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            var infraId = $stateParams.infraId;
            $scope.poolType = $stateParams.type;
            $scope.infraName = $stateParams.infraName;

            $scope.help = {
                show: false
            };
            var EXT_NETWORK_STATUS = {
                "READY": $scope.i18n.common_term_natural_value,
                "DELETING": $scope.i18n.common_term_deleting_value,
                "PENDING": $scope.i18n.common_term_creating_value,
                "FAIL": $scope.i18n.common_term_fail_label,
                "UPDATING": $scope.i18n.common_term_updating_value,
                "UPDATEFAIL": $scope.i18n.common_term_modifyFail_value
            };
            var IP_ALLOCATE_POLICY_STR = {
                0: $scope.i18n.resource_term_externalDHCP_label,
                1: $scope.i18n.common_term_innerDHCP_label,
                2: $scope.i18n.common_term_manual_label,
                3: $scope.i18n.vpc_term_staticInjection_label,
                4: $scope.i18n.resource_exter_add_para_allocationIP_mean_noStatusAuto_label
            };
            var searchInfo = {
                az: null,
                name: "",
                start: 0,
                limit: 10
            };
            $scope.refresh = function () {
                getExNet();
            };

            $scope.exNetTable = {
                data: [],
                id: "exNetTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                totalRecords: 0,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlanList);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_exter_add_para_internet_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.connectInternet);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_SubnetIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnet);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IPassignMode_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.assignmentMode);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (pageInfo) {
                    searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getExNet();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.exNetTable.displayLength = pageInfo.displayLength;
                    getExNet();
                },
                renderRow: function (row, dataitem, index) {
                    $('td:eq(0)', row).addTitle();
                    $('td:eq(1)', row).addTitle();
                    $('td:eq(2)', row).addTitle();
                    $('td:eq(3)', row).addTitle();
                    $('td:eq(4)', row).addTitle();
                    $('td:eq(5)', row).addTitle();
                    $('td:eq(6)', row).addTitle();
                }
            };

            $scope.azSelector = {
                "id": "azSelector",
                "width": "150",
                "values": [
                ],
                "change": function () {
                    searchInfo.az = $("#" + $scope.azSelector.id).widget().getSelectedId();
                    getExNet();
                }
            };

            function getExNet() {
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/1/available-external-networks?" +
                            "cloud-infras={infraId}&start={start}&limit={limit}&az-id={azId}&usedbyrouter=false&usedbyvxlanrouter=false&isAssociated=false",
                        o: {infraId: infraId, start: searchInfo.start, limit: searchInfo.limit, azId: searchInfo.az}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var exNets = data.externalNetworks;
                    for (var index in exNets) {
                        var vlans = exNets[index].vlans;
                        if (vlans) {
                            exNets[index].vlanList = vlans.join(";");
                        }
                        exNets[index].connectInternet = exNets[index].connectToInternetFlag ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                        var subnet = [];
                        var assignmentMode = [];
                        if (exNets[index].ipv4Subnet) {
                            subnet.push(exNets[index].ipv4Subnet.subnetAddr);
                            assignmentMode.push(IP_ALLOCATE_POLICY_STR[exNets[index].ipv4Subnet.ipAllocatePolicy]);
                        }
                        if (exNets[index].ipv6Subnet) {
                            subnet.push(exNets[index].ipv6Subnet.subnetAddr);
                            assignmentMode.push(IP_ALLOCATE_POLICY_STR[exNets[index].ipv6Subnet.ipAllocatePolicy]);
                        }
                        exNets[index].assignmentMode = assignmentMode.join(";");
                        exNets[index].subnet = subnet.join(";");
                        exNets[index].statusStr = EXT_NETWORK_STATUS[exNets[index].status];
                    }
                    $scope.$apply(function () {
                        $scope.exNetTable.totalRecords = data.total;
                        $scope.exNetTable.data = exNets;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getAzs() {
                var params = {
                    cloudInfraId: infraId,
                    start: 0,
                    limit: null,
                    manageStatus: 'occupied'
                };
                var deferred = camel.post({
                    url: "/goku/rest/v1.5/1/available-zones/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    var values = [];
                    for (var index in azs) {
                        var value = {
                            "selectId": azs[index].id,
                            "label": azs[index].name
                        };
                        values.push(value);
                    }
                    if (values.length > 0) {
                        values[0].checked = true;
                        searchInfo.az = values[0].selectId;
                        $("#" + $scope.azSelector.id).widget().option("values", values);
                        getExNet();
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getAzs();
        }];
        return externalNetCtrl;
    });