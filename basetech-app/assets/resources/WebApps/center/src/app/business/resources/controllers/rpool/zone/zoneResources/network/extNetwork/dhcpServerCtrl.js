define(["tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/services/exceptionService"],
    function (angular, constants, Window, Message, ExceptionService) {
        "use strict";

        var dhcpServerCtrl = ["$scope", "$stateParams", "camel", "$rootScope", "$interval", function ($scope, $stateParams, camel, $rootScope, $interval) {

            $scope.zoneInfo = {
                "zoneID": $stateParams.id,
                "zoneName": $stateParams.name
            }
            $scope.i18n = $("html").scope().i18n;
            //dhcp服务器信息
            $scope.dhcpInfo = {};
            //是否有DHCP服务器
            $scope.hasDhcp = false;

            //是否可以修改
            $scope.canModify = false;
            //是否可以删除
            $scope.canDelete = false;

            //修改DHCP服务器
            $scope.modifyBtn = {
                id: "modifyDhcpServerId",
                disabled: !$scope.canModify,
                text: $scope.i18n.resource_term_modifyDHCPserver_button || "修改DHCP服务器",
                click: function () {
                    "use strict";
                    $scope.operator.modifyDhcpWin();
                }
            };
            $scope.deleteBtn = {
                id: "deleteDhcpServerId",
                disabled: !$scope.canDelete,
                text: $scope.i18n.resource_term_delDHCPserver_button || "删除DHCP服务器",
                click: function () {
                    "use strict";
                    var msgOptions = {
                        "type": "confirm", //prompt,confirm,warn,error
                        "title": $scope.i18n.common_term_tip_label || "提示",
                        "content": $scope.i18n.resource_dhcp_delDHCPserver_info_confirm_msg || "确实要删除该DHCP服务器吗？",
                        "width": "300",
                        "height": "200",
                        "close": function () {
                            $scope.operator.queryDhcpServer();
                        }
                    };

                    var msgBox = new Message(msgOptions);
                    var buttons = [
                        {
                            label: $scope.i18n.common_term_ok_button || '确定',
                            accessKey: 'Y',
                            majorBtn: true,
                            default: true,
                            handler: function (event) {
                                $scope.operator.deleteDhcpServer($scope.dhcpInfo.dhcpServerID);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button || '取消',
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ];
                    msgBox.option("buttons", buttons);
                    msgBox.show();
                }
            };

            $scope.refresh = {
                id: "refreshDhcpServerId",
                click: function () {
                    "use strict";
                    $scope.operator.queryDhcpServer();
                }
            };
            $scope.name = {
                "label": $scope.i18n.common_term_name_label + ":" || "名称:"
            }
            $scope.ID={
                "label":"ID:"
            }
            $scope.status = {
                "label": $scope.i18n.common_term_status_label + ":" || "状态:"
            }
            $scope.DVS = {
                "label": "DVS:"
            }
            $scope.cluster = {
                "label": $scope.i18n.virtual_term_cluster_label + ":" || "资源集群:"
            }
            $scope.dhcpIp = {
                "label": $scope.i18n.common_term_DHCPservice_label + "IP:" || "DHCP服务 IP:"
            };
            $scope.subnetMask = {
                "label": $scope.i18n.common_term_SubnetMask_label + ":" || "子网掩码:"
            };
            $scope.gateway = {
                "label": $scope.i18n.common_term_gateway_label + ":" || "网关:"
            };
            $scope.vlan = {
                "label": "VLAN ID:"
            };
            /**
             * 定时器句柄
             */
            $scope.promise = undefined;
            $scope.operator = {
                createDhcpServerWin: function () {
                    var options = {
                        "winId": "createDhcpServerWin",
                        "title": $scope.i18n.resource_term_addDHCPserver_button || "创建DHCP服务器",
                        "zoneId": $scope.zoneInfo.zoneID,
                        "content-type": "url",
                        "content": "./app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/createDhcpServer.html",
                        "height": 600,
                        "width": 800,
                        "minimizable": false,
                        "maximizable": false,
                        "buttons": null,
                        "close": function () {
                            $scope.operator.queryDhcpServer();
                        }
                    };
                    var window = new Window(options);
                    window.show();
                },
                modifyDhcpWin: function () {
                    var options = {
                        "winId": "modifyDhcpServerWin",
                        "title": $scope.i18n.resource_term_modifyDHCPserver_button || "修改DHCP服务器",
                        "content-type": "url",
                        "content": "./app/business/resources/views/rpool/zone/zoneResources/network/extNetwork/modifyDhcpServer.html",
                        "dhcpServerID": $scope.dhcpInfo.dhcpServerID,
                        "dhcpServerIP": $scope.dhcpInfo.dhcpServerIPv4Config.dhcpServerIP,
                        "prefix": $scope.dhcpInfo.dhcpServerIPv4Config.prefix,
                        "gateway": $scope.dhcpInfo.dhcpServerIPv4Config.gateway,
                        "height": 450,
                        "width": 600,
                        "minimizable": false,
                        "maximizable": false,
                        "buttons": null,
                        "close": function () {
                            $scope.operator.queryDhcpServer();
                        }
                    };
                    var window = new Window(options);
                    window.show();
                },
                queryDhcpServer: function () {
                    var queryConfig = constants.rest.DHCP_SERVER_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID}},
                        "userId": $rootScope.user.id,
                        "monitor": true
                    });
                    deferred.done(function (response) {
                        if (response && response.dhcpServers) {
                            $scope.$apply(function () {
                                $scope.hasDhcp = true;
                                $scope.dhcpInfo = response.dhcpServers[0];
                                $scope.dhcpInfo.statusStr = $scope.i18n[constants.config.DHCP_SERVER_STATUS[$scope.dhcpInfo.status]] || $scope.dhcpInfo.status;
                                $scope.canModify = ($scope.dhcpInfo.status == 'READY' || $scope.dhcpInfo.status == 'MODIFYFAIL');
                                $scope.canDelete = ($scope.dhcpInfo.status == 'READY' || $scope.dhcpInfo.status == 'FAIL' || $scope.dhcpInfo.status == 'REPAIRFAIL' || $scope.dhcpInfo.status == 'MODIFYFAIL');
                                setTimeout(function () {
                                    $("#" + $scope.modifyBtn.id).widget().option("disable", !$scope.canModify);
                                    $("#" + $scope.deleteBtn.id).widget().option("disable", !$scope.canDelete);
                                }, 50);

                            })
                        }
                        else {
                            $scope.$apply(function () {
                                $scope.hasDhcp = false;
                            })
                        }
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                deleteDhcpServer: function (id) {
                    var delConfig = constants.rest.DHCP_SERVER_DELETE
                    var deferred = camel.delete({
                        "url": {s: delConfig.url, o: {"id": id}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.operator.queryDhcpServer();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operator.queryDhcpServer();
        }];

        return dhcpServerCtrl;
    }
)
;