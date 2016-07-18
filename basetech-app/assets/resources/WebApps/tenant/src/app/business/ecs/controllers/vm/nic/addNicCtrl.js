/**
 * 文件名：addNicCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加网卡的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/exceptionService',
    'app/business/ecs/services/vm/vmNicService',
    "app/business/ecs/services/vm/vmCommonService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, _, http, UnifyValid, exception, vmNicService, vmCommonService) {
    "use strict";

    var addNicCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            var vmId = $("#ecsVmsDetailAddNicWinId").widget().option("vmId");
            var vpcId = $("#ecsVmsDetailAddNicWinId").widget().option("vpcId");
            var cloudInfra = $("#ecsVmsDetailAddNicWinId").widget().option("cloudInfra");
            var user = $("html").scope().user || {};
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var vmCommonServiceIns = new vmCommonService();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            // 搜索字符串
            var searchString = "";

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "id": "ecsVmDetailAddNicName",
                "value": "",
                "extendFunction": ["vmNicNameValid"],
                "validate": "vmNicNameValid():" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64)
            };

            $scope.searchNetwork = {
                "require": true,
                "label": i18n.vm_term_chooseNet_label + ":",
                "id": "ecsVmDetailAddNicSearchNetwork",
                "placeholder": i18n.common_term_findName_prom,
                "width": "200",
                "maxLength": 64,
                "search": function (input) {
                    searchString = input;
                    queryNetworks();
                }
            };

            $scope.networks = {
                "id": "ecsVmDetailAddNicNetworks",
                "paginationStyle": "full_numbers",
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "columns": [{
                    "sTitle": "",
                    "mData": "",
                    "sWidth": "30px",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": i18n.vpc_term_netType_label,
                    "mData": "networkTypeView"
                }, {
                    "sTitle": i18n.resource_term_vlanID_label,
                    "sWidth": "15%",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vlan);
                    }
                }, {
                    "sTitle": i18n.common_term_Subnet_label,
                    "sWidth": "35%",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.allIp);
                    }
                }, {
                    "sTitle": i18n.perform_term_bondedNICnum_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.totalBoundNics);
                    }
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryNetworks();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryNetworks();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    // tips
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();

                    //单选按钮
                    var selBox = "<div><tiny-radio id='id' value='value' name='name' checked='checked' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.value = aData.networkID;
                    selBoxScope.name = "ecsVmDetailAddNicNetworksRadio";
                    selBoxScope.id = "ecsVmDetailAddNicNetRadioId" + iDataIndex;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        $scope.okBtn.disable = false;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "ecsVmDetailAddNicOK",
                "text": i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    if (!UnifyValid.FormValid($("#ecsVmDetailAddNicName"))) {
                        return;
                    }

                    var options = {
                        "vmId": vmId,
                        "name": $.trim($("#ecsVmDetailAddNicName").widget().getValue()),
                        "networkId": $("#ecsVmDetailAddNicNetRadioId0").widget().opChecked(),
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "user": user
                    };

                    var deferred = vmNicServiceIns.addVmNic(options);
                    deferred.then(function (data) {
                        $(".ecs_vm_detail_nics").scope().reloadVmNics = true;
                        $("#ecsVmsDetailAddNicWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsVmDetailAddNicCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailAddNicWinId").widget().destroy();
                }
            };

            UnifyValid.vmNicNameValid = function () {
                var input = $("#ecsVmDetailAddNicName").widget().getValue();
                if ($.trim(input) === "") {
                    return true;
                }

                var vmNicNameReg = /^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]{1,64}[ ]*$/;
                return vmNicNameReg.test(input);
            };

            // 转换网络类型字符串
            var networkTypeStr = {
                "1": i18n.vpc_term_directConnectNet_label,
                "2": i18n.vpc_term_innerNet_label,
                "3": i18n.vpc_term_routerNet_label
            };

            // 查询网络列表
            function queryNetworks() {
                if(!vpcId || vpcId === "-1"){
                    return;
                }
                var deferred = vmNicServiceIns.queryNetworks({
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId,
                    "user": user,
                    "name": searchString,
                    "start": page.getStart(),
                    "limit": page.displayLength
                });
                deferred.then(function (data) {
                    if (data) {
                        _.each(data.networks, function (item) {
                            item.allIp = vmCommonServiceIns.getIpFromSubnet(item.ipv4Subnet, item.ipv6Subnet);
                            item.networkTypeView = networkTypeStr[item.networkType] || i18n.common_term_unknown_value;
                        });

                        $scope.networks.data = data.networks;
                        $scope.networks.displayLength = page.displayLength;
                        $scope.networks.totalRecords = data.total;
                        $("#" + $scope.networks.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });

                        // 清空已选网络
                        $scope.okBtn.disable = true;
                        var radio = $("#ecsVmDetailAddNicNetRadioId0").widget();
                        if (radio) {
                            radio.option("checked", false);
                        }
                    }
                });
            }

            //获取初始数据
            queryNetworks();
        }
    ];

    var addNicModule = angular.module("ecs.vm.detail.nic.add", ['ng',"wcc","ngSanitize"]);
    addNicModule.controller("ecs.vm.detail.nic.add.ctrl", addNicCtrl);
    addNicModule.service("camel", http);
    addNicModule.service("exception", exception);

    return addNicModule;
});
