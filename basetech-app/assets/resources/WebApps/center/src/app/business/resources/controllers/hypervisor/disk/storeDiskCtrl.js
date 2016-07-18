/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Checkbox",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService",
    "app/services/competitionConfig"
], function ($, angular, Progressbar, Window, Message, Checkbox, bootstrap, Exception, competition) {
    "use strict";

    var diskCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege["role_role_add_option_diskHandle_value.610000"];
        var storeId = $stateParams.storeId;

        $scope.help = {
            show: false
        };
        var statuses = {
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
        var types = {
            "normal": $scope.i18n.common_term_common_label,
            "share": $scope.i18n.common_term_share_label
        };
        var attachStatuses = {
            "2": $scope.i18n.common_term_noBond_value,
            "3": $scope.i18n.common_term_bonded_value
        };
        var selectedDisks = [];
        var selectedDisksData = [];

        //查询信息
        var searchInfo = {
            "start": 0,
            "limit": 10,
            "name": "",
            attachstatus: ""
        };
        //绑定状态过滤框
        $scope.bindSelector = {
            "id": "bindStatusSelector",
            "width": "135",
            "values": [
                {
                    "selectId": "0",
                    "label": $scope.i18n.common_term_allBondStatus_label,
                    "checked": true
                },
                {
                    "selectId": "2",
                    "label": $scope.i18n.common_term_noBond_value
                },
                {
                    "selectId": "3",
                    "label": $scope.i18n.common_term_bonded_value
                }
            ],
            "change": function () {
                searchInfo.attachstatus = $("#" + $scope.bindSelector.id).widget().getSelectedId();
                searchInfo.start = 0;
                $scope.diskTable.curPage = {
                    "pageIndex": 1
                };
                getDisk();
            }
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
        //创建按钮
        $scope.createButton = {
            "id": "createDiskButton",
            "text": $scope.i18n.common_term_create_button,
            "click": function () {
                var newWindow = new Window({
                    "winId": "createDiskWindow",
                    "storeId": storeId,
                    "title": $scope.i18n.org_term_createDisk_button,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/disk/createDisk.html",
                    "height": $scope.i18n.locale === "zh" ? 450 : 480,
                    "width": $scope.i18n.locale === "zh" ? 650 : 900,
                    "close": function () {
                        if ($state.current.name === "resources.storeInfo.storeDisk") {
                            getDisk();
                        }
                    }
                });
                newWindow.show();
            }
        };
        //安全删除按钮
        $scope.deleteButton = {
            "id": "deleteDiskButton",
            "text": $scope.i18n.common_term_safeDel_button,
            "click": function () {
                getSelectedDisks();
                if (selectedDisks.length <= 0) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_term_chooseDiskBeforeOpt_msg,
                        height: "150px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                deleteWindow();
            }
        };
        //过户
        $scope.transferButton = {
            "id": "transferDiskButton",
            "text": $scope.i18n.common_term_allocate_button,
            "click": function () {
                getSelectedDisks();
                if (selectedDisks.length <= 0) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.vm_term_chooseDiskBeforeOpt_msg,
                        height: "150px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                var boundDisk = null;
                for (var i = 0; i < selectedDisksData.length; i++) {
                    if (selectedDisksData[i].attachstatus === "3") {
                        boundDisk = boundDisk ? boundDisk + " , " + selectedDisksData[i].name : selectedDisksData[i].name;
                    }
                }
                if (boundDisk) {
                    var options = {
                        type: "error",
                        content: $scope.i18n.sprintf($scope.i18n.vm_disk_transfer_info_bondVM_msg, boundDisk),
                        height: "150px",
                        width: "350px"
                    };
                    var msg = new Message(options);
                    msg.show();
                    return;
                }
                transferWindow();
            }
        };

        //磁盘列表
        $scope.diskTable = {
            "id": "storeInfoDiskTable",
            "data": null,
            "showDetails": {
                "colIndex": 1,
                "domPendType": "append"
            },
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false,
                    "sWidth": 40
                },
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
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_bondStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.attachStatusStr);
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
                searchInfo.curPage = pageInfo.currentPage;
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
                $(nRow).attr("volumnId", $.encoder.encodeForHTML("" + aData.volumnId));

                //复选框
                var options = {
                    "id": "diskCheckbox_" + iDataIndex,
                    "checked": false,
                    "change": function () {

                    }
                };
                var checkbox = new Checkbox(options);
                $('td:eq(0)', nRow).html(checkbox.getDom());

                $('td:eq(1)', nRow).html("");
                $("td:eq(2)", nRow).addTitle();

                // 操作列
                var subMenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a tabindex="1" ng-click="delete()">' + $scope.i18n.common_term_commonSDel_button + '</a></li>' +
                    '<li><a tabindex="2" ng-click="safeDelete()">' + $scope.i18n.common_term_safeDel_button + '</a></li>';
                subMenus += '</ul>' + '</span>';
                var optColumn = "";
                if ("3" === aData.attachstatus && "share" !== aData.type) {
                    optColumn = "<div><a href='javascript:void(0)' class='disabled'>" + $scope.i18n.org_term_bondVM_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
                }
                else {
                    optColumn = "<div><a href='javascript:void(0)' ng-click='bindVm()'>" + $scope.i18n.org_term_bondVM_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
                }
                var optLink = $compile($(optColumn));

                var optScope = $scope.$new();
                optScope.bindVm = function () {
                    bindWindow(aData.volumnId);
                };
                optScope.delete = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.vm_vm_commonDelDisk_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn : true,
                                handler: function (event) {
                                    var disks = [aData.volumnId];
                                    deleteDisk(false, disks);
                                    msg.destroy();
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
                optScope.safeDelete = function () {
                    var options = {
                        type: "confirm",
                        content: $scope.i18n.vm_vm_safeDelDisk_info_confirm_msg,
                        height: "150px",
                        width: "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                default: true,
                                majorBtn : true,
                                handler: function (event) {
                                    var disks = [aData.volumnId];
                                    deleteDisk(true, disks);
                                    msg.destroy();
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

                var optNode = optLink(optScope);
                $("td:eq(8)", nRow).html(optNode);
                optNode.find('.dropdown').dropdown();
            }
        };
        function deleteWindow() {
            var options = {
                type: "confirm",
                content: $scope.i18n.vm_vm_safeDelDisk_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            deleteDisk(true, selectedDisks);
                            msg.destroy();
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
        }

        function transferWindow() {
            var newWindow = new Window({
                "winId": "transferDiskWindow",
                "title": $scope.i18n.common_term_allocate_button,
                "selectedDisks": selectedDisks,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/disk/transfer.html",
                "height": 500,
                "width": 700,
                "close": function () {
                    getDisk();
                }
            });
            newWindow.show();
        }

        function bindWindow(volumnId, diskType) {
            var newWindow = new Window({
                "winId": "bindVmWindow",
                "title": $scope.i18n.org_term_bondVM_button,
                "content-type": "url",
                "volumnId": volumnId,
                "diskType": diskType,
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/disk/bindVm.html",
                "height": 500,
                "width": 800,
                "close": function () {
                    getDisk();
                }
            });
            newWindow.show();
        }

        function taskMessage(action) {
            var options = {
                type: "confirm",
                content: action + $scope.i18n.task_view_task_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            $state.go("system.taskCenter");
                            msg.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            getDisk();
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function getSelectedDisks() {
            selectedDisks = [];
            selectedDisksData = [];
            var index = 0;
            var data = $("#" + $scope.diskTable.id).widget().options.data;
            while ($("#diskCheckbox_" + index).widget()) {
                var checked = $("#diskCheckbox_" + index).widget().option("checked");
                if (checked) {
                    selectedDisks.push(data[index].volumnId);
                    selectedDisksData.push(data[index]);
                }
                index++;
            }
        }

        function getDisk() {
            if ($("#" + $scope.searchBox.id).widget()) {
                searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
            }
            var params = {
                "list": {
                    "source": "MANAGER",
                    "offset": searchInfo.start,
                    "limit": searchInfo.limit,
                    "datastoreId": storeId,
                    "name": searchInfo.name,
                    attachstatus: searchInfo.attachstatus
                }
            };
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
                    disks[i].status = statuses[disks[i].status] || disks[i].status;
                    disks[i].typeStr = types[disks[i].type] || disks[i].type;
                    disks[i].attachStatusStr = attachStatuses[disks[i].attachstatus] || disks[i].attachstatus;
                }
                $scope.$apply(function () {
                    $scope.diskTable.totalRecords = data.list.total;
                    $scope.diskTable.data = disks;
                });
                if ($scope.storeType === "LUN" && $scope.diskTable.data && $scope.diskTable.data.length > 0) {
                    $("#" + $scope.createButton.id).widget().option("disable", true);
                }
                var tableId = "#storeInfoDiskTable";
                if ($("#diskTableHeadCheckbox").widget()) {
                    $("#diskTableHeadCheckbox").widget().option("checked", false);
                }
                else {
                    //表头全选复选框
                    var options = {
                        "id": "diskTableHeadCheckbox",
                        "checked": false,
                        "change": function () {
                            var isChecked = $("#" + options.id).widget().options.checked;
                            var index = 0;
                            while ($("#diskCheckbox_" + index).widget()) {
                                $("#diskCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $(tableId + " th:eq(0)").html(checkbox.getDom());
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getStore() {
            var params = {
                "detail": "0",
                "scopeType": "DATASTORE",
                "scopeObjectId": storeId
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var store = data.datastoreInfos && data.datastoreInfos[0] || {};
                $scope.storeType = store.type;
                $scope.ioSwitch = store.ioSwitch;
                $scope.datastoreId = store.id;
                $scope.clusterIds = [];
                $scope.clusters = store.attachedClusters || [];
                for (var i = 0; i < $scope.clusters.length; i++) {
                    $scope.clusterIds.push($scope.clusters[i].clusterId);
                }
                if (store.maintenancemode) {
                    $("#" + $scope.createButton.id).widget().option("disable", true);
                }
                getDisk();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function deleteDisk(safeDelete, disks) {
            var params = {
                "delete": {
                    "volumnIds": disks,
                    "safeDelete": safeDelete
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                taskMessage($scope.i18n.common_term_delete_button);
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

        getStore();
    }];

    return diskCtrl;
});