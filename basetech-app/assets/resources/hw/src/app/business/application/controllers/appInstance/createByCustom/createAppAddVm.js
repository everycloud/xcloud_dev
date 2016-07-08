/**
 * Created on 14-3-4.
 */
define([
        'sprintf',
        'tiny-lib/jquery',
        'tiny-lib/encoder',
        'tiny-lib/angular',
        "tiny-lib/angular-sanitize.min",
        "language/keyID",
        'app/services/httpService',
        'app/services/validatorService',
        "tiny-lib/underscore",
        "app/business/application/services/queryVmService",
        "fixtures/appFixture"
    ],
    function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, validator, _, queryVmService) {
        "use strict";

        var addVmCtrl = ["$scope", "$compile", "camel", "exception", "$q",
            function ($scope, $compile, camel, exception, $q) {
                var addShareData = $("#app_createByCustom_addVmWin").widget().option("addShareData") || {};
                var locationId = addShareData.locationId;
                var chosenVmIds = addShareData.chosenVmIds;
                var selVpcId = addShareData.selVpcId;
                var chosenVmData = addShareData.chosenVmData || [];
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var user = $("html").scope().user;
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
                var searchName = "";

                $scope.selectedVms = [];

                $scope.searchBox = {
                    "id": "app_createByCustom_addVm_searchBoxId",
                    "placeholder": i18n.template_term_findVMname_prom+":",
                    "width": "250",
                    "suggestSize": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (searchString) {
                        searchName = searchString;
                        queryCustomAvailableVm();
                        $scope.selectedVms = [];
                    }
                };

                $scope.availableVmTable = {
                    "id": "createByCustomAvailableVmTable",
                    "caption": "vmCaption",
                    "paginationStyle": "full_numbers",
                    "enablePagination": true,
                    "totalRecords": 0,
                    "displayLength": 10,
                    "lengthMenu": [10, 20, 30],
                    "draggable": true,
                    "columns": [{
                        "sTitle": "",
                        "sWidth": "80px",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.choose);
                        }
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "20%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "sWidth": "30%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmId);
                        }
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        }
                    }],
                    "data": [],
                    "columnVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0, 9],
                        "bRestore": true,
                        "fnStateChange": function (index, state) {}
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //管理虚拟机,应用下虚拟机等
                        var selBox;
                        var selBoxLink;
                        var selBoxScope;
                        var selBoxNode;
                        if (aData.isMgr || aData.belongToApp) {
                            selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox></div>";
                            selBoxLink = $compile(selBox);
                            selBoxScope = $scope.$new();
                            selBoxScope.id = "createByCustomAvailableVmCheck" + iDataIndex;
                            selBoxScope.data = aData;
                            selBoxScope.checked = false;
                            selBoxScope.disable = true;
                            selBoxScope.change = function () {};
                            selBoxNode = selBoxLink(selBoxScope);
                            $("td:eq(0)", nRow).append(selBoxNode);
                            $(nRow).css("color", "#8A8A8A");
                            return;
                        }

                        selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox></div>";
                        selBoxLink = $compile(selBox);
                        selBoxScope = $scope.$new();
                        var selectedVm = findVmById(aData.id);
                        selBoxScope.id = "createByCustomAvailableVmCheck" + iDataIndex;
                        selBoxScope.data = aData;
                        if (selectedVm) {
                            selBoxScope.checked = true;
                            selBoxScope.disable = true;
                        } else {
                            selBoxScope.checked = false;
                            selBoxScope.disable = false;
                        }
                        selBoxScope.change = function () {
                            var currScope = $("#createByCustomAvailableVmCheck" + iDataIndex).scope();
                            selectVm(aData, $("#createByCustomAvailableVmCheck" + iDataIndex).widget().option("checked"));
                        };
                        selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);
                        if (selectedVm) {
                            $(nRow).css("color", "#8A8A8A");
                        }
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryCustomAvailableVm();
                        $scope.selectedVms = [];
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryCustomAvailableVm();
                        $scope.selectedVms = [];
                    }
                };

                $scope.okBtn = {
                    "id": "createByCustomAvailableVmOk",
                    "text": i18n.common_term_ok_button,
                    "click": function () {

                        //将选中的虚拟机放回父页面
                        var newChosenVmData = [];
                        _.each(chosenVmData, function (item, index) {
                            newChosenVmData.push(item);
                        });
                        _.each($scope.selectedVms, function (item, index) {
                            newChosenVmData.push(item);
                        });
                        addShareData.chosenVmData = newChosenVmData;
                        $("#app_createByCustom_addVmWin").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "createByCustomAvailableVmCancel",
                    "text":i18n.common_term_cancle_button,
                    "click": function () {
                        $("#app_createByCustom_addVmWin").widget().destroy();
                    }
                };

                //勾选、去勾选虚拟机
                function selectVm(rData, checked) {
                    if (!rData) {
                        return false;
                    }

                    if (checked) {
                        $scope.selectedVms.push(rData);
                    } else {
                        var vmId = rData.vmId;
                        for (var i = 0; i < $scope.selectedVms.length; i++) {
                            if ($scope.selectedVms[i] && ($scope.selectedVms[i].vmId === vmId)) {
                                $scope.selectedVms.splice(i, 1);
                                break;
                            }
                        }
                    }
                }

                function queryCustomAvailableVm() {
                    var options = {
                        "vpcId": selVpcId,
                        "user": user,
                        "cloudInfraId": locationId,
                        "start": page.getStart(),
                        "limit": page.displayLength,
                        "status": ["running", "stopped", "hibernated", "create_success", "pause"],
                        "condition": searchName,
                        "volumeId": "",
                        "availableZoneId": ""
                    };
                    var deferred = queryVmServiceIns.queryVmList(options);
                    deferred.then(function (data) {
                        if (!data || !data.list) {
                            $scope.availableVmTable.data = [];
                            $scope.availableVmTable.totalRecords = 0;
                            return;
                        }

                        _.each(data.list.vms, function (item, index) {
                            _.extend(item, {
                                "name": item.name,
                                "vmId": item.visiableId,
                                "ip": generateIps(item.vmSpecInfo),
                                "vpc": "",
                                "choose": ""
                            });
                            if ((item.vappId === null) || (item.vappId <= 0)) {
                                item.belongToApp = false;
                            } else {
                                item.belongToApp = true;
                            }
                        });

                        $scope.availableVmTable.data = data.list.vms;
                        $scope.availableVmTable.totalRecords = data.list.total;
                        $scope.availableVmTable.displayLength = page.displayLength;
                    });
                }

                function findVmById(vmId) {
                    if (!vmId || (chosenVmData.length <= 0)) {
                        return null;
                    }

                    for (var i = 0; i < chosenVmData.length; i++) {
                        if (vmId === chosenVmData[i].id) {
                            return chosenVmData[i];
                        }
                    }
                    return null;
                }

                function generateIps(vmSpecInfo) {
                    if (!vmSpecInfo || !vmSpecInfo.nics || (vmSpecInfo.nics.length <= 0)) {
                        return "";
                    }

                    var ips = "";
                    for (var i = 0; i < vmSpecInfo.nics.length; i++) {
                        ips += (vmSpecInfo.nics[i].ip || "");
                        ips += ";";
                    }
                    var seperatorIndex = ips.lastIndexOf(";");
                    if (seperatorIndex >= 0) {
                        return ips.substring(0, seperatorIndex);
                    } else {
                        return ips;
                    }
                }

                queryCustomAvailableVm();
            }
        ];

        var addVmModule = angular.module("createByCustom.addVm", ['framework','ngSanitize']);
        addVmModule.controller("createByCustom.addVm.ctrl", addVmCtrl);
        addVmModule.service("camel", http);
        addVmModule.service("createByCustom.addVm.validator", validator);

        return addVmModule;
    }
);
