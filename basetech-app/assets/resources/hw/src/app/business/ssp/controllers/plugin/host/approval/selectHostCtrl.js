/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    'language/keyID',
    'tiny-lib/underscore',
    'app/services/httpService',
    "app/services/exceptionService",
    "app/business/ssp/services/plugin/host/hostService",
    "tiny-widgets/Checkbox"
], function ($, angular,sprintf, ngSanitize, keyIDI18n, _, http, exception, hostService, Checkbox) {
    "use strict";

    var selectHostCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 父窗口传递的参数
            var winParam = $("#sspApprovalHostSelectHostWin").widget().option("winParam") || {};
            var user = $("html").scope().user;
            var hostServiceIns = new hostService(exception, $q, camel);
            var selectedHost = [];

            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            $scope.searchString = "";
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            //查询条件
            var condition = {
                "user-id": user.id,
                "order-id": "",
                "search_input": "",
                "status": "",
                "type": "",
                "start": "0",
                "limit": "10"
            };

            $scope.searchBox = {
                "id": "sspApplyHostSelectSearchBox",
                "placeholder": i18n.service_term_findApplyNumServiceName_prom,
                "width": "300",
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchString = $("#" + $scope.searchBox.id).widget().getValue();
                    page.currentPage = 1;
                    queryHost();
                }
            };

            $scope.hosts = {
                "id": "sspApplyHostSelectHosts",
                "paginationStyle": "full_numbers",
                "lengthMenu": [10, 20, 30],
                "displayLength": 10,
                "totalRecords": 0,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": null,
                        "bSortable": false,
                        "sWidth": "60px"
                    },
                    {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": i18n.device_term_model_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.model);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_specHardware_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hardwareSpec);
                        }
                    },
                    {
                        "sTitle": i18n.common_term_OS_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        }
                    },
                    {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osIp);
                        }
                    }
                ],
                "data": [],
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryHost();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    queryHost();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //tips提示
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();

                    // 复选框
                    var selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "selectHostCheckboxId" + iDataIndex;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        selectHost(aData,  $("#" + selBoxScope.id).widget().option("checked"));
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).append(selBoxNode);
                }
            };

            $scope.okBtn = {
                "id": "sspApplyHostSelectHostOK",
                "text": i18n.common_term_ok_button,
                "click": function () {
                    winParam.selectedHost = selectedHost;
                    $("#sspApprovalHostSelectHostWin").widget().destroy();
                }
            };

            $scope.cancelBtn = {
                "id": "sspApplyHostSelectHostCancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    $("#sspApprovalHostSelectHostWin").widget().destroy();
                }
            };

            // 勾选、去勾选虚拟机
            function selectHost(aData, checked) {
                if (checked) {
                    selectedHost.push(aData);
                } else {
                    for (var i = 0; i < selectedHost.length; i++) {
                        if (selectedHost[i].id === aData.id) {
                            selectedHost.splice(i, 1);
                        }
                    }
                }

                var headCheck = $("#hostTableHeadCheckbox").widget();
                if (headCheck) {
                    if (selectedHost.length < $scope.hosts.data.length) {
                        headCheck.option("checked", false);
                    } else {
                        headCheck.option("checked", true);
                    }
                }
            }

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "hostTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var isChecked = $("#hostTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < $scope.hosts.data.length; i++) {
                        $("#selectHostCheckboxId" + i).widget().option("checked", isChecked);
                    }

                    if (isChecked) {
                        selectedHost = $scope.hosts.data.concat();
                    } else {
                        selectedHost = [];
                    }
                }
            });

            // 查询物理列表信息
            function queryHost() {
                if (!winParam.cloudInfraId || !winParam.azId) {
                    return;
                }
                var options = {
                    "user": user,
                    "cloudInfraId": winParam.cloudInfraId,
                    "azId": winParam.azId,
                    "param":{
                        "state":"unassigned",
                        "start": page.getStart(),
                        "limit": page.displayLength,
                        "search_input":$scope.searchString
                    }
                };
                var deferred = hostServiceIns.queryHosts(options);
                deferred.then(function (data) {

                    $scope.hosts.data = data.servers;
                    $scope.hosts.displayLength = page.displayLength;
                    $scope.hosts.totalRecords = data.total;
                    $("#" + $scope.hosts.id).widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });

                    //将checkbox放在表头处，在这里放是因为上面设置totalRecords或cur-page后，会将表头的checkbox清掉
                    setTimeout(function(){
                        $scope.$apply(function(){
                            selectedHost = [];
                            tblHeadCheckbox.option("checked", false);
                            $('#sspApplyHostSelectHosts th:eq(0)').html(tblHeadCheckbox.getDom());
                        });
                    }, 20);
                });
            }

            // 查询初始信息
            queryHost();
        }
    ];

    var selectHostModule = angular.module("ssp.plugin.applyHost.selectHost", ['ng',"wcc","ngSanitize"]);
    selectHostModule.controller("ssp.plugin.applyHost.selectHost.ctrl", selectHostCtrl);
    selectHostModule.service("camel", http);
    selectHostModule.service("exception", exception);

    return selectHostModule;
});
