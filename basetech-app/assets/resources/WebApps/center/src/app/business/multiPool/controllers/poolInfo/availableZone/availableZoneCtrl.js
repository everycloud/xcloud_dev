/*global define*/
define(['jquery',
    "tiny-lib/angular",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "app/services/exceptionService"],
    function ($, angular, Message, Window, Exception) {
        "use strict";

        var azCtrl = ["$scope", "$stateParams", "$compile", "$state", "camel", function ($scope, $stateParams, $compile, $state, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege["role_role_add_option_AZHandle_value.304001"];
            $scope.vdcRight = user.privilege.role_role_add_option_orgView_value;
            var infraId = $stateParams.infraId;
            $scope.poolType = $stateParams.type;
            $scope.infraName = $stateParams.infraName;

            $scope.help = {
                show: false
            };

            var serviceStatus = {
                "normal": $scope.i18n.common_term_natural_value,
                "pause": $scope.i18n.common_term_pauseUse_value,
                "abnormal": $scope.i18n.common_term_abnormal_value
            };

            $scope.searchModel = {
                name: "",
                status: "",
                start: 0,
                limit: 10
            };
            $scope.refresh = function () {
                getAzs();
            };

            var addOperatorDom = function (dataItem, row) {
                var submenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">' +
                    $scope.i18n.common_term_more_button + '<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                if($scope.vdcRight){
                    submenus += '<li><a href="javascript:void(0)" ng-click="orgOfAz()">' + $scope.i18n.org_term_vdcManage_label + '</a></li>';
                }
                if (dataItem.serviceStatus === "normal") {
                    submenus = submenus + '<li><a href="javascript:void(0)" ng-click="stop()">' + $scope.i18n.common_term_pauseUse_button + '</a></li>' +
                        '<li class="disabled"><a href="javascript:void(0)">' + $scope.i18n.common_term_desterilize_button + '</a></li>';
                }
                else {
                    submenus = submenus + '<li class="disabled"><a href="javascript:void(0)">' + $scope.i18n.common_term_pauseUse_button + '</a></li>' +
                        '<li><a href="javascript:void(0)" ng-click="recover()">' + $scope.i18n.common_term_desterilize_button + '</a></li>';
                }
                if (dataItem.serviceStatus === "normal") {
                    submenus += '<li class="disabled"><a href="javascript:void(0)">' + $scope.i18n.common_term_delete_button + '</a></li>';
                }
                else {
                    submenus += '<li><a href="javascript:void(0)" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>';
                }
                submenus += '</ul></span>';
                var optTemplates = "<div><a href='javascript:void(0)' ng-click='manage()' style='margin-right:10px; width:auto'>" +
                    $scope.i18n.cloud_term_tagManage_label + "</a> ";
                if ($scope.poolType !== "openstack") {
                    optTemplates += submenus;
                }
                optTemplates += '</div>';
                var scope = $scope.$new(false);
                scope.data = dataItem;
                scope.orgOfAz = function () {
                    orgWindow(dataItem);
                };
                scope.stop = function () {
                    stopMessage(dataItem);
                };
                scope.recover = function () {
                    recoverMessage(dataItem);
                };
                scope.manage = function () {
                    manageWindow(dataItem);
                };
                scope.delete = function () {
                    deleteMessage(dataItem);
                };

                var optDom = $compile($(optTemplates))(scope);

                // VDC详情
                var orgDom = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(dataItem.orgNum) + "</a>";
                var orgLink = $compile(orgDom);
                var orgScope = $scope.$new();
                orgScope.goToDetail = function () {
                    orgWindow(dataItem);
                };
                var orgNode = orgLink(orgScope);

                if ($scope.poolType === "openstack") {
                    $("td:eq(4)", row).html(optDom);
                }
                else {
                    if($scope.vdcRight){
                        $("td:eq(2)", row).html(orgNode);
                    }
                    $("td:eq(5)", row).html(optDom);
                }
                optDom.find('.dropdown').dropdown();
            };

            $scope.azTable = {
                caption: "",
                data: [],
                id: "azTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu: [10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: true,
                columns: [
                    {
                        "sTitle": "",
                        "mData": "",
                        "bSortable": false,
                        "sWidth": "36px"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_bondVDCnum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.orgNum);
                        },
                        "bSortable": false,
                        "sWidth": "15%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_serviceStatus_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false,
                        "sWidth": "20%"
                    },
                    {
                        "sTitle": $scope.i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        },
                        "bSortable": false,
                        "sWidth": "25%"
                    }
                ],
                "callback": function (pageInfo) {
                    $scope.searchModel.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                    getAzs();
                },
                "changeSelect": function (pageInfo) {
                    $scope.searchModel.start = 0;
                    $scope.azTable.curPage = {
                        "pageIndex": 1
                    };
                    $scope.searchModel.limit = pageInfo.displayLength;
                    $scope.azTable.displayLength = pageInfo.displayLength;
                    getAzs();
                },
                renderRow: function (row, dataitem, index) {
                    $(row).attr("lineNum", $.encoder.encodeForHTML("" + index));
                    $(row).attr("azId", $.encoder.encodeForHTML("" + dataitem.id));
                    $(row).attr("infraId", $.encoder.encodeForHTML(infraId));
                    $(row).attr("poolType", $.encoder.encodeForHTML($scope.poolType));

                    // 添加操作
                    addOperatorDom(dataitem, row);
                }
            };

            $scope.create = {
                id: "azID",
                disable: false,
                text: $scope.i18n.common_term_add_button,
                tip: "",
                create: function () {
                    addAzWindow();
                }
            };

            $scope.searchStatus = {
                "id": "azSearchStatus",
                "dftLabel": $scope.i18n.common_term_allStatus_value,
                "width": "150",
                "values": [
                    {
                        "selectId": "all",
                        "label": $scope.i18n.common_term_allStatus_value,
                        "checked": true
                    },
                    {
                        "selectId": "normal",
                        "label": $scope.i18n.common_term_natural_value
                    },
                    {
                        "selectId": "abnormal",
                        "label": $scope.i18n.common_term_abnormal_value
                    }
                ],
                "change": function () {
                    $scope.searchModel.status = $("#" + $scope.searchStatus.id).widget().getSelectedId();
                    if ($scope.searchModel.status === "all") {
                        $scope.searchModel.status = "";
                    }
                    $scope.searchModel.start = 0;
                    $scope.azTable.curPage = {
                        "pageIndex": 1
                    };
                    getAzs();
                }
            };
            $scope.searchBox = {
                "id": "azSearchBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "type": "round",
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.start = 0;
                    $scope.azTable.curPage = {
                        "pageIndex": 1
                    };
                    getAzs();
                }
            };

            function deleteMessage(dataItem) {
                var msgOptions = {
                    "type": "confirm",
                    "title": $scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.resource_az_del_info_confirm_msg,
                    "width": "300",
                    "height": "150",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_confirm_label,
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,
                            handler: function (event) {
                                remove(dataItem.id);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ]
                };
                if (dataItem.orgNum > 0) {
                    msgOptions.content = $scope.i18n.resource_az_delAZwithVDC_info_confirm_msg;
                }
                var msgBox = new Message(msgOptions);
                msgBox.show();
            }

            function stopMessage(dataItem) {
                var msgOptions = {
                    "type": "confirm",
                    "title": $scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.resource_az_pauseUse_info_confirm_msg,
                    "width": "300",
                    "height": "200"
                };
                var msgBox = new Message(msgOptions);
                var buttons = [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        accessKey: 'Y',
                        majorBtn : true,
                        default: true,
                        handler: function (event) {
                            stop(dataItem.id);
                            msgBox.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        accessKey: 'N',
                        default: false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }
                ];
                msgBox.option("buttons", buttons);
                msgBox.show();
            }

            function recoverMessage(dataItem) {
                var msgOptions = {
                    "type": "confirm",
                    "title": $scope.i18n.common_term_confirm_label,
                    "content": $scope.i18n.resource_az_desterilize_info_confirm_msg,
                    "width": "300",
                    "height": "200",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,
                            handler: function (event) {
                                recover(dataItem.id);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ]
                };
                if (dataItem.serviceStatus === "abnormal") {
                    msgOptions.content = $scope.i18n.resource_az_desterilizeWithFault_info_confirm_msg;
                    msgOptions.title = $scope.i18n.common_term_warning_label;
                    msgOptions.type = "warn";
                    msgOptions.width = "400";
                    msgOptions.height = "200";
                }
                var msgBox = new Message(msgOptions);
                msgBox.show();
            }

            function addAzWindow() {
                var newWindow = new Window({
                    "winId": "addAzWindow",
                    "title": $scope.i18n.resource_term_addAZ_button,
                    "content-type": "url",
                    "infraId": infraId,
                    "buttons": null,
                    "maximizable": false,
                    "minimizable": false,
                    "content": "app/business/multiPool/views/poolInfo/availableZone/addAz.html",
                    "height": 500,
                    "width": 750,
                    "close": function () {
                        getAzs();
                    }
                });
                newWindow.show();
            }

            function orgWindow(dataItem) {
                var newWindow = new Window({
                    "winId": "orgOfAzWindow",
                    "azId": dataItem.id,
                    "infraId": infraId,
                    "title": $scope.i18n.org_term_vdcManage_label,
                    "content-type": "url",
                    "buttons": null,
                    "maximizable": false,
                    "minimizable": false,
                    "content": "app/business/multiPool/views/poolInfo/availableZone/orgOfAz.html",
                    "height": 500,
                    "width": 850,
                    "close": function () {
                        getAzs();
                    }
                });
                newWindow.show();
            }

            function manageWindow(dataItem) {
                var newWindow = new Window({
                    "winId": "manageTagWindow",
                    "title": $scope.i18n.cloud_term_tagManage_label,
                    "content-type": "url",
                    "buttons": null,
                    "maximizable": false,
                    "minimizable": false,
                    "azId": dataItem.id,
                    "infraId": infraId,
                    "content": "app/business/tag/views/label/topManageTag.html",
                    "height": 500,
                    "width": 750
                });
                newWindow.show();
            }

            function getAzs() {
                if ($("#" + $scope.searchBox.id).widget()) {
                    $scope.searchModel.name = $("#" + $scope.searchBox.id).widget().getValue();
                }
                var params = {
                    cloudInfraId: infraId,
                    start: $scope.searchModel.start,
                    limit: $scope.searchModel.limit,
                    serviceStatus: $scope.searchModel.status,
                    name: $scope.searchModel.name,
                    manageStatus: 'occupied'
                };
                var deferred = camel.post({
                    url: "/goku/rest/v1.5/1/available-zones/list",
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var azs = data.availableZones || [];
                    for (var index in azs) {
                        azs[index].detail = {
                            contentType: "url",
                            content: "app/business/multiPool/views/poolInfo/availableZone/topFmAzDetail.html"
                        };
                        azs[index].status = serviceStatus[azs[index].serviceStatus] || azs[index].serviceStatus;
                        azs[index].orgNum = azs[index].associatedOrgNum;
                    }
                    $scope.$apply(function () {
                        $scope.azTable.totalRecords = data.total;
                        $scope.azTable.data = azs;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function remove(azId) {
                var deferred = camel.delete({
                    url: {s: "/goku/rest/v1.5/1/available-zones/{id}?cloud-infra={infraId}", o: {id: azId, infraId: infraId}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getAzs();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function recover(azId) {
                var params = {
                    activate: "activate"
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/1/available-zones/{id}/action?cloud-infra={infraId}", o: {id: azId, infraId: infraId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getAzs();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function stop(azId) {
                var params = {
                    inactivate: "inactivate"
                };
                var deferred = camel.post({
                    url: {s: "/goku/rest/v1.5/1/available-zones/{id}/action?cloud-infra={infraId}", o: {id: azId, infraId: infraId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    getAzs();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            if ($scope.poolType === "openstack") {
                $scope.azTable.columns.splice(2, 1);
            }
            if ($scope.operable && $scope.poolType != "openstack") {
                $scope.azTable.columns.push(
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function(){
                            return "";
                        },
                        "bSortable": false
                    }
                );
            }
            getAzs();
        }];
        return azCtrl;
    });