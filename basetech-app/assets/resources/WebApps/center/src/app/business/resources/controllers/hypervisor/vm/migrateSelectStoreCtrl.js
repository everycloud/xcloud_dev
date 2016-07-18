/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    'app/business/resources/controllers/constants',
    "app/services/httpService",
    "app/business/resources/controllers/migrateCommon",
    'tiny-widgets/Message',
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Radio, constants, httpService, migrateCommon,Message,Exception) {
    "use strict";
    var selectStoreCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var exceptionService = new Exception();
            var window = $("#selectStoreWindow").widget();
            var clusterId = window.option("clusterId");
            var diskId = window.option("diskId");
            var winData = window.option("data");

            $scope.storeTableWin = {
                "id": "targetStoreTable_win",
                "data": [],
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "draggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
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
                        "sTitle": $scope.i18n.common_term_storageUnit_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageunitname);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageMedia_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mediaType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.accessible);
                        },
                        "sWidth": '80px',
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.freeCapacityGB);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (pageInfo) {
                    $scope.datastoreSearchModelWin.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getStores();
                },
                "changeSelect": function (pageInfo) {
                    $scope.datastoreSearchModelWin.offset = 0;
                    $scope.storeTableWin.curPage = {
                        "pageIndex": 1
                    };
                    $scope.datastoreSearchModelWin.limit = pageInfo.displayLength;
                    $scope.storeTableWin.displayLength = pageInfo.displayLength;
                    getStores();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();

                    if (aData.type) {
                        var type = aData.type.toUpperCase();
                        var aa = migrateCommon.DATASTORE_TYPE[type] || type;
                        $('td:eq(2)', nRow).html(migrateCommon.DATASTORE_TYPE[type] || type);
                    }
                    var dsStatus = (aData.accessible) ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                    $('td:eq(5)', nRow).html(dsStatus);

                    //单选框
                    var options = {
                        "id": "targetstoreRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#targetstoreRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#targetstoreRadio_" + index).widget().option("checked", false);
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
                "id": "selectStoreOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    canMigrate();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "selectStoreCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            $scope.datastoreSearchModelWin = {
                "offset": 0,
                "limit": 10
            };
            //获取目标存储
            function getTargetDS() {
                var data = $scope.storeTableWin.data;
                var index = 0;
                while ($("#targetstoreRadio_" + index).widget()) {
                    var checked = $("#targetstoreRadio_" + index).widget().option("checked");
                    if (checked) {
                        return data[index];
                    }
                    index++;
                }
                return null;
            }
            function canMigrate() {
                var ds = getTargetDS();
                var volumes = [{
                    volumeId:diskId,
                    dstDs:ds.rid
                }];
                var params = {
                    "canMigrate":{
                        "migrateType":"0",
                        "migrationModel":window.option("migrationModel"),
                        "volumes":volumes
                    }
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/volumes/action",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var volumes = data && data.canMigrate && data.canMigrate.volumes || [];
                    var volume = volumes.length > 0?volumes[0]:{};
                    if(volumes.length>0 && !volume.result){
                            var response = {
                                responseText:JSON.stringify({"code": volume.errCode, "message": volume.errMessage})
                            };
                            exceptionService.doException(response);
                            return;
                    }
                    var ds = getTargetDS();
                    winData.datastoreId = ds.id;
                    winData.datastoreName = ds.name;
                    winData.type = ds.type;
                    winData.targetMode = [];
                    if(volume.normalVolume){
                        winData.targetMode.push("thick");
                    }
                    if(volume.thinVolume){
                        winData.targetMode.push("thin");
                    }
                    if(volume.delayVolue){
                        winData.targetMode.push("thickformat");
                    }
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            //获取目的存储
            function getStores() {
                var params = {
                    "detail": 0,
                    "migrateOption": true,
                    "scopeType": "CLUSTER",
                    "scopeObjectId": clusterId,
                    "limit": $scope.datastoreSearchModelWin.limit,
                    "offset": $scope.datastoreSearchModelWin.offset
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/datastores",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var volList = data && data.datastoreInfos || [];
                    for (var i = 0; i < volList.length; i++) {
                        volList[i].mediaType = volList[i].mediaType === "SAN-Any" ? "Any" : volList[i].mediaType;
                        if (volList[i].capacity) {
                            volList[i].totalCapacityGB = volList[i].capacity.totalCapacityGB;
                            volList[i].freeCapacityGB = volList[i].capacity.freeCapacityGB;
                        }
                    }
                    $scope.$apply(function () {
                        $scope.storeTableWin.totalRecords = data.total || 0;
                        $scope.storeTableWin.data = volList;
                    });
                });
                deferred.fail(function (data) {
                });
            }

            getStores();
        }];

    var selectStoreModule = angular.module("resources.vm.migrateSelectStore", ["ng"]);
    selectStoreModule.service("camel", httpService);
    selectStoreModule.controller("resources.vm.migrateSelectStore.ctrl", selectStoreCtrl);
    return selectStoreModule;
});