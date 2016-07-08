/* global define */
define(['jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Columnchart",
    "tiny-directives/Columnchart",
    "app/business/monitor/services/performanceService",
    "app/services/cloudInfraService",
    "app/business/ecs/services/vm/vmNicService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/performanceFixture"
], function ($, angular, _, $encoder, TextBox, Button, Window, Columnchart, _ColumnchartDirective, performanceService, cloudInfraService, vmNicService) {
    "use strict";
    var MAXIMUM_VALUE = 100;
    var performanceViewCtrl = ["$scope", "$compile", "camel", "$q", "exception", "storage", "$interval",
        function ($scope, $compile, camel, $q, exception, storage, $interval) {

            //公共服务实例
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var performanceServiceIns = new performanceService(exception, $q, camel);
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var user = $scope.user;
            var cloudInfraId = "";
            var vpcId = "";
            var i18n = $scope.i18n;
            var isIct = user.cloudType === "ICT";
            $scope.objectType = "vm";
            $scope.topnType = "max";
            $scope.topN = "5";

            //对象类型下拉框
            $scope.performanceSelObj = {
                "id": "performanceSelObj",
                "width": "100",
                "values": [
                    {
                        "selectId": "vm",
                        "label": i18n.common_term_vm_label,
                        "checked": true

                    }
                ],
                "change": function () {
                    $scope.objectType = $("#performanceSelObj").widget().getSelectedId();
                    $scope.getData();
                }
            };

            //地域下拉框
            $scope.address = {
                "id": "performanceAddress",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    cloudInfraId = $("#performanceAddress").widget().getSelectedId();
                    if (isIct) {
                        var defer = queryVpc();
                        defer.then(function () {
                            $scope.getData();
                        });
                    }
                    else{
                        $scope.getData();
                    }
                    storage.add("cloudInfraId", cloudInfraId);
                }
            };

            //VPC下拉框
            $scope.vpcFilter = {
                "id": "performancevpcFilter",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    vpcId = $("#" + $scope.vpcFilter.id).widget().getSelectedId();
                    $scope.getData();
                    storage.add("vpcId", vpcId);
                }
            };

            //top类型下拉框
            $scope.performanceTopType = {
                "id": "performanceTopType",
                "width": "100",
                "values": [
                    {
                        "selectId": "max",
                        "label": i18n.common_term_Highest_label,
                        "checked": true
                    },
                    {
                        "selectId": "min",
                        "label": i18n.common_term_lowest_label
                    }
                ],
                "change": function () {
                    $scope.topnType = $("#performanceTopType").widget().getSelectedId();
                    $scope.getData();
                }
            };

            //top类型下拉框
            $scope.performanceType = {
                "id": "performanceType",
                "width": "100",
                "values": [
                    {
                        "selectId": "3",
                        "label": "TOP3"

                    },
                    {
                        "selectId": "5",
                        "label": "TOP5",
                        "checked": true
                    },
                    {
                        "selectId": "10",
                        "label": "TOP10"
                    }
                ],
                "change": function () {
                    $scope.topN = $("#performanceType").widget().getSelectedId();
                    $scope.getData();
                }
            };

            //创建查询按钮
            $scope.searchBtn = {
                "id": "performance-serach",
                "text": i18n.common_term_query_button,
                "click": function () {
                    $scope.getData();
                }
            };

            //查询监控视图列表信息
            $scope.getData = function () {
                if(!cloudInfraId){
                    return;
                }
                var metrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_usage"];
                var options = {
                    "objectType": $scope.objectType,
                    "topnType": $scope.topnType,
                    "metrics": metrics,
                    "topN": $scope.topN,
                    "user": user,
                    "cloudInfraId": cloudInfraId,
                    "vpcId": vpcId
                };
                var promise = performanceServiceIns.queryPerformanceView(options);
                promise.then(function (response) {
                    if (!response) {
                        return;
                    }
                    var vmName = "";
                    var vmId = "";
                    //CPU占有率
                    var cupData = [];
                    var cpus = response.monitorTopnMap.cpu_usage;
                    if (cpus.length !== 0) {
                        var cpu = null;
                        var initCpuValue = 0;
                        for (var i = 0; i < cpus.length; i++) {
                            initCpuValue = $.encoder.encodeForHTML(cpus[i].indexValue);
                            if (initCpuValue > 100) {
                                initCpuValue = 100;
                            }
                            var params =
                            {
                                "vmName" : cpus[i].resourceName,
                                "vmId" : cpus[i].resourceId
                            }
                            cpu = {
                                textValue: (Math.round(initCpuValue / 1 * 100) / 100.00 + "%"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: initCpuValue,
                                initValue: MAXIMUM_VALUE,
                                maxValue: MAXIMUM_VALUE,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            cpu.name = columnName(params);
                            cupData.push(cpu);
                        }
                        getCpuShare(cupData);
                    }else{
                        $("#columnchartDiv1").find("div").remove();
                    }

                    //内存占有率
                    var memData = [];
                    var mems = response.monitorTopnMap.mem_usage;
                    if (mems.length !== 0) {
                        var mem = null;
                        var initMemValue = 0;
                        for (var j = 0; j < mems.length; j++) {
                            initMemValue = $.encoder.encodeForHTML(mems[j].indexValue);
                            if (initMemValue > 100) {
                                initMemValue = 100;
                            }
                            var params =
                            {
                                "vmName" : mems[j].resourceName,
                                "vmId" : mems[j].resourceId
                            }
                            mem = {
                                textValue: (Math.round(initMemValue / 1 * 100) / 100.00 + "%"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: initMemValue,
                                initValue: MAXIMUM_VALUE,
                                maxValue: MAXIMUM_VALUE,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            mem.name = columnName(params);
                            memData.push(mem);
                        }
                        getMemShare(memData);
                    }else{
                        $("#columnchartDiv2").find("div").remove();
                    }

                    //网络流入速率
                    var nicInData = [];
                    var nicIns = response.monitorTopnMap.nic_byte_in;
                    if (nicIns.length !== 0) {
                        var nic = null;
                        var maxIndexValue = getMaxValueInArray(nicIns);
                        for (var m = 0; m < nicIns.length; m++) {
                            var params =
                            {
                                "vmName" : nicIns[m].resourceName,
                                "vmId" : nicIns[m].resourceId
                            }
                            nic = {
                                textValue: (Math.round($.encoder.encodeForHTML(nicIns[m].indexValue) / 1 * 100) / 100.00 + "KB/S"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: $.encoder.encodeForHTML(nicIns[m].indexValue),
                                initValue: maxIndexValue,
                                maxValue: maxIndexValue,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            nic.name = columnName(params);
                            nicInData.push(nic);
                        }
                        getNicIn(nicInData);
                    }else{
                        $("#columnchartDiv3").find("div").remove();
                    }

                    //网络流出速率
                    var nicOutData = [];
                    var nicOuts = response.monitorTopnMap.nic_byte_out;
                    if (nicOuts.length !== 0) {
                        var nicOut = null;
                        var maxNicOut = getMaxValueInArray(nicOuts);
                        for (var n = 0; n < nicOuts.length; n++) {
                            var params =
                            {
                                "vmName" : nicOuts[n].resourceName,
                                "vmId" : nicOuts[n].resourceId
                            }
                            nicOut = {
                                textValue: (Math.round($.encoder.encodeForHTML(nicOuts[n].indexValue) / 1 * 100) / 100.00 + "KB/S"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: $.encoder.encodeForHTML(nicOuts[n].indexValue),
                                initValue: maxNicOut,
                                maxValue: maxNicOut,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            nicOut.name = columnName(params);
                            nicOutData.push(nicOut);
                        }
                        getNicOut(nicOutData);
                    }else{
                        $("#columnchartDiv4").find("div").remove();
                    }

                    //磁盘写入
                    var diskIOData = [];
                    var diskIOs = response.monitorTopnMap.disk_io_in;
                    if (diskIOs.length !== 0) {
                        var disk = null;
                        var maxDiskIO = getMaxValueInArray(diskIOs);
                        for (var h = 0; h < diskIOs.length; h++) {
                            var params =
                            {
                                "vmName" : diskIOs[h].resourceName,
                                "vmId" : diskIOs[h].resourceId
                            }
                            disk = {
                                textValue: (Math.round($.encoder.encodeForHTML(diskIOs[h].indexValue) / 1 * 100) / 100.00 + "KB/S"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: $.encoder.encodeForHTML(diskIOs[h].indexValue),
                                initValue: maxDiskIO,
                                maxValue: maxDiskIO,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            disk.name = columnName(params);
                            diskIOData.push(disk);
                        }
                        getDiskIO(diskIOData);
                    }else{
                        $("#columnchartDiv5").find("div").remove();
                    }

                    //磁盘读出
                    var diskOutData = [];
                    var diskOut = response.monitorTopnMap.disk_io_out;
                    if (diskOut.length !== 0) {
                        var diskO = null;
                        var maxDiskOut = getMaxValueInArray(diskOut);
                        for (var k = 0; k < diskOut.length; k++) {
                            var params =
                            {
                                "vmName" : diskOut[k].resourceName,
                                "vmId" : diskOut[k].resourceId
                            }
                            diskO = {
                                textValue: (Math.round($.encoder.encodeForHTML(diskOut[k].indexValue) / 1 * 100) / 100.00 + "KB/S"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: $.encoder.encodeForHTML(diskOut[k].indexValue),
                                initValue: maxDiskOut,
                                maxValue: maxDiskOut,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            diskO.name = columnName(params);
                            diskOutData.push(diskO);
                        }
                        getDiskOut(diskOutData);
                    }else{
                        $("#columnchartDiv7").find("div").remove();
                    }

                    //磁盘占用率
                    var diskData = [];
                    var disks = response.monitorTopnMap.disk_usage;
                    if (disks.length !== 0) {
                        var diskI = null;
                        for (var s = 0; s < disks.length; s++) {
                            var params =
                            {
                                "vmName" : disks[s].resourceName,
                                "vmId" : disks[s].resourceId
                            }
                            diskI = {
                                textValue: (Math.round($.encoder.encodeForHTML(disks[s].indexValue) / 1 * 100) / 100.00 + "%"),
                                name: $.encoder.encodeForHTML(params.vmName),
                                value: $.encoder.encodeForHTML(disks[s].indexValue),
                                initValue: MAXIMUM_VALUE,
                                maxValue: MAXIMUM_VALUE,
                                color: "#1FBE5C",
                                maxNameLength: "100"
                            };
                            diskI.name = columnName(params);
                            diskData.push(diskI);
                        }
                        getDiskShare(diskData);
                    }else{
                        $("#columnchartDiv6").find("div").remove();
                    }

                });
            };

            //查询当前租户可见的地域列表
            $scope.getLocations = function () {
                var retDefer = $q.defer();
                var promise = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                promise.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        $scope.address.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                }, function (rejectedValue) {
                    retDefer.reject();
                });
                return retDefer.promise;
            };

            function columnName(params)
            {
                var vmId = params.vmId;
                var vmName = params.vmName;
                var result = "<a href='#/ecs/vm?vmId="
                    +encodeURIComponent(vmId)+"&vmName="+encodeURIComponent(vmName)
                    +"&cloudInfraId="+encodeURIComponent(cloudInfraId)+"&fromPerformance="
                    +encodeURIComponent(true)+"'>"+vmName+"</a>";

                if(isIct)
                {
                    result = "<a href='#/ecs/vm?vmId="
                        +encodeURIComponent(vmId)+"&vmName="+encodeURIComponent(vmName)
                        +"&cloudInfraId="+encodeURIComponent(cloudInfraId)+"&vpcId="+encodeURIComponent(vpcId)
                        +"&fromPerformance="+encodeURIComponent(true)+"'>"+vmName+"</a>";
                }
                return result;
            }

            // 查询VPC列表，只有ICT才需要
            function queryVpc() {
                var retDefer = $q.defer();
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfraId,
                    "start": 0,
                    "limit": 100
                };
                var deferred = vmNicServiceIns.queryVpcs(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject(data);
                        return;
                    }
                    if (data.vpcs && data.vpcs.length > 0) {
                        _.each(data.vpcs, function (item) {
                            _.extend(item, {
                                "label": item.name,
                                "selectId": item.vpcID
                            });
                        });

                        var curr = vmNicServiceIns.getUserSelVpc(data.vpcs);
                        curr.checked = true;
                        vpcId = curr.vpcID;
                    }
                    $scope.vpcFilter.values = data.vpcs;
                    retDefer.resolve(data);
                });
                return retDefer.promise;
            }

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = $scope.getLocations();
                promise.then(function () {
                    if (isIct) {
                        var defer = queryVpc();
                        defer.then(function () {
                            //获取初监控视图列表
                            $scope.getData();
                        });
                    }
                    else{
                        $scope.getData();
                    }
                    //每隔十分钟刷新一次
                    $scope.promiseTime = $interval(function () {
                        //获取初监控视图列表
                        $scope.getData();
                    }, 600000);
                });
            });

            /**
             * 清除定时器
             */
            $scope.clearTimer = function () {
                try {
                    $interval.cancel($scope.promiseTime);
                } catch (e) {
                }
            };

            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }
    ];

    //初始化CPU占有率条形图
    function getCpuShare(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv1").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv1",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化内存占有率条形图
    function getMemShare(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv2").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv2",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化网络流入速率条形图
    function getNicIn(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv3").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv3",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化网络流出速率条形图
    function getNicOut(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv4").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv4",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化磁盘写入条形图
    function getDiskIO(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv5").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv5",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化磁盘读出条形图
    function getDiskOut(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv7").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv7",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    //初始化磁盘占有率条形图
    function getDiskShare(data) {
        var series = {
            series: data
        };
        $("#columnchartDiv6").find("div").remove();
        var columnchart = new Columnchart({
            id: "columnchartDiv6",
            width: "500px",
            isFill: false,
            style: "bold",
            textWidth: "auto",
            values: series
        });
    }

    function getMaxValueInArray(data) {
        if (!data) {
            return MAXIMUM_VALUE;
        }
        var maxObj = _.max(data, function (obj) {
            return obj.indexValue;
        });

        if(!maxObj || !maxObj.indexValue){
            return MAXIMUM_VALUE;
        }
        return maxObj.indexValue < MAXIMUM_VALUE ? MAXIMUM_VALUE : maxObj.indexValue;
    }

    return performanceViewCtrl;
});
