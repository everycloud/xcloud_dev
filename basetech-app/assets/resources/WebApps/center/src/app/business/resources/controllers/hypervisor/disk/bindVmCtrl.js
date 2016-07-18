/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($,angular, Radio,Message, httpService, Exception) {
    "use strict";
    var bindVmCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var statuses = {
                running:$scope.i18n.common_term_running_value,
                stopped:$scope.i18n.common_term_stoped_value,
                hibernated:$scope.i18n.common_term_hibernated_value,
                creating:$scope.i18n.common_term_creating_value,
                create_failed:$scope.i18n.common_term_createFail_value,
                create_success:$scope.i18n.common_term_createSucceed_value,
                starting:$scope.i18n.common_term_startuping_value,
                stopping:$scope.i18n.common_term_stoping_value,
                migrating:$scope.i18n.common_term_migrating_value,
                shutting_down:$scope.i18n.common_term_deleting_value,
                fault_resuming:$scope.i18n.common_term_trouble_label,
                hibernating:$scope.i18n.common_term_hibernating_value,
                rebooting:$scope.i18n.common_term_restarting_value,
                pause:$scope.i18n.common_term_pause_value,
                recycling:$scope.i18n.common_term_reclaiming_value,
                unknown:$scope.i18n.common_term_unknown_value
            };
            $scope.clusters = $("#storeDiskDiv").scope().clusters;
            var window = $("#bindVmWindow").widget();
            var volumnId = window.option("volumnId");
            var values = [];
            for (var i = 0; $scope.clusters && i < $scope.clusters.length; i++) {
                var cluster = {
                    "selectId": $scope.clusters[i].clusterId,
                    "label": $scope.clusters[i].clusterName
                };
                if (i === 0) {
                    cluster.checked = true;
                }
                values.push(cluster);
            }

            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10,
                "cluster":values[0].selectId
            };
            //集群下拉框
            $scope.clusterSelector = {
                "label": $scope.i18n.virtual_term_cluster_label+":",
                "require": true,
                "id": "clusterSelector",
                "width": "150",
                "validate": "required:"+$scope.i18n.common_term_null_valid+";",
                "values": values,
                "change": function () {
                    searchInfo.cluster = $("#"+$scope.clusterSelector.id).widget().getSelectedId();
                    searchInfo.start = 0;
                    $scope.bindVmTable.curPage = {
                        "pageIndex": 1
                    };
                    getData();
                }
            };
            //虚拟机列表
            $scope.bindVmTable = {
                "id": "diskBindVmTable",
                "data": null,
                "caption": "",
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 30],
                "columnSorting": [],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmVisibleId);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IP_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
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
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hostName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getData();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.bindVmTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.bindVmTable.displayLength = pageInfo.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).attr("title",aData.id);
                    $('td:eq(3)', nRow).addTitle();

                    //单选框
                    var options = {
                        "id": "vmRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = 0;
                            while ($("#vmRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#vmRadio_" + index).widget().option("checked", false);
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
                "id": "bindVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $("#" + $scope.bindVmTable.id).widget().option("data");
                    var selectedVm;
                    var index = 0;
                    while ($("#vmRadio_" + index).widget()) {
                        var checked = $("#vmRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedVm = data[index].id;
                            break;
                        }
                        index++;
                    }
                    if (selectedVm) {
                        if(data[index].status !== "running" && data[index].status !== "stopped"){
                            var options = {
                                type: "error",
                                content: $scope.i18n.org_disk_mountVM_info_errorStatus_msg,
                                height: "150px",
                                width: "350px"
                            };
                            var msg = new Message(options);
                            msg.show();
                        }
                        else{
                            mountVolume(selectedVm);
                        }
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "bindVmCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getData() {
                var params = {
                    "detail": 2,
                    "offset": searchInfo.start,
                    "limit": searchInfo.limit,
                    clusterId: searchInfo.cluster
                };
                var deferred = camel.post({
                    "url": "/goku/rest/v1.5/irm/1/vms/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vms = data.vmInfoList;
                    if (vms) {
                        for (var i = 0; i < vms.length; i++) {
                            vms[i].statusStr = statuses[vms[i].status] || vms[i].status;
                            vms[i].ip = "";
                            if (vms[i].vmConfig && vms[i].vmConfig.nics) {
                                for (var j = 0; j < vms[i].vmConfig.nics.length; j++) {
                                    if (j === 0) {
                                        vms[i].ip = vms[i].ip + vms[i].vmConfig.nics[j].ip;
                                    }
                                    else {
                                        vms[i].ip = vms[i].ip + ";" + vms[i].vmConfig.nics[j].ip;
                                    }
                                }
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.bindVmTable.totalRecords = data.total;
                        $scope.bindVmTable.data = vms;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function mountVolume(vmId) {
                var params = {
                    "mount": {
                        vmID: vmId,
                        volumnID: volumnId
                    }
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/volumes/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    taskMessage();
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function taskMessage() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                $state.go("system.taskCenter");
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
            if (values.length > 0) {
                getData();
            }
        }];

    var bindVmModule = angular.module("resources.storeInfo.bindVm", ["ng"]);
    bindVmModule.service("camel", httpService);
    bindVmModule.controller("resources.storeInfo.bindVm.ctrl", bindVmCtrl);
    return bindVmModule;
});