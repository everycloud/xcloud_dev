/*global define*/
define([
    'tiny-lib/jquery',
    "app/business/network/services/service/service",
    "app/services/commonService",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-lib/underscore",
    "fixtures/network/service/serviceFixture"
], function ($, Service, commonService, Window, Message, _, fixture) {
    "use strict";
    var detailCtrl = ["$scope", "camel", "$compile", "exception", "message", "$q", "networkCommon",
        function ($scope, camel, $compile, exception, message, $q, networkCommon) {
            var i18n = $scope.i18n;
            $scope.params = {
                "cloudInfraId": networkCommon.cloudInfraId,
                "vpcId": networkCommon.vpcId,
                "azId": networkCommon.azId,
                "userId": $scope.user.id,
                "vdcId": $scope.user.vdcId
            };
            $scope.hasPVM = undefined; //true, false
            $scope.pvm = {
                "pvmState": "",
                "vmInstanceInfo": {}
            };

            // 更新操作状态
            $scope.updateView = function () {
                $scope.pvm.pvmStateUI = networkCommon.getPVMStatus($scope.pvm.pvmState, $scope.pvm.vmInstanceInfo && $scope.pvm.vmInstanceInfo.status);
                //SUCCESS, FAILED, PROCESSING
                if ($scope.pvm.pvmStateUI == i18n.common_term_fail_label) {
                    $scope.info.stopBtn.disable = true;
                    $scope.info.startBtn.disable = true;
                } else if ($scope.pvm.pvmStateUI != i18n.common_term_running_value) {
                    $scope.info.stopBtn.disable = true;
                    $scope.info.startBtn.disable = false;
                } else {
                    $scope.info.stopBtn.disable = false;
                    $scope.info.startBtn.disable = true;
                }

                if($scope.pvm.pvmState === "SUCCESS" || $scope.pvm.pvmState === "FAILED"){
                    $scope.info.addNetworkBtn.disable = false;
                }
                else{
                    $scope.info.addNetworkBtn.disable = true;
                }

                // 处理中不允许删除pvm
                $scope.info.deleteBtn.disable = $scope.pvm.pvmStateUI === i18n.common_term_processing_value;
            };
            $scope.serviceSrv = new Service(exception, $q, camel);
            $scope.queryPVM = function () {
                //查询PVM
                var deferred = $scope.serviceSrv.queryPVM({
                    "vdcId": $scope.params.vdcId,
                    "vpcId": $scope.params.vpcId,
                    "userId": $scope.params.userId,
                    "cloudInfraId": $scope.params.cloudInfraId
                });
                deferred.then(function (data) {
                    if (!data) {
                        $scope.hasPVM = false;
                        return;
                    }
                    /* 处理逻辑：
                     * 1. 如果pvm vm信息不存在（即pvmInstanceInfo=null）
                     1.1 若当前PVM数据库状态为PROCESSING，则显示的状态为处理中
                     1.2 若当前PVM数据库状态非PROCESSING，则显示的状态为失败，不显示网络信息
                     2. 若PVM数据库状态为SUCCESS，则显示PVM虚拟机的具体状态，否则显示该数据库状态
                     3. 显示的网络信息以List<Nic>为准，这对Nic对应的网络：
                     3.1 若网络在PVM数据库中不存在，则该条网络状态为unknown
                     3.2 若网络为VSA管理网络，且非第一块网卡，则将其忽略，不对用户呈现
                     3.3 若PVM数据库状态为PROCESSING，且当前网络状态为unknown，则显示给用户的状态为处理中
                     3.4 非3.1 3.2 3.3场景的话，正常显示该网络及其状态
                     */
                    $scope.hasPVM = true;
                    $scope.pvm = data;
                    $scope.pvm.createTime = commonService.utc2Local($scope.pvm.createTime);
                    $scope.pvm.name = (data.vmInstanceInfo && data.vmInstanceInfo.name) || "";
                    $scope.pvm.pvmStateUI = networkCommon.getPVMStatus(data.pvmState, data.vmInstanceInfo && data.vmInstanceInfo.status);

                    $scope.updateView();

                    if (!data.vmInstanceInfo && $scope.pvm.pvmStateUI === i18n.common_term_fail_label) {
                        return;
                    }
                    // unused nic界面不显示
                    // 若网络为VSA管理网络，且非第一块网卡，则将其忽略，不对用户呈现
                    data.networkInfos = _.reject(data.networkInfos, function (item, index) {
                        return "unused" === item.status || (index !== 0 && item.networkType === "VSA_MANAGER_NETWORK");
                    });
                    var nics = networkCommon.getTransNicList(data.networkInfos);

                    // 页面需要显示对应网卡的ip，ip来源：vmInstanceInfo中nics对象，判断条件networkid一致
                    if (data.vmInstanceInfo && data.vmInstanceInfo.nics && data.vmInstanceInfo.nics.length > 0) {
                        _.each(nics, function (netNicItem) {
                            _.each(data.vmInstanceInfo.nics, function (vmNicItem) {
                                if (netNicItem.nicId && vmNicItem.id && (vmNicItem.id + "").indexOf(netNicItem.nicId + "") != -1) {
                                    _.extend(netNicItem, {
                                        "nicIp": vmNicItem.ip || ""
                                    });
                                }
                            });
                        });
                    }

                    // 管理网络要放置在最前面
                    $scope.info.networkInfo.data = nics.sort(function (nic1, nic2) {
                        return nic1.networkTypeUI === i18n.resource_term_vsaNet_label ? -1 : 1;
                    });
                });
            };

            $scope.help = {
                "helpKey": "drawer_vpc_service",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.url = {
                navigate: "../src/app/business/network/views/service/navigate.html",
                detail: "../src/app/business/network/views/service/detail.html"
            };
            $scope.create = function () {
                var options = {
                    "winId": "createNetworkWindow",
                    title: i18n.vpc_term_applyDeploy_button,
                    height: "500px",
                    width: "850px",
                    "content-type": "url",
                    "params": $scope.params, //传输的数据
                    "content": "app/business/network/views/service/createService.html",
                    "buttons": null
                };
                var win = new Window(options);
                win.show();
            };
            $scope.info = {
                startBtn: {
                    "id": "vpc-deployservice-start",
                    "text": i18n.common_term_startup_button,
                    "icon": {
                        left: "opt-start"
                    },
                    "disable": false,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vpc_deployService_startup_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceSrv.operatePVM({
                                    "vdcId": $scope.params.vdcId,
                                    "vpcId": $scope.params.vpcId,
                                    "userId": $scope.params.userId,
                                    "cloudInfraId": $scope.params.cloudInfraId,
                                    "operate": {
                                        "action": "Start"
                                    }
                                });
                                deferred.then(function (data) {
                                    $scope.pvm.pvmState = "PROCESSING";
                                    $scope.updateView();
                                });
                            }
                        });
                    }
                },
                stopBtn: {
                    "id": "vpc-deployservice-stopBtn",
                    "text": i18n.common_term_stop_button,
                    "icon": {
                        left: "opt-stop"
                    },
                    "disable": false,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vpc_deployService_stop_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceSrv.operatePVM({
                                    "vdcId": $scope.params.vdcId,
                                    "vpcId": $scope.params.vpcId,
                                    "userId": $scope.params.userId,
                                    "cloudInfraId": $scope.params.cloudInfraId,
                                    "operate": {
                                        "action": "Stop"
                                    }
                                });
                                deferred.then(function (data) {
                                    $scope.pvm.pvmState = "PROCESSING";
                                    $scope.updateView();
                                });
                            }
                        });
                    }
                },
                addNetworkBtn: {
                    "id": "vpc-deployservice-addNetworkBtn",
                    "text": i18n.vpc_term_addNet_button,
                    "icon": {
                        left: "opt-modify"
                    },
                    "disable": false,
                    "click": function () {
                        var options = {
                            "winId": "rebuildNetworkWindow",
                            "title": i18n.vpc_term_addNet_button,
                            "height": "500px",
                            "width": "850px",
                            "params": $scope.params, //传输的数据
                            "mode": "add",
                            "bindedNetworks": $scope.info.networkInfo.data,
                            "content-type": "url",
                            "content": "app/business/network/views/service/modifyService.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                deleteBtn: {
                    "id": "vpc-deployservice-deleteBtn",
                    "text": i18n.common_term_delete_button,
                    "icon": {
                        left: "opt-delete"
                    },
                    "disable": false,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vpc_deployService_del_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceSrv.deletePVM({
                                    "vdcId": $scope.params.vdcId,
                                    "vpcId": $scope.params.vpcId,
                                    "userId": $scope.params.userId,
                                    "cloudInfraId": $scope.params.cloudInfraId
                                });
                                deferred.then(function (data) {
                                    $scope.queryPVM();
                                });
                            }
                        });
                    }
                },
                name: {
                    "id": "vpc-deployservice-info-name",
                    "label": i18n.common_term_name_label + ":",
                    "require": false
                },
                status: {
                    "id": "vpc-deployservice-info-status",
                    "label": i18n.common_term_status_label + ":",
                    "require": false
                },
                createTime: {
                    "id": "vpc-deployservice-info-createTime",
                    "label": i18n.common_term_createAt_label + ":",
                    "require": false
                },
                networkInfo: {
                    "id": "create-deployservice-networkInfo-listtable",
                    "columns": [
                        {
                            "sTitle": i18n.vpc_term_netName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkName);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_NICname_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.nicName);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_IP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.nicIp);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_netType_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.networkTypeUI);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusUI);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "15%",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        if (iDataIndex === 0) {
                            return;
                        }
                        // 操作
                        var opt = ($scope.pvm.pvmState === "PROCESSING") ?
                            "<div><a class='disabled'>" + i18n.common_term_modify_button + "</a> <a class='disabled'>" + i18n.common_term_delete_button + "</a></div>" : "<div><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a><a class='btn-link margin-left-beautifier' ng-click='deleter()'>" + i18n.common_term_delete_button + "</a></div>";

                        var optLink = $compile(opt);
                        var optScope = $scope.$new();
                        optScope.data = aData;
                        optScope.modify = function () {
                            var options = {
                                "winId": "rebuildNetworkWindow",
                                "title": i18n.vpc_term_modifyAssociateNet_button,
                                "height": "500px",
                                "width": "850px",
                                "params": $scope.params, //传输的数据
                                "mode": "modify",
                                "bindedNetworks": $scope.info.networkInfo.data,
                                "modifyNetwork": optScope.data,
                                "content-type": "url",
                                "content": "app/business/network/views/service/modifyService.html",
                                "buttons": null
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        optScope.deleter = function () {
                            message.warnMsgBox({
                                "content": i18n.vm_nic_del_info_confirm_msg,
                                "callback": function () {
                                    var networks = [
                                        {
                                            "nicId": aData.nicId,
                                            "networkId": aData.networkId,
                                            "operationType": "NIC_DELETE"
                                        }
                                    ];
                                    var deferred = $scope.serviceSrv.modifyPVM({
                                        "vdcId": $scope.params.vdcId,
                                        "vpcId": $scope.params.vpcId,
                                        "userId": $scope.params.userId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "data": {
                                            pvmNetworks: networks
                                        }
                                    });
                                    deferred.then(function (data) {
                                        $scope.queryPVM();
                                    });
                                }
                            });
                        };
                        var optNode = optLink(optScope);
                        $("td:eq(5)", nRow).html(optNode);
                    }
                }
            };

            $scope.$on("createdPVMSuccessEvent", function listener(event) {
                $scope.queryPVM();
            });
            //当ui-view视图加载成功后的事件
            $scope.$on("$viewContentLoaded", function () {
                $scope.queryPVM();
            });

        }
    ];
    return detailCtrl;
});
