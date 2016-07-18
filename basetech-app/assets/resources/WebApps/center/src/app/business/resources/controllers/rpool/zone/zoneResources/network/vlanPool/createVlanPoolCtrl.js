define(['jquery',
    'tiny-lib/angular',
    'tiny-widgets/Checkbox',
    "bootstrapui/ui-bootstrap-tpls",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/business/resources/controllers/constants',
    "app/services/exceptionService",
    'app/services/validatorService'],
    function ($, angular, Checkbox, uibootstrap, UnifyValid, httpService, constants, ExceptionService, validatorService) {
        "use strict";
        var createVlanPoolCtrl = ["$scope", 'camel', 'validator', '$sce', function ($scope, camel, validator, $sce) {
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.i18n = $("html").scope().i18n;
            $scope.resource_vlan_add_para_function_mean_tip = $sce.trustAsHtml($scope.i18n.resource_vlan_add_para_function_mean_tip);
            $scope.resource_vlan_add_info_dvs_label = $sce.trustAsHtml($scope.i18n.resource_vlan_add_info_dvs_label);
            UnifyValid.endVlan = function () {
                var startVlan = $('#' + $scope.startVlanID.id).widget().getValue();
                var inputValue = $('#' + $scope.endVlanID.id).widget().getValue();
                if (parseInt(startVlan, 10) > parseInt(inputValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            };

            UnifyValid.endVxlan = function () {
                var startVlan = $('#' + $scope.startVxlanID.id).widget().getValue();
                var inputValue = $('#' + $scope.endVxlanID.id).widget().getValue();
                if (parseInt(startVlan, 10) > parseInt(inputValue, 10)) {
                    return $scope.i18n.common_term_greaterOriginVLAN_valid;
                } else if (parseInt(inputValue, 10) - parseInt(startVlan, 10) >= 50000) {
                    return $scope.i18n.resource_vlan_add_info_max_label;
                }
                else {
                    return true;
                }
            };
            $scope.zoneInfo = {
                "label": $scope.i18n.resource_term_currentZone_label + ":",
                "require": false,
                "zoneID": $("#createVlanPoolWinID").widget().option("zoneID"),
                "zoneName": $("#createVlanPoolWinID").widget().option("zoneName")
            };
            $scope.businessUsage = true;
            $scope.model = {
                "name": "",
                "vxLanFlag": "",
                "usage": "",
                "startID": "",
                "endID": "",
                "zoneID": "",
                "description": ""
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label + ":",
                require: true,
                "id": "createVlanPoolName",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.name + "):" +
                    $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "width": "215",
                "tooltip": $scope.i18n.common_term_composition2_valid + "<br>" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 64}),
                "tipPosition": "right",
                "value": ""
            };

            $scope.isVxlan = false;
            $scope.type = {
                "label": $scope.i18n.resource_term_vlanPooltype_label + ":",
                "require": true,
                "id": "createVlanPoolType",
                "spacing": {"width": "50px", "height": "20px"},
                "values": [
                    {
                        "key": "false",
                        "text": $scope.i18n.resource_term_vlanPool_label,
                        "tooltip": "",
                        "checked": true,
                        "disabled": false
                    },
                    {
                        "key": "true",
                        "text": $scope.i18n.resource_term_vxlanPool_label,
                        "tooltip": "",
                        "checked": false,
                        "disabled": false
                    }
                ],
                "change": function () {
                    if ("true" == $("#" + $scope.type.id).widget().opChecked("checked")) {
                        $("#" + $scope.usage.id).widget().opDisabled("management", true);
                        $scope.isVxlan = true;
                    }
                    else {
                        $("#" + $scope.usage.id).widget().opDisabled("management", false)
                        $scope.isVxlan = false;
                    }
                }
            };
            $scope.usage = {
                "label": $scope.i18n.common_term_useScene_label + ":",
                "require": true,
                "id": "createVlanPoolUsage",
                "spacing": {"width": "50px", "height": "20px"},
                "values": [
                    {
                        "key": "business",
                        "text": $scope.i18n.common_term_serviceVLAN_label,
                        "tooltip": "",
                        "checked": true
                    },
                    {
                        "key": "management",
                        "text": $scope.i18n.resource_vlan_add_para_type_option_connectDevice_msg,
                        "tooltip": "",
                        "checked": false
                    }
                ],
                "change": function () {
                    if ("business" == $("#" + $scope.usage.id).widget().opChecked("checked")) {
                        $scope.businessUsage = true;
                    }
                    else {
                        $scope.businessUsage = false;
                    }
                }
            }

            $scope.startVlanID = {
                label: $scope.i18n.common_term_initiativeVALN_label + ":",
                require: true,
                "id": "createVlanPoolStartID",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(4094):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 4094}) + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 4094}),
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 4094}),
                "tipPosition": "right"
            };

            $scope.endVlanID = {
                label: $scope.i18n.common_term_endVLAN_label + ":",
                require: true,
                "id": "createVlanPoolEndID",
                "extendFunction": ["endVlan"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(4094):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 4094}) + ";endVlan:" +
                    $scope.i18n.common_term_greaterOriginVLAN_valid,
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 1, 2: 4094}),
                "tipPosition": "right"
            };
            $scope.startVxlanID = {
                label: $scope.i18n.common_term_initiativeVALN_label + ":",
                require: true,
                "id": "createVxlanPoolStartID",
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(16777215):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 4096, 2: 16777215}) + ";minValue(4096):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 4096, 2: 16777215}),
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: 4096, 2: 16777215}),
                "tipPosition": "right"
            };

            $scope.endVxlanID = {
                label: $scope.i18n.common_term_endVLAN_label + ":",
                require: true,
                "id": "createVxlanPoolEndID",
                "extendFunction": ["endVxlan"],
                "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_integer_valid +
                    ";maxValue(16777215):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 4096, 2: 16777215}) + ";endVxlan",
                "width": "215",
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 4096, 2: 16777215}),
                "tipPosition": "right"
            };
            $scope.dvs = {
                label: $scope.i18n.resource_term_associateDVS_button + ":",
                require: false,
                table: {
                    data: [],
                    id: "dvsTableId",
                    columnsDraggable: true,
                    enablePagination: false,
                    columns: [
                        {
                            "sTitle": "",
                            "mData": "",
                            "bSortable": false,
                            "sWidth": "40",
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
                        },
                        {
                            "sTitle": $scope.i18n.virtual_term_cluster_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.clusterName);
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
                    callback: function (eveObj) {
                    },
                    renderRow: function (row, dataitem, index) {
                        //复选框checkbox
                        var options = {
                            "id": "dvsCheckbox" + index,
                            "checked": false,
                            "change": function () {
                                if ($("#" + options.id).widget().option("checked")) {
                                    if ($scope.operate.isAllChecked()) {
                                        $("#headDvsCheckbox").widget().option("checked", true);
                                    }
                                }
                                else {
                                    $("#headDvsCheckbox").widget().option("checked", false);
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('td:eq(0)', row).html(checkbox.getDom());
                    }
                }
            };
            $scope.description = {
                label: $scope.i18n.common_term_desc_label + ":",
                require: false,
                "id": "createDvsDescription",
                "value": "",
                "type": "multi",
                "width": "215px",
                "height": "40px",
                "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024}),
                "tipPosition": "right"
            };

            $scope.createBtn = {
                "label": "",
                "id": "createVlanPoolBtn",
                "text": $scope.i18n.common_term_create_button,
                "tooltip": "",
                "click": function () {
                    var valid = UnifyValid.FormValid($("#resources_vlanPool_createInfo"));
                    if (!valid) {
                        return;
                    }
                    // 创建Vlan池
                    $scope.model.zoneID = $scope.zoneInfo.zoneID;
                    $scope.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.model.vxLanFlag = $scope.isVxlan;
                    if ($scope.isVxlan) {
                        $scope.model.startID = $("#" + $scope.startVxlanID.id).widget().getValue();
                        $scope.model.endID = $("#" + $scope.endVxlanID.id).widget().getValue();
                    }
                    else {
                        $scope.model.startID = $("#" + $scope.startVlanID.id).widget().getValue();
                        $scope.model.endID = $("#" + $scope.endVlanID.id).widget().getValue();
                    }
                    $scope.model.usage = $("#" + $scope.usage.id).widget().opChecked("checked");
                    $scope.model.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.operate.createVlanPool($scope.model);
                }
            };

            $scope.cancelBtn = {
                "id": "createVlanPoolCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $("#createVlanPoolWinID").widget().destroy();
                }
            };

            $scope.operate = {
                //查询DVS数据
                query: function () {
                    var queryConfig = constants.rest.DVS_QUERY
                    var url = queryConfig.url;
                    if ($scope.vxlan) {
                        url = url + "&supportvxlan={supportvxlan}";
                    }
                    var deferred = camel.get({
                        "url": {s: url, o: {"zoneid": $scope.zoneInfo.zoneID, "start": 0, "limit": 100, "name": "", "hypervisorid": "", "supportvxlan": $scope.vxlan }},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        //查询数据
                        $scope.$apply(function () {
                            for (var index in response.dvses) {
                                var clusterName = [];
                                for (var key in response.dvses[index].clusterIDsMapNames) {
                                    clusterName.push(response.dvses[index].clusterIDsMapNames[key]);
                                }
                                response.dvses[index].clusterName = clusterName.join(";");
                            }
                            $scope.dvs.table.data = response.dvses;
                        });
                        //初始化表头的复选框
                        var options = {
                            "id": "headDvsCheckbox",
                            "checked": $scope.operate.isAllChecked(),
                            "change": function () {
                                var isChecked = $("#" + options.id).widget().options.checked;
                                $scope.operate.setCheckbox(isChecked)
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $('#dvsTableId th:eq(0)').html(checkbox.getDom());
                    })
                },
                //创建VLAN池
                createVlanPool: function (params) {
                    var createConfig = constants.rest.VLAN_POOL_CREATE;
                    var deferred = camel.post({
                        url: createConfig.url,
                        type: createConfig.type,
                        params: JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var vlanId = response.id;
                        if (!$scope.businessUsage || $scope.operate.isNoneChecked()) {
                            $("#createVlanPoolWinID").widget().destroy();
                            $("#vlanPoolRefresh_id").click();
                        }
                        else {
                            var dvsIdList = [];
                            for (var index in $scope.dvs.table.data) {
                                var id = "dvsCheckbox" + index;
                                if ($("#" + id).widget().option("checked")) {
                                    dvsIdList.push($scope.dvs.table.data[index].id)
                                }
                            }
                            $scope.operate.associate({
                                associateVlanPool2DVS: {
                                    'id': vlanId,
                                    'dvsIDs': dvsIdList
                                }
                            });
                        }
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                //关联
                associate: function (params) {
                    var associateConfig = constants.rest.DVS_ASSOCIATE;
                    var deferred = camel.post({
                        "url": {s: associateConfig.url, o: {"tenant_id": 1}},
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#createVlanPoolWinID").widget().destroy();
                        $("#vlanPoolRefresh_id").click();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                        $("#createVlanPoolWinID").widget().destroy();
			$("#vlanPoolRefresh_id").click();
                    });
                },
                //设置复选框的选中状态
                setCheckbox: function (param) {
                    for (var index in $scope.dvs.table.data) {
                        var id = "dvsCheckbox" + index;
                        $("#" + id).widget().option("checked", param);
                    }
                },
                //复选框是否全部选中
                isAllChecked: function () {
                    for (var index in $scope.dvs.table.data) {
                        var id = "dvsCheckbox" + index;
                        if (!$("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                },
                //复选框是否全部选中
                isNoneChecked: function () {
                    for (var index in $scope.dvs.table.data) {
                        var id = "dvsCheckbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                }
            };
            $scope.operate.query();
        }];

        // 创建App
        var deps = ["ui.bootstrap"];
        var createVlanPoolApp = angular.module("resources.zoneResources.createVlanPool", deps);
        createVlanPoolApp.controller("resources.zoneResources.createVlanPoolCtrl", createVlanPoolCtrl);
        createVlanPoolApp.service("camel", httpService);
        createVlanPoolApp.service("validator", validatorService);
        return createVlanPoolApp;
    });
