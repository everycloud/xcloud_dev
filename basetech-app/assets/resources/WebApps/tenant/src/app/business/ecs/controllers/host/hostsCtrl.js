/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    "app/services/cloudInfraService",
    "app/services/commonService",
    "tiny-lib/underscore",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/ecsFixture"
],
    function ($, angular, cloudInfraService, commonService, _, TextBox, Button, Window) {
        "use strict";

        var vmLstCtrl = ["$scope", "$compile", "$state", "camel", "$q", "exception", "storage", "$stateParams",
            function ($scope, $compile, $state, camel, $q, exception, storage, $stateParams) {
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                var cloudInfra = null;
                var resourceObj ={};
                var searchString = "";
                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                var searchModel = {
                    name:"",
                    "cloud-infra": "",
                    start: 0,
                    limit: commonService.DEFAULT_TABLE_PAGE_LENGTH
                };

                $scope.searchAz = {
                    "id": "ecsHostsSearchAz",
                    "width": "150",
                    "values": [],
                    "change": function () {
                        var resCloudId = $("#" + $scope.searchAz.id).widget().getSelectedId();
                        _.each($scope.searchAz.values, function (item, index) {
                            if (resCloudId === item.selectId) {
                                cloudInfra = item;
                            }
                        });
                        page.currentPage = 1;
                        searchModel["cloud-infra"]=resCloudId;
                        queryPhysicalMachines();
                    }
                };

                $scope.searchBox = {
                    "id": "ecsStorageHostsSearchBox",
                    "placeholder": i18n.common_term_findName_prom,
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (content) {
                        searchString = content;
                        page.currentPage = 1;
                        queryPhysicalMachines();
                    }
                };

                $scope.refresh = {
                    "click": function () {
                        queryPhysicalMachines();
                    }
                };
                $scope.help = {
                    "helpKey": "drawer_server",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                $scope.hosts = {
                    "id": "ecsHostsList",
                    "paginationStyle": "full_numbers",
                    "lengthChange": true,
                    "enablePagination": true,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "showDetails": {
                        "colIndex": 0,
                        "domPendType": "append"
                    },
                    "draggable": true,
                    "columns": [{
                        "sTitle": "",
                        "mData": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "80px"
                    }, {
                        "sTitle": $scope.i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },{
                        "sTitle": (i18n.common_term_physiServerName_label || "物理机名称"),
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },{
                        "sTitle": (i18n.device_term_model_label || "型号"),
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.model);
                        }
                    }, {
                        "sTitle": (i18n.common_term_specHardware_label || "硬件规格"),
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.hardwareSpec);
                        }
                    }, {
                        "sTitle": (i18n.common_term_OS_label ||"操作系统"),
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        }
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osIp);
                        }
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        queryPhysicalMachines();
                    },
                    "changeSelect": function (evtObj) {
                        searchModel.start = 0;
                        $scope.hosts.curPage = {
                            "pageIndex": 1
                        };
                        searchModel.limit = evtObj.displayLength;
                        $scope.hosts.displayLength = evtObj.displayLength;
                        queryPhysicalMachines();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();

                        //下钻时传递参数
                        $("td:eq(0)", nRow).bind("click", function () {
//                            aData.cloudInfra =  resourceObj;
                            $scope.currentItem = aData;
                        });
                    }
                };

                //查询物理机列表
                function queryPhysicalMachines(){
                    var deferred = camel.get({
                        url: {s: "/goku/rest/v1.5/{vdc_id}/physical-servers?infraId={infraId}&state={assignState}&start={start}&limit={limit}&search_input={condition}",
                            o:{vdc_id:user.vdcId,infraId:searchModel["cloud-infra"],assignState:"assigned",start:searchModel.start,limit:searchModel.limit,condition:searchString}},
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        var hosts = data && data.servers || [];
                        for(var i=0;i<hosts.length;i++){
                            hosts[i].detail = {
                                contentType: "url",
                                content: "app/business/ecs/views/host/hostDetail.html"
                            };
                        }
                        $scope.$apply(function () {
                            $scope.hosts.data = hosts;
                            $scope.hosts.totalRecords = data.total;
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data);
                    });
                }

                //查询当前租户可见的地域列表
                function getLocations() {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        var selectValues = [];
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            if ($stateParams.cloudInfraId) {
                                cloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $stateParams.cloudInfraId);
                                if (!cloudInfra || !cloudInfra.id) {
                                    cloudInfra = data.cloudInfras[0];
                                }
                                data.cloudInfras[0].checked = false;
                                cloudInfra.checked = true;
                            } else {
                                cloudInfra = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                                searchModel["cloud-infra"] = cloudInfra.id;
                            }
                        }
                        $scope.searchAz.values = data.cloudInfras;
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }
                //获取初始化信息
                $scope.$on("$viewContentLoaded", function () {
                    var promise = getLocations();
                    promise.then(function () {
                        // 是否按指定条件搜索
                        if ($stateParams.condition) {
                            searchString = $stateParams.condition;
                            $("#" + $scope.searchBox.id).widget().setValue(searchString);
                        }
                        queryPhysicalMachines();
                    });
                });
            }
        ];
        return vmLstCtrl;
    }
);
