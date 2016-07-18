/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Select",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Select, Window, Message, httpService, UnifyValid, Exception) {
        "use strict";

        var orgOfAzCtrl = ["$scope", "$compile", "$state", "camel", "validator", function ($scope, $compile, $state, camel, validator) {
            var exceptionService = new Exception();
            var window = $("#orgOfAzWindow").widget();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            $scope.operable = user.privilege.role_role_add_option_orgHandle_value;
            var azId = window.option("azId");
            var infraId = window.option("infraId");
            //绑定VDC按钮
            $scope.bindOrgButton = {
                "id": "addTagButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    bindOrgWindow();
                }
            };
            //查询信息
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            //集群列表
            $scope.orgTable = {
                "id": "orgOfAzTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": $scope.i18n.org_term_vdcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.cloud_pool_AZvdcMgr_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.defaultStr);
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
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getOrg();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.orgTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.orgTable.displayLength = pageInfo.displayLength;
                    getOrg();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button + "</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.delete = function () {
                        deleteMessage(aData.id);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(4)", nRow).html(optNode);
                }
            };
            function bindOrgWindow() {
                var newWindow = new Window({
                    "winId": "bindOrgWindow",
                    "title": $scope.i18n.common_term_add_button,
                    "azId": azId,
                    "infraId": infraId,
                    "content-type": "url",
                    "maximizable": false,
                    "minimizable": false,
                    "buttons": null,
                    "content": "app/business/multiPool/views/poolInfo/availableZone/bindOrg.html",
                    "height": 500,
                    "width": 750,
                    "close": function () {
                        getOrg();
                    }
                });
                newWindow.show();
            }

            function getOrg() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/az/{azId}/vdcs?start={start}&limit={limit}&cloud-infra={infraId}",
                        o: {azId: azId, start: searchInfo.start, limit: searchInfo.limit, infraId: infraId}
                    },
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var orgList = data && data.vdcList || [];
                    for (var i = 0; i < orgList.length; i++) {
                        orgList[i].defaultStr = orgList[i].defaultVdc ? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
                    }
                    $scope.$apply(function () {
                        $scope.orgTable.totalRecords = data.total || 0;
                        $scope.orgTable.data = orgList;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function deleteMessage(vdcId) {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.resource_az_moveVDC_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                deleteOrg(vdcId);
                                msg.destroy();
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

            function deleteOrg(id) {
                var params = {
                    vdcIds: [id]
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/az/{id}/vdcs/action?cloud-infra={cloud_infra_id}",
                        o: {
                            id: azId,
                            cloud_infra_id: infraId
                        }
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getOrg();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if ($scope.operable) {
                $scope.orgTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function () {
                            return "";
                        },
                        "bSortable": false
                    }
                );
            }
            getOrg();
        }];

        var orgOfAzApp = angular.module("orgOfAzApp", ['framework']);
        orgOfAzApp.service("camel", httpService);
        orgOfAzApp.controller("multiPool.availableZone.orgOfAz.ctrl", orgOfAzCtrl);
        return orgOfAzApp;
    }
);