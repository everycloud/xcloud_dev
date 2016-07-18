/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-24
 */
define(["tiny-lib/jquery",
    'tiny-lib/angular',
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function ($, angular, Window, Message, constants, deviceConstants, ExceptionService) {
        "use strict";
        var fsCtrl = ['$scope', '$compile', '$state', 'camel', '$rootScope', function ($scope, $compile, $state, camel, $rootScope) {
            var user = $("html").scope().user;
            $scope.openstack = user.cloudType === "OPENSTACK";
            var hasOperateRight = $scope.right.hasFsOperateRight;
            //接入FusionStorage按钮
            $scope.addFsDeviceModel = {
                "id": "addFusionStorage",
                "text": $scope.i18n.device_term_connectFusionStorage_button || "接入FusionStorage",
                "focused": false,
                "click": function () {
                    var addSanDeviceWindow = new Window({
                        "winId": "addFusionStorageWindow",
                        "title": $scope.i18n.device_term_connectFusionStorage_button || "接入FusionStorage",
                        "content-type": "url",
                        "content": "../src/app/business/resources/views/device/fusionStorage/addFs/addFs.html",
                        "height": 450,
                        "width": 600,
                        "buttons": null,
                        "close": function (event) {
                            $scope.operate.queryFusionStorage();
                        }
                    }).show();
                }
            };

            //FusionStorage列表
            var accessTypeTitle = $scope.i18n.common_term_floatIP_label;
            if($scope.openstack){
                accessTypeTitle = accessTypeTitle + "/" + $scope.i18n.common_term_domainName_label;
            }
            var fsTableColumns = [
                {
                    "sTitle": $scope.i18n.common_term_name_label || "名称",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "sWidth": "14%",
                    "bSortable": false},
                {
                    "sTitle": accessTypeTitle,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.ip || data.domainName);
                    },
                    "sWidth": "18%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_port_label || "端口",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.port);
                    },
                    "sWidth": "10%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_userName_label || "用户名",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.userName);
                    },
                    "sWidth": "20%",
                    "bSortable": false},
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": "operation",
                    "sWidth": "14%",
                    "bSortable": false
                }
            ];

            $scope.fsTableModel = {
                "id": "fsTable",
                "data": [],
                "columns": fsTableColumns,
                "enablePagination": true,
                "paginationStyle": "simple",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "curPage": {"pageIndex": 1},
                "requestConfig": {
                    "enableRefresh": false,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "totalRecords": 0,
                "hideTotalRecords": false,
                "columnsDraggable": true,
                "columnsVisibility": {
                    "activate": "click",
                    "aiExclude": [0],
                    "bRestore": true,
                    "buttonText": "",
                    "fnStateChange": function (index, checked) {
                    }
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    var opt = "<div ng-if='hasOperateRight'><a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button +"</a>" + "</div>";
                    var optLink = $compile($(opt));
                    var optScope = $scope.$new(false);
                    optScope.id = aData.id;
                    optScope.name = aData.name;
                    optScope.hasOperateRight = hasOperateRight;
                    optScope.delete = function () {
                        var deleteMsg = new Message({
                            "type": "confirm",
                            "title": $scope.i18n.common_term_confirm_label,
                            "content": $scope.i18n.device_fs_del_info_confirm_msg || "确实要删除吗?",
                            "height": "150px",
                            "width": "350px",
                            "buttons": [{
                                label: $scope.i18n.common_term_ok_button,
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            }, {
                                label: $scope.i18n.common_term_cancle_button,
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }]
                        });
                        deleteMsg.setButton("okBtn", function () {
                            $scope.operate.delete(aData.id);
                            deleteMsg.destroy();
                        });
                        deleteMsg.setButton("cancelBtn", function () {
                            deleteMsg.destroy();
                        });
                        deleteMsg.show();
                    };
                    $("td:eq(4)", nRow).html(optLink(optScope));
                }
            };

            $scope.operate = {
                queryFusionStorage: function () {
                    var queryConfig = deviceConstants.rest.FUSIONSTORAGE_QUERY;
                    var deferred = camel.get({
                        "url": queryConfig.url,
                        "type": queryConfig.type,
                        "params": {},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        if (!response || !response.fsConnectorInfos) {
                            return;
                        }
                        var fsConnectorInfos = response.fsConnectorInfos;
                        $scope.$apply(function () {
                            $scope.fsTableModel.data = fsConnectorInfos;
                            $scope.fsTableModel.totalRecords = fsConnectorInfos.length;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "delete": function (id) {
                    var deferred = camel["delete"]({
                        "url": "/goku/rest/v1.5/irm/fusionstorage/" + id,
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            $scope.operate.queryFusionStorage();
                        });
                    });
                    deferred.fail(function (response) {
                        $scope.$apply(function () {
                            new ExceptionService().doException(response);
                        });
                    });
                }
            };

            $scope.operate.queryFusionStorage();
        }];
        return fsCtrl;
    });


