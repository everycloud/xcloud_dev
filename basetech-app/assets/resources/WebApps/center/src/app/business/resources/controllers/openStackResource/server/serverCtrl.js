/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Progressbar",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/competitionConfig",
    "fixtures/hypervisorFixture","fixtures/dataCenterFixture"
], function ($, angular, Checkbox, Progressbar, Window, Message, exceptionService, Competition) {
    "use strict";

    var vmCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var exceptionSer = new exceptionService();
        $scope.vmState = $state.$current.name;
        var user = $("html").scope().user;
        var tokenId;
        var projectId;
        var novaId;
        //从实例-》主机进入，有以下两个参数
        var hostId = $stateParams.hostId;
        $scope.underHost = !!hostId;
        var regionName = $stateParams.region;
        $scope.curState = $state.current.name;
        var powerStatus = {
            0: $scope.i18n.common_term_nullStatus_label || "NO STATE",
            1: $scope.i18n.common_term_running_value || "RUNNING",
            2: $scope.i18n.common_term_other_label || "BLOCKED",
            3: $scope.i18n.common_term_paused_value || "PAUSED",
            4: $scope.i18n.common_term_stoped_value || "SHUTDOWN",
            5: $scope.i18n.common_term_other_label || "SHUTOFF",
            6: $scope.i18n.common_term_crashed_value || "CRASHED",
            7: $scope.i18n.common_term_suspended_value || "Suspended",
            8: $scope.i18n.common_term_other_label || "FAILED",
            9: $scope.i18n.common_term_other_label || "BUILDING"
        };

        var statuses = {
            ACTIVE: $scope.i18n.common_term_running_value,
            SHUTOFF: $scope.i18n.common_term_stoped_value,
            SUSPENDED: $scope.i18n.common_term_hibernated_value,
            PAUSED: $scope.i18n.common_term_paused_value,
            REBOOT: $scope.i18n.common_term_restarting_value,
            HARD_REBOOT: $scope.i18n.common_term_forciblyRestarting_value,
            BUILD: $scope.i18n.common_term_creating_value,
            MIGRATING: $scope.i18n.common_term_migrating_value,
            VERIFY_RESIZE: $scope.i18n.vm_term_modifyWaitConfirm_value,
            ERROR: $scope.i18n.common_term_trouble_label,
            RESCUED: $scope.i18n.common_term_resumed_value,
            RESIZED: $scope.i18n.vm_term_modified_value,
            unknown:$scope.i18n.common_term_unknown_value
        };
        var taskStatus = {
            scheduling: $scope.i18n.vm_term_scheduling_value,
            block_device_mapping: $scope.i18n.vm_term_blockDeviceMapping_value,
            networking: $scope.i18n.vm_term_networking_value,
            spawning: $scope.i18n.vm_term_spawning_value,
            resize_prep: $scope.i18n.vm_term_modifyReady_value,
            resize_migrating: $scope.i18n.vm_term_modifyMigrate_value,
            resize_migrated: $scope.i18n.vm_term_modifyMigrateComplete_value,
            resize_finish: $scope.i18n.vm_term_modifyComplete_value,
            resize_confirming: $scope.i18n.vm_term_modifyConfirming_value,
            rebooting: $scope.i18n.common_term_restarting_value,
            rebooting_hard: $scope.i18n.common_term_forciblyRestarting_value,
            pausing: $scope.i18n.common_term_pauseing_value,
            unpausing: $scope.i18n.common_term_unpausing_value,
            suspending: $scope.i18n.common_term_hibernating_value,
            resuming: $scope.i18n.common_term_awaking_value,
            "powering-off": $scope.i18n.common_term_shuting_value,
            "powering-on": $scope.i18n.common_term_startuping_value,
            migrating: $scope.i18n.common_term_migrating_value,
            deleting: $scope.i18n.common_term_deleting_value
        };
        var subMenus = '<span class="dropdown" style="position: static">' +
            '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
            '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
        if (Competition.isBaseOnVmware) {
            subMenus += '<li  ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'RESCUED' && status != 'ERROR' || middleStatus" +
                '}"><a tabindex="2" ng-click="stop()">' + $scope.i18n.common_term_turnOff_button + '</a></li>';
        }
        else {
            subMenus += '<li  ng-class="{disabled: ' + "status != 'ACTIVE'  || middleStatus" +
                '}"><a tabindex="2" ng-click="softStop()">' + $scope.i18n.common_term_turnOff_button + '</a></li>' +
                '<li  ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'RESCUED' && status != 'ERROR'  || middleStatus" +
                '}"><a tabindex="2" ng-click="stop()">' + $scope.i18n.common_term_forciblyShut_button + '</a></li>';
        }
        if (Competition.isBaseOnVmware) {
            subMenus += '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'PAUSED'  || middleStatus" +
                '}"><a tabindex="3" ng-click="reboot()">' + $scope.i18n.common_term_restart_button + '</a></li>' +
                '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'PAUSED'  || middleStatus" +
                '}"><a tabindex="3" ng-click="forceReboot()">' + $scope.i18n.common_term_forciblyRestart_button + '</a></li>';
        }
        else {
            subMenus += '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'PAUSED' && status != 'SHUTOFF' && status != 'SUSPENDED' || middleStatus" +
                '}"><a tabindex="3" ng-click="reboot()">' + $scope.i18n.common_term_restart_button + '</a></li>' +
                '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'PAUSED' && status != 'SHUTOFF' && status != 'SUSPENDED' || middleStatus" +
                '}"><a tabindex="3" ng-click="forceReboot()">' + $scope.i18n.common_term_forciblyRestart_button + '</a></li>';
        }
        subMenus += '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'RESCUED' || middleStatus" +
            '}"><a tabindex="3" ng-click="suspend()">' + $scope.i18n.common_term_hibernate_button + '</a></li>' +
            '<li ng-class="{disabled: ' + "status != 'SUSPENDED' || middleStatus" +
            '}"><a tabindex="3" ng-click="resume()">' + $scope.i18n.common_term_awaken_button + '</a></li>';
        if (!Competition.isBaseOnVmware) {
            subMenus += '<li ng-class="{disabled: ' + "status != 'ACTIVE' && status != 'RESCUED' || middleStatus" +
                '}"><a tabindex="3" ng-click="pause()">' + $scope.i18n.common_term_pause_button + '</a></li>' +
                '<li ng-class="{disabled: ' + "status != 'PAUSED' || middleStatus" +
                '}"><a tabindex="3" ng-click="unpause()">' + $scope.i18n.common_term_unpause_button + '</a></li>';
        }
        subMenus += '<li class="divider-line"></li>';
        if (!Competition.isBaseOnVmware) {
            subMenus += '<li ng-class="{disabled: ' + "status != 'SHUTOFF' && status != 'ACTIVE' || middleStatus" +
                '}"><a tabindex="3" ng-click="migrate()">' + $scope.i18n.vm_term_migrateCold_button + '</a></li>';
        }
        if (!Competition.isBaseOnVmware) {
            subMenus += '<li ng-class="{disabled: ' + "status != 'ACTIVE' || middleStatus" +
                '}"><a tabindex="3" ng-click="liveMigrate()">' + $scope.i18n.vm_term_migrateLive_button + '</a></li>';
        }
        subMenus += '<li ng-class="{disabled: ' + "status != 'VERIFY_RESIZE' || middleStatus" +
            '}"><a tabindex="3" ng-click="confirmResize()">' + $scope.i18n.vm_term_confirmModify_button + '</a></li>';
        subMenus += '</ul>' +
            '</span>';

        $scope.help = {
            show: false
        };
        //查询信息
        var searchInfo = {
            "name": "",
            "status": null,
            "markers": [],
            "limit": 10
        };
        $scope.curPage = 1;
        $scope.hasPrePage = false;
        $scope.hasNextPage = false;
        //实例过滤框
        $scope.regionSelector = {
            "id": "searchRegionSelector",
            "width": "135",
            "values": [
            ],
            change: function () {
                novaId = $("#" + $scope.regionSelector.id).widget().getSelectedId();
                regionName = $("#" + $scope.regionSelector.id).widget().getSelectedLabel();
                searchInfo.markers = [];
                $scope.curPage = 1;
                $scope.hasPrePage = false;
                $scope.vmTable.data = [];
                getData();
            }
        };
        //状态过滤框
        $scope.statusSelector = {
            "id": "searchStatusSelector",
            "width": "135",
            "values": [
                {
                    "selectId": "all",
                    "label": $scope.i18n.common_term_allStatus_value,
                    "checked": true
                },
                {
                    "selectId": "ACTIVE",
                    "label": $scope.i18n.common_term_running_value
                },
                {
                    "selectId": "SHUTOFF",
                    "label": $scope.i18n.common_term_stoped_value
                },
                {
                    "selectId": "SUSPENDED",
                    "label": $scope.i18n.common_term_hibernated_value
                },
                {
                    "selectId": "PAUSED",
                    "label": $scope.i18n.common_term_pause_value
                },
                {
                    "selectId": "REBOOT",
                    "label": $scope.i18n.common_term_restarting_value
                },
                {
                    "selectId": "HARD_REBOOT",
                    "label": $scope.i18n.common_term_forciblyRestarting_value
                },
                {
                    "selectId": "MIGRATING",
                    "label": $scope.i18n.common_term_migrating_value
                },
                {
                    "selectId": "VERIFY_RESIZE",
                    "label": $scope.i18n.vm_term_modifyWaitConfirm_value
                },
                {
                    "selectId": "ERROR",
                    "label": $scope.i18n.common_term_trouble_label
                }
            ],
            "change": function () {
                var status = $("#" + $scope.statusSelector.id).widget().getSelectedId();
                searchInfo.status = status === "all" ? null : status;
                searchInfo.markers = [];
                $scope.curPage = 1;
                $scope.hasPrePage = false;
                getData();
            }
        };
        //模糊搜索框
        $scope.searchBox = {
            "id": "searchVmBox",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "search": function (searchString) {
                searchInfo.markers = [];
                $scope.hasPrePage = false;
                $scope.curPage = 1;
                getData();
            }
        };
        $scope.refresh = function () {
            getData();
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
            getData();
        };
        $scope.nextPage = function () {
            if (!$scope.hasNextPage) {
                return;
            }
            searchInfo.markers.push($scope.vmTable.data[searchInfo.limit - 1].id);
            $scope.hasPrePage = true;
            $scope.curPage++;
            getData();
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
                getData();
            }
        };
        //vm列表
        $scope.vmTable = {
            "id": "hypervisorVmTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false,
                    "sWidth": "8%"
                },
                {
                    "sTitle": $scope.i18n.resource_term_AZ_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data["OS-EXT-AZ:availability_zone"]);
                    },
                    "bSortable": false,
                    "sWidth": "9%"
                },
                {
                    "sTitle": $scope.i18n.common_term_host_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data["OS-EXT-SRV-ATTR:hypervisor_hostname"]);
                    },
                    "bSortable": false,
                    "sWidth": "9%"
                },
                {
                    "sTitle": "VPC ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.tenant_id);
                    },
                    "bSortable": false,
                    "sWidth": "9%"
                },
                {
                    "sTitle": $scope.i18n.common_term_status_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.statusStr);
                    },
                    "bSortable": false,
                    "sWidth": "10%"
                },
                {
                    "sTitle": $scope.i18n.task_term_taskStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.taskStatus);
                    },
                    "bSortable": false,
                    "sWidth": "9%"
                },
                {
                    "sTitle": $scope.i18n.common_term_powerStatus_label || "电源状态",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.powerStatus);
                    },
                    "bSortable": false,
                    "sWidth": "9%"
                },
                {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip);
                    },
                    "bSortable": false,
                    "sWidth": "10%"
                },
                {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.created);
                    },
                    "bSortable": false,
                    "sWidth": "10%"
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "10%"
                }
            ],
            "callback": function (pageInfo) {
            },
            "changeSelect": function (pageInfo) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();
                $('td:eq(7)', nRow).addTitle();
                $('td:eq(8)', nRow).addTitle();
                $('td:eq(9)', nRow).addTitle();

                //虚拟机详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>"));
                var scope = $scope.$new(false);
                scope.name = aData.name;
                scope.detail = function () {
                    $state.go("vdcMgr.serverInfo.summary", {
                        "vmName": scope.name, "region": regionName,
                        "novaId": novaId, "vmId": aData.id,
                        tenantId: aData.tenant_id
                    });
                };
                var node = link(scope);
                $("td:eq(0)", nRow).html(node);

                addOperatorDom(aData, nRow);
            }
        };

        //操作列结构
        function addOperatorDom(aData, nRow) {
            var optColumn = "";
            if (aData.status === "SHUTOFF" && !aData.middleStatus) {
                optColumn = '<div><a href="javascript:void(0)" ng-click="start()">' + $scope.i18n.common_term_startup_button +
                    '</a>&nbsp;&nbsp;&nbsp;&nbsp;' + subMenus + "</div>";
            }
            else {
                optColumn = '<div><a class="disabled" href="javascript:void(0)">' + $scope.i18n.common_term_startup_button +
                    '</a>&nbsp;&nbsp;&nbsp;&nbsp;' + subMenus + "</div>";
            }

            var optLink = $compile($(optColumn));
            var optScope = $scope.$new();
            optScope.status = aData.status;
            optScope.middleStatus = !!aData.taskStatus;

            optScope.start = function () {
                showMessage($scope.i18n.vm_vm_start_info_confirm_msg, function () {
                    lifeCycle(aData.id, "os-start", null);
                });
            };
            optScope.stop = function () {
                if (optScope.status !== 'ACTIVE' && optScope.status !== 'RESCUED' && optScope.status !== 'ERROR' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyShut_info_confirm_msg, function () {
                    lifeCycle(aData.id, "os-stop", null);
                });
            };
            optScope.softStop = function () {
                if (optScope.status !== 'ACTIVE' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_shut_info_confirm_msg, function () {
                    lifeCycle(aData.id, "os-soft-stop", null);
                });
            };
            optScope.vncLogin = function () {
                if (optScope.status !== 'ACTIVE' || optScope.middleStatus) {
                    return;
                }
                vncLogin(aData.id);
            };
            optScope.reboot = function () {
                if (!Competition.isBaseOnVmware && optScope.status !== 'ACTIVE' && optScope.status !== 'PAUSED' &&
                    optScope.status !== 'SHUTOFF' && optScope.status !== 'SUSPENDED' || optScope.middleStatus) {
                    return;
                }
                if (Competition.isBaseOnVmware && optScope.status !== 'ACTIVE' && optScope.status !== 'PAUSED') {
                    return;
                }
                showMessage($scope.i18n.common_term_restartConfirm_msg, function () {
                    lifeCycle(aData.id, "reboot", "SOFT");
                });
            };
            optScope.forceReboot = function () {
                if (!Competition.isBaseOnVmware && optScope.status !== 'ACTIVE' && optScope.status !== 'PAUSED' &&
                    optScope.status !== 'SHUTOFF' && optScope.status !== 'SUSPENDED' || optScope.middleStatus) {
                    return;
                }
                if (Competition.isBaseOnVmware && optScope.status !== 'ACTIVE' && optScope.status !== 'PAUSED') {
                    return;
                }
                showMessage($scope.i18n.vm_vm_forciblyRestart_info_confirm_msg, function () {
                    lifeCycle(aData.id, "reboot", "HARD");
                });
            };
            optScope.suspend = function () {
                if (optScope.status !== 'ACTIVE' && optScope.status !== 'RESCUED' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_hibernate_info_confirm_msg, function () {
                    lifeCycle(aData.id, "suspend", null);
                });
            };
            optScope.resume = function () {
                if (optScope.status !== 'SUSPENDED' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_wakup_info_confirm_msg, function () {
                    lifeCycle(aData.id, "resume", null);
                });
            };
            optScope.pause = function () {
                if (optScope.status !== 'ACTIVE' && optScope.status !== 'RESCUED' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_pause_info_confirm_msg, function () {
                    lifeCycle(aData.id, "pause", null);
                });
            };
            optScope.unpause = function () {
                if (optScope.status !== 'PAUSED' || optScope.middleStatus) {
                    return;
                }
                showMessage($scope.i18n.vm_vm_unpause_info_confirm_msg, function () {
                    lifeCycle(aData.id, "unpause", null);
                });
            };
            //区分从磁盘启动还是从镜像启动，从镜像启动的image是个对象，否则image为""
            optScope.startFromImage = !!aData.image;
            optScope.migrate = function () {
                if (optScope.status !== 'SHUTOFF' && optScope.status !== 'ACTIVE' || optScope.middleStatus) {
                    return;
                }
                var content = optScope.status === 'SHUTOFF' ? $scope.i18n.vm_vm_migrate_info_confirm_msg : $scope.i18n.vm_vm_migrateCold_info_confirm_msg;
                showMessage(content, function () {
                    lifeCycle(aData.id, "migrate", null);
                });
            };
            optScope.liveMigrate = function () {
                if (optScope.status !== 'ACTIVE' || optScope.middleStatus) {
                    return;
                }
                //从共享磁盘创建的虚拟机不迁移磁盘
                var blockMigration = (aData.image && aData.image !== "") ? true : false;
                migrateVm(aData.id, blockMigration, aData.hostId);
            };
            optScope.confirmResize = function () {
                if (optScope.status !== 'VERIFY_RESIZE' || optScope.middleStatus) {
                    return;
                }
                lifeCycle(aData.id, "confirmResize", null);
            };
            optScope.forceDelete = function () {
                showMessage($scope.i18n.vm_vm_del_info_confirm_msg, function () {
                    deleteServer(aData.id);
                });
            };
            var optNode = optLink(optScope);
            $("td:eq(10)", nRow).html(optNode);
            optNode.find('.dropdown').dropdown();
        }

        function showMessage(content, action) {
            var options = {
                type: "confirm",
                content: content,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            action();
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

        function vncLogin(serverId) {
            var params = {
                "os-getVNCConsole": {
                    "type": "novnc"
                }
            };
            var deferred = camel.post({
                "url": {
                    "s": "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                    o: {novaId: novaId, projectId: projectId, serverId: serverId}
                },
                "params": JSON.stringify(params),
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                window.open(data.console.url);
            });
            deferred.fail(function (response) {
                exceptionSer.doException(response);
            });
        }

        function migrateVm(serverId, blockMigration, hostId) {
            var newWindow = new Window({
                "winId": "migrateVmWindow",
                "title": $scope.i18n.vm_term_targetHost_label,
                "novaId": novaId,
                "projectId": projectId,
                "tokenId": tokenId,
                "serverId": serverId,
                "hostId": hostId,
                "blockMigration": blockMigration,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/openStackResource/server/migrateVm.html",
                "height": 500,
                "width": 800,
                "maximizable":false,
                "minimizable":false,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }

        function lifeCycle(serverId, action, type) {
            var params = {
            };
            params[action] = null;
            if (type) {
                params[action] = {
                    "type": type
                };
            }
            var deferred = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}/action",
                    o: {novaId: novaId, projectId: projectId, serverId: serverId}
                },
                "params": JSON.stringify(params),
                "userId": user.id,
                "beforeSend": function (request) {
                    request.setRequestHeader("X-Auth-Token", tokenId);
                }
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function deleteServer(serverId) {
            var deferred = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/{serverId}",
                    o: {novaId: novaId, projectId: projectId, serverId: serverId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getData() {
            var params = {
                limit: searchInfo.limit
            };
            if ($("#" + $scope.searchBox.id).widget()) {
                params.name = $("#" + $scope.searchBox.id).widget().getValue();
            }
            if (searchInfo.status) {
                params.status = searchInfo.status;
            }
            if (searchInfo.markers.length > 0) {
                params.marker = searchInfo.markers[searchInfo.markers.length - 1];
            }
            var url = "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/detail?all_tenants=1";
            if (hostId) {
                url = url + "&host={host}";
            }
            var deferred = camel.get({
                "url": {
                    s: url,
                    o: {novaId: novaId, projectId: projectId, host: hostId}
                },
                "params": params,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                var servers = data && data.servers || [];
                for (var i = 0; i < servers.length; i++) {
                    servers[i].statusStr = statuses[servers[i].status] || servers[i].status;
                    servers[i].taskStatus = taskStatus[servers[i]["OS-EXT-STS:task_state"]] || servers[i]["OS-EXT-STS:task_state"];
                    servers[i].powerStatus = powerStatus[servers[i]["OS-EXT-STS:power_state"]] || servers[i]["OS-EXT-STS:power_state"];
                    servers[i].ip = "";
                    var addresses = servers[i].addresses || {};
                    for (var j in addresses) {
                        var base = addresses[j] || [];
                        for (var k = 0; k < base.length; k++) {
                            if (servers[i].ip === "") {
                                servers[i].ip = base[k].addr;
                            }
                            else {
                                servers[i].ip = servers[i].ip + ";" + base[k].addr;
                            }
                        }
                    }
                }
                $scope.$apply(function () {
                    $scope.vmTable.data = servers;
                    if (servers.length < searchInfo.limit) {
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
                    getData();
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
                    getData();
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
                    if (endPoint[i].serviceName === "nova") {
                        //虚拟机在主机下，则region是确定的
                        if (endPoint[i].regionName === regionName) {
                            novaId = endPoint[i].id;
                        }
                        regionMap[endPoint[i].regionName] = true;
                        var region = {
                            selectId: endPoint[i].id,
                            label: endPoint[i].regionName
                        };
                        regions.push(region);
                    }
                }
                //主机下的虚拟机
                if (hostId) {
                    getToken(true);
                }
                else if (regions.length > 0) {
                    regions[0].checked = true;
                    $("#" + $scope.regionSelector.id).widget().option("values", regions);
                    novaId = regions[0].selectId;
                    regionName = regions[0].label;
                    getToken(true);
                }
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        //先请求一次token，让后台将可能已经失效是token替换掉
        getToken(false);
        getRegion();
    }];

    return vmCtrl;
});