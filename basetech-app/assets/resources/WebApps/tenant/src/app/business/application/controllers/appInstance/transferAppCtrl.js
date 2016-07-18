/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加磁盘的control
 * 修改人：
 * 修改时间：14-2-18
 */
define([
    'sprintf',
    'jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'app/services/validatorService',
    'tiny-common/UnifyValid',
    'tiny-lib/underscore',
    'app/business/application/services/appCommonService',
    'app/business/tenantUser/service/userDomainService',
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select',
    'fixtures/tenantUserFixture'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, validatorService, UnifyValid, _, appCommonService, userDomainService) {
    "use strict";
    var validator = new validatorService();
    var user = $("html").scope().user;
    var transferAppCtrl = ["$scope", "$compile", "camel", "$state", "exception", "$q",
        function ($scope, $compile, camel, $state, exception, $q) {
            var transferShareData = $("#appListTransferAppWindId").widget().option("transferShareData") || {};
            $scope.transferUserId = null;
            $scope.curApplicationId = transferShareData.curApplicationId;
            $scope.curCloudInfraId = transferShareData.curCloudInfraId;
            $scope.curVpcId = transferShareData.curVpcId;
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var userDomainServiceIns = new userDomainService(exception, $q, camel);
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            var searchString = "";

            $scope.searchBox = {
                "id": "app_transfer_userName_searchBoxId",
                "placeholder": i18n.user_term_findUserName_prom+":",
                "width": "150",
                "suggestSize": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (content) {
                    searchString = content;
                    queryTransferUsers();
                }
            };

            $scope.userTable = {
                "id": "appList-app-transfer-userTable",
                "enablePagination": true,
                "draggable": true,
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "lengthMenu": [10, 20, 30],
                "totalRecords": 0,
                "columnsVisibility": {
                    "activate": "click", //"mouseover"/"click"
                    "aiExclude": [0],
                    "bRestore": false,
                    "fnStateChange": function (index, state) {}
                },
                "columns": [{
                    "sTitle": "",
                    "sWidth": "30px",
                    "bSortable": false,
                    "bSearchable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    }
                }, {
                    "sTitle": i18n.common_term_userName_label,
                    "sWidth": "30%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    }
                }, {
                    "sTitle": i18n.common_term_desc_label,
                    "sWidth": "40%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    }
                }],
                "data": null,
                "renderRow": function (nRow, aData, iDataIndex) {
                    var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.name = "appTransferUserRadio";
                    selBoxScope.id = "appTransferUserRadioId" + iDataIndex;
                    selBoxScope.value = aData.id;
                    if ($scope.transferUserId && ($scope.transferUserId === aData.id)) {
                        selBoxScope.checked = true;
                    } else {
                        selBoxScope.checked = false;
                    }
                    selBoxScope.change = function () {
                        $scope.transferUserId = $("#appTransferUserRadioId0").widget().opChecked();
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                },
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryTransferUsers();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryTransferUsers();
                }
            };

            $scope.okBtn = {
                "id": "create-app-chooseTemplate-ok",
                "text": i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    if (!$scope.transferUserId) {
                        return;
                    }
                    transferApp($scope.transferUserId);
                }
            };

            $scope.cancelBtn = {
                "id": "create-app-chooseTemplate-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#appListTransferAppWindId").widget().destroy();
                }
            };

            function transferApp(transferUserId) {
                var options = {
                    "user": user,
                    "vpcId": $scope.curVpcId,
                    "id": $scope.curApplicationId,
                    "targetUserId": transferUserId,
                    "resInfraId": $scope.curCloudInfraId
                };
                var deferred = appCommonServiceIns.transferApp(options);
                deferred.then(function (data) {
                    $("#appListTransferAppWindId").widget().destroy();
                    transferShareData.needRefresh = true;
                });
            }

            function queryTransferUsers() {
                var options = {
                    "vdcId": user.vdcId,
                    "start": page.getStart(),
                    "limit": page.displayLength,
                    "userName": searchString,
                    "userId": user.id
                };
                var deferred = userDomainServiceIns.queryUserlist(options);
                deferred.then(function (data) {
                    if (!data || !data.userList) {
                        return;
                    }

                    var newUserTable = [];
                    _.each(data.userList, function (item, index) {
                        newUserTable.push({
                            "id": item.id,
                            "name": item.name,
                            "description": item.description || ""
                        });
                    });
                    $scope.userTable.totalRecords = data.total;
                    $scope.userTable.displayLength = page.displayLength;
                    $scope.userTable.data = newUserTable;
                    if ($scope.userTable.data.length > 0) {
                        $scope.transferUserId = $scope.userTable.data[0].id;
                    }
                });
            }

            queryTransferUsers();
        }
    ];

    var transferAppModule = angular.module("app.list.transferApp", ['framework','ngSanitize']);
    transferAppModule.controller("app.list.transferApp.ctrl", transferAppCtrl);
    transferAppModule.service("camel", http);
    transferAppModule.service("ecs.vm.detail.disk.add.validator", validator);

    return transferAppModule;
});
