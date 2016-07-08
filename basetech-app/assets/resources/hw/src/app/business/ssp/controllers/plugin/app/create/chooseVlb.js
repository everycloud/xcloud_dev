/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加磁盘的control
 * 修改人：
 * 修改时间：14-2-18
 */
/* global define */
define(['jquery',
    "sprintf",
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'tiny-lib/angular',
    'app/services/httpService',
    'app/services/validatorService',
    "tiny-lib/underscore",
    'app/business/ssp/services/plugin/app/appCommonService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, sprintf, ngSanitize, keyIDI18n, angular, http, validator, _, appCommonService) {
    "use strict";

    var chooseVlbCtrl = ["$scope", "$compile", "camel", "$state", "exception", "$q",
        function ($scope, $compile, camel, $state, exception, $q) {
            var user = $("html").scope().user;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            $scope.selVlbData = $("#createAppChooseVlbSel1").widget().option("selVlbData");
            $scope.vpcId = $("#createAppChooseVlbSel1").widget().option("vpcId");
            $scope.cloudInfraId = $("#createAppChooseVlbSel1").widget().option("cloudInfraId");
            $scope.tmpSelectedVlbId = $scope.selVlbData && $scope.selVlbData.associateVlbId;
            $scope.tmpSelectedVlbName = $scope.selVlbData && $scope.selVlbData.associateVlb;
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;
            var STATUS_MAP = {
                "FAULT": i18n.common_term_trouble_label,
                "READY": i18n.common_term_running_value
            };

            $scope.availableVlbs = {
                "id": "createAppChooseVlbAvailabeVlbs",
                "draggable": true,
                "displayLength": 10,
                "totalRecords": 0,
                "paginationStyle": "full_numbers",
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
                    "sTitle": i18n.common_term_protocolAndPort_label,
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
                        $scope.tmpSelectedVlbName = vlbName;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "createAppChooseVlbOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    $scope.selVlbData.associateVlbId = $scope.tmpSelectedVlbId;
                    $scope.selVlbData.associateVlb = $scope.tmpSelectedVlbName;
                    $("#createAppChooseVlbSel1").widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "createAppChooseVlbCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#createAppChooseVlbSel1").widget().destroy();
                }
            };

            function queryAvailableVlbTemp() {
                var options = {
                    "user": user,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId,
                    "limit": 10,
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
                    $scope.availableVlbs.totalRecords = data.total;
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

    var chooseVlbModule = angular.module("app.create.chooseVlb", ['framework', 'ngSanitize']);
    chooseVlbModule.controller("app.create.chooseVlb.ctrl", chooseVlbCtrl);
    chooseVlbModule.service("camel", http);
    chooseVlbModule.service("ecs.vm.detail.disk.add.validator", validator);

    return chooseVlbModule;
});
