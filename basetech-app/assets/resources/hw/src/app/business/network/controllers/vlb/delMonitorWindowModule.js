/* global define*/
define([
        'tiny-lib/angular',
        'tiny-lib/jquery',
        "app/services/httpService",
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        "app/services/messageService",
        'app/services/exceptionService',
        "app/business/network/services/vlb/vlbService",
        "language/keyID",
        "tiny-directives/Textbox",
        "tiny-directives/Button"
    ],
    function (angular, $, http, UnifyValid, validatorService, messageService, exception, vlbService, i18n) {
        "use strict";
        var ctrl = ["$scope", "$q", "$compile", "camel", "exception",
            function ($scope, $q, $compile, camel, exception) {
                $scope.vlbServiceInst = new vlbService(exception, $q, camel);

                var user = $("html").scope().user || {};

                var messageServiceIns = new messageService();

                // 父窗口传递的添加对象
                var delWinDom = $("#delMonitorWindow");
                var listeners = delWinDom.widget().option("listeners");
                var cloudInfraId = delWinDom.widget().option("cloudInfraId");

                $scope.close = function () {
                    $("#delMonitorWindow").widget().destroy();
                };
                $scope.info = {
                    monitorTable: {
                        "id": "del-vlb-listtable",
                        "enablePagination": false,
                        "draggable": true,
                        "columns": [{
                            "sTitle": i18n.common_term_protocol_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.protocol);
                            },
                            "sWidth": "10%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_pairIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.extendPort);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_backendProtocol_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backendProtocol);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.backendPort);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_status_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.status);
                            },
                            "sWidth": "20%",
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "10%",
                            "bSortable": false
                        }],
                        "data": listeners,
                        "renderRow": function (nRow, aData, iDataIndex) {
                            var optScope = $scope.$new();
                            optScope.remove = function () {
                                if ($scope.info.monitorTable.data.length <= 1) {
                                    messageServiceIns.failMsgBox(i18n.lb_lb_delListen_info_min_msg);
                                    return;
                                }
                                messageServiceIns.warnMsgBox({
                                    "content": i18n.lb_lb_delListen_info_confirm_msg,
                                    "callback": function () {
                                        var deferred = $scope.vlbServiceInst.deleteListener({
                                            "vdcId": user.vdcId,
                                            "cloudInfraId": cloudInfraId,
                                            "userId": user.id,
                                            "lbID": aData.lbID,
                                            "id": aData.id
                                        });
                                        deferred.then(function () {
                                            $scope.close();
                                            $scope.$destroy();
                                        });
                                    }
                                });
                            };
                            // 操作
                            var opt = "<div><a class='btn-link' ng-click='remove()'>" + i18n.common_term_delete_button + "</a> </div>";
                            var optLink = $compile(opt);

                            var optNode = optLink(optScope);
                            $("td:eq(5)", nRow).append(optNode);
                        }
                    }
                };
            }
        ];

        var dependency = [
            "ng", "wcc"
        ];
        var delMonitorWindow = angular.module("delMonitorWindow", dependency);
        delMonitorWindow.controller("delListenerCtrl", ctrl);
        delMonitorWindow.service("camel", http);
        delMonitorWindow.service("exception", exception);

        return delMonitorWindow;
    });
