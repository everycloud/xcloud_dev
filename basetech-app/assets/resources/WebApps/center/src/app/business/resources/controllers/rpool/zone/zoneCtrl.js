/*global define*/
define(['jquery',
    "tiny-lib/angular",
    'tiny-widgets/Window',
    "tiny-widgets/Message",
    "tiny-widgets/Progressbar",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Window, Message, Progressbar, Exception) {
        "use strict";

        var vmtListCtrl = ["$scope", "$compile", "$state", "camel", '$sce', function ($scope, $compile, $state, camel, $sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege.role_role_add_option_zoneHandle_value;
            $scope.resource_zone_view_explan_label = $sce.trustAsHtml($scope.i18n.resource_zone_view_explan_label);
            var searchModel = {
                "start": 0,
                "limit": 10,
                "name": null
            };
            $scope.help = {
                show: false
            };
            var networkModes = {
                "SWITCH_WITH_FIREWALL": $scope.i18n.resource_zone_add_para_type_option_handleFw_value,
                "FIREWALL_ONLY": $scope.i18n.resource_zone_add_para_type_option_gateOnFw_value,
                "SWITCH_ONLY": $scope.i18n.resource_zone_add_para_type_option_unhandleFw_value,
                "EMTPY": $scope.i18n.resource_zone_add_para_type_option_noGate_value
            };

            //刷新按钮
            $scope.refresh = {
                id: "zoneRefresh_id",
                text: $scope.i18n.common_term_fresh_button,
                refresh: function () {
                    getZones();
                }
            };
            //创建按钮
            $scope.createZone = {
                id: "zoneCreate_id",
                disable: false,
                text: $scope.i18n.common_term_create_button,
                create: function () {
                    createWindow("create");
                }
            };

            //模糊搜索框
            $scope.searchBox = {
                "id": "searchZoneBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchModel.start = 0;
                    $scope.zoneTable.curPage = {
                        "pageIndex": 1
                    };
                    getZones();
                }
            };
            //zone表格
            $scope.zoneTable = {
                data: [],
                id: "zoneTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 30],
                displayLength: 10,
                enableFilter: false,
                totalRecords: 0,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "6%"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_storagePoolUsageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_storageAllocationRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_vlanUsageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "140"
                    },
                    {
                        "sTitle": $scope.i18n.vpc_term_publicIP_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_hardVFW_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth": "8%"
                    }
                ],
                callback: function (evtObj) {
                    searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getZones();
                },
                changeSelect: function (evtObj) {
                    searchModel.start = 0;
                    $scope.zoneTable.curPage = {
                        "pageIndex": 1
                    };
                    searchModel.limit = evtObj.displayLength;
                    $scope.zoneTable.displayLength = evtObj.displayLength;
                    getZones();
                },
                renderRow: function (row, dataitem, index) {
                    $('td:eq(0)', row).addTitle();

                    // 添加统计
                    addStatisticsDom(dataitem, row);

                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            //创建弹框
            var createWindow = function (action, zoneId) {
                var options = {
                    "winId": "createZoneWindow",
                    "action": action,
                    "zoneId": zoneId,
                    "title": $scope.i18n.resource_term_createZone_button,
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/create/createZone.html",
                    "height": 320,
                    "width": $scope.i18n.locale === "zh"?670:800,
                    "resizable": true,
                    "maximizable": false,
                    "minimizable":false,
                    "buttons": null,
                    "close": function () {
                        getZones();
                    }
                };
                if (action === "edit") {
                    options.title = $scope.i18n.common_term_modify_button;
                }
                var newWindow = new Window(options);
                newWindow.show();
            };
            //表格插入
            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div>" + "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" +
                    $scope.i18n.common_term_modify_button + "</a>" +
                    "<a href='javascript:void(0)'ng-click='delete()' style='width:auto'>" + $scope.i18n.common_term_delete_button + "</a>" + "</div>";
                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.edit = function () {
                    createWindow("edit", dataItem.id);
                };
                scope.delete = function () {
                    deleteMessage(dataItem.id);
                };
                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(8)", row).html(optDom);

                // 初始化详情
                var zoneName = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(dataItem.name) + "</a>";
                var zoneNameLink = $compile(zoneName);
                var zoneNameScope = $scope.$new();
                zoneNameScope.name = dataItem.name;
                zoneNameScope.id = dataItem.id;
                zoneNameScope.goToDetail = function () {
                    $state.go("resources.zoneResources.summary.zoneSummary", {"id": dataItem.id, "name": dataItem.name});
                };
                var zoneNameNode = zoneNameLink(zoneNameScope);
                $("td:eq(0)", row).html(zoneNameNode);
            };
            var addStatisticsDom = function (dataItem, row) {
                if (!dataItem.statistics) {
                    return;
                }
                //CPU使用率进度条
                var rate = dataItem.statistics.cpuTotalSizeGHz ? (dataItem.statistics.cpuUsedSizeGHz * 100 / dataItem.statistics.cpuTotalSizeGHz).toFixed(2) : "0.00";
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value": rate
                };
                var progressbar = new Progressbar(options);
                $('td:eq(1)', row).html(progressbar.getDom());
                var statisticsInfo = dataItem.statistics.cpuUsedSizeGHz.toFixed(2) + "GHz/" + dataItem.statistics.cpuTotalSizeGHz.toFixed(2) + "GHz";
                $('td:eq(1)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo) + "</div>");
                $('td:eq(1)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //内存使用率进度条
                var rate = dataItem.statistics.memTotalSizeGB ? (dataItem.statistics.memUsedSizeGB * 100 / dataItem.statistics.memTotalSizeGB).toFixed(2) : "0.00";
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value": rate
                };
                var progressbar = new Progressbar(options);
                $('td:eq(2)', row).html(progressbar.getDom());
                var statisticsInfo = dataItem.statistics.memUsedSizeGB.toFixed(2) + "GB/" + dataItem.statistics.memTotalSizeGB.toFixed(2) + "GB";
                $('td:eq(2)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo) + "</div>");
                $('td:eq(2)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //存储池使用率进度条
                var rate = dataItem.statistics.storagePoolTotalSizeGB ?
                    (dataItem.statistics.storagePoolUsedSizeGB * 100 / dataItem.statistics.storagePoolTotalSizeGB).toFixed(2) : "0.00";
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value": rate
                };
                var progressbar = new Progressbar(options);
                $('td:eq(3)', row).html(progressbar.getDom());
                var statisticsInfo = dataItem.statistics.storagePoolUsedSizeGB.toFixed(2) + "GB/" + dataItem.statistics.storagePoolTotalSizeGB.toFixed(2) + "GB";
                $('td:eq(3)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo) + "</div>");
                $('td:eq(3)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //存储池分配率进度条
                var rate = dataItem.statistics.storagePoolTotalSizeGB ?
                    (dataItem.statistics.storageAllocatedSizeGB * 100 / dataItem.statistics.storagePoolTotalSizeGB).toFixed(2) : "0.00";
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value": rate
                };
                var progressbar = new Progressbar(options);
                $('td:eq(4)', row).html(progressbar.getDom());
                var statisticsInfo = dataItem.statistics.storageAllocatedSizeGB.toFixed(2) + "GB/" + dataItem.statistics.storagePoolTotalSizeGB.toFixed(2) + "GB";
                $('td:eq(4)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo) + "</div>");
                $('td:eq(4)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //VLAN池使用率进度条
                var rate = dataItem.statistics.vlanTotalNum ? (dataItem.statistics.vlanUsedNum * 100 / dataItem.statistics.vlanTotalNum).toFixed(2) : "0.00";
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value": rate
                };
                var progressbar = new Progressbar(options);
                $('td:eq(5)', row).html(progressbar.getDom());
                var statisticsInfo = dataItem.statistics.vlanUsedNum + $scope.i18n.common_term_entry_label + "/" +
                    dataItem.statistics.vlanTotalNum + $scope.i18n.common_term_entry_label;
                $('td:eq(5)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo) + "</div>");
                $('td:eq(5)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //公网IP
                var statisticsInfo = dataItem.statistics.publicIPUsedNum + $scope.i18n.common_term_entry_label + "/" +
                    dataItem.statistics.publicIPTotalNum + $scope.i18n.common_term_entry_label;
                $('td:eq(6)', row).html("<div>" + "</div><div>" + statisticsInfo + "</div>");
                $('td:eq(6)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //虚拟防火墙
                var statisticsInfo = dataItem.statistics.virtualFirewallUsedNum + $scope.i18n.common_term_entry_label + "/" +
                    dataItem.statistics.virtualFirewallTotalNum + $scope.i18n.common_term_entry_label;
                $('td:eq(7)', row).html("<div>" + "</div><div>" + statisticsInfo + "</div>");
                $('td:eq(7)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));
            };
            function deleteMessage(zoneId) {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.resource_zone_del_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                deleteZone(zoneId);
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

            function getZones() {
                if ($("#" + $scope.searchBox.id).widget()) {
                    var name = $("#" + $scope.searchBox.id).widget().getValue();
                    searchModel.name = name === "" ? null : name;
                }
                var params = {
                    "list": {
                        "start": searchModel.start,
                        "limit": searchModel.limit,
                        "name": searchModel.name
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/zones/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var zones = data && data.list && data.list.zones || [];
                    $scope.zoneTable.totalRecords = data.list.total;
                    getStatistics(zones);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getStatistics(zones) {
                var zoneIds = [];
                for (var index in zones) {
                    zones[index].mode = networkModes[zones[index].networkMode];
                    zoneIds.push(zones[index].id);
                }
                var params = {
                    "zoneIds": zoneIds
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/capacity-statistics/zones"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var response = data.reponse;
                    for (var i = 0; i < zones.length; i++) {
                        zones[i].statistics = response[zones[i].id];
                    }
                    $scope.$apply(function () {
                        $scope.zoneTable.data = zones;
                    });
                });
                deferred.fail(function (data) {
                    $scope.$apply(function () {
                        $scope.zoneTable.data = zones;
                    });
                    exceptionService.doException(data);
                });
            }

            function deleteZone(zoneId) {
                var deferred = camel.delete({
                    url: {s: "/goku/rest/v1.5/irm/1/zones/{id}", o: {id: zoneId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getZones();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if ($scope.operable) {
                $scope.zoneTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    });
            }
            // 打开时请求数据
            getZones();
        }];

        return vmtListCtrl;
    });

