/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-10

 */
define(["tiny-lib/angular",
    'tiny-common/UnifyValid',
    'app/business/resources/controllers/constants'],
    function (angular, UnifyValid, constants) {
        "use strict";

        var vlanCtrl = ["$scope", "$state", "$stateParams", "camel", '$rootScope', function ($scope, $state, $stateParams, camel, $rootScope) {

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
                var vlanId = $("#" + $scope.vlanTextbox.id).widget().getValue();
                return isVlanLegal(vlanId);
            }

            //校验Vlan ID数组的每个元素是否都在范围内
            UnifyValid.checkVlanList = function () {
                var vlanIdList = $("#" + $scope.superVlanTextbox.id).widget().getValue().split(";");
                var vlans = []
                for (var index in vlanIdList) {
                    var vlan = vlanIdList[index].split("-");
                    if (vlan.length > 1) {
                        if (parseInt(vlan[0]) >= parseInt(vlan[1])) {
                            return false;
                        }
                        for (var i = parseInt(vlan[0]); i <= parseInt(vlan[1]); i++) {
                            vlans.push(i);
                        }
                    }
                    else if (vlan.length == 1) {
                        vlans.push(vlan[0]);
                    }
                    else {
                        return false;
                    }
                }
                for (var index in vlans) {
                    if (!isVlanLegal(vlans[index])) {
                        return false;
                    }
                }
                return true;
            }
            //校验Vlan list的格式
            UnifyValid.vlanListFormat = function () {
                var vlanIdList = $("#" + $scope.superVlanTextbox.id).widget().getValue() + ";";
                if (vlanIdList.match(/^((\d+(-\d+)?);)+$/)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            $scope.vlanTextbox = {
                "label": "VLAN ID",
                "require": "true",
                "id": "vlanTextbox",
                "width": "215px",
                "type": "input",
                "extendFunction": ["checkVlan"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";checkVlan:" + $scope.i18n.resource_term_vlanIDavailable_valid
            };
            $scope.superVlanTextbox = {
                "label": "VLAN ID",
                "require": "true",
                "id": "superVlanTextbox",
                "width": "215px",
                "type": "input",
                "extendFunction": ["vlanListFormat", "checkVlanList"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";vlanListFormat:" + $scope.i18n.common_term_format_valid + ";checkVlanList:" + $scope.i18n.resource_term_vlanIDavailable_valid
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
                display: true,
                id: "vlanTable",
                data: [],
                columns: vlanTableColumns,
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
                "renderRow": function (nRow, aData, iDataIndex) {
                },
                callback: function (eveObj) {

                },
                changeSelect: function (eveObj) {
                }
            };
            $scope.preBtn = {
                "id": "vlanPreBtn",
                "text": $scope.i18n.common_term_back_button || "上一步",
                "click": function () {
                    $scope.service.showPage = "dvs";
                    $("#" + $scope.service.addExtNetworkStep.id).widget().pre();
                }
            };
            $scope.nextBtn = {
                "id": "vlanNextBtn",
                "text": $scope.i18n.common_term_next_button || "下一步",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#vlanDiv"));
                    if (!valid) {
                        return;
                    }
                    if ($scope.createInfo.externalNetworkType == constants.config.EXERNAL_NETWORK_TYPE.vlan) {
                        $scope.service.vlans = $("#" + $scope.vlanTextbox.id).widget().getValue();
                        $scope.createInfo.vlans = $("#" + $scope.vlanTextbox.id).widget().getValue().split(";");
                        $scope.service.showPage = "qos";
                    }
                    else if ($scope.createInfo.externalNetworkType == constants.config.EXERNAL_NETWORK_TYPE.superSubnet) {
                        var vlanIdList = $("#" + $scope.superVlanTextbox.id).widget().getValue().split(";");
                        var vlans = []
                        for (var index in vlanIdList) {
                            var vlan = vlanIdList[index].split("-");
                            if (vlan.length > 1) {
                                for (var i = parseInt(vlan[0]); i <= parseInt(vlan[1]); i++) {
                                    vlans.push(i);
                                }
                            }
                            else if (vlan.length == 1) {
                                vlans.push(parseInt(vlan[0]));
                            }
                            else {
                                continue;
                            }
                        }
                        $scope.service.vlans = $("#" + $scope.superVlanTextbox.id).widget().getValue();
                        $scope.createInfo.vlans = vlans;
                        $scope.service.showPage = "subnet";
                        // 触发事件
                        $scope.$emit($scope.createExtNetworkEvents.vlanComplete);
                    }
                    else {
                        $scope.service.vlans = $("#" + $scope.vlanTextbox.id).widget().getValue();
                        $scope.createInfo.vlans = $("#" + $scope.vlanTextbox.id).widget().getValue().split(";");
                        $scope.service.showPage = "subnet";
                        // 触发事件
                        $scope.$emit($scope.createExtNetworkEvents.vlanComplete);
                    }

                    $("#" + $scope.service.addExtNetworkStep.id).widget().next();
                }
            };
            $scope.cancelBtn = {
                "id": "vlanCancelBtn",
                "text": $scope.i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("resources.zoneResources.externalNetwork.extNetwork", {"id": $scope.zoneInfo.id, "name": $scope.zoneInfo.name});
                }
            };
            $scope.operate = {
                "query": function (params) {
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
                }
            };
            // 事件处理
            $scope.$on($scope.createExtNetworkEvents.initExNetworkVlanPool, function (event, msg) {
                var params = {
                    "queryExternalNetworkVlanPoolReq": {
                        "dvsIDs": $scope.createInfo.dvsIDs,
                        "zoneID": $scope.zoneInfo.id,
                        "vxLanFlag": false,
                        "isUsedBySubnet": $scope.createInfo.externalNetworkType != constants.config.EXERNAL_NETWORK_TYPE.vlan,
                        "dhcpVlan": false
                    }
                };
                $scope.operate.query(params);
            });
        }];

        return vlanCtrl;
    }
)
;
