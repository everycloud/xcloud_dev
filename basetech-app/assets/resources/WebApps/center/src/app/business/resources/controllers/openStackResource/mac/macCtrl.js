define(["tiny-lib/angular",
    "app/business/resources/services/openstackResources/ajaxNetwork",
    'jquery',
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/httpService"], function (angular, ajax, $, Window, Message, Exception, httpService) {
    "use strict";

    var ctrl = ["$scope", "$stateParams", "$compile", "fmLib", function ($scope, $stateParams, $compile, fmLib) {
        var demo = false;
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.region = $stateParams.region;
        //mac片段数据
        $scope.macPoolData = [];
        // 添加MAC片段按钮
        $scope.createMacButton = {
            "id": "createMacButton",
            "text": $scope.i18n.resource_term_addMACresourcePool_button || "添加MAC资源池",
            "click": function () {
                var newWindow = new Window({
                    "winId": "createMacPoolWindow",
                    "action": "add",
                    "title": $scope.i18n.resource_term_addMACresourcePool_button || "添加MAC资源池",
                    "serviceId": $scope.service.neutronId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/openStackResource/mac/createMacPool.html",
                    "height": 300,
                    "width": 550,
                    "close": function () {
                        $scope.queryMacPoolRanges();
                    }
                });
                newWindow.show();
            }
        }
        //mac片段列表
        $scope.displayTable = {
            "id": "displayTable111",
            "data": [],
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    sTitle: $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    sWidth: "10%",
                    bSortable: false
                },
                {
                    sTitle: "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.poolId);
                    },
                    sWidth: "12%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    sWidth: "10%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_MACsegment_label || "MAC地址段",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.macRange);
                    },
                    sWidth: "15%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_MACsegmentID_label || "MAC地址段ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rangeId);
                    },
                    sWidth: "15%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_MACtotalNum_label || "MAC地址总数",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.total);
                    },
                    sWidth: "9%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_MACavailableNum_label || "可用MAC地址数",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.remain);
                    },
                    sWidth: "9%",
                    bSortable: false
                },
                {
                    sTitle: $scope.i18n.common_term_operation_label,
                    sWidth: "20%",
                    "bSortable": false
                }
            ],
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                $("td:eq(3)", nRow).addTitle();
                $("td:eq(4)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();
                $("td:eq(6)", nRow).addTitle();
                // 操作列
                var subMenus = '<span>';
                var poolMenus = '';
                if (aData.macRange === "" || aData.macRange === undefined) {
                    subMenus = subMenus + '<a tabindex="1" ng-click="createMacRange()">' + $scope.i18n.virtual_term_addMACsegment_button + '</a>';
                } else {
                    subMenus = subMenus + '<a tabindex="1" ng-click="deleteMacRange()">' + $scope.i18n.virtual_term_delMACsegment_button + '</a>';
                }
                subMenus += '</span>';
                var optColumn = "<div><a href='javascript:void(0)' ng-click='deleteMacPool()'>" + $scope.i18n.resource_term_delMACresourcePool_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                    + subMenus + "</div>";

                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.data = aData;
                optScope.createMacRange = function () {
                    var newWindow = new Window({
                        "winId": "createMacRangeWindow",
                        "action": "add",
                        "poolId": aData.poolId,
                        "title": $scope.i18n.common_term_endMAC_label || "添加MAC地址段",
                        "serviceId": $scope.service.neutronId,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/openStackResource/mac/createMacRange.html",
                        "height": 300,
                        "width": 550,
                        "close": function () {
                            $scope.queryMacPoolRanges();
                        }
                    });
                    newWindow.show();
                };
                optScope.deleteMacRange = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.virtual_hyper_delMACsegment_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn : true,
                                handler: function (event) {
                                    $scope.displayTable.data.splice(iDataIndex, 1);
                                    $scope.deleteMacRange(aData);
                                    msg.destroy();
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    }
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.deleteMacPool = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.resource_mac_delMACresourcePool_info_confirm_msg || "确实要删除MAC地址资源池吗？",
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                handler: function (event) {
                                    $scope.displayTable.data.splice(iDataIndex, 1);
                                    $scope.deleteMacPool(aData);
                                    msg.destroy();
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    }
                    var msg = new Message(options);
                    msg.show();
                };

                var optNode = optLink(optScope);
                $("td:last", nRow).html(optNode);
            }
        };

        // 查询MacPoolRanges
        $scope.queryMacPoolRanges = function () {
            $scope.macPoolData = [];
            function data2table(data) {
                if (data && data.macpools) {
                    var arr = [];
                    for (var i in data.macpools) {
                        var pool = data.macpools[i];
                        var o = {
                            poolId: pool.id,
                            rangeId: "",
                            name: pool.name,
                            description: pool.description,
                            macRange: "",
                            total: pool.total,
                            remain: pool.remain
                        }
                        arr.push(o);
                    }
                    $scope.$apply(function () {
                        $scope.macPoolData = arr;
                    });
                }
                if ($scope.macPoolData) {
                    $scope.queryMacRanges();
                }
            }

            ajax.network.queryMacPools($scope.service.neutronId, data2table);
        };

        // 查询MacPoolRanges
        $scope.queryMacRanges = function () {
            $scope.displayTable.data = [];
            function data2table(data) {
                if (data && data.macranges) {
                    var arr = [];
                    for (var i in $scope.macPoolData) {
                        var pool = $scope.macPoolData[i];
                        var found = false;
                        for (var j in data.macranges) {
                            var range = data.macranges[j];
                            if (range.pool_id === pool.poolId) {
                                found = true;
                                var o = {
                                    poolId: pool.poolId,
                                    rangeId: range.id,
                                    name: pool.name,
                                    description: pool.description,
                                    macRange: range.min_mac_address + "-" + range.max_mac_address,
                                    total: pool.total,
                                    remain: pool.remain
                                }
                                arr.push(o);
                            }
                        }
                        if (!found) {
                            arr.push(pool);
                        }
                    }
                    $scope.$apply(function () {
                        $scope.displayTable.data = arr;
                    });
                }
            }

            ajax.network.queryMacRanges($scope.service.neutronId, data2table);
        };
        // 删除MacRange
        $scope.deleteMacRange = function (aData) {
            var rangeId = aData.rangeId;
            ajax.network.deleteMacRange($scope.service.neutronId, rangeId, function () {
                $scope.queryMacPoolRanges();
            });
        };
        // 删除MacPool
        $scope.deleteMacPool = function (aData) {
            var poolId = aData.poolId;
            ajax.network.deleteMacPool($scope.service.neutronId, poolId, function () {
                $scope.queryMacPoolRanges();
            });
        };
        $scope.service = {
            "neutronId": null
        };
        $scope.init = function () {
            function data2neutronId(data) {
                if (data === undefined || data.endpoint === undefined) {
                    return;
                }
                for (var index in data.endpoint) {
                    var regionName = data.endpoint[index].regionName;
                    if (regionName == $scope.region
                        && data.endpoint[index].serviceName == "neutron") {
                        $scope.service.neutronId = data.endpoint[index].id;
                        if ($scope.service.neutronId != undefined) {
                            $scope.queryMacPoolRanges();
                        }
                        break;
                    }
                }
            }

            ajax.network.getServiceId(data2neutronId);
        };

        // 页面初始化，获取neutron服务
        $scope.init();

    }]
    return ctrl;
});