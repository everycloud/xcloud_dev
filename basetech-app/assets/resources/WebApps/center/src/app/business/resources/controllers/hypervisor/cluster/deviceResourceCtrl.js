define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Window, Message, Exception) {
    "use strict";

    var deviceCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        var i18n = $scope.i18n || {};
        var clusterId = $stateParams.clusterId;
        $scope.clusterName = $stateParams.clusterName;

        var statuses = {
            Working: i18n.common_term_running_value || "运行",
            Ready: i18n.common_term_ready_value || "就绪",
            Unavailable: i18n.common_term_unavailable_value || "不可用"
        };
        var searchTips = {
            "filterName": $scope.i18n.common_term_findName_prom,
            "filterVmId": $scope.i18n.vm_term_findVMID_prom
        };
        var allocateStatuses = {
            UnAllocated: i18n.common_term_noAssign_value || "未分配",
            Allocated: i18n.common_term_used_value || "已分配"
        };
        $scope.help = {
            show : false
        };
        $scope.refresh = function(){
            getData();
        };
        var searchInfo = {
            "start": 0,
            "limit": 10,
            allocateStatus : null,
            status : null,
            condition:"vmName"
        };
        //分配状态过滤框
        $scope.allocateSelector = {
            "id": "allocateSelector",
            "width": "135",
            "values": [
                {
                    "selectId": "all",
                    "label": i18n.common_term_allAssignStatus_label,
                    "checked": true
                },
                {
                    "selectId": "UnAllocated",
                    "label": i18n.common_term_noAssign_value
                },
                {
                    "selectId": "Allocated",
                    "label": i18n.common_term_used_value
                }
            ],
            "change": function () {
                var allocateStatus = $("#" + $scope.allocateSelector.id).widget().getSelectedId();
                searchInfo.allocateStatus = allocateStatus === "all" ? null : allocateStatus;
                searchInfo.start = 0;
                $scope.deviceTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        //状态过滤框
        $scope.statusSelector = {
            "id": "statusSelector",
            "width": "135",
            "values": [
                {
                    "selectId": "all",
                    "label": i18n.common_term_allStatus_value,
                    "checked": true
                },
                {
                    "selectId": "Working",
                    "label": i18n.common_term_running_value
                },
                {
                    "selectId": "Ready",
                    "label": i18n.common_term_ready_value
                },
                {
                    "selectId": "Unavailable",
                    "label": i18n.common_term_unavailable_value
                }
            ],
            "change": function () {
                var status = $("#" + $scope.statusSelector.id).widget().getSelectedId();
                searchInfo.status = status === "all" ? null : status;
                searchInfo.start = 0;
                $scope.deviceTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        //搜索字段选择框
        $scope.searchSelector = {
            "id": "searchSelector",
            "width": "100",
            "values": [
                {
                    "selectId": "vmName",
                    "label": $scope.i18n.common_term_name_label,
                    "checked": true
                },
                {
                    "selectId": "vmId",
                    "label": $scope.i18n.common_term_vmID_label
                }
            ],
            "change": function () {
                searchInfo.condition = $("#" + $scope.searchSelector.id).widget().getSelectedId();
                $("#" + $scope.searchBox.id).widget().option("placeholder", searchTips[searchInfo.condition]);
                $("#" + $scope.searchBox.id).widget().setValue("");
            }
        };
        //模糊搜索框
        $scope.searchBox = {
            "id": "searchVmBox",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "search": function (searchString) {
                searchInfo.start = 0;
                $scope.deviceTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        //主机列表
        $scope.deviceTable = {
            "id" : "device_resource_table",
            "data" : null,
            "paginationStyle": "full_numbers",
            "enablePagination": true,
            "lengthChange": true,
            "totalRecords": 0,
            "displayLength": 10,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "USB ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.usbId);
                    },
                    "bSortable": false,
                    "sWidth": 250
                },
                {
                    "sTitle": i18n.common_term_productID_label||"产品ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.productId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_assignStatus_label||"分配状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.allocateStatusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.device_term_deviceStatus_label||"设备状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_vms_label||"虚拟机",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vmName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_vmID_label||"虚拟机ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vmId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.device_term_deviceVersion_label||"设备版本",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.version);
                    },
                    "bSortable": false
                },
                {
                    "sTitle":  $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false
                }
            ],
            "callback": function (pageInfo) {
                searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                getData();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.deviceTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.deviceTable.displayLength = pageInfo.displayLength;
                getData();
            },
            "renderRow" : function(nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();
                $('td:eq(7)', nRow).addTitle();
                // 操作列
                var optColumn = "<div>";
                if (aData.allocateStatus === "UnAllocated") {
                    optColumn += "<a href='javascript:void(0)' ng-click='bind()'>" + $scope.i18n.vpc_term_bond_label + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<span class='disabled'>" + $scope.i18n.common_term_unbond_button + "</span></div>";
                }
                else {
                    optColumn += "<span  class='disabled'>" + $scope.i18n.vpc_term_bond_label + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<a href='javascript:void(0)' ng-click='unbind()'>" + $scope.i18n.common_term_unbond_button + "</a></div>";
                }
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.bind = function () {
                    bindWindow(aData.usbId,aData.hostId);
                };
                optScope.unbind = function () {
                    unbindMessage(aData.usbId, aData.vmId);
                };
                var optNode = optLink(optScope);
                $("td:eq(8)", nRow).html(optNode);
            }
        };
        function unbindMessage(usbId, vmId) {
            var options = {
                type: "confirm",
                content: $scope.i18n.vm_vm_delUSBdevice_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            removeUsb(usbId, vmId);
                            msg.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }
        function removeUsb(usbId, vmId) {
            var deferred = camel.delete({
                url: {s: "/goku/rest/v1.5/irm/1/vms/{vmId}/usbdevice/{usbId}", o: {vmId: vmId, usbId: usbId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function bindWindow(usbId,hostId) {
            var newWindow = new Window({
                "winId": "usbBindVmWindow",
                "title": $scope.i18n.org_term_bondVM_button,
                "content-type": "url",
                "usbId": usbId,
                "hostId": hostId,
                "buttons": null,
                "content": "app/business/resources/views/device/host/hostDetail/usbBindVm.html",
                "height": 500,
                "width": 780,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }
        function getData() {
            if ($("#" + $scope.searchBox.id).widget()) {
                searchInfo.value = $("#" + $scope.searchBox.id).widget().getValue();
                searchInfo.value = searchInfo.value === "" ? null : searchInfo.value;
            }
            var params = {
                "offset": searchInfo.start,
                "limit": searchInfo.limit,
                "scopeType":"clusterUrn"
            };
            if(searchInfo.allocateStatus){
                params.allocateStatus = searchInfo.allocateStatus;
            }
            if(searchInfo.status){
                params.workStatus = searchInfo.status;
            }
            if(searchInfo.value){
                params[searchInfo.condition] = searchInfo.value;
            }
            var deferred = camel.post({
                "url":{s:"/goku/rest/v1.5/irm/1/resourceclusters/{id}/usbs",o:{id:clusterId}},
                "params" : JSON.stringify(params),
                "userId":user.id
            });
            deferred.success(function(data) {
                var usbs = data && data.usbs || [];
                for(var i=0;i<usbs.length;i++){
                    usbs[i].statusStr = statuses[usbs[i].status] || usbs[i].status;
                    usbs[i].allocateStatusStr= allocateStatuses[usbs[i].allocateStatus] || usbs[i].allocateStatus;
                }
                $scope.$apply(function () {
                    $scope.deviceTable.totalRecords = data.total || usbs.length;
                    $scope.deviceTable.data = usbs;
                });
            });
        }
        getData();
    }];
    return deviceCtrl;
});