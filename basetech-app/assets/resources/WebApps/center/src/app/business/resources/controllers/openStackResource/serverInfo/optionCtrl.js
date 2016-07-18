/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "app/services/messageService"
], function ($, angular, Message,UnifyValid, ExceptionService,MessageService) {
    "use strict";

    var optionCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var user = $("html").scope().user;
        $scope.opActive();
        $scope.vmName = $stateParams.vmName;
        $scope.vmId = $stateParams.vmId;
        $scope.curOption = "startMethod";

        var exceptionService = new ExceptionService();
        var novaId = $stateParams.novaId;
        var region = $stateParams.region;
        var tokenId;
        var projectId;

        var options = [
            {
                "option": $scope.i18n.common_term_startupMode_label,
                "id": "startMethod"
            }
        ];
        //选项列表
        $scope.optionTable = {
            "id": "vmInfoOptionTable",
            "data": options,
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_option_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.option);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {

            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).click(function () {
                    $scope.$apply(function () {
                        $scope.curOption = aData.id;
                    });
                });
                if (iDataIndex == 0) {
                    $(nRow).addClass("clickTrColor");
                }
            }
        };

        $scope.optionUrl = {
            "startMethod": "../src/app/business/resources/views/openStackResource/serverInfo/optionStartMethod.html"
        };

        //启动方式页面
        //启动方式下拉框
        $scope.startMethodSelector = {
            "id": "startMethodSelector",
            "width": "200",
            "values": [
                {
                    "selectId": "hd",
                    "label": $scope.i18n.template_term_startFromHarddisk_label
                },
                {
                    "selectId": "network",
                    "label":  $scope.i18n.template_term_startFromNet_label
                }
            ]
        };
        //启动方式确定按钮
        $scope.startMethodOkButton = {
            "id": "optionStartMethodButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                operator("setStartMode");
            }
        };

        // 设置启动方式
        function setStartMode() {
            var bootDev = $("#" + $scope.startMethodSelector.id).widget().getSelectedId();

            bootDev = bootDev === "hd"?["hd","network"]:["network","hd"];
            var para = {
                "metadata":{
                    "__bootDev":bootDev
                }
            };
            var deferred = camel.post({
                url: {
                    s: "/goku/rest/v1.5/openstack/{redirect_address_value}/v2/{tenant_id}/servers/{server_id}/metadata",
                    o: {redirect_address_value: novaId, tenant_id: projectId, server_id: $scope.vmId}
                },
                "params": JSON.stringify(para),
                "userId": user.id,
                "token":tokenId
            });
            deferred.success(function (data) {
                new MessageService().okMsgBox($scope.i18n.common_term_modifySucceed_value);
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        // 初始化启动方式
        function getStartMode() {
            var deferred = camel.get({
                url: {
                    s: "/goku/rest/v1.5/openstack/{redirect_address_value}/v2/{tenant_id}/servers/{server_id}/metadata/__bootDev",
                    o: {redirect_address_value: novaId, tenant_id: projectId, server_id: $scope.vmId}
                },
                "userId": user.id,
                "token":tokenId
            });
            deferred.success(function (data) {
                var bootDev = data && data.meta && data.meta.__bootDev|| "";
                bootDev = bootDev.split(",");
                if(bootDev.length > 1){
                    bootDev = bootDev[0];
                    bootDev = bootDev.substring(1);
                }
                else{
                    bootDev = bootDev[0];
                }
                $scope.$apply(function () {
                    $("#" + $scope.startMethodSelector.id).widget().opChecked(bootDev);
                });
            });
            deferred.fail(function (data) {
                //不用抛出异常
            });
        }

        function operator(method) {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data === undefined) {
                    return;
                }
                tokenId = data.id;
                projectId = data.projectId;
                if(method === "setStartMode"){
                    setStartMode();
                }
                else if(method === "getStartMode"){
                    getStartMode();
                }
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        operator("getStartMode");
    }];
    return optionCtrl;
});
