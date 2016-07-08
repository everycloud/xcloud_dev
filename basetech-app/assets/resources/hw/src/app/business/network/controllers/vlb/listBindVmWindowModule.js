/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        'tiny-lib/underscore',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/messageService",
        'app/services/exceptionService',
        "app/business/network/services/vlb/vlbService",
        "tiny-widgets/Window",
        "language/keyID",
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (angular, $, _, http, UnifyValid, validatorService, messageService, exception, vlbService, Window, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                $scope.vlbServiceInst = new vlbService(exception, $q, camel);
                var user = $("html").scope().user || {};
                var bindVmDom = $("#listBindVmWindow");

                // 父窗口传递的添加对象
                var listeners = bindVmDom.widget().option("listeners");
                var cloudInfraId = bindVmDom.widget().option("cloudInfraId");
                var vpcId = bindVmDom.widget().option("vpcId");
                var lbID = bindVmDom.widget().option("lbID");
                var isOKBttnClick = bindVmDom.widget().option("isOKBttnClick");

                // 保存监听器原始的虚拟机绑定相关信息（绑定解绑虚拟机需要区分新增 以及删除）
                var oldListeners = [];
                _.each(listeners, function (item) {
                    var tmpReq = {};
                    tmpReq.id = item.id;
                    tmpReq.bindingVM = item.bindingVM;
                    tmpReq.servicePort = -1;
                    tmpReq.weight = -1;
                    oldListeners.push(tmpReq);
                });

                $scope.close = function () {
                    bindVmDom.widget().destroy();
                };

                $scope.info = {
                    httpVMTable: {
                        "id": "create-vlb-bindvm-httpVMTable",
                        "enablePagination": false,
                        "draggable": true,
                        "columns": [{
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backPort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vm_term_vmName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var optScope = $scope.$new();

                            optScope.bindVm = function () {
                                var param = [];
                                var condition = {
                                    "backPort": aData.backPort,
                                    "okClick": "false"
                                };
                                var options = {
                                    "winId": "bindVmWindowId",
                                    title: i18n.org_term_bondVM_button,
                                    param: param,
                                    condition: condition,
                                    "cloudInfraId": cloudInfraId,
                                    "vpcId": vpcId,
                                    height: "400px",
                                    width: "650px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/create/bindVmWindow.html",
                                    "buttons": null,
                                    "close": function () {
                                        if ("true" === condition.okClick) {
                                            var portsVm = [];
                                            var tmpParam = [];
                                            _.each($scope.info.httpVMTable.data, function (item) {
                                                portsVm.push(item);
                                            });
                                            // 过滤掉已经绑定的重复项
                                            for (var paramItem in param) {
                                                if (param.hasOwnProperty(paramItem)) {
                                                    var isContain = false;
                                                    for (var port in portsVm) {
                                                        if (portsVm.hasOwnProperty(port)) {
                                                            // 后端端口  虚拟机IP 都相同(LB虚拟机信息中的id顺序不对，不使用id匹配)
                                                            if (param[paramItem].backPort === portsVm[port].backPort && param[paramItem].ip === portsVm[port].ip) {
                                                                isContain = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (!isContain) {
                                                        tmpParam.push(param[paramItem]);
                                                    }
                                                }
                                            }

                                            // 插入到操作行的下一行
                                            _.each(tmpParam, function (item) {
                                                portsVm.splice(iDataIndex + 1, 0, item);
                                            });
                                            $scope.$apply(function () {
                                                $scope.info.httpVMTable.data = portsVm;
                                            });
                                        }
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };
                            optScope.remove = function () {
                                $scope.info.httpVMTable.data = _.reject($scope.info.httpVMTable.data, function (item, index) {
                                    return index === iDataIndex;
                                });
                            };
                            // 操作
                            var opt = "";
                            if (!aData.ip || aData.ip === "") {
                                opt = "<div><a class='btn-link' ng-click='bindVm()'>" + i18n.org_term_bondVM_button + "</a></div>";
                            } else {
                                opt = "<div><a class='btn-link' ng-click='remove()'>" + i18n.common_term_unbondVM_button + "</a></div>";
                            }

                            var optLink = $compile(opt);
                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).append(optNode);

                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                        }
                    },
                    httpsVMTable: {
                        "id": "create-vlb-bindvm-httpsVMTable",
                        "enablePagination": false,
                        "draggable": true,
                        "columns": [{
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backPort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vm_term_vmName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var optScope = $scope.$new();
                            optScope.bindVm = function () {
                                var param = [];
                                var condition = {
                                    "backPort": aData.backPort,
                                    "okClick": "false"
                                };
                                var options = {
                                    "winId": "bindVmWindowId",
                                    title: i18n.org_term_bondVM_button,
                                    param: param,
                                    condition: condition,
                                    "cloudInfraId": cloudInfraId,
                                    "vpcId": vpcId,
                                    height: "400px",
                                    width: "650px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/create/bindVmWindow.html",
                                    "buttons": null,
                                    "close": function () {
                                        if ("true" === condition.okClick) {
                                            var portsVm = [];
                                            var tmpParam = [];
                                            _.each($scope.info.httpsVMTable.data, function (item) {
                                                portsVm.push(item);
                                            });
                                            // 过滤掉已经绑定的重复项
                                            for (var paramItem in param) {
                                                if (param.hasOwnProperty(paramItem)) {
                                                    var isContain = false;
                                                    for (var port in portsVm) {
                                                        if (portsVm.hasOwnProperty(port)) {
                                                            // 后端端口  虚拟机IP 都相同(LB虚拟机信息中的id顺序不对，不使用id匹配)
                                                            if (param[paramItem].backPort === portsVm[port].backPort && param[paramItem].ip === portsVm[port].ip) {
                                                                isContain = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (!isContain) {
                                                        tmpParam.push(param[paramItem]);
                                                    }
                                                }
                                            }

                                            // 插入到操作行的下一行
                                            _.each(tmpParam, function (item) {
                                                portsVm.splice(iDataIndex + 1, 0, item);
                                            });
                                            $scope.$apply(function () {
                                                $scope.info.httpsVMTable.data = portsVm;
                                            });
                                        }
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };

                            optScope.remove = function () {
                                $scope.info.httpsVMTable.data = _.reject($scope.info.httpsVMTable.data, function (item, index) {
                                    return index === iDataIndex;
                                });
                            };

                            // 操作
                            var opt = "";
                            if (!aData.ip || aData.ip === "") {
                                opt = "<div><a class='btn-link' ng-click='bindVm()'>" + i18n.org_term_bondVM_button + "</a></div>";
                            } else {
                                opt = "<div><a class='btn-link' ng-click='remove()'>" + i18n.common_term_unbondVM_button + "</a></div>";
                            }
                            var optLink = $compile(opt);

                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).append(optNode);

                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                        }
                    },
                    tcpVMTable: {
                        "id": "create-vlb-bindvm-tcpVMTable",
                        "enablePagination": false,
                        "draggable": true,
                        "columns": [{
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backPort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vm_term_vmName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "20%",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var optScope = $scope.$new();
                            optScope.bindVm = function () {
                                var param = [];
                                var condition = {
                                    "backPort": aData.backPort,
                                    "okClick": "false"
                                };
                                var options = {
                                    "winId": "bindVmWindowId",
                                    title: i18n.org_term_bondVM_button,
                                    param: param,
                                    condition: condition,
                                    "cloudInfraId": cloudInfraId,
                                    "vpcId": vpcId,
                                    height: "400px",
                                    width: "650px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/vlb/create/bindVmWindow.html",
                                    "buttons": null,
                                    "close": function () {
                                        if ("true" === condition.okClick) {
                                            var portsVm = [];
                                            var tmpParam = [];
                                            _.each($scope.info.tcpVMTable.data, function (item) {
                                                portsVm.push(item);
                                            });
                                            // 过滤掉已经绑定的重复项
                                            for (var paramItem in param) {
                                                if (param.hasOwnProperty(paramItem)) {
                                                    var isContain = false;
                                                    for (var port in portsVm) {
                                                        if (portsVm.hasOwnProperty(port)) {
                                                            // 后端端口  虚拟机IP 都相同(LB虚拟机信息中的id顺序不对，不使用id匹配)
                                                            if (param[paramItem].backPort === portsVm[port].backPort && param[paramItem].ip === portsVm[port].ip) {
                                                                isContain = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (!isContain) {
                                                        tmpParam.push(param[paramItem]);
                                                    }
                                                }
                                            }

                                            // 插入到操作行的下一行
                                            _.each(tmpParam, function (item) {
                                                portsVm.splice(iDataIndex + 1, 0, item);
                                            });
                                            $scope.$apply(function () {
                                                $scope.info.tcpVMTable.data = portsVm;
                                            });
                                        }
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            };

                            optScope.remove = function () {
                                $scope.info.tcpVMTable.data = _.reject($scope.info.tcpVMTable.data, function (item, index) {
                                    return index === iDataIndex;
                                });
                            };
                            // 操作
                            var opt = "";
                            if (!aData.ip || aData.ip === "") {
                                opt = "<div><a class='btn-link' ng-click='bindVm()'>" + i18n.org_term_bondVM_button + "</a></div>";
                            } else {
                                opt = "<div><a class='btn-link' ng-click='remove()'>" + i18n.common_term_unbondVM_button + "</a></div>";
                            }
                            var optLink = $compile(opt);

                            var optNode = optLink(optScope);
                            $("td:eq(3)", nRow).append(optNode);

                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                        }
                    },
                    okBtn: {
                        "id": "create-vlb-bindvm-next",
                        "text": i18n.common_term_ok_button,
                        "click": function () {
                            isOKBttnClick = true;
                            var backPortsInfo = [];
                            _.each($scope.info.httpVMTable.data, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.info.httpsVMTable.data, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.info.tcpVMTable.data, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });

                            // 拼凑rest接口参数
                            for (var item in listeners) {
                                if (listeners.hasOwnProperty(item)) {
                                    var backPort = listeners[item].backPort;
                                    var vmIps = [];
                                    for (var item2 in backPortsInfo) {
                                        if (backPortsInfo.hasOwnProperty(item2)) {
                                            var tmp = backPortsInfo[item2];
                                            if (tmp && tmp.ip && tmp.ip.length > 0 && backPort === tmp.backPort) {
                                                vmIps.push({
                                                    "vmIP": tmp.ip,
                                                    "vmInstanceId": tmp.id,
                                                    "servicePort": -1,
                                                    "weight": -1
                                                });
                                            }
                                        }
                                    }
                                    listeners[item].bindingVM = vmIps;
                                }
                            }

                            var addedItems = [];
                            var deletedItems = [];
                            _.each(listeners, function (item) {
                                var tmpReq = {};
                                tmpReq.conConnectionNum = -1;
                                tmpReq.maxThroughput = -1;
                                tmpReq.rxTraffic = 0;
                                tmpReq.txTraffic = 0;
                                tmpReq.id = item.id;
                                tmpReq.port = -1;
                                tmpReq.distributionMode = -1;
                                tmpReq.backPort = -1;

                                var tmpReq1 = {};
                                tmpReq1.conConnectionNum = -1;
                                tmpReq1.maxThroughput = -1;
                                tmpReq1.rxTraffic = 0;
                                tmpReq1.txTraffic = 0;
                                tmpReq1.id = item.id;
                                tmpReq1.port = -1;
                                tmpReq1.distributionMode = -1;
                                tmpReq1.backPort = -1;

                                _.each(oldListeners, function (oldItem) {
                                    if (oldItem.id === item.id) {
                                        // 旧的没有绑定虚拟机
                                        if (!oldItem.bindingVM || oldItem.bindingVM.length <= 0) {
                                            tmpReq.bindingVM = item.bindingVM;
                                            addedItems.push(tmpReq);
                                        }
                                        // 新的没有绑定虚拟机
                                        else if (!item.bindingVM || item.bindingVM.length <= 0) {
                                            tmpReq.bindingVM = oldItem.bindingVM;
                                            deletedItems.push(tmpReq);
                                        } else {
                                            var deletedVm = [];
                                            var addedVm = [];
                                            for (var newVm in item.bindingVM) {
                                                if (item.bindingVM.hasOwnProperty(newVm)) {
                                                    var newIp = item.bindingVM[newVm];
                                                    var contains = false;
                                                    for (var oldVm in oldItem.bindingVM) {
                                                        if (oldItem.bindingVM.hasOwnProperty(oldVm)) {
                                                            if (oldItem.bindingVM[oldVm].vmIP === newIp.vmIP) {
                                                                contains = true;
                                                            }
                                                        }
                                                    }
                                                    if (!contains) {
                                                        addedVm.push(newIp);
                                                    }
                                                }
                                            }
                                            for (var oldVm1 in oldItem.bindingVM) {
                                                if (oldItem.bindingVM.hasOwnProperty(oldVm1)) {
                                                    var oldIp = oldItem.bindingVM[oldVm1];
                                                    var contains1 = false;
                                                    for (var newVm1 in item.bindingVM) {
                                                        if (item.bindingVM.hasOwnProperty(newVm1)) {
                                                            if (item.bindingVM[newVm1].vmIP === oldIp.vmIP) {
                                                                contains1 = true;
                                                            }
                                                        }
                                                    }
                                                    if (!contains1) {
                                                        deletedVm.push(oldIp);
                                                    }
                                                }
                                            }
                                            tmpReq.bindingVM = addedVm;
                                            addedItems.push(tmpReq);
                                            tmpReq1.bindingVM = deletedVm;
                                            deletedItems.push(tmpReq1);
                                        }
                                    }
                                });
                            });
                            addedItems = _.reject(addedItems, function (item) {
                                return !item.bindingVM || item.bindingVM.length <= 0;
                            });
                            deletedItems = _.reject(deletedItems, function (item) {
                                return !item.bindingVM || item.bindingVM.length <= 0;
                            });

                            // 没有删减直接返回
                            if (addedItems.length <= 0 && deletedItems.length <= 0) {
                                $scope.close();
                                $scope.$destroy();
                                return;
                            }

                            var deferred = $scope.vlbServiceInst.operateVLB({
                                "vdcId": user.vdcId,
                                "cloudInfraId": cloudInfraId,
                                "userId": user.id,
                                "opParam": {
                                    "modifyIPInLB": {
                                        "lbID": lbID,
                                        "addIp2listener": addedItems.length <= 0 ? null : addedItems,
                                        "deleteIpFromlistener": deletedItems.length <= 0 ? null : deletedItems
                                    }
                                }
                            });
                            deferred.then(function () {
                                $scope.close();
                                $scope.$destroy();
                            });
                        }
                    },
                    cancelBtn: {
                        "id": "create-vlb-bindvm-cancel",
                        "text": i18n.common_term_cancle_button,
                        "click": function () {
                            $scope.close();
                            $scope.$destroy();
                        }
                    }
                };

                // 根据查询得到的监听器数据，设置默认的监听器配置
                var httpVms = [];
                var httpsVms = [];
                var tcpVms = [];
                _.each(listeners, function (item) {
                    var tmp = {
                        "protocol": item.protocol,
                        "backPort": item.backPort,
                        "id": "",
                        "name": "",
                        "ip": ""
                    };

                    if ("HTTP" === item.protocol) {
                        httpVms.push(tmp);
                        if (item.bindingVM && item.bindingVM.length > 0) {
                            _.each(item.bindingVM, function (vm) {
                                httpVms.push({
                                    "protocol": item.protocol,
                                    "backPort": item.backPort,
                                    "id": vm.vmInstanceId,
                                    "name": vm.vmName,
                                    "ip": vm.vmIP
                                });
                            });
                        }
                    }

                    if ("HTTPS" === item.protocol) {
                        httpsVms.push(tmp);
                        if (item.bindingVM && item.bindingVM.length > 0) {
                            _.each(item.bindingVM, function (vm) {
                                httpsVms.push({
                                    "protocol": item.protocol,
                                    "backPort": item.backPort,
                                    "id": vm.vmInstanceId,
                                    "name": vm.vmName,
                                    "ip": vm.vmIP
                                });
                            });
                        }
                    }
                    if ("TCP" === item.protocol) {
                        tcpVms.push(tmp);
                        if (item.bindingVM && item.bindingVM.length > 0) {
                            _.each(item.bindingVM, function (vm) {
                                tcpVms.push({
                                    "protocol": item.protocol,
                                    "backPort": item.backPort,
                                    "id": vm.vmInstanceId,
                                    "name": vm.vmName,
                                    "ip": vm.vmIP
                                });
                            });
                        }
                    }
                });
                $scope.$apply(function () {
                    $scope.info.httpVMTable.data = httpVms;
                    $scope.info.httpsVMTable.data = httpsVms;
                    $scope.info.tcpVMTable.data = tcpVms;
                });
            }
        ];
        var dependency = [
            "ng", "wcc"
        ];
        var bindVmFromList = angular.module("bindVmFromList", dependency);
        bindVmFromList.controller("listBindVmCtrl", ctrl);
        bindVmFromList.service("camel", http);
        bindVmFromList.service("exception", exception);

        return bindVmFromList;
    });
