/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "tiny-lib/underscore",
    "app/business/network/services/networkService",
    'app/services/competitionConfig'
], function ($, Window, Message, bootstrap, _, networkService, competitionConfig) {
    "use strict";

    var networkCtrl = ["$rootScope", "$scope", "$compile", "camel", "$state", "$q", "networkCommon", "exception",
        function ($rootScope, $scope, $compile, camel, $state, $q, networkCommon, exception) {
            var user = $rootScope.user;
            var NETWORK_OPERATE = "555002";
            var privilegeList = user.privilegeList;
            $scope.hasNetworkOperateRight = _.contains(privilegeList, NETWORK_OPERATE);

            $scope.cloudInfraId = networkCommon && networkCommon.cloudInfraId;
            $scope.vpcId = networkCommon && networkCommon.vpcId;
            $scope.azId = networkCommon && networkCommon.azId;
            $scope.vmwareICT = competitionConfig.isBaseOnVmware;

            //公共VPC需要屏蔽掉网络的相关操作
            $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
            $scope.serviceInstance = new networkService(exception, $q, camel);

            $scope.openstack = user.cloudType === "ICT";
            var i18n = $scope.i18n;
            $scope.help = {
                "helpKey": "drawer_vpc_net",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };
            $scope.refresh = function () {
                getData();
            };
            //创建按钮
            $scope.createButton = {
                "id": "createNetworkButton",
                "disable": false,
                "text": i18n.common_term_create_button,
                "click": function () {
                    createWindow();
                }
            };
            //创建弹框
            var createWindow = function () {
                var options = {
                    "winId": "createNetworkWindow",
                    "title": i18n.vpc_term_createNet_button,
                    "vpcId": $scope.vpcId,
                    "vdcId": user.vdcId,
                    "infraId": $scope.cloudInfraId,
                    "content-type": "url",
                    "content": "app/business/network/views/vmwareVpc/createNetwork.html",
                    "height": 350,
                    "width": 500,
                    "resizable": true,
                    "maximizable": false,
                    "buttons": null,
                    "close": function () {
                        getData();
                    }
                };
                var newWindow = new Window(options);
                newWindow.show();
            };
            //网络列表
            $scope.networkTable = {
                "id": "vmwareNetworkTable",
                "data": [],
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [{
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "10%"
                }, {
                    "sTitle": "vlan",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vlan);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_SubnetIP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ipv4Subnet.subnetAddr);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_SubnetMask_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ipv4Subnet.subnetPrefix);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_gateway_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ipv4Subnet.gateway);
                    },
                    "bSortable": false
                }],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();

                    addOperatorDom(aData, nRow);
                }
            };
            //操作列结构
            function addOperatorDom(aData, nRow) {
                var optColumn = "<div><a href='javascript:void(0)' ng-click='deleter()'>" + i18n.common_term_delete_button + "</a></div>";

                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.deleter = function () {
                    showMessage("您确认要删除该网络吗？", function () {
                        deleteNetwork(aData.id);
                    });
                };
                var optNode = optLink(optScope);
                $("td:eq(5)", nRow).html(optNode);
            }

            function showMessage(content, action) {
                var options = {
                    "type": "confirm",
                    "content": content,
                    "height": "150px",
                    "width": "350px",
                    "buttons": [{
                        "label": i18n.common_term_ok_button,
                        "default": true,
                        majorBtn : true,
                        "handler": function () {
                            action();
                            msg.destroy();
                        }
                    }, {
                        "label": i18n.common_term_cancle_button,
                        "default": false,
                        "handler": function () {
                            msg.destroy();
                        }
                    }]
                };
                var msg = new Message(options);
                msg.show();
            }

            function deleteNetwork(networkId) {
                var options = {
                    "vdcId": user.vdcId,
                    "vpcId": $scope.vpcId,
                    "cloudInfraId": $scope.cloudInfraId,
                    "id": networkId,
                    "userId": user.id
                };
                var promise = $scope.serviceInstance.deleteNovaNetwork(options);
                promise.then(function (data) {
                    getData();
                });
            }

            function getData() {
                var options = {
                    "vdcId": user.vdcId,
                    "vpcId": $scope.vpcId,
                    "cloudInfraId": $scope.cloudInfraId,
                    "userId": user.id
                };
                var promise = $scope.serviceInstance.queryNovaNetwork(options);
                promise.then(function (data) {
                    var networks = data && data.osNetworkList || [];
                    $scope.networkTable.data = networks;
                    $("#" + $scope.networkTable.id).widget().option("data", networks);
                });
            }
            if ($scope.hasNetworkOperateRight) {
                $scope.networkTable.columns.push({
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "name",
                    "bSortable": false
                });
            }
            getData();
        }
    ];
    return networkCtrl;
});
