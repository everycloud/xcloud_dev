define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants"],
    function ($, angular, httpService, UnifyValid, constants) {
        "use strict";

        var logicVmtDetailCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {

            $scope.templateID = $("#logicVmtShowDetailWinID").widget().option("templateID");

            $scope.logicVmtDetail = {};

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: false,
                "id": "logicVmtDetailName",
                "value":""
            };

            $scope.diskSize = {
                label: $scope.i18n.common_term_sysDiskSizeGB_label+":",
                require: false,
                "id": "logicVmtDetailDiskSize",
                "value":""
            };
            $scope.osType = {
                label: $scope.i18n.common_term_OStype_label+":",
                require: false,
                "id": "logicVmtDetailOsType",
                "value":""
            };
            $scope.osVersion = {
                label: $scope.i18n.common_term_OSversion_label+":",
                require: false,
                "id": "logicVmtDetailOsVersion",
                "value":""
            };
            $scope.status = {
                label: $scope.i18n.common_term_status_label+":",
                require: false,
                "id": "logicVmtDetailOsStatus",
                "value":""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "logicVmtDetailDescription",
                "value":""
            };

            $scope.vmtStatus = {
                "FAILED":$scope.i18n.common_term_createFail_value,
                "VMCREATING":$scope.i18n.common_term_creating_value,
                "PROCESSING":$scope.i18n.common_term_processing_value,
                "UNFINISHED":$scope.i18n.common_term_noComplete_value,
                "FINISHED":$scope.i18n.common_term_complete_label,
                "LOST":$scope.i18n.common_term_lose_value,
                "MODIFYFAILED":$scope.i18n.common_term_modifyFail_value,
                "EXCEPTION":$scope.i18n.common_term_abnormal_value,
                "DELETING":$scope.i18n.common_term_deleting_value,
                "DELETEFAILED":$scope.i18n.common_term_deleteFail_value
            };

            $scope.vmtType = {
                "vapp_template":$scope.i18n.template_term_appVM_label,
                "desktop_template":$scope.i18n.template_term_deskVM_label,
                "vsa_template":$scope.i18n.template_term_VSA_label,
                "pvm_template":$scope.i18n.template_term_PVM_label
            };

            $scope.vmTemplateTable = {
                label: $scope.i18n.resource_term_associateVMtemplate_button+":",
                require: false,
                caption: "",
                data: [],
                id: "vmTemplateTableID",
                columnsDraggable: false,
                enablePagination: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.group);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.virtual_term_cluster_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.clusterName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(4)", row).addTitle();


                    $("td:eq(1)", row).html($scope.vmtType[dataitem.group]);
                    $("td:eq(2)", row).html($scope.vmtStatus[dataitem.status]);
                }
            };

           $scope.clusterType = {
                "0":$scope.i18n.common_term_unknown_value,
                "1":$scope.i18n.common_term_virtualization_label,
                "2":$scope.i18n.virtual_term_bareCluster_label,
                "3":$scope.i18n.virtual_term_manageCluster_label || "管理集群",
                "4":$scope.i18n.common_term_databaseCluster_label,
                "5":$scope.i18n.resource_term_storageCluster_label
           };

            $scope.clusterTable = {
                label: $scope.i18n.template_term_associateWithoutCluster_value+":",
                require: false,
                caption: "",
                data: [],
                id: "clusterTableID",
                columnsDraggable: true,
                enablePagination: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_domain_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.domain);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(4)", row).addTitle();

                    //数据转化
                    $("td:eq(1)", row).html($scope.clusterType[dataitem.type]);
                }
            };

            $scope.operator = {
                "clusterQuery":function() {
                    var deferred = camel.get({
                        "url": {"s":constants.rest.LOGIC_TEMPLATE_CLUSTER.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify({
                            "start":0,
                            "limit":1000
                        }),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data == undefined) {
                            return;
                        }

                        var cluster = {};
                        for (var index in $scope.vmTemplateTable.data) {
                            var clusterID = $scope.vmTemplateTable.data[index].clusterId;
                            cluster[clusterID] = clusterID;
                        }
                        $scope.$apply(function () {
                            for (var index in data.resourceClusters) {
                                if (cluster.hasOwnProperty(data.resourceClusters[index].indexId)) {
                                    data.resourceClusters.splice(index, 1);
                                }
                            }

                            $scope.clusterTable.data = data.resourceClusters;
                        });
                    });
                }
            };

            $scope.templateStatus = {
                "active":$scope.i18n.common_term_activate_value,
                "inactive":$scope.i18n.common_term_noActivation_value
            };

            $scope.init = function () {
                var deferred = camel.get({
                    "url": {"s": constants.rest.LOGIC_TEMPLATE_DETAIL.url, "o": {"tenant_id": 1, "id": $scope.templateID}},
                    "userId": $("html").scope().user && $("html").scope().user.id
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        $scope.vmTemplateTable.data = data.associatedVMTemplates;

                        $scope.logicVmtDetail = data.basicInfo;

                        $scope.logicVmtDetail.vmLogicTemplateStatus = $scope.templateStatus[$scope.logicVmtDetail.vmLogicTemplateStatus];


                        $scope.operator.clusterQuery();
                    });
                });
            };

            $scope.init();

        }];

        var deps = [];
        var logicVmtDetailApp = angular.module("resources.template.logicVmtDetail", deps);
        logicVmtDetailApp.controller("resources.template.logicVmtDetail.ctrl", logicVmtDetailCtrl);
        logicVmtDetailApp.service("camel", httpService);

        return logicVmtDetailApp;
    });
