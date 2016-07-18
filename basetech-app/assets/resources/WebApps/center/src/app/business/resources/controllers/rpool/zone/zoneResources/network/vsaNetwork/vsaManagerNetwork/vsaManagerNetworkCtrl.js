define(["tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    "app/services/commonService",
    'fixtures/zoneFixture'],
    function (angular, Window, Message, constants, ExceptionService, CommonService, zoneFixture) {
        "use strict";

        var vsaNetworkCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", '$rootScope', function ($scope, $stateParams, $compile, $state, camel, $rootScope) {
            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            };

            var addOperatorDom = function (dataItem, row) {
                var optTemplates = "<div>" +
                    "<a href='javascript:void(0)' ng-click='edit()' style='margin-right:10px; width:auto'>" + $scope.i18n.common_term_modify_button + "</a>" +
                    "<a href='javascript:void(0)'ng-click='delete()' style='width:auto'>" + $scope.i18n.common_term_delete_button + "</a>" +
                    "</div>";

                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.edit = function () {
                    $state.go("resources.modifyVsaMgnNetwork.navigation", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName, "id": dataItem.vsaManageNetworkID})
                };
                scope.delete = function () {
                    var msgOptions = {
                        "type": "confirm", 
                        "title": $scope.i18n.common_term_confirm_label,
                        "content": $scope.i18n.resource_vsa_del_info_confirm_msg,
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
                                $scope.operator.delete(dataItem.vsaManageNetworkID);
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

            $scope.vsaManagerTable = {
                caption: "",
                data: [],
                id: "vsaManagerTableId",
                columnsDraggable: true,
                enablePagination: false, 
                enableFilter: false, 
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
                        "sTitle":"ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vsaManageNetworkID);
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
                    $(row).attr("zoneId", $.encoder.encodeForHTML($scope.zoneInfo.zoneID));
                    $(row).attr("vsaManageNetworkID", $.encoder.encodeForHTML(dataitem.vsaManageNetworkID));
                    $(row).attr("index", index);
                    $('td:eq(2)', row).addTitle();
                    $('td:eq(3)', row).addTitle();
                    $('td:eq(8)', row).addTitle();
                    if ($scope.right.hasNetPoolOperateRight) {
                        addOperatorDom(dataitem, row);
                    }
                }
            };

            $scope.refresh = {
                id: "vsaManagerRefresh_id",
                refresh: function () {
                    "use strict";
                    $scope.operator.query();
                }
            };
            $scope.create = {
                id: "vsaManagerCreateID",
                text: $scope.i18n.resource_term_createVSAnet_button,
                create: function () {
                    $state.go("resources.addVsaMgnNetwork.navigation", {"zoneId": $scope.zoneInfo.zoneID, "zoneName": $scope.zoneInfo.zoneName});
                }
            };

            $scope.operator = {
                "query": function () {
                    var queryConfig = constants.rest.VSA_MANAGER_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID}},
                        "type": "GET",
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var vsaManageNetworks = response.vsaManageNetworks;
                        for (var index1 in vsaManageNetworks) {
                            var dvsList = [];
                            for (var key in vsaManageNetworks[index1].dvses) {
                                dvsList.push(vsaManageNetworks[index1].dvses[key].name);
                            }
                            vsaManageNetworks[index1].associatedDvs = dvsList.join(";");
                            vsaManageNetworks[index1].detail = {contentType: "url", content: "../src/app/business/resources/views/rpool/zone/zoneResources/network/vsaNetwork/vsaManagerNetwork/vsaMgnNetworkDetail.html"};
                        }
                        $scope.$apply(function () {
                            $scope.vsaManagerTable.data = vsaManageNetworks;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "delete": function (id) {
                    var deleteConfig = constants.rest.VSA_MANAGER_DELETE;
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

            $scope.operator.query();
        }];

        return vsaNetworkCtrl;
    });
