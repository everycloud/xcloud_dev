define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/network/services/networkService",
        "app/services/messageService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "fixtures/network/network/networkListFixture"
    ],
    function ($, angular, networkService, MessageService, _) {
        "use strict";
        var aspfCtrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "exception",
            function ($scope, $compile, $q, camel, networkCommon, exception) {
                // 公共服务实例
                var networkServiceIns = new networkService(exception, $q, camel);
                var i18n = $scope.i18n;
                $scope.params = {
                    "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                    "vpcId": networkCommon && networkCommon.vpcId,
                    "azId": networkCommon && networkCommon.azId,
                    "userId": $scope.user.id,
                    "openstack": ($scope.user.cloudType === "ICT" ? true : false),
                    "vdcId": $scope.user.vdcId
                };
                //鉴权
                var ASPF_OPERATE = "551002";
                var privilegeList = $("html").scope().user.privilegeList;
                $scope.hasOperateRight = _.contains(privilegeList, ASPF_OPERATE);
                //刷新按钮
                $scope.refreshBtn = {
                    "id": "networkAspfFreshBtn",
                    "text": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.operator.queryAspfRegular();
                    }
                };
                //修改ASPF设置
                $scope.saveBtn = {
                    "id": "networkAspfSaveBtn",
                    "text": i18n.common_term_save_label,
                    "click": function () {
                        $scope.operator.modifyAspfRegular();
                    }
                };
                $scope.protocolArray = [{
                    "protocol": "DNS",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": i18n.common_term_ftp_label,
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "ILS",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "MSN",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "QQ",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "H323",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "NETBIOS",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "SIP",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "MGCP",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "MMS",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "RTSP",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "PPTP",
                    "configration": false,
                    "opt": ""
                }, {
                    "protocol": "SQLNET",
                    "configration": false,
                    "opt": ""
                }];
                //设置协议
                function setProtocolArray(protocol, configuration) {
                    _.each($scope.protocolArray, function (item) {
                        if (item.protocol === protocol) {
                            item.configration = configuration;
                        }
                    });
                }
                //获取协议开关
                function getProtocolConfig(protocol) {
                    var configration = false;
                    _.each($scope.protocolArray, function (item) {
                        if (item.protocol === protocol) {
                            configration = item.configration;
                            return;
                        }
                    });
                    return configration;
                }
                $scope.protocolTable = {
                    "id": "networkAspfProtocolTable",
                    "enablePagination": false,
                    "columns": [{
                        "sTitle": i18n.common_term_protocol_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.protocol);
                        },
                        "sWidth": "300px",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "opt",
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //操作列
                        var radiogroup = "<div><tiny-radiogroup id='id' values='values' change='change()'></tiny-radiogroup></div>";
                        var radiogroupLink = $compile(radiogroup);
                        var radiogroupScope = $scope.$new();
                        radiogroupScope.id = "networkAspfRadiogroup" + iDataIndex;
                        radiogroupScope.values = [{
                            "key": "PROTOCAL_OPENED",
                            "text": i18n.common_term_enable_button,
                            "checked": aData.configration
                        }, {
                            "key": "PROTOCAL_CLOSED",
                            "text": i18n.common_term_close_button,
                            "checked": !aData.configration
                        }];
                        radiogroupScope.change = function () {
                            var checked = $("#" + radiogroupScope.id).widget().opChecked("checked");
                            if ("PROTOCAL_OPENED" === checked) {
                                setProtocolArray(aData.protocol, true);
                            } else {
                                setProtocolArray(aData.protocol, false);
                            }
                        };
                        var optNode = radiogroupLink(radiogroupScope);
                        $("td:eq(1)", nRow).append(optNode);
                    }
                };
                //ajax命令操作
                $scope.operator = {
                    //查询弹性IP列表
                    "queryAspfRegular": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId
                        };
                        var deferred = networkServiceIns.queryAspfRegular(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            setProtocolArray("DNS", data.dns);
                            setProtocolArray("FTP", data.ftp);
                            setProtocolArray("ILS", data.ils);
                            setProtocolArray("MSN", data.msn);
                            setProtocolArray("QQ", data.qq);
                            setProtocolArray("H323", data.h323);
                            setProtocolArray("NETBIOS", data.netbios);
                            setProtocolArray("SIP", data.sip);
                            setProtocolArray("MGCP", data.mgcp);
                            setProtocolArray("MMS", data.mms);
                            setProtocolArray("RTSP", data.rtsp);
                            setProtocolArray("PPTP", data.pptp);
                            setProtocolArray("SQLNET", data.sqlnet);
                            $scope.protocolTable.data = $scope.protocolArray;
                            $("#"+$scope.protocolTable.id).widget().option("data", $scope.protocolTable.data)
                        });
                    },
                    "modifyAspfRegular": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "params": {
                                "dns": getProtocolConfig("DNS"),
                                "ftp": getProtocolConfig("FTP"),
                                "ils": getProtocolConfig("ILS"),
                                "msn": getProtocolConfig("MSN"),
                                "qq": getProtocolConfig("QQ"),
                                "h323": getProtocolConfig("H323"),
                                "netbios": getProtocolConfig("NETBIOS"),
                                "sip": getProtocolConfig("SIP"),
                                "mgcp": getProtocolConfig("MGCP"),
                                "mms": getProtocolConfig("MMS"),
                                "rtsp": getProtocolConfig("RTSP"),
                                "pptp": getProtocolConfig("PPTP"),
                                "sqlnet": getProtocolConfig("SQLNET")
                            }
                        };
                        var deferred = networkServiceIns.modifyAspfRegular(options);
                        deferred.then(function (data) {
                            new MessageService().okMsgBox(i18n.common_term_saveSucceed_label);
                        });
                    }
                };
                $scope.$on("$viewContentLoaded", function () {
                    $scope.operator.queryAspfRegular();
                });
            }
        ];
        return aspfCtrl;
    });
