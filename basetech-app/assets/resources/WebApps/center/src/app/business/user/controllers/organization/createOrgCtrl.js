/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/orgService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "app/services/competitionConfig",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup",
    "tiny-directives/CheckboxGroup",
    "tiny-directives/FilterSelect",
    "fixtures/userFixture"
],
    function ($, _, angular, http, OrgService, ExceptionService, MessageService, commonService,Competition, UnifyValid, Window, Checkbox, Select) {
        "use strict";
        var createOrgCtrl = ["$scope", "$q", "camel", "$state", "validator", "$compile",
            function ($scope, $q, camel, $state, validator, $compile) {
                var user = $scope.user;
                var i18n = $scope.i18n;
                var ALL_NETWORK = 0;
                var $stepWidget = null;
                var vdcListState = "vdcMgr.vdc.vdcList";
                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.orgService = new OrgService();
                $scope.roleList = [];
                $scope.Competition = Competition;

                $scope.stepUrl = {
                    "step1": "../src/app/business/user/views/organization/createOrgBasicInfo.html",
                    "step2": "../src/app/business/user/views/organization/createOrgRangeInfo.html",
                    "stepNetwork": "../src/app/business/user/views/organization/createOrgNetworkInfo.html",
                    "step3": "../src/app/business/user/views/organization/createOrgMemberInfo.html",
                    "step4": "../src/app/business/user/views/organization/createOrgConfirmInfo.html"
                };
                $scope.stepShow = {
                    "step1": true,
                    "step2": false,
                    "stepNetwork": false,
                    "step3": false,
                    "step4": false
                };

                var stepValues = [
                    i18n.common_term_basicInfo_label || "基本信息",
                    $scope.openstack ? (i18n.cloud_term_cloudPool_label || "云资源池") : (i18n.resource_term_AZ_label || "可用分区"),
                    i18n.vpc_term_nets_label || "网络",
                    i18n.org_term_vdcMember_label || "VDC成员",
                    i18n.common_term_confirmInfo_label || "确认信息"
                ];

                if ($scope.openstack) {
                    stepValues.splice(2, 1);//去掉网络部分
                    stepValues.splice(2, 1);//去掉VDC成员
                }

                $scope.addStep = {
                    "id": "createOrgStep",
                    "values": stepValues,
                    "width": "600",
                    "jumpable": false
                };


                $scope.orgQuotaInfo = {
                    labelwidth: window.urlParams.lang === "zh" ? "90px" : "122px"
                };
                $scope.orgRangeInfo = {
                    labelwidth: window.urlParams.lang === "zh" ? "80px" : "145px"
                };

                $scope.cancelBtn = {
                    "id": "createOrgCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go(vdcListState);
                    }
                };


                // 基本信息页面内容 basic info
                $scope.name = {
                    "id": "createOrgNameId",
                    "label": i18n.org_term_vdcName_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "tooltip": validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(64):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "64"}) +
                        ";regularCheck(" + validator.vdcNameReg + "):" + $scope.i18n.common_term_composition2_valid
                };
                $scope.quotaNotLimit = true;
                $scope.quotaLimit = {
                    "id": "quotaLimitId",
                    "label": i18n.common_term_quotaLimit_label + ":",
                    "values": [
                        {
                            "key": "noLimit",
                            "text": i18n.common_term_notLimit_value,
                            "checked": true
                        },
                        {
                            "key": "limit",
                            "text": i18n.common_term_limit_label,
                            "checked": false
                        }
                    ],
                    "change": function () {
                        var checked = $("#" + $scope.quotaLimit.id).widget().opChecked("checked");
                        if ("noLimit" == checked) {
                            $scope.quotaNotLimit = true;
                        }
                        else if ("limit" == checked) {
                            $scope.quotaNotLimit = false;
                        }
                    }
                };
                $scope.cpuNumber = {
                    "id": "cpuNumberId",
                    "label": i18n.common_term_vcpuNum_label + ":",
                    "require": true,
                    "value": "100",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 80000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 80000) +
                        ";maxValue(80000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 80000)
                };
                $scope.memoryUpperLimit = {
                    "id": "memoryUpperLimitId",
                    "label": i18n.common_term_memoryMB_label + ":",
                    "require": true,
                    "value": "81920",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000) +
                        ";maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000)
                };
                $scope.storage = {
                    "id": "storageId",
                    "label": i18n.common_term_storageGB_label + ":",
                    "require": true,
                    "value": "500",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 512000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 512000) +
                        ";maxValue(512000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 512000)
                };
                $scope.eipNumber = {
                    "id": "eipNumberId",
                    "label": i18n.eip_term_eipNum_label + ":",
                    "require": true,
                    "value": Competition.isBaseOnVmware?"50":"5",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 4000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 4000) +
                        ";maxValue(4000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 4000)
                };
                $scope.vpcNumber = {
                    "id": "vpcNumberId",
                    "label": i18n.vpc_term_vpcNum_label + ":",
                    "require": true,
                    "value": "2",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 20),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 20) +
                        ";maxValue(20):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 20)
                };
                $scope.sgNumber = {
                    "id": "sgNumberId",
                    "label": i18n.org_term_secuGroupNum_label + ":",
                    "require": true,
                    "value": "10",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000) +
                        ";maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000)
                };
                $scope.vmNumber = {
                    "id": "vmNumberId",
                    "label": i18n.vm_term_vmNum_label + ":",
                    "require": true,
                    "value": "10",
                    "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000),
                    "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000) +
                        ";maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 10000)
                };

                $scope.createTime = {
                    "id": "createOrgCreateTimeId",
                    "value": "",
                    "type": "input",
                    "readonly": false
                };
                $scope.description = {
                    "id": "createOrgDescId",
                    "label": i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + i18n.sprintf(i18n.common_term_maxLength_valid, {1: 128})
                };

                //下一步按钮
                $scope.basicInfoNextBtn = {
                    "id": "basicInfoNextBtnId",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        if (UnifyValid.FormValid($("#createOrgBasicInfo"))) {
                            $stepWidget = $("#" + $scope.addStep.id).widget();
                            $stepWidget.next();
                            $scope.stepShow.step1 = false;
                            $scope.stepShow.step2 = true;

                            if ($scope.openstack) {
                                $scope.operator.initCanSelectCloudInfras();
                            } else {
                                $scope.operator.initRange();
                            }

                            $scope.name.value = $("#" + $scope.name.id).widget().getValue();
                            $scope.description.value = $("#" + $scope.description.id).widget().getValue();
                            if (!$scope.quotaNotLimit) {
                                $scope.cpuNumber.value = parseInt($("#" + $scope.cpuNumber.id).widget().getValue());
                                $scope.memoryUpperLimit.value = parseInt($("#" + $scope.memoryUpperLimit.id).widget().getValue());
                                $scope.storage.value = parseInt($("#" + $scope.storage.id).widget().getValue());
                                $scope.eipNumber.value = parseInt($("#" + $scope.eipNumber.id).widget().getValue());
                                $scope.vpcNumber.value = parseInt($("#" + $scope.vpcNumber.id).widget().getValue());
                                $scope.sgNumber.value = parseInt($("#" + $scope.sgNumber.id).widget().getValue());
                                $scope.vmNumber.value = parseInt($("#" + $scope.vmNumber.id).widget().getValue());
                            }
                        }
                    }
                };


                // az info | cloud-infras
                $scope.rangeSelectModel = {
                    "rangeSelectLabel": ($scope.openstack ? i18n.vpc_term_chooseCloudPool_label : i18n.org_term_chooseAZ_label) + ":",
                    "canSelectRangeLabel": i18n.common_term_waitChoose_value,
                    "rangeSelectedLabel": i18n.common_term_choosed_value
                };

                $scope.leftRangeSearchBox = {
                    "id": "leftRangeSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.operator.initRange(searchString);
                    }
                };

                $scope.canSelectRange = {
                    "height": "28px",
                    list: []
                };
                $scope.selectedRange = {
                    "height": "28px",
                    width: "100px",
                    list: []
                };

                $scope.selectRangeLeftBtn = {
                    "click": function () {
                        var azList = $scope.canSelectRange.list;
                        var len = azList.length;
                        for (var index = len - 1; index >= 0; index--) {
                            if ($("#" + azList[index].id).widget().option("checked")) {
                                if (!$scope.orgService.isExist(azList[index], $scope.selectedRange.list)) {
                                    $scope.selectedRange.list.push(azList[index]);
                                }
                                azList.splice(index, 1);
                            }
                        }
                    }
                };
                $scope.selectRangeRightBtn = {
                    "click": function () {
                        var azList = $scope.selectedRange.list;
                        var len = azList.length;
                        for (var index = len - 1; index >= 0; index--) {
                            if ($("#" + azList[index].id).widget().option("checked")) {
                                if (!$scope.orgService.isExist(azList[index], $scope.canSelectRange.list)) {
                                    $scope.canSelectRange.list.push(azList[index]);
                                }
                                azList.splice(index, 1);
                            }
                        }
                    }
                };

                //上一步按钮
                $scope.rangeInfoPreBtn = {
                    "id": "rangeInfoPreBtnId",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $stepWidget.pre();
                        $scope.stepShow.step1 = true;
                        $scope.stepShow.step2 = false;
                    }
                };
                //下一步按钮
                $scope.rangeInfoNextBtn = {
                    "id": "rangeInfoNextBtnId",
                    "disable": false,
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        // 给确认页面的az列表赋值
                        var list = $scope.selectedRange.list;
                        var range = commonService.pick(list, "name");
                        $scope.rangeSelected.value = range.join(";");

                        $stepWidget.next();
                        $scope.stepShow.step2 = false;
                        if ($scope.openstack) {
                            //去掉vdc member
                            $scope.stepShow.step4 = true
                        } else {
                            $scope.stepShow.stepNetwork = true;
                            initNetwork(list);
                        }
                    }
                };

                function initNetwork(rangeList) {
                    var rangeValues = [];
                    var hasChecked = false;
                    var selectedId = $scope.searchNetworkFilterId;
                    for (var i = 0, len = rangeList.length; i < len; i++) {
                        var item = rangeList[i];
                        var checked = item.id === selectedId;
                        checked && (hasChecked = true);
                        rangeValues.push({
                            selectId: item.id,
                            label: item.name,
                            checked: checked
                        });
                    }
                    selectedNetworks = [];
                    showNetworks = [];
                    $scope.leftNetworkTable.data = [];
                    $scope.rightNetworkTable.data = [];
                    if (rangeValues && rangeValues.length) {
                        if (!hasChecked) {
                            rangeValues[0].checked = true;
                            $scope.searchNetworkFilterId = rangeValues[0].selectId;
                        }
                        $scope.rangeFilter.values = rangeValues;
                        $scope.networkRange.values = [
                            {
                                "key": ALL_NETWORK,
                                "text": i18n.common_term_all_label || "全部",
                                "checked": true
                            },
                            {
                                "key": "2",
                                "text": i18n.common_term_designation_label || "指定",
                                "checked": false
                            }
                        ];
                    } else {
                        $scope.networkRange.values = [
                            {
                                "key": ALL_NETWORK,
                                "text": i18n.common_term_all_label || "全部",
                                "checked": true
                            },
                            {
                                "key": "2",
                                "text": i18n.common_term_designation_label || "指定",
                                "checked": false,
                                "disable": true
                            }
                        ];
                    }
                    $scope.choiceNetwork = false;
                    $("#networkTables").css({
                        position: "absolute",
                        top: "-5000px",
                        left: "-5000px"
                    });
                }


                //network info
                var showNetworks = [];
                var selectedNetworks = [];

                var networkIdPrefix = "canSelectedNetworkID_";
                var networkTbHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = showNetworks;
                        var checkedAll = networkTbHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = networkIdPrefix + list[i].id;
                            //防止id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                var checked = $(dom).widget().option("checked");
                                if (checked !== checkedAll && list[i].id !== user.id) {
                                    $(dom).widget().option("checked", checkedAll);
                                    selectNetwork(list[i], checkedAll, true);
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightNetworkTable.data = $.extend([], selectedNetworks);
                        });
                    }
                });
                var ifNetworkChecked = function (id) {
                    var SPER = ";";
                    var selectedIds = [];
                    for (var j = 0, selectedLen = selectedNetworks.length; j < selectedLen; j++) {
                        selectedIds.push(selectedNetworks[j].id);
                    }
                    var selectedIdsStr = SPER + selectedIds.join(SPER) + SPER;
                    if (-1 === selectedIdsStr.indexOf(SPER + id + SPER)) {
                        return false;
                    }
                    return true;
                };
                var ifAllNetworkChecked = function (list) {
                    var len = list && list.length;
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            if (list[i].id !== user.id && !ifNetworkChecked(list[i].id)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                };
                var renderNetworkTbHeaderCheckbox = function (list) {
                    var allChecked = ifAllNetworkChecked(list);
                    networkTbHeaderCheckbox.option("checked", allChecked);
                    networkTbHeaderCheckbox.rendTo($("#networkTableHeaderCheckbox"));
                };
                var selectNetwork = function (network, checked, disableChange) {
                    if (checked) {
                        network.id !== user.id && selectedNetworks.push(network);
                    } else {
                        for (var i = 0, len = selectedNetworks.length; i < len; i++) {
                            if (selectedNetworks[i].id === network.id) {
                                selectedNetworks.splice(i, 1);
                                var dom = document.getElementById(networkIdPrefix + network.id);
                                dom && $(dom).widget().option("checked", false);
                                break;
                            }
                        }
                    }
                    var allChecked = ifAllNetworkChecked(showNetworks);
                    networkTbHeaderCheckbox.option("checked", allChecked);
                    if (!disableChange) {
                        $scope.rightNetworkTable.data = $.extend([], selectedNetworks);
                    }
                };

                $scope.networkRange = {
                    "id": "vdcRangeId",
                    "label": "",
                    "spacing": {
                        "width": "100px",
                        "height": "30px"
                    },
                    "values": [],
                    "layout": "horizon",
                    "change": function () {
                        var selectedId = $("#" + $scope.networkRange.id).widget().opChecked("checked");
                        $scope.choiceNetwork = selectedId != ALL_NETWORK;
                        if ($scope.choiceNetwork) {
                            $("#networkTables").css({
                                position: "static"
                            });
                        } else {
                            $("#networkTables").css({
                                position: "absolute",
                                top: "-5000px",
                                left: "-5000px"
                            });
                        }
                        if ($scope.choiceNetwork && showNetworks.length == 0) {
                            $scope.operator.getNetworks();
                        }
                    }
                };

                $scope.networkSelectModel = {
                    "networkSelectLabel": (i18n.router_term_chooseExterNet_label || "选择外部网络") + ":",
                    "canSelectNetworkLabel": i18n.common_term_waitChoose_value || "待选择",
                    "networkSelectedLabel": i18n.common_term_choosed_value || "已选择"
                };
                $scope.leftNetworkSearchBox = {
                    "id": "leftNetworkSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.searchNetworkModel.start = 0;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.canSelectNetwork = {
                    "height": "28px",
                    networkList: []
                };
                $scope.selectedNetwork = {
                    "height": "28px",
                    checkboxWidth: "100px",
                    selectWidth: "160px",
                    selectMode: "multiple",
                    networkList: []
                };
                $scope.rangeFilter = {
                    id: "cloudInfrasFilterId",
                    label: ($scope.openstack ? (i18n.cloud_term_cloudPool_label || "云资源池" ) : (i18n.resource_term_AZ_label || "可用分区" )) + ":",
                    values: [],
                    change: function () {
                        var selectedId = $("#" + $scope.rangeFilter.id).widget().getSelectedId();
                        $scope.searchNetworkFilterId = selectedId;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.searchNetworkModel = {
                    "start": 0,
                    "limit": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "cloud-infras": "",
                    "az-id": "",
                    "vpcid": "",
                    "usedbyrouter": false,
                    "usedbyvxlanrouter": false,
                    "isAssociated": false
                };
                $scope.leftNetworkTable = {
                    "id": "addNetworkLeftTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": "<div id='networkTableHeaderCheckbox'></div>",
                            "bSortable": false,
                            "bSearchable": false,
                            "mData": "check",
                            "sClass": "networkCheck",
                            "sWidth": 26
                        },
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": "VLAN ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vlans.join(";"));
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_SubnetIP_label || "子网IP地址",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.subNet);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_desc_label || "描述",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "simple",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "hideTotalRecords": false,
                    "showDetails": false,
                    "renderRow": function (row, dataitem, index) {
                        var networkId = dataitem.id;

                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                            "<tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox>" +
                            "</div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = dataitem;
                        selBoxScope.id = networkIdPrefix + networkId;

                        selBoxScope.checked = ifNetworkChecked(networkId);
                        selBoxScope.change = function () {
                            var checked = $("#" + networkIdPrefix + networkId).widget().option("checked");
                            selectNetwork(dataitem, checked);

                            var allChecked = ifAllNetworkChecked(showNetworks);
                            networkTbHeaderCheckbox.option("checked", allChecked);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td.networkCheck", row).append(selBoxNode);
                    },

                    "callback": function (evtObj) {
                        $scope.searchNetworkModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchNetworkModel.limit = evtObj.displayLength;
                        $scope.operator.getNetworks();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchNetworkModel.start = 0;
                        $scope.searchNetworkModel.limit = evtObj.displayLength;
                        $scope.operator.getNetworks();
                    }
                };
                $scope.rightNetworkTable = {
                    "id": "addNetworkRightTableId",
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
                            "sWidth": 50
                        }
                    ],
                    "pagination": false,
                    "renderRow": function (row, dataitem, index) {
                        var deleteText = i18n.common_term_delete_button || "删除";
                        var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                        var compiledDelTemplate = $compile(delTemplate);
                        var delDomScope = $scope.$new();
                        delDomScope.remove = function () {
                            selectNetwork(dataitem, false);
                        };
                        var delDom = compiledDelTemplate(delDomScope);
                        $("td.del", row).append(delDom);
                    }
                };
                //上一步按钮
                $scope.networkInfoPreBtn = {
                    "id": "networkInfoPreBtnId",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $stepWidget.pre();
                        $scope.stepShow.stepNetwork = false;
                        $scope.stepShow.step2 = true;
                    }
                };
                //下一步按钮
                $scope.networkInfoNextBtn = {
                    "id": "networkInfoNextBtnId",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        if ($scope.choiceNetwork) {
                            var list = [];
                            var networks = [];
                            var cloudInfras = {};
                            var len = selectedNetworks.length;
                            if (!len) {
                                new MessageService().promptErrorMsgBox(i18n.org_vdc_add_para_externalNet_valid || "请至少指定一个外部网络");
                                return;
                            }
                            for (var index = 0; index < len; index++) {
                                var selectedNetwork = selectedNetworks[index];
                                var cloudInfrasId = selectedNetwork.cloudInfrasId;
                                var azId = selectedNetwork.azId;
                                var tempId = azId + "_" + cloudInfrasId;
                                !cloudInfras[tempId] && (cloudInfras[tempId] = {
                                    cloudInfrasId: cloudInfrasId,
                                    azId: azId,
                                    exNetworkIdList: []
                                });

                                var selectedNetworkId = selectedNetwork.id;
                                if (selectedNetworkId) {
                                    var ids = selectedNetworkId.split("_");
                                    if (ids && ids.length == 3) {
                                        cloudInfras[tempId].exNetworkIdList.push(ids[2]);
                                        networks.push(selectedNetwork.name);
                                    }
                                }
                            }
                            for (var p in cloudInfras) {
                                list.push(cloudInfras[p]);
                            }
                            $scope.networkInfo = {associates: !list.length ? null : list};
                            $scope.orgNetwork.value = networks.join(";");
                        } else {
                            $scope.networkInfo = {
                                associates: [
                                    {
                                        cloudInfrasId: -1,
                                        azId: -1,
                                        exNetworkIdList: [-1]
                                    }
                                ]};
                            $scope.orgNetwork.value = i18n.common_term_all_label || "全部";
                        }


                        $stepWidget.next();
                        $scope.stepShow.stepNetwork = false;
                        $scope.stepShow.step3 = true;

                        $scope.operator.initMember();
                    }
                };


                // VDC成员页面内容
                var roleValues = [];
                var showMembers = [];
                var selectedMembers = [];

                var searchKey = $scope.openstack ? "user-name" : "userName";
                var rolePrefix = "roleSelect_";
                var idPrefix = "canSelectedMemberID_";
                var tblHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = showMembers;
                        var checkedAll = tblHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = idPrefix + list[i].id;
                            //防止id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                var checked = $(dom).widget().option("checked");
                                if (checked !== checkedAll && list[i].id !== user.id) {
                                    $(dom).widget().option("checked", checkedAll);
                                    selectMember(list[i], checkedAll, true);
                                }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.rightTable.data = $.extend([], selectedMembers);
                        });
                    }
                });
                var ifChecked = function (id) {
                    var SPER = ";";
                    var selectedIds = [];
                    for (var j = 0, selectedLen = selectedMembers.length; j < selectedLen; j++) {
                        selectedIds.push(selectedMembers[j].id);
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
                            if (list[i].id !== user.id && !ifChecked(list[i].id)) {
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
                var selectMember = function (member, checked, disableChange) {
                    if (checked) {
                        member.id !== user.id && selectedMembers.push(member);
                    } else {
                        for (var i = 0, len = selectedMembers.length; i < len; i++) {
                            if (selectedMembers[i].id === member.id) {
                                selectedMembers.splice(i, 1);
                                var dom = document.getElementById(idPrefix + member.id);
                                dom && $(dom).widget().option("checked", false);
                                break;
                            }
                        }
                    }
                    var allChecked = ifAllChecked(showMembers);
                    tblHeaderCheckbox.option("checked", allChecked);
                    if (!disableChange) {
                        $scope.rightTable.data = $.extend([], selectedMembers);
                    }
                };
                $scope.memberSelectModel = {
                    "memberSelectLabel": (i18n.org_term_chooseVDCmember_label || "选择VDC成员") + ":",
                    "canSelectMemberLabel": i18n.common_term_waitChoose_value || "待选择",
                    "memberSelectedLabel": i18n.common_term_choosed_value || "已选择"
                };
                $scope.leftMemberSearchBox = {
                    "id": "leftMemberSearchBoxId",
                    "placeholder": "",
                    "width": "150px",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel[searchKey] = searchString;
                        $scope.operator.getMembers();
                    }
                };
                $scope.canSelectMember = {
                    "height": "28px",
                    memberList: []
                };
                $scope.selectedMember = {
                    "height": "28px",
                    checkboxWidth: "100px",
                    selectWidth: "160px",
                    selectMode: "multiple",
                    memberList: []
                };
                $scope.searchModel = {
                    start: 0,
                    limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    vdcId: $scope.openstack ? "-1" : user.orgId
                };
                $scope.leftTable = {
                    "id": "addMemberLeftTableId",
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
                            "sTitle": i18n.common_term_userName_label || "用户名",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_desc_label || "描述",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "pagination": true,
                    "paginationStyle": "simple",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "hideTotalRecords": false,
                    "showDetails": false,
                    "renderRow": function (row, dataitem, index) {
                        var memberId = dataitem.id;

                        var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                            "<tiny-checkbox text='' id='id' checked='checked' change='change()' disable='disable'></tiny-checkbox>" +
                            "</div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = dataitem;
                        selBoxScope.id = idPrefix + memberId;
                        //不能操作自己
                        var userSelf = memberId === user.id;
                        selBoxScope.disable = userSelf;
                        selBoxScope.checked = userSelf ? false : ifChecked(memberId);
                        selBoxScope.change = function () {
                            var checked = $("#" + idPrefix + memberId).widget().option("checked");
                            selectMember(dataitem, checked);

                            var allChecked = ifAllChecked(showMembers);
                            tblHeaderCheckbox.option("checked", allChecked);
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td.check", row).append(selBoxNode);
                    },

                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.getMembers();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.getMembers();
                    }
                };
                $scope.rightTable = {
                    "id": "addMemberRightTableId",
                    "data": [],
                    "columns": [
                        {
                            "sTitle": i18n.common_term_userName_label || "用户名",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_role_label || "角色",
                            "mData": "",
                            "sClass": "role",
                            "bSortable": false,
                            "sWidth": 160
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "mData": "",
                            "bSortable": false,
                            "sClass": "del",
                            "sWidth": 50
                        }
                    ],
                    "pagination": false,
                    "renderRow": function (row, dataitem, index) {
                        var deleteText = i18n.common_term_delete_button || "删除";
                        var delTemplate = "<a href='javascript:void 0;' ng-click='remove()'>" + deleteText + "</a>";
                        var compiledDelTemplate = $compile(delTemplate);
                        var delDomScope = $scope.$new();
                        delDomScope.remove = function () {
                            selectMember(dataitem, false);
                        };
                        var delDom = compiledDelTemplate(delDomScope);
                        $("td.del", row).append(delDom);

                        var roleTemplate = '<tiny-select id="selectId" values="values" mode="selectMode" width="selectWidth" change="change()"></tiny-select>';
                        var compiledRoleTemplate = $compile(roleTemplate);
                        var roleDomScope = $scope.$new();
                        selectedMembers[index].values = $.extend(true, [], selectedMembers[index].values || roleValues);
                        roleDomScope.selectId = rolePrefix + dataitem.id;
                        roleDomScope.values = selectedMembers[index].values;
                        roleDomScope.selectWidth = "160px";
                        roleDomScope.selectMode = "multiple";
                        roleDomScope.change = function () {
                            var SPER = ";";
                            var select = $("#" + roleDomScope.selectId).widget();
                            var roleIds = select.getSelectedId();
                            var roleIdsString = SPER + roleIds.join(SPER) + SPER;
                            var values = selectedMembers[index].values;
                            for (var i = 0, len = values.length; i < len; i++) {
                                values[i].checked = roleIdsString.indexOf(SPER + values[i].selectId + SPER) > -1;
                            }
                        };
                        var privilegeDom = compiledRoleTemplate(roleDomScope);
                        $("td.role", row).append(privilegeDom);
                    }
                };
                $scope.createUserModel = {
                    "id": "createUserLinkId",
                    "label": i18n.user_term_createUser_button,
                    "create": function () {
                        var createWindow = new Window({
                            "winId": "createUserWindowId",
                            "title": i18n.user_term_createUser_button,
                            "content-type": "url",
                            "content": "app/business/user/views/user/createUser.html",
                            "height": 400,
                            "width": 600,
                            "maximizable": false,
                            "minimizable": false,
                            "buttons": null
                        }).show();
                    }
                };
                //上一步按钮
                $scope.memberInfoPreBtn = {
                    "id": "memberInfoPreBtnId",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $stepWidget.pre();
                        $scope.stepShow.step3 = false;
                        if ($scope.openstack) {
                            $scope.stepShow.step2 = true;
                        } else {
                            $scope.stepShow.stepNetwork = true;
                        }
                    }
                };
                //下一步按钮
                $scope.memberInfoNextBtn = {
                    "id": "memberInfoNextBtnId",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        // 设置成员信息
                        var list = [];
                        var members = [];
                        // 构造成员列表
                        for (var index = 0, len = selectedMembers.length; index < len; index++) {
                            var selectedMember = selectedMembers[index];
                            var memberId = selectedMember.id;
                            var member = {
                                id: memberId
                            };
                            // 选择框的id
                            var selectWidgetId = rolePrefix + memberId;
                            var roleIds = $("#" + selectWidgetId).widget().getSelectedId();
                            if (!roleIds || roleIds.length === 0) {
                                new MessageService().promptErrorMsgBox(i18n.org_vdc_add_para_chooseRole_msg || "请为已选择的VDC成员指定角色。");
                                return;
                            }
                            member.roleIds = roleIds;
                            list.push(member);
                            members.push(selectedMember.name);
                        }
                        $scope.memberInfo = list;
                        $scope.orgUser.value = members.join(";");

                        $stepWidget.next();
                        $scope.stepShow.step3 = false;
                        $scope.stepShow.step4 = true;
                    }
                };
                //取消按钮
                $scope.memberInfoCancelBtn = {
                    "id": "memberInfoCancelBtnId",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go(vdcListState);
                    }
                };

                // 确认页面
                $scope.orgUser = {
                    "id": "orgUserId",
                    "label": i18n.org_term_vdcMember_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "readonly": true
                };

                $scope.orgNetwork = {
                    "id": "orgNetworkId",
                    "label": i18n.org_term_VDCnet_label + ":",
                    "display": !$scope.openstack,
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "readonly": true
                };

                $scope.rangeSelected = {
                    "label": ($scope.openstack ? i18n.cloud_term_cloudPool_label : i18n.resource_term_AZ_label) + ":",
                    "value": ""
                };
                $scope.quotaConfirm = {
                    "id": "quotaConfirmId",
                    "label": i18n.common_term_quotaLimit_label + ":",
                    "require": false,
                    "readonly": true
                };
                //上一步按钮
                $scope.confirmInfoPreBtn = {
                    "id": "confirmInfoPreBtnId",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        if ($scope.openstack) {
                            $stepWidget.pre();
                            $scope.stepShow.step2 = true;
                            $scope.stepShow.step4 = false;
                        } else {
                            $stepWidget.pre();
                            $scope.stepShow.step3 = true;
                            $scope.stepShow.step4 = false;
                        }
                    }
                };
                $scope.createBtn = {
                    "id": "createOrgBtnId",
                    "text": i18n.common_term_create_button,
                    "create": function () {
                        $scope.operator.create();
                    }
                };


                $scope.operator = {
                    "constructQuotaInfo": function () {
                        var quotaInfo = [];
                        quotaInfo.push({
                            "quotaName": "CPU",
                            "limit": $scope.cpuNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "MEMORY",
                            "limit": $scope.memoryUpperLimit.value
                        });
                        quotaInfo.push({
                            "quotaName": "STORAGE",
                            "limit": $scope.storage.value
                        });
                        quotaInfo.push({
                            "quotaName": "VPC",
                            "limit": $scope.vpcNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "EIP",
                            "limit": $scope.eipNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "SEG",
                            "limit": $scope.sgNumber.value
                        });
                        quotaInfo.push({
                            "quotaName": "VM",
                            "limit": $scope.vmNumber.value
                        });
                        return quotaInfo;
                    },
                    "initRange": function (name) {
                        if ($scope.openstack) {
                            $scope.operator.initCanSelectCloudInfras(name);
                        } else {
                            $scope.operator.initCanSelectAz(name);
                        }
                    },
                    "initCanSelectAz": function (name) {
                        var params = {
                            "start": 0,
                            "manage-status": "occupied",
                            "service-status": "normal",
                            "detail":false
                        };
                        name && (params.name = name);
                        var deferred = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/available-zones",
                                "o": {"tenant_id": user.vdcId}
                            },
                            "params": params,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var availableZones = (response && response.availableZones) || [];
                                var list = [];
                                for (var i = 0, len = availableZones.length; i < len; i++) {
                                    var item = availableZones[i];

                                    var checkItem = {
                                        "id": item.id + "_" + item.cloudInfraId,
                                        "name": item.name + "(" + item.cloudInfraName + ")",
                                        "desc": item.description || ""
                                    };
                                    availableZones[i].id = item.id + "_" + item.cloudInfraId;
                                    availableZones[i].name = item.name + "(" + item.cloudInfraName + ")";
                                    if ($scope.orgService.isExist(item, $scope.selectedRange.list)) {
                                        continue;
                                    }
                                    list.push({
                                        "id": availableZones[i].id,
                                        "name": availableZones[i].name,
                                        "desc": availableZones[i].description || ""
                                    });
                                }
                                $scope.canSelectRange.list = $scope.orgService.constructAZList(list, "left");
                            });
                        });
                    },
                    "initCanSelectCloudInfras": function (name) {
                        var params = {
                            "start": 0,
                            "connect-status": "connected",
                            "service-status": "normal"
                        };
                        name && (params.name = name);
                        var deferred = camel.get({
                            "url": {
                                "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras",
                                "o": {"tenant_id": user.vdcId}
                            },
                            "params": params,
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var cloudInfras = (response && response.cloudInfras) || [];
                                var list = [];
                                for (var i = 0, len = cloudInfras.length; i < len; i++) {
                                    var item = cloudInfras[i];
                                    var checkItem = {
                                        "id": "_" + item.id,
                                        "name": item.name,
                                        "desc": item.description || ""
                                    };
                                    if ($scope.orgService.isExist(checkItem, $scope.selectedRange.list)) {
                                        continue;
                                    }
                                    list.push(checkItem);
                                }
                                $scope.canSelectRange.list = $scope.orgService.constructAZList(list, "left");
                            });
                        });
                    },
                    "initMember": function () {
                        $scope.operator.getMembers();
                    },

                    "getMembers": function () {
                        !roleValues.length && $scope.operator.getAllServiceRole();
                        var method = $scope.openstack ? "get" : "post";
                        var deferred = camel[method]({
                            "url": {
                                s: "/goku/rest/{fancy}v1.5/{tenant_id}/users/list",
                                o: {
                                    "tenant_id": "1",
                                    //ict只能添加不在vdc中的用户
                                    "fancy": $scope.openstack ? "fancy/" : ""
                                }
                            },
                            "params": $scope.openstack ? $scope.searchModel : JSON.stringify($scope.searchModel),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            response = response || {userList: [], total: 0};
                            showMembers = response.userList;
                            $scope.$apply(function () {
                                $scope.leftTable.data = response.userList;
                                $scope.leftTable.totalRecords = response.total;
                            });
                            renderTbHeaderCheckbox(showMembers);
                        });
                    },
                    //获取所有业务类角色
                    "getAllServiceRole": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles?type={roleType}",
                                o: {
                                    "tenant_id": 1,
                                    "roleType": "SERVICE_ROLE"
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            var roleList = response && response.roleList;
                            if (roleList) {
                                for (var i = 0, len = roleList.length; i < len; i++) {
                                    roleValues.push({
                                        selectId: roleList[i].id,
                                        label: roleList[i].name,
                                        checked: true
                                    });
                                }
                            }
                        });
                    },
                    "setOrgRange": function (orgId, params, url) {
                        var deferred = camel.post({
                            "url": {
                                s: url,
                                o: {"id": orgId}
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                $scope.operator.addMember(orgId);
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "addMember": function (orgId) {
                        var memberInfo = $scope.memberInfo;
                        if (!memberInfo || memberInfo.length == 0) {
                            $state.go(vdcListState);
                            return;
                        }
                        var params = {
                            "addMember": {
                                "userInfos": memberInfo
                            }
                        };

                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/vdcs/{vdcId}/users/action",
                                o: {
                                    "vdcId": orgId
                                }
                            },
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $state.go(vdcListState);
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },
                    "setOpenstackRoleId": function () {
                        var deferred = camel.get({
                            "url": {
                                s: "/goku/rest/v1.5/{tenant_id}/roles?name={roleName}&type={type}",
                                o: {
                                    "tenant_id": 1,
                                    "roleName": "vdcmanager",
                                    "type": "SERVICE_ROLE"
                                }
                            },
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (response == null || response == undefined) {
                                    return;
                                }
                                if (response.roleList && response.roleList.length > 0) {
                                    $scope.openstackRoleId = response.roleList[0].id;
                                }
                            });
                        });
                    },

                    "create": function () {
                        var params = {};
                        params.name = $scope.name.value;
                        params.description = $scope.description.value;
                        params.allQuota = $scope.quotaNotLimit;
                        if (!$scope.quotaNotLimit) {
                            params.quotaList = $scope.operator.constructQuotaInfo();
                        }

                        var deferred = camel.post({
                            "url": "/goku/rest/v1.5/vdcs",
                            "params": JSON.stringify(params),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                var orgId = response.id;

                                var range = $scope.selectedRange.list;
                                if (!range || range.length === 0) {
                                    $scope.operator.addMember(orgId);
                                    return;
                                }
                                var azBaseInfos = [];
                                for (var index in range) {
                                    var ids = range[index].id.split("_");
                                    azBaseInfos.push({
                                        "azId": ids[0],
                                        "cloudInfraId": ids[1]
                                    });
                                }
                                $scope.operator.setOrgRange(orgId, {
                                    azBaseInfos: azBaseInfos
                                }, "/goku/rest/v1.5/vdcs/{id}/cloud-infras");
                                if (!$scope.openstack) {
                                    $scope.operator.associateNetworks(orgId);
                                }
                            });
                        });
                        deferred.fail(function (response) {
                            $scope.$apply(function () {
                                new ExceptionService().doException(response);
                            });
                        });
                    },

                    "getNetworks": function () {
                        var ids = $scope.searchNetworkFilterId.split("_");
                        var ID_LENGTH = 2;
                        if (ids && ids.length == ID_LENGTH) {
                            $scope.searchNetworkModel["cloud-infras"] = ids[1];
                            !$scope.openstack && ($scope.searchNetworkModel["az-id"] = ids[0]);

                            var deferred = camel.get({
                                "url": {
                                    s: "/goku/rest/v1.5/{vdc_id}/available-external-networks",
                                    o: {
                                        vdc_id: user.vdcId
                                    }
                                },
                                "params": $scope.searchNetworkModel,
                                "userId": user.id
                            });
                            deferred.success(function (response, textStatus, jqXHR) {
                                response = response || {externalNetworks: [], total: 0, allExtenalNetwork: false};
                                showNetworks = response.externalNetworks;
                                var netConfig = {
                                    IPv4: "ipv4Subnet",
                                    IPv6: "ipv6Subnet",
                                    DualStack: ""
                                };
                                for (var i = 0, len = showNetworks.length; i < len; i++) {
                                    var network = showNetworks[i];
                                    network.id = $scope.searchNetworkFilterId + "_" + network.exnetworkID;
                                    network.azId = ids[0];
                                    network.cloudInfrasId = ids[1];
                                    var protocolType = netConfig[network.protocolType];
                                    network[protocolType] && (network.subNet = network[protocolType].subnetAddr);
                                }
                                $scope.$apply(function () {
                                    $scope.leftNetworkTable.data = showNetworks;
                                    $scope.leftNetworkTable.totalRecords = response.total;
                                });
                                renderNetworkTbHeaderCheckbox(showNetworks);
                            });
                            deferred.fail(function (jqXHR, textStatus, errorThrown) {
                                $scope.leftNetworkTable.data = [];
                                new ExceptionService().doException(jqXHR);
                            });
                        }
                    },

                    "associateNetworks": function (orgId) {
                        var deferred = camel.post({
                            "url": {
                                s: "/goku/rest/v1.5/{vdc_id}/available-external-networks/action",
                                o: {
                                    vdc_id: orgId
                                }
                            },
                            "params": JSON.stringify($scope.networkInfo),
                            "userId": user.id
                        });
                        deferred.success(function (response, textStatus, jqXHR) {
                        });
                        deferred.fail(function (jqXHR, textStatus, errorThrown) {
                            new ExceptionService().doException(jqXHR);
                        });
                    }
                };
            }
        ];

        return createOrgCtrl;
    });
