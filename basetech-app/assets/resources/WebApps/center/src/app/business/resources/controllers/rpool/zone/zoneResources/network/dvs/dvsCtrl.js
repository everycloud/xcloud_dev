define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/Searchbox',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'fixtures/zoneFixture'],
    function ($, angular, Searchbox, Window, Message, constants, ExceptionService, zoneFixture) {
        "use strict";

        var dvsCtrl = ["$scope", "$compile", "$stateParams", 'camel', '$rootScope', function ($scope, $compile, $stateParams, camel, $rootScope) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };
            $scope.vmwareHyper = false;
            $scope.searchModel = {
                "name": "",
                "hypervisorid": "",
                "start": 0,
                "limit": 10
            };

            /**
             * 初始化DVS表格的操作列
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                var scope = $scope.$new(false);
                if (null == dataItem.vsses || 0 == dataItem.vsses.length) {
                    var optTemplates = "<div>" +
                        "<a href='javascript:void(0)' class='disabled' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button + "</a>" +
                        "<a href='javascript:void(0)' class='disabled' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_delete_button + "</a>" +
                        "</div>";
                }
                else {
                    var optTemplates = "<div>" +
                        "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button + "</a>" +
                        "<a href='javascript:void(0)' ng-click='delete()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_delete_button + "</a></div>";
                    scope.edit = function () {
                        var title = $scope.i18n.resource_term_modifyDVS_button;
                        var newWindow = createWindow(dataItem, title);
                        newWindow.show();
                    };
                    scope.delete = function () {
                        var msgOptions = {
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.resource_dvs_del_info_confirm_msg,
                            "width": "300",
                            "height": "200"
                        };
                        var msgBox = new Message(msgOptions);
                        var buttons = [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: 'Y',
                                majorBtn : true,
                                default: true,
                                handler: function (event) {
                                    $scope.operator.delete(dataItem.id);
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
                }
                var optDom = $compile($(optTemplates))(scope);
                $("td:eq(8)", row).html(optDom);
            };

            /**
             * 创建DVS
             */
            var createWindow = function (data, title) {
                var options = {
                    "winId": "createDVSWinID",
                    "zoneName": $scope.zoneInfo.zoneName,
                    "zoneID": $scope.zoneInfo.zoneID,
                    "data": data,
                    "title": title,
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/zoneResources/network/dvs/createDvs.html",
                    "height": 540,
                    "width": 720,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null,
                    "close": function () {
                        $scope.operator.query();
                    }
                };

                return new Window(options);
            };

            $scope.dvsTable = {
                caption: "",
                data: [],
                id: "dvsTableId",
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
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "9%"
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false,
                        "sWidth": "9%"
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_exchangeType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.dvsTypeStr);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clusterName);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.host) || "-";
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "VSS",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vss) || "-";
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "10%"
                    }
                ],
                columnVisibility: {
                    "activate": "click",
                    "aiExclude": [],
                    "fnStateChange": function (index, checked) {
                    }
                },
                callback: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.dvsTable.curPage = evtObj.currentPage;
                    $scope.operator.query();
                },
                changeSelect: function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = evtObj.displayLength;
                    $scope.dvsTable.curPage = evtObj.currentPage;
                    $scope.dvsTable.displayLength = evtObj.displayLength;
                    $scope.operator.query();
                },
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(2)", row).addTitle();
                    $("td:eq(3)", row).addTitle();
                    $("td:eq(4)", row).addTitle();
                    $("td:eq(5)", row).addTitle();
                    $("td:eq(6)", row).addTitle();
                    $("td:eq(7)", row).addTitle();
                    // 添加操作
                    if ($scope.right.hasNetPoolOperateRight) {
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.refresh = {
                id: "dvsRefresh_id",
                refresh: function () {
                    $scope.operator.query();
                }
            };

            var searchHyperList = [
                {
                    "selectId": "0",
                    "label": $scope.i18n.virtual_term_allBondStatus_label,
                    "checked": true
                }
            ]

            $scope.searchHyper = {
                "id": "dvsSearchHyper",
                "dftLabel": $scope.i18n.virtual_term_allBondStatus_label,
                "width": "150",
                "values": searchHyperList,
                "change": function () {
                    var hypervisorId = $("#" + $scope.searchHyper.id).widget().getSelectedId();
                    if ("0" == hypervisorId) {
                        $scope.searchModel.hypervisorid = "";
                    }
                    else {
                        $scope.searchModel.hypervisorid = hypervisorId;
                    }
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "dvsSearchBox",
                "placeholder": $scope.i18n.resource_term_findDVSname_prom,
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

            $scope.create = {
                id: "dvsCreate_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_create_button,
                tip: "",
                create: function () {
                    "use strict";
                    var data = null;
                    var title = $scope.i18n.resource_term_addDVS_button;
                    var newWindow = createWindow(data, title);
                    newWindow.show();
                }
            };

            $scope.operator = {
                "query": function () {
                    var queryConfig = constants.rest.DVS_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "name": $scope.searchModel.name, "hypervisorid": $scope.searchModel.hypervisorid}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            for (var index1 in response.dvses) {
                                var hostName = [];
                                var vssName = [];
                                for (var index2 in response.dvses[index1].vsses) {
                                    hostName.push(response.dvses[index1].vsses[index2].hostID);
                                    vssName.push(response.dvses[index1].vsses[index2].vssName);
                                }

                                var clusterName = [];
                                for (var key in response.dvses[index1].clusterIDsMapNames) {
                                    clusterName.push(response.dvses[index1].clusterIDsMapNames[key]);
                                }
                                response.dvses[index1].host = hostName.join(";");
                                response.dvses[index1].vss = vssName.join(";");
                                response.dvses[index1].clusterName = clusterName.join(";");
                                var dvsType = response.dvses[index1].dvsType;
                                if (dvsType) {
                                    response.dvses[index1].dvsTypeStr = $scope.i18n[constants.config.DVS_TYPE[dvsType.toUpperCase()]]
                                }
                            }
                            $scope.dvsTable.data = response.dvses;
                            $scope.dvsTable.totalRecords = response.total;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "delete": function (id) {
                    var deleteConfig = constants.rest.DVS_DELETE;
                    var deferred = camel.delete({
                        "url": {s: deleteConfig.url, o: {"id": id}},
                        "type": deleteConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.operator.query();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                //查询所有虚拟化环境
                "queryHypers": function () {
                    var deferred = camel.get({
                        "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/hypervisors", o: {"tenant_id": "1"}},
                        "type": "get",
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var hypervisors = response.hypervisors;
                        $scope.$apply(function () {
                            $scope.vmwareHyper = false;
                            for (var index in hypervisors) {
                                var hyper = {};
                                hyper.selectId = hypervisors[index].id;
                                hyper.label = hypervisors[index].name;
                                searchHyperList.push(hyper);
                                if (hypervisors[index].type.toUpperCase() == "VMWARE") {
                                    $scope.vmwareHyper = true;
                                }
                            }
                            $("#" + $scope.searchHyper.id).widget().option("values", searchHyperList);
                        });
                    });
                }
            };

            //打开时查询所有虚拟化环境
            $scope.operator.queryHypers();
            // 打开时请求数据
            $scope.operator.query();
        }];

        return dvsCtrl;
    });