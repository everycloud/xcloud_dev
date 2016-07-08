/**
 * Created on 14-2-27.
 */
define([
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    "app/business/application/controllers/constants",
    'app/business/network/services/networkService',
    "fixtures/appFixture",
    "fixtures/network/vpcFixture"
], function ($, encoder, angular, _, UnifyValid, constants, networkService) {
    "use strict";

    var ctrl = ["$scope", "camel", "$compile", "$state", "exception", "$q",
        function ($scope, camel, $compile, $state, exception, $q) {
            var user = $("html").scope().user;
            var i18n = $("html").scope().i18n;
            var networkServiceIns = new networkService(exception, $q, camel);

            $scope.info = {
                "vpcs": null,
                "networkTable": {
                    "id": "create-app-NetworkTable",
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 30],
                    "draggable": true,
                    "paginationStyle": "full_numbers",
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
                        "sTitle":i18n.common_term_availableSelect_label,
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
                        if ((null === aData.networkId) || (undefined === aData.networkId)) {
                            networkScope.defaultNetworkId = "";
                        } else {
                            networkScope.defaultNetworkId = aData.networkId;
                        }
                        networkScope.values = aData.networkValues;
                        networkScope.validate = "required:"+i18n.common_term_null_valid+";";
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

                "commonParams": {
                    "id": "create-app-commonParams",
                    "enablePagination": true,
                    "draggable": true,
                    "lengthMenu": [10, 20, 30],
                    "paginationStyle": "full_numbers",
                    "columns": [{
                        "sTitle": i18n.common_term_paraName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle":i18n.common_term_paraValue_label,
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
                        paramInputScope.validate = "required:"+i18n.common_term_null_valid+";";
                        paramInputScope.change = function () {
                            if ($scope.commonParams.data[iDataIndex]) {
                                $scope.commonParams.data[iDataIndex].value = $("#createAppInputCommonParams" + iDataIndex).widget().getValue();
                            }
                        };
                        var paramInputNode = paramInputLink(paramInputScope);
                        $("td:eq(1)", nRow).html(paramInputNode);
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

                        refreshTemplateData();

                        //缓存一份,用于快速寻找vlb的网卡与网络的对应关系
                        if ($scope.templateNet.data.length > 0) {
                            _.each($scope.templateNet.data, function (item, index) {
                                $scope.configVlbNetworkMap[item.ameId] = item;
                            });
                        }
                        $("#createByTemplate-app-step").widget().next();
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

            //刷新$scope.tmp.ameIdResourceMap中的templateNet.data(注:解析时放进去,但表格更改的只是拷贝,需要把更改后的刷过去)
            function refreshTemplateData(){
                if ($scope.templateNet.data.length > 0) {
                    var tmpAmeId;
                    _.each($scope.templateNet.data, function (item, index) {
                        tmpAmeId = item.ameId;
                        $scope.tmp.ameIdResourceMap[tmpAmeId] = item;
                    });
                }
            }

            function queryAvailableNetworkByVpcId(vpcId) {
                if (!vpcId) {
                    return false;
                }
                var templateTable = $scope.templateNet.data;
                var options = {
                    "vdcId": user.vdcId,
                    "vpcId": vpcId,
                    "userId": user.id,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "status": constants.networkStatus.READY
                };
                var deferred = networkServiceIns.queryNetworks(options);
                deferred.then(function (data) {
                    if (!data || !data.networks || (data.networks.length <= 0)) {
                        //更新vpc
                        var updateVpcNetData = [];
                        _.each(templateTable, function (item, index) {
                            item.vpcName = $scope.params.selVpcName;
                            item.networkId = null;
                            item.networkName = null;
                            item.networkValues = [];
                            //注:在性能优化后的流程中,运行环境中须采用下面的拷贝方法使angular感受数据变化
                            updateVpcNetData.push(angular.copy(item));
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
                    formatAvailableNets[0].checked = true;

                    var newTemplateTable = [];
                    _.each(templateTable, function (item, index) {
                        //初始化场景
                        tmpAvailableNet = angular.copy(formatAvailableNets);
                        item.networkValues = tmpAvailableNet;
                        item.networkId = formatAvailableNets[0].selectId;
                        item.networkName = formatAvailableNets[0].label;
                        item.vpcName = $scope.params.selVpcName;
                        newTemplateTable.push(angular.copy(item));
                    });
                    $scope.templateNet.data = newTemplateTable;
                });
            }

            queryAvailableNetworkByVpcId($scope.params.selVpcId);
        }
    ];
    return ctrl;
});
