/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($, angular, Radio, Message, httpService, exceptionService) {
    "use strict";
    var addDiskCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionSer = new exceptionService();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.locale = $("html").scope().i18n.locale;
            var window = $("#addDiskWindow").widget();
            var serverId = window.option("serverId");
            var novaId = window.option("novaId");
            var projectId = window.option("projectId");
            var tokenId = window.option("tokenId");
            var region = window.option("region");
            var tenantId = window.option("tenantId");
            var cinderId;
            var statuses = {
                "in-use": $scope.i18n.common_term_used_value || "已使用",
                "available": $scope.i18n.common_term_available_label || "可用",
                "creating": $scope.i18n.common_term_creating_value || "创建中",
                "error": $scope.i18n.common_term_trouble_label || "故障",
                "downloading": $scope.i18n.common_term_creating_value || "创建中",
                "attaching": $scope.i18n.common_term_mounting_value || "挂载中",
                "detaching": $scope.i18n.common_term_detaching_value || "卸载中",
                "ERROR_DELETING": $scope.i18n.common_term_deleteFail_value || "删除失败",
                "error_deleting": $scope.i18n.common_term_deleteFail_value || "删除失败",
                "deleting": $scope.i18n.common_term_deleting_value || "删除中"
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
                "placeholder": $scope.i18n.org_term_findDisk_prom,
                "search": function (searchString) {
                    searchInfo.markers = [];
                    $scope.hasPrePage = false;
                    $scope.curPage = 1;
                    getDisks();
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
                getDisks();
            };
            $scope.nextPage = function () {
                if (!$scope.hasNextPage) {
                    return;
                }
                searchInfo.markers.push($scope.diskTable.data[searchInfo.limit - 1].id);
                $scope.hasPrePage = true;
                $scope.curPage++;
                getDisks();
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
                    getDisks();
                }
            };
            $scope.diskTable = {
                "id": "addVmDiskTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.statusStr);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.size);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data["os-vol-host-attr:host"]);
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
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.created_at);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                    $('td:eq(6)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "diskRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#diskRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#diskRadio_" + index).widget().option("checked", false);
                                }
                                index++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //确定按钮
            $scope.okButton = {
                "id": "modifyFlavorOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.diskTable.data;
                    var index = 0;
                    var selectedDisk = null;
                    while ($("#diskRadio_" + index).widget()) {
                        var checked = $("#diskRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedDisk = data[index].id;
                            break;
                        }
                        index++;
                    }
                    if (selectedDisk) {
                        if (data[index]["os-vol-tenant-attr:tenant_id"] == tenantId) {
                            addDisk(selectedDisk);
                        }
                        else {
                            errorMessage();
                        }
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "modifyFlavorCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };

            function errorMessage() {
                var options = {
                    type: "error",
                    content: $scope.i18n.org_disk_mountVM_info_sameVPC_msg,
                    height: "150px",
                    width: "350px"
                };
                var msg = new Message(options);
                msg.show();
            }

            function addDisk(selectedDisk) {
                var params = {
                    "volumeAttachment": {
                        "volumeId": selectedDisk
                    }
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/os-volume_attachments",
                        o: {novaId: novaId, projectId: projectId, serverId: serverId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            function getDisks() {
                var params = {};
                if ($("#" + $scope.searchBox.id).widget()) {
                    var name = $("#" + $scope.searchBox.id).widget().getValue();
                    if(name && name !== ""){
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
                        s: "/goku/rest/v1.5/openstack/{cinderId}/v2/{projectId}/volumes/detail?all_tenants=1",
                        o: {cinderId: cinderId, projectId: projectId}
                    },
                    "params": params,
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    var disks = data.volumes;
                    for (var i = 0; i < disks.length; i++) {
                        disks[i].statusStr = $scope.locale === "en" ? disks[i].status : (statuses[disks[i].status] || disks[i].status);
                    }
                    $scope.$apply(function () {
                        $scope.diskTable.data = disks;
                        if (disks.length < searchInfo.limit || params.name) {
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
                        getDisks();
                    }
                    else {
                        exceptionSer.doException(data);
                    }
                });
            }

            function getRegion() {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var endPoint = data && data.endpoint || [];
                    var regions = [];
                    for (var i = 0; i < endPoint.length; i++) {
                        if (endPoint[i].regionName === region && endPoint[i].serviceName === "cinder") {
                            cinderId = endPoint[i].id;
                            break;
                        }
                    }
                    getDisks();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            getRegion();
        }];

    var addDiskModule = angular.module("vdcMgr.serverInfo.addVmDisk", ["ng"]);
    addDiskModule.service("camel", httpService);
    addDiskModule.controller("vdcMgr.serverInfo.addVmDisk.ctrl", addDiskCtrl);
    return addDiskModule;
});