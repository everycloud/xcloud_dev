define(["jquery",
    "tiny-lib/angular",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    'tiny-widgets/Radio',
    'app/services/exceptionService'],
    function ($, angular, httpService, UnifyValid, constants, Radio, exceptionService) {
        "use strict";

        var associateCtrl = ["$scope", "$compile", "camel", "exception", function ($scope, $compile, camel, exception) {

            $scope.model = {
                "id":$("#associateWinID").widget().option("vmtId"),
                "name": $("#associateWinID").widget().option("vmtName"),
                "logicVmtName":"",
                "logicVmtID":""
            };

            $scope.searchModel = {
                name:"",
                status:"INACTIVE",
                osVersion:"",
                systemDiskSize:"",
                start: "0",
                limit: "10"
            };

            $scope.selectedLogicVmt = undefined;

            var addOperatorDom = function (dataItem, row, index) {
                var options = {
                    "id" : "logicVmt_" + dataItem.id,
                    "value" : "logicVmtValue_" + dataItem.id,
                    "name" : "logicVmtChecked",
                    "checked" : index === 0,
                    "change" : function() {
                        $scope.selectedLogicVmt = dataItem;
                    }
                };
                var radio = new Radio(options);
                $("td:eq(0)", row).html(radio.getDom());
            };

            $scope.logicVmtTable = {
                caption: "",
                data: [],
                id: "logicVmtTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: 0,
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vmLogicTemplateName);
                        },
                        "sWidth": "20%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.vmLogicTemplateStatus);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_sysDiskSizeGB_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.systemDiskSize);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OS_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.osType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OSversion_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.osVersion);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.queryLogicVmt();
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.start = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.queryLogicVmt();
                },
                renderRow: function (row, dataitem, index) {

                    // 增加tip属性
                    $("td:eq(1)", row).addTitle();
                    $("td:eq(5)", row).addTitle();
                    $("td:eq(2)", row).html($scope.status[dataitem.vmLogicTemplateStatus]);

                    // 添加操作
                    addOperatorDom(dataitem, row, index);
                }
            };

            $scope.status = {
                "active":$scope.i18n.common_term_activate_value,
                "inactive":$scope.i18n.common_term_noActivation_value
            };

            $scope.refresh = {
                id: "vmtRefresh_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                click: function () {
                    $scope.operator.queryLogicVmt();
                }
            };

            $scope.searchBox = {
                "id": "vmtSearchBox",
                "placeholder": $scope.i18n.template_term_findLogicTemplate_prom,
                "type":"round",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.name = searchString;
                    $scope.operator.queryLogicVmt();
                }
            };

            $scope.saveBtn = {
                id: "associateLogicSaveBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_complete_label,
                tip: "",
                save: function () {

                    if ($scope.selectedLogicVmt === undefined) {
                        return;
                    }

                    $scope.operator.associate();
                }
            };

            $scope.cancelBtn = {
                id: "associateLogicCancelBtn",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $("#associateWinID").widget().destroy();
                }
            };

            $scope.buttonGroup = {
                label: "",
                require: false
            };

            $scope.operator = {
                "vmtDetail":function() {
                    var deferred = camel.get({
                        "url": {"s": constants.rest.VM_TEMPLATE_DETAIL.url, "o": {"tenant_id": 1, "id": $scope.model.id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            if (!data) {
                                return;
                            }

                            $scope.searchModel.osVersion = data.osOption && data.osOption.osVersion;
                            $scope.searchModel.systemDiskSize = data.diskdetail && data.diskdetail[0] && data.diskdetail[0].quantity;
                            $scope.operator.queryLogicVmt();
                        });
                    });
                },
                "queryLogicVmt": function () {
                    var start = $scope.searchModel.start == 0 ? 1 : $scope.searchModel.start;
                    $scope.searchModel.start = $scope.searchModel.limit * (start - 1);

                    var deferred = camel.get({
                        "url": {"s": constants.rest.LOGIC_TEMPLATE_QUERY.url, "o": {"tenant_id": 1}},
                        "params": $scope.searchModel,
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {

                            // 获取数据
                            $scope.logicVmtTable.data = data.vmLogicTemplates;
                            $scope.logicVmtTable.totalRecords = data.total;

                            if (data.total > 0) {
                                $scope.selectedLogicVmt = data.vmLogicTemplates[0]
                            }
                        });
                    });
                    $scope.searchModel.start = start;
                },
                "associate": function () {
                    if ($scope.selectedLogicVmt === undefined) {
                        return;
                    }

                    var id = $("#associateWinID").widget().option("vmtId");

                    var associate = {
                        "associate": {
                            "vmTemplateId": id,
                            "vmLogicTemplateId": $scope.selectedLogicVmt.vmLogicTemplateID
                        },
                        "disassociate": null,
                        "lock": null,
                        "unlock": null,
                        "convertToVM": null,
                        "convertToVMTemplate": null,
                        "synchron": null,
                        "importt": null
                    };

                    var deferred = camel.post({
                        "url": {"s": constants.rest.VM_TEMPLATE_ASSOCIATE.url, "o": {"tenant_id": 1, "id": id}},
                        "params": JSON.stringify(associate),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });

                    deferred.success(function (data) {
                        $("#associateWinID").widget().destroy();
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            $scope.init = function () {
                $scope.operator.vmtDetail();
            };

            $scope.init();
        }];

        var deps = [];
        var modifyIOSApp = angular.module("resources.template.associateLogicVmt", deps);
        modifyIOSApp.controller("resources.template.associateLogicVmt.ctrl", associateCtrl);
        modifyIOSApp.service("camel", httpService);
        modifyIOSApp.service("exception", exceptionService);

        return modifyIOSApp;
    });
