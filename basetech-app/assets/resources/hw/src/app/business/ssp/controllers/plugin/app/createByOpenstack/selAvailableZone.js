/**
 * Created on 14-2-28.
 */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/encoder',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        "app/services/httpService",
        "tiny-widgets/Window",
        "tiny-lib/underscore",
        "tiny-common/UnifyValid",
        "app/business/ssp/services/plugin/app/appCommonService",
        'app/services/cloudInfraService',
        "tiny-directives/Button",
        "tiny-directives/Select",
        "fixtures/appFixture"
    ],
    function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, Window, _, UnifyValid, appCommonService, cloudInfraService) {
        "use strict";
        var configParamCtrl = ["$scope", "$compile", "camel", "exception", "$q",
            function ($scope, $compile, camel, exception, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;

                var appCommonServiceIns = new appCommonService(exception, $q, camel);
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.resPoolId = $("#createByOpenstack_configParamWin").widget().option("resPoolId");
                $scope.vpcId = $("#createByOpenstack_configParamWin").widget().option("vpcId");
                $scope.vpcName = $("#createByOpenstack_configParamWin").widget().option("vpcName");
                $scope.curParamTableData = $("#createByOpenstack_configParamWin").widget().option("curParamTableData");

                $scope.selAz = null;
                $scope.azTable = {
                    "id": "create-app-azTable",
                    "enablePagination": false,
                    "displayLength": 10,
                    "totalRecords": 0,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "columns": [{
                        "sTitle": "",
                        "sWidth": "30px",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.selId);
                        }
                    }, {
                        "sTitle":i18n.common_term_ID_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        }
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.vpc_term_vpc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        }
                    }],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selectAzId = $scope.selAz && $scope.selAz.id;
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseAzRadioId";
                        selBoxScope.id = "appCreateAppChooseAzRadioId" + iDataIndex;
                        selBoxScope.value = aData.id;
                        if (selectAzId && (selectAzId === aData.id)) {
                            selBoxScope.checked = true;
                        } else {
                            selBoxScope.checked = false;
                        }
                        selBoxScope.change = function () {
                            $scope.selAz = aData;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryAz();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryAz();
                    }
                };
                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if ($scope.selAz) {
                            $scope.curParamTableData.value = $scope.selAz.name;
                            $scope.curParamTableData.selectId = $scope.selAz.id;
                        }
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "createApp-baseInfo-cancel",
                    "text":i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                function queryAz() {
                    var options = {
                        "user": user,
                        "id": $scope.vpcId,
                        "cloudInfraId": $scope.resPoolId
                    };

                    var deferred = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, $scope.resPoolId, null);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var azs = [];
                        var tmpAz = null;
                        _.each(data.availableZones, function (item, index) {
                            tmpAz = {
                                "id": item.id,
                                "name": item.name,
                                "vpcName": $scope.vpcName
                            };
                            if ($scope.curParamTableData.selectId) {
                                if ($scope.curParamTableData.selectId === item.id) {
                                    $scope.selAz = tmpAz;
                                }
                            } else {
                                if (index === 0) {
                                    $scope.selAz = tmpAz;
                                }
                            }
                            azs.push(tmpAz);
                        });
                        $scope.azTable.data = azs;
                        $scope.azTable.totalRecords = data.total;
                        $scope.azTable.displayLength = page.displayLength;
                        $("#" + $scope.azTable.id).widget().option("cur-page", {"pageIndex": page.currentPage});
                    });
                }

                queryAz();
            }
        ];
        var selAzModule = angular.module("ssp.createByOpenstack.selAz", ['framework','ngSanitize']);
        selAzModule.controller("ssp.createByOpenstack.selAz.ctrl", configParamCtrl);
        selAzModule.service("camel", http);

        return selAzModule;
    });
