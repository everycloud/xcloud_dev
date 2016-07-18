/**
 * 资源分区统计
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Progressbar",
    "app/services/commonService",
    'tiny-widgets/Window'], function ($, angular, Progressbar, commonService, Window) {
    "use strict";

    var zoneCtrl = ["$scope", "$compile", "$state", "camel", "$rootScope", function ($scope, $compile, $state, camel, $rootScope) {
        $scope.deployMode = $("html").scope().deployMode;
        $scope.cloudType = $rootScope.user.cloudType;
        var constructStaticDom = function (used, total, rate, type) {
            var options = {
                "width": "50",
                "height": "9",
                "label-position": "right"
            };
            var cpuProgressbar = new Progressbar(options);
            var dom = $('<div />').append($('<div style="padding-top: 10px;padding-bottom: 10px;"/>').append(cpuProgressbar.getDom()));

            cpuProgressbar.opProgress(rate);

            var cpuStatic = '<span style="padding-right: 10px;">' + $scope.i18n.perform_term_usedAndTotal_label +
                '</span><span>' + used.toFixed(2) + '/' + total.toFixed(2) + '</span>';
            dom.append(cpuStatic);

            return dom;
        };

        var addOperatorDom = function (dataItem, row) {

            // 名称
            var name = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + commonService.htmlEncode(dataItem.name) + "</a>";
            var nameLink = $compile(name);
            var nameScope = $scope.$new();
            nameScope.data = dataItem;
            nameScope.goToDetail = function () {
                $state.go("resources.zoneResources.summary.zoneSummary", {"id": dataItem.id, "name": dataItem.name});
            };
            var nameNode = nameLink(nameScope);
            $("td:eq(0)", row).html(nameNode);

            var statistics = dataItem.statistics;

            // CPU使用率
            $('td:eq(1)', row).html(constructStaticDom(statistics.cpuUsedSizeGHz, statistics.cpuTotalSizeGHz, statistics.cpuUsageRate, "cpu"));

            // 内存使用率
            $('td:eq(2)', row).html(constructStaticDom(statistics.memUsedSizeGB, statistics.memTotalSizeGB, statistics.memUsageRate, "cpu"));

            // 存储池使用率
            $('td:eq(3)', row).html(constructStaticDom(statistics.storagePoolUsedSizeGB, statistics.storagePoolTotalSizeGB, statistics.storagePoolUsageRate, "cpu"));

            // VLAN池使用率
            $('td:eq(4)', row).html(constructStaticDom(statistics.vlanUsedNum, statistics.vlanTotalNum, statistics.vlanUsageRate, "cpu"));
        };

        $scope.zoneStaticTable = {
            id: "zoneStaticTableId",
            columnsDraggable: false,
            enablePagination: false,
            enableFilter: false,
            hideTotalRecords: true,
            showDetails: false,
            data: [],
            columns: [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                },
                {
                    "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_storagePoolUsageRate_label,
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_vlanUsageRate_label,
                    "bSortable": false
                }
            ],
            renderRow: function (row, dataitem, index) {
                // 增加tip属性
                $("td:eq(0)", row).addTitle();

                // 添加操作
                addOperatorDom(dataitem, row);
            }
        };

        $scope.zoneList = [];

        $scope.zoneConfig = {
            id: "zone-config-id",
            disabled: false,
            iconsClass: "",
            text: $scope.i18n.common_term_config_button,
            tip: "",
            click: function () {
                var options = {
                    "winId": "zoneConfigWinID",
                    "title": $scope.i18n.perform_term_zoneViewCfg_label,
                    "params": $scope.zoneList,
                    "content-type": "url",
                    "content": "./app/business/portlet/views/zoneConfig.html",
                    "height": 260,
                    "width": 500,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "close": function (event) {
                    }
                };

                var win = new Window(options);
                win.show();
            }
        };

        $scope.refresh = {
            id: "zone-statistics-id",
            disabled: false,
            iconsClass: "",
            text: $scope.i18n.common_term_fresh_button,
            tip: "",
            click: function () {
                $scope.operator.query();
            }
        };

        $scope.goToZonePage = function () {
            $state.go("resources.rpool.zone", {});
        };

        $scope.operator = {
            "query": function () {
                // 查询zone
                var params = {
                    "list": {
                        "start": 0,
                        "limit": 10,
                        "name": null
                    }
                };

                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/zones/action"},
                    "params": JSON.stringify(params),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    var zones = data && data.list && data.list.zones || [];
                    var zoneIdList = [];
                    for (var index in zones) {
                        zoneIdList.push(zones[index].id);
                    }

                    $scope.zoneList = zones;

                    $scope.operator.queryStatistics(zoneIdList);
                });
            },
            "queryStatistics": function (zoneIdList) {
                // 查询zone统计资源
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/capacity-statistics/zones"},
                    "params": JSON.stringify({"zoneIds": zoneIdList}),
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    // 显示数据
                    var zoneStatistics = data && data.reponse || {};
                    $scope.$apply(function () {
                        var zoneList = [];

                        for (var indexTemp in $scope.zoneList) {
                            var zoneInfo = $scope.zoneList[indexTemp];
                            var id = zoneInfo.id;
                            if (zoneStatistics.hasOwnProperty(id)) {
                                var sta = zoneStatistics[id];
                                sta.cpuUsageRate = (sta.cpuTotalSizeGHz == 0 ? 0 : sta.cpuUsedSizeGHz * 100 / sta.cpuTotalSizeGHz).toFixed(2);
                                sta.memUsageRate = (sta.memTotalSizeGB == 0 ? 0 : sta.memUsedSizeGB * 100 / sta.memTotalSizeGB).toFixed(2);
                                sta.storagePoolUsageRate = (sta.storagePoolTotalSizeGB == 0 ? 0 : sta.storagePoolUsedSizeGB * 100 / sta.storagePoolTotalSizeGB).toFixed(2);
                                sta.vlanUsageRate = (sta.vlanTotalNum == 0 ? 0 : sta.vlanUsedNum * 100 / sta.vlanTotalNum).toFixed(2);
                                zoneInfo.statistics = sta;
                                zoneInfo.show = true;
                            } else {
                                zoneInfo.statistics = null;
                                zoneInfo.show = false;
                            }

                            if (zoneInfo.show) {
                                zoneList.push(zoneInfo);
                            }
                        }

                        $scope.zoneStaticTable.data = zoneList;
                    });
                });
            }
        };

        if ($scope.deployMode !== 'top' && $scope.cloudType !== "OPENSTACK" && $scope.right.zone) {
            $scope.operator.query();
        }

    }];

    return zoneCtrl;
});