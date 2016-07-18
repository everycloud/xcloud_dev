/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Lineplot",
    "tiny-common/UnifyValid",
    "app/services/exceptionService",
    "app/services/commonService",
    "fixtures/hypervisorFixture"],
    function ($,angular, Window, Lineplot, UnifyValid, Exception,commonService) {
        "use strict";

        var zoneSummaryCtrl = ["$scope", "$stateParams", "camel", "validator", function ($scope, $stateParams, camel, validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.operable = user.privilege.role_role_add_option_zoneHandle_value;
            var zoneId = $stateParams.id;
            var networkModes = {
                "SWITCH_WITH_FIREWALL": $scope.i18n.resource_zone_add_para_type_option_handleFw_value,
                "FIREWALL_ONLY": $scope.i18n.resource_zone_add_para_type_option_gateOnFw_value,
                "SWITCH_ONLY": $scope.i18n.resource_zone_add_para_type_option_unhandleFw_value,
                "EMTPY": $scope.i18n.resource_zone_add_para_type_option_noGate_value
            };
            $scope.label = {
                "networkMode": $scope.i18n.resource_term_physiNetMode_label+":",
                "createTime": $scope.i18n.common_term_createAt_label+":",
                "lastTime": $scope.i18n.common_term_lastModifiedTime_label+":",
                "rate": $scope.i18n.perform_term_UsageRate_label+":",
                "total": $scope.i18n.common_term_capacityTotal_label+"/" +
                    ($scope.i18n.perform_term_reserved_label || "预约容量") + ":",
                "useInfo": $scope.i18n.perform_term_usedAndLeft_label+":",
                "allotInfo": $scope.i18n.perform_term_allocatedCapacityAndRtae_label+":"
            };
            $scope.nameItem = {
                "label": $scope.i18n.common_term_name_label+":",
                "value": "",
                "id": "zoneSummaryNameItem",
                "modifying": false,
                "validate": "required:"+$scope.i18n.common_term_null_valid+
                    ";maxSize(128):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})+
                    ";regularCheck(" + validator.ChineseRe + "):"+$scope.i18n.common_term_composition2_valid,
                "clickModify": function () {
                    $scope.nameItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#" + $scope.nameItem.id + " input").focus();
                    }, 200);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                    if (!result) {
                        return;
                    }
                    $scope.nameItem.value = $("#" + $scope.nameItem.id).widget().getValue();
                    $scope.nameItem.modifying = false;
                    editZone();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.nameItem.value = $("#" + $scope.nameItem.id).widget().getValue();
                            $scope.nameItem.modifying = false;
                            editZone();
                        });
                    }
                }
            };
            $scope.descItem = {
                "label": $scope.i18n.common_term_desc_label+":",
                "value": "",
                "id": "zoneSummaryDescItem",
                "modifying": false,
                "type": "multi",
                "height": "50",
                "width": "200",
                "validate":  "maxSize(1024):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"1024"}),
                "clickModify": function () {
                    $scope.descItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#" + $scope.descItem.id + " input").focus();
                    }, 300);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                    if (!result) {
                        return;
                    }
                    $scope.descItem.value = $("#" + $scope.descItem.id).widget().getValue();
                    $scope.descItem.modifying = false;
                    editZone();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.descItem.value = $("#" + $scope.descItem.id).widget().getValue();
                            $scope.descItem.modifying = false;
                            editZone();
                        });
                    }
                }
            };
            $scope.areaItem = {
                "label": $scope.i18n.common_term_location_label+":",
                "value": "",
                "id": "zoneSummaryDescItem",
                "modifying": false,
                "validate": "maxSize(256):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"0","2":"256"}),
                "clickModify": function () {
                    $scope.areaItem.modifying = true;

                    //延时一会，否则获取不到焦点
                    setTimeout(function () {
                        $("#" + $scope.areaItem.id + " input").focus();
                    }, 200);
                },
                "blur": function () {
                    var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                    if (!result) {
                        return;
                    }
                    $scope.areaItem.value = $("#" + $scope.areaItem.id).widget().getValue();
                    $scope.areaItem.modifying = false;
                    editZone();
                },
                "keypressfn": function (event) {
                    if (event.keyCode === 13) {
                        var result = UnifyValid.FormValid($("#zoneSummaryBasic"));
                        if (!result) {
                            return;
                        }
                        $scope.$apply(function () {
                            $scope.areaItem.value = $("#" + $scope.areaItem.id).widget().getValue();
                            $scope.areaItem.modifying = false;
                            editZone();
                        });
                    }
                }
            };
            function editZone() {
                var model = {
                    "name": $scope.nameItem.value,
                    "region": $scope.areaItem.value,
                    "description": $scope.descItem.value
                };
                var deferred = camel.put({
                    url: {s: " /goku/rest/v1.5/irm/1/zones/{id}", o: {id: $stateParams.id}},
                    "params": JSON.stringify(model),
                    "userId": user.id
                });
                deferred.success(function (xml) {
                    getZone();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            //网络池条形图
            var networkSeries = [
                {
                    textValue: "<span></span>/",
                    name: $scope.i18n.resource_term_vlanPools_label,
                    value: 0,
                    initValue: 300,
                    maxValue: 400,
                    color: "#5ECC49"
                },
                {
                    textValue: "<span></span>/",
                    name: $scope.i18n.vpc_term_publicIPpool_label,
                    value: 0,
                    initValue: 300,
                    maxValue: 400,
                    color: "#5ECC49"
                },
                {
                    textValue: "<span></span>/",
                    name: $scope.i18n.resource_term_hardVFW_label,
                    value: 0,
                    initValue: 300,
                    maxValue: 400,
                    color: "#5ECC49"
                }
            ];
            var networkLegend = [
                {type: 0, color: "#5ECC49", desc: $scope.i18n.common_term_used_value},
                {type: 0, color: "#cccccc", desc: $scope.i18n.common_term_available_label}
            ];
            if($scope.locale === "zh"){
                networkLegend.push({type: 1, desc: "单位:  个"});
            }
            $scope.networkChart = {
                "id": "networkChart",
                "isFill": false,
                "bold": "bold",
                "width": 530,
                "values": {
                    "series": networkSeries,
                    "legend": networkLegend
                }
            };
            function getZone() {
                var deferred = camel.get({
                    url: {s: "/goku/rest/v1.5/irm/1/zones/{id}", o: {id: $stateParams.id}},
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var zone = data.zone;
                    $scope.$apply(function () {
                        $scope.nameItem.value = zone.name;
                        $scope.areaItem.value = zone.region;
                        $scope.descItem.value = zone.description;
                        $scope.createTime = (zone.createTime && zone.createTime !== "")?
                            new Date(zone.createTime).format('yyyy-MM-dd hh:mm:ss'):"";
                        $scope.lastModifiedTime = (zone.lastModifiedTime && zone.lastModifiedTime !== "")?
                            new Date(zone.lastModifiedTime).format('yyyy-MM-dd hh:mm:ss'):"";
                        $scope.mode = networkModes[zone.networkMode];
                        $scope.zoneId = zone.id;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function getStatistics() {
                var params = {
                    "zoneIds": [zoneId]
                };
                var deferred = camel.post({
                    url: {s: " /goku/rest/v1.5/capacity-statistics/zones"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var statistics = data.reponse[zoneId];
                    if(!statistics){
                        statistics = {
                            cpuBooked: 0,
                            cpuTotalSizeGHz: 0,
                            cpuUsageRate: 0,
                            cpuUsedSizeGHz: 0,
                            memBooked: 0,
                            memTotalSizeGB: 0,
                            memUsageRate: 0,
                            memUsedSizeGB: 0,
                            publicIPTotalNum: 0,
                            publicIPUsedNum: 0,
                            resultCode: null,
                            storageAllocatedSizeGB: 0,
                            storagePoolAllocatedRate: 0,
                            storagePoolBooked: 0,
                            storagePoolTotalSizeGB: 0,
                            storagePoolUsageRate: 0,
                            storagePoolUsedSizeGB: 0,
                            taskIdList: null,
                            virtualFirewallTotalNum: 0,
                            virtualFirewallUsedNum: 0,
                            vlanTotalNum: 0,
                            vlanUsageRate: 0,
                            vlanUsedNum: 0
                        };
                    }
                    $scope.$apply(function () {
                        $scope.cpu = {};
                        $scope.cpu.rate = statistics.cpuTotalSizeGHz?(statistics.cpuUsedSizeGHz * 100 / statistics.cpuTotalSizeGHz).toFixed(2) + "%":"0.00%";
                        $scope.cpu.total = statistics.cpuTotalSizeGHz.toFixed(2) + "GHz / " + (statistics.cpuBooked.toFixed(2) || 0) + "GHz";
                        $scope.cpu.useInfo = statistics.cpuUsedSizeGHz.toFixed(2) + "GHz / " + (statistics.cpuTotalSizeGHz - statistics.cpuUsedSizeGHz).toFixed(2) + "GHz";
                        $scope.memory = {};
                        $scope.memory.rate = statistics.memTotalSizeGB?(statistics.memUsedSizeGB * 100 / statistics.memTotalSizeGB).toFixed(2) + "%":"0.00%";
                        $scope.memory.total = statistics.memTotalSizeGB.toFixed(2) + "GB / " + (statistics.memBooked.toFixed(2) || 0) + "GB";
                        $scope.memory.useInfo = statistics.memUsedSizeGB.toFixed(2) + "GB / " + (statistics.memTotalSizeGB - statistics.memUsedSizeGB).toFixed(2) + "GB";
                        $scope.storage = {};
                        $scope.storage.rate = statistics.storagePoolTotalSizeGB?(statistics.storagePoolUsedSizeGB * 100 / statistics.storagePoolTotalSizeGB).toFixed(2) + "%":
                            "0.00%";
                        $scope.storage.total = statistics.storagePoolTotalSizeGB.toFixed(2) + "GB / " + (statistics.storagePoolBooked.toFixed(2) || 0) + "GB";
                        $scope.storage.useInfo = statistics.storagePoolUsedSizeGB.toFixed(2) + "GB / " +
                            (statistics.storagePoolTotalSizeGB - statistics.storagePoolUsedSizeGB).toFixed(2) + "GB";
                        var allotRate = statistics.storagePoolTotalSizeGB?(statistics.storageAllocatedSizeGB * 100 / statistics.storagePoolTotalSizeGB).toFixed(2) + "%":"0.00%";
                        $scope.storage.allotInfo = statistics.storageAllocatedSizeGB.toFixed(2) + "GB / " + allotRate;
                    });
                    networkSeries[0].textValue = "<span>"+statistics.vlanUsedNum+"</span>/"+(statistics.vlanTotalNum-statistics.vlanUsedNum);
                    networkSeries[0].value = statistics.vlanUsedNum / statistics.vlanTotalNum * networkSeries[0].initValue;
                    networkSeries[1].textValue = "<span>"+statistics.publicIPUsedNum+"</span>/"+(statistics.publicIPTotalNum-statistics.publicIPUsedNum);
                    networkSeries[1].value = statistics.publicIPUsedNum / statistics.publicIPTotalNum * networkSeries[1].initValue;
                    networkSeries[2].textValue = "<span>"+statistics.virtualFirewallUsedNum+"</span>/"+(statistics.virtualFirewallTotalNum-statistics.virtualFirewallUsedNum);
                    networkSeries[2].value = statistics.virtualFirewallUsedNum / statistics.virtualFirewallTotalNum * networkSeries[2].initValue;
                    $("#"+$scope.networkChart.id).widget().option("values",$scope.networkChart.values);
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            getZone();
            getStatistics();
        }];
        return zoneSummaryCtrl;
    });
