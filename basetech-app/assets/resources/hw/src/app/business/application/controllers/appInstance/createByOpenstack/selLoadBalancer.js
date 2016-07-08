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
        var configParamCtrl1 = ["$scope", "$compile", "camel", "exception", "$q",
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

                $scope.selLoadBalancer = null;
                $scope.loadBalancerTable = {
                    "id": "create-app-loadBalancerTable",
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
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.lbName);
                        }
                    }, {
                        "sTitle": i18n.common_term_externalIP_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.slbVmInfo.extIP);
                        }
                    }, {
                        "sTitle": i18n.common_term_protocolAndPort_label,
                        "sWidth": "10%",
                        "bSortable": false,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.listeners[0].protocol+"("+data.listeners[0].port+")");
                        }
                    }],
                    "data": null,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var selLoadBalancer = $scope.selLoadBalancer && $scope.selLoadBalancer.lbID;
                        var selBox = "<div><tiny-radio id='id' text='' name='name' value='value' checked='checked' change='change()'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.name = "appCreateAppChooseLoadBalancerRadio";
                        selBoxScope.id = "appCreateAppChooseLoadBalancerRadio" + iDataIndex;
                        selBoxScope.value = aData.id;
                        if (selLoadBalancer && (selLoadBalancer === aData.lbID)) {
                            selBoxScope.checked = true;
                        } else {
                            selBoxScope.checked = false;
                        }
                        selBoxScope.change = function () {
                            $scope.selLoadBalancer = aData;
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryLoadBalancers();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        queryLoadBalancers();
                    }
                };

                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        //ICT的规格必须用名称而非ID
                        $scope.curParamTableData.value = $scope.selLoadBalancer.lbName;
                        $scope.curParamTableData.selectId = $scope.selLoadBalancer.lbID;
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

                function queryLoadBalancers() {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.resPoolId,
                        "vpcId": $scope.vpcId,
                        "limit": page.displayLength,
                        "start": page.getStart()
                    };
                    var promise = appCommonServiceIns.queryAvailableVlbTemp(options);
                    promise.then(function(data){
                        if (!data ||data.total===0 ||!data.lbInfos) {
                            return;
                        }
                        var loadBalancer = [];
                        _.each(data.lbInfos,function(item,index){
                            if ($scope.curParamTableData.selectId) {
                                if ($scope.curParamTableData.selectId === item.lbID) {
                                    $scope.selLoadBalancer = item;
                                }
                            } else {
                                if (index === 0) {
                                    $scope.selLoadBalancer = item;
                                }
                            }
                            loadBalancer.push(item);
                        });
                        $scope.loadBalancerTable.data = loadBalancer;
                        $scope.loadBalancerTable.displayLength = page.displayLength;
                        $scope.loadBalancerTable.totalRecords = data.total;
                    });
                }
                queryLoadBalancers();
            }
        ];
        var selVLBModule = angular.module("app.createByOpenstack.selLoadBalancer", ['framework', 'ngSanitize']);
        selVLBModule.controller("app.createByOpenstack.selLoadBalancer.ctrl", configParamCtrl1);
        selVLBModule.service("camel", http);

        return selVLBModule;
    });
