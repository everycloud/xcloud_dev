/* global define*/
define(["tiny-lib/jquery",
    "tiny-widgets/Window",
    "app/business/network/services/vlb/vlbService",
    "app/business/network/services/eip/eipService",
    "app/services/commonService",
    "tiny-lib/underscore",
    "bootstrap/bootstrap.min",
    "app/services/messageService",
    "fixtures/network/vlb/vlbFixture"
], function ($, Window, vlbService, eipService, commonService, _, bootstrap, messageService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "camel", "$state", "message", "exception", "networkCommon",
        function ($scope, $compile, $q, camel, $state, message, exception, networkCommon) {
            var i18n = $scope.i18n;
            var VLB_OPERATE = "560002";
            var privilegeList = $scope.user.privilegeList;
            $scope.hasVLBOperateRight = _.contains(privilegeList, VLB_OPERATE);

            var messageServiceIns = new messageService();
            var isIT = $scope.user.cloudType === "IT";
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.serviceInstance = new vlbService(exception, $q, camel);

            $scope.createBtn = {
                "id": "vpcmanager-vlblist-create",
                "text": i18n.common_term_create_button,
                "icon": {
                    left: "opt-add"
                },
                "click": function () {
                    if(isIT){
                        $state.go("network.createVLB.navigate", {
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId
                        });
                    }
                    else {
                        $state.go("network.createICTVLB.navigate", {
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId
                        });
                    }
                }
            };

            $scope.refresh = {
                "id": "vlbListRefresh",
                "click": function () {
                    $scope.queryVLBs();
                }
            };

            $scope.help = {
                "helpKey": "drawer_vlb",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            // 存储当前下钻的虚拟机信息
            $scope.currentItem = undefined;

            $scope.vlbTable = {
                "id": "vpcmanager-vlblist-listtable",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "showDetails": true,
                "totalRecords": 0,
                "columnsDraggable":true,
                "columns": getTableColumns(isIT),
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryVLBs();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.queryVLBs();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(3)", nRow).addTitle();
                    var widgetThis = this;
                    widgetThis.renderDetailTd.apply(widgetThis, arguments);
                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        aData.cloudInfraId = networkCommon.cloudInfraId;
                        $scope.currentItem = aData;
                    });
                    if (!$scope.hasVLBOperateRight) {
                        return;
                    }
                    var  listenerProtocol = aData.listeners[0].protocol;
                    var okStatus = aData.status === "READY" || aData.status === "FAULT";
                    var submenus = '<span class="dropdown margin-horizon-beautifier" style="position: static">';
                    if (isIT) {
                        submenus += '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>';
                        submenus += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                        submenus += okStatus ? '<li><a class="btn-link" ng-click="deleteListener()">' + i18n.lb_term_delListen_button + '</a></li>' : '<li class="disabled"><a>' + i18n.lb_term_delListen_button + '</a></li>';
                        submenus += okStatus ? '<li><a class="btn-link" ng-click="modListenersConfig()">' + i18n.app_term_modifyListenCfg_button + '</a></li>' : '<li class="disabled"><a>' + i18n.app_term_modifyListenCfg_button + '</a></li>';
                        submenus += okStatus ? '<li><a class="btn-link" ng-click="configVm()">' + i18n.lb_term_bondUnbondVM_button + '</a></li>' : '<li class="disabled"><a>' + i18n.lb_term_bondUnbondVM_button + '</a></li>';
                        submenus += okStatus ? '<li><a class="btn-link" ng-click="freezeVlb()">' + i18n.common_term_freeze_button + '</a></li>' : '<li class="disabled"><a>' + i18n.common_term_freeze_button + '</a></li>';
                        submenus += (aData.uiStatus === i18n.common_term_stoped_value) ? '<li><a class="btn-link" ng-click="unFreezeVlb()">' + i18n.common_term_unfreeze_value + '</a></li>' : '<li class="disabled"><a>' + i18n.common_term_unfreeze_value + '</a></li>';
                        submenus += (okStatus && (!aData.lbIp || aData.lbIp.length === 0)) ? '<li><a class="btn-link" ng-click="bindFloatIpIct()">' + i18n.vpc_term_bondEIP_label + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_bondEIP_label + '</a></li>';
                        submenus += (okStatus && aData.lbIp && aData.lbIp.length > 0) ? '<li><a class="btn-link" ng-click="unBindFloatIp()">' + i18n.common_term_unbondEIP_button + '</a></li>' : '<li class="disabled"><a>' + i18n.common_term_unbondEIP_button + '</a></li>';
                        submenus += '<li><a class="btn-link" ng-click="delete()">' + i18n.lb_term_del_button + '</a></li>' + '</ul></span>';
                    }
                    else {
                        submenus += '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>';
                        submenus += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                        submenus += '<li><a class="btn-link" ng-click="modVlbSessionPre()">' + i18n.lb_term_modifyStickySession_button + '</a></li>';
                        submenus += '<li><a class="btn-link" ng-click="modHealthCheck()">' + i18n.lb_term_modifyHealthCheck_button + '</a></li>';
                        submenus += '<li><a class="btn-link" ng-click="bindingVmIct()">' + i18n.org_term_bondVM_button + '</a></li>';
                        submenus += '<li><a class="btn-link" ng-click="unBindingVmIct()">' + i18n.common_term_unbondVM_button + '</a></li>';
                        submenus += (((!aData.lbIp || aData.lbIp.length === 0) && aData.isRouterNetwork)) ? '<li><a class="btn-link" ng-click="bindFloatIpIct()">' + i18n.vpc_term_bondEIP_label + '</a></li>' : '<li class="disabled"><a>' + i18n.vpc_term_bondEIP_label + '</a></li>';
                        submenus += (aData.lbIp && aData.lbIp.length > 0) ? '<li><a class="btn-link" ng-click="unBindFloatIp()">' + i18n.common_term_unbondEIP_button + '</a></li>' : '<li class="disabled"><a>' + i18n.common_term_unbondEIP_button + '</a></li>';
                        submenus += '<li><a class="btn-link" ng-click="delete()">' + i18n.lb_term_del_button + '</a></li>' + '</ul></span>';
                    }
                    // 操作
                    var opt = "";
                    if (isIT) {
                        opt = okStatus ? ("<div><a class='btn-link' ng-click='addListener()'>" + i18n.lb_term_addListen_button + "</a>" + submenus + "</div>") : ("<div><a class='disabled'>" + i18n.lb_term_addListen_button + "</a>" + submenus + "</div>");
                    }
                    else {
                        opt = "<div><a class='btn-link' ng-click='modVlbBasicInfo()'>" + i18n.lb_term_modifyVLBbasicInfo_button + "</a>" + submenus + "</div>";
                    }
                    var optLink = $compile(opt);
                    var optScope = $scope.$new();
                    var param = {
                        "lbID": aData.lbID,
                        "cloudInfraId": networkCommon.cloudInfraId,
                        "tenantId": $scope.user.orgId,
                        "userId": $scope.user.id,
                        "lbName": aData.lbName,
                        "sessionNum": aData.lbParameters && aData.lbParameters[0].sessionNum || 1,
                        "distributionMode": aData.listeners && aData.listeners[0].distributionMode || 0,
                        "sessionPre": aData.listeners && aData.listeners[0].sessionPre || {},
                        "healthCheckInfo": aData.listeners && aData.listeners[0].healthCheckInfo && aData.listeners[0].healthCheckInfo[0] || {}
                    };
                    optScope.modVlbBasicInfo = function () {
                        param.isOKBttnClick = false;
                        var configs = {
                            "winId": "modVlbBasicInfoWindow",
                            "scope": $scope,
                            "mode": "mod",
                            "modData": param,
                            "title": i18n.lb_term_modifyVLBbasicInfo_button,
                            "height": "250px",
                            "width": "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/modVlbBasicInfo.html",
                            "close": function () {
                                if (param.isOKBttnClick) {
                                    $scope.queryVLBs();
                                }
                            },
                            "buttons": null
                        };
                        var win = new Window(configs);
                        win.show();
                    };

                    optScope.modVlbSessionPre = function () {
                        param.isOKBttnClick = false;
                        var configs = {
                            "winId": "modVlbSessionPreWindow",
                            "scope": $scope,
                            "mode": "mod",
                            "modData": param,
                            "title": i18n.lb_term_modifyStickySession_button,
                            "listenerProtocol":listenerProtocol,
                            "height": "200px",
                            "width": "400px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/modSessionPre.html",
                            "close": function () {
                                if (param.isOKBttnClick) {
                                    $scope.queryVLBs();
                                }
                            },
                            "buttons": null
                        };
                        var win = new Window(configs);
                        win.show();
                    };

                    optScope.modHealthCheck = function () {
                        param.isOKBttnClick = false;
                        var configs = {
                            "winId": "modVlbHealthCheck",
                            "scope": $scope,
                            "mode": "mod",
                            "modData": param,
                            "title": i18n.lb_term_modifyHealthCheck_button,
                            "height": "380px",
                            "width": "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/modHealthCheck.html",
                            "close": function () {
                                if (param.isOKBttnClick) {
                                    $scope.queryVLBs();
                                }
                            },
                            "buttons": null
                        };
                        var win = new Window(configs);
                        win.show();
                    };

                    // 绑定VM ----ICT场景
                    optScope.bindingVmIct = function () {
                        var condition = {
                            "backPort": aData.listeners && aData.listeners[0].bindingVM && aData.listeners[0].bindingVM[0]&&aData.listeners[0].bindingVM[0].servicePort,
                            "lbID": aData.lbID,
                            "okClick": false
                        };
                        var options = {
                            "winId": "bindingVmWindowId",
                            "title": i18n.org_term_bondVM_button,
                            "condition": condition,
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId,
                            "user": $scope.user,
                            "height": "400px",
                            "width": "650px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/bindingVmIct.html",
                            "close": function () {
                                if (condition.okClick) {
                                    $scope.queryVLBs();
                                }
                            },
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    // 解绑定VM ----ICT场景
                    optScope.unBindingVmIct = function () {
                        var condition = {
                            "backPort": aData.listeners && aData.listeners[0].port,
                            "vms": aData.listeners && aData.listeners[0].bindingVM,
                            "lbID": aData.lbID,
                            "okClick": false
                        };
                        var options = {
                            "winId": "unbindVmWindowId",
                            "title": i18n.common_term_unbondVM_button,
                            "condition": condition,
                            "vpcId": networkCommon.vpcId,
                            "cloudInfra": networkCommon.cloudInfraId,
                            "user": $scope.user,
                            "height": "400px",
                            "width": "650px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/unbindingVmIct.html",
                            "close": function () {
                                if (condition.okClick) {
                                    $scope.queryVLBs();
                                }
                            },
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    // 绑定弹性ip ----ICT场景
                    optScope.bindFloatIpIct = function () {
                        var eipServiceIns = new eipService(exception, $q, camel);
                        var option = {
                            "cloudInfraId": networkCommon.cloudInfraId,
                            "vdcId": $scope.user.orgId,
                            "userId": $scope.user.id,
                            "vpcId": networkCommon.vpcId
                        };
                        var promise = eipServiceIns.queryElasticIPAll(option);
                        promise.then(function (resolvedValue) {
                            var eips = [];
                            _.each(resolvedValue.elasticIPs, function (item) {
                                if (item.resourceStatus === "UNBIND") {
                                    eips.push({
                                        "selectId": item.id,
                                        "label": item.ip
                                    });
                                }
                            });
                            if (eips.length > 0) {
                                eips[0].checked = true;
                            }
                            var condition = {
                                "lbID": aData.lbID,
                                "okClick": false,
                                "eips": eips
                            };
                            var options = {
                                "winId": "bindingEipWindowId",
                                "title": i18n.vpc_term_bondEIP_label,
                                "condition": condition,
                                "vpcId": networkCommon.vpcId,
                                "cloudInfra": networkCommon.cloudInfraId,
                                "user": $scope.user,
                                "height": "180px",
                                "width": "400px",
                                "content-type": "url",
                                "content": "app/business/network/views/vlb/bindingEip.html",
                                "close": function () {
                                    if (condition.okClick) {
                                        $scope.queryVLBs();
                                    }
                                },
                                "buttons": null
                            };
                            var win = new Window(options);
                            win.show();
                        });
                    };
                    optScope.addListener = function () {
                        // 保存前后端端口
                        var usedServicePorts = [];
                        var usedBackPorts = [];
                        var promise = $scope.serviceInstance.queryVLB({
                            "cloudInfraId": networkCommon.cloudInfraId,
                            "vdcId": $scope.user.vdcId,
                            "userId": $scope.user.id,
                            "lbID": aData.lbID
                        });
                        promise.then(function (resolvedValue) {
                            if (resolvedValue && resolvedValue.listeners && resolvedValue.listeners.length > 0) {
                                // 监听器个数10个限制
                                if (resolvedValue.listeners.length >= 10) {
                                    messageServiceIns.failMsgBox(i18n.lb_lb_addListen_info_max_msg);
                                    return;
                                }
                                _.each(resolvedValue.listeners, function (item) {
                                    usedServicePorts.push(item.port.toString());
                                    usedBackPorts.push(item.backPort.toString());
                                });
                            }
                            $state.go("network.createVLB.navigate", {
                                "vpcId": networkCommon.vpcId,
                                "cloudInfra": networkCommon.cloudInfraId,
                                "lbID": aData.lbID,
                                "workingMode": resolvedValue.lbParameters[0].qosInfo[0].value
                            });
                        });
                    };

                    // 删除监听器
                    optScope.deleteListener = function () {
                        // 保存前后端端口
                        var listeners = [];
                        var promise = $scope.serviceInstance.queryVLB({
                            "cloudInfraId": networkCommon.cloudInfraId,
                            "vdcId": $scope.user.vdcId,
                            "userId": $scope.user.id,
                            "lbID": aData.lbID
                        });
                        promise.then(function (resolvedValue) {
                            if (resolvedValue && resolvedValue.listeners && resolvedValue.listeners.length > 0) {
                                _.each(resolvedValue.listeners, function (item) {
                                    listeners.push({
                                        "lbID": resolvedValue.lbID,
                                        "id": item.id,
                                        "protocol": item.protocol,
                                        "backendProtocol": item.protocol,
                                        "extendPort": item.port,
                                        "backendPort": item.backPort,
                                        "status": $scope.serviceInstance.transStatusToUiStatus(item.status)
                                    });
                                });
                                var options = {
                                    "winId": "delMonitorWindow",
                                    "listeners": listeners,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    title: i18n.lb_term_delListen_button,
                                    height: "250px",
                                    width: "600px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/delMonitorWindow.html",
                                    "buttons": null
                                };
                                var win = new Window(options);
                                win.show();
                            }
                        });
                    };

                    // 修改监听器配置信息
                    optScope.modListenersConfig = function () {
                        // 保存前后端端口
                        var listeners = [];
                        var promise = $scope.serviceInstance.queryVLB({
                            "cloudInfraId": networkCommon.cloudInfraId,
                            "vdcId": $scope.user.vdcId,
                            "userId": $scope.user.id,
                            "lbID": aData.lbID
                        });
                        promise.then(function (resolvedValue) {
                            if (resolvedValue && resolvedValue.listeners && resolvedValue.listeners.length > 0) {
                                listeners = resolvedValue.listeners;
                                var options = {
                                    "winId": "modConfigWindow",
                                    "listeners": listeners,
                                    "workingMode": resolvedValue.lbParameters[0].qosInfo[0].value, // “LBPerformance”取值: high,low
                                    "lbID": resolvedValue.lbID,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    title: i18n.app_term_modifyListenCfg_button,
                                    height: "450px",
                                    width: "800px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/modListenersConfig.html",
                                    "buttons": null
                                };
                                var win = new Window(options);
                                win.show();
                            }
                        });
                    };

                    // 配置虚拟机信息
                    optScope.configVm = function () {
                        // 保存前后端端口
                        var listeners = [];
                        var isOKBttnClick = false;
                        var promise = $scope.serviceInstance.queryVLB({
                            "cloudInfraId": networkCommon.cloudInfraId,
                            "vdcId": $scope.user.vdcId,
                            "userId": $scope.user.id,
                            "lbID": aData.lbID
                        });
                        promise.then(function (resolvedValue) {
                            if (resolvedValue && resolvedValue.listeners && resolvedValue.listeners.length > 0) {
                                listeners = resolvedValue.listeners;
                                var options = {
                                    "winId": "listBindVmWindow",
                                    "listeners": listeners,
                                    "lbID": resolvedValue.lbID,
                                    "isOKBttnClick": isOKBttnClick,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "vpcId": networkCommon.vpcId,
                                    title: i18n.lb_term_bondUnbondVM_button,
                                    height: "450px",
                                    width: "800px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/listBindVm.html",
                                    "buttons": null,
                                    "close": function () {
                                        if (isOKBttnClick) {
                                            $scope.queryVLBs();
                                        }
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            }
                        });
                    };

                    optScope["delete"] = function () {
                        message.warnMsgBox({
                            "content": i18n.lb_lb_del_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceInstance.deleteVLB({
                                    "vdcId": $scope.user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "vpcId": networkCommon.vpcId,
                                    "userId": $scope.user.id,
                                    "id": aData.lbID
                                });
                                deferred.then(function () {
                                    $scope.queryVLBs();
                                });
                            }
                        });
                    };
                    optScope.freezeVlb = function () {
                        message.warnMsgBox({
                            "content": i18n.lb_lb_freeze_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceInstance.operateVLB({
                                    "vdcId": $scope.user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "userId": $scope.user.id,
                                    "opParam": {
                                        "freeze": {
                                            "lbId": aData.lbID
                                        }
                                    }
                                });
                                deferred.then(function () {
                                    $scope.queryVLBs();
                                });
                            }
                        });
                    };
                    optScope.unFreezeVlb = function () {
                        message.warnMsgBox({
                            "content": i18n.lb_lb_thaw_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceInstance.operateVLB({
                                    "vdcId": $scope.user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "userId": $scope.user.id,
                                    "opParam": {
                                        "unfreeze": {
                                            "lbId": aData.lbID
                                        }
                                    }
                                });
                                deferred.then(function () {
                                    $scope.queryVLBs();
                                });
                            }
                        });
                    };
                    optScope.bindFloatIp = function () {
                        message.warnMsgBox({
                            "content": i18n.lb_lb_bondEIP_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceInstance.applyElasticIP({
                                    "vdcId": $scope.user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "userId": $scope.user.id,
                                    "vpcId": networkCommon.vpcId,
                                    "maxRxBandwidth": 4000,
                                    "maxTxBandwidth": 4000
                                });
                                deferred.then(function (ipData) {
                                    if (ipData && ipData.ip) {
                                        var deferred2 = $scope.serviceInstance.operateVLB({
                                            "vdcId": $scope.user.vdcId,
                                            "cloudInfraId": networkCommon.cloudInfraId,
                                            "userId": $scope.user.id,
                                            "opParam": {
                                                "bindingPublicIPToLB": {
                                                    "lbId": aData.lbID,
                                                    "ip": ipData.ip
                                                }
                                            }
                                        });
                                        deferred2.then(function () {
                                            $scope.queryVLBs();
                                        });
                                    }
                                });
                            }
                        });
                    };
                    optScope.unBindFloatIp = function () {
                        message.warnMsgBox({
                            "content": i18n.lb_lb_unbondEIP_info_confirm_msg,
                            "callback": function () {
                                var deferred = $scope.serviceInstance.operateVLB({
                                    "vdcId": $scope.user.vdcId,
                                    "cloudInfraId": networkCommon.cloudInfraId,
                                    "userId": $scope.user.id,
                                    "opParam": {
                                        "unbindPublicIPFromLB": {
                                            "ip": aData.lbIp
                                        }
                                    }
                                });
                                deferred.then(function () {
                                    $scope.queryVLBs();
                                });
                            }
                        });
                    };
                    var optNode = optLink(optScope);

                    var optColumnDom = isIT ? $("td:eq(10)", nRow) : $("td:eq(9)", nRow);
                    optColumnDom.append(optNode);
                    optNode.find('.dropdown').dropdown();

                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    $("td:eq(8)", nRow).addTitle();
                    if (isIT) {
                        $("td:eq(9)", nRow).addTitle();
                    }

                }
            };
            //查询VLB
            $scope.queryVLBs = function () {
                var promise = $scope.serviceInstance.queryVLBs({
                    "vdcId": $scope.user.vdcId,
                    "cloudInfraId": networkCommon.cloudInfraId,
                    "vpcId": networkCommon.vpcId,
                    "azId": networkCommon.azId,
                    "userId": $scope.user.id,
                    "start": page.getStart(),
                    "limit": page.displayLength
                });
                promise.then(function (resolvedValue) {
                    //请求成功
                    if (resolvedValue && resolvedValue.lbInfos && resolvedValue.lbInfos.length > 0) {
                        // 处理json对象到页面展示
                        _.each(resolvedValue.lbInfos, function (vlb) {

                            // 设置表格参数
                            vlb.typeUI = i18n.lb_term_softLB_label;
                            vlb.maxSessionUI = "";
                            vlb.maxInoutUI = "";
                            vlb.outIPUI = "";
                            if (vlb.lbParameters && vlb.lbParameters[0]) {
                                vlb.maxSessionUI = vlb.lbParameters[0].sessionNum;
                                vlb.maxInoutUI = vlb.lbParameters[0].maxThroughput;
                                if (vlb.lbParameters[0].qosInfo && vlb.lbParameters[0].qosInfo[0].value === "high") {
                                    vlb.typeUI = i18n.lb_term_hardLB_label;
                                }
                            }

                            if (!isIT) {
                                vlb.policyUI = "";
                                if (vlb.listeners && vlb.listeners.length > 0) {
                                    var map = {0: i18n.lb_term_poolingMode_label, 1: i18n.lb_term_minConnectMode_label};
                                    vlb.policyUI = map[vlb.listeners[0].distributionMode];
                                }
                                vlb.sessionModeUI = "";
                                if (vlb.listeners && vlb.listeners.length > 0 && vlb.listeners[0].sessionPre) {
                                    var session = vlb.listeners[0].sessionPre;
                                    var sessionMap = {5: "APP_COOKIE(" + session.cookieName + ")", 6: "HTTP_COOKIE", 7: "SOURCE_IP"};
                                    vlb.sessionModeUI = sessionMap[session.sessionRemainMode];
                                }
                            }

                            if (vlb.slbVmInfo) {
                                vlb.outIPUI = vlb.slbVmInfo.extIP;
                            }
                            vlb.uiStatus = $scope.serviceInstance.transStatusToUiStatus(vlb.status);
                            vlb.createTime = commonService.utc2Local(vlb.createTime);

                            _.extend(vlb, {
                                "showDetail": "",
                                "opt": "",
                                "detail": {
                                    contentType: "url",
                                    content: "app/business/network/views/vlb/vlbDetail.html"
                                }
                            });
                        });
                        $scope.vlbTable.data = resolvedValue.lbInfos;
                        $scope.vlbTable.totalRecords = resolvedValue.total;
                    } else {
                        $scope.vlbTable.data = [];
                        $scope.vlbTable.totalRecords = 0;
                    }
                });
            };

            function getTableColumns(isIT) {
                if (isIT) {
                    return [{
                        "sTitle": "",
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lbName);
                        },
                        "sWidth": "100",
                        "bSortable": false
                    }, {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lbID);
                        },
                        "sWidth": "100",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.uiStatus);
                        },
                        "sWidth": "50",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.typeUI);
                        },
                        "sWidth": "100",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.lb_term_sessionMaxNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.maxSessionUI);
                        },
                        "sWidth": "80",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.lb_term_throughputMaxKbps_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.maxInoutUI);
                        },
                        "sWidth": "110",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_externalIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.outIPUI);
                        },
                        "sWidth": "110",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.eip_term_eip_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lbIp);
                        },
                        "sWidth": "110",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "100",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opt",
                        "bSortable": false
                    }];
                }
                else {
                    return [
                        {
                            "sTitle": "",
                            "mData": "showDetail",
                            "bSearchable": false,
                            "bSortable": false,
                            "sWidth": "30"
                        },
                        {
                            "sTitle": i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.lbName);
                            },
                            "sWidth": "100",
                            "bSortable": false
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.lbID);
                            },
                            "sWidth": "100",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.typeUI);
                            },
                            "sWidth": "100",
                            "bSortable": true
                        },
                        {
                            "sTitle": i18n.lb_term_sessionMaxNum_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.maxSessionUI);
                            },
                            "sWidth": "80",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_stickySession_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.sessionModeUI);
                            },
                            "sWidth": "110",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignPolicy_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.policyUI);
                            },
                            "sWidth": "100",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_externalIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.outIPUI);
                            },
                            "sWidth": "110",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.eip_term_eip_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.lbIp);
                            },
                            "sWidth": "110",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "bSortable": false
                        }
                    ];
                }
            }


            $scope.$on("$viewContentLoaded", function () {
                $scope.queryVLBs();
            });
        }
    ];
    return ctrl;
});
