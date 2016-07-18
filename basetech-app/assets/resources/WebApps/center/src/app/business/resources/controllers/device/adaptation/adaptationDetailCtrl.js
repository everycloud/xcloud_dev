/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-27

 */
define(['tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/commonService",
    "app/services/messageService",
    "app/services/httpService",
    'app/business/resources/services/device/adaptation/adaptationService'
],
    function (angular, Message, commonService, MessageService, http, AdaptationService) {
        "use strict";
        var adaptationDetailCtrl = ['$scope', '$q', 'camel', function ($scope, $q, camel) {

            var $rootScope = $("html").scope();
            var user = $rootScope.user;
            var i18n = $scope.i18n = $rootScope.i18n;
            var adaptationService = new AdaptationService($q, camel);
            var detailWindowWidget = $("#adaptationDetailWindow").widget();
            var adaptator = detailWindowWidget.option("params");
            var typeTextConfig = adaptationService.getDeviceType();
            $scope.adaptatorName = adaptator.name;
            $scope.adaptatorNameLabel = (i18n.common_term_name_label || "名称") + ":";
            $scope.installDate = adaptator.installDate && commonService.utc2Local(adaptator.installDate);
            $scope.installDateLabel = (i18n.common_term_installDate_label || "安装日期") + ":";
            $scope.supportDeviceLabel = (i18n.temp_resource_device_supported || "支持的设备") + ":";

            $scope.supportTable = {
                "id": "supportTableId",
                "enablePagination": false,
                "data": [],
                "columns": [
                    {
                        "sTitle": i18n.common_term_manufacturers_label || "制造商",
                        "mData": function (data) {
                            var vendor = data.vendor || "";
                            return $.encoder.encodeForHTML(vendor);
                        }
                    },
                    {
                        "sTitle": i18n.device_term_model_label || "型号",
                        "mData": function (data) {
                            var model = data.model || "";
                            return $.encoder.encodeForHTML(model);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_type_label || "类型",
                        "mData": function (data) {
                            var typeText = data.typeText || "";
                            return $.encoder.encodeForHTML(typeText);
                        }
                    }
                ]
            };

            var parseTableData = function (reslovedValue) {
                var list = reslovedValue && reslovedValue.deviceList;
                if (list) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        var item = list[i];
                        item.typeText = typeTextConfig[item.type];
                    }
                    $scope.supportTable.data = list;
                }
            }

            $scope.operator = {
                getSupportDeviceList: function () {
                    var promise = adaptationService.adaptatorOperator({
                        id: adaptator.id,
                        userId: user.id
                    });
                    promise.then(function (reslovedValue) {
                        parseTableData(reslovedValue);
                    });
                }
            };

            $scope.operator.getSupportDeviceList();

        }];

        var dependency = ['ng', 'wcc'];
        var adaptationDetailModule = angular.module("adaptationDetailModule", dependency);
        adaptationDetailModule.controller("adaptationDetailCtrl", adaptationDetailCtrl);
        adaptationDetailModule.service("camel", http);

        return adaptationDetailModule;
    });

