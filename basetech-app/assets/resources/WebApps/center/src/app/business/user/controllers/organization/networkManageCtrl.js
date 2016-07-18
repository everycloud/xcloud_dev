/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/userService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField"
],
    function ($, angular, http, UserService, ExceptionService, MessageService, commonService, Message, Window, Checkbox) {
        "use strict";
        var networkManageCtrl = ["$scope", "$compile", "camel",
            function ($scope, $compile, camel) {
                var $rootScope = $("html").scope();
                var user = $rootScope.user;
                var i18n = $scope.i18n = $rootScope.i18n;
                var $networkManageWindowWidget = $("#networkManageWindowId").widget();
                var vdcId = $networkManageWindowWidget.option("orgId");
                var ID_LENGTH = 2;


                // network页面内容
                var showNetworks = [];
                var selectedNetworks = [];

                var networkIdPrefix = "canSelectedNetworkID_";
                var networkTbHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = showNetworks;
                        var checkedAll = networkTbHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = networkIdPrefix + list[i].id;
                            //防止id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                var checked = $(dom).widget().option("checked");
                                if (checked !== checkedAll && list[i].id !== user.id) {
                                    $(dom).widget().option("checked", checkedAll);
                                    selectNetwork(list[i], checkedAll, true);
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightNetworkTable.data = $.extend([], selectedNetworks);
                        });
                    }
                });
                var ifNetworkChecked = function (id) {
                    var SPER = ";";
                    var selectedIds = [];
                    for (var j = 0, selectedLen = selectedNetworks.length; j < selectedLen; j++) {
                        selectedIds.push(selectedNetworks[j].id);
                    }
                    var selectedIdsStr = SPER + selectedIds.join(SPER) + SPER;
                    if (-1 === selectedIdsStr.indexOf(SPER + id + SPER)) {
                        return false;
                    }
                    return true;
                };
                var ifAllNetworkChecked = function (list) {
                    var len = list && list.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (!ifNetworkChecked(list[i].id)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                };
                var renderNetworkTbHeaderCheckbox = function (list) {
                    var allChecked = ifAllNetworkChecked(list);
                    networkTbHeaderCheckbox.option("checked", allChecked);
                    networkTbHeaderCheckbox.rendTo($("#networkTableHeaderCheckbox"));
                };
                var selectNetwork = function (network, checked, disableChange) {
                    if (checked) {
                        !ifNetworkChecked(network.id) && selectedNetworks.push(network);
                    } else {
                        for (var i = 0, len = selectedNetworks.length; i < len; i++) {
                            if (selectedNetworks[i].id === network.id) {
                                selectedNetworks.splice(i, 1);
                                var dom = document.getElementById(networkIdPrefix + network.id);
                                dom && $(dom).widget().option("checked", false);
                                break;
                            }
                        }
                    }
                    var allChecked = ifAllNetworkChecked(showNetworks);
                    networkTbHeaderCheckbox.option("checked", allChecked);
                    if (!disableChange) {
                        $scope.rightNetworkTable.data = $.extend([], selectedNetworks);
                    }
                };
                var ALL_NETWORK = 0;
                $scope.networkRange = {
                    "id": "networkRangeId",
                    "label": "",
                    "spacing": {
                        "width": "100px",
                        "height": "30px"
                    },
                    "values": [],
                    "layout": "horizon",
                    "change": function () {
                        var selectedId = $("#" + $scope.networkRange.id).widget().opChecked("checked");
                        $scope.choiceNetwork = selectedId != ALL_NETWORK;
                        if ($scope.choiceNetwork && !showNetworks.length) {
                            $scope.operator.getNetworks();
                        }
                    }
                };

                $scope.networkSelectModel = {
                    "networkSelectLabel": ($scope.i18n.router_term_chooseExterNet_label || "选择外部网络") + ":",
                    "canSelectNetworkLabel": $scope.i18n.common_term_waitChoose_value || "待选择",
                    "networkSelectedLabel": $scope.i18n.common_term_choosed_value || "已选择"
                };
                $scope.leftNetworkSearchBox = {
                    "id": "leftNetworkSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.searchNetworkModel.start = 0;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.canSelectNetwork = {
                    "height": "28px",
                    networkList: []
                };
                $scope.selectedNetwork = {
                    "height": "28px",
                    checkboxWidth: "100px",
                    selectWidth: "160px",
                    selectMode: "multiple",
                    networkList: []
                };
                $scope.azFilter = {
                    id: "cloudInfrasFilterId",
                    label: ($scope.i18n.cloud_term_cloudPool_label || "可用分区" ) + ":",
                    range: [],
                    values: [],
                    change: function () {
                        var selectedId = $("#" + $scope.azFilter.id).widget().getSelectedId();
                        $scope.searchNetworkAzFilterId = selectedId;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.searchNetworkModel = {
                    "start": 0,
                    "limit": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "cloud-infras": "",
                    "az-id": "",
                    "vpcid": "",
                    "usedbyrouter": false,
                    "usedbyvxlanrouter": false,
                    "isAssociated": false
                };
                $scope.leftNetworkTable = {
                    "id": "addNetworkLeftTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": "<div id='networkTableHeaderCheckbox'></div>",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": "check",
                            "sClass": "networkCheck",
                            "sWidth": 26
                        },
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "VLAN ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vlans);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_SubnetIP_label || "子网IP地址",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.subNet);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "simple",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "hideTotalRecords": false,
                    "showDetails": false,
                    "renderRow": function (row, dataitem, index) {
                        var networkId = dataitem.id;

                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                            "<tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox>" +
                            "</div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = dataitem;
                        selBoxScope.id = networkIdPrefix + networkId;

                        selBoxScope.checked = ifNetworkChecked(networkId);
                        selBoxScope.change = function () {
                            var checked = $("#" + networkIdPrefix + networkId).widget().option("checked");
                            selectNetwork(dataitem, checked);

                            var allChecked = ifAllNetworkChecked(showNetworks);
                            networkTbHeaderCheckbox.option("checked", allChecked);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td.networkCheck", row).append(selBoxNode);
                    },

                    "callback": function (evtObj) {
                        $scope.searchNetworkModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchNetworkModel.limit = evtObj.displayLength;
                        $scope.operator.getNetworks();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchNetworkModel.start = 0;
                        $scope.searchNetworkModel.limit = evtObj.displayLength;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.rightNetworkTable = {
                    "id": "addNetworkRightTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "",
                            "bSortable": false,
                            "sClass": "del",
                            "sWidth": 100
                        }
                    ],
                    "pagination": false,
                    "renderRow": function (row, dataitem, index) {
                        var deleteText = i18n.common_term_delete_button || "删除";
                        var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                        var compiledDelTemplate = $compile(delTemplate);
                        var delDomScope = $scope.$new();
                        delDomScope.remove = function () {
                            selectNetwork(dataitem, false);
                        };
                        var delDom = compiledDelTemplate(delDomScope);
                        $("td.del", row).append(delDom);
                    }
                };
                $scope.editVdcNetwork = true;
                $scope.networkCancelBtn = {
                    "id": "networkCancelBtnId",
                    "text": i18n.common_term_cancle_button || "取消",
                    "click": function () {
                        $networkManageWindowWidget.destroy();
                    }
                };
                $scope.networkSaveBtn = {
                    "id": "networkSaveBtnId",
                    "text": i18n.common_term_save_label || "保存",
                    "click": function () {
                        if ($scope.choiceNetwork) {
                            var list = [];
                            var networks = [];
                            var cloudInfras = {};
                            var len = selectedNetworks.length;
                            if (!len) {
                                new MessageService().promptErrorMsgBox(i18n.org_vdc_add_para_externalNet_valid || "请至少指定一个外部网络");
                                return;
                            }

                            for (var index = 0; index < len; index++) {
                                var selectedNetwork = selectedNetworks[index];
                                var cloudInfrasId = selectedNetwork.cloudInfrasId;
                                var azId = selectedNetwork.azId;
                                var tempId = azId + "_" + cloudInfrasId;
                                !cloudInfras[tempId] && (cloudInfras[tempId] = {
                                    cloudInfrasId: cloudInfrasId,
                                    azId: azId,
                                    exNetworkIdList: []
                                });
                                var selectedNetworkId = selectedNetwork.id;
                                if (selectedNetworkId) {
                                    var ids = selectedNetworkId.split("_");
                                    if (ids && ids.length == (ID_LENGTH + 1)) {
                                        cloudInfras[tempId].exNetworkIdList.push(ids[ID_LENGTH]);
                                        networks.push(selectedNetwork.name);
                                    }
                                }
                            }
                            for (var p in cloudInfras) {
                                list.push(cloudInfras[p]);
                            }
                            $scope.networkInfo = {associates: !list.length ? null : list};
                        } else {
                            $scope.networkInfo = {
                                associates: [
                                    {
                                        cloudInfrasId: -1,
                                        azId: -1,
                                        exNetworkIdList: [-1]
                                    }
                                ]
                            };
                        }
                        $scope.operator.associateNetworks();
                    }
                };

                $scope.operator = {
                    "getNetworks": function (init) {
                        var ids = $scope.searchNetworkAzFilterId.split("_");
                        if (ids && ids.length == ID_LENGTH) {
                            $scope.searchNetworkModel["cloud-infras"] = ids[1];
                            $scope.searchNetworkModel["az-id"] = ids[0];

                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks",
                                    o: {
                                        vdc_id: vdcId
                                    }
                                },
                                "params": $scope.searchNetworkModel,
                                "userId": user.id
                            });
                            deferred.success(function (response, textStatus, jqXHR) {
                                response = response || {externalNetworks: [], total: 0, allExtenalNetwork: false};
                                $scope.showView = true;
                                if (init) {
                                    $scope.$apply(function () {
                                        $scope.choiceNetwork = !response.allExtenalNetwork;
                                        $scope.networkRange.values = [
                                            {
                                                "key": ALL_NETWORK,
                                                "text": i18n.common_term_all_label || "全部",
                                                "checked": !$scope.choiceNetwork
                                            },
                                            {
                                                "key": "2",
                                                "text": i18n.common_term_designation_label || "指定",
                                                "checked": $scope.choiceNetwork
                                            }
                                        ];
                                    });
                                }
                                if ($scope.choiceNetwork) {
                                    showNetworks = response.externalNetworks;
                                    var netConfig = {
                                        IPv4: "ipv4Subnet",
                                        IPv6: "ipv6Subnet",
                                        DualStack: ""
                                    };
                                    for (var i = 0, len = showNetworks.length; i < len; i++) {
                                        var network = showNetworks[i];
                                        network.id = $scope.searchNetworkAzFilterId + "_" + network.exnetworkID;
                                        network.azId = ids[0];
                                        network.cloudInfrasId = ids[1];
                                        var protocolType = netConfig[network.protocolType];
                                        network[protocolType] && (network.subNet = network[protocolType].subnetAddr);
                                        selectNetwork(network, network.appointed);
                                    }
                                    $scope.$apply(function () {
                                        $scope.leftNetworkTable.data = response.externalNetworks;
                                        $scope.leftNetworkTable.totalRecords = response.total;
                                    });
                                    renderNetworkTbHeaderCheckbox(showNetworks);
                                }
                            });
                            deferred.fail(function (jqXHR, textStatus, errorThrown) {
                                $scope.leftNetworkTable.data = [];
                                new ExceptionService().doException(jqXHR);
                            });
                        }
                    },

                    "associateNetworks": function () {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{vdc_id}/available-external-networks/action",
                                o: {
                                    vdc_id: vdcId
                                }
                            },
                            "params": JSON.stringify($scope.networkInfo),
                            "userId": user.id
                        });
                        deferred.success(function (response, textStatus, jqXHR) {
                            $networkManageWindowWidget.destroy();
                        });
                        deferred.fail(function (jqXHR, textStatus, errorThrown) {
                            new ExceptionService().doException(jqXHR);
                        });
                    },

                    "getAZs": function () {
                        var deferred = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/vdcs/{tenant_id}/cloud-infras",
                                "o": {
                                    "tenant_id": vdcId
                                }
                            },
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var azList = [];
                                var azInfos = response.azInfos || [];
                                for (var i = 0, len = azInfos.length; i < len; i++) {
                                    var item = azInfos[i];
                                    azList.push({
                                        "selectId": item.azId + "_" + item.cloudInfraId,
                                        "label": item.azName + "(" + item.cloudInfraName + ")",
                                        "checked": !i
                                    });
                                }
                                if (azList && azList.length) {
                                    $scope.azFilter.values = azList;
                                    $scope.searchNetworkAzFilterId = azList[0].selectId;
                                    $scope.operator.getNetworks(true);
                                } else {
                                    $scope.showView = true;
                                    $scope.choiceNetwork = false;
                                    $scope.networkRange.values = [
                                        {
                                            "key": ALL_NETWORK,
                                            "text": i18n.common_term_all_label || "全部",
                                            "checked": true
                                        },
                                        {
                                            "key": "2",
                                            "text": i18n.common_term_designation_label || "指定",
                                            "checked": false,
                                            "disable":true
                                        }
                                    ];
                                }
                            });
                        });
                    }
                };
                $scope.operator.getAZs();
            }
        ];

        var dependency = ["ng", "wcc"];
        var app = angular.module("userMgr.org.networkManage", dependency);
        app.controller("userMgr.org.networkManage.ctrl", networkManageCtrl);
        app.service("camel", http);
        return app;
    });
