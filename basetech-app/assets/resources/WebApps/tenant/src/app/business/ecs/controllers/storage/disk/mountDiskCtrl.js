/**
 * 文件名：mountDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--绑定虚拟机的control
 * 修改时间：14-2-27
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    'app/services/httpService',
    "app/services/exceptionService",
    "app/business/ecs/services/storage/diskService",
    "app/business/ecs/services/vm/queryVmService",
    "app/business/ecs/services/vm/vmCommonService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, _, http, exception, diskService, queryVmService, vmCommonService) {
    "use strict";

    var mountDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 父窗口传递的参数
            var winParam = $("#ecsStorageDisksMountDiskWinId").widget().option("winParam");
            winParam = winParam || {};
            var cloudInfra = winParam.cloudInfra || {};
            var disk = winParam.disk || {};
            var user = $("html").scope().user;
            $scope.isICT = user.cloudType === "ICT";
            var diskServiceIns = new diskService(exception, $q, camel);
            var queryVmServiceIns = new queryVmService(exception, $q, camel);
            var vmCommonServiceIns = new vmCommonService();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var searchString = "";
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "allow":null,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            //ICT 场景下的分页
            $scope.page = page;
            $scope.hasPrePage = false;
            $scope.hasNextPage = false;
            var markers = [];
            $scope.prePage = function () {
                if (!$scope.hasPrePage) {
                    return;
                }
                markers.pop();
                if (markers.length === 0) {
                    $scope.hasPrePage = false;
                }
                page.currentPage--;
                getVmData();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                var item = $scope.vms.data[page.displayLength - 1] || {};
                markers.push(item.id);
                $scope.hasPrePage = true;
                page.currentPage++;
                getVmData();
            };
            $scope.pageSize = {
                "id": "vms-searchSizeSelector",
                "width": "80",
                "values": [
                    {
                        "selectId": "10",
                        "label": "10",
                        "checked": true
                    },
                    {
                        "selectId": "20",
                        "label": "20"
                    },
                    {
                        "selectId": "50",
                        "label": "50"
                    }
                ],
                "change": function () {
                    page.currentPage = 1;
                    page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                    markers = [];
                    $scope.hasPrePage = false;
                    getVmData();
                }
            };

            //是否允许绑定
            $scope.isMountSelector = {
                "id": "isMountSelector",
                "width": "135",
                "values": [
                    {
                        "selectId": "all",
                        "label": "全部",
                        "checked": true
                    },
                    {
                        "selectId": "free",
                        "label": "可绑定"
                    }
                ],
                "change": function () {
                    page.isMount = $("#" + $scope.isMountSelector.id).widget().getSelectedId();
                    page.isMount = page.isMount === "all" ? null : page.isMount;
                    page.currentPage = 1;
                    getVmData();
                }
            };
            $scope.searchBox = {
                "id": "ecsStorageDisksMountDiskSearch",
                "placeholder": $scope.isICT?i18n.common_term_findName_prom:i18n.vm_term_findVMnameIPglobeID_prom,
                "width": "300",
                "maxLength": 64,
                "search": function (content) {
                    searchString = content;
                    page.currentPage = 1;
                    markers = [];
                    $scope.hasPrePage = false;
                    getVmData();
                }
            };

            $scope.vms = {
                "id": "ecsStorageDisksMountDiskVms",
                "enablePagination":!$scope.isICT,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "columns": [{
                    "sTitle": "",
                    "mData": "",
                    "bSearchable": false,
                    "bSortable": false,
                    "sWidth": "60px"
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": $scope.isICT?i18n.common_term_ID_label:i18n.common_term_globeID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    }
                }, {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.allIp);
                    }
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "mData": "statusView"
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVmData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getVmData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //tips提示
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();

                    // 单选框
                    var selBox = "<div><tiny-radio id='id' value='value' name='name' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.value = aData.id;
                    selBoxScope.name = "ecsStorageDisksMountDiskVmsRadio";
                    selBoxScope.id = "ecsStorageDisksMountDiskVmsRadioId" + iDataIndex;
                    selBoxScope.change = function () {
                        $scope.okBtn.disable = false;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "ecsStorageDiskMountDiskOK",
                "text": i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    var options = {
                        "user": user,
                        "volumeId": disk.id,
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": winParam.vpcId,
                        "params": {
                            "mount": {
                                "vmId": $("#ecsStorageDisksMountDiskVmsRadioId0").widget().opChecked()
                            }
                        }
                    };
                    var deferred = diskServiceIns.operateDisk(options);
                    deferred.then(function (data) {
                        winParam.needRefresh = true;
                        $("#ecsStorageDisksMountDiskWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsStorageDiskMountDiskCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsStorageDisksMountDiskWinId").widget().destroy();
                }
            };

            //转换状态字符串
            var statusStrMap = {
                "running": i18n.common_term_running_value,
                "stopped": i18n.common_term_stoped_value,
                "hibernated": i18n.common_term_hibernated_value,
                "creating": i18n.common_term_creating_value,
                "create_failed": i18n.common_term_createFail_value,
                "create_success": i18n.common_term_createSucceed_value,
                "starting": i18n.common_term_startuping_value,
                "stopping": i18n.common_term_stoping_value,
                "migrating": i18n.common_term_migrating_value,
                "shutting_down": i18n.common_term_shuting_value,
                "fault_resuming": i18n.common_term_recoverying_value,
                "hibernating": i18n.common_term_hibernating_value,
                "rebooting": i18n.common_term_restarting_value,
                "pause": i18n.common_term_pause_value,
                "recycling": i18n.common_term_reclaiming_value,
                "unknown": i18n.common_term_unknown_value
            };

            // 查询虚拟机列表信息
            function getVmData() {
                var startIndex;
                if(!$scope.isICT) {
                    startIndex = page.getStart();
                }
                else {
                    var length = markers.length;
                    startIndex = markers[length-1] || "";
                }

                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "condition": searchString,
                    "start": startIndex,
                    "limit": page.displayLength,
                    "azId": winParam.azId,
                    "vpcId": winParam.vpcId,
                    "isIct":$scope.isICT
                };
                if(page.isMount){
                    options.isMount = true;
                    options.volumeId = disk.id;
                }

                var deferred = queryVmServiceIns.queryVmList(options);
                deferred.then(function (data) {
                    _.each(data.list.vms, function (item) {
                        _.extend(item, {
                            "allIp": getIp(item),
                            "statusView": statusStrMap[item.status]
                        });
                    });

                    $scope.vms.data = data.list.vms;
                    $scope.vms.displayLength = page.displayLength;
                    $scope.vms.totalRecords = data.list.total;

                    if (!data.list.vms || data.list.vms.length < page.displayLength) {
                        $scope.hasNextPage = false;
                    }
                    else {
                        $scope.hasNextPage = true;
                    }

                    $("#" + $scope.vms.id).widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });

                    $scope.okBtn.disable = true;
                });
            }

            //从查询得到的VM信息中获取IP
            function getIp(vm) {
                var ip = "";
                if (vm && vm.vmSpecInfo) {
                    var nics = vm.vmSpecInfo.nics;
                    if (nics && nics.length) {
                        _.each(nics, function (item) {
                            ip += vmCommonServiceIns.packIp(item.ip, item.ipv6s);
                        });
                        var index = ip.lastIndexOf(";");
                        if (index > 0 && index === ip.length - 1) {
                            ip = ip.slice(0, index);
                        }
                    }
                }
                return ip;
            }

            // 查询初始信息
            getVmData();
        }
    ];

    var mountDiskModule = angular.module("ecs.storage.disk.mount", ['ng',"wcc","ngSanitize"]);
    mountDiskModule.controller("ecs.storage.disk.mount.ctrl", mountDiskCtrl);
    mountDiskModule.service("camel", http);
    mountDiskModule.service("exception", exception);

    return mountDiskModule;
});
