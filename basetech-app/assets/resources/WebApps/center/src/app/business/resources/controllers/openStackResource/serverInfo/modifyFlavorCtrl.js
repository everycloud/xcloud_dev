/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService",
    "app/services/messageService"
], function ($,angular, Radio, Message, httpService, exceptionService, messageService) {
    "use strict";
    var modifyFlavorCtrl = ["$scope", "camel",
        function ($scope, camel) {
            var exceptionSer = new exceptionService();
            var messageServiceIns = new messageService();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#modifyFlavorWindow").widget();
            var serverId = window.option("serverId");
            var novaId = window.option("novaId");
            var projectId = window.option("projectId");
            var tokenId = window.option("tokenId");
            var flavors = window.option("flavors") || [];
            var searchInfo = {
                "curPage": 1,
                "limit": 10
            };
            $scope.flavorTable = {
                "id": "migrateVmTable",
                "data": flavors,
                "totalRecords": flavors.length,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
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
                        "sTitle": $scope.i18n.common_term_vcpuNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vcpus);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_memoryMB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ram);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    cleanSelect();
                    searchInfo.curPage = evtObj.currentPage;
                    searchInfo.limit = evtObj.displayLength;
                },
                "changeSelect": function (pageInfo) {
                    cleanSelect();
                    searchInfo.curPage = pageInfo.currentPage;
                    searchInfo.limit = pageInfo.displayLength;
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id": "flavorRadio_" + iDataIndex,
                        "checked": false,
                        "change": function () {
                            var index = searchInfo.limit * (searchInfo.curPage - 1);
                            while ($("#flavorRadio_" + index).widget()) {
                                if (index != iDataIndex) {
                                    $("#flavorRadio_" + index).widget().option("checked", false);
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
                    var data = $scope.flavorTable.data;
                    var index = searchInfo.limit * (searchInfo.curPage - 1);
                    var selectedFlavor = null;
                    while ($("#flavorRadio_" + index).widget()) {
                        var checked = $("#flavorRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedFlavor = data[index].id;
                            break;
                        }
                        index++;
                    }
                    if (selectedFlavor) {
                        messageServiceIns.warnMsgBox({
                            "content": $scope.i18n.vm_vm_modifySpec_info_confirm_msg || "若虚拟机正在运行中，修改规格将关闭虚拟机。确实要修改虚拟机规格？",
                            "callback": function () {
                                modifyFlavor(selectedFlavor);
                            }
                        });
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

            function cleanSelect() {
                var index = searchInfo.limit * (searchInfo.curPage - 1);
                while ($("#flavorRadio_" + index).widget()) {
                    $("#flavorRadio_" + index).widget().option("checked", false);
                    index++;
                }
            }

            function modifyFlavor(flavorId) {
                var params = {
                    "resize": {
                        "flavorRef": flavorId,
                        "auto_disk_config": 1
                    }
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
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
        }];

    var modifyFlavorModule = angular.module("vdcMgr.serverInfo.modifyFlavor", ["ng"]);
    modifyFlavorModule.service("camel", httpService);
    modifyFlavorModule.controller("vdcMgr.serverInfo.modifyFlavor.ctrl", modifyFlavorCtrl);
    return modifyFlavorModule;
});