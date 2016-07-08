define([
        "sprintf",
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "app/business/network/services/securitygroup/securityGroupService",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "tiny-lib/underscore",
        "fixtures/network/securitygroup/securitygroupFixture"
    ],
    function (sprintf, $, angular, ngSanitize, keyIDI18n, http, securityGroupService, _) {
        "use strict";
        var ctrl = ["$scope", "$compile", "camel", "$q",
            function ($scope, $compile, camel, $q) {
                //获取参数
                $scope.params = $("#memberVMDialogId").widget().option("params");
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
                var user = $("html").scope().user;
                var exception = $("html").injector().get("exception");
                var securityGroupServiceIns = new securityGroupService(exception, $q, camel);
                $scope.memberVMModel = {
                    "id": "memberVM-list-model",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmName);
                        },
                        "bSortable": false,
                        "sWidth": "100px"
                    }, {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmID);
                        },
                        "bSortable": false,
                        "sWidth": "100px"
                    }, {
                        "sTitle": i18n.common_term_floatIP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.floatIP);
                        },
                        "bSortable": false
                    },{
                        "sTitle": i18n.common_term_NIC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vnicIds);
                        },
                        "bSortable": false
                    }],
                    "datas": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryMemberVM();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryMemberVM();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                    }
                };

                //获取网卡列表
                function getNicIds(nics) {
                    var nicIdStr = "";
                    if (nics) {
                        _.each(nics, function (item) {
                            if (!item.ip && !item.ipv6s) {
                                return;
                            } else if (!item.ip && item.ipv6s) {
                                nicIdStr = nicIdStr + item.ipv6s.join(";");
                            } else if (item.ip && !item.ipv6s) {
                                nicIdStr = nicIdStr + item.ip;
                            } else {
                                nicIdStr = nicIdStr + item.ip + ";";
                                nicIdStr = nicIdStr + item.ipv6s.join(";");
                            }
                            nicIdStr = nicIdStr + ";;";
                        });
                        var index = nicIdStr.lastIndexOf(";;");
                        if (index > 0 && index === nicIdStr.length - 2) {
                            nicIdStr = nicIdStr.slice(0, index);
                        }
                    }
                    return nicIdStr;
                }

                //获取浮动IP列表
                function getFloutIp(nics) {
                    var floatIpStr = "";
                    if (nics) {
                        _.each(nics, function (item) {
                            if(item.floatIP){
                                floatIpStr = floatIpStr + item.floatIP + ";";
                            }
                        });
                        var index = floatIpStr.lastIndexOf(";");
                        if (index > 0 && index === floatIpStr.length - 1) {
                            floatIpStr = floatIpStr.slice(0, index);
                        }
                    }
                    return floatIpStr;
                }

                //查询虚拟机成员列表
                function queryMemberVM() {
                    var options = {
                        "user": user,
                        "vpcId": $scope.params.vpcId,
                        "cloudInfraId": $scope.params.cloudInfraId,
                        "start": page.getStart(),
                        "count": page.displayLength,
                        "sgId": $scope.params.secGroupId
                    };
                    var deferred = securityGroupServiceIns.querySecurityGroupVm(options);
                    deferred.then(function (response) {
                        if (!response || !response.querySGMemberResp.vms) {
                            return;
                        }
                        var memberVMListRes = response.querySGMemberResp.vms;
                        _.each(memberVMListRes, function (item) {
                            item.vnicIds = getNicIds(item.vnics);
                            item.floatIP = getFloutIp(item.vnics);
                        });
                        $scope.memberVMModel.datas = memberVMListRes;
                        $scope.memberVMModel.totalRecords = response.total;
                        $scope.memberVMModel.displayLength = page.displayLength;
                        $("#" + $scope.memberVMModel.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                }
                queryMemberVM();
            }
        ];
        var module = angular.module("memberVMModule", ["ng", "wcc", "ngSanitize"]);
        module.controller("memberVMCtrl", ctrl);
        module.service("camel", http);
        return module;
    });
