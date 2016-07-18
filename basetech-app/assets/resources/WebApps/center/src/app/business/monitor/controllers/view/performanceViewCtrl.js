define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "app/services/exceptionService",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Columnchart",
    "tiny-directives/Columnchart",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/performanceFixture"
], function ($, angular, TextBox, Exception, Button, Window, Columnchart, _ColumnchartDirective) {
    "use strict";

    var performanceViewCtrl = ["$scope", "$q", "$state" ,"$compile", "camel", "$rootScope", "$interval",
        function ($scope, $q, $state, $compile, camel, $rootScope, $interval) {
			$scope.cloudType = $rootScope.user.cloudType;
            $scope.isICT = $scope.cloudType == 'OPENSTACK';
            $scope.dataHold = "";
            $scope.novaId = {};
            var exceptionService = new Exception();
            var i18n = $scope.i18n;
            var performanceSelObjValues = function () {
				var performanceSelObjValues = [];
				if($scope.cloudType != 'OPENSTACK'){
					var clusterItem = {
						"selectId": "cluster",
						"label":  $scope.i18n.virtual_term_cluster_label || "资源集群",
						"checked": true
					};
					performanceSelObjValues.push(clusterItem);
				}
				var hostItem = {
					"selectId": "host",
					"checked": $scope.cloudType == 'OPENSTACK',
					"label": $scope.i18n.common_term_host_label || "主机"
				};
				performanceSelObjValues.push(hostItem);

				var vmItem = {
					"selectId": "vm",
					"label": $scope.i18n.common_term_vm_label || "虚拟机"
				};
				performanceSelObjValues.push(vmItem);
                return performanceSelObjValues;
            };

			//地域下拉框
			$scope.address = {
				"id": "performanceAddress",
				"width": "150",
				"values": [],
				"change": function () {
				}
			};

            //对象类型下拉框
            $scope.performanceSelObj = {
                "id": "performanceSelObj",
                "width": "100",
                "values": performanceSelObjValues(),
                "change": function () {
                }
            };

            var performanceTopTypeValues = function () {
                var performanceTopTypeValues = [{
                    "selectId": "max",
                    "label": $scope.i18n.common_term_Highest_label || "最高",
                    "checked": true
                }, {
                    "selectId": "min",
                    "label": $scope.i18n.common_term_lowest_label || "最低"
                }];
                return performanceTopTypeValues;
            };

            //top类型下拉框
            $scope.performanceTopType = {
                "id": "performanceTopType",
                "width": "100",
                "values": performanceTopTypeValues(),
                "change": function () {
                }
            };

            var performanceTypeValues = function () {
                var performanceTypeValues = [
                    {
                        "selectId": "1",
                        "label": "TOP 1"
                    },
                    {
                        "selectId": "2",
                        "label": "TOP 2"
                    },
                    {
                        "selectId": "3",
                        "label": "TOP 3"
                    },
                    {
                        "selectId": "4",
                        "label": "TOP 4"
                    },
                    {
                        "selectId": "5",
                        "label": "TOP 5",
                        "checked": true
                    },
                    {
                        "selectId": "6",
                        "label": "TOP 6"
                    },
                    {
                        "selectId": "7",
                        "label": "TOP 7"
                    },
                    {
                        "selectId": "8",
                        "label": "TOP 8"
                    },
                    {
                        "selectId": "9",
                        "label": "TOP 9"
                    },
                    {
                        "selectId": "10",
                        "label": "TOP 10"
                    }
                ];
                return performanceTypeValues;
            };
            //top类型下拉框
            $scope.performanceType = {
                "id": "performanceType",
                "width": "100",
                "values": performanceTypeValues(),
                "change": function () {
                }
            };

            var clusterMetrics = ["cpu_usage", "cpu_reserve", "mem_usage", "mem_reserve", "storage_allocation", "storage_usage"];
            var hostvmMetrics = ["cpu_usage", "mem_usage", "nic_byte_in", "nic_byte_out", "disk_io_in", "disk_io_out", "disk_usage"];
            //创建查询按钮
            $scope.searchBtn = {
                "id": "performance-serach",
                "text":  $scope.i18n.common_term_query_button || "查询",
                "click": function () {
                    var selectType = $("#performanceSelObj").widget().getSelectedId();
                    $scope.hostvmDisable = false;
                    $scope.clusterDisable = false;
                    if (selectType == 'vm' || selectType == 'host') {
                        $scope.hostvmDisable = true;
                    } else if (selectType == 'cluster') {
                        $scope.clusterDisable = true;
                    }
                    $scope.operator.getMonitor();
                }
            };

            $scope.charCollection = [];

            function getCharObject(type, metrics, series) {
                var chartId = type + "_" + metrics + "_chart";
                var isNew = true;
                try {
                    $("#" + chartId).find("div").remove();
                    if (isNew) {
                        var obj = {};
                        var cc = new Columnchart({
                            id: chartId,
                            width: "500px",
                            isFill: true,
                            style: "bold",
							maxNameLength:50,
                            values: series
                        });
                        obj.chart = cc;
                        obj.id = chartId;
                        $scope.charCollection.push(obj);
                    }
                } catch (e) {}
            }
            $scope.operator = {
                "intervalGet": function () {
                    //每隔1分钟刷新一次
                    $scope.promiseTime = $interval(function () {
                        var tt = $("#performanceSelObj").widget().getSelectedId();
                        $scope.hostvmDisable = false;
                        $scope.clusterDisable = false;
                        if (tt == 'vm' || tt == 'host') {
                            $scope.hostvmDisable = true;
                        } else if (tt == 'cluster') {
                            $scope.clusterDisable = true;
                        }
                        $scope.operator.getMonitor();
                    }, 60000);
                },
                "kakaInitParams": function () {
                    var params = {};
                    params.objectType = $("#" + $scope.performanceSelObj.id).widget().getSelectedId();
                    if (params.objectType == "cluster") {
                        params.metrics = clusterMetrics;
                    } else {
                        params.metrics = hostvmMetrics;
                    }
                    params.topnType = $("#performanceTopType").widget().getSelectedId();
                    params.topN = $("#performanceType").widget().getSelectedId();
                    return params;
                },
                "init": function () {
                    var params = {};
					params.topnType = "max";
					params.topN = "5";
					if($scope.cloudType === 'OPENSTACK'){
						params.objectType = "host";
						params.metrics = hostvmMetrics;
						//初始化查询openstack实例
						var req = camel.get({
							"url":"/goku/rest/v1.5/openstack/endpoint",
							"userId": $("html").scope().user.id,
							"autoRequest": true
						});
						req.done(function (data) {
							var endPoint = data && data.endpoint || [];
							var regions = [];
							var firstRegion = null;
							for (var i = 0; i < endPoint.length; i++) {
								if (endPoint[i].serviceName === "ceilometer") {
									var region = {
										selectId: endPoint[i].id,
										label: endPoint[i].regionName
									};
									regions.push(region);
								}
                                else if(endPoint[i].serviceName === "nova")
                                {
                                    $scope.novaId[endPoint[i].regionName] = endPoint[i].id;
                                }
							}
							if(regions.length > 0){
								regions[0].checked = true;
								firstRegion = regions[0].label;
							}

							$scope.$apply(function () {
								$scope.address.values = regions;
							});
							$scope.operator.getMonitor(params, firstRegion);
						});
					}else{
						params.objectType = "cluster";
						params.metrics = clusterMetrics;
						$scope.operator.getMonitor(params);
					}
                },
                "getMonitor": function (paramsStr,region) {
                    if (paramsStr == null) {
                        paramsStr = $scope.operator.kakaInitParams();
						if($scope.cloudType === 'OPENSTACK'){
							region = $("#performanceAddress").widget().getSelectedLabel()
						}
                    }
					var url = "/goku/rest/v1.5/irm/1/monitors";
					if($scope.cloudType === 'OPENSTACK'){
						url = "/goku/rest/v1.5/irm/1/monitors?cloud-infras=" + region;
					}
                    var defe = camel.post({
                        "url": url,
                        "params": JSON.stringify(paramsStr),
						"autoRequest": true,
						"userId": $("html").scope().user.id
                    });
                    defe.done(function (response) {
                        $scope.$apply(function () {
                            var monitorTopnMap = response.monitorTopnMap;
                            var select = $("#performanceSelObj").widget().getSelectedId();
                            //集群的
                            if ($scope.clusterDisable) {
                                for (var inx in clusterMetrics) {
                                    var aa = clusterMetrics[inx];
                                    var meObj = monitorTopnMap[aa];
                                    var arr = [];
                                    for (var inxx in meObj) {
										var vv = precision2(meObj[inxx].indexValue);
										if(aa != "storage_allocation" && aa != "storage_usage"){
											vv = precision2(meObj[inxx].indexValue,true);
										}

                                        var ar = {
                                            textValue: $.encoder.encodeForHTML(vv) + "%", //显示的title文本
                                            name: $.encoder.encodeForHTML(meObj[inxx].objectName), //label
                                            value: vv, //当前值
                                            initValue: 0,
                                            maxValue: 100,
                                            color: "#5ecc49" //进度条颜色
                                        }
                                        if ('cluster' == select) {
                                            var objectId = meObj[inxx].objectId;
                                            var clusterName = meObj[inxx].objectName;
                                            var from = $state.current.name;
                                            var clusterId = objectId.substring(0,objectId.lastIndexOf("$"));
                                            var indexId = objectId.substring(objectId.lastIndexOf("$")+1,objectId.length);
                                            var hyperId = objectId.substring(0,objectId.indexOf("$"));

                                            ar.name = "<a href='#/resources/clusterInfo/summary?clusterName="
                                                +encodeURIComponent(clusterName)+"&from="+encodeURIComponent(from)
                                                +"&clusterId="+encodeURIComponent(clusterId)+"&indexId="
                                                +encodeURIComponent(indexId)+"&hyperId="+encodeURIComponent(hyperId)
                                                +"'>"+clusterName+"</a>";
                                        }
                                        arr.push(ar);
                                    }
                                    var series = {
                                        series: arr
                                    };
                                    //type, metrics, series
                                    getCharObject("cluster", clusterMetrics[inx], series)
                                }
                            } else {
                                for (var inx in hostvmMetrics) {
                                    var aa = hostvmMetrics[inx];
                                    var meObj = monitorTopnMap[aa];
                                    var arr = [];

									var suffix = "%";
									var maxValue = 100;
									if (aa != "cpu_usage" && aa != "mem_usage" && aa != "disk_usage") {
										suffix = "KB/S";
										maxValue = getMaxValue(meObj);
									}

									for (var inxx in meObj) {
										var vv = precision2(meObj[inxx].indexValue,true);
										if (aa != "cpu_usage" && aa != "mem_usage" && aa != "disk_usage") {
											vv = precision2(meObj[inxx].indexValue);
										}
                                        var objectId = meObj[inxx].objectId;
                                        var objectName = meObj[inxx].objectName;
										var ar = {
											textValue: $.encoder.encodeForHTML(vv) + $.encoder.encodeForHTML(suffix), //显示的title文本
											name: $.encoder.encodeForHTML(objectName), //label
											value: vv, //当前值
											initValue: 0,
											maxValue: maxValue,
											color: "#5ecc49" //进度条颜色
										}
                                        if('vm' == select)
                                        {
                                            if($scope.isICT)
                                            {
                                                var vmId = objectId;
                                                var vmName = objectName;
                                                var region = $("#performanceAddress").widget().getSelectedLabel();
                                                var novaId = $scope.novaId[region];
                                                //tenantId后台不支持
                                                var tenantId = false;
                                                ar.name = "<a href='#/vdcMgr/serverInfo/summary?vmId="
                                                    +encodeURIComponent(vmId)+"&vmName="+encodeURIComponent(vmName)
                                                    +"&novaId="+encodeURIComponent(novaId)+"&region="+encodeURIComponent(region)
                                                    +"&tenantId="+encodeURIComponent(tenantId)
                                                    +"'>"+objectName+"</a>";
                                            }
                                            else
                                            {
                                                var name = objectName;
                                                var from = $state.current.name;
                                                var vmId = objectId;
                                                //isVsa、vmType后台不支持
                                                var isVsa = "false";
                                                var vmType = "fusioncompute";
                                                ar.name = "<a href='#/resources/vmInfo/summary?name="
                                                    +encodeURIComponent(name)+"&from="+encodeURIComponent(from)
                                                    +"&vmId="+encodeURIComponent(vmId)+"&isVsa="+encodeURIComponent(isVsa)
                                                    +"&vmType="+encodeURIComponent(vmType)+"'>"+name+"</a>";
                                            }
                                        }
                                        else if('host' == select)
                                        {
                                            if($scope.isICT)
                                            {
                                                var region = region = $("#performanceAddress").widget().getSelectedLabel();
                                                var hostId = objectId;
                                                ar.name = "<a href='#/resources/ictHostDetail/summary?region="
                                                    +encodeURIComponent(region)+"&hostId="+encodeURIComponent(hostId)
                                                    +"'>"+objectName+"</a>";
                                            }
                                            else
                                            {
                                                var hostId = objectId;
                                                var type = select;
                                                var name = objectName;
                                                ar.name = "<a href='#/resources/hostDetail/summary?hostId="
                                                    +encodeURIComponent(hostId)+"&type="+encodeURIComponent(type)
                                                    +"&name="+encodeURIComponent(name)+"'>"+name+"</a>";
                                            }
                                        }
										arr.push(ar);
									}

                                    var series = {
                                        series: arr
                                    };
                                    getCharObject("host_vm", hostvmMetrics[inx], series)
                                }
                            }
                        });
                    });
                }
            };

			function getMaxValue(meObj){
				var max = 0.00;
				for (var inxx in meObj) {
					var vv = precision2(meObj[inxx].indexValue);
					max = Math.max(vv,max);
				}
				return max;
			};
			//isPercent 是否处理百分比超过100，还是现实100
			function precision2(numberStr,isPercent) {
				var number = 0;
				try {
					number = new Number(numberStr);
					if(isPercent && number > 100){
						number = 100.00;
					}
				} catch (error) {
				}
				return number.toFixed(2);
			};

            /**
             * 清除定时器
             */
            $scope.clearTimer = function () {
                try {
                    $interval.cancel($scope.promiseTime);
                } catch (e) {}
            };
            $scope.clusterDisable = ($scope.cloudType != 'OPENSTACK');
            $scope.hostvmDisable = ($scope.cloudType == 'OPENSTACK');
            $scope.operator.init();
            $scope.operator.intervalGet();

            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }
    ];
    return performanceViewCtrl;
});
