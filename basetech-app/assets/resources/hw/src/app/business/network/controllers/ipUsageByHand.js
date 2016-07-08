/*global define*/
define(["tiny-lib/jquery",
    'tiny-lib/angular',
    'tiny-lib/underscore',
    "tiny-widgets/Window",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/business/network/services/networkService",
    "app/services/messageService",
    "language/keyID",
    "tiny-widgets/Radio",
    "tiny-directives/Table",
    "tiny-directives/Select",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/network/network/networkListFixture"
],
    function ($, angular, _, Window, http, exceptionService, networkService, messageService, i18n) {
        "use strict";
        var ipUsageByHandCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var networkServiceIns = new networkService(exception, $q, camel);
                var messageServiceIns = new messageService();

                var dnatLifeTime = "";
                //不限定使用时长
                var NOLIMIT = -1
                var searchIP = "";
                var user = $("html").scope().user || {};

                //获取参数
                $scope.params = $("#ipUsageWindowId").widget().option("param");
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.searchBox = {
                    "id": "searchIpHandId",
                    "placeholder": i18n.vpc_term_findIP_prom,
                    "width": "150",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (content) {
                        page.currentPage = 1;
                        searchIP = content;
                        $scope.operate.queryDnatUsedTime();
                    }
                };

                $scope.refreshClick = function () {
                    $scope.operate.queryDnatUsedTime();
                };

                $scope.applyBtn = {
                    "id": "applyIPBtnId",
                    "text": i18n.common_term_apply_button,
                    "click": function () {
                        var param = {
                            "mode": "add",
                            "privateIP": "",
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "networkID": $scope.params.networkID,
                            "userId": user.id,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "description": "",
                            "isOKBttnClick": false
                        };
                        var options = {
                            "winId": "operatePrivateIpWindow",
                            title: i18n.vpc_term_applyPrivateIP_button,
                            param: param,
                            height: "260px",
                            width: "600px",
                            "content-type": "url",
                            "content": "app/business/network/views/operatePrivateIp.html",
                            "buttons": null,
                            "close": function () {
                                if (param.isOKBttnClick) {
                                    $scope.operate.queryDnatUsedTime();
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };
                $scope.ipListTable = {
                    "id": "ipListTableId",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columns": [
                        {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "bSortable": false,
                            "sWidth": "100"
                        },
                        {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignTime_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allocateTime);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.statusUI);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.eip_term_eip_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.elasticIP);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_usageStatistic_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.usedTime);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.vpc_term_DNATinfo_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.dnatInfoUI);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "bSortable": false
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();
                        optScope.modify = function () {
                            var param = {
                                "mode": "modify",
                                "privateIP": aData.ip,
                                "vdcId": $scope.params.vdcId,
                                "vpcId": $scope.params.vpcId,
                                "networkID": $scope.params.networkID,
                                "userId": user.id,
                                "cloudInfraId": $scope.params.cloudInfraId,
                                "description": aData.description,
                                "isOKBttnClick": false
                            };
                            var options = {
                                "winId": "operatePrivateIpWindow",
                                title: i18n.vpc_term_modifyPrivateIP_button,
                                param: param,
                                height: "260px",
                                width: "600px",
                                "content-type": "url",
                                "content": "app/business/network/views/operatePrivateIp.html",
                                "buttons": null,
                                "close": function () {
                                    if (param.isOKBttnClick) {
                                        $scope.operate.queryDnatUsedTime();
                                    }
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        };
                        optScope.remove = function () {
                            messageServiceIns.warnMsgBox({
                                "content": i18n.vpc_net_releasePrivateIP_info_confirm_msg,
                                "callback": function () {
                                    var deferred = networkServiceIns.releasePrivateIP({
                                        "vdcId": user.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": user.id,
                                        "vpcId": $scope.params.vpcId,
                                        "id": aData.id
                                    });
                                    deferred.then(function () {
                                        $scope.operate.queryDnatUsedTime();
                                    });
                                }
                            });
                        };
                        // 操作
                        var opt = "<div><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a><a class='margin-horizon-beautifier btn-link' ng-click='remove()'>" + i18n.common_term_release_button + "</a> </div>";
                        var optLink = $compile(opt);

                        var optNode = optLink(optScope);
                        $("td:eq(8)", nRow).append(optNode);
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();
                        $("td:eq(7)", nRow).addTitle();
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.queryDnatUsedTime();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        $scope.operate.queryDnatUsedTime();
                    }
                };

                $scope.operate = {
                    "queryPrivateIP": function () {
                        var promise = networkServiceIns.queryPrivateIP({
                            "vdcId": $scope.params.vdcId,
                            "vpcId": $scope.params.vpcId,
                            "networkID": $scope.params.networkID,
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "privateIP": searchIP,
                            "allocateType": "MANUAL", // MANUAL:手动; AUTO:自动
                            "userId": user.id,
                            "start": page.getStart(),
                            "limit": page.displayLength
                        });
                        promise.then(function (resolvedValue) {
                            if (!resolvedValue || !resolvedValue.privateIPs) {
                                return;
                            }
                            _.each(resolvedValue.privateIPs, function (data) {
                                _.extend(data, {
                                    "opt": "",
                                    "dnatInfoUI": "",
                                    "usedTime": "",
                                    "statusUI": networkServiceIns.getPrivateIpUIStatus(data.status)
                                });

                                // 根据语言信息获取dnat的描述
                                if (data.dnatInfo) {
                                    if ($("html").scope().urlParams.lang === "en") {
                                        data.dnatInfoUI = data.dnatInfo.en_US;
                                    }
                                    else {
                                        data.dnatInfoUI = data.dnatInfo.zh_CN;
                                    }
                                    data.usedTime = NOLIMIT === dnatLifeTime ? i18n.common_term_notLimit_value ||'不限':dnatLifeTime;
                                }
                            });
                            $scope.ipListTable.data = resolvedValue.privateIPs;
                            $scope.ipListTable.totalRecords = resolvedValue.total;
                        });
                    },
                    "queryDnatUsedTime": function () {
                        var params = {
                            "user": user,
                            "vpcId": $scope.params.vpcId,
                            "cloudInfraId": $scope.params.cloudInfraId
                        };
                        var deferred = networkServiceIns.queryNATPConfig(params);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            dnatLifeTime = data.lifeTime;

                            $scope.operate.queryPrivateIP();
                        });
                    }
                };

                $scope.operate.queryDnatUsedTime();
            }
        ];

        var ipUsageByHandModule = angular.module("network.ipUsageByHand", ['framework']);
        ipUsageByHandModule.controller("network.ipUsageByHand.ctrl", ipUsageByHandCtrl);
        ipUsageByHandModule.service("camel", http);
        ipUsageByHandModule.service("exception", exceptionService);
        return ipUsageByHandModule;
    });
