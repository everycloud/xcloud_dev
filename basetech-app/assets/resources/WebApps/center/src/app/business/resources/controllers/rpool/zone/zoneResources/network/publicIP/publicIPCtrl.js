define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/services/commonService",
    'fixtures/zoneFixture'],
    function (angular, Window, Message, constants, ExceptionService, CommonService, zoneFixture) {
        "use strict";

        var publicIPCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", "$rootScope", function ($scope, $stateParams, $compile, $state, camel, $rootScope) {

                $scope.zoneInfo = {
                    "zoneID": $stateParams.id,
                    "zoneName": $stateParams.name
                };

                /**
                 * 初始化表格操作列
                 * @param dataItem
                 * @param row
                 */
                var addOperatorDom = function (dataItem, row) {
                    // 名称加上弹出框
                    var name = "<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>";
                    var nameLink = $compile(name);
                    var nameScope = $scope.$new(false);
                    nameScope.name = $.encoder.encodeForHTML(dataItem.name);
                    nameScope.detail = function () {
                        var options = {
                            "winId": "detailWin",
                            "data": dataItem,
                            "title": nameScope.name,
                            "content-type": "url",
                            "content": "./app/business/resources/views/rpool/zone/zoneResources/network/publicIP/detail.html",
                            "height": 600,
                            "width": 900,
                            "resizable": true,
                            "maximizable": false,
                            "buttons": null
                        };
                        new Window(options).show();
                    }
                    var nameNode = nameLink(nameScope);
                    $("td:eq(0)", row).html(nameNode);
                    var optTemplates = "<div>" +
                        "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button + "</a>" +
                        "<a href='javascript:void(0)'ng-click='delete()' style='width:auto'>" + $scope.i18n.common_term_delete_button + "</a>" +
                        "</div>";

                    var scope = $scope.$new(false);
                    scope.data = dataItem;
                    scope.edit = function () {
                        var options = {
                            "winId": "modifyPublicIpWin",
                            "zoneName": $scope.zoneInfo.zoneName,
                            "zoneID": $scope.zoneInfo.zoneID,
                            "data": dataItem,
                            "publicIpPoolId": dataItem.publicIpPoolId,
                            "title": $scope.i18n.resource_term_modifyPublicIPpool_button,
                            "content-type": "url",
                            "content": "./app/business/resources/views/rpool/zone/zoneResources/network/publicIP/modifyPublicIP.html",
                            "height": 500,
                            "width": 850,
                            "resizable": true,
                            "maximizable": false,
                            "buttons": null,
                            "close": function () {
                                $scope.operator.query();
                            }
                        }
                        new Window(options).show();
                    };
                    scope.delete = function () {
                        var msgOptions = {
                            "type": "confirm", //prompt,confirm,warn,error
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.resource_pip_del_info_confirm_msg,
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
                                    $scope.operator.delete(dataItem.publicIpPoolId);
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
                    $("td:eq(6)", row).html(optDom);
                };

                /**
                 * 创建window
                 */
                var createWindow = function () {
                    var options = {
                        "winId": "createPublicIpWin",
                        "zoneName": $scope.zoneInfo.zoneName,
                        "zoneID": $scope.zoneInfo.zoneID,
                        "title": $scope.i18n.resource_term_createPublicIP_button,
                        "content-type": "url",
                        "content": "./app/business/resources/views/rpool/zone/zoneResources/network/publicIP/createPublicIP.html",
                        "height": 500,
                        "width": 850,
                        "resizable": true,
                        "maximizable": false,
                        "buttons": null,
                        "close": function () {
                            $scope.operator.query();
                        }
                    };

                    return new Window(options);
                };

                /**
                 *  表格Scope
                 */
                $scope.publicIPTable = {
                    caption: "",
                    data: [],
                    id: "publicIPTableId",
                    columnsDraggable: true,
                    enablePagination: false,
                    enableFilter: false,
                    hideTotalRecords: true,
                    showDetails: false,
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
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.publicIpPoolId);
                            },
                            "bSortable": false,
                            "sWidth": "15%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_IPsegment_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ipRange);
                            },
                            "bSortable": false,
                            "sWidth": "17%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false,
                            "sWidth": "15%"
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_assignIPnum_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allocation);
                            },
                            "bSortable": false,
                            "sWidth": "18%"
                        },
                        {
                            "sTitle": $scope.i18n.perform_term_publicIPusage_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.usage);
                            },
                            "bSortable": false,
                            "sWidth": "15%"
                        },
                        {
                            "sTitle": $scope.i18n.common_term_operation_label,
                            "mData": "",
                            "bSortable": false,
                            "sWidth": "15%"
                        }
                    ],
                    renderRow: function (row, dataitem, index) {
                        $('td:eq(1)', row).addTitle();
                        $('td:eq(2)', row).addTitle();
                        // 添加操作
                        if ($scope.right.hasNetPoolOperateRight) {
                            addOperatorDom(dataitem, row);
                        }
                    }
                };

                $scope.refresh = {
                    id: "publicIPRefresh_id",
                    refresh: function () {
                        "use strict";
                        $scope.operator.query();
                    }
                };
                $scope.create = {
                    id: "publicIPCreateID",
                    disabled: false,
                    iconsClass: "",
                    text: $scope.i18n.resource_term_createPublicIP_button,
                    tip: "",
                    create: function () {
                        "use strict";
                        var newWindow = createWindow();
                        newWindow.show();
                    }
                };

                $scope.operator = {
                    "query": function () {
                        var queryConfig = constants.rest.PUBLIC_IP_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID}},
                            "type": queryConfig.type,
                            "userId": $rootScope.user.id
                        })
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                // 获取数据
                                $scope.publicIPTable.data = response.publicIPPools;
                                for (var index in response.publicIPPools) {
                                    var ipRange = "";
                                    for (var i in response.publicIPPools[index].ipRangeList) {
                                        ipRange = ipRange + response.publicIPPools[index].ipRangeList[i].startIp + "-" + response.publicIPPools[index].ipRangeList[i].endIp + "; "
                                    }
                                    response.publicIPPools[index].ipRange = ipRange;
                                    var usages = response.publicIPPools[index].statPublicIPUsages;
                                    response.publicIPPools[index].usage = usages[0].usage + "(" + usages[0].total + ")," +
                                        usages[1].usage + "(" + usages[1].total + ")," +
                                        usages[2].usage + "(" + usages[2].total + ")";
                                    response.publicIPPools[index].allocation = response.publicIPPools[index].usedNum + "/" + response.publicIPPools[index].total;
                                }

                            })
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },

                    "delete": function (id) {
                        var deleteConfig = constants.rest.PUBLIC_IP_DELETE;
                        var deferred = camel.delete({
                            "dataType": "json",
                            "url": {s: deleteConfig.url, o: {"id": id}},
                            "type": "DELETE",
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
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

        return publicIPCtrl;
    }
)
;