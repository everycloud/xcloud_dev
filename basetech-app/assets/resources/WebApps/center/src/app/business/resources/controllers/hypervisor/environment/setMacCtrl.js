/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/services/httpService"], function ($,angular, Window, Message, Exception, httpService) {
    "use strict";
    var setMacCtrl = ["$scope", "$compile", "camel","$sce",
        function ($scope, $compile, camel,$sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.virtual_hyper_addMAC_desc_label = $sce.trustAsHtml($scope.i18n.virtual_hyper_addMAC_desc_label);
            var window = $("#setMacWindow").widget();
            var eid = window.option("eid");
            //添加MAC片段按钮
            $scope.addMacSegmentButton = {
                "id": "addMacSegmentButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addMacSegmentWindow",
                        "action": "add",
                        "eid": eid,
                        "macSegments": $scope.macSegmentTable.data,
                        "title": $scope.i18n.virtual_term_addMACsegment_button,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/environment/addMacSegment.html",
                        "height": 230,
                        "width": 780,
                        "close": function () {
                            getMacSegment();
                        }
                    });
                    newWindow.show();
                }
            };
            //mac片段列表
            $scope.macSegmentTable = {
                "id": "environment_macSegment_table",
                "data": [],
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_initiativeMAC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.begin);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_endMAC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.end);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.begin);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button+"</a>&nbsp" +
                        "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.edit = function () {
                        var newWindow = new Window({
                            "winId": "addMacSegmentWindow",
                            "eid": eid,
                            "index": iDataIndex,
                            "macSegments": $scope.macSegmentTable.data,
                            "action": "edit",
                            "title": $scope.i18n.virtual_term_modifyMACsegment_button,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/environment/addMacSegment.html",
                            "height": 230,
                            "width": 780,
                            "close": function () {
                                getMacSegment();
                            }
                        });
                        newWindow.show();
                    };
                    optScope.delete = function () {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.virtual_hyper_delMACsegment_info_confirm_msg,
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    majorBtn : true,
                                    handler: function (event) {
                                        $scope.macSegmentTable.data.splice(iDataIndex, 1);
                                        deleteMacSegment();
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
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(2)", nRow).html(optNode);
                }
            };
            function getMacSegment() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macSegment", o: {id: eid}},
                    "params": null,
                    "userId": user.id
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        $scope.macSegmentTable.data = response.macSegments;
                    });
                });
                deferred.fail(function (response) {
                    exceptionService.doException(response);
                });
            }
            function deleteMacSegment() {
                var params = {
                    "macSegments": $scope.macSegmentTable.data
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macSegment", o: {id: eid}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.done(function (response) {
                    getMacSegment();
                });
                deferred.fail(function (response) {
                    exceptionService.doException(response);
                });
            }
            getMacSegment();
            //添加MAC片段按钮
            $scope.addSingleMacButton = {
                "id": "addSingleMacButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addSingleMacWindow",
                        "eid": eid,
                        "action": "add",
                        "title": $scope.i18n.virtual_term_addMAC_button,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/hypervisor/environment/addSingleMac.html",
                        "height": 250,
                        "width": 750,
                        "close": function () {
                            getMac();
                        }
                    });
                    newWindow.show();
                }
            };
            $scope.singleMacTable = {
                "id": "environment_singleMac_table",
                "data": [],
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle":  $scope.i18n.common_term_MAC_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mac);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button+"</a>&nbsp" +
                        "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.edit = function () {
                        var newWindow = new Window({
                            "winId": "addSingleMacWindow",
                            "title": $scope.i18n.virtual_term_modifyMAC_button,
                            "eid": eid,
                            "action": "edit",
                            "oldMac": aData,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/resources/views/hypervisor/environment/addSingleMac.html",
                            "height": 250,
                            "width": 750,
                            "close": function () {
                                getMac();
                            }
                        });
                        newWindow.show();
                    };
                    optScope.delete = function () {
                        var options = {
                            type: "confirm",
                            content: $scope.i18n.virtual_hyper_delMAC_info_confirm_msg,
                            height: "150px",
                            width: "350px",
                            "buttons": [
                                {
                                    label: $scope.i18n.common_term_ok_button,
                                    default: true,
                                    handler: function (event) {
                                        deleteMac(aData.id);
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
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(3)", nRow).html(optNode);
                }
            };
            function getMac() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macs", o: {id: eid}},
                    "params": null,
                    "userId": user.id
                });
                deferred.done(function (response) {
                    $scope.$apply(function () {
                        $scope.singleMacTable.data = response.macs;
                    });
                });
                deferred.fail(function (response) {
                    exceptionService.doException(response);
                });
            }
            function deleteMac(macId) {
                var deferred = camel.delete({
                    "url": {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/macs/{macId}", o: {id: eid, macId: macId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.done(function (response) {
                    getMac();
                });
                deferred.fail(function (response) {
                    exceptionService.doException(response);
                });
            }
            getMac();
        }];

    var setMacModule = angular.module("resources.hypervisor.setMac", ["ng"]);
    setMacModule.service("camel", httpService);
    setMacModule.controller("resources.hypervisor.setMac.ctrl", setMacCtrl);
    return setMacModule;
});