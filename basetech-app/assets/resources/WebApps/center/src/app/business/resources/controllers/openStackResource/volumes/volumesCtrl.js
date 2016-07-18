/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "tiny-widgets/Checkbox",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService",
    "fixtures/dataCenterFixture"
], function ($, angular, Progressbar, Window, Message, Checkbox, bootstrap, exceptionService) {
    "use strict";

    var diskCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var exceptionSer = new exceptionService();
        var user = $("html").scope().user;
        var tokenId;
        var projectId;
        var regionName;
        var serviceId;

        var i18n = $scope.i18n ||{};
        var statusMap = {
            "in-use": i18n.common_term_used_value || "已使用",
            "available": i18n.common_term_available_label || "可用",
            "creating": i18n.common_term_creating_value || "创建中",
            "error": i18n.common_term_trouble_label || "故障",
            "downloading": i18n.common_term_creating_value || "创建中",
            "attaching": i18n.common_term_mounting_value || "挂载中",
            "detaching": i18n.common_term_detaching_value || "卸载中",
            "ERROR_DELETING": i18n.common_term_deleteFail_value || "删除失败",
            "error_deleting": i18n.common_term_deleteFail_value || "删除失败",
            "deleting": i18n.common_term_deleting_value || "删除中"
        };

        //查询信息
        var searchInfo = {
            "name": null,
            "markers": [],
            "limit": 10
        };
        $scope.curPage = 1;
        $scope.hasPrePage = false;
        $scope.hasNextPage = false;
        //模糊搜索框
        $scope.searchBox = {
            "id": "searchVmBox",
            "placeholder": i18n.org_term_findDisk_prom,
            "width":"230",
            "search": function (searchString) {
                searchInfo.markers = [];
                $scope.hasPrePage = false;
                $scope.curPage = 1;
                getDisk();
            }
        };
        $scope.prePage = function () {
            if (!$scope.hasPrePage) {
                return;
            }
            searchInfo.markers.pop();
            if (searchInfo.markers.length === 0) {
                $scope.hasPrePage = false;
            }
            $scope.curPage--;
            getDisk();
        };
        $scope.nextPage = function () {
            if (!$scope.hasNextPage) {
                return;
            }
            searchInfo.markers.push($scope.diskTable.data[searchInfo.limit - 1].id);
            $scope.hasPrePage = true;
            $scope.curPage++;
            getDisk();
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
                searchInfo.markers = [];
                $scope.hasPrePage = false;
                $scope.curPage = 1;
                getDisk();
            }
        };
        //实例过滤框
        $scope.regionSelector = {
            "id": "diskRegionSelector",
            "width": "135",
            "values": [
            ],
            change: function () {
                serviceId = $("#" + $scope.regionSelector.id).widget().getSelectedId();
                regionName = $("#" + $scope.regionSelector.id).widget().getSelectedLabel();
                searchInfo.markers = [];
                $scope.hasPrePage = false;
                $scope.curPage = 1;
                $scope.diskTable.data = [];
                getDisk();
            }
        };
        $scope.refresh = function () {
            getDisk();
        };
        //创建按钮
        $scope.createButton = {
            "id": "createDiskButton",
            "text": i18n.common_term_create_button || "创建",
            "click": function () {
                var newWindow = new Window({
                    "winId": "createDiskWindow",
                    "serviceId": serviceId,
                    "title": i18n.common_term_create_button || "创建磁盘",
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/openStackResource/volumes/createVolume.html",
                    "width": "443px",
                    "height": "250px",
                    "maximizable":false,
                    "minimizable":false,
                    "close": function () {
                        getDisk();
                    }
                });
                newWindow.show();
            }
        };

        //磁盘列表
        $scope.diskTable = {
            "id": "storeInfoDiskTable",
            "data": null,
            "enablePagination": false,
            "columnsVisibility": {
                "aiExclude": [0, 9]
            },
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": i18n.common_term_name_label || "名称",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_status_label || "状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML("" + data.statusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_capacityGB_label || "容量(GB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML("" + data.size);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_type_label || "类型",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.typeStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_host_label || "主机",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data["os-vol-host-attr:host"]);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_vm_label || "虚拟机",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.server_id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "VPC ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data["os-vol-tenant-attr:tenant_id"]);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_createAt_label || "创建时间",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.created_at);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_operation_label || "操作",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": "150px"
                }
            ],
            "callback": function (pageInfo) {
            },
            "changeSelect": function (pageInfo) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                $("td:eq(3)", nRow).addTitle();
                $("td:eq(4)", nRow).addTitle();
                $("td:eq(5)", nRow).addTitle();
                $("td:eq(6)", nRow).addTitle();
                $("td:eq(7)", nRow).addTitle();
                $("td:eq(8)", nRow).addTitle();
                $("td:eq(9)", nRow).addTitle();

                // 操作列
                var optColumn = "<div><a href='javascript:void(0)' ng-click='modify()'>" + i18n.common_term_modify_button + "</a></div>";

                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.modify = function () {
                    var newWindow = new Window({
                        "winId": "modifyVolumeWindow",
                        "serviceId": serviceId,
                        "diskId": aData.id,
                        "diskName": aData.name,
                        "title": i18n.org_term_modifyDisk_button || "修改磁盘",
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/openStackResource/volumes/modifyVolume.html",
                        "width": "350px",
                        "height": "200px",
                        "maximizable":false,
                        "minimizable":false,
                        "close": function () {
                            getDisk();
                        }
                    });
                    newWindow.show();
                };
                optScope.delete = function () {
                    var options = {
                        "type": "confirm",
                        "content": "删除后磁盘上的数据将会丢失，您确定要删除吗？",
                        "height": "120px",
                        "width": "330px",
                        "buttons": [
                            {
                                label: '确定',
                                default: true,
                                handler: function (event) {
                                    msg.destroy();
                                    deleteDisk(aData.id);
                                }
                            },
                            {
                                label: '取消',
                                default: false,
                                handler: function (event) {
                                    msg.destroy();
                                }
                            }
                        ]
                    };
                    var msg = new Message(options);
                    msg.show();
                };
                var optNode = optLink(optScope);
                $("td:eq(9)", nRow).html(optNode);
                optNode.find('.dropdown-toggle').dropdown();

                //执行删除磁盘动作
                function deleteDisk(diskId) {
                    var deferred = camel.post({
                        url: {
                            s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/volumes/{volume_id}/action",
                            o: {redirect_address_id: serviceId, tenant_id: projectId, volume_id: diskId}
                        },
                        "params": JSON.stringify({
                            "os-force_delete": {
                            }
                        }),
                        "userId": user.id,
                        "token": tokenId
                    });
                    deferred.success(function (data) {
                        getDisk();
                    });
                    deferred.fail(function (data) {
                        exceptionSer.doException(data);
                    });
                }
            }
        };

        function getDisk() {
            var params = { };
            if ($("#" + $scope.searchBox.id).widget()) {
                var name = $("#" + $scope.searchBox.id).widget().getValue();
                if (name && name !== "") {
                    params.name = name;
                }
            }
            //用名称全匹配搜索时，不进行分页，因为后台不支持
            if (params.name) {
                searchInfo.markers = [];
                $scope.curPage = 1;
                $scope.hasPrePage = false;
                $scope.hasNextPage = false;
            }
            else{
                params.limit = searchInfo.limit;
                if(searchInfo.markers.length > 0){
                    params.marker = searchInfo.markers[searchInfo.markers.length - 1];
                }
            }
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{redirect_address_id}/v2/{tenant_id}/volumes/detail?all_tenants={all_tenants}",
                    o: {redirect_address_id: serviceId, tenant_id: projectId, all_tenants: "1"}
                },
                "params": params,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                $scope.diskTable.curPage = {
                    "curPage": {
                        "pageIndex": 0
                    }
                };
                if (data && data.volumes) {
                    var disks = data.volumes;
                    for (var index = 0; index < disks.length; index++) {
                        var disk = disks[index];
                        disk.statusStr = statusMap[disk.status] || disk.status;
                        if (disk.attachments && disk.attachments.length > 0) {
                            var serverIds = [];
                            for (var i = 0; i < disk.attachments.length; i++){
                                serverIds.push(disk.attachments[i].server_id);
                            }
                            disk.server_id = serverIds.join(";");
                        }
                        if (disk.shareable === "true") {
                            disk.typeStr = i18n.common_term_share_label || "共享";
                        }
                        else{
                            disk.typeStr = i18n.common_term_common_label || "普通";
                        }
                    }
                }

                $scope.$apply(function () {
                    $scope.diskTable.data = disks;
                    if (disks.length < searchInfo.limit) {
                        $scope.hasNextPage = false;
                    }
                    else {
                        $scope.hasNextPage = true;
                    }
                });
            });
            deferred.fail(function (data) {
                if ($scope.hasPrePage) {
                    searchInfo.markers = [];
                    $scope.curPage = 1;
                    $scope.hasPrePage = false;
                    $scope.hasNextPage = false;
                    getDisk();
                }
                else {
                    exceptionSer.doException(data);
                }
            });
        }
        function getToken(ifGetData) {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data === undefined) {
                    return;
                }
                tokenId = data.id;
                projectId = data.projectId;
                if(ifGetData){
                    getDisk();
                }
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getRegion() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                "userId": user.id
            });
            deferred.success(function (data) {
                var endPoint = data && data.endpoint || [];
                var regionMap = {};
                var regions = [];
                for (var i = 0; i < endPoint.length; i++) {
                    if (regionMap[endPoint[i].regionName]) {
                        continue;
                    }
                    if (endPoint[i].serviceName === "cinder") {
                        regionMap[endPoint[i].regionName] = true;
                        var region = {
                            selectId: endPoint[i].id,
                            label: endPoint[i].regionName
                        };
                        regions.push(region);
                    }
                }
                if (regions.length > 0) {
                    regions[0].checked = true;
                    $("#" + $scope.regionSelector.id).widget().option("values", regions);
                    serviceId = regions[0].selectId;
                    regionName = regions[0].label;
                    getToken(true);
                }
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        getToken(false);
        getRegion();
    }];

    return diskCtrl;
});