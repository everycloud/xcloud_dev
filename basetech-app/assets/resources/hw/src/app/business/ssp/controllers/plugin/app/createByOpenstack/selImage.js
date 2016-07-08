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
        "tiny-directives/Button",
        "tiny-directives/Select",
        "fixtures/appFixture"
    ],
    function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, Window, _, UnifyValid, appCommonService) {
        "use strict";
        var configParamCtrl = ["$scope", "$compile", "camel", "exception", "$q",
            function ($scope, $compile, camel, exception, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                var appCommonServiceIns = new appCommonService(exception, $q, camel);

                $scope.resPoolId = $("#createByOpenstack_configParamWin").widget().option("resPoolId");
                $scope.vpcId = $("#createByOpenstack_configParamWin").widget().option("vpcId");
                $scope.vpcName = $("#createByOpenstack_configParamWin").widget().option("vpcName");
                $scope.curParamTableData = $("#createByOpenstack_configParamWin").widget().option("curParamTableData");

                $scope.selImage = null;
                $scope.imageTable = {
                    "id": "create-app-imageTable",
                    "enablePagination": true,
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
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        }
                    }, {
                        "sTitle":i18n.common_term_OStype_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        }
                    }, {
                        "sTitle":i18n.common_term_OSversion_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osVersion);
                        }
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selectImage = $scope.selImage && $scope.selImage.vmtID;
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseImageRadioId";
                        selBoxScope.id = "appCreateAppChooseImageRadioId" + iDataIndex;
                        selBoxScope.value = aData.id;
                        if (selectImage && (selectImage === aData.vmtID)) {
                            selBoxScope.checked = true;
                        } else {
                            selBoxScope.checked = false;
                        }
                        selBoxScope.change = function () {
                            $scope.selImage = aData;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryImage();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryImage();
                    }
                };

                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        $scope.curParamTableData.value = $scope.selImage.vmtName;
                        $scope.curParamTableData.selectId = $scope.selImage.vmtId;
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "createApp-baseInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#createByOpenstack_configParamWin").widget().destroy();
                    }
                };

                function queryImage() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.resPoolId,
                        "status": "active",
                        "limit": page.displayLength,
                        "start": page.getStart()
                    };
                    var deferred = appCommonServiceIns.queryAvailableVmTemplate(options);
                    deferred.then(function (data) {
                        if (!data || !data.vmtemplates) {
                            return;
                        }

                        var images = [];
                        _.each(data.vmtemplates, function (item, index) {
                            images.push(item);
                            if ($scope.curParamTableData.selectId) {
                                if ($scope.curParamTableData.selectId === item.vmtID) {
                                    $scope.selImage = item;
                                }
                            } else {
                                if (index === 0) {
                                    $scope.selImage = item;
                                }
                            }
                        });
                        $scope.imageTable.data = images;
                        $scope.imageTable.displayLength = page.displayLength;
                        $scope.imageTable.totalRecords = data.totalNum;
                        $("#" + $scope.imageTable.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                }

                queryImage();
            }
        ];
        var selImageModule = angular.module("ssp.createByOpenstack.selImage", ['framework','ngSanitize']);
        selImageModule.controller("ssp.createByOpenstack.selImage.ctrl", configParamCtrl);
        selImageModule.service("camel", http);

        return selImageModule;
    });
