/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加磁盘的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    "bootstrapui/ui-bootstrap-tpls",
    'app/services/httpService',
    'tiny-common/UnifyValid',
    'app/services/exceptionService',
    'app/services/cloudInfraService',
    'app/business/ecs/services/vm/vmDiskService',
    "app/business/ecs/services/storage/diskService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, _,uibootstrap, http, UnifyValid, exception, cloudInfraService, vmDiskService, diskService) {
    "use strict";

    var addDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 公共参数和服务
            var vmId = $("#ecsVmsDetailAddDiskWinId").widget().option("vmId");
            var vpcId = $("#ecsVmsDetailAddDiskWinId").widget().option("vpcId");
            var azId = $("#ecsVmsDetailAddDiskWinId").widget().option("azId");
            var cloudInfra = $("#ecsVmsDetailAddDiskWinId").widget().option("cloudInfra");

            var user = $("html").scope().user || {};
            var isIT = user.cloudType === "IT";
            $scope.isIT = isIT;
            var vmDiskServiceIns = new vmDiskService(exception, $q, camel);
            var diskServiceIns = new diskService(exception, $q, camel);
            var cloudInfraServiceIns = new cloudInfraService($q, camel);

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            // 部署场景
            $scope.deployMode = $("html").scope().deployMode;
            // 搜索字符串
            var searchString = "";

            var page = {
                "currentPage": 1,
                "displayLength": 10,
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
                getExistDisks();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                var item = $scope.existDisks.data[page.displayLength - 1] || {};
                markers.push(item.id);
                $scope.hasPrePage = true;
                page.currentPage++;
                getExistDisks();
            };
            $scope.pageSize = {
                "id": "adddisk-exist-pageselector",
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
                    getExistDisks();
                }
            };

            // 状态字符串转换
            var statusStrMap = {
                "CREATING": i18n.common_term_creating_value,
                "USE": i18n.common_term_available_label,
                "RESTORING": i18n.common_term_resuming_value,
                "SNAPSHOTING": i18n.common_term_snaping_value,
                "MIGRATING": i18n.common_term_migrating_value,
                "RESIZING": i18n.common_term_expanding_value,
                "SHRINKING": i18n.common_term_reclaiming_value,
                "DELETING": i18n.common_term_deleting_value,
                "COPYING": i18n.common_term_copying_value,
                "NO_ATTACH": i18n.common_term_noBond_value,
                "ATTACHED": i18n.common_term_bonded_value,
                "ATTACHING": i18n.common_term_bonding_value,
                "DETACHING" : i18n.common_term_unbond_value,
                "ERROR": i18n.common_term_trouble_label,
                "LOSE":$scope.i18n.common_term_lose_value
            };

            $scope.diskType = {
                "id": "ecsVmDetailAddDiskType",
                "layout": "horizon",
                "selected": "2",
                "values": [{
                    "key": "2",
                    "text": i18n.vm_term_existingDisk_label,
                    "checked": true
                }, {
                    "key": "1",
                    "text": i18n.org_disk_term_add_para_disk_label,
                    "checked": false
                }],
                "change": function () {
                    $scope.diskType.selected = $("#ecsVmDetailAddDiskType").widget().opChecked("checked");
                }
            };

            $scope.searchBox = {
                "id": "addDiskSearchBox",
                "placeholder": $scope.isIT?i18n.common_term_findNameID_prom:i18n.org_term_findDisk_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (content) {
                    searchString = content;
                    page.currentPage = 1;
                    getExistDisks();
                }
            };
            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "id": "ecsVmDetailAddDiskName",
                "value": "",
                "width": "215",
                "extendFunction": ["vmDiskNameValid"],
                "validate": "vmDiskNameValid():" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64)
            };

            var capValidTips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65536);
            $scope.capacity = {
                "label": i18n.common_term_capacityGB_label + ":",
                "id": "ecsVmDetailAddDiskCapacity",
                "value": "20",
                "width": "215",
                "require": true,
                "tips": "1~65536GB",
                "validate": "integer:" + capValidTips + ";maxValue(65536):" + capValidTips + ";minValue(1):" + capValidTips
            };
            //模式下拉框
            $scope.patternSelector = {
                "label": $scope.i18n.common_term_formatDiskMode_label+":",
                "id": "createDiskPatternSelector",
                "width": "214",
                "values": [
                    {
                        "selectId": "0",
                        "label": $scope.i18n.common_term_formatFull_label,
                        "checked": true
                    },
                    {
                        "selectId": "1",
                        "label": $scope.i18n.common_term_formatDelay_label
                    },
                    {
                        "selectId": "2",
                        "label": $scope.i18n.common_term_formatQuick_label
                    }
                ]
            };
            $scope.storageMedia = {
                "label": i18n.common_term_storageMedia_label + ":",
                "id": "ecsVmDetailAddDiskStoreMedia",
                "width": "214",
                "require": isIT,
                "validate": isIT?("required:" + i18n.common_term_null_valid + ";"):"",
                "values": []
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
                        "label": "可添加"
                    }
                ],
                "change": function () {
                    page.isMount = $("#" + $scope.isMountSelector.id).widget().getSelectedId();
                    page.isMount = page.isMount === "all" ? null : page.isMount;
                    page.currentPage = 1;
                    getExistDisks();
                }
            };
            $scope.existDisks = {
                "id": "ecsVmDetailAddDiskExistDisks",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "enablePagination": isIT ? true : false,
                columnsDraggable:true,
                "columns": [{
                    "sTitle": "", //设置第一列的标题
                    "mData": "",
                    "sWidth": "30px",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "mData": "statusView",
                    "bSortable": false
                },{
                    "sTitle": i18n.common_term_capacityGB_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.capacityGB);
                    },
                    "bSortable": false
                },{
                    "sTitle": i18n.org_term_bondVM_button,
                    "bVisible":isIT,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.bindedVms);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_storageMedia_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mediaTypeView);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_type_label,
                    "mData": "typeView",
                    "bSortable": false
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getExistDisks();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getExistDisks();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    //单选按钮
                    var selBox = "<div><tiny-radio id='id' name='name' value='value' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.name = "ecsVmDetailAddDiskExistDisksRadio";
                    selBoxScope.id = "ecsVmDetailAddDiskExistDisksRadioId" + iDataIndex;
                    selBoxScope.value = aData.id;
                    selBoxScope.change = function () {
                        $scope.existDiskOkBtn.disable = false;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "ecsVmDetailAddDiskOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    if (!UnifyValid.FormValid($("#ecsVmDetailDiskAddNormal"))) {
                        return;
                    }

                    var options = {
                        "vmId": vmId,
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "name": $.trim($("#" + $scope.name.id).widget().getValue()),
                        "size": $("#" + $scope.capacity.id).widget().getValue(),
                        "mediaType": $("#" + $scope.storageMedia.id).widget().getSelectedId(),
                        "user": user
                    };
                    options.configType = $("#" + $scope.patternSelector.id).widget().getSelectedId();
                    var deferred = vmDiskServiceIns.addVmDisk(options);
                    deferred.then(function (data) {
                        $(".ecs_vm_detail_disks").scope().reloadVmDisks = true;
                        $("#ecsVmsDetailAddDiskWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "ecsVmDetailAddDiskCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailAddDiskWinId").widget().destroy();
                }
            };

            $scope.existDiskOkBtn = {
                "id": "ecsVmDetailAddDiskExistOK",
                "text": i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    if (!UnifyValid.FormValid($("#ecsVmDetailDiskAddNormal"))) {
                        return;
                    }

                    var options = {
                        "volumeId": $("#ecsVmDetailAddDiskExistDisksRadioId0").widget().opChecked(),
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "user": user,
                        "params": {
                            "mount": {
                                "vmId": vmId
                            }
                        }
                    };
                    var deferred = diskServiceIns.operateDisk(options);
                    deferred.then(function (data) {
                        $(".ecs_vm_detail_disks").scope().reloadVmDisks = true;
                        $("#ecsVmsDetailAddDiskWinId").widget().destroy();
                    });
                }
            };

            $scope.existDiskCancelBtn = {
                "id": "ecsVmDetailAddDiskExistCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#ecsVmsDetailAddDiskWinId").widget().destroy();
                }
            };

            // 查询已有磁盘列表
            var diskTypeString = {
                "normal": i18n.common_term_common_label,
                "share": i18n.common_term_share_label
            };

            function getExistDisks() {
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "limit": page.displayLength,
                    "azId": azId,
                    "vpcId": vpcId,
                    "condition": searchString
                };
                if(isIT) {
                    options.start = page.getStart();
                    if(page.isMount){
                        options.vmId = vmId;
                    }
                }
                else {
                    var length = markers.length;
                    options.start = markers[length-1] || null;
                }
                var deferred = diskServiceIns.queryDisks(options);
                deferred.then(function (data) {
                    if (data && data.list) {
                        var volumes = data.list.volumes || [];
                        var volVmInfos;
                        _.each(volumes, function (item) {
                            item.typeView = diskTypeString[item.type];
                            item.statusView = statusStrMap[item.status];
                            item.mediaTypeView = item.mediaType === "SAN-Any"?"Any":item.mediaType;
                            item.bindedVms = "";

                            // 从绑定的虚拟机列表中获取虚拟机名称，采用分号分隔
                            volVmInfos = item.volVmInfos || [];
                            _.each(volVmInfos,function(volVmInfo){
                                item.bindedVms += volVmInfo.vmName + ";";
                            });
                            // 去掉最后一个分号
                            if (item.bindedVms.length > 0) {
                                item.bindedVms = item.bindedVms.slice(0, item.bindedVms.length - 1);
                            }
                        });

                        $scope.existDisks.data = volumes;
                        $scope.existDisks.totalRecords = data.list.total;
                        $scope.existDisks.displayLength = page.displayLength;
                        if (volumes.length < page.displayLength) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
                        $("#" + $scope.existDisks.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                        // 清空已选
                        $scope.existDiskOkBtn.disable = true;
                        var radio = $("#ecsVmDetailAddDiskExistDisksRadioId0").widget();
                        if (radio) {
                            radio.option("checked", false);
                        }
                    }
                });
            }

            // 查询AZ中的存储介质
            function queryMediaType() {
                var deferred = cloudInfraServiceIns.queryAzDetail({
                    "user": user,
                    "azId": azId,
                    "cloudInfraId": cloudInfra.id
                });
                deferred.then(function (data) {
                    if (!data || !data.availableZone) {
                        return;
                    }

                    var mediaType = [ ];
                    if(!isIT){
                        mediaType.push({
                            "selectId": "",
                            "label": " ",
                            "checked": true
                        });
                    }

                    var tags = data.availableZone.tags;
                    if (tags && tags.datastore) {
                        _.each(tags.datastore, function (item) {
                            mediaType.push({
                                "label": item.value === "SAN-Any"?"Any":item.value,
                                "selectId": item.value
                            });
                        });
                    }

                    $scope.storageMedia.values = mediaType;
                }, function (response) {
                    exception.doException(response);
                });
            }

            UnifyValid.vmDiskNameValid = function () {
                var input = $("#" + $scope.name.id).widget().getValue();
                if ($.trim(input) === "") {
                    return true;
                }
                var vmDiskNameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
                return vmDiskNameReg.test(input);
            };

            function init() {
                queryMediaType();
                getExistDisks();
            }

            //获取初始数据
            init();
        }
    ];

    var addDiskModule = angular.module("ecs.vm.detail.disk.add", ["ui.bootstrap",'ng',"wcc","ngSanitize"]);
    addDiskModule.controller("ecs.vm.detail.disk.add.ctrl", addDiskCtrl);
    addDiskModule.service("camel", http);
    addDiskModule.service("exception", exception);

    return addDiskModule;
});
