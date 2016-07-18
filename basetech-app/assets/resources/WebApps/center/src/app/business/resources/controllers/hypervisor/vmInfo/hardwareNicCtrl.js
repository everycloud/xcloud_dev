/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, bootstrap, Exception) {
    "use strict";

    var nicCtrl = ["$scope", "$stateParams", "$compile", "camel", function ($scope, $stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_advance_value && ($stateParams.isVsa !== "true");
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        var maxNicNum = {
            "fusioncompute": 12,
            "vmware": 10,
            "openstack": 16
        };
        var netTypes = {
            EXTERNAL: $scope.i18n.resource_term_externalNet_label || "外部网络",
            ORG_EXTERNAL: $scope.i18n.vpc_term_directConnectNet_label || "直连网络",
            ORG_INTERNAL: $scope.i18n.vpc_term_innerNet_label || "内部网络",
            VSA_MANAGER_NETWORK: $scope.i18n.resource_term_vsaNet_label || "VSA管理网络",
            VSA_OPERATION_NETWORK: $scope.i18n.resource_term_vsaServiceNet_label || "VSA业务网络",
            ROUTED_NETWORK: $scope.i18n.vpc_term_routerNet_label || "路由网络",
            UNKNOWN: $scope.i18n.common_term_unknown_value || "未知"
        };

        //添加按钮
        $scope.nicAddButton = {
            "id": "nicAddButton",
            "text": $scope.i18n.common_term_add_button || "添加",
            "click": function () {
                addNicWindow();
            }
        };
        $scope.refresh = function () {
            getData();
        };

        //网卡列表
        $scope.nicTable = {
            "id": "hardwareNicTable",
            "data": null,
            "showDetails": {
                "colIndex": 0,
                "domPendType": "append"
            },
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_NIC_label || "网卡",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_netName_label || "网络名称",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.portGroupName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.vpc_term_netType_label || "网络类型",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.netType);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_IP_label || "IP地址",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("nicId",$.encoder.encodeForHTML("" + aData.id));
                $(nRow).attr("ip",$.encoder.encodeForHTML("" + aData.ip));
                $(nRow).attr("mac",$.encoder.encodeForHTML("" + aData.mac));
                $(nRow).attr("ipStatus",$.encoder.encodeForHTML("" + aData.ipCheckResult));
                $(nRow).attr("sg",$.encoder.encodeForHTML(aData.sgName?"" + aData.sgName:""));
                $('td:eq(0)', nRow).html("");

                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                if (!$scope.operable) {
                    return;
                }
                // 操作列
                var subMenus = '';
                if ($scope.vmType !== "vmware" && $scope.vpcId > 0) {
                    subMenus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + ($scope.i18n.common_term_more_button || "更多") + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                    if (aData.sgId <= 0) {
                        subMenus += '<li><a tabindex="1" ng-click="joinSg()">' + ($scope.i18n.vm_term_addToSecurGroup_button || "加入安全组") + '</a></li>';
                    }
                    else {
                        subMenus += '<li class="disabled"><a tabindex="1">' + ($scope.i18n.vm_term_addToSecurGroup_button || "加入安全组") + '</a></li>';
                    }
                    if (aData.sgId > 0) {
                        subMenus += '<li><a tabindex="2" ng-click="quitSg()">' + ($scope.i18n.security_term_quitSecuGroup_button || "退出安全组") + '</a></li>';
                    }
                    else {
                        subMenus += '<li class="disabled"><a tabindex="2">' + ($scope.i18n.security_term_quitSecuGroup_button || "退出安全组") + '</a></li>';
                    }
                    subMenus += '<li class="divider-line"></li>' +
                        '<li><a tabindex="3" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                        '</ul>' +
                        '</span>';
                }
                else {
                    subMenus = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                }
                var optColumn = "";
                if (aData.vmStatus === "stopped") {
                    optColumn = "<div><a href='javascript:void(0)' ng-click='edit()'>" + $scope.i18n.common_term_modify_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
                }
                else {
                    optColumn = "<div><a href='javascript:void(0)' class='disabled'>" + $scope.i18n.common_term_modify_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
                }
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.edit = function () {
                    addNicWindow(aData.id, aData.name, aData.mac, aData.networkType);
                };
                optScope.joinSg = function () {
                    joinSgWindow(aData.id);
                };
                optScope.quitSg = function () {
                    quitSgMessage(aData);
                };
                optScope.delete = function () {
                    deleteMessage(aData.id);
                };

                var optNode = optLink(optScope);
                $("td:eq(5)", nRow).html(optNode);
                optNode.find('.dropdown').dropdown();
            }
        };
        function deleteMessage(idStr) {
            var options = {
                type: "confirm",
                content: $scope.i18n.vm_nic_del_info_confirm_msg || "您确认要删除网卡吗？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            deleteNic(idStr);
                            msg.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function quitSgMessage(aData) {
            var options = {
                type: "confirm",
                content: $scope.i18n.security_group_moveNIC_info_confirm_msg || "您确认将网卡退出安全组吗？",
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            quitSg(aData.id, aData.sgId);
                            msg.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function joinSgWindow(nicId) {
            var newWindow = new Window({
                "winId": "joinSgWindow",
                "title": $scope.i18n.vm_term_addToSecurGroup_button || "加入安全组",
                "content-type": "url",
                "vpcId": $scope.vpcId,
                "nicId": nicId,
                "vmId": $scope.vmId,
                "buttons": null,
                "modal": true,
                "content": "app/business/resources/views/hypervisor/vmInfo/joinSg.html",
                "height": 400,
                "width": 700,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }

        function addNicWindow(nicId, nicName, nicMac, networkType) {
            var option = {
                "winId": "addNicWindow",
                "title": $scope.i18n.vm_term_addNIC_button || "添加网卡",
                "content-type": "url",
                "vpcId": $scope.vpcId,
                "clusterId": $scope.clusterId,
                "zoneId": $scope.zoneId,
                "vmId": $scope.vmId,
                "nicId": nicId,
                "nicName": nicName,
                "nicMac": nicMac,
                "networkType": networkType,
                "vmType": $scope.vmType,
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/vmInfo/addNic.html",
                "height": 500,
                "width": 800,
                "close": $scope.refresh
            };
            if (nicId) {
                option.title = ($scope.i18n.vm_term_modifyNIC_button || "修改网卡");
            }
            var newWindow = new Window(option);
            newWindow.show();
        }

        function getData() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{id}", o: {id: $scope.vmId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var vmInfo = data && data.vmInfo;
                $scope.vpcId = vmInfo.vpcId;
                $scope.clusterId = vmInfo.clusterId;
                $scope.zoneId = vmInfo.zone;
                $scope.vmId = vmInfo.id;
                $scope.vmType = vmInfo.vmType;
                $scope.status = vmInfo.status;
                if ($("#vmInfoHardwareTable").widget() && $scope.hardwareTable.data) {
                    $scope.hardwareTable.data[3].summary = vmInfo.vmConfig.nics.length + ($scope.i18n.common_term_entry_label || "个");
                    $("#vmInfoHardwareTable").widget().option("data", $scope.hardwareTable.data);
                }
                var nics = vmInfo.vmConfig.nics || [];
                for (var i = 0; i < nics.length; i++) {
                    nics[i].detail = {
                        "contentType": "url",
                        "content": "app/business/resources/views/hypervisor/vmInfo/nicDetail.html"
                    };
                    nics[i].netType = netTypes[nics[i].networkType] || nics[i].networkType;
                    nics[i].vmStatus = vmInfo.status;
                    for (var k = 0; nics[i].ips6 && k < nics[i].ips6.length; k++) {
                        nics[i].ip = nics[i].ip + ";" + nics[i].ips6[k];
                    }
                }
                if (nics.length >= maxNicNum[$scope.vmType]) {
                    $("#" + $scope.nicAddButton.id).widget().option("disable", true);
                }
                $scope.$apply(function () {
                    $scope.nicTable.data = nics;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function deleteNic(nicId) {
            var deferred = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/irm/1/vms/{id}/nics/{nic_id} ",
                    o: {id: $scope.vmId, nic_id: nicId}
                },
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function quitSg(nicId, sgId) {
            var params = {
                removeVMFromSG: {
                    vmID: $scope.vmId,
                    nicID: nicId,
                    sgID: sgId
                }
            };
            var deferred = camel.post({
                "url": {s: "/goku/rest/v1.5/irm/1/vpcs/{vpcId}/securitygroups/action", o: {vpcId: $scope.vpcId}},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        if ($scope.operable) {
            $scope.nicTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false
                });
        }
        getData();
    }];
    return nicCtrl;
});
