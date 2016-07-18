/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Tabs',
    'tiny-widgets/Window',
    "app/services/httpService",
    "app/services/competitionConfig",
    'tiny-widgets/Message',
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Tabs, Window, http, competition, Message, Exception) {
        "use strict";

        var mainStorageCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege.role_role_add_option_storagePoolHandle_value;
            $scope.exportAble = user.privilege.role_role_add_option_reportView_value;
            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
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
                "NAS":$scope.i18n.common_term_NAS_label
            };
            var searchInfo = {
                "offset": 0,
                "limit": 10,
                "type": null,
                "name": ""
            };
            //类型过滤框
            $scope.typeSelector = {
                "id": "searchTypeSelector",
                "width": "135",
                "values": [
                    {
                        "selectId": "all",
                        "label": $scope.i18n.common_term_allType_label,
                        "checked": true
                    },
                    {
                        "selectId": "local",
                        "label": $scope.i18n.resource_stor_create_para_type_option_local_value,
                    },
                    {
                        "selectId": "san",
                        "label":  $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                    },
                    {
                        "selectId": "LOCALPOME",
                        "label": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                    },
                    {
                        "selectId": "LUNPOME",
                        "label":  $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                    },
                    {
                        "selectId": "LUN",
                        "label":$scope.i18n.resource_stor_create_para_type_option_bare_value,
                    },
                    {
                        "selectId": "NAS",
                        "label":$scope.i18n.common_term_NAS_label
                    }
                ],
                "change": function () {
                    searchInfo.type = $("#" + $scope.typeSelector.id).widget().getSelectedId();
                    searchInfo.type = searchInfo.type === "all" ? null : searchInfo.type;
                    searchInfo.offset = 0;
                    $scope.mainStorageTable.curPage = {
                        "pageIndex": 1
                    };
                    $scope.operator.query();
                }
            };

            //模糊搜索框
            $scope.searchBox = {
                "id": "searchMainStorageBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.offset = 0;
                    $scope.mainStorageTable.curPage = {
                        "pageIndex": 1
                    };
                    $scope.operator.query();
                }
            };

            /**
             * 初始化表格操作列
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                var maintainnance = "";
                if (dataItem.maintenancemode) {
                    maintainnance = '<li><a href="javascript:void(0)" ng-click="logOutMaintain()">'+$scope.i18n.device_term_quitMaintenance_button+'</a></li>';
                }
                else {
                    maintainnance = '<li><a href="javascript:void(0)" ng-click="logInMaintain()">'+$scope.i18n.common_term_turnMaintenance_button+'</a></li>';
                }
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">'+$scope.i18n.common_term_more_button+
                    '<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                    '<li><a href="javascript:void(0)" ng-if="migrateAble" ng-click="migrate()">'+$scope.i18n.vm_term_diskMigrate_button+'</a></li>' + maintainnance;
                if (competition.storageIoControl && (dataItem.type === 'LOCALPOME' || dataItem.type === 'LUNPOME' || dataItem.type === 'NAS')) {
                    if (dataItem.ioSwitch == 0) {
                        submenus += '<li><a href="javascript:void(0)" ng-click="openIoSwitch()">'+$scope.i18n.common_term_turnOnIOcontrol_button+'</a></li>';
                        submenus += '<li class="disabled"><a href="javascript:void(0)">'+$scope.i18n.resource_term_shutIOcontrol_button+'</a></li>';
                    }
                    else {
                        submenus += '<li class="disabled"><a href="javascript:void(0)">'+$scope.i18n.common_term_turnOnIOcontrol_button+'</a></li>';
                        submenus += '<li><a href="javascript:void(0)" ng-click="closeIoSwitch()">'+$scope.i18n.resource_term_shutIOcontrol_button+'</a></li>';
                    }
                }
                if (dataItem.ability.supportThreshold) {
                    submenus += '<li><a ng-click="setThreshold()">'+$scope.i18n.resource_term_setAllocationThreshold_button+'</a></li>';
                }
                submenus += '</ul>' + '</span>';
                var optTemplates = "<div><a href='javascript:void(0)' ng-click='amend()'>"+$scope.i18n.common_term_modify_button+"</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                    submenus + "</div>";
                var scope = $scope.$new(false);
                scope.migrateAble = (dataItem.type == 'LUN' || dataItem.hypervisorType == "vmware") ? false : true;
                scope.data = dataItem;
                scope.delete = function () {
                    $scope.operator.delete(dataItem.id);
                };
                scope.migrate = function () {
                    $state.go("resources.migrateDisk", {"datastoreId": dataItem.id, "hypervisorId": dataItem.hypervisorId, "zoneId": $stateParams.id, "category": dataItem.type});
                };

                var amendWin = {
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
                        $scope.operator.query();
                    }
                };

                scope.amend = function () {

                    var amendWindow = new Window(amendWin);
                    amendWindow.show();
                };

                scope.logOutMaintain = function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.device_all_quitMaintenanceStor_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        $scope.operator.changeMaintenanceMode(dataItem.id, msg, !dataItem.maintenancemode);
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                };

                scope.logInMaintain = function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.device_all_turnMaintenanceStor_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                default: true,
                                majorBtn : true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        $scope.operator.changeMaintenanceMode(dataItem.id, msg, !dataItem.maintenancemode);
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                };

                scope.openIoSwitch = function () {
                    showMessage($scope.i18n.vm_vm_enableStorIOcontrol_info_confirm_msg, function () {
                        setIoControl(dataItem.id, 1);
                    });
                };
                scope.closeIoSwitch = function () {
                    showMessage($scope.i18n.vm_vm_disableStorIOcontrol_info_confirm_msg, function () {
                        setIoControl(dataItem.id, 0);
                    });
                };
                scope.setThreshold = function () {
                    setThresholdWindow(dataItem.id, dataItem.threshold);
                };

                var optDom = $compile($(optTemplates))(scope);
                    $("td:eq(7)", row).html(optDom);
                optDom.find('.dropdown').dropdown();

                if (dataItem.hypervisorType !== "vmware") {
                    // 初始化详情
                    var nameDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>{{name}}</a>";
                    var nameLink = $compile(nameDom);
                    var nameScope = $scope.$new();
                    nameScope.name = dataItem.name;
                    nameScope.id = dataItem.id;
                    nameScope.goToDetail = function () {
                        // 打开详情window
                        $state.go("resources.storeInfo.summary", {"storeId": dataItem.id, "storeName": dataItem.name,
                            "from": $state.current.name,"hyperId": dataItem.hypervisorId});
                    };
                    var nameNode = nameLink(nameScope);
                    $("td:eq(1)", row).html(nameNode);
                }
            };

            /**
             *  表格Scope
             */
            $scope.mainStorageTable = {
                data: [],
                id: "mainStorageTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: true,
                callback: function (evtObj) {
                    searchInfo.offset = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.operator.query();
                },
                changeSelect: function (evtObj) {
                    searchInfo.offset = 0;
                    $scope.mainStorageTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = evtObj.displayLength;
                    $scope.mainStorageTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                columns: [
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
                        "sTitle":  $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.accessibleStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_allocatedCapacity_label+"(GB)",
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
                renderRow: function (row, dataitem, index) {
                    $(row).attr("lineNum", $.encoder.encodeForHTML("" + index));
                    $(row).attr("storageId", $.encoder.encodeForHTML("" + dataitem.id));
                    $('td:eq(1)', row).addTitle();
                    $('td:eq(2)', row).addTitle();
                    $('td:eq(3)', row).addTitle();
                    $('td:eq(4)', row).addTitle();
                    $('td:eq(5)', row).addTitle();
                    $('td:eq(6)', row).addTitle();
                    // 添加操作
                    addOperatorDom(dataitem, row);

                    $("td:eq(2)", row).html(storeTypes[dataitem.type] || dataitem.type);
                    $('td:eq(2)', row).attr("title", storeTypes[dataitem.type] || dataitem.type);
                }
            };

            $scope.refresh = {
                id: "mainStorageRefresh_id",
                disabled: false,
                iconsClass: "",
                text:  $scope.i18n.common_term_fresh_button,
                tip: "",
                refresh: function () {
                    $scope.operator.query();
                }
            };
            //导出按钮
            $scope.exportButton = {
                "id": "mainExportButton",
                "text": $scope.i18n.common_term_export_button,
                "click": function () {
                    exportStoreList();
                }
            };
            function exportStoreList() {
                var locale = $scope.i18n.locale === "zh"?"zh_CN":"en_US";
                var params = {
                    "exportDataStore": {
                        "category": "0",
                        "scopeType": "ZONE",
                        "scopeObjectId": $scope.zoneInfo.zoneID
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
                        $("#downloadMainStoreIframe").attr("src", $.encoder.encodeForHTML(reportUrl));
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
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
                    $scope.operator.query();
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
                        $scope.operator.query();
                    }
                });
                newWindow.show();
            }

            $scope.operator = {
                "query": function () {
                    var params = {
                        "detail": 0,
                        "category": "0",
                        "scopeType": "ZONE",
                        "scopeObjectId": $scope.zoneInfo.zoneID,
                        "offset": searchInfo.offset,
                        "limit": searchInfo.limit,
                        "type": searchInfo.type
                    };
                    if ($("#" + $scope.searchBox.id).widget()) {
                        params.name = $("#" + $scope.searchBox.id).widget().getValue();
                    }
                    var defered = camel.post({
                        "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/datastores", o: {"tenant_id": 1}},
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    defered.success(function (data) {
                        var index;
                        var stores = data && data.datastoreInfos || [];
                        var total = data && data.total || 0;
                        for (index in stores) {
                            stores[index].detail = {
                                contentType: "url",
                                content: "app/business/resources/views/rpool/zone/zoneResources/storage/secondaryStorage/storageDetail.html"
                            };
                            stores[index].accessibleStr = stores[index].accessible ? $scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
                            stores[index].isThinStr = stores[index].ability.isThin ? $scope.i18n.common_term_support_value : $scope.i18n.common_term_notSupport_value;
                            stores[index].maintenanceStr = stores[index].maintenancemode ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                            stores[index].ioSwitchStr = stores[index].ioSwitch == 0 ? $scope.i18n.common_term_close_button : $scope.i18n.common_term_enable_value;
                            stores[index].ioSwitchStr = (stores[index].type === 'LOCALPOME' || stores[index].type === 'LUNPOME' || stores[index].type === 'NAS') ?
                                stores[index].ioSwitchStr : "";
                        }
                        $scope.$apply(function () {
                            $scope.mainStorageTable.totalRecords = total;
                            $scope.mainStorageTable.data = stores;
                        });
                    });
                    defered.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "changeMaintenanceMode": function (datastoreId, msg, maintenancemode) {
                    var defered = camel.put({
                        "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/datastores",
                            o: {"tenant_id": 1}
                        },
                        "params": JSON.stringify({
                            "datastoreInfos": [
                                {
                                    "id": datastoreId,
                                    "maintenancemode": maintenancemode
                                }
                            ]
                        }),
                        "userId": user.id
                    });
                    defered.success(function (response) {
                        $scope.$apply(function () {
                            msg.destroy();
                            $scope.operator.query();
                        });
                    });
                    defered.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            };
            if ($scope.operable) {
                $scope.mainStorageTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    });
            }
            // 打开时请求数据
            $scope.operator.query();
        }];

        return mainStorageCtrl;
    });
