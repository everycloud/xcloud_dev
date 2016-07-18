/* global define */
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/httpService",
    "app/business/multiPool/services/poolInfo/vmTemplate/templateService",
    "fixtures/tenantTemplateFixture"
],
    function ($, angular, Window, http, TemplateService) {
        "use strict";
        var vmTemplateDetailCtrl = ["$scope", "camel", "$q",
            function ($scope, camel, $q) {

                var exception = $(".vmTemplate-detail").scope.exception;
                var templateServiceIns = new TemplateService(exception, $q, camel);
                //当前用户信息
                var user = $("html").scope().user;
                var i18n = $("html").scope().i18n;
                $scope.spec = {
                    "label": i18n.common_term_spec_label + ":"
                };
                $scope.vmTemplateDesc = {
                    "label": i18n.common_term_desc_label + ":",
                    "value": ""
                };
                $scope.cpu = {
                    "id": "VMTemplateCPUId",
                    "label": i18n.common_term_cpu_label + ":",
                    "unit1": i18n.common_term_entry_label,
                    "value": ""
                };
                $scope.memory = {
                    "id": "VMTemplateMemoryId",
                    "label": i18n.common_term_memory_label + ":",
                    "unit2": i18n.common_term_MB_label,
                    "value": ""
                };
                $scope.disk = {
                    "label": i18n.common_term_disk_label + ":"
                };
                $scope.diskListTable = {
                    "id": "distListTableId",
                    "pagination": false,
                    "columns": [
                        {
                            "sTitle": i18n.common_term_diskName_label,
                            "mData": "name",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": i18n.common_term_capacityGB_label,
                            "mData": "quantity",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": i18n.common_term_storageMedia_label,
                            "mData": "mediaType",
                            "sWidth": "10%"
                        }
                    ],
                    "data": []
                };

                //查询详情
                $scope.queryDetail = function (vmtId, cloudInfraId) {
                    var options = {
                        "user": user,
                        "vmtId": vmtId,
                        "cloudInfraId": cloudInfraId
                    };

                    var promise = templateServiceIns.queryVmTemplateDetail(options);
                    promise.then(function (data) {
                        if (data) {
                            $scope.vmTemplateDesc.value = data.description;
                            data.cpuInfo && ($scope.cpu.value = data.cpuInfo.quantity);
                            data.memoryInfo && ($scope.memory.value = data.memoryInfo.quantity);
                            data.diskdetail && ($scope.diskListTable.data = data.diskdetail);
                        }
                    });
                };
            }
        ];
        var vmTemplateDetailModel = angular.module("template.vmTemplate.detail", ["ng", "wcc"]);
        vmTemplateDetailModel.controller("template.vmTemplate.detail.ctrl", vmTemplateDetailCtrl);
        vmTemplateDetailModel.service("camel", http);
        return vmTemplateDetailModel;
    });
