/**
 * 文件名：updateVmNodeCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：应用topo--更新虚拟机的control
 * 修改时间：14-6-16
 */
define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'app/services/httpService',
    'app/services/exceptionService',
    'app/business/application/services/appCommonService',
    "app/business/ecs/services/vm/updateVmService",
    'tiny-directives/Radio',
    'tiny-directives/RadioGroup',
    'tiny-directives/Select'
], function (sprintf, $, encoder, angular, ngSanitize, keyIDI18n, http, exception, appCommonService, updateVmService) {
    "use strict";

    var updateVmCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 公共参数和服务
            var winParam = $("#vmNodeUpdateWinId").widget().option("winParam") || {};
            var user = $("html").scope().user || {};
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var updateVmServiceIns = new updateVmService(exception, $q, camel);
            var vpcId = "-1";

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

            $scope.label = {
                "selectTemplate": i18n.vm_term_chooseTemplate_label+":"
            };

            $scope.templates = {
                "id": "appTopoUpdateVmNodeTemplates",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "columns": [{
                    "sTitle": "",
                    "mData": "id",
                    "sWidth": "30px",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle":i18n.common_term_name_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vmtName);
                    }
                }, {
                    "sTitle": i18n.common_term_OStype_label,
                    "sWidth": "15%",
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osType);
                    }
                }, {
                    "sTitle": i18n.common_term_OSversion_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osVersion);
                    }
                }, {
                    "sTitle": i18n.common_term_desc_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    }
                }],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.getTemplates();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.operate.getTemplates();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();

                    //单选按钮
                    var selBox = "<div><tiny-radio id='id' name='name' value='value' change='change()'></tiny-radio></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.name = "appTopoUpateVmRadio";
                    selBoxScope.id = "appTopoUpateVmRadioId" + iDataIndex;
                    selBoxScope.value = aData.vmtId;
                    selBoxScope.change = function () {
                        $scope.okBtn.disable = false;
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "appTopoUpdateVmNodeOK",
                "text": i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    var options = {
                        "user": user,
                        "vmId": winParam.vmId,
                        "cloudInfraId": winParam.cloudInfraId,
                        "vpcId": vpcId,
                        "repairOs": {
                            "vmTemplateId": $("#appTopoUpateVmRadioId0").widget().opChecked()
                        }
                    };
                    var deferred = updateVmServiceIns.repairVm(options);
                    deferred.then(function (data) {
                        $("#vmNodeUpdateWinId").widget().destroy();
                    });
                }
            };

            $scope.cancelBtn = {
                "id": "appTopoUpdateVmNodeCancel",
                "text":i18n.common_term_cancle_button,
                "click": function () {
                    $("#vmNodeUpdateWinId").widget().destroy();
                }
            };

            $scope.operate = {
                "getTemplates": function () {
                    var options = {
                        "user": user,
                        "params": {
                            "cloud-infra": winParam.cloudInfraId,
                            "ostype": winParam.ostype,
                            "status": "FINISHED",
                            "start": page.getStart(),
                            "limit": page.displayLength
                        }
                    };
                    var deferred = appCommonServiceIns.queryVmTemplates(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        $scope.templates.data = data.vmtemplates;
                        $scope.templates.displayLength = page.displayLength;
                        $scope.templates.totalRecords = data.totalNum;
                        //$("#" + $scope.templates.id).widget().option("cur-page", {"pageIndex": page.currentPage});

                        // 清空已选
                        $scope.okBtn.disable = true;
                        var radio = $("#appTopoUpateVmRadioId0").widget();
                        if (radio) {
                            radio.option("checked", false);
                        }
                    });
                }
            };

            function init() {
                $scope.operate.getTemplates();
            }

            //获取初始数据
            init();
        }
    ];

    var updateVmModule = angular.module("app.instance.topo.updateVmNode", ['ng', 'wcc', "ngSanitize"]);
    updateVmModule.controller("app.instance.topo.updateVmNode.ctrl", updateVmCtrl);
    updateVmModule.service("camel", http);
    updateVmModule.service("exception", exception);

    return updateVmModule;
});
