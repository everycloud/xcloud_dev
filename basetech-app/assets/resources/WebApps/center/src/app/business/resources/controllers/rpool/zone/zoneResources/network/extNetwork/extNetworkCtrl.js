/**
 * 外部网络
 */
define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/Searchbox',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function ($, angular, Searchbox, Window, Message, constants, ExceptionService, zoneFixture) {
        "use strict";

        var extNetworkCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", '$rootScope', function ($scope, $compile, $state, $stateParams, camel, $rootScope) {
                var mapToString = function (map) {
                    if (!map) {
                        return "";
                    }
                    var hyperList = [];
                    for (var key in map) {
                        hyperList.push(map[key]);
                    }
                    return hyperList.join(";");
                };
                $scope.zoneInfo = {
                    "zoneID": $stateParams.id,
                    "zoneName": $stateParams.name
                };

                $scope.searchModel = {
                    "name": "",
                    "start": 0,
                    "limit": 10,
                    "dvsname": "",
                    "vlan": ""
                };

                /**
                 * 初始化外部网络表格的操作列
                 * @param dataItem
                 * @param row
                 */
                var addOperatorDom = function (dataItem, row) {
                    if (dataItem.ipUsage) {
                        var usage = "<a href='javascript:void(0)' ng-click='detail()'>" + dataItem.ipUsage + "</a>";
                        var usageLink = $compile(usage);
                        var usageScope = $scope.$new(false);
                        usageScope.usage = $.encoder.encodeForHTML(dataItem.usage);
                        usageScope.detail = function () {
                            ipUsageWin(dataItem.exnetworkID, dataItem.name);
                        }
                        var usageNode = usageLink(usageScope);
                        $("td:eq(10)", row).html(usageNode);
                    }
                    //修改
                    if (dataItem.status == 'READY' || dataItem.status == 'UPDATEFAIL') {
                        var modifyTemp = "<a href='javascript:void(0)' ng-click='edit()' class='margin-right-beautifier'>" + $scope.i18n.common_term_modify_button + "</a>";
                    }
                    else {
                        var modifyTemp = "<a class='disabled margin-right-beautifier'>" + $scope.i18n.common_term_modify_button + "</a>";
                    }
                    if (dataItem.status == 'READY' || dataItem.status == 'FAIL' || dataItem.status == 'UPDATEFAIL') {
                        var deleteTemp = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    }
                    else {
                        var deleteTemp = "<a class='disabled'>" + $scope.i18n.common_term_delete_button + "</a>";
                    }
                    var optTemplates = "<div>" + modifyTemp + deleteTemp + "</div>";

                    var scope = $scope.$new(false);
                    scope.data = dataItem;

                    scope.edit = function () {
                        $state.go("resources.modifyExtNetwork.navigation", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName, "id": dataItem.exnetworkID});
                    };
                    scope.delete = function () {
                        var msgOptions = {
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.resource_exter_delNet_info_confirm_msg,
                            "width": "300",
                            "height": "200"
                        };

                        var msgBox = new Message(msgOptions);

                        var buttons = [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: 'Y',
                                majorBtn : true,
                                default: true,
                                handler: function (event) {
                                    $scope.operator.delete(dataItem.exnetworkID);
                                    msgBox.destroy();
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: 'N',
                                default: false,
                                handler: function (event) {
                                    msgBox.destroy();
                                }
                            }
                        ];

                        msgBox.option("buttons", buttons);

                        msgBox.show();
                    };

                    var optDom = $compile($(optTemplates))(scope);
                    $("td:eq(11)", row).html(optDom);
                };

                var ipUsageWin = function (networkid, name) {
                    var ipUsageWindow = new Window({
                        "winId": "ipUsageInfoWin",
                        "title": name,
                        "minimizable": false,
                        "maximizable": false,
                        "networkid": networkid,
                        "content-type": "url",
                        "content": "../src/app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/ipUsage.html",
                        "height": 360,
                        "width": 640,
                        "buttons": null
                    }).show();
                };

                $scope.extNetworkTable = {
                    caption: "",
                    data: [],
                    id: "extNetworkTableId",
                    columnsDraggable: true,
                    enablePagination: true,
                    paginationStyle: "full_numbers",
                    lengthChange: true,
                    lengthMenu: [10, 20, 50],
                    displayLength: 10,
                    enableFilter: false,
                    curPage: {"pageIndex": 1},
                    totalRecords: 0,
                    hideTotalRecords: false,
                    showDetails: true,
                    columns: [
                        {
                            "sTitle": "", //设置第一列的标题
                            "mData": "",
                            "bSortable": false,
                            "sWidth": 30
                        },
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.exnetworkID);
                            },
                            "bSearchable": false,
                            "bSortable": false

                        },
                        {
                            "sTitle": "DVS",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.dvs);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hypervisor);
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
                            "sTitle": $scope.i18n.perform_term_IPstatistic_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ipUsage);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": "",
                            "bSortable": false
                        }
                    ],
                    columnVisibility: {
                        "activate": "click", // "mouseover"/"click"
                        "aiExclude": [0, 1, 2, 6, 11],
                        "fnStateChange": function (index, checked) {
                        }
                    },
                    callback: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    changeSelect: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.extNetworkTable.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    renderRow: function (row, dataitem, index) {
                        $(row).attr("zoneId", $.encoder.encodeForHTML($scope.zoneInfo.zoneID));
                        $(row).attr("exnetworkID", $.encoder.encodeForHTML(dataitem.exnetworkID));
                        $(row).attr("index", index);
                        $('td:eq(1)', row).addTitle();
                        $('td:eq(2)', row).addTitle();
                        $('td:eq(3)', row).addTitle();
                        $('td:eq(4)', row).addTitle();
                        $('td:eq(5)', row).addTitle();
                        $('td:eq(6)', row).addTitle();
                        $('td:eq(7)', row).addTitle();
                        $('td:eq(8)', row).addTitle();
                        $('td:eq(9)', row).addTitle();
                        // 添加操作
                        if ($scope.right.hasNetPoolOperateRight) {
                            addOperatorDom(dataitem, row);
                        }
                    }
                };

                $scope.refresh = {
                    id: "extNetworkRefresh_id",
                    refresh: function () {
                        $scope.operator.query();
                    }
                };

                $scope.searchBox = {
                    "id": "extNetworkSearchBox",
                    "placeholder": $scope.i18n.common_term_findName_prom,
                    "type": "round", // round,square,long
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.name = searchString;
                        $scope.operator.query();
                    }
                };
                $scope.create = {
                    id: "extNetworkCreate_id",
                    text: $scope.i18n.common_term_create_button,
                    create: function () {
                        "use strict";
                        $state.go("resources.addExtNetwork.navigation", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName});
                    }
                };
                $scope.operator = {
                    "query": function () {
                        var queryConfig = constants.rest.EXTERNAL_NETWORK_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "name": $scope.searchModel.name, "dvsname": $scope.searchModel.dvsname, "vlan": $scope.searchModel.vlan}},
                            "type": "GET",
                            "userId": $rootScope.user.id
                        })
                        deferred.done(function (response) {
                            var externalNetworks = response.externalNetworks;
                            $scope.$apply(function () {
                                for (var index1 in externalNetworks) {
                                    var vlans = externalNetworks[index1].vlans;
                                    if (vlans) {
                                        externalNetworks[index1].vlanList = vlans.join(";");
                                    }
                                    var dvsList = [];
                                    var hypervisorMap = {};
                                    for (var index2 in externalNetworks[index1].dvses) {
                                        dvsList.push(externalNetworks[index1].dvses[index2].name);
                                        var hypervisorName = externalNetworks[index1].dvses[index2].hypervisorName
                                        hypervisorMap[hypervisorName] = hypervisorName;
                                    }
                                    externalNetworks[index1].dvs = dvsList.join(";");
                                    externalNetworks[index1].hypervisor = mapToString(hypervisorMap);
                                    if (externalNetworks[index1].connectToInternetFlag) {
                                        externalNetworks[index1].connectInternet = $scope.i18n.common_term_yes_button;
                                    }
                                    else {
                                        externalNetworks[index1].connectInternet = $scope.i18n.common_term_no_label;
                                    }
                                    var subnet = [];
                                    var assignmentMode = [];
                                    var ipUsage = [];
                                    if (externalNetworks[index1].ipv4Subnet) {
                                        subnet.push(externalNetworks[index1].ipv4Subnet.subnetAddr);
                                        assignmentMode.push($scope.i18n[constants.config.IP_ALLOCATE_POLICY_STR[externalNetworks[index1].ipv4Subnet.ipAllocatePolicy]]);
                                        if (externalNetworks[index1].ipv4Subnet.ipAllocatePolicy == 1 || externalNetworks[index1].ipv4Subnet.ipAllocatePolicy == 3) {
                                            ipUsage.push(externalNetworks[index1].ipv4Subnet.usedAddrNum + "/" + externalNetworks[index1].ipv4Subnet.totalAddrNum);
                                        }

                                    }
                                    if (externalNetworks[index1].ipv6Subnet) {
                                        subnet.push(externalNetworks[index1].ipv6Subnet.subnetAddr);
                                        assignmentMode.push($scope.i18n[constants.config.IP_ALLOCATE_POLICY_STR[externalNetworks[index1].ipv6Subnet.ipAllocatePolicy]]);
                                        if (externalNetworks[index1].ipv6Subnet.ipAllocatePolicy == 1 || externalNetworks[index1].ipv6Subnet.ipAllocatePolicy == 3) {
                                            ipUsage.push(externalNetworks[index1].ipv6Subnet.usedAddrNum + "/" + externalNetworks[index1].ipv6Subnet.totalAddrNum);
                                        }
                                    }
                                    externalNetworks[index1].assignmentMode = assignmentMode.join(";");
                                    externalNetworks[index1].subnet = subnet.join(";");
                                    externalNetworks[index1].ipUsage = ipUsage.join(";");
                                    externalNetworks[index1].statusStr = $scope.i18n[constants.config.EXT_NETWORK_STATUS[externalNetworks[index1].status]];
                                    externalNetworks[index1].detail = {contentType: "url", content: "../src/app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/extNetworkDetail.html"};
                                }
                                $scope.extNetworkTable.data = externalNetworks;
                                $scope.extNetworkTable.totalRecords = response.total;
                            });
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    "delete": function (id) {
                        var deleteConfig = constants.rest.EXTERNAL_NETWORK_DELETE;
                        var deferred = camel.delete({
                            "dataType": "json",
                            "url": {s: deleteConfig.url, o: {"id": id}},
                            "type": "DELETE",
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.operator.query();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });

                    }
                };

                // 打开时请求数据
                $scope.operator.query($scope.searchModel);
            }]
            ;

        return extNetworkCtrl;
    })
;