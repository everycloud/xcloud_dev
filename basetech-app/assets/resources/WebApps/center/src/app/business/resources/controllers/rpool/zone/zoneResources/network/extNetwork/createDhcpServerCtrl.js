/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-4-9

 */
define(["tiny-lib/angular",
    'tiny-widgets/Radio',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/validatorService',
    'app/business/resources/controllers/constants',
    "app/services/exceptionService"],
    function (angular, Radio, UnifyValid, httpService, validatorService, constants, ExceptionService) {
        "use strict";

        var createDhcpServerCtrl = ["$scope", "camel", "validator", function ($scope, camel, validator) {
                var $rootScope = $("html").injector().get("$rootScope");
                var zoneId = $("#createDhcpServerWin").widget().option("zoneId");
                $scope.i18n = $("html").scope().i18n;
                $scope.dvsId = "";
                $scope.createInfo = {
                    "zoneID": "",
                    "dvsID": "",
                    "vlan": "",
                    "protocolType": "IPv4",
                    "dhcpServerIPv4Config": {}
                };
                $scope.queryVlanvarParams = {
                    "queryExternalNetworkVlanPoolReq": {
                        "dvsIDs": "",
                        "zoneID": zoneId,
                        "vxLanFlag": false,
                        "isUsedBySubnet": true,
                        "dhcpVlan": true
                    }
                };

                UnifyValid.ipCheck = function (id) {
                    var ip = $("#" + id).widget().getValue();
                    return validator.ipValidator(ip);
                };
                UnifyValid.maskCheck = function (maskId) {
                    var mask = $("#" + maskId).widget().getValue();
                    return validator.maskValidator(mask);
                };
                UnifyValid.gatewayCheck = function (ipId) {
                    var ip = $("#" + ipId).widget().getValue();
                    var data = ip.split(".");
                    try {
                        if (data[3] == 255) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    catch (e) {
                        return false;
                    }
                };
                function isVlanLegal(vlanId) {
                    var vlanData = $scope.vlanTable.data;
                    try {
                        if (!vlanData.length) {
                            return false;
                        }
                        var index;
                        for (index in vlanData) {
                            if (parseInt(vlanId) >= parseInt(vlanData[index].startID) && parseInt(vlanId) <= parseInt(vlanData[index].endID)) {
                                return true
                            }
                        }
                    }
                    catch (e) {
                        return false
                    }
                    return false;
                }

                //校验Vlan ID是否在范围内
                UnifyValid.checkVlan = function () {
                    var vlanId = $("#" + $scope.vlan.id).widget().getValue();
                    return isVlanLegal(vlanId);
                }
                $scope.dvsSearchModel = {
                    "name": "",
                    "hypervisorid": "",
                    "start": 0,
                    "limit": 10
                };
                var dvsTableColumns = [
                    {
                        "sTitle": "",
                        "mData": "",
                        "sWidth": "10%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "20%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "sWidth": "20%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.zone);
                        },
                        "sWidth": "15%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "sWidth": "20%",
                        "bSortable": false}
                ];
                $scope.dvsTable = {
                    "id": "dvsTable",
                    "data": [],
                    "columns": dvsTableColumns,
                    "enablePagination": true,
                    "columnsDraggable": true,
                    "paginationStyle": "full-numbers",
                    "lengthChange": true,
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
                    "curPage": {"pageIndex": 1},
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "callback": function (evtObj) {
                        $scope.dvsSearchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.dvsSearchModel.limit = evtObj.displayLength;
                        $scope.operate.queryDvs($scope.dvsSearchModel);
                    },
                    "changeSelect": function (evtObj) {
                        $scope.dvsSearchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.dvsSearchModel.limit = evtObj.displayLength;
                        $scope.operate.queryDvs($scope.dvsSearchModel);
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //单选框Radio
                        var options = {
                            "id": "dvsRadio" + iDataIndex,
                            "checked": false,
                            "name": "dvsRadio",
                            "click": function () {
                                $scope.dvsId = aData.id;
                                $("#" + $scope.okBtn.id).widget().option("disable", false);
                                $scope.queryVlanvarParams.queryExternalNetworkVlanPoolReq.dvsIDs = [$scope.dvsId];
                                $scope.operator.queryVlan($scope.queryVlanvarParams);
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());

                    }
                };
                $scope.model = {
                    "label": "DVS：",
                    "require": true
                };
                $scope.vlan = {
                    "label": "VLAN ID:",
                    "require": "true",
                    "id": "vlanTextbox",
                    "width": "215px",
                    "type": "input",
                    "extendFunction": ["checkVlan"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid + ";checkVlan:" + $scope.i18n.resource_term_vlanIDavailable_valid
                };

                var vlanTableColumns = [
                    {
                        "sTitle": $scope.i18n.common_term_initiativeVALN_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startID);
                        },
                        "sWidth": "25%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_endVLAN_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.endID);
                        },
                        "sWidth": "25%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToVLANname_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "25%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.resource_term_belongsToVLANdesc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "sWidth": "25%",
                        "bSortable": false}
                ];
                $scope.vlanTable = {
                    "id": "vlanTable",
                    "data": [],
                    "columns": vlanTableColumns,
                    "enablePagination": false,
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "hideTotalRecords": true,
                    "renderRow": function (nRow, aData, iDataIndex) {
                    }
                };
                $scope.dhcpIp = {
                    "label": $scope.i18n.common_term_DHCPservice_label + " IP:",
                    "require": "true",
                    "id": "dhcpIp01",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "width": "215px",
                    "extendFunction": ["ipCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(dhcpIp01):" + $scope.i18n.common_term_formatIP_valid
                };
                $scope.subnetMask = {
                    "label": $scope.i18n.common_term_SubnetMask_label + ":",
                    "require": "true",
                    "id": "subnetMask",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "width": "215px",
                    "extendFunction": ["maskCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maskCheck(subnetMask):" + $scope.i18n.common_term_formatSubnetMask_valid
                };
                $scope.gateway = {
                    "label": $scope.i18n.common_term_gateway_label + ":",
                    "require": "true",
                    "id": "gateway",
                    "type": "ipv4",
                    "value": "",
                    "disable": false,
                    "width": "215px",
                    "extendFunction": ["ipCheck", "gatewayCheck"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipCheck(gateway):" + $scope.i18n.common_term_formatIP_valid + ";gatewayCheck(gateway):" + $scope.i18n.vpc_term_gatewayError_valid
                };

                $scope.okBtn = {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_confirm_label,
                    "disable": true,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createDhcpServerDiv"));
                        if (!valid) {
                            return;
                        }
                        $scope.createInfo.zoneID = zoneId;
                        $scope.createInfo.dvsID = $scope.dvsId;
                        $scope.createInfo.vlan = $("#" + $scope.vlan.id).widget().getValue();
                        $scope.createInfo.dhcpServerIPv4Config.dhcpServerIP = $("#" + $scope.dhcpIp.id).widget().getValue();
                        $scope.createInfo.dhcpServerIPv4Config.prefix = $("#" + $scope.subnetMask.id).widget().getValue();
                        $scope.createInfo.dhcpServerIPv4Config.gateway = $("#" + $scope.gateway.id).widget().getValue();
                        $scope.operator.createDhcpServer($scope.createInfo);
                    }
                };
                $scope.cancelBtn = {
                    "id": "resourceChoiceCancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createDhcpServerWin").widget().destroy();
                    }
                };
                $scope.operator = {
                    //查询DVS
                    queryDvs: function (params) {
                        var queryConfig = constants.rest.DVS_QUERY
                        var deferred = camel.get({
                            "url": {s: queryConfig.url + "&hypervisortype={hypervisortype}", o: {"zoneid": zoneId, "start": params.start, "limit": params.limit, "name": "", "hypervisorid": "", "hypervisortype": "fusioncompute"}},
                            "type": queryConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                for (var index1 in response.dvses) {
                                    var clusterName = [];
                                    for (var key in response.dvses[index1].clusterIDsMapNames) {
                                        clusterName.push(response.dvses[index1].clusterIDsMapNames[key]);
                                    }
                                    response.dvses[index1].zone = clusterName.join(";");
                                }
                                $scope.dvsTable.data = response.dvses;
                                $scope.dvsTable.totalRecords = response.total;
                            });

                        });
                    },
                    //查询vlan
                    "queryVlan": function (params) {
                        var queryConfig = constants.rest.VLAN_POOL_FOR_EXTERNAL_NETWORK;
                        var deferred = camel.post({
                            "url": {s: queryConfig.url, o: {"tenant_id": 1}},
                            "type": queryConfig.type,
                            "params": JSON.stringify(params),
                            "userId": $rootScope.user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.vlanTable.data = response.queryVlanPoolResp.vlanpools;
                                $scope.vlanTable.totalRecords = response.queryVlanPoolResp.total;
                            });
                        });
                    },
                    //创建dhcp服务器
                    createDhcpServer: function (params) {
                        var createConfig = constants.rest.DHCP_SERVER_CREATE
                        var deferred = camel.post({
                            "url": createConfig.url,
                            "type": createConfig.type,
                            "userId": $rootScope.user.id,
                            "params": JSON.stringify(params)
                        });
                        deferred.done(function (response) {
                            $("#createDhcpServerWin").widget().destroy();
                        });

                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                }
                $scope.operator.queryDvs($scope.dvsSearchModel);
            }
            ]
            ;
        var deps = [];
        var createDhcpServerApp = angular.module("createDhcpServerApp", deps);
        createDhcpServerApp.controller("createDhcpServerCtrl", createDhcpServerCtrl);
        createDhcpServerApp.service("camel", httpService);
        createDhcpServerApp.service("validator", validatorService);
        return createDhcpServerApp;
    })

