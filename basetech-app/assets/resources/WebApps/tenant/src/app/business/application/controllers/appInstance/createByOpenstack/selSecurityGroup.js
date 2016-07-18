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

                $scope.selSecurityGroup = null;
                $scope.securityGroupTable = {
                    "id": "create-app-securityGroupTable",
                    "enablePagination": true,
                    "displayLength": 10,
                    "totalRecords": 0,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 50],
                    "columnsVisibility": {
                        "activate": "click",
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
                            return $.encoder.encodeForHTML(data.selId);
                        }
                    }, {
                        "sTitle": "ID",
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgID);
                        }
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selSecurityGroup = $scope.securityGroup && $scope.securityGroup.sgID;
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseSecurityGroupRadio";
                        selBoxScope.id = "appCreateAppChooseSecurityGroupRadio" + iDataIndex;
                        selBoxScope.value = aData.id;
                        if (selSecurityGroup && (selSecurityGroup === aData.sgID)) {
                            selBoxScope.checked = true;
                        } else {
                            selBoxScope.checked = false;
                        }
                        selBoxScope.change = function () {
                            $scope.selSecurityGroup = aData;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        querySecurityGroups();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        querySecurityGroups();
                    }
                };

                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        //ICT的规格必须用名称而非ID
                        $scope.curParamTableData.value = $scope.selSecurityGroup.name;
                        $scope.curParamTableData.selectId = $scope.selSecurityGroup.sgID;
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

                function querySecurityGroups() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.resPoolId,
                        "vpcId": $scope.vpcId,
                        "start": null,
                        "limit": page.displayLength
                    };
                    var promise = appCommonServiceIns.queryAvailableSecurityGroups(options);
                    promise.then(function(data){
                        if (!data || !data.sgs) {
                            return;
                        }
                        var securityGroup = [];
                        _.each(data.sgs,function(item,index){
                            if ($scope.curParamTableData.selectId) {
                                if ($scope.curParamTableData.selectId === item.sgID) {
                                    $scope.selSecurityGroup = item;
                                }
                            } else {
                                if (index === 0) {
                                    $scope.selSecurityGroup = item;
                                }
                            }
                            securityGroup.push(item);
                        });
                        $scope.securityGroupTable.data = securityGroup;
                        $scope.securityGroupTable.displayLength = page.displayLength;
                        $scope.securityGroupTable.totalRecords = data.total;
                    });
                }
                querySecurityGroups();
            }
        ];
        var selSecurityGroupModule = angular.module("app.createByOpenstack.selSecurityGroup", ['framework', 'ngSanitize']);
        selSecurityGroupModule.controller("app.createByOpenstack.selSecurityGroup.ctrl", configParamCtrl);
        selSecurityGroupModule.service("camel", http);

        return selSecurityGroupModule;
    });
