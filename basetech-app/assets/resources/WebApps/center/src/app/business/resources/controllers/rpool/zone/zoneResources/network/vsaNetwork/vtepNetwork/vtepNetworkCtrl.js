define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/services/commonService",
    'fixtures/zoneFixture'],
    function (angular, Window, Message, constants, ExceptionService, CommonService) {
        "use strict";

        var vtepNetworkCtrl = ["$scope", "$compile", "$stateParams", "$state", "camel", "$rootScope", function ($scope, $compile, $stateParams, $state, camel, $rootScope) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            }
            /**
             * 初始化表格操作列
             * @param dataItem
             * @param row
             */
            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div>" +
                    "<a class='margin-right-beautifier' href='javascript:void(0)' ng-click='edit()'>" + $scope.i18n.common_term_modify_button + "</a>" +
                    "<a href='javascript:void(0)'ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>" +
                    "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.edit = function () {
                    $state.go("resources.modifyVtepNetwork", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName, "id": dataItem.vtepNetworkID})
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type": "confirm", //prompt,confirm,warn,error
                        "title": $scope.i18n.common_term_confirm_label,
                        "content": $scope.i18n.resource_vsa_delVTEPnet_info_confirm_msg,
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
                                $scope.operator.delete(dataItem.vtepNetworkID);
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
                $("td:eq(9)", row).html(optDom);
            };

            /**
             *  表格Scope
             */
            $scope.vtepTable = {
                data: [],
                id: "vtepTableId",
                columnsDraggable: true,
                enablePagination: false, //此属性设置表格是否分页
                enableFilter: false, // 此属性设置表格是否具有过滤功能.
                hideTotalRecords: true,
                showDetails: true,
                columns: [
                    {
                        "sTitle": "",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "60"
                    },
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
                            return $.encoder.encodeForHTML(data.vtepNetworkID);
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
                        "sTitle": "VLAN ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vlan);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_SubnetIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnetIP);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_SubnetMask_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnetMask);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_gateway_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.subnetGateway);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_associatedDVS_value,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.associatedDvs);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                },
                renderRow: function (row, dataitem, index) {
                    $('td:eq(8)', row).addTitle();
                    $(row).attr("zoneId", $.encoder.encodeForHTML($scope.zoneInfo.zoneID));
                    $(row).attr("vtepNetworkID", $.encoder.encodeForHTML(dataitem.vtepNetworkID));
                    $(row).attr("index", index);
                    if (!dataitem.discoverFlag && $scope.right.hasNetPoolOperateRight) {
                        // 操作列
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.refresh = {
                id: "vtepRefresh_id",
                refresh: function () {
                    "use strict";
                    $scope.operator.query();
                }
            };
            $scope.create = {
                id: "vtepCreateID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.resource_term_createVTEPnet_button || "创建VTEP网络",
                tip: "",
                create: function () {
                    $state.go("resources.addVtepNetwork", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName});
                }
            };

            $scope.operator = {
                "query": function () {
                    var queryConfig = constants.rest.VTEP_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        for (var index1 in response.vtepNetworks) {
                            var dvses = response.vtepNetworks[index1].dvses;
                            var dvsList = [];
                            for (var index in dvses) {
                                dvsList.push(dvses[index].name);
                            }
                            response.vtepNetworks[index1].associatedDvs = dvsList.join(";");
                            response.vtepNetworks[index1].operation = "";
                            response.vtepNetworks[index1].detail = {contentType: "url", content: "../src/app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vtepNetwork/vtepNetworkDetail.html"};
                        }
                        $scope.$apply(function () {
                            $scope.vtepTable.data = response.vtepNetworks;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "delete": function (id) {
                    var deleteConfig = constants.rest.VTEP_DELETE;
                    var deferred = camel.delete({
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
        }];

        return vtepNetworkCtrl;
    }
);