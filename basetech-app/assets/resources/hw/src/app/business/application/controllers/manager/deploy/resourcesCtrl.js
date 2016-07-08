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
        'app/services/commonService',
        'app/business/application/services/appCommonService',
        'tiny-directives/Lineplot'
    ],
    function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, _, http, exception, commonService, appCommonService) {
        "use strict";

        var resourcesCtrl = ['$scope', 'camel', "exception", "$q",
            function ($scope, camel, exception, $q) {
                var user = $("html").scope().user;
                var appCommonServiceIns = new appCommonService(exception, $q, camel);

                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var winDom = $("#viewApp_Detail_winId");
                var winWidget = winDom.widget();
                $scope.curAppId = winWidget.option("curAppId");
                $scope.curCloudInfraId = winWidget.option("curCloudInfraId");
                $scope.curVpcId = winWidget.option("curVpcId");

                var RESOURCE_STATUS_MAP = {
                    "CREATE_IN_PROGRESS": i18n.common_term_creating_value,
                    "CREATE_FAILED": i18n.common_term_createFail_value,
                    "CREATE_COMPLETE": i18n.common_term_createComplete_value,
                    "DELETE_IN_PROGRESS": i18n.common_term_deleting_value,
                    "DELETE_FAILED": i18n.common_term_deleteFail_value,
                    "DELETE_COMPLETE": i18n.common_term_deleteSucceed_value,
                    "UPDATE_IN_PROGRESS": i18n.common_term_updating_value,
                    "UPDATE_FAILED": i18n.common_term_updatFail_value,
                    "UPDATE_COMPLETE": i18n.common_term_updatComplete_value
                };

                $scope.resourceTable = {
                    "id": "app-deploy-resources",
                    "enablePagination": false,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "columnsVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {}
                    },

                    "columns": [{
                        "sTitle":i18n.common_term_resourceName_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_resourceType_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.state);
                        }
                    }, {
                        "sTitle": i18n.common_term_updatTime_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.updateTime);
                        }
                    }],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                    }
                };

                function queryResources() {
                    var options = {
                        "user": user,
                        "vpcId": $scope.curVpcId,
                        "id": $scope.curAppId,
                        "cloudInfraId": $scope.curCloudInfraId
                    };

                    var deferred = appCommonServiceIns.queryResources(options);
                    deferred.then(function (data) {
                        if (!data || (!data.resourceList) || (data.resourceList.length <= 0)) {
                            return;
                        }

                        var resources = [];
                        var tmpResource = null;
                        _.each(data.resourceList, function (item, index) {
                            tmpResource = {
                                "name": item.name,
                                "type": item.type,
                                "state": RESOURCE_STATUS_MAP[item.status],
                                "updateTime": commonService.utc2Local(item.updateTime)
                            };
                            resources.push(tmpResource);
                        });
                        $scope.resourceTable.data = resources;
                    });
                }

                queryResources();
            }
        ];

        var resourcesModule = angular.module("app.list.deployResources", ['ng', 'wcc', "ngSanitize"]);
        resourcesModule.controller("app.list.deployResources.ctrl", resourcesCtrl);
        resourcesModule.service("camel", http);
        resourcesModule.service("exception", exception);
        return resourcesModule;
    });
