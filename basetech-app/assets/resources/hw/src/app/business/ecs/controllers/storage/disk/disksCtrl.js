/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-lib/underscore",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        'app/services/competitionConfig',
        "app/services/cloudInfraService",
        "app/services/capacityService",
        "app/business/ecs/services/storage/diskService",
        "app/business/ecs/services/vm/vmNicService",
        "app/services/exceptionService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular, _, Window, Message, competitionConfig, cloudInfraService, capacityService, diskService, vmNicService, exceptionService) {
        "use strict";

        var diskLstCtrl = ["$rootScope", "$scope", "$compile", "$state", "$stateParams", "$q", "camel", "exception", "storage",
            function ($rootScope, $scope, $compile, $state, $stateParams, $q, camel, exception, storage) {
                // 公共参数和服务
                var capacityServiceIns = new capacityService($q, camel);
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var exceptionServiceIns = new exceptionService();
                var diskServiceIns = new diskService(exception, $q, camel);
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var user = $rootScope.user || {};
                var isIT = user.cloudType === "IT";
                $scope.isIT = isIT;
                var searchString = "";
                var cloudInfra = {};
                var vpcId = "-1";
                var i18n = $scope.i18n;

                // 权限控制
                var DISK_OPERATE = "610000";
                var hasDiskOperateRight = _.contains(user.privilegeList, DISK_OPERATE);

                // 和弹出框之间传递数据
                var winParam = {
                    needRefresh: false,
                    disk: {}
                };

                $scope.help = {
                    "helpKey": "drawer_vm_disk",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                $scope.createBtn = {
                    "id": "ecsStorageDisksCreate",
                    "text": i18n.common_term_create_button,
                    "display": hasDiskOperateRight,
                    "click": function () {
                        winParam.needRefresh = false;
                        winParam.cloudInfra = cloudInfra;
                        winParam.vpcId = vpcId;
                        var options = {
                            "winId": "ecsStorageDisksAddDiskWinId",
                            "winParam": winParam,
                            title: i18n.org_term_createDisk_button,
                            width: "450px",
                            height: "400px",
                            "content-type": "url",
                            "content": "app/business/ecs/views/storage/disk/addDisk.html",
                            "buttons": null,
                            "close": function (event) {
                                if (winParam.needRefresh) {
                                    getAllDisks();
                                }
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                };

                $scope.searchLocation = {
                    "id": "ecsStorageDisksSearchLocation",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        var cId = $("#" + $scope.searchLocation.id).widget().getSelectedId();
                        cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.searchLocation.values, cId);
                        page.currentPage = 1;
                        queryCapacity();

                        if ($scope.supportSelectVpc === "true") {
                            var defer = queryVpc();
                            defer.then(function () {
                                getAllDisks();
                            });
                        } else {
                            getAllDisks();
                        }
                        storage.add("cloudInfraId", cloudInfra.id);
                    }
                };

                $scope.searchVpc = {
                    "id": "ecsStorageDisksSearchVpc",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        vpcId = $("#" + $scope.searchVpc.id).widget().getSelectedId();
                        page.currentPage = 1;
                        getAllDisks();
                        storage.add("vpcId", vpcId);
                    }
                };

                $scope.searchBox = {
                    "id": "ecsStorageDisksSearchBox",
                    "placeholder": $scope.isIT?i18n.common_term_findNameID_prom:i18n.org_term_findDisk_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (content) {
                        searchString = content;
                        page.currentPage = 1;
                        getAllDisks();
                    }
                };

                $scope.refresh = {
                    "id": "ecsStorageDisksRefresh",
                    "click": function () {
                        getAllDisks();
                    }
                };

                //当前页码信息
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
                    getAllDisks();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.disks.data[page.displayLength - 1] || {};
                    markers.push(item.id);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    getAllDisks();
                };
                $scope.pageSize = {
                    "id": "disk-list-pageselector",
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
                        getAllDisks();
                    }
                };

                $scope.disks = {
                    "id": "ecsStorageDisksTable",
                    "paginationStyle": "full_numbers",
                    "showDetails": true,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "columnsDraggable": true,
                    "enablePagination": isIT,
                    "columns": [{
                        "sTitle": "",
                        "mData": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusView"
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": "typeView"
                    }, {
                        "sTitle": i18n.common_term_capacity_label + "(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacityGB);
                        }
                    }, {
                        "sTitle": i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.azName);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getAllDisks();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getAllDisks();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // tips
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();

                        //下钻时传递参数
                        $("td:eq(0)", nRow).bind("click", function () {
                            $scope.currentItem = aData;
                            $scope.currentItem.vpcId = vpcId;
                            $scope.currentItem.cloudInfraId = cloudInfra.id;
                        });

                        //使用率
                        if ($scope.supportUsedPercent === "true") {
                            var cpuColumn = "<div class='progressbar'><tiny-progressbar id='id' value='value' width='100' height='9'></tiny-progressbar></div>";
                            var cpuLink = $compile(cpuColumn);
                            var cpuScope = $scope.$new();
                            cpuScope.id = "ecsStorageDisksUsedRate" + iDataIndex;
                            cpuScope.value = aData.usedRate;
                            var cpuNode = cpuLink(cpuScope);
                            if(aData.usedRate){
                                $("td:eq(6)", nRow).html(cpuNode);
                            }
                            else{
                                $("td:eq(6)", nRow).html("-");
                            }
                            $("td:eq(7)", nRow).addTitle();
                        } else {
                            $("td:eq(6)", nRow).addTitle();
                        }

                        //操作列
                        if (hasDiskOperateRight) {
                            addOperateColumn(aData, nRow);
                        }
                    }
                };

                // 操作列添加更多操作
                var addOperateColumn = function (aData, nRow) {
                    var menus = '&nbsp;<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right vmOptWidth" role="menu" aria-labelledby="dLabel">';
                    menus += "<li><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a></li>";
                    if(isIT && $scope.deployMode !== 'serviceCenter'){
                        if(aData.volVmInfos && aData.volVmInfos.length > 0){
                            menus += "<li class='disabled'><a class='btn-link'>" + i18n.common_term_allocate_button + "</a></li>";
                        }
                        else{
                            menus += "<li><a class='btn-link' ng-click='transfer()'>" + i18n.common_term_allocate_button + "</a></li>";
                        }
                    }
                    if (aData.type === "normal" && aData.volVmInfos && aData.volVmInfos.length > 0) {
                        menus += "<li class='disabled'><a>" + i18n.org_term_bondVM_button + "</a></li>";
                    } else {
                        menus += "<li><a class='btn-link' ng-click='mount()'>" + i18n.org_term_bondVM_button + "</a></li>";
                    }
                    // ICT场景有创建磁盘快照按钮
                    if ($scope.supportSelectVpc === "true") {
                        if (competitionConfig.isBaseOnVmware) {
                            if (aData.status === "USE" && aData.type !== "share") {
                                menus += "<li><a class='btn-link' ng-click='createDiskSnapshot()'>" + i18n.vm_term_createSnap_button + "</a></li>";
                            } else {
                                menus += "<li class='disabled'><a>" + i18n.vm_term_createSnap_button + "</a></li>";
                            }
                        }
                        else if($scope.deployMode !== 'serviceCenter'){
                            if (aData.status === "USE" || "ATTACHED" === aData.status) {
                                menus += "<li><a class='btn-link' ng-click='createDiskSnapshot()'>" + i18n.vm_term_createSnap_button + "</a></li>";
                            } else {
                                menus += "<li class='disabled'><a>" + i18n.vm_term_createSnap_button + "</a></li>";
                            }
                        }
                    }
                    menus += '</ul></span>';

                    var optColumn = "<div>";
                    // ServiceCenter没有删除按钮
                    if ($scope.deployMode !== 'serviceCenter') {
                        optColumn = "<a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a>&nbsp;&nbsp;";
                    }
                    optColumn += menus + "</div>";

                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.modify = function () {
                        modifyDisk(aData.id, aData.name);
                    };
                    optScope.transfer = function () {
                        transfer(aData.id);
                    };
                    optScope.mount = function () {
                        mountDisk(aData.id, aData.azId);
                    };
                    optScope["delete"] = function () {
                        deleteDisk(aData.id);
                    };
                    optScope.createDiskSnapshot = function () {
                        createDiskSnapshot(aData.id);
                    };
                    var optNode = optLink(optScope);
                    var optIndex = $scope.supportUsedPercent === "true" ? "8" : "7";
                    $("td:eq(" + optIndex + ")", nRow).html(optNode);
                    $(nRow).find('.dropdown').dropdown();
                };

                //查询当前租户可见的地域列表
                function getLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            if ($stateParams.cloudInfraId) {
                                cloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $stateParams.cloudInfraId);
                                if (!cloudInfra || !cloudInfra.id) {
                                    cloudInfra = data.cloudInfras[0];
                                }
                                data.cloudInfras[0].checked = false;
                                cloudInfra.checked = true;
                            } else {
                                cloudInfra = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                            }
                        }
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exceptionServiceIns.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                // 类型字符串
                var typeStrMap = {
                    "normal": i18n.common_term_common_label,
                    "share": i18n.common_term_share_label
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

                // 查询当前租户的所有磁盘列表
                function getAllDisks() {
                    if (!cloudInfra.id || ($scope.supportSelectVpc === "true" && (!vpcId || vpcId === "-1"))) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "condition": searchString,
                        "cloudInfraId": cloudInfra.id,
                        "limit": page.displayLength,
                        "vpcId": vpcId
                    };
                    if(isIT) {
                        options.start = page.getStart();
                    }
                    else {
                        var length = markers.length;
                        options.start = markers[length-1] || null;
                    }
                    var deferred = diskServiceIns.queryDisks(options);
                    deferred.then(function (data) {
                        if (!data || !data.list) {
                            return;
                        }
                        var volumes = data.list.volumes || [];
                        _.each(volumes, function (item) {
                            _.extend(item, {
                                "showDetail": "",
                                "operate": "",
                                "usedRate": parseInt(item.usedSize * 100 / item.capacityGB, 10),
                                "detail": {
                                    "contentType": "url", // simple & url
                                    "content": "app/business/ecs/views/storage/disk/diskInfo.html"
                                },
                                "typeView": typeStrMap[item.type] || i18n.common_term_other_label,
                                "statusView": statusStrMap[item.status] || i18n.common_term_other_label
                            });
                        });

                        $scope.disks.data = volumes;
                        $scope.disks.totalRecords = data.list.total;
                        $scope.disks.displayLength = page.displayLength;
                        if (volumes.length < page.displayLength) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
                        $("#ecsStorageDisksTable").widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                }

                // 删除磁盘
                function deleteDisk(diskId) {
                    winParam.needRefresh = false;
                    winParam.disk.id = diskId;
                    winParam.vpcId = vpcId;
                    winParam.cloudInfra = cloudInfra;
                    var options = {
                        "winId": "ecsStorageDisksDelDiskWinId",
                        "winParam": winParam,
                        title: i18n.resource_term_delDisk_button,
                        width: "450px",
                        height: "280px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/disk/deleteDisk.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDisks();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 修改磁盘
                function modifyDisk(diskId, diskName) {
                    winParam.needRefresh = false;
                    winParam.disk.id = diskId;
                    winParam.disk.name = diskName;
                    winParam.vpcId = vpcId;
                    winParam.cloudInfra = cloudInfra;
                    var options = {
                        "winId": "ecsStorageDisksModDiskWinId",
                        "winParam": winParam,
                        title: i18n.org_term_modifyDisk_button,
                        width: "310px",
                        height: "190px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/disk/modDisk.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDisks();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 挂载磁盘
                function mountDisk(diskId, azId) {
                    winParam.needRefresh = false;
                    winParam.disk.id = diskId;
                    winParam.vpcId = vpcId;
                    winParam.azId = azId;
                    winParam.cloudInfra = cloudInfra;
                    var options = {
                        "winId": "ecsStorageDisksMountDiskWinId",
                        "winParam": winParam,
                        title: i18n.org_term_bondVM_button,
                        width: "800px",
                        height: "510px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/disk/mountDisk.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDisks();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
                //分配磁盘
                function transfer(diskId) {
                    var newWindow = new Window({
                        "winId": "transferDiskWindow",
                        "title": $scope.i18n.common_term_allocate_button,
                        "options":{
                            "selectedDisk": diskId,
                            "cloudInfraId": cloudInfra.id,
                            "vpcId": vpcId
                        },
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/ecs/views/storage/disk/transfer.html",
                        "height": 500,
                        "width": 700,
                        "close": function () {
                            getAllDisks();
                        }
                    });
                    newWindow.show();
                }
                // 创建磁盘快照
                function createDiskSnapshot(diskId) {
                    winParam.needRefresh = false;
                    winParam.disk.id = diskId;
                    winParam.vpcId = vpcId;
                    winParam.cloudInfraId = cloudInfra.id;
                    var options = {
                        "winId": "ecsStorageDisksCreateSnapshotWinId",
                        "winParam": winParam,
                        title: i18n.vm_term_createSnap_button,
                        "width": window.urlParams.lang === "en" ? "776px" : "680",
                        "height": "300px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/diskSnapshot/addDiskSnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 查询VPC列表，只有ICT才需要
                function queryVpc() {
                    var retDefer = $q.defer();
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id,
                        "start": 0,
                        "limit": 100
                    };
                    var deferred = vmNicServiceIns.queryVpcs(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }
                        if (data.vpcs && data.vpcs.length > 0) {
                            _.each(data.vpcs, function (item) {
                                _.extend(item, {
                                    "label": item.name,
                                    "selectId": item.vpcID
                                });
                            });

                            var curr;
                            if ($stateParams.vpcId) {
                                curr = vmNicServiceIns.getSpecVpc(data.vpcs, $stateParams.vpcId);
                                if (!curr || !curr.vpcID) {
                                    curr = data.vpcs[0];
                                }
                            } else {
                                curr = vmNicServiceIns.getUserSelVpc(data.vpcs);
                            }

                            curr.checked = true;
                            vpcId = curr.vpcID;
                        }
                        $scope.searchVpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                // 查询支持的能力字段
                function queryCapacity() {
                    var capacity = capacityServiceIns.querySpecificCapacity($rootScope.capacities, cloudInfra.type, cloudInfra.version);
                    if (capacity) {
                        $scope.supportSelectVpc = capacity.vpc_support_select;
                        $scope.supportUsedPercent = capacity.volume_support_used_percent;
                    }
                    var columns = [{
                        "sTitle": "",
                        "mData": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },  {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    },{
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusView"
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": "typeView"
                    }, {
                        "sTitle": i18n.common_term_capacity_label + "(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacityGB);
                        }
                    }, {
                        "sTitle": i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.azName);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }];
                    if ($scope.supportUsedPercent === "true") {
                        columns.splice(6, 0, {
                            "sTitle": i18n.perform_term_UsageRate_label,
                            "mData": "usedRate",
                            "sWidth": "150px"
                        });
                    }
                    $scope.disks.columns = columns;
                }

                // 接收子页面发出的刷新表格消息
                $scope.$on("refreshEcsStorageDiskTable", function (event, msg) {
                    getAllDisks();
                });

                //获取初始化信息
                $scope.$on("$viewContentLoaded", function () {
                    var promise = getLocations();
                    promise.then(function () {
                        queryCapacity();

                        // 是否按指定条件搜索
                        if ($stateParams.condition) {
                            searchString = $stateParams.condition;
                            $("#" + $scope.searchBox.id).widget().setValue(searchString);
                        }

                        if ($scope.supportSelectVpc === "true") {
                            var defer = queryVpc();
                            defer.then(function () {
                                getAllDisks();
                            });
                        } else {
                            getAllDisks();
                        }
                    });
                });
            }
        ];

        return diskLstCtrl;
    }
);
