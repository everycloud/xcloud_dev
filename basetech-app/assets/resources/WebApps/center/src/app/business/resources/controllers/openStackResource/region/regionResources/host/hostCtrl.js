define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "bootstrap/bootstrap.min",
    "app/services/competitionConfig",
    "fixtures/dataCenterFixture"
], function ($, angular, Window, Message, ExceptionService, bootstrap, Competition) {
    "use strict";

    var hostCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var user = $("html").scope().user;
        $scope.region = $stateParams.region;
        $scope.projectId = undefined;
        $scope.token = undefined;
        $scope.serviceID = undefined;

        $scope.tableData = [];
        var tableDatalength;

        var exceptionService = new ExceptionService();

        var i18n = $scope.i18n || {};
        var states = {
            up: $scope.i18n.common_term_running_value,
            down: $scope.i18n.common_term_stoped_value
        };
        var statuses = {
            "enabled": i18n.common_term_notIsolation_value || "未隔离",
            "disabled": i18n.common_term_isolation_value || "已隔离"
        };

        $scope.totalHostData = [];
        $scope.searchModel = {
            start: 0,
            limit: 10
        };
        //刷新按钮
        $scope.refreshButton = {
            "id": "refreshHostButton",
            "click": function () {
                $scope.operator.init();
            }
        };

        //分页信息
        var pageInfo = null;

        //主机列表
        $scope.hostTable = {
            "id": "hostTableId",
            "data": [],
            "totalRecords": 0,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "curPage": {
                "pageIndex": 1
            },
            "columnsVisibility": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": i18n.common_term_hostName_label || "主机名",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.host);
                    },
                    "sWidth": "150"
                },
                {
                    "sTitle": i18n.device_term_deviceName_label || "设备名称",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.serverName);
                    }
                },
                {
                    "sTitle": i18n.device_term_cabinets_label || "机柜",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.rackNo);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.device_term_subrack_label || "机框",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.subRackNo);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":i18n.device_term_slotID_label || "槽位",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.slotNo);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.resource_term_AZ_label || "可用分区",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.zone);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_status_label || "状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.stateStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_isolation_status || "隔离状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_manage_label + "IP" || "管理IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osIp);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
                $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                $scope.$apply(function () {
                    $scope.hostTable.data = $scope.totalHostData.slice($scope.searchModel.start, $scope.searchModel.limit);
                });
            },
            "changeSelect": function (evtObj) {
                $scope.searchModel.start = 0;
                $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                $scope.hostTable.displayLength = evtObj.displayLength;
                $scope.$apply(function () {
                    $scope.hostTable.data = $scope.totalHostData.slice($scope.searchModel.start, $scope.searchModel.limit);
                });
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                $("td:eq(3)", nRow).addTitle();
                $("td:eq(4)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();
                $("td:eq(6)", nRow).addTitle();
                $("td:eq(7)", nRow).addTitle();
                $("td:eq(8)", nRow).addTitle();
                if (!Competition["isBaseOnVmware"]) {
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.host;
                    scope.detail = function () {
                        $state.go("resources.ictHostDetail.summary", {"region": $scope.region, "hostId": aData.host});
                    };
                    var node = link(scope);
                    $("td:eq(0)", nRow).html(node);
                }

                var subMenus = "";
                if (aData.status === "enabled") {
                    subMenus = subMenus + '<a class="margin-right-beautifier" ng-click="setDisabled()">' + i18n.common_term_isolate_value + '</a>';
                    subMenus = subMenus + '<a class="disabled">' + i18n.common_term_removeIsolation_value + '</a>';
                }
                else if (aData.status === "disabled") {
                    subMenus = subMenus + '<a class="margin-right-beautifier disabled">' + i18n.common_term_isolate_value + '</a>';
                    subMenus = subMenus + '<a ng-click="setEnabled()">' + i18n.common_term_removeIsolation_value + '</a>';
                }
                var optColumn = "<div>" + subMenus + "</div>";

                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.setDisabled = function () {
                    var options = {
                        type: "confirm",
                        content: i18n.host_isolation_confirm_msg || "您确认要隔离主机吗？",
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: i18n.common_term_ok_button || '确定',
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.setStatus(aData.host, "disable");
                                }
                            },
                            {
                                label: i18n.common_term_cancle_button || '取消',
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.setEnabled = function () {
                    var options = {
                        type: "confirm",
                        content: i18n.host_remoceIsolation_confirm_msg || "您确认要解除隔离主机吗？",
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: i18n.common_term_ok_button || '确定',
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.setStatus(aData.host, "enable");
                                }
                            },
                            {
                                label: i18n.common_term_cancle_button || '取消',
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                };

                var optNode = optLink(optScope);
                $("td:eq(9)", nRow).html(optNode);
                optNode.find('.dropdown-toggle').dropdown();
            }
        };

        var queryServerInfo = function(hostList){
            var deferredQueryID = camel.post({
                "url":"/goku/rest/v1.5/irm/servers/openstack/hostinfo",
                params: JSON.stringify({
                    "hostVrmIdList": hostList
                }),
                "userId": user.id,
                "token": $scope.token

            });
            deferredQueryID.done(function(response){
                for(var i=0; i<tableDatalength; i++){
                    var adata = $scope.tableData[i];
                    var hostId = adata.host;
                    var locationInfo = response.serversInfo[hostId];
                    if(locationInfo){
                        adata.rackNo = locationInfo.rackNo;
                        adata.subRackNo = locationInfo.subRackNo;
                        adata.slotNo =locationInfo.slotNo;
                        adata.osIp = locationInfo.osIp;
                        adata.serverName = locationInfo.serverName;

                    }
                    else{
                        adata.rackNo = "";
                        adata.subRackNo = "";
                        adata.slotNo = "";
                        adata.osIp = "";
                        adata.serverName = "";
                    }
                    $scope.tableData[i] = adata;
                }
                $scope.$apply(function () {
                    $scope.totalHostData = $scope.tableData;
                    $scope.hostTable.data = $scope.totalHostData.slice($scope.searchModel.start, $scope.searchModel.limit);

                });
            });
            deferredQueryID.fail(function(response){
                $scope.$apply(function () {
                    $scope.totalHostData = $scope.tableData;
                    $scope.hostTable.data = $scope.totalHostData.slice($scope.searchModel.start, $scope.searchModel.limit);

                });
                exceptionService.doException(response);

            });
        }

        $scope.operator = {
            "queryHosts": function () {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-services",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId}},
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {
                    $scope.$apply(function () {
                        var hosts = [];
                        var hostsName = [];
                        if (data && data.services) {
                            var services = data.services;
                            for (var index in services) {
                                var service = services[index];
                                if (service && service.zone === "internal") {
                                    continue;
                                }
                                service.statusStr = statuses[service.status] || service.status;
                                service.stateStr = states[service.state] || service.state;
                                hosts.push(service);
                                hostsName.push(service.host);
                            }
                        }

                        $scope.tableData = hosts;
                        $scope.hostTable.data = $scope.tableData.slice($scope.searchModel.start, $scope.searchModel.limit);
                        $scope.hostTable.totalRecords =  $scope.tableData.length;
                        tableDatalength = $scope.tableData.length;
                        queryServerInfo(hostsName);
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "opertorHost": function (host_name, opType) {
                var params = {};
                params.operType = opType;
                params = JSON.stringify(params);
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-hosts/{host_id}/{opType}",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId, "host_id": host_name, "opType": opType}
                    },
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {
                    $scope.operator.action("query");
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "setStatus": function (hostId, status) {
                var params = {
                    "host": hostId,
                    "binary": "nova-compute"
                }
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-services/{status}",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId, "status": status}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {
                    $scope.operator.action("query");
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "action": function (type, id) {
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
                    if (type === "query") {
                        $scope.operator.queryHosts();
                    } else if (type === "shutdown" || type === "reboot") {
                        $scope.operator.opertorHost(id, type);
                    }
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
                        if (regionName === $stateParams.region &&
                            data.endpoint[index].serviceName === "nova") {
                            $scope.serviceID = data.endpoint[index].id;
                            break;
                        }
                    }

                    // 打开时请求数据
                    if ($scope.serviceID) {
                        $scope.operator.action("query");
                    }
                });
            }
        };
        if (!Competition["isBaseOnVmware"]) {
            $scope.hostTable.columns.push(
                {
                    "sTitle": i18n.common_term_operation_label || "操作",
                    "mData": "operator",
                    "bSortable": false
                });
        }
        //获取初始虚拟机列表
        $scope.operator.init();
    }];

    return hostCtrl;
});