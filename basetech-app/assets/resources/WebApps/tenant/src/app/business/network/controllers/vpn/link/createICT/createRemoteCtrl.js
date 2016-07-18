define([
    "tiny-lib/jquery",
    "tiny-lib/underscore",
    "app/business/network/services/vlb/vlbService",
    "app/business/network/services/router/routerService",
    "tiny-widgets/Checkbox",
    "tiny-common/UnifyValid",
    "app/services/validatorService"],
    function ($, _, vlbService, RouterService, Checkbox, UnifyValid, validatorService) {
	"use strict";
	var ctrl = ["$scope", "camel", "$compile", "$q", "exception", function ($scope, camel, $compile, $q, exception) {
			var i18n = $scope.i18n;
			var user = $scope.user;
			var isIT = user.cloudType === "IT";
			$scope.isIT = isIT;
			var validator = new validatorService();
			var routerServiceIns = new RouterService(exception, $q, camel);
			var vlbServiceInst = new vlbService(exception, $q, camel);
			var tips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 480, 86400);
			$scope.selectedRouterIds = [];
			$scope.$watch("service.routerId", function (newV, oldV) {
				if (newV) {
					queryNetwoks()
				}
			});
			$scope.info = {
				localTable : {
					"label" : i18n.vpn_term_localUserNet_label + ":",
					"require" : true,
					"id" : "create-vpn-link-local-listtable",
					"columns" : [{
							"sTitle" : "",
							"mData" : "showDetail",
							"bSearchable" : false,
							"bSortable" : false,
							"sWidth" : "30"
						}, {
							"sTitle" : i18n.common_term_name_label,
							"mData" : function (data) {
								return $.encoder.encodeForHTML(data.name)
							},
							"bSortable" : false
						}, {
							"sTitle" : i18n.common_term_status_label,
							"mData" : function (data) {
								return $.encoder.encodeForHTML(data.statusUI)
							},
							"bSortable" : false
						}, {
							"sTitle" : "VLAN ID",
							"mData" : function (data) {
								return $.encoder.encodeForHTML(data.vlan)
							},
							"bSortable" : false
						}, {
							"sTitle" : i18n.common_term_desc_label,
							"mData" : function (data) {
								return $.encoder.encodeForHTML(data.description)
							},
							"bSortable" : false
						}
					],
					"data" : [],
					"renderRow" : function (nRow, aData, iDataIndex) {
						var selBox = "";
                        selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>"
						var selBoxLink = $compile(selBox);
						var selBoxScope = $scope.$new();
						selBoxScope.data = aData;
						selBoxScope.id = "localNetRouterId" + iDataIndex;
						selBoxScope.checked = aData.checked;
						selBoxScope.change = function () {
							var id = aData.networkID;
							selectRouter(id, $("#" + selBoxScope.id).widget().option("checked"))
						};
						var selBoxNode = selBoxLink(selBoxScope);
						$("td:eq(0)", nRow).append(selBoxNode)
					}
				},
				gatewayIP : {
					"id" : "create-vpn-link-gatewayIP",
					label : i18n.vpn_term_remoteGatewayIP_label + ":",
					require : true,
					"extendFunction" : ["IPv4Check"],
					validate : "required:" + i18n.common_term_null_valid + ";IPv4Check():" + i18n.common_term_formatIP_valid,
					value : "",
					type : "ipv4"
				},
				network : {
					"id" : "create-vpn-link-network",
					label : i18n.vpn_term_remoteNet_label + ":",
					"disable" : false,
					require : true,
					"text" : i18n.common_term_add_button,
					"click" : function () {
						var subnetNum = $scope.service.customerGw.customerSubnets.length;
						if (subnetNum >= 5) {
							return
						}
						$scope.service.customerGw.customerSubnets.push({
							"subnetAddr" : "",
							"subnetMask" : "",
							"subnetAddrId" : "subnetAddr" + $scope.service.totalSubnetNum,
							"subnetMaskId" : "subnetMask" + $scope.service.totalSubnetNum
						});
						$scope.service.totalSubnetNum += 1;
						if ($scope.service.customerGw.customerSubnets.length >= 5) {
							$scope.info.network.disable = true;
							return
						}
					}
				},
				preBtn : {
					"id" : "create-vpn-link-remote-pre",
					"text" : i18n.common_term_back_button,
					"click" : function () {
						$scope.service.show = "basic";
						$("#" + $scope.service.step.id).widget().pre()
					}
				},
				cancelBtn : {
					"id" : "create-vpn-link-remote-cancel",
					"text" : i18n.common_term_cancle_button,
					"click" : function () {
						setTimeout(function () {
							window.history.back()
						}, 0)
					}
				}
			};
			if (isIT) {
				_.extend($scope.info, {
					dnAlgorithm : {
						"id" : "link-dnAlgorithm-select",
						"label" : i18n.vpn_term_DH_label + ":",
						"width" : "220",
						"require" : true,
						"values" : [{
								"selectId" : "DH2",
								"label" : "DH2",
								"checked" : $scope.service.pfsGroup === "DH2"
							}, {
								"selectId" : "DH5",
								"label" : "DH5",
								"checked" : $scope.service.pfsGroup === "DH5"
							}
						]
					},
					lifeTime : {
						"id" : "link-cycle-textbox",
						"label" : i18n.vpn_term_consultationPeriodS_label + ":",
						"validate" : "integer:" + tips + ";minValue(480):" + tips + ";maxValue(86400):" + tips,
						"value" : "3600"
					},
					nextBtn : {
						"id" : "create-vpn-link-remote-next",
						"text" : i18n.common_term_next_button,
						"disable" : $scope.service.networkIDs.length <= 0,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#createVpnLinkRemoteDiv"));
							if (!valid) {
								return
							}
							$scope.service.pfsGroup = $("#link-dnAlgorithm-select").widget().getSelectedLabel();
							$scope.service.lifeTime = $("#link-cycle-textbox").widget().getValue();
							$scope.service.customerGw.ipAddr = $("#create-vpn-link-gatewayIP").widget().getValue();
							var subnets = [];
							for (var i = 0; i < $scope.service.totalSubnetNum; i++) {
								if ($("#subnetAddr" + i) && $("#subnetAddr" + i).widget() && $("#subnetMask" + i) && $("#subnetMask" + i).widget()) {
									subnets.push({
										"subnetAddr" : $("#subnetAddr" + i).widget().getValue(),
										"subnetMask" : $("#subnetMask" + i).widget().getValue(),
										"subnetAddrId" : "subnetAddr" + i,
										"subnetMaskId" : "subnetMask" + i
									})
								}
							}
							$scope.service.customerGw.customerSubnets = subnets;
							$scope.service.show = "ike";
							$("#" + $scope.service.step.id).widget().next()
						}
					}
				})
			} else {
				_.extend($scope.info, {
					router : {
						"label" : i18n.router_term_router_label + ":",
						"require" : true,
						"layout" : "vertical",
						"width" : "300px",
						"id" : "create-vpn-link-remote-router",
						"validate" : "required:" + i18n.common_term_null_valid,
						"value" : [],
						"change" : function () {
							var routerId = $("#create-vpn-link-remote-router").widget().getSelectedId();
							$scope.service.routerId = routerId
						}
					},
					nextBtn : {
						"id" : "create-vpn-link-remote-next",
						"text" : i18n.common_term_next_button,
						"disable" : $scope.service.networkIDs.length <= 0,
						"click" : function () {
							var valid = UnifyValid.FormValid($("#createVpnLinkRemoteDiv"));
							if (!valid) {
								return
							}
							$scope.service.customerGw.ipAddr = $("#create-vpn-link-gatewayIP").widget().getValue();
							var subnets = [];
							for (var i = 0; i < $scope.service.totalSubnetNum; i++) {
								if ($("#subnetAddr" + i) && $("#subnetAddr" + i).widget() && $("#subnetMask" + i) && $("#subnetMask" + i).widget()) {
									subnets.push({
										"subnetAddr" : $("#subnetAddr" + i).widget().getValue(),
										"subnetMask" : $("#subnetMask" + i).widget().getValue(),
										"subnetAddrId" : "subnetAddr" + i,
										"subnetMaskId" : "subnetMask" + i
									})
								}
							}
							$scope.service.customerGw.customerSubnets = subnets;
							$scope.service.show = "ike";
							$("#" + $scope.service.step.id).widget().next()
						}
					}
				})
			}
			var tblHeadCheckbox = new Checkbox({
					"id" : "localTableHeadCheckbox",
					"checked" : false,
					"change" : function () {
						var routes = $scope.info.localTable.data;
						var isChecked = $("#localTableHeadCheckbox").widget().option("checked");
						for (var i = 0; i < routes.length; i++) {
							$("#localNetRouterId" + i).widget().option("checked", isChecked)
						}
						$scope.$apply(function () {
							$scope.service.networkIDs = [];
							if (isChecked && routes) {
								_.each(routes, function (item) {
									if (isIT) {
										$scope.service.networkIDs.push(item.networkID)
									} else {
										if (item.ipv4Subnet) {
											$scope.service.networkIDs.push(item.ipv4Subnet.subnetID)
										}
									}
								})
							}
						})
					}
				});
			function selectRouter(routerId, checked) {
				var selected = $scope.service.networkIDs;
				if (checked) {
                    selected.push(routerId);
				} else {
					for (var i = 0; i < selected.length; i++) {
						if (selected[i] === routerId) {
							selected.splice(i, 1)
						}
					}
				}
				var headCheck = $("#localTableHeadCheckbox").widget();
				if (!!headCheck) {
					if (selected.length < $("#create-vpn-link-local-listtable").widget().options.data.length) {
						headCheck.option("checked", false)
					} else {
						headCheck.option("checked", true)
					}
				}
			}
			$scope.click = function () {
				if ($("#subnetInfoDiv").css("display") === "none") {
					$("#subnetInfoDiv").css("display", "block");
					$("#linkImg").attr("src", "../theme/default/images/expand.png")
				} else {
					$("#subnetInfoDiv").css("display", "none");
					$("#linkImg").attr("src", "../theme/default/images/colspand.png")
				}
			};
			$scope["delete"] = function (delIndex) {
				$scope.service.customerGw.customerSubnets = _.reject($scope.service.customerGw.customerSubnets, function (item, index) {
						return index === delIndex
					});
				if ($scope.service.customerGw.customerSubnets.length < 5) {
					$scope.info.network.disable = false
				}
			};
			$scope.$on($scope.events.ipSecBasicNextFromParent, function (event, msg) {
				if (isIT) {
					queryNetwoks()
				} else {
					queryRouters()
				}
			});
			function queryRouters() {
				var options = {
					"vdcId" : $scope.user.vdcId,
					"cloudInfraId" : $scope.service.cloudInfraId,
					"vpcId" : $scope.service.vpcId,
					"userId" : $scope.user.id
				};
				var getCheckedItem = function (routerId, index) {
					if ($scope.service.isModifyMode) {
						return $scope.service.routerId === routerId
					} else {
						return index === 0
					}
				};
				var deferred = routerServiceIns.queryRouter(options);
				deferred.then(function (data) {
					if (!data || !data.routers || data.routers.length <= 0) {
						return
					}
					var values = [];
					_.each(data.routers, function (item, index) {
						var router = {
							"selectId" : item.routerID,
							"label" : item.name,
							"checked" : getCheckedItem(item.routerID, index)
						};
						if (router.checked) {
							$scope.service.routerId = item.routerID
						}
						values.push(router)
					});
					$scope.info.router.value = values;
					if ($scope.service.isModifyMode) {
						queryNetwoks()
					}
				})
			}
			function queryNetwoks() {
				var promise = vlbServiceInst.queryVpcNets({
						"vdcId" : $scope.user.vdcId,
						"cloudInfraId" : $scope.service.cloudInfraId,
						"vpcId" : $scope.service.vpcId,
						"userId" : $scope.user.id,
						"start" : 0,
						"limit" : 100
					});
				promise.then(function (resolvedValue) {
					if (resolvedValue && resolvedValue.networks && resolvedValue.networks.length > 0) {
						var routeNets = [];
						_.each(resolvedValue.networks, function (item) {
							if (item.status === "READY") {
								_.extend(item, {
									"typeUI" : i18n.vpc_term_routerNet_label,
									"statusUI" : i18n.common_term_ready_value,
									"showDetail" : "",
									"checked" : false
								});
                                if ($scope.service.isModifyMode) {
                                    if (_.find($scope.service.networkIDs, function (networkId) {
                                        return networkId === item.networkID
                                    })) {
                                        item.checked = true
                                    }
                                }
								routeNets.push(item)
							}
						});
						$scope.info.localTable.data = routeNets;
						if ($scope.service.isModifyMode) {
							if (isIT) {
								$("#link-dnAlgorithm-select").widget().opChecked($scope.service.pfsGroup)
							}
						} else {
							$scope.service.networkIDs = []
						}
                        tblHeadCheckbox.option("checked", false);
                        $('#create-vpn-link-local-listtable th:eq(0)').html(tblHeadCheckbox.getDom())
					}
				})
			}
			UnifyValid.IPv4Check = function () {
				return validator.ipValidator($(this).val())
			}
		}
	];
	return ctrl
});
