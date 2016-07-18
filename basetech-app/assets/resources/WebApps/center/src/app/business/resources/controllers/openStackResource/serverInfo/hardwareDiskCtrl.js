/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService"
], function ($, angular, UnifyValid, Window, Message, bootstrap, exceptionService) {
    "use strict";

    var diskCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var exceptionSer = new exceptionService();
        var user = $("html").scope().user;
        $scope.vmName = $stateParams.name;
        $scope.vmId = $stateParams.vmId;
        var novaId = $stateParams.novaId;
        var region = $stateParams.region;
        var tenantId = $stateParams.tenantId;
        var tokenId;
        var projectId;

        //添加按钮
        $scope.diskAddButton = {
            "id": "diskAddButton",
            "text": $scope.i18n.common_term_mount_button,
            "click": function () {
                var newWindow = new Window({
                    "winId": "addDiskWindow",
                    "title": $scope.i18n.common_term_mount_button,
                    "novaId": novaId,
                    "projectId": projectId,
                    "tokenId": tokenId,
                    "region": region,
                    "tenantId": tenantId,
                    "serverId": $scope.vmId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/openStackResource/serverInfo/addDisk.html",
                    "height": 500,
                    "width": 800,
                    "maximizable":false,
                    "minimizable":false,
                    "close": function () {
                        getDisk();
                    }
                });
                newWindow.show();
            }
        };
        $scope.refresh = function () {
            getVm();
        };
        $scope.help = {
            show: false
        };
        //磁盘列表
        $scope.diskTable = {
            "id": "hardwareDiskTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "ID",
                    "mData":  function (data) {
                        return $.encoder.encodeForHTML(data.volumeId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.device_term_deviceID_label,
                    "mData":  function (data) {
                        return $.encoder.encodeForHTML(data.device);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();

                if(aData.volumeId === "SystemDisk"){
                    return;
                }
            }
        };
        function deleteDisk(volumeId) {
            var deferred = camel.delete({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/os-volume_attachments/{volumeId}",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId, volumeId: volumeId}
                },
                "params": null,
                "userId": user.id,
                "beforeSend": function (request) {
                    request.setRequestHeader("X-Auth-Token", tokenId);
                }
            });
            deferred.success(function (data) {
                getDisk();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getDisk() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/os-volume_attachments",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                var volumeAttachments = data && data.volumeAttachments || [];
                var volumes = [];
                if ($scope.image && $scope.image != {}) {
                    volumes.push({
                        volumeId: "SystemDisk",
                        device:"/dev/vda"
                    });
                }
                for(var i=0;i<volumeAttachments.length;i++){
                    volumes.push(volumeAttachments[i]);
                }
                $scope.$apply(function () {
                    $scope.diskTable.data = volumes;
                });
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getVm() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                    o: {novaId: novaId, projectId: projectId, serverId: $scope.vmId}
                },
                "params": null,
                "userId": user.id,
                "beforeSend": function (request) {
                    request.setRequestHeader("X-Auth-Token", tokenId);
                }
            });
            deferred.success(function (data) {
                var server = data.server;
                $scope.image = server.image;
                getDisk();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getToken() {
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
                getVm();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function deleteMessage(volumeId) {
            var options = {
                type: "confirm",
                content: $scope.i18n.vm_vm_unbondVMdisk_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            deleteDisk(volumeId);
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

        getToken();
    }];
    return diskCtrl;
});
