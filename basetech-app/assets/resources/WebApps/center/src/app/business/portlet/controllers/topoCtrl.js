/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：topo
 * 修改时间：2014-1-28
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "fixtures/availableZoneFixture"
], function ($, angular, _, ExceptionService, Window) {
    "use strict";
    var controllerProvider = null;
    var topoCtrl = ["$scope", "camel", "$state", "$timeout", "$modal", function ($scope, camel, $state, $timeout, $modal) {
        var exception = new ExceptionService();
        var user = $scope.user;
        $scope.openstack = user.cloudType === "OPENSTACK";
        var i18n = $scope.i18n || {};
        $scope.tips = $scope.openstack ? i18n.temp_openstack_access_tips : "";
        var connectStatusMap = {
            "connected": i18n.common_term_natural_value,
            "disconnected": i18n.common_term_abnormal_value,
            "connecting": i18n.common_term_linking_value,
            "connected_failed": i18n.common_term_linkFail_value
        };

        var serviceStatus = {
            "normal": $scope.i18n.common_term_natural_value,
            "pause": $scope.i18n.common_term_pauseUse_value,
            "abnormal": $scope.i18n.common_term_abnormal_value
        };
        var getValue = function (obj, key, fixed) {
            obj = obj || {};
            var res = obj[key] || 0.0;
            return res.toFixed(2);
        };

        var usedTotalText = "(" + (i18n.perform_term_usedAndTotal_label || "已用/全部") + ")";
        $scope.regionLabels = {
            region: (i18n.common_term_section_label || "地域") + ":",
            connectStatus: (i18n.common_term_linkStatus_value || "连接状态") + ":",
            serviceStatus: (i18n.common_term_serviceStatus_label || "服务状态") + ":",
            cpu: ("CPU") + usedTotalText + ":",
            memery: (i18n.common_term_memory_label || "内存") + usedTotalText + ":",
            storage: (i18n.common_term_storage_label || "存储") + usedTotalText + ":",
            detail: i18n.common_term_detail_label || "详情"
        };
        $scope.azLabels = {
            name: (i18n.common_term_name_label || "名称") + ":",
            bindedVDC: (i18n.resource_term_bondVDCnum_label || "VDC个数") + ":",
            status: (i18n.common_term_serviceStatus_label || "服务状态") + ":",
            detail: i18n.common_term_detail_label || "详情",
            more: i18n.common_term_more_button || "更多"
        };

        $scope.operator = {
            getRegionStatistic: function (infraId, index) {
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/statistics/cloud-infra",
                    "params": JSON.stringify({cloudInfraIds: [infraId]}),
                    "userId": user.id
                });

                deferred.success(function (response) {
                    var statistic = response.cloudInfraCapacity || [];
                    for (var j = 0, statisticLen = statistic.length; j < statisticLen; j++) {
                        var statisticItem = statistic[j];
                        if (infraId === statisticItem.id) {
                            $scope.regions[index].cpu = getValue(statisticItem, "cpuUsedSize") + "GHz/" + getValue(statisticItem, "cpuTotalSize") + "GHz";
                            $scope.regions[index].memery = getValue(statisticItem, "memUsedSize") + "GB/" + getValue(statisticItem, "memTotalSize") + "GB";
                            $scope.regions[index].storage = getValue(statisticItem, "storagePoolUsedSize") + "GB/" + getValue(statisticItem, "storagePoolTotalSize") + "GB";
                            break;
                        }
                    }
                });
                deferred.fail(function (data) {
                    exception.doException(data);
                });
            },
            getRegions: function () {
                var deferred = camel.get({
                    "url": "/goku/rest/v1.5/1/cloud-infras",
                    "params": {
                        start: 0,
                        limit: 4
                    },
                    "userId": user.id
                });

                deferred.success(function (response) {
                    var displayCluoudInfras = _.filter(response.cloudInfras, function (item) {
                        return item.region != "CloudPlatform";
                    });
                    $scope.regions = displayCluoudInfras;
                    for (var i = 0, len = displayCluoudInfras.length; i < len; i++) {
                        var item = displayCluoudInfras[i];
                        item.region = item.region || item.name;
                        item.serviceStatusText = item.serviceStatus ? (connectStatusMap[item.serviceStatus] || item.serviceStatus) : "";
                        item.connectStatusText = item.connectStatus ? (connectStatusMap[item.connectStatus] || item.connectStatus) : "";
                        $scope.operator.getAzs(item.id, i);
                        $scope.operator.getRegionStatistic(item.id, i);
                    }
                });
                deferred.fail(function (data) {
                    exception.doException(data);
                });
            },
            getAzs: function (infraId, index) {
                var params = {
                    cloudInfraId: infraId,
                    start: 0,
                    limit: 4,
                    serviceStatus: "",
                    name: "",
                    manageStatus: 'occupied'
                };
                var deferred = camel.post({
                    url: "/goku/rest/v1.5/1/available-zones/list",
                    params: JSON.stringify(params),
                    userId: user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    var lines = [];
                    for (var i = 0, len = azs.length; i < len; i++) {
                        var item = azs[i];
                        item.serviceStatusText = serviceStatus[item.serviceStatus] || item.serviceStatus;
                        item.associatedOrgNumText = item.associatedOrgNum || "0";
                    }
                    if (azs.length == 2) {
                        lines.push({x1: 32, y1: 50, x2: 98, y2: 50});
                    } else if (azs.length == 3) {
                        lines.push({x1: 32, y1: 25, x2: 65, y2: 75});
                        lines.push({x1: 32, y1: 25, x2: 98, y2: 25});
                        lines.push({x1: 98, y1: 25, x2: 65, y2: 75});
                    } else if (azs.length >= 4) {
                        //{32,25},{65,25},{98,75},{98,75}
                        lines.push({x1: 32, y1: 25, x2: 32, y2: 75});
                        lines.push({x1: 32, y1: 25, x2: 98, y2: 25});
                        lines.push({x1: 32, y1: 25, x2: 98, y2: 75});
                        lines.push({x1: 98, y1: 25, x2: 98, y2: 75});
                        lines.push({x1: 32, y1: 75, x2: 98, y2: 75});
                        lines.push({x1: 32, y1: 75, x2: 98, y2: 25});
                    }
                    $scope.$apply(function () {
                        $scope.regions[index].azs = azs;
                        $scope.regions[index].lines = lines;
                    });
                    $("line").each(function (index, el) {
                        $(el).attr("x1", $(el).attr("data-x1"));
                        $(el).attr("x2", $(el).attr("data-x2"));
                        $(el).attr("y1", $(el).attr("data-y1"));
                        $(el).attr("y2", $(el).attr("data-y2"));
                    });
                });
                deferred.fail(function (data) {
                    exception.doException(data);
                });
            },
            addRegion: function () {
                if ($scope.openstack) {
                    new Window({
                        "winId": "openStackWinId",
                        "title": $scope.i18n.cloud_term_openstackImport_button,
                        "width": 600,
                        "height": 400,
                        "content-type": "url",
                        "content": "app/business/multiPool/views/fusionCasecade/openStackAccess.html",
                        "buttons": null,
                        "close": function (event) {
                            if ($scope.openstack) {
                                setTimeout(function () {
                                    $scope.operator.getRegions();
                                }, 15000);
                            }
                            else {
                                $scope.operator.getRegions();
                            }

                        }
                    }).show();
                }
                else {
                    $state.go("service.cascade");
                }

            },
            regionAction: function ($event) {
                $event.stopPropagation();
                var $target = $($event.target);
                if (!$target.hasClass("region-item")) {
                    $target = $target.parents(".region-item");
                }
                var $popover = $target.children(".popover");
                var top = ($target.height() - $popover.height() + 50) / 2 + "px";
                $(".popover").each(function (index, el) {
                    if ($(el).attr("id") == $popover.attr("id")) {
                        $popover.css("top", top).fadeToggle();
                    } else {
                        $(el).fadeOut();
                    }
                });
            },
            regionDetail: function ($event, region) {
                $event.stopPropagation();
                $state.go("service.poolInfo.summary", {"name": region.name, "infraId": region.id, "from": $state.current.name, "type": region.type});
            },
            azAction: function ($event) {
                $event.stopPropagation();
                var target = $event.target;
                var $popover = $(target).next();
                var top = ($(target).height() - $popover.height() + 10) / 2 + "px";
                $(".popover").each(function (index, el) {
                    if ($(el).attr("id") == $popover.attr("id")) {
                        $popover.css("top", top).fadeToggle();
                    } else {
                        $(el).fadeOut();
                    }
                });
            },
            azDetail: function ($event, region) {
                $event.stopPropagation();
                $state.go("service.poolInfo.availableZone", {"name": region.name, "infraId": region.id, "from": $state.current.name, "type": region.type});
            }
        };
        $scope.operator.getRegions();

        $(document).bind("click.topo", function () {
            $(".popover").hide();
        });
    }];

    var mod = angular.module("serviceTopo", [], function ($controllerProvider) {
        controllerProvider = $controllerProvider;
    });
    mod.controller("servicePage.topo.ctrl", topoCtrl);

    return mod;
});
