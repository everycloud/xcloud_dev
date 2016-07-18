/*global define*/
define(['jquery',
    "tiny-lib/angular",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-widgets/Progressbar",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"],
    function ($, angular, Message, Window, Progressbar, Exception) {
        "use strict";

        var azCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege["role_role_add_option_AZHandle_value.601002"];

            $scope.zoneInfo = {
                "zoneId": $stateParams.id,
                "zoneName": $stateParams.name
            };
            $scope.help = {
                show: false
            };

            $scope.refresh = {
                id: "azRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                refresh: function () {
                    getAzs();
                }
            };
            $scope.createButton = {
                id: "createAzButton",
                disable: false,
                text: $scope.i18n.common_term_create_button,
                click: function () {
                    $state.go("resources.addAz", {zoneId: $stateParams.id,zoneName:$stateParams.name});
                }
            };
            //查询信息
            var searchInfo = {
                "name": "",
                "start": 0,
                "limit": 10
            };

            var addStatisticsDom = function (dataItem, row) {
                if (!dataItem.statistics) {
                    return;
                }

                //CPU使用率进度条
                var rate = (dataItem.statistics.vcpuReserveRate).toFixed(2);
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value":(rate && rate !== "")?rate:"0.00"
                };
                var progressbar = new Progressbar(options);
                $('td:eq(4)', row).html(progressbar.getDom());
                var totalCpu = dataItem.statistics.vcpuAllocatedSize + dataItem.statistics.vcpuFreeSize;
                var statisticsInfo = (dataItem.statistics.vcpuAllocatedSize).toFixed(2) + "GHz/" + (totalCpu).toFixed(2) + "GHz";
                $('td:eq(4)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo)+"</div>");
                $('td:eq(4)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));

                //内存使用率进度条
                var rate = (dataItem.statistics.memReserveRate).toFixed(2);
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value":(rate && rate !== "")?rate:"0.00"
                };
                var progressbar = new Progressbar(options);
                $('td:eq(5)', row).html(progressbar.getDom());
                var totalMemory = dataItem.statistics.memAllocatedSize + dataItem.statistics.memFreeSize;
                statisticsInfo = (dataItem.statistics.memAllocatedSize).toFixed(2) + "GB/" + (totalMemory).toFixed(2) + "GB";
                $('td:eq(5)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo)+"</div>");
                $('td:eq(5)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));


                //存储池使用率进度条
                var rate = (dataItem.statistics.storagePoolOccupancyRate).toFixed(2);
                var options = {
                    "width": "50",
                    "height": "10",
                    "label-position": "right",
                    "value":(rate && rate !== "")?rate:"0.00"
                };
                var progressbar = new Progressbar(options);
                $('td:eq(6)', row).html(progressbar.getDom());
                var totalStorage = dataItem.statistics.storageOccupancySize + dataItem.statistics.storageFreeSize;
                statisticsInfo = (dataItem.statistics.storageOccupancySize).toFixed(2) + "GB/" + (totalStorage).toFixed(2) + "GB";
                $('td:eq(6)', row).append("<div class='clear_both'>" + $.encoder.encodeForHTML(statisticsInfo)+"</div>");
                $('td:eq(6)', row).attr("title", $.encoder.encodeForHTML(statisticsInfo));
            };

            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div><a href='javascript:void(0)' ng-click='manageCluster()' style='margin-right:10px; width:auto'>" +
                    $scope.i18n.resource_term_clusterManage_button + "</a>" +
                    "<a href='javascript:void(0)'ng-click='manageTag()' style='margin-right:10px;width:auto'>" + $scope.i18n.cloud_term_tagManage_label + "</a>" +
                    "<a href='javascript:void(0)' ng-click='delete()' style=' width:auto'>" + $scope.i18n.common_term_delete_button + "</a>" + "</div>";
                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.manageCluster = function () {
                    clusterWindow(dataItem.id);
                };
                scope.manageTag = function () {
                    manageTag(dataItem.id);
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type": "confirm",
                        "title": $scope.i18n.common_term_confirm_label,
                        "content": $scope.i18n.resource_az_del_info_confirm_msg,
                        "width": "300",
                        "height": "200"
                    };
                    var msgBox = new Message(msgOptions);
                    var buttons = [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,//默认焦点
                            handler: function (event) {//点击回调函数
                                remove(dataItem.id);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ];

                    msgBox.option("buttons", buttons);
                    msgBox.show();
                };

                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(7)", row).html(optDom);

                // 集群详情
                var clusterDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(dataItem.clusterNum) + "</a>";
                var clusterLink = $compile(clusterDom);
                var clusterScope = $scope.$new();
                clusterScope.clusterNum = dataItem.clusterNum;
                clusterScope.goToDetail = function () {
                    clusterWindow(dataItem.id);
                };
                var clusterNode = clusterLink(clusterScope);
                $("td:eq(2)", row).html(clusterNode);

                // 虚拟机详情
                var vmDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(dataItem.vmNum) + "</a>";
                var vmLink = $compile(vmDom);
                var vmScope = $scope.$new();
                vmScope.vmNum = dataItem.vmNum;
                vmScope.goToDetail = function () {
                    vmWindow(dataItem.id);
                };
                var vmNode = vmLink(vmScope);
                $("td:eq(3)", row).html(vmNode);
            };

            $scope.azTable = {
                data: [],
                id: "azTableId",
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
                        "sTitle": $scope.i18n.resource_term_clusterNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clusterNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_vmNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_CPUusageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth":"140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_memUsageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth":"140"
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_storagePoolUsageRate_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false,
                        "sWidth":"140"
                    }
                ],
                callback: function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getAzs();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.azTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.azTable.displayLength = pageInfo.displayLength;
                    getAzs();
                },
                renderRow: function (row, dataitem, index) {
                    $(row).attr("lineNum", $.encoder.encodeForHTML("" + index));
                    $(row).attr("azId", $.encoder.encodeForHTML("" + dataitem.id));

                    $("td:eq(1)", row).addTitle();

                    // 添加统计
                    addStatisticsDom(dataitem, row);

                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.searchBox = {
                "id": "azSearchBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "type": "round",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    searchInfo.start = 0;
                    $scope.azTable.curPage = {
                        "pageIndex": 1
                    };
                    getAzs();
                }
            };

            function clusterWindow(azId) {
                var newWindow = new Window({
                    "winId": "clusterOfAzWindow",
                    "title": $scope.i18n.resource_term_clusterManage_button,
                    "zoneId": $scope.zoneInfo.zoneId,
                    "azId": azId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/rpool/zone/zoneResources/availableZone/clusterOfAz.html",
                    "height": 550,
                    "width": 800,
                    "close": function () {
                        getAzs();
                    }
                });
                newWindow.show();
            }

            function vmWindow(azId) {
                var newWindow = new Window({
                    "winId": "vmOfAzWindow",
                    "title": $scope.i18n.common_term_vm_label,
                    "azId": azId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/rpool/zone/zoneResources/availableZone/vmOfAz.html",
                    "height": 500,
                    "width": 750,
                    "close": function () {

                    }
                });
                newWindow.show();
            }

            function getAzs() {
                if ($("#" + $scope.searchBox.id).widget()) {
                    searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
                }
                var params = {
                    "zoneId": $scope.zoneInfo.zoneId,
                    "start": searchInfo.start,
                    "limit": searchInfo.limit,
                    "name": searchInfo.name,
                    "detail": false
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/availablezones/list"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    for (var index in azs) {
                        azs[index].detail = {
                            contentType: "url",
                            content: "app/business/resources/views/rpool/zone/zoneResources/availableZone/azDetail.html"
                        };
                        var resources = azs[index] || {};
                        azs[index].clusterNum = resources.numResourcesCluster;
                        azs[index].vmNum = resources.numVM;
                    }

                    $scope.azTable.totalRecords = data.total;
                    getStatistics(azs);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function getStatistics(azs) {
                if(!azs || azs.length === 0){
                    $scope.$apply(function(){
                        $scope.azTable.data = azs;
                    });
                    return;
                }

                var azIds = [];
                for (var index in azs) {
                    azIds.push(azs[index].id);
                }
                var params = {
                    "ids": azIds
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/irm/{tenant_id}/statistics/available-zones",
                        o: {tenant_id:"1"}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if(data && data.capacityAZs){
                        var capacityAZs = data.capacityAZs;
                        for (var i = 0; i < azs.length; i++) {
                            azs[i].statistics = capacityAZs[azs[i].id];
                        }
                    }
                    $scope.$apply(function(){
                        $scope.azTable.data = azs;
                    });
                });
                deferred.fail(function (data) {
                    $scope.$apply(function(){
                        $scope.azTable.data = azs;
                    });
                    exceptionService.doException(data);
                });
            }

            function remove(azId) {
                var deferred = camel.delete({
                    url: {s: "/goku/rest/v1.5/irm/1/availablezones/{id}", o: {id: azId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.complete(function (data) {
                    getAzs();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function manageTag(azId) {
                var newWindow = new Window({
                    "winId": "localManageTagWindow",
                    "title": $scope.i18n.cloud_term_tagManage_label,
                    "content-type": "url",
                    "buttons": null,
                    "azId": azId,
                    "resourceType": 'AZ',
                    "content": "app/business/tag/views/label/localManageTag.html",
                    "height": 500,
                    "width": 750
                });
                newWindow.show();
            }

            if ($scope.operable) {
                $scope.azTable.columns.push({
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "19%"
                });
            }
            getAzs();
        }];

        return azCtrl;
    });