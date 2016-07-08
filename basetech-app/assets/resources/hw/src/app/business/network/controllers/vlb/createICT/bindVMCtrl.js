/* global define*/
define([
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/services/messageService",
    'app/services/exceptionService',
    "app/business/network/services/vlb/vlbService",
    "tiny-widgets/Window",
    "tiny-directives/Button"
], function ($, _, http, UnifyValid, validatorService, messageService, exception, vlbService, Window) {
    "use strict";
    var ctrl = ["$scope", "$q", "$state", "$compile", "camel", "exception",
        function ($scope, $q, $state, $compile, camel, exception) {
            var i18n = $scope.i18n;
            var vlbServiceInst = new vlbService(exception, $q, camel);
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            $scope.backPortToWin="";
            $scope.info = {
                table: {
                    "enablePagination": false,
                    "columns": [
                        {
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backPort);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        },
                        {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_proportion_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.weight);
                            },
                            "sWidth": "20%",
                            "bSortable": false,
                            "bVisible": !isIT
                        },
                        {
                            "sTitle": i18n.vm_term_vmName_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "20%",
                            "bSortable": false
                        }
                    ]
                },
                httpVMTable: {
                    "id": "create-vlb-bindvm-httpVMTable",
                    "data": [],
                    "renderRow": renderRowCallBack("http", $scope)
                },
                httpsVMTable: {
                    "id": "create-vlb-bindvm-httpsVMTable",
                    "data": [],
                    "renderRow": renderRowCallBack("https", $scope)
                },
                tcpVMTable: {
                    "id": "create-vlb-bindvm-tcpVMTable",
                    "data": [],
                    "renderRow": renderRowCallBack("tcp", $scope)
                },
                preBtn: {
                    "id": "create-vlb-bindvm-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "configMonitor";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-bindvm-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };
            if (isIT) {
                _.extend($scope.info, {
                    httpsVMTable: {
                        "id": "create-vlb-bindvm-httpsVMTable",
                        "data": [],
                        "renderRow": renderRowCallBack("https", $scope)
                    },
                    nextBtn: {
                        "id": "create-vlb-bindvm-next",
                        "text": $scope.service.onlyAddListener ? i18n.common_term_add_button : i18n.common_term_next_button,
                        "click": function () {
                            var backPortsInfo = [];
                            _.each($scope.service.httpBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.service.httpsBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.service.tcpBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            $scope.service.backPortsInfos = backPortsInfo;

                            // 拼凑rest接口参数
                            for (var item in $scope.service.totalMonitors) {
                                if ($scope.service.totalMonitors.hasOwnProperty(item)) {
                                    var backPort = $scope.service.totalMonitors[item].backPort;
                                    var vmIps = [];
                                    for (var item2 in backPortsInfo) {
                                        if (backPortsInfo.hasOwnProperty(item2)) {
                                            var tmp = backPortsInfo[item2];
                                            if (tmp && tmp.ip && tmp.ip.length > 0 && backPort + "" === tmp.backPort + "") {
                                                vmIps.push({
                                                    "vmIP": tmp.ip,
                                                    "vmInstanceId": tmp.id,
                                                    "servicePort": -1,
                                                    "weight": -1
                                                });
                                            }
                                        }
                                    }
                                    _.extend($scope.service.totalMonitors[item], {
                                        "vmIps": vmIps
                                    });
                                }
                            }

                            // 列表中添加监听器
                            if ($scope.service.onlyAddListener) {
                                var deferred = vlbServiceInst.createListener({
                                    "vdc_id":  $scope.service.user.orgId,
                                    "userId": $scope.service.user.id,
                                    "cloudInfraId": $scope.service.cloudInfraId,
                                    "lbID": $scope.service.lbID,
                                    "params": {
                                        "listeners": transUiMonitorsToCreateReq($scope.service.totalMonitors)
                                    }
                                });
                                deferred.then(function () {
                                    $state.go("network.vpcmanager.vlb");
                                });
                            } else {
                                $scope.service.show = "confirm";
                                $("#" + $scope.service.step.id).widget().next();
                            }
                        }
                    }
                });
            }
            else {
                _.extend($scope.info, {
                    nextBtn: {
                        "id": "create-vlb-bindvm-next",
                        "text": $scope.service.onlyAddListener ? i18n.common_term_add_button : i18n.common_term_next_button,
                        "click": function () {
                            var backPortsInfo = [];
                            _.each($scope.service.httpBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.service.httpsBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            _.each($scope.service.tcpBackPorts, function (item) {
                                if (item && item.ip && item.ip !== "") {
                                    backPortsInfo.push(item);
                                }
                            });
                            $scope.service.backPortsInfos = backPortsInfo;
                            // 拼凑rest接口参数
                            for (var item in $scope.service.totalMonitors) {
                                if ($scope.service.totalMonitors.hasOwnProperty(item)) {
                                    var backPort = $scope.service.totalMonitors[item].backPort;
                                    var vmIps = [];
                                    for (var item2 in backPortsInfo) {
                                        if (backPortsInfo.hasOwnProperty(item2)) {
                                            var tmp = backPortsInfo[item2];
                                            if (tmp && tmp.ip && tmp.ip.length > 0) {
                                                vmIps.push({
                                                    "vmIP": tmp.ip,
                                                    "vmInstanceId": tmp.id,
                                                    "servicePort": isIT ? -1 : tmp.backPort,
                                                    "weight": isIT ? -1 : tmp.weight,
                                                    "subnetId": tmp.subnetId
                                                });
                                            }
                                        }
                                    }
                                    _.extend($scope.service.totalMonitors[item], {
                                        "vmIps": vmIps
                                    });
                                }
                            }
                            $scope.service.show = "confirm";
                            $("#" + $scope.service.step.id).widget().next();
                        }
                    }
                });
            }

            $scope.$on("bind-number-success-event", function (event, protocol, datas, index) {
                var ports = getPorts($scope, protocol);
                var portsVm = [];
                var tmpParam = [];
                _.each(ports, function (item) {
                    portsVm.push(item);
                });
                // 过滤掉已经绑定的重复项
                for (var paramItem in datas) {
                    if (datas.hasOwnProperty(paramItem)) {
                        var isContain = false;
                        for (var port in portsVm) {
                            if (portsVm.hasOwnProperty(port)) {
                                // 后端端口  虚拟机IP 虚拟机id 都相同
                                if(isIT) {
                                    if (datas[paramItem].backPort === portsVm[port].backPort && datas[paramItem].ip === portsVm[port].ip && datas[paramItem].id === portsVm[port].id) {
                                        isContain = true;
                                        break;
                                    }
                                }
                                else {
                                    if (datas[paramItem].backPort === portsVm[port].backPort && datas[paramItem].ip === portsVm[port].ip) {
                                        isContain = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (!isContain) {
                            tmpParam.push(datas[paramItem]);
                        }
                        if (datas.length > 0 && datas[0].backPort !== null || datas[0].backPort !== "" ||
                            datas[0].backPort !== 0 || datas[0].backPort !== undefined) {
                            $scope.backPortToWin = datas[0].backPort;
                        }

                    }
                }
                // 插入到操作行的下一行
                _.each(tmpParam, function (item) {
                    portsVm.splice(index + 1, 0, item);
                });
                setPorts($scope, protocol, portsVm);
                $scope.$digest();
            });
            function renderRowCallBack(protocol, scope) {
                return function (nRow, aData, iDataIndex) {
                    var optScope = scope.$new();
                    optScope.bindVm = function () {
                        var condition = {
                            "index": iDataIndex
                        };

                        var backPortsInfo = [];
                        _.each($scope.service.httpBackPorts, function (item) {
                            if (item && item.ip && item.ip !== "") {
                                backPortsInfo.push(item);
                            }
                        });
                        _.each($scope.service.httpsBackPorts, function (item) {
                            if (item && item.ip && item.ip !== "") {
                                backPortsInfo.push(item);
                            }
                        });
                        _.each($scope.service.tcpBackPorts, function (item) {
                            if (item && item.ip && item.ip !== "") {
                                backPortsInfo.push(item);
                            }
                        });

                        if (!backPortsInfo || backPortsInfo.length == 0) {
                            $scope.backPortToWin = undefined;
                        }

                        var options = {
                            "winId": "bindVmWindowId",
                            "title": i18n.org_term_bondVM_button,
                            "scope": scope,
                            "protocol": protocol,
                            "condition": condition,
                            "backPort":$scope.backPortToWin,
                            "cloudInfraId": scope.service.cloudInfraId,
                            "vpcId": scope.service.vpcId,
                            "height": "400px",
                            "width": "650px",
                            "content-type": "url",
                            "content": "app/business/network/views/vlb/createICT/bindVmWindow.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    };

                    optScope.remove = function () {
                        var ports = getPorts(scope, protocol);
                        ports = _.reject(ports, function (item, index) {
                            return index === iDataIndex;
                        });
                        setPorts(scope, protocol, ports);
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
                    if(isIT) {
                        $("td:eq(3)", nRow).append(optNode);
                        $("td:eq(3)", nRow).addTitle();
                    }
                    else {
                        $("td:eq(4)", nRow).append(optNode);
                        $("td:eq(4)", nRow).addTitle();
                    }
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                };
            }

            function getPorts($scope, protocol) {
                var ports = {};
                if (protocol === "http") {
                    ports = $scope.service.httpBackPorts;
                }
                if (protocol === "https") {
                    ports = $scope.service.httpsBackPorts;
                }
                if (protocol === "tcp") {
                    ports = $scope.service.tcpBackPorts;
                }
                return ports;
            }

            function setPorts($scope, protocol, ports) {
                if (protocol === "http") {
                    $scope.service.httpBackPorts = ports;
                }
                if (protocol === "https") {
                    $scope.service.httpsBackPorts = ports;
                }
                if (protocol === "tcp") {
                    $scope.service.tcpBackPorts = ports;
                }
            }

                function transUiMonitorsToCreateReq(uiMonitors) {
                    var monitorReq = [];
                    if (!uiMonitors || uiMonitors.length <= 0) {
                        return monitorReq;
                    }

                    for (var monitor in uiMonitors) {
                        if (uiMonitors.hasOwnProperty(monitor)) {
                            var tmpReq = {};
                            tmpReq.protocol = uiMonitors[monitor].protocol;
                            tmpReq.port = uiMonitors[monitor].servicePort;
                            tmpReq.backPort = uiMonitors[monitor].backPort;
                            tmpReq.distributionMode = uiMonitors[monitor].policy;

                            // 监听器权重配置（默认值）
                            tmpReq.conConnectionNum = -1;
                            tmpReq.maxThroughput = -1;

                            // 配置了会话保持
                            if (uiMonitors[monitor].sessionChecked) {
                                tmpReq.sessionPre = {};
                                tmpReq.sessionPre.sessionRemain = 1;

                                // 植入COOKIE
                                if (uiMonitors[monitor].sessionMode + "" === "1") {
                                    tmpReq.sessionPre.sessionRemainMode = "0";
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //PASSIVE_COOKIE
                                if (uiMonitors[monitor].sessionMode + "" === "2") {
                                    tmpReq.sessionPre.sessionRemainMode = "2";
                                    tmpReq.sessionPre.cookieName = uiMonitors[monitor].cookieName;
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //SOURCE_ADDRES
                                if (uiMonitors[monitor].sessionMode + "" === "3") {
                                    tmpReq.sessionPre.sessionRemainMode = "3";
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                                //HEADER
                                if (uiMonitors[monitor].sessionMode + "" === "4") {
                                    tmpReq.sessionPre.sessionRemainMode = "4";
                                    tmpReq.sessionPre.headName = uiMonitors[monitor].headerName;
                                    tmpReq.sessionPre.sessionTime = uiMonitors[monitor].timeout;
                                }
                            }

                            // 设置了健康检查
                            if (uiMonitors[monitor].healthCheckChecked) {
                                tmpReq.healthCheckInfo = [];
                                tmpReq.healthCheckInfo.push({
                                    "checkPort": uiMonitors[monitor].backPort,
                                    "path": uiMonitors[monitor].checkPath,
                                    "responseTime": uiMonitors[monitor].responseTime,
                                    "checkInterval": uiMonitors[monitor].checkInterval,
                                    "healthCheckType": uiMonitors[monitor].protocol,
                                    "unhealthyThreshold": uiMonitors[monitor].unhealthyThreshold,
                                    "healthyThreshold": uiMonitors[monitor].healthyThreshold
                                });
                            }

                            //如果是https 需要配置证书相关信息
                            if ("HTTPS" === uiMonitors[monitor].protocol) {
                                tmpReq.certificateName = uiMonitors[monitor].certificateName;
                                tmpReq.privateKey = uiMonitors[monitor].privateKey;
                                tmpReq.publicKeyCertificate = uiMonitors[monitor].publicKey;
                                tmpReq.passWord = uiMonitors[monitor].password;
                            }

                            if (uiMonitors[monitor].vmIps && uiMonitors[monitor].vmIps.length > 0) {
                                tmpReq.bindingVM = uiMonitors[monitor].vmIps;
                            }
                            monitorReq.push(tmpReq);
                        }
                    }
                    return monitorReq;
                }
            }
        ];
        return ctrl;
    });
