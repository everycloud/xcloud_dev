/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular, Radio, Message, httpService, exceptionService) {
    "use strict";
    var migrateVmCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionSer = new exceptionService();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#migrateVmWindow").widget();
            var serverId = window.option("serverId");
            var hostId = window.option("hostId");
            var novaId = window.option("novaId");
            var projectId = window.option("projectId");
            var tokenId = window.option("tokenId");
            var blockMigration = window.option("blockMigration");
            var states = {
                up: $scope.i18n.common_term_running_value,
                down: $scope.i18n.common_term_stoped_value
            };
            var searchInfo = {
                "curPage": 1,
                "limit": 10
            };

            $scope.tableData = [];
            var tableDatalength;


            var queryServerInfo = function(hostListTemp){
                var deferredQueryID = camel.post({
                    "url":"/goku/rest/v1.5/irm/servers/openstack/hostinfo",
                    params: JSON.stringify({
                        "hostVrmIdList": hostListTemp
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
                        $scope.hostTable.data = $scope.tableData;
                    });
                });
                deferredQueryID.fail(function(response){
                    $scope.$apply(function () {
                        $scope.hostTable.data = $scope.tableData;
                    });
                    exceptionService.doException(response);
                });
            }

            $scope.hostTable = {
                "id": "migrateVmTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "showDetails": {
                    "colIndex": 1,
                    "domPendType":"append"
                },
                "lengthChange": true,
                "enablePagination": true,
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 50],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": 30
                    },
                    {
                        "sTitle": "",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": 30
                    },
                    {
                        "sTitle": $scope.i18n.common_term_hostName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.host);
                        },
                        "bSortable": false,
                        "sWidth": 100
                    },
                    {
                        "sTitle": $scope.i18n.device_term_deviceName_label || "设备名称",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.serverName);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.device_term_cabinets_label || "机柜",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.rackNo);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.device_term_subrack_label || "机框",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subRackNo);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":$scope.i18n.device_term_slotID_label || "槽位",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.slotNo);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.zone);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.stateStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_manage_label + "IP" || "管理IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osIp);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    cleanSelect();
                    searchInfo.curPage = evtObj.currentPage;
                    searchInfo.limit = evtObj.displayLength;
                },
                "changeSelect": function (pageInfo) {
                    cleanSelect();
                    searchInfo.curPage = pageInfo.currentPage;
                    searchInfo.limit = pageInfo.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                    $(nRow).attr("hostId", $.encoder.encodeForHTML("" + aData.host));
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    $("td:eq(8)", nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "hostRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = searchInfo.limit * (searchInfo.curPage - 1);
                            while ($("#hostRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#hostRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //确定按钮
            $scope.okButton = {
                "id": "migrateVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.hostTable.data;
                    var index = searchInfo.limit * (searchInfo.curPage - 1);
                    var selectedHost = null;
                    while ($("#hostRadio_" + index).widget()) {
                        var checked = $("#hostRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedHost = data[index].host;
                            break;
                        }
                        index++;
                    }
                    if (selectedHost) {
                        migrateVm(selectedHost);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "migrateVmCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function cleanSelect() {
                var index = searchInfo.limit * (searchInfo.curPage - 1);
                while ($("#hostRadio_" + index).widget()) {
                    $("#hostRadio_" + index).widget().option("checked", false);
                    index++;
                }
            }

            function getHosts() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-services",
                        o: {"novaId": novaId, "projectId": projectId}
                    },
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    var services = data && data.services || [];
                    var hosts = [];
                    var hostsName = [];
                    for (var index in services) {
                        var service = services[index];
                        if (!service || service.zone === "internal" || service.host === hostId) {
                            continue;
                        }
                        service.detail = {
                            contentType: "url",
                            content: "app/business/resources/views/openStackResource/server/hostDetail.html"
                        };
                        service.stateStr = states[service.state] || service.state;
                        hosts.push(service);
                        tableDatalength = hosts.length;
                        hostsName.push(service.host);
                    }

                    $scope.tableData = [];
                    for(var i=0; i<tableDatalength; i++){
                        $scope.tableData.push({"host":hostsName[i]});
                        $scope.tableData[i].detail = hosts[i].detail;
                        $scope.tableData[i].zone = hosts[i].zone;
                        $scope.tableData[i].stateStr = hosts[i].stateStr;


                    }
                    queryServerInfo(hostsName);

                    $scope.hostTable.totalRecords = hosts.length;

                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            function migrateVm(hostId) {
                var params = {
                    "os-migrateLive": {
                        host: hostId,
                        block_migration: blockMigration,
                        disk_over_commit: true
                    }
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                        o: {novaId: novaId, projectId: projectId, serverId: serverId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            getHosts();
        }];

    var migrateVmModule = angular.module("vdcMgr.server.migrateVm", ["ng"]);
    migrateVmModule.service("camel", httpService);
    migrateVmModule.controller("vdcMgr.server.migrateVm.ctrl", migrateVmCtrl);
    return migrateVmModule;
});