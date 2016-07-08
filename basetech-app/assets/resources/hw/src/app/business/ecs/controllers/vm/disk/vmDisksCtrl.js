/**
 * 文件名：disksCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--查看磁盘列表的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    'app/services/httpService',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    'app/business/ecs/services/vm/queryVmService',
    'app/business/ecs/services/vm/vmDiskService',
    "app/business/ecs/services/storage/diskService",
    'tiny-widgets/Window',
    'tiny-widgets/Message'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, _, http, validator, exception, capacityService, queryVmService, vmDiskService, diskService, Window, Message) {
    "use strict";

    var disksCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 公共参数和服务
            var vmId = $("#ecsVmsDiskDetailWinId").widget().option("vmId");
            var vpcId = $("#ecsVmsDiskDetailWinId").widget().option("vpcId");
            var azId = $("#ecsVmsDiskDetailWinId").widget().option("azId");
            var status = $("#ecsVmsDiskDetailWinId").widget().option("status");
            var cloudInfra = $("#ecsVmsDiskDetailWinId").widget().option("cloudInfra");
            var user = $("html").scope().user || {};
            var isIT = user.cloudType === "IT";
            var isSC = $("html").scope().deployMode === "serviceCenter";
            var queryVmServiceIns = new queryVmService(exception, $q, camel);
            var diskServiceIns = new diskService(exception, $q, camel);
            var vmDiskServiceIns = new vmDiskService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            var supportSafeDelete = "false";
            $scope.reloadVmDisks = false;

            // 权限控制
            $scope.hasVmBasicOperateRight = _.contains(user.privilegeList, "616000"); // 启动、重启、关闭、强制重启、强制关闭、修改

            // 允许操作的状态
            var allowStatus = {
                "add": ["running", "stopped"],
                "modify": ["running", "stopped", "hibernated"],
                "delete": ["stopped"],
                "expand": ["running","stopped"]
            };

            $scope.add = {
                "id": "ecsVmDetailDisksAdd",
                "text": i18n.common_term_add_button,
                "disable": !isStatusOk(status, "add"),
                "click": function () {
                    $scope.reloadVmDisks = false;
                    var options = {
                        "winId": "ecsVmsDetailAddDiskWinId",
                        "vmId": vmId,
                        "vpcId": vpcId,
                        "azId": azId,
                        "cloudInfra": cloudInfra,
                        "title": i18n.org_term_addDisk_button,
                        "width": "800px",
                        "height": "600px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/disk/addVmDisk.html",
                        "buttons": null,
                        "close": function (event) {
                            if ($scope.reloadVmDisks) {
                                getVmDisks();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
            };

            $scope.refresh = {
                "id": "ecsVmDetailDisksRefresh",
                "click": function () {
                    getVmDisks();
                }
            };

            $scope.disks = {
                "id": "ecsVmDetailDisksTable",
                "enablePagination": false,
                "draggable": true,
                "columns": [{
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": i18n.common_term_ID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.volumeId);
                    }
                }, {
                    "sTitle": i18n.common_term_capacityGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.size);
                    }
                }, {
                    "sTitle": i18n.common_term_storageMedia_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mediaTypeView);
                    }
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "mData": ""
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();

                    //操作列
                    if ( !! aData.volumeId && $scope.hasVmBasicOperateRight) {
                        var menus = '<span class="dropdown" style="position: static">' +
                            '<a class="btn-link dropdown-toggle" data-toggle="dropdown">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                            '<ul class="dropdown-menu pull-right vmOptWidth" role="menu" aria-labelledby="dLabel">';
                        menus += isStatusOk(status, "modify") ? "<li><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_modify_button + "</a></li>";
                        if(!isIT && status !== "stopped"){
                            menus += "<li class='disabled'><a class='btn-link'>" + i18n.common_term_unbond_button + "</a></li>";
                        }
                        else{
                            menus += "<li><a class='btn-link' ng-click='unMount()'>" + i18n.common_term_unbond_button + "</a></li>";
                        }
                        if (supportSafeDelete === "true" && !isSC) {
                            // IT，停止虚拟机，普通磁盘才能扩容
                            menus += (isStatusOk(status, "expand") && aData.type === "normal") ? "<li><a class='btn-link' ng-click='expend()'>" + i18n.common_term_expanding_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_expanding_button + "</a></li>";
                        }
                        menus += '</ul></span>';
                        var delOpt = "";
                        if (!isSC) {
                            delOpt = isStatusOk(status, "delete") ? "<a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a>" : "<span class='disabled'>" + i18n.common_term_delete_button + "</span>";
                            delOpt += "&nbsp;&nbsp;&nbsp;";
                        }
                        var optColumn = "<div>" + delOpt + menus + "</div>";
                        var optLink = $compile($(optColumn));
                        var optScope = $scope.$new();
                        optScope.modify = function () {
                            modifyDisk(aData.volumeId, aData.name);
                        };
                        optScope.unMount = function () {
                            unMountDiskConfirm(aData.volumeId);
                        };
                        optScope.expend = function () {
                            expendDisk(aData.volumeId, aData.size);
                        };
                        optScope["delete"] = function () {
                            if (supportSafeDelete === "true") {
                                deleteDiskOnNewWin(aData.volumeId);
                            } else {
                                deleteDiskConfirm(aData.volumeId);
                            }
                        };
                        var optNode = optLink(optScope);
                        var colIndex = supportSafeDelete === "true" ? "7" : "4";
                        $("td:eq(" + colIndex + ")", nRow).html(optNode);
                        optNode.find('.dropdown').dropdown();
                        optNode.find('.dropdown-toggle').dropdown();
                    }
                }
            };

            // 查询虚拟机磁盘列表
            function getVmDisks() {
                var defer = queryVmServiceIns.queryVmDetail({
                    "user": user,
                    "vmId": vmId,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId
                });
                defer.then(function (data) {
                    if (!data || !data.vm) {
                        return;
                    }
                    _.each(data.vm.volumes, function (item) {
                        if(item.volUsedSize == "-1"){
                            item.volUsedSize = "--";
                        }
                        item.mediaTypeView = item.mediaType === "SAN-Any"?"Any":item.mediaType;
                    });
                    $scope.disks.data = data.vm.volumes;
                });
            }

            // 修改磁盘
            function modifyDisk(volumeId, volumeName) {
                var winParam = {
                    "vmId": vmId,
                    "volumeId": volumeId,
                    "volumeName": volumeName,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId,
                    "needRefresh": false
                };
                var options = {
                    "winId": "ecsVmsDetailModDiskWinId",
                    "winParam": winParam,
                    title: i18n.org_term_modifyDisk_button,
                    width: "310px",
                    height: "190px",
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/disk/modVmDisk.html",
                    "buttons": null,
                    "close": function (event) {
                        if (winParam.needRefresh) {
                            getVmDisks();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            //删除磁盘的确认框
            function unMountDiskConfirm(volumeId) {
                var options = {
                    "type": "confirm",
                    "content": i18n.vm_vm_unbondVMdisk_info_confirm_msg,
                    "height": "120px",
                    "width": "330px",
                    "buttons": [{
                        label: i18n.common_term_ok_button,
                        "default": true,
                        majorBtn : true,
                        "handler": function (event) {
                            msg.destroy();
                            unMountDisk(volumeId);
                        }
                    }, {
                        label: i18n.common_term_cancle_button,
                        "default": false,
                        "handler": function (event) {
                            msg.destroy();
                        }
                    }]
                };
                var msg = new Message(options);
                msg.show();
            }

            // 执行解绑定动作
            function unMountDisk(volumeId) {
                var options = {
                    "user": user,
                    "volumeId": volumeId,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId,
                    "params": {
                        "unmount": {
                            "vmId": vmId
                        }
                    }
                };
                var deferred = diskServiceIns.operateDisk(options);
                deferred.then(function (data) {
                    getVmDisks();
                });
            }
            // 扩容磁盘
            function expendDisk(volumeId, size) {
                var winParam = {
                    "vmId": vmId,
                    "volumeId": volumeId,
                    "size": size,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId,
                    "needRefresh": false
                };
                var options = {
                    "winId": "ecsVmsDetailExpendDiskWinId",
                    "winParam": winParam,
                    title: i18n.common_term_expanding_button,
                    width: "408px",
                    height: "190px",
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/disk/expendVmDisk.html",
                    "buttons": null,
                    "close": function (event) {
                        if (winParam.needRefresh) {
                            getVmDisks();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 支持安全删除时，在新窗口中勾选安全删除
            function deleteDiskOnNewWin(volumeId) {
                var winParam = {
                    "vmId": vmId,
                    "volumeId": volumeId,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId,
                    "needRefresh": false
                };
                var options = {
                    "winId": "ecsVmsDetailDelDiskWinId",
                    "winParam": winParam,
                    title: i18n.vm_term_delVMdisk_button,
                    width: "370px",
                    height: "200px",
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/disk/deleteVmDisk.html",
                    "buttons": null,
                    "close": function (event) {
                        if (winParam.needRefresh) {
                            getVmDisks();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 删除磁盘确认框
            function deleteDiskConfirm(volumeId) {
                var options = {
                    "type": "confirm",
                    "content": i18n.vm_disk_del_info_confirm_msg,
                    "height": "120px",
                    "width": "330px",
                    "buttons": [{
                        label: i18n.common_term_ok_button,
                        "default": true,
                        majorBtn : true,
                        "handler": function (event) {
                            msg.destroy();
                            doDeleteDisk(volumeId);
                        }
                    }, {
                        label: i18n.common_term_cancle_button,
                        "handler": function (event) {
                            msg.destroy();
                        }
                    }]
                };
                var msg = new Message(options);
                msg.show();
            }

            // 删除磁盘
            function doDeleteDisk(volumeId) {
                var defer = vmDiskServiceIns.deleteVmDisk({
                    "user": user,
                    "vmId": vmId,
                    "volumeId": volumeId,
                    "cloudInfraId": cloudInfra.id,
                    "mode": "normal",
                    "vpcId": vpcId
                });
                defer.then(function (data) {
                    getVmDisks();
                });
            }

            //查询支持的能力字段
            function queryCapacity() {
                var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, cloudInfra.type, cloudInfra.version);
                if (capacity) {
                    supportSafeDelete = capacity.vm_support_safe_delete;
                }
                if (supportSafeDelete === "true") {
                    $scope.disks.columns = [{
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": 100,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "sWidth": 60,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.volumeId);
                        }
                    }, {
                        "sTitle": i18n.common_term_capacityGB_label,
                        "sWidth": 90,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.size);
                        }
                    }, {
                        "sTitle": i18n.perform_term_factAvailableCapacityGB_label,
                        "sWidth": 90,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.volUsedSize);
                        }
                    }, {
                        "sTitle": i18n.perform_term_usedCapacityGB_label,
                        "sWidth": 90,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmUsedSize);
                        }
                    }, {
                        "sTitle": i18n.device_term_slotID_label,
                        "sWidth": 50,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sequenceNum);
                        }
                    }, {
                        "sTitle": i18n.common_term_storageMedia_label,
                        "sWidth": 90,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mediaTypeView);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "sWidth": 120
                    }];
                }
            }

            // 是否状态运行操作
            function isStatusOk(status, operate) {
                var allow = _.find(allowStatus[operate], function (item) {
                    return item === status;
                });
                return !!allow;
            }

            //获取初始数据
            getVmDisks();
            queryCapacity();
        }
    ];

    var disksModule = angular.module("ecs.vm.detail.disks", ['ng',"wcc","ngSanitize"]);
    disksModule.controller("ecs.vm.detail.disks.ctrl", disksCtrl);
    disksModule.service("camel", http);
    disksModule.service("ecs.vm.detail.disks.validator", validator);
    disksModule.service("exception", exception);

    return disksModule;
});
