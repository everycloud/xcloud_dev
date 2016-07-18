/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/competitionConfig",
    "app/services/exceptionService"
], function ($, angular, Window, Message, competition, Exception) {
    "use strict";

    var storageCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_storagePoolHandle_value;
        $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
        $scope.zoneInfo = {
            "zoneId": $stateParams.id,
            "zoneName": $stateParams.name
        };
        $scope.help = {
            show: false
        };
        var storeTypes = {
            "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
            "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
            "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
            "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
            "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
            "NAS": $scope.i18n.common_term_NAS_label
        };
        //添加按钮
        $scope.addButton = {
            "id": "addSecondaryButton",
            "text": $scope.i18n.common_term_add_button,
            "click": function () {
                var newWindow = new Window({
                    "winId": "addSecondaryWindow",
                    "title": $scope.i18n.common_term_add_button,
                    "zoneId": $scope.zoneInfo.zoneId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/rpool/zone/zoneResources/storage/secondaryStorage/addSecondary.html",
                    "height": 500,
                    "width": 900,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            }
        };
        //导出按钮
        $scope.exportButton = {
            "id": "secondaryExportButton",
            "text": $scope.i18n.common_term_export_button,
            "click": function () {
                exportStoreList();
            }
        };
        $scope.refresh = function () {
            getData();
        };
        //查询信息
        var searchInfo = {
            "start": 0,
            "limit": 10,
            "name": "",
            "type": null
        };
        //集群列表
        $scope.storageTable = {
            "id": "secondaryStorageTable",
            "data": null,
            showDetails: true,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "columnSorting": [],
            "columnsDraggable": true,
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
                        return $.encoder.encodeForHTML(data.type);
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
                    "sTitle": $scope.i18n.common_term_capacityTotalGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_allocatedCapacity_label + "(GB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.usedSizeGB);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
                searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                getData();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.storageTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.storageTable.displayLength = pageInfo.displayLength;
                getData();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("storageId", $.encoder.encodeForHTML("" + aData.id));

                if (aData.hypervisorType !== "vmware") {
                    //详情链接
                    var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>"));
                    var scope = $scope.$new(false);
                    scope.name = aData.name;
                    scope.detail = function () {
                        $state.go("resources.storeInfo.summary", {"storeId": aData.id, "storeName": scope.name,
                            "from": $state.current.name,"hyperId": aData.hypervisorId});
                    };
                    var node = link(scope);
                    $("td:eq(1)", nRow).html(node);
                }

                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();

                $("td:eq(2)", nRow).html(storeTypes[aData.type] || $.encoder.encodeForHTML(aData.type));
                $("td:eq(2)", nRow).attr("title", storeTypes[aData.type] || $.encoder.encodeForHTML(aData.type));

                // 操作列
                addOperatorDom(aData, nRow);
            }
        };

        function exportStoreList() {
            var locale = $scope.i18n.locale === "zh"?"zh_CN":"en_US";
            var params = {
                "exportDataStore": {
                    "category": "1",
                    "scopeType": "ZONE",
                    "scopeObjectId": $scope.zoneInfo.zoneId
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/reports/resource-reports/action?locale={locale}", o: {locale: locale}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data.exportFilePath) {
                    var reportUrl = "/goku/rest/v1.5/file/" + data.exportFilePath + "?type=export";
                    $("#downloadSecondaryStoreIframe").attr("src", $.encoder.encodeForHTML(reportUrl));
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function addOperatorDom(aData, nRow) {
            var subMenus = '<span class="dropdown" style="position: static">' +
                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
            if (aData.type !== 'LUN' && aData.hypervisorType !== "vmware") {
                subMenus += "<li><a href='javascript:void(0)' ng-click='migrate()'>" + $scope.i18n.vm_term_diskMigrate_button + "</a></li>";
            }

            if (competition.storageIoControl && (aData.type === 'LOCALPOME' || aData.type === 'LUNPOME' || aData.type === 'NAS')) {
                if (aData.ioSwitch == 0) {
                    subMenus += '<li><a href="javascript:void(0)" ng-click="openIoSwitch()">' + $scope.i18n.common_term_turnOnIOcontrol_button + '</a></li>';
                    subMenus += '<li class="disabled"><a href="javascript:void(0)">' + $scope.i18n.resource_term_shutIOcontrol_button + '</a></li>';
                }
                else {
                    subMenus += '<li class="disabled"><a href="javascript:void(0)">' + $scope.i18n.common_term_turnOnIOcontrol_button + '</a></li>';
                    subMenus += '<li><a href="javascript:void(0)" ng-click="closeIoSwitch()">' + $scope.i18n.resource_term_shutIOcontrol_button + '</a></li>';
                }
            }
            if (aData.ability.supportThreshold) {
                subMenus += '<li><a ng-click="setThreshold()">' + $scope.i18n.resource_term_setAllocationThreshold_button + '</a></li>';
            }
            subMenus = subMenus + '<li><a tabindex="2" ng-click="modifyMedia()">' + $scope.i18n.resource_term_modifyStorMedia_button + '</a></li>' +
                '<li class="divider-line"></li>' +
                '<li><a tabindex="4" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                '</ul>' +
                '</span>';

            var optColumn = "<div>";
            if (!aData.maintenancemode) {
                optColumn = '<a href="javascript:void(0)" ng-click="maintenance()">' + $scope.i18n.common_term_turnMaintenance_button + '</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    subMenus + "</div>";
            }
            else {
                optColumn = '<a href="javascript:void(0)" ng-click="quitMaintenance()">' + $scope.i18n.device_term_quitMaintenance_button + '</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    subMenus + "</div>";
            }

            var optLink = $compile($(optColumn));
            var optScope = $scope.$new();
            optScope.migrate = function () {
                $state.go("resources.migrateDisk", {"datastoreId": aData.id, "hypervisorId": aData.hypervisorId, "zoneId": $stateParams.id, "category": aData.type});
            };
            optScope.modifyMedia = function () {
                modifyWindow(aData);
            };
            optScope.delete = function () {
                showMessage($scope.i18n.resource_stor_del_info_confirm_msg, function () {
                    deleteSecondary(aData.id);
                });
            };
            optScope.maintenance = function () {
                showMessage($scope.i18n.device_all_turnMaintenanceStor_info_confirm_msg, function () {
                    maintenance(aData.id, true);
                });
            };
            optScope.quitMaintenance = function () {
                showMessage($scope.i18n.device_all_quitMaintenanceStor_info_confirm_msg, function () {
                    maintenance(aData.id, false);
                });
            };
            optScope.openIoSwitch = function () {
                showMessage($scope.i18n.vm_vm_enableStorIOcontrol_info_confirm_msg, function () {
                    setIoControl(aData.id, 1);
                });
            };
            optScope.closeIoSwitch = function () {
                showMessage($scope.i18n.vm_vm_disableStorIOcontrol_info_confirm_msg, function () {
                    setIoControl(aData.id, 0);
                });
            };
            optScope.setThreshold = function () {
                setThresholdWindow(aData.id, aData.threshold);
            };
            var optNode = optLink(optScope);
            $("td:eq(7)", nRow).html(optNode);
            optNode.find('.dropdown').dropdown();
        }

        function modifyWindow(dataItem) {
            var options = {
                "winId": "amendWinId",
                "title": $scope.i18n.resource_term_modifyStorMedia_button,
                "width": "400px",
                "minimizable": false,
                "maximizable": false,
                "height": "225px",
                "content-type": "url",
                "datastoreId": dataItem.id,
                "maintenanceMode": dataItem.maintenancemode,
                "mediaType": dataItem.mediaType,
                "content": "app/business/resources/views/rpool/zone/zoneResources/storage/mainStorage/amendStorage.html",
                "buttons": [null, null],
                "close": function () {
                    getData();
                }
            };
            var newWindow = new Window(options);
            newWindow.show();
        }

        function showMessage(content, action) {
            var options = {
                type: "confirm",
                content: content,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            msg.destroy();
                            action();
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

        function getData() {
            var params = {
                "detail": 0,
                "category": "1",
                "scopeType": "ZONE",
                "scopeObjectId": $scope.zoneInfo.zoneId,
                "offset": searchInfo.start,
                "limit": searchInfo.limit
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var dataStores = data && data.datastoreInfos || [];
                var total = data && data.total || 0;
                for (var i = 0, l = dataStores.length; i < l; i++) {
                    dataStores[i].detail = {
                        contentType: "url",
                        content: "app/business/resources/views/rpool/zone/zoneResources/storage/secondaryStorage/storageDetail.html"
                    };
                    dataStores[i].maintenanceStr = dataStores[i].maintenancemode ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                    dataStores[i].status = dataStores[i].accessible ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                    dataStores[i].isThin = dataStores[i].ability.isThin ? $scope.i18n.common_term_support_value : $scope.i18n.common_term_notSupport_value;
                    dataStores[i].ioSwitchStr = dataStores[i].ioSwitch == 0 ? $scope.i18n.common_term_close_button : $scope.i18n.common_term_enable_value;
                    dataStores[i].ioSwitchStr = (dataStores[i].type === 'LOCALPOME' || dataStores[i].type === 'LUNPOME' || dataStores[i].type === 'NAS') ?
                        dataStores[i].ioSwitchStr : "";
                }
                $scope.$apply(function () {
                    $scope.storageTable.totalRecords = total;
                    $scope.storageTable.data = dataStores;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function deleteSecondary(id) {
            var deferred = camel.delete({
                url: {s: "/goku/rest/v1.5/irm/1/l2datastores?datastoreid={id}", o: {id: id}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function maintenance(storeId, mode) {
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/datastores"
                },
                "params": JSON.stringify({
                    "datastoreInfos": [
                        {
                            "id": storeId,
                            "maintenancemode": mode
                        }
                    ]
                }),
                "userId": user.id
            });
            deferred.success(function (response) {
                $scope.$apply(function () {
                    getData();
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function setIoControl(storeId, mode) {
            var params = {
                "ioSwitch": {
                    "ioSwitch": mode
                }
            };
            var deferred = camel.put({
                "url": {s: "/goku/rest/v1.5/irm/1/datastores/{id}/action", o: {id: storeId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (response) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function setThresholdWindow(storageId, threshold) {
            var newWindow = new Window({
                "winId": "setThresholdWindow",
                "title": $scope.i18n.resource_term_setAllocationThreshold_button,
                "storageId": storageId,
                "threshold": threshold,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/rpool/zone/zoneResources/storage/mainStorage/setThreshold.html",
                "height": 200,
                "width": $scope.i18n.locale === "zh"?450:520,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }

        if ($scope.operable) {
            $scope.storageTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false,
                    "sWidth": 120
                });
        }
        getData();
    }];

    return storageCtrl;
});