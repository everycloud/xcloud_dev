/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        "tiny-widgets/Window",
        "app/services/cloudInfraService",
        "app/services/exceptionService",
        "app/services/messageService",
        "app/business/ecs/services/vm/vmNicService",
        "app/business/ecs/services/storage/diskSnapshotService",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular, _, Window, cloudInfraService, exceptionService, messageService, vmNicService, diskSnapshotService) {
        "use strict";

        var snapshotCtrl = ["$rootScope", "$scope", "$compile", "$state", "$q", "camel", "exception", "storage",
            function ($rootScope, $scope, $compile, $state, $q, camel, exception, storage) {
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var exceptionServiceIns = new exceptionService();
                var messageIns = new messageService();
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var diskSnapshotServiceIns = new diskSnapshotService(exception, $q, camel);
                var i18n = $scope.i18n;
                var user = $rootScope.user || {};
                var cloudInfraId = {};
                var vpcId = "-1";

                // 权限控制
                var DISK_OPERATE = "610000";
                var hasDiskOperateRight = _.contains(user.privilegeList, DISK_OPERATE);

                $scope.help = {
                    "helpKey": "drawer_vm_disk",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };

                //当前页码信息
                var searchInfo = {
                    "name": "",
                    "status": null,
                    "limit": 10
                };
                $scope.curPage = 1;
                $scope.hasPrePage = false;
                $scope.hasNextPage = false;
                $scope.searchLocation = {
                    "id": "ecsStorageDiskSnapshotsSearchLocation",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        cloudInfraId = $("#" + $scope.searchLocation.id).widget().getSelectedId();
                        $scope.curPage = 1;
                        $scope.hasPrePage = false;
                        $scope.diskSnapshots.data = [];
                        var defer = queryVpc();
                        defer.then(function () {
                            getAllDiskSnapshots();
                        });

                        storage.add("cloudInfraId", cloudInfraId);
                    }
                };

                $scope.searchVpc = {
                    "id": "ecsStorageDiskSnapshotsSearchVpc",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        vpcId = $("#" + $scope.searchVpc.id).widget().getSelectedId();
                        $scope.curPage = 1;
                        $scope.hasPrePage = false;
                        $scope.vmTable.data = [];
                        getAllDiskSnapshots();
                        storage.add("vpcId", vpcId);
                    }
                };

                $scope.searchBox = {
                    "id": "ecsStorageDiskSnapshotsSearchBox",
                    "placeholder": i18n.vm_term_findSnap_prom,
                    "width": "250",
                    "maxLength": 64,
                    "search": function (content) {
                        $scope.hasPrePage = false;
                        $scope.curPage = 1;
                        getAllDiskSnapshots();
                    }
                };

                $scope.refresh = {
                    "id": "ecsStorageSnapshotsRefresh",
                    "text": i18n.common_term_fresh_button,
                    "click": function () {
                        getAllDiskSnapshots();
                    }
                };
                $scope.prePage = function () {
                    if (!$scope.hasPrePage) {
                        return;
                    }
                    $scope.curPage--;
                    if($scope.curPage <= 1){
                        $scope.hasPrePage = false;
                    }
                    getAllDiskSnapshots();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    $scope.hasPrePage = true;
                    $scope.curPage++;
                    getAllDiskSnapshots();
                };
                //页尺寸选择框
                $scope.sizeSelector = {
                    "id": "searchSizeSelector",
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
                        searchInfo.limit = $("#" + $scope.sizeSelector.id).widget().getSelectedId();
                        $scope.hasPrePage = false;
                        $scope.curPage = 1;
                        getAllDiskSnapshots();
                    }
                };
                $scope.diskSnapshots = {
                    "id": "ecsStorageDiskSnapshotsTable",
                    "enablePagination": false,
                    "columnsDraggable": true,
                    "columns": [{
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
                        "sTitle": i18n.common_term_sizeGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.size);
                        }
                    }, {
                        "sTitle": i18n.common_term_disk_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.volumeName);
                        }
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        }
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        // tips
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        //操作列
                        if (hasDiskOperateRight) {
                            var menus = '<span class="dropdown" style="position: static">' +
                                '<a class="btn-link dropdown-toggle" data-toggle="dropdown">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                                '<ul class="dropdown-menu pull-right vmOptWidth" role="menu" aria-labelledby="dLabel">';
                            menus += "<li><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a></li>";
                            menus += "<li><a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a></li>";
                            menus += '</ul></span>';
                            var optColumn;
                            if (aData.status === "available") {
                                optColumn = "<div><a class='btn-link' ng-click='createDisk()'>" + i18n.org_term_createDisk_button + "</a>&nbsp;&nbsp;&nbsp;" + menus + "</div>";
                            } else {
                                optColumn = "<div><span class='disabled'>" + i18n.org_term_createDisk_button + "</span>&nbsp;&nbsp;&nbsp;" + menus + "</div>";
                            }

                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.createDisk = function () {
                                createDisk(aData.size, aData.id);
                            };
                            optScope.modify = function () {
                                modifyDiskSnapshot(aData.id, aData.name, aData.description);
                            };
                            optScope["delete"] = function () {
                                deleteDiskSnapshot(aData.id);
                            };
                            var optNode = optLink(optScope);
                            $("td:eq(7)", nRow).html(optNode);
                            optNode.find('.dropdown').dropdown();
                        }
                    }
                };

                // 创建磁盘
                function createDisk(size, id) {
                    var winParam = {
                        "needRefresh": false,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "size": size,
                        "snapshotId": id
                    };

                    var options = {
                        "winId": "ecsStorageDiskSnapshotsAddDiskWinId",
                        "winParam": winParam,
                        "title": i18n.org_term_createDisk_button,
                        "width": "350px",
                        "height": "215px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/disk/addDiskBySnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDiskSnapshots();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 修改磁盘快照
                function modifyDiskSnapshot(id, name, description) {
                    var winParam = {
                        "needRefresh": false,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "snapshotId": id,
                        "name": name,
                        "description": description
                    };

                    var options = {
                        "winId": "ecsStorageDiskSnapshotsModSnapshotWinId",
                        "winParam": winParam,
                        "title": i18n.org_term_modifyDiskSnap_button,
                        "width": window.urlParams.lang === "en" ? "776px" : "680",
                        "height": "300px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/diskSnapshot/modDiskSnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDiskSnapshots();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 删除磁盘快照
                function deleteDiskSnapshot(id) {
                    var winParam = {
                        "needRefresh": false,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "snapshotId": id
                    };
                    var options = {
                        "winId": "ecsStorageDiskSnapshotsDelSnapshotWinId",
                        "winParam": winParam,
                        "title": i18n.resource_term_delDiskSnap_button,
                        "width": "310px",
                        "height": "200px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/storage/diskSnapshot/delDiskSnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getAllDiskSnapshots();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 状态字符串转换
                var statusStrMap = {
                    "creating": i18n.common_term_creating_value,
                    "available": i18n.common_term_available_label,
                    "deleting": i18n.common_term_deleting_value,
                    "error_deleting": i18n.common_term_trouble_label,
                    "error": i18n.common_term_trouble_label,
                    "in-use": i18n.common_term_onuse_value
                };

                // 查询当前租户的所有磁盘列表
                function getAllDiskSnapshots() {
                    if (!cloudInfraId || vpcId === "-1") {
                        return;
                    }
                    var params = {
                        "list": {
                            limit: searchInfo.limit
                        }
                    };
                    if ($("#" + $scope.searchBox.id).widget()) {
                        params.list.searchCondition = $("#" + $scope.searchBox.id).widget().getValue();
                    }
                    if ($scope.curPage > 1) {
                        params.list.start = ($scope.curPage-1)*searchInfo.limit;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "param": params
                    };
                    var deferred = diskSnapshotServiceIns.operateDiskSnapshots(options);
                    deferred.then(function (data) {
                        if (!data || !data.list) {
                            return;
                        }
                        _.each(data.list.snapshots, function (item) {
                            _.extend(item, {
                                "statusView": statusStrMap[item.status] || i18n.common_term_other_label
                            });
                        });

                        $scope.diskSnapshots.data = data.list.snapshots;
                        if (data.list.snapshots.length < searchInfo.limit) {
                            $scope.hasNextPage = false;
                        }
                        else {
                            $scope.hasNextPage = true;
                        }
                    });
                }

                //查询当前租户可见的地域列表
                function queryLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).id;
                        }
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exceptionServiceIns.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                // 查询VPC列表
                function queryVpc() {
                    if (!cloudInfraId) {
                        return;
                    }
                    var retDefer = $q.defer();
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfraId,
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

                            var curr = vmNicServiceIns.getUserSelVpc(data.vpcs);
                            curr.checked = true;
                            vpcId = curr.vpcID;
                        }
                        $scope.searchVpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                //初始化
                function init() {
                    var defer = queryLocations();
                    defer.then(function () {
                        var defer1 = queryVpc();
                        defer1.then(function () {
                            getAllDiskSnapshots();
                        });
                    });
                }

                init();
            }
        ];

        return snapshotCtrl;
    }
);
