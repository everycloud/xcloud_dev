define(['tiny-lib/jquery',
        'tiny-lib/encoder',
        "tiny-lib/angular",
        "tiny-lib/underscore",
        'tiny-common/UnifyValid',
        "app/business/application/controllers/constants",
        'app/business/network/services/networkService',
        "fixtures/appFixture",
        "fixtures/network/vpcFixture"
    ],
    function ($, encoder, angular, _, UnifyValid, constants, networkService) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state", "exception", "$q",
            function ($scope, camel, $compile, $state, exception, $q) {
                var user = $("html").scope().user;
                var networkServiceIns = new networkService(exception, $q, camel);
                var i18n = $("html").scope().i18n;
                $scope.info = {
                    "vpcs": null,
                    "networkTable": {
                        "id": "create-app-NetworkTable",
                        "enablePagination": false,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "columns": [{
                            "sTitle": i18n.vpc_term_net_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        }, {
                            "sTitle": i18n.vpc_term_vpc_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vpcName);
                            }
                        }, {
                            "sTitle": i18n.vpc_term_netName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkId);
                            }
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var networkSel = "<div><tiny-select id='id' values='values' width='150' change='change(rowIndex)' default-selectid='defaultNetworkId' validate='validate'></tiny-select></div>";
                            var networkLink = $compile(networkSel);
                            var networkScope = $scope.$new();
                            networkScope.id = "createAppChooseNetworkNet" + iDataIndex;
                            networkScope.rowIndex = iDataIndex;
                            networkScope.defaultNetworkId = aData.networkId;
                            networkScope.values = aData.networkValues;
                            networkScope.validate = "required:" + i18n.common_term_null_valid;
                            networkScope.change = function (rowIndex) {
                                var selectNetworkId = $("#createAppChooseNetworkNet" + iDataIndex).widget().getSelectedId();
                                if (!$scope.templateNet.data[rowIndex]) {
                                    return;
                                }
                                $scope.templateNet.data[rowIndex].networkId = selectNetworkId;
                                $scope.templateNet.data[rowIndex].networkName = $("#createAppChooseNetworkNet" + iDataIndex).widget().getSelectedLabel();
                                _.each($scope.templateNet.data[rowIndex].networkValues, function (item, index) {
                                    if (selectNetworkId && (selectNetworkId === item.selectId)) {
                                        item.checked = true;
                                    } else {
                                        item.checked = false;
                                    }
                                });
                            };
                            var networkNode = networkLink(networkScope);
                            $("td:eq(2)", nRow).html(networkNode);
                        }
                    },
                    "networkLock": {
                        "label": "",
                        "require": "true",
                        "id": "networkSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [{
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label
                        }, {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label
                        }, {
                            "key": "0",
                            "text": i18n.user_term_lock_value,
                            "checked": true
                        }],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.networkLock = $("#" + $scope.info.networkLock.id).widget().opChecked("checked");
                        }
                    },
                    "commonParams": {
                        "id": "create-app-commonParams",
                        "enablePagination": false,
                        "draggable": true,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "columns": [{
                            "sTitle": i18n.common_term_paraName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        }, {
                            "sTitle": i18n.common_term_paraValue_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.value);
                            }
                        }, {
                            "sTitle": i18n.common_term_paraDesc_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            }
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var paramInputBox = "<div><tiny-textbox id='id' value='value' validate='validate' change='change()'></tiny-textbox></div>";
                            var paramInputLink = $compile(paramInputBox);
                            var paramInputScope = $scope.$new();
                            paramInputScope.id = "createAppInputCommonParams" + iDataIndex;
                            paramInputScope.value = aData.value;
                            paramInputScope.validate = "required:" + i18n.common_term_null_valid;
                            paramInputScope.change = function () {
                                if ($scope.commonParams.data[iDataIndex]) {
                                    $scope.commonParams.data[iDataIndex].value = $("#createAppInputCommonParams" + iDataIndex).widget().getValue();
                                }
                            };
                            var paramInputNode = paramInputLink(paramInputScope);
                            $("td:eq(1)", nRow).html(paramInputNode);
                        }
                    },
                    "commonParamsLock": {
                        "label": "",
                        "require": "true",
                        "id": "commonParamsSelect",
                        "spacing": {
                            "width": "50px",
                            "height": "30px"
                        },
                        "values": [{
                            "key": "1",
                            "text": i18n.service_term_inputWhenApply_label
                        }, {
                            "key": "2",
                            "text": i18n.service_term_inputWhenApprove_label
                        }, {
                            "key": "0",
                            "text": i18n.user_term_lock_value,
                            "checked": true
                        }],
                        "layout": "horizon",
                        "change": function () {
                            $scope.lock.commonParamsLock = $("#" + $scope.info.commonParamsLock.id).widget().opChecked("checked");
                        }
                    },

                    "preBtn": {
                        "id": "createApp-chooseNetwork-preBtn",
                        "text": i18n.common_term_back_button,
                        "click": function () {
                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": true,
                                "chooseNetwork": false,
                                "configApp": false,
                                "confirmByTemplate": false
                            };
                            $("#createByTemplate-app-step").widget().pre();
                        }
                    },
                    "nextBtn": {
                        "id": "createApp-chooseNetwork-nextBtn",
                        "text": i18n.common_term_next_button,
                        "click": function () {
                            var valid = UnifyValid.FormValid($("#createAppNetwork"));
                            if (!valid) {
                                return;
                            }

                            $scope.service.show = {
                                "chooseTemplate": false,
                                "basicInfo": false,
                                "chooseNetwork": false,
                                "configApp": true,
                                "confirmByTemplate": false
                            };
                            var selectedNetworks = $scope.info.networkTable.data;
                            if (!$scope.info.networkTable.data) {
                                $scope.info.networkTable.data = [];
                            }
                            if (selectedNetworks.length > 0) {
                                for (var i = 0; i < selectedNetworks.length; i++) {
                                    selectedNetworks[i].vpcId = $("#createAppChooseNetworkVpc" + i).widget().getSelectedId();
                                    selectedNetworks[i].vpcName = $("#createAppChooseNetworkVpc" + i).widget().getSelectedLabel();
                                    selectedNetworks[i].networkId = $("#createAppChooseNetworkNet" + i).widget().getSelectedId();
                                    selectedNetworks[i].networkName = $("#createAppChooseNetworkNet" + i).widget().getSelectedLabel();
                                }
                            }
                            $scope.params.networks = selectedNetworks;

                            //缓存一份,用于快速寻找vlb的网卡与网络的对应关系
                            if ($scope.templateNet.data.length > 0) {
                                _.each($scope.templateNet.data, function (item, index) {
                                    $scope.configVlbNetworkMap[item.ameId] = item;
                                });
                            }
                            $("#createByTemplate-app-step").widget().next();
                            $scope.$emit($scope.events.selTempNetNext);
                        }
                    },
                    "cancelBtn": {
                        "id": "createApp-chooseNetwork-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.commonCancel();
                        }
                    }
                };

                function queryAvailableNetworkByVpcId(vpcId) {
                    if (!vpcId) {
                        return false;
                    }
                    var templateTable = $scope.templateNet.data;
                    var options = {
                        "vdcId": user.vdcId,
                        "vpcId": vpcId,
                        "userId": user.id,
                        "cloudInfraId": $scope.params.cloudInfraId
                    };
                    var deferred = networkServiceIns.queryNetworks(options);
                    deferred.then(function (data) {
                        if (!data || !data.networks || (data.networks.length <= 0)) {
                            //更新vpc
                            var updateVpcNetData = [];
                            _.each(templateTable, function (item, index) {
                                item.vpcName = $scope.params.selVpcName;
                                if (!item.networkId){
                                    item.networkId = null;
                                }
                                if (!item.networkName){
                                    item.networkName = null;
                                }
                                item.networkValues = [];
                                updateVpcNetData.push(item);
                            });
                            $scope.templateNet.data = updateVpcNetData;
                            return;
                        }
                        var formatAvailableNets = [];
                        var tmpAvailableNet = null;
                        _.each(data.networks, function (item, index) {
                            tmpAvailableNet = {};
                            tmpAvailableNet.selectId = item.networkID;
                            tmpAvailableNet.label = item.name;
                            formatAvailableNets.push(tmpAvailableNet);
                        });

                        var newTemplateTable = [];
                        _.each(templateTable, function (item, index) {
                            //初始化场景
                            tmpAvailableNet = angular.copy(formatAvailableNets);
                            item.networkValues = tmpAvailableNet;
                            if (!item.networkId){
                                item.networkId = formatAvailableNets[0].selectId;
                            }
                            if (!item.networkName){
                                item.networkName = formatAvailableNets[0].label;
                            }
                            item.vpcName = $scope.params.selVpcName;
                            newTemplateTable.push(item);
                        });
                        $scope.templateNet.data = newTemplateTable;
                    });
                }

                function init() {
                    if ($scope.params.action === "modify") {
                        $scope.lock.networkLock = $scope.lock.vpcLock === $scope.detail.param.lock.vpcLock ? $scope.detail.param.lock.networkLock : $scope.lock.vpcLock;
                    } else {
                        $scope.lock.networkLock = $scope.lock.vpcLock;
                    }

                    var nLock = $("#" + $scope.info.networkLock.id).widget();
                    nLock.opChecked($scope.lock.networkLock, true);
                    var cLock = $("#" + $scope.info.commonParamsLock.id).widget();

                     if ($scope.lock.vpcLock === "2") {
                        nLock.opDisabled("0", true);
                        nLock.opDisabled("1", true);
                        nLock.opDisabled("2", true);
                    } else if ($scope.lock.vpcLock === "1") {
                         nLock.opDisabled("0", true);
                         nLock.opDisabled("1", false);
                         nLock.opDisabled("2", false);
                     } else {
                        nLock.opDisabled("0", false);
                        nLock.opDisabled("1", false);
                        nLock.opDisabled("2", false);
                    }

                    if ($scope.params.approvalType === "none") {
                        nLock.opDisabled("2", true);
                        if (cLock) {
                            cLock.opDisabled("2", true);
                        }
                    }
                }

                $scope.$on($scope.events.selBaseInfoNextFromParent, function (event, msg) {
                    init();
                    if ($scope.lock.networkLock === "0") {
                        queryAvailableNetworkByVpcId($scope.params.selVpcId);
                    }
                });
            }
        ];
        return ctrl;
    });
