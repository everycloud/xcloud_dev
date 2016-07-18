/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Select",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, Select, UnifyValid, Exception) {
        "use strict";

        var associateClusterCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", function ($scope, $compile, $state, $stateParams, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            var zoneId = $stateParams.zoneId;
            var zoneName = $stateParams.zoneName;
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

            function goBack() {
                $state.go("resources.zoneResources.computing", {"id": zoneId, "name": zoneName});
            }

            $scope.stepUrl = {
                "step1": "../src/app/business/resources/views/rpool/zone/zoneResources/computing/associateSelectCluster.html",
                "step2": "../src/app/business/resources/views/rpool/zone/zoneResources/computing/associateConfigStore.html"
            };
            $scope.stepShow = {
                "step1": true,
                "step2": false
            };
            $scope.associateStep = {
                "id": "associate_zone_step",
                "values": [$scope.i18n.resource_term_chooseCluster_label, $scope.i18n.resource_term_setStor_button],
                "width": "300",
                "jumpable": false
            };
            var selectedClusters = [];
            var storeNum = 0;

            //虚拟化环境信息页面
            //集群选择列表
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            $scope.selectClusterTable = {
                "id": "selectClusterTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": 40
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
                        "sTitle": $scope.i18n.common_term_domain_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.domain);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
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
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
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
                            while ($("#clusterCheckbox_" + index).widget()) {
                                $("#clusterCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
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
            getClusters();

            //下一步按钮
            $scope.clusterNextButton = {
                "id": "associate_cluster_next_button",
                "text": $scope.i18n.common_term_next_button,
                "click": function () {
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
                    goBack();
                }
            };

            //配置存储页面
            //存储选择列表
            $scope.storeTable = {
                "id": "selectStoreTable",
                "data": [],
                "enablePagination": false,
                "columnSorting": [],
                "columns": [
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
                        "sTitle": $scope.i18n.common_term_storageMedia_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.mediaType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resClusterName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_hypervisor_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hypervisorName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
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
                "text": $scope.i18n.common_term_back_button,
                "click": function () {
                    $("#" + $scope.associateStep.id).widget().pre();
                    $("#" + $scope.storeOkButton.id).widget().option("disable", true);
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
                    goBack();
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
                    "url": {s: "/goku/rest/v1.5/irm/1/zones/{id}/resources/action", o: {id: zoneId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    if (data.associate && data.associate.errors && data.associate.errors.length > 0) {
                        exceptionService.doException({responseText: JSON.stringify({code: data.associate.errors[0].code, message: $scope.i18n.virtual_cluster_add_info_part_msg})});
                    }
                    configStore();
                    goBack();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
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
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
        }];
        return associateClusterCtrl;
    }
);
