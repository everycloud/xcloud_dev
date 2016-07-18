/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加磁盘的control
 * 修改人：
 * 修改时间：14-2-18
 */
define([
    "sprintf",
    'jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'app/services/validatorService',
    "tiny-lib/underscore",
    'app/business/application/services/appCommonService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n,http, validator, _, appCommonService) {
    "use strict";

    var chooseVlbCtrl = ["$scope", "$compile", "camel", "$state", "exception", "$q",
        function ($scope, $compile, camel, $state, exception, $q) {
            var user = $("html").scope().user;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            var selVlbData = $("#createAppChooseVlbSel1").widget().option("selVlbData");
            $scope.vpcId = $("#createAppChooseVlbSel1").widget().option("vpcId");
            $scope.cloudInfraId = $("#createAppChooseVlbSel1").widget().option("cloudInfraId");
            $scope.tmpSelectedVlbId = selVlbData && selVlbData.associateVlbId;

            var STATUS_MAP = {
                "FAULT": i18n.common_term_trouble_label,
                "READY": i18n.common_term_running_value
            };

            $scope.availableVlbs = {
                "id": "createAppChooseVlbAvailabeVlbs",
                "draggable": true,
                "paginationStyle": "full_numbers",
                "enablePagination": false,
                "lengthMenu": [10, 20, 30],
                "columns": [{
                    "sTitle": "",
                    "sWidth": "6%",
                    "bSortable": false,
                    "bSearchable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    }
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "sWidth": "14%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": i18n.common_term_externalIP_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.extIp);
                    }
                }, {
                    "sTitle":i18n.common_term_protocolAndPort_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.protocolPort);
                    }
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "sWidth": "10%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.status);
                    }
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change(vlbName)'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.name = "createAppChooseVlbRadioName";
                    selBoxScope.id = "createAppChooseVlbRadioId" + iDataIndex;
                    selBoxScope.value = aData.id;
                    selBoxScope.vlbName = aData.name;
                    if ($scope.tmpSelectedVlbId && ($scope.tmpSelectedVlbId === aData.id)) {
                        selBoxScope.checked = true;
                    } else {
                        selBoxScope.checked = false;
                    }
                    selBoxScope.change = function (vlbName) {
                        $scope.tmpSelectedVlbId = $("#createAppChooseVlbRadioId0").widget().opChecked();
                        selVlbData.associateVlb = vlbName;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "createAppChooseVlbOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    selVlbData.associateVlbId = $scope.tmpSelectedVlbId;
                    $("#createAppChooseVlbSel1").widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "createAppChooseVlbCancel",
                "text":i18n.common_term_cancle_button,
                "click": function () {
                    $("#createAppChooseVlbSel1").widget().destroy();
                }
            };

            function queryAvailableVlbTemp() {
                var options = {
                    "user": user,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId,
                    "limit": 100,
                    "start": 0
                };
                var deferred = appCommonServiceIns.queryAvailableVlbTemp(options);
                deferred.then(function (data) {
                    if (!data || (data.lbInfos.length <= 0)) {
                        $scope.availableVlbs.data = [];
                        return;
                    }

                    var newVlbData = [];
                    var tmpVlb = null;
                    _.each(data.lbInfos, function (item, index) {
                        tmpVlb = {};
                        tmpVlb.id = item.lbID;
                        tmpVlb.name = item.lbName;
                        tmpVlb.extIp = item.slbVmInfo && item.slbVmInfo.extIP;
                        tmpVlb.status = item.status;
                        tmpVlb.protocolPort = getProtocolPortInfo(item.listeners);
                        if ((item.status === "READY") || (item.status === "FAULT")) {
                            tmpVlb.status = STATUS_MAP[item.status] || "";
                            newVlbData.push(tmpVlb);
                        }
                    });
                    $scope.availableVlbs.data = newVlbData;
                });
            }

            function getProtocolPortInfo(listeners) {
                if (!listeners || (listeners.length <= 0)) {
                    return "";
                }
                var result = "";
                _.each(listeners, function (item, index) {
                    result += item.protocol;
                    result += "(";
                    result += item.backPort;
                    result += "); ";
                });
                var lastIndex = result.lastIndexOf(";");
                if (lastIndex >= 0) {
                    return result.substring(0, lastIndex);
                } else {
                    return result;
                }
            }

            //获取初始数据
            queryAvailableVlbTemp();
        }
    ];

    var chooseVlbModule = angular.module("app.create.chooseVlb", ['framework', "ngSanitize"]);
    chooseVlbModule.controller("app.create.chooseVlb.ctrl", chooseVlbCtrl);
    chooseVlbModule.service("camel", http);
    chooseVlbModule.service("ecs.vm.detail.disk.add.validator", validator);

    return chooseVlbModule;
});
