define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-widgets/Window",
    "app/business/network/services/networkService",
    "app/business/network/services/router/routerService",
    "app/services/messageService",
    "tiny-lib/underscore",
    "tiny-directives/Button",
    "tiny-directives/Table",
    "fixtures/dnatFixture"
], function ($, angular, Window, networkService, routerService, MessageService, _) {
    "use strict";

    var dnatListCtrl = ["$scope", "$compile", "camel", "exception", "$q", "networkCommon",
        function ($scope, $compile, camel, exception, $q, networkCommon) {
            var user = $scope.user;
            var i18n = $scope.i18n;
            var networkServiceIns = new networkService(exception, $q, camel);
            var routerServiceIns = new routerService(exception, $q, camel);
            var DNAT_OPERATE_RIGHT = "552002";

            $scope.hasOperateDnatRight = _.contains(user.privilegeList, DNAT_OPERATE_RIGHT);

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            var DNAT_STATUS_MAP = {
                "READY": i18n.common_term_ready_value,
                "PENDING": i18n.common_term_creating_value,
                "DELETING": i18n.common_term_deleting_value,
                "FAIL": i18n.common_term_fail_label,
                "FORCED_TO_DELETING": i18n.common_term_forciblyDeling_value
            };

            $scope.help = {
                "helpKey": "drawer_dnat",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.cloudInfraId = networkCommon && networkCommon.cloudInfraId;
            $scope.vpcId = networkCommon && networkCommon.vpcId;
            $scope.azId = networkCommon && networkCommon.azId;
            $scope.lifeTime = null;

            $scope.refresh = {
                "id": "network_dnet_refreshId",
                "click": function () {
                    queryNATPConfig();
                }
            };
            $scope.createBtn = {
                "id": "network-vpcmanager-dnat-create",
                "text": i18n.common_term_apply_button,
                "icon": {
                    left: "opt-add"
                },
                "click": function () {
                    if (!$scope.hasRouter) {
                        new MessageService().okMsgBox(i18n.nat_dnat_add_info_noRouter_msg+"。");
                        return;
                    }

                    var createDnatShareParam = {
                        "cloudInfraId": $scope.cloudInfraId,
                        "vpcId": $scope.vpcId,
                        "needRefresh": false
                    };
                    var params = {
                        "user": user,
                        "vpcId": createDnatShareParam.vpcId,
                        "cloudInfraId": createDnatShareParam.cloudInfraId
                    };
                    var deferred = networkServiceIns.queryNATPConfig(params);
                    deferred.then(function (data) {
                        if (!data || (null === data.zoneID)) {
                            new MessageService().okMsgBox(i18n.nat_dnat_add_info_noAcceesCfg_msg);
                            return;
                        }
                        var beginPort = data.beginPort;
                        var endPort = data.endPort;
                        if (!checkIsValid(beginPort) || !checkIsValid(endPort)) {
                            createDnatShareParam.dnatValidate = "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) + ";maxValue(65535):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65535) +";";
                        } else {
                            beginPort = $.encoder.encodeForHTML(beginPort);
                            endPort = $.encoder.encodeForHTML(endPort);
                            var integerExp = "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, beginPort, endPort) +";";
                            var maxExp = "maxValue(" + endPort + "):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, beginPort, endPort) +";";
                            var minExp = "minValue(" + beginPort + "):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, beginPort, endPort) +";";
                            createDnatShareParam.dnatValidate = integerExp + maxExp + minExp;
                        }
                        var options = {
                            "winId": "dnat_create_winId",
                            "createDnatShareParam": createDnatShareParam,
                            title: i18n.common_term_apply_button,
                            width: "900px",
                            height: "675px",
                            "content-type": "url",
                            "content": "app/business/network/views/createDnat.html",
                            "buttons": null,
                            "close": function (event) {
                                if (createDnatShareParam.needRefresh) {
                                    queryDNET();
                                }
                            }
                        };

                        var win = new Window(options);
                        win.show();
                    });
                }
            };

            // 存储当前下钻的虚拟机信息
            $scope.currentItem = undefined;

            $scope.dnatTable = {
                "id": "vpcmanager-dnat-listtable",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
                "enablePagination": true,
                "draggable": true,
                "displayLength": 10,
                "totalRecords": 0,
                "visibility": {
                    "activate": "click",
                    "aiExclude": [0, 9],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {}
                },
                "columns": [{
                    "sTitle": "",
                    "mData": "showDetail",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "30"
                }, {
                    "sTitle":i18n.vpc_term_publicIP_label,
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.publicIp);
                    }
                }, {
                    "sTitle": "ID",
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.dnatID);
                    }
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "sWidth": "50",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusValue);
                    }
                }, {
                    "sTitle": i18n.nat_term_publicNetPort_label,
                    "sWidth": "80",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.publicPort);
                    }
                }, {
                    "sTitle": i18n.vpc_term_bondObj_label,
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.bindingObj);
                    }
                }, {
                    "sTitle": i18n.common_term_privateIP_label,
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.privateIp);
                    }
                }, {
                    "sTitle": i18n.common_term_privatePort_label,
                    "sWidth": "80",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.privatePort);
                    }
                }, {
                    "sTitle":i18n.common_term_protocol_label,
                    "sWidth": "50",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.protocol);
                    }
                }, {
                    "sTitle":i18n.common_term_startTime_label,
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.startTime);
                    }
                }, {
                    "sTitle": i18n.common_term_endTime_label,
                    "sWidth": "100",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.endTime);
                    }
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.opt);
                    }
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    $("td:eq(8)", nRow).addTitle();
                    $("td:eq(9)", nRow).addTitle();
                    $("td:eq(10)", nRow).addTitle();

                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                    });

                    if (!$scope.hasOperateDnatRight) {
                        return;
                    }

                    var operate = "";
                    if (aData.statusValue === DNAT_STATUS_MAP["PENDING"] || aData.statusValue === DNAT_STATUS_MAP["DELETING"]||aData.statusValue === DNAT_STATUS_MAP["FORCED_TO_DELETING"]) {
                        operate = "<div><li class='disabled'>"+i18n.common_term_release_button+"</li></div>";
                    } else {
                        operate = "<div><li><a class='btn-link' ng-click='release()'>"+i18n.common_term_release_button+"</a></li></div>";
                    }
                    var operateLink = $compile(operate);
                    var operateScope = $scope.$new();
                    operateScope.release = function () {
                        releaseDnat(aData);
                    };
                    var operateNode = operateLink(operateScope);
                    $("td:eq(11)", nRow).html(operateNode);
                },
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryDNET();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryDNET();
                }
            };

            function checkIsValid(limit) {
                if (typeof limit === "undefined") {
                    return false;
                }
                if (null === limit) {
                    return false;
                }
                if (isNaN(limit)) {
                    return false;
                }
                return true;
            }

            function releaseDnat(aData) {
                var params = {
                    "user": user,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId,
                    "dnatId": aData.dnatID
                };
                var defered = networkServiceIns.releaseDnat(params);
                defered.then(function (data) {
                    queryDNET();
                });
            }

            function queryDNET() {
                var params = {
                    "user": user,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId
                };
                var defered = networkServiceIns.queryDNAT(params);
                defered.then(function (data) {
                    if (!data) {
                        return;
                    }
                    var newDnets = [];
                    if (!data.dnats || (data.dnats.length === 0)) {
                        $scope.dnatTable.data = newDnets;
                        return;
                    }
                    _.each(data.dnats, function (item, index) {
                        _.extend(item, {
                            "showDetail": "",
                            "opt": "",
                            "detail": {
                                contentType: "url",
                                content: "app/business/network/views/dnatDetail.html"
                            }
                        });
                        item.statusValue = DNAT_STATUS_MAP[item.status] || "";
                        item.bindingObj = generateBindObj(item);
                        newDnets.push(item);
                    });
                    $scope.dnatTable.data = newDnets;
                    $scope.dnatTable.displayLength = page.displayLength;
                    $scope.dnatTable.totalRecords = data.total;
                });
            }

            function generateBindObj(rowData) {
                if (!rowData) {
                    return "";
                }
                var vmID = parseInt(rowData.vmID, 10);
                if (isNaN(vmID)) {
                    return "";
                }
                if (vmID < 0) {
                    return "";
                }

                return rowData.vmName + "-" + rowData.nicName;
            }

            function queryNATPConfig() {
                var params = {
                    "user": user,
                    "vpcId": $scope.vpcId,
                    "cloudInfraId": $scope.cloudInfraId
                };
                var deferred = networkServiceIns.queryNATPConfig(params);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }

                    $scope.lifeTime = data.lifeTime;
                    queryDNET();
                });
            }

            function queryRouters() {
                var options = {
                    "cloudInfraId": $scope.cloudInfraId,
                    "azId": $scope.azId,
                    "vpcId": $scope.vpcId,
                    "vdcId": user.vdcId,
                    "userId": user.id
                };
                var deferred = routerServiceIns.queryRouter(options);
                deferred.then(function (data) {
                    if (!data || !data.routers || data.routers.length <= 0) {
                        $scope.hasRouter = false;
                    } else {
                        $scope.hasRouter = true;
                        $scope.routerType = data.routers[0].routerType;
                        queryNATPConfig();
                    }
                });
            }

            $scope.$on("$viewContentLoaded", function () {
                queryRouters();
            });
        }
    ];
    return dnatListCtrl;
});
