/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-widgets/Radio",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, Select, Radio, httpService, validatorService, UnifyValid, Exception) {
        "use strict";

        var addNicCtrl = ["$scope", "$compile", "validator", "camel", function ($scope, $compile, validator, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#addNicWindow").widget();
            var vpcId = window.option("vpcId");
            var clusterId = window.option("clusterId");
            var zoneId = window.option("zoneId");
            var vmId = window.option("vmId");
            var nicId = window.option("nicId");
            var nicName = window.option("nicName");
            var nicMac = window.option("nicMac");
            var networkType = window.option("networkType");
            $scope.vmType = window.option("vmType");
            var selectedId;
            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "require": false,
                "id": "addNicNameTextbox",
                "value": "",
                "disable": $scope.vmType === "vmware",
                "validate":
                    "maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符") +
                     ";regularCheck(" + validator.vmNameCharReg + "):" + $scope.i18n.common_term_composition7_valid
            };
            //MAC单选组
            $scope.macRadio = {
                "id": "addNicRadio",
                "require": true,
                "layout": "horizon",
                "label": "MAC:",
                "values": [
                    {
                        "key": "1",
                        "text": $scope.i18n.common_term_autoAllocation_label || "自动分配",
                        "checked": true,
                        "disable": $scope.vmType === "vmware"
                    },
                    {
                        "key": "2",
                        "text": $scope.i18n.vm_term_designationMAC_label || "指定MAC",
                        "disable": $scope.vmType === "vmware"
                    }
                ],
                "change": function () {
                    var result = $("#" + $scope.macRadio.id).widget().opChecked("2");
                    $("#" + $scope.macTextbox.id).widget().option("disable", !result);
                }
            };
            //MAC输入框
            $scope.macTextbox = {
                "label": "",
                "require": false,
                "disable": true,
                "id": "addNicMacTextbox",
                "value": "",
                "validate":
                    "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                    ";regularCheck(" + validator.macRe + "):"+ ($scope.i18n.common_term_formatMAC_valid || "请输入正确的MAC地址。")
            };
            //网络列表
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            $scope.networkTable = {
                "id": "selectNetworkTable",
                "label": ($scope.i18n.vm_term_chooseNet_label || "选择网络") + ":",
                "require": true,
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
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
                        "sTitle": $scope.i18n.vm_nic_add_para_bondNumLeft_label || "还可绑定网卡数",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.freeNicNum);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getNetwork();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.networkTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.networkTable.displayLength = pageInfo.displayLength;
                    getNetwork();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //单选框
                    var options = {
                        "id": "networkRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#networkRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#networkRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "addNicOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var networkTable = $("#" + $scope.networkTable.id).widget();
                    var data = networkTable.option("data");
                    selectedId = null;
                    for (var i = 0; i < networkTable.options.data.length; i++) {
                        var checked = $("#networkRadio_" + i).widget().option("checked");
                        if (checked) {
                            if (vpcId && vpcId > 0) {
                                selectedId = data[i].networkID;
                            }
                            else {
                                selectedId = data[i].exnetworkID;
                            }
                            break;
                        }
                    }
                    if (!selectedId) {
                        return;
                    }
                    if (nicId) {
                        editNic();
                    }
                    else {
                        addNic();
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addNicCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getNetByVpc() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/vpcs/{vpcid}/networks?start={start}&limit={limit}&status=0",
                        o: {vpcid: vpcId,start: searchInfo.start, limit: searchInfo.limit}
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var nets = data && data.networks || [];
                    for (var i = 0; i < nets.length; i++) {
                        nets[i].type = nets[i].directNetwork? ($scope.i18n.vpc_term_directConnectNet_label || "直连网络"):($scope.i18n.vpc_term_innerNet_label || "内部网络");
                        nets[i].type = nets[i].routed?($scope.i18n.vpc_term_routerNet_label || "路由网络"):nets[i].type;
                        nets[i].freeNicNum = 512 - nets[i].totalBoundNics;
                    }
                    $scope.$apply(function () {
                        $scope.networkTable.totalRecords = data.total;
                        $scope.networkTable.data = nets;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getNetByCluster() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/irm/zone/{zoneid}/external-networks?" +
                            "start={start}&limit={limit}&clusterid={clusterid}&issupervlan={superVlan}&status=READY",
                        o: { zoneid: zoneId, start: searchInfo.start, limit: searchInfo.limit,superVlan:false , clusterid: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var nets = data && data.externalNetworks || [];
                    for (var i = 0; i < nets.length; i++) {
                        nets[i].dvs = nets[i].dvses[0].name;
                        nets[i].vlan = nets[i].vlans[0];
                        nets[i].freeNicNum = 512 - nets[i].totalBoundNics;
                        nets[i].type = ($scope.i18n.resource_term_externalNet_label || "外部网络");
                    }
                    $scope.$apply(function () {
                        $scope.networkTable.totalRecords = data.total;
                        $scope.networkTable.data = nets;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function addNic() {
                var result = UnifyValid.FormValid($("#addNicDiv"));
                if (!result) {
                    return;
                }
                var params = {
                    networkId: selectedId,
                    vpcId: vpcId
                };
                var name = $("#" + $scope.nameTextbox.id).widget().getValue();
                if (name.length > 0) {
                    params.name = name;
                }
                var result = $("#" + $scope.macRadio.id).widget().opChecked("2");
                if (result) {
                    params.mac = $("#" + $scope.macTextbox.id).widget().getValue();
                }
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/vms/{id}/nics ",
                        o: {id: vmId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function editNic() {
                var result = UnifyValid.FormValid($("#addNicDiv"));
                if (!result) {
                    return;
                }
                var params = {
                    networkId: selectedId,
                    networkTypeForNic: networkType,
                    vpcId: vpcId
                };
                params.name = $("#" + $scope.nameTextbox.id).widget().getValue();
                params.mac = $("#" + $scope.macTextbox.id).widget().getValue();
                var deferred = camel.put({
                    "url": {
                        s: "/goku/rest/v1.5/irm/1/vms/{id}/nics/{nic_id} ",
                        o: {id: vmId, nic_id: nicId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getNetwork(){
                if (vpcId && vpcId > 0) {
                    getNetByVpc();
                }
                else {
                    getNetByCluster();
                }
            }
            if (nicId) {
                $scope.nameTextbox.require = true;
                $scope.macTextbox.label = "MAC:";
                $scope.macTextbox.require = true;
                $scope.macTextbox.disable = false;
                $scope.macTextbox.value = nicMac;
                $scope.nameTextbox.value = nicName;
                $scope.edit = true;
                if( $scope.vmType === "vmware"){
                    $scope.macTextbox.disable = true;
                }
            }
            getNetwork();
        }];

        var addNicApp = angular.module("addNicApp", ['framework']);
        addNicApp.service("camel", httpService);
        addNicApp.service("validator", validatorService);
        addNicApp.controller("resources.vmInfo.addNic.ctrl", addNicCtrl);
        return addNicApp;
    }
);
