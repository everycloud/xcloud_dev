/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-lib/encoder',
    'sprintf',
    'tiny-lib/angular-sanitize.min',
    "language/keyID",
    "app/services/httpService",
    "app/business/tenantUser/service/userCommonService",
    "app/services/messageService",
    "app/business/tenantUser/service/userDomainService",
    "app/services/commonService",
    "tiny-widgets/Checkbox",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "fixtures/userFixture"],
    function ($, angular, encoder, sprintf, ngSanitize, keyIDI18n, httpService, UserCommonService, MessageService, userDomainService, commonService, Checkbox) {
        "use strict";

        var addVMCtrl = ["$scope", "$compile", "camel", "$q",
            function ($scope, $compile, camel, $q) {
                var user = $("html").scope().user;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                $scope.cloudInfraId = $("#addVMWindowId").widget().option("cloudInfraId");
                $scope.domainId = $("#addVMWindowId").widget().option("domainId");
                $scope.exception = $("#addVMWindowId").widget().option("exception");
                $scope.serviceInstance = new userDomainService($scope.exception, $q, camel);
                $scope.memberSelectModel = {
                    "canSelectMemberLabel": i18n.common_term_waitChoose_value,
                    "memberSelectedLabel": i18n.common_term_choosed_value
                };
                var DEFAULT_PAGE_NUM = commonService.DEFAULT_TABLE_PAGE_LENGTH;
                var showVMs = [];
                var selectedVMs = [];
                var idPrefix = "canSelectedVMId_";
                var tblHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = showVMs;
                        var checkedAll = tblHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = idPrefix + list[i].feId;
                            //防止id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                var checked = $(dom).widget().option("checked");
                                if (checked !== checkedAll) {
                                    $(dom).widget().option("checked", checkedAll);
                                    selectVM(list[i], checkedAll, true);
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightTable.data = $.extend([], selectedVMs);
                        });
                    }
                });
                var ifChecked = function (id) {
                    //分号，这儿的id中包含特殊字符冒号：美刀$，需要注意一下
                    var SPER = ";";
                    var selectedIds = [];
                    for (var j = 0, selectedLen = selectedVMs.length; j < selectedLen; j++) {
                        selectedIds.push(selectedVMs[j].id);
                    }
                    var selectedIdsStr = SPER + selectedIds.join(SPER) + SPER;
                    if (-1 === selectedIdsStr.indexOf(SPER + id + SPER)) {
                        return false;
                    }
                    return true;
                };
                var ifAllChecked = function (list) {
                    var len = list && list.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (!ifChecked(list[i].id)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                };
                var renderTbHeaderCheckbox = function (list) {
                    var allChecked = ifAllChecked(list);
                    tblHeaderCheckbox.option("checked", allChecked);
                    tblHeaderCheckbox.rendTo($("#tableHeaderCheckbox"));
                };
                var selectVM = function (vm, checked, disableChange) {
                    if (checked) {
                        selectedVMs.push(vm);
                    } else {
                        for (var i = 0, len = selectedVMs.length; i < len; i++) {
                            if (selectedVMs[i].id === vm.id) {
                                selectedVMs.splice(i, 1);
                                var dom = document.getElementById(idPrefix + vm.feId);
                                dom && $(dom).widget().option("checked", false);
                                break;
                            }
                        }
                    }
                    var allChecked = ifAllChecked(showVMs);
                    tblHeaderCheckbox.option("checked", allChecked);
                    $scope.addVMSaveBtn.disable = !selectedVMs.length;
                    if (!disableChange) {
                        $scope.rightTable.data = $.extend([], selectedVMs);
                    }
                };

                //搜索框
                $scope.leftVMSearchBox = {
                    "id": "leftVMSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {
                    },
                    "search": function (searchString) {
                        $scope.searchModel.name = searchString;
                        $scope.operator.initCanSelectVM();
                    }
                };
                $scope.leftTable = {
                    "id": "addVMLeftTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": "<div id='tableHeaderCheckbox'></div>",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": "check",
                            "sClass": "check",
                            "sWidth": 26
                        },
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "simple",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": DEFAULT_PAGE_NUM,
                    "hideTotalRecords": false,
                    "showDetails": false,
                    "renderRow": function (row, dataitem, index) {
                        var vmId = dataitem.feId;
                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                            "<tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox>" +
                            "</div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = dataitem;
                        selBoxScope.id = idPrefix + vmId;
                        selBoxScope.checked = ifChecked(vmId);
                        selBoxScope.change = function () {
                            //vmId 中包含jq selector的关键字，不能是解使用jq后去dom
                            var dom = document.getElementById(idPrefix + vmId);
                            var checked = $(dom).widget().option("checked");
                            selectVM(dataitem, checked);

                            var allChecked = ifAllChecked(showVMs);
                            tblHeaderCheckbox.option("checked", allChecked);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td.check", row).append(selBoxNode);
                    },
                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.initCanSelectVM();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.initCanSelectVM();
                    }
                };
                $scope.rightTable = {
                    "id": "addVMRightTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "",
                            "bSortable": false,
                            "sClass": "del",
                            "sWidth": 100
                        }
                    ],
                    "pagination": false,
                    "renderRow": function (row, dataitem, index) {
                        var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + (i18n.common_term_delete_button || "删除") + "</a>";
                        var compiledDelTemplate = $compile(delTemplate);
                        var delDomScope = $scope.$new();
                        delDomScope.remove = function () {
                            selectVM(dataitem, false);
                        };
                        var delDom = compiledDelTemplate(delDomScope);
                        $("td.del", row).append(delDom);
                    }
                };

                //添加按钮
                $scope.addVMSaveBtn = {
                    "id": "addVMSaveBtnId",
                    "text": i18n.common_term_save_label,
                    "disable": true,
                    "click": function () {
                        $scope.operator.addVMToDomain();
                    }
                };
                //取消按钮
                $scope.addVMCancelBtn = {
                    "id": "addVMCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#addVMWindowId").widget().destroy();
                    }
                };
                $scope.searchModel = {
                    "start": 0,
                    "limit": DEFAULT_PAGE_NUM,
                    "name": ""
                };

                $scope.operator = {
                    "initCanSelectVM": function () {
                        var params = {
                            "list": {
                                "start": $scope.searchModel.start,
                                "limit": $scope.searchModel.limit,
                                "domainId": "null",
                                "name": $scope.searchModel.name
                            }
                        };
                        var promise = $scope.serviceInstance.queryVmList({
                            "user": user,
                            "params": params,
                            "vpcId": "-1",
                            "cloudInfraId": $scope.cloudInfraId
                        });
                        promise.then(function (response) {
                            if (!response || !response.list) {
                                return;
                            }
                            showVMs = [];
                            var vmList = response.list.vms;
                            if(vmList){
                                var len = vmList.length;
                                for (var i = 0; i < len; i++) {
                                    vmList[i].feId = i;
                                    showVMs.push(vmList[i]);
                                }
                            }
                            $scope.$apply(function () {
                                $scope.leftTable.data = showVMs;
                                $scope.leftTable.totalRecords = response.list.total;
                            });
                            renderTbHeaderCheckbox(showVMs);
                        });
                    },
                    "addVMToDomain": function () {
                        var vmIDs = [];
                        if (selectedVMs.length !== 0) {
                            for (var i = 0; i < selectedVMs.length; i++) {
                                vmIDs.push(selectedVMs[i].id);
                            }
                        }
                        var options = {
                            "user": user,
                            "cloudInfraId": $scope.cloudInfraId,
                            "vpcId": "-1",
                            "domain": {
                                "vmIds": vmIDs,
                                "inDomainId": $scope.domainId
                            }
                        };
                        var promise = $scope.serviceInstance.operateVM(options);
                        promise.then(function (response) {
                            $("#addVMWindowId").widget().destroy();
                        });
                    }
                };

                // 初始化成员列表
                $scope.operator.initCanSelectVM();
            }
        ];

        var dependency = ["ng", "wcc", "ngSanitize"];
        var app = angular.module("userMgr.domain.addVMCtrl", dependency);
        app.controller("userMgr.domain.addVMCtrl.ctrl", addVMCtrl);
        app.service("camel", httpService);
        return app;
    });
