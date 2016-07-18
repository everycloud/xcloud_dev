/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService"],
    function ($, angular, Window, Message, bootstrap, Exception) {
        "use strict";

        var ctrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege["role_role_add_option_diskHandle_value.610000"];
            $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
            var statusKey = {
                "CREATING": $scope.i18n.common_term_creating_value,
                "USE": $scope.i18n.common_term_available_label,
                "RESTORING": $scope.i18n.common_term_resuming_value,
                "RESIZING": $scope.i18n.common_term_expanding_value,
                "MIGRATING": $scope.i18n.common_term_migrating_value,
                "SNAPSHOTING": $scope.i18n.common_term_snaping_value,
                "SHRINKING": $scope.i18n.common_term_reclaimingStor_value,
                "DELETING": $scope.i18n.common_term_deleting_value,
                "COPYING": $scope.i18n.common_term_copying_value,
                "LOSE":$scope.i18n.common_term_lose_value
            };

            var typeKey = {
                "normal": $scope.i18n.common_term_common_label,
                "share": $scope.i18n.common_term_share_label
            };
            //导出按钮
            $scope.exportButton = {
                "id": "exportDiskButton",
                "text": $scope.i18n.common_term_export_button,
                "click": function () {
                    if ($("#" + $scope.searchBox.id).widget()) {
                        searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
                    }
                    var newWindow = new Window({
                        "winId": "exportDiskListWindow",
                        "title": $scope.i18n.common_term_exportList_button,
                        "name":searchInfo.name,
                        "total":$scope.diskTable.totalRecords,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/disk/exportDiskList.html",
                        "height": 220,
                        "width": 510,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                }
            };
            $scope.help = {
                show: false
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10,
                "name": null
            };
            //模糊搜索框
            $scope.searchBox = {
                "id": "searchDiskBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.start = 0;
                    $scope.diskTable.curPage = {
                        "pageIndex": 1
                    };
                    getDisk();
                }
            };
            $scope.refresh = function () {
                getDisk();
            };
            //磁盘列表
            $scope.diskTable = {
                "id": "storeInfoDiskTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnsDraggable": true,
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
                "columns": [
                    {
                        "sTitle": "",
                        "mData": "",
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
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.typeStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_usedCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usedGB);
                        },
                        "bSortable": false,
                        "sWidth": "100px"
                    }
                ],
                "callback": function (pageInfo) {
                    searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getDisk();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.diskTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.diskTable.displayLength = pageInfo.displayLength;
                    getDisk();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("volumnUrn", $.encoder.encodeForHTML("" + aData.volumnId));
                    $(nRow).attr("diskType", $.encoder.encodeForHTML("" + aData.type));
                    $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                    $(nRow).attr("allocType", $.encoder.encodeForHTML("" + aData.allocType));
                    $(nRow).attr("indepDisk", $.encoder.encodeForHTML("" + aData.indepDisk));
                    $(nRow).attr("persistentDisk", $.encoder.encodeForHTML("" + aData.persistentDisk));
                    $(nRow).attr("mediaType", $.encoder.encodeForHTML("" + aData.mediaType));
                    $(nRow).attr("dataStore", $.encoder.encodeForHTML("" + aData.dataStoreName));
                    $(nRow).attr("vm", $.encoder.encodeForHTML("" + aData.vm));
                    $(nRow).attr("volumnId", $.encoder.encodeForHTML("" + aData.volumnId));

                    $('td:eq(0)', nRow).html("");
                    $("td:eq(1)", nRow).addTitle();
                    // 操作列
                    var subMenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                    if (aData.type === "normal" && aData.volVmInfos && aData.volVmInfos.length > 0) {
                        subMenus += '<li><a tabindex="1" ng-click="configSize()">' + $scope.i18n.common_term_expanding_button + '</a></li>';
                    }
                    else {
                        subMenus += '<li class="disabled"><a tabindex="1">' + $scope.i18n.common_term_expanding_button + '</a></li>';
                    }
                    if (aData.type === "normal" && aData.hypervisorType !== "vmware" && aData.volVmInfos && aData.volVmInfos.length > 0) {
                        subMenus += '<li><a tabindex="2" ng-click="setLimit()">' + $scope.i18n.common_term_setIOmax_button + '</a></li>';
                    }
                    else {
                        subMenus += '<li class="disabled"><a tabindex="2">' + $scope.i18n.common_term_setIOmax_button + '</a></li>';
                    }
                    subMenus += '</ul>' + '</span>';
                    var optColumn = "";
                    if(aData.hypervisorType !== "vmware"){
                        optColumn = "<div><a href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button + "</a>";
                    }
                    else{
                        optColumn = "<div><span class='disabled'>"+$scope.i18n.common_term_modify_button + "</span>";
                    }
                    optColumn += "&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
                    var optLink = $compile($(optColumn));

                    var optScope = $scope.$new();
                    var winParams = {
                        "diskName": aData.name,
                        "volumnId": aData.volumnId
                    };
                    optScope.edit = function () {
                        winParams.persistentDisk = aData.persistentDisk;
                        winParams.influence = aData.indepDisk;
                        winParams.allocType = aData.allocType;
                        winParams.datastoreId = aData.datastoreId;
                        getStorageType(winParams);
                    };
                    optScope.setLimit = function () {
                        //TODO 停止，运行，休眠可调整
                        winParams.vmId = aData.volVmInfos[0].vmID;
                        var newWindow = new Window({
                            "winId": "setDiskLimitWindow",
                            "title": $scope.i18n.common_term_setIOmax_button,
                            "content-type": "url",
                            "WIN_PARAMS": winParams,
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/disk/setDiskLimit.html",
                            "height": 350,
                            "width": 720,
                            "close": function () {
                                getDisk();
                            }
                        });
                        newWindow.show();
                    };
                    optScope.configSize = function () {
                        winParams.quantityGB = aData.capacityGB;
                        winParams.vmId = aData.volVmInfos[0].vmID;
                        var newWindow = new Window({
                            "winId": "configDiskSizeWindow",
                            "title": $scope.i18n.common_term_expanding_button,
                            "content-type": "url",
                            "WIN_PARAMS": winParams,
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/disk/configDiskSize.html",
                            "height": 250,
                            "width": 500,
                            "close": function () {
                                getDisk();
                            }
                        });
                        newWindow.show();
                    };

                    var optNode = optLink(optScope);
                    $("td:eq(6)", nRow).html(optNode);
                    optNode.find('.dropdown').dropdown();
                }
            };
            function getStorageType(winParams)
            {
                var datastoreId = winParams.datastoreId;
                var params = {
                    "detail": "0",
                    "scopeType": "DATASTORE",
                    "scopeObjectId": datastoreId
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if(data && data.datastoreInfos)
                    {
                        var storageType = data.datastoreInfos[0].type;
                        winParams.storageType = storageType;
                    }
                    var newWindow = new Window({
                        "winId": "editDiskWindow",
                        "title": $scope.i18n.common_term_modify_button,
                        "content-type": "url",
                        "WIN_PARAMS": winParams,
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/disk/editDisk.html",
                        "height": 300,
                        "width": 750,
                        "close": function () {
                            getDisk();
                        }
                    });
                    newWindow.show();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getDisk() {
                if ($("#" + $scope.searchBox.id).widget()) {
                    searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
                }
                var params = {
                    "list": {
                        "source": "MANAGER",
                        "offset": searchInfo.start,
                        "limit": searchInfo.limit
                    }
                };
                if (searchInfo.name) {
                    params.list.searchCondition = {
                        "ALL": searchInfo.name
                    };
                }
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disks = data && data.list && data.list.volumes || [];
                    for (var i = 0; i < disks.length; i++) {
                        disks[i].detail = {
                            "contentType": "url",
                            "content": "app/business/resources/views/hypervisor/disk/vmToDisk.html"
                        };
                        disks[i].vm = "";
                        if (disks[i].volVmInfos) {
                            for (var j = 0; j < disks[i].volVmInfos.length; j++) {
                                disks[i].vm = disks[i].vm === "" ? disks[i].volVmInfos[j].vmName : disks[i].vm + ";" + disks[i].volVmInfos[j].vmName;
                            }
                        }
                        disks[i].statusStr = statusKey[disks[i].status] || disks[i].status;
                        disks[i].typeStr = typeKey[disks[i].type] || disks[i].type;
                    }
                    $scope.$apply(function () {
                        $scope.diskTable.totalRecords = data.list.total;
                        $scope.diskTable.data = disks;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if ($scope.operable) {
                $scope.diskTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "160px"
                    });
            }
            getDisk();
        }];

        return ctrl;
    });