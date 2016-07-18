/**
 虚拟主机列表页面
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "bootstrap/bootstrap.min",
    "fixtures/hhostFixture"
], function ($, angular, Window, Progressbar, Message, Exception, bootstrap) {
    "use strict";

    var hostCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$rootScope", function ($scope, $compile, $state, $stateParams, camel, $rootScope) {
        var user = $("html").scope().user;
        var exceptionService = new Exception();
        $scope.curState = $state.current.name;
        $scope.hasHostManageOperateRight = $rootScope.user.privilege.role_role_add_option_hostHandle_value;
        $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
        var hyperId = $stateParams.hyperId;
        $scope.hyperType = $stateParams.hyperType === "vmware"?"VMware":$stateParams.hyperType;
        var resourceId = "";
        if ($scope.curState === "resources.storeInfo.host") {
            resourceId = $stateParams.storeId;
        } else {
            resourceId = $stateParams.clusterId;
        }

        var HOST_RUN_STATUS = {
            "rebooting": $scope.i18n.common_term_restarting_value,
            "normal": $scope.i18n.common_term_natural_value,
            "fault": $scope.i18n.common_term_trouble_label,
            "initial": $scope.i18n.common_term_initializtion_value,
            "unknow": $scope.i18n.common_term_unknown_value,
            "unknown": $scope.i18n.common_term_unknown_value,
            "poweroff": $scope.i18n.common_term_offline_label,
            "booting": $scope.i18n.common_term_oning_value,
            "shutdowning": $scope.i18n.common_term_downing_value
        };
        $scope.help = {
            show: false
        };
        //导出按钮
        $scope.exportButton = {
            "id": "hostEnvironmentButton",
            "text": $scope.i18n.common_term_export_button,
            "click": function () {
                var exportHost = {};
                //导出主机列表所属的范围 取值为"cluster"或"storage"
                if ($stateParams.from === "resources.zoneResources.storage.mainStorage" || $stateParams.from === "resources.clusterInfo.store") {
                    exportHost.scopeType = "DATASTORE";
                } else {
                    exportHost.scopeType = "RESOURCECLUSTER";
                }
                exportHost.objectId = resourceId;
                var newWindow = new Window({
                    "winId": "exportHostListWindow",
                    "title": $scope.i18n.common_term_exportList_button,
                    "params": {
                        "exportHostInfo": exportHost,
                        "totalRecords": $scope.hostTable.totalRecords,
                    },
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/host/exportHostList.html",
                    "height": 220,
                    "width": 510,
                    "close": function () {
                    }
                });
                newWindow.show();
            }
        };
        //刷新按钮
        $scope.refreshButton = {
            "id": "refreshHostButton",
            "text": $scope.i18n.common_term_fresh_button,
            "click": function () {
                $scope.operator.init();
            }
        };

        $scope.HostSearchModel = {
            "offset": 0,
            "limit": 10
        };

        //主机列表
        $scope.hostTable = {
            "id": "hypervisorHostTable",
            "data": null,
            "totalRecords": 0,
            "paginationStyle": "full_numbers",
            "displayLength":10,
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "showDetails": true,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_hostName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_runningStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.runtimeState);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.cpuUsageRate);
                    },
                    "bSortable": false,
                    "sWidth": 180
                },
                {
                    "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.memUsageRate);
                    },
                    "bSortable": false,
                    "sWidth": 180
                },
                {
                    "sTitle": $scope.i18n.common_term_hostIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hostIp);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.device_term_CPUfrequencyGHz_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.cpuSpeed);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_memoryGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.memorySizeGB);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.operator);
                    },
                    "bSortable": false,
                    "sWidth": 150
                }
            ],
            "callback": function (pageInfo) {
                $scope.HostSearchModel.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
                $scope.operator.init();
            },
            "changeSelect": function (pageInfo) {
                $scope.HostSearchModel.offset = 0;
                $scope.hostTable.curPage = {
                    "pageIndex": 1
                };
                $scope.HostSearchModel.limit = pageInfo.displayLength;
                $scope.hostTable.displayLength = pageInfo.displayLength;
                $scope.operator.init();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                //详情链接
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("hostId", $.encoder.encodeForHTML("" + aData.id));
                $(nRow).attr("hyperType", $.encoder.encodeForHTML("" + $scope.hyperType));
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();

                var link = $compile("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>");
                var scope = $scope.$new(false);
                scope.detail = function () {
                    $state.go("resources.hostDetail.summary", {"hostId": $.encoder.encodeForHTML(aData.id), "type": "host", "name": aData.name});
                };
                var node = link(scope);
                $("td:eq(1)", nRow).html(node);

                //运行状态
                $("td:eq(2)", nRow).html(HOST_RUN_STATUS[aData.runtimeState]);

                // CPU使用率进度条
                var options = {
                    "width": "70",
                    "height": "9",
                    "label-position": "right"
                };
                var progressbar = new Progressbar(options);
                $('td:eq(3)', nRow).html(progressbar.getDom());
                progressbar.opProgress($.encoder.encodeForHTML(aData.cpuUsageRate));

                //内存使用率进度条
                var options = {
                    "width": "70",
                    "height": "9",
                    "label-position": "right"
                };
                var progressbar = new Progressbar(options);
                $('td:eq(4)', nRow).html(progressbar.getDom());
                progressbar.opProgress($.encoder.encodeForHTML(aData.memUsageRate));

                //进度为小数点后2位
                var newValue = Math.round(aData.memorySizeGB * 100) / 100;
                $("td:eq(7)", nRow).html(newValue);

                var optScope = $scope.$new();
                //主机在运行中时，安全上电按钮需要灰化
                //主机在下电中时，安全下电按钮需要灰化
                optScope.disableSafeStart = false;
                optScope.disableSafeStop = false;
                if (aData.runtimeState === "normal") {
                    optScope.disableSafeStart = true;
                }
                if (aData.runtimeState === "poweroff") {
                    optScope.disableSafeStop = true;
                }

                if (!$scope.hasHostManageOperateRight) {
                    return;
                }
                // 操作列
                var subMenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#" style="position: static">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                if($scope.hyperType !== "VMware"){
                    if(optScope.disableSafeStart){
                        subMenus +='<li class="disabled"><a tabindex="-1">' + $scope.i18n.common_term_on_button + '</a></li>';
                    }
                    else{
                        subMenus += '<li><a tabindex="-1" ng-click="safestart()">' + $scope.i18n.common_term_on_button + '</a></li>';
                    }
                }
                subMenus +=  '<li><a tabindex="-1" ng-click="safestop()" ng-if="!disableSafeStop">' + $scope.i18n.common_term_safeDown_button + '</a>' +
                    '<p class="link_disable fl" style="margin-left: 20px" ng-if="disableSafeStop">' + $scope.i18n.common_term_safeDown_button + '</p>' + '</li>';

                if (aData.maintenanceStatus) {
                    subMenus += '<li><a tabindex="3" ng-click="quitMaintain()" disable="outAble">' + $scope.i18n.device_term_quitMaintenance_button + '</a></li>';
                } else {
                    subMenus += '<li><a tabindex="3" ng-click="maintain()" disable="inAble">' + $scope.i18n.common_term_turnMaintenance_button + '</a></li>';
                }
                if ($scope.hyperType !== "VMware") {
                    subMenus += '<li><a tabindex="3" ng-click="antiVirus()">' + $scope.i18n.device_term_setAntivirus_button + '</a></li>';
                }
                subMenus += '<li><a tabindex="3" ng-click="queryVMNum()">' + $scope.i18n.common_term_query_button + $scope.i18n.vm_term_vmStatus_label + '</a></li>';
                subMenus += '</ul>' + '</span>';
                var optColumn = "<div><a href='javascript:void(0)' ng-click='safeRestart()' style='margin-right:10px; width:auto'>" +
                    $scope.i18n.common_term_safeRestart_button + "</a>" + subMenus + "</div>";

                var optLink = $compile($(optColumn));
                optScope.queryVMNum = function () {
                    var newWindow = new Window({
                        "winId": "queryVMNumWindow",
                        "title": $scope.i18n.common_term_query_button + $scope.i18n.vm_term_vmStatus_label,
                        "hostId": aData.id,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/host/queryVMNum.html",
                        "height": 200,
                        "width": 400,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                };
                optScope.safeRestart = function () {
                    var options = {
                        type: "warn",
                        content: $scope.i18n.common_safeRestart_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.opertorHost(aData.id, "reboot");
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
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.maintain = function () {
                    var newWindow = new Window({
                        "winId": "enableMaintenWindow",
                        "title": $scope.i18n.common_term_turnMaintenance_button,
                        "content-type": "url",
                        "buttons": null,
                        "hostId": aData.id,
                        "content": "app/business/resources/views/hypervisor/host/enableMainten.html",
                        "height": 250,
                        "width": 450,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                };
                optScope.quitMaintain = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.device_all_quitMaintenanceHost_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.opertorHost(aData.id, "disablemainten");
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
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.safestart = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.device_all_safeOn_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.opertorHost(aData.id, "safestart");
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
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.safestop = function () {
                    var options = {
                        type: "warn",
                        content: $scope.i18n.virtual_host_off_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.opertorHost(aData.id, "safestop");
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
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                optScope.antiVirus = function () {
                    antiVirus(aData.id);
                };
                var optNode = optLink(optScope);
                $("td[tdname='8']", nRow).html(optNode);
                optNode.find('.dropdown').dropdown();
            }
        };
        function antiVirus(hostId) {
            var newWindow = new Window({
                "winId": "antiVirusWindow",
                "title": $scope.i18n.device_term_setAntivirus_button,
                "hostId": hostId,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/host/antiVirus.html",
                "height": 220,
                "width": 400,
                "close": function () {
                }
            });
            newWindow.show();
        }

        $scope.operator = {
            "init": function () {
                var paramjson = {};
                if ($scope.curState === "resources.storeInfo.host") {
                    paramjson.datastoreId = resourceId;
                } else {
                    paramjson.clusterId = resourceId;
                }
                paramjson.offset = $scope.HostSearchModel.offset,
                    paramjson.limit = $scope.HostSearchModel.limit,
                    paramjson = JSON.stringify(paramjson);
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/hosts",
                    "params": paramjson,
                    "userId": user.id,
                    "timeout": 120000
                });
                deferred.done(function (data) {
                        $scope.$apply(function () {
                            var hosts = data && data.hosts || [];
                            for (var i = 0; i < data.hosts.length; i++) {
                                if (data.hosts[i].imcSetting === '' || data.hosts[i].imcSetting === null) {
                                    data.hosts[i].imcSetting = $scope.i18n.common_term_noTurnOn_value;
                                }
                                if (data.hosts[i].maxImcSetting === '' || data.hosts[i].maxImcSetting === null) {
                                    data.hosts[i].maxImcSetting = $scope.i18n.common_term_unknown_value;
                                }
                                data.hosts[i].detail = {
                                    contentType: "url",
                                    content: "app/business/resources/views/hypervisor/host/hostDetails/hostDetails.html"
                                };
                            }
                            $scope.hostTable.totalRecords = data && data.total || 0;
                            $scope.hostTable.data = data.hosts;
                        });
                    }
                );
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "opertorHost": function (hostId, opType) {
                var params = {};
                params.operType = opType;
                params = JSON.stringify(params);
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/hosts/{id}/action", o: {id: hostId}},
                    "params": params,
                    "userId": user.id
                });
                deferred.done(function (data) {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.task_view_task_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn: true,
                                handler: function (event) {
                                    msg.destroy();
                                    $state.go("system.taskCenter");
                                }
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                    $scope.operator.init();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();

                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        };
        function getHypervisor() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: hyperId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.hyperType = data.hypervisor.type;
                $scope.operator.init();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        if(hyperId){
            getHypervisor();
        }
        else{
            $scope.operator.init();
        }
    }];

    return hostCtrl;
});