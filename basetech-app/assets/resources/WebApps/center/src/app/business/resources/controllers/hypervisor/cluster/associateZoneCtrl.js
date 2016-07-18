/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, Select, UnifyValid, Exception) {
        "use strict";

        var associateZoneCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
			var i18n = $scope.i18n || {};
            $scope.stepUrl = {
                "step1": "../src/app/business/resources/views/hypervisor/cluster/associateSelectCluster.html",
                "step2": "../src/app/business/resources/views/hypervisor/cluster/associateConfigStore.html"
            };
            $scope.stepShow = {
                "step1": true,
                "step2": false
            };
            $scope.associateStep = {
                "id": "associate_zone_step",
                "values": [i18n.resource_term_chooseCluster_label||"选择资源集群", i18n.resource_term_setStor_button||"配置存储"],
                "width": "300",
                "jumpable": false
            };
            var clusterTypes = {
                0:$scope.i18n.common_term_unknown_value,
                1:$scope.i18n.common_term_virtualization_label,
                2:$scope.i18n.virtual_term_bareCluster_label,
                3:$scope.i18n.common_term_manage_label,
                4:$scope.i18n.common_term_databaseCluster_label,
                5:$scope.i18n.resource_term_storageCluster_label
            };
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            var selectedClusters = [];
            var storeNum = 0;

            //虚拟化环境信息页面
            //资源分区下拉框
            $scope.zoneSelector = {
                "label": (i18n.resource_term_zone_label||"资源分区")+":",
                "id": "associate_zone_cluster_selector",
                "width": "135",
                "require": true,
                "validate": "required:"+(i18n.resource_term_noZone_valid)+";",
                "values": [ ]
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10
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
                        "sTitle": i18n.common_term_domain_label||"域",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.domain);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.virtual_term_hypervisor_label||"虚拟化环境",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getClusters();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.selectClusterTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
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
            function getClusters() {
                var params = {
                    "list": {
                        "requestType": "DISASSOCIATED",
                        "start": searchInfo.start,
                        "limit": searchInfo.limit,
                        "ignoreCapacity":true
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
                    exceptionService.doException(data);
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
                    $scope.zoneSelector.values = values;
                    if ($("#" + $scope.zoneSelector.id).widget()) {
                        $("#" + $scope.zoneSelector.id).widget().option("values", values);
                    }
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getZones();
            getClusters();
            //下一步按钮
            $scope.clusterNextButton = {
                "id": "associate_cluster_next_button",
                "text": $scope.i18n.common_term_next_button,
                "click": function () {
                    var result = UnifyValid.FormValid($("#associateSelectClusterDiv"));
                    if (!result) {
                        return;
                    }
                    $scope.selectZone = $("#" + $scope.zoneSelector.id).widget().getSelectedId();
                    selectedClusters = [];
                    var index = 0;
                    var data = $("#" + $scope.selectClusterTable.id).widget().options.data;
                    while ($("#clusterCheckbox_" + index).widget()) {
                        var checked = $("#clusterCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            selectedClusters.push(data[index].id);
                        }
                        index++;
                    }
                    if (selectedClusters.length === 0) {
                        return;
                    }
                    $("#" + $scope.associateStep.id).widget().next();
                    storeNum = 0;
                    getStores();
                    $scope.stepShow.step1 = false;
                    $scope.stepShow.step2 = true;
                }
            };
            //取消按钮
            $scope.clusterCancelButton = {
                "id": "associate_cluster_cancel_button",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $state.go("resources.hypervisor.cluster");
                }
            };

            //配置存储页面
            //存储选择列表
            $scope.storeTable = {
                "id": "selectStoreTable",
                "data": [],
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": "名称",
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
                        "sTitle": i18n.common_term_storageMedia_label||"存储介质",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.virtual_term_cluster_label||"集群",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resClusterName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.virtual_term_hypervisor_label||"虚拟化环境",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_capacityTotalGB_label||"总容量(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.perform_term_factAvailableCapacityGB_label||"实际可用容量(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    //介质类型下拉框
                    var options = {
                        "id": "mediaSelect_" + iDataIndex,
                        "width": 150,
                        "values": [
                            {
                                "selectId": "SAN-Any",
                                "label": "Any",
                                "checked": true
                            },
                            {
                                "selectId": "SAN-SSD",
                                "label": "SAN-SSD"
                            },
                            {
                                "selectId": "SAN-SAS&FC",
                                "label": "SAN-SAS&FC"
                            },
                            {
                                "selectId": "SAN-SATA",
                                "label": "SAN-SATA"
                            }
                        ],
                        "change": function () {

                        }
                    };
                    var select = new Select(options);
                    $('td:eq(2)', nRow).html(select.getDom());
                }
            };
            function getStores() {
                $scope.storeTable.data = [];
                for (var i = 0; i < selectedClusters.length; i++) {
                    var params = {
                        "detail": "0",
                        "scopeType": "CLUSTER",
                        "scopeObjectId": selectedClusters[i]
                    };
                    var deferred = camel.post({
                        url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var mediaTypeHead = $("#"+$scope.storeTable.id+" th:eq(2)");
                        if (mediaTypeHead.find(".small-icon-tips").length === 0) {
                            var optColumn = '<span popover="{{i18n.resource_compu_associateCluster_para_storMedia_mean_tip}}" popover-trigger="mouseenter" ' +
                                'popover-placement="right" class="small-icon small-icon-tips"></span>';
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            var optNode = optLink(optScope);
                            mediaTypeHead.append(optNode);
                        }
                        storeNum++;
                        var stores = data && data.datastoreInfos || [];
                        for (var j = 0; j < stores.length; j++) {
                            stores[j].type = storeTypes[stores[j].type] || stores[j].type;
                            //集群的存储可能重复，将重复去除
                            var k = 0;
                            for (; k < $scope.storeTable.data.length; k++) {
                                if ($scope.storeTable.data[k].id == stores[j].id) {
                                    break;
                                }
                            }
                            if (k >= $scope.storeTable.data.length) {
                                $scope.storeTable.data.push(stores[j]);
                            }
                        }
                        $("#" + $scope.storeTable.id).widget().option("data", $scope.storeTable.data);
                        if (storeNum >= selectedClusters.length) {
                            $("#" + $scope.storeOkButton.id).widget().option("disable", false);
                        }
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                }
            }

            //上一步按钮
            $scope.storePreButton = {
                "id": "associate_store_pre_button",
                "text": i18n.common_term_back_button||"上一步",
                "click": function () {
                    $("#" + $scope.storeOkButton.id).widget().option("disable", true);
                    $("#" + $scope.associateStep.id).widget().pre();
                    $scope.stepShow.step2 = false;
                    $scope.stepShow.step1 = true;
                }
            };
            //确定按钮
            $scope.storeOkButton = {
                "id": "associate_store_ok_button",
                "text": $scope.i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    associate();
                }
            };
            //取消按钮
            $scope.storeCancelButton = {
                "id": "associate_store_cancel_button",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $state.go("resources.hypervisor.cluster");
                }
            };
            function associate() {
                var params = {
                    "associate": {
                        "resources": {
                            "resourceCluster": selectedClusters
                        }
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/zones/{id}/resources/action", o: {id: $scope.selectZone}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if(data.associate && data.associate.errors && data.associate.errors.length > 0){
                        exceptionService.doException({responseText:JSON.stringify({code:data.associate.errors[0].code,message:$scope.i18n.virtual_cluster_add_info_part_msg})});
                    }
                    configStore();
                    $state.go("resources.hypervisor.cluster");
                });
            }
            function configStore() {
                var dataStoreInfo = [];
                var index = 0;
                var data = $("#" + $scope.storeTable.id).widget().options.data;
                while ($("#mediaSelect_" + index).widget()) {
                    var selectedId = $("#mediaSelect_" + index).widget().getSelectedId();
                    var storeItem = {
                        "id": data[index].id,
                        "mediaType": selectedId
                    };
                    dataStoreInfo.push(storeItem);
                    index++;
                }
                var params = {
                    "datastoreInfos": dataStoreInfo
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/datastores"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                });
            }
        }];
        return associateZoneCtrl;
    }
);
