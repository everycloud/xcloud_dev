/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Select, Window, Message, httpService,validatorService, UnifyValid, Exception) {
        "use strict";

        var clusterOfAzCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#editDisasterWindow").widget();
            var zoneId = window.option("zoneId");
            var disasterId = window.option("disasterId");
            //当前所选存储
            var selectedDisaster = [];
            //存储组原有成员
            var disasterMember = [];
            var storeTypes = {
                "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
                "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
                "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
                "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
                "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
                "NAS":$scope.i18n.common_term_NAS_label
            };
            $scope.nameTextbox = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "editDisasterNameTextbox",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid,
                "width": "200"
            };
            $scope.descTextbox = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "editDisasterDescTextbox",
                "value": "",
                "width": "200",
                "height":"50",
                "type": "multi",
                "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"})
            };
            //添加容灾存储按钮
            $scope.addDisasterButton = {
                "id": "addDisasterButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addDisasterWindow",
                        "zoneId": zoneId,
                        "selectedDisaster":selectedDisaster,
                        "disasterMember":disasterMember,
                        "title":  $scope.i18n.resource_term_addDisasterStor_button,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/rpool/zone/zoneResources/storage/disasterRecovery/addDisaster.html",
                        "height": 400,
                        "width": 600,
                        "close": function () {
                            $("#" + $scope.disasterTable.id).widget().option("data", selectedDisaster);
                        }
                    });
                    newWindow.show();
                }
            };
            //容灾存储列表
            $scope.disasterTable = {
                "id": "editDisasterTable",
                "data": null,
                "enablePagination": false,
                "columnsDraggable": true,
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
                        "sTitle":  $scope.i18n.common_term_capacityTotalGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.totalCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":$scope.i18n.perform_term_allocatedCapacity_label+"(GB)",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.usedSizeGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.perform_term_factAvailableCapacityGB_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.capacity.freeCapacityGB);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storageDevice_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.storageunitname);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return "";
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        deleteDisaster(aData.id);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(6)", nRow).html(optNode);
                }
            };
            $scope.okButton = {
                "label": "",
                "id": "editDisasterButton",
                "text": $scope.i18n.common_term_ok_button,
                "tooltip": "",
                "click": function () {
                    var result = UnifyValid.FormValid($("#editDisasterDiv"));
                    if (!result) {
                        return;
                    }
                    editDisaster();
                }
            };

            $scope.cancelButton = {
                "id": "editDisasterCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    window.destroy();
                }
            };
            function getDisaster() {
                var params = {
                    list:{
                        scopeType: "DISASTERGROUP",
                        scopeObjectId: disasterId
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/disastergroups/action"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var disaster = data && data.list && data.list.disasterGroups && data.list.disasterGroups[0] || {};
                    var dsInfos = disaster.dsInfos || [];
                    selectedDisaster = dsInfos;
                    for (var i = 0; i < dsInfos.length; i++) {
                        dsInfos[i].type = storeTypes[dsInfos[i].type] || dsInfos[i].type;
                        disasterMember.push(dsInfos[i]);
                    }
                    $scope.$apply(function () {
                        $scope.nameTextbox.value = disaster.name;
                        $scope.descTextbox.value = disaster.description;
                        $scope.disasterTable.data = disaster.dsInfos;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function deleteDisaster(disasterId) {
                var ids = [];
                var data = $scope.disasterTable.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == disasterId) {
                        data.splice(i,1);
                        break;
                    }
                }
                $("#"+$scope.disasterTable.id).widget().option("data",data);
            }

            function editDisaster() {
                var ids = [];
                var data = $scope.disasterTable.data;
                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].id);
                }
                var params = {
                    name: $("#" + $scope.nameTextbox.id).widget().getValue(),
                    description: $("#" + $scope.descTextbox.id).widget().getValue(),
                    ids: ids
                };
                var deferred = camel.put({
                    "url": {s: "/goku/rest/v1.5/irm/1/disastergroups/{groupId}", o: {groupId: disasterId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getDisaster();
        }];

        var editDisasterApp = angular.module("editDisasterApp", ['framework']);
        editDisasterApp.service("camel", httpService);
        editDisasterApp.service("validator", validatorService);
        editDisasterApp.controller("resources.zone.editDisaster.ctrl", clusterOfAzCtrl);
        return editDisasterApp;
    }
);