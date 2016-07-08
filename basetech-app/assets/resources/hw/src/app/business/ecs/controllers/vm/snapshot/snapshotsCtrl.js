define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'app/services/httpService',
    "app/services/exceptionService",
    'app/services/validatorService',
    'app/services/messageService',
    'app/business/ecs/services/vm/vmSnapshotService',
    'tiny-widgets/Window',
    'tiny-common/UnifyValid',
    'tiny-lib/underscore',
    'fixtures/ecsFixture'
], function ($, angular,sprintf, ngSanitize, keyIDI18n, http, exception, validator, messageService, vmSnapshotService, Window, UnifyValid, _) {
    "use strict";

    var snapshotsCtrl = ["$scope", "$compile", "camel", "exception", "$q", "$interval",
        function ($scope, $compile, camel, exception, $q, $interval) {
            var user = $("html").scope().user;
            var urlParams = $("html").scope().urlParams;
            var messageIns = new messageService();
            var vmSnapshotServiceIns = new vmSnapshotService(exception, $q, camel);
            var validatorIns = new validator();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            // 权限控制
            $scope.hasVmAdvanceOperateRight = _.contains(user.privilegeList, "615000"); // 休眠、修复、转为模板、加入域、快照管理

            var STATUS_MAP = {
                "creating": i18n.common_term_creating_value,
                "resuming": i18n.common_term_resuming_value,
                "ready": i18n.common_term_ready_value,
                "deleting": i18n.common_term_deleting_value,
                "in-use": i18n.common_term_onuse_value
            };

            //当前选中的快照节点  点击树节点/初进页面时默认选中当前位置对应的快照节点
            $scope.selectNode = null;
            //clickFound标志是否找到当前选中的节点(刷新时需要考虑节点被删等场景)
            var clickFound = false;

            var snapshotShareData = $("#ecsVmsSnapshotDetailWinId").widget().option("snapshotShareData") || {};
            $scope.vmId = snapshotShareData.vmId;
            $scope.cloudInfraId = snapshotShareData.cloudInfraId;
            $scope.vpcId = snapshotShareData.vpcId;

            //是否重新加载快照树
            $scope.reloadVmSnapshots = false;

            $scope.promise = undefined;

            /**
             * 清除定时器  加了保护,可以重复停
             */
            $scope.stop = function () {
                if (snapshotShareData.timerHandler) {
                    try {
                        $interval.cancel(snapshotShareData.timerHandler);
                    } catch (e) {
                        // do nothing
                    }
                }

                snapshotShareData.timerHandler = null;
            };
            $scope.help = {
                "helpKey": "drawer_vm_disk",
                "show": false,
                "i18n": urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.cancelBtn = {
                "id": "ecsStorageDiskAddDiskCancel",
                "text": i18n.common_term_shut_button,
                "click": function () {
                    $scope.stop();
                    $("#ecsVmsSnapshotDetailWinId").widget().destroy();
                }
            };

            /**
             * 初始化操作  加了保护,可以重复起
             */
            $scope.start = function () {
                if (!snapshotShareData.timerHandler) {
                    snapshotShareData.timerHandler = $interval(function () {
                        getVmSnapshots();
                    }, 20000);
                }
            };

            $scope.label = {
                "id": i18n.common_term_ID_label + ":",
                "name": i18n.common_term_name_label + ":",
                "memorySnapshot": i18n.vm_snap_view_para_mem_label + ":",
                "backupSnapshot": i18n.vm_snap_view_para_backup_label + ":",
                "status": i18n.common_term_status_label + ":",
                "createTime": i18n.common_term_createAt_label + ":",
                "description": i18n.common_term_desc_label + ":"
            };

            var createOrModifyShare = {
                "vmId": $scope.vmId,
                "vpcId": $scope.vpcId,
                "snapshotId": null,
                "isCreate": true, //创建还是修改
                "needRefresh": false
            };
            $scope.create = {
                "id": "ecsVmDetailSnapshotsCreate",
                "text": i18n.vm_term_createSnap_button,
                "click": function () {
                    createOrModifyShare.isCreate = true;
                    createOrModifyShare.vmId = $scope.vmId;
                    createOrModifyShare.cloudInfraId = $scope.cloudInfraId;
                    $scope.stop();
                    var options = {
                        "winId": "ecsVmsDetailCreateSnapshotWinId",
                        "createOrModifyShare": createOrModifyShare,
                        "title": i18n.vm_term_createSnap_button,
                        "width": "560px",
                        "height": "350px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/snapshot/createSnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                            if (!createOrModifyShare.needRefresh) {
                                $scope.start();
                                return;
                            }
                            getVmSnapshots();
                            $scope.start();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
            };

            $scope.restore = {
                "id": "ecsVmDetailSnapshotsRestore",
                "text": i18n.vm_term_resumVM_button,
                "click": function () {
                    if (!$scope.selectNode || !$scope.selectNode.id) {
                        return;
                    }
                    $scope.stop();
                    messageIns.confirmMsgBox({
                        "content": i18n.vm_vm_resumeBySnap_info_confirm_msg,
                        "callback": function () {
                            restoreSnapshot();
                        },
                        "cancel": function () {
                            $scope.start();
                        }
                    });
                }
            };

            $scope.modify = {
                "id": "ecsVmDetailSnapshotsModify",
                "text": i18n.common_term_modify_button,
                "click": function () {
                    $scope.stop();
                    createOrModifyShare.isCreate = false;
                    var options = {
                        "winId": "ecsVmsDetailCreateSnapshotWinId",
                        "createOrModifyShare": createOrModifyShare,
                        "title": i18n.vm_term_modifySnap_button,
                        "width": "560px",
                        "height": "350px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/snapshot/createSnapshot.html",
                        "buttons": null,
                        "close": function (event) {
                            if (!createOrModifyShare.needRefresh) {
                                $scope.start();
                                return;
                            }
                            getVmSnapshots();
                            $scope.start();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
            };

            $scope["delete"] = {
                "id": "ecsVmDetailSnapshotsDelete",
                "text": i18n.common_term_delete_button,
                "click": function () {
                    $scope.stop();
                    messageIns.confirmMsgBox({
                        "content": i18n.vm_snap_del_info_confirm_msg,
                        "callback": function () {
                            deleteSnapshot();
                        },
                        "cancel": function () {
                            $scope.start();
                        }
                    });
                }
            };

            $scope.refresh = {
                "id": "ecsVmDetailSnapshotsRefresh",
                "text": i18n.common_term_fresh_button,
                "click": function () {
                    getVmSnapshots($scope.detail.id);
                }
            };

            $scope.name = {
                "textBoxId": "ecsVmDetailSnapshotsNameBox",
                "modifying": false,
                "validate": "require:" + i18n.common_term_null_valid + ";maxSize(64):" + i18n.sprintf(i18n.common_term_length_valid, 1, 64) + ";" +
                    "regularCheck(" + validatorIns.snapshotName + "):" + i18n.common_term_composition7_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 64),
                "clickModify": function () {
                    $scope.name.modifying = true;
                    $scope.stop();

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailSnapshotsNameBox input").focus().val($scope.detail.name);
                    }, 50);
                },
                "blur": function () {
                    $scope.name.change();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        $scope.name.change();
                    }
                },
                "change": function () {
                    if (!UnifyValid.FormValid($("#" + $scope.name.textBoxId))) {
                        return;
                    }
                    var newName = $.trim($("#" + $scope.name.textBoxId).widget().getValue());
                    var defer = modifySnapshot({
                        "name": newName
                    });
                    defer.then(function () {
                        $scope.detail.name = newName;
                        $scope.name.modifying = false;
                        //刷新树
                        getVmSnapshots();
                        $scope.start();
                    });
                }
            };

            $scope.description = {
                "textBoxId": "ecsVmDetailSnapshotsDesBox",
                "modifying": false,
                "type": "multi",
                "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024),
                "clickModify": function () {
                    $scope.description.modifying = true;
                    $scope.stop();

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#ecsVmDetailSnapshotsDesBox textarea").focus().val($scope.detail.description);
                    }, 50);
                },
                "blur": function () {
                    $scope.description.change();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        $scope.description.change();
                    }
                },
                "change": function () {
                    if (!UnifyValid.FormValid($("#" + $scope.description.textBoxId))) {
                        return;
                    }
                    var newDescrip = $("#" + $scope.description.textBoxId).widget().getValue();
                    var defer = modifySnapshot({
                        "desc": newDescrip
                    });
                    defer.then(function () {
                        $scope.detail.description = newDescrip;
                        $scope.description.modifying = false;
                        $scope.start();
                    });
                }
            };

            //选中的快照详情
            $scope.detail = {};

            //快照树
            $scope.tree = {
                "id": "ecsVmDetailSnapshotsTree",
                "width": "300",
                "height": "600",
                "setting": {
                    view: {
                        showIcon: true,
                        selectedMulti: false //true时，按住ctrl可多选
                    },
                    data: {
                        simpleData: {
                            enable: false
                        },
                        key: {
                            children: "childSnapshots",
                            "icon": "icon",
                            "open": "open"
                        }
                    },
                    callback: {
                        onClick: function (event, id, node) {
                            if (!node || node.currentPos) {
                                return;
                            }
                            $scope.selectNode = node;
                            getSnapshotDetail(node.id);
                            clickReset();
                        }
                    }
                },
                "values": []
            };

            //单击树节点时,需要做一些复位的操作,以处理某些异常场景  恢复定时器
            function clickReset() {
                $scope.name.modifying = false;
                $scope.description.modifying = false;
                if (!snapshotShareData.timerHandler) {
                    $scope.start();
                }
            }

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.stop();
            });

            function getVmSnapshots() {
                var params = {
                    "vmId": $scope.vmId,
                    "user": user,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId
                };
                var defered = vmSnapshotServiceIns.getVmSnapshots(params);
                defered.then(function (data) {
                    //处理后台返回数据,适配前台的zTree的数据结构
                    var snapshots = data.snapshots;
                    if (!snapshots || (snapshots.length <= 0)) {
                        $scope.tree.values = [];
                        $scope.detail = {};
                        _.extend($scope.detail, generateAttrbutes($scope.detail));
                        return;
                    }
                    var current = data.current;
                    clickFound = false;
                    var selectNodeFound = findSelectNodeFromTree(snapshots, $scope.selectNode && $scope.selectNode.id);
                    //之前选中的节点已被删除
                    if (!selectNodeFound) {
                        $scope.selectNode = null;
                    }
                    processTreeData(snapshots, current);
                    $scope.tree.values = snapshots;
                    $scope.detail = $scope.selectNode || {};
                    _.extend($scope.detail, generateAttrbutes($scope.detail));
                    if ($scope.selectNode && $scope.selectNode.id) {
                        $scope.selectDefaultNode($scope.selectNode.id);
                        getSnapshotDetail($scope.selectNode.id);
                    }
                });
            }

            function generateAttrbutes(detail) {
                var isMemorySnap = "";
                if (!detail) {
                    isMemorySnap = "";
                } else {
                    if ((detail.includingMemorySnapshot === null) || (typeof detail.includingMemorySnapshot === 'undefined')) {
                        isMemorySnap = "";
                    } else {
                        isMemorySnap = (detail.includingMemorySnapshot ? i18n.common_term_yes_button : i18n.common_term_no_label);
                    }
                }

                return {
                    "isMemorySnapStr": isMemorySnap
                };
            }

            function findSelectNodeFromTree(snapshots, selectNodeId) {
                if (!selectNodeId || !snapshots || (snapshots.length <= 0)) {
                    return false;
                }
                for (var i = 0; i < snapshots.length; i++) {
                    if (snapshots[i].id === selectNodeId) {
                        return true;
                    }

                    if (snapshots[i].childSnapshots) {
                        if (processTreeData(snapshots[i].childSnapshots, selectNodeId)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            //处理树数据的图片等
            function processTreeData(snapshots, current) {
                if (!snapshots || (snapshots.length <= 0)) {
                    return;
                }
                for (var i = 0; i < snapshots.length; i++) {
                    if (!snapshots[i].currentPos) {
                        snapshots[i].icon = "../theme/default/images/gm/irm_rpool_vm_snapshot.png";
                    }
                    snapshots[i].open = true;
                    if (!snapshots[i].status) {
                        snapshots[i].statusStr = "";
                    } else {
                        snapshots[i].statusStr = STATUS_MAP[snapshots[i].status] || "";
                    }

                    //找到需要选中的节点
                    if (($scope.selectNode && (snapshots[i].id === $scope.selectNode.id)) || (!$scope.selectNode && current && (current.id === snapshots[i].id))) {
                        clickFound = true;
                        $scope.selectNode = snapshots[i];
                    }

                    //当前(最新)节点找到,添加虚拟节点
                    if (current && (current.id === snapshots[i].id)) {
                        var newCurrentPos = {
                            "id": "curPos" + (new Date()).getMilliseconds(),
                            "name": i18n.common_term_currentLocation_label,
                            "description": i18n.common_term_desc_label + "03",
                            "currentPos": true, //标志虚拟当前位置
                            size: 13,
                            childSnapshots: [],
                            "icon": "../theme/default/images/gm/irm_rpool_vm_snapshot_current.png"
                        };
                        if (!snapshots[i].childSnapshots || (snapshots[i].childSnapshots.length <= 0)) {
                            snapshots[i].childSnapshots = [];
                            snapshots[i].childSnapshots.push(newCurrentPos);
                        } else {
                            var newChilds = [newCurrentPos];
                            snapshots[i].childSnapshots = newChilds.concat(snapshots[i].childSnapshots);
                        }
                    }
                   // snapshots[i].name = "[" + snapshots[i].id + "]" + snapshots[i].name;
                    if (snapshots[i].childSnapshots) {
                        processTreeData(snapshots[i].childSnapshots, current);
                    }
                }
            }

            //查询指定节点详情
            function getSnapshotDetail(id) {
                if (!id) {
                    return;
                }
                var params = {
                    "user": user,
                    "vmId": $scope.vmId,
                    "snapshotId": id,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId
                };
                var deferred = vmSnapshotServiceIns.getVmSnapshotDetail(params);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.detail = data.snapshot;
                    _.extend($scope.detail, generateAttrbutes($scope.detail));
                    if ($scope.detail) {
                        if (!$scope.detail.status) {
                            $scope.detail.statusStr = "";
                        } else {
                            $scope.detail.statusStr = STATUS_MAP[$scope.detail.status] || "";
                        }
                    }
                });
            }

            //默认选中节点
            $scope.selectDefaultNode = function (selectId) {
                if (!selectId) {
                    return;
                }
                var treeObj = $("#ecsVmDetailSnapshotsTree").widget().getZTreeObj();
                var node = treeObj.getNodeByParam("id", selectId);
                treeObj.selectNode(node);
            };

            function restoreSnapshot() {
                var params = {
                    "user": user,
                    "vmId": $scope.vmId,
                    "snapshotId": $scope.selectNode.id,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId
                };
                var defered = vmSnapshotServiceIns.restoreSnapshot(params);
                defered.then(function (data) {
                    getVmSnapshots();
                    $scope.start();
                });
            }

            function modifySnapshot(configParams) {
                var retDefer = $q.defer();
                var params = {
                    "user": user,
                    "vmId": $scope.vmId,
                    "cloudInfraId": $scope.cloudInfraId,
                    "snapshotId": $scope.selectNode.id,
                    "vpcId": $scope.vpcId
                };
                if (configParams.name) {
                    params.name = configParams.name;
                }
                if (configParams.desc) {
                    params.desc = configParams.desc;
                }
                var deferred = vmSnapshotServiceIns.modifySnapshot(params);
                deferred.then(function (data) {
                    retDefer.resolve(data);
                });
                return retDefer.promise;
            }

            function deleteSnapshot() {
                var params = {
                    "user": user,
                    "vmId": $scope.vmId,
                    "snapshotId": $scope.selectNode.id,
                    "cloudInfraId": $scope.cloudInfraId,
                    "vpcId": $scope.vpcId
                };
                var defered = vmSnapshotServiceIns.deleteSnapshot(params);
                defered.then(function (data) {
                    getVmSnapshots();
                    $scope.start();
                });
            }

            getVmSnapshots();
            $scope.start();
        }
    ];

    var snapshotsModule = angular.module("ecs.vm.detail.snapshots", ['ng',"wcc", "ngSanitize"]);
    snapshotsModule.controller("ecs.vm.detail.snapshots.ctrl", snapshotsCtrl);
    snapshotsModule.service("camel", http);
    snapshotsModule.service("exception", exception);
    snapshotsModule.service("ecs.vm.detail.snapshots.validator", validator);

    return snapshotsModule;
});
