/**
 * Created on 14-3-3.
 */
define(['tiny-lib/jquery',
        'tiny-lib/encoder',
        "tiny-lib/angular",
        "tiny-widgets/Window",
        "app/business/application/controllers/constants",
        "tiny-lib/underscore",
        "tiny-common/UnifyValid"
    ],
    function ($, encoder, angular, Window, constants, _, UnifyValid) {
        "use strict";

        var ctrl = ["$scope", "camel", "$compile", "$state",
            function ($scope, camel, $compile, $state) {
                var i18n = $scope.i18n;
                var addShareData = {
                    "locationId": null,
                    "selVpcId": null,
                    "chosenVmIds": [],
                    "chosenVmData": null
                };
                // ��ǰҳ����Ϣ
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                $scope.createBtn = {
                    "id": "createByCustomAddVmId",
                    "text": i18n.common_term_add_button,
                    "click": function () {
                        addShareData.locationId = $scope.params.locationId;
                        addShareData.chosenVmIds = generateChosenVms();
                        addShareData.chosenVmData = $scope.params.vmTableData;
                        addShareData.selVpcId = $scope.params.selVpcId;
                        var options = {
                            "winId": "app_createByCustom_addVmWin",
                            "title": i18n.template_term_addVM_button,
                            "addShareData": addShareData,
                            "width": "900px",
                            "height": "600px",
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/createByCustom/createAppAddVm.html",
                            "buttons": null,
                            "close": function (event) {
                                $scope.$apply(function () {
                                    $scope.params.vmTableData = addShareData.chosenVmData;
                                    $scope.vmTable.totalRecords = $scope.params.vmTableData.length;
                                    $scope.vmTable.displayLength = page.displayLength;
                                });
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    },
                    "tooltip": "",
                    "disable": false
                };

                $scope.vmTable = {
                    "id": "createByCustomChosenVmTableId",
                    "caption": "vmCaption",
                    "paginationStyle": "full_numbers",
                    "lengthMenu": [10, 20, 30],
                    "draggable": true,
                    "displayLength":10,
                    "totalRecords":0,
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmId);
                        }
                    }, {
                        "sTitle": "IP",
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.ip);
                        }
                    }, {
                        "sTitle": i18n.common_term_startupOrder_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.startOrder);
                        }
                    }, {
                        "sTitle":i18n.common_term_operation_label,
                        "sWidth": "10%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.opt);
                        }
                    }],
                    "data": [],
                    "columnVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0, 9],
                        "bRestore": true,
                        "fnStateChange": function (index, state) {}
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var startOrderInput = "<div><tiny-textbox id='id' value='value' width='60' tooltip='tooltips' validate='validate' change='change()'></tiny-textbox></div>";
                        var startOrderLink = $compile($(startOrderInput));
                        var startOrderScope = $scope.$new();
                        startOrderScope.id = "createByCustom-ChosenVmTable-configStartOrder" + iDataIndex;
                        startOrderScope.value = aData.startOrder;
                        startOrderScope.tooltips = "1~1024";
                        startOrderScope.validate = "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "1024") + ";maxValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "1024") + ";minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1", "1024") + ";";
                        startOrderScope.change = function () {
                            var startOrder = $("#createByCustom-ChosenVmTable-configStartOrder" + iDataIndex).widget().getValue();
                            if (startOrder) {
                                $scope.params.vmTableData[iDataIndex].startOrder = startOrder;
                            }
                        };
                        var startOrderNode = startOrderLink(startOrderScope);
                        $("td:eq(3)", nRow).html(startOrderNode);

                        var delOperation = "<a href='javascript:void(0)' ng-click='delete()'>"+i18n.common_term_delete_button+"</a>";
                        var delLink = $compile($(delOperation));
                        var delScope = $scope.$new();
                        delScope.id = "createByCustom-ChosenVmTable-deleteId";
                        delScope["delete"] = function () {
                            var vmTable = $scope.params.vmTableData;
                            var newVmTable = [];
                            if (vmTable.length > 0) {
                                for (var i = 0; i < vmTable.length; i++) {
                                    if (iDataIndex !== i) {
                                        newVmTable.push(vmTable[i]);
                                    }
                                }
                            }
                            $scope.params.vmTableData = newVmTable;
                        };
                        var delNode = delLink(delScope);
                        $("td:eq(4)", nRow).html(delNode);
                    }
                };

                $scope.preBtn = {
                    "id": "createApp-baseInfo-preBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = {
                            "baseInfo": true,
                            "associateVM": false,
                            "confirm": false
                        };
                        $("#createByCustom-app-step").widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "createApp-baseInfo-nextBtn",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#createByCustom_associate"));
                        if (!valid) {
                            return;
                        }

                        $scope.service.show = {
                            "baseInfo": false,
                            "associateVM": false,
                            "confirm": true
                        };

                        $("#createByCustom-app-step").widget().next();
                        $scope.$emit($scope.events.associateNext);
                    }
                };
                $scope.cancelBtn = {
                    "id": "createApp-baseInfo-cancel",
                    "text":i18n.common_term_cancle_button,
                    "click": function () {
                        if (constants.fromFlag.FROM_APP_LIST === $scope.params.fromFlag) {
                            $state.go("application.manager.instance");
                        } else if (constants.fromFlag.FROM_NAVIGATE === $scope.params.fromFlag) {
                            $state.go("application.manager.overview");
                        } else {
                            $state.go("application.manager.template");
                        }
                    }
                };

                function generateChosenVms() {
                    var chosenVms = [];
                    if (!$scope.params.vmTableData || ($scope.params.vmTableData.length <= 0)) {
                        return chosenVms;
                    }
                    _.each($scope.params.vmTableData, function (item, index) {
                        chosenVms.push(item.id);
                    });

                    return chosenVms;
                }
            }
        ];

        return ctrl;
    });
