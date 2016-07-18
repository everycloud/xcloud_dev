/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-1-24

 */
define(['tiny-lib/angular',
    'app/services/commonService',
    'app/business/resources/services/device/adaptation/adaptationService',
    'app/services/messageService',
    'tiny-widgets/Window'
],
    function (angular, commonService, AdaptationService, MessageService, Window) {
        "use strict";
        var adaptationCtrl = ['$scope', '$compile', '$q', 'camel', function ($scope, $compile, $q, camel) {
            var adaptationService = new AdaptationService($q, camel);
            var messageService = new MessageService();

            var user = $("html").scope().user;
            var i18n = $scope.i18n;

            var statusConfig = adaptationService.getPackageStatus();
            var statusTextConfig = {};
            for (var p in statusConfig) {
                var item = statusConfig[p];
                statusTextConfig[item.val] = item.text;
            }
            $scope.hasDeviceOperateRight = user.privilege.role_role_add_option_deviceHandle_value;
            //安装适配包
            $scope.installAdptModel = {
                "id": "installAdptPkg",
                "text": i18n.device_term_installAdaptor_label || "安装适配包",
                "disable": false,
                "focused": false,
                "click": function () {
                    new Window({
                        "winId": "installAdptPkgWindow",
                        "title": i18n.device_term_installAdaptor_label || "安装适配包",
                        "minimizable": false,
                        "maximizable": false,
                        "content-type": "url",
                        "content": "../src/app/business/resources/views/device/adaptation/installAdptPkg/installAdptPkg.html",
                        "height": 450,
                        "width": 600,
                        "buttons": null,
                        "close": function () {
                            $scope.operator.adaptationList();
                        }
                    }).show();
                }
            };

            //适配包列表
            var adptPkgTableColumns = [
                {
                    "sTitle": i18n.common_term_name_label || "名称",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "35%",
                    "bSortable": false,
                    "sClass": "adaptator-name"
                },
                {
                    "sTitle": i18n.common_term_status_label || "状态",
                    "mData": function (data) {
                        var statusText = data.statusText || "";
                        return $.encoder.encodeForHTML(statusText);
                    },
                    "sWidth": "15%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_installDate_label || "安装日期",
                    "mData": function (data) {
                        var local = data.installDate && commonService.utc2Local(data.installDate);
                        return local;
                    },
                    "sWidth": "20%",
                    "bSortable": false
                },
                {
                    "sTitle": i18n.common_term_operation_label || "操作",
                    "sWidth": "10%",
                    "bSortable": false,
                    "sClass": "adaptator-operation"
                }
            ];

            $scope.adptPkgTable = {
                "id": "adptPkgTable",
                "data": [],
                "columns": adptPkgTableColumns,
                "enablePagination": false,
                "columnsDraggable": true,
                "renderRow": function (nRow, aData, iDataIndex) {
                    // 设备包名称加上跳转链接
                    var adaptationName = "<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>";
                    var adaptationNameLink = $compile(adaptationName);
                    var adaptationNameScope = $scope.$new();
                    adaptationNameScope.name = aData.name;
                    adaptationNameScope.detail = function () {
                        new Window({
                            "winId": "adaptationDetailWindow",
                            "title": adaptationNameScope.name,
                            "minimizable": false,
                            "maximizable": false,
                            "content-type": "url",
                            "params": aData,
                            "content": "../src/app/business/resources/views/device/adaptation/adaptationDetail.html",
                            "height": 500,
                            "width": 800,
                            "buttons": null
                        }).show();
                    }
                    var adaptationNameNode = adaptationNameLink(adaptationNameScope);
                    $(".adaptator-name", nRow).html(adaptationNameNode);

                    if ($scope.hasDeviceOperateRight) {
                        var conDeleteStatus = [statusConfig.PACKAGE_STATUS_INSTALL_SUCCESS.val, statusConfig.PACKAGE_STATUS_UNINSTALL_FAILED.val];
                        //状态都是个位数
                        var canDelete = conDeleteStatus.join().indexOf(aData.status) > -1;
                        var operateScope = $scope.$new(false);
                        var encodeName = $.encoder.encodeForHTML(aData.name);
                        var i18nUnstall = i18n.common_term_uninstall_button || "卸载";
                        var operateTemplates = "<span class=''>" + i18nUnstall + "</span>";
                        if (canDelete) {
                            operateTemplates = "<a href='javascript:void(0)' ng-click='delete()'>" + i18nUnstall + "</a>";
                            operateScope.delete = function () {
                                messageService.confirmMsgBox({
                                    content: i18n.sprintf(i18n.device_adap_delPacket_info_confirm_msg, encodeName) || ("确定要卸载 " + encodeName + " 吗？"),
                                    callback: function () {
                                        $scope.operator.uninstallPackage(aData.id, iDataIndex);
                                    }
                                });
                            }
                        }
                        var operateTmp = $compile($(operateTemplates));
                        $(".adaptator-operation", nRow).html(operateTmp(operateScope));
                    }
                }
            };

            var parseData = function (resolvedValue) {
                var list = resolvedValue && resolvedValue.packageList;
                if (list) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        list[i].statusText = statusTextConfig[list[i].status];
                    }
                }
                return list;
            };
            $scope.operator = {
                //查询获取表格数据
                adaptationList: function () {
                    var promise = adaptationService.adaptatorList(user.id);
                    promise.then(function (resolvedValue) {
                        $scope.adptPkgTable.data = parseData(resolvedValue);
                    });
                },
                uninstallPackage: function (id, iDataIndex) {
                    var promise = adaptationService.adaptatorOperator({
                        id: id,
                        userId: user.id
                    }, "delete");
                    promise.then(function (resolvedValue) {
                        var data = $.extend([], $scope.adptPkgTable.data);
                        data.splice(iDataIndex, 1);
                        $scope.adptPkgTable.data = data;
                    });
                }
            };

            $scope.operator.adaptationList();
        }];
        return adaptationCtrl;
    });


