/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-18

 */
define(["tiny-lib/jquery",
    'tiny-lib/angular',
    "language/dataanalytics-exception",
    "fixtures/clusterFixture",
    "app/services/exceptionService",
    "app/business/resources/services/monitorService"
],
    function ($, angular, dataanalyticsException, clusterFixture, ExceptionService,monitorService) {
        "use strict";
        var summaryCtrl = ['$scope', '$state', '$stateParams',"camel", function ($scope, $state, $stateParams, camel) {
            var user = $("html").scope().user;
            $scope.hostId = $stateParams.hostId;
            $scope.regionName = $stateParams.region;
            $scope.token = undefined;
            $scope.serviceID = undefined;
            var exceptionService = new ExceptionService();
            var colon = ":";
            var i18n = $scope.i18n || {};

            //返回按钮
            $scope.return = {
                "id": "return",
                "text": i18n.common_term_return_button || "返回",
                "disable": false,
                "click": function () {
                    $state.go($scope.fromState);
                }
            };
            $scope.basicInfo = {
                name: {
                    "label": i18n.common_term_name_label + colon,
                    "value": ""
                },
                project: {
                    "label": "project:",
                    "value": ""
                }
            };

            $scope.operator = {
                viewTopology: {
                    "id": "viewTopology",
                    "text": "查看拓扑",
                    "disable": false,
                    "focused": false,
                    "click": function () {

                    }},
                powerOn: {
                    "id": "powerOn",
                    "text": "上电",
                    "disable": false,
                    "focused": false,
                    "click": function () {

                    }},
                forciblyRestart: {
                    "id": "forciblyRestart",
                    "text": "强制重启",
                    "disable": false,
                    "focused": false,
                    "click": function () {

                    }},
                moreButton: {
                    "id": "hostMenuBtn",
                    "content": [
                        {
                            title: "强制下电",
                            border: false,  //是否有分割线
                            click: function () {
                            }
                        },
                        {
                            title: "刷新主机规格",
                            click: function () {
                            }
                        },
                        {
                            title: "BMC登录",
                            click: function () {
                            }
                        }
                    ],
                    type: "button",
                    "text": "更多",
                    "params": {"aa": "11"},
                    "clickCallback": function (e, item, widgetThis, params) {
                    }}
            };

            var portTableColumns = [
                {
                    "sTitle": "名称",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.alarm);
                    },
                    "sWidth": "25%",
                    "bSortable": false
                },
                {
                    "sTitle": "双工模式",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.serverName);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": "状态",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.runStatus);
                    },
                    "sWidth": "25%",
                    "bSortable": false},
                {
                    "sTitle": "速率",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.resourceStatus);
                    },
                    "sWidth": "25%",
                    "bSortable": false}
            ];

            $scope.portTable = {
                "id": "portTableId",
                "data": [],
                "lengthChange": true,
                "enablePagination": false,
                "columns":portTableColumns,
                "lengthMenu": [10, 20, 50],
                "curPage": {
                },
                "columnsDraggable": true,
                "show-details": true,
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                }
            };



            function convert(vv) {
                if (vv) {
                    vv = parseFloat(vv);
                    return Math.round(vv * 100) / 100.00;
                }
            }

            /*
             主机指标： CPU占用率(cpu_usage)、内存占用率(mem_usage)、网络流入速率(nic_byte_in)、网络流出速率(nic_byte_out)、
             磁盘I/O(disk_io_in、disk_io_out)、磁盘占用率(disk_usage)、网络接收包速(net_receive_pkg_rate)、网络发送包速(net_send_pkg_rate)、
             CPU预留率(cpu_reserve)、内存预留率 (mem_reserve)、CPU容量(cpu_capacity)、内存容量(mem_capacity)
             */
            //获取主机的监控信息
            function getMonitor() {
                var value = monitorService.getMonitor($scope.hostId, null, "host", ["cpu_usage", "mem_usage", "disk_usage", "nic_byte_in", "nic_byte_out",
                    "disk_io_in", "disk_io_out", "net_receive_pkg_rate", "net_send_pkg_rate"], function (value) {
                    if (value.success) {
                        $scope.$apply(function () {
                            var map = value.data;
                            $scope.cpuUsedRate = convert(map.cpu_usage);
                            $scope.memUsedRate = convert(map.mem_usage);
                            $scope.diskUsedRate = convert(map.disk_usage);
                            $scope.disk_io_in = convert(map.disk_io_in);
                            $scope.disk_io_out = convert(map.disk_io_out);
                            $scope.nic_byte_in = convert(map.nic_byte_in);
                            $scope.nic_byte_out = convert(map.nic_byte_out);
                            $scope.net_receive_pkg_rate = convert(map.net_receive_pkg_rate);
                            $scope.net_send_pkg_rate = convert(map.net_send_pkg_rate);
                        });
                    } else {
                        exceptionService.doException(value.data, dataanalyticsException);
                    }
                },$scope.regionName);
            }

            $scope.operator = {
                "getHost": function () {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-hosts/{host_id}",
                            o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId,"host_id":hostId}},
                        "userId": user.id,
                        "token": $scope.token
                    });
                    deferred.done(function (data) {
                        $scope.$apply(function () {
                            if (data && data.host) {
                                var host = data.host;
                                $scope.basicInfo.name = host.host;
                                $scope.basicInfo.project = host.project;
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "getToken": function () {
                    var deferred = camel.get({
                        "url": {"s": "/goku/rest/v1.5/token"},
                        "params": {"user-id": user.id},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }
                        $scope.token = data.id;
                        $scope.projectId = data.projectId;
                        $scope.operator.getHost();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "init": function () {
                    var deferred = camel.get({
                        "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.endpoint === undefined) {
                            return;
                        }

                        for (var index in data.endpoint) {
                            var regionName = data.endpoint[index].regionName;
                            if (data.endpoint[index].regionName == $stateParams.region
                                && data.endpoint[index].serviceName == "nova") {
                                $scope.serviceID = data.endpoint[index].id;
                                break;
                            }
                        }

                        // 打开时请求数据
                        if ($scope.serviceID != undefined) {
                            $scope.operator.getToken();
                        }
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };
            getMonitor();
        }];
        return summaryCtrl;
    });

