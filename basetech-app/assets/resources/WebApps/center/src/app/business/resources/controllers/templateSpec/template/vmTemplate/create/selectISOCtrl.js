define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Radio',
    "app/business/resources/controllers/constants",
    "app/services/httpService"],
    function ($, angular, Radio, constants, httpService) {
        "use strict";

        var selectISOCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            $scope.searchModel = {
                name:"",
                filetype: "",
                version: "",
                start: 0,
                limit: 10
            };

            $scope.windowID = "selectISOWinID";

            /**
             * 初始化Table操作列
             *
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (row, dataItem, index) {
                var options = {
                    "id" : dataItem.id,
                    "value" : "vmSpecValue_" + dataItem.id,
                    "name" : "vmSpecChecked",
                    "checked" : index == 0,
                    "change" : function() {
                        $scope.selectedISO = dataItem;
                    }
                };
                var radio = new Radio(options);
                $("td:eq(0)", row).html(radio.getDom());
            };

            $scope.selectedISO = undefined;

            $scope.isoTable = {
                caption: "",
                data: [],
                id: "isoTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.fileType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OStype_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.fileOsType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_version_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.version);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.isoTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.isoTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.isoTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(4)", row).addTitle();
                    $("td:eq(5)", row).addTitle();

                    // 类型
                    if (dataitem.fileType == "OS") {
                        $("td:eq(2)", row).html($scope.i18n.common_term_OS_label);
                    } else {
                        $("td:eq(2)", row).html($scope.i18n.template_term_software_label);
                    }

                    addOperatorDom(row, dataitem, index);
                }
            };

            $scope.refreshBtn = {
                id: "isoRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                click: function () {
                    $scope.searchModel.start = $("#" + $scope.isoTable.id).widget().option("curPage");
                    $scope.searchModel.limit = $("#" + $scope.isoTable.id).widget().option("displayLength");
                    $scope.searchModel.name = $("#"+$scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };

            $scope.searchOSType = {
                "id": "searchOSType",
                "width": "150",
                "values": [
                    {
                        "selectId": "",
                        "label": $scope.i18n.common_term_allType_label,
                        "checked" : true
                    },
                    {
                        "selectId": "OS",
                        "label": $scope.i18n.common_term_OS_label
                    },
                    {
                        "selectId": "Software",
                        "label": $scope.i18n.template_term_software_label
                    }
                ],
                "change": function () {
                    $scope.searchModel.filetype = $("#searchOSType").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "searchBox",
                "placeholder": $scope.i18n.template_term_findISO_prom,
                "type":"round",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.searchModel.limit = $("#" + $scope.isoTable.id).widget().option("displayLength");
                    $scope.searchModel.name = searchString;
                    $scope.searchModel.filetype = $("#searchOSType").widget().getSelectedId();
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    // 统一转换start
                    var start = $scope.searchModel.start == 0 ? 1:$scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s":constants.rest.ISO_QUERY.url,"o":{"tenant_id":1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            // 获取数据
                            $scope.isoTable.data = data.isoInfos;
                            $scope.isoTable.totalRecords = data.total;

                            if (data.isoInfos && data.isoInfos[0]) {
                                $scope.selectedISO = data.isoInfos[0];
                            }
                        });
                    });

                    $scope.searchModel.start = start;
                }
            };

            $scope.okBtn = {
                "label": "",
                "id": "selectIsoOKBtn",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {
                    try {
                        var scope = $("#createVmtInstallSoftware").scope();
                        scope.updateIsoInfo($scope.selectedISO);
                    } catch (e) {
                    }
                    $("#" + $scope.windowID).widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "selectIsoCancelBtn",
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
        var selectIOSApp = angular.module("resources.template.selectISO", deps);
        selectIOSApp.controller("resources.template.selectISO.ctrl", selectISOCtrl);
        selectIOSApp.service("camel", httpService);

        return selectIOSApp;
    });