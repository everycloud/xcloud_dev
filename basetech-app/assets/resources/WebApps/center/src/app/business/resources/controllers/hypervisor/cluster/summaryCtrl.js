/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/exceptionService",
    "app/services/commonService",
    "fixtures/clusterFixture",
    "app/business/resources/services/monitorService"
], function ($, angular, Window, Exception, CommonService, clusterFixture, monitorService) {
    "use strict";

    var summaryCtrl = ["$scope", "$stateParams", "$state", "$compile", "camel", function ($scope, $stateParams, $state, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_clusterHandle_value;
        $scope.clusterName = $stateParams.clusterName;
        var i18n = $scope.i18n || {};
        $scope.alarmInfo = {"critical": 0, "major": 0, "minor": 0, "warning": 0};
        $scope.isLocal = $scope.deployMode === "local";

        var clusterId = $stateParams.clusterId;
        var hyperId = $stateParams.hyperId;
        $scope.help = {
            show: false
        };
        var types = {
            0: $scope.i18n.common_term_unknown_value,
            1: $scope.i18n.common_term_virtualization_label,
            2: $scope.i18n.virtual_term_bareCluster_label,
            3: $scope.i18n.common_term_manage_label,
            4: $scope.i18n.common_term_databaseCluster_label,
            5: $scope.i18n.resource_term_storageCluster_label
        };
        $scope.label = {
            "name": $scope.i18n.common_term_name_label + ":",
            "type": $scope.i18n.common_term_type_label + ":",
            "desc": $scope.i18n.common_term_desc_label + ":",
            "domain": (i18n.common_term_domain_label || "域") + ":",
            "hypervisor": (i18n.virtual_term_hypervisor_label || "虚拟化环境") + ":",
            "zone": (i18n.resource_term_zone_label || "资源分区") + ":",
            "createTime": (i18n.common_term_discoverTime_label || "发现时间") + ":",
            "host": (i18n.perform_term_hostNumTotalFault_label || "主机总数/故障") + ":",
            "vm": (i18n.perform_term_vmNumTotalFault_label || "虚拟机总数/故障") + ":"
        };
        var levels = {
            1: i18n.common_term_manual_label || "手动",
            3: i18n.common_term_auto_label || "自动"
        };
        var factors = {
            1: "CPU",
            2: i18n.common_term_memory_label || "内存",
            3: i18n.common_term_CPUandMemory_label || "CPU和内存"
        };
        var balances = {
            0: i18n.common_term_notBalance_value || "已失衡",
            1: i18n.common_term_onBalance_value || "已平衡",
            2: i18n.common_term_other_label || "其他"
        };
        var limens = {
            1: i18n.common_term_conservative_label || "保守",
            5: i18n.common_term_medium_label || "中等",
            9: i18n.common_term_radical_label || "激进"
        };
        $scope.info = {
            "name": "",
            "type": "",
            "desc": "",
            "domain": "",
            "hypervisor": "",
            "zone": ""
        };
        $scope.editDomain = function () {
            var newWindow = new Window({
                "winId": "editClusterDomainWindow",
                "title": i18n.domain_term_modifyDomain_button || "修改域",
                "clusterId": clusterId,
                "domainId": $scope.domainId,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/cluster/editDomain.html",
                "height": 350,
                "width": 400,
                "close": function () {
                    getCluster();
                }
            });
            newWindow.show();
        };
        //CPU预留率进度条
        $scope.cpuReserve = {
            id: "cpuReserveBar",
            value: 45
        };
        //内存预留率进度条
        $scope.memoryReserve = {
            id: "memoryReserveBar",
            value: 75
        };
        //存储池分配率进度条
        $scope.storageAllot = {
            id: "storageAllotBar",
            value: 100
        };
        //存储池占用率进度条
        $scope.storageOccupy = {
            id: "storageOccupyBar",
            value: 65
        };
        //高级配置按钮
        $scope.seniorConfigButton = {
            "id": "seniorConfigButton",
            "text": i18n.common_term_advancedSet_label || "高级配置",
            "click": function () {
                var options = {
                    "winId": "seniorConfigWindow",
                    "clusterId": clusterId,
                    "title": i18n.common_term_advancedSet_label || "高级配置",
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/cluster/seniorConfig.html",
                    "height": 600,
                    "width": 900
                };
                if ($scope.hyperType === "VMware") {
                    options.content = "app/business/resources/views/hypervisor/cluster/vmwareSeniorConfig.html";
                    options.height = 300;
                    options.width = 450;
                }
                var newWindow = new Window(options);
                newWindow.show();
            }
        };
        //查看拓扑按钮
        $scope.viewTopologyButton = {
            "id": "viewTopologyButton",
            "text": i18n.common_term_checkTopo_button || "查看拓扑",
            "click": function () {
                $state.go("resources.clusterTopology");
            }
        };
        //设置计算资源调度按钮
        $scope.setScheduleButton = {
            "id": "setScheduleButton",
            "text": i18n.virtual_term_setSchedule_button || "设置计算资源调度",
            "click": function () {
                var options = {
                    "winId": "setScheduleWindow",
                    "title": i18n.virtual_term_setSchedule_button || "设置计算资源调度",
                    "clusterId": clusterId,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/cluster/setSchedule.html",
                    "height": 700,
                    "width": 1024,
                    "close": function () {
                        getDrs();
                    }
                };
                if ($scope.hyperType === "VMware") {
                    options.content = "app/business/resources/views/hypervisor/cluster/vmwareSetSchedule.html";
                    options.height = 500;
                    options.width = 900;
                }
                var newWindow = new Window(options);
                newWindow.show();
            }
        };

        $scope.azDetailTagTable = {
            "id": "azDetailTagTableId",
            "data": [],
            "enablePagination": false,
            "columns": [
                {
                    "sTitle": i18n.cloud_term_tagName_label || "标签名",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": i18n.cloud_term_tagValue_label || "标签值",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.value);
                    },
                    "bSortable": false
                }
            ],
            "renderRow": function (nRow, aData, iDataIndex) {
            }
        };


        function getCluster() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}", o: {id: clusterId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var cluster = data.resourceCluster;
                $scope.$apply(function () {
                    $scope.info.name = cluster.name;
                    $scope.info.domain = cluster.domain;
                    $scope.domainId = cluster.domainId;
                    $scope.info.desc = cluster.description;
                    $scope.info.type = types[cluster.type];
                    $scope.info.zone = cluster.zoneId;
                    $scope.info.createTime = (cluster.createTime && cluster.createTime !== "") ?
                        new Date(cluster.createTime).format('yyyy-MM-dd hh:mm:ss') : "";
                    $scope.info.hypervisor = cluster.hypervisorName;

                    $scope.azDetailTagTable.data = data.resourceCluster.tags;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        $scope.gotoAlarm = function (level) {
            $state.go("monitor.alarmlist", {"severity": level, "resourceid": clusterId, moc: "cluster", "alarmtype": 1});
        };
        //获取告警信息
        function getAlarm() {
            var params = {
                "conditionList": [
                    {
                        "staticType": ["critical", "major", "minor", "warning"],
                        "staticCond": {"moc": "cluster", "objectId": clusterId}
                    }
                ]
            };
            var urlChoose = "/goku/rest/v1.5/1/alarms/statistic";
            if ($scope.isLocal) {
                urlChoose = "/goku/rest/v1.5/fault/1/alarms/statistic";
            }
            var deferred = camel.post({
                "url": {s: urlChoose},
                "userId": user.id,
                "params": JSON.stringify(params)
            });
            deferred.done(function (response) {
                $scope.$apply(function () {
                    if (response && response.value[0] && response.value[0].staticType) {
                        $scope.alarmInfo.critical = response.value[0].staticType.critical;
                        $scope.alarmInfo.major = response.value[0].staticType.major;
                        $scope.alarmInfo.minor = response.value[0].staticType.minor;
                        $scope.alarmInfo.warning = response.value[0].staticType.warning;
                    }
                });
            });
            deferred.fail(function (response) {
            });
        }

        //获取集群的监控信息
        function getMonitor() {
            var value = monitorService.getMonitor(clusterId, null, "cluster", ["cpu_usage", "mem_usage", "storage_usage"], function (value) {
                if (value.success) {
                    $scope.$apply(function () {
                        var map = value.data;
                        $scope.cpuUsedRate = precision2(map.cpu_usage);
                        $scope.memUsedRate = precision2(map.mem_usage);
                        $scope.storageUsedRate = precision2(map.storage_usage);
                    });
                } else {
                    exceptionService.doException(value.data);
                }
            });
        }

        function getCapacity() {
            var value = monitorService.getCapacity(clusterId, null, "cluster", ["cpu_capacity", "mem_capacity", "storage_capacity"], function (value) {
                if (value.success) {
                    $scope.$apply(function () {
                        var map = value.data;
                        //cpu是容量信息
                        var cpuCap = map.cpu_capacity;
                        $scope.cpu_availableCapacity = precision2(cpuCap.availableCapacity);
                        $scope.cpu_totalCapacity = precision2(cpuCap.totalCapacity);
                        $scope.cpu_reserveCapacity = precision2(cpuCap.reserveCapacity);
                        $scope.cpu_reserveRate = monitorService.percentage(cpuCap.reserveCapacity, cpuCap.totalCapacity);

                        var memCap = map.mem_capacity;
                        $scope.mem_availableCapacity = precision2(memCap.availableCapacity);
                        $scope.mem_totalCapacity = precision2(memCap.totalCapacity);
                        $scope.mem_reserveCapacity = precision2(memCap.reserveCapacity);
                        $scope.mem_reserveRate = monitorService.percentage(memCap.reserveCapacity, memCap.totalCapacity);

                        var storageCap = map.storage_capacity;
                        $scope.storage_usedCapacity = precision2(storageCap.usedCapacity);
                        $scope.storage_remainCapacity = precision2(storageCap.totalCapacity - storageCap.usedCapacity);
                        $scope.storage_totalCapacity = precision2(storageCap.totalCapacity);
                        $scope.storage_allocatedCapacity = precision2(storageCap.allocatedCapacity);
                        $scope.storage_allocatedRate = monitorService.percentage(storageCap.allocatedCapacity, storageCap.totalCapacity);
                    });
                } else {
                    exceptionService.doException(value.data);
                }
            });
        }

        function getDrs() {
            var deferred = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/irm/1/resourceclusters/{id}/drs",
                    o: {id: clusterId}
                },
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var drsParams = data.drsParams || {};
                $scope.$apply(function () {
                    $scope.drsSwitch = drsParams.drsSwitch;
                    $scope.drsLevel = levels[drsParams.drsLevel] || drsParams.drsLevel;
                    $scope.factor = factors[drsParams.factor] || drsParams.factor;
                    $scope.drsBalance = balances[drsParams.drsBalance] || drsParams.drsBalance;
                    $scope.drsLimen = limens[drsParams.drsLimen] || drsParams.drsLimen;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function getHypervisor() {
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: hyperId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                $scope.hyperType = data.hypervisor.type;
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        function precision2(numberStr) {
            var number = 0;
            try {
                number = new Number(numberStr);
            } catch (error) {
            }
            return number.toFixed(2);
        }

        getCluster();
        if ($scope.privilege['perform_term_monitor_label.107001']) {
            getCapacity();
            getMonitor();
        }
        getDrs();
        getHypervisor();
        getAlarm();
    }];
    return summaryCtrl;
});
