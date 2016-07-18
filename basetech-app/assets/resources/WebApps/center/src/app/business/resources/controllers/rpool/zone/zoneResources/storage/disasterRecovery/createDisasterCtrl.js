/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"], function ($,angular,Message,Window,Checkbox,httpService,validatorService,UnifyValid,Exception) {
    "use strict";

    var createCtrl = ["$scope","$compile","camel", "validator",
        function ($scope,$compile,camel,validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#createDisasterWindow").widget();
            var zoneId = window.option("zoneId");
            var selectedDisaster = [];
            $scope.label = {
                "name": $scope.i18n.common_term_name_label+":",
                "desc":$scope.i18n.common_term_desc_label+":",
                "member":$scope.i18n.resource_term_disasterStor_label+":"
            };
            $scope.nameTextbox = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "zoneName",
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid,
                "width": "200"
            };
            $scope.descTextbox = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "zoneDescription",
                "value": "",
                "width": "200",
                "height":"50px",
                "type": "multi",
                "validate": "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"})
            };
            //添加容灾存储按钮
            $scope.addButton = {
                "id": "addDisasterButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    addDisasterWindow();
                }
            };
            $scope.disasterTable = {
                "id": "createDisasterTable",
                "data": null,
                "columnsDraggable": true,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":  $scope.i18n.common_term_type_label,
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
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).addTitle();
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(5)', nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        selectedDisaster.splice(iDataIndex, 1);
                        $("#" + $scope.disasterTable.id).widget().option("data", selectedDisaster);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(6)", nRow).html(optNode);
                }
            };
            $scope.createBtn = {
                "label": "",
                "id": "createDisasterButton",
                "text": $scope.i18n.common_term_create_button,
                "tooltip": "",
                "click": function () {
                    var result = UnifyValid.FormValid($("#createDisasterDiv"));
                    if (!result) {
                        return;
                    }
                    createDisaster();
                }
            };

            $scope.cancelBtn = {
                "id": "createDisasterCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    window.destroy();
                }
            };
            function addDisasterWindow() {
                var newWindow = new Window({
                    "winId": "addDisasterWindow",
                    "title": $scope.i18n.resource_term_addDisasterStor_button,
                    "zoneId": zoneId,
                    "selectedDisaster": selectedDisaster,
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
            function createDisaster() {
                var params = {
                    name:$("#"+$scope.nameTextbox.id).widget().getValue(),
                    zoneId:zoneId,
                    description:$("#"+$scope.descTextbox.id).widget().getValue()
                };
                var ids = [];
                for(var i=0;i<selectedDisaster.length;i++){
                    ids.push(selectedDisaster[i].id);
                }
                if(ids.length > 0){
                    params.ids = ids;
                }
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/irm/1/disastergroups"},
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
        }];

    var createModule = angular.module("resources.zone.createDisaster", ["ng"]);
    createModule.service("camel", httpService);
    createModule.service("validator", validatorService);
    createModule.controller("resources.zone.createDisaster.ctrl", createCtrl);
    return createModule;
});