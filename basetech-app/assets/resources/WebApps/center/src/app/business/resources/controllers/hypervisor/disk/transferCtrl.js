/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular, Radio,Message, validatorService, UnifyValid, httpService, Exception) {
    "use strict";
    var transferDiskCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        var window = $("#transferDiskWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var selectedDisks = window.option("selectedDisks");
        var maxUserId = 4294967296;
        //VPC列表
        var vpcInfo = {
            "start": 0,
            "limit": 10
        };
        $scope.vpcTable = {
            "id": "selectVpcTable",
            "data": null,
            "require": true,
            "name": "VPC:",
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "columnsDraggable":true,
            "lengthMenu": [10, 20, 50],
            "displayLength": 10,
            "columns": [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "VPC ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vpcID);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_type_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.type);
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
            "callback": function (evtObj) {
                vpcInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                getVpc();
            },
            "changeSelect": function (pageInfo) {
                vpcInfo.start = 0;
                $scope.vpcTable.curPage = {
                    "pageIndex": 1
                };
                vpcInfo.limit = pageInfo.displayLength;
                $scope.vpcTable.displayLength = pageInfo.displayLength;
                getVpc();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                //单选框
                var options = {
                    "id": "vpcRadio_" + iDataIndex,
                    "checked": aData.checked,
                    "disable": false,
                    "change": function () {
                        var index = 0;
                        while ($("#vpcRadio_" + index).widget()) {
                            if (index !== iDataIndex) {
                                $("#vpcRadio_" + index).widget().option("checked", false);
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
            "id": "transferDiskOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var data = $scope.vpcTable.data;
                var selectedVpc;
                var index = 0;
                while ($("#vpcRadio_" + index).widget()) {
                    var checked = $("#vpcRadio_" + index).widget().option("checked");
                    if (checked) {
                        selectedVpc = data[index].vpcID;
                        break;
                    }
                    index++;
                }
                if (selectedVpc) {
                    transfer(selectedVpc);
                }
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "transferDiskCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function getVpc() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/irm/{vdcId}/vpcs?start={start}&limit={limit}&authenticated={authenticated}&shared=false",
                    o: {vdcId:1,start: vpcInfo.start, limit: vpcInfo.limit,authenticated:true}
                },
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vpcs = data && data.vpcs || [];
                for (var i = 0; i < vpcs.length; i++) {
                    vpcs[i].type = vpcs[i].shared ? $scope.i18n.common_term_share_label : $scope.i18n.common_term_common_label;
                }
                $scope.$apply(function () {
                    $scope.vpcTable.totalRecords = data.total;
                    $scope.vpcTable.data = vpcs;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function transfer(selectedVpc) {
            var params = {
                "transfer":{
                    "volumeIds": selectedDisks,
                    "vpcId": selectedVpc
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                "params": JSON.stringify(params),
                "userId": user.id,
				"timeout": 600000
            });
            deferred.success(function (data) {
                window.destroy();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getVpc();
    }];

    var transferDiskModule = angular.module("resources.disk.transferDisk", ["ng"]);
    transferDiskModule.service("validator", validatorService);
    transferDiskModule.service("camel", httpService);
    transferDiskModule.controller("resources.disk.transferDisk.ctrl", transferDiskCtrl);
    return transferDiskModule;
});