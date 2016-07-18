/**
 * Created on 14-2-21.  本文件待确认后废弃
 */
define([
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "app/services/httpService",
        "tiny-lib/underscore",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/FormField",
        "tiny-directives/Lineplot",
        "fixtures/userFixture"
    ],
    function ($, angular, http, _) {
        "use strict";

        var monitorServiceCtrl = ['$scope', "$compile", 'camel', "exception", "appCommonData", "$state",
            function ($scope, $compile, camel, exception, appCommonData, $state) {
                var vpcId = appCommonData.vpcId;
                var appId = appCommonData.appId;
                var user = $scope.user;
                var i18n = $scope.i18n;
                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                //vm列表
                $scope.vmTable = {
                    "id": "hypervisorVmTable",
                    "data": null,
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "displayLength": 10,
                    "totalRecords": 0,
                    "lengthMenu": [10, 25, 50, 100],
                    "columnsVisibility": {
                        "aiExclude": [0]
                    },
                    "columnsDraggable": true,
                    "curPage": {},
                    "columns": [{
                        "sTitle": i18n.common_term_name_label,
                        "mData": "name",
                        "bSortable": false,
                        "sWidth": "15%"
                    }, {
                        "sTitle": "ID",
                        "mData": "id",
                        "bSortable": false,
                        "sWidth": "15%"
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusStr",
                        "bSortable": false,
                        "sWidth": "15%"
                    }, {
                        "sTitle": "IP",
                        "mData": "ip",
                        "bSortable": false,
                        "sWidth": "15%"
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": "description",
                        "bSortable": false,
                        "sWidth": "40%"
                    }],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).addTitle();
                        $('td:eq(1)', nRow).addTitle();
                        $('td:eq(2)', nRow).addTitle();
                        $('td:eq(3)', nRow).addTitle();
                        $('td:eq(4)', nRow).addTitle();

                        //虚拟机详情链接
                        var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>" + aData.name + "</a>"));
                        var scope = $scope.$new(false);
                        scope.name = aData.name;
                        scope.detail = function () {
                            $state.go("ecs.vm", {
                                "jumpVmId": aData.id
                            });
                        };
                        var node = link(scope);
                        $("td:eq(0)", nRow).html(node);
                    }
                };
            }
        ];
        return monitorServiceCtrl;
    });
