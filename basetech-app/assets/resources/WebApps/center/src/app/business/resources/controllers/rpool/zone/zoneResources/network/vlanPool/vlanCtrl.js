define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/Searchbox',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/services/commonService",
    'fixtures/zoneFixture'],
    function ($, angular, Searchbox, Window, Message, constants, ExceptionService, CommonService, zoneFixture) {
        "use strict";

        var vlanCtrl = ["$scope", "$compile", "$stateParams", 'camel', '$rootScope', function ($scope, $compile, $stateParams, camel, $rootScope) {

                $scope.zoneInfo = {
                    "zoneID": $stateParams.id,
                    "zoneName": $stateParams.name
                };

                $scope.searchModel = {
                    "name": "",
                    "start": 0,
                    "limit": 10
                };
                /**
                 * 初始化vlan池表格的操作列
                 * @param dataItem
                 * @param row
                 */
                var addOperatorDom = function (dataItem, row) {
                    if (dataItem.usage.toLowerCase() == "management") {
                        var submenus = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    }
                    else {
                        var submenus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                            '<li><a href="javascript:void(0)" ng-click="associateDVS()">' + $scope.i18n.resource_term_associateDVS_button + '</a></li>' +
                            '<li><a href="javascript:void(0)" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                            '</ul>' +
                            '</span>';
                    }
                    var optTemplates = "<div><a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto;display:inline-block;'>" + $scope.i18n.common_term_modify_button + "</a>" + submenus + "</div>";

                    var scope = $scope.$new(false);
                    scope.data = dataItem;
                    scope.edit = function () {
                        var modifyVlanPoolWindow = new Window({
                            "winId": "modifyVlanPoolWin",
                            "title": $scope.i18n.common_term_modify_button,
                            "minimizable": false,
                            "maximizable": false,
                            "zoneName": $scope.zoneInfo.zoneName,
                            "vlanPoolId": dataItem.id,
                            "name": dataItem.name,
                            "description": dataItem.description,
                            "content-type": "url",
                            "content": "../src/app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/modifyVlanPool.html",
                            "height": 360,
                            "width": 640,
                            "buttons": null
                        }).show();
                    };
                    scope.delete = function () {
                        var msgOptions = {
                            "type": "confirm", //prompt,confirm,warn,error
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.resource_vlan_del_info_confirm_msg,
                            "width": "300",
                            "height": "200"
                        };

                        var msgBox = new Message(msgOptions);

                        var buttons = [
                            {
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: 'Y',
                                majorBtn: true,
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
                    scope.associateDVS = function () {
                        var dvsIDList = [];
                        for (var index in dataItem.dvses) {
                            dvsIDList.push(dataItem.dvses[index].id);
                        }
                        var associateDVSWindow = new Window({
                            "winId": "associateDVSWin",
                            "title": $scope.i18n.resource_term_associateDVS_button,
                            "minimizable": false,
                            "maximizable": false,
                            "vxlan": dataItem.vxLanFlag,
                            "vlanPoolId": dataItem.id,
                            "name": dataItem.name,
                            "zoneId": $scope.zoneInfo.zoneID,
                            "dvsIDs": dvsIDList,
                            "content-type": "url",
                            "content": "../src/app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/associateDVS.html",
                            "height": 420,
                            "width": 700,
                            "buttons": null
                        }).show();
                    };

                    var optDom = $compile($(optTemplates))(scope);
                    $("td:eq(8)", row).html(optDom);
                    optDom.find('.dropdown').dropdown();
                };

                /**
                 * 创建VLAN池
                 */
                var createWindow = function () {
                    var options = {
                        "winId": "createVlanPoolWinID",
                        "zoneName": $scope.zoneInfo.zoneName,
                        "zoneID": $scope.zoneInfo.zoneID,
                        "title": $scope.i18n.resource_term_addVLANpool_button,
                        "content-type": "url",
                        "content": "./app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/createVlanPool.html",
                        "height": 490,
                        "width": 720,
                        "resizable": true,
                        "maximizable": false,
                        "buttons": null
                    };
                    return new Window(options);
                };

                $scope.vlanPoolTable = {
                    data: [],
                    id: "vlanPoolTableId",
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
                            "sWidth": "8%"
                        },
                        {
                            "sTitle":"ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false,
                            "sWidth": "8%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.type);
                            },
                            "bSortable": false,
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_useScene_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.usageStr);
                            },
                            "bSortable": false,
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_initiativeVALN_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.startID);
                            },
                            "bSortable": false,
                            "sWidth": "8%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_endVLAN_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.endID);
                            },
                            "bSortable": false,
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": $scope.i18n.resource_term_associatedDVS_value,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.associatedDVS);
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
                    callback: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    changeSelect: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.vlanPoolTable.displayLength = evtObj.displayLength;
                        $scope.operator.query();
                    },
                    renderRow: function (row, dataitem, index) {
                        // 添加操作
                        if ($scope.right.hasNetPoolOperateRight) {
                            addOperatorDom(dataitem, row);
                        }
                    }
                };

                $scope.refresh = {
                    id: "vlanPoolRefresh_id",
                    refresh: function () {
                        $scope.operator.query();
                    }
                };

                $scope.searchBox = {
                    "id": "vlanPoolSearchBox",
                    "placeholder": $scope.i18n.resource_term_findVLANpool_prom,
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
                    id: "vlanPoolCreate_id",
                    text: $scope.i18n.common_term_create_button,
                    create: function () {
                        "use strict";
                        var newWindow = createWindow();
                        newWindow.show();
                    }
                };

                $scope.operator = {
                    "query": function () {
                        var queryConfig = constants.rest.VLAN_POOL_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "start": $scope.searchModel.start, "limit": $scope.searchModel.limit, "name": $scope.searchModel.name}},
                            "type": queryConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                for (var index1 in response.vlanpools) {
                                    if (response.vlanpools[index1].vxLanFlag) {
                                        response.vlanpools[index1].type = "VXLAN";
                                    }
                                    else {
                                        response.vlanpools[index1].type = "VLAN";
                                    }
                                    var usage = response.vlanpools[index1].usage.toLowerCase();
                                    response.vlanpools[index1].usageStr = $scope.i18n[constants.config.VLAN_USAGE[usage]];
                                    var dvsList = [];
                                    for (var index2 in response.vlanpools[index1].dvses) {
                                        dvsList.push(response.vlanpools[index1].dvses[index2].name);
                                    }
                                    response.vlanpools[index1].associatedDVS = dvsList.join(";");
                                }
                                $scope.vlanPoolTable.data = response.vlanpools;
                                $scope.vlanPoolTable.totalRecords = response.total;
                            });
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    "delete": function (id) {
                        var deleteConfig = constants.rest.VLAN_POOL_DELETE;
                        var deferred = camel.delete({
                            "url": {s: deleteConfig.url, o: {"id": id}},
                            "type": deleteConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.searchModel.start = 0;
                            $scope.searchModel.limit = $scope.vlanPoolTable.displayLength;
                            $scope.operator.query();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                };

                // 打开时请求数据
                $scope.operator.query();
            }
            ]
            ;

        return vlanCtrl;
    })
;