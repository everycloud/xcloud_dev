/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-21

 */
define(['tiny-lib/angular',
    'tiny-widgets/Message',
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Message, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var switchDetailCtrl = ['$scope', '$compile', '$state', '$stateParams', '$rootScope', 'camel', function ($scope, $compile, $state, $stateParams, $rootScope, camel) {
            $scope.id = $stateParams.id;
            $scope.name = $stateParams.name;
            $scope.switchInfo = {};
            $scope.switchPortInfo = {};
            $scope.alarmInfo = {"critical": 0, "major": 0, "minor": 0, "warning": 0};
            $scope.hasPort = false;
            $scope.isLocal = $scope.deployMode === "local";
            $scope.searchModel = {
                "start": 0,
                "limit": 10
            }
            //返回按钮
            $scope.return = {
                "id": "return",
                "text": $scope.i18n.common_term_return_button,
                "disable": false,
                "click": function () {
                    $state.go("resources.device.switch");
                }
            };

            //基本信息
            $scope.basicInfo = {
                name: {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "value": $scope.name
                },
                status: {
                    "label": $scope.i18n.common_term_status_label + ":",
                    "value": ""
                },
                type: {
                    "label": $scope.i18n.common_term_type_label + ":",
                    "value": ""
                },
                mgnIp: {
                    "label": $scope.i18n.common_term_managerIP_label + ":",
                    "value": ""
                },
                product: {
                    "label": $scope.i18n.device_term_model_label + ":",
                    "value": ""
                },
                description:{
                    "label":$scope.i18n.common_term_desc_label + ":",
                    "value":""
                }

            };

            //端口连接状态列表
            var switchPortColumns = [
                {
                    "sTitle": $scope.i18n.common_term_port_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.linkPortId);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_portType_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicType);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_portStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicStatus);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_outTotal_label + "(KB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicByteOut);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_inTotal_label + "(KB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicByteIn);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_fluxTotal_label + "(KB)",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicFluxTotol);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_sendPacketTotal_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicPkgSend);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.perform_term_receivePacketTotal_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.nicPkgRcv);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_sendSpeedRate_label + "(KB/s)",
                    "mData": function (data) {
                        var outbondSpeed = $.encoder.encodeForHTML(data.outbondSpeed);
                        return outbondSpeed < 0 ? "-" : outbondSpeed;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_receiveSpeedRate_label + "(KB/s)",
                    "mData": function (data) {
                        var inbondSpeed = $.encoder.encodeForHTML(data.inbondSpeed);
                        return inbondSpeed < 0 ? "-" : inbondSpeed;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_sendLosePacketRate_label + "(%)",
                    "mData": function (data) {
                        var outDiscardRate = $.encoder.encodeForHTML(data.outDiscardRate);
                        return outDiscardRate < 0 ? "-" : outDiscardRate;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_sendErrorRate_label + "(%)",
                    "mData": function (data) {
                        var outErrorRate = $.encoder.encodeForHTML(data.outErrorRate);
                        return outErrorRate < 0 ? "-" : outErrorRate;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_receiveLosePacketRate_label + "(%)",
                    "mData": function (data) {
                        var inDiscardRate = $.encoder.encodeForHTML(data.inDiscardRate);
                        return inDiscardRate < 0 ? "-" : inDiscardRate;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_receiveErrorRate_label + "(%)",
                    "mData": function (data) {
                        var inErrorRate = $.encoder.encodeForHTML(data.inErrorRate);
                        return inErrorRate < 0 ? "-" : inErrorRate;
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_uplinkPort_value,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.uplinkPortStr);
                    },
                    "bSortable": false
                }
            ];

            //服务器列表
            $scope.switchPortTable = {
                "id": "hostTable",
                "data": [],
                "columns": switchPortColumns,
                "enablePagination": true,
                "paginationStyle": "full-numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "curPage": {"pageIndex": 1},
                "requestConfig": {
                    "enableRefresh": true,
                    "refreshInterval": 60000,
                    "httpMethod": "GET",
                    "url": "",
                    "data": "",
                    "sAjaxDataProp": "mData"
                },
                "totalRecords": 0,
                "hideTotalRecords": false,
                "columnsDraggable": true,
                "columnVisibility": {"activate": "click",
                    "aiExclude": [0],
                    "fnStateChange": function () {
                    }
                },
                "columnSorting": [],
                "show-details": true,
                "callback": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.switchPortTable.data = $scope.switchPortInfo.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                "changeSelect": function (evtObj) {
                    $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    $scope.searchModel.limit = $scope.searchModel.start + evtObj.displayLength;
                    $scope.$apply(function () {
                        $scope.switchPortTable.data = $scope.switchPortInfo.slice($scope.searchModel.start, $scope.searchModel.limit);
                    });
                },
                "renderRow": function (nRow, aData, iDataIndex) {

                }
            };

            $scope.operate = {
                "init": function () {
                    var queryConfig = deviceConstants.rest.SWITCH_DETAIL_QUERY;
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"id": $scope.name}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.switchInfo = response;
                            $scope.switchInfo.statusStr = $scope.i18n[deviceConstants.config.SWITCH_STATUS[response.status]] || response.status;
                            $scope.switchInfo.typeStr = $scope.i18n[deviceConstants.config.SWITCH_TYPE[response.type]] || response.type;
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "getPort": function () {
                    var queryConfig = deviceConstants.rest.SWITCH_PORT_QUERY
                    var deferred = camel.get({
                        "url": {s: queryConfig.url, o: {"switch_name": $scope.name}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var switchPortList = response.switchPortList;
                        if (switchPortList.length > 0) {
                            for (var index in switchPortList) {
                                switchPortList[index].uplinkPortStr = $scope.i18n[switchPortList[index].uplinkPort ? "common_term_yes_button" : "common_term_no_label"];
                            }
                            $scope.$apply(function () {
                                $scope.hasPort = true;
                                $scope.switchPortInfo = switchPortList;
                                $scope.switchPortTable.data = $scope.switchPortInfo.slice($scope.searchModel.start, $scope.searchModel.limit);
                                $scope.switchPortTable.totalRecords = switchPortList.length;
                            });
                        }

                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                "goToAlarm": function (level) {
                    $state.go("monitor.alarmlist", {"severity": level, "resourceid": $scope.id, moc: "switch", "alarmtype": 1});
                },
                "getAlarm": function () {
                    var params = {"conditionList": [
                        {"staticType": ["critical", "major", "minor", "warning"],
                            "staticCond": {"moc": "switch", "objectId": $scope.id}}
                    ]};
                    var queryConfig = deviceConstants.rest.ALARM_QUERY;
                    if($scope.isLocal)
                    {
                        queryConfig.url = "/goku/rest/v1.5/fault/{tenant_id}/alarms/statistic"
                    }
                    var deferred = camel.post({
                        "url": {s: queryConfig.url, o: {"tenant_id": "1"}},
                        "type": queryConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.alarmInfo.critical = response.value[0].staticType['critical'];
                            $scope.alarmInfo.major = response.value[0].staticType['major'];
                            $scope.alarmInfo.minor = response.value[0].staticType['minor'];
                            $scope.alarmInfo.warning = response.value[0].staticType['warning'];
                        });
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            //初始化数据
            $scope.operate.init();
            $scope.operate.getAlarm();
            $scope.operate.getPort();
        }];
        return switchDetailCtrl;
    }
)
;

