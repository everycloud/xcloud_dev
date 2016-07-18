/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-widgets/CirqueChart",
	"app/services/exceptionService",
    "app/business/resources/services/monitorService",
    'app/business/resources/controllers/constants',
    "app/business/portlet/services/homeService",
    "tiny-common/UnifyValid"
],
    function ($, angular, Message, Window, CirqueChart, Exception, monitorService, constants, HomeService, UnifyValid) {
        "use strict";

        var summaryCtrl = ["$scope", "$stateParams", "$compile", "$state", "$q", "camel", "timeService","$rootScope",
				function ($scope, $stateParams, $compile, $state, $q, camel, timeService,$rootScope) {
            var user = $("html").scope().user;
			var exceptionService = new Exception();
			$scope.hasPoolOperateRight = $rootScope.user.privilege.role_role_add_option_cloudPoolHandle_value;

            $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
            var homeService = new HomeService($q, camel);
            var infraId = $stateParams.infraId;
            $scope.infraName = $stateParams.infraName;

            $scope.basicInfo = {
                name: {
                    "label": $scope.i18n.common_term_name_label+"："
                },
                id: {
                    "label": "ID："
                },
                connectStatus: {
                    "label": $scope.i18n.common_term_linkStatus_value+"："
                },
                serviceStatus: {
                    "label": $scope.i18n.common_term_usageStatus_label+"："
                },
                type: {
                    "label": $scope.i18n.common_term_type_label+"："
                },
                version: {
                    "label": $scope.i18n.common_term_version_label+"："
                },
                provider: {
                    "label": $scope.i18n.common_term_provider_label+"："
                },
                ip: {
                    "label": "IP："
                },
                userName: {
                    "label": $scope.i18n.virtual_term_interconnectUser_label+"："
                },
                createTime: {
                    "label": $scope.i18n.common_term_addTime_label+"："
                },
                modifyTime: {
                    "label": $scope.i18n.common_term_modifyTime_label+"："
                },
                connectFailedTime: {
                    "label": $scope.i18n.cloud_term_lastCutLinkTime_label+"："
                },
                description: {
                    "label": $scope.i18n.common_term_desc_label+"："
                }
            };
            var CONNECT_STATUS = {
                "connected": $scope.i18n.common_term_natural_value,
                "disconnected": $scope.i18n.common_term_abnormal_value,
                "connecting": $scope.i18n.common_term_linking_value,
                "connected_failed": $scope.i18n.common_term_linkFail_value
            };
            var SERVICE_STATUS = {
                "normal": $scope.i18n.common_term_onuse_value,
                "pause": $scope.i18n.common_term_pauseUse_value,
                "abnormal": $scope.i18n.common_term_abnormal_value
            };

            //折线图
            var inData = [
                [1392084150102, 10],
                [1392170569000, 20],
                [1392256992746, 50]
            ];
            var lineModelData = [
                {
                    data: inData,
                    color: "#ED9121",
                    label: "虚拟机创建趋势"
                }
            ];
            $scope.azVmChart = {
                "id": "lineModelId",
                "width": "500px",
                "height": "300px",
                "data": lineModelData,
                "caption": {},
                "tips": {
                    "tooltip": false//是否显示tooltip
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": true,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": 100,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "noColumns": 2,
                    "labelBoxBorderColor": "red"
                }
            };

            //返回按钮
            $scope.return = {
                "id": "return",
                "text": $scope.i18n.common_term_return_button,
                "disable": false,
                "click": function () {
                    $state.go($stateParams.from);
                }
            };

            $scope.deleteBtn = {
                "id": "deleteBtnId",
                "text": $scope.i18n.common_term_delete_button,
                "click": function () {
                    var deleteMsg = new Message({
                        "type": "confirm",
                        "title": $scope.i18n.common_term_confirm_label || "确认删除",
                        "content": $scope.i18n.cloud_pool_del_info_confirm_msg || "删除云资源池后，将无法再管理和使用该资源池中的所有资源，确实要删除吗？",
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button || '确定',
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button || '取消',
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    deleteMsg.setButton("okBtn", function () {
                        deleteMsg.destroy();
                        $scope.operator.delete(deleteMsg);
                    });
                    deleteMsg.setButton("cancelBtn", function () {
                        deleteMsg.destroy();
                    });
                    deleteMsg.show();
                }
            };

            $scope.stopBtn = {
                "id": "stopBtnId",
                "text": $scope.i18n.common_term_pause_button,
                "click": function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.vm_pool_pauseUse_info_confirm_msg || "你确认要暂停使用该资源池吗？",
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button || '确定',
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button || '取消',
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        msg.destroy();
                        $scope.operator.operatorCloudInfras("inactivate");
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                }
            };

            $scope.restoreBtn = {
                "id": "restoreBtnId",
                "text": $scope.i18n.common_term_resum_button,
                "click": function () {
                    var msg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.cloud_pool_desterilize_info_confirm_msg || "你确认要恢复使用该资源池吗？",
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button || '确定',
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button || '取消',
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    msg.setButton("okBtn", function () {
                        msg.destroy();
                        $scope.operator.operatorCloudInfras("activate");
                    });
                    msg.setButton("cancelBtn", function () {
                        msg.destroy();
                    });
                    msg.show();
                }
            };

            $scope.editBtn = {
                "id": "editBtnId",
                "text": $scope.i18n.common_term_modify_button,
                "click": function () {
                    var modifyMsg = new Message({
                        "type": "confirm",
                        "content": $scope.i18n.cloud_pool_modifyConnectPara_info_confirm_msg || "修改资源池接入信息可能导致数据变更，并造成资源池不可用。您确定要修改吗？",
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button || '确定',
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button || '取消',
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    modifyMsg.setButton("okBtn", function () {
                        $scope.operator.modifyMsg();
                        modifyMsg.destroy();
                    });
                    modifyMsg.setButton("cancelBtn", function () {
                        modifyMsg.destroy();
                    });
                    modifyMsg.show();
                }
            };
            $scope.operator = {
                "delete": function (deleteMsg) {
                    var deferred = camel["delete"]({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}",
                            "o": {
                                "tenant_id": "1",
                                "id": infraId
                            }
                        },
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            deleteMsg.destroy();
                            $state.go($stateParams.from);
                        });
                    });

                    deferred.fail(function (data) {
                        $scope.$apply(function () {
                            exceptionService.doException(data);
                        });
                    });
                },
                "operatorCloudInfras": function (action) {
                    var params = {};
                    if (action === "activate") {
                        params.activate = action;
                    }
                    else if (action === "inactivate") {
                        params.inactivate = action;
                    }

                    var deferred = camel.post({
                        "url": {
                            "s": "/goku/rest/v1.5/{tenant_id}/cloud-infras/{id}/action",
                            "o": {
                                "tenant_id": "1",
                                "id": infraId
                            }
                        },
                        "params": JSON.stringify(params),
                        "userId": user.id
                    });
                    deferred.success(function (response) {
                        $scope.$apply(function () {
                            getDetail();
                        });
                    });

                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
                "modifyMsg": function () {
                    var modifyInfraWindow = new Window({
                        "winId": "modifyInfraWindowId",
                        "infraId": infraId,
                        "infraType": $scope.basicInfo.type.value,
                        "title": $scope.i18n.common_term_modify_button,
                        "content-type": "url",
                        "content": "app/business/multiPool/views/fusionCasecade/modifyCloudInfra.html",
                        "height": 600,
                        "width": 800,
                        "buttons": [
                            null,
                            null
                        ],
                        "close": function (event) {
                        }
                    }).show();
                }
            };

            function getDetail() {
                var defe = camel.get({
                    "url": {s: "/goku/rest/v1.5/1/cloud-infras/{id}", o: {id: infraId}},
                    "userId": user.id
                });
                defe.done(function (response) {
                        $scope.$apply(function () {
                            var data = response.cloudInfra;
                            $scope.basicInfo.name.value = data.name;
                            $scope.basicInfo.id.value = data.id;
                            $scope.basicInfo.connectStatus.value = CONNECT_STATUS[data.connectStatus];
                            $scope.basicInfo.serviceStatus.value = SERVICE_STATUS[data.serviceStatus];

                            var newType = '';
                            if ("fusionmanager" === data.type) {
                                newType = "FusionManager";
                            }
                            else if ("openstack" === data.type) {
                                newType = "OpenStack";
                            }
                            else {
                                newType = data.type;
                            }
                            $scope.basicInfo.type.value = newType;

                            var newVersion = '';
                            if ("fusionmanager" === data.type && data.version === "1.5.0") {
                                newVersion = "V100R005C00";
                            }
                            else if ("openstack" === data.type && data.version === "havana") {
                                newVersion = "Havana";
                            }
                            else {
                                newVersion = data.version;
                            }
                            $scope.basicInfo.version.value = newVersion;

                            $scope.basicInfo.provider.value = data.provider;
                            $scope.basicInfo.ip.value = data.ip;
                            $scope.basicInfo.userName.value = data.userName;
                            if (data.createTime !== null && data.createTime !== '') {
                                $scope.basicInfo.createTime.value = timeService.utcToLocal(monitorService.getTime(data.createTime));
                            }
                            if (data.modifyTime !== null && data.modifyTime !== '') {
                                $scope.basicInfo.modifyTime.value = timeService.utcToLocal(monitorService.getTime(data.modifyTime));
                            }
                            if (data.connectFailedTime !== null && data.connectFailedTime !== '') {
                                $scope.basicInfo.connectFailedTime.value = timeService.utcToLocal(monitorService.getTime(data.connectFailedTime));
                            }
                            $scope.basicInfo.description.value = data.description;

							$("#defDiv").find("ul").remove();
                            for (var key in data.metadata) {
                                var value = data.metadata[key];
                                $("#defDiv").append('<ul>' +  $.encoder.encodeForHTML(key) + ' : ' +  $.encoder.encodeForHTML(value) + '</ul>');
                            }
                            var isPause = (data.serviceStatus === "pause" ? true : false);
                            $("#" + $scope.restoreBtn.id).widget().option("disable", !isPause);

                            var isNormal = (data.serviceStatus === "normal" ? true : false);
                            $("#" + $scope.stopBtn.id).widget().option("disable", !isNormal);
                        });
                    }

                )
                ;
                defe.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function initChartData() {
                getAzUsed('occupied', function (used) {
                    getAzUsed('free', function (unUsed) {
                        refrshChart(used, unUsed);
                    });
                });
            }

            function refrshChart(used, unUsed) {
                var allAZNum = used + unUsed;
                var azData = [
                    {
                        value: used,
                        name: $scope.i18n.common_term_used_value,
                        color: "#5ecc49",
                        tooltip:  $scope.i18n.common_term_used_value
                    },
                    {
                        value: unUsed,
                        name: $scope.i18n.common_term_noUse_value,
                        color: "#ffa235",
                        tooltip: $scope.i18n.common_term_noUse_value
                    }
                ];
                //圆环图
                $scope.$apply(function () {
                    $scope.allAZNum = allAZNum;
                    if (allAZNum !== 0) {
                        var options = {
                            "id": "chartDivId",
                            "centerText": "",
                            "percent": false,
                            "r": 80,
                            "data": azData
                        };
                        var c = new CirqueChart(options);
                    }
                });
            }

            function getAzUsed(type, callback) {
                var defe = camel.get({
                    "url": {s: "/goku/rest/v1.5/1/available-zones?detail=false&manage-status={status}&cloud-infra={infra}", o: {status: type, infra: infraId}},
                    "userId": user.id
                });
                defe.done(function (response) {
					var freeTotal = 0;
					if (response && response.availableZones) {
						for (var i = 0; i < response.availableZones.length; i++) {
							if (response.availableZones[i].serviceStatus != "normal") {
								continue;
							}
							freeTotal++;
						}
					}
                    callback(freeTotal);
                });
                defe.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            $scope.configSpec = {
                "selCpuCount": 4,
                "selMemorySize": 8,
                "specDetailStr": "4*CPU, 8G" + $scope.i18n.common_term_memory_label,
                "unUsedVm": 0,
                "usedVm": 0,
                "show": false,
                "toggleShowSpec": function () {
                    $scope.configSpec.show = !$scope.configSpec.show;
                },
                "okBtn": {
                    "id": "homeChooseCpuMemoryOk",
                    "text": $scope.i18n.common_term_ok_button || "确定",
                    "click": function () {
                        if (!UnifyValid.FormValid($(".homeConfigCpuMemoryDiv"))) {
                            return;
                        }
                        var cpuInput = $("#" + $scope.cpuCount.id).widget().getValue();
                        $scope.configSpec.selCpuCount = parseInt(cpuInput, 10);
                        var memInput = $("#" + $scope.memorySize.id).widget().getValue();
                        $scope.configSpec.selMemorySize = parseInt(memInput, 10);
                        $scope.configSpec.specDetailStr = $scope.configSpec.selCpuCount + "*CPU, " + $scope.configSpec.selMemorySize + "G内存";
                        refreshVmCreated();
                        $scope.configSpec.toggleShowSpec();
                    }
                }
            };

            $scope.cpuCount = {
                "label": $scope.i18n.common_term_vcpuNum_label + ":",
                "id": "homeChooseCpuCount",
                "width": "100",
                "value": "20",
                "require": true,
                "tips": "1~64",
                "validate": "integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 64}) + ";maxValue(64):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 64})
            };

            $scope.memorySize = {
                "label": $scope.i18n.common_term_memoryGB_label + ":",
                "id": "homeChooseMemorySize",
                "width": "100",
                "value": "20",
                "require": true,
                "tips": "1~65536GB",
                "validate": "integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                    $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 65536}) + ";maxValue(65536):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 65536})
            };

            function getPercentageRate(num, total) {
                if (num === 0 || total === 0) {
                    return 0;
                }
                return Math.round(num / total * 100); //小数点后两位百分比
            }

            function refreshVmCreateStatistic(usedCount, unusedCount) {
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
                        text: "",
                        fontSize: 46,
                        color: "#5ECC49"
                    },
                    "data": [
                        {
                            "value": 0,
                            "name": $scope.i18n.common_term_created_value + ":",
                            color: "#5ECC49",
                            "tooltip": $scope.i18n.common_term_created_value + ":"
                        },
                        {
                            "value": 0,
                            "name": $scope.i18n.service_term_canCreate_label+":",
                            color: "#EAEAEA",
                            "tooltip": $scope.i18n.service_term_canCreate_label+":"
                        }
                    ]
                };
                var usedRate = 0;
                var unusedRate = 0;
                var total = usedCount + unusedCount;
                if (unusedCount < 0) {
                    unusedCount = $scope.i18n.common_term_notLimit_value || "无限制";
                    usedRate = 0;
                    unusedRate = 100;
                    total = "\u221E";
                }
                else {
                    if (total === 0) {
                        usedRate = 0;
                        unusedRate = 0;
                        return;
                    }
                    else {
                        usedRate = getPercentageRate(usedCount, total);
                        unusedRate = getPercentageRate(unusedCount, total);
                    }
                }

                options.centerText.text = "";
                options.data[0].value = $.encoder.encodeForHTML(usedRate);
                options.data[0].name += $.encoder.encodeForHTML(usedCount);
                options.data[0].tooltip += $.encoder.encodeForHTML(usedCount);
                options.data[1].value = $.encoder.encodeForHTML(unusedRate);
                options.data[1].name += $.encoder.encodeForHTML(unusedCount);
                options.data[1].tooltip += $.encoder.encodeForHTML(unusedCount);
                var vmChart = new CirqueChart(options);
            }

            function calculateAvailableVmBySpec(cpuUnused, memUnused, selCpuCount, selMemorySize) {
                var cpuMax = cpuUnused / selCpuCount;
                var memMax = memUnused / selMemorySize;
                var max = 0;
                if ((cpuMax < 0) || (memMax < 0)) {
                    return 0;
                }
                else {
                    var allMax = Math.min(cpuMax, memMax);
                    allMax = Math.floor(allMax);
                    return allMax;
                }
            }

            // 刷新虚拟机可创建个数圆环图
            function refreshVmCreated() {
                // 清掉原来的圆环图
                $("#tenantHomeVmCreationStatistic").empty();
                $scope.configSpec.usedVm = 0;
                $scope.configSpec.unUsedVm = 0;
                if (!$scope.openstack) {
                    queryITVmQuota();
                }
                else{
                    queryICTVmQuota();
                }
            }

            // 查询IT场景虚拟机配额相关信息
            function queryITVmQuota() {
                var deferred = $q.defer();
                var tmpPromise = deferred.promise;

                // 获取虚拟机统计信息
                if (!infraId) {
                    return;
                }
                var promise = homeService.getITVmStatistics(infraId);
                promise.then(function (data) {
                    if (!data) {
                        deferred.reject();
                    }
                    $scope.vmCreatedNum = data.runningVmQuantity + data.stoppedVmQuantity + data.others;
                    $scope.configSpec.usedVm = $scope.vmCreatedNum;
                    return deferred.resolve();
                });

                // 查询资源池容量信息
                tmpPromise.then(function () {
                    if (!infraId) {
                        return;
                    }
                    var azPromise = homeService.getItAzStatistics(infraId);
                    azPromise.then(function (data) {
                        if (!data || !data.availableZones) {
                        $scope.configSpec.unUsedVm = 0;
                            return;
                        }

                        var totalFreeCpu = 0, totalFreeMemory = 0;
                        var azs = data.availableZones;
                        for (var index in azs) {
                            var az = azs[index];
                            if(!az.statistics){
                                continue;
                            }
                            totalFreeCpu += az.statistics.vcpuFreeSize;
                            totalFreeMemory += az.statistics.memFreeSize;
                        }

                        var tmpUnUsedVm = calculateAvailableVmBySpec(totalFreeCpu, totalFreeMemory, $scope.configSpec.selCpuCount, $scope.configSpec.selMemorySize);
                        $scope.configSpec.unUsedVm = tmpUnUsedVm;

                        refreshVmCreateStatistic($scope.vmCreatedNum, tmpUnUsedVm);
                    });
                });
            }

            // 查询ICT场景虚拟机配额相关信息
            function queryICTVmQuota() {
                var deferred = $q.defer();
                var tmpPromise = deferred.promise;

                // 获取虚拟机列表
                if(!infraId){
                    return;
                }
                var promise = homeService.getICTVmStatistics([infraId]);
                promise.then(function (data) {
                    if (!data || !data.cloudVmStatistics) {
                        deferred.reject();
                    }

                    var statistics = data.cloudVmStatistics[0];
                    $scope.vmCreatedNum = statistics.runningVmQuantity + statistics.stoppedVmQuantity + statistics.others;
                    $scope.configSpec.usedVm = $scope.vmCreatedNum;
                    return deferred.resolve();
                });

                // 查询资源池容量信息
                tmpPromise.then(function () {
                    var azPromise = homeService.getCloudInfraStatistics([infraId]);
                    azPromise.then(function (data) {
                        if (!data || !data.cloudInfraCapacity || data.cloudInfraCapacity.length === 0 ) {
                            return;
                        }

                        var statistics = data.cloudInfraCapacity[0];
                        $scope.cpu = {};
                        $scope.cpu.unUsed = (statistics.cpuTotalSize || 0) - (statistics.cpuUsedSize || 0);
                        $scope.memory = {};
                        $scope.memory.unUsed = (statistics.memTotalSize || 0) - (statistics.memUsedSize || 0);

                        var tmpUnUsedVm = calculateAvailableVmBySpec($scope.cpu.unUsed, $scope.memory.unUsed, $scope.configSpec.selCpuCount, $scope.configSpec.selMemorySize);
                        $scope.configSpec.unUsedVm = tmpUnUsedVm;

                        refreshVmCreateStatistic($scope.vmCreatedNum, tmpUnUsedVm);
                    });
                });
            }

            getDetail();
            initChartData();
            refreshVmCreated();
        }];
        return summaryCtrl;
    });