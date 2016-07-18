/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-1-20
 */
/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/user/service/orgService",
    "app/services/exceptionService",
    "app/services/messageService",
    "app/services/commonService",
    "tiny-common/UnifyValid",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-widgets/Radio",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-directives/FormField",
    "tiny-directives/RadioGroup",
    "tiny-directives/CheckboxGroup",
    "fixtures/userFixture"
],
    function ($, angular, http, OrgService, ExceptionService, MessageService, commonService, UnifyValid, Window, Checkbox, Select,Radio) {
        "use strict";
        var createOrgCtrl = ["$scope", "camel", "$state", "validator", "$compile",
            function ($scope, camel, $state, validator, $compile) {
                var user = $scope.user;
                var i18n = $scope.i18n;
                $scope.openstack = user.cloudType === "OPENSTACK";
                $scope.orgService = new OrgService();
                $scope.roleList = [];
                $scope.stepUrl = {
                    "step1": "../src/app/business/vdc/views/orgVdc/orgVdcBasicInfo.html",
                    "step2": "../src/app/business/vdc/views/orgVdc/chooseVdc.html",
                    "step3": "../src/app/business/vdc/views/orgVdc/chooseResourceCluster.html",
                    "step4": "../src/app/business/vdc/views/orgVdc/setQuotaInfo.html",
                    "step5": "../src/app/business/vdc/views/orgVdc/chooseVpc.html",
                    "step6": "../src/app/business/vdc/views/orgVdc/confirmInfo.html"
                };
                $scope.stepShow = {
                    "step1": true,
                    "step2": false,
                    "step3": false,
                    "step4": false,
                    "step5": false,
                    "step6": false
                };

                var stepValues = [
                    $scope.i18n.common_term_basicInfo_label || "基本信息",
                    $scope.i18n.org_term_chooseVDC_label || "选择VDC",
                    $scope.i18n.resource_term_chooseCluster_label || "选择资源集群",
                    $scope.i18n.common_term_resourceQuota_label || "资源配额",
                    $scope.i18n.vpc_term_chooseVPC_label || "选择VPC",
                    $scope.i18n.common_term_confirmInfo_label || "确认信息"
                ];

                $scope.addStep = {
                    "id": "createOrgVdcStep",
                    "values": stepValues,
                    "width": "750",
                    "jumpable": false
                };

                // 基本信息页面内容
                $scope.name = {
                    "id": "createOrgNameId",
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": true,
                    "value": "",
                    "type": "input",
                    "readonly": false,
                    "tooltip": validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "20"}),
                    "validate": "required:" + $scope.i18n.common_term_null_valid +
                        ";maxSize(20):" + validator.i18nReplace($scope.i18n.common_term_length_valid, {"1": "1", "2": "20"}) +
                        ";regularCheck(" + validator.orgNameRe + "):" + $scope.i18n.common_term_composition2_valid
                };
                $scope.description = {
                    "id": "createOrgDescId",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "width": 400,
                    "height": 60,
                    "readonly": false,
                    "validate": "maxSize(128):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid,{1:128})
                };

                //下一步按钮
                $scope.basicInfoNextBtn = {
                    "id": "basicInfoNextBtnId",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#createOrgBasicInfo"));
                        if (!result) {
                            return;
                        }

                        $("#" + $scope.addStep.id).widget().next();
                        $scope.stepShow.step1 = false;
                        $scope.stepShow.step2 = true;
                        $scope.operator.queryVdc();
                        $scope.name.value = $("#" + $scope.name.id).widget().getValue();
                        $scope.description.value = $("#" + $scope.description.id).widget().getValue();
                    }
                };
                //取消按钮
                $scope.basicInfoCancelBtn = {
                    "id": "basicInfoCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };

                //查询信息
                $scope.searchModel = {
                    start: 0,
                    limit: 10
                };
                var vdcColumns = [{
                    "sTitle": "",
                    "sWidth": "40px",
                    "mData": "",
                    "bSearchable": false,
                    "bSortable": false
                }, {
                    "sTitle": "ID",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.org_term_vdcName_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_createAt_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.createTime);
                    },
                    "bSortable": false
                }, {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                }];

                $scope.orgVdcModel = {
                    "id": "orgListId",
                    "datas": [],
                    "columns": vdcColumns,
                    "pagination": true,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    "enableFilter": false,
                    "curPage": {
                        "pageIndex": 1
                    },
                    "requestConfig": {
                        "enableRefresh": true,
                        "refreshInterval": 6000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "totalRecords": 0,
                    "hideTotalRecords": false,
                    "showDetails": false,

                    "renderRow": function (nRow, dataitem, iDataIndex) {
                        //单选框
                        var options = {
                            "id": "vdcRadio_" + iDataIndex,
                            "checked": false,
                            "change": function () {
                                var index = 0;
                                while ($("#vdcRadio_" + index).widget()) {
                                    if (index !== iDataIndex) {
                                        $("#vdcRadio_" + index).widget().option("checked", false);
                                    }
                                    index++;
                                }
                            }
                        };
                        var radio = new Radio(options);
                        $('td:eq(0)', nRow).html(radio.getDom());
                    },

                    "callback": function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.queryVdc();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.model.displayLength = evtObj.displayLength;
                        $scope.operator.queryVdc();
                    }
                };

                //上一步按钮
                $scope.vdcInfoPreBtn = {
                    "id": "vdcInfoPreBtnId",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.stepShow.step1 = true;
                        $scope.stepShow.step2 = false;
                    }
                };
                //下一步按钮
                $scope.vdcInfoNextBtn = {
                    "id": "vdcInfoNextBtnId",
                    "disable": false,
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var data = $("#" + $scope.orgVdcModel.id).widget().option("data");
                        $scope.selectedVdcId = null;
                        var index = 0;
                        while ($("#vdcRadio_" + index).widget()) {
                            var checked = $("#vdcRadio_" + index).widget().option("checked");
                            if (checked) {
                                $scope.selectedVdcId = data[index].id;
                                $scope.selectedVdcName = data[index].name;
                                break;
                            }
                            index++;
                        }

                        // 如果指定vdc，则需要弹出错误框
                        if (!$scope.selectedVdcId) {
                            new MessageService().promptErrorMsgBox($scope.i18n.org_orgVDC_add_info_chooseVDC_msg || "请指定VDC");
                            return;
                        }

                        $("#" + $scope.addStep.id).widget().next();
                        $scope.stepShow.step2 = false;
                        $scope.stepShow.step3 = true;

                        getHypervisors();
                    }
                };
                //取消按钮
                $scope.vdcInfoCancelBtn = {
                    "id": "vdcInfoCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };

                $scope.hypervisorSelector = {
                    "label": (i18n.virtual_term_hypervisor_label||"虚拟化环境")+":",
                    "id": "associate_zone_hypervisor_selector",
                    "width": "135",
                    "require": true,
                    "validate": "required:"+(i18n.common_term_null_valid||"不能为空")+";",
                    "values": [ ],
                    "change": function () {
                        $scope.selectedHypervisorId = $("#" + $scope.hypervisorSelector.id).widget().getSelectedId();
                        if ($scope.selectedHypervisorId) {
                            getZones();
                        }
                    }
                };

                $scope.zoneSelector = {
                    "label": ($scope.i18n.resource_term_zone_label||"资源分区")+":",
                    "id": "associate_zone_cluster_selector",
                    "width": "135",
                    "require": true,
                    "validate": "required:"+($scope.i18n.common_term_null_valid||"不能为空")+";",
                    "values": [ ],
                    "change": function () {
                        $scope.selectedZoneId = $("#" + $scope.zoneSelector.id).widget().getSelectedId();
                        if ($scope.selectedZoneId) {
                            getAzs();
                        }
                    }
                };

                $scope.azSelector = {
                    "label": ($scope.i18n.resource_term_Azs_label||"可用分区")+":",
                    "id": "az_selector",
                    "width": "135",
                    "require": true,
                    "validate": "required:"+($scope.i18n.common_term_null_valid||"不能为空")+";",
                    "values": [ ],
                    "change": function () {
                        $scope.selectedAzId = $("#" + $scope.azSelector.id).widget().getSelectedId();
                        if ($scope.selectedAzId) {
                            getClusters();
                        }
                    }
                };

                //查询信息
                var clusterSearchInfo = {
                    "curPage": 1,
                    "start": 0,
                    "limit": 10
                };

                var clusterTypes = {
                    0:$scope.i18n.common_term_unknown_value,
                    1:$scope.i18n.common_term_virtualization_label,
                    2:$scope.i18n.virtual_term_bareCluster_label,
                    3:$scope.i18n.common_term_manage_label,
                    4:$scope.i18n.common_term_databaseCluster_label,
                    5:$scope.i18n.resource_term_storageCluster_label
                };

                //集群选择列表
                $scope.selectClusterTable = {
                    "id": "selectClusterTable",
                    "data": null,
                    "caption": "",
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 50],
                    "columns": [
                        {
                            "sTitle": "",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false,
                            "sWidth":40
                        },
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_type_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.type);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_domain_label||"域",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.domain);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_hypervisor_label||"虚拟化环境",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hypervisorName);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {
                        clusterSearchInfo.curPage = evtObj.currentPage;
                        clusterSearchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getClusters();
                    },
                    "changeSelect": function (pageInfo) {
                        clusterSearchInfo.start = 0;
                        clusterSearchInfo.curPage = 1;
                        clusterSearchInfo.limit = pageInfo.displayLength;
                        $scope.selectClusterTable.displayLength = pageInfo.displayLength;
                        getClusters();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //复选框
                        var options = {
                            "id": "clusterCheckbox_" + iDataIndex,
                            "checked": false,
                            "change": function () {

                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', nRow).html(checkbox.getDom());
                    }
                };

                //上一步按钮
                $scope.resourceClusterPreBtn = {
                    "id": "resourceClusterPreBtnId",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.stepShow.step2 = true;
                        $scope.stepShow.step3 = false;
                    }
                };
                //下一步按钮
                $scope.resourceClusterNextBtn = {
                    "id": "resourceClusterNextBtnId",
                    "disable": false,
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#chooseResourceClusterDiv"));
                        if (!result) {
                            return;
                        }
                        $scope.selectZone = $("#" + $scope.zoneSelector.id).widget().getSelectedId();
                        $scope.selectedClusters = [];
                        $scope.selectedClustersStr = "";
                        var index = 0;
                        var data = $("#" + $scope.selectClusterTable.id).widget().options.data;
                        while ($("#clusterCheckbox_" + index).widget()) {
                            var checked = $("#clusterCheckbox_" + index).widget().option("checked");
                            if (checked) {
                                $scope.selectedClusters.push(data[index].id);
                                $scope.selectedClustersStr += (data[index].name + ";");
                            }
                            index++;
                        }
                        if ($scope.selectedClusters.length === 0) {
                            return;
                        }

                        $("#" + $scope.addStep.id).widget().next();
                        $scope.stepShow.step3 = false;
                        $scope.stepShow.step4 = true;
                    }
                };
                //取消按钮
                $scope.resourceClusterCancelBtn = {
                    "id": "resourceClusterCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };

                function getHypervisors() {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/irm/1/hypervisors",
                        "params": {},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if(!data || !data.hypervisors){
                            return;
                        }
                        var hypervisors = data.hypervisors;
                        var values = [];
                        for (var i = 0; i < hypervisors.length; i++) {
                            var item = {
                                "selectId": hypervisors[i].id,
                                "label": hypervisors[i].name
                            };
                            values.push(item);
                        }
                        if(values.length > 0){
                            values[0].checked = true;
                            $scope.selectedHypervisorId = hypervisors[0].id;
                        }
                        $scope.hypervisorSelector.values = values;
                        if ($("#" + $scope.hypervisorSelector.id).widget()) {
                            $("#" + $scope.hypervisorSelector.id).widget().option("values", values);
                        }
                        // 初始化资源分区
                        getZones();
                    });
                    deferred.fail(function (data) {
                        new ExceptionService().doException(data);
                    });
                }

                function getZones() {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/irm/1/zones",
                        "params": null,
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var zones = data.zones;
                        var values = [];
                        for (var i = 0; i < zones.length; i++) {
                            var item = {
                                "selectId": zones[i].id,
                                "label": zones[i].name
                            };
                            values.push(item);
                        }
                        if(values.length > 0){
                            values[0].checked = true;
                            $scope.selectedZoneId = zones[0].id;
                        }
                        $scope.zoneSelector.values = values;
                        if ($("#" + $scope.zoneSelector.id).widget()) {
                            $("#" + $scope.zoneSelector.id).widget().option("values", values);
                        }

                        // 初始化可用分区
                        getAzs();
                    });
                    deferred.fail(function (data) {
                        new ExceptionService().doException(data);
                    });
                }

                function getAzs() {
                    var params = {
                        "start": 0,
                        "limit": 10000,
                        "zoneId": $scope.selectedZoneId
                    };
                    var deferred = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/availablezones/list",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var azs = data.availableZones;
                        var values = [];
                        for (var i = 0; i < azs.length; i++) {
                            var item = {
                                "selectId": azs[i].id,
                                "label": azs[i].name
                            };
                            values.push(item);
                        }
                        if(values.length > 0){
                            values[0].checked = true;
                            $scope.selectedAzId = azs[0].id;
                        }
                        $scope.azSelector.values = values;
                        if ($("#" + $scope.azSelector.id).widget()) {
                            $("#" + $scope.azSelector.id).widget().option("values", values);
                        }

                        // 初始化集群
                        getClusters();
                    });
                    deferred.fail(function (data) {
                        new ExceptionService().doException(data);
                    });
                }

                function getClusters(hypervisorId, zoneId) {
                    var params = {
                        "list": {
                            "start": clusterSearchInfo.start,
                            "limit": clusterSearchInfo.limit,
                            "ignoreCapacity":true,
                            "requestType":"ASSOCIATED",
                            "availableZoneId": $scope.selectedAzId
                        }
                    };
                    var deferred = camel.post({
                        "url": "/goku/rest/v1.5/irm/1/resourceclusters/action",
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var clusters = data && data.list && data.list.resourceClusters || [];
                        var total = data && data.list && data.list.total || 0;
                        for (var i = 0; i < clusters.length; i++) {
                            clusters[i].type = clusterTypes[clusters[i].type] || clusters[i].type;
                        }
                        $scope.$apply(function () {
                            $scope.selectClusterTable.totalRecords = total;
                            $scope.selectClusterTable.data = clusters;
                        });
                        //表头全选复选框
                        var tableId = "#selectClusterTable";
                        var options = {
                            "id": "clusterTableHeadCheckbox",
                            "checked": false,
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().option("checked");
                                var index = 0;
                                while($("#clusterCheckbox_" + index).widget()){
                                    $("#clusterCheckbox_" + index).widget().option("checked", isChecked);
                                    index ++;
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $(tableId + ' th:eq(0)').html(checkbox.getDom());
                    });
                    deferred.fail(function (data) {
                        new ExceptionService().doException(data);
                    });
                }


                // 配额信息
                $scope.cpuUpperLimit = {
                    "id": "cpuUpperLimitId",
                    "label": ($scope.i18n.vm_term_cpuMaxGHz_label || "CPU上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000) +
                        ";maxValue(256000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 256000)
                };
                $scope.memoryUpperLimit = {
                    "id": "memoryUpperLimitId",
                    "label": ($scope.i18n.vm_term_memoryMaxGB_label || "内存上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000) +
                        ";maxValue(192000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 192000)
                };
                $scope.storageUpperLimit = {
                    "id": "storageUpperLimitId",
                    "label": ($scope.i18n.vm_term_storageMaxGB_label || "存储上限(GB)") + ":",
                    "require": true,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000) +
                        ";maxValue(512000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000)
                };
                $scope.eipNumber = {
                    "id": "eipNumberId",
                    "label": "公网IP上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };
                $scope.hardwareFirewallNumber = {
                    "id": "hardwareFirewallId",
                    "label": "硬件虚拟防火墙上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };
                $scope.softwareFirewallNumber = {
                    "id": "softwareFirewallId",
                    "label": "软件虚拟防火墙上限（个）:",
                    "require": false,
                    "value": "",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535),
                    "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                        ";minValue(0):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535) +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, "0", 65535)
                };

                //上一步按钮
                $scope.quotaPreBtn = {
                    "id": "quotaPreBtnId",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.stepShow.step3 = true;
                        $scope.stepShow.step4 = false;
                    }
                };
                //下一步按钮
                $scope.quotaNextBtn = {
                    "id": "quotaNextBtnId",
                    "disable": false,
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        var result = UnifyValid.FormValid($("#setQuotaInfo"));
                        if (!result) {
                            return;
                        }
                        $scope.cpuUpperLimit.value = parseInt($("#" + $scope.cpuUpperLimit.id).widget().getValue(), 10);
                        $scope.memoryUpperLimit.value = parseInt($("#" + $scope.memoryUpperLimit.id).widget().getValue(), 10);
                        $scope.storageUpperLimit.value = parseInt($("#" + $scope.storageUpperLimit.id).widget().getValue(), 10);

                        $("#" + $scope.addStep.id).widget().next();
                        $scope.stepShow.step4 = false;
                        $scope.stepShow.step5 = true;
                        getVpcs();
                    }
                };
                //取消按钮
                $scope.quotaCancelBtn = {
                    "id": "quotaCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };

                //查询信息
                var vpcSearchInfo = {
                    "curPage": 1,
                    "start": 0,
                    "limit": 10
                };

                //vpc选择列表
                $scope.selectVpcTable = {
                    "id": "selectVpcTable",
                    "data": null,
                    "caption": "",
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 50],
                    "columns": [
                        {
                            "sTitle": "",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false,
                            "sWidth":40
                        },
                        {
                            "sTitle": "vpcID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vpcID);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_desc_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            },
                            "bSortable": false
                        }
                    ],
                    "callback": function (evtObj) {
                        vpcSearchInfo.curPage = evtObj.currentPage;
                        vpcSearchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        getVpcs();
                    },
                    "changeSelect": function (pageInfo) {
                        vpcSearchInfo.start = 0;
                        vpcSearchInfo.curPage = 1;
                        vpcSearchInfo.limit = pageInfo.displayLength;
                        $scope.selectVpcTable.displayLength = pageInfo.displayLength;
                        getVpcs();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //复选框
                        var options = {
                            "id": "vpcCheckbox_" + iDataIndex,
                            "checked": false,
                            "change": function () {

                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', nRow).html(checkbox.getDom());
                    }
                };

                //上一步按钮
                $scope.vpcPreBtn = {
                    "id": "vpcPreBtnId",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $("#" + $scope.addStep.id).widget().pre();
                        $scope.stepShow.step4 = true;
                        $scope.stepShow.step5 = false;
                    }
                };
                //下一步按钮
                $scope.vpcNextBtn = {
                    "id": "vpcNextBtnId",
                    "disable": false,
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        $scope.selectedVpcs = [];
                        $scope.selectedVpcStr = "";
                        var index = 0;
                        var data = $("#" + $scope.selectVpcTable.id).widget().options.data;
                        while ($("#vpcCheckbox_" + index).widget()) {
                            var checked = $("#vpcCheckbox_" + index).widget().option("checked");
                            if (checked) {
                                $scope.selectedVpcs.push(data[index].id);
                                $scope.selectedVpcStr += (data[index].name + ";");
                            }
                            index++;
                        }

                        $("#" + $scope.addStep.id).widget().next();
                        $scope.stepShow.step5 = false;
                        $scope.stepShow.step6 = true;
                    }
                };
                //取消按钮
                $scope.vpcCancelBtn = {
                    "id": "vpcCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };
                function getVpcs() {
                    var deferred = camel.get({
                        "url": {
                            s: "/goku/rest/v1.5/irm/{vdc_id}/vpcs?start={start}&limit={limit}&shared={shared}&availablezone={availablezone}",
                            o: {
                                "vdc_id": $scope.selectedVdcId,
                                "start": vpcSearchInfo.start,
                                "limit": vpcSearchInfo.limit,
                                "shared": false,
                                "availablezone" :$scope.selectedAzId
                            }
                        },
                        "params": {},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var vpcs = data && data.vpcs || [];
                        var total = data && data.total || 0;
                        $scope.$apply(function () {
                            $scope.selectVpcTable.totalRecords = total;
                            $scope.selectVpcTable.data = vpcs;
                        });
                        //表头全选复选框
                        var tableId = "#selectVpcTable";
                        var options = {
                            "id": "vpcTableHeadCheckbox",
                            "checked": false,
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().option("checked");
                                var index = 0;
                                while($("#vpcCheckbox_" + index).widget()){
                                    $("#vpcCheckbox_" + index).widget().option("checked", isChecked);
                                    index ++;
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $(tableId + ' th:eq(0)').html(checkbox.getDom());
                    });
                    deferred.fail(function (data) {
                        new ExceptionService().doException(data);
                    });
                }

                // 确认页面
                $scope.label ={
                    "vdc":"VDC:",
                    "resourceCluster": ($scope.i18n.virtual_term_cluster_label || "资源集群") + ":",
                    "vpc": "VPC:"
                };

                $scope.orgUser = {
                    "id": "orgUserId",
                    "label": $scope.i18n.org_term_vdcMember_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "readonly": true
                };

                $scope.azSelected = {
                    "id": "azSelectedId",
                    "label": $scope.i18n.resource_term_AZ_label + ":",
                    "require": false,
                    "value": "",
                    "type": "multi",
                    "readonly": true
                };
                $scope.quotaConfirm = {
                    "id": "quotaConfirmId",
                    "label": $scope.i18n.common_term_quotaLimit_label + ":",
                    "require": false,
                    "readonly": true
                };
                //上一步按钮
                $scope.confirmInfoPreBtn = {
                    "id": "confirmInfoPreBtnId",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.stepShow.step5 = true;
                        $scope.stepShow.step6 = false;
                    }
                };
                $scope.createBtn = {
                    "id": "createOrgVdcBtnId",
                    "text": $scope.i18n.common_term_create_button,
                    "create": function () {
                        $scope.operator.createOrgVdc();
                    }
                };
                $scope.cancelBtn = {
                    "id": "createOrgVdcCancelBtnId",
                    "text": $scope.i18n.common_term_cancle_button,
                    "cancel": function () {
                        $state.go("vdcMgr.vdc.orgVdc");
                    }
                };

                $scope.operator = {
                    "queryVdc": function () {
                        var url = "/goku/rest/v1.5/vdcs?";
                        url = url + "start=" + $scope.searchModel.start;
                        url = url + "&limit=" + $scope.searchModel.limit;
                        var deferred = camel.get({
                            "url": url,
                            "params": {},
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $scope.$apply(function () {
                                if (!response) {
                                    return;
                                }
                                var data = [];
                                $scope.orgVdcModel.datas = response.vdcList;
                                $scope.orgVdcModel.totalRecords = response.total;
                            });
                        });
                    },

                    "createOrgVdc": function () {
                        if(!$scope.selectedVdcId){
                            return;
                        }

                        $scope.cpuUpperLimit.value = parseInt($("#" + $scope.cpuUpperLimit.id).widget().getValue(), 10);
                        $scope.memoryUpperLimit.value = parseInt($("#" + $scope.memoryUpperLimit.id).widget().getValue(), 10);
                        $scope.storageUpperLimit.value = parseInt($("#" + $scope.storageUpperLimit.id).widget().getValue(), 10);
                        var para = {
                            "name": $scope.name.value,
                            "description": $scope.description.value,
                            "vdcId": $scope.selectedVdcId,
                            "zoneId": $("#" + $scope.zoneSelector.id).widget().getSelectedId(),
                            "availableZoneId": $("#" + $scope.azSelector.id).widget().getSelectedId(),
                            "hyperId": $("#" + $scope.hypervisorSelector.id).widget().getSelectedId(),
                            "clusterIds": $scope.selectedClusters,
                            "cpuLimit": parseInt($scope.cpuUpperLimit.value, 10),
                            "memLimit": parseInt($scope.memoryUpperLimit.value, 10),
                            "storageLimit": parseInt($scope.storageUpperLimit.value, 10)
                        };
                        if($scope.selectedVpcs && $scope.selectedVpcs.length > 0){
                            para.vpcIds = $scope.selectedVpcs;
                        }

                        var deferred = camel.post({
                            "url": "/goku/rest/v1.5/irm/org-vdcs",
                            "params": JSON.stringify(para),
                            "userId": user.id
                        });
                        deferred.success(function (response) {
                            $state.go("vdcMgr.vdc.orgVdc");
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                };
            }
        ];

        return createOrgCtrl;
    });
