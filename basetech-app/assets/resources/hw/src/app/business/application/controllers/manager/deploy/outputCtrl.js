/**
 * 文件名：vmMonitorResourceCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-3
 */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    "tiny-lib/underscore",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/business/application/services/appCommonService',
    'tiny-directives/Lineplot'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, _, http, exception, appCommonService) {
    "use strict";

    var outputCtrl = ['$scope', 'camel', "exception", "$q",
        function ($scope, camel, exception, $q) {
            var user = $("html").scope().user;
            var winDom = $("#viewApp_Detail_winId");
            var winWidget = winDom.widget();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            $scope.curCloudInfraId = winWidget.option("curCloudInfraId");
            $scope.curAppId = winWidget.option("curAppId");
            $scope.curVpcId = winWidget.option("curVpcId");
            var appCommonServiceIns = new appCommonService(exception, $q, camel);

            $scope.outputTable = {
                "id": "app-deploy-outputs",
                "enablePagination": true,
                "draggable": true,
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "columnsVisibility": {
                    "activate": "click", //"mouseover"/"click"
                    "aiExclude": [0],
                    "bRestore": false,
                    "fnStateChange": function (index, state) {
                    }
                },

                "columns": [
                    {
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_value_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.value);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                }
            };

            function queryOutput() {
                var options = {
                    "user": user,
                    "vpcId": $scope.curVpcId,
                    "id": $scope.curAppId,
                    "cloudInfraId": $scope.curCloudInfraId
                };
                var deferred = appCommonServiceIns.queryOutput(options);
                deferred.then(function (data) {
                    if (!data || !data.outputs || (data.outputs.length <= 0)) {
                        return;
                    }

                    var outputs = [];
                    var tmpOutput = null;
                    _.each(data.outputs, function (item, index) {
                        tmpOutput = {
                            "name": item.key,
                            "value": item.value,
                            "description": item.desc
                        };
                        outputs.push(tmpOutput);
                    });
                    $scope.outputTable.data = outputs;
                });
            }

            queryOutput();
        }
    ];

    var resourcesModule = angular.module("app.list.deployOutput", ['ng', 'wcc', "ngSanitize"]);
    resourcesModule.controller("app.list.deployOutput.ctrl", outputCtrl);
    resourcesModule.service("camel", http);
    resourcesModule.service("exception", exception);
    return resourcesModule;
});
