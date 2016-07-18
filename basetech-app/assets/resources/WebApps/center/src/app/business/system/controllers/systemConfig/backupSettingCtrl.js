/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-27
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/exceptionService",
    "app/services/commonService",
    "app/business/system/services/backupSettingService",
    "tiny-widgets/Window",
    "tiny-directives/FormField",
    "tiny-widgets/Button",
    "tiny-widgets/Table",
    "fixtures/systemFixture"],

    function ($, angular, ExceptionService, commonService, BackupSettingService, Window) {
        "use strict";
        var backupSettingCtrl = ["$scope", "$rootScope", "$q", "camel", function ($scope, $rootScope, $q, camel) {
            var exceptionService = new ExceptionService();
            var backupSettingService = new BackupSettingService(exceptionService, $q, camel);
            var user = $rootScope.user;
            var userId = user.id;
            var i18n = $scope.i18n || {};
            $scope.hasBackUpOperateRight = user.privilege.role_role_add_option_backupSetHandle_value;

            var STATUS = {
                "NOTBACKUP": i18n.common_term_noBackup_value || "未备份",
                "BACKUPING": i18n.common_term_backuping_value || "备份中",
                "BACKUPFAILED": i18n.sys_term_backupFail_label || "备份失败",
                "BACKUPSUCCESS": i18n.sys_term_backupSucceed_label || "备份成功"
            };
            var CONNECT_STATUS = {
                "connected": i18n.common_term_linkSucceed_value || "连接成功",
                "connecting": i18n.common_term_linking_value || "连接中",
                "disconnected": i18n.common_term_noLink_value || "未连接",
                "connected_failed": i18n.common_term_linkFail_value || "连接失败"
            };

            var BACKUPING = "BACKUPING";

            $scope.hasFTPServer = false;

            var ftpWindowWidth = 480;
            var ftpWindowOptions = {
                "winId": "configFTPServerId",
                "title": i18n.sys_term_setFTP_button || "配置FTP服务器",
                "minimizable": false,
                "maximizable": false,
                "content-type": "url",
                "content": "app/business/system/views/systemConfig/configServer.html",
                "buttons": null,
                "width": ftpWindowWidth,
                "height": ftpWindowWidth * 3 / 4,
                "close": function () {
                    $scope.operator.refreshFtp();
                }
            };

            $scope.configFTPServer = function () {
                new Window(ftpWindowOptions).show();
            };

            $scope.FTPServer = {
                ipLabel: (i18n.common_term_ftpSeverIP_label || "FTP服务器地址") + ":",
                ip: "",
                userLabel: (i18n.common_term_userName_label || "用户名") + ":",
                user: ""
            };

            $scope.backupBtn = {
                id: "backupBtnId",
                text: i18n.sys_term_backup_label || "备份",
                click: function () {
                    $scope.backupBtn.disable = true;
                    $scope.operator.backupComponents();
                }
            };

            //表格组件配置信息
            $scope.componentTable = {
                "id": "componentTableId",
                "data": [],
                "columns": [
                    {
                        "sTitle": i18n.common_term_assemblyName_label || "部件名称",
                        "mData": function (data) {
                            data.name = data.name || "";
                            return $.encoder.encodeForHTML("" + data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_assemblyType_label || "部件类型",
                        "mData": function (data) {
                            data.type = data.type || "";
                            return $.encoder.encodeForHTML("" + data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.sys_term_backupStatus_label || "备份状态",
                        "mData": function (data) {
                            data.statusText = data.statusText || "";
                            return $.encoder.encodeForHTML("" + data.statusText);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_startTime_label || "开始时间",
                        "mData": function (data) {
                            data.startTimeText = data.startTimeText || "";
                            return $.encoder.encodeForHTML("" + data.startTimeText);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_endTime_label || "结束时间",
                        "mData": function (data) {
                            data.endTimeText = data.endTimeText || "";
                            return $.encoder.encodeForHTML("" + data.endTimeText);
                        },
                        "bSortable": false
                    }
                ]
            };

            var checkBuckupable = function () {
                var list = $scope.componentTable.data;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].status === BACKUPING) {
                        return false;
                    }
                }
                return !!(list && list.length);
            };
            var getStatusText = function (status) {
                return status ? STATUS[status] : "";
            };
            var parseItem = function (item) {
                item.statusText = getStatusText(item.status);
                item.startTime && (item.startTimeText = commonService.utc2Local(item.startTime));
                item.endTime && (item.endTimeText = commonService.utc2Local(item.endTime));
                return item;
            };
            var updateTableItemData = function (index, resolvedValue) {
                resolvedValue = parseItem(resolvedValue);
                //触发数据绑定
                var list = $.extend([], $scope.componentTable.data || []);
                list[index] = resolvedValue;
                $scope.componentTable.data = list;
            };
            var parseTableData = function (list) {
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i] = parseItem(list[i]);
                }
                $scope.componentTable.data = list;
                $scope.backupBtn.disable = !checkBuckupable();
            };

            var vServerConfig = {
                "HYPER_DP": "HyperDP",
                "COMM_VAULT": "CommVault"
            };

            var commonWinWidth = 440;
            var commonWinConfig = {
                "winId": "backupWin",
                "minimizable": false,
                "maximizable": false,
                "content-type": "url",
                "content": "app/business/system/views/systemConfig/configBackup.html",
                "buttons": null,
                "width": commonWinWidth,
                "height": commonWinWidth * 3 / 4
            };
            var huaweiBackupWinConfig = $.extend({}, commonWinConfig, {
                "vServerType": vServerConfig.HYPER_DP,
                //配置华为技术有限公司备份系统
                "title": i18n.sys_term_setHWbackup_button || "配置华为技术有限公司备份系统",
                "close": function () {
                    $scope.operator.getBackupVmConfig(vServerConfig.HYPER_DP);
                }
            });
            var CommVaultBackupWinConfig = $.extend({}, commonWinConfig, {
                "vServerType": vServerConfig.COMM_VAULT,
                //配置CommVault备份系统
                "title": i18n.sys_term_setCommVault_button || "配置CommVault备份系统",
                "close": function () {
                    $scope.operator.getBackupVmConfig(vServerConfig.COMM_VAULT);
                }
            });

            $scope.operator = {
                getFTP: function (isGetComponents) {
                    var promise = backupSettingService.getFTP(userId);
                    promise.then(function (resolvedValue) {
                        var ftpInfo = resolvedValue && resolvedValue.ftpInfo;
                        if (!ftpInfo || !ftpInfo.ip) {
                            $scope.hasFTPServer = false;
                        } else {
                            //更新页面显示
                            $scope.hasFTPServer = true;
                            $scope.FTPServer.ip = ftpInfo.ip;
                            $scope.FTPServer.user = ftpInfo.userName;
                            //更新到修改ftp server window
                            ftpWindowOptions.params = ftpInfo;

                            isGetComponents && $scope.operator.getComponents();
                        }
                    });
                },
                getComponents: function () {
                    var promise = backupSettingService.getComponents(userId);
                    promise.then(function (resolvedValue) {
                        if (resolvedValue) {
                            var components = resolvedValue.componentInfoList;
                            parseTableData(components);

                            for (var i = 0, len = components.length; i < len; i++) {
                                (function (index) {
                                    var id = components[index].id;
                                    $scope.operator.getComponentDetail(index, id);
                                })(i);
                            }
                        }
                    });
                },
                getComponentDetail: function (index, id) {
                    var promise = backupSettingService.getComponentDetail(userId, id);
                    promise.then(function (resolvedValue) {
                        var componentInfo = resolvedValue && resolvedValue.componentInfo;
                        if (componentInfo) {
                            updateTableItemData(index, componentInfo);
                            if (componentInfo.status === BACKUPING) {
                                $scope.operator.getComponentDetail(index, id);
                            } else {
                                $scope.backupBtn.disable = !checkBuckupable();
                            }
                        }
                    });
                },
                backupComponents: function () {
                    var components = $scope.componentTable.data;
                    for (var i = 0, len = components.length; i < len; i++) {
                        (function (index) {
                            var component = components[index];
                            var componentId = component.id;
                            var promise = backupSettingService.backupComponents(userId, componentId);
                            promise.then(function (resolvedValue) {
                                if (resolvedValue) {
                                    $scope.operator.getComponentDetail(index, componentId);
                                }
                            });
                            component.status = BACKUPING;
                            updateTableItemData(index, component);
                        })(i);
                    }
                },
                refreshFtp: function () {
                    $scope.operator.getFTP();
                    $scope.operator.getComponents();
                },
                refreshVServer: function () {
                    $scope.operator.getBackupVmConfig(vServerConfig.HYPER_DP);
                    $scope.operator.getBackupVmConfig(vServerConfig.COMM_VAULT);
                },
                getBackupVmConfig: function (type) {
                    var promise = backupSettingService.vmOperator({
                        userId: userId,
                        orgId: 1,
                        params: {
                            type: type
                        }
                    });
                    promise.then(function (resolvedValue) {
                        resolvedValue = resolvedValue || {};
                        var status = resolvedValue.status || "";
                        resolvedValue.statusText = CONNECT_STATUS[status] || status;
                        if (type === "HyperDP") {
                            huaweiBackupWinConfig.params = resolvedValue;
                            $scope.huaweiBackupConfig = resolvedValue;
                            if (resolvedValue.serverAddress && resolvedValue.status == "connected") {
                                $scope.toHuaweiBackupSystem = i18n.sprintf(i18n.sys_backup_enterHW_label, "<a href='https://" + resolvedValue.serverAddress + ":8088' target='_blank'>", "</a>");
                            } else {
                                $scope.toHuaweiBackupSystem = i18n.sprintf(i18n.sys_backup_enterHW_label, "<span>", "</span>");
                            }
                        } else {
                            CommVaultBackupWinConfig.params = resolvedValue;
                            $scope.CommVaultConfig = resolvedValue;
                        }
                    });
                }
            };
            var isGetComponents = true;
            $scope.operator.getFTP(isGetComponents);

            $scope.virtualBackupServer = {
                support: user.cloudType === "FUSIONSPHERE" && $scope.deployMode !== "top",
                huaweiBackup: function () {
                    new Window(huaweiBackupWinConfig).show();
                },
                CommVaultBackup: function () {
                    new Window(CommVaultBackupWinConfig).show();
                }
            };
            if ($scope.virtualBackupServer.support) {
                $scope.operator.getBackupVmConfig(vServerConfig.HYPER_DP);
                $scope.operator.getBackupVmConfig(vServerConfig.COMM_VAULT);
            }
        }];
        return backupSettingCtrl;
    });