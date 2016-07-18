/**
 */
define(["tiny-lib/angular",
    'tiny-common/UnifyValid',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/services/commonService",
    'fixtures/zoneFixture'],
    function (angular, UnifyValid, Window, Message, constants, ExceptionService, CommonService) {
        "use strict";
        var vxlanPoolCtrl = ["$scope", "$compile", "$stateParams", "camel", "$rootScope", function ($scope, $compile, $stateParams, camel, $rootScope) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            }

            /**
             * 初始化vxlan组播池表格的操作列
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                // 名称加上弹出框
                var usage = "<a href='javascript:void(0)' ng-click='detail()'>{{usage}}</a>";
                var usageLink = $compile(usage);
                var usageScope = $scope.$new();
                usageScope.usage = $.encoder.encodeForHTML(dataItem.usage);
                usageScope.detail = function () {
                    var title = usageScope.usage + $scope.i18n.common_term_assignInfo_label;
                    var window = allocationWindow(dataItem.multicastIPPoolID, title);
                    window.show();
                }
                var usageNode = usageLink(usageScope);
                $("td:eq(5)", row).html(usageNode);
                if ($scope.right.hasNetPoolOperateRight) {
                    var optTemplates = "<a href='javascript:void(0)' ng-click='edit()' class='margin-right-beautifier'>" + $scope.i18n.common_term_modify_button +
                        "</a><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a></div>";
                    var scope = $scope.$new(false);
                    scope.edit = function () {
                        var title = $scope.i18n.resource_term_modifyMulticastIPpool_button;
                        var newWindow = createWindow(dataItem, title);
                        newWindow.show();
                    };
                    scope.delete = function () {
                        var msgOptions = {
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.resource_vlan_delVXLANmulticastIP_info_confirm_msg,
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
                                    $scope.operate.delete(dataItem.multicastIPPoolID);
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
                }
            };

            /**
             * 创建VXLAN组播IP池
             */
            var createWindow = function (data, title) {
                var options = {
                    "winId": "mutiCastIpPoolWinID",
                    "zoneName": $scope.zoneInfo.zoneName,
                    "zoneID": $scope.zoneInfo.zoneID,
                    "data": data,
                    "title": title,
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/addMulticastIpPool.html",
                    "height": 420,
                    "width": 700,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null,
                    "close": function () {
                        $scope.operate.query();
                    }
                };
                return new Window(options);
            };
            /**
             *查看组播IP池分配使用情况
             */
            var allocationWindow = function (id, title) {
                var options = {
                    "winId": "allocationInfoWin",
                    "multicastippoolid": id,
                    "title": title,
                    "content-type": "url",
                    "content": "./app/business/resources/views/rpool/zone/zoneResources/network/vlanPool/allocationInfo.html",
                    "height": 450,
                    "width": 700,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null
                };
                return new Window(options);
            };
            $scope.mutiCastipPoolTable = {
                caption: "",
                data: [],
                id: "mutiCastipPoolTableId",
                columnsDraggable: true,
                enablePagination: false,
                enableFilter: false,
                totalRecords: 0,
                hideTotalRecords: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.multicastIPPoolID);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_initiativeIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startIP);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_endIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.endIP);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_usageStatistic_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.usage);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false,
                        "sWidth": 150
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.refresh = {
                id: "mutiCastipPoolRefresh_id",
                refresh: function () {
                    $scope.operate.query();
                }
            };

            $scope.create = {
                id: "addMutiCastipPoolId",
                disabled: false,
                text: $scope.i18n.resource_term_addMulticastIPpool_button,
                create: function () {
                    "use strict";
                    var data = null;
                    var title = $scope.i18n.resource_term_addMulticastIPpool_button;
                    var newWindow = createWindow(data, title);
                    newWindow.show();
                }
            };
            $scope.operate = {
                "query": function () {
                    var queryConfig = constants.rest.MULTICAST_IPPOOLS_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var multicastIPPools = response.multicastIPPools;
                        $("#" + $scope.create.id).widget().option("disable", multicastIPPools.length >= 8)
                        for (var index in multicastIPPools) {
                            var ipPool = multicastIPPools[index];
                            multicastIPPools[index].usage = ipPool.totalUsedIPs + "/" + ipPool.totalIPs;
                        }
                        $scope.$apply(function () {
                            $scope.mutiCastipPoolTable.data = response.multicastIPPools;
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "delete": function (id) {
                    var deleteConfig = constants.rest.MULTICAST_IPPOOLS_DELETE;
                    var deferred = camel.delete({
                        "url": {s: deleteConfig.url, o: {"id": id}},
                        "type": deleteConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.operate.query();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }

            }
            $scope.operate.query();
        }];
        return vxlanPoolCtrl;
    })
;