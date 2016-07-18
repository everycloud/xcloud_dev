define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Checkbox',
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/validatorService',
    "app/services/exceptionService",
    'app/business/resources/controllers/constants'],
    function ($, angular, Checkbox, unifyValid, httpService, validatorService, ExceptionService, constants) {
        "use strict";
        var createDvsCtrl = ["$scope", "camel", "validator", function ($scope, camel, validator) {
                var $rootScope = $("html").injector().get("$rootScope");
                $scope.i18n = $("html").scope().i18n;
                var data = $("#createDVSWinID").widget().option("data");
                var vsses = [];
                $scope.zoneInfo = {
                    "label": $scope.i18n.resource_term_currentZone_label + ":",
                    "require": false,
                    "zoneID": $("#createDVSWinID").widget().option("zoneID"),
                    "zoneName": $("#createDVSWinID").widget().option("zoneName")
                };

                $scope.model = {
                    "name": "",
                    "zoneID": $scope.zoneInfo.zoneID,
                    "hypervisorID": "",
                    "vssIDs": [],
                    "description": ""
                };

                $scope.name = {
                    "label": $scope.i18n.common_term_name_label + ":",
                    "require": true,
                    "id": "createDvsName",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                        $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                    "width": "215",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}) + "<br>" + $scope.i18n.common_term_composition2_valid,
                    "value": ""
                };

                $scope.hypervisor = {
                    "label": $scope.i18n.virtual_term_hypervisor_label + ":",
                    "require": true,
                    "id": "createDvsHyper",
                    "width": "215",
                    "values": [],
                    "disable": data != null,
                    "change": function () {
                        var hyperId = $("#" + $scope.hypervisor.id).widget().getSelectedId();
                        $scope.operator.queryVss(hyperId);
                    }
                };

                $scope.vssTable = {
                    label: "VSS:",
                    require: false,
                    caption: "",
                    data: [],
                    id: "vssTableId",
                    columnsDraggable: true,
                    enablePagination: false,
                    enableFilter: false,
                    curPage: 0,
                    totalRecords: 0,
                    hideTotalRecords: false,
                    columns: [
                        {
                            "sTitle": "",
                            "mData": "",
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.vssName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_cluster_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.clusterName);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": $scope.i18n.common_term_host_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.hostID);
                            },
                            "bSortable": false
                        }
                    ],
                    renderRow: function (row, dataitem, index) {
                        var checked = false;
                        if (data) {
                            checked = $.inArray(dataitem.vssID, vsses) >= 0;
                        }
                        //复选框checkbox
                        var options = {
                            "id": "checkbox" + index,
                            "checked": checked,
                            "change": function () {
                                if ($("#" + options.id).widget().option("checked")) {
                                    $("#" + $scope.createBtn.id).widget().option("disable", false);
                                    if ($scope.operator.isCheckboxAllChecked()) {
                                        $("#tableCheckbox").widget().option("checked", true);
                                    }
                                }
                                else {
                                    $("#tableCheckbox").widget().option("checked", false);
                                    if ($scope.operator.isCheckboxCheckedNone()) {
                                        $("#" + $scope.createBtn.id).widget().option("disable", true);
                                    }
                                    else {
                                        $("#" + $scope.createBtn.id).widget().option("disable", false);
                                    }
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', row).html(checkbox.getDom());
                    }
                };

                $scope.description = {
                    label: $scope.i18n.common_term_desc_label + ":",
                    require: false,
                    "id": "createDvsDescription",
                    "value": "",
                    "type": "multi",
                    "width": "215",
                    "height": "40",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                };

                $scope.createBtn = {
                    "label": "",
                    "id": "createDvsBtn",
                    "text": $scope.i18n.common_term_create_button,
                    "disable": true,
                    "click": function () {
                        var valid = unifyValid.FormValid($(".network-createDvs"));
                        if (!valid) {
                            return;
                        }
                        // 创建DVS
                        $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                        $scope.model.description = $("#" + $scope.description.id).widget().getValue();
                        $scope.model.hypervisorID = $("#" + $scope.hypervisor.id).widget().getSelectedId();
                        var vssIDs = [];
                        for (var index in $scope.vssTable.data) {
                            var id = "checkbox" + index;
                            if ($("#" + id).widget().option("checked")) {
                                vssIDs.push($scope.vssTable.data[index].vssID);
                            }
                        }
                        $scope.model.vssIDs = vssIDs;
                        if (data) {
                            $scope.operator.updateDvs();
                        }
                        else {
                            $scope.operator.createDvs();
                        }
                    }
                };

                $scope.cancelBtn = {
                    "id": "createDvsCancel",
                    "text": $scope.i18n.common_term_cancle_button,
                    "tooltip": "",
                    "click": function () {
                        $("#createDVSWinID").widget().destroy();
                    }
                };

                $scope.operator = {
                    "init": function () {
                        if (data) {
                            $scope.name.value = data.name;
                            $scope.description.value = data.description;
                            $scope.createBtn.text = $scope.i18n.common_term_modify_button;
                            $scope.createBtn.disable = false;
                            var vssList = data.vsses;
                            for (var index in vssList) {
                                vsses.push(vssList[index].vssID)
                            }
                            $scope.operator.queryVss(data.hypervisorID);
                        }
                    },
                    "queryVss": function (hypervisorid) {
                        var queryConfig = constants.rest.VSS_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"zoneid": $scope.zoneInfo.zoneID, "hypervisorid": hypervisorid}},
                            "type": "post",
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var vsses = response.vsses;
                            if (data) {
                                if (vsses) {
                                    vsses = vsses.concat(data.vsses);
                                }
                                else {
                                    vsses = data.vsses;
                                }
                            }
                            $scope.$apply(function () {
                                $scope.vssTable.data = vsses;
                            });
                            //初始化表头的复选框
                            var options = {
                                "id": "tableCheckbox",
                                "checked": $scope.operator.isCheckboxAllChecked(),
                                "change": function () {
                                    var isChecked = $("#" + options.id).widget().options.checked;
                                    $scope.operator.setCheckbox(isChecked);
                                    $("#" + $scope.createBtn.id).widget().option("disable", $scope.operator.isCheckboxCheckedNone());
                                }
                            };
                            var checkbox = new Checkbox(options);
                            $('#vssTableId th:eq(0)').html(checkbox.getDom());
                        });
                    },
                    //查询所有虚拟化环境
                    "queryHypers": function () {
                        var deferred = camel.get({
                            "url": {s: "/goku/rest/v1.5/irm/{tenant_id}/hypervisors", o: {"tenant_id": "1"}},
                            "type": "get",
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            var hypervisors = response.hypervisors;
                            var values = [];
                            for (var index in hypervisors) {
                                if (hypervisors[index].type.toUpperCase() == "VMWARE") {
                                    var hyper = {
                                        "selectId": hypervisors[index].id,
                                        "label": hypervisors[index].name,
                                        "checked": data != null && data.hypervisorID == hypervisors[index].id
                                    }
                                    values.push(hyper);
                                }
                            }
                            $("#" + $scope.hypervisor.id).widget().option("values", values);
                        })
                    },
                    //设置复选框选中状态
                    setCheckbox: function (param) {
                        for (var index in $scope.vssTable.data) {
                            var id = "checkbox" + index;
                            $("#" + id).widget().option("checked", param);
                        }
                    },
                    //复选框是否全部选中
                    isCheckboxAllChecked: function () {
                        for (var index in $scope.vssTable.data) {
                            var id = "checkbox" + index;
                            if (!$("#" + id).widget().option("checked")) {
                                return false;
                            }
                        }
                        return true;
                    },

                //复选框是否没有一个选中
                isCheckboxCheckedNone: function () {
                    for (var index in $scope.vssTable.data) {
                        var id = "checkbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },
                updateDvs: function () {
                    var updateConfig = constants.rest.DVS_UPDATE;
                    var modifyParam = {};
                    modifyParam.name = $scope.model.name;
                    modifyParam.description = $scope.model.description;
                    modifyParam.vssIDs = $scope.model.vssIDs
                    var deferred = camel.put({
                        url: {s: updateConfig.url, o: {"id": data.id}},
                        type: updateConfig.type,
                        params: JSON.stringify(modifyParam),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#createDVSWinID").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                createDvs: function () {
                    var createConfig = constants.rest.DVS_CREATE;
                    var deferred = camel.post({
                        url: createConfig.url,
                        type: createConfig.type,
                        params: JSON.stringify($scope.model),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#createDVSWinID").widget().destroy();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            var params = {
                "list": {
                    "hypervisorName": "",
                    "hypervisorType": "vmware",
                    "hypervisorVersion": "",
                    "hypervisorIp": "",
                    "hypervisorPort": "",
                    "hypervisorConnectStatus": "",
                    "limit": 100,
                    "start": 0
                }
            }
            // 初始化数据
            $scope.operator.init();
            // 初始化VSS数据
            $scope.operator.queryHypers();
        }];

        // 创建App
        var deps = [];
        var createDvsApp = angular.module("resources.zoneResources.createDvs", deps);
        createDvsApp.controller("resources.zoneResources.createDvsCtrl", createDvsCtrl);
        createDvsApp.service("validator", validatorService);
        createDvsApp.service("camel", httpService);
        return createDvsApp;
    })
;
