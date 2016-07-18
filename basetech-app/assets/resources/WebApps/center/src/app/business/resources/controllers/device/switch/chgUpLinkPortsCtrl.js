define(['tiny-lib/angular',
    'tiny-widgets/Checkbox',
    'tiny-widgets/Message',
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Checkbox, Message, constants, ExceptionService, deviceFixture) {
        "use strict";
        var chgUpLinkPortsCtrl = ['$scope', function ($scope) {
                var name = $("#chgUpLinkPortsWin").widget().option("name");
                var camel = $("html").injector().get("camel");
                var $rootScope = $("html").injector().get("$rootScope");
                $scope.i18n = $("html").scope().i18n;
                var commonPortsTableColumns = [
                    {
                        "sTitle": "<div id='_commonColumns'></div>",
                        "mData": "",
                        "sWidth": "15%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_commonPort_label || "普通端口",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.linkPortId);
                        },
                        "sWidth": "75%",
                        "bSortable": false}
                ];
                $scope.commonPortsTable = {
                    "id": "commonPortsTable",
                    "data": [],
                    "columns": commonPortsTableColumns,
                    "enablePagination": false,
                    "lengthChange": false,
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "hideTotalRecords": true,
                    "columnsDraggable": true,
                    "callback": function (evtObj) {

                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var options = {
                            "id": "commonPorts" + aData.linkPortId.replace(/\//g, '_'),
                            "checked": false,
                            "change": function () {
                                if ($("#" + options.id).widget().option("checked")) {
                                    if ($scope.operate.isCommonPortsAllChecked()) {
                                        $("#commonPortsCheckbox").widget().option("checked", true);
                                    }
                                }
                                else {
                                    $("#commonPortsCheckbox").widget().option("checked", false);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', nRow).html(checkbox.getDom());
                    }
                };

                var uplinkPortsTableColumns = [
                    {
                        "sTitle": "<div id='_upColumns'></div>",
                        "mData": "",
                        "sWidth": "15%",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_uplinkPort_value,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.linkPortId);
                        },
                        "sWidth": "75%",
                        "bSortable": false}
                ];
                $scope.uplinkPortsTable = {
                    "id": "uplinkPortsTable",
                    "data": [],
                    "columns": uplinkPortsTableColumns,
                    "enablePagination": false,
                    "lengthChange": false,
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "hideTotalRecords": true,
                    "columnsDraggable": true,
                    "callback": function (evtObj) {
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var options = {
                            "id": "uplinkPorts" + aData.linkPortId.replace(/\//g, '_'),
                            "checked": false,
                            "change": function () {
                                if ($("#" + options.id).widget().option("checked")) {
                                    if ($scope.operate.isUplinkPortsAllChecked()) {
                                        $("#uplinkPortsCheckbox").widget().option("checked", true);
                                    }
                                }
                                else {
                                    $("#uplinkPortsCheckbox").widget().option("checked", false);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', nRow).html(checkbox.getDom());
                    }
                };
                $scope.saveBtn = {
                    "id": "saveBtn",
                    "text": $scope.i18n.common_term_save_label,
                    "click": function () {
                        var uplinkPorts = []
                        for (var index in $scope.uplinkPortsTable.data) {
                            uplinkPorts.push($scope.uplinkPortsTable.data[index].linkPortId);
                        }
                        var params = {
                            "switchName": name,
                            "uplinkPorts": uplinkPorts
                        }
                        $scope.operate.updateUplinkPorts(params);
                    }
                };
                $scope.cancelBtn = {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $("#chgUpLinkPortsWin").widget().destroy();
                    }
                };
                $scope.operate = {
                    queryPorts: function (params) {
                        var queryConfig = constants.rest.SWITCH_PORT_QUERY
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"switch_name": name}},
                            "type": queryConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var options = {
                                "id": "commonPortsCheckbox",
                                "checked": false,
                                "change": function () {
                                    var isChecked = $("#commonPortsCheckbox").widget().options.checked;
                                    $scope.operate.setCommonPorts(isChecked);
                                }
                            };
                            var checkbox = new Checkbox(options);
                            checkbox.rendTo($('#_commonColumns'));
                            var options = {
                                "id": "uplinkPortsCheckbox",
                                "checked": false,
                                "change": function () {
                                    var isChecked = $("#uplinkPortsCheckbox").widget().options.checked;
                                    $scope.operate.setUplinkPorts(isChecked)
                                }
                            };
                            var checkbox = new Checkbox(options);
                            checkbox.rendTo($('#_upColumns'));
                            var commonPorts = [];
                            var uplinkPorts = [];
                            var ports = response.switchPortList;
                            for (var index in ports) {
                                if (ports[index].linkPortId.indexOf('GigabitEthernet') != 0 && ports[index].linkPortId.indexOf('GE') < 0) {
                                    continue;
                                }
                                if (ports[index].uplinkPort) {
                                    uplinkPorts.push(ports[index]);
                                }
                                else {
                                    commonPorts.push(ports[index])
                                }
                            }
                            $scope.$apply(function () {
                                $scope.commonPortsTable.data = commonPorts;
                                $scope.uplinkPortsTable.data = uplinkPorts;
                            })

                        });
                    },
                    updateUplinkPorts: function (params) {
                        var updateConfig = constants.rest.UPLINK_PORTS_UPDATE
                        var deferred = camel.put({
                            "url": updateConfig.url,
                            "type": updateConfig.type,
                            "userId": $rootScope.user.id,
                            "params": JSON.stringify(params)
                        });
                        deferred.done(function (response) {
                                $("#chgUpLinkPortsWin").widget().destroy();
                                var warnMsg = new Message({
                                    "type": "prompt",
                                    "title": $scope.i18n.common_term_tip_label,
                                    "content": $scope.i18n.device_switch_modifyUplinkPort_info_succeed_msg,
                                    "height": "150px",
                                    "width": "350px",
                                    "buttons": [
                                        {
                                            label: 'OK',
                                            accessKey: '2',
                                            "key": "okBtn",
                                            majorBtn: true,
                                            default: true
                                        }
                                    ]
                                });
                                warnMsg.setButton("okBtn", function () {
                                    warnMsg.destroy();
                                });
                                warnMsg.show();
                         });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    setCommonPorts: function (param) {
                        for (var index in $scope.commonPortsTable.data) {
                            var id = "commonPorts" + $scope.commonPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            $("#" + id).widget().option("checked", param);
                        }
                    },
                    setUplinkPorts: function (param) {
                        for (var index in $scope.uplinkPortsTable.data) {
                            var id = "uplinkPorts" + $scope.uplinkPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            $("#" + id).widget().option("checked", param);
                        }
                    },
                    isCommonPortsAllChecked: function () {
                        for (var index in $scope.commonPortsTable.data) {
                            var id = "commonPorts" + $scope.commonPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            if (!$("#" + id).widget().option("checked")) {
                                return false;
                            }
                        }
                        return true;
                    },
                    isUplinkPortsAllChecked: function () {
                        for (var index in $scope.uplinkPortsTable.data) {
                            var id = "uplinkPorts" + $scope.uplinkPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            if (!$("#" + id).widget().option("checked")) {
                                return false;
                            }
                        }
                        return true;
                    },
                    moveRight: function () {
                        var moveData = [];
                        for (var index in $scope.commonPortsTable.data) {
                            var id = "commonPorts" + $scope.commonPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            if ($("#" + id).widget().option("checked")) {
                                moveData.push($scope.commonPortsTable.data[index]);
                            }
                        }
                        for (var index in moveData) {
                            $scope.uplinkPortsTable.data.push(moveData[index]);
                            $scope.commonPortsTable.data.splice(jQuery.inArray(moveData[index], $scope.commonPortsTable.data), 1);
                        }
                        $("#uplinkPortsTable").widget().option("data", $scope.uplinkPortsTable.data);
                        $("#commonPortsTable").widget().option("data", $scope.commonPortsTable.data);
                    },
                    moveLeft: function () {
                        var moveData = [];
                        for (var index in $scope.uplinkPortsTable.data) {
                            var id = "uplinkPorts" + $scope.uplinkPortsTable.data[index].linkPortId.replace(/\//g, '_');
                            if ($("#" + id).widget().option("checked")) {
                                moveData.push($scope.uplinkPortsTable.data[index]);
                            }
                        }
                        for (var index in moveData) {
                            $scope.commonPortsTable.data.push(moveData[index]);
                            $scope.uplinkPortsTable.data.splice(jQuery.inArray(moveData[index], $scope.uplinkPortsTable.data), 1);
                        }
                        $("#uplinkPortsTable").widget().option("data", $scope.uplinkPortsTable.data);
                        $("#commonPortsTable").widget().option("data", $scope.commonPortsTable.data);
                    }
            };
            $scope.operate.queryPorts();
        }];
        var dependency = ['ng', 'wcc'];
        var chgUpLinkPortsModule = angular.module("chgUpLinkPortsModule", dependency);
        chgUpLinkPortsModule.controller("chgUpLinkPortsCtrl", chgUpLinkPortsCtrl);
        return chgUpLinkPortsModule;
    });


