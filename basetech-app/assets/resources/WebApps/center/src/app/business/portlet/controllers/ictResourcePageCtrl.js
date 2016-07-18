define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "app/business/monitor/services/alarmService",
    "app/business/portlet/services/homeService",
    "app/services/exceptionService",
    'fixtures/dataCenterFixture'],
    function ($, angular, AlarmService, HomeService, ExceptionService) {
        "use strict";
        var ictResourcePageCtrl = ["$scope", "$compile", "$q", "camel", "$state", "$rootScope", function ($scope, $compile, $q, camel, $state, $rootScope) {
            var user = $("html").scope().user;
            $scope.deployMode = $("html").scope().deployMode;
            var exception = new ExceptionService();
            var homeService = new HomeService($q, camel);
            var tokenId;
            var projectId;
            var regionName;
            var novaId;
            $scope.isLocal = $scope.deployMode === "local";

            $scope.style = $scope.style ||
            {
                color: {
                    run: "#5ecc49",
                    stop: "#ffa235",
                    alarm: "#fc5043",
                    normal: "#5ecc49",
                    fault: "#f21414",
                    other: "#D5D5D5"
                }
            };

            $scope.i18nMap =
            {
                run: $scope.i18n.common_term_running_value || "运行中",
                stop: $scope.i18n.common_term_stop_button || "停止",
                other: $scope.i18n.common_term_other_label || "其他",
                normal: $scope.i18n.common_term_natural_value || "正常",
                fault: $scope.i18n.common_term_trouble_label || "故障",
                unit: $scope.i18n.common_term_unitNum_label
            };

            $scope.runningVm = 0;
            $scope.regionSelector = {
                id: "",
                name: "",
                type: [],
                change: function () {
                    novaId = $scope.regionSelector.id;
                    regionName = $scope.regionSelector.name;
                    if (user.cloudType === "OPENSTACK") {
                        $scope.runningVm = 0;
                        getVmList();
                    }
                }
            };

            function getVmList() {
                if (!novaId) {
                    return;
                }
                var promise = homeService.getICTVmNumbers(novaId);
                promise.then(function (data) {
                    $scope.runningVm =  (data && data.run) || 0;
                });
            }

            function getRegion() {
                var deferred = camel.get({
                    "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var endPoint = data && data.endpoint || [];
                    var regions = [];
                    for (var i = 0; i < endPoint.length; i++) {
                        if (endPoint[i].serviceName === "nova") {
                            var region = {
                                id: endPoint[i].id,
                                name: endPoint[i].regionName
                            };
                            regions.push(region);
                        }
                    }
                    if (regions.length > 0) {
                        regions[0].checked = true;
                        $scope.regionSelector.type = regions;
                        novaId = regions[0].id;
                        regionName = regions[0].name;
                    }
                });
                deferred.fail(function (data) {
                    exception.doException(data);
                });
            }

            //初始化ICT场景下虚拟机状态
            function getVmStatus() {
                var data = {};
                data.run = 0;
                data.other = 0;
                fillResStat(data);
            }

            $scope.vmStatus = {
                "id": "vmStatusId",
                "centerText": "",
                "percent": false,
                "showLegend": true,
                "data": [],
                "rotate": 0,
                "r": 60,
                "strokeWidth": 20,
                "width": 350,
                "height": 120
            };

            // 构造虚拟机状态
            function fillResStat(para) {
                var i18n = $scope.i18nMap;
                var color = $scope.style.color;

                var obj = {};
                var b = ["run", "other"];
                var arr = [];
                var sum = para.run + para.other;
                for (var j in b) {
                    var attr = b[j];
                    arr.push({
                        value: para[attr],
                        name: i18n[attr],
                        color: color[attr],
                        tooltip: i18n[attr] + ":" + para[attr]
                    });
                }
                var p = 0;
                if (sum != 0) {
                    p = Math.floor(para.run * 100 / sum);
                }

                var center = {
                    text: '' + p,
                    fontSize: 24,
                    color: p >= 85 ? color.run : color.stop
                };

                $scope.vmStatus.centerText = center;
                $scope.vmStatus.data = arr;

            }

            $scope.alarmListTable = {
                "id": "alarmListTableId",
                "datas": [],
                "height": 100,
                "columns": [
                    {
                        "sTitle": $scope.i18n.alarm_term_level_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.severityValue);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.alarmName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_alarmObj_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.resourceName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_objectType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.moc);
                        },
                        "sWidth": "8%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_assemblyType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.compType);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_generantTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.occurTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_clearTime_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clearTime);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.alarm_term_clearType_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.clearType);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }
                ],
                "pagination": false,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "enableFilter": false,
                "curPage": {"pageIndex": 1},
                "requestConfig": {"enableRefresh": true, "refreshInterval": 6000, "httpMethod": "GET", "url": "", "data": "", "sAjaxDataProp": "mData"},
                "totalRecords": 0,
                "hideTotalRecords": false,

                "renderRow": function (nRow, aData, index) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();
                    $("td:eq(6)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();

                    var alarmSeverityHtml = "<div>";
                    if (aData.severity == 1) {
                        alarmSeverityHtml = alarmSeverityHtml + "<div class='alarm-picture alarm-picture-0' >";
                    } else if (aData.severity == 2) {
                        alarmSeverityHtml = alarmSeverityHtml + "<div class='alarm-picture alarm-picture-1' >";
                    }
                    else if (aData.severity == 3) {
                        alarmSeverityHtml = alarmSeverityHtml + "<div class='alarm-picture alarm-picture-2' >";
                    }
                    else if (aData.severity == 4) {
                        alarmSeverityHtml = alarmSeverityHtml + "<div class='alarm-picture alarm-picture-3' >";
                    }
                    alarmSeverityHtml = alarmSeverityHtml + "<span >" +
                        $.encoder.encodeForHTML(aData.severityValue) + "</span></div></div>";
                    var alarmSeverityLink = $compile(alarmSeverityHtml);
                    var alarmSeverityScope = $scope.$new();
                    var alarmSeverityNode = alarmSeverityLink(alarmSeverityScope);
                    $("td:eq(0)", nRow).html(alarmSeverityNode);

                    var name = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(aData.alarmName) + "</a>";
                    var nameLink = $compile(name);
                    var nameScope = $scope.$new();
                    nameScope.name = aData.name;
                    nameScope.goToDetail = function () {
                        $state.go("monitor.alarmlist");
                    };
                    var nameNode = nameLink(nameScope);
                    $("td:eq(1)", nRow).html(nameNode);
                },

                "callback": function (evtObj) {
                }
            };

            // 构造查询告警参数
            function getQueryJsonInfo() {
                var inquiryCond = {};
                inquiryCond.severity = "1";
                inquiryCond.alarmtype = "1";
                return  JSON.stringify({
                    "language": ($scope.i18n.locale === "zh" ?"zh_CN" : "en_US"),
                    "start": 0,
                    "limit": 5,
                    "inquiryCond": inquiryCond
                });
            }

            // 查询告警列表
            function getAlarmList() {
                AlarmService.getAlarmListInfos(
                    getQueryJsonInfo(), user,
                    function (result) {
                        if (result.result == true) {
                            $scope.$apply(function () {
                                $scope.alarmListTable.totalRecords = result.data.total;
                                $scope.alarmListTable.datas = result.data.alarmlist;
                            });
                        }
                        if (result.result == false) {
                            exception.doException(result.data, null);
                        }
                    }, $scope.isLocal);
            }

            // openstack实例
            $scope.token = undefined;
            $scope.projectId = undefined;

            /**
             * openStack实例表格
             */
            $scope.regionTable = {
                "id": "regionTableId",
                "data": [],
                "height": 100,
                columns: [
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": "34%"
                    },
                    {
                        "sTitle": $scope.i18n.service_term_service_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.endPointsStr);
                        },
                        "bSortable": false
                    }
                ],
                "pagination": false,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
                "enableFilter": false,
                "curPage": {"pageIndex": 1},
                "requestConfig": {"enableRefresh": true, "refreshInterval": 6000, "httpMethod": "GET", "url": "", "data": "", "sAjaxDataProp": "mData"},
                "totalRecords": 0,
                "hideTotalRecords": false,

                "renderRow": function (row, aData, index) {
                    // 增加tip属性
                    $("td:eq(0)", row).addTitle();
                    $("td:eq(1)", row).addTitle();

                    var name = "<a href='javascript:void(0)' ng-click='goToDetail()'>" + $.encoder.encodeForHTML(aData.name) + "</a>";
                    var nameLink = $compile(name);
                    var nameScope = $scope.$new();
                    nameScope.name = aData.name;
                    nameScope.goToDetail = function () {
                        $state.go("resources.regionResources.summary", {"region": nameScope.name});
                    };
                    var nameNode = nameLink(nameScope);
                    $("td:eq(0)", row).html(nameNode);
                },

                "callback": function (evtObj) {
                }
            };

            $scope.operator = {
                "query": function () {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/openstack/endpoint",
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined || data.endpoint === undefined) {
                            return;
                        }

                        // 合并数据
                        var regionsMap = {};
                        for (var index in data.endpoint) {
                            var regionName = data.endpoint[index].regionName;
                            if (regionsMap.hasOwnProperty(regionName)) {
                                regionsMap[regionName].push(data.endpoint[index]);
                            } else {
                                regionsMap[regionName] = [data.endpoint[index]];
                            }
                        }

                        var regionsList = [];
                        for (var index in regionsMap) {
                            var serviceList = "";
                            var regionServices = regionsMap[index];
                            for (var serviceIndex in regionServices) {
                                serviceList += regionServices[serviceIndex].serviceName + ";";
                            }
                            regionsList.push({"name": index, "endPoints": regionsMap[index], "endPointsStr": serviceList});
                        }

                        // 更新表格数据
                        $scope.$apply(function () {
                            $scope.regionTable.data = regionsList;
                        });
                    });
                },
                "action": function (type) {
                    var deferred = camel.get({
                        "url": "/goku/rest/v1.5/token",
                        "params": {"user-id": $("html").scope().user && $("html").scope().user.id},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        if (data === undefined) {
                            return;
                        }

                        $scope.token = data.id;

                        $scope.projectId = data.projectId;

                        if (type == "query") {
                            $scope.operator.query();
                        }
                    });
                }
            };

            var getOpenStackList = function () {
                $scope.operator.action("query");
            };

            $scope.refreshButton = {
                "click": function () {
                    refresh();
                }
            };

            function refresh() {
                if (user.cloudType === "OPENSTACK" && $scope.deployMode !== 'top') {
                    getRegion();
                    getAlarmList();
                    getOpenStackList();
                }
            }

            refresh();
        }];

        var dependency = [];
        var resourcePageModule = angular.module("ictResourcePage", dependency);
        resourcePageModule.controller("ictResourcePage.ctrl", ictResourcePageCtrl);
        return resourcePageModule;
    });