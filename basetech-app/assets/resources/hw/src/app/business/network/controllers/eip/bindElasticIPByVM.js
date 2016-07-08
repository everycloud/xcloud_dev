/**
 * 文件名：bindElasticIPByPrivateIp.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-4-23
 */
define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/services/exceptionService",
        "app/business/network/services/eip/eipService",
        "app/business/ecs/services/vm/queryVmService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-widgets/Radio",
        "tiny-directives/Table",
        "tiny-directives/Select",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "fixtures/network/eip/elasticipFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, exceptionService, eipService, queryVmService, _) {
        "use strict";
        var bindElasticIPByVMCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                //获取参数
                var params = $("#bindElasticIPWindowId").widget().option("params");
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.vm = {
                    label: i18n.common_term_vm_label+":",
                    name: i18n.common_term_name_label + ":",
                    ip: "IP:",
                    require: false
                };
                $scope.vmName = {
                    "id": "bindVMNameInputId",
                    "value": "",
                    "type": "input"
                };
                $scope.vmIP = {
                    "id": "bindVMIPInputId",
                    "value": "",
                    "type": "input"
                };

                $scope.searchBtn = {
                    "id": "bindElasticIPByVMSearchBtnId",
                    "text": i18n.common_term_search_button,
                    "click": function () {
                        $scope.command.queryVMList(false);
                    }
                };
                $scope.bindVMTable = {
                    "id": "bindElasticIPByVMListTable",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": "",
                        "mData": "selectRadio",
                        "bSortable": false,
                        "sWidth": "30"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ipDisplay);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": "MAC",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.macDisplay);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.vm_term_vmType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        // 单选框
                        var selBox = "<div><tiny-radio text='' name='name' checked='checked' click='click()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "vmTableRowRadio";
                        selBoxScope.checked = aData.checked;
                        selBoxScope.click = function () {
                            $scope.bindVMId = aData.id;
                            $scope.command.queryVMNicInfo(aData.id);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryVMList(false);
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.command.queryVMList(false);
                    }
                };
                $scope.bindVMNics = {
                    label: i18n.common_term_NIC_label + ":",
                    "id": "bindElasticIPByVMNics",
                    tip: "",
                    "values": [],
                    "width": "205",
                    "height": "200"
                };

                $scope.okBtn = {
                    "id": "bindElasticIPByVMOkBtn",
                    "text": i18n.common_term_ok_button,
                    "disable": true,
                    "click": function () {
                        $scope.command.bindElasticIPByVM();
                    }
                };
                $scope.cancelBtn = {
                    "id": "bindElasticIPByVMCancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#bindElasticIPWindowId").widget().destroy();
                    }
                };
                // 从VM请信中获取IP
                function getIpFromVm(vm) {
                    var ip = "";
                    if (vm && vm.vmSpecInfo) {
                        var nics = vm.vmSpecInfo.nics;
                        if (nics && nics.length) {
                            _.each(nics, function (item) {
                                if (item.ip) {
                                    ip += item.ip + ";";
                                }
                            });
                            var index = ip.lastIndexOf(";");
                            if (index > 0 && index === ip.length - 1) {
                                ip = ip.slice(0, index);
                            }
                        }
                    }
                    return ip;
                }

                //从虚拟机中获取mac地址
                function getMacFromVm(vm) {
                    var mac = "";
                    if (vm && vm.vmSpecInfo) {
                        var nics = vm.vmSpecInfo.nics;
                        if (nics && nics.length) {
                            _.each(nics, function (item) {
                                if (item.mac) {
                                    mac += item.mac + ";";
                                }
                            });
                            var index = mac.lastIndexOf(";");
                            if (index > 0 && index === mac.length - 1) {
                                mac = mac.slice(0, index);
                            }
                        }
                    }
                    return mac;
                }

                $scope.command = {
                    //查询虚拟机列表
                    "queryVMList": function (isInit) {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "user": $("html").scope().user,
                            "name": (isInit ? "" : $("#" + $scope.vmName.id).widget().getValue()),
                            "ip": (isInit ? "" : $("#" + $scope.vmIP.id).widget().getValue()),
                            "status": ["running", "stopped", "hibernated", "starting", "stopping", "migrating", "shutting-down", "hibernating", "rebooting"],
                            "networkType": "ROUTED_NETWORK",
                            "start": page.getStart(),
                            "limit": page.displayLength
                        };
                        var deferred = queryVmServiceIns.queryVmList(options);
                        var dealVmData = function (item) {
                            item.ipDisplay = getIpFromVm(item);
                            item.macDisplay = getMacFromVm(item);
                        };
                        deferred.then(function (data) {
                            var vmsRes = data.list.vms;
                            _.each(vmsRes, dealVmData);
                            $scope.bindVMTable.data = vmsRes;
                            $scope.bindVMTable.totalRecords = data.list.total;
                            $scope.bindVMTable.displayLength = page.displayLength;
                            $("#" + $scope.bindVMTable.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                            //清空网卡下拉框中的内容
                            $scope.bindVMNics.values = [];
                            $("#" + $scope.okBtn.id).widget().option("disable", true);
                        });
                    },
                    //查询虚拟机网卡信息
                    "queryVMNicInfo": function (vmId) {
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "user": $("html").scope().user,
                            "vmId": vmId
                        };
                        var deferred = queryVmServiceIns.queryVmDetail(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var nics = data.vm.nics;
                            var selArray = [];
                            _.each(nics, function (item, index) {
                                //过滤出路由网络
                                if("ROUTED_NETWORK" === item.networkType){
                                    selArray.push({
                                        "selectId": item.nicId,
                                        "label": (item.name + ": " + item.ip)
                                    });
                                    if(selArray && selArray.length > 0){
                                        selArray[0].checked = true;
                                    }
                                }
                            });
                            $scope.bindVMNics.values = selArray;
                            $("#" + $scope.okBtn.id).widget().option("disable", false);
                        });
                    },
                    //虚拟机绑定弹性IP
                    "bindElasticIPByVM": function () {
                        var elasticIp = params.eipId;
                        var vmId = $scope.bindVMId;
                        var nicId = $("#" + $scope.bindVMNics.id).widget().getSelectedId();
                        if (!elasticIp || !vmId || !nicId) {
                            return;
                        }
                        var options = {
                            "cloudInfraId": params.cloudInfraId,
                            "vpcId": params.vpcId,
                            "vdcId": params.vdcId,
                            "userId": params.userId,
                            "id": elasticIp,
                            "vmId": vmId,
                            "nicId": nicId,
                            "networkID": "",
                            "privateIP": ""
                        };
                        var deferred = eipServiceIns.bindElasticIPByVM(options);
                        deferred.then(function (data) {
                            $("#bindElasticIPWindowId").widget().destroy();
                        });
                    }
                };
                $scope.command.queryVMList(true);
            }
        ];

        var bindElasticIPByVMModule = angular.module("network.eip.bindElasticIPByVM", ['framework',"ngSanitize"]);
        bindElasticIPByVMModule.controller("network.eip.bindElasticIPByVM.ctrl", bindElasticIPByVMCtrl);
        bindElasticIPByVMModule.service("camel", http);
        bindElasticIPByVMModule.service("exception", exceptionService);
        return bindElasticIPByVMModule;
    });
