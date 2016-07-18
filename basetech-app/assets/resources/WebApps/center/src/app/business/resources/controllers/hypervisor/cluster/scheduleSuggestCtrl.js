/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "tiny-widgets/Checkbox",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Message, Checkbox, Exception) {
        "use strict";

        var scheduleSuggestCtrl = ["$scope", "$compile", "camel", "$stateParams", function ($scope, $compile, camel, $stateParams) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege.role_role_add_option_clusterHandle_value;
            var clusterId = $stateParams.clusterId;
            //应用按钮
            $scope.applyButton = {
                "id": "scheduleApplyButton",
                "text": $scope.i18n.app_term_execute_button || "执行",
                "click": function () {
                    var selectedSuggest = [];
                    var data = $scope.suggestTable.data;
                    var index = 0;
                    while ($("#suggestCheckbox_" + index).widget()) {
                        var checked = $("#suggestCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            var suggest = {
                                urn: data[index].urn,
                                uri: data[index].uri,
                                drsAction: data[index].drsAction
                            };
                            selectedSuggest.push(suggest);
                        }
                        index++;
                    }
                    if (selectedSuggest.length > 0) {
                        applyMessage(selectedSuggest);
                    }
                }
            };
            $scope.refresh = function () {
                getData();
            };
            //调度建议列表
            $scope.suggestTable = {
                "id": "scheduleSuggestTable",
                "data": null,
                "enablePagination": false,
                "columnSorting": [],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.suggest);
                        },
                        "bSortable": false,
                        "sWidth": 40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_advice_label || "建议",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.suggest);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_buildTime_label || "生成时间",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "bSortable": false
                    }
                ],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "suggestCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };

            function applyMessage(selectedSuggest) {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.virtual_cluster_runWithAdvice_info_confirm_msg || "确实要按照建议开始执行任务？",
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label:$scope.i18n.common_term_ok_button,
                            default: true,
                            handler: function (event) {
                                msg.destroy();
                                apply(selectedSuggest);
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }

            function apply(selectedSuggest) {
                var params = {
                    drsRecommendations: selectedSuggest
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drsrecommendations/action", o: {id: clusterId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getData();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getData() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drsrecommendations", o: {id: clusterId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var suggests = data.drsRecommendations || [];
                    for (var i = 0; i < suggests.length; i++) {
                        var drsAction = suggests[i].drsAction;
                        for (var j = 0; j < drsAction.length; j++) {
                            suggests[i].suggest = suggests[i].suggest ? suggests[i].suggest + "; " : "";
							suggests[i].suggest = suggests[i].suggest + $scope.i18n.sprintf($scope.i18n.vm_vm_migrate_info_path_label,
								{1: drsAction[j].vmName, 2: drsAction[j].sourceHostName, 3: drsAction[j].destinationHostName});
                        }
                    }
                    $scope.$apply(function () {
                        $scope.suggestTable.data = suggests;
                    });
                    //表头全选复选框
                    var options = {
                        "id": "suggestHeadCheckbox",
                        "checked": false,
                        "change": function () {
                            var isChecked = $("#" + options.id).widget().options.checked;
                            var index = 0;
                            while ($("#suggestCheckbox_" + index).widget()) {
                                $("#suggestCheckbox_" + index).widget().option("checked", isChecked);
                                index++;
                            }
                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('#scheduleSuggestTable th:eq(0)').html(checkbox.getDom());
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            getData();
        }];
        return scheduleSuggestCtrl;
    }
);
