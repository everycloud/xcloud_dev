/**
 * 虚拟机规格详情
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "app/business/resources/controllers/constants"],
    function ($, angular, httpService, constants) {
        "use strict";

        var vmSpecDetailCtrl = ["$scope", "camel", function ($scope, camel) {

            $scope.detail = {
                'name':"",
                'id':""
            };

            $scope.cpu = {
                label: $scope.i18n.common_term_cpuNum_label+":",
                require: false,
                "value":""
            };

            $scope.memory = {
                label: $scope.i18n.common_term_memoryMB_label+":",
                require: false,
                "value":""
            };

            $scope.cpuConfig = {
                label: $scope.i18n.vm_term_CPUcontrol_label + ":",
                require: false,
                "share":"",
                "limit":"",
                "reserve":""
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "value":""
            };

            $scope.memoryConfig = {
                label: $scope.i18n.vm_term_memControl_label+":",
                require: false,
                "share":"",
                "reserve":""
            };

            $scope.diskTable = {
                label: $scope.i18n.common_term_diskInfo_label+":",
                require: false,
                caption: "",
                data: [],
                id: "vmtDetailDiskTableId",
                columnsDraggable: false,
                enablePagination: false,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_disk_label || "磁盘",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.index);
                        },
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacityGB_label || "容量(GB)",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.diskSize);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageMedia_label || "存储介质",
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.media);
                        },
                        "bSearchable": false,
                        "bSortable": false
                    }
                ],
                renderRow: function (row, dataitem, index) {
                    $("td:eq(0)", row).html($scope.i18n.common_term_disk_label+dataitem.index);
                }
            };

            /**
             * 查询详情
             */
            $scope.queryDetail = function (data) {
                $scope.$apply(function () {
                    $scope.detail.id = data.flavorId;
                    $scope.detail.name = data.name;
                    $scope.cpu.value = data.cpuCount;
                    $scope.memory.value = data.memSize;
                    $scope.description.value = data.desc;
                    for (var index in data.disks) {
                        if (data.disks[index].media == "SAN-Any") {
                            data.disks[index].media = "Any";
                        }
                    }
                    $scope.diskTable.data = data.disks;

                    $scope.cpuConfig.share = data.qos.cpuShare;
                    $scope.cpuConfig.limit = data.qos.cpuLimit;
                    $scope.cpuConfig.reserve = data.qos.cpuReserve;
                    $scope.memoryConfig.share = data.qos.memShare;
                    $scope.memoryConfig.reserve = data.qos.memReserve;
                });
            };
        }];

        var dependency = [];

        var vmSpecDetailModule = angular.module("template.vmSpec.detail", []);

        vmSpecDetailModule.controller("template.vmSpec.detail.ctrl", vmSpecDetailCtrl);
        vmSpecDetailModule.service("camel", httpService);

        return vmSpecDetailModule;
    });

