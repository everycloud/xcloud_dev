/* global define*/
define([
    "sprintf",
    'tiny-lib/angular',
    'tiny-lib/jquery',
    'tiny-lib/underscore',
    "app/services/httpService",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/vlb/vlbService",
    'app/services/exceptionService',
    "language/keyID",
    "fixtures/ecsFixture",
    "tiny-directives/Button"
],
    function (sprintf, angular, $, _, http, UnifyValid, validatorService, vlbService, exception, i18n) {
        "use strict";
        var ctrl = ["$scope", "$compile", "camel", "$q", "exception",
            function ($scope, $compile, camel, $q, exception) {
                i18n.sprintf = sprintf.sprintf;
                $scope.i18n = i18n;
                var vlbServiceInst = new vlbService(exception, $q, camel);
                // 待修改对象
                var bindVmWinDom = $("#unbindVmWindowId");
                var winWidget = bindVmWinDom.widget();
                var condition = winWidget.option("condition");
                var cloudInfraId = winWidget.option("cloudInfra");
                var user = winWidget.option("user");
                var vpcId = winWidget.option("vpcId");

                $scope.close = function () {
                    bindVmWinDom.widget().destroy();
                };

                $scope.bindVmTable = {
                    "id": "bindVmsTable",
                    "captain": "vmCaptain",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 50],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "draggable": true,
                    "columns": getTableColumns(),
                    "data": condition.vms,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();

                        optScope.remove = function () {
                            remove(aData.vmID);
                        };

                        // 操作
                        var opt = "<div><a class='btn-link' ng-click='remove()'>" + i18n.common_term_unbondVM_button + "</a></div>";
                        var optLink = $compile(opt);
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(0)", nRow).addTitle();
                    }
                };

                function remove(vmID){
                    var promise = vlbServiceInst.operateVLB({
                        "vdcId": user.orgId,
                        "cloudInfraId": cloudInfraId,
                        "userId": user.id,
                        "opParam": {
                            "deleteVMFromLB": {
                                "lbID": condition.lbID,
                                "listeners": [
                                    {
                                        "bindingVM": [
                                            {
                                                "vmID": vmID
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    });
                    promise.then(function () {
                        condition.okClick = true;
                        $scope.close();
                        $scope.$destroy();
                    });
                }

                function getTableColumns() {
                    return [
                        {
                            "sTitle": i18n.lb_term_backendPort_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.servicePort);
                            },
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "IP",
                            "mData": "vmIP",
                            "sWidth": "30%"
                        },
                        {
                            "sTitle": i18n.common_term_proportion_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.weight);
                            },
                            "sWidth": "30%"
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "sWidth": "30%"
                        }
                    ];
                }
            }
        ];

        var dependency = ["ng", "wcc"];
        var unbindVmWindow = angular.module("unbindVmWindow", dependency);
        unbindVmWindow.controller("unbindVmWindowCtrl", ctrl);
        unbindVmWindow.service("camel", http);
        unbindVmWindow.service("exception", exception);

        return unbindVmWindow;
    });
