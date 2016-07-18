/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-3-13

 */
define(['tiny-lib/angular',
    'tiny-widgets/Checkbox',
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService",
    'app/business/resources/controllers/constants'
],
    function (angular, Checkbox, UnifyValid, httpService, ExceptionService, constants) {
        "use strict";
        var associateDVSCtrl = ['$scope', 'camel', function ($scope, camel) {
            $scope.i18n = $("html").scope().i18n;
            var $rootScope = $("html").injector().get("$rootScope");
            var id = $("#associateDVSWin").widget().option("vlanPoolId");
            var name = $("#associateDVSWin").widget().option("name");
            var dvsIDs = $("#associateDVSWin").widget().option("dvsIDs");
            var zoneId = $("#associateDVSWin").widget().option("zoneId");
            $scope.vxlan = $("#associateDVSWin").widget().option("vxlan");

            //关联DVS数据
            $scope.associateModel = {
                associateVlanPool2DVS: {
                    'id': id,
                    'dvsIDs': []
                }
            }

            $scope.name = {
                "label": $scope.i18n.common_term_name_label + ":",
                "value": name
            }
            $scope.dvsTable = {
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
                    //判断dvs是否已经被关联
                    if (dvsIDs == null || dvsIDs.length == 0) {
                        var isChecked = false;
                    }
                    else {
                        var isChecked = ("-1" != $.inArray(dataitem.id, dvsIDs));
                    }
                    var options = {
                        "id": "dvsCheckbox" + index,
                        "checked": isChecked,
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
            };

            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var dvsIdList = [];
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + index;
                        if ($("#" + id).widget().option("checked")) {
                            dvsIdList.push($scope.dvsTable.data[index].id)
                        }
                    }
                    $scope.associateModel.associateVlanPool2DVS.dvsIDs = dvsIdList;
                    $scope.operate.associate($scope.associateModel);
                }
            };
            $scope.cancelBtn = {
                "id": "cancelBtn",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#associateDVSWin").widget().destroy();
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
                        "url": {s: url, o: {"zoneid": zoneId, "start": 0, "limit": 100, "name": "", "hypervisorid": "", "supportvxlan": $scope.vxlan }},
                        "userId": $rootScope.user.id
                    });
                    deferred.success(function (response) {
                        //查询数据
                        $scope.$apply(function () {
                            for (var index in response.dvses) {
                                var clusterName = [];
                                for (var key in response.dvses[index].clusterIDsMapNames) {
                                    clusterName.push(response.dvses[index].clusterIDsMapNames[key]);
                                }
                                response.dvses[index].clusterName = clusterName.join(";");
                            }
                            $scope.dvsTable.data = response.dvses;
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
                //关联
                associate: function (params) {
                    var associateConfig = constants.rest.DVS_ASSOCIATE;
                    var deferred = camel.post({
                        "url": {s: associateConfig.url, o: {"tenant_id": 1}},
                        "params": JSON.stringify(params),
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        $("#associateDVSWin").widget().destroy();
                        $("#vlanPoolRefresh_id").click();
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                //设置复选框的选中状态
                setCheckbox: function (param) {
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + index;
                        $("#" + id).widget().option("checked", param);
                    }
                },
                //复选框是否全部选中
                isAllChecked: function () {
                    for (var index in $scope.dvsTable.data) {
                        var id = "dvsCheckbox" + index;
                        if (!$("#" + id).widget().option("checked")) {
                            return false;
                        }
                    }
                    return true;
                }

            };
            $scope.operate.query();

        }];
        var dependency = ['ng', 'wcc'];
        var associateDVSModule = angular.module("associateDVSModule", dependency);
        associateDVSModule.controller("associateDVSCtrl", associateDVSCtrl);
        associateDVSModule.service("camel", httpService);
        return associateDVSModule;
    });


