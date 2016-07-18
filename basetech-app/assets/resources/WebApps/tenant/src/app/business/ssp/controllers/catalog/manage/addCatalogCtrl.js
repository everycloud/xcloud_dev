/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：
 * 修改时间：14-5-9
 */
/* global define */
define(["sprintf",
    "language/keyID",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    "app/services/exceptionService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/catalog/catalogService",
    'app/services/validatorService',
    'tiny-common/UnifyValid'
], function (sprintf,keyIDI18n, $, angular, http, exception, orderService, catalogService, validatorService, UnifyValid) {
    "use strict";

    var addCatalogCtrl = ["$scope", "$q", "camel", "exception",
        function ($scope, $q, camel, exception) {

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            // 父窗口传递的参数
            var winParam = $("#serviceCatalogModifyWinId").widget().option("winParam") || {};
            var user = $("html").scope().user;
            var orderServiceIns = new orderService(exception, $q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var validator = new validatorService();

            $scope.catalogName = {
                "name": i18n.common_term_name_label,
                "require": true,
                "id": "serviceAddCatalogName",
                "value": "",
                "validate": "maxSize(64):" + i18n.common_term_composition2_valid + i18n .sprintf(i18n.common_term_length_valid ,"1", "64"  ) + " ;regularCheck(" + validator.name + "):" + i18n.common_term_composition2_valid + i18n .sprintf( i18n.common_term_length_valid, "1", "64") + " ;"
            };

            $scope.catalogDesc = {
                "name": i18n.common_term_desc_label,
                "require": false,
                "id": "serviceAddCatalogDesc",
                "type": "multi",
                "width": "250",
                "height": "60",
                "value": "",
                "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_smaller_valid, "1024") + " ;"
            };

            $scope.okBtn = {
                "id": "serviceAddCatalogOk",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    var valid = UnifyValid.FormValid($(".service_add_catalog_ins"));
                    if (!valid) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "catalog": {
                            "id": winParam.catalogId,
                            "name": $("#serviceAddCatalogName").widget().getValue(),
                            "desc": $("#serviceAddCatalogDesc").widget().getValue()
                        }
                    };
                    var deferred;
                    if (winParam.catalogId) {
                        deferred = catalogServiceIns.modifyCatalog(options);
                    } else {
                        deferred = catalogServiceIns.createCatalog(options);
                    }
                    deferred.then(function (data) {
                        winParam.needRefresh = true;
                        $("#serviceCatalogModifyWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "serviceMyServiceExtendInsCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#serviceCatalogModifyWinId").widget().destroy();
                }
            };

            $scope.operate = {
                "queryCatalogDetail": function (catalogId) {
                    var options = {
                        "user": user,
                        "catalogId": catalogId
                    };
                    var deferred = catalogServiceIns.queryCatalog(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.catalogName.value = data.catalog.name;
                        $scope.catalogDesc.value = data.catalog.description;
                    });
                }
            };

            function init() {
                if (winParam.catalogId) {
                    $scope.operate.queryCatalogDetail(winParam.catalogId);
                }
            }
            init();
        }
    ];

    var addCatalogModule = angular.module("ssp.catalogManager.addCatalog", ['ng', 'wcc']);
    addCatalogModule.controller("ssp.catalogManager.addCatalog.ctrl", addCatalogCtrl);
    addCatalogModule.service("camel", http);
    addCatalogModule.service("exception", exception);

    return addCatalogModule;
});
