define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/services/validatorService",
    "app/services/exceptionService",
    "fixtures/dataCenterFixture"
], function ($, angular, httpService, validatorService, ExceptionService) {
    "use strict";

    var aggregateDetailCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var user = $("html").scope().user;
        var exceptionService = new ExceptionService();

        var window = $("#aggregateDetailWindow").widget();
        $scope.serviceID = window.option("serviceId");
        $scope.region = window.option("region");
        $scope.aggregateId = window.option("aggregateId");
        $scope.projectId = undefined;
        $scope.token = undefined;

        $scope.hostList = [];
        var searchInfo = {
            "curPage": 1,
            "limit": 10
        };


        $scope.tableData = [];



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
               for(var i=0; i<$scope.hostList.length; i++){
                   var adata = $scope.tableData[i];
                   var hostId = adata.hostName;
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
                $("#"+$scope.hostTable.id).widget().option("data", $scope.tableData);
            });
            deferredQueryID.fail(function(response){
                $("#"+$scope.hostTable.id).widget().option("data", $scope.tableData);
                exceptionService.doException(response);
            });
        }

        $scope.hostTable = {
            "id": "aggregateDetailTable",
            "caption": "",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "displayLength": 10,
            "totalRecords": 0,
            "enableFilter": false,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_hostName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hostName);
                    },
                    "bSortable": false,
                    "sWidth": 100
                },
                {
                    "sTitle":  $scope.i18n.device_term_deviceName_label || "设备名称",
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
                    "sTitle": $scope.i18n.common_term_manage_label + "IP" || "管理IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osIp);
                    },
                    "bSortable": false,
                    "sWidth": 100
                }
            ],
            "callback": function (evtObj) {

                searchInfo.curPage = evtObj.currentPage;
                searchInfo.limit = evtObj.displayLength;
            },
            "changeSelect": function (pageInfo) {

                searchInfo.curPage = pageInfo.currentPage;
                searchInfo.limit = pageInfo.displayLength;
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                $("td:eq(3)", nRow).addTitle();
                $("td:eq(4)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();


            }
        };

        $scope.closeBtn = {
            "id": "closeBtnId",
            "text": $scope.i18n.common_term_close_button || "关闭",
            "click": function () {
                window.destroy();
            }
        };
        $scope.operator = {
            "queryAggregate": function () {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/os-aggregates/{aggregate_id}",
                        o: {"redirect_address_id": $scope.serviceID, "tenant_id": $scope.projectId,"aggregate_id":$scope.aggregateId}},
                    "userId": user.id,
                    "token": $scope.token
                });
                deferred.done(function (data) {

                    if (data && data.aggregate) {
                        $scope.hostList = data.aggregate.hosts;
                        var hostsName = $scope.hostList;

                        $scope.tableData = [];
                        for(var i=0; i<hostsName.length; i++){
                            $scope.tableData.push({"hostName":hostsName[i]});
                        }
                        queryServerInfo(hostsName);
                    }

                    $("#"+$scope.hostTable.id).widget().option("total-records", hostsName.length);

                    $scope.$digest();


                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            },
            "init": function () {
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
                    $scope.operator.queryAggregate();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        }
        //获取初始主机列表
        $scope.operator.init();
    }];

    var app = angular.module("resources.regionResources.aggregateDetail", ['framework']);
    app.service("camel", httpService);
    app.service("validator", validatorService);
    app.controller("resources.regionResources.aggregateDetail.ctrl", aggregateDetailCtrl);
    return app;
});