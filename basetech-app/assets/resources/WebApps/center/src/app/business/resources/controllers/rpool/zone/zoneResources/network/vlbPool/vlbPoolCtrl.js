define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function ($, angular, Window, constants, ExceptionService) {
        "use strict";

        var vlbPoolCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            $scope.searchModel = {
                zoneid: $stateParams.id,
                start: "0",
                limit: "10"
            };

            $scope.status = {
                "READY": $scope.i18n.common_term_running_value || "运行",
                "DISABLE": $scope.i18n.common_term_stoping_value || "停止",
                "FAULT": $scope.i18n.common_term_trouble_label || "故障",
                "ERROR": $scope.i18n.common_term_fail_label || "失败",
                "BUILD": $scope.i18n.common_term_executing_value || "执行中"
            };

            $scope.type = {
                "low": $scope.i18n.common_term_software_label || "软件",
                "high": $scope.i18n.common_term_hardware_label || "硬件"
            };

            /**
             * 查看硬件信息
             *
             * @param id
             * @returns {Window}
             */
            var showDevInfoWindow = function (id) {
                var options = {
                    "winId": "showDevInfoWindowID",
                    "devID": id,
                    "title": $scope.i18n.vm_term_hardInfo_label || "硬件信息",
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/zoneResources/network/vlbPool/showDevInfo.html",
                    "height": 220,
                    "width": 360,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null,
                    "close": function (event) {
                    }
                };

                var win = new Window(options);
                win.show();
            };

            /**
             * 初始化表格操作列
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                if (dataItem.type == "high") {
                    dataItem.deviceID = dataItem.devID;
                } else {
                    dataItem.deviceID = dataItem.slbVmInfo.vmUrn;
                }

                // 初始化详情
                var nameDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(dataItem.deviceID) + "</a>";
                var nameLink = $compile(nameDom);
                var nameScope = $scope.$new();
                nameScope.id = dataItem.deviceID;
                nameScope.goToDetail = function () {
                    if (dataItem.type == "low") {
                        $state.go("resources.vmInfo.summary", {"name": dataItem.lbName, "from": $state.current.name, "vmId": dataItem.deviceID});
                    } else {
                        showDevInfoWindow(dataItem.deviceID);
                    }
                };

                var zoneNameNode = nameLink(nameScope);
                $("td:eq(3)", row).html(zoneNameNode);
                $("td:eq(2)", row).html($scope.status[dataItem.status]);
                $("td:eq(1)", row).html($scope.type[dataItem.type]);
                $("td:eq(4)", row).html($.encoder.encodeForHTML(dataItem.slbVmInfo.vpcName));

                $("td:eq(0)", row).addTitle();
                $("td:eq(3)", row).addTitle();
                $("td:eq(4)", row).addTitle();
            };

            /**
             *  表格Scope
             */
            $scope.vlbPoolTable = {
                caption: "",
                data: [],
                id: "vlbPoolTableId",
                columnsDraggable: true,
                enablePagination: true, //此属性设置表格是否分页
                paginationStyle: "full_numbers", //此属性设置表格分页的类型，可选值"simple","full_numbers"。
                lengthChange: true, // 此属性设置是否显示每页数据条数按钮。
                lengthMenu: [10, 20, 50], // 此属性设置每页显示数据长度选项，仅当length-change属性设置为true时有效。
                displayLength: 10,
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label || "名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lbName);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label || "类型",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label || "状态",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.device_term_deviceID_label || "设备ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.devID);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.vpc_term_vpcName_label || "VPC名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vlbPoolTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vlbPoolTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.vlbPoolTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.refresh = {
                id: "vlbPoolRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button || "刷新",
                tip: "",
                refresh: function () {
                    "use strict";
                    $scope.searchModel.name = $("#" + $scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "vlbPoolSearchBox",
                "placeholder": $scope.i18n.common_term_findName_prom || "请输入名称",
                "type": "round", // round,square,long
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    // 统一转换start
                    var start = $scope.searchModel.start == 0 ? 1 : $scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);
                    var deferred = camel.get({
                        "url": {"s": constants.rest.VLB_POOL_QUERY.url, "o": {"tenant_id": 1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.lbInfos === undefined) {
                            return;
                        }
                        $scope.$apply(function () {
                            // 获取数据
                            for (var index in data.lbInfos) {
                                var lbParameters = data.lbInfos[index].lbParameters[0];
                                var lbPerformance = lbParameters.qosInfo[0].value;

                                data.lbInfos[index].type = lbPerformance;
                            }

                            $scope.vlbPoolTable.data = data.lbInfos;
                            $scope.vlbPoolTable.totalRecords = data.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                    $scope.searchModel.start = start;
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        return vlbPoolCtrl;
    });