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
        'app/business/application/services/appCommonService',
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

                $scope.selInstanceType = null;
                $scope.instanceTypeTable = {
                    "id": "create-app-instanceTypeTable",
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
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle":i18n.common_term_vCPU_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.cpuCount);
                        }
                    }, {
                        "sTitle": i18n.common_term_memoryMB_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.memSize);
                        }
                    }, {
                        "sTitle": i18n.common_term_diskGB_label,
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.systemDiskSize);
                        }
                    }],
                    "data": null,
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getInstanceType();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getInstanceType();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selectInstanceType = $scope.selInstanceType && $scope.selInstanceType.name;
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseInstanceTypeRadio";
                        selBoxScope.id = "appCreateAppChooseInstanceTypeRadio" + iDataIndex;
                        selBoxScope.value = aData.id;
                        if (selectInstanceType && (selectInstanceType === aData.name)) {
                            selBoxScope.checked = true;
                        } else {
                            selBoxScope.checked = false;
                        }
                        selBoxScope.change = function () {
                            $scope.selInstanceType = aData;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    }
                };

                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        //ICT的规格必须用名称而非ID
                        $scope.curParamTableData.value = $scope.selInstanceType.name;
                        $scope.curParamTableData.selectId = $scope.selInstanceType.name;
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

                function getInstanceType() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.resPoolId,
                        "limit": page.displayLength,
                        "start": page.getStart()
                    };
                    var deferred = appCommonServiceIns.queryVmFlavors(options);
                    deferred.then(function (data) {
                        if (!data || !data.vmFlavors) {
                            return;
                        }
                        var instanceTypes = [];
                        _.each(data.vmFlavors, function (item, index) {
                            item.diskDetail = generateDiskDetail(item.disks);
                            //instanceType匹配的是名称
                            if ($scope.curParamTableData.selectId) {
                                if ($scope.curParamTableData.selectId === item.name) {
                                    $scope.selInstanceType = item;
                                }
                            } else {
                                if (index === 0) {
                                    $scope.selInstanceType = item;
                                }
                            }
                            instanceTypes.push(item);
                        });
                        $scope.instanceTypeTable.data = instanceTypes;
                        $scope.instanceTypeTable.totalRecords = data.total;

                        $scope.instanceTypeTable.displayLength = page.displayLength;
                        $("#" + $scope.instanceTypeTable.id).widget().option("cur-page", {
                            "pageIndex": page.currentPage
                        });
                    });
                }

                function generateDiskDetail(disks) {
                    if (!disks || (disks.length <= 0)) {
                        return "";
                    }
                    var diskSize = 0;
                    var diskDetail = "";
                    for (var i = 0; i < disks.length; i++) {
                        if (!disks[i]) {
                            continue;
                        }
                        diskSize += disks[i].diskSize;
                        diskDetail += (i18n.common_term_disk_label + disks.index + ": ");
                        diskDetail += (disks[i].diskSize + "G; ");
                    }
                    diskSize += "G";
                    return diskSize;
                }

                getInstanceType();
            }
        ];
        var selImageModule = angular.module("app.createByOpenstack.selInstanceType", ['framework','ngSanitize']);
        selImageModule.controller("app.createByOpenstack.selInstanceType.ctrl", configParamCtrl);
        selImageModule.service("camel", http);

        return selImageModule;
    });
