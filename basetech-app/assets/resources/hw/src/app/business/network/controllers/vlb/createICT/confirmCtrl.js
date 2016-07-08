/* global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    'tiny-lib/underscore',
    "app/business/network/services/vlb/vlbService"
], function (angular, $, _, vlbService) {
    "use strict";

    var ctrl = ["$scope", "$state", "camel", "$q", "exception", "networkCommon",
        function ($scope, $state, camel, $q, exception, networkCommon) {
            var i18n = $scope.i18n;
            var vlbServiceInst = new vlbService(exception, $q, camel);
            var user = $scope.user;
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            $scope.info = {
                name: {
                    "id": "create-vlb-confirm-name",
                    label: i18n.common_term_name_label + ":",
                    "width": "214",
                    require: true
                },
                lbType: {
                    label: i18n.common_term_lbType_label + ":",
                    "id": "create-vlb-confirm-lbType"
                },
                maxSession: {
                    label: i18n.lb_term_sessionMaxNum_label + ":",
                    "id": "create-vlb-confirm-maxSession",
                    "width": "214"
                },
                frontNet: {
                    label: i18n.common_term_FrontNet_label + ":",
                    "id": "create-vlb-confirm-frontNet",
                    "width": "220",
                    require: true,
                    value: "net"
                },
                monitor: {
                    label: i18n.lb_term_listen_label + ":",
                    require: false
                },
                monitorTable: {
                    "id": "create-vlb-confirm-monitor-listtable",
                    "enablePagination": false,
                    "draggable": true,
                    "columns": [
                        {
                            "sTitle": i18n.common_term_protocol_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.protocol);
                            },
                            "sWidth": "25%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_pairIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.extendPort);
                            },
                            "sWidth": "25%",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.lb_term_backendProtocol_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backendProtocol);
                            },
                            "sWidth": "25%",
                            "bSortable": false,
                            "bVisible": isIT
                        },
                        /* {
                         "sTitle": i18n.lb_term_backendPort_label,
                         "mData": function (data) {
                         return $.encoder.encodeForHTML(data.backendPort);
                         },
                         "sWidth": "25%",
                         "bSortable": false
                         },*/
                        {
                            "sTitle": i18n.lb_term_stickySessionType_label,
                            "mData": function (data) {
                                var content = data.sessionPersistenceType;
                                if (content === "APP_COOKIE") {
                                    content += "; " + i18n.lb_term_cookieName_label + ":" + data.cookieName;
                                }
                                return $.encoder.encodeForHTML(content);
                            },
                            "sWidth": "20%",
                            "bSortable": false,
                            "bVisible": !isIT
                        }
                    ],
                    "data": $scope.service.monitors
                },
                bindVM: {
                    label: i18n.org_term_bondVM_button + ":",
                    require: false
                },
                bindVMTable: {
                    "id": "create-vlb-confirm-bindvm-listtable",
                    "enablePagination": false,
                    "draggable": true,
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
                        }
                    ],
                    "data": []
                },
                preBtn: {
                    "id": "create-vlb-confirm-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "bindVM";
                        $("#" + $scope.service.step.id).widget().pre();
                    }
                },
                okBtn: {
                    "id": "create-vlb-confirm-ok",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var params = {
                            "lbInfo": {
                                "lbName": $scope.service.vlbName,
                                //lb基本信息参数
                                "lbParameters": [
                                    {
                                        // 最大会话数，默认值100，范围：[1，10000]
                                        "sessionNum": $scope.service.maxSession,
                                        // 吞吐量，单位, 范围<8~10,000,000>，默认值50000kps
                                        "maxThroughput": $scope.service.throughPut,
                                        // 软硬件类型
                                        "qosInfo": [
                                            {
                                                "name": "LBPerformance", //LBPerformance
                                                "value": $scope.service.workingMode.value //“LBPerformance”取值: high,low
                                            }
                                        ]
                                    }
                                ],
                                //监听器列表
                                "listeners": transUiMonitorsToCreateReq($scope.service.totalMonitors),

                                // 前后端网络信息
                                "slbVmInfo": {
                                    "vpcID": $scope.service.vpcId, // vpcId
                                    "extNetworkID": $scope.service.selectedFrontNetwork.networkId, //前端网络id
                                    "intNetworkID": $scope.service.selectedBackNetwork.networkId //后端网络id
                                }
                            }
                        };
                        var deferred = vlbServiceInst.createVlb({
                            "vdc_id": $scope.service.user.vdcId,
                            "cloud_infra_id": $scope.service.cloudInfraId,
                            "userId": $scope.service.user.id,
                            "params": params
                        });
                        deferred.then(function () {
                            $state.go("network.vpcmanager.vlb");
                        });
                    }
                },
                cancelBtn: {
                    "id": "create-vlb-confirm-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };
            _.extend($scope.info, {
                frontNetType: {
                    "label": i18n.common_term_FrontNetType_label + ":",
                    "id": "create-vlb-confirm-frontNetType",
                    "require": true
                },
                policyType: {
                    "label": i18n.common_term_assignPolicyType_label + ":",
                    "id": "create-vlb-confirm-policyType",
                    "require": true
                },
                protocol: {
                    "id": "create-vlb-confirm-healthCheck-protocol",
                    label: i18n.lb_term_healthCheckType_label + ":",
                    require: true
                },
                checkPath: {
                    label: i18n.common_term_checkPath_label + ":",
                    "id": "create-vlb-confirm-healthCheck-checkPath",
                    "require": true
                },
                maxRoundRobin: {
                    "label": i18n.lb_term_poolingTimesMax_label + ":",
                    "id": "create-vlb-confirm-healthCheck-maxRoundRobin",
                    "require": true
                },
                timeout: {
                    "label": i18n.device_term_timeouts_label + ":",
                    "id": "create-vlb-confirm-healthCheck-timeout",
                    "require": true
                },
                checkInterval: {
                    "label": i18n.common_term_checkCycleS_label + ":",
                    "id": "create-vlb-confirm-healthCheck-checkInterval",
                    "require": true
                },
                httpMethod: {
                    "label": i18n.common_term_HTTPmode_label + ":",
                    "id": "create-vlb-confirm-healthCheck-httpMethod",
                    "require": true
                },
                httpCode: {
                    "label": i18n.common_term_HTTPstatusCode_label + ":",
                    "id": "create-vlb-confirm-healthCheck-httpCode",
                    "require": true
                }
            });
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
                        if (isIT) {
                            tmpReq.backPort = uiMonitors[monitor].backPort;
                        } else if ($scope.service.backPortsInfos.length > 0) {
                            tmpReq.backPort = $scope.service.backPortsInfos[0].backPort;
                        }
                        else {
                            tmpReq.backPort = "";
                        }

                        if (isIT) {
                            tmpReq.distributionMode = uiMonitors[monitor].policy;
                        }
                        else {
                            tmpReq.distributionMode = $scope.service.policyType.lb_method;
                        }

                        // 监听器权重配置（默认值）
                        tmpReq.conConnectionNum = -1;
                        tmpReq.maxThroughput = -1;

                        tmpReq.sessionPre = {};
                        if (isIT) {
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
                        }
                        else {
                            var sessionType = uiMonitors[monitor].sessionPersistenceType;
                            if (sessionType === "APP_COOKIE") {
                                sessionType = "5";
                            }
                            else if (sessionType === "HTTP_COOKIE") {
                                sessionType = "6";
                            }
                            else if (sessionType === "SOURCE_IP") {
                                sessionType = "7";
                            }
                            tmpReq.sessionPre = {
                                "sessionRemainMode": sessionType,
                                "cookieName": uiMonitors[monitor].cookieName
                            };
                        }

                        tmpReq.healthCheckInfo = [];
                        if (isIT) {
                            // 设置了健康检查
                            if (uiMonitors[monitor].healthCheckChecked) {
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
                        }
                        else {
                            tmpReq.healthCheckInfo.push({
                                "path": $scope.service.checkPath,
                                "checkInterval": $scope.service.checkInterval,
                                "responseTime": $scope.service.timeout,
                                "healthCheckType": $scope.service.protocol,
                                "unhealthyThreshold": $scope.service.maxRoundRobin,
                                "expectedCodes": $scope.service.httpCode,
                                "httpMethod": $scope.service.httpMethod
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
