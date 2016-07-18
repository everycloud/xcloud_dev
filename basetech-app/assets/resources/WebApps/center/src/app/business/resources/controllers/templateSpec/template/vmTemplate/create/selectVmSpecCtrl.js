define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'tiny-widgets/Radio',
    "app/services/httpService"],
    function ($, angular, constants, Radio, httpService) {
        "use strict";

        var vmSpecListCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            $scope.windowID = "selectVmSpecWinID";

            $scope.selectSpec = undefined;

            $scope.searchModel = {
                name:"",
                start: "0",
                limit: "10"
            };

            /**
             * 初始化虚拟机规格Table操作列
             *
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row, index) {
                var options = {
                    "id" : dataItem.id,
                    "value" : "vmSpecValue_" + dataItem.id,
                    "name" : "vmSpecChecked",
                    "checked" : index == 0,
                    "change" : function() {
                        $scope.selectSpec = dataItem;
                    }
                };
                var radio = new Radio(options);
                $("td:eq(0)", row).html(radio.getDom());
            };

            /**
             * 虚拟机规格表格
             */
            $scope.vmSpecTable = {
                caption: "",
                data: [],
                id: "vmSpecTableId",
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
                        "sTitle": "",//设置第一列的标题
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,//设置第一列的标题
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "CPU",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.cpuCount);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_memory_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.memSize);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_disks_label,
                        "bSortable":false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmSpecTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmSpecTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.vmSpecTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).bind("click", function () {
                        $scope.currentItem = dataitem;
                    });

                    // 调整disks信息
                    var diskInfo = "";
                    var disks = dataitem.disks;
                    for (var disk in disks) {
                        diskInfo += disks[disk].diskSize + "GB";
                        diskInfo += ";";
                    }
                    $("td:eq(4)", row).html($.encoder.encodeForHTML(diskInfo));

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(4)", row).addTitle();

                    // 添加操作
                    addOperatorDom(dataitem, row, index);
                }
            };

            // 存储当前点击行数据
            $scope.currentItem = undefined;

            /**
             * 操作按钮
             */
            $scope.refresh = {
                id: "vmSpecRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                refresh: function () {
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "searchBox",
                "placeholder": $scope.i18n.spec_term_findVMspecName_prom,
                "type":"round", // round,square,long
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                    // 预留功能
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operator.query();
                }
            };

            /**
             * 操作方法定义
             *
             */
            $scope.operator = {
                "query": function () {
                    // 统一转换start
                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s": constants.rest.VM_SPEC_QUERY.url, "o": {"tenant_id": 1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.vmFlavors === undefined) {
                            return;
                        }
                        $scope.$apply(function () {

                            // 获取数据
                            $scope.vmSpecTable.data = data.vmFlavors;
                            $scope.vmSpecTable.totalRecords = data.total;
                            $scope.selectSpec = data.vmFlavors[0] === undefined ? undefined:data.vmFlavors[0];
                        });
                    });

                    $scope.searchModel.start = start;
                }
            };

            $scope.okBtn = {
                "label": "",
                "id": "selectVmSpecOKBtn",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {
                    try {
                        var scope = $("#createVmtSpecInfo").scope();
                        scope.updateVMSpec($scope.selectSpec);
                    } catch (e) {
                    }
                    $("#" + $scope.windowID).widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "selectVmSpecCancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#" + $scope.windowID).widget().destroy();
                }
            };

            // 打开时请求数据
            $scope.operator.query();
        }];

        // 创建App
        var deps = [];
        var selectVmSpecApp = angular.module("resources.vmTemplate.vmSpecList", deps);
        selectVmSpecApp.controller("resources.vmTemplate.vmSpecList.ctrl", vmSpecListCtrl);
        selectVmSpecApp.service("camel", httpService);

        return selectVmSpecApp;
    });

