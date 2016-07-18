/*global define*/
define([
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-widgets/CirqueChart",
    "tiny-directives/CirqueChart",
    "app/business/application/services/appCommonService",
    "app/business/ecs/services/vm/queryVmService",
    "tiny-widgets/Window",
    "app/business/tenantHome/service/homeTenantService",
    "app/services/cloudInfraService",
    "app/business/ecs/services/vm/vmNicService",
    "app/business/ecs/services/monitorService",
    "app/business/ecs/services/storage/diskService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/network/services/networkService",
    "app/services/competitionConfig",
    "tiny-lib/underscore",
    "tiny-common/UnifyValid",
    "sprintf",
    'tiny-directives/Lineplot',
    "fixtures/tenantHomeFixture",
    "fixtures/appFixture",
    "fixtures/network/network/networkListFixture"],
    function ($, encoder, angular, CirqueChart, _CirqueChart, appCommonService, queryVmService, Window, homeTenantService, cloudInfraService, vmNicService, monitorService, diskService,  orderService, catalogService, networkService,Competition, _,  UnifyValid, spf) {
        "use strict";

        var ctrl = ["$rootScope", "$scope", "$compile", "camel", "$q", "exception", "$state", "storage", function ($rootScope, $scope, $compile, camel, $q, exception, $state, storage) {
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var queryVmServiceIns = new queryVmService(exception, $q, camel);
            var homeTenantServiceIns = new homeTenantService(exception, $q, camel);
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var diskServiceIns = new diskService(exception, $q, camel);
            var orderServiceImpl = new orderService(exception, $q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var networkServiceIns = new networkService(exception, $q, camel);

            var user = $rootScope.user;
            var i18n = $rootScope.i18n;
            $scope.IT = (user.cloudType === "IT");
            // 权限控制
            $scope.hasVmViewRight = _.contains(user.privilegeList, "619000");
            $scope.hasDiskViewRight = _.contains(user.privilegeList, "609000");
            $scope.hasVpcViewRight = _.contains(user.privilegeList, "55");
            $scope.hasAppViewRight = _.contains(user.privilegeList, "303001");
            $scope.hasApprovalOrderRight = _.contains(user.privilegeList, "320005");
            $scope.hasServiceInstanceViewRight = _.contains(user.privilegeList, "320003");
            $scope.hasCloudInfrasRight = _.contains(user.privilegeList, "306000");
            // SC场景首页的呈现，VDC管理员和一般的用户需要差异化，此处通过权限判断，2代表用户，普通用户是没有2这个权限的
            $scope.isVdcMgr = _.contains(user.privilegeList, "2");

            $scope.cpuQuotaInfo = {};
            $scope.memQuotaInfo = {};
            $scope.storageQuotaInfo = {};
            $scope.eipQuotaInfo = {};
            $scope.vpcQuotaInfo = {};
            $scope.vmQuotaInfo = {};
            $scope.sgQuotaInfo = {};

            $scope.homeLabels = {
                "home": i18n.common_term_homePage_label,
                "notice": i18n.common_term_sysBulletin_label,
                "toDo": i18n.service_term_myCharged_label,
                "myResources": i18n.service_term_myResource_label,
                "youHave": i18n.service_service_homePageTodo_para_you_label,
                "tasksToDO": i18n.service_service_homePageTodo_para_approveTask_label,
                "expiredService": i18n.service_service_homePageTodo_para_expiredInstances_label,
                "vm": i18n.common_term_vms_label,
                "host": i18n.server_term_server_label,
                "disks": i18n.common_term_disks_label,
                "app": i18n.app_term_app_label,
                "eip": i18n.eip_term_eip_label,
                "sg": i18n.security_term_SG_label,
                "created": i18n.common_term_created_value + ":",
                "createable": i18n.perform_term_creatable_label + ":",
                "spec": i18n.common_term_spec_label + ":",
                "change": i18n.common_term_change_label,
                "resourceQuota": i18n.common_term_resourceQuota_label,
                "resourceChange": i18n.common_term_resourceChange_label,
                "usage": "使用量",
                "cpuTotal": "CPU总数",
                "memoryTotal": "内存总量",
                "storageTotal": "存储总量",
                "showMore": "显示更多>>",
                "usedValue": "已使用" + ":"
            };
            $scope.isICT = (user.cloudType === "ICT");

            var vmStatusData = [{
                value : 52,
                name : i18n.common_term_natural_value,
                color : "#5ecc49",
                tooltip : "",
                click: function() {
                }
            },{
                value : 11,
                name : i18n.common_term_abnormal_value,
                color : "#ed2e2e",
                tooltip : ""
            },{
                value : 60,
                name : i18n.common_term_noUse_value,
                color : "#eaeaea",
                tooltip : ""
            }];

            var appStatusData = [{
                value : 52,
                name : i18n.common_term_natural_value,
                color : "#5ecc49",
                tooltip : "",
                linearGradient : {
                    startColor : "#5ecc49",
                    endColor : "#19B548",
                    angle : 100
                },
                click: function() {
                    $state.go("chart.columnchart");
                }
            },{
                value : 11,
                name : i18n.common_term_abnormal_value,
                color : "#ed2e2e",
                tooltip : ""
            },{
                value : 60,
                name : i18n.common_term_noUse_value,
                color : "#eaeaea",
                tooltip : ""
            }];

            $scope.vmStates = {
                "id": "home-vmStatus-cirque",
                "r" : "75",
                "showLegend" : true,
                "centerText" : {
                    text : "133",
                    fontSize : 46,
                    color : "#5ecc49"
                },
                "data": vmStatusData
            };

            $scope.appStatus = {
                "id": "home-appStatus-cirque",
                "r" : "75",
                "showLegend" : true,
                "centerText" : {
                    text : "62",
                    fontSize : 46,
                    color : "#5ecc49"
                },
                "data": appStatusData
            };

            // 我的待办
            $scope.task = {
                "approvingOrders": "",
                "goToApprovalOrders" :function(){
                    $state.go("ssp.order.approval", {});
                },
                "expiredServices": "",
                "goToExpiredServices" :function(){
                    $state.go("ssp.instance.myInstance", {status: "expired"});
                }
            };

            var cpuData = [
                {
                    value: "",
                    name: $scope.homeLabels.usedValue,
                    tooltip: $scope.homeLabels.usedValue,
                    color: "#1fbe5c"
                },
                {
                    value: "",
                    name: i18n.common_term_noUse_value + ":",
                    tooltip: i18n.common_term_noUse_value + ":",
                    color: "#d5d5d5"
                }
            ];
            var memData = [
                {
                    value: "",
                    name: $scope.homeLabels.usedValue,
                    tooltip: $scope.homeLabels.usedValue,
                    color: "#1fbe5c"
                },
                {
                    value: "",
                    name: i18n.common_term_noUse_value + ":",
                    tooltip: i18n.common_term_noUse_value + ":",
                    color: "#d5d5d5"
                }
            ];
            var storageData = [
                {
                    value: "",
                    name: $scope.homeLabels.usedValue,
                    tooltip: $scope.homeLabels.usedValue,
                    color: "#1fbe5c"
                },
                {
                    value: "",
                    name: i18n.common_term_noUse_value + ":",
                    tooltip: i18n.common_term_noUse_value + ":",
                    color: "#d5d5d5"
                }
            ];

            var cpuCirqueOption = {
                "id": "home-cpu-quota-cirque",
                "r": "75",
                "showLegend": true,
                "centerText": {
                    text: "",
                    fontSize: 46,
                    color: "#5ecc49"
                },
                "data": cpuData
            };
            var memCirqueOption = {
                "id": "home-mem-quota-cirque",
                "r": "75",
                "showLegend": true,
                "centerText": {
                    text: "",
                    fontSize: 46,
                    color: "#5ecc49"
                },
                "data": memData
            };
            var storageCirqueOption = {
                "id": "home-storage-quota-cirque",
                "r": "75",
                "showLegend": true,
                "centerText": {
                    text: "",
                    fontSize: 46,
                    color: "#5ecc49"
                },
                "data": storageData
            };

            $scope.resourceQuotas = {
                "id": "homeResourceQuotaId",
                "enablePagination": false,
                "columns": [
                    {"sTitle": i18n.common_term_resource_label, "sWidth": "15%", "mData": function(data) {
                        return $.encoder.encodeForHTML(data.resourceName);
                    }},
                    {"sTitle": i18n.perform_term_UsageRate_label, "sWidth": "40%", "mData": function(data) {
                        return $.encoder.encodeForHTML(data.useRate);
                    }},
                    {"sTitle": i18n.common_term_total_label, "sWidth": "15%", "mData": function(data) {
                        return $.encoder.encodeForHTML(data.totalStr);
                    }},
                    {"sTitle": i18n.common_term_used_value, "sWidth": "15%", "mData": function(data) {
                        return $.encoder.encodeForHTML(data.usedStr);
                    }},
                    {"sTitle": i18n.common_term_noUse_value, "sWidth": "15%", "mData": function(data) {
                        return $.encoder.encodeForHTML(data.unusedStr);
                    }}
                ],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    //tips提示
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    $("td:eq(5)", nRow).addTitle();

                    var progressBar = "<div class='progressbar'><div class='bar' style='width: {{progress}}'></div><div class='text'>{{progress}}</div></div>";
                    var progressLink = $compile(progressBar);
                    var progressScope = $scope.$new();
                    progressScope.progress = $.encoder.encodeForHTML(aData.useRate);
                    var progressNode = progressLink(progressScope);
                    $("td:eq(1)", nRow).html(progressNode);
                }
            };

            $scope.configSpec = {
                "selCpuCount": 4,
                "selMemorySize": 8,
                "specDetailStr": "4*CPU, 8G" + i18n.common_term_memory_label,
                "unsedVm": "",
                "usedVm": "",
                "show": false,
                "toggleShowSpec": function(){
                    $scope.configSpec.show = !$scope.configSpec.show;
                },
                "okBtn": {
                    "id" : "homeChooseCpuMemoryOk",
                    "text" : i18n.common_term_ok_button,
                    "click" : function() {
                        if(!UnifyValid.FormValid($(".homeConfigCpuMemoryDiv"))) {
                            return;
                        }
                        var cpuInput = $("#" + $scope.cpuCount.id).widget().getValue();
                        $scope.configSpec.selCpuCount = parseInt(cpuInput, 10);
                        var memInput = $("#" + $scope.memorySize.id).widget().getValue();
                        $scope.configSpec.selMemorySize = parseInt(memInput, 10);
                        $scope.configSpec.specDetailStr = $scope.configSpec.selCpuCount + "*CPU, " + $scope.configSpec.selMemorySize + "G" + i18n.common_term_memory_label;
                        queryQuotas();
                        $scope.configSpec.toggleShowSpec();
                    }
                }
            };

            $scope.cpuCount = {
                "label": "vCPU(" + i18n.common_term_entry_label + "):",
                "id": "homeChooseCpuCount",
                "width": "100",
                "value": "20",
                "require": true,
                "tips": "1~64",
                "validate": "integer:" + spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 64) + ";maxValue(64):" +
                    spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 64) + ";minValue(1):" + spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 64) + ";"
            };

            $scope.memorySize = {
                "label": i18n.common_term_memoryGB_label + ":",
                "id": "homeChooseMemorySize",
                "width": "100",
                "value": "20",
                "require": true,
                "tips": "1~65536GB",
                "validate": "integer:" + spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 65536) + ";maxValue(65536):" + spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 65536) +
                    ";minValue(1):" + spf.sprintf(i18n.common_term_rangeInteger_valid, 1, 65536) + ";"
            };

            $scope.myResources = {
                "vmLabel": i18n.common_term_vms_label,
                "vmValue": "0",
                "hostLabel": i18n.server_term_server_label,
                "hostValue": "0",
                "diskLabel": i18n.common_term_disks_label,
                "diskValue": "0",
                "netLabel": "VPC",
                "netValue": "0",
                "appLabel": i18n.app_term_app_label,
                "appValue": "0",
                "sgLabel": i18n.security_term_SG_label,
                "sgValue": "0",
                "eipLabel": i18n.eip_term_eip_label,
                "eipValue": "0"
            };

            var cloudInfra = null;
            var vpcId = "";
            $scope.searchLocation = {
                "id": "ecsVmsSearchLocation",
                "width": "100",
                "values": [],
                "change": function () {
                    cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.searchLocation.values, $("#ecsVmsSearchLocation").widget().getSelectedId());
                    onSelectLocation();
                    storage.add("cloudInfraId", cloudInfra.id);
                }
            };

            $scope.searchVpc = {
                "id": "ecsVmsSearchVpc",
                "width": "100",
                "values": [],
                "change": function() {
                    vpcId = $("#" + $scope.searchVpc.id).widget().getSelectedId();
                    queryVmNums();
                    queryDiskNums();
                    storage.add("vpcId", vpcId);
                }
            };

            function refreshVmCreateStatistic(usedCount, unusedCount){
                $("#tenantHomeVmCreationStatistic").empty();
                var options = {
                    "id": "tenantHomeVmCreationStatistic",
                    "rotate": 400,
                    "r": 75,
                    "width": 500,
                    "strokeWidth": 20,
                    "showShadow": false,
                    "showLegend": true,
                    "showClickEvent": true,
                    "centerText": {
                        text : "",
                        fontSize : 46,
                        color: "#5ecc49"
                    },
                    "data": [{
                        "value": 0,
                        "name": i18n.common_term_created_value + ":",
                        color: "#5ecc49"
                    },
                        {
                            "value": 0,
                            "name": i18n.perform_term_creatable_label + ":",
                            color: "#eaeaea"
                        }]
                };
                var usedRate = 0;
                var unusedRate = 0;
                var total = usedCount + unusedCount;
                if (unusedCount < 0){
                    unusedCount = i18n.common_term_notLimit_value;
                    usedRate = 0;
                    unusedRate = 100;
                    total = "\u221E";
                }
                else {
                    if (total === 0){
                        usedRate = 0;
                        unusedRate = 0;
                    }
                    else {
                        usedRate = monitorService.getPercentageRate(usedCount, total);
                        unusedRate = monitorService.getPercentageRate(unusedCount, total);
                    }
                }

                options.centerText.text = $.encoder.encodeForHTML(total);
                options.data[0].value = $.encoder.encodeForHTML(usedRate);
                options.data[0].name += $.encoder.encodeForHTML(usedCount);
                options.data[1].value = $.encoder.encodeForHTML(unusedRate);
                options.data[1].name += $.encoder.encodeForHTML(unusedCount);
                var vmChart = new CirqueChart(options);
            }

            function queryQuotas(){
                var params = {
                    "user": user
                };
                var deferred = homeTenantServiceIns.queryOrgQuota(params);
                deferred.then(function(data){
                    if (!data || !data.vdcInfo){
                        return;
                    }
                    if (!data.vdcInfo.quotaInfo || (data.vdcInfo.quotaInfo.length <= 0)){
                        return;
                    }
                    if (!data.vdcInfo.quotaUsage || (data.vdcInfo.quotaUsage.length <= 0)){
                        return;
                    }

                    var cpuLimit = -1;
                    var memLimit = -1;
                    var diskLimit = -1;
                    var elasticIpLimit = -1;
                    var vpcLimit = -1;
                    var vmLimit = -1;
                    var segLimit = -1;
                    var cpuUsed = 0;
                    var memUsed = 0;
                    var diskUsed = 0;
                    var elasticIpUsed = 0;
                    var vpcUsed = 0;
                    var vmUsed = 0;
                    var segUsed = 0;
                    _.each(data.vdcInfo.quotaInfo, function(item, index){
                        if ("CPU" === item.quotaName){
                            cpuLimit = item.limit;
                        }
                        if ("MEMORY" === item.quotaName){
                            memLimit = item.limit;
                        }
                        if ("STORAGE" === item.quotaName){
                            diskLimit = item.limit;
                        }
                        if ("EIP" === item.quotaName){
                            elasticIpLimit = item.limit;
                        }
                        if ("VPC" === item.quotaName){
                            vpcLimit = item.limit;
                        }
                        if ("VM" === item.quotaName){
                            vmLimit = item.limit;
                        }
                        if ("SEG" === item.quotaName){
                            segLimit = item.limit;
                        }
                    });
                    _.each(data.vdcInfo.quotaUsage, function(item, index){
                        if ("CPU" === item.quotaName){
                            cpuUsed = item.value;
                        }
                        if ("MEMORY" === item.quotaName){
                            memUsed = item.value;
                        }
                        if ("STORAGE" === item.quotaName){
                            diskUsed = item.value;
                        }
                        if ("EIP" === item.quotaName){
                            elasticIpUsed = item.value;
                        }
                        if ("VPC" === item.quotaName){
                            vpcUsed = item.value;
                        }
                        if ("VM" === item.quotaName){
                            vmUsed = item.value;
                        }
                        if ("SEG" === item.quotaName){
                            segUsed = item.value;
                        }
                    });
                    var quotaList = [];
                    var cpuQuotaItem = {
                        "resourceName": i18n.common_term_vcpuNum_label,
                        "useRate": "",
                        "total": cpuLimit,
                        "totalStr": (cpuLimit < 0?i18n.common_term_notLimit_value : cpuLimit),
                        "used": cpuUsed,
                        "usedStr": cpuUsed,
                        "unused": "",
                        "unusedStr": ""
                    };
                    quotaList.push(cpuQuotaItem);
                    if (cpuLimit < 0){
                        cpuQuotaItem.unused = -1;
                        cpuQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        cpuQuotaItem.useRate = "0%";
                    }
                    else {
                        cpuQuotaItem.unused = cpuLimit - cpuUsed;
                        cpuQuotaItem.unusedStr = cpuQuotaItem.unused;
                        cpuQuotaItem.useRate = monitorService.percentage(cpuUsed, cpuLimit);
                    }

                    $scope.cpuQuotaInfo = cpuQuotaItem;

                    var memQuotaItem = {
                        "resourceName": i18n.common_term_memory_label,
                        "useRate": "",
                        "total": memLimit,
                        "totalStr": (memLimit < 0?i18n.common_term_notLimit_value : memLimit + " MB"),
                        "used": memUsed,
                        "usedStr": memUsed + " MB",
                        "unused": "",
                        "unusedStr": ""
                    };
                    quotaList.push(memQuotaItem);
                    if (memLimit < 0){
                        memQuotaItem.unused = -1;
                        memQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        memQuotaItem.useRate = "0%";
                    }
                    else {
                        memQuotaItem.unused = memLimit - memUsed;
                        memQuotaItem.unusedStr = memQuotaItem.unused + " MB";
                        memQuotaItem.useRate = monitorService.percentage(memUsed, memLimit);
                    }

                    $scope.memQuotaInfo = memQuotaItem;
                    var diskQuataItem = {
                        "resourceName": i18n.common_term_storagecCapacity_label,
                        "useRate": "",
                        "total": diskLimit,
                        "totalStr": (diskLimit < 0?i18n.common_term_notLimit_value : diskLimit + " GB"),
                        "used": diskUsed,
                        "usedStr": diskUsed + " GB",
                        "unused": "",
                        "unusedStr": ""
                    };
                    quotaList.push(diskQuataItem);
                    if (diskLimit < 0){
                        diskQuataItem.unused = -1;
                        diskQuataItem.unusedStr = i18n.common_term_notLimit_value;
                        diskQuataItem.useRate = "0%";
                    }
                    else {
                        diskQuataItem.unused = diskLimit - diskUsed;
                        diskQuataItem.unusedStr = diskQuataItem.unused + " GB";
                        diskQuataItem.useRate = monitorService.percentage(diskUsed, diskLimit);
                    }

                    $scope.storageQuotaInfo = diskQuataItem;

                    cpuCirqueOption.centerText.text = parseInt(cpuQuotaItem.useRate, 10) + "%";
                    cpuCirqueOption.data[0].name += cpuQuotaItem.usedStr;
                    cpuCirqueOption.data[0].tooltip += cpuQuotaItem.usedStr;
                    cpuCirqueOption.data[0].value += parseInt(cpuQuotaItem.useRate, 10);
                    cpuCirqueOption.data[1].value += 100 - parseInt(cpuQuotaItem.useRate, 10);
                    cpuCirqueOption.data[1].name += cpuQuotaItem.unusedStr;
                    cpuCirqueOption.data[1].tooltip += cpuQuotaItem.unusedStr;

                    memCirqueOption.centerText.text = parseInt(memQuotaItem.useRate, 10) + "%";
                    memCirqueOption.data[0].name += memQuotaItem.usedStr;
                    memCirqueOption.data[0].tooltip += memQuotaItem.usedStr;
                    memCirqueOption.data[0].value += parseInt(memQuotaItem.useRate, 10);
                    memCirqueOption.data[1].value += 100 - parseInt(memQuotaItem.useRate, 10);
                    memCirqueOption.data[1].name += memQuotaItem.unusedStr;
                    memCirqueOption.data[1].tooltip += memQuotaItem.unusedStr;

                    storageCirqueOption.centerText.text = parseInt(diskQuataItem.useRate, 10) + "%";
                    storageCirqueOption.data[0].name += diskQuataItem.usedStr;
                    storageCirqueOption.data[0].tooltip += diskQuataItem.usedStr;
                    storageCirqueOption.data[0].value += parseInt(diskQuataItem.useRate, 10);
                    storageCirqueOption.data[1].value += 100 - parseInt(diskQuataItem.useRate, 10);
                    storageCirqueOption.data[1].name += diskQuataItem.unusedStr;
                    storageCirqueOption.data[1].tooltip += diskQuataItem.unusedStr;

                    if($scope.deployMode === "serviceCenter" && $scope.isVdcMgr){
                        var cpuUsageCirque = new CirqueChart(cpuCirqueOption);
                        var memUsageCirque = new CirqueChart(memCirqueOption);
                        var storageUsageCirque = new CirqueChart(storageCirqueOption);
                    }

                    var elasticIpQuotaItem = {
                        "resourceName": i18n.eip_term_eipNum_label,
                        "useRate": "",
                        "total": elasticIpLimit,
                        "totalStr": (elasticIpLimit < 0?i18n.common_term_notLimit_value : elasticIpLimit),
                        "used": elasticIpUsed,
                        "usedStr": elasticIpUsed,
                        "unused": "",
                        "unusedStr": ""
                    };
                    if(!Competition.isBaseOnVmware){
                        quotaList.push(elasticIpQuotaItem);
                    }
                    if (elasticIpLimit < 0){
                        elasticIpQuotaItem.unused = -1;
                        elasticIpQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        elasticIpQuotaItem.useRate = "0%";
                    }
                    else {
                        elasticIpQuotaItem.unused = elasticIpLimit - elasticIpUsed;
                        elasticIpQuotaItem.unusedStr = elasticIpQuotaItem.unused;
                        elasticIpQuotaItem.useRate = monitorService.percentage(elasticIpUsed, elasticIpLimit);
                    }

                    $scope.eipQuotaInfo = elasticIpQuotaItem;

                    var vpcQuotaItem = {
                        "resourceName": i18n.vpc_term_vpcNum_label,
                        "useRate": "",
                        "total": vpcLimit,
                        "totalStr": (vpcLimit < 0?i18n.common_term_notLimit_value : vpcLimit),
                        "used": vpcUsed,
                        "usedStr": vpcUsed,
                        "unused": "",
                        "unusedStr": ""
                    };
                    quotaList.push(vpcQuotaItem);
                    if (vpcLimit < 0){
                        vpcQuotaItem.unused = -1;
                        vpcQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        vpcQuotaItem.useRate = "0%";
                    }
                    else {
                        vpcQuotaItem.unused = vpcLimit - vpcUsed;
                        vpcQuotaItem.unusedStr = vpcQuotaItem.unused;
                        vpcQuotaItem.useRate = monitorService.percentage(vpcUsed, vpcLimit);
                    }

                    $scope.vpcQuotaInfo = vpcQuotaItem;

                    var vmQuotaItem = {
                        "resourceName": i18n.vm_term_vmNum_label,
                        "useRate": "",
                        "total": vmLimit,
                        "totalStr": (vmLimit < 0?i18n.common_term_notLimit_value : vmLimit),
                        "used": vmUsed,
                        "usedStr": vmUsed,
                        "unused": "",
                        "unusedStr": ""
                    };
                    quotaList.push(vmQuotaItem);
                    if (vmLimit < 0){
                        vmQuotaItem.unused = -1;
                        vmQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        vmQuotaItem.useRate = "0%";
                    }
                    else {
                        vmQuotaItem.unused = vmLimit - vmUsed;
                        vmQuotaItem.unusedStr = vmQuotaItem.unused;
                        vmQuotaItem.useRate = monitorService.percentage(vmUsed, vmLimit);
                    }

                    $scope.vmQuotaInfo = vmQuotaItem;

                    var segQuotaItem = {
                        "resourceName": i18n.org_term_secuGroupNum_label,
                        "useRate": "",
                        "total": segLimit,
                        "totalStr": (segLimit < 0?i18n.common_term_notLimit_value : segLimit),
                        "used": segUsed,
                        "usedStr": segUsed,
                        "unused": "",
                        "unusedStr": ""
                    };
                    if(!Competition.isBaseOnVmware){
                        quotaList.push(segQuotaItem);
                    }
                    if (segLimit < 0){
                        segQuotaItem.unused = -1;
                        segQuotaItem.unusedStr = i18n.common_term_notLimit_value;
                        segQuotaItem.useRate = "0%";
                    }
                    else {
                        segQuotaItem.unused = segLimit - segUsed;
                        segQuotaItem.unusedStr = segQuotaItem.unused;
                        segQuotaItem.useRate = monitorService.percentage(segUsed, segLimit);
                    }

                    $scope.sgQuotaInfo = segQuotaItem;

                    if($scope.deployMode === "serviceCenter"){
                        return;
                    }

                    $scope.resourceQuotas.data = quotaList;
                    $scope.configSpec.usedVm = vmUsed;
                    var tmpUsedVm = calculateAvailableVmBySpec(vmLimit - vmUsed, cpuQuotaItem.unused, memQuotaItem.unused, $scope.configSpec.selCpuCount, $scope.configSpec.selMemorySize);
                    $scope.configSpec.unsedVm = (tmpUsedVm < 0?i18n.common_term_notLimit_value : tmpUsedVm);

                    refreshVmCreateStatistic(vmUsed, tmpUsedVm);
                });
            }

            function calculateAvailableVmBySpec(vmLimit, cpuUnused, memUnused, selCpuCount, selMemorySize){
                var cpuMax = cpuUnused/selCpuCount;
                var memMax = memUnused/(selMemorySize*1024);
                var max = 0;
                if ((vmLimit < 0) && (cpuMax < 0) && (memMax < 0)){
                    return -1;
                }
                else {
                    //先找出最大,一定为正数的限制
                    var allMax = Math.max(vmLimit, cpuMax, memMax);
                    if (vmLimit >= 0){
                        allMax = Math.min(allMax, vmLimit);
                    }
                    if (cpuMax >= 0){
                        allMax = Math.min(allMax, cpuMax);
                    }
                    if (memMax >= 0){
                        allMax = Math.min(allMax, memMax);
                    }
                    allMax = Math.floor(allMax);
                    return allMax;
                }
            }

            //查询当前租户可见的地域列表
            function getLocations() {
                if(!$scope.hasCloudInfrasRight){
                    return;
                }
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        cloudInfra = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                });
                return retDefer.promise;
            }

            // 查询VPC列表，只有ICT才需要
            function queryVpc() {
                if ($scope.IT) {
                    return {};
                }

                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id
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
                    $scope.searchVpc.values = data.vpcs;
                    retDefer.resolve(data);
                });
                return retDefer.promise();
            }

            function queryVmNums(){
                if (!cloudInfra || !cloudInfra.id || !$scope.hasVmViewRight || ($scope.isICT && !vpcId)){
                    return;
                }
                var options = {
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": $scope.isICT ? vpcId : -1,
                    "vdcId": user.vdcId,
                    "userId": user.id
                };
                var deferred = queryVmServiceIns.queryVmStatusStatistics(options);
                deferred.then(function(data){
                    if (data){
                        $scope.myResources.vmValue = data.runningVmQuantity + data.stoppedVmQuantity + data.others;
                    }
                });
            }

            function queryDiskNums(){
                if (!cloudInfra || !cloudInfra.id || !$scope.hasDiskViewRight || ($scope.isICT && !vpcId)){
                    return;
                }
                var options = {
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": $scope.isICT ? vpcId : -1,
                    "vdcId": user.vdcId,
                    "userId": user.id
                };
                var deferred = diskServiceIns.queryVolumeStatistics(options);
                deferred.then(function(data){
                    if (!data){
                        return;
                    }
                    $scope.myResources.diskValue = data.total;
                });
            }

            function queryVpcNums() {
                if (!cloudInfra || !cloudInfra.id || !$scope.hasVpcViewRight){
                    return;
                }
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id
                };
                var deferred = vmNicServiceIns.queryVpcs(options);
                deferred.then(function(data){
                    if (data){
                        $scope.myResources.netValue = data.total;
                    }
                });
            }

            function queryAppCount(){
                if ($scope.isICT && ((null === vpcId) || ("" === vpcId))){
                    return;
                }
                if (!cloudInfra || !cloudInfra.id || !$scope.hasAppViewRight){
                    return;
                }
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId
                };
                if (!$scope.isICT){
                    options.start = 0;
                }
                var deferred = appCommonServiceIns.queryAppList(options);
                deferred.then(function(data){
                    if (!data){
                        return;
                    }
                    $scope.myResources.appValue = data.total;
                });
            }

            function queryVmStatistic(){
                if (!$scope.hasVmViewRight) {
                    return;
                }

                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId
                };

                var deferred = queryVmServiceIns.queryVmStatistics(options);
                $("#tenantHomeVmStatusStatistic").empty();
                deferred.then(function(data){
                    if (!data){
                        return;
                    }
                    var options = {
                        "id": "tenantHomeVmStatusStatistic",
                        "rotate": 400,
                        "r": 75,
                        "width": 500,
                        "strokeWidth": 20,
                        "showShadow": false,
                        "showLegend": true,
                        "showClickEvent": true,
                        "centerText": {
                            text : "",
                            fontSize : 46,
                            color: "#5ecc49"
                        },
                        "data": [{
                            "value": 0,
                            "name": i18n.common_term_running_value + ":",
                            color: "#5ecc49",
                            "tooltip": i18n.common_term_running_value + ":",
                            "click": function(){
                                $state.go("ecs.vm", {});
                            }
                        },
                            {
                                "value": 0,
                                "name": i18n.common_term_stoped_value + ":",
                                color: "#ed2e2e",
                                "tooltip": i18n.common_term_stoped_value + ":",
                                "click": function(){
                                    $state.go("ecs.vm", {});
                                }
                            },
                            {
                                "value": 0,
                                "name": i18n.common_term_other_label + ":",
                                "tooltip": i18n.common_term_other_label + ":",
                                "color": "#ffff00",
                                click: function(){
                                    $state.go("ecs.vm", {});
                                }
                            }]
                    };
                    var runningCount = 0;
                    var stopCount = 0;
                    var unknownCount = 0;
                    var runningRate = 0;
                    var stopRate = 0;
                    var unknownRate = 0;
                    if (data){
                        if (data.runningVmQuantity){
                            runningCount = data.runningVmQuantity;
                        }
                        if (data.stoppedVmQuantity){
                            stopCount = data.stoppedVmQuantity;
                        }
                        if (data.others){
                            unknownCount = data.others;
                        }
                    }
                    var total = runningCount + stopCount + unknownCount;
                    if (total === 0){
                        runningRate = 0;
                        stopRate = 0;
                        unknownRate = 0;
                    }
                    else {
                        runningRate = monitorService.getPercentageRate(runningCount, total);
                        stopRate = monitorService.getPercentageRate(stopCount, total);
                        unknownRate = monitorService.getPercentageRate(100 - runningRate - stopRate, 100);
                    }

                    options.centerText.text = total;
                    options.data[0].value = runningRate;
                    options.data[0].name += runningCount;
                    options.data[0].tooltip += runningCount;
                    options.data[1].value = stopRate;
                    options.data[1].name += stopCount;
                    options.data[1].tooltip += stopCount;
                    options.data[2].value = unknownRate;
                    options.data[2].name += unknownCount;
                    options.data[2].tooltip += unknownCount;

                    var vmChart = new CirqueChart(options);
                });
            }

            function queryMyOrders(){
                if (!$scope.hasApprovalOrderRight) {
                    return;
                }

                var condition = {
                    "handle-user-id": user.id,
                    "order-id": "",
                    "status": "approving",
                    "type": "",
                    "start": "0"
                };
                var param = {
                    "user":user,
                    "params" : condition
                };
                var deferred = orderServiceImpl.queryOrders(param);
                deferred.then(function(data){
                    if (!data){
                        return;
                    }
                    $scope.task.approvingOrders = data.total;
                });
            }

            // 查询过期服务实例
            function queryExpiredServices() {
                if (!$scope.hasServiceInstanceViewRight) {
                    return;
                }
                var options = {
                    "user": user,
                    "userId": user.id,
                    "status": "expired"
                };
                var deferred = catalogServiceIns.queryServiceInstances(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.task.expiredServices = data.total;
                });
            }

            //查询网络统计信息
            function queryNetworkStatistics(){
                var options = {
                    "userId": user.id,
                    "vdcId": user.vdcId,
                    "cloudInfraId": cloudInfra.id
                };
                var deferred = networkServiceIns.queryNetworkStatistics(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $scope.myResources.sgValue = data.securityGroupNum;
                    $scope.myResources.eipValue = data.elasticIPNum;
                });
            }

            function onSelectLocation(){
                if (cloudInfra) {
                    var defer = queryVpc();
                    $.when(defer).done(function(){
                        queryVmNums();
                        queryDiskNums();
                        queryVpcNums();
                        if ($scope.IT) {
                            queryAppCount();
                            if ($scope.deployMode === 'serviceCenter') {
                                queryNetworkStatistics();
                            }
                        }
                    });
                }
            }

            $scope.applys = {
                "id": "serviceOrderApplyTable",
                "enablePagination": false,
                "columns": [{
                    "sTitle": i18n.common_term_applySN_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.orderId);
                    }
                }, {
                    "sTitle": i18n.service_term_serviceName_label,
                    "bSortable": false,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.orderName);
                    }
                }, {
                    "sTitle": i18n.common_term_status_label,
                    "bSortable": false,
                    "mData": "statusView"
                }],
                "data": null,
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                }
            };

            //当前目录的所有服务列表
            $scope.services = [];

            //申请按钮
            $scope.applyBtn = {
                id: "catalogApplyBtn",
                text: i18n.common_term_apply_button,
                "click": function (url, serviceId) {
                    $state.go(url, {
                        "serviceId": serviceId,
                        "action": "apply"
                    });
                }
            };

            $scope.operate = {
                //获取指定目录的服务列表（包括分页，搜索、刷新）
                "queryCatalogServices": function () {
                    var options = {
                        "user": $scope.user,
                        "start": 0,
                        "limit": 6
                    };
                    var deferred = catalogServiceIns.queryCatalogServices(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.services = data.services;
                    });
                },
                "getMyApply": function () {
                    var condition = {
                        "user-id": user.id,
                        "start": "0",
                        "limit": "10"
                    };

                    var param = {
                        "user": user,
                        "params": condition
                    };

                    var deferred = orderServiceImpl.queryOrders(param);
                    deferred.then(function (data) {
                        if (!data || !data.orders) {
                            return;
                        }
                        //替换状态和类型为中文
                        var orders = data.orders;
                        if (orders && orders.length > 0) {
                            _.each(orders, function (item) {
                                _.extend(item, {
                                    "statusView": orderServiceImpl.statusViewStr[item.status]
                                });
                            });
                        }

                        $scope.applys.data = orders;
                    });
                }
            };

            $scope.$on("$viewContentLoaded", function () {
                queryQuotas();

                if ($scope.deployMode === 'serviceCenter') {
                    if($scope.isVdcMgr){
                        queryMyOrders();
                        queryExpiredServices();
                    }
                    else{
                        $scope.operate.queryCatalogServices();
                        $scope.operate.getMyApply();
                    }
                }

                var deferred = getLocations();
                deferred.then(function(){
                    onSelectLocation();
                });
            });
        }];
        return ctrl;
    });
